import { useState, useEffect } from 'react';
import { Loader2, Plus, Edit, Trash2, Eye, EyeOff, Star, Calendar, Users, DollarSign, MapPin, Filter, Download, Search, MessageCircle, Mail, Phone, CheckCircle, XCircle, Clock, ChefHat, Camera, Mountain, Palmtree, Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { db } from '@/lib/firebase';
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc, query, orderBy, Timestamp, where } from 'firebase/firestore';

// Types
interface Tour {
  id: string;
  title: string;
  subtitle: string;
  slug: string;
  category: string;
  region: string;
  location: string;
  duration: string;
  durationDays: number;
  priceUSD: number;
  description: string;
  highlights: string[];
  inclusions: string[];
  exclusions: string[];
  heroImage: string;
  imageGallery: string[];
  isFeatured: boolean;
  isActive: boolean;
  rating: number;
  reviewCount: number;
  bookingCount: number;
  maxGroupSize: number;
  createdAt: any;
}

interface Booking {
  id: string;
  bookingRef: string;
  tourId: string;
  tourTitle: string;
  tourCategory: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  nationality: string;
  travellersAdults: number;
  travellersKids: number;
  travelDate: string;
  pickupLocation: string;
  additionalNotes: string;
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed';
  paymentStatus: 'unpaid' | 'partial' | 'paid';
  totalAmountUSD: number;
  adminNotes: string;
  createdAt: any;
}

const CATEGORIES = [
  { id: 'culinary', label: 'Culinary', icon: ChefHat },
  { id: 'wildlife', label: 'Wildlife', icon: Camera },
  { id: 'cultural', label: 'Cultural', icon: MapPin },
  { id: 'adventure', label: 'Adventure', icon: Mountain },
  { id: 'beach', label: 'Beach', icon: Palmtree },
  { id: 'wellness', label: 'Wellness', icon: Heart },
];

const GlobalToursAdmin = () => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('bookings');
  const [tours, setTours] = useState<Tour[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [filter, setFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [editingTour, setEditingTour] = useState<Tour | null>(null);
  const [showTourDialog, setShowTourDialog] = useState(false);

  useEffect(() => { loadData(); }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      // Load tours
      const toursQ = query(collection(db, 'globalTours'), orderBy('createdAt', 'desc'));
      const toursSnap = await getDocs(toursQ);
      setTours(toursSnap.docs.map(d => ({ id: d.id, ...d.data() } as Tour)));

      // Load bookings
      const bookingsQ = query(collection(db, 'globalTourBookings'), orderBy('createdAt', 'desc'));
      const bookingsSnap = await getDocs(bookingsQ);
      setBookings(bookingsSnap.docs.map(d => ({ id: d.id, ...d.data() } as Booking)));
    } catch (e) { console.error(e); }
    setLoading(false);
  };

  const updateBookingStatus = async (id: string, status: Booking['status']) => {
    try {
      await updateDoc(doc(db, 'globalTourBookings', id), { status, updatedAt: Timestamp.now() });
      setBookings(prev => prev.map(b => b.id === id ? { ...b, status } : b));
      toast({ title: `Booking ${status}` });
    } catch (e) { toast({ title: 'Error', variant: 'destructive' }); }
  };

  const updatePaymentStatus = async (id: string, paymentStatus: Booking['paymentStatus']) => {
    try {
      await updateDoc(doc(db, 'globalTourBookings', id), { paymentStatus, updatedAt: Timestamp.now() });
      setBookings(prev => prev.map(b => b.id === id ? { ...b, paymentStatus } : b));
      toast({ title: `Payment marked as ${paymentStatus}` });
    } catch (e) { toast({ title: 'Error', variant: 'destructive' }); }
  };

  const toggleTourActive = async (id: string, isActive: boolean) => {
    try {
      await updateDoc(doc(db, 'globalTours', id), { isActive, updatedAt: Timestamp.now() });
      setTours(prev => prev.map(t => t.id === id ? { ...t, isActive } : t));
      toast({ title: isActive ? 'Tour published' : 'Tour unpublished' });
    } catch (e) { toast({ title: 'Error', variant: 'destructive' }); }
  };

  const toggleTourFeatured = async (id: string, isFeatured: boolean) => {
    try {
      await updateDoc(doc(db, 'globalTours', id), { isFeatured, updatedAt: Timestamp.now() });
      setTours(prev => prev.map(t => t.id === id ? { ...t, isFeatured } : t));
      toast({ title: isFeatured ? 'Tour featured' : 'Tour unfeatured' });
    } catch (e) { toast({ title: 'Error', variant: 'destructive' }); }
  };

  const deleteTour = async (id: string) => {
    if (!confirm('Delete this tour?')) return;
    try {
      await deleteDoc(doc(db, 'globalTours', id));
      setTours(prev => prev.filter(t => t.id !== id));
      toast({ title: 'Tour deleted' });
    } catch (e) { toast({ title: 'Error', variant: 'destructive' }); }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'confirmed': return 'bg-green-100 text-green-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      case 'completed': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPaymentColor = (status: string) => {
    switch (status) {
      case 'paid': return 'bg-green-100 text-green-800';
      case 'partial': return 'bg-orange-100 text-orange-800';
      case 'unpaid': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const exportCSV = () => {
    const headers = ['Booking Ref', 'Tour', 'Customer', 'Email', 'Phone', 'Date', 'Adults', 'Kids', 'Total USD', 'Status', 'Payment'];
    const rows = filteredBookings.map(b => [b.bookingRef, b.tourTitle, b.customerName, b.customerEmail, b.customerPhone, b.travelDate, b.travellersAdults, b.travellersKids, b.totalAmountUSD, b.status, b.paymentStatus]);
    const csv = [headers, ...rows].map(r => r.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `bookings-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
  };

  const filteredBookings = bookings.filter(b => {
    if (filter !== 'all' && b.status !== filter) return false;
    if (categoryFilter !== 'all' && b.tourCategory !== categoryFilter) return false;
    if (searchQuery && !b.customerName.toLowerCase().includes(searchQuery.toLowerCase()) && !b.bookingRef.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    return true;
  });

  const stats = {
    totalBookings: bookings.length,
    pending: bookings.filter(b => b.status === 'pending').length,
    confirmed: bookings.filter(b => b.status === 'confirmed').length,
    totalRevenue: bookings.filter(b => b.paymentStatus === 'paid').reduce((s, b) => s + b.totalAmountUSD, 0),
    activeTours: tours.filter(t => t.isActive).length
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center"><Loader2 className="w-10 h-10 animate-spin text-amber-500" /></div>;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-amber-600 to-orange-600 text-white py-6 px-6">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-2xl font-bold">Global Tours Admin</h1>
          <p className="text-amber-100">Manage tours and bookings</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-6">
        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
          {[
            { label: 'Total Bookings', value: stats.totalBookings, color: 'bg-blue-500' },
            { label: 'Pending', value: stats.pending, color: 'bg-yellow-500' },
            { label: 'Confirmed', value: stats.confirmed, color: 'bg-green-500' },
            { label: 'Revenue (Paid)', value: `$${stats.totalRevenue.toLocaleString()}`, color: 'bg-emerald-500' },
            { label: 'Active Tours', value: stats.activeTours, color: 'bg-purple-500' }
          ].map((s, i) => (
            <Card key={i} className="border-0 shadow"><CardContent className="p-4 text-center">
              <div className={`w-10 h-10 ${s.color} rounded-full flex items-center justify-center mx-auto mb-2 text-white font-bold text-sm`}>{typeof s.value === 'number' && s.value < 100 ? s.value : ''}</div>
              <div className="font-bold text-lg">{s.value}</div>
              <div className="text-xs text-gray-500">{s.label}</div>
            </CardContent></Card>
          ))}
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-6">
            <TabsTrigger value="bookings">Bookings ({bookings.length})</TabsTrigger>
            <TabsTrigger value="tours">Tours ({tours.length})</TabsTrigger>
          </TabsList>

          {/* BOOKINGS TAB */}
          <TabsContent value="bookings">
            {/* Filters */}
            <div className="flex flex-wrap gap-3 mb-6">
              <div className="flex-1 min-w-[200px]">
                <Input placeholder="Search name or booking ref..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)} className="bg-white" />
              </div>
              <select value={filter} onChange={e => setFilter(e.target.value)} className="px-3 py-2 border rounded-md bg-white">
                <option value="all">All Status</option>
                <option value="pending">Pending</option>
                <option value="confirmed">Confirmed</option>
                <option value="cancelled">Cancelled</option>
                <option value="completed">Completed</option>
              </select>
              <select value={categoryFilter} onChange={e => setCategoryFilter(e.target.value)} className="px-3 py-2 border rounded-md bg-white">
                <option value="all">All Categories</option>
                {CATEGORIES.map(c => <option key={c.id} value={c.id}>{c.label}</option>)}
              </select>
              <Button variant="outline" onClick={exportCSV}><Download className="w-4 h-4 mr-2" />Export CSV</Button>
            </div>

            <div className="grid lg:grid-cols-2 gap-6">
              {/* Bookings List */}
              <div className="space-y-3">
                {filteredBookings.length === 0 ? (
                  <Card><CardContent className="p-8 text-center text-gray-500">No bookings found</CardContent></Card>
                ) : (
                  filteredBookings.map(b => (
                    <Card key={b.id} className={`cursor-pointer hover:shadow-lg transition-all ${selectedBooking?.id === b.id ? 'ring-2 ring-amber-500' : ''}`} onClick={() => setSelectedBooking(b)}>
                      <CardContent className="p-4">
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <div className="font-mono text-sm text-amber-600">{b.bookingRef}</div>
                            <div className="font-semibold">{b.customerName}</div>
                            <div className="text-sm text-gray-500">{b.tourTitle}</div>
                          </div>
                          <div className="text-right">
                            <Badge className={getStatusColor(b.status)}>{b.status}</Badge>
                            <div className="text-lg font-bold text-gray-800 mt-1">${b.totalAmountUSD}</div>
                          </div>
                        </div>
                        <div className="flex gap-4 text-sm text-gray-500">
                          <span><Calendar className="w-4 h-4 inline mr-1" />{b.travelDate}</span>
                          <span><Users className="w-4 h-4 inline mr-1" />{b.travellersAdults}A {b.travellersKids > 0 && `+ ${b.travellersKids}K`}</span>
                        </div>
                      </CardContent>
                    </Card>
                  ))
                )}
              </div>

              {/* Booking Detail */}
              <div className="lg:sticky lg:top-6">
                {selectedBooking ? (
                  <Card className="border-0 shadow-xl">
                    <CardHeader className="bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-t-lg">
                      <CardTitle className="flex justify-between items-center">
                        <span>{selectedBooking.bookingRef}</span>
                        <Badge className={`${getPaymentColor(selectedBooking.paymentStatus)}`}>{selectedBooking.paymentStatus}</Badge>
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="p-6 space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="bg-gray-50 p-3 rounded-lg"><span className="text-gray-500 block text-sm">Tour</span><strong>{selectedBooking.tourTitle}</strong></div>
                        <div className="bg-gray-50 p-3 rounded-lg"><span className="text-gray-500 block text-sm">Date</span><strong>{selectedBooking.travelDate}</strong></div>
                        <div className="bg-gray-50 p-3 rounded-lg"><span className="text-gray-500 block text-sm">Travelers</span><strong>{selectedBooking.travellersAdults} Adults, {selectedBooking.travellersKids} Kids</strong></div>
                        <div className="bg-gray-50 p-3 rounded-lg"><span className="text-gray-500 block text-sm">Total</span><strong className="text-xl text-amber-600">${selectedBooking.totalAmountUSD}</strong></div>
                      </div>

                      <div>
                        <h4 className="font-semibold mb-2">Customer</h4>
                        <div className="space-y-1 text-sm">
                          <div>{selectedBooking.customerName}</div>
                          <a href={`mailto:${selectedBooking.customerEmail}`} className="text-amber-600 flex items-center gap-1"><Mail className="w-4 h-4" />{selectedBooking.customerEmail}</a>
                          <a href={`tel:${selectedBooking.customerPhone}`} className="text-amber-600 flex items-center gap-1"><Phone className="w-4 h-4" />{selectedBooking.customerPhone}</a>
                          <div className="text-gray-500">{selectedBooking.nationality}</div>
                        </div>
                      </div>

                      {selectedBooking.pickupLocation && (
                        <div><h4 className="font-semibold mb-1">Pickup</h4><p className="text-sm">{selectedBooking.pickupLocation}</p></div>
                      )}
                      {selectedBooking.additionalNotes && (
                        <div><h4 className="font-semibold mb-1">Notes</h4><p className="text-sm bg-gray-50 p-3 rounded">{selectedBooking.additionalNotes}</p></div>
                      )}

                      <div className="pt-4 border-t space-y-3">
                        <div className="flex flex-wrap gap-2">
                          {selectedBooking.status === 'pending' && (
                            <>
                              <Button size="sm" className="bg-green-500 hover:bg-green-600" onClick={() => updateBookingStatus(selectedBooking.id, 'confirmed')}><CheckCircle className="w-4 h-4 mr-1" />Confirm</Button>
                              <Button size="sm" variant="outline" className="text-red-600" onClick={() => updateBookingStatus(selectedBooking.id, 'cancelled')}><XCircle className="w-4 h-4 mr-1" />Cancel</Button>
                            </>
                          )}
                          {selectedBooking.status === 'confirmed' && (
                            <Button size="sm" className="bg-blue-500 hover:bg-blue-600" onClick={() => updateBookingStatus(selectedBooking.id, 'completed')}><CheckCircle className="w-4 h-4 mr-1" />Complete</Button>
                          )}
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {selectedBooking.paymentStatus !== 'paid' && (
                            <Button size="sm" variant="outline" onClick={() => updatePaymentStatus(selectedBooking.id, 'paid')}><DollarSign className="w-4 h-4 mr-1" />Mark Paid</Button>
                          )}
                          <Button size="sm" variant="outline" onClick={() => window.open(`https://wa.me/${selectedBooking.customerPhone.replace(/[^0-9]/g, '')}`, '_blank')}><MessageCircle className="w-4 h-4 mr-1" />WhatsApp</Button>
                          <Button size="sm" variant="outline" onClick={() => window.open(`mailto:${selectedBooking.customerEmail}`, '_blank')}><Mail className="w-4 h-4 mr-1" />Email</Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ) : (
                  <Card className="border-0 shadow"><CardContent className="p-12 text-center text-gray-500">Select a booking to view details</CardContent></Card>
                )}
              </div>
            </div>
          </TabsContent>

          {/* TOURS TAB */}
          <TabsContent value="tours">
            <div className="flex justify-between mb-6">
              <div className="flex gap-2">
                {CATEGORIES.map(c => (
                  <Button key={c.id} variant={categoryFilter === c.id ? 'default' : 'outline'} size="sm" onClick={() => setCategoryFilter(categoryFilter === c.id ? 'all' : c.id)}>
                    <c.icon className="w-4 h-4 mr-1" />{c.label}
                  </Button>
                ))}
              </div>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {tours.filter(t => categoryFilter === 'all' || t.category === categoryFilter).map(tour => (
                <Card key={tour.id} className={`overflow-hidden ${!tour.isActive ? 'opacity-60' : ''}`}>
                  <div className="relative h-40">
                    <img src={tour.heroImage || 'https://images.unsplash.com/photo-1567337710282-00832b415979?w=600'} alt={tour.title} className="w-full h-full object-cover" />
                    <div className="absolute top-2 right-2 flex gap-1">
                      {tour.isFeatured && <Badge className="bg-amber-500">Featured</Badge>}
                      {!tour.isActive && <Badge variant="secondary">Draft</Badge>}
                    </div>
                  </div>
                  <CardContent className="p-4">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h3 className="font-bold">{tour.title}</h3>
                        <p className="text-sm text-gray-500">{tour.location} • {tour.duration}</p>
                      </div>
                      <div className="text-right">
                        <div className="font-bold text-amber-600">${tour.priceUSD}</div>
                        <div className="text-xs text-gray-500 flex items-center gap-1"><Star className="w-3 h-3 fill-amber-400 text-amber-400" />{tour.rating}</div>
                      </div>
                    </div>
                    <div className="flex gap-2 text-xs text-gray-500 mb-3">
                      <span>{tour.bookingCount || 0} bookings</span>
                      <span>{tour.reviewCount || 0} reviews</span>
                    </div>
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline" className="flex-1" onClick={() => toggleTourActive(tour.id, !tour.isActive)}>
                        {tour.isActive ? <><EyeOff className="w-4 h-4 mr-1" />Unpublish</> : <><Eye className="w-4 h-4 mr-1" />Publish</>}
                      </Button>
                      <Button size="sm" variant="outline" onClick={() => toggleTourFeatured(tour.id, !tour.isFeatured)}>
                        <Star className={`w-4 h-4 ${tour.isFeatured ? 'fill-amber-400 text-amber-400' : ''}`} />
                      </Button>
                      <Button size="sm" variant="outline" className="text-red-600" onClick={() => deleteTour(tour.id)}>
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default GlobalToursAdmin;
