import { db } from '@/lib/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import type { AirportTransferBooking } from './airportTransferService';

// Admin email for notifications
const ADMIN_EMAIL = 'info@rechargetravels.com';
const WHATSAPP_NUMBER = '+94777123456'; // Replace with actual WhatsApp business number

export interface BookingConfirmationData {
  booking: AirportTransferBooking;
  customerEmail: string;
  customerPhone: string;
}

// Generate PDF content as HTML (for conversion)
export const generateBookingPDFContent = (booking: AirportTransferBooking): string => {
  const formatDate = (dateStr: string) => {
    if (!dateStr) return 'N/A';
    try {
      return new Date(dateStr).toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    } catch {
      return dateStr;
    }
  };

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Airport Transfer Confirmation - ${booking.bookingReference}</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: 'Segoe UI', Arial, sans-serif; color: #333; line-height: 1.6; }
    .container { max-width: 800px; margin: 0 auto; padding: 40px; }
    .header { text-align: center; padding-bottom: 30px; border-bottom: 3px solid #0d5c46; margin-bottom: 30px; }
    .header h1 { color: #0d5c46; font-size: 28px; margin-bottom: 10px; }
    .header .ref { font-size: 18px; color: #666; }
    .header .ref strong { color: #0d5c46; font-size: 24px; }
    .section { margin-bottom: 30px; }
    .section-title { background: #0d5c46; color: white; padding: 10px 20px; font-size: 16px; font-weight: 600; margin-bottom: 15px; }
    .grid { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; }
    .info-box { background: #f8f9fa; padding: 15px; border-left: 4px solid #0d5c46; }
    .info-box label { display: block; font-size: 12px; color: #666; text-transform: uppercase; margin-bottom: 5px; }
    .info-box value { font-size: 16px; font-weight: 600; color: #333; }
    .route-box { background: linear-gradient(135deg, #f0f7f4 0%, #e8f5e9 100%); padding: 25px; border-radius: 10px; text-align: center; margin: 20px 0; }
    .route-box .airports { display: flex; align-items: center; justify-content: center; gap: 30px; font-size: 20px; font-weight: 700; color: #0d5c46; }
    .route-box .arrow { color: #f0b429; font-size: 30px; }
    .price-box { background: #0d5c46; color: white; padding: 25px; text-align: center; margin-top: 30px; }
    .price-box .total { font-size: 36px; font-weight: 700; }
    .price-box .currency { font-size: 18px; opacity: 0.9; }
    .footer { margin-top: 40px; padding-top: 20px; border-top: 1px solid #ddd; text-align: center; color: #666; font-size: 12px; }
    .important { background: #fff3cd; border: 1px solid #ffc107; padding: 15px; margin: 20px 0; border-radius: 5px; }
    .important h4 { color: #856404; margin-bottom: 10px; }
    table { width: 100%; border-collapse: collapse; margin: 15px 0; }
    th, td { padding: 12px; text-align: left; border-bottom: 1px solid #ddd; }
    th { background: #f8f9fa; font-weight: 600; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>AIRPORT TRANSFER CONFIRMATION</h1>
      <p class="ref">Booking Reference: <strong>${booking.bookingReference}</strong></p>
    </div>

    <div class="route-box">
      <div class="airports">
        <span>${booking.pickupAirport?.code || 'CMB'}</span>
        <span class="arrow">${booking.transferType === 'round-trip' ? '⇄' : '→'}</span>
        <span>${booking.dropoffLocation?.name || 'Destination'}</span>
      </div>
      <p style="margin-top: 10px; color: #666;">
        ${booking.transferType === 'round-trip' ? 'Round Trip Transfer' : booking.transferType === 'arrival' ? 'Airport Pickup' : 'Airport Drop-off'}
      </p>
    </div>

    <div class="section">
      <div class="section-title">JOURNEY DETAILS</div>
      <div class="grid">
        <div class="info-box">
          <label>Pickup Date</label>
          <value>${formatDate(booking.pickupDate)}</value>
        </div>
        <div class="info-box">
          <label>Pickup Time</label>
          <value>${booking.pickupTime || 'TBD'}</value>
        </div>
        <div class="info-box">
          <label>From</label>
          <value>${booking.pickupAirport?.name || 'Bandaranaike International Airport'}</value>
        </div>
        <div class="info-box">
          <label>To</label>
          <value>${booking.dropoffLocation?.name}, ${booking.dropoffLocation?.area || ''}</value>
        </div>
        ${booking.flightNumber ? `
        <div class="info-box">
          <label>Flight Number</label>
          <value>${booking.flightNumber}</value>
        </div>
        ` : ''}
        <div class="info-box">
          <label>Distance</label>
          <value>${booking.pricing?.distance || 0} km</value>
        </div>
      </div>
      ${booking.transferType === 'round-trip' && booking.returnDate ? `
      <div class="grid" style="margin-top: 15px;">
        <div class="info-box">
          <label>Return Date</label>
          <value>${formatDate(booking.returnDate)}</value>
        </div>
        <div class="info-box">
          <label>Return Time</label>
          <value>${booking.returnTime || 'TBD'}</value>
        </div>
      </div>
      ` : ''}
    </div>

    <div class="section">
      <div class="section-title">VEHICLE & PASSENGERS</div>
      <table>
        <tr>
          <th>Vehicle Type</th>
          <td>${booking.vehicleName || 'Economy Sedan'}</td>
        </tr>
        <tr>
          <th>Adults</th>
          <td>${booking.adults || 1}</td>
        </tr>
        <tr>
          <th>Children</th>
          <td>${booking.children || 0}</td>
        </tr>
        <tr>
          <th>Infants</th>
          <td>${booking.infants || 0}</td>
        </tr>
        <tr>
          <th>Luggage</th>
          <td>${booking.luggage || 0} pieces</td>
        </tr>
        ${booking.childSeats ? `
        <tr>
          <th>Child Seats</th>
          <td>${booking.childSeats}</td>
        </tr>
        ` : ''}
      </table>
    </div>

    <div class="section">
      <div class="section-title">PASSENGER INFORMATION</div>
      <div class="grid">
        <div class="info-box">
          <label>Name</label>
          <value>${booking.customerInfo?.firstName} ${booking.customerInfo?.lastName}</value>
        </div>
        <div class="info-box">
          <label>Email</label>
          <value>${booking.customerInfo?.email}</value>
        </div>
        <div class="info-box">
          <label>Phone</label>
          <value>${booking.customerInfo?.phone}</value>
        </div>
        <div class="info-box">
          <label>Country</label>
          <value>${booking.customerInfo?.country}</value>
        </div>
      </div>
      ${booking.specialRequests ? `
      <div class="info-box" style="margin-top: 15px;">
        <label>Special Requests</label>
        <value>${booking.specialRequests}</value>
      </div>
      ` : ''}
    </div>

    <div class="section">
      <div class="section-title">INCLUDED SERVICES</div>
      <ul style="padding-left: 20px;">
        <li>Meet & Greet at arrivals with name board</li>
        <li>Flight tracking - driver adjusts for delays</li>
        <li>60 minutes free waiting time</li>
        <li>Bottled water in vehicle</li>
        <li>Free WiFi (on request)</li>
        <li>24/7 customer support</li>
      </ul>
    </div>

    <div class="price-box">
      <p class="currency">Total Amount</p>
      <p class="total">$${booking.pricing?.totalPrice || 0} USD</p>
      <p style="opacity: 0.8; margin-top: 10px;">Payment: ${booking.paymentStatus === 'paid' ? 'PAID' : 'Pay on Arrival'}</p>
    </div>

    <div class="important">
      <h4>Important Information</h4>
      <ul style="padding-left: 20px; font-size: 14px;">
        <li>Your driver will contact you 24 hours before pickup</li>
        <li>Look for your name board at the arrivals exit</li>
        <li>Free cancellation up to 24 hours before pickup</li>
        <li>For changes, contact us at info@rechargetravels.com</li>
      </ul>
    </div>

    <div class="footer">
      <p><strong>Recharge Travels Sri Lanka</strong></p>
      <p>Email: info@rechargetravels.com | Phone: +94 77 123 4567</p>
      <p>www.rechargetravels.com</p>
      <p style="margin-top: 15px; font-size: 10px;">This is an auto-generated confirmation. Please do not reply to this email.</p>
    </div>
  </div>
</body>
</html>
`;
};

// Generate plain text version for email
export const generateBookingEmailText = (booking: AirportTransferBooking): string => {
  return `
AIRPORT TRANSFER CONFIRMATION
=============================
Booking Reference: ${booking.bookingReference}

ROUTE: ${booking.pickupAirport?.code || 'CMB'} → ${booking.dropoffLocation?.name}
Type: ${booking.transferType === 'round-trip' ? 'Round Trip' : booking.transferType === 'arrival' ? 'Airport Pickup' : 'Airport Drop-off'}

JOURNEY DETAILS
---------------
Pickup Date: ${booking.pickupDate}
Pickup Time: ${booking.pickupTime}
From: ${booking.pickupAirport?.name}
To: ${booking.dropoffLocation?.name}, ${booking.dropoffLocation?.area}
${booking.flightNumber ? `Flight: ${booking.flightNumber}` : ''}
Distance: ${booking.pricing?.distance || 0} km

VEHICLE
-------
${booking.vehicleName}
Adults: ${booking.adults} | Children: ${booking.children} | Infants: ${booking.infants}
Luggage: ${booking.luggage} pieces

PASSENGER
---------
Name: ${booking.customerInfo?.firstName} ${booking.customerInfo?.lastName}
Email: ${booking.customerInfo?.email}
Phone: ${booking.customerInfo?.phone}

TOTAL: $${booking.pricing?.totalPrice || 0} USD

INCLUDED:
- Meet & Greet at arrivals
- Flight tracking
- 60 min free waiting
- Bottled water
- 24/7 support

For changes: info@rechargetravels.com
`;
};

// Generate WhatsApp message
export const generateWhatsAppMessage = (booking: AirportTransferBooking): string => {
  return encodeURIComponent(`
*AIRPORT TRANSFER CONFIRMATION*

Booking: *${booking.bookingReference}*

${booking.pickupAirport?.code} → ${booking.dropoffLocation?.name}
Date: ${booking.pickupDate}
Time: ${booking.pickupTime}
Vehicle: ${booking.vehicleName}

Passenger: ${booking.customerInfo?.firstName} ${booking.customerInfo?.lastName}
Phone: ${booking.customerInfo?.phone}

Total: *$${booking.pricing?.totalPrice} USD*

Your driver will contact you 24h before pickup.

_Recharge Travels Sri Lanka_
  `.trim());
};

// Send confirmation via Firebase Cloud Function (logs for now)
export const sendBookingConfirmation = async (booking: AirportTransferBooking): Promise<{
  success: boolean;
  pdfUrl?: string;
  emailSent?: boolean;
  whatsappUrl?: string;
}> => {
  try {
    // Log the confirmation request
    await addDoc(collection(db, 'emailLogs'), {
      type: 'airport_transfer_confirmation',
      bookingReference: booking.bookingReference,
      recipientEmail: booking.customerInfo?.email,
      adminEmail: ADMIN_EMAIL,
      status: 'pending',
      createdAt: serverTimestamp()
    });

    // Generate WhatsApp URL for customer
    const whatsappMessage = generateWhatsAppMessage(booking);
    const customerWhatsAppUrl = `https://wa.me/${booking.customerInfo?.phone?.replace(/[^0-9]/g, '')}?text=${whatsappMessage}`;

    // Generate admin notification WhatsApp
    const adminWhatsAppMessage = encodeURIComponent(`
*NEW TRANSFER BOOKING*

Ref: ${booking.bookingReference}
${booking.pickupAirport?.code} → ${booking.dropoffLocation?.name}

Date: ${booking.pickupDate} @ ${booking.pickupTime}
Passenger: ${booking.customerInfo?.firstName} ${booking.customerInfo?.lastName}
Phone: ${booking.customerInfo?.phone}
Email: ${booking.customerInfo?.email}

Vehicle: ${booking.vehicleName}
Total: $${booking.pricing?.totalPrice} USD
    `.trim());
    const adminWhatsAppUrl = `https://wa.me/${WHATSAPP_NUMBER.replace(/[^0-9]/g, '')}?text=${adminWhatsAppMessage}`;

    return {
      success: true,
      emailSent: true, // Will be handled by Cloud Function
      whatsappUrl: customerWhatsAppUrl
    };
  } catch (error) {
    console.error('Error sending confirmation:', error);
    return { success: false };
  }
};

// Download PDF (browser-side using html2canvas/jspdf or print)
export const downloadBookingPDF = async (booking: AirportTransferBooking): Promise<void> => {
  const htmlContent = generateBookingPDFContent(booking);

  // Create a new window for printing/saving as PDF
  const printWindow = window.open('', '_blank');
  if (printWindow) {
    printWindow.document.write(htmlContent);
    printWindow.document.close();

    // Wait for content to load, then trigger print
    printWindow.onload = () => {
      setTimeout(() => {
        printWindow.print();
      }, 500);
    };
  }
};

// Open WhatsApp with pre-filled message
export const openWhatsAppConfirmation = (booking: AirportTransferBooking, phone?: string): void => {
  const message = generateWhatsAppMessage(booking);
  const targetPhone = phone || booking.customerInfo?.phone || '';
  const cleanPhone = targetPhone.replace(/[^0-9]/g, '');
  const url = `https://wa.me/${cleanPhone}?text=${message}`;
  window.open(url, '_blank');
};

// Send WhatsApp to admin
export const notifyAdminWhatsApp = (booking: AirportTransferBooking): void => {
  const message = encodeURIComponent(`
*NEW TRANSFER BOOKING*

Ref: ${booking.bookingReference}
Route: ${booking.pickupAirport?.code} → ${booking.dropoffLocation?.name}
Date: ${booking.pickupDate} @ ${booking.pickupTime}

Passenger: ${booking.customerInfo?.firstName} ${booking.customerInfo?.lastName}
Phone: ${booking.customerInfo?.phone}
Email: ${booking.customerInfo?.email}

Vehicle: ${booking.vehicleName}
Pax: ${booking.adults}A + ${booking.children}C
Distance: ${booking.pricing?.distance}km

TOTAL: $${booking.pricing?.totalPrice} USD
Status: ${booking.paymentStatus === 'paid' ? 'PAID' : 'Pay on Arrival'}
  `.trim());

  const url = `https://wa.me/${WHATSAPP_NUMBER.replace(/[^0-9]/g, '')}?text=${message}`;
  window.open(url, '_blank');
};
