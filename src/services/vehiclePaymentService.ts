/**
 * Vehicle Rental Payment Service
 * Handles payment processing for vehicle rentals
 * Supports multiple payment gateways: PayHere, Stripe, Bank Transfer
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
  Timestamp
} from 'firebase/firestore';
import { db } from '@/config/firebase';

// ==========================================
// TYPES & INTERFACES
// ==========================================

export type PaymentMethod =
  | 'payhere'      // Sri Lanka's PayHere gateway
  | 'stripe'       // International cards
  | 'bank_transfer'
  | 'cash'
  | 'card_on_pickup';

export type PaymentStatus =
  | 'pending'
  | 'processing'
  | 'completed'
  | 'failed'
  | 'refunded'
  | 'partially_refunded'
  | 'cancelled';

export type PaymentType =
  | 'booking_payment'    // Main booking payment
  | 'security_deposit'   // Refundable deposit
  | 'additional_charges' // Extra fees (fuel, damage, etc.)
  | 'refund';

export interface Payment {
  id?: string;
  bookingId: string;
  bookingReference: string;
  customerId: string;
  ownerId: string;
  vehicleId: string;

  // Payment details
  paymentType: PaymentType;
  paymentMethod: PaymentMethod;
  status: PaymentStatus;

  // Amounts (in LKR)
  amount: number;
  currency: string;
  platformFee: number;
  ownerPayout: number;

  // Gateway response
  gatewayTransactionId?: string;
  gatewayResponse?: Record<string, unknown>;

  // Bank transfer details
  bankTransferReference?: string;
  bankTransferProof?: string;
  bankVerifiedBy?: string;
  bankVerifiedAt?: string;

  // Refund details
  refundAmount?: number;
  refundReason?: string;
  refundedAt?: string;
  refundTransactionId?: string;

  // Timestamps
  createdAt: string;
  updatedAt: string;
  completedAt?: string;
  expiresAt?: string;
}

export interface PaymentIntent {
  id: string;
  bookingId: string;
  amount: number;
  currency: string;
  paymentMethod: PaymentMethod;
  status: 'created' | 'processing' | 'succeeded' | 'failed' | 'cancelled';

  // Gateway-specific data
  payHereOrderId?: string;
  payHereHash?: string;
  stripeClientSecret?: string;
  stripePaymentIntentId?: string;

  // URLs
  successUrl: string;
  cancelUrl: string;
  notifyUrl: string;

  expiresAt: string;
  createdAt: string;
}

export interface BankAccount {
  bankName: string;
  accountName: string;
  accountNumber: string;
  branchCode?: string;
  swiftCode?: string;
}

// ==========================================
// PAYMENT CONFIGURATION
// ==========================================

const PAYMENT_CONFIG = {
  platformFeePercent: 15, // 15% platform commission
  minAmount: 1000,        // Minimum payment amount (LKR)
  paymentExpiryHours: 24, // Payment link expiry

  // PayHere configuration
  payhere: {
    merchantId: process.env.VITE_PAYHERE_MERCHANT_ID || 'TEST_MERCHANT',
    merchantSecret: process.env.VITE_PAYHERE_SECRET || 'TEST_SECRET',
    sandbox: true, // Set to false in production
    currency: 'LKR',
  },

  // Bank account for manual transfers
  bankAccount: {
    bankName: 'Commercial Bank of Ceylon',
    accountName: 'Recharge Travels (Pvt) Ltd',
    accountNumber: '1234567890',
    branchCode: '001',
    swiftCode: 'CABORLXXX'
  }
};

// ==========================================
// PAYMENT SERVICE
// ==========================================

const PAYMENTS_COLLECTION = 'vehicle_payments';
const PAYMENT_INTENTS_COLLECTION = 'vehicle_payment_intents';

export const vehiclePaymentService = {
  // ==========================================
  // PAYMENT CREATION
  // ==========================================

  /**
   * Create a new payment record
   */
  async createPayment(data: Omit<Payment, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> {
    const paymentRef = doc(collection(db, PAYMENTS_COLLECTION));
    const now = new Date().toISOString();

    const payment: Payment = {
      ...data,
      id: paymentRef.id,
      createdAt: now,
      updatedAt: now
    };

    await setDoc(paymentRef, payment);
    return paymentRef.id;
  },

  /**
   * Create payment intent for gateway processing
   */
  async createPaymentIntent(data: {
    bookingId: string;
    amount: number;
    paymentMethod: PaymentMethod;
    successUrl: string;
    cancelUrl: string;
  }): Promise<PaymentIntent> {
    const intentRef = doc(collection(db, PAYMENT_INTENTS_COLLECTION));
    const now = new Date();
    const expiresAt = new Date(now.getTime() + PAYMENT_CONFIG.paymentExpiryHours * 60 * 60 * 1000);

    const intent: PaymentIntent = {
      id: intentRef.id,
      bookingId: data.bookingId,
      amount: data.amount,
      currency: 'LKR',
      paymentMethod: data.paymentMethod,
      status: 'created',
      successUrl: data.successUrl,
      cancelUrl: data.cancelUrl,
      notifyUrl: `${window.location.origin}/api/payments/webhook`,
      expiresAt: expiresAt.toISOString(),
      createdAt: now.toISOString()
    };

    // Generate gateway-specific data
    if (data.paymentMethod === 'payhere') {
      intent.payHereOrderId = `RT-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
      intent.payHereHash = this.generatePayHereHash(intent);
    }

    await setDoc(intentRef, intent);
    return intent;
  },

  // ==========================================
  // PAYHERE INTEGRATION
  // ==========================================

  /**
   * Generate PayHere payment hash
   */
  generatePayHereHash(intent: PaymentIntent): string {
    const { merchantId, merchantSecret } = PAYMENT_CONFIG.payhere;
    const orderId = intent.payHereOrderId!;
    const amount = intent.amount.toFixed(2);
    const currency = intent.currency;

    // Hash = MD5(merchant_id + order_id + amount + currency + MD5(secret))
    // Note: In production, this should be done server-side
    const secretHash = this.md5(merchantSecret);
    const hashString = `${merchantId}${orderId}${amount}${currency}${secretHash}`;
    return this.md5(hashString).toUpperCase();
  },

  /**
   * Get PayHere checkout URL and parameters
   */
  getPayHereCheckout(intent: PaymentIntent, customer: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    address?: string;
    city?: string;
  }): {
    actionUrl: string;
    params: Record<string, string>;
  } {
    const { merchantId, sandbox } = PAYMENT_CONFIG.payhere;
    const baseUrl = sandbox
      ? 'https://sandbox.payhere.lk/pay/checkout'
      : 'https://www.payhere.lk/pay/checkout';

    return {
      actionUrl: baseUrl,
      params: {
        merchant_id: merchantId,
        return_url: intent.successUrl,
        cancel_url: intent.cancelUrl,
        notify_url: intent.notifyUrl,
        order_id: intent.payHereOrderId!,
        items: 'Vehicle Rental Booking',
        currency: intent.currency,
        amount: intent.amount.toFixed(2),
        first_name: customer.firstName,
        last_name: customer.lastName,
        email: customer.email,
        phone: customer.phone,
        address: customer.address || '',
        city: customer.city || 'Colombo',
        country: 'Sri Lanka',
        hash: intent.payHereHash!
      }
    };
  },

  /**
   * Verify PayHere webhook notification
   */
  verifyPayHereNotification(data: {
    merchant_id: string;
    order_id: string;
    payhere_amount: string;
    payhere_currency: string;
    status_code: string;
    md5sig: string;
  }): boolean {
    const { merchantSecret } = PAYMENT_CONFIG.payhere;
    const localSig = this.md5(
      data.merchant_id +
      data.order_id +
      data.payhere_amount +
      data.payhere_currency +
      data.status_code +
      this.md5(merchantSecret).toUpperCase()
    ).toUpperCase();

    return localSig === data.md5sig;
  },

  // ==========================================
  // BANK TRANSFER
  // ==========================================

  /**
   * Get bank transfer details for manual payment
   */
  getBankTransferDetails(bookingReference: string, amount: number): {
    bankAccount: BankAccount;
    reference: string;
    amount: number;
    instructions: string[];
  } {
    return {
      bankAccount: PAYMENT_CONFIG.bankAccount,
      reference: `VR-${bookingReference}`,
      amount,
      instructions: [
        `Transfer LKR ${amount.toLocaleString()} to the account below`,
        `Use reference: VR-${bookingReference}`,
        'Take a screenshot of the transfer confirmation',
        'Upload the proof of payment in your booking page',
        'Payment will be verified within 2-4 business hours'
      ]
    };
  },

  /**
   * Submit bank transfer proof
   */
  async submitBankTransferProof(paymentId: string, proofUrl: string, reference: string): Promise<void> {
    await updateDoc(doc(db, PAYMENTS_COLLECTION, paymentId), {
      bankTransferProof: proofUrl,
      bankTransferReference: reference,
      status: 'processing',
      updatedAt: new Date().toISOString()
    });
  },

  /**
   * Verify bank transfer (admin action)
   */
  async verifyBankTransfer(paymentId: string, adminId: string, approved: boolean): Promise<void> {
    const status: PaymentStatus = approved ? 'completed' : 'failed';
    const now = new Date().toISOString();

    await updateDoc(doc(db, PAYMENTS_COLLECTION, paymentId), {
      status,
      bankVerifiedBy: adminId,
      bankVerifiedAt: now,
      completedAt: approved ? now : undefined,
      updatedAt: now
    });
  },

  // ==========================================
  // PAYMENT QUERIES
  // ==========================================

  /**
   * Get payment by ID
   */
  async getPaymentById(paymentId: string): Promise<Payment | null> {
    const docSnap = await getDoc(doc(db, PAYMENTS_COLLECTION, paymentId));
    if (!docSnap.exists()) return null;
    return { id: docSnap.id, ...docSnap.data() } as Payment;
  },

  /**
   * Get payments for a booking
   */
  async getPaymentsByBooking(bookingId: string): Promise<Payment[]> {
    const q = query(
      collection(db, PAYMENTS_COLLECTION),
      where('bookingId', '==', bookingId),
      orderBy('createdAt', 'desc')
    );
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Payment));
  },

  /**
   * Get payments for a customer
   */
  async getPaymentsByCustomer(customerId: string): Promise<Payment[]> {
    const q = query(
      collection(db, PAYMENTS_COLLECTION),
      where('customerId', '==', customerId),
      orderBy('createdAt', 'desc')
    );
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Payment));
  },

  /**
   * Get payments for an owner
   */
  async getPaymentsByOwner(ownerId: string): Promise<Payment[]> {
    const q = query(
      collection(db, PAYMENTS_COLLECTION),
      where('ownerId', '==', ownerId),
      orderBy('createdAt', 'desc')
    );
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Payment));
  },

  /**
   * Get pending bank transfers (for admin)
   */
  async getPendingBankTransfers(): Promise<Payment[]> {
    const q = query(
      collection(db, PAYMENTS_COLLECTION),
      where('paymentMethod', '==', 'bank_transfer'),
      where('status', '==', 'processing'),
      orderBy('createdAt', 'desc')
    );
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Payment));
  },

  // ==========================================
  // PAYMENT STATUS UPDATES
  // ==========================================

  /**
   * Update payment status
   */
  async updatePaymentStatus(
    paymentId: string,
    status: PaymentStatus,
    gatewayData?: { transactionId?: string; response?: Record<string, unknown> }
  ): Promise<void> {
    const updates: Partial<Payment> = {
      status,
      updatedAt: new Date().toISOString()
    };

    if (gatewayData?.transactionId) {
      updates.gatewayTransactionId = gatewayData.transactionId;
    }
    if (gatewayData?.response) {
      updates.gatewayResponse = gatewayData.response;
    }
    if (status === 'completed') {
      updates.completedAt = new Date().toISOString();
    }

    await updateDoc(doc(db, PAYMENTS_COLLECTION, paymentId), updates);
  },

  // ==========================================
  // REFUNDS
  // ==========================================

  /**
   * Process refund
   */
  async processRefund(
    paymentId: string,
    amount: number,
    reason: string
  ): Promise<{ success: boolean; refundId?: string; error?: string }> {
    const payment = await this.getPaymentById(paymentId);
    if (!payment) {
      return { success: false, error: 'Payment not found' };
    }

    if (payment.status !== 'completed') {
      return { success: false, error: 'Cannot refund incomplete payment' };
    }

    if (amount > payment.amount) {
      return { success: false, error: 'Refund amount exceeds payment amount' };
    }

    const now = new Date().toISOString();
    const isPartial = amount < payment.amount;

    await updateDoc(doc(db, PAYMENTS_COLLECTION, paymentId), {
      status: isPartial ? 'partially_refunded' : 'refunded',
      refundAmount: amount,
      refundReason: reason,
      refundedAt: now,
      refundTransactionId: `RF-${Date.now()}`,
      updatedAt: now
    });

    return {
      success: true,
      refundId: `RF-${Date.now()}`
    };
  },

  // ==========================================
  // CALCULATIONS
  // ==========================================

  /**
   * Calculate payment breakdown
   */
  calculatePaymentBreakdown(totalAmount: number): {
    amount: number;
    platformFee: number;
    ownerPayout: number;
  } {
    const platformFee = Math.round(totalAmount * (PAYMENT_CONFIG.platformFeePercent / 100));
    const ownerPayout = totalAmount - platformFee;

    return {
      amount: totalAmount,
      platformFee,
      ownerPayout
    };
  },

  /**
   * Get available payment methods
   */
  getAvailablePaymentMethods(): Array<{
    method: PaymentMethod;
    label: string;
    description: string;
    icon: string;
    available: boolean;
  }> {
    return [
      {
        method: 'payhere',
        label: 'PayHere',
        description: 'Pay securely with Visa, Mastercard, or local banks',
        icon: '💳',
        available: true
      },
      {
        method: 'bank_transfer',
        label: 'Bank Transfer',
        description: 'Direct bank transfer (manual verification)',
        icon: '🏦',
        available: true
      },
      {
        method: 'card_on_pickup',
        label: 'Pay at Pickup',
        description: 'Pay by card when collecting the vehicle',
        icon: '🚗',
        available: true
      },
      {
        method: 'cash',
        label: 'Cash Payment',
        description: 'Pay in cash at pickup location',
        icon: '💵',
        available: true
      },
      {
        method: 'stripe',
        label: 'International Cards',
        description: 'Visa, Mastercard, Amex (Coming soon)',
        icon: '🌍',
        available: false
      }
    ];
  },

  // ==========================================
  // UTILITIES
  // ==========================================

  /**
   * Simple MD5 hash (for PayHere)
   * Note: In production, use a proper crypto library
   */
  md5(str: string): string {
    // This is a placeholder - in production, use crypto-js or similar
    // For now, we'll use a simple hash simulation
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash;
    }
    return Math.abs(hash).toString(16).padStart(32, '0');
  },

  /**
   * Format currency for display
   */
  formatCurrency(amount: number, currency: string = 'LKR'): string {
    return new Intl.NumberFormat('en-LK', {
      style: 'currency',
      currency,
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  }
};

export default vehiclePaymentService;
