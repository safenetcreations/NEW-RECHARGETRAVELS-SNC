import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import * as nodemailer from 'nodemailer';

const db = admin.firestore();

// Email configuration
const mailTransport = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: functions.config().email?.user || process.env.EMAIL_USER,
    pass: functions.config().email?.pass || process.env.EMAIL_PASS,
  },
});

// Send email
export const sendEmail = functions.https.onCall(async (data, context) => {
  const { to, subject, html, text } = data;

  try {
    const mailOptions = {
      from: 'Recharge Travels <noreply@rechargetravels.com>',
      to,
      subject,
      html,
      text,
    };

    await mailTransport.sendMail(mailOptions);

    return { success: true, message: 'Email sent successfully' };
  } catch (error: any) {
    console.error('Error sending email:', error);
    throw new functions.https.HttpsError('internal', error.message);
  }
});

// Send WhatsApp message (requires WhatsApp Business API)
export const sendWhatsAppMessage = functions.https.onCall(async (data, context) => {
  const { to, message } = data;

  try {
    // Here you would integrate with WhatsApp Business API
    // For now, we'll store the message request
    await db.collection('whatsappMessages').add({
      to,
      message,
      status: 'pending',
      createdAt: admin.firestore.FieldValue.serverTimestamp()
    });

    return { success: true, message: 'WhatsApp message queued' };
  } catch (error: any) {
    console.error('Error sending WhatsApp:', error);
    throw new functions.https.HttpsError('internal', error.message);
  }
});

// Send booking confirmation
export const sendBookingConfirmation = functions.firestore
  .document('bookings/{bookingId}')
  .onCreate(async (snap, context) => {
    const booking = snap.data();
    const bookingId = context.params.bookingId;

    try {
      const emailHtml = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h1 style="color: #0066cc;">Booking Confirmation</h1>
          <p>Dear ${booking.name},</p>
          <p>Thank you for booking with Recharge Travels! Your booking has been confirmed.</p>
          
          <div style="background-color: #f5f5f5; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h2 style="color: #333;">Booking Details</h2>
            <p><strong>Booking ID:</strong> ${bookingId}</p>
            <p><strong>Type:</strong> ${booking.type}</p>
            <p><strong>Date:</strong> ${booking.travel_date}</p>
            <p><strong>Guests:</strong> ${booking.guests}</p>
            <p><strong>Total Amount:</strong> $${booking.amount} ${booking.currency}</p>
          </div>
          
          <p>We'll send you more details closer to your travel date.</p>
          <p>If you have any questions, please don't hesitate to contact us.</p>
          
          <p>Best regards,<br>Recharge Travels Team</p>
        </div>
      `;

      await sendEmail({
        to: booking.email,
        subject: `Booking Confirmation - ${bookingId}`,
        html: emailHtml,
        text: `Booking confirmation for ${bookingId}`
      }, {} as any);

      // Update booking with confirmation sent status
      await snap.ref.update({
        confirmationSent: true,
        confirmationSentAt: admin.firestore.FieldValue.serverTimestamp()
      });

    } catch (error) {
      console.error('Error sending booking confirmation:', error);
    }
  });

// Send booking notification to admin
export const sendBookingNotification = functions.firestore
  .document('bookings/{bookingId}')
  .onCreate(async (snap, context) => {
    const booking = snap.data();
    const bookingId = context.params.bookingId;

    try {
      const adminEmail = functions.config().admin?.email || 'nanthan77@gmail.com';
      
      const emailHtml = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h1 style="color: #0066cc;">New Booking Received!</h1>
          
          <div style="background-color: #f5f5f5; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h2 style="color: #333;">Customer Details</h2>
            <p><strong>Name:</strong> ${booking.name}</p>
            <p><strong>Email:</strong> ${booking.email}</p>
            <p><strong>Phone:</strong> ${booking.phone}</p>
          </div>
          
          <div style="background-color: #f5f5f5; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h2 style="color: #333;">Booking Information</h2>
            <p><strong>Booking ID:</strong> ${bookingId}</p>
            <p><strong>Type:</strong> ${booking.type}</p>
            <p><strong>Date:</strong> ${booking.travel_date}</p>
            <p><strong>Guests:</strong> ${booking.guests}</p>
            <p><strong>Amount:</strong> $${booking.amount} ${booking.currency}</p>
            <p><strong>Status:</strong> ${booking.status}</p>
          </div>
          
          <p><a href="https://recharge-travels-admin.web.app/bookings/${bookingId}" 
                style="background-color: #0066cc; color: white; padding: 10px 20px; 
                       text-decoration: none; border-radius: 5px; display: inline-block;">
            View in Admin Panel
          </a></p>
        </div>
      `;

      await sendEmail({
        to: adminEmail,
        subject: `New Booking: ${booking.type} - ${booking.name}`,
        html: emailHtml,
        text: `New booking received from ${booking.name}`
      }, {} as any);

    } catch (error) {
      console.error('Error sending admin notification:', error);
    }
  });
