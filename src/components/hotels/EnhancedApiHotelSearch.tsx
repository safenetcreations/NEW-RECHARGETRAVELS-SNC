
import React, { useState, useEffect, useRef } from 'react'
import { Search, Filter, Sparkles, Grid, List, TrendingUp } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useHotelFilterApi } from '@/hooks/useHotelFilterApi'
import { FilterOptions } from '@/types/hotel'
import HotelCard from './HotelCard'
import { toast } from 'sonner'

interface EnhancedApiHotelSearchProps {
  initialSearchQuery?: string
  cityId?: string
}

const EnhancedApiHotelSearch: React.FC<EnhancedApiHotelSearchProps> = ({
  initialSearchQuery = '',
  cityId
}) => {
  const [searchQuery, setSearchQuery] = useState(initialSearchQuery)
  const [searchSuggestions, setSearchSuggestions] = useState<any[]>([])
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [currentPage, setCurrentPage] = useState(1)
  const [sortBy, setSortBy] = useState('relevance')
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc')
  const searchInputRef = useRef<HTMLInputElement>(null)

  const [filters, setFilters] = useState<FilterOptions>({
    starRating: [],
    hotelType: [],
    priceRange: [0, 1000],
    amenities: [],
    cityId: cityId || '',
    searchQuery: initialSearchQuery
  })

  const {
    filterOptions,
    isLoadingOptions,
    filterResponse,
    isLoadingHotels,
    filterHotels,
    getSearchSuggestions,
    hotels,
    totalCount,
    suggestions
  } = useHotelFilterApi()

  // Trigger search when filters change
  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      filterHotels(filters, sortBy, sortOrder, currentPage, 20)
    }, 500)

    return () => clearTimeout(debounceTimer)
  }, [filters, sortBy, sortOrder, currentPage])

  // Handle search query changes with suggestions
  useEffect(() => {
    if (searchQuery.length > 2) {
      const getSuggestions = async () => {
        try {
          const response = await getSearchSuggestions(searchQuery)
          setSearchSuggestions(response.suggestions)
          setShowSuggestions(true)
        } catch (error) {
          console.error('Error getting suggestions:', error)
        }
      }
      getSuggestions()
    } else {
      setSearchSuggestions([])
      setShowSuggestions(false)
    }
  }, [searchQuery])

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setFilters(prev => ({ ...prev, searchQuery }))
    setShowSuggestions(false)
    setCurrentPage(1)
  }

  const handleSuggestionClick = (suggestion: any) => {
    setSearchQuery(suggestion.label)
    setFilters(prev => ({ ...prev, searchQuery: suggestion.label }))
    setShowSuggestions(false)
    setCurrentPage(1)
  }

  const handleFilterChange = (newFilters: Partial<FilterOptions>) => {
    setFilters(prev => ({ ...prev, ...newFilters }))
    setCurrentPage(1)
  }

  const handleSortChange = (newSortBy: string) => {
    setSortBy(newSortBy)
    setCurrentPage(1)
  }

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage)
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Search Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Find Your Perfect Stay</h1>
        
        <form onSubmit={handleSearchSubmit} className="relative">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <Input
                ref={searchInputRef}
                type="text"
                placeholder="Search hotels, locations, or amenities..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 h-12"
              />
              
              {/* Search Suggestions */}
              {showSuggestions && searchSuggestions.length > 0 && (
                <div className="absolute top-full left-0 right-0 bg-white border border-gray-200 rounded-md shadow-lg z-10 mt-1">
                  {searchSuggestions.map((suggestion, index) => (
                    <button
                      key={index}
                      type="button"
                      onClick={() => handleSuggestionClick(suggestion)}
                      className="w-full text-left px-4 py-2 hover:bg-gray-50 flex items-center gap-2"
                    >
                      <Badge variant="outline" className="text-xs">
                        {suggestion.type}
                      </Badge>
                      <span>{suggestion.label}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
            
            <div className="flex gap-2">
              <Button type="submit" className="h-12 px-6">
                Search
              </Button>
              <Button
                type="button"
                variant="outline"
                className="h-12 px-6"
                onClick={() => toast.info('Advanced filters coming soon!')}
              >
                <Filter className="w-4 h-4 mr-2" />
                Filters
              </Button>
            </div>
          </div>
        </form>
      </div>

      {/* Results Header */}
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-4">
          <h2 className="text-xl font-semibold">
            {isLoadingHotels ? 'Searching...' : `${totalCount} hotels found`}
          </h2>
          
          {suggestions && (
            <div className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-purple-600" />
              <span className="text-sm text-gray-600">AI-powered results</span>
            </div>
          )}
        </div>

        <div className="flex items-center gap-4">
          {/* Sort Controls */}
          <Select value={sortBy} onValueChange={handleSortChange}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="relevance">Relevance</SelectItem>
              <SelectItem value="price">Price</SelectItem>
              <SelectItem value="rating">Star Rating</SelectItem>
              <SelectItem value="review_score">Review Score</SelectItem>
              <SelectItem value="ai_score">AI Score</SelectItem>
            </SelectContent>
          </Select>

          {/* View Mode */}
          <div className="flex items-center gap-2">
            <Button
              variant={viewMode === 'grid' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setViewMode('grid')}
            >
              <Grid className="w-4 h-4" />
            </Button>
            <Button
              variant={viewMode === 'list' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setViewMode('list')}
            >
              <List className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Filter Suggestions */}
      {suggestions && (
        <div className="mb-6 space-y-4">
          {suggestions.price_ranges.length > 0 && (
            <div>
              <h3 className="text-sm font-medium text-gray-700 mb-2">Popular Price Ranges</h3>
              <div className="flex flex-wrap gap-2">
                {suggestions.price_ranges.map((range, index) => (
                  <Button
                    key={index}
                    variant="outline"
                    size="sm"
                    onClick={() => handleFilterChange({ priceRange: range.range as [number, number] })}
                  >
                    {range.label} ({range.count})
                  </Button>
                ))}
              </div>
            </div>
          )}

          {suggestions.popular_amenities.length > 0 && (
            <div>
              <h3 className="text-sm font-medium text-gray-700 mb-2">Popular Amenities</h3>
              <div className="flex flex-wrap gap-2">
                {suggestions.popular_amenities.slice(0, 8).map((amenity, index) => (
                  <Button
                    key={index}
                    variant="outline"
                    size="sm"
                    onClick={() => handleFilterChange({ 
                      amenities: [...filters.amenities, amenity.name] 
                    })}
                  >
                    {amenity.name} ({amenity.count})
                  </Button>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Loading State */}
      {isLoadingHotels && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="animate-pulse">
              <div className="bg-gray-200 rounded-lg h-64"></div>
            </div>
          ))}
        </div>
      )}

      {/* Results Grid */}
      {!isLoadingHotels && hotels.length > 0 && (
        <div className={`grid gap-6 ${
          viewMode === 'grid' 
            ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' 
            : 'grid-cols-1'
        }`}>
          {hotels.map((hotel) => (
            <div key={hotel.id} className="relative">
              <HotelCard hotel={hotel} />
              
              {/* AI Score Badge */}
              {hotel.ai_recommendation_score && (
                <div className="absolute top-3 right-3 bg-purple-600 text-white px-2 py-1 rounded-full text-xs font-semibold">
                  {Math.round(hotel.ai_recommendation_score * 100)}% AI Match
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* No Results */}
      {!isLoadingHotels && hotels.length === 0 && (
        <Card className="p-8 text-center">
          <CardContent>
            <h3 className="text-lg font-semibold mb-2">No hotels found</h3>
            <p className="text-gray-600">
              Try adjusting your search criteria or filters to find more results.
            </p>
          </CardContent>
        </Card>
      )}

      {/* Pagination */}
      {!isLoadingHotels && totalCount > 20 && (
        <div className="mt-8 flex justify-center">
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
            >
              Previous
            </Button>
            
            <span className="text-sm text-gray-600">
              Page {currentPage} of {Math.ceil(totalCount / 20)}
            </span>
            
            <Button
              variant="outline"
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage >= Math.ceil(totalCount / 20)}
            >
              Next
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}

export default EnhancedApiHotelSearch
