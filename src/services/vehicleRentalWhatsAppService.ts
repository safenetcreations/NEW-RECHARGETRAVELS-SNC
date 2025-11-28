/**
 * Vehicle Rental WhatsApp Integration Service
 * Handles WhatsApp notifications for vehicle rental bookings
 * 
 * @module services/vehicleRentalWhatsAppService
 */

// WhatsApp message types
export type WhatsAppMessageType =
  | 'booking_confirmation'
  | 'booking_approved'
  | 'booking_rejected'
  | 'booking_cancelled'
  | 'payment_received'
  | 'pickup_reminder'
  | 'return_reminder'
  | 'deposit_released'
  | 'new_message'
  | 'owner_new_booking'
  | 'payout_processed';

export interface WhatsAppRecipient {
  phone: string;
  name: string;
}

export interface VehicleWhatsAppData {
  bookingReference?: string;
  vehicleName?: string;
  customerName?: string;
  ownerName?: string;
  pickupDate?: string;
  returnDate?: string;
  pickupLocation?: string;
  amount?: number;
  depositAmount?: number;
  senderName?: string;
  messagePreview?: string;
}

// WhatsApp message templates
const whatsAppTemplates: Record<WhatsAppMessageType, (data: VehicleWhatsAppData) => string> = {
  booking_confirmation: (data) => `
🚗 *Booking Confirmed!*

Hi ${data.customerName},

Your vehicle rental has been confirmed!

📋 *Booking Details:*
• Reference: ${data.bookingReference}
• Vehicle: ${data.vehicleName}
• Pick-up: ${data.pickupDate}
• Return: ${data.returnDate}
• Location: ${data.pickupLocation}

💰 Total: $${data.amount?.toFixed(2)}

Thank you for choosing Recharge Travels!
View booking: https://rechargetravels.com/vehicle-rental/my-bookings
`.trim(),

  booking_approved: (data) => `
✅ *Booking Approved!*

Hi ${data.customerName},

Great news! Your booking for *${data.vehicleName}* has been approved by the owner.

📅 Pick-up: ${data.pickupDate}
📍 Location: ${data.pickupLocation}

Reference: ${data.bookingReference}

View details: https://rechargetravels.com/vehicle-rental/my-bookings
`.trim(),

  booking_rejected: (data) => `
❌ *Booking Not Available*

Hi ${data.customerName},

Unfortunately, your booking request for *${data.vehicleName}* could not be accommodated.

Reference: ${data.bookingReference}
Dates: ${data.pickupDate} - ${data.returnDate}

Any payment made will be refunded within 5-7 business days.

Browse other vehicles: https://rechargetravels.com/vehicle-rental
`.trim(),

  booking_cancelled: (data) => `
🚫 *Booking Cancelled*

Hi ${data.customerName},

Your booking has been cancelled as requested.

📋 Reference: ${data.bookingReference}
🚗 Vehicle: ${data.vehicleName}
📅 Dates: ${data.pickupDate} - ${data.returnDate}

Any eligible refund will be processed within 5-7 business days.
`.trim(),

  payment_received: (data) => `
💳 *Payment Received*

Hi ${data.customerName},

We've received your payment of *$${data.amount?.toFixed(2)}* for booking ${data.bookingReference}.

🚗 Vehicle: ${data.vehicleName}
📅 Dates: ${data.pickupDate} - ${data.returnDate}

Your booking is confirmed! You'll receive a reminder before pick-up.
`.trim(),

  pickup_reminder: (data) => `
⏰ *Pick-up Reminder*

Hi ${data.customerName},

Your vehicle pick-up is scheduled for tomorrow!

📅 Date: ${data.pickupDate}
📍 Location: ${data.pickupLocation}
🚗 Vehicle: ${data.vehicleName}

📋 *Please bring:*
• Valid driver's license
• Government ID or passport
• Payment for security deposit

Reference: ${data.bookingReference}
`.trim(),

  return_reminder: (data) => `
⏰ *Return Reminder*

Hi ${data.customerName},

Your vehicle rental ends tomorrow!

📅 Return by: ${data.returnDate}
📍 Location: ${data.pickupLocation}
🚗 Vehicle: ${data.vehicleName}

📋 *Before returning:*
• Fill fuel to the same level
• Remove personal belongings
• Take photos of vehicle condition

Your deposit of *$${data.depositAmount?.toFixed(2)}* will be released after inspection.
`.trim(),

  deposit_released: (data) => `
✅ *Deposit Released*

Hi ${data.customerName},

Good news! Your security deposit of *$${data.depositAmount?.toFixed(2)}* has been released.

📋 Booking: ${data.bookingReference}
🚗 Vehicle: ${data.vehicleName}

The refund will be credited to your account within 5-7 business days.

Thank you for choosing Recharge Travels! 🙏
`.trim(),

  new_message: (data) => `
💬 *New Message*

Hi ${data.customerName || data.ownerName},

You have a new message from *${data.senderName}*:

"${data.messagePreview}"

${data.bookingReference ? `Regarding: Booking ${data.bookingReference}` : ''}

Reply here: https://rechargetravels.com/vehicle-rental/messages
`.trim(),

  owner_new_booking: (data) => `
🎉 *New Booking Request!*

Hi ${data.ownerName},

You have a new booking request for your vehicle!

🚗 Vehicle: ${data.vehicleName}
👤 Customer: ${data.customerName}
📅 Dates: ${data.pickupDate} - ${data.returnDate}
📍 Pick-up: ${data.pickupLocation}

📋 Reference: ${data.bookingReference}

⏰ Please respond within 24 hours.

Manage: https://rechargetravels.com/vehicle-rental/owner/bookings
`.trim(),

  payout_processed: (data) => `
💰 *Payout Processed!*

Hi ${data.ownerName},

Your payout of *$${data.amount?.toFixed(2)}* has been processed!

📋 Booking: ${data.bookingReference}
🚗 Vehicle: ${data.vehicleName}

The funds will be credited to your account within 1-3 business days.

View details: https://rechargetravels.com/vehicle-rental/owner/payouts
`.trim(),
};

/**
 * Format phone number for WhatsApp API
 * Removes spaces, dashes, and ensures country code
 */
function formatPhoneNumber(phone: string): string {
  // Remove all non-digit characters except +
  let cleaned = phone.replace(/[^\d+]/g, '');
  
  // Ensure country code is present
  if (!cleaned.startsWith('+')) {
    // Default to Sri Lanka country code if no country code
    if (cleaned.startsWith('0')) {
      cleaned = '+94' + cleaned.substring(1);
    } else if (!cleaned.startsWith('94')) {
      cleaned = '+94' + cleaned;
    } else {
      cleaned = '+' + cleaned;
    }
  }
  
  return cleaned;
}

/**
 * Send WhatsApp message using WhatsApp Business API
 */
export async function sendWhatsAppMessage(
  recipient: WhatsAppRecipient,
  type: WhatsAppMessageType,
  data: VehicleWhatsAppData
): Promise<{ success: boolean; messageId?: string; error?: string }> {
  try {
    const template = whatsAppTemplates[type];
    if (!template) {
      throw new Error(`Unknown WhatsApp template: ${type}`);
    }

    const message = template(data);
    const formattedPhone = formatPhoneNumber(recipient.phone);

    // In production, integrate with WhatsApp Business API
    // Using Twilio, MessageBird, or direct Meta API
    
    console.log('Sending WhatsApp message:', {
      to: formattedPhone,
      recipientName: recipient.name,
      type,
      messageLength: message.length,
      timestamp: new Date().toISOString(),
    });

    // Example Twilio integration (commented out):
    /*
    const twilioClient = require('twilio')(
      process.env.TWILIO_ACCOUNT_SID,
      process.env.TWILIO_AUTH_TOKEN
    );
    
    const response = await twilioClient.messages.create({
      from: `whatsapp:${process.env.TWILIO_WHATSAPP_NUMBER}`,
      to: `whatsapp:${formattedPhone}`,
      body: message
    });
    
    return { success: true, messageId: response.sid };
    */

    // Simulate successful send
    return {
      success: true,
      messageId: `wa_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    };
  } catch (error) {
    console.error('WhatsApp send error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to send WhatsApp message',
    };
  }
}

/**
 * Send booking confirmation via WhatsApp to customer
 */
export async function sendBookingConfirmationWhatsApp(
  customerPhone: string,
  customerName: string,
  data: VehicleWhatsAppData
): Promise<{ success: boolean; messageId?: string; error?: string }> {
  return sendWhatsAppMessage(
    { phone: customerPhone, name: customerName },
    'booking_confirmation',
    { ...data, customerName }
  );
}

/**
 * Send new booking notification to owner via WhatsApp
 */
export async function sendOwnerNewBookingWhatsApp(
  ownerPhone: string,
  ownerName: string,
  data: VehicleWhatsAppData
): Promise<{ success: boolean; messageId?: string; error?: string }> {
  return sendWhatsAppMessage(
    { phone: ownerPhone, name: ownerName },
    'owner_new_booking',
    { ...data, ownerName }
  );
}

/**
 * Send pickup reminder via WhatsApp
 */
export async function sendPickupReminderWhatsApp(
  customerPhone: string,
  customerName: string,
  data: VehicleWhatsAppData
): Promise<{ success: boolean; messageId?: string; error?: string }> {
  return sendWhatsAppMessage(
    { phone: customerPhone, name: customerName },
    'pickup_reminder',
    { ...data, customerName }
  );
}

/**
 * Send return reminder via WhatsApp
 */
export async function sendReturnReminderWhatsApp(
  customerPhone: string,
  customerName: string,
  data: VehicleWhatsAppData
): Promise<{ success: boolean; messageId?: string; error?: string }> {
  return sendWhatsAppMessage(
    { phone: customerPhone, name: customerName },
    'return_reminder',
    { ...data, customerName }
  );
}

/**
 * Send payout notification to owner via WhatsApp
 */
export async function sendPayoutNotificationWhatsApp(
  ownerPhone: string,
  ownerName: string,
  data: VehicleWhatsAppData
): Promise<{ success: boolean; messageId?: string; error?: string }> {
  return sendWhatsAppMessage(
    { phone: ownerPhone, name: ownerName },
    'payout_processed',
    { ...data, ownerName }
  );
}

/**
 * Generate WhatsApp share link
 */
export function generateWhatsAppShareLink(
  phone: string,
  message: string
): string {
  const formattedPhone = formatPhoneNumber(phone).replace('+', '');
  const encodedMessage = encodeURIComponent(message);
  return `https://wa.me/${formattedPhone}?text=${encodedMessage}`;
}

/**
 * Generate WhatsApp click-to-chat link for customer support
 */
export function getCustomerSupportWhatsAppLink(
  bookingReference?: string
): string {
  const supportPhone = '94771234567'; // Replace with actual support number
  let message = 'Hi! I need help with my vehicle rental booking.';
  if (bookingReference) {
    message += `\nBooking Reference: ${bookingReference}`;
  }
  return generateWhatsAppShareLink(supportPhone, message);
}

/**
 * Check if WhatsApp is available for a phone number
 * In production, this would use WhatsApp Business API to verify
 */
export async function checkWhatsAppAvailability(
  phone: string
): Promise<{ available: boolean; formattedNumber: string }> {
  const formattedNumber = formatPhoneNumber(phone);
  
  // In production, use WhatsApp Business API to check
  // For now, assume available if valid format
  const isValid = /^\+\d{10,15}$/.test(formattedNumber);
  
  return {
    available: isValid,
    formattedNumber,
  };
}

/**
 * Get all available WhatsApp template types
 */
export function getAvailableWhatsAppTemplates(): WhatsAppMessageType[] {
  return Object.keys(whatsAppTemplates) as WhatsAppMessageType[];
}

/**
 * Preview WhatsApp message template
 */
export function previewWhatsAppTemplate(
  type: WhatsAppMessageType,
  sampleData: VehicleWhatsAppData
): string {
  const template = whatsAppTemplates[type];
  if (!template) {
    return 'Template not found';
  }
  return template(sampleData);
}
