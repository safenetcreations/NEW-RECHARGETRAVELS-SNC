
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { X, Calendar, MapPin, Users, Clock } from 'lucide-react'
import { createDriverBooking } from '@/lib/driver-booking-service'
import { useAuth } from '@/hooks/useAuth'
import type { Driver } from '@/types/vehicle'
import type { DriverBookingFormData } from '@/types/driver-booking'
import { toast } from 'sonner'

const bookingSchema = z.object({
  service_type: z.enum(['transport_only', 'guided_tour', 'custom_package']),
  pickup_location: z.string().min(3, 'Pickup location is required'),
  dropoff_location: z.string().optional(),
  pickup_date: z.string().min(1, 'Pickup date is required'),
  pickup_time: z.string().min(1, 'Pickup time is required'),
  return_date: z.string().optional(),
  return_time: z.string().optional(),
  passenger_count: z.number().min(1).max(15),
  duration_days: z.number().min(1).max(30).optional(),
  special_requirements: z.string().optional(),
  estimated_distance_km: z.number().min(0).optional(),
  customer_notes: z.string().optional()
})

interface DriverBookingModalProps {
  driver: Driver
  vehicleId?: string
  isOpen: boolean
  onClose: () => void
}

const DriverBookingModal = ({ driver, vehicleId, isOpen, onClose }: DriverBookingModalProps) => {
  const { user } = useAuth()
  const [loading, setLoading] = useState(false)

  const form = useForm<DriverBookingFormData>({
    resolver: zodResolver(bookingSchema),
    defaultValues: {
      service_type: 'transport_only',
      pickup_location: '',
      dropoff_location: '',
      pickup_date: '',
      pickup_time: '',
      return_date: '',
      return_time: '',
      passenger_count: 1,
      duration_days: 1,
      special_requirements: '',
      estimated_distance_km: 100,
      customer_notes: ''
    }
  })

  const handleSubmit = async (data: DriverBookingFormData) => {
    if (!user) {
      toast.error('Please log in to make a booking')
      return
    }

    if (!vehicleId) {
      toast.error('Vehicle selection required')
      return
    }

    setLoading(true)

    try {
      await createDriverBooking(driver.id, vehicleId, data)
      toast.success('Booking request submitted successfully!')
      onClose()
      form.reset()
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
      <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-xl">
            Book Driver: {driver.name}
          </CardTitle>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </CardHeader>
        
        <CardContent>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
            {/* Service Type */}
            <div>
              <Label htmlFor="service_type">Service Type</Label>
              <Select
                value={form.watch('service_type')}
                onValueChange={(value: any) => form.setValue('service_type', value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="transport_only">Transport Only</SelectItem>
                  <SelectItem value="guided_tour">Guided Tour</SelectItem>
                  <SelectItem value="custom_package">Custom Package</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Locations */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="pickup_location">Pickup Location *</Label>
                <Input
                  {...form.register('pickup_location')}
                  placeholder="Enter pickup address"
                />
                {form.formState.errors.pickup_location && (
                  <p className="text-sm text-red-500 mt-1">
                    {form.formState.errors.pickup_location.message}
                  </p>
                )}
              </div>
              <div>
                <Label htmlFor="dropoff_location">Drop-off Location</Label>
                <Input
                  {...form.register('dropoff_location')}
                  placeholder="Enter drop-off address"
                />
              </div>
            </div>

            {/* Date and Time */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="pickup_date">Pickup Date *</Label>
                <Input
                  type="date"
                  {...form.register('pickup_date')}
                  min={new Date().toISOString().split('T')[0]}
                />
                {form.formState.errors.pickup_date && (
                  <p className="text-sm text-red-500 mt-1">
                    {form.formState.errors.pickup_date.message}
                  </p>
                )}
              </div>
              <div>
                <Label htmlFor="pickup_time">Pickup Time *</Label>
                <Input
                  type="time"
                  {...form.register('pickup_time')}
                />
                {form.formState.errors.pickup_time && (
                  <p className="text-sm text-red-500 mt-1">
                    {form.formState.errors.pickup_time.message}
                  </p>
                )}
              </div>
            </div>

            {/* Return Date/Time (for multi-day bookings) */}
            {form.watch('service_type') !== 'transport_only' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="return_date">Return Date</Label>
                  <Input
                    type="date"
                    {...form.register('return_date')}
                    min={form.watch('pickup_date') || new Date().toISOString().split('T')[0]}
                  />
                </div>
                <div>
                  <Label htmlFor="return_time">Return Time</Label>
                  <Input
                    type="time"
                    {...form.register('return_time')}
                  />
                </div>
              </div>
            )}

            {/* Passengers and Duration */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="passenger_count">Number of Passengers *</Label>
                <Select
                  value={form.watch('passenger_count').toString()}
                  onValueChange={(value) => form.setValue('passenger_count', parseInt(value))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {Array.from({ length: 15 }, (_, i) => (
                      <SelectItem key={i + 1} value={(i + 1).toString()}>
                        {i + 1} passenger{i > 0 ? 's' : ''}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="duration_days">Duration (Days)</Label>
                <Input
                  type="number"
                  min="1"
                  max="30"
                  {...form.register('duration_days', { valueAsNumber: true })}
                />
              </div>
            </div>

            {/* Estimated Distance */}
            <div>
              <Label htmlFor="estimated_distance_km">Estimated Distance (KM)</Label>
              <Input
                type="number"
                min="0"
                {...form.register('estimated_distance_km', { valueAsNumber: true })}
              />
              <p className="text-xs text-gray-500 mt-1">
                Used for calculating distance charges
              </p>
            </div>

            {/* Special Requirements */}
            <div>
              <Label htmlFor="special_requirements">Special Requirements</Label>
              <Textarea
                {...form.register('special_requirements')}
                placeholder="Any special requirements or requests..."
                rows={3}
              />
            </div>

            {/* Customer Notes */}
            <div>
              <Label htmlFor="customer_notes">Additional Notes</Label>
              <Textarea
                {...form.register('customer_notes')}
                placeholder="Any additional information for the driver..."
                rows={2}
              />
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-teal-green hover:bg-teal-700 text-white font-semibold py-3"
              size="lg"
            >
              {loading ? 'Processing...' : 'Submit Booking Request'}
            </Button>

            <p className="text-xs text-gray-500 text-center">
              Your booking request will be reviewed and confirmed within 24 hours
            </p>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}

export default DriverBookingModal
