import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { collection, getDocs, query, where, orderBy, limit, Timestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import {
  TrendingUp, TrendingDown, Users, Calendar, DollarSign, Globe, 
  MapPin, Clock, ArrowRight, Star, Plane, Hotel, Car, Train,
  BarChart3, PieChart, Activity, Eye, MessageCircle, Mail, 
  Brain, Sparkles, AlertCircle, CheckCircle, XCircle, Building2,
  Zap, Target, Award, Heart, RefreshCw
} from 'lucide-react';

interface DashboardStats {
  totalBookings: number;
  todayBookings: number;
  totalRevenue: number;
  monthRevenue: number;
  totalCustomers: number;
  newCustomers: number;
  totalDrivers: number;
  activeDrivers: number;
  pendingReviews: number;
  totalAgencies: number;
  pendingAgencies: number;
  emailsSent: number;
  conversionRate: number;
}

interface RecentBooking {
  id: string;
  type: string;
  customerName: string;
  amount: number;
  status: string;
  createdAt: any;
}

interface TopDestination {
  name: string;
  bookings: number;
  revenue: number;
  growth: number;
}

const EnhancedDashboard: React.FC = () => {
  const [stats, setStats] = useState<DashboardStats>({
    totalBookings: 0,
    todayBookings: 0,
    totalRevenue: 0,
    monthRevenue: 0,
    totalCustomers: 0,
    newCustomers: 0,
    totalDrivers: 0,
    activeDrivers: 0,
    pendingReviews: 0,
    totalAgencies: 0,
    pendingAgencies: 0,
    emailsSent: 0,
    conversionRate: 0,
  });
  const [recentBookings, setRecentBookings] = useState<RecentBooking[]>([]);
  const [topDestinations, setTopDestinations] = useState<TopDestination[]>([]);
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());

  useEffect(() => {
    fetchDashboardData();
    const interval = setInterval(fetchDashboardData, 60000); // Refresh every minute
    return () => clearInterval(interval);
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);

      // Fetch various collections
      const [
        bookingsSnap,
        tourBookingsSnap,
        trainBookingsSnap,
        customersSnap,
        driversSnap,
        reviewsSnap,
        agenciesSnap,
        emailsSnap
      ] = await Promise.all([
        getDocs(collection(db, 'bookings')),
        getDocs(collection(db, 'globalTourBookings')),
        getDocs(collection(db, 'trainBookings')),
        getDocs(collection(db, 'customers')),
        getDocs(collection(db, 'drivers')),
        getDocs(query(collection(db, 'reviews'), where('status', '==', 'pending'))),
        getDocs(collection(db, 'b2b_agencies')),
        getDocs(collection(db, 'emailQueue')),
      ]);

      // Calculate stats
      let totalRevenue = 0;
      let monthRevenue = 0;
      let todayBookings = 0;

      // Process bookings
      bookingsSnap.docs.forEach(doc => {
        const data = doc.data();
        const amount = data.totalAmount || data.amount || 0;
        totalRevenue += amount;
        
        if (data.createdAt?.toDate) {
          const bookingDate = data.createdAt.toDate();
          if (bookingDate >= startOfMonth) monthRevenue += amount;
          if (bookingDate >= today) todayBookings++;
        }
      });

      // Process tour bookings
      tourBookingsSnap.docs.forEach(doc => {
        const data = doc.data();
        const amount = data.payment?.totalAmountUSD || 0;
        totalRevenue += amount;
        
        if (data.createdAt?.toDate) {
          const bookingDate = data.createdAt.toDate();
          if (bookingDate >= startOfMonth) monthRevenue += amount;
          if (bookingDate >= today) todayBookings++;
        }
      });

      // Count agencies
      const pendingAgencies = agenciesSnap.docs.filter(doc => doc.data().status === 'pending').length;

      // Count new customers (this month)
      const newCustomers = customersSnap.docs.filter(doc => {
        const createdAt = doc.data().createdAt?.toDate?.();
        return createdAt && createdAt >= startOfMonth;
      }).length;

      // Active drivers
      const activeDrivers = driversSnap.docs.filter(doc => doc.data().status === 'active').length;

      // Email stats
      const sentEmails = emailsSnap.docs.filter(doc => doc.data().status === 'sent').length;

      setStats({
        totalBookings: bookingsSnap.size + tourBookingsSnap.size + trainBookingsSnap.size,
        todayBookings,
        totalRevenue,
        monthRevenue,
        totalCustomers: customersSnap.size,
        newCustomers,
        totalDrivers: driversSnap.size,
        activeDrivers,
        pendingReviews: reviewsSnap.size,
        totalAgencies: agenciesSnap.size,
        pendingAgencies,
        emailsSent: sentEmails,
        conversionRate: 3.8, // Mock value
      });

      // Get recent bookings
      const recentBookingsQuery = query(
        collection(db, 'globalTourBookings'),
        orderBy('createdAt', 'desc'),
        limit(5)
      );
      const recentSnap = await getDocs(recentBookingsQuery);
      setRecentBookings(recentSnap.docs.map(doc => ({
        id: doc.id,
        type: 'Tour',
        customerName: `${doc.data().customer?.firstName || ''} ${doc.data().customer?.lastName || ''}`.trim() || 'Guest',
        amount: doc.data().payment?.totalAmountUSD || 0,
        status: doc.data().status || 'pending',
        createdAt: doc.data().createdAt,
      })));

      // Mock top destinations
      setTopDestinations([
        { name: 'Sigiriya', bookings: 156, revenue: 45600, growth: 12.5 },
        { name: 'Kandy', bookings: 134, revenue: 38900, growth: 8.3 },
        { name: 'Ella', bookings: 128, revenue: 35200, growth: 15.2 },
        { name: 'Mirissa', bookings: 98, revenue: 29800, growth: -2.1 },
        { name: 'Yala', bookings: 87, revenue: 42100, growth: 21.5 },
      ]);

      setLastUpdated(new Date());
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'confirmed': case 'completed': case 'active': return 'bg-emerald-100 text-emerald-700';
      case 'pending': return 'bg-amber-100 text-amber-700';
      case 'cancelled': case 'failed': return 'bg-red-100 text-red-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-500">Welcome back! Here's what's happening with your business.</p>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-sm text-gray-500">
            Last updated: {formatTime(lastUpdated)}
          </span>
          <button
            onClick={fetchDashboardData}
            disabled={loading}
            className="flex items-center gap-2 px-4 py-2 bg-emerald-50 text-emerald-700 rounded-lg hover:bg-emerald-100 transition-colors disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </button>
        </div>
      </div>

      {/* Primary Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Revenue */}
        <div className="bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl p-6 text-white shadow-lg shadow-emerald-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-emerald-100 text-sm font-medium">Total Revenue</p>
              <h3 className="text-3xl font-bold mt-1">{formatCurrency(stats.totalRevenue)}</h3>
              <p className="text-emerald-200 text-sm mt-2 flex items-center gap-1">
                <TrendingUp className="w-4 h-4" />
                +12.5% from last month
              </p>
            </div>
            <div className="w-14 h-14 bg-white/20 rounded-xl flex items-center justify-center">
              <DollarSign className="w-7 h-7" />
            </div>
          </div>
        </div>

        {/* Total Bookings */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm font-medium">Total Bookings</p>
              <h3 className="text-3xl font-bold text-gray-900 mt-1">{stats.totalBookings.toLocaleString()}</h3>
              <p className="text-emerald-600 text-sm mt-2 flex items-center gap-1">
                <TrendingUp className="w-4 h-4" />
                {stats.todayBookings} today
              </p>
            </div>
            <div className="w-14 h-14 bg-blue-50 rounded-xl flex items-center justify-center">
              <Calendar className="w-7 h-7 text-blue-600" />
            </div>
          </div>
        </div>

        {/* Total Customers */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm font-medium">Total Customers</p>
              <h3 className="text-3xl font-bold text-gray-900 mt-1">{stats.totalCustomers.toLocaleString()}</h3>
              <p className="text-emerald-600 text-sm mt-2 flex items-center gap-1">
                <TrendingUp className="w-4 h-4" />
                +{stats.newCustomers} this month
              </p>
            </div>
            <div className="w-14 h-14 bg-purple-50 rounded-xl flex items-center justify-center">
              <Users className="w-7 h-7 text-purple-600" />
            </div>
          </div>
        </div>

        {/* Conversion Rate */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm font-medium">Conversion Rate</p>
              <h3 className="text-3xl font-bold text-gray-900 mt-1">{stats.conversionRate}%</h3>
              <p className="text-emerald-600 text-sm mt-2 flex items-center gap-1">
                <TrendingUp className="w-4 h-4" />
                +0.5% from last week
              </p>
            </div>
            <div className="w-14 h-14 bg-orange-50 rounded-xl flex items-center justify-center">
              <Target className="w-7 h-7 text-orange-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Secondary Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
        <Link to="/drivers" className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 hover:border-emerald-200 hover:shadow-md transition-all group">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-indigo-50 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
              <Car className="w-5 h-5 text-indigo-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{stats.totalDrivers}</p>
              <p className="text-xs text-gray-500">Drivers ({stats.activeDrivers} active)</p>
            </div>
          </div>
        </Link>

        <Link to="/b2b-agencies" className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 hover:border-emerald-200 hover:shadow-md transition-all group">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-teal-50 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
              <Building2 className="w-5 h-5 text-teal-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{stats.totalAgencies}</p>
              <p className="text-xs text-gray-500">B2B Agencies</p>
            </div>
          </div>
        </Link>

        <Link to="/reviews" className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 hover:border-emerald-200 hover:shadow-md transition-all group">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-amber-50 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
              <Star className="w-5 h-5 text-amber-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{stats.pendingReviews}</p>
              <p className="text-xs text-gray-500">Pending Reviews</p>
            </div>
          </div>
        </Link>

        <Link to="/email-queue" className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 hover:border-emerald-200 hover:shadow-md transition-all group">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-pink-50 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
              <Mail className="w-5 h-5 text-pink-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{stats.emailsSent}</p>
              <p className="text-xs text-gray-500">Emails Sent</p>
            </div>
          </div>
        </Link>

        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-green-50 rounded-lg flex items-center justify-center">
              <Globe className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{formatCurrency(stats.monthRevenue)}</p>
              <p className="text-xs text-gray-500">This Month</p>
            </div>
          </div>
        </div>

        <Link to="/vendor-approvals" className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 hover:border-emerald-200 hover:shadow-md transition-all group">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-red-50 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
              <AlertCircle className="w-5 h-5 text-red-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{stats.pendingAgencies}</p>
              <p className="text-xs text-gray-500">Pending Approval</p>
            </div>
          </div>
        </Link>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Bookings */}
        <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-gray-100">
          <div className="p-6 border-b border-gray-100 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-900">Recent Bookings</h2>
            <Link to="/bookings" className="text-sm text-emerald-600 hover:text-emerald-700 flex items-center gap-1">
              View All <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="divide-y divide-gray-100">
            {recentBookings.length > 0 ? recentBookings.map((booking) => (
              <div key={booking.id} className="p-4 hover:bg-gray-50 transition-colors">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center">
                      <Globe className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{booking.customerName}</p>
                      <p className="text-sm text-gray-500">{booking.type} • {booking.id.slice(-8).toUpperCase()}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-gray-900">{formatCurrency(booking.amount)}</p>
                    <span className={`text-xs px-2 py-1 rounded-full ${getStatusColor(booking.status)}`}>
                      {booking.status}
                    </span>
                  </div>
                </div>
              </div>
            )) : (
              <div className="p-8 text-center text-gray-500">
                <Calendar className="w-12 h-12 mx-auto text-gray-300 mb-3" />
                <p>No recent bookings</p>
              </div>
            )}
          </div>
        </div>

        {/* Top Destinations */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100">
          <div className="p-6 border-b border-gray-100">
            <h2 className="text-lg font-semibold text-gray-900">Top Destinations</h2>
          </div>
          <div className="p-4 space-y-4">
            {topDestinations.map((dest, index) => (
              <div key={dest.name} className="flex items-center gap-4">
                <div className="w-8 h-8 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-lg flex items-center justify-center text-white font-bold text-sm">
                  {index + 1}
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <p className="font-medium text-gray-900">{dest.name}</p>
                    <span className={`text-sm flex items-center gap-1 ${dest.growth >= 0 ? 'text-emerald-600' : 'text-red-600'}`}>
                      {dest.growth >= 0 ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                      {Math.abs(dest.growth)}%
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-sm text-gray-500">
                    <span>{dest.bookings} bookings</span>
                    <span>{formatCurrency(dest.revenue)}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-gradient-to-r from-gray-900 to-gray-800 rounded-2xl p-6 text-white">
        <h2 className="text-lg font-semibold mb-4">Quick Actions</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
          <Link to="/blog-manager" className="flex flex-col items-center gap-2 p-4 bg-white/10 rounded-xl hover:bg-white/20 transition-colors">
            <Brain className="w-6 h-6" />
            <span className="text-sm font-medium text-center">Create Blog Post</span>
          </Link>
          <Link to="/ai-content-generator" className="flex flex-col items-center gap-2 p-4 bg-white/10 rounded-xl hover:bg-white/20 transition-colors">
            <Sparkles className="w-6 h-6" />
            <span className="text-sm font-medium text-center">AI Generator</span>
          </Link>
          <Link to="/global-tours" className="flex flex-col items-center gap-2 p-4 bg-white/10 rounded-xl hover:bg-white/20 transition-colors">
            <Globe className="w-6 h-6" />
            <span className="text-sm font-medium text-center">Add Tour</span>
          </Link>
          <Link to="/hotels" className="flex flex-col items-center gap-2 p-4 bg-white/10 rounded-xl hover:bg-white/20 transition-colors">
            <Hotel className="w-6 h-6" />
            <span className="text-sm font-medium text-center">Add Hotel</span>
          </Link>
          <Link to="/email-templates" className="flex flex-col items-center gap-2 p-4 bg-white/10 rounded-xl hover:bg-white/20 transition-colors">
            <Mail className="w-6 h-6" />
            <span className="text-sm font-medium text-center">Email Templates</span>
          </Link>
          <Link to="/analytics" className="flex flex-col items-center gap-2 p-4 bg-white/10 rounded-xl hover:bg-white/20 transition-colors">
            <BarChart3 className="w-6 h-6" />
            <span className="text-sm font-medium text-center">View Analytics</span>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default EnhancedDashboard;
