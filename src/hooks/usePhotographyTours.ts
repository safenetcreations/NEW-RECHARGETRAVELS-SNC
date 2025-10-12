import { useQuery } from '@tanstack/react-query'
import { dbService, authService, storageService } from '@/lib/firebase-services'

export interface PhotographyTour {
  id: string
  title: string
  slug: string
  description: string | null
  detailed_description: string | null
  genre: 'cultural_temples' | 'wildlife_nature' | 'scenic_trains' | 'street_local'
  skill_level: 'beginner' | 'intermediate' | 'pro'
  duration_type: 'half_day' | 'full_day' | 'multi_day'
  duration_hours: number | null
  duration_days: number | null
  location: string
  locations: any[] | null
  price_standard: number
  price_pro: number | null
  currency: string | null
  max_participants: number | null
  min_participants: number | null
  hero_image_url: string | null
  gallery_images: any[] | null
  video_url: string | null
  gear_rental_available: boolean | null
  gear_options: any[] | null
  inclusions: any[] | null
  sample_shots: any[] | null
  photography_tips: string | null
  regulations: string | null
  best_times: string | null
  difficulty_level: string | null
  meeting_point: string | null
  latitude: number | null
  longitude: number | null
  photo_locations: any[] | null
  is_featured: boolean | null
  is_active: boolean | null
  seo_title: string | null
  seo_description: string | null
  created_at: string
  updated_at: string
}

interface PhotographyToursFilters {
  genre?: string
  skillLevel?: string
  durationType?: string
  gearRental?: boolean
}

export const usePhotographyTours = (filters: PhotographyToursFilters = {}) => {
  return useQuery({
    queryKey: ['photography-tours', filters],
    queryFn: async () => {
      let query = supabase
        .from('photography_tours')
        .select('*')
        .eq('is_active', true)
        .order('is_featured', { ascending: false })
        .order('created_at', { ascending: false })

      if (filters.genre) {
        query = query.eq('genre', filters.genre)
      }

      if (filters.skillLevel) {
        query = query.eq('skill_level', filters.skillLevel)
      }

      if (filters.durationType) {
        query = query.eq('duration_type', filters.durationType)
      }

      if (filters.gearRental) {
        query = query.eq('gear_rental_available', true)
      }

      const { data, error } = await query

      if (error) {
        console.error('Error fetching photography tours:', error)
        throw error
      }

      return data as PhotographyTour[]
    }
  })
}

export const usePhotographyTour = (slug: string) => {
  return useQuery({
    queryKey: ['photography-tour', slug],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('photography_tours')
        .select('*')
        .eq('slug', slug)
        .eq('is_active', true)
        .single()

      if (error) {
        if (error.code === 'PGRST116') {
          return null // No data found
        }
        console.error('Error fetching photography tour:', error)
        throw error
      }

      return data as PhotographyTour
    },
    enabled: !!slug
  })
}