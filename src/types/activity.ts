
export interface ActivityCategory {
  id: string
  name: string
  description?: string
  icon?: string
  created_at: string
}

export interface Location {
  id: string
  name: string
  country: string
  location?: {
    latitude: number
    longitude: number
  }
  description?: string
  created_at: string
}

export interface Activity {
  id: string
  name: string
  description?: string
  category_id?: string
  location_id?: string
  location?: {
    latitude: number
    longitude: number
  }
  price: number
  duration?: number // in minutes
  difficulty?: 'easy' | 'moderate' | 'hard' | 'extreme'
  max_capacity: number
  min_age?: number
  max_age?: number
  requirements?: string
  what_included?: string[]
  what_excluded?: string[]
  cancellation_policy?: string
  average_rating: number
  review_count: number
  is_active: boolean
  created_at: string
  updated_at: string
  category?: ActivityCategory
  location_info?: Location
  media?: ActivityMedia[]
  reviews?: ActivityReview[]
  schedules?: ActivitySchedule[]
}

export interface ActivitySchedule {
  id: string
  activity_id: string
  date: string
  start_time: string
  end_time?: string
  available_slots: number
  price_override?: number
  is_available: boolean
  created_at: string
}

export interface ActivityMedia {
  id: string
  activity_id: string
  file_url: string
  file_type: 'image' | 'video'
  caption?: string
  is_primary: boolean
  sort_order: number
  created_at: string
}

export interface ActivityReview {
  id: string
  activity_id: string
  user_id?: string
  guest_name?: string
  guest_email?: string
  rating: number
  comment?: string
  is_verified: boolean
  created_at: string
}

export interface BookingItem {
  id: string
  booking_id: string
  activity_id?: string
  schedule_id?: string
  quantity: number
  price_per_unit: number
  total_price: number
  created_at: string
  activity?: Activity
  schedule?: ActivitySchedule
}

export interface Package {
  id: string
  name: string
  description?: string
  total_price: number
  discount_amount: number
  is_active: boolean
  created_at: string
  items?: PackageItem[]
}

export interface PackageItem {
  id: string
  package_id: string
  activity_id?: string
  hotel_id?: string
  tour_id?: string
  quantity: number
  created_at: string
}

export interface ActivityFilters {
  categories: string[]
  locations: string[]
  priceRange: [number, number]
  difficulty: string[]
  duration: string[] // e.g., ['half-day', 'full-day']
  rating: number
  date?: string
}

export interface LocationSearchParams {
  latitude: number
  longitude: number
  distance_km?: number
}
