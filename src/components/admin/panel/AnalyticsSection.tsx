import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Progress } from '@/components/ui/progress';
import { 
  TrendingUp, 
  TrendingDown, 
  Users, 
  Eye, 
  Clock, 
  Globe,
  DollarSign,
  MapPin,
  Calendar,
  BarChart3,
  PieChart,
  Activity,
  Target,
  Zap,
  ArrowUpRight,
  ArrowDownRight,
  Download,
  Filter
} from 'lucide-react';

interface AnalyticsData {
  visitors: {
    total: number;
    growth: number;
    unique: number;
    returning: number;
  };
  pageViews: {
    total: number;
    growth: number;
    avgPerSession: number;
  };
  engagement: {
    sessionTime: string;
    sessionTimeGrowth: number;
    bounceRate: string;
    bounceRateGrowth: number;
    conversionRate: number;
  };
  revenue: {
    total: number;
    growth: number;
    avgOrderValue: number;
    transactions: number;
  };
  topDestinations: Array<{
    name: string;
    views: number;
    bookings: number;
    revenue: number;
    growth: number;
  }>;
  topPages: Array<{
    path: string;
    title: string;
    views: number;
    uniqueViews: number;
    avgTime: string;
  }>;
  userBehavior: Array<{
    metric: string;
    value: string;
    change: number;
    trend: 'up' | 'down';
  }>;
  recentActivity: Array<{
    time: string;
    event: string;
    type: 'booking' | 'user' | 'analytics' | 'contact' | 'review' | 'payment';
    user?: string;
    value?: string;
  }>;
}

const AnalyticsSection: React.FC = () => {
  const [timeRange, setTimeRange] = useState('30d');
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadAnalyticsData();
  }, [timeRange]);

  const loadAnalyticsData = async () => {
    setLoading(true);
    // Mock data - replace with actual API call
    const mockData: AnalyticsData = {
      visitors: {
        total: 12543,
        growth: 8.2,
        unique: 8921,
        returning: 3622
      },
      pageViews: {
        total: 34567,
        growth: -2.1,
        avgPerSession: 2.8
      },
      engagement: {
        sessionTime: '3m 45s',
        sessionTimeGrowth: 12.5,
        bounceRate: '42%',
        bounceRateGrowth: -5.3,
        conversionRate: 3.2
      },
      revenue: {
        total: 125000,
        growth: 15.7,
        avgOrderValue: 450,
        transactions: 278
      },
      topDestinations: [
        { name: 'Sigiriya', views: 3456, bookings: 156, revenue: 25000, growth: 15 },
        { name: 'Kandy', views: 2789, bookings: 134, revenue: 22000, growth: 12 },
        { name: 'Galle', views: 2134, bookings: 98, revenue: 18000, growth: 8 },
        { name: 'Ella', views: 1876, bookings: 87, revenue: 15000, growth: 20 },
        { name: 'Mirissa', views: 1543, bookings: 76, revenue: 12000, growth: 5 }
      ],
      topPages: [
        { path: '/tours/sri-lanka-highlights', title: 'Sri Lanka Highlights Tour', views: 3456, uniqueViews: 2890, avgTime: '4m 12s' },
        { path: '/destinations/sigiriya', title: 'Sigiriya Rock Fortress', views: 2789, uniqueViews: 2345, avgTime: '3m 45s' },
        { path: '/hotels/colombo', title: 'Hotels in Colombo', views: 2134, uniqueViews: 1876, avgTime: '2m 30s' },
        { path: '/about/sri-lanka', title: 'About Sri Lanka', views: 1876, uniqueViews: 1654, avgTime: '3m 15s' },
        { path: '/contact', title: 'Contact Us', views: 1543, uniqueViews: 1432, avgTime: '1m 45s' }
      ],
      userBehavior: [
        { metric: 'Mobile Users', value: '68%', change: 5.2, trend: 'up' },
        { metric: 'Desktop Users', value: '32%', change: -2.1, trend: 'down' },
        { metric: 'Direct Traffic', value: '45%', change: 8.7, trend: 'up' },
        { metric: 'Organic Search', value: '35%', change: 12.3, trend: 'up' },
        { metric: 'Social Media', value: '20%', change: -1.5, trend: 'down' }
      ],
      recentActivity: [
        { time: '2 minutes ago', event: 'New booking received', type: 'booking', user: 'John Doe', value: '$1,250' },
        { time: '5 minutes ago', event: 'User registered from Australia', type: 'user', user: 'Sarah Smith' },
        { time: '12 minutes ago', event: 'Page view spike detected', type: 'analytics', value: '+45%' },
        { time: '18 minutes ago', event: 'Contact form submitted', type: 'contact', user: 'Mike Johnson' },
        { time: '25 minutes ago', event: 'New review posted', type: 'review', user: 'Emma Wilson' },
        { time: '32 minutes ago', event: 'Payment processed', type: 'payment', user: 'David Brown', value: '$850' }
      ]
    };

    setTimeout(() => {
      setAnalyticsData(mockData);
      setLoading(false);
    }, 1000);
  };

  const getGrowthIcon = (growth: number) => {
    return growth > 0 ? (
      <ArrowUpRight className="w-4 h-4 text-green-500" />
    ) : (
      <ArrowDownRight className="w-4 h-4 text-red-500" />
    );
  };

  const getGrowthColor = (growth: number) => {
    return growth > 0 ? 'text-green-600' : 'text-red-600';
  };

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'booking': return <Calendar className="w-4 h-4 text-blue-600" />;
      case 'user': return <Users className="w-4 h-4 text-green-600" />;
      case 'analytics': return <BarChart3 className="w-4 h-4 text-purple-600" />;
      case 'contact': return <Globe className="w-4 h-4 text-orange-600" />;
      case 'review': return <Eye className="w-4 h-4 text-yellow-600" />;
      case 'payment': return <DollarSign className="w-4 h-4 text-green-600" />;
      default: return <Activity className="w-4 h-4 text-gray-600" />;
    }
  };

  const exportAnalytics = () => {
    // Implementation for exporting analytics data
    console.log('Exporting analytics...');
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold">Analytics</h2>
          <div className="animate-pulse bg-gray-200 h-8 w-32 rounded"></div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <Card key={i}>
              <CardContent className="p-6">
                <div className="animate-pulse">
                  <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                  <div className="h-8 bg-gray-200 rounded w-1/2"></div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (!analyticsData) return null;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Analytics Dashboard</h2>
          <p className="text-gray-600">Comprehensive insights into your website performance</p>
        </div>
        <div className="flex items-center gap-3">
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-[140px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7d">Last 7 days</SelectItem>
              <SelectItem value="30d">Last 30 days</SelectItem>
              <SelectItem value="90d">Last 90 days</SelectItem>
              <SelectItem value="1y">Last year</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" onClick={exportAnalytics}>
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Total Visitors</CardTitle>
            <Users className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">{analyticsData.visitors.total.toLocaleString()}</div>
            <div className="flex items-center gap-1 text-xs mt-2">
              {getGrowthIcon(analyticsData.visitors.growth)}
              <span className={getGrowthColor(analyticsData.visitors.growth)}>
                {Math.abs(analyticsData.visitors.growth)}% from last period
              </span>
            </div>
            <div className="text-xs text-gray-500 mt-1">
              {analyticsData.visitors.unique.toLocaleString()} unique, {analyticsData.visitors.returning.toLocaleString()} returning
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Page Views</CardTitle>
            <Eye className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">{analyticsData.pageViews.total.toLocaleString()}</div>
            <div className="flex items-center gap-1 text-xs mt-2">
              {getGrowthIcon(analyticsData.pageViews.growth)}
              <span className={getGrowthColor(analyticsData.pageViews.growth)}>
                {Math.abs(analyticsData.pageViews.growth)}% from last period
              </span>
            </div>
            <div className="text-xs text-gray-500 mt-1">
              {analyticsData.pageViews.avgPerSession} avg per session
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">${analyticsData.revenue.total.toLocaleString()}</div>
            <div className="flex items-center gap-1 text-xs mt-2">
              {getGrowthIcon(analyticsData.revenue.growth)}
              <span className={getGrowthColor(analyticsData.revenue.growth)}>
                {Math.abs(analyticsData.revenue.growth)}% from last period
              </span>
            </div>
            <div className="text-xs text-gray-500 mt-1">
              ${analyticsData.revenue.avgOrderValue} avg order, {analyticsData.revenue.transactions} transactions
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Conversion Rate</CardTitle>
            <Target className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">{analyticsData.engagement.conversionRate}%</div>
            <Progress value={analyticsData.engagement.conversionRate} className="mt-2" />
            <div className="text-xs text-gray-500 mt-1">
              {analyticsData.engagement.sessionTime} avg session time
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Engagement Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-blue-600" />
              Session Time
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-blue-600">{analyticsData.engagement.sessionTime}</div>
            <div className="flex items-center gap-1 text-sm mt-2">
              {getGrowthIcon(analyticsData.engagement.sessionTimeGrowth)}
              <span className={getGrowthColor(analyticsData.engagement.sessionTimeGrowth)}>
                {Math.abs(analyticsData.engagement.sessionTimeGrowth)}% from last period
              </span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Globe className="h-5 w-5 text-purple-600" />
              Bounce Rate
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-purple-600">{analyticsData.engagement.bounceRate}</div>
            <div className="flex items-center gap-1 text-sm mt-2">
              {getGrowthIcon(analyticsData.engagement.bounceRateGrowth)}
              <span className={getGrowthColor(analyticsData.engagement.bounceRateGrowth)}>
                {Math.abs(analyticsData.engagement.bounceRateGrowth)}% from last period
              </span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Zap className="h-5 w-5 text-green-600" />
              Performance Score
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-600">92</div>
            <Progress value={92} className="mt-2" />
            <div className="text-sm text-gray-600 mt-2">Lighthouse score</div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Destinations */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="h-5 w-5 text-green-600" />
              Top Performing Destinations
            </CardTitle>
            <CardContent className="pt-0">
              <p className="text-sm text-gray-600">Most viewed and booked destinations</p>
            </CardContent>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {analyticsData.topDestinations.map((destination, index) => (
                <div key={destination.name} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                      <span className="text-sm font-bold text-blue-600">{index + 1}</span>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">{destination.name}</p>
                      <p className="text-xs text-gray-600">{destination.views.toLocaleString()} views</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-green-600">${destination.revenue.toLocaleString()}</p>
                    <p className="text-xs text-green-600">+{destination.growth}%</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* User Behavior */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5 text-purple-600" />
              User Behavior
            </CardTitle>
            <CardContent className="pt-0">
              <p className="text-sm text-gray-600">Traffic sources and user demographics</p>
            </CardContent>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {analyticsData.userBehavior.map((behavior) => (
                <div key={behavior.metric} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`w-3 h-3 rounded-full ${
                      behavior.trend === 'up' ? 'bg-green-500' : 'bg-red-500'
                    }`}></div>
                    <span className="text-sm font-medium">{behavior.metric}</span>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium">{behavior.value}</p>
                    <p className={`text-xs ${behavior.trend === 'up' ? 'text-green-600' : 'text-red-600'}`}>
                      {behavior.trend === 'up' ? '+' : ''}{behavior.change}%
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Pages */}
        <Card>
          <CardHeader>
            <CardTitle>Top Pages</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {analyticsData.topPages.map((page, index) => (
                <div key={page.path} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{page.title}</p>
                    <p className="text-xs text-gray-600 truncate">{page.path}</p>
                    <p className="text-xs text-gray-500">{page.avgTime} avg time</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary" className="text-xs">
                      #{index + 1}
                    </Badge>
                    <span className="text-sm font-medium">{page.views.toLocaleString()}</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {analyticsData.recentActivity.map((activity, index) => (
                <div key={index} className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                  <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center">
                    {getActivityIcon(activity.type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium">{activity.event}</p>
                    <div className="flex items-center gap-2 mt-1">
                      {activity.user && (
                        <span className="text-xs text-gray-600">by {activity.user}</span>
                      )}
                      {activity.value && (
                        <Badge variant="outline" className="text-xs">{activity.value}</Badge>
                      )}
                    </div>
                    <p className="text-xs text-gray-500 mt-1">{activity.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AnalyticsSection;