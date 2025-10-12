import { useQuery } from '@tanstack/react-query'
import { dbService, authService, storageService } from '@/lib/firebase-services'

interface City {
  id: string
  name: string
  country: string
  latitude: number
  longitude: number
  created_at: string
}

interface CityExperience {
  id: string
  city_id: string
  name: string
  category: string
  subcategory?: string
  description?: string
  price_level?: number
  price_per_person?: number
  currency: string
  duration?: string
  location_name?: string
  address?: string
  latitude?: number
  longitude?: number
  images: string[]
  features: string[]
  booking_url?: string
  phone?: string
  email?: string
  website?: string
  opening_hours?: any
  rating: number
  review_count: number
  is_featured: boolean
  is_active: boolean
}

interface CityAccommodation {
  id: string
  city_id: string
  name: string
  type: string
  description?: string
  price_per_night?: number
  currency: string
  location_name?: string
  address?: string
  latitude?: number
  longitude?: number
  images: string[]
  amenities: string[]
  room_types: any[]
  booking_url?: string
  phone?: string
  email?: string
  website?: string
  rating: number
  review_count: number
  is_featured: boolean
  is_active: boolean
}

interface CityInsight {
  id: string
  city_id: string
  title: string
  content: string
  category: string
  order_index: number
  is_featured: boolean
  is_active: boolean
}

export const useCityData = (citySlug: string) => {
  return useQuery({
    queryKey: ['cityData', citySlug],
    queryFn: async () => {
      // First get the city by name (using slug as name for now)
      const cityName = citySlug.charAt(0).toUpperCase() + citySlug.slice(1).replace('-', ' ')
      
      const { data: city, error: cityError } = await supabase
        .from('cities')
        .select('*')
        .eq('name', cityName)
        .single()

      if (cityError || !city) {
        throw new Error('City not found')
      }

      // Get experiences for this city
      const { data: experiences, error: experiencesError } = await supabase
        .from('city_experiences')
        .select('*')
        .eq('city_id', city.id)
        .eq('is_active', true)
        .order('is_featured', { ascending: false })
        .order('rating', { ascending: false })

      // Get accommodations for this city
      const { data: accommodations, error: accommodationsError } = await supabase
        .from('city_accommodations')
        .select('*')
        .eq('city_id', city.id)
        .eq('is_active', true)
        .order('is_featured', { ascending: false })
        .order('rating', { ascending: false })

      // Get insights for this city
      const { data: insights, error: insightsError } = await supabase
        .from('city_insights')
        .select('*')
        .eq('city_id', city.id)
        .eq('is_active', true)
        .order('order_index', { ascending: true })

      return {
        city: city as City,
        experiences: experiences as CityExperience[] || [],
        accommodations: accommodations as CityAccommodation[] || [],
        insights: insights as CityInsight[] || []
      }
    },
    enabled: !!citySlug
  })
}

export const useCities = () => {
  return useQuery({
    queryKey: ['cities'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('cities')
        .select('*')
        .order('name')

      if (error) throw error
      return data as City[]
    }
  })
}