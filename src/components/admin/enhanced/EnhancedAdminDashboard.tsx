import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Users, 
  Calendar, 
  DollarSign, 
  TrendingUp, 
  Shield, 
  Settings,
  BarChart3,
  Activity
} from 'lucide-react';
import { useRoles, useAdminDashboard } from '@/hooks/useRoles';

const EnhancedAdminDashboard: React.FC = () => {
  const { userRole, canManageUsers, canEditContent, canManageMedia } = useRoles();
  const { stats, loading } = useAdminDashboard();

  const StatCard = ({ 
    title, 
    value, 
    description, 
    icon: Icon, 
    trend 
  }: {
    title: string;
    value: string | number;
    description: string;
    icon: React.ElementType;
    trend?: string;
  }) => (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <Icon className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{loading ? '...' : value}</div>
        <p className="text-xs text-muted-foreground">
          {trend && <span className="text-green-600">{trend}</span>} {description}
        </p>
      </CardContent>
    </Card>
  );

  return (
    <div className="space-y-6">
      {/* Role Badge */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Enhanced Admin Dashboard</h1>
          <p className="text-muted-foreground">
            Welcome to the enhanced admin panel with role-based access control
          </p>
        </div>
        <Badge variant="outline" className="flex items-center gap-2">
          <Shield className="h-3 w-3" />
          {userRole || 'Loading...'}
        </Badge>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Bookings"
          value={stats.totalBookings}
          description="from last month"
          icon={Calendar}
          trend="+12%"
        />
        <StatCard
          title="Today's Bookings"
          value={stats.todayBookings}
          description="new bookings today"
          icon={TrendingUp}
        />
        <StatCard
          title="Monthly Revenue"
          value={`$${stats.monthlyRevenue.toLocaleString()}`}
          description="current month"
          icon={DollarSign}
          trend="+8%"
        />
        <StatCard
          title="Active Users"
          value={stats.activeUsers}
          description="registered users"
          icon={Users}
        />
      </div>

      {/* Role-based Action Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {canManageUsers && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                User Management
              </CardTitle>
              <CardDescription>
                Manage user roles and permissions
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button variant="outline" className="w-full">
                Manage Users
              </Button>
            </CardContent>
          </Card>
        )}

        {canEditContent && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5" />
                Content Management
              </CardTitle>
              <CardDescription>
                Edit tours, hotels, and blog content
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button variant="outline" className="w-full">
                Manage Content
              </Button>
            </CardContent>
          </Card>
        )}

        {canManageMedia && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="h-5 w-5" />
                Media Library
              </CardTitle>
              <CardDescription>
                Upload and organize media assets
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button variant="outline" className="w-full">
                Media Library
              </Button>
            </CardContent>
          </Card>
        )}

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="h-5 w-5" />
              Global Settings
            </CardTitle>
            <CardDescription>
              Configure site-wide settings
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button variant="outline" className="w-full">
              Settings
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>
            Frequently used admin functions
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            <Button variant="outline" size="sm">
              Export Bookings
            </Button>
            <Button variant="outline" size="sm">
              Generate Report
            </Button>
            <Button variant="outline" size="sm">
              Backup Data
            </Button>
            {canManageUsers && (
              <Button variant="outline" size="sm">
                Audit Logs
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default EnhancedAdminDashboard;