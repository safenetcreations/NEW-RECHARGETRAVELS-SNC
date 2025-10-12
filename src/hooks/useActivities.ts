
import { useQuery } from '@tanstack/react-query'
import { dbService, authService, storageService } from '@/lib/firebase-services'
import { Activity, ActivityFilters } from '@/types/activity'

// Helper function to safely extract coordinates from PostGIS geometry
const extractCoordinates = (geometry: unknown): { latitude: number; longitude: number } | undefined => {
  if (!geometry || typeof geometry !== 'object') return undefined
  
  const geom = geometry as any
  if (geom && geom.coordinates && Array.isArray(geom.coordinates) && geom.coordinates.length >= 2) {
    return {
      latitude: geom.coordinates[1],
      longitude: geom.coordinates[0]
    }
  }
  return undefined
}

export const useActivities = (filters?: Partial<ActivityFilters>) => {
  return useQuery({
    queryKey: ['activities', filters],
    queryFn: async () => {
      console.log('Fetching activities from database...')
      
      let query = supabase
        .from('activities')
        .select(`
          *,
          category:activity_categories(*),
          location_info:locations(*),
          media:activity_media(*),
          reviews:activity_reviews(id, rating, comment, guest_name, created_at, is_verified),
          schedules:activity_schedule(*)
        `)
        .eq('is_active', true)

      // Apply filters
      if (filters?.categories && filters.categories.length > 0) {
        query = query.in('category_id', filters.categories)
      }

      if (filters?.locations && filters.locations.length > 0) {
        query = query.in('location_id', filters.locations)
      }

      if (filters?.priceRange) {
        query = query
          .gte('price', filters.priceRange[0])
          .lte('price', filters.priceRange[1])
      }

      if (filters?.difficulty && filters.difficulty.length > 0) {
        query = query.in('difficulty', filters.difficulty)
      }

      if (filters?.rating) {
        query = query.gte('average_rating', filters.rating)
      }

      const { data, error } = await query.order('average_rating', { ascending: false })

      if (error) {
        console.error('Error fetching activities:', error)
        // Don't throw the error, return empty array instead
        return []
      }

      console.log('Activities fetched from database:', data)

      if (!data || data.length === 0) {
        console.log('No activities found in database')
        return []
      }

      return (data || []).map(activity => ({
        ...activity,
        location: activity.location_info?.location 
          ? extractCoordinates(activity.location_info.location)
          : undefined
      })) as Activity[]
    }
  })
}

export const useActivity = (id: string) => {
  return useQuery({
    queryKey: ['activity', id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('activities')
        .select(`
          *,
          category:activity_categories(*),
          location_info:locations(*),
          media:activity_media(*),
          reviews:activity_reviews(*),
          schedules:activity_schedule(*)
        `)
        .eq('id', id)
        .eq('is_active', true)
        .single()

      if (error) throw error

      return {
        ...data,
        location: data.location_info?.location 
          ? extractCoordinates(data.location_info.location)
          : undefined
      } as Activity
    }
  })
}
