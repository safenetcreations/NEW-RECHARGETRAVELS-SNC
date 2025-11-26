
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Building2, Binoculars, Calendar, DollarSign } from 'lucide-react';
import { getLodges, getWildlifeActivities, getUserWildlifeBookings } from '@/services/wildlifeService';

const DashboardSection: React.FC = () => {
  const [stats, setStats] = useState({
    lodges: 0,
    activities: 0,
    bookings: 0,
    revenue: 0
  });

  useEffect(() => {
    loadDashboardStats();
  }, []);

  const loadDashboardStats = async () => {
    try {
      const [lodgesResult, activitiesResult, bookingsResult] = await Promise.all([
        getLodges(),
        getWildlifeActivities(),
        getUserWildlifeBookings()
      ]);

      const lodgesCount = lodgesResult.data?.length || 0;
      const activitiesCount = activitiesResult.data?.length || 0;
      const bookingsCount = bookingsResult.data?.length || 0;
      const revenue = bookingsResult.data?.reduce((sum, booking) => sum + (booking.total_amount || 0), 0) || 0;

      setStats({
        lodges: lodgesCount,
        activities: activitiesCount,
        bookings: bookingsCount,
        revenue: revenue
      });
    } catch (error) {
      console.error('Error loading dashboard stats:', error);
    }
  };

  const statCards = [
    {
      title: 'Active Lodges',
      value: stats.lodges,
      icon: Building2,
      color: 'text-blue-600'
    },
    {
      title: 'Wildlife Activities',
      value: stats.activities,
      icon: Binoculars,
      color: 'text-green-600'
    },
    {
      title: 'Total Bookings',
      value: stats.bookings,
      icon: Calendar,
      color: 'text-purple-600'
    },
    {
      title: 'Revenue',
      value: `$${stats.revenue.toLocaleString()}`,
      icon: DollarSign,
      color: 'text-yellow-600'
    }
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat, index) => {
          const IconComponent = stat.icon;
          return (
            <Card key={index}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">
                  {stat.title}
                </CardTitle>
                <IconComponent className={`h-6 w-6 ${stat.color}`} />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <span>New lodge registered: Wild Coast Tented Lodge</span>
              <span className="text-sm text-gray-500">2 hours ago</span>
            </div>
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <span>Booking confirmed: Leopard Safari Package</span>
              <span className="text-sm text-gray-500">4 hours ago</span>
            </div>
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <span>New activity added: Whale Watching Tour</span>
              <span className="text-sm text-gray-500">6 hours ago</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DashboardSection;
