import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import sgMail from '@sendgrid/mail';
import Redis from 'ioredis';

const db = admin.firestore();

// SendGrid API Key - Set via: firebase functions:config:set sendgrid.api_key="YOUR_API_KEY"
const SENDGRID_API_KEY = functions.config().sendgrid?.api_key || functions.config().sendgrid?.apikey || process.env.SENDGRID_API_KEY || '';
if (SENDGRID_API_KEY && SENDGRID_API_KEY.startsWith('SG.')) {
  sgMail.setApiKey(SENDGRID_API_KEY);
  console.log('SendGrid API key configured successfully');
} else {
  console.warn('SendGrid API key not set or invalid; email sending will be disabled until a valid key is configured.');
}

// Company email configuration
const FROM_EMAIL = 'info@rechargetravels.com';
const FROM_NAME = 'Recharge Travels';
const ADMIN_EMAIL = 'nanthan@rechargetravels.com';
const REPLY_TO_EMAIL = 'info@rechargetravels.com';

// Redis setup (optional). Configure via: firebase functions:config:set redis.url="redis://:password@host:port"
const REDIS_URL = functions.config().redis?.url || process.env.REDIS_URL || '';
let redis: Redis | null = null;
if (REDIS_URL && !REDIS_URL.includes('HOST:PORT')) {
  try {
    redis = new Redis(REDIS_URL);
    redis.on('error', (err: any) => {
      console.warn('Redis client error (ignored for rate-limiting):', err?.message || err);
    });
    console.log('Redis client initialized for newsletter rate-limiting');
  } catch (err: any) {
    console.warn('Failed to initialize Redis client for rate-limiting:', err?.message || err);
    redis = null;
  }
} else if (REDIS_URL) {
  console.warn('REDIS_URL appears to be a placeholder; skipping Redis initialization.');
}

// Email templates
const emailTemplates = {
  bookingConfirmation: (data: any) => ({
    subject: `Booking Confirmation - ${data.confirmationNumber}`,
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
      </head>
      <body style="margin: 0; padding: 0; background-color: #f5f5f5; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;">
        <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff;">
          <!-- Header -->
          <div style="background: linear-gradient(135deg, #f97316 0%, #ea580c 100%); padding: 30px; text-align: center;">
            <img src="https://www.rechargetravels.com/logo-v2.png" alt="Recharge Travels" style="height: 50px; margin-bottom: 10px;">
            <h1 style="color: #ffffff; margin: 0; font-size: 28px;">Booking Confirmed!</h1>
            <p style="color: #fed7aa; margin: 10px 0 0;">Your Sri Lanka Adventure Awaits!</p>
          </div>

          <!-- Content -->
          <div style="padding: 40px 30px;">
            <h2 style="color: #333; margin-top: 0;">Booking Confirmed! 🎉</h2>
            <p style="color: #666; font-size: 16px; line-height: 1.6;">
              Dear ${data.customerName},
            </p>
            <p style="color: #666; font-size: 16px; line-height: 1.6;">
              Thank you for booking with Recharge Travels! Your adventure in Sri Lanka is confirmed and we can't wait to welcome you.
            </p>

            <!-- Booking Details Card -->
            <div style="background: linear-gradient(135deg, #fff7ed 0%, #ffedd5 100%); border-radius: 12px; padding: 25px; margin: 25px 0; border-left: 4px solid #f97316;">
              <h3 style="color: #333; margin-top: 0; font-size: 18px;">📋 Booking Details</h3>
              <table style="width: 100%; border-collapse: collapse;">
                <tr>
                  <td style="padding: 8px 0; color: #666;">Confirmation Number:</td>
                  <td style="padding: 8px 0; color: #333; font-weight: bold; text-align: right;">${data.confirmationNumber}</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; color: #666;">Booking Type:</td>
                  <td style="padding: 8px 0; color: #333; text-align: right;">${data.bookingType}</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; color: #666;">Travel Date:</td>
                  <td style="padding: 8px 0; color: #333; text-align: right;">${data.travelDate}</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; color: #666;">Guests:</td>
                  <td style="padding: 8px 0; color: #333; text-align: right;">${data.adults} Adults${data.children ? `, ${data.children} Children` : ''}</td>
                </tr>
                <tr style="border-top: 1px solid #dee2e6;">
                  <td style="padding: 12px 0 0; color: #333; font-weight: bold;">Total Amount:</td>
                  <td style="padding: 12px 0 0; color: #f97316; font-weight: bold; font-size: 20px; text-align: right;">${data.currency} ${data.totalAmount}</td>
                </tr>
              </table>
            </div>

            ${data.specialRequests ? `
            <div style="background-color: #fff3cd; border-radius: 8px; padding: 15px; margin: 20px 0;">
              <p style="color: #856404; margin: 0;"><strong>Special Requests:</strong> ${data.specialRequests}</p>
            </div>
            ` : ''}

            <p style="color: #666; font-size: 16px; line-height: 1.6;">
              Our team will contact you within 24 hours to finalize the details of your trip. Keep an eye on your inbox!
            </p>

            <!-- CTA Button -->
            <div style="text-align: center; margin: 30px 0;">
              <a href="https://www.rechargetravels.com/booking-confirmation?id=${data.confirmationNumber}"
                 style="display: inline-block; background: linear-gradient(135deg, #f97316 0%, #ea580c 100%); color: #ffffff;
                        text-decoration: none; padding: 15px 35px; border-radius: 30px; font-weight: bold; font-size: 16px;">
                View Booking Details
              </a>
            </div>
          </div>

          <!-- Contact Info -->
          <div style="background-color: #fff7ed; padding: 25px 30px; text-align: center;">
            <p style="color: #666; margin: 0 0 10px; font-size: 14px;">Need help? Contact us:</p>
            <p style="color: #333; margin: 0;">
              📧 <a href="mailto:info@rechargetravels.com" style="color: #f97316; text-decoration: none;">info@rechargetravels.com</a>
            </p>
            <p style="color: #333; margin: 10px 0 0;">
              <a href="https://wa.me/94777721999" style="color: #25D366; text-decoration: none;">📱 WhatsApp: +94 77 772 1999</a>
            </p>
          </div>

          <!-- Footer -->
          <div style="background-color: #333; padding: 20px 30px; text-align: center;">
            <p style="color: #999; margin: 0; font-size: 12px;">
              © ${new Date().getFullYear()} Recharge Travels. All rights reserved.<br>
              Sri Lanka | <a href="https://www.rechargetravels.com" style="color: #f97316; text-decoration: none;">www.rechargetravels.com</a>
            </p>
          </div>
        </div>
      </body>
      </html>
    `,
    text: `
      Booking Confirmation - ${data.confirmationNumber}

      Dear ${data.customerName},

      Thank you for booking with Recharge Travels! Your booking has been confirmed.

      Booking Details:
      - Confirmation Number: ${data.confirmationNumber}
      - Type: ${data.bookingType}
      - Date: ${data.travelDate}
      - Guests: ${data.adults} Adults${data.children ? `, ${data.children} Children` : ''}
      - Total: ${data.currency} ${data.totalAmount}

      Our team will contact you within 24 hours to finalize the details.

      Best regards,
      Recharge Travels Team
    `
  }),

  // Airport Transfer Booking Confirmation
  airportTransferConfirmation: (data: any) => ({
    subject: `✈️ Airport Transfer Confirmed - ${data.confirmationNumber}`,
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
      </head>
      <body style="margin: 0; padding: 0; background-color: #f5f5f5; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;">
        <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff;">
          <!-- Header -->
          <div style="background: linear-gradient(135deg, #0d5c46 0%, #0a4a38 100%); padding: 30px; text-align: center;">
            <h1 style="color: #ffffff; margin: 0; font-size: 28px;">✈️ Transfer Confirmed!</h1>
            <p style="color: #a7f3d0; margin: 10px 0 0;">Your Airport Transfer is Booked</p>
          </div>

          <!-- Content -->
          <div style="padding: 40px 30px;">
            <h2 style="color: #333; margin-top: 0;">Hello ${data.customerName}! 👋</h2>
            <p style="color: #666; font-size: 16px; line-height: 1.6;">
              Thank you for booking your airport transfer with Recharge Travels. Your booking has been confirmed and we're excited to assist you!
            </p>

            <!-- Booking Details Card -->
            <div style="background: linear-gradient(135deg, #ecfdf5 0%, #d1fae5 100%); border-radius: 12px; padding: 25px; margin: 25px 0; border-left: 4px solid #0d5c46;">
              <h3 style="color: #0d5c46; margin-top: 0; font-size: 18px;">📋 Transfer Details</h3>
              <table style="width: 100%; border-collapse: collapse;">
                <tr>
                  <td style="padding: 10px 0; color: #666;">Confirmation #:</td>
                  <td style="padding: 10px 0; color: #0d5c46; font-weight: bold; text-align: right;">${data.confirmationNumber}</td>
                </tr>
                <tr>
                  <td style="padding: 10px 0; color: #666;">Pickup Date:</td>
                  <td style="padding: 10px 0; color: #333; text-align: right;">${data.pickupDate}</td>
                </tr>
                <tr>
                  <td style="padding: 10px 0; color: #666;">Pickup Time:</td>
                  <td style="padding: 10px 0; color: #333; text-align: right;">${data.pickupTime}</td>
                </tr>
                <tr>
                  <td style="padding: 10px 0; color: #666;">From:</td>
                  <td style="padding: 10px 0; color: #333; text-align: right;">${data.pickupLocation}</td>
                </tr>
                <tr>
                  <td style="padding: 10px 0; color: #666;">To:</td>
                  <td style="padding: 10px 0; color: #333; text-align: right;">${data.dropoffLocation}</td>
                </tr>
                <tr>
                  <td style="padding: 10px 0; color: #666;">Distance:</td>
                  <td style="padding: 10px 0; color: #333; text-align: right;">${data.distance || 'Calculated'}</td>
                </tr>
                <tr>
                  <td style="padding: 10px 0; color: #666;">Duration:</td>
                  <td style="padding: 10px 0; color: #333; text-align: right;">${data.duration || 'Est. TBD'}</td>
                </tr>
              </table>
            </div>

            <!-- Vehicle & Passengers -->
            <div style="background-color: #f8fafc; border-radius: 12px; padding: 25px; margin: 25px 0;">
              <h3 style="color: #333; margin-top: 0; font-size: 18px;">🚗 Vehicle & Passengers</h3>
              <table style="width: 100%; border-collapse: collapse;">
                <tr>
                  <td style="padding: 8px 0; color: #666;">Vehicle:</td>
                  <td style="padding: 8px 0; color: #333; text-align: right;">${data.vehicleType}</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; color: #666;">Passengers:</td>
                  <td style="padding: 8px 0; color: #333; text-align: right;">${data.passengers} ${data.passengers === 1 ? 'Person' : 'Persons'}</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; color: #666;">Luggage:</td>
                  <td style="padding: 8px 0; color: #333; text-align: right;">${data.luggage} ${data.luggage === 1 ? 'Bag' : 'Bags'}</td>
                </tr>
              </table>
            </div>

            ${data.flightNumber ? `
            <!-- Flight Info -->
            <div style="background-color: #eff6ff; border-radius: 12px; padding: 25px; margin: 25px 0; border-left: 4px solid #3b82f6;">
              <h3 style="color: #1e40af; margin-top: 0; font-size: 18px;">✈️ Flight Information</h3>
              <table style="width: 100%; border-collapse: collapse;">
                <tr>
                  <td style="padding: 8px 0; color: #666;">Flight Number:</td>
                  <td style="padding: 8px 0; color: #1e40af; font-weight: bold; text-align: right;">${data.flightNumber}</td>
                </tr>
                ${data.arrivalTime ? `
                <tr>
                  <td style="padding: 8px 0; color: #666;">Arrival Time:</td>
                  <td style="padding: 8px 0; color: #333; text-align: right;">${data.arrivalTime}</td>
                </tr>
                ` : ''}
              </table>
            </div>
            ` : ''}

            ${data.extras && data.extras.length > 0 ? `
            <!-- Extras -->
            <div style="background-color: #fef3c7; border-radius: 12px; padding: 25px; margin: 25px 0;">
              <h3 style="color: #92400e; margin-top: 0; font-size: 18px;">🎁 Selected Extras</h3>
              <ul style="color: #78350f; padding-left: 20px; margin: 0;">
                ${data.extras.map((extra: string) => `<li style="padding: 5px 0;">${extra}</li>`).join('')}
              </ul>
            </div>
            ` : ''}

            ${data.specialRequests ? `
            <div style="background-color: #fff3cd; border-radius: 8px; padding: 15px; margin: 20px 0;">
              <p style="color: #856404; margin: 0;"><strong>Special Requests:</strong> ${data.specialRequests}</p>
            </div>
            ` : ''}

            <!-- Price Summary -->
            <div style="background: linear-gradient(135deg, #0d5c46 0%, #0a4a38 100%); border-radius: 12px; padding: 25px; margin: 25px 0; color: #ffffff;">
              <h3 style="color: #ffffff; margin-top: 0; font-size: 18px;">💰 Payment Summary</h3>
              <table style="width: 100%; border-collapse: collapse;">
                <tr>
                  <td style="padding: 8px 0; color: #a7f3d0;">Base Fare:</td>
                  <td style="padding: 8px 0; color: #ffffff; text-align: right;">$${data.baseFare || data.totalAmount}</td>
                </tr>
                ${data.extrasTotal ? `
                <tr>
                  <td style="padding: 8px 0; color: #a7f3d0;">Extras:</td>
                  <td style="padding: 8px 0; color: #ffffff; text-align: right;">$${data.extrasTotal}</td>
                </tr>
                ` : ''}
                <tr style="border-top: 2px solid #a7f3d0;">
                  <td style="padding: 12px 0 0; color: #ffffff; font-weight: bold; font-size: 18px;">Total:</td>
                  <td style="padding: 12px 0 0; color: #f0b429; font-weight: bold; font-size: 22px; text-align: right;">$${data.totalAmount}</td>
                </tr>
              </table>
            </div>

            <p style="color: #666; font-size: 16px; line-height: 1.6;">
              Your driver will meet you at the pickup location. For airport arrivals, look for our driver holding a sign with your name at the arrival hall.
            </p>

            <!-- Important Notice -->
            <div style="background-color: #fef2f2; border-radius: 8px; padding: 20px; margin: 25px 0; border-left: 4px solid #ef4444;">
              <h4 style="color: #dc2626; margin-top: 0;">⚠️ Important Information</h4>
              <ul style="color: #7f1d1d; padding-left: 20px; margin: 0; line-height: 1.8;">
                <li>Please be ready 10 minutes before pickup time</li>
                <li>For flight arrivals, your driver will track your flight status</li>
                <li>Free waiting time: 60 mins for airport, 15 mins for other locations</li>
                <li>Contact us immediately if there are any changes</li>
              </ul>
            </div>
          </div>

          <!-- Contact Info -->
          <div style="background-color: #ecfdf5; padding: 25px 30px; text-align: center;">
            <p style="color: #666; margin: 0 0 10px; font-size: 14px;">Questions about your transfer?</p>
            <p style="color: #333; margin: 0;">
              📧 <a href="mailto:info@rechargetravels.com" style="color: #0d5c46; text-decoration: none;">info@rechargetravels.com</a>
            </p>
            <p style="color: #333; margin: 10px 0 0;">
              <a href="https://wa.me/94777721999" style="color: #25D366; text-decoration: none;">📱 WhatsApp: +94 77 772 1999</a>
            </p>
          </div>

          <!-- Footer -->
          <div style="background-color: #0d5c46; padding: 20px 30px; text-align: center;">
            <p style="color: #a7f3d0; margin: 0; font-size: 12px;">
              © ${new Date().getFullYear()} Recharge Travels. All rights reserved.<br>
              Sri Lanka | <a href="https://www.rechargetravels.com" style="color: #f0b429; text-decoration: none;">www.rechargetravels.com</a>
            </p>
          </div>
        </div>
      </body>
      </html>
    `,
    text: `
      Airport Transfer Confirmation - ${data.confirmationNumber}

      Dear ${data.customerName},

      Your airport transfer has been confirmed!

      Transfer Details:
      - Confirmation #: ${data.confirmationNumber}
      - Pickup Date: ${data.pickupDate}
      - Pickup Time: ${data.pickupTime}
      - From: ${data.pickupLocation}
      - To: ${data.dropoffLocation}
      - Vehicle: ${data.vehicleType}
      - Passengers: ${data.passengers}
      - Total: $${data.totalAmount}
      ${data.flightNumber ? `- Flight: ${data.flightNumber}` : ''}

      Your driver will meet you at the pickup location.

      Contact us:
      - Email: info@rechargetravels.com
      - WhatsApp: +94 77 772 1999

      Best regards,
      Recharge Travels Team
    `
  }),

  inquiryReply: (data: any) => ({
    subject: `Re: ${data.subject || 'Your Inquiry'} - Recharge Travels`,
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
      </head>
      <body style="margin: 0; padding: 0; background-color: #f5f5f5; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;">
        <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff;">
          <!-- Header -->
          <div style="background: linear-gradient(135deg, #f97316 0%, #ea580c 100%); padding: 30px; text-align: center;">
            <img src="https://www.rechargetravels.com/logo-v2.png" alt="Recharge Travels" style="height: 50px; margin-bottom: 10px;">
            <h1 style="color: #ffffff; margin: 0; font-size: 28px;">Thank You for Contacting Us!</h1>
          </div>

          <!-- Content -->
          <div style="padding: 40px 30px;">
            <h2 style="color: #333; margin-top: 0;">We've Received Your Message 📬</h2>
            <p style="color: #666; font-size: 16px; line-height: 1.6;">
              Dear ${data.customerName},
            </p>
            <p style="color: #666; font-size: 16px; line-height: 1.6;">
              Thank you for reaching out to Recharge Travels. We have received your inquiry and our team will get back to you within 24-48 hours.
            </p>

            <!-- Inquiry Summary -->
            <div style="background-color: #fff7ed; border-radius: 12px; padding: 25px; margin: 25px 0; border-left: 4px solid #f97316;">
              <h3 style="color: #333; margin-top: 0; font-size: 18px;">Your Inquiry:</h3>
              <p style="color: #666; margin: 0; white-space: pre-wrap;">${data.message}</p>
            </div>

            <p style="color: #666; font-size: 16px; line-height: 1.6;">
              In the meantime, feel free to explore our website for amazing Sri Lanka travel packages and experiences.
            </p>

            <!-- CTA Button -->
            <div style="text-align: center; margin: 30px 0;">
              <a href="https://www.rechargetravels.com/tours"
                 style="display: inline-block; background: linear-gradient(135deg, #f97316 0%, #ea580c 100%); color: #ffffff;
                        text-decoration: none; padding: 15px 35px; border-radius: 30px; font-weight: bold; font-size: 16px;">
                Explore Our Tours
              </a>
            </div>
          </div>

          <!-- Contact Info -->
          <div style="background-color: #fff7ed; padding: 25px 30px; text-align: center;">
            <p style="color: #666; margin: 0 0 10px; font-size: 14px;">Need immediate help?</p>
            <p style="color: #333; margin: 0;">
              <a href="https://wa.me/94777721999" style="color: #25D366; text-decoration: none;">📱 WhatsApp: +94 77 772 1999</a>
            </p>
          </div>

          <!-- Footer -->
          <div style="background-color: #333; padding: 20px 30px; text-align: center;">
            <p style="color: #999; margin: 0; font-size: 12px;">
              © ${new Date().getFullYear()} Recharge Travels. All rights reserved.<br>
              <a href="https://www.rechargetravels.com" style="color: #f97316; text-decoration: none;">www.rechargetravels.com</a>
            </p>
          </div>
        </div>
      </body>
      </html>
    `,
    text: `
      Thank you for contacting Recharge Travels!

      Dear ${data.customerName},

      We have received your inquiry and will get back to you within 24-48 hours.

      Your Message:
      ${data.message}

      Best regards,
      Recharge Travels Team
    `
  }),

  welcomeEmail: (data: any) => ({
    subject: 'Welcome to Recharge Travels! 🌴',
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
      </head>
      <body style="margin: 0; padding: 0; background-color: #f5f5f5; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;">
        <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff;">
          <!-- Header -->
          <div style="background: linear-gradient(135deg, #f97316 0%, #ea580c 100%); padding: 30px; text-align: center;">
            <img src="https://www.rechargetravels.com/logo-v2.png" alt="Recharge Travels" style="height: 50px; margin-bottom: 10px;">
            <h1 style="color: #ffffff; margin: 0; font-size: 28px;">Welcome to Recharge Travels!</h1>
            <p style="color: #fed7aa; margin: 10px 0 0;">Your Gateway to Sri Lanka</p>
          </div>

          <!-- Content -->
          <div style="padding: 40px 30px;">
            <h2 style="color: #333; margin-top: 0;">Hello ${data.customerName}! 👋</h2>
            <p style="color: #666; font-size: 16px; line-height: 1.6;">
              Welcome to the Recharge Travels family! We're thrilled to have you join us on this journey to discover the beautiful island of Sri Lanka.
            </p>

            <p style="color: #666; font-size: 16px; line-height: 1.6;">
              As a member, you'll get access to:
            </p>

            <ul style="color: #666; font-size: 16px; line-height: 2;">
              <li>🌟 Exclusive deals and early access to new tours</li>
              <li>💰 Special member discounts</li>
              <li>📱 Easy booking management</li>
              <li>🎁 Loyalty rewards and points</li>
            </ul>

            <!-- CTA Button -->
            <div style="text-align: center; margin: 30px 0;">
              <a href="https://www.rechargetravels.com"
                 style="display: inline-block; background: linear-gradient(135deg, #f97316 0%, #ea580c 100%); color: #ffffff;
                        text-decoration: none; padding: 15px 35px; border-radius: 30px; font-weight: bold; font-size: 16px;">
                Start Exploring
              </a>
            </div>
          </div>

          <!-- Contact Info -->
          <div style="background-color: #fff7ed; padding: 25px 30px; text-align: center;">
            <p style="color: #666; margin: 0 0 10px; font-size: 14px;">Questions? We're here to help!</p>
            <p style="color: #333; margin: 0;">
              📧 <a href="mailto:info@rechargetravels.com" style="color: #f97316; text-decoration: none;">info@rechargetravels.com</a>
            </p>
            <p style="color: #333; margin: 10px 0 0;">
              <a href="https://wa.me/94777721999" style="color: #25D366; text-decoration: none;">📱 WhatsApp: +94 77 772 1999</a>
            </p>
          </div>

          <!-- Footer -->
          <div style="background-color: #333; padding: 20px 30px; text-align: center;">
            <p style="color: #999; margin: 0; font-size: 12px;">
              © ${new Date().getFullYear()} Recharge Travels. All rights reserved.<br>
              <a href="https://www.rechargetravels.com" style="color: #f97316; text-decoration: none;">www.rechargetravels.com</a>
            </p>
          </div>
        </div>
      </body>
      </html>
    `,
    text: `
      Welcome to Recharge Travels!

      Hello ${data.customerName},

      Welcome to the Recharge Travels family! We're thrilled to have you join us.

      As a member, you'll get access to:
      - Exclusive deals and early access to new tours
      - Special member discounts
      - Easy booking management
      - Loyalty rewards and points

      Start exploring at: https://recharge-travels-73e76.web.app

      Best regards,
      Recharge Travels Team
    `
  }),

  // AI Trip Planner Confirmation
  aiTripPlannerConfirmation: (data: any) => ({
    subject: `🗺️ Your AI Trip Plan is Ready - ${data.tripTitle}`,
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
      </head>
      <body style="margin: 0; padding: 0; background-color: #f5f5f5; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;">
        <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff;">
          <!-- Header -->
          <div style="background: linear-gradient(135deg, #8b5cf6 0%, #06b6d4 100%); padding: 30px; text-align: center;">
            <img src="https://www.rechargetravels.com/logo-v2.png" alt="Recharge Travels" style="height: 50px; margin-bottom: 10px;">
            <h1 style="color: #ffffff; margin: 0; font-size: 28px;">🗺️ Your Trip Plan is Ready!</h1>
            <p style="color: #e9d5ff; margin: 10px 0 0;">AI-Powered Sri Lanka Itinerary</p>
          </div>

          <!-- Content -->
          <div style="padding: 40px 30px;">
            <h2 style="color: #333; margin-top: 0;">Hello ${data.customerName}! 👋</h2>
            <p style="color: #666; font-size: 16px; line-height: 1.6;">
              Thank you for using our AI Trip Planner! We've received your personalized Sri Lanka itinerary request and our travel experts are reviewing it now.
            </p>

            <!-- Trip Summary Card -->
            <div style="background: linear-gradient(135deg, #f3e8ff 0%, #ecfeff 100%); border-radius: 12px; padding: 25px; margin: 25px 0; border-left: 4px solid #8b5cf6;">
              <h3 style="color: #6d28d9; margin-top: 0; font-size: 18px;">✨ ${data.tripTitle}</h3>
              <table style="width: 100%; border-collapse: collapse;">
                <tr>
                  <td style="padding: 8px 0; color: #666;">Duration:</td>
                  <td style="padding: 8px 0; color: #333; font-weight: bold; text-align: right;">${data.duration} Days</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; color: #666;">Travel Dates:</td>
                  <td style="padding: 8px 0; color: #333; text-align: right;">${data.travelDates}</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; color: #666;">Travelers:</td>
                  <td style="padding: 8px 0; color: #333; text-align: right;">${data.travelers}</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; color: #666;">Budget Style:</td>
                  <td style="padding: 8px 0; color: #333; text-align: right; text-transform: capitalize;">${data.budget}</td>
                </tr>
                <tr style="border-top: 1px solid #d8b4fe;">
                  <td style="padding: 12px 0 0; color: #333; font-weight: bold;">Estimated Cost:</td>
                  <td style="padding: 12px 0 0; color: #8b5cf6; font-weight: bold; font-size: 20px; text-align: right;">~$${data.estimatedCost}</td>
                </tr>
              </table>
            </div>

            <!-- Highlights -->
            ${data.highlights ? `
            <div style="background-color: #f0fdf4; border-radius: 8px; padding: 20px; margin: 20px 0;">
              <h4 style="color: #15803d; margin-top: 0;">🌟 Trip Highlights</h4>
              <ul style="color: #166534; margin: 0; padding-left: 20px;">
                ${data.highlights.map((h: string) => `<li style="margin-bottom: 5px;">${h}</li>`).join('')}
              </ul>
            </div>
            ` : ''}

            ${data.specialRequests ? `
            <div style="background-color: #fef3c7; border-radius: 8px; padding: 15px; margin: 20px 0;">
              <p style="color: #92400e; margin: 0;"><strong>📝 Your Notes:</strong> ${data.specialRequests}</p>
            </div>
            ` : ''}

            <p style="color: #666; font-size: 16px; line-height: 1.6;">
              <strong>What happens next?</strong><br>
              Our expert travel consultants will review your itinerary and contact you within 24 hours with a customized quote including:
            </p>
            <ul style="color: #666; line-height: 1.8;">
              <li>Detailed day-by-day itinerary</li>
              <li>Accommodation options</li>
              <li>Transport arrangements</li>
              <li>Activity bookings</li>
              <li>Final pricing</li>
            </ul>

            <!-- CTA Button -->
            <div style="text-align: center; margin: 30px 0;">
              <a href="https://www.rechargetravels.com/ai-trip-planner"
                 style="display: inline-block; background: linear-gradient(135deg, #8b5cf6 0%, #06b6d4 100%); color: #ffffff;
                        text-decoration: none; padding: 15px 35px; border-radius: 30px; font-weight: bold; font-size: 16px;">
                View Your Itinerary
              </a>
            </div>
          </div>

          <!-- Contact Info -->
          <div style="background-color: #f3e8ff; padding: 25px 30px; text-align: center;">
            <p style="color: #666; margin: 0 0 10px; font-size: 14px;">Questions? We're here to help:</p>
            <p style="color: #333; margin: 0;">
              📧 <a href="mailto:info@rechargetravels.com" style="color: #8b5cf6; text-decoration: none;">info@rechargetravels.com</a>
            </p>
            <p style="color: #333; margin: 10px 0 0;">
              <a href="https://wa.me/94777721999" style="color: #25D366; text-decoration: none;">📱 WhatsApp: +94 77 772 1999</a>
            </p>
          </div>

          <!-- Footer -->
          <div style="background-color: #333; padding: 20px 30px; text-align: center;">
            <p style="color: #999; margin: 0; font-size: 12px;">
              © ${new Date().getFullYear()} Recharge Travels. All rights reserved.<br>
              Sri Lanka | <a href="https://www.rechargetravels.com" style="color: #8b5cf6; text-decoration: none;">www.rechargetravels.com</a>
            </p>
          </div>
        </div>
      </body>
      </html>
    `,
    text: `
      Your AI Trip Plan is Ready - ${data.tripTitle}

      Dear ${data.customerName},

      Thank you for using our AI Trip Planner! Here's your trip summary:

      Trip: ${data.tripTitle}
      Duration: ${data.duration} Days
      Dates: ${data.travelDates}
      Travelers: ${data.travelers}
      Budget: ${data.budget}
      Estimated Cost: ~$${data.estimatedCost}

      Our expert travel consultants will contact you within 24 hours with a customized quote.

      Best regards,
      Recharge Travels Team
    `
  }),

  adminNotification: (data: any) => ({
    subject: `🔔 New ${data.type}: ${data.customerName}`,
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
      </head>
      <body style="margin: 0; padding: 0; background-color: #f5f5f5; font-family: Arial, sans-serif;">
        <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff;">
          <div style="background: linear-gradient(135deg, #f97316 0%, #ea580c 100%); padding: 20px; text-align: center;">
            <img src="https://www.rechargetravels.com/logo-v2.png" alt="Recharge Travels" style="height: 40px; margin-bottom: 10px;">
            <h1 style="color: #ffffff; margin: 0;">Admin Alert 🔔</h1>
          </div>

          <div style="padding: 30px;">
            <h2 style="color: #333;">New ${data.type} Received</h2>

            <div style="background-color: #fff7ed; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #f97316;">
              <h3 style="color: #333; margin-top: 0;">Customer Details</h3>
              <p><strong>Name:</strong> ${data.customerName}</p>
              <p><strong>Email:</strong> ${data.customerEmail}</p>
              ${data.phone ? `<p><strong>Phone:</strong> ${data.phone}</p>` : ''}
            </div>

            <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <h3 style="color: #333; margin-top: 0;">${data.type} Details</h3>
              ${data.details}
            </div>

            <div style="text-align: center; margin-top: 30px;">
              <a href="${data.adminUrl}"
                 style="display: inline-block; background: linear-gradient(135deg, #f97316 0%, #ea580c 100%); color: #ffffff;
                        text-decoration: none; padding: 12px 30px; border-radius: 30px; font-weight: bold;">
                View in Admin Panel
              </a>
            </div>
          </div>

          <div style="background-color: #333; padding: 15px; text-align: center;">
            <p style="color: #999; margin: 0; font-size: 12px;">© ${new Date().getFullYear()} Recharge Travels Admin</p>
          </div>
        </div>
      </body>
      </html>
    `,
    text: `New ${data.type} from ${data.customerName} (${data.customerEmail})`
  }),

  newsletterWelcome: (data: any) => ({
    subject: 'Welcome to Recharge Travels Newsletter! 🌴',
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
      </head>
      <body style="margin: 0; padding: 0; background-color: #f5f5f5; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;">
        <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff;">
          <!-- Header with tropical image -->
          <div style="background: linear-gradient(135deg, #f97316 0%, #ea580c 100%); padding: 40px 30px; text-align: center;">
            <img src="https://www.rechargetravels.com/logo-v2.png" alt="Recharge Travels" style="height: 50px; margin-bottom: 15px;">
            <h1 style="color: #ffffff; margin: 0; font-size: 32px;">Welcome to Our Travel Family! 🌴</h1>
            <p style="color: #fed7aa; margin: 15px 0 0; font-size: 18px;">Your Sri Lanka Adventure Starts Here</p>
          </div>

          <!-- Content -->
          <div style="padding: 40px 30px;">
            <p style="color: #666; font-size: 16px; line-height: 1.8;">
              Dear ${data.subscriberName || 'Travel Enthusiast'},
            </p>
            <p style="color: #666; font-size: 16px; line-height: 1.8;">
              Thank you for subscribing to the Recharge Travels newsletter! You've just taken the first step towards discovering the wonders of Sri Lanka.
            </p>

            <!-- What to expect -->
            <div style="background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%); border-radius: 12px; padding: 25px; margin: 30px 0;">
              <h3 style="color: #333; margin-top: 0; font-size: 20px;">📬 What You'll Receive:</h3>
              <ul style="color: #666; font-size: 15px; line-height: 2; padding-left: 20px; margin: 0;">
                <li><strong>Exclusive Deals</strong> - Special discounts just for subscribers</li>
                <li><strong>Travel Guides</strong> - Insider tips and hidden gems</li>
                <li><strong>New Experiences</strong> - Be first to know about new tours</li>
                <li><strong>Local Stories</strong> - Authentic Sri Lankan culture & cuisine</li>
                <li><strong>Seasonal Updates</strong> - Best times to visit different regions</li>
              </ul>
            </div>

            <!-- Featured destinations -->
            <h3 style="color: #333; font-size: 20px;">🗺️ Popular Destinations to Explore:</h3>
            <div style="display: flex; flex-wrap: wrap; gap: 10px; margin: 20px 0;">
              <span style="background: #e3f2fd; color: #1565c0; padding: 8px 16px; border-radius: 20px; font-size: 14px;">Sigiriya</span>
              <span style="background: #e8f5e9; color: #2e7d32; padding: 8px 16px; border-radius: 20px; font-size: 14px;">Ella</span>
              <span style="background: #fff3e0; color: #ef6c00; padding: 8px 16px; border-radius: 20px; font-size: 14px;">Mirissa</span>
              <span style="background: #fce4ec; color: #c2185b; padding: 8px 16px; border-radius: 20px; font-size: 14px;">Kandy</span>
              <span style="background: #f3e5f5; color: #7b1fa2; padding: 8px 16px; border-radius: 20px; font-size: 14px;">Galle</span>
            </div>

            <!-- CTA -->
            <div style="text-align: center; margin: 35px 0;">
              <a href="https://www.rechargetravels.com/tours"
                 style="display: inline-block; background: linear-gradient(135deg, #f97316 0%, #ea580c 100%); color: #ffffff;
                        text-decoration: none; padding: 16px 40px; border-radius: 30px; font-weight: bold; font-size: 16px;">
                Explore Our Tours
              </a>
            </div>

            <p style="color: #666; font-size: 16px; line-height: 1.8;">
              We're excited to share the beauty of Sri Lanka with you!
            </p>
            <p style="color: #666; font-size: 16px;">
              Warm regards,<br>
              <strong>The Recharge Travels Team</strong>
            </p>
          </div>

          <!-- Social Links -->
          <div style="background-color: #fff7ed; padding: 25px 30px; text-align: center;">
            <p style="color: #666; margin: 0 0 15px; font-size: 14px;">Follow us for daily inspiration:</p>
            <div style="margin-bottom: 15px;">
              <a href="https://facebook.com/rechargetravels" style="display: inline-block; margin: 0 10px; color: #f97316; text-decoration: none;">Facebook</a>
              <a href="https://instagram.com/rechargetravels" style="display: inline-block; margin: 0 10px; color: #f97316; text-decoration: none;">Instagram</a>
            </div>
            <p style="color: #333; margin: 10px 0 0;">
              <a href="https://wa.me/94777721999" style="color: #25D366; text-decoration: none;">📱 WhatsApp: +94 77 772 1999</a>
            </p>
          </div>

          <!-- Footer -->
          <div style="background-color: #333; padding: 25px 30px; text-align: center;">
            <p style="color: #999; margin: 0 0 10px; font-size: 12px;">
              © ${new Date().getFullYear()} Recharge Travels. All rights reserved.
            </p>
            <p style="color: #999; margin: 0; font-size: 11px;">
              You received this email because you subscribed to our newsletter.<br>
              <a href="https://www.rechargetravels.com/unsubscribe?email=${data.email}" style="color: #f97316;">Unsubscribe</a>
            </p>
          </div>
        </div>
      </body>
      </html>
    `,
    text: `
      Welcome to Recharge Travels Newsletter!

      Dear ${data.subscriberName || 'Travel Enthusiast'},

      Thank you for subscribing! You'll receive:
      - Exclusive travel deals and discounts
      - Insider guides and tips
      - New tour announcements
      - Local stories and cultural insights

      Start exploring at: https://recharge-travels-73e76.web.app/tours

      Warm regards,
      The Recharge Travels Team

      Unsubscribe: https://recharge-travels-73e76.web.app/unsubscribe?email=${data.email}
    `
  }),

  newBlogPost: (data: any) => ({
    subject: `New Article: ${data.title} 📖`,
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
      </head>
      <body style="margin: 0; padding: 0; background-color: #f5f5f5; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;">
        <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff;">
          <div style="background: linear-gradient(135deg, #f97316 0%, #ea580c 100%); padding: 30px; text-align: center;">
            <img src="https://www.rechargetravels.com/logo-v2.png" alt="Recharge Travels" style="height: 40px; margin-bottom: 10px;">
            <h1 style="color: #ffffff; margin: 0; font-size: 24px;">New From Our Blog 📖</h1>
          </div>

          <div style="padding: 40px 30px;">
            ${data.featuredImage ? `
            <div style="margin-bottom: 25px; border-radius: 12px; overflow: hidden;">
              <img src="${data.featuredImage}" alt="${data.title}" style="width: 100%; height: auto; display: block;">
            </div>
            ` : ''}

            <h2 style="color: #333; margin-top: 0; font-size: 24px; line-height: 1.4;">${data.title}</h2>

            <p style="color: #666; font-size: 14px; margin-bottom: 20px;">
              By ${data.author} • ${data.readingTime || '5'} min read
            </p>

            <p style="color: #666; font-size: 16px; line-height: 1.8;">
              ${data.excerpt || data.content?.substring(0, 200) + '...'}
            </p>

            <div style="text-align: center; margin: 35px 0;">
              <a href="https://www.rechargetravels.com/blog/${data.slug || data.id}"
                 style="display: inline-block; background: linear-gradient(135deg, #f97316 0%, #ea580c 100%); color: #ffffff;
                        text-decoration: none; padding: 14px 35px; border-radius: 30px; font-weight: bold; font-size: 15px;">
                Read Full Article
              </a>
            </div>
          </div>

          <div style="background-color: #333; padding: 20px 30px; text-align: center;">
            <p style="color: #999; margin: 0; font-size: 11px;">
              You received this because you subscribed to blog updates.<br>
              <a href="https://www.rechargetravels.com/unsubscribe?email=${data.email}" style="color: #f97316;">Unsubscribe</a>
            </p>
          </div>
        </div>
      </body>
      </html>
    `,
    text: `New Blog Post: ${data.title}\n\nBy ${data.author}\n\n${data.excerpt || data.content?.substring(0, 200)}...\n\nRead more: https://www.rechargetravels.com/blog/${data.slug || data.id}`
  }),

  // Driver Onboarding Templates
  driverApplicationSubmitted: (data: any) => ({
    subject: 'Application Received - Recharge Travels Driver Partner',
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
      </head>
      <body style="margin: 0; padding: 0; background-color: #f5f5f5; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;">
        <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff;">
          <div style="background: linear-gradient(135deg, #f97316 0%, #ea580c 100%); padding: 30px; text-align: center;">
            <h1 style="color: #ffffff; margin: 0; font-size: 28px;">🚗 Application Received!</h1>
            <p style="color: #fed7aa; margin: 10px 0 0;">Recharge Travels Driver Partner Program</p>
          </div>

          <div style="padding: 40px 30px;">
            <h2 style="color: #333; margin-top: 0;">Hello ${data.driverName}! 👋</h2>
            <p style="color: #666; font-size: 16px; line-height: 1.6;">
              Thank you for applying to become a Recharge Travels Driver Partner! We have received your application and our verification team is reviewing your documents.
            </p>

            <div style="background: linear-gradient(135deg, #fef3c7 0%, #fde68a 100%); border-radius: 12px; padding: 25px; margin: 25px 0; border-left: 4px solid #f97316;">
              <h3 style="color: #92400e; margin-top: 0; font-size: 18px;">📋 Application Details</h3>
              <table style="width: 100%; border-collapse: collapse;">
                <tr>
                  <td style="padding: 8px 0; color: #78350f;">Driver Tier:</td>
                  <td style="padding: 8px 0; color: #92400e; font-weight: bold; text-align: right;">${data.tier}</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; color: #78350f;">Vehicle:</td>
                  <td style="padding: 8px 0; color: #92400e; text-align: right;">${data.vehicleInfo || 'Not specified'}</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; color: #78350f;">Submitted:</td>
                  <td style="padding: 8px 0; color: #92400e; text-align: right;">${data.submittedAt}</td>
                </tr>
              </table>
            </div>

            <div style="background-color: #f0fdf4; border-radius: 8px; padding: 20px; margin: 20px 0;">
              <h4 style="color: #166534; margin-top: 0;">What happens next?</h4>
              <ul style="color: #15803d; padding-left: 20px; line-height: 2;">
                <li>Our team will review your documents within 24-48 hours</li>
                <li>You'll receive an email when your application is approved</li>
                <li>Once verified, you can start receiving bookings</li>
              </ul>
            </div>

            <p style="color: #666; font-size: 16px; line-height: 1.6;">
              If you have any questions, feel free to contact our driver support team.
            </p>
          </div>

          <div style="background-color: #f8f9fa; padding: 25px 30px; text-align: center;">
            <p style="color: #666; margin: 0 0 10px; font-size: 14px;">Driver Support:</p>
            <p style="color: #333; margin: 0;">
              📧 <a href="mailto:info@rechargetravels.com" style="color: #f97316; text-decoration: none;">info@rechargetravels.com</a>
            </p>
            <p style="color: #333; margin: 10px 0 0;">
              <a href="https://wa.me/94777721999" style="color: #25D366; text-decoration: none; display: inline-flex; align-items: center;">
                <img src="https://upload.wikimedia.org/wikipedia/commons/6/6b/WhatsApp.svg" alt="WhatsApp" style="width: 20px; height: 20px; margin-right: 8px; vertical-align: middle;">
                +94 77 772 1999
              </a>
            </p>
          </div>

          <div style="background-color: #333; padding: 20px 30px; text-align: center;">
            <p style="color: #999; margin: 0; font-size: 12px;">
              © ${new Date().getFullYear()} Recharge Travels. All rights reserved.
            </p>
          </div>
        </div>
      </body>
      </html>
    `,
    text: `Application Received - Recharge Travels\n\nHello ${data.driverName},\n\nThank you for applying! Your ${data.tier} application has been received and is under review.\n\nWe'll notify you within 24-48 hours.\n\nDriver Support: info@rechargetravels.com | WhatsApp: +94 77 772 1999`
  }),

  driverApplicationApproved: (data: any) => ({
    subject: '🎉 Congratulations! Your Driver Application is Approved',
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
      </head>
      <body style="margin: 0; padding: 0; background-color: #f5f5f5; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;">
        <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff;">
          <div style="background: linear-gradient(135deg, #22c55e 0%, #16a34a 100%); padding: 30px; text-align: center;">
            <h1 style="color: #ffffff; margin: 0; font-size: 28px;">🎉 You're Approved!</h1>
            <p style="color: #bbf7d0; margin: 10px 0 0;">Welcome to the Recharge Travels Family</p>
          </div>

          <div style="padding: 40px 30px;">
            <h2 style="color: #333; margin-top: 0;">Congratulations ${data.driverName}! 🚗</h2>
            <p style="color: #666; font-size: 16px; line-height: 1.6;">
              Great news! Your driver application has been <strong style="color: #16a34a;">approved</strong> and you are now a verified Recharge Travels Driver Partner.
            </p>

            <div style="background: linear-gradient(135deg, #dcfce7 0%, #bbf7d0 100%); border-radius: 12px; padding: 25px; margin: 25px 0; border-left: 4px solid #22c55e;">
              <h3 style="color: #166534; margin-top: 0; font-size: 18px;">✅ Verification Details</h3>
              <table style="width: 100%; border-collapse: collapse;">
                <tr>
                  <td style="padding: 8px 0; color: #166534;">Status:</td>
                  <td style="padding: 8px 0; color: #15803d; font-weight: bold; text-align: right;">VERIFIED ✓</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; color: #166534;">Verification Level:</td>
                  <td style="padding: 8px 0; color: #15803d; font-weight: bold; text-align: right;">Level ${data.verificationLevel}</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; color: #166534;">Driver Tier:</td>
                  <td style="padding: 8px 0; color: #15803d; text-align: right;">${data.tier}</td>
                </tr>
                ${data.isSltdaApproved ? `
                <tr>
                  <td style="padding: 8px 0; color: #166534;">SLTDA Status:</td>
                  <td style="padding: 8px 0; color: #15803d; font-weight: bold; text-align: right;">APPROVED 🏆</td>
                </tr>
                ` : ''}
              </table>
            </div>

            <div style="background-color: #eff6ff; border-radius: 8px; padding: 20px; margin: 20px 0;">
              <h4 style="color: #1e40af; margin-top: 0;">🚀 Getting Started</h4>
              <ul style="color: #1d4ed8; padding-left: 20px; line-height: 2;">
                <li>Log in to your <a href="https://recharge-travels-73e76.web.app/driver/dashboard" style="color: #f97316;">Driver Dashboard</a></li>
                <li>Complete your profile with a professional photo</li>
                <li>Set your availability calendar</li>
                <li>Start receiving booking requests!</li>
              </ul>
            </div>

            <div style="text-align: center; margin: 30px 0;">
              <a href="https://recharge-travels-73e76.web.app/driver/dashboard"
                 style="display: inline-block; background: linear-gradient(135deg, #f97316 0%, #ea580c 100%); color: #ffffff;
                        text-decoration: none; padding: 15px 35px; border-radius: 30px; font-weight: bold; font-size: 16px;">
                Go to Dashboard
              </a>
            </div>
          </div>

          <div style="background-color: #333; padding: 20px 30px; text-align: center;">
            <p style="color: #999; margin: 0; font-size: 12px;">
              © ${new Date().getFullYear()} Recharge Travels. All rights reserved.
            </p>
          </div>
        </div>
      </body>
      </html>
    `,
    text: `Congratulations ${data.driverName}!\n\nYour driver application has been APPROVED!\n\nVerification Level: ${data.verificationLevel}\nTier: ${data.tier}\n\nLog in to your dashboard to start receiving bookings:\nhttps://recharge-travels-73e76.web.app/driver/dashboard`
  }),

  driverApplicationRejected: (data: any) => ({
    subject: 'Update on Your Driver Application - Recharge Travels',
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
      </head>
      <body style="margin: 0; padding: 0; background-color: #f5f5f5; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;">
        <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff;">
          <div style="background: linear-gradient(135deg, #64748b 0%, #475569 100%); padding: 30px; text-align: center;">
            <h1 style="color: #ffffff; margin: 0; font-size: 28px;">Application Update</h1>
            <p style="color: #cbd5e1; margin: 10px 0 0;">Recharge Travels Driver Partner Program</p>
          </div>

          <div style="padding: 40px 30px;">
            <h2 style="color: #333; margin-top: 0;">Hello ${data.driverName},</h2>
            <p style="color: #666; font-size: 16px; line-height: 1.6;">
              Thank you for your interest in becoming a Recharge Travels Driver Partner. After reviewing your application, we regret to inform you that we are unable to approve it at this time.
            </p>

            <div style="background-color: #fef2f2; border-radius: 12px; padding: 25px; margin: 25px 0; border-left: 4px solid #ef4444;">
              <h3 style="color: #991b1b; margin-top: 0; font-size: 18px;">📋 Reason</h3>
              <p style="color: #b91c1c; margin: 0;">${data.rejectionReason || 'Documents could not be verified. Please ensure all documents are clear, valid, and not expired.'}</p>
            </div>

            <div style="background-color: #fefce8; border-radius: 8px; padding: 20px; margin: 20px 0;">
              <h4 style="color: #854d0e; margin-top: 0;">📝 How to Reapply</h4>
              <ul style="color: #a16207; padding-left: 20px; line-height: 2;">
                <li>Review the rejection reason above</li>
                <li>Ensure all documents are clear and valid</li>
                <li>Update your profile with correct information</li>
                <li>Resubmit your application</li>
              </ul>
            </div>

            <div style="text-align: center; margin: 30px 0;">
              <a href="https://recharge-travels-73e76.web.app/join-with-us"
                 style="display: inline-block; background: linear-gradient(135deg, #f97316 0%, #ea580c 100%); color: #ffffff;
                        text-decoration: none; padding: 15px 35px; border-radius: 30px; font-weight: bold; font-size: 16px;">
                Update & Reapply
              </a>
            </div>

            <p style="color: #666; font-size: 16px; line-height: 1.6;">
              If you believe this decision was made in error or need clarification, please contact our driver support team.
            </p>
          </div>

          <div style="background-color: #f8f9fa; padding: 25px 30px; text-align: center;">
            <p style="color: #666; margin: 0 0 10px; font-size: 14px;">Driver Support:</p>
            <p style="color: #333; margin: 0;">
              📧 <a href="mailto:info@rechargetravels.com" style="color: #f97316; text-decoration: none;">info@rechargetravels.com</a>
            </p>
            <p style="color: #333; margin: 10px 0 0;">
              <a href="https://wa.me/94777721999" style="color: #25D366; text-decoration: none; display: inline-flex; align-items: center;">
                <img src="https://upload.wikimedia.org/wikipedia/commons/6/6b/WhatsApp.svg" alt="WhatsApp" style="width: 20px; height: 20px; margin-right: 8px; vertical-align: middle;">
                +94 77 772 1999
              </a>
            </p>
          </div>

          <div style="background-color: #333; padding: 20px 30px; text-align: center;">
            <p style="color: #999; margin: 0; font-size: 12px;">
              © ${new Date().getFullYear()} Recharge Travels. All rights reserved.
            </p>
          </div>
        </div>
      </body>
      </html>
    `,
    text: `Hello ${data.driverName},\n\nWe regret to inform you that your driver application could not be approved.\n\nReason: ${data.rejectionReason || 'Documents could not be verified.'}\n\nYou may update your documents and reapply at:\nhttps://recharge-travels-73e76.web.app/join-with-us\n\nContact: info@rechargetravels.com | WhatsApp: +94 77 772 1999`
  }),

  driverDocumentExpiring: (data: any) => ({
    subject: `⚠️ Document Expiring Soon - ${data.documentType}`,
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
      </head>
      <body style="margin: 0; padding: 0; background-color: #f5f5f5; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;">
        <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff;">
          <div style="background: linear-gradient(135deg, #eab308 0%, #ca8a04 100%); padding: 30px; text-align: center;">
            <h1 style="color: #ffffff; margin: 0; font-size: 28px;">⚠️ Document Expiring</h1>
          </div>

          <div style="padding: 40px 30px;">
            <h2 style="color: #333; margin-top: 0;">Hello ${data.driverName},</h2>
            <p style="color: #666; font-size: 16px; line-height: 1.6;">
              Your <strong>${data.documentType}</strong> is expiring on <strong style="color: #ca8a04;">${data.expiryDate}</strong>.
              Please upload a renewed document to maintain your verified status.
            </p>

            <div style="background-color: #fef9c3; border-radius: 12px; padding: 25px; margin: 25px 0; border-left: 4px solid #eab308;">
              <p style="color: #854d0e; margin: 0; font-size: 16px;">
                <strong>Days remaining:</strong> ${data.daysRemaining} days
              </p>
            </div>

            <div style="text-align: center; margin: 30px 0;">
              <a href="https://recharge-travels-73e76.web.app/driver/dashboard"
                 style="display: inline-block; background: linear-gradient(135deg, #f97316 0%, #ea580c 100%); color: #ffffff;
                        text-decoration: none; padding: 15px 35px; border-radius: 30px; font-weight: bold; font-size: 16px;">
                Update Document
              </a>
            </div>
          </div>

          <div style="background-color: #333; padding: 20px 30px; text-align: center;">
            <p style="color: #999; margin: 0; font-size: 12px;">
              © ${new Date().getFullYear()} Recharge Travels. All rights reserved.
            </p>
          </div>
        </div>
      </body>
      </html>
    `,
    text: `Hello ${data.driverName},\n\nYour ${data.documentType} is expiring on ${data.expiryDate} (${data.daysRemaining} days remaining).\n\nPlease upload a renewed document at:\nhttps://recharge-travels-73e76.web.app/driver/dashboard`
  }),

  bookingReminder: (data: any) => ({
    subject: `Reminder: Your Trip to ${data.destination} is Coming Up! 🗓️`,
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
      </head>
      <body style="margin: 0; padding: 0; background-color: #f5f5f5; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;">
        <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff;">
          <div style="background: linear-gradient(135deg, #f97316 0%, #ea580c 100%); padding: 30px; text-align: center;">
            <img src="https://www.rechargetravels.com/logo-v2.png" alt="Recharge Travels" style="height: 50px; margin-bottom: 10px;">
            <h1 style="color: #ffffff; margin: 0; font-size: 28px;">Trip Reminder! 🎒</h1>
          </div>

          <div style="padding: 40px 30px;">
            <h2 style="color: #333; margin-top: 0;">Hi ${data.customerName}! 🌴</h2>
            <p style="color: #666; font-size: 16px; line-height: 1.6;">
              Your adventure to <strong style="color: #f97316;">${data.destination}</strong> is just <strong style="color: #f97316;">${data.daysUntil} days away</strong>!
            </p>

            <div style="background-color: #fff7ed; border-radius: 12px; padding: 25px; margin: 25px 0; border-left: 4px solid #f97316;">
              <h3 style="color: #333; margin-top: 0;">📋 Quick Checklist</h3>
              <ul style="color: #666; padding-left: 20px; line-height: 2;">
                <li>Valid passport (check expiry date)</li>
                <li>Travel insurance</li>
                <li>Confirm pickup details</li>
                <li>Pack light, comfortable clothing</li>
                <li>Camera and chargers</li>
              </ul>
            </div>

            <p style="color: #666; font-size: 16px; line-height: 1.6;">
              If you have any questions, don't hesitate to reach out to us!
            </p>

            <div style="text-align: center; margin: 30px 0;">
              <a href="https://www.rechargetravels.com/my-bookings"
                 style="display: inline-block; background: linear-gradient(135deg, #f97316 0%, #ea580c 100%); color: #ffffff;
                        text-decoration: none; padding: 15px 35px; border-radius: 30px; font-weight: bold; font-size: 16px;">
                View My Booking
              </a>
            </div>
          </div>

          <!-- Contact Info -->
          <div style="background-color: #fff7ed; padding: 25px 30px; text-align: center;">
            <p style="color: #666; margin: 0 0 10px; font-size: 14px;">Need to make changes?</p>
            <p style="color: #333; margin: 0;">
              📧 <a href="mailto:info@rechargetravels.com" style="color: #f97316; text-decoration: none;">info@rechargetravels.com</a>
            </p>
            <p style="color: #333; margin: 10px 0 0;">
              <a href="https://wa.me/94777721999" style="color: #25D366; text-decoration: none;">📱 WhatsApp: +94 77 772 1999</a>
            </p>
          </div>

          <div style="background-color: #333; padding: 20px 30px; text-align: center;">
            <p style="color: #999; margin: 0; font-size: 12px;">
              © ${new Date().getFullYear()} Recharge Travels. All rights reserved.<br>
              <a href="https://www.rechargetravels.com" style="color: #f97316; text-decoration: none;">www.rechargetravels.com</a>
            </p>
          </div>
        </div>
      </body>
      </html>
    `,
    text: `Trip Reminder! Your adventure to ${data.destination} is ${data.daysUntil} days away!\n\nContact: info@rechargetravels.com | WhatsApp: +94 77 772 1999`
  }),

  // ==========================================
  // VENDOR PLATFORM EMAIL TEMPLATES
  // ==========================================

  vendorApplicationSubmitted: (data: any) => ({
    subject: '🎉 Application Received - Recharge Travels Vendor Partner',
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
      </head>
      <body style="margin: 0; padding: 0; background-color: #f5f5f5; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;">
        <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff;">
          <div style="background: linear-gradient(135deg, #f97316 0%, #ea580c 100%); padding: 30px; text-align: center;">
            <img src="https://recharge-travels-73e76.web.app/logo-v2.png" alt="Recharge Travels" style="height: 50px; margin-bottom: 10px;">
            <h1 style="color: #ffffff; margin: 0; font-size: 28px;">Welcome to Our Partner Program!</h1>
            <p style="color: #fed7aa; margin: 10px 0 0;">Recharge Travels Vendor Partnership</p>
          </div>

          <div style="padding: 40px 30px;">
            <h2 style="color: #333; margin-top: 0;">Hello ${data.vendorName}! 👋</h2>
            <p style="color: #666; font-size: 16px; line-height: 1.6;">
              Thank you for applying to become a Recharge Travels Vendor Partner! We're excited to have you interested in joining our platform.
            </p>

            <div style="background: linear-gradient(135deg, #fef3c7 0%, #fde68a 100%); border-radius: 12px; padding: 25px; margin: 25px 0; border-left: 4px solid #f97316;">
              <h3 style="color: #92400e; margin-top: 0; font-size: 18px;">📋 Application Details</h3>
              <table style="width: 100%; border-collapse: collapse;">
                <tr>
                  <td style="padding: 8px 0; color: #78350f;">Business Name:</td>
                  <td style="padding: 8px 0; color: #92400e; font-weight: bold; text-align: right;">${data.businessName || 'Not specified'}</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; color: #78350f;">Service Category:</td>
                  <td style="padding: 8px 0; color: #92400e; text-align: right;">${data.category || 'Not specified'}</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; color: #78350f;">Application ID:</td>
                  <td style="padding: 8px 0; color: #92400e; text-align: right;">${data.vendorId || 'N/A'}</td>
                </tr>
              </table>
            </div>

            <div style="background-color: #f0fdf4; border-radius: 8px; padding: 20px; margin: 20px 0;">
              <h4 style="color: #166534; margin-top: 0;">✅ What happens next?</h4>
              <ul style="color: #15803d; padding-left: 20px; line-height: 2;">
                <li>Our team will review your application within 24-48 hours</li>
                <li>We may contact you for additional information if needed</li>
                <li>You'll receive an email once your application is approved</li>
                <li>After approval, you can start listing your services!</li>
              </ul>
            </div>

            <div style="background-color: #eff6ff; border-radius: 8px; padding: 20px; margin: 20px 0;">
              <h4 style="color: #1e40af; margin-top: 0;">📚 While you wait...</h4>
              <ul style="color: #1d4ed8; padding-left: 20px; line-height: 2;">
                <li>Prepare high-quality photos of your services</li>
                <li>Think about your pricing strategy</li>
                <li>Review our <a href="https://recharge-travels-73e76.web.app/vendor-guidelines" style="color: #f97316;">Vendor Guidelines</a></li>
              </ul>
            </div>

            <p style="color: #666; font-size: 16px; line-height: 1.6;">
              If you have any questions, our vendor support team is here to help!
            </p>
          </div>

          <div style="background-color: #f8f9fa; padding: 25px 30px; text-align: center;">
            <p style="color: #666; margin: 0 0 10px; font-size: 14px;">Vendor Support:</p>
            <p style="color: #333; margin: 0;">
              📧 <a href="mailto:info@rechargetravels.com" style="color: #f97316; text-decoration: none;">info@rechargetravels.com</a>
            </p>
            <p style="color: #333; margin: 10px 0 0;">
              <a href="https://wa.me/94777721999" style="color: #25D366; text-decoration: none;">
                📱 WhatsApp: +94 77 772 1999
              </a>
            </p>
          </div>

          <div style="background-color: #333; padding: 20px 30px; text-align: center;">
            <p style="color: #999; margin: 0; font-size: 12px;">
              © ${new Date().getFullYear()} Recharge Travels. All rights reserved.
            </p>
          </div>
        </div>
      </body>
      </html>
    `,
    text: `Welcome to Recharge Travels Partner Program!\n\nHello ${data.vendorName},\n\nThank you for applying to become a Vendor Partner!\n\nBusiness: ${data.businessName || 'Not specified'}\nCategory: ${data.category || 'Not specified'}\n\nWe'll review your application within 24-48 hours.\n\nVendor Support: info@rechargetravels.com | WhatsApp: +94 77 772 1999`
  }),

  vendorApplicationApproved: (data: any) => ({
    subject: '🎉 Congratulations! Your Vendor Application is Approved',
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
      </head>
      <body style="margin: 0; padding: 0; background-color: #f5f5f5; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;">
        <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff;">
          <div style="background: linear-gradient(135deg, #22c55e 0%, #16a34a 100%); padding: 30px; text-align: center;">
            <img src="https://recharge-travels-73e76.web.app/logo-v2.png" alt="Recharge Travels" style="height: 50px; margin-bottom: 10px;">
            <h1 style="color: #ffffff; margin: 0; font-size: 28px;">🎉 You're Approved!</h1>
            <p style="color: #bbf7d0; margin: 10px 0 0;">Welcome to the Recharge Travels Family</p>
          </div>

          <div style="padding: 40px 30px;">
            <h2 style="color: #333; margin-top: 0;">Congratulations ${data.vendorName}! 🚀</h2>
            <p style="color: #666; font-size: 16px; line-height: 1.6;">
              Great news! Your vendor application has been <strong style="color: #16a34a;">approved</strong> and you are now an official Recharge Travels Partner.
            </p>

            <div style="background: linear-gradient(135deg, #dcfce7 0%, #bbf7d0 100%); border-radius: 12px; padding: 25px; margin: 25px 0; border-left: 4px solid #22c55e;">
              <h3 style="color: #166534; margin-top: 0; font-size: 18px;">✅ Account Status</h3>
              <table style="width: 100%; border-collapse: collapse;">
                <tr>
                  <td style="padding: 8px 0; color: #166534;">Status:</td>
                  <td style="padding: 8px 0; color: #15803d; font-weight: bold; text-align: right;">APPROVED ✓</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; color: #166534;">Business:</td>
                  <td style="padding: 8px 0; color: #15803d; text-align: right;">${data.businessName || data.vendorName}</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; color: #166534;">Category:</td>
                  <td style="padding: 8px 0; color: #15803d; text-align: right;">${data.category || 'Vendor Partner'}</td>
                </tr>
              </table>
            </div>

            <div style="background-color: #eff6ff; border-radius: 8px; padding: 20px; margin: 20px 0;">
              <h4 style="color: #1e40af; margin-top: 0;">🚀 Getting Started</h4>
              <ul style="color: #1d4ed8; padding-left: 20px; line-height: 2;">
                <li>Log in to your <a href="https://recharge-travels-73e76.web.app/vendor/dashboard" style="color: #f97316;">Vendor Dashboard</a></li>
                <li>Complete your business profile</li>
                <li>Add your first service listing</li>
                <li>Set your availability and pricing</li>
                <li>Start receiving bookings!</li>
              </ul>
            </div>

            <div style="text-align: center; margin: 30px 0;">
              <a href="https://recharge-travels-73e76.web.app/vendor/dashboard"
                 style="display: inline-block; background: linear-gradient(135deg, #f97316 0%, #ea580c 100%); color: #ffffff;
                        text-decoration: none; padding: 15px 35px; border-radius: 30px; font-weight: bold; font-size: 16px;">
                Go to Vendor Dashboard
              </a>
            </div>
          </div>

          <div style="background-color: #333; padding: 20px 30px; text-align: center;">
            <p style="color: #999; margin: 0; font-size: 12px;">
              © ${new Date().getFullYear()} Recharge Travels. All rights reserved.
            </p>
          </div>
        </div>
      </body>
      </html>
    `,
    text: `Congratulations ${data.vendorName}!\n\nYour vendor application has been APPROVED!\n\nBusiness: ${data.businessName || data.vendorName}\nCategory: ${data.category || 'Vendor Partner'}\n\nLog in to your dashboard to start receiving bookings:\nhttps://recharge-travels-73e76.web.app/vendor/dashboard`
  }),

  vendorApplicationRejected: (data: any) => ({
    subject: 'Update on Your Vendor Application - Recharge Travels',
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
      </head>
      <body style="margin: 0; padding: 0; background-color: #f5f5f5; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;">
        <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff;">
          <div style="background: linear-gradient(135deg, #64748b 0%, #475569 100%); padding: 30px; text-align: center;">
            <img src="https://recharge-travels-73e76.web.app/logo-v2.png" alt="Recharge Travels" style="height: 50px; margin-bottom: 10px;">
            <h1 style="color: #ffffff; margin: 0; font-size: 28px;">Application Update</h1>
            <p style="color: #cbd5e1; margin: 10px 0 0;">Recharge Travels Vendor Partner Program</p>
          </div>

          <div style="padding: 40px 30px;">
            <h2 style="color: #333; margin-top: 0;">Hello ${data.vendorName},</h2>
            <p style="color: #666; font-size: 16px; line-height: 1.6;">
              Thank you for your interest in becoming a Recharge Travels Vendor Partner. After reviewing your application, we regret to inform you that we are unable to approve it at this time.
            </p>

            <div style="background-color: #fef2f2; border-radius: 12px; padding: 25px; margin: 25px 0; border-left: 4px solid #ef4444;">
              <h3 style="color: #991b1b; margin-top: 0; font-size: 18px;">📋 Reason</h3>
              <p style="color: #b91c1c; margin: 0;">${data.rejectionReason || 'Your application did not meet our current requirements. Please ensure all information and documents are complete and accurate.'}</p>
            </div>

            <div style="background-color: #fefce8; border-radius: 8px; padding: 20px; margin: 20px 0;">
              <h4 style="color: #854d0e; margin-top: 0;">📝 How to Reapply</h4>
              <ul style="color: #a16207; padding-left: 20px; line-height: 2;">
                <li>Review the feedback provided above</li>
                <li>Ensure all documents are clear and valid</li>
                <li>Update your business information</li>
                <li>Submit a new application</li>
              </ul>
            </div>

            <div style="text-align: center; margin: 30px 0;">
              <a href="https://recharge-travels-73e76.web.app/vendor/register"
                 style="display: inline-block; background: linear-gradient(135deg, #f97316 0%, #ea580c 100%); color: #ffffff;
                        text-decoration: none; padding: 15px 35px; border-radius: 30px; font-weight: bold; font-size: 16px;">
                Apply Again
              </a>
            </div>

            <p style="color: #666; font-size: 16px; line-height: 1.6;">
              If you believe this decision was made in error or need clarification, please contact our vendor support team.
            </p>
          </div>

          <div style="background-color: #f8f9fa; padding: 25px 30px; text-align: center;">
            <p style="color: #666; margin: 0 0 10px; font-size: 14px;">Vendor Support:</p>
            <p style="color: #333; margin: 0;">
              📧 <a href="mailto:info@rechargetravels.com" style="color: #f97316; text-decoration: none;">info@rechargetravels.com</a>
            </p>
            <p style="color: #333; margin: 10px 0 0;">
              <a href="https://wa.me/94777721999" style="color: #25D366; text-decoration: none;">
                📱 WhatsApp: +94 77 772 1999
              </a>
            </p>
          </div>

          <div style="background-color: #333; padding: 20px 30px; text-align: center;">
            <p style="color: #999; margin: 0; font-size: 12px;">
              © ${new Date().getFullYear()} Recharge Travels. All rights reserved.
            </p>
          </div>
        </div>
      </body>
      </html>
    `,
    text: `Hello ${data.vendorName},\n\nWe regret to inform you that your vendor application could not be approved.\n\nReason: ${data.rejectionReason || 'Application did not meet requirements.'}\n\nYou may update your information and reapply at:\nhttps://recharge-travels-73e76.web.app/vendor/register\n\nContact: info@rechargetravels.com | WhatsApp: +94 77 772 1999`
  }),

  vendorNewBooking: (data: any) => ({
    subject: `🎉 New Booking Alert - ${data.serviceName}`,
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
      </head>
      <body style="margin: 0; padding: 0; background-color: #f5f5f5; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;">
        <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff;">
          <div style="background: linear-gradient(135deg, #f97316 0%, #ea580c 100%); padding: 30px; text-align: center;">
            <h1 style="color: #ffffff; margin: 0; font-size: 28px;">🎉 New Booking!</h1>
          </div>

          <div style="padding: 40px 30px;">
            <h2 style="color: #333; margin-top: 0;">Great news ${data.vendorName}!</h2>
            <p style="color: #666; font-size: 16px; line-height: 1.6;">
              You have received a new booking for <strong>${data.serviceName}</strong>
            </p>

            <div style="background: linear-gradient(135deg, #fef3c7 0%, #fde68a 100%); border-radius: 12px; padding: 25px; margin: 25px 0; border-left: 4px solid #f97316;">
              <h3 style="color: #92400e; margin-top: 0; font-size: 18px;">📋 Booking Details</h3>
              <table style="width: 100%; border-collapse: collapse;">
                <tr>
                  <td style="padding: 8px 0; color: #78350f;">Customer:</td>
                  <td style="padding: 8px 0; color: #92400e; font-weight: bold; text-align: right;">${data.customerName}</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; color: #78350f;">Date:</td>
                  <td style="padding: 8px 0; color: #92400e; text-align: right;">${data.bookingDate}</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; color: #78350f;">Guests:</td>
                  <td style="padding: 8px 0; color: #92400e; text-align: right;">${data.guestCount || 1}</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; color: #78350f;">Amount:</td>
                  <td style="padding: 8px 0; color: #92400e; font-weight: bold; text-align: right;">${data.amount} ${data.currency || 'USD'}</td>
                </tr>
              </table>
            </div>

            <div style="text-align: center; margin: 30px 0;">
              <a href="https://recharge-travels-73e76.web.app/vendor/dashboard"
                 style="display: inline-block; background: linear-gradient(135deg, #f97316 0%, #ea580c 100%); color: #ffffff;
                        text-decoration: none; padding: 15px 35px; border-radius: 30px; font-weight: bold; font-size: 16px;">
                View Booking
              </a>
            </div>
          </div>

          <div style="background-color: #333; padding: 20px 30px; text-align: center;">
            <p style="color: #999; margin: 0; font-size: 12px;">
              © ${new Date().getFullYear()} Recharge Travels. All rights reserved.
            </p>
          </div>
        </div>
      </body>
      </html>
    `,
    text: `New Booking Alert!\n\nHello ${data.vendorName},\n\nYou have a new booking for ${data.serviceName}!\n\nCustomer: ${data.customerName}\nDate: ${data.bookingDate}\nGuests: ${data.guestCount || 1}\nAmount: ${data.amount} ${data.currency || 'USD'}\n\nView in dashboard: https://recharge-travels-73e76.web.app/vendor/dashboard`
  }),

  // Train Booking Confirmation Email Template
  trainBookingConfirmation: (data: any) => ({
    subject: `🚂 Train Booking Confirmed - ${data.bookingReference}`,
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
      </head>
      <body style="margin: 0; padding: 0; background-color: #f4f4f4; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;">
        <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff;">
          <!-- Header -->
          <div style="background: linear-gradient(135deg, #2563eb 0%, #059669 100%); padding: 30px; text-align: center;">
            <img src="https://www.rechargetravels.com/logo-v2.png" alt="Recharge Travels" style="height: 50px; margin-bottom: 10px;">
            <h1 style="color: #ffffff; margin: 0; font-size: 28px;">🚂 Booking Confirmed!</h1>
            <p style="color: #bfdbfe; margin: 10px 0 0;">Your Train Ticket is Ready</p>
          </div>

          <!-- Booking Reference -->
          <div style="background: linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%); padding: 25px; text-align: center; border-bottom: 3px solid #2563eb;">
            <p style="color: #6b7280; margin: 0; font-size: 12px; text-transform: uppercase; letter-spacing: 1px;">Booking Reference</p>
            <h2 style="color: #2563eb; margin: 10px 0 0; font-size: 32px; font-family: monospace;">${data.bookingReference}</h2>
          </div>

          <!-- Content -->
          <div style="padding: 30px;">
            <p style="color: #374151; font-size: 16px; margin-top: 0;">
              Dear <strong>${data.customerName}</strong>,
            </p>
            <p style="color: #6b7280; font-size: 15px; line-height: 1.6;">
              Thank you for booking with Recharge Travels! Your Sri Lanka Railways ticket has been confirmed.
            </p>

            <!-- Train Card -->
            <div style="background: #1f2937; border-radius: 12px; padding: 20px; margin: 25px 0; color: white;">
              <h3 style="margin: 0 0 5px; font-size: 20px;">${data.trainName}</h3>
              <p style="margin: 0; color: #9ca3af; font-size: 14px;">${data.trainNumber}</p>
            </div>

            <!-- Journey Details -->
            <div style="background: #f9fafb; border-radius: 12px; padding: 20px; margin: 20px 0;">
              <table style="width: 100%; border-collapse: collapse;">
                <tr>
                  <td style="text-align: center; padding: 15px; width: 40%;">
                    <p style="color: #2563eb; font-size: 12px; margin: 0 0 5px; text-transform: uppercase;">Departure</p>
                    <p style="color: #1f2937; font-size: 24px; font-weight: bold; margin: 0;">${data.departureTime}</p>
                    <p style="color: #6b7280; font-size: 14px; margin: 5px 0 0;">${data.departureStation}</p>
                  </td>
                  <td style="text-align: center; width: 20%;">
                    <p style="color: #059669; font-size: 24px;">→</p>
                  </td>
                  <td style="text-align: center; padding: 15px; width: 40%;">
                    <p style="color: #059669; font-size: 12px; margin: 0 0 5px; text-transform: uppercase;">Arrival</p>
                    <p style="color: #1f2937; font-size: 24px; font-weight: bold; margin: 0;">${data.arrivalTime}</p>
                    <p style="color: #6b7280; font-size: 14px; margin: 5px 0 0;">${data.arrivalStation}</p>
                  </td>
                </tr>
              </table>

              <div style="text-align: center; margin-top: 15px; padding-top: 15px; border-top: 1px solid #e5e7eb;">
                <span style="background: #dbeafe; color: #1e40af; padding: 8px 20px; border-radius: 20px; font-size: 14px; font-weight: 600;">
                  📅 ${data.travelDate}
                </span>
              </div>
            </div>

            <!-- Ticket Details -->
            <table style="width: 100%; margin: 20px 0; border-collapse: collapse;">
              <tr>
                <td style="padding: 12px; background: #f9fafb; border-radius: 8px 0 0 0;">
                  <p style="color: #6b7280; font-size: 12px; margin: 0;">Class</p>
                  <p style="color: #1f2937; font-size: 15px; font-weight: 600; margin: 5px 0 0;">${data.selectedClass}</p>
                </td>
                <td style="padding: 12px; background: #f9fafb; border-radius: 0 8px 0 0;">
                  <p style="color: #6b7280; font-size: 12px; margin: 0;">Passengers</p>
                  <p style="color: #1f2937; font-size: 15px; font-weight: 600; margin: 5px 0 0;">${data.passengers}</p>
                </td>
              </tr>
              <tr>
                <td colspan="2" style="padding: 12px; background: #ecfdf5; border-radius: 0 0 8px 8px;">
                  <p style="color: #059669; font-size: 12px; margin: 0;">Total Paid</p>
                  <p style="color: #059669; font-size: 22px; font-weight: bold; margin: 5px 0 0;">LKR ${data.totalPrice?.toLocaleString() || data.totalPrice}</p>
                </td>
              </tr>
            </table>

            <!-- CTA Button -->
            <div style="text-align: center; margin: 30px 0;">
              <a href="https://www.rechargetravels.com/transport/train-booking/confirmation/${data.bookingId}"
                 style="display: inline-block; background: linear-gradient(135deg, #2563eb 0%, #059669 100%); color: #ffffff;
                        text-decoration: none; padding: 15px 35px; border-radius: 8px; font-weight: bold; font-size: 16px;">
                View Your Ticket
              </a>
            </div>

            <!-- WhatsApp Share -->
            <div style="text-align: center; margin: 20px 0;">
              <a href="https://wa.me/${data.customerPhone?.replace(/\\D/g, '')}?text=${encodeURIComponent('🚂 Train Booking Confirmed!\\n\\nRef: ' + data.bookingReference + '\\nRoute: ' + data.departureStation + ' → ' + data.arrivalStation + '\\nDate: ' + data.travelDate + '\\nTime: ' + data.departureTime + '\\n\\nView: https://www.rechargetravels.com/transport/train-booking/confirmation/' + data.bookingId)}"
                 style="display: inline-block; background: #25D366; color: #ffffff;
                        text-decoration: none; padding: 12px 25px; border-radius: 8px; font-weight: 600; font-size: 14px;">
                📱 Save to WhatsApp
              </a>
            </div>

            <!-- Important Info -->
            <div style="background: #fffbeb; border: 1px solid #fcd34d; border-radius: 8px; padding: 20px; margin: 25px 0;">
              <h4 style="color: #92400e; margin: 0 0 10px; font-size: 16px;">⚠️ Important Information</h4>
              <ul style="color: #92400e; margin: 0; padding-left: 20px; font-size: 14px; line-height: 1.8;">
                <li>Arrive at the station at least 30 minutes before departure</li>
                <li>Carry a valid photo ID along with this confirmation</li>
                <li>Show this email (printed or on mobile) to station staff</li>
                <li>Your booking reference: <strong>${data.bookingReference}</strong></li>
              </ul>
            </div>
          </div>

          <!-- Contact Info -->
          <div style="background: #f9fafb; padding: 25px; text-align: center;">
            <p style="color: #6b7280; margin: 0 0 10px; font-size: 14px;">Need help? We're here for you!</p>
            <p style="margin: 5px 0;">
              📧 <a href="mailto:trains@rechargetravels.com" style="color: #2563eb; text-decoration: none;">trains@rechargetravels.com</a>
            </p>
            <p style="margin: 5px 0;">
              <a href="https://wa.me/94777721999" style="color: #25D366; text-decoration: none;">📱 WhatsApp: +94 77 772 1999</a>
            </p>
          </div>

          <!-- Footer -->
          <div style="background: #1f2937; padding: 20px; text-align: center;">
            <p style="color: #9ca3af; margin: 0; font-size: 12px;">
              © ${new Date().getFullYear()} Recharge Travels | Sri Lanka Railways Partner<br>
              <a href="https://www.rechargetravels.com" style="color: #60a5fa; text-decoration: none;">www.rechargetravels.com</a>
            </p>
          </div>
        </div>
      </body>
      </html>
    `,
    text: `
Train Booking Confirmation - ${data.bookingReference}

Dear ${data.customerName},

Your train ticket has been confirmed!

BOOKING DETAILS
===============
Reference: ${data.bookingReference}
Train: ${data.trainName} (${data.trainNumber})
Route: ${data.departureStation} → ${data.arrivalStation}
Date: ${data.travelDate}
Time: ${data.departureTime} - ${data.arrivalTime}
Class: ${data.selectedClass}
Passengers: ${data.passengers}
Total Paid: LKR ${data.totalPrice}

IMPORTANT
=========
• Arrive 30 minutes before departure
• Bring valid photo ID
• Show this confirmation at the station

View your ticket: https://www.rechargetravels.com/transport/train-booking/confirmation/${data.bookingId}

Need help? Contact us:
Email: trains@rechargetravels.com
WhatsApp: +94 77 772 1999

Thank you for booking with Recharge Travels!
    `
  }),

  // Train Booking Admin Notification
  trainBookingAdminNotification: (data: any) => ({
    subject: `🚂 New Train Booking - ${data.bookingReference}`,
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
      </head>
      <body style="margin: 0; padding: 0; background-color: #f4f4f4; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;">
        <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff;">
          <div style="background: linear-gradient(135deg, #1f2937 0%, #111827 100%); padding: 25px; text-align: center;">
            <h1 style="color: #ffffff; margin: 0; font-size: 22px;">🚂 New Train Booking Alert</h1>
          </div>

          <div style="padding: 25px;">
            <div style="background: #fef3c7; border-left: 4px solid #f59e0b; padding: 15px; margin-bottom: 20px;">
              <p style="margin: 0; color: #92400e; font-weight: bold;">Reference: ${data.bookingReference}</p>
            </div>

            <h3 style="color: #374151; margin-top: 0;">Customer Details</h3>
            <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
              <tr><td style="padding: 8px 0; color: #6b7280;">Name:</td><td style="padding: 8px 0; font-weight: 600;">${data.customerName}</td></tr>
              <tr><td style="padding: 8px 0; color: #6b7280;">Email:</td><td style="padding: 8px 0;">${data.customerEmail}</td></tr>
              <tr><td style="padding: 8px 0; color: #6b7280;">Phone:</td><td style="padding: 8px 0;">${data.customerPhone}</td></tr>
            </table>

            <h3 style="color: #374151;">Journey Details</h3>
            <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
              <tr><td style="padding: 8px 0; color: #6b7280;">Train:</td><td style="padding: 8px 0; font-weight: 600;">${data.trainName} (${data.trainNumber})</td></tr>
              <tr><td style="padding: 8px 0; color: #6b7280;">Route:</td><td style="padding: 8px 0;">${data.departureStation} → ${data.arrivalStation}</td></tr>
              <tr><td style="padding: 8px 0; color: #6b7280;">Date:</td><td style="padding: 8px 0;">${data.travelDate}</td></tr>
              <tr><td style="padding: 8px 0; color: #6b7280;">Time:</td><td style="padding: 8px 0;">${data.departureTime} - ${data.arrivalTime}</td></tr>
              <tr><td style="padding: 8px 0; color: #6b7280;">Class:</td><td style="padding: 8px 0;">${data.selectedClass}</td></tr>
              <tr><td style="padding: 8px 0; color: #6b7280;">Passengers:</td><td style="padding: 8px 0;">${data.passengers}</td></tr>
            </table>

            <div style="background: #ecfdf5; border-radius: 8px; padding: 15px; text-align: center;">
              <p style="color: #059669; margin: 0; font-size: 14px;">Total Amount</p>
              <p style="color: #059669; margin: 5px 0 0; font-size: 28px; font-weight: bold;">LKR ${data.totalPrice?.toLocaleString() || data.totalPrice}</p>
            </div>

            ${data.specialRequests ? `
            <div style="background: #fef3c7; border-radius: 8px; padding: 15px; margin-top: 15px;">
              <p style="color: #92400e; margin: 0; font-size: 14px;"><strong>Special Requests:</strong> ${data.specialRequests}</p>
            </div>
            ` : ''}
          </div>

          <div style="background: #f9fafb; padding: 20px; text-align: center;">
            <a href="https://wa.me/${data.customerPhone?.replace(/\\D/g, '')}"
               style="display: inline-block; background: #25D366; color: white; text-decoration: none; padding: 12px 25px; border-radius: 8px; margin: 5px;">
              WhatsApp Customer
            </a>
          </div>
        </div>
      </body>
      </html>
    `,
    text: `New Train Booking - ${data.bookingReference}\n\nCustomer: ${data.customerName}\nEmail: ${data.customerEmail}\nPhone: ${data.customerPhone}\n\nTrain: ${data.trainName} (${data.trainNumber})\nRoute: ${data.departureStation} → ${data.arrivalStation}\nDate: ${data.travelDate}\nTime: ${data.departureTime}\nClass: ${data.selectedClass}\nPassengers: ${data.passengers}\n\nTotal: LKR ${data.totalPrice}`
  }),

  // Global Tour Booking Confirmation Email
  globalTourBookingConfirmation: (data: any) => ({
    subject: `🌏 Tour Booking Confirmed - ${data.bookingReference}`,
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
      </head>
      <body style="margin: 0; padding: 0; background-color: #f5f5f5; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;">
        <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff;">
          <!-- Header -->
          <div style="background: linear-gradient(135deg, #0d5c46 0%, #0a4a38 100%); padding: 30px; text-align: center;">
            <img src="https://www.rechargetravels.com/logo-v2.png" alt="Recharge Travels" style="height: 50px; margin-bottom: 10px;">
            <h1 style="color: #ffffff; margin: 0; font-size: 28px;">🌏 Tour Booking Confirmed!</h1>
            <p style="color: #a7f3d0; margin: 10px 0 0;">Your Adventure Awaits!</p>
          </div>

          <!-- Content -->
          <div style="padding: 40px 30px;">
            <h2 style="color: #333; margin-top: 0;">Hello ${data.customerName}! 👋</h2>
            <p style="color: #666; font-size: 16px; line-height: 1.6;">
              Thank you for booking with Recharge Travels! We're thrilled to confirm your tour reservation. Get ready for an unforgettable experience!
            </p>

            <!-- Tour Details Card -->
            <div style="background: linear-gradient(135deg, #ecfdf5 0%, #d1fae5 100%); border-radius: 12px; padding: 25px; margin: 25px 0; border-left: 4px solid #0d5c46;">
              <h3 style="color: #0d5c46; margin-top: 0; font-size: 20px;">📋 Tour Details</h3>
              <p style="font-size: 18px; font-weight: bold; color: #0d5c46; margin: 10px 0;">${data.tourTitle}</p>
              <table style="width: 100%; border-collapse: collapse;">
                <tr>
                  <td style="padding: 10px 0; color: #666;">Booking Reference:</td>
                  <td style="padding: 10px 0; color: #0d5c46; font-weight: bold; text-align: right; font-family: monospace; font-size: 16px;">${data.bookingReference}</td>
                </tr>
                <tr>
                  <td style="padding: 10px 0; color: #666;">Duration:</td>
                  <td style="padding: 10px 0; color: #333; text-align: right;">${data.duration}</td>
                </tr>
                <tr>
                  <td style="padding: 10px 0; color: #666;">Travel Date:</td>
                  <td style="padding: 10px 0; color: #333; text-align: right;">${data.travelDate}</td>
                </tr>
                <tr>
                  <td style="padding: 10px 0; color: #666;">End Date:</td>
                  <td style="padding: 10px 0; color: #333; text-align: right;">${data.endDate}</td>
                </tr>
                <tr>
                  <td style="padding: 10px 0; color: #666;">Travelers:</td>
                  <td style="padding: 10px 0; color: #333; text-align: right;">${data.travelers}</td>
                </tr>
                <tr>
                  <td style="padding: 10px 0; color: #666;">Pickup Location:</td>
                  <td style="padding: 10px 0; color: #333; text-align: right;">${data.pickupLocation}</td>
                </tr>
                <tr style="border-top: 2px solid #0d5c46;">
                  <td style="padding: 15px 0 0; color: #333; font-weight: bold; font-size: 18px;">Total Amount:</td>
                  <td style="padding: 15px 0 0; color: #0d5c46; font-weight: bold; font-size: 24px; text-align: right;">$${data.totalAmount}</td>
                </tr>
              </table>
            </div>

            ${data.specialRequests ? `
            <div style="background-color: #fef3c7; border-radius: 8px; padding: 15px; margin: 20px 0; border-left: 4px solid #f59e0b;">
              <p style="color: #92400e; margin: 0;"><strong>📝 Special Requests:</strong></p>
              <p style="color: #78350f; margin: 10px 0 0;">${data.specialRequests}</p>
            </div>
            ` : ''}

            <!-- What's Next -->
            <div style="background-color: #eff6ff; border-radius: 12px; padding: 20px; margin: 25px 0;">
              <h4 style="color: #1e40af; margin: 0 0 15px;">📌 What Happens Next?</h4>
              <ul style="color: #1e3a8a; margin: 0; padding-left: 20px; line-height: 1.8;">
                <li>Our team will review your booking within 24 hours</li>
                <li>You'll receive a detailed itinerary and tour guide information</li>
                <li>Payment instructions will be shared shortly</li>
                <li>Feel free to reach out if you have any questions!</li>
              </ul>
            </div>

            <!-- CTA Button -->
            <div style="text-align: center; margin: 30px 0;">
              <a href="https://www.rechargetravels.com/booking/tour-confirmation/${data.bookingId}"
                 style="display: inline-block; background: linear-gradient(135deg, #0d5c46 0%, #0a4a38 100%); color: #ffffff;
                        text-decoration: none; padding: 15px 35px; border-radius: 30px; font-weight: bold; font-size: 16px;">
                View Booking Details
              </a>
            </div>
          </div>

          <!-- Contact Info -->
          <div style="background-color: #ecfdf5; padding: 25px 30px; text-align: center;">
            <p style="color: #666; margin: 0 0 10px; font-size: 14px;">Need help? Contact us anytime:</p>
            <p style="color: #333; margin: 0;">
              📧 <a href="mailto:info@rechargetravels.com" style="color: #0d5c46; text-decoration: none;">info@rechargetravels.com</a>
            </p>
            <p style="color: #333; margin: 10px 0 0;">
              <a href="https://wa.me/94777721999" style="color: #25D366; text-decoration: none;">📱 WhatsApp: +94 77 772 1999</a>
            </p>
          </div>

          <!-- Footer -->
          <div style="background-color: #0d5c46; padding: 20px 30px; text-align: center;">
            <p style="color: #a7f3d0; margin: 0; font-size: 12px;">
              © ${new Date().getFullYear()} Recharge Travels. All rights reserved.<br>
              Sri Lanka | <a href="https://www.rechargetravels.com" style="color: #f0b429; text-decoration: none;">www.rechargetravels.com</a>
            </p>
          </div>
        </div>
      </body>
      </html>
    `,
    text: `
Tour Booking Confirmed - ${data.bookingReference}

Hello ${data.customerName}!

Thank you for booking with Recharge Travels! Your tour has been confirmed.

Tour Details:
- Tour: ${data.tourTitle}
- Reference: ${data.bookingReference}
- Duration: ${data.duration}
- Travel Date: ${data.travelDate} to ${data.endDate}
- Travelers: ${data.travelers}
- Pickup: ${data.pickupLocation}
- Total: $${data.totalAmount}

Our team will contact you within 24 hours with your detailed itinerary.

Best regards,
Recharge Travels Team
    `
  }),

  // Global Tour Booking Admin Notification
  globalTourBookingAdminNotification: (data: any) => ({
    subject: `🌏 NEW Tour Booking - ${data.bookingReference} - ${data.tourTitle}`,
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
      </head>
      <body style="margin: 0; padding: 0; background-color: #f5f5f5; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;">
        <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff;">
          <!-- Header -->
          <div style="background: linear-gradient(135deg, #7c3aed 0%, #5b21b6 100%); padding: 25px; text-align: center;">
            <h1 style="color: #ffffff; margin: 0; font-size: 24px;">🌏 New Tour Booking!</h1>
            <p style="color: #e9d5ff; margin: 8px 0 0;">${data.bookingReference}</p>
          </div>

          <!-- Content -->
          <div style="padding: 30px;">
            <!-- Tour Info -->
            <div style="background: linear-gradient(135deg, #faf5ff 0%, #ede9fe 100%); border-radius: 12px; padding: 20px; margin-bottom: 20px; border-left: 4px solid #7c3aed;">
              <h3 style="color: #5b21b6; margin: 0 0 15px;">Tour Details</h3>
              <p style="font-size: 18px; font-weight: bold; color: #5b21b6; margin: 0 0 10px;">${data.tourTitle}</p>
              <table style="width: 100%; border-collapse: collapse;">
                <tr>
                  <td style="padding: 8px 0; color: #666;">Duration:</td>
                  <td style="padding: 8px 0; color: #333; text-align: right;">${data.duration}</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; color: #666;">Travel Date:</td>
                  <td style="padding: 8px 0; color: #333; text-align: right;">${data.travelDate} → ${data.endDate}</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; color: #666;">Travelers:</td>
                  <td style="padding: 8px 0; color: #333; text-align: right;">${data.travelers}</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; color: #666;">Pickup:</td>
                  <td style="padding: 8px 0; color: #333; text-align: right;">${data.pickupLocation}</td>
                </tr>
                <tr style="border-top: 2px solid #7c3aed;">
                  <td style="padding: 12px 0 0; color: #333; font-weight: bold;">Total:</td>
                  <td style="padding: 12px 0 0; color: #7c3aed; font-weight: bold; font-size: 22px; text-align: right;">$${data.totalAmount}</td>
                </tr>
              </table>
            </div>

            <!-- Customer Info -->
            <div style="background-color: #f0fdf4; border-radius: 12px; padding: 20px; margin-bottom: 20px; border-left: 4px solid #22c55e;">
              <h3 style="color: #15803d; margin: 0 0 15px;">Customer Information</h3>
              <table style="width: 100%; border-collapse: collapse;">
                <tr>
                  <td style="padding: 8px 0; color: #666;">Name:</td>
                  <td style="padding: 8px 0; color: #333; font-weight: bold; text-align: right;">${data.customerName}</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; color: #666;">Email:</td>
                  <td style="padding: 8px 0; text-align: right;"><a href="mailto:${data.customerEmail}" style="color: #15803d;">${data.customerEmail}</a></td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; color: #666;">Phone:</td>
                  <td style="padding: 8px 0; text-align: right;"><a href="tel:${data.customerPhone}" style="color: #15803d;">${data.customerPhone}</a></td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; color: #666;">Nationality:</td>
                  <td style="padding: 8px 0; color: #333; text-align: right;">${data.nationality}</td>
                </tr>
              </table>
            </div>

            ${data.specialRequests ? `
            <div style="background-color: #fef3c7; border-radius: 8px; padding: 15px; margin-bottom: 20px;">
              <p style="color: #92400e; margin: 0;"><strong>📝 Special Requests:</strong></p>
              <p style="color: #78350f; margin: 10px 0 0;">${data.specialRequests}</p>
            </div>
            ` : ''}

            ${data.flightDetails ? `
            <div style="background-color: #e0f2fe; border-radius: 8px; padding: 15px; margin-bottom: 20px;">
              <p style="color: #0369a1; margin: 0;"><strong>✈️ Flight Details:</strong></p>
              <p style="color: #0c4a6e; margin: 10px 0 0;">${data.flightDetails}</p>
            </div>
            ` : ''}

            <!-- Action Buttons -->
            <div style="text-align: center; margin: 25px 0;">
              <a href="https://recharge-travels-73e76.web.app/global-tour-bookings"
                 style="display: inline-block; background: linear-gradient(135deg, #7c3aed 0%, #5b21b6 100%); color: #ffffff;
                        text-decoration: none; padding: 12px 30px; border-radius: 25px; font-weight: bold; margin: 5px;">
                View in Admin
              </a>
              <a href="https://wa.me/${data.customerPhone?.replace(/\D/g, '')}?text=Hi%20${encodeURIComponent(data.customerName)}!%20Regarding%20your%20tour%20booking%20${data.bookingReference}..."
                 style="display: inline-block; background: #25D366; color: #ffffff;
                        text-decoration: none; padding: 12px 30px; border-radius: 25px; font-weight: bold; margin: 5px;">
                WhatsApp Customer
              </a>
            </div>
          </div>
        </div>
      </body>
      </html>
    `,
    text: `New Tour Booking - ${data.bookingReference}\n\nTour: ${data.tourTitle}\nDuration: ${data.duration}\nDates: ${data.travelDate} to ${data.endDate}\nTravelers: ${data.travelers}\nPickup: ${data.pickupLocation}\nTotal: $${data.totalAmount}\n\nCustomer: ${data.customerName}\nEmail: ${data.customerEmail}\nPhone: ${data.customerPhone}\nNationality: ${data.nationality}`
  })
};

// Send email using SendGrid
export const sendEmail = functions.https.onCall(async (data, context) => {
  const { to, subject, html, text, templateType, templateData } = data;

  try {
    let emailContent = { subject, html, text };

    // Use template if specified
    if (templateType && templateData && emailTemplates[templateType as keyof typeof emailTemplates]) {
      emailContent = emailTemplates[templateType as keyof typeof emailTemplates](templateData);
    }

    const msg = {
      to,
      from: {
        email: FROM_EMAIL,
        name: FROM_NAME
      },
      replyTo: REPLY_TO_EMAIL,
      subject: emailContent.subject,
      html: emailContent.html,
      text: emailContent.text,
    };

    await sgMail.send(msg);

    // Log email sent
    await db.collection('emailLogs').add({
      to,
      subject: emailContent.subject,
      templateType: templateType || 'custom',
      status: 'sent',
      sentAt: admin.firestore.FieldValue.serverTimestamp()
    });

    return { success: true, message: 'Email sent successfully' };
  } catch (error: any) {
    console.error('Error sending email:', error);

    // Log failed email
    await db.collection('emailLogs').add({
      to,
      subject,
      templateType: templateType || 'custom',
      status: 'failed',
      error: error.message,
      sentAt: admin.firestore.FieldValue.serverTimestamp()
    });

    throw new functions.https.HttpsError('internal', error.message);
  }
});

// Send WhatsApp message (placeholder for future integration)
export const sendWhatsAppMessage = functions.https.onCall(async (data, context) => {
  const { to, message } = data;

  try {
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

// Shared handler for booking confirmations
const handleBookingConfirmation = async (snap: functions.firestore.QueryDocumentSnapshot, context: functions.EventContext) => {
  const booking = snap.data();
  const bookingId = context.params.bookingId;

  try {
    // Handle various data structures from different booking forms
    const customerEmail = booking.personal_info?.email || booking.email || booking.customerEmail || booking.contactEmail || booking.user_email;

    let customerName = booking.name || booking.customerName || booking.user_name || 'Valued Customer';
    if (booking.personal_info) {
      customerName = `${booking.personal_info.firstName} ${booking.personal_info.lastName}`;
    } else if (booking.firstName && booking.lastName) {
      customerName = `${booking.firstName} ${booking.lastName}`;
    } else if (booking.contactName) {
      customerName = booking.contactName;
    }

    if (!customerEmail) {
      console.log('No customer email found for booking:', bookingId);
      return;
    }

    // Prepare template data
    const templateData = {
      customerName,
      confirmationNumber: booking.confirmation_number || booking.bookingRef || bookingId,
      bookingType: booking.booking_type || booking.type || booking.tourTitle || 'Travel Package',
      travelDate: booking.check_in_date || booking.tour_start_date || booking.pickup_date || booking.travel_date || booking.travelDate || booking.tourDate || booking.date || 'TBD',
      adults: booking.adults || booking.guests || 1,
      children: booking.children || 0,
      totalAmount: booking.total_price || booking.amount || booking.totalPrice || booking.totalAmountUSD || 0,
      currency: booking.currency || 'USD',
      specialRequests: booking.special_requests || booking.specialRequests || ''
    };

    // Send customer confirmation
    const customerTemplate = emailTemplates.bookingConfirmation(templateData);

    await sgMail.send({
      to: customerEmail,
      from: { email: FROM_EMAIL, name: FROM_NAME },
      replyTo: REPLY_TO_EMAIL,
      subject: customerTemplate.subject,
      html: customerTemplate.html,
      text: customerTemplate.text
    });

    // Send admin notification
    const adminTemplate = emailTemplates.adminNotification({
      type: 'Booking',
      customerName,
      customerEmail,
      phone: booking.personal_info?.phone || booking.phone || booking.customerPhone || booking.contactPhone,
      details: `
        <p><strong>Booking ID:</strong> ${templateData.confirmationNumber}</p>
        <p><strong>Type:</strong> ${templateData.bookingType}</p>
        <p><strong>Date:</strong> ${templateData.travelDate}</p>
        <p><strong>Guests:</strong> ${templateData.adults} Adults, ${templateData.children} Children</p>
        <p><strong>Amount:</strong> ${templateData.currency} ${templateData.totalAmount}</p>
        <p><strong>Status:</strong> ${booking.status || 'Pending'}</p>
        <p><strong>Payment:</strong> ${booking.payment_status || booking.paymentMethod || 'Pending'}</p>
      `,
      adminUrl: `https://recharge-travels-73e76.web.app/admin/bookings`
    });

    await sgMail.send({
      to: ADMIN_EMAIL,
      from: { email: FROM_EMAIL, name: FROM_NAME },
      subject: adminTemplate.subject,
      html: adminTemplate.html,
      text: adminTemplate.text
    });

    // Update booking with confirmation sent status
    await snap.ref.update({
      confirmationSent: true,
      confirmationSentAt: admin.firestore.FieldValue.serverTimestamp()
    });

    // Queue WhatsApp notification
    const phone = booking.personal_info?.phone || booking.phone || booking.customerPhone || booking.contactPhone;
    if (phone) {
      const message = `*Booking Confirmed!* 🎉\n\nRef: ${templateData.confirmationNumber}\nService: ${templateData.bookingType}\nDate: ${templateData.travelDate}\nAmount: ${templateData.currency} ${templateData.totalAmount}\n\nThank you for choosing Recharge Travels!`;

      await db.collection('whatsappMessages').add({
        to: phone,
        message: message,
        status: 'pending',
        type: 'booking_confirmation',
        bookingId: bookingId,
        createdAt: admin.firestore.FieldValue.serverTimestamp()
      });
      console.log('WhatsApp notification queued for:', bookingId);
    }

    console.log('Booking confirmation sent for:', bookingId);
  } catch (error) {
    console.error('Error sending booking confirmation:', error);
  }
};

// Trigger: Send booking confirmation when new booking is created
export const sendBookingConfirmation = functions.firestore
  .document('bookings/{bookingId}')
  .onCreate(handleBookingConfirmation);

export const sendCulturalBookingConfirmation = functions.firestore
  .document('cultural_bookings/{bookingId}')
  .onCreate(handleBookingConfirmation);

export const sendNationalParksBookingConfirmation = functions.firestore
  .document('nationalparks_bookings/{bookingId}')
  .onCreate(handleBookingConfirmation);

export const sendWildToursBookingConfirmation = functions.firestore
  .document('wildtours_bookings/{bookingId}')
  .onCreate(handleBookingConfirmation);

export const sendHillCountryBookingConfirmation = functions.firestore
  .document('hillcountry_bookings/{bookingId}')
  .onCreate(handleBookingConfirmation);

export const sendRamayanaBookingConfirmation = functions.firestore
  .document('ramayana_bookings/{bookingId}')
  .onCreate(handleBookingConfirmation);

export const sendBeachToursBookingConfirmation = functions.firestore
  .document('beach_bookings/{bookingId}')
  .onCreate(handleBookingConfirmation);

export const sendCulinaryBookingConfirmation = functions.firestore
  .document('culinary_bookings/{bookingId}')
  .onCreate(handleBookingConfirmation);

// Airport Transfer Booking Confirmation Handler
const handleAirportTransferConfirmation = async (snap: functions.firestore.QueryDocumentSnapshot, context: functions.EventContext) => {
  const booking = snap.data();
  const bookingId = context.params.bookingId;

  try {
    const customerEmail = booking.customerInfo?.email;
    const customerName = booking.customerInfo?.name || 'Valued Customer';

    if (!customerEmail) {
      console.log('No customer email found for airport transfer booking:', bookingId);
      return;
    }

    // Prepare template data for airport transfer
    const templateData = {
      customerName,
      confirmationNumber: booking.confirmationNumber || bookingId,
      pickupDate: booking.routeInfo?.date || 'TBD',
      pickupTime: booking.routeInfo?.time || 'TBD',
      pickupLocation: booking.routeInfo?.pickup || 'TBD',
      dropoffLocation: booking.routeInfo?.dropoff || 'TBD',
      distance: booking.routeInfo?.distance || '',
      duration: booking.routeInfo?.duration || '',
      vehicleType: booking.vehicleInfo?.vehicleName || booking.vehicleInfo?.vehicleType || 'Standard Vehicle',
      passengers: booking.vehicleInfo?.passengers || 1,
      luggage: booking.vehicleInfo?.luggage || 0,
      flightNumber: booking.flightInfo?.flightNumber || '',
      arrivalTime: booking.flightInfo?.arrivalTime || '',
      extras: booking.extras?.selectedExtras?.map((e: any) => e.name) || [],
      extrasTotal: booking.extras?.extrasTotal || 0,
      baseFare: booking.pricing?.baseFare || booking.pricing?.totalAmount || 0,
      totalAmount: booking.pricing?.totalAmount || 0,
      specialRequests: booking.customerInfo?.specialRequests || ''
    };

    // Send customer confirmation with airport transfer template
    const customerTemplate = emailTemplates.airportTransferConfirmation(templateData);

    await sgMail.send({
      to: customerEmail,
      from: { email: FROM_EMAIL, name: FROM_NAME },
      replyTo: REPLY_TO_EMAIL,
      subject: customerTemplate.subject,
      html: customerTemplate.html,
      text: customerTemplate.text
    });

    // Send admin notification
    const adminTemplate = emailTemplates.adminNotification({
      type: 'Airport Transfer Booking',
      customerName,
      customerEmail,
      phone: booking.customerInfo?.phone,
      details: `
        <p><strong>Booking ID:</strong> ${templateData.confirmationNumber}</p>
        <p><strong>Date:</strong> ${templateData.pickupDate} at ${templateData.pickupTime}</p>
        <p><strong>Route:</strong> ${templateData.pickupLocation} → ${templateData.dropoffLocation}</p>
        <p><strong>Distance:</strong> ${templateData.distance} | Duration: ${templateData.duration}</p>
        <p><strong>Vehicle:</strong> ${templateData.vehicleType}</p>
        <p><strong>Passengers:</strong> ${templateData.passengers} | Luggage: ${templateData.luggage} bags</p>
        ${templateData.flightNumber ? `<p><strong>Flight:</strong> ${templateData.flightNumber}</p>` : ''}
        <p><strong>Total Amount:</strong> $${templateData.totalAmount}</p>
        <p><strong>Payment:</strong> ${booking.paymentInfo?.method || 'Pending'}</p>
      `,
      adminUrl: `https://recharge-travels-73e76.web.app/admin/airport-transfers`
    });

    await sgMail.send({
      to: ADMIN_EMAIL,
      from: { email: FROM_EMAIL, name: FROM_NAME },
      subject: adminTemplate.subject,
      html: adminTemplate.html,
      text: adminTemplate.text
    });

    // Also send to info@rechargetravels.com
    await sgMail.send({
      to: 'info@rechargetravels.com',
      from: { email: FROM_EMAIL, name: FROM_NAME },
      subject: adminTemplate.subject,
      html: adminTemplate.html,
      text: adminTemplate.text
    });

    // Update booking with confirmation sent status
    await snap.ref.update({
      confirmationSent: true,
      confirmationSentAt: admin.firestore.FieldValue.serverTimestamp()
    });

    console.log('Airport transfer confirmation sent for:', bookingId);
  } catch (error) {
    console.error('Error sending airport transfer confirmation:', error);
  }
};

// Trigger: Send airport transfer confirmation when new booking is created
export const sendAirportTransferConfirmation = functions.firestore
  .document('airportTransferBookings/{bookingId}')
  .onCreate(handleAirportTransferConfirmation);

// ==========================================
// TRAIN BOOKING EMAIL & WHATSAPP CONFIRMATION
// ==========================================

// Handler for train booking confirmation
const handleTrainBookingConfirmation = async (snap: functions.firestore.QueryDocumentSnapshot, context: functions.EventContext) => {
  const booking = snap.data();
  const bookingId = context.params.bookingId;

  console.log('Processing train booking confirmation for:', bookingId);

  // Skip if already processed
  if (booking.emailSent) {
    console.log('Email already sent for booking:', bookingId);
    return;
  }

  try {
    // Prepare email data
    const emailData = {
      bookingId,
      bookingReference: booking.bookingReference || `TRN-${bookingId.slice(-8).toUpperCase()}`,
      trainName: booking.trainName || booking.train?.trainName || 'Sri Lanka Railways',
      trainNumber: booking.trainNumber || booking.train?.trainNumber || '',
      departureStation: booking.departureStation || booking.train?.departureStation || '',
      arrivalStation: booking.arrivalStation || booking.train?.arrivalStation || '',
      departureTime: booking.departureTime || booking.train?.departureTime || '',
      arrivalTime: booking.arrivalTime || booking.train?.arrivalTime || '',
      travelDate: booking.travelDate || booking.travelDetails?.travelDate || '',
      selectedClass: booking.selectedClass || booking.travelDetails?.ticketClass || '',
      passengers: booking.passengers || booking.travelDetails?.passengers || 1,
      totalPrice: booking.totalPrice || booking.pricing?.totalPrice || 0,
      customerName: booking.customerName || booking.customerInfo?.name || 'Valued Customer',
      customerEmail: booking.customerEmail || booking.customerInfo?.email || '',
      customerPhone: booking.customerPhone || booking.customerInfo?.phone || '',
      specialRequests: booking.specialRequests || booking.travelDetails?.specialRequests || ''
    };

    // Send customer confirmation email
    if (emailData.customerEmail) {
      const customerTemplate = emailTemplates.trainBookingConfirmation(emailData);

      await sgMail.send({
        to: emailData.customerEmail,
        from: { email: FROM_EMAIL, name: FROM_NAME },
        replyTo: REPLY_TO_EMAIL,
        subject: customerTemplate.subject,
        html: customerTemplate.html,
        text: customerTemplate.text
      });

      console.log('Train booking customer email sent to:', emailData.customerEmail);
    }

    // Send admin notification email
    const adminTemplate = emailTemplates.trainBookingAdminNotification(emailData);

    await sgMail.send({
      to: ADMIN_EMAIL,
      from: { email: FROM_EMAIL, name: FROM_NAME },
      subject: adminTemplate.subject,
      html: adminTemplate.html,
      text: adminTemplate.text
    });

    console.log('Train booking admin notification sent');

    // Update booking with email sent status
    await snap.ref.update({
      emailSent: true,
      emailSentAt: admin.firestore.FieldValue.serverTimestamp(),
      adminNotified: true,
      adminNotifiedAt: admin.firestore.FieldValue.serverTimestamp()
    });

    // Log email to emailLogs collection
    await db.collection('emailLogs').add({
      type: 'trainBookingConfirmation',
      bookingId,
      bookingReference: emailData.bookingReference,
      customerEmail: emailData.customerEmail,
      customerName: emailData.customerName,
      status: 'sent',
      sentAt: admin.firestore.FieldValue.serverTimestamp()
    });

    console.log('Train booking confirmation completed for:', bookingId);
  } catch (error: any) {
    console.error('Error sending train booking confirmation:', error);

    // Log error
    await db.collection('emailLogs').add({
      type: 'trainBookingConfirmation',
      bookingId,
      status: 'failed',
      error: error?.message || 'Unknown error',
      attemptedAt: admin.firestore.FieldValue.serverTimestamp()
    });
  }
};

// Trigger: Send train booking confirmation when new booking is created
export const sendTrainBookingConfirmation = functions.firestore
  .document('trainBookings/{bookingId}')
  .onCreate(handleTrainBookingConfirmation);

// Callable function to resend train booking confirmation
export const resendTrainBookingConfirmation = functions.https.onCall(async (data, context) => {
  const { bookingId } = data;

  if (!bookingId) {
    throw new functions.https.HttpsError('invalid-argument', 'Booking ID is required');
  }

  try {
    const bookingDoc = await db.collection('trainBookings').doc(bookingId).get();

    if (!bookingDoc.exists) {
      throw new functions.https.HttpsError('not-found', 'Booking not found');
    }

    const booking = bookingDoc.data()!;

    // Prepare email data
    const emailData = {
      bookingId,
      bookingReference: booking.bookingReference || `TRN-${bookingId.slice(-8).toUpperCase()}`,
      trainName: booking.trainName || booking.train?.trainName || 'Sri Lanka Railways',
      trainNumber: booking.trainNumber || booking.train?.trainNumber || '',
      departureStation: booking.departureStation || booking.train?.departureStation || '',
      arrivalStation: booking.arrivalStation || booking.train?.arrivalStation || '',
      departureTime: booking.departureTime || booking.train?.departureTime || '',
      arrivalTime: booking.arrivalTime || booking.train?.arrivalTime || '',
      travelDate: booking.travelDate || booking.travelDetails?.travelDate || '',
      selectedClass: booking.selectedClass || booking.travelDetails?.ticketClass || '',
      passengers: booking.passengers || booking.travelDetails?.passengers || 1,
      totalPrice: booking.totalPrice || booking.pricing?.totalPrice || 0,
      customerName: booking.customerName || booking.customerInfo?.name || 'Valued Customer',
      customerEmail: booking.customerEmail || booking.customerInfo?.email || '',
      customerPhone: booking.customerPhone || booking.customerInfo?.phone || '',
      specialRequests: booking.specialRequests || booking.travelDetails?.specialRequests || ''
    };

    if (!emailData.customerEmail) {
      throw new functions.https.HttpsError('failed-precondition', 'Customer email not found');
    }

    // Send email
    const customerTemplate = emailTemplates.trainBookingConfirmation(emailData);

    await sgMail.send({
      to: emailData.customerEmail,
      from: { email: FROM_EMAIL, name: FROM_NAME },
      replyTo: REPLY_TO_EMAIL,
      subject: customerTemplate.subject,
      html: customerTemplate.html,
      text: customerTemplate.text
    });

    // Update booking
    await bookingDoc.ref.update({
      emailResent: true,
      emailResentAt: admin.firestore.FieldValue.serverTimestamp()
    });

    return {
      success: true,
      message: `Confirmation email resent to ${emailData.customerEmail}`
    };
  } catch (error: any) {
    console.error('Error resending train booking confirmation:', error);
    throw new functions.https.HttpsError('internal', error?.message || 'Failed to resend email');
  }
});

// Generate WhatsApp message link for train booking
export const getTrainBookingWhatsAppLink = functions.https.onCall(async (data, context) => {
  const { bookingId } = data;

  if (!bookingId) {
    throw new functions.https.HttpsError('invalid-argument', 'Booking ID is required');
  }

  try {
    const bookingDoc = await db.collection('trainBookings').doc(bookingId).get();

    if (!bookingDoc.exists) {
      throw new functions.https.HttpsError('not-found', 'Booking not found');
    }

    const booking = bookingDoc.data()!;

    const message = `🚂 *Train Booking Confirmed!*

📋 *Reference:* ${booking.bookingReference || `TRN-${bookingId.slice(-8).toUpperCase()}`}

🚉 *Route:* ${booking.departureStation || booking.train?.departureStation} → ${booking.arrivalStation || booking.train?.arrivalStation}
🚂 *Train:* ${booking.trainName || booking.train?.trainName} (${booking.trainNumber || booking.train?.trainNumber})
📅 *Date:* ${booking.travelDate || booking.travelDetails?.travelDate}
⏰ *Time:* ${booking.departureTime || booking.train?.departureTime} - ${booking.arrivalTime || booking.train?.arrivalTime}
🎫 *Class:* ${booking.selectedClass || booking.travelDetails?.ticketClass}
👥 *Passengers:* ${booking.passengers || booking.travelDetails?.passengers}

💰 *Total:* LKR ${(booking.totalPrice || booking.pricing?.totalPrice)?.toLocaleString()}

📱 View ticket: https://www.rechargetravels.com/transport/train-booking/confirmation/${bookingId}

Thank you for booking with Recharge Travels! 🙏`;

    const customerPhone = (booking.customerPhone || booking.customerInfo?.phone || '').replace(/\D/g, '');

    return {
      success: true,
      whatsappUrl: `https://wa.me/${customerPhone}?text=${encodeURIComponent(message)}`,
      message
    };
  } catch (error: any) {
    console.error('Error generating WhatsApp link:', error);
    throw new functions.https.HttpsError('internal', error?.message || 'Failed to generate WhatsApp link');
  }
});

// Trigger: Send notification when new inquiry is created
export const sendBookingNotification = functions.firestore
  .document('inquiries/{inquiryId}')
  .onCreate(async (snap, context) => {
    const inquiry = snap.data();
    const inquiryId = context.params.inquiryId;

    try {
      const customerEmail = inquiry.email;
      const customerName = inquiry.name || 'Valued Customer';

      // Send customer auto-reply
      if (customerEmail) {
        const customerTemplate = emailTemplates.inquiryReply({
          customerName,
          subject: inquiry.subject,
          message: inquiry.message
        });

        await sgMail.send({
          to: customerEmail,
          from: { email: FROM_EMAIL, name: FROM_NAME },
          replyTo: REPLY_TO_EMAIL,
          subject: customerTemplate.subject,
          html: customerTemplate.html,
          text: customerTemplate.text
        });
      }

      // Send admin notification
      const adminTemplate = emailTemplates.adminNotification({
        type: 'Inquiry',
        customerName,
        customerEmail: customerEmail || 'Not provided',
        phone: inquiry.phone,
        details: `
          <p><strong>Subject:</strong> ${inquiry.subject || 'General Inquiry'}</p>
          <p><strong>Type:</strong> ${inquiry.inquiry_type || 'general'}</p>
          <p><strong>Message:</strong></p>
          <p style="white-space: pre-wrap; background: #f8f9fa; padding: 15px; border-radius: 8px;">${inquiry.message}</p>
        `,
        adminUrl: `https://recharge-travels-73e76.web.app/admin/inquiries/${inquiryId}`
      });

      await sgMail.send({
        to: ADMIN_EMAIL,
        from: { email: FROM_EMAIL, name: FROM_NAME },
        subject: adminTemplate.subject,
        html: adminTemplate.html,
        text: adminTemplate.text
      });

      // Update inquiry with reply sent status
      await snap.ref.update({
        autoReplySent: true,
        autoReplySentAt: admin.firestore.FieldValue.serverTimestamp()
      });

      console.log('Inquiry notification sent for:', inquiryId);
    } catch (error) {
      console.error('Error sending inquiry notification:', error);
    }
  });

// Send welcome email when new user signs up
export const sendWelcomeEmail = functions.firestore
  .document('users/{userId}')
  .onCreate(async (snap, context) => {
    const user = snap.data();

    try {
      if (!user.email) {
        console.log('No email for user:', context.params.userId);
        return;
      }

      const template = emailTemplates.welcomeEmail({
        customerName: user.displayName || user.firstName || 'Traveler'
      });

      await sgMail.send({
        to: user.email,
        from: { email: FROM_EMAIL, name: FROM_NAME },
        replyTo: REPLY_TO_EMAIL,
        subject: template.subject,
        html: template.html,
        text: template.text
      });

      console.log('Welcome email sent to:', user.email);
    } catch (error) {
      console.error('Error sending welcome email:', error);
    }
  });

// Send booking reminder (scheduled function)
export const sendBookingReminders = functions.pubsub
  .schedule('every day 09:00')
  .timeZone('Asia/Colombo')
  .onRun(async (context) => {
    try {
      const threeDaysFromNow = new Date();
      threeDaysFromNow.setDate(threeDaysFromNow.getDate() + 3);
      const threeDaysString = threeDaysFromNow.toISOString().split('T')[0];

      // Get bookings with travel date in 3 days
      const bookingsRef = db.collection('bookings');
      const snapshot = await bookingsRef
        .where('status', '==', 'confirmed')
        .where('reminderSent', '!=', true)
        .get();

      for (const doc of snapshot.docs) {
        const booking = doc.data();
        const travelDate = booking.check_in_date || booking.tour_start_date || booking.travel_date;

        if (travelDate === threeDaysString) {
          const customerEmail = booking.personal_info?.email || booking.email;
          const customerName = booking.personal_info
            ? `${booking.personal_info.firstName} ${booking.personal_info.lastName}`
            : booking.name;

          if (customerEmail) {
            const template = emailTemplates.bookingReminder({
              customerName: customerName || 'Traveler',
              destination: booking.destination || 'Sri Lanka',
              daysUntil: 3
            });

            await sgMail.send({
              to: customerEmail,
              from: { email: FROM_EMAIL, name: FROM_NAME },
              replyTo: REPLY_TO_EMAIL,
              subject: template.subject,
              html: template.html,
              text: template.text
            });

            await doc.ref.update({
              reminderSent: true,
              reminderSentAt: admin.firestore.FieldValue.serverTimestamp()
            });

            console.log('Reminder sent for booking:', doc.id);
          }
        }
      }
    } catch (error) {
      console.error('Error sending booking reminders:', error);
    }
  });

// Newsletter subscription - send welcome email
export const sendNewsletterWelcome = functions.firestore
  .document('newsletter_subscribers/{subscriberId}')
  .onCreate(async (snap, context) => {
    const subscriber = snap.data();

    try {
      if (!subscriber.email) {
        console.log('No email for subscriber:', context.params.subscriberId);
        return;
      }

      const template = emailTemplates.newsletterWelcome({
        subscriberName: subscriber.name || subscriber.firstName || '',
        email: subscriber.email
      });

      await sgMail.send({
        to: subscriber.email,
        from: { email: FROM_EMAIL, name: FROM_NAME },
        replyTo: REPLY_TO_EMAIL,
        subject: template.subject,
        html: template.html,
        text: template.text
      });

      // Update subscriber with welcome email sent status
      await snap.ref.update({
        welcomeEmailSent: true,
        welcomeEmailSentAt: admin.firestore.FieldValue.serverTimestamp()
      });

      // Log the email
      await db.collection('emailLogs').add({
        to: subscriber.email,
        subject: template.subject,
        templateType: 'newsletterWelcome',
        status: 'sent',
        sentAt: admin.firestore.FieldValue.serverTimestamp()
      });

      console.log('Newsletter welcome email sent to:', subscriber.email);
    } catch (error) {
      console.error('Error sending newsletter welcome email:', error);
    }
  });

// Notify subscribers when new blog post is published
export const notifyBlogSubscribers = functions.firestore
  .document('blogs/{blogId}')
  .onUpdate(async (change, context) => {
    const before = change.before.data();
    const after = change.after.data();
    const blogId = context.params.blogId;

    // Only send if post just became published
    if (before.status !== 'published' && after.status === 'published') {
      try {
        // Get all active subscribers
        const subscribersSnapshot = await db.collection('newsletter_subscribers')
          .where('is_active', '==', true)
          .where('blog_notifications', '!=', false) // Include those who haven't opted out
          .get();

        if (subscribersSnapshot.empty) {
          console.log('No active subscribers for blog notification');
          return;
        }

        const blogData = {
          id: blogId,
          title: after.title,
          slug: after.slug || blogId,
          excerpt: after.excerpt || after.content?.substring(0, 200),
          featuredImage: after.featuredImage || after.featured_image,
          author: typeof after.author === 'string' ? after.author : after.author?.name || 'Recharge Travels',
          readingTime: after.readingTime || after.reading_time || 5
        };

        // Send to all subscribers (batch to avoid rate limits)
        const subscribers = subscribersSnapshot.docs.map(doc => doc.data());
        let sentCount = 0;

        for (const subscriber of subscribers) {
          try {
            const template = emailTemplates.newBlogPost({
              ...blogData,
              email: subscriber.email
            });

            await sgMail.send({
              to: subscriber.email,
              from: { email: FROM_EMAIL, name: FROM_NAME },
              replyTo: REPLY_TO_EMAIL,
              subject: template.subject,
              html: template.html,
              text: template.text
            });

            sentCount++;

            // Add small delay to avoid rate limiting
            await new Promise(resolve => setTimeout(resolve, 100));
          } catch (emailError) {
            console.error(`Failed to send to ${subscriber.email}:`, emailError);
          }
        }

        // Log notification stats
        await db.collection('blog_notifications').add({
          blogId,
          title: after.title,
          totalSubscribers: subscribers.length,
          sentCount,
          sentAt: admin.firestore.FieldValue.serverTimestamp()
        });

        console.log(`Blog notification sent to ${sentCount}/${subscribers.length} subscribers for: ${after.title}`);
      } catch (error) {
        console.error('Error sending blog notifications:', error);
      }
    }
  });

// Handle newsletter subscription via callable function
export const subscribeNewsletter = functions.https.onCall(async (data, context) => {
  const { email, name, source, interests } = data;

  if (!email) {
    throw new functions.https.HttpsError('invalid-argument', 'Email is required');
  }

  try {
    // Optional Redis-based rate limiting: per-email and per-IP counters
    try {
      if (redis) {
        const ipHeader = context.rawRequest && (context.rawRequest.headers['x-forwarded-for'] || (context.rawRequest as any).ip);
        const ip = ipHeader ? String(ipHeader).split(',')[0].trim() : 'unknown';
        const emailKey = `newsletter:email:${email.toLowerCase()}`;
        const ipKey = `newsletter:ip:${ip}`;
        const RATE_LIMIT_WINDOW = 60; // seconds
        const MAX_EMAIL_PER_WINDOW = 5; // allow 5 attempts per email per minute
        const MAX_IP_PER_WINDOW = 100; // allow 100 attempts per IP per minute

        const emailCount = await redis.incr(emailKey);
        if (emailCount === 1) await redis.expire(emailKey, RATE_LIMIT_WINDOW);
        if (emailCount > MAX_EMAIL_PER_WINDOW) {
          throw new functions.https.HttpsError('resource-exhausted', 'Too many subscription attempts for this email. Try again later.');
        }

        const ipCount = await redis.incr(ipKey);
        if (ipCount === 1) await redis.expire(ipKey, RATE_LIMIT_WINDOW);
        if (ipCount > MAX_IP_PER_WINDOW) {
          throw new functions.https.HttpsError('resource-exhausted', 'Too many requests from this IP. Try again later.');
        }
      }
    } catch (rlErr: any) {
      // If Redis reports rate limit HttpsError, rethrow. For other Redis errors, log and continue.
      if (rlErr && rlErr.code === 'resource-exhausted') throw rlErr;
      console.warn('Redis rate-limit check error (continuing):', rlErr?.message || rlErr);
    }

    // Check if already subscribed
    const existingQuery = await db.collection('newsletter_subscribers')
      .where('email', '==', email.toLowerCase())
      .get();

    if (!existingQuery.empty) {
      const existingDoc = existingQuery.docs[0];
      const existingData = existingDoc.data();

      // If previously unsubscribed, reactivate
      if (!existingData.is_active) {
        await existingDoc.ref.update({
          is_active: true,
          resubscribed_at: admin.firestore.FieldValue.serverTimestamp(),
          name: name || existingData.name,
          interests: interests || existingData.interests
        });

        // Send welcome email for resubscribers
        const template = emailTemplates.newsletterWelcome({
          subscriberName: name || '',
          email: email.toLowerCase()
        });

        await sgMail.send({
          to: email.toLowerCase(),
          from: { email: FROM_EMAIL, name: FROM_NAME },
          replyTo: REPLY_TO_EMAIL,
          subject: template.subject,
          html: template.html,
          text: template.text
        });

        return { success: true, message: 'Welcome back! You have been resubscribed.' };
      }

      return { success: false, message: 'Email is already subscribed' };
    }

    // Create new subscriber
    await db.collection('newsletter_subscribers').add({
      email: email.toLowerCase(),
      name: name || '',
      source: source || 'website',
      interests: interests || [],
      is_active: true,
      blog_notifications: true,
      subscribed_at: admin.firestore.FieldValue.serverTimestamp()
    });

    // After successfully creating, set a cooldown key to discourage immediate retries
    try {
      if (redis) {
        const cooldownKey = `newsletter:cooldown:${email.toLowerCase()}`;
        await redis.set(cooldownKey, '1', 'EX', 300); // 5 minute cooldown
      }
    } catch (coolErr: any) {
      console.warn('Failed to set cooldown key in Redis:', coolErr?.message || coolErr);
    }

    return { success: true, message: 'Successfully subscribed to newsletter!' };
  } catch (error: any) {
    console.error('Newsletter subscription error:', error);
    throw new functions.https.HttpsError('internal', error.message);
  }
});

// Handle newsletter unsubscription
export const unsubscribeNewsletter = functions.https.onCall(async (data, context) => {
  const { email } = data;

  if (!email) {
    throw new functions.https.HttpsError('invalid-argument', 'Email is required');
  }

  try {
    const existingQuery = await db.collection('newsletter_subscribers')
      .where('email', '==', email.toLowerCase())
      .get();

    if (existingQuery.empty) {
      return { success: false, message: 'Email not found in our subscriber list' };
    }

    const subscriberDoc = existingQuery.docs[0];
    await subscriberDoc.ref.update({
      is_active: false,
      unsubscribed_at: admin.firestore.FieldValue.serverTimestamp()
    });

    return { success: true, message: 'You have been unsubscribed from our newsletter' };
  } catch (error: any) {
    console.error('Newsletter unsubscription error:', error);
    throw new functions.https.HttpsError('internal', error.message);
  }
});

// Get newsletter stats (admin only)
export const getNewsletterStats = functions.https.onCall(async (data, context) => {
  try {
    const subscribersSnapshot = await db.collection('newsletter_subscribers').get();
    const subscribers = subscribersSnapshot.docs.map(doc => doc.data());

    const now = new Date();
    const thisMonthStart = new Date(now.getFullYear(), now.getMonth(), 1);

    return {
      success: true,
      stats: {
        total: subscribers.length,
        active: subscribers.filter(s => s.is_active).length,
        unsubscribed: subscribers.filter(s => !s.is_active).length,
        thisMonth: subscribers.filter(s => {
          const subDate = s.subscribed_at?.toDate?.() || new Date(s.subscribed_at);
          return subDate >= thisMonthStart;
        }).length,
        bySource: subscribers.reduce((acc: any, s) => {
          const source = s.source || 'unknown';
          acc[source] = (acc[source] || 0) + 1;
          return acc;
        }, {})
      }
    };
  } catch (error: any) {
    console.error('Get newsletter stats error:', error);
    throw new functions.https.HttpsError('internal', error.message);
  }
});

// ===== DRIVER ONBOARDING NOTIFICATIONS =====

// Helper to format tier names
const formatTierName = (tier: string) => {
  const tierNames: Record<string, string> = {
    chauffeur_guide: 'Chauffeur Tourist Guide (SLTDA)',
    national_guide: 'National Tourist Guide',
    tourist_driver: 'SLITHM Tourist Driver',
    freelance_driver: 'Freelance Driver'
  };
  return tierNames[tier] || tier?.replace(/_/g, ' ') || 'Driver';
};

// Trigger: Send notification when new driver application is submitted
export const onDriverApplicationSubmitted = functions.firestore
  .document('drivers/{driverId}')
  .onCreate(async (snap, context) => {
    const driver = snap.data();
    const driverId = context.params.driverId;

    try {
      if (!driver.email) {
        console.log('No email for driver:', driverId);
        return;
      }

      // Send confirmation to driver
      const driverTemplate = emailTemplates.driverApplicationSubmitted({
        driverName: driver.full_name || 'Driver',
        tier: formatTierName(driver.tier),
        vehicleInfo: driver.vehicle_make_model || driver.vehicle_type || '',
        submittedAt: new Date().toLocaleDateString('en-US', {
          weekday: 'long',
          year: 'numeric',
          month: 'long',
          day: 'numeric'
        })
      });

      await sgMail.send({
        to: driver.email,
        from: { email: FROM_EMAIL, name: FROM_NAME },
        replyTo: 'info@rechargetravels.com',
        subject: driverTemplate.subject,
        html: driverTemplate.html,
        text: driverTemplate.text
      });

      // Send admin notification
      const adminTemplate = emailTemplates.adminNotification({
        type: 'Driver Application',
        customerName: driver.full_name || 'New Driver',
        customerEmail: driver.email,
        phone: driver.phone,
        details: `
          <p><strong>Driver ID:</strong> ${driverId}</p>
          <p><strong>Tier:</strong> ${formatTierName(driver.tier)}</p>
          <p><strong>Experience:</strong> ${driver.years_experience || 0} years</p>
          <p><strong>Vehicle:</strong> ${driver.vehicle_make_model || 'Not specified'}</p>
          <p><strong>SLTDA:</strong> ${driver.sltda_license_number || 'N/A'}</p>
          <p><strong>Status:</strong> ${driver.current_status}</p>
        `,
        adminUrl: `https://recharge-travels-admin.web.app/drivers/${driverId}`
      });

      await sgMail.send({
        to: ADMIN_EMAIL,
        from: { email: FROM_EMAIL, name: FROM_NAME },
        subject: adminTemplate.subject,
        html: adminTemplate.html,
        text: adminTemplate.text
      });

      // Log to application history
      await db.collection('driver_application_history').add({
        driver_id: driverId,
        status: 'submitted',
        previous_status: null,
        changed_by: 'system',
        notes: 'Application submitted',
        created_at: admin.firestore.FieldValue.serverTimestamp()
      });

      console.log('Driver application notification sent for:', driverId);
    } catch (error) {
      console.error('Error sending driver application notification:', error);
    }
  });

// Trigger: Send notification when driver status changes
export const onDriverStatusChange = functions.firestore
  .document('drivers/{driverId}')
  .onUpdate(async (change, context) => {
    const before = change.before.data();
    const after = change.after.data();
    const driverId = context.params.driverId;

    // Check if status changed
    if (before.current_status === after.current_status) {
      return;
    }

    try {
      if (!after.email) {
        console.log('No email for driver:', driverId);
        return;
      }

      // Log status change to history
      await db.collection('driver_application_history').add({
        driver_id: driverId,
        status: after.current_status,
        previous_status: before.current_status,
        changed_by: after.verified_by_admin_id || 'system',
        notes: after.rejection_reason || after.suspension_reason || `Status changed to ${after.current_status}`,
        verification_level: after.verified_level,
        created_at: admin.firestore.FieldValue.serverTimestamp()
      });

      // Handle approval
      if (after.current_status === 'verified' && before.current_status !== 'verified') {
        const approvedTemplate = emailTemplates.driverApplicationApproved({
          driverName: after.full_name || 'Driver',
          tier: formatTierName(after.tier),
          verificationLevel: after.verified_level || 1,
          isSltdaApproved: after.is_sltda_approved || false
        });

        await sgMail.send({
          to: after.email,
          from: { email: FROM_EMAIL, name: FROM_NAME },
          replyTo: 'info@rechargetravels.com',
          subject: approvedTemplate.subject,
          html: approvedTemplate.html,
          text: approvedTemplate.text
        });

        console.log('Driver approval notification sent for:', driverId);
      }

      // Handle rejection/suspension
      if ((after.current_status === 'suspended' || after.current_status === 'inactive') &&
        before.current_status !== 'suspended' && before.current_status !== 'inactive') {
        const rejectedTemplate = emailTemplates.driverApplicationRejected({
          driverName: after.full_name || 'Driver',
          rejectionReason: after.rejection_reason || after.suspension_reason || 'Application could not be verified'
        });

        await sgMail.send({
          to: after.email,
          from: { email: FROM_EMAIL, name: FROM_NAME },
          replyTo: 'info@rechargetravels.com',
          subject: rejectedTemplate.subject,
          html: rejectedTemplate.html,
          text: rejectedTemplate.text
        });

        console.log('Driver rejection notification sent for:', driverId);
      }
    } catch (error) {
      console.error('Error sending driver status change notification:', error);
    }
  });

// Scheduled: Check for expiring driver documents and send reminders
export const checkDriverDocumentExpiry = functions.pubsub
  .schedule('every day 08:00')
  .timeZone('Asia/Colombo')
  .onRun(async () => {
    try {
      const driversRef = db.collection('drivers');
      const verifiedDrivers = await driversRef
        .where('current_status', '==', 'verified')
        .get();

      const now = new Date();
      const thirtyDaysFromNow = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);

      const documentFields = [
        { field: 'sltda_license_expiry', name: 'SLTDA License' },
        { field: 'police_clearance_expiry', name: 'Police Clearance' },
        { field: 'medical_report_expiry', name: 'Medical Report' }
      ];

      for (const driverDoc of verifiedDrivers.docs) {
        const driver = driverDoc.data();

        if (!driver.email) continue;

        for (const docType of documentFields) {
          const expiryDate = driver[docType.field];
          if (!expiryDate) continue;

          const expiry = new Date(expiryDate);
          const daysRemaining = Math.ceil((expiry.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));

          // Send reminder if expiring within 30 days and not already reminded this week
          if (expiry <= thirtyDaysFromNow && expiry > now) {
            // Check if reminder was already sent this week
            const reminderKey = `expiry_reminder_${driverDoc.id}_${docType.field}`;
            const lastReminder = await db.collection('email_reminders').doc(reminderKey).get();

            if (lastReminder.exists) {
              const lastSent = lastReminder.data()?.sent_at?.toDate();
              if (lastSent && (now.getTime() - lastSent.getTime()) < 7 * 24 * 60 * 60 * 1000) {
                continue; // Skip if reminded within last 7 days
              }
            }

            const template = emailTemplates.driverDocumentExpiring({
              driverName: driver.full_name || 'Driver',
              documentType: docType.name,
              expiryDate: new Date(expiryDate).toLocaleDateString('en-US', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              }),
              daysRemaining
            });

            await sgMail.send({
              to: driver.email,
              from: { email: FROM_EMAIL, name: FROM_NAME },
              replyTo: 'info@rechargetravels.com',
              subject: template.subject,
              html: template.html,
              text: template.text
            });

            // Record that reminder was sent
            await db.collection('email_reminders').doc(reminderKey).set({
              driver_id: driverDoc.id,
              document_type: docType.field,
              sent_at: admin.firestore.FieldValue.serverTimestamp()
            });

            console.log(`Document expiry reminder sent to ${driver.email} for ${docType.name}`);
          }
        }
      }
    } catch (error) {
      console.error('Error checking driver document expiry:', error);
    }
  });

// Callable: Manually send driver verification email (for admin panel)
export const sendDriverVerificationEmail = functions.https.onCall(async (data) => {
  const { driverId, templateType, customMessage } = data;

  try {
    const driverDoc = await db.collection('drivers').doc(driverId).get();

    if (!driverDoc.exists) {
      throw new functions.https.HttpsError('not-found', 'Driver not found');
    }

    const driver = driverDoc.data()!;

    if (!driver.email) {
      throw new functions.https.HttpsError('invalid-argument', 'Driver has no email address');
    }

    let template;
    switch (templateType) {
      case 'approved':
        template = emailTemplates.driverApplicationApproved({
          driverName: driver.full_name || 'Driver',
          tier: formatTierName(driver.tier),
          verificationLevel: driver.verified_level || 1,
          isSltdaApproved: driver.is_sltda_approved || false
        });
        break;
      case 'rejected':
        template = emailTemplates.driverApplicationRejected({
          driverName: driver.full_name || 'Driver',
          rejectionReason: customMessage || driver.rejection_reason || 'Application could not be verified'
        });
        break;
      default:
        throw new functions.https.HttpsError('invalid-argument', 'Invalid template type');
    }

    await sgMail.send({
      to: driver.email,
      from: { email: FROM_EMAIL, name: FROM_NAME },
      replyTo: 'info@rechargetravels.com',
      subject: template.subject,
      html: template.html,
      text: template.text
    });

    // Log email sent
    await db.collection('emailLogs').add({
      to: driver.email,
      subject: template.subject,
      templateType: `driver_${templateType}`,
      driver_id: driverId,
      status: 'sent',
      sentAt: admin.firestore.FieldValue.serverTimestamp()
    });

    return { success: true, message: `Email sent to ${driver.email}` };
  } catch (error: any) {
    console.error('Error sending driver verification email:', error);
    throw new functions.https.HttpsError('internal', error.message);
  }
});

// ==========================================
// GLOBAL TOUR BOOKING FUNCTIONS
// ==========================================

// Handler for global tour booking confirmation
const handleGlobalTourBookingConfirmation = async (snap: functions.firestore.QueryDocumentSnapshot, context: functions.EventContext) => {
  const booking = snap.data();
  const bookingId = context.params.bookingId;

  console.log('Processing global tour booking confirmation for:', bookingId);

  // Skip if already processed
  if (booking.emailConfirmationSent) {
    console.log('Email already sent for booking:', bookingId);
    return;
  }

  try {
    // Prepare email data
    const emailData = {
      bookingId,
      bookingReference: booking.bookingReference || `RT-${bookingId.slice(-8).toUpperCase()}`,
      tourTitle: booking.tourTitle || 'Sri Lanka Tour',
      duration: booking.tourDuration ? `${booking.tourDuration.days} Days / ${booking.tourDuration.nights} Nights` : '',
      travelDate: booking.travelDate || '',
      endDate: booking.endDate || '',
      travelers: `${booking.travelers?.adults || 1} Adults${booking.travelers?.children ? `, ${booking.travelers.children} Children` : ''}${booking.travelers?.infants ? `, ${booking.travelers.infants} Infants` : ''}`,
      pickupLocation: booking.pickupLocation || '',
      totalAmount: (booking.payment?.totalAmountUSD || 0).toLocaleString(),
      customerName: booking.customer ? `${booking.customer.firstName} ${booking.customer.lastName}` : 'Valued Customer',
      customerEmail: booking.customer?.email || '',
      customerPhone: booking.customer?.phone || '',
      nationality: booking.customer?.nationality || '',
      specialRequests: booking.additionalNotes || '',
      flightDetails: booking.flightDetails || ''
    };

    // Send customer confirmation email
    if (emailData.customerEmail) {
      const customerTemplate = emailTemplates.globalTourBookingConfirmation(emailData);

      await sgMail.send({
        to: emailData.customerEmail,
        from: { email: FROM_EMAIL, name: FROM_NAME },
        replyTo: REPLY_TO_EMAIL,
        subject: customerTemplate.subject,
        html: customerTemplate.html,
        text: customerTemplate.text
      });

      console.log('Global tour booking customer email sent to:', emailData.customerEmail);
    }

    // Send admin notification email
    const adminTemplate = emailTemplates.globalTourBookingAdminNotification(emailData);

    await sgMail.send({
      to: ADMIN_EMAIL,
      from: { email: FROM_EMAIL, name: FROM_NAME },
      subject: adminTemplate.subject,
      html: adminTemplate.html,
      text: adminTemplate.text
    });

    console.log('Global tour booking admin notification sent');

    // Update booking with email sent status
    await snap.ref.update({
      emailConfirmationSent: true,
      emailConfirmationSentAt: admin.firestore.FieldValue.serverTimestamp(),
      adminNotified: true,
      adminNotifiedAt: admin.firestore.FieldValue.serverTimestamp()
    });

    // Log email to emailLogs collection
    await db.collection('emailLogs').add({
      type: 'globalTourBookingConfirmation',
      bookingId,
      bookingReference: emailData.bookingReference,
      customerEmail: emailData.customerEmail,
      customerName: emailData.customerName,
      tourTitle: emailData.tourTitle,
      status: 'sent',
      sentAt: admin.firestore.FieldValue.serverTimestamp()
    });

    console.log('Global tour booking confirmation completed for:', bookingId);
  } catch (error: any) {
    console.error('Error sending global tour booking confirmation:', error);

    // Log error
    await db.collection('emailLogs').add({
      type: 'globalTourBookingConfirmation',
      bookingId,
      status: 'failed',
      error: error?.message || 'Unknown error',
      attemptedAt: admin.firestore.FieldValue.serverTimestamp()
    });
  }
};

// Trigger: Send global tour booking confirmation when new booking is created
export const sendGlobalTourBookingConfirmation = functions.firestore
  .document('globalTourBookings/{bookingId}')
  .onCreate(handleGlobalTourBookingConfirmation);

// Callable function to resend global tour booking confirmation
export const resendGlobalTourBookingConfirmation = functions.https.onCall(async (data, context) => {
  const { bookingId } = data;

  if (!bookingId) {
    throw new functions.https.HttpsError('invalid-argument', 'Booking ID is required');
  }

  try {
    const bookingDoc = await db.collection('globalTourBookings').doc(bookingId).get();

    if (!bookingDoc.exists) {
      throw new functions.https.HttpsError('not-found', 'Booking not found');
    }

    const booking = bookingDoc.data()!;

    // Prepare email data
    const emailData = {
      bookingId,
      bookingReference: booking.bookingReference || `RT-${bookingId.slice(-8).toUpperCase()}`,
      tourTitle: booking.tourTitle || 'Sri Lanka Tour',
      duration: booking.tourDuration ? `${booking.tourDuration.days} Days / ${booking.tourDuration.nights} Nights` : '',
      travelDate: booking.travelDate || '',
      endDate: booking.endDate || '',
      travelers: `${booking.travelers?.adults || 1} Adults${booking.travelers?.children ? `, ${booking.travelers.children} Children` : ''}${booking.travelers?.infants ? `, ${booking.travelers.infants} Infants` : ''}`,
      pickupLocation: booking.pickupLocation || '',
      totalAmount: (booking.payment?.totalAmountUSD || 0).toLocaleString(),
      customerName: booking.customer ? `${booking.customer.firstName} ${booking.customer.lastName}` : 'Valued Customer',
      customerEmail: booking.customer?.email || '',
      customerPhone: booking.customer?.phone || '',
      nationality: booking.customer?.nationality || '',
      specialRequests: booking.additionalNotes || '',
      flightDetails: booking.flightDetails || ''
    };

    if (!emailData.customerEmail) {
      throw new functions.https.HttpsError('failed-precondition', 'Customer email not found');
    }

    // Send email
    const customerTemplate = emailTemplates.globalTourBookingConfirmation(emailData);

    await sgMail.send({
      to: emailData.customerEmail,
      from: { email: FROM_EMAIL, name: FROM_NAME },
      replyTo: REPLY_TO_EMAIL,
      subject: customerTemplate.subject,
      html: customerTemplate.html,
      text: customerTemplate.text
    });

    // Update booking
    await bookingDoc.ref.update({
      emailResent: true,
      emailResentAt: admin.firestore.FieldValue.serverTimestamp()
    });

    return {
      success: true,
      message: `Confirmation email resent to ${emailData.customerEmail}`
    };
  } catch (error: any) {
    console.error('Error resending global tour booking confirmation:', error);
    throw new functions.https.HttpsError('internal', error?.message || 'Failed to resend email');
  }
});

// Generate WhatsApp message link for global tour booking
export const getGlobalTourBookingWhatsAppLink = functions.https.onCall(async (data, context) => {
  const { bookingId } = data;

  if (!bookingId) {
    throw new functions.https.HttpsError('invalid-argument', 'Booking ID is required');
  }

  try {
    const bookingDoc = await db.collection('globalTourBookings').doc(bookingId).get();

    if (!bookingDoc.exists) {
      throw new functions.https.HttpsError('not-found', 'Booking not found');
    }

    const booking = bookingDoc.data()!;

    const message = `🌏 *Tour Booking Confirmed!*

📋 *Reference:* ${booking.bookingReference || `RT-${bookingId.slice(-8).toUpperCase()}`}

🎯 *Tour:* ${booking.tourTitle}
📅 *Dates:* ${booking.travelDate} → ${booking.endDate}
⏱️ *Duration:* ${booking.tourDuration?.days || 0} Days / ${booking.tourDuration?.nights || 0} Nights
👥 *Travelers:* ${booking.travelers?.adults || 1} Adults${booking.travelers?.children ? `, ${booking.travelers.children} Children` : ''}
📍 *Pickup:* ${booking.pickupLocation}

💰 *Total:* $${(booking.payment?.totalAmountUSD || 0).toLocaleString()}

📱 View details: https://www.rechargetravels.com/booking/tour-confirmation/${bookingId}

Thank you for booking with Recharge Travels! 🙏`;

    const customerPhone = (booking.customer?.phone || booking.customer?.whatsappNumber || '').replace(/\D/g, '');

    return {
      success: true,
      whatsappUrl: `https://wa.me/${customerPhone}?text=${encodeURIComponent(message)}`,
      message
    };
  } catch (error: any) {
    console.error('Error generating WhatsApp link:', error);
    throw new functions.https.HttpsError('internal', error?.message || 'Failed to generate WhatsApp link');
  }
});

// ==================== EMAIL QUEUE PROCESSOR ====================
// Universal email template for queued emails
const universalEmailTemplate = (data: any) => {
  const templateType = data.template || data.templateId || 'booking_confirmation';
  const templateData = data.data || data.dynamicData || data;
  
  // Base template wrapper
  const wrapInTemplate = (title: string, content: string, color: string = '#10b981') => `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin: 0; padding: 0; background-color: #f5f5f5; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;">
  <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff;">
    <!-- Header -->
    <div style="background: linear-gradient(135deg, ${color} 0%, ${adjustColor(color, -20)} 100%); padding: 30px; text-align: center;">
      <img src="https://rechargetravels.com/images/logo.png" alt="Recharge Travels" style="height: 60px; margin-bottom: 15px;">
      <h1 style="color: #ffffff; margin: 0; font-size: 24px;">${title}</h1>
    </div>
    
    <!-- Content -->
    <div style="padding: 40px 30px;">
      ${content}
    </div>
    
    <!-- Contact Info -->
    <div style="background-color: #f0fdf4; padding: 25px 30px; text-align: center;">
      <p style="color: #666; margin: 0 0 10px; font-size: 14px;">Need help? Contact us:</p>
      <p style="color: #333; margin: 0;">
        📧 <a href="mailto:info@rechargetravels.com" style="color: ${color}; text-decoration: none;">info@rechargetravels.com</a>
      </p>
      <p style="color: #333; margin: 10px 0 0;">
        <a href="https://wa.me/94773401305" style="color: #25D366; text-decoration: none;">📱 WhatsApp: +94 77 340 1305</a>
      </p>
    </div>
    
    <!-- Footer -->
    <div style="background-color: #1f2937; padding: 20px 30px; text-align: center;">
      <p style="color: #9ca3af; margin: 0; font-size: 12px;">
        © ${new Date().getFullYear()} Recharge Travels (Pvt) Ltd. All rights reserved.<br>
        Sri Lanka | <a href="https://www.rechargetravels.com" style="color: ${color}; text-decoration: none;">www.rechargetravels.com</a>
      </p>
    </div>
  </div>
</body>
</html>`;

  // Generate content based on template type
  switch (templateType) {
    case 'booking_confirmation':
    case 'tour_booking':
      return {
        subject: data.subject || `✅ Booking Confirmed - ${templateData.booking_ref || templateData.bookingRef || 'Your Booking'}`,
        html: wrapInTemplate('🎉 Booking Confirmed!', `
          <p style="color: #374151; font-size: 16px; line-height: 1.6;">
            Dear ${templateData.customer_name || templateData.customerName || 'Valued Customer'},
          </p>
          <p style="color: #374151; font-size: 16px; line-height: 1.6;">
            Thank you for booking with Recharge Travels! Your Sri Lanka adventure has been confirmed.
          </p>
          
          <div style="background: linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%); border-radius: 12px; padding: 25px; margin: 25px 0; border-left: 4px solid #10b981;">
            <h3 style="color: #065f46; margin-top: 0;">📋 Booking Details</h3>
            <table style="width: 100%; border-collapse: collapse;">
              <tr>
                <td style="padding: 8px 0; color: #6b7280;">Reference:</td>
                <td style="padding: 8px 0; color: #047857; font-weight: bold; text-align: right;">${templateData.booking_ref || templateData.bookingRef || 'N/A'}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; color: #6b7280;">Tour:</td>
                <td style="padding: 8px 0; color: #374151; text-align: right;">${templateData.tour_title || templateData.tourTitle || 'Sri Lanka Tour'}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; color: #6b7280;">Date:</td>
                <td style="padding: 8px 0; color: #374151; text-align: right;">${templateData.travel_date || templateData.travelDate || 'TBD'}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; color: #6b7280;">Travelers:</td>
                <td style="padding: 8px 0; color: #374151; text-align: right;">${templateData.travellers || templateData.travelers || '2'} person(s)</td>
              </tr>
              ${templateData.pickup_location ? `
              <tr>
                <td style="padding: 8px 0; color: #6b7280;">Pickup:</td>
                <td style="padding: 8px 0; color: #374151; text-align: right;">${templateData.pickup_location}</td>
              </tr>` : ''}
              <tr style="border-top: 2px solid #d1fae5;">
                <td style="padding: 12px 0 0; color: #374151; font-weight: bold;">Total:</td>
                <td style="padding: 12px 0 0; color: #059669; font-weight: bold; font-size: 20px; text-align: right;">$${templateData.total_amount || templateData.totalAmount || '0'}</td>
              </tr>
            </table>
          </div>
          
          <p style="color: #6b7280; font-size: 14px;">
            Our team will contact you within 24 hours to finalize details. You can also reach us on WhatsApp for instant assistance.
          </p>
        `)
      };

    case 'train_booking_confirmation':
      return {
        subject: data.subject || `🚂 Train Booking Confirmed - ${templateData.bookingReference}`,
        html: wrapInTemplate('🚂 Train Booking Confirmed!', `
          <p style="color: #374151; font-size: 16px; line-height: 1.6;">
            Dear ${templateData.customerName || 'Valued Customer'},
          </p>
          <p style="color: #374151; font-size: 16px; line-height: 1.6;">
            Your scenic train journey in Sri Lanka has been booked successfully!
          </p>
          
          <div style="background: linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%); border-radius: 12px; padding: 25px; margin: 25px 0; border-left: 4px solid #3b82f6;">
            <h3 style="color: #1e40af; margin-top: 0;">🎫 Train Details</h3>
            <table style="width: 100%; border-collapse: collapse;">
              <tr>
                <td style="padding: 8px 0; color: #6b7280;">Booking Ref:</td>
                <td style="padding: 8px 0; color: #1d4ed8; font-weight: bold; text-align: right;">${templateData.bookingReference}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; color: #6b7280;">Train:</td>
                <td style="padding: 8px 0; color: #374151; text-align: right;">${templateData.trainName} (${templateData.trainNumber || ''})</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; color: #6b7280;">Route:</td>
                <td style="padding: 8px 0; color: #374151; text-align: right;">${templateData.departureStation} → ${templateData.arrivalStation}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; color: #6b7280;">Date:</td>
                <td style="padding: 8px 0; color: #374151; text-align: right;">${templateData.formattedDate || templateData.travelDate}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; color: #6b7280;">Time:</td>
                <td style="padding: 8px 0; color: #374151; text-align: right;">${templateData.departureTime} - ${templateData.arrivalTime}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; color: #6b7280;">Class:</td>
                <td style="padding: 8px 0; color: #374151; text-align: right;">${templateData.selectedClass}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; color: #6b7280;">Passengers:</td>
                <td style="padding: 8px 0; color: #374151; text-align: right;">${templateData.passengers}</td>
              </tr>
              <tr style="border-top: 2px solid #bfdbfe;">
                <td style="padding: 12px 0 0; color: #374151; font-weight: bold;">Total:</td>
                <td style="padding: 12px 0 0; color: #2563eb; font-weight: bold; font-size: 20px; text-align: right;">$${templateData.totalPrice}</td>
              </tr>
            </table>
          </div>
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="${templateData.confirmationUrl || 'https://www.rechargetravels.com'}" style="display: inline-block; background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%); color: #ffffff; text-decoration: none; padding: 15px 35px; border-radius: 30px; font-weight: bold;">
              View Booking Details
            </a>
          </div>
        `, '#3b82f6')
      };

    case 'vehicle_booking':
    case 'vehicle_rental_confirmation':
      return {
        subject: data.subject || `🚗 Vehicle Rental Confirmed - ${templateData.bookingReference}`,
        html: wrapInTemplate('🚗 Vehicle Rental Confirmed!', `
          <p style="color: #374151; font-size: 16px; line-height: 1.6;">
            Dear ${templateData.customerName || 'Valued Customer'},
          </p>
          <p style="color: #374151; font-size: 16px; line-height: 1.6;">
            Your vehicle rental has been confirmed. Here are your booking details:
          </p>
          
          <div style="background: linear-gradient(135deg, #fef3c7 0%, #fde68a 100%); border-radius: 12px; padding: 25px; margin: 25px 0; border-left: 4px solid #f59e0b;">
            <h3 style="color: #92400e; margin-top: 0;">🚙 Rental Details</h3>
            <table style="width: 100%; border-collapse: collapse;">
              <tr>
                <td style="padding: 8px 0; color: #6b7280;">Booking Ref:</td>
                <td style="padding: 8px 0; color: #b45309; font-weight: bold; text-align: right;">${templateData.bookingReference}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; color: #6b7280;">Vehicle:</td>
                <td style="padding: 8px 0; color: #374151; text-align: right;">${templateData.vehicleName || templateData.vehicle}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; color: #6b7280;">Pickup:</td>
                <td style="padding: 8px 0; color: #374151; text-align: right;">${templateData.pickupDate} @ ${templateData.pickupTime || ''}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; color: #6b7280;">Return:</td>
                <td style="padding: 8px 0; color: #374151; text-align: right;">${templateData.returnDate} @ ${templateData.returnTime || ''}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; color: #6b7280;">Location:</td>
                <td style="padding: 8px 0; color: #374151; text-align: right;">${templateData.pickupLocation || 'TBD'}</td>
              </tr>
              <tr style="border-top: 2px solid #fcd34d;">
                <td style="padding: 12px 0 0; color: #374151; font-weight: bold;">Total:</td>
                <td style="padding: 12px 0 0; color: #d97706; font-weight: bold; font-size: 20px; text-align: right;">$${templateData.totalPrice || templateData.total}</td>
              </tr>
            </table>
          </div>
        `, '#f59e0b')
      };

    case 'admin_new_booking':
      return {
        subject: data.subject || `🔔 New Booking: ${templateData.booking_ref} - ${templateData.tour_title}`,
        html: wrapInTemplate('🔔 New Booking Received!', `
          <div style="background: #fef2f2; border-radius: 12px; padding: 25px; margin: 25px 0; border-left: 4px solid #ef4444;">
            <h3 style="color: #991b1b; margin-top: 0;">⚡ Action Required</h3>
            <p style="color: #7f1d1d;">New booking received - please process within 24 hours.</p>
          </div>
          
          <table style="width: 100%; border-collapse: collapse;">
            <tr>
              <td style="padding: 8px 0; color: #6b7280;">Reference:</td>
              <td style="padding: 8px 0; color: #374151; font-weight: bold; text-align: right;">${templateData.booking_ref}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; color: #6b7280;">Tour:</td>
              <td style="padding: 8px 0; color: #374151; text-align: right;">${templateData.tour_title}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; color: #6b7280;">Customer:</td>
              <td style="padding: 8px 0; color: #374151; text-align: right;">${templateData.customer_name}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; color: #6b7280;">Email:</td>
              <td style="padding: 8px 0; color: #374151; text-align: right;">${templateData.customer_email}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; color: #6b7280;">Phone:</td>
              <td style="padding: 8px 0; color: #374151; text-align: right;">${templateData.customer_phone}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; color: #6b7280;">Date:</td>
              <td style="padding: 8px 0; color: #374151; text-align: right;">${templateData.travel_date}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; color: #6b7280;">Travelers:</td>
              <td style="padding: 8px 0; color: #374151; text-align: right;">${templateData.travellers}</td>
            </tr>
            <tr style="border-top: 2px solid #e5e7eb;">
              <td style="padding: 12px 0 0; color: #374151; font-weight: bold;">Total:</td>
              <td style="padding: 12px 0 0; color: #059669; font-weight: bold; font-size: 20px; text-align: right;">$${templateData.total_amount}</td>
            </tr>
          </table>
        `, '#ef4444')
      };

    default:
      return {
        subject: data.subject || 'Recharge Travels Notification',
        html: wrapInTemplate('Notification', `
          <p style="color: #374151; font-size: 16px; line-height: 1.6;">
            ${JSON.stringify(templateData, null, 2).replace(/\n/g, '<br>')}
          </p>
        `)
      };
  }
};

// Helper function to adjust color brightness
function adjustColor(hex: string, percent: number): string {
  const num = parseInt(hex.replace('#', ''), 16);
  const amt = Math.round(2.55 * percent);
  const R = (num >> 16) + amt;
  const G = (num >> 8 & 0x00FF) + amt;
  const B = (num & 0x0000FF) + amt;
  return '#' + (0x1000000 + (R < 255 ? R < 1 ? 0 : R : 255) * 0x10000 +
    (G < 255 ? G < 1 ? 0 : G : 255) * 0x100 +
    (B < 255 ? B < 1 ? 0 : B : 255)).toString(16).slice(1);
}

// Process pending emails from emailQueue collection
export const processEmailQueue = functions.firestore
  .document('emailQueue/{emailId}')
  .onCreate(async (snap, context) => {
    const emailData = snap.data();
    const emailId = context.params.emailId;

    console.log(`Processing email ${emailId}:`, emailData.to, emailData.template || emailData.templateId);

    if (!SENDGRID_API_KEY || !SENDGRID_API_KEY.startsWith('SG.')) {
      console.error('SendGrid API key not configured');
      await snap.ref.update({ status: 'failed', error: 'SendGrid not configured', processedAt: admin.firestore.FieldValue.serverTimestamp() });
      return;
    }

    try {
      const template = universalEmailTemplate(emailData);
      
      await sgMail.send({
        to: emailData.to,
        from: { email: FROM_EMAIL, name: FROM_NAME },
        replyTo: REPLY_TO_EMAIL,
        subject: template.subject,
        html: template.html
      });

      await snap.ref.update({
        status: 'sent',
        sentAt: admin.firestore.FieldValue.serverTimestamp()
      });

      console.log(`Email sent successfully to ${emailData.to}`);
    } catch (error: any) {
      console.error(`Failed to send email ${emailId}:`, error);
      await snap.ref.update({
        status: 'failed',
        error: error?.message || 'Unknown error',
        processedAt: admin.firestore.FieldValue.serverTimestamp()
      });
    }
  });

// Process pending emails from whatsappQueue for WhatsApp notifications
export const processWhatsAppQueue = functions.firestore
  .document('whatsappQueue/{messageId}')
  .onCreate(async (snap, context) => {
    const messageData = snap.data();
    const messageId = context.params.messageId;

    console.log(`Processing WhatsApp message ${messageId} to ${messageData.to}`);

    try {
      // Store in whatsappMessages collection for the existing WhatsApp function
      await db.collection('whatsappMessages').add({
        ...messageData,
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
        fromQueue: messageId
      });

      await snap.ref.update({
        status: 'processed',
        processedAt: admin.firestore.FieldValue.serverTimestamp()
      });

      console.log(`WhatsApp message queued for ${messageData.to}`);
    } catch (error: any) {
      console.error(`Failed to process WhatsApp ${messageId}:`, error);
      await snap.ref.update({
        status: 'failed',
        error: error?.message || 'Unknown error',
        processedAt: admin.firestore.FieldValue.serverTimestamp()
      });
    }
  });

// Property Listing Email Templates
const propertyListingEmailTemplates = {
  confirmation: (data: { ownerName: string; propertyName: string; listingId: string }) => ({
    subject: `Property Listing Received - ${data.propertyName}`,
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <style>
          body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; margin: 0; padding: 0; background-color: #f8fafc; }
          .container { max-width: 600px; margin: 0 auto; background: white; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.1); }
          .header { background: linear-gradient(135deg, #0d9488 0%, #059669 100%); padding: 40px 30px; text-align: center; }
          .header h1 { color: white; margin: 0; font-size: 28px; }
          .content { padding: 40px 30px; }
          .highlight-box { background: #f0fdfa; border-left: 4px solid #14b8a6; padding: 20px; margin: 20px 0; border-radius: 8px; }
          .steps { margin: 30px 0; }
          .step { display: flex; align-items: flex-start; margin-bottom: 16px; }
          .step-number { background: #14b8a6; color: white; width: 28px; height: 28px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: bold; margin-right: 12px; flex-shrink: 0; }
          .footer { background: #f1f5f9; padding: 30px; text-align: center; color: #64748b; font-size: 14px; }
          .btn { display: inline-block; background: linear-gradient(135deg, #0d9488 0%, #059669 100%); color: white; padding: 14px 32px; text-decoration: none; border-radius: 30px; font-weight: 600; margin: 20px 0; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🏨 Application Received!</h1>
          </div>
          <div class="content">
            <p>Dear <strong>${data.ownerName}</strong>,</p>
            <p>Thank you for submitting your property <strong>"${data.propertyName}"</strong> to Recharge Travels! We're excited to review your listing.</p>
            
            <div class="highlight-box">
              <strong>Your Reference ID:</strong> ${data.listingId}
              <br><br>
              Please save this ID for future reference.
            </div>

            <h3>What happens next?</h3>
            <div class="steps">
              <div class="step">
                <div class="step-number">1</div>
                <div>Our team will review your property details within 24-48 hours.</div>
              </div>
              <div class="step">
                <div class="step-number">2</div>
                <div>We may contact you for additional information or verification.</div>
              </div>
              <div class="step">
                <div class="step-number">3</div>
                <div>Once approved, your property will be live on our platform!</div>
              </div>
            </div>

            <p>If you have any questions, feel free to reach out to us.</p>
            
            <p style="margin-top: 30px;">
              Best regards,<br>
              <strong>The Recharge Travels Team</strong>
            </p>
          </div>
          <div class="footer">
            <p>Recharge Travels | Sri Lanka's Premier Travel Partner</p>
            <p>📞 +94 77 772 1999 | ✉️ info@rechargetravels.com</p>
          </div>
        </div>
      </body>
      </html>
    `
  }),

  approved: (data: { ownerName: string; propertyName: string; listingId: string }) => ({
    subject: `🎉 Property Approved - ${data.propertyName}`,
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <style>
          body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; margin: 0; padding: 0; background-color: #f8fafc; }
          .container { max-width: 600px; margin: 0 auto; background: white; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.1); }
          .header { background: linear-gradient(135deg, #059669 0%, #10b981 100%); padding: 40px 30px; text-align: center; }
          .header h1 { color: white; margin: 0; font-size: 28px; }
          .content { padding: 40px 30px; }
          .success-box { background: #ecfdf5; border: 2px solid #10b981; padding: 20px; margin: 20px 0; border-radius: 12px; text-align: center; }
          .footer { background: #f1f5f9; padding: 30px; text-align: center; color: #64748b; font-size: 14px; }
          .btn { display: inline-block; background: linear-gradient(135deg, #059669 0%, #10b981 100%); color: white; padding: 14px 32px; text-decoration: none; border-radius: 30px; font-weight: 600; margin: 20px 0; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🎉 Congratulations!</h1>
          </div>
          <div class="content">
            <p>Dear <strong>${data.ownerName}</strong>,</p>
            
            <div class="success-box">
              <h2 style="color: #059669; margin: 0 0 10px 0;">Your Property is Now Live!</h2>
              <p style="margin: 0; color: #065f46;"><strong>"${data.propertyName}"</strong> has been approved and is now visible to travelers worldwide.</p>
            </div>

            <p>Your property is now part of Sri Lanka's premier luxury travel network. Here's what you can expect:</p>
            <ul>
              <li>Access to high-value international travelers</li>
              <li>Professional marketing and promotion</li>
              <li>Secure booking and payment processing</li>
              <li>Dedicated partner support</li>
            </ul>

            <p style="text-align: center;">
              <a href="https://rechargetravels.com/hotels" class="btn">View Your Listing</a>
            </p>

            <p>Welcome to the Recharge Travels family!</p>
            
            <p style="margin-top: 30px;">
              Best regards,<br>
              <strong>The Recharge Travels Team</strong>
            </p>
          </div>
          <div class="footer">
            <p>Recharge Travels | Sri Lanka's Premier Travel Partner</p>
            <p>📞 +94 77 772 1999 | ✉️ info@rechargetravels.com</p>
          </div>
        </div>
      </body>
      </html>
    `
  }),

  rejected: (data: { ownerName: string; propertyName: string; listingId: string; reason?: string }) => ({
    subject: `Property Listing Update - ${data.propertyName}`,
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <style>
          body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; margin: 0; padding: 0; background-color: #f8fafc; }
          .container { max-width: 600px; margin: 0 auto; background: white; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.1); }
          .header { background: linear-gradient(135deg, #64748b 0%, #475569 100%); padding: 40px 30px; text-align: center; }
          .header h1 { color: white; margin: 0; font-size: 28px; }
          .content { padding: 40px 30px; }
          .info-box { background: #fef3c7; border-left: 4px solid #f59e0b; padding: 20px; margin: 20px 0; border-radius: 8px; }
          .footer { background: #f1f5f9; padding: 30px; text-align: center; color: #64748b; font-size: 14px; }
          .btn { display: inline-block; background: linear-gradient(135deg, #0d9488 0%, #059669 100%); color: white; padding: 14px 32px; text-decoration: none; border-radius: 30px; font-weight: 600; margin: 20px 0; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Listing Update</h1>
          </div>
          <div class="content">
            <p>Dear <strong>${data.ownerName}</strong>,</p>
            <p>Thank you for your interest in partnering with Recharge Travels. After reviewing your property <strong>"${data.propertyName}"</strong>, we were unable to approve it at this time.</p>
            
            ${data.reason ? `
            <div class="info-box">
              <strong>Reason:</strong><br>
              ${data.reason}
            </div>
            ` : ''}

            <p>This doesn't mean you can't try again! Here are some tips to improve your listing:</p>
            <ul>
              <li>Add high-quality, well-lit photos of your property</li>
              <li>Provide a detailed and accurate description</li>
              <li>Ensure all required documents are valid and readable</li>
              <li>Verify your contact information is correct</li>
            </ul>

            <p style="text-align: center;">
              <a href="https://rechargetravels.com/list-property" class="btn">Resubmit Your Property</a>
            </p>

            <p>If you have questions or need assistance, please don't hesitate to contact us.</p>
            
            <p style="margin-top: 30px;">
              Best regards,<br>
              <strong>The Recharge Travels Team</strong>
            </p>
          </div>
          <div class="footer">
            <p>Recharge Travels | Sri Lanka's Premier Travel Partner</p>
            <p>📞 +94 77 772 1999 | ✉️ info@rechargetravels.com</p>
          </div>
        </div>
      </body>
      </html>
    `
  })
};

// Cloud Function to send property listing emails
export const sendPropertyListingEmail = functions.https.onCall(async (data, context) => {
  const { type, listingId, ownerEmail, ownerName, propertyName, reason } = data;

  if (!ownerEmail || !ownerName || !propertyName || !listingId) {
    throw new functions.https.HttpsError('invalid-argument', 'Missing required fields');
  }

  if (!SENDGRID_API_KEY || !SENDGRID_API_KEY.startsWith('SG.')) {
    console.warn('SendGrid API key not configured, skipping email');
    return { success: false, message: 'Email service not configured' };
  }

  let template;
  switch (type) {
    case 'confirmation':
      template = propertyListingEmailTemplates.confirmation({ ownerName, propertyName, listingId });
      break;
    case 'approved':
      template = propertyListingEmailTemplates.approved({ ownerName, propertyName, listingId });
      break;
    case 'rejected':
      template = propertyListingEmailTemplates.rejected({ ownerName, propertyName, listingId, reason });
      break;
    default:
      throw new functions.https.HttpsError('invalid-argument', 'Invalid email type');
  }

  try {
    await sgMail.send({
      to: ownerEmail,
      from: { email: FROM_EMAIL, name: FROM_NAME },
      replyTo: REPLY_TO_EMAIL,
      subject: template.subject,
      html: template.html
    });

    // Also notify admin for new listings
    if (type === 'confirmation') {
      await sgMail.send({
        to: ADMIN_EMAIL,
        from: { email: FROM_EMAIL, name: FROM_NAME },
        subject: `🏨 New Property Listing: ${propertyName}`,
        html: `
          <p>A new property has been submitted for review:</p>
          <ul>
            <li><strong>Property:</strong> ${propertyName}</li>
            <li><strong>Owner:</strong> ${ownerName}</li>
            <li><strong>Email:</strong> ${ownerEmail}</li>
            <li><strong>Listing ID:</strong> ${listingId}</li>
          </ul>
          <p><a href="https://recharge-travels-admin.web.app/property-listings">Review in Admin Panel</a></p>
        `
      });
    }

    console.log(`Property listing email (${type}) sent to ${ownerEmail}`);
    return { success: true };
  } catch (error: any) {
    console.error('Failed to send property listing email:', error);
    throw new functions.https.HttpsError('internal', 'Failed to send email');
  }
});

// ==========================================
// HOTEL BOOKING EMAIL NOTIFICATIONS
// ==========================================

const hotelBookingEmailTemplates = {
  confirmation: (data: { 
    guestName: string, 
    bookingReference: string, 
    hotelName: string, 
    roomType: string,
    checkIn: string, 
    checkOut: string, 
    nights: number,
    totalAmount: number,
    currency: string
  }) => ({
    subject: `🏨 Booking Confirmed - ${data.bookingReference} | ${data.hotelName}`,
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: 'Segoe UI', Arial, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #1e3a5f 0%, #2d5a87 100%); color: white; padding: 30px; text-align: center; border-radius: 12px 12px 0 0; }
          .header h1 { margin: 0; font-size: 24px; }
          .content { background: #ffffff; padding: 30px; border: 1px solid #e5e7eb; }
          .booking-details { background: #f0f9ff; border-radius: 8px; padding: 20px; margin: 20px 0; }
          .detail-row { display: flex; justify-content: space-between; padding: 10px 0; border-bottom: 1px solid #e5e7eb; }
          .detail-row:last-child { border-bottom: none; }
          .detail-label { color: #6b7280; }
          .detail-value { font-weight: 600; color: #1f2937; }
          .total-row { background: #1e3a5f; color: white; padding: 15px 20px; border-radius: 8px; margin-top: 20px; }
          .footer { background: #f9fafb; padding: 20px; text-align: center; border-radius: 0 0 12px 12px; border: 1px solid #e5e7eb; border-top: none; }
          .success-badge { background: #10b981; color: white; padding: 8px 16px; border-radius: 20px; display: inline-block; margin-bottom: 15px; }
          .btn { display: inline-block; background: #f97316; color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px; margin-top: 15px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🏨 Recharge Travels</h1>
            <p>Your Sri Lanka Adventure Awaits!</p>
          </div>
          <div class="content">
            <div class="success-badge">✓ Booking Confirmed</div>
            <h2>Thank you, ${data.guestName}!</h2>
            <p>Your hotel booking has been confirmed. Here are your booking details:</p>
            
            <div class="booking-details">
              <div class="detail-row">
                <span class="detail-label">Booking Reference</span>
                <span class="detail-value">${data.bookingReference}</span>
              </div>
              <div class="detail-row">
                <span class="detail-label">Hotel</span>
                <span class="detail-value">${data.hotelName}</span>
              </div>
              <div class="detail-row">
                <span class="detail-label">Room Type</span>
                <span class="detail-value">${data.roomType}</span>
              </div>
              <div class="detail-row">
                <span class="detail-label">Check-in</span>
                <span class="detail-value">${data.checkIn}</span>
              </div>
              <div class="detail-row">
                <span class="detail-label">Check-out</span>
                <span class="detail-value">${data.checkOut}</span>
              </div>
              <div class="detail-row">
                <span class="detail-label">Duration</span>
                <span class="detail-value">${data.nights} night${data.nights > 1 ? 's' : ''}</span>
              </div>
            </div>
            
            <div class="total-row">
              <strong>Total Amount: ${data.currency} ${data.totalAmount.toFixed(2)}</strong>
            </div>
            
            <p style="margin-top: 20px;">
              <strong>What's Next?</strong><br>
              - Present your booking reference at check-in<br>
              - Standard check-in time is 2:00 PM<br>
              - Standard check-out time is 12:00 PM<br>
              - Contact the hotel directly for early check-in requests
            </p>
            
            <a href="https://recharge-travels-73e76.web.app/my-bookings" class="btn">
              View My Bookings
            </a>
          </div>
          <div class="footer">
            <p><strong>Need Assistance?</strong></p>
            <p>📧 info@rechargetravels.com | 📞 +94 77 772 1999</p>
            <p style="color: #9ca3af; font-size: 12px;">© ${new Date().getFullYear()} Recharge Travels. All rights reserved.</p>
          </div>
        </div>
      </body>
      </html>
    `
  }),

  cancellation: (data: { 
    guestName: string, 
    bookingReference: string, 
    hotelName: string 
  }) => ({
    subject: `Booking Cancelled - ${data.bookingReference} | Recharge Travels`,
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: 'Segoe UI', Arial, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: #dc2626; color: white; padding: 30px; text-align: center; border-radius: 12px 12px 0 0; }
          .content { background: #ffffff; padding: 30px; border: 1px solid #e5e7eb; }
          .footer { background: #f9fafb; padding: 20px; text-align: center; border-radius: 0 0 12px 12px; border: 1px solid #e5e7eb; border-top: none; }
          .btn { display: inline-block; background: #f97316; color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px; margin-top: 15px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Booking Cancelled</h1>
          </div>
          <div class="content">
            <h2>Hi ${data.guestName},</h2>
            <p>Your booking <strong>${data.bookingReference}</strong> for <strong>${data.hotelName}</strong> has been cancelled.</p>
            <p>If you did not request this cancellation, please contact us immediately.</p>
            <p>We hope to see you soon on your next trip to Sri Lanka!</p>
            <a href="https://recharge-travels-73e76.web.app/hotels" class="btn">
              Browse Hotels
            </a>
          </div>
          <div class="footer">
            <p>📧 info@rechargetravels.com | 📞 +94 77 772 1999</p>
          </div>
        </div>
      </body>
      </html>
    `
  })
};

export const sendHotelBookingEmail = functions.https.onCall(async (data, context) => {
  const { 
    type, bookingId, bookingReference, guestEmail, guestName, 
    hotelName, roomType, checkIn, checkOut, nights, totalAmount, currency 
  } = data;

  if (!guestEmail || !bookingReference || !hotelName) {
    throw new functions.https.HttpsError('invalid-argument', 'Missing required fields');
  }

  if (!SENDGRID_API_KEY || !SENDGRID_API_KEY.startsWith('SG.')) {
    console.warn('SendGrid API key not configured, skipping email');
    return { success: false, message: 'Email service not configured' };
  }

  let template;
  switch (type) {
    case 'confirmation':
      template = hotelBookingEmailTemplates.confirmation({
        guestName, bookingReference, hotelName, roomType,
        checkIn, checkOut, nights, totalAmount, currency
      });
      break;
    case 'cancellation':
      template = hotelBookingEmailTemplates.cancellation({
        guestName, bookingReference, hotelName
      });
      break;
    default:
      throw new functions.https.HttpsError('invalid-argument', 'Invalid email type');
  }

  try {
    await sgMail.send({
      to: guestEmail,
      from: { email: FROM_EMAIL, name: FROM_NAME },
      replyTo: REPLY_TO_EMAIL,
      subject: template.subject,
      html: template.html
    });

    // Notify admin for new bookings
    if (type === 'confirmation') {
      await sgMail.send({
        to: ADMIN_EMAIL,
        from: { email: FROM_EMAIL, name: FROM_NAME },
        subject: `🏨 New Hotel Booking: ${bookingReference}`,
        html: `
          <h2>New Hotel Booking Received</h2>
          <ul>
            <li><strong>Reference:</strong> ${bookingReference}</li>
            <li><strong>Hotel:</strong> ${hotelName}</li>
            <li><strong>Guest:</strong> ${guestName} (${guestEmail})</li>
            <li><strong>Check-in:</strong> ${checkIn}</li>
            <li><strong>Check-out:</strong> ${checkOut}</li>
            <li><strong>Total:</strong> ${currency} ${totalAmount}</li>
          </ul>
          <p><a href="https://recharge-travels-admin.web.app/hotel-bookings">View in Admin Panel</a></p>
        `
      });
    }

    console.log(`Hotel booking email (${type}) sent to ${guestEmail}`);
    return { success: true };
  } catch (error: any) {
    console.error('Failed to send hotel booking email:', error);
    throw new functions.https.HttpsError('internal', 'Failed to send email');
  }
});
