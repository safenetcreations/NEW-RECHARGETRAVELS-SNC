import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter
} from '@/components/ui/dialog';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table';
import { toast } from 'sonner';
import {
  Train, Plus, Pencil, Trash2, Image, Route, Ticket, Settings, RefreshCw,
  Eye, EyeOff, Star, Clock, MapPin, Users, CheckCircle, XCircle, AlertCircle,
  Send, Phone, Mail, DollarSign
} from 'lucide-react';
import trainBookingAdminService, {
  TrainHeroSlide,
  ScenicRoute,
  TrainBooking,
  TrainBookingSettings,
  trainHeroSlidesService,
  trainRoutesService,
  trainBookingsService,
  trainSettingsService,
  seedTrainDefaultData
} from '@/services/trainBookingAdminService';

// Status colors
const statusColors: Record<string, string> = {
  pending: 'bg-yellow-100 text-yellow-800',
  confirmed: 'bg-blue-100 text-blue-800',
  tickets_purchased: 'bg-purple-100 text-purple-800',
  delivered: 'bg-indigo-100 text-indigo-800',
  completed: 'bg-green-100 text-green-800',
  cancelled: 'bg-red-100 text-red-800'
};

const paymentStatusColors: Record<string, string> = {
  awaiting_confirmation: 'bg-gray-100 text-gray-800',
  payment_pending: 'bg-orange-100 text-orange-800',
  paid: 'bg-green-100 text-green-800',
  refunded: 'bg-red-100 text-red-800'
};

const TrainBookingManager: React.FC = () => {
  const [activeTab, setActiveTab] = useState('bookings');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Data states
  const [bookings, setBookings] = useState<TrainBooking[]>([]);
  const [heroSlides, setHeroSlides] = useState<TrainHeroSlide[]>([]);
  const [routes, setRoutes] = useState<ScenicRoute[]>([]);
  const [settings, setSettings] = useState<TrainBookingSettings | null>(null);
  const [stats, setStats] = useState({ total: 0, pending: 0, confirmed: 0, completed: 0, revenue: 0 });

  // Dialog states
  const [slideDialogOpen, setSlideDialogOpen] = useState(false);
  const [routeDialogOpen, setRouteDialogOpen] = useState(false);
  const [bookingDetailsOpen, setBookingDetailsOpen] = useState(false);
  const [selectedSlide, setSelectedSlide] = useState<TrainHeroSlide | null>(null);
  const [selectedRoute, setSelectedRoute] = useState<ScenicRoute | null>(null);
  const [selectedBooking, setSelectedBooking] = useState<TrainBooking | null>(null);

  // Form states
  const [slideForm, setSlideForm] = useState<Partial<TrainHeroSlide>>({
    image: '',
    title: '',
    subtitle: '',
    routeName: '',
    isActive: true,
    order: 1
  });

  const [routeForm, setRouteForm] = useState<Partial<ScenicRoute>>({
    name: '',
    category: 'Hill Country',
    description: '',
    distance: '',
    duration: '',
    highlights: [],
    departureStation: '',
    arrivalStation: '',
    frequency: '',
    bestClass: '2nd Class Observation',
    priceRange: '',
    image: '',
    rating: 5,
    popularity: '',
    bestTime: '',
    scenicStops: [],
    icon: 'Train',
    isFeatured: false,
    isActive: true
  });

  // Load data
  useEffect(() => {
    loadAllData();
  }, []);

  const loadAllData = async () => {
    setLoading(true);
    try {
      const [bookingsData, slidesData, routesData, settingsData, statsData] = await Promise.all([
        trainBookingsService.getAll(),
        trainHeroSlidesService.getAll(),
        trainRoutesService.getAll(),
        trainSettingsService.get(),
        trainBookingsService.getStats()
      ]);

      setBookings(bookingsData);
      setHeroSlides(slidesData);
      setRoutes(routesData);
      setSettings(settingsData);
      setStats(statsData);
    } catch (error) {
      console.error('Error loading data:', error);
      toast.error('Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  // Hero Slides handlers
  const handleOpenSlideDialog = (slide?: TrainHeroSlide) => {
    if (slide) {
      setSelectedSlide(slide);
      setSlideForm(slide);
    } else {
      setSelectedSlide(null);
      setSlideForm({
        image: '',
        title: '',
        subtitle: '',
        routeName: '',
        isActive: true,
        order: heroSlides.length + 1
      });
    }
    setSlideDialogOpen(true);
  };

  const handleSaveSlide = async () => {
    setSaving(true);
    try {
      if (selectedSlide?.id) {
        await trainHeroSlidesService.update(selectedSlide.id, slideForm);
        toast.success('Slide updated successfully');
      } else {
        await trainHeroSlidesService.create(slideForm as Omit<TrainHeroSlide, 'id'>);
        toast.success('Slide created successfully');
      }
      setSlideDialogOpen(false);
      loadAllData();
    } catch (error) {
      toast.error('Failed to save slide');
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteSlide = async (id: string) => {
    if (!confirm('Delete this hero slide?')) return;
    try {
      await trainHeroSlidesService.delete(id);
      toast.success('Slide deleted');
      loadAllData();
    } catch (error) {
      toast.error('Failed to delete slide');
    }
  };

  // Routes handlers
  const handleOpenRouteDialog = (route?: ScenicRoute) => {
    if (route) {
      setSelectedRoute(route);
      setRouteForm(route);
    } else {
      setSelectedRoute(null);
      setRouteForm({
        name: '',
        category: 'Hill Country',
        description: '',
        distance: '',
        duration: '',
        highlights: [],
        departureStation: '',
        arrivalStation: '',
        frequency: '',
        bestClass: '2nd Class Observation',
        priceRange: '',
        image: '',
        rating: 5,
        popularity: '',
        bestTime: '',
        scenicStops: [],
        icon: 'Train',
        isFeatured: false,
        isActive: true
      });
    }
    setRouteDialogOpen(true);
  };

  const handleSaveRoute = async () => {
    setSaving(true);
    try {
      if (selectedRoute?.id) {
        await trainRoutesService.update(selectedRoute.id, routeForm);
        toast.success('Route updated successfully');
      } else {
        await trainRoutesService.create(routeForm as Omit<ScenicRoute, 'id'>);
        toast.success('Route created successfully');
      }
      setRouteDialogOpen(false);
      loadAllData();
    } catch (error) {
      toast.error('Failed to save route');
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteRoute = async (id: string) => {
    if (!confirm('Delete this route?')) return;
    try {
      await trainRoutesService.delete(id);
      toast.success('Route deleted');
      loadAllData();
    } catch (error) {
      toast.error('Failed to delete route');
    }
  };

  // Booking handlers
  const handleViewBooking = (booking: TrainBooking) => {
    setSelectedBooking(booking);
    setBookingDetailsOpen(true);
  };

  const handleUpdateBookingStatus = async (id: string, status: TrainBooking['status']) => {
    try {
      await trainBookingsService.updateStatus(id, status);
      toast.success(`Booking status updated to ${status}`);
      loadAllData();
    } catch (error) {
      toast.error('Failed to update status');
    }
  };

  const handleUpdatePaymentStatus = async (id: string, paymentStatus: TrainBooking['paymentStatus']) => {
    try {
      await trainBookingsService.updatePaymentStatus(id, paymentStatus);
      toast.success(`Payment status updated to ${paymentStatus}`);
      loadAllData();
    } catch (error) {
      toast.error('Failed to update payment status');
    }
  };

  // Settings handlers
  const handleSaveSettings = async () => {
    if (!settings) return;
    setSaving(true);
    try {
      await trainSettingsService.update(settings);
      toast.success('Settings saved successfully');
    } catch (error) {
      toast.error('Failed to save settings');
    } finally {
      setSaving(false);
    }
  };

  // Seed data
  const handleSeedData = async () => {
    if (!confirm('Seed default train booking data? This will only add data if collections are empty.')) return;
    setLoading(true);
    try {
      await seedTrainDefaultData();
      toast.success('Default data seeded successfully');
      loadAllData();
    } catch (error) {
      toast.error('Failed to seed data');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <RefreshCw className="w-8 h-8 animate-spin text-red-600" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <Train className="w-6 h-6 text-red-600" />
            Train Booking Manager
          </h2>
          <p className="text-gray-500">Manage scenic routes, hero images, bookings, and settings</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={loadAllData}>
            <RefreshCw className="w-4 h-4 mr-2" /> Refresh
          </Button>
          <Button variant="outline" onClick={handleSeedData}>
            Seed Default Data
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <Card>
          <CardContent className="pt-4">
            <div className="text-2xl font-bold text-gray-900">{stats.total}</div>
            <div className="text-sm text-gray-500">Total Bookings</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4">
            <div className="text-2xl font-bold text-yellow-600">{stats.pending}</div>
            <div className="text-sm text-gray-500">Pending</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4">
            <div className="text-2xl font-bold text-blue-600">{stats.confirmed}</div>
            <div className="text-sm text-gray-500">Confirmed</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4">
            <div className="text-2xl font-bold text-green-600">{stats.completed}</div>
            <div className="text-sm text-gray-500">Completed</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4">
            <div className="text-2xl font-bold text-emerald-600">LKR {stats.revenue.toLocaleString()}</div>
            <div className="text-sm text-gray-500">Revenue</div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="bookings" className="flex items-center gap-2">
            <Ticket className="w-4 h-4" /> Bookings
          </TabsTrigger>
          <TabsTrigger value="routes" className="flex items-center gap-2">
            <Route className="w-4 h-4" /> Routes
          </TabsTrigger>
          <TabsTrigger value="hero" className="flex items-center gap-2">
            <Image className="w-4 h-4" /> Hero Slides
          </TabsTrigger>
          <TabsTrigger value="settings" className="flex items-center gap-2">
            <Settings className="w-4 h-4" /> Settings
          </TabsTrigger>
        </TabsList>

        {/* Bookings Tab */}
        <TabsContent value="bookings" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Recent Bookings</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Reference</TableHead>
                    <TableHead>Route</TableHead>
                    <TableHead>Customer</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Passengers</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Payment</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {bookings.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={8} className="text-center text-gray-500">
                        No bookings yet
                      </TableCell>
                    </TableRow>
                  ) : (
                    bookings.map(booking => (
                      <TableRow key={booking.id}>
                        <TableCell className="font-mono font-medium">{booking.bookingReference}</TableCell>
                        <TableCell>{booking.route.name}</TableCell>
                        <TableCell>
                          <div>
                            <div className="font-medium">{booking.customerInfo.name}</div>
                            <div className="text-xs text-gray-500">{booking.customerInfo.email}</div>
                          </div>
                        </TableCell>
                        <TableCell>{booking.travelDetails.travelDate}</TableCell>
                        <TableCell>{booking.travelDetails.passengers}</TableCell>
                        <TableCell>
                          <Badge className={statusColors[booking.status]}>
                            {booking.status.replace('_', ' ')}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge className={paymentStatusColors[booking.paymentStatus]}>
                            {booking.paymentStatus.replace('_', ' ')}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-1">
                            <Button size="sm" variant="outline" onClick={() => handleViewBooking(booking)}>
                              <Eye className="w-3 h-3" />
                            </Button>
                            <select
                              className="text-xs border rounded px-1"
                              value={booking.status}
                              onChange={(e) => handleUpdateBookingStatus(booking.id, e.target.value as TrainBooking['status'])}
                            >
                              <option value="pending">Pending</option>
                              <option value="confirmed">Confirmed</option>
                              <option value="tickets_purchased">Tickets Purchased</option>
                              <option value="delivered">Delivered</option>
                              <option value="completed">Completed</option>
                              <option value="cancelled">Cancelled</option>
                            </select>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Routes Tab */}
        <TabsContent value="routes" className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold">Scenic Routes</h3>
            <Button onClick={() => handleOpenRouteDialog()}>
              <Plus className="w-4 h-4 mr-2" /> Add Route
            </Button>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {routes.map(route => (
              <Card key={route.id} className={`${!route.isActive ? 'opacity-60' : ''}`}>
                <div className="relative h-40 overflow-hidden rounded-t-lg">
                  <img
                    src={route.image}
                    alt={route.name}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  <div className="absolute top-2 left-2 flex gap-1">
                    <Badge className="bg-red-600">{route.category}</Badge>
                    {route.isFeatured && <Badge className="bg-yellow-500">Featured</Badge>}
                  </div>
                  <div className="absolute bottom-2 left-2 right-2">
                    <h4 className="text-white font-bold">{route.name}</h4>
                    <p className="text-white/80 text-sm">{route.departureStation} → {route.arrivalStation}</p>
                  </div>
                </div>
                <CardContent className="p-4">
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-500">Duration:</span>
                      <span>{route.duration}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Price:</span>
                      <span>{route.priceRange}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Rating:</span>
                      <span className="flex items-center gap-1">
                        <Star className="w-3 h-3 text-yellow-500 fill-yellow-500" />
                        {route.rating}
                      </span>
                    </div>
                  </div>
                  <div className="flex gap-2 mt-4">
                    <Button size="sm" variant="outline" className="flex-1" onClick={() => handleOpenRouteDialog(route)}>
                      <Pencil className="w-3 h-3 mr-1" /> Edit
                    </Button>
                    <Button size="sm" variant="outline" className="text-red-600" onClick={() => handleDeleteRoute(route.id!)}>
                      <Trash2 className="w-3 h-3" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Hero Slides Tab */}
        <TabsContent value="hero" className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold">Hero Slideshow Images</h3>
            <Button onClick={() => handleOpenSlideDialog()}>
              <Plus className="w-4 h-4 mr-2" /> Add Slide
            </Button>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {heroSlides.map(slide => (
              <Card key={slide.id} className={`${!slide.isActive ? 'opacity-60' : ''}`}>
                <div className="relative h-48 overflow-hidden rounded-t-lg">
                  <img
                    src={slide.image}
                    alt={slide.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                  <div className="absolute top-2 right-2">
                    <Badge variant={slide.isActive ? 'default' : 'secondary'}>
                      {slide.isActive ? 'Active' : 'Inactive'}
                    </Badge>
                  </div>
                  <div className="absolute bottom-2 left-2 right-2">
                    <p className="text-xs text-white/70">Order: {slide.order}</p>
                    <h4 className="text-white font-bold">{slide.title}</h4>
                    <p className="text-white/80 text-sm">{slide.subtitle}</p>
                  </div>
                </div>
                <CardContent className="p-4">
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline" className="flex-1" onClick={() => handleOpenSlideDialog(slide)}>
                      <Pencil className="w-3 h-3 mr-1" /> Edit
                    </Button>
                    <Button size="sm" variant="outline" className="text-red-600" onClick={() => handleDeleteSlide(slide.id!)}>
                      <Trash2 className="w-3 h-3" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Settings Tab */}
        <TabsContent value="settings" className="space-y-4">
          {settings && (
            <div className="grid md:grid-cols-2 gap-6">
              {/* Trust Indicators */}
              <Card>
                <CardHeader>
                  <CardTitle>Trust Indicators</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label>Rating Display</Label>
                    <Input
                      value={settings.trustIndicators.rating}
                      onChange={(e) => setSettings({
                        ...settings,
                        trustIndicators: { ...settings.trustIndicators, rating: e.target.value }
                      })}
                    />
                  </div>
                  <div>
                    <Label>Bookings Display</Label>
                    <Input
                      value={settings.trustIndicators.bookings}
                      onChange={(e) => setSettings({
                        ...settings,
                        trustIndicators: { ...settings.trustIndicators, bookings: e.target.value }
                      })}
                    />
                  </div>
                  <div>
                    <Label>Support Display</Label>
                    <Input
                      value={settings.trustIndicators.support}
                      onChange={(e) => setSettings({
                        ...settings,
                        trustIndicators: { ...settings.trustIndicators, support: e.target.value }
                      })}
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Fees */}
              <Card>
                <CardHeader>
                  <CardTitle>Fees</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label>Service Fee (LKR)</Label>
                    <Input
                      type="number"
                      value={settings.serviceFee}
                      onChange={(e) => setSettings({ ...settings, serviceFee: parseInt(e.target.value) || 0 })}
                    />
                  </div>
                  <div>
                    <Label>Delivery Fee (LKR)</Label>
                    <Input
                      type="number"
                      value={settings.deliveryFee}
                      onChange={(e) => setSettings({ ...settings, deliveryFee: parseInt(e.target.value) || 0 })}
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Contact */}
              <Card>
                <CardHeader>
                  <CardTitle>Contact Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label>Phone</Label>
                    <Input
                      value={settings.contactPhone || ''}
                      onChange={(e) => setSettings({ ...settings, contactPhone: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label>Email</Label>
                    <Input
                      value={settings.contactEmail || ''}
                      onChange={(e) => setSettings({ ...settings, contactEmail: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label>WhatsApp</Label>
                    <Input
                      value={settings.contactWhatsApp || ''}
                      onChange={(e) => setSettings({ ...settings, contactWhatsApp: e.target.value })}
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Terms */}
              <Card>
                <CardHeader>
                  <CardTitle>Terms & Conditions</CardTitle>
                </CardHeader>
                <CardContent>
                  <Label>One term per line</Label>
                  <textarea
                    className="w-full h-48 border rounded-lg p-2 mt-2"
                    value={settings.termsAndConditions.join('\n')}
                    onChange={(e) => setSettings({
                      ...settings,
                      termsAndConditions: e.target.value.split('\n').filter(t => t.trim())
                    })}
                  />
                </CardContent>
              </Card>

              {/* Cancellation Policy */}
              <Card className="md:col-span-2">
                <CardHeader>
                  <CardTitle>Cancellation Policy</CardTitle>
                </CardHeader>
                <CardContent>
                  <textarea
                    className="w-full h-24 border rounded-lg p-2"
                    value={settings.cancellationPolicy}
                    onChange={(e) => setSettings({ ...settings, cancellationPolicy: e.target.value })}
                  />
                </CardContent>
              </Card>

              {/* Save Button */}
              <div className="md:col-span-2">
                <Button onClick={handleSaveSettings} disabled={saving} className="w-full">
                  {saving ? 'Saving...' : 'Save Settings'}
                </Button>
              </div>
            </div>
          )}
        </TabsContent>
      </Tabs>

      {/* Hero Slide Dialog */}
      <Dialog open={slideDialogOpen} onOpenChange={setSlideDialogOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>{selectedSlide ? 'Edit Hero Slide' : 'Add Hero Slide'}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Image URL</Label>
              <Input
                value={slideForm.image || ''}
                onChange={(e) => setSlideForm({ ...slideForm, image: e.target.value })}
                placeholder="https://images.unsplash.com/..."
              />
            </div>
            <div>
              <Label>Title</Label>
              <Input
                value={slideForm.title || ''}
                onChange={(e) => setSlideForm({ ...slideForm, title: e.target.value })}
                placeholder="Kandy to Ella"
              />
            </div>
            <div>
              <Label>Subtitle</Label>
              <Input
                value={slideForm.subtitle || ''}
                onChange={(e) => setSlideForm({ ...slideForm, subtitle: e.target.value })}
                placeholder="The World's Most Scenic Journey"
              />
            </div>
            <div>
              <Label>Route Name (Optional)</Label>
              <Input
                value={slideForm.routeName || ''}
                onChange={(e) => setSlideForm({ ...slideForm, routeName: e.target.value })}
                placeholder="Hill Country Express"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Order</Label>
                <Input
                  type="number"
                  value={slideForm.order || 1}
                  onChange={(e) => setSlideForm({ ...slideForm, order: parseInt(e.target.value) || 1 })}
                />
              </div>
              <div className="flex items-center gap-2 pt-6">
                <input
                  type="checkbox"
                  id="slideActive"
                  checked={slideForm.isActive || false}
                  onChange={(e) => setSlideForm({ ...slideForm, isActive: e.target.checked })}
                />
                <Label htmlFor="slideActive">Active</Label>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setSlideDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleSaveSlide} disabled={saving}>
              {saving ? 'Saving...' : 'Save'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Route Dialog */}
      <Dialog open={routeDialogOpen} onOpenChange={setRouteDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{selectedRoute ? 'Edit Route' : 'Add Route'}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Route Name *</Label>
                <Input
                  value={routeForm.name || ''}
                  onChange={(e) => setRouteForm({ ...routeForm, name: e.target.value })}
                  placeholder="Kandy to Ella"
                />
              </div>
              <div>
                <Label>Category *</Label>
                <select
                  className="w-full border rounded-lg p-2"
                  value={routeForm.category || 'Hill Country'}
                  onChange={(e) => setRouteForm({ ...routeForm, category: e.target.value as any })}
                >
                  <option value="Hill Country">Hill Country</option>
                  <option value="Main Line">Main Line</option>
                  <option value="Coastal Line">Coastal Line</option>
                </select>
              </div>
            </div>
            <div>
              <Label>Description *</Label>
              <textarea
                className="w-full border rounded-lg p-2"
                rows={2}
                value={routeForm.description || ''}
                onChange={(e) => setRouteForm({ ...routeForm, description: e.target.value })}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Departure Station</Label>
                <Input
                  value={routeForm.departureStation || ''}
                  onChange={(e) => setRouteForm({ ...routeForm, departureStation: e.target.value })}
                />
              </div>
              <div>
                <Label>Arrival Station</Label>
                <Input
                  value={routeForm.arrivalStation || ''}
                  onChange={(e) => setRouteForm({ ...routeForm, arrivalStation: e.target.value })}
                />
              </div>
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <Label>Distance</Label>
                <Input
                  value={routeForm.distance || ''}
                  onChange={(e) => setRouteForm({ ...routeForm, distance: e.target.value })}
                  placeholder="120 km"
                />
              </div>
              <div>
                <Label>Duration</Label>
                <Input
                  value={routeForm.duration || ''}
                  onChange={(e) => setRouteForm({ ...routeForm, duration: e.target.value })}
                  placeholder="6-7 hours"
                />
              </div>
              <div>
                <Label>Frequency</Label>
                <Input
                  value={routeForm.frequency || ''}
                  onChange={(e) => setRouteForm({ ...routeForm, frequency: e.target.value })}
                  placeholder="Daily"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Price Range</Label>
                <Input
                  value={routeForm.priceRange || ''}
                  onChange={(e) => setRouteForm({ ...routeForm, priceRange: e.target.value })}
                  placeholder="LKR 300 - 1,500"
                />
              </div>
              <div>
                <Label>Best Class</Label>
                <Input
                  value={routeForm.bestClass || ''}
                  onChange={(e) => setRouteForm({ ...routeForm, bestClass: e.target.value })}
                  placeholder="2nd Class Observation"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Best Time</Label>
                <Input
                  value={routeForm.bestTime || ''}
                  onChange={(e) => setRouteForm({ ...routeForm, bestTime: e.target.value })}
                  placeholder="Early Morning"
                />
              </div>
              <div>
                <Label>Popularity</Label>
                <Input
                  value={routeForm.popularity || ''}
                  onChange={(e) => setRouteForm({ ...routeForm, popularity: e.target.value })}
                  placeholder="Most Popular"
                />
              </div>
            </div>
            <div>
              <Label>Image URL</Label>
              <Input
                value={routeForm.image || ''}
                onChange={(e) => setRouteForm({ ...routeForm, image: e.target.value })}
              />
            </div>
            <div>
              <Label>Highlights (comma-separated)</Label>
              <Input
                value={(routeForm.highlights || []).join(', ')}
                onChange={(e) => setRouteForm({ ...routeForm, highlights: e.target.value.split(',').map(h => h.trim()) })}
                placeholder="Nine Arch Bridge, Tea Plantations, Mountain Scenery"
              />
            </div>
            <div>
              <Label>Scenic Stops (comma-separated)</Label>
              <Input
                value={(routeForm.scenicStops || []).join(', ')}
                onChange={(e) => setRouteForm({ ...routeForm, scenicStops: e.target.value.split(',').map(s => s.trim()) })}
                placeholder="Nanu Oya, Pattipola, Haputale"
              />
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <Label>Rating</Label>
                <Input
                  type="number"
                  step="0.1"
                  min="0"
                  max="5"
                  value={routeForm.rating || 5}
                  onChange={(e) => setRouteForm({ ...routeForm, rating: parseFloat(e.target.value) || 5 })}
                />
              </div>
              <div className="flex items-center gap-2 pt-6">
                <input
                  type="checkbox"
                  id="routeFeatured"
                  checked={routeForm.isFeatured || false}
                  onChange={(e) => setRouteForm({ ...routeForm, isFeatured: e.target.checked })}
                />
                <Label htmlFor="routeFeatured">Featured</Label>
              </div>
              <div className="flex items-center gap-2 pt-6">
                <input
                  type="checkbox"
                  id="routeActive"
                  checked={routeForm.isActive || false}
                  onChange={(e) => setRouteForm({ ...routeForm, isActive: e.target.checked })}
                />
                <Label htmlFor="routeActive">Active</Label>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setRouteDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleSaveRoute} disabled={saving}>
              {saving ? 'Saving...' : 'Save'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Booking Details Dialog */}
      <Dialog open={bookingDetailsOpen} onOpenChange={setBookingDetailsOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Booking Details - {selectedBooking?.bookingReference}</DialogTitle>
          </DialogHeader>
          {selectedBooking && (
            <div className="space-y-6">
              {/* Status */}
              <div className="flex gap-2">
                <Badge className={statusColors[selectedBooking.status]}>
                  {selectedBooking.status.replace('_', ' ')}
                </Badge>
                <Badge className={paymentStatusColors[selectedBooking.paymentStatus]}>
                  {selectedBooking.paymentStatus.replace('_', ' ')}
                </Badge>
              </div>

              {/* Route Info */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-semibold mb-2">Route</h4>
                <p className="text-lg font-bold">{selectedBooking.route.name}</p>
                <p className="text-gray-600">{selectedBooking.route.departureStation} → {selectedBooking.route.arrivalStation}</p>
              </div>

              {/* Customer Info */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-semibold mb-2">Customer</h4>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div><span className="text-gray-500">Name:</span> {selectedBooking.customerInfo.name}</div>
                  <div><span className="text-gray-500">Email:</span> {selectedBooking.customerInfo.email}</div>
                  <div><span className="text-gray-500">Phone:</span> {selectedBooking.customerInfo.phone}</div>
                  <div><span className="text-gray-500">Country:</span> {selectedBooking.customerInfo.country}</div>
                  {selectedBooking.customerInfo.passportNumber && (
                    <div><span className="text-gray-500">Passport:</span> {selectedBooking.customerInfo.passportNumber}</div>
                  )}
                </div>
              </div>

              {/* Travel Details */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-semibold mb-2">Travel Details</h4>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div><span className="text-gray-500">Date:</span> {selectedBooking.travelDetails.travelDate}</div>
                  <div><span className="text-gray-500">Passengers:</span> {selectedBooking.travelDetails.passengers}</div>
                  <div><span className="text-gray-500">Class:</span> {selectedBooking.travelDetails.ticketClass}</div>
                  <div><span className="text-gray-500">Time:</span> {selectedBooking.travelDetails.preferredTime}</div>
                  <div><span className="text-gray-500">Window Seat:</span> {selectedBooking.travelDetails.windowSeat ? 'Yes' : 'No'}</div>
                  <div><span className="text-gray-500">Hand Delivery:</span> {selectedBooking.travelDetails.handDelivery ? 'Yes' : 'No'}</div>
                </div>
                {selectedBooking.travelDetails.handDelivery && (
                  <div className="mt-2 text-sm">
                    <div><span className="text-gray-500">Hotel:</span> {selectedBooking.travelDetails.hotelName}</div>
                    <div><span className="text-gray-500">Address:</span> {selectedBooking.travelDetails.hotelAddress}</div>
                  </div>
                )}
                {selectedBooking.travelDetails.specialRequests && (
                  <div className="mt-2 text-sm">
                    <span className="text-gray-500">Special Requests:</span> {selectedBooking.travelDetails.specialRequests}
                  </div>
                )}
              </div>

              {/* Pricing */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-semibold mb-2">Pricing</h4>
                <div className="space-y-1 text-sm">
                  <div className="flex justify-between">
                    <span>Estimated Ticket Price:</span>
                    <span>{selectedBooking.pricing.estimatedPrice}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Service Fee:</span>
                    <span>LKR {selectedBooking.pricing.serviceFee.toLocaleString()}</span>
                  </div>
                  {selectedBooking.pricing.deliveryFee > 0 && (
                    <div className="flex justify-between">
                      <span>Delivery Fee:</span>
                      <span>LKR {selectedBooking.pricing.deliveryFee.toLocaleString()}</span>
                    </div>
                  )}
                  {selectedBooking.pricing.totalAmount && (
                    <div className="flex justify-between font-bold border-t pt-2 mt-2">
                      <span>Total:</span>
                      <span>LKR {selectedBooking.pricing.totalAmount.toLocaleString()}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-2">
                <Button
                  className="flex-1"
                  variant="outline"
                  onClick={() => window.open(`mailto:${selectedBooking.customerInfo.email}`, '_blank')}
                >
                  <Mail className="w-4 h-4 mr-2" /> Email
                </Button>
                <Button
                  className="flex-1"
                  variant="outline"
                  onClick={() => window.open(`https://wa.me/${selectedBooking.customerInfo.phone.replace(/\D/g, '')}`, '_blank')}
                >
                  <Phone className="w-4 h-4 mr-2" /> WhatsApp
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default TrainBookingManager;
