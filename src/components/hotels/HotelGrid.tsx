
import React from 'react'
import { useQuery } from '@tanstack/react-query'
import { dbService, authService, storageService } from '@/lib/firebase-services'
import HotelCard from './HotelCard'
import { Hotel, FilterOptions } from '@/types/hotel'
import { Loader2 } from 'lucide-react'

interface HotelGridProps {
  filters: FilterOptions
}

const HotelGrid: React.FC<HotelGridProps> = ({ filters }) => {
  const { data: hotels, isLoading, error } = useQuery({
    queryKey: ['hotels', filters],
    queryFn: async () => {
      let query = supabase
        .from('hotels')
        .select(`
          *,
          city:cities(*),
          images:hotel_images(*),
          reviews:hotel_reviews(id, hotel_id, rating, review_text, created_at, is_verified, guest_name),
          hotel_style:hotel_styles(*),
          hotel_category:hotel_categories(*),
          room_types(*)
        `)
        .eq('is_active', true)
        .eq('country', 'Sri Lanka')

      // Apply search query first
      if (filters.searchQuery && filters.searchQuery.trim()) {
        query = query.or(`name.ilike.%${filters.searchQuery}%,address.ilike.%${filters.searchQuery}%,description.ilike.%${filters.searchQuery}%`)
      }

      // Apply other filters
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

      const { data, error } = await query.order('name', { ascending: true })

      if (error) {
        console.error('Error fetching hotels:', error)
        throw error
      }

      console.log(`Search query: "${filters.searchQuery}" returned ${data?.length || 0} hotels`)

      // Transform the data to match Hotel interface
      const hotelsWithRatings = data?.map(hotel => {
        const ratings = hotel.reviews?.map(r => r.rating) || []
        const average_rating = ratings.length > 0 
          ? ratings.reduce((sum, rating) => sum + rating, 0) / ratings.length 
          : 0

        const rooms = hotel.room_types?.map(roomType => ({
          id: roomType.id,
          hotel_id: roomType.hotel_id,
          room_type: roomType.name,
          room_number: undefined,
          max_occupancy: roomType.max_occupancy,
          base_price: roomType.price_per_night,
          is_available: roomType.is_active,
          created_at: new Date().toISOString()
        })) || []
        
        return {
          ...hotel,
          average_rating: Math.round(average_rating * 10) / 10,
          review_count: ratings.length,
          rooms
        } as Hotel
      }) || []

      return hotelsWithRatings
    }
  })

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-teal-600" />
        <span className="ml-2 text-gray-600">Searching Sri Lankan hotels...</span>
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-red-600">Error loading hotels. Please try again.</p>
        <p className="text-sm text-gray-500 mt-2">
          {error instanceof Error ? error.message : 'Unknown error occurred'}
        </p>
      </div>
    )
  }

  if (!hotels || hotels.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="max-w-md mx-auto">
          <h3 className="text-xl font-semibold text-gray-800 mb-2">No Sri Lankan hotels found</h3>
          <p className="text-gray-600 mb-4">
            {filters.searchQuery 
              ? `No hotels found for "${filters.searchQuery}" in Sri Lanka. Try different search terms.`
              : 'No hotels in Sri Lanka match your current search criteria. Try adjusting your filters.'
            }
          </p>
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <p className="text-sm text-blue-800">
              <strong>Tip:</strong> Clear your search or adjust filters to find more Sri Lankan hotels.
            </p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <p className="text-gray-600">
            {hotels.length} Sri Lankan hotel{hotels.length !== 1 ? 's' : ''} found
          </p>
          {filters.searchQuery && (
            <p className="text-sm text-gray-500 mt-1">
              Search results for "{filters.searchQuery}" in Sri Lanka
            </p>
          )}
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {hotels.map((hotel) => (
          <HotelCard key={hotel.id} hotel={hotel} />
        ))}
      </div>
      
      {hotels.length > 0 && (
        <div className="mt-8 text-center">
          <p className="text-sm text-gray-500">
            Showing {hotels.length} of {hotels.length} Sri Lankan hotels
          </p>
        </div>
      )}
    </div>
  )
}

export default HotelGrid
