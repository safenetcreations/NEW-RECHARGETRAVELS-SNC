import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
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
  ArrowDownRight
} from 'lucide-react';

// Mock data
const mockVehicles = [
  {
    id: '1',
    make: 'Toyota',
    model: 'Prius',
    year: 2021,
    status: 'active',
    rating: 4.9,
    totalBookings: 45,
    monthlyEarnings: 420,
    image: 'https://images.unsplash.com/photo-1580273916550-e323be2ae537?w=200&h=150&fit=crop',
    pendingBookings: 2,
    documentsStatus: 'verified'
  },
  {
    id: '2',
    make: 'Honda',
    model: 'Vezel',
    year: 2022,
    status: 'active',
    rating: 4.8,
    totalBookings: 32,
    monthlyEarnings: 325,
    image: 'https://images.unsplash.com/photo-1519641471654-76ce0107ad1b?w=200&h=150&fit=crop',
    pendingBookings: 1,
    documentsStatus: 'verified'
  },
  {
    id: '3',
    make: 'Suzuki',
    model: 'Wagon R',
    year: 2020,
    status: 'pending_verification',
    rating: 0,
    totalBookings: 0,
    monthlyEarnings: 0,
    image: 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=200&h=150&fit=crop',
    pendingBookings: 0,
    documentsStatus: 'pending'
  }
];

const mockBookings = [
  {
    id: 'B001',
    vehicleName: 'Toyota Prius',
    customerName: 'John Perera',
    startDate: '2024-01-15',
    endDate: '2024-01-18',
    status: 'confirmed',
    amount: 85
  },
  {
    id: 'B002',
    vehicleName: 'Toyota Prius',
    customerName: 'Sarah Silva',
    startDate: '2024-01-20',
    endDate: '2024-01-22',
    status: 'pending',
    amount: 56
  },
  {
    id: 'B003',
    vehicleName: 'Honda Vezel',
    customerName: 'Mike Fernando',
    startDate: '2024-01-16',
    endDate: '2024-01-19',
    status: 'confirmed',
    amount: 120
  },
  {
    id: 'B004',
    vehicleName: 'Toyota Prius',
    customerName: 'Lisa Kumar',
    startDate: '2024-01-10',
    endDate: '2024-01-12',
    status: 'completed',
    amount: 56
  }
];

const OwnerDashboard = () => {
  const [activeTab, setActiveTab] = useState<'overview' | 'vehicles' | 'bookings' | 'earnings' | 'documents'>('overview');

  const stats = {
    totalEarnings: 1745,
    thisMonthEarnings: 745,
    lastMonthEarnings: 660,
    totalBookings: 77,
    thisMonthBookings: 12,
    pendingBookings: 3,
    activeVehicles: 2,
    totalVehicles: 3,
    averageRating: 4.85,
    totalReviews: 68
  };

  const earningsChange = ((stats.thisMonthEarnings - stats.lastMonthEarnings) / stats.lastMonthEarnings * 100).toFixed(1);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-700';
      case 'pending_verification': return 'bg-yellow-100 text-yellow-700';
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
      case 'pending': return <Clock className="w-4 h-4" />;
      case 'suspended':
      case 'cancelled': return <XCircle className="w-4 h-4" />;
      default: return <AlertCircle className="w-4 h-4" />;
    }
  };

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
                <p className="text-gray-300 text-sm">Welcome back! Manage your fleet and bookings</p>
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
                  <div className="text-2xl font-bold text-gray-900">${stats.thisMonthEarnings}</div>
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
                  <div className="text-2xl font-bold text-gray-900">{stats.averageRating}</div>
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
                  <div className="divide-y divide-gray-100">
                    {mockVehicles.map(vehicle => (
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
                      <div className="flex gap-3 p-3 bg-amber-50 rounded-xl">
                        <div className="w-8 h-8 rounded-full bg-amber-100 flex items-center justify-center flex-shrink-0">
                          <Clock className="w-4 h-4 text-amber-600" />
                        </div>
                        <div>
                          <div className="text-sm font-medium text-gray-900">New booking request</div>
                          <div className="text-xs text-gray-500">Toyota Prius • 2 hours ago</div>
                        </div>
                      </div>
                      <div className="flex gap-3 p-3 bg-green-50 rounded-xl">
                        <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
                          <CheckCircle className="w-4 h-4 text-green-600" />
                        </div>
                        <div>
                          <div className="text-sm font-medium text-gray-900">Payment received</div>
                          <div className="text-xs text-gray-500">$56 • Yesterday</div>
                        </div>
                      </div>
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
                      {mockBookings.map(booking => (
                        <tr key={booking.id} className="hover:bg-gray-50 transition-colors">
                          <td className="px-5 py-4 text-sm font-medium text-gray-900">{booking.id}</td>
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
              </div>
            </div>
          )}

          {activeTab === 'vehicles' && (
            <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
              <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
                <h2 className="font-bold text-gray-900">My Vehicles ({mockVehicles.length})</h2>
                <Link
                  to="/vehicle-rental/list-vehicle"
                  className="inline-flex items-center gap-2 px-4 py-2 bg-amber-500 text-white rounded-lg font-medium text-sm hover:bg-amber-600 transition-colors"
                >
                  <Plus className="w-4 h-4" />
                  Add Vehicle
                </Link>
              </div>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 p-5">
                {mockVehicles.map(vehicle => (
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
                        <button className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 bg-amber-500 text-white rounded-lg text-sm font-medium hover:bg-amber-600 transition-colors">
                          <Eye className="w-4 h-4" />
                          View
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'bookings' && (
            <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
              <div className="px-5 py-4 border-b border-gray-100">
                <h2 className="font-bold text-gray-900">All Bookings</h2>
              </div>
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
                    {mockBookings.map(booking => (
                      <tr key={booking.id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-5 py-4 text-sm font-medium text-gray-900">{booking.id}</td>
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
            </div>
          )}

          {activeTab === 'earnings' && (
            <div className="space-y-6">
              <div className="grid sm:grid-cols-3 gap-4">
                <div className="bg-white rounded-2xl p-5 shadow-sm">
                  <div className="text-sm text-gray-500 mb-1">This Month</div>
                  <div className="text-2xl font-bold text-gray-900">${stats.thisMonthEarnings}</div>
                  <div className={`text-sm ${parseFloat(earningsChange) >= 0 ? 'text-green-600' : 'text-red-600'} flex items-center gap-1 mt-1`}>
                    {parseFloat(earningsChange) >= 0 ? <ArrowUpRight className="w-4 h-4" /> : <ArrowDownRight className="w-4 h-4" />}
                    {Math.abs(parseFloat(earningsChange))}% vs last month
                  </div>
                </div>
                <div className="bg-white rounded-2xl p-5 shadow-sm">
                  <div className="text-sm text-gray-500 mb-1">Last Month</div>
                  <div className="text-2xl font-bold text-gray-900">${stats.lastMonthEarnings}</div>
                </div>
                <div className="bg-white rounded-2xl p-5 shadow-sm">
                  <div className="text-sm text-gray-500 mb-1">Total Earnings</div>
                  <div className="text-2xl font-bold text-gray-900">${stats.totalEarnings}</div>
                </div>
              </div>

              <div className="bg-white rounded-2xl shadow-sm p-5">
                <h2 className="font-bold text-gray-900 mb-4">Earnings by Vehicle</h2>
                <div className="space-y-4">
                  {mockVehicles.filter(v => v.monthlyEarnings > 0).map(vehicle => (
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
              </div>
            </div>
          )}

          {activeTab === 'documents' && (
            <div className="bg-white rounded-2xl shadow-sm p-5">
              <h2 className="font-bold text-gray-900 mb-4">Vehicle Documents</h2>
              <p className="text-gray-600 mb-6">Upload and manage your vehicle documents for verification.</p>
              
              <div className="space-y-4">
                {mockVehicles.map(vehicle => (
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
            </div>
          )}
        </div>

        <Footer />
      </div>
    </>
  );
};

export default OwnerDashboard;
