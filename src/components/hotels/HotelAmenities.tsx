
import React from 'react'
import { Wifi, Car, Utensils, Dumbbell, Star } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

interface HotelAmenitiesProps {
  amenities: string[]
}

const HotelAmenities: React.FC<HotelAmenitiesProps> = ({ amenities }) => {
  const amenityIcons: Record<string, React.ComponentType<any>> = {
    'WiFi': Wifi,
    'Parking': Car,
    'Restaurant': Utensils,
    'Gym': Dumbbell,
  }

  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle>Amenities</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {amenities?.map((amenity, index) => {
            const IconComponent = amenityIcons[amenity] || Star
            return (
              <div key={index} className="flex items-center">
                <IconComponent className="w-5 h-5 text-blue-600 mr-3" />
                <span className="text-gray-700">{amenity}</span>
              </div>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}

export default HotelAmenities
