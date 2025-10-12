
import { dbService, authService, storageService } from '@/lib/firebase-services'
import type { VehicleCategory, Vehicle, Driver, VehicleBooking, VehicleFilters, BookingFormData } from '@/types/vehicle'

// Fetch all vehicle categories
export async function getVehicleCategories(): Promise<VehicleCategory[]> {
  console.log('Fetching vehicle categories')
  
  const { data, error } = await supabase
    .from('vehicle_categories')
    .select('*')
    .order('name')

  if (error) {
    console.error('Error fetching vehicle categories:', error)
    throw error
  }
  
  return data || []
}

// Transform driver assignment data to Driver objects
function transformDriverData(driverAssignments: any[]): Driver[] {
  return driverAssignments.map(assignment => assignment.driver)
}

// Fetch vehicles with filters
export async function getVehicles(filters?: VehicleFilters): Promise<Vehicle[]> {
  console.log('Fetching vehicles with filters:', filters)
  
  let query = supabase
    .from('vehicles')
    .select(`
      *,
      category:vehicle_categories(*),
      drivers:driver_vehicles(
        driver:drivers(*)
      )
    `)
    .eq('is_active', true)

  if (filters?.category && filters.category.length > 0) {
    query = query.in('category_id', filters.category)
  }

  if (filters?.minSeats) {
    query = query.gte('seats', filters.minSeats)
  }

  if (filters?.maxSeats) {
    query = query.lte('seats', filters.maxSeats)
  }

  if (filters?.minLuggage) {
    query = query.gte('luggage_capacity', filters.minLuggage)
  }

  if (filters?.maxLuggage) {
    query = query.lte('luggage_capacity', filters.maxLuggage)
  }

  if (filters?.maxPrice) {
    query = query.lte('daily_rate', filters.maxPrice)
  }

  const { data, error } = await query.order('daily_rate')

  if (error) {
    console.error('Error fetching vehicles:', error)
    throw error
  }
  
  // Transform the data to match our types
  const transformedData = data?.map(vehicle => ({
    ...vehicle,
    drivers: transformDriverData(vehicle.drivers || [])
  })) || []
  
  return transformedData
}

// Fetch single vehicle with details
export async function getVehicle(id: string): Promise<Vehicle | null> {
  console.log('Fetching vehicle:', id)
  
  const { data, error } = await supabase
    .from('vehicles')
    .select(`
      *,
      category:vehicle_categories(*),
      drivers:driver_vehicles(
        driver:drivers(
          *,
          reviews:driver_reviews(*)
        )
      )
    `)
    .eq('id', id)
    .eq('is_active', true)
    .single()

  if (error) {
    console.error('Error fetching vehicle:', error)
    throw error
  }
  
  // Transform the driver data
  const transformedData = {
    ...data,
    drivers: transformDriverData(data.drivers || [])
  }
  
  return transformedData
}

// Fetch driver details
export async function getDriver(id: string): Promise<Driver | null> {
  console.log('Fetching driver:', id)
  
  const { data, error } = await supabase
    .from('drivers')
    .select(`
      *,
      reviews:driver_reviews(*)
    `)
    .eq('id', id)
    .eq('is_active', true)
    .single()

  if (error) {
    console.error('Error fetching driver:', error)
    throw error
  }
  
  return data
}

// Check vehicle availability
export async function checkVehicleAvailability(
  vehicleId: string, 
  startDate: string, 
  endDate: string
): Promise<boolean> {
  console.log('Checking vehicle availability:', { vehicleId, startDate, endDate })
  
  const { data, error } = await supabase
    .rpc('check_vehicle_availability', {
      vehicle_uuid: vehicleId,
      start_date_param: startDate,
      end_date_param: endDate
    })

  if (error) {
    console.error('Error checking availability:', error)
    throw error
  }
  
  return data === true
}

// Create vehicle booking
export async function createVehicleBooking(
  vehicleId: string,
  driverId: string | null,
  bookingData: BookingFormData
): Promise<VehicleBooking> {
  console.log('Creating vehicle booking:', { vehicleId, driverId, bookingData })

  // Calculate total days and price
  const startDate = new Date(bookingData.startDate)
  const endDate = new Date(bookingData.endDate)
  const totalDays = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)) + 1

  // Get vehicle details for pricing
  const vehicle = await getVehicle(vehicleId)
  if (!vehicle) {
    throw new Error('Vehicle not found')
  }

  const dailyTotal = vehicle.daily_rate * totalDays
  const extraKmTotal = vehicle.extra_km_rate * bookingData.estimatedKm
  const totalPrice = dailyTotal + extraKmTotal

  const { data, error } = await supabase
    .from('vehicle_bookings')
    .insert({
      vehicle_id: vehicleId,
      driver_id: driverId,
      start_date: bookingData.startDate,
      end_date: bookingData.endDate,
      pickup_location: bookingData.pickupLocation,
      dropoff_location: bookingData.dropoffLocation,
      pickup_time: bookingData.pickupTime,
      passenger_count: bookingData.passengerCount,
      estimated_km: bookingData.estimatedKm,
      needs_airport_pickup: bookingData.needsAirportPickup,
      needs_child_seat: bookingData.needsChildSeat,
      special_requests: bookingData.specialRequests,
      user_name: bookingData.userName,
      user_email: bookingData.userEmail,
      user_phone: bookingData.userPhone,
      daily_rate: vehicle.daily_rate,
      extra_km_rate: vehicle.extra_km_rate,
      total_days: totalDays,
      total_price: totalPrice,
      currency: 'USD'
    })
    .select()
    .single()

  if (error) {
    console.error('Error creating booking:', error)
    throw error
  }
  
  // Transform the status and payment_status to match our types
  const transformedData = {
    ...data,
    status: data.status as 'pending' | 'confirmed' | 'in_progress' | 'completed' | 'cancelled',
    payment_status: data.payment_status as 'pending' | 'paid' | 'refunded'
  }
  
  return transformedData
}

// Get vehicles by category
export async function getVehiclesByCategory(categoryName: string): Promise<Vehicle[]> {
  console.log('Fetching vehicles by category:', categoryName)
  
  const { data, error } = await supabase
    .from('vehicles')
    .select(`
      *,
      category:vehicle_categories!inner(*)
    `)
    .eq('category.name', categoryName)
    .eq('is_active', true)
    .order('daily_rate')

  if (error) {
    console.error('Error fetching vehicles by category:', error)
    throw error
  }
  
  return data || []
}

// Add driver review
export async function addDriverReview(
  driverId: string,
  rating: number,
  comment: string,
  guestName?: string,
  guestEmail?: string
): Promise<void> {
  console.log('Adding driver review:', { driverId, rating })
  
  const { error } = await supabase
    .from('driver_reviews')
    .insert({
      driver_id: driverId,
      rating,
      comment,
      guest_name: guestName,
      guest_email: guestEmail
    })

  if (error) {
    console.error('Error adding review:', error)
    throw error
  }
}
