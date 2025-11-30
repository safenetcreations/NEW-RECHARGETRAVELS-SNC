import React, { useEffect, useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import {
  privateToursAdminService,
  PrivateToursAdminContent,
  TourDestination,
  TourVehicle,
  TourDriver,
  TourPackage,
  TourExtra,
  PrivateTourBooking,
  defaultPrivateToursContent
} from '@/services/privateToursAdminService';
import ImageUpload from '@/components/ui/image-upload';
import {
  Plus,
  RefreshCw,
  Trash2,
  Car,
  MapPin,
  Users,
  Calendar,
  DollarSign,
  CheckCircle,
  Clock,
  XCircle,
  Package,
  Star,
  Settings,
  FileText,
  Download
} from 'lucide-react';

const listToMultiline = (items: string[]) => items.join('\n');
const multilineToList = (value: string) =>
  value
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean);

const PrivateToursManager = () => {
  const [content, setContent] = useState<PrivateToursAdminContent>(defaultPrivateToursContent);
  const [bookings, setBookings] = useState<PrivateTourBooking[]>([]);
  const [bookingStats, setBookingStats] = useState({
    total: 0,
    pending: 0,
    confirmed: 0,
    completed: 0,
    cancelled: 0,
    totalRevenue: 0
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [statusFilter, setStatusFilter] = useState('all');
  const { toast } = useToast();

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    loadBookings();
  }, [statusFilter]);

  const loadData = async () => {
    try {
      setLoading(true);
      const [data, stats] = await Promise.all([
        privateToursAdminService.getContent(),
        privateToursAdminService.getBookingStats()
      ]);
      setContent(data);
      setBookingStats(stats);
    } catch (error) {
      console.error(error);
      toast({
        title: 'Failed to load content',
        description: 'Unable to fetch Private Tours data.',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  const loadBookings = async () => {
    try {
      const data = await privateToursAdminService.getBookings(statusFilter);
      setBookings(data);
    } catch (error) {
      console.error(error);
    }
  };

  const updateContent = <K extends keyof PrivateToursAdminContent>(
    key: K,
    value: PrivateToursAdminContent[K]
  ) => {
    setContent((prev) => ({
      ...prev,
      [key]: value
    }));
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      await privateToursAdminService.saveContent(content);

      // Save destinations
      for (const dest of content.destinations) {
        if (dest.id.startsWith('new-')) {
          const { id, ...data } = dest;
          const newId = await privateToursAdminService.addDestination(data);
          dest.id = newId;
        } else {
          await privateToursAdminService.updateDestination(dest.id, dest);
        }
      }

      // Save vehicles
      for (const vehicle of content.vehicles) {
        if (vehicle.id.startsWith('new-')) {
          const { id, ...data } = vehicle;
          const newId = await privateToursAdminService.addVehicle(data);
          vehicle.id = newId;
        } else {
          await privateToursAdminService.updateVehicle(vehicle.id, vehicle);
        }
      }

      // Save drivers
      for (const driver of content.drivers) {
        if (driver.id.startsWith('new-')) {
          const { id, ...data } = driver;
          const newId = await privateToursAdminService.addDriver(data);
          driver.id = newId;
        } else {
          await privateToursAdminService.updateDriver(driver.id, driver);
        }
      }

      // Save packages
      for (const pkg of content.packages) {
        if (pkg.id.startsWith('new-')) {
          const { id, ...data } = pkg;
          const newId = await privateToursAdminService.addPackage(data);
          pkg.id = newId;
        } else {
          await privateToursAdminService.updatePackage(pkg.id, pkg);
        }
      }

      // Save extras
      for (const extra of content.extras) {
        if (extra.id.startsWith('new-')) {
          const { id, ...data } = extra;
          const newId = await privateToursAdminService.addExtra(data);
          extra.id = newId;
        } else {
          await privateToursAdminService.updateExtra(extra.id, extra);
        }
      }

      toast({
        title: 'Content saved successfully!',
        description: 'Private Tours content has been updated.'
      });
    } catch (error) {
      console.error(error);
      toast({
        title: 'Failed to save',
        description: 'Unable to save Private Tours data.',
        variant: 'destructive'
      });
    } finally {
      setSaving(false);
    }
  };

  const handleSeedData = async () => {
    if (!confirm('This will add default destinations, vehicles, and drivers. Continue?')) return;
    try {
      await privateToursAdminService.seedDefaultData();
      await loadData();
      toast({
        title: 'Data seeded successfully!',
        description: 'Default destinations, vehicles, and drivers have been added.'
      });
    } catch (error) {
      console.error(error);
      toast({
        title: 'Failed to seed data',
        variant: 'destructive'
      });
    }
  };

  const updateBookingStatus = async (
    bookingId: string,
    status: PrivateTourBooking['status'],
    paymentStatus?: PrivateTourBooking['paymentStatus']
  ) => {
    try {
      await privateToursAdminService.updateBookingStatus(bookingId, status, paymentStatus);
      await loadBookings();
      const stats = await privateToursAdminService.getBookingStats();
      setBookingStats(stats);
      toast({
        title: 'Booking updated',
        description: `Status changed to ${status}`
      });
    } catch (error) {
      toast({
        title: 'Failed to update booking',
        variant: 'destructive'
      });
    }
  };

  // Destination handlers
  const addDestination = () => {
    const newDest: TourDestination = {
      id: `new-${Date.now()}`,
      name: 'New Destination',
      category: 'cultural',
      description: '',
      thumbnail: '',
      entranceFeeUSD: 0,
      recommendedDuration: '2-3 hours',
      coordinates: { lat: 7.8731, lng: 80.7718 },
      highlights: [],
      isActive: false,
      order: content.destinations.length
    };
    updateContent('destinations', [...content.destinations, newDest]);
  };

  const updateDestination = (index: number, updates: Partial<TourDestination>) => {
    const updated = [...content.destinations];
    updated[index] = { ...updated[index], ...updates };
    updateContent('destinations', updated);
  };

  const deleteDestination = async (index: number) => {
    const dest = content.destinations[index];
    if (!dest.id.startsWith('new-')) {
      await privateToursAdminService.deleteDestination(dest.id);
    }
    updateContent('destinations', content.destinations.filter((_, i) => i !== index));
  };

  // Vehicle handlers
  const addVehicle = () => {
    const newVehicle: TourVehicle = {
      id: `new-${Date.now()}`,
      name: 'New Vehicle',
      type: 'sedan',
      maxPassengers: 3,
      description: '',
      thumbnail: '',
      features: [],
      pricePerDayUSD: 50,
      isActive: false,
      order: content.vehicles.length
    };
    updateContent('vehicles', [...content.vehicles, newVehicle]);
  };

  const updateVehicle = (index: number, updates: Partial<TourVehicle>) => {
    const updated = [...content.vehicles];
    updated[index] = { ...updated[index], ...updates };
    updateContent('vehicles', updated);
  };

  const deleteVehicle = async (index: number) => {
    const vehicle = content.vehicles[index];
    if (!vehicle.id.startsWith('new-')) {
      await privateToursAdminService.deleteVehicle(vehicle.id);
    }
    updateContent('vehicles', content.vehicles.filter((_, i) => i !== index));
  };

  // Driver handlers
  const addDriver = () => {
    const newDriver: TourDriver = {
      id: `new-${Date.now()}`,
      type: 'normal',
      name: 'New Driver Type',
      description: '',
      pricePerDayUSD: 0,
      features: [],
      recommended: false,
      isActive: false
    };
    updateContent('drivers', [...content.drivers, newDriver]);
  };

  const updateDriver = (index: number, updates: Partial<TourDriver>) => {
    const updated = [...content.drivers];
    updated[index] = { ...updated[index], ...updates };
    updateContent('drivers', updated);
  };

  const deleteDriver = async (index: number) => {
    const driver = content.drivers[index];
    if (!driver.id.startsWith('new-')) {
      await privateToursAdminService.deleteDriver(driver.id);
    }
    updateContent('drivers', content.drivers.filter((_, i) => i !== index));
  };

  // Extra handlers
  const addExtra = () => {
    const newExtra: TourExtra = {
      id: `new-${Date.now()}`,
      name: 'New Extra',
      description: '',
      icon: 'plus',
      priceUSD: 0,
      perUnit: 'day',
      isActive: false
    };
    updateContent('extras', [...content.extras, newExtra]);
  };

  const updateExtra = (index: number, updates: Partial<TourExtra>) => {
    const updated = [...content.extras];
    updated[index] = { ...updated[index], ...updates };
    updateContent('extras', updated);
  };

  const deleteExtra = async (index: number) => {
    const extra = content.extras[index];
    if (!extra.id.startsWith('new-')) {
      await privateToursAdminService.deleteExtra(extra.id);
    }
    updateContent('extras', content.extras.filter((_, i) => i !== index));
  };

  // Package handlers
  const addPackage = () => {
    const newPkg: TourPackage = {
      id: `new-${Date.now()}`,
      name: 'New Tour Package',
      duration: '1 Day',
      destinations: [],
      description: '',
      thumbnail: '',
      highlights: [],
      priceFromUSD: 100,
      includedVehicle: '',
      includedDriver: 'normal',
      inclusions: [],
      exclusions: [],
      itinerary: [],
      isPublished: false,
      featured: false,
      order: content.packages.length
    };
    updateContent('packages', [...content.packages, newPkg]);
  };

  const updatePackage = (index: number, updates: Partial<TourPackage>) => {
    const updated = [...content.packages];
    updated[index] = { ...updated[index], ...updates };
    updateContent('packages', updated);
  };

  const deletePackage = async (index: number) => {
    const pkg = content.packages[index];
    if (!pkg.id.startsWith('new-')) {
      await privateToursAdminService.deletePackage(pkg.id);
    }
    updateContent('packages', content.packages.filter((_, i) => i !== index));
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'confirmed': return 'bg-blue-100 text-blue-800';
      case 'in-progress': return 'bg-purple-100 text-purple-800';
      case 'completed': return 'bg-green-100 text-green-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPaymentStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-orange-100 text-orange-800';
      case 'partial': return 'bg-yellow-100 text-yellow-800';
      case 'paid': return 'bg-green-100 text-green-800';
      case 'refunded': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <RefreshCw className="w-8 h-8 animate-spin text-emerald-600" />
        <span className="ml-2">Loading Private Tours content...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <Car className="w-6 h-6 text-emerald-600" />
            Private Tours Management
          </h2>
          <p className="text-gray-500">Manage destinations, vehicles, drivers, packages, and bookings</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleSeedData}>
            <Download className="w-4 h-4 mr-2" />
            Seed Default Data
          </Button>
          <Button onClick={handleSave} disabled={saving}>
            {saving ? <RefreshCw className="w-4 h-4 mr-2 animate-spin" /> : null}
            Save All Changes
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
        <Card>
          <CardContent className="pt-4">
            <div className="text-2xl font-bold text-gray-900">{bookingStats.total}</div>
            <p className="text-xs text-gray-500">Total Bookings</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4">
            <div className="text-2xl font-bold text-yellow-600">{bookingStats.pending}</div>
            <p className="text-xs text-gray-500">Pending</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4">
            <div className="text-2xl font-bold text-blue-600">{bookingStats.confirmed}</div>
            <p className="text-xs text-gray-500">Confirmed</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4">
            <div className="text-2xl font-bold text-green-600">{bookingStats.completed}</div>
            <p className="text-xs text-gray-500">Completed</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4">
            <div className="text-2xl font-bold text-red-600">{bookingStats.cancelled}</div>
            <p className="text-xs text-gray-500">Cancelled</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4">
            <div className="text-2xl font-bold text-emerald-600">${bookingStats.totalRevenue.toLocaleString()}</div>
            <p className="text-xs text-gray-500">Total Revenue</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="bookings" className="space-y-4">
        <TabsList className="grid w-full grid-cols-8 lg:w-auto">
          <TabsTrigger value="bookings">Bookings</TabsTrigger>
          <TabsTrigger value="hero">Hero</TabsTrigger>
          <TabsTrigger value="destinations">Destinations</TabsTrigger>
          <TabsTrigger value="vehicles">Vehicles</TabsTrigger>
          <TabsTrigger value="drivers">Drivers</TabsTrigger>
          <TabsTrigger value="extras">Extras</TabsTrigger>
          <TabsTrigger value="packages">Packages</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>

        {/* Bookings Tab */}
        <TabsContent value="bookings">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle>Tour Bookings</CardTitle>
                  <CardDescription>Manage and track all private tour bookings</CardDescription>
                </div>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-40">
                    <SelectValue placeholder="Filter by status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Bookings</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="confirmed">Confirmed</SelectItem>
                    <SelectItem value="in-progress">In Progress</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                    <SelectItem value="cancelled">Cancelled</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardHeader>
            <CardContent>
              {bookings.length === 0 ? (
                <p className="text-gray-500 text-center py-8">No bookings found.</p>
              ) : (
                <div className="space-y-4">
                  {bookings.map((booking) => (
                    <Card key={booking.id} className="border-l-4 border-l-emerald-500">
                      <CardContent className="pt-4">
                        <div className="flex justify-between items-start">
                          <div className="space-y-2">
                            <div className="flex items-center gap-2">
                              <span className="font-bold text-lg">{booking.bookingReference}</span>
                              <Badge className={getStatusColor(booking.status)}>{booking.status}</Badge>
                              <Badge className={getPaymentStatusColor(booking.paymentStatus)}>{booking.paymentStatus}</Badge>
                            </div>
                            <div className="text-sm text-gray-600">
                              <p><strong>Customer:</strong> {booking.customerName} ({booking.customerEmail})</p>
                              <p><strong>Phone:</strong> {booking.customerPhone}</p>
                              <p><strong>Date:</strong> {booking.date} at {booking.pickupTime}</p>
                              <p><strong>Pickup:</strong> {booking.pickupLocation}</p>
                              <p><strong>Destinations:</strong> {booking.destinations.join(', ')}</p>
                              <p><strong>Passengers:</strong> {booking.passengers} | <strong>Driver:</strong> {booking.driverType}</p>
                            </div>
                            <div className="text-lg font-bold text-emerald-600">
                              Total: ${booking.totalPrice.toFixed(2)}
                            </div>
                          </div>
                          <div className="flex flex-col gap-2">
                            {booking.status === 'pending' && (
                              <>
                                <Button size="sm" onClick={() => updateBookingStatus(booking.id, 'confirmed')}>
                                  <CheckCircle className="w-4 h-4 mr-1" /> Confirm
                                </Button>
                                <Button size="sm" variant="destructive" onClick={() => updateBookingStatus(booking.id, 'cancelled')}>
                                  <XCircle className="w-4 h-4 mr-1" /> Cancel
                                </Button>
                              </>
                            )}
                            {booking.status === 'confirmed' && (
                              <>
                                <Button size="sm" onClick={() => updateBookingStatus(booking.id, 'in-progress')}>
                                  <Clock className="w-4 h-4 mr-1" /> Start Tour
                                </Button>
                                <Button size="sm" variant="outline" onClick={() => updateBookingStatus(booking.id, 'confirmed', 'paid')}>
                                  <DollarSign className="w-4 h-4 mr-1" /> Mark Paid
                                </Button>
                              </>
                            )}
                            {booking.status === 'in-progress' && (
                              <Button size="sm" onClick={() => updateBookingStatus(booking.id, 'completed')}>
                                <CheckCircle className="w-4 h-4 mr-1" /> Complete
                              </Button>
                            )}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Hero Tab */}
        <TabsContent value="hero">
          <Card>
            <CardHeader>
              <CardTitle>Hero Section</CardTitle>
              <CardDescription>Configure the main banner of the Private Tours page</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label>Title</Label>
                <Input
                  value={content.hero.title}
                  onChange={(e) => updateContent('hero', { ...content.hero, title: e.target.value })}
                />
              </div>
              <div>
                <Label>Subtitle</Label>
                <Input
                  value={content.hero.subtitle}
                  onChange={(e) => updateContent('hero', { ...content.hero, subtitle: e.target.value })}
                />
              </div>
              <div>
                <Label>Background Images (one URL per line)</Label>
                <Textarea
                  value={content.hero.backgroundImages.join('\n')}
                  onChange={(e) => updateContent('hero', { ...content.hero, backgroundImages: multilineToList(e.target.value) })}
                  rows={4}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>CTA Button Text</Label>
                  <Input
                    value={content.hero.ctaText}
                    onChange={(e) => updateContent('hero', { ...content.hero, ctaText: e.target.value })}
                  />
                </div>
                <div>
                  <Label>CTA Link</Label>
                  <Input
                    value={content.hero.ctaLink}
                    onChange={(e) => updateContent('hero', { ...content.hero, ctaLink: e.target.value })}
                  />
                </div>
              </div>
              <div>
                <Label>Intro Headline</Label>
                <Input
                  value={content.intro.headline}
                  onChange={(e) => updateContent('intro', { ...content.intro, headline: e.target.value })}
                />
              </div>
              <div>
                <Label>Intro Description</Label>
                <Textarea
                  value={content.intro.description}
                  onChange={(e) => updateContent('intro', { ...content.intro, description: e.target.value })}
                  rows={3}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Destinations Tab */}
        <TabsContent value="destinations">
          <Card>
            <CardHeader>
              <CardTitle className="flex justify-between items-center">
                <span>Tour Destinations</span>
                <Button onClick={addDestination} size="sm">
                  <Plus className="w-4 h-4 mr-1" /> Add Destination
                </Button>
              </CardTitle>
              <CardDescription>Manage available destinations for private tours</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {content.destinations.length === 0 ? (
                <p className="text-gray-500 text-center py-8">No destinations yet. Click "Add Destination" or "Seed Default Data".</p>
              ) : (
                content.destinations.map((dest, index) => (
                  <Card key={dest.id} className="border-l-4 border-l-blue-500">
                    <CardContent className="pt-6 space-y-4">
                      <div className="flex justify-between items-start">
                        <div className="flex-1 grid grid-cols-2 gap-4">
                          <div>
                            <Label>Name</Label>
                            <Input
                              value={dest.name}
                              onChange={(e) => updateDestination(index, { name: e.target.value })}
                            />
                          </div>
                          <div>
                            <Label>Category</Label>
                            <Select
                              value={dest.category}
                              onValueChange={(value: TourDestination['category']) => updateDestination(index, { category: value })}
                            >
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="cultural">Cultural</SelectItem>
                                <SelectItem value="wildlife">Wildlife</SelectItem>
                                <SelectItem value="beach">Beach</SelectItem>
                                <SelectItem value="hill-country">Hill Country</SelectItem>
                                <SelectItem value="religious">Religious</SelectItem>
                                <SelectItem value="adventure">Adventure</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          <div>
                            <Label>Entrance Fee (USD)</Label>
                            <Input
                              type="number"
                              value={dest.entranceFeeUSD}
                              onChange={(e) => updateDestination(index, { entranceFeeUSD: parseFloat(e.target.value) || 0 })}
                            />
                          </div>
                          <div>
                            <Label>Recommended Duration</Label>
                            <Input
                              value={dest.recommendedDuration}
                              onChange={(e) => updateDestination(index, { recommendedDuration: e.target.value })}
                            />
                          </div>
                        </div>
                        <Button variant="ghost" size="icon" className="text-red-500" onClick={() => deleteDestination(index)}>
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                      <div>
                        <Label>Description</Label>
                        <Textarea
                          value={dest.description}
                          onChange={(e) => updateDestination(index, { description: e.target.value })}
                          rows={2}
                        />
                      </div>
                      <div>
                        <Label>Thumbnail</Label>
                        <ImageUpload
                          value={dest.thumbnail}
                          onChange={(url) => updateDestination(index, { thumbnail: url })}
                        />
                      </div>
                      <div>
                        <Label>Highlights (one per line)</Label>
                        <Textarea
                          value={listToMultiline(dest.highlights)}
                          onChange={(e) => updateDestination(index, { highlights: multilineToList(e.target.value) })}
                          rows={3}
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label>Latitude</Label>
                          <Input
                            type="number"
                            step="0.0001"
                            value={dest.coordinates.lat}
                            onChange={(e) => updateDestination(index, { coordinates: { ...dest.coordinates, lat: parseFloat(e.target.value) || 0 } })}
                          />
                        </div>
                        <div>
                          <Label>Longitude</Label>
                          <Input
                            type="number"
                            step="0.0001"
                            value={dest.coordinates.lng}
                            onChange={(e) => updateDestination(index, { coordinates: { ...dest.coordinates, lng: parseFloat(e.target.value) || 0 } })}
                          />
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Switch
                          checked={dest.isActive}
                          onCheckedChange={(checked) => updateDestination(index, { isActive: checked })}
                        />
                        <Label>Active</Label>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Vehicles Tab */}
        <TabsContent value="vehicles">
          <Card>
            <CardHeader>
              <CardTitle className="flex justify-between items-center">
                <span>Tour Vehicles</span>
                <Button onClick={addVehicle} size="sm">
                  <Plus className="w-4 h-4 mr-1" /> Add Vehicle
                </Button>
              </CardTitle>
              <CardDescription>Manage available vehicles for private tours</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {content.vehicles.length === 0 ? (
                <p className="text-gray-500 text-center py-8">No vehicles yet. Click "Add Vehicle" or "Seed Default Data".</p>
              ) : (
                content.vehicles.map((vehicle, index) => (
                  <Card key={vehicle.id} className="border-l-4 border-l-purple-500">
                    <CardContent className="pt-6 space-y-4">
                      <div className="flex justify-between items-start">
                        <div className="flex-1 grid grid-cols-2 gap-4">
                          <div>
                            <Label>Name</Label>
                            <Input
                              value={vehicle.name}
                              onChange={(e) => updateVehicle(index, { name: e.target.value })}
                            />
                          </div>
                          <div>
                            <Label>Type</Label>
                            <Select
                              value={vehicle.type}
                              onValueChange={(value) => updateVehicle(index, { type: value })}
                            >
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="sedan">Sedan</SelectItem>
                                <SelectItem value="suv">SUV</SelectItem>
                                <SelectItem value="van">Van</SelectItem>
                                <SelectItem value="minibus">Minibus</SelectItem>
                                <SelectItem value="luxury">Luxury</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          <div>
                            <Label>Max Passengers</Label>
                            <Input
                              type="number"
                              value={vehicle.maxPassengers}
                              onChange={(e) => updateVehicle(index, { maxPassengers: parseInt(e.target.value) || 1 })}
                            />
                          </div>
                          <div>
                            <Label>Price Per Day (USD)</Label>
                            <Input
                              type="number"
                              value={vehicle.pricePerDayUSD}
                              onChange={(e) => updateVehicle(index, { pricePerDayUSD: parseFloat(e.target.value) || 0 })}
                            />
                          </div>
                        </div>
                        <Button variant="ghost" size="icon" className="text-red-500" onClick={() => deleteVehicle(index)}>
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                      <div>
                        <Label>Description</Label>
                        <Textarea
                          value={vehicle.description}
                          onChange={(e) => updateVehicle(index, { description: e.target.value })}
                          rows={2}
                        />
                      </div>
                      <div>
                        <Label>Thumbnail</Label>
                        <ImageUpload
                          value={vehicle.thumbnail}
                          onChange={(url) => updateVehicle(index, { thumbnail: url })}
                        />
                      </div>
                      <div>
                        <Label>Features (one per line)</Label>
                        <Textarea
                          value={listToMultiline(vehicle.features)}
                          onChange={(e) => updateVehicle(index, { features: multilineToList(e.target.value) })}
                          rows={3}
                        />
                      </div>
                      <div className="flex items-center gap-2">
                        <Switch
                          checked={vehicle.isActive}
                          onCheckedChange={(checked) => updateVehicle(index, { isActive: checked })}
                        />
                        <Label>Active</Label>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Drivers Tab */}
        <TabsContent value="drivers">
          <Card>
            <CardHeader>
              <CardTitle className="flex justify-between items-center">
                <span>Driver Types</span>
                <Button onClick={addDriver} size="sm">
                  <Plus className="w-4 h-4 mr-1" /> Add Driver Type
                </Button>
              </CardTitle>
              <CardDescription>Manage driver options: Normal, SLTDA Certified, Driver Guide</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {content.drivers.length === 0 ? (
                <p className="text-gray-500 text-center py-8">No driver types yet. Click "Add Driver Type" or "Seed Default Data".</p>
              ) : (
                content.drivers.map((driver, index) => (
                  <Card key={driver.id} className="border-l-4 border-l-amber-500">
                    <CardContent className="pt-6 space-y-4">
                      <div className="flex justify-between items-start">
                        <div className="flex-1 grid grid-cols-2 gap-4">
                          <div>
                            <Label>Name</Label>
                            <Input
                              value={driver.name}
                              onChange={(e) => updateDriver(index, { name: e.target.value })}
                            />
                          </div>
                          <div>
                            <Label>Type</Label>
                            <Select
                              value={driver.type}
                              onValueChange={(value: TourDriver['type']) => updateDriver(index, { type: value })}
                            >
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="normal">Normal Driver</SelectItem>
                                <SelectItem value="sltda-certified">SLTDA Certified</SelectItem>
                                <SelectItem value="driver-guide">Driver Guide</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          <div>
                            <Label>Additional Price Per Day (USD)</Label>
                            <Input
                              type="number"
                              value={driver.pricePerDayUSD}
                              onChange={(e) => updateDriver(index, { pricePerDayUSD: parseFloat(e.target.value) || 0 })}
                            />
                          </div>
                          <div className="flex items-center gap-4 pt-6">
                            <div className="flex items-center gap-2">
                              <Switch
                                checked={driver.recommended}
                                onCheckedChange={(checked) => updateDriver(index, { recommended: checked })}
                              />
                              <Label>Recommended</Label>
                            </div>
                          </div>
                        </div>
                        <Button variant="ghost" size="icon" className="text-red-500" onClick={() => deleteDriver(index)}>
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                      <div>
                        <Label>Description</Label>
                        <Textarea
                          value={driver.description}
                          onChange={(e) => updateDriver(index, { description: e.target.value })}
                          rows={2}
                        />
                      </div>
                      <div>
                        <Label>Features (one per line)</Label>
                        <Textarea
                          value={listToMultiline(driver.features)}
                          onChange={(e) => updateDriver(index, { features: multilineToList(e.target.value) })}
                          rows={4}
                        />
                      </div>
                      <div className="flex items-center gap-2">
                        <Switch
                          checked={driver.isActive}
                          onCheckedChange={(checked) => updateDriver(index, { isActive: checked })}
                        />
                        <Label>Active</Label>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Extras Tab */}
        <TabsContent value="extras">
          <Card>
            <CardHeader>
              <CardTitle className="flex justify-between items-center">
                <span>Tour Extras</span>
                <Button onClick={addExtra} size="sm">
                  <Plus className="w-4 h-4 mr-1" /> Add Extra
                </Button>
              </CardTitle>
              <CardDescription>Manage additional services and add-ons</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {content.extras.length === 0 ? (
                <p className="text-gray-500 text-center py-8">No extras yet. Click "Add Extra" or "Seed Default Data".</p>
              ) : (
                content.extras.map((extra, index) => (
                  <Card key={extra.id} className="border-l-4 border-l-green-500">
                    <CardContent className="pt-6 space-y-4">
                      <div className="flex justify-between items-start">
                        <div className="flex-1 grid grid-cols-3 gap-4">
                          <div>
                            <Label>Name</Label>
                            <Input
                              value={extra.name}
                              onChange={(e) => updateExtra(index, { name: e.target.value })}
                            />
                          </div>
                          <div>
                            <Label>Price (USD)</Label>
                            <Input
                              type="number"
                              value={extra.priceUSD}
                              onChange={(e) => updateExtra(index, { priceUSD: parseFloat(e.target.value) || 0 })}
                            />
                          </div>
                          <div>
                            <Label>Per</Label>
                            <Select
                              value={extra.perUnit}
                              onValueChange={(value: TourExtra['perUnit']) => updateExtra(index, { perUnit: value })}
                            >
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="day">Per Day</SelectItem>
                                <SelectItem value="trip">Per Trip</SelectItem>
                                <SelectItem value="person">Per Person</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </div>
                        <Button variant="ghost" size="icon" className="text-red-500" onClick={() => deleteExtra(index)}>
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                      <div>
                        <Label>Description</Label>
                        <Input
                          value={extra.description}
                          onChange={(e) => updateExtra(index, { description: e.target.value })}
                        />
                      </div>
                      <div>
                        <Label>Icon (lucide icon name)</Label>
                        <Input
                          value={extra.icon}
                          onChange={(e) => updateExtra(index, { icon: e.target.value })}
                          placeholder="e.g., utensils, wifi, camera"
                        />
                      </div>
                      <div className="flex items-center gap-2">
                        <Switch
                          checked={extra.isActive}
                          onCheckedChange={(checked) => updateExtra(index, { isActive: checked })}
                        />
                        <Label>Active</Label>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Packages Tab */}
        <TabsContent value="packages">
          <Card>
            <CardHeader>
              <CardTitle className="flex justify-between items-center">
                <span>Tour Packages</span>
                <Button onClick={addPackage} size="sm">
                  <Plus className="w-4 h-4 mr-1" /> Add Package
                </Button>
              </CardTitle>
              <CardDescription>Manage pre-built tour packages</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {content.packages.length === 0 ? (
                <p className="text-gray-500 text-center py-8">No packages yet. Click "Add Package" to create one.</p>
              ) : (
                content.packages.map((pkg, index) => (
                  <Card key={pkg.id} className="border-l-4 border-l-indigo-500">
                    <CardContent className="pt-6 space-y-4">
                      <div className="flex justify-between items-start">
                        <div className="flex-1 grid grid-cols-2 gap-4">
                          <div>
                            <Label>Package Name</Label>
                            <Input
                              value={pkg.name}
                              onChange={(e) => updatePackage(index, { name: e.target.value })}
                            />
                          </div>
                          <div>
                            <Label>Duration</Label>
                            <Input
                              value={pkg.duration}
                              onChange={(e) => updatePackage(index, { duration: e.target.value })}
                              placeholder="e.g., 3 Days / 2 Nights"
                            />
                          </div>
                          <div>
                            <Label>Starting Price (USD)</Label>
                            <Input
                              type="number"
                              value={pkg.priceFromUSD}
                              onChange={(e) => updatePackage(index, { priceFromUSD: parseFloat(e.target.value) || 0 })}
                            />
                          </div>
                          <div>
                            <Label>Included Driver Type</Label>
                            <Select
                              value={pkg.includedDriver}
                              onValueChange={(value) => updatePackage(index, { includedDriver: value })}
                            >
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="normal">Normal Driver</SelectItem>
                                <SelectItem value="sltda-certified">SLTDA Certified</SelectItem>
                                <SelectItem value="driver-guide">Driver Guide</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </div>
                        <Button variant="ghost" size="icon" className="text-red-500" onClick={() => deletePackage(index)}>
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                      <div>
                        <Label>Description</Label>
                        <Textarea
                          value={pkg.description}
                          onChange={(e) => updatePackage(index, { description: e.target.value })}
                          rows={2}
                        />
                      </div>
                      <div>
                        <Label>Thumbnail</Label>
                        <ImageUpload
                          value={pkg.thumbnail}
                          onChange={(url) => updatePackage(index, { thumbnail: url })}
                        />
                      </div>
                      <div>
                        <Label>Destinations (comma separated)</Label>
                        <Input
                          value={pkg.destinations.join(', ')}
                          onChange={(e) => updatePackage(index, { destinations: e.target.value.split(',').map(d => d.trim()).filter(Boolean) })}
                        />
                      </div>
                      <div>
                        <Label>Highlights (one per line)</Label>
                        <Textarea
                          value={listToMultiline(pkg.highlights)}
                          onChange={(e) => updatePackage(index, { highlights: multilineToList(e.target.value) })}
                          rows={3}
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label>Inclusions (one per line)</Label>
                          <Textarea
                            value={listToMultiline(pkg.inclusions)}
                            onChange={(e) => updatePackage(index, { inclusions: multilineToList(e.target.value) })}
                            rows={3}
                          />
                        </div>
                        <div>
                          <Label>Exclusions (one per line)</Label>
                          <Textarea
                            value={listToMultiline(pkg.exclusions)}
                            onChange={(e) => updatePackage(index, { exclusions: multilineToList(e.target.value) })}
                            rows={3}
                          />
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2">
                          <Switch
                            checked={pkg.isPublished}
                            onCheckedChange={(checked) => updatePackage(index, { isPublished: checked })}
                          />
                          <Label>Published</Label>
                        </div>
                        <div className="flex items-center gap-2">
                          <Switch
                            checked={pkg.featured}
                            onCheckedChange={(checked) => updatePackage(index, { featured: checked })}
                          />
                          <Label>Featured</Label>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Settings Tab */}
        <TabsContent value="settings">
          <Card>
            <CardHeader>
              <CardTitle>Booking Settings</CardTitle>
              <CardDescription>Configure booking settings and contact information</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Deposit Percentage</Label>
                  <Input
                    type="number"
                    value={content.booking.depositPercent}
                    onChange={(e) => updateContent('booking', { ...content.booking, depositPercent: parseInt(e.target.value) || 0 })}
                  />
                </div>
                <div>
                  <Label>Response Time</Label>
                  <Input
                    value={content.booking.responseTime}
                    onChange={(e) => updateContent('booking', { ...content.booking, responseTime: e.target.value })}
                  />
                </div>
              </div>
              <div>
                <Label>Deposit Note</Label>
                <Input
                  value={content.booking.depositNote}
                  onChange={(e) => updateContent('booking', { ...content.booking, depositNote: e.target.value })}
                />
              </div>
              <div>
                <Label>Cancellation Policy</Label>
                <Textarea
                  value={content.booking.cancellationPolicy}
                  onChange={(e) => updateContent('booking', { ...content.booking, cancellationPolicy: e.target.value })}
                  rows={3}
                />
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <Label>WhatsApp</Label>
                  <Input
                    value={content.booking.whatsapp}
                    onChange={(e) => updateContent('booking', { ...content.booking, whatsapp: e.target.value })}
                  />
                </div>
                <div>
                  <Label>Email</Label>
                  <Input
                    value={content.booking.email}
                    onChange={(e) => updateContent('booking', { ...content.booking, email: e.target.value })}
                  />
                </div>
                <div>
                  <Label>Phone</Label>
                  <Input
                    value={content.booking.phone}
                    onChange={(e) => updateContent('booking', { ...content.booking, phone: e.target.value })}
                  />
                </div>
              </div>
              <div>
                <Label>Pickup Locations (one per line)</Label>
                <Textarea
                  value={listToMultiline(content.booking.pickupLocations)}
                  onChange={(e) => updateContent('booking', { ...content.booking, pickupLocations: multilineToList(e.target.value) })}
                  rows={4}
                />
              </div>
              <div>
                <Label>Payment Methods (one per line)</Label>
                <Textarea
                  value={listToMultiline(content.booking.paymentMethods)}
                  onChange={(e) => updateContent('booking', { ...content.booking, paymentMethods: multilineToList(e.target.value) })}
                  rows={3}
                />
              </div>
            </CardContent>
          </Card>

          <Card className="mt-6">
            <CardHeader>
              <CardTitle>CTA Section</CardTitle>
              <CardDescription>Configure the call-to-action section</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label>Headline</Label>
                <Input
                  value={content.cta.headline}
                  onChange={(e) => updateContent('cta', { ...content.cta, headline: e.target.value })}
                />
              </div>
              <div>
                <Label>Subtitle</Label>
                <Textarea
                  value={content.cta.subtitle}
                  onChange={(e) => updateContent('cta', { ...content.cta, subtitle: e.target.value })}
                  rows={2}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Button Text</Label>
                  <Input
                    value={content.cta.buttonText}
                    onChange={(e) => updateContent('cta', { ...content.cta, buttonText: e.target.value })}
                  />
                </div>
                <div>
                  <Label>Button Link</Label>
                  <Input
                    value={content.cta.buttonLink}
                    onChange={(e) => updateContent('cta', { ...content.cta, buttonLink: e.target.value })}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default PrivateToursManager;
