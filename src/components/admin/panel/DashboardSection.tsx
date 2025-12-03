
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Users, 
  Hotel, 
  DollarSign, 
  Calendar, 
  FileText, 
  Sparkles,
  TrendingUp,
  ArrowRight,
  MapPin,
  Car,
  Plane,
  Star,
  MessageSquare,
  AlertCircle,
  CheckCircle,
  Clock,
  Eye,
  Plus,
  Settings,
  BarChart3,
  Activity,
  Target,
  Zap,
  Route,
  Newspaper,
  RefreshCw,
  Loader2
} from 'lucide-react';
import { httpsCallable } from 'firebase/functions';
import { functions } from '@/lib/firebase';
import { toast } from 'sonner';
import { Link } from 'react-router-dom';

const DashboardSection: React.FC = () => {
  const [stats, setStats] = useState({
    totalBookings: 0,
    pendingBookings: 0,
    totalRevenue: 0,
    totalUsers: 0,
    totalHotels: 0,
    totalTours: 0,
    totalDestinations: 0,
    totalDrivers: 0,
    totalVehicles: 0,
    totalReviews: 0,
    monthlyGrowth: 0,
    conversionRate: 0
  });

  const [recentActivities, setRecentActivities] = useState([]);
  const [topDestinations, setTopDestinations] = useState([]);
  const [systemHealth, setSystemHealth] = useState({
    status: 'healthy',
    uptime: '99.9%',
    lastBackup: '2 hours ago',
    activeUsers: 45
  });

  const [fetchingNews, setFetchingNews] = useState(false);
  const [newsResult, setNewsResult] = useState<{ total: number; sources: number } | null>(null);

  const fetchNews = async () => {
    setFetchingNews(true);
    try {
      const manualFetch = httpsCallable(functions, 'manualNewsFetch');
      const result = await manualFetch();
      const data = result.data as { total: number; sources: number };
      setNewsResult(data);
      toast.success(`Fetched ${data.total} articles from ${data.sources} sources!`);
    } catch (error: any) {
      console.error('Error fetching news:', error);
      toast.error(error.message || 'Failed to fetch news');
    } finally {
      setFetchingNews(false);
    }
  };

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    // Mock data - replace with actual API calls
    setStats({
      totalBookings: 1247,
      pendingBookings: 23,
      totalRevenue: 125000,
      totalUsers: 892,
      totalHotels: 245,
      totalTours: 156,
      totalDestinations: 18,
      totalDrivers: 67,
      totalVehicles: 89,
      totalReviews: 342,
      monthlyGrowth: 12.5,
      conversionRate: 8.7
    });

    setRecentActivities([
      { id: 1, type: 'booking', action: 'New booking received', user: 'John Doe', time: '2 minutes ago', status: 'pending' },
      { id: 2, type: 'user', action: 'User registration', user: 'Sarah Smith', time: '5 minutes ago', status: 'completed' },
      { id: 3, type: 'payment', action: 'Payment processed', user: 'Mike Johnson', time: '10 minutes ago', status: 'completed' },
      { id: 4, type: 'review', action: 'New review posted', user: 'Emma Wilson', time: '15 minutes ago', status: 'pending' },
      { id: 5, type: 'hotel', action: 'Hotel registration', user: 'Grand Hotel', time: '1 hour ago', status: 'completed' }
    ]);

    setTopDestinations([
      { name: 'Sigiriya', bookings: 156, revenue: 25000, growth: 15 },
      { name: 'Kandy', bookings: 134, revenue: 22000, growth: 12 },
      { name: 'Galle', bookings: 98, revenue: 18000, growth: 8 },
      { name: 'Ella', bookings: 87, revenue: 15000, growth: 20 },
      { name: 'Mirissa', bookings: 76, revenue: 12000, growth: 5 }
    ]);
  };

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'booking': return <Calendar className="h-4 w-4 text-blue-600" />;
      case 'user': return <Users className="h-4 w-4 text-green-600" />;
      case 'payment': return <DollarSign className="h-4 w-4 text-purple-600" />;
      case 'review': return <MessageSquare className="h-4 w-4 text-orange-600" />;
      case 'hotel': return <Hotel className="h-4 w-4 text-teal-600" />;
      default: return <Activity className="h-4 w-4 text-gray-600" />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed': return <Badge className="bg-green-100 text-green-800">Completed</Badge>;
      case 'pending': return <Badge className="bg-yellow-100 text-yellow-800">Pending</Badge>;
      case 'failed': return <Badge className="bg-red-100 text-red-800">Failed</Badge>;
      default: return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const mainStats = [
    {
      title: "Total Bookings",
      value: stats.totalBookings.toLocaleString(),
      icon: Calendar,
      change: "+12%",
      changeType: "positive",
      color: "text-blue-600"
    },
    {
      title: "Total Revenue",
      value: `$${stats.totalRevenue.toLocaleString()}`,
      icon: DollarSign,
      change: "+8.5%",
      changeType: "positive",
      color: "text-green-600"
    },
    {
      title: "Active Users",
      value: stats.totalUsers.toLocaleString(),
      icon: Users,
      change: "+5.2%",
      changeType: "positive",
      color: "text-purple-600"
    },
    {
      title: "Pending Bookings",
      value: stats.pendingBookings.toString(),
      icon: Clock,
      change: "-3%",
      changeType: "negative",
      color: "text-orange-600"
    }
  ];

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">Welcome back, Admin!</h1>
            <p className="text-blue-100">Here's what's happening with Recharge Travels today</p>
          </div>
          <div className="text-right">
            <p className="text-sm text-blue-200">System Status</p>
            <Badge className="bg-green-500 text-white">
              <CheckCircle className="w-3 h-3 mr-1" />
              All Systems Operational
            </Badge>
          </div>
        </div>
      </div>

      {/* AI Content Generator Highlight */}
      <Card className="bg-gradient-to-r from-purple-50 to-pink-50 border-purple-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-purple-600" />
            AI Content Generator
          </CardTitle>
          <CardDescription>
            Generate SEO-optimized content for destinations, tours, and blog posts
          </CardDescription>
        </CardHeader>
        <CardContent className="flex items-center justify-between">
          <div className="flex items-center gap-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">24</div>
              <p className="text-sm text-gray-600">AI-Generated Posts</p>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">156</div>
              <p className="text-sm text-gray-600">Destination Descriptions</p>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">89</div>
              <p className="text-sm text-gray-600">Tour Packages</p>
            </div>
          </div>
          <div className="flex gap-2">
            <Button className="bg-purple-600 hover:bg-purple-700">
              <Sparkles className="h-4 w-4 mr-2" />
              Generate Content
            </Button>
            <Button variant="outline">
              <Eye className="h-4 w-4 mr-2" />
              View All
            </Button>
          </div>
        </CardContent>
      </Card>
      
      {/* Main Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {mainStats.map((stat, index) => {
          const IconComponent = stat.icon;
          return (
            <Card key={index} className="hover:shadow-lg transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">
                  {stat.title}
                </CardTitle>
                <IconComponent className={`h-4 w-4 ${stat.color}`} />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-gray-900">{stat.value}</div>
                <div className="flex items-center gap-2 mt-2">
                  <span className={`text-xs font-medium ${
                    stat.changeType === 'positive' 
                      ? 'text-green-600' 
                      : 'text-red-600'
                  }`}>
                    {stat.change}
                  </span>
                  <span className="text-xs text-gray-500">from last month</span>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Performance Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5 text-blue-600" />
              Conversion Rate
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-blue-600">{stats.conversionRate}%</div>
            <Progress value={stats.conversionRate} className="mt-2" />
            <p className="text-sm text-gray-600 mt-2">Website visitors to bookings</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-green-600" />
              Monthly Growth
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-600">+{stats.monthlyGrowth}%</div>
            <Progress value={stats.monthlyGrowth} className="mt-2" />
            <p className="text-sm text-gray-600 mt-2">Revenue growth this month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Zap className="h-5 w-5 text-purple-600" />
              System Health
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-purple-600">{systemHealth.uptime}</div>
            <p className="text-sm text-gray-600 mt-2">Uptime</p>
            <div className="flex items-center gap-2 mt-2">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span className="text-sm text-green-600">All systems operational</span>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Activities */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5 text-blue-600" />
              Recent Activities
            </CardTitle>
            <CardDescription>Latest system activities and user actions</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivities.map((activity) => (
                <div key={activity.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    {getActivityIcon(activity.type)}
                    <div>
                      <p className="text-sm font-medium text-gray-900">{activity.action}</p>
                      <p className="text-xs text-gray-600">by {activity.user}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-gray-500">{activity.time}</p>
                    {getStatusBadge(activity.status)}
                  </div>
                </div>
              ))}
            </div>
            <Button variant="outline" className="w-full mt-4">
              View All Activities
            </Button>
          </CardContent>
        </Card>

        {/* Top Destinations */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="h-5 w-5 text-green-600" />
              Top Performing Destinations
            </CardTitle>
            <CardDescription>Most popular destinations this month</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {topDestinations.map((destination, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                      <span className="text-sm font-bold text-blue-600">{index + 1}</span>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">{destination.name}</p>
                      <p className="text-xs text-gray-600">{destination.bookings} bookings</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-green-600">${destination.revenue.toLocaleString()}</p>
                    <p className="text-xs text-green-600">+{destination.growth}%</p>
                  </div>
                </div>
              ))}
            </div>
            <Button variant="outline" className="w-full mt-4">
              View All Destinations
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="h-5 w-5 text-orange-600" />
            Quick Actions
          </CardTitle>
          <CardDescription>Common admin tasks and shortcuts</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Link to="/admin?tab=bookings">
              <Button variant="outline" className="w-full h-20 flex flex-col items-center justify-center gap-2">
                <Calendar className="h-6 w-6 text-blue-600" />
                <span className="text-sm">Manage Bookings</span>
              </Button>
            </Link>
            <Link to="/admin?tab=hotels">
              <Button variant="outline" className="w-full h-20 flex flex-col items-center justify-center gap-2">
                <Hotel className="h-6 w-6 text-green-600" />
                <span className="text-sm">Add Hotel</span>
              </Button>
            </Link>
            <Link to="/admin?tab=tours">
              <Button variant="outline" className="w-full h-20 flex flex-col items-center justify-center gap-2">
                <Route className="h-6 w-6 text-purple-600" />
                <span className="text-sm">Create Tour</span>
              </Button>
            </Link>
            <Link to="/admin?tab=users">
              <Button variant="outline" className="w-full h-20 flex flex-col items-center justify-center gap-2">
                <Users className="h-6 w-6 text-orange-600" />
                <span className="text-sm">Manage Users</span>
              </Button>
            </Link>
            <Link to="/content-updater">
              <Button variant="outline" className="w-full h-20 flex flex-col items-center justify-center gap-2">
                <FileText className="h-6 w-6 text-teal-600" />
                <span className="text-sm">Content Manager</span>
              </Button>
            </Link>
            <Link to="/admin?tab=analytics">
              <Button variant="outline" className="w-full h-20 flex flex-col items-center justify-center gap-2">
                <BarChart3 className="h-6 w-6 text-indigo-600" />
                <span className="text-sm">View Analytics</span>
              </Button>
            </Link>
            <Link to="/admin?tab=reviews">
              <Button variant="outline" className="w-full h-20 flex flex-col items-center justify-center gap-2">
                <MessageSquare className="h-6 w-6 text-pink-600" />
                <span className="text-sm">Manage Reviews</span>
              </Button>
            </Link>
            <Link to="/admin?tab=settings">
              <Button variant="outline" className="w-full h-20 flex flex-col items-center justify-center gap-2">
                <Settings className="h-6 w-6 text-gray-600" />
                <span className="text-sm">Site Settings</span>
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>

      {/* Tourism News Aggregator Widget */}
      <Card className="col-span-full bg-gradient-to-br from-orange-50 to-amber-50 border-orange-200">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-orange-500 rounded-xl">
                <Newspaper className="h-6 w-6 text-white" />
              </div>
              <div>
                <CardTitle className="text-orange-900">Tourism News Aggregator</CardTitle>
                <CardDescription className="text-orange-700">
                  Fetch latest tourism news from 10 Sri Lanka news sources
                </CardDescription>
              </div>
            </div>
            <Button 
              onClick={fetchNews}
              disabled={fetchingNews}
              className="bg-orange-500 hover:bg-orange-600 text-white"
            >
              {fetchingNews ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Fetching...
                </>
              ) : (
                <>
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Fetch News Now
                </>
              )}
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white rounded-xl p-4 border border-orange-200">
              <div className="flex items-center gap-3">
                <Clock className="w-5 h-5 text-orange-500" />
                <div>
                  <p className="text-sm text-gray-500">Auto-Fetch Schedule</p>
                  <p className="font-semibold text-gray-900">9:00 AM & 6:00 PM IST</p>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-xl p-4 border border-orange-200">
              <div className="flex items-center gap-3">
                <Activity className="w-5 h-5 text-green-500" />
                <div>
                  <p className="text-sm text-gray-500">News Sources</p>
                  <p className="font-semibold text-gray-900">10 Active Sources</p>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-xl p-4 border border-orange-200">
              <div className="flex items-center gap-3">
                <CheckCircle className="w-5 h-5 text-blue-500" />
                <div>
                  <p className="text-sm text-gray-500">Last Fetch Result</p>
                  <p className="font-semibold text-gray-900">
                    {newsResult ? `${newsResult.total} articles` : 'Not fetched yet'}
                  </p>
                </div>
              </div>
            </div>
          </div>
          {newsResult && (
            <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-xl">
              <div className="flex items-center gap-2 text-green-800">
                <CheckCircle className="w-5 h-5" />
                <span className="font-medium">
                  Successfully fetched {newsResult.total} articles from {newsResult.sources} sources!
                </span>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default DashboardSection;
