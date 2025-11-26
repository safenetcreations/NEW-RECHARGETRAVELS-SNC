
import React, { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { useAuth } from '@/hooks/useAuth'
import { useBookingManager } from '@/hooks/useBookingManager'
import { Navigate } from 'react-router-dom'
import { Calendar, MapPin, Users, CreditCard } from 'lucide-react'

const UserBookings = () => {
  const { user } = useAuth()
  const { getUserBookings, bookings, isLoading, cancelBooking } = useBookingManager()

  useEffect(() => {
    if (user) {
      getUserBookings()
    }
  }, [user])

  if (!user) {
    return <Navigate to="/" />
  }

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'confirmed':
        return 'bg-green-100 text-green-800'
      case 'pending':
        return 'bg-yellow-100 text-yellow-800'
      case 'cancelled':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const handleCancelBooking = async (bookingId: string) => {
    if (confirm('Are you sure you want to cancel this booking?')) {
      await cancelBooking(bookingId, 'Cancelled by user')
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
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">My Bookings</h1>
        
        {bookings.length === 0 ? (
          <Card>
            <CardContent className="text-center py-8">
              <p className="text-gray-600 mb-4">You haven't made any bookings yet.</p>
              <Button asChild>
                <a href="/">Start Exploring</a>
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-6">
            {bookings.map((booking) => (
              <Card key={booking.id}>
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-xl">
                        {booking.booking_type.charAt(0).toUpperCase() + booking.booking_type.slice(1)} Booking
                      </CardTitle>
                      <p className="text-sm text-gray-500">
                        Confirmation: {booking.confirmation_number}
                      </p>
                    </div>
                    <Badge className={getStatusColor(booking.status)}>
                      {booking.status}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div className="flex items-center text-sm text-gray-600">
                      <Calendar className="h-4 w-4 mr-2" />
                      Created: {new Date(booking.created_at).toLocaleDateString()}
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <CreditCard className="h-4 w-4 mr-2" />
                      Total: {booking.currency} {booking.total_price}
                    </div>
                    {booking.personal_info && (
                      <div className="flex items-center text-sm text-gray-600">
                        <Users className="h-4 w-4 mr-2" />
                        {booking.personal_info.firstName} {booking.personal_info.lastName}
                      </div>
                    )}
                    <div className="flex items-center text-sm text-gray-600">
                      <MapPin className="h-4 w-4 mr-2" />
                      Payment: {booking.payment_status}
                    </div>
                  </div>
                  
                  {booking.status === 'pending' && (
                    <div className="flex gap-2">
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleCancelBooking(booking.id)}
                      >
                        Cancel Booking
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default UserBookings
