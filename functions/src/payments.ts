import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import Stripe from 'stripe';

const db = admin.firestore();

// Initialize Stripe
// firebase functions:config:set stripe.secret_key="YOUR_SECRET_KEY"
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || functions.config().stripe?.secret_key || '', {
    apiVersion: '2025-11-17.clover',
});

export const createCheckoutSession = functions.https.onCall(async (data, context) => {
    const { bookingId, tourTitle, amount, currency = 'usd', successUrl, cancelUrl } = data;

    if (!bookingId || !amount) {
        throw new functions.https.HttpsError('invalid-argument', 'Missing required fields');
    }

    try {
        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            line_items: [
                {
                    price_data: {
                        currency: currency,
                        product_data: {
                            name: tourTitle || 'Tour Booking',
                            description: `Booking Ref: ${bookingId}`,
                        },
                        unit_amount: Math.round(amount * 100), // Amount in cents
                    },
                    quantity: 1,
                },
            ],
            mode: 'payment',
            success_url: successUrl,
            cancel_url: cancelUrl,
            metadata: {
                bookingId: bookingId,
            },
        });

        // Update booking with session ID
        await db.collection('beach_bookings').doc(bookingId).update({
            stripeSessionId: session.id,
            paymentStatus: 'processing'
        });

        return { id: session.id, url: session.url };
    } catch (error: any) {
        console.error('Stripe error:', error);
        throw new functions.https.HttpsError('internal', error.message);
    }
});

// Optional: Webhook to handle successful payment
export const handleStripeWebhook = functions.https.onRequest(async (req, res) => {
    const sig = req.headers['stripe-signature'];
    const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET || functions.config().stripe?.webhook_secret;

    let event;

    try {
        if (endpointSecret && sig) {
            event = stripe.webhooks.constructEvent(req.rawBody, sig as string, endpointSecret);
        } else {
            event = req.body;
        }
    } catch (err: any) {
        console.error(`Webhook Error: ${err.message}`);
        res.status(400).send(`Webhook Error: ${err.message}`);
        return;
    }

    if (event.type === 'checkout.session.completed') {
        const session = event.data.object as Stripe.Checkout.Session;
        const bookingId = session.metadata?.bookingId;

        if (bookingId) {
            await db.collection('beach_bookings').doc(bookingId).update({
                paymentStatus: 'paid',
                paidAt: admin.firestore.FieldValue.serverTimestamp(),
                paymentDetails: session
            });
            console.log(`Payment successful for booking ${bookingId}`);
        }
    }

    res.json({ received: true });
});
