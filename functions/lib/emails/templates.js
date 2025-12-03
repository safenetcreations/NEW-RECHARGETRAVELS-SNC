"use strict";
// Recharge Travels Email Templates
// Professional branded email templates for all booking types
Object.defineProperty(exports, "__esModule", { value: true });
exports.bookingCancellationTemplate = exports.passwordResetTemplate = exports.paymentConfirmationTemplate = exports.agencyApprovalTemplate = exports.agencyWelcomeTemplate = exports.bookingConfirmationTemplate = exports.b2bEmailWrapper = exports.bookingReminderTemplate = exports.welcomeEmailTemplate = exports.whaleWatchingTemplate = exports.transferBookingTemplate = exports.tourBookingTemplate = exports.conciergeBookingTemplate = exports.emailWrapper = void 0;
// Brand Assets
const LOGO_URL = 'https://www.rechargetravels.com/logo-v2.png';
const HERO_IMAGE = 'https://images.unsplash.com/photo-1552733407-5d5c46c3bb3b?auto=format&fit=crop&w=1200&q=80';
const BRAND_PRIMARY = '#0d5c46'; // Emerald green
const BRAND_SECONDARY = '#f0b429'; // Gold
const BRAND_DARK = '#064e3b';
const WHATSAPP_NUMBER = '+94777721999';
const WHATSAPP_LINK = `https://wa.me/94777721999`;
const WEBSITE_URL = 'https://www.rechargetravels.com';
// ==========================================
// BASE EMAIL WRAPPER
// ==========================================
const emailWrapper = (content, title, type = 'general') => {
    const headerGradient = type === 'luxury'
        ? `linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%)`
        : `linear-gradient(135deg, ${BRAND_PRIMARY} 0%, #10b981 100%)`;
    const accentColor = type === 'luxury' ? '#d4af37' : BRAND_SECONDARY;
    return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <title>${title}</title>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700&family=Playfair+Display:wght@500;600;700&display=swap');

    * { box-sizing: border-box; }
    body { margin: 0; padding: 0; -webkit-font-smoothing: antialiased; }
    img { border: 0; display: block; }
    a { text-decoration: none; }

    @media only screen and (max-width: 600px) {
      .mobile-padding { padding: 20px !important; }
      .mobile-text-center { text-align: center !important; }
      .mobile-full-width { width: 100% !important; }
    }
  </style>
</head>
<body style="margin: 0; padding: 0; font-family: 'Poppins', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background-color: #f8f9fa;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color: #f8f9fa;">
    <tr>
      <td align="center" style="padding: 40px 20px;">
        <table role="presentation" width="600" cellspacing="0" cellpadding="0" style="max-width: 600px; width: 100%; background-color: white; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 24px rgba(0,0,0,0.1);">

          <!-- Header with Logo -->
          <tr>
            <td style="background: ${headerGradient}; padding: 32px 40px; text-align: center;">
              <img src="${LOGO_URL}" alt="Recharge Travels" style="height: 60px; margin: 0 auto 16px;" />
              <p style="color: rgba(255,255,255,0.9); margin: 0; font-size: 14px; letter-spacing: 2px; text-transform: uppercase;">
                ${type === 'luxury' ? 'Luxury Travel Experiences' : 'Your Sri Lanka Travel Partner'}
              </p>
            </td>
          </tr>

          <!-- Main Content -->
          <tr>
            <td class="mobile-padding" style="padding: 40px;">
              ${content}
            </td>
          </tr>

          <!-- WhatsApp CTA -->
          <tr>
            <td style="background-color: #25D366; padding: 24px 40px; text-align: center;">
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0">
                <tr>
                  <td align="center">
                    <p style="color: white; margin: 0 0 12px; font-size: 16px; font-weight: 600;">
                      Need Assistance? Chat with us on WhatsApp!
                    </p>
                    <a href="${WHATSAPP_LINK}?text=Hi%20Recharge%20Travels%2C%20I%20need%20help%20with%20my%20booking"
                       style="display: inline-block; background-color: white; color: #25D366; padding: 12px 32px; border-radius: 50px; font-weight: 600; font-size: 14px;">
                      <img src="https://upload.wikimedia.org/wikipedia/commons/6/6b/WhatsApp.svg" alt="WhatsApp" style="width: 20px; height: 20px; display: inline-block; vertical-align: middle; margin-right: 8px;" />
                      Chat Now: ${WHATSAPP_NUMBER}
                    </a>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background-color: #1f2937; padding: 32px 40px; text-align: center;">
              <!-- Social Links -->
              <table role="presentation" cellspacing="0" cellpadding="0" style="margin: 0 auto 20px;">
                <tr>
                  <td style="padding: 0 8px;">
                    <a href="https://facebook.com/rechargetravels" style="display: inline-block; width: 36px; height: 36px; background-color: #374151; border-radius: 50%; line-height: 36px; text-align: center;">
                      <img src="https://cdn-icons-png.flaticon.com/128/733/733547.png" alt="Facebook" style="width: 18px; height: 18px; margin: 9px;" />
                    </a>
                  </td>
                  <td style="padding: 0 8px;">
                    <a href="https://instagram.com/rechargetravels" style="display: inline-block; width: 36px; height: 36px; background-color: #374151; border-radius: 50%; line-height: 36px; text-align: center;">
                      <img src="https://cdn-icons-png.flaticon.com/128/2111/2111463.png" alt="Instagram" style="width: 18px; height: 18px; margin: 9px;" />
                    </a>
                  </td>
                  <td style="padding: 0 8px;">
                    <a href="https://youtube.com/rechargetravels" style="display: inline-block; width: 36px; height: 36px; background-color: #374151; border-radius: 50%; line-height: 36px; text-align: center;">
                      <img src="https://cdn-icons-png.flaticon.com/128/1384/1384060.png" alt="YouTube" style="width: 18px; height: 18px; margin: 9px;" />
                    </a>
                  </td>
                </tr>
              </table>

              <p style="color: #9ca3af; margin: 0 0 8px; font-size: 14px;">
                <a href="${WEBSITE_URL}" style="color: ${accentColor}; font-weight: 500;">www.rechargetravels.com</a>
              </p>
              <p style="color: #6b7280; margin: 0 0 8px; font-size: 13px;">
                24/7 Support: <a href="tel:${WHATSAPP_NUMBER}" style="color: #9ca3af;">${WHATSAPP_NUMBER}</a>
              </p>
              <p style="color: #6b7280; margin: 0 0 8px; font-size: 13px;">
                Email: <a href="mailto:info@rechargetravels.com" style="color: #9ca3af;">info@rechargetravels.com</a>
              </p>

              <div style="margin-top: 20px; padding-top: 20px; border-top: 1px solid #374151;">
                <p style="color: #6b7280; margin: 0; font-size: 11px;">
                  © ${new Date().getFullYear()} Recharge Travels & Tours (Pvt) Ltd. All rights reserved.
                </p>
                <p style="color: #6b7280; margin: 4px 0 0; font-size: 11px;">
                  SLTDA Registered | TripAdvisor Partner | Safe Travels Certified
                </p>
              </div>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
`;
};
exports.emailWrapper = emailWrapper;
exports.b2bEmailWrapper = exports.emailWrapper;
// ==========================================
// VIP CONCIERGE BOOKING CONFIRMATION
// ==========================================
const conciergeBookingTemplate = (data) => {
    const servicesHtml = data.selectedServices.map(service => `<li style="padding: 8px 0; color: #374151; border-bottom: 1px solid #f3f4f6;">✓ ${service}</li>`).join('');
    const content = `
    <!-- Success Header -->
    <div style="text-align: center; margin-bottom: 32px;">
      <div style="width: 80px; height: 80px; background: linear-gradient(135deg, #d4af37 0%, #f0d97a 100%); border-radius: 50%; margin: 0 auto 20px; display: flex; align-items: center; justify-content: center; box-shadow: 0 8px 24px rgba(212,175,55,0.3);">
        <span style="font-size: 40px;">👑</span>
      </div>
      <h1 style="color: #1a1a1a; margin: 0; font-size: 28px; font-weight: 700; font-family: 'Playfair Display', serif;">
        VIP Concierge Request Received
      </h1>
      <p style="color: #6b7280; margin: 12px 0 0; font-size: 16px;">
        Our luxury concierge team will contact you within 2 hours
      </p>
    </div>

    <!-- Booking Reference -->
    <div style="background: linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%); border-radius: 16px; padding: 24px; text-align: center; margin-bottom: 32px;">
      <p style="color: #d4af37; margin: 0 0 4px; font-size: 12px; text-transform: uppercase; letter-spacing: 2px;">
        Booking Reference
      </p>
      <p style="color: white; margin: 0; font-size: 32px; font-weight: 700; font-family: monospace; letter-spacing: 2px;">
        ${data.bookingRef}
      </p>
    </div>

    <!-- Guest Details -->
    <div style="background-color: #faf5eb; border-radius: 12px; padding: 24px; margin-bottom: 24px; border-left: 4px solid #d4af37;">
      <h3 style="color: #1a1a1a; margin: 0 0 16px; font-size: 18px; font-weight: 600;">
        👤 Guest Information
      </h3>
      <table width="100%" cellspacing="0" cellpadding="0">
        <tr>
          <td style="padding: 8px 0; color: #6b7280; font-size: 14px; width: 40%;">Name</td>
          <td style="padding: 8px 0; color: #1a1a1a; font-size: 14px; font-weight: 600;">${data.firstName} ${data.lastName}</td>
        </tr>
        <tr>
          <td style="padding: 8px 0; color: #6b7280; font-size: 14px;">Email</td>
          <td style="padding: 8px 0; color: #1a1a1a; font-size: 14px;">${data.email}</td>
        </tr>
        <tr>
          <td style="padding: 8px 0; color: #6b7280; font-size: 14px;">Phone</td>
          <td style="padding: 8px 0; color: #1a1a1a; font-size: 14px;">${data.phone}</td>
        </tr>
      </table>
    </div>

    <!-- Service Details -->
    <div style="background-color: #f9fafb; border-radius: 12px; padding: 24px; margin-bottom: 24px;">
      <h3 style="color: #1a1a1a; margin: 0 0 16px; font-size: 18px; font-weight: 600;">
        🗓️ Service Details
      </h3>
      <table width="100%" cellspacing="0" cellpadding="0">
        <tr>
          <td style="padding: 8px 0; color: #6b7280; font-size: 14px; width: 40%;">Preferred Date</td>
          <td style="padding: 8px 0; color: #1a1a1a; font-size: 14px; font-weight: 600;">${data.preferredDate}</td>
        </tr>
        ${data.alternateDate ? `
        <tr>
          <td style="padding: 8px 0; color: #6b7280; font-size: 14px;">Alternate Date</td>
          <td style="padding: 8px 0; color: #1a1a1a; font-size: 14px;">${data.alternateDate}</td>
        </tr>
        ` : ''}
        <tr>
          <td style="padding: 8px 0; color: #6b7280; font-size: 14px;">Location</td>
          <td style="padding: 8px 0; color: #1a1a1a; font-size: 14px;">${data.location}</td>
        </tr>
        <tr>
          <td style="padding: 8px 0; color: #6b7280; font-size: 14px;">Number of Guests</td>
          <td style="padding: 8px 0; color: #1a1a1a; font-size: 14px;">${data.guests} person(s)</td>
        </tr>
        <tr>
          <td style="padding: 8px 0; color: #6b7280; font-size: 14px;">Duration</td>
          <td style="padding: 8px 0; color: #1a1a1a; font-size: 14px;">${data.duration}</td>
        </tr>
        <tr>
          <td style="padding: 8px 0; color: #6b7280; font-size: 14px;">Budget Range</td>
          <td style="padding: 8px 0; color: #1a1a1a; font-size: 14px;">${data.budget}</td>
        </tr>
      </table>
    </div>

    <!-- Selected Services -->
    <div style="background-color: #f9fafb; border-radius: 12px; padding: 24px; margin-bottom: 24px;">
      <h3 style="color: #1a1a1a; margin: 0 0 16px; font-size: 18px; font-weight: 600;">
        ✨ Selected Services
      </h3>
      <ul style="margin: 0; padding: 0; list-style: none;">
        ${servicesHtml}
      </ul>
    </div>

    ${data.specialRequests ? `
    <!-- Special Requests -->
    <div style="background-color: #fef3c7; border-radius: 12px; padding: 20px; margin-bottom: 24px;">
      <h4 style="color: #92400e; margin: 0 0 8px; font-size: 14px; font-weight: 600;">
        📝 Special Requests
      </h4>
      <p style="color: #78350f; margin: 0; font-size: 14px; line-height: 1.6;">
        ${data.specialRequests}
      </p>
    </div>
    ` : ''}

    <!-- Estimated Total -->
    <div style="background: linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%); border-radius: 12px; padding: 24px; margin-bottom: 24px; text-align: center;">
      <p style="color: #9ca3af; margin: 0 0 8px; font-size: 14px;">Estimated Total</p>
      <p style="color: #d4af37; margin: 0; font-size: 36px; font-weight: 700;">$${data.estimatedTotal.toLocaleString()}</p>
      <p style="color: #6b7280; margin: 8px 0 0; font-size: 12px;">Final price will be confirmed by our concierge team</p>
    </div>

    <!-- What's Next -->
    <div style="background-color: #ecfdf5; border-radius: 12px; padding: 24px; margin-bottom: 24px;">
      <h3 style="color: ${BRAND_PRIMARY}; margin: 0 0 16px; font-size: 18px; font-weight: 600;">
        🚀 What Happens Next?
      </h3>
      <ol style="color: #374151; font-size: 14px; line-height: 2; margin: 0; padding-left: 20px;">
        <li>Our VIP concierge team reviews your request</li>
        <li>We'll contact you within 2 hours to discuss details</li>
        <li>Receive a customized proposal with exact pricing</li>
        <li>Confirm and enjoy your luxury experience!</li>
      </ol>
    </div>

    <!-- CTA -->
    <div style="text-align: center;">
      <a href="${WHATSAPP_LINK}?text=Hi%2C%20I%20just%20submitted%20a%20VIP%20concierge%20request%20(Ref%3A%20${data.bookingRef})%20and%20would%20like%20to%20discuss%20details."
         style="display: inline-block; background: linear-gradient(135deg, #d4af37 0%, #f0d97a 100%); color: #1a1a1a; padding: 16px 40px; border-radius: 50px; font-weight: 600; font-size: 16px; box-shadow: 0 4px 14px rgba(212,175,55,0.4);">
        Chat with Concierge Team
      </a>
    </div>
  `;
    return (0, exports.emailWrapper)(content, 'VIP Concierge Request Confirmed - Recharge Travels', 'luxury');
};
exports.conciergeBookingTemplate = conciergeBookingTemplate;
// ==========================================
// TOUR BOOKING CONFIRMATION
// ==========================================
const tourBookingTemplate = (data) => {
    const content = `
    <!-- Success Header -->
    <div style="text-align: center; margin-bottom: 32px;">
      <div style="width: 80px; height: 80px; background: linear-gradient(135deg, ${BRAND_PRIMARY} 0%, #10b981 100%); border-radius: 50%; margin: 0 auto 20px; display: flex; align-items: center; justify-content: center; box-shadow: 0 8px 24px rgba(13,92,70,0.3);">
        <span style="font-size: 40px;">✓</span>
      </div>
      <h1 style="color: #1a1a1a; margin: 0; font-size: 28px; font-weight: 700;">
        Booking Confirmed!
      </h1>
      <p style="color: #6b7280; margin: 12px 0 0; font-size: 16px;">
        Get ready for an amazing Sri Lankan adventure
      </p>
    </div>

    <!-- Booking Reference -->
    <div style="background: linear-gradient(135deg, ${BRAND_PRIMARY} 0%, #10b981 100%); border-radius: 16px; padding: 24px; text-align: center; margin-bottom: 32px;">
      <p style="color: rgba(255,255,255,0.8); margin: 0 0 4px; font-size: 12px; text-transform: uppercase; letter-spacing: 2px;">
        Booking Reference
      </p>
      <p style="color: white; margin: 0; font-size: 32px; font-weight: 700; font-family: monospace; letter-spacing: 2px;">
        ${data.bookingRef}
      </p>
    </div>

    <!-- Tour Image & Name -->
    ${data.tourImage ? `
    <div style="margin-bottom: 24px; border-radius: 12px; overflow: hidden;">
      <img src="${data.tourImage}" alt="${data.tourName}" style="width: 100%; height: 200px; object-fit: cover;" />
    </div>
    ` : ''}

    <!-- Tour Details -->
    <div style="background-color: #f0fdf4; border-radius: 12px; padding: 24px; margin-bottom: 24px; border-left: 4px solid ${BRAND_PRIMARY};">
      <h3 style="color: #1a1a1a; margin: 0 0 16px; font-size: 18px; font-weight: 600;">
        🏝️ Tour Details
      </h3>
      <table width="100%" cellspacing="0" cellpadding="0">
        <tr>
          <td style="padding: 8px 0; color: #6b7280; font-size: 14px; width: 40%;">Tour Package</td>
          <td style="padding: 8px 0; color: #1a1a1a; font-size: 14px; font-weight: 600;">${data.tourName}</td>
        </tr>
        <tr>
          <td style="padding: 8px 0; color: #6b7280; font-size: 14px;">Travel Date</td>
          <td style="padding: 8px 0; color: #1a1a1a; font-size: 14px; font-weight: 600;">${data.tourDate}</td>
        </tr>
        <tr>
          <td style="padding: 8px 0; color: #6b7280; font-size: 14px;">Number of Guests</td>
          <td style="padding: 8px 0; color: #1a1a1a; font-size: 14px;">${data.guests} person(s)</td>
        </tr>
        ${data.pickupLocation ? `
        <tr>
          <td style="padding: 8px 0; color: #6b7280; font-size: 14px;">Pickup Location</td>
          <td style="padding: 8px 0; color: #1a1a1a; font-size: 14px;">${data.pickupLocation}</td>
        </tr>
        ` : ''}
      </table>
    </div>

    <!-- Guest Details -->
    <div style="background-color: #f9fafb; border-radius: 12px; padding: 24px; margin-bottom: 24px;">
      <h3 style="color: #1a1a1a; margin: 0 0 16px; font-size: 18px; font-weight: 600;">
        👤 Guest Information
      </h3>
      <table width="100%" cellspacing="0" cellpadding="0">
        <tr>
          <td style="padding: 8px 0; color: #6b7280; font-size: 14px; width: 40%;">Name</td>
          <td style="padding: 8px 0; color: #1a1a1a; font-size: 14px; font-weight: 600;">${data.firstName} ${data.lastName}</td>
        </tr>
        <tr>
          <td style="padding: 8px 0; color: #6b7280; font-size: 14px;">Email</td>
          <td style="padding: 8px 0; color: #1a1a1a; font-size: 14px;">${data.email}</td>
        </tr>
        <tr>
          <td style="padding: 8px 0; color: #6b7280; font-size: 14px;">Phone</td>
          <td style="padding: 8px 0; color: #1a1a1a; font-size: 14px;">${data.phone}</td>
        </tr>
      </table>
    </div>

    ${data.specialRequests ? `
    <!-- Special Requests -->
    <div style="background-color: #fef3c7; border-radius: 12px; padding: 20px; margin-bottom: 24px;">
      <h4 style="color: #92400e; margin: 0 0 8px; font-size: 14px; font-weight: 600;">
        📝 Special Requests
      </h4>
      <p style="color: #78350f; margin: 0; font-size: 14px; line-height: 1.6;">
        ${data.specialRequests}
      </p>
    </div>
    ` : ''}

    <!-- Payment Summary -->
    <div style="background: linear-gradient(135deg, #1f2937 0%, #374151 100%); border-radius: 12px; padding: 24px; margin-bottom: 24px;">
      <h3 style="color: white; margin: 0 0 16px; font-size: 18px; font-weight: 600;">
        💳 Payment Summary
      </h3>
      <table width="100%" cellspacing="0" cellpadding="0">
        <tr>
          <td style="padding: 12px 0; color: white; font-size: 18px; font-weight: 700;">Total Amount</td>
          <td style="padding: 12px 0; color: ${BRAND_SECONDARY}; font-size: 28px; font-weight: 700; text-align: right;">$${data.totalPrice.toLocaleString()}</td>
        </tr>
        <tr>
          <td style="padding: 8px 0; color: #9ca3af; font-size: 14px;">Payment Status</td>
          <td style="padding: 8px 0; text-align: right;">
            <span style="background-color: ${data.paymentStatus === 'paid' ? '#10b981' : '#f59e0b'}; color: white; padding: 4px 12px; border-radius: 20px; font-size: 12px; font-weight: 600;">
              ${data.paymentStatus.toUpperCase()}
            </span>
          </td>
        </tr>
      </table>
    </div>

    <!-- What to Bring -->
    <div style="background-color: #eff6ff; border-radius: 12px; padding: 24px; margin-bottom: 24px;">
      <h3 style="color: #1e40af; margin: 0 0 16px; font-size: 18px; font-weight: 600;">
        🎒 What to Bring
      </h3>
      <ul style="color: #374151; font-size: 14px; line-height: 2; margin: 0; padding-left: 20px;">
        <li>Valid passport/ID</li>
        <li>Comfortable clothing & footwear</li>
        <li>Sunscreen & sunglasses</li>
        <li>Camera for memories</li>
        <li>This booking confirmation</li>
      </ul>
    </div>

    <!-- CTA -->
    <div style="text-align: center;">
      <a href="${WHATSAPP_LINK}?text=Hi%2C%20I%20have%20a%20tour%20booking%20(Ref%3A%20${data.bookingRef})%20and%20have%20a%20question."
         style="display: inline-block; background: linear-gradient(135deg, ${BRAND_PRIMARY} 0%, #10b981 100%); color: white; padding: 16px 40px; border-radius: 50px; font-weight: 600; font-size: 16px; box-shadow: 0 4px 14px rgba(13,92,70,0.4);">
        Contact Tour Guide
      </a>
    </div>
  `;
    return (0, exports.emailWrapper)(content, 'Tour Booking Confirmed - Recharge Travels', 'booking');
};
exports.tourBookingTemplate = tourBookingTemplate;
// ==========================================
// AIRPORT TRANSFER CONFIRMATION
// ==========================================
const transferBookingTemplate = (data) => {
    const transferTypeLabel = {
        'arrival': '✈️ Airport Arrival Transfer',
        'departure': '🛫 Airport Departure Transfer',
        'round-trip': '🔄 Round Trip Transfer'
    }[data.transferType];
    const content = `
    <!-- Success Header -->
    <div style="text-align: center; margin-bottom: 32px;">
      <div style="width: 80px; height: 80px; background: linear-gradient(135deg, ${BRAND_PRIMARY} 0%, #10b981 100%); border-radius: 50%; margin: 0 auto 20px; display: flex; align-items: center; justify-content: center; box-shadow: 0 8px 24px rgba(13,92,70,0.3);">
        <span style="font-size: 40px;">🚗</span>
      </div>
      <h1 style="color: #1a1a1a; margin: 0; font-size: 28px; font-weight: 700;">
        Transfer Confirmed!
      </h1>
      <p style="color: #6b7280; margin: 12px 0 0; font-size: 16px;">
        ${transferTypeLabel}
      </p>
    </div>

    <!-- Booking Reference -->
    <div style="background: linear-gradient(135deg, ${BRAND_PRIMARY} 0%, #10b981 100%); border-radius: 16px; padding: 24px; text-align: center; margin-bottom: 32px;">
      <p style="color: rgba(255,255,255,0.8); margin: 0 0 4px; font-size: 12px; text-transform: uppercase; letter-spacing: 2px;">
        Booking Reference
      </p>
      <p style="color: white; margin: 0; font-size: 32px; font-weight: 700; font-family: monospace; letter-spacing: 2px;">
        ${data.bookingRef}
      </p>
    </div>

    <!-- Transfer Route -->
    <div style="background-color: #f0fdf4; border-radius: 12px; padding: 24px; margin-bottom: 24px;">
      <div style="display: flex; align-items: center; margin-bottom: 16px;">
        <div style="flex: 1;">
          <p style="color: #6b7280; margin: 0 0 4px; font-size: 12px; text-transform: uppercase;">From</p>
          <p style="color: #1a1a1a; margin: 0; font-size: 16px; font-weight: 600;">${data.pickupLocation}</p>
        </div>
        <div style="padding: 0 16px;">
          <span style="font-size: 24px;">→</span>
        </div>
        <div style="flex: 1; text-align: right;">
          <p style="color: #6b7280; margin: 0 0 4px; font-size: 12px; text-transform: uppercase;">To</p>
          <p style="color: #1a1a1a; margin: 0; font-size: 16px; font-weight: 600;">${data.dropoffLocation}</p>
        </div>
      </div>

      <div style="border-top: 1px solid #d1fae5; padding-top: 16px;">
        <table width="100%" cellspacing="0" cellpadding="0">
          <tr>
            <td style="padding: 8px 0; color: #6b7280; font-size: 14px;">📅 Pickup Date</td>
            <td style="padding: 8px 0; color: #1a1a1a; font-size: 14px; font-weight: 600; text-align: right;">${data.pickupDate}</td>
          </tr>
          <tr>
            <td style="padding: 8px 0; color: #6b7280; font-size: 14px;">⏰ Pickup Time</td>
            <td style="padding: 8px 0; color: #1a1a1a; font-size: 14px; font-weight: 600; text-align: right;">${data.pickupTime}</td>
          </tr>
          ${data.flightNumber ? `
          <tr>
            <td style="padding: 8px 0; color: #6b7280; font-size: 14px;">✈️ Flight Number</td>
            <td style="padding: 8px 0; color: #1a1a1a; font-size: 14px; font-weight: 600; text-align: right;">${data.flightNumber}</td>
          </tr>
          ` : ''}
          <tr>
            <td style="padding: 8px 0; color: #6b7280; font-size: 14px;">🚗 Vehicle Type</td>
            <td style="padding: 8px 0; color: #1a1a1a; font-size: 14px; font-weight: 600; text-align: right;">${data.vehicleType}</td>
          </tr>
          <tr>
            <td style="padding: 8px 0; color: #6b7280; font-size: 14px;">👥 Passengers</td>
            <td style="padding: 8px 0; color: #1a1a1a; font-size: 14px; text-align: right;">${data.passengers}</td>
          </tr>
        </table>
      </div>
    </div>

    ${data.driverName ? `
    <!-- Driver Info -->
    <div style="background-color: #eff6ff; border-radius: 12px; padding: 24px; margin-bottom: 24px; border-left: 4px solid #3b82f6;">
      <h3 style="color: #1e40af; margin: 0 0 16px; font-size: 18px; font-weight: 600;">
        🚘 Your Driver
      </h3>
      <table width="100%" cellspacing="0" cellpadding="0">
        <tr>
          <td style="padding: 8px 0; color: #6b7280; font-size: 14px;">Driver Name</td>
          <td style="padding: 8px 0; color: #1a1a1a; font-size: 14px; font-weight: 600; text-align: right;">${data.driverName}</td>
        </tr>
        ${data.driverPhone ? `
        <tr>
          <td style="padding: 8px 0; color: #6b7280; font-size: 14px;">Driver Contact</td>
          <td style="padding: 8px 0; color: #1a1a1a; font-size: 14px; text-align: right;">
            <a href="tel:${data.driverPhone}" style="color: #3b82f6;">${data.driverPhone}</a>
          </td>
        </tr>
        ` : ''}
      </table>
    </div>
    ` : ''}

    <!-- Guest Details -->
    <div style="background-color: #f9fafb; border-radius: 12px; padding: 24px; margin-bottom: 24px;">
      <h3 style="color: #1a1a1a; margin: 0 0 16px; font-size: 18px; font-weight: 600;">
        👤 Passenger Details
      </h3>
      <table width="100%" cellspacing="0" cellpadding="0">
        <tr>
          <td style="padding: 8px 0; color: #6b7280; font-size: 14px; width: 40%;">Name</td>
          <td style="padding: 8px 0; color: #1a1a1a; font-size: 14px; font-weight: 600;">${data.firstName} ${data.lastName}</td>
        </tr>
        <tr>
          <td style="padding: 8px 0; color: #6b7280; font-size: 14px;">Email</td>
          <td style="padding: 8px 0; color: #1a1a1a; font-size: 14px;">${data.email}</td>
        </tr>
        <tr>
          <td style="padding: 8px 0; color: #6b7280; font-size: 14px;">Phone</td>
          <td style="padding: 8px 0; color: #1a1a1a; font-size: 14px;">${data.phone}</td>
        </tr>
      </table>
    </div>

    <!-- Payment -->
    <div style="background: linear-gradient(135deg, #1f2937 0%, #374151 100%); border-radius: 12px; padding: 24px; margin-bottom: 24px; text-align: center;">
      <p style="color: #9ca3af; margin: 0 0 8px; font-size: 14px;">Total Amount</p>
      <p style="color: ${BRAND_SECONDARY}; margin: 0; font-size: 36px; font-weight: 700;">$${data.totalPrice}</p>
    </div>

    <!-- Important Info -->
    <div style="background-color: #fef3c7; border-radius: 12px; padding: 20px; margin-bottom: 24px;">
      <h4 style="color: #92400e; margin: 0 0 12px; font-size: 14px; font-weight: 600;">
        ⚠️ Important Information
      </h4>
      <ul style="color: #78350f; margin: 0; padding-left: 20px; font-size: 13px; line-height: 1.8;">
        <li>Driver will meet you at the arrival hall with a name board</li>
        <li>Free waiting time: 60 minutes for flight delays</li>
        <li>Please share your WhatsApp number for easy communication</li>
        <li>Keep this booking reference handy</li>
      </ul>
    </div>

    <!-- CTA -->
    <div style="text-align: center;">
      <a href="${WHATSAPP_LINK}?text=Hi%2C%20I%20have%20a%20transfer%20booking%20(Ref%3A%20${data.bookingRef})%20on%20${encodeURIComponent(data.pickupDate)}"
         style="display: inline-block; background: linear-gradient(135deg, ${BRAND_PRIMARY} 0%, #10b981 100%); color: white; padding: 16px 40px; border-radius: 50px; font-weight: 600; font-size: 16px; box-shadow: 0 4px 14px rgba(13,92,70,0.4);">
        Share WhatsApp Number
      </a>
    </div>
  `;
    return (0, exports.emailWrapper)(content, 'Transfer Booking Confirmed - Recharge Travels', 'booking');
};
exports.transferBookingTemplate = transferBookingTemplate;
// ==========================================
// WHALE WATCHING BOOKING
// ==========================================
const whaleWatchingTemplate = (data) => {
    const content = `
    <!-- Success Header -->
    <div style="text-align: center; margin-bottom: 32px;">
      <div style="width: 80px; height: 80px; background: linear-gradient(135deg, #0ea5e9 0%, #0284c7 100%); border-radius: 50%; margin: 0 auto 20px; display: flex; align-items: center; justify-content: center; box-shadow: 0 8px 24px rgba(14,165,233,0.3);">
        <span style="font-size: 40px;">🐋</span>
      </div>
      <h1 style="color: #1a1a1a; margin: 0; font-size: 28px; font-weight: 700;">
        Whale Watching Confirmed!
      </h1>
      <p style="color: #6b7280; margin: 12px 0 0; font-size: 16px;">
        Get ready to witness the magnificent blue whales
      </p>
    </div>

    <!-- Booking Reference -->
    <div style="background: linear-gradient(135deg, #0ea5e9 0%, #0284c7 100%); border-radius: 16px; padding: 24px; text-align: center; margin-bottom: 32px;">
      <p style="color: rgba(255,255,255,0.8); margin: 0 0 4px; font-size: 12px; text-transform: uppercase; letter-spacing: 2px;">
        Booking Reference
      </p>
      <p style="color: white; margin: 0; font-size: 32px; font-weight: 700; font-family: monospace; letter-spacing: 2px;">
        ${data.bookingRef}
      </p>
    </div>

    <!-- Tour Image -->
    <div style="margin-bottom: 24px; border-radius: 12px; overflow: hidden;">
      <img src="https://images.unsplash.com/photo-1568430462989-44163eb1752f?auto=format&fit=crop&w=1200&q=80" alt="Whale Watching" style="width: 100%; height: 200px; object-fit: cover;" />
    </div>

    <!-- Tour Details -->
    <div style="background-color: #f0f9ff; border-radius: 12px; padding: 24px; margin-bottom: 24px; border-left: 4px solid #0ea5e9;">
      <h3 style="color: #0c4a6e; margin: 0 0 16px; font-size: 18px; font-weight: 600;">
        🐋 Whale Watching Details
      </h3>
      <table width="100%" cellspacing="0" cellpadding="0">
        <tr>
          <td style="padding: 8px 0; color: #6b7280; font-size: 14px;">📅 Date</td>
          <td style="padding: 8px 0; color: #1a1a1a; font-size: 14px; font-weight: 600; text-align: right;">${data.tourDate}</td>
        </tr>
        <tr>
          <td style="padding: 8px 0; color: #6b7280; font-size: 14px;">⏰ Departure Time</td>
          <td style="padding: 8px 0; color: #1a1a1a; font-size: 14px; font-weight: 600; text-align: right;">${data.tourTime}</td>
        </tr>
        <tr>
          <td style="padding: 8px 0; color: #6b7280; font-size: 14px;">📍 Location</td>
          <td style="padding: 8px 0; color: #1a1a1a; font-size: 14px; text-align: right;">${data.location}</td>
        </tr>
        <tr>
          <td style="padding: 8px 0; color: #6b7280; font-size: 14px;">🚤 Boat Type</td>
          <td style="padding: 8px 0; color: #1a1a1a; font-size: 14px; text-align: right;">${data.boatType}</td>
        </tr>
        <tr>
          <td style="padding: 8px 0; color: #6b7280; font-size: 14px;">👥 Guests</td>
          <td style="padding: 8px 0; color: #1a1a1a; font-size: 14px; text-align: right;">${data.guests} person(s)</td>
        </tr>
        ${data.hotelPickup ? `
        <tr>
          <td style="padding: 8px 0; color: #6b7280; font-size: 14px;">🏨 Hotel Pickup</td>
          <td style="padding: 8px 0; color: #1a1a1a; font-size: 14px; text-align: right;">${data.hotelPickup}</td>
        </tr>
        ` : ''}
      </table>
    </div>

    <!-- Guest Details -->
    <div style="background-color: #f9fafb; border-radius: 12px; padding: 24px; margin-bottom: 24px;">
      <h3 style="color: #1a1a1a; margin: 0 0 16px; font-size: 18px; font-weight: 600;">
        👤 Guest Information
      </h3>
      <table width="100%" cellspacing="0" cellpadding="0">
        <tr>
          <td style="padding: 8px 0; color: #6b7280; font-size: 14px; width: 40%;">Name</td>
          <td style="padding: 8px 0; color: #1a1a1a; font-size: 14px; font-weight: 600;">${data.firstName} ${data.lastName}</td>
        </tr>
        <tr>
          <td style="padding: 8px 0; color: #6b7280; font-size: 14px;">Email</td>
          <td style="padding: 8px 0; color: #1a1a1a; font-size: 14px;">${data.email}</td>
        </tr>
        <tr>
          <td style="padding: 8px 0; color: #6b7280; font-size: 14px;">Phone</td>
          <td style="padding: 8px 0; color: #1a1a1a; font-size: 14px;">${data.phone}</td>
        </tr>
      </table>
    </div>

    <!-- Payment -->
    <div style="background: linear-gradient(135deg, #1f2937 0%, #374151 100%); border-radius: 12px; padding: 24px; margin-bottom: 24px; text-align: center;">
      <p style="color: #9ca3af; margin: 0 0 8px; font-size: 14px;">Total Amount</p>
      <p style="color: #0ea5e9; margin: 0; font-size: 36px; font-weight: 700;">$${data.totalPrice}</p>
    </div>

    <!-- What to Bring -->
    <div style="background-color: #fef3c7; border-radius: 12px; padding: 20px; margin-bottom: 24px;">
      <h4 style="color: #92400e; margin: 0 0 12px; font-size: 14px; font-weight: 600;">
        🎒 What to Bring
      </h4>
      <ul style="color: #78350f; margin: 0; padding-left: 20px; font-size: 13px; line-height: 1.8;">
        <li>Sunscreen & hat (essential!)</li>
        <li>Motion sickness tablets if needed</li>
        <li>Camera with zoom lens</li>
        <li>Light jacket (can be windy at sea)</li>
        <li>This booking confirmation</li>
      </ul>
    </div>

    <!-- CTA -->
    <div style="text-align: center;">
      <a href="${WHATSAPP_LINK}?text=Hi%2C%20I%20have%20a%20whale%20watching%20booking%20(Ref%3A%20${data.bookingRef})%20on%20${encodeURIComponent(data.tourDate)}"
         style="display: inline-block; background: linear-gradient(135deg, #0ea5e9 0%, #0284c7 100%); color: white; padding: 16px 40px; border-radius: 50px; font-weight: 600; font-size: 16px; box-shadow: 0 4px 14px rgba(14,165,233,0.4);">
        Contact for Questions
      </a>
    </div>
  `;
    return (0, exports.emailWrapper)(content, 'Whale Watching Booking Confirmed - Recharge Travels', 'booking');
};
exports.whaleWatchingTemplate = whaleWatchingTemplate;
// ==========================================
// WELCOME EMAIL FOR NEW CUSTOMERS
// ==========================================
const welcomeEmailTemplate = (data) => {
    const content = `
    <!-- Welcome Header -->
    <div style="text-align: center; margin-bottom: 32px;">
      <h1 style="color: #1a1a1a; margin: 0; font-size: 32px; font-weight: 700; font-family: 'Playfair Display', serif;">
        Welcome to Recharge Travels! 🌴
      </h1>
      <p style="color: #6b7280; margin: 16px 0 0; font-size: 16px; line-height: 1.6;">
        Hi ${data.firstName}, thank you for joining us!<br/>
        Your Sri Lankan adventure begins here.
      </p>
    </div>

    <!-- Hero Image -->
    <div style="margin-bottom: 32px; border-radius: 12px; overflow: hidden;">
      <img src="${HERO_IMAGE}" alt="Sri Lanka" style="width: 100%; height: 220px; object-fit: cover;" />
    </div>

    <!-- What We Offer -->
    <div style="margin-bottom: 32px;">
      <h2 style="color: ${BRAND_PRIMARY}; margin: 0 0 20px; font-size: 20px; font-weight: 600; text-align: center;">
        Discover What Awaits You
      </h2>

      <table width="100%" cellspacing="0" cellpadding="0">
        <tr>
          <td width="50%" style="padding: 8px;">
            <div style="background-color: #f0fdf4; border-radius: 12px; padding: 20px; text-align: center; height: 120px;">
              <span style="font-size: 32px; display: block; margin-bottom: 8px;">🏝️</span>
              <p style="color: ${BRAND_PRIMARY}; margin: 0; font-weight: 600; font-size: 14px;">Guided Tours</p>
              <p style="color: #6b7280; margin: 4px 0 0; font-size: 12px;">50+ unique experiences</p>
            </div>
          </td>
          <td width="50%" style="padding: 8px;">
            <div style="background-color: #fef3c7; border-radius: 12px; padding: 20px; text-align: center; height: 120px;">
              <span style="font-size: 32px; display: block; margin-bottom: 8px;">🐘</span>
              <p style="color: #92400e; margin: 0; font-weight: 600; font-size: 14px;">Wildlife Safaris</p>
              <p style="color: #6b7280; margin: 4px 0 0; font-size: 12px;">Yala, Udawalawe & more</p>
            </div>
          </td>
        </tr>
        <tr>
          <td width="50%" style="padding: 8px;">
            <div style="background-color: #f0f9ff; border-radius: 12px; padding: 20px; text-align: center; height: 120px;">
              <span style="font-size: 32px; display: block; margin-bottom: 8px;">🐋</span>
              <p style="color: #0c4a6e; margin: 0; font-weight: 600; font-size: 14px;">Whale Watching</p>
              <p style="color: #6b7280; margin: 4px 0 0; font-size: 12px;">Blue whales in Mirissa</p>
            </div>
          </td>
          <td width="50%" style="padding: 8px;">
            <div style="background-color: #faf5eb; border-radius: 12px; padding: 20px; text-align: center; height: 120px;">
              <span style="font-size: 32px; display: block; margin-bottom: 8px;">👑</span>
              <p style="color: #92400e; margin: 0; font-weight: 600; font-size: 14px;">VIP Concierge</p>
              <p style="color: #6b7280; margin: 4px 0 0; font-size: 12px;">Luxury experiences</p>
            </div>
          </td>
        </tr>
      </table>
    </div>

    <!-- Why Choose Us -->
    <div style="background-color: #f9fafb; border-radius: 12px; padding: 24px; margin-bottom: 32px;">
      <h3 style="color: #1a1a1a; margin: 0 0 16px; font-size: 18px; font-weight: 600; text-align: center;">
        ⭐ Why 10,000+ Travelers Trust Us
      </h3>
      <table width="100%" cellspacing="0" cellpadding="0">
        <tr>
          <td style="padding: 8px 0; font-size: 14px;">
            <span style="color: ${BRAND_PRIMARY}; font-weight: 600;">✓</span>
            <span style="color: #374151; margin-left: 8px;">4.9/5 Rating on TripAdvisor</span>
          </td>
        </tr>
        <tr>
          <td style="padding: 8px 0; font-size: 14px;">
            <span style="color: ${BRAND_PRIMARY}; font-weight: 600;">✓</span>
            <span style="color: #374151; margin-left: 8px;">SLTDA Licensed & Safe Travels Certified</span>
          </td>
        </tr>
        <tr>
          <td style="padding: 8px 0; font-size: 14px;">
            <span style="color: ${BRAND_PRIMARY}; font-weight: 600;">✓</span>
            <span style="color: #374151; margin-left: 8px;">24/7 Customer Support</span>
          </td>
        </tr>
        <tr>
          <td style="padding: 8px 0; font-size: 14px;">
            <span style="color: ${BRAND_PRIMARY}; font-weight: 600;">✓</span>
            <span style="color: #374151; margin-left: 8px;">Best Price Guarantee</span>
          </td>
        </tr>
      </table>
    </div>

    <!-- CTA -->
    <div style="text-align: center;">
      <a href="${WEBSITE_URL}/tours"
         style="display: inline-block; background: linear-gradient(135deg, ${BRAND_PRIMARY} 0%, #10b981 100%); color: white; padding: 16px 48px; border-radius: 50px; font-weight: 600; font-size: 16px; box-shadow: 0 4px 14px rgba(13,92,70,0.4); margin-bottom: 16px;">
        Explore Tours
      </a>
      <p style="color: #6b7280; margin: 16px 0 0; font-size: 14px;">
        Or chat with us on WhatsApp for personalized recommendations
      </p>
    </div>
  `;
    return (0, exports.emailWrapper)(content, 'Welcome to Recharge Travels!', 'general');
};
exports.welcomeEmailTemplate = welcomeEmailTemplate;
// ==========================================
// BOOKING REMINDER EMAIL
// ==========================================
const bookingReminderTemplate = (data) => {
    const content = `
    <!-- Reminder Header -->
    <div style="text-align: center; margin-bottom: 32px;">
      <div style="width: 80px; height: 80px; background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%); border-radius: 50%; margin: 0 auto 20px; display: flex; align-items: center; justify-content: center;">
        <span style="font-size: 40px;">⏰</span>
      </div>
      <h1 style="color: #1a1a1a; margin: 0; font-size: 28px; font-weight: 700;">
        ${data.daysUntil === 1 ? 'Your Tour is Tomorrow!' : `${data.daysUntil} Days Until Your Tour!`}
      </h1>
      <p style="color: #6b7280; margin: 12px 0 0; font-size: 16px;">
        Hi ${data.firstName}, your adventure is almost here!
      </p>
    </div>

    <!-- Booking Summary -->
    <div style="background: linear-gradient(135deg, ${BRAND_PRIMARY} 0%, #10b981 100%); border-radius: 16px; padding: 24px; margin-bottom: 24px; color: white;">
      <p style="margin: 0 0 4px; font-size: 12px; opacity: 0.8; text-transform: uppercase; letter-spacing: 1px;">Booking Reference</p>
      <p style="margin: 0 0 16px; font-size: 24px; font-weight: 700; font-family: monospace;">${data.bookingRef}</p>

      <table width="100%" cellspacing="0" cellpadding="0">
        <tr>
          <td style="padding: 8px 0; font-size: 14px; opacity: 0.8;">Tour</td>
          <td style="padding: 8px 0; font-size: 14px; font-weight: 600; text-align: right;">${data.tourName}</td>
        </tr>
        <tr>
          <td style="padding: 8px 0; font-size: 14px; opacity: 0.8;">Date</td>
          <td style="padding: 8px 0; font-size: 14px; font-weight: 600; text-align: right;">${data.tourDate}</td>
        </tr>
        ${data.tourTime ? `
        <tr>
          <td style="padding: 8px 0; font-size: 14px; opacity: 0.8;">Time</td>
          <td style="padding: 8px 0; font-size: 14px; font-weight: 600; text-align: right;">${data.tourTime}</td>
        </tr>
        ` : ''}
        ${data.pickupLocation ? `
        <tr>
          <td style="padding: 8px 0; font-size: 14px; opacity: 0.8;">Pickup</td>
          <td style="padding: 8px 0; font-size: 14px; font-weight: 600; text-align: right;">${data.pickupLocation}</td>
        </tr>
        ` : ''}
      </table>
    </div>

    <!-- Checklist -->
    <div style="background-color: #f9fafb; border-radius: 12px; padding: 24px; margin-bottom: 24px;">
      <h3 style="color: #1a1a1a; margin: 0 0 16px; font-size: 18px; font-weight: 600;">
        ✅ Pre-Tour Checklist
      </h3>
      <ul style="color: #374151; font-size: 14px; line-height: 2.2; margin: 0; padding-left: 20px;">
        <li>Confirm your pickup time and location</li>
        <li>Check weather forecast and pack accordingly</li>
        <li>Charge your camera/phone</li>
        <li>Bring valid ID/passport</li>
        <li>Save our WhatsApp number: ${WHATSAPP_NUMBER}</li>
      </ul>
    </div>

    <!-- CTA -->
    <div style="text-align: center;">
      <a href="${WHATSAPP_LINK}?text=Hi%2C%20I%20have%20a%20booking%20(Ref%3A%20${data.bookingRef})%20coming%20up%20and%20wanted%20to%20confirm%20details."
         style="display: inline-block; background: linear-gradient(135deg, ${BRAND_PRIMARY} 0%, #10b981 100%); color: white; padding: 16px 40px; border-radius: 50px; font-weight: 600; font-size: 16px; box-shadow: 0 4px 14px rgba(13,92,70,0.4);">
        Confirm with Tour Guide
      </a>
    </div>
  `;
    return (0, exports.emailWrapper)(content, 'Tour Reminder - Recharge Travels', 'booking');
};
exports.bookingReminderTemplate = bookingReminderTemplate;
// B2B Booking Confirmation Template (keeping existing)
const bookingConfirmationTemplate = (data) => {
    const content = `
    <div style="text-align: center; margin-bottom: 32px;">
      <div style="width: 80px; height: 80px; background-color: #d1fae5; border-radius: 50%; margin: 0 auto 16px; display: flex; align-items: center; justify-content: center;">
        <span style="font-size: 40px;">✓</span>
      </div>
      <h2 style="color: #111827; margin: 0; font-size: 28px; font-weight: 700;">
        B2B Booking Confirmed!
      </h2>
      <p style="color: #6b7280; margin: 12px 0 0; font-size: 16px;">
        Tour booking placed via ${data.agencyName}
      </p>
    </div>

    <!-- Booking Reference -->
    <div style="background: linear-gradient(135deg, #f0fdf4 0%, #ecfdf5 100%); border: 2px solid ${BRAND_PRIMARY}; border-radius: 12px; padding: 20px; text-align: center; margin-bottom: 32px;">
      <p style="color: #6b7280; margin: 0 0 4px; font-size: 12px; text-transform: uppercase; letter-spacing: 1px;">
        Booking Reference
      </p>
      <p style="color: ${BRAND_DARK}; margin: 0; font-size: 28px; font-weight: 700; font-family: monospace;">
        ${data.bookingId}
      </p>
    </div>

    <!-- Tour Details -->
    <div style="background-color: #f9fafb; border-radius: 12px; padding: 24px; margin-bottom: 24px;">
      <h3 style="color: #111827; margin: 0 0 16px; font-size: 18px; font-weight: 600;">
        🏝️ Tour Details
      </h3>
      <table width="100%" cellspacing="0" cellpadding="0">
        <tr>
          <td style="padding: 8px 0; color: #6b7280; font-size: 14px;">Tour Package</td>
          <td style="padding: 8px 0; color: #111827; font-size: 14px; font-weight: 600; text-align: right;">${data.tourName}</td>
        </tr>
        <tr>
          <td style="padding: 8px 0; color: #6b7280; font-size: 14px;">Travel Date</td>
          <td style="padding: 8px 0; color: #111827; font-size: 14px; font-weight: 600; text-align: right;">${data.tourDate}</td>
        </tr>
        <tr>
          <td style="padding: 8px 0; color: #6b7280; font-size: 14px;">Number of Guests</td>
          <td style="padding: 8px 0; color: #111827; font-size: 14px; font-weight: 600; text-align: right;">${data.guestCount} person(s)</td>
        </tr>
      </table>
    </div>

    <!-- Client Details -->
    <div style="background-color: #f9fafb; border-radius: 12px; padding: 24px; margin-bottom: 24px;">
      <h3 style="color: #111827; margin: 0 0 16px; font-size: 18px; font-weight: 600;">
        👤 Client Information
      </h3>
      <table width="100%" cellspacing="0" cellpadding="0">
        <tr>
          <td style="padding: 8px 0; color: #6b7280; font-size: 14px;">Name</td>
          <td style="padding: 8px 0; color: #111827; font-size: 14px; font-weight: 600; text-align: right;">${data.clientName}</td>
        </tr>
        <tr>
          <td style="padding: 8px 0; color: #6b7280; font-size: 14px;">Email</td>
          <td style="padding: 8px 0; color: #111827; font-size: 14px; text-align: right;">${data.clientEmail}</td>
        </tr>
        <tr>
          <td style="padding: 8px 0; color: #6b7280; font-size: 14px;">Phone</td>
          <td style="padding: 8px 0; color: #111827; font-size: 14px; text-align: right;">${data.clientPhone}</td>
        </tr>
      </table>
    </div>

    <!-- Payment Summary -->
    <div style="background-color: #111827; border-radius: 12px; padding: 24px; margin-bottom: 24px;">
      <h3 style="color: white; margin: 0 0 16px; font-size: 18px; font-weight: 600;">
        💳 Payment Summary
      </h3>
      <table width="100%" cellspacing="0" cellpadding="0">
        <tr>
          <td style="padding: 8px 0; color: #9ca3af; font-size: 14px;">Original Price</td>
          <td style="padding: 8px 0; color: white; font-size: 14px; text-align: right;">$${data.originalPrice.toFixed(2)}</td>
        </tr>
        <tr>
          <td style="padding: 8px 0; color: ${BRAND_PRIMARY}; font-size: 14px;">B2B Partner Discount (10%)</td>
          <td style="padding: 8px 0; color: ${BRAND_PRIMARY}; font-size: 14px; text-align: right;">-$${data.discount.toFixed(2)}</td>
        </tr>
        <tr>
          <td colspan="2" style="border-top: 1px solid #374151; padding-top: 12px;"></td>
        </tr>
        <tr>
          <td style="padding: 8px 0; color: white; font-size: 18px; font-weight: 700;">Total Amount</td>
          <td style="padding: 8px 0; color: ${BRAND_SECONDARY}; font-size: 24px; font-weight: 700; text-align: right;">$${data.finalPrice.toFixed(2)}</td>
        </tr>
      </table>
    </div>

    ${data.specialRequests ? `
    <div style="background-color: #fef3c7; border-radius: 12px; padding: 20px; margin-bottom: 24px;">
      <h4 style="color: #92400e; margin: 0 0 8px; font-size: 14px; font-weight: 600;">
        📝 Special Requests
      </h4>
      <p style="color: #78350f; margin: 0; font-size: 14px;">
        ${data.specialRequests}
      </p>
    </div>
    ` : ''}

    <!-- Agency Info -->
    <div style="background-color: #eff6ff; border-radius: 12px; padding: 20px; margin-bottom: 24px; text-align: center;">
      <p style="color: #1e40af; margin: 0; font-size: 14px;">
        <strong>Booked by:</strong> ${data.agencyName} (B2B Partner)
      </p>
    </div>
  `;
    return (0, exports.emailWrapper)(content, 'B2B Booking Confirmation - Recharge Travels', 'booking');
};
exports.bookingConfirmationTemplate = bookingConfirmationTemplate;
// Keep other B2B templates as they are
const agencyWelcomeTemplate = (data) => {
    const content = `
    <div style="text-align: center; margin-bottom: 32px;">
      <h2 style="color: #111827; margin: 0; font-size: 28px; font-weight: 700;">
        Welcome to Recharge Travels B2B! 🎉
      </h2>
      <p style="color: #6b7280; margin: 12px 0 0; font-size: 16px;">
        Thank you for registering as a B2B partner
      </p>
    </div>

    <p style="color: #374151; font-size: 16px; line-height: 1.6; margin-bottom: 24px;">
      Dear <strong>${data.agencyName}</strong>,
    </p>

    <p style="color: #374151; font-size: 16px; line-height: 1.6; margin-bottom: 24px;">
      We're thrilled to have you join our B2B partner network! To complete your registration and start booking tours for your clients, please verify your email address.
    </p>

    <div style="text-align: center; margin: 40px 0;">
      <a href="${data.verificationLink}"
         style="display: inline-block; background: linear-gradient(135deg, ${BRAND_PRIMARY} 0%, #10b981 100%); color: white; text-decoration: none; padding: 16px 48px; border-radius: 12px; font-weight: 600; font-size: 16px; box-shadow: 0 4px 14px rgba(13,92,70,0.4);">
        Verify Email Address
      </a>
    </div>

    <div style="background-color: #f9fafb; border-radius: 12px; padding: 24px; margin-bottom: 24px;">
      <h3 style="color: #111827; margin: 0 0 16px; font-size: 18px; font-weight: 600;">
        ✨ Your B2B Partner Benefits
      </h3>
      <ul style="color: #374151; font-size: 14px; line-height: 2; margin: 0; padding-left: 20px;">
        <li><strong style="color: ${BRAND_PRIMARY};">10% Exclusive Discount</strong> on all tour packages</li>
        <li>Priority booking & instant confirmation</li>
        <li>Dedicated B2B support line</li>
        <li>Flexible payment options</li>
      </ul>
    </div>
  `;
    return (0, exports.emailWrapper)(content, 'Welcome to Recharge Travels B2B', 'general');
};
exports.agencyWelcomeTemplate = agencyWelcomeTemplate;
const agencyApprovalTemplate = (data) => {
    const content = `
    <div style="text-align: center; margin-bottom: 32px;">
      <div style="width: 80px; height: 80px; background-color: #d1fae5; border-radius: 50%; margin: 0 auto 16px;">
        <span style="font-size: 40px; line-height: 80px;">🎊</span>
      </div>
      <h2 style="color: #111827; margin: 0; font-size: 28px; font-weight: 700;">
        You're Approved!
      </h2>
    </div>

    <p style="color: #374151; font-size: 16px; line-height: 1.6; margin-bottom: 24px;">
      Dear <strong>${data.agencyName}</strong>,
    </p>

    <p style="color: #374151; font-size: 16px; line-height: 1.6; margin-bottom: 24px;">
      Your B2B partner application has been approved. You can now access the full range of our tour packages with your exclusive 10% partner discount.
    </p>

    <div style="text-align: center; margin: 40px 0;">
      <a href="${data.loginLink}"
         style="display: inline-block; background: linear-gradient(135deg, ${BRAND_PRIMARY} 0%, #10b981 100%); color: white; text-decoration: none; padding: 16px 48px; border-radius: 12px; font-weight: 600; font-size: 16px;">
        Start Booking Now
      </a>
    </div>
  `;
    return (0, exports.emailWrapper)(content, 'Account Approved - Recharge Travels B2B', 'general');
};
exports.agencyApprovalTemplate = agencyApprovalTemplate;
const paymentConfirmationTemplate = (data) => {
    const content = `
    <div style="text-align: center; margin-bottom: 32px;">
      <div style="width: 80px; height: 80px; background-color: #d1fae5; border-radius: 50%; margin: 0 auto 16px;">
        <span style="font-size: 40px; line-height: 80px;">💳</span>
      </div>
      <h2 style="color: #111827; margin: 0; font-size: 28px; font-weight: 700;">
        Payment Received!
      </h2>
    </div>

    <div style="background-color: #f0fdf4; border: 2px solid ${BRAND_PRIMARY}; border-radius: 12px; padding: 24px; margin-bottom: 24px;">
      <table width="100%" cellspacing="0" cellpadding="0">
        <tr>
          <td style="padding: 8px 0; color: #6b7280; font-size: 14px;">Booking Reference</td>
          <td style="padding: 8px 0; color: #111827; font-size: 14px; font-weight: 600; text-align: right;">${data.bookingId}</td>
        </tr>
        <tr>
          <td style="padding: 8px 0; color: #6b7280; font-size: 14px;">Tour Package</td>
          <td style="padding: 8px 0; color: #111827; font-size: 14px; text-align: right;">${data.tourName}</td>
        </tr>
        <tr>
          <td style="padding: 8px 0; color: #6b7280; font-size: 14px;">Payment Method</td>
          <td style="padding: 8px 0; color: #111827; font-size: 14px; text-align: right;">${data.paymentMethod}</td>
        </tr>
        ${data.transactionId ? `
        <tr>
          <td style="padding: 8px 0; color: #6b7280; font-size: 14px;">Transaction ID</td>
          <td style="padding: 8px 0; color: #111827; font-size: 12px; text-align: right; font-family: monospace;">${data.transactionId}</td>
        </tr>
        ` : ''}
        <tr>
          <td colspan="2" style="border-top: 1px solid #a7f3d0; padding-top: 12px;"></td>
        </tr>
        <tr>
          <td style="padding: 8px 0; color: #111827; font-size: 18px; font-weight: 700;">Amount Paid</td>
          <td style="padding: 8px 0; color: ${BRAND_DARK}; font-size: 24px; font-weight: 700; text-align: right;">$${data.amount.toFixed(2)}</td>
        </tr>
      </table>
    </div>
  `;
    return (0, exports.emailWrapper)(content, 'Payment Confirmation - Recharge Travels', 'booking');
};
exports.paymentConfirmationTemplate = paymentConfirmationTemplate;
const passwordResetTemplate = (data) => {
    const content = `
    <div style="text-align: center; margin-bottom: 32px;">
      <h2 style="color: #111827; margin: 0; font-size: 28px; font-weight: 700;">
        Password Reset Request
      </h2>
    </div>

    <p style="color: #374151; font-size: 16px; line-height: 1.6; margin-bottom: 24px;">
      Dear <strong>${data.agencyName}</strong>,
    </p>

    <p style="color: #374151; font-size: 16px; line-height: 1.6; margin-bottom: 24px;">
      We received a request to reset your B2B portal password.
    </p>

    <div style="text-align: center; margin: 40px 0;">
      <a href="${data.resetLink}"
         style="display: inline-block; background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%); color: white; text-decoration: none; padding: 16px 48px; border-radius: 12px; font-weight: 600; font-size: 16px;">
        Reset Password
      </a>
    </div>

    <p style="color: #6b7280; font-size: 14px; text-align: center;">
      This link will expire in 1 hour.
    </p>
  `;
    return (0, exports.emailWrapper)(content, 'Password Reset - Recharge Travels B2B', 'general');
};
exports.passwordResetTemplate = passwordResetTemplate;
const bookingCancellationTemplate = (data) => {
    const content = `
    <div style="text-align: center; margin-bottom: 32px;">
      <div style="width: 80px; height: 80px; background-color: #fee2e2; border-radius: 50%; margin: 0 auto 16px;">
        <span style="font-size: 40px; line-height: 80px;">❌</span>
      </div>
      <h2 style="color: #111827; margin: 0; font-size: 28px; font-weight: 700;">
        Booking Cancelled
      </h2>
    </div>

    <div style="background-color: #fef2f2; border: 2px solid #fecaca; border-radius: 12px; padding: 24px; margin-bottom: 24px;">
      <table width="100%" cellspacing="0" cellpadding="0">
        <tr>
          <td style="padding: 8px 0; color: #6b7280; font-size: 14px;">Booking Reference</td>
          <td style="padding: 8px 0; color: #111827; font-size: 14px; font-weight: 600; text-align: right;">${data.bookingId}</td>
        </tr>
        <tr>
          <td style="padding: 8px 0; color: #6b7280; font-size: 14px;">Tour Package</td>
          <td style="padding: 8px 0; color: #111827; font-size: 14px; text-align: right;">${data.tourName}</td>
        </tr>
        <tr>
          <td style="padding: 8px 0; color: #6b7280; font-size: 14px;">Original Date</td>
          <td style="padding: 8px 0; color: #111827; font-size: 14px; text-align: right;">${data.tourDate}</td>
        </tr>
      </table>
    </div>

    ${data.refundAmount ? `
    <div style="background-color: #f0fdf4; border-radius: 12px; padding: 20px; margin-bottom: 24px; text-align: center;">
      <p style="color: #166534; margin: 0; font-size: 14px;">
        💰 A refund of <strong>$${data.refundAmount.toFixed(2)}</strong> will be processed within 5-7 business days.
      </p>
    </div>
    ` : ''}

    ${data.reason ? `
    <div style="background-color: #f9fafb; border-radius: 12px; padding: 20px; margin-bottom: 24px;">
      <p style="color: #6b7280; margin: 0 0 8px; font-size: 12px; text-transform: uppercase;">Reason</p>
      <p style="color: #374151; margin: 0; font-size: 14px;">${data.reason}</p>
    </div>
    ` : ''}
  `;
    return (0, exports.emailWrapper)(content, 'Booking Cancelled - Recharge Travels', 'booking');
};
exports.bookingCancellationTemplate = bookingCancellationTemplate;
exports.default = {
    emailWrapper: exports.emailWrapper,
    conciergeBookingTemplate: exports.conciergeBookingTemplate,
    tourBookingTemplate: exports.tourBookingTemplate,
    transferBookingTemplate: exports.transferBookingTemplate,
    whaleWatchingTemplate: exports.whaleWatchingTemplate,
    welcomeEmailTemplate: exports.welcomeEmailTemplate,
    bookingReminderTemplate: exports.bookingReminderTemplate,
    bookingConfirmationTemplate: exports.bookingConfirmationTemplate,
    agencyWelcomeTemplate: exports.agencyWelcomeTemplate,
    agencyApprovalTemplate: exports.agencyApprovalTemplate,
    paymentConfirmationTemplate: exports.paymentConfirmationTemplate,
    passwordResetTemplate: exports.passwordResetTemplate,
    bookingCancellationTemplate: exports.bookingCancellationTemplate
};
//# sourceMappingURL=templates.js.map