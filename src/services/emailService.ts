import { getFunctions, httpsCallable } from 'firebase/functions';
import { app } from '@/lib/firebase';

const functions = getFunctions(app);

// Email template types
export type EmailTemplateType =
  | 'bookingConfirmation'
  | 'inquiryReply'
  | 'welcomeEmail'
  | 'adminNotification'
  | 'bookingReminder';

// Template data interfaces
export interface BookingConfirmationData {
  customerName: string;
  confirmationNumber: string;
  bookingType: string;
  travelDate: string;
  adults: number;
  children?: number;
  totalAmount: number;
  currency: string;
  specialRequests?: string;
}

export interface InquiryReplyData {
  customerName: string;
  subject?: string;
  message: string;
}

export interface WelcomeEmailData {
  customerName: string;
}

export interface AdminNotificationData {
  type: string;
  customerName: string;
  customerEmail: string;
  phone?: string;
  details: string;
  adminUrl: string;
}

export interface BookingReminderData {
  customerName: string;
  destination: string;
  daysUntil: number;
}

export type EmailTemplateData =
  | BookingConfirmationData
  | InquiryReplyData
  | WelcomeEmailData
  | AdminNotificationData
  | BookingReminderData;

export interface SendEmailParams {
  to: string;
  subject?: string;
  html?: string;
  text?: string;
  templateType?: EmailTemplateType;
  templateData?: EmailTemplateData;
}

export interface EmailResponse {
  success: boolean;
  message: string;
}

// Email service
export const emailService = {
  /**
   * Send an email using Firebase Cloud Functions with SendGrid
   */
  async sendEmail(params: SendEmailParams): Promise<EmailResponse> {
    try {
      const sendEmailFunction = httpsCallable<SendEmailParams, EmailResponse>(functions, 'sendEmail');
      const result = await sendEmailFunction(params);
      return result.data;
    } catch (error: any) {
      console.error('Error sending email:', error);
      throw new Error(error.message || 'Failed to send email');
    }
  },

  /**
   * Send a booking confirmation email
   */
  async sendBookingConfirmation(
    to: string,
    data: BookingConfirmationData
  ): Promise<EmailResponse> {
    return this.sendEmail({
      to,
      templateType: 'bookingConfirmation',
      templateData: data
    });
  },

  /**
   * Send an inquiry reply email
   */
  async sendInquiryReply(
    to: string,
    data: InquiryReplyData
  ): Promise<EmailResponse> {
    return this.sendEmail({
      to,
      templateType: 'inquiryReply',
      templateData: data
    });
  },

  /**
   * Send a welcome email
   */
  async sendWelcomeEmail(
    to: string,
    data: WelcomeEmailData
  ): Promise<EmailResponse> {
    return this.sendEmail({
      to,
      templateType: 'welcomeEmail',
      templateData: data
    });
  },

  /**
   * Send an admin notification email
   */
  async sendAdminNotification(
    to: string,
    data: AdminNotificationData
  ): Promise<EmailResponse> {
    return this.sendEmail({
      to,
      templateType: 'adminNotification',
      templateData: data
    });
  },

  /**
   * Send a booking reminder email
   */
  async sendBookingReminder(
    to: string,
    data: BookingReminderData
  ): Promise<EmailResponse> {
    return this.sendEmail({
      to,
      templateType: 'bookingReminder',
      templateData: data
    });
  },

  /**
   * Send a custom email with HTML content
   */
  async sendCustomEmail(
    to: string,
    subject: string,
    html: string,
    text?: string
  ): Promise<EmailResponse> {
    return this.sendEmail({
      to,
      subject,
      html,
      text: text || html.replace(/<[^>]*>/g, '') // Strip HTML tags for text version
    });
  }
};

export default emailService;
