"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleStripeWebhook = exports.createCheckoutSession = void 0;
const functions = __importStar(require("firebase-functions"));
const admin = __importStar(require("firebase-admin"));
const stripe_1 = __importDefault(require("stripe"));
const db = admin.firestore();
// Initialize Stripe
// firebase functions:config:set stripe.secret_key="YOUR_SECRET_KEY"
const stripe = new stripe_1.default(process.env.STRIPE_SECRET_KEY || ((_a = functions.config().stripe) === null || _a === void 0 ? void 0 : _a.secret_key) || '', {
    apiVersion: '2025-11-17.clover',
});
exports.createCheckoutSession = functions.https.onCall(async (data, context) => {
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
    }
    catch (error) {
        console.error('Stripe error:', error);
        throw new functions.https.HttpsError('internal', error.message);
    }
});
// Optional: Webhook to handle successful payment
exports.handleStripeWebhook = functions.https.onRequest(async (req, res) => {
    var _a, _b;
    const sig = req.headers['stripe-signature'];
    const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET || ((_a = functions.config().stripe) === null || _a === void 0 ? void 0 : _a.webhook_secret);
    let event;
    try {
        if (endpointSecret && sig) {
            event = stripe.webhooks.constructEvent(req.rawBody, sig, endpointSecret);
        }
        else {
            event = req.body;
        }
    }
    catch (err) {
        console.error(`Webhook Error: ${err.message}`);
        res.status(400).send(`Webhook Error: ${err.message}`);
        return;
    }
    if (event.type === 'checkout.session.completed') {
        const session = event.data.object;
        const bookingId = (_b = session.metadata) === null || _b === void 0 ? void 0 : _b.bookingId;
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
//# sourceMappingURL=payments.js.map