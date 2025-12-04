/**
 * Booking Analytics
 * Booking trends, patterns, peak times, and customer insights
 */
import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Calendar,
  TrendingUp,
  TrendingDown,
  Users,
  Clock,
  ArrowLeft,
  RefreshCw,
  MapPin,
  Filter,
  BarChart3,
  Activity,
  Target,
  AlertCircle,
  CheckCircle2,
  XCircle,
  ChevronRight,
  Repeat,
  UserCheck,
  Timer,
  Sun,
  Moon,
  Sunrise
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
import type { Vehicle, VehicleRentalBooking } from '@/types/vehicleRental';

interface BookingStats {
  totalBookings: number;
  confirmedBookings: number;
  completedBookings: number;
  cancelledBookings: number;
  pendingBookings: number;
  conversionRate: number;
  avgBookingValue: number;
  avgBookingDuration: number;
}

interface TimeSlotData {
  slot: string;
  icon: React.ReactNode;
  bookings: number;
  percentage: number;
}

interface DayOfWeekData {
  day: string;
  bookings: number;
  revenue: number;
}

interface CustomerInsight {
  totalCustomers: number;
  repeatCustomers: number;
  repeatRate: number;
  avgBookingsPerCustomer: number;
  topLocations: { location: string; count: number }[];
}

// Simple Line Chart Component
const SimpleLineChart: React.FC<{
  data: { label: string; value: number }[];
  height?: number;
  color?: string;
}> = ({ data, height = 200, color = '#10B981' }) => {
  if (data.length === 0) return null;
  
  const maxValue = Math.max(...data.map(d => d.value), 1);
  const minValue = Math.min(...data.map(d => d.value), 0);
  const range = maxValue - minValue || 1;
  
  const padding = 40;
  const chartWidth = 100;
  const chartHeight = height - padding * 2;
  
  const points = data.map((d, i) => {
    const x = (i / (data.length - 1 || 1)) * chartWidth;
    const y = chartHeight - ((d.value - minValue) / range) * chartHeight;
    return `${x},${y}`;
  }).join(' ');

  return (
    <div className="relative" style={{ height }}>
      <svg
        viewBox={`-10 -${padding} ${chartWidth + 20} ${height}`}
        className="w-full h-full"
        preserveAspectRatio="none"
      >
        {/* Grid lines */}
        {[0, 0.25, 0.5, 0.75, 1].map((ratio, i) => (
          <line
            key={i}
            x1="-5"
            y1={chartHeight * (1 - ratio)}
            x2={chartWidth + 5}
            y2={chartHeight * (1 - ratio)}
            stroke="#e5e7eb"
            strokeDasharray="2,2"
          />
        ))}
        
        {/* Line */}
        <polyline
          points={points}
          fill="none"
          stroke={color}
          strokeWidth="2"
          vectorEffect="non-scaling-stroke"
        />
        
        {/* Area fill */}
        <polygon
          points={`0,${chartHeight} ${points} ${chartWidth},${chartHeight}`}
          fill={`${color}20`}
        />
        
        {/* Data points */}
        {data.map((d, i) => {
          const x = (i / (data.length - 1 || 1)) * chartWidth;
          const y = chartHeight - ((d.value - minValue) / range) * chartHeight;
          return (
            <circle
              key={i}
              cx={x}
              cy={y}
              r="3"
              fill={color}
              stroke="white"
              strokeWidth="1.5"
            />
          );
        })}
      </svg>
      
      {/* X-axis labels */}
      <div className="absolute bottom-0 left-0 right-0 flex justify-between text-xs text-gray-500 px-2">
        {data.map((d, i) => (
          <span key={i} className="truncate">{d.label}</span>
        ))}
      </div>
    </div>
  );
};

// Horizontal Bar Chart
const HorizontalBarChart: React.FC<{
  data: { label: string; value: number; color?: string }[];
}> = ({ data }) => {
  const maxValue = Math.max(...data.map(d => d.value), 1);
  
  return (
    <div className="space-y-3">
      {data.map((item, index) => (
        <div key={index}>
          <div className="flex items-center justify-between mb-1">
            <span className="text-sm text-gray-600">{item.label}</span>
            <span className="text-sm font-medium text-gray-800">{item.value}</span>
          </div>
          <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full ${item.color || 'bg-green-500'}`}
              style={{ width: `${(item.value / maxValue) * 100}%`, transition: 'width 0.3s ease' }}
            />
          </div>
        </div>
      ))}
    </div>
  );
};

const BookingAnalytics: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  
  // State
  const [loading, setLoading] = useState(true);
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [bookings, setBookings] = useState<VehicleRentalBooking[]>([]);
  const [stats, setStats] = useState<BookingStats>({
    totalBookings: 0,
    confirmedBookings: 0,
    completedBookings: 0,
    cancelledBookings: 0,
    pendingBookings: 0,
    conversionRate: 0,
    avgBookingValue: 0,
    avgBookingDuration: 0
  });
  const [weeklyData, setWeeklyData] = useState<{ label: string; value: number }[]>([]);
  const [timeSlotData, setTimeSlotData] = useState<TimeSlotData[]>([]);
  const [dayOfWeekData, setDayOfWeekData] = useState<DayOfWeekData[]>([]);
  const [customerInsights, setCustomerInsights] = useState<CustomerInsight>({
    totalCustomers: 0,
    repeatCustomers: 0,
    repeatRate: 0,
    avgBookingsPerCustomer: 0,
    topLocations: []
  });
  const [statusBreakdown, setStatusBreakdown] = useState<{ status: string; count: number; color: string }[]>([]);
  
  // Filters
  const [selectedPeriod, setSelectedPeriod] = useState<'7d' | '30d' | '90d' | '12m'>('30d');
  const [selectedVehicle, setSelectedVehicle] = useState<string>('all');

  // Fetch data
  const fetchData = useCallback(async () => {
    if (!user?.uid) return;

    setLoading(true);
    try {
      // Fetch owner's vehicles
      const vehiclesQuery = query(
        collection(db, 'vehicles'),
        where('ownerId', '==', user.uid)
      );
      const vehiclesSnap = await getDocs(vehiclesQuery);
      const vehiclesList: Vehicle[] = [];
      const vehicleIds: string[] = [];
      vehiclesSnap.forEach(doc => {
        const vehicle = { id: doc.id, ...doc.data() } as Vehicle;
        vehiclesList.push(vehicle);
        vehicleIds.push(doc.id);
      });
      setVehicles(vehiclesList);

      if (vehicleIds.length === 0) {
        setLoading(false);
        return;
      }

      // Fetch bookings
      const bookingsQuery = query(
        collection(db, 'vehicle_bookings'),
        where('vehicleId', 'in', vehicleIds.slice(0, 10)),
        orderBy('createdAt', 'desc')
      );
      const bookingsSnap = await getDocs(bookingsQuery);
      const bookingsList: VehicleRentalBooking[] = [];
      bookingsSnap.forEach(doc => {
        bookingsList.push({ id: doc.id, ...doc.data() } as VehicleRentalBooking);
      });
      setBookings(bookingsList);

      // Calculate analytics
      calculateAnalytics(bookingsList, vehiclesList);
    } catch (error) {
      console.error('Error fetching booking data:', error);
    } finally {
      setLoading(false);
    }
  }, [user?.uid]);

  const calculateAnalytics = (
    bookingsList: VehicleRentalBooking[],
    vehiclesList: Vehicle[]
  ) => {
    // Get date range
    const now = new Date();
    let startDate: Date;
    let days: number;
    switch (selectedPeriod) {
      case '7d':
        startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        days = 7;
        break;
      case '30d':
        startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        days = 30;
        break;
      case '90d':
        startDate = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);
        days = 90;
        break;
      case '12m':
        startDate = new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000);
        days = 365;
        break;
      default:
        startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        days = 30;
    }

    // Filter bookings by period and vehicle
    let filteredBookings = bookingsList.filter(b => {
      const createdAt = b.createdAt instanceof Timestamp 
        ? b.createdAt.toDate() 
        : new Date(b.createdAt);
      return createdAt >= startDate;
    });

    if (selectedVehicle !== 'all') {
      filteredBookings = filteredBookings.filter(b => b.vehicleId === selectedVehicle);
    }

    // Calculate status counts
    const confirmedBookings = filteredBookings.filter(b => b.status === 'confirmed').length;
    const completedBookings = filteredBookings.filter(b => b.status === 'completed').length;
    const cancelledBookings = filteredBookings.filter(b => b.status === 'cancelled').length;
    const pendingBookings = filteredBookings.filter(b => b.status === 'pending').length;

    // Calculate average booking value
    const totalRevenue = filteredBookings
      .filter(b => b.status === 'completed' || b.status === 'confirmed')
      .reduce((sum, b) => sum + (b.totalAmount || 0), 0);
    const avgBookingValue = filteredBookings.length > 0 
      ? totalRevenue / filteredBookings.filter(b => b.status === 'completed' || b.status === 'confirmed').length
      : 0;

    // Calculate average booking duration
    const totalDays = filteredBookings.reduce((sum, b) => {
      const start = b.pickupDate instanceof Timestamp ? b.pickupDate.toDate() : new Date(b.pickupDate);
      const end = b.dropoffDate instanceof Timestamp ? b.dropoffDate.toDate() : new Date(b.dropoffDate);
      return sum + Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
    }, 0);
    const avgBookingDuration = filteredBookings.length > 0 ? totalDays / filteredBookings.length : 0;

    // Conversion rate (completed / total)
    const conversionRate = filteredBookings.length > 0 
      ? (completedBookings / filteredBookings.length) * 100
      : 0;

    setStats({
      totalBookings: filteredBookings.length,
      confirmedBookings,
      completedBookings,
      cancelledBookings,
      pendingBookings,
      conversionRate,
      avgBookingValue,
      avgBookingDuration
    });

    // Status breakdown for chart
    setStatusBreakdown([
      { status: 'Completed', count: completedBookings, color: 'bg-green-500' },
      { status: 'Confirmed', count: confirmedBookings, color: 'bg-blue-500' },
      { status: 'Pending', count: pendingBookings, color: 'bg-yellow-500' },
      { status: 'Cancelled', count: cancelledBookings, color: 'bg-red-500' }
    ]);

    // Weekly trend data
    const weeklyMap = new Map<string, number>();
    const weeksToShow = Math.min(Math.ceil(days / 7), 8);
    for (let i = weeksToShow - 1; i >= 0; i--) {
      const weekStart = new Date(now.getTime() - (i + 1) * 7 * 24 * 60 * 60 * 1000);
      const weekEnd = new Date(now.getTime() - i * 7 * 24 * 60 * 60 * 1000);
      const weekLabel = `W${weeksToShow - i}`;
      
      const weekBookings = filteredBookings.filter(b => {
        const createdAt = b.createdAt instanceof Timestamp 
          ? b.createdAt.toDate() 
          : new Date(b.createdAt);
        return createdAt >= weekStart && createdAt < weekEnd;
      }).length;
      
      weeklyMap.set(weekLabel, weekBookings);
    }
    setWeeklyData(Array.from(weeklyMap.entries()).map(([label, value]) => ({ label, value })));

    // Time slot analysis
    const timeSlots = { morning: 0, afternoon: 0, evening: 0 };
    filteredBookings.forEach(b => {
      const pickupTime = b.pickupTime || '12:00';
      const hour = parseInt(pickupTime.split(':')[0]);
      if (hour >= 6 && hour < 12) timeSlots.morning++;
      else if (hour >= 12 && hour < 18) timeSlots.afternoon++;
      else timeSlots.evening++;
    });
    const totalTimeSlots = timeSlots.morning + timeSlots.afternoon + timeSlots.evening || 1;
    setTimeSlotData([
      { 
        slot: 'Morning (6AM-12PM)', 
        icon: <Sunrise className="w-5 h-5 text-orange-500" />,
        bookings: timeSlots.morning,
        percentage: (timeSlots.morning / totalTimeSlots) * 100
      },
      { 
        slot: 'Afternoon (12PM-6PM)', 
        icon: <Sun className="w-5 h-5 text-yellow-500" />,
        bookings: timeSlots.afternoon,
        percentage: (timeSlots.afternoon / totalTimeSlots) * 100
      },
      { 
        slot: 'Evening (6PM-12AM)', 
        icon: <Moon className="w-5 h-5 text-indigo-500" />,
        bookings: timeSlots.evening,
        percentage: (timeSlots.evening / totalTimeSlots) * 100
      }
    ]);

    // Day of week analysis
    const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const dayData = dayNames.map(day => ({ day, bookings: 0, revenue: 0 }));
    filteredBookings.forEach(b => {
      const createdAt = b.createdAt instanceof Timestamp 
        ? b.createdAt.toDate() 
        : new Date(b.createdAt);
      const dayIndex = createdAt.getDay();
      dayData[dayIndex].bookings++;
      if (b.status === 'completed') {
        dayData[dayIndex].revenue += b.totalAmount || 0;
      }
    });
    setDayOfWeekData(dayData);

    // Customer insights
    const customerMap = new Map<string, number>();
    const locationMap = new Map<string, number>();
    
    filteredBookings.forEach(b => {
      // Count bookings per customer
      const customerId = b.userId || b.customerEmail || 'unknown';
      customerMap.set(customerId, (customerMap.get(customerId) || 0) + 1);
      
      // Count pickup locations
      if (b.pickupLocation) {
        const location = typeof b.pickupLocation === 'string' 
          ? b.pickupLocation 
          : (b.pickupLocation as { address?: string })?.address || 'Unknown';
        locationMap.set(location, (locationMap.get(location) || 0) + 1);
      }
    });

    const totalCustomers = customerMap.size;
    const repeatCustomers = Array.from(customerMap.values()).filter(count => count > 1).length;
    const repeatRate = totalCustomers > 0 ? (repeatCustomers / totalCustomers) * 100 : 0;
    const avgBookingsPerCustomer = totalCustomers > 0 ? filteredBookings.length / totalCustomers : 0;

    // Top pickup locations
    const topLocations = Array.from(locationMap.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([location, count]) => ({ location, count }));

    setCustomerInsights({
      totalCustomers,
      repeatCustomers,
      repeatRate,
      avgBookingsPerCustomer,
      topLocations
    });
  };

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  useEffect(() => {
    if (bookings.length > 0 && vehicles.length > 0) {
      calculateAnalytics(bookings, vehicles);
    }
  }, [selectedPeriod, selectedVehicle]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0
    }).format(amount);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <RefreshCw className="w-8 h-8 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600">Loading booking analytics...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <button
            onClick={() => navigate('/vehicle-rental/owner-analytics')}
            className="flex items-center text-white/80 hover:text-white mb-4"
          >
            <ArrowLeft className="w-5 h-5 mr-1" />
            Back to Analytics
          </button>
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-2xl font-bold flex items-center gap-2">
                <Calendar className="w-7 h-7" />
                Booking Analytics
              </h1>
              <p className="text-white/80 mt-1">
                Booking trends, patterns, and customer insights
              </p>
            </div>

            <div className="flex items-center gap-3">
              {/* Vehicle Filter */}
              <select
                value={selectedVehicle}
                onChange={(e) => setSelectedVehicle(e.target.value)}
                title="Filter by vehicle"
                aria-label="Filter by vehicle"
                className="bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-white/30"
              >
                <option value="all" className="text-gray-800">All Vehicles</option>
                {vehicles.map(v => (
                  <option key={v.id} value={v.id} className="text-gray-800">
                    {v.make} {v.model}
                  </option>
                ))}
              </select>

              {/* Period Selector */}
              <select
                value={selectedPeriod}
                onChange={(e) => setSelectedPeriod(e.target.value as typeof selectedPeriod)}
                title="Select time period"
                aria-label="Select time period"
                className="bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-white/30"
              >
                <option value="7d" className="text-gray-800">Last 7 Days</option>
                <option value="30d" className="text-gray-800">Last 30 Days</option>
                <option value="90d" className="text-gray-800">Last 90 Days</option>
                <option value="12m" className="text-gray-800">Last 12 Months</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-xl p-4 shadow-sm border border-gray-100"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-500 text-sm">Total Bookings</span>
              <Calendar className="w-5 h-5 text-blue-500" />
            </div>
            <div className="text-2xl font-bold text-gray-800">{stats.totalBookings}</div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-xl p-4 shadow-sm border border-gray-100"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-500 text-sm">Conversion Rate</span>
              <Target className="w-5 h-5 text-green-500" />
            </div>
            <div className="text-2xl font-bold text-green-600">{stats.conversionRate.toFixed(1)}%</div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-xl p-4 shadow-sm border border-gray-100"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-500 text-sm">Avg. Value</span>
              <TrendingUp className="w-5 h-5 text-purple-500" />
            </div>
            <div className="text-2xl font-bold text-gray-800">{formatCurrency(stats.avgBookingValue)}</div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white rounded-xl p-4 shadow-sm border border-gray-100"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-500 text-sm">Avg. Duration</span>
              <Timer className="w-5 h-5 text-orange-500" />
            </div>
            <div className="text-2xl font-bold text-gray-800">{stats.avgBookingDuration.toFixed(1)} days</div>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Weekly Booking Trend */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="lg:col-span-2 bg-white rounded-xl p-6 shadow-sm border border-gray-100"
          >
            <h2 className="text-lg font-semibold text-gray-800 flex items-center gap-2 mb-6">
              <Activity className="w-5 h-5 text-blue-500" />
              Weekly Booking Trend
            </h2>

            {weeklyData.length > 0 ? (
              <SimpleLineChart
                data={weeklyData}
                height={250}
                color="#3B82F6"
              />
            ) : (
              <div className="h-[250px] flex items-center justify-center text-gray-400">
                No booking data for selected period
              </div>
            )}
          </motion.div>

          {/* Status Breakdown */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white rounded-xl p-6 shadow-sm border border-gray-100"
          >
            <h2 className="text-lg font-semibold text-gray-800 flex items-center gap-2 mb-6">
              <BarChart3 className="w-5 h-5 text-purple-500" />
              Status Breakdown
            </h2>

            <HorizontalBarChart data={statusBreakdown.map(s => ({
              label: s.status,
              value: s.count,
              color: s.color
            }))} />

            {/* Status Legend */}
            <div className="mt-6 pt-4 border-t border-gray-100 grid grid-cols-2 gap-3">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-green-500" />
                <span className="text-sm text-gray-600">Completed: {stats.completedBookings}</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-blue-500" />
                <span className="text-sm text-gray-600">Confirmed: {stats.confirmedBookings}</span>
              </div>
              <div className="flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-yellow-500" />
                <span className="text-sm text-gray-600">Pending: {stats.pendingBookings}</span>
              </div>
              <div className="flex items-center gap-2">
                <XCircle className="w-4 h-4 text-red-500" />
                <span className="text-sm text-gray-600">Cancelled: {stats.cancelledBookings}</span>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Time Analysis Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
          {/* Time Slot Preferences */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-white rounded-xl p-6 shadow-sm border border-gray-100"
          >
            <h2 className="text-lg font-semibold text-gray-800 flex items-center gap-2 mb-6">
              <Clock className="w-5 h-5 text-orange-500" />
              Pickup Time Preferences
            </h2>

            <div className="space-y-4">
              {timeSlotData.map((slot, idx) => (
                <div key={idx} className="flex items-center gap-4">
                  <div className="p-2 bg-gray-50 rounded-lg">{slot.icon}</div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm text-gray-700">{slot.slot}</span>
                      <span className="text-sm font-medium text-gray-800">{slot.bookings} bookings</span>
                    </div>
                    <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-orange-400 to-orange-500 rounded-full"
                        style={{ width: `${slot.percentage}%` }}
                      />
                    </div>
                    <div className="text-xs text-gray-400 mt-1">{slot.percentage.toFixed(1)}% of bookings</div>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Day of Week Analysis */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="bg-white rounded-xl p-6 shadow-sm border border-gray-100"
          >
            <h2 className="text-lg font-semibold text-gray-800 flex items-center gap-2 mb-6">
              <Calendar className="w-5 h-5 text-blue-500" />
              Bookings by Day of Week
            </h2>

            <div className="grid grid-cols-7 gap-2">
              {dayOfWeekData.map((day, idx) => {
                const maxBookings = Math.max(...dayOfWeekData.map(d => d.bookings), 1);
                const height = (day.bookings / maxBookings) * 100;
                return (
                  <div key={idx} className="flex flex-col items-center">
                    <div className="h-24 w-full flex items-end justify-center mb-2">
                      <div
                        className={`w-full rounded-t-md ${
                          idx === 0 || idx === 6 ? 'bg-blue-400' : 'bg-blue-500'
                        }`}
                        style={{ height: `${Math.max(height, 8)}%` }}
                      />
                    </div>
                    <span className="text-xs font-medium text-gray-600">{day.day.slice(0, 3)}</span>
                    <span className="text-xs text-gray-400">{day.bookings}</span>
                  </div>
                );
              })}
            </div>
          </motion.div>
        </div>

        {/* Customer Insights */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="mt-6 bg-white rounded-xl p-6 shadow-sm border border-gray-100"
        >
          <h2 className="text-lg font-semibold text-gray-800 flex items-center gap-2 mb-6">
            <Users className="w-5 h-5 text-green-500" />
            Customer Insights
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="text-center p-4 bg-gray-50 rounded-xl">
              <UserCheck className="w-8 h-8 text-blue-500 mx-auto mb-2" />
              <div className="text-2xl font-bold text-gray-800">{customerInsights.totalCustomers}</div>
              <div className="text-sm text-gray-500">Unique Customers</div>
            </div>
            
            <div className="text-center p-4 bg-gray-50 rounded-xl">
              <Repeat className="w-8 h-8 text-green-500 mx-auto mb-2" />
              <div className="text-2xl font-bold text-green-600">{customerInsights.repeatCustomers}</div>
              <div className="text-sm text-gray-500">Repeat Customers</div>
            </div>
            
            <div className="text-center p-4 bg-gray-50 rounded-xl">
              <Target className="w-8 h-8 text-purple-500 mx-auto mb-2" />
              <div className="text-2xl font-bold text-purple-600">{customerInsights.repeatRate.toFixed(1)}%</div>
              <div className="text-sm text-gray-500">Repeat Rate</div>
            </div>
            
            <div className="text-center p-4 bg-gray-50 rounded-xl">
              <Activity className="w-8 h-8 text-orange-500 mx-auto mb-2" />
              <div className="text-2xl font-bold text-gray-800">{customerInsights.avgBookingsPerCustomer.toFixed(1)}</div>
              <div className="text-sm text-gray-500">Avg Bookings/Customer</div>
            </div>
          </div>

          {/* Top Pickup Locations */}
          {customerInsights.topLocations.length > 0 && (
            <div className="mt-6 pt-6 border-t border-gray-100">
              <h3 className="text-sm font-medium text-gray-700 mb-4 flex items-center gap-2">
                <MapPin className="w-4 h-4 text-red-500" />
                Top Pickup Locations
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
                {customerInsights.topLocations.map((loc, idx) => (
                  <div key={idx} className="flex items-center gap-2 p-2 bg-gray-50 rounded-lg">
                    <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                      idx === 0 ? 'bg-yellow-100 text-yellow-600' :
                      idx === 1 ? 'bg-gray-200 text-gray-600' :
                      idx === 2 ? 'bg-orange-100 text-orange-600' : 'bg-gray-100 text-gray-500'
                    }`}>
                      {idx + 1}
                    </span>
                    <span className="text-sm text-gray-700 truncate flex-1">{loc.location}</span>
                    <span className="text-xs text-gray-400">{loc.count}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </motion.div>

        {/* Quick Links */}
        <div className="mt-8 flex flex-wrap gap-4">
          <Link
            to="/vehicle-rental/owner-analytics"
            className="flex items-center gap-2 text-gray-600 hover:text-blue-600 transition-colors"
          >
            <BarChart3 className="w-4 h-4" />
            View Full Analytics
            <ChevronRight className="w-4 h-4" />
          </Link>
          <Link
            to="/vehicle-rental/earnings-reports"
            className="flex items-center gap-2 text-gray-600 hover:text-blue-600 transition-colors"
          >
            <TrendingUp className="w-4 h-4" />
            Earnings Reports
            <ChevronRight className="w-4 h-4" />
          </Link>
          <Link
            to="/vehicle-rental/owner-dashboard"
            className="flex items-center gap-2 text-gray-600 hover:text-blue-600 transition-colors"
          >
            <Filter className="w-4 h-4" />
            Manage Bookings
            <ChevronRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default BookingAnalytics;
