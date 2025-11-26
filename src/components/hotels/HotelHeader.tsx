
import React from 'react'
import { MapPin } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import StarRating from '@/components/hotels/StarRating'
import { Hotel } from '@/types/hotel'

interface HotelHeaderProps {
  hotel: Hotel
}

const HotelHeader: React.FC<HotelHeaderProps> = ({ hotel }) => {
  return (
    <Card className="mb-6">
      <CardContent className="p-6">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">{hotel.name}</h1>
            <div className="flex items-center text-gray-600 mb-2">
              <MapPin className="w-5 h-5 mr-2" />
              <span>{hotel.address || `${hotel.city?.name}, ${hotel.country}`}</span>
            </div>
            <StarRating rating={hotel.star_rating || 0} size="md" />
          </div>
          <div className="text-right">
            <div className="text-3xl font-bold text-blue-600">${hotel.base_price_per_night}</div>
            <div className="text-gray-600">per night</div>
          </div>
        </div>
        
        <p className="text-gray-700 leading-relaxed">{hotel.description}</p>
      </CardContent>
    </Card>
  )
}

export default HotelHeader
