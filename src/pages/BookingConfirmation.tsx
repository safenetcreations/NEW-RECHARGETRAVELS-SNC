
import React, { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { CheckCircle, Download, Mail } from 'lucide-react'
import { useBookingManager } from '@/hooks/useBookingManager'

const BookingConfirmation = () => {
  const { confirmationNumber } = useParams<{ confirmationNumber: string }>()
  const { getBooking } = useBookingManager()
  const [booking, setBooking] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchBooking = async () => {
      if (confirmationNumber) {
        // In a real implementation, you would fetch by confirmation number
        // For now, we'll show the confirmation with the number
        setLoading(false)
      }
    }
    
    fetchBooking()
  }, [confirmationNumber])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Card className="max-w-2xl mx-auto">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <CheckCircle className="h-16 w-16 text-green-500" />
          </div>
          <CardTitle className="text-3xl font-bold text-green-600">
            Booking Confirmed!
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="text-center">
            <p className="text-lg text-gray-600 mb-2">
              Your booking has been successfully confirmed.
            </p>
            <div className="bg-gray-50 rounded-lg p-4">
              <p className="text-sm text-gray-500">Confirmation Number</p>
              <p className="text-2xl font-bold text-gray-900">
                {confirmationNumber}
              </p>
            </div>
          </div>

          <div className="border-t pt-6">
            <h3 className="font-semibold text-lg mb-4">What's Next?</h3>
            <ul className="space-y-2 text-gray-600">
              <li className="flex items-center">
                <Mail className="h-4 w-4 mr-2" />
                A confirmation email has been sent to your email address
              </li>
              <li className="flex items-center">
                <Download className="h-4 w-4 mr-2" />
                You can download your booking details as PDF
              </li>
            </ul>
          </div>

          <div className="flex gap-4 pt-6">
            <Button asChild className="flex-1">
              <Link to="/my-bookings">View My Bookings</Link>
            </Button>
            <Button variant="outline" asChild className="flex-1">
              <Link to="/">Back to Home</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default BookingConfirmation
