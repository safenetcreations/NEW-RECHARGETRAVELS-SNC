
import { useState, useEffect } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { DirectionsService } from '@react-google-maps/api'
import { useAuth } from '@/hooks/useAuth'
import { dbService } from '@/lib/firebase-services'
import { toast } from 'sonner'
import type { EnhancedWildlifeLocation } from '@/data/enhancedWildlifeData'

import { EnhancedBookingModalProps, EnhancedBookingFormData } from './booking/types'
import ModalHeader from './booking/ModalHeader'
import ContactInfoSection from './booking/ContactInfoSection'
import TripDetailsSection from './booking/TripDetailsSection'
import InterestsSection from './booking/InterestsSection'
import RouteMapSection from './booking/RouteMapSection'
import ModalNavigation from './booking/ModalNavigation'
import { PaymentStep } from './booking/PaymentStep'
import { walletService } from '@/services/walletService'

const EnhancedBookingModal = ({ isOpen, onClose, type, itemTitle, tourData }: EnhancedBookingModalProps) => {
  const { user } = useAuth()
  const [step, setStep] = useState(1)
  const [formData, setFormData] = useState<EnhancedBookingFormData>({
    // Basic info
    name: '',
    email: '',
    phone: '',
    guests: '2',
    
    // Trip details
    startDate: '',
    endDate: '',
    budget: tourData?.price?.toString() || '',
    interests: [],
    
    // Transport details
    pickup: '',
    destination: '',
    
    // Preferences
    accommodation: '',
    dietaryRestrictions: '',
    message: '',
    
    // Payment
    paymentMethod: undefined
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [selectedMapLocation, setSelectedMapLocation] = useState<EnhancedWildlifeLocation | null>(null);

  // Route visualization state for transport bookings
  const [directions, setDirections] = useState<google.maps.DirectionsResult | null>(null);
  const [routeDetails, setRouteDetails] = useState({ distance: '', duration: '' });
  const [routeQuery, setRouteQuery] = useState<{ pickup: string, dropoff: string } | null>(null);

  useEffect(() => {
    if (user) {
      setFormData(prev => ({
        ...prev,
        name: user.displayName || '',
        email: user.email || '',
        budget: tourData?.price?.toString() || prev.budget,
      }))
    }
  }, [user, isOpen, tourData])

  // Calculate route for transport bookings
  useEffect(() => {
    if (type === 'transport' && formData.pickup && formData.destination && formData.pickup !== formData.destination) {
      setRouteQuery({ pickup: formData.pickup, dropoff: formData.destination });
    }
  }, [type, formData.pickup, formData.destination]);

  const directionsCallback = (
    response: google.maps.DirectionsResult | null,
    status: google.maps.DirectionsStatus
  ) => {
    if (status === 'OK' && response) {
      setDirections(response);
      const route = response.routes[0]?.legs[0];
      if (route?.distance?.text && route?.duration?.text) {
        setRouteDetails({ distance: route.distance.text, duration: route.duration.text });
      }
    } else {
      setDirections(null);
      setRouteDetails({ distance: '', duration: '' });
    }
    setRouteQuery(null);
  };

  if (!isOpen) return null

  const totalSteps = type === 'custom' ? 5 : 4

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user) {
      toast.error("You must be logged in to make a booking.")
      return
    }
    setIsSubmitting(true)

    const bookingData = {
      user_id: user.uid,
      user_email: formData.email,
      user_name: formData.name,
      booking_type: type,
      items: { 
        ...formData, 
        routeDetails: type === 'transport' ? routeDetails : undefined,
        tourData: tourData || undefined
      },
      total_price: tourData?.price || 0,
      currency: 'USD',
      status: 'pending' as const,
      travel_date: formData.startDate,
    }

    try {
      const booking = await dbService.create('bookings', bookingData)
      if (!booking) throw new Error('Failed to create booking')
      
      // Process payment if wallet is selected
      if (formData.paymentMethod === 'wallet' && booking) {
        const userWallet = await walletService.getUserWallet(user.uid)
        if (!userWallet) {
          throw new Error('Wallet not found')
        }
        
        // Calculate amount in LKR
        const amountInLKR = (tourData?.price || 0) * 300 // Assuming 1 USD = 300 LKR
        
        // Check balance
        const hasBalance = await walletService.checkBalance(userWallet.id, amountInLKR)
        if (!hasBalance) {
          throw new Error('Insufficient wallet balance')
        }
        
        // Create wallet payment
        const paymentSuccess = await walletService.createBookingPayment(
          userWallet.id,
          booking.id,
          amountInLKR
        )
        
        if (!paymentSuccess) {
          throw new Error('Payment failed')
        }
        
        // Update booking status
        await dbService.update('bookings', booking.id, { 
          status: 'confirmed', 
          payment_method: 'wallet',
          updated_at: new Date().toISOString()
        });
        
        toast.success('Booking confirmed! Payment has been deducted from your wallet.')
      } else {
        // For card payments, just show success message
        toast.success('Your booking request has been sent successfully!')
      }
      
      onClose()
      setStep(1)
    } catch (error) {
      toast.error(`Booking failed: ${error.message}`)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleInterestToggle = (interest: string) => {
    const interests = formData.interests.includes(interest)
      ? formData.interests.filter(i => i !== interest)
      : [...formData.interests, interest]
    setFormData({ ...formData, interests })
  }
  
  const handlePaymentMethodSelect = (method: 'wallet' | 'card') => {
    setFormData({ ...formData, paymentMethod: method })
  }

  const nextStep = () => setStep(Math.min(step + 1, totalSteps))
  const prevStep = () => setStep(Math.max(step - 1, 1))

  // Display title - use tourData name if available, otherwise use itemTitle
  const displayTitle = tourData?.name || itemTitle

  return (
    <>
      {routeQuery?.pickup && routeQuery?.dropoff && (
        <DirectionsService
          options={{
            destination: routeQuery.dropoff,
            origin: routeQuery.pickup,
            travelMode: 'DRIVING' as google.maps.TravelMode,
          }}
          callback={directionsCallback}
        />
      )}
      
      <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-4xl max-h-[90vh] overflow-y-auto border-0 shadow-2xl">
          <ModalHeader 
            onClose={onClose}
            type={type}
            itemTitle={displayTitle}
            step={step}
            totalSteps={totalSteps}
          />
          
          <CardContent className="p-6">
            {/* Show tour summary if tourData is available */}
            {tourData && (
              <div className="mb-6 p-4 bg-gradient-to-r from-orange-50 to-amber-50 rounded-lg border border-orange-200">
                <h3 className="font-semibold text-lg text-orange-800 mb-2">{tourData.name}</h3>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="font-medium text-gray-600">Duration:</span>
                    <span className="ml-2 text-gray-800">{tourData.duration}</span>
                  </div>
                  <div>
                    <span className="font-medium text-gray-600">Price:</span>
                    <span className="ml-2 text-gray-800 font-semibold">${tourData.price}</span>
                  </div>
                </div>
                <p className="text-sm text-gray-700 mt-2">{tourData.description}</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              
              {/* Step 1: Basic Information */}
              {step === 1 && (
                <ContactInfoSection
                  formData={formData}
                  onInputChange={handleInputChange}
                  user={user}
                  type={type}
                />
              )}

              {/* Step 2: Trip Details */}
              {step === 2 && (
                <TripDetailsSection
                  formData={formData}
                  onInputChange={handleInputChange}
                  type={type}
                />
              )}

              {/* Step 3: Interests/Preferences (for tours and custom) */}
              {step === 3 && (type === 'tour' || type === 'custom') && (
                <InterestsSection
                  formData={formData}
                  onInputChange={handleInputChange}
                  onInterestToggle={handleInterestToggle}
                />
              )}

              {/* Step 4: Map & Final Details (custom only) OR Transport Step 3: Route Preview */}
              {((step === 4 && type === 'custom') || (step === 3 && type === 'transport')) && (
                <RouteMapSection
                  formData={formData}
                  onInputChange={handleInputChange}
                  selectedMapLocation={selectedMapLocation}
                  onSelectLocation={setSelectedMapLocation}
                  type={type}
                  directions={directions}
                  routeDetails={routeDetails}
                />
              )}
              
              {/* Payment Step - Last step for all booking types */}
              {((step === 5 && type === 'custom') || (step === 4 && type !== 'custom')) && (
                <PaymentStep
                  totalAmount={tourData?.price || parseFloat(formData.budget) || 0}
                  currency="USD"
                  onPaymentMethodSelect={handlePaymentMethodSelect}
                  selectedPaymentMethod={formData.paymentMethod}
                />
              )}

              <ModalNavigation
                step={step}
                totalSteps={totalSteps}
                onPrevStep={prevStep}
                onNextStep={nextStep}
                isSubmitting={isSubmitting}
              />
            </form>
          </CardContent>
        </Card>
      </div>
    </>
  )
}

export default EnhancedBookingModal
