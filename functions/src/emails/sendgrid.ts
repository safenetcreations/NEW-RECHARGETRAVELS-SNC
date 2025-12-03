// SendGrid Email Service for Recharge Travels
// Handles all email sending with beautiful branded templates
import * as functions from 'firebase-functions';
import sgMail from '@sendgrid/mail';
import {
  // New templates
  conciergeBookingTemplate,
  tourBookingTemplate,
  transferBookingTemplate,
  whaleWatchingTemplate,
  welcomeEmailTemplate,
  bookingReminderTemplate,
  // B2B templates
  bookingConfirmationTemplate,
  agencyWelcomeTemplate,
  agencyApprovalTemplate,
  paymentConfirmationTemplate,
  passwordResetTemplate,
  bookingCancellationTemplate
} from './templates';

// Initialize SendGrid
const SENDGRID_API_KEY = functions.config().sendgrid?.api_key || process.env.SENDGRID_API_KEY;
const FROM_EMAIL = functions.config().sendgrid?.from_email || 'bookings@rechargetravels.com';
const FROM_NAME = 'Recharge Travels';
const ADMIN_EMAIL = 'info@rechargetravels.com';

if (SENDGRID_API_KEY) {
  sgMail.setApiKey(SENDGRID_API_KEY);
}

interface EmailOptions {
  to: string | string[];
  subject: string;
  html: string;
  replyTo?: string;
  cc?: string[];
  bcc?: string[];
}

// ==========================================
// BASE EMAIL FUNCTION
// ==========================================

export const sendEmail = async (options: EmailOptions): Promise<boolean> => {
  if (!SENDGRID_API_KEY) {
    console.error('SendGrid API key not configured');
    console.log('Would send email to:', options.to, 'Subject:', options.subject);
    return false;
  }

  try {
    const msg: sgMail.MailDataRequired = {
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

    await sgMail.send(msg);
    console.log(`✅ Email sent successfully to ${Array.isArray(options.to) ? options.to.join(', ') : options.to}`);
    return true;
  } catch (error: any) {
    console.error('❌ SendGrid email error:', error.response?.body || error.message);
    return false;
  }
};

// ==========================================
// VIP CONCIERGE BOOKING EMAIL
// ==========================================

export const sendConciergeBookingConfirmation = async (data: {
  to: string;
  bookingRef: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  preferredDate: string;
  alternateDate?: string;
  location: string;
  guests: number;
  duration: string;
  budget: string;
  selectedServices: string[];
  estimatedTotal: number;
  specialRequests?: string;
}): Promise<boolean> => {
  const html = conciergeBookingTemplate(data);

  // Send to customer
  await sendEmail({
    to: data.to,
    subject: `👑 VIP Concierge Request Confirmed | Ref: ${data.bookingRef}`,
    html,
    bcc: [ADMIN_EMAIL] // Copy to admin
  });

  // Send notification to admin with different subject
  await sendEmail({
    to: ADMIN_EMAIL,
    subject: `🔔 NEW VIP Concierge Request | ${data.firstName} ${data.lastName} | $${data.estimatedTotal}`,
    html
  });

  return true;
};

// ==========================================
// TOUR BOOKING EMAIL
// ==========================================

export const sendTourBookingConfirmation = async (data: {
  to: string;
  bookingRef: string;
  tourName: string;
  tourDate: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  guests: number;
  totalPrice: number;
  paymentStatus: string;
  pickupLocation?: string;
  specialRequests?: string;
  tourImage?: string;
}): Promise<boolean> => {
  const html = tourBookingTemplate(data);

  // Send to customer
  await sendEmail({
    to: data.to,
    subject: `✅ Tour Booking Confirmed - ${data.tourName} | Ref: ${data.bookingRef}`,
    html,
    bcc: [ADMIN_EMAIL]
  });

  return true;
};

// ==========================================
// AIRPORT TRANSFER EMAIL
// ==========================================

export const sendTransferBookingConfirmation = async (data: {
  to: string;
  bookingRef: string;
  transferType: 'arrival' | 'departure' | 'round-trip';
  pickupLocation: string;
  dropoffLocation: string;
  pickupDate: string;
  pickupTime: string;
  flightNumber?: string;
  vehicleType: string;
  passengers: number;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  totalPrice: number;
  driverName?: string;
  driverPhone?: string;
}): Promise<boolean> => {
  const html = transferBookingTemplate(data);

  const transferTypeLabel = {
    'arrival': 'Airport Arrival',
    'departure': 'Airport Departure',
    'round-trip': 'Round Trip'
  }[data.transferType];

  // Send to customer
  await sendEmail({
    to: data.to,
    subject: `🚗 ${transferTypeLabel} Transfer Confirmed | Ref: ${data.bookingRef}`,
    html,
    bcc: [ADMIN_EMAIL]
  });

  return true;
};

// ==========================================
// WHALE WATCHING EMAIL
// ==========================================

export const sendWhaleWatchingConfirmation = async (data: {
  to: string;
  bookingRef: string;
  tourDate: string;
  tourTime: string;
  location: string;
  guests: number;
  boatType: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  totalPrice: number;
  hotelPickup?: string;
}): Promise<boolean> => {
  const html = whaleWatchingTemplate(data);

  // Send to customer
  await sendEmail({
    to: data.to,
    subject: `🐋 Whale Watching Booking Confirmed | ${data.tourDate} | Ref: ${data.bookingRef}`,
    html,
    bcc: [ADMIN_EMAIL]
  });

  return true;
};

// ==========================================
// WELCOME EMAIL
// ==========================================

export const sendWelcomeEmail = async (data: {
  to: string;
  firstName: string;
}): Promise<boolean> => {
  const html = welcomeEmailTemplate({
    firstName: data.firstName,
    email: data.to
  });

  return sendEmail({
    to: data.to,
    subject: `🌴 Welcome to Recharge Travels, ${data.firstName}!`,
    html
  });
};

// ==========================================
// BOOKING REMINDER EMAIL
// ==========================================

export const sendBookingReminder = async (data: {
  to: string;
  firstName: string;
  bookingRef: string;
  tourName: string;
  tourDate: string;
  tourTime?: string;
  daysUntil: number;
  pickupLocation?: string;
}): Promise<boolean> => {
  const html = bookingReminderTemplate(data);

  const subject = data.daysUntil === 1
    ? `⏰ Your ${data.tourName} tour is TOMORROW!`
    : `⏰ ${data.daysUntil} Days Until Your ${data.tourName} Adventure!`;

  return sendEmail({
    to: data.to,
    subject,
    html
  });
};

// ==========================================
// B2B EMAILS
// ==========================================

// Send Booking Confirmation Email (B2B)
export const sendBookingConfirmation = async (data: {
  to: string;
  bookingId: string;
  agencyName: string;
  tourName: string;
  tourDate: string;
  clientName: string;
  clientEmail: string;
  clientPhone: string;
  guestCount: number;
  originalPrice: number;
  discount: number;
  finalPrice: number;
  specialRequests?: string;
}): Promise<boolean> => {
  const html = bookingConfirmationTemplate({
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
  await sendEmail({
    to: data.to,
    subject: `✅ B2B Booking Confirmed - ${data.tourName} | Ref: ${data.bookingId}`,
    html
  });

  // Also send to client if email provided
  if (data.clientEmail && data.clientEmail !== data.to) {
    await sendEmail({
      to: data.clientEmail,
      subject: `Your Tour Booking Confirmation - ${data.tourName}`,
      html
    });
  }

  return true;
};

// Send Agency Welcome Email (Registration)
export const sendAgencyWelcome = async (data: {
  to: string;
  agencyName: string;
  verificationLink: string;
}): Promise<boolean> => {
  const html = agencyWelcomeTemplate({
    agencyName: data.agencyName,
    email: data.to,
    verificationLink: data.verificationLink
  });

  return sendEmail({
    to: data.to,
    subject: '🎉 Welcome to Recharge Travels B2B - Verify Your Email',
    html
  });
};

// Send Agency Approval Email
export const sendAgencyApproval = async (data: {
  to: string;
  agencyName: string;
  loginLink: string;
}): Promise<boolean> => {
  const html = agencyApprovalTemplate({
    agencyName: data.agencyName,
    loginLink: data.loginLink
  });

  return sendEmail({
    to: data.to,
    subject: '🎊 Your B2B Account is Approved! - Recharge Travels',
    html
  });
};

// Send Payment Confirmation Email
export const sendPaymentConfirmation = async (data: {
  to: string;
  bookingId: string;
  tourName: string;
  amount: number;
  paymentMethod: string;
  transactionId?: string;
}): Promise<boolean> => {
  const html = paymentConfirmationTemplate({
    bookingId: data.bookingId,
    tourName: data.tourName,
    amount: data.amount,
    paymentMethod: data.paymentMethod,
    transactionId: data.transactionId
  });

  return sendEmail({
    to: data.to,
    subject: `💳 Payment Received - $${data.amount.toFixed(2)} | Ref: ${data.bookingId}`,
    html
  });
};

// Send Password Reset Email
export const sendPasswordReset = async (data: {
  to: string;
  agencyName: string;
  resetLink: string;
}): Promise<boolean> => {
  const html = passwordResetTemplate({
    agencyName: data.agencyName,
    resetLink: data.resetLink
  });

  return sendEmail({
    to: data.to,
    subject: '🔐 Password Reset Request - Recharge Travels',
    html
  });
};

// Send Booking Cancellation Email
export const sendBookingCancellation = async (data: {
  to: string;
  bookingId: string;
  tourName: string;
  tourDate: string;
  refundAmount?: number;
  reason?: string;
}): Promise<boolean> => {
  const html = bookingCancellationTemplate({
    bookingId: data.bookingId,
    tourName: data.tourName,
    tourDate: data.tourDate,
    refundAmount: data.refundAmount,
    reason: data.reason
  });

  return sendEmail({
    to: data.to,
    subject: `❌ Booking Cancelled - ${data.tourName} | Ref: ${data.bookingId}`,
    html
  });
};

// ==========================================
// GENERIC EMAIL FUNCTION (for custom emails)
// ==========================================

export const sendGenericEmail = async (data: {
  to: string | string[];
  subject: string;
  html: string;
  replyTo?: string;
  cc?: string[];
}): Promise<boolean> => {
  return sendEmail({
    to: data.to,
    subject: data.subject,
    html: data.html,
    replyTo: data.replyTo,
    cc: data.cc
  });
};

export default {
  sendEmail,
  sendConciergeBookingConfirmation,
  sendTourBookingConfirmation,
  sendTransferBookingConfirmation,
  sendWhaleWatchingConfirmation,
  sendWelcomeEmail,
  sendBookingReminder,
  sendBookingConfirmation,
  sendAgencyWelcome,
  sendAgencyApproval,
  sendPaymentConfirmation,
  sendPasswordReset,
  sendBookingCancellation,
  sendGenericEmail
};
