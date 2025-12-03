import { useEffect, useState } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { 
  ArrowLeft,
  TrendingUp,
  TrendingDown,
  DollarSign,
  Users,
  Package,
  Calendar,
  Download,
  Loader2,
  BarChart3,
  PieChart
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

interface AnalyticsData {
  revenue: {
    total: number;
    thisMonth: number;
    lastMonth: number;
    growth: number;
  };
  bookings: {
    total: number;
    thisMonth: number;
    lastMonth: number;
    growth: number;
  };
  agencies: {
    total: number;
    active: number;
    new: number;
  };
  topTours: Array<{
    name: string;
    bookings: number;
    revenue: number;
  }>;
  topAgencies: Array<{
    name: string;
    bookings: number;
    revenue: number;
  }>;
  monthlyRevenue: Array<{
    month: string;
    revenue: number;
    bookings: number;
  }>;
  categoryBreakdown: Array<{
    category: string;
    bookings: number;
    percentage: number;
  }>;
}

const B2BAnalytics = () => {
  const { user, isAdmin } = useAuth();
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [dateRange, setDateRange] = useState('30'); // days

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const response = await fetch(`/api/b2b/admin/analytics?days=${dateRange}`, {
          headers: {
            'Authorization': `Bearer ${await user?.getIdToken()}`
          }
        });
        const result = await response.json();
        
        if (result.success) {
          setData(result.data);
        }
      } catch (error) {
        console.error('Failed to fetch analytics:', error);
      } finally {
        setLoading(false);
      }
    };

    if (user && isAdmin) {
      fetchAnalytics();
    }
  }, [user, isAdmin, dateRange]);

  if (!user || !isAdmin) {
    return <Navigate to="/login" replace />;
  }

  const exportReport = () => {
    if (!data) return;
    
    const report = {
      generatedAt: new Date().toISOString(),
      period: `Last ${dateRange} days`,
      ...data
    };
    
    const blob = new Blob([JSON.stringify(report, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `b2b-analytics-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-100">
        <Loader2 className="w-8 h-8 animate-spin text-emerald-500" />
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>Analytics | B2B Admin | Recharge Travels</title>
      </Helmet>
      
      <Header />
      
      <main className="min-h-screen bg-gradient-to-br from-slate-100 via-emerald-50/30 to-teal-50/30 py-8">
        <div className="container mx-auto px-4">
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
            <div>
              <Link
                to="/admin/b2b"
                className="inline-flex items-center gap-2 text-slate-600 hover:text-slate-900 mb-4"
              >
                <ArrowLeft className="w-4 h-4" />
                Back to Dashboard
              </Link>
              <h1 className="text-3xl font-bold text-slate-900 mb-2">B2B Analytics</h1>
              <p className="text-slate-600">Revenue, bookings, and performance insights</p>
            </div>
            <div className="flex gap-3 mt-4 md:mt-0">
              <select
                value={dateRange}
                onChange={(e) => setDateRange(e.target.value)}
                className="px-4 py-2 border border-slate-300 rounded-lg bg-white"
              >
                <option value="7">Last 7 days</option>
                <option value="30">Last 30 days</option>
                <option value="90">Last 90 days</option>
                <option value="365">Last year</option>
              </select>
              <button
                onClick={exportReport}
                className="inline-flex items-center gap-2 bg-slate-700 text-white px-4 py-2 rounded-lg font-medium hover:bg-slate-800"
              >
                <Download className="w-5 h-5" />
                Export
              </button>
            </div>
          </div>

          {/* Key Metrics */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {/* Revenue Card */}
            <div className="bg-white rounded-2xl shadow-lg border border-slate-200/50 p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center">
                  <DollarSign className="w-6 h-6 text-emerald-600" />
                </div>
                <div className={`flex items-center gap-1 text-sm font-medium ${
                  (data?.revenue.growth || 0) >= 0 ? 'text-emerald-600' : 'text-red-600'
                }`}>
                  {(data?.revenue.growth || 0) >= 0 ? (
                    <TrendingUp className="w-4 h-4" />
                  ) : (
                    <TrendingDown className="w-4 h-4" />
                  )}
                  {Math.abs(data?.revenue.growth || 0).toFixed(1)}%
                </div>
              </div>
              <p className="text-3xl font-bold text-slate-900">${(data?.revenue.thisMonth || 0).toLocaleString()}</p>
              <p className="text-sm text-slate-500">Revenue this month</p>
              <p className="text-xs text-slate-400 mt-1">Total: ${(data?.revenue.total || 0).toLocaleString()}</p>
            </div>

            {/* Bookings Card */}
            <div className="bg-white rounded-2xl shadow-lg border border-slate-200/50 p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                  <Package className="w-6 h-6 text-blue-600" />
                </div>
                <div className={`flex items-center gap-1 text-sm font-medium ${
                  (data?.bookings.growth || 0) >= 0 ? 'text-emerald-600' : 'text-red-600'
                }`}>
                  {(data?.bookings.growth || 0) >= 0 ? (
                    <TrendingUp className="w-4 h-4" />
                  ) : (
                    <TrendingDown className="w-4 h-4" />
                  )}
                  {Math.abs(data?.bookings.growth || 0).toFixed(1)}%
                </div>
              </div>
              <p className="text-3xl font-bold text-slate-900">{data?.bookings.thisMonth || 0}</p>
              <p className="text-sm text-slate-500">Bookings this month</p>
              <p className="text-xs text-slate-400 mt-1">Total: {data?.bookings.total || 0}</p>
            </div>

            {/* Active Agencies */}
            <div className="bg-white rounded-2xl shadow-lg border border-slate-200/50 p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                  <Users className="w-6 h-6 text-purple-600" />
                </div>
              </div>
              <p className="text-3xl font-bold text-slate-900">{data?.agencies.active || 0}</p>
              <p className="text-sm text-slate-500">Active agencies</p>
              <p className="text-xs text-slate-400 mt-1">+{data?.agencies.new || 0} new this month</p>
            </div>

            {/* Avg. Booking Value */}
            <div className="bg-white rounded-2xl shadow-lg border border-slate-200/50 p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-amber-100 rounded-xl flex items-center justify-center">
                  <BarChart3 className="w-6 h-6 text-amber-600" />
                </div>
              </div>
              <p className="text-3xl font-bold text-slate-900">
                ${data?.bookings.total ? Math.round((data?.revenue.total || 0) / data.bookings.total) : 0}
              </p>
              <p className="text-sm text-slate-500">Avg. booking value</p>
            </div>
          </div>

          <div className="grid lg:grid-cols-2 gap-6 mb-8">
            {/* Monthly Revenue Chart (Simplified) */}
            <div className="bg-white rounded-2xl shadow-lg border border-slate-200/50 p-6">
              <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-emerald-500" />
                Monthly Revenue
              </h3>
              <div className="space-y-3">
                {(data?.monthlyRevenue || []).slice(0, 6).map((month, index) => (
                  <div key={index}>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-slate-600">{month.month}</span>
                      <span className="font-medium text-slate-900">${month.revenue.toLocaleString()}</span>
                    </div>
                    <div className="h-3 bg-slate-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full"
                        style={{
                          width: `${Math.min((month.revenue / Math.max(...(data?.monthlyRevenue || []).map(m => m.revenue), 1)) * 100, 100)}%`
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Category Breakdown */}
            <div className="bg-white rounded-2xl shadow-lg border border-slate-200/50 p-6">
              <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
                <PieChart className="w-5 h-5 text-blue-500" />
                Bookings by Category
              </h3>
              <div className="space-y-3">
                {(data?.categoryBreakdown || []).map((cat, index) => {
                  const colors = ['bg-emerald-500', 'bg-blue-500', 'bg-purple-500', 'bg-amber-500', 'bg-pink-500', 'bg-cyan-500'];
                  return (
                    <div key={index}>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-slate-600 capitalize">{cat.category}</span>
                        <span className="font-medium text-slate-900">{cat.bookings} ({cat.percentage}%)</span>
                      </div>
                      <div className="h-3 bg-slate-100 rounded-full overflow-hidden">
                        <div
                          className={`h-full ${colors[index % colors.length]} rounded-full`}
                          style={{ width: `${cat.percentage}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          <div className="grid lg:grid-cols-2 gap-6">
            {/* Top Tours */}
            <div className="bg-white rounded-2xl shadow-lg border border-slate-200/50 overflow-hidden">
              <div className="p-6 border-b border-slate-200">
                <h3 className="text-lg font-bold text-slate-900">Top Performing Tours</h3>
              </div>
              <div className="divide-y divide-slate-100">
                {(data?.topTours || []).slice(0, 5).map((tour, index) => (
                  <div key={index} className="p-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className="w-8 h-8 bg-slate-100 rounded-lg flex items-center justify-center text-sm font-bold text-slate-600">
                        #{index + 1}
                      </span>
                      <div>
                        <p className="font-medium text-slate-900">{tour.name}</p>
                        <p className="text-sm text-slate-500">{tour.bookings} bookings</p>
                      </div>
                    </div>
                    <p className="font-semibold text-emerald-600">${tour.revenue.toLocaleString()}</p>
                  </div>
                ))}
                {(!data?.topTours || data.topTours.length === 0) && (
                  <div className="p-8 text-center text-slate-500">No tour data available</div>
                )}
              </div>
            </div>

            {/* Top Agencies */}
            <div className="bg-white rounded-2xl shadow-lg border border-slate-200/50 overflow-hidden">
              <div className="p-6 border-b border-slate-200">
                <h3 className="text-lg font-bold text-slate-900">Top Agencies</h3>
              </div>
              <div className="divide-y divide-slate-100">
                {(data?.topAgencies || []).slice(0, 5).map((agency, index) => (
                  <div key={index} className="p-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center text-sm font-bold text-purple-600">
                        #{index + 1}
                      </span>
                      <div>
                        <p className="font-medium text-slate-900">{agency.name}</p>
                        <p className="text-sm text-slate-500">{agency.bookings} bookings</p>
                      </div>
                    </div>
                    <p className="font-semibold text-emerald-600">${agency.revenue.toLocaleString()}</p>
                  </div>
                ))}
                {(!data?.topAgencies || data.topAgencies.length === 0) && (
                  <div className="p-8 text-center text-slate-500">No agency data available</div>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </>
  );
};

export default B2BAnalytics;
