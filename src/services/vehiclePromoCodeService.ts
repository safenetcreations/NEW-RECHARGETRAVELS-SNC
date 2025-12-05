/**
 * Vehicle Rental Promo Code Service
 * Manages promotional codes, discounts, and coupon validation
 */

import {
  collection,
  doc,
  setDoc,
  getDoc,
  getDocs,
  query,
  where,
  orderBy,
  updateDoc,
  deleteDoc,
  Timestamp,
  increment
} from 'firebase/firestore';
import { db } from '@/config/firebase';

// ==========================================
// TYPES & INTERFACES
// ==========================================

export type DiscountType = 'percentage' | 'fixed_amount' | 'free_days';

export type PromoCodeStatus = 'active' | 'inactive' | 'expired' | 'depleted';

export interface PromoCode {
  id?: string;
  code: string;
  name: string;
  description: string;

  // Discount configuration
  discountType: DiscountType;
  discountValue: number; // Percentage (1-100), fixed amount in LKR, or number of free days

  // Limits
  maxUses: number | null; // null = unlimited
  usesCount: number;
  maxUsesPerCustomer: number;
  minBookingAmount: number;
  maxDiscountAmount: number | null; // Cap for percentage discounts

  // Validity period
  startDate: string;
  endDate: string;
  status: PromoCodeStatus;

  // Targeting
  applicableVehicleTypes: string[]; // Empty = all types
  applicableOwnerIds: string[]; // Empty = all owners
  excludedVehicleIds: string[];
  newCustomersOnly: boolean;

  // Metadata
  createdBy: string;
  createdAt: string;
  updatedAt: string;
  notes?: string;
}

export interface PromoCodeUsage {
  id?: string;
  promoCodeId: string;
  code: string;
  customerId: string;
  customerEmail: string;
  bookingId: string;
  bookingReference: string;

  // Discount applied
  originalAmount: number;
  discountAmount: number;
  finalAmount: number;

  // Timestamps
  usedAt: string;
}

export interface PromoValidationResult {
  valid: boolean;
  discountAmount: number;
  finalAmount: number;
  message: string;
  promoCode?: PromoCode;
}

// ==========================================
// CONSTANTS
// ==========================================

const PROMO_CODES_COLLECTION = 'vehicle_promo_codes';
const PROMO_USAGE_COLLECTION = 'vehicle_promo_usage';

// ==========================================
// SERVICE
// ==========================================

export const vehiclePromoCodeService = {
  // ==========================================
  // PROMO CODE MANAGEMENT
  // ==========================================

  /**
   * Create a new promo code
   */
  async createPromoCode(data: Omit<PromoCode, 'id' | 'usesCount' | 'createdAt' | 'updatedAt'>): Promise<string> {
    // Validate code uniqueness
    const existing = await this.getPromoCodeByCode(data.code);
    if (existing) {
      throw new Error('Promo code already exists');
    }

    const promoRef = doc(collection(db, PROMO_CODES_COLLECTION));
    const now = new Date().toISOString();

    const promoCode: PromoCode = {
      ...data,
      id: promoRef.id,
      code: data.code.toUpperCase(),
      usesCount: 0,
      createdAt: now,
      updatedAt: now
    };

    await setDoc(promoRef, promoCode);
    return promoRef.id;
  },

  /**
   * Update promo code
   */
  async updatePromoCode(promoId: string, data: Partial<PromoCode>): Promise<void> {
    const updates = {
      ...data,
      updatedAt: new Date().toISOString()
    };

    if (data.code) {
      updates.code = data.code.toUpperCase();
    }

    await updateDoc(doc(db, PROMO_CODES_COLLECTION, promoId), updates);
  },

  /**
   * Delete promo code
   */
  async deletePromoCode(promoId: string): Promise<void> {
    await deleteDoc(doc(db, PROMO_CODES_COLLECTION, promoId));
  },

  /**
   * Get promo code by ID
   */
  async getPromoCodeById(promoId: string): Promise<PromoCode | null> {
    const docSnap = await getDoc(doc(db, PROMO_CODES_COLLECTION, promoId));
    if (!docSnap.exists()) return null;
    return { id: docSnap.id, ...docSnap.data() } as PromoCode;
  },

  /**
   * Get promo code by code string
   */
  async getPromoCodeByCode(code: string): Promise<PromoCode | null> {
    const q = query(
      collection(db, PROMO_CODES_COLLECTION),
      where('code', '==', code.toUpperCase())
    );
    const snapshot = await getDocs(q);
    if (snapshot.empty) return null;
    const doc = snapshot.docs[0];
    return { id: doc.id, ...doc.data() } as PromoCode;
  },

  /**
   * Get all promo codes
   */
  async getAllPromoCodes(includeInactive: boolean = false): Promise<PromoCode[]> {
    let q;
    if (includeInactive) {
      q = query(
        collection(db, PROMO_CODES_COLLECTION),
        orderBy('createdAt', 'desc')
      );
    } else {
      q = query(
        collection(db, PROMO_CODES_COLLECTION),
        where('status', '==', 'active'),
        orderBy('createdAt', 'desc')
      );
    }

    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as PromoCode));
  },

  /**
   * Get active promo codes for display
   */
  async getActivePromoCodes(): Promise<PromoCode[]> {
    const now = new Date().toISOString();
    const q = query(
      collection(db, PROMO_CODES_COLLECTION),
      where('status', '==', 'active')
    );

    const snapshot = await getDocs(q);
    return snapshot.docs
      .map(doc => ({ id: doc.id, ...doc.data() } as PromoCode))
      .filter(promo => {
        return promo.startDate <= now && promo.endDate >= now;
      });
  },

  // ==========================================
  // PROMO CODE VALIDATION
  // ==========================================

  /**
   * Validate a promo code for a booking
   */
  async validatePromoCode(
    code: string,
    customerId: string,
    bookingAmount: number,
    vehicleId: string,
    ownerId: string,
    vehicleType: string,
    isNewCustomer: boolean
  ): Promise<PromoValidationResult> {
    const promoCode = await this.getPromoCodeByCode(code);

    // Check if promo exists
    if (!promoCode) {
      return {
        valid: false,
        discountAmount: 0,
        finalAmount: bookingAmount,
        message: 'Invalid promo code'
      };
    }

    // Check status
    if (promoCode.status !== 'active') {
      return {
        valid: false,
        discountAmount: 0,
        finalAmount: bookingAmount,
        message: 'This promo code is no longer active'
      };
    }

    // Check date validity
    const now = new Date().toISOString();
    if (promoCode.startDate > now) {
      return {
        valid: false,
        discountAmount: 0,
        finalAmount: bookingAmount,
        message: 'This promo code is not yet valid'
      };
    }
    if (promoCode.endDate < now) {
      return {
        valid: false,
        discountAmount: 0,
        finalAmount: bookingAmount,
        message: 'This promo code has expired'
      };
    }

    // Check usage limits
    if (promoCode.maxUses !== null && promoCode.usesCount >= promoCode.maxUses) {
      return {
        valid: false,
        discountAmount: 0,
        finalAmount: bookingAmount,
        message: 'This promo code has reached its usage limit'
      };
    }

    // Check customer usage limit
    const customerUsageCount = await this.getCustomerUsageCount(promoCode.id!, customerId);
    if (customerUsageCount >= promoCode.maxUsesPerCustomer) {
      return {
        valid: false,
        discountAmount: 0,
        finalAmount: bookingAmount,
        message: `You've already used this promo code ${promoCode.maxUsesPerCustomer} time(s)`
      };
    }

    // Check minimum booking amount
    if (bookingAmount < promoCode.minBookingAmount) {
      return {
        valid: false,
        discountAmount: 0,
        finalAmount: bookingAmount,
        message: `Minimum booking amount is LKR ${promoCode.minBookingAmount.toLocaleString()}`
      };
    }

    // Check new customers only
    if (promoCode.newCustomersOnly && !isNewCustomer) {
      return {
        valid: false,
        discountAmount: 0,
        finalAmount: bookingAmount,
        message: 'This promo code is only for new customers'
      };
    }

    // Check vehicle type targeting
    if (promoCode.applicableVehicleTypes.length > 0 &&
        !promoCode.applicableVehicleTypes.includes(vehicleType)) {
      return {
        valid: false,
        discountAmount: 0,
        finalAmount: bookingAmount,
        message: 'This promo code is not applicable for this vehicle type'
      };
    }

    // Check owner targeting
    if (promoCode.applicableOwnerIds.length > 0 &&
        !promoCode.applicableOwnerIds.includes(ownerId)) {
      return {
        valid: false,
        discountAmount: 0,
        finalAmount: bookingAmount,
        message: 'This promo code is not applicable for this vehicle'
      };
    }

    // Check excluded vehicles
    if (promoCode.excludedVehicleIds.includes(vehicleId)) {
      return {
        valid: false,
        discountAmount: 0,
        finalAmount: bookingAmount,
        message: 'This promo code is not applicable for this vehicle'
      };
    }

    // Calculate discount
    let discountAmount = this.calculateDiscount(promoCode, bookingAmount);

    // Apply max discount cap for percentage discounts
    if (promoCode.discountType === 'percentage' && promoCode.maxDiscountAmount !== null) {
      discountAmount = Math.min(discountAmount, promoCode.maxDiscountAmount);
    }

    const finalAmount = Math.max(0, bookingAmount - discountAmount);

    return {
      valid: true,
      discountAmount,
      finalAmount,
      message: this.getSuccessMessage(promoCode, discountAmount),
      promoCode
    };
  },

  /**
   * Calculate discount amount
   */
  calculateDiscount(promoCode: PromoCode, amount: number): number {
    switch (promoCode.discountType) {
      case 'percentage':
        return Math.round(amount * (promoCode.discountValue / 100));
      case 'fixed_amount':
        return promoCode.discountValue;
      case 'free_days':
        // This would need rental days info to calculate properly
        // For now, return 0 - should be calculated in booking context
        return 0;
      default:
        return 0;
    }
  },

  /**
   * Get success message for valid promo
   */
  getSuccessMessage(promoCode: PromoCode, discountAmount: number): string {
    switch (promoCode.discountType) {
      case 'percentage':
        return `${promoCode.discountValue}% off applied! You save LKR ${discountAmount.toLocaleString()}`;
      case 'fixed_amount':
        return `LKR ${promoCode.discountValue.toLocaleString()} discount applied!`;
      case 'free_days':
        return `${promoCode.discountValue} free day(s) applied!`;
      default:
        return 'Discount applied!';
    }
  },

  // ==========================================
  // USAGE TRACKING
  // ==========================================

  /**
   * Record promo code usage
   */
  async recordUsage(data: Omit<PromoCodeUsage, 'id' | 'usedAt'>): Promise<string> {
    const usageRef = doc(collection(db, PROMO_USAGE_COLLECTION));
    const now = new Date().toISOString();

    const usage: PromoCodeUsage = {
      ...data,
      id: usageRef.id,
      usedAt: now
    };

    await setDoc(usageRef, usage);

    // Increment usage count on promo code
    await updateDoc(doc(db, PROMO_CODES_COLLECTION, data.promoCodeId), {
      usesCount: increment(1),
      updatedAt: now
    });

    // Check if promo should be depleted
    const promoCode = await this.getPromoCodeById(data.promoCodeId);
    if (promoCode && promoCode.maxUses !== null && promoCode.usesCount + 1 >= promoCode.maxUses) {
      await this.updatePromoCode(data.promoCodeId, { status: 'depleted' });
    }

    return usageRef.id;
  },

  /**
   * Get customer usage count for a promo code
   */
  async getCustomerUsageCount(promoCodeId: string, customerId: string): Promise<number> {
    const q = query(
      collection(db, PROMO_USAGE_COLLECTION),
      where('promoCodeId', '==', promoCodeId),
      where('customerId', '==', customerId)
    );
    const snapshot = await getDocs(q);
    return snapshot.size;
  },

  /**
   * Get usage history for a promo code
   */
  async getPromoCodeUsage(promoCodeId: string): Promise<PromoCodeUsage[]> {
    const q = query(
      collection(db, PROMO_USAGE_COLLECTION),
      where('promoCodeId', '==', promoCodeId),
      orderBy('usedAt', 'desc')
    );
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as PromoCodeUsage));
  },

  /**
   * Get all usage for a customer
   */
  async getCustomerUsageHistory(customerId: string): Promise<PromoCodeUsage[]> {
    const q = query(
      collection(db, PROMO_USAGE_COLLECTION),
      where('customerId', '==', customerId),
      orderBy('usedAt', 'desc')
    );
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as PromoCodeUsage));
  },

  // ==========================================
  // ADMIN ANALYTICS
  // ==========================================

  /**
   * Get promo code statistics
   */
  async getPromoCodeStats(promoCodeId: string): Promise<{
    totalUses: number;
    uniqueCustomers: number;
    totalDiscountGiven: number;
    totalRevenue: number;
    averageDiscount: number;
  }> {
    const usage = await this.getPromoCodeUsage(promoCodeId);

    const uniqueCustomers = new Set(usage.map(u => u.customerId)).size;
    const totalDiscountGiven = usage.reduce((sum, u) => sum + u.discountAmount, 0);
    const totalRevenue = usage.reduce((sum, u) => sum + u.finalAmount, 0);
    const averageDiscount = usage.length > 0 ? totalDiscountGiven / usage.length : 0;

    return {
      totalUses: usage.length,
      uniqueCustomers,
      totalDiscountGiven,
      totalRevenue,
      averageDiscount: Math.round(averageDiscount)
    };
  },

  /**
   * Get overall promo code analytics
   */
  async getOverallPromoAnalytics(): Promise<{
    totalPromoCodes: number;
    activePromoCodes: number;
    totalUsage: number;
    totalDiscountGiven: number;
    topPromoCodes: Array<{ code: string; uses: number; discount: number }>;
  }> {
    const allPromos = await this.getAllPromoCodes(true);
    const activePromos = allPromos.filter(p => p.status === 'active');

    // Get all usage
    const usageQuery = query(collection(db, PROMO_USAGE_COLLECTION));
    const usageSnapshot = await getDocs(usageQuery);
    const allUsage = usageSnapshot.docs.map(doc => doc.data() as PromoCodeUsage);

    const totalUsage = allUsage.length;
    const totalDiscountGiven = allUsage.reduce((sum, u) => sum + u.discountAmount, 0);

    // Calculate top promo codes
    const promoStats = new Map<string, { code: string; uses: number; discount: number }>();
    allUsage.forEach(usage => {
      const existing = promoStats.get(usage.code) || { code: usage.code, uses: 0, discount: 0 };
      existing.uses += 1;
      existing.discount += usage.discountAmount;
      promoStats.set(usage.code, existing);
    });

    const topPromoCodes = Array.from(promoStats.values())
      .sort((a, b) => b.uses - a.uses)
      .slice(0, 5);

    return {
      totalPromoCodes: allPromos.length,
      activePromoCodes: activePromos.length,
      totalUsage,
      totalDiscountGiven,
      topPromoCodes
    };
  },

  // ==========================================
  // UTILITIES
  // ==========================================

  /**
   * Generate a random promo code
   */
  generatePromoCode(prefix: string = 'RT', length: number = 6): string {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let code = prefix;
    for (let i = 0; i < length; i++) {
      code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return code;
  },

  /**
   * Format discount for display
   */
  formatDiscount(promoCode: PromoCode): string {
    switch (promoCode.discountType) {
      case 'percentage':
        return `${promoCode.discountValue}% OFF`;
      case 'fixed_amount':
        return `LKR ${promoCode.discountValue.toLocaleString()} OFF`;
      case 'free_days':
        return `${promoCode.discountValue} FREE DAY${promoCode.discountValue > 1 ? 'S' : ''}`;
      default:
        return 'Discount';
    }
  },

  /**
   * Check and expire outdated promo codes
   */
  async expireOutdatedPromoCodes(): Promise<number> {
    const now = new Date().toISOString();
    const q = query(
      collection(db, PROMO_CODES_COLLECTION),
      where('status', '==', 'active')
    );

    const snapshot = await getDocs(q);
    let expiredCount = 0;

    for (const doc of snapshot.docs) {
      const promo = doc.data() as PromoCode;
      if (promo.endDate < now) {
        await updateDoc(doc.ref, {
          status: 'expired',
          updatedAt: now
        });
        expiredCount++;
      }
    }

    return expiredCount;
  }
};

export default vehiclePromoCodeService;
