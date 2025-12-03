import { db } from '@/lib/firebase';
import { collection, addDoc, doc, updateDoc, Timestamp } from 'firebase/firestore';
import { queueEmail, queueWhatsApp } from './notificationService';

// ============================================
// TYPES
// ============================================

export interface CookingClassBookingData {
  // Customer info
  contactName: string;
  contactEmail: string;
  contactPhone: string;

  // Booking details
  date: string;
  session: string;
  classType: string;
  city: string;
  adults: number;
  children: number;
  dietaryRequirements: string;
  requests: string;

  // Pricing
  estimatedTotal: number;
  currency: string;
}

export interface CookingClassBookingResult {
  success: boolean;
  bookingRef: string;
  bookingId: string;
  whatsAppLink: string;
  error?: string;
}

// ============================================
// CONSTANTS
// ============================================

const COLLECTION_NAME = 'cookingClassBookings';
const COMPANY_WHATSAPP = '94777721999';
const COMPANY_EMAIL = 'concierge@rechargetravels.com';
const COMPANY_PHONE = '+94 777 721 999';

// Generate booking reference
const generateBookingRef = (): string => {
  const timestamp = Date.now().toString(36).toUpperCase();
  const random = Math.random().toString(36).substring(2, 5).toUpperCase();
  return `COOK-${timestamp}-${random}`;
};

// Format date for display
const formatDate = (dateStr: string): string => {
  if (!dateStr) return 'Not specified';
  const date = new Date(dateStr);
  return date.toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};

// ============================================
// BOOKING SERVICE
// ============================================

class CookingClassBookingService {
  /**
   * Submit a cooking class booking
   * - Saves to Firebase
   * - Sends email to admin
   * - Sends confirmation email to customer
   * - Queues WhatsApp notification
   * - Returns WhatsApp link for instant follow-up
   */
  async submitBooking(data: CookingClassBookingData): Promise<CookingClassBookingResult> {
    const bookingRef = generateBookingRef();

    try {
      // 1. Save to Firebase
      const bookingData = {
        ...data,
        bookingRef,
        type: 'cooking-class',
        status: 'new',
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now(),
        source: 'cooking-class-page',
        // CRM fields
        leadSource: 'website',
        leadStatus: 'hot',
        followUpRequired: true,
        assignedTo: null,
        notes: [],
        // Tracking
        emailSent: false,
        whatsAppSent: false,
        responseTime: null
      };

      const docRef = await addDoc(collection(db, COLLECTION_NAME), bookingData);

      // 2. Send admin notification email
      await this.sendAdminNotification(bookingRef, docRef.id, data);

      // 3. Send customer confirmation email
      await this.sendCustomerConfirmation(bookingRef, data);

      // 4. Queue WhatsApp notification to customer
      await this.sendWhatsAppConfirmation(bookingRef, data);

      // 5. Update tracking status
      await updateDoc(doc(db, COLLECTION_NAME, docRef.id), {
        emailSent: true,
        whatsAppSent: true,
        updatedAt: Timestamp.now()
      });

      // 6. Generate WhatsApp link for instant follow-up
      const whatsAppLink = this.generateWhatsAppLink(bookingRef, data);

      return {
        success: true,
        bookingRef,
        bookingId: docRef.id,
        whatsAppLink
      };
    } catch (error) {
      console.error('Cooking class booking submission error:', error);
      return {
        success: false,
        bookingRef,
        bookingId: '',
        whatsAppLink: '',
        error: 'Failed to submit booking. Please try again or contact us directly.'
      };
    }
  }

  /**
   * Send notification to admin/concierge team
   */
  private async sendAdminNotification(
    bookingRef: string,
    bookingId: string,
    data: CookingClassBookingData
  ): Promise<void> {
    try {
      await queueEmail({
        to: COMPANY_EMAIL,
        subject: `🍳 NEW COOKING CLASS: ${data.city} - ${bookingRef}`,
        templateId: 'admin_new_booking',
        dynamicData: {
          booking_ref: bookingRef,
          booking_id: bookingId,
          type: 'Cooking Class',
          emoji: '🍳',
          customer_name: data.contactName,
          customer_email: data.contactEmail,
          customer_phone: data.contactPhone,
          class_type: data.classType,
          city: data.city,
          travel_date: formatDate(data.date),
          session: data.session,
          adults: data.adults,
          children: data.children,
          total_guests: data.adults + data.children,
          dietary_requirements: data.dietaryRequirements || 'None specified',
          special_requests: data.requests || 'None',
          estimated_total: `${data.currency} ${data.estimatedTotal.toLocaleString()}`,
          timestamp: new Date().toISOString(),
          dashboard_link: `https://recharge-travels-admin.web.app/bookings/${bookingId}`
        }
      });
    } catch (error) {
      console.error('Admin notification failed:', error);
    }
  }

  /**
   * Send confirmation email to customer
   */
  private async sendCustomerConfirmation(
    bookingRef: string,
    data: CookingClassBookingData
  ): Promise<void> {
    try {
      await queueEmail({
        to: data.contactEmail,
        subject: `🍳 Cooking Class Confirmed - ${bookingRef}`,
        templateId: 'booking_confirmation',
        dynamicData: {
          customer_name: data.contactName,
          booking_ref: bookingRef,
          tour_title: `${data.classType} - ${data.city}`,
          travel_date: formatDate(data.date),
          session: data.session,
          travellers: data.adults + data.children,
          adults: data.adults,
          children: data.children,
          dietary_requirements: data.dietaryRequirements || 'None specified',
          total_amount: data.estimatedTotal,
          currency: data.currency,
          special_requests: data.requests || 'None',
          company_phone: COMPANY_PHONE,
          company_email: COMPANY_EMAIL,
          whatsapp_link: `https://wa.me/${COMPANY_WHATSAPP}`,
          website_url: 'https://www.rechargetravels.com',
          estimated_response: '15 minutes'
        }
      });
    } catch (error) {
      console.error('Customer confirmation failed:', error);
    }
  }

  /**
   * Queue WhatsApp confirmation to customer
   */
  private async sendWhatsAppConfirmation(
    bookingRef: string,
    data: CookingClassBookingData
  ): Promise<void> {
    try {
      const cleanPhone = data.contactPhone.replace(/[^0-9]/g, '');

      await queueWhatsApp({
        to: cleanPhone,
        template: 'booking_confirmation',
        templateData: {
          '1': data.contactName,
          '2': bookingRef,
          '3': `${data.classType} - ${data.city}`,
          '4': formatDate(data.date),
          '5': `${data.currency} ${data.estimatedTotal.toLocaleString()}`
        }
      });
    } catch (error) {
      console.error('WhatsApp confirmation failed:', error);
    }
  }

  /**
   * Generate WhatsApp link with pre-filled message
   */
  generateWhatsAppLink(bookingRef: string, data: CookingClassBookingData): string {
    const message = encodeURIComponent(
      `Hi Recharge Travels! 🍳\n\n` +
        `I just submitted a Cooking Class booking.\n` +
        `📋 Ref: ${bookingRef}\n` +
        `🗓️ Date: ${formatDate(data.date)}\n` +
        `📍 Location: ${data.city}\n` +
        `👨‍🍳 Class: ${data.classType}\n` +
        `👤 Name: ${data.contactName}\n` +
        `👥 Guests: ${data.adults} adults${data.children > 0 ? `, ${data.children} children` : ''}\n` +
        (data.dietaryRequirements ? `🥗 Dietary: ${data.dietaryRequirements}\n` : '') +
        `\nI'd like to confirm my cooking class. Thank you!`
    );
    return `https://wa.me/${COMPANY_WHATSAPP}?text=${message}`;
  }

  /**
   * Generate general inquiry WhatsApp link
   */
  getInquiryWhatsAppLink(className?: string, city?: string): string {
    const message = encodeURIComponent(
      `Hi Recharge Travels! 🍳\n\n` +
        `I'm interested in your Sri Lankan Cooking Classes` +
        (className && city ? ` - specifically the ${className} in ${city}.` : '.') +
        `\n\nCould you please provide more information?`
    );
    return `https://wa.me/${COMPANY_WHATSAPP}?text=${message}`;
  }
}

export const cookingClassBookingService = new CookingClassBookingService();
export default cookingClassBookingService;







