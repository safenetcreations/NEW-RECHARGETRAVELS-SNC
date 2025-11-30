// Notification Service - SendGrid Email & WhatsApp Cloud API Integration
// For server-side implementation, use Firebase Cloud Functions

import { db } from '@/lib/firebase';
import { addDoc, collection, Timestamp } from 'firebase/firestore';

// ============================================
// TYPES
// ============================================

export interface EmailData {
  to: string;
  subject: string;
  templateId?: string;
  dynamicData?: Record<string, any>;
  html?: string;
  text?: string;
}

export interface WhatsAppMessage {
  to: string; // Phone number with country code
  template?: string;
  templateData?: Record<string, string>;
  text?: string;
}

export interface BookingNotification {
  bookingRef: string;
  tourTitle: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  travelDate: string;
  travellers: number;
  totalAmount: number;
  pickupLocation?: string;
}

// ============================================
// NOTIFICATION QUEUE (Firestore Trigger)
// ============================================

// Queue email for Cloud Function to process
export const queueEmail = async (emailData: EmailData): Promise<boolean> => {
  try {
    await addDoc(collection(db, 'emailQueue'), {
      ...emailData,
      status: 'pending',
      createdAt: Timestamp.now(),
      attempts: 0
    });
    return true;
  } catch (error) {
    console.error('Error queuing email:', error);
    return false;
  }
};

// Queue WhatsApp message for Cloud Function to process
export const queueWhatsApp = async (message: WhatsAppMessage): Promise<boolean> => {
  try {
    await addDoc(collection(db, 'whatsappQueue'), {
      ...message,
      status: 'pending',
      createdAt: Timestamp.now(),
      attempts: 0
    });
    return true;
  } catch (error) {
    console.error('Error queuing WhatsApp:', error);
    return false;
  }
};

// ============================================
// BOOKING NOTIFICATION HELPERS
// ============================================

export const sendBookingConfirmation = async (booking: BookingNotification): Promise<void> => {
  // Queue customer email
  await queueEmail({
    to: booking.customerEmail,
    subject: `Booking Confirmed: ${booking.tourTitle} - ${booking.bookingRef}`,
    templateId: 'booking_confirmation',
    dynamicData: {
      customer_name: booking.customerName,
      booking_ref: booking.bookingRef,
      tour_title: booking.tourTitle,
      travel_date: booking.travelDate,
      travellers: booking.travellers,
      total_amount: booking.totalAmount,
      pickup_location: booking.pickupLocation || 'To be confirmed',
      whatsapp_link: 'https://wa.me/94777721999',
      website_url: 'https://www.rechargetravels.com'
    }
  });

  // Queue admin notification email
  await queueEmail({
    to: 'bookings@rechargetravels.com',
    subject: `New Booking: ${booking.bookingRef} - ${booking.tourTitle}`,
    templateId: 'admin_new_booking',
    dynamicData: {
      booking_ref: booking.bookingRef,
      customer_name: booking.customerName,
      customer_email: booking.customerEmail,
      customer_phone: booking.customerPhone,
      tour_title: booking.tourTitle,
      travel_date: booking.travelDate,
      travellers: booking.travellers,
      total_amount: booking.totalAmount
    }
  });

  // Queue WhatsApp to customer
  const cleanPhone = booking.customerPhone.replace(/[^0-9]/g, '');
  await queueWhatsApp({
    to: cleanPhone,
    template: 'booking_confirmation',
    templateData: {
      '1': booking.customerName,
      '2': booking.bookingRef,
      '3': booking.tourTitle,
      '4': booking.travelDate,
      '5': `$${booking.totalAmount}`
    }
  });
};

export const sendPaymentConfirmation = async (booking: BookingNotification, paymentId: string): Promise<void> => {
  await queueEmail({
    to: booking.customerEmail,
    subject: `Payment Received: ${booking.bookingRef}`,
    templateId: 'payment_confirmation',
    dynamicData: {
      customer_name: booking.customerName,
      booking_ref: booking.bookingRef,
      payment_id: paymentId,
      total_amount: booking.totalAmount,
      tour_title: booking.tourTitle
    }
  });
};

export const sendBookingStatusUpdate = async (
  booking: BookingNotification,
  status: 'confirmed' | 'cancelled' | 'completed'
): Promise<void> => {
  const statusMessages = {
    confirmed: 'Your booking has been confirmed!',
    cancelled: 'Your booking has been cancelled.',
    completed: 'Thank you for traveling with us!'
  };

  await queueEmail({
    to: booking.customerEmail,
    subject: `Booking ${status.charAt(0).toUpperCase() + status.slice(1)}: ${booking.bookingRef}`,
    templateId: `booking_${status}`,
    dynamicData: {
      customer_name: booking.customerName,
      booking_ref: booking.bookingRef,
      tour_title: booking.tourTitle,
      message: statusMessages[status]
    }
  });

  const cleanPhone = booking.customerPhone.replace(/[^0-9]/g, '');
  await queueWhatsApp({
    to: cleanPhone,
    text: `Hi ${booking.customerName}! ${statusMessages[status]} Booking: ${booking.bookingRef}. For queries, reply here or call +94 777 721 999.`
  });
};

// ============================================
// SENDGRID EMAIL TEMPLATES (For Reference)
// ============================================

/*
Create these templates in SendGrid:

1. booking_confirmation
   Subject: Booking Confirmed: {{tour_title}} - {{booking_ref}}
   
   Body:
   Dear {{customer_name}},
   
   Thank you for booking with Recharge Travels!
   
   BOOKING DETAILS:
   - Reference: {{booking_ref}}
   - Tour: {{tour_title}}
   - Date: {{travel_date}}
   - Travelers: {{travellers}}
   - Total: ${{total_amount}}
   - Pickup: {{pickup_location}}
   
   Our team will contact you shortly to confirm details.
   
   Questions? Contact us:
   - WhatsApp: {{whatsapp_link}}
   - Email: bookings@rechargetravels.com
   
   Safe travels!
   Recharge Travels Team

2. admin_new_booking
   Subject: New Booking: {{booking_ref}} - {{tour_title}}
   
   Body:
   NEW BOOKING RECEIVED
   
   Customer: {{customer_name}}
   Email: {{customer_email}}
   Phone: {{customer_phone}}
   Tour: {{tour_title}}
   Date: {{travel_date}}
   Travelers: {{travellers}}
   Total: ${{total_amount}}
   
   Please follow up within 24 hours.

3. payment_confirmation
   Subject: Payment Received: {{booking_ref}}
   
   Body:
   Payment Confirmed!
   
   Amount: ${{total_amount}}
   Payment ID: {{payment_id}}
   Booking: {{booking_ref}}
   Tour: {{tour_title}}
*/

// ============================================
// WHATSAPP TEMPLATES (For Reference)
// ============================================

/*
Create these templates in Meta Business:

1. booking_confirmation
   Header: ✅ Booking Confirmed!
   Body: Hi {{1}}! Your booking {{2}} for {{3}} on {{4}} is confirmed. Total: {{5}}. Questions? Reply here!
   Footer: Recharge Travels

2. payment_reminder
   Header: 💳 Payment Reminder
   Body: Hi {{1}}, please complete payment for booking {{2}}. Total: {{3}}. Pay now: {{4}}
   Footer: Recharge Travels
*/
