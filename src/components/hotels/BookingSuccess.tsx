import React from 'react'
import { Helmet } from 'react-helmet-async'
import {
  CheckCircle, Download, Mail, Phone, Calendar, MapPin,
  Users, CreditCard, Star, Home, Printer
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { Hotel } from '@/types/hotel'

interface BookingSuccessProps {
  bookingData: {
    hotel: Hotel
    roomType: any
    bookingDetails: any
    guestInfo: any
    taxes: any
    bookingReference: string
    status: string
  }
  onViewBookings?: () => void
  onBookAnother?: () => void
  onDownloadConfirmation?: () => void
}

const BookingSuccess: React.FC<BookingSuccessProps> = ({
  bookingData,
  onViewBookings,
  onBookAnother,
  onDownloadConfirmation
}) => {
  const { hotel, roomType, bookingDetails, guestInfo, taxes, bookingReference } = bookingData

  const handlePrint = () => {
    window.print()
  }

  const handleEmailConfirmation = () => {
    // In a real app, this would send an email
    alert('Confirmation email sent to ' + guestInfo.email)
  }

  return (
    <>
      <Helmet>
        <title>Booking Confirmed - {bookingReference} | Recharge Travels</title>
        <meta name="description" content={`Your hotel booking for ${hotel.name} has been confirmed. Booking reference: ${bookingReference}`} />
      </Helmet>

      <Header />

      <div className="min-h-screen bg-gray-50">
        {/* Success Header */}
        <div className="bg-green-600 text-white">
          <div className="max-w-4xl mx-auto px-4 py-12 text-center">
            <div className="flex justify-center mb-6">
              <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center">
                <CheckCircle className="h-12 w-12 text-green-600" />
              </div>
            </div>
            <h1 className="text-4xl font-bold mb-4">Booking Confirmed!</h1>
            <p className="text-xl text-green-100">
              Your reservation at {hotel.name} has been successfully confirmed.
            </p>
          </div>
        </div>

        <div className="max-w-4xl mx-auto px-4 py-8">
          {/* Booking Reference */}
          <Card className="mb-8">
            <CardContent className="p-6">
              <div className="text-center">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Booking Reference</h2>
                <div className="text-4xl font-mono font-bold text-blue-600 mb-4">
                  {bookingReference}
                </div>
                <p className="text-gray-600">
                  Please save this reference number for your records. You'll also receive it via email.
                </p>
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Booking Details */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Calendar className="h-5 w-5 mr-2" />
                  Booking Details
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-gray-600">Booking Reference:</span>
                  <span className="font-semibold">{bookingReference}</span>
                </div>

                <div className="flex justify-between">
                  <span className="text-gray-600">Status:</span>
                  <Badge className="bg-green-100 text-green-800">
                    <CheckCircle className="h-3 w-3 mr-1" />
                    Confirmed
                  </Badge>
                </div>

                <div className="flex justify-between">
                  <span className="text-gray-600">Check-in:</span>
                  <span className="font-semibold">
                    {new Date(bookingDetails.checkIn).toLocaleDateString('en-US', {
                      weekday: 'long',
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </span>
                </div>

                <div className="flex justify-between">
                  <span className="text-gray-600">Check-out:</span>
                  <span className="font-semibold">
                    {new Date(bookingDetails.checkOut).toLocaleDateString('en-US', {
                      weekday: 'long',
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </span>
                </div>

                <div className="flex justify-between">
                  <span className="text-gray-600">Nights:</span>
                  <span className="font-semibold">{bookingDetails.nights}</span>
                </div>

                <div className="flex justify-between">
                  <span className="text-gray-600">Guests:</span>
                  <span className="font-semibold">
                    {bookingDetails.guests.adults} adults
                    {bookingDetails.guests.children > 0 && `, ${bookingDetails.guests.children} children`}
                  </span>
                </div>

                <div className="flex justify-between">
                  <span className="text-gray-600">Rooms:</span>
                  <span className="font-semibold">{bookingDetails.guests.rooms}</span>
                </div>
              </CardContent>
            </Card>

            {/* Hotel Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Home className="h-5 w-5 mr-2" />
                  Hotel Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex space-x-4">
                  <img
                    src={hotel.images?.[0]?.image_url || 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=100&h=75&fit=crop'}
                    alt={hotel.name}
                    className="w-20 h-15 object-cover rounded"
                  />
                  <div>
                    <h3 className="font-semibold text-lg">{hotel.name}</h3>
                    <div className="flex items-center text-gray-600 mb-2">
                      <MapPin className="h-4 w-4 mr-1" />
                      <span className="text-sm">{hotel.city?.name || hotel.address || 'Sri Lanka'}</span>
                    </div>
                    {hotel.star_rating && (
                      <div className="flex items-center">
                        {[...Array(hotel.star_rating)].map((_, i) => (
                          <Star key={i} className="h-4 w-4 text-yellow-400 fill-current" />
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold mb-2">{roomType.name}</h4>
                  <div className="text-sm text-gray-600 space-y-1">
                    <div>Room size: {roomType.size}</div>
                    <div>Bed type: {roomType.bedType}</div>
                    <div>Max occupancy: {roomType.maxOccupancy} guests</div>
                  </div>
                </div>

                <div className="border-t pt-4">
                  <h4 className="font-semibold mb-2">Contact Information</h4>
                  <div className="space-y-2 text-sm">
                    <a href="https://wa.me/94777721999" target="_blank" rel="noopener noreferrer" className="flex items-center hover:text-green-600 transition-colors">
                      <svg className="h-4 w-4 text-green-500 mr-2" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
                      <span>+94 77 772 1999</span>
                    </a>
                    <div className="flex items-center">
                      <Mail className="h-4 w-4 text-gray-400 mr-2" />
                      <span>reservations@{hotel.name.toLowerCase().replace(/\s+/g, '')}.com</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Guest Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Users className="h-5 w-5 mr-2" />
                  Guest Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="font-semibold">
                    {guestInfo.firstName} {guestInfo.lastName}
                  </h4>
                </div>

                <div className="flex items-center">
                  <Mail className="h-4 w-4 text-gray-400 mr-2" />
                  <span className="text-sm">{guestInfo.email}</span>
                </div>

                <div className="flex items-center">
                  <Phone className="h-4 w-4 text-gray-400 mr-2" />
                  <span className="text-sm">{guestInfo.phone}</span>
                </div>

                {guestInfo.specialRequests && (
                  <div>
                    <h4 className="font-semibold mb-2">Special Requests</h4>
                    <p className="text-sm text-gray-600">{guestInfo.specialRequests}</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Payment Summary */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <CreditCard className="h-5 w-5 mr-2" />
                  Payment Summary
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Room rate ({bookingDetails.nights} nights):</span>
                    <span>${taxes.subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Taxes & fees:</span>
                    <span>${taxes.tax.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Service fee:</span>
                    <span>${taxes.serviceFee.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between font-semibold text-lg border-t pt-2">
                    <span>Total Paid:</span>
                    <span className="text-green-600">${taxes.total.toFixed(2)}</span>
                  </div>
                </div>

                <div className="bg-green-50 p-3 rounded-lg">
                  <div className="flex items-center text-green-800 text-sm">
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Payment processed successfully
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Important Information */}
          <Card className="mt-8">
            <CardHeader>
              <CardTitle>Important Information</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold mb-3">Check-in Information</h4>
                  <ul className="space-y-2 text-sm text-gray-600">
                    <li>• Check-in time: 2:00 PM</li>
                    <li>• Early check-in may be available upon request</li>
                    <li>• Please present valid ID and booking confirmation</li>
                    <li>• Credit card may be required for incidentals</li>
                  </ul>
                </div>

                <div>
                  <h4 className="font-semibold mb-3">Cancellation Policy</h4>
                  <ul className="space-y-2 text-sm text-gray-600">
                    <li>• Free cancellation until 24 hours before check-in</li>
                    <li>• Late cancellations may incur charges</li>
                    <li>• No-shows will be charged the full amount</li>
                    <li>• Contact hotel directly for modifications</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
            <Button onClick={handlePrint} variant="outline" className="flex items-center">
              <Printer className="h-4 w-4 mr-2" />
              Print Confirmation
            </Button>

            <Button onClick={handleEmailConfirmation} variant="outline" className="flex items-center">
              <Mail className="h-4 w-4 mr-2" />
              Email Confirmation
            </Button>

            <Button onClick={onDownloadConfirmation} variant="outline" className="flex items-center">
              <Download className="h-4 w-4 mr-2" />
              Download PDF
            </Button>

            <Button onClick={onViewBookings} className="flex items-center">
              <Calendar className="h-4 w-4 mr-2" />
              View My Bookings
            </Button>

            <Button onClick={onBookAnother} variant="outline" className="flex items-center">
              <Home className="h-4 w-4 mr-2" />
              Book Another Hotel
            </Button>
          </div>

          {/* Support Information */}
          <div className="mt-8 text-center">
            <p className="text-gray-600 mb-2">
              Need help with your booking? Contact our support team.
            </p>
            <div className="flex justify-center space-x-6 text-sm">
              <a href="https://wa.me/94777721999" target="_blank" rel="noopener noreferrer" className="flex items-center hover:text-green-600 transition-colors">
                <svg className="h-4 w-4 text-green-500 mr-1" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
                <span>+94 77 772 1999</span>
              </a>
              <div className="flex items-center">
                <Mail className="h-4 w-4 text-gray-400 mr-1" />
                <span>support@rechargetravels.com</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </>
  )
}

export default BookingSuccess