
import React from 'react'
import { MapPin, Sparkles } from 'lucide-react'
import StarRating from './StarRating'

interface Hotel {
  id: string
  name: string
  description?: string
  star_rating?: number
  hotel_type?: string
  location?: string
  city?: string
  amenities?: string[]
  ai_recommendation_score?: number
  room_types?: Array<{
    price_per_night: number
  }>
  images?: string[]
  averageRating?: number
  reviewCount?: number
}

interface HotelSearchCardProps {
  hotel: Hotel
}

const HotelSearchCard: React.FC<HotelSearchCardProps> = ({ hotel }) => {
  const hotelTypes = [
    { value: 'luxury_resort', label: 'Luxury Resort' },
    { value: 'cabana', label: 'Cabana' },
    { value: 'budget', label: 'Budget Hotel' },
    { value: 'middle_range', label: 'Mid-Range Hotel' },
    { value: 'boutique', label: 'Boutique Hotel' }
  ]

  const minPrice = hotel.room_types && hotel.room_types.length > 0
    ? Math.min(...hotel.room_types.map(room => room.price_per_night))
    : 0

  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
      <div className="relative">
        <img 
          src={hotel.images?.[0] || '/placeholder-hotel.jpg'} 
          alt={hotel.name}
          className="w-full h-48 object-cover"
        />
        <div className="absolute top-4 left-4">
          <span className="bg-blue-600 text-white px-3 py-1 rounded-full text-sm font-medium">
            {hotelTypes.find(type => type.value === hotel.hotel_type)?.label || 'Hotel'}
          </span>
        </div>
        {hotel.ai_recommendation_score && hotel.ai_recommendation_score > 0.8 && (
          <div className="absolute top-4 right-4">
            <div className="bg-purple-600 text-white px-2 py-1 rounded-full text-xs flex items-center">
              <Sparkles className="w-3 h-3 mr-1" />
              AI Pick
            </div>
          </div>
        )}
      </div>
      
      <div className="p-6">
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-xl font-bold text-gray-900">{hotel.name}</h3>
          {hotel.star_rating && <StarRating rating={hotel.star_rating} />}
        </div>
        
        <div className="flex items-center text-gray-600 mb-2">
          <MapPin className="w-4 h-4 mr-1" />
          <span className="text-sm">{hotel.location}, {hotel.city}</span>
        </div>
        
        {hotel.description && (
          <p className="text-gray-700 text-sm mb-4 line-clamp-2">{hotel.description}</p>
        )}
        
        {hotel.amenities && hotel.amenities.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {hotel.amenities.slice(0, 4).map((amenity, index) => (
              <span key={index} className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs">
                {amenity}
              </span>
            ))}
            {hotel.amenities.length > 4 && (
              <span className="text-gray-500 text-xs">+{hotel.amenities.length - 4} more</span>
            )}
          </div>
        )}
        
        <div className="flex justify-between items-center">
          <div>
            <span className="text-2xl font-bold text-blue-600">${minPrice}</span>
            <span className="text-gray-600 text-sm">/night</span>
          </div>
          
          <div className="flex gap-2">
            <button className="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors">
              View Details
            </button>
            <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
              Book Now
            </button>
          </div>
        </div>
        
        {hotel.averageRating && hotel.averageRating > 0 && (
          <div className="mt-3 pt-3 border-t border-gray-200">
            <div className="flex items-center justify-between">
              <StarRating rating={hotel.averageRating} />
              <span className="text-sm text-gray-600">{hotel.reviewCount} reviews</span>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default HotelSearchCard
