
export interface Hotel {
  id: string
  name: string
  description?: string
  star_rating?: number
  hotel_type?: 'luxury_resort' | 'cabana' | 'budget' | 'middle_range' | 'boutique' | 'villa' | 'apartment' | 'business' | 'guesthouse' | 'eco_lodge' | 'vacation_home'
  style_id?: string
  category_id?: string
  price_range_min?: number
  price_range_max?: number
  base_price_per_night?: number
  currency?: string
  city_id?: string
  country?: string
  latitude?: number
  longitude?: number
  location?: {
    latitude: number
    longitude: number
  }
  amenities?: string[]
  address?: string
  phone?: string
  email?: string
  website?: string
  check_in_time?: string
  check_out_time?: string
  total_rooms?: number
  available_rooms?: number
  policies?: any
  is_active: boolean
  ai_recommendation_score?: number
  created_at: string
  updated_at: string
  city?: City
  images?: HotelImage[]
  reviews?: HotelReview[]
  average_rating?: number
  review_count?: number
  hotel_style?: HotelStyle
  hotel_category?: HotelCategory
  rooms?: HotelRoom[]
  vendorId?: string
  hostProfile?: {
    name: string
    avatar?: string
    responseRate?: number
    joinedDate?: string
    isVerified?: boolean
  }
  room_types?: RoomType[]
}

export interface City {
  id: string
  name: string
  country: string
  latitude?: number
  longitude?: number
}

export interface HotelStyle {
  id: string
  name: string
  description?: string
  created_at: string
}

export interface HotelCategory {
  id: string
  name: string
  description?: string
  created_at: string
}

export interface HotelImage {
  id: string
  hotel_id: string
  image_url: string
  caption?: string
  is_primary: boolean
  sort_order: number
}

export interface HotelReview {
  id: string
  hotel_id: string
  user_id?: string
  guest_name?: string
  guest_email?: string
  rating: number
  title?: string
  review_text?: string
  pros?: string
  cons?: string
  room_type?: string
  stay_date?: string
  verified_booking?: boolean
  helpful_votes?: number
  created_at: string
  is_verified: boolean
}

export interface HotelRoom {
  id: string
  hotel_id: string
  room_type: string
  room_number?: string
  max_occupancy: number
  base_price?: number
  is_available: boolean
  created_at: string
}

export interface RoomType {
  id: string
  hotel_id: string
  name: string
  description?: string
  max_occupancy: number
  bed_type?: string
  room_size?: number
  price_per_night: number
  amenities?: string[]
  images?: string[]
  available_count: number
  is_active: boolean
}

export interface HotelAmenity {
  id: string
  name: string
  category: string
  icon?: string
  description?: string
}

export interface FilterOptions {
  starRating: number[]
  hotelType: string[]
  priceRange: [number, number]
  cityId: string
  amenities: string[]
  searchQuery: string
  categoryId?: string
}

export interface HotelBookingData {
  hotel_id: string
  room_type_id?: string
  check_in_date: string
  check_out_date: string
  adults: number
  children: number
  total_nights: number
  special_requests?: string
}

export interface LocationSearchParams {
  latitude: number
  longitude: number
  distance_km?: number
}

export interface HotelTourPackage {
  id: string
  hotel_id: string
  tour_id: string
  package_name: string
  description?: string
  discount_percentage: number
  package_price?: number
  is_active: boolean
  created_at: string
  hotel?: Hotel
  tour?: any
}
