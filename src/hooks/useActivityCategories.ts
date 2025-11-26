
import { useQuery } from '@tanstack/react-query'
import { dbService, authService, storageService } from '@/lib/firebase-services'
import { ActivityCategory } from '@/types/activity'

export const useActivityCategories = () => {
  return useQuery({
    queryKey: ['activity-categories'],
    queryFn: async () => {
      console.log('Fetching activity categories from database...')
      
      const { data, error } = await supabase
        .from('activity_categories')
        .select('*')
        .order('name')

      if (error) {
        console.error('Error fetching activity categories:', error)
        // Return sample categories if database is empty
        return [
          { id: 'wildlife', name: 'Wildlife Safari', icon: '🦁', description: 'Safari and wildlife experiences' },
          { id: 'cultural', name: 'Cultural Heritage', icon: '🏛️', description: 'Historical and cultural sites' },
          { id: 'adventure', name: 'Adventure', icon: '🏃', description: 'Outdoor adventure activities' },
          { id: 'marine', name: 'Marine Life', icon: '🐋', description: 'Ocean and marine experiences' },
          { id: 'nature', name: 'Nature', icon: '🌿', description: 'Natural attractions and landscapes' }
        ] as ActivityCategory[]
      }

      console.log('Activity categories fetched:', data)
      return (data || []) as ActivityCategory[]
    }
  })
}
