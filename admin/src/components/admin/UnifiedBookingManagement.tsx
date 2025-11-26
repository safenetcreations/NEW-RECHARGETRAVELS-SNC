import React, { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { toast } from '@/hooks/use-toast';
import { format, startOfWeek, endOfWeek, startOfMonth, endOfMonth } from 'date-fns';
import { DateRange } from 'react-day-picker';
import { getDocs, collection, query, orderBy, deleteDoc, doc, updateDoc, where } from 'firebase/firestore';
import { db } from '@/services/firebaseService';
import {
  Search,
  Filter,
  Download,
  RefreshCw,
  Calendar as CalendarIcon,
  AlertCircle,
  CheckCircle,
  Clock,
  XCircle,
  TrendingUp,
  TrendingDown,
  DollarSign,
  Users,
  Car,
  Hotel,
  Map,
  Package,
  Edit,
  Trash2,
  Eye,
  MoreVertical,
  Send,
  FileText,
  BarChart3
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';

interface Booking {
  id: string;
  user_id: string;
  booking_type: 'transport' | 'hotel' | 'tour' | 'package' | 'activity';
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed';
  total_amount: number;
  payment_status: 'pending' | 'paid' | 'refunded' | 'failed';
  payment_method?: string;
  check_in_date?: string;
  check_out_date?: string;
  created_at: string;
  updated_at: string;
  metadata?: {
    driver_id?: string;
    hotel_id?: string;
    tour_id?: string;
  };
  user?: {
    email: string;
    full_name?: string;
  };
  driver?: {
    name: string;
    phone: string;
  };
  hotel?: {
    name: string;
    location: string;
  };
  tour?: {
    name: string;
    duration: string;
  };
}

interface BookingStats {
  total: number;
  pending: number;
  confirmed: number;
  cancelled: number;
  completed: number;
  totalRevenue: number;
  todayRevenue: number;
  weekRevenue: number;
  monthRevenue: number;
}

export default function UnifiedBookingManagement() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [filteredBookings, setFilteredBookings] = useState<Booking[]>([]);
  const [stats, setStats] = useState<BookingStats>({
    total: 0,
    pending: 0,
    confirmed: 0,
    cancelled: 0,
    completed: 0,
    totalRevenue: 0,
    todayRevenue: 0,
    weekRevenue: 0,
    monthRevenue: 0,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [selectedBookings, setSelectedBookings] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [dateRange, setDateRange] = useState<{ from: Date | undefined; to: Date | undefined }>({
    from: undefined,
    to: undefined,
  });
  const [showBulkActions, setShowBulkActions] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [autoRefresh, setAutoRefresh] = useState(false);

  useEffect(() => {
    loadBookings();
    const interval = autoRefresh ? setInterval(loadBookings, 30000) : null;
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [autoRefresh, loadBookings]);

  useEffect(() => {
    applyFilters();
  }, [applyFilters]);

  const loadBookings = useCallback(async () => {
    try {
      setIsLoading(true);
      
      // Fetch all bookings
      const q = query(collection(db, 'bookings'), orderBy('created_at', 'desc'));
      const snapshot = await getDocs(q);
      const bookingsData = snapshot.docs.map(docSnap => ({ id: docSnap.id, ...docSnap.data() })) as Booking[];

      // Fetch related data for each booking
      const enrichedBookings = await Promise.all(
        bookingsData.map(async (booking) => {
          const enrichedBooking = { ...booking };
          
          // Fetch user data
          if (booking.user_id) {
            try {
              const userQuery = query(collection(db, 'users'), where('id', '==', booking.user_id));
              const userSnapshot = await getDocs(userQuery);
              if (!userSnapshot.empty) {
                const userData = userSnapshot.docs[0].data();
                enrichedBooking.user = {
                  email: userData.email || '',
                  full_name: userData.full_name || ''
                };
              }
            } catch (error) {
              console.error('Error fetching user data:', error);
            }
          }

          // Fetch driver data if booking has driver_id
          if (booking.metadata?.driver_id) {
            try {
              const driverQuery = query(collection(db, 'drivers'), where('id', '==', booking.metadata.driver_id));
              const driverSnapshot = await getDocs(driverQuery);
              if (!driverSnapshot.empty) {
                const driverData = driverSnapshot.docs[0].data();
                enrichedBooking.driver = {
                  name: driverData.name || '',
                  phone: driverData.phone || ''
                };
              }
            } catch (error) {
              console.error('Error fetching driver data:', error);
            }
          }

          // Fetch hotel data if booking has hotel_id
          if (booking.metadata?.hotel_id) {
            try {
              const hotelQuery = query(collection(db, 'hotels'), where('id', '==', booking.metadata.hotel_id));
              const hotelSnapshot = await getDocs(hotelQuery);
              if (!hotelSnapshot.empty) {
                const hotelData = hotelSnapshot.docs[0].data();
                enrichedBooking.hotel = {
                  name: hotelData.name || '',
                  location: hotelData.location || ''
                };
              }
            } catch (error) {
              console.error('Error fetching hotel data:', error);
            }
          }

          // Fetch tour data if booking has tour_id
          if (booking.metadata?.tour_id) {
            try {
              const tourQuery = query(collection(db, 'tour_packages'), where('id', '==', booking.metadata.tour_id));
              const tourSnapshot = await getDocs(tourQuery);
              if (!tourSnapshot.empty) {
                const tourData = tourSnapshot.docs[0].data();
                enrichedBooking.tour = {
                  name: tourData.name || '',
                  duration: tourData.duration || ''
                };
              }
            } catch (error) {
              console.error('Error fetching tour data:', error);
            }
          }

          return enrichedBooking;
        })
      );

      setBookings(enrichedBookings);
      calculateStats(enrichedBookings);
    } catch (error) {
      console.error('Error loading bookings:', error);
      toast({
        title: 'Error',
        description: 'Failed to load bookings',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  }, [calculateStats]);

  const calculateStats = useCallback((bookingData: Booking[]) => {
    const now = new Date();
    const todayStart = new Date(now.setHours(0, 0, 0, 0));
    const weekStart = startOfWeek(now);
    const monthStart = startOfMonth(now);

    const stats: BookingStats = {
      total: bookingData.length,
      pending: bookingData.filter(b => b.status === 'pending').length,
      confirmed: bookingData.filter(b => b.status === 'confirmed').length,
      cancelled: bookingData.filter(b => b.status === 'cancelled').length,
      completed: bookingData.filter(b => b.status === 'completed').length,
      totalRevenue: bookingData.reduce((sum, b) => sum + (b.total_amount || 0), 0),
      todayRevenue: bookingData
        .filter(b => new Date(b.created_at) >= todayStart)
        .reduce((sum, b) => sum + (b.total_amount || 0), 0),
      weekRevenue: bookingData
        .filter(b => new Date(b.created_at) >= weekStart)
        .reduce((sum, b) => sum + (b.total_amount || 0), 0),
      monthRevenue: bookingData
        .filter(b => new Date(b.created_at) >= monthStart)
        .reduce((sum, b) => sum + (b.total_amount || 0), 0),
    };

    setStats(stats);
  }, []);

  const applyFilters = useCallback(() => {
    let filtered = [...bookings];

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(
        b =>
          b.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
          b.user?.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          b.driver?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          b.hotel?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          b.tour?.name?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Type filter
    if (filterType !== 'all') {
      filtered = filtered.filter(b => b.booking_type === filterType);
    }

    // Status filter
    if (filterStatus !== 'all') {
      filtered = filtered.filter(b => b.status === filterStatus);
    }

    // Date range filter
    if (dateRange.from) {
      filtered = filtered.filter(b => new Date(b.created_at) >= dateRange.from!);
    }
    if (dateRange.to) {
      filtered = filtered.filter(b => new Date(b.created_at) <= dateRange.to!);
    }

    setFilteredBookings(filtered);
  }, [bookings, searchTerm, filterType, filterStatus, dateRange, setFilteredBookings]);

  const handleBulkAction = async (action: string) => {
    if (selectedBookings.length === 0) {
      toast({
        title: 'No bookings selected',
        description: 'Please select at least one booking',
        variant: 'destructive',
      });
      return;
    }

    try {
      switch (action) {
        case 'confirm':
          await updateBookingsStatus(selectedBookings, 'confirmed');
          break;
        case 'cancel':
          await updateBookingsStatus(selectedBookings, 'cancelled');
          break;
        case 'complete':
          await updateBookingsStatus(selectedBookings, 'completed');
          break;
        case 'export':
          exportBookings(selectedBookings);
          break;
        case 'delete':
          if (confirm('Are you sure you want to delete selected bookings?')) {
            await deleteBookings(selectedBookings);
          }
          break;
      }
      setSelectedBookings([]);
      loadBookings();
    } catch (error) {
      console.error('Bulk action error:', error);
      toast({
        title: 'Error',
        description: 'Failed to perform bulk action',
        variant: 'destructive',
      });
    }
  };

  const updateBookingsStatus = async (bookingIds: string[], status: string) => {
    const updatePromises = bookingIds.map(id => 
      updateDoc(doc(db, 'bookings', id), { 
        status, 
        updated_at: new Date().toISOString() 
      })
    );
    
    await Promise.all(updatePromises);

    toast({
      title: 'Success',
      description: `${bookingIds.length} bookings updated`,
    });
  };

  const deleteBookings = async (bookingIds: string[]) => {
    const deletePromises = bookingIds.map(id => deleteDoc(doc(db, 'bookings', id)));
    await Promise.all(deletePromises);

    toast({
      title: 'Success',
      description: `${bookingIds.length} bookings deleted`,
    });
  };

  const exportBookings = (bookingIds?: string[]) => {
    const dataToExport = bookingIds 
      ? filteredBookings.filter(b => bookingIds.includes(b.id))
      : filteredBookings;

    const csv = [
      ['ID', 'Type', 'Status', 'Customer', 'Amount', 'Payment Status', 'Created Date'],
      ...dataToExport.map(b => [
        b.id,
        b.booking_type,
        b.status,
        b.user?.email || '',
        b.total_amount.toString(),
        b.payment_status,
        format(new Date(b.created_at), 'yyyy-MM-dd HH:mm')
      ])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `bookings-${format(new Date(), 'yyyy-MM-dd')}.csv`;
    a.click();
  };

  const getBookingIcon = (type: string) => {
    switch (type) {
      case 'transport':
        return <Car className="w-4 h-4" />;
      case 'hotel':
        return <Hotel className="w-4 h-4" />;
      case 'tour':
        return <Map className="w-4 h-4" />;
      case 'package':
        return <Package className="w-4 h-4" />;
      default:
        return <Package className="w-4 h-4" />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <Badge variant="secondary"><Clock className="w-3 h-3 mr-1" />Pending</Badge>;
      case 'confirmed':
        return <Badge className="bg-blue-100 text-blue-800"><CheckCircle className="w-3 h-3 mr-1" />Confirmed</Badge>;
      case 'completed':
        return <Badge className="bg-green-100 text-green-800"><CheckCircle className="w-3 h-3 mr-1" />Completed</Badge>;
      case 'cancelled':
        return <Badge variant="destructive"><XCircle className="w-3 h-3 mr-1" />Cancelled</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  const getPaymentBadge = (status: string) => {
    switch (status) {
      case 'paid':
        return <Badge className="bg-green-100 text-green-800">Paid</Badge>;
      case 'pending':
        return <Badge variant="secondary">Pending</Badge>;
      case 'refunded':
        return <Badge className="bg-blue-100 text-blue-800">Refunded</Badge>;
      case 'failed':
        return <Badge variant="destructive">Failed</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Unified Booking Management</h2>
          <p className="text-gray-600">Manage all bookings from a single dashboard</p>
        </div>
        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setAutoRefresh(!autoRefresh)}
            className={autoRefresh ? 'bg-green-50' : ''}
          >
            <RefreshCw className={`w-4 h-4 mr-2 ${autoRefresh ? 'animate-spin' : ''}`} />
            {autoRefresh ? 'Auto-refresh ON' : 'Auto-refresh OFF'}
          </Button>
          <Button onClick={() => loadBookings()}>
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh
          </Button>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Bookings</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
            <div className="flex items-center text-xs text-muted-foreground">
              <span className="text-orange-600">{stats.pending} pending</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${stats.totalRevenue.toFixed(2)}</div>
            <div className="flex items-center text-xs text-muted-foreground">
              <TrendingUp className="w-3 h-3 mr-1 text-green-600" />
              Today: ${stats.todayRevenue.toFixed(2)}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completion Rate</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {stats.total > 0 ? ((stats.completed / stats.total) * 100).toFixed(1) : 0}%
            </div>
            <div className="flex items-center text-xs text-muted-foreground">
              {stats.completed} completed, {stats.cancelled} cancelled
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Bookings</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.confirmed}</div>
            <div className="flex items-center text-xs text-muted-foreground">
              <Clock className="w-3 h-3 mr-1" />
              {stats.pending} awaiting confirmation
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Search */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Filters & Search</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search bookings..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9"
              />
            </div>

            <Select value={filterType} onValueChange={setFilterType}>
              <SelectTrigger>
                <SelectValue placeholder="All Types" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="transport">Transport</SelectItem>
                <SelectItem value="hotel">Hotel</SelectItem>
                <SelectItem value="tour">Tour</SelectItem>
                <SelectItem value="package">Package</SelectItem>
                <SelectItem value="activity">Activity</SelectItem>
              </SelectContent>
            </Select>

            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger>
                <SelectValue placeholder="All Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="confirmed">Confirmed</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="cancelled">Cancelled</SelectItem>
              </SelectContent>
            </Select>

            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className="justify-start text-left font-normal">
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {dateRange.from ? (
                    dateRange.to ? (
                      <>
                        {format(dateRange.from, "LLL dd")} - {format(dateRange.to, "LLL dd")}
                      </>
                    ) : (
                      format(dateRange.from, "LLL dd, yyyy")
                    )
                  ) : (
                    <span>Pick a date range</span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="range"
                  selected={{ from: dateRange.from, to: dateRange.to }}
                  onSelect={(range: DateRange | undefined) => setDateRange(range || { from: undefined, to: undefined })}
                  numberOfMonths={2}
                />
              </PopoverContent>
            </Popover>
          </div>

          {/* Quick Actions */}
          <div className="flex items-center justify-between mt-4">
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setFilterType('all');
                  setFilterStatus('all');
                  setSearchTerm('');
                  setDateRange({ from: undefined, to: undefined });
                }}
              >
                Clear Filters
              </Button>
              <span className="text-sm text-gray-600">
                Showing {filteredBookings.length} of {bookings.length} bookings
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowBulkActions(!showBulkActions)}
              >
                Bulk Actions
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => exportBookings()}
              >
                <Download className="w-4 h-4 mr-2" />
                Export
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Bulk Actions Bar */}
      {showBulkActions && selectedBookings.length > 0 && (
        <Card className="bg-blue-50 border-blue-200">
          <CardContent className="py-3">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">
                {selectedBookings.length} booking(s) selected
              </span>
              <div className="flex items-center gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleBulkAction('confirm')}
                >
                  Confirm
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleBulkAction('complete')}
                >
                  Complete
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleBulkAction('cancel')}
                >
                  Cancel
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleBulkAction('export')}
                >
                  Export
                </Button>
                <Button
                  size="sm"
                  variant="destructive"
                  onClick={() => handleBulkAction('delete')}
                >
                  Delete
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => setSelectedBookings([])}
                >
                  Clear
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Bookings Table */}
      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  {showBulkActions && (
                    <TableHead className="w-12">
                      <Checkbox
                        checked={
                          filteredBookings.length > 0 &&
                          selectedBookings.length === filteredBookings.length
                        }
                        onCheckedChange={(checked) => {
                          if (checked) {
                            setSelectedBookings(filteredBookings.map(b => b.id));
                          } else {
                            setSelectedBookings([]);
                          }
                        }}
                      />
                    </TableHead>
                  )}
                  <TableHead>ID</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Customer</TableHead>
                  <TableHead>Details</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Payment</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={10} className="text-center py-8">
                      <RefreshCw className="w-8 h-8 animate-spin mx-auto text-gray-400" />
                    </TableCell>
                  </TableRow>
                ) : filteredBookings.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={10} className="text-center py-8 text-gray-500">
                      No bookings found
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredBookings.map((booking) => (
                    <TableRow key={booking.id}>
                      {showBulkActions && (
                        <TableCell>
                          <Checkbox
                            checked={selectedBookings.includes(booking.id)}
                            onCheckedChange={(checked) => {
                              if (checked) {
                                setSelectedBookings([...selectedBookings, booking.id]);
                              } else {
                                setSelectedBookings(
                                  selectedBookings.filter(id => id !== booking.id)
                                );
                              }
                            }}
                          />
                        </TableCell>
                      )}
                      <TableCell className="font-mono text-xs">
                        {booking.id.substring(0, 8)}...
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          {getBookingIcon(booking.booking_type)}
                          <span className="capitalize">{booking.booking_type}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">
                          <div className="font-medium">{booking.user?.email}</div>
                          {booking.user?.full_name && (
                            <div className="text-gray-500">{booking.user.full_name}</div>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">
                          {booking.hotel && (
                            <div>{booking.hotel.name}</div>
                          )}
                          {booking.tour && (
                            <div>{booking.tour.name}</div>
                          )}
                          {booking.driver && (
                            <div>Driver: {booking.driver.name}</div>
                          )}
                          {booking.check_in_date && (
                            <div className="text-gray-500">
                              {format(new Date(booking.check_in_date), 'MMM dd')}
                              {booking.check_out_date && ` - ${format(new Date(booking.check_out_date), 'MMM dd')}`}
                            </div>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="font-medium">${booking.total_amount}</div>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          {getPaymentBadge(booking.payment_status)}
                          {booking.payment_method && (
                            <div className="text-xs text-gray-500">{booking.payment_method}</div>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>{getStatusBadge(booking.status)}</TableCell>
                      <TableCell>
                        <div className="text-sm">
                          <div>{format(new Date(booking.created_at), 'MMM dd, yyyy')}</div>
                          <div className="text-gray-500">
                            {format(new Date(booking.created_at), 'HH:mm')}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                            <DropdownMenuItem
                              onClick={() => {
                                setSelectedBooking(booking);
                                setShowDetailsModal(true);
                              }}
                            >
                              <Eye className="w-4 h-4 mr-2" />
                              View Details
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => {
                                setSelectedBooking(booking);
                                setShowEditModal(true);
                              }}
                            >
                              <Edit className="w-4 h-4 mr-2" />
                              Edit
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem>
                              <Send className="w-4 h-4 mr-2" />
                              Send Notification
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <FileText className="w-4 h-4 mr-2" />
                              Generate Invoice
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                              className="text-red-600"
                              onClick={() => {
                                if (confirm('Delete this booking?')) {
                                  deleteBookings([booking.id]);
                                }
                              }}
                            >
                              <Trash2 className="w-4 h-4 mr-2" />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Booking Details Modal */}
      <Dialog open={showDetailsModal} onOpenChange={setShowDetailsModal}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Booking Details</DialogTitle>
            <DialogDescription>
              Complete information about this booking
            </DialogDescription>
          </DialogHeader>
          {selectedBooking && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Booking ID</Label>
                  <p className="text-sm font-mono">{selectedBooking.id}</p>
                </div>
                <div>
                  <Label>Type</Label>
                  <p className="text-sm capitalize">{selectedBooking.booking_type}</p>
                </div>
                <div>
                  <Label>Status</Label>
                  <div className="mt-1">{getStatusBadge(selectedBooking.status)}</div>
                </div>
                <div>
                  <Label>Payment Status</Label>
                  <div className="mt-1">{getPaymentBadge(selectedBooking.payment_status)}</div>
                </div>
                <div>
                  <Label>Amount</Label>
                  <p className="text-sm font-medium">${selectedBooking.total_amount}</p>
                </div>
                <div>
                  <Label>Created Date</Label>
                  <p className="text-sm">
                    {format(new Date(selectedBooking.created_at), 'PPpp')}
                  </p>
                </div>
              </div>
              {selectedBooking.metadata && (
                <div>
                  <Label>Additional Information</Label>
                  <pre className="text-sm bg-gray-50 p-3 rounded mt-1">
                    {JSON.stringify(selectedBooking.metadata, null, 2)}
                  </pre>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Edit Booking Modal */}
      <Dialog open={showEditModal} onOpenChange={setShowEditModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Booking</DialogTitle>
            <DialogDescription>
              Update booking status and details
            </DialogDescription>
          </DialogHeader>
          {selectedBooking && (
            <div className="space-y-4">
              <div>
                <Label>Status</Label>
                <Select
                  defaultValue={selectedBooking.status}
                  onValueChange={async (value) => {
                    try {
                      await updateBookingsStatus([selectedBooking.id], value);
                      setShowEditModal(false);
                      loadBookings();
                    } catch (error) {
                      toast({
                        title: 'Error',
                        description: 'Failed to update status',
                        variant: 'destructive',
                      });
                    }
                  }}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="confirmed">Confirmed</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                    <SelectItem value="cancelled">Cancelled</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Notes</Label>
                <Textarea
                  placeholder="Add internal notes..."
                  className="mt-1"
                />
              </div>
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setShowEditModal(false)}>
                  Cancel
                </Button>
                <Button onClick={() => {
                  toast({
                    title: 'Success',
                    description: 'Booking updated successfully',
                  });
                  setShowEditModal(false);
                  loadBookings();
                }}>
                  Save Changes
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}