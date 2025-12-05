import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import {
  User,
  CheckCircle,
  XCircle,
  Clock,
  Eye,
  FileText,
  Car,
  Calendar,
  MapPin,
  DollarSign,
  Filter,
  Search,
  ChevronDown,
  ChevronRight,
  AlertTriangle,
  Shield,
  Star,
  MoreVertical,
  ExternalLink,
  MessageSquare,
  Ban,
  Check,
  X,
  RefreshCw,
  Download,
  Image,
  Phone,
  Mail,
  Building,
  CreditCard,
  BadgeCheck,
  IdCard,
  Landmark,
  FileCheck,
  Plus,
  Edit,
  Trash,
  Receipt,
  Percent,
  Send,
  Globe,
  Award,
  Briefcase,
  Route
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

// Types
type DriverStatus = 'pending' | 'approved' | 'rejected' | 'suspended';
type BookingStatus = 'pending' | 'confirmed' | 'in_progress' | 'completed' | 'cancelled';

interface DriverDocument {
  id: string;
  type: 'cv' | 'driving_license' | 'sltda_license' | 'tour_guide_license' | 'police_report' | 'character_certificate' | 'profile_photo' | 'vehicle_photo';
  url: string;
  status: 'pending' | 'verified' | 'rejected';
  uploadedAt: Date;
  verifiedAt?: Date;
  rejectionReason?: string;
}

interface DriverSubmission {
  id: string;
  userId: string;

  // Personal Info
  firstName: string;
  lastName: string;
  shortName: string;
  email: string;
  phone: string;
  whatsapp?: string;
  profilePhoto?: string;
  dateOfBirth?: Date;
  address?: string;

  // Professional
  licenseNumber: string;
  sltdaLicense?: string;
  tourGuideLicense?: string;
  yearsExperience: number;
  bio?: string;
  tagline?: string;
  languages: string[];
  specialties: string[];
  coverageAreas: string[];

  // Vehicle
  vehiclePreference: 'own_vehicle' | 'company_vehicle' | 'any_vehicle';
  vehicle?: {
    type: string;
    make: string;
    model: string;
    year: number;
    seats: number;
    registrationNumber: string;
    features: string[];
  };

  // Documents
  documents: DriverDocument[];

  // Verification
  status: DriverStatus;
  badges: string[];
  rating: number;
  reviewCount: number;
  totalTrips: number;

  // Financial
  commissionRate: number; // Percentage
  totalEarnings: number;
  pendingPayouts: number;

  // Timestamps
  createdAt: Date;
  updatedAt: Date;
  approvedAt?: Date;
  approvedBy?: string;
  rejectionReason?: string;
}

interface DriverBooking {
  id: string;
  driverId: string;
  driverName: string;

  // Customer
  customerName: string;
  customerEmail: string;
  customerPhone: string;

  // Tour Details
  tourType: string;
  startDate: Date;
  endDate: Date;
  pickupLocation: string;
  dropoffLocation: string;
  destinations: string[];
  passengers: number;

  // Pricing
  basePriceUSD: number;
  driverCommission: number;
  rechargeCommission: number;
  totalPriceUSD: number;

  // Payment
  paymentStatus: 'pending' | 'partial' | 'paid' | 'refunded';
  paidAmount: number;

  // Status
  status: BookingStatus;
  notes?: string;

  // Timestamps
  createdAt: Date;
  confirmedAt?: Date;
  completedAt?: Date;
}

interface Invoice {
  id: string;
  bookingId: string;
  driverId: string;
  driverName: string;
  customerName: string;

  // Amounts
  totalAmount: number;
  driverPayout: number;
  rechargeCommission: number;

  // Status
  status: 'draft' | 'sent' | 'paid' | 'cancelled';

  // Dates
  issueDate: Date;
  dueDate: Date;
  paidDate?: Date;
}

// Badge definitions
const BADGE_INFO: Record<string, { icon: string; color: string; name: string }> = {
  recharge_verified: { icon: '✓', color: 'bg-emerald-500', name: 'Recharge Verified' },
  sltda_verified: { icon: '🏛️', color: 'bg-blue-600', name: 'SLTDA Licensed' },
  tour_guide_license: { icon: '🎓', color: 'bg-purple-600', name: 'Tour Guide' },
  five_star_driver: { icon: '⭐', color: 'bg-yellow-500', name: '5-Star Driver' },
  safe_driver: { icon: '🛡️', color: 'bg-teal-500', name: 'Safe Driver' },
  veteran_driver: { icon: '🎖️', color: 'bg-slate-600', name: 'Veteran' },
  wildlife_expert: { icon: '🦁', color: 'bg-lime-600', name: 'Wildlife Expert' },
  cultural_guide: { icon: '🏺', color: 'bg-orange-500', name: 'Cultural Guide' }
};

// Mock data
const mockDrivers: DriverSubmission[] = [
  {
    id: 'driver-001',
    userId: 'user-001',
    firstName: 'Keneth',
    lastName: 'Jayawardena',
    shortName: 'Kenny',
    email: 'kenny@email.com',
    phone: '+94 77 772 1999',
    whatsapp: '+94 77 772 1999',
    profilePhoto: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400',
    licenseNumber: 'DL-123456',
    sltdaLicense: 'SLTDA-2024-001',
    tourGuideLicense: 'TG-2024-001',
    yearsExperience: 8,
    bio: 'Professional driver with 8 years of experience in tourism.',
    tagline: 'Your trusted guide to authentic Sri Lanka',
    languages: ['English', 'Sinhala', 'German'],
    specialties: ['Wildlife Safaris', 'Cultural Tours'],
    coverageAreas: ['Colombo', 'Kandy', 'Yala', 'Ella'],
    vehiclePreference: 'own_vehicle',
    vehicle: {
      type: 'SUV',
      make: 'Toyota',
      model: 'Land Cruiser Prado',
      year: 2022,
      seats: 7,
      registrationNumber: 'CAB-1234',
      features: ['AC', 'WiFi', 'Cooler Box', 'First Aid']
    },
    documents: [
      { id: 'd1', type: 'driving_license', url: '/docs/license.jpg', status: 'verified', uploadedAt: new Date('2024-01-10') },
      { id: 'd2', type: 'sltda_license', url: '/docs/sltda.jpg', status: 'verified', uploadedAt: new Date('2024-01-10') },
      { id: 'd3', type: 'profile_photo', url: '/docs/photo.jpg', status: 'verified', uploadedAt: new Date('2024-01-10') },
    ],
    status: 'approved',
    badges: ['recharge_verified', 'sltda_verified', 'tour_guide_license', 'five_star_driver'],
    rating: 4.9,
    reviewCount: 127,
    totalTrips: 342,
    commissionRate: 15,
    totalEarnings: 45000,
    pendingPayouts: 2500,
    createdAt: new Date('2023-06-15'),
    updatedAt: new Date('2024-01-20'),
    approvedAt: new Date('2023-06-18'),
    approvedBy: 'admin'
  },
  {
    id: 'driver-002',
    userId: 'user-002',
    firstName: 'Nilan',
    lastName: 'Perera',
    shortName: 'Nilan',
    email: 'nilan@email.com',
    phone: '+94 77 234 5678',
    whatsapp: '+94 77 234 5678',
    profilePhoto: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400',
    licenseNumber: 'DL-789012',
    sltdaLicense: 'SLTDA-2024-002',
    yearsExperience: 12,
    bio: 'Expert in hill country and tea trails.',
    tagline: 'Expert in hill country and tea trails',
    languages: ['English', 'Sinhala', 'Tamil'],
    specialties: ['Hill Country', 'Tea Trails'],
    coverageAreas: ['Kandy', 'Nuwara Eliya', 'Ella', 'Hatton'],
    vehiclePreference: 'own_vehicle',
    vehicle: {
      type: 'Van',
      make: 'Toyota',
      model: 'KDH',
      year: 2021,
      seats: 10,
      registrationNumber: 'NW-5678',
      features: ['AC', 'WiFi', 'Cooler Box']
    },
    documents: [
      { id: 'd4', type: 'driving_license', url: '/docs/license2.jpg', status: 'verified', uploadedAt: new Date('2024-01-15') },
      { id: 'd5', type: 'sltda_license', url: '/docs/sltda2.jpg', status: 'verified', uploadedAt: new Date('2024-01-15') },
    ],
    status: 'approved',
    badges: ['recharge_verified', 'sltda_verified', 'veteran_driver', 'safe_driver'],
    rating: 4.8,
    reviewCount: 89,
    totalTrips: 256,
    commissionRate: 12,
    totalEarnings: 38000,
    pendingPayouts: 1800,
    createdAt: new Date('2022-03-10'),
    updatedAt: new Date('2024-01-18'),
    approvedAt: new Date('2022-03-15'),
    approvedBy: 'admin'
  },
  {
    id: 'driver-003',
    userId: 'user-003',
    firstName: 'Chaminda',
    lastName: 'Rajapaksa',
    shortName: 'Chaminda',
    email: 'chaminda@email.com',
    phone: '+94 77 345 6789',
    whatsapp: '+94 77 345 6789',
    profilePhoto: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400',
    licenseNumber: 'DL-345678',
    yearsExperience: 6,
    bio: 'Adventure tours and beach destinations specialist.',
    tagline: 'Adventure tours and beach destinations',
    languages: ['English', 'Sinhala', 'French'],
    specialties: ['Beach Tours', 'Adventure'],
    coverageAreas: ['Colombo', 'Galle', 'Mirissa', 'Bentota'],
    vehiclePreference: 'company_vehicle',
    documents: [
      { id: 'd6', type: 'driving_license', url: '/docs/license3.jpg', status: 'pending', uploadedAt: new Date('2024-01-20') },
      { id: 'd7', type: 'cv', url: '/docs/cv3.pdf', status: 'pending', uploadedAt: new Date('2024-01-20') },
    ],
    status: 'pending',
    badges: [],
    rating: 0,
    reviewCount: 0,
    totalTrips: 0,
    commissionRate: 15,
    totalEarnings: 0,
    pendingPayouts: 0,
    createdAt: new Date('2024-01-20'),
    updatedAt: new Date('2024-01-20'),
  }
];

const mockBookings: DriverBooking[] = [
  {
    id: 'booking-001',
    driverId: 'driver-001',
    driverName: 'Kenny',
    customerName: 'John Smith',
    customerEmail: 'john@email.com',
    customerPhone: '+1 555 123 4567',
    tourType: 'Wildlife Safari',
    startDate: new Date('2024-02-15'),
    endDate: new Date('2024-02-18'),
    pickupLocation: 'Colombo Airport',
    dropoffLocation: 'Colombo Airport',
    destinations: ['Yala National Park', 'Udawalawe'],
    passengers: 4,
    basePriceUSD: 850,
    driverCommission: 722.50,
    rechargeCommission: 127.50,
    totalPriceUSD: 850,
    paymentStatus: 'partial',
    paidAmount: 425,
    status: 'confirmed',
    createdAt: new Date('2024-01-25'),
    confirmedAt: new Date('2024-01-26'),
  },
  {
    id: 'booking-002',
    driverId: 'driver-002',
    driverName: 'Nilan',
    customerName: 'Emma Wilson',
    customerEmail: 'emma@email.com',
    customerPhone: '+44 20 7946 0958',
    tourType: 'Hill Country Tour',
    startDate: new Date('2024-02-20'),
    endDate: new Date('2024-02-25'),
    pickupLocation: 'Kandy',
    dropoffLocation: 'Colombo',
    destinations: ['Nuwara Eliya', 'Ella', 'Tea Plantations'],
    passengers: 2,
    basePriceUSD: 1200,
    driverCommission: 1056,
    rechargeCommission: 144,
    totalPriceUSD: 1200,
    paymentStatus: 'paid',
    paidAmount: 1200,
    status: 'confirmed',
    createdAt: new Date('2024-01-28'),
    confirmedAt: new Date('2024-01-29'),
  },
  {
    id: 'booking-003',
    driverId: 'driver-001',
    driverName: 'Kenny',
    customerName: 'Michael Brown',
    customerEmail: 'michael@email.com',
    customerPhone: '+1 555 987 6543',
    tourType: 'Cultural Tour',
    startDate: new Date('2024-03-01'),
    endDate: new Date('2024-03-05'),
    pickupLocation: 'Colombo Hotel',
    dropoffLocation: 'Colombo Hotel',
    destinations: ['Sigiriya', 'Dambulla', 'Polonnaruwa', 'Kandy'],
    passengers: 3,
    basePriceUSD: 980,
    driverCommission: 833,
    rechargeCommission: 147,
    totalPriceUSD: 980,
    paymentStatus: 'pending',
    paidAmount: 0,
    status: 'pending',
    createdAt: new Date('2024-02-01'),
  }
];

const mockInvoices: Invoice[] = [
  {
    id: 'inv-001',
    bookingId: 'booking-001',
    driverId: 'driver-001',
    driverName: 'Kenny',
    customerName: 'John Smith',
    totalAmount: 850,
    driverPayout: 722.50,
    rechargeCommission: 127.50,
    status: 'sent',
    issueDate: new Date('2024-01-26'),
    dueDate: new Date('2024-02-10'),
  },
  {
    id: 'inv-002',
    bookingId: 'booking-002',
    driverId: 'driver-002',
    driverName: 'Nilan',
    customerName: 'Emma Wilson',
    totalAmount: 1200,
    driverPayout: 1056,
    rechargeCommission: 144,
    status: 'paid',
    issueDate: new Date('2024-01-29'),
    dueDate: new Date('2024-02-12'),
    paidDate: new Date('2024-02-01'),
  }
];

const DriverAdmin: React.FC = () => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('drivers');
  const [drivers, setDrivers] = useState<DriverSubmission[]>(mockDrivers);
  const [bookings, setBookings] = useState<DriverBooking[]>(mockBookings);
  const [invoices, setInvoices] = useState<Invoice[]>(mockInvoices);
  const [loading, setLoading] = useState(false);

  // Driver states
  const [selectedDriver, setSelectedDriver] = useState<DriverSubmission | null>(null);
  const [driverViewMode, setDriverViewMode] = useState<'list' | 'detail'>('list');
  const [driverFilter, setDriverFilter] = useState<string>('all');
  const [driverSearch, setDriverSearch] = useState('');
  const [rejectionNotes, setRejectionNotes] = useState('');
  const [showRejectionModal, setShowRejectionModal] = useState(false);
  const [badgeEditMode, setBadgeEditMode] = useState(false);
  const [selectedBadges, setSelectedBadges] = useState<string[]>([]);
  const [commissionEdit, setCommissionEdit] = useState<number>(15);

  // Booking states
  const [selectedBooking, setSelectedBooking] = useState<DriverBooking | null>(null);
  const [bookingViewMode, setBookingViewMode] = useState<'list' | 'detail'>('list');
  const [bookingFilter, setBookingFilter] = useState<string>('all');
  const [bookingSearch, setBookingSearch] = useState('');
  const [showPricingModal, setShowPricingModal] = useState(false);
  const [editedPricing, setEditedPricing] = useState({
    basePriceUSD: 0,
    commissionRate: 15
  });

  // Invoice states
  const [invoiceFilter, setInvoiceFilter] = useState<string>('all');

  // Stats calculations
  const driverStats = {
    total: drivers.length,
    pending: drivers.filter(d => d.status === 'pending').length,
    approved: drivers.filter(d => d.status === 'approved').length,
    rejected: drivers.filter(d => d.status === 'rejected').length,
    suspended: drivers.filter(d => d.status === 'suspended').length
  };

  const bookingStats = {
    total: bookings.length,
    pending: bookings.filter(b => b.status === 'pending').length,
    confirmed: bookings.filter(b => b.status === 'confirmed').length,
    completed: bookings.filter(b => b.status === 'completed').length,
    totalRevenue: bookings.reduce((sum, b) => sum + b.totalPriceUSD, 0),
    totalCommission: bookings.reduce((sum, b) => sum + b.rechargeCommission, 0)
  };

  // Filter drivers
  const filteredDrivers = drivers.filter(driver => {
    const matchesStatus = driverFilter === 'all' || driver.status === driverFilter;
    const matchesSearch = driverSearch === '' ||
      `${driver.firstName} ${driver.lastName}`.toLowerCase().includes(driverSearch.toLowerCase()) ||
      driver.shortName.toLowerCase().includes(driverSearch.toLowerCase()) ||
      driver.email.toLowerCase().includes(driverSearch.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  // Filter bookings
  const filteredBookings = bookings.filter(booking => {
    const matchesStatus = bookingFilter === 'all' || booking.status === bookingFilter;
    const matchesSearch = bookingSearch === '' ||
      booking.customerName.toLowerCase().includes(bookingSearch.toLowerCase()) ||
      booking.driverName.toLowerCase().includes(bookingSearch.toLowerCase()) ||
      booking.id.toLowerCase().includes(bookingSearch.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  // Filter invoices
  const filteredInvoices = invoices.filter(inv => {
    return invoiceFilter === 'all' || inv.status === invoiceFilter;
  });

  // Driver actions
  const handleApproveDriver = async (driverId: string) => {
    setLoading(true);
    try {
      setDrivers(prev => prev.map(d =>
        d.id === driverId
          ? {
              ...d,
              status: 'approved' as DriverStatus,
              badges: [...d.badges, 'recharge_verified'],
              approvedAt: new Date(),
              approvedBy: 'admin'
            }
          : d
      ));

      toast({
        title: "Driver Approved",
        description: "The driver has been approved and can now receive bookings.",
      });

      setSelectedDriver(null);
      setDriverViewMode('list');
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to approve driver.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleRejectDriver = async (driverId: string) => {
    if (!rejectionNotes.trim()) {
      toast({
        title: "Notes Required",
        description: "Please provide a reason for rejection.",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);
    try {
      setDrivers(prev => prev.map(d =>
        d.id === driverId
          ? { ...d, status: 'rejected' as DriverStatus, rejectionReason: rejectionNotes }
          : d
      ));

      toast({
        title: "Driver Rejected",
        description: "The driver application has been rejected.",
      });

      setShowRejectionModal(false);
      setRejectionNotes('');
      setSelectedDriver(null);
      setDriverViewMode('list');
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to reject driver.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateBadges = async (driverId: string) => {
    setDrivers(prev => prev.map(d =>
      d.id === driverId ? { ...d, badges: selectedBadges } : d
    ));

    if (selectedDriver) {
      setSelectedDriver({ ...selectedDriver, badges: selectedBadges });
    }

    setBadgeEditMode(false);
    toast({
      title: "Badges Updated",
      description: "Driver badges have been updated successfully.",
    });
  };

  const handleUpdateCommission = async (driverId: string) => {
    setDrivers(prev => prev.map(d =>
      d.id === driverId ? { ...d, commissionRate: commissionEdit } : d
    ));

    if (selectedDriver) {
      setSelectedDriver({ ...selectedDriver, commissionRate: commissionEdit });
    }

    toast({
      title: "Commission Updated",
      description: `Driver commission rate set to ${commissionEdit}%`,
    });
  };

  // Booking actions
  const handleConfirmBooking = async (bookingId: string) => {
    setBookings(prev => prev.map(b =>
      b.id === bookingId
        ? { ...b, status: 'confirmed' as BookingStatus, confirmedAt: new Date() }
        : b
    ));

    // Create invoice
    const booking = bookings.find(b => b.id === bookingId);
    if (booking) {
      const newInvoice: Invoice = {
        id: `inv-${Date.now()}`,
        bookingId: booking.id,
        driverId: booking.driverId,
        driverName: booking.driverName,
        customerName: booking.customerName,
        totalAmount: booking.totalPriceUSD,
        driverPayout: booking.driverCommission,
        rechargeCommission: booking.rechargeCommission,
        status: 'draft',
        issueDate: new Date(),
        dueDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000), // 14 days
      };
      setInvoices(prev => [...prev, newInvoice]);
    }

    toast({
      title: "Booking Confirmed",
      description: "The booking has been confirmed and invoice created.",
    });
  };

  const handleUpdatePricing = async (bookingId: string) => {
    const commissionAmount = editedPricing.basePriceUSD * (editedPricing.commissionRate / 100);
    const driverAmount = editedPricing.basePriceUSD - commissionAmount;

    setBookings(prev => prev.map(b =>
      b.id === bookingId
        ? {
            ...b,
            basePriceUSD: editedPricing.basePriceUSD,
            totalPriceUSD: editedPricing.basePriceUSD,
            driverCommission: driverAmount,
            rechargeCommission: commissionAmount
          }
        : b
    ));

    setShowPricingModal(false);
    toast({
      title: "Pricing Updated",
      description: "Booking pricing has been updated.",
    });
  };

  // Invoice actions
  const handleSendInvoice = async (invoiceId: string) => {
    setInvoices(prev => prev.map(inv =>
      inv.id === invoiceId ? { ...inv, status: 'sent' } : inv
    ));

    toast({
      title: "Invoice Sent",
      description: "Invoice has been sent to the customer.",
    });
  };

  const handleMarkPaid = async (invoiceId: string) => {
    setInvoices(prev => prev.map(inv =>
      inv.id === invoiceId ? { ...inv, status: 'paid', paidDate: new Date() } : inv
    ));

    // Update booking payment status
    const invoice = invoices.find(inv => inv.id === invoiceId);
    if (invoice) {
      setBookings(prev => prev.map(b =>
        b.id === invoice.bookingId
          ? { ...b, paymentStatus: 'paid', paidAmount: b.totalPriceUSD }
          : b
      ));
    }

    toast({
      title: "Payment Recorded",
      description: "Invoice marked as paid.",
    });
  };

  const getStatusBadge = (status: DriverStatus) => {
    switch (status) {
      case 'approved':
        return <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800"><CheckCircle className="h-3 w-3" /> Approved</span>;
      case 'pending':
        return <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800"><Clock className="h-3 w-3" /> Pending</span>;
      case 'rejected':
        return <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800"><XCircle className="h-3 w-3" /> Rejected</span>;
      case 'suspended':
        return <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800"><Ban className="h-3 w-3" /> Suspended</span>;
      default:
        return null;
    }
  };

  const getBookingStatusBadge = (status: BookingStatus) => {
    switch (status) {
      case 'confirmed':
        return <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800"><CheckCircle className="h-3 w-3" /> Confirmed</span>;
      case 'pending':
        return <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800"><Clock className="h-3 w-3" /> Pending</span>;
      case 'in_progress':
        return <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800"><Route className="h-3 w-3" /> In Progress</span>;
      case 'completed':
        return <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800"><CheckCircle className="h-3 w-3" /> Completed</span>;
      case 'cancelled':
        return <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800"><XCircle className="h-3 w-3" /> Cancelled</span>;
      default:
        return null;
    }
  };

  const getPaymentStatusBadge = (status: string) => {
    switch (status) {
      case 'paid':
        return <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800"><CheckCircle className="h-3 w-3" /> Paid</span>;
      case 'partial':
        return <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800"><DollarSign className="h-3 w-3" /> Partial</span>;
      case 'pending':
        return <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-orange-100 text-orange-800"><Clock className="h-3 w-3" /> Pending</span>;
      case 'refunded':
        return <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800"><RefreshCw className="h-3 w-3" /> Refunded</span>;
      default:
        return null;
    }
  };

  // Driver Detail View
  const DriverDetailView = ({ driver }: { driver: DriverSubmission }) => (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            onClick={() => { setSelectedDriver(null); setDriverViewMode('list'); }}
            className="p-2"
          >
            <ChevronRight className="h-5 w-5 rotate-180" />
          </Button>
          {driver.profilePhoto ? (
            <img
              src={driver.profilePhoto}
              alt={driver.shortName}
              className="h-16 w-16 rounded-full object-cover border-2 border-gray-200"
            />
          ) : (
            <div className="h-16 w-16 rounded-full bg-gray-200 flex items-center justify-center">
              <User className="h-8 w-8 text-gray-500" />
            </div>
          )}
          <div>
            <h2 className="text-xl font-bold text-gray-900">{driver.firstName} {driver.lastName}</h2>
            <p className="text-sm text-gray-500">@{driver.shortName} | ID: {driver.id}</p>
            <div className="mt-1">{getStatusBadge(driver.status)}</div>
          </div>
        </div>

        <div className="flex gap-2">
          {driver.status === 'pending' && (
            <>
              <Button
                onClick={() => handleApproveDriver(driver.id)}
                className="bg-green-600 hover:bg-green-700"
                disabled={loading}
              >
                <Check className="h-4 w-4 mr-2" /> Approve
              </Button>
              <Button
                variant="destructive"
                onClick={() => setShowRejectionModal(true)}
                disabled={loading}
              >
                <X className="h-4 w-4 mr-2" /> Reject
              </Button>
            </>
          )}
          {driver.status === 'approved' && (
            <Button
              variant="outline"
              onClick={() => {
                setDrivers(prev => prev.map(d =>
                  d.id === driver.id ? { ...d, status: 'suspended' as DriverStatus } : d
                ));
                setSelectedDriver(null);
                setDriverViewMode('list');
                toast({ title: "Driver Suspended" });
              }}
              className="text-orange-600 border-orange-300 hover:bg-orange-50"
            >
              <Ban className="h-4 w-4 mr-2" /> Suspend
            </Button>
          )}
        </div>
      </div>

      {/* Rejection Reason */}
      {driver.rejectionReason && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-start gap-2">
            <AlertTriangle className="h-5 w-5 text-red-600 mt-0.5" />
            <div>
              <h4 className="font-medium text-red-800">Rejection Reason</h4>
              <p className="text-sm text-red-700 mt-1">{driver.rejectionReason}</p>
            </div>
          </div>
        </div>
      )}

      {/* Info Grid */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Personal Info */}
        <div className="bg-white rounded-lg border p-6">
          <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <User className="h-5 w-5 text-blue-600" /> Personal Information
          </h3>
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <Mail className="h-4 w-4 text-gray-400" />
              <span className="text-sm">{driver.email}</span>
            </div>
            <div className="flex items-center gap-3">
              <Phone className="h-4 w-4 text-gray-400" />
              <span className="text-sm">{driver.phone}</span>
            </div>
            {driver.whatsapp && (
              <div className="flex items-center gap-3">
                <MessageSquare className="h-4 w-4 text-gray-400" />
                <span className="text-sm">WhatsApp: {driver.whatsapp}</span>
              </div>
            )}
            <div className="flex items-center gap-3">
              <Globe className="h-4 w-4 text-gray-400" />
              <span className="text-sm">{driver.languages.join(', ')}</span>
            </div>
            <div className="flex items-center gap-3">
              <Briefcase className="h-4 w-4 text-gray-400" />
              <span className="text-sm">{driver.yearsExperience} years experience</span>
            </div>
          </div>
        </div>

        {/* Licenses */}
        <div className="bg-white rounded-lg border p-6">
          <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <IdCard className="h-5 w-5 text-blue-600" /> Licenses
          </h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Driving License:</span>
              <span className="text-sm font-medium">{driver.licenseNumber}</span>
            </div>
            {driver.sltdaLicense && (
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">SLTDA License:</span>
                <span className="text-sm font-medium">{driver.sltdaLicense}</span>
              </div>
            )}
            {driver.tourGuideLicense && (
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Tour Guide License:</span>
                <span className="text-sm font-medium">{driver.tourGuideLicense}</span>
              </div>
            )}
          </div>
        </div>

        {/* Vehicle Info */}
        <div className="bg-white rounded-lg border p-6">
          <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <Car className="h-5 w-5 text-blue-600" /> Vehicle Information
          </h3>
          {driver.vehiclePreference === 'own_vehicle' && driver.vehicle ? (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Type:</span>
                <span className="text-sm font-medium">{driver.vehicle.type}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Vehicle:</span>
                <span className="text-sm font-medium">{driver.vehicle.make} {driver.vehicle.model} ({driver.vehicle.year})</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Seats:</span>
                <span className="text-sm font-medium">{driver.vehicle.seats}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Registration:</span>
                <span className="text-sm font-medium">{driver.vehicle.registrationNumber}</span>
              </div>
              <div className="flex flex-wrap gap-2 mt-2">
                {driver.vehicle.features.map((feature, i) => (
                  <span key={i} className="px-2 py-1 bg-gray-100 rounded-full text-xs text-gray-700">
                    {feature}
                  </span>
                ))}
              </div>
            </div>
          ) : (
            <p className="text-sm text-gray-600">
              {driver.vehiclePreference === 'company_vehicle'
                ? 'Drives Recharge Fleet Vehicles'
                : 'Can drive any vehicle'}
            </p>
          )}
        </div>

        {/* Stats */}
        <div className="bg-white rounded-lg border p-6">
          <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <Star className="h-5 w-5 text-blue-600" /> Performance Stats
          </h3>
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center p-3 bg-gray-50 rounded-lg">
              <div className="text-2xl font-bold text-gray-900">{driver.totalTrips}</div>
              <div className="text-xs text-gray-500">Total Trips</div>
            </div>
            <div className="text-center p-3 bg-gray-50 rounded-lg">
              <div className="text-2xl font-bold text-yellow-600 flex items-center justify-center gap-1">
                <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                {driver.rating > 0 ? driver.rating.toFixed(1) : 'N/A'}
              </div>
              <div className="text-xs text-gray-500">{driver.reviewCount} reviews</div>
            </div>
            <div className="text-center p-3 bg-gray-50 rounded-lg">
              <div className="text-2xl font-bold text-green-600">${driver.totalEarnings.toLocaleString()}</div>
              <div className="text-xs text-gray-500">Total Earnings</div>
            </div>
            <div className="text-center p-3 bg-gray-50 rounded-lg">
              <div className="text-2xl font-bold text-orange-600">${driver.pendingPayouts.toLocaleString()}</div>
              <div className="text-xs text-gray-500">Pending Payouts</div>
            </div>
          </div>
        </div>
      </div>

      {/* Badges Section */}
      <div className="bg-white rounded-lg border p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-gray-900 flex items-center gap-2">
            <Award className="h-5 w-5 text-blue-600" /> Driver Badges
          </h3>
          {driver.status === 'approved' && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setBadgeEditMode(!badgeEditMode);
                setSelectedBadges(driver.badges);
              }}
            >
              <Edit className="h-4 w-4 mr-1" /> {badgeEditMode ? 'Cancel' : 'Edit'}
            </Button>
          )}
        </div>

        {badgeEditMode ? (
          <div className="space-y-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {Object.entries(BADGE_INFO).map(([key, badge]) => (
                <label
                  key={key}
                  className={`flex items-center gap-2 p-3 rounded-lg border cursor-pointer transition-colors ${
                    selectedBadges.includes(key) ? 'bg-blue-50 border-blue-300' : 'bg-white hover:bg-gray-50'
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={selectedBadges.includes(key)}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setSelectedBadges([...selectedBadges, key]);
                      } else {
                        setSelectedBadges(selectedBadges.filter(b => b !== key));
                      }
                    }}
                    className="sr-only"
                  />
                  <span className="text-lg">{badge.icon}</span>
                  <span className="text-sm font-medium">{badge.name}</span>
                </label>
              ))}
            </div>
            <Button onClick={() => handleUpdateBadges(driver.id)}>
              Save Badges
            </Button>
          </div>
        ) : (
          <div className="flex flex-wrap gap-2">
            {driver.badges.length > 0 ? (
              driver.badges.map((badgeKey) => {
                const badge = BADGE_INFO[badgeKey];
                if (!badge) return null;
                return (
                  <span
                    key={badgeKey}
                    className={`${badge.color} text-white px-3 py-1.5 rounded-full text-sm font-medium flex items-center gap-1`}
                  >
                    <span>{badge.icon}</span>
                    <span>{badge.name}</span>
                  </span>
                );
              })
            ) : (
              <p className="text-gray-500 text-sm">No badges assigned yet</p>
            )}
          </div>
        )}
      </div>

      {/* Commission Section */}
      <div className="bg-white rounded-lg border p-6">
        <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <Percent className="h-5 w-5 text-blue-600" /> Commission Rate
        </h3>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <span className="text-gray-600">Current Rate:</span>
            <span className="text-2xl font-bold text-blue-600">{driver.commissionRate}%</span>
          </div>
          <div className="flex items-center gap-2">
            <Input
              type="number"
              min="0"
              max="50"
              value={commissionEdit}
              onChange={(e) => setCommissionEdit(Number(e.target.value))}
              className="w-24"
            />
            <span className="text-gray-500">%</span>
            <Button
              size="sm"
              onClick={() => handleUpdateCommission(driver.id)}
              disabled={commissionEdit === driver.commissionRate}
            >
              Update
            </Button>
          </div>
        </div>
        <p className="text-sm text-gray-500 mt-2">
          Recharge keeps {driver.commissionRate}% commission, driver receives {100 - driver.commissionRate}% of booking value.
        </p>
      </div>

      {/* Documents */}
      <div className="bg-white rounded-lg border p-6">
        <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <FileText className="h-5 w-5 text-blue-600" /> Uploaded Documents
        </h3>
        {driver.documents.length === 0 ? (
          <p className="text-gray-500 text-center py-8">No documents uploaded</p>
        ) : (
          <div className="space-y-3">
            {driver.documents.map((doc) => (
              <div
                key={doc.id}
                className="flex items-center justify-between p-4 border rounded-lg"
              >
                <div className="flex items-center gap-4">
                  <FileText className="h-8 w-8 text-gray-400" />
                  <div>
                    <p className="font-medium text-gray-900 capitalize">
                      {doc.type.replace(/_/g, ' ')}
                    </p>
                    <p className="text-xs text-gray-500">
                      Uploaded: {doc.uploadedAt.toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  {doc.status === 'verified' && (
                    <span className="inline-flex items-center gap-1 px-2 py-1 rounded text-xs font-medium bg-green-100 text-green-700">
                      <Check className="h-3 w-3" /> Verified
                    </span>
                  )}
                  {doc.status === 'pending' && (
                    <span className="inline-flex items-center gap-1 px-2 py-1 rounded text-xs font-medium bg-yellow-100 text-yellow-700">
                      <Clock className="h-3 w-3" /> Pending
                    </span>
                  )}
                  {doc.status === 'rejected' && (
                    <span className="inline-flex items-center gap-1 px-2 py-1 rounded text-xs font-medium bg-red-100 text-red-700">
                      <X className="h-3 w-3" /> Rejected
                    </span>
                  )}
                  <Button variant="ghost" size="sm">
                    <Eye className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );

  // Booking Detail View
  const BookingDetailView = ({ booking }: { booking: DriverBooking }) => (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            onClick={() => { setSelectedBooking(null); setBookingViewMode('list'); }}
            className="p-2"
          >
            <ChevronRight className="h-5 w-5 rotate-180" />
          </Button>
          <div>
            <h2 className="text-xl font-bold text-gray-900">Booking #{booking.id}</h2>
            <p className="text-sm text-gray-500">{booking.tourType}</p>
            <div className="mt-1 flex gap-2">
              {getBookingStatusBadge(booking.status)}
              {getPaymentStatusBadge(booking.paymentStatus)}
            </div>
          </div>
        </div>

        <div className="flex gap-2">
          {booking.status === 'pending' && (
            <Button
              onClick={() => handleConfirmBooking(booking.id)}
              className="bg-green-600 hover:bg-green-700"
            >
              <Check className="h-4 w-4 mr-2" /> Confirm & Send to Driver
            </Button>
          )}
          <Button
            variant="outline"
            onClick={() => {
              setEditedPricing({
                basePriceUSD: booking.basePriceUSD,
                commissionRate: Math.round((booking.rechargeCommission / booking.totalPriceUSD) * 100)
              });
              setShowPricingModal(true);
            }}
          >
            <Edit className="h-4 w-4 mr-2" /> Edit Pricing
          </Button>
        </div>
      </div>

      {/* Info Grid */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Customer Info */}
        <div className="bg-white rounded-lg border p-6">
          <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <User className="h-5 w-5 text-blue-600" /> Customer Information
          </h3>
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <User className="h-4 w-4 text-gray-400" />
              <span className="text-sm font-medium">{booking.customerName}</span>
            </div>
            <div className="flex items-center gap-3">
              <Mail className="h-4 w-4 text-gray-400" />
              <span className="text-sm">{booking.customerEmail}</span>
            </div>
            <div className="flex items-center gap-3">
              <Phone className="h-4 w-4 text-gray-400" />
              <span className="text-sm">{booking.customerPhone}</span>
            </div>
          </div>
        </div>

        {/* Driver Info */}
        <div className="bg-white rounded-lg border p-6">
          <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <Car className="h-5 w-5 text-blue-600" /> Assigned Driver
          </h3>
          <div className="flex items-center gap-4">
            <div className="h-12 w-12 rounded-full bg-gray-200 flex items-center justify-center">
              <User className="h-6 w-6 text-gray-500" />
            </div>
            <div>
              <p className="font-medium">{booking.driverName}</p>
              <p className="text-sm text-gray-500">ID: {booking.driverId}</p>
            </div>
          </div>
        </div>

        {/* Tour Details */}
        <div className="bg-white rounded-lg border p-6">
          <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <Route className="h-5 w-5 text-blue-600" /> Tour Details
          </h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Dates:</span>
              <span className="text-sm font-medium">
                {booking.startDate.toLocaleDateString()} - {booking.endDate.toLocaleDateString()}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Passengers:</span>
              <span className="text-sm font-medium">{booking.passengers}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Pickup:</span>
              <span className="text-sm font-medium">{booking.pickupLocation}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Dropoff:</span>
              <span className="text-sm font-medium">{booking.dropoffLocation}</span>
            </div>
            <div>
              <span className="text-sm text-gray-600">Destinations:</span>
              <div className="flex flex-wrap gap-2 mt-2">
                {booking.destinations.map((dest, i) => (
                  <span key={i} className="px-2 py-1 bg-blue-50 text-blue-700 rounded-full text-xs">
                    {dest}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Pricing Breakdown */}
        <div className="bg-white rounded-lg border p-6">
          <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <DollarSign className="h-5 w-5 text-blue-600" /> Pricing Breakdown
          </h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Total Price:</span>
              <span className="text-lg font-bold text-gray-900">${booking.totalPriceUSD}</span>
            </div>
            <div className="border-t pt-3">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">Driver Payout:</span>
                <span className="font-medium text-green-600">${booking.driverCommission.toFixed(2)}</span>
              </div>
              <div className="flex items-center justify-between text-sm mt-1">
                <span className="text-gray-600">Recharge Commission:</span>
                <span className="font-medium text-blue-600">${booking.rechargeCommission.toFixed(2)}</span>
              </div>
            </div>
            <div className="border-t pt-3">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">Paid Amount:</span>
                <span className="font-medium">${booking.paidAmount}</span>
              </div>
              <div className="flex items-center justify-between text-sm mt-1">
                <span className="text-gray-600">Balance Due:</span>
                <span className="font-medium text-orange-600">${booking.totalPriceUSD - booking.paidAmount}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <>
      <Helmet>
        <title>Driver Management | Admin - Recharge Travels</title>
      </Helmet>

      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 py-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
              <User className="h-8 w-8 text-blue-600" />
              Driver Management
            </h1>
            <p className="text-gray-600 mt-2">Manage drivers, bookings, pricing, invoices, and commissions</p>
          </div>

          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
            <TabsList className="bg-white border p-1 rounded-lg">
              <TabsTrigger value="drivers" className="flex items-center gap-2">
                <User className="h-4 w-4" />
                Drivers
                {driverStats.pending > 0 && (
                  <span className="ml-1 bg-yellow-500 text-white text-xs px-2 py-0.5 rounded-full">
                    {driverStats.pending}
                  </span>
                )}
              </TabsTrigger>
              <TabsTrigger value="bookings" className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                Bookings
                {bookingStats.pending > 0 && (
                  <span className="ml-1 bg-orange-500 text-white text-xs px-2 py-0.5 rounded-full">
                    {bookingStats.pending}
                  </span>
                )}
              </TabsTrigger>
              <TabsTrigger value="invoices" className="flex items-center gap-2">
                <Receipt className="h-4 w-4" />
                Invoices
              </TabsTrigger>
              <TabsTrigger value="commissions" className="flex items-center gap-2">
                <Percent className="h-4 w-4" />
                Commissions
              </TabsTrigger>
            </TabsList>

            {/* Drivers Tab */}
            <TabsContent value="drivers">
              {driverViewMode === 'list' ? (
                <>
                  {/* Driver Stats */}
                  <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
                    <div className="bg-white rounded-lg border p-4">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                          <User className="h-5 w-5 text-blue-600" />
                        </div>
                        <div>
                          <p className="text-2xl font-bold text-gray-900">{driverStats.total}</p>
                          <p className="text-xs text-gray-500">Total Drivers</p>
                        </div>
                      </div>
                    </div>
                    <div className="bg-white rounded-lg border p-4">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-full bg-yellow-100 flex items-center justify-center">
                          <Clock className="h-5 w-5 text-yellow-600" />
                        </div>
                        <div>
                          <p className="text-2xl font-bold text-yellow-600">{driverStats.pending}</p>
                          <p className="text-xs text-gray-500">Pending</p>
                        </div>
                      </div>
                    </div>
                    <div className="bg-white rounded-lg border p-4">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-full bg-green-100 flex items-center justify-center">
                          <CheckCircle className="h-5 w-5 text-green-600" />
                        </div>
                        <div>
                          <p className="text-2xl font-bold text-green-600">{driverStats.approved}</p>
                          <p className="text-xs text-gray-500">Approved</p>
                        </div>
                      </div>
                    </div>
                    <div className="bg-white rounded-lg border p-4">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-full bg-red-100 flex items-center justify-center">
                          <XCircle className="h-5 w-5 text-red-600" />
                        </div>
                        <div>
                          <p className="text-2xl font-bold text-red-600">{driverStats.rejected}</p>
                          <p className="text-xs text-gray-500">Rejected</p>
                        </div>
                      </div>
                    </div>
                    <div className="bg-white rounded-lg border p-4">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-full bg-gray-100 flex items-center justify-center">
                          <Ban className="h-5 w-5 text-gray-600" />
                        </div>
                        <div>
                          <p className="text-2xl font-bold text-gray-600">{driverStats.suspended}</p>
                          <p className="text-xs text-gray-500">Suspended</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Filters */}
                  <div className="bg-white rounded-lg border p-4 mb-6">
                    <div className="flex flex-col md:flex-row gap-4">
                      <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <Input
                          value={driverSearch}
                          onChange={(e) => setDriverSearch(e.target.value)}
                          placeholder="Search by name or email..."
                          className="pl-10"
                        />
                      </div>
                      <select
                        value={driverFilter}
                        onChange={(e) => setDriverFilter(e.target.value)}
                        className="px-3 py-2 border rounded-md text-sm"
                        aria-label="Filter by status"
                      >
                        <option value="all">All Status</option>
                        <option value="pending">Pending</option>
                        <option value="approved">Approved</option>
                        <option value="rejected">Rejected</option>
                        <option value="suspended">Suspended</option>
                      </select>
                    </div>
                  </div>

                  {/* Drivers Table */}
                  <div className="bg-white rounded-lg border overflow-hidden">
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead className="bg-gray-50 border-b">
                          <tr>
                            <th className="text-left px-6 py-3 text-xs font-semibold text-gray-600 uppercase">Driver</th>
                            <th className="text-left px-6 py-3 text-xs font-semibold text-gray-600 uppercase">Contact</th>
                            <th className="text-left px-6 py-3 text-xs font-semibold text-gray-600 uppercase">Vehicle</th>
                            <th className="text-left px-6 py-3 text-xs font-semibold text-gray-600 uppercase">Status</th>
                            <th className="text-left px-6 py-3 text-xs font-semibold text-gray-600 uppercase">Stats</th>
                            <th className="text-left px-6 py-3 text-xs font-semibold text-gray-600 uppercase">Actions</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                          {filteredDrivers.map((driver) => (
                            <tr key={driver.id} className="hover:bg-gray-50">
                              <td className="px-6 py-4">
                                <div className="flex items-center gap-3">
                                  {driver.profilePhoto ? (
                                    <img
                                      src={driver.profilePhoto}
                                      alt={driver.shortName}
                                      className="h-10 w-10 rounded-full object-cover"
                                    />
                                  ) : (
                                    <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
                                      <User className="h-5 w-5 text-gray-500" />
                                    </div>
                                  )}
                                  <div>
                                    <p className="font-medium text-gray-900">{driver.shortName}</p>
                                    <p className="text-xs text-gray-500">{driver.yearsExperience} years exp.</p>
                                  </div>
                                </div>
                              </td>
                              <td className="px-6 py-4">
                                <p className="text-sm text-gray-900">{driver.email}</p>
                                <p className="text-xs text-gray-500">{driver.phone}</p>
                              </td>
                              <td className="px-6 py-4">
                                <p className="text-sm">
                                  {driver.vehiclePreference === 'own_vehicle' && driver.vehicle
                                    ? `${driver.vehicle.make} ${driver.vehicle.model}`
                                    : driver.vehiclePreference === 'company_vehicle'
                                      ? 'Fleet Vehicle'
                                      : 'Any Vehicle'}
                                </p>
                              </td>
                              <td className="px-6 py-4">
                                {getStatusBadge(driver.status)}
                              </td>
                              <td className="px-6 py-4">
                                <div className="flex items-center gap-3 text-sm">
                                  <span className="flex items-center gap-1">
                                    <Route className="h-3 w-3 text-gray-400" />
                                    {driver.totalTrips}
                                  </span>
                                  {driver.rating > 0 && (
                                    <span className="flex items-center gap-1">
                                      <Star className="h-3 w-3 text-yellow-400 fill-yellow-400" />
                                      {driver.rating.toFixed(1)}
                                    </span>
                                  )}
                                </div>
                              </td>
                              <td className="px-6 py-4">
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => { setSelectedDriver(driver); setDriverViewMode('detail'); }}
                                >
                                  <Eye className="h-4 w-4 mr-1" /> View
                                </Button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </>
              ) : selectedDriver ? (
                <DriverDetailView driver={selectedDriver} />
              ) : null}
            </TabsContent>

            {/* Bookings Tab */}
            <TabsContent value="bookings">
              {bookingViewMode === 'list' ? (
                <>
                  {/* Booking Stats */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                    <div className="bg-white rounded-lg border p-4">
                      <p className="text-2xl font-bold text-gray-900">{bookingStats.total}</p>
                      <p className="text-sm text-gray-500">Total Bookings</p>
                    </div>
                    <div className="bg-white rounded-lg border p-4">
                      <p className="text-2xl font-bold text-yellow-600">{bookingStats.pending}</p>
                      <p className="text-sm text-gray-500">Pending Confirmation</p>
                    </div>
                    <div className="bg-white rounded-lg border p-4">
                      <p className="text-2xl font-bold text-green-600">${bookingStats.totalRevenue.toLocaleString()}</p>
                      <p className="text-sm text-gray-500">Total Revenue</p>
                    </div>
                    <div className="bg-white rounded-lg border p-4">
                      <p className="text-2xl font-bold text-blue-600">${bookingStats.totalCommission.toLocaleString()}</p>
                      <p className="text-sm text-gray-500">Total Commission</p>
                    </div>
                  </div>

                  {/* Filters */}
                  <div className="bg-white rounded-lg border p-4 mb-6">
                    <div className="flex flex-col md:flex-row gap-4">
                      <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <Input
                          value={bookingSearch}
                          onChange={(e) => setBookingSearch(e.target.value)}
                          placeholder="Search by customer, driver, or booking ID..."
                          className="pl-10"
                        />
                      </div>
                      <select
                        value={bookingFilter}
                        onChange={(e) => setBookingFilter(e.target.value)}
                        className="px-3 py-2 border rounded-md text-sm"
                        aria-label="Filter by status"
                      >
                        <option value="all">All Status</option>
                        <option value="pending">Pending</option>
                        <option value="confirmed">Confirmed</option>
                        <option value="in_progress">In Progress</option>
                        <option value="completed">Completed</option>
                        <option value="cancelled">Cancelled</option>
                      </select>
                    </div>
                  </div>

                  {/* Bookings Table */}
                  <div className="bg-white rounded-lg border overflow-hidden">
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead className="bg-gray-50 border-b">
                          <tr>
                            <th className="text-left px-6 py-3 text-xs font-semibold text-gray-600 uppercase">Booking</th>
                            <th className="text-left px-6 py-3 text-xs font-semibold text-gray-600 uppercase">Customer</th>
                            <th className="text-left px-6 py-3 text-xs font-semibold text-gray-600 uppercase">Driver</th>
                            <th className="text-left px-6 py-3 text-xs font-semibold text-gray-600 uppercase">Dates</th>
                            <th className="text-left px-6 py-3 text-xs font-semibold text-gray-600 uppercase">Price</th>
                            <th className="text-left px-6 py-3 text-xs font-semibold text-gray-600 uppercase">Status</th>
                            <th className="text-left px-6 py-3 text-xs font-semibold text-gray-600 uppercase">Actions</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                          {filteredBookings.map((booking) => (
                            <tr key={booking.id} className="hover:bg-gray-50">
                              <td className="px-6 py-4">
                                <p className="font-medium text-gray-900">#{booking.id}</p>
                                <p className="text-xs text-gray-500">{booking.tourType}</p>
                              </td>
                              <td className="px-6 py-4">
                                <p className="text-sm text-gray-900">{booking.customerName}</p>
                                <p className="text-xs text-gray-500">{booking.passengers} passengers</p>
                              </td>
                              <td className="px-6 py-4">
                                <p className="text-sm text-gray-900">{booking.driverName}</p>
                              </td>
                              <td className="px-6 py-4">
                                <p className="text-sm">{booking.startDate.toLocaleDateString()}</p>
                                <p className="text-xs text-gray-500">to {booking.endDate.toLocaleDateString()}</p>
                              </td>
                              <td className="px-6 py-4">
                                <p className="text-sm font-medium">${booking.totalPriceUSD}</p>
                                {getPaymentStatusBadge(booking.paymentStatus)}
                              </td>
                              <td className="px-6 py-4">
                                {getBookingStatusBadge(booking.status)}
                              </td>
                              <td className="px-6 py-4">
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => { setSelectedBooking(booking); setBookingViewMode('detail'); }}
                                >
                                  <Eye className="h-4 w-4 mr-1" /> View
                                </Button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </>
              ) : selectedBooking ? (
                <BookingDetailView booking={selectedBooking} />
              ) : null}
            </TabsContent>

            {/* Invoices Tab */}
            <TabsContent value="invoices">
              {/* Invoice Filters */}
              <div className="bg-white rounded-lg border p-4 mb-6">
                <select
                  value={invoiceFilter}
                  onChange={(e) => setInvoiceFilter(e.target.value)}
                  className="px-3 py-2 border rounded-md text-sm"
                  aria-label="Filter by status"
                >
                  <option value="all">All Status</option>
                  <option value="draft">Draft</option>
                  <option value="sent">Sent</option>
                  <option value="paid">Paid</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>

              {/* Invoices Table */}
              <div className="bg-white rounded-lg border overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50 border-b">
                      <tr>
                        <th className="text-left px-6 py-3 text-xs font-semibold text-gray-600 uppercase">Invoice</th>
                        <th className="text-left px-6 py-3 text-xs font-semibold text-gray-600 uppercase">Customer</th>
                        <th className="text-left px-6 py-3 text-xs font-semibold text-gray-600 uppercase">Driver</th>
                        <th className="text-left px-6 py-3 text-xs font-semibold text-gray-600 uppercase">Amount</th>
                        <th className="text-left px-6 py-3 text-xs font-semibold text-gray-600 uppercase">Commission</th>
                        <th className="text-left px-6 py-3 text-xs font-semibold text-gray-600 uppercase">Status</th>
                        <th className="text-left px-6 py-3 text-xs font-semibold text-gray-600 uppercase">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {filteredInvoices.map((invoice) => (
                        <tr key={invoice.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4">
                            <p className="font-medium text-gray-900">#{invoice.id}</p>
                            <p className="text-xs text-gray-500">Due: {invoice.dueDate.toLocaleDateString()}</p>
                          </td>
                          <td className="px-6 py-4">
                            <p className="text-sm text-gray-900">{invoice.customerName}</p>
                          </td>
                          <td className="px-6 py-4">
                            <p className="text-sm text-gray-900">{invoice.driverName}</p>
                          </td>
                          <td className="px-6 py-4">
                            <p className="text-sm font-medium">${invoice.totalAmount}</p>
                          </td>
                          <td className="px-6 py-4">
                            <p className="text-sm text-blue-600">${invoice.rechargeCommission.toFixed(2)}</p>
                          </td>
                          <td className="px-6 py-4">
                            {invoice.status === 'draft' && (
                              <span className="px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-700">Draft</span>
                            )}
                            {invoice.status === 'sent' && (
                              <span className="px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-700">Sent</span>
                            )}
                            {invoice.status === 'paid' && (
                              <span className="px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700">Paid</span>
                            )}
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex gap-2">
                              {invoice.status === 'draft' && (
                                <Button size="sm" onClick={() => handleSendInvoice(invoice.id)}>
                                  <Send className="h-4 w-4 mr-1" /> Send
                                </Button>
                              )}
                              {invoice.status === 'sent' && (
                                <Button size="sm" className="bg-green-600 hover:bg-green-700" onClick={() => handleMarkPaid(invoice.id)}>
                                  <Check className="h-4 w-4 mr-1" /> Mark Paid
                                </Button>
                              )}
                              <Button variant="outline" size="sm">
                                <Download className="h-4 w-4" />
                              </Button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </TabsContent>

            {/* Commissions Tab */}
            <TabsContent value="commissions">
              <div className="space-y-6">
                {/* Commission Overview */}
                <div className="grid md:grid-cols-3 gap-6">
                  <div className="bg-white rounded-lg border p-6">
                    <h3 className="font-semibold text-gray-900 mb-2">Total Commission Earned</h3>
                    <p className="text-3xl font-bold text-blue-600">
                      ${bookingStats.totalCommission.toLocaleString()}
                    </p>
                    <p className="text-sm text-gray-500 mt-1">From {bookingStats.total} bookings</p>
                  </div>
                  <div className="bg-white rounded-lg border p-6">
                    <h3 className="font-semibold text-gray-900 mb-2">Driver Payouts</h3>
                    <p className="text-3xl font-bold text-green-600">
                      ${(bookingStats.totalRevenue - bookingStats.totalCommission).toLocaleString()}
                    </p>
                    <p className="text-sm text-gray-500 mt-1">Total paid to drivers</p>
                  </div>
                  <div className="bg-white rounded-lg border p-6">
                    <h3 className="font-semibold text-gray-900 mb-2">Average Commission Rate</h3>
                    <p className="text-3xl font-bold text-purple-600">
                      {bookingStats.totalRevenue > 0
                        ? ((bookingStats.totalCommission / bookingStats.totalRevenue) * 100).toFixed(1)
                        : 0}%
                    </p>
                    <p className="text-sm text-gray-500 mt-1">Across all bookings</p>
                  </div>
                </div>

                {/* Per-Driver Commission Summary */}
                <div className="bg-white rounded-lg border p-6">
                  <h3 className="font-semibold text-gray-900 mb-4">Driver Commission Summary</h3>
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="text-left px-4 py-3 text-xs font-semibold text-gray-600 uppercase">Driver</th>
                          <th className="text-left px-4 py-3 text-xs font-semibold text-gray-600 uppercase">Rate</th>
                          <th className="text-left px-4 py-3 text-xs font-semibold text-gray-600 uppercase">Total Earnings</th>
                          <th className="text-left px-4 py-3 text-xs font-semibold text-gray-600 uppercase">Pending Payouts</th>
                          <th className="text-left px-4 py-3 text-xs font-semibold text-gray-600 uppercase">Trips</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y">
                        {drivers.filter(d => d.status === 'approved').map((driver) => (
                          <tr key={driver.id} className="hover:bg-gray-50">
                            <td className="px-4 py-3">
                              <div className="flex items-center gap-3">
                                {driver.profilePhoto ? (
                                  <img src={driver.profilePhoto} alt={driver.shortName} className="h-8 w-8 rounded-full object-cover" />
                                ) : (
                                  <div className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center">
                                    <User className="h-4 w-4 text-gray-500" />
                                  </div>
                                )}
                                <span className="font-medium">{driver.shortName}</span>
                              </div>
                            </td>
                            <td className="px-4 py-3">
                              <span className="text-blue-600 font-medium">{driver.commissionRate}%</span>
                            </td>
                            <td className="px-4 py-3">
                              <span className="text-green-600 font-medium">${driver.totalEarnings.toLocaleString()}</span>
                            </td>
                            <td className="px-4 py-3">
                              <span className="text-orange-600 font-medium">${driver.pendingPayouts.toLocaleString()}</span>
                            </td>
                            <td className="px-4 py-3">
                              <span>{driver.totalTrips}</span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>

      {/* Rejection Modal */}
      {showRejectionModal && selectedDriver && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold mb-2 flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-red-600" />
              Reject Driver Application
            </h3>
            <p className="text-sm text-gray-600 mb-4">
              Please provide a reason for rejecting <strong>{selectedDriver.firstName} {selectedDriver.lastName}</strong>'s application.
            </p>
            <Textarea
              value={rejectionNotes}
              onChange={(e) => setRejectionNotes(e.target.value)}
              placeholder="Enter rejection reason..."
              className="mb-4"
              rows={4}
            />
            <div className="flex gap-3 justify-end">
              <Button
                variant="outline"
                onClick={() => { setShowRejectionModal(false); setRejectionNotes(''); }}
              >
                Cancel
              </Button>
              <Button
                variant="destructive"
                onClick={() => handleRejectDriver(selectedDriver.id)}
                disabled={loading || !rejectionNotes.trim()}
              >
                Reject Application
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Pricing Edit Modal */}
      {showPricingModal && selectedBooking && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold mb-4">Edit Booking Pricing</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Base Price (USD)</label>
                <Input
                  type="number"
                  value={editedPricing.basePriceUSD}
                  onChange={(e) => setEditedPricing({ ...editedPricing, basePriceUSD: Number(e.target.value) })}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Commission Rate (%)</label>
                <Input
                  type="number"
                  min="0"
                  max="50"
                  value={editedPricing.commissionRate}
                  onChange={(e) => setEditedPricing({ ...editedPricing, commissionRate: Number(e.target.value) })}
                />
              </div>
              <div className="bg-gray-50 rounded-lg p-4">
                <p className="text-sm text-gray-600">
                  Driver Payout: <strong className="text-green-600">
                    ${(editedPricing.basePriceUSD * (1 - editedPricing.commissionRate / 100)).toFixed(2)}
                  </strong>
                </p>
                <p className="text-sm text-gray-600 mt-1">
                  Recharge Commission: <strong className="text-blue-600">
                    ${(editedPricing.basePriceUSD * (editedPricing.commissionRate / 100)).toFixed(2)}
                  </strong>
                </p>
              </div>
            </div>
            <div className="flex gap-3 justify-end mt-6">
              <Button variant="outline" onClick={() => setShowPricingModal(false)}>
                Cancel
              </Button>
              <Button onClick={() => handleUpdatePricing(selectedBooking.id)}>
                Update Pricing
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default DriverAdmin;
