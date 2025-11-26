
import { googleHotelsService } from '@/services/googleHotelsService'
import type { FiltersState } from '../types/filterTypes'
import type { Hotel } from '@/types/hotel'

export const fetchGoogleHotels = async (searchQuery: string, filters: FiltersState): Promise<Hotel[]> => {
  try {
    const response = await googleHotelsService.searchHotels({
      query: searchQuery,
      location: 'Sri Lanka',
      priceMin: filters.priceRange[0],
      priceMax: filters.priceRange[1],
      starRating: filters.starRating.length > 0 ? filters.starRating : undefined
    })

    const transformedHotels: Hotel[] = response.hotels.map(googleHotel => ({
      id: googleHotel.id,
      name: googleHotel.name,
      description: googleHotel.description,
      star_rating: googleHotel.star_rating,
      hotel_type: (googleHotel.hotel_type as Hotel['hotel_type']) || 'budget',
      location: googleHotel.latitude && googleHotel.longitude ? {
        latitude: googleHotel.latitude,
        longitude: googleHotel.longitude
      } : undefined,
      address: googleHotel.location,
      city: googleHotel.city ? {
        id: 'google-' + googleHotel.city.toLowerCase().replace(/\s+/g, '-'),
        name: googleHotel.city,
        country: 'Sri Lanka'
      } : undefined,
      amenities: googleHotel.amenities,
      ai_recommendation_score: googleHotel.ai_recommendation_score,
      room_types: googleHotel.room_types.map(room => ({
        id: room.id,
        hotel_id: googleHotel.id,
        name: room.name,
        price_per_night: room.price_per_night,
        max_occupancy: room.max_occupancy,
        amenities: room.amenities,
        available_count: 1,
        is_active: true
      })),
      images: googleHotel.images.map(img => ({
        id: img.id,
        hotel_id: googleHotel.id,
        image_url: img.image_url,
        is_primary: img.is_primary,
        sort_order: 0
      })),
      reviews: [],
      average_rating: googleHotel.average_rating,
      review_count: googleHotel.review_count,
      is_active: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      country: 'Sri Lanka',
      base_price_per_night: googleHotel.base_price_per_night
    } as Hotel))

    return transformedHotels
  } catch (error) {
    console.error('Error fetching from Google Hotels API:', error)
    throw error
  }
}
