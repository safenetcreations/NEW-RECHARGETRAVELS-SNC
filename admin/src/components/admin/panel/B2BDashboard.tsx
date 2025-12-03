import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { collection, getDocs, query, where, orderBy, limit, Timestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import {
  Building2, Users, Calendar, DollarSign, TrendingUp, TrendingDown,
  ArrowRight, Clock, CheckCircle, XCircle, AlertCircle, Globe,
  BarChart3, PieChart, Eye, Mail, RefreshCw, Filter
} from 'lucide-react';

interface B2BStats {
  totalAgencies: number;
  pendingAgencies: number;
  activeAgencies: number;
  suspendedAgencies: number;
  totalBookings: number;
  pendingBookings: number;
  confirmedBookings: number;
  totalRevenue: number;
  monthRevenue: number;
  avgBookingValue: number;
}

interface Agency {
  id: string;
  agencyName: string;
  email: string;
  country: string;
  status: string;
  totalBookings: number;
  totalRevenue: number;
  createdAt: any;
}

interface Booking {
  id: string;
  agencyId: string;
  agencyName: string;
  tourName: string;
  clientName: string;
  finalPrice: number;
  status: string;
  paymentStatus: string;
  createdAt: any;
}

const B2BDashboard: React.FC = () => {
  const [stats, setStats] = useState<B2BStats>({
    totalAgencies: 0,
    pendingAgencies: 0,
    activeAgencies: 0,
    suspendedAgencies: 0,
    totalBookings: 0,
    pendingBookings: 0,
    confirmedBookings: 0,
    totalRevenue: 0,
    monthRevenue: 0,
    avgBookingValue: 0,
  });
  const [recentAgencies, setRecentAgencies] = useState<Agency[]>([]);
  const [recentBookings, setRecentBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchB2BData();
  }, []);

  const fetchB2BData = async () => {
    try {
      setLoading(true);
      const startOfMonth = new Date();
      startOfMonth.setDate(1);
      startOfMonth.setHours(0, 0, 0, 0);

      // Fetch agencies
      const agenciesSnap = await getDocs(collection(db, 'b2b_agencies'));
      const agencies = agenciesSnap.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Agency[];

      // Fetch bookings
      const bookingsSnap = await getDocs(collection(db, 'b2b_bookings'));
      const bookings = bookingsSnap.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Booking[];

      // Calculate stats
      const pendingAgencies = agencies.filter(a => a.status === 'pending').length;
      const activeAgencies = agencies.filter(a => a.status === 'active').length;
      const suspendedAgencies = agencies.filter(a => a.status === 'suspended').length;

      const pendingBookings = bookings.filter(b => b.status === 'pending').length;
      const confirmedBookings = bookings.filter(b => b.status === 'confirmed').length;

      let totalRevenue = 0;
      let monthRevenue = 0;

      bookings.forEach(booking => {
        const amount = booking.finalPrice || 0;
        totalRevenue += amount;
        
        if (booking.createdAt?.toDate) {
          const bookingDate = booking.createdAt.toDate();
          if (bookingDate >= startOfMonth) {
            monthRevenue += amount;
          }
        }
      });

      setStats({
        totalAgencies: agencies.length,
        pendingAgencies,
        activeAgencies,
        suspendedAgencies,
        totalBookings: bookings.length,
        pendingBookings,
        confirmedBookings,
        totalRevenue,
        monthRevenue,
        avgBookingValue: bookings.length > 0 ? totalRevenue / bookings.length : 0,
      });

      // Get recent agencies
      setRecentAgencies(
        agencies
          .sort((a, b) => (b.createdAt?.toDate?.() || 0) - (a.createdAt?.toDate?.() || 0))
          .slice(0, 5)
      );

      // Get recent bookings with agency names
      const agencyMap = new Map(agencies.map(a => [a.id, a.agencyName]));
      setRecentBookings(
        bookings
          .map(b => ({ ...b, agencyName: agencyMap.get(b.agencyId) || 'Unknown' }))
          .sort((a, b) => (b.createdAt?.toDate?.() || 0) - (a.createdAt?.toDate?.() || 0))
          .slice(0, 5)
      );

    } catch (error) {
      console.error('Error fetching B2B data:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'active': case 'confirmed': case 'paid': return 'bg-emerald-100 text-emerald-700';
      case 'pending': return 'bg-amber-100 text-amber-700';
      case 'suspended': case 'cancelled': case 'refunded': return 'bg-red-100 text-red-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const formatDate = (timestamp: any) => {
    if (!timestamp?.toDate) return 'N/A';
    return timestamp.toDate().toLocaleDateString('en-GB', { 
      day: '2-digit', 
      month: 'short', 
      year: 'numeric' 
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <RefreshCw className="w-8 h-8 text-emerald-600 animate-spin mx-auto mb-3" />
          <p className="text-gray-500">Loading B2B data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
            <Building2 className="w-7 h-7 text-emerald-600" />
            B2B Portal Dashboard
          </h1>
          <p className="text-gray-500">Manage your travel agency partners and B2B bookings</p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={fetchB2BData}
            className="flex items-center gap-2 px-4 py-2 bg-emerald-50 text-emerald-700 rounded-lg hover:bg-emerald-100 transition-colors"
          >
            <RefreshCw className="w-4 h-4" />
            Refresh
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Agencies */}
        <div className="bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl p-6 text-white shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-100 text-sm font-medium">Total Agencies</p>
              <h3 className="text-3xl font-bold mt-1">{stats.totalAgencies}</h3>
              <div className="mt-2 flex items-center gap-4 text-sm">
                <span className="text-blue-200">{stats.activeAgencies} active</span>
                <span className="text-amber-300">{stats.pendingAgencies} pending</span>
              </div>
            </div>
            <div className="w-14 h-14 bg-white/20 rounded-xl flex items-center justify-center">
              <Building2 className="w-7 h-7" />
            </div>
          </div>
        </div>

        {/* Total Bookings */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm font-medium">B2B Bookings</p>
              <h3 className="text-3xl font-bold text-gray-900 mt-1">{stats.totalBookings}</h3>
              <div className="mt-2 flex items-center gap-4 text-sm">
                <span className="text-emerald-600">{stats.confirmedBookings} confirmed</span>
                <span className="text-amber-600">{stats.pendingBookings} pending</span>
              </div>
            </div>
            <div className="w-14 h-14 bg-purple-50 rounded-xl flex items-center justify-center">
              <Calendar className="w-7 h-7 text-purple-600" />
            </div>
          </div>
        </div>

        {/* Total Revenue */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm font-medium">B2B Revenue</p>
              <h3 className="text-3xl font-bold text-gray-900 mt-1">{formatCurrency(stats.totalRevenue)}</h3>
              <p className="text-emerald-600 text-sm mt-2 flex items-center gap-1">
                <TrendingUp className="w-4 h-4" />
                {formatCurrency(stats.monthRevenue)} this month
              </p>
            </div>
            <div className="w-14 h-14 bg-emerald-50 rounded-xl flex items-center justify-center">
              <DollarSign className="w-7 h-7 text-emerald-600" />
            </div>
          </div>
        </div>

        {/* Avg Booking Value */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm font-medium">Avg Booking Value</p>
              <h3 className="text-3xl font-bold text-gray-900 mt-1">{formatCurrency(stats.avgBookingValue)}</h3>
              <p className="text-gray-500 text-sm mt-2">Per B2B booking</p>
            </div>
            <div className="w-14 h-14 bg-orange-50 rounded-xl flex items-center justify-center">
              <BarChart3 className="w-7 h-7 text-orange-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Agencies */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100">
          <div className="p-6 border-b border-gray-100 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-900">Recent Agencies</h2>
            <Link to="/b2b-agencies" className="text-sm text-emerald-600 hover:text-emerald-700 flex items-center gap-1">
              View All <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="divide-y divide-gray-100">
            {recentAgencies.length > 0 ? recentAgencies.map((agency) => (
              <div key={agency.id} className="p-4 hover:bg-gray-50 transition-colors">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center text-white font-bold">
                      {agency.agencyName?.[0] || 'A'}
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{agency.agencyName}</p>
                      <p className="text-sm text-gray-500">{agency.email}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className={`text-xs px-2 py-1 rounded-full ${getStatusColor(agency.status)}`}>
                      {agency.status}
                    </span>
                    <p className="text-xs text-gray-500 mt-1">{formatDate(agency.createdAt)}</p>
                  </div>
                </div>
              </div>
            )) : (
              <div className="p-8 text-center text-gray-500">
                <Building2 className="w-12 h-12 mx-auto text-gray-300 mb-3" />
                <p>No agencies registered yet</p>
              </div>
            )}
          </div>
        </div>

        {/* Recent Bookings */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100">
          <div className="p-6 border-b border-gray-100 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-900">Recent B2B Bookings</h2>
            <Link to="/b2b-bookings" className="text-sm text-emerald-600 hover:text-emerald-700 flex items-center gap-1">
              View All <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="divide-y divide-gray-100">
            {recentBookings.length > 0 ? recentBookings.map((booking) => (
              <div key={booking.id} className="p-4 hover:bg-gray-50 transition-colors">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-gray-900">{booking.tourName}</p>
                    <p className="text-sm text-gray-500">
                      {booking.agencyName} • {booking.clientName}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-gray-900">{formatCurrency(booking.finalPrice)}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className={`text-xs px-2 py-0.5 rounded-full ${getStatusColor(booking.status)}`}>
                        {booking.status}
                      </span>
                      <span className={`text-xs px-2 py-0.5 rounded-full ${getStatusColor(booking.paymentStatus)}`}>
                        {booking.paymentStatus}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            )) : (
              <div className="p-8 text-center text-gray-500">
                <Calendar className="w-12 h-12 mx-auto text-gray-300 mb-3" />
                <p>No B2B bookings yet</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-gradient-to-r from-emerald-600 to-teal-600 rounded-2xl p-6 text-white">
        <h2 className="text-lg font-semibold mb-4">B2B Quick Actions</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Link to="/b2b-agencies" className="flex flex-col items-center gap-2 p-4 bg-white/10 rounded-xl hover:bg-white/20 transition-colors">
            <Building2 className="w-6 h-6" />
            <span className="text-sm font-medium text-center">Manage Agencies</span>
          </Link>
          <Link to="/b2b-bookings" className="flex flex-col items-center gap-2 p-4 bg-white/10 rounded-xl hover:bg-white/20 transition-colors">
            <Calendar className="w-6 h-6" />
            <span className="text-sm font-medium text-center">View Bookings</span>
          </Link>
          <Link to="/b2b-tours" className="flex flex-col items-center gap-2 p-4 bg-white/10 rounded-xl hover:bg-white/20 transition-colors">
            <Globe className="w-6 h-6" />
            <span className="text-sm font-medium text-center">B2B Tours</span>
          </Link>
          <Link to="/b2b-analytics" className="flex flex-col items-center gap-2 p-4 bg-white/10 rounded-xl hover:bg-white/20 transition-colors">
            <BarChart3 className="w-6 h-6" />
            <span className="text-sm font-medium text-center">Analytics</span>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default B2BDashboard;
