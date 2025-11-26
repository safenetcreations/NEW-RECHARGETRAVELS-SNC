
import { secureApiService } from './secureApiService'

interface GoogleHotelSearchParams {
  query: string
  location?: string
  checkIn?: string
  checkOut?: string
  guests?: number
  priceMin?: number
  priceMax?: number
  starRating?: number[]
  amenities?: string[]
}

interface GoogleHotelResult {
  id: string
  name: string
  description: string
  star_rating: number
  hotel_type: string
  location: string
  city: string
  country: string
  amenities: string[]
  ai_recommendation_score: number
  base_price_per_night: number
  latitude?: number
  longitude?: number
  images: Array<{
    id: string
    image_url: string
    is_primary: boolean
  }>
  average_rating: number
  review_count: number
  room_types: Array<{
    id: string
    name: string
    price_per_night: number
    max_occupancy: number
    amenities: string[]
  }>
}

interface GoogleHotelsResponse {
  hotels: GoogleHotelResult[]
  total_count: number
  search_query: string
  location: string
}

export class GoogleHotelsService {
  async searchHotels(params: GoogleHotelSearchParams): Promise<GoogleHotelsResponse> {
    try {
      // Use secure API service instead of direct API calls
      const data = await secureApiService.searchPlaces(
        `${params.query} hotels`,
        params.location || 'Sri Lanka'
      );

      // Transform the response to match our interface
      const hotels: GoogleHotelResult[] = ((data as any).results || []).map((result: any) => ({
        id: result.place_id || result.id,
        name: result.name || '',
        description: result.formatted_address || '',
        star_rating: Math.round(result.rating || 3),
        hotel_type: 'hotel',
        location: result.formatted_address || '',
        city: result.vicinity || '',
        country: 'Sri Lanka',
        amenities: [],
        ai_recommendation_score: result.rating || 3,
        base_price_per_night: 100, // Default price
        latitude: result.geometry?.location?.lat,
        longitude: result.geometry?.location?.lng,
        images: result.photos ? result.photos.slice(0, 3).map((photo: any, index: number) => ({
          id: `${result.place_id}-${index}`,
          image_url: photo.photo_reference,
          is_primary: index === 0
        })) : [],
        average_rating: result.rating || 0,
        review_count: result.user_ratings_total || 0,
        room_types: [{
          id: `${result.place_id}-standard`,
          name: 'Standard Room',
          price_per_night: 100,
          max_occupancy: 2,
          amenities: []
        }]
      }));

      return {
        hotels,
        total_count: hotels.length,
        search_query: params.query,
        location: params.location || 'Sri Lanka'
      };
    } catch (error) {
      console.error('Error in GoogleHotelsService:', error)
      throw new Error('Failed to search hotels via secure API')
    }
  }

  async getHotelDetails(placeId: string): Promise<GoogleHotelResult | null> {
    try {
      const data = await secureApiService.getPlaceDetails(placeId);
      
      if (!(data as any).result) return null;

      const result = (data as any).result;
      return {
        id: result.place_id,
        name: result.name || '',
        description: result.formatted_address || '',
        star_rating: Math.round(result.rating || 3),
        hotel_type: 'hotel',
        location: result.formatted_address || '',
        city: result.vicinity || '',
        country: 'Sri Lanka',
        amenities: [],
        ai_recommendation_score: result.rating || 3,
        base_price_per_night: 100,
        latitude: result.geometry?.location?.lat,
        longitude: result.geometry?.location?.lng,
        images: result.photos ? result.photos.slice(0, 5).map((photo: any, index: number) => ({
          id: `${result.place_id}-${index}`,
          image_url: photo.photo_reference,
          is_primary: index === 0
        })) : [],
        average_rating: result.rating || 0,
        review_count: result.user_ratings_total || 0,
        room_types: [{
          id: `${result.place_id}-standard`,
          name: 'Standard Room',
          price_per_night: 100,
          max_occupancy: 2,
          amenities: []
        }]
      };
    } catch (error) {
      console.error('Error getting hotel details:', error)
      return null
    }
  }
}

export const googleHotelsService = new GoogleHotelsService()
