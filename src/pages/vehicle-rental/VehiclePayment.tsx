import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import { 
  CreditCard, 
  Shield, 
  Lock, 
  CheckCircle, 
  AlertTriangle,
  ChevronRight,
  Car,
  Calendar,
  MapPin,
  DollarSign,
  Clock,
  Info,
  Building,
  Smartphone,
  Globe,
  Loader2
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { 
  INSURANCE_PACKAGES, 
  DELIVERY_OPTIONS, 
  ADDITIONAL_SERVICES 
} from '@/types/vehicleRental';

type PaymentMethod = 'card' | 'paypal' | 'bank_transfer';

interface BookingSummary {
  vehicleId: string;
  vehicleName: string;
  vehicleImage: string;
  startDate: Date;
  endDate: Date;
  totalDays: number;
  pickupLocation: string;
  dropoffLocation: string;
  
  // Pricing
  dailyRate: number;
  rentalSubtotal: number;
  insurancePackage: string;
  insuranceTotal: number;
  deliveryType: string;
  deliveryFee: number;
  additionalServices: { name: string; total: number }[];
  serviceFee: number;
  securityDeposit: number;
  total: number;
}

// Mock booking data
const mockBooking: BookingSummary = {
  vehicleId: 'v1',
  vehicleName: 'Toyota Land Cruiser Prado 2023',
  vehicleImage: 'https://images.unsplash.com/photo-1519641471654-76ce0107ad1b?w=800',
  startDate: new Date('2024-02-15'),
  endDate: new Date('2024-02-20'),
  totalDays: 5,
  pickupLocation: 'Bandaranaike International Airport (CMB)',
  dropoffLocation: 'Colombo - Hilton Hotel',
  dailyRate: 85,
  rentalSubtotal: 425,
  insurancePackage: 'Silver Protection',
  insuranceTotal: 70,
  deliveryType: 'Airport Delivery',
  deliveryFee: 45,
  additionalServices: [
    { name: 'GPS Navigation', total: 20 },
    { name: 'WiFi Hotspot', total: 30 }
  ],
  serviceFee: 59,
  securityDeposit: 200,
  total: 849
};

const VehiclePayment: React.FC = () => {
  const { bookingId } = useParams<{ bookingId: string }>();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [booking, setBooking] = useState<BookingSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('card');
  
  // Card details
  const [cardNumber, setCardNumber] = useState('');
  const [cardName, setCardName] = useState('');
  const [expiry, setExpiry] = useState('');
  const [cvv, setCvv] = useState('');
  
  // Billing address
  const [billingName, setBillingName] = useState('');
  const [billingEmail, setBillingEmail] = useState('');
  const [billingPhone, setBillingPhone] = useState('');
  const [billingCountry, setBillingCountry] = useState('United States');
  
  // Terms
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [acceptedCancellation, setAcceptedCancellation] = useState(false);

  useEffect(() => {
    // Load booking data
    setLoading(true);
    setTimeout(() => {
      setBooking(mockBooking);
      setLoading(false);
    }, 500);
  }, [bookingId]);

  const formatCardNumber = (value: string) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    const matches = v.match(/\d{4,16}/g);
    const match = (matches && matches[0]) || '';
    const parts = [];
    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }
    return parts.length ? parts.join(' ') : value;
  };

  const formatExpiry = (value: string) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    if (v.length >= 2) {
      return v.substring(0, 2) + '/' + v.substring(2, 4);
    }
    return v;
  };

  const getCardBrand = (number: string) => {
    const cleaned = number.replace(/\s/g, '');
    if (cleaned.startsWith('4')) return 'Visa';
    if (/^5[1-5]/.test(cleaned)) return 'Mastercard';
    if (/^3[47]/.test(cleaned)) return 'Amex';
    if (cleaned.startsWith('6011')) return 'Discover';
    return null;
  };

  const validateCard = () => {
    const cleanedNumber = cardNumber.replace(/\s/g, '');
    if (cleanedNumber.length < 15 || cleanedNumber.length > 16) {
      return 'Invalid card number';
    }
    if (!cardName.trim()) {
      return 'Card holder name is required';
    }
    if (!expiry.match(/^\d{2}\/\d{2}$/)) {
      return 'Invalid expiry date';
    }
    if (cvv.length < 3) {
      return 'Invalid CVV';
    }
    return null;
  };

  const handlePayment = async () => {
    // Validation
    if (!acceptedTerms) {
      toast({
        title: "Terms Required",
        description: "Please accept the terms and conditions",
        variant: "destructive"
      });
      return;
    }
    
    if (!acceptedCancellation) {
      toast({
        title: "Cancellation Policy Required",
        description: "Please acknowledge the cancellation policy",
        variant: "destructive"
      });
      return;
    }

    if (paymentMethod === 'card') {
      const cardError = validateCard();
      if (cardError) {
        toast({
          title: "Invalid Card Details",
          description: cardError,
          variant: "destructive"
        });
        return;
      }
    }
    
    setProcessing(true);
    
    try {
      // Simulate payment processing
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      // In production, call payment gateway
      // const result = await paymentGateway.initiateStripePayment({...});
      
      toast({
        title: "Payment Successful!",
        description: "Your booking has been confirmed",
      });
      
      // Redirect to confirmation
      navigate(`/vehicle-rental/booking-confirmation/${bookingId || 'demo'}?success=true`);
      
    } catch (error) {
      toast({
        title: "Payment Failed",
        description: "Please check your payment details and try again",
        variant: "destructive"
      });
    } finally {
      setProcessing(false);
    }
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', { 
      weekday: 'short', 
      month: 'short', 
      day: 'numeric' 
    }).format(date);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto mb-4" />
          <p className="text-gray-600">Loading payment details...</p>
        </div>
      </div>
    );
  }

  if (!booking) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <AlertTriangle className="h-16 w-16 text-yellow-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Booking Not Found</h2>
          <p className="text-gray-600 mb-6">Unable to load booking details</p>
          <Button onClick={() => navigate('/vehicle-rental')}>
            Browse Vehicles
          </Button>
        </div>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>Secure Payment | Vehicle Rental - Recharge Travels</title>
      </Helmet>
      
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-6xl mx-auto px-4">
          {/* Header */}
          <div className="mb-8 text-center">
            <div className="flex items-center justify-center gap-2 mb-2">
              <Lock className="h-5 w-5 text-green-600" />
              <span className="text-sm text-green-600 font-medium">Secure Checkout</span>
            </div>
            <h1 className="text-3xl font-bold text-gray-900">Complete Your Booking</h1>
            <p className="text-gray-600 mt-2">Your payment is protected by 256-bit SSL encryption</p>
          </div>
          
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Payment Form */}
            <div className="lg:col-span-2 space-y-6">
              {/* Payment Methods */}
              <div className="bg-white rounded-xl border shadow-sm p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <CreditCard className="h-5 w-5 text-primary" /> Payment Method
                </h2>
                
                <div className="grid grid-cols-3 gap-3 mb-6">
                  <button
                    onClick={() => setPaymentMethod('card')}
                    className={`p-4 border-2 rounded-lg text-center transition-all ${
                      paymentMethod === 'card' 
                        ? 'border-primary bg-primary/5' 
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <CreditCard className={`h-6 w-6 mx-auto mb-2 ${
                      paymentMethod === 'card' ? 'text-primary' : 'text-gray-500'
                    }`} />
                    <span className="text-sm font-medium">Credit/Debit Card</span>
                  </button>
                  
                  <button
                    onClick={() => setPaymentMethod('paypal')}
                    className={`p-4 border-2 rounded-lg text-center transition-all ${
                      paymentMethod === 'paypal' 
                        ? 'border-primary bg-primary/5' 
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <Globe className={`h-6 w-6 mx-auto mb-2 ${
                      paymentMethod === 'paypal' ? 'text-primary' : 'text-gray-500'
                    }`} />
                    <span className="text-sm font-medium">PayPal</span>
                  </button>
                  
                  <button
                    onClick={() => setPaymentMethod('bank_transfer')}
                    className={`p-4 border-2 rounded-lg text-center transition-all ${
                      paymentMethod === 'bank_transfer' 
                        ? 'border-primary bg-primary/5' 
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <Building className={`h-6 w-6 mx-auto mb-2 ${
                      paymentMethod === 'bank_transfer' ? 'text-primary' : 'text-gray-500'
                    }`} />
                    <span className="text-sm font-medium">Bank Transfer</span>
                  </button>
                </div>
                
                {/* Card Form */}
                {paymentMethod === 'card' && (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1.5">
                        Card Number
                      </label>
                      <div className="relative">
                        <Input
                          value={cardNumber}
                          onChange={(e) => setCardNumber(formatCardNumber(e.target.value))}
                          placeholder="1234 5678 9012 3456"
                          maxLength={19}
                          className="pl-10"
                        />
                        <CreditCard className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                        {getCardBrand(cardNumber) && (
                          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-medium text-primary">
                            {getCardBrand(cardNumber)}
                          </span>
                        )}
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1.5">
                        Cardholder Name
                      </label>
                      <Input
                        value={cardName}
                        onChange={(e) => setCardName(e.target.value)}
                        placeholder="John Smith"
                      />
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1.5">
                          Expiry Date
                        </label>
                        <Input
                          value={expiry}
                          onChange={(e) => setExpiry(formatExpiry(e.target.value))}
                          placeholder="MM/YY"
                          maxLength={5}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1.5">
                          CVV
                        </label>
                        <div className="relative">
                          <Input
                            type="password"
                            value={cvv}
                            onChange={(e) => setCvv(e.target.value.replace(/\D/g, '').slice(0, 4))}
                            placeholder="•••"
                            maxLength={4}
                          />
                          <Lock className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                        </div>
                      </div>
                    </div>
                    
                    {/* Card Security */}
                    <div className="flex items-center gap-4 pt-2">
                      <div className="flex items-center gap-1.5 text-xs text-gray-500">
                        <Shield className="h-4 w-4 text-green-600" />
                        <span>SSL Secured</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/5/5e/Visa_Inc._logo.svg/100px-Visa_Inc._logo.svg.png" alt="Visa" className="h-6" />
                        <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/2/2a/Mastercard-logo.svg/100px-Mastercard-logo.svg.png" alt="Mastercard" className="h-6" />
                        <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/f/fa/American_Express_logo_%282018%29.svg/100px-American_Express_logo_%282018%29.svg.png" alt="Amex" className="h-6" />
                      </div>
                    </div>
                  </div>
                )}
                
                {/* PayPal */}
                {paymentMethod === 'paypal' && (
                  <div className="text-center py-6">
                    <div className="h-16 w-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Globe className="h-8 w-8 text-blue-600" />
                    </div>
                    <p className="text-gray-600 mb-4">
                      You will be redirected to PayPal to complete your payment securely.
                    </p>
                    <p className="text-sm text-gray-500">
                      Pay with your PayPal balance, bank account, or card.
                    </p>
                  </div>
                )}
                
                {/* Bank Transfer */}
                {paymentMethod === 'bank_transfer' && (
                  <div className="bg-blue-50 rounded-lg p-4">
                    <h4 className="font-medium text-blue-900 mb-3 flex items-center gap-2">
                      <Info className="h-4 w-4" /> Bank Transfer Details
                    </h4>
                    <div className="space-y-2 text-sm">
                      <p><span className="text-gray-600">Bank:</span> <strong>Standard Chartered Bank</strong></p>
                      <p><span className="text-gray-600">Account Name:</span> <strong>Recharge Travels Ltd</strong></p>
                      <p><span className="text-gray-600">Account Number:</span> <strong>XXXX-XXXX-1234</strong></p>
                      <p><span className="text-gray-600">SWIFT Code:</span> <strong>SCBLUS33</strong></p>
                      <p><span className="text-gray-600">Reference:</span> <strong>VR-{bookingId || 'DEMO'}</strong></p>
                    </div>
                    <p className="mt-3 text-xs text-blue-700">
                      Your booking will be confirmed once payment is verified (1-3 business days).
                    </p>
                  </div>
                )}
              </div>
              
              {/* Billing Details */}
              <div className="bg-white rounded-xl border shadow-sm p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <Building className="h-5 w-5 text-primary" /> Billing Details
                </h2>
                
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                      Full Name
                    </label>
                    <Input
                      value={billingName}
                      onChange={(e) => setBillingName(e.target.value)}
                      placeholder="John Smith"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                      Email Address
                    </label>
                    <Input
                      type="email"
                      value={billingEmail}
                      onChange={(e) => setBillingEmail(e.target.value)}
                      placeholder="john@example.com"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                      Phone Number
                    </label>
                    <Input
                      value={billingPhone}
                      onChange={(e) => setBillingPhone(e.target.value)}
                      placeholder="+1 555 123 4567"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                      Country
                    </label>
                    <select
                      value={billingCountry}
                      onChange={(e) => setBillingCountry(e.target.value)}
                      className="w-full px-3 py-2 border rounded-md text-sm"
                      aria-label="Select country"
                    >
                      <option>United States</option>
                      <option>United Kingdom</option>
                      <option>Canada</option>
                      <option>Australia</option>
                      <option>Germany</option>
                      <option>France</option>
                      <option>Other</option>
                    </select>
                  </div>
                </div>
              </div>
              
              {/* Terms & Conditions */}
              <div className="bg-white rounded-xl border shadow-sm p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">
                  Terms & Conditions
                </h2>
                
                <div className="space-y-4">
                  <label className="flex items-start gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={acceptedTerms}
                      onChange={(e) => setAcceptedTerms(e.target.checked)}
                      className="mt-1 h-4 w-4 text-primary border-gray-300 rounded focus:ring-primary"
                    />
                    <span className="text-sm text-gray-600">
                      I agree to the <a href="/terms" className="text-primary hover:underline">Terms of Service</a> and <a href="/privacy" className="text-primary hover:underline">Privacy Policy</a>. I understand that I must present a valid driving license and passport at vehicle pickup.
                    </span>
                  </label>
                  
                  <label className="flex items-start gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={acceptedCancellation}
                      onChange={(e) => setAcceptedCancellation(e.target.checked)}
                      className="mt-1 h-4 w-4 text-primary border-gray-300 rounded focus:ring-primary"
                    />
                    <span className="text-sm text-gray-600">
                      I acknowledge the <strong>cancellation policy</strong>: Free cancellation up to 48 hours before pickup. Cancellations within 48 hours are subject to a 50% fee. No-shows forfeit the full amount.
                    </span>
                  </label>
                </div>
              </div>
              
              {/* Security Deposit Info */}
              <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4">
                <div className="flex items-start gap-3">
                  <Shield className="h-5 w-5 text-yellow-600 mt-0.5" />
                  <div>
                    <h4 className="font-medium text-yellow-900">Security Deposit: ${booking.securityDeposit}</h4>
                    <p className="text-sm text-yellow-700 mt-1">
                      A refundable security deposit will be held on your card. It will be released within 72 hours after vehicle return, minus any applicable charges for damages or policy violations.
                    </p>
                  </div>
                </div>
              </div>
              
              {/* Pay Button */}
              <Button
                onClick={handlePayment}
                disabled={processing}
                className="w-full h-14 text-lg bg-primary hover:bg-primary/90"
              >
                {processing ? (
                  <>
                    <Loader2 className="h-5 w-5 animate-spin mr-2" />
                    Processing Payment...
                  </>
                ) : (
                  <>
                    <Lock className="h-5 w-5 mr-2" />
                    Pay ${booking.total} USD
                  </>
                )}
              </Button>
              
              <p className="text-xs text-center text-gray-500">
                By completing this payment, you authorize Recharge Travels to charge your payment method for the total amount shown above.
              </p>
            </div>
            
            {/* Order Summary Sidebar */}
            <div className="space-y-6">
              {/* Vehicle Card */}
              <div className="bg-white rounded-xl border shadow-sm overflow-hidden">
                <img 
                  src={booking.vehicleImage} 
                  alt={booking.vehicleName}
                  className="w-full h-40 object-cover"
                />
                <div className="p-4">
                  <h3 className="font-semibold text-gray-900">{booking.vehicleName}</h3>
                  <div className="mt-3 space-y-2 text-sm text-gray-600">
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4" />
                      <span>{formatDate(booking.startDate)} - {formatDate(booking.endDate)}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4" />
                      <span>{booking.totalDays} days</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <MapPin className="h-4 w-4 mt-0.5" />
                      <div>
                        <p>{booking.pickupLocation}</p>
                        <p className="text-xs text-gray-400">to</p>
                        <p>{booking.dropoffLocation}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Price Breakdown */}
              <div className="bg-white rounded-xl border shadow-sm p-4">
                <h3 className="font-semibold text-gray-900 mb-4">Price Breakdown</h3>
                
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Vehicle ({booking.totalDays} days × ${booking.dailyRate})</span>
                    <span className="font-medium">${booking.rentalSubtotal}</span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span className="text-gray-600">{booking.insurancePackage}</span>
                    <span className="font-medium">${booking.insuranceTotal}</span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span className="text-gray-600">{booking.deliveryType}</span>
                    <span className="font-medium">${booking.deliveryFee}</span>
                  </div>
                  
                  {booking.additionalServices.map((service, idx) => (
                    <div key={idx} className="flex justify-between">
                      <span className="text-gray-600">{service.name}</span>
                      <span className="font-medium">${service.total}</span>
                    </div>
                  ))}
                  
                  <div className="flex justify-between">
                    <span className="text-gray-600">Service Fee (10%)</span>
                    <span className="font-medium">${booking.serviceFee}</span>
                  </div>
                  
                  <div className="border-t pt-3 flex justify-between">
                    <span className="text-gray-600">Security Deposit (Refundable)</span>
                    <span className="font-medium">${booking.securityDeposit}</span>
                  </div>
                  
                  <div className="border-t pt-3 flex justify-between text-lg font-bold">
                    <span>Total</span>
                    <span className="text-primary">${booking.total}</span>
                  </div>
                </div>
              </div>
              
              {/* Trust Badges */}
              <div className="bg-gray-50 rounded-xl p-4">
                <div className="flex items-center gap-3 mb-3">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                  <span className="text-sm font-medium text-gray-900">Secure Booking Guarantee</span>
                </div>
                <ul className="space-y-2 text-xs text-gray-600">
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-3 w-3 text-green-500" />
                    Free cancellation up to 48 hours before
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-3 w-3 text-green-500" />
                    24/7 customer support
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-3 w-3 text-green-500" />
                    Verified vehicle owners
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-3 w-3 text-green-500" />
                    Insurance included
                  </li>
                </ul>
              </div>
              
              {/* Need Help */}
              <div className="text-center">
                <p className="text-sm text-gray-600 mb-2">Need help with your booking?</p>
                <a href="tel:+94112345678" className="text-primary font-medium text-sm hover:underline">
                  +94 11 234 5678
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default VehiclePayment;
