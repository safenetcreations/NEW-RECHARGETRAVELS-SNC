
import React, { useState } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import { ArrowLeft, Home, Building2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { Hotel } from '@/types/hotel'
import HotelImageGallery from '@/components/hotels/HotelImageGallery'
import HotelHeader from '@/components/hotels/HotelHeader'
import HotelAmenities from '@/components/hotels/HotelAmenities'
import HotelRoomTypes from '@/components/hotels/HotelRoomTypes'
import HotelTourPackages from '@/components/hotels/HotelTourPackages'
import HotelReviews from '@/components/hotels/HotelReviews'
import HotelBookingSidebar from '@/components/hotels/HotelBookingSidebar'
import { useHotelDetail } from './HotelDetail/hooks/useHotelDetail'
import HotelNotFound from './HotelDetail/components/HotelNotFound'
import HotelLoadingSpinner from './HotelDetail/components/HotelLoadingSpinner'
import GoogleHotelNotice from './HotelDetail/components/GoogleHotelNotice'

const HotelDetail = () => {
  const { id: hotelId } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [checkIn, setCheckIn] = useState('')
  const [checkOut, setCheckOut] = useState('')
  const [guests, setGuests] = useState({ adults: 2, children: 0 })

  const {
    hotel,
    selectedRoom,
    setSelectedRoom,
    reviews,
    loading,
    availableTours,
    isGoogleHotel
  } = useHotelDetail(hotelId)

  if (loading) {
    return <HotelLoadingSpinner />
  }

  if (!hotel) {
    return <HotelNotFound hotelId={hotelId} />
  }

  // Convert HotelWithRelations to Hotel type for components that expect Hotel
  const hotelForComponents: Hotel = {
    ...hotel,
    images: hotel.images.map((url, index) => ({
      id: `${hotel.id}-${index}`,
      hotel_id: hotel.id,
      image_url: url,
      is_primary: index === 0,
      sort_order: index
    }))
  }

  return (
    <>
      <Helmet>
        <title>{hotel.name} - Luxury Hotel in Sri Lanka - Recharge Travels</title>
        <meta name="description" content={hotel.description || `Book ${hotel.name} in Sri Lanka. Luxury accommodation with premium amenities.`} />
      </Helmet>
      
      <Header />
      
      <div className="min-h-screen bg-gray-50">
        {/* Navigation Breadcrumbs */}
        <div className="bg-white border-b sticky top-16 z-30">
          <div className="max-w-7xl mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <Button
                  variant="ghost"
                  onClick={() => navigate(-1)}
                  className="flex items-center space-x-2 text-gray-600 hover:text-gray-900"
                >
                  <ArrowLeft className="h-4 w-4" />
                  <span>Back</span>
                </Button>
                
                <div className="flex items-center space-x-2 text-sm text-gray-500">
                  <Link to="/" className="hover:text-gray-700 flex items-center">
                    <Home className="h-4 w-4 mr-1" />
                    Home
                  </Link>
                  <span>/</span>
                  <Link to="/hotels" className="hover:text-gray-700 flex items-center">
                    <Building2 className="h-4 w-4 mr-1" />
                    Hotels
                  </Link>
                  <span>/</span>
                  <span className="text-gray-900 font-medium">{hotel.name}</span>
                </div>
              </div>
              
              <div className="flex space-x-2">
                <Button asChild variant="outline">
                  <Link to="/hotels">Browse Hotels</Link>
                </Button>
                <Button asChild>
                  <Link to="/">Home</Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
        
        {isGoogleHotel && <GoogleHotelNotice />}
        
        <HotelImageGallery
          images={hotel.images}
          hotelName={hotel.name}
          currentImageIndex={currentImageIndex}
          onImageIndexChange={setCurrentImageIndex}
        />

        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2">
              <HotelHeader hotel={hotelForComponents} />
              <HotelAmenities amenities={hotel.amenities || []} />
              <HotelRoomTypes
                roomTypes={hotel.room_types}
                selectedRoom={selectedRoom}
                onRoomSelect={setSelectedRoom}
              />
              {!isGoogleHotel && (
                <>
                  <HotelTourPackages tourPackages={availableTours} />
                  <HotelReviews reviews={reviews} />
                </>
              )}
            </div>

            {/* Booking Sidebar */}
            <div className="lg:col-span-1">
              <HotelBookingSidebar
                hotel={hotelForComponents}
                selectedRoom={selectedRoom}
                checkIn={checkIn}
                checkOut={checkOut}
                guests={guests}
                availableTours={availableTours}
                onCheckInChange={setCheckIn}
                onCheckOutChange={setCheckOut}
                onGuestsChange={setGuests}
              />
            </div>
          </div>
        </div>
      </div>
      
      <Footer />
    </>
  )
}

export default HotelDetail
