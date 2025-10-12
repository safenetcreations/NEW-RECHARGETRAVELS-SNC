
export interface Tour {
  id: string
  title: string
  description: string
  duration_days: number
  base_price: number
  currency: string
  itinerary: {
    day: number
    title: string
    description: string
    locations: string[]
  }[]
  images: string[]
  active: boolean
  created_at: string
}

export interface Vehicle {
  id: string
  type: string
  capacity: number
  rate_per_km: number
  image_url: string | null
  active: boolean
}

export interface Booking {
  id: string
  user_id: string | null
  user_email: string
  user_name: string
  booking_type: 'transport' | 'tour'
  items: any
  total_price: number
  currency: string
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled'
  travel_date: string
  created_at: string
  updated_at: string
}

export interface TransportBooking {
  pickup_location: string
  dropoff_location: string
  pickup_date: string
  pickup_time: string
  vehicle_id: string
  vehicle_type: string
  distance_km: number
  duration_minutes: number
  base_price: number
  extras?: {
    meet_greet?: boolean
    child_seat?: boolean
    wait_time?: number
  }
}

export interface TourBooking {
  tour_id: string
  tour_title: string
  start_date: string
  guests: number
  vehicle_id?: string
  hotel_grade?: '3star' | '4star' | '5star'
  extras?: {
    guide?: boolean
    meals?: boolean
    insurance?: boolean
  }
}
