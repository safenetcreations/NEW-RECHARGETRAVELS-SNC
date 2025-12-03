import { useEffect, useState } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { 
  Building2, 
  Package, 
  CalendarDays, 
  DollarSign,
  TrendingUp,
  Clock,
  ArrowRight,
  LogOut,
  User,
  Loader2
} from 'lucide-react';
import { useB2BAuth } from '@/contexts/B2BAuthContext';
import { useB2BApi } from '@/hooks/useB2BApi';
import { B2BBooking } from '@/types/b2b';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

const B2BDashboard = () => {
  const { agency, isAuthenticated, isLoading: authLoading, logout } = useB2BAuth();
  const { getBookings, loading } = useB2BApi();
  const [recentBookings, setRecentBookings] = useState<B2BBooking[]>([]);
  const [stats, setStats] = useState({
    totalBookings: 0,
    thisMonth: 0,
    totalRevenue: 0,
    pendingBookings: 0
  });

  useEffect(() => {
    const fetchDashboardData = async () => {
      const result = await getBookings({ limit: 5 });
      if (result.success && result.data) {
        setRecentBookings(result.data);
        
        // Calculate stats
        const now = new Date();
        const thisMonthStart = new Date(now.getFullYear(), now.getMonth(), 1);
        
        const thisMonthBookings = result.data.filter(b => 
          new Date(b.createdAt) >= thisMonthStart
        );
        
        const pendingBookings = result.data.filter(b => 
          b.status === 'pending' || b.paymentStatus === 'pending'
        );
        
        setStats({
          totalBookings: result.total || result.data.length,
          thisMonth: thisMonthBookings.length,
          totalRevenue: result.data.reduce((sum, b) => sum + b.finalPrice, 0),
          pendingBookings: pendingBookings.length
        });
      }
    };

    if (isAuthenticated) {
      fetchDashboardData();
    }
  }, [isAuthenticated, getBookings]);

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-100">
        <Loader2 className="w-8 h-8 animate-spin text-emerald-500" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/about/partners/b2b/login" replace />;
  }

  const statCards = [
    {
      label: 'Total Bookings',
      value: stats.totalBookings,
      icon: Package,
      color: 'from-blue-500 to-cyan-500',
      bgColor: 'bg-blue-50'
    },
    {
      label: 'This Month',
      value: stats.thisMonth,
      icon: CalendarDays,
      color: 'from-emerald-500 to-teal-500',
      bgColor: 'bg-emerald-50'
    },
    {
      label: 'Total Revenue',
      value: `$${stats.totalRevenue.toLocaleString()}`,
      icon: DollarSign,
      color: 'from-amber-500 to-orange-500',
      bgColor: 'bg-amber-50'
    },
    {
      label: 'Pending',
      value: stats.pendingBookings,
      icon: Clock,
      color: 'from-purple-500 to-pink-500',
      bgColor: 'bg-purple-50'
    }
  ];

  return (
    <>
      <Helmet>
        <title>Dashboard | B2B Portal | Recharge Travels</title>
      </Helmet>
      
      <Header />
      
      <main className="min-h-screen bg-gradient-to-br from-slate-100 via-emerald-50/30 to-teal-50/30 py-8">
        <div className="container mx-auto px-4">
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-xl flex items-center justify-center">
                  <Building2 className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-slate-900">Welcome back!</h1>
                  <p className="text-slate-600">{agency?.agencyName}</p>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-3 mt-4 md:mt-0">
              <Link
                to="/about/partners/b2b/tours"
                className="inline-flex items-center gap-2 bg-emerald-500 text-white px-4 py-2 rounded-lg font-medium hover:bg-emerald-600 transition-all"
              >
                Browse Tours
                <ArrowRight className="w-4 h-4" />
              </Link>
              <button
                onClick={logout}
                className="inline-flex items-center gap-2 bg-slate-200 text-slate-700 px-4 py-2 rounded-lg font-medium hover:bg-slate-300 transition-all"
              >
                <LogOut className="w-4 h-4" />
                Logout
              </button>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {statCards.map((stat, index) => (
              <div
                key={index}
                className="bg-white rounded-2xl p-6 shadow-lg border border-slate-200/50 hover:shadow-xl transition-all"
              >
                <div className={`w-12 h-12 ${stat.bgColor} rounded-xl flex items-center justify-center mb-4`}>
                  <stat.icon className={`w-6 h-6 bg-gradient-to-r ${stat.color} bg-clip-text text-transparent`} style={{ color: 'inherit' }} />
                </div>
                <p className="text-2xl font-bold text-slate-900">{stat.value}</p>
                <p className="text-sm text-slate-500">{stat.label}</p>
              </div>
            ))}
          </div>

          {/* Main Content Grid */}
          <div className="grid lg:grid-cols-3 gap-6">
            {/* Recent Bookings */}
            <div className="lg:col-span-2 bg-white rounded-2xl shadow-lg border border-slate-200/50 overflow-hidden">
              <div className="p-6 border-b border-slate-200 flex items-center justify-between">
                <h2 className="text-lg font-bold text-slate-900">Recent Bookings</h2>
                <Link to="/about/partners/b2b/bookings" className="text-sm text-emerald-600 hover:text-emerald-700 font-medium">
                  View all →
                </Link>
              </div>
              {loading ? (
                <div className="p-8 text-center">
                  <Loader2 className="w-6 h-6 animate-spin text-emerald-500 mx-auto" />
                </div>
              ) : recentBookings.length > 0 ? (
                <div className="divide-y divide-slate-100">
                  {recentBookings.map((booking) => (
                    <div key={booking.id} className="p-4 hover:bg-slate-50 transition-colors">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-semibold text-slate-900">{booking.tourName}</p>
                          <p className="text-sm text-slate-500">
                            {booking.clientName} • {booking.guestCount} guests
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold text-emerald-600">${booking.finalPrice}</p>
                          <span className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${
                            booking.status === 'confirmed' 
                              ? 'bg-emerald-100 text-emerald-700'
                              : booking.status === 'pending'
                              ? 'bg-amber-100 text-amber-700'
                              : 'bg-red-100 text-red-700'
                          }`}>
                            {booking.status}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-8 text-center">
                  <Package className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                  <p className="text-slate-500">No bookings yet</p>
                  <Link to="/about/partners/b2b/tours" className="text-emerald-600 hover:underline text-sm font-medium">
                    Browse available tours
                  </Link>
                </div>
              )}
            </div>

            {/* Quick Actions & Info */}
            <div className="space-y-6">
              {/* Account Info */}
              <div className="bg-white rounded-2xl shadow-lg border border-slate-200/50 p-6">
                <h3 className="font-bold text-slate-900 mb-4">Account Info</h3>
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <User className="w-5 h-5 text-slate-400" />
                    <div>
                      <p className="text-sm text-slate-500">Email</p>
                      <p className="font-medium text-slate-900">{agency?.email}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <TrendingUp className="w-5 h-5 text-slate-400" />
                    <div>
                      <p className="text-sm text-slate-500">Tier</p>
                      <p className="font-medium text-slate-900 capitalize">{agency?.subscriptionTier || 'Free'}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="bg-gradient-to-br from-emerald-500 to-teal-500 rounded-2xl shadow-lg p-6 text-white">
                <h3 className="font-bold mb-4">Quick Actions</h3>
                <div className="space-y-3">
                  <Link
                    to="/about/partners/b2b/tours"
                    className="flex items-center justify-between p-3 bg-white/10 rounded-xl hover:bg-white/20 transition-colors"
                  >
                    <span>Browse Tours</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                  <Link
                    to="/about/partners/b2b/bookings"
                    className="flex items-center justify-between p-3 bg-white/10 rounded-xl hover:bg-white/20 transition-colors"
                  >
                    <span>My Bookings</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                  <a
                    href="mailto:b2b@rechargetravels.com"
                    className="flex items-center justify-between p-3 bg-white/10 rounded-xl hover:bg-white/20 transition-colors"
                  >
                    <span>Contact Support</span>
                    <ArrowRight className="w-4 h-4" />
                  </a>
                </div>
              </div>

              {/* Discount Badge */}
              <div className="bg-amber-50 border border-amber-200 rounded-2xl p-6 text-center">
                <div className="text-4xl font-bold text-amber-600 mb-2">10%</div>
                <p className="text-amber-800 font-medium">B2B Partner Discount</p>
                <p className="text-sm text-amber-600 mt-1">Applied automatically to all bookings</p>
              </div>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </>
  );
};

export default B2BDashboard;
