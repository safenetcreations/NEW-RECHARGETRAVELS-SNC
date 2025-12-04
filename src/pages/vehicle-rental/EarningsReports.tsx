/**
 * Earnings Reports
 * Detailed earnings reports with charts, exports, and date filtering
 */
import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  DollarSign,
  Calendar,
  Download,
  TrendingUp,
  TrendingDown,
  Car,
  ArrowLeft,
  RefreshCw,
  FileText,
  PieChart,
  BarChart3,
  ChevronRight,
  Filter,
  Clock,
  CheckCircle2,
  XCircle,
  AlertCircle
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

interface EarningsSummary {
  totalEarnings: number;
  pendingPayouts: number;
  completedPayouts: number;
  refunds: number;
  platformFees: number;
  netEarnings: number;
}

interface MonthlyEarning {
  month: string;
  year: number;
  gross: number;
  net: number;
  bookings: number;
  refunds: number;
}

interface VehicleEarning {
  vehicleId: string;
  vehicleName: string;
  earnings: number;
  bookings: number;
  percentage: number;
}

interface PayoutRecord {
  id: string;
  amount: number;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  method: string;
  requestedAt: Date;
  processedAt?: Date;
}

// Simple Bar Chart Component
const SimpleBarChart: React.FC<{
  data: { label: string; value: number; color?: string }[];
  height?: number;
}> = ({ data, height = 200 }) => {
  const maxValue = Math.max(...data.map(d => d.value), 1);
  
  return (
    <div className="flex items-end justify-between gap-2" style={{ height }}>
      {data.map((item, index) => (
        <div key={index} className="flex-1 flex flex-col items-center">
          <div className="w-full flex flex-col items-center">
            <span className="text-xs text-gray-500 mb-1">
              ${item.value.toLocaleString()}
            </span>
            <div
              className={`w-full rounded-t-md ${item.color || 'bg-green-500'}`}
              style={{
                height: `${Math.max((item.value / maxValue) * (height - 40), 4)}px`,
                transition: 'height 0.3s ease'
              }}
            />
          </div>
          <span className="text-xs text-gray-600 mt-2 truncate w-full text-center">
            {item.label}
          </span>
        </div>
      ))}
    </div>
  );
};

// Pie Chart Component
const SimplePieChart: React.FC<{
  data: { label: string; value: number; color: string }[];
  size?: number;
}> = ({ data, size = 180 }) => {
  const total = data.reduce((acc, d) => acc + d.value, 0);
  let currentAngle = 0;
  
  return (
    <div className="flex items-center gap-6">
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        {data.map((item, index) => {
          if (item.value === 0) return null;
          const angle = (item.value / total) * 360;
          const startAngle = currentAngle;
          currentAngle += angle;
          
          const radius = size / 2 - 10;
          const centerX = size / 2;
          const centerY = size / 2;
          
          const startRad = (startAngle - 90) * (Math.PI / 180);
          const endRad = (startAngle + angle - 90) * (Math.PI / 180);
          
          const x1 = centerX + radius * Math.cos(startRad);
          const y1 = centerY + radius * Math.sin(startRad);
          const x2 = centerX + radius * Math.cos(endRad);
          const y2 = centerY + radius * Math.sin(endRad);
          
          const largeArc = angle > 180 ? 1 : 0;
          
          const pathData = `M ${centerX} ${centerY} L ${x1} ${y1} A ${radius} ${radius} 0 ${largeArc} 1 ${x2} ${y2} Z`;
          
          return (
            <path
              key={index}
              d={pathData}
              fill={item.color}
              stroke="white"
              strokeWidth="2"
            />
          );
        })}
        <circle cx={size/2} cy={size/2} r={size/4} fill="white" />
        <text
          x={size/2}
          y={size/2}
          textAnchor="middle"
          dominantBaseline="middle"
          className="text-lg font-bold fill-gray-800"
        >
          ${total.toLocaleString()}
        </text>
      </svg>
      <div className="flex flex-col gap-2">
        {data.map((item, index) => (
          <div key={index} className="flex items-center gap-2">
            <div
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: item.color }}
            />
            <span className="text-sm text-gray-600">{item.label}</span>
            <span className="text-sm font-medium">${item.value.toLocaleString()}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

const EarningsReports: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  
  // State
  const [loading, setLoading] = useState(true);
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [bookings, setBookings] = useState<VehicleRentalBooking[]>([]);
  const [summary, setSummary] = useState<EarningsSummary>({
    totalEarnings: 0,
    pendingPayouts: 0,
    completedPayouts: 0,
    refunds: 0,
    platformFees: 0,
    netEarnings: 0
  });
  const [monthlyEarnings, setMonthlyEarnings] = useState<MonthlyEarning[]>([]);
  const [vehicleEarnings, setVehicleEarnings] = useState<VehicleEarning[]>([]);
  const [payoutHistory, setPayoutHistory] = useState<PayoutRecord[]>([]);
  
  // Filters
  const [selectedPeriod, setSelectedPeriod] = useState<'30d' | '90d' | '12m' | 'all'>('30d');
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

      // Calculate earnings data
      calculateEarnings(bookingsList, vehiclesList);
    } catch (error) {
      console.error('Error fetching earnings data:', error);
    } finally {
      setLoading(false);
    }
  }, [user?.uid]);

  const calculateEarnings = (
    bookingsList: VehicleRentalBooking[],
    vehiclesList: Vehicle[]
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

    const completedBookings = filteredBookings.filter(b => b.status === 'completed');
    const cancelledBookings = filteredBookings.filter(b => b.status === 'cancelled');

    // Calculate summary
    const totalEarnings = completedBookings.reduce((sum, b) => sum + (b.totalAmount || 0), 0);
    const refunds = cancelledBookings.reduce((sum, b) => sum + (b.totalAmount || 0) * 0.5, 0);
    const platformFees = totalEarnings * 0.1; // 10% platform fee
    const netEarnings = totalEarnings - platformFees;
    const pendingPayouts = filteredBookings
      .filter(b => b.status === 'confirmed' || b.status === 'in_progress')
      .reduce((sum, b) => sum + (b.totalAmount || 0), 0);
    const completedPayouts = netEarnings - pendingPayouts;

    setSummary({
      totalEarnings,
      pendingPayouts,
      completedPayouts,
      refunds,
      platformFees,
      netEarnings
    });

    // Calculate monthly earnings
    const monthlyMap = new Map<string, MonthlyEarning>();
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    
    completedBookings.forEach(booking => {
      const date = booking.createdAt instanceof Timestamp 
        ? booking.createdAt.toDate() 
        : new Date(booking.createdAt);
      const key = `${months[date.getMonth()]}-${date.getFullYear()}`;
      
      if (!monthlyMap.has(key)) {
        monthlyMap.set(key, {
          month: months[date.getMonth()],
          year: date.getFullYear(),
          gross: 0,
          net: 0,
          bookings: 0,
          refunds: 0
        });
      }
      
      const entry = monthlyMap.get(key)!;
      entry.gross += booking.totalAmount || 0;
      entry.net += (booking.totalAmount || 0) * 0.9; // After platform fee
      entry.bookings += 1;
    });

    // Add refunds to monthly data
    cancelledBookings.forEach(booking => {
      const date = booking.createdAt instanceof Timestamp 
        ? booking.createdAt.toDate() 
        : new Date(booking.createdAt);
      const key = `${months[date.getMonth()]}-${date.getFullYear()}`;
      
      if (monthlyMap.has(key)) {
        const entry = monthlyMap.get(key)!;
        entry.refunds += (booking.totalAmount || 0) * 0.5;
      }
    });

    // Sort and set monthly earnings
    const monthlyList = Array.from(monthlyMap.values())
      .sort((a, b) => {
        const dateA = new Date(`${a.month} 1, ${a.year}`);
        const dateB = new Date(`${b.month} 1, ${b.year}`);
        return dateA.getTime() - dateB.getTime();
      });
    setMonthlyEarnings(monthlyList.slice(-6));

    // Calculate vehicle-wise earnings
    const vehicleMap = new Map<string, VehicleEarning>();
    
    vehiclesList.forEach(vehicle => {
      vehicleMap.set(vehicle.id, {
        vehicleId: vehicle.id,
        vehicleName: `${vehicle.make} ${vehicle.model}`,
        earnings: 0,
        bookings: 0,
        percentage: 0
      });
    });

    completedBookings.forEach(booking => {
      if (vehicleMap.has(booking.vehicleId)) {
        const entry = vehicleMap.get(booking.vehicleId)!;
        entry.earnings += booking.totalAmount || 0;
        entry.bookings += 1;
      }
    });

    // Calculate percentages and sort
    const vehicleList = Array.from(vehicleMap.values())
      .map(v => ({
        ...v,
        percentage: totalEarnings > 0 ? (v.earnings / totalEarnings) * 100 : 0
      }))
      .sort((a, b) => b.earnings - a.earnings);
    setVehicleEarnings(vehicleList);

    // Generate mock payout history (in production, fetch from payouts collection)
    const mockPayouts: PayoutRecord[] = [
      {
        id: '1',
        amount: 1500,
        status: 'completed',
        method: 'Bank Transfer',
        requestedAt: new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000),
        processedAt: new Date(now.getTime() - 28 * 24 * 60 * 60 * 1000)
      },
      {
        id: '2',
        amount: 2200,
        status: 'completed',
        method: 'Bank Transfer',
        requestedAt: new Date(now.getTime() - 60 * 24 * 60 * 60 * 1000),
        processedAt: new Date(now.getTime() - 58 * 24 * 60 * 60 * 1000)
      },
      {
        id: '3',
        amount: 850,
        status: 'pending',
        method: 'Bank Transfer',
        requestedAt: new Date(now.getTime() - 5 * 24 * 60 * 60 * 1000)
      }
    ];
    setPayoutHistory(mockPayouts);
  };

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  useEffect(() => {
    if (bookings.length > 0 && vehicles.length > 0) {
      calculateEarnings(bookings, vehicles);
    }
  }, [selectedPeriod, selectedVehicle]);

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

  const exportToCSV = () => {
    // Generate CSV data
    const headers = ['Month', 'Year', 'Gross Earnings', 'Net Earnings', 'Bookings', 'Refunds'];
    const rows = monthlyEarnings.map(m => [
      m.month,
      m.year,
      m.gross.toFixed(2),
      m.net.toFixed(2),
      m.bookings,
      m.refunds.toFixed(2)
    ]);

    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.join(','))
    ].join('\n');

    // Download file
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `earnings-report-${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-600';
      case 'pending': return 'bg-yellow-100 text-yellow-600';
      case 'processing': return 'bg-blue-100 text-blue-600';
      case 'failed': return 'bg-red-100 text-red-600';
      default: return 'bg-gray-100 text-gray-600';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return <CheckCircle2 className="w-4 h-4" />;
      case 'pending': return <Clock className="w-4 h-4" />;
      case 'processing': return <RefreshCw className="w-4 h-4 animate-spin" />;
      case 'failed': return <XCircle className="w-4 h-4" />;
      default: return <AlertCircle className="w-4 h-4" />;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <RefreshCw className="w-8 h-8 animate-spin text-green-600 mx-auto mb-4" />
          <p className="text-gray-600">Loading earnings data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-green-600 to-green-700 text-white">
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
                <DollarSign className="w-7 h-7" />
                Earnings Reports
              </h1>
              <p className="text-white/80 mt-1">
                Detailed earnings breakdown and payout history
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
                <option value="30d" className="text-gray-800">Last 30 Days</option>
                <option value="90d" className="text-gray-800">Last 90 Days</option>
                <option value="12m" className="text-gray-800">Last 12 Months</option>
                <option value="all" className="text-gray-800">All Time</option>
              </select>

              {/* Export Button */}
              <button
                onClick={exportToCSV}
                className="flex items-center gap-2 bg-white/10 hover:bg-white/20 border border-white/20 rounded-lg px-4 py-2 text-sm transition-colors"
              >
                <Download className="w-4 h-4" />
                Export CSV
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-xl p-4 shadow-sm border border-gray-100"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-500 text-sm">Total Earnings</span>
              <DollarSign className="w-5 h-5 text-green-500" />
            </div>
            <div className="text-2xl font-bold text-gray-800">
              {formatCurrency(summary.totalEarnings)}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-xl p-4 shadow-sm border border-gray-100"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-500 text-sm">Platform Fees</span>
              <PieChart className="w-5 h-5 text-orange-500" />
            </div>
            <div className="text-2xl font-bold text-gray-800">
              {formatCurrency(summary.platformFees)}
            </div>
            <div className="text-xs text-gray-400">10% commission</div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-xl p-4 shadow-sm border border-gray-100"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-500 text-sm">Net Earnings</span>
              <TrendingUp className="w-5 h-5 text-green-500" />
            </div>
            <div className="text-2xl font-bold text-green-600">
              {formatCurrency(summary.netEarnings)}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white rounded-xl p-4 shadow-sm border border-gray-100"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-500 text-sm">Pending</span>
              <Clock className="w-5 h-5 text-yellow-500" />
            </div>
            <div className="text-2xl font-bold text-yellow-600">
              {formatCurrency(summary.pendingPayouts)}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-white rounded-xl p-4 shadow-sm border border-gray-100"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-500 text-sm">Completed</span>
              <CheckCircle2 className="w-5 h-5 text-green-500" />
            </div>
            <div className="text-2xl font-bold text-gray-800">
              {formatCurrency(summary.completedPayouts)}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="bg-white rounded-xl p-4 shadow-sm border border-gray-100"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-500 text-sm">Refunds</span>
              <TrendingDown className="w-5 h-5 text-red-500" />
            </div>
            <div className="text-2xl font-bold text-red-600">
              {formatCurrency(summary.refunds)}
            </div>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Monthly Earnings Chart */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="lg:col-span-2 bg-white rounded-xl p-6 shadow-sm border border-gray-100"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-green-500" />
                Monthly Earnings
              </h2>
            </div>

            {monthlyEarnings.length > 0 ? (
              <SimpleBarChart
                data={monthlyEarnings.map(m => ({
                  label: m.month,
                  value: m.net,
                  color: 'bg-green-500'
                }))}
                height={250}
              />
            ) : (
              <div className="h-[250px] flex items-center justify-center text-gray-400">
                No earnings data for selected period
              </div>
            )}

            {/* Monthly Details Table */}
            {monthlyEarnings.length > 0 && (
              <div className="mt-6 border-t border-gray-100 pt-4">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="text-gray-500">
                      <th className="text-left font-medium py-2">Month</th>
                      <th className="text-right font-medium py-2">Bookings</th>
                      <th className="text-right font-medium py-2">Gross</th>
                      <th className="text-right font-medium py-2">Net</th>
                      <th className="text-right font-medium py-2">Refunds</th>
                    </tr>
                  </thead>
                  <tbody>
                    {monthlyEarnings.map((m, idx) => (
                      <tr key={idx} className="border-t border-gray-50">
                        <td className="py-2 text-gray-800">{m.month} {m.year}</td>
                        <td className="py-2 text-right text-gray-600">{m.bookings}</td>
                        <td className="py-2 text-right text-gray-600">{formatCurrency(m.gross)}</td>
                        <td className="py-2 text-right text-green-600 font-medium">{formatCurrency(m.net)}</td>
                        <td className="py-2 text-right text-red-500">{formatCurrency(m.refunds)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </motion.div>

          {/* Vehicle Earnings Distribution */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white rounded-xl p-6 shadow-sm border border-gray-100"
          >
            <h2 className="text-lg font-semibold text-gray-800 flex items-center gap-2 mb-6">
              <Car className="w-5 h-5 text-blue-500" />
              Earnings by Vehicle
            </h2>

            {vehicleEarnings.length > 0 ? (
              <div className="space-y-4">
                {vehicleEarnings.slice(0, 5).map((vehicle, idx) => (
                  <div key={vehicle.vehicleId}>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm text-gray-700 truncate max-w-[150px]">
                        {vehicle.vehicleName}
                      </span>
                      <span className="text-sm font-medium text-gray-800">
                        {formatCurrency(vehicle.earnings)}
                      </span>
                    </div>
                    <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full ${
                          idx === 0 ? 'bg-green-500' :
                          idx === 1 ? 'bg-blue-500' :
                          idx === 2 ? 'bg-yellow-500' :
                          idx === 3 ? 'bg-purple-500' : 'bg-gray-400'
                        }`}
                        style={{ width: `${vehicle.percentage}%` }}
                      />
                    </div>
                    <div className="flex items-center justify-between mt-1 text-xs text-gray-400">
                      <span>{vehicle.bookings} bookings</span>
                      <span>{vehicle.percentage.toFixed(1)}%</span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="h-[200px] flex items-center justify-center text-gray-400">
                No vehicle earnings data
              </div>
            )}
          </motion.div>
        </div>

        {/* Payout History */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mt-6 bg-white rounded-xl shadow-sm border border-gray-100"
        >
          <div className="p-6 border-b border-gray-100">
            <h2 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
              <FileText className="w-5 h-5 text-purple-500" />
              Payout History
            </h2>
          </div>

          {payoutHistory.length > 0 ? (
            <div className="divide-y divide-gray-100">
              {payoutHistory.map(payout => (
                <div key={payout.id} className="p-4 flex items-center justify-between hover:bg-gray-50">
                  <div className="flex items-center gap-4">
                    <div className={`p-2 rounded-full ${getStatusColor(payout.status)}`}>
                      {getStatusIcon(payout.status)}
                    </div>
                    <div>
                      <div className="font-medium text-gray-800">
                        {formatCurrency(payout.amount)}
                      </div>
                      <div className="text-sm text-gray-500">
                        {payout.method} • Requested {formatDate(payout.requestedAt)}
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs ${getStatusColor(payout.status)}`}>
                      {getStatusIcon(payout.status)}
                      {payout.status.charAt(0).toUpperCase() + payout.status.slice(1)}
                    </span>
                    {payout.processedAt && (
                      <div className="text-xs text-gray-400 mt-1">
                        Processed {formatDate(payout.processedAt)}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-8 text-center text-gray-400">
              No payout history available
            </div>
          )}
        </motion.div>

        {/* Request Payout Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mt-6 bg-gradient-to-r from-green-500 to-green-600 rounded-xl p-6 text-white"
        >
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold">Ready to withdraw?</h3>
              <p className="text-white/80 text-sm mt-1">
                Available balance: {formatCurrency(summary.netEarnings - summary.pendingPayouts)}
              </p>
            </div>
            <button className="bg-white text-green-600 hover:bg-green-50 px-6 py-2 rounded-lg font-medium transition-colors">
              Request Payout
            </button>
          </div>
        </motion.div>

        {/* Quick Links */}
        <div className="mt-8 flex flex-wrap gap-4">
          <Link
            to="/vehicle-rental/owner-analytics"
            className="flex items-center gap-2 text-gray-600 hover:text-green-600 transition-colors"
          >
            <BarChart3 className="w-4 h-4" />
            View Full Analytics
            <ChevronRight className="w-4 h-4" />
          </Link>
          <Link
            to="/vehicle-rental/owner-dashboard"
            className="flex items-center gap-2 text-gray-600 hover:text-green-600 transition-colors"
          >
            <Car className="w-4 h-4" />
            Manage Vehicles
            <ChevronRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default EarningsReports;
