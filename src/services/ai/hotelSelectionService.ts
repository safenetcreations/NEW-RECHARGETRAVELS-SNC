
import { Hotel, RoomType } from '@/types/hotel'
import { UserPreferences, TourPackageWithTour } from '@/types/aiRecommendation'

export class HotelSelectionService {
  static selectBestRoom(hotel: Hotel, preferences: UserPreferences): RoomType | null {
    if (!hotel.room_types || hotel.room_types.length === 0) return null

    // Find room that best fits group size and budget
    const suitableRooms = hotel.room_types.filter(room => 
      room.max_occupancy >= Math.min(preferences.group_size, 4)
    )

    if (suitableRooms.length === 0) return hotel.room_types[0]

    // Sort by price and pick the best value
    suitableRooms.sort((a, b) => a.price_per_night - b.price_per_night)
    
    const [minBudget, maxBudget] = preferences.budget_range
    const budgetFriendly = suitableRooms.find(room => 
      room.price_per_night >= minBudget && room.price_per_night <= maxBudget
    )

    return budgetFriendly || suitableRooms[0]
  }

  static findBestTourPackage(
    tours: TourPackageWithTour[], 
    hotelScore: number, 
    basePrice: number
  ): TourPackageWithTour | null {
    if (tours.length === 0) return null

    const scoredTours = tours.map(tour => ({
      tour,
      score: hotelScore * 0.8 + (tour.discount_percentage / 100) * 0.2
    }))

    scoredTours.sort((a, b) => b.score - a.score)
    return scoredTours[0]?.tour || null
  }

  static generateReasoning(hotel: Hotel, score: number, preferences: UserPreferences): string {
    const reasons = []

    if (score > 0.8) {
      reasons.push("This hotel is an excellent match for your preferences")
    } else if (score > 0.6) {
      reasons.push("This hotel is a good match for your needs")
    } else {
      reasons.push("This hotel meets your basic requirements")
    }

    // Add specific reasons based on what scored well
    const priceScore = this.calculatePriceMatch(hotel, preferences)
    if (priceScore > 0.8) {
      reasons.push("great value within your budget")
    }

    const amenityScore = this.calculateAmenityMatch(hotel, preferences)
    if (amenityScore > 0.7) {
      reasons.push("has most of your preferred amenities")
    }

    if (hotel.average_rating && hotel.average_rating > 4.0) {
      reasons.push("highly rated by previous guests")
    }

    if (hotel.star_rating && preferences.preferred_star_rating.includes(hotel.star_rating)) {
      reasons.push("matches your preferred star rating")
    }

    return reasons.join(", ") + "."
  }

  private static calculatePriceMatch(hotel: Hotel, preferences: UserPreferences): number {
    const price = hotel.base_price_per_night || 0
    const [minBudget, maxBudget] = preferences.budget_range
    return price >= minBudget && price <= maxBudget ? 1.0 : 0.5
  }

  private static calculateAmenityMatch(hotel: Hotel, preferences: UserPreferences): number {
    if (!hotel.amenities || preferences.preferred_amenities.length === 0) return 0.7
    
    const hotelAmenities = hotel.amenities.map(a => a.toLowerCase())
    const preferredAmenities = preferences.preferred_amenities.map(a => a.toLowerCase())
    
    const matchingAmenities = preferredAmenities.filter(amenity =>
      hotelAmenities.some(hotelAmenity => hotelAmenity.includes(amenity))
    )

    return matchingAmenities.length / preferredAmenities.length
  }
}
