
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  Users, 
  Hotel, 
  DollarSign, 
  Calendar, 
  FileText, 
  Sparkles,
  TrendingUp,
  ArrowRight
} from 'lucide-react';

const DashboardSection: React.FC = () => {
  const stats = [
    {
      title: "Total Hotels",
      value: "245",
      icon: Hotel,
      change: "+12%",
      changeType: "positive"
    },
    {
      title: "Blog Posts", 
      value: "24",
      icon: FileText,
      change: "+8%",
      changeType: "positive"
    },
    {
      title: "Total Users", 
      value: "1,234",
      icon: Users,
      change: "+5%",
      changeType: "positive"
    },
    {
      title: "Bookings",
      value: "567",
      icon: Calendar,
      change: "-2%",
      changeType: "negative"
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Admin Dashboard</h1>
        
        {/* AI Blog Generator Highlight */}
        <Card className="mb-8 bg-gradient-to-r from-purple-50 to-pink-50 border-purple-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-purple-600" />
              AI Blog Content Generator
            </CardTitle>
            <CardDescription>
              Generate SEO-optimized blog posts about Sri Lankan travel destinations using AI
            </CardDescription>
          </CardHeader>
          <CardContent className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="text-2xl font-bold text-purple-600">24</div>
              <div>
                <p className="text-sm font-medium">AI-Generated Posts</p>
                <p className="text-xs text-gray-600">This month</p>
              </div>
            </div>
            <Button className="bg-purple-600 hover:bg-purple-700">
              <Sparkles className="h-4 w-4 mr-2" />
              Generate Content
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          </CardContent>
        </Card>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => {
            const IconComponent = stat.icon;
            return (
              <Card key={index}>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-gray-600">
                    {stat.title}
                  </CardTitle>
                  <IconComponent className="h-4 w-4 text-gray-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-gray-900">{stat.value}</div>
                  <p className={`text-xs ${
                    stat.changeType === 'positive' 
                      ? 'text-green-600' 
                      : 'text-red-600'
                  }`}>
                    {stat.change} from last month
                  </p>
                </CardContent>
              </Card>
            );
          })}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Sparkles className="h-4 w-4 text-purple-600" />
                    <span className="text-sm text-gray-600">AI blog post generated</span>
                  </div>
                  <span className="text-xs text-gray-500">1 hour ago</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">New hotel registered</span>
                  <span className="text-xs text-gray-500">2 hours ago</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">User booking completed</span>
                  <span className="text-xs text-gray-500">4 hours ago</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Payment processed</span>
                  <span className="text-xs text-gray-500">6 hours ago</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <button className="w-full text-left px-4 py-2 bg-purple-50 hover:bg-purple-100 rounded-md transition-colors flex items-center gap-2">
                  <Sparkles className="h-4 w-4 text-purple-600" />
                  Generate Blog Content
                </button>
                <button className="w-full text-left px-4 py-2 bg-blue-50 hover:bg-blue-100 rounded-md transition-colors">
                  Add New Hotel
                </button>
                <button className="w-full text-left px-4 py-2 bg-green-50 hover:bg-green-100 rounded-md transition-colors">
                  View Reports
                </button>
                <button className="w-full text-left px-4 py-2 bg-orange-50 hover:bg-orange-100 rounded-md transition-colors">
                  Manage Users
                </button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default DashboardSection;
