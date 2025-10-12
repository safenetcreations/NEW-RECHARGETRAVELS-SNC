
import { UserPreferences } from '@/types/aiRecommendation'

export class DefaultPreferencesService {
  static getDefaultPreferences(guests: { adults: number; children: number }): UserPreferences {
    const groupSize = guests.adults + guests.children
    
    return {
      budget_range: [50, 200],
      preferred_star_rating: [3, 4],
      preferred_hotel_types: ['middle_range', 'boutique'],
      preferred_amenities: ['wifi', 'parking', 'restaurant'],
      travel_style: groupSize > 2 ? 'family' : 'business',
      group_size: groupSize,
      trip_duration: 3,
      location_preferences: []
    }
  }
}
