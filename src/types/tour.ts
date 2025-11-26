
export interface Tour {
  id: string
  title: string  // Changed from 'name' to 'title' to match database
  description: string
  destination: string
  tour_type: 'adventure' | 'cultural' | 'wildlife' | 'luxury' | 'budget' | 'family'
  difficulty_level: 'easy' | 'moderate' | 'challenging' | 'extreme'
  duration_days: number
  max_participants: number
  price_per_person: number
  images: string[]
  is_active: boolean
  ai_recommendation_score?: number
  created_at?: string
  updated_at?: string
  base_price: number
  currency: string
  min_participants?: number
  includes?: any[]
  excludes?: any[]
  itinerary?: any
}

export interface TourFilters {
  destination: string
  tourType: string
  difficulty: string
  duration: string
  priceRange: [number, number]
}
