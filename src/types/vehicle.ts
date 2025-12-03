
export interface VehicleCategory {
  id: string
  name: string
  description: string | null
  icon: string | null
  created_at: string
  slug?: string
  is_hero?: boolean
  hero_order?: number
  hero_images?: string[]
}

export interface Vehicle {
  id: string
  category_id: string
  make: string
  model: string
  year: number | null
  seats: number
  luggage_capacity: number
  has_child_seat: boolean
  has_ac: boolean
  has_wifi: boolean
  daily_rate: number
  extra_km_rate: number
  image_urls: string[]
  description: string | null
  features: string[]
  is_active: boolean
  created_at: string
  updated_at: string
  category?: VehicleCategory
  drivers?: Driver[]
}

export interface Driver {
  id: string
  name: string
  photo_url: string | null
  phone: string | null
  email: string | null
  languages: string[]
  bio: string | null
  experience_years: number
  rating: number
  total_reviews: number
  license_number: string | null
  is_active: boolean
  created_at: string
  updated_at: string
  reviews?: DriverReview[]
}

export interface DriverReview {
  id: string
  driver_id: string
  booking_id: string | null
  user_id: string | null
  guest_name: string | null
  guest_email: string | null
  rating: number
  comment: string | null
  is_verified: boolean
  created_at: string
}

export interface VehicleBooking {
  id: string
  user_id: string | null
  user_name: string
  user_email: string
  user_phone: string | null
  vehicle_id: string
  driver_id: string | null
  tour_id: string | null
  start_date: string
  end_date: string
  pickup_location: string
  dropoff_location: string | null
  pickup_time: string | null
  estimated_km: number
  needs_airport_pickup: boolean
  needs_child_seat: boolean
  passenger_count: number
  daily_rate: number
  extra_km_rate: number
  total_days: number
  total_price: number
  currency: string
  special_requests: string | null
  status: 'pending' | 'confirmed' | 'in_progress' | 'completed' | 'cancelled'
  payment_status: 'pending' | 'paid' | 'refunded'
  created_at: string
  updated_at: string
  vehicle?: Vehicle
  driver?: Driver
}

export interface VehicleFilters {
  category: string[]
  minSeats: number | null
  maxSeats: number | null
  minLuggage: number | null
  maxLuggage: number | null
  features: string[]
  location: string
  startDate: string | null
  endDate: string | null
  maxPrice: number | null
}

export interface BookingFormData {
  startDate: string
  endDate: string
  pickupLocation: string
  dropoffLocation: string
  pickupTime: string
  passengerCount: number
  estimatedKm: number
  needsAirportPickup: boolean
  needsChildSeat: boolean
  specialRequests: string
  userName: string
  userEmail: string
  userPhone: string
}
