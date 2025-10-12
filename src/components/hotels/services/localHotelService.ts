
import { dbService, authService, storageService } from '@/lib/firebase-services'
import type { FiltersState } from '../types/filterTypes'
import type { Hotel } from '@/types/hotel'

export const fetchLocalHotels = async (searchQuery: string, filters: FiltersState): Promise<Hotel[]> => {
  let query = supabase
    .from('hotels')
    .select(`
      *,
      hotel_rooms(*),
      hotel_reviews(id, hotel_id, rating, review_text, created_at, is_verified, guest_name),
      cities(id, name, country),
      hotel_images(id, image_url, is_primary, sort_order)
    `)
    .eq('is_active', true)
    .eq('country', 'Sri Lanka')

  if (searchQuery && searchQuery.trim()) {
    query = query.or(`name.ilike.%${searchQuery.trim()}%,address.ilike.%${searchQuery.trim()}%,description.ilike.%${searchQuery.trim()}%`)
  }

  if (filters.starRating.length > 0) {
    query = query.in('star_rating', filters.starRating)
  }
  
  if (filters.hotelType.length > 0) {
    query = query.in('hotel_type', filters.hotelType)
  }
  
  if (filters.priceRange[0] > 0 || filters.priceRange[1] < 1000) {
    query = query.gte('base_price_per_night', filters.priceRange[0])
                .lte('base_price_per_night', filters.priceRange[1])
  }

  const { data, error } = await query.order('ai_recommendation_score', { ascending: false })
  
  if (error) throw error
  
  return data?.map(hotel => ({
    id: hotel.id,
    name: hotel.name || '',
    description: hotel.description || '',
    star_rating: hotel.star_rating || 0,
    hotel_type: (hotel.hotel_type as Hotel['hotel_type']) || 'budget',
    location: hotel.latitude && hotel.longitude ? {
      latitude: hotel.latitude,
      longitude: hotel.longitude
    } : undefined,
    address: hotel.address || '',
    city: hotel.cities ? {
      id: hotel.cities.id,
      name: hotel.cities.name,
      country: hotel.cities.country || 'Sri Lanka'
    } : undefined,
    amenities: hotel.amenities || [],
    ai_recommendation_score: hotel.ai_recommendation_score || 0,
    room_types: hotel.hotel_rooms?.map((room: any) => ({
      id: room.id,
      hotel_id: room.hotel_id,
      name: room.room_type,
      price_per_night: room.base_price,
      max_occupancy: room.max_occupancy,
      amenities: [],
      available_count: room.is_available ? 1 : 0,
      is_active: room.is_available
    })) || [],
    images: hotel.hotel_images?.map((img: any) => ({
      id: img.id || '',
      hotel_id: hotel.id,
      image_url: img.image_url,
      is_primary: img.is_primary || false,
      sort_order: img.sort_order || 0
    })) || [],
    reviews: hotel.hotel_reviews?.map((review: any) => ({
      id: review.id,
      hotel_id: review.hotel_id,
      rating: review.rating,
      review_text: review.review_text,
      created_at: review.created_at,
      is_verified: review.is_verified,
      guest_name: review.guest_name
    })) || [],
    average_rating: hotel.hotel_reviews && hotel.hotel_reviews.length > 0 
      ? hotel.hotel_reviews.reduce((sum: number, review: any) => sum + review.rating, 0) / hotel.hotel_reviews.length
      : 0,
    review_count: hotel.hotel_reviews?.length || 0,
    is_active: hotel.is_active,
    created_at: hotel.created_at,
    updated_at: hotel.updated_at,
    country: hotel.country || 'Sri Lanka',
    base_price_per_night: hotel.base_price_per_night
  } as Hotel)) || []
}
