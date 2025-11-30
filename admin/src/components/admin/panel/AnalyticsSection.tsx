import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, TrendingDown, Users, Eye, Clock, Globe, Calendar, MapPin, Hotel } from 'lucide-react';
import { collection, getDocs, query, orderBy, limit, where } from 'firebase/firestore';
import { db } from '@/lib/firebase';

const AnalyticsSection: React.FC = () => {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalBookings: 0,
    totalTours: 0,
    totalHotels: 0,
    totalRevenue: 0
  });
  const [recentBookings, setRecentBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        // Fetch counts (using getDocs for now as it's safer without specific count rules)
        const usersSnapshot = await getDocs(collection(db, 'users'));
        const bookingsSnapshot = await getDocs(collection(db, 'bookings'));
        const toursSnapshot = await getDocs(collection(db, 'tours'));
        const hotelsSnapshot = await getDocs(collection(db, 'hotels'));

        // Calculate revenue (mock calculation if price field exists, or just count)
        let revenue = 0;
        bookingsSnapshot.docs.forEach(doc => {
          const data = doc.data();
          if (data.totalAmount) revenue += Number(data.totalAmount);
        });

        setStats({
          totalUsers: usersSnapshot.size,
          totalBookings: bookingsSnapshot.size,
          totalTours: toursSnapshot.size,
          totalHotels: hotelsSnapshot.size,
          totalRevenue: revenue
        });

        // Fetch recent bookings
        const recentBookingsQuery = query(
          collection(db, 'bookings'),
          orderBy('createdAt', 'desc'),
          limit(5)
        );
        const recentBookingsSnapshot = await getDocs(recentBookingsQuery);
        setRecentBookings(recentBookingsSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })));

      } catch (error) {
        console.error("Error fetching analytics:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, []);

  if (loading) {
    return <div className="p-8 text-center">Loading analytics...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Live Analytics</h2>
        <Badge variant="outline" className="text-sm bg-green-50 text-green-700 border-green-200 animate-pulse">
          <span className="w-2 h-2 rounded-full bg-green-500 mr-2"></span>
          Live Data
        </Badge>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalUsers.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">Registered accounts</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Bookings</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalBookings.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">All time bookings</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Tours</CardTitle>
            <MapPin className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalTours.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">Available packages</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Partner Hotels</CardTitle>
            <Hotel className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalHotels.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">Listed properties</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Bookings */}
        <Card className="col-span-2">
          <CardHeader>
            <CardTitle>Recent Bookings</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentBookings.length > 0 ? (
                recentBookings.map((booking) => (
                  <div key={booking.id} className="flex items-center justify-between border-b pb-4 last:border-0 last:pb-0">
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
                        <Calendar className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="font-medium">{booking.tourName || booking.hotelName || 'Booking'}</p>
                        <p className="text-sm text-muted-foreground">
                          {booking.customerName || booking.email || 'Guest'} • {booking.createdAt?.toDate?.().toLocaleDateString() || 'Just now'}
                        </p>
                      </div>
                    </div>
                    <Badge variant={booking.status === 'confirmed' ? 'default' : 'secondary'}>
                      {booking.status || 'Pending'}
                    </Badge>
                  </div>
                ))
              ) : (
                <p className="text-sm text-muted-foreground text-center py-4">No recent bookings found.</p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AnalyticsSection;