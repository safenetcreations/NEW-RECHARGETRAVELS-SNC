import { db } from '@/lib/firebase';
import { collection, addDoc, doc, updateDoc, getDoc, Timestamp } from 'firebase/firestore';

// Booking Types
export type LuxuryBookingType = 'helicopter' | 'yacht' | 'jet' | 'villa' | 'vehicle';

export interface LuxuryBookingData {
  // Common fields
  name: string;
  email: string;
  phone: string;
  specialRequests?: string;
  
  // Type-specific fields
  [key: string]: any;
}

export interface BookingConfirmation {
  bookingId: string;
  bookingRef: string;
  status: 'pending' | 'confirmed' | 'cancelled';
  estimatedResponse: string;
}

// Collection mapping
const INQUIRY_COLLECTIONS: Record<LuxuryBookingType, string> = {
  helicopter: 'helicopterInquiries',
  yacht: 'yachtInquiries',
  jet: 'jetInquiries',
  villa: 'villaInquiries',
  vehicle: 'vehicleInquiries'
};

// Generate booking reference number
const generateBookingRef = (type: LuxuryBookingType): string => {
  const prefixes: Record<LuxuryBookingType, string> = {
    helicopter: 'HEL',
    yacht: 'YCH',
    jet: 'JET',
    villa: 'VLA',
    vehicle: 'VHC'
  };
  const timestamp = Date.now().toString(36).toUpperCase();
  const random = Math.random().toString(36).substring(2, 5).toUpperCase();
  return `${prefixes[type]}-${timestamp}-${random}`;
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

// Type labels for emails
const TYPE_LABELS: Record<LuxuryBookingType, { emoji: string; title: string; color: string }> = {
  helicopter: { emoji: '🚁', title: 'Helicopter Charter', color: '#10b981' },
  yacht: { emoji: '🛥️', title: 'Private Yacht', color: '#3b82f6' },
  jet: { emoji: '✈️', title: 'Private Jet', color: '#f59e0b' },
  villa: { emoji: '🏛️', title: 'Exclusive Villa', color: '#ec4899' },
  vehicle: { emoji: '🚗', title: 'Luxury Vehicle', color: '#6366f1' }
};

class LuxuryBookingService {
  private readonly SENDGRID_FUNCTION_URL = 'https://us-central1-recharge-travels-73e76.cloudfunctions.net/sendLuxuryInquiryEmail';
  private readonly COMPANY_WHATSAPP = '94777721999';
  private readonly COMPANY_EMAIL = 'luxury@rechargetravels.com';
  private readonly COMPANY_PHONE = '+94 777 721 999';

  /**
   * Submit a luxury booking inquiry
   * - Saves to Firebase
   * - Sends email to admin
   * - Sends confirmation email to customer
   * - Returns WhatsApp link for instant follow-up
   */
  async submitBooking(
    type: LuxuryBookingType,
    data: LuxuryBookingData
  ): Promise<{
    success: boolean;
    bookingRef: string;
    bookingId: string;
    whatsAppLink: string;
    error?: string;
  }> {
    const bookingRef = generateBookingRef(type);
    const collectionName = INQUIRY_COLLECTIONS[type];
    
    try {
      // 1. Save to Firebase
      const bookingData = {
        ...data,
        bookingRef,
        type,
        status: 'new',
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now(),
        source: `luxury-${type}-page`,
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

      const docRef = await addDoc(collection(db, collectionName), bookingData);
      
      // 2. Send admin notification email
      await this.sendAdminNotification(type, bookingRef, docRef.id, data);
      
      // 3. Send customer confirmation email
      await this.sendCustomerConfirmation(type, bookingRef, data);
      
      // 4. Update email sent status
      await updateDoc(doc(db, collectionName, docRef.id), {
        emailSent: true,
        updatedAt: Timestamp.now()
      });

      // 5. Generate WhatsApp link for instant follow-up
      const whatsAppLink = this.generateWhatsAppLink(type, bookingRef, data);

      return {
        success: true,
        bookingRef,
        bookingId: docRef.id,
        whatsAppLink
      };
    } catch (error) {
      console.error('Booking submission error:', error);
      return {
        success: false,
        bookingRef,
        bookingId: '',
        whatsAppLink: '',
        error: 'Failed to submit booking. Please try again.'
      };
    }
  }

  /**
   * Send notification to admin/sales team
   */
  private async sendAdminNotification(
    type: LuxuryBookingType,
    bookingRef: string,
    bookingId: string,
    data: LuxuryBookingData
  ): Promise<void> {
    const typeInfo = TYPE_LABELS[type];
    
    try {
      await fetch(this.SENDGRID_FUNCTION_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          to: this.COMPANY_EMAIL,
          templateType: 'admin_notification',
          subject: `${typeInfo.emoji} NEW INQUIRY: ${typeInfo.title} - ${bookingRef}`,
          data: {
            bookingRef,
            bookingId,
            type: typeInfo.title,
            emoji: typeInfo.emoji,
            color: typeInfo.color,
            customerName: data.name,
            customerEmail: data.email,
            customerPhone: data.phone,
            ...data,
            timestamp: new Date().toISOString(),
            dashboardLink: `https://recharge-travels-73e76.web.app/admin/inquiries/${type}/${bookingId}`
          }
        })
      });
    } catch (error) {
      console.error('Admin notification failed:', error);
    }
  }

  /**
   * Send confirmation email to customer
   */
  private async sendCustomerConfirmation(
    type: LuxuryBookingType,
    bookingRef: string,
    data: LuxuryBookingData
  ): Promise<void> {
    const typeInfo = TYPE_LABELS[type];
    
    try {
      await fetch(this.SENDGRID_FUNCTION_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          to: data.email,
          templateType: 'customer_confirmation',
          subject: `${typeInfo.emoji} Your ${typeInfo.title} Inquiry - ${bookingRef}`,
          data: {
            bookingRef,
            type: typeInfo.title,
            emoji: typeInfo.emoji,
            color: typeInfo.color,
            customerName: data.name,
            companyPhone: this.COMPANY_PHONE,
            companyEmail: this.COMPANY_EMAIL,
            companyWhatsApp: `https://wa.me/${this.COMPANY_WHATSAPP}`,
            estimatedResponse: '2 hours',
            ...data
          }
        })
      });
    } catch (error) {
      console.error('Customer confirmation failed:', error);
    }
  }

  /**
   * Generate WhatsApp link with pre-filled message
   */
  generateWhatsAppLink(
    type: LuxuryBookingType,
    bookingRef: string,
    data: LuxuryBookingData
  ): string {
    const typeInfo = TYPE_LABELS[type];
    const message = encodeURIComponent(
      `Hi Recharge Travels! ${typeInfo.emoji}\n\n` +
      `I just submitted a ${typeInfo.title} inquiry.\n` +
      `📋 Ref: ${bookingRef}\n` +
      `👤 Name: ${data.name}\n` +
      `📧 Email: ${data.email}\n\n` +
      `I'd like to discuss my requirements. Thank you!`
    );
    return `https://wa.me/${this.COMPANY_WHATSAPP}?text=${message}`;
  }

  /**
   * Generate WhatsApp link for specific service inquiry
   */
  getServiceWhatsAppLink(type: LuxuryBookingType, serviceName?: string): string {
    const typeInfo = TYPE_LABELS[type];
    const message = encodeURIComponent(
      `Hi Recharge Travels! ${typeInfo.emoji}\n\n` +
      `I'm interested in your ${typeInfo.title} services` +
      (serviceName ? ` - specifically the ${serviceName}.` : '.') +
      `\n\nCould you please provide more information?`
    );
    return `https://wa.me/${this.COMPANY_WHATSAPP}?text=${message}`;
  }
}

export const luxuryBookingService = new LuxuryBookingService();

// ============================================
// DATA FLOW & CRM EXPLANATION
// ============================================
/*
📊 HOW THE BOOKING DATA FLOWS:

1. CUSTOMER SUBMITS FORM
   └─> Form data collected on luxury page

2. FIREBASE FIRESTORE (Primary Database)
   └─> Data saved to collection: helicopterInquiries, yachtInquiries, etc.
   └─> Each inquiry has:
       - bookingRef (unique reference)
       - Customer details (name, email, phone)
       - Booking details (dates, preferences)
       - CRM fields (status, assignedTo, notes)
       - Tracking (emailSent, responseTime)

3. SENDGRID EMAIL (Notifications)
   └─> Admin gets instant notification
   └─> Customer gets confirmation email with reference number

4. WHATSAPP (Instant Communication)
   └─> Customer can click to chat instantly
   └─> Pre-filled message with booking reference

5. ADMIN PANEL (CRM)
   └─> View all inquiries in dashboard
   └─> Update status (new → contacted → confirmed → completed)
   └─> Assign to team members
   └─> Add notes and follow-ups
   └─> Track response times

📁 DATA STORAGE OPTIONS:

Option A: Firebase Firestore (CURRENT)
- Real-time updates
- Easy admin panel integration
- Automatic backups
- Scalable

Option B: Export to Google Sheets (Can be added)
- Use Firebase Function to sync to Google Sheets
- Good for reporting and sharing
- Easy Excel-like interface

Option C: Export to Google Drive (Can be added)
- Store documents/attachments
- PDF receipts
- Signed contracts

RECOMMENDED: Keep Firebase as primary, add Google Sheets sync for reporting.
*/
