
import { Hotel } from '@/types/hotel'
import { UserPreferences } from '@/types/aiRecommendation'

export class ScoringCalculators {
  static calculatePriceScore(hotel: Hotel, preferences: UserPreferences): number {
    const price = hotel.base_price_per_night || 0
    const [minBudget, maxBudget] = preferences.budget_range

    if (price >= minBudget && price <= maxBudget) {
      return 1.0
    } else if (price < minBudget) {
      return 0.8 + (price / minBudget) * 0.2
    } else {
      const overBudgetRatio = (price - maxBudget) / maxBudget
      return Math.max(0.0, 0.5 - overBudgetRatio)
    }
  }

  static calculateStarRatingScore(hotel: Hotel, preferences: UserPreferences): number {
    if (!hotel.star_rating || preferences.preferred_star_rating.length === 0) {
      return 0.7
    }

    if (preferences.preferred_star_rating.includes(hotel.star_rating)) {
      return 1.0
    }

    const minDistance = Math.min(
      ...preferences.preferred_star_rating.map(rating => 
        Math.abs(hotel.star_rating! - rating)
      )
    )
    return Math.max(0.0, 1.0 - (minDistance * 0.2))
  }

  static calculateAmenityScore(hotel: Hotel, preferences: UserPreferences): number {
    if (!hotel.amenities || preferences.preferred_amenities.length === 0) {
      return 0.7
    }

    const hotelAmenities = hotel.amenities.map(a => a.toLowerCase())
    const preferredAmenities = preferences.preferred_amenities.map(a => a.toLowerCase())
    
    const matchingAmenities = preferredAmenities.filter(amenity =>
      hotelAmenities.some(hotelAmenity => hotelAmenity.includes(amenity))
    )

    return matchingAmenities.length / preferredAmenities.length
  }

  static calculateLocationScore(hotel: Hotel, preferences: UserPreferences): number {
    if (preferences.location_preferences.length === 0) {
      return 0.7
    }

    const hotelLocation = (hotel.city?.name || '').toLowerCase()
    const hotelAddress = (hotel.address || '').toLowerCase()

    for (const preferredLocation of preferences.location_preferences) {
      const preferred = preferredLocation.toLowerCase()
      if (hotelLocation.includes(preferred) || hotelAddress.includes(preferred)) {
        return 1.0
      }
    }

    return 0.3
  }

  static calculateReviewScore(hotel: Hotel): number {
    if (!hotel.average_rating || hotel.review_count === 0) {
      return 0.5
    }

    const ratingScore = (hotel.average_rating - 1) / 4 // Normalize 1-5 to 0-1
    const confidenceFactor = Math.min((hotel.review_count || 0) / 50, 1.0)
    
    return ratingScore * confidenceFactor + (1 - confidenceFactor) * 0.5
  }

  static calculateAvailabilityScore(hotel: Hotel, preferences: UserPreferences): number {
    const availableRooms = hotel.available_rooms || 0
    if (availableRooms === 0) return 0.0

    const roomsNeeded = Math.ceil(preferences.group_size / 2)
    
    if (availableRooms >= roomsNeeded * 2) return 1.0
    if (availableRooms >= roomsNeeded) return 0.8
    return 0.3
  }
}
