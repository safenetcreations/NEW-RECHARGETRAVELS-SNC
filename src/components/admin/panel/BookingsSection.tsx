
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { 
  Search, 
  Filter, 
  Eye, 
  Download, 
  Calendar,
  User,
  MapPin,
  Phone,
  Mail,
  CreditCard,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  Edit,
  Trash2,
  Plus,
  BarChart3,
  TrendingUp,
  DollarSign
} from 'lucide-react';

interface Booking {
  id: number;
  customer: string;
  email: string;
  phone: string;
  hotel: string;
  destination: string;
  dates: string;
  guests: number;
  status: 'confirmed' | 'pending' | 'cancelled' | 'completed';
  amount: number;
  paymentStatus: 'paid' | 'pending' | 'failed';
  bookingType: 'hotel' | 'tour' | 'transport' | 'experience';
  createdAt: string;
  specialRequests?: string;
}

const BookingsSection: React.FC = () => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [filteredBookings, setFilteredBookings] = useState<Booking[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [stats, setStats] = useState({
    total: 0,
    confirmed: 0,
    pending: 0,
    cancelled: 0,
    revenue: 0
  });

  useEffect(() => {
    loadBookings();
  }, []);

  useEffect(() => {
    filterBookings();
  }, [bookings, searchTerm, statusFilter, typeFilter]);

  const loadBookings = () => {
    // Mock data - replace with actual API call
    const mockBookings: Booking[] = [
      {
        id: 1,
        customer: 'John Doe',
        email: 'john.doe@email.com',
        phone: '+94 71 234 5678',
        hotel: 'Luxury Beach Resort',
        destination: 'Mirissa',
        dates: '2024-02-15 to 2024-02-20',
        guests: 2,
        status: 'confirmed',
        amount: 1250,
        paymentStatus: 'paid',
        bookingType: 'hotel',
        createdAt: '2024-01-15',
        specialRequests: 'Ocean view room preferred'
      },
      {
        id: 2,
        customer: 'Jane Smith',
        email: 'jane.smith@email.com',
        phone: '+94 77 345 6789',
        hotel: 'Mountain View Lodge',
        destination: 'Nuwara Eliya',
        dates: '2024-02-18 to 2024-02-22',
        guests: 4,
        status: 'pending',
        amount: 850,
        paymentStatus: 'pending',
        bookingType: 'hotel',
        createdAt: '2024-01-16'
      },
      {
        id: 3,
        customer: 'Mike Johnson',
        email: 'mike.johnson@email.com',
        phone: '+94 76 456 7890',
        hotel: 'Wildlife Safari Camp',
        destination: 'Yala National Park',
        dates: '2024-02-20 to 2024-02-25',
        guests: 3,
        status: 'cancelled',
        amount: 1100,
        paymentStatus: 'failed',
        bookingType: 'tour',
        createdAt: '2024-01-14'
      },
      {
        id: 4,
        customer: 'Sarah Wilson',
        email: 'sarah.wilson@email.com',
        phone: '+94 75 567 8901',
        hotel: 'Cultural Heritage Hotel',
        destination: 'Kandy',
        dates: '2024-02-25 to 2024-02-28',
        guests: 2,
        status: 'confirmed',
        amount: 750,
        paymentStatus: 'paid',
        bookingType: 'hotel',
        createdAt: '2024-01-17',
        specialRequests: 'Vegetarian meal options'
      },
      {
        id: 5,
        customer: 'David Brown',
        email: 'david.brown@email.com',
        phone: '+94 78 678 9012',
        hotel: 'Sigiriya Rock Hotel',
        destination: 'Sigiriya',
        dates: '2024-03-01 to 2024-03-03',
        guests: 1,
        status: 'pending',
        amount: 450,
        paymentStatus: 'pending',
        bookingType: 'hotel',
        createdAt: '2024-01-18'
      }
    ];

    setBookings(mockBookings);
    calculateStats(mockBookings);
  };

  const calculateStats = (bookingList: Booking[]) => {
    const total = bookingList.length;
    const confirmed = bookingList.filter(b => b.status === 'confirmed').length;
    const pending = bookingList.filter(b => b.status === 'pending').length;
    const cancelled = bookingList.filter(b => b.status === 'cancelled').length;
    const revenue = bookingList
      .filter(b => b.status === 'confirmed')
      .reduce((sum, b) => sum + b.amount, 0);

    setStats({ total, confirmed, pending, cancelled, revenue });
  };

  const filterBookings = () => {
    let filtered = bookings;

    if (searchTerm) {
      filtered = filtered.filter(booking =>
        booking.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
        booking.hotel.toLowerCase().includes(searchTerm.toLowerCase()) ||
        booking.destination.toLowerCase().includes(searchTerm.toLowerCase()) ||
        booking.email.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (statusFilter !== 'all') {
      filtered = filtered.filter(booking => booking.status === statusFilter);
    }

    if (typeFilter !== 'all') {
      filtered = filtered.filter(booking => booking.bookingType === typeFilter);
    }

    setFilteredBookings(filtered);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      case 'completed': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPaymentStatusColor = (status: string) => {
    switch (status) {
      case 'paid': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'failed': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getBookingTypeIcon = (type: string) => {
    switch (type) {
      case 'hotel': return <MapPin className="w-4 h-4" />;
      case 'tour': return <BarChart3 className="w-4 h-4" />;
      case 'transport': return <TrendingUp className="w-4 h-4" />;
      case 'experience': return <DollarSign className="w-4 h-4" />;
      default: return <Calendar className="w-4 h-4" />;
    }
  };

  const handleStatusChange = (bookingId: number, newStatus: Booking['status']) => {
    setBookings(prev => 
      prev.map(booking => 
        booking.id === bookingId 
          ? { ...booking, status: newStatus }
          : booking
      )
    );
  };

  const exportBookings = () => {
    // Implementation for exporting bookings data
    console.log('Exporting bookings...');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Bookings Management</h2>
          <p className="text-gray-600">Manage all customer bookings and reservations</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={exportBookings}>
            <Download className="w-4 h-4 mr-2" />
            Export Data
          </Button>
          <Button>
            <Plus className="w-4 h-4 mr-2" />
            New Booking
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Bookings</p>
                <p className="text-2xl font-bold">{stats.total}</p>
              </div>
              <Calendar className="w-8 h-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Confirmed</p>
                <p className="text-2xl font-bold text-green-600">{stats.confirmed}</p>
              </div>
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Pending</p>
                <p className="text-2xl font-bold text-yellow-600">{stats.pending}</p>
              </div>
              <Clock className="w-8 h-8 text-yellow-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Cancelled</p>
                <p className="text-2xl font-bold text-red-600">{stats.cancelled}</p>
              </div>
              <XCircle className="w-8 h-8 text-red-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Revenue</p>
                <p className="text-2xl font-bold text-green-600">${stats.revenue.toLocaleString()}</p>
              </div>
              <DollarSign className="w-8 h-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex gap-4 flex-wrap">
            <div className="relative flex-1 min-w-[300px]">
              <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <Input 
                placeholder="Search by customer, hotel, destination..." 
                className="pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="confirmed">Confirmed</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="cancelled">Cancelled</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
              </SelectContent>
            </Select>
            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="hotel">Hotel</SelectItem>
                <SelectItem value="tour">Tour</SelectItem>
                <SelectItem value="transport">Transport</SelectItem>
                <SelectItem value="experience">Experience</SelectItem>
              </SelectContent>
            </Select>
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
          <CardTitle>Bookings ({filteredBookings.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-4 font-semibold">ID</th>
                  <th className="text-left p-4 font-semibold">Customer</th>
                  <th className="text-left p-4 font-semibold">Type</th>
                  <th className="text-left p-4 font-semibold">Destination</th>
                  <th className="text-left p-4 font-semibold">Dates</th>
                  <th className="text-left p-4 font-semibold">Guests</th>
                  <th className="text-left p-4 font-semibold">Amount</th>
                  <th className="text-left p-4 font-semibold">Status</th>
                  <th className="text-left p-4 font-semibold">Payment</th>
                  <th className="text-left p-4 font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredBookings.map((booking) => (
                  <tr key={booking.id} className="border-b hover:bg-gray-50">
                    <td className="p-4 font-mono">#{booking.id.toString().padStart(4, '0')}</td>
                    <td className="p-4">
                      <div>
                        <p className="font-medium">{booking.customer}</p>
                        <p className="text-sm text-gray-600">{booking.email}</p>
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        {getBookingTypeIcon(booking.bookingType)}
                        <span className="capitalize">{booking.bookingType}</span>
                      </div>
                    </td>
                    <td className="p-4">
                      <div>
                        <p className="font-medium">{booking.hotel}</p>
                        <p className="text-sm text-gray-600">{booking.destination}</p>
                      </div>
                    </td>
                    <td className="p-4 text-sm">{booking.dates}</td>
                    <td className="p-4 text-center">{booking.guests}</td>
                    <td className="p-4 font-semibold">${booking.amount}</td>
                    <td className="p-4">
                      <Badge className={getStatusColor(booking.status)}>
                        {booking.status}
                      </Badge>
                    </td>
                    <td className="p-4">
                      <Badge className={getPaymentStatusColor(booking.paymentStatus)}>
                        {booking.paymentStatus}
                      </Badge>
                    </td>
                    <td className="p-4">
                      <div className="flex gap-2">
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button 
                              size="sm" 
                              variant="outline"
                              onClick={() => setSelectedBooking(booking)}
                            >
                              <Eye className="w-4 h-4" />
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="max-w-2xl">
                            <DialogHeader>
                              <DialogTitle>Booking Details - #{booking.id.toString().padStart(4, '0')}</DialogTitle>
                            </DialogHeader>
                            {selectedBooking && (
                              <div className="space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                  <div>
                                    <h4 className="font-semibold mb-2">Customer Information</h4>
                                    <div className="space-y-2">
                                      <p><User className="w-4 h-4 inline mr-2" />{selectedBooking.customer}</p>
                                      <p><Mail className="w-4 h-4 inline mr-2" />{selectedBooking.email}</p>
                                      <p><Phone className="w-4 h-4 inline mr-2" />{selectedBooking.phone}</p>
                                    </div>
                                  </div>
                                  <div>
                                    <h4 className="font-semibold mb-2">Booking Information</h4>
                                    <div className="space-y-2">
                                      <p><MapPin className="w-4 h-4 inline mr-2" />{selectedBooking.hotel}</p>
                                      <p><Calendar className="w-4 h-4 inline mr-2" />{selectedBooking.dates}</p>
                                      <p><User className="w-4 h-4 inline mr-2" />{selectedBooking.guests} guests</p>
                                      <p><CreditCard className="w-4 h-4 inline mr-2" />${selectedBooking.amount}</p>
                                    </div>
                                  </div>
                                </div>
                                {selectedBooking.specialRequests && (
                                  <div>
                                    <h4 className="font-semibold mb-2">Special Requests</h4>
                                    <p className="text-gray-600">{selectedBooking.specialRequests}</p>
                                  </div>
                                )}
                                <div className="flex gap-2 pt-4">
                                  <Select 
                                    value={selectedBooking.status} 
                                    onValueChange={(value: Booking['status']) => 
                                      handleStatusChange(selectedBooking.id, value)
                                    }
                                  >
                                    <SelectTrigger>
                                      <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                      <SelectItem value="confirmed">Confirmed</SelectItem>
                                      <SelectItem value="pending">Pending</SelectItem>
                                      <SelectItem value="cancelled">Cancelled</SelectItem>
                                      <SelectItem value="completed">Completed</SelectItem>
                                    </SelectContent>
                                  </Select>
                                  <Button variant="outline">
                                    <Edit className="w-4 h-4 mr-2" />
                                    Edit
                                  </Button>
                                  <Button variant="outline" className="text-red-600">
                                    <Trash2 className="w-4 h-4 mr-2" />
                                    Delete
                                  </Button>
                                </div>
                              </div>
                            )}
                          </DialogContent>
                        </Dialog>
                        <Button size="sm" variant="outline">
                          <Edit className="w-4 h-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {filteredBookings.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              No bookings found matching your criteria.
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default BookingsSection;
