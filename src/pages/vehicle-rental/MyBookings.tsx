import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { 
  Car, 
  Calendar, 
  Clock, 
  MapPin, 
  User,
  Star,
  ChevronRight,
  Filter,
  Search,
  CheckCircle,
  XCircle,
  AlertCircle,
  DollarSign,
  FileText,
  MessageSquare,
  Phone,
  Download,
  Eye,
  RefreshCw,
  Shield,
  Truck
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { collection, doc, getDocs, query, where, orderBy, updateDoc, serverTimestamp } from 'firebase/firestore';
import { db, auth } from '@/lib/firebase';
import { useAuth } from '@/hooks/useAuth';

interface VehicleBooking {
  id: string;
  vehicleId: string;
  vehicleMake: string;
  vehicleModel: string;
  vehicleYear: number;
  vehicleImage: string;
  vehicleType: string;
  registrationNumber: string;
  
  // Owner
  ownerName: string;
  ownerPhone: string;
  ownerRating: number;
  
  // Dates
  startDate: Date;
  endDate: Date;
  rentalType: 'hourly' | 'daily' | 'weekly' | 'monthly';
  
  // Options
  withDriver: boolean;
  driverName?: string;
  
  // Pickup/Dropoff
  pickupLocation: string;
  dropoffLocation: string;
  pickupTime?: string;
  
  // Pricing
  baseAmount: number;
  insuranceFee: number;
  deliveryFee: number;
  serviceFee: number;
  totalAmount: number;
  securityDeposit: number;
  depositStatus: 'held' | 'released' | 'deducted';
  
  // Insurance
  insurancePackage: 'none' | 'basic' | 'silver' | 'gold';
  
  // Status
  status: 'pending' | 'confirmed' | 'in_progress' | 'completed' | 'cancelled';
  paymentStatus: 'pending' | 'paid' | 'refunded';
  
  // Review
  hasReview: boolean;
  rating?: number;
  
  // Timestamps
  createdAt: Date;
  confirmedAt?: Date;
  completedAt?: Date;
  cancelledAt?: Date;
}

// Mock data for demo
const mockBookings: VehicleBooking[] = [
  {
    id: 'b1',
    vehicleId: 'v1',
    vehicleMake: 'Toyota',
    vehicleModel: 'Prius',
    vehicleYear: 2021,
    vehicleImage: 'https://images.unsplash.com/photo-1580273916550-e323be2ae537?w=400',
    vehicleType: 'sedan',
    registrationNumber: 'CAB-1234',
    ownerName: 'Nuwan Perera',
    ownerPhone: '+94 77 123 4567',
    ownerRating: 4.8,
    startDate: new Date('2025-12-01'),
    endDate: new Date('2025-12-05'),
    rentalType: 'daily',
    withDriver: true,
    driverName: 'Kasun Silva',
    pickupLocation: 'Bandaranaike International Airport',
    dropoffLocation: 'Galle Fort Hotel',
    pickupTime: '10:00 AM',
    baseAmount: 180,
    insuranceFee: 70,
    deliveryFee: 45,
    serviceFee: 29.50,
    totalAmount: 324.50,
    securityDeposit: 150,
    depositStatus: 'held',
    insurancePackage: 'silver',
    status: 'confirmed',
    paymentStatus: 'paid',
    hasReview: false,
    createdAt: new Date('2025-11-25'),
    confirmedAt: new Date('2025-11-26')
  },
  {
    id: 'b2',
    vehicleId: 'v2',
    vehicleMake: 'Honda',
    vehicleModel: 'Vezel',
    vehicleYear: 2022,
    vehicleImage: 'https://images.unsplash.com/photo-1519641471654-76ce0107ad1b?w=400',
    vehicleType: 'suv',
    registrationNumber: 'KV-5678',
    ownerName: 'Roshan Fernando',
    ownerPhone: '+94 77 987 6543',
    ownerRating: 4.9,
    startDate: new Date('2025-11-10'),
    endDate: new Date('2025-11-15'),
    rentalType: 'daily',
    withDriver: false,
    pickupLocation: 'Colombo City Center',
    dropoffLocation: 'Colombo City Center',
    pickupTime: '09:00 AM',
    baseAmount: 275,
    insuranceFee: 150,
    deliveryFee: 0,
    serviceFee: 42.50,
    totalAmount: 467.50,
    securityDeposit: 200,
    depositStatus: 'released',
    insurancePackage: 'gold',
    status: 'completed',
    paymentStatus: 'paid',
    hasReview: true,
    rating: 5,
    createdAt: new Date('2025-11-05'),
    confirmedAt: new Date('2025-11-06'),
    completedAt: new Date('2025-11-15')
  },
  {
    id: 'b3',
    vehicleId: 'v3',
    vehicleMake: 'Suzuki',
    vehicleModel: 'Wagon R',
    vehicleYear: 2020,
    vehicleImage: 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=400',
    vehicleType: 'hatchback',
    registrationNumber: 'WP-9012',
    ownerName: 'Amara Silva',
    ownerPhone: '+94 77 555 1234',
    ownerRating: 4.5,
    startDate: new Date('2025-11-20'),
    endDate: new Date('2025-11-22'),
    rentalType: 'daily',
    withDriver: false,
    pickupLocation: 'Kandy City',
    dropoffLocation: 'Kandy City',
    pickupTime: '08:00 AM',
    baseAmount: 60,
    insuranceFee: 12,
    deliveryFee: 0,
    serviceFee: 7.20,
    totalAmount: 79.20,
    securityDeposit: 100,
    depositStatus: 'released',
    insurancePackage: 'basic',
    status: 'cancelled',
    paymentStatus: 'refunded',
    hasReview: false,
    createdAt: new Date('2025-11-18'),
    cancelledAt: new Date('2025-11-19')
  }
];

const MyBookings: React.FC = () => {
  const { toast } = useToast();
  const { user } = useAuth();
  const [bookings, setBookings] = useState<VehicleBooking[]>(mockBookings);
  const [loading, setLoading] = useState(false);
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedBooking, setSelectedBooking] = useState<VehicleBooking | null>(null);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState('');
  const [submittingReview, setSubmittingReview] = useState(false);

  // Filter bookings
  const filteredBookings = bookings.filter(b => {
    const matchesStatus = filterStatus === 'all' || b.status === filterStatus;
    const matchesSearch = searchQuery === '' || 
      b.vehicleMake.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.vehicleModel.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.ownerName.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  // Sort by date (upcoming first, then recent)
  const sortedBookings = [...filteredBookings].sort((a, b) => {
    if (a.status === 'confirmed' && b.status !== 'confirmed') return -1;
    if (b.status === 'confirmed' && a.status !== 'confirmed') return 1;
    return b.createdAt.getTime() - a.createdAt.getTime();
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'confirmed':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-700">
            <CheckCircle className="w-3 h-3" /> Confirmed
          </span>
        );
      case 'in_progress':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-700">
            <Car className="w-3 h-3" /> In Progress
          </span>
        );
      case 'completed':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-1 text-xs font-medium rounded-full bg-gray-100 text-gray-700">
            <CheckCircle className="w-3 h-3" /> Completed
          </span>
        );
      case 'cancelled':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-1 text-xs font-medium rounded-full bg-red-100 text-red-700">
            <XCircle className="w-3 h-3" /> Cancelled
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2 py-1 text-xs font-medium rounded-full bg-yellow-100 text-yellow-700">
            <Clock className="w-3 h-3" /> Pending
          </span>
        );
    }
  };

  const getInsuranceBadge = (pkg: string) => {
    switch (pkg) {
      case 'gold':
        return <span className="px-2 py-0.5 text-xs font-medium rounded bg-yellow-100 text-yellow-700">Gold Protection</span>;
      case 'silver':
        return <span className="px-2 py-0.5 text-xs font-medium rounded bg-gray-200 text-gray-700">Silver Protection</span>;
      case 'basic':
        return <span className="px-2 py-0.5 text-xs font-medium rounded bg-blue-100 text-blue-700">Basic Protection</span>;
      default:
        return <span className="px-2 py-0.5 text-xs font-medium rounded bg-red-100 text-red-700">No Protection</span>;
    }
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', { 
      weekday: 'short',
      month: 'short', 
      day: 'numeric', 
      year: 'numeric' 
    });
  };

  const getDaysCount = (start: Date, end: Date) => {
    const diffTime = Math.abs(end.getTime() - start.getTime());
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  const handleSubmitReview = async () => {
    if (!selectedBooking || !reviewComment.trim()) {
      toast({
        title: 'Error',
        description: 'Please write a review comment',
        variant: 'destructive'
      });
      return;
    }

    setSubmittingReview(true);

    try {
      // In production, save to Firebase
      // await addDoc(collection(db, 'vehicle_reviews'), {...});

      // Update local state
      setBookings(prev => prev.map(b => 
        b.id === selectedBooking.id 
          ? { ...b, hasReview: true, rating: reviewRating }
          : b
      ));

      toast({
        title: 'Review Submitted',
        description: 'Thank you for your feedback!',
      });

      setShowReviewModal(false);
      setReviewRating(5);
      setReviewComment('');
      setSelectedBooking(null);
    } catch (error) {
      console.error('Review error:', error);
      toast({
        title: 'Error',
        description: 'Failed to submit review',
        variant: 'destructive'
      });
    } finally {
      setSubmittingReview(false);
    }
  };

  const stats = {
    upcoming: bookings.filter(b => b.status === 'confirmed').length,
    active: bookings.filter(b => b.status === 'in_progress').length,
    completed: bookings.filter(b => b.status === 'completed').length,
    cancelled: bookings.filter(b => b.status === 'cancelled').length
  };

  return (
    <>
      <Helmet>
        <title>My Vehicle Bookings | Recharge Travels</title>
        <meta name="description" content="View and manage your vehicle rental bookings with Recharge Travels." />
      </Helmet>

      <Header />

      <main className="min-h-screen bg-gradient-to-b from-purple-50 to-white pt-20">
        {/* Header Section */}
        <section className="bg-gradient-to-r from-purple-600 to-indigo-700 text-white py-8">
          <div className="max-w-7xl mx-auto px-4">
            <h1 className="text-2xl md:text-3xl font-bold">My Vehicle Bookings</h1>
            <p className="text-purple-100 mt-2">View and manage all your vehicle rentals</p>
          </div>
        </section>

        {/* Stats */}
        <section className="py-6 bg-white border-b">
          <div className="max-w-7xl mx-auto px-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div 
                className={`rounded-lg p-4 border-2 cursor-pointer transition-all ${
                  filterStatus === 'confirmed' ? 'border-green-400 bg-green-50' : 'border-gray-200 hover:border-green-300'
                }`}
                onClick={() => setFilterStatus(filterStatus === 'confirmed' ? 'all' : 'confirmed')}
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center">
                    <Calendar className="w-5 h-5 text-green-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-gray-900">{stats.upcoming}</p>
                    <p className="text-sm text-gray-500">Upcoming</p>
                  </div>
                </div>
              </div>

              <div 
                className={`rounded-lg p-4 border-2 cursor-pointer transition-all ${
                  filterStatus === 'in_progress' ? 'border-blue-400 bg-blue-50' : 'border-gray-200 hover:border-blue-300'
                }`}
                onClick={() => setFilterStatus(filterStatus === 'in_progress' ? 'all' : 'in_progress')}
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
                    <Car className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-gray-900">{stats.active}</p>
                    <p className="text-sm text-gray-500">Active</p>
                  </div>
                </div>
              </div>

              <div 
                className={`rounded-lg p-4 border-2 cursor-pointer transition-all ${
                  filterStatus === 'completed' ? 'border-gray-400 bg-gray-50' : 'border-gray-200 hover:border-gray-300'
                }`}
                onClick={() => setFilterStatus(filterStatus === 'completed' ? 'all' : 'completed')}
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center">
                    <CheckCircle className="w-5 h-5 text-gray-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-gray-900">{stats.completed}</p>
                    <p className="text-sm text-gray-500">Completed</p>
                  </div>
                </div>
              </div>

              <div 
                className={`rounded-lg p-4 border-2 cursor-pointer transition-all ${
                  filterStatus === 'cancelled' ? 'border-red-400 bg-red-50' : 'border-gray-200 hover:border-red-300'
                }`}
                onClick={() => setFilterStatus(filterStatus === 'cancelled' ? 'all' : 'cancelled')}
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-red-100 flex items-center justify-center">
                    <XCircle className="w-5 h-5 text-red-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-gray-900">{stats.cancelled}</p>
                    <p className="text-sm text-gray-500">Cancelled</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Search */}
        <section className="py-4 bg-white border-b">
          <div className="max-w-7xl mx-auto px-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <Input
                type="text"
                placeholder="Search by vehicle or owner name..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
        </section>

        {/* Bookings List */}
        <section className="py-8">
          <div className="max-w-7xl mx-auto px-4">
            {sortedBookings.length === 0 ? (
              <div className="text-center py-16 bg-white rounded-xl shadow-sm">
                <Car className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No Bookings Found</h3>
                <p className="text-gray-500 mb-6">
                  {filterStatus !== 'all' 
                    ? `No ${filterStatus.replace('_', ' ')} bookings yet.`
                    : "You haven't made any vehicle bookings yet."
                  }
                </p>
                <Link to="/vehicle-rental/browse">
                  <Button className="bg-purple-600 hover:bg-purple-700">
                    Browse Vehicles
                  </Button>
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                {sortedBookings.map(booking => (
                  <div 
                    key={booking.id}
                    className={`bg-white rounded-xl shadow-sm overflow-hidden border-l-4 ${
                      booking.status === 'confirmed' ? 'border-l-green-500' :
                      booking.status === 'in_progress' ? 'border-l-blue-500' :
                      booking.status === 'completed' ? 'border-l-gray-400' :
                      booking.status === 'cancelled' ? 'border-l-red-500' :
                      'border-l-yellow-500'
                    }`}
                  >
                    <div className="p-4 md:p-6">
                      <div className="flex flex-col md:flex-row gap-4">
                        {/* Vehicle Image */}
                        <div className="w-full md:w-48 h-32 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                          <img 
                            src={booking.vehicleImage} 
                            alt={`${booking.vehicleMake} ${booking.vehicleModel}`}
                            className="w-full h-full object-cover"
                          />
                        </div>

                        {/* Booking Details */}
                        <div className="flex-1">
                          <div className="flex flex-wrap items-start justify-between gap-2 mb-3">
                            <div>
                              <h3 className="font-semibold text-gray-900 text-lg">
                                {booking.vehicleYear} {booking.vehicleMake} {booking.vehicleModel}
                              </h3>
                              <p className="text-sm text-gray-500">
                                {booking.registrationNumber} • {booking.vehicleType}
                                {booking.withDriver && (
                                  <span className="ml-2 text-purple-600">
                                    • With Driver: {booking.driverName}
                                  </span>
                                )}
                              </p>
                            </div>
                            {getStatusBadge(booking.status)}
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                            {/* Dates */}
                            <div className="flex items-center gap-2 text-sm">
                              <Calendar className="w-4 h-4 text-gray-400" />
                              <div>
                                <p className="text-gray-500">Rental Period</p>
                                <p className="font-medium">
                                  {formatDate(booking.startDate)} - {formatDate(booking.endDate)}
                                </p>
                                <p className="text-xs text-gray-400">
                                  {getDaysCount(booking.startDate, booking.endDate)} days
                                </p>
                              </div>
                            </div>

                            {/* Pickup */}
                            <div className="flex items-center gap-2 text-sm">
                              <MapPin className="w-4 h-4 text-gray-400" />
                              <div>
                                <p className="text-gray-500">Pickup Location</p>
                                <p className="font-medium">{booking.pickupLocation}</p>
                                {booking.pickupTime && (
                                  <p className="text-xs text-gray-400">{booking.pickupTime}</p>
                                )}
                              </div>
                            </div>

                            {/* Total */}
                            <div className="flex items-center gap-2 text-sm">
                              <DollarSign className="w-4 h-4 text-gray-400" />
                              <div>
                                <p className="text-gray-500">Total Paid</p>
                                <p className="font-bold text-lg text-purple-600">${booking.totalAmount.toFixed(2)}</p>
                              </div>
                            </div>
                          </div>

                          {/* Tags */}
                          <div className="flex flex-wrap items-center gap-2 mb-4">
                            {getInsuranceBadge(booking.insurancePackage)}
                            {booking.deliveryFee > 0 && (
                              <span className="px-2 py-0.5 text-xs font-medium rounded bg-purple-100 text-purple-700 flex items-center gap-1">
                                <Truck className="w-3 h-3" /> Delivery Included
                              </span>
                            )}
                            {booking.depositStatus === 'held' && (
                              <span className="px-2 py-0.5 text-xs font-medium rounded bg-orange-100 text-orange-700">
                                Deposit: ${booking.securityDeposit} held
                              </span>
                            )}
                            {booking.depositStatus === 'released' && (
                              <span className="px-2 py-0.5 text-xs font-medium rounded bg-green-100 text-green-700">
                                Deposit Released
                              </span>
                            )}
                          </div>

                          {/* Owner Info */}
                          <div className="flex items-center justify-between pt-3 border-t">
                            <div className="flex items-center gap-2">
                              <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center">
                                <User className="w-4 h-4 text-gray-600" />
                              </div>
                              <div>
                                <p className="text-sm font-medium text-gray-900">{booking.ownerName}</p>
                                <div className="flex items-center gap-1 text-xs text-gray-500">
                                  <Star className="w-3 h-3 text-yellow-500 fill-yellow-500" />
                                  {booking.ownerRating}
                                </div>
                              </div>
                            </div>

                            <div className="flex items-center gap-2">
                              {booking.status === 'completed' && !booking.hasReview && (
                                <Button 
                                  size="sm"
                                  variant="outline"
                                  onClick={() => {
                                    setSelectedBooking(booking);
                                    setShowReviewModal(true);
                                  }}
                                >
                                  <Star className="w-4 h-4 mr-1" /> Write Review
                                </Button>
                              )}
                              {booking.status === 'completed' && booking.hasReview && (
                                <span className="text-sm text-gray-500 flex items-center gap-1">
                                  <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                                  Reviewed ({booking.rating}/5)
                                </span>
                              )}
                              {(booking.status === 'confirmed' || booking.status === 'in_progress') && (
                                <a href={`tel:${booking.ownerPhone}`}>
                                  <Button size="sm" variant="outline">
                                    <Phone className="w-4 h-4 mr-1" /> Contact Owner
                                  </Button>
                                </a>
                              )}
                              <Button 
                                size="sm"
                                onClick={() => setSelectedBooking(booking)}
                              >
                                <Eye className="w-4 h-4 mr-1" /> View Details
                              </Button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>
      </main>

      {/* Booking Detail Modal */}
      {selectedBooking && !showReviewModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-start justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full my-8">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-4 border-b">
              <div>
                <h2 className="text-lg font-bold text-gray-900">Booking Details</h2>
                <p className="text-sm text-gray-500">Booking ID: {selectedBooking.id}</p>
              </div>
              <div className="flex items-center gap-2">
                {getStatusBadge(selectedBooking.status)}
                <button 
                  onClick={() => setSelectedBooking(null)}
                  className="p-2 hover:bg-gray-100 rounded-lg"
                  title="Close"
                >
                  <XCircle className="w-5 h-5 text-gray-500" />
                </button>
              </div>
            </div>

            <div className="p-6 space-y-6 max-h-[70vh] overflow-y-auto">
              {/* Vehicle */}
              <div className="flex gap-4">
                <div className="w-32 h-24 rounded-lg overflow-hidden bg-gray-100">
                  <img 
                    src={selectedBooking.vehicleImage} 
                    alt={selectedBooking.vehicleMake}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">
                    {selectedBooking.vehicleYear} {selectedBooking.vehicleMake} {selectedBooking.vehicleModel}
                  </h3>
                  <p className="text-sm text-gray-500">{selectedBooking.registrationNumber}</p>
                  <p className="text-sm text-gray-500">{selectedBooking.vehicleType} • {selectedBooking.rentalType} rental</p>
                  {selectedBooking.withDriver && (
                    <p className="text-sm text-purple-600">With driver: {selectedBooking.driverName}</p>
                  )}
                </div>
              </div>

              {/* Dates & Location */}
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Calendar className="w-4 h-4 text-gray-400" />
                    <span className="text-sm font-medium text-gray-700">Rental Period</span>
                  </div>
                  <p className="text-gray-900">{formatDate(selectedBooking.startDate)}</p>
                  <p className="text-gray-500">to</p>
                  <p className="text-gray-900">{formatDate(selectedBooking.endDate)}</p>
                  <p className="text-sm text-gray-500 mt-1">
                    {getDaysCount(selectedBooking.startDate, selectedBooking.endDate)} days total
                  </p>
                </div>

                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <MapPin className="w-4 h-4 text-gray-400" />
                    <span className="text-sm font-medium text-gray-700">Locations</span>
                  </div>
                  <p className="text-sm text-gray-500">Pickup:</p>
                  <p className="text-gray-900 text-sm">{selectedBooking.pickupLocation}</p>
                  <p className="text-sm text-gray-500 mt-2">Dropoff:</p>
                  <p className="text-gray-900 text-sm">{selectedBooking.dropoffLocation}</p>
                </div>
              </div>

              {/* Pricing Breakdown */}
              <div className="bg-gray-50 rounded-lg p-4">
                <h4 className="font-medium text-gray-900 mb-3">Pricing Breakdown</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-500">Base Rental</span>
                    <span>${selectedBooking.baseAmount.toFixed(2)}</span>
                  </div>
                  {selectedBooking.insuranceFee > 0 && (
                    <div className="flex justify-between">
                      <span className="text-gray-500">Insurance ({selectedBooking.insurancePackage})</span>
                      <span>${selectedBooking.insuranceFee.toFixed(2)}</span>
                    </div>
                  )}
                  {selectedBooking.deliveryFee > 0 && (
                    <div className="flex justify-between">
                      <span className="text-gray-500">Delivery</span>
                      <span>${selectedBooking.deliveryFee.toFixed(2)}</span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span className="text-gray-500">Service Fee</span>
                    <span>${selectedBooking.serviceFee.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between pt-2 border-t font-bold">
                    <span>Total</span>
                    <span className="text-purple-600">${selectedBooking.totalAmount.toFixed(2)}</span>
                  </div>
                </div>
              </div>

              {/* Security Deposit */}
              <div className={`rounded-lg p-4 ${
                selectedBooking.depositStatus === 'held' ? 'bg-orange-50 border border-orange-200' :
                selectedBooking.depositStatus === 'released' ? 'bg-green-50 border border-green-200' :
                'bg-red-50 border border-red-200'
              }`}>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Security Deposit</p>
                    <p className="text-2xl font-bold">${selectedBooking.securityDeposit}</p>
                  </div>
                  <div className="text-right">
                    {selectedBooking.depositStatus === 'held' && (
                      <span className="text-orange-700 font-medium">Currently Held</span>
                    )}
                    {selectedBooking.depositStatus === 'released' && (
                      <span className="text-green-700 font-medium flex items-center gap-1">
                        <CheckCircle className="w-4 h-4" /> Released
                      </span>
                    )}
                    {selectedBooking.depositStatus === 'deducted' && (
                      <span className="text-red-700 font-medium">Deducted (Damage)</span>
                    )}
                  </div>
                </div>
              </div>

              {/* Owner Contact */}
              <div className="flex items-center justify-between p-4 bg-purple-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center">
                    <User className="w-6 h-6 text-purple-600" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{selectedBooking.ownerName}</p>
                    <div className="flex items-center gap-1 text-sm text-gray-500">
                      <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                      {selectedBooking.ownerRating} rating
                    </div>
                  </div>
                </div>
                <a href={`tel:${selectedBooking.ownerPhone}`}>
                  <Button>
                    <Phone className="w-4 h-4 mr-2" /> Call Owner
                  </Button>
                </a>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="flex items-center justify-between p-4 border-t bg-gray-50">
              <Button variant="outline" onClick={() => setSelectedBooking(null)}>
                Close
              </Button>
              <div className="flex gap-2">
                {selectedBooking.status === 'completed' && !selectedBooking.hasReview && (
                  <Button onClick={() => setShowReviewModal(true)}>
                    <Star className="w-4 h-4 mr-2" /> Write Review
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Review Modal */}
      {showReviewModal && selectedBooking && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full">
            <div className="p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-2">Rate Your Experience</h3>
              <p className="text-sm text-gray-500 mb-4">
                How was your rental of the {selectedBooking.vehicleYear} {selectedBooking.vehicleMake} {selectedBooking.vehicleModel}?
              </p>

              {/* Star Rating */}
              <div className="flex justify-center gap-2 mb-6">
                {[1, 2, 3, 4, 5].map(star => (
                  <button
                    key={star}
                    onClick={() => setReviewRating(star)}
                    className="p-1 hover:scale-110 transition-transform"
                    title={`${star} star${star > 1 ? 's' : ''}`}
                  >
                    <Star className={`w-10 h-10 ${
                      star <= reviewRating 
                        ? 'text-yellow-500 fill-yellow-500' 
                        : 'text-gray-300'
                    }`} />
                  </button>
                ))}
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Your Review
                </label>
                <Textarea
                  value={reviewComment}
                  onChange={(e) => setReviewComment(e.target.value)}
                  placeholder="Share your experience with this vehicle and owner..."
                  rows={4}
                />
              </div>

              <div className="flex items-center justify-end gap-3">
                <Button 
                  variant="outline"
                  onClick={() => {
                    setShowReviewModal(false);
                    setReviewRating(5);
                    setReviewComment('');
                  }}
                >
                  Cancel
                </Button>
                <Button 
                  onClick={handleSubmitReview}
                  disabled={submittingReview || !reviewComment.trim()}
                  className="bg-purple-600 hover:bg-purple-700"
                >
                  {submittingReview ? (
                    <RefreshCw className="w-4 h-4 animate-spin mr-2" />
                  ) : (
                    <Star className="w-4 h-4 mr-2" />
                  )}
                  Submit Review
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </>
  );
};

export default MyBookings;
