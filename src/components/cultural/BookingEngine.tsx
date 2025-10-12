
import React, { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Calendar } from '@/components/ui/calendar'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { 
  Calendar as CalendarIcon, 
  Users, 
  Calculator, 
  CreditCard,
  Clock,
  MapPin,
  Star,
  ChevronDown
} from 'lucide-react'
import { format } from 'date-fns'

interface ItineraryOption {
  duration: string
  title: string
  description: string
  dailyRate: { USD: number; EUR: number; GBP: number }
}

interface BookingEngineProps {
  selectedCurrency: string
  calculatePrice: () => number
  itineraryOptions: ItineraryOption[]
  selectedDuration: string
  setSelectedDuration: (duration: string) => void
}

const BookingEngine: React.FC<BookingEngineProps> = ({
  selectedCurrency,
  calculatePrice,
  itineraryOptions,
  selectedDuration,
  setSelectedDuration
}) => {
  const [isOpen, setIsOpen] = useState(false)
  const [selectedDate, setSelectedDate] = useState<Date>()
  const [partySize, setPartySize] = useState(2)
  const [bookingForm, setBookingForm] = useState({
    fullName: '',
    email: '',
    phone: '',
    specialRequests: ''
  })

  const selectedOption = itineraryOptions.find(opt => opt.duration === selectedDuration)
  const totalPrice = selectedOption ? selectedOption.dailyRate[selectedCurrency] * parseInt(selectedDuration) * partySize : 0

  const handleBooking = () => {
    if (!selectedDate || !bookingForm.fullName || !bookingForm.email) {
      alert('Please fill in all required fields')
      return
    }
    
    const bookingData = {
      ...bookingForm,
      selectedDate,
      partySize,
      duration: selectedDuration,
      totalPrice,
      currency: selectedCurrency
    }
    
    console.log('Cultural tour booking:', bookingData)
    alert('Thank you! We will contact you within 24 hours to confirm your cultural circuit booking.')
  }

  return (
    <>
      {/* Floating Booking Button */}
      <div className="fixed bottom-6 right-6 z-50">
        <Button
          onClick={() => setIsOpen(true)}
          size="lg"
          className="bg-amber-500 hover:bg-amber-600 text-white font-semibold px-6 py-4 rounded-full shadow-2xl glow-effect"
        >
          <Calculator className="w-5 h-5 mr-2" />
          Build & Book Circuit
        </Button>
      </div>

      {/* Booking Modal/Sidebar */}
      {isOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between">
                <CardTitle className="text-2xl font-cinzel text-gray-900">
                  Build & Book Your Cultural Circuit
                </CardTitle>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsOpen(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  ✕
                </Button>
              </div>
            </CardHeader>
            
            <CardContent className="space-y-6">
              {/* Circuit Selection */}
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-3">
                  Select Your Circuit Duration
                </label>
                <div className="grid grid-cols-3 gap-3">
                  {itineraryOptions.map((option) => (
                    <Button
                      key={option.duration}
                      variant={selectedDuration === option.duration ? "default" : "outline"}
                      onClick={() => setSelectedDuration(option.duration)}
                      className="p-4 h-auto flex-col"
                    >
                      <div className="text-lg font-bold">{option.duration} Days</div>
                      <div className="text-xs text-gray-600 mt-1">
                        {selectedCurrency === 'USD' ? '$' : selectedCurrency === 'EUR' ? '€' : '£'}
                        {option.dailyRate[selectedCurrency]}/day
                      </div>
                    </Button>
                  ))}
                </div>
                {selectedOption && (
                  <div className="mt-3 p-3 bg-amber-50 rounded-lg">
                    <h4 className="font-semibold text-amber-800">{selectedOption.title}</h4>
                    <p className="text-sm text-amber-700">{selectedOption.description}</p>
                  </div>
                )}
              </div>

              {/* Date Selection */}
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-3">
                  Select Start Date
                </label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className="w-full justify-start text-left font-normal"
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {selectedDate ? format(selectedDate, 'PPP') : 'Choose your start date'}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={selectedDate}
                      onSelect={setSelectedDate}
                      disabled={(date) => date < new Date()}
                      className="p-3 pointer-events-auto"
                    />
                  </PopoverContent>
                </Popover>
              </div>

              {/* Party Size */}
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-3">
                  Number of Travelers
                </label>
                <div className="flex items-center gap-4">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setPartySize(Math.max(1, partySize - 1))}
                    disabled={partySize <= 1}
                  >
                    -
                  </Button>
                  <span className="text-xl font-semibold px-4">{partySize}</span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setPartySize(partySize + 1)}
                  >
                    +
                  </Button>
                  <div className="ml-auto flex items-center gap-2 text-sm text-gray-600">
                    <Users className="w-4 h-4" />
                    <span>{partySize} {partySize === 1 ? 'traveler' : 'travelers'}</span>
                  </div>
                </div>
              </div>

              {/* Price Summary */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-semibold text-gray-900 mb-3">Price Summary</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Base rate ({selectedDuration} days)</span>
                    <span>
                      {selectedCurrency === 'USD' ? '$' : selectedCurrency === 'EUR' ? '€' : '£'}
                      {selectedOption?.dailyRate[selectedCurrency] || 0} × {selectedDuration}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Travelers</span>
                    <span>× {partySize}</span>
                  </div>
                  <div className="border-t pt-2 flex justify-between font-bold text-lg">
                    <span>Total</span>
                    <span className="text-amber-600">
                      {selectedCurrency === 'USD' ? '$' : selectedCurrency === 'EUR' ? '€' : '£'}
                      {totalPrice.toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>

              {/* Contact Form */}
              <div className="space-y-4">
                <h4 className="font-semibold text-gray-900">Contact Information</h4>
                
                <div>
                  <input
                    type="text"
                    placeholder="Full Name *"
                    value={bookingForm.fullName}
                    onChange={(e) => setBookingForm(prev => ({ ...prev, fullName: e.target.value }))}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                  />
                </div>
                
                <div>
                  <input
                    type="email"
                    placeholder="Email Address *"
                    value={bookingForm.email}
                    onChange={(e) => setBookingForm(prev => ({ ...prev, email: e.target.value }))}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                  />
                </div>
                
                <div>
                  <input
                    type="tel"
                    placeholder="Phone Number"
                    value={bookingForm.phone}
                    onChange={(e) => setBookingForm(prev => ({ ...prev, phone: e.target.value }))}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                  />
                </div>
                
                <div>
                  <textarea
                    placeholder="Special cultural interests or requests..."
                    value={bookingForm.specialRequests}
                    onChange={(e) => setBookingForm(prev => ({ ...prev, specialRequests: e.target.value }))}
                    rows={3}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                  />
                </div>
              </div>

              {/* Booking Button */}
              <Button
                onClick={handleBooking}
                className="w-full bg-amber-500 hover:bg-amber-600 text-white font-semibold py-4 text-lg"
              >
                <CreditCard className="w-5 h-5 mr-2" />
                Book Your Cultural Circuit
              </Button>
              
              <div className="text-xs text-gray-500 text-center">
                No payment required now. We'll contact you to confirm details and arrange payment.
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </>
  )
}

export default BookingEngine
