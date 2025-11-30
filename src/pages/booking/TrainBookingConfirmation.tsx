import { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Train,
  Calendar,
  Users,
  CreditCard,
  Printer,
  MessageCircle,
  Mail,
  CheckCircle2,
  Clock,
  MapPin,
  Phone,
  ArrowLeft,
  Download,
  Share2
} from 'lucide-react';

interface BookingDetails {
  id: string;
  trainName: string;
  trainNumber: string;
  departureStation: string;
  arrivalStation: string;
  departureTime: string;
  arrivalTime: string;
  travelDate: string;
  selectedClass: string;
  passengers: number;
  totalPrice: number;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  specialRequests?: string;
  status: string;
  createdAt: any;
  bookingReference: string;
}

const TrainBookingConfirmation = () => {
  const { bookingId } = useParams<{ bookingId: string }>();
  const navigate = useNavigate();
  const [booking, setBooking] = useState<BookingDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const printRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchBooking = async () => {
      if (!bookingId) {
        setError('No booking ID provided');
        setLoading(false);
        return;
      }

      try {
        const bookingDoc = await getDoc(doc(db, 'trainBookings', bookingId));
        if (bookingDoc.exists()) {
          const data = bookingDoc.data();
          setBooking({
            id: bookingDoc.id,
            ...data,
            bookingReference: data.bookingReference || `TRN-${bookingDoc.id.slice(-8).toUpperCase()}`
          } as BookingDetails);
        } else {
          setError('Booking not found');
        }
      } catch (err) {
        console.error('Error fetching booking:', err);
        setError('Failed to load booking details');
      } finally {
        setLoading(false);
      }
    };

    fetchBooking();
  }, [bookingId]);

  const handlePrint = () => {
    window.print();
  };

  const handleWhatsAppShare = () => {
    if (!booking) return;

    const message = `🚂 *Train Booking Confirmation*

📋 *Booking Reference:* ${booking.bookingReference}

🚉 *Route:* ${booking.departureStation} → ${booking.arrivalStation}
🚂 *Train:* ${booking.trainName} (${booking.trainNumber})
📅 *Date:* ${new Date(booking.travelDate).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
⏰ *Departure:* ${booking.departureTime}
⏱️ *Arrival:* ${booking.arrivalTime}

👤 *Passenger:* ${booking.customerName}
🎫 *Class:* ${booking.selectedClass}
👥 *Passengers:* ${booking.passengers}

💰 *Total Paid:* $${booking.totalPrice.toFixed(2)}

✅ Status: ${booking.status.toUpperCase()}

Thank you for booking with Recharge Travels!
🌐 www.rechargetravels.com`;

    const whatsappUrl = `https://wa.me/${booking.customerPhone.replace(/\D/g, '')}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  const handleEmailShare = () => {
    if (!booking) return;

    const subject = `Train Booking Confirmation - ${booking.bookingReference}`;
    const body = `Train Booking Confirmation

Booking Reference: ${booking.bookingReference}

Route: ${booking.departureStation} → ${booking.arrivalStation}
Train: ${booking.trainName} (${booking.trainNumber})
Date: ${new Date(booking.travelDate).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
Departure: ${booking.departureTime}
Arrival: ${booking.arrivalTime}

Passenger: ${booking.customerName}
Class: ${booking.selectedClass}
Passengers: ${booking.passengers}

Total Paid: $${booking.totalPrice.toFixed(2)}

Status: ${booking.status.toUpperCase()}

Thank you for booking with Recharge Travels!
www.rechargetravels.com`;

    window.location.href = `mailto:${booking.customerEmail}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  };

  const getClassColor = (className: string) => {
    switch (className.toLowerCase()) {
      case '1st class ac':
        return 'bg-amber-100 text-amber-800 border-amber-300';
      case '2nd class observation':
        return 'bg-blue-100 text-blue-800 border-blue-300';
      case '2nd class reserved':
        return 'bg-green-100 text-green-800 border-green-300';
      case '3rd class':
        return 'bg-gray-100 text-gray-800 border-gray-300';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-emerald-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-500 border-t-transparent mx-auto mb-4"></div>
          <p className="text-gray-600">Loading booking details...</p>
        </div>
      </div>
    );
  }

  if (error || !booking) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-emerald-50 flex items-center justify-center p-4">
        <Card className="max-w-md w-full">
          <CardContent className="pt-6 text-center">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Train className="w-8 h-8 text-red-500" />
            </div>
            <h2 className="text-xl font-bold text-gray-900 mb-2">Booking Not Found</h2>
            <p className="text-gray-600 mb-6">{error || 'The booking you are looking for does not exist.'}</p>
            <Link to="/transport/train-booking">
              <Button className="bg-blue-600 hover:bg-blue-700">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Train Booking
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-emerald-50">
      {/* Print Styles */}
      <style>
        {`
          @media print {
            body * {
              visibility: hidden;
            }
            .print-area, .print-area * {
              visibility: visible;
            }
            .print-area {
              position: absolute;
              left: 0;
              top: 0;
              width: 100%;
              padding: 20px;
            }
            .no-print {
              display: none !important;
            }
            .print-only {
              display: block !important;
            }
          }
          .print-only {
            display: none;
          }
        `}
      </style>

      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-emerald-600 text-white py-8 no-print">
        <div className="max-w-4xl mx-auto px-4">
          <Link to="/transport/train-booking" className="inline-flex items-center text-white/80 hover:text-white mb-4">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Train Booking
          </Link>
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center">
              <CheckCircle2 className="w-10 h-10" />
            </div>
            <div>
              <h1 className="text-3xl font-bold">Booking Confirmed!</h1>
              <p className="text-white/80">Your train ticket has been successfully booked</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Action Buttons */}
        <div className="flex flex-wrap gap-3 mb-6 no-print">
          <Button onClick={handlePrint} className="bg-gray-800 hover:bg-gray-900">
            <Printer className="w-4 h-4 mr-2" />
            Print Ticket
          </Button>
          <Button onClick={handleWhatsAppShare} className="bg-green-600 hover:bg-green-700">
            <MessageCircle className="w-4 h-4 mr-2" />
            Share on WhatsApp
          </Button>
          <Button onClick={handleEmailShare} variant="outline" className="border-blue-500 text-blue-600 hover:bg-blue-50">
            <Mail className="w-4 h-4 mr-2" />
            Email Details
          </Button>
        </div>

        {/* Printable Area */}
        <div ref={printRef} className="print-area space-y-6">
          {/* Booking Reference Card */}
          <Card className="border-2 border-blue-200 bg-gradient-to-r from-blue-50 to-white">
            <CardContent className="p-6">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                  <p className="text-sm text-gray-500 uppercase tracking-wide">Booking Reference</p>
                  <p className="text-3xl font-bold text-blue-600 font-mono">{booking.bookingReference}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-500">Status</p>
                  <span className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-semibold ${
                    booking.status === 'confirmed'
                      ? 'bg-green-100 text-green-800'
                      : booking.status === 'pending'
                      ? 'bg-yellow-100 text-yellow-800'
                      : 'bg-gray-100 text-gray-800'
                  }`}>
                    <CheckCircle2 className="w-4 h-4 mr-2" />
                    {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Train Details */}
          <Card>
            <CardHeader className="bg-gradient-to-r from-gray-800 to-gray-900 text-white rounded-t-lg">
              <CardTitle className="flex items-center gap-2">
                <Train className="w-5 h-5" />
                {booking.trainName}
                <span className="text-sm font-normal text-gray-300">({booking.trainNumber})</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                {/* Departure */}
                <div className="text-center md:text-left flex-1">
                  <p className="text-sm text-gray-500 mb-1">Departure</p>
                  <p className="text-3xl font-bold text-gray-900">{booking.departureTime}</p>
                  <div className="flex items-center gap-2 mt-2">
                    <MapPin className="w-4 h-4 text-blue-500" />
                    <p className="font-medium text-gray-800">{booking.departureStation}</p>
                  </div>
                </div>

                {/* Journey Line */}
                <div className="flex-1 flex flex-col items-center">
                  <div className="hidden md:flex items-center w-full">
                    <div className="w-4 h-4 rounded-full bg-blue-500"></div>
                    <div className="flex-1 h-1 bg-gradient-to-r from-blue-500 to-emerald-500"></div>
                    <Train className="w-6 h-6 text-gray-600 mx-2" />
                    <div className="flex-1 h-1 bg-gradient-to-r from-emerald-500 to-green-500"></div>
                    <div className="w-4 h-4 rounded-full bg-green-500"></div>
                  </div>
                  <div className="flex items-center gap-2 mt-2">
                    <Calendar className="w-4 h-4 text-gray-500" />
                    <span className="text-sm text-gray-600">
                      {new Date(booking.travelDate).toLocaleDateString('en-US', {
                        weekday: 'long',
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </span>
                  </div>
                </div>

                {/* Arrival */}
                <div className="text-center md:text-right flex-1">
                  <p className="text-sm text-gray-500 mb-1">Arrival</p>
                  <p className="text-3xl font-bold text-gray-900">{booking.arrivalTime}</p>
                  <div className="flex items-center gap-2 mt-2 justify-center md:justify-end">
                    <MapPin className="w-4 h-4 text-green-500" />
                    <p className="font-medium text-gray-800">{booking.arrivalStation}</p>
                  </div>
                </div>
              </div>

              {/* Class Badge */}
              <div className="mt-6 flex justify-center">
                <span className={`inline-flex items-center px-6 py-2 rounded-full text-sm font-semibold border-2 ${getClassColor(booking.selectedClass)}`}>
                  {booking.selectedClass} • {booking.passengers} {booking.passengers > 1 ? 'Passengers' : 'Passenger'}
                </span>
              </div>
            </CardContent>
          </Card>

          {/* Passenger & Payment Details */}
          <div className="grid md:grid-cols-2 gap-6">
            {/* Passenger Info */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Users className="w-5 h-5 text-blue-500" />
                  Passenger Details
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <p className="text-sm text-gray-500">Full Name</p>
                  <p className="font-medium text-gray-900">{booking.customerName}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Email</p>
                  <p className="font-medium text-gray-900">{booking.customerEmail}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Phone</p>
                  <p className="font-medium text-gray-900 flex items-center gap-2">
                    <Phone className="w-4 h-4 text-gray-400" />
                    {booking.customerPhone}
                  </p>
                </div>
                {booking.specialRequests && (
                  <div>
                    <p className="text-sm text-gray-500">Special Requests</p>
                    <p className="font-medium text-gray-900">{booking.specialRequests}</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Payment Info */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <CreditCard className="w-5 h-5 text-green-500" />
                  Payment Summary
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-gray-600">Class</span>
                  <span className="font-medium">{booking.selectedClass}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Passengers</span>
                  <span className="font-medium">{booking.passengers}</span>
                </div>
                <div className="border-t pt-4">
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-semibold text-gray-900">Total Paid</span>
                    <span className="text-2xl font-bold text-green-600">${booking.totalPrice.toFixed(2)}</span>
                  </div>
                </div>
                <div className="bg-green-50 border border-green-200 rounded-lg p-3 mt-4">
                  <div className="flex items-center gap-2 text-green-700">
                    <CheckCircle2 className="w-5 h-5" />
                    <span className="font-medium">Payment Successful</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Important Information */}
          <Card className="border-amber-200 bg-amber-50">
            <CardContent className="p-6">
              <h3 className="font-bold text-amber-800 mb-3 flex items-center gap-2">
                <Clock className="w-5 h-5" />
                Important Information
              </h3>
              <ul className="space-y-2 text-sm text-amber-900">
                <li>• Please arrive at the station at least 30 minutes before departure</li>
                <li>• Carry a valid photo ID along with this booking confirmation</li>
                <li>• Your booking reference number is: <strong>{booking.bookingReference}</strong></li>
                <li>• Show this confirmation (printed or on mobile) to the station staff</li>
                <li>• For any changes or cancellations, contact us at least 24 hours in advance</li>
              </ul>
            </CardContent>
          </Card>

          {/* Footer */}
          <div className="text-center py-6 border-t">
            <div className="flex items-center justify-center gap-2 mb-2">
              <img src="/logo-v2.png" alt="Recharge Travels" className="h-10" />
            </div>
            <p className="text-sm text-gray-600">
              Thank you for booking with Recharge Travels
            </p>
            <p className="text-sm text-gray-500">
              www.rechargetravels.com | support@rechargetravels.com
            </p>
          </div>
        </div>

        {/* Bottom Actions */}
        <div className="mt-8 text-center no-print">
          <p className="text-gray-600 mb-4">Need help with your booking?</p>
          <div className="flex flex-wrap justify-center gap-3">
            <a href="tel:+94771234567">
              <Button variant="outline">
                <Phone className="w-4 h-4 mr-2" />
                Call Support
              </Button>
            </a>
            <a href="https://wa.me/94771234567" target="_blank" rel="noopener noreferrer">
              <Button variant="outline" className="border-green-500 text-green-600 hover:bg-green-50">
                <MessageCircle className="w-4 h-4 mr-2" />
                WhatsApp Support
              </Button>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TrainBookingConfirmation;
