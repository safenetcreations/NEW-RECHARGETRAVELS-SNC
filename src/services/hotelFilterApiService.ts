
interface FilterRequest {
  filters: {
    priceRange?: [number, number]
    starRating?: number[]
    hotelTypes?: string[]
    amenities?: string[]
    locations?: string[]
    reviewRating?: number
    distanceFromCenter?: number
    roomTypes?: string[]
    propertyFeatures?: string[]
    accessibility?: string[]
    policies?: string[]
  }
  sortBy?: string
  sortOrder?: 'asc' | 'desc'
  page?: number
  limit?: number
}

interface FilterResponse {
  hotels: any[]
  total_count: number
  page: number
  limit: number
  total_pages: number
  filters_applied: any
  sort_by: string
  sort_order: string
  suggestions: {
    price_ranges: Array<{ label: string; range: [number, number]; count: number }>
    popular_amenities: Array<{ name: string; count: number }>
    nearby_locations: any[]
    alternative_dates: any[]
  }
}

interface FilterOptions {
  star_ratings: number[]
  hotel_types: Array<{ value: string; label: string; count: number }>
  amenities: Array<{ value: string; label: string; count: number }>
  price_ranges: Array<{ label: string; min: number; max: number; count: number }>
  locations: Array<{ value: string; label: string; count: number }>
}

interface SearchSuggestion {
  type: 'location' | 'hotel' | 'amenity'
  value: string
  label: string
}

interface SearchSuggestionsResponse {
  suggestions: SearchSuggestion[]
  query: string
}

class HotelFilterApiService {
  private baseUrl: string

  constructor(baseUrl: string = 'http://localhost:5001') {
    this.baseUrl = baseUrl
  }

  async filterHotels(request: FilterRequest): Promise<FilterResponse> {
    try {
      const response = await fetch(`${this.baseUrl}/api/hotels/filter`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(request),
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      return await response.json()
    } catch (error) {
      console.error('Error filtering hotels:', error)
      throw error
    }
  }

  async getFilterOptions(): Promise<FilterOptions> {
    try {
      const response = await fetch(`${this.baseUrl}/api/hotels/filter-options`)

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      return await response.json()
    } catch (error) {
      console.error('Error fetching filter options:', error)
      throw error
    }
  }

  async getSearchSuggestions(query: string, type: string = 'all'): Promise<SearchSuggestionsResponse> {
    try {
      const params = new URLSearchParams({
        q: query,
        type: type
      })

      const response = await fetch(`${this.baseUrl}/api/hotels/search-suggestions?${params}`)

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      return await response.json()
    } catch (error) {
      console.error('Error fetching search suggestions:', error)
      throw error
    }
  }
}

export const hotelFilterApiService = new HotelFilterApiService()
export type { FilterRequest, FilterResponse, FilterOptions, SearchSuggestion, SearchSuggestionsResponse }
