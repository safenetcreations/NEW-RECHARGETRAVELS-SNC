
import { dbService, authService, storageService } from '@/lib/firebase-services'
import type { DriverBooking, DriverBookingFormData } from '@/types/driver-booking'
import { getOrCreateCustomer } from './customer-service'

export interface EnhancedDriverBooking extends DriverBooking {
  driver: {
    id: string
    name: string
    first_name: string
    last_name: string
    phone: string
    email: string
    rating: number
    languages: string[]
    profile_photo_url?: string
  }
  vehicle: {
    id: string
    make: string
    model: string
    image_urls: string[]
    seats: number
    features: string[]
  }
  customer: {
    id: string
    first_name: string
    last_name: string
    phone_number: string
    email: string
  }
}

export async function createEnhancedDriverBooking(
  driverId: string,
  vehicleId: string,
  formData: DriverBookingFormData
): Promise<EnhancedDriverBooking> {
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
    .select(`
      *,
      drivers:driver_id(
        id, name, first_name, last_name, phone, email, rating, languages, profile_photo_url
      ),
      vehicles:vehicle_id(
        id, make, model, image_urls, seats, features
      ),
      customers:customer_id(
        id, first_name, last_name, phone_number, user_id
      )
    `)
    .single()

  if (error) throw error

  // Get customer email from user profile
  const { data: userProfile } = await supabase
    .from('user_profiles')
    .select('email')
    .eq('id', data.customers.user_id)
    .single()

  return {
    ...data,
    customer: {
      ...data.customers,
      email: userProfile?.email || user.email || ''
    }
  }
}

export async function getDriverBookings(driverId: string): Promise<EnhancedDriverBooking[]> {
  const { data, error } = await supabase
    .from('driver_bookings')
    .select(`
      *,
      drivers:driver_id(
        id, name, first_name, last_name, phone, email, rating, languages, profile_photo_url
      ),
      vehicles:vehicle_id(
        id, make, model, image_urls, seats, features
      ),
      customers:customer_id(
        id, first_name, last_name, phone_number, user_id
      )
    `)
    .eq('driver_id', driverId)
    .order('created_at', { ascending: false })

  if (error) throw error

  // Enhance with customer emails
  const enhancedBookings = await Promise.all(
    (data || []).map(async (booking) => {
      const { data: userProfile } = await supabase
        .from('user_profiles')
        .select('email')
        .eq('id', booking.customers.user_id)
        .single()

      return {
        ...booking,
        customer: {
          ...booking.customers,
          email: userProfile?.email || ''
        }
      }
    })
  )

  return enhancedBookings
}

export async function updateBookingStatusWithNotes(
  bookingId: string, 
  status: DriverBooking['booking_status'],
  driverNotes?: string,
  quotedPrice?: number
): Promise<void> {
  const updateData: any = { 
    booking_status: status,
    updated_at: new Date().toISOString()
  }

  if (driverNotes) updateData.driver_notes = driverNotes
  if (quotedPrice) updateData.quoted_price = quotedPrice

  if (status === 'confirmed') {
    const { data: { user } } = await supabase.auth.getUser()
    updateData.confirmed_by = user?.id
    updateData.confirmed_at = new Date().toISOString()
  }

  const { error } = await supabase
    .from('driver_bookings')
    .update(updateData)
    .eq('id', bookingId)

  if (error) throw error
}

export async function shareWhatsAppContact(bookingId: string): Promise<void> {
  const { error } = await supabase
    .from('driver_bookings')
    .update({ 
      whatsapp_shared: true,
      whatsapp_shared_at: new Date().toISOString()
    })
    .eq('id', bookingId)

  if (error) throw error
}
