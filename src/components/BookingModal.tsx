
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Calendar, Users, Mail, Phone, MapPin, X } from 'lucide-react'
import { firebaseBookingService } from '@/services/firebaseBookingService'
import { useNavigate } from 'react-router-dom'
import { toast } from 'sonner'

interface BookingModalProps {
  isOpen: boolean
  onClose: () => void
  type: 'tour' | 'transport'
  itemTitle?: string
  itemId?: string
  price?: number
}

const BookingModal = ({ isOpen, onClose, type, itemTitle, itemId, price = 0 }: BookingModalProps) => {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    guests: '2',
    date: '',
    pickup: '',
    destination: '',
    message: ''
  })

  if (!isOpen) return null

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    try {
      const bookingData = {
        booking_type: type === 'tour' ? 'tour_only' as const : 'transport' as const,
        tour_id: type === 'tour' ? itemId : undefined,
        vehicle_id: type === 'transport' ? itemId : undefined,
        tour_start_date: formData.date,
        pickup_date: formData.date,
        pickup_location: formData.pickup,
        destination: formData.destination,
        adults: parseInt(formData.guests) || 2,
        children: 0,
        total_price: price * parseInt(formData.guests),
        currency: 'USD',
        payment_status: 'pending' as const,
        personal_info: {
          firstName: formData.name.split(' ')[0] || '',
          lastName: formData.name.split(' ').slice(1).join(' ') || '',
          email: formData.email,
          phone: formData.phone
        },
        special_requests: formData.message,
        status: 'pending' as const
      }
      
      const bookingId = await firebaseBookingService.createBooking(bookingData)
      
      onClose()
      navigate(`/booking-confirmation?id=${bookingId}`)
    } catch (error) {
      console.error('Error creating booking:', error)
      toast.error('Failed to create booking. Please try again.')
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto border-0 shadow-2xl">
        <CardHeader className="gradient-sri-lanka text-white relative">
          <button 
            onClick={onClose}
            className="absolute top-4 right-4 text-white hover:text-sunset-orange transition-colors"
          >
            <X className="h-6 w-6" />
          </button>
          <CardTitle className="text-2xl font-playfair">
            Book Your {type === 'tour' ? 'Tour' : 'Transport'}
          </CardTitle>
          {itemTitle && (
            <p className="text-blue-100 mt-2">{itemTitle}</p>
          )}
        </CardHeader>
        <CardContent className="p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                  <Users className="h-4 w-4 inline mr-1" />
                  Full Name *
                </label>
                <Input
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                  placeholder="Your full name"
                />
              </div>
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                  <Mail className="h-4 w-4 inline mr-1" />
                  Email Address *
                </label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                  placeholder="your@email.com"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                  <Phone className="h-4 w-4 inline mr-1" />
                  Phone Number *
                </label>
                <Input
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  required
                  placeholder="+1 (555) 123-4567"
                />
              </div>
              <div>
                <label htmlFor="guests" className="block text-sm font-medium text-gray-700 mb-2">
                  <Users className="h-4 w-4 inline mr-1" />
                  Number of {type === 'tour' ? 'Guests' : 'Passengers'} *
                </label>
                <Input
                  id="guests"
                  name="guests"
                  type="number"
                  min="1"
                  max="15"
                  value={formData.guests}
                  onChange={handleInputChange}
                  required
                />
              </div>
            </div>

            <div>
              <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-2">
                <Calendar className="h-4 w-4 inline mr-1" />
                Preferred Date *
              </label>
              <Input
                id="date"
                name="date"
                type="date"
                value={formData.date}
                onChange={handleInputChange}
                required
                min={new Date().toISOString().split('T')[0]}
              />
            </div>

            {type === 'transport' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="pickup" className="block text-sm font-medium text-gray-700 mb-2">
                    <MapPin className="h-4 w-4 inline mr-1" />
                    Pickup Location *
                  </label>
                  <Input
                    id="pickup"
                    name="pickup"
                    value={formData.pickup}
                    onChange={handleInputChange}
                    required
                    placeholder="Hotel, airport, address..."
                  />
                </div>
                <div>
                  <label htmlFor="destination" className="block text-sm font-medium text-gray-700 mb-2">
                    <MapPin className="h-4 w-4 inline mr-1" />
                    Destination *
                  </label>
                  <Input
                    id="destination"
                    name="destination"
                    value={formData.destination}
                    onChange={handleInputChange}
                    required
                    placeholder="Where would you like to go?"
                  />
                </div>
              </div>
            )}

            <div>
              <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                Special Requests or Questions
              </label>
              <Textarea
                id="message"
                name="message"
                value={formData.message}
                onChange={handleInputChange}
                rows={4}
                placeholder="Any special requirements, dietary restrictions, or questions..."
              />
            </div>

            <div className="flex gap-4">
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="flex-1 bg-sunset-orange hover:bg-yellow-500 text-white btn-ripple"
              >
                Submit Booking Request
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}

export default BookingModal
