/**
 * Vehicle Rental Contract Generator Service
 * Generates rental agreements and contracts
 */

export interface ContractData {
  // Company Info
  companyName: string;
  companyAddress: string;
  companyPhone: string;
  companyEmail: string;
  companyRegistration: string;

  // Owner Info
  ownerName: string;
  ownerAddress: string;
  ownerPhone: string;
  ownerEmail: string;
  ownerNIC: string;

  // Customer Info
  customerName: string;
  customerAddress: string;
  customerPhone: string;
  customerEmail: string;
  customerNIC: string;
  customerLicenseNumber: string;
  customerLicenseExpiry: string;

  // Vehicle Info
  vehicleMake: string;
  vehicleModel: string;
  vehicleYear: number;
  vehicleRegistration: string;
  vehicleColor: string;
  vehicleVIN?: string;
  vehicleMileage: number;
  vehicleFuelLevel: string;
  vehicleCondition: string;

  // Booking Info
  bookingReference: string;
  startDate: string;
  startTime: string;
  endDate: string;
  endTime: string;
  pickupLocation: string;
  returnLocation: string;

  // Pricing
  dailyRate: number;
  totalDays: number;
  subtotal: number;
  serviceFee: number;
  insuranceFee: number;
  deliveryFee: number;
  securityDeposit: number;
  totalAmount: number;

  // Additional
  additionalDrivers?: string[];
  specialConditions?: string[];
  insuranceCoverage: string;
  fuelPolicy: string;
  mileageLimit?: number;
  excessMileageRate?: number;

  // Dates
  contractDate: string;
  contractNumber: string;
}

export interface ContractTemplate {
  id: string;
  name: string;
  type: 'standard' | 'short_term' | 'long_term' | 'corporate';
  language: 'en' | 'si' | 'ta';
}

const COMPANY_INFO = {
  companyName: 'Recharge Travels (Pvt) Ltd',
  companyAddress: '123 Galle Road, Colombo 03, Sri Lanka',
  companyPhone: '+94 11 234 5678',
  companyEmail: 'bookings@rechargetravels.com',
  companyRegistration: 'PV123456'
};

const TERMS_AND_CONDITIONS = `
1. RENTAL AGREEMENT
This Vehicle Rental Agreement ("Agreement") is entered into between the Owner and the Renter for the rental of the vehicle described herein.

2. RENTAL PERIOD
The rental period begins on the Start Date and ends on the End Date specified in this Agreement. Early return does not entitle the Renter to a refund of unused rental days unless otherwise agreed in writing.

3. RENTAL CHARGES
The Renter agrees to pay all rental charges as specified in this Agreement, including daily rental rate, service fees, insurance fees, and any applicable taxes.

4. SECURITY DEPOSIT
A security deposit is required and will be held until the vehicle is returned in satisfactory condition. Deductions may be made for damages, cleaning, fuel replacement, or other charges.

5. DRIVER REQUIREMENTS
- The Renter must possess a valid driver's license
- Minimum age requirement: 21 years
- The vehicle may only be driven by authorized drivers listed in this Agreement
- Driving under the influence of alcohol or drugs is strictly prohibited

6. VEHICLE USE RESTRICTIONS
The Renter agrees NOT to:
- Use the vehicle for illegal purposes
- Sublease or lend the vehicle to others
- Use the vehicle for racing or speed testing
- Transport hazardous materials
- Drive outside designated areas without permission
- Overload the vehicle beyond its capacity

7. FUEL POLICY
The vehicle is provided with a specified fuel level. The Renter must return the vehicle with the same fuel level. Failure to do so will result in refueling charges plus a service fee.

8. MILEAGE
Unless otherwise specified, a daily mileage limit applies. Excess mileage will be charged at the rate specified in this Agreement.

9. MAINTENANCE AND REPAIRS
- The Owner is responsible for regular maintenance
- The Renter must report any mechanical issues immediately
- Unauthorized repairs will not be reimbursed
- The Renter must check oil, water, and tire pressure regularly

10. INSURANCE
Basic insurance coverage is included. The Renter may be liable for damages up to the excess amount specified. Additional coverage options are available.

11. ACCIDENTS AND BREAKDOWNS
In case of accident or breakdown:
- Ensure safety of all passengers
- Contact emergency services if needed
- Report to the Owner immediately
- Do not admit liability
- Obtain details of other parties involved
- Take photographs of the scene

12. RETURN OF VEHICLE
- Return the vehicle on the agreed date and time
- Return to the specified location
- Late returns will be charged at the daily rate
- The vehicle must be returned in clean condition

13. CANCELLATION POLICY
- Free cancellation up to 48 hours before pickup
- 50% charge for cancellation within 48 hours
- No refund for no-shows

14. LIABILITY
The Renter is responsible for:
- All traffic fines and violations during the rental period
- Damage to the vehicle not covered by insurance
- Loss of personal belongings
- Third-party claims arising from vehicle use

15. INDEMNIFICATION
The Renter agrees to indemnify and hold harmless the Owner and Recharge Travels from any claims, damages, or expenses arising from the Renter's use of the vehicle.

16. GOVERNING LAW
This Agreement shall be governed by the laws of Sri Lanka. Any disputes shall be subject to the jurisdiction of the courts of Colombo.

17. ENTIRE AGREEMENT
This Agreement constitutes the entire agreement between the parties. Any modifications must be in writing and signed by both parties.

18. ACKNOWLEDGMENT
By signing this Agreement, the Renter acknowledges having read, understood, and agreed to all terms and conditions stated herein.
`;

/**
 * Generate rental contract HTML
 */
export function generateContractHTML(data: ContractData): string {
  const fullData = { ...COMPANY_INFO, ...data };

  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Vehicle Rental Agreement - ${fullData.contractNumber}</title>
  <style>
    @media print {
      body { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
      .no-print { display: none !important; }
      .page-break { page-break-before: always; }
    }

    * { box-sizing: border-box; margin: 0; padding: 0; }

    body {
      font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
      font-size: 11px;
      line-height: 1.5;
      color: #333;
      background: #fff;
      padding: 20px;
    }

    .contract {
      max-width: 800px;
      margin: 0 auto;
      background: #fff;
    }

    .header {
      text-align: center;
      padding-bottom: 20px;
      border-bottom: 3px solid #004643;
      margin-bottom: 20px;
    }

    .header h1 {
      font-size: 24px;
      color: #004643;
      margin-bottom: 5px;
    }

    .header .subtitle {
      font-size: 14px;
      color: #666;
    }

    .contract-info {
      display: flex;
      justify-content: space-between;
      background: #f8f9fa;
      padding: 15px;
      border-radius: 8px;
      margin-bottom: 20px;
    }

    .contract-info div {
      text-align: center;
    }

    .contract-info .label {
      font-size: 10px;
      color: #666;
      text-transform: uppercase;
    }

    .contract-info .value {
      font-size: 14px;
      font-weight: bold;
      color: #004643;
    }

    .section {
      margin-bottom: 20px;
    }

    .section-title {
      font-size: 14px;
      font-weight: bold;
      color: #004643;
      border-bottom: 2px solid #004643;
      padding-bottom: 5px;
      margin-bottom: 10px;
    }

    .grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 20px;
    }

    .info-box {
      background: #f8f9fa;
      padding: 15px;
      border-radius: 8px;
      border-left: 4px solid #004643;
    }

    .info-box h4 {
      font-size: 12px;
      color: #004643;
      margin-bottom: 10px;
    }

    .info-row {
      display: flex;
      justify-content: space-between;
      padding: 3px 0;
      border-bottom: 1px dotted #ddd;
    }

    .info-row:last-child {
      border-bottom: none;
    }

    .info-row .label {
      color: #666;
    }

    .info-row .value {
      font-weight: 500;
    }

    .vehicle-box {
      background: linear-gradient(135deg, #004643 0%, #006d68 100%);
      color: white;
      padding: 20px;
      border-radius: 8px;
      margin-bottom: 20px;
    }

    .vehicle-box h3 {
      font-size: 20px;
      margin-bottom: 15px;
    }

    .vehicle-details {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 15px;
    }

    .vehicle-detail {
      text-align: center;
    }

    .vehicle-detail .label {
      font-size: 10px;
      opacity: 0.8;
      text-transform: uppercase;
    }

    .vehicle-detail .value {
      font-size: 14px;
      font-weight: bold;
    }

    .rental-period {
      background: #e8f5e9;
      padding: 15px;
      border-radius: 8px;
      margin-bottom: 20px;
    }

    .rental-period h4 {
      color: #2e7d32;
      margin-bottom: 10px;
    }

    .period-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 20px;
    }

    .period-item {
      text-align: center;
      padding: 10px;
      background: white;
      border-radius: 4px;
    }

    .period-item .icon {
      font-size: 20px;
      margin-bottom: 5px;
    }

    .period-item .date {
      font-size: 14px;
      font-weight: bold;
      color: #333;
    }

    .period-item .time {
      font-size: 12px;
      color: #666;
    }

    .period-item .location {
      font-size: 11px;
      color: #999;
    }

    .pricing-table {
      width: 100%;
      border-collapse: collapse;
      margin-bottom: 20px;
    }

    .pricing-table th,
    .pricing-table td {
      padding: 10px;
      text-align: left;
      border-bottom: 1px solid #eee;
    }

    .pricing-table th {
      background: #f8f9fa;
      font-weight: 600;
    }

    .pricing-table .amount {
      text-align: right;
      font-weight: 500;
    }

    .pricing-table .total-row {
      background: #004643;
      color: white;
      font-size: 14px;
      font-weight: bold;
    }

    .pricing-table .total-row td {
      border-bottom: none;
    }

    .pricing-table .deposit-row {
      background: #fff3e0;
    }

    .terms {
      font-size: 9px;
      line-height: 1.4;
      color: #555;
      columns: 2;
      column-gap: 20px;
      text-align: justify;
    }

    .terms h5 {
      font-size: 10px;
      color: #004643;
      margin-top: 8px;
      margin-bottom: 3px;
    }

    .signature-section {
      margin-top: 30px;
      padding-top: 20px;
      border-top: 2px solid #004643;
    }

    .signatures {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 40px;
      margin-top: 20px;
    }

    .signature-box {
      text-align: center;
    }

    .signature-line {
      border-bottom: 1px solid #333;
      margin-bottom: 5px;
      height: 40px;
    }

    .signature-label {
      font-size: 10px;
      color: #666;
    }

    .signature-name {
      font-weight: bold;
      margin-top: 5px;
    }

    .checklist {
      background: #f8f9fa;
      padding: 15px;
      border-radius: 8px;
      margin-bottom: 20px;
    }

    .checklist h4 {
      margin-bottom: 10px;
      color: #004643;
    }

    .checklist-grid {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 10px;
    }

    .checklist-item {
      display: flex;
      align-items: center;
      gap: 5px;
      font-size: 10px;
    }

    .checkbox {
      width: 14px;
      height: 14px;
      border: 1px solid #999;
      border-radius: 2px;
    }

    .footer {
      text-align: center;
      padding-top: 20px;
      margin-top: 20px;
      border-top: 1px solid #eee;
      font-size: 10px;
      color: #666;
    }

    .print-button {
      position: fixed;
      top: 20px;
      right: 20px;
      padding: 10px 20px;
      background: #004643;
      color: white;
      border: none;
      border-radius: 5px;
      cursor: pointer;
      font-size: 14px;
    }

    .print-button:hover {
      background: #006d68;
    }
  </style>
</head>
<body>
  <button class="print-button no-print" onclick="window.print()">Print Contract</button>

  <div class="contract">
    <!-- Header -->
    <div class="header">
      <h1>${fullData.companyName}</h1>
      <p class="subtitle">VEHICLE RENTAL AGREEMENT</p>
    </div>

    <!-- Contract Info -->
    <div class="contract-info">
      <div>
        <div class="label">Contract Number</div>
        <div class="value">${fullData.contractNumber}</div>
      </div>
      <div>
        <div class="label">Booking Reference</div>
        <div class="value">${fullData.bookingReference}</div>
      </div>
      <div>
        <div class="label">Contract Date</div>
        <div class="value">${fullData.contractDate}</div>
      </div>
    </div>

    <!-- Parties Section -->
    <div class="section">
      <h3 class="section-title">PARTIES TO THIS AGREEMENT</h3>
      <div class="grid">
        <div class="info-box">
          <h4>VEHICLE OWNER</h4>
          <div class="info-row">
            <span class="label">Name</span>
            <span class="value">${fullData.ownerName}</span>
          </div>
          <div class="info-row">
            <span class="label">Address</span>
            <span class="value">${fullData.ownerAddress}</span>
          </div>
          <div class="info-row">
            <span class="label">Phone</span>
            <span class="value">${fullData.ownerPhone}</span>
          </div>
          <div class="info-row">
            <span class="label">NIC</span>
            <span class="value">${fullData.ownerNIC}</span>
          </div>
        </div>

        <div class="info-box">
          <h4>RENTER</h4>
          <div class="info-row">
            <span class="label">Name</span>
            <span class="value">${fullData.customerName}</span>
          </div>
          <div class="info-row">
            <span class="label">Address</span>
            <span class="value">${fullData.customerAddress}</span>
          </div>
          <div class="info-row">
            <span class="label">Phone</span>
            <span class="value">${fullData.customerPhone}</span>
          </div>
          <div class="info-row">
            <span class="label">NIC/Passport</span>
            <span class="value">${fullData.customerNIC}</span>
          </div>
          <div class="info-row">
            <span class="label">License No.</span>
            <span class="value">${fullData.customerLicenseNumber}</span>
          </div>
          <div class="info-row">
            <span class="label">License Expiry</span>
            <span class="value">${fullData.customerLicenseExpiry}</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Vehicle Section -->
    <div class="vehicle-box">
      <h3>${fullData.vehicleYear} ${fullData.vehicleMake} ${fullData.vehicleModel}</h3>
      <div class="vehicle-details">
        <div class="vehicle-detail">
          <div class="label">Registration</div>
          <div class="value">${fullData.vehicleRegistration}</div>
        </div>
        <div class="vehicle-detail">
          <div class="label">Color</div>
          <div class="value">${fullData.vehicleColor}</div>
        </div>
        <div class="vehicle-detail">
          <div class="label">Odometer</div>
          <div class="value">${fullData.vehicleMileage.toLocaleString()} km</div>
        </div>
        <div class="vehicle-detail">
          <div class="label">Fuel Level</div>
          <div class="value">${fullData.vehicleFuelLevel}</div>
        </div>
        <div class="vehicle-detail">
          <div class="label">Condition</div>
          <div class="value">${fullData.vehicleCondition}</div>
        </div>
        ${fullData.vehicleVIN ? `
        <div class="vehicle-detail">
          <div class="label">VIN</div>
          <div class="value">${fullData.vehicleVIN}</div>
        </div>
        ` : ''}
      </div>
    </div>

    <!-- Rental Period -->
    <div class="rental-period">
      <h4>RENTAL PERIOD</h4>
      <div class="period-grid">
        <div class="period-item">
          <div class="icon">📅</div>
          <div class="date">${fullData.startDate}</div>
          <div class="time">${fullData.startTime}</div>
          <div class="location">Pick-up: ${fullData.pickupLocation}</div>
        </div>
        <div class="period-item">
          <div class="icon">🏁</div>
          <div class="date">${fullData.endDate}</div>
          <div class="time">${fullData.endTime}</div>
          <div class="location">Return: ${fullData.returnLocation}</div>
        </div>
      </div>
    </div>

    <!-- Pricing -->
    <div class="section">
      <h3 class="section-title">RENTAL CHARGES</h3>
      <table class="pricing-table">
        <tr>
          <th>Description</th>
          <th class="amount">Amount (LKR)</th>
        </tr>
        <tr>
          <td>Daily Rate (${fullData.dailyRate.toLocaleString()} x ${fullData.totalDays} days)</td>
          <td class="amount">${fullData.subtotal.toLocaleString()}</td>
        </tr>
        <tr>
          <td>Service Fee</td>
          <td class="amount">${fullData.serviceFee.toLocaleString()}</td>
        </tr>
        <tr>
          <td>Insurance Coverage (${fullData.insuranceCoverage})</td>
          <td class="amount">${fullData.insuranceFee.toLocaleString()}</td>
        </tr>
        ${fullData.deliveryFee > 0 ? `
        <tr>
          <td>Delivery/Pickup Fee</td>
          <td class="amount">${fullData.deliveryFee.toLocaleString()}</td>
        </tr>
        ` : ''}
        <tr class="deposit-row">
          <td>Security Deposit (Refundable)</td>
          <td class="amount">${fullData.securityDeposit.toLocaleString()}</td>
        </tr>
        <tr class="total-row">
          <td>TOTAL AMOUNT</td>
          <td class="amount">${fullData.totalAmount.toLocaleString()}</td>
        </tr>
      </table>

      <p style="font-size: 10px; color: #666;">
        <strong>Fuel Policy:</strong> ${fullData.fuelPolicy}<br>
        ${fullData.mileageLimit ? `<strong>Mileage Limit:</strong> ${fullData.mileageLimit} km/day (Excess: ${fullData.excessMileageRate} LKR/km)` : '<strong>Mileage:</strong> Unlimited'}
      </p>
    </div>

    <!-- Vehicle Checklist -->
    <div class="checklist">
      <h4>VEHICLE CONDITION CHECKLIST (to be completed at pickup)</h4>
      <div class="checklist-grid">
        <div class="checklist-item"><div class="checkbox"></div> Exterior Clean</div>
        <div class="checklist-item"><div class="checkbox"></div> Interior Clean</div>
        <div class="checklist-item"><div class="checkbox"></div> No Visible Damage</div>
        <div class="checklist-item"><div class="checkbox"></div> All Lights Working</div>
        <div class="checklist-item"><div class="checkbox"></div> Spare Tire Present</div>
        <div class="checklist-item"><div class="checkbox"></div> Jack & Tools Present</div>
        <div class="checklist-item"><div class="checkbox"></div> First Aid Kit</div>
        <div class="checklist-item"><div class="checkbox"></div> Fire Extinguisher</div>
        <div class="checklist-item"><div class="checkbox"></div> Registration Documents</div>
        <div class="checklist-item"><div class="checkbox"></div> Insurance Documents</div>
        <div class="checklist-item"><div class="checkbox"></div> AC Working</div>
        <div class="checklist-item"><div class="checkbox"></div> Audio System Working</div>
      </div>
    </div>

    <!-- Terms and Conditions -->
    <div class="section page-break">
      <h3 class="section-title">TERMS AND CONDITIONS</h3>
      <div class="terms">
        ${TERMS_AND_CONDITIONS.split('\n').map(line => {
          if (line.match(/^\d+\./)) {
            return `<h5>${line}</h5>`;
          }
          return line.startsWith('-') ? `<p>${line}</p>` : `<p>${line}</p>`;
        }).join('')}
      </div>
    </div>

    <!-- Signatures -->
    <div class="signature-section">
      <h3 class="section-title">SIGNATURES</h3>
      <p style="font-size: 10px; margin-bottom: 15px;">
        By signing below, both parties acknowledge that they have read, understood, and agree to all terms and conditions of this Vehicle Rental Agreement.
      </p>

      <div class="signatures">
        <div class="signature-box">
          <div class="signature-line"></div>
          <div class="signature-label">Vehicle Owner Signature</div>
          <div class="signature-name">${fullData.ownerName}</div>
          <div class="signature-label">Date: _______________</div>
        </div>

        <div class="signature-box">
          <div class="signature-line"></div>
          <div class="signature-label">Renter Signature</div>
          <div class="signature-name">${fullData.customerName}</div>
          <div class="signature-label">Date: _______________</div>
        </div>
      </div>
    </div>

    <!-- Footer -->
    <div class="footer">
      <p><strong>${fullData.companyName}</strong></p>
      <p>${fullData.companyAddress}</p>
      <p>Tel: ${fullData.companyPhone} | Email: ${fullData.companyEmail}</p>
      <p>Business Registration: ${fullData.companyRegistration}</p>
      <p style="margin-top: 10px;">This document was generated electronically and is valid without signature when accompanied by a valid booking confirmation.</p>
    </div>
  </div>
</body>
</html>
  `;
}

/**
 * Generate contract number
 */
export function generateContractNumber(): string {
  const date = new Date();
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const random = Math.random().toString(36).substring(2, 8).toUpperCase();
  return `RC-${year}${month}-${random}`;
}

/**
 * Download contract as HTML file
 */
export function downloadContractHTML(data: ContractData): void {
  const html = generateContractHTML(data);
  const blob = new Blob([html], { type: 'text/html' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `contract-${data.contractNumber}.html`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

/**
 * Open contract in new window for printing
 */
export function openContractForPrint(data: ContractData): void {
  const html = generateContractHTML(data);
  const newWindow = window.open('', '_blank');
  if (newWindow) {
    newWindow.document.write(html);
    newWindow.document.close();
  }
}

/**
 * Create contract data from booking
 */
export function createContractFromBooking(booking: {
  id: string;
  bookingReference: string;
  vehicleId: string;
  startDate: Date | string;
  endDate: Date | string;
  pickupLocation: string;
  returnLocation: string;
  totalAmount: number;
  securityDeposit: number;
  customer: {
    name: string;
    email: string;
    phone: string;
    address?: string;
    nic?: string;
    licenseNumber?: string;
    licenseExpiry?: string;
  };
  owner: {
    name: string;
    email: string;
    phone: string;
    address?: string;
    nic?: string;
  };
  vehicle: {
    make: string;
    model: string;
    year: number;
    registrationNumber: string;
    color?: string;
    vin?: string;
  };
  pricing: {
    dailyRate: number;
    totalDays: number;
    subtotal: number;
    serviceFee: number;
    insuranceFee: number;
    deliveryFee: number;
  };
}): ContractData {
  const startDate = new Date(booking.startDate);
  const endDate = new Date(booking.endDate);

  return {
    ...COMPANY_INFO,

    // Owner
    ownerName: booking.owner.name,
    ownerAddress: booking.owner.address || 'Not provided',
    ownerPhone: booking.owner.phone,
    ownerEmail: booking.owner.email,
    ownerNIC: booking.owner.nic || 'Not provided',

    // Customer
    customerName: booking.customer.name,
    customerAddress: booking.customer.address || 'Not provided',
    customerPhone: booking.customer.phone,
    customerEmail: booking.customer.email,
    customerNIC: booking.customer.nic || 'Not provided',
    customerLicenseNumber: booking.customer.licenseNumber || 'Not provided',
    customerLicenseExpiry: booking.customer.licenseExpiry || 'Not provided',

    // Vehicle
    vehicleMake: booking.vehicle.make,
    vehicleModel: booking.vehicle.model,
    vehicleYear: booking.vehicle.year,
    vehicleRegistration: booking.vehicle.registrationNumber,
    vehicleColor: booking.vehicle.color || 'Not specified',
    vehicleVIN: booking.vehicle.vin,
    vehicleMileage: 0, // To be filled at pickup
    vehicleFuelLevel: 'Full', // Default
    vehicleCondition: 'Good', // Default

    // Booking
    bookingReference: booking.bookingReference,
    startDate: startDate.toLocaleDateString('en-GB'),
    startTime: startDate.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' }),
    endDate: endDate.toLocaleDateString('en-GB'),
    endTime: endDate.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' }),
    pickupLocation: booking.pickupLocation,
    returnLocation: booking.returnLocation,

    // Pricing
    dailyRate: booking.pricing.dailyRate,
    totalDays: booking.pricing.totalDays,
    subtotal: booking.pricing.subtotal,
    serviceFee: booking.pricing.serviceFee,
    insuranceFee: booking.pricing.insuranceFee,
    deliveryFee: booking.pricing.deliveryFee,
    securityDeposit: booking.securityDeposit,
    totalAmount: booking.totalAmount,

    // Additional
    insuranceCoverage: 'Basic',
    fuelPolicy: 'Same-to-Same (Return with same fuel level as pickup)',

    // Contract
    contractDate: new Date().toLocaleDateString('en-GB'),
    contractNumber: generateContractNumber()
  };
}

export default {
  generateContractHTML,
  generateContractNumber,
  downloadContractHTML,
  openContractForPrint,
  createContractFromBooking
};
