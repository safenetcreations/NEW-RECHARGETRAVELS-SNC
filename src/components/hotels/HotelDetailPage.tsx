import React, { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import {
  Star, MapPin, Wifi, Car, Utensils, Waves, Dumbbell, Shield,
  Award, Heart, Share2, ChevronLeft, ChevronRight, Users, Calendar,
  CheckCircle, X, Phone, Mail, Globe, Clock, User, Check
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { Hotel } from '@/types/hotel'

interface HotelDetailPageProps {
  hotel: Hotel
  onBookNow?: (hotel: Hotel) => void
}

const HotelDetailPage: React.FC<HotelDetailPageProps> = ({ hotel, onBookNow }) => {
  const { id } = useParams()
  const [selectedImageIndex, setSelectedImageIndex] = useState(0)
  const [isImageModalOpen, setIsImageModalOpen] = useState(false)
  const [selectedRoom, setSelectedRoom] = useState<any>(null)
  const [checkIn, setCheckIn] = useState('')
  const [checkOut, setCheckOut] = useState('')
  const [guests, setGuests] = useState({ adults: 2, children: 0, rooms: 1 })
  const [isFavorite, setIsFavorite] = useState(false)

  // Mock data for demonstration
  const mockImages = [
    hotel.images?.[0]?.image_url || 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1590490360182-c33d57733427?w=800&h=600&fit=crop'
  ]

  const mockRoomTypes = [
    {
      id: 'deluxe-room',
      name: 'Deluxe Room',
      description: 'Spacious room with city views and modern amenities',
      maxOccupancy: 2,
      size: '35 m²',
      bedType: 'King Bed',
      amenities: ['Free WiFi', 'Air Conditioning', 'Mini Bar', 'Room Service'],
      images: ['https://images.unsplash.com/photo-1590490360182-c33d57733427?w=600&h=400&fit=crop'],
      basePrice: hotel.base_price_per_night || 150,
      discountedPrice: 120
    },
    {
      id: 'suite',
      name: 'Executive Suite',
      description: 'Luxurious suite with separate living area and premium amenities',
      maxOccupancy: 4,
      size: '65 m²',
      bedType: 'King Bed + Sofa Bed',
      amenities: ['Free WiFi', 'Air Conditioning', 'Mini Bar', 'Room Service', 'Jacuzzi', 'City View'],
      images: ['https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=600&h=400&fit=crop'],
      basePrice: 280,
      discountedPrice: 220
    }
  ]

  const mockReviews = [
    {
      id: '1',
      userName: 'Sarah Johnson',
      rating: 5,
      date: '2024-01-15',
      comment: 'Absolutely amazing hotel! The staff was incredibly helpful and the rooms were spotless. The location is perfect for exploring Colombo.',
      helpful: 12,
      images: ['https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?w=200&h=150&fit=crop']
    },
    {
      id: '2',
      userName: 'Michael Chen',
      rating: 4,
      date: '2024-01-10',
      comment: 'Great value for money. The breakfast was excellent and the pool area was beautiful. Only minor issue was the WiFi in the rooms.',
      helpful: 8
    }
  ]

  const amenities = hotel.amenities || [
    'Room Service', '24/7 Front Desk', 'Airport Shuttle', 'Spa'
  ]

  const host = hotel.hostProfile || {
    name: 'Recharge Partner',
    avatar: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=100&h=100&fit=crop',
    responseRate: 98,
    joinedDate: '2023',
    isVerified: true
  }

  const [selectedTours, setSelectedTours] = useState<string[]>([])

  const suggestedTours = [
    { id: 't1', name: 'City Tour', price: 45 },
    { id: 't2', name: 'Airport Transfer', price: 30 }
  ]

  const toggleTour = (tourId: string) => {
    setSelectedTours(prev =>
      prev.includes(tourId) ? prev.filter(id => id !== tourId) : [...prev, tourId]
    )
  }

  const getAmenityIcon = (amenity: string) => {
    const amenityLower = amenity.toLowerCase()
    if (amenityLower.includes('wifi')) return <Wifi className="h-5 w-5" />
    if (amenityLower.includes('parking') || amenityLower.includes('shuttle')) return <Car className="h-5 w-5" />
    if (amenityLower.includes('restaurant') || amenityLower.includes('breakfast')) return <Utensils className="h-5 w-5" />
    if (amenityLower.includes('pool')) return <Waves className="h-5 w-5" />
    if (amenityLower.includes('gym') || amenityLower.includes('fitness')) return <Dumbbell className="h-5 w-5" />
    if (amenityLower.includes('security') || amenityLower.includes('safe')) return <Shield className="h-5 w-5" />
    return <CheckCircle className="h-5 w-5" />
  }

  const nextImage = () => {
    setSelectedImageIndex((prev) => (prev + 1) % mockImages.length)
  }

  const prevImage = () => {
    setSelectedImageIndex((prev) => (prev - 1 + mockImages.length) % mockImages.length)
  }

  const calculateTotalPrice = () => {
    if (!selectedRoom || !checkIn || !checkOut) return 0
    const nights = Math.ceil((new Date(checkOut).getTime() - new Date(checkIn).getTime()) / (1000 * 60 * 60 * 24))
    const roomTotal = selectedRoom.discountedPrice * nights * guests.rooms
    const toursTotal = selectedTours.reduce((acc, tourId) => {
      const tour = suggestedTours.find(t => t.id === tourId)
      return acc + (tour ? tour.price * guests.adults : 0) // Assuming tour price is per adult
    }, 0)
    return roomTotal + toursTotal
  }

  return (
    <>
      <Helmet>
        <title>{hotel.name} - Luxury Hotel in Sri Lanka | Recharge Travels</title>
        <meta name="description" content={`${hotel.description || `Book ${hotel.name} in Sri Lanka. Luxury accommodation with premium amenities and exceptional service.`}`} />
        <meta property="og:image" content={mockImages[0]} />
      </Helmet>

      <Header />

      <div className="min-h-screen bg-gray-50">
        {/* Breadcrumb */}
        <div className="bg-white border-b">
          <div className="max-w-7xl mx-auto px-4 py-3">
            <div className="flex items-center text-sm text-gray-600">
              <Link to="/" className="hover:text-blue-600">Home</Link>
              <span className="mx-2">/</span>
              <Link to="/hotels" className="hover:text-blue-600">Hotels</Link>
              <span className="mx-2">/</span>
              <span className="text-gray-900 font-medium">{hotel.name}</span>
            </div>
          </div>
        </div>

        {/* Hero Image Gallery */}
        <div className="relative bg-gray-100">
          <div className="relative h-96 md:h-[500px] overflow-hidden">
            <img
              src={mockImages[selectedImageIndex]}
              alt={hotel.name}
              className="w-full h-full object-cover"
            />

            {/* Navigation Arrows */}
            <button
              onClick={prevImage}
              className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white text-gray-800 p-2 rounded-full shadow-md transition-colors"
            >
              <ChevronLeft className="h-6 w-6" />
            </button>
            <button
              onClick={nextImage}
              className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white text-gray-800 p-2 rounded-full shadow-md transition-colors"
            >
              <ChevronRight className="h-6 w-6" />
            </button>

            {/* Image Dots */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex space-x-2">
              {mockImages.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImageIndex(index)}
                  className={`w-2 h-2 rounded-full transition-colors ${index === selectedImageIndex ? 'bg-white' : 'bg-white/50'
                    }`}
                />
              ))}
            </div>

            {/* Action Buttons */}
            <div className="absolute top-4 right-4 flex space-x-2">
              <Button
                variant="secondary"
                size="sm"
                onClick={() => setIsFavorite(!isFavorite)}
                className="bg-white/90 hover:bg-white"
              >
                <Heart className={`h-4 w-4 ${isFavorite ? 'fill-red-500 text-red-500' : ''}`} />
              </Button>
              <Button variant="secondary" size="sm" className="bg-white/90 hover:bg-white">
                <Share2 className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Thumbnail Strip */}
          <div className="bg-white border-t">
            <div className="max-w-7xl mx-auto px-4 py-3">
              <div className="flex space-x-2 overflow-x-auto">
                {mockImages.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImageIndex(index)}
                    className={`flex-shrink-0 w-20 h-16 rounded-lg overflow-hidden border-2 transition-colors ${index === selectedImageIndex ? 'border-blue-500' : 'border-gray-200'
                      }`}
                  >
                    <img src={image} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-8">
              {/* Hotel Header */}
              <div>
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
                      {hotel.name}
                    </h1>
                    <div className="flex items-center text-gray-600 mb-3">
                      <MapPin className="h-5 w-5 mr-2" />
                      <span>{hotel.city?.name || hotel.address || 'Sri Lanka'}</span>
                    </div>
                  </div>

                  <div className="text-right">
                    {hotel.star_rating && (
                      <div className="flex items-center justify-end mb-2">
                        {[...Array(hotel.star_rating)].map((_, i) => (
                          <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                        ))}
                      </div>
                    )}
                    {hotel.average_rating && (
                      <div className="flex items-center justify-end">
                        <Star className="h-4 w-4 text-yellow-400 fill-current mr-1" />
                        <span className="font-semibold">{hotel.average_rating.toFixed(1)}</span>
                        <span className="text-gray-600 ml-1">
                          ({hotel.review_count || 0} reviews)
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                <p className="text-gray-700 text-lg leading-relaxed">
                  {hotel.description || 'Experience luxury accommodation with world-class amenities and exceptional service. This premium hotel offers the perfect blend of comfort, elegance, and convenience for your Sri Lankan journey.'}
                </p>
              </div>

              {/* Amenities */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Award className="h-5 w-5 mr-2" />
                    Hotel Amenities
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {amenities.map((amenity, index) => (
                      <div key={index} className="flex items-center space-x-3">
                        <div className="text-green-600">
                          {getAmenityIcon(amenity)}
                        </div>
                        <span className="text-sm font-medium">{amenity}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Meet Your Host */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <User className="h-5 w-5 mr-2" />
                    Meet Your Host
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center space-x-4">
                    <img
                      src={host.avatar}
                      alt={host.name}
                      className="w-16 h-16 rounded-full object-cover border-2 border-gray-100"
                    />
                    <div>
                      <div className="flex items-center">
                        <h3 className="text-lg font-semibold mr-2">{host.name}</h3>
                        {host.isVerified && (
                          <Badge variant="secondary" className="bg-green-100 text-green-800 hover:bg-green-100">
                            <Check className="h-3 w-3 mr-1" /> Verified
                          </Badge>
                        )}
                      </div>
                      <p className="text-gray-600 text-sm">Joined in {host.joinedDate} • {host.responseRate}% Response Rate</p>
                    </div>
                  </div>
                  <div className="mt-4 p-4 bg-gray-50 rounded-lg text-sm text-gray-600">
                    <p>"Hi! I'm dedicated to providing you with the best Sri Lankan hospitality experience. Feel free to ask me anything about the local area or the property."</p>
                  </div>
                </CardContent>
              </Card>

              {/* Room Types */}
              <Card>
                <CardHeader>
                  <CardTitle>Available Rooms</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {mockRoomTypes.map((room) => (
                    <div
                      key={room.id}
                      className={`border rounded-lg p-6 cursor-pointer transition-all ${selectedRoom?.id === room.id
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300'
                        }`}
                      onClick={() => setSelectedRoom(room)}
                    >
                      <div className="flex flex-col md:flex-row gap-6">
                        <div className="md:w-1/3">
                          <img
                            src={room.images[0]}
                            alt={room.name}
                            className="w-full h-32 object-cover rounded-lg"
                          />
                        </div>

                        <div className="md:w-2/3">
                          <div className="flex items-start justify-between mb-2">
                            <h3 className="text-xl font-semibold">{room.name}</h3>
                            <div className="text-right">
                              <div className="text-2xl font-bold text-gray-900">
                                ${room.discountedPrice}
                              </div>
                              <div className="text-sm text-gray-600 line-through">
                                ${room.basePrice}
                              </div>
                            </div>
                          </div>

                          <p className="text-gray-600 mb-3">{room.description}</p>

                          <div className="grid grid-cols-2 gap-4 text-sm text-gray-600 mb-3">
                            <div><strong>Size:</strong> {room.size}</div>
                            <div><strong>Beds:</strong> {room.bedType}</div>
                            <div><strong>Max Occupancy:</strong> {room.maxOccupancy} guests</div>
                            <div><strong>per night</strong></div>
                          </div>

                          <div className="flex flex-wrap gap-2">
                            {room.amenities.slice(0, 4).map((amenity, index) => (
                              <Badge key={index} variant="secondary" className="text-xs">
                                {amenity}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>

              {/* Reviews */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span>Guest Reviews</span>
                    <Badge variant="secondary">
                      {hotel.average_rating?.toFixed(1)} ({hotel.review_count || 0} reviews)
                    </Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {mockReviews.map((review) => (
                    <div key={review.id} className="border-b border-gray-100 pb-6 last:border-b-0">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <div className="font-semibold">{review.userName}</div>
                          <div className="flex items-center">
                            {[...Array(review.rating)].map((_, i) => (
                              <Star key={i} className="h-4 w-4 text-yellow-400 fill-current" />
                            ))}
                            <span className="text-sm text-gray-600 ml-2">{review.date}</span>
                          </div>
                        </div>
                      </div>

                      <p className="text-gray-700 mb-3">{review.comment}</p>

                      {review.images && (
                        <div className="flex gap-2 mb-3">
                          {review.images.map((image, index) => (
                            <img
                              key={index}
                              src={image}
                              alt="Review"
                              className="w-20 h-20 object-cover rounded-lg cursor-pointer hover:opacity-80"
                              onClick={() => setIsImageModalOpen(true)}
                            />
                          ))}
                        </div>
                      )}

                      <div className="flex items-center text-sm text-gray-600">
                        <Button variant="ghost" size="sm" className="h-auto p-0 text-gray-600">
                          👍 Helpful ({review.helpful})
                        </Button>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>

            {/* Booking Sidebar */}
            <div className="lg:col-span-1">
              <Card className="sticky top-8">
                <CardHeader>
                  <CardTitle>Book Your Stay</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Date Selection */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Check-in
                      </label>
                      <input
                        type="date"
                        value={checkIn}
                        onChange={(e) => setCheckIn(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Check-out
                      </label>
                      <input
                        type="date"
                        value={checkOut}
                        onChange={(e) => setCheckOut(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                  </div>

                  {/* Guests Selection */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Guests
                    </label>
                    <Select
                      value={`${guests.adults}-${guests.children}-${guests.rooms}`}
                      onValueChange={(value) => {
                        const [adults, children, rooms] = value.split('-').map(Number)
                        setGuests({ adults, children, rooms })
                      }}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1-0-1">1 Adult, 1 Room</SelectItem>
                        <SelectItem value="2-0-1">2 Adults, 1 Room</SelectItem>
                        <SelectItem value="2-1-1">2 Adults, 1 Child, 1 Room</SelectItem>
                        <SelectItem value="2-2-1">2 Adults, 2 Children, 1 Room</SelectItem>
                        <SelectItem value="4-0-2">4 Adults, 2 Rooms</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Selected Room Display */}
                  {selectedRoom && (
                    <div className="bg-blue-50 p-4 rounded-lg">
                      <h4 className="font-semibold text-blue-900 mb-2">{selectedRoom.name}</h4>
                      <div className="text-sm text-blue-700 space-y-1">
                        <div>${selectedRoom.discountedPrice} per night</div>
                        <div>{selectedRoom.maxOccupancy} guests max</div>
                      </div>
                    </div>
                  )}

                  {/* Tour Add-ons */}
                  {selectedRoom && (
                    <div className="border-t pt-4">
                      <h4 className="font-medium text-sm mb-3">Enhance your stay</h4>
                      <div className="space-y-2">
                        {suggestedTours.map(tour => (
                          <div key={tour.id} className="flex items-center justify-between p-2 border rounded-lg hover:bg-gray-50 cursor-pointer" onClick={() => toggleTour(tour.id)}>
                            <div className="flex items-center">
                              <div className={`w-4 h-4 rounded border mr-3 flex items-center justify-center ${selectedTours.includes(tour.id) ? 'bg-blue-600 border-blue-600' : 'border-gray-300'}`}>
                                {selectedTours.includes(tour.id) && <Check className="w-3 h-3 text-white" />}
                              </div>
                              <span className="text-sm">{tour.name}</span>
                            </div>
                            <span className="text-sm font-medium">+${tour.price}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Price Summary */}
                  {checkIn && checkOut && selectedRoom && (
                    <div className="border-t pt-4">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm text-gray-600">
                          {selectedRoom.name} × {Math.ceil((new Date(checkOut).getTime() - new Date(checkIn).getTime()) / (1000 * 60 * 60 * 24))} nights
                        </span>
                        <span className="font-semibold">
                          ${calculateTotalPrice()}
                        </span>
                      </div>
                      <div className="flex justify-between items-center text-lg font-bold border-t pt-2">
                        <span>Total</span>
                        <span>${calculateTotalPrice()}</span>
                      </div>
                    </div>
                  )}

                  {/* Book Now Button */}
                  <Button
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 text-lg font-semibold"
                    disabled={!selectedRoom || !checkIn || !checkOut}
                    onClick={() => onBookNow?.(hotel)}
                  >
                    {selectedRoom ? 'Book Now' : 'Select a Room'}
                  </Button>

                  <p className="text-xs text-gray-600 text-center">
                    Free cancellation up to 24 hours before check-in
                  </p>
                </CardContent>
              </Card>

              {/* Contact Information */}
              <Card className="mt-6">
                <CardHeader>
                  <CardTitle className="text-lg">Contact Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <a href="https://wa.me/94777721999" target="_blank" rel="noopener noreferrer" className="flex items-center space-x-3 hover:text-green-600 transition-colors">
                    <svg className="h-4 w-4 text-green-500" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
                    <span className="text-sm">+94 77 772 1999</span>
                  </a>
                  <div className="flex items-center space-x-3">
                    <Mail className="h-4 w-4 text-gray-400" />
                    <span className="text-sm">reservations@{hotel.name.toLowerCase().replace(/\s+/g, '')}.com</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Globe className="h-4 w-4 text-gray-400" />
                    <span className="text-sm">{hotel.name.toLowerCase().replace(/\s+/g, '')}.com</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Clock className="h-4 w-4 text-gray-400" />
                    <span className="text-sm">24/7 Front Desk</span>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div >

      <Footer />

      {/* Image Modal */}
      <Dialog open={isImageModalOpen} onOpenChange={setIsImageModalOpen}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>{hotel.name} - Photo Gallery</DialogTitle>
          </DialogHeader>
          <div className="relative">
            <img
              src={mockImages[selectedImageIndex]}
              alt={hotel.name}
              className="w-full h-auto max-h-[70vh] object-contain"
            />
            <button
              onClick={prevImage}
              className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white text-gray-800 p-2 rounded-full shadow-md"
            >
              <ChevronLeft className="h-6 w-6" />
            </button>
            <button
              onClick={nextImage}
              className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white text-gray-800 p-2 rounded-full shadow-md"
            >
              <ChevronRight className="h-6 w-6" />
            </button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}

export default HotelDetailPage