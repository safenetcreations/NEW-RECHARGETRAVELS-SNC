
import React, { useState, useEffect } from 'react'
import { Search, Filter, Sparkles, Grid, List } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useQuery } from '@tanstack/react-query'
import { dbService, authService, storageService } from '@/lib/firebase-services'
import { Hotel } from '@/types/hotel'
import { UserPreferences } from '@/types/aiRecommendation'
import HotelFilters from './HotelFilters'
import HotelGrid from './HotelGrid'
import AIRecommendedHotelsSection from './AIRecommendedHotelsSection'
import UserPreferencesForm from './UserPreferencesForm'

interface EnhancedHotelSearchProps {
  initialSearchQuery?: string
  cityId?: string
}

const EnhancedHotelSearch: React.FC<EnhancedHotelSearchProps> = ({
  initialSearchQuery = '',
  cityId
}) => {
  const [searchQuery, setSearchQuery] = useState(initialSearchQuery)
  const [filters, setFilters] = useState({
    starRating: [] as number[],
    hotelType: [] as string[],
    priceRange: [0, 500] as [number, number],
    amenities: [] as string[],
    cityId: cityId || '',
    searchQuery: initialSearchQuery
  })
  const [showFilters, setShowFilters] = useState(false)
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [userPreferences, setUserPreferences] = useState<UserPreferences | null>(null)
  const [showPreferencesForm, setShowPreferencesForm] = useState(false)
  const [guests] = useState({ adults: 2, children: 0 })

  // Update filters when searchQuery changes
  useEffect(() => {
    setFilters(prev => ({ ...prev, searchQuery }))
  }, [searchQuery])

  // Fetch Sri Lankan hotels with proper type conversion and error handling
  const { data: hotels = [], isLoading } = useQuery({
    queryKey: ['sri-lankan-hotels', searchQuery, filters, cityId],
    queryFn: async () => {
      let query = supabase
        .from('hotels')
        .select(`
          *,
          city:cities(id, name, country),
          images:hotel_images(*),
          reviews:hotel_reviews(*),
          room_types:hotel_room_types(*)
        `)
        .eq('is_active', true)
        .eq('country', 'Sri Lanka') // Only Sri Lankan hotels

      if (cityId) {
        query = query.eq('city_id', cityId)
      }

      if (searchQuery) {
        query = query.or(`name.ilike.%${searchQuery}%,description.ilike.%${searchQuery}%`)
      }

      if (filters.starRating.length > 0) {
        query = query.in('star_rating', filters.starRating)
      }

      if (filters.hotelType.length > 0) {
        query = query.in('hotel_type', filters.hotelType)
      }

      if (filters.priceRange[0] > 0 || filters.priceRange[1] < 500) {
        query = query
          .gte('base_price_per_night', filters.priceRange[0])
          .lte('base_price_per_night', filters.priceRange[1])
      }

      const { data, error } = await query

      if (error) throw error

      // Transform the data to match our Hotel type with proper error handling
      if (!data) return []

      return data.map(hotel => ({
        ...hotel,
        location: hotel.latitude && hotel.longitude ? {
          latitude: hotel.latitude,
          longitude: hotel.longitude
        } : undefined,
        room_types: Array.isArray(hotel.room_types) ? hotel.room_types.map((room: any) => ({
          ...room,
          amenities: Array.isArray(room.amenities) ? room.amenities : 
                    typeof room.amenities === 'string' ? JSON.parse(room.amenities) : [],
          images: Array.isArray(room.images) ? room.images : 
                 typeof room.images === 'string' ? JSON.parse(room.images) : []
        })) : [],
        average_rating: Array.isArray(hotel.reviews) && hotel.reviews.length > 0 
          ? hotel.reviews.reduce((sum: number, review: any) => sum + review.rating, 0) / hotel.reviews.length 
          : undefined,
        review_count: Array.isArray(hotel.reviews) ? hotel.reviews.length : 0
      })) as Hotel[]
    }
  })

  const handlePreferencesChange = (preferences: UserPreferences) => {
    setUserPreferences(preferences)
    setShowPreferencesForm(false)
  }

  const handleFiltersChange = (newFilters: Partial<typeof filters>) => {
    setFilters(prev => ({ ...prev, ...newFilters }))
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Search Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Find Your Perfect Sri Lankan Stay</h1>
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <Input
              type="text"
              placeholder="Search Sri Lankan hotels by name or location..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 h-12"
            />
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={() => setShowFilters(!showFilters)}
              className="h-12 px-6"
            >
              <Filter className="w-4 h-4 mr-2" />
              Filters
            </Button>
            <Button
              onClick={() => setShowPreferencesForm(true)}
              className="h-12 px-6 bg-purple-600 hover:bg-purple-700"
            >
              <Sparkles className="w-4 h-4 mr-2" />
              AI Preferences
            </Button>
          </div>
        </div>
      </div>

      {/* Filters Panel */}
      {showFilters && (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Filter Sri Lankan Hotels</CardTitle>
          </CardHeader>
          <CardContent>
            <HotelFilters
              filters={filters}
              onFilterChange={handleFiltersChange}
            />
          </CardContent>
        </Card>
      )}

      {/* User Preferences Form Modal */}
      {showPreferencesForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <UserPreferencesForm
            onPreferencesChange={handlePreferencesChange}
            onClose={() => setShowPreferencesForm(false)}
            guests={guests}
          />
        </div>
      )}

      {/* Main Content */}
      <Tabs defaultValue="ai-recommendations" className="w-full">
        <div className="flex justify-between items-center mb-6">
          <TabsList className="grid w-auto grid-cols-2">
            <TabsTrigger value="ai-recommendations" className="flex items-center gap-2">
              <Sparkles className="w-4 h-4" />
              AI Recommendations
            </TabsTrigger>
            <TabsTrigger value="all-results" className="flex items-center gap-2">
              <Search className="w-4 h-4" />
              All Results ({hotels.length})
            </TabsTrigger>
          </TabsList>

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

        <TabsContent value="ai-recommendations">
          <AIRecommendedHotelsSection
            hotels={hotels}
            guests={guests}
          />
        </TabsContent>

        <TabsContent value="all-results">
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="animate-pulse">
                  <div className="bg-gray-200 rounded-lg h-64"></div>
                </div>
              ))}
            </div>
          ) : (
            <HotelGrid filters={filters} />
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}

export default EnhancedHotelSearch
