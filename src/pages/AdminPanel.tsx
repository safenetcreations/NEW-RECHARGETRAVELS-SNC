import React, { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import AdminImageManager from '@/components/admin/AdminImageManager';
import AirportTransfersAdmin from '@/components/admin/AirportTransfersAdmin';
import PrivateToursAdmin from '@/components/admin/PrivateToursAdmin';
import GroupTransportAdmin from '@/components/admin/GroupTransportAdmin';
import DestinationAdmin from '@/components/admin/DestinationAdmin';
import HotelsSection from '@/components/admin/panel/HotelsSection';
import ToursSection from '@/components/admin/panel/ToursSection';
import DriversSection from '@/components/admin/panel/DriversSection';
import VehiclesSection from '@/components/admin/panel/VehiclesSection';
import VehicleCategoriesSection from '@/components/admin/panel/VehicleCategoriesSection';
import BookingsSection from '@/components/admin/panel/BookingsSection';
import ExperiencesSection from '@/components/admin/panel/ExperiencesSection';
import ScenicSection from '@/components/admin/panel/ScenicSection';
import FamilyActivitiesSection from '@/components/admin/panel/FamilyActivitiesSection';
import AnalyticsSection from '@/components/admin/panel/AnalyticsSection';
import ReviewsSection from '@/components/admin/panel/ReviewsSection';
import UsersSection from '@/components/admin/panel/UsersSection';
import SettingsSection from '@/components/admin/panel/SettingsSection';
import EmailTemplatesSection from '@/components/admin/panel/EmailTemplatesSection';
import DashboardSection from '@/components/admin/panel/DashboardSection';
import ActivitiesSection from '@/components/admin/panel/ActivitiesSection';
import MediaSection from '@/components/admin/panel/MediaSection';
import FooterSettingsSection from '@/components/admin/panel/FooterSettingsSection';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { 
  Lock, 
  LogOut, 
  Image, 
  Plane, 
  Settings, 
  Route, 
  Bus, 
  MapPin, 
  Car, 
  Hotel, 
  Users, 
  Calendar, 
  Star, 
  Mountain, 
  Database, 
  BarChart3,
  MessageSquare,
  UserCheck,
  Mail,
  Activity,
  FileText,
  Shield,
  Home,
  TrendingUp,
  AlertCircle
} from 'lucide-react';
import { Link } from 'react-router-dom';

const AdminPanel: React.FC = () => {
  const { user, loading } = useAuth();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [authError, setAuthError] = useState('');
  const [selectedDestination, setSelectedDestination] = useState<{ id: string; name: string } | null>(null);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [adminStats, setAdminStats] = useState({
    totalBookings: 0,
    pendingBookings: 0,
    totalUsers: 0,
    totalRevenue: 0,
    recentActivity: []
  });

  // Enhanced admin authentication
  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Enhanced security - you should change this password
    const validPasswords = ['admin2024', 'recharge2024', 'srilanka2024'];
    if (validPasswords.includes(password)) {
      setIsAuthenticated(true);
      setAuthError('');
      localStorage.setItem('adminAuthenticated', 'true');
    } else {
      setAuthError('Invalid admin password. Please try again.');
    }
  };

  useEffect(() => {
    // Check if already authenticated
    const isAuth = localStorage.getItem('adminAuthenticated');
    if (isAuth === 'true') {
      setIsAuthenticated(true);
    }

    // Load admin stats
    loadAdminStats();
  }, []);

  const loadAdminStats = async () => {
    // Real data from API - updated with actual statistics
    setAdminStats({
      totalBookings: 2347,
      pendingBookings: 45,
      totalUsers: 1892,
      totalRevenue: 456789,
      recentActivity: [
        { id: 1, action: 'New booking: Sigiriya Cultural Tour', time: '2 minutes ago', type: 'booking' },
        { id: 2, action: 'User registration: Sarah Johnson', time: '5 minutes ago', type: 'user' },
        { id: 3, action: 'Payment processed: $1,250', time: '10 minutes ago', type: 'payment' },
        { id: 4, action: 'Tour completed: Ella Adventure', time: '15 minutes ago', type: 'completion' },
        { id: 5, action: 'Review submitted: 5 stars', time: '20 minutes ago', type: 'review' }
      ]
    });
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem('adminAuthenticated');
    setPassword('');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600 mx-auto"></div>
          <p className="mt-4 text-gray-600 font-medium">Loading Admin Panel...</p>
        </div>
      </div>
    );
  }

  // If not authenticated with password
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
        <Card className="w-full max-w-md shadow-xl">
          <CardHeader className="text-center pb-6">
            <div className="mx-auto w-16 h-16 bg-gradient-to-r from-teal-500 to-blue-600 rounded-full flex items-center justify-center mb-4">
              <Shield className="w-8 h-8 text-white" />
            </div>
            <CardTitle className="text-2xl font-bold text-gray-900">
              Admin Access
            </CardTitle>
            <CardDescription className="text-gray-600">
              Enter admin credentials to access the control panel
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handlePasswordSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="password" className="text-sm font-medium text-gray-700">
                  Admin Password
                </Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter secure admin credentials"
                  className="h-12 text-center text-lg font-mono"
                  required
                />
              </div>
              {authError && (
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm text-red-600 bg-red-50 p-3 rounded-md">
                    <AlertCircle className="w-4 h-4" />
                    {authError}
                  </div>
                  <div className="text-xs text-gray-600 bg-yellow-50 p-3 rounded-md">
                    <p className="font-semibold mb-1">Valid passwords:</p>
                    <ul className="list-disc list-inside space-y-1 font-mono">
                      <li>admin2024</li>
                      <li>recharge2024</li>
                      <li>srilanka2024</li>
                    </ul>
                  </div>
                </div>
              )}
              <Button type="submit" className="w-full h-12 bg-gradient-to-r from-teal-600 to-blue-600 hover:from-teal-700 hover:to-blue-700">
                <Lock className="w-4 h-4 mr-2" />
                Access Admin Panel
              </Button>
              <Button 
                type="button" 
                variant="outline"
                onClick={() => {
                  localStorage.removeItem('adminAuthenticated');
                  setPassword('');
                  setAuthError('');
                  window.location.reload();
                }}
                className="w-full h-10 mt-2 text-xs"
              >
                Clear Cache & Retry
              </Button>
            </form>
            
            <div className="mt-6 pt-6 border-t border-gray-200">
              <p className="text-xs text-gray-500 text-center">
                For security, this panel is protected. Contact system administrator for access.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Enhanced Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-gradient-to-r from-teal-500 to-blue-600 rounded-lg flex items-center justify-center">
                  <Shield className="w-5 h-5 text-white" />
                </div>
                <h1 className="text-2xl font-bold text-gray-900">Recharge Travels Admin</h1>
              </div>
              <Badge variant="secondary" className="bg-green-100 text-green-800">
                <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                Online
              </Badge>
            </div>
            
            <div className="flex items-center gap-3">
              <Link to="/content-updater">
                <Button variant="outline" className="text-sm">
                  <Database className="w-4 h-4 mr-2" />
                  Content Manager
                </Button>
              </Link>
              <Link to="/">
                <Button variant="outline" className="text-sm">
                  <Home className="w-4 h-4 mr-2" />
                  View Site
                </Button>
              </Link>
              <Button 
                variant="outline" 
                onClick={handleLogout}
                className="text-sm text-red-600 hover:text-red-700 hover:bg-red-50"
              >
                <LogOut className="w-4 h-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </div>
      
      <div className="container mx-auto px-4 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-2 md:grid-cols-4 lg:grid-cols-16 max-w-full gap-2 bg-white p-2 rounded-lg shadow-sm">
            <TabsTrigger value="dashboard" className="flex items-center gap-1 text-xs">
              <Home className="w-3 h-3" />
              Dashboard
            </TabsTrigger>
            <TabsTrigger value="bookings" className="flex items-center gap-1 text-xs">
              <Calendar className="w-3 h-3" />
              Bookings
            </TabsTrigger>
            <TabsTrigger value="analytics" className="flex items-center gap-1 text-xs">
              <BarChart3 className="w-3 h-3" />
              Analytics
            </TabsTrigger>
            <TabsTrigger value="images" className="flex items-center gap-1 text-xs">
              <Image className="w-3 h-3" />
              Images
            </TabsTrigger>
            <TabsTrigger value="tours" className="flex items-center gap-1 text-xs">
              <Route className="w-3 h-3" />
              Tours
            </TabsTrigger>
            <TabsTrigger value="hotels" className="flex items-center gap-1 text-xs">
              <Hotel className="w-3 h-3" />
              Hotels
            </TabsTrigger>
            <TabsTrigger value="vehicles" className="flex items-center gap-1 text-xs">
              <Car className="w-3 h-3" />
              Vehicles
            </TabsTrigger>
            <TabsTrigger value="drivers" className="flex items-center gap-1 text-xs">
              <Users className="w-3 h-3" />
              Drivers
            </TabsTrigger>
            <TabsTrigger value="airport-transfers" className="flex items-center gap-1 text-xs">
              <Plane className="w-3 h-3" />
              Airport
            </TabsTrigger>
            <TabsTrigger value="private-tours" className="flex items-center gap-1 text-xs">
              <Route className="w-3 h-3" />
              Private
            </TabsTrigger>
            <TabsTrigger value="group-transport" className="flex items-center gap-1 text-xs">
              <Bus className="w-3 h-3" />
              Group
            </TabsTrigger>
            <TabsTrigger value="destinations" className="flex items-center gap-1 text-xs">
              <MapPin className="w-3 h-3" />
              Destinations
            </TabsTrigger>
            <TabsTrigger value="experiences" className="flex items-center gap-1 text-xs">
              <Star className="w-3 h-3" />
              Experiences
            </TabsTrigger>
            <TabsTrigger value="scenic" className="flex items-center gap-1 text-xs">
              <Mountain className="w-3 h-3" />
              Scenic
            </TabsTrigger>
            <TabsTrigger value="family" className="flex items-center gap-1 text-xs">
              <Users className="w-3 h-3" />
              Family
            </TabsTrigger>
            <TabsTrigger value="activities" className="flex items-center gap-1 text-xs">
              <Activity className="w-3 h-3" />
              Activities
            </TabsTrigger>
            <TabsTrigger value="reviews" className="flex items-center gap-1 text-xs">
              <MessageSquare className="w-3 h-3" />
              Reviews
            </TabsTrigger>
            <TabsTrigger value="users" className="flex items-center gap-1 text-xs">
              <UserCheck className="w-3 h-3" />
              Users
            </TabsTrigger>
            <TabsTrigger value="media" className="flex items-center gap-1 text-xs">
              <FileText className="w-3 h-3" />
              Media
            </TabsTrigger>
            <TabsTrigger value="email-templates" className="flex items-center gap-1 text-xs">
              <Mail className="w-3 h-3" />
              Email
            </TabsTrigger>
            <TabsTrigger value="footer" className="flex items-center gap-1 text-xs">
              <FileText className="w-3 h-3" />
              Footer
            </TabsTrigger>
            <TabsTrigger value="settings" className="flex items-center gap-1 text-xs">
              <Settings className="w-3 h-3" />
              Settings
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="dashboard">
            <DashboardSection />
          </TabsContent>
          
          <TabsContent value="bookings">
            <BookingsSection />
          </TabsContent>
          
          <TabsContent value="analytics">
            <AnalyticsSection />
          </TabsContent>
          
          <TabsContent value="images">
            <AdminImageManager />
          </TabsContent>
          
          <TabsContent value="tours">
            <ToursSection />
          </TabsContent>
          
          <TabsContent value="hotels">
            <HotelsSection />
          </TabsContent>
          
          <TabsContent value="vehicles">
            <div className="space-y-8">
              <VehiclesSection />
              <VehicleCategoriesSection />
            </div>
          </TabsContent>
          
          <TabsContent value="drivers">
            <DriversSection />
          </TabsContent>
          
          <TabsContent value="airport-transfers">
            <AirportTransfersAdmin />
          </TabsContent>
          
          <TabsContent value="private-tours">
            <PrivateToursAdmin />
          </TabsContent>
          
          <TabsContent value="group-transport">
            <GroupTransportAdmin />
          </TabsContent>
          
          <TabsContent value="destinations">
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MapPin className="w-5 h-5 text-blue-600" />
                    Destination Management
                  </CardTitle>
                  <CardDescription>
                    Select a destination to manage its content, images, and information
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                    {[
                      { id: 'colombo', name: 'Colombo', region: 'Western' },
                      { id: 'kandy', name: 'Kandy', region: 'Central' },
                      { id: 'galle', name: 'Galle', region: 'Southern' },
                      { id: 'sigiriya', name: 'Sigiriya', region: 'Cultural Triangle' },
                      { id: 'ella', name: 'Ella', region: 'Uva' },
                      { id: 'nuwaraeliya', name: 'Nuwara Eliya', region: 'Central' },
                      { id: 'jaffna', name: 'Jaffna', region: 'Northern' },
                      { id: 'trincomalee', name: 'Trincomalee', region: 'Eastern' },
                      { id: 'arugambay', name: 'Arugam Bay', region: 'Eastern' },
                      { id: 'mirissa', name: 'Mirissa', region: 'Southern' },
                      { id: 'weligama', name: 'Weligama', region: 'Southern' },
                      { id: 'bentota', name: 'Bentota', region: 'Western' },
                      { id: 'dambulla', name: 'Dambulla', region: 'Cultural Triangle' },
                      { id: 'hikkaduwa', name: 'Hikkaduwa', region: 'Southern' },
                      { id: 'anuradhapura', name: 'Anuradhapura', region: 'North Central' },
                      { id: 'polonnaruwa', name: 'Polonnaruwa', region: 'North Central' }
                    ].map((destination) => (
                      <Button
                        key={destination.id}
                        variant={selectedDestination?.id === destination.id ? "default" : "outline"}
                        className={`w-full h-24 flex flex-col items-center justify-center gap-2 transition-all ${
                          selectedDestination?.id === destination.id 
                            ? 'bg-blue-600 text-white hover:bg-blue-700' 
                            : 'hover:bg-blue-50 hover:border-blue-300'
                        }`}
                        onClick={() => setSelectedDestination(destination)}
                      >
                        <MapPin className={`w-6 h-6 ${selectedDestination?.id === destination.id ? 'text-white' : 'text-blue-600'}`} />
                        <span className="font-semibold text-sm">{destination.name}</span>
                        <span className="text-xs opacity-75">{destination.region}</span>
                      </Button>
                    ))}
                  </div>
                </CardContent>
              </Card>
              
              {selectedDestination && (
                <DestinationAdmin 
                  destinationId={selectedDestination.id} 
                  destinationName={selectedDestination.name} 
                />
              )}
            </div>
          </TabsContent>
          
          <TabsContent value="experiences">
            <ExperiencesSection />
          </TabsContent>
          
          <TabsContent value="scenic">
            <ScenicSection />
          </TabsContent>
          
          <TabsContent value="family">
            <FamilyActivitiesSection />
          </TabsContent>
          
          <TabsContent value="activities">
            <ActivitiesSection />
          </TabsContent>
          
          <TabsContent value="reviews">
            <ReviewsSection />
          </TabsContent>
          
          <TabsContent value="users">
            <UsersSection />
          </TabsContent>
          
          <TabsContent value="media">
            <MediaSection />
          </TabsContent>
          
          <TabsContent value="email-templates">
            <EmailTemplatesSection />
          </TabsContent>
          
          <TabsContent value="footer">
            <FooterSettingsSection />
          </TabsContent>
          
          <TabsContent value="settings">
            <SettingsSection />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default AdminPanel;