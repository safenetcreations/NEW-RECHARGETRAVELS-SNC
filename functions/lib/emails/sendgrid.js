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
var _a, _b;
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendVehicleRentalConfirmation = exports.sendDriverApproval = exports.sendDriverAdminNotification = exports.sendDriverRegistrationConfirmation = exports.sendGenericEmail = exports.sendBookingCancellation = exports.sendPasswordReset = exports.sendPaymentConfirmation = exports.sendAgencyApproval = exports.sendAgencyWelcome = exports.sendBookingConfirmation = exports.sendBookingReminder = exports.sendWelcomeEmail = exports.sendWhaleWatchingConfirmation = exports.sendTransferBookingConfirmation = exports.sendTourBookingConfirmation = exports.sendConciergeBookingConfirmation = exports.sendEmail = void 0;
// SendGrid Email Service for Recharge Travels
// Handles all email sending with beautiful branded templates
const functions = __importStar(require("firebase-functions"));
const mail_1 = __importDefault(require("@sendgrid/mail"));
const templates_1 = require("./templates");
// Initialize SendGrid
const SENDGRID_API_KEY = ((_a = functions.config().sendgrid) === null || _a === void 0 ? void 0 : _a.api_key) || process.env.SENDGRID_API_KEY;
const FROM_EMAIL = ((_b = functions.config().sendgrid) === null || _b === void 0 ? void 0 : _b.from_email) || 'bookings@rechargetravels.com';
const FROM_NAME = 'Recharge Travels';
const ADMIN_EMAIL = 'info@rechargetravels.com';
if (SENDGRID_API_KEY) {
    mail_1.default.setApiKey(SENDGRID_API_KEY);
}
// ==========================================
// BASE EMAIL FUNCTION
// ==========================================
const sendEmail = async (options) => {
    var _a;
    if (!SENDGRID_API_KEY) {
        console.error('SendGrid API key not configured');
        console.log('Would send email to:', options.to, 'Subject:', options.subject);
        return false;
    }
    try {
        const msg = {
            to: options.to,
            from: {
                email: FROM_EMAIL,
                name: FROM_NAME
            },
            subject: options.subject,
            html: options.html,
            replyTo: options.replyTo || 'info@rechargetravels.com'
        };
        if (options.cc) {
            msg.cc = options.cc;
        }
        if (options.bcc) {
            msg.bcc = options.bcc;
        }
        await mail_1.default.send(msg);
        console.log(`✅ Email sent successfully to ${Array.isArray(options.to) ? options.to.join(', ') : options.to}`);
        return true;
    }
    catch (error) {
        console.error('❌ SendGrid email error:', ((_a = error.response) === null || _a === void 0 ? void 0 : _a.body) || error.message);
        return false;
    }
};
exports.sendEmail = sendEmail;
// ==========================================
// VIP CONCIERGE BOOKING EMAIL
// ==========================================
const sendConciergeBookingConfirmation = async (data) => {
    const html = (0, templates_1.conciergeBookingTemplate)(data);
    // Send to customer
    await (0, exports.sendEmail)({
        to: data.to,
        subject: `👑 VIP Concierge Request Confirmed | Ref: ${data.bookingRef}`,
        html,
        bcc: [ADMIN_EMAIL] // Copy to admin
    });
    // Send notification to admin with different subject
    await (0, exports.sendEmail)({
        to: ADMIN_EMAIL,
        subject: `🔔 NEW VIP Concierge Request | ${data.firstName} ${data.lastName} | $${data.estimatedTotal}`,
        html
    });
    return true;
};
exports.sendConciergeBookingConfirmation = sendConciergeBookingConfirmation;
// ==========================================
// TOUR BOOKING EMAIL
// ==========================================
const sendTourBookingConfirmation = async (data) => {
    const html = (0, templates_1.tourBookingTemplate)(data);
    // Send to customer
    await (0, exports.sendEmail)({
        to: data.to,
        subject: `✅ Tour Booking Confirmed - ${data.tourName} | Ref: ${data.bookingRef}`,
        html,
        bcc: [ADMIN_EMAIL]
    });
    return true;
};
exports.sendTourBookingConfirmation = sendTourBookingConfirmation;
// ==========================================
// AIRPORT TRANSFER EMAIL
// ==========================================
const sendTransferBookingConfirmation = async (data) => {
    const html = (0, templates_1.transferBookingTemplate)(data);
    const transferTypeLabel = {
        'arrival': 'Airport Arrival',
        'departure': 'Airport Departure',
        'round-trip': 'Round Trip'
    }[data.transferType];
    // Send to customer
    await (0, exports.sendEmail)({
        to: data.to,
        subject: `🚗 ${transferTypeLabel} Transfer Confirmed | Ref: ${data.bookingRef}`,
        html,
        bcc: [ADMIN_EMAIL]
    });
    return true;
};
exports.sendTransferBookingConfirmation = sendTransferBookingConfirmation;
// ==========================================
// WHALE WATCHING EMAIL
// ==========================================
const sendWhaleWatchingConfirmation = async (data) => {
    const html = (0, templates_1.whaleWatchingTemplate)(data);
    // Send to customer
    await (0, exports.sendEmail)({
        to: data.to,
        subject: `🐋 Whale Watching Booking Confirmed | ${data.tourDate} | Ref: ${data.bookingRef}`,
        html,
        bcc: [ADMIN_EMAIL]
    });
    return true;
};
exports.sendWhaleWatchingConfirmation = sendWhaleWatchingConfirmation;
// ==========================================
// WELCOME EMAIL
// ==========================================
const sendWelcomeEmail = async (data) => {
    const html = (0, templates_1.welcomeEmailTemplate)({
        firstName: data.firstName,
        email: data.to
    });
    return (0, exports.sendEmail)({
        to: data.to,
        subject: `🌴 Welcome to Recharge Travels, ${data.firstName}!`,
        html
    });
};
exports.sendWelcomeEmail = sendWelcomeEmail;
// ==========================================
// BOOKING REMINDER EMAIL
// ==========================================
const sendBookingReminder = async (data) => {
    const html = (0, templates_1.bookingReminderTemplate)(data);
    const subject = data.daysUntil === 1
        ? `⏰ Your ${data.tourName} tour is TOMORROW!`
        : `⏰ ${data.daysUntil} Days Until Your ${data.tourName} Adventure!`;
    return (0, exports.sendEmail)({
        to: data.to,
        subject,
        html
    });
};
exports.sendBookingReminder = sendBookingReminder;
// ==========================================
// B2B EMAILS
// ==========================================
// Send Booking Confirmation Email (B2B)
const sendBookingConfirmation = async (data) => {
    const html = (0, templates_1.bookingConfirmationTemplate)({
        bookingId: data.bookingId,
        agencyName: data.agencyName,
        tourName: data.tourName,
        tourDate: data.tourDate,
        clientName: data.clientName,
        clientEmail: data.clientEmail,
        clientPhone: data.clientPhone,
        guestCount: data.guestCount,
        originalPrice: data.originalPrice,
        discount: data.discount,
        finalPrice: data.finalPrice,
        specialRequests: data.specialRequests
    });
    // Send to agency
    await (0, exports.sendEmail)({
        to: data.to,
        subject: `✅ B2B Booking Confirmed - ${data.tourName} | Ref: ${data.bookingId}`,
        html
    });
    // Also send to client if email provided
    if (data.clientEmail && data.clientEmail !== data.to) {
        await (0, exports.sendEmail)({
            to: data.clientEmail,
            subject: `Your Tour Booking Confirmation - ${data.tourName}`,
            html
        });
    }
    return true;
};
exports.sendBookingConfirmation = sendBookingConfirmation;
// Send Agency Welcome Email (Registration)
const sendAgencyWelcome = async (data) => {
    const html = (0, templates_1.agencyWelcomeTemplate)({
        agencyName: data.agencyName,
        email: data.to,
        verificationLink: data.verificationLink
    });
    return (0, exports.sendEmail)({
        to: data.to,
        subject: '🎉 Welcome to Recharge Travels B2B - Verify Your Email',
        html
    });
};
exports.sendAgencyWelcome = sendAgencyWelcome;
// Send Agency Approval Email
const sendAgencyApproval = async (data) => {
    const html = (0, templates_1.agencyApprovalTemplate)({
        agencyName: data.agencyName,
        loginLink: data.loginLink
    });
    return (0, exports.sendEmail)({
        to: data.to,
        subject: '🎊 Your B2B Account is Approved! - Recharge Travels',
        html
    });
};
exports.sendAgencyApproval = sendAgencyApproval;
// Send Payment Confirmation Email
const sendPaymentConfirmation = async (data) => {
    const html = (0, templates_1.paymentConfirmationTemplate)({
        bookingId: data.bookingId,
        tourName: data.tourName,
        amount: data.amount,
        paymentMethod: data.paymentMethod,
        transactionId: data.transactionId
    });
    return (0, exports.sendEmail)({
        to: data.to,
        subject: `💳 Payment Received - $${data.amount.toFixed(2)} | Ref: ${data.bookingId}`,
        html
    });
};
exports.sendPaymentConfirmation = sendPaymentConfirmation;
// Send Password Reset Email
const sendPasswordReset = async (data) => {
    const html = (0, templates_1.passwordResetTemplate)({
        agencyName: data.agencyName,
        resetLink: data.resetLink
    });
    return (0, exports.sendEmail)({
        to: data.to,
        subject: '🔐 Password Reset Request - Recharge Travels',
        html
    });
};
exports.sendPasswordReset = sendPasswordReset;
// Send Booking Cancellation Email
const sendBookingCancellation = async (data) => {
    const html = (0, templates_1.bookingCancellationTemplate)({
        bookingId: data.bookingId,
        tourName: data.tourName,
        tourDate: data.tourDate,
        refundAmount: data.refundAmount,
        reason: data.reason
    });
    return (0, exports.sendEmail)({
        to: data.to,
        subject: `❌ Booking Cancelled - ${data.tourName} | Ref: ${data.bookingId}`,
        html
    });
};
exports.sendBookingCancellation = sendBookingCancellation;
// ==========================================
// GENERIC EMAIL FUNCTION (for custom emails)
// ==========================================
const sendGenericEmail = async (data) => {
    return (0, exports.sendEmail)({
        to: data.to,
        subject: data.subject,
        html: data.html,
        replyTo: data.replyTo,
        cc: data.cc
    });
};
exports.sendGenericEmail = sendGenericEmail;
// ==========================================
// DRIVER REGISTRATION EMAIL
// ==========================================
const sendDriverRegistrationConfirmation = async (data) => {
    const html = (0, templates_1.driverRegistrationTemplate)({
        driverName: data.driverName,
        email: data.to,
        phone: data.phone,
        tier: data.tier,
        applicationId: data.applicationId,
        submittedAt: new Date().toLocaleDateString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        })
    });
    // Send to driver
    await (0, exports.sendEmail)({
        to: data.to,
        subject: `🚗 Driver Application Received | Ref: ${data.applicationId}`,
        html
    });
    return true;
};
exports.sendDriverRegistrationConfirmation = sendDriverRegistrationConfirmation;
// ==========================================
// ADMIN NOTIFICATION FOR NEW DRIVER
// ==========================================
const sendDriverAdminNotification = async (data) => {
    const html = (0, templates_1.adminDriverNotificationTemplate)(Object.assign(Object.assign({}, data), { reviewLink: `https://recharge-travels-admin.web.app/admin/drivers/${data.applicationId}` }));
    return (0, exports.sendEmail)({
        to: ADMIN_EMAIL,
        subject: `🔔 NEW Driver Application | ${data.driverName} | ${data.tier}`,
        html
    });
};
exports.sendDriverAdminNotification = sendDriverAdminNotification;
// ==========================================
// DRIVER APPROVAL EMAIL
// ==========================================
const sendDriverApproval = async (data) => {
    const html = (0, templates_1.driverApprovalTemplate)({
        driverName: data.driverName,
        tier: data.tier,
        loginLink: 'https://recharge-travels-73e76.web.app/driver/dashboard'
    });
    return (0, exports.sendEmail)({
        to: data.to,
        subject: `🎉 Congratulations! Your Driver Account is Approved - Recharge Travels`,
        html
    });
};
exports.sendDriverApproval = sendDriverApproval;
// ==========================================
// VEHICLE RENTAL CONFIRMATION
// ==========================================
const sendVehicleRentalConfirmation = async (data) => {
    const html = (0, templates_1.vehicleRentalConfirmationTemplate)({
        bookingRef: data.bookingRef,
        customerName: data.customerName,
        email: data.to,
        phone: data.phone,
        vehicleType: data.vehicleType,
        pickupDate: data.pickupDate,
        returnDate: data.returnDate,
        pickupLocation: data.pickupLocation,
        returnLocation: data.returnLocation,
        driverOption: data.driverOption,
        totalPrice: data.totalPrice,
        paymentStatus: data.paymentStatus
    });
    // Send to customer
    await (0, exports.sendEmail)({
        to: data.to,
        subject: `🚗 Vehicle Rental Confirmed | Ref: ${data.bookingRef}`,
        html,
        bcc: [ADMIN_EMAIL]
    });
    return true;
};
exports.sendVehicleRentalConfirmation = sendVehicleRentalConfirmation;
exports.default = {
    sendEmail: exports.sendEmail,
    sendConciergeBookingConfirmation: exports.sendConciergeBookingConfirmation,
    sendTourBookingConfirmation: exports.sendTourBookingConfirmation,
    sendTransferBookingConfirmation: exports.sendTransferBookingConfirmation,
    sendWhaleWatchingConfirmation: exports.sendWhaleWatchingConfirmation,
    sendWelcomeEmail: exports.sendWelcomeEmail,
    sendBookingReminder: exports.sendBookingReminder,
    sendBookingConfirmation: exports.sendBookingConfirmation,
    sendAgencyWelcome: exports.sendAgencyWelcome,
    sendAgencyApproval: exports.sendAgencyApproval,
    sendPaymentConfirmation: exports.sendPaymentConfirmation,
    sendPasswordReset: exports.sendPasswordReset,
    sendBookingCancellation: exports.sendBookingCancellation,
    sendGenericEmail: exports.sendGenericEmail,
    // Driver emails
    sendDriverRegistrationConfirmation: exports.sendDriverRegistrationConfirmation,
    sendDriverAdminNotification: exports.sendDriverAdminNotification,
    sendDriverApproval: exports.sendDriverApproval,
    sendVehicleRentalConfirmation: exports.sendVehicleRentalConfirmation
};
//# sourceMappingURL=sendgrid.js.map