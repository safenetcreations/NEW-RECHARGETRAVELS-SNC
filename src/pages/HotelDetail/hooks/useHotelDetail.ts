
import { useState, useEffect } from 'react'
import { HotelReview, RoomType } from '@/types/hotel'
import { HotelWithRelations, TourPackageWithTour } from '../types'
import { isGooglePlaceId } from '../utils/hotelTypeUtils'
import { createMockGoogleHotelData } from '../services/googleHotelService'
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

  const fetchGoogleHotelDetails = async () => {
    try {
      console.log('HotelDetail - fetching from Google API for:', hotelId)
      
      const mockHotelData = createMockGoogleHotelData(hotelId!)
      console.log('HotelDetail - mock Google hotel data:', mockHotelData)
      setHotel(mockHotelData)
      
      if (mockHotelData.room_types && mockHotelData.room_types.length > 0) {
        setSelectedRoom(mockHotelData.room_types[0])
      }

      setReviews([])
      setAvailableTours([])
      
    } catch (error) {
      console.error('HotelDetail - Error fetching Google hotel details:', error)
      setHotel(null)
    }
  }

  const fetchHotelDetails = async () => {
    try {
      console.log('HotelDetail - starting fetchHotelDetails for:', hotelId)
      
      if (isGooglePlaceId(hotelId!)) {
        console.log('HotelDetail - detected Google Place ID, fetching from Google API')
        setIsGoogleHotel(true)
        await fetchGoogleHotelDetails()
        return
      }

      const hotelData = await fetchHotelFromDatabase(hotelId!)
      
      if (!hotelData) {
        console.log('HotelDetail - no data returned from database, trying Google API')
        setIsGoogleHotel(true)
        await fetchGoogleHotelDetails()
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
      console.log('HotelDetail - falling back to Google API')
      setIsGoogleHotel(true)
      await fetchGoogleHotelDetails()
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (hotelId) {
      console.log('HotelDetail - fetching data for hotelId:', hotelId)
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
    isGoogleHotel
  }
}
