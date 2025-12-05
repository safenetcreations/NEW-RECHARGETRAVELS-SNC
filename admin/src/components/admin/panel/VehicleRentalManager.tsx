import React, { useState, useEffect } from 'react';
import {
    collection,
    getDocs,
    addDoc,
    updateDoc,
    deleteDoc,
    doc,
    query,
    orderBy,
    where,
    serverTimestamp,
    Timestamp
} from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/hooks/use-toast';
import {
    Car,
    Plus,
    Pencil,
    Trash2,
    Save,
    X,
    ChevronDown,
    ChevronUp,
    Image as ImageIcon,
    Users,
    Briefcase,
    DollarSign,
    CheckCircle,
    XCircle,
    Clock,
    Mail,
    MessageCircle,
    RefreshCw,
    Eye,
    AlertCircle,
    Calendar,
    MapPin,
    Send,
    FileText,
    Settings,
    BarChart3,
    TrendingUp,
    Package,
} from 'lucide-react';

// Types
interface VehicleVariant {
    id?: string;
    name: string;
    seats: number;
    bagsWithPassengers: number;
    maxPassengers: number;
    largeBags: number;
    smallBags: number;
    pricePerDay: number;
    image: string;
}

interface VehicleCategory {
    id?: string;
    name: string;
    slug: string;
    tagline: string;
    description: string;
    heroImages: string[];
    variants: VehicleVariant[];
    features: string[];
    idealFor: string[];
    isActive: boolean;
    displayOrder: number;
    createdAt?: Timestamp;
    updatedAt?: Timestamp;
}

interface AddOn {
    id?: string;
    name: string;
    price: number;
    description: string;
    perDay: boolean;
    isActive: boolean;
    applicableCategories: string[];
}

interface BookingRequest {
    id?: string;
    customerName: string;
    customerEmail: string;
    customerPhone: string;
    passportNumber: string;
    categorySlug: string;
    categoryName: string;
    variantName: string;
    pickupLocation: string;
    pickupDate: string;
    returnDate: string;
    withDriver: boolean;
    selectedAddOns: string[];
    totalDays: number;
    estimatedPrice: number;
    status: 'pending' | 'confirmed' | 'alternative_offered' | 'customer_modified' | 'paid' | 'completed' | 'cancelled';
    adminNotes: string;
    alternativeOffer?: string;
    createdAt?: Timestamp;
    updatedAt?: Timestamp;
    confirmedAt?: Timestamp;
    paidAt?: Timestamp;
}

type TabType = 'dashboard' | 'categories' | 'bookings' | 'addons' | 'settings';

const VehicleRentalManager: React.FC = () => {
    const { toast } = useToast();
    const [activeTab, setActiveTab] = useState<TabType>('dashboard');
    const [loading, setLoading] = useState(true);

    // Data states
    const [categories, setCategories] = useState<VehicleCategory[]>([]);
    const [bookings, setBookings] = useState<BookingRequest[]>([]);
    const [addOns, setAddOns] = useState<AddOn[]>([]);

    // Edit states
    const [editingCategory, setEditingCategory] = useState<VehicleCategory | null>(null);
    const [editingAddOn, setEditingAddOn] = useState<AddOn | null>(null);
    const [selectedBooking, setSelectedBooking] = useState<BookingRequest | null>(null);

    // Form states
    const [showCategoryForm, setShowCategoryForm] = useState(false);
    const [showAddOnForm, setShowAddOnForm] = useState(false);
    const [expandedCategory, setExpandedCategory] = useState<string | null>(null);

    // Filter states
    const [bookingFilter, setBookingFilter] = useState<string>('all');

    // Load data
    useEffect(() => {
        loadAllData();
    }, []);

    const loadAllData = async () => {
        setLoading(true);
        try {
            await Promise.all([loadCategories(), loadBookings(), loadAddOns()]);
        } catch (error) {
            console.error('Error loading data:', error);
            toast({ title: 'Error', description: 'Failed to load data', variant: 'destructive' });
        }
        setLoading(false);
    };

    const loadCategories = async () => {
        const q = query(collection(db, 'vehicleCategories'), orderBy('displayOrder'));
        const snapshot = await getDocs(q);
        const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as VehicleCategory[];
        setCategories(data);
    };

    const loadBookings = async () => {
        const q = query(collection(db, 'vehicleBookingRequests'), orderBy('createdAt', 'desc'));
        const snapshot = await getDocs(q);
        const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as BookingRequest[];
        setBookings(data);
    };

    const loadAddOns = async () => {
        const snapshot = await getDocs(collection(db, 'vehicleAddOns'));
        const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as AddOn[];
        setAddOns(data);
    };

    // Category CRUD
    const saveCategory = async (category: VehicleCategory) => {
        try {
            const { id, createdAt, updatedAt, ...categoryData } = category;
            const data = {
                ...categoryData,
                updatedAt: serverTimestamp(),
            };

            if (id) {
                await updateDoc(doc(db, 'vehicleCategories', id), data);
                toast({ title: 'Success', description: 'Category updated successfully' });
            } else {
                await addDoc(collection(db, 'vehicleCategories'), {
                    ...data,
                    createdAt: serverTimestamp(),
                });
                toast({ title: 'Success', description: 'Category created successfully' });
            }

            await loadCategories();
            setEditingCategory(null);
            setShowCategoryForm(false);
        } catch (error) {
            console.error('Error saving category:', error);
            toast({ title: 'Error', description: 'Failed to save category', variant: 'destructive' });
        }
    };

    const deleteCategory = async (id: string) => {
        if (!confirm('Are you sure you want to delete this category?')) return;
        try {
            await deleteDoc(doc(db, 'vehicleCategories', id));
            toast({ title: 'Success', description: 'Category deleted' });
            await loadCategories();
        } catch (error) {
            toast({ title: 'Error', description: 'Failed to delete category', variant: 'destructive' });
        }
    };

    // Add-On CRUD
    const saveAddOn = async (addOn: AddOn) => {
        try {
            const { id, ...addOnData } = addOn;
            if (id) {
                await updateDoc(doc(db, 'vehicleAddOns', id), addOnData);
                toast({ title: 'Success', description: 'Add-on updated' });
            } else {
                await addDoc(collection(db, 'vehicleAddOns'), addOnData);
                toast({ title: 'Success', description: 'Add-on created' });
            }
            await loadAddOns();
            setEditingAddOn(null);
            setShowAddOnForm(false);
        } catch (error) {
            toast({ title: 'Error', description: 'Failed to save add-on', variant: 'destructive' });
        }
    };

    const deleteAddOn = async (id: string) => {
        if (!confirm('Delete this add-on?')) return;
        try {
            await deleteDoc(doc(db, 'vehicleAddOns', id));
            toast({ title: 'Success', description: 'Add-on deleted' });
            await loadAddOns();
        } catch (error) {
            toast({ title: 'Error', description: 'Failed to delete', variant: 'destructive' });
        }
    };

    // Booking Actions
    const confirmBooking = async (booking: BookingRequest) => {
        try {
            await updateDoc(doc(db, 'vehicleBookingRequests', booking.id!), {
                status: 'confirmed',
                confirmedAt: serverTimestamp(),
                updatedAt: serverTimestamp(),
            });

            // TODO: Send email and WhatsApp notification to customer
            toast({ title: 'Booking Confirmed!', description: 'Customer will be notified via email and WhatsApp' });
            await loadBookings();
            setSelectedBooking(null);
        } catch (error) {
            toast({ title: 'Error', description: 'Failed to confirm booking', variant: 'destructive' });
        }
    };

    const offerAlternative = async (booking: BookingRequest, alternativeOffer: string) => {
        try {
            await updateDoc(doc(db, 'vehicleBookingRequests', booking.id!), {
                status: 'alternative_offered',
                alternativeOffer,
                updatedAt: serverTimestamp(),
            });

            toast({ title: 'Alternative Offered', description: 'Customer will receive the alternative options' });
            await loadBookings();
            setSelectedBooking(null);
        } catch (error) {
            toast({ title: 'Error', description: 'Failed to send alternative', variant: 'destructive' });
        }
    };

    const cancelBooking = async (booking: BookingRequest, reason: string) => {
        try {
            await updateDoc(doc(db, 'vehicleBookingRequests', booking.id!), {
                status: 'cancelled',
                adminNotes: reason,
                updatedAt: serverTimestamp(),
            });

            toast({ title: 'Booking Cancelled', description: 'Customer will be notified' });
            await loadBookings();
            setSelectedBooking(null);
        } catch (error) {
            toast({ title: 'Error', description: 'Failed to cancel', variant: 'destructive' });
        }
    };

    // Stats
    const stats = {
        totalCategories: categories.length,
        activeCategories: categories.filter(c => c.isActive).length,
        totalBookings: bookings.length,
        pendingBookings: bookings.filter(b => b.status === 'pending').length,
        confirmedBookings: bookings.filter(b => b.status === 'confirmed').length,
        paidBookings: bookings.filter(b => b.status === 'paid').length,
        totalAddOns: addOns.length,
        activeAddOns: addOns.filter(a => a.isActive).length,
    };

    const filteredBookings = bookingFilter === 'all'
        ? bookings
        : bookings.filter(b => b.status === bookingFilter);

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <RefreshCw className="w-8 h-8 animate-spin text-amber-500" />
            </div>
        );
    }

    return (
        <div className="p-6 max-w-7xl mx-auto">
            {/* Header */}
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
                    <Car className="w-8 h-8 text-amber-500" />
                    Vehicle Rental Management
                </h1>
                <p className="text-gray-500 mt-1">Manage categories, bookings, add-ons, and pricing</p>
            </div>

            {/* Tabs */}
            <div className="flex gap-2 mb-6 border-b border-gray-200 pb-4 overflow-x-auto">
                {[
                    { id: 'dashboard', label: 'Dashboard', icon: BarChart3 },
                    { id: 'bookings', label: 'Booking Requests', icon: Calendar, badge: stats.pendingBookings },
                    { id: 'categories', label: 'Vehicle Categories', icon: Car },
                    { id: 'addons', label: 'Add-Ons', icon: Package },
                    { id: 'settings', label: 'Settings', icon: Settings },
                ].map((tab) => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id as TabType)}
                        className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all whitespace-nowrap ${activeTab === tab.id
                            ? 'bg-amber-500 text-white'
                            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                            }`}
                    >
                        <tab.icon className="w-4 h-4" />
                        {tab.label}
                        {tab.badge ? (
                            <span className="ml-1 px-2 py-0.5 bg-red-500 text-white text-xs rounded-full">
                                {tab.badge}
                            </span>
                        ) : null}
                    </button>
                ))}
            </div>

            {/* Dashboard Tab */}
            {activeTab === 'dashboard' && (
                <div className="space-y-6">
                    {/* Stats Grid */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <StatCard
                            title="Pending Bookings"
                            value={stats.pendingBookings}
                            icon={Clock}
                            color="amber"
                            subtitle="Awaiting confirmation"
                        />
                        <StatCard
                            title="Confirmed"
                            value={stats.confirmedBookings}
                            icon={CheckCircle}
                            color="green"
                            subtitle="Ready for payment"
                        />
                        <StatCard
                            title="Paid & Active"
                            value={stats.paidBookings}
                            icon={DollarSign}
                            color="blue"
                            subtitle="Revenue generated"
                        />
                        <StatCard
                            title="Total Bookings"
                            value={stats.totalBookings}
                            icon={TrendingUp}
                            color="purple"
                            subtitle="All time"
                        />
                    </div>

                    {/* Recent Pending Bookings */}
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-lg font-semibold text-gray-900">Recent Pending Requests</h3>
                            <Button variant="outline" size="sm" onClick={() => setActiveTab('bookings')}>
                                View All
                            </Button>
                        </div>

                        {bookings.filter(b => b.status === 'pending').slice(0, 5).length === 0 ? (
                            <p className="text-gray-500 text-center py-8">No pending booking requests</p>
                        ) : (
                            <div className="space-y-3">
                                {bookings.filter(b => b.status === 'pending').slice(0, 5).map((booking) => (
                                    <div
                                        key={booking.id}
                                        className="flex items-center justify-between p-4 bg-amber-50 rounded-lg border border-amber-200"
                                    >
                                        <div>
                                            <p className="font-medium text-gray-900">{booking.customerName}</p>
                                            <p className="text-sm text-gray-600">
                                                {booking.categoryName} - {booking.variantName}
                                            </p>
                                            <p className="text-xs text-gray-500">
                                                {booking.pickupDate} to {booking.returnDate}
                                            </p>
                                        </div>
                                        <Button
                                            size="sm"
                                            onClick={() => { setSelectedBooking(booking); setActiveTab('bookings'); }}
                                        >
                                            Review
                                        </Button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Quick Stats */}
                    <div className="grid md:grid-cols-2 gap-4">
                        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                            <h3 className="text-lg font-semibold text-gray-900 mb-4">Vehicle Categories</h3>
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-3xl font-bold text-gray-900">{stats.activeCategories}</p>
                                    <p className="text-sm text-gray-500">Active categories</p>
                                </div>
                                <Button variant="outline" onClick={() => setActiveTab('categories')}>
                                    Manage
                                </Button>
                            </div>
                        </div>

                        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                            <h3 className="text-lg font-semibold text-gray-900 mb-4">Add-Ons</h3>
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-3xl font-bold text-gray-900">{stats.activeAddOns}</p>
                                    <p className="text-sm text-gray-500">Active add-ons</p>
                                </div>
                                <Button variant="outline" onClick={() => setActiveTab('addons')}>
                                    Manage
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Bookings Tab */}
            {activeTab === 'bookings' && (
                <BookingsSection
                    bookings={filteredBookings}
                    bookingFilter={bookingFilter}
                    setBookingFilter={setBookingFilter}
                    selectedBooking={selectedBooking}
                    setSelectedBooking={setSelectedBooking}
                    onConfirm={confirmBooking}
                    onOfferAlternative={offerAlternative}
                    onCancel={cancelBooking}
                    onRefresh={loadBookings}
                />
            )}

            {/* Categories Tab */}
            {activeTab === 'categories' && (
                <CategoriesSection
                    categories={categories}
                    expandedCategory={expandedCategory}
                    setExpandedCategory={setExpandedCategory}
                    editingCategory={editingCategory}
                    setEditingCategory={setEditingCategory}
                    showCategoryForm={showCategoryForm}
                    setShowCategoryForm={setShowCategoryForm}
                    onSave={saveCategory}
                    onDelete={deleteCategory}
                />
            )}

            {/* Add-Ons Tab */}
            {activeTab === 'addons' && (
                <AddOnsSection
                    addOns={addOns}
                    categories={categories}
                    editingAddOn={editingAddOn}
                    setEditingAddOn={setEditingAddOn}
                    showAddOnForm={showAddOnForm}
                    setShowAddOnForm={setShowAddOnForm}
                    onSave={saveAddOn}
                    onDelete={deleteAddOn}
                />
            )}

            {/* Settings Tab */}
            {activeTab === 'settings' && (
                <SettingsSection />
            )}
        </div>
    );
};

// Stat Card Component
const StatCard: React.FC<{
    title: string;
    value: number;
    icon: React.ElementType;
    color: 'amber' | 'green' | 'blue' | 'purple';
    subtitle: string;
}> = ({ title, value, icon: Icon, color, subtitle }) => {
    const colors = {
        amber: 'bg-amber-50 text-amber-600 border-amber-200',
        green: 'bg-green-50 text-green-600 border-green-200',
        blue: 'bg-blue-50 text-blue-600 border-blue-200',
        purple: 'bg-purple-50 text-purple-600 border-purple-200',
    };

    return (
        <div className={`rounded-xl p-4 border ${colors[color]}`}>
            <div className="flex items-center gap-3">
                <Icon className="w-8 h-8" />
                <div>
                    <p className="text-2xl font-bold">{value}</p>
                    <p className="text-sm font-medium">{title}</p>
                    <p className="text-xs opacity-70">{subtitle}</p>
                </div>
            </div>
        </div>
    );
};

// Bookings Section Component
const BookingsSection: React.FC<{
    bookings: BookingRequest[];
    bookingFilter: string;
    setBookingFilter: (filter: string) => void;
    selectedBooking: BookingRequest | null;
    setSelectedBooking: (booking: BookingRequest | null) => void;
    onConfirm: (booking: BookingRequest) => void;
    onOfferAlternative: (booking: BookingRequest, offer: string) => void;
    onCancel: (booking: BookingRequest, reason: string) => void;
    onRefresh: () => void;
}> = ({
    bookings,
    bookingFilter,
    setBookingFilter,
    selectedBooking,
    setSelectedBooking,
    onConfirm,
    onOfferAlternative,
    onCancel,
    onRefresh,
}) => {
        const [alternativeText, setAlternativeText] = useState('');
        const [cancelReason, setCancelReason] = useState('');

        const statusColors: Record<string, string> = {
            pending: 'bg-amber-100 text-amber-800',
            confirmed: 'bg-green-100 text-green-800',
            alternative_offered: 'bg-blue-100 text-blue-800',
            customer_modified: 'bg-purple-100 text-purple-800',
            paid: 'bg-emerald-100 text-emerald-800',
            completed: 'bg-gray-100 text-gray-800',
            cancelled: 'bg-red-100 text-red-800',
        };

        return (
            <div className="space-y-6">
                {/* Filters */}
                <div className="flex items-center gap-4 flex-wrap">
                    <div className="flex gap-2">
                        {['all', 'pending', 'confirmed', 'alternative_offered', 'paid', 'cancelled'].map((status) => (
                            <button
                                key={status}
                                onClick={() => setBookingFilter(status)}
                                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${bookingFilter === status
                                    ? 'bg-amber-500 text-white'
                                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                    }`}
                            >
                                {status === 'all' ? 'All' : status.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                            </button>
                        ))}
                    </div>
                    <Button variant="outline" size="sm" onClick={onRefresh}>
                        <RefreshCw className="w-4 h-4 mr-2" />
                        Refresh
                    </Button>
                </div>

                <div className="grid lg:grid-cols-2 gap-6">
                    {/* Bookings List */}
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                        <div className="p-4 border-b border-gray-200">
                            <h3 className="font-semibold text-gray-900">Booking Requests ({bookings.length})</h3>
                        </div>
                        <div className="divide-y divide-gray-100 max-h-[600px] overflow-y-auto">
                            {bookings.length === 0 ? (
                                <p className="p-8 text-center text-gray-500">No bookings found</p>
                            ) : (
                                bookings.map((booking) => (
                                    <div
                                        key={booking.id}
                                        onClick={() => setSelectedBooking(booking)}
                                        className={`p-4 cursor-pointer hover:bg-gray-50 transition-colors ${selectedBooking?.id === booking.id ? 'bg-amber-50 border-l-4 border-amber-500' : ''
                                            }`}
                                    >
                                        <div className="flex items-start justify-between">
                                            <div>
                                                <p className="font-medium text-gray-900">{booking.customerName}</p>
                                                <p className="text-sm text-gray-600">{booking.categoryName} - {booking.variantName}</p>
                                                <p className="text-xs text-gray-500 mt-1">
                                                    <MapPin className="w-3 h-3 inline mr-1" />
                                                    {booking.pickupLocation}
                                                </p>
                                                <p className="text-xs text-gray-500">
                                                    <Calendar className="w-3 h-3 inline mr-1" />
                                                    {booking.pickupDate} → {booking.returnDate}
                                                </p>
                                            </div>
                                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusColors[booking.status]}`}>
                                                {booking.status.replace('_', ' ')}
                                            </span>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>

                    {/* Booking Detail */}
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                        {selectedBooking ? (
                            <div className="p-6">
                                <div className="flex items-center justify-between mb-6">
                                    <h3 className="font-semibold text-gray-900">Booking Details</h3>
                                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${statusColors[selectedBooking.status]}`}>
                                        {selectedBooking.status.replace('_', ' ')}
                                    </span>
                                </div>

                                <div className="space-y-4">
                                    {/* Customer Info */}
                                    <div className="bg-gray-50 rounded-lg p-4">
                                        <h4 className="font-medium text-gray-900 mb-2">Customer Information</h4>
                                        <div className="grid grid-cols-2 gap-2 text-sm">
                                            <p><strong>Name:</strong> {selectedBooking.customerName}</p>
                                            <p><strong>Email:</strong> {selectedBooking.customerEmail}</p>
                                            <p><strong>Phone:</strong> {selectedBooking.customerPhone}</p>
                                            <p><strong>Passport:</strong> {selectedBooking.passportNumber}</p>
                                        </div>
                                    </div>

                                    {/* Vehicle Info */}
                                    <div className="bg-gray-50 rounded-lg p-4">
                                        <h4 className="font-medium text-gray-900 mb-2">Vehicle Request</h4>
                                        <div className="grid grid-cols-2 gap-2 text-sm">
                                            <p><strong>Category:</strong> {selectedBooking.categoryName}</p>
                                            <p><strong>Variant:</strong> {selectedBooking.variantName}</p>
                                            <p><strong>Driver:</strong> {selectedBooking.withDriver ? 'Yes' : 'Self-Drive'}</p>
                                            <p><strong>Days:</strong> {selectedBooking.totalDays}</p>
                                        </div>
                                    </div>

                                    {/* Trip Info */}
                                    <div className="bg-gray-50 rounded-lg p-4">
                                        <h4 className="font-medium text-gray-900 mb-2">Trip Details</h4>
                                        <div className="text-sm space-y-1">
                                            <p><strong>Pickup:</strong> {selectedBooking.pickupLocation}</p>
                                            <p><strong>Dates:</strong> {selectedBooking.pickupDate} to {selectedBooking.returnDate}</p>
                                            {selectedBooking.selectedAddOns?.length > 0 && (
                                                <p><strong>Add-ons:</strong> {selectedBooking.selectedAddOns.join(', ')}</p>
                                            )}
                                            <p className="text-lg font-bold text-amber-600 mt-2">
                                                Estimated: ${selectedBooking.estimatedPrice}
                                            </p>
                                        </div>
                                    </div>

                                    {/* Actions */}
                                    {selectedBooking.status === 'pending' && (
                                        <div className="space-y-4 pt-4 border-t border-gray-200">
                                            <div className="flex gap-2">
                                                <Button
                                                    className="flex-1 bg-green-500 hover:bg-green-600"
                                                    onClick={() => onConfirm(selectedBooking)}
                                                >
                                                    <CheckCircle className="w-4 h-4 mr-2" />
                                                    Confirm Available
                                                </Button>
                                            </div>

                                            <div className="space-y-2">
                                                <Label>Offer Alternative Vehicle/Dates</Label>
                                                <Textarea
                                                    value={alternativeText}
                                                    onChange={(e) => setAlternativeText(e.target.value)}
                                                    placeholder="E.g., 'The requested SUV is not available. We can offer a Toyota Prado instead, or the same vehicle on different dates...'"
                                                    rows={3}
                                                />
                                                <Button
                                                    variant="outline"
                                                    className="w-full"
                                                    onClick={() => {
                                                        if (alternativeText.trim()) {
                                                            onOfferAlternative(selectedBooking, alternativeText);
                                                            setAlternativeText('');
                                                        }
                                                    }}
                                                    disabled={!alternativeText.trim()}
                                                >
                                                    <MessageCircle className="w-4 h-4 mr-2" />
                                                    Send Alternative Offer
                                                </Button>
                                            </div>

                                            <div className="space-y-2">
                                                <Label>Cancel Booking</Label>
                                                <Input
                                                    value={cancelReason}
                                                    onChange={(e) => setCancelReason(e.target.value)}
                                                    placeholder="Reason for cancellation..."
                                                />
                                                <Button
                                                    variant="destructive"
                                                    className="w-full"
                                                    onClick={() => {
                                                        if (cancelReason.trim()) {
                                                            onCancel(selectedBooking, cancelReason);
                                                            setCancelReason('');
                                                        }
                                                    }}
                                                    disabled={!cancelReason.trim()}
                                                >
                                                    <XCircle className="w-4 h-4 mr-2" />
                                                    Cancel Booking
                                                </Button>
                                            </div>
                                        </div>
                                    )}

                                    {selectedBooking.status === 'confirmed' && (
                                        <div className="bg-green-50 rounded-lg p-4 text-center">
                                            <CheckCircle className="w-8 h-8 text-green-500 mx-auto mb-2" />
                                            <p className="font-medium text-green-800">Confirmed - Awaiting Payment</p>
                                            <p className="text-sm text-green-600">Customer has been notified</p>
                                        </div>
                                    )}

                                    {selectedBooking.alternativeOffer && (
                                        <div className="bg-blue-50 rounded-lg p-4">
                                            <h4 className="font-medium text-blue-800 mb-2">Alternative Offered:</h4>
                                            <p className="text-sm text-blue-700">{selectedBooking.alternativeOffer}</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        ) : (
                            <div className="p-8 text-center text-gray-500">
                                <Eye className="w-12 h-12 mx-auto mb-4 opacity-30" />
                                <p>Select a booking to view details</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        );
    };

// Categories Section Component
const CategoriesSection: React.FC<{
    categories: VehicleCategory[];
    expandedCategory: string | null;
    setExpandedCategory: (id: string | null) => void;
    editingCategory: VehicleCategory | null;
    setEditingCategory: (category: VehicleCategory | null) => void;
    showCategoryForm: boolean;
    setShowCategoryForm: (show: boolean) => void;
    onSave: (category: VehicleCategory) => void;
    onDelete: (id: string) => void;
}> = ({
    categories,
    expandedCategory,
    setExpandedCategory,
    editingCategory,
    setEditingCategory,
    showCategoryForm,
    setShowCategoryForm,
    onSave,
    onDelete,
}) => {
        const defaultCategory: VehicleCategory = {
            name: '',
            slug: '',
            tagline: '',
            description: '',
            heroImages: [],
            variants: [],
            features: [],
            idealFor: [],
            isActive: true,
            displayOrder: categories.length + 1,
        };

        return (
            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <h2 className="text-xl font-semibold text-gray-900">Vehicle Categories</h2>
                    <Button onClick={() => { setEditingCategory(defaultCategory); setShowCategoryForm(true); }}>
                        <Plus className="w-4 h-4 mr-2" />
                        Add Category
                    </Button>
                </div>

                {/* Category List */}
                <div className="space-y-4">
                    {categories.map((category) => (
                        <div key={category.id} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                            <div
                                className="flex items-center justify-between p-4 cursor-pointer hover:bg-gray-50"
                                onClick={() => setExpandedCategory(expandedCategory === category.id ? null : category.id!)}
                            >
                                <div className="flex items-center gap-4">
                                    <div className="w-16 h-12 rounded-lg overflow-hidden bg-gray-100">
                                        {category.heroImages?.[0] && (
                                            <img src={category.heroImages[0]} alt={category.name} className="w-full h-full object-cover" />
                                        )}
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-gray-900">{category.name}</h3>
                                        <p className="text-sm text-gray-500">{category.variants?.length || 0} variants • {category.tagline}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2">
                                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${category.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-600'}`}>
                                        {category.isActive ? 'Active' : 'Inactive'}
                                    </span>
                                    {expandedCategory === category.id ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                                </div>
                            </div>

                            {expandedCategory === category.id && (
                                <div className="border-t border-gray-200 p-4 bg-gray-50">
                                    <div className="grid md:grid-cols-2 gap-4 mb-4">
                                        <div>
                                            <h4 className="font-medium text-gray-900 mb-2">Description</h4>
                                            <p className="text-sm text-gray-600">{category.description}</p>
                                        </div>
                                        <div>
                                            <h4 className="font-medium text-gray-900 mb-2">Features</h4>
                                            <div className="flex flex-wrap gap-1">
                                                {category.features?.map((f, i) => (
                                                    <span key={i} className="px-2 py-0.5 bg-white rounded text-xs text-gray-600">{f}</span>
                                                ))}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Variants */}
                                    <div className="mb-4">
                                        <h4 className="font-medium text-gray-900 mb-2">Variants</h4>
                                        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
                                            {category.variants?.map((variant, i) => (
                                                <div key={i} className="bg-white rounded-lg p-3 border border-gray-200">
                                                    <p className="font-medium text-gray-900">{variant.name}</p>
                                                    <div className="flex items-center gap-3 text-xs text-gray-500 mt-1">
                                                        <span><Users className="w-3 h-3 inline" /> {variant.seats} seats</span>
                                                        <span><Briefcase className="w-3 h-3 inline" /> {variant.largeBags} bags</span>
                                                    </div>
                                                    <p className="text-amber-600 font-bold mt-1">${variant.pricePerDay}/day</p>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Hero Images */}
                                    <div className="mb-4">
                                        <h4 className="font-medium text-gray-900 mb-2">Hero Images ({category.heroImages?.length || 0})</h4>
                                        <div className="flex gap-2 overflow-x-auto pb-2">
                                            {category.heroImages?.map((img, i) => (
                                                <img key={i} src={img} alt="" className="w-20 h-14 rounded-lg object-cover flex-shrink-0" />
                                            ))}
                                        </div>
                                    </div>

                                    <div className="flex gap-2">
                                        <Button variant="outline" size="sm" onClick={() => { setEditingCategory(category); setShowCategoryForm(true); }}>
                                            <Pencil className="w-4 h-4 mr-1" />
                                            Edit
                                        </Button>
                                        <Button variant="destructive" size="sm" onClick={() => onDelete(category.id!)}>
                                            <Trash2 className="w-4 h-4 mr-1" />
                                            Delete
                                        </Button>
                                    </div>
                                </div>
                            )}
                        </div>
                    ))}
                </div>

                {/* Category Form Modal */}
                {showCategoryForm && editingCategory && (
                    <CategoryFormModal
                        category={editingCategory}
                        onSave={onSave}
                        onClose={() => { setShowCategoryForm(false); setEditingCategory(null); }}
                    />
                )}
            </div>
        );
    };

// Category Form Modal
const CategoryFormModal: React.FC<{
    category: VehicleCategory;
    onSave: (category: VehicleCategory) => void;
    onClose: () => void;
}> = ({ category, onSave, onClose }) => {
    const [formData, setFormData] = useState<VehicleCategory>(category);
    const [newFeature, setNewFeature] = useState('');
    const [newIdealFor, setNewIdealFor] = useState('');
    const [newImageUrl, setNewImageUrl] = useState('');

    const addVariant = () => {
        setFormData({
            ...formData,
            variants: [
                ...formData.variants,
                {
                    name: '',
                    seats: 5,
                    bagsWithPassengers: 3,
                    maxPassengers: 5,
                    largeBags: 2,
                    smallBags: 2,
                    pricePerDay: 50,
                    image: '',
                },
            ],
        });
    };

    const updateVariant = (index: number, field: keyof VehicleVariant, value: any) => {
        const newVariants = [...formData.variants];
        newVariants[index] = { ...newVariants[index], [field]: value };
        setFormData({ ...formData, variants: newVariants });
    };

    const removeVariant = (index: number) => {
        setFormData({
            ...formData,
            variants: formData.variants.filter((_, i) => i !== index),
        });
    };

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
                <div className="sticky top-0 bg-white border-b border-gray-200 p-4 flex items-center justify-between">
                    <h2 className="text-xl font-semibold">{category.id ? 'Edit Category' : 'New Category'}</h2>
                    <Button variant="ghost" size="sm" onClick={onClose}>
                        <X className="w-5 h-5" />
                    </Button>
                </div>

                <div className="p-6 space-y-6">
                    {/* Basic Info */}
                    <div className="grid md:grid-cols-2 gap-4">
                        <div>
                            <Label>Category Name</Label>
                            <Input
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                placeholder="e.g., Economy"
                            />
                        </div>
                        <div>
                            <Label>Slug (URL)</Label>
                            <Input
                                value={formData.slug}
                                onChange={(e) => setFormData({ ...formData, slug: e.target.value.toLowerCase().replace(/\s+/g, '-') })}
                                placeholder="e.g., economy"
                            />
                        </div>
                        <div>
                            <Label>Tagline</Label>
                            <Input
                                value={formData.tagline}
                                onChange={(e) => setFormData({ ...formData, tagline: e.target.value })}
                                placeholder="e.g., Budget-Friendly Travel"
                            />
                        </div>
                        <div>
                            <Label>Display Order</Label>
                            <Input
                                type="number"
                                value={formData.displayOrder}
                                onChange={(e) => setFormData({ ...formData, displayOrder: parseInt(e.target.value) })}
                            />
                        </div>
                    </div>

                    <div>
                        <Label>Description</Label>
                        <Textarea
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            rows={3}
                            placeholder="Detailed description of this category..."
                        />
                    </div>

                    {/* Active Toggle */}
                    <div className="flex items-center gap-3">
                        <Switch
                            checked={formData.isActive}
                            onCheckedChange={(checked) => setFormData({ ...formData, isActive: checked })}
                        />
                        <Label>Category is Active</Label>
                    </div>

                    {/* Hero Images */}
                    <div>
                        <Label>Hero Images (10 recommended)</Label>
                        <div className="flex gap-2 mb-2">
                            <Input
                                value={newImageUrl}
                                onChange={(e) => setNewImageUrl(e.target.value)}
                                placeholder="Image URL"
                            />
                            <Button
                                type="button"
                                onClick={() => {
                                    if (newImageUrl.trim()) {
                                        setFormData({ ...formData, heroImages: [...formData.heroImages, newImageUrl.trim()] });
                                        setNewImageUrl('');
                                    }
                                }}
                            >
                                Add
                            </Button>
                        </div>
                        <div className="flex flex-wrap gap-2">
                            {formData.heroImages.map((img, i) => (
                                <div key={i} className="relative group">
                                    <img src={img} alt="" className="w-20 h-14 rounded-lg object-cover" />
                                    <button
                                        onClick={() => setFormData({ ...formData, heroImages: formData.heroImages.filter((_, idx) => idx !== i) })}
                                        className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white rounded-full text-xs opacity-0 group-hover:opacity-100"
                                    >
                                        ×
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Features */}
                    <div>
                        <Label>Features</Label>
                        <div className="flex gap-2 mb-2">
                            <Input
                                value={newFeature}
                                onChange={(e) => setNewFeature(e.target.value)}
                                placeholder="e.g., Air Conditioning"
                            />
                            <Button
                                type="button"
                                onClick={() => {
                                    if (newFeature.trim()) {
                                        setFormData({ ...formData, features: [...formData.features, newFeature.trim()] });
                                        setNewFeature('');
                                    }
                                }}
                            >
                                Add
                            </Button>
                        </div>
                        <div className="flex flex-wrap gap-2">
                            {formData.features.map((f, i) => (
                                <span key={i} className="px-2 py-1 bg-gray-100 rounded-lg text-sm flex items-center gap-1">
                                    {f}
                                    <button onClick={() => setFormData({ ...formData, features: formData.features.filter((_, idx) => idx !== i) })} className="text-red-500">×</button>
                                </span>
                            ))}
                        </div>
                    </div>

                    {/* Ideal For */}
                    <div>
                        <Label>Ideal For</Label>
                        <div className="flex gap-2 mb-2">
                            <Input
                                value={newIdealFor}
                                onChange={(e) => setNewIdealFor(e.target.value)}
                                placeholder="e.g., Solo Travelers"
                            />
                            <Button
                                type="button"
                                onClick={() => {
                                    if (newIdealFor.trim()) {
                                        setFormData({ ...formData, idealFor: [...formData.idealFor, newIdealFor.trim()] });
                                        setNewIdealFor('');
                                    }
                                }}
                            >
                                Add
                            </Button>
                        </div>
                        <div className="flex flex-wrap gap-2">
                            {formData.idealFor.map((item, i) => (
                                <span key={i} className="px-2 py-1 bg-amber-100 rounded-lg text-sm flex items-center gap-1">
                                    {item}
                                    <button onClick={() => setFormData({ ...formData, idealFor: formData.idealFor.filter((_, idx) => idx !== i) })} className="text-red-500">×</button>
                                </span>
                            ))}
                        </div>
                    </div>

                    {/* Variants */}
                    <div>
                        <div className="flex items-center justify-between mb-3">
                            <Label>Vehicle Variants</Label>
                            <Button type="button" variant="outline" size="sm" onClick={addVariant}>
                                <Plus className="w-4 h-4 mr-1" />
                                Add Variant
                            </Button>
                        </div>
                        <div className="space-y-4">
                            {formData.variants.map((variant, idx) => (
                                <div key={idx} className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                                    <div className="flex items-center justify-between mb-3">
                                        <h4 className="font-medium">Variant {idx + 1}</h4>
                                        <Button variant="ghost" size="sm" onClick={() => removeVariant(idx)}>
                                            <Trash2 className="w-4 h-4 text-red-500" />
                                        </Button>
                                    </div>
                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                                        <div className="col-span-2">
                                            <Label className="text-xs">Name</Label>
                                            <Input
                                                value={variant.name}
                                                onChange={(e) => updateVariant(idx, 'name', e.target.value)}
                                                placeholder="e.g., 9-Seater Van"
                                            />
                                        </div>
                                        <div>
                                            <Label className="text-xs">Seats</Label>
                                            <Input
                                                type="number"
                                                value={variant.seats}
                                                onChange={(e) => updateVariant(idx, 'seats', parseInt(e.target.value))}
                                            />
                                        </div>
                                        <div>
                                            <Label className="text-xs">Price/Day ($)</Label>
                                            <Input
                                                type="number"
                                                value={variant.pricePerDay}
                                                onChange={(e) => updateVariant(idx, 'pricePerDay', parseInt(e.target.value))}
                                            />
                                        </div>
                                        <div>
                                            <Label className="text-xs">With Bags</Label>
                                            <Input
                                                type="number"
                                                value={variant.bagsWithPassengers}
                                                onChange={(e) => updateVariant(idx, 'bagsWithPassengers', parseInt(e.target.value))}
                                            />
                                        </div>
                                        <div>
                                            <Label className="text-xs">Max Passengers</Label>
                                            <Input
                                                type="number"
                                                value={variant.maxPassengers}
                                                onChange={(e) => updateVariant(idx, 'maxPassengers', parseInt(e.target.value))}
                                            />
                                        </div>
                                        <div>
                                            <Label className="text-xs">Large Bags</Label>
                                            <Input
                                                type="number"
                                                value={variant.largeBags}
                                                onChange={(e) => updateVariant(idx, 'largeBags', parseInt(e.target.value))}
                                            />
                                        </div>
                                        <div>
                                            <Label className="text-xs">Small Bags</Label>
                                            <Input
                                                type="number"
                                                value={variant.smallBags}
                                                onChange={(e) => updateVariant(idx, 'smallBags', parseInt(e.target.value))}
                                            />
                                        </div>
                                        <div className="col-span-2 md:col-span-4">
                                            <Label className="text-xs">Image URL</Label>
                                            <Input
                                                value={variant.image}
                                                onChange={(e) => updateVariant(idx, 'image', e.target.value)}
                                                placeholder="Variant image URL"
                                            />
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="sticky bottom-0 bg-white border-t border-gray-200 p-4 flex justify-end gap-2">
                    <Button variant="outline" onClick={onClose}>Cancel</Button>
                    <Button onClick={() => onSave(formData)}>
                        <Save className="w-4 h-4 mr-2" />
                        Save Category
                    </Button>
                </div>
            </div>
        </div>
    );
};

// Add-Ons Section
const AddOnsSection: React.FC<{
    addOns: AddOn[];
    categories: VehicleCategory[];
    editingAddOn: AddOn | null;
    setEditingAddOn: (addOn: AddOn | null) => void;
    showAddOnForm: boolean;
    setShowAddOnForm: (show: boolean) => void;
    onSave: (addOn: AddOn) => void;
    onDelete: (id: string) => void;
}> = ({ addOns, categories, editingAddOn, setEditingAddOn, showAddOnForm, setShowAddOnForm, onSave, onDelete }) => {
    const [formData, setFormData] = useState<AddOn>({
        name: '',
        price: 0,
        description: '',
        perDay: true,
        isActive: true,
        applicableCategories: [],
    });

    useEffect(() => {
        if (editingAddOn) {
            setFormData(editingAddOn);
        }
    }, [editingAddOn]);

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold text-gray-900">Add-Ons</h2>
                <Button onClick={() => { setEditingAddOn(null); setShowAddOnForm(true); setFormData({ name: '', price: 0, description: '', perDay: true, isActive: true, applicableCategories: [] }); }}>
                    <Plus className="w-4 h-4 mr-2" />
                    Add New
                </Button>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {addOns.map((addOn) => (
                    <div key={addOn.id} className="bg-white rounded-xl p-4 border border-gray-200 shadow-sm">
                        <div className="flex items-start justify-between mb-2">
                            <h3 className="font-semibold text-gray-900">{addOn.name}</h3>
                            <span className={`px-2 py-0.5 rounded-full text-xs ${addOn.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-600'}`}>
                                {addOn.isActive ? 'Active' : 'Inactive'}
                            </span>
                        </div>
                        <p className="text-sm text-gray-600 mb-2">{addOn.description}</p>
                        <p className="text-lg font-bold text-amber-600">
                            ${addOn.price} <span className="text-sm font-normal text-gray-500">{addOn.perDay ? '/day' : '/rental'}</span>
                        </p>
                        <div className="flex gap-2 mt-3">
                            <Button variant="outline" size="sm" onClick={() => { setEditingAddOn(addOn); setShowAddOnForm(true); }}>
                                Edit
                            </Button>
                            <Button variant="destructive" size="sm" onClick={() => onDelete(addOn.id!)}>
                                Delete
                            </Button>
                        </div>
                    </div>
                ))}
            </div>

            {/* Add-On Form Modal */}
            {showAddOnForm && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-2xl max-w-md w-full p-6">
                        <h2 className="text-xl font-semibold mb-4">{editingAddOn ? 'Edit Add-On' : 'New Add-On'}</h2>
                        <div className="space-y-4">
                            <div>
                                <Label>Name</Label>
                                <Input value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} />
                            </div>
                            <div>
                                <Label>Description</Label>
                                <Input value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <Label>Price ($)</Label>
                                    <Input type="number" value={formData.price} onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) })} />
                                </div>
                                <div className="flex items-center gap-2 pt-6">
                                    <Switch checked={formData.perDay} onCheckedChange={(checked) => setFormData({ ...formData, perDay: checked })} />
                                    <Label>{formData.perDay ? 'Per Day' : 'Per Rental'}</Label>
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
                                <Switch checked={formData.isActive} onCheckedChange={(checked) => setFormData({ ...formData, isActive: checked })} />
                                <Label>Active</Label>
                            </div>
                        </div>
                        <div className="flex justify-end gap-2 mt-6">
                            <Button variant="outline" onClick={() => { setShowAddOnForm(false); setEditingAddOn(null); }}>Cancel</Button>
                            <Button onClick={() => { onSave(formData); setShowAddOnForm(false); }}>Save</Button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

// Settings Section
const SettingsSection: React.FC = () => {
    return (
        <div className="space-y-6">
            <h2 className="text-xl font-semibold text-gray-900">Settings</h2>

            <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
                <h3 className="font-semibold text-gray-900 mb-4">Notification Settings</h3>
                <div className="space-y-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="font-medium">Email Notifications</p>
                            <p className="text-sm text-gray-500">Receive email when new booking request arrives</p>
                        </div>
                        <Switch defaultChecked />
                    </div>
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="font-medium">WhatsApp Notifications</p>
                            <p className="text-sm text-gray-500">Receive WhatsApp alerts for urgent bookings</p>
                        </div>
                        <Switch defaultChecked />
                    </div>
                </div>
            </div>

            <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
                <h3 className="font-semibold text-gray-900 mb-4">Pricing Settings</h3>
                <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <Label>Driver Fee (per day)</Label>
                            <Input type="number" defaultValue={30} />
                        </div>
                        <div>
                            <Label>Airport Pickup Fee</Label>
                            <Input type="number" defaultValue={15} />
                        </div>
                    </div>
                </div>
            </div>

            <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
                <h3 className="font-semibold text-gray-900 mb-4">Tourist Requirements</h3>
                <div className="space-y-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="font-medium">Require Passport Number</p>
                            <p className="text-sm text-gray-500">Mandatory for all bookings</p>
                        </div>
                        <Switch defaultChecked />
                    </div>
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="font-medium">Show Temporary Licence Notice</p>
                            <p className="text-sm text-gray-500">Display self-drive licence requirements</p>
                        </div>
                        <Switch defaultChecked />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default VehicleRentalManager;
