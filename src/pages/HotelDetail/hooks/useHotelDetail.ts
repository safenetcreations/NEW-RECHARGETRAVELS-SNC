
import { useState, useEffect } from 'react'
import { HotelReview, RoomType } from '@/types/hotel'
import { HotelWithRelations, TourPackageWithTour } from '../types'
import { isGooglePlaceId } from '../utils/hotelTypeUtils'
import { getMockHotelById } from '../data/mockHotels'
import { 
  fetchHotelFromDatabase, 
  fetchHotelReviews, 
  fetchHotelTourPackages 
} from '../services/hotelDataService'

export const useHotelDetail = (hotelId: string | undefined) => {
  const [hotel, setHotel] = useState<HotelWithRelations | null>(null)
  const [selectedRoom, setSelectedRoom] = useState<RoomType | null>(null)
  const [reviews, setReviews] = useState<HotelReview[]>([])
  const [loading, setLoading] = useState(true)
  const [availableTours, setAvailableTours] = useState<TourPackageWithTour[]>([])
  const [isGoogleHotel, setIsGoogleHotel] = useState(false)
  const [isMockHotel, setIsMockHotel] = useState(false)

  // Load from mock data (for demo hotels)
  const loadMockHotelData = () => {
    console.log('HotelDetail - loading mock hotel data for:', hotelId)
    const mockHotel = getMockHotelById(hotelId!)
    
    if (mockHotel) {
      const transformedHotel: HotelWithRelations = {
        ...mockHotel,
        hotel_type: mockHotel.hotel_type as any,
        room_types: mockHotel.room_types?.map((room: any) => ({
          ...room,
          amenities: Array.isArray(room.amenities) ? room.amenities : [],
          images: Array.isArray(room.images) ? room.images : []
        })) || [],
        hotel_reviews: [],
        cities: mockHotel.city,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }
      
      setHotel(transformedHotel)
      setIsMockHotel(true)
      
      if (transformedHotel.room_types && transformedHotel.room_types.length > 0) {
        setSelectedRoom(transformedHotel.room_types[0])
      }
      
      // Generate mock reviews
      setReviews(generateMockReviews(mockHotel.name))
      setAvailableTours([])
      
      return true
    }
    return false
  }

  const fetchHotelDetails = async () => {
    try {
      console.log('HotelDetail - starting fetchHotelDetails for:', hotelId)
      
      // First check if it's a mock hotel ID (simple numbers like '1', '2', etc.)
      if (hotelId && /^[0-9]+$/.test(hotelId) && parseInt(hotelId) <= 20) {
        if (loadMockHotelData()) {
          setLoading(false)
          return
        }
      }
      
      if (isGooglePlaceId(hotelId!)) {
        console.log('HotelDetail - detected Google Place ID')
        setIsGoogleHotel(true)
        if (loadMockHotelData()) {
          setLoading(false)
          return
        }
      }

      const hotelData = await fetchHotelFromDatabase(hotelId!)
      
      if (!hotelData) {
        console.log('HotelDetail - no data from database, trying mock data')
        if (loadMockHotelData()) {
          setLoading(false)
          return
        }
        setHotel(null)
        setLoading(false)
        return
      }

      setHotel(hotelData)
      
      if (hotelData.room_types && hotelData.room_types.length > 0) {
        setSelectedRoom(hotelData.room_types[0])
      }

      // Fetch additional data for local hotels
      const [reviewsData, toursData] = await Promise.all([
        fetchHotelReviews(hotelId!),
        fetchHotelTourPackages(hotelId!)
      ])

      setReviews(reviewsData)
      setAvailableTours(toursData)
      
    } catch (error) {
      console.error('HotelDetail - Error fetching hotel details:', error)
      // Fallback to mock data
      if (loadMockHotelData()) {
        setLoading(false)
        return
      }
      setHotel(null)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (hotelId) {
      console.log('HotelDetail - fetching data for hotelId:', hotelId)
      setLoading(true)
      fetchHotelDetails()
    } else {
      console.log('HotelDetail - no hotelId provided')
      setLoading(false)
    }
  }, [hotelId])

  return {
    hotel,
    selectedRoom,
    setSelectedRoom,
    reviews,
    loading,
    availableTours,
    isGoogleHotel,
    isMockHotel
  }
}

// Generate realistic mock reviews
function generateMockReviews(hotelName: string): HotelReview[] {
  const reviewers = [
    { name: 'Sarah Johnson', country: 'United States' },
    { name: 'Michael Chen', country: 'Singapore' },
    { name: 'Emma Williams', country: 'United Kingdom' },
    { name: 'Hans Mueller', country: 'Germany' },
    { name: 'Yuki Tanaka', country: 'Japan' },
    { name: 'Pierre Dubois', country: 'France' }
  ]
  
  const comments = [
    `Absolutely wonderful stay at ${hotelName}! The staff was incredibly friendly and the rooms were spotless. Would highly recommend for anyone visiting Sri Lanka.`,
    `Great location and excellent service. The breakfast was amazing with lots of local options. The pool area was beautiful and well-maintained.`,
    `We had an amazing experience. The hotel exceeded our expectations in every way. The views were breathtaking and the food was delicious.`,
    `Perfect for a relaxing getaway. Very clean, comfortable beds, and the staff went above and beyond to make our stay memorable.`,
    `Beautiful property with excellent amenities. The spa was fantastic and the restaurant served some of the best food we had in Sri Lanka.`,
    `Lovely hotel with great attention to detail. The room was spacious and clean. Highly recommend the local tours they organize.`
  ]
  
  return reviewers.slice(0, 4).map((reviewer, index) => ({
    id: `review-${index}`,
    hotel_id: '',
    user_name: reviewer.name,
    rating: 4 + Math.random(),
    comment: comments[index],
    created_at: new Date(Date.now() - (index * 7 * 24 * 60 * 60 * 1000)).toISOString(),
    is_verified: true,
    helpful_count: Math.floor(Math.random() * 20) + 5
  }))
}
