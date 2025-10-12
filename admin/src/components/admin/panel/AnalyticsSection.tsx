import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, TrendingDown, Users, Eye, Clock, Globe } from 'lucide-react';

const AnalyticsSection: React.FC = () => {
  const analyticsData = {
    totalVisitors: 12543,
    visitorGrowth: 8.2,
    pageViews: 34567,
    pageViewGrowth: -2.1,
    avgSessionTime: '3m 45s',
    sessionTimeGrowth: 12.5,
    bounceRate: '42%',
    bounceRateGrowth: -5.3
  };

  const topPages = [
    { path: '/tours/sri-lanka-highlights', views: 3456, title: 'Sri Lanka Highlights Tour' },
    { path: '/destinations/sigiriya', views: 2789, title: 'Sigiriya Rock Fortress' },
    { path: '/hotels/colombo', views: 2134, title: 'Hotels in Colombo' },
    { path: '/about/sri-lanka', views: 1876, title: 'About Sri Lanka' },
    { path: '/contact', views: 1543, title: 'Contact Us' }
  ];

  const recentActivity = [
    { time: '2 minutes ago', event: 'New booking received', type: 'booking' },
    { time: '5 minutes ago', event: 'User registered from Australia', type: 'user' },
    { time: '12 minutes ago', event: 'Page view spike detected', type: 'analytics' },
    { time: '18 minutes ago', event: 'Contact form submitted', type: 'contact' },
    { time: '25 minutes ago', event: 'New review posted', type: 'review' }
  ];

  const getGrowthIcon = (growth: number) => {
    return growth > 0 ? (
      <TrendingUp className="w-4 h-4 text-green-500" />
    ) : (
      <TrendingDown className="w-4 h-4 text-red-500" />
    );
  };

  const getGrowthColor = (growth: number) => {
    return growth > 0 ? 'text-green-600' : 'text-red-600';
  };

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'booking': return '📅';
      case 'user': return '👤';
      case 'analytics': return '📊';
      case 'contact': return '📧';
      case 'review': return '⭐';
      default: return '📌';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Analytics</h2>
        <Badge variant="outline" className="text-sm">
          Last 30 days
        </Badge>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Visitors</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analyticsData.totalVisitors.toLocaleString()}</div>
            <div className="flex items-center gap-1 text-xs">
              {getGrowthIcon(analyticsData.visitorGrowth)}
              <span className={getGrowthColor(analyticsData.visitorGrowth)}>
                {Math.abs(analyticsData.visitorGrowth)}% from last month
              </span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Page Views</CardTitle>
            <Eye className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analyticsData.pageViews.toLocaleString()}</div>
            <div className="flex items-center gap-1 text-xs">
              {getGrowthIcon(analyticsData.pageViewGrowth)}
              <span className={getGrowthColor(analyticsData.pageViewGrowth)}>
                {Math.abs(analyticsData.pageViewGrowth)}% from last month
              </span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg. Session Time</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analyticsData.avgSessionTime}</div>
            <div className="flex items-center gap-1 text-xs">
              {getGrowthIcon(analyticsData.sessionTimeGrowth)}
              <span className={getGrowthColor(analyticsData.sessionTimeGrowth)}>
                {Math.abs(analyticsData.sessionTimeGrowth)}% from last month
              </span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Bounce Rate</CardTitle>
            <Globe className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analyticsData.bounceRate}</div>
            <div className="flex items-center gap-1 text-xs">
              {getGrowthIcon(analyticsData.bounceRateGrowth)}
              <span className={getGrowthColor(analyticsData.bounceRateGrowth)}>
                {Math.abs(analyticsData.bounceRateGrowth)}% from last month
              </span>
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
              {topPages.map((page, index) => (
                <div key={page.path} className="flex items-center justify-between">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{page.title}</p>
                    <p className="text-xs text-muted-foreground truncate">{page.path}</p>
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
              {recentActivity.map((activity, index) => (
                <div key={index} className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center text-sm">
                    {getActivityIcon(activity.type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm">{activity.event}</p>
                    <p className="text-xs text-muted-foreground">{activity.time}</p>
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