import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Plus,
  Edit2,
  Trash2,
  Search,
} from 'lucide-react';
import { toast } from 'sonner';
import BookingFormDialog from './BookingFormDialog';
import { firebaseBookingService, Booking } from '../../../services/firebaseBookingService';

interface BookingsManagementProps {
  className?: string;
}

const BookingsManagement: React.FC<BookingsManagementProps> = ({ className }) => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [filteredBookings, setFilteredBookings] = useState<Booking[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);

  useEffect(() => {
    loadBookings();
  }, []);

  useEffect(() => {
    let filtered = bookings;

    if (searchTerm) {
      filtered = filtered.filter(
        booking =>
          booking.userId.toLowerCase().includes(searchTerm.toLowerCase()) ||
          booking.tourId.toLowerCase().includes(searchTerm.toLowerCase()) ||
          booking.hotelId.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredBookings(filtered);
  }, [bookings, searchTerm]);

  const loadBookings = async () => {
    setIsLoading(true);
    try {
      const data = await firebaseBookingService.getAllBookings();
      setBookings(data);
      setFilteredBookings(data);
      toast.success(`Loaded ${data.length} bookings successfully`);
    } catch (error) {
      console.error('Error loading bookings:', error);
      toast.error('Failed to load bookings');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreate = () => {
    setSelectedBooking(null);
    setIsFormOpen(true);
  };

  const handleEdit = (booking: Booking) => {
    setSelectedBooking(booking);
    setIsFormOpen(true);
  };

  const handleDelete = async (bookingId: string) => {
    if (!confirm(`Are you sure you want to delete this booking?`)) {
      return;
    }

    try {
      await firebaseBookingService.deleteBooking(bookingId);
      toast.success('Booking deleted successfully');
      loadBookings();
    } catch (error) {
      console.error('Error deleting booking:', error);
      toast.error('Failed to delete booking');
    }
  };

  const handleFormSubmit = async (bookingData: Partial<Booking>) => {
    try {
      if (selectedBooking) {
        await firebaseBookingService.updateBooking(selectedBooking.id, bookingData);
        toast.success('Booking updated successfully');
      } else {
        await firebaseBookingService.createBooking(bookingData as Omit<Booking, 'id' | 'createdAt' | 'updatedAt'>);
        toast.success('Booking created successfully');
      }
      setIsFormOpen(false);
      loadBookings();
    } catch (error) {
      console.error('Error saving booking:', error);
      toast.error('Failed to save booking');
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className={className}>
      <Card className="mb-6 border-0 shadow-lg bg-gradient-to-br from-blue-50 to-indigo-50">
        <CardHeader>
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <CardTitle className="text-3xl font-bold text-gray-900 mb-2">
                Bookings Management
              </CardTitle>
              <p className="text-gray-600">
                Manage all bookings
              </p>
            </div>
            <Button
              onClick={handleCreate}
              size="lg"
              className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-lg"
            >
              <Plus className="w-5 h-5 mr-2" />
              Create New Booking
            </Button>
          </div>
        </CardHeader>
      </Card>

      <Card className="mb-6 shadow-md">
        <CardContent className="pt-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <Input
              type="text"
              placeholder="Search bookings by user, tour, or hotel..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredBookings.map((booking) => (
          <Card
            key={booking.id}
            className="overflow-hidden hover:shadow-2xl transition-all duration-300 border-0 shadow-lg group"
          >
            <CardContent className="p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors">
                Booking ID: {booking.id}
              </h3>
              <p className="text-gray-600 text-sm mb-4 line-clamp-2">User ID: {booking.userId}</p>
              <p className="text-gray-600 text-sm mb-4 line-clamp-2">Tour ID: {booking.tourId}</p>
              <p className="text-gray-600 text-sm mb-4 line-clamp-2">Hotel ID: {booking.hotelId}</p>

              <div className="flex gap-2">
                <Button
                  onClick={() => handleEdit(booking)}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
                  size="sm"
                >
                  <Edit2 className="w-4 h-4 mr-2" />
                  Edit
                </Button>
                                  <Button
                                    onClick={() => handleDelete(booking.id)}
                                    variant="destructive"
                                    size="sm"
                                    className="flex-1"
                                  >
                                    <Trash2 className="w-4 h-4 mr-2" />
                                    Delete
                                  </Button>              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredBookings.length === 0 && (
        <Card className="shadow-md">
          <CardContent className="py-12 text-center">
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No Bookings Found</h3>
            <p className="text-gray-600 mb-6">
              {searchTerm
                ? 'Try adjusting your filters'
                : 'Get started by creating your first booking'}
            </p>
            {!searchTerm && (
              <Button onClick={handleCreate} className="bg-blue-600 hover:bg-blue-700">
                <Plus className="w-4 h-4 mr-2" />
                Create Your First Booking
              </Button>
            )}
          </CardContent>
        </Card>
      )}

      <BookingFormDialog
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        onSubmit={handleFormSubmit}
        booking={selectedBooking}
      />
    </div>
  );
};

export default BookingsManagement;
