import { useEffect, useState } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { 
  Building2, 
  Package, 
  Users,
  DollarSign,
  TrendingUp,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  Loader2,
  ArrowRight
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

interface DashboardStats {
  totalAgencies: number;
  pendingAgencies: number;
  activeAgencies: number;
  totalBookings: number;
  totalRevenue: number;
  thisMonthBookings: number;
}

interface RecentAgency {
  id: string;
  agencyName: string;
  email: string;
  country: string;
  status: string;
  createdAt: any;
}

interface RecentBooking {
  id: string;
  tourName: string;
  agencyId: string;
  clientName: string;
  finalPrice: number;
  status: string;
  createdAt: any;
}

const B2BAdminDashboard = () => {
  const { user, isAdmin } = useAuth();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<DashboardStats>({
    totalAgencies: 0,
    pendingAgencies: 0,
    activeAgencies: 0,
    totalBookings: 0,
    totalRevenue: 0,
    thisMonthBookings: 0
  });
  const [recentAgencies, setRecentAgencies] = useState<RecentAgency[]>([]);
  const [recentBookings, setRecentBookings] = useState<RecentBooking[]>([]);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const response = await fetch('/api/b2b/admin/dashboard', {
          headers: {
            'Authorization': `Bearer ${await user?.getIdToken()}`
          }
        });
        const data = await response.json();
        
        if (data.success) {
          setStats(data.stats);
          setRecentAgencies(data.recentAgencies || []);
          setRecentBookings(data.recentBookings || []);
        }
      } catch (error) {
        console.error('Failed to fetch dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    if (user && isAdmin) {
      fetchDashboardData();
    } else {
      setLoading(false);
    }
  }, [user, isAdmin]);

  if (!user || !isAdmin) {
    return <Navigate to="/login" replace />;
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-100">
        <Loader2 className="w-8 h-8 animate-spin text-emerald-500" />
      </div>
    );
  }

  const statCards = [
    {
      label: 'Total Agencies',
      value: stats.totalAgencies,
      icon: Building2,
      color: 'from-blue-500 to-cyan-500',
      bgColor: 'bg-blue-50'
    },
    {
      label: 'Pending Approval',
      value: stats.pendingAgencies,
      icon: Clock,
      color: 'from-amber-500 to-orange-500',
      bgColor: 'bg-amber-50'
    },
    {
      label: 'Active Agencies',
      value: stats.activeAgencies,
      icon: CheckCircle,
      color: 'from-emerald-500 to-teal-500',
      bgColor: 'bg-emerald-50'
    },
    {
      label: 'Total Bookings',
      value: stats.totalBookings,
      icon: Package,
      color: 'from-purple-500 to-pink-500',
      bgColor: 'bg-purple-50'
    },
    {
      label: 'Total Revenue',
      value: `$${stats.totalRevenue.toLocaleString()}`,
      icon: DollarSign,
      color: 'from-green-500 to-emerald-500',
      bgColor: 'bg-green-50'
    },
    {
      label: 'This Month',
      value: stats.thisMonthBookings,
      icon: TrendingUp,
      color: 'from-indigo-500 to-violet-500',
      bgColor: 'bg-indigo-50'
    }
  ];

  return (
    <>
      <Helmet>
        <title>B2B Admin Dashboard | Recharge Travels</title>
      </Helmet>
      
      <Header />
      
      <main className="min-h-screen bg-gradient-to-br from-slate-100 via-emerald-50/30 to-teal-50/30 py-8">
        <div className="container mx-auto px-4">
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-slate-900 mb-2">B2B Admin Dashboard</h1>
              <p className="text-slate-600">Manage agencies, tours, and bookings</p>
            </div>
            <div className="flex gap-3 mt-4 md:mt-0">
              <Link
                to="/admin/b2b/agencies"
                className="inline-flex items-center gap-2 bg-emerald-500 text-white px-4 py-2 rounded-lg font-medium hover:bg-emerald-600"
              >
                Manage Agencies
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                to="/admin/b2b/tours"
                className="inline-flex items-center gap-2 bg-slate-700 text-white px-4 py-2 rounded-lg font-medium hover:bg-slate-800"
              >
                Manage Tours
              </Link>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 mb-8">
            {statCards.map((stat, index) => (
              <div
                key={index}
                className="bg-white rounded-2xl p-5 shadow-lg border border-slate-200/50 hover:shadow-xl transition-all"
              >
                <div className={`w-10 h-10 ${stat.bgColor} rounded-xl flex items-center justify-center mb-3`}>
                  <stat.icon className="w-5 h-5 text-slate-700" />
                </div>
                <p className="text-2xl font-bold text-slate-900">{stat.value}</p>
                <p className="text-xs text-slate-500">{stat.label}</p>
              </div>
            ))}
          </div>

          <div className="grid lg:grid-cols-2 gap-6">
            {/* Recent Agencies */}
            <div className="bg-white rounded-2xl shadow-lg border border-slate-200/50 overflow-hidden">
              <div className="p-6 border-b border-slate-200 flex items-center justify-between">
                <h2 className="text-lg font-bold text-slate-900">Recent Agencies</h2>
                <Link to="/admin/b2b/agencies" className="text-sm text-emerald-600 hover:text-emerald-700 font-medium">
                  View all →
                </Link>
              </div>
              {recentAgencies.length > 0 ? (
                <div className="divide-y divide-slate-100">
                  {recentAgencies.map((agency) => (
                    <div key={agency.id} className="p-4 hover:bg-slate-50 transition-colors">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-semibold text-slate-900">{agency.agencyName}</p>
                          <p className="text-sm text-slate-500">{agency.email} • {agency.country}</p>
                        </div>
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          agency.status === 'active' 
                            ? 'bg-emerald-100 text-emerald-700'
                            : agency.status === 'pending'
                            ? 'bg-amber-100 text-amber-700'
                            : 'bg-red-100 text-red-700'
                        }`}>
                          {agency.status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-8 text-center">
                  <Users className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                  <p className="text-slate-500">No agencies yet</p>
                </div>
              )}
            </div>

            {/* Recent Bookings */}
            <div className="bg-white rounded-2xl shadow-lg border border-slate-200/50 overflow-hidden">
              <div className="p-6 border-b border-slate-200 flex items-center justify-between">
                <h2 className="text-lg font-bold text-slate-900">Recent Bookings</h2>
                <Link to="/admin/b2b/bookings" className="text-sm text-emerald-600 hover:text-emerald-700 font-medium">
                  View all →
                </Link>
              </div>
              {recentBookings.length > 0 ? (
                <div className="divide-y divide-slate-100">
                  {recentBookings.map((booking) => (
                    <div key={booking.id} className="p-4 hover:bg-slate-50 transition-colors">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-semibold text-slate-900">{booking.tourName}</p>
                          <p className="text-sm text-slate-500">Client: {booking.clientName}</p>
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
                </div>
              )}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="mt-8 grid md:grid-cols-4 gap-4">
            <Link
              to="/admin/b2b/agencies?status=pending"
              className="bg-amber-50 border border-amber-200 rounded-xl p-4 hover:bg-amber-100 transition-colors"
            >
              <div className="flex items-center gap-3">
                <AlertCircle className="w-8 h-8 text-amber-600" />
                <div>
                  <p className="font-semibold text-amber-900">{stats.pendingAgencies} Pending</p>
                  <p className="text-sm text-amber-700">Agencies to review</p>
                </div>
              </div>
            </Link>
            <Link
              to="/admin/b2b/tours/new"
              className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 hover:bg-emerald-100 transition-colors"
            >
              <div className="flex items-center gap-3">
                <Package className="w-8 h-8 text-emerald-600" />
                <div>
                  <p className="font-semibold text-emerald-900">Add Tour</p>
                  <p className="text-sm text-emerald-700">Create new B2B tour</p>
                </div>
              </div>
            </Link>
            <Link
              to="/admin/b2b/bookings"
              className="bg-blue-50 border border-blue-200 rounded-xl p-4 hover:bg-blue-100 transition-colors"
            >
              <div className="flex items-center gap-3">
                <TrendingUp className="w-8 h-8 text-blue-600" />
                <div>
                  <p className="font-semibold text-blue-900">All Bookings</p>
                  <p className="text-sm text-blue-700">View booking history</p>
                </div>
              </div>
            </Link>
            <Link
              to="/admin/b2b/analytics"
              className="bg-purple-50 border border-purple-200 rounded-xl p-4 hover:bg-purple-100 transition-colors"
            >
              <div className="flex items-center gap-3">
                <DollarSign className="w-8 h-8 text-purple-600" />
                <div>
                  <p className="font-semibold text-purple-900">Analytics</p>
                  <p className="text-sm text-purple-700">Revenue reports</p>
                </div>
              </div>
            </Link>
          </div>
        </div>
      </main>
      
      <Footer />
    </>
  );
};

export default B2BAdminDashboard;
