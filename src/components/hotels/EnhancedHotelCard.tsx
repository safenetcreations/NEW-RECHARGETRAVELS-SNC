
import React from 'react'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Hotel } from '@/types/hotel'
import { Star, MapPin, Wifi, Car, Utensils, Waves, Calendar, Users } from 'lucide-react'
import { Link } from 'react-router-dom'
import AIRecommendationBadge from './AIRecommendationBadge'
import AIScoreDisplay from './AIScoreDisplay'

interface EnhancedHotelCardProps {
  hotel: Hotel
}

const EnhancedHotelCard: React.FC<EnhancedHotelCardProps> = ({ hotel }) => {
  const primaryImage = hotel.images?.find(img => img.is_primary)?.image_url || 
                      hotel.images?.[0]?.image_url || 
                      'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=400&h=300&fit=crop'

  const getStarArray = (rating: number) => {
    return Array.from({ length: 5 }, (_, index) => index < rating)
  }

  const getHotelTypeColor = (type?: string) => {
    switch (type) {
      case 'luxury_resort': return 'bg-purple-100 text-purple-800'
      case 'boutique': return 'bg-pink-100 text-pink-800'
      case 'middle_range': return 'bg-blue-100 text-blue-800'
      case 'budget': return 'bg-green-100 text-green-800'
      case 'cabana': return 'bg-orange-100 text-orange-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getAmenityIcon = (amenity: string) => {
    const lowerAmenity = amenity.toLowerCase()
    if (lowerAmenity.includes('wifi')) return <Wifi className="h-4 w-4" />
    if (lowerAmenity.includes('parking')) return <Car className="h-4 w-4" />
    if (lowerAmenity.includes('restaurant')) return <Utensils className="h-4 w-4" />
    if (lowerAmenity.includes('pool')) return <Waves className="h-4 w-4" />
    return null
  }

  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow duration-300">
      <div className="relative h-48 bg-gray-200">
        <img 
          src={primaryImage} 
          alt={hotel.name}
          className="w-full h-full object-cover"
          onError={(e) => {
            e.currentTarget.src = 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=400&h=300&fit=crop'
          }}
        />
        
        {/* AI Recommendation Badge */}
        {hotel.ai_recommendation_score && hotel.ai_recommendation_score > 0.7 && (
          <div className="absolute top-2 left-2">
            <AIRecommendationBadge 
              score={hotel.ai_recommendation_score}
              size="sm"
            />
          </div>
        )}
        
        {/* Hotel Type Badge */}
        {hotel.hotel_type && (
          <Badge className={`absolute top-2 right-2 ${getHotelTypeColor(hotel.hotel_type)}`}>
            {hotel.hotel_type.replace('_', ' ').toUpperCase()}
          </Badge>
        )}
      </div>

      <CardHeader className="pb-3">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 line-clamp-1">
              {hotel.name}
            </h3>
            <div className="flex items-center gap-1 mt-1">
              <MapPin className="h-4 w-4 text-gray-500" />
              <span className="text-sm text-gray-600">
                {hotel.city?.name || 'Location'}, {hotel.country || 'Sri Lanka'}
              </span>
            </div>
          </div>
          
          {hotel.star_rating && (
            <div className="flex items-center gap-1 ml-2">
              {getStarArray(hotel.star_rating).map((filled, index) => (
                <Star
                  key={index}
                  className={`h-4 w-4 ${filled ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
                />
              ))}
            </div>
          )}
        </div>
      </CardHeader>

      <CardContent className="pt-0">
        {hotel.description && (
          <p className="text-sm text-gray-600 mb-3 line-clamp-2">
            {hotel.description}
          </p>
        )}

        {/* AI Score Display */}
        {hotel.ai_recommendation_score && hotel.ai_recommendation_score > 0.5 && (
          <div className="mb-3">
            <AIScoreDisplay 
              score={hotel.ai_recommendation_score}
              showProgress={true}
              compact={false}
            />
          </div>
        )}

        {/* Amenities */}
        {hotel.amenities && hotel.amenities.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-3">
            {hotel.amenities.slice(0, 4).map((amenity, index) => (
              <div key={index} className="flex items-center gap-1 text-xs text-gray-600">
                {getAmenityIcon(amenity)}
                <span>{amenity}</span>
              </div>
            ))}
            {hotel.amenities.length > 4 && (
              <span className="text-xs text-gray-500">
                +{hotel.amenities.length - 4} more
              </span>
            )}
          </div>
        )}

        {/* Room info */}
        <div className="flex items-center gap-4 mb-3 text-sm text-gray-600">
          {hotel.total_rooms && (
            <div className="flex items-center gap-1">
              <Calendar className="h-4 w-4" />
              <span>{hotel.total_rooms} rooms</span>
            </div>
          )}
          {hotel.available_rooms && (
            <div className="flex items-center gap-1">
              <Users className="h-4 w-4" />
              <span>{hotel.available_rooms} available</span>
            </div>
          )}
        </div>

        {/* Reviews */}
        {hotel.average_rating && hotel.review_count && (
          <div className="flex items-center gap-2 mb-3">
            <div className="flex items-center gap-1">
              <Star className="h-4 w-4 text-yellow-400 fill-current" />
              <span className="font-medium">{hotel.average_rating.toFixed(1)}</span>
            </div>
            <span className="text-sm text-gray-600">
              ({hotel.review_count} review{hotel.review_count !== 1 ? 's' : ''})
            </span>
          </div>
        )}

        {/* Pricing */}
        <div className="flex justify-between items-center">
          <div>
            {hotel.base_price_per_night ? (
              <div>
                <span className="text-2xl font-bold text-teal-600">
                  ${hotel.base_price_per_night}
                </span>
                <span className="text-sm text-gray-600 ml-1">per night</span>
              </div>
            ) : hotel.price_range_min && hotel.price_range_max ? (
              <div>
                <span className="text-lg font-semibold text-teal-600">
                  ${hotel.price_range_min} - ${hotel.price_range_max}
                </span>
                <span className="text-sm text-gray-600 ml-1">per night</span>
              </div>
            ) : (
              <span className="text-gray-500">Price on request</span>
            )}
          </div>
          
          <Link to={`/hotels/${hotel.id}`}>
            <Button className="bg-teal-600 hover:bg-teal-700">
              View Details
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  )
}

export default EnhancedHotelCard
