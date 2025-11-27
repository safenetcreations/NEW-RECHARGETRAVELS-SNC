import React, { useState } from 'react'
import { Helmet } from 'react-helmet-async'
import {
  CheckCircle, CreditCard, User, Mail, Phone, Calendar,
  MapPin, Users, Star, Shield, Clock, AlertCircle
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Checkbox } from '@/components/ui/checkbox'
import { Alert, AlertDescription } from '@/components/ui/alert'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { Hotel } from '@/types/hotel'

interface BookingConfirmationProps {
  hotel: Hotel
  roomType: any
  bookingDetails: {
    checkIn: string
    checkOut: string
    guests: { adults: number; children: number; rooms: number }
    totalPrice: number
    nights: number
  }
  onConfirmBooking: (bookingData: any) => void
  onBack: () => void
}

const BookingConfirmation: React.FC<BookingConfirmationProps> = ({
  hotel,
  roomType,
  bookingDetails,
  onConfirmBooking,
  onBack
}) => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    specialRequests: '',
    paymentMethod: 'credit_card',
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    cardholderName: ''
  })

  const [agreements, setAgreements] = useState({
    termsAndConditions: false,
    cancellationPolicy: false,
    privacyPolicy: false
  })

  const [isProcessing, setIsProcessing] = useState(false)

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleAgreementChange = (field: string, checked: boolean) => {
    setAgreements(prev => ({ ...prev, [field]: checked }))
  }

  const calculateTaxes = () => {
    const subtotal = bookingDetails.totalPrice
    const taxRate = 0.12 // 12% tax
    const serviceFee = 15 // Fixed service fee
    return {
      subtotal,
      tax: subtotal * taxRate,
      serviceFee,
      total: subtotal + (subtotal * taxRate) + serviceFee
    }
  }

  const taxes = calculateTaxes()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!agreements.termsAndConditions || !agreements.cancellationPolicy) {
      alert('Please accept the required terms and conditions.')
      return
    }

    setIsProcessing(true)

    // Simulate API call
    setTimeout(() => {
      const bookingData = {
        hotel,
        roomType,
        bookingDetails,
        guestInfo: formData,
        taxes,
        bookingReference: `BK${Date.now()}`,
        status: 'confirmed'
      }

      onConfirmBooking(bookingData)
      setIsProcessing(false)
    }, 2000)
  }

  const isFormValid = () => {
    const requiredFields = ['firstName', 'lastName', 'email', 'phone']
    return requiredFields.every(field => formData[field as keyof typeof formData].trim() !== '') &&
           agreements.termsAndConditions &&
           agreements.cancellationPolicy
  }

  return (
    <>
      <Helmet>
        <title>Complete Your Booking - {hotel.name} | Recharge Travels</title>
        <meta name="description" content={`Complete your hotel booking for ${hotel.name} in Sri Lanka. Secure payment and instant confirmation.`} />
      </Helmet>

      <Header />

      <div className="min-h-screen bg-gray-50">
        <div className="max-w-6xl mx-auto px-4 py-8">
          {/* Progress Indicator */}
          <div className="mb-8">
            <div className="flex items-center justify-center space-x-4">
              <div className="flex items-center">
                <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-semibold">
                  1
                </div>
                <span className="ml-2 text-sm font-medium text-blue-600">Select Room</span>
              </div>
              <div className="w-16 h-px bg-gray-300"></div>
              <div className="flex items-center">
                <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-semibold">
                  2
                </div>
                <span className="ml-2 text-sm font-medium text-blue-600">Guest Details</span>
              </div>
              <div className="w-16 h-px bg-gray-300"></div>
              <div className="flex items-center">
                <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-semibold">
                  3
                </div>
                <span className="ml-2 text-sm font-medium text-blue-600">Payment</span>
              </div>
              <div className="w-16 h-px bg-gray-300"></div>
              <div className="flex items-center">
                <div className="w-8 h-8 bg-gray-300 text-gray-600 rounded-full flex items-center justify-center text-sm font-semibold">
                  4
                </div>
                <span className="ml-2 text-sm font-medium text-gray-600">Confirmation</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Booking Form */}
            <div className="lg:col-span-2">
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Guest Information */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <User className="h-5 w-5 mr-2" />
                      Guest Information
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="firstName">First Name *</Label>
                        <Input
                          id="firstName"
                          value={formData.firstName}
                          onChange={(e) => handleInputChange('firstName', e.target.value)}
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="lastName">Last Name *</Label>
                        <Input
                          id="lastName"
                          value={formData.lastName}
                          onChange={(e) => handleInputChange('lastName', e.target.value)}
                          required
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="email">Email Address *</Label>
                        <Input
                          id="email"
                          type="email"
                          value={formData.email}
                          onChange={(e) => handleInputChange('email', e.target.value)}
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="phone">Phone Number *</Label>
                        <Input
                          id="phone"
                          value={formData.phone}
                          onChange={(e) => handleInputChange('phone', e.target.value)}
                          required
                        />
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="specialRequests">Special Requests (Optional)</Label>
                      <Textarea
                        id="specialRequests"
                        value={formData.specialRequests}
                        onChange={(e) => handleInputChange('specialRequests', e.target.value)}
                        placeholder="Any special requests or requirements..."
                        rows={3}
                      />
                    </div>
                  </CardContent>
                </Card>

                {/* Payment Information */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <CreditCard className="h-5 w-5 mr-2" />
                      Payment Information
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label htmlFor="paymentMethod">Payment Method</Label>
                      <Select
                        value={formData.paymentMethod}
                        onValueChange={(value) => handleInputChange('paymentMethod', value)}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="credit_card">Credit Card</SelectItem>
                          <SelectItem value="debit_card">Debit Card</SelectItem>
                          <SelectItem value="paypal">PayPal</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    {(formData.paymentMethod === 'credit_card' || formData.paymentMethod === 'debit_card') && (
                      <>
                        <div>
                          <Label htmlFor="cardholderName">Cardholder Name</Label>
                          <Input
                            id="cardholderName"
                            value={formData.cardholderName}
                            onChange={(e) => handleInputChange('cardholderName', e.target.value)}
                            placeholder="John Doe"
                          />
                        </div>

                        <div>
                          <Label htmlFor="cardNumber">Card Number</Label>
                          <Input
                            id="cardNumber"
                            value={formData.cardNumber}
                            onChange={(e) => handleInputChange('cardNumber', e.target.value)}
                            placeholder="1234 5678 9012 3456"
                          />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <Label htmlFor="expiryDate">Expiry Date</Label>
                            <Input
                              id="expiryDate"
                              value={formData.expiryDate}
                              onChange={(e) => handleInputChange('expiryDate', e.target.value)}
                              placeholder="MM/YY"
                            />
                          </div>
                          <div>
                            <Label htmlFor="cvv">CVV</Label>
                            <Input
                              id="cvv"
                              value={formData.cvv}
                              onChange={(e) => handleInputChange('cvv', e.target.value)}
                              placeholder="123"
                            />
                          </div>
                        </div>
                      </>
                    )}

                    <Alert>
                      <Shield className="h-4 w-4" />
                      <AlertDescription>
                        Your payment information is encrypted and secure. We use SSL encryption to protect your data.
                      </AlertDescription>
                    </Alert>
                  </CardContent>
                </Card>

                {/* Terms and Conditions */}
                <Card>
                  <CardHeader>
                    <CardTitle>Terms and Conditions</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-start space-x-3">
                      <Checkbox
                        id="termsAndConditions"
                        checked={agreements.termsAndConditions}
                        onCheckedChange={(checked) => handleAgreementChange('termsAndConditions', checked as boolean)}
                      />
                      <div className="text-sm">
                        <Label htmlFor="termsAndConditions" className="font-medium">
                          I agree to the Terms and Conditions *
                        </Label>
                        <p className="text-gray-600 mt-1">
                          By booking, you agree to our terms of service and booking conditions.
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start space-x-3">
                      <Checkbox
                        id="cancellationPolicy"
                        checked={agreements.cancellationPolicy}
                        onCheckedChange={(checked) => handleAgreementChange('cancellationPolicy', checked as boolean)}
                      />
                      <div className="text-sm">
                        <Label htmlFor="cancellationPolicy" className="font-medium">
                          I understand the Cancellation Policy *
                        </Label>
                        <p className="text-gray-600 mt-1">
                          Free cancellation up to 24 hours before check-in. Late cancellations may incur charges.
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start space-x-3">
                      <Checkbox
                        id="privacyPolicy"
                        checked={agreements.privacyPolicy}
                        onCheckedChange={(checked) => handleAgreementChange('privacyPolicy', checked as boolean)}
                      />
                      <div className="text-sm">
                        <Label htmlFor="privacyPolicy" className="font-medium">
                          I agree to the Privacy Policy
                        </Label>
                        <p className="text-gray-600 mt-1">
                          We respect your privacy and will only use your information for booking purposes.
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Action Buttons */}
                <div className="flex space-x-4">
                  <Button type="button" variant="outline" onClick={onBack} className="flex-1">
                    Back to Hotel Details
                  </Button>
                  <Button
                    type="submit"
                    disabled={!isFormValid() || isProcessing}
                    className="flex-1 bg-blue-600 hover:bg-blue-700"
                  >
                    {isProcessing ? 'Processing...' : `Complete Booking - $${taxes.total.toFixed(2)}`}
                  </Button>
                </div>
              </form>
            </div>

            {/* Booking Summary */}
            <div className="lg:col-span-1">
              <Card className="sticky top-8">
                <CardHeader>
                  <CardTitle>Booking Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Hotel Info */}
                  <div className="flex space-x-3">
                    <img
                      src={hotel.images?.[0]?.image_url || 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=100&h=75&fit=crop'}
                      alt={hotel.name}
                      className="w-16 h-12 object-cover rounded"
                    />
                    <div>
                      <h4 className="font-semibold text-sm">{hotel.name}</h4>
                      <div className="flex items-center text-xs text-gray-600">
                        <MapPin className="h-3 w-3 mr-1" />
                        {hotel.city?.name || hotel.address}
                      </div>
                    </div>
                  </div>

                  {/* Room Details */}
                  <div className="border-t pt-4">
                    <h5 className="font-semibold text-sm mb-2">{roomType.name}</h5>
                    <div className="space-y-1 text-sm text-gray-600">
                      <div className="flex justify-between">
                        <span>Room size:</span>
                        <span>{roomType.size}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Bed type:</span>
                        <span>{roomType.bedType}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Max occupancy:</span>
                        <span>{roomType.maxOccupancy} guests</span>
                      </div>
                    </div>
                  </div>

                  {/* Booking Details */}
                  <div className="border-t pt-4">
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span>Check-in:</span>
                        <span>{new Date(bookingDetails.checkIn).toLocaleDateString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Check-out:</span>
                        <span>{new Date(bookingDetails.checkOut).toLocaleDateString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Nights:</span>
                        <span>{bookingDetails.nights}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Guests:</span>
                        <span>{bookingDetails.guests.adults} adults, {bookingDetails.guests.children} children</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Rooms:</span>
                        <span>{bookingDetails.guests.rooms}</span>
                      </div>
                    </div>
                  </div>

                  {/* Price Breakdown */}
                  <div className="border-t pt-4">
                    <h5 className="font-semibold text-sm mb-3">Price Breakdown</h5>
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
                        <span>Total:</span>
                        <span>${taxes.total.toFixed(2)}</span>
                      </div>
                    </div>
                  </div>

                  {/* Cancellation Policy */}
                  <Alert className="mt-4">
                    <Clock className="h-4 w-4" />
                    <AlertDescription className="text-xs">
                      <strong>Free cancellation</strong> until 24 hours before check-in.
                      No charges will apply if cancelled within this timeframe.
                    </AlertDescription>
                  </Alert>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </>
  )
}

export default BookingConfirmation