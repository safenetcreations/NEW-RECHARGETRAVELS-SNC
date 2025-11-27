import React, { useState, useMemo } from 'react'
import { MapPin, Star, Heart, Wifi, Car, Utensils, Waves, Award, TrendingUp, Users } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { Checkbox } from '@/components/ui/checkbox'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Link } from 'react-router-dom'
import { Hotel } from '@/types/hotel'

interface HotelSearchFilters {
  location: string
  checkIn: Date | undefined
  checkOut: Date | undefined
  guests: {
    adults: number
    children: number
    rooms: number
  }
  priceRange: [number, number]
  starRating: number[]
  amenities: string[]
  hotelType: string[]
  sortBy: string
}

interface HotelListingProps {
  hotels: Hotel[]
  loading?: boolean
  filters: HotelSearchFilters
  onHotelSelect?: (hotel: Hotel) => void
  selectedHotels?: Hotel[]
  showComparison?: boolean
}

const HotelListing: React.FC<HotelListingProps> = ({
  hotels,
  loading = false,
  filters,
  onHotelSelect,
  selectedHotels = [],
  showComparison = false
}) => {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [favorites, setFavorites] = useState<Set<string>>(new Set())

  // Filter and sort hotels based on current filters
  const filteredAndSortedHotels = useMemo(() => {
    const filtered = hotels.filter(hotel => {
      // Location filter
      if (filters.location && !hotel.name?.toLowerCase().includes(filters.location.toLowerCase()) &&
          !hotel.city?.name?.toLowerCase().includes(filters.location.toLowerCase()) &&
          !hotel.address?.toLowerCase().includes(filters.location.toLowerCase())) {
        return false
      }

      // Price range filter
      const price = hotel.base_price_per_night || 0
      if (price < filters.priceRange[0] || price > filters.priceRange[1]) {
        return false
      }

      // Star rating filter
      if (filters.starRating.length > 0 && !filters.starRating.includes(hotel.star_rating || 0)) {
        return false
      }

      // Hotel type filter
      if (filters.hotelType.length > 0 && !filters.hotelType.includes(hotel.hotel_type || '')) {
        return false
      }

      // Amenities filter
      if (filters.amenities.length > 0) {
        const hotelAmenities = hotel.amenities || []
        const hasAllAmenities = filters.amenities.every(amenity =>
          hotelAmenities.some(hotelAmenity =>
            hotelAmenity.toLowerCase().includes(amenity.toLowerCase())
          )
        )
        if (!hasAllAmenities) return false
      }

      return true
    })

    // Sort hotels
    filtered.sort((a, b) => {
      switch (filters.sortBy) {
        case 'price_low':
          return (a.base_price_per_night || 0) - (b.base_price_per_night || 0)
        case 'price_high':
          return (b.base_price_per_night || 0) - (a.base_price_per_night || 0)
        case 'rating':
          return (b.average_rating || 0) - (a.average_rating || 0)
        case 'popularity':
          return (b.review_count || 0) - (a.review_count || 0)
        default:
          return 0
      }
    })

    return filtered
  }, [hotels, filters])

  const toggleFavorite = (hotelId: string) => {
    setFavorites(prev => {
      const newFavorites = new Set(prev)
      if (newFavorites.has(hotelId)) {
        newFavorites.delete(hotelId)
      } else {
        newFavorites.add(hotelId)
      }
      return newFavorites
    })
  }

  const getAmenityIcon = (amenity: string) => {
    const amenityLower = amenity.toLowerCase()
    if (amenityLower.includes('wifi')) return <Wifi className="h-4 w-4" />
    if (amenityLower.includes('parking')) return <Car className="h-4 w-4" />
    if (amenityLower.includes('restaurant')) return <Utensils className="h-4 w-4" />
    if (amenityLower.includes('pool')) return <Waves className="h-4 w-4" />
    return null
  }

  const HotelCard: React.FC<{ hotel: Hotel }> = ({ hotel }) => {
    const isSelected = selectedHotels.some(h => h.id === hotel.id)
    const isFavorite = favorites.has(hotel.id)

    const hotelImage = hotel.images?.[0]?.image_url ||
      'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=400&h=300&fit=crop'

    return (
      <Card className={`group relative overflow-hidden transition-all duration-300 hover:shadow-xl ${
        isSelected ? 'ring-2 ring-blue-500 shadow-lg' : ''
      }`}>
        {showComparison && (
          <div className="absolute top-3 left-3 z-10">
            <Checkbox
              checked={isSelected}
              onCheckedChange={() => onHotelSelect?.(hotel)}
              className="bg-white/90 backdrop-blur-sm"
            />
          </div>
        )}

        <button
          onClick={() => toggleFavorite(hotel.id)}
          className="absolute top-3 right-3 z-10 p-2 rounded-full bg-white/90 backdrop-blur-sm hover:bg-white transition-colors"
        >
          <Heart className={`h-4 w-4 ${isFavorite ? 'fill-red-500 text-red-500' : 'text-gray-600'}`} />
        </button>

        <div className="aspect-[4/3] overflow-hidden">
          <img
            src={hotelImage}
            alt={hotel.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            onError={(e) => {
              e.currentTarget.src = 'https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?w=400&h=300&fit=crop'
            }}
          />
          {hotel.average_rating && hotel.average_rating >= 9.0 && (
            <Badge className="absolute top-3 left-3 bg-green-600 text-white">
              <Award className="h-3 w-3 mr-1" />
              Exceptional
            </Badge>
          )}
        </div>

        <CardContent className="p-4">
          <div className="flex items-start justify-between mb-2">
            <h3 className="font-semibold text-lg line-clamp-2 group-hover:text-blue-600 transition-colors">
              {hotel.name}
            </h3>
            {hotel.star_rating && (
              <div className="flex items-center ml-2">
                {[...Array(hotel.star_rating)].map((_, i) => (
                  <Star key={i} className="h-4 w-4 text-yellow-400 fill-current" />
                ))}
              </div>
            )}
          </div>

          <div className="flex items-center text-gray-600 text-sm mb-3">
            <MapPin className="h-4 w-4 mr-1" />
            <span className="line-clamp-1">{hotel.city?.name || hotel.address || 'Sri Lanka'}</span>
          </div>

          {/* Amenities */}
          {hotel.amenities && hotel.amenities.length > 0 && (
            <div className="flex items-center gap-2 mb-3">
              {hotel.amenities.slice(0, 3).map((amenity, index) => {
                const icon = getAmenityIcon(amenity)
                return icon ? (
                  <div key={index} className="flex items-center text-gray-600" title={amenity}>
                    {icon}
                  </div>
                ) : null
              })}
              {hotel.amenities.length > 3 && (
                <span className="text-sm text-gray-500">+{hotel.amenities.length - 3} more</span>
              )}
            </div>
          )}

          {/* Rating and Reviews */}
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              {hotel.average_rating && (
                <>
                  <div className="flex items-center">
                    <Star className="h-4 w-4 text-yellow-400 fill-current mr-1" />
                    <span className="font-medium">{hotel.average_rating.toFixed(1)}</span>
                  </div>
                  {hotel.review_count && (
                    <span className="text-sm text-gray-600">({hotel.review_count})</span>
                  )}
                </>
              )}
            </div>

            {hotel.average_rating && hotel.average_rating >= 8.5 && (
              <Badge variant="secondary" className="text-xs">
                <TrendingUp className="h-3 w-3 mr-1" />
                Popular
              </Badge>
            )}
          </div>

          {/* Price and CTA */}
          <div className="flex items-center justify-between">
            <div>
              <div className="text-2xl font-bold text-gray-900">
                ${hotel.base_price_per_night || 'N/A'}
              </div>
              <div className="text-sm text-gray-600">per night</div>
            </div>

            <div className="flex gap-2">
              <Button variant="outline" size="sm" asChild>
                <Link to={`/hotels/${hotel.id}`}>View Details</Link>
              </Button>
              <Button size="sm" asChild>
                <Link to={`/hotels/${hotel.id}?book=true&hotel=${hotel.id}`}>Book Now</Link>
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (loading) {
    return (
      <div className="space-y-4">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="animate-pulse">
            <Card className="overflow-hidden">
              <div className="aspect-[4/3] bg-gray-200"></div>
              <CardContent className="p-4">
                <div className="h-4 bg-gray-200 rounded mb-2"></div>
                <div className="h-3 bg-gray-200 rounded mb-4 w-3/4"></div>
                <div className="flex justify-between items-center">
                  <div className="h-6 bg-gray-200 rounded w-20"></div>
                  <div className="h-8 bg-gray-200 rounded w-24"></div>
                </div>
              </CardContent>
            </Card>
          </div>
        ))}
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Results Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">
            {filteredAndSortedHotels.length} hotels found
          </h2>
          <p className="text-gray-600">
            {filters.location && `in ${filters.location}`}
            {filters.checkIn && filters.checkOut &&
              ` • ${Math.ceil((filters.checkOut.getTime() - filters.checkIn.getTime()) / (1000 * 60 * 60 * 24))} nights`
            }
          </p>
        </div>

        <div className="flex items-center gap-4">
          {/* View Mode Toggle */}
          <div className="flex border rounded-lg">
            <button
              onClick={() => setViewMode('grid')}
              className={`px-3 py-2 rounded-l-lg ${viewMode === 'grid' ? 'bg-blue-600 text-white' : 'text-gray-600'}`}
            >
              Grid
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`px-3 py-2 rounded-r-lg ${viewMode === 'list' ? 'bg-blue-600 text-white' : 'text-gray-600'}`}
            >
              List
            </button>
          </div>

          {/* Sort Dropdown */}
          <Select value={filters.sortBy} onValueChange={() => {}}>
            <SelectTrigger className="w-48">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="recommended">Recommended</SelectItem>
              <SelectItem value="price_low">Price: Low to High</SelectItem>
              <SelectItem value="price_high">Price: High to Low</SelectItem>
              <SelectItem value="rating">Highest Rated</SelectItem>
              <SelectItem value="popularity">Most Popular</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Hotel Grid/List */}
      {filteredAndSortedHotels.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">🏨</div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">No hotels found</h3>
          <p className="text-gray-600">Try adjusting your search criteria or location.</p>
        </div>
      ) : (
        <div className={
          viewMode === 'grid'
            ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'
            : 'space-y-4'
        }>
          {filteredAndSortedHotels.map((hotel) => (
            <HotelCard key={hotel.id} hotel={hotel} />
          ))}
        </div>
      )}

      {/* Comparison Bar */}
      {showComparison && selectedHotels.length > 0 && (
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t shadow-lg p-4">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <div className="flex items-center gap-4">
              <span className="font-medium">
                {selectedHotels.length} hotel{selectedHotels.length > 1 ? 's' : ''} selected
              </span>
              <div className="flex gap-2">
                {selectedHotels.map(hotel => (
                  <Badge key={hotel.id} variant="secondary" className="flex items-center gap-1">
                    {hotel.name}
                    <button
                      onClick={() => onHotelSelect?.(hotel)}
                      className="ml-1 hover:bg-gray-300 rounded-full p-0.5"
                    >
                      ×
                    </button>
                  </Badge>
                ))}
              </div>
            </div>
            <Button disabled={selectedHotels.length < 2} onClick={() => {
              // Navigate to comparison view
              window.location.href = '/hotels?compare=true'
            }}>
              Compare Hotels ({selectedHotels.length})
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}

export default HotelListing