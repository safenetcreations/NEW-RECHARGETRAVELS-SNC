import React, { useState } from 'react'
import { Helmet } from 'react-helmet-async'
import { Bed, Users, Wifi, Tv, Bath, Coffee, Wind, CheckCircle, Star, MapPin } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { Hotel } from '@/types/hotel'

interface RoomType {
  id: string
  name: string
  description: string
  maxOccupancy: number
  bedType: string
  roomSize: number
  pricePerNight: number
  amenities: string[]
  images: string[]
  availableCount: number
  isActive: boolean
  discountedPrice?: number
}

interface RoomSelectionProps {
  hotel: Hotel
  checkIn: Date
  checkOut: Date
  guests: { adults: number; children: number; rooms: number }
  onSelectRoom: (roomType: RoomType) => void
  onBack: () => void
}

const RoomSelection: React.FC<RoomSelectionProps> = ({
  hotel,
  checkIn,
  checkOut,
  guests,
  onSelectRoom,
  onBack
}) => {
  const [selectedRoom, setSelectedRoom] = useState<RoomType | null>(null)
  const [sortBy, setSortBy] = useState('price')

  // Mock room types - in real app, this would come from API
  const roomTypes: RoomType[] = [
    {
      id: '1',
      name: 'Standard Room',
      description: 'Comfortable room with basic amenities, perfect for budget travelers.',
      maxOccupancy: 2,
      bedType: 'Queen Bed',
      roomSize: 25,
      pricePerNight: hotel.base_price_per_night || 80,
      amenities: ['Free WiFi', 'TV', 'Air Conditioning', 'Private Bathroom'],
      images: ['https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=400&h=300&fit=crop'],
      availableCount: 8,
      isActive: true
    },
    {
      id: '2',
      name: 'Deluxe Room',
      description: 'Spacious room with premium amenities and city/ocean views.',
      maxOccupancy: 3,
      bedType: 'King Bed',
      roomSize: 35,
      pricePerNight: (hotel.base_price_per_night || 80) * 1.5,
      amenities: ['Free WiFi', 'TV', 'Air Conditioning', 'Private Bathroom', 'Mini Bar', 'Room Service'],
      images: ['https://images.unsplash.com/photo-1590490360182-c33d57733427?w=400&h=300&fit=crop'],
      availableCount: 5,
      isActive: true
    },
    {
      id: '3',
      name: 'Suite',
      description: 'Luxurious suite with separate living area and premium services.',
      maxOccupancy: 4,
      bedType: 'King Bed + Sofa Bed',
      roomSize: 55,
      pricePerNight: (hotel.base_price_per_night || 80) * 2.5,
      amenities: ['Free WiFi', 'TV', 'Air Conditioning', 'Private Bathroom', 'Mini Bar', 'Room Service', 'Balcony', 'Butler Service'],
      images: ['https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=400&h=300&fit=crop'],
      availableCount: 2,
      isActive: true
    },
    {
      id: '4',
      name: 'Family Room',
      description: 'Perfect for families with connecting rooms and kids amenities.',
      maxOccupancy: 5,
      bedType: '2 Queen Beds',
      roomSize: 45,
      pricePerNight: (hotel.base_price_per_night || 80) * 1.8,
      amenities: ['Free WiFi', 'TV', 'Air Conditioning', 'Private Bathroom', 'Connecting Rooms', 'Kids Menu'],
      images: ['https://images.unsplash.com/photo-1598300042247-d088f8ab3a91?w=400&h=300&fit=crop'],
      availableCount: 3,
      isActive: true
    }
  ]

  const sortedRooms = [...roomTypes].sort((a, b) => {
    switch (sortBy) {
      case 'price':
        return a.pricePerNight - b.pricePerNight
      case 'size':
        return b.roomSize - a.roomSize
      case 'capacity':
        return b.maxOccupancy - a.maxOccupancy
      default:
        return 0
    }
  })

  const nights = Math.ceil((checkOut.getTime() - checkIn.getTime()) / (1000 * 60 * 60 * 24))

  const getAmenityIcon = (amenity: string) => {
    const amenityLower = amenity.toLowerCase()
    if (amenityLower.includes('wifi')) return <Wifi className="h-4 w-4" />
    if (amenityLower.includes('tv')) return <Tv className="h-4 w-4" />
    if (amenityLower.includes('bathroom') || amenityLower.includes('bath')) return <Bath className="h-4 w-4" />
    if (amenityLower.includes('coffee') || amenityLower.includes('mini bar')) return <Coffee className="h-4 w-4" />
    if (amenityLower.includes('air') || amenityLower.includes('ac')) return <Wind className="h-4 w-4" />
    return <CheckCircle className="h-4 w-4" />
  }

  return (
    <>
      <Helmet>
        <title>Select Room - {hotel.name} | Recharge Travels</title>
        <meta name="description" content={`Choose your perfect room at ${hotel.name} in Sri Lanka. Compare room types, amenities, and prices.`} />
      </Helmet>

      <Header />

      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 py-8">
          {/* Header */}
          <div className="mb-8">
            <Button variant="outline" onClick={onBack} className="mb-4">
              ← Back to Hotel Details
            </Button>

            <div className="bg-white rounded-lg p-6 shadow-sm">
              <div className="flex items-start justify-between">
                <div>
                  <h1 className="text-2xl font-bold text-gray-900 mb-2">{hotel.name}</h1>
                  <div className="flex items-center text-gray-600 mb-4">
                    <MapPin className="h-4 w-4 mr-1" />
                    <span>{hotel.city?.name || hotel.address}</span>
                    {hotel.star_rating && (
                      <div className="flex items-center ml-4">
                        {[...Array(hotel.star_rating)].map((_, i) => (
                          <Star key={i} className="h-4 w-4 text-yellow-400 fill-current" />
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="flex items-center space-x-6 text-sm text-gray-600">
                    <span>📅 {checkIn.toLocaleDateString()} - {checkOut.toLocaleDateString()}</span>
                    <span>🏠 {nights} night{nights > 1 ? 's' : ''}</span>
                    <span>👥 {guests.adults} adult{guests.adults > 1 ? 's' : ''}{guests.children > 0 ? `, ${guests.children} child${guests.children > 1 ? 'ren' : ''}` : ''}</span>
                  </div>
                </div>

                <div className="text-right">
                  <div className="flex items-center mb-2">
                    <Select value={sortBy} onValueChange={setSortBy}>
                      <SelectTrigger className="w-40">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="price">Sort by Price</SelectItem>
                        <SelectItem value="size">Sort by Size</SelectItem>
                        <SelectItem value="capacity">Sort by Capacity</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Room Types */}
          <div className="space-y-6">
            {sortedRooms.map((room) => (
              <Card
                key={room.id}
                className={`overflow-hidden transition-all duration-300 ${
                  selectedRoom?.id === room.id ? 'ring-2 ring-blue-500 shadow-lg' : 'hover:shadow-md'
                }`}
              >
                <CardContent className="p-0">
                  <div className="grid grid-cols-1 lg:grid-cols-3">
                    {/* Room Image */}
                    <div className="lg:col-span-1">
                      <div className="aspect-[4/3] overflow-hidden">
                        <img
                          src={room.images[0] || 'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=400&h=300&fit=crop'}
                          alt={room.name}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            e.currentTarget.src = 'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=400&h=300&fit=crop'
                          }}
                        />
                      </div>
                    </div>

                    {/* Room Details */}
                    <div className="lg:col-span-2 p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <h3 className="text-xl font-semibold text-gray-900 mb-2">{room.name}</h3>
                          <p className="text-gray-600 mb-4">{room.description}</p>

                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                            <div className="flex items-center text-sm text-gray-600">
                              <Users className="h-4 w-4 mr-2" />
                              <span>Up to {room.maxOccupancy} guests</span>
                            </div>
                            <div className="flex items-center text-sm text-gray-600">
                              <Bed className="h-4 w-4 mr-2" />
                              <span>{room.bedType}</span>
                            </div>
                            <div className="flex items-center text-sm text-gray-600">
                              📐 {room.roomSize} m²
                            </div>
                            <div className="flex items-center text-sm text-green-600">
                              ✅ {room.availableCount} available
                            </div>
                          </div>

                          {/* Amenities */}
                          <div className="mb-4">
                            <h4 className="font-medium text-gray-900 mb-2">Room Amenities</h4>
                            <div className="flex flex-wrap gap-2">
                              {room.amenities.map((amenity, index) => (
                                <Badge key={index} variant="secondary" className="flex items-center">
                                  {getAmenityIcon(amenity)}
                                  <span className="ml-1">{amenity}</span>
                                </Badge>
                              ))}
                            </div>
                          </div>
                        </div>

                        {/* Price and Selection */}
                        <div className="text-right ml-6">
                          <div className="mb-4">
                            <div className="text-2xl font-bold text-gray-900">
                              ${room.pricePerNight}
                            </div>
                            <div className="text-sm text-gray-600">per night</div>
                            <div className="text-sm text-gray-500 mt-1">
                              Total: ${(room.pricePerNight * nights).toFixed(2)}
                            </div>
                          </div>

                          <Button
                            onClick={() => setSelectedRoom(room)}
                            variant={selectedRoom?.id === room.id ? "default" : "outline"}
                            className="w-full"
                          >
                            {selectedRoom?.id === room.id ? 'Selected' : 'Select Room'}
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Continue Button */}
          {selectedRoom && (
            <div className="fixed bottom-0 left-0 right-0 bg-white border-t shadow-lg p-4">
              <div className="max-w-7xl mx-auto flex items-center justify-between">
                <div>
                  <span className="font-medium">Selected: {selectedRoom.name}</span>
                  <span className="text-gray-600 ml-4">
                    ${(selectedRoom.pricePerNight * nights).toFixed(2)} for {nights} night{nights > 1 ? 's' : ''}
                  </span>
                </div>
                <Button
                  onClick={() => onSelectRoom(selectedRoom)}
                  size="lg"
                  className="px-8"
                >
                  Continue to Booking Details
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>

      <Footer />
    </>
  )
}

export default RoomSelection