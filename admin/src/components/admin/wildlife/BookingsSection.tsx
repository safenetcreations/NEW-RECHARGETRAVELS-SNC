
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { getUserWildlifeBookings, type WildlifeBooking } from '@/services/wildlifeService';

const BookingsSection: React.FC = () => {
  const [bookings, setBookings] = useState<WildlifeBooking[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadBookings();
  }, []);

  const loadBookings = async () => {
    setLoading(true);
    try {
      const { data } = await getUserWildlifeBookings();
      setBookings(data || []);
    } catch (error) {
      console.error('Error loading bookings:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed': return 'default';
      case 'pending': return 'secondary';
      case 'cancelled': return 'destructive';
      default: return 'outline';
    }
  };

  if (loading) {
    return <div className="flex justify-center py-8">Loading bookings...</div>;
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Wildlife Bookings</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-4 font-semibold">Booking #</th>
                  <th className="text-left p-4 font-semibold">Package</th>
                  <th className="text-left p-4 font-semibold">Date</th>
                  <th className="text-left p-4 font-semibold">Participants</th>
                  <th className="text-left p-4 font-semibold">Status</th>
                  <th className="text-left p-4 font-semibold">Total</th>
                </tr>
              </thead>
              <tbody>
                {bookings.map((booking) => (
                  <tr key={booking.id} className="border-b hover:bg-gray-50">
                    <td className="p-4 font-medium">{booking.booking_number}</td>
                    <td className="p-4">{booking.safari_packages?.name || 'N/A'}</td>
                    <td className="p-4">{new Date(booking.start_date).toLocaleDateString()}</td>
                    <td className="p-4">{booking.total_participants}</td>
                    <td className="p-4">
                      <Badge variant={getStatusColor(booking.booking_status)}>
                        {booking.booking_status}
                      </Badge>
                    </td>
                    <td className="p-4">${booking.total_amount}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default BookingsSection;
