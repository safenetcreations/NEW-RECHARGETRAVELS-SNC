
import { Hotel, HotelReview, RoomType } from '@/types/hotel'

export interface HotelWithRelations extends Omit<Hotel, 'images'> {
  room_types: RoomType[]
  hotel_reviews: HotelReview[]
  images: string[]
  cities?: {
    name: string
  }
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
