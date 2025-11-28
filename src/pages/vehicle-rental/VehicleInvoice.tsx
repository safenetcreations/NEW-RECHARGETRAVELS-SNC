import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { 
  FileText, 
  Download, 
  Printer,
  Mail,
  Calendar,
  Car,
  User,
  MapPin,
  Clock,
  DollarSign,
  Shield,
  CheckCircle,
  ArrowLeft,
  CreditCard,
  Receipt,
  Building,
  Phone,
  Globe
} from 'lucide-react';

interface InvoiceData {
  invoiceNumber: string;
  invoiceDate: Date;
  dueDate: Date;
  status: 'paid' | 'pending' | 'overdue';
  
  // Customer info
  customer: {
    name: string;
    email: string;
    phone: string;
    address: string;
    country: string;
  };
  
  // Booking details
  booking: {
    id: string;
    vehicleName: string;
    vehicleType: string;
    vehicleImage: string;
    licensePlate: string;
    pickupDate: Date;
    returnDate: Date;
    pickupLocation: string;
    returnLocation: string;
    totalDays: number;
  };
  
  // Pricing breakdown
  pricing: {
    dailyRate: number;
    rentalDays: number;
    baseRentalAmount: number;
    insurance: {
      type: string;
      dailyRate: number;
      total: number;
    };
    delivery?: {
      pickup: number;
      return: number;
      total: number;
    };
    addOns: Array<{
      name: string;
      quantity: number;
      unitPrice: number;
      total: number;
    }>;
    serviceFee: number;
    securityDeposit: number;
    discount?: {
      code: string;
      percentage: number;
      amount: number;
    };
    subtotal: number;
    grandTotal: number;
  };
  
  // Payment info
  payment: {
    method: string;
    transactionId: string;
    paidAmount: number;
    paidDate: Date;
    cardLast4?: string;
  };
  
  // Owner info (for owner invoices)
  owner?: {
    name: string;
    businessName: string;
    email: string;
    phone: string;
  };
}

const VehicleInvoice: React.FC = () => {
  const { bookingId } = useParams<{ bookingId: string }>();
  const [invoice, setInvoice] = useState<InvoiceData | null>(null);
  const [loading, setLoading] = useState(true);
  const [downloading, setDownloading] = useState(false);
  const [emailSending, setEmailSending] = useState(false);

  useEffect(() => {
    loadInvoice();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [bookingId]);

  const loadInvoice = async () => {
    setLoading(true);
    try {
      // Simulated data - replace with actual Firebase call
      await new Promise(resolve => setTimeout(resolve, 800));

      const mockInvoice: InvoiceData = {
        invoiceNumber: 'INV-VR-2024-00156',
        invoiceDate: new Date(),
        dueDate: new Date(),
        status: 'paid',
        
        customer: {
          name: 'John Anderson',
          email: 'john.anderson@email.com',
          phone: '+1 (555) 123-4567',
          address: '123 Main Street, New York, NY 10001',
          country: 'United States'
        },
        
        booking: {
          id: bookingId || 'BK-2024-00156',
          vehicleName: '2024 Toyota Land Cruiser',
          vehicleType: 'Premium SUV',
          vehicleImage: 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?w=200',
          licensePlate: 'CAR-1234',
          pickupDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
          returnDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
          pickupLocation: 'Bandaranaike International Airport (CMB)',
          returnLocation: 'Colombo City Center',
          totalDays: 3
        },
        
        pricing: {
          dailyRate: 120,
          rentalDays: 3,
          baseRentalAmount: 360,
          insurance: {
            type: 'Silver Package',
            dailyRate: 14,
            total: 42
          },
          delivery: {
            pickup: 25,
            return: 15,
            total: 40
          },
          addOns: [
            { name: 'GPS Navigation', quantity: 1, unitPrice: 5, total: 15 },
            { name: 'Child Seat', quantity: 1, unitPrice: 8, total: 24 }
          ],
          serviceFee: 45.10,
          securityDeposit: 200,
          discount: {
            code: 'WELCOME10',
            percentage: 10,
            amount: 36
          },
          subtotal: 451,
          grandTotal: 690.10
        },
        
        payment: {
          method: 'Credit Card (Stripe)',
          transactionId: 'ch_3OxGV2IyGvGm7q8Z0ABC1234',
          paidAmount: 690.10,
          paidDate: new Date(),
          cardLast4: '4242'
        },
        
        owner: {
          name: 'Sunil Perera',
          businessName: 'Premium Auto Rentals',
          email: 'sunil@premiumauto.lk',
          phone: '+94 77 772 1999'
        }
      };

      setInvoice(mockInvoice);
    } catch (error) {
      console.error('Error loading invoice:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const formatShortDate = (date: Date) => {
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const downloadPDF = async () => {
    setDownloading(true);
    try {
      // Simulate PDF generation
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // In production, this would use a library like jsPDF or call a server endpoint
      // For now, we'll trigger the browser's print dialog as PDF
      window.print();
      
      alert('Invoice downloaded successfully!');
    } catch (error) {
      console.error('Error downloading PDF:', error);
      alert('Failed to download invoice');
    } finally {
      setDownloading(false);
    }
  };

  const printInvoice = () => {
    window.print();
  };

  const emailInvoice = async () => {
    setEmailSending(true);
    try {
      // Simulate sending email
      await new Promise(resolve => setTimeout(resolve, 1500));
      alert(`Invoice sent to ${invoice?.customer.email}`);
    } catch (error) {
      console.error('Error sending email:', error);
      alert('Failed to send invoice');
    } finally {
      setEmailSending(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <FileText className="h-12 w-12 text-emerald-600 animate-pulse mx-auto mb-4" />
          <p className="text-gray-600">Loading invoice...</p>
        </div>
      </div>
    );
  }

  if (!invoice) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900">Invoice Not Found</h2>
          <p className="text-gray-500 mt-2">The requested invoice could not be found.</p>
          <Link to="/vehicle-rental/my-bookings" className="mt-4 inline-flex items-center text-emerald-600 hover:text-emerald-700">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to My Bookings
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Actions Bar - Hidden during print */}
      <div className="print:hidden bg-white shadow-sm sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <Link to="/vehicle-rental/my-bookings" className="inline-flex items-center text-gray-600 hover:text-gray-900">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Bookings
            </Link>
            <div className="flex items-center space-x-3">
              <button
                onClick={emailInvoice}
                disabled={emailSending}
                className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-lg text-sm text-gray-700 hover:bg-gray-50 disabled:opacity-50"
                title="Email invoice to customer"
              >
                <Mail className={`h-4 w-4 mr-2 ${emailSending ? 'animate-pulse' : ''}`} />
                {emailSending ? 'Sending...' : 'Email'}
              </button>
              <button
                onClick={printInvoice}
                className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-lg text-sm text-gray-700 hover:bg-gray-50"
                title="Print invoice"
              >
                <Printer className="h-4 w-4 mr-2" />
                Print
              </button>
              <button
                onClick={downloadPDF}
                disabled={downloading}
                className="inline-flex items-center px-4 py-2 bg-emerald-600 text-white rounded-lg text-sm hover:bg-emerald-700 disabled:opacity-50"
                title="Download invoice as PDF"
              >
                <Download className={`h-4 w-4 mr-2 ${downloading ? 'animate-spin' : ''}`} />
                {downloading ? 'Generating...' : 'Download PDF'}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Invoice Document */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-xl shadow-lg print:shadow-none print:rounded-none overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-emerald-600 to-teal-600 text-white p-8 print:bg-emerald-600">
            <div className="flex justify-between items-start">
              <div>
                <h1 className="text-3xl font-bold">INVOICE</h1>
                <p className="text-emerald-100 mt-1">{invoice.invoiceNumber}</p>
              </div>
              <div className="text-right">
                <div className="flex items-center justify-end mb-2">
                  <Car className="h-8 w-8 mr-2" />
                  <span className="text-2xl font-bold">Recharge Travels</span>
                </div>
                <p className="text-emerald-100 text-sm">Vehicle Rental Division</p>
                <p className="text-emerald-100 text-sm">Sri Lanka</p>
              </div>
            </div>
          </div>

          <div className="p-8">
            {/* Invoice Meta */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8 pb-6 border-b">
              <div>
                <p className="text-sm text-gray-500">Invoice Date</p>
                <p className="font-medium">{formatDate(invoice.invoiceDate)}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Booking ID</p>
                <p className="font-medium">{invoice.booking.id}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Payment Status</p>
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                  invoice.status === 'paid' ? 'bg-green-100 text-green-800' :
                  invoice.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                  'bg-red-100 text-red-800'
                }`}>
                  <CheckCircle className="h-3 w-3 mr-1" />
                  {invoice.status.toUpperCase()}
                </span>
              </div>
              <div>
                <p className="text-sm text-gray-500">Payment Date</p>
                <p className="font-medium">{formatDate(invoice.payment.paidDate)}</p>
              </div>
            </div>

            {/* Bill To / Vehicle Owner */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
              <div className="bg-gray-50 rounded-lg p-6">
                <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4">Bill To</h3>
                <div className="space-y-2">
                  <p className="font-semibold text-lg text-gray-900">{invoice.customer.name}</p>
                  <div className="flex items-center text-gray-600 text-sm">
                    <Mail className="h-4 w-4 mr-2" />
                    {invoice.customer.email}
                  </div>
                  <div className="flex items-center text-gray-600 text-sm">
                    <Phone className="h-4 w-4 mr-2" />
                    {invoice.customer.phone}
                  </div>
                  <div className="flex items-start text-gray-600 text-sm">
                    <MapPin className="h-4 w-4 mr-2 mt-0.5" />
                    <span>{invoice.customer.address}</span>
                  </div>
                  <div className="flex items-center text-gray-600 text-sm">
                    <Globe className="h-4 w-4 mr-2" />
                    {invoice.customer.country}
                  </div>
                </div>
              </div>

              {invoice.owner && (
                <div className="bg-gray-50 rounded-lg p-6">
                  <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4">Vehicle Provider</h3>
                  <div className="space-y-2">
                    <p className="font-semibold text-lg text-gray-900">{invoice.owner.businessName}</p>
                    <p className="text-gray-600 text-sm">{invoice.owner.name}</p>
                    <div className="flex items-center text-gray-600 text-sm">
                      <Mail className="h-4 w-4 mr-2" />
                      {invoice.owner.email}
                    </div>
                    <div className="flex items-center text-gray-600 text-sm">
                      <Phone className="h-4 w-4 mr-2" />
                      {invoice.owner.phone}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Vehicle & Booking Details */}
            <div className="mb-8 bg-emerald-50 rounded-lg p-6 border border-emerald-100">
              <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4">Rental Details</h3>
              <div className="flex flex-col md:flex-row gap-6">
                <img 
                  src={invoice.booking.vehicleImage} 
                  alt={invoice.booking.vehicleName}
                  className="w-32 h-24 rounded-lg object-cover"
                />
                <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-500">Vehicle</p>
                    <p className="font-semibold text-gray-900">{invoice.booking.vehicleName}</p>
                    <p className="text-sm text-gray-600">{invoice.booking.vehicleType} • {invoice.booking.licensePlate}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Rental Period</p>
                    <p className="font-semibold text-gray-900">{invoice.booking.totalDays} Days</p>
                    <p className="text-sm text-gray-600">
                      {formatShortDate(invoice.booking.pickupDate)} - {formatShortDate(invoice.booking.returnDate)}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Pick-up Location</p>
                    <p className="text-sm text-gray-900">{invoice.booking.pickupLocation}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Return Location</p>
                    <p className="text-sm text-gray-900">{invoice.booking.returnLocation}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Pricing Table */}
            <div className="mb-8">
              <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4">Pricing Breakdown</h3>
              <div className="border rounded-lg overflow-hidden">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Description</th>
                      <th className="px-6 py-3 text-center text-xs font-semibold text-gray-500 uppercase">Qty/Days</th>
                      <th className="px-6 py-3 text-right text-xs font-semibold text-gray-500 uppercase">Unit Price</th>
                      <th className="px-6 py-3 text-right text-xs font-semibold text-gray-500 uppercase">Amount</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    {/* Base Rental */}
                    <tr>
                      <td className="px-6 py-4">
                        <div className="flex items-center">
                          <Car className="h-4 w-4 text-gray-400 mr-2" />
                          <span className="font-medium">Vehicle Rental</span>
                        </div>
                        <p className="text-sm text-gray-500 ml-6">{invoice.booking.vehicleName}</p>
                      </td>
                      <td className="px-6 py-4 text-center">{invoice.pricing.rentalDays} days</td>
                      <td className="px-6 py-4 text-right">${invoice.pricing.dailyRate.toFixed(2)}/day</td>
                      <td className="px-6 py-4 text-right font-medium">${invoice.pricing.baseRentalAmount.toFixed(2)}</td>
                    </tr>

                    {/* Insurance */}
                    <tr className="bg-gray-50/50">
                      <td className="px-6 py-4">
                        <div className="flex items-center">
                          <Shield className="h-4 w-4 text-gray-400 mr-2" />
                          <span className="font-medium">Insurance - {invoice.pricing.insurance.type}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-center">{invoice.pricing.rentalDays} days</td>
                      <td className="px-6 py-4 text-right">${invoice.pricing.insurance.dailyRate.toFixed(2)}/day</td>
                      <td className="px-6 py-4 text-right font-medium">${invoice.pricing.insurance.total.toFixed(2)}</td>
                    </tr>

                    {/* Delivery */}
                    {invoice.pricing.delivery && (
                      <tr>
                        <td className="px-6 py-4">
                          <div className="flex items-center">
                            <MapPin className="h-4 w-4 text-gray-400 mr-2" />
                            <span className="font-medium">Delivery Service</span>
                          </div>
                          <p className="text-sm text-gray-500 ml-6">
                            Pick-up (${invoice.pricing.delivery.pickup}) + Return (${invoice.pricing.delivery.return})
                          </p>
                        </td>
                        <td className="px-6 py-4 text-center">-</td>
                        <td className="px-6 py-4 text-right">-</td>
                        <td className="px-6 py-4 text-right font-medium">${invoice.pricing.delivery.total.toFixed(2)}</td>
                      </tr>
                    )}

                    {/* Add-ons */}
                    {invoice.pricing.addOns.map((addon, index) => (
                      <tr key={index} className={index % 2 === 0 ? 'bg-gray-50/50' : ''}>
                        <td className="px-6 py-4">
                          <span className="font-medium">{addon.name}</span>
                        </td>
                        <td className="px-6 py-4 text-center">{addon.quantity} × {invoice.pricing.rentalDays} days</td>
                        <td className="px-6 py-4 text-right">${addon.unitPrice.toFixed(2)}/day</td>
                        <td className="px-6 py-4 text-right font-medium">${addon.total.toFixed(2)}</td>
                      </tr>
                    ))}

                    {/* Service Fee */}
                    <tr>
                      <td className="px-6 py-4">
                        <span className="font-medium">Service Fee</span>
                        <p className="text-sm text-gray-500">10% guest service fee</p>
                      </td>
                      <td className="px-6 py-4 text-center">-</td>
                      <td className="px-6 py-4 text-right">-</td>
                      <td className="px-6 py-4 text-right font-medium">${invoice.pricing.serviceFee.toFixed(2)}</td>
                    </tr>

                    {/* Security Deposit */}
                    <tr className="bg-blue-50/50">
                      <td className="px-6 py-4">
                        <div className="flex items-center">
                          <Shield className="h-4 w-4 text-blue-500 mr-2" />
                          <span className="font-medium text-blue-700">Security Deposit</span>
                        </div>
                        <p className="text-sm text-blue-600 ml-6">Refundable after rental completion</p>
                      </td>
                      <td className="px-6 py-4 text-center">-</td>
                      <td className="px-6 py-4 text-right">-</td>
                      <td className="px-6 py-4 text-right font-medium text-blue-700">${invoice.pricing.securityDeposit.toFixed(2)}</td>
                    </tr>

                    {/* Discount */}
                    {invoice.pricing.discount && (
                      <tr className="bg-green-50">
                        <td className="px-6 py-4">
                          <span className="font-medium text-green-700">Discount ({invoice.pricing.discount.code})</span>
                          <p className="text-sm text-green-600">{invoice.pricing.discount.percentage}% off base rental</p>
                        </td>
                        <td className="px-6 py-4 text-center">-</td>
                        <td className="px-6 py-4 text-right">-</td>
                        <td className="px-6 py-4 text-right font-medium text-green-600">
                          -${invoice.pricing.discount.amount.toFixed(2)}
                        </td>
                      </tr>
                    )}
                  </tbody>
                  <tfoot className="bg-gray-900 text-white">
                    <tr>
                      <td colSpan={3} className="px-6 py-4 text-right font-semibold text-lg">
                        TOTAL (USD)
                      </td>
                      <td className="px-6 py-4 text-right font-bold text-xl">
                        ${invoice.pricing.grandTotal.toFixed(2)}
                      </td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            </div>

            {/* Payment Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
              <div className="bg-gray-50 rounded-lg p-6">
                <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4">Payment Information</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Payment Method</span>
                    <span className="font-medium flex items-center">
                      <CreditCard className="h-4 w-4 mr-2 text-gray-400" />
                      {invoice.payment.method}
                      {invoice.payment.cardLast4 && ` (****${invoice.payment.cardLast4})`}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Transaction ID</span>
                    <span className="font-mono text-sm">{invoice.payment.transactionId.slice(0, 20)}...</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Amount Paid</span>
                    <span className="font-semibold text-emerald-600">${invoice.payment.paidAmount.toFixed(2)}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Payment Date</span>
                    <span className="font-medium">{formatDate(invoice.payment.paidDate)}</span>
                  </div>
                </div>
              </div>

              <div className="bg-emerald-50 rounded-lg p-6 border border-emerald-100">
                <h3 className="text-sm font-semibold text-emerald-700 uppercase tracking-wider mb-4">Amount Summary</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Subtotal</span>
                    <span className="font-medium">${invoice.pricing.subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Security Deposit (Hold)</span>
                    <span className="font-medium">${invoice.pricing.securityDeposit.toFixed(2)}</span>
                  </div>
                  {invoice.pricing.discount && (
                    <div className="flex items-center justify-between text-green-600">
                      <span>Discount</span>
                      <span className="font-medium">-${invoice.pricing.discount.amount.toFixed(2)}</span>
                    </div>
                  )}
                  <div className="border-t pt-3">
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-gray-900">Total Charged</span>
                      <span className="font-bold text-xl text-emerald-600">${invoice.pricing.grandTotal.toFixed(2)}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Terms & Notes */}
            <div className="border-t pt-6">
              <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4">Terms & Conditions</h3>
              <div className="text-sm text-gray-600 space-y-2">
                <p>• All prices are in USD (United States Dollars)</p>
                <p>• Security deposit of ${invoice.pricing.securityDeposit.toFixed(2)} will be refunded within 7 business days after successful rental completion</p>
                <p>• Cancellation within 24 hours of pickup: 50% refund on rental amount</p>
                <p>• Insurance coverage is subject to the terms of the selected insurance package</p>
                <p>• This is a computer-generated invoice and is valid without signature</p>
              </div>
            </div>

            {/* Footer */}
            <div className="mt-8 pt-6 border-t text-center">
              <div className="flex items-center justify-center text-gray-500 text-sm">
                <Receipt className="h-4 w-4 mr-2" />
                Thank you for choosing Recharge Travels Vehicle Rental
              </div>
              <p className="text-sm text-gray-400 mt-2">
                For questions about this invoice, contact support@rechargetravels.com
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Print Styles */}
      <style>{`
        @media print {
          body {
            background: white !important;
          }
          .print\\:hidden {
            display: none !important;
          }
          .print\\:shadow-none {
            box-shadow: none !important;
          }
          .print\\:rounded-none {
            border-radius: 0 !important;
          }
        }
      `}</style>
    </div>
  );
};

export default VehicleInvoice;
