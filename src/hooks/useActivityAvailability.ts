
import { useQuery } from '@tanstack/react-query'
import { dbService, authService, storageService } from '@/lib/firebase-services'

interface AvailabilityParams {
  activityId: string
  date: string
  time: string
  quantity?: number
}

export const useActivityAvailability = (params: AvailabilityParams | null) => {
  return useQuery({
    queryKey: ['activity-availability', params],
    queryFn: async () => {
      if (!params) return null

      const { data, error } = await supabase
        .rpc('check_activity_availability', {
          activity_id_param: params.activityId,
          date_param: params.date,
          time_param: params.time,
          quantity_param: params.quantity || 1
        })

      if (error) throw error
      return data as boolean
    },
    enabled: !!params
  })
}
