"use strict";
/**
 * B2B Portal API - Express App for Firebase Cloud Functions
 * Handles agency authentication, tour bookings, and notifications
 */
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
var _a, _b, _c;
Object.defineProperty(exports, "__esModule", { value: true });
exports.b2bApi = void 0;
const functions = __importStar(require("firebase-functions"));
const admin = __importStar(require("firebase-admin"));
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const bcrypt = __importStar(require("bcryptjs"));
const jwt = __importStar(require("jsonwebtoken"));
// Import SendGrid email service
const sendgrid_1 = require("../emails/sendgrid");
const app = (0, express_1.default)();
const db = admin.firestore();
// Middleware
app.use((0, cors_1.default)({ origin: true, credentials: true }));
app.use(express_1.default.json({ limit: '50mb' }));
// JWT Secret (should be in environment config)
const JWT_SECRET = ((_a = functions.config().b2b) === null || _a === void 0 ? void 0 : _a.jwt_secret) || 'recharge-b2b-secret-key-change-in-production';
const JWT_EXPIRE = '7d';
// Frontend URL
const FRONTEND_URL = ((_b = functions.config().b2b) === null || _b === void 0 ? void 0 : _b.frontend_url) || 'https://rechargetravels.com';
const verifyToken = async (req, res, next) => {
    var _a;
    try {
        const token = (_a = req.headers.authorization) === null || _a === void 0 ? void 0 : _a.split(' ')[1];
        if (!token) {
            return res.status(401).json({ success: false, message: 'No token provided' });
        }
        const decoded = jwt.verify(token, JWT_SECRET);
        req.user = decoded;
        next();
    }
    catch (error) {
        return res.status(401).json({ success: false, message: 'Invalid or expired token' });
    }
};
const verifyAgency = async (req, res, next) => {
    try {
        const agencyId = req.user.agencyId;
        const agencyDoc = await db.collection('b2b_agencies').doc(agencyId).get();
        if (!agencyDoc.exists) {
            return res.status(403).json({ success: false, message: 'Agency not found' });
        }
        const agencyData = agencyDoc.data();
        if ((agencyData === null || agencyData === void 0 ? void 0 : agencyData.status) !== 'active') {
            return res.status(403).json({
                success: false,
                message: `Account status: ${agencyData === null || agencyData === void 0 ? void 0 : agencyData.status}. Please wait for admin approval.`
            });
        }
        req.agency = Object.assign({ id: agencyId }, agencyData);
        next();
    }
    catch (error) {
        return res.status(500).json({ success: false, message: 'Error verifying agency' });
    }
};
// ==================== HELPER FUNCTIONS ====================
const generateToken = (agencyId, email, agencyName) => {
    return jwt.sign({ agencyId, email, agencyName }, JWT_SECRET, { expiresIn: JWT_EXPIRE });
};
// Legacy sendEmail wrapper using SendGrid service
const sendEmail = async (to, subject, html) => {
    return (0, sendgrid_1.sendEmail)({ to, subject, html });
};
const calculateBookingPrice = (basePrice, pax) => {
    const discountPercentage = 10;
    const grossCents = Math.round(basePrice * pax * 100);
    const discountCents = Math.floor(grossCents * (discountPercentage / 100));
    const netCents = grossCents - discountCents;
    return {
        originalPrice: grossCents / 100,
        discountPercentage,
        discount: discountCents / 100,
        finalPrice: netCents / 100
    };
};
// ==================== AUTH ROUTES ====================
// Register Agency
app.post('/auth/register', async (req, res) => {
    try {
        const { agencyName, email, phone, password, country, companySize, taxId } = req.body;
        if (!agencyName || !email || !password || !phone) {
            return res.status(400).json({ success: false, message: 'Missing required fields' });
        }
        // Check if exists
        const existing = await db.collection('b2b_agencies').where('email', '==', email).get();
        if (!existing.empty) {
            return res.status(400).json({ success: false, message: 'Email already registered' });
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const verificationCode = Math.random().toString(36).substring(2, 8).toUpperCase();
        const newAgency = {
            agencyName,
            email,
            phone,
            password: hashedPassword,
            country,
            companySize,
            taxId,
            status: 'pending',
            createdAt: admin.firestore.FieldValue.serverTimestamp(),
            verificationCode,
            emailVerified: false,
            subscriptionTier: 'free',
            totalBookings: 0,
            totalRevenue: 0
        };
        const docRef = await db.collection('b2b_agencies').add(newAgency);
        // Send professional welcome & verification email
        const verificationUrl = `${FRONTEND_URL}/about/partners/b2b/verify?code=${verificationCode}&id=${docRef.id}`;
        await (0, sendgrid_1.sendAgencyWelcome)({
            to: email,
            agencyName,
            verificationLink: verificationUrl
        });
        res.status(201).json({
            success: true,
            message: 'Registration successful. Please verify your email.',
            agencyId: docRef.id
        });
    }
    catch (error) {
        res.status(500).json({ success: false, message: 'Registration failed', error: error.message });
    }
});
// Verify Email
app.post('/auth/verify-email', async (req, res) => {
    try {
        const { agencyId, verificationCode } = req.body;
        const agencyDoc = await db.collection('b2b_agencies').doc(agencyId).get();
        if (!agencyDoc.exists) {
            return res.status(404).json({ success: false, message: 'Agency not found' });
        }
        const agencyData = agencyDoc.data();
        if ((agencyData === null || agencyData === void 0 ? void 0 : agencyData.verificationCode) !== verificationCode) {
            return res.status(400).json({ success: false, message: 'Invalid verification code' });
        }
        await db.collection('b2b_agencies').doc(agencyId).update({
            emailVerified: true,
            verificationCode: null,
            status: 'active' // Auto-activate after email verification
        });
        res.json({ success: true, message: 'Email verified successfully' });
    }
    catch (error) {
        res.status(500).json({ success: false, message: 'Verification failed', error: error.message });
    }
});
// Login
app.post('/auth/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({ success: false, message: 'Email and password required' });
        }
        const snapshot = await db.collection('b2b_agencies').where('email', '==', email).get();
        if (snapshot.empty) {
            return res.status(401).json({ success: false, message: 'Invalid credentials' });
        }
        const agencyDoc = snapshot.docs[0];
        const agencyData = agencyDoc.data();
        const agencyId = agencyDoc.id;
        const isPasswordValid = await bcrypt.compare(password, agencyData.password);
        if (!isPasswordValid) {
            return res.status(401).json({ success: false, message: 'Invalid credentials' });
        }
        if (!agencyData.emailVerified) {
            return res.status(403).json({ success: false, message: 'Please verify your email first' });
        }
        if (agencyData.status !== 'active') {
            return res.status(403).json({
                success: false,
                message: `Account status: ${agencyData.status}. Please wait for admin approval.`
            });
        }
        const token = generateToken(agencyId, email, agencyData.agencyName);
        res.json({
            success: true,
            message: 'Login successful',
            token,
            agency: {
                id: agencyId,
                agencyName: agencyData.agencyName,
                email: agencyData.email,
                subscriptionTier: agencyData.subscriptionTier,
                totalBookings: agencyData.totalBookings
            }
        });
    }
    catch (error) {
        res.status(500).json({ success: false, message: 'Login failed', error: error.message });
    }
});
// Reset Password Request
app.post('/auth/reset-password', async (req, res) => {
    try {
        const { email } = req.body;
        const snapshot = await db.collection('b2b_agencies').where('email', '==', email).get();
        if (snapshot.empty) {
            return res.status(404).json({ success: false, message: 'Agency not found' });
        }
        const agencyId = snapshot.docs[0].id;
        const resetToken = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
        await db.collection('b2b_password_resets').add({
            agencyId,
            token: resetToken,
            expiresAt: new Date(Date.now() + 3600000),
            createdAt: admin.firestore.FieldValue.serverTimestamp()
        });
        const resetUrl = `${FRONTEND_URL}/about/partners/b2b/reset-password?token=${resetToken}`;
        const agencyData = snapshot.docs[0].data();
        await (0, sendgrid_1.sendPasswordReset)({
            to: email,
            agencyName: agencyData.agencyName,
            resetLink: resetUrl
        });
        res.json({ success: true, message: 'Reset link sent to email' });
    }
    catch (error) {
        res.status(500).json({ success: false, message: 'Password reset failed', error: error.message });
    }
});
// ==================== TOURS ROUTES ====================
// Get All Tours
app.get('/tours', async (req, res) => {
    try {
        const { category, minPrice, maxPrice, page = '1', limit = '20' } = req.query;
        let query = db.collection('tours').where('isActive', '==', true);
        if (category) {
            query = query.where('category', '==', category);
        }
        const snapshot = await query.get();
        const tours = [];
        snapshot.forEach(doc => {
            const tourData = doc.data();
            const price = tourData.priceUSD || tourData.price;
            if ((!minPrice || price >= Number(minPrice)) && (!maxPrice || price <= Number(maxPrice))) {
                tours.push({
                    id: doc.id,
                    tourName: tourData.tourName || tourData.name || tourData.title,
                    category: tourData.category,
                    description: tourData.description,
                    priceUSD: price,
                    duration: tourData.duration,
                    maxCapacity: tourData.maxCapacity || 20,
                    images: tourData.images || [tourData.image],
                    meetingPoint: tourData.meetingPoint || 'Colombo',
                    departureTime: tourData.departureTime || '7:00 AM',
                    isActive: tourData.isActive
                });
            }
        });
        // Pagination
        const pageNum = parseInt(page);
        const limitNum = parseInt(limit);
        const start = (pageNum - 1) * limitNum;
        const paginatedTours = tours.slice(start, start + limitNum);
        res.json({
            success: true,
            data: paginatedTours,
            total: tours.length,
            page: pageNum,
            limit: limitNum
        });
    }
    catch (error) {
        res.status(500).json({ success: false, message: 'Failed to fetch tours', error: error.message });
    }
});
// Get Tour Detail
app.get('/tours/:tourId', async (req, res) => {
    try {
        const { tourId } = req.params;
        const tourDoc = await db.collection('tours').doc(tourId).get();
        if (!tourDoc.exists) {
            return res.status(404).json({ success: false, message: 'Tour not found' });
        }
        const tourData = tourDoc.data();
        res.json({
            success: true,
            data: {
                id: tourDoc.id,
                tourName: (tourData === null || tourData === void 0 ? void 0 : tourData.tourName) || (tourData === null || tourData === void 0 ? void 0 : tourData.name) || (tourData === null || tourData === void 0 ? void 0 : tourData.title),
                category: tourData === null || tourData === void 0 ? void 0 : tourData.category,
                description: tourData === null || tourData === void 0 ? void 0 : tourData.description,
                itinerary: (tourData === null || tourData === void 0 ? void 0 : tourData.itinerary) || [],
                priceUSD: (tourData === null || tourData === void 0 ? void 0 : tourData.priceUSD) || (tourData === null || tourData === void 0 ? void 0 : tourData.price),
                duration: tourData === null || tourData === void 0 ? void 0 : tourData.duration,
                maxCapacity: (tourData === null || tourData === void 0 ? void 0 : tourData.maxCapacity) || 20,
                availableDates: (tourData === null || tourData === void 0 ? void 0 : tourData.availableDates) || [],
                meetingPoint: (tourData === null || tourData === void 0 ? void 0 : tourData.meetingPoint) || 'Colombo',
                departureTime: (tourData === null || tourData === void 0 ? void 0 : tourData.departureTime) || '7:00 AM',
                images: (tourData === null || tourData === void 0 ? void 0 : tourData.images) || [tourData === null || tourData === void 0 ? void 0 : tourData.image],
                inclusions: (tourData === null || tourData === void 0 ? void 0 : tourData.inclusions) || [],
                exclusions: (tourData === null || tourData === void 0 ? void 0 : tourData.exclusions) || []
            }
        });
    }
    catch (error) {
        res.status(500).json({ success: false, message: 'Failed to fetch tour', error: error.message });
    }
});
// ==================== BOOKING ROUTES ====================
// Create Booking (Protected)
app.post('/bookings', verifyToken, verifyAgency, async (req, res) => {
    try {
        const agencyId = req.user.agencyId;
        const { tourId, guestCount, clientName, clientEmail, clientPhone, tourDate, specialRequests, isAirportTransfer, isEmergency } = req.body;
        // Get tour details
        const tourDoc = await db.collection('tours').doc(tourId).get();
        if (!tourDoc.exists) {
            return res.status(404).json({ success: false, message: 'Tour not found' });
        }
        const tourData = tourDoc.data();
        const tourPrice = (tourData === null || tourData === void 0 ? void 0 : tourData.priceUSD) || (tourData === null || tourData === void 0 ? void 0 : tourData.price) || 0;
        const tourName = (tourData === null || tourData === void 0 ? void 0 : tourData.tourName) || (tourData === null || tourData === void 0 ? void 0 : tourData.name) || (tourData === null || tourData === void 0 ? void 0 : tourData.title);
        // Check 48-hour rule
        const departureDate = new Date(tourDate);
        const hoursUntilDeparture = (departureDate.getTime() - Date.now()) / (1000 * 60 * 60);
        if (!isEmergency && hoursUntilDeparture < 48) {
            return res.status(400).json({
                success: false,
                message: 'Bookings must be made at least 48 hours in advance. Mark as emergency for urgent requests.'
            });
        }
        // Calculate pricing with 10% discount
        const pricing = calculateBookingPrice(tourPrice, guestCount);
        // Create booking
        const bookingData = Object.assign(Object.assign({ agencyId,
            tourId,
            tourName, guestCount: parseInt(guestCount), clientName,
            clientEmail,
            clientPhone,
            tourDate }, pricing), { specialRequests: specialRequests || '', isAirportTransfer: isAirportTransfer || false, isEmergency: isEmergency || false, status: 'confirmed', paymentStatus: 'pending', documents: [], createdAt: admin.firestore.FieldValue.serverTimestamp() });
        const bookingRef = await db.collection('b2b_bookings').add(bookingData);
        const bookingId = bookingRef.id;
        // Update agency stats
        await db.collection('b2b_agencies').doc(agencyId).update({
            totalBookings: admin.firestore.FieldValue.increment(1),
            totalRevenue: admin.firestore.FieldValue.increment(pricing.finalPrice)
        });
        // Send professional booking confirmation email
        const agency = req.agency;
        await (0, sendgrid_1.sendBookingConfirmation)({
            to: agency.email,
            bookingId,
            agencyName: agency.agencyName,
            tourName,
            tourDate,
            clientName,
            clientEmail,
            clientPhone,
            guestCount: parseInt(guestCount),
            originalPrice: pricing.originalPrice,
            discount: pricing.discount,
            finalPrice: pricing.finalPrice,
            specialRequests
        });
        // Create WhatsApp message document (trigger existing WhatsApp function)
        await db.collection('whatsappMessages').add({
            to: clientPhone,
            message: `🎉 Booking Confirmed!\n\nBooking ID: ${bookingId}\nTour: ${tourName}\nDate: ${tourDate}\nGuests: ${guestCount}\nTotal: $${pricing.finalPrice.toFixed(2)}\n\nThank you for booking with Recharge Travels!`,
            createdAt: admin.firestore.FieldValue.serverTimestamp()
        });
        res.status(201).json({
            success: true,
            message: 'Booking created successfully',
            bookingId,
            data: Object.assign(Object.assign({}, bookingData), { id: bookingId })
        });
    }
    catch (error) {
        res.status(500).json({ success: false, message: 'Failed to create booking', error: error.message });
    }
});
// Get Agency Bookings (Protected)
app.get('/bookings', verifyToken, verifyAgency, async (req, res) => {
    try {
        const agencyId = req.user.agencyId;
        const { status, page = '1', limit = '20' } = req.query;
        let query = db.collection('b2b_bookings').where('agencyId', '==', agencyId);
        if (status) {
            query = query.where('status', '==', status);
        }
        const snapshot = await query.orderBy('createdAt', 'desc').get();
        const bookings = [];
        snapshot.forEach(doc => {
            var _a, _b;
            const data = doc.data();
            bookings.push(Object.assign(Object.assign({ id: doc.id }, data), { createdAt: ((_b = (_a = data.createdAt) === null || _a === void 0 ? void 0 : _a.toDate) === null || _b === void 0 ? void 0 : _b.call(_a)) || new Date() }));
        });
        // Pagination
        const pageNum = parseInt(page);
        const limitNum = parseInt(limit);
        const start = (pageNum - 1) * limitNum;
        const paginatedBookings = bookings.slice(start, start + limitNum);
        res.json({
            success: true,
            data: paginatedBookings,
            total: bookings.length,
            page: pageNum,
            limit: limitNum
        });
    }
    catch (error) {
        res.status(500).json({ success: false, message: 'Failed to fetch bookings', error: error.message });
    }
});
// Cancel Booking (Protected)
app.delete('/bookings/:bookingId', verifyToken, verifyAgency, async (req, res) => {
    try {
        const { bookingId } = req.params;
        const agencyId = req.user.agencyId;
        const bookingDoc = await db.collection('b2b_bookings').doc(bookingId).get();
        if (!bookingDoc.exists) {
            return res.status(404).json({ success: false, message: 'Booking not found' });
        }
        const booking = bookingDoc.data();
        if ((booking === null || booking === void 0 ? void 0 : booking.agencyId) !== agencyId) {
            return res.status(403).json({ success: false, message: 'Not authorized to cancel this booking' });
        }
        await db.collection('b2b_bookings').doc(bookingId).update({
            status: 'cancelled',
            cancelledAt: admin.firestore.FieldValue.serverTimestamp()
        });
        // Deduct from agency revenue
        await db.collection('b2b_agencies').doc(agencyId).update({
            totalRevenue: admin.firestore.FieldValue.increment(-booking.finalPrice)
        });
        // Send professional cancellation email
        const agency = req.agency;
        await (0, sendgrid_1.sendBookingCancellation)({
            to: agency.email,
            bookingId,
            tourName: booking.tourName,
            tourDate: booking.tourDate,
            refundAmount: booking.paymentStatus === 'paid' ? booking.finalPrice : undefined,
            reason: 'Cancelled by agency'
        });
        // Also notify client
        if (booking.clientEmail) {
            await (0, sendgrid_1.sendBookingCancellation)({
                to: booking.clientEmail,
                bookingId,
                tourName: booking.tourName,
                tourDate: booking.tourDate,
                refundAmount: booking.paymentStatus === 'paid' ? booking.finalPrice : undefined
            });
        }
        res.json({ success: true, message: 'Booking cancelled successfully' });
    }
    catch (error) {
        res.status(500).json({ success: false, message: 'Failed to cancel booking', error: error.message });
    }
});
// ==================== PAYMENT ROUTES ====================
const stripe_1 = __importDefault(require("stripe"));
const stripeSecretKey = (_c = functions.config().stripe) === null || _c === void 0 ? void 0 : _c.secret_key;
const stripe = stripeSecretKey ? new stripe_1.default(stripeSecretKey, { apiVersion: '2025-11-17.clover' }) : null;
// Create Stripe Checkout Session (Protected)
app.post('/payments/create-checkout', verifyToken, verifyAgency, async (req, res) => {
    var _a;
    try {
        if (!stripe) {
            return res.status(500).json({ success: false, message: 'Payment service not configured' });
        }
        const { bookingId, amount, tourName } = req.body;
        const agencyId = req.user.agencyId;
        const agency = req.agency;
        // Verify booking
        const bookingDoc = await db.collection('b2b_bookings').doc(bookingId).get();
        if (!bookingDoc.exists || ((_a = bookingDoc.data()) === null || _a === void 0 ? void 0 : _a.agencyId) !== agencyId) {
            return res.status(403).json({ success: false, message: 'Not authorized' });
        }
        // Create Stripe Checkout Session
        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            line_items: [
                {
                    price_data: {
                        currency: 'usd',
                        product_data: {
                            name: tourName || 'Tour Booking',
                            description: `B2B Booking #${bookingId} - ${agency.agencyName}`,
                        },
                        unit_amount: Math.round(amount * 100), // Convert to cents
                    },
                    quantity: 1,
                },
            ],
            mode: 'payment',
            success_url: `${FRONTEND_URL}/about/partners/b2b/bookings?payment=success&booking=${bookingId}`,
            cancel_url: `${FRONTEND_URL}/about/partners/b2b/bookings?payment=cancelled&booking=${bookingId}`,
            metadata: {
                bookingId,
                agencyId,
                type: 'b2b_booking'
            }
        });
        // Store payment intent reference
        await db.collection('b2b_bookings').doc(bookingId).update({
            stripeSessionId: session.id,
            paymentStatus: 'processing'
        });
        res.json({
            success: true,
            checkoutUrl: session.url,
            sessionId: session.id
        });
    }
    catch (error) {
        res.status(500).json({ success: false, message: 'Failed to create payment session', error: error.message });
    }
});
// Stripe Webhook Handler
app.post('/payments/webhook', express_1.default.raw({ type: 'application/json' }), async (req, res) => {
    var _a, _b, _c;
    try {
        if (!stripe) {
            return res.status(500).json({ success: false, message: 'Payment service not configured' });
        }
        const sig = req.headers['stripe-signature'];
        const webhookSecret = (_a = functions.config().stripe) === null || _a === void 0 ? void 0 : _a.webhook_secret;
        let event;
        try {
            event = stripe.webhooks.constructEvent(req.body, sig, webhookSecret);
        }
        catch (err) {
            return res.status(400).send(`Webhook Error: ${err.message}`);
        }
        // Handle the event
        switch (event.type) {
            case 'checkout.session.completed': {
                const session = event.data.object;
                const bookingId = (_b = session.metadata) === null || _b === void 0 ? void 0 : _b.bookingId;
                if (bookingId) {
                    await db.collection('b2b_bookings').doc(bookingId).update({
                        paymentStatus: 'paid',
                        paidAt: admin.firestore.FieldValue.serverTimestamp(),
                        stripePaymentId: session.payment_intent
                    });
                    // Get booking details for notification
                    const booking = await db.collection('b2b_bookings').doc(bookingId).get();
                    const bookingData = booking.data();
                    // Send professional payment confirmation email
                    if (bookingData === null || bookingData === void 0 ? void 0 : bookingData.clientEmail) {
                        await (0, sendgrid_1.sendPaymentConfirmation)({
                            to: bookingData.clientEmail,
                            bookingId: bookingId,
                            tourName: bookingData.tourName,
                            amount: bookingData.finalPrice,
                            paymentMethod: 'Credit Card (Stripe)',
                            transactionId: session.payment_intent
                        });
                    }
                }
                break;
            }
            case 'checkout.session.expired': {
                const session = event.data.object;
                const bookingId = (_c = session.metadata) === null || _c === void 0 ? void 0 : _c.bookingId;
                if (bookingId) {
                    await db.collection('b2b_bookings').doc(bookingId).update({
                        paymentStatus: 'pending'
                    });
                }
                break;
            }
        }
        res.json({ received: true });
    }
    catch (error) {
        res.status(500).json({ success: false, message: 'Webhook error', error: error.message });
    }
});
// Bank Transfer Request (Protected)
app.post('/payments/bank-transfer', verifyToken, verifyAgency, async (req, res) => {
    var _a;
    try {
        const { bookingId } = req.body;
        const agencyId = req.user.agencyId;
        const agency = req.agency;
        const bookingDoc = await db.collection('b2b_bookings').doc(bookingId).get();
        if (!bookingDoc.exists || ((_a = bookingDoc.data()) === null || _a === void 0 ? void 0 : _a.agencyId) !== agencyId) {
            return res.status(403).json({ success: false, message: 'Not authorized' });
        }
        const booking = bookingDoc.data();
        // Update booking status
        await db.collection('b2b_bookings').doc(bookingId).update({
            paymentMethod: 'bank_transfer',
            paymentStatus: 'awaiting_transfer'
        });
        // Send bank details email
        await sendEmail(agency.email, 'Bank Transfer Details - Recharge Travels B2B', `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #10b981;">Bank Transfer Details</h2>
        <p>Please transfer <strong>$${booking === null || booking === void 0 ? void 0 : booking.finalPrice}</strong> to:</p>
        <div style="background: #f3f4f6; padding: 16px; border-radius: 8px; margin: 16px 0;">
          <p><strong>Bank:</strong> HSBC Bank Sri Lanka</p>
          <p><strong>Account Name:</strong> Recharge Travels (Pvt) Ltd</p>
          <p><strong>Account Number:</strong> 0012-XXXX-XXXX-1234</p>
          <p><strong>SWIFT Code:</strong> HSBCLKLX</p>
          <p><strong>Reference:</strong> B2B-${bookingId}</p>
        </div>
        <p>⚠️ Please include the reference number in your transfer.</p>
        <p>Your booking will be confirmed once payment is received (2-3 business days).</p>
      </div>
    `);
        res.json({
            success: true,
            message: 'Bank transfer details sent to your email',
            bankDetails: {
                bank: 'HSBC Bank Sri Lanka',
                accountName: 'Recharge Travels (Pvt) Ltd',
                reference: `B2B-${bookingId}`
            }
        });
    }
    catch (error) {
        res.status(500).json({ success: false, message: 'Failed to process request', error: error.message });
    }
});
// Get Payment Status (Protected)
app.get('/payments/:bookingId/status', verifyToken, verifyAgency, async (req, res) => {
    var _a;
    try {
        const { bookingId } = req.params;
        const agencyId = req.user.agencyId;
        const bookingDoc = await db.collection('b2b_bookings').doc(bookingId).get();
        if (!bookingDoc.exists || ((_a = bookingDoc.data()) === null || _a === void 0 ? void 0 : _a.agencyId) !== agencyId) {
            return res.status(403).json({ success: false, message: 'Not authorized' });
        }
        const booking = bookingDoc.data();
        res.json({
            success: true,
            data: {
                paymentStatus: booking === null || booking === void 0 ? void 0 : booking.paymentStatus,
                paymentMethod: booking === null || booking === void 0 ? void 0 : booking.paymentMethod,
                paidAt: booking === null || booking === void 0 ? void 0 : booking.paidAt
            }
        });
    }
    catch (error) {
        res.status(500).json({ success: false, message: 'Failed to get status', error: error.message });
    }
});
// ==================== DOCUMENT ROUTES ====================
// Upload Document (Protected)
app.post('/documents/upload', verifyToken, verifyAgency, async (req, res) => {
    var _a;
    try {
        const { bookingId, fileName, fileData, fileType } = req.body;
        const agencyId = req.user.agencyId;
        // Verify booking belongs to agency
        const bookingDoc = await db.collection('b2b_bookings').doc(bookingId).get();
        if (!bookingDoc.exists || ((_a = bookingDoc.data()) === null || _a === void 0 ? void 0 : _a.agencyId) !== agencyId) {
            return res.status(403).json({ success: false, message: 'Not authorized' });
        }
        // For file uploads, we'll store metadata in Firestore
        // Actual file should be uploaded to Firebase Storage from client
        const documentData = {
            bookingId,
            agencyId,
            fileName: fileName || 'document',
            fileType: fileType || 'application/octet-stream',
            uploadedAt: admin.firestore.FieldValue.serverTimestamp(),
            status: 'uploaded'
        };
        const docRef = await db.collection('b2b_documents').add(documentData);
        // Update booking with document reference
        await db.collection('b2b_bookings').doc(bookingId).update({
            documents: admin.firestore.FieldValue.arrayUnion({
                id: docRef.id,
                fileName: documentData.fileName,
                uploadedAt: new Date().toISOString()
            })
        });
        res.status(201).json({
            success: true,
            documentId: docRef.id,
            message: 'Document uploaded successfully'
        });
    }
    catch (error) {
        res.status(500).json({ success: false, message: 'Upload failed', error: error.message });
    }
});
// Get Documents for Booking (Protected)
app.get('/documents/:bookingId', verifyToken, verifyAgency, async (req, res) => {
    var _a;
    try {
        const { bookingId } = req.params;
        const agencyId = req.user.agencyId;
        // Verify booking belongs to agency
        const bookingDoc = await db.collection('b2b_bookings').doc(bookingId).get();
        if (!bookingDoc.exists || ((_a = bookingDoc.data()) === null || _a === void 0 ? void 0 : _a.agencyId) !== agencyId) {
            return res.status(403).json({ success: false, message: 'Not authorized' });
        }
        const snapshot = await db.collection('b2b_documents')
            .where('bookingId', '==', bookingId)
            .orderBy('uploadedAt', 'desc')
            .get();
        const documents = snapshot.docs.map(doc => (Object.assign({ id: doc.id }, doc.data())));
        res.json({ success: true, data: documents });
    }
    catch (error) {
        res.status(500).json({ success: false, message: 'Failed to fetch documents', error: error.message });
    }
});
// Delete Document (Protected)
app.delete('/documents/:documentId', verifyToken, verifyAgency, async (req, res) => {
    var _a;
    try {
        const { documentId } = req.params;
        const agencyId = req.user.agencyId;
        const docRef = await db.collection('b2b_documents').doc(documentId).get();
        if (!docRef.exists || ((_a = docRef.data()) === null || _a === void 0 ? void 0 : _a.agencyId) !== agencyId) {
            return res.status(403).json({ success: false, message: 'Not authorized' });
        }
        await db.collection('b2b_documents').doc(documentId).delete();
        res.json({ success: true, message: 'Document deleted' });
    }
    catch (error) {
        res.status(500).json({ success: false, message: 'Failed to delete document', error: error.message });
    }
});
// ==================== VOUCHER & INVOICE ROUTES ====================
const bookingVoucher_1 = require("../documents/bookingVoucher");
// Get Booking Voucher HTML (Protected)
app.get('/bookings/:bookingId/voucher', verifyToken, verifyAgency, async (req, res) => {
    var _a;
    try {
        const { bookingId } = req.params;
        const agencyId = req.user.agencyId;
        const agency = req.agency;
        const bookingDoc = await db.collection('b2b_bookings').doc(bookingId).get();
        if (!bookingDoc.exists || ((_a = bookingDoc.data()) === null || _a === void 0 ? void 0 : _a.agencyId) !== agencyId) {
            return res.status(403).json({ success: false, message: 'Not authorized' });
        }
        const booking = bookingDoc.data();
        // Get tour details for meeting point/time
        const tourDoc = await db.collection('tours').doc(booking === null || booking === void 0 ? void 0 : booking.tourId).get();
        const tourData = tourDoc.data();
        const voucherHTML = (0, bookingVoucher_1.generateBookingVoucherHTML)({
            bookingId,
            agencyName: agency.agencyName,
            tourName: booking === null || booking === void 0 ? void 0 : booking.tourName,
            tourDate: booking === null || booking === void 0 ? void 0 : booking.tourDate,
            clientName: booking === null || booking === void 0 ? void 0 : booking.clientName,
            clientEmail: booking === null || booking === void 0 ? void 0 : booking.clientEmail,
            clientPhone: booking === null || booking === void 0 ? void 0 : booking.clientPhone,
            guestCount: booking === null || booking === void 0 ? void 0 : booking.guestCount,
            originalPrice: booking === null || booking === void 0 ? void 0 : booking.originalPrice,
            discount: booking === null || booking === void 0 ? void 0 : booking.discount,
            finalPrice: booking === null || booking === void 0 ? void 0 : booking.finalPrice,
            specialRequests: booking === null || booking === void 0 ? void 0 : booking.specialRequests,
            meetingPoint: tourData === null || tourData === void 0 ? void 0 : tourData.meetingPoint,
            departureTime: tourData === null || tourData === void 0 ? void 0 : tourData.departureTime,
            paymentStatus: booking === null || booking === void 0 ? void 0 : booking.paymentStatus
        });
        res.setHeader('Content-Type', 'text/html');
        res.send(voucherHTML);
    }
    catch (error) {
        res.status(500).json({ success: false, message: 'Failed to generate voucher', error: error.message });
    }
});
// Get Booking Invoice HTML (Protected)
app.get('/bookings/:bookingId/invoice', verifyToken, verifyAgency, async (req, res) => {
    var _a;
    try {
        const { bookingId } = req.params;
        const agencyId = req.user.agencyId;
        const agency = req.agency;
        const bookingDoc = await db.collection('b2b_bookings').doc(bookingId).get();
        if (!bookingDoc.exists || ((_a = bookingDoc.data()) === null || _a === void 0 ? void 0 : _a.agencyId) !== agencyId) {
            return res.status(403).json({ success: false, message: 'Not authorized' });
        }
        const booking = bookingDoc.data();
        const invoiceHTML = (0, bookingVoucher_1.generateInvoiceHTML)({
            bookingId,
            agencyName: agency.agencyName,
            tourName: booking === null || booking === void 0 ? void 0 : booking.tourName,
            tourDate: booking === null || booking === void 0 ? void 0 : booking.tourDate,
            clientName: booking === null || booking === void 0 ? void 0 : booking.clientName,
            clientEmail: booking === null || booking === void 0 ? void 0 : booking.clientEmail,
            clientPhone: booking === null || booking === void 0 ? void 0 : booking.clientPhone,
            guestCount: booking === null || booking === void 0 ? void 0 : booking.guestCount,
            originalPrice: booking === null || booking === void 0 ? void 0 : booking.originalPrice,
            discount: booking === null || booking === void 0 ? void 0 : booking.discount,
            finalPrice: booking === null || booking === void 0 ? void 0 : booking.finalPrice,
            paymentStatus: booking === null || booking === void 0 ? void 0 : booking.paymentStatus
        });
        res.setHeader('Content-Type', 'text/html');
        res.send(invoiceHTML);
    }
    catch (error) {
        res.status(500).json({ success: false, message: 'Failed to generate invoice', error: error.message });
    }
});
// ==================== ADMIN ROUTES ====================
// Admin middleware - verify Firebase Auth admin
const verifyAdmin = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        if (!(authHeader === null || authHeader === void 0 ? void 0 : authHeader.startsWith('Bearer '))) {
            return res.status(401).json({ success: false, message: 'No token provided' });
        }
        const idToken = authHeader.split('Bearer ')[1];
        const decodedToken = await admin.auth().verifyIdToken(idToken);
        // Check if user is admin in Firestore
        const userDoc = await db.collection('users').doc(decodedToken.uid).get();
        const userData = userDoc.data();
        if (!userData || !['admin', 'super_admin', 'Super Admin'].includes(userData.role)) {
            return res.status(403).json({ success: false, message: 'Admin access required' });
        }
        req.adminUser = Object.assign({ uid: decodedToken.uid }, userData);
        next();
    }
    catch (error) {
        return res.status(401).json({ success: false, message: 'Invalid token' });
    }
};
// Admin Dashboard Stats
app.get('/admin/dashboard', verifyAdmin, async (req, res) => {
    try {
        const [agenciesSnap, bookingsSnap] = await Promise.all([
            db.collection('b2b_agencies').get(),
            db.collection('b2b_bookings').get()
        ]);
        const agencies = agenciesSnap.docs.map(doc => (Object.assign({ id: doc.id }, doc.data())));
        const bookings = bookingsSnap.docs.map(doc => (Object.assign({ id: doc.id }, doc.data())));
        const now = new Date();
        const thisMonthStart = new Date(now.getFullYear(), now.getMonth(), 1);
        const stats = {
            totalAgencies: agencies.length,
            pendingAgencies: agencies.filter((a) => a.status === 'pending').length,
            activeAgencies: agencies.filter((a) => a.status === 'active').length,
            totalBookings: bookings.length,
            totalRevenue: bookings.reduce((sum, b) => sum + (b.finalPrice || 0), 0),
            thisMonthBookings: bookings.filter((b) => {
                var _a, _b;
                const created = ((_b = (_a = b.createdAt) === null || _a === void 0 ? void 0 : _a.toDate) === null || _b === void 0 ? void 0 : _b.call(_a)) || new Date(b.createdAt);
                return created >= thisMonthStart;
            }).length
        };
        const recentAgencies = agencies
            .sort((a, b) => { var _a, _b; return (((_a = b.createdAt) === null || _a === void 0 ? void 0 : _a.seconds) || 0) - (((_b = a.createdAt) === null || _b === void 0 ? void 0 : _b.seconds) || 0); })
            .slice(0, 5);
        const recentBookings = bookings
            .sort((a, b) => { var _a, _b; return (((_a = b.createdAt) === null || _a === void 0 ? void 0 : _a.seconds) || 0) - (((_b = a.createdAt) === null || _b === void 0 ? void 0 : _b.seconds) || 0); })
            .slice(0, 5);
        res.json({ success: true, stats, recentAgencies, recentBookings });
    }
    catch (error) {
        res.status(500).json({ success: false, message: 'Failed to fetch dashboard', error: error.message });
    }
});
// Analytics API (Admin)
app.get('/admin/analytics', verifyAdmin, async (req, res) => {
    try {
        const { days = '30' } = req.query;
        const daysAgo = parseInt(days);
        const now = new Date();
        const startDate = new Date(now.getTime() - daysAgo * 24 * 60 * 60 * 1000);
        const thisMonthStart = new Date(now.getFullYear(), now.getMonth(), 1);
        const lastMonthStart = new Date(now.getFullYear(), now.getMonth() - 1, 1);
        const lastMonthEnd = new Date(now.getFullYear(), now.getMonth(), 0);
        const [agenciesSnap, bookingsSnap, toursSnap] = await Promise.all([
            db.collection('b2b_agencies').get(),
            db.collection('b2b_bookings').get(),
            db.collection('tours').get()
        ]);
        const agencies = agenciesSnap.docs.map(doc => (Object.assign({ id: doc.id }, doc.data())));
        const bookings = bookingsSnap.docs.map(doc => (Object.assign({ id: doc.id }, doc.data())));
        const tours = toursSnap.docs.map(doc => (Object.assign({ id: doc.id }, doc.data())));
        // Calculate revenue metrics
        const thisMonthBookings = bookings.filter((b) => {
            var _a, _b;
            const created = ((_b = (_a = b.createdAt) === null || _a === void 0 ? void 0 : _a.toDate) === null || _b === void 0 ? void 0 : _b.call(_a)) || new Date(b.createdAt);
            return created >= thisMonthStart;
        });
        const lastMonthBookings = bookings.filter((b) => {
            var _a, _b;
            const created = ((_b = (_a = b.createdAt) === null || _a === void 0 ? void 0 : _a.toDate) === null || _b === void 0 ? void 0 : _b.call(_a)) || new Date(b.createdAt);
            return created >= lastMonthStart && created <= lastMonthEnd;
        });
        const thisMonthRevenue = thisMonthBookings.reduce((sum, b) => sum + (b.finalPrice || 0), 0);
        const lastMonthRevenue = lastMonthBookings.reduce((sum, b) => sum + (b.finalPrice || 0), 0);
        const revenueGrowth = lastMonthRevenue > 0 ? ((thisMonthRevenue - lastMonthRevenue) / lastMonthRevenue) * 100 : 0;
        const bookingsGrowth = lastMonthBookings.length > 0 ? ((thisMonthBookings.length - lastMonthBookings.length) / lastMonthBookings.length) * 100 : 0;
        // New agencies this month
        const newAgencies = agencies.filter((a) => {
            var _a, _b;
            const created = ((_b = (_a = a.createdAt) === null || _a === void 0 ? void 0 : _a.toDate) === null || _b === void 0 ? void 0 : _b.call(_a)) || new Date(a.createdAt);
            return created >= thisMonthStart;
        });
        // Top tours
        const tourBookingCounts = {};
        bookings.forEach((b) => {
            const tourId = b.tourId;
            if (!tourBookingCounts[tourId]) {
                tourBookingCounts[tourId] = { name: b.tourName || 'Unknown', bookings: 0, revenue: 0 };
            }
            tourBookingCounts[tourId].bookings++;
            tourBookingCounts[tourId].revenue += b.finalPrice || 0;
        });
        const topTours = Object.values(tourBookingCounts)
            .sort((a, b) => b.revenue - a.revenue)
            .slice(0, 10);
        // Top agencies
        const agencyBookingCounts = {};
        const agencyMap = {};
        agencies.forEach((a) => { agencyMap[a.id] = a.agencyName; });
        bookings.forEach((b) => {
            const agencyId = b.agencyId;
            if (!agencyBookingCounts[agencyId]) {
                agencyBookingCounts[agencyId] = { name: agencyMap[agencyId] || 'Unknown', bookings: 0, revenue: 0 };
            }
            agencyBookingCounts[agencyId].bookings++;
            agencyBookingCounts[agencyId].revenue += b.finalPrice || 0;
        });
        const topAgencies = Object.values(agencyBookingCounts)
            .sort((a, b) => b.revenue - a.revenue)
            .slice(0, 10);
        // Monthly revenue (last 6 months)
        const monthlyRevenue = [];
        for (let i = 5; i >= 0; i--) {
            const monthDate = new Date(now.getFullYear(), now.getMonth() - i, 1);
            const monthEnd = new Date(now.getFullYear(), now.getMonth() - i + 1, 0);
            const monthName = monthDate.toLocaleString('default', { month: 'short', year: '2-digit' });
            const monthBookings = bookings.filter((b) => {
                var _a, _b;
                const created = ((_b = (_a = b.createdAt) === null || _a === void 0 ? void 0 : _a.toDate) === null || _b === void 0 ? void 0 : _b.call(_a)) || new Date(b.createdAt);
                return created >= monthDate && created <= monthEnd;
            });
            monthlyRevenue.push({
                month: monthName,
                revenue: monthBookings.reduce((sum, b) => sum + (b.finalPrice || 0), 0),
                bookings: monthBookings.length
            });
        }
        // Category breakdown
        const categoryCount = {};
        bookings.forEach((b) => {
            const tour = tours.find((t) => t.id === b.tourId);
            const category = (tour === null || tour === void 0 ? void 0 : tour.category) || 'other';
            categoryCount[category] = (categoryCount[category] || 0) + 1;
        });
        const totalBookingsCount = bookings.length || 1;
        const categoryBreakdown = Object.entries(categoryCount)
            .map(([category, count]) => ({
            category,
            bookings: count,
            percentage: Math.round((count / totalBookingsCount) * 100)
        }))
            .sort((a, b) => b.bookings - a.bookings);
        res.json({
            success: true,
            data: {
                revenue: {
                    total: bookings.reduce((sum, b) => sum + (b.finalPrice || 0), 0),
                    thisMonth: thisMonthRevenue,
                    lastMonth: lastMonthRevenue,
                    growth: revenueGrowth
                },
                bookings: {
                    total: bookings.length,
                    thisMonth: thisMonthBookings.length,
                    lastMonth: lastMonthBookings.length,
                    growth: bookingsGrowth
                },
                agencies: {
                    total: agencies.length,
                    active: agencies.filter((a) => a.status === 'active').length,
                    new: newAgencies.length
                },
                topTours,
                topAgencies,
                monthlyRevenue,
                categoryBreakdown
            }
        });
    }
    catch (error) {
        res.status(500).json({ success: false, message: 'Failed to fetch analytics', error: error.message });
    }
});
// Get All Agencies (Admin)
app.get('/admin/agencies', verifyAdmin, async (req, res) => {
    try {
        const { status } = req.query;
        let query = db.collection('b2b_agencies');
        if (status) {
            query = query.where('status', '==', status);
        }
        const snapshot = await query.orderBy('createdAt', 'desc').get();
        const agencies = snapshot.docs.map(doc => (Object.assign({ id: doc.id }, doc.data())));
        res.json({ success: true, data: agencies });
    }
    catch (error) {
        res.status(500).json({ success: false, message: 'Failed to fetch agencies', error: error.message });
    }
});
// Update Agency Status (Admin)
app.patch('/admin/agencies/:agencyId/status', verifyAdmin, async (req, res) => {
    try {
        const { agencyId } = req.params;
        const { status } = req.body;
        if (!['pending', 'active', 'suspended'].includes(status)) {
            return res.status(400).json({ success: false, message: 'Invalid status' });
        }
        await db.collection('b2b_agencies').doc(agencyId).update({
            status,
            updatedAt: admin.firestore.FieldValue.serverTimestamp()
        });
        // Send professional notification email if approved
        if (status === 'active') {
            const agencyDoc = await db.collection('b2b_agencies').doc(agencyId).get();
            const agency = agencyDoc.data();
            if (agency === null || agency === void 0 ? void 0 : agency.email) {
                await (0, sendgrid_1.sendAgencyApproval)({
                    to: agency.email,
                    agencyName: agency.agencyName,
                    loginLink: `${FRONTEND_URL}/about/partners/b2b/login`
                });
            }
        }
        res.json({ success: true, message: `Agency ${status}` });
    }
    catch (error) {
        res.status(500).json({ success: false, message: 'Failed to update status', error: error.message });
    }
});
// Get All Tours (Admin - includes inactive)
app.get('/admin/tours', verifyAdmin, async (req, res) => {
    try {
        const snapshot = await db.collection('tours').orderBy('createdAt', 'desc').get();
        const tours = snapshot.docs.map(doc => {
            var _a;
            const data = doc.data();
            return {
                id: doc.id,
                tourName: data.tourName || data.name || data.title,
                category: data.category,
                description: data.description,
                priceUSD: data.priceUSD || data.price,
                duration: data.duration,
                maxCapacity: data.maxCapacity || 20,
                images: data.images || [data.image],
                isActive: (_a = data.isActive) !== null && _a !== void 0 ? _a : true,
                createdAt: data.createdAt
            };
        });
        res.json({ success: true, data: tours });
    }
    catch (error) {
        res.status(500).json({ success: false, message: 'Failed to fetch tours', error: error.message });
    }
});
// Create Tour (Admin)
app.post('/admin/tours', verifyAdmin, async (req, res) => {
    try {
        const { tourName, category, description, priceUSD, duration, maxCapacity, images, isActive } = req.body;
        if (!tourName || !category || !priceUSD) {
            return res.status(400).json({ success: false, message: 'Missing required fields' });
        }
        const tourData = {
            tourName,
            category,
            description: description || '',
            priceUSD: Number(priceUSD),
            duration: duration || '',
            maxCapacity: maxCapacity || 20,
            images: images || [],
            isActive: isActive !== null && isActive !== void 0 ? isActive : true,
            createdAt: admin.firestore.FieldValue.serverTimestamp(),
            updatedAt: admin.firestore.FieldValue.serverTimestamp()
        };
        const docRef = await db.collection('tours').add(tourData);
        res.status(201).json({ success: true, tourId: docRef.id, message: 'Tour created' });
    }
    catch (error) {
        res.status(500).json({ success: false, message: 'Failed to create tour', error: error.message });
    }
});
// Update Tour (Admin)
app.patch('/admin/tours/:tourId', verifyAdmin, async (req, res) => {
    try {
        const { tourId } = req.params;
        const updates = req.body;
        // Remove undefined fields
        Object.keys(updates).forEach(key => updates[key] === undefined && delete updates[key]);
        updates.updatedAt = admin.firestore.FieldValue.serverTimestamp();
        await db.collection('tours').doc(tourId).update(updates);
        res.json({ success: true, message: 'Tour updated' });
    }
    catch (error) {
        res.status(500).json({ success: false, message: 'Failed to update tour', error: error.message });
    }
});
// Delete Tour (Admin)
app.delete('/admin/tours/:tourId', verifyAdmin, async (req, res) => {
    try {
        const { tourId } = req.params;
        await db.collection('tours').doc(tourId).delete();
        res.json({ success: true, message: 'Tour deleted' });
    }
    catch (error) {
        res.status(500).json({ success: false, message: 'Failed to delete tour', error: error.message });
    }
});
// Get All Bookings (Admin)
app.get('/admin/bookings', verifyAdmin, async (req, res) => {
    try {
        const { status, startDate, endDate } = req.query;
        let query = db.collection('b2b_bookings');
        if (status) {
            query = query.where('status', '==', status);
        }
        const snapshot = await query.orderBy('createdAt', 'desc').get();
        let bookings = snapshot.docs.map(doc => (Object.assign({ id: doc.id }, doc.data())));
        // Date filtering (client-side for flexibility)
        if (startDate || endDate) {
            bookings = bookings.filter((b) => {
                const tourDate = new Date(b.tourDate);
                if (startDate && tourDate < new Date(startDate))
                    return false;
                if (endDate && tourDate > new Date(endDate))
                    return false;
                return true;
            });
        }
        // Get agency names
        const agencyIds = [...new Set(bookings.map((b) => b.agencyId))];
        const agencyDocs = await Promise.all(agencyIds.map(id => db.collection('b2b_agencies').doc(id).get()));
        const agencyMap = {};
        agencyDocs.forEach(doc => {
            var _a;
            if (doc.exists) {
                agencyMap[doc.id] = ((_a = doc.data()) === null || _a === void 0 ? void 0 : _a.agencyName) || 'Unknown';
            }
        });
        bookings = bookings.map((b) => (Object.assign(Object.assign({}, b), { agencyName: agencyMap[b.agencyId] || 'Unknown' })));
        res.json({ success: true, data: bookings });
    }
    catch (error) {
        res.status(500).json({ success: false, message: 'Failed to fetch bookings', error: error.message });
    }
});
// ==================== HEALTH CHECK ====================
app.get('/health', (req, res) => {
    res.json({ status: 'ok', service: 'B2B API', timestamp: new Date().toISOString() });
});
// ==================== TEST EMAIL ENDPOINT ====================
// Send a test email to verify SendGrid is working
app.post('/test-email', async (req, res) => {
    try {
        const { email } = req.body;
        if (!email) {
            return res.status(400).json({ success: false, message: 'Email address required' });
        }
        // Send a test booking confirmation email
        const success = await (0, sendgrid_1.sendBookingConfirmation)({
            to: email,
            bookingId: 'TEST-' + Date.now().toString(36).toUpperCase(),
            agencyName: 'Test Agency',
            tourName: 'Sample Cultural Tour - Sigiriya & Dambulla',
            tourDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toLocaleDateString('en-GB'),
            clientName: 'John Doe',
            clientEmail: email,
            clientPhone: '+94 77 123 4567',
            guestCount: 2,
            originalPrice: 200,
            discount: 20,
            finalPrice: 180,
            specialRequests: 'Vegetarian meals requested'
        });
        if (success) {
            res.json({
                success: true,
                message: `Test email sent successfully to ${email}`,
                note: 'Check your inbox (and spam folder)'
            });
        }
        else {
            res.status(500).json({
                success: false,
                message: 'Failed to send email. Check SendGrid API key configuration.'
            });
        }
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: 'Email send error',
            error: error.message
        });
    }
});
// Export the Express app as a Cloud Function
exports.b2bApi = functions.https.onRequest(app);
//# sourceMappingURL=index.js.map