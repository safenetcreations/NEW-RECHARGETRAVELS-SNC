
import { useState, useEffect } from 'react'
import { useQuery } from '@tanstack/react-query'
import { hotelFilterApiService, FilterRequest, FilterResponse, FilterOptions } from '@/services/hotelFilterApiService'
import { FilterOptions as ReactFilterOptions } from '@/types/hotel'

// Transform our React filter format to the API format
const transformFiltersToApi = (filters: ReactFilterOptions): FilterRequest['filters'] => {
  return {
    priceRange: filters.priceRange,
    starRating: filters.starRating,
    hotelTypes: filters.hotelType,
    amenities: filters.amenities,
    locations: filters.searchQuery ? [filters.searchQuery] : undefined,
  }
}

export const useHotelFilterApi = () => {
  const [lastFilterRequest, setLastFilterRequest] = useState<FilterRequest | null>(null)

  // Get filter options from the API
  const { data: filterOptions, isLoading: isLoadingOptions } = useQuery({
    queryKey: ['hotel-filter-options-api'],
    queryFn: () => hotelFilterApiService.getFilterOptions(),
    staleTime: 5 * 60 * 1000, // 5 minutes
  })

  // Filter hotels using the API
  const { 
    data: filterResponse, 
    isLoading: isLoadingHotels, 
    refetch: refetchHotels 
  } = useQuery({
    queryKey: ['hotel-filter-api', lastFilterRequest],
    queryFn: () => hotelFilterApiService.filterHotels(lastFilterRequest!),
    enabled: !!lastFilterRequest,
    staleTime: 2 * 60 * 1000, // 2 minutes
  })

  const filterHotels = (
    filters: ReactFilterOptions, 
    sortBy: string = 'relevance',
    sortOrder: 'asc' | 'desc' = 'desc',
    page: number = 1,
    limit: number = 20
  ) => {
    const apiFilters = transformFiltersToApi(filters)
    const request: FilterRequest = {
      filters: apiFilters,
      sortBy,
      sortOrder,
      page,
      limit
    }
    
    setLastFilterRequest(request)
  }

  const getSearchSuggestions = async (query: string, type: string = 'all') => {
    try {
      return await hotelFilterApiService.getSearchSuggestions(query, type)
    } catch (error) {
      console.error('Error getting search suggestions:', error)
      return { suggestions: [], query }
    }
  }

  return {
    filterOptions,
    isLoadingOptions,
    filterResponse,
    isLoadingHotels,
    filterHotels,
    refetchHotels,
    getSearchSuggestions,
    hotels: filterResponse?.hotels || [],
    totalCount: filterResponse?.total_count || 0,
    suggestions: filterResponse?.suggestions
  }
}
