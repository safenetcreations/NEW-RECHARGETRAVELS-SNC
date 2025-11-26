
import React, { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Hotel, RoomType } from '@/types/hotel'
import { aiRecommendationService, AIRecommendation } from '@/services/aiRecommendationService'
import { toast } from '@/hooks/use-toast'
import BookingDateSelector from './booking/BookingDateSelector'
import GuestSelector from './booking/GuestSelector'
import SelectedRoomDisplay from './booking/SelectedRoomDisplay'
import AIRecommendationDisplay from './booking/AIRecommendationDisplay'
import BookingButtons from './booking/BookingButtons'
import HotelContactInfo from './booking/HotelContactInfo'

interface TourPackageWithTour {
  id: string
  package_name: string
  description?: string
  discount_percentage: number
  package_price?: number
  tour?: {
    title: string
    duration_days: number
    difficulty_level: string
  }
}

interface HotelBookingSidebarProps {
  hotel: Hotel
  selectedRoom: RoomType | null
  checkIn: string
  checkOut: string
  guests: { adults: number; children: number }
  availableTours: TourPackageWithTour[]
  onCheckInChange: (value: string) => void
  onCheckOutChange: (value: string) => void
  onGuestsChange: (guests: { adults: number; children: number }) => void
}

const HotelBookingSidebar: React.FC<HotelBookingSidebarProps> = ({
  hotel,
  selectedRoom,
  checkIn,
  checkOut,
  guests,
  availableTours,
  onCheckInChange,
  onCheckOutChange,
  onGuestsChange
}) => {
  const [aiRecommendation, setAiRecommendation] = useState<AIRecommendation | null>(null)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [showAiRecommendation, setShowAiRecommendation] = useState(false)

  const calculateTripDuration = () => {
    if (!checkIn || !checkOut) return 1
    const start = new Date(checkIn)
    const end = new Date(checkOut)
    const diffTime = Math.abs(end.getTime() - start.getTime())
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    return Math.max(diffDays, 1)
  }

  const handleAiSmartSelect = async () => {
    setIsAnalyzing(true)
    
    try {
      const preferences = aiRecommendationService.getDefaultPreferences(guests)
      const tripDuration = calculateTripDuration()
      
      const recommendation = aiRecommendationService.getBestRecommendation(
        hotel,
        availableTours,
        preferences,
        tripDuration
      )
      
      setAiRecommendation(recommendation)
      setShowAiRecommendation(true)
      
      toast({
        title: "AI Analysis Complete",
        description: `Found the best option with ${Math.round(recommendation.score * 100)}% confidence`,
      })
      
    } catch (error) {
      console.error('AI recommendation error:', error)
      toast({
        title: "Analysis Failed",
        description: "Unable to analyze options. Please try again.",
        variant: "destructive"
      })
    } finally {
      setIsAnalyzing(false)
    }
  }

  const handleBookAiRecommendation = () => {
    if (!aiRecommendation) return
    
    toast({
      title: "Booking Initiated",
      description: `Proceeding with AI-recommended ${aiRecommendation.booking_type === 'package' ? 'package' : 'hotel'} booking`,
    })
    
    console.log('Booking AI recommendation:', aiRecommendation)
  }

  return (
    <Card className="sticky top-4">
      <CardHeader>
        <CardTitle>Book Your Stay</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <BookingDateSelector
          checkIn={checkIn}
          checkOut={checkOut}
          onCheckInChange={onCheckInChange}
          onCheckOutChange={onCheckOutChange}
        />

        <GuestSelector
          guests={guests}
          onGuestsChange={onGuestsChange}
        />

        <SelectedRoomDisplay selectedRoom={selectedRoom} />

        {showAiRecommendation && aiRecommendation && (
          <AIRecommendationDisplay
            aiRecommendation={aiRecommendation}
            onBookRecommendation={handleBookAiRecommendation}
          />
        )}

        <BookingButtons
          availableTours={availableTours}
          isAnalyzing={isAnalyzing}
          onAiSmartSelect={handleAiSmartSelect}
        />

        <HotelContactInfo hotel={hotel} />
      </CardContent>
    </Card>
  )
}

export default HotelBookingSidebar
