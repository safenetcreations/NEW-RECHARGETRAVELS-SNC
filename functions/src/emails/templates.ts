// Recharge Travels Email Templates
// Professional branded email templates for all booking types

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

export const emailWrapper = (content: string, title: string, type: 'general' | 'luxury' | 'booking' = 'general') => {
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

// ==========================================
// VIP CONCIERGE BOOKING CONFIRMATION
// ==========================================

export const conciergeBookingTemplate = (data: {
  bookingRef: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  preferredDate: string;
  alternateDate?: string;
  location: string;
  guests: number;
  duration: string;
  budget: string;
  selectedServices: string[];
  estimatedTotal: number;
  specialRequests?: string;
}) => {
  const servicesHtml = data.selectedServices.map(service =>
    `<li style="padding: 8px 0; color: #374151; border-bottom: 1px solid #f3f4f6;">✓ ${service}</li>`
  ).join('');

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

  return emailWrapper(content, 'VIP Concierge Request Confirmed - Recharge Travels', 'luxury');
};

// ==========================================
// TOUR BOOKING CONFIRMATION
// ==========================================

export const tourBookingTemplate = (data: {
  bookingRef: string;
  tourName: string;
  tourDate: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  guests: number;
  totalPrice: number;
  paymentStatus: string;
  pickupLocation?: string;
  specialRequests?: string;
  tourImage?: string;
}) => {
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

  return emailWrapper(content, 'Tour Booking Confirmed - Recharge Travels', 'booking');
};

// ==========================================
// AIRPORT TRANSFER CONFIRMATION
// ==========================================

export const transferBookingTemplate = (data: {
  bookingRef: string;
  transferType: 'arrival' | 'departure' | 'round-trip';
  pickupLocation: string;
  dropoffLocation: string;
  pickupDate: string;
  pickupTime: string;
  flightNumber?: string;
  vehicleType: string;
  passengers: number;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  totalPrice: number;
  driverName?: string;
  driverPhone?: string;
}) => {
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

  return emailWrapper(content, 'Transfer Booking Confirmed - Recharge Travels', 'booking');
};

// ==========================================
// WHALE WATCHING BOOKING
// ==========================================

export const whaleWatchingTemplate = (data: {
  bookingRef: string;
  tourDate: string;
  tourTime: string;
  location: string;
  guests: number;
  boatType: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  totalPrice: number;
  hotelPickup?: string;
}) => {
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

  return emailWrapper(content, 'Whale Watching Booking Confirmed - Recharge Travels', 'booking');
};

// ==========================================
// WELCOME EMAIL FOR NEW CUSTOMERS
// ==========================================

export const welcomeEmailTemplate = (data: {
  firstName: string;
  email: string;
}) => {
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

  return emailWrapper(content, 'Welcome to Recharge Travels!', 'general');
};

// ==========================================
// BOOKING REMINDER EMAIL
// ==========================================

export const bookingReminderTemplate = (data: {
  firstName: string;
  bookingRef: string;
  tourName: string;
  tourDate: string;
  tourTime?: string;
  daysUntil: number;
  pickupLocation?: string;
}) => {
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

  return emailWrapper(content, 'Tour Reminder - Recharge Travels', 'booking');
};

// Export existing B2B templates
export { emailWrapper as b2bEmailWrapper };

// B2B Booking Confirmation Template
export const bookingConfirmationTemplate = (data: {
  bookingId: string;
  agencyName: string;
  tourName: string;
  tourDate: string;
  clientName: string;
  clientEmail: string;
  clientPhone: string;
  guestCount: number;
  originalPrice: number;
  discount: number;
  finalPrice: number;
  specialRequests?: string;
}) => {
  const content = `
    <!-- Success Header -->
    <div style="text-align: center; margin-bottom: 32px;">
      <div style="width: 80px; height: 80px; background: linear-gradient(135deg, ${BRAND_PRIMARY} 0%, #10b981 100%); border-radius: 50%; margin: 0 auto 16px; display: flex; align-items: center; justify-content: center; box-shadow: 0 8px 24px rgba(13,92,70,0.3);">
        <span style="font-size: 40px;">✓</span>
      </div>
      <h2 style="color: #111827; margin: 0; font-size: 28px; font-weight: 700;">
        B2B Booking Confirmed!
      </h2>
      <p style="color: #6b7280; margin: 12px 0 0; font-size: 16px;">
        Booking successfully placed by ${data.agencyName}
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
      <div style="margin-top: 8px;">
        <span style="background-color: #10b981; color: white; padding: 2px 10px; border-radius: 12px; font-size: 12px; font-weight: 600;">ACTIVE</span>
      </div>
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
          <td style="padding: 8px 0; color: ${BRAND_PRIMARY}; font-size: 14px;">B2B Partner Commission (15%)</td>
          <td style="padding: 8px 0; color: ${BRAND_PRIMARY}; font-size: 14px; text-align: right;">-$${data.discount.toFixed(2)}</td>
        </tr>
        <tr>
          <td colspan="2" style="border-top: 1px solid #374151; padding-top: 12px;"></td>
        </tr>
        <tr>
          <td style="padding: 8px 0; color: white; font-size: 18px; font-weight: 700;">Nett Amount Due</td>
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

    <div style="text-align: center; margin-top: 32px;">
      <p style="color: #6b7280; font-size: 14px;">
        Need help? Contact our B2B Support: <a href="mailto:partners@rechargetravels.com" style="color: ${BRAND_PRIMARY}; font-weight: 600;">partners@rechargetravels.com</a>
      </p>
    </div>
  `;

  return emailWrapper(content, 'B2B Booking Confirmation - Recharge Travels', 'booking');
};

// Keep other B2B templates as they are
export const agencyWelcomeTemplate = (data: { agencyName: string; email: string; verificationLink: string; }) => {
  const content = `
    <div style="text-align: center; margin-bottom: 32px;">
      <h2 style="color: #111827; margin: 0; font-size: 28px; font-weight: 700;">
        Welcome to Recharge Travels B2B! 🎉
      </h2>
      <p style="color: #6b7280; margin: 12px 0 0; font-size: 16px;">
        Partner with Sri Lanka's Premium DMC
      </p>
    </div>

    <p style="color: #374151; font-size: 16px; line-height: 1.6; margin-bottom: 24px;">
      Dear <strong>${data.agencyName}</strong>,
    </p>

    <p style="color: #374151; font-size: 16px; line-height: 1.6; margin-bottom: 24px;">
      We're thrilled to welcome you to our B2B partner program. To activate your account and access exclusive nett rates, please verify your email address.
    </p>

    <div style="text-align: center; margin: 40px 0;">
      <a href="${data.verificationLink}"
         style="display: inline-block; background: linear-gradient(135deg, ${BRAND_PRIMARY} 0%, #10b981 100%); color: white; text-decoration: none; padding: 16px 48px; border-radius: 50px; font-weight: 600; font-size: 16px; box-shadow: 0 4px 14px rgba(13,92,70,0.4);">
        Verify Email Address
      </a>
    </div>

    <div style="background-color: #f9fafb; border-radius: 12px; padding: 24px; margin-bottom: 24px;">
      <h3 style="color: #111827; margin: 0 0 16px; font-size: 18px; font-weight: 600;">
        ✨ Why Agencies Choose Us
      </h3>
      <ul style="color: #374151; font-size: 14px; line-height: 2; margin: 0; padding-left: 20px;">
        <li><strong style="color: ${BRAND_PRIMARY};">15% Exclusive Commission</strong> (Highest in market)</li>
        <li>Priority booking & instant confirmation</li>
        <li>Dedicated B2B account manager</li>
        <li>Flexible payment options (Bank Transfer/Card)</li>
      </ul>
    </div>
  `;

  return emailWrapper(content, 'Welcome to Recharge Travels B2B', 'general');
};

export const agencyApprovalTemplate = (data: { agencyName: string; loginLink: string; }) => {
  const content = `
    <!-- Celebration Header -->
    <div style="text-align: center; margin-bottom: 32px;">
      <div style="width: 80px; height: 80px; background: linear-gradient(135deg, #10b981 0%, #059669 100%); border-radius: 50%; margin: 0 auto 20px; display: flex; align-items: center; justify-content: center; box-shadow: 0 8px 24px rgba(16,185,129,0.3);">
        <span style="font-size: 40px;">🎉</span>
      </div>
      <h1 style="color: #1a1a1a; margin: 0; font-size: 32px; font-weight: 700;">
        You're Approved!
      </h1>
      <p style="color: #6b7280; margin: 12px 0 0; font-size: 18px;">
        Welcome to the <span style="color: #10b981; font-weight: 600;">Recharge Travels Partner Network</span>
      </p>
    </div>

    <p style="color: #374151; font-size: 16px; line-height: 1.6; margin-bottom: 24px;">
      Dear <strong>${data.agencyName}</strong>,
    </p>

    <p style="color: #374151; font-size: 16px; line-height: 1.6; margin-bottom: 24px;">
      We are delighted to inform you that your B2B partner application has been approved. You now have full access to our premium inventory with exclusive partner benefits.
    </p>

    <!-- Benefits Card -->
    <div style="background-color: #f0fdf4; border: 1px solid #d1fae5; border-radius: 12px; padding: 24px; margin-bottom: 32px;">
      <h3 style="color: #064e3b; margin: 0 0 16px; font-size: 18px; font-weight: 600;">
        💎 Your Partner Benefits
      </h3>
      <ul style="margin: 0; padding: 0; list-style: none;">
        <li style="padding: 8px 0; color: #374151; display: flex; align-items: center;">
          <span style="color: #10b981; margin-right: 12px; font-weight: bold;">✓</span>
          <strong>15% Commission</strong> on all tour packages
        </li>
        <li style="padding: 8px 0; color: #374151; display: flex; align-items: center;">
          <span style="color: #10b981; margin-right: 12px; font-weight: bold;">✓</span>
          Real-time availability & instant confirmation
        </li>
        <li style="padding: 8px 0; color: #374151; display: flex; align-items: center;">
          <span style="color: #10b981; margin-right: 12px; font-weight: bold;">✓</span>
          White-label vouchers for your clients
        </li>
      </ul>
    </div>

    <!-- CTA -->
    <div style="text-align: center; margin: 40px 0;">
      <a href="${data.loginLink}"
         style="display: inline-block; background: linear-gradient(135deg, ${BRAND_PRIMARY} 0%, #10b981 100%); color: white; text-decoration: none; padding: 18px 48px; border-radius: 50px; font-weight: 700; font-size: 18px; box-shadow: 0 4px 14px rgba(13,92,70,0.4); text-transform: uppercase; letter-spacing: 1px;">
        Access Partner Portal
      </a>
      <p style="color: #6b7280; margin: 20px 0 0; font-size: 14px;">
        Login now to view nett rates and start booking
      </p>
    </div>
  `;

  return emailWrapper(content, 'Account Approved - Recharge Travels B2B', 'general');
};

export const paymentConfirmationTemplate = (data: { bookingId: string; tourName: string; amount: number; paymentMethod: string; transactionId?: string; }) => {
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

  return emailWrapper(content, 'Payment Confirmation - Recharge Travels', 'booking');
};

export const passwordResetTemplate = (data: { agencyName: string; resetLink: string; }) => {
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

  return emailWrapper(content, 'Password Reset - Recharge Travels B2B', 'general');
};

export const bookingCancellationTemplate = (data: { bookingId: string; tourName: string; tourDate: string; refundAmount?: number; reason?: string; }) => {
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

  return emailWrapper(content, 'Booking Cancelled - Recharge Travels', 'booking');
};

// ==========================================
// DRIVER REGISTRATION CONFIRMATION
// ==========================================

export const driverRegistrationTemplate = (data: {
  driverName: string;
  email: string;
  phone: string;
  tier: string;
  applicationId: string;
  submittedAt: string;
}) => {
  const content = `
    <!-- Success Header -->
    <div style="text-align: center; margin-bottom: 32px;">
      <div style="width: 80px; height: 80px; background: linear-gradient(135deg, #f97316 0%, #ea580c 100%); border-radius: 50%; margin: 0 auto 20px; display: flex; align-items: center; justify-content: center; box-shadow: 0 8px 24px rgba(249,115,22,0.3);">
        <span style="font-size: 40px;">🚗</span>
      </div>
      <h1 style="color: #1a1a1a; margin: 0; font-size: 28px; font-weight: 700;">
        Application Received!
      </h1>
      <p style="color: #6b7280; margin: 12px 0 0; font-size: 16px;">
        Thank you for joining Recharge Travels Driver Network
      </p>
    </div>

    <!-- Application ID -->
    <div style="background: linear-gradient(135deg, #f97316 0%, #ea580c 100%); border-radius: 16px; padding: 24px; text-align: center; margin-bottom: 32px;">
      <p style="color: rgba(255,255,255,0.8); margin: 0 0 4px; font-size: 12px; text-transform: uppercase; letter-spacing: 2px;">
        Application ID
      </p>
      <p style="color: white; margin: 0; font-size: 28px; font-weight: 700; font-family: monospace; letter-spacing: 2px;">
        ${data.applicationId}
      </p>
    </div>

    <!-- Application Details -->
    <div style="background-color: #fff7ed; border-radius: 12px; padding: 24px; margin-bottom: 24px; border-left: 4px solid #f97316;">
      <h3 style="color: #9a3412; margin: 0 0 16px; font-size: 18px; font-weight: 600;">
        📋 Application Details
      </h3>
      <table width="100%" cellspacing="0" cellpadding="0">
        <tr>
          <td style="padding: 8px 0; color: #6b7280; font-size: 14px; width: 40%;">Name</td>
          <td style="padding: 8px 0; color: #1a1a1a; font-size: 14px; font-weight: 600;">${data.driverName}</td>
        </tr>
        <tr>
          <td style="padding: 8px 0; color: #6b7280; font-size: 14px;">Email</td>
          <td style="padding: 8px 0; color: #1a1a1a; font-size: 14px;">${data.email}</td>
        </tr>
        <tr>
          <td style="padding: 8px 0; color: #6b7280; font-size: 14px;">Phone</td>
          <td style="padding: 8px 0; color: #1a1a1a; font-size: 14px;">${data.phone}</td>
        </tr>
        <tr>
          <td style="padding: 8px 0; color: #6b7280; font-size: 14px;">Driver Tier</td>
          <td style="padding: 8px 0; color: #1a1a1a; font-size: 14px; font-weight: 600;">${data.tier}</td>
        </tr>
        <tr>
          <td style="padding: 8px 0; color: #6b7280; font-size: 14px;">Submitted</td>
          <td style="padding: 8px 0; color: #1a1a1a; font-size: 14px;">${data.submittedAt}</td>
        </tr>
      </table>
    </div>

    <!-- What's Next -->
    <div style="background-color: #f0fdf4; border-radius: 12px; padding: 24px; margin-bottom: 24px;">
      <h3 style="color: ${BRAND_PRIMARY}; margin: 0 0 16px; font-size: 18px; font-weight: 600;">
        🔄 What Happens Next?
      </h3>
      <ol style="color: #374151; font-size: 14px; line-height: 2; margin: 0; padding-left: 20px;">
        <li>Our verification team reviews your documents (24-48 hours)</li>
        <li>We may contact you for additional information</li>
        <li>You'll receive an approval email once verified</li>
        <li>Start receiving bookings immediately!</li>
      </ol>
    </div>

    <!-- Support -->
    <div style="text-align: center;">
      <p style="color: #6b7280; margin: 0 0 16px; font-size: 14px;">
        Questions? Contact our driver support team:
      </p>
      <a href="${WHATSAPP_LINK}?text=Hi%2C%20I%20submitted%20a%20driver%20application%20(ID%3A%20${data.applicationId})%20and%20have%20a%20question."
         style="display: inline-block; background: linear-gradient(135deg, #f97316 0%, #ea580c 100%); color: white; padding: 16px 40px; border-radius: 50px; font-weight: 600; font-size: 16px; box-shadow: 0 4px 14px rgba(249,115,22,0.4);">
        Chat on WhatsApp
      </a>
    </div>
  `;

  return emailWrapper(content, 'Driver Application Received - Recharge Travels', 'booking');
};

// ==========================================
// DRIVER APPROVAL EMAIL
// ==========================================

export const driverApprovalTemplate = (data: {
  driverName: string;
  tier: string;
  loginLink: string;
}) => {
  const content = `
    <!-- Celebration Header -->
    <div style="text-align: center; margin-bottom: 32px;">
      <div style="width: 80px; height: 80px; background: linear-gradient(135deg, #10b981 0%, #059669 100%); border-radius: 50%; margin: 0 auto 20px; display: flex; align-items: center; justify-content: center; box-shadow: 0 8px 24px rgba(16,185,129,0.3);">
        <span style="font-size: 40px;">🎉</span>
      </div>
      <h1 style="color: #1a1a1a; margin: 0; font-size: 32px; font-weight: 700;">
        Congratulations, ${data.driverName}!
      </h1>
      <p style="color: #6b7280; margin: 12px 0 0; font-size: 18px;">
        Your driver account has been <span style="color: #10b981; font-weight: 600;">APPROVED</span>!
      </p>
    </div>

    <!-- Badge -->
    <div style="background: linear-gradient(135deg, #10b981 0%, #059669 100%); border-radius: 16px; padding: 32px; text-align: center; margin-bottom: 32px; color: white;">
      <p style="margin: 0 0 8px; font-size: 14px; opacity: 0.9;">You are now a verified</p>
      <p style="margin: 0; font-size: 24px; font-weight: 700;">${data.tier}</p>
      <p style="margin: 12px 0 0; font-size: 14px; opacity: 0.9;">with Recharge Travels</p>
    </div>

    <!-- What You Get -->
    <div style="background-color: #f0fdf4; border-radius: 12px; padding: 24px; margin-bottom: 24px;">
      <h3 style="color: #166534; margin: 0 0 16px; font-size: 18px; font-weight: 600;">
        ✅ What You Get
      </h3>
      <ul style="color: #374151; font-size: 14px; line-height: 2; margin: 0; padding-left: 20px;">
        <li>Access to tourist bookings across Sri Lanka</li>
        <li>Verified driver badge on your profile</li>
        <li>Real-time booking notifications</li>
        <li>Secure payments directly to your bank</li>
        <li>24/7 driver support via WhatsApp</li>
      </ul>
    </div>

    <!-- CTA -->
    <div style="text-align: center;">
      <a href="${data.loginLink}"
         style="display: inline-block; background: linear-gradient(135deg, #10b981 0%, #059669 100%); color: white; padding: 18px 48px; border-radius: 50px; font-weight: 700; font-size: 18px; box-shadow: 0 4px 14px rgba(16,185,129,0.4);">
        🚗 Go to Driver Dashboard
      </a>
      <p style="color: #6b7280; margin: 20px 0 0; font-size: 14px;">
        Start receiving bookings today!
      </p>
    </div>
  `;

  return emailWrapper(content, '🎉 You\'re Approved! Welcome to Recharge Travels', 'booking');
};

// ==========================================
// ADMIN: NEW DRIVER APPLICATION NOTIFICATION
// ==========================================

export const adminDriverNotificationTemplate = (data: {
  driverName: string;
  email: string;
  phone: string;
  tier: string;
  applicationId: string;
  vehicleType: string;
  documentsUploaded: number;
  reviewLink: string;
}) => {
  const content = `
    <!-- Alert Header -->
    <div style="text-align: center; margin-bottom: 32px;">
      <div style="width: 80px; height: 80px; background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%); border-radius: 50%; margin: 0 auto 20px; display: flex; align-items: center; justify-content: center; box-shadow: 0 8px 24px rgba(59,130,246,0.3);">
        <span style="font-size: 40px;">🔔</span>
      </div>
      <h1 style="color: #1a1a1a; margin: 0; font-size: 24px; font-weight: 700;">
        New Driver Application
      </h1>
      <p style="color: #6b7280; margin: 12px 0 0; font-size: 16px;">
        A new driver has applied to join the network
      </p>
    </div>

    <!-- Application Summary -->
    <div style="background-color: #eff6ff; border-radius: 12px; padding: 24px; margin-bottom: 24px; border-left: 4px solid #3b82f6;">
      <table width="100%" cellspacing="0" cellpadding="0">
        <tr>
          <td style="padding: 8px 0; color: #6b7280; font-size: 14px; width: 40%;">Application ID</td>
          <td style="padding: 8px 0; color: #1a1a1a; font-size: 14px; font-weight: 700;">${data.applicationId}</td>
        </tr>
        <tr>
          <td style="padding: 8px 0; color: #6b7280; font-size: 14px;">Applicant Name</td>
          <td style="padding: 8px 0; color: #1a1a1a; font-size: 14px; font-weight: 600;">${data.driverName}</td>
        </tr>
        <tr>
          <td style="padding: 8px 0; color: #6b7280; font-size: 14px;">Email</td>
          <td style="padding: 8px 0; color: #1a1a1a; font-size: 14px;">${data.email}</td>
        </tr>
        <tr>
          <td style="padding: 8px 0; color: #6b7280; font-size: 14px;">Phone</td>
          <td style="padding: 8px 0; color: #1a1a1a; font-size: 14px;">${data.phone}</td>
        </tr>
        <tr>
          <td style="padding: 8px 0; color: #6b7280; font-size: 14px;">Requested Tier</td>
          <td style="padding: 8px 0; font-size: 14px;">
            <span style="background-color: #fbbf24; color: #1a1a1a; padding: 4px 12px; border-radius: 20px; font-weight: 600;">${data.tier}</span>
          </td>
        </tr>
        <tr>
          <td style="padding: 8px 0; color: #6b7280; font-size: 14px;">Vehicle Type</td>
          <td style="padding: 8px 0; color: #1a1a1a; font-size: 14px;">${data.vehicleType}</td>
        </tr>
        <tr>
          <td style="padding: 8px 0; color: #6b7280; font-size: 14px;">Documents Uploaded</td>
          <td style="padding: 8px 0; color: #1a1a1a; font-size: 14px;">${data.documentsUploaded} files</td>
        </tr>
      </table>
    </div>

    <!-- Action Required -->
    <div style="background-color: #fef3c7; border-radius: 12px; padding: 20px; margin-bottom: 24px; text-align: center;">
      <p style="color: #92400e; margin: 0; font-size: 14px; font-weight: 600;">
        ⚠️ Action Required: Please review and verify the uploaded documents
      </p>
    </div>

    <!-- CTA -->
    <div style="text-align: center;">
      <a href="${data.reviewLink}"
         style="display: inline-block; background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%); color: white; padding: 16px 40px; border-radius: 50px; font-weight: 600; font-size: 16px; box-shadow: 0 4px 14px rgba(59,130,246,0.4);">
        Review Application
      </a>
    </div>
  `;

  return emailWrapper(content, '🔔 New Driver Application - Action Required', 'booking');
};

// ==========================================
// VEHICLE RENTAL BOOKING CONFIRMATION
// ==========================================

export const vehicleRentalConfirmationTemplate = (data: {
  bookingRef: string;
  customerName: string;
  email: string;
  phone: string;
  vehicleType: string;
  pickupDate: string;
  returnDate: string;
  pickupLocation: string;
  returnLocation: string;
  driverOption: string;
  totalPrice: number;
  paymentStatus: string;
}) => {
  const content = `
    <!-- Success Header -->
    <div style="text-align: center; margin-bottom: 32px;">
      <div style="width: 80px; height: 80px; background: linear-gradient(135deg, ${BRAND_PRIMARY} 0%, #10b981 100%); border-radius: 50%; margin: 0 auto 20px; display: flex; align-items: center; justify-content: center; box-shadow: 0 8px 24px rgba(13,92,70,0.3);">
        <span style="font-size: 40px;">🚗</span>
      </div>
      <h1 style="color: #1a1a1a; margin: 0; font-size: 28px; font-weight: 700;">
        Vehicle Rental Confirmed!
      </h1>
      <p style="color: #6b7280; margin: 12px 0 0; font-size: 16px;">
        Your ${data.vehicleType} is reserved and ready
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

    <!-- Rental Details -->
    <div style="background-color: #f0fdf4; border-radius: 12px; padding: 24px; margin-bottom: 24px; border-left: 4px solid ${BRAND_PRIMARY};">
      <h3 style="color: #1a1a1a; margin: 0 0 16px; font-size: 18px; font-weight: 600;">
        🚗 Rental Details
      </h3>
      <table width="100%" cellspacing="0" cellpadding="0">
        <tr>
          <td style="padding: 8px 0; color: #6b7280; font-size: 14px;">Vehicle</td>
          <td style="padding: 8px 0; color: #1a1a1a; font-size: 14px; font-weight: 600; text-align: right;">${data.vehicleType}</td>
        </tr>
        <tr>
          <td style="padding: 8px 0; color: #6b7280; font-size: 14px;">Driver Option</td>
          <td style="padding: 8px 0; color: #1a1a1a; font-size: 14px; text-align: right;">${data.driverOption}</td>
        </tr>
        <tr>
          <td style="padding: 8px 0; color: #6b7280; font-size: 14px;">Pickup Date</td>
          <td style="padding: 8px 0; color: #1a1a1a; font-size: 14px; font-weight: 600; text-align: right;">${data.pickupDate}</td>
        </tr>
        <tr>
          <td style="padding: 8px 0; color: #6b7280; font-size: 14px;">Return Date</td>
          <td style="padding: 8px 0; color: #1a1a1a; font-size: 14px; text-align: right;">${data.returnDate}</td>
        </tr>
        <tr>
          <td style="padding: 8px 0; color: #6b7280; font-size: 14px;">Pickup Location</td>
          <td style="padding: 8px 0; color: #1a1a1a; font-size: 14px; text-align: right;">${data.pickupLocation}</td>
        </tr>
        <tr>
          <td style="padding: 8px 0; color: #6b7280; font-size: 14px;">Return Location</td>
          <td style="padding: 8px 0; color: #1a1a1a; font-size: 14px; text-align: right;">${data.returnLocation}</td>
        </tr>
      </table>
    </div>

    <!-- Payment Summary -->
    <div style="background: linear-gradient(135deg, #1f2937 0%, #374151 100%); border-radius: 12px; padding: 24px; margin-bottom: 24px;">
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

    <!-- CTA -->
    <div style="text-align: center;">
      <a href="${WHATSAPP_LINK}?text=Hi%2C%20I%20have%20a%20vehicle%20rental%20booking%20(Ref%3A%20${data.bookingRef})%20and%20have%20a%20question."
         style="display: inline-block; background: linear-gradient(135deg, ${BRAND_PRIMARY} 0%, #10b981 100%); color: white; padding: 16px 40px; border-radius: 50px; font-weight: 600; font-size: 16px; box-shadow: 0 4px 14px rgba(13,92,70,0.4);">
        Contact Support
      </a>
    </div>
  `;

  return emailWrapper(content, 'Vehicle Rental Confirmed - Recharge Travels', 'booking');
};

// ==========================================
// REVIEW REQUEST EMAIL
// ==========================================

export const reviewRequestTemplate = (data: {
  customerName: string;
  tourName: string;
  tourDate: string;
  reviewLink: string;
}) => {
  const content = `
    <!-- Review Request Header -->
    <div style="text-align: center; margin-bottom: 32px;">
      <div style="width: 80px; height: 80px; background: linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%); border-radius: 50%; margin: 0 auto 20px; display: flex; align-items: center; justify-content: center;">
        <span style="font-size: 40px;">⭐</span>
      </div>
      <h1 style="color: #1a1a1a; margin: 0; font-size: 28px; font-weight: 700;">
        How Was Your Experience?
      </h1>
      <p style="color: #6b7280; margin: 12px 0 0; font-size: 16px;">
        Hi ${data.customerName}, we hope you enjoyed your trip!
      </p>
    </div>

    <!-- Tour Info -->
    <div style="background-color: #fef3c7; border-radius: 12px; padding: 20px; margin-bottom: 24px; text-align: center;">
      <p style="color: #92400e; margin: 0 0 8px; font-size: 14px;">Your Recent Tour</p>
      <p style="color: #1a1a1a; margin: 0; font-size: 18px; font-weight: 600;">${data.tourName}</p>
      <p style="color: #92400e; margin: 8px 0 0; font-size: 14px;">${data.tourDate}</p>
    </div>

    <!-- Why Review -->
    <div style="background-color: #f9fafb; border-radius: 12px; padding: 24px; margin-bottom: 24px;">
      <h3 style="color: #1a1a1a; margin: 0 0 16px; font-size: 18px; font-weight: 600;">
        Your feedback helps us! 🙏
      </h3>
      <ul style="color: #374151; font-size: 14px; line-height: 2; margin: 0; padding-left: 20px;">
        <li>Help other travelers choose their perfect tour</li>
        <li>Let our drivers know they're doing great</li>
        <li>Help us improve our services</li>
        <li>Get featured on our website!</li>
      </ul>
    </div>

    <!-- CTA -->
    <div style="text-align: center;">
      <a href="${data.reviewLink}"
         style="display: inline-block; background: linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%); color: #1a1a1a; padding: 18px 48px; border-radius: 50px; font-weight: 700; font-size: 18px; box-shadow: 0 4px 14px rgba(251,191,36,0.4);">
        ⭐ Leave Your Review
      </a>
      <p style="color: #6b7280; margin: 20px 0 0; font-size: 12px;">
        Takes less than 2 minutes
      </p>
    </div>
  `;

  return emailWrapper(content, "How Was Your Tour? Share Your Experience! - Recharge Travels", 'general');
};

// ==========================================
// INVOICE EMAIL
// ==========================================

export const invoiceTemplate = (data: {
  invoiceNumber: string;
  customerName: string;
  bookingRef: string;
  tourName: string;
  tourDate: string;
  items: Array<{ description: string; quantity: number; unitPrice: number; total: number }>;
  subtotal: number;
  tax: number;
  discount: number;
  total: number;
  paymentStatus: string;
  paidAmount: number;
  balanceDue: number;
}) => {
  const itemsHtml = data.items.map(item => `
    <tr>
      <td style="padding: 12px; border-bottom: 1px solid #e5e7eb; font-size: 14px;">${item.description}</td>
      <td style="padding: 12px; border-bottom: 1px solid #e5e7eb; font-size: 14px; text-align: center;">${item.quantity}</td>
      <td style="padding: 12px; border-bottom: 1px solid #e5e7eb; font-size: 14px; text-align: right;">$${item.unitPrice.toFixed(2)}</td>
      <td style="padding: 12px; border-bottom: 1px solid #e5e7eb; font-size: 14px; text-align: right; font-weight: 600;">$${item.total.toFixed(2)}</td>
    </tr>
  `).join('');

  const content = `
    <!-- Invoice Header -->
    <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 32px;">
      <div>
        <h1 style="color: #1a1a1a; margin: 0; font-size: 32px; font-weight: 700;">INVOICE</h1>
        <p style="color: #6b7280; margin: 8px 0 0; font-size: 14px;">${data.invoiceNumber}</p>
      </div>
      <div style="text-align: right;">
        <p style="color: ${BRAND_PRIMARY}; margin: 0; font-size: 14px; font-weight: 600;">Recharge Travels & Tours (Pvt) Ltd</p>
        <p style="color: #6b7280; margin: 4px 0 0; font-size: 12px;">Colombo, Jaffna, Sri Lanka</p>
        <p style="color: #6b7280; margin: 2px 0 0; font-size: 12px;">info@rechargetravels.com</p>
      </div>
    </div>

    <!-- Bill To -->
    <div style="background-color: #f9fafb; border-radius: 12px; padding: 20px; margin-bottom: 24px;">
      <p style="color: #6b7280; margin: 0 0 8px; font-size: 12px; text-transform: uppercase;">Bill To</p>
      <p style="color: #1a1a1a; margin: 0; font-size: 16px; font-weight: 600;">${data.customerName}</p>
      <p style="color: #6b7280; margin: 4px 0 0; font-size: 14px;">Booking Ref: ${data.bookingRef}</p>
    </div>

    <!-- Tour Info -->
    <div style="margin-bottom: 24px;">
      <p style="color: #6b7280; margin: 0 0 4px; font-size: 12px;">Tour Package</p>
      <p style="color: #1a1a1a; margin: 0; font-size: 16px; font-weight: 600;">${data.tourName}</p>
      <p style="color: #6b7280; margin: 4px 0 0; font-size: 14px;">${data.tourDate}</p>
    </div>

    <!-- Items Table -->
    <table width="100%" cellspacing="0" cellpadding="0" style="margin-bottom: 24px;">
      <thead>
        <tr style="background-color: ${BRAND_PRIMARY};">
          <th style="padding: 12px; text-align: left; color: white; font-size: 12px; font-weight: 600;">Description</th>
          <th style="padding: 12px; text-align: center; color: white; font-size: 12px; font-weight: 600;">Qty</th>
          <th style="padding: 12px; text-align: right; color: white; font-size: 12px; font-weight: 600;">Unit Price</th>
          <th style="padding: 12px; text-align: right; color: white; font-size: 12px; font-weight: 600;">Total</th>
        </tr>
      </thead>
      <tbody>
        ${itemsHtml}
      </tbody>
    </table>

    <!-- Totals -->
    <div style="background-color: #f9fafb; border-radius: 12px; padding: 20px; margin-bottom: 24px;">
      <table width="100%" cellspacing="0" cellpadding="0">
        <tr>
          <td style="padding: 8px 0; color: #6b7280; font-size: 14px;">Subtotal</td>
          <td style="padding: 8px 0; color: #1a1a1a; font-size: 14px; text-align: right;">$${data.subtotal.toFixed(2)}</td>
        </tr>
        ${data.discount > 0 ? `
        <tr>
          <td style="padding: 8px 0; color: #10b981; font-size: 14px;">Discount</td>
          <td style="padding: 8px 0; color: #10b981; font-size: 14px; text-align: right;">-$${data.discount.toFixed(2)}</td>
        </tr>
        ` : ''}
        <tr>
          <td style="padding: 8px 0; color: #6b7280; font-size: 14px;">Tax</td>
          <td style="padding: 8px 0; color: #1a1a1a; font-size: 14px; text-align: right;">$${data.tax.toFixed(2)}</td>
        </tr>
        <tr style="border-top: 2px solid ${BRAND_PRIMARY};">
          <td style="padding: 16px 0 8px; color: #1a1a1a; font-size: 18px; font-weight: 700;">Total</td>
          <td style="padding: 16px 0 8px; color: ${BRAND_PRIMARY}; font-size: 24px; font-weight: 700; text-align: right;">$${data.total.toFixed(2)}</td>
        </tr>
        ${data.paidAmount > 0 ? `
        <tr>
          <td style="padding: 8px 0; color: #10b981; font-size: 14px;">Paid</td>
          <td style="padding: 8px 0; color: #10b981; font-size: 14px; text-align: right;">$${data.paidAmount.toFixed(2)}</td>
        </tr>
        ` : ''}
        ${data.balanceDue > 0 ? `
        <tr>
          <td style="padding: 8px 0; color: #ef4444; font-size: 14px; font-weight: 600;">Balance Due</td>
          <td style="padding: 8px 0; color: #ef4444; font-size: 16px; font-weight: 700; text-align: right;">$${data.balanceDue.toFixed(2)}</td>
        </tr>
        ` : ''}
      </table>
    </div>

    <!-- Payment Status -->
    <div style="text-align: center; margin-bottom: 24px;">
      <span style="background-color: ${data.paymentStatus === 'paid' ? '#10b981' : data.paymentStatus === 'partial' ? '#f59e0b' : '#ef4444'}; color: white; padding: 8px 24px; border-radius: 20px; font-size: 14px; font-weight: 600;">
        ${data.paymentStatus.toUpperCase()}
      </span>
    </div>
  `;

  return emailWrapper(content, `Invoice ${data.invoiceNumber} - Recharge Travels`, 'booking');
};

// ==========================================
// HOTEL BOOKING CONFIRMATION
// ==========================================

export const hotelBookingTemplate = (data: {
  bookingRef: string;
  customerName: string;
  email: string;
  phone: string;
  hotelName: string;
  hotelImage?: string;
  checkIn: string;
  checkOut: string;
  nights: number;
  roomType: string;
  roomCount: number;
  guests: number;
  mealPlan: string;
  totalPrice: number;
  specialRequests?: string;
}) => {
  const content = `
    <!-- Success Header -->
    <div style="text-align: center; margin-bottom: 32px;">
      <div style="width: 80px; height: 80px; background: linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%); border-radius: 50%; margin: 0 auto 20px; display: flex; align-items: center; justify-content: center; box-shadow: 0 8px 24px rgba(139,92,246,0.3);">
        <span style="font-size: 40px;">🏨</span>
      </div>
      <h1 style="color: #1a1a1a; margin: 0; font-size: 28px; font-weight: 700;">
        Hotel Booking Confirmed!
      </h1>
      <p style="color: #6b7280; margin: 12px 0 0; font-size: 16px;">
        ${data.hotelName}
      </p>
    </div>

    <!-- Booking Reference -->
    <div style="background: linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%); border-radius: 16px; padding: 24px; text-align: center; margin-bottom: 32px;">
      <p style="color: rgba(255,255,255,0.8); margin: 0 0 4px; font-size: 12px; text-transform: uppercase; letter-spacing: 2px;">
        Booking Reference
      </p>
      <p style="color: white; margin: 0; font-size: 32px; font-weight: 700; font-family: monospace; letter-spacing: 2px;">
        ${data.bookingRef}
      </p>
    </div>

    ${data.hotelImage ? `
    <!-- Hotel Image -->
    <div style="margin-bottom: 24px; border-radius: 12px; overflow: hidden;">
      <img src="${data.hotelImage}" alt="${data.hotelName}" style="width: 100%; height: 200px; object-fit: cover;" />
    </div>
    ` : ''}

    <!-- Stay Details -->
    <div style="background-color: #f5f3ff; border-radius: 12px; padding: 24px; margin-bottom: 24px; border-left: 4px solid #8b5cf6;">
      <h3 style="color: #5b21b6; margin: 0 0 16px; font-size: 18px; font-weight: 600;">
        🏨 Stay Details
      </h3>
      <table width="100%" cellspacing="0" cellpadding="0">
        <tr>
          <td style="padding: 8px 0; color: #6b7280; font-size: 14px;">Check-in</td>
          <td style="padding: 8px 0; color: #1a1a1a; font-size: 14px; font-weight: 600; text-align: right;">${data.checkIn}</td>
        </tr>
        <tr>
          <td style="padding: 8px 0; color: #6b7280; font-size: 14px;">Check-out</td>
          <td style="padding: 8px 0; color: #1a1a1a; font-size: 14px; font-weight: 600; text-align: right;">${data.checkOut}</td>
        </tr>
        <tr>
          <td style="padding: 8px 0; color: #6b7280; font-size: 14px;">Duration</td>
          <td style="padding: 8px 0; color: #1a1a1a; font-size: 14px; text-align: right;">${data.nights} night(s)</td>
        </tr>
        <tr>
          <td style="padding: 8px 0; color: #6b7280; font-size: 14px;">Room Type</td>
          <td style="padding: 8px 0; color: #1a1a1a; font-size: 14px; text-align: right;">${data.roomType}</td>
        </tr>
        <tr>
          <td style="padding: 8px 0; color: #6b7280; font-size: 14px;">Rooms</td>
          <td style="padding: 8px 0; color: #1a1a1a; font-size: 14px; text-align: right;">${data.roomCount}</td>
        </tr>
        <tr>
          <td style="padding: 8px 0; color: #6b7280; font-size: 14px;">Guests</td>
          <td style="padding: 8px 0; color: #1a1a1a; font-size: 14px; text-align: right;">${data.guests}</td>
        </tr>
        <tr>
          <td style="padding: 8px 0; color: #6b7280; font-size: 14px;">Meal Plan</td>
          <td style="padding: 8px 0; color: #1a1a1a; font-size: 14px; text-align: right;">${data.mealPlan}</td>
        </tr>
      </table>
    </div>

    <!-- Total -->
    <div style="background: linear-gradient(135deg, #1f2937 0%, #374151 100%); border-radius: 12px; padding: 24px; margin-bottom: 24px; text-align: center;">
      <p style="color: #9ca3af; margin: 0 0 8px; font-size: 14px;">Total Amount</p>
      <p style="color: #a78bfa; margin: 0; font-size: 36px; font-weight: 700;">$${data.totalPrice.toLocaleString()}</p>
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

    <!-- CTA -->
    <div style="text-align: center;">
      <a href="${WHATSAPP_LINK}?text=Hi%2C%20I%20have%20a%20hotel%20booking%20(Ref%3A%20${data.bookingRef})%20at%20${encodeURIComponent(data.hotelName)}"
         style="display: inline-block; background: linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%); color: white; padding: 16px 40px; border-radius: 50px; font-weight: 600; font-size: 16px; box-shadow: 0 4px 14px rgba(139,92,246,0.4);">
        Contact Hotel Support
      </a>
    </div>
  `;

  return emailWrapper(content, 'Hotel Booking Confirmed - Recharge Travels', 'booking');
};

// ==========================================
// DRIVER REJECTION EMAIL
// ==========================================

export const driverRejectionTemplate = (data: {
  driverName: string;
  reason: string;
  canReapply: boolean;
  reapplyAfterDays?: number;
}) => {
  const content = `
    <!-- Header -->
    <div style="text-align: center; margin-bottom: 32px;">
      <div style="width: 80px; height: 80px; background-color: #fee2e2; border-radius: 50%; margin: 0 auto 20px; display: flex; align-items: center; justify-content: center;">
        <span style="font-size: 40px;">😔</span>
      </div>
      <h1 style="color: #1a1a1a; margin: 0; font-size: 28px; font-weight: 700;">
        Application Update
      </h1>
      <p style="color: #6b7280; margin: 12px 0 0; font-size: 16px;">
        Hi ${data.driverName}
      </p>
    </div>

    <!-- Message -->
    <div style="background-color: #fef2f2; border-radius: 12px; padding: 24px; margin-bottom: 24px; border-left: 4px solid #ef4444;">
      <p style="color: #374151; margin: 0; font-size: 14px; line-height: 1.6;">
        Thank you for your interest in joining Recharge Travels. After reviewing your application, 
        we regret to inform you that we are unable to approve your driver registration at this time.
      </p>
    </div>

    <!-- Reason -->
    <div style="background-color: #f9fafb; border-radius: 12px; padding: 24px; margin-bottom: 24px;">
      <h3 style="color: #1a1a1a; margin: 0 0 12px; font-size: 16px; font-weight: 600;">
        Reason:
      </h3>
      <p style="color: #6b7280; margin: 0; font-size: 14px; line-height: 1.6;">
        ${data.reason}
      </p>
    </div>

    ${data.canReapply ? `
    <!-- Reapply Info -->
    <div style="background-color: #f0fdf4; border-radius: 12px; padding: 24px; margin-bottom: 24px;">
      <h3 style="color: #166534; margin: 0 0 12px; font-size: 16px; font-weight: 600;">
        ✅ Good News!
      </h3>
      <p style="color: #374151; margin: 0; font-size: 14px; line-height: 1.6;">
        You can reapply ${data.reapplyAfterDays ? `after ${data.reapplyAfterDays} days` : 'once the issues are resolved'}. 
        Please ensure you address the concerns mentioned above before submitting a new application.
      </p>
    </div>
    ` : ''}

    <!-- CTA -->
    <div style="text-align: center;">
      <a href="${WHATSAPP_LINK}?text=Hi%2C%20I%20received%20a%20rejection%20for%20my%20driver%20application%20and%20would%20like%20to%20discuss."
         style="display: inline-block; background: linear-gradient(135deg, ${BRAND_PRIMARY} 0%, #10b981 100%); color: white; padding: 16px 40px; border-radius: 50px; font-weight: 600; font-size: 16px;">
        Contact Support
      </a>
    </div>
  `;

  return emailWrapper(content, 'Driver Application Update - Recharge Travels', 'general');
};

export default {
  emailWrapper,
  conciergeBookingTemplate,
  tourBookingTemplate,
  transferBookingTemplate,
  whaleWatchingTemplate,
  welcomeEmailTemplate,
  bookingReminderTemplate,
  bookingConfirmationTemplate,
  agencyWelcomeTemplate,
  agencyApprovalTemplate,
  paymentConfirmationTemplate,
  passwordResetTemplate,
  bookingCancellationTemplate,
  // Driver templates
  driverRegistrationTemplate,
  driverApprovalTemplate,
  adminDriverNotificationTemplate,
  vehicleRentalConfirmationTemplate,
  // New additional templates
  reviewRequestTemplate,
  invoiceTemplate,
  hotelBookingTemplate,
  driverRejectionTemplate
};
