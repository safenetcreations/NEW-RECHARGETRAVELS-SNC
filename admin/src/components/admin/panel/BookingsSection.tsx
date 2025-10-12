
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Search, Filter, Eye, Download } from 'lucide-react';

const BookingsSection: React.FC = () => {
  const [bookings] = useState([
    { id: 1, customer: 'John Doe', hotel: 'Luxury Beach Resort', dates: '2024-02-15 to 2024-02-20', status: 'confirmed', amount: '$1,250' },
    { id: 2, customer: 'Jane Smith', hotel: 'Mountain View Lodge', dates: '2024-02-18 to 2024-02-22', status: 'pending', amount: '$850' },
    { id: 3, customer: 'Mike Johnson', hotel: 'Wildlife Safari Camp', dates: '2024-02-20 to 2024-02-25', status: 'cancelled', amount: '$1,100' },
  ]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed': return 'default';
      case 'pending': return 'secondary';
      case 'cancelled': return 'destructive';
      default: return 'secondary';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">Bookings Management</h2>
        <Button variant="outline">
          <Download className="w-4 h-4 mr-2" />
          Export Data
        </Button>
      </div>

      {/* Search and Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex gap-4">
            <div className="relative flex-1">
              <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <Input placeholder="Search bookings..." className="pl-10" />
            </div>
            <select className="px-4 py-2 border border-gray-300 rounded-lg">
              <option value="all">All Status</option>
              <option value="confirmed">Confirmed</option>
              <option value="pending">Pending</option>
              <option value="cancelled">Cancelled</option>
            </select>
            <Button variant="outline">
              <Filter className="w-4 h-4 mr-2" />
              Date Range
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Bookings Table */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Bookings ({bookings.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-4 font-semibold">Booking ID</th>
                  <th className="text-left p-4 font-semibold">Customer</th>
                  <th className="text-left p-4 font-semibold">Hotel</th>
                  <th className="text-left p-4 font-semibold">Dates</th>
                  <th className="text-left p-4 font-semibold">Status</th>
                  <th className="text-left p-4 font-semibold">Amount</th>
                  <th className="text-left p-4 font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody>
                {bookings.map((booking) => (
                  <tr key={booking.id} className="border-b hover:bg-gray-50">
                    <td className="p-4 font-mono">#{booking.id.toString().padStart(4, '0')}</td>
                    <td className="p-4 font-medium">{booking.customer}</td>
                    <td className="p-4">{booking.hotel}</td>
                    <td className="p-4">{booking.dates}</td>
                    <td className="p-4">
                      <Badge variant={getStatusColor(booking.status)}>
                        {booking.status}
                      </Badge>
                    </td>
                    <td className="p-4 font-semibold">{booking.amount}</td>
                    <td className="p-4">
                      <Button size="sm" variant="outline">
                        <Eye className="w-4 h-4" />
                      </Button>
                    </td>
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
