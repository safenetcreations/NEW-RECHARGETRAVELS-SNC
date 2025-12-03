import { useEffect, useState } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { 
  ArrowLeft,
  Search,
  Calendar,
  Users,
  DollarSign,
  Building2,
  Package,
  Download,
  Eye,
  Loader2,
  ChevronDown,
  Filter
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

interface Booking {
  id: string;
  agencyId: string;
  agencyName?: string;
  tourId: string;
  tourName: string;
  clientName: string;
  clientEmail: string;
  clientPhone: string;
  guestCount: number;
  tourDate: string;
  originalPrice: number;
  discount: number;
  finalPrice: number;
  status: 'pending' | 'confirmed' | 'cancelled';
  paymentStatus: 'pending' | 'paid' | 'refunded';
  isEmergency: boolean;
  createdAt: any;
}

const statusFilters = [
  { value: '', label: 'All Status' },
  { value: 'confirmed', label: 'Confirmed' },
  { value: 'pending', label: 'Pending' },
  { value: 'cancelled', label: 'Cancelled' }
];

const B2BBookingsAdmin = () => {
  const { user, isAdmin } = useAuth();
  const [loading, setLoading] = useState(true);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [dateRange, setDateRange] = useState({ start: '', end: '' });
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const params = new URLSearchParams();
        if (statusFilter) params.append('status', statusFilter);
        if (dateRange.start) params.append('startDate', dateRange.start);
        if (dateRange.end) params.append('endDate', dateRange.end);
        
        const response = await fetch(`/api/b2b/admin/bookings?${params}`, {
          headers: {
            'Authorization': `Bearer ${await user?.getIdToken()}`
          }
        });
        const data = await response.json();
        
        if (data.success) {
          setBookings(data.data || []);
        }
      } catch (error) {
        console.error('Failed to fetch bookings:', error);
      } finally {
        setLoading(false);
      }
    };

    if (user && isAdmin) {
      fetchBookings();
    }
  }, [user, isAdmin, statusFilter, dateRange]);

  const exportToCSV = () => {
    const headers = ['Booking ID', 'Agency', 'Tour', 'Client', 'Guests', 'Date', 'Price', 'Status', 'Payment'];
    const rows = filteredBookings.map(b => [
      b.id,
      b.agencyName || b.agencyId,
      b.tourName,
      b.clientName,
      b.guestCount,
      b.tourDate,
      b.finalPrice,
      b.status,
      b.paymentStatus
    ]);
    
    const csvContent = [headers, ...rows].map(row => row.join(',')).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `b2b-bookings-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
  };

  if (!user || !isAdmin) {
    return <Navigate to="/login" replace />;
  }

  const filteredBookings = bookings.filter(booking =>
    booking.tourName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    booking.clientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    booking.id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalRevenue = filteredBookings.reduce((sum, b) => sum + b.finalPrice, 0);
  const totalDiscount = filteredBookings.reduce((sum, b) => sum + b.discount, 0);

  return (
    <>
      <Helmet>
        <title>Bookings Management | B2B Admin | Recharge Travels</title>
      </Helmet>
      
      <Header />
      
      <main className="min-h-screen bg-gradient-to-br from-slate-100 via-emerald-50/30 to-teal-50/30 py-8">
        <div className="container mx-auto px-4">
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
            <div>
              <Link
                to="/admin/b2b"
                className="inline-flex items-center gap-2 text-slate-600 hover:text-slate-900 mb-4"
              >
                <ArrowLeft className="w-4 h-4" />
                Back to Dashboard
              </Link>
              <h1 className="text-3xl font-bold text-slate-900 mb-2">All B2B Bookings</h1>
              <p className="text-slate-600">View and manage all agency bookings</p>
            </div>
            <button
              onClick={exportToCSV}
              className="inline-flex items-center gap-2 bg-slate-700 text-white px-4 py-2 rounded-lg font-medium hover:bg-slate-800 mt-4 md:mt-0"
            >
              <Download className="w-5 h-5" />
              Export CSV
            </button>
          </div>

          {/* Stats Summary */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-white rounded-xl p-4 shadow border border-slate-200/50">
              <p className="text-sm text-slate-500">Total Bookings</p>
              <p className="text-2xl font-bold text-slate-900">{filteredBookings.length}</p>
            </div>
            <div className="bg-white rounded-xl p-4 shadow border border-slate-200/50">
              <p className="text-sm text-slate-500">Total Revenue</p>
              <p className="text-2xl font-bold text-emerald-600">${totalRevenue.toLocaleString()}</p>
            </div>
            <div className="bg-white rounded-xl p-4 shadow border border-slate-200/50">
              <p className="text-sm text-slate-500">Total Discounts</p>
              <p className="text-2xl font-bold text-amber-600">${totalDiscount.toLocaleString()}</p>
            </div>
            <div className="bg-white rounded-xl p-4 shadow border border-slate-200/50">
              <p className="text-sm text-slate-500">Avg. Booking</p>
              <p className="text-2xl font-bold text-blue-600">
                ${filteredBookings.length > 0 ? Math.round(totalRevenue / filteredBookings.length) : 0}
              </p>
            </div>
          </div>

          {/* Filters */}
          <div className="bg-white rounded-2xl shadow-lg border border-slate-200/50 p-4 mb-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search by tour, client, or booking ID..."
                  className="w-full pl-12 pr-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500"
                />
              </div>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 bg-white"
              >
                {statusFilters.map((filter) => (
                  <option key={filter.value} value={filter.value}>{filter.label}</option>
                ))}
              </select>
              <input
                type="date"
                value={dateRange.start}
                onChange={(e) => setDateRange({ ...dateRange, start: e.target.value })}
                className="px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500"
                placeholder="Start date"
              />
              <input
                type="date"
                value={dateRange.end}
                onChange={(e) => setDateRange({ ...dateRange, end: e.target.value })}
                className="px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500"
                placeholder="End date"
              />
            </div>
          </div>

          {/* Bookings Table */}
          {loading ? (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="w-8 h-8 animate-spin text-emerald-500" />
            </div>
          ) : filteredBookings.length > 0 ? (
            <div className="bg-white rounded-2xl shadow-lg border border-slate-200/50 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-slate-50 border-b border-slate-200">
                    <tr>
                      <th className="text-left px-6 py-4 text-sm font-semibold text-slate-700">Booking</th>
                      <th className="text-left px-6 py-4 text-sm font-semibold text-slate-700">Tour</th>
                      <th className="text-left px-6 py-4 text-sm font-semibold text-slate-700">Client</th>
                      <th className="text-left px-6 py-4 text-sm font-semibold text-slate-700">Date</th>
                      <th className="text-left px-6 py-4 text-sm font-semibold text-slate-700">Amount</th>
                      <th className="text-left px-6 py-4 text-sm font-semibold text-slate-700">Status</th>
                      <th className="text-left px-6 py-4 text-sm font-semibold text-slate-700">Payment</th>
                      <th className="text-left px-6 py-4 text-sm font-semibold text-slate-700"></th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {filteredBookings.map((booking) => (
                      <tr key={booking.id} className="hover:bg-slate-50 transition-colors">
                        <td className="px-6 py-4">
                          <p className="font-mono text-sm text-slate-900">{booking.id.slice(0, 8)}...</p>
                          <p className="text-xs text-slate-500">{booking.agencyName || 'Agency'}</p>
                        </td>
                        <td className="px-6 py-4">
                          <p className="font-medium text-slate-900">{booking.tourName}</p>
                          <p className="text-xs text-slate-500">{booking.guestCount} guests</p>
                        </td>
                        <td className="px-6 py-4">
                          <p className="text-slate-900">{booking.clientName}</p>
                          <p className="text-xs text-slate-500">{booking.clientEmail}</p>
                        </td>
                        <td className="px-6 py-4">
                          <p className="text-slate-900">{booking.tourDate}</p>
                          {booking.isEmergency && (
                            <span className="inline-flex text-xs bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full">
                              Emergency
                            </span>
                          )}
                        </td>
                        <td className="px-6 py-4">
                          <p className="font-semibold text-emerald-600">${booking.finalPrice}</p>
                          <p className="text-xs text-slate-500 line-through">${booking.originalPrice}</p>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`inline-flex px-3 py-1 rounded-full text-xs font-semibold ${
                            booking.status === 'confirmed' 
                              ? 'bg-emerald-100 text-emerald-700'
                              : booking.status === 'pending'
                              ? 'bg-amber-100 text-amber-700'
                              : 'bg-red-100 text-red-700'
                          }`}>
                            {booking.status}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`inline-flex px-3 py-1 rounded-full text-xs font-semibold ${
                            booking.paymentStatus === 'paid' 
                              ? 'bg-green-100 text-green-700'
                              : booking.paymentStatus === 'pending'
                              ? 'bg-yellow-100 text-yellow-700'
                              : 'bg-red-100 text-red-700'
                          }`}>
                            {booking.paymentStatus}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <button
                            onClick={() => setSelectedBooking(booking)}
                            className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg"
                          >
                            <Eye className="w-5 h-5" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ) : (
            <div className="text-center py-20 bg-white rounded-2xl shadow-lg">
              <Package className="w-16 h-16 text-slate-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-slate-700 mb-2">No bookings found</h3>
              <p className="text-slate-500">Adjust your filters or wait for agencies to make bookings</p>
            </div>
          )}
        </div>
      </main>

      {/* Booking Detail Modal */}
      {selectedBooking && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-slate-200 flex items-center justify-between">
              <h2 className="text-xl font-bold text-slate-900">Booking Details</h2>
              <button onClick={() => setSelectedBooking(null)} className="text-slate-400 hover:text-slate-600">
                ✕
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-slate-500">Booking ID</p>
                  <p className="font-mono text-slate-900">{selectedBooking.id}</p>
                </div>
                <div>
                  <p className="text-sm text-slate-500">Agency ID</p>
                  <p className="font-mono text-slate-900">{selectedBooking.agencyId}</p>
                </div>
              </div>
              <div>
                <p className="text-sm text-slate-500">Tour</p>
                <p className="font-semibold text-slate-900">{selectedBooking.tourName}</p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-slate-500">Client Name</p>
                  <p className="text-slate-900">{selectedBooking.clientName}</p>
                </div>
                <div>
                  <p className="text-sm text-slate-500">Guests</p>
                  <p className="text-slate-900">{selectedBooking.guestCount}</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-slate-500">Email</p>
                  <p className="text-slate-900">{selectedBooking.clientEmail}</p>
                </div>
                <div>
                  <p className="text-sm text-slate-500">Phone</p>
                  <p className="text-slate-900">{selectedBooking.clientPhone}</p>
                </div>
              </div>
              <div>
                <p className="text-sm text-slate-500">Tour Date</p>
                <p className="text-slate-900">{selectedBooking.tourDate}</p>
              </div>
              <div className="bg-slate-50 rounded-xl p-4">
                <div className="flex justify-between mb-2">
                  <span className="text-slate-600">Original Price</span>
                  <span className="text-slate-900">${selectedBooking.originalPrice}</span>
                </div>
                <div className="flex justify-between mb-2 text-emerald-600">
                  <span>B2B Discount (10%)</span>
                  <span>-${selectedBooking.discount}</span>
                </div>
                <div className="flex justify-between pt-2 border-t border-slate-200 font-bold">
                  <span>Final Price</span>
                  <span className="text-emerald-600">${selectedBooking.finalPrice}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      
      <Footer />
    </>
  );
};

export default B2BBookingsAdmin;
