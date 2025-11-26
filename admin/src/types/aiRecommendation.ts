
import { Hotel, RoomType } from '@/types/hotel'

export interface UserPreferences {
  budget_range: [number, number]
  preferred_star_rating: number[]
  preferred_hotel_types: string[]
  preferred_amenities: string[]
  travel_style: 'luxury' | 'budget' | 'family' | 'business' | 'adventure'
  group_size: number
  trip_duration: number
  location_preferences: string[]
}

export interface AIRecommendation {
  hotel: Hotel
  room: RoomType | null
  score: number
  reasoning: string
  booking_type: 'hotel_only' | 'package'
  total_price: number
  confidence: 'high' | 'medium' | 'low'
}

export interface TourPackageWithTour {
  id: string
  package_name: string
  description?: string
  discount_percentage: number
  package_price?: number
  tour?: {
    title: string
    duration_days: number
    difficulty_level: string
  }
}

export interface TravelStylePreferences {
  luxury: {
    min_star_rating: number
    preferred_amenities: string[]
    hotel_types: string[]
    price_tolerance: number
  }
  budget: {
    max_star_rating: number
    essential_amenities: string[]
    hotel_types: string[]
    price_sensitivity: number
  }
  family: {
    preferred_amenities: string[]
    hotel_types: string[]
    min_star_rating: number
  }
  business: {
    essential_amenities: string[]
    preferred_amenities: string[]
    hotel_types: string[]
  }
  adventure: {
    preferred_amenities: string[]
    hotel_types: string[]
    max_star_rating: number
  }
}
