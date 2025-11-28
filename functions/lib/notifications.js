"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var _a, _b;
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendDriverVerificationEmail = exports.checkDriverDocumentExpiry = exports.onDriverStatusChange = exports.onDriverApplicationSubmitted = exports.getNewsletterStats = exports.unsubscribeNewsletter = exports.subscribeNewsletter = exports.notifyBlogSubscribers = exports.sendNewsletterWelcome = exports.sendBookingReminders = exports.sendWelcomeEmail = exports.sendBookingNotification = exports.sendBookingConfirmation = exports.sendWhatsAppMessage = exports.sendEmail = void 0;
const functions = __importStar(require("firebase-functions"));
const admin = __importStar(require("firebase-admin"));
const mail_1 = __importDefault(require("@sendgrid/mail"));
const ioredis_1 = __importDefault(require("ioredis"));
const db = admin.firestore();
// SendGrid API Key - Set via: firebase functions:config:set sendgrid.apikey="YOUR_API_KEY"
const SENDGRID_API_KEY = ((_a = functions.config().sendgrid) === null || _a === void 0 ? void 0 : _a.apikey) || process.env.SENDGRID_API_KEY || '';
if (SENDGRID_API_KEY && SENDGRID_API_KEY.startsWith('SG.')) {
    mail_1.default.setApiKey(SENDGRID_API_KEY);
}
else {
    console.warn('SendGrid API key not set or invalid; email sending will be disabled until a valid key is configured.');
}
// Company email configuration
const FROM_EMAIL = 'info@rechargetravels.com';
const FROM_NAME = 'Recharge Travels';
const ADMIN_EMAIL = 'nanthan77@gmail.com';
const REPLY_TO_EMAIL = 'info@rechargetravels.com';
// Redis setup (optional). Configure via: firebase functions:config:set redis.url="redis://:password@host:port"
const REDIS_URL = ((_b = functions.config().redis) === null || _b === void 0 ? void 0 : _b.url) || process.env.REDIS_URL || '';
let redis = null;
if (REDIS_URL && !REDIS_URL.includes('HOST:PORT')) {
    try {
        redis = new ioredis_1.default(REDIS_URL);
        redis.on('error', (err) => {
            console.warn('Redis client error (ignored for rate-limiting):', (err === null || err === void 0 ? void 0 : err.message) || err);
        });
        console.log('Redis client initialized for newsletter rate-limiting');
    }
    catch (err) {
        console.warn('Failed to initialize Redis client for rate-limiting:', (err === null || err === void 0 ? void 0 : err.message) || err);
        redis = null;
    }
}
else if (REDIS_URL) {
    console.warn('REDIS_URL appears to be a placeholder; skipping Redis initialization.');
}
// Email templates
const emailTemplates = {
    bookingConfirmation: (data) => ({
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
    inquiryReply: (data) => ({
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
    welcomeEmail: (data) => ({
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
    adminNotification: (data) => ({
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
    newsletterWelcome: (data) => ({
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
    newBlogPost: (data) => {
        var _a, _b;
        return ({
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
              ${data.excerpt || ((_a = data.content) === null || _a === void 0 ? void 0 : _a.substring(0, 200)) + '...'}
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
            text: `New Blog Post: ${data.title}\n\nBy ${data.author}\n\n${data.excerpt || ((_b = data.content) === null || _b === void 0 ? void 0 : _b.substring(0, 200))}...\n\nRead more: https://recharge-travels-73e76.web.app/blog/${data.slug || data.id}`
        });
    },
    // Driver Onboarding Templates
    driverApplicationSubmitted: (data) => ({
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
    driverApplicationApproved: (data) => ({
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
    driverApplicationRejected: (data) => ({
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
    driverDocumentExpiring: (data) => ({
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
    bookingReminder: (data) => ({
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
    }),
    // ==========================================
    // VENDOR PLATFORM EMAIL TEMPLATES
    // ==========================================
    vendorApplicationSubmitted: (data) => ({
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
    vendorApplicationApproved: (data) => ({
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
    vendorApplicationRejected: (data) => ({
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
    vendorNewBooking: (data) => ({
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
    })
};
// Send email using SendGrid
exports.sendEmail = functions.https.onCall(async (data, context) => {
    const { to, subject, html, text, templateType, templateData } = data;
    try {
        let emailContent = { subject, html, text };
        // Use template if specified
        if (templateType && templateData && emailTemplates[templateType]) {
            emailContent = emailTemplates[templateType](templateData);
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
        await mail_1.default.send(msg);
        // Log email sent
        await db.collection('emailLogs').add({
            to,
            subject: emailContent.subject,
            templateType: templateType || 'custom',
            status: 'sent',
            sentAt: admin.firestore.FieldValue.serverTimestamp()
        });
        return { success: true, message: 'Email sent successfully' };
    }
    catch (error) {
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
exports.sendWhatsAppMessage = functions.https.onCall(async (data, context) => {
    const { to, message } = data;
    try {
        await db.collection('whatsappMessages').add({
            to,
            message,
            status: 'pending',
            createdAt: admin.firestore.FieldValue.serverTimestamp()
        });
        return { success: true, message: 'WhatsApp message queued' };
    }
    catch (error) {
        console.error('Error sending WhatsApp:', error);
        throw new functions.https.HttpsError('internal', error.message);
    }
});
// Trigger: Send booking confirmation when new booking is created
exports.sendBookingConfirmation = functions.firestore
    .document('bookings/{bookingId}')
    .onCreate(async (snap, context) => {
    var _a, _b;
    const booking = snap.data();
    const bookingId = context.params.bookingId;
    try {
        const customerEmail = ((_a = booking.personal_info) === null || _a === void 0 ? void 0 : _a.email) || booking.email;
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
        await mail_1.default.send({
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
            phone: ((_b = booking.personal_info) === null || _b === void 0 ? void 0 : _b.phone) || booking.phone,
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
        await mail_1.default.send({
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
    }
    catch (error) {
        console.error('Error sending booking confirmation:', error);
    }
});
// Trigger: Send notification when new inquiry is created
exports.sendBookingNotification = functions.firestore
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
            await mail_1.default.send({
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
        await mail_1.default.send({
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
    }
    catch (error) {
        console.error('Error sending inquiry notification:', error);
    }
});
// Send welcome email when new user signs up
exports.sendWelcomeEmail = functions.firestore
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
        await mail_1.default.send({
            to: user.email,
            from: { email: FROM_EMAIL, name: FROM_NAME },
            replyTo: REPLY_TO_EMAIL,
            subject: template.subject,
            html: template.html,
            text: template.text
        });
        console.log('Welcome email sent to:', user.email);
    }
    catch (error) {
        console.error('Error sending welcome email:', error);
    }
});
// Send booking reminder (scheduled function)
exports.sendBookingReminders = functions.pubsub
    .schedule('every day 09:00')
    .timeZone('Asia/Colombo')
    .onRun(async (context) => {
    var _a;
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
                const customerEmail = ((_a = booking.personal_info) === null || _a === void 0 ? void 0 : _a.email) || booking.email;
                const customerName = booking.personal_info
                    ? `${booking.personal_info.firstName} ${booking.personal_info.lastName}`
                    : booking.name;
                if (customerEmail) {
                    const template = emailTemplates.bookingReminder({
                        customerName: customerName || 'Traveler',
                        destination: booking.destination || 'Sri Lanka',
                        daysUntil: 3
                    });
                    await mail_1.default.send({
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
    }
    catch (error) {
        console.error('Error sending booking reminders:', error);
    }
});
// Newsletter subscription - send welcome email
exports.sendNewsletterWelcome = functions.firestore
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
        await mail_1.default.send({
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
    }
    catch (error) {
        console.error('Error sending newsletter welcome email:', error);
    }
});
// Notify subscribers when new blog post is published
exports.notifyBlogSubscribers = functions.firestore
    .document('blogs/{blogId}')
    .onUpdate(async (change, context) => {
    var _a, _b;
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
                excerpt: after.excerpt || ((_a = after.content) === null || _a === void 0 ? void 0 : _a.substring(0, 200)),
                featuredImage: after.featuredImage || after.featured_image,
                author: typeof after.author === 'string' ? after.author : ((_b = after.author) === null || _b === void 0 ? void 0 : _b.name) || 'Recharge Travels',
                readingTime: after.readingTime || after.reading_time || 5
            };
            // Send to all subscribers (batch to avoid rate limits)
            const subscribers = subscribersSnapshot.docs.map(doc => doc.data());
            let sentCount = 0;
            for (const subscriber of subscribers) {
                try {
                    const template = emailTemplates.newBlogPost(Object.assign(Object.assign({}, blogData), { email: subscriber.email }));
                    await mail_1.default.send({
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
                }
                catch (emailError) {
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
        }
        catch (error) {
            console.error('Error sending blog notifications:', error);
        }
    }
});
// Handle newsletter subscription via callable function
exports.subscribeNewsletter = functions.https.onCall(async (data, context) => {
    const { email, name, source, interests } = data;
    if (!email) {
        throw new functions.https.HttpsError('invalid-argument', 'Email is required');
    }
    try {
        // Optional Redis-based rate limiting: per-email and per-IP counters
        try {
            if (redis) {
                const ipHeader = context.rawRequest && (context.rawRequest.headers['x-forwarded-for'] || context.rawRequest.ip);
                const ip = ipHeader ? String(ipHeader).split(',')[0].trim() : 'unknown';
                const emailKey = `newsletter:email:${email.toLowerCase()}`;
                const ipKey = `newsletter:ip:${ip}`;
                const RATE_LIMIT_WINDOW = 60; // seconds
                const MAX_EMAIL_PER_WINDOW = 5; // allow 5 attempts per email per minute
                const MAX_IP_PER_WINDOW = 100; // allow 100 attempts per IP per minute
                const emailCount = await redis.incr(emailKey);
                if (emailCount === 1)
                    await redis.expire(emailKey, RATE_LIMIT_WINDOW);
                if (emailCount > MAX_EMAIL_PER_WINDOW) {
                    throw new functions.https.HttpsError('resource-exhausted', 'Too many subscription attempts for this email. Try again later.');
                }
                const ipCount = await redis.incr(ipKey);
                if (ipCount === 1)
                    await redis.expire(ipKey, RATE_LIMIT_WINDOW);
                if (ipCount > MAX_IP_PER_WINDOW) {
                    throw new functions.https.HttpsError('resource-exhausted', 'Too many requests from this IP. Try again later.');
                }
            }
        }
        catch (rlErr) {
            // If Redis reports rate limit HttpsError, rethrow. For other Redis errors, log and continue.
            if (rlErr && rlErr.code === 'resource-exhausted')
                throw rlErr;
            console.warn('Redis rate-limit check error (continuing):', (rlErr === null || rlErr === void 0 ? void 0 : rlErr.message) || rlErr);
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
                await mail_1.default.send({
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
        }
        catch (coolErr) {
            console.warn('Failed to set cooldown key in Redis:', (coolErr === null || coolErr === void 0 ? void 0 : coolErr.message) || coolErr);
        }
        return { success: true, message: 'Successfully subscribed to newsletter!' };
    }
    catch (error) {
        console.error('Newsletter subscription error:', error);
        throw new functions.https.HttpsError('internal', error.message);
    }
});
// Handle newsletter unsubscription
exports.unsubscribeNewsletter = functions.https.onCall(async (data, context) => {
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
    }
    catch (error) {
        console.error('Newsletter unsubscription error:', error);
        throw new functions.https.HttpsError('internal', error.message);
    }
});
// Get newsletter stats (admin only)
exports.getNewsletterStats = functions.https.onCall(async (data, context) => {
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
                    var _a, _b;
                    const subDate = ((_b = (_a = s.subscribed_at) === null || _a === void 0 ? void 0 : _a.toDate) === null || _b === void 0 ? void 0 : _b.call(_a)) || new Date(s.subscribed_at);
                    return subDate >= thisMonthStart;
                }).length,
                bySource: subscribers.reduce((acc, s) => {
                    const source = s.source || 'unknown';
                    acc[source] = (acc[source] || 0) + 1;
                    return acc;
                }, {})
            }
        };
    }
    catch (error) {
        console.error('Get newsletter stats error:', error);
        throw new functions.https.HttpsError('internal', error.message);
    }
});
// ===== DRIVER ONBOARDING NOTIFICATIONS =====
// Helper to format tier names
const formatTierName = (tier) => {
    const tierNames = {
        chauffeur_guide: 'Chauffeur Tourist Guide (SLTDA)',
        national_guide: 'National Tourist Guide',
        tourist_driver: 'SLITHM Tourist Driver',
        freelance_driver: 'Freelance Driver'
    };
    return tierNames[tier] || (tier === null || tier === void 0 ? void 0 : tier.replace(/_/g, ' ')) || 'Driver';
};
// Trigger: Send notification when new driver application is submitted
exports.onDriverApplicationSubmitted = functions.firestore
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
        await mail_1.default.send({
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
        await mail_1.default.send({
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
    }
    catch (error) {
        console.error('Error sending driver application notification:', error);
    }
});
// Trigger: Send notification when driver status changes
exports.onDriverStatusChange = functions.firestore
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
            await mail_1.default.send({
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
            await mail_1.default.send({
                to: after.email,
                from: { email: FROM_EMAIL, name: FROM_NAME },
                replyTo: 'info@rechargetravels.com',
                subject: rejectedTemplate.subject,
                html: rejectedTemplate.html,
                text: rejectedTemplate.text
            });
            console.log('Driver rejection notification sent for:', driverId);
        }
    }
    catch (error) {
        console.error('Error sending driver status change notification:', error);
    }
});
// Scheduled: Check for expiring driver documents and send reminders
exports.checkDriverDocumentExpiry = functions.pubsub
    .schedule('every day 08:00')
    .timeZone('Asia/Colombo')
    .onRun(async () => {
    var _a, _b;
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
            if (!driver.email)
                continue;
            for (const docType of documentFields) {
                const expiryDate = driver[docType.field];
                if (!expiryDate)
                    continue;
                const expiry = new Date(expiryDate);
                const daysRemaining = Math.ceil((expiry.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
                // Send reminder if expiring within 30 days and not already reminded this week
                if (expiry <= thirtyDaysFromNow && expiry > now) {
                    // Check if reminder was already sent this week
                    const reminderKey = `expiry_reminder_${driverDoc.id}_${docType.field}`;
                    const lastReminder = await db.collection('email_reminders').doc(reminderKey).get();
                    if (lastReminder.exists) {
                        const lastSent = (_b = (_a = lastReminder.data()) === null || _a === void 0 ? void 0 : _a.sent_at) === null || _b === void 0 ? void 0 : _b.toDate();
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
                    await mail_1.default.send({
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
    }
    catch (error) {
        console.error('Error checking driver document expiry:', error);
    }
});
// Callable: Manually send driver verification email (for admin panel)
exports.sendDriverVerificationEmail = functions.https.onCall(async (data) => {
    const { driverId, templateType, customMessage } = data;
    try {
        const driverDoc = await db.collection('drivers').doc(driverId).get();
        if (!driverDoc.exists) {
            throw new functions.https.HttpsError('not-found', 'Driver not found');
        }
        const driver = driverDoc.data();
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
        await mail_1.default.send({
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
    }
    catch (error) {
        console.error('Error sending driver verification email:', error);
        throw new functions.https.HttpsError('internal', error.message);
    }
});
//# sourceMappingURL=notifications.js.map