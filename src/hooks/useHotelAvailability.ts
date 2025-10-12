
import { useQuery } from '@tanstack/react-query'
import { dbService, authService, storageService } from '@/lib/firebase-services'

interface AvailabilityParams {
  hotelId: string
  checkIn: string
  checkOut: string
  roomCount?: number
}

export const useHotelAvailability = (params: AvailabilityParams | null) => {
  return useQuery({
    queryKey: ['hotel-availability', params],
    queryFn: async () => {
      if (!params) return null

      const { data, error } = await supabase
        .rpc('check_hotel_availability', {
          hotel_id_param: params.hotelId,
          check_in_param: params.checkIn,
          check_out_param: params.checkOut,
          room_count_param: params.roomCount || 1
        })

      if (error) throw error
      return data as boolean
    },
    enabled: !!params
  })
}
