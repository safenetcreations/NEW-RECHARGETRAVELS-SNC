import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Plane, Users, Mail, Phone, Search, Filter, RefreshCw, Trash2, MapPin, Calendar, CheckCircle, XCircle, Clock } from 'lucide-react';
import { toast } from 'sonner';
import { db } from '@/lib/firebase'; // Admin firebase instance
import { collection, query, orderBy, getDocs, doc, updateDoc, deleteDoc, where } from 'firebase/firestore';

// Define the interface locally or import it if shared types available
interface AirportTransferBooking {
    id: string;
    bookingReference: string;
    transferType: 'arrival' | 'departure' | 'round-trip';
    pickupAirport?: {
        code: string;
        name: string;
    };
    dropoffLocation?: {
        name: string;
        area: string;
    };
    flightNumber?: string;
    pickupDate: string;
    pickupTime: string;
    adults: number;
    children: number;
    vehicleType: string;
    customerInfo: {
        firstName: string;
        lastName: string;
        email: string;
        phone: string;
        country: string;
    };
    pricing: {
        totalPrice: number;
        currency: string;
    };
    status: 'pending' | 'confirmed' | 'assigned' | 'in-progress' | 'completed' | 'cancelled';
    createdAt?: any;
}

const AirportTransferBookingManager: React.FC = () => {
    const [bookings, setBookings] = useState<AirportTransferBooking[]>([]);
    const [loading, setLoading] = useState(false);
    const [statusFilter, setStatusFilter] = useState<string>('all');
    const [searchTerm, setSearchTerm] = useState('');

    const loadBookings = async () => {
        setLoading(true);
        try {
            // Use the collection name from the frontend service
            const bookingsRef = collection(db, 'airportTransferBookings');
            const q = query(bookingsRef, orderBy('createdAt', 'desc'));
            const snapshot = await getDocs(q);

            const loadedBookings = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            })) as AirportTransferBooking[];

            setBookings(loadedBookings);
        } catch (error) {
            console.error('Error loading airport transfer bookings:', error);
            toast.error('Failed to load bookings');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadBookings();
    }, []);

    const handleStatusChange = async (id: string, status: AirportTransferBooking['status']) => {
        try {
            const bookingRef = doc(db, 'airportTransferBookings', id);
            await updateDoc(bookingRef, {
                status,
                updatedAt: new Date() // Use client date or serverTimestamp
            });
            toast.success(`Booking status updated to ${status}`);

            // Update local state to reflect change immediately
            setBookings(prev => prev.map(b => b.id === id ? { ...b, status } : b));
        } catch (error) {
            console.error('Error updating booking status:', error);
            toast.error('Failed to update status');
        }
    };

    const handleDelete = async (id: string) => {
        if (!window.confirm('Are you sure you want to delete this booking? This action cannot be undone.')) {
            return;
        }
        try {
            await deleteDoc(doc(db, 'airportTransferBookings', id));
            toast.success('Booking deleted successfully');
            setBookings(prev => prev.filter(b => b.id !== id));
        } catch (error) {
            console.error('Error deleting booking:', error);
            toast.error('Failed to delete booking');
        }
    };

    const filteredBookings = bookings.filter((booking) => {
        if (statusFilter !== 'all' && booking.status !== statusFilter) {
            return false;
        }
        if (!searchTerm) {
            return true;
        }
        const term = searchTerm.toLowerCase();
        return (
            (booking.bookingReference || '').toLowerCase().includes(term) ||
            (booking.customerInfo?.firstName || '').toLowerCase().includes(term) ||
            (booking.customerInfo?.lastName || '').toLowerCase().includes(term) ||
            (booking.customerInfo?.email || '').toLowerCase().includes(term) ||
            (booking.pickupAirport?.name || '').toLowerCase().includes(term) ||
            (booking.dropoffLocation?.name || '').toLowerCase().includes(term)
        );
    });

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'confirmed': return 'bg-green-100 text-green-800 border-green-200';
            case 'completed': return 'bg-blue-100 text-blue-800 border-blue-200';
            case 'cancelled': return 'bg-red-100 text-red-800 border-red-200';
            case 'assigned': return 'bg-purple-100 text-purple-800 border-purple-200';
            case 'in-progress': return 'bg-indigo-100 text-indigo-800 border-indigo-200';
            default: return 'bg-yellow-100 text-yellow-800 border-yellow-200';
        }
    };

    return (
        <div className="space-y-6 p-6">
            <Card className="border-0 shadow-xl bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50">
                <CardHeader className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div>
                        <CardTitle className="flex items-center gap-3 text-3xl font-bold text-emerald-900">
                            <Plane className="w-8 h-8 text-emerald-600" />
                            Airport Transfer Bookings
                        </CardTitle>
                        <p className="text-emerald-700 mt-2 text-lg">
                            Manage airport pickup and drop-off reservations
                        </p>
                    </div>
                    <div className="flex gap-3">
                        <Button
                            variant="outline"
                            size="lg" // Larger button
                            onClick={loadBookings}
                            disabled={loading}
                            className="bg-white/80 hover:bg-white border-emerald-200 text-emerald-700"
                        >
                            <RefreshCw className={`w-5 h-5 mr-2 ${loading ? 'animate-spin' : ''}`} />
                            Refresh Data
                        </Button>
                    </div>
                </CardHeader>
            </Card>

            {/* Filters and Search */}
            <Card className="shadow-md border-slate-100">
                <CardContent className="pt-6">
                    <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
                        <div className="relative w-full md:w-96">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                            <Input
                                placeholder="Search reference, name, email..."
                                className="pl-10"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>

                        <div className="flex items-center gap-3 w-full md:w-auto">
                            <Filter className="w-4 h-4 text-gray-500" />
                            <select
                                value={statusFilter}
                                onChange={(e) => setStatusFilter(e.target.value)}
                                className="border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 min-w-[150px]"
                            >
                                <option value="all">All Statuses</option>
                                <option value="pending">Pending</option>
                                <option value="confirmed">Confirmed</option>
                                <option value="assigned">Assigned</option>
                                <option value="completed">Completed</option>
                                <option value="cancelled">Cancelled</option>
                            </select>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Bookings List */}
            {loading && filteredBookings.length === 0 ? (
                <div className="flex justify-center py-20">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600" />
                </div>
            ) : filteredBookings.length === 0 ? (
                <Card className="py-16 text-center shadow-sm">
                    <div className="flex flex-col items-center">
                        <div className="bg-gray-100 p-4 rounded-full mb-4">
                            <Search className="w-8 h-8 text-gray-400" />
                        </div>
                        <h3 className="text-xl font-semibold text-gray-900 mb-2">No Bookings Found</h3>
                        <p className="text-gray-500 max-w-sm">
                            {searchTerm || statusFilter !== 'all'
                                ? "No bookings match your current filters. Try resetting the filters."
                                : "There are presently no airport transfer bookings."}
                        </p>
                    </div>
                </Card>
            ) : (
                <div className="grid grid-cols-1 xl:grid-cols-2 2xl:grid-cols-3 gap-6">
                    {filteredBookings.map((booking) => (
                        <Card
                            key={booking.id}
                            className="overflow-hidden border border-slate-200 shadow-lg hover:shadow-2xl transition-all duration-300 group"
                        >
                            <div className={`h-2 w-full ${booking.status === 'confirmed' ? 'bg-green-500' : booking.status === 'cancelled' ? 'bg-red-500' : 'bg-yellow-500'}`} />

                            <CardHeader className="pb-3 bg-slate-50 border-b border-slate-100">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <div className="flex items-center gap-2">
                                            <span className="font-mono font-bold text-lg text-slate-800">
                                                {booking.bookingReference}
                                            </span>
                                            {booking.transferType && (
                                                <Badge variant="outline" className="text-xs uppercase bg-white">
                                                    {booking.transferType}
                                                </Badge>
                                            )}
                                        </div>
                                        <div className="text-xs text-slate-500 mt-1 flex items-center gap-1">
                                            <Clock className="w-3 h-3" />
                                            Created: {booking.createdAt?.toDate ? booking.createdAt.toDate().toLocaleString() : 'Recently'}
                                        </div>
                                    </div>
                                    <select
                                        value={booking.status}
                                        onChange={(e) => handleStatusChange(booking.id, e.target.value as AirportTransferBooking['status'])}
                                        className={`px-2 py-1 rounded-full text-xs font-semibold focus:outline-none border-0 ring-1 ring-inset ${getStatusColor(booking.status)}`}
                                    >
                                        <option value="pending">Pending</option>
                                        <option value="confirmed">Confirmed</option>
                                        <option value="assigned">Assigned</option>
                                        <option value="in-progress">In Progress</option>
                                        <option value="completed">Completed</option>
                                        <option value="cancelled">Cancelled</option>
                                    </select>
                                </div>
                            </CardHeader>

                            <CardContent className="pt-4 space-y-4">
                                {/* Route Info */}
                                <div className="flex items-start gap-3 bg-slate-50 p-3 rounded-lg border border-slate-100">
                                    <MapPin className="w-5 h-5 text-emerald-600 mt-0.5" />
                                    <div className="flex-1 space-y-2">
                                        <div>
                                            <span className="text-xs text-slate-500 uppercase tracking-wider font-semibold">Pickup</span>
                                            <p className="text-sm font-medium text-slate-900">
                                                {booking.pickupAirport ? `${booking.pickupAirport.code} - ${booking.pickupAirport.name}` : booking.transferType === 'departure' ? booking.dropoffLocation?.name : 'Unknown Airport'}
                                            </p>
                                            <div className="flex items-center gap-2 text-xs text-emerald-700 mt-0.5">
                                                <Calendar className="w-3 h-3" />
                                                {booking.pickupDate} at {booking.pickupTime}
                                            </div>
                                        </div>

                                        <div className="border-l-2 border-slate-300 pl-3 py-1 ml-1" />

                                        <div>
                                            <span className="text-xs text-slate-500 uppercase tracking-wider font-semibold">Dropoff</span>
                                            <p className="text-sm font-medium text-slate-900">
                                                {booking.dropoffLocation ? booking.dropoffLocation.name : booking.transferType === 'departure' ? booking.pickupAirport?.name : 'Unknown Destination'}
                                            </p>
                                            {booking.dropoffLocation?.area && (
                                                <span className="text-xs text-slate-500">{booking.dropoffLocation.area}</span>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                {/* Customer & Vehicle Info */}
                                <div className="grid grid-cols-2 gap-4 text-sm">
                                    <div className="space-y-2">
                                        <div className="flex items-center gap-2 text-slate-700">
                                            <Users className="w-4 h-4 text-slate-400" />
                                            <span className="font-medium truncate" title={`${booking.customerInfo?.firstName} ${booking.customerInfo?.lastName}`}>
                                                {booking.customerInfo?.firstName} {booking.customerInfo?.lastName}
                                            </span>
                                        </div>
                                        <div className="flex items-center gap-2 text-slate-600">
                                            <Mail className="w-4 h-4 text-slate-400" />
                                            <span className="truncate block max-w-[140px]" title={booking.customerInfo?.email}>{booking.customerInfo?.email}</span>
                                        </div>
                                        <div className="flex items-center gap-2 text-slate-600">
                                            <Phone className="w-4 h-4 text-slate-400" />
                                            <span className="truncate">{booking.customerInfo?.phone}</span>
                                        </div>
                                    </div>

                                    <div className="space-y-2 pl-4 border-l">
                                        <div className="flex items-center gap-2">
                                            <span className="text-slate-500">Vehicle:</span>
                                            <span className="font-medium text-emerald-700">{booking.vehicleType ? booking.vehicleType.toUpperCase() : 'Standard'}</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <span className="text-slate-500">Pax:</span>
                                            <span>{booking.adults} Ad, {booking.children} Ch</span>
                                        </div>
                                        {booking.flightNumber && (
                                            <div className="flex items-center gap-2" title="Flight Number">
                                                <Plane className="w-3 h-3 text-slate-400" />
                                                <span className="font-mono text-xs bg-slate-100 px-1 rounded">{booking.flightNumber}</span>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Pricing & Footer */}
                                <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                                    <div className="text-lg font-bold text-slate-800">
                                        {booking.pricing?.currency || 'USD'} {booking.pricing?.totalPrice?.toLocaleString()}
                                    </div>

                                    <div className="flex gap-2">
                                        {/* Action buttons could go here (View Details, Assign Driver, etc.) */}
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={() => handleDelete(booking.id)}
                                            className="text-red-500 hover:text-red-700 hover:bg-red-50 p-2 h-auto"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </Button>
                                    </div>
                                </div>

                            </CardContent>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    );
};

export default AirportTransferBookingManager;
