import { useEffect, useState } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { 
  ArrowLeft,
  Calendar,
  Users,
  DollarSign,
  Search,
  Filter,
  Download,
  X,
  Loader2,
  Package,
  ChevronDown
} from 'lucide-react';
import { useB2BAuth } from '@/contexts/B2BAuthContext';
import { useB2BApi } from '@/hooks/useB2BApi';
import { B2BBooking } from '@/types/b2b';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

const statusFilters = [
  { value: '', label: 'All Status' },
  { value: 'confirmed', label: 'Confirmed' },
  { value: 'pending', label: 'Pending' },
  { value: 'cancelled', label: 'Cancelled' }
];

const B2BMyBookings = () => {
  const { isAuthenticated, isLoading: authLoading } = useB2BAuth();
  const { getBookings, cancelBooking, loading } = useB2BApi();
  
  const [bookings, setBookings] = useState<B2BBooking[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [cancellingId, setCancellingId] = useState<string | null>(null);
  const [showCancelModal, setShowCancelModal] = useState<B2BBooking | null>(null);

  useEffect(() => {
    const fetchBookings = async () => {
      const result = await getBookings({
        status: statusFilter || undefined,
        limit: 100
      });
      if (result.success && result.data) {
        setBookings(result.data);
      }
    };

    if (isAuthenticated) {
      fetchBookings();
    }
  }, [isAuthenticated, statusFilter, getBookings]);

  const handleCancelBooking = async (bookingId: string) => {
    setCancellingId(bookingId);
    const result = await cancelBooking(bookingId);
    if (result.success) {
      setBookings(bookings.map(b => 
        b.id === bookingId ? { ...b, status: 'cancelled' as const } : b
      ));
    }
    setCancellingId(null);
    setShowCancelModal(null);
  };

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-100">
        <Loader2 className="w-8 h-8 animate-spin text-emerald-500" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/about/partners/b2b/login" replace />;
  }

  const filteredBookings = bookings.filter(booking =>
    booking.tourName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    booking.clientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    booking.id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'confirmed':
        return 'bg-emerald-100 text-emerald-700';
      case 'pending':
        return 'bg-amber-100 text-amber-700';
      case 'cancelled':
        return 'bg-red-100 text-red-700';
      default:
        return 'bg-slate-100 text-slate-700';
    }
  };

  return (
    <>
      <Helmet>
        <title>My Bookings | B2B Portal | Recharge Travels</title>
      </Helmet>
      
      <Header />
      
      <main className="min-h-screen bg-gradient-to-br from-slate-100 via-emerald-50/30 to-teal-50/30 py-8">
        <div className="container mx-auto px-4">
          {/* Header */}
          <div className="mb-8">
            <Link
              to="/about/partners/b2b/dashboard"
              className="inline-flex items-center gap-2 text-slate-600 hover:text-slate-900 mb-4"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Dashboard
            </Link>
            <h1 className="text-3xl font-bold text-slate-900 mb-2">My Bookings</h1>
            <p className="text-slate-600">View and manage all your tour bookings</p>
          </div>

          {/* Search & Filters */}
          <div className="bg-white rounded-2xl shadow-lg border border-slate-200/50 p-4 mb-8">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search by tour name, client, or booking ID..."
                  className="w-full pl-12 pr-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500"
                />
              </div>
              <div className="relative">
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="w-full md:w-48 pl-4 pr-10 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 appearance-none bg-white"
                >
                  {statusFilters.map((filter) => (
                    <option key={filter.value} value={filter.value}>{filter.label}</option>
                  ))}
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 pointer-events-none" />
              </div>
            </div>
          </div>

          {/* Bookings List */}
          {loading ? (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="w-8 h-8 animate-spin text-emerald-500" />
            </div>
          ) : filteredBookings.length > 0 ? (
            <div className="space-y-4">
              {filteredBookings.map((booking) => (
                <div
                  key={booking.id}
                  className="bg-white rounded-2xl shadow-lg border border-slate-200/50 overflow-hidden hover:shadow-xl transition-all"
                >
                  <div className="p-6">
                    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                      {/* Booking Info */}
                      <div className="flex-1">
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <h3 className="text-lg font-bold text-slate-900">{booking.tourName}</h3>
                            <p className="text-sm text-slate-500 font-mono">ID: {booking.id}</p>
                          </div>
                          <span className={`px-3 py-1 rounded-full text-xs font-semibold capitalize ${getStatusBadge(booking.status)}`}>
                            {booking.status}
                          </span>
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
                          <div className="flex items-center gap-2 text-sm">
                            <Calendar className="w-4 h-4 text-slate-400" />
                            <span className="text-slate-600">{booking.tourDate}</span>
                          </div>
                          <div className="flex items-center gap-2 text-sm">
                            <Users className="w-4 h-4 text-slate-400" />
                            <span className="text-slate-600">{booking.guestCount} guests</span>
                          </div>
                          <div className="flex items-center gap-2 text-sm">
                            <span className="text-slate-600">Client: {booking.clientName}</span>
                          </div>
                          <div className="flex items-center gap-2 text-sm font-semibold">
                            <DollarSign className="w-4 h-4 text-emerald-500" />
                            <span className="text-emerald-600">${booking.finalPrice.toFixed(2)}</span>
                          </div>
                        </div>

                        {booking.isEmergency && (
                          <div className="mt-3">
                            <span className="inline-flex items-center gap-1 px-2 py-1 bg-amber-100 text-amber-700 text-xs font-medium rounded-full">
                              ⚡ Emergency Booking
                            </span>
                          </div>
                        )}
                      </div>

                      {/* Actions */}
                      <div className="flex items-center gap-3 lg:flex-col lg:items-end">
                        <button className="inline-flex items-center gap-2 text-sm text-slate-600 hover:text-slate-900 px-3 py-2 rounded-lg hover:bg-slate-100">
                          <Download className="w-4 h-4" />
                          Download Invoice
                        </button>
                        {booking.status === 'confirmed' && (
                          <button
                            onClick={() => setShowCancelModal(booking)}
                            className="inline-flex items-center gap-2 text-sm text-red-600 hover:text-red-700 px-3 py-2 rounded-lg hover:bg-red-50"
                          >
                            <X className="w-4 h-4" />
                            Cancel
                          </button>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Price Breakdown */}
                  <div className="px-6 py-3 bg-slate-50 border-t border-slate-200 flex items-center justify-between text-sm">
                    <span className="text-slate-500">
                      Original: ${booking.originalPrice.toFixed(2)} | 
                      Discount: <span className="text-emerald-600">-${booking.discount.toFixed(2)} (10%)</span>
                    </span>
                    <span className="text-slate-500">
                      Payment: <span className={booking.paymentStatus === 'paid' ? 'text-emerald-600 font-medium' : 'text-amber-600 font-medium'}>
                        {booking.paymentStatus}
                      </span>
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-20 bg-white rounded-2xl shadow-lg">
              <Package className="w-16 h-16 text-slate-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-slate-700 mb-2">No bookings found</h3>
              <p className="text-slate-500 mb-6">
                {searchTerm || statusFilter 
                  ? 'Try adjusting your search or filter criteria'
                  : 'Start booking tours for your clients'}
              </p>
              <Link
                to="/about/partners/b2b/tours"
                className="inline-flex items-center gap-2 bg-emerald-500 text-white px-6 py-3 rounded-xl font-medium hover:bg-emerald-600"
              >
                Browse Tours
              </Link>
            </div>
          )}
        </div>
      </main>

      {/* Cancel Modal */}
      {showCancelModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6">
            <h3 className="text-xl font-bold text-slate-900 mb-4">Cancel Booking?</h3>
            <p className="text-slate-600 mb-6">
              Are you sure you want to cancel the booking for <strong>{showCancelModal.tourName}</strong>? 
              This action cannot be undone.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowCancelModal(null)}
                className="flex-1 px-4 py-3 bg-slate-200 text-slate-700 rounded-xl font-medium hover:bg-slate-300"
              >
                Keep Booking
              </button>
              <button
                onClick={() => handleCancelBooking(showCancelModal.id)}
                disabled={cancellingId === showCancelModal.id}
                className="flex-1 px-4 py-3 bg-red-500 text-white rounded-xl font-medium hover:bg-red-600 disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {cancellingId === showCancelModal.id ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Cancelling...
                  </>
                ) : (
                  'Yes, Cancel'
                )}
              </button>
            </div>
          </div>
        </div>
      )}
      
      <Footer />
    </>
  );
};

export default B2BMyBookings;
