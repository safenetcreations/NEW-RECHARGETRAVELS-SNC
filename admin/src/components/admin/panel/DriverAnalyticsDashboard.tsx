import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  BarChart3,
  TrendingUp,
  Users,
  Car,
  Star,
  DollarSign,
  Calendar,
  RefreshCw,
  ArrowUpRight,
  ArrowDownRight,
  CheckCircle,
  Clock,
  Award,
  Target
} from 'lucide-react';
import { toast } from 'sonner';
import { firebaseDriverService } from '@/services/firebaseDriverService';
import {
  getPlatformRevenueSummary,
  getAllSettlements,
  formatCurrency
} from '@/services/firebaseCommissionService';

interface AnalyticsData {
  totalDrivers: number;
  verifiedDrivers: number;
  pendingDrivers: number;
  suspendedDrivers: number;
  averageRating: number;
  totalTrips: number;
  totalRevenue: number;
  platformFees: number;
  commissions: number;
  bonusesPaid: number;
  netRevenue: number;
}

interface TimeRange {
  label: string;
  startDate: string;
  endDate: string;
}

const DriverAnalyticsDashboard: React.FC = () => {
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [timeRange, setTimeRange] = useState('this_month');
  const [comparisonData, setComparisonData] = useState<{
    driverGrowth: number;
    revenueGrowth: number;
    tripGrowth: number;
  } | null>(null);

  const getTimeRange = (range: string): TimeRange => {
    const now = new Date();
    let startDate: Date;
    let endDate = now;
    let label = '';

    switch (range) {
      case 'today':
        startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        label = 'Today';
        break;
      case 'this_week':
        startDate = new Date(now);
        startDate.setDate(now.getDate() - now.getDay());
        label = 'This Week';
        break;
      case 'this_month':
        startDate = new Date(now.getFullYear(), now.getMonth(), 1);
        label = 'This Month';
        break;
      case 'last_month':
        startDate = new Date(now.getFullYear(), now.getMonth() - 1, 1);
        endDate = new Date(now.getFullYear(), now.getMonth(), 0);
        label = 'Last Month';
        break;
      case 'this_quarter': {
        const quarter = Math.floor(now.getMonth() / 3);
        startDate = new Date(now.getFullYear(), quarter * 3, 1);
        label = 'This Quarter';
        break;
      }
      case 'this_year':
        startDate = new Date(now.getFullYear(), 0, 1);
        label = 'This Year';
        break;
      default:
        startDate = new Date(now.getFullYear(), now.getMonth(), 1);
        label = 'This Month';
    }

    return {
      label,
      startDate: startDate.toISOString().split('T')[0],
      endDate: endDate.toISOString().split('T')[0]
    };
  };

  useEffect(() => {
    loadAnalytics();
  }, [timeRange]);

  const loadAnalytics = async () => {
    setIsLoading(true);
    try {
      const range = getTimeRange(timeRange);

      // Fetch driver stats
      const driverStats = await firebaseDriverService.getDriverStats();

      // Fetch all drivers to calculate average rating
      const allDrivers = await firebaseDriverService.getAllDrivers();
      const ratingsSum = allDrivers.reduce((sum, d) => sum + (d.average_rating || 5), 0);
      const averageRating = allDrivers.length > 0 ? ratingsSum / allDrivers.length : 5.0;

      // Fetch revenue data
      const revenueSummary = await getPlatformRevenueSummary(range.startDate, range.endDate);

      // Fetch settlements for trip count
      const settlements = await getAllSettlements();
      const periodSettlements = settlements.filter(s =>
        s.period_start >= range.startDate && s.period_end <= range.endDate
      );
      const totalTrips = periodSettlements.reduce((sum, s) => sum + s.total_trips, 0);

      setAnalytics({
        totalDrivers: driverStats.total,
        verifiedDrivers: driverStats.verified,
        pendingDrivers: driverStats.pending,
        suspendedDrivers: driverStats.suspended,
        averageRating,
        totalTrips,
        totalRevenue: revenueSummary.totalRevenue,
        platformFees: revenueSummary.platformFees,
        commissions: revenueSummary.commissions,
        bonusesPaid: revenueSummary.bonusesPaid,
        netRevenue: revenueSummary.netRevenue
      });

      // Mock comparison data (in production, compare with previous period)
      setComparisonData({
        driverGrowth: 12.5,
        revenueGrowth: 8.3,
        tripGrowth: 15.2
      });

      toast.success('Analytics loaded successfully');
    } catch (error) {
      console.error('Error loading analytics:', error);
      toast.error('Failed to load analytics');
    } finally {
      setIsLoading(false);
    }
  };

  const StatCard: React.FC<{
    title: string;
    value: string | number;
    subtitle?: string;
    icon: React.ReactNode;
    trend?: number;
    color: string;
  }> = ({ title, value, subtitle, icon, trend, color }) => (
    <Card className="shadow-md hover:shadow-lg transition-shadow">
      <CardContent className="pt-6">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-sm text-gray-500 mb-1">{title}</p>
            <p className="text-2xl font-bold text-gray-900">{value}</p>
            {subtitle && (
              <p className="text-xs text-gray-500 mt-1">{subtitle}</p>
            )}
            {trend !== undefined && (
              <div className={`flex items-center gap-1 mt-2 text-sm ${trend >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {trend >= 0 ? (
                  <ArrowUpRight className="w-4 h-4" />
                ) : (
                  <ArrowDownRight className="w-4 h-4" />
                )}
                <span>{Math.abs(trend).toFixed(1)}% vs last period</span>
              </div>
            )}
          </div>
          <div className={`p-3 rounded-xl ${color}`}>
            {icon}
          </div>
        </div>
      </CardContent>
    </Card>
  );

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="border-0 shadow-lg bg-gradient-to-br from-purple-50 to-indigo-50">
        <CardHeader>
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <CardTitle className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                <BarChart3 className="w-6 h-6 text-indigo-600" />
                Driver Analytics Dashboard
              </CardTitle>
              <p className="text-gray-600 mt-1">
                Platform performance metrics and driver statistics
              </p>
            </div>
            <div className="flex gap-3">
              <Select value={timeRange} onValueChange={setTimeRange}>
                <SelectTrigger className="w-44">
                  <Calendar className="w-4 h-4 mr-2" />
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="today">Today</SelectItem>
                  <SelectItem value="this_week">This Week</SelectItem>
                  <SelectItem value="this_month">This Month</SelectItem>
                  <SelectItem value="last_month">Last Month</SelectItem>
                  <SelectItem value="this_quarter">This Quarter</SelectItem>
                  <SelectItem value="this_year">This Year</SelectItem>
                </SelectContent>
              </Select>
              <Button
                variant="outline"
                onClick={loadAnalytics}
                className="border-gray-300"
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                Refresh
              </Button>
            </div>
          </div>
        </CardHeader>
      </Card>

      {analytics && (
        <>
          {/* Driver Stats Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard
              title="Total Drivers"
              value={analytics.totalDrivers}
              subtitle={`${analytics.verifiedDrivers} verified`}
              icon={<Users className="w-6 h-6 text-blue-600" />}
              trend={comparisonData?.driverGrowth}
              color="bg-blue-100"
            />
            <StatCard
              title="Verified Drivers"
              value={analytics.verifiedDrivers}
              subtitle={`${((analytics.verifiedDrivers / Math.max(analytics.totalDrivers, 1)) * 100).toFixed(0)}% of total`}
              icon={<CheckCircle className="w-6 h-6 text-green-600" />}
              color="bg-green-100"
            />
            <StatCard
              title="Pending Verification"
              value={analytics.pendingDrivers}
              subtitle="Awaiting review"
              icon={<Clock className="w-6 h-6 text-yellow-600" />}
              color="bg-yellow-100"
            />
            <StatCard
              title="Average Rating"
              value={analytics.averageRating.toFixed(2)}
              subtitle="Out of 5.0 stars"
              icon={<Star className="w-6 h-6 text-amber-600" />}
              color="bg-amber-100"
            />
          </div>

          {/* Revenue Stats Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard
              title="Total Revenue"
              value={formatCurrency(analytics.totalRevenue)}
              subtitle="Platform fees + commission"
              icon={<DollarSign className="w-6 h-6 text-green-600" />}
              trend={comparisonData?.revenueGrowth}
              color="bg-green-100"
            />
            <StatCard
              title="Platform Fees"
              value={formatCurrency(analytics.platformFees)}
              subtitle="Fixed fee per booking"
              icon={<Target className="w-6 h-6 text-indigo-600" />}
              color="bg-indigo-100"
            />
            <StatCard
              title="Commissions"
              value={formatCurrency(analytics.commissions)}
              subtitle="Percentage of bookings"
              icon={<TrendingUp className="w-6 h-6 text-purple-600" />}
              color="bg-purple-100"
            />
            <StatCard
              title="Bonuses Paid"
              value={formatCurrency(analytics.bonusesPaid)}
              subtitle="Driver incentives"
              icon={<Award className="w-6 h-6 text-orange-600" />}
              color="bg-orange-100"
            />
          </div>

          {/* Performance Stats Row */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <StatCard
              title="Total Trips"
              value={analytics.totalTrips}
              subtitle={`${getTimeRange(timeRange).label}`}
              icon={<Car className="w-6 h-6 text-teal-600" />}
              trend={comparisonData?.tripGrowth}
              color="bg-teal-100"
            />
            <StatCard
              title="Net Revenue"
              value={formatCurrency(analytics.netRevenue)}
              subtitle="After bonuses"
              icon={<DollarSign className="w-6 h-6 text-emerald-600" />}
              color="bg-emerald-100"
            />
            <StatCard
              title="Suspended Drivers"
              value={analytics.suspendedDrivers}
              subtitle="Under review"
              icon={<Users className="w-6 h-6 text-red-600" />}
              color="bg-red-100"
            />
          </div>

          {/* Driver Distribution */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Driver Status Distribution */}
            <Card className="shadow-md">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Users className="w-5 h-5 text-indigo-600" />
                  Driver Status Distribution
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    { label: 'Verified', count: analytics.verifiedDrivers, color: 'bg-green-500', percent: (analytics.verifiedDrivers / Math.max(analytics.totalDrivers, 1)) * 100 },
                    { label: 'Pending', count: analytics.pendingDrivers, color: 'bg-yellow-500', percent: (analytics.pendingDrivers / Math.max(analytics.totalDrivers, 1)) * 100 },
                    { label: 'Suspended', count: analytics.suspendedDrivers, color: 'bg-red-500', percent: (analytics.suspendedDrivers / Math.max(analytics.totalDrivers, 1)) * 100 },
                  ].map((item) => (
                    <div key={item.label}>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-gray-600">{item.label}</span>
                        <span className="font-medium">{item.count} ({item.percent.toFixed(1)}%)</span>
                      </div>
                      <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
                        <div
                          className={`h-full ${item.color} transition-all duration-500`}
                          style={{ width: `${item.percent}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Revenue Breakdown */}
            <Card className="shadow-md">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <DollarSign className="w-5 h-5 text-green-600" />
                  Revenue Breakdown
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    { label: 'Platform Fees', amount: analytics.platformFees, color: 'bg-indigo-500', percent: (analytics.platformFees / Math.max(analytics.totalRevenue, 1)) * 100 },
                    { label: 'Commissions', amount: analytics.commissions, color: 'bg-purple-500', percent: (analytics.commissions / Math.max(analytics.totalRevenue, 1)) * 100 },
                    { label: 'Bonuses (Expense)', amount: analytics.bonusesPaid, color: 'bg-orange-500', percent: (analytics.bonusesPaid / Math.max(analytics.totalRevenue, 1)) * 100 },
                  ].map((item) => (
                    <div key={item.label}>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-gray-600">{item.label}</span>
                        <span className="font-medium">{formatCurrency(item.amount)}</span>
                      </div>
                      <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
                        <div
                          className={`h-full ${item.color} transition-all duration-500`}
                          style={{ width: `${Math.min(item.percent, 100)}%` }}
                        />
                      </div>
                    </div>
                  ))}
                  <div className="pt-4 border-t">
                    <div className="flex justify-between">
                      <span className="font-semibold text-gray-800">Net Revenue</span>
                      <span className="font-bold text-green-600">{formatCurrency(analytics.netRevenue)}</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Quick Actions */}
          <Card className="shadow-md">
            <CardHeader>
              <CardTitle className="text-lg">Quick Actions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <Button
                  variant="outline"
                  className="h-auto py-4 flex flex-col items-center gap-2"
                  onClick={() => window.location.hash = '#driver-verification'}
                >
                  <CheckCircle className="w-6 h-6 text-green-600" />
                  <span>Review Pending</span>
                  <span className="text-xs text-gray-500">{analytics.pendingDrivers} waiting</span>
                </Button>
                <Button
                  variant="outline"
                  className="h-auto py-4 flex flex-col items-center gap-2"
                  onClick={() => window.location.hash = '#payment-settlements'}
                >
                  <DollarSign className="w-6 h-6 text-green-600" />
                  <span>Process Payouts</span>
                  <span className="text-xs text-gray-500">View pending</span>
                </Button>
                <Button
                  variant="outline"
                  className="h-auto py-4 flex flex-col items-center gap-2"
                  onClick={() => window.location.hash = '#commission-settings'}
                >
                  <Target className="w-6 h-6 text-indigo-600" />
                  <span>Commission Settings</span>
                  <span className="text-xs text-gray-500">Configure rates</span>
                </Button>
                <Button
                  variant="outline"
                  className="h-auto py-4 flex flex-col items-center gap-2"
                  onClick={() => window.location.hash = '#drivers'}
                >
                  <Users className="w-6 h-6 text-blue-600" />
                  <span>Manage Drivers</span>
                  <span className="text-xs text-gray-500">{analytics.totalDrivers} total</span>
                </Button>
              </div>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
};

export default DriverAnalyticsDashboard;
