import { getFunctions, httpsCallable } from 'firebase/functions'
import app from '@/lib/firebase'

const functions = getFunctions(app)

// Define function references
const checkVehicleAvailabilityFn = httpsCallable(functions, 'checkVehicleAvailability')
const calculateTourPriceFn = httpsCallable(functions, 'calculateTourPrice')
const searchToursFn = httpsCallable(functions, 'searchTours')
const getAvailabilityCalendarFn = httpsCallable(functions, 'getAvailabilityCalendar')
const storeConversationFn = httpsCallable(functions, 'storeConversation')

export interface VehicleAvailabilityRequest {
  date: string
  category?: 'car' | 'van' | 'suv' | 'bus'
  passengers?: number
}

export interface VehicleAvailabilityResponse {
  success: boolean
  available: boolean
  vehicles: Array<{
    id: string
    name: string
    category: string
    capacity: number
    pricePerDay: number
    features: string[]
    image?: string
  }>
  totalAvailable: number
}

export interface TourPriceRequest {
  tourId: string
  pax: number
  date: string
}

export interface TourPriceResponse {
  success: boolean
  tourId?: string
  tourName: string
  pax?: number
  basePrice: number
  subtotal: number
  discount: number
  discountAmount: number
  totalPrice: number
  currency: string
  includes: string[]
  seasonalPricing: boolean
  validUntil: string
}

export interface TourSearchRequest {
  query: string
  category?: string
  maxPrice?: number
  minRating?: number
}

export interface Tour {
  id: string
  name: string
  description: string
  category: string
  pricePerPerson: number
  duration: string
  rating: number
  images: string[]
  highlights: string[]
}

export class YaluFirebaseService {
  // Check vehicle availability
  static async checkVehicleAvailability(
    request: VehicleAvailabilityRequest
  ): Promise<VehicleAvailabilityResponse> {
    try {
      const result = await checkVehicleAvailabilityFn(request)
      return result.data as VehicleAvailabilityResponse
    } catch (error) {
      console.error('Vehicle availability check failed:', error)
      return {
        success: false,
        available: false,
        vehicles: [],
        totalAvailable: 0
      }
    }
  }

  // Calculate tour pricing
  static async calculateTourPrice(
    request: TourPriceRequest
  ): Promise<TourPriceResponse> {
    try {
      const result = await calculateTourPriceFn(request)
      return result.data as TourPriceResponse
    } catch (error) {
      console.error('Tour price calculation failed:', error)
      throw error
    }
  }

  // Search tours
  static async searchTours(
    request: TourSearchRequest
  ): Promise<{ success: boolean; results: Tour[]; total: number }> {
    try {
      const result = await searchToursFn(request)
      return result.data as any
    } catch (error) {
      console.error('Tour search failed:', error)
      return {
        success: false,
        results: [],
        total: 0
      }
    }
  }

  // Get availability calendar
  static async getAvailabilityCalendar(
    resourceType: 'vehicle' | 'tour' | 'guide',
    resourceId: string,
    month: number,
    year: number
  ) {
    try {
      const result = await getAvailabilityCalendarFn({
        resourceType,
        resourceId,
        month,
        year
      })
      return result.data
    } catch (error) {
      console.error('Availability calendar failed:', error)
      return null
    }
  }

  // Store conversation for memory
  static async storeConversation(
    sessionId: string,
    messages: any[],
    language: string,
    userId?: string
  ) {
    try {
      const result = await storeConversationFn({
        sessionId,
        userId,
        messages,
        language,
        metadata: {
          timestamp: new Date().toISOString(),
          platform: 'web',
          version: '1.0'
        }
      })
      return result.data
    } catch (error) {
      console.error('Store conversation failed:', error)
      return { success: false }
    }
  }

  // Format responses for Yalu
  static formatVehicleResponse(data: VehicleAvailabilityResponse): string {
    if (!data.available) {
      return "I'm sorry, but no vehicles are available for your selected date. Would you like to check alternative dates?"
    }

    let response = `Great news! I found ${data.totalAvailable} vehicle${data.totalAvailable > 1 ? 's' : ''} available:\n\n`
    
    data.vehicles.slice(0, 3).forEach(vehicle => {
      response += `🚗 **${vehicle.name}** (${vehicle.category})\n`
      response += `   • Seats: ${vehicle.capacity} passengers\n`
      response += `   • Price: LKR ${vehicle.pricePerDay.toLocaleString()}/day\n`
      response += `   • Features: ${vehicle.features?.join(', ') || 'Standard'}\n\n`
    })

    if (data.totalAvailable > 3) {
      response += `...and ${data.totalAvailable - 3} more options available!`
    }

    return response
  }

  static formatTourPriceResponse(data: TourPriceResponse): string {
    let response = `📋 **Pricing for ${data.tourName}**\n\n`
    response += `👥 Group size: ${data.pax} person${data.pax > 1 ? 's' : ''}\n`
    response += `💰 Base price: LKR ${data.basePrice.toLocaleString()} per person\n`
    
    if (data.discount > 0) {
      response += `🎉 Group discount: ${data.discount}% (Save LKR ${data.discountAmount.toLocaleString()}!)\n`
    }
    
    if (data.seasonalPricing) {
      response += `📅 Peak season pricing applied\n`
    }
    
    response += `\n**Total: LKR ${data.totalPrice.toLocaleString()}**\n\n`
    
    if (data.includes.length > 0) {
      response += `✅ **Included:**\n`
      data.includes.forEach(item => {
        response += `   • ${item}\n`
      })
    }
    
    response += `\n*This quote is valid for 24 hours*`
    
    return response
  }

  static formatTourSearchResponse(data: { results: Tour[]; total: number }): string {
    if (data.results.length === 0) {
      return "I couldn't find any tours matching your criteria. Would you like me to show you our most popular tours instead?"
    }

    let response = `I found ${data.total} tour${data.total > 1 ? 's' : ''} for you! Here are the top options:\n\n`
    
    data.results.slice(0, 5).forEach((tour, index) => {
      response += `${index + 1}. **${tour.name}**\n`
      response += `   📍 Category: ${tour.category}\n`
      response += `   ⏱️ Duration: ${tour.duration}\n`
      response += `   💰 Price: LKR ${tour.pricePerPerson.toLocaleString()} per person\n`
      response += `   ⭐ Rating: ${tour.rating}/5\n`
      
      if (tour.highlights.length > 0) {
        response += `   ✨ Highlights: ${tour.highlights.slice(0, 2).join(', ')}\n`
      }
      response += '\n'
    })

    return response
  }
}