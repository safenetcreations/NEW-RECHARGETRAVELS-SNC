// Booking Voucher & Invoice PDF Generator
// Generates professional branded documents for B2B bookings

import * as admin from 'firebase-admin';

const BRAND_COLOR = '#10b981';
const LOGO_URL = 'https://rechargetravels.com/images/logo.png';

interface BookingData {
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
  meetingPoint?: string;
  departureTime?: string;
  paymentStatus: string;
}

// Generate HTML Voucher (can be converted to PDF using a service like Puppeteer)
export const generateBookingVoucherHTML = (data: BookingData): string => {
  const createdDate = new Date().toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'long',
    year: 'numeric'
  });

  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Booking Voucher - ${data.bookingId}</title>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
    
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }
    
    body {
      font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
      background: #f9fafb;
      color: #111827;
      line-height: 1.5;
    }
    
    .voucher {
      max-width: 800px;
      margin: 40px auto;
      background: white;
      border-radius: 16px;
      overflow: hidden;
      box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
    }
    
    .header {
      background: linear-gradient(135deg, ${BRAND_COLOR} 0%, #14b8a6 100%);
      padding: 32px 40px;
      color: white;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    
    .logo h1 {
      font-size: 28px;
      font-weight: 700;
      letter-spacing: -0.5px;
    }
    
    .logo p {
      font-size: 14px;
      opacity: 0.9;
    }
    
    .voucher-type {
      text-align: right;
    }
    
    .voucher-type h2 {
      font-size: 24px;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 2px;
    }
    
    .voucher-type p {
      font-size: 14px;
      opacity: 0.8;
    }
    
    .content {
      padding: 40px;
    }
    
    .reference-box {
      background: linear-gradient(135deg, #f0fdf4 0%, #ecfdf5 100%);
      border: 2px solid ${BRAND_COLOR};
      border-radius: 12px;
      padding: 20px;
      text-align: center;
      margin-bottom: 32px;
    }
    
    .reference-box label {
      display: block;
      font-size: 12px;
      text-transform: uppercase;
      letter-spacing: 1px;
      color: #6b7280;
      margin-bottom: 4px;
    }
    
    .reference-box .ref-number {
      font-size: 32px;
      font-weight: 700;
      color: #047857;
      font-family: monospace;
    }
    
    .section {
      margin-bottom: 32px;
    }
    
    .section-title {
      font-size: 14px;
      font-weight: 600;
      color: ${BRAND_COLOR};
      text-transform: uppercase;
      letter-spacing: 1px;
      margin-bottom: 16px;
      padding-bottom: 8px;
      border-bottom: 2px solid #e5e7eb;
    }
    
    .details-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 16px;
    }
    
    .detail-item {
      padding: 12px 16px;
      background: #f9fafb;
      border-radius: 8px;
    }
    
    .detail-item label {
      display: block;
      font-size: 12px;
      color: #6b7280;
      margin-bottom: 4px;
    }
    
    .detail-item .value {
      font-size: 16px;
      font-weight: 600;
      color: #111827;
    }
    
    .tour-name {
      background: #111827 !important;
      grid-column: span 2;
    }
    
    .tour-name label {
      color: #9ca3af !important;
    }
    
    .tour-name .value {
      color: white !important;
      font-size: 20px !important;
    }
    
    .pricing-table {
      width: 100%;
      border-collapse: collapse;
    }
    
    .pricing-table td {
      padding: 12px 16px;
      border-bottom: 1px solid #e5e7eb;
    }
    
    .pricing-table td:last-child {
      text-align: right;
      font-weight: 500;
    }
    
    .pricing-table tr.discount td {
      color: ${BRAND_COLOR};
    }
    
    .pricing-table tr.total td {
      border-top: 2px solid #111827;
      border-bottom: none;
      font-size: 20px;
      font-weight: 700;
    }
    
    .pricing-table tr.total td:last-child {
      color: ${BRAND_COLOR};
    }
    
    .payment-badge {
      display: inline-block;
      padding: 6px 16px;
      border-radius: 9999px;
      font-size: 14px;
      font-weight: 600;
      text-transform: uppercase;
    }
    
    .payment-paid {
      background: #d1fae5;
      color: #065f46;
    }
    
    .payment-pending {
      background: #fef3c7;
      color: #92400e;
    }
    
    .special-requests {
      background: #fef3c7;
      border-radius: 12px;
      padding: 16px;
    }
    
    .special-requests h4 {
      color: #92400e;
      font-size: 14px;
      font-weight: 600;
      margin-bottom: 8px;
    }
    
    .special-requests p {
      color: #78350f;
      font-size: 14px;
    }
    
    .footer {
      background: #1f2937;
      padding: 32px 40px;
      color: #9ca3af;
      text-align: center;
    }
    
    .footer p {
      font-size: 12px;
      margin-bottom: 8px;
    }
    
    .footer .contact {
      color: ${BRAND_COLOR};
      font-weight: 500;
    }
    
    .qr-placeholder {
      width: 120px;
      height: 120px;
      background: #f3f4f6;
      border: 2px dashed #d1d5db;
      border-radius: 12px;
      margin: 0 auto 16px;
      display: flex;
      align-items: center;
      justify-content: center;
      color: #9ca3af;
      font-size: 12px;
    }
    
    @media print {
      body {
        background: white;
      }
      .voucher {
        margin: 0;
        box-shadow: none;
        border-radius: 0;
      }
    }
  </style>
</head>
<body>
  <div class="voucher">
    <div class="header">
      <div class="logo">
        <h1>Recharge Travels</h1>
        <p>Sri Lanka's Premier B2B Partner</p>
      </div>
      <div class="voucher-type">
        <h2>Tour Voucher</h2>
        <p>Generated: ${createdDate}</p>
      </div>
    </div>
    
    <div class="content">
      <div class="reference-box">
        <label>Booking Reference</label>
        <div class="ref-number">${data.bookingId}</div>
      </div>
      
      <div class="section">
        <div class="section-title">🏝️ Tour Details</div>
        <div class="details-grid">
          <div class="detail-item tour-name">
            <label>Tour Package</label>
            <div class="value">${data.tourName}</div>
          </div>
          <div class="detail-item">
            <label>Travel Date</label>
            <div class="value">${data.tourDate}</div>
          </div>
          <div class="detail-item">
            <label>Number of Guests</label>
            <div class="value">${data.guestCount} person(s)</div>
          </div>
          ${data.meetingPoint ? `
          <div class="detail-item">
            <label>Meeting Point</label>
            <div class="value">${data.meetingPoint}</div>
          </div>
          ` : ''}
          ${data.departureTime ? `
          <div class="detail-item">
            <label>Departure Time</label>
            <div class="value">${data.departureTime}</div>
          </div>
          ` : ''}
        </div>
      </div>
      
      <div class="section">
        <div class="section-title">👤 Client Information</div>
        <div class="details-grid">
          <div class="detail-item">
            <label>Client Name</label>
            <div class="value">${data.clientName}</div>
          </div>
          <div class="detail-item">
            <label>Phone</label>
            <div class="value">${data.clientPhone}</div>
          </div>
          <div class="detail-item" style="grid-column: span 2;">
            <label>Email</label>
            <div class="value">${data.clientEmail}</div>
          </div>
        </div>
      </div>
      
      <div class="section">
        <div class="section-title">💳 Payment Summary</div>
        <table class="pricing-table">
          <tr>
            <td>Original Price (${data.guestCount} guest(s))</td>
            <td>$${data.originalPrice.toFixed(2)}</td>
          </tr>
          <tr class="discount">
            <td>B2B Partner Discount (10%)</td>
            <td>-$${data.discount.toFixed(2)}</td>
          </tr>
          <tr class="total">
            <td>Total Amount</td>
            <td>$${data.finalPrice.toFixed(2)}</td>
          </tr>
        </table>
        <div style="margin-top: 16px;">
          <span class="payment-badge ${data.paymentStatus === 'paid' ? 'payment-paid' : 'payment-pending'}">
            ${data.paymentStatus === 'paid' ? '✓ PAID' : '⏳ PAYMENT PENDING'}
          </span>
        </div>
      </div>
      
      ${data.specialRequests ? `
      <div class="section">
        <div class="special-requests">
          <h4>📝 Special Requests</h4>
          <p>${data.specialRequests}</p>
        </div>
      </div>
      ` : ''}
      
      <div class="section" style="text-align: center;">
        <div class="qr-placeholder">QR Code</div>
        <p style="color: #6b7280; font-size: 12px;">Scan for digital verification</p>
      </div>
      
      <div style="background: #eff6ff; border-radius: 12px; padding: 16px; text-align: center;">
        <p style="color: #1e40af; font-size: 14px;">
          <strong>Booked by:</strong> ${data.agencyName} (B2B Partner)
        </p>
      </div>
    </div>
    
    <div class="footer">
      <p>Thank you for choosing Recharge Travels!</p>
      <p class="contact">📧 b2b@rechargetravels.com | 📞 +94 77 123 4567</p>
      <p style="margin-top: 16px;">
        © ${new Date().getFullYear()} Recharge Travels (Pvt) Ltd. All rights reserved.<br>
        Colombo, Sri Lanka
      </p>
    </div>
  </div>
</body>
</html>
  `;
};

// Generate Invoice HTML
export const generateInvoiceHTML = (data: BookingData & { invoiceNumber?: string }): string => {
  const invoiceNumber = data.invoiceNumber || `INV-${data.bookingId.substring(0, 8).toUpperCase()}`;
  const createdDate = new Date().toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'long',
    year: 'numeric'
  });

  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Invoice - ${invoiceNumber}</title>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
    
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: 'Inter', sans-serif; background: #f9fafb; color: #111827; line-height: 1.6; }
    
    .invoice { max-width: 800px; margin: 40px auto; background: white; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1); }
    
    .header { padding: 40px; display: flex; justify-content: space-between; border-bottom: 1px solid #e5e7eb; }
    .company-info h1 { font-size: 28px; font-weight: 700; color: ${BRAND_COLOR}; }
    .company-info p { color: #6b7280; font-size: 14px; margin-top: 8px; }
    
    .invoice-info { text-align: right; }
    .invoice-info h2 { font-size: 24px; font-weight: 700; color: #111827; text-transform: uppercase; letter-spacing: 2px; }
    .invoice-info .number { font-size: 20px; color: ${BRAND_COLOR}; font-family: monospace; margin: 8px 0; }
    .invoice-info .date { color: #6b7280; font-size: 14px; }
    
    .content { padding: 40px; }
    
    .parties { display: grid; grid-template-columns: 1fr 1fr; gap: 40px; margin-bottom: 40px; }
    .party h3 { font-size: 12px; text-transform: uppercase; letter-spacing: 1px; color: #6b7280; margin-bottom: 12px; }
    .party p { font-size: 16px; font-weight: 600; }
    .party .details { color: #6b7280; font-size: 14px; font-weight: 400; margin-top: 4px; }
    
    .items-table { width: 100%; border-collapse: collapse; margin-bottom: 32px; }
    .items-table th { background: #f9fafb; padding: 16px; text-align: left; font-size: 12px; text-transform: uppercase; letter-spacing: 1px; color: #6b7280; border-bottom: 2px solid #e5e7eb; }
    .items-table td { padding: 16px; border-bottom: 1px solid #e5e7eb; }
    .items-table .amount { text-align: right; font-weight: 600; }
    
    .totals { margin-left: auto; width: 300px; }
    .totals .row { display: flex; justify-content: space-between; padding: 12px 0; border-bottom: 1px solid #e5e7eb; }
    .totals .row.discount { color: ${BRAND_COLOR}; }
    .totals .row.total { border-top: 2px solid #111827; border-bottom: none; font-size: 20px; font-weight: 700; padding-top: 16px; }
    .totals .row.total .value { color: ${BRAND_COLOR}; }
    
    .status-badge { display: inline-block; padding: 8px 20px; border-radius: 9999px; font-weight: 600; text-transform: uppercase; font-size: 14px; }
    .status-paid { background: #d1fae5; color: #065f46; }
    .status-pending { background: #fef3c7; color: #92400e; }
    
    .footer { background: #1f2937; padding: 32px 40px; color: #9ca3af; }
    .footer h4 { color: white; font-size: 14px; margin-bottom: 8px; }
    .footer p { font-size: 12px; }
    .footer .bank-details { background: rgba(255,255,255,0.1); padding: 16px; border-radius: 8px; margin-top: 16px; }
    
    @media print { body { background: white; } .invoice { margin: 0; box-shadow: none; } }
  </style>
</head>
<body>
  <div class="invoice">
    <div class="header">
      <div class="company-info">
        <h1>Recharge Travels</h1>
        <p>Recharge Travels (Pvt) Ltd<br>Colombo, Sri Lanka<br>b2b@rechargetravels.com<br>+94 77 123 4567</p>
      </div>
      <div class="invoice-info">
        <h2>Invoice</h2>
        <div class="number">${invoiceNumber}</div>
        <div class="date">Date: ${createdDate}</div>
      </div>
    </div>
    
    <div class="content">
      <div class="parties">
        <div class="party">
          <h3>Bill To</h3>
          <p>${data.agencyName}</p>
          <div class="details">B2B Partner Agency</div>
        </div>
        <div class="party">
          <h3>Guest Details</h3>
          <p>${data.clientName}</p>
          <div class="details">${data.clientEmail}<br>${data.clientPhone}</div>
        </div>
      </div>
      
      <table class="items-table">
        <thead>
          <tr>
            <th>Description</th>
            <th>Date</th>
            <th>Guests</th>
            <th class="amount">Amount</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>
              <strong>${data.tourName}</strong><br>
              <span style="color: #6b7280; font-size: 14px;">Booking Ref: ${data.bookingId}</span>
            </td>
            <td>${data.tourDate}</td>
            <td>${data.guestCount}</td>
            <td class="amount">$${data.originalPrice.toFixed(2)}</td>
          </tr>
        </tbody>
      </table>
      
      <div class="totals">
        <div class="row">
          <span>Subtotal</span>
          <span>$${data.originalPrice.toFixed(2)}</span>
        </div>
        <div class="row discount">
          <span>B2B Discount (10%)</span>
          <span>-$${data.discount.toFixed(2)}</span>
        </div>
        <div class="row total">
          <span>Total</span>
          <span class="value">$${data.finalPrice.toFixed(2)}</span>
        </div>
      </div>
      
      <div style="margin-top: 32px; text-align: center;">
        <span class="status-badge ${data.paymentStatus === 'paid' ? 'status-paid' : 'status-pending'}">
          ${data.paymentStatus === 'paid' ? '✓ PAID' : '⏳ PAYMENT PENDING'}
        </span>
      </div>
    </div>
    
    <div class="footer">
      <h4>Payment Information</h4>
      <p>Please complete payment within 7 days of invoice date.</p>
      <div class="bank-details">
        <p><strong>Bank:</strong> HSBC Bank Sri Lanka</p>
        <p><strong>Account Name:</strong> Recharge Travels (Pvt) Ltd</p>
        <p><strong>Account Number:</strong> 0012-XXXX-XXXX-1234</p>
        <p><strong>SWIFT Code:</strong> HSBCLKLX</p>
        <p><strong>Reference:</strong> ${invoiceNumber}</p>
      </div>
      <p style="margin-top: 16px; text-align: center;">Thank you for your business!</p>
    </div>
  </div>
</body>
</html>
  `;
};

export default {
  generateBookingVoucherHTML,
  generateInvoiceHTML
};
