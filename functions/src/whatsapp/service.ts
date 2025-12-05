// WhatsApp Service for Recharge Travels
// Integrates with WhatsApp Business API via Twilio or direct Meta Cloud API
import * as functions from 'firebase-functions';
import {
    tourBookingWhatsApp,
    transferBookingWhatsApp,
    vehicleRentalWhatsApp,
    driverRegistrationWhatsApp,
    driverApprovalWhatsApp,
    driverNewBookingWhatsApp,
    bookingReminderWhatsApp,
    paymentReminderWhatsApp,
    adminNewBookingWhatsApp,
    adminNewDriverWhatsApp,
    postTourFeedbackWhatsApp,
    welcomeWhatsApp,
    generateWhatsAppLink
} from './templates';

// Configuration from Firebase Functions Config
const WHATSAPP_ACCESS_TOKEN = functions.config().whatsapp?.access_token || process.env.WHATSAPP_ACCESS_TOKEN;
const WHATSAPP_PHONE_NUMBER_ID = functions.config().whatsapp?.phone_number_id || process.env.WHATSAPP_PHONE_NUMBER_ID;
const ADMIN_WHATSAPP = functions.config().whatsapp?.admin_number || '+94777721999';

// Meta WhatsApp Cloud API endpoint
const WHATSAPP_API_URL = 'https://graph.facebook.com/v18.0';

interface WhatsAppResponse {
    success: boolean;
    messageId?: string;
    error?: string;
}

// ==========================================
// BASE SEND FUNCTION (Meta Cloud API)
// ==========================================

export const sendWhatsAppMessage = async (
    to: string,
    message: string
): Promise<WhatsAppResponse> => {
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
            return { success: true, messageId: data.messages?.[0]?.id };
        } else {
            console.error('❌ WhatsApp error:', data);
            return { success: false, error: data.error?.message || 'Failed to send' };
        }
    } catch (error: any) {
        console.error('❌ WhatsApp exception:', error.message);
        return { success: false, error: error.message };
    }
};

// ==========================================
// BOOKING MESSAGES
// ==========================================

export const sendTourBookingConfirmation = async (data: {
    phone: string;
    customerName: string;
    bookingRef: string;
    tourName: string;
    tourDate: string;
    guests: number;
    totalPrice: number;
    pickupLocation?: string;
}) => {
    const message = tourBookingWhatsApp(data);
    return sendWhatsAppMessage(data.phone, message);
};

export const sendTransferConfirmation = async (data: {
    phone: string;
    customerName: string;
    bookingRef: string;
    transferType: string;
    pickupLocation: string;
    dropoffLocation: string;
    pickupDate: string;
    pickupTime: string;
    vehicleType: string;
    totalPrice: number;
    flightNumber?: string;
}) => {
    const message = transferBookingWhatsApp(data);
    return sendWhatsAppMessage(data.phone, message);
};

export const sendVehicleRentalConfirmation = async (data: {
    phone: string;
    customerName: string;
    bookingRef: string;
    vehicleType: string;
    pickupDate: string;
    returnDate: string;
    pickupLocation: string;
    driverOption: string;
    totalPrice: number;
}) => {
    const message = vehicleRentalWhatsApp(data);
    return sendWhatsAppMessage(data.phone, message);
};

// ==========================================
// DRIVER MESSAGES
// ==========================================

export const sendDriverRegistration = async (data: {
    phone: string;
    driverName: string;
    applicationId: string;
    tier: string;
}) => {
    const message = driverRegistrationWhatsApp(data);
    return sendWhatsAppMessage(data.phone, message);
};

export const sendDriverApproval = async (data: {
    phone: string;
    driverName: string;
    tier: string;
}) => {
    const message = driverApprovalWhatsApp(data);
    return sendWhatsAppMessage(data.phone, message);
};

export const sendDriverNewBooking = async (data: {
    phone: string;
    driverName: string;
    bookingRef: string;
    customerName: string;
    tourType: string;
    tourDate: string;
    pickupLocation: string;
    pickupTime: string;
    guests: number;
    estimatedEarnings: number;
}) => {
    const message = driverNewBookingWhatsApp(data);
    return sendWhatsAppMessage(data.phone, message);
};

// ==========================================
// REMINDERS
// ==========================================

export const sendBookingReminder = async (data: {
    phone: string;
    customerName: string;
    bookingRef: string;
    tourName: string;
    tourDate: string;
    pickupTime?: string;
    pickupLocation?: string;
    daysUntil: number;
}) => {
    const message = bookingReminderWhatsApp(data);
    return sendWhatsAppMessage(data.phone, message);
};

export const sendPaymentReminder = async (data: {
    phone: string;
    customerName: string;
    bookingRef: string;
    tourName: string;
    amountDue: number;
    dueDate: string;
    paymentLink: string;
}) => {
    const message = paymentReminderWhatsApp(data);
    return sendWhatsAppMessage(data.phone, message);
};

// ==========================================
// ADMIN NOTIFICATIONS
// ==========================================

export const notifyAdminNewBooking = async (data: {
    bookingRef: string;
    customerName: string;
    customerPhone: string;
    tourName: string;
    tourDate: string;
    guests: number;
    totalPrice: number;
}) => {
    const message = adminNewBookingWhatsApp(data);
    return sendWhatsAppMessage(ADMIN_WHATSAPP, message);
};

export const notifyAdminNewDriver = async (data: {
    driverName: string;
    phone: string;
    tier: string;
    applicationId: string;
}) => {
    const message = adminNewDriverWhatsApp(data);
    return sendWhatsAppMessage(ADMIN_WHATSAPP, message);
};

// ==========================================
// FEEDBACK & SUPPORT
// ==========================================

export const sendPostTourFeedback = async (data: {
    phone: string;
    customerName: string;
    tourName: string;
}) => {
    const reviewLink = `https://www.rechargetravels.com/review`;
    const message = postTourFeedbackWhatsApp({ ...data, reviewLink });
    return sendWhatsAppMessage(data.phone, message);
};

export const sendWelcome = async (data: {
    phone: string;
    customerName: string;
}) => {
    const message = welcomeWhatsApp(data);
    return sendWhatsAppMessage(data.phone, message);
};

// ==========================================
// UTILITY - Generate click-to-chat links
// ==========================================

export { generateWhatsAppLink };

export default {
    sendWhatsAppMessage,
    sendTourBookingConfirmation,
    sendTransferConfirmation,
    sendVehicleRentalConfirmation,
    sendDriverRegistration,
    sendDriverApproval,
    sendDriverNewBooking,
    sendBookingReminder,
    sendPaymentReminder,
    notifyAdminNewBooking,
    notifyAdminNewDriver,
    sendPostTourFeedback,
    sendWelcome,
    generateWhatsAppLink
};
