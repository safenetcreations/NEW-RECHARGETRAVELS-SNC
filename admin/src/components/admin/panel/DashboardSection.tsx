
import React, { useState, Suspense, lazy } from 'react';
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
  ArrowRight,
  ArrowUp,
  ArrowDown
} from 'lucide-react';
import TimeRangeFilter from './TimeRangeFilter';
import LoadingSpinner from '@/components/LoadingSpinner';

const DashboardCharts = lazy(() => import('./DashboardCharts'));

const DashboardSection: React.FC = () => {
  const [timeRange, setTimeRange] = useState<'today' | 'week' | 'month' | 'year'>('month');
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
    <div className="space-y-8">
      {/* Welcome Banner with Time Range Filter */}
      <div className="admin-card-colorful p-8">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent mb-2">
              Welcome to Admin Dashboard
            </h1>
            <p className="text-gray-600 text-lg">Manage your Recharge Travels website with ease</p>
          </div>
          <div className="flex items-center gap-4">
            <TimeRangeFilter value={timeRange} onChange={setTimeRange} />
            <div className="hidden lg:block">
              <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg animate-pulse">
                <Sparkles className="w-8 h-8 text-white" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* AI Blog Generator Highlight */}
      <div className="admin-card-colorful p-6 border-2 border-purple-300">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="p-4 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl shadow-lg">
              <Sparkles className="w-8 h-8 text-white" />
            </div>
            <div>
              <h3 className="text-2xl font-bold text-gray-900">AI Blog Content Generator</h3>
              <p className="text-gray-600 mt-1">Generate SEO-optimized blog posts about Sri Lankan travel destinations using AI</p>
              <div className="flex items-center gap-6 mt-3">
                <div className="flex items-center gap-2">
                  <div className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">24</div>
                  <div>
                    <p className="text-sm font-semibold text-gray-700">AI-Generated Posts</p>
                    <p className="text-xs text-gray-500">This month</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <Button className="admin-btn-primary">
            <Sparkles className="h-5 w-5 mr-2" />
            Generate Content
            <ArrowRight className="h-5 w-5 ml-2" />
          </Button>
        </div>
      </div>
        
      {/* Stats Cards with Enhanced Design */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => {
          const IconComponent = stat.icon;
          const gradients = [
            'from-blue-500 to-cyan-500',
            'from-emerald-500 to-green-500',
            'from-purple-500 to-pink-500',
            'from-orange-500 to-red-500'
          ];
          const isPositive = stat.changeType === 'positive';
          return (
            <div key={index} className="admin-card-colorful p-6 hover:shadow-2xl transition-all duration-300 group cursor-pointer">
              <div className="flex items-center justify-between mb-4">
                <div className={`p-3 bg-gradient-to-br ${gradients[index]} rounded-xl shadow-md group-hover:scale-110 transition-transform duration-300`}>
                  <IconComponent className="h-6 w-6 text-white" />
                </div>
                <div className={`flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-bold ${
                  isPositive
                    ? 'bg-green-100 text-green-700'
                    : 'bg-red-100 text-red-700'
                }`}>
                  {isPositive ? (
                    <ArrowUp className="w-3 h-3" />
                  ) : (
                    <ArrowDown className="w-3 h-3" />
                  )}
                  {stat.change}
                </div>
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-600 uppercase tracking-wider mb-1">
                  {stat.title}
                </p>
                <p className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                  {stat.value}
                </p>
                <p className="text-xs text-gray-500 mt-1">from last {timeRange === 'today' ? 'day' : timeRange}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Charts Section */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-gray-900">Analytics Overview</h2>
        </div>
        <Suspense fallback={<LoadingSpinner />}>
          <DashboardCharts timeRange={timeRange} />
        </Suspense>
      </div>

      {/* Recent Activity & Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Activity */}
        <div className="admin-card p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-gradient-to-br from-blue-500 to-purple-500 rounded-lg">
              <TrendingUp className="w-5 h-5 text-white" />
            </div>
            <h3 className="text-xl font-bold text-gray-900">Recent Activity</h3>
          </div>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 bg-purple-50 rounded-lg hover:bg-purple-100 transition-colors">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-purple-500 rounded-lg">
                  <Sparkles className="h-4 w-4 text-white" />
                </div>
                <span className="text-sm font-medium text-gray-700">AI blog post generated</span>
              </div>
              <span className="text-xs text-gray-500 font-semibold">1h ago</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-500 rounded-lg">
                  <Hotel className="h-4 w-4 text-white" />
                </div>
                <span className="text-sm font-medium text-gray-700">New hotel registered</span>
              </div>
              <span className="text-xs text-gray-500 font-semibold">2h ago</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg hover:bg-green-100 transition-colors">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-green-500 rounded-lg">
                  <Calendar className="h-4 w-4 text-white" />
                </div>
                <span className="text-sm font-medium text-gray-700">User booking completed</span>
              </div>
              <span className="text-xs text-gray-500 font-semibold">4h ago</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-orange-50 rounded-lg hover:bg-orange-100 transition-colors">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-orange-500 rounded-lg">
                  <DollarSign className="h-4 w-4 text-white" />
                </div>
                <span className="text-sm font-medium text-gray-700">Payment processed</span>
              </div>
              <span className="text-xs text-gray-500 font-semibold">6h ago</span>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="admin-card p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-gradient-to-br from-emerald-500 to-green-500 rounded-lg">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <h3 className="text-xl font-bold text-gray-900">Quick Actions</h3>
          </div>
          <div className="space-y-3">
            <button className="w-full text-left px-5 py-4 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white rounded-xl transition-all transform hover:scale-105 shadow-md hover:shadow-xl flex items-center gap-3 font-semibold">
              <Sparkles className="h-5 w-5" />
              Generate Blog Content
            </button>
            <button className="w-full text-left px-5 py-4 bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white rounded-xl transition-all transform hover:scale-105 shadow-md hover:shadow-xl flex items-center gap-3 font-semibold">
              <Hotel className="h-5 w-5" />
              Add New Hotel
            </button>
            <button className="w-full text-left px-5 py-4 bg-gradient-to-r from-emerald-500 to-green-500 hover:from-emerald-600 hover:to-green-600 text-white rounded-xl transition-all transform hover:scale-105 shadow-md hover:shadow-xl flex items-center gap-3 font-semibold">
              <FileText className="h-5 w-5" />
              View Reports
            </button>
            <button className="w-full text-left px-5 py-4 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white rounded-xl transition-all transform hover:scale-105 shadow-md hover:shadow-xl flex items-center gap-3 font-semibold">
              <Users className="h-5 w-5" />
              Manage Users
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardSection;
