
import { HotelWithRelations } from '../types'

export const createMockGoogleHotelData = (hotelId: string): HotelWithRelations => {
  return {
    id: hotelId,
    name: 'Hotel Details Loading...',
    description: 'Detailed information about this hotel is being loaded from our partners.',
    star_rating: 4,
    hotel_type: 'middle_range' as const,
    base_price_per_night: 150,
    country: 'Sri Lanka',
    address: 'Sri Lanka',
    amenities: ['WiFi', 'Pool', 'Restaurant', 'Parking'],
    is_active: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    images: [
      'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=800&h=600&fit=crop'
    ],
    room_types: [
      {
        id: 'default-room',
        hotel_id: hotelId,
        name: 'Standard Room',
        price_per_night: 150,
        max_occupancy: 2,
        amenities: ['WiFi', 'Air Conditioning', 'Private Bathroom'],
        available_count: 5,
        is_active: true
      }
    ],
    hotel_reviews: [],
    cities: {
      name: 'Sri Lanka'
    }
  }
}
