import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Bus, Users, Mail, Phone, Search, Filter, RefreshCw, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import {
  getBookings,
  updateBookingStatus,
  deleteBooking,
  GroupBooking,
} from '../../../../../src/services/allBookingService';

type Booking = GroupBooking & { id?: string };

const GroupTransportBookingsManagement: React.FC = () => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(false);
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');

  const loadBookings = async () => {
    setLoading(true);
    try {
      const data = await getBookings('group-transport');
      setBookings(data as Booking[]);
    } catch (error) {
      console.error('Error loading group transport bookings:', error);
      toast.error('Failed to load group transport bookings');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadBookings();
  }, []);

  const handleStatusChange = async (id: string, status: Booking['status']) => {
    try {
      await updateBookingStatus('group-transport', id, status);
      toast.success('Booking status updated');
      loadBookings();
    } catch (error) {
      console.error('Error updating booking status:', error);
      toast.error('Failed to update status');
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Delete this group transport booking?')) {
      return;
    }
    try {
      await deleteBooking('group-transport', id);
      toast.success('Booking deleted');
      loadBookings();
    } catch (error) {
      console.error('Error deleting booking:', error);
      toast.error('Failed to delete booking');
    }
  };

  const filteredBookings = bookings.filter((booking) => {
    if (statusFilter !== 'all' && booking.status !== statusFilter) {
      return false;
    }
    if (!searchTerm) {
      return true;
    }
    const term = searchTerm.toLowerCase();
    return (
      (booking.bookingReference || '').toLowerCase().includes(term) ||
      (booking.contactName || '').toLowerCase().includes(term) ||
      (booking.contactEmail || '').toLowerCase().includes(term) ||
      (booking.pickupLocation || '').toLowerCase().includes(term) ||
      (booking.dropoffLocation || '').toLowerCase().includes(term)
    );
  });

  const getStatusClasses = (status: Booking['status']) => {
    if (status === 'pending') {
      return 'bg-yellow-100 text-yellow-800';
    }
    if (status === 'confirmed') {
      return 'bg-green-100 text-green-800';
    }
    if (status === 'completed') {
      return 'bg-blue-100 text-blue-800';
    }
    return 'bg-red-100 text-red-800';
  };

  return (
    <div className="space-y-6">
      <Card className="border-0 shadow-2xl bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50">
        <CardHeader className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <CardTitle className="flex items-center gap-2 text-2xl">
              <Bus className="w-6 h-6 text-green-600" />
              Group Transport Bookings
            </CardTitle>
            <p className="text-gray-600 mt-1">
              View and manage enquiries for group transport coaches, vans and buses.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={loadBookings}
              disabled={loading}
            >
              <RefreshCw className="w-4 h-4 mr-1" />
              Refresh
            </Button>
          </div>
        </CardHeader>
      </Card>

      <Card className="shadow-md">
        <CardContent className="pt-6 space-y-4">
          <div className="grid gap-4 md:grid-cols-3">
            <div className="md:col-span-2 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                placeholder="Search by reference, name, email or route"
                className="pl-9"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="flex items-center gap-2 justify-end">
              <Filter className="w-4 h-4 text-gray-500" />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="border rounded-md px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-500"
              >
                <option value="all">All statuses</option>
                <option value="pending">Pending</option>
                <option value="confirmed">Confirmed</option>
                <option value="completed">Completed</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      {loading ? (
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600" />
        </div>
      ) : (
        <>
          {filteredBookings.length === 0 ? (
            <Card className="shadow-md">
              <CardContent className="py-12 text-center">
                <CardTitle className="text-xl mb-2">No Group Transport Bookings</CardTitle>
                <p className="text-gray-600">
                  Adjust your filters or wait for new enquiries from the group transport page.
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
              {filteredBookings.map((booking) => (
                <Card
                  key={booking.id || booking.bookingReference}
                  className="overflow-hidden border-0 shadow-lg hover:shadow-2xl transition-all duration-300"
                >
                  <CardHeader className="pb-3 flex flex-row items-start justify-between gap-2">
                    <div>
                      <CardTitle className="text-lg flex items-center gap-2">
                        <span className="font-mono">
                          {booking.bookingReference || booking.id}
                        </span>
                      </CardTitle>
                      <div className="mt-1 flex flex-wrap items-center gap-2 text-xs text-gray-500">
                        <span>
                          {booking.date} at {booking.time}
                        </span>
                        <span>•</span>
                        <span>{booking.passengers} passengers</span>
                        <span>•</span>
                        <span>{booking.vehicleType}</span>
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-2">
                      <Badge className={getStatusClasses(booking.status)}>
                        {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                      </Badge>
                      <select
                        value={booking.status}
                        onChange={(e) => handleStatusChange(booking.id as string, e.target.value as Booking['status'])}
                        className="border rounded-md px-2 py-1 text-xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-500"
                      >
                        <option value="pending">Pending</option>
                        <option value="confirmed">Confirmed</option>
                        <option value="completed">Completed</option>
                        <option value="cancelled">Cancelled</option>
                      </select>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3 text-sm">
                    <div className="flex items-center gap-2 text-gray-700">
                      <Users className="w-4 h-4 text-green-600" />
                      <span>{booking.contactName}</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-600">
                      <Mail className="w-4 h-4 text-gray-500" />
                      <span className="truncate">{booking.contactEmail}</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-600">
                      <Phone className="w-4 h-4 text-gray-500" />
                      <span>{booking.contactPhone}</span>
                    </div>
                    <div className="mt-2 text-gray-700">
                      <div className="font-semibold mb-1">Route</div>
                      <div className="text-sm">
                        {booking.pickupLocation} → {booking.dropoffLocation}
                      </div>
                      {booking.occasion && (
                        <div className="mt-1 text-xs text-gray-500">
                          Occasion: {booking.occasion}
                        </div>
                      )}
                    </div>
                    <div className="pt-3 border-t flex justify-between items-center">
                      <div className="text-xs text-gray-500">
                        Created reference {booking.bookingReference}
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-red-600 hover:text-red-700 hover:bg-red-50"
                        onClick={() => handleDelete(booking.id as string)}
                      >
                        <Trash2 className="w-3 h-3 mr-1" />
                        Delete
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default GroupTransportBookingsManagement;
