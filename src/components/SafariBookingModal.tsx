import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Calendar, Users, Mail, Phone, Loader2, Send, CheckCircle, MessageCircle } from 'lucide-react'
import { Label } from '@/components/ui/label'
import { toast } from 'sonner'
import { collection, addDoc, Timestamp } from 'firebase/firestore'
import { db } from '@/lib/firebase'

interface SafariBookingModalProps {
  isOpen: boolean
  onClose: () => void
  packageData: {
    id: string
    title: string
    price: number
    duration?: string
  }
}

const SafariBookingModal = ({ 
  isOpen, 
  onClose, 
  packageData
}: SafariBookingModalProps) => {
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    guests: 2,
    date: '',
    time: '',
    message: ''
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      // Save booking request to Firebase
      const bookingData = {
        packageId: packageData.id,
        packageName: packageData.title,
        packagePrice: packageData.price,
        packageDuration: packageData.duration,
        customerName: formData.name,
        customerEmail: formData.email,
        customerPhone: formData.phone,
        numberOfGuests: formData.guests,
        preferredDate: formData.date,
        preferredTime: formData.time || 'Not specified',
        message: formData.message || 'No special requests',
        totalPrice: packageData.price * formData.guests,
        status: 'pending',
        createdAt: Timestamp.now(),
        bookingType: 'safari',
        source: 'website'
      }

      await addDoc(collection(db, 'booking_requests'), bookingData)
      setSuccess(true)
      
      // Show success message
      toast.success('Booking request submitted successfully!')
      
      // Reset after delay
      setTimeout(() => {
        setSuccess(false)
        onClose()
        setFormData({
          name: '',
          email: '',
          phone: '',
          guests: 2,
          date: '',
          time: '',
          message: ''
        })
      }, 3000)
      
    } catch (error) {
      console.error('Booking error:', error)
      toast.error('Failed to submit booking. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: name === 'guests' ? parseInt(value) || 1 : value
    }))
  }

  if (success) {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-md">
          <div className="text-center py-8">
            <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
            <h3 className="text-2xl font-semibold mb-2">Booking Request Sent!</h3>
            <p className="text-gray-600 mb-4">
              We'll confirm your {packageData.title} booking within 24 hours.
            </p>
            <div className="bg-orange-50 p-4 rounded-lg">
              <p className="text-sm text-gray-700 mb-2">For immediate assistance:</p>
              <p className="font-semibold text-orange-600">📞 +94 777 721 999</p>
              <p className="font-semibold text-orange-600">✉️ info@rechargetravels.com</p>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    )
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl">Book {packageData.title}</DialogTitle>
          <p className="text-sm text-gray-600 mt-2">
            Fill in your details and we'll confirm your booking within 24 hours
          </p>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6 mt-6">
          {/* Contact Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Contact Information</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name *</Label>
                <Input
                  id="name"
                  name="name"
                  type="text"
                  required
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="John Doe"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email *</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  required
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="john@example.com"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number *</Label>
                <Input
                  id="phone"
                  name="phone"
                  type="tel"
                  required
                  value={formData.phone}
                  onChange={handleInputChange}
                  placeholder="+94 77 772 1999"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="guests">Number of Guests *</Label>
                <Input
                  id="guests"
                  name="guests"
                  type="number"
                  min="1"
                  max="20"
                  required
                  value={formData.guests}
                  onChange={handleInputChange}
                />
              </div>
            </div>
          </div>

          {/* Safari Details */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Safari Details</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="date">Preferred Date *</Label>
                <div className="relative">
                  <Input
                    id="date"
                    name="date"
                    type="date"
                    required
                    value={formData.date}
                    onChange={handleInputChange}
                    min={new Date().toISOString().split('T')[0]}
                    className="pl-10"
                  />
                  <Calendar className="w-4 h-4 absolute left-3 top-3 text-gray-400" />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="time">Preferred Time</Label>
                <Input
                  id="time"
                  name="time"
                  type="time"
                  value={formData.time}
                  onChange={handleInputChange}
                  placeholder="Optional"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="message">Special Requests</Label>
              <Textarea
                id="message"
                name="message"
                value={formData.message}
                onChange={handleInputChange}
                placeholder="Dietary requirements, special occasions, specific wildlife interests..."
                rows={4}
              />
            </div>
          </div>

          {/* Price Display */}
          <div className="bg-gradient-to-r from-orange-50 to-amber-50 p-4 rounded-lg border border-orange-200">
            <div className="flex justify-between items-center">
              <span className="font-semibold text-gray-700">Estimated Total:</span>
              <span className="text-2xl font-bold text-orange-600">
                ${packageData.price * formData.guests}
              </span>
            </div>
            <p className="text-sm text-gray-600 mt-1">
              ${packageData.price} per person × {formData.guests} guests
            </p>
            {packageData.duration && (
              <p className="text-sm text-gray-500 mt-2">
                Duration: {packageData.duration}
              </p>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4 pt-4">
            <Button
              type="submit"
              disabled={loading}
              className="flex-1 bg-orange-600 hover:bg-orange-700"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Submitting...
                </>
              ) : (
                <>
                  <Send className="w-4 h-4 mr-2" />
                  Submit Booking Request
                </>
              )}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={loading}
            >
              Cancel
            </Button>
          </div>

          {/* WhatsApp Option */}
          <div className="text-center pt-2 border-t">
            <a
              href={`https://wa.me/94777721999?text=Hi! I'm interested in booking ${packageData.title} for ${formData.guests} guests on ${formData.date || '[date to be decided]'}.`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-green-600 hover:text-green-700 inline-flex items-center gap-2 mt-2"
            >
              <MessageCircle className="w-4 h-4" />
              Chat on WhatsApp for instant booking
            </a>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}

export default SafariBookingModal