// Stripe Payment Service
// Client-side helpers for Stripe Checkout integration

import { db } from '@/lib/firebase';
import { addDoc, collection, Timestamp, doc, updateDoc, getDoc } from 'firebase/firestore';

// ============================================
// TYPES
// ============================================

export interface StripeCheckoutData {
  bookingRef: string;
  tourId: string;
  tourTitle: string;
  tourCategory: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  travelDate: string;
  travellersAdults: number;
  travellersKids: number;
  pricePerPerson: number;
  totalAmountUSD: number;
  currency?: string;
  successUrl?: string;
  cancelUrl?: string;
}

export interface StripeSession {
  id: string;
  url: string;
  bookingRef: string;
  status: 'pending' | 'paid' | 'failed' | 'expired';
}

// ============================================
// STRIPE CHECKOUT SESSION
// ============================================

/**
 * Create a Stripe Checkout session
 * This queues a request for a Cloud Function to process
 * The Cloud Function will create the actual Stripe session
 */
export const createCheckoutSession = async (
  data: StripeCheckoutData
): Promise<{ success: boolean; sessionId?: string; url?: string; error?: string }> => {
  try {
    const baseUrl = window.location.origin;
    
    // Create checkout request in Firestore
    // A Cloud Function will listen to this and create the Stripe session
    const checkoutRef = await addDoc(collection(db, 'stripeCheckouts'), {
      ...data,
      currency: data.currency || 'USD',
      successUrl: data.successUrl || `${baseUrl}/booking-success?ref=${data.bookingRef}`,
      cancelUrl: data.cancelUrl || `${baseUrl}/booking-cancelled?ref=${data.bookingRef}`,
      status: 'pending',
      createdAt: Timestamp.now(),
      lineItems: [
        {
          name: data.tourTitle,
          description: `${data.travelDate} • ${data.travellersAdults} Adults${data.travellersKids > 0 ? `, ${data.travellersKids} Children` : ''}`,
          amount: Math.round(data.totalAmountUSD * 100), // Stripe uses cents
          currency: 'usd',
          quantity: 1
        }
      ],
      metadata: {
        bookingRef: data.bookingRef,
        tourId: data.tourId,
        customerEmail: data.customerEmail,
        customerPhone: data.customerPhone
      }
    });

    // In production, wait for Cloud Function to update with session URL
    // For now, return the checkout ID
    return {
      success: true,
      sessionId: checkoutRef.id
    };
  } catch (error) {
    console.error('Error creating checkout session:', error);
    return {
      success: false,
      error: 'Failed to create payment session'
    };
  }
};

/**
 * Get Stripe checkout session status
 */
export const getCheckoutStatus = async (sessionId: string): Promise<StripeSession | null> => {
  try {
    const docRef = doc(db, 'stripeCheckouts', sessionId);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      return {
        id: docSnap.id,
        ...docSnap.data()
      } as StripeSession;
    }
    return null;
  } catch (error) {
    console.error('Error getting checkout status:', error);
    return null;
  }
};

/**
 * Update booking payment status after successful Stripe payment
 * Called by webhook or success page
 */
export const updateBookingPayment = async (
  bookingRef: string,
  stripeSessionId: string,
  paymentIntentId: string
): Promise<boolean> => {
  try {
    // Find booking by reference
    const { getDocs, query, where } = await import('firebase/firestore');
    const q = query(
      collection(db, 'globalTourBookings'),
      where('bookingRef', '==', bookingRef)
    );
    const snapshot = await getDocs(q);
    
    if (!snapshot.empty) {
      const bookingDoc = snapshot.docs[0];
      await updateDoc(doc(db, 'globalTourBookings', bookingDoc.id), {
        paymentStatus: 'paid',
        stripeSessionId,
        stripePaymentIntentId: paymentIntentId,
        paidAt: Timestamp.now(),
        updatedAt: Timestamp.now()
      });
      return true;
    }
    return false;
  } catch (error) {
    console.error('Error updating booking payment:', error);
    return false;
  }
};

// ============================================
// STRIPE WEBHOOK HANDLER (Cloud Function)
// ============================================

/*
Firebase Cloud Function example:

const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const functions = require('firebase-functions');
const admin = require('firebase-admin');

exports.stripeWebhook = functions.https.onRequest(async (req, res) => {
  const sig = req.headers['stripe-signature'];
  const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;
  
  let event;
  try {
    event = stripe.webhooks.constructEvent(req.rawBody, sig, endpointSecret);
  } catch (err) {
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object;
    const bookingRef = session.metadata.bookingRef;
    
    // Update booking
    const bookingsRef = admin.firestore().collection('globalTourBookings');
    const snapshot = await bookingsRef.where('bookingRef', '==', bookingRef).get();
    
    if (!snapshot.empty) {
      await snapshot.docs[0].ref.update({
        paymentStatus: 'paid',
        stripeSessionId: session.id,
        stripePaymentIntentId: session.payment_intent,
        paidAt: admin.firestore.FieldValue.serverTimestamp()
      });
      
      // Send confirmation emails/WhatsApp
      // ... trigger notification service
    }
  }

  res.json({ received: true });
});

exports.createStripeSession = functions.firestore
  .document('stripeCheckouts/{checkoutId}')
  .onCreate(async (snap, context) => {
    const data = snap.data();
    
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: data.lineItems.map(item => ({
        price_data: {
          currency: item.currency,
          product_data: {
            name: item.name,
            description: item.description
          },
          unit_amount: item.amount
        },
        quantity: item.quantity
      })),
      mode: 'payment',
      success_url: data.successUrl,
      cancel_url: data.cancelUrl,
      customer_email: data.customerEmail,
      metadata: data.metadata
    });
    
    // Update with session URL
    await snap.ref.update({
      stripeSessionId: session.id,
      url: session.url,
      status: 'created'
    });
});
*/

// ============================================
// ENVIRONMENT VARIABLES NEEDED
// ============================================

/*
Add these to your .env file:

# Stripe
VITE_STRIPE_PUBLISHABLE_KEY=pk_live_xxxx
STRIPE_SECRET_KEY=sk_live_xxxx (server-side only)
STRIPE_WEBHOOK_SECRET=whsec_xxxx (server-side only)

# SendGrid
SENDGRID_API_KEY=SG.xxxx (server-side only)
SENDGRID_FROM_EMAIL=bookings@rechargetravels.com

# WhatsApp Cloud API
WHATSAPP_ACCESS_TOKEN=xxxx (server-side only)
WHATSAPP_PHONE_NUMBER_ID=xxxx
WHATSAPP_BUSINESS_ACCOUNT_ID=xxxx
*/
