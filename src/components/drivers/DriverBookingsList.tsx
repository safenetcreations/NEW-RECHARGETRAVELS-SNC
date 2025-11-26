
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import type { DriverBooking } from '@/types/driver-booking'

interface DriverBookingsListProps {
  bookings: DriverBooking[]
}

const DriverBookingsList = ({ bookings }: DriverBookingsListProps) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed':
        return 'bg-green-100 text-green-800'
      case 'pending':
        return 'bg-yellow-100 text-yellow-800'
      case 'completed':
        return 'bg-blue-100 text-blue-800'
      case 'cancelled':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Bookings</CardTitle>
      </CardHeader>
      <CardContent>
        {bookings.length === 0 ? (
          <p className="text-gray-600 text-center py-8">
            No bookings yet. Your bookings will appear here once customers start booking you.
          </p>
        ) : (
          <div className="space-y-4">
            {bookings.slice(0, 10).map((booking) => (
              <div key={booking.id} className="border rounded-lg p-4">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h4 className="font-semibold">
                      {booking.pickup_location} → {booking.dropoff_location || 'Multiple stops'}
                    </h4>
                    <p className="text-sm text-gray-600">
                      {new Date(booking.pickup_date).toLocaleDateString()} at {booking.pickup_time}
                    </p>
                  </div>
                  <Badge className={getStatusColor(booking.booking_status)}>
                    {booking.booking_status}
                  </Badge>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  <div>
                    <span className="text-gray-600">Passengers:</span>
                    <p className="font-medium">{booking.passenger_count}</p>
                  </div>
                  <div>
                    <span className="text-gray-600">Service:</span>
                    <p className="font-medium capitalize">{booking.service_type.replace('_', ' ')}</p>
                  </div>
                  <div>
                    <span className="text-gray-600">Duration:</span>
                    <p className="font-medium">{booking.duration_days} day(s)</p>
                  </div>
                  <div>
                    <span className="text-gray-600">Price:</span>
                    <p className="font-medium">${booking.quoted_price || 'TBD'}</p>
                  </div>
                </div>
                {booking.customer_notes && (
                  <div className="mt-3 p-2 bg-gray-50 rounded">
                    <p className="text-sm">
                      <strong>Customer Notes:</strong> {booking.customer_notes}
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}

export default DriverBookingsList
