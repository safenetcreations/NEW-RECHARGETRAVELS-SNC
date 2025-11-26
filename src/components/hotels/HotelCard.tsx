import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { MapPin, Star, Users, Wifi, Car } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Hotel } from '@/types/hotel'
import LivePriceIndicator from './LivePriceIndicator'
import { Link } from 'react-router-dom'

interface HotelCardProps {
  hotel: Hotel
}

const HotelCard: React.FC<HotelCardProps> = ({ hotel }) => {
  // Safely handle hotel data
  const hotelName = hotel.name || 'Unknown Hotel'
  const hotelPrice = hotel.base_price_per_night || 0
  const hotelRating = hotel.star_rating || 0
  const hotelLocation = hotel.city?.name || hotel.address || 'Sri Lanka'
  const hotelAmenities = hotel.amenities || []
  
  // Improved image handling with multiple fallbacks
  let hotelImage = 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=400&h=300&fit=crop'
  
  if (hotel.images && hotel.images.length > 0) {
    const primaryImage = hotel.images.find(img => img.is_primary)
    if (primaryImage && primaryImage.image_url) {
      hotelImage = primaryImage.image_url
    } else if (hotel.images[0] && hotel.images[0].image_url) {
      hotelImage = hotel.images[0].image_url
    }
  }
  
  const averageRating = hotel.average_rating || 0
  const reviewCount = hotel.review_count || 0

  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    console.log('Image failed to load, using fallback:', hotelImage)
    const fallbackImages = [
      'https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?w=400&h=300&fit=crop',
      'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=400&h=300&fit=crop',
      'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=400&h=300&fit=crop'
    ]
    const randomFallback = fallbackImages[Math.floor(Math.random() * fallbackImages.length)]
    e.currentTarget.src = randomFallback
  }

  const handleViewDetails = () => {
    console.log('View Details clicked for hotel:', hotel.id, hotel.name)
  }

  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer">
      <div className="aspect-video overflow-hidden">
        <img 
          src={hotelImage} 
          alt={hotelName}
          className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
          onError={handleImageError}
        />
      </div>
      
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <CardTitle className="text-lg font-bold text-gray-900 line-clamp-2">
            {hotelName}
          </CardTitle>
          {hotelRating > 0 && (
            <div className="flex items-center gap-1 ml-2 shrink-0">
              {[...Array(hotelRating)].map((_, i) => (
                <Star key={i} className="h-4 w-4 text-yellow-400 fill-current" />
              ))}
            </div>
          )}
        </div>
        
        <div className="flex items-center text-gray-600 text-sm">
          <MapPin className="h-4 w-4 mr-1" />
          {hotelLocation}
        </div>
      </CardHeader>
      
      <CardContent className="pt-0">
        {/* Amenities */}
        {hotelAmenities.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-3">
            {hotelAmenities.slice(0, 3).map((amenity: string, index: number) => (
              <Badge key={index} variant="secondary" className="text-xs">
                {amenity}
              </Badge>
            ))}
            {hotelAmenities.length > 3 && (
              <Badge variant="outline" className="text-xs">
                +{hotelAmenities.length - 3} more
              </Badge>
            )}
          </div>
        )}

        {/* Reviews */}
        {reviewCount > 0 && (
          <div className="flex items-center gap-2 mb-3">
            <div className="flex items-center">
              <Star className="h-4 w-4 text-yellow-400 fill-current mr-1" />
              <span className="text-sm font-medium">{averageRating.toFixed(1)}</span>
            </div>
            <span className="text-sm text-gray-600">({reviewCount} reviews)</span>
          </div>
        )}
        
        <div className="flex items-center justify-between">
          <div>
            <LivePriceIndicator currentPrice={hotelPrice} hotelId={hotel.id} />
            <span className="text-sm text-gray-600 ml-1">per night</span>
          </div>
          
          <Link to={`/hotels/${hotel.id}`} onClick={handleViewDetails}>
            <Button size="sm">
              View Details
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  )
}

export default HotelCard
