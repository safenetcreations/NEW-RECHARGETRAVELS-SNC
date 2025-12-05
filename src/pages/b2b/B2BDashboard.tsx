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
  Loader2,
  Globe,
  ChevronDown
} from 'lucide-react';
import { useB2BAuth } from '@/contexts/B2BAuthContext';
import { useB2BApi } from '@/hooks/useB2BApi';
import { useB2BLanguage } from '@/hooks/useB2BLanguage';
import { languageFlags, languageNames, B2BLanguage } from '@/i18n/b2b-translations';
import { B2BBooking } from '@/types/b2b';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

const B2BDashboard = () => {
  const { agency, isAuthenticated, isLoading: authLoading, logout } = useB2BAuth();
  const { getBookings, loading } = useB2BApi();
  const { t, language, setLanguage } = useB2BLanguage();
  const [recentBookings, setRecentBookings] = useState<B2BBooking[]>([]);
  const [showLangMenu, setShowLangMenu] = useState(false);
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
      label: t.dashboard.totalBookings,
      value: stats.totalBookings,
      icon: Package,
      color: 'from-blue-500 to-cyan-500',
      bgColor: 'bg-blue-50'
    },
    {
      label: t.dashboard.revenue,
      value: `$${stats.totalRevenue.toLocaleString()}`,
      icon: DollarSign,
      color: 'from-emerald-500 to-teal-500',
      bgColor: 'bg-emerald-50'
    },
    {
      label: t.dashboard.commission,
      value: `$${(stats.totalRevenue * 0.15).toLocaleString()}`, // 15% estimated commission
      icon: TrendingUp,
      color: 'from-amber-500 to-orange-500',
      bgColor: 'bg-amber-50'
    },
    {
      label: t.dashboard.pendingBookings,
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

      {/* Language Bar */}
      <div className="bg-slate-900 text-white px-4 py-2 border-b border-slate-800">
        <div className="container mx-auto flex justify-end">
          <div className="relative">
            <button
              onClick={() => setShowLangMenu(!showLangMenu)}
              className="flex items-center gap-2 hover:text-emerald-400 transition-colors text-sm font-medium"
            >
              <Globe className="w-4 h-4" />
              <span>{languageFlags[language]} {languageNames[language]}</span>
              <ChevronDown className="w-3 h-3" />
            </button>

            {showLangMenu && (
              <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-xl shadow-xl border border-slate-100 py-2 z-50 max-h-64 overflow-y-auto">
                {(Object.keys(languageNames) as B2BLanguage[]).map((lang) => (
                  <button
                    key={lang}
                    onClick={() => {
                      setLanguage(lang);
                      setShowLangMenu(false);
                    }}
                    className={`w-full text-left px-4 py-2 text-sm hover:bg-slate-50 flex items-center gap-3 ${language === lang ? 'text-emerald-600 bg-emerald-50 font-medium' : 'text-slate-600'
                      }`}
                  >
                    <span className="text-lg">{languageFlags[lang]}</span>
                    {languageNames[lang]}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      <main className="min-h-screen bg-gradient-to-br from-slate-100 via-emerald-50/30 to-teal-50/30 py-8">
        <div className="container mx-auto px-4">
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-xl flex items-center justify-center shadow-lg shadow-emerald-500/20">
                  <Building2 className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-slate-900">{t.dashboard.welcome}!</h1>
                  <p className="text-slate-600">{agency?.agencyName}</p>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-3 mt-4 md:mt-0">
              <Link
                to="/about/partners/b2b/tours"
                className="inline-flex items-center gap-2 bg-emerald-500 text-white px-5 py-2.5 rounded-xl font-medium hover:bg-emerald-600 transition-all shadow-lg shadow-emerald-500/25 hover:shadow-emerald-500/40 transform hover:-translate-y-0.5"
              >
                {t.dashboard.quickBook}
                <ArrowRight className="w-4 h-4" />
              </Link>
              <button
                onClick={logout}
                className="inline-flex items-center gap-2 bg-white text-slate-700 px-5 py-2.5 rounded-xl font-medium hover:bg-slate-50 border border-slate-200 transition-all"
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
                <h2 className="text-lg font-bold text-slate-900">{t.dashboard.recentBookings}</h2>
                <Link to="/about/partners/b2b/bookings" className="text-sm text-emerald-600 hover:text-emerald-700 font-medium">
                  {t.dashboard.viewAll} →
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
                          <span className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${booking.status === 'confirmed'
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
                      <p className="font-medium text-slate-900 capitalize">{agency?.subscriptionTier || 'Standard'}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Discount Badge */}
              <div className="bg-gradient-to-br from-amber-50 to-orange-50 border border-amber-200 rounded-2xl p-6 text-center transform hover:scale-[1.02] transition-transform">
                <div className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-br from-amber-500 to-orange-600 mb-2">15%</div>
                <p className="text-amber-800 font-bold uppercase tracking-wide text-sm">Exclusive Partner Commission</p>
                <p className="text-sm text-amber-600/80 mt-2 font-medium">Applied automatically to every booking</p>
              </div>

              {/* Support */}
              <div className="bg-white rounded-2xl shadow-lg border border-slate-200/50 p-6">
                <h3 className="font-bold text-slate-900 mb-4">{t.common.contactUs}</h3>
                <a
                  href="mailto:partners@rechargetravels.com"
                  className="flex items-center justify-between p-3 bg-slate-50 rounded-xl hover:bg-slate-100 transition-colors mb-2"
                >
                  <span className="text-slate-700 text-sm">Email Support</span>
                  <ArrowRight className="w-4 h-4 text-slate-400" />
                </a>
                <a
                  href="#"
                  className="flex items-center justify-between p-3 bg-emerald-50 rounded-xl hover:bg-emerald-100 transition-colors"
                >
                  <span className="text-emerald-700 text-sm font-medium">WhatsApp Manager</span>
                  <ArrowRight className="w-4 h-4 text-emerald-500" />
                </a>
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
