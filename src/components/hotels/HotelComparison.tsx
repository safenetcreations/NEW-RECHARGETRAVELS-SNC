import React, { useState } from 'react'
import { Helmet } from 'react-helmet-async'
import {
  X, Star, MapPin, Wifi, Car, Utensils, Waves, Dumbbell,
  Shield, Award, Heart, Share2, CheckCircle, Users, Calendar
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { Hotel } from '@/types/hotel'

interface HotelComparisonProps {
  hotels: Hotel[]
  onRemoveHotel: (hotelId: string) => void
  onBookNow: (hotel: Hotel) => void
  onClose: () => void
}

const HotelComparison: React.FC<HotelComparisonProps> = ({
  hotels,
  onRemoveHotel,
  onBookNow,
  onClose
}) => {
  const [selectedRooms, setSelectedRooms] = useState<Record<string, any>>({})

  const getAmenityIcon = (amenity: string) => {
    const amenityLower = amenity.toLowerCase()
    if (amenityLower.includes('wifi')) return <Wifi className="h-4 w-4" />
    if (amenityLower.includes('parking') || amenityLower.includes('shuttle')) return <Car className="h-4 w-4" />
    if (amenityLower.includes('restaurant') || amenityLower.includes('breakfast')) return <Utensils className="h-4 w-4" />
    if (amenityLower.includes('pool')) return <Waves className="h-4 w-4" />
    if (amenityLower.includes('gym') || amenityLower.includes('fitness')) return <Dumbbell className="h-4 w-4" />
    if (amenityLower.includes('security') || amenityLower.includes('safe')) return <Shield className="h-4 w-4" />
    return <CheckCircle className="h-4 w-4" />
  }

  const comparisonData = [
    {
      label: 'Rating',
      key: 'rating',
      render: (hotel: Hotel) => (
        <div className="flex items-center justify-center">
          {hotel.star_rating && (
            <div className="flex items-center">
              {[...Array(hotel.star_rating)].map((_, i) => (
                <Star key={i} className="h-4 w-4 text-yellow-400 fill-current" />
              ))}
            </div>
          )}
          {hotel.average_rating && (
            <div className="flex items-center ml-2">
              <Star className="h-4 w-4 text-yellow-400 fill-current mr-1" />
              <span className="font-semibold">{hotel.average_rating.toFixed(1)}</span>
            </div>
          )}
        </div>
      )
    },
    {
      label: 'Price Range',
      key: 'price',
      render: (hotel: Hotel) => (
        <div className="text-center">
          <div className="text-lg font-bold text-green-600">
            ${hotel.base_price_per_night || 'N/A'}
          </div>
          <div className="text-sm text-gray-600">per night</div>
        </div>
      )
    },
    {
      label: 'Location',
      key: 'location',
      render: (hotel: Hotel) => (
        <div className="text-center text-sm">
          <div className="flex items-center justify-center mb-1">
            <MapPin className="h-4 w-4 text-gray-400 mr-1" />
          </div>
          <div>{hotel.city?.name || hotel.address || 'Sri Lanka'}</div>
        </div>
      )
    },
    {
      label: 'Amenities',
      key: 'amenities',
      render: (hotel: Hotel) => {
        const amenities = hotel.amenities || []
        return (
          <div className="space-y-2">
            {amenities.slice(0, 4).map((amenity, index) => (
              <div key={index} className="flex items-center text-xs">
                <span className="text-green-600 mr-2">
                  {getAmenityIcon(amenity)}
                </span>
                <span>{amenity}</span>
              </div>
            ))}
            {amenities.length > 4 && (
              <div className="text-xs text-gray-500">
                +{amenities.length - 4} more
              </div>
            )}
          </div>
        )
      }
    },
    {
      label: 'Reviews',
      key: 'reviews',
      render: (hotel: Hotel) => (
        <div className="text-center">
          <div className="text-lg font-semibold">
            {hotel.review_count || 0}
          </div>
          <div className="text-sm text-gray-600">reviews</div>
        </div>
      )
    }
  ]

  if (hotels.length === 0) {
    return (
      <div className="fixed inset-0 bg-gray-900/40 backdrop-blur-sm flex items-center justify-center z-50">
        <Card className="w-full max-w-md mx-4">
          <CardContent className="p-6 text-center">
            <h3 className="text-lg font-semibold mb-2">No Hotels to Compare</h3>
            <p className="text-gray-600 mb-4">Add hotels to your comparison list to see them side by side.</p>
            <Button onClick={onClose}>Close</Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <>
      <Helmet>
        <title>Compare Hotels - Recharge Travels</title>
        <meta name="description" content="Compare hotels side by side to find the perfect accommodation for your Sri Lankan journey." />
      </Helmet>

      <div className="fixed inset-0 bg-gray-900/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-lg w-full max-w-7xl max-h-[90vh] overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b">
            <h2 className="text-2xl font-bold">Compare Hotels</h2>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="h-6 w-6" />
            </Button>
          </div>

          {/* Comparison Grid */}
          <div className="overflow-x-auto">
            <div className="min-w-max">
              {/* Hotel Headers */}
              <div className="grid" style={{ gridTemplateColumns: `200px repeat(${hotels.length}, 1fr)` }}>
                <div className="p-4 border-b bg-gray-50"></div>
                {hotels.map((hotel) => (
                  <div key={hotel.id} className="p-4 border-b border-l bg-gray-50 relative">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="absolute top-2 right-2 h-6 w-6 p-0"
                      onClick={() => onRemoveHotel(hotel.id)}
                    >
                      <X className="h-4 w-4" />
                    </Button>

                    <div className="text-center">
                      <img
                        src={hotel.images?.[0]?.image_url || 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=200&h=150&fit=crop'}
                        alt={hotel.name}
                        className="w-32 h-24 object-cover rounded-lg mx-auto mb-3"
                      />
                      <h3 className="font-semibold text-sm mb-1">{hotel.name}</h3>
                      <div className="flex items-center justify-center mb-2">
                        {hotel.star_rating && (
                          <div className="flex">
                            {[...Array(hotel.star_rating)].map((_, i) => (
                              <Star key={i} className="h-3 w-3 text-yellow-400 fill-current" />
                            ))}
                          </div>
                        )}
                      </div>
                      <div className="text-lg font-bold text-green-600 mb-2">
                        ${hotel.base_price_per_night || 'N/A'}
                      </div>
                      <Button
                        size="sm"
                        className="w-full"
                        onClick={() => onBookNow(hotel)}
                      >
                        Book Now
                      </Button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Comparison Rows */}
              {comparisonData.map((item, index) => (
                <div
                  key={item.key}
                  className={`grid ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`}
                  style={{ gridTemplateColumns: `200px repeat(${hotels.length}, 1fr)` }}
                >
                  <div className="p-4 border-b font-semibold text-gray-700">
                    {item.label}
                  </div>
                  {hotels.map((hotel) => (
                    <div key={hotel.id} className="p-4 border-b border-l">
                      {item.render(hotel)}
                    </div>
                  ))}
                </div>
              ))}

              {/* Room Types Comparison */}
              <div className="grid bg-white" style={{ gridTemplateColumns: `200px repeat(${hotels.length}, 1fr)` }}>
                <div className="p-4 border-b font-semibold text-gray-700">
                  Room Types
                </div>
                {hotels.map((hotel) => (
                  <div key={hotel.id} className="p-4 border-b border-l">
                    <div className="space-y-2">
                      {/* Mock room types - in real app, this would come from hotel data */}
                      <div className="text-sm">
                        <div className="font-medium">Deluxe Room</div>
                        <div className="text-gray-600">$150/night</div>
                      </div>
                      <div className="text-sm">
                        <div className="font-medium">Suite</div>
                        <div className="text-gray-600">$280/night</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Action Buttons */}
              <div className="grid bg-gray-50" style={{ gridTemplateColumns: `200px repeat(${hotels.length}, 1fr)` }}>
                <div className="p-4 font-semibold text-gray-700">
                  Actions
                </div>
                {hotels.map((hotel) => (
                  <div key={hotel.id} className="p-4 border-l">
                    <div className="space-y-2">
                      <Button
                        size="sm"
                        variant="outline"
                        className="w-full"
                        onClick={() => onBookNow(hotel)}
                      >
                        Book Now
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        className="w-full"
                      >
                        <Heart className="h-4 w-4 mr-1" />
                        Save
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="p-6 border-t bg-gray-50">
            <div className="flex justify-between items-center">
              <div className="text-sm text-gray-600">
                Comparing {hotels.length} hotel{hotels.length !== 1 ? 's' : ''}
              </div>
              <div className="flex space-x-3">
                <Button variant="outline" onClick={onClose}>
                  Close Comparison
                </Button>
                <Button>
                  Book Selected Hotel
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default HotelComparison