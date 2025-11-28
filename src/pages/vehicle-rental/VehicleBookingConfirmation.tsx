import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import { 
  CheckCircle, 
  Car, 
  Calendar, 
  MapPin, 
  Clock, 
  DollarSign, 
  Download, 
  Share2, 
  Phone, 
  Mail, 
  MessageSquare,
  Shield,
  User,
  FileText,
  CreditCard,
  Printer,
  Copy,
  ChevronRight,
  Star,
  AlertTriangle,
  Info,
  QrCode
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { 
  INSURANCE_PACKAGES, 
  DELIVERY_OPTIONS, 
  ADDITIONAL_SERVICES,
  InsurancePackage,
  DeliveryType,
  AdditionalService
} from '@/types/vehicleRental';

interface BookingDetails {
  id: string;
  bookingReference: string;
  status: 'confirmed' | 'pending_payment' | 'pending_verification';
  
  // Vehicle Info
  vehicle: {
    id: string;
    make: string;
    model: string;
    year: number;
    photo: string;
    registrationNumber: string;
    transmission: string;
    fuelType: string;
    seatingCapacity: number;
  };
  
  // Owner Info
  owner: {
    id: string;
    name: string;
    phone: string;
    whatsapp?: string;
    email: string;
    rating: number;
    responseTime: string;
  };
  
  // Customer Info
  customer: {
    name: string;
    email: string;
    phone: string;
  };
  
  // Rental Details
  rental: {
    startDate: Date;
    endDate: Date;
    totalDays: number;
    pickupLocation: string;
    dropoffLocation: string;
    pickupTime: string;
    dropoffTime: string;
  };
  
  // Pricing Breakdown (USD)
  pricing: {
    dailyRate: number;
    rentalSubtotal: number;
    insurance: {
      package: InsurancePackage;
      name: string;
      pricePerDay: number;
      total: number;
    };
    delivery: {
      type: DeliveryType;
      name: string;
      price: number;
    };
    additionalServices: {
      id: AdditionalService;
      name: string;
      price: number;
      quantity: number;
    }[];
    serviceFee: number; // 10% guest service fee
    securityDeposit: number;
    subtotal: number;
    total: number;
  };
  
  // Payment
  payment: {
    method: string;
    status: 'paid' | 'partial' | 'pending';
    amountPaid: number;
    remainingAmount: number;
    transactionId?: string;
    paidAt?: Date;
  };
  
  // Timestamps
  createdAt: Date;
  confirmedAt?: Date;
}

// Mock booking data for demo
const mockBooking: BookingDetails = {
  id: 'bk_12345',
  bookingReference: 'RT-VR-2024-001234',
  status: 'confirmed',
  vehicle: {
    id: 'v1',
    make: 'Toyota',
    model: 'Land Cruiser Prado',
    year: 2023,
    photo: 'https://images.unsplash.com/photo-1519641471654-76ce0107ad1b?w=800',
    registrationNumber: 'CAB-1234',
    transmission: 'Automatic',
    fuelType: 'Diesel',
    seatingCapacity: 7
  },
  owner: {
    id: 'o1',
    name: 'Nuwan Perera',
    phone: '+94 77 123 4567',
    whatsapp: '+94 77 123 4567',
    email: 'nuwan@email.com',
    rating: 4.9,
    responseTime: 'Usually responds within 1 hour'
  },
  customer: {
    name: 'John Smith',
    email: 'john.smith@email.com',
    phone: '+1 555 123 4567'
  },
  rental: {
    startDate: new Date('2024-02-15'),
    endDate: new Date('2024-02-20'),
    totalDays: 5,
    pickupLocation: 'Bandaranaike International Airport (CMB)',
    dropoffLocation: 'Colombo - Hilton Hotel',
    pickupTime: '10:00 AM',
    dropoffTime: '6:00 PM'
  },
  pricing: {
    dailyRate: 85,
    rentalSubtotal: 425, // 5 days × $85
    insurance: {
      package: 'silver',
      name: 'Silver Protection',
      pricePerDay: 14,
      total: 70 // 5 days × $14
    },
    delivery: {
      type: 'airport',
      name: 'Airport Delivery',
      price: 45
    },
    additionalServices: [
      { id: 'gps', name: 'GPS Navigation', price: 4, quantity: 5 }, // $20
      { id: 'wifi_hotspot', name: 'WiFi Hotspot', price: 6, quantity: 5 } // $30
    ],
    serviceFee: 59, // 10% of subtotal
    securityDeposit: 200,
    subtotal: 590,
    total: 849
  },
  payment: {
    method: 'Credit Card (Visa ****4242)',
    status: 'paid',
    amountPaid: 849,
    remainingAmount: 0,
    transactionId: 'txn_1234567890',
    paidAt: new Date()
  },
  createdAt: new Date(),
  confirmedAt: new Date()
};

const VehicleBookingConfirmation: React.FC = () => {
  const { bookingId } = useParams<{ bookingId: string }>();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [booking, setBooking] = useState<BookingDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    // In production, fetch from Firebase
    // For demo, use mock data
    setLoading(true);
    setTimeout(() => {
      setBooking(mockBooking);
      setLoading(false);
    }, 500);
  }, [bookingId]);

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', { 
      weekday: 'short', 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric' 
    }).format(date);
  };

  const copyBookingReference = () => {
    if (booking) {
      navigator.clipboard.writeText(booking.bookingReference);
      setCopied(true);
      toast({
        title: "Copied!",
        description: "Booking reference copied to clipboard",
      });
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleDownloadInvoice = () => {
    toast({
      title: "Downloading Invoice",
      description: "Your invoice PDF is being generated...",
    });
    // In production, generate and download PDF
  };

  const handlePrint = () => {
    window.print();
  };

  const handleShare = async () => {
    if (navigator.share && booking) {
      try {
        await navigator.share({
          title: `Booking Confirmation - ${booking.bookingReference}`,
          text: `Vehicle rental booking confirmed for ${booking.vehicle.make} ${booking.vehicle.model}`,
          url: window.location.href
        });
      } catch (error) {
        // User cancelled or share failed
      }
    } else {
      copyBookingReference();
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin h-12 w-12 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-gray-600">Loading booking details...</p>
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
          <p className="text-gray-600 mb-6">We couldn't find this booking. Please check the booking reference.</p>
          <Button onClick={() => navigate('/vehicle-rental/my-bookings')}>
            View My Bookings
          </Button>
        </div>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>Booking Confirmed | {booking.bookingReference} - Recharge Travels</title>
      </Helmet>
      
      <div className="min-h-screen bg-gray-50 py-8 print:bg-white print:py-0">
        <div className="max-w-4xl mx-auto px-4">
          {/* Success Header */}
          <div className="bg-gradient-to-r from-green-600 to-emerald-600 rounded-t-2xl p-8 text-white text-center print:rounded-none">
            <div className="h-20 w-20 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="h-12 w-12" />
            </div>
            <h1 className="text-3xl font-bold mb-2">Booking Confirmed!</h1>
            <p className="text-green-100 text-lg">Your vehicle rental has been successfully booked</p>
            
            <div className="mt-6 inline-flex items-center gap-3 bg-white/10 backdrop-blur-sm rounded-lg px-4 py-3">
              <span className="text-sm text-green-100">Booking Reference:</span>
              <span className="font-mono font-bold text-xl">{booking.bookingReference}</span>
              <button 
                onClick={copyBookingReference}
                className="p-1.5 hover:bg-white/20 rounded transition-colors"
                title="Copy reference"
              >
                {copied ? <CheckCircle className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
              </button>
            </div>
          </div>
          
          {/* Quick Actions */}
          <div className="bg-white border-x border-b rounded-b-lg shadow-sm p-4 mb-6 print:hidden">
            <div className="flex flex-wrap gap-3 justify-center">
              <Button variant="outline" onClick={handleDownloadInvoice} className="gap-2">
                <Download className="h-4 w-4" /> Download Invoice
              </Button>
              <Button variant="outline" onClick={handlePrint} className="gap-2">
                <Printer className="h-4 w-4" /> Print
              </Button>
              <Button variant="outline" onClick={handleShare} className="gap-2">
                <Share2 className="h-4 w-4" /> Share
              </Button>
            </div>
          </div>
          
          {/* Info Banner */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6 print:hidden">
            <div className="flex items-start gap-3">
              <Info className="h-5 w-5 text-blue-600 mt-0.5" />
              <div>
                <h4 className="font-medium text-blue-900">What's Next?</h4>
                <p className="text-sm text-blue-700 mt-1">
                  A confirmation email has been sent to <strong>{booking.customer.email}</strong>. 
                  The vehicle owner will contact you before your pickup time to confirm the handover.
                </p>
              </div>
            </div>
          </div>
          
          <div className="grid md:grid-cols-3 gap-6">
            {/* Main Content */}
            <div className="md:col-span-2 space-y-6">
              {/* Vehicle Details */}
              <div className="bg-white rounded-xl border shadow-sm overflow-hidden">
                <div className="p-6">
                  <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <Car className="h-5 w-5 text-primary" /> Vehicle Details
                  </h2>
                  <div className="flex gap-4">
                    <img 
                      src={booking.vehicle.photo} 
                      alt={`${booking.vehicle.make} ${booking.vehicle.model}`}
                      className="w-40 h-28 object-cover rounded-lg"
                    />
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-gray-900">
                        {booking.vehicle.make} {booking.vehicle.model}
                      </h3>
                      <p className="text-gray-600">{booking.vehicle.year}</p>
                      <div className="flex flex-wrap gap-2 mt-3">
                        <span className="inline-flex items-center gap-1 px-2 py-1 bg-gray-100 rounded text-xs">
                          {booking.vehicle.transmission}
                        </span>
                        <span className="inline-flex items-center gap-1 px-2 py-1 bg-gray-100 rounded text-xs">
                          {booking.vehicle.fuelType}
                        </span>
                        <span className="inline-flex items-center gap-1 px-2 py-1 bg-gray-100 rounded text-xs">
                          {booking.vehicle.seatingCapacity} Seats
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Rental Schedule */}
              <div className="bg-white rounded-xl border shadow-sm p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <Calendar className="h-5 w-5 text-primary" /> Rental Schedule
                </h2>
                
                <div className="grid sm:grid-cols-2 gap-6">
                  {/* Pickup */}
                  <div className="bg-green-50 rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="h-8 w-8 bg-green-600 rounded-full flex items-center justify-center">
                        <ChevronRight className="h-5 w-5 text-white" />
                      </div>
                      <span className="font-semibold text-green-900">Pickup</span>
                    </div>
                    <p className="font-bold text-gray-900">{formatDate(booking.rental.startDate)}</p>
                    <p className="text-sm text-gray-600">{booking.rental.pickupTime}</p>
                    <div className="flex items-start gap-2 mt-3">
                      <MapPin className="h-4 w-4 text-gray-400 mt-0.5" />
                      <p className="text-sm text-gray-700">{booking.rental.pickupLocation}</p>
                    </div>
                  </div>
                  
                  {/* Dropoff */}
                  <div className="bg-red-50 rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="h-8 w-8 bg-red-600 rounded-full flex items-center justify-center">
                        <ChevronRight className="h-5 w-5 text-white rotate-180" />
                      </div>
                      <span className="font-semibold text-red-900">Dropoff</span>
                    </div>
                    <p className="font-bold text-gray-900">{formatDate(booking.rental.endDate)}</p>
                    <p className="text-sm text-gray-600">{booking.rental.dropoffTime}</p>
                    <div className="flex items-start gap-2 mt-3">
                      <MapPin className="h-4 w-4 text-gray-400 mt-0.5" />
                      <p className="text-sm text-gray-700">{booking.rental.dropoffLocation}</p>
                    </div>
                  </div>
                </div>
                
                <div className="mt-4 p-3 bg-gray-50 rounded-lg text-center">
                  <span className="text-2xl font-bold text-primary">{booking.rental.totalDays}</span>
                  <span className="text-gray-600 ml-2">day rental</span>
                </div>
              </div>
              
              {/* Insurance & Add-ons */}
              <div className="bg-white rounded-xl border shadow-sm p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <Shield className="h-5 w-5 text-primary" /> Insurance & Add-ons
                </h2>
                
                {/* Insurance */}
                <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg mb-3">
                  <div className="flex items-center gap-3">
                    <Shield className="h-5 w-5 text-blue-600" />
                    <div>
                      <p className="font-medium text-gray-900">{booking.pricing.insurance.name}</p>
                      <p className="text-xs text-gray-600">${booking.pricing.insurance.pricePerDay}/day × {booking.rental.totalDays} days</p>
                    </div>
                  </div>
                  <span className="font-bold text-gray-900">${booking.pricing.insurance.total}</span>
                </div>
                
                {/* Delivery */}
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg mb-3">
                  <div className="flex items-center gap-3">
                    <Car className="h-5 w-5 text-gray-600" />
                    <div>
                      <p className="font-medium text-gray-900">{booking.pricing.delivery.name}</p>
                    </div>
                  </div>
                  <span className="font-bold text-gray-900">${booking.pricing.delivery.price}</span>
                </div>
                
                {/* Additional Services */}
                {booking.pricing.additionalServices.length > 0 && (
                  <div className="space-y-2">
                    {booking.pricing.additionalServices.map((service) => (
                      <div key={service.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div>
                          <p className="font-medium text-gray-900">{service.name}</p>
                          <p className="text-xs text-gray-600">${service.price}/day × {service.quantity} days</p>
                        </div>
                        <span className="font-bold text-gray-900">${service.price * service.quantity}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              
              {/* Important Notes */}
              <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-6">
                <h2 className="text-lg font-semibold text-yellow-900 mb-4 flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5" /> Important Information
                </h2>
                <ul className="space-y-2 text-sm text-yellow-800">
                  <li className="flex items-start gap-2">
                    <span className="font-bold">•</span>
                    <span>Please bring a valid driving license and passport at pickup</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="font-bold">•</span>
                    <span>A security deposit of <strong>${booking.pricing.securityDeposit}</strong> will be held and refunded within 72 hours after return</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="font-bold">•</span>
                    <span>Free cancellation up to 48 hours before pickup</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="font-bold">•</span>
                    <span>Fuel policy: Full-to-full (return the vehicle with the same fuel level)</span>
                  </li>
                </ul>
              </div>
            </div>
            
            {/* Sidebar */}
            <div className="space-y-6">
              {/* Price Summary */}
              <div className="bg-white rounded-xl border shadow-sm p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <DollarSign className="h-5 w-5 text-primary" /> Price Summary
                </h2>
                
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Vehicle Rental ({booking.rental.totalDays} days × ${booking.pricing.dailyRate})</span>
                    <span className="font-medium">${booking.pricing.rentalSubtotal}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">{booking.pricing.insurance.name}</span>
                    <span className="font-medium">${booking.pricing.insurance.total}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">{booking.pricing.delivery.name}</span>
                    <span className="font-medium">${booking.pricing.delivery.price}</span>
                  </div>
                  {booking.pricing.additionalServices.map((service) => (
                    <div key={service.id} className="flex justify-between">
                      <span className="text-gray-600">{service.name}</span>
                      <span className="font-medium">${service.price * service.quantity}</span>
                    </div>
                  ))}
                  <div className="flex justify-between">
                    <span className="text-gray-600">Service Fee (10%)</span>
                    <span className="font-medium">${booking.pricing.serviceFee}</span>
                  </div>
                  <div className="border-t pt-3">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Security Deposit (Refundable)</span>
                      <span className="font-medium">${booking.pricing.securityDeposit}</span>
                    </div>
                  </div>
                  <div className="border-t pt-3">
                    <div className="flex justify-between text-lg font-bold">
                      <span>Total Paid</span>
                      <span className="text-green-600">${booking.pricing.total}</span>
                    </div>
                  </div>
                </div>
                
                {/* Payment Status */}
                <div className="mt-4 p-3 bg-green-50 rounded-lg">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <span className="text-sm font-medium text-green-800">Payment Confirmed</span>
                  </div>
                  <p className="text-xs text-green-700 mt-1">{booking.payment.method}</p>
                </div>
              </div>
              
              {/* Owner Contact */}
              <div className="bg-white rounded-xl border shadow-sm p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <User className="h-5 w-5 text-primary" /> Vehicle Owner
                </h2>
                
                <div className="text-center mb-4">
                  <div className="h-16 w-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-2">
                    <User className="h-8 w-8 text-gray-500" />
                  </div>
                  <h3 className="font-semibold text-gray-900">{booking.owner.name}</h3>
                  <div className="flex items-center justify-center gap-1 text-sm text-gray-600">
                    <Star className="h-4 w-4 text-yellow-400 fill-yellow-400" />
                    <span>{booking.owner.rating}</span>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">{booking.owner.responseTime}</p>
                </div>
                
                <div className="space-y-2 print:hidden">
                  <a 
                    href={`tel:${booking.owner.phone}`}
                    className="flex items-center justify-center gap-2 w-full py-2 px-4 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
                  >
                    <Phone className="h-4 w-4" /> Call Owner
                  </a>
                  {booking.owner.whatsapp && (
                    <a 
                      href={`https://wa.me/${booking.owner.whatsapp.replace(/\D/g, '')}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center gap-2 w-full py-2 px-4 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                    >
                      <MessageSquare className="h-4 w-4" /> WhatsApp
                    </a>
                  )}
                  <a 
                    href={`mailto:${booking.owner.email}`}
                    className="flex items-center justify-center gap-2 w-full py-2 px-4 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <Mail className="h-4 w-4" /> Email
                  </a>
                </div>
              </div>
              
              {/* QR Code */}
              <div className="bg-white rounded-xl border shadow-sm p-6 text-center">
                <h3 className="font-semibold text-gray-900 mb-3">Show at Pickup</h3>
                <div className="h-32 w-32 bg-gray-100 rounded-lg flex items-center justify-center mx-auto mb-2">
                  <QrCode className="h-16 w-16 text-gray-400" />
                </div>
                <p className="text-xs text-gray-500">Scan for quick verification</p>
              </div>
              
              {/* Need Help */}
              <div className="bg-gray-50 rounded-xl border p-4 text-center print:hidden">
                <h3 className="font-semibold text-gray-900 mb-2">Need Help?</h3>
                <p className="text-sm text-gray-600 mb-3">Our support team is available 24/7</p>
                <a 
                  href="tel:+94112345678"
                  className="text-primary font-medium text-sm hover:underline"
                >
                  +94 11 234 5678
                </a>
              </div>
            </div>
          </div>
          
          {/* Back to Bookings */}
          <div className="mt-8 text-center print:hidden">
            <Button 
              onClick={() => navigate('/vehicle-rental/my-bookings')}
              variant="outline"
              className="gap-2"
            >
              <FileText className="h-4 w-4" /> View All My Bookings
            </Button>
          </div>
        </div>
      </div>
    </>
  );
};

export default VehicleBookingConfirmation;
