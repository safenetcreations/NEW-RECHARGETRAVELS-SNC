/**
 * Vehicle Rental Email Notification Service
 * Handles email notifications for vehicle rental bookings
 * 
 * @module services/vehicleRentalEmailService
 */

// Email template types for vehicle rental
export type VehicleEmailType = 
  | 'booking_confirmation'
  | 'booking_approved'
  | 'booking_rejected'
  | 'booking_cancelled'
  | 'payment_received'
  | 'payment_pending'
  | 'payout_processed'
  | 'payout_pending'
  | 'vehicle_pickup_reminder'
  | 'vehicle_return_reminder'
  | 'deposit_released'
  | 'deposit_deducted'
  | 'review_request'
  | 'owner_new_booking'
  | 'owner_booking_cancelled'
  | 'message_received';

export interface VehicleBookingEmailData {
  bookingId: string;
  bookingReference: string;
  vehicleName: string;
  vehicleType: string;
  vehicleImage?: string;
  ownerName: string;
  ownerEmail?: string;
  ownerPhone?: string;
  customerName: string;
  customerEmail: string;
  customerPhone?: string;
  pickupDate: string;
  returnDate: string;
  pickupLocation: string;
  returnLocation: string;
  totalDays: number;
  dailyRate: number;
  subtotal: number;
  serviceFee: number;
  insuranceFee: number;
  deliveryFee: number;
  securityDeposit: number;
  totalAmount: number;
  paymentStatus: string;
  bookingStatus: string;
}

export interface PayoutEmailData {
  payoutId: string;
  ownerName: string;
  ownerEmail: string;
  amount: number;
  bookingReference: string;
  vehicleName: string;
  payoutDate: string;
  payoutMethod: string;
  bankDetails?: string;
}

export interface DepositEmailData {
  bookingReference: string;
  customerName: string;
  customerEmail: string;
  vehicleName: string;
  depositAmount: number;
  deductedAmount?: number;
  refundedAmount?: number;
  reason?: string;
}

export interface MessageEmailData {
  recipientName: string;
  recipientEmail: string;
  senderName: string;
  messagePreview: string;
  bookingReference?: string;
  vehicleName?: string;
}

// Helper to safely access data properties
const get = (data: any, key: string, fallback: string | number = ''): string => {
  const value = data?.[key];
  if (typeof value === 'number') return value.toFixed(2);
  return value ?? fallback;
};

const getNum = (data: any, key: string, fallback: number = 0): number => {
  return data?.[key] ?? fallback;
};

// Email template configurations
const emailTemplates: Record<VehicleEmailType, {
  subject: string;
  getHtml: (data: any) => string;
}> = {
  booking_confirmation: {
    subject: 'Booking Confirmation - {bookingReference}',
    getHtml: (data) => `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Booking Confirmation</title>
        <style>
          body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; background-color: #f4f4f4; }
          .container { max-width: 600px; margin: 0 auto; background: #fff; }
          .header { background: linear-gradient(135deg, #10B981 0%, #059669 100%); color: white; padding: 30px; text-align: center; }
          .header h1 { margin: 0; font-size: 24px; }
          .content { padding: 30px; }
          .booking-card { background: #f8fafc; border-radius: 12px; padding: 20px; margin: 20px 0; border-left: 4px solid #10B981; }
          .vehicle-info { display: flex; gap: 15px; margin-bottom: 20px; }
          .vehicle-image { width: 120px; height: 80px; border-radius: 8px; object-fit: cover; }
          .detail-row { display: flex; justify-content: space-between; padding: 10px 0; border-bottom: 1px solid #e5e7eb; }
          .detail-row:last-child { border-bottom: none; }
          .label { color: #6b7280; }
          .value { font-weight: 600; color: #111827; }
          .price-summary { background: #f0fdf4; border-radius: 8px; padding: 15px; margin-top: 20px; }
          .total-row { display: flex; justify-content: space-between; font-size: 18px; font-weight: 700; color: #059669; margin-top: 10px; padding-top: 10px; border-top: 2px solid #10B981; }
          .cta-button { display: inline-block; background: #10B981; color: white; padding: 14px 28px; border-radius: 8px; text-decoration: none; font-weight: 600; margin-top: 20px; }
          .footer { background: #1f2937; color: #9ca3af; padding: 30px; text-align: center; font-size: 14px; }
          .footer a { color: #10B981; }
          .status-badge { display: inline-block; background: #fef3c7; color: #92400e; padding: 4px 12px; border-radius: 20px; font-size: 12px; font-weight: 600; }
          .status-badge.confirmed { background: #d1fae5; color: #065f46; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🚗 Booking Confirmed!</h1>
            <p style="margin: 10px 0 0 0; opacity: 0.9;">Your vehicle rental has been successfully booked</p>
          </div>
          <div class="content">
            <p>Dear <strong>${(data as VehicleBookingEmailData).customerName}</strong>,</p>
            <p>Thank you for booking with Recharge Travels! Your vehicle rental has been confirmed.</p>
            
            <div class="booking-card">
              <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 15px;">
                <h3 style="margin: 0; color: #059669;">Booking Reference</h3>
                <span class="status-badge confirmed">Confirmed</span>
              </div>
              <p style="font-size: 24px; font-weight: 700; color: #111827; margin: 0;">${(data as VehicleBookingEmailData).bookingReference}</p>
            </div>

            <h3>Vehicle Details</h3>
            <div class="detail-row">
              <span class="label">Vehicle</span>
              <span class="value">${(data as VehicleBookingEmailData).vehicleName}</span>
            </div>
            <div class="detail-row">
              <span class="label">Type</span>
              <span class="value">${(data as VehicleBookingEmailData).vehicleType}</span>
            </div>
            <div class="detail-row">
              <span class="label">Owner</span>
              <span class="value">${(data as VehicleBookingEmailData).ownerName}</span>
            </div>

            <h3>Rental Period</h3>
            <div class="detail-row">
              <span class="label">Pick-up</span>
              <span class="value">${(data as VehicleBookingEmailData).pickupDate}</span>
            </div>
            <div class="detail-row">
              <span class="label">Pick-up Location</span>
              <span class="value">${(data as VehicleBookingEmailData).pickupLocation}</span>
            </div>
            <div class="detail-row">
              <span class="label">Return</span>
              <span class="value">${(data as VehicleBookingEmailData).returnDate}</span>
            </div>
            <div class="detail-row">
              <span class="label">Return Location</span>
              <span class="value">${(data as VehicleBookingEmailData).returnLocation}</span>
            </div>
            <div class="detail-row">
              <span class="label">Duration</span>
              <span class="value">${(data as VehicleBookingEmailData).totalDays} days</span>
            </div>

            <div class="price-summary">
              <h3 style="margin-top: 0;">Payment Summary</h3>
              <div class="detail-row">
                <span class="label">Daily Rate × ${(data as VehicleBookingEmailData).totalDays} days</span>
                <span class="value">$${(data as VehicleBookingEmailData).subtotal.toFixed(2)}</span>
              </div>
              <div class="detail-row">
                <span class="label">Service Fee</span>
                <span class="value">$${(data as VehicleBookingEmailData).serviceFee.toFixed(2)}</span>
              </div>
              <div class="detail-row">
                <span class="label">Insurance</span>
                <span class="value">$${(data as VehicleBookingEmailData).insuranceFee.toFixed(2)}</span>
              </div>
              ${(data as VehicleBookingEmailData).deliveryFee > 0 ? `
              <div class="detail-row">
                <span class="label">Delivery Fee</span>
                <span class="value">$${(data as VehicleBookingEmailData).deliveryFee.toFixed(2)}</span>
              </div>
              ` : ''}
              <div class="detail-row">
                <span class="label">Security Deposit (Refundable)</span>
                <span class="value">$${(data as VehicleBookingEmailData).securityDeposit.toFixed(2)}</span>
              </div>
              <div class="total-row">
                <span>Total Amount</span>
                <span>$${(data as VehicleBookingEmailData).totalAmount.toFixed(2)}</span>
              </div>
            </div>

            <center>
              <a href="https://rechargetravels.com/vehicle-rental/my-bookings" class="cta-button">View My Booking</a>
            </center>

            <p style="margin-top: 30px; font-size: 14px; color: #6b7280;">
              <strong>Important:</strong> Please arrive at the pick-up location on time with your valid driver's license and ID.
            </p>
          </div>
          <div class="footer">
            <p>Questions? Contact us at <a href="mailto:bookings@rechargetravels.com">bookings@rechargetravels.com</a></p>
            <p>© 2025 Recharge Travels. All rights reserved.</p>
          </div>
        </div>
      </body>
      </html>
    `,
  },

  booking_approved: {
    subject: 'Booking Approved - {bookingReference}',
    getHtml: (data) => `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; background: #f4f4f4; }
          .container { max-width: 600px; margin: 0 auto; background: #fff; }
          .header { background: linear-gradient(135deg, #10B981 0%, #059669 100%); color: white; padding: 30px; text-align: center; }
          .content { padding: 30px; }
          .success-icon { font-size: 60px; text-align: center; margin: 20px 0; }
          .cta-button { display: inline-block; background: #10B981; color: white; padding: 14px 28px; border-radius: 8px; text-decoration: none; font-weight: 600; }
          .footer { background: #1f2937; color: #9ca3af; padding: 20px; text-align: center; font-size: 14px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>✅ Booking Approved!</h1>
          </div>
          <div class="content">
            <div class="success-icon">🎉</div>
            <p>Dear <strong>${(data as VehicleBookingEmailData).customerName}</strong>,</p>
            <p>Great news! Your vehicle rental booking has been approved by the owner.</p>
            
            <h3>Booking Details</h3>
            <p><strong>Reference:</strong> ${(data as VehicleBookingEmailData).bookingReference}</p>
            <p><strong>Vehicle:</strong> ${(data as VehicleBookingEmailData).vehicleName}</p>
            <p><strong>Pick-up:</strong> ${(data as VehicleBookingEmailData).pickupDate} at ${(data as VehicleBookingEmailData).pickupLocation}</p>
            <p><strong>Return:</strong> ${(data as VehicleBookingEmailData).returnDate} at ${(data as VehicleBookingEmailData).returnLocation}</p>

            <center style="margin: 30px 0;">
              <a href="https://rechargetravels.com/vehicle-rental/my-bookings" class="cta-button">View Booking Details</a>
            </center>
          </div>
          <div class="footer">
            <p>© 2025 Recharge Travels</p>
          </div>
        </div>
      </body>
      </html>
    `,
  },

  booking_rejected: {
    subject: 'Booking Request Declined - {bookingReference}',
    getHtml: (data) => `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; background: #f4f4f4; }
          .container { max-width: 600px; margin: 0 auto; background: #fff; }
          .header { background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%); color: white; padding: 30px; text-align: center; }
          .content { padding: 30px; }
          .cta-button { display: inline-block; background: #10B981; color: white; padding: 14px 28px; border-radius: 8px; text-decoration: none; font-weight: 600; }
          .footer { background: #1f2937; color: #9ca3af; padding: 20px; text-align: center; font-size: 14px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Booking Request Declined</h1>
          </div>
          <div class="content">
            <p>Dear <strong>${(data as VehicleBookingEmailData).customerName}</strong>,</p>
            <p>Unfortunately, your booking request for <strong>${(data as VehicleBookingEmailData).vehicleName}</strong> has been declined by the owner.</p>
            
            <p><strong>Booking Reference:</strong> ${(data as VehicleBookingEmailData).bookingReference}</p>
            <p><strong>Dates:</strong> ${(data as VehicleBookingEmailData).pickupDate} - ${(data as VehicleBookingEmailData).returnDate}</p>
            
            <p>If you made any payment, it will be refunded to your original payment method within 5-7 business days.</p>
            
            <p>We encourage you to explore other available vehicles:</p>
            <center style="margin: 30px 0;">
              <a href="https://rechargetravels.com/vehicle-rental" class="cta-button">Browse Other Vehicles</a>
            </center>
          </div>
          <div class="footer">
            <p>© 2025 Recharge Travels</p>
          </div>
        </div>
      </body>
      </html>
    `,
  },

  booking_cancelled: {
    subject: 'Booking Cancelled - {bookingReference}',
    getHtml: (data) => `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; background: #f4f4f4; }
          .container { max-width: 600px; margin: 0 auto; background: #fff; }
          .header { background: linear-gradient(135deg, #6b7280 0%, #4b5563 100%); color: white; padding: 30px; text-align: center; }
          .content { padding: 30px; }
          .info-box { background: #fef3c7; border-left: 4px solid #f59e0b; padding: 15px; margin: 20px 0; }
          .footer { background: #1f2937; color: #9ca3af; padding: 20px; text-align: center; font-size: 14px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Booking Cancelled</h1>
          </div>
          <div class="content">
            <p>Dear <strong>${(data as VehicleBookingEmailData).customerName}</strong>,</p>
            <p>Your booking has been cancelled as requested.</p>
            
            <p><strong>Booking Reference:</strong> ${(data as VehicleBookingEmailData).bookingReference}</p>
            <p><strong>Vehicle:</strong> ${(data as VehicleBookingEmailData).vehicleName}</p>
            <p><strong>Original Dates:</strong> ${(data as VehicleBookingEmailData).pickupDate} - ${(data as VehicleBookingEmailData).returnDate}</p>
            
            <div class="info-box">
              <strong>Refund Information</strong>
              <p>Any eligible refund will be processed according to our cancellation policy and credited to your original payment method within 5-7 business days.</p>
            </div>
          </div>
          <div class="footer">
            <p>© 2025 Recharge Travels</p>
          </div>
        </div>
      </body>
      </html>
    `,
  },

  payment_received: {
    subject: 'Payment Received - {bookingReference}',
    getHtml: (data) => `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; background: #f4f4f4; }
          .container { max-width: 600px; margin: 0 auto; background: #fff; }
          .header { background: linear-gradient(135deg, #10B981 0%, #059669 100%); color: white; padding: 30px; text-align: center; }
          .content { padding: 30px; }
          .amount { font-size: 36px; font-weight: 700; color: #059669; text-align: center; margin: 20px 0; }
          .footer { background: #1f2937; color: #9ca3af; padding: 20px; text-align: center; font-size: 14px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>💳 Payment Received</h1>
          </div>
          <div class="content">
            <p>Dear <strong>${(data as VehicleBookingEmailData).customerName}</strong>,</p>
            <p>We've successfully received your payment for booking <strong>${(data as VehicleBookingEmailData).bookingReference}</strong>.</p>
            
            <div class="amount">$${(data as VehicleBookingEmailData).totalAmount.toFixed(2)}</div>
            
            <p><strong>Vehicle:</strong> ${(data as VehicleBookingEmailData).vehicleName}</p>
            <p><strong>Dates:</strong> ${(data as VehicleBookingEmailData).pickupDate} - ${(data as VehicleBookingEmailData).returnDate}</p>
            
            <p>Your booking is now confirmed. You'll receive a reminder before your pick-up date.</p>
          </div>
          <div class="footer">
            <p>© 2025 Recharge Travels</p>
          </div>
        </div>
      </body>
      </html>
    `,
  },

  payment_pending: {
    subject: 'Payment Pending - Complete Your Booking',
    getHtml: (data) => `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; background: #f4f4f4; }
          .container { max-width: 600px; margin: 0 auto; background: #fff; }
          .header { background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%); color: white; padding: 30px; text-align: center; }
          .content { padding: 30px; }
          .warning-box { background: #fef3c7; border-left: 4px solid #f59e0b; padding: 15px; margin: 20px 0; }
          .cta-button { display: inline-block; background: #10B981; color: white; padding: 14px 28px; border-radius: 8px; text-decoration: none; font-weight: 600; }
          .footer { background: #1f2937; color: #9ca3af; padding: 20px; text-align: center; font-size: 14px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>⏳ Complete Your Payment</h1>
          </div>
          <div class="content">
            <p>Dear <strong>${(data as VehicleBookingEmailData).customerName}</strong>,</p>
            <p>Your booking for <strong>${(data as VehicleBookingEmailData).vehicleName}</strong> is awaiting payment.</p>
            
            <div class="warning-box">
              <strong>⚠️ Action Required</strong>
              <p>Please complete your payment within 24 hours to secure your booking.</p>
            </div>
            
            <p><strong>Booking Reference:</strong> ${(data as VehicleBookingEmailData).bookingReference}</p>
            <p><strong>Amount Due:</strong> $${(data as VehicleBookingEmailData).totalAmount.toFixed(2)}</p>
            
            <center style="margin: 30px 0;">
              <a href="https://rechargetravels.com/vehicle-rental/payment/${(data as VehicleBookingEmailData).bookingId}" class="cta-button">Complete Payment</a>
            </center>
          </div>
          <div class="footer">
            <p>© 2025 Recharge Travels</p>
          </div>
        </div>
      </body>
      </html>
    `,
  },

  payout_processed: {
    subject: 'Payout Processed - ${amount}',
    getHtml: (data) => `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; background: #f4f4f4; }
          .container { max-width: 600px; margin: 0 auto; background: #fff; }
          .header { background: linear-gradient(135deg, #10B981 0%, #059669 100%); color: white; padding: 30px; text-align: center; }
          .content { padding: 30px; }
          .amount { font-size: 36px; font-weight: 700; color: #059669; text-align: center; margin: 20px 0; }
          .footer { background: #1f2937; color: #9ca3af; padding: 20px; text-align: center; font-size: 14px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>💰 Payout Processed</h1>
          </div>
          <div class="content">
            <p>Dear <strong>${(data as PayoutEmailData).ownerName}</strong>,</p>
            <p>Great news! Your payout has been processed successfully.</p>
            
            <div class="amount">$${(data as PayoutEmailData).amount.toFixed(2)}</div>
            
            <p><strong>Payout ID:</strong> ${(data as PayoutEmailData).payoutId}</p>
            <p><strong>Booking:</strong> ${(data as PayoutEmailData).bookingReference}</p>
            <p><strong>Vehicle:</strong> ${(data as PayoutEmailData).vehicleName}</p>
            <p><strong>Method:</strong> ${(data as PayoutEmailData).payoutMethod}</p>
            <p><strong>Date:</strong> ${(data as PayoutEmailData).payoutDate}</p>
            
            <p>The funds will be credited to your account within 1-3 business days.</p>
          </div>
          <div class="footer">
            <p>© 2025 Recharge Travels</p>
          </div>
        </div>
      </body>
      </html>
    `,
  },

  payout_pending: {
    subject: 'Payout Scheduled - {bookingReference}',
    getHtml: (data) => `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; background: #f4f4f4; }
          .container { max-width: 600px; margin: 0 auto; background: #fff; }
          .header { background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%); color: white; padding: 30px; text-align: center; }
          .content { padding: 30px; }
          .info-box { background: #eff6ff; border-left: 4px solid #3b82f6; padding: 15px; margin: 20px 0; }
          .footer { background: #1f2937; color: #9ca3af; padding: 20px; text-align: center; font-size: 14px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>📅 Payout Scheduled</h1>
          </div>
          <div class="content">
            <p>Dear <strong>${(data as PayoutEmailData).ownerName}</strong>,</p>
            <p>Your payout for booking <strong>${(data as PayoutEmailData).bookingReference}</strong> has been scheduled.</p>
            
            <div class="info-box">
              <p><strong>Amount:</strong> $${(data as PayoutEmailData).amount.toFixed(2)}</p>
              <p><strong>Scheduled Date:</strong> ${(data as PayoutEmailData).payoutDate}</p>
              <p><strong>Vehicle:</strong> ${(data as PayoutEmailData).vehicleName}</p>
            </div>
            
            <p>You'll receive a confirmation once the payout is processed.</p>
          </div>
          <div class="footer">
            <p>© 2025 Recharge Travels</p>
          </div>
        </div>
      </body>
      </html>
    `,
  },

  vehicle_pickup_reminder: {
    subject: 'Reminder: Vehicle Pick-up Tomorrow - {bookingReference}',
    getHtml: (data) => `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; background: #f4f4f4; }
          .container { max-width: 600px; margin: 0 auto; background: #fff; }
          .header { background: linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%); color: white; padding: 30px; text-align: center; }
          .content { padding: 30px; }
          .reminder-box { background: #f5f3ff; border-radius: 12px; padding: 20px; margin: 20px 0; text-align: center; }
          .checklist { background: #f8fafc; border-radius: 8px; padding: 15px; margin: 20px 0; }
          .checklist li { padding: 5px 0; }
          .footer { background: #1f2937; color: #9ca3af; padding: 20px; text-align: center; font-size: 14px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🚗 Pick-up Reminder</h1>
          </div>
          <div class="content">
            <p>Dear <strong>${(data as VehicleBookingEmailData).customerName}</strong>,</p>
            <p>This is a friendly reminder that your vehicle pick-up is scheduled for tomorrow!</p>
            
            <div class="reminder-box">
              <p style="font-size: 18px; margin: 0;">Pick-up Time</p>
              <p style="font-size: 24px; font-weight: 700; color: #7c3aed; margin: 10px 0;">${(data as VehicleBookingEmailData).pickupDate}</p>
              <p style="margin: 0;">${(data as VehicleBookingEmailData).pickupLocation}</p>
            </div>
            
            <p><strong>Vehicle:</strong> ${(data as VehicleBookingEmailData).vehicleName}</p>
            <p><strong>Owner Contact:</strong> ${(data as VehicleBookingEmailData).ownerName} ${(data as VehicleBookingEmailData).ownerPhone ? `(${(data as VehicleBookingEmailData).ownerPhone})` : ''}</p>
            
            <div class="checklist">
              <strong>📋 Please bring:</strong>
              <ul>
                <li>Valid driver's license</li>
                <li>Government-issued ID or passport</li>
                <li>Payment method for security deposit</li>
                <li>Booking confirmation (this email)</li>
              </ul>
            </div>
          </div>
          <div class="footer">
            <p>© 2025 Recharge Travels</p>
          </div>
        </div>
      </body>
      </html>
    `,
  },

  vehicle_return_reminder: {
    subject: 'Reminder: Vehicle Return Tomorrow - {bookingReference}',
    getHtml: (data) => `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; background: #f4f4f4; }
          .container { max-width: 600px; margin: 0 auto; background: #fff; }
          .header { background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%); color: white; padding: 30px; text-align: center; }
          .content { padding: 30px; }
          .reminder-box { background: #fffbeb; border-radius: 12px; padding: 20px; margin: 20px 0; text-align: center; }
          .checklist { background: #f8fafc; border-radius: 8px; padding: 15px; margin: 20px 0; }
          .footer { background: #1f2937; color: #9ca3af; padding: 20px; text-align: center; font-size: 14px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>⏰ Return Reminder</h1>
          </div>
          <div class="content">
            <p>Dear <strong>${(data as VehicleBookingEmailData).customerName}</strong>,</p>
            <p>This is a reminder that your vehicle rental ends tomorrow.</p>
            
            <div class="reminder-box">
              <p style="font-size: 18px; margin: 0;">Return By</p>
              <p style="font-size: 24px; font-weight: 700; color: #d97706; margin: 10px 0;">${(data as VehicleBookingEmailData).returnDate}</p>
              <p style="margin: 0;">${(data as VehicleBookingEmailData).returnLocation}</p>
            </div>
            
            <div class="checklist">
              <strong>📋 Before returning:</strong>
              <ul>
                <li>Fill fuel to the same level as pickup</li>
                <li>Remove all personal belongings</li>
                <li>Take photos of vehicle condition</li>
                <li>Return keys and documents</li>
              </ul>
            </div>
            
            <p>Your security deposit of <strong>$${(data as VehicleBookingEmailData).securityDeposit.toFixed(2)}</strong> will be released within 72 hours after inspection.</p>
          </div>
          <div class="footer">
            <p>© 2025 Recharge Travels</p>
          </div>
        </div>
      </body>
      </html>
    `,
  },

  deposit_released: {
    subject: 'Security Deposit Released - {bookingReference}',
    getHtml: (data) => `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; background: #f4f4f4; }
          .container { max-width: 600px; margin: 0 auto; background: #fff; }
          .header { background: linear-gradient(135deg, #10B981 0%, #059669 100%); color: white; padding: 30px; text-align: center; }
          .content { padding: 30px; }
          .amount { font-size: 36px; font-weight: 700; color: #059669; text-align: center; margin: 20px 0; }
          .footer { background: #1f2937; color: #9ca3af; padding: 20px; text-align: center; font-size: 14px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>✅ Deposit Released</h1>
          </div>
          <div class="content">
            <p>Dear <strong>${(data as DepositEmailData).customerName}</strong>,</p>
            <p>Good news! Your security deposit has been fully released.</p>
            
            <div class="amount">$${(data as DepositEmailData).depositAmount.toFixed(2)}</div>
            
            <p><strong>Booking:</strong> ${(data as DepositEmailData).bookingReference}</p>
            <p><strong>Vehicle:</strong> ${(data as DepositEmailData).vehicleName}</p>
            
            <p>The refund will be credited to your original payment method within 5-7 business days.</p>
            
            <p>Thank you for choosing Recharge Travels!</p>
          </div>
          <div class="footer">
            <p>© 2025 Recharge Travels</p>
          </div>
        </div>
      </body>
      </html>
    `,
  },

  deposit_deducted: {
    subject: 'Security Deposit Deduction - {bookingReference}',
    getHtml: (data) => `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; background: #f4f4f4; }
          .container { max-width: 600px; margin: 0 auto; background: #fff; }
          .header { background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%); color: white; padding: 30px; text-align: center; }
          .content { padding: 30px; }
          .deduction-box { background: #fef3c7; border-radius: 8px; padding: 20px; margin: 20px 0; }
          .footer { background: #1f2937; color: #9ca3af; padding: 20px; text-align: center; font-size: 14px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Deposit Adjustment</h1>
          </div>
          <div class="content">
            <p>Dear <strong>${(data as DepositEmailData).customerName}</strong>,</p>
            <p>A deduction has been made from your security deposit for booking <strong>${(data as DepositEmailData).bookingReference}</strong>.</p>
            
            <div class="deduction-box">
              <p><strong>Original Deposit:</strong> $${(data as DepositEmailData).depositAmount.toFixed(2)}</p>
              <p><strong>Deducted:</strong> $${((data as DepositEmailData).deductedAmount || 0).toFixed(2)}</p>
              <p><strong>Refunded:</strong> $${((data as DepositEmailData).refundedAmount || 0).toFixed(2)}</p>
              <p><strong>Reason:</strong> ${(data as DepositEmailData).reason || 'Damage/cleaning charges'}</p>
            </div>
            
            <p>If you have questions about this deduction, please contact our support team.</p>
          </div>
          <div class="footer">
            <p>© 2025 Recharge Travels</p>
          </div>
        </div>
      </body>
      </html>
    `,
  },

  review_request: {
    subject: 'How was your rental? - Leave a Review',
    getHtml: (data) => `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; background: #f4f4f4; }
          .container { max-width: 600px; margin: 0 auto; background: #fff; }
          .header { background: linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%); color: white; padding: 30px; text-align: center; }
          .content { padding: 30px; }
          .stars { font-size: 40px; text-align: center; margin: 20px 0; }
          .cta-button { display: inline-block; background: #10B981; color: white; padding: 14px 28px; border-radius: 8px; text-decoration: none; font-weight: 600; }
          .footer { background: #1f2937; color: #9ca3af; padding: 20px; text-align: center; font-size: 14px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>⭐ Share Your Experience</h1>
          </div>
          <div class="content">
            <p>Dear <strong>${(data as VehicleBookingEmailData).customerName}</strong>,</p>
            <p>We hope you enjoyed your rental experience with <strong>${(data as VehicleBookingEmailData).vehicleName}</strong>!</p>
            
            <div class="stars">⭐⭐⭐⭐⭐</div>
            
            <p>Your feedback helps other travelers and supports our vehicle owners. Would you take a moment to leave a review?</p>
            
            <center style="margin: 30px 0;">
              <a href="https://rechargetravels.com/vehicle-rental/review/${(data as VehicleBookingEmailData).bookingId}" class="cta-button">Leave a Review</a>
            </center>
            
            <p style="font-size: 14px; color: #6b7280;">As a thank you, you'll receive a 5% discount code for your next rental!</p>
          </div>
          <div class="footer">
            <p>© 2025 Recharge Travels</p>
          </div>
        </div>
      </body>
      </html>
    `,
  },

  owner_new_booking: {
    subject: 'New Booking Request - {vehicleName}',
    getHtml: (data) => `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; background: #f4f4f4; }
          .container { max-width: 600px; margin: 0 auto; background: #fff; }
          .header { background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%); color: white; padding: 30px; text-align: center; }
          .content { padding: 30px; }
          .earning-box { background: #d1fae5; border-radius: 12px; padding: 20px; margin: 20px 0; text-align: center; }
          .cta-button { display: inline-block; background: #10B981; color: white; padding: 14px 28px; border-radius: 8px; text-decoration: none; font-weight: 600; margin: 5px; }
          .cta-button.secondary { background: #ef4444; }
          .footer { background: #1f2937; color: #9ca3af; padding: 20px; text-align: center; font-size: 14px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🎉 New Booking Request!</h1>
          </div>
          <div class="content">
            <p>Dear <strong>${(data as VehicleBookingEmailData).ownerName}</strong>,</p>
            <p>You have a new booking request for your vehicle!</p>
            
            <h3>Booking Details</h3>
            <p><strong>Reference:</strong> ${(data as VehicleBookingEmailData).bookingReference}</p>
            <p><strong>Vehicle:</strong> ${(data as VehicleBookingEmailData).vehicleName}</p>
            <p><strong>Customer:</strong> ${(data as VehicleBookingEmailData).customerName}</p>
            <p><strong>Dates:</strong> ${(data as VehicleBookingEmailData).pickupDate} - ${(data as VehicleBookingEmailData).returnDate}</p>
            <p><strong>Duration:</strong> ${(data as VehicleBookingEmailData).totalDays} days</p>
            
            <div class="earning-box">
              <p style="margin: 0; font-size: 14px;">Your Estimated Earnings</p>
              <p style="font-size: 32px; font-weight: 700; color: #059669; margin: 10px 0;">
                $${((data as VehicleBookingEmailData).subtotal * 0.85).toFixed(2)}
              </p>
              <p style="margin: 0; font-size: 12px; color: #6b7280;">(85% of rental fee after platform commission)</p>
            </div>
            
            <center style="margin: 30px 0;">
              <a href="https://rechargetravels.com/vehicle-rental/owner/bookings" class="cta-button">View & Respond</a>
            </center>
            
            <p style="font-size: 14px; color: #6b7280;">⏰ Please respond within 24 hours to avoid automatic cancellation.</p>
          </div>
          <div class="footer">
            <p>© 2025 Recharge Travels</p>
          </div>
        </div>
      </body>
      </html>
    `,
  },

  owner_booking_cancelled: {
    subject: 'Booking Cancelled - {bookingReference}',
    getHtml: (data) => `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; background: #f4f4f4; }
          .container { max-width: 600px; margin: 0 auto; background: #fff; }
          .header { background: linear-gradient(135deg, #6b7280 0%, #4b5563 100%); color: white; padding: 30px; text-align: center; }
          .content { padding: 30px; }
          .footer { background: #1f2937; color: #9ca3af; padding: 20px; text-align: center; font-size: 14px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Booking Cancelled</h1>
          </div>
          <div class="content">
            <p>Dear <strong>${(data as VehicleBookingEmailData).ownerName}</strong>,</p>
            <p>A booking for your vehicle has been cancelled.</p>
            
            <p><strong>Reference:</strong> ${(data as VehicleBookingEmailData).bookingReference}</p>
            <p><strong>Vehicle:</strong> ${(data as VehicleBookingEmailData).vehicleName}</p>
            <p><strong>Original Dates:</strong> ${(data as VehicleBookingEmailData).pickupDate} - ${(data as VehicleBookingEmailData).returnDate}</p>
            
            <p>Your vehicle is now available for these dates again. The calendar has been automatically updated.</p>
          </div>
          <div class="footer">
            <p>© 2025 Recharge Travels</p>
          </div>
        </div>
      </body>
      </html>
    `,
  },

  message_received: {
    subject: 'New Message from {senderName}',
    getHtml: (data) => `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; background: #f4f4f4; }
          .container { max-width: 600px; margin: 0 auto; background: #fff; }
          .header { background: linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%); color: white; padding: 30px; text-align: center; }
          .content { padding: 30px; }
          .message-box { background: #f8fafc; border-radius: 12px; padding: 20px; margin: 20px 0; border-left: 4px solid #8b5cf6; }
          .cta-button { display: inline-block; background: #10B981; color: white; padding: 14px 28px; border-radius: 8px; text-decoration: none; font-weight: 600; }
          .footer { background: #1f2937; color: #9ca3af; padding: 20px; text-align: center; font-size: 14px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>💬 New Message</h1>
          </div>
          <div class="content">
            <p>Hi <strong>${(data as MessageEmailData).recipientName}</strong>,</p>
            <p>You have a new message from <strong>${(data as MessageEmailData).senderName}</strong>:</p>
            
            <div class="message-box">
              <p style="margin: 0; color: #374151;">"${(data as MessageEmailData).messagePreview}"</p>
            </div>
            
            ${(data as MessageEmailData).bookingReference ? `<p><strong>Regarding:</strong> Booking ${(data as MessageEmailData).bookingReference} - ${(data as MessageEmailData).vehicleName}</p>` : ''}
            
            <center style="margin: 30px 0;">
              <a href="https://rechargetravels.com/vehicle-rental/messages" class="cta-button">Reply Now</a>
            </center>
          </div>
          <div class="footer">
            <p>© 2025 Recharge Travels</p>
          </div>
        </div>
      </body>
      </html>
    `,
  },
};

/**
 * Send vehicle rental email notification
 */
export async function sendVehicleRentalEmail(
  type: VehicleEmailType,
  recipientEmail: string,
  data: VehicleBookingEmailData | PayoutEmailData | DepositEmailData | MessageEmailData
): Promise<{ success: boolean; messageId?: string; error?: string }> {
  try {
    const template = emailTemplates[type];
    if (!template) {
      throw new Error(`Unknown email template: ${type}`);
    }

    // Replace placeholders in subject
    let subject = template.subject;
    Object.entries(data).forEach(([key, value]) => {
      subject = subject.replace(`{${key}}`, String(value));
    });

    const htmlContent = template.getHtml(data);

    // In production, integrate with your email service (SendGrid, AWS SES, etc.)
    // For now, log the email details
    console.log('Sending email:', {
      to: recipientEmail,
      subject,
      type,
      timestamp: new Date().toISOString(),
      htmlLength: htmlContent.length,
    });

    // Simulate email sending
    // In production, replace with actual email service call:
    // const response = await emailProvider.send({ to: recipientEmail, subject, html: htmlContent });

    return {
      success: true,
      messageId: `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    };
  } catch (error) {
    console.error('Email send error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to send email',
    };
  }
}

/**
 * Send booking confirmation emails to both customer and owner
 */
export async function sendBookingConfirmationEmails(
  bookingData: VehicleBookingEmailData
): Promise<void> {
  // Send to customer
  await sendVehicleRentalEmail('booking_confirmation', bookingData.customerEmail, bookingData);
  
  // Send to owner
  if (bookingData.ownerEmail) {
    await sendVehicleRentalEmail('owner_new_booking', bookingData.ownerEmail, bookingData);
  }
}

/**
 * Schedule pickup/return reminder emails
 */
export async function scheduleReminderEmails(
  bookingData: VehicleBookingEmailData
): Promise<void> {
  // In production, use a job scheduler (Bull, Agenda, etc.)
  // This is a placeholder showing the intended functionality
  console.log('Scheduling reminder emails for booking:', bookingData.bookingReference);
  
  // Would schedule:
  // - Pickup reminder: 1 day before pickup
  // - Return reminder: 1 day before return
  // - Review request: 1 day after return
}

/**
 * Get email template preview for admin
 */
export function getEmailTemplatePreview(
  type: VehicleEmailType,
  sampleData: Record<string, unknown>
): string {
  const template = emailTemplates[type];
  if (!template) {
    return '<p>Template not found</p>';
  }
  return template.getHtml(sampleData);
}

/**
 * Get all available email template types
 */
export function getAvailableEmailTemplates(): VehicleEmailType[] {
  return Object.keys(emailTemplates) as VehicleEmailType[];
}
