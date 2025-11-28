import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Checkbox } from '@/components/ui/checkbox'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { X, Calendar, MapPin, Users, Clock, DollarSign } from 'lucide-react'
import { createVehicleBooking, checkVehicleAvailability } from '@/lib/vehicle-service'
import { useAuth } from '@/hooks/useAuth'
import type { Vehicle, BookingFormData } from '@/types/vehicle'
import { toast } from 'sonner'
import { useCurrency } from '@/components/booking/CurrencySelector'

interface VehicleBookingModalProps {
  vehicle: Vehicle
  isOpen: boolean
  onClose: () => void
}

const VehicleBookingModal = ({ vehicle, isOpen, onClose }: VehicleBookingModalProps) => {
  const { user } = useAuth()
  const { currency, setCurrency, formatPrice, currencies } = useCurrency()
  const [loading, setLoading] = useState(false)
  const [selectedDriver, setSelectedDriver] = useState<string>('')
  const [formData, setFormData] = useState<BookingFormData>({
    startDate: '',
    endDate: '',
    pickupLocation: '',
    dropoffLocation: '',
    pickupTime: '',
    passengerCount: 1,
    estimatedKm: 100,
    needsAirportPickup: false,
    needsChildSeat: false,
    specialRequests: '',
    userName: user?.displayName || '',
    userEmail: user?.email || '',
    userPhone: ''
  })

  const [pricingBreakdown, setPricingBreakdown] = useState({
    dailyTotal: 0,
    extraKmTotal: 0,
    totalDays: 0,
    grandTotal: 0
  })

  useEffect(() => {
    calculatePricing()
  }, [formData.startDate, formData.endDate, formData.estimatedKm])

  const calculatePricing = () => {
    if (!formData.startDate || !formData.endDate) {
      setPricingBreakdown({ dailyTotal: 0, extraKmTotal: 0, totalDays: 0, grandTotal: 0 })
      return
    }

    const startDate = new Date(formData.startDate)
    const endDate = new Date(formData.endDate)
    const totalDays = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)) + 1

    const dailyTotal = vehicle.daily_rate * totalDays
    const extraKmTotal = vehicle.extra_km_rate * formData.estimatedKm
    const grandTotal = dailyTotal + extraKmTotal

    setPricingBreakdown({
      dailyTotal,
      extraKmTotal,
      totalDays,
      grandTotal
    })
  }

  const handleInputChange = (field: keyof BookingFormData, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.startDate || !formData.endDate) {
      toast.error('Please select booking dates')
      return
    }

    const start = new Date(formData.startDate)
    const end = new Date(formData.endDate)
    if (end < start) {
      toast.error('End date cannot be before start date')
      return
    }

    if (!formData.pickupLocation.trim()) {
      toast.error('Please enter pickup location')
      return
    }

    if (!formData.userName || !formData.userEmail) {
      toast.error('Please provide contact information')
      return
    }

    if (!formData.estimatedKm || formData.estimatedKm < 0) {
      toast.error('Please provide an estimated distance in KM (can be approximate)')
      return
    }

    setLoading(true)

    try {
      // Check availability first
      const isAvailable = await checkVehicleAvailability(
        vehicle.id,
        formData.startDate,
        formData.endDate
      )

      if (!isAvailable) {
        toast.error('Vehicle is not available for selected dates')
        return
      }

      // Create booking
      const booking = await createVehicleBooking(
        vehicle.id,
        selectedDriver || null,
        formData
      )

      toast.success('Booking request submitted successfully!')
      onClose()
      
      // In a real app, you'd redirect to payment or confirmation page
      console.log('Booking created:', booking)
      
    } catch (error) {
      console.error('Booking error:', error)
      toast.error('Failed to create booking. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-xl">
            Book {vehicle.make} {vehicle.model}
          </CardTitle>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </CardHeader>
        
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Left Column - Booking Details */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold flex items-center gap-2">
                  <Calendar className="h-5 w-5" />
                  Booking Details
                </h3>

                {/* Dates */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="startDate">Start Date *</Label>
                    <Input
                      id="startDate"
                      type="date"
                      value={formData.startDate}
                      onChange={(e) => handleInputChange('startDate', e.target.value)}
                      min={new Date().toISOString().split('T')[0]}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="endDate">End Date *</Label>
                    <Input
                      id="endDate"
                      type="date"
                      value={formData.endDate}
                      onChange={(e) => handleInputChange('endDate', e.target.value)}
                      min={formData.startDate || new Date().toISOString().split('T')[0]}
                      required
                    />
                  </div>
                </div>

                {/* Locations */}
                <div>
                  <Label htmlFor="pickupLocation">Pickup Location *</Label>
                  <Input
                    id="pickupLocation"
                    placeholder="Enter pickup address"
                    value={formData.pickupLocation}
                    onChange={(e) => handleInputChange('pickupLocation', e.target.value)}
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="dropoffLocation">Drop-off Location (Optional)</Label>
                  <Input
                    id="dropoffLocation"
                    placeholder="Enter drop-off address"
                    value={formData.dropoffLocation}
                    onChange={(e) => handleInputChange('dropoffLocation', e.target.value)}
                  />
                </div>

                {/* Time and Passengers */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="pickupTime">Pickup Time</Label>
                    <Input
                      id="pickupTime"
                      type="time"
                      value={formData.pickupTime}
                      onChange={(e) => handleInputChange('pickupTime', e.target.value)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="passengerCount">Passengers</Label>
                    <Select
                      value={formData.passengerCount.toString()}
                      onValueChange={(value) => handleInputChange('passengerCount', parseInt(value))}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {Array.from({ length: vehicle.seats }, (_, i) => (
                          <SelectItem key={i + 1} value={(i + 1).toString()}>
                            {i + 1} passenger{i > 0 ? 's' : ''}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Estimated KM */}
                <div>
                  <Label htmlFor="estimatedKm">Estimated Distance (KM)</Label>
                  <Input
                    id="estimatedKm"
                    type="number"
                    min="0"
                    value={formData.estimatedKm}
                    onChange={(e) => {
                      const value = e.target.value
                      const parsed = value === '' ? 0 : parseInt(value, 10)
                      handleInputChange('estimatedKm', Number.isNaN(parsed) ? 0 : parsed)
                    }}
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Used for calculating extra distance charges (an approximate value is fine)
                  </p>
                </div>

                {/* Driver Selection */}
                {vehicle.drivers && vehicle.drivers.length > 0 && (
                  <div>
                    <Label htmlFor="driver">Preferred Driver (Optional)</Label>
                    <Select
                      value={selectedDriver || 'any_driver'}
                      onValueChange={(value) => setSelectedDriver(value === 'any_driver' ? '' : value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Any available driver" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="any_driver">Any available driver</SelectItem>
                        {vehicle.drivers.map((driverAssignment: any) => (
                          <SelectItem key={driverAssignment.driver.id} value={driverAssignment.driver.id}>
                            {driverAssignment.driver.name} (★ {driverAssignment.driver.rating.toFixed(1)})
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                )}

                {/* Options */}
                <div className="space-y-3">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="airportPickup"
                      checked={formData.needsAirportPickup}
                      onCheckedChange={(checked) =>
                        handleInputChange('needsAirportPickup', checked === true)
                      }
                    />
                    <Label htmlFor="airportPickup">Airport pickup required</Label>
                  </div>
                  
                  {vehicle.has_child_seat && (
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="childSeat"
                        checked={formData.needsChildSeat}
                        onCheckedChange={(checked) =>
                          handleInputChange('needsChildSeat', checked === true)
                        }
                      />
                      <Label htmlFor="childSeat">Child seat required</Label>
                    </div>
                  )}
                </div>

                {/* Special Requests */}
                <div>
                  <Label htmlFor="specialRequests">Special Requests</Label>
                  <Textarea
                    id="specialRequests"
                    placeholder="Any special requirements or requests..."
                    value={formData.specialRequests}
                    onChange={(e) => handleInputChange('specialRequests', e.target.value)}
                    rows={3}
                  />
                </div>
              </div>

              {/* Right Column - Contact & Pricing */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  Contact Information
                </h3>

                <div>
                  <Label htmlFor="userName">Full Name *</Label>
                  <Input
                    id="userName"
                    value={formData.userName}
                    onChange={(e) => handleInputChange('userName', e.target.value)}
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="userEmail">Email Address *</Label>
                  <Input
                    id="userEmail"
                    type="email"
                    value={formData.userEmail}
                    onChange={(e) => handleInputChange('userEmail', e.target.value)}
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="userPhone">Phone Number</Label>
                  <Input
                    id="userPhone"
                    type="tel"
                    value={formData.userPhone}
                    onChange={(e) => handleInputChange('userPhone', e.target.value)}
                  />
                </div>

                {/* Pricing Breakdown */}
                <div className="border rounded-lg p-4 bg-gray-50">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="font-semibold flex items-center gap-2">
                      <DollarSign className="h-4 w-4" />
                      Pricing Breakdown
                    </h4>
                    <div className="flex items-center gap-2 text-xs text-gray-500">
                      <span>Currency</span>
                      <Select
                        value={currency.code}
                        onValueChange={(code) => {
                          const next = currencies.find((c) => c.code === code)
                          if (next) setCurrency(next)
                        }}
                      >
                        <SelectTrigger className="h-7 w-[120px] text-xs">
                          <SelectValue placeholder={currency.code} />
                        </SelectTrigger>
                        <SelectContent>
                          {currencies.map((c) => (
                            <SelectItem key={c.code} value={c.code}>
                              {c.symbol} {c.code}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Daily rate × {pricingBreakdown.totalDays} days:</span>
                      <span className="text-right">
                        <span className="font-medium block">
                          {formatPrice(pricingBreakdown.dailyTotal, 'USD')}
                        </span>
                        <span className="block text-[11px] text-gray-500">
                          $ {pricingBreakdown.dailyTotal.toFixed(2)} USD
                        </span>
                      </span>
                    </div>
                    
                    <div className="flex justify-between">
                      <span>Extra distance ({formData.estimatedKm} km):</span>
                      <span className="text-right">
                        <span className="font-medium block">
                          {formatPrice(pricingBreakdown.extraKmTotal, 'USD')}
                        </span>
                        <span className="block text-[11px] text-gray-500">
                          $ {pricingBreakdown.extraKmTotal.toFixed(2)} USD
                        </span>
                      </span>
                    </div>
                    
                    <div className="border-t pt-2 flex justify-between items-end font-semibold text-lg">
                      <span className="text-gray-900">Total estimate:</span>
                      <span className="text-right">
                        <span className="text-wild-orange block">
                          {formatPrice(pricingBreakdown.grandTotal, 'USD')}
                        </span>
                        <span className="block text-xs text-gray-500">
                          Base amount: ${pricingBreakdown.grandTotal.toFixed(2)} USD
                        </span>
                      </span>
                    </div>
                  </div>
                  
                  <p className="text-xs text-gray-500 mt-2">
                    * Estimate includes vehicle and driver. Final price may vary with actual distance, season,
                    entrance fees, and any long-stay discounts we apply when confirming your booking.
                  </p>
                </div>

                {/* Submit Button */}
                <Button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-wild-orange hover:bg-wild-orange/90 text-white font-semibold py-3"
                  size="lg"
                >
                  {loading ? 'Processing...' : 'Submit Booking Request'}
                </Button>

                <p className="text-xs text-gray-500 text-center">
                  Your booking request will be reviewed and confirmed within 24 hours
                </p>
              </div>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}

export default VehicleBookingModal
