import { useState, useEffect } from 'react'
import { useQuery } from '@tanstack/react-query'
import { dbService, authService, storageService } from '@/lib/firebase-services'

export interface EcoTour {
  id: string
  name: string
  slug: string
  category: 'wildlife_conservation' | 'agro_tourism' | 'community_homestays' | 'marine_protection' | 'forest_treks'
  description: string
  short_description: string
  duration_days: number
  duration_text: string
  group_size_min: number
  group_size_max: number
  price_per_person: number
  currency: string
  hero_image_url: string
  gallery_images: string[]
  location: string
  latitude: number | null
  longitude: number | null
  impact_metrics: Record<string, any>
  green_practices: string[]
  community_partners: string[]
  inclusions: string[]
  exclusions: string[]
  pricing_tiers: Array<{
    tier: string
    price: number
    features: string[]
  }>
  itinerary: Array<{
    day: number
    title: string
    activities: string[]
  }>
  environmental_goals: string
  carbon_offset_kg: number
  trees_planted_per_booking: number
  community_fund_percentage: number
  is_featured: boolean
  is_active: boolean
  difficulty_level: string
  best_season: string
  special_requirements: string
  faq: Array<{
    question: string
    answer: string
  }>
  created_at: string
  updated_at: string
}

export interface EcoAccommodation {
  id: string
  name: string
  type: 'eco_lodge' | 'homestay' | 'sustainable_hotel' | 'camping'
  location: string
  latitude: number | null
  longitude: number | null
  description: string
  amenities: string[]
  sustainability_features: string[]
  price_per_night: number
  currency: string
  images: string[]
  rating: number
  is_active: boolean
  created_at: string
  updated_at: string
}

export interface EcoBooking {
  id: string
  user_id: string
  eco_tour_id: string
  accommodation_id: string | null
  booking_date: string
  group_size: number
  pricing_tier: string
  total_price: number
  currency: string
  carbon_offset_contribution: number
  community_donation: number
  special_requests: string
  contact_info: Record<string, any>
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed'
  created_at: string
  updated_at: string
}

// Helper function to safely convert JSON to string array
const jsonToStringArray = (jsonData: any): string[] => {
  if (Array.isArray(jsonData)) {
    return jsonData.filter(item => typeof item === 'string')
  }
  return []
}

// Helper function to safely convert JSON to object
const jsonToObject = (jsonData: any): Record<string, any> => {
  if (typeof jsonData === 'object' && jsonData !== null) {
    return jsonData
  }
  return {}
}

interface EcoToursFilters {
  category?: string
  priceRange?: [number, number]
  duration?: string
  featured?: boolean
}

export const useEcoTours = (filters: EcoToursFilters = {}) => {
  return useQuery({
    queryKey: ['eco-tours', filters],
    queryFn: async () => {
      let query = supabase
        .from('eco_tours')
        .select('*')
        .eq('is_active', true)

      if (filters.category) {
        query = query.eq('category', filters.category)
      }

      if (filters.featured) {
        query = query.eq('is_featured', true)
      }

      if (filters.priceRange) {
        query = query
          .gte('price_per_person', filters.priceRange[0])
          .lte('price_per_person', filters.priceRange[1])
      }

      if (filters.duration) {
        switch (filters.duration) {
          case 'short':
            query = query.lte('duration_days', 3)
            break
          case 'medium':
            query = query.gte('duration_days', 4).lte('duration_days', 7)
            break
          case 'long':
            query = query.gte('duration_days', 8)
            break
        }
      }

      const { data, error } = await query.order('created_at', { ascending: false })

      if (error) throw error

      return data?.map(tour => ({
        ...tour,
        gallery_images: jsonToStringArray(tour.gallery_images),
        green_practices: jsonToStringArray(tour.green_practices),
        community_partners: jsonToStringArray(tour.community_partners),
        inclusions: jsonToStringArray(tour.inclusions),
        exclusions: jsonToStringArray(tour.exclusions),
        impact_metrics: jsonToObject(tour.impact_metrics),
        pricing_tiers: Array.isArray(tour.pricing_tiers) ? tour.pricing_tiers : [],
        itinerary: Array.isArray(tour.itinerary) ? tour.itinerary : [],
        faq: Array.isArray(tour.faq) ? tour.faq : []
      })) as EcoTour[]
    }
  })
}

export const useEcoTour = (slug: string) => {
  return useQuery({
    queryKey: ['eco-tour', slug],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('eco_tours')
        .select('*')
        .eq('slug', slug)
        .eq('is_active', true)
        .single()

      if (error) throw error

      return {
        ...data,
        gallery_images: jsonToStringArray(data.gallery_images),
        green_practices: jsonToStringArray(data.green_practices),
        community_partners: jsonToStringArray(data.community_partners),
        inclusions: jsonToStringArray(data.inclusions),
        exclusions: jsonToStringArray(data.exclusions),
        impact_metrics: jsonToObject(data.impact_metrics),
        pricing_tiers: Array.isArray(data.pricing_tiers) ? data.pricing_tiers : [],
        itinerary: Array.isArray(data.itinerary) ? data.itinerary : [],
        faq: Array.isArray(data.faq) ? data.faq : []
      } as EcoTour
    }
  })
}

export const useEcoAccommodations = (location?: string) => {
  return useQuery({
    queryKey: ['eco-accommodations', location],
    queryFn: async () => {
      let query = supabase
        .from('eco_accommodations')
        .select('*')
        .eq('is_active', true)

      if (location) {
        query = query.ilike('location', `%${location}%`)
      }

      const { data, error } = await query.order('rating', { ascending: false })

      if (error) throw error

      return data?.map(accommodation => ({
        ...accommodation,
        amenities: jsonToStringArray(accommodation.amenities),
        sustainability_features: jsonToStringArray(accommodation.sustainability_features),
        images: jsonToStringArray(accommodation.images)
      })) as EcoAccommodation[]
    }
  })
}

export const useCreateEcoBooking = () => {
  const [loading, setLoading] = useState(false)

  const createBooking = async (booking: Omit<EcoBooking, 'id' | 'created_at' | 'updated_at'>) => {
    setLoading(true)
    try {
      const { data, error } = await supabase
        .from('eco_bookings')
        .insert([booking])
        .select()
        .single()

      if (error) throw error
      return data
    } finally {
      setLoading(false)
    }
  }

  return { createBooking, loading }
}

export const useUserEcoBookings = (userId: string) => {
  return useQuery({
    queryKey: ['user-eco-bookings', userId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('eco_bookings')
        .select(`
          *,
          eco_tours:eco_tour_id(name, slug, hero_image_url),
          eco_accommodations:accommodation_id(name, type)
        `)
        .eq('user_id', userId)
        .order('created_at', { ascending: false })

      if (error) throw error
      return data as (EcoBooking & {
        eco_tours: Pick<EcoTour, 'name' | 'slug' | 'hero_image_url'>
        eco_accommodations: Pick<EcoAccommodation, 'name' | 'type'> | null
      })[]
    }
  })
}