
import { TravelStylePreferences } from '@/types/aiRecommendation'

export const travelStylePreferences: TravelStylePreferences = {
  luxury: {
    min_star_rating: 4,
    preferred_amenities: ['Spa', 'Concierge', 'Restaurant', 'Bar', 'Swimming Pool'],
    hotel_types: ['luxury_resort', 'boutique'],
    price_tolerance: 1.5
  },
  budget: {
    max_star_rating: 3,
    essential_amenities: ['wifi', 'parking'],
    hotel_types: ['budget', 'middle_range'],
    price_sensitivity: 0.8
  },
  family: {
    preferred_amenities: ['Swimming Pool', 'Restaurant', 'Parking', 'wifi'],
    hotel_types: ['middle_range', 'luxury_resort'],
    min_star_rating: 3
  },
  business: {
    essential_amenities: ['wifi', 'Business Center', 'Gym'],
    preferred_amenities: ['Concierge', 'Restaurant', 'Bar'],
    hotel_types: ['boutique', 'middle_range']
  },
  adventure: {
    preferred_amenities: ['Parking', 'wifi'],
    hotel_types: ['cabana', 'middle_range'],
    max_star_rating: 4
  }
}
