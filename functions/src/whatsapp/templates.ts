// WhatsApp Message Templates for Recharge Travels
// Use with WhatsApp Business API via Twilio or Meta Cloud API

const COMPANY_NAME = 'Recharge Travels';
const WEBSITE_URL = 'https://www.rechargetravels.com';
const WHATSAPP_NUMBER = '+94777721999';

// ==========================================
// BOOKING CONFIRMATIONS
// ==========================================

export const tourBookingWhatsApp = (data: {
    customerName: string;
    bookingRef: string;
    tourName: string;
    tourDate: string;
    guests: number;
    totalPrice: number;
    pickupLocation?: string;
}) => `
🌴 *BOOKING CONFIRMED*

Hello ${data.customerName}! 👋

Your tour booking is confirmed! ✅

📋 *Booking Details:*
━━━━━━━━━━━━━━━
🎫 Ref: *${data.bookingRef}*
🏝️ Tour: ${data.tourName}
📅 Date: ${data.tourDate}
👥 Guests: ${data.guests}
${data.pickupLocation ? `📍 Pickup: ${data.pickupLocation}` : ''}
💰 Total: *$${data.totalPrice}*
━━━━━━━━━━━━━━━

*What's Next?*
✓ Save this booking reference
✓ We'll share driver details 24hrs before
✓ Bring ID & comfortable clothing

Questions? Just reply to this message!

🌐 ${WEBSITE_URL}
━━━━━━━━━━━━━━━
_Thank you for choosing ${COMPANY_NAME}!_ 🙏
`;

export const transferBookingWhatsApp = (data: {
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
}) => `
🚗 *TRANSFER CONFIRMED*

Hello ${data.customerName}! 👋

Your airport transfer is confirmed! ✅

📋 *Transfer Details:*
━━━━━━━━━━━━━━━
🎫 Ref: *${data.bookingRef}*
🚗 Type: ${data.transferType}
📍 From: ${data.pickupLocation}
📍 To: ${data.dropoffLocation}
📅 Date: ${data.pickupDate}
⏰ Time: *${data.pickupTime}*
${data.flightNumber ? `✈️ Flight: ${data.flightNumber}` : ''}
🚙 Vehicle: ${data.vehicleType}
💰 Total: *$${data.totalPrice}*
━━━━━━━━━━━━━━━

📌 *Important:*
• Driver will be at arrival hall with name board
• 60 min free waiting for flight delays
• Driver details shared 24hrs before

Questions? Just reply! 💬

_${COMPANY_NAME}_ 🌴
`;

export const vehicleRentalWhatsApp = (data: {
    customerName: string;
    bookingRef: string;
    vehicleType: string;
    pickupDate: string;
    returnDate: string;
    pickupLocation: string;
    driverOption: string;
    totalPrice: number;
}) => `
🚗 *VEHICLE RENTAL CONFIRMED*

Hello ${data.customerName}! 👋

Your vehicle rental is confirmed! ✅

📋 *Rental Details:*
━━━━━━━━━━━━━━━
🎫 Ref: *${data.bookingRef}*
🚙 Vehicle: ${data.vehicleType}
📅 Pickup: ${data.pickupDate}
📅 Return: ${data.returnDate}
📍 Location: ${data.pickupLocation}
👤 Driver: ${data.driverOption}
💰 Total: *$${data.totalPrice}*
━━━━━━━━━━━━━━━

We'll confirm vehicle & driver details soon!

Questions? Reply here! 💬

_${COMPANY_NAME}_ 🌴
`;

// ==========================================
// DRIVER MESSAGES
// ==========================================

export const driverRegistrationWhatsApp = (data: {
    driverName: string;
    applicationId: string;
    tier: string;
}) => `
🚗 *APPLICATION RECEIVED*

Hello ${data.driverName}! 👋

Thank you for applying to join ${COMPANY_NAME}! 🎯

📋 *Application Details:*
━━━━━━━━━━━━━━━
🎫 ID: *${data.applicationId}*
⭐ Tier: ${data.tier}
📅 Status: Under Review
━━━━━━━━━━━━━━━

*What's Next?*
1️⃣ Our team reviews your documents
2️⃣ We may contact you for more info
3️⃣ Approval within 24-48 hours
4️⃣ Start receiving bookings! 🎉

Keep this message for reference.

Questions? Reply here! 💬

_${COMPANY_NAME} Driver Partner Team_ 🌴
`;

export const driverApprovalWhatsApp = (data: {
    driverName: string;
    tier: string;
}) => `
🎉 *CONGRATULATIONS!*

Hello ${data.driverName}! 👋

Your driver account is now *APPROVED*! ✅

━━━━━━━━━━━━━━━
⭐ You are now a verified
*${data.tier}*
with ${COMPANY_NAME}!
━━━━━━━━━━━━━━━

*What You Get:*
✅ Access to tourist bookings
✅ Verified driver badge
✅ Real-time notifications
✅ Secure payments to your bank
✅ 24/7 WhatsApp support

🔗 Login to Dashboard:
${WEBSITE_URL}/driver/dashboard

Start receiving bookings today! 🚗

_Welcome to the team!_ 🙏
`;

export const driverNewBookingWhatsApp = (data: {
    driverName: string;
    bookingRef: string;
    customerName: string;
    tourType: string;
    tourDate: string;
    pickupLocation: string;
    pickupTime: string;
    guests: number;
    estimatedEarnings: number;
}) => `
🔔 *NEW BOOKING ALERT*

Hello ${data.driverName}! 🚗

New booking assigned to you!

📋 *Booking Details:*
━━━━━━━━━━━━━━━
🎫 Ref: *${data.bookingRef}*
👤 Customer: ${data.customerName}
🏝️ Type: ${data.tourType}
📅 Date: ${data.tourDate}
⏰ Pickup: *${data.pickupTime}*
📍 Location: ${data.pickupLocation}
👥 Guests: ${data.guests}
💰 Earnings: *LKR ${data.estimatedEarnings.toLocaleString()}*
━━━━━━━━━━━━━━━

*Actions:*
Reply "ACCEPT" to confirm
Reply "DECLINE" to reject

Please respond within 30 minutes!

_${COMPANY_NAME}_ 🌴
`;

// ==========================================
// REMINDERS & NOTIFICATIONS
// ==========================================

export const bookingReminderWhatsApp = (data: {
    customerName: string;
    bookingRef: string;
    tourName: string;
    tourDate: string;
    pickupTime?: string;
    pickupLocation?: string;
    daysUntil: number;
}) => `
⏰ *BOOKING REMINDER*

Hello ${data.customerName}! 👋

${data.daysUntil === 1 ? "Your adventure is *TOMORROW*! 🎉" : `${data.daysUntil} days until your adventure!`}

📋 *Your Booking:*
━━━━━━━━━━━━━━━
🎫 Ref: ${data.bookingRef}
🏝️ Tour: ${data.tourName}
📅 Date: *${data.tourDate}*
${data.pickupTime ? `⏰ Pickup: ${data.pickupTime}` : ''}
${data.pickupLocation ? `📍 Location: ${data.pickupLocation}` : ''}
━━━━━━━━━━━━━━━

*Checklist:* ✅
□ Valid ID/Passport
□ Comfortable clothes
□ Camera/Phone charged
□ Sunscreen & hat
□ This booking reference

Need to change anything? Reply now!

_See you soon!_ 🌴
_${COMPANY_NAME}_
`;

export const paymentReminderWhatsApp = (data: {
    customerName: string;
    bookingRef: string;
    tourName: string;
    amountDue: number;
    dueDate: string;
    paymentLink: string;
}) => `
💳 *PAYMENT REMINDER*

Hello ${data.customerName}! 👋

Gentle reminder about your pending payment.

📋 *Payment Details:*
━━━━━━━━━━━━━━━
🎫 Booking: ${data.bookingRef}
🏝️ Tour: ${data.tourName}
💰 Amount: *$${data.amountDue}*
📅 Due: ${data.dueDate}
━━━━━━━━━━━━━━━

💳 Pay now:
${data.paymentLink}

Need help? Reply here! 💬

_${COMPANY_NAME}_ 🌴
`;

// ==========================================
// ADMIN NOTIFICATIONS
// ==========================================

export const adminNewBookingWhatsApp = (data: {
    bookingRef: string;
    customerName: string;
    customerPhone: string;
    tourName: string;
    tourDate: string;
    guests: number;
    totalPrice: number;
}) => `
🔔 *NEW BOOKING*

━━━━━━━━━━━━━━━
🎫 Ref: ${data.bookingRef}
👤 ${data.customerName}
📞 ${data.customerPhone}
🏝️ ${data.tourName}
📅 ${data.tourDate}
👥 ${data.guests} guests
💰 $${data.totalPrice}
━━━━━━━━━━━━━━━

Action required! ⚡
`;

export const adminNewDriverWhatsApp = (data: {
    driverName: string;
    phone: string;
    tier: string;
    applicationId: string;
}) => `
🔔 *NEW DRIVER APPLICATION*

━━━━━━━━━━━━━━━
🎫 ID: ${data.applicationId}
👤 ${data.driverName}
📞 ${data.phone}
⭐ ${data.tier}
━━━━━━━━━━━━━━━

Review documents in admin panel! ⚡
`;

// ==========================================
// SUPPORT & FEEDBACK
// ==========================================

export const postTourFeedbackWhatsApp = (data: {
    customerName: string;
    tourName: string;
    reviewLink: string;
}) => `
🌟 *HOW WAS YOUR TOUR?*

Hello ${data.customerName}! 👋

We hope you enjoyed your ${data.tourName}! 🌴

We'd love to hear from you!

⭐ Rate your experience (1-5):
Reply with a number!

📝 Leave a detailed review:
${data.reviewLink}

Your feedback helps us improve and helps other travelers! 🙏

_Thank you for traveling with us!_
_${COMPANY_NAME}_ 💚
`;

export const welcomeWhatsApp = (data: {
    customerName: string;
}) => `
🌴 *WELCOME TO RECHARGE TRAVELS!*

Hello ${data.customerName}! 👋

Thank you for joining us! 🎉

*What we offer:*
🏝️ Day Tours & Excursions
🚗 Airport Transfers
🐋 Whale Watching
🚙 Vehicle Rentals
👤 Private Chauffeur Guides

*Quick Links:*
🌐 Website: ${WEBSITE_URL}
📸 Instagram: @rechargetravels
📘 Facebook: /rechargetravels

Need help planning your trip?
Just send us a message! 💬

_${COMPANY_NAME}_ 🙏
`;

// ==========================================
// WHATSAPP TEMPLATE GENERATOR
// ==========================================

export const generateWhatsAppLink = (phone: string, message: string) => {
    const cleanPhone = phone.replace(/[^0-9]/g, '');
    const encodedMessage = encodeURIComponent(message);
    return `https://wa.me/${cleanPhone}?text=${encodedMessage}`;
};

export default {
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
};
