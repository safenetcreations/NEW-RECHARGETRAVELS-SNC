
import { dbService, authService, storageService } from '@/lib/firebase-services'
import type { DriverBooking, DriverBookingFormData, Customer, UserProfile } from '@/types/driver-booking'

export async function createDriverBooking(
  driverId: string,
  vehicleId: string,
  formData: DriverBookingFormData
): Promise<DriverBooking> {
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('User not authenticated')

  // Get or create customer record
  const customer = await getOrCreateCustomer(user.id, user.email || '')

  const bookingData = {
    customer_id: customer.id,
    driver_id: driverId,
    vehicle_id: vehicleId,
    pickup_location: formData.pickup_location,
    dropoff_location: formData.dropoff_location,
    pickup_date: formData.pickup_date,
    pickup_time: formData.pickup_time,
    return_date: formData.return_date,
    return_time: formData.return_time,
    passenger_count: formData.passenger_count,
    service_type: formData.service_type,
    duration_days: formData.duration_days || 1,
    special_requirements: formData.special_requirements,
    estimated_distance_km: formData.estimated_distance_km,
    customer_notes: formData.customer_notes,
    booking_status: 'pending' as const
  }

  const { data, error } = await supabase
    .from('driver_bookings')
    .insert(bookingData)
    .select('*')
    .single()

  if (error) throw error
  return data
}

export async function getOrCreateCustomer(userId: string, email: string): Promise<Customer> {
  // First check if customer exists
  const { data: existingCustomer } = await supabase
    .from('customers')
    .select('*')
    .eq('user_id', userId)
    .single()

  if (existingCustomer) {
    return existingCustomer
  }

  // Create customer if doesn't exist
  const { data: newCustomer, error } = await supabase
    .from('customers')
    .insert({
      user_id: userId,
      first_name: '',
      last_name: '',
      phone_number: '',
      preferred_language: 'en'
    })
    .select('*')
    .single()

  if (error) throw error
  return newCustomer
}

export async function getUserBookings(userId: string): Promise<DriverBooking[]> {
  const { data, error } = await supabase
    .from('driver_bookings')
    .select(`
      *,
      drivers:driver_id(name, phone, email),
      vehicles:vehicle_id(make, model, image_urls)
    `)
    .eq('customer_id', userId)
    .order('created_at', { ascending: false })

  if (error) throw error
  return data || []
}

export async function updateBookingStatus(
  bookingId: string, 
  status: DriverBooking['booking_status']
): Promise<void> {
  const { error } = await supabase
    .from('driver_bookings')
    .update({ 
      booking_status: status,
      updated_at: new Date().toISOString()
    })
    .eq('id', bookingId)

  if (error) throw error
}

export async function checkDriverAvailability(
  driverId: string,
  startDate: string,
  endDate: string
): Promise<boolean> {
  const { data, error } = await supabase
    .from('driver_bookings')
    .select('id')
    .eq('driver_id', driverId)
    .in('booking_status', ['confirmed', 'in_progress'])
    .or(`pickup_date.lte.${endDate},return_date.gte.${startDate}`)

  if (error) throw error
  return (data?.length || 0) === 0
}
