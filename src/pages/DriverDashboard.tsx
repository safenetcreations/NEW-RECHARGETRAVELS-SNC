import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link, useNavigate } from 'react-router-dom';
import { collection, getDocs, query, where, doc, getDoc, updateDoc } from 'firebase/firestore';
import { auth, db } from '@/lib/firebase';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Calendar,
  CheckCircle,
  Clock,
  DollarSign,
  Eye,
  MapPin,
  MessageCircle,
  Phone,
  Star,
  TrendingUp,
  User,
  Users,
  Wallet,
  XCircle,
  Car,
  Award,
  Shield,
  Bell,
  Settings,
  FileText,
  Camera,
  ChevronRight,
  AlertCircle,
  CheckCircle2,
  Loader2,
  Route,
  ArrowUpRight,
  ArrowDownRight,
  BarChart3,
  CalendarDays,
  ExternalLink
} from 'lucide-react';

// Types
interface DriverProfile {
  id: string;
  firstName: string;
  lastName: string;
  shortName: string;
  email: string;
  phone: string;
  whatsapp?: string;
  profilePhoto?: string;
  status: 'pending' | 'approved' | 'rejected' | 'suspended';
  tier?: string;
  rating: number;
  totalReviews: number;
  totalTrips: number;
  yearsExperience: number;
  languages: string[];
  specialties: string[];
  badges: string[];
  commissionRate: number;
  totalEarnings: number;
  pendingPayouts: number;
  completionRate: number;
  responseTime?: string;
  vehiclePreference: string;
  createdAt: Date;
  approvedAt?: Date;
}

interface Booking {
  id: string;
  customerName: string;
  customerPhone: string;
  tourType: string;
  startDate: string;
  endDate: string;
  pickupLocation: string;
  dropoffLocation: string;
  destinations: string[];
  passengers: number;
  totalPrice: number;
  driverEarnings: number;
  status: 'pending' | 'confirmed' | 'in_progress' | 'completed' | 'cancelled';
  paymentStatus: 'pending' | 'partial' | 'paid';
  createdAt: Date;
}

// Badge definitions
const BADGE_INFO: Record<string, { icon: string; color: string; name: string }> = {
  recharge_verified: { icon: '✓', color: 'bg-emerald-500', name: 'Verified' },
  sltda_verified: { icon: '🏛️', color: 'bg-blue-600', name: 'SLTDA' },
  tour_guide_license: { icon: '🎓', color: 'bg-purple-600', name: 'Tour Guide' },
  five_star_driver: { icon: '⭐', color: 'bg-yellow-500', name: '5-Star' },
  safe_driver: { icon: '🛡️', color: 'bg-teal-500', name: 'Safe Driver' },
  veteran_driver: { icon: '🎖️', color: 'bg-slate-600', name: 'Veteran' }
};

// Mock data for demonstration
const mockBookings: Booking[] = [
  {
    id: 'b1',
    customerName: 'John Smith',
    customerPhone: '+1 555 123 4567',
    tourType: 'Wildlife Safari',
    startDate: '2024-02-20',
    endDate: '2024-02-23',
    pickupLocation: 'Colombo Airport',
    dropoffLocation: 'Colombo Airport',
    destinations: ['Yala National Park', 'Udawalawe'],
    passengers: 4,
    totalPrice: 850,
    driverEarnings: 722,
    status: 'confirmed',
    paymentStatus: 'partial',
    createdAt: new Date()
  },
  {
    id: 'b2',
    customerName: 'Emma Wilson',
    customerPhone: '+44 20 7946 0958',
    tourType: 'Cultural Tour',
    startDate: '2024-02-25',
    endDate: '2024-02-28',
    pickupLocation: 'Colombo',
    dropoffLocation: 'Kandy',
    destinations: ['Sigiriya', 'Dambulla', 'Kandy'],
    passengers: 2,
    totalPrice: 680,
    driverEarnings: 578,
    status: 'pending',
    paymentStatus: 'pending',
    createdAt: new Date()
  },
  {
    id: 'b3',
    customerName: 'Michael Brown',
    customerPhone: '+1 555 987 6543',
    tourType: 'Hill Country',
    startDate: '2024-01-15',
    endDate: '2024-01-18',
    pickupLocation: 'Kandy',
    dropoffLocation: 'Colombo',
    destinations: ['Nuwara Eliya', 'Ella'],
    passengers: 3,
    totalPrice: 720,
    driverEarnings: 612,
    status: 'completed',
    paymentStatus: 'paid',
    createdAt: new Date('2024-01-10')
  }
];

const DriverDashboard: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [driver, setDriver] = useState<DriverProfile | null>(null);
  const [bookings, setBookings] = useState<Booking[]>(mockBookings);
  const [activeTab, setActiveTab] = useState('overview');
  const [updatingBookingId, setUpdatingBookingId] = useState<string | null>(null);

  // Load driver profile
  useEffect(() => {
    const loadDriver = async () => {
      const userId = auth?.currentUser?.uid;
      if (!userId) {
        setLoading(false);
        return;
      }

      try {
        // Try to get from drivers collection
        const driverRef = doc(db, 'drivers', userId);
        const snap = await getDoc(driverRef);

        if (snap.exists()) {
          const data = snap.data();
          setDriver({
            id: snap.id,
            firstName: data.firstName || '',
            lastName: data.lastName || '',
            shortName: data.shortName || data.firstName || 'Driver',
            email: data.email || '',
            phone: data.phone || '',
            whatsapp: data.whatsapp,
            profilePhoto: data.profilePhoto || data.documents?.profilePhoto,
            status: data.status || 'pending',
            tier: data.tier,
            rating: data.rating || data.average_rating || 0,
            totalReviews: data.totalReviews || data.total_reviews || 0,
            totalTrips: data.totalTrips || data.total_trips || 0,
            yearsExperience: data.yearsExperience || 0,
            languages: data.languages || [],
            specialties: data.specialties || [],
            badges: data.badges || [],
            commissionRate: data.commissionRate || 15,
            totalEarnings: data.totalEarnings || 0,
            pendingPayouts: data.pendingPayouts || 0,
            completionRate: data.completionRate || data.completion_rate || 100,
            responseTime: data.responseTime,
            vehiclePreference: data.vehiclePreference || 'own_vehicle',
            createdAt: data.createdAt?.toDate() || new Date(),
            approvedAt: data.approvedAt?.toDate()
          });
        } else {
          // No driver profile - redirect to registration
          setDriver(null);
        }
      } catch (error) {
        console.error('Error loading driver:', error);
      } finally {
        setLoading(false);
      }
    };

    loadDriver();
  }, []);

  // Handle booking actions
  const handleBookingAction = async (bookingId: string, newStatus: Booking['status']) => {
    setUpdatingBookingId(bookingId);
    try {
      // In production, update Firestore
      setBookings(prev => prev.map(b =>
        b.id === bookingId ? { ...b, status: newStatus } : b
      ));
    } catch (error) {
      console.error('Error updating booking:', error);
    } finally {
      setUpdatingBookingId(null);
    }
  };

  // Calculate stats
  const stats = {
    upcomingTrips: bookings.filter(b => ['pending', 'confirmed'].includes(b.status)).length,
    completedTrips: bookings.filter(b => b.status === 'completed').length,
    totalEarnings: bookings.filter(b => b.status === 'completed').reduce((sum, b) => sum + b.driverEarnings, 0),
    pendingEarnings: bookings.filter(b => ['confirmed', 'in_progress'].includes(b.status)).reduce((sum, b) => sum + b.driverEarnings, 0),
    thisMonth: bookings.filter(b => {
      const bDate = new Date(b.startDate);
      const now = new Date();
      return bDate.getMonth() === now.getMonth() && bDate.getFullYear() === now.getFullYear();
    }).length
  };

  // Not logged in
  if (!auth?.currentUser && !loading) {
    return (
      <main className="min-h-screen bg-slate-50 py-16">
        <div className="container mx-auto px-4">
          <Card className="max-w-md mx-auto">
            <CardContent className="pt-8 text-center">
              <AlertCircle className="w-16 h-16 text-amber-500 mx-auto mb-4" />
              <h2 className="text-xl font-bold mb-2">Login Required</h2>
              <p className="text-slate-600 mb-6">Please log in to access your dashboard.</p>
              <Button onClick={() => navigate('/login')} className="w-full">
                Go to Login
              </Button>
            </CardContent>
          </Card>
        </div>
      </main>
    );
  }

  // Loading
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-orange-500 mx-auto mb-4" />
          <p className="text-slate-600">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  // No driver profile
  if (!driver) {
    return (
      <main className="min-h-screen bg-slate-50 py-16">
        <div className="container mx-auto px-4">
          <Card className="max-w-md mx-auto">
            <CardContent className="pt-8 text-center">
              <Car className="w-16 h-16 text-orange-500 mx-auto mb-4" />
              <h2 className="text-xl font-bold mb-2">No Driver Profile Found</h2>
              <p className="text-slate-600 mb-6">
                Register as a driver to access your dashboard and start receiving bookings.
              </p>
              <Button onClick={() => navigate('/driver/register')} className="w-full bg-orange-500 hover:bg-orange-600">
                Register as Driver
              </Button>
            </CardContent>
          </Card>
        </div>
      </main>
    );
  }

  // Get status color
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved': return 'bg-emerald-500';
      case 'pending': return 'bg-amber-500';
      case 'rejected': return 'bg-red-500';
      case 'suspended': return 'bg-gray-500';
      default: return 'bg-gray-500';
    }
  };

  return (
    <>
      <Helmet>
        <title>Driver Dashboard | Recharge Travels</title>
      </Helmet>

      <main className="min-h-screen bg-gradient-to-b from-slate-100 to-slate-50">
        <div className="container mx-auto px-4 py-6 max-w-7xl">

          {/* Profile Header */}
          <div className="bg-white rounded-2xl shadow-sm border overflow-hidden mb-6">
            <div className="bg-gradient-to-r from-slate-800 to-slate-700 px-6 py-8">
              <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
                {/* Profile Photo */}
                <div className="relative">
                  <div className="w-24 h-24 rounded-full bg-white/20 border-4 border-white/30 overflow-hidden">
                    {driver.profilePhoto ? (
                      <img src={driver.profilePhoto} alt={driver.shortName} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <User className="w-12 h-12 text-white/70" />
                      </div>
                    )}
                  </div>
                  <div className={`absolute -bottom-1 -right-1 w-8 h-8 ${getStatusColor(driver.status)} rounded-full border-4 border-white flex items-center justify-center`}>
                    {driver.status === 'approved' ? (
                      <CheckCircle className="w-4 h-4 text-white" />
                    ) : driver.status === 'pending' ? (
                      <Clock className="w-4 h-4 text-white" />
                    ) : (
                      <XCircle className="w-4 h-4 text-white" />
                    )}
                  </div>
                </div>

                {/* Info */}
                <div className="flex-1 text-white">
                  <div className="flex flex-wrap items-center gap-3 mb-2">
                    <h1 className="text-2xl font-bold">{driver.shortName}</h1>
                    <Badge className={`${getStatusColor(driver.status)} text-white`}>
                      {driver.status.charAt(0).toUpperCase() + driver.status.slice(1)}
                    </Badge>
                  </div>
                  <p className="text-white/70 mb-3">{driver.email}</p>

                  {/* Badges */}
                  <div className="flex flex-wrap gap-2">
                    {driver.badges.slice(0, 4).map(badgeKey => {
                      const badge = BADGE_INFO[badgeKey];
                      if (!badge) return null;
                      return (
                        <span key={badgeKey} className={`${badge.color} text-white text-xs px-2 py-1 rounded-full flex items-center gap-1`}>
                          <span>{badge.icon}</span>
                          <span>{badge.name}</span>
                        </span>
                      );
                    })}
                    {driver.badges.length === 0 && (
                      <span className="text-white/50 text-sm">Complete verification to earn badges</span>
                    )}
                  </div>
                </div>

                {/* Quick Stats */}
                <div className="flex gap-6 text-white">
                  <div className="text-center">
                    <div className="flex items-center justify-center gap-1">
                      <Star className="w-5 h-5 text-yellow-400 fill-yellow-400" />
                      <span className="text-2xl font-bold">{driver.rating > 0 ? driver.rating.toFixed(1) : '-'}</span>
                    </div>
                    <p className="text-xs text-white/70">{driver.totalReviews} reviews</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold">{driver.totalTrips}</p>
                    <p className="text-xs text-white/70">Total trips</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold">{driver.completionRate}%</p>
                    <p className="text-xs text-white/70">Completion</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="px-6 py-4 bg-slate-50 border-t flex flex-wrap gap-3">
              <Link to={`/driver/${driver.id}`}>
                <Button variant="outline" size="sm">
                  <Eye className="w-4 h-4 mr-2" /> View Public Profile
                </Button>
              </Link>
              <Button variant="outline" size="sm">
                <Settings className="w-4 h-4 mr-2" /> Edit Profile
              </Button>
              <a href={`https://wa.me/${driver.whatsapp?.replace(/\D/g, '')}`} target="_blank" rel="noopener noreferrer">
                <Button variant="outline" size="sm" className="text-green-600 border-green-200 hover:bg-green-50">
                  <MessageCircle className="w-4 h-4 mr-2" /> WhatsApp
                </Button>
              </a>
            </div>
          </div>

          {/* Pending Approval Notice */}
          {driver.status === 'pending' && (
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-6 flex items-start gap-4">
              <div className="w-10 h-10 bg-amber-100 rounded-full flex items-center justify-center flex-shrink-0">
                <Clock className="w-5 h-5 text-amber-600" />
              </div>
              <div>
                <h3 className="font-semibold text-amber-800">Profile Under Review</h3>
                <p className="text-sm text-amber-700 mt-1">
                  Your profile is being reviewed by our team. This usually takes 24-48 hours.
                  Once approved, you'll be able to receive bookings.
                </p>
              </div>
            </div>
          )}

          {/* Stats Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <Card className="bg-gradient-to-br from-emerald-500 to-emerald-600 text-white border-0">
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <DollarSign className="w-8 h-8 opacity-80" />
                  <ArrowUpRight className="w-4 h-4 opacity-60" />
                </div>
                <p className="text-2xl font-bold">${stats.totalEarnings.toLocaleString()}</p>
                <p className="text-xs opacity-80">Total Earnings</p>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white border-0">
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <Wallet className="w-8 h-8 opacity-80" />
                  <Clock className="w-4 h-4 opacity-60" />
                </div>
                <p className="text-2xl font-bold">${stats.pendingEarnings.toLocaleString()}</p>
                <p className="text-xs opacity-80">Pending Earnings</p>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-orange-500 to-orange-600 text-white border-0">
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <Calendar className="w-8 h-8 opacity-80" />
                  <span className="text-xs bg-white/20 px-2 py-0.5 rounded-full">Upcoming</span>
                </div>
                <p className="text-2xl font-bold">{stats.upcomingTrips}</p>
                <p className="text-xs opacity-80">Upcoming Trips</p>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-purple-500 to-purple-600 text-white border-0">
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <CheckCircle className="w-8 h-8 opacity-80" />
                  <span className="text-xs bg-white/20 px-2 py-0.5 rounded-full">All time</span>
                </div>
                <p className="text-2xl font-bold">{stats.completedTrips}</p>
                <p className="text-xs opacity-80">Completed Trips</p>
              </CardContent>
            </Card>
          </div>

          {/* Main Content Tabs */}
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
            <TabsList className="bg-white border p-1 rounded-lg">
              <TabsTrigger value="overview" className="flex items-center gap-2">
                <BarChart3 className="w-4 h-4" /> Overview
              </TabsTrigger>
              <TabsTrigger value="bookings" className="flex items-center gap-2">
                <CalendarDays className="w-4 h-4" /> Bookings
                {stats.upcomingTrips > 0 && (
                  <span className="ml-1 bg-orange-500 text-white text-xs px-2 py-0.5 rounded-full">
                    {stats.upcomingTrips}
                  </span>
                )}
              </TabsTrigger>
              <TabsTrigger value="earnings" className="flex items-center gap-2">
                <Wallet className="w-4 h-4" /> Earnings
              </TabsTrigger>
            </TabsList>

            {/* Overview Tab */}
            <TabsContent value="overview">
              <div className="grid md:grid-cols-2 gap-6">
                {/* Upcoming Trips */}
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg flex items-center gap-2">
                      <Calendar className="w-5 h-5 text-orange-500" />
                      Upcoming Trips
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {bookings.filter(b => ['pending', 'confirmed'].includes(b.status)).length === 0 ? (
                      <div className="text-center py-8 text-slate-500">
                        <Calendar className="w-12 h-12 mx-auto mb-3 opacity-30" />
                        <p>No upcoming trips</p>
                        <p className="text-sm">New bookings will appear here</p>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        {bookings.filter(b => ['pending', 'confirmed'].includes(b.status)).slice(0, 3).map(booking => (
                          <div key={booking.id} className="border rounded-lg p-3 hover:bg-slate-50 transition-colors">
                            <div className="flex items-start justify-between mb-2">
                              <div>
                                <p className="font-semibold">{booking.tourType}</p>
                                <p className="text-sm text-slate-500">{booking.customerName}</p>
                              </div>
                              <Badge variant={booking.status === 'confirmed' ? 'default' : 'secondary'}>
                                {booking.status}
                              </Badge>
                            </div>
                            <div className="flex items-center gap-4 text-sm text-slate-600">
                              <span className="flex items-center gap-1">
                                <CalendarDays className="w-3 h-3" />
                                {booking.startDate}
                              </span>
                              <span className="flex items-center gap-1">
                                <Users className="w-3 h-3" />
                                {booking.passengers} pax
                              </span>
                              <span className="font-semibold text-emerald-600">
                                ${booking.driverEarnings}
                              </span>
                            </div>
                            {booking.status === 'pending' && (
                              <div className="flex gap-2 mt-3">
                                <Button
                                  size="sm"
                                  className="flex-1 h-8 bg-emerald-500 hover:bg-emerald-600"
                                  onClick={() => handleBookingAction(booking.id, 'confirmed')}
                                  disabled={updatingBookingId === booking.id}
                                >
                                  <CheckCircle2 className="w-3 h-3 mr-1" /> Accept
                                </Button>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  className="flex-1 h-8"
                                  onClick={() => handleBookingAction(booking.id, 'cancelled')}
                                  disabled={updatingBookingId === booking.id}
                                >
                                  <XCircle className="w-3 h-3 mr-1" /> Decline
                                </Button>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* Profile Completion */}
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg flex items-center gap-2">
                      <Award className="w-5 h-5 text-purple-500" />
                      Profile Strength
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {/* Progress */}
                      <div>
                        <div className="flex justify-between text-sm mb-2">
                          <span className="text-slate-600">Profile completion</span>
                          <span className="font-semibold">75%</span>
                        </div>
                        <div className="h-2 bg-slate-200 rounded-full overflow-hidden">
                          <div className="h-full bg-gradient-to-r from-purple-500 to-pink-500 rounded-full" style={{ width: '75%' }} />
                        </div>
                      </div>

                      {/* Checklist */}
                      <div className="space-y-2">
                        <div className="flex items-center gap-3 text-sm">
                          <CheckCircle className="w-4 h-4 text-emerald-500" />
                          <span className="text-slate-700">Basic information</span>
                        </div>
                        <div className="flex items-center gap-3 text-sm">
                          <CheckCircle className="w-4 h-4 text-emerald-500" />
                          <span className="text-slate-700">Driving license uploaded</span>
                        </div>
                        <div className="flex items-center gap-3 text-sm">
                          <CheckCircle className="w-4 h-4 text-emerald-500" />
                          <span className="text-slate-700">Profile photo</span>
                        </div>
                        <div className="flex items-center gap-3 text-sm">
                          <div className="w-4 h-4 border-2 border-slate-300 rounded-full" />
                          <span className="text-slate-500">Add vehicle photos</span>
                          <Button variant="link" size="sm" className="h-auto p-0 text-orange-500">Add</Button>
                        </div>
                        <div className="flex items-center gap-3 text-sm">
                          <div className="w-4 h-4 border-2 border-slate-300 rounded-full" />
                          <span className="text-slate-500">Get your first review</span>
                        </div>
                      </div>

                      {/* Tips */}
                      <div className="bg-blue-50 rounded-lg p-3 mt-4">
                        <p className="text-sm text-blue-800">
                          <strong>Tip:</strong> Drivers with complete profiles get 3x more bookings!
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Quick Info */}
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg flex items-center gap-2">
                      <User className="w-5 h-5 text-blue-500" />
                      Quick Info
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between py-2 border-b">
                        <span className="text-slate-600">Experience</span>
                        <span className="font-medium">{driver.yearsExperience} years</span>
                      </div>
                      <div className="flex items-center justify-between py-2 border-b">
                        <span className="text-slate-600">Languages</span>
                        <span className="font-medium">{driver.languages.join(', ') || '-'}</span>
                      </div>
                      <div className="flex items-center justify-between py-2 border-b">
                        <span className="text-slate-600">Vehicle</span>
                        <span className="font-medium capitalize">{driver.vehiclePreference.replace(/_/g, ' ')}</span>
                      </div>
                      <div className="flex items-center justify-between py-2 border-b">
                        <span className="text-slate-600">Commission Rate</span>
                        <span className="font-medium">{driver.commissionRate}%</span>
                      </div>
                      <div className="flex items-center justify-between py-2">
                        <span className="text-slate-600">Member since</span>
                        <span className="font-medium">
                          {driver.createdAt.toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Support */}
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg flex items-center gap-2">
                      <MessageCircle className="w-5 h-5 text-green-500" />
                      Need Help?
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <a
                        href="https://wa.me/94777721999"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-between p-3 bg-green-50 rounded-lg hover:bg-green-100 transition-colors"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center">
                            <MessageCircle className="w-5 h-5 text-white" />
                          </div>
                          <div>
                            <p className="font-medium text-green-800">WhatsApp Support</p>
                            <p className="text-sm text-green-600">Chat with our team</p>
                          </div>
                        </div>
                        <ExternalLink className="w-4 h-4 text-green-600" />
                      </a>

                      <a
                        href="tel:+94777721999"
                        className="flex items-center justify-between p-3 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-slate-200 rounded-full flex items-center justify-center">
                            <Phone className="w-5 h-5 text-slate-600" />
                          </div>
                          <div>
                            <p className="font-medium">Call Support</p>
                            <p className="text-sm text-slate-500">+94 77 772 1999</p>
                          </div>
                        </div>
                        <ChevronRight className="w-4 h-4 text-slate-400" />
                      </a>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Bookings Tab */}
            <TabsContent value="bookings">
              <Card>
                <CardHeader>
                  <CardTitle>All Bookings</CardTitle>
                </CardHeader>
                <CardContent>
                  {bookings.length === 0 ? (
                    <div className="text-center py-12">
                      <Calendar className="w-16 h-16 mx-auto text-slate-300 mb-4" />
                      <h3 className="text-lg font-semibold text-slate-700">No bookings yet</h3>
                      <p className="text-slate-500">Your bookings will appear here once customers book you.</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {bookings.map(booking => (
                        <div key={booking.id} className="border rounded-xl p-4 hover:shadow-md transition-shadow">
                          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                            <div className="flex-1">
                              <div className="flex items-center gap-3 mb-2">
                                <h3 className="font-semibold text-lg">{booking.tourType}</h3>
                                <Badge variant={
                                  booking.status === 'completed' ? 'default' :
                                  booking.status === 'confirmed' ? 'secondary' :
                                  booking.status === 'pending' ? 'outline' : 'destructive'
                                }>
                                  {booking.status}
                                </Badge>
                                <Badge variant="outline" className={
                                  booking.paymentStatus === 'paid' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' :
                                  booking.paymentStatus === 'partial' ? 'bg-amber-50 text-amber-700 border-amber-200' :
                                  'bg-slate-50'
                                }>
                                  {booking.paymentStatus}
                                </Badge>
                              </div>

                              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
                                <div>
                                  <p className="text-slate-500">Customer</p>
                                  <p className="font-medium">{booking.customerName}</p>
                                </div>
                                <div>
                                  <p className="text-slate-500">Dates</p>
                                  <p className="font-medium">{booking.startDate} → {booking.endDate}</p>
                                </div>
                                <div>
                                  <p className="text-slate-500">Passengers</p>
                                  <p className="font-medium">{booking.passengers} people</p>
                                </div>
                                <div>
                                  <p className="text-slate-500">Your Earnings</p>
                                  <p className="font-medium text-emerald-600">${booking.driverEarnings}</p>
                                </div>
                              </div>

                              <div className="flex items-center gap-2 mt-3 text-sm text-slate-600">
                                <MapPin className="w-3 h-3" />
                                <span>{booking.pickupLocation} → {booking.dropoffLocation}</span>
                              </div>

                              <div className="flex flex-wrap gap-1 mt-2">
                                {booking.destinations.map((dest, i) => (
                                  <Badge key={i} variant="outline" className="text-xs">
                                    {dest}
                                  </Badge>
                                ))}
                              </div>
                            </div>

                            {/* Actions */}
                            <div className="flex flex-col gap-2 min-w-[140px]">
                              {booking.status === 'pending' && (
                                <>
                                  <Button
                                    className="bg-emerald-500 hover:bg-emerald-600"
                                    onClick={() => handleBookingAction(booking.id, 'confirmed')}
                                    disabled={updatingBookingId === booking.id}
                                  >
                                    <CheckCircle2 className="w-4 h-4 mr-2" /> Accept
                                  </Button>
                                  <Button
                                    variant="outline"
                                    onClick={() => handleBookingAction(booking.id, 'cancelled')}
                                    disabled={updatingBookingId === booking.id}
                                  >
                                    <XCircle className="w-4 h-4 mr-2" /> Decline
                                  </Button>
                                </>
                              )}
                              {booking.status === 'confirmed' && (
                                <>
                                  <Button
                                    onClick={() => handleBookingAction(booking.id, 'in_progress')}
                                    disabled={updatingBookingId === booking.id}
                                  >
                                    <Route className="w-4 h-4 mr-2" /> Start Trip
                                  </Button>
                                  <a href={`tel:${booking.customerPhone}`}>
                                    <Button variant="outline" className="w-full">
                                      <Phone className="w-4 h-4 mr-2" /> Call
                                    </Button>
                                  </a>
                                </>
                              )}
                              {booking.status === 'in_progress' && (
                                <Button
                                  className="bg-emerald-500 hover:bg-emerald-600"
                                  onClick={() => handleBookingAction(booking.id, 'completed')}
                                  disabled={updatingBookingId === booking.id}
                                >
                                  <CheckCircle className="w-4 h-4 mr-2" /> Complete
                                </Button>
                              )}
                              {booking.status === 'completed' && (
                                <div className="text-center text-sm text-slate-500">
                                  <CheckCircle className="w-8 h-8 text-emerald-500 mx-auto mb-1" />
                                  Completed
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            {/* Earnings Tab */}
            <TabsContent value="earnings">
              <div className="grid md:grid-cols-3 gap-6">
                <Card className="md:col-span-2">
                  <CardHeader>
                    <CardTitle>Earnings Summary</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 gap-4 mb-6">
                      <div className="bg-emerald-50 rounded-lg p-4">
                        <p className="text-sm text-emerald-600">Total Earned</p>
                        <p className="text-3xl font-bold text-emerald-700">${stats.totalEarnings.toLocaleString()}</p>
                      </div>
                      <div className="bg-blue-50 rounded-lg p-4">
                        <p className="text-sm text-blue-600">Pending</p>
                        <p className="text-3xl font-bold text-blue-700">${stats.pendingEarnings.toLocaleString()}</p>
                      </div>
                    </div>

                    <h4 className="font-semibold mb-3">Recent Transactions</h4>
                    <div className="space-y-3">
                      {bookings.filter(b => b.status === 'completed').map(booking => (
                        <div key={booking.id} className="flex items-center justify-between py-3 border-b">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-emerald-100 rounded-full flex items-center justify-center">
                              <DollarSign className="w-5 h-5 text-emerald-600" />
                            </div>
                            <div>
                              <p className="font-medium">{booking.tourType}</p>
                              <p className="text-sm text-slate-500">{booking.customerName}</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="font-semibold text-emerald-600">+${booking.driverEarnings}</p>
                            <p className="text-xs text-slate-500">{booking.endDate}</p>
                          </div>
                        </div>
                      ))}
                      {bookings.filter(b => b.status === 'completed').length === 0 && (
                        <p className="text-center py-8 text-slate-500">No completed trips yet</p>
                      )}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Commission Info</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center mb-6">
                      <div className="w-24 h-24 mx-auto mb-4 relative">
                        <svg className="w-24 h-24 transform -rotate-90">
                          <circle cx="48" cy="48" r="40" stroke="#e2e8f0" strokeWidth="8" fill="none" />
                          <circle
                            cx="48" cy="48" r="40"
                            stroke="#10b981" strokeWidth="8" fill="none"
                            strokeDasharray={`${(100 - driver.commissionRate) * 2.51} 251`}
                          />
                        </svg>
                        <div className="absolute inset-0 flex items-center justify-center">
                          <span className="text-2xl font-bold">{100 - driver.commissionRate}%</span>
                        </div>
                      </div>
                      <p className="text-slate-600">You keep <strong>{100 - driver.commissionRate}%</strong> of each booking</p>
                    </div>

                    <div className="bg-slate-50 rounded-lg p-4">
                      <h4 className="font-semibold mb-2">How it works</h4>
                      <ul className="text-sm text-slate-600 space-y-2">
                        <li className="flex items-start gap-2">
                          <CheckCircle className="w-4 h-4 text-emerald-500 mt-0.5" />
                          <span>Recharge handles bookings & payments</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <CheckCircle className="w-4 h-4 text-emerald-500 mt-0.5" />
                          <span>You receive {100 - driver.commissionRate}% directly</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <CheckCircle className="w-4 h-4 text-emerald-500 mt-0.5" />
                          <span>Payouts within 48 hours after trip</span>
                        </li>
                      </ul>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </>
  );
};

export default DriverDashboard;
