/**
 * Vehicle Performance Analytics
 * Individual vehicle performance tracking with utilization, earnings, and ratings
 */
import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
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
  ChevronRight,
  RefreshCw,
  Eye,
  MessageSquare,
  CheckCircle2,
  XCircle,
  MapPin,
  Fuel,
  Settings,
  Percent,
  Target,
  Award,
  ThumbsUp
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { db } from '@/lib/firebase';
import {
  collection,
  query,
  where,
  getDocs,
  doc,
  getDoc,
  orderBy,
  Timestamp
} from 'firebase/firestore';
import type { Vehicle, VehicleRentalBooking, VehicleReview } from '@/types/vehicleRental';

interface PerformanceMetric {
  label: string;
  value: string | number;
  change?: number;
  icon: React.ReactNode;
  color: string;
}

interface MonthlyData {
  month: string;
  revenue: number;
  bookings: number;
}

const VehiclePerformance: React.FC = () => {
  const { vehicleId } = useParams<{ vehicleId: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();

  // State
  const [loading, setLoading] = useState(true);
  const [vehicle, setVehicle] = useState<Vehicle | null>(null);
  const [bookings, setBookings] = useState<VehicleRentalBooking[]>([]);
  const [reviews, setReviews] = useState<VehicleReview[]>([]);
  const [selectedPeriod, setSelectedPeriod] = useState<'30d' | '90d' | '12m' | 'all'>('30d');

  // Metrics
  const [metrics, setMetrics] = useState<PerformanceMetric[]>([]);
  const [monthlyData, setMonthlyData] = useState<MonthlyData[]>([]);
  const [recentBookings, setRecentBookings] = useState<VehicleRentalBooking[]>([]);
  const [topStats, setTopStats] = useState({
    totalEarnings: 0,
    totalBookings: 0,
    averageRating: 0,
    utilizationRate: 0,
    avgBookingDuration: 0,
    repeatCustomerRate: 0,
    cancellationRate: 0,
    viewsCount: 0
  });

  // Fetch data
  const fetchVehicleData = useCallback(async () => {
    if (!vehicleId || !user?.uid) return;

    setLoading(true);
    try {
      // Fetch vehicle
      const vehicleDoc = await getDoc(doc(db, 'vehicles', vehicleId));
      if (!vehicleDoc.exists()) {
        navigate('/vehicle-rental/owner-dashboard');
        return;
      }

      const vehicleData = { id: vehicleDoc.id, ...vehicleDoc.data() } as Vehicle;
      
      // Verify ownership
      if (vehicleData.ownerId !== user.uid) {
        navigate('/vehicle-rental/owner-dashboard');
        return;
      }

      setVehicle(vehicleData);

      // Fetch bookings
      const bookingsQuery = query(
        collection(db, 'vehicle_bookings'),
        where('vehicleId', '==', vehicleId),
        orderBy('createdAt', 'desc')
      );
      const bookingsSnap = await getDocs(bookingsQuery);
      const bookingsList: VehicleRentalBooking[] = [];
      bookingsSnap.forEach(doc => {
        bookingsList.push({ id: doc.id, ...doc.data() } as VehicleRentalBooking);
      });
      setBookings(bookingsList);
      setRecentBookings(bookingsList.slice(0, 5));

      // Fetch reviews
      const reviewsQuery = query(
        collection(db, 'vehicle_reviews'),
        where('vehicleId', '==', vehicleId),
        orderBy('createdAt', 'desc')
      );
      const reviewsSnap = await getDocs(reviewsQuery);
      const reviewsList: VehicleReview[] = [];
      reviewsSnap.forEach(doc => {
        reviewsList.push({ id: doc.id, ...doc.data() } as VehicleReview);
      });
      setReviews(reviewsList);

      // Calculate metrics
      calculateMetrics(bookingsList, reviewsList, vehicleData);
    } catch (error) {
      console.error('Error fetching vehicle data:', error);
    } finally {
      setLoading(false);
    }
  }, [vehicleId, user?.uid, navigate]);

  const calculateMetrics = (
    bookingsList: VehicleRentalBooking[],
    reviewsList: VehicleReview[],
    vehicleData: Vehicle
  ) => {
    // Get date range
    const now = new Date();
    let startDate: Date;
    switch (selectedPeriod) {
      case '30d':
        startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        break;
      case '90d':
        startDate = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);
        break;
      case '12m':
        startDate = new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000);
        break;
      default:
        startDate = new Date(0);
    }

    // Filter bookings by period
    const filteredBookings = bookingsList.filter(b => {
      const createdAt = b.createdAt instanceof Timestamp 
        ? b.createdAt.toDate() 
        : new Date(b.createdAt);
      return createdAt >= startDate;
    });

    const completedBookings = filteredBookings.filter(b => b.status === 'completed');
    const cancelledBookings = filteredBookings.filter(b => b.status === 'cancelled');

    // Calculate total earnings
    const totalEarnings = completedBookings.reduce((sum, b) => sum + (b.totalAmount || 0), 0);

    // Calculate average rating
    const avgRating = reviewsList.length > 0
      ? reviewsList.reduce((sum, r) => sum + r.rating, 0) / reviewsList.length
      : 0;

    // Calculate utilization rate
    const totalDays = Math.ceil((now.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
    const bookedDays = filteredBookings.reduce((sum, b) => {
      const start = b.startDate instanceof Timestamp ? b.startDate.toDate() : new Date(b.startDate);
      const end = b.endDate instanceof Timestamp ? b.endDate.toDate() : new Date(b.endDate);
      return sum + Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
    }, 0);
    const utilizationRate = totalDays > 0 ? (bookedDays / totalDays) * 100 : 0;

    // Average booking duration
    const totalBookingDays = completedBookings.reduce((sum, b) => {
      const start = b.startDate instanceof Timestamp ? b.startDate.toDate() : new Date(b.startDate);
      const end = b.endDate instanceof Timestamp ? b.endDate.toDate() : new Date(b.endDate);
      return sum + Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
    }, 0);
    const avgBookingDuration = completedBookings.length > 0 
      ? totalBookingDays / completedBookings.length 
      : 0;

    // Repeat customer rate
    const customerCounts = new Map<string, number>();
    filteredBookings.forEach(b => {
      const count = customerCounts.get(b.customerId) || 0;
      customerCounts.set(b.customerId, count + 1);
    });
    const repeatCustomers = Array.from(customerCounts.values()).filter(c => c > 1).length;
    const totalCustomers = customerCounts.size;
    const repeatCustomerRate = totalCustomers > 0 ? (repeatCustomers / totalCustomers) * 100 : 0;

    // Cancellation rate
    const cancellationRate = filteredBookings.length > 0
      ? (cancelledBookings.length / filteredBookings.length) * 100
      : 0;

    setTopStats({
      totalEarnings,
      totalBookings: filteredBookings.length,
      averageRating: avgRating,
      utilizationRate,
      avgBookingDuration,
      repeatCustomerRate,
      cancellationRate,
      viewsCount: 0 // Vehicle views tracking - to be implemented
    });

    // Build metrics array
    setMetrics([
      {
        label: 'Total Earnings',
        value: `$${totalEarnings.toLocaleString()}`,
        icon: <DollarSign className="w-5 h-5" />,
        color: 'green'
      },
      {
        label: 'Total Bookings',
        value: filteredBookings.length,
        icon: <Calendar className="w-5 h-5" />,
        color: 'blue'
      },
      {
        label: 'Average Rating',
        value: avgRating > 0 ? avgRating.toFixed(1) : 'N/A',
        icon: <Star className="w-5 h-5" />,
        color: 'yellow'
      },
      {
        label: 'Utilization Rate',
        value: `${utilizationRate.toFixed(0)}%`,
        icon: <Percent className="w-5 h-5" />,
        color: 'purple'
      },
      {
        label: 'Avg Booking Duration',
        value: `${avgBookingDuration.toFixed(1)} days`,
        icon: <Clock className="w-5 h-5" />,
        color: 'indigo'
      },
      {
        label: 'Repeat Customers',
        value: `${repeatCustomerRate.toFixed(0)}%`,
        icon: <Users className="w-5 h-5" />,
        color: 'teal'
      }
    ]);

    // Calculate monthly data
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const monthlyMap = new Map<string, { revenue: number; bookings: number }>();
    
    completedBookings.forEach(b => {
      const date = b.createdAt instanceof Timestamp ? b.createdAt.toDate() : new Date(b.createdAt);
      const monthKey = `${months[date.getMonth()]} ${date.getFullYear()}`;
      const current = monthlyMap.get(monthKey) || { revenue: 0, bookings: 0 };
      monthlyMap.set(monthKey, {
        revenue: current.revenue + (b.totalAmount || 0),
        bookings: current.bookings + 1
      });
    });

    // Get last 6 months
    const last6Months: MonthlyData[] = [];
    for (let i = 5; i >= 0; i--) {
      const monthDate = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const monthKey = `${months[monthDate.getMonth()]} ${monthDate.getFullYear()}`;
      const data = monthlyMap.get(monthKey) || { revenue: 0, bookings: 0 };
      last6Months.push({
        month: months[monthDate.getMonth()],
        ...data
      });
    }
    setMonthlyData(last6Months);
  };

  useEffect(() => {
    fetchVehicleData();
  }, [fetchVehicleData]);

  useEffect(() => {
    if (vehicle && bookings.length > 0) {
      calculateMetrics(bookings, reviews, vehicle);
    }
  }, [selectedPeriod]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const formatDate = (date: Date | Timestamp | string) => {
    const d = date instanceof Timestamp ? date.toDate() : new Date(date);
    return d.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const getColorClasses = (color: string) => {
    const colors: Record<string, { bg: string; text: string }> = {
      green: { bg: 'bg-green-100', text: 'text-green-600' },
      blue: { bg: 'bg-blue-100', text: 'text-blue-600' },
      yellow: { bg: 'bg-yellow-100', text: 'text-yellow-600' },
      purple: { bg: 'bg-purple-100', text: 'text-purple-600' },
      indigo: { bg: 'bg-indigo-100', text: 'text-indigo-600' },
      teal: { bg: 'bg-teal-100', text: 'text-teal-600' },
      red: { bg: 'bg-red-100', text: 'text-red-600' }
    };
    return colors[color] || colors.blue;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <RefreshCw className="w-12 h-12 text-[#004643] animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading vehicle analytics...</p>
        </div>
      </div>
    );
  }

  if (!vehicle) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Car className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Vehicle Not Found</h2>
          <p className="text-gray-500 mb-4">The vehicle you're looking for doesn't exist.</p>
          <Link
            to="/vehicle-rental/owner-dashboard"
            className="text-[#004643] hover:underline"
          >
            Go back to dashboard
          </Link>
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
            onClick={() => navigate('/vehicle-rental/owner/analytics')}
            className="flex items-center text-white/80 hover:text-white mb-4"
            title="Go back to analytics"
          >
            <ArrowLeft className="w-5 h-5 mr-1" />
            Back to Analytics
          </button>
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-4">
              {vehicle.photos?.[0] && (
                <img
                  src={vehicle.photos[0].url}
                  alt={`${vehicle.make} ${vehicle.model}`}
                  className="w-20 h-20 rounded-xl object-cover"
                />
              )}
              <div>
                <h1 className="text-2xl font-bold">
                  {vehicle.make} {vehicle.model} ({vehicle.year})
                </h1>
                <div className="flex items-center gap-4 mt-2 text-white/80 text-sm">
                  <span className="flex items-center gap-1">
                    <MapPin className="w-4 h-4" />
                    {vehicle.serviceAreas?.[0] || 'N/A'}
                  </span>
                  <span className="flex items-center gap-1">
                    <Fuel className="w-4 h-4" />
                    {vehicle.fuelType}
                  </span>
                  <span className={`px-2 py-0.5 rounded-full text-xs ${
                    vehicle.status === 'active' 
                      ? 'bg-green-500/20 text-green-200' 
                      : 'bg-yellow-500/20 text-yellow-200'
                  }`}>
                    {vehicle.status}
                  </span>
                </div>
              </div>
            </div>

            {/* Period Selector */}
            <select
              value={selectedPeriod}
              onChange={(e) => setSelectedPeriod(e.target.value as typeof selectedPeriod)}
              className="bg-white/10 border border-white/20 rounded-lg px-4 py-2 text-white focus:outline-none"
              title="Select time period"
            >
              <option value="30d" className="text-gray-900">Last 30 days</option>
              <option value="90d" className="text-gray-900">Last 90 days</option>
              <option value="12m" className="text-gray-900">Last 12 months</option>
              <option value="all" className="text-gray-900">All time</option>
            </select>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Key Metrics */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
          {metrics.map((metric, index) => {
            const colors = getColorClasses(metric.color);
            return (
              <motion.div
                key={metric.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="bg-white rounded-xl shadow-sm p-4"
              >
                <div className={`w-10 h-10 ${colors.bg} rounded-lg flex items-center justify-center mb-3`}>
                  <div className={colors.text}>{metric.icon}</div>
                </div>
                <p className="text-2xl font-bold text-gray-900">{metric.value}</p>
                <p className="text-sm text-gray-500">{metric.label}</p>
              </motion.div>
            );
          })}
        </div>

        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Revenue Chart */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h3 className="font-semibold text-gray-900 mb-4">Monthly Revenue</h3>
            <div className="flex items-end justify-between gap-2 h-48">
              {monthlyData.map((data, index) => {
                const maxRevenue = Math.max(...monthlyData.map(d => d.revenue), 1);
                return (
                  <div key={index} className="flex-1 flex flex-col items-center">
                    <div
                      className="w-full bg-[#004643] rounded-t-md transition-all duration-500"
                      style={{
                        height: `${(data.revenue / maxRevenue) * 100}%`,
                        minHeight: data.revenue > 0 ? '4px' : '0px'
                      }}
                    />
                    <span className="text-xs text-gray-500 mt-2">{data.month}</span>
                    <span className="text-xs font-medium text-gray-700">
                      ${data.revenue.toLocaleString()}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Bookings Chart */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h3 className="font-semibold text-gray-900 mb-4">Monthly Bookings</h3>
            <div className="flex items-end justify-between gap-2 h-48">
              {monthlyData.map((data, index) => {
                const maxBookings = Math.max(...monthlyData.map(d => d.bookings), 1);
                return (
                  <div key={index} className="flex-1 flex flex-col items-center">
                    <div
                      className="w-full bg-blue-500 rounded-t-md transition-all duration-500"
                      style={{
                        height: `${(data.bookings / maxBookings) * 100}%`,
                        minHeight: data.bookings > 0 ? '4px' : '0px'
                      }}
                    />
                    <span className="text-xs text-gray-500 mt-2">{data.month}</span>
                    <span className="text-xs font-medium text-gray-700">
                      {data.bookings}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Performance Indicators */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Views</p>
                <p className="text-2xl font-bold text-gray-900">{topStats.viewsCount}</p>
              </div>
              <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                <Eye className="w-5 h-5 text-gray-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Total Reviews</p>
                <p className="text-2xl font-bold text-gray-900">{reviews.length}</p>
              </div>
              <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center">
                <MessageSquare className="w-5 h-5 text-yellow-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Cancellation Rate</p>
                <p className={`text-2xl font-bold ${
                  topStats.cancellationRate > 20 ? 'text-red-600' : 'text-gray-900'
                }`}>
                  {topStats.cancellationRate.toFixed(0)}%
                </p>
              </div>
              <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
                <XCircle className="w-5 h-5 text-red-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Conversion Rate</p>
                <p className="text-2xl font-bold text-gray-900">
                  {topStats.viewsCount > 0 
                    ? ((topStats.totalBookings / topStats.viewsCount) * 100).toFixed(1)
                    : 0}%
                </p>
              </div>
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                <Target className="w-5 h-5 text-green-600" />
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent Bookings */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h3 className="font-semibold text-gray-900 mb-4">Recent Bookings</h3>
            {recentBookings.length === 0 ? (
              <p className="text-gray-500 text-center py-8">No bookings yet</p>
            ) : (
              <div className="space-y-3">
                {recentBookings.map((booking) => (
                  <div
                    key={booking.id}
                    className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                  >
                    <div>
                      <p className="font-medium text-gray-900">
                        {formatDate(booking.startDate)} - {formatDate(booking.endDate)}
                      </p>
                      <p className="text-sm text-gray-500">
                        {booking.customerName || 'Customer'}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-gray-900">
                        {formatCurrency(booking.totalAmount || 0)}
                      </p>
                      <span className={`inline-block px-2 py-0.5 rounded-full text-xs ${
                        booking.status === 'completed'
                          ? 'bg-green-100 text-green-700'
                          : booking.status === 'cancelled'
                          ? 'bg-red-100 text-red-700'
                          : 'bg-yellow-100 text-yellow-700'
                      }`}>
                        {booking.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Recent Reviews */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h3 className="font-semibold text-gray-900 mb-4">Recent Reviews</h3>
            {reviews.length === 0 ? (
              <p className="text-gray-500 text-center py-8">No reviews yet</p>
            ) : (
              <div className="space-y-3">
                {reviews.slice(0, 5).map((review) => (
                  <div
                    key={review.id}
                    className="p-3 bg-gray-50 rounded-lg"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-1">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star
                            key={star}
                            className={`w-4 h-4 ${
                              star <= review.rating
                                ? 'text-yellow-400 fill-yellow-400'
                                : 'text-gray-300'
                            }`}
                          />
                        ))}
                      </div>
                      <span className="text-xs text-gray-500">
                        {formatDate(review.createdAt)}
                      </span>
                    </div>
                    <p className="text-sm text-gray-700 line-clamp-2">
                      {review.comment}
                    </p>
                    {review.ownerResponse && (
                      <div className="mt-2 flex items-center gap-1 text-xs text-green-600">
                        <CheckCircle2 className="w-3 h-3" />
                        Responded
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Rating Breakdown */}
        {reviews.length > 0 && (
          <div className="mt-8 bg-white rounded-xl shadow-sm p-6">
            <h3 className="font-semibold text-gray-900 mb-4">Rating Breakdown</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { label: 'Condition', key: 'vehicleConditionRating' },
                { label: 'Cleanliness', key: 'cleanlinessRating' },
                { label: 'Value', key: 'valueForMoneyRating' },
                { label: 'Communication', key: 'ownerCommunicationRating' }
              ].map((category) => {
                const ratings = reviews
                  .map(r => (r as any)[category.key])
                  .filter(r => r !== undefined);
                const avg = ratings.length > 0
                  ? ratings.reduce((a, b) => a + b, 0) / ratings.length
                  : 0;
                
                return (
                  <div key={category.key} className="text-center">
                    <div className="flex items-center justify-center gap-1 mb-1">
                      <Star className="w-5 h-5 text-yellow-400 fill-yellow-400" />
                      <span className="text-xl font-bold text-gray-900">
                        {avg > 0 ? avg.toFixed(1) : 'N/A'}
                      </span>
                    </div>
                    <p className="text-sm text-gray-500">{category.label}</p>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Performance Tips */}
        <div className="mt-8 bg-blue-50 border border-blue-200 rounded-xl p-6">
          <h3 className="font-semibold text-blue-900 mb-3 flex items-center gap-2">
            <Award className="w-5 h-5" />
            Performance Insights
          </h3>
          <ul className="space-y-2 text-blue-800 text-sm">
            {topStats.utilizationRate < 30 && (
              <li>• Your vehicle utilization is below 30%. Consider adjusting your pricing or availability.</li>
            )}
            {topStats.averageRating >= 4.5 && (
              <li>• Excellent! Your {topStats.averageRating.toFixed(1)} rating makes this a top performer.</li>
            )}
            {topStats.cancellationRate > 15 && (
              <li>• High cancellation rate. Review your booking policies and communication.</li>
            )}
            {topStats.repeatCustomerRate > 20 && (
              <li>• Great job! {topStats.repeatCustomerRate.toFixed(0)}% repeat customers shows excellent service.</li>
            )}
            {reviews.length === 0 && (
              <li>• No reviews yet. Encourage customers to leave feedback after their trip.</li>
            )}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default VehiclePerformance;
