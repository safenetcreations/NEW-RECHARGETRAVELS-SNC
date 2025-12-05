import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { useAuth } from '@/contexts/AuthContext';
import {
  vehicleOwnerService,
  vehicleService,
  vehicleBookingService,
  ownerEarningsService,
  vehiclePricingService
} from '@/services/vehicleRentalService';
import type { Vehicle, VehicleRentalBooking, VehicleOwner, VehiclePricing } from '@/types/vehicleRental';
import {
  Car,
  Plus,
  DollarSign,
  Calendar,
  TrendingUp,
  Star,
  Eye,
  Edit,
  Trash2,
  MoreVertical,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  FileText,
  Upload,
  Camera,
  Settings,
  BarChart3,
  MessageSquare,
  Bell,
  ChevronRight,
  ArrowUpRight,
  ArrowDownRight,
  Loader2,
  LogIn
} from 'lucide-react';

// Extended vehicle type for dashboard
interface DashboardVehicle extends Vehicle {
  totalBookings: number;
  monthlyEarnings: number;
  pendingBookings: number;
  documentsStatus: 'verified' | 'pending';
  image: string;
  pricing?: VehiclePricing;
}

// Extended booking type for dashboard
interface DashboardBooking {
  id: string;
  vehicleName: string;
  customerName: string;
  startDate: string;
  endDate: string;
  status: string;
  amount: number;
}

const OwnerDashboard = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<'overview' | 'vehicles' | 'bookings' | 'earnings' | 'documents'>('overview');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Data states
  const [owner, setOwner] = useState<VehicleOwner | null>(null);
  const [vehicles, setVehicles] = useState<DashboardVehicle[]>([]);
  const [bookings, setBookings] = useState<DashboardBooking[]>([]);
  const [stats, setStats] = useState({
    totalEarnings: 0,
    thisMonthEarnings: 0,
    lastMonthEarnings: 0,
    totalBookings: 0,
    thisMonthBookings: 0,
    pendingBookings: 0,
    activeVehicles: 0,
    totalVehicles: 0,
    averageRating: 0,
    totalReviews: 0
  });

  // Fetch owner data and related information
  useEffect(() => {
    const fetchData = async () => {
      if (!user) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);

        // Get owner profile
        const ownerProfile = await vehicleOwnerService.getByUserId(user.uid);

        if (!ownerProfile) {
          setError('You are not registered as a vehicle owner. Please register first.');
          setLoading(false);
          return;
        }

        setOwner(ownerProfile);

        // Get owner's vehicles
        const ownerVehicles = await vehicleService.getByOwner(ownerProfile.id);

        // Get owner's bookings
        const ownerBookings = await vehicleBookingService.getByOwner(ownerProfile.id);

        // Get earnings
        const earnings = await ownerEarningsService.getByOwner(ownerProfile.id);

        // Calculate stats
        const now = new Date();
        const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
        const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
        const endOfLastMonth = new Date(now.getFullYear(), now.getMonth(), 0);

        const thisMonthBookings = ownerBookings.filter(b => {
          const bookingDate = b.createdAt instanceof Date ? b.createdAt : new Date(b.createdAt);
          return bookingDate >= startOfMonth;
        });

        const lastMonthEarnings = earnings
          .filter(e => {
            const earningDate = e.createdAt instanceof Date ? e.createdAt : new Date(e.createdAt);
            return earningDate >= startOfLastMonth && earningDate <= endOfLastMonth;
          })
          .reduce((sum, e) => sum + e.ownerEarnings, 0);

        const thisMonthEarnings = earnings
          .filter(e => {
            const earningDate = e.createdAt instanceof Date ? e.createdAt : new Date(e.createdAt);
            return earningDate >= startOfMonth;
          })
          .reduce((sum, e) => sum + e.ownerEarnings, 0);

        const totalEarnings = earnings.reduce((sum, e) => sum + e.ownerEarnings, 0);

        // Transform vehicles for dashboard
        const dashboardVehicles: DashboardVehicle[] = await Promise.all(
          ownerVehicles.map(async (vehicle) => {
            const vehicleBookings = ownerBookings.filter(b => b.vehicleId === vehicle.id);
            const vehicleMonthlyBookings = vehicleBookings.filter(b => {
              const bookingDate = b.createdAt instanceof Date ? b.createdAt : new Date(b.createdAt);
              return bookingDate >= startOfMonth;
            });

            // Get vehicle pricing
            const pricing = await vehiclePricingService.getByVehicle(vehicle.id);

            // Calculate monthly earnings for this vehicle
            const vehicleEarnings = earnings
              .filter(e => e.vehicleId === vehicle.id)
              .filter(e => {
                const earningDate = e.createdAt instanceof Date ? e.createdAt : new Date(e.createdAt);
                return earningDate >= startOfMonth;
              })
              .reduce((sum, e) => sum + e.ownerEarnings, 0);

            return {
              ...vehicle,
              totalBookings: vehicleBookings.length,
              monthlyEarnings: vehicleEarnings,
              pendingBookings: vehicleBookings.filter(b => b.status === 'pending').length,
              documentsStatus: vehicle.status === 'active' ? 'verified' : 'pending',
              image: vehicle.photos?.[0]?.url || 'https://images.unsplash.com/photo-1494976388531-d1058494cdd8?w=200&h=150&fit=crop',
              pricing: pricing || undefined
            } as DashboardVehicle;
          })
        );

        // Transform bookings for dashboard
        const dashboardBookings: DashboardBooking[] = ownerBookings.slice(0, 10).map(booking => {
          const vehicle = ownerVehicles.find(v => v.id === booking.vehicleId);
          return {
            id: booking.id,
            vehicleName: vehicle ? `${vehicle.make} ${vehicle.model}` : 'Unknown Vehicle',
            customerName: booking.customerName || 'Customer',
            startDate: booking.startDate instanceof Date
              ? booking.startDate.toISOString().split('T')[0]
              : new Date(booking.startDate).toISOString().split('T')[0],
            endDate: booking.endDate instanceof Date
              ? booking.endDate.toISOString().split('T')[0]
              : new Date(booking.endDate).toISOString().split('T')[0],
            status: booking.status,
            amount: booking.totalAmount || 0
          };
        });

        // Calculate average rating
        const avgRating = ownerVehicles.length > 0
          ? ownerVehicles.reduce((sum, v) => sum + (v.rating || 0), 0) / ownerVehicles.length
          : 0;

        const totalReviews = ownerVehicles.reduce((sum, v) => sum + (v.reviewCount || 0), 0);

        setVehicles(dashboardVehicles);
        setBookings(dashboardBookings);
        setStats({
          totalEarnings,
          thisMonthEarnings,
          lastMonthEarnings,
          totalBookings: ownerBookings.length,
          thisMonthBookings: thisMonthBookings.length,
          pendingBookings: ownerBookings.filter(b => b.status === 'pending').length,
          activeVehicles: ownerVehicles.filter(v => v.status === 'active').length,
          totalVehicles: ownerVehicles.length,
          averageRating: Math.round(avgRating * 10) / 10,
          totalReviews
        });

      } catch (err) {
        console.error('Error fetching owner data:', err);
        setError('Failed to load dashboard data. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user]);

  const earningsChange = stats.lastMonthEarnings > 0
    ? ((stats.thisMonthEarnings - stats.lastMonthEarnings) / stats.lastMonthEarnings * 100).toFixed(1)
    : '0';

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-700';
      case 'pending_verification':
      case 'pending_review': return 'bg-yellow-100 text-yellow-700';
      case 'suspended': return 'bg-red-100 text-red-700';
      case 'confirmed': return 'bg-green-100 text-green-700';
      case 'pending': return 'bg-yellow-100 text-yellow-700';
      case 'completed': return 'bg-blue-100 text-blue-700';
      case 'cancelled': return 'bg-red-100 text-red-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active':
      case 'confirmed':
      case 'completed': return <CheckCircle className="w-4 h-4" />;
      case 'pending_verification':
      case 'pending_review':
      case 'pending': return <Clock className="w-4 h-4" />;
      case 'suspended':
      case 'cancelled': return <XCircle className="w-4 h-4" />;
      default: return <AlertCircle className="w-4 h-4" />;
    }
  };

  // Loading state
  if (loading) {
    return (
      <>
        <Helmet>
          <title>Owner Dashboard | Vehicle Rental | Recharge Travels</title>
        </Helmet>
        <Header />
        <div className="min-h-screen bg-gray-50 pt-20 flex items-center justify-center">
          <div className="text-center">
            <Loader2 className="w-12 h-12 animate-spin text-amber-500 mx-auto mb-4" />
            <p className="text-gray-600">Loading your dashboard...</p>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  // Not logged in
  if (!user) {
    return (
      <>
        <Helmet>
          <title>Owner Dashboard | Vehicle Rental | Recharge Travels</title>
        </Helmet>
        <Header />
        <div className="min-h-screen bg-gray-50 pt-20 flex items-center justify-center">
          <div className="text-center max-w-md mx-auto p-6">
            <LogIn className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Login Required</h2>
            <p className="text-gray-600 mb-6">Please log in to access your owner dashboard.</p>
            <Link
              to="/login"
              className="inline-flex items-center gap-2 px-6 py-3 bg-amber-500 text-white rounded-full font-medium hover:bg-amber-600 transition-colors"
            >
              <LogIn className="w-5 h-5" />
              Log In
            </Link>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  // Error state or not registered as owner
  if (error) {
    return (
      <>
        <Helmet>
          <title>Owner Dashboard | Vehicle Rental | Recharge Travels</title>
        </Helmet>
        <Header />
        <div className="min-h-screen bg-gray-50 pt-20 flex items-center justify-center">
          <div className="text-center max-w-md mx-auto p-6">
            <AlertCircle className="w-16 h-16 text-amber-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Not Registered</h2>
            <p className="text-gray-600 mb-6">{error}</p>
            <Link
              to="/vehicle-rental/register-owner"
              className="inline-flex items-center gap-2 px-6 py-3 bg-amber-500 text-white rounded-full font-medium hover:bg-amber-600 transition-colors"
            >
              <Plus className="w-5 h-5" />
              Register as Owner
            </Link>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Helmet>
        <title>Owner Dashboard | Vehicle Rental | Recharge Travels</title>
        <meta name="description" content="Manage your vehicles, bookings, and earnings on Recharge Travels Vehicle Rental platform." />
      </Helmet>

      <Header />

      <div className="min-h-screen bg-gray-50 pt-20">
        {/* Dashboard Header */}
        <div className="bg-gradient-to-r from-slate-900 to-slate-800 py-6">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <h1 className="text-2xl font-bold text-white">Owner Dashboard</h1>
                <p className="text-gray-300 text-sm">Welcome back, {owner?.fullName || user?.displayName}! Manage your fleet and bookings</p>
              </div>
              <Link
                to="/vehicle-rental/list-vehicle"
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-amber-500 text-white rounded-full font-medium hover:bg-amber-600 transition-colors"
              >
                <Plus className="w-5 h-5" />
                List New Vehicle
              </Link>
            </div>

            {/* Tabs */}
            <div className="mt-6 flex gap-1 overflow-x-auto pb-2 scrollbar-hide">
              {[
                { id: 'overview', label: 'Overview', icon: BarChart3 },
                { id: 'vehicles', label: 'My Vehicles', icon: Car },
                { id: 'bookings', label: 'Bookings', icon: Calendar },
                { id: 'earnings', label: 'Earnings', icon: DollarSign },
                { id: 'documents', label: 'Documents', icon: FileText }
              ].map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as typeof activeTab)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-all ${
                    activeTab === tab.id
                      ? 'bg-white text-slate-900'
                      : 'text-gray-300 hover:text-white hover:bg-white/10'
                  }`}
                >
                  <tab.icon className="w-4 h-4" />
                  {tab.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          {activeTab === 'overview' && (
            <div className="space-y-6">
              {/* Stats Grid */}
              <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {/* Monthly Earnings */}
                <div className="bg-white rounded-2xl p-5 shadow-sm">
                  <div className="flex items-center justify-between mb-3">
                    <div className="w-10 h-10 rounded-xl bg-green-100 flex items-center justify-center">
                      <DollarSign className="w-5 h-5 text-green-600" />
                    </div>
                    <span className={`flex items-center gap-1 text-xs font-medium ${parseFloat(earningsChange) >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {parseFloat(earningsChange) >= 0 ? <ArrowUpRight className="w-3.5 h-3.5" /> : <ArrowDownRight className="w-3.5 h-3.5" />}
                      {Math.abs(parseFloat(earningsChange))}%
                    </span>
                  </div>
                  <div className="text-2xl font-bold text-gray-900">${stats.thisMonthEarnings.toLocaleString()}</div>
                  <div className="text-sm text-gray-500">This month's earnings</div>
                </div>

                {/* Total Bookings */}
                <div className="bg-white rounded-2xl p-5 shadow-sm">
                  <div className="flex items-center justify-between mb-3">
                    <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center">
                      <Calendar className="w-5 h-5 text-blue-600" />
                    </div>
                    <span className="flex items-center gap-1 text-xs font-medium text-amber-600">
                      <Clock className="w-3.5 h-3.5" />
                      {stats.pendingBookings} pending
                    </span>
                  </div>
                  <div className="text-2xl font-bold text-gray-900">{stats.thisMonthBookings}</div>
                  <div className="text-sm text-gray-500">Bookings this month</div>
                </div>

                {/* Active Vehicles */}
                <div className="bg-white rounded-2xl p-5 shadow-sm">
                  <div className="flex items-center justify-between mb-3">
                    <div className="w-10 h-10 rounded-xl bg-purple-100 flex items-center justify-center">
                      <Car className="w-5 h-5 text-purple-600" />
                    </div>
                    <span className="text-xs text-gray-500">{stats.activeVehicles}/{stats.totalVehicles} active</span>
                  </div>
                  <div className="text-2xl font-bold text-gray-900">{stats.totalVehicles}</div>
                  <div className="text-sm text-gray-500">Total vehicles</div>
                </div>

                {/* Rating */}
                <div className="bg-white rounded-2xl p-5 shadow-sm">
                  <div className="flex items-center justify-between mb-3">
                    <div className="w-10 h-10 rounded-xl bg-amber-100 flex items-center justify-center">
                      <Star className="w-5 h-5 text-amber-600" />
                    </div>
                    <span className="text-xs text-gray-500">{stats.totalReviews} reviews</span>
                  </div>
                  <div className="text-2xl font-bold text-gray-900">{stats.averageRating || '-'}</div>
                  <div className="text-sm text-gray-500">Average rating</div>
                </div>
              </div>

              {/* Quick Actions & Recent Activity */}
              <div className="grid lg:grid-cols-3 gap-6">
                {/* Vehicles List */}
                <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm overflow-hidden">
                  <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
                    <h2 className="font-bold text-gray-900">My Vehicles</h2>
                    <button onClick={() => setActiveTab('vehicles')} className="text-sm text-amber-600 hover:text-amber-700 font-medium">
                      View All
                    </button>
                  </div>
                  {vehicles.length === 0 ? (
                    <div className="px-5 py-12 text-center">
                      <Car className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                      <p className="text-gray-500 mb-4">You haven't listed any vehicles yet</p>
                      <Link
                        to="/vehicle-rental/list-vehicle"
                        className="inline-flex items-center gap-2 px-4 py-2 bg-amber-500 text-white rounded-lg text-sm font-medium hover:bg-amber-600 transition-colors"
                      >
                        <Plus className="w-4 h-4" />
                        List Your First Vehicle
                      </Link>
                    </div>
                  ) : (
                    <div className="divide-y divide-gray-100">
                      {vehicles.slice(0, 3).map(vehicle => (
                        <div key={vehicle.id} className="px-5 py-4 flex items-center gap-4 hover:bg-gray-50 transition-colors">
                          <img
                            src={vehicle.image}
                            alt={`${vehicle.make} ${vehicle.model}`}
                            className="w-16 h-12 object-cover rounded-lg"
                          />
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2">
                              <h3 className="font-medium text-gray-900 truncate">{vehicle.make} {vehicle.model}</h3>
                              <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${getStatusColor(vehicle.status)}`}>
                                {getStatusIcon(vehicle.status)}
                                {vehicle.status.replace('_', ' ')}
                              </span>
                            </div>
                            <div className="flex items-center gap-4 text-sm text-gray-500 mt-1">
                              <span className="flex items-center gap-1">
                                <Calendar className="w-3.5 h-3.5" />
                                {vehicle.totalBookings} bookings
                              </span>
                              {vehicle.rating > 0 && (
                                <span className="flex items-center gap-1">
                                  <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                                  {vehicle.rating}
                                </span>
                              )}
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="font-medium text-gray-900">${vehicle.monthlyEarnings}</div>
                            <div className="text-xs text-gray-500">this month</div>
                          </div>
                          <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                            <MoreVertical className="w-4 h-4 text-gray-400" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Quick Actions */}
                <div className="space-y-4">
                  <div className="bg-white rounded-2xl shadow-sm p-5">
                    <h2 className="font-bold text-gray-900 mb-4">Quick Actions</h2>
                    <div className="space-y-3">
                      <Link to="/vehicle-rental/list-vehicle" className="flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 transition-colors group">
                        <div className="w-10 h-10 rounded-xl bg-amber-100 flex items-center justify-center group-hover:bg-amber-200 transition-colors">
                          <Plus className="w-5 h-5 text-amber-600" />
                        </div>
                        <div className="flex-1">
                          <div className="font-medium text-gray-900">Add New Vehicle</div>
                          <div className="text-xs text-gray-500">List a car for rental</div>
                        </div>
                        <ChevronRight className="w-5 h-5 text-gray-400" />
                      </Link>
                      <button className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 transition-colors group">
                        <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center group-hover:bg-blue-200 transition-colors">
                          <Upload className="w-5 h-5 text-blue-600" />
                        </div>
                        <div className="flex-1 text-left">
                          <div className="font-medium text-gray-900">Upload Documents</div>
                          <div className="text-xs text-gray-500">Update vehicle papers</div>
                        </div>
                        <ChevronRight className="w-5 h-5 text-gray-400" />
                      </button>
                      <button className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 transition-colors group">
                        <div className="w-10 h-10 rounded-xl bg-green-100 flex items-center justify-center group-hover:bg-green-200 transition-colors">
                          <Camera className="w-5 h-5 text-green-600" />
                        </div>
                        <div className="flex-1 text-left">
                          <div className="font-medium text-gray-900">Update Photos</div>
                          <div className="text-xs text-gray-500">Add vehicle images</div>
                        </div>
                        <ChevronRight className="w-5 h-5 text-gray-400" />
                      </button>
                    </div>
                  </div>

                  {/* Notifications */}
                  <div className="bg-white rounded-2xl shadow-sm p-5">
                    <div className="flex items-center justify-between mb-4">
                      <h2 className="font-bold text-gray-900">Notifications</h2>
                      <Bell className="w-5 h-5 text-gray-400" />
                    </div>
                    <div className="space-y-3">
                      {stats.pendingBookings > 0 ? (
                        <div className="flex gap-3 p-3 bg-amber-50 rounded-xl">
                          <div className="w-8 h-8 rounded-full bg-amber-100 flex items-center justify-center flex-shrink-0">
                            <Clock className="w-4 h-4 text-amber-600" />
                          </div>
                          <div>
                            <div className="text-sm font-medium text-gray-900">{stats.pendingBookings} pending booking{stats.pendingBookings > 1 ? 's' : ''}</div>
                            <div className="text-xs text-gray-500">Review and confirm</div>
                          </div>
                        </div>
                      ) : (
                        <div className="flex gap-3 p-3 bg-green-50 rounded-xl">
                          <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
                            <CheckCircle className="w-4 h-4 text-green-600" />
                          </div>
                          <div>
                            <div className="text-sm font-medium text-gray-900">All caught up!</div>
                            <div className="text-xs text-gray-500">No pending actions</div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Recent Bookings */}
              <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
                <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
                  <h2 className="font-bold text-gray-900">Recent Bookings</h2>
                  <button onClick={() => setActiveTab('bookings')} className="text-sm text-amber-600 hover:text-amber-700 font-medium">
                    View All
                  </button>
                </div>
                {bookings.length === 0 ? (
                  <div className="px-5 py-12 text-center">
                    <Calendar className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                    <p className="text-gray-500">No bookings yet</p>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-5 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Booking ID</th>
                          <th className="px-5 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Vehicle</th>
                          <th className="px-5 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
                          <th className="px-5 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Dates</th>
                          <th className="px-5 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                          <th className="px-5 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                          <th className="px-5 py-3"></th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100">
                        {bookings.slice(0, 4).map(booking => (
                          <tr key={booking.id} className="hover:bg-gray-50 transition-colors">
                            <td className="px-5 py-4 text-sm font-medium text-gray-900">{booking.id.slice(0, 8)}</td>
                            <td className="px-5 py-4 text-sm text-gray-700">{booking.vehicleName}</td>
                            <td className="px-5 py-4 text-sm text-gray-700">{booking.customerName}</td>
                            <td className="px-5 py-4 text-sm text-gray-500">
                              {new Date(booking.startDate).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })} - {new Date(booking.endDate).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}
                            </td>
                            <td className="px-5 py-4 text-sm font-medium text-gray-900">${booking.amount}</td>
                            <td className="px-5 py-4">
                              <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium capitalize ${getStatusColor(booking.status)}`}>
                                {getStatusIcon(booking.status)}
                                {booking.status}
                              </span>
                            </td>
                            <td className="px-5 py-4">
                              <button className="p-1.5 hover:bg-gray-100 rounded transition-colors">
                                <Eye className="w-4 h-4 text-gray-400" />
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === 'vehicles' && (
            <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
              <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
                <h2 className="font-bold text-gray-900">My Vehicles ({vehicles.length})</h2>
                <Link
                  to="/vehicle-rental/list-vehicle"
                  className="inline-flex items-center gap-2 px-4 py-2 bg-amber-500 text-white rounded-lg font-medium text-sm hover:bg-amber-600 transition-colors"
                >
                  <Plus className="w-4 h-4" />
                  Add Vehicle
                </Link>
              </div>
              {vehicles.length === 0 ? (
                <div className="px-5 py-16 text-center">
                  <Car className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">No vehicles listed</h3>
                  <p className="text-gray-500 mb-6">Start earning by listing your first vehicle</p>
                  <Link
                    to="/vehicle-rental/list-vehicle"
                    className="inline-flex items-center gap-2 px-6 py-3 bg-amber-500 text-white rounded-full font-medium hover:bg-amber-600 transition-colors"
                  >
                    <Plus className="w-5 h-5" />
                    List Your First Vehicle
                  </Link>
                </div>
              ) : (
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 p-5">
                  {vehicles.map(vehicle => (
                    <div key={vehicle.id} className="border border-gray-200 rounded-xl overflow-hidden hover:shadow-md transition-shadow">
                      <div className="relative">
                        <img
                          src={vehicle.image}
                          alt={`${vehicle.make} ${vehicle.model}`}
                          className="w-full h-40 object-cover"
                        />
                        <span className={`absolute top-3 right-3 inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(vehicle.status)}`}>
                          {vehicle.status.replace('_', ' ')}
                        </span>
                      </div>
                      <div className="p-4">
                        <h3 className="font-bold text-gray-900">{vehicle.make} {vehicle.model}</h3>
                        <p className="text-sm text-gray-500 mb-3">{vehicle.year}</p>

                        <div className="grid grid-cols-2 gap-3 text-sm mb-4">
                          <div className="bg-gray-50 rounded-lg p-2 text-center">
                            <div className="font-medium text-gray-900">{vehicle.totalBookings}</div>
                            <div className="text-xs text-gray-500">Bookings</div>
                          </div>
                          <div className="bg-gray-50 rounded-lg p-2 text-center">
                            <div className="font-medium text-gray-900 flex items-center justify-center gap-1">
                              <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                              {vehicle.rating || '-'}
                            </div>
                            <div className="text-xs text-gray-500">Rating</div>
                          </div>
                        </div>

                        <div className="flex gap-2">
                          <button className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 bg-gray-100 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-200 transition-colors">
                            <Edit className="w-4 h-4" />
                            Edit
                          </button>
                          <Link
                            to={`/vehicle-rental/vehicle/${vehicle.id}`}
                            className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 bg-amber-500 text-white rounded-lg text-sm font-medium hover:bg-amber-600 transition-colors"
                          >
                            <Eye className="w-4 h-4" />
                            View
                          </Link>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === 'bookings' && (
            <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
              <div className="px-5 py-4 border-b border-gray-100">
                <h2 className="font-bold text-gray-900">All Bookings</h2>
              </div>
              {bookings.length === 0 ? (
                <div className="px-5 py-16 text-center">
                  <Calendar className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">No bookings yet</h3>
                  <p className="text-gray-500">Bookings will appear here when customers rent your vehicles</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-5 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Booking ID</th>
                        <th className="px-5 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Vehicle</th>
                        <th className="px-5 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
                        <th className="px-5 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Dates</th>
                        <th className="px-5 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                        <th className="px-5 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                        <th className="px-5 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {bookings.map(booking => (
                        <tr key={booking.id} className="hover:bg-gray-50 transition-colors">
                          <td className="px-5 py-4 text-sm font-medium text-gray-900">{booking.id.slice(0, 8)}</td>
                          <td className="px-5 py-4 text-sm text-gray-700">{booking.vehicleName}</td>
                          <td className="px-5 py-4 text-sm text-gray-700">{booking.customerName}</td>
                          <td className="px-5 py-4 text-sm text-gray-500">
                            {new Date(booking.startDate).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })} - {new Date(booking.endDate).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}
                          </td>
                          <td className="px-5 py-4 text-sm font-medium text-gray-900">${booking.amount}</td>
                          <td className="px-5 py-4">
                            <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium capitalize ${getStatusColor(booking.status)}`}>
                              {getStatusIcon(booking.status)}
                              {booking.status}
                            </span>
                          </td>
                          <td className="px-5 py-4">
                            <div className="flex gap-1">
                              <button className="p-1.5 hover:bg-gray-100 rounded transition-colors" title="View">
                                <Eye className="w-4 h-4 text-gray-400" />
                              </button>
                              {booking.status === 'pending' && (
                                <>
                                  <button className="p-1.5 hover:bg-green-50 rounded transition-colors" title="Accept">
                                    <CheckCircle className="w-4 h-4 text-green-500" />
                                  </button>
                                  <button className="p-1.5 hover:bg-red-50 rounded transition-colors" title="Decline">
                                    <XCircle className="w-4 h-4 text-red-500" />
                                  </button>
                                </>
                              )}
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {activeTab === 'earnings' && (
            <div className="space-y-6">
              <div className="grid sm:grid-cols-3 gap-4">
                <div className="bg-white rounded-2xl p-5 shadow-sm">
                  <div className="text-sm text-gray-500 mb-1">This Month</div>
                  <div className="text-2xl font-bold text-gray-900">${stats.thisMonthEarnings.toLocaleString()}</div>
                  <div className={`text-sm ${parseFloat(earningsChange) >= 0 ? 'text-green-600' : 'text-red-600'} flex items-center gap-1 mt-1`}>
                    {parseFloat(earningsChange) >= 0 ? <ArrowUpRight className="w-4 h-4" /> : <ArrowDownRight className="w-4 h-4" />}
                    {Math.abs(parseFloat(earningsChange))}% vs last month
                  </div>
                </div>
                <div className="bg-white rounded-2xl p-5 shadow-sm">
                  <div className="text-sm text-gray-500 mb-1">Last Month</div>
                  <div className="text-2xl font-bold text-gray-900">${stats.lastMonthEarnings.toLocaleString()}</div>
                </div>
                <div className="bg-white rounded-2xl p-5 shadow-sm">
                  <div className="text-sm text-gray-500 mb-1">Total Earnings</div>
                  <div className="text-2xl font-bold text-gray-900">${stats.totalEarnings.toLocaleString()}</div>
                </div>
              </div>

              {/* Payout Timeline Section */}
              <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl p-6 border border-green-100">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-green-500 rounded-xl flex items-center justify-center">
                    <DollarSign className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h2 className="font-bold text-gray-900">50/50 Payout System</h2>
                    <p className="text-sm text-gray-600">Your earnings are paid in 2 installments</p>
                  </div>
                </div>

                <div className="grid sm:grid-cols-2 gap-4 mb-4">
                  <div className="bg-white rounded-xl p-4 border border-green-200">
                    <div className="flex items-center gap-2 mb-2">
                      <Clock className="w-4 h-4 text-amber-500" />
                      <span className="font-medium text-gray-900">First Payout (50%)</span>
                    </div>
                    <p className="text-sm text-gray-600 mb-2">Paid within 6 hours after rental pickup</p>
                    <div className="text-2xl font-bold text-amber-600">$0</div>
                    <div className="text-xs text-gray-500">Pending first payouts</div>
                  </div>
                  <div className="bg-white rounded-xl p-4 border border-green-200">
                    <div className="flex items-center gap-2 mb-2">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      <span className="font-medium text-gray-900">Second Payout (50%)</span>
                    </div>
                    <p className="text-sm text-gray-600 mb-2">Paid 72 hours after pickup confirmation</p>
                    <div className="text-2xl font-bold text-green-600">$0</div>
                    <div className="text-xs text-gray-500">Pending second payouts</div>
                  </div>
                </div>

                <div className="mt-4 p-3 bg-white/50 rounded-lg text-sm text-gray-600">
                  Pro Tip: Opt for weekly bulk payouts to receive 88% instead of 85% (saves 3% on fees!)
                </div>
              </div>

              <div className="bg-white rounded-2xl shadow-sm p-5">
                <h2 className="font-bold text-gray-900 mb-4">Earnings by Vehicle</h2>
                {vehicles.filter(v => v.monthlyEarnings > 0).length === 0 ? (
                  <div className="text-center py-8">
                    <DollarSign className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                    <p className="text-gray-500">No earnings recorded yet</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {vehicles.filter(v => v.monthlyEarnings > 0).map(vehicle => (
                      <div key={vehicle.id} className="flex items-center gap-4">
                        <img
                          src={vehicle.image}
                          alt={`${vehicle.make} ${vehicle.model}`}
                          className="w-14 h-10 object-cover rounded-lg"
                        />
                        <div className="flex-1">
                          <div className="font-medium text-gray-900">{vehicle.make} {vehicle.model}</div>
                          <div className="text-sm text-gray-500">{vehicle.totalBookings} bookings</div>
                        </div>
                        <div className="text-right">
                          <div className="font-bold text-gray-900">${vehicle.monthlyEarnings}</div>
                          <div className="text-xs text-gray-500">this month</div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Commission Transparency */}
              <div className="bg-white rounded-2xl shadow-sm p-5">
                <h2 className="font-bold text-gray-900 mb-4">Commission Breakdown</h2>
                <p className="text-sm text-gray-600 mb-4">Transparent fee structure for your earnings</p>

                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <div className="font-medium text-gray-900">Base Rental Commission</div>
                      <div className="text-sm text-gray-500">Applied to all rentals</div>
                    </div>
                    <div className="text-right">
                      <span className="font-bold text-gray-900">15%</span>
                      <div className="text-xs text-green-600">You keep 85%</div>
                    </div>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <div className="font-medium text-gray-900">Weekly/Monthly Rentals</div>
                      <div className="text-sm text-gray-500">Reduced commission for longer bookings</div>
                    </div>
                    <div className="text-right">
                      <span className="font-bold text-gray-900">10-12%</span>
                      <div className="text-xs text-green-600">You keep 88-90%</div>
                    </div>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg border border-green-200">
                    <div>
                      <div className="font-medium text-gray-900">Insurance Revenue Share</div>
                      <div className="text-sm text-gray-500">When customers buy protection plans</div>
                    </div>
                    <div className="text-right">
                      <span className="font-bold text-green-600">80-90%</span>
                      <div className="text-xs text-green-600">Extra income!</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'documents' && (
            <div className="bg-white rounded-2xl shadow-sm p-5">
              <h2 className="font-bold text-gray-900 mb-4">Vehicle Documents</h2>
              <p className="text-gray-600 mb-6">Upload and manage your vehicle documents for verification.</p>

              {vehicles.length === 0 ? (
                <div className="text-center py-12">
                  <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">No vehicles to manage</h3>
                  <p className="text-gray-500 mb-6">Add a vehicle first to manage its documents</p>
                  <Link
                    to="/vehicle-rental/list-vehicle"
                    className="inline-flex items-center gap-2 px-6 py-3 bg-amber-500 text-white rounded-full font-medium hover:bg-amber-600 transition-colors"
                  >
                    <Plus className="w-5 h-5" />
                    List Your First Vehicle
                  </Link>
                </div>
              ) : (
                <div className="space-y-4">
                  {vehicles.map(vehicle => (
                    <div key={vehicle.id} className="border border-gray-200 rounded-xl p-4">
                      <div className="flex items-center gap-4 mb-4">
                        <img
                          src={vehicle.image}
                          alt={`${vehicle.make} ${vehicle.model}`}
                          className="w-16 h-12 object-cover rounded-lg"
                        />
                        <div>
                          <h3 className="font-medium text-gray-900">{vehicle.make} {vehicle.model}</h3>
                          <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${
                            vehicle.documentsStatus === 'verified' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                          }`}>
                            {vehicle.documentsStatus === 'verified' ? <CheckCircle className="w-3.5 h-3.5" /> : <Clock className="w-3.5 h-3.5" />}
                            Documents {vehicle.documentsStatus}
                          </span>
                        </div>
                      </div>

                      <div className="grid sm:grid-cols-3 gap-3">
                        {['Registration', 'Insurance', 'Revenue License'].map(doc => (
                          <div key={doc} className="border border-dashed border-gray-300 rounded-lg p-4 text-center hover:border-amber-400 transition-colors cursor-pointer">
                            <Upload className="w-6 h-6 mx-auto text-gray-400 mb-2" />
                            <div className="text-sm font-medium text-gray-700">{doc}</div>
                            <div className="text-xs text-gray-500">Upload PDF/Image</div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        <Footer />
      </div>
    </>
  );
};

export default OwnerDashboard;
