// Global Tour Bookings Manager Component
// Admin panel for managing all tour bookings

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Search,
  RefreshCw,
  Eye,
  Mail,
  MessageCircle,
  Calendar,
  MapPin,
  Users,
  DollarSign,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  Phone,
  Globe,
  Filter,
  Download,
  Printer,
  MoreVertical
} from 'lucide-react';
import { toast } from 'sonner';
import {
  GlobalTourBooking,
  BookingStatus,
  PaymentStatus,
  getAllBookingsAdmin,
  getBookingById,
  updateBookingStatus,
  updatePaymentStatus,
  assignGuide,
  markConfirmationSent,
  getBookingStatistics,
  BookingStatistics
} from '../../../services/globalTourAdminService';

interface GlobalTourBookingsManagerProps {
  className?: string;
}

const statusColors: Record<BookingStatus, string> = {
  'pending': 'bg-yellow-100 text-yellow-800 border-yellow-200',
  'confirmed': 'bg-green-100 text-green-800 border-green-200',
  'cancelled': 'bg-red-100 text-red-800 border-red-200',
  'completed': 'bg-blue-100 text-blue-800 border-blue-200',
  'refunded': 'bg-purple-100 text-purple-800 border-purple-200'
};

const paymentStatusColors: Record<PaymentStatus, string> = {
  'unpaid': 'bg-red-100 text-red-800',
  'partial': 'bg-orange-100 text-orange-800',
  'paid': 'bg-green-100 text-green-800',
  'refunded': 'bg-purple-100 text-purple-800'
};

const GlobalTourBookingsManager: React.FC<GlobalTourBookingsManagerProps> = ({ className }) => {
  const [bookings, setBookings] = useState<GlobalTourBooking[]>([]);
  const [filteredBookings, setFilteredBookings] = useState<GlobalTourBooking[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [paymentFilter, setPaymentFilter] = useState<string>('all');
  const [stats, setStats] = useState<BookingStatistics | null>(null);
  const [selectedBooking, setSelectedBooking] = useState<GlobalTourBooking | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);

  // Load bookings on mount
  useEffect(() => {
    loadBookings();
    loadStats();
  }, []);

  // Filter bookings
  useEffect(() => {
    let filtered = bookings;

    if (searchTerm) {
      const search = searchTerm.toLowerCase();
      filtered = filtered.filter(
        booking =>
          booking.bookingReference.toLowerCase().includes(search) ||
          booking.customer.firstName.toLowerCase().includes(search) ||
          booking.customer.lastName.toLowerCase().includes(search) ||
          booking.customer.email.toLowerCase().includes(search) ||
          booking.tourTitle.toLowerCase().includes(search)
      );
    }

    if (statusFilter !== 'all') {
      filtered = filtered.filter(booking => booking.status === statusFilter);
    }

    if (paymentFilter !== 'all') {
      filtered = filtered.filter(booking => booking.paymentStatus === paymentFilter);
    }

    setFilteredBookings(filtered);
  }, [bookings, searchTerm, statusFilter, paymentFilter]);

  const loadBookings = async () => {
    setIsLoading(true);
    try {
      const data = await getAllBookingsAdmin();
      setBookings(data);
      setFilteredBookings(data);
    } catch (error) {
      console.error('Error loading bookings:', error);
      toast.error('Failed to load bookings');
    } finally {
      setIsLoading(false);
    }
  };

  const loadStats = async () => {
    try {
      const data = await getBookingStatistics();
      setStats(data);
    } catch (error) {
      console.error('Error loading stats:', error);
    }
  };

  const handleViewDetails = (booking: GlobalTourBooking) => {
    setSelectedBooking(booking);
    setIsDetailOpen(true);
  };

  const handleUpdateStatus = async (bookingId: string, newStatus: BookingStatus) => {
    try {
      await updateBookingStatus(bookingId, newStatus);
      toast.success(`Booking status updated to ${newStatus}`);
      loadBookings();
      if (selectedBooking?.id === bookingId) {
        const updated = await getBookingById(bookingId);
        if (updated) setSelectedBooking(updated);
      }
    } catch (error) {
      console.error('Error updating status:', error);
      toast.error('Failed to update booking status');
    }
  };

  const handleUpdatePayment = async (bookingId: string, newStatus: PaymentStatus) => {
    try {
      await updatePaymentStatus(bookingId, newStatus);
      toast.success(`Payment status updated to ${newStatus}`);
      loadBookings();
      if (selectedBooking?.id === bookingId) {
        const updated = await getBookingById(bookingId);
        if (updated) setSelectedBooking(updated);
      }
    } catch (error) {
      console.error('Error updating payment:', error);
      toast.error('Failed to update payment status');
    }
  };

  const handleSendEmail = async (booking: GlobalTourBooking) => {
    try {
      // This would trigger the Cloud Function to send email
      await markConfirmationSent(booking.id, 'email');
      toast.success('Email confirmation sent');
      loadBookings();
    } catch (error) {
      console.error('Error sending email:', error);
      toast.error('Failed to send email');
    }
  };

  const handleSendWhatsApp = (booking: GlobalTourBooking) => {
    const phone = booking.customer.whatsappNumber || booking.customer.phone;
    const message = encodeURIComponent(
      `Hi ${booking.customer.firstName}! Your booking for "${booking.tourTitle}" (Ref: ${booking.bookingReference}) has been confirmed. Travel Date: ${booking.travelDate}. Thank you for choosing Recharge Travels!`
    );
    window.open(`https://wa.me/${phone.replace(/\D/g, '')}?text=${message}`, '_blank');
    markConfirmationSent(booking.id, 'whatsapp');
    toast.success('WhatsApp opened');
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const formatTimestamp = (timestamp: any) => {
    if (!timestamp) return 'N/A';
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600"></div>
      </div>
    );
  }

  return (
    <div className={className}>
      {/* Header Section */}
      <Card className="mb-6 border-0 shadow-lg bg-gradient-to-br from-blue-50 to-indigo-50">
        <CardHeader>
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <CardTitle className="text-3xl font-bold text-gray-900 mb-2 flex items-center gap-3">
                <Calendar className="w-8 h-8 text-blue-600" />
                Tour Bookings Management
              </CardTitle>
              <p className="text-gray-600">
                Manage and track all tour booking requests, payments, and communications
              </p>
            </div>
            <div className="flex gap-3">
              <Button onClick={loadBookings} variant="outline" className="bg-white">
                <RefreshCw className="w-5 h-5 mr-2" />
                Refresh
              </Button>
              <Button variant="outline" className="bg-white">
                <Download className="w-5 h-5 mr-2" />
                Export
              </Button>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
        <Card className="border-l-4 border-l-blue-500 shadow-md">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Bookings</p>
                <h3 className="text-3xl font-bold text-gray-900">{stats?.totalBookings || 0}</h3>
              </div>
              <div className="p-3 bg-blue-100 rounded-full">
                <Calendar className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-yellow-500 shadow-md">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Pending</p>
                <h3 className="text-3xl font-bold text-gray-900">{stats?.pendingBookings || 0}</h3>
              </div>
              <div className="p-3 bg-yellow-100 rounded-full">
                <AlertCircle className="w-6 h-6 text-yellow-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-green-500 shadow-md">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Confirmed</p>
                <h3 className="text-3xl font-bold text-gray-900">{stats?.confirmedBookings || 0}</h3>
              </div>
              <div className="p-3 bg-green-100 rounded-full">
                <CheckCircle className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-indigo-500 shadow-md">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Completed</p>
                <h3 className="text-3xl font-bold text-gray-900">{stats?.completedBookings || 0}</h3>
              </div>
              <div className="p-3 bg-indigo-100 rounded-full">
                <CheckCircle className="w-6 h-6 text-indigo-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-purple-500 shadow-md">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Revenue</p>
                <h3 className="text-2xl font-bold text-gray-900">
                  ${(stats?.totalRevenue || 0).toLocaleString()}
                </h3>
              </div>
              <div className="p-3 bg-purple-100 rounded-full">
                <DollarSign className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card className="mb-6 shadow-md">
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="md:col-span-2 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <Input
                type="text"
                placeholder="Search by reference, customer, or tour..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="confirmed">Confirmed</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
              <option value="refunded">Refunded</option>
            </select>
            <select
              value={paymentFilter}
              onChange={(e) => setPaymentFilter(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Payment Status</option>
              <option value="unpaid">Unpaid</option>
              <option value="partial">Partial Payment</option>
              <option value="paid">Paid</option>
              <option value="refunded">Refunded</option>
            </select>
          </div>
        </CardContent>
      </Card>

      {/* Bookings Table */}
      <Card className="shadow-lg">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Booking Reference
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Customer
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Tour
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Travel Date
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Travelers
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Amount
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredBookings.map((booking) => (
                <tr key={booking.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="font-mono font-semibold text-blue-600">
                      {booking.bookingReference}
                    </div>
                    <div className="text-xs text-gray-500">
                      {formatTimestamp(booking.createdAt)}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="font-medium text-gray-900">
                      {booking.customer.firstName} {booking.customer.lastName}
                    </div>
                    <div className="text-sm text-gray-500">{booking.customer.email}</div>
                    <div className="text-sm text-gray-500">{booking.customer.phone}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="font-medium text-gray-900 max-w-xs truncate">
                      {booking.tourTitle}
                    </div>
                    <div className="text-sm text-gray-500">
                      {booking.tourDuration.days}D/{booking.tourDuration.nights}N
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="font-medium">{formatDate(booking.travelDate)}</div>
                    <div className="text-sm text-gray-500">to {formatDate(booking.endDate)}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-1">
                      <Users className="w-4 h-4 text-gray-400" />
                      <span>{booking.travelers.adults} Adults</span>
                    </div>
                    {booking.travelers.children > 0 && (
                      <div className="text-sm text-gray-500">{booking.travelers.children} Children</div>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-lg font-bold text-emerald-600">
                      ${booking.payment.totalAmountUSD.toLocaleString()}
                    </div>
                    <Badge className={paymentStatusColors[booking.paymentStatus]}>
                      {booking.paymentStatus}
                    </Badge>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <Badge className={statusColors[booking.status]}>
                      {booking.status}
                    </Badge>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleViewDetails(booking)}
                      >
                        <Eye className="w-4 h-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleSendEmail(booking)}
                        className={booking.emailConfirmationSent ? 'text-green-600' : ''}
                      >
                        <Mail className="w-4 h-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleSendWhatsApp(booking)}
                        className="text-green-600"
                      >
                        <MessageCircle className="w-4 h-4" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {filteredBookings.length === 0 && (
            <div className="text-center py-12">
              <Calendar className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No Bookings Found</h3>
              <p className="text-gray-600">
                {searchTerm || statusFilter !== 'all' || paymentFilter !== 'all'
                  ? 'Try adjusting your filters'
                  : 'Bookings will appear here when customers make reservations'}
              </p>
            </div>
          )}
        </div>
      </Card>

      {/* Booking Detail Dialog */}
      <Dialog open={isDetailOpen} onOpenChange={setIsDetailOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          {selectedBooking && (
            <>
              <DialogHeader>
                <DialogTitle className="text-2xl font-bold flex items-center gap-2">
                  <Calendar className="w-6 h-6 text-blue-600" />
                  Booking Details
                </DialogTitle>
                <DialogDescription>
                  Reference: {selectedBooking.bookingReference}
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-6 mt-4">
                {/* Status and Payment */}
                <div className="flex gap-4">
                  <div className="flex-1">
                    <Label>Booking Status</Label>
                    <select
                      value={selectedBooking.status}
                      onChange={(e) => handleUpdateStatus(selectedBooking.id, e.target.value as BookingStatus)}
                      className="w-full mt-1 px-3 py-2 border rounded-md"
                    >
                      <option value="pending">Pending</option>
                      <option value="confirmed">Confirmed</option>
                      <option value="completed">Completed</option>
                      <option value="cancelled">Cancelled</option>
                      <option value="refunded">Refunded</option>
                    </select>
                  </div>
                  <div className="flex-1">
                    <Label>Payment Status</Label>
                    <select
                      value={selectedBooking.paymentStatus}
                      onChange={(e) => handleUpdatePayment(selectedBooking.id, e.target.value as PaymentStatus)}
                      className="w-full mt-1 px-3 py-2 border rounded-md"
                    >
                      <option value="unpaid">Unpaid</option>
                      <option value="partial">Partial Payment</option>
                      <option value="paid">Paid</option>
                      <option value="refunded">Refunded</option>
                    </select>
                  </div>
                </div>

                {/* Tour Info */}
                <div className="p-4 bg-emerald-50 rounded-lg">
                  <h3 className="font-semibold text-emerald-800 mb-2">{selectedBooking.tourTitle}</h3>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-emerald-600" />
                      {formatDate(selectedBooking.travelDate)} - {formatDate(selectedBooking.endDate)}
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-emerald-600" />
                      {selectedBooking.tourDuration.days} Days / {selectedBooking.tourDuration.nights} Nights
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-emerald-600" />
                      Pickup: {selectedBooking.pickupLocation}
                    </div>
                    <div className="flex items-center gap-2">
                      <DollarSign className="w-4 h-4 text-emerald-600" />
                      Total: ${selectedBooking.payment.totalAmountUSD.toLocaleString()}
                    </div>
                  </div>
                </div>

                {/* Customer Info */}
                <div className="p-4 bg-blue-50 rounded-lg">
                  <h4 className="font-semibold text-blue-800 mb-3">Customer Information</h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label className="text-blue-600">Name</Label>
                      <p className="font-medium">{selectedBooking.customer.firstName} {selectedBooking.customer.lastName}</p>
                    </div>
                    <div>
                      <Label className="text-blue-600">Nationality</Label>
                      <p className="font-medium">{selectedBooking.customer.nationality}</p>
                    </div>
                    <div>
                      <Label className="text-blue-600">Email</Label>
                      <p className="font-medium">{selectedBooking.customer.email}</p>
                    </div>
                    <div>
                      <Label className="text-blue-600">Phone</Label>
                      <p className="font-medium">{selectedBooking.customer.phone}</p>
                    </div>
                  </div>
                </div>

                {/* Travelers */}
                <div className="p-4 bg-gray-50 rounded-lg">
                  <h4 className="font-semibold text-gray-800 mb-3">Travelers</h4>
                  <div className="flex gap-6">
                    <div>
                      <span className="text-2xl font-bold text-gray-900">{selectedBooking.travelers.adults}</span>
                      <span className="text-gray-600 ml-2">Adults</span>
                    </div>
                    <div>
                      <span className="text-2xl font-bold text-gray-900">{selectedBooking.travelers.children}</span>
                      <span className="text-gray-600 ml-2">Children</span>
                    </div>
                    <div>
                      <span className="text-2xl font-bold text-gray-900">{selectedBooking.travelers.infants}</span>
                      <span className="text-gray-600 ml-2">Infants</span>
                    </div>
                  </div>
                </div>

                {/* Notes */}
                {selectedBooking.additionalNotes && (
                  <div className="p-4 bg-yellow-50 rounded-lg">
                    <h4 className="font-semibold text-yellow-800 mb-2">Customer Notes</h4>
                    <p className="text-gray-700">{selectedBooking.additionalNotes}</p>
                  </div>
                )}

                {/* Flight Details */}
                {selectedBooking.flightDetails && (
                  <div className="p-4 bg-indigo-50 rounded-lg">
                    <h4 className="font-semibold text-indigo-800 mb-2">Flight Details</h4>
                    <p className="text-gray-700">{selectedBooking.flightDetails}</p>
                  </div>
                )}

                {/* Admin Notes */}
                <div>
                  <Label>Admin Notes</Label>
                  <Textarea
                    placeholder="Add internal notes about this booking..."
                    value={selectedBooking.adminNotes || ''}
                    className="mt-1"
                    rows={3}
                  />
                </div>

                {/* Actions */}
                <div className="flex justify-between items-center pt-4 border-t">
                  <div className="flex gap-2">
                    <Button
                      onClick={() => handleSendEmail(selectedBooking)}
                      variant="outline"
                      className={selectedBooking.emailConfirmationSent ? 'text-green-600 border-green-300' : ''}
                    >
                      <Mail className="w-4 h-4 mr-2" />
                      {selectedBooking.emailConfirmationSent ? 'Email Sent' : 'Send Email'}
                    </Button>
                    <Button
                      onClick={() => handleSendWhatsApp(selectedBooking)}
                      variant="outline"
                      className="text-green-600"
                    >
                      <MessageCircle className="w-4 h-4 mr-2" />
                      WhatsApp
                    </Button>
                    <Button variant="outline">
                      <Printer className="w-4 h-4 mr-2" />
                      Print
                    </Button>
                  </div>
                  <Button onClick={() => setIsDetailOpen(false)}>
                    Close
                  </Button>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default GlobalTourBookingsManager;
