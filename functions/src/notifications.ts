import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import sgMail from '@sendgrid/mail';

const db = admin.firestore();

// SendGrid API Key - Set via: firebase functions:config:set sendgrid.apikey="YOUR_API_KEY"
const SENDGRID_API_KEY = functions.config().sendgrid?.apikey || '';
sgMail.setApiKey(SENDGRID_API_KEY);

// Company email configuration
const FROM_EMAIL = 'noreply@rechargetravels.com';
const FROM_NAME = 'Recharge Travels';
const ADMIN_EMAIL = 'nanthan77@gmail.com';
const REPLY_TO_EMAIL = 'info@rechargetravels.com';

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
          <div style="background: linear-gradient(135deg, #0066cc 0%, #004d99 100%); padding: 30px; text-align: center;">
            <h1 style="color: #ffffff; margin: 0; font-size: 28px;">Recharge Travels</h1>
            <p style="color: #e6f0ff; margin: 10px 0 0;">Your Sri Lanka Adventure Awaits!</p>
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
            <div style="background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%); border-radius: 12px; padding: 25px; margin: 25px 0; border-left: 4px solid #0066cc;">
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
                  <td style="padding: 12px 0 0; color: #0066cc; font-weight: bold; font-size: 20px; text-align: right;">${data.currency} ${data.totalAmount}</td>
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
              <a href="https://recharge-travels-73e76.web.app/booking-confirmation?id=${data.confirmationNumber}"
                 style="display: inline-block; background: linear-gradient(135deg, #0066cc 0%, #004d99 100%); color: #ffffff;
                        text-decoration: none; padding: 15px 35px; border-radius: 30px; font-weight: bold; font-size: 16px;">
                View Booking Details
              </a>
            </div>
          </div>

          <!-- Contact Info -->
          <div style="background-color: #f8f9fa; padding: 25px 30px; text-align: center;">
            <p style="color: #666; margin: 0 0 10px; font-size: 14px;">Need help? Contact us:</p>
            <p style="color: #333; margin: 0;">
              📧 <a href="mailto:info@rechargetravels.com" style="color: #0066cc; text-decoration: none;">info@rechargetravels.com</a>
              &nbsp;|&nbsp;
              📞 <a href="tel:+94777123456" style="color: #0066cc; text-decoration: none;">+94 777 123 456</a>
            </p>
          </div>

          <!-- Footer -->
          <div style="background-color: #333; padding: 20px 30px; text-align: center;">
            <p style="color: #999; margin: 0; font-size: 12px;">
              © ${new Date().getFullYear()} Recharge Travels. All rights reserved.<br>
              Sri Lanka | <a href="https://recharge-travels-73e76.web.app" style="color: #0066cc; text-decoration: none;">www.rechargetravels.com</a>
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
          <div style="background: linear-gradient(135deg, #0066cc 0%, #004d99 100%); padding: 30px; text-align: center;">
            <h1 style="color: #ffffff; margin: 0; font-size: 28px;">Recharge Travels</h1>
          </div>

          <!-- Content -->
          <div style="padding: 40px 30px;">
            <h2 style="color: #333; margin-top: 0;">Thank You for Contacting Us! 📬</h2>
            <p style="color: #666; font-size: 16px; line-height: 1.6;">
              Dear ${data.customerName},
            </p>
            <p style="color: #666; font-size: 16px; line-height: 1.6;">
              Thank you for reaching out to Recharge Travels. We have received your inquiry and our team will get back to you within 24-48 hours.
            </p>

            <!-- Inquiry Summary -->
            <div style="background-color: #f8f9fa; border-radius: 12px; padding: 25px; margin: 25px 0; border-left: 4px solid #0066cc;">
              <h3 style="color: #333; margin-top: 0; font-size: 18px;">Your Inquiry:</h3>
              <p style="color: #666; margin: 0; white-space: pre-wrap;">${data.message}</p>
            </div>

            <p style="color: #666; font-size: 16px; line-height: 1.6;">
              In the meantime, feel free to explore our website for amazing Sri Lanka travel packages and experiences.
            </p>

            <!-- CTA Button -->
            <div style="text-align: center; margin: 30px 0;">
              <a href="https://recharge-travels-73e76.web.app/tours"
                 style="display: inline-block; background: linear-gradient(135deg, #0066cc 0%, #004d99 100%); color: #ffffff;
                        text-decoration: none; padding: 15px 35px; border-radius: 30px; font-weight: bold; font-size: 16px;">
                Explore Our Tours
              </a>
            </div>
          </div>

          <!-- Footer -->
          <div style="background-color: #333; padding: 20px 30px; text-align: center;">
            <p style="color: #999; margin: 0; font-size: 12px;">
              © ${new Date().getFullYear()} Recharge Travels. All rights reserved.
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
          <div style="background: linear-gradient(135deg, #0066cc 0%, #004d99 100%); padding: 30px; text-align: center;">
            <h1 style="color: #ffffff; margin: 0; font-size: 28px;">Welcome to Recharge Travels!</h1>
            <p style="color: #e6f0ff; margin: 10px 0 0;">Your Gateway to Sri Lanka</p>
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
              <a href="https://recharge-travels-73e76.web.app"
                 style="display: inline-block; background: linear-gradient(135deg, #0066cc 0%, #004d99 100%); color: #ffffff;
                        text-decoration: none; padding: 15px 35px; border-radius: 30px; font-weight: bold; font-size: 16px;">
                Start Exploring
              </a>
            </div>
          </div>

          <!-- Footer -->
          <div style="background-color: #333; padding: 20px 30px; text-align: center;">
            <p style="color: #999; margin: 0; font-size: 12px;">
              © ${new Date().getFullYear()} Recharge Travels. All rights reserved.
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
          <div style="background-color: #0066cc; padding: 20px; text-align: center;">
            <h1 style="color: #ffffff; margin: 0;">Admin Alert</h1>
          </div>

          <div style="padding: 30px;">
            <h2 style="color: #333;">New ${data.type} Received</h2>

            <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
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
                 style="display: inline-block; background-color: #0066cc; color: #ffffff;
                        text-decoration: none; padding: 12px 30px; border-radius: 5px; font-weight: bold;">
                View in Admin Panel
              </a>
            </div>
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
          <div style="background: linear-gradient(135deg, #0066cc 0%, #004d99 100%); padding: 40px 30px; text-align: center;">
            <h1 style="color: #ffffff; margin: 0; font-size: 32px;">Welcome to Our Travel Family! 🌴</h1>
            <p style="color: #e6f0ff; margin: 15px 0 0; font-size: 18px;">Your Sri Lanka Adventure Starts Here</p>
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
              <a href="https://recharge-travels-73e76.web.app/tours"
                 style="display: inline-block; background: linear-gradient(135deg, #0066cc 0%, #004d99 100%); color: #ffffff;
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
          <div style="background-color: #f8f9fa; padding: 25px 30px; text-align: center;">
            <p style="color: #666; margin: 0 0 15px; font-size: 14px;">Follow us for daily inspiration:</p>
            <div style="margin-bottom: 15px;">
              <a href="#" style="display: inline-block; margin: 0 10px; color: #0066cc; text-decoration: none;">Facebook</a>
              <a href="#" style="display: inline-block; margin: 0 10px; color: #0066cc; text-decoration: none;">Instagram</a>
              <a href="#" style="display: inline-block; margin: 0 10px; color: #0066cc; text-decoration: none;">Twitter</a>
            </div>
          </div>

          <!-- Footer -->
          <div style="background-color: #333; padding: 25px 30px; text-align: center;">
            <p style="color: #999; margin: 0 0 10px; font-size: 12px;">
              © ${new Date().getFullYear()} Recharge Travels. All rights reserved.
            </p>
            <p style="color: #999; margin: 0; font-size: 11px;">
              You received this email because you subscribed to our newsletter.<br>
              <a href="https://recharge-travels-73e76.web.app/unsubscribe?email=${data.email}" style="color: #0066cc;">Unsubscribe</a>
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
          <div style="background: linear-gradient(135deg, #0066cc 0%, #004d99 100%); padding: 30px; text-align: center;">
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
              <a href="https://recharge-travels-73e76.web.app/blog/${data.slug || data.id}"
                 style="display: inline-block; background: linear-gradient(135deg, #0066cc 0%, #004d99 100%); color: #ffffff;
                        text-decoration: none; padding: 14px 35px; border-radius: 30px; font-weight: bold; font-size: 15px;">
                Read Full Article
              </a>
            </div>
          </div>

          <div style="background-color: #333; padding: 20px 30px; text-align: center;">
            <p style="color: #999; margin: 0; font-size: 11px;">
              You received this because you subscribed to blog updates.<br>
              <a href="https://recharge-travels-73e76.web.app/unsubscribe?email=${data.email}" style="color: #0066cc;">Unsubscribe</a>
            </p>
          </div>
        </div>
      </body>
      </html>
    `,
    text: `New Blog Post: ${data.title}\n\nBy ${data.author}\n\n${data.excerpt || data.content?.substring(0, 200)}...\n\nRead more: https://recharge-travels-73e76.web.app/blog/${data.slug || data.id}`
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
          <div style="background: linear-gradient(135deg, #0066cc 0%, #004d99 100%); padding: 30px; text-align: center;">
            <h1 style="color: #ffffff; margin: 0; font-size: 28px;">Trip Reminder!</h1>
          </div>

          <div style="padding: 40px 30px;">
            <h2 style="color: #333; margin-top: 0;">Hi ${data.customerName}! 🎒</h2>
            <p style="color: #666; font-size: 16px; line-height: 1.6;">
              Your adventure to <strong>${data.destination}</strong> is just <strong>${data.daysUntil} days away</strong>!
            </p>

            <div style="background-color: #f8f9fa; border-radius: 12px; padding: 25px; margin: 25px 0; border-left: 4px solid #0066cc;">
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
    text: `Trip Reminder! Your adventure to ${data.destination} is ${data.daysUntil} days away!`
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

// Trigger: Send booking confirmation when new booking is created
export const sendBookingConfirmation = functions.firestore
  .document('bookings/{bookingId}')
  .onCreate(async (snap, context) => {
    const booking = snap.data();
    const bookingId = context.params.bookingId;

    try {
      const customerEmail = booking.personal_info?.email || booking.email;
      const customerName = booking.personal_info
        ? `${booking.personal_info.firstName} ${booking.personal_info.lastName}`
        : booking.name;

      if (!customerEmail) {
        console.log('No customer email found for booking:', bookingId);
        return;
      }

      // Prepare template data
      const templateData = {
        customerName: customerName || 'Valued Customer',
        confirmationNumber: booking.confirmation_number || bookingId,
        bookingType: booking.booking_type || booking.type || 'Travel Package',
        travelDate: booking.check_in_date || booking.tour_start_date || booking.pickup_date || booking.travel_date || 'TBD',
        adults: booking.adults || booking.guests || 1,
        children: booking.children || 0,
        totalAmount: booking.total_price || booking.amount || 0,
        currency: booking.currency || 'USD',
        specialRequests: booking.special_requests || ''
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
        phone: booking.personal_info?.phone || booking.phone,
        details: `
          <p><strong>Booking ID:</strong> ${booking.confirmation_number || bookingId}</p>
          <p><strong>Type:</strong> ${booking.booking_type || booking.type}</p>
          <p><strong>Date:</strong> ${templateData.travelDate}</p>
          <p><strong>Guests:</strong> ${templateData.adults} Adults, ${templateData.children} Children</p>
          <p><strong>Amount:</strong> ${templateData.currency} ${templateData.totalAmount}</p>
          <p><strong>Status:</strong> ${booking.status}</p>
          <p><strong>Payment:</strong> ${booking.payment_status}</p>
        `,
        adminUrl: `https://recharge-travels-73e76.web.app/admin/bookings/${bookingId}`
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

      console.log('Booking confirmation sent for:', bookingId);
    } catch (error) {
      console.error('Error sending booking confirmation:', error);
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
