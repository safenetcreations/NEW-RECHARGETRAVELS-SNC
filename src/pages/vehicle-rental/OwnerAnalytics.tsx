/**
 * Owner Analytics Dashboard
 * Comprehensive analytics for vehicle owners with revenue, bookings, and performance metrics
 */
import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  BarChart3,
  TrendingUp,
  TrendingDown,
  DollarSign,
  Car,
  Calendar,
  Star,
  Users,
  Clock,
  ArrowLeft,
  Download,
  Filter,
  RefreshCw,
  ChevronDown,
  Eye,
  MessageSquare,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Percent,
  Target,
  Zap
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { db } from '@/lib/firebase';
import {
  collection,
  query,
  where,
  getDocs,
  orderBy,
  Timestamp
} from 'firebase/firestore';
import type { Vehicle, VehicleRentalBooking, VehicleReview } from '@/types/vehicleRental';

// Chart component (simple implementation)
interface ChartData {
  label: string;
  value: number;
  color?: string;
}

const SimpleBarChart: React.FC<{ data: ChartData[]; height?: number; title: string }> = ({
  data,
  height = 200,
  title
}) => {
  const maxValue = Math.max(...data.map(d => d.value), 1);

  return (
    <div className="bg-white rounded-xl shadow-sm p-6">
      <h3 className="font-semibold text-gray-900 mb-4">{title}</h3>
      <div className="flex items-end justify-between gap-2" style={{ height }}>
        {data.map((item, index) => (
          <div key={index} className="flex-1 flex flex-col items-center">
            <div
              className="w-full bg-[#004643] rounded-t-md transition-all duration-500"
              style={{
                height: `${(item.value / maxValue) * 100}%`,
                minHeight: item.value > 0 ? '4px' : '0px'
              }}
            />
            <span className="text-xs text-gray-500 mt-2 truncate w-full text-center">
              {item.label}
            </span>
            <span className="text-xs font-medium text-gray-700">
              ${item.value.toLocaleString()}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

const SimpleLineChart: React.FC<{ data: ChartData[]; height?: number; title: string }> = ({
  data,
  height = 200,
  title
}) => {
  const maxValue = Math.max(...data.map(d => d.value), 1);
  const points = data.map((d, i) => ({
    x: (i / (data.length - 1 || 1)) * 100,
    y: 100 - (d.value / maxValue) * 100
  }));

  const pathD = points.length > 1
    ? `M ${points.map(p => `${p.x} ${p.y}`).join(' L ')}`
    : '';

  return (
    <div className="bg-white rounded-xl shadow-sm p-6">
      <h3 className="font-semibold text-gray-900 mb-4">{title}</h3>
      <div className="relative" style={{ height }}>
        <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
          {/* Grid lines */}
          {[0, 25, 50, 75, 100].map(y => (
            <line
              key={y}
              x1="0"
              y1={y}
              x2="100"
              y2={y}
              stroke="#e5e7eb"
              strokeWidth="0.5"
            />
          ))}
          {/* Line */}
          <path
            d={pathD}
            fill="none"
            stroke="#004643"
            strokeWidth="2"
            vectorEffect="non-scaling-stroke"
          />
          {/* Points */}
          {points.map((p, i) => (
            <circle
              key={i}
              cx={p.x}
              cy={p.y}
              r="1.5"
              fill="#004643"
              className="hover:r-3 transition-all"
            />
          ))}
        </svg>
        <div className="flex justify-between mt-2">
          {data.map((item, index) => (
            <span key={index} className="text-xs text-gray-500">
              {item.label}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};

type DateRange = '7d' | '30d' | '90d' | '12m' | 'all';

const OwnerAnalytics: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  // State
  const [loading, setLoading] = useState(true);
  const [dateRange, setDateRange] = useState<DateRange>('30d');
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [bookings, setBookings] = useState<VehicleRentalBooking[]>([]);
  const [reviews, setReviews] = useState<VehicleReview[]>([]);

  // Analytics data
  const [stats, setStats] = useState({
    totalRevenue: 0,
    revenueChange: 0,
    totalBookings: 0,
    bookingsChange: 0,
    averageRating: 0,
    ratingChange: 0,
    totalVehicles: 0,
    activeVehicles: 0,
    completedBookings: 0,
    cancelledBookings: 0,
    pendingBookings: 0,
    averageBookingValue: 0,
    utilizationRate: 0,
    responseRate: 100,
    repeatCustomers: 0
  });

  const [revenueByMonth, setRevenueByMonth] = useState<ChartData[]>([]);
  const [bookingsByStatus, setBookingsByStatus] = useState<ChartData[]>([]);
  const [topVehicles, setTopVehicles] = useState<{ vehicle: Vehicle; revenue: number; bookings: number }[]>([]);
  const [recentActivity, setRecentActivity] = useState<{ type: string; message: string; time: Date }[]>([]);

  // Get date range filter
  const getDateFilter = useCallback(() => {
    const now = new Date();
    switch (dateRange) {
      case '7d':
        return new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      case '30d':
        return new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
      case '90d':
        return new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);
      case '12m':
        return new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000);
      default:
        return new Date(0); // All time
    }
  }, [dateRange]);

  // Fetch data
  const fetchAnalyticsData = useCallback(async () => {
    if (!user?.uid) return;

    setLoading(true);
    try {
      const startDate = getDateFilter();

      // Fetch vehicles
      const vehiclesQuery = query(
        collection(db, 'vehicles'),
        where('ownerId', '==', user.uid)
      );
      const vehiclesSnap = await getDocs(vehiclesQuery);
      const vehiclesList: Vehicle[] = [];
      const vehicleIds: string[] = [];
      vehiclesSnap.forEach(doc => {
        vehiclesList.push({ id: doc.id, ...doc.data() } as Vehicle);
        vehicleIds.push(doc.id);
      });
      setVehicles(vehiclesList);

      if (vehicleIds.length === 0) {
        setLoading(false);
        return;
      }

      // Fetch bookings for all vehicles
      const allBookings: VehicleRentalBooking[] = [];
      const chunks: string[][] = [];
      for (let i = 0; i < vehicleIds.length; i += 10) {
        chunks.push(vehicleIds.slice(i, i + 10));
      }

      for (const chunk of chunks) {
        const bookingsQuery = query(
          collection(db, 'vehicle_bookings'),
          where('vehicleId', 'in', chunk),
          orderBy('createdAt', 'desc')
        );
        const bookingsSnap = await getDocs(bookingsQuery);
        bookingsSnap.forEach(doc => {
          allBookings.push({ id: doc.id, ...doc.data() } as VehicleRentalBooking);
        });
      }
      setBookings(allBookings);

      // Fetch reviews
      const allReviews: VehicleReview[] = [];
      for (const chunk of chunks) {
        const reviewsQuery = query(
          collection(db, 'vehicle_reviews'),
          where('vehicleId', 'in', chunk)
        );
        const reviewsSnap = await getDocs(reviewsQuery);
        reviewsSnap.forEach(doc => {
          allReviews.push({ id: doc.id, ...doc.data() } as VehicleReview);
        });
      }
      setReviews(allReviews);

      // Filter bookings by date range
      const filteredBookings = allBookings.filter(b => {
        const createdAt = b.createdAt instanceof Timestamp 
          ? b.createdAt.toDate() 
          : new Date(b.createdAt);
        return createdAt >= startDate;
      });

      // Calculate stats
      const completedBookings = filteredBookings.filter(b => b.status === 'completed');
      const cancelledBookings = filteredBookings.filter(b => b.status === 'cancelled');
      const pendingBookings = filteredBookings.filter(b => b.status === 'pending' || b.status === 'confirmed');

      const totalRevenue = completedBookings.reduce((sum, b) => sum + (b.totalAmount || 0), 0);
      const avgBookingValue = completedBookings.length > 0 
        ? totalRevenue / completedBookings.length 
        : 0;

      const avgRating = allReviews.length > 0
        ? allReviews.reduce((sum, r) => sum + r.rating, 0) / allReviews.length
        : 0;

      const activeVehicles = vehiclesList.filter(v => v.status === 'active').length;

      // Calculate utilization (simplified)
      const totalDays = Math.ceil((new Date().getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
      const totalVehicleDays = vehiclesList.length * totalDays;
      const bookedDays = filteredBookings.reduce((sum, b) => {
        const start = b.startDate instanceof Timestamp ? b.startDate.toDate() : new Date(b.startDate);
        const end = b.endDate instanceof Timestamp ? b.endDate.toDate() : new Date(b.endDate);
        return sum + Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
      }, 0);
      const utilizationRate = totalVehicleDays > 0 ? (bookedDays / totalVehicleDays) * 100 : 0;

      // Count repeat customers
      const customerCounts = new Map<string, number>();
      filteredBookings.forEach(b => {
        const count = customerCounts.get(b.customerId) || 0;
        customerCounts.set(b.customerId, count + 1);
      });
      const repeatCustomers = Array.from(customerCounts.values()).filter(c => c > 1).length;

      // Response rate (reviews with owner responses)
      const reviewsWithResponse = allReviews.filter(r => r.ownerResponse).length;
      const responseRate = allReviews.length > 0 ? (reviewsWithResponse / allReviews.length) * 100 : 100;

      // Previous period comparison
      const prevStartDate = new Date(startDate.getTime() - (new Date().getTime() - startDate.getTime()));
      const prevBookings = allBookings.filter(b => {
        const createdAt = b.createdAt instanceof Timestamp 
          ? b.createdAt.toDate() 
          : new Date(b.createdAt);
        return createdAt >= prevStartDate && createdAt < startDate;
      });
      const prevCompletedBookings = prevBookings.filter(b => b.status === 'completed');
      const prevRevenue = prevCompletedBookings.reduce((sum, b) => sum + (b.totalAmount || 0), 0);
      const revenueChange = prevRevenue > 0 ? ((totalRevenue - prevRevenue) / prevRevenue) * 100 : 0;
      const bookingsChange = prevCompletedBookings.length > 0 
        ? ((completedBookings.length - prevCompletedBookings.length) / prevCompletedBookings.length) * 100 
        : 0;

      setStats({
        totalRevenue,
        revenueChange,
        totalBookings: filteredBookings.length,
        bookingsChange,
        averageRating: avgRating,
        ratingChange: 0,
        totalVehicles: vehiclesList.length,
        activeVehicles,
        completedBookings: completedBookings.length,
        cancelledBookings: cancelledBookings.length,
        pendingBookings: pendingBookings.length,
        averageBookingValue: avgBookingValue,
        utilizationRate,
        responseRate,
        repeatCustomers
      });

      // Revenue by month
      const monthlyRevenue = new Map<string, number>();
      const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      completedBookings.forEach(b => {
        const date = b.createdAt instanceof Timestamp ? b.createdAt.toDate() : new Date(b.createdAt);
        const monthKey = `${months[date.getMonth()]}`;
        monthlyRevenue.set(monthKey, (monthlyRevenue.get(monthKey) || 0) + (b.totalAmount || 0));
      });

      // Get last 6 months
      const now = new Date();
      const last6Months: ChartData[] = [];
      for (let i = 5; i >= 0; i--) {
        const monthDate = new Date(now.getFullYear(), now.getMonth() - i, 1);
        const monthKey = months[monthDate.getMonth()];
        last6Months.push({
          label: monthKey,
          value: monthlyRevenue.get(monthKey) || 0
        });
      }
      setRevenueByMonth(last6Months);

      // Bookings by status
      setBookingsByStatus([
        { label: 'Completed', value: completedBookings.length, color: '#10b981' },
        { label: 'Pending', value: pendingBookings.length, color: '#f59e0b' },
        { label: 'Cancelled', value: cancelledBookings.length, color: '#ef4444' }
      ]);

      // Top performing vehicles
      const vehicleRevenue = new Map<string, { revenue: number; bookings: number }>();
      completedBookings.forEach(b => {
        const current = vehicleRevenue.get(b.vehicleId) || { revenue: 0, bookings: 0 };
        vehicleRevenue.set(b.vehicleId, {
          revenue: current.revenue + (b.totalAmount || 0),
          bookings: current.bookings + 1
        });
      });

      const topVehiclesList = vehiclesList
        .map(v => ({
          vehicle: v,
          ...(vehicleRevenue.get(v.id!) || { revenue: 0, bookings: 0 })
        }))
        .sort((a, b) => b.revenue - a.revenue)
        .slice(0, 5);
      setTopVehicles(topVehiclesList);

      // Recent activity
      const activities: { type: string; message: string; time: Date }[] = [];
      
      // Add recent bookings
      allBookings.slice(0, 5).forEach(b => {
        const time = b.createdAt instanceof Timestamp ? b.createdAt.toDate() : new Date(b.createdAt);
        activities.push({
          type: 'booking',
          message: `New ${b.status} booking - $${b.totalAmount?.toLocaleString() || 0}`,
          time
        });
      });

      // Add recent reviews
      allReviews.slice(0, 3).forEach(r => {
        const time = r.createdAt instanceof Date ? r.createdAt : new Date(r.createdAt);
        activities.push({
          type: 'review',
          message: `New ${r.rating}-star review received`,
          time
        });
      });

      activities.sort((a, b) => b.time.getTime() - a.time.getTime());
      setRecentActivity(activities.slice(0, 8));

    } catch (error) {
      console.error('Error fetching analytics:', error);
    } finally {
      setLoading(false);
    }
  }, [user?.uid, getDateFilter]);

  useEffect(() => {
    fetchAnalyticsData();
  }, [fetchAnalyticsData]);

  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  // Format percentage
  const formatPercent = (value: number) => {
    return `${value >= 0 ? '+' : ''}${value.toFixed(1)}%`;
  };

  // Format relative time
  const formatRelativeTime = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    return `${days}d ago`;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <RefreshCw className="w-12 h-12 text-[#004643] animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading analytics...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-[#004643] text-white py-8">
        <div className="container mx-auto px-4">
          <button
            onClick={() => navigate('/vehicle-rental/owner-dashboard')}
            className="flex items-center text-white/80 hover:text-white mb-4"
            title="Go back to dashboard"
          >
            <ArrowLeft className="w-5 h-5 mr-1" />
            Back to Dashboard
          </button>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <BarChart3 className="w-8 h-8" />
              <div>
                <h1 className="text-3xl font-bold">Analytics Dashboard</h1>
                <p className="text-white/80 mt-1">Track your vehicle rental performance</p>
              </div>
            </div>

            {/* Date Range Selector */}
            <div className="flex items-center gap-3">
              <select
                value={dateRange}
                onChange={(e) => setDateRange(e.target.value as DateRange)}
                className="bg-white/10 border border-white/20 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-white/50"
                title="Select date range"
              >
                <option value="7d" className="text-gray-900">Last 7 days</option>
                <option value="30d" className="text-gray-900">Last 30 days</option>
                <option value="90d" className="text-gray-900">Last 90 days</option>
                <option value="12m" className="text-gray-900">Last 12 months</option>
                <option value="all" className="text-gray-900">All time</option>
              </select>

              <button
                onClick={fetchAnalyticsData}
                className="p-2 bg-white/10 rounded-lg hover:bg-white/20"
                title="Refresh data"
              >
                <RefreshCw className="w-5 h-5" />
              </button>

              <button
                className="flex items-center gap-2 px-4 py-2 bg-white text-[#004643] rounded-lg hover:bg-white/90"
                title="Export analytics report"
              >
                <Download className="w-4 h-4" />
                Export
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {/* Total Revenue */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-xl shadow-sm p-6"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Total Revenue</p>
                <p className="text-2xl font-bold text-gray-900">
                  {formatCurrency(stats.totalRevenue)}
                </p>
                <div className={`flex items-center gap-1 mt-1 text-sm ${
                  stats.revenueChange >= 0 ? 'text-green-600' : 'text-red-600'
                }`}>
                  {stats.revenueChange >= 0 ? (
                    <TrendingUp className="w-4 h-4" />
                  ) : (
                    <TrendingDown className="w-4 h-4" />
                  )}
                  <span>{formatPercent(stats.revenueChange)}</span>
                </div>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <DollarSign className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </motion.div>

          {/* Total Bookings */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-xl shadow-sm p-6"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Total Bookings</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalBookings}</p>
                <div className={`flex items-center gap-1 mt-1 text-sm ${
                  stats.bookingsChange >= 0 ? 'text-green-600' : 'text-red-600'
                }`}>
                  {stats.bookingsChange >= 0 ? (
                    <TrendingUp className="w-4 h-4" />
                  ) : (
                    <TrendingDown className="w-4 h-4" />
                  )}
                  <span>{formatPercent(stats.bookingsChange)}</span>
                </div>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <Calendar className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </motion.div>

          {/* Average Rating */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-xl shadow-sm p-6"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Average Rating</p>
                <div className="flex items-center gap-2">
                  <p className="text-2xl font-bold text-gray-900">
                    {stats.averageRating.toFixed(1)}
                  </p>
                  <Star className="w-5 h-5 text-yellow-400 fill-yellow-400" />
                </div>
                <p className="text-sm text-gray-500 mt-1">
                  {reviews.length} reviews
                </p>
              </div>
              <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                <Star className="w-6 h-6 text-yellow-600" />
              </div>
            </div>
          </motion.div>

          {/* Utilization Rate */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white rounded-xl shadow-sm p-6"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Utilization Rate</p>
                <p className="text-2xl font-bold text-gray-900">
                  {stats.utilizationRate.toFixed(0)}%
                </p>
                <p className="text-sm text-gray-500 mt-1">
                  {stats.activeVehicles} of {stats.totalVehicles} active
                </p>
              </div>
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <Percent className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </motion.div>
        </div>

        {/* Secondary Metrics */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 mb-8">
          <div className="bg-white rounded-lg shadow-sm p-4 text-center">
            <p className="text-2xl font-bold text-green-600">{stats.completedBookings}</p>
            <p className="text-xs text-gray-500">Completed</p>
          </div>
          <div className="bg-white rounded-lg shadow-sm p-4 text-center">
            <p className="text-2xl font-bold text-yellow-600">{stats.pendingBookings}</p>
            <p className="text-xs text-gray-500">Pending</p>
          </div>
          <div className="bg-white rounded-lg shadow-sm p-4 text-center">
            <p className="text-2xl font-bold text-red-600">{stats.cancelledBookings}</p>
            <p className="text-xs text-gray-500">Cancelled</p>
          </div>
          <div className="bg-white rounded-lg shadow-sm p-4 text-center">
            <p className="text-2xl font-bold text-gray-900">{formatCurrency(stats.averageBookingValue)}</p>
            <p className="text-xs text-gray-500">Avg Booking</p>
          </div>
          <div className="bg-white rounded-lg shadow-sm p-4 text-center">
            <p className="text-2xl font-bold text-blue-600">{stats.responseRate.toFixed(0)}%</p>
            <p className="text-xs text-gray-500">Response Rate</p>
          </div>
          <div className="bg-white rounded-lg shadow-sm p-4 text-center">
            <p className="text-2xl font-bold text-purple-600">{stats.repeatCustomers}</p>
            <p className="text-xs text-gray-500">Repeat Customers</p>
          </div>
        </div>

        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <SimpleBarChart
            data={revenueByMonth}
            title="Revenue by Month"
            height={200}
          />
          <SimpleLineChart
            data={revenueByMonth}
            title="Revenue Trend"
            height={200}
          />
        </div>

        {/* Bottom Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Top Performing Vehicles */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <Target className="w-5 h-5 text-[#004643]" />
              Top Performing Vehicles
            </h3>
            {topVehicles.length === 0 ? (
              <p className="text-gray-500 text-center py-8">No booking data yet</p>
            ) : (
              <div className="space-y-4">
                {topVehicles.map((item, index) => (
                  <div key={item.vehicle.id} className="flex items-center gap-4">
                    <div className="w-8 h-8 bg-[#004643] text-white rounded-full flex items-center justify-center font-bold">
                      {index + 1}
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-gray-900">
                        {item.vehicle.make} {item.vehicle.model}
                      </p>
                      <p className="text-sm text-gray-500">
                        {item.bookings} bookings
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-gray-900">
                        {formatCurrency(item.revenue)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Recent Activity */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <Zap className="w-5 h-5 text-[#004643]" />
              Recent Activity
            </h3>
            {recentActivity.length === 0 ? (
              <p className="text-gray-500 text-center py-8">No recent activity</p>
            ) : (
              <div className="space-y-3">
                {recentActivity.map((activity, index) => (
                  <div key={index} className="flex items-start gap-3 py-2 border-b border-gray-100 last:border-0">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                      activity.type === 'booking' 
                        ? 'bg-blue-100' 
                        : 'bg-yellow-100'
                    }`}>
                      {activity.type === 'booking' ? (
                        <Calendar className="w-4 h-4 text-blue-600" />
                      ) : (
                        <Star className="w-4 h-4 text-yellow-600" />
                      )}
                    </div>
                    <div className="flex-1">
                      <p className="text-sm text-gray-900">{activity.message}</p>
                      <p className="text-xs text-gray-500">
                        {formatRelativeTime(activity.time)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Booking Status Distribution */}
        <div className="mt-8 bg-white rounded-xl shadow-sm p-6">
          <h3 className="font-semibold text-gray-900 mb-4">Booking Status Distribution</h3>
          <div className="flex items-center gap-8">
            {bookingsByStatus.map((status) => (
              <div key={status.label} className="flex items-center gap-3">
                <div
                  className="w-4 h-4 rounded"
                  style={{ backgroundColor: status.color }}
                />
                <div>
                  <p className="font-medium text-gray-900">{status.value}</p>
                  <p className="text-sm text-gray-500">{status.label}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-4 h-4 flex rounded-full overflow-hidden bg-gray-200">
            {bookingsByStatus.map((status) => {
              const total = bookingsByStatus.reduce((sum, s) => sum + s.value, 0);
              const percentage = total > 0 ? (status.value / total) * 100 : 0;
              return (
                <div
                  key={status.label}
                  style={{
                    width: `${percentage}%`,
                    backgroundColor: status.color
                  }}
                  title={`${status.label}: ${status.value}`}
                />
              );
            })}
          </div>
        </div>

        {/* Performance Tips */}
        <div className="mt-8 bg-blue-50 border border-blue-200 rounded-xl p-6">
          <h3 className="font-semibold text-blue-900 mb-3 flex items-center gap-2">
            <BarChart3 className="w-5 h-5" />
            Performance Insights
          </h3>
          <ul className="space-y-2 text-blue-800 text-sm">
            {stats.utilizationRate < 50 && (
              <li>• Your utilization rate is below 50%. Consider adjusting your pricing or availability.</li>
            )}
            {stats.responseRate < 80 && (
              <li>• Responding to reviews can improve your visibility. Current response rate: {stats.responseRate.toFixed(0)}%</li>
            )}
            {stats.cancelledBookings > stats.completedBookings * 0.2 && (
              <li>• High cancellation rate detected. Review your booking policies.</li>
            )}
            {stats.averageRating >= 4.5 && (
              <li>• Great job! Your average rating of {stats.averageRating.toFixed(1)} is excellent.</li>
            )}
            {stats.repeatCustomers > 0 && (
              <li>• You have {stats.repeatCustomers} repeat customers. Consider a loyalty program!</li>
            )}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default OwnerAnalytics;
