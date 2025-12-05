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
var _a, _b, _c;
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateWhatsAppLink = exports.sendWelcome = exports.sendPostTourFeedback = exports.notifyAdminNewDriver = exports.notifyAdminNewBooking = exports.sendPaymentReminder = exports.sendBookingReminder = exports.sendDriverNewBooking = exports.sendDriverApproval = exports.sendDriverRegistration = exports.sendVehicleRentalConfirmation = exports.sendTransferConfirmation = exports.sendTourBookingConfirmation = exports.sendWhatsAppMessage = void 0;
// WhatsApp Service for Recharge Travels
// Integrates with WhatsApp Business API via Twilio or direct Meta Cloud API
const functions = __importStar(require("firebase-functions"));
const templates_1 = require("./templates");
Object.defineProperty(exports, "generateWhatsAppLink", { enumerable: true, get: function () { return templates_1.generateWhatsAppLink; } });
// Configuration from Firebase Functions Config
const WHATSAPP_ACCESS_TOKEN = ((_a = functions.config().whatsapp) === null || _a === void 0 ? void 0 : _a.access_token) || process.env.WHATSAPP_ACCESS_TOKEN;
const WHATSAPP_PHONE_NUMBER_ID = ((_b = functions.config().whatsapp) === null || _b === void 0 ? void 0 : _b.phone_number_id) || process.env.WHATSAPP_PHONE_NUMBER_ID;
const ADMIN_WHATSAPP = ((_c = functions.config().whatsapp) === null || _c === void 0 ? void 0 : _c.admin_number) || '+94777721999';
// Meta WhatsApp Cloud API endpoint
const WHATSAPP_API_URL = 'https://graph.facebook.com/v18.0';
// ==========================================
// BASE SEND FUNCTION (Meta Cloud API)
// ==========================================
const sendWhatsAppMessage = async (to, message) => {
    var _a, _b, _c;
    if (!WHATSAPP_ACCESS_TOKEN || !WHATSAPP_PHONE_NUMBER_ID) {
        console.log('WhatsApp not configured. Would send to:', to);
        console.log('Message:', message.substring(0, 100) + '...');
        return { success: false, error: 'WhatsApp not configured' };
    }
    try {
        // Clean phone number (remove spaces, add country code if needed)
        const cleanPhone = to.replace(/[^0-9]/g, '');
        const formattedPhone = cleanPhone.startsWith('94') ? cleanPhone : `94${cleanPhone}`;
        const response = await fetch(`${WHATSAPP_API_URL}/${WHATSAPP_PHONE_NUMBER_ID}/messages`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${WHATSAPP_ACCESS_TOKEN}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                messaging_product: 'whatsapp',
                recipient_type: 'individual',
                to: formattedPhone,
                type: 'text',
                text: {
                    preview_url: true,
                    body: message
                }
            })
        });
        const data = await response.json();
        if (response.ok) {
            console.log(`✅ WhatsApp sent to ${formattedPhone}`);
            return { success: true, messageId: (_b = (_a = data.messages) === null || _a === void 0 ? void 0 : _a[0]) === null || _b === void 0 ? void 0 : _b.id };
        }
        else {
            console.error('❌ WhatsApp error:', data);
            return { success: false, error: ((_c = data.error) === null || _c === void 0 ? void 0 : _c.message) || 'Failed to send' };
        }
    }
    catch (error) {
        console.error('❌ WhatsApp exception:', error.message);
        return { success: false, error: error.message };
    }
};
exports.sendWhatsAppMessage = sendWhatsAppMessage;
// ==========================================
// BOOKING MESSAGES
// ==========================================
const sendTourBookingConfirmation = async (data) => {
    const message = (0, templates_1.tourBookingWhatsApp)(data);
    return (0, exports.sendWhatsAppMessage)(data.phone, message);
};
exports.sendTourBookingConfirmation = sendTourBookingConfirmation;
const sendTransferConfirmation = async (data) => {
    const message = (0, templates_1.transferBookingWhatsApp)(data);
    return (0, exports.sendWhatsAppMessage)(data.phone, message);
};
exports.sendTransferConfirmation = sendTransferConfirmation;
const sendVehicleRentalConfirmation = async (data) => {
    const message = (0, templates_1.vehicleRentalWhatsApp)(data);
    return (0, exports.sendWhatsAppMessage)(data.phone, message);
};
exports.sendVehicleRentalConfirmation = sendVehicleRentalConfirmation;
// ==========================================
// DRIVER MESSAGES
// ==========================================
const sendDriverRegistration = async (data) => {
    const message = (0, templates_1.driverRegistrationWhatsApp)(data);
    return (0, exports.sendWhatsAppMessage)(data.phone, message);
};
exports.sendDriverRegistration = sendDriverRegistration;
const sendDriverApproval = async (data) => {
    const message = (0, templates_1.driverApprovalWhatsApp)(data);
    return (0, exports.sendWhatsAppMessage)(data.phone, message);
};
exports.sendDriverApproval = sendDriverApproval;
const sendDriverNewBooking = async (data) => {
    const message = (0, templates_1.driverNewBookingWhatsApp)(data);
    return (0, exports.sendWhatsAppMessage)(data.phone, message);
};
exports.sendDriverNewBooking = sendDriverNewBooking;
// ==========================================
// REMINDERS
// ==========================================
const sendBookingReminder = async (data) => {
    const message = (0, templates_1.bookingReminderWhatsApp)(data);
    return (0, exports.sendWhatsAppMessage)(data.phone, message);
};
exports.sendBookingReminder = sendBookingReminder;
const sendPaymentReminder = async (data) => {
    const message = (0, templates_1.paymentReminderWhatsApp)(data);
    return (0, exports.sendWhatsAppMessage)(data.phone, message);
};
exports.sendPaymentReminder = sendPaymentReminder;
// ==========================================
// ADMIN NOTIFICATIONS
// ==========================================
const notifyAdminNewBooking = async (data) => {
    const message = (0, templates_1.adminNewBookingWhatsApp)(data);
    return (0, exports.sendWhatsAppMessage)(ADMIN_WHATSAPP, message);
};
exports.notifyAdminNewBooking = notifyAdminNewBooking;
const notifyAdminNewDriver = async (data) => {
    const message = (0, templates_1.adminNewDriverWhatsApp)(data);
    return (0, exports.sendWhatsAppMessage)(ADMIN_WHATSAPP, message);
};
exports.notifyAdminNewDriver = notifyAdminNewDriver;
// ==========================================
// FEEDBACK & SUPPORT
// ==========================================
const sendPostTourFeedback = async (data) => {
    const reviewLink = `https://www.rechargetravels.com/review`;
    const message = (0, templates_1.postTourFeedbackWhatsApp)(Object.assign(Object.assign({}, data), { reviewLink }));
    return (0, exports.sendWhatsAppMessage)(data.phone, message);
};
exports.sendPostTourFeedback = sendPostTourFeedback;
const sendWelcome = async (data) => {
    const message = (0, templates_1.welcomeWhatsApp)(data);
    return (0, exports.sendWhatsAppMessage)(data.phone, message);
};
exports.sendWelcome = sendWelcome;
exports.default = {
    sendWhatsAppMessage: exports.sendWhatsAppMessage,
    sendTourBookingConfirmation: exports.sendTourBookingConfirmation,
    sendTransferConfirmation: exports.sendTransferConfirmation,
    sendVehicleRentalConfirmation: exports.sendVehicleRentalConfirmation,
    sendDriverRegistration: exports.sendDriverRegistration,
    sendDriverApproval: exports.sendDriverApproval,
    sendDriverNewBooking: exports.sendDriverNewBooking,
    sendBookingReminder: exports.sendBookingReminder,
    sendPaymentReminder: exports.sendPaymentReminder,
    notifyAdminNewBooking: exports.notifyAdminNewBooking,
    notifyAdminNewDriver: exports.notifyAdminNewDriver,
    sendPostTourFeedback: exports.sendPostTourFeedback,
    sendWelcome: exports.sendWelcome,
    generateWhatsAppLink: templates_1.generateWhatsAppLink
};
//# sourceMappingURL=service.js.map