
import React from 'react'
import { useQuery } from '@tanstack/react-query'
import { dbService, authService, storageService } from '@/lib/firebase-services'
import EnhancedHotelCard from './EnhancedHotelCard'
import { Hotel, FilterOptions } from '@/types/hotel'
import { Loader2, SlidersHorizontal } from 'lucide-react'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Button } from '@/components/ui/button'

interface EnhancedHotelGridProps {
  filters: FilterOptions
  sortBy?: string
  onSortChange?: (sort: string) => void
}

const EnhancedHotelGrid: React.FC<EnhancedHotelGridProps> = ({ 
  filters, 
  sortBy = 'name', 
  onSortChange 
}) => {
  const { data: hotels, isLoading, error } = useQuery({
    queryKey: ['enhanced-hotels', filters, sortBy],
    queryFn: async () => {
      let query = supabase
        .from('hotels')
        .select(`
          *,
          city:cities(*),
          images:hotel_images(*),
          reviews:hotel_reviews(id, hotel_id, rating, review_text, title, created_at, is_verified, guest_name),
          hotel_style:hotel_styles(*),
          hotel_category:hotel_categories(*),
          rooms:hotel_rooms(*),
          room_types(*)
        `)
        .eq('is_active', true)

      // Apply filters
      if (filters.starRating.length > 0) {
        query = query.in('star_rating', filters.starRating)
      }

      if (filters.hotelType.length > 0) {
        query = query.in('hotel_type', filters.hotelType)
      }

      if (filters.categoryId && filters.categoryId !== 'all') {
        query = query.eq('category_id', filters.categoryId)
      }

      if (filters.cityId && filters.cityId !== 'all') {
        query = query.eq('city_id', filters.cityId)
      }

      if (filters.priceRange[0] > 0 || filters.priceRange[1] < 1000) {
        query = query
          .gte('base_price_per_night', filters.priceRange[0])
          .lte('base_price_per_night', filters.priceRange[1])
      }

      if (filters.amenities.length > 0) {
        query = query.overlaps('amenities', filters.amenities)
      }

      if (filters.searchQuery) {
        query = query.ilike('name', `%${filters.searchQuery}%`)
      }

      // Apply sorting
      switch (sortBy) {
        case 'price_low':
          query = query.order('base_price_per_night', { ascending: true })
          break
        case 'price_high':
          query = query.order('base_price_per_night', { ascending: false })
          break
        case 'rating':
          query = query.order('ai_recommendation_score', { ascending: false })
          break
        case 'star_rating':
          query = query.order('star_rating', { ascending: false })
          break
        case 'newest':
          query = query.order('created_at', { ascending: false })
          break
        default:
          query = query.order('name', { ascending: true })
      }

      const { data, error } = await query

      if (error) throw error

      // Calculate average ratings and ensure proper typing
      const hotelsWithRatings = data?.map(hotel => {
        const ratings = hotel.reviews?.map(r => r.rating) || []
        const average_rating = ratings.length > 0 
          ? ratings.reduce((sum, rating) => sum + rating, 0) / ratings.length 
          : 0
        
        return {
          ...hotel,
          average_rating: Math.round(average_rating * 10) / 10,
          review_count: ratings.length
        } as Hotel
      }) || []

      return hotelsWithRatings
    }
  })

  const sortOptions = [
    { value: 'name', label: 'Name (A-Z)' },
    { value: 'price_low', label: 'Price (Low to High)' },
    { value: 'price_high', label: 'Price (High to Low)' },
    { value: 'rating', label: 'AI Recommendation' },
    { value: 'star_rating', label: 'Star Rating' },
    { value: 'newest', label: 'Newest First' }
  ]

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-teal-green" />
        <span className="ml-2 text-gray-600">Loading hotels...</span>
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-red-600">Error loading hotels. Please try again.</p>
      </div>
    )
  }

  if (!hotels || hotels.length === 0) {
    return (
      <div className="text-center py-12">
        <SlidersHorizontal className="h-12 w-12 text-gray-400 mx-auto mb-4" />
        <p className="text-gray-600 text-lg mb-2">No hotels found</p>
        <p className="text-gray-500">Try adjusting your filters to see more results.</p>
      </div>
    )
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <p className="text-gray-600">
          {hotels.length} hotel{hotels.length !== 1 ? 's' : ''} found
        </p>
        
        {onSortChange && (
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600">Sort by:</span>
            <Select value={sortBy} onValueChange={onSortChange}>
              <SelectTrigger className="w-48">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {sortOptions.map(option => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {hotels.map((hotel) => (
          <EnhancedHotelCard key={hotel.id} hotel={hotel} />
        ))}
      </div>
    </div>
  )
}

export default EnhancedHotelGrid
