/**
 * Customer Blacklist Service
 * Manages customer restrictions, warnings, and risk assessment for vehicle rentals
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
  Timestamp
} from 'firebase/firestore';
import { db } from '@/config/firebase';

// ==========================================
// TYPES & INTERFACES
// ==========================================

export type BlacklistStatus = 'blacklisted' | 'flagged' | 'warning' | 'cleared';

export type BlacklistReason =
  | 'no_show'
  | 'late_return'
  | 'vehicle_damage'
  | 'payment_issues'
  | 'rule_violation'
  | 'fraud_attempt'
  | 'abusive_behavior'
  | 'document_issues'
  | 'excessive_cancellations'
  | 'other';

export interface BlacklistEntry {
  id?: string;
  customerId: string;
  customerName: string;
  customerEmail: string;
  customerPhone?: string;

  // Status
  status: BlacklistStatus;
  reason: BlacklistReason;
  reasonDetails: string;

  // Incident details
  incidentDate: string;
  incidentBookingId?: string;
  incidentBookingReference?: string;
  vehicleId?: string;
  vehicleName?: string;
  ownerId?: string;
  ownerName?: string;

  // Financial impact
  outstandingAmount?: number;
  damageAmount?: number;

  // Evidence
  evidenceUrls?: string[];
  notes?: string;

  // Review
  reviewRequired: boolean;
  reviewedBy?: string;
  reviewedAt?: string;
  reviewNotes?: string;

  // Expiry (for temporary flags)
  expiresAt?: string;

  // Metadata
  addedBy: string;
  addedByName?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CustomerRiskProfile {
  customerId: string;
  riskScore: number; // 0-100
  riskLevel: 'low' | 'medium' | 'high' | 'critical';

  // Statistics
  totalBookings: number;
  completedBookings: number;
  cancelledBookings: number;
  noShows: number;
  lateReturns: number;
  damageIncidents: number;
  paymentIssues: number;

  // Financial
  totalSpent: number;
  outstandingBalance: number;

  // History
  blacklistHistory: number; // Times blacklisted
  warningCount: number;
  lastIncident?: string;

  // Computed
  cancellationRate: number;
  completionRate: number;

  updatedAt: string;
}

export interface BlacklistCheckResult {
  isBlacklisted: boolean;
  isFlagged: boolean;
  hasWarnings: boolean;
  canBook: boolean;
  message: string;
  entries: BlacklistEntry[];
  riskProfile?: CustomerRiskProfile;
}

// ==========================================
// CONSTANTS
// ==========================================

const BLACKLIST_COLLECTION = 'customer_blacklist';
const RISK_PROFILES_COLLECTION = 'customer_risk_profiles';

const REASON_LABELS: Record<BlacklistReason, string> = {
  no_show: 'No Show',
  late_return: 'Late Return',
  vehicle_damage: 'Vehicle Damage',
  payment_issues: 'Payment Issues',
  rule_violation: 'Rule Violation',
  fraud_attempt: 'Fraud Attempt',
  abusive_behavior: 'Abusive Behavior',
  document_issues: 'Document Issues',
  excessive_cancellations: 'Excessive Cancellations',
  other: 'Other'
};

const REASON_SEVERITY: Record<BlacklistReason, number> = {
  fraud_attempt: 100,
  abusive_behavior: 90,
  vehicle_damage: 80,
  payment_issues: 70,
  no_show: 60,
  late_return: 50,
  rule_violation: 40,
  document_issues: 30,
  excessive_cancellations: 20,
  other: 10
};

// ==========================================
// SERVICE
// ==========================================

export const customerBlacklistService = {
  // ==========================================
  // BLACKLIST MANAGEMENT
  // ==========================================

  /**
   * Add customer to blacklist
   */
  async addToBlacklist(data: Omit<BlacklistEntry, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> {
    const entryRef = doc(collection(db, BLACKLIST_COLLECTION));
    const now = new Date().toISOString();

    const entry: BlacklistEntry = {
      ...data,
      id: entryRef.id,
      createdAt: now,
      updatedAt: now
    };

    await setDoc(entryRef, entry);

    // Update risk profile
    await this.updateRiskProfile(data.customerId);

    return entryRef.id;
  },

  /**
   * Update blacklist entry
   */
  async updateEntry(entryId: string, data: Partial<BlacklistEntry>): Promise<void> {
    await updateDoc(doc(db, BLACKLIST_COLLECTION, entryId), {
      ...data,
      updatedAt: new Date().toISOString()
    });
  },

  /**
   * Remove from blacklist
   */
  async removeFromBlacklist(entryId: string): Promise<void> {
    await deleteDoc(doc(db, BLACKLIST_COLLECTION, entryId));
  },

  /**
   * Clear customer status (mark as cleared)
   */
  async clearCustomerStatus(entryId: string, reviewerId: string, notes: string): Promise<void> {
    const now = new Date().toISOString();
    await updateDoc(doc(db, BLACKLIST_COLLECTION, entryId), {
      status: 'cleared',
      reviewedBy: reviewerId,
      reviewedAt: now,
      reviewNotes: notes,
      updatedAt: now
    });
  },

  /**
   * Get entry by ID
   */
  async getEntryById(entryId: string): Promise<BlacklistEntry | null> {
    const docSnap = await getDoc(doc(db, BLACKLIST_COLLECTION, entryId));
    if (!docSnap.exists()) return null;
    return { id: docSnap.id, ...docSnap.data() } as BlacklistEntry;
  },

  /**
   * Get all entries for a customer
   */
  async getCustomerEntries(customerId: string): Promise<BlacklistEntry[]> {
    const q = query(
      collection(db, BLACKLIST_COLLECTION),
      where('customerId', '==', customerId),
      orderBy('createdAt', 'desc')
    );
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as BlacklistEntry));
  },

  /**
   * Get all blacklist entries
   */
  async getAllEntries(statusFilter?: BlacklistStatus): Promise<BlacklistEntry[]> {
    let q;
    if (statusFilter) {
      q = query(
        collection(db, BLACKLIST_COLLECTION),
        where('status', '==', statusFilter),
        orderBy('createdAt', 'desc')
      );
    } else {
      q = query(
        collection(db, BLACKLIST_COLLECTION),
        orderBy('createdAt', 'desc')
      );
    }
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as BlacklistEntry));
  },

  /**
   * Get entries requiring review
   */
  async getEntriesRequiringReview(): Promise<BlacklistEntry[]> {
    const q = query(
      collection(db, BLACKLIST_COLLECTION),
      where('reviewRequired', '==', true),
      where('reviewedAt', '==', null),
      orderBy('createdAt', 'desc')
    );
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as BlacklistEntry));
  },

  // ==========================================
  // BLACKLIST CHECKING
  // ==========================================

  /**
   * Check if customer can book
   */
  async checkCustomer(
    customerId: string,
    customerEmail?: string,
    customerPhone?: string
  ): Promise<BlacklistCheckResult> {
    // Get entries by customer ID
    let entries = await this.getCustomerEntries(customerId);

    // Also check by email if provided
    if (customerEmail) {
      const emailQ = query(
        collection(db, BLACKLIST_COLLECTION),
        where('customerEmail', '==', customerEmail)
      );
      const emailSnapshot = await getDocs(emailQ);
      const emailEntries = emailSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as BlacklistEntry));
      entries = [...entries, ...emailEntries.filter(e => e.customerId !== customerId)];
    }

    // Also check by phone if provided
    if (customerPhone) {
      const phoneQ = query(
        collection(db, BLACKLIST_COLLECTION),
        where('customerPhone', '==', customerPhone)
      );
      const phoneSnapshot = await getDocs(phoneQ);
      const phoneEntries = phoneSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as BlacklistEntry));
      entries = [...entries, ...phoneEntries.filter(e => e.customerId !== customerId && !entries.find(x => x.id === e.id))];
    }

    // Filter out cleared and expired entries
    const now = new Date().toISOString();
    const activeEntries = entries.filter(entry => {
      if (entry.status === 'cleared') return false;
      if (entry.expiresAt && entry.expiresAt < now) return false;
      return true;
    });

    const isBlacklisted = activeEntries.some(e => e.status === 'blacklisted');
    const isFlagged = activeEntries.some(e => e.status === 'flagged');
    const hasWarnings = activeEntries.some(e => e.status === 'warning');

    // Get risk profile
    const riskProfile = await this.getRiskProfile(customerId);

    let canBook = true;
    let message = 'Customer is in good standing';

    if (isBlacklisted) {
      canBook = false;
      message = 'Customer is blacklisted and cannot make bookings';
    } else if (isFlagged) {
      canBook = true;
      message = 'Customer is flagged - review recommended before confirming';
    } else if (hasWarnings) {
      canBook = true;
      message = 'Customer has warnings on file';
    }

    // Additional risk-based restrictions
    if (riskProfile && riskProfile.riskLevel === 'critical') {
      canBook = false;
      message = 'Customer has critical risk level';
    }

    return {
      isBlacklisted,
      isFlagged,
      hasWarnings,
      canBook,
      message,
      entries: activeEntries,
      riskProfile: riskProfile || undefined
    };
  },

  /**
   * Quick blacklist check (returns boolean only)
   */
  async isBlacklisted(customerId: string): Promise<boolean> {
    const result = await this.checkCustomer(customerId);
    return result.isBlacklisted;
  },

  // ==========================================
  // RISK PROFILES
  // ==========================================

  /**
   * Get risk profile for customer
   */
  async getRiskProfile(customerId: string): Promise<CustomerRiskProfile | null> {
    const docSnap = await getDoc(doc(db, RISK_PROFILES_COLLECTION, customerId));
    if (!docSnap.exists()) return null;
    return docSnap.data() as CustomerRiskProfile;
  },

  /**
   * Update risk profile (recalculate)
   */
  async updateRiskProfile(customerId: string): Promise<CustomerRiskProfile> {
    // Get all entries for customer
    const entries = await this.getCustomerEntries(customerId);

    // Calculate statistics
    const blacklistCount = entries.filter(e => e.status === 'blacklisted').length;
    const warningCount = entries.filter(e => e.status === 'warning').length;
    const noShows = entries.filter(e => e.reason === 'no_show').length;
    const lateReturns = entries.filter(e => e.reason === 'late_return').length;
    const damageIncidents = entries.filter(e => e.reason === 'vehicle_damage').length;
    const paymentIssues = entries.filter(e => e.reason === 'payment_issues').length;

    // Calculate outstanding amount
    const outstandingBalance = entries.reduce((sum, e) => sum + (e.outstandingAmount || 0), 0);

    // Calculate risk score
    let riskScore = 0;
    entries.forEach(entry => {
      if (entry.status === 'cleared') return;
      const severity = REASON_SEVERITY[entry.reason] || 10;
      const statusMultiplier = entry.status === 'blacklisted' ? 2 : entry.status === 'flagged' ? 1.5 : 1;
      riskScore += severity * statusMultiplier;
    });

    // Cap risk score at 100
    riskScore = Math.min(100, riskScore);

    // Determine risk level
    let riskLevel: 'low' | 'medium' | 'high' | 'critical';
    if (riskScore >= 80) riskLevel = 'critical';
    else if (riskScore >= 50) riskLevel = 'high';
    else if (riskScore >= 25) riskLevel = 'medium';
    else riskLevel = 'low';

    const lastIncident = entries.length > 0 ? entries[0].incidentDate : undefined;

    const profile: CustomerRiskProfile = {
      customerId,
      riskScore,
      riskLevel,
      totalBookings: 0, // Would need to query bookings
      completedBookings: 0,
      cancelledBookings: 0,
      noShows,
      lateReturns,
      damageIncidents,
      paymentIssues,
      totalSpent: 0,
      outstandingBalance,
      blacklistHistory: blacklistCount,
      warningCount,
      lastIncident,
      cancellationRate: 0,
      completionRate: 0,
      updatedAt: new Date().toISOString()
    };

    // Save profile
    await setDoc(doc(db, RISK_PROFILES_COLLECTION, customerId), profile);

    return profile;
  },

  // ==========================================
  // REPORTING
  // ==========================================

  /**
   * Get blacklist statistics
   */
  async getStatistics(): Promise<{
    totalBlacklisted: number;
    totalFlagged: number;
    totalWarnings: number;
    byReason: Record<BlacklistReason, number>;
    recentIncidents: BlacklistEntry[];
    pendingReviews: number;
    totalOutstanding: number;
  }> {
    const entries = await this.getAllEntries();
    const activeEntries = entries.filter(e => e.status !== 'cleared');

    const totalBlacklisted = activeEntries.filter(e => e.status === 'blacklisted').length;
    const totalFlagged = activeEntries.filter(e => e.status === 'flagged').length;
    const totalWarnings = activeEntries.filter(e => e.status === 'warning').length;

    const byReason: Record<BlacklistReason, number> = {
      no_show: 0,
      late_return: 0,
      vehicle_damage: 0,
      payment_issues: 0,
      rule_violation: 0,
      fraud_attempt: 0,
      abusive_behavior: 0,
      document_issues: 0,
      excessive_cancellations: 0,
      other: 0
    };

    activeEntries.forEach(entry => {
      byReason[entry.reason] = (byReason[entry.reason] || 0) + 1;
    });

    const pendingReviews = activeEntries.filter(e => e.reviewRequired && !e.reviewedAt).length;
    const totalOutstanding = activeEntries.reduce((sum, e) => sum + (e.outstandingAmount || 0), 0);

    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    const recentIncidents = entries
      .filter(e => new Date(e.createdAt) >= thirtyDaysAgo)
      .slice(0, 10);

    return {
      totalBlacklisted,
      totalFlagged,
      totalWarnings,
      byReason,
      recentIncidents,
      pendingReviews,
      totalOutstanding
    };
  },

  /**
   * Get entries by owner
   */
  async getEntriesByOwner(ownerId: string): Promise<BlacklistEntry[]> {
    const q = query(
      collection(db, BLACKLIST_COLLECTION),
      where('ownerId', '==', ownerId),
      orderBy('createdAt', 'desc')
    );
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as BlacklistEntry));
  },

  // ==========================================
  // UTILITIES
  // ==========================================

  /**
   * Get reason label
   */
  getReasonLabel(reason: BlacklistReason): string {
    return REASON_LABELS[reason] || reason;
  },

  /**
   * Get all reason labels
   */
  getAllReasonLabels(): Record<BlacklistReason, string> {
    return REASON_LABELS;
  },

  /**
   * Get severity for reason
   */
  getReasonSeverity(reason: BlacklistReason): number {
    return REASON_SEVERITY[reason] || 0;
  },

  /**
   * Get risk level color
   */
  getRiskLevelColor(level: string): string {
    switch (level) {
      case 'critical': return 'text-red-600 bg-red-100';
      case 'high': return 'text-orange-600 bg-orange-100';
      case 'medium': return 'text-yellow-600 bg-yellow-100';
      case 'low': return 'text-green-600 bg-green-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  },

  /**
   * Get status color
   */
  getStatusColor(status: BlacklistStatus): string {
    switch (status) {
      case 'blacklisted': return 'text-red-600 bg-red-100';
      case 'flagged': return 'text-orange-600 bg-orange-100';
      case 'warning': return 'text-yellow-600 bg-yellow-100';
      case 'cleared': return 'text-green-600 bg-green-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  }
};

export default customerBlacklistService;
