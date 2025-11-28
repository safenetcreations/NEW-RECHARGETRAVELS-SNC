import {
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  addDoc,
  updateDoc,
  query,
  where,
  orderBy,
  limit,
  Timestamp
} from 'firebase/firestore';
import { db } from '@/lib/firebase';
import {
  CommissionSettings,
  DriverPaymentSettlement,
  DriverBatchOperation,
  PaymentStatus
} from '@/types/driver';

const SETTINGS_COLLECTION = 'settings';
const SETTLEMENTS_COLLECTION = 'driver_payment_settlements';
const BATCH_OPERATIONS_COLLECTION = 'driver_batch_operations';
const DRIVERS_COLLECTION = 'drivers';
const DRIVER_BOOKINGS_COLLECTION = 'driver_bookings';

const nowIso = () => new Date().toISOString();

// ==========================================
// DEFAULT COMMISSION SETTINGS
// ==========================================

export const DEFAULT_COMMISSION_SETTINGS: CommissionSettings = {
  platform_fee_fixed: 300,          // LKR 300 per booking
  commission_percentage: 10,        // 10% commission

  // Bonus rates
  completion_bonus_rate: 5,         // +5% for 100% on-time
  rating_bonus_rate: 3,             // +3% for 4.8+ stars
  batch_bonus_rate: 2,              // +2% for 10+ trips/month
  referral_bonus: 500,              // LKR 500 per referral

  // Thresholds
  rating_bonus_threshold: 4.8,
  batch_bonus_threshold: 10,

  // Payment settings
  min_payout_amount: 5000,          // Minimum LKR 5000 for payout
  payout_frequency: 'weekly',
  payout_hold_days: 3               // 3 days hold before payout
};

// ==========================================
// COMMISSION SETTINGS MANAGEMENT
// ==========================================

/**
 * Get commission settings
 */
export async function getCommissionSettings(): Promise<CommissionSettings> {
  try {
    const docRef = doc(db, SETTINGS_COLLECTION, 'commission_settings');
    const snap = await getDoc(docRef);

    if (snap.exists()) {
      return snap.data() as CommissionSettings;
    }

    // Initialize with defaults if not exists
    await setDoc(docRef, DEFAULT_COMMISSION_SETTINGS);
    return DEFAULT_COMMISSION_SETTINGS;
  } catch (error) {
    console.error('Error fetching commission settings:', error);
    return DEFAULT_COMMISSION_SETTINGS;
  }
}

/**
 * Update commission settings (admin only)
 */
export async function updateCommissionSettings(
  updates: Partial<CommissionSettings>
): Promise<void> {
  const docRef = doc(db, SETTINGS_COLLECTION, 'commission_settings');
  await updateDoc(docRef, {
    ...updates,
    updated_at: nowIso()
  });
}

// ==========================================
// COMMISSION CALCULATION
// ==========================================

interface CommissionCalculation {
  grossEarnings: number;
  platformFee: number;
  commissionAmount: number;
  completionBonus: number;
  ratingBonus: number;
  batchBonus: number;
  totalBonuses: number;
  totalDeductions: number;
  netEarnings: number;
}

/**
 * Calculate commission for a single trip
 */
export async function calculateTripCommission(
  tripAmount: number,
  settings?: CommissionSettings
): Promise<{ platformFee: number; commission: number; driverEarnings: number }> {
  const commissionSettings = settings || await getCommissionSettings();

  const platformFee = commissionSettings.platform_fee_fixed;
  const commission = (tripAmount * commissionSettings.commission_percentage) / 100;
  const driverEarnings = tripAmount - platformFee - commission;

  return {
    platformFee,
    commission,
    driverEarnings: Math.max(0, driverEarnings)
  };
}

/**
 * Calculate driver earnings for a period with bonuses
 */
export async function calculatePeriodEarnings(
  driverId: string,
  periodStart: string,
  periodEnd: string
): Promise<CommissionCalculation> {
  const settings = await getCommissionSettings();

  // Get driver data for bonus eligibility
  const driverRef = doc(db, DRIVERS_COLLECTION, driverId);
  const driverSnap = await getDoc(driverRef);
  const driver = driverSnap.exists() ? driverSnap.data() : null;

  // Get bookings for the period
  const bookingsQuery = query(
    collection(db, DRIVER_BOOKINGS_COLLECTION),
    where('driver_id', '==', driverId),
    where('booking_status', '==', 'completed'),
    where('completed_at', '>=', periodStart),
    where('completed_at', '<=', periodEnd)
  );

  const bookingsSnap = await getDocs(bookingsQuery);
  const completedTrips = bookingsSnap.docs.length;

  // Calculate gross earnings
  let grossEarnings = 0;
  bookingsSnap.docs.forEach(doc => {
    const data = doc.data();
    grossEarnings += data.final_price || data.quoted_price || 0;
  });

  // Calculate deductions
  const platformFee = completedTrips * settings.platform_fee_fixed;
  const commissionAmount = (grossEarnings * settings.commission_percentage) / 100;

  // Calculate bonuses
  let completionBonus = 0;
  let ratingBonus = 0;
  let batchBonus = 0;

  // Completion bonus (based on completion rate)
  if (driver?.completion_rate === 100) {
    completionBonus = (grossEarnings * settings.completion_bonus_rate) / 100;
  }

  // Rating bonus
  if ((driver?.average_rating || 0) >= settings.rating_bonus_threshold) {
    ratingBonus = (grossEarnings * settings.rating_bonus_rate) / 100;
  }

  // Batch bonus (10+ trips in month)
  if (completedTrips >= settings.batch_bonus_threshold) {
    batchBonus = (grossEarnings * settings.batch_bonus_rate) / 100;
  }

  const totalBonuses = completionBonus + ratingBonus + batchBonus;
  const totalDeductions = platformFee + commissionAmount;
  const netEarnings = grossEarnings - totalDeductions + totalBonuses;

  return {
    grossEarnings,
    platformFee,
    commissionAmount,
    completionBonus,
    ratingBonus,
    batchBonus,
    totalBonuses,
    totalDeductions,
    netEarnings: Math.max(0, netEarnings)
  };
}

// ==========================================
// PAYMENT SETTLEMENT MANAGEMENT
// ==========================================

/**
 * Create a new settlement record
 */
export async function createSettlement(
  driverId: string,
  periodStart: string,
  periodEnd: string
): Promise<DriverPaymentSettlement> {
  // Calculate earnings for the period
  const calculation = await calculatePeriodEarnings(driverId, periodStart, periodEnd);

  // Count trips
  const bookingsQuery = query(
    collection(db, DRIVER_BOOKINGS_COLLECTION),
    where('driver_id', '==', driverId),
    where('booking_status', '==', 'completed'),
    where('completed_at', '>=', periodStart),
    where('completed_at', '<=', periodEnd)
  );
  const bookingsSnap = await getDocs(bookingsQuery);

  // Generate settlement period identifier
  const startDate = new Date(periodStart);
  const weekNum = Math.ceil(startDate.getDate() / 7);
  const settlementPeriod = `${startDate.getFullYear()}-${String(startDate.getMonth() + 1).padStart(2, '0')}-W${weekNum}`;

  const settlement: Omit<DriverPaymentSettlement, 'id'> = {
    driver_id: driverId,
    settlement_period: settlementPeriod,
    period_start: periodStart,
    period_end: periodEnd,

    gross_earnings: calculation.grossEarnings,
    total_trips: bookingsSnap.docs.length,

    platform_fees: calculation.platformFee,
    commission_amount: calculation.commissionAmount,

    completion_bonus: calculation.completionBonus,
    rating_bonus: calculation.ratingBonus,
    batch_bonus: calculation.batchBonus,
    referral_bonus: 0,
    other_bonus: 0,
    total_bonuses: calculation.totalBonuses,

    net_payout: calculation.netEarnings,
    payment_status: 'pending',

    created_at: nowIso(),
    updated_at: nowIso()
  };

  const docRef = await addDoc(collection(db, SETTLEMENTS_COLLECTION), settlement);
  return { id: docRef.id, ...settlement };
}

/**
 * Get settlement by ID
 */
export async function getSettlement(settlementId: string): Promise<DriverPaymentSettlement | null> {
  const docRef = doc(db, SETTLEMENTS_COLLECTION, settlementId);
  const snap = await getDoc(docRef);
  if (!snap.exists()) return null;
  return { id: snap.id, ...snap.data() } as DriverPaymentSettlement;
}

/**
 * Get driver's settlement history
 */
export async function getDriverSettlements(
  driverId: string,
  limitCount = 12
): Promise<DriverPaymentSettlement[]> {
  const q = query(
    collection(db, SETTLEMENTS_COLLECTION),
    where('driver_id', '==', driverId),
    orderBy('period_start', 'desc'),
    limit(limitCount)
  );

  const snap = await getDocs(q);
  return snap.docs.map(d => ({ id: d.id, ...d.data() } as DriverPaymentSettlement));
}

/**
 * Get all pending settlements
 */
export async function getPendingSettlements(): Promise<DriverPaymentSettlement[]> {
  const q = query(
    collection(db, SETTLEMENTS_COLLECTION),
    where('payment_status', '==', 'pending'),
    orderBy('created_at', 'asc')
  );

  const snap = await getDocs(q);
  return snap.docs.map(d => ({ id: d.id, ...d.data() } as DriverPaymentSettlement));
}

/**
 * Update settlement status
 */
export async function updateSettlementStatus(
  settlementId: string,
  status: PaymentStatus,
  adminId?: string,
  paymentDetails?: {
    payment_method?: string;
    bank_reference?: string;
    payment_notes?: string;
  }
): Promise<void> {
  const updates: Record<string, unknown> = {
    payment_status: status,
    updated_at: nowIso()
  };

  if (status === 'completed') {
    updates.payment_date = nowIso();
    updates.approved_by = adminId;
    updates.approved_at = nowIso();
  }

  if (paymentDetails) {
    Object.assign(updates, paymentDetails);
  }

  await updateDoc(doc(db, SETTLEMENTS_COLLECTION, settlementId), updates);
}

/**
 * Process batch payouts
 */
export async function processBatchPayouts(
  settlementIds: string[],
  adminId: string,
  paymentMethod: string
): Promise<{ success: string[]; failed: string[] }> {
  const success: string[] = [];
  const failed: string[] = [];

  for (const settlementId of settlementIds) {
    try {
      await updateSettlementStatus(settlementId, 'completed', adminId, {
        payment_method: paymentMethod,
        bank_reference: `BATCH-${Date.now()}-${settlementId.slice(-6)}`
      });
      success.push(settlementId);
    } catch (error) {
      console.error(`Failed to process settlement ${settlementId}:`, error);
      failed.push(settlementId);
    }
  }

  return { success, failed };
}

// ==========================================
// ANALYTICS & REPORTING
// ==========================================

interface EarningsSummary {
  totalGrossEarnings: number;
  totalPlatformFees: number;
  totalCommissions: number;
  totalBonuses: number;
  totalNetPayouts: number;
  totalTrips: number;
  settlementsCount: number;
}

/**
 * Get driver earnings summary
 */
export async function getDriverEarningsSummary(
  driverId: string,
  year?: number
): Promise<EarningsSummary> {
  const currentYear = year || new Date().getFullYear();
  const startOfYear = `${currentYear}-01-01`;
  const endOfYear = `${currentYear}-12-31`;

  const q = query(
    collection(db, SETTLEMENTS_COLLECTION),
    where('driver_id', '==', driverId),
    where('period_start', '>=', startOfYear),
    where('period_end', '<=', endOfYear)
  );

  const snap = await getDocs(q);

  const summary: EarningsSummary = {
    totalGrossEarnings: 0,
    totalPlatformFees: 0,
    totalCommissions: 0,
    totalBonuses: 0,
    totalNetPayouts: 0,
    totalTrips: 0,
    settlementsCount: snap.docs.length
  };

  snap.docs.forEach(doc => {
    const data = doc.data() as DriverPaymentSettlement;
    summary.totalGrossEarnings += data.gross_earnings || 0;
    summary.totalPlatformFees += data.platform_fees || 0;
    summary.totalCommissions += data.commission_amount || 0;
    summary.totalBonuses += data.total_bonuses || 0;
    summary.totalNetPayouts += data.net_payout || 0;
    summary.totalTrips += data.total_trips || 0;
  });

  return summary;
}

/**
 * Get platform revenue summary (admin)
 */
export async function getPlatformRevenueSummary(
  periodStart: string,
  periodEnd: string
): Promise<{
  totalRevenue: number;
  platformFees: number;
  commissions: number;
  bonusesPaid: number;
  netRevenue: number;
  driversCount: number;
  settlementsCount: number;
}> {
  const q = query(
    collection(db, SETTLEMENTS_COLLECTION),
    where('period_start', '>=', periodStart),
    where('period_end', '<=', periodEnd)
  );

  const snap = await getDocs(q);
  const uniqueDrivers = new Set<string>();

  let platformFees = 0;
  let commissions = 0;
  let bonusesPaid = 0;

  snap.docs.forEach(doc => {
    const data = doc.data() as DriverPaymentSettlement;
    uniqueDrivers.add(data.driver_id);
    platformFees += data.platform_fees || 0;
    commissions += data.commission_amount || 0;
    bonusesPaid += data.total_bonuses || 0;
  });

  const totalRevenue = platformFees + commissions;
  const netRevenue = totalRevenue - bonusesPaid;

  return {
    totalRevenue,
    platformFees,
    commissions,
    bonusesPaid,
    netRevenue,
    driversCount: uniqueDrivers.size,
    settlementsCount: snap.docs.length
  };
}

/**
 * Generate monthly settlements for all active drivers
 */
export async function generateMonthlySettlements(
  year: number,
  month: number
): Promise<{ created: number; skipped: number; errors: string[] }> {
  const settings = await getCommissionSettings();
  const startDate = new Date(year, month - 1, 1);
  const endDate = new Date(year, month, 0);

  const periodStart = startDate.toISOString().split('T')[0];
  const periodEnd = endDate.toISOString().split('T')[0];

  // Get all verified drivers
  const driversQuery = query(
    collection(db, DRIVERS_COLLECTION),
    where('current_status', '==', 'verified')
  );
  const driversSnap = await getDocs(driversQuery);

  let created = 0;
  let skipped = 0;
  const errors: string[] = [];

  for (const driverDoc of driversSnap.docs) {
    try {
      const driverId = driverDoc.id;

      // Check if settlement already exists
      const existingQuery = query(
        collection(db, SETTLEMENTS_COLLECTION),
        where('driver_id', '==', driverId),
        where('period_start', '==', periodStart)
      );
      const existingSnap = await getDocs(existingQuery);

      if (!existingSnap.empty) {
        skipped++;
        continue;
      }

      // Calculate earnings
      const calculation = await calculatePeriodEarnings(driverId, periodStart, periodEnd);

      // Skip if no earnings or below minimum
      if (calculation.grossEarnings === 0) {
        skipped++;
        continue;
      }

      // Create settlement
      await createSettlement(driverId, periodStart, periodEnd);
      created++;
    } catch (error) {
      errors.push(`Driver ${driverDoc.id}: ${error}`);
    }
  }

  return { created, skipped, errors };
}

// ==========================================
// HELPER FUNCTIONS
// ==========================================

/**
 * Format currency amount
 */
export function formatCurrency(amount: number, currency = 'LKR'): string {
  return new Intl.NumberFormat('en-LK', {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(amount);
}

/**
 * Get payout status color
 */
export function getPayoutStatusColor(status: PaymentStatus): string {
  const colors: Record<PaymentStatus, string> = {
    pending: 'bg-yellow-100 text-yellow-800 border-yellow-200',
    processing: 'bg-blue-100 text-blue-800 border-blue-200',
    completed: 'bg-green-100 text-green-800 border-green-200',
    failed: 'bg-red-100 text-red-800 border-red-200',
    on_hold: 'bg-gray-100 text-gray-800 border-gray-200'
  };
  return colors[status] || colors.pending;
}

/**
 * Calculate estimated payout date
 */
export function getEstimatedPayoutDate(
  periodEnd: string,
  holdDays: number
): Date {
  const date = new Date(periodEnd);
  date.setDate(date.getDate() + holdDays);

  // Skip weekends
  while (date.getDay() === 0 || date.getDay() === 6) {
    date.setDate(date.getDate() + 1);
  }

  return date;
}
