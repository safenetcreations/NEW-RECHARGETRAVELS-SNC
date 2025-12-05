/**
 * Vehicle Rental Payment Service
 * Handles Stripe payment integration for vehicle rentals
 * 
 * @module services/vehicleRentalPaymentService
 */

import { db } from '@/lib/firebase';
import {
    addDoc,
    collection,
    Timestamp,
    doc,
    updateDoc,
    getDoc,
    getDocs,
    query,
    where
} from 'firebase/firestore';

// ============================================
// TYPES
// ============================================

export interface VehicleRentalPaymentData {
    bookingId: string;
    bookingReference: string;
    customerId?: string;
    customerName: string;
    customerEmail: string;
    customerPhone: string;
    categoryName: string;
    variantName: string;
    pickupDate: string;
    returnDate: string;
    pickupLocation: string;
    totalDays: number;
    withDriver: boolean;
    driverName?: string;

    // Pricing breakdown
    baseAmount: number;
    driverFee: number;
    addOnsTotal: number;
    seasonalAdjustment: number;
    promoDiscount: number;
    promoCode?: string;
    subtotal: number;
    taxAmount: number;
    totalAmountUSD: number;

    // Deposit options
    depositRequired?: boolean;
    depositAmount?: number;

    // Add-ons breakdown
    addOns?: Array<{
        name: string;
        price: number;
        perDay: boolean;
        quantity: number;
    }>;
}

export interface PaymentSession {
    id: string;
    bookingId: string;
    bookingReference: string;
    stripeSessionId?: string;
    stripePaymentIntentId?: string;
    amount: number;
    currency: string;
    paymentType: 'full' | 'deposit' | 'balance';
    status: 'pending' | 'processing' | 'paid' | 'failed' | 'refunded' | 'cancelled';
    customerEmail: string;
    checkoutUrl?: string;
    paidAt?: any;
    createdAt: any;
    updatedAt: any;
    metadata?: Record<string, any>;
}

export interface RefundRequest {
    paymentSessionId: string;
    bookingId: string;
    amount: number;
    reason: string;
    refundType: 'full' | 'partial';
    requestedBy: string;
    status: 'pending' | 'approved' | 'processed' | 'rejected';
    processedAt?: any;
    stripeRefundId?: string;
}

// ============================================
// PAYMENT SESSION MANAGEMENT
// ============================================

/**
 * Create a payment session for vehicle rental
 */
export async function createPaymentSession(
    data: VehicleRentalPaymentData,
    paymentType: 'full' | 'deposit' = 'full'
): Promise<{ success: boolean; sessionId?: string; checkoutUrl?: string; error?: string }> {
    try {
        const baseUrl = window.location.origin;

        // Calculate amount based on payment type
        const amount = paymentType === 'deposit'
            ? (data.depositAmount || data.totalAmountUSD * 0.3) // 30% deposit
            : data.totalAmountUSD;

        // Create payment session in Firestore
        const sessionRef = await addDoc(collection(db, 'vehicleRentalPayments'), {
            bookingId: data.bookingId,
            bookingReference: data.bookingReference,
            customerId: data.customerId,
            customerName: data.customerName,
            customerEmail: data.customerEmail,
            customerPhone: data.customerPhone,

            // Vehicle details
            categoryName: data.categoryName,
            variantName: data.variantName,
            pickupDate: data.pickupDate,
            returnDate: data.returnDate,
            pickupLocation: data.pickupLocation,
            totalDays: data.totalDays,
            withDriver: data.withDriver,
            driverName: data.driverName,

            // Pricing
            baseAmount: data.baseAmount,
            driverFee: data.driverFee,
            addOnsTotal: data.addOnsTotal,
            seasonalAdjustment: data.seasonalAdjustment,
            promoDiscount: data.promoDiscount,
            promoCode: data.promoCode,
            subtotal: data.subtotal,
            taxAmount: data.taxAmount,
            totalAmountUSD: data.totalAmountUSD,
            addOns: data.addOns || [],

            // Payment details
            amount: amount,
            currency: 'USD',
            paymentType,
            status: 'pending',

            // URLs
            successUrl: `${baseUrl}/vehicle-rental/payment-success?ref=${data.bookingReference}`,
            cancelUrl: `${baseUrl}/vehicle-rental/payment-cancelled?ref=${data.bookingReference}`,

            // Stripe line items for checkout
            lineItems: [
                {
                    name: `${data.categoryName} - ${data.variantName}`,
                    description: `${data.pickupDate} to ${data.returnDate} (${data.totalDays} days)${data.withDriver ? ' with driver' : ''}`,
                    amount: Math.round(amount * 100), // Stripe uses cents
                    currency: 'usd',
                    quantity: 1
                }
            ],

            // Metadata for webhook
            metadata: {
                bookingId: data.bookingId,
                bookingReference: data.bookingReference,
                customerEmail: data.customerEmail,
                paymentType,
                categoryName: data.categoryName,
                variantName: data.variantName
            },

            createdAt: Timestamp.now(),
            updatedAt: Timestamp.now()
        });

        // Generate WhatsApp link for manual payment option
        const whatsAppLink = generatePaymentWhatsAppLink(data, amount);

        return {
            success: true,
            sessionId: sessionRef.id,
            checkoutUrl: whatsAppLink // For now, use WhatsApp link; Stripe URL comes from Cloud Function
        };
    } catch (error) {
        console.error('Error creating payment session:', error);
        return {
            success: false,
            error: error instanceof Error ? error.message : 'Failed to create payment session'
        };
    }
}

/**
 * Get payment session by ID
 */
export async function getPaymentSession(sessionId: string): Promise<PaymentSession | null> {
    try {
        const docRef = doc(db, 'vehicleRentalPayments', sessionId);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
            return { id: docSnap.id, ...docSnap.data() } as PaymentSession;
        }
        return null;
    } catch (error) {
        console.error('Error getting payment session:', error);
        return null;
    }
}

/**
 * Get payment sessions for a booking
 */
export async function getPaymentsByBooking(bookingId: string): Promise<PaymentSession[]> {
    try {
        const q = query(
            collection(db, 'vehicleRentalPayments'),
            where('bookingId', '==', bookingId)
        );
        const snapshot = await getDocs(q);
        return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as PaymentSession));
    } catch (error) {
        console.error('Error getting payments by booking:', error);
        return [];
    }
}

/**
 * Update payment status after Stripe webhook or manual confirmation
 */
export async function updatePaymentStatus(
    sessionId: string,
    status: PaymentSession['status'],
    stripeData?: {
        stripeSessionId?: string;
        stripePaymentIntentId?: string;
    }
): Promise<boolean> {
    try {
        const docRef = doc(db, 'vehicleRentalPayments', sessionId);

        const updateData: Record<string, any> = {
            status,
            updatedAt: Timestamp.now()
        };

        if (status === 'paid') {
            updateData.paidAt = Timestamp.now();
        }

        if (stripeData?.stripeSessionId) {
            updateData.stripeSessionId = stripeData.stripeSessionId;
        }

        if (stripeData?.stripePaymentIntentId) {
            updateData.stripePaymentIntentId = stripeData.stripePaymentIntentId;
        }

        await updateDoc(docRef, updateData);

        // Also update the booking status
        const session = await getPaymentSession(sessionId);
        if (session && status === 'paid') {
            await updateBookingPaymentStatus(session.bookingId, 'paid', session.paymentType);
        }

        return true;
    } catch (error) {
        console.error('Error updating payment status:', error);
        return false;
    }
}

/**
 * Update booking payment status
 */
async function updateBookingPaymentStatus(
    bookingId: string,
    paymentStatus: string,
    paymentType: string
): Promise<void> {
    try {
        const docRef = doc(db, 'vehicleRentalBookings', bookingId);

        await updateDoc(docRef, {
            paymentStatus: paymentStatus,
            paymentType: paymentType,
            status: paymentType === 'deposit' ? 'deposit_paid' : 'paid',
            paidAt: Timestamp.now(),
            updatedAt: Timestamp.now()
        });
    } catch (error) {
        console.error('Error updating booking payment status:', error);
    }
}

/**
 * Process manual payment confirmation (for admin)
 */
export async function confirmManualPayment(
    bookingId: string,
    paymentDetails: {
        amount: number;
        paymentMethod: 'cash' | 'bank_transfer' | 'card_manual' | 'other';
        reference?: string;
        notes?: string;
        confirmedBy: string;
    }
): Promise<{ success: boolean; error?: string }> {
    try {
        // Create payment record
        const paymentRef = await addDoc(collection(db, 'vehicleRentalPayments'), {
            bookingId,
            amount: paymentDetails.amount,
            currency: 'USD',
            paymentType: 'manual',
            paymentMethod: paymentDetails.paymentMethod,
            reference: paymentDetails.reference,
            notes: paymentDetails.notes,
            confirmedBy: paymentDetails.confirmedBy,
            status: 'paid',
            paidAt: Timestamp.now(),
            createdAt: Timestamp.now(),
            updatedAt: Timestamp.now()
        });

        // Update booking
        await updateDoc(doc(db, 'vehicleRentalBookings', bookingId), {
            paymentStatus: 'paid',
            paymentMethod: paymentDetails.paymentMethod,
            paymentReference: paymentDetails.reference,
            status: 'paid',
            paidAt: Timestamp.now(),
            updatedAt: Timestamp.now()
        });

        return { success: true };
    } catch (error) {
        console.error('Error confirming manual payment:', error);
        return {
            success: false,
            error: error instanceof Error ? error.message : 'Failed to confirm payment'
        };
    }
}

// ============================================
// REFUND MANAGEMENT
// ============================================

/**
 * Request a refund
 */
export async function requestRefund(
    request: Omit<RefundRequest, 'status' | 'processedAt'>
): Promise<{ success: boolean; refundId?: string; error?: string }> {
    try {
        const refundRef = await addDoc(collection(db, 'vehicleRentalRefunds'), {
            ...request,
            status: 'pending',
            createdAt: Timestamp.now(),
            updatedAt: Timestamp.now()
        });

        return { success: true, refundId: refundRef.id };
    } catch (error) {
        console.error('Error requesting refund:', error);
        return {
            success: false,
            error: error instanceof Error ? error.message : 'Failed to request refund'
        };
    }
}

/**
 * Process refund (admin function - calls Stripe API via Cloud Function)
 */
export async function processRefund(
    refundId: string,
    approved: boolean,
    processedBy: string,
    notes?: string
): Promise<{ success: boolean; error?: string }> {
    try {
        await updateDoc(doc(db, 'vehicleRentalRefunds', refundId), {
            status: approved ? 'approved' : 'rejected',
            processedBy,
            processedAt: Timestamp.now(),
            processingNotes: notes,
            updatedAt: Timestamp.now()
        });

        // If approved, the Stripe refund will be processed by a Cloud Function
        // that listens to refund status changes

        return { success: true };
    } catch (error) {
        console.error('Error processing refund:', error);
        return {
            success: false,
            error: error instanceof Error ? error.message : 'Failed to process refund'
        };
    }
}

// ============================================
// PRICING CALCULATIONS
// ============================================

export interface PriceCalculationParams {
    basePrice: number;
    totalDays: number;
    withDriver: boolean;
    driverFeePerDay?: number;
    addOns: Array<{
        name: string;
        price: number;
        perDay: boolean;
        quantity?: number;
    }>;
    seasonalPricing?: {
        percentage: number;
        type: 'increase' | 'decrease';
    };
    promoCode?: {
        discountType: 'percentage' | 'fixed';
        discountValue: number;
        minimumDays?: number;
    };
    taxRate?: number;
}

export interface PriceBreakdown {
    baseAmount: number;
    driverFee: number;
    addOnsTotal: number;
    addOnsBreakdown: Array<{ name: string; total: number }>;
    subtotalBeforeAdjustments: number;
    seasonalAdjustment: number;
    subtotalAfterSeasonal: number;
    promoDiscount: number;
    subtotal: number;
    taxAmount: number;
    totalAmount: number;
    depositAmount: number; // 30% of total
    balanceAmount: number; // 70% of total
}

/**
 * Calculate price breakdown for vehicle rental
 */
export function calculateRentalPrice(params: PriceCalculationParams): PriceBreakdown {
    const {
        basePrice,
        totalDays,
        withDriver,
        driverFeePerDay = 50,
        addOns,
        seasonalPricing,
        promoCode,
        taxRate = 0
    } = params;

    // Base amount
    const baseAmount = basePrice * totalDays;

    // Driver fee
    const driverFee = withDriver ? driverFeePerDay * totalDays : 0;

    // Add-ons
    const addOnsBreakdown = addOns.map(addon => ({
        name: addon.name,
        total: addon.perDay
            ? addon.price * totalDays * (addon.quantity || 1)
            : addon.price * (addon.quantity || 1)
    }));
    const addOnsTotal = addOnsBreakdown.reduce((sum, a) => sum + a.total, 0);

    // Subtotal before adjustments
    const subtotalBeforeAdjustments = baseAmount + driverFee + addOnsTotal;

    // Seasonal adjustment
    let seasonalAdjustment = 0;
    if (seasonalPricing) {
        const adjustmentAmount = subtotalBeforeAdjustments * (seasonalPricing.percentage / 100);
        seasonalAdjustment = seasonalPricing.type === 'increase'
            ? adjustmentAmount
            : -adjustmentAmount;
    }
    const subtotalAfterSeasonal = subtotalBeforeAdjustments + seasonalAdjustment;

    // Promo discount
    let promoDiscount = 0;
    if (promoCode) {
        const meetsMinDays = !promoCode.minimumDays || totalDays >= promoCode.minimumDays;
        if (meetsMinDays) {
            promoDiscount = promoCode.discountType === 'percentage'
                ? subtotalAfterSeasonal * (promoCode.discountValue / 100)
                : promoCode.discountValue;
        }
    }
    const subtotal = subtotalAfterSeasonal - promoDiscount;

    // Tax
    const taxAmount = subtotal * (taxRate / 100);
    const totalAmount = subtotal + taxAmount;

    // Deposit (30%)
    const depositAmount = Math.round(totalAmount * 0.3 * 100) / 100;
    const balanceAmount = Math.round((totalAmount - depositAmount) * 100) / 100;

    return {
        baseAmount: Math.round(baseAmount * 100) / 100,
        driverFee: Math.round(driverFee * 100) / 100,
        addOnsTotal: Math.round(addOnsTotal * 100) / 100,
        addOnsBreakdown,
        subtotalBeforeAdjustments: Math.round(subtotalBeforeAdjustments * 100) / 100,
        seasonalAdjustment: Math.round(seasonalAdjustment * 100) / 100,
        subtotalAfterSeasonal: Math.round(subtotalAfterSeasonal * 100) / 100,
        promoDiscount: Math.round(promoDiscount * 100) / 100,
        subtotal: Math.round(subtotal * 100) / 100,
        taxAmount: Math.round(taxAmount * 100) / 100,
        totalAmount: Math.round(totalAmount * 100) / 100,
        depositAmount,
        balanceAmount
    };
}

// ============================================
// HELPER FUNCTIONS
// ============================================

/**
 * Generate WhatsApp payment link for manual payments
 */
function generatePaymentWhatsAppLink(data: VehicleRentalPaymentData, amount: number): string {
    const message = `🚗 *Vehicle Rental Payment*

Booking: ${data.bookingReference}
Vehicle: ${data.categoryName} - ${data.variantName}
Dates: ${data.pickupDate} to ${data.returnDate}
Duration: ${data.totalDays} days

💰 *Amount Due: $${amount.toFixed(2)}*

Customer: ${data.customerName}
Email: ${data.customerEmail}

Please send payment details for confirmation.`;

    const phone = '94771234567'; // Support phone number
    return `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
}

/**
 * Format currency for display
 */
export function formatCurrency(amount: number, currency: string = 'USD'): string {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency
    }).format(amount);
}

/**
 * Generate payment receipt number
 */
export function generateReceiptNumber(): string {
    const date = new Date();
    const year = date.getFullYear().toString().slice(-2);
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const random = Math.random().toString(36).substring(2, 8).toUpperCase();
    return `REC-${year}${month}-${random}`;
}

/**
 * Check if promo code is valid
 */
export async function validatePromoCode(
    code: string,
    totalDays: number
): Promise<{
    valid: boolean;
    discountType?: 'percentage' | 'fixed';
    discountValue?: number;
    error?: string;
}> {
    try {
        const q = query(
            collection(db, 'vehiclePromoCodes'),
            where('code', '==', code.toUpperCase()),
            where('isActive', '==', true)
        );
        const snapshot = await getDocs(q);

        if (snapshot.empty) {
            return { valid: false, error: 'Invalid promo code' };
        }

        const promo = snapshot.docs[0].data();

        // Check expiry
        if (promo.validUntil && promo.validUntil.toDate() < new Date()) {
            return { valid: false, error: 'Promo code has expired' };
        }

        // Check minimum days
        if (promo.minimumDays && totalDays < promo.minimumDays) {
            return { valid: false, error: `Minimum ${promo.minimumDays} days required` };
        }

        // Check usage limit
        if (promo.maxUses && promo.usedCount >= promo.maxUses) {
            return { valid: false, error: 'Promo code usage limit reached' };
        }

        return {
            valid: true,
            discountType: promo.discountType,
            discountValue: promo.discountValue
        };
    } catch (error) {
        console.error('Error validating promo code:', error);
        return { valid: false, error: 'Failed to validate promo code' };
    }
}

export default {
    createPaymentSession,
    getPaymentSession,
    getPaymentsByBooking,
    updatePaymentStatus,
    confirmManualPayment,
    requestRefund,
    processRefund,
    calculateRentalPrice,
    validatePromoCode,
    formatCurrency,
    generateReceiptNumber
};
