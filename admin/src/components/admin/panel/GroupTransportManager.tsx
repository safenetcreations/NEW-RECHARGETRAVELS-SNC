import React, { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Bus,
  Users,
  Calendar,
  Settings,
  Plus,
  Edit,
  Trash2,
  Save,
  Eye,
  DollarSign,
  Image,
  CheckCircle,
  Clock,
  XCircle,
  Loader2,
  RefreshCw,
  FileText,
  AlertCircle
} from 'lucide-react';
import { toast } from 'sonner';
import {
  vehiclesAdminService,
  heroSlidesAdminService,
  settingsAdminService,
  bookingsAdminService,
  seedDefaultData,
  GroupVehicle,
  HeroSlide,
  GroupTransportSettings,
  GroupTransportBooking
} from '@/services/groupTransportAdminService';

const GroupTransportManager: React.FC = () => {
  const [activeTab, setActiveTab] = useState('bookings');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Data states
  const [vehicles, setVehicles] = useState<GroupVehicle[]>([]);
  const [heroSlides, setHeroSlides] = useState<HeroSlide[]>([]);
  const [settings, setSettings] = useState<GroupTransportSettings | null>(null);
  const [bookings, setBookings] = useState<GroupTransportBooking[]>([]);
  const [stats, setStats] = useState({ total: 0, pending: 0, confirmed: 0, completed: 0, revenue: 0 });

  // Dialog states
  const [vehicleDialogOpen, setVehicleDialogOpen] = useState(false);
  const [editingVehicle, setEditingVehicle] = useState<GroupVehicle | null>(null);
  const [slideDialogOpen, setSlideDialogOpen] = useState(false);
  const [editingSlide, setEditingSlide] = useState<HeroSlide | null>(null);
  const [bookingDetailsOpen, setBookingDetailsOpen] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState<GroupTransportBooking | null>(null);

  // Load all data
  const loadData = async () => {
    setLoading(true);
    try {
      const [vehiclesData, slidesData, settingsData, bookingsData, statsData] = await Promise.all([
        vehiclesAdminService.getAll(),
        heroSlidesAdminService.getAll(),
        settingsAdminService.get(),
        bookingsAdminService.getAll(),
        bookingsAdminService.getStats()
      ]);

      setVehicles(vehiclesData);
      setHeroSlides(slidesData);
      setSettings(settingsData || {
        trustIndicators: { rating: '4.8/5', reviews: '1,456', support: '24/7 Support' },
        howToBook: [],
        terms: [],
        cancellationPolicy: '',
        driverChargeRates: { standard: 30, englishSpeaking: 45, tourGuide: 65 }
      });
      setBookings(bookingsData);
      setStats(statsData);
    } catch (error) {
      console.error('Error loading data:', error);
      toast.error('Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // Seed default data
  const handleSeedData = async () => {
    setSaving(true);
    try {
      await seedDefaultData();
      await loadData();
      toast.success('Default data seeded successfully');
    } catch (error) {
      toast.error('Failed to seed data');
    } finally {
      setSaving(false);
    }
  };

  // Vehicle CRUD
  const handleSaveVehicle = async () => {
    if (!editingVehicle) return;

    setSaving(true);
    try {
      if (editingVehicle.id) {
        await vehiclesAdminService.update(editingVehicle.id, editingVehicle);
        toast.success('Vehicle updated');
      } else {
        await vehiclesAdminService.create(editingVehicle);
        toast.success('Vehicle created');
      }
      await loadData();
      setVehicleDialogOpen(false);
      setEditingVehicle(null);
    } catch (error) {
      toast.error('Failed to save vehicle');
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteVehicle = async (id: string) => {
    if (!confirm('Are you sure you want to delete this vehicle?')) return;

    try {
      await vehiclesAdminService.delete(id);
      toast.success('Vehicle deleted');
      await loadData();
    } catch (error) {
      toast.error('Failed to delete vehicle');
    }
  };

  // Hero Slide CRUD
  const handleSaveSlide = async () => {
    if (!editingSlide) return;

    setSaving(true);
    try {
      if (editingSlide.id) {
        await heroSlidesAdminService.update(editingSlide.id, editingSlide);
        toast.success('Slide updated');
      } else {
        await heroSlidesAdminService.create(editingSlide);
        toast.success('Slide created');
      }
      await loadData();
      setSlideDialogOpen(false);
      setEditingSlide(null);
    } catch (error) {
      toast.error('Failed to save slide');
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteSlide = async (id: string) => {
    if (!confirm('Are you sure you want to delete this slide?')) return;

    try {
      await heroSlidesAdminService.delete(id);
      toast.success('Slide deleted');
      await loadData();
    } catch (error) {
      toast.error('Failed to delete slide');
    }
  };

  // Settings save
  const handleSaveSettings = async () => {
    if (!settings) return;

    setSaving(true);
    try {
      await settingsAdminService.update(settings);
      toast.success('Settings saved');
    } catch (error) {
      toast.error('Failed to save settings');
    } finally {
      setSaving(false);
    }
  };

  // Booking status update
  const handleUpdateBookingStatus = async (id: string, status: GroupTransportBooking['status']) => {
    try {
      await bookingsAdminService.updateStatus(id, status);
      toast.success('Booking status updated');
      await loadData();
    } catch (error) {
      toast.error('Failed to update status');
    }
  };

  const getStatusBadge = (status: string) => {
    const variants: Record<string, string> = {
      pending: 'bg-yellow-100 text-yellow-800',
      confirmed: 'bg-blue-100 text-blue-800',
      'in-progress': 'bg-purple-100 text-purple-800',
      completed: 'bg-green-100 text-green-800',
      cancelled: 'bg-red-100 text-red-800'
    };
    return <Badge className={variants[status] || 'bg-gray-100'}>{status}</Badge>;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-emerald-600" />
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold">Group Transport Manager</h1>
          <p className="text-gray-500">Manage vehicles, bookings, and content</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={loadData}>
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh
          </Button>
          {vehicles.length === 0 && (
            <Button onClick={handleSeedData} disabled={saving}>
              {saving ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Plus className="w-4 h-4 mr-2" />}
              Seed Default Data
            </Button>
          )}
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Total Bookings</p>
                <p className="text-3xl font-bold">{stats.total}</p>
              </div>
              <Bus className="w-10 h-10 text-emerald-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Pending</p>
                <p className="text-3xl font-bold text-yellow-600">{stats.pending}</p>
              </div>
              <Clock className="w-10 h-10 text-yellow-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Confirmed</p>
                <p className="text-3xl font-bold text-blue-600">{stats.confirmed}</p>
              </div>
              <CheckCircle className="w-10 h-10 text-blue-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Completed</p>
                <p className="text-3xl font-bold text-green-600">{stats.completed}</p>
              </div>
              <CheckCircle className="w-10 h-10 text-green-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Revenue</p>
                <p className="text-3xl font-bold text-emerald-600">${stats.revenue.toLocaleString()}</p>
              </div>
              <DollarSign className="w-10 h-10 text-emerald-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-6">
          <TabsTrigger value="bookings">
            <Calendar className="w-4 h-4 mr-2" />
            Bookings
          </TabsTrigger>
          <TabsTrigger value="vehicles">
            <Bus className="w-4 h-4 mr-2" />
            Vehicles
          </TabsTrigger>
          <TabsTrigger value="hero">
            <Image className="w-4 h-4 mr-2" />
            Hero Slides
          </TabsTrigger>
          <TabsTrigger value="settings">
            <Settings className="w-4 h-4 mr-2" />
            Settings
          </TabsTrigger>
        </TabsList>

        {/* Bookings Tab */}
        <TabsContent value="bookings">
          <Card>
            <CardHeader>
              <CardTitle>Recent Bookings</CardTitle>
              <CardDescription>Manage group transport bookings</CardDescription>
            </CardHeader>
            <CardContent>
              {bookings.length === 0 ? (
                <div className="text-center py-12 text-gray-500">
                  <Bus className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p>No bookings yet</p>
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Reference</TableHead>
                      <TableHead>Customer</TableHead>
                      <TableHead>Vehicle</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Route</TableHead>
                      <TableHead>Total</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {bookings.map((booking) => (
                      <TableRow key={booking.id}>
                        <TableCell className="font-mono font-bold">{booking.bookingReference}</TableCell>
                        <TableCell>
                          <div>
                            <p className="font-medium">{booking.customerName}</p>
                            <p className="text-xs text-gray-500">{booking.customerEmail}</p>
                          </div>
                        </TableCell>
                        <TableCell>{booking.vehicleName}</TableCell>
                        <TableCell>{booking.pickupDate}</TableCell>
                        <TableCell>
                          <p className="text-sm">{booking.pickupLocation}</p>
                          <p className="text-xs text-gray-500">→ {booking.dropoffLocation}</p>
                        </TableCell>
                        <TableCell className="font-bold">${booking.totalPrice}</TableCell>
                        <TableCell>{getStatusBadge(booking.status)}</TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => {
                                setSelectedBooking(booking);
                                setBookingDetailsOpen(true);
                              }}
                            >
                              <Eye className="w-4 h-4" />
                            </Button>
                            <Select
                              value={booking.status}
                              onValueChange={(value) => handleUpdateBookingStatus(booking.id, value as any)}
                            >
                              <SelectTrigger className="w-32">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="pending">Pending</SelectItem>
                                <SelectItem value="confirmed">Confirmed</SelectItem>
                                <SelectItem value="in-progress">In Progress</SelectItem>
                                <SelectItem value="completed">Completed</SelectItem>
                                <SelectItem value="cancelled">Cancelled</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Vehicles Tab */}
        <TabsContent value="vehicles">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Vehicle Fleet</CardTitle>
                <CardDescription>Manage your group transport vehicles</CardDescription>
              </div>
              <Button onClick={() => {
                setEditingVehicle({
                  name: '',
                  type: 'van',
                  capacity: 10,
                  features: [],
                  image: '',
                  pricePerDay: 0,
                  pricePerKm: 0,
                  minimumHours: 4,
                  hourlyRate: 0,
                  isActive: true
                });
                setVehicleDialogOpen(true);
              }}>
                <Plus className="w-4 h-4 mr-2" />
                Add Vehicle
              </Button>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
                {vehicles.map((vehicle) => (
                  <Card key={vehicle.id} className={!vehicle.isActive ? 'opacity-50' : ''}>
                    <div className="h-40 relative">
                      <img
                        src={vehicle.image}
                        alt={vehicle.name}
                        className="w-full h-full object-cover rounded-t-lg"
                      />
                      {vehicle.popular && (
                        <Badge className="absolute top-2 right-2 bg-amber-500">Popular</Badge>
                      )}
                    </div>
                    <CardContent className="pt-4">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-bold">{vehicle.name}</h3>
                        <Badge variant="outline">{vehicle.capacity} seats</Badge>
                      </div>
                      <div className="text-sm text-gray-500 mb-3">
                        <p>${vehicle.pricePerDay}/day | ${vehicle.pricePerKm}/km</p>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          className="flex-1"
                          onClick={() => {
                            setEditingVehicle(vehicle);
                            setVehicleDialogOpen(true);
                          }}
                        >
                          <Edit className="w-4 h-4 mr-1" />
                          Edit
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => vehicle.id && handleDeleteVehicle(vehicle.id)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Hero Slides Tab */}
        <TabsContent value="hero">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Hero Slides</CardTitle>
                <CardDescription>Manage homepage slideshow</CardDescription>
              </div>
              <Button onClick={() => {
                setEditingSlide({
                  image: '',
                  title: '',
                  subtitle: '',
                  description: '',
                  isActive: true,
                  order: heroSlides.length + 1
                });
                setSlideDialogOpen(true);
              }}>
                <Plus className="w-4 h-4 mr-2" />
                Add Slide
              </Button>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-3 gap-4">
                {heroSlides.map((slide) => (
                  <Card key={slide.id} className={!slide.isActive ? 'opacity-50' : ''}>
                    <div className="h-40 relative">
                      <img
                        src={slide.image}
                        alt={slide.title}
                        className="w-full h-full object-cover rounded-t-lg"
                      />
                      <Badge className="absolute top-2 left-2">#{slide.order}</Badge>
                    </div>
                    <CardContent className="pt-4">
                      <h3 className="font-bold mb-1">{slide.title}</h3>
                      <p className="text-sm text-gray-500 mb-3">{slide.subtitle}</p>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          className="flex-1"
                          onClick={() => {
                            setEditingSlide(slide);
                            setSlideDialogOpen(true);
                          }}
                        >
                          <Edit className="w-4 h-4 mr-1" />
                          Edit
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => slide.id && handleDeleteSlide(slide.id)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Settings Tab */}
        <TabsContent value="settings">
          <div className="grid gap-6">
            {/* Driver Charge Rates */}
            <Card>
              <CardHeader>
                <CardTitle>Driver Charge Rates</CardTitle>
                <CardDescription>Set daily rates for different driver types</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-3 gap-4">
                  <div>
                    <Label>Standard Driver ($/day)</Label>
                    <Input
                      type="number"
                      value={settings?.driverChargeRates.standard || 0}
                      onChange={(e) => setSettings(prev => prev ? {
                        ...prev,
                        driverChargeRates: { ...prev.driverChargeRates, standard: Number(e.target.value) }
                      } : null)}
                    />
                  </div>
                  <div>
                    <Label>English Speaking ($/day)</Label>
                    <Input
                      type="number"
                      value={settings?.driverChargeRates.englishSpeaking || 0}
                      onChange={(e) => setSettings(prev => prev ? {
                        ...prev,
                        driverChargeRates: { ...prev.driverChargeRates, englishSpeaking: Number(e.target.value) }
                      } : null)}
                    />
                  </div>
                  <div>
                    <Label>Tour Guide Driver ($/day)</Label>
                    <Input
                      type="number"
                      value={settings?.driverChargeRates.tourGuide || 0}
                      onChange={(e) => setSettings(prev => prev ? {
                        ...prev,
                        driverChargeRates: { ...prev.driverChargeRates, tourGuide: Number(e.target.value) }
                      } : null)}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Trust Indicators */}
            <Card>
              <CardHeader>
                <CardTitle>Trust Indicators</CardTitle>
                <CardDescription>Display stats on the booking form</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-3 gap-4">
                  <div>
                    <Label>Rating</Label>
                    <Input
                      value={settings?.trustIndicators.rating || ''}
                      onChange={(e) => setSettings(prev => prev ? {
                        ...prev,
                        trustIndicators: { ...prev.trustIndicators, rating: e.target.value }
                      } : null)}
                      placeholder="e.g., 4.8/5"
                    />
                  </div>
                  <div>
                    <Label>Reviews Count</Label>
                    <Input
                      value={settings?.trustIndicators.reviews || ''}
                      onChange={(e) => setSettings(prev => prev ? {
                        ...prev,
                        trustIndicators: { ...prev.trustIndicators, reviews: e.target.value }
                      } : null)}
                      placeholder="e.g., 1,456"
                    />
                  </div>
                  <div>
                    <Label>Support Text</Label>
                    <Input
                      value={settings?.trustIndicators.support || ''}
                      onChange={(e) => setSettings(prev => prev ? {
                        ...prev,
                        trustIndicators: { ...prev.trustIndicators, support: e.target.value }
                      } : null)}
                      placeholder="e.g., 24/7 Support"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Cancellation Policy */}
            <Card>
              <CardHeader>
                <CardTitle>Cancellation Policy</CardTitle>
              </CardHeader>
              <CardContent>
                <Textarea
                  value={settings?.cancellationPolicy || ''}
                  onChange={(e) => setSettings(prev => prev ? {
                    ...prev,
                    cancellationPolicy: e.target.value
                  } : null)}
                  rows={4}
                  placeholder="Enter your cancellation policy..."
                />
              </CardContent>
            </Card>

            <Button onClick={handleSaveSettings} disabled={saving} className="w-fit">
              {saving ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
              Save Settings
            </Button>
          </div>
        </TabsContent>
      </Tabs>

      {/* Vehicle Dialog */}
      <Dialog open={vehicleDialogOpen} onOpenChange={setVehicleDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingVehicle?.id ? 'Edit Vehicle' : 'Add Vehicle'}</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Vehicle Name</Label>
                <Input
                  value={editingVehicle?.name || ''}
                  onChange={(e) => setEditingVehicle(prev => prev ? { ...prev, name: e.target.value } : null)}
                  placeholder="e.g., Premium Van"
                />
              </div>
              <div>
                <Label>Type</Label>
                <Select
                  value={editingVehicle?.type || 'van'}
                  onValueChange={(value) => setEditingVehicle(prev => prev ? { ...prev, type: value as any } : null)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="van">Van</SelectItem>
                    <SelectItem value="minibus">Minibus</SelectItem>
                    <SelectItem value="coach">Coach</SelectItem>
                    <SelectItem value="luxury-coach">Luxury Coach</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Capacity (seats)</Label>
                <Input
                  type="number"
                  value={editingVehicle?.capacity || 0}
                  onChange={(e) => setEditingVehicle(prev => prev ? { ...prev, capacity: Number(e.target.value) } : null)}
                />
              </div>
              <div>
                <Label>Image URL</Label>
                <Input
                  value={editingVehicle?.image || ''}
                  onChange={(e) => setEditingVehicle(prev => prev ? { ...prev, image: e.target.value } : null)}
                  placeholder="https://..."
                />
              </div>
            </div>
            <div className="grid grid-cols-4 gap-4">
              <div>
                <Label>Price/Day ($)</Label>
                <Input
                  type="number"
                  value={editingVehicle?.pricePerDay || 0}
                  onChange={(e) => setEditingVehicle(prev => prev ? { ...prev, pricePerDay: Number(e.target.value) } : null)}
                />
              </div>
              <div>
                <Label>Price/KM ($)</Label>
                <Input
                  type="number"
                  step="0.1"
                  value={editingVehicle?.pricePerKm || 0}
                  onChange={(e) => setEditingVehicle(prev => prev ? { ...prev, pricePerKm: Number(e.target.value) } : null)}
                />
              </div>
              <div>
                <Label>Hourly Rate ($)</Label>
                <Input
                  type="number"
                  value={editingVehicle?.hourlyRate || 0}
                  onChange={(e) => setEditingVehicle(prev => prev ? { ...prev, hourlyRate: Number(e.target.value) } : null)}
                />
              </div>
              <div>
                <Label>Min. Hours</Label>
                <Input
                  type="number"
                  value={editingVehicle?.minimumHours || 0}
                  onChange={(e) => setEditingVehicle(prev => prev ? { ...prev, minimumHours: Number(e.target.value) } : null)}
                />
              </div>
            </div>
            <div>
              <Label>Features (comma separated)</Label>
              <Input
                value={editingVehicle?.features.join(', ') || ''}
                onChange={(e) => setEditingVehicle(prev => prev ? { ...prev, features: e.target.value.split(',').map(f => f.trim()) } : null)}
                placeholder="AC, WiFi, USB Charging"
              />
            </div>
            <div>
              <Label>Description</Label>
              <Textarea
                value={editingVehicle?.description || ''}
                onChange={(e) => setEditingVehicle(prev => prev ? { ...prev, description: e.target.value } : null)}
                rows={2}
              />
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <Switch
                  checked={editingVehicle?.isActive}
                  onCheckedChange={(checked) => setEditingVehicle(prev => prev ? { ...prev, isActive: checked } : null)}
                />
                <Label>Active</Label>
              </div>
              <div className="flex items-center gap-2">
                <Switch
                  checked={editingVehicle?.popular}
                  onCheckedChange={(checked) => setEditingVehicle(prev => prev ? { ...prev, popular: checked } : null)}
                />
                <Label>Popular</Label>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setVehicleDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleSaveVehicle} disabled={saving}>
              {saving ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
              Save
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Hero Slide Dialog */}
      <Dialog open={slideDialogOpen} onOpenChange={setSlideDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingSlide?.id ? 'Edit Slide' : 'Add Slide'}</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div>
              <Label>Image URL</Label>
              <Input
                value={editingSlide?.image || ''}
                onChange={(e) => setEditingSlide(prev => prev ? { ...prev, image: e.target.value } : null)}
                placeholder="https://..."
              />
            </div>
            <div>
              <Label>Title</Label>
              <Input
                value={editingSlide?.title || ''}
                onChange={(e) => setEditingSlide(prev => prev ? { ...prev, title: e.target.value } : null)}
              />
            </div>
            <div>
              <Label>Subtitle</Label>
              <Input
                value={editingSlide?.subtitle || ''}
                onChange={(e) => setEditingSlide(prev => prev ? { ...prev, subtitle: e.target.value } : null)}
              />
            </div>
            <div>
              <Label>Description</Label>
              <Textarea
                value={editingSlide?.description || ''}
                onChange={(e) => setEditingSlide(prev => prev ? { ...prev, description: e.target.value } : null)}
                rows={2}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Order</Label>
                <Input
                  type="number"
                  value={editingSlide?.order || 1}
                  onChange={(e) => setEditingSlide(prev => prev ? { ...prev, order: Number(e.target.value) } : null)}
                />
              </div>
              <div className="flex items-center gap-2 pt-6">
                <Switch
                  checked={editingSlide?.isActive}
                  onCheckedChange={(checked) => setEditingSlide(prev => prev ? { ...prev, isActive: checked } : null)}
                />
                <Label>Active</Label>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setSlideDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleSaveSlide} disabled={saving}>
              {saving ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
              Save
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Booking Details Dialog */}
      <Dialog open={bookingDetailsOpen} onOpenChange={setBookingDetailsOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Booking Details</DialogTitle>
            <DialogDescription>Reference: {selectedBooking?.bookingReference}</DialogDescription>
          </DialogHeader>
          {selectedBooking && (
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-gray-500">Customer Name</Label>
                  <p className="font-medium">{selectedBooking.customerName}</p>
                </div>
                <div>
                  <Label className="text-gray-500">Email</Label>
                  <p className="font-medium">{selectedBooking.customerEmail}</p>
                </div>
                <div>
                  <Label className="text-gray-500">Phone</Label>
                  <p className="font-medium">{selectedBooking.customerPhone}</p>
                </div>
                <div>
                  <Label className="text-gray-500">Vehicle</Label>
                  <p className="font-medium">{selectedBooking.vehicleName}</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-gray-500">Pickup</Label>
                  <p className="font-medium">{selectedBooking.pickupLocation}</p>
                  <p className="text-sm text-gray-500">{selectedBooking.pickupDate} at {selectedBooking.pickupTime}</p>
                </div>
                <div>
                  <Label className="text-gray-500">Destination</Label>
                  <p className="font-medium">{selectedBooking.dropoffLocation}</p>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <Label className="text-gray-500">Trip Type</Label>
                  <p className="font-medium capitalize">{selectedBooking.tripType.replace('-', ' ')}</p>
                </div>
                <div>
                  <Label className="text-gray-500">Passengers</Label>
                  <p className="font-medium">{selectedBooking.passengers}</p>
                </div>
                <div>
                  <Label className="text-gray-500">Driver Type</Label>
                  <p className="font-medium capitalize">{selectedBooking.driverType.replace('-', ' ')}</p>
                </div>
              </div>
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div className="flex justify-between">
                    <span>Vehicle Price:</span>
                    <span className="font-medium">${selectedBooking.vehiclePrice}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Driver Charges:</span>
                    <span className="font-medium">${selectedBooking.driverCharges}</span>
                  </div>
                  <div className="flex justify-between col-span-2 border-t pt-2 mt-2">
                    <span className="font-bold">Total:</span>
                    <span className="font-bold text-emerald-600">${selectedBooking.totalPrice}</span>
                  </div>
                </div>
              </div>
              {selectedBooking.specialRequests && (
                <div>
                  <Label className="text-gray-500">Special Requests</Label>
                  <p className="font-medium">{selectedBooking.specialRequests}</p>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default GroupTransportManager;
