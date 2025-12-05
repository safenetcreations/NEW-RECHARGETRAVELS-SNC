/**
 * Vehicle Rental Contract Generator
 * Generates professional PDF rental agreements
 * 
 * @module services/vehicleRentalContractService
 */

import { jsPDF } from 'jspdf';

// ============================================
// TYPES
// ============================================

export interface ContractData {
    // Contract details
    contractNumber: string;
    contractDate: string;

    // Company details
    companyName: string;
    companyAddress: string;
    companyPhone: string;
    companyEmail: string;
    companyRegistration?: string;

    // Customer details
    customerName: string;
    customerPassport: string;
    customerEmail: string;
    customerPhone: string;
    customerAddress?: string;
    customerNationality?: string;
    emergencyContact?: string;
    emergencyPhone?: string;

    // Vehicle details
    categoryName: string;
    variantName: string;
    vehiclePlate?: string;
    vehicleColor?: string;
    vehicleYear?: string;
    fuelType?: string;
    transmission?: string;

    // Rental details
    pickupDate: string;
    pickupTime?: string;
    pickupLocation: string;
    returnDate: string;
    returnTime?: string;
    returnLocation?: string;
    totalDays: number;
    withDriver: boolean;
    driverName?: string;
    driverPhone?: string;
    driverLicense?: string;

    // Pricing
    baseAmount: number;
    driverFee: number;
    addOnsTotal: number;
    addOns?: Array<{ name: string; price: number; total: number }>;
    seasonalAdjustment?: number;
    promoDiscount?: number;
    promoCode?: string;
    subtotal: number;
    taxAmount: number;
    totalAmount: number;
    depositAmount: number;
    balanceAmount: number;
    paymentStatus: 'pending' | 'deposit_paid' | 'paid';

    // Insurance
    insuranceIncluded: boolean;
    insuranceCoverage?: string;
    excessAmount?: number;

    // Additional terms
    fuelPolicy: 'full_to_full' | 'same_to_same' | 'prepaid';
    mileageLimit?: number; // km, unlimited if not set
    mileageExcessCharge?: number; // per km
    lateFeePerHour?: number;
    additionalDriverFee?: number;
    crossBorderAllowed?: boolean;
}

// ============================================
// CONTRACT TERMS
// ============================================

const standardTerms = {
    lessorObligations: [
        'Provide the vehicle in good working condition with full tank of fuel (if full-to-full policy)',
        'Ensure all required documents and insurance are valid',
        'Provide 24/7 roadside assistance during the rental period',
        'Provide a driver (if "With Driver" option selected) with valid commercial license',
        'Arrange for vehicle replacement in case of breakdown (subject to availability)'
    ],
    lesseeObligations: [
        'Present valid passport, visa, and international driving permit at pickup',
        'Use the vehicle only for lawful purposes',
        'Not permit any unauthorized person to drive the vehicle',
        'Not transport more passengers than the vehicle is designed for',
        'Return the vehicle at the agreed date, time, and location',
        'Report any accident or damage immediately to the lessor',
        'Pay for all traffic fines and toll charges incurred during rental',
        'Not use the vehicle for racing, off-road driving, or towing',
        'Maintain the vehicle in the same condition as received'
    ],
    liabilityTerms: [
        'The lessee is responsible for any damage to the vehicle during the rental period',
        'Insurance coverage is subject to the terms of the policy',
        'Excess/deductible applies in case of accident or damage',
        'The lessee is fully liable for damage caused while driving under influence of alcohol or drugs',
        'The lessee is liable for damage due to negligence or violation of contract terms'
    ],
    cancellationPolicy: [
        'Free cancellation up to 48 hours before pickup',
        '50% charge for cancellation within 24-48 hours',
        '100% charge for cancellation within 24 hours or no-show',
        'Refunds processed within 7-10 business days'
    ],
    fuelPolicies: {
        full_to_full: 'Full-to-Full: Vehicle provided with full tank; return with full tank. Refueling charge applies if not returned full.',
        same_to_same: 'Same-to-Same: Return the vehicle with the same fuel level as received.',
        prepaid: 'Prepaid Fuel: Full tank included in price; no refund for unused fuel.'
    }
};

// ============================================
// PDF GENERATION
// ============================================

/**
 * Generate a professional PDF rental contract
 */
export function generateRentalContract(data: ContractData): void {
    const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
    });

    const pageWidth = 210;
    const pageHeight = 297;
    const margin = 15;
    const contentWidth = pageWidth - (margin * 2);
    let y = margin;

    // Colors
    const primaryColor: [number, number, number] = [30, 64, 175]; // Blue
    const accentColor: [number, number, number] = [245, 158, 11]; // Amber
    const textColor: [number, number, number] = [55, 65, 81]; // Gray
    const lightGray: [number, number, number] = [243, 244, 246];

    // Helper functions
    const addNewPageIfNeeded = (requiredSpace: number) => {
        if (y + requiredSpace > pageHeight - margin) {
            pdf.addPage();
            y = margin;
            return true;
        }
        return false;
    };

    const drawLine = (yPos: number, color: [number, number, number] = lightGray) => {
        pdf.setDrawColor(...color);
        pdf.setLineWidth(0.3);
        pdf.line(margin, yPos, pageWidth - margin, yPos);
    };

    // ====== HEADER ======
    pdf.setFillColor(...primaryColor);
    pdf.rect(0, 0, pageWidth, 40, 'F');

    // Company name
    pdf.setTextColor(255, 255, 255);
    pdf.setFont('helvetica', 'bold');
    pdf.setFontSize(22);
    pdf.text(data.companyName || 'Recharge Travels', margin, 18);

    // Contract title
    pdf.setFont('helvetica', 'normal');
    pdf.setFontSize(11);
    pdf.text('VEHICLE RENTAL AGREEMENT', margin, 28);

    // Contract number
    pdf.setFontSize(10);
    pdf.text(`Contract #: ${data.contractNumber}`, pageWidth - margin, 18, { align: 'right' });
    pdf.text(`Date: ${data.contractDate}`, pageWidth - margin, 25, { align: 'right' });
    pdf.text(`Tourist Service Only`, pageWidth - margin, 32, { align: 'right' });

    y = 50;

    // ====== PARTIES ======
    pdf.setTextColor(...primaryColor);
    pdf.setFont('helvetica', 'bold');
    pdf.setFontSize(12);
    pdf.text('PARTIES TO THIS AGREEMENT', margin, y);
    y += 8;

    // Lessor box
    pdf.setFillColor(...lightGray);
    pdf.roundedRect(margin, y, contentWidth / 2 - 3, 35, 2, 2, 'F');

    pdf.setTextColor(...textColor);
    pdf.setFontSize(9);
    pdf.setFont('helvetica', 'bold');
    pdf.text('LESSOR (Company)', margin + 3, y + 6);
    pdf.setFont('helvetica', 'normal');
    pdf.text(data.companyName || 'Recharge Travels (Pvt) Ltd', margin + 3, y + 12);
    pdf.text(data.companyAddress || 'Colombo, Jaffna, Sri Lanka', margin + 3, y + 17);
    pdf.text(`Tel: ${data.companyPhone || '+94 77 123 4567'}`, margin + 3, y + 22);
    pdf.text(`Email: ${data.companyEmail || 'bookings@rechargetravels.com'}`, margin + 3, y + 27);
    if (data.companyRegistration) {
        pdf.text(`Reg: ${data.companyRegistration}`, margin + 3, y + 32);
    }

    // Lessee box
    pdf.setFillColor(...lightGray);
    pdf.roundedRect(margin + contentWidth / 2 + 3, y, contentWidth / 2 - 3, 35, 2, 2, 'F');

    pdf.setFont('helvetica', 'bold');
    pdf.text('LESSEE (Customer)', margin + contentWidth / 2 + 6, y + 6);
    pdf.setFont('helvetica', 'normal');
    pdf.text(data.customerName, margin + contentWidth / 2 + 6, y + 12);
    pdf.text(`Passport: ${data.customerPassport}`, margin + contentWidth / 2 + 6, y + 17);
    pdf.text(`Tel: ${data.customerPhone}`, margin + contentWidth / 2 + 6, y + 22);
    pdf.text(`Email: ${data.customerEmail}`, margin + contentWidth / 2 + 6, y + 27);
    if (data.customerNationality) {
        pdf.text(`Nationality: ${data.customerNationality}`, margin + contentWidth / 2 + 6, y + 32);
    }

    y += 42;

    // ====== VEHICLE DETAILS ======
    addNewPageIfNeeded(50);

    pdf.setTextColor(...primaryColor);
    pdf.setFont('helvetica', 'bold');
    pdf.setFontSize(12);
    pdf.text('VEHICLE DETAILS', margin, y);
    y += 8;

    pdf.setFillColor(...lightGray);
    pdf.roundedRect(margin, y, contentWidth, 30, 2, 2, 'F');

    pdf.setTextColor(...textColor);
    pdf.setFontSize(10);
    const vehicleDetails = [
        ['Category:', data.categoryName, 'Variant:', data.variantName],
        ['License Plate:', data.vehiclePlate || 'To be assigned', 'Color:', data.vehicleColor || 'As per category'],
        ['Fuel Type:', data.fuelType || 'Petrol', 'Transmission:', data.transmission || 'Automatic']
    ];

    let tableY = y + 7;
    vehicleDetails.forEach(row => {
        pdf.setFont('helvetica', 'bold');
        pdf.text(row[0], margin + 5, tableY);
        pdf.setFont('helvetica', 'normal');
        pdf.text(row[1], margin + 35, tableY);
        pdf.setFont('helvetica', 'bold');
        pdf.text(row[2], margin + 95, tableY);
        pdf.setFont('helvetica', 'normal');
        pdf.text(row[3], margin + 125, tableY);
        tableY += 8;
    });

    y += 38;

    // ====== RENTAL PERIOD ======
    pdf.setTextColor(...primaryColor);
    pdf.setFont('helvetica', 'bold');
    pdf.setFontSize(12);
    pdf.text('RENTAL PERIOD', margin, y);
    y += 8;

    pdf.setFillColor(...lightGray);
    pdf.roundedRect(margin, y, contentWidth, 25, 2, 2, 'F');

    pdf.setTextColor(...textColor);
    pdf.setFontSize(10);

    // Pickup details
    pdf.setFont('helvetica', 'bold');
    pdf.text('PICKUP', margin + 5, y + 7);
    pdf.setFont('helvetica', 'normal');
    pdf.text(`Date: ${data.pickupDate}`, margin + 5, y + 13);
    pdf.text(`Time: ${data.pickupTime || '9:00 AM'}`, margin + 5, y + 19);
    pdf.text(`Location: ${data.pickupLocation}`, margin + 55, y + 13);

    // Return details
    pdf.setFont('helvetica', 'bold');
    pdf.text('RETURN', margin + 110, y + 7);
    pdf.setFont('helvetica', 'normal');
    pdf.text(`Date: ${data.returnDate}`, margin + 110, y + 13);
    pdf.text(`Time: ${data.returnTime || '9:00 AM'}`, margin + 110, y + 19);

    // Duration badge
    pdf.setFillColor(...accentColor);
    pdf.roundedRect(margin + 150, y + 3, 28, 18, 2, 2, 'F');
    pdf.setTextColor(255, 255, 255);
    pdf.setFont('helvetica', 'bold');
    pdf.setFontSize(14);
    pdf.text(`${data.totalDays}`, margin + 164, y + 11, { align: 'center' });
    pdf.setFontSize(8);
    pdf.text('DAYS', margin + 164, y + 17, { align: 'center' });

    y += 33;

    // ====== DRIVER DETAILS (if applicable) ======
    if (data.withDriver && data.driverName) {
        addNewPageIfNeeded(25);

        pdf.setTextColor(...primaryColor);
        pdf.setFont('helvetica', 'bold');
        pdf.setFontSize(12);
        pdf.text('DRIVER DETAILS', margin, y);
        y += 8;

        pdf.setFillColor(254, 243, 199); // Light amber
        pdf.roundedRect(margin, y, contentWidth, 15, 2, 2, 'F');

        pdf.setTextColor(...textColor);
        pdf.setFontSize(10);
        pdf.setFont('helvetica', 'normal');
        pdf.text(`Driver Name: ${data.driverName}`, margin + 5, y + 8);
        pdf.text(`Phone: ${data.driverPhone || 'To be provided'}`, margin + 80, y + 8);
        pdf.text(`License: ${data.driverLicense || 'Valid Commercial License'}`, margin + 130, y + 8);

        y += 23;
    }

    // ====== PRICING ======
    addNewPageIfNeeded(70);

    pdf.setTextColor(...primaryColor);
    pdf.setFont('helvetica', 'bold');
    pdf.setFontSize(12);
    pdf.text('PRICING BREAKDOWN', margin, y);
    y += 8;

    // Pricing table
    const pricingData = [
        ['Base Rental', `$${data.baseAmount.toFixed(2)}`],
    ];

    if (data.driverFee > 0) {
        pricingData.push(['Driver Service', `$${data.driverFee.toFixed(2)}`]);
    }

    if (data.addOns && data.addOns.length > 0) {
        data.addOns.forEach(addon => {
            pricingData.push([`  • ${addon.name}`, `$${addon.total.toFixed(2)}`]);
        });
    }

    if (data.seasonalAdjustment && data.seasonalAdjustment !== 0) {
        const adj = data.seasonalAdjustment > 0 ? '+' : '';
        pricingData.push(['Seasonal Adjustment', `${adj}$${data.seasonalAdjustment.toFixed(2)}`]);
    }

    if (data.promoDiscount && data.promoDiscount > 0) {
        pricingData.push([`Promo (${data.promoCode || 'Applied'})`, `-$${data.promoDiscount.toFixed(2)}`]);
    }

    pricingData.push(['Subtotal', `$${data.subtotal.toFixed(2)}`]);

    if (data.taxAmount > 0) {
        pricingData.push(['Tax', `$${data.taxAmount.toFixed(2)}`]);
    }

    // Draw pricing table
    pdf.setFillColor(...lightGray);
    pricingData.forEach((row, i) => {
        const rowY = y + (i * 7);
        if (i % 2 === 0) {
            pdf.setFillColor(...lightGray);
            pdf.rect(margin, rowY - 4, contentWidth, 7, 'F');
        }
        pdf.setTextColor(...textColor);
        pdf.setFont('helvetica', 'normal');
        pdf.setFontSize(9);
        pdf.text(row[0], margin + 5, rowY);
        pdf.text(row[1], pageWidth - margin - 5, rowY, { align: 'right' });
    });

    y += pricingData.length * 7 + 3;

    // Total row
    pdf.setFillColor(...primaryColor);
    pdf.roundedRect(margin, y - 3, contentWidth, 10, 2, 2, 'F');
    pdf.setTextColor(255, 255, 255);
    pdf.setFont('helvetica', 'bold');
    pdf.setFontSize(11);
    pdf.text('TOTAL AMOUNT', margin + 5, y + 3);
    pdf.text(`$${data.totalAmount.toFixed(2)} USD`, pageWidth - margin - 5, y + 3, { align: 'right' });

    y += 15;

    // Deposit and balance
    pdf.setFillColor(254, 243, 199);
    pdf.roundedRect(margin, y - 2, contentWidth / 2 - 2, 15, 2, 2, 'F');
    pdf.setTextColor(...textColor);
    pdf.setFontSize(9);
    pdf.setFont('helvetica', 'bold');
    pdf.text('Deposit (30%)', margin + 5, y + 4);
    pdf.setFont('helvetica', 'normal');
    pdf.text(`$${data.depositAmount.toFixed(2)}`, margin + 5, y + 10);

    pdf.setFillColor(243, 244, 246);
    pdf.roundedRect(margin + contentWidth / 2 + 2, y - 2, contentWidth / 2 - 2, 15, 2, 2, 'F');
    pdf.setFont('helvetica', 'bold');
    pdf.text('Balance Due', margin + contentWidth / 2 + 7, y + 4);
    pdf.setFont('helvetica', 'normal');
    pdf.text(`$${data.balanceAmount.toFixed(2)}`, margin + contentWidth / 2 + 7, y + 10);

    // Payment status badge
    const statusColors: Record<string, [number, number, number]> = {
        'pending': [239, 68, 68], // Red
        'deposit_paid': [245, 158, 11], // Amber
        'paid': [34, 197, 94] // Green
    };
    const statusText: Record<string, string> = {
        'pending': 'PENDING',
        'deposit_paid': 'DEPOSIT PAID',
        'paid': 'FULLY PAID'
    };

    pdf.setFillColor(...(statusColors[data.paymentStatus] || statusColors.pending));
    pdf.roundedRect(pageWidth - margin - 35, y - 2, 35, 15, 2, 2, 'F');
    pdf.setTextColor(255, 255, 255);
    pdf.setFontSize(8);
    pdf.setFont('helvetica', 'bold');
    pdf.text(statusText[data.paymentStatus] || 'PENDING', pageWidth - margin - 17.5, y + 6, { align: 'center' });

    y += 22;

    // ====== TERMS & CONDITIONS ======
    addNewPageIfNeeded(100);
    pdf.addPage();
    y = margin;

    pdf.setTextColor(...primaryColor);
    pdf.setFont('helvetica', 'bold');
    pdf.setFontSize(14);
    pdf.text('TERMS AND CONDITIONS', margin, y);
    y += 10;

    // Fuel Policy
    pdf.setFontSize(10);
    pdf.setTextColor(...primaryColor);
    pdf.text('Fuel Policy', margin, y);
    y += 5;
    pdf.setTextColor(...textColor);
    pdf.setFont('helvetica', 'normal');
    pdf.setFontSize(8);
    const fuelPolicyText = pdf.splitTextToSize(standardTerms.fuelPolicies[data.fuelPolicy], contentWidth);
    pdf.text(fuelPolicyText, margin, y);
    y += fuelPolicyText.length * 4 + 5;

    // Insurance
    if (data.insuranceIncluded) {
        pdf.setTextColor(...primaryColor);
        pdf.setFontSize(10);
        pdf.setFont('helvetica', 'bold');
        pdf.text('Insurance Coverage', margin, y);
        y += 5;
        pdf.setTextColor(...textColor);
        pdf.setFont('helvetica', 'normal');
        pdf.setFontSize(8);
        pdf.text(`• Comprehensive insurance included`, margin, y);
        y += 4;
        pdf.text(`• Excess/Deductible: $${data.excessAmount || 250}`, margin, y);
        y += 8;
    }

    // Lessor Obligations
    pdf.setTextColor(...primaryColor);
    pdf.setFontSize(10);
    pdf.setFont('helvetica', 'bold');
    pdf.text('Lessor Obligations', margin, y);
    y += 5;
    pdf.setTextColor(...textColor);
    pdf.setFont('helvetica', 'normal');
    pdf.setFontSize(8);
    standardTerms.lessorObligations.forEach(term => {
        const lines = pdf.splitTextToSize(`• ${term}`, contentWidth);
        pdf.text(lines, margin, y);
        y += lines.length * 4;
    });
    y += 5;

    // Lessee Obligations
    pdf.setTextColor(...primaryColor);
    pdf.setFontSize(10);
    pdf.setFont('helvetica', 'bold');
    pdf.text('Lessee Obligations', margin, y);
    y += 5;
    pdf.setTextColor(...textColor);
    pdf.setFont('helvetica', 'normal');
    pdf.setFontSize(8);
    standardTerms.lesseeObligations.forEach(term => {
        addNewPageIfNeeded(10);
        const lines = pdf.splitTextToSize(`• ${term}`, contentWidth);
        pdf.text(lines, margin, y);
        y += lines.length * 4;
    });
    y += 5;

    // Liability
    addNewPageIfNeeded(40);
    pdf.setTextColor(...primaryColor);
    pdf.setFontSize(10);
    pdf.setFont('helvetica', 'bold');
    pdf.text('Liability', margin, y);
    y += 5;
    pdf.setTextColor(...textColor);
    pdf.setFont('helvetica', 'normal');
    pdf.setFontSize(8);
    standardTerms.liabilityTerms.forEach(term => {
        const lines = pdf.splitTextToSize(`• ${term}`, contentWidth);
        pdf.text(lines, margin, y);
        y += lines.length * 4;
    });
    y += 5;

    // Cancellation Policy
    addNewPageIfNeeded(30);
    pdf.setTextColor(...primaryColor);
    pdf.setFontSize(10);
    pdf.setFont('helvetica', 'bold');
    pdf.text('Cancellation Policy', margin, y);
    y += 5;
    pdf.setTextColor(...textColor);
    pdf.setFont('helvetica', 'normal');
    pdf.setFontSize(8);
    standardTerms.cancellationPolicy.forEach(term => {
        pdf.text(`• ${term}`, margin, y);
        y += 4;
    });
    y += 10;

    // ====== SIGNATURES ======
    addNewPageIfNeeded(60);

    pdf.setTextColor(...primaryColor);
    pdf.setFont('helvetica', 'bold');
    pdf.setFontSize(12);
    pdf.text('SIGNATURES', margin, y);
    y += 10;

    pdf.setTextColor(...textColor);
    pdf.setFontSize(9);
    pdf.setFont('helvetica', 'normal');
    pdf.text('By signing below, both parties agree to the terms and conditions stated in this agreement.', margin, y);
    y += 15;

    // Signature boxes
    // Lessor
    pdf.setDrawColor(...lightGray);
    pdf.setLineWidth(0.5);
    pdf.rect(margin, y, contentWidth / 2 - 5, 40);
    pdf.setFont('helvetica', 'bold');
    pdf.setFontSize(9);
    pdf.text('For the Lessor:', margin + 5, y + 8);
    drawLine(y + 25, lightGray);
    pdf.setFontSize(8);
    pdf.setFont('helvetica', 'normal');
    pdf.text('Authorized Signature', margin + 5, y + 30);
    pdf.text('Date: _________________', margin + 5, y + 36);

    // Lessee
    pdf.rect(margin + contentWidth / 2 + 5, y, contentWidth / 2 - 5, 40);
    pdf.setFont('helvetica', 'bold');
    pdf.setFontSize(9);
    pdf.text('For the Lessee:', margin + contentWidth / 2 + 10, y + 8);
    pdf.setFontSize(8);
    pdf.setFont('helvetica', 'normal');
    pdf.text(data.customerName, margin + contentWidth / 2 + 10, y + 14);
    drawLine(y + 25, lightGray);
    pdf.text('Customer Signature', margin + contentWidth / 2 + 10, y + 30);
    pdf.text('Date: _________________', margin + contentWidth / 2 + 10, y + 36);

    // ====== FOOTER ======
    const totalPages = pdf.getNumberOfPages();
    for (let i = 1; i <= totalPages; i++) {
        pdf.setPage(i);
        pdf.setFontSize(8);
        pdf.setTextColor(150, 150, 150);
        pdf.text(
            `Page ${i} of ${totalPages} | Contract #${data.contractNumber} | ${data.companyName || 'Recharge Travels'}`,
            pageWidth / 2,
            pageHeight - 10,
            { align: 'center' }
        );
    }

    // Save the PDF
    pdf.save(`rental-contract-${data.contractNumber}.pdf`);
}

/**
 * Generate contract number
 */
export function generateContractNumber(): string {
    const date = new Date();
    const year = date.getFullYear().toString().slice(-2);
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    const random = Math.random().toString(36).substring(2, 6).toUpperCase();
    return `VR-${year}${month}${day}-${random}`;
}

/**
 * Generate a simple receipt PDF
 */
export function generatePaymentReceipt(data: {
    receiptNumber: string;
    contractNumber: string;
    customerName: string;
    customerEmail: string;
    vehicleDescription: string;
    rentalDates: string;
    amountPaid: number;
    paymentMethod: string;
    paymentDate: string;
    balance?: number;
}): void {
    const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: [150, 200]
    });

    const pageWidth = 150;
    const margin = 10;
    let y = margin;

    // Header
    pdf.setFillColor(30, 64, 175);
    pdf.rect(0, 0, pageWidth, 25, 'F');

    pdf.setTextColor(255, 255, 255);
    pdf.setFont('helvetica', 'bold');
    pdf.setFontSize(14);
    pdf.text('PAYMENT RECEIPT', pageWidth / 2, 12, { align: 'center' });
    pdf.setFontSize(10);
    pdf.text('Recharge Travels', pageWidth / 2, 19, { align: 'center' });

    y = 35;

    // Receipt details
    pdf.setTextColor(55, 65, 81);
    pdf.setFontSize(10);

    const details = [
        ['Receipt #:', data.receiptNumber],
        ['Contract #:', data.contractNumber],
        ['Date:', data.paymentDate],
        ['', ''],
        ['Customer:', data.customerName],
        ['Email:', data.customerEmail],
        ['', ''],
        ['Vehicle:', data.vehicleDescription],
        ['Rental Period:', data.rentalDates],
        ['', ''],
        ['Payment Method:', data.paymentMethod],
        ['Amount Paid:', `$${data.amountPaid.toFixed(2)} USD`],
    ];

    if (data.balance && data.balance > 0) {
        details.push(['Balance Due:', `$${data.balance.toFixed(2)} USD`]);
    }

    details.forEach(row => {
        if (row[0] === '') {
            y += 3;
            return;
        }
        pdf.setFont('helvetica', 'bold');
        pdf.text(row[0], margin, y);
        pdf.setFont('helvetica', 'normal');
        pdf.text(row[1], margin + 40, y);
        y += 7;
    });

    // Thank you message
    y += 10;
    pdf.setFillColor(243, 244, 246);
    pdf.roundedRect(margin, y, pageWidth - margin * 2, 20, 3, 3, 'F');
    pdf.setFont('helvetica', 'italic');
    pdf.setFontSize(9);
    pdf.setTextColor(100, 100, 100);
    pdf.text('Thank you for choosing Recharge Travels!', pageWidth / 2, y + 8, { align: 'center' });
    pdf.text('Have a wonderful journey in Sri Lanka.', pageWidth / 2, y + 14, { align: 'center' });

    // Footer
    pdf.setFontSize(7);
    pdf.setTextColor(150, 150, 150);
    pdf.text('www.rechargetravels.com | +94 77 123 4567', pageWidth / 2, 190, { align: 'center' });

    pdf.save(`receipt-${data.receiptNumber}.pdf`);
}

/**
 * Generate booking voucher PDF
 */
export function generateBookingVoucher(data: {
    bookingReference: string;
    customerName: string;
    vehicleCategory: string;
    vehicleVariant: string;
    pickupDate: string;
    pickupTime: string;
    pickupLocation: string;
    returnDate: string;
    driverName?: string;
    driverPhone?: string;
    emergencyPhone: string;
    importantNotes: string[];
}): void {
    const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a5'
    });

    const pageWidth = 148;
    const margin = 10;
    let y = margin;

    // Header
    pdf.setFillColor(30, 64, 175);
    pdf.rect(0, 0, pageWidth, 30, 'F');

    pdf.setTextColor(255, 255, 255);
    pdf.setFont('helvetica', 'bold');
    pdf.setFontSize(16);
    pdf.text('BOOKING VOUCHER', pageWidth / 2, 14, { align: 'center' });
    pdf.setFontSize(10);
    pdf.setFont('helvetica', 'normal');
    pdf.text(`Ref: ${data.bookingReference}`, pageWidth / 2, 24, { align: 'center' });

    y = 40;

    // Customer name
    pdf.setTextColor(55, 65, 81);
    pdf.setFont('helvetica', 'bold');
    pdf.setFontSize(14);
    pdf.text(data.customerName, pageWidth / 2, y, { align: 'center' });
    y += 10;

    // Vehicle
    pdf.setFillColor(245, 158, 11);
    pdf.roundedRect(margin, y, pageWidth - margin * 2, 15, 3, 3, 'F');
    pdf.setTextColor(255, 255, 255);
    pdf.setFontSize(11);
    pdf.text(`${data.vehicleCategory} - ${data.vehicleVariant}`, pageWidth / 2, y + 10, { align: 'center' });
    y += 25;

    // Pickup details
    pdf.setTextColor(30, 64, 175);
    pdf.setFont('helvetica', 'bold');
    pdf.setFontSize(10);
    pdf.text('PICKUP', margin, y);
    y += 6;

    pdf.setTextColor(55, 65, 81);
    pdf.setFont('helvetica', 'normal');
    pdf.setFontSize(9);
    pdf.text(`📅 ${data.pickupDate} at ${data.pickupTime}`, margin, y);
    y += 5;
    pdf.text(`📍 ${data.pickupLocation}`, margin, y);
    y += 10;

    // Return details
    pdf.setTextColor(30, 64, 175);
    pdf.setFont('helvetica', 'bold');
    pdf.setFontSize(10);
    pdf.text('RETURN', margin, y);
    y += 6;

    pdf.setTextColor(55, 65, 81);
    pdf.setFont('helvetica', 'normal');
    pdf.setFontSize(9);
    pdf.text(`📅 ${data.returnDate}`, margin, y);
    y += 10;

    // Driver info
    if (data.driverName) {
        pdf.setTextColor(30, 64, 175);
        pdf.setFont('helvetica', 'bold');
        pdf.setFontSize(10);
        pdf.text('YOUR DRIVER', margin, y);
        y += 6;

        pdf.setTextColor(55, 65, 81);
        pdf.setFont('helvetica', 'normal');
        pdf.setFontSize(9);
        pdf.text(`👤 ${data.driverName}`, margin, y);
        y += 5;
        pdf.text(`📱 ${data.driverPhone || 'Will be provided'}`, margin, y);
        y += 10;
    }

    // Important notes
    pdf.setFillColor(254, 243, 199);
    const notesHeight = 8 + data.importantNotes.length * 5;
    pdf.roundedRect(margin, y, pageWidth - margin * 2, notesHeight, 3, 3, 'F');

    pdf.setTextColor(146, 64, 14);
    pdf.setFont('helvetica', 'bold');
    pdf.setFontSize(9);
    pdf.text('IMPORTANT', margin + 5, y + 6);

    pdf.setFont('helvetica', 'normal');
    pdf.setFontSize(8);
    data.importantNotes.forEach((note, i) => {
        pdf.text(`• ${note}`, margin + 5, y + 12 + i * 5);
    });

    y += notesHeight + 10;

    // Emergency contact
    pdf.setFillColor(220, 38, 38);
    pdf.roundedRect(margin, y, pageWidth - margin * 2, 12, 3, 3, 'F');
    pdf.setTextColor(255, 255, 255);
    pdf.setFont('helvetica', 'bold');
    pdf.setFontSize(9);
    pdf.text(`24/7 Emergency: ${data.emergencyPhone}`, pageWidth / 2, y + 8, { align: 'center' });

    // Footer
    pdf.setTextColor(150, 150, 150);
    pdf.setFontSize(7);
    pdf.setFont('helvetica', 'normal');
    pdf.text('Present this voucher at pickup | www.rechargetravels.com', pageWidth / 2, 200, { align: 'center' });

    pdf.save(`voucher-${data.bookingReference}.pdf`);
}

export default {
    generateRentalContract,
    generateContractNumber,
    generatePaymentReceipt,
    generateBookingVoucher
};
