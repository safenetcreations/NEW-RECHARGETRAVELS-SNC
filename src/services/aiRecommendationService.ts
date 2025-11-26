
import { Hotel } from '@/types/hotel'
import { UserPreferences, AIRecommendation, TourPackageWithTour } from '@/types/aiRecommendation'
import { ScoringCalculators } from './ai/scoringCalculators'
import { HotelSelectionService } from './ai/hotelSelectionService'
import { DefaultPreferencesService } from './ai/defaultPreferences'

export class AIRecommendationService {
  private weights = {
    price_match: 0.3,
    star_rating_match: 0.2,
    amenity_match: 0.15,
    location_preference: 0.15,
    review_score: 0.1,
    availability: 0.1
  }

  calculateHotelScore(hotel: Hotel, preferences: UserPreferences): number {
    let totalScore = 0

    // Price matching
    const priceScore = ScoringCalculators.calculatePriceScore(hotel, preferences)
    totalScore += priceScore * this.weights.price_match

    // Star rating matching
    const starScore = ScoringCalculators.calculateStarRatingScore(hotel, preferences)
    totalScore += starScore * this.weights.star_rating_match

    // Amenity matching
    const amenityScore = ScoringCalculators.calculateAmenityScore(hotel, preferences)
    totalScore += amenityScore * this.weights.amenity_match

    // Location preference
    const locationScore = ScoringCalculators.calculateLocationScore(hotel, preferences)
    totalScore += locationScore * this.weights.location_preference

    // Review score
    const reviewScore = ScoringCalculators.calculateReviewScore(hotel)
    totalScore += reviewScore * this.weights.review_score

    // Availability
    const availabilityScore = ScoringCalculators.calculateAvailabilityScore(hotel, preferences)
    totalScore += availabilityScore * this.weights.availability

    return Math.min(totalScore, 1.0)
  }

  getBestRecommendation(
    hotel: Hotel, 
    availableTours: TourPackageWithTour[], 
    preferences: UserPreferences,
    tripDuration: number
  ): AIRecommendation {
    const score = this.calculateHotelScore(hotel, preferences)
    const bestRoom = HotelSelectionService.selectBestRoom(hotel, preferences)
    
    // Calculate base hotel price
    const basePrice = (hotel.base_price_per_night || 0) * tripDuration
    
    // Check for tour packages
    const bestPackage = HotelSelectionService.findBestTourPackage(availableTours, score, basePrice)
    
    let reasoning = HotelSelectionService.generateReasoning(hotel, score, preferences)
    let totalPrice = basePrice
    let bookingType: 'hotel_only' | 'package' = 'hotel_only'

    if (bestPackage && bestPackage.package_price && bestPackage.package_price < basePrice * 1.2) {
      bookingType = 'package'
      totalPrice = bestPackage.package_price
      reasoning += ` Plus, we found a great tour package "${bestPackage.package_name}" that offers ${bestPackage.discount_percentage}% savings.`
    }

    return {
      hotel,
      room: bestRoom,
      score,
      reasoning,
      booking_type: bookingType,
      total_price: totalPrice,
      confidence: score > 0.8 ? 'high' : score > 0.6 ? 'medium' : 'low'
    }
  }

  // Default preferences for when user hasn't specified any
  getDefaultPreferences(guests: { adults: number; children: number }): UserPreferences {
    return DefaultPreferencesService.getDefaultPreferences(guests)
  }
}

export const aiRecommendationService = new AIRecommendationService()

// Re-export types for backward compatibility
export type { UserPreferences, AIRecommendation, TourPackageWithTour } from '@/types/aiRecommendation'
