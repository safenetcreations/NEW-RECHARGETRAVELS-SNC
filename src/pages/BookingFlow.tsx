
import React from 'react'
import { useParams } from 'react-router-dom'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useBookingManager } from '@/hooks/useBookingManager'

const BookingFlow = () => {
  const { type } = useParams<{ type: string }>()
  const { isLoading } = useBookingManager()

  const getTitle = () => {
    switch (type) {
      case 'hotel':
        return 'Hotel Booking'
      case 'tour':
        return 'Tour Booking'
      case 'transport':
        return 'Transport Booking'
      case 'package':
        return 'Package Booking'
      default:
        return 'Booking'
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Card className="max-w-4xl mx-auto">
        <CardHeader>
          <CardTitle className="text-3xl font-bold text-center">
            {getTitle()}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <p className="text-gray-600 mb-4">
              Complete your {type} booking using the form below.
            </p>
            <p className="text-sm text-gray-500">
              Booking type: {type}
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default BookingFlow
