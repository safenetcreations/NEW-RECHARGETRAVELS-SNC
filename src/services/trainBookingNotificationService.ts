import { collection, addDoc, doc, getDoc, Timestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';

export interface TrainBookingData {
  id: string;
  bookingReference: string;
  trainName: string;
  trainNumber: string;
  departureStation: string;
  arrivalStation: string;
  departureTime: string;
  arrivalTime: string;
  travelDate: string;
  selectedClass: string;
  passengers: number;
  totalPrice: number;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  specialRequests?: string;
  status: string;
}

// Format date for display
const formatDate = (dateString: string): string => {
  return new Date(dateString).toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};

// Generate WhatsApp message for customer
export const generateWhatsAppMessage = (booking: TrainBookingData): string => {
  return `🚂 *Train Booking Confirmation*

📋 *Booking Reference:* ${booking.bookingReference}

🚉 *Route:* ${booking.departureStation} → ${booking.arrivalStation}
🚂 *Train:* ${booking.trainName} (${booking.trainNumber})
📅 *Date:* ${formatDate(booking.travelDate)}
⏰ *Departure:* ${booking.departureTime}
⏱️ *Arrival:* ${booking.arrivalTime}

👤 *Passenger:* ${booking.customerName}
🎫 *Class:* ${booking.selectedClass}
👥 *Passengers:* ${booking.passengers}

💰 *Total Paid:* $${booking.totalPrice.toFixed(2)}

✅ Status: ${booking.status.toUpperCase()}

📱 View your ticket: https://www.rechargetravels.com/transport/train-booking/confirmation/${booking.id}

Thank you for booking with Recharge Travels!
🌐 www.rechargetravels.com`;
};

// Generate WhatsApp URL for customer
export const generateWhatsAppUrl = (booking: TrainBookingData): string => {
  const message = generateWhatsAppMessage(booking);
  const phone = booking.customerPhone.replace(/\D/g, '');
  return `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
};

// Generate admin notification message
export const generateAdminNotificationMessage = (booking: TrainBookingData): string => {
  return `🔔 *New Train Booking Alert!*

📋 *Reference:* ${booking.bookingReference}

👤 *Customer Details:*
• Name: ${booking.customerName}
• Email: ${booking.customerEmail}
• Phone: ${booking.customerPhone}

🚂 *Journey Details:*
• Route: ${booking.departureStation} → ${booking.arrivalStation}
• Train: ${booking.trainName} (${booking.trainNumber})
• Date: ${formatDate(booking.travelDate)}
• Time: ${booking.departureTime} - ${booking.arrivalTime}
• Class: ${booking.selectedClass}
• Passengers: ${booking.passengers}

💰 *Total:* $${booking.totalPrice.toFixed(2)}

${booking.specialRequests ? `📝 *Special Requests:* ${booking.specialRequests}` : ''}

⏰ Booked at: ${new Date().toLocaleString()}`;
};

// Send admin WhatsApp notification
export const sendAdminWhatsAppNotification = (booking: TrainBookingData): void => {
  const adminPhone = '+94771234567'; // Admin phone number
  const message = generateAdminNotificationMessage(booking);
  const url = `https://wa.me/${adminPhone.replace(/\D/g, '')}?text=${encodeURIComponent(message)}`;
  window.open(url, '_blank');
};

// Save notification to Firebase for email queue
export const saveEmailNotification = async (booking: TrainBookingData): Promise<string | null> => {
  try {
    const emailData = {
      to: booking.customerEmail,
      subject: `Train Booking Confirmation - ${booking.bookingReference}`,
      bookingId: booking.id,
      bookingReference: booking.bookingReference,
      template: 'train_booking_confirmation',
      data: {
        customerName: booking.customerName,
        trainName: booking.trainName,
        trainNumber: booking.trainNumber,
        departureStation: booking.departureStation,
        arrivalStation: booking.arrivalStation,
        departureTime: booking.departureTime,
        arrivalTime: booking.arrivalTime,
        travelDate: booking.travelDate,
        formattedDate: formatDate(booking.travelDate),
        selectedClass: booking.selectedClass,
        passengers: booking.passengers,
        totalPrice: booking.totalPrice,
        confirmationUrl: `https://www.rechargetravels.com/transport/train-booking/confirmation/${booking.id}`
      },
      status: 'pending',
      createdAt: Timestamp.now()
    };

    const docRef = await addDoc(collection(db, 'emailQueue'), emailData);
    console.log('Email notification queued:', docRef.id);
    return docRef.id;
  } catch (error) {
    console.error('Error saving email notification:', error);
    return null;
  }
};

// Save admin notification to Firebase
export const saveAdminNotification = async (booking: TrainBookingData): Promise<string | null> => {
  try {
    const notificationData = {
      type: 'train_booking',
      title: `New Train Booking: ${booking.bookingReference}`,
      message: `${booking.customerName} booked ${booking.trainName} from ${booking.departureStation} to ${booking.arrivalStation}`,
      bookingId: booking.id,
      bookingReference: booking.bookingReference,
      customerName: booking.customerName,
      customerEmail: booking.customerEmail,
      customerPhone: booking.customerPhone,
      trainDetails: {
        trainName: booking.trainName,
        trainNumber: booking.trainNumber,
        route: `${booking.departureStation} → ${booking.arrivalStation}`,
        travelDate: booking.travelDate,
        departureTime: booking.departureTime
      },
      totalPrice: booking.totalPrice,
      isRead: false,
      createdAt: Timestamp.now()
    };

    const docRef = await addDoc(collection(db, 'adminNotifications'), notificationData);
    console.log('Admin notification saved:', docRef.id);
    return docRef.id;
  } catch (error) {
    console.error('Error saving admin notification:', error);
    return null;
  }
};

// Generate email HTML template
export const generateEmailHtml = (booking: TrainBookingData): string => {
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Train Booking Confirmation</title>
  <style>
    body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; margin: 0; padding: 0; background-color: #f4f4f4; }
    .container { max-width: 600px; margin: 0 auto; background-color: #ffffff; }
    .header { background: linear-gradient(135deg, #2563eb 0%, #059669 100%); color: white; padding: 30px; text-align: center; }
    .header h1 { margin: 0; font-size: 24px; }
    .header p { margin: 10px 0 0; opacity: 0.9; }
    .content { padding: 30px; }
    .booking-ref { background-color: #eff6ff; border: 2px solid #bfdbfe; border-radius: 10px; padding: 20px; text-align: center; margin-bottom: 30px; }
    .booking-ref p { margin: 0; color: #6b7280; font-size: 14px; text-transform: uppercase; letter-spacing: 1px; }
    .booking-ref h2 { margin: 10px 0 0; color: #2563eb; font-size: 28px; font-family: monospace; }
    .train-card { background: #1f2937; color: white; border-radius: 10px; padding: 20px; margin-bottom: 20px; }
    .train-card h3 { margin: 0 0 5px; font-size: 20px; }
    .train-card .number { color: #9ca3af; font-size: 14px; }
    .journey { display: flex; justify-content: space-between; align-items: center; margin: 30px 0; }
    .station { text-align: center; flex: 1; }
    .station .time { font-size: 28px; font-weight: bold; color: #1f2937; }
    .station .name { color: #6b7280; margin-top: 5px; }
    .journey-line { flex: 1; display: flex; align-items: center; padding: 0 20px; }
    .journey-line span { height: 2px; background: linear-gradient(90deg, #2563eb, #059669); flex: 1; }
    .details-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin: 20px 0; }
    .detail-item { background: #f9fafb; border-radius: 8px; padding: 15px; }
    .detail-item label { color: #6b7280; font-size: 12px; text-transform: uppercase; display: block; margin-bottom: 5px; }
    .detail-item span { color: #1f2937; font-weight: 600; font-size: 16px; }
    .total { background: #ecfdf5; border: 2px solid #a7f3d0; border-radius: 10px; padding: 20px; text-align: center; margin: 20px 0; }
    .total label { color: #059669; font-size: 14px; }
    .total span { display: block; color: #059669; font-size: 32px; font-weight: bold; margin-top: 5px; }
    .cta-button { display: block; background: linear-gradient(135deg, #2563eb 0%, #059669 100%); color: white; text-decoration: none; padding: 15px 30px; border-radius: 8px; text-align: center; font-weight: 600; margin: 30px 0; }
    .info-box { background: #fffbeb; border: 1px solid #fcd34d; border-radius: 8px; padding: 15px; margin: 20px 0; }
    .info-box h4 { margin: 0 0 10px; color: #92400e; }
    .info-box ul { margin: 0; padding-left: 20px; color: #92400e; }
    .info-box li { margin: 5px 0; }
    .footer { background: #f9fafb; padding: 20px; text-align: center; color: #6b7280; font-size: 14px; }
    .footer a { color: #2563eb; text-decoration: none; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>Booking Confirmed!</h1>
      <p>Your train ticket has been successfully booked</p>
    </div>

    <div class="content">
      <div class="booking-ref">
        <p>Booking Reference</p>
        <h2>${booking.bookingReference}</h2>
      </div>

      <div class="train-card">
        <h3>${booking.trainName}</h3>
        <span class="number">${booking.trainNumber}</span>
      </div>

      <div style="text-align: center; margin: 20px 0;">
        <span style="background: #e0f2fe; color: #0369a1; padding: 8px 20px; border-radius: 20px; font-weight: 600;">
          ${formatDate(booking.travelDate)}
        </span>
      </div>

      <table width="100%" style="margin: 30px 0;">
        <tr>
          <td style="text-align: center; width: 40%;">
            <div style="font-size: 28px; font-weight: bold; color: #1f2937;">${booking.departureTime}</div>
            <div style="color: #6b7280; margin-top: 5px;">${booking.departureStation}</div>
          </td>
          <td style="text-align: center; width: 20%;">
            <div style="color: #10b981;">→</div>
          </td>
          <td style="text-align: center; width: 40%;">
            <div style="font-size: 28px; font-weight: bold; color: #1f2937;">${booking.arrivalTime}</div>
            <div style="color: #6b7280; margin-top: 5px;">${booking.arrivalStation}</div>
          </td>
        </tr>
      </table>

      <table width="100%" style="margin: 20px 0;" cellspacing="10">
        <tr>
          <td style="background: #f9fafb; border-radius: 8px; padding: 15px; width: 50%;">
            <div style="color: #6b7280; font-size: 12px; text-transform: uppercase; margin-bottom: 5px;">Passenger</div>
            <div style="color: #1f2937; font-weight: 600; font-size: 16px;">${booking.customerName}</div>
          </td>
          <td style="background: #f9fafb; border-radius: 8px; padding: 15px; width: 50%;">
            <div style="color: #6b7280; font-size: 12px; text-transform: uppercase; margin-bottom: 5px;">Class</div>
            <div style="color: #1f2937; font-weight: 600; font-size: 16px;">${booking.selectedClass}</div>
          </td>
        </tr>
        <tr>
          <td style="background: #f9fafb; border-radius: 8px; padding: 15px;">
            <div style="color: #6b7280; font-size: 12px; text-transform: uppercase; margin-bottom: 5px;">Passengers</div>
            <div style="color: #1f2937; font-weight: 600; font-size: 16px;">${booking.passengers}</div>
          </td>
          <td style="background: #f9fafb; border-radius: 8px; padding: 15px;">
            <div style="color: #6b7280; font-size: 12px; text-transform: uppercase; margin-bottom: 5px;">Status</div>
            <div style="color: #059669; font-weight: 600; font-size: 16px;">✓ Confirmed</div>
          </td>
        </tr>
      </table>

      <div class="total">
        <label>Total Paid</label>
        <span>$${booking.totalPrice.toFixed(2)}</span>
      </div>

      <a href="https://www.rechargetravels.com/transport/train-booking/confirmation/${booking.id}" class="cta-button">
        View Your Ticket
      </a>

      <div class="info-box">
        <h4>Important Information</h4>
        <ul>
          <li>Please arrive at the station at least 30 minutes before departure</li>
          <li>Carry a valid photo ID along with this booking confirmation</li>
          <li>Show this confirmation (printed or on mobile) to the station staff</li>
          <li>For changes or cancellations, contact us at least 24 hours in advance</li>
        </ul>
      </div>
    </div>

    <div class="footer">
      <p>Thank you for booking with Recharge Travels!</p>
      <p><a href="https://www.rechargetravels.com">www.rechargetravels.com</a> | support@rechargetravels.com</p>
      <p style="font-size: 12px; margin-top: 15px;">
        If you have any questions, please contact us at +94 77 123 4567
      </p>
    </div>
  </div>
</body>
</html>
  `;
};

// Send all notifications for a new booking
export const sendBookingNotifications = async (booking: TrainBookingData): Promise<{
  emailQueued: boolean;
  adminNotified: boolean;
}> => {
  const results = {
    emailQueued: false,
    adminNotified: false
  };

  // Queue email notification
  const emailId = await saveEmailNotification(booking);
  results.emailQueued = !!emailId;

  // Save admin notification
  const adminNotifId = await saveAdminNotification(booking);
  results.adminNotified = !!adminNotifId;

  return results;
};
