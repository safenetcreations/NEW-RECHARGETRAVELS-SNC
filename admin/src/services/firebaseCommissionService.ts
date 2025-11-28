import {
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  updateDoc,
  query,
  where,
  orderBy,
  limit,
  Timestamp
} from 'firebase/firestore';
import { db } from '@/lib/firebase';

const SETTINGS_COLLECTION = 'settings';
const SETTLEMENTS_COLLECTION = 'driver_payment_settlements';
const DRIVERS_COLLECTION = 'drivers';
const DRIVER_BOOKINGS_COLLECTION = 'driver_bookings';

// Types
export type PaymentStatus = 'pending' | 'processing' | 'completed' | 'failed' | 'on_hold';
export type PayoutFrequency = 'daily' | 'weekly' | 'biweekly' | 'monthly';

export interface CommissionSettings {
  platform_fee_fixed: number;
  commission_percentage: number;
  completion_bonus_rate: number;
  rating_bonus_rate: number;
  batch_bonus_rate: number;
  referral_bonus: number;
  rating_bonus_threshold: number;
  batch_bonus_threshold: number;
  min_payout_amount: number;
  payout_frequency: PayoutFrequency;
  payout_hold_days: number;
  updated_at?: string;
}

export interface DriverPaymentSettlement {
  id: string;
  driver_id: string;
  driver_name?: string;
  driver_email?: string;
  settlement_period: string;
  period_start: string;
  period_end: string;
  gross_earnings: number;
  total_trips: number;
  platform_fees: number;
  commission_amount: number;
  completion_bonus: number;
  rating_bonus: number;
  batch_bonus: number;
  referral_bonus: number;
  other_bonus: number;
  total_bonuses: number;
  net_payout: number;
  payment_status: PaymentStatus;
  payment_method?: string;
  payment_date?: string;
  bank_reference?: string;
  payment_notes?: string;
  approved_by?: string;
  approved_at?: string;
  created_at: string;
  updated_at: string;
}

export const DEFAULT_COMMISSION_SETTINGS: CommissionSettings = {
  platform_fee_fixed: 300,
  commission_percentage: 10,
  completion_bonus_rate: 5,
  rating_bonus_rate: 3,
  batch_bonus_rate: 2,
  referral_bonus: 500,
  rating_bonus_threshold: 4.8,
  batch_bonus_threshold: 10,
  min_payout_amount: 5000,
  payout_frequency: 'weekly',
  payout_hold_days: 3
};

const nowIso = () => new Date().toISOString();

// Commission Settings
export async function getCommissionSettings(): Promise<CommissionSettings> {
  try {
    const docRef = doc(db, SETTINGS_COLLECTION, 'commission_settings');
    const snap = await getDoc(docRef);

    if (snap.exists()) {
      return snap.data() as CommissionSettings;
    }

    await setDoc(docRef, DEFAULT_COMMISSION_SETTINGS);
    return DEFAULT_COMMISSION_SETTINGS;
  } catch (error) {
    console.error('Error fetching commission settings:', error);
    return DEFAULT_COMMISSION_SETTINGS;
  }
}

export async function updateCommissionSettings(
  updates: Partial<CommissionSettings>
): Promise<void> {
  const docRef = doc(db, SETTINGS_COLLECTION, 'commission_settings');
  await updateDoc(docRef, {
    ...updates,
    updated_at: nowIso()
  });
}

// Settlements
export async function getAllSettlements(
  status?: PaymentStatus,
  limitCount = 50
): Promise<DriverPaymentSettlement[]> {
  try {
    let q;
    if (status) {
      q = query(
        collection(db, SETTLEMENTS_COLLECTION),
        where('payment_status', '==', status),
        orderBy('created_at', 'desc'),
        limit(limitCount)
      );
    } else {
      q = query(
        collection(db, SETTLEMENTS_COLLECTION),
        orderBy('created_at', 'desc'),
        limit(limitCount)
      );
    }

    const snap = await getDocs(q);
    const settlements: DriverPaymentSettlement[] = [];

    for (const docSnap of snap.docs) {
      const data = docSnap.data();

      // Get driver info
      let driverName = 'Unknown Driver';
      let driverEmail = '';
      try {
        const driverRef = doc(db, DRIVERS_COLLECTION, data.driver_id);
        const driverSnap = await getDoc(driverRef);
        if (driverSnap.exists()) {
          const driverData = driverSnap.data();
          driverName = driverData.full_name || driverData.name || 'Unknown';
          driverEmail = driverData.email || '';
        }
      } catch (e) {
        console.error('Error fetching driver:', e);
      }

      settlements.push({
        id: docSnap.id,
        driver_name: driverName,
        driver_email: driverEmail,
        ...data
      } as DriverPaymentSettlement);
    }

    return settlements;
  } catch (error) {
    console.error('Error fetching settlements:', error);
    return [];
  }
}

export async function getPendingSettlements(): Promise<DriverPaymentSettlement[]> {
  return getAllSettlements('pending');
}

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

// Analytics
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
  try {
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
  } catch (error) {
    console.error('Error getting platform revenue:', error);
    return {
      totalRevenue: 0,
      platformFees: 0,
      commissions: 0,
      bonusesPaid: 0,
      netRevenue: 0,
      driversCount: 0,
      settlementsCount: 0
    };
  }
}

// Helper functions
export function formatCurrency(amount: number, currency = 'LKR'): string {
  return new Intl.NumberFormat('en-LK', {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(amount);
}

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
