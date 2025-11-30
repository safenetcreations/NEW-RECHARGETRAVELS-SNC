import React, { useState, useEffect } from 'react';
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc, Timestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import {
    Map,
    MapPin,
    Plus,
    Edit2,
    Trash2,
    Save,
    X,
    RefreshCw,
    Search,
    Eye,
    EyeOff,
    RotateCcw
} from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import ImageUpload from '@/components/ui/image-upload';

// Initial data for seeding (same as in InteractiveTripBuilder)
const INITIAL_DESTINATIONS = [
    {
        id: 'mirissa',
        name: 'Mirissa',
        lat: 5.9483,
        lng: 80.4716,
        description: 'Whale Watching Paradise',
        image: 'https://images.unsplash.com/photo-1552465011-b4e21bf6e79a?w=400&h=300&fit=crop',
        category: 'beach',
        icon: '🏖️',
        attractions: [
            { id: 'whale-watching', name: 'Whale Watching Tour', price: 45, duration: 240, description: 'See majestic blue whales and dolphins', category: 'Wildlife' },
            { id: 'mirissa-beach', name: 'Mirissa Beach Relaxation', price: 0, duration: 180, description: 'Enjoy golden sands and sunsets', category: 'Relaxation' },
            { id: 'coconut-tree-hill', name: 'Coconut Tree Hill', price: 0, duration: 45, description: 'Iconic photo spot with palm trees', category: 'Nature' },
            { id: 'secret-beach', name: 'Secret Beach', price: 0, duration: 120, description: 'Hidden gem with calm waters', category: 'Nature' },
        ]
    },
    {
        id: 'unawatuna',
        name: 'Unawatuna',
        lat: 6.0174,
        lng: 80.2497,
        description: 'Best Beach in Sri Lanka',
        image: 'https://images.unsplash.com/photo-1586375300773-8384e3e4916f?w=400&h=300&fit=crop',
        category: 'beach',
        icon: '🌴',
        attractions: [
            { id: 'unawatuna-beach', name: 'Unawatuna Beach', price: 0, duration: 180, description: 'Crystal clear waters and coral reefs', category: 'Relaxation' },
            { id: 'japanese-peace-pagoda', name: 'Japanese Peace Pagoda', price: 0, duration: 60, description: 'Beautiful white temple with ocean views', category: 'Culture' },
            { id: 'jungle-beach', name: 'Jungle Beach', price: 0, duration: 120, description: 'Secluded beach surrounded by jungle', category: 'Nature' },
        ]
    },
    {
        id: 'sigiriya',
        name: 'Sigiriya',
        lat: 7.9570,
        lng: 80.7603,
        description: 'Ancient Lion Rock Fortress',
        image: 'https://images.unsplash.com/photo-1586613835341-99f93b93809c?w=400&h=300&fit=crop',
        category: 'culture',
        icon: '🦁',
        attractions: [
            { id: 'lion-rock', name: 'Sigiriya Lion Rock', price: 30, duration: 180, description: 'UNESCO World Heritage ancient fortress', category: 'Culture' },
            { id: 'pidurangala', name: 'Pidurangala Rock', price: 5, duration: 120, description: 'Best sunrise view of Sigiriya', category: 'Adventure' },
            { id: 'sigiriya-museum', name: 'Sigiriya Museum', price: 5, duration: 45, description: 'Learn about ancient history', category: 'Culture' },
        ]
    },
    {
        id: 'kandy',
        name: 'Kandy',
        lat: 7.2906,
        lng: 80.6337,
        description: 'Cultural Capital of Sri Lanka',
        image: 'https://images.unsplash.com/photo-1588598198321-4c8c6d733293?w=400&h=300&fit=crop',
        category: 'culture',
        icon: '🏛️',
        attractions: [
            { id: 'temple-tooth', name: 'Temple of the Tooth', price: 15, duration: 90, description: 'Sacred Buddhist temple with Buddha\'s tooth relic', category: 'Culture' },
            { id: 'botanical-gardens', name: 'Royal Botanical Gardens', price: 10, duration: 120, description: 'Beautiful orchid collection and giant trees', category: 'Nature' },
            { id: 'kandy-lake', name: 'Kandy Lake Walk', price: 0, duration: 45, description: 'Scenic walk around the lake', category: 'Relaxation' },
            { id: 'cultural-show', name: 'Kandyan Dance Show', price: 15, duration: 90, description: 'Traditional Sri Lankan dance performance', category: 'Culture' },
        ]
    },
    {
        id: 'ella',
        name: 'Ella',
        lat: 6.8667,
        lng: 81.0466,
        description: 'Scenic Mountain Village',
        image: 'https://images.unsplash.com/photo-1571296251827-6e6ce8929b48?w=400&h=300&fit=crop',
        category: 'mountain',
        icon: '⛰️',
        attractions: [
            { id: 'nine-arch', name: 'Nine Arch Bridge', price: 0, duration: 60, description: 'Iconic colonial-era railway bridge', category: 'Culture' },
            { id: 'little-adams-peak', name: 'Little Adam\'s Peak', price: 0, duration: 90, description: 'Easy hike with stunning views', category: 'Adventure' },
            { id: 'ravana-falls', name: 'Ravana Falls', price: 0, duration: 30, description: 'Beautiful waterfall by the road', category: 'Nature' },
            { id: 'ella-rock', name: 'Ella Rock Hike', price: 0, duration: 180, description: 'Challenging hike with panoramic views', category: 'Adventure' },
            { id: 'train-ride', name: 'Scenic Train Ride', price: 5, duration: 180, description: 'Most beautiful train journey in the world', category: 'Adventure' },
        ]
    },
    {
        id: 'yala',
        name: 'Yala',
        lat: 6.3716,
        lng: 81.5168,
        description: 'Best Leopard Spotting',
        image: 'https://images.unsplash.com/photo-1574870111867-089730e5a72b?w=400&h=300&fit=crop',
        category: 'wildlife',
        icon: '🐆',
        attractions: [
            { id: 'yala-safari', name: 'Yala Safari (Half Day)', price: 60, duration: 240, description: 'See leopards, elephants, and more', category: 'Wildlife' },
            { id: 'yala-full-safari', name: 'Yala Safari (Full Day)', price: 100, duration: 480, description: 'Full day wildlife adventure', category: 'Wildlife' },
        ]
    },
    {
        id: 'colombo',
        name: 'Colombo',
        lat: 6.9271,
        lng: 79.8612,
        description: 'Vibrant Capital City',
        image: 'https://images.unsplash.com/photo-1578469550956-0e16b69c6a3d?w=400&h=300&fit=crop',
        category: 'city',
        icon: '🏙️',
        attractions: [
            { id: 'gangaramaya', name: 'Gangaramaya Temple', price: 5, duration: 60, description: 'Famous Buddhist temple', category: 'Culture' },
            { id: 'lotus-tower', name: 'Lotus Tower', price: 20, duration: 90, description: 'Tallest tower in South Asia', category: 'Adventure' },
            { id: 'national-museum', name: 'National Museum', price: 10, duration: 120, description: 'Sri Lanka\'s history and art', category: 'Culture' },
            { id: 'galle-face', name: 'Galle Face Green', price: 0, duration: 60, description: 'Ocean-side promenade', category: 'Relaxation' },
        ]
    }
];

interface Attraction {
    id: string;
    name: string;
    price: number;
    duration: number;
    description: string;
    category: 'Nature' | 'Culture' | 'Adventure' | 'Relaxation' | 'Wildlife' | 'Food';
}

interface Destination {
    id?: string;
    name: string;
    lat: number;
    lng: number;
    description: string;
    image: string;
    category: string;
    icon: string;
    attractions: Attraction[];
    enabled: boolean;
}

interface BookingRequest {
    id: string;
    customerName: string;
    customerEmail: string;
    customerPhone: string;
    numberOfTravelers: string;
    preferredDates: string;
    hotelRating: number;
    totalDistanceKm: number;
    suggestedNights: number;
    estimatedPrice: number;
    itinerary: Array<{
        order: number;
        id: string;
        name: string;
    }>;
    summary: string;
    status: string;
    createdAt: any;
}

const CATEGORIES = [
    { id: 'beach', label: 'Beaches', color: 'bg-blue-100 text-blue-700' },
    { id: 'culture', label: 'Culture', color: 'bg-amber-100 text-amber-700' },
    { id: 'mountain', label: 'Mountains', color: 'bg-emerald-100 text-emerald-700' },
    { id: 'wildlife', label: 'Wildlife', color: 'bg-orange-100 text-orange-700' },
    { id: 'tea', label: 'Tea Country', color: 'bg-green-100 text-green-700' },
    { id: 'city', label: 'Cities', color: 'bg-purple-100 text-purple-700' },
    { id: 'nature', label: 'Nature', color: 'bg-teal-100 text-teal-700' },
];

const ATTRACTION_CATEGORIES = ['Nature', 'Culture', 'Adventure', 'Relaxation', 'Wildlife', 'Food'];

const TripBuilderManager: React.FC = () => {
    const [destinations, setDestinations] = useState<Destination[]>([]);
    const [bookingRequests, setBookingRequests] = useState<BookingRequest[]>([]);
    const [loading, setLoading] = useState(true);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [editingDestination, setEditingDestination] = useState<Destination | null>(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [filterCategory, setFilterCategory] = useState('all');
    const [activeTab, setActiveTab] = useState<'destinations' | 'bookings'>('destinations');

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        try {
            setLoading(true);

            // Load destinations
            const destsSnapshot = await getDocs(collection(db, 'trip_destinations'));
            const destsData = destsSnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            })) as Destination[];
            setDestinations(destsData);

            // Load booking requests
            const bookingsSnapshot = await getDocs(collection(db, 'booking_requests'));
            const bookingsData = bookingsSnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            })) as BookingRequest[];
            setBookingRequests(bookingsData.filter(b => b.summary).sort((a, b) => b.createdAt?.toMillis() - a.createdAt?.toMillis()));

        } catch (error) {
            console.error('Error loading data:', error);
            toast.error('Failed to load data');
        } finally {
            setLoading(false);
        }
    };

    const handleSeedData = async () => {
        if (!confirm('This will add default destinations to your database. Continue?')) return;

        setLoading(true);
        try {
            for (const dest of INITIAL_DESTINATIONS) {
                // Check if already exists by ID or Name to avoid duplicates
                const exists = destinations.some(d => d.id === dest.id || d.name === dest.name);
                if (!exists) {
                    await addDoc(collection(db, 'trip_destinations'), {
                        ...dest,
                        enabled: true,
                        createdAt: Timestamp.now(),
                    });
                }
            }
            toast.success(`Default destinations added`);
            loadData();
        } catch (error) {
            console.error('Error seeding data:', error);
            toast.error('Failed to seed data');
        } finally {
            setLoading(false);
        }
    };

    const openEditModal = (dest?: Destination) => {
        setEditingDestination(dest || {
            name: '',
            lat: 7.8731,
            lng: 80.7718,
            description: '',
            image: '',
            category: 'beach',
            icon: '🏖️',
            attractions: [],
            enabled: true,
        });
        setIsEditModalOpen(true);
    };

    const saveDestination = async () => {
        if (!editingDestination) return;

        if (!editingDestination.name || !editingDestination.lat || !editingDestination.lng) {
            toast.error('Please fill in all required fields');
            return;
        }

        try {
            if (editingDestination.id) {
                // Update existing
                await updateDoc(doc(db, 'trip_destinations', editingDestination.id), {
                    ...editingDestination,
                    updatedAt: Timestamp.now(),
                });
                toast.success('Destination updated!');
            } else {
                // Create new
                await addDoc(collection(db, 'trip_destinations'), {
                    ...editingDestination,
                    createdAt: Timestamp.now(),
                    enabled: true,
                });
                toast.success('Destination created!');
            }
            setIsEditModalOpen(false);
            setEditingDestination(null);
            loadData();
        } catch (error) {
            console.error('Error saving destination:', error);
            toast.error('Failed to save destination');
        }
    };

    const deleteDestination = async (id: string) => {
        if (!confirm('Are you sure you want to delete this destination?')) return;

        try {
            await deleteDoc(doc(db, 'trip_destinations', id));
            toast.success('Destination deleted');
            loadData();
        } catch (error) {
            console.error('Error deleting destination:', error);
            toast.error('Failed to delete destination');
        }
    };

    const toggleDestinationStatus = async (id: string, currentStatus: boolean) => {
        try {
            await updateDoc(doc(db, 'trip_destinations', id), {
                enabled: !currentStatus,
                updatedAt: Timestamp.now(),
            });
            toast.success(currentStatus ? 'Destination hidden' : 'Destination enabled');
            loadData();
        } catch (error) {
            console.error('Error toggling status:', error);
            toast.error('Failed to update status');
        }
    };

    const updateBookingStatus = async (id: string, newStatus: string) => {
        try {
            await updateDoc(doc(db, 'booking_requests', id), {
                status: newStatus,
                updatedAt: Timestamp.now(),
            });
            toast.success(`Booking marked as ${newStatus}`);
            loadData();
        } catch (error) {
            console.error('Error updating booking:', error);
            toast.error('Failed to update booking');
        }
    };

    const addAttraction = () => {
        if (!editingDestination) return;
        setEditingDestination({
            ...editingDestination,
            attractions: [
                ...editingDestination.attractions,
                {
                    id: `attr-${Date.now()}`,
                    name: '',
                    price: 0,
                    duration: 60,
                    description: '',
                    category: 'Nature',
                }
            ]
        });
    };

    const updateAttraction = (index: number, field: string, value: any) => {
        if (!editingDestination) return;
        const updatedAttractions = [...editingDestination.attractions];
        updatedAttractions[index] = { ...updatedAttractions[index], [field]: value };
        setEditingDestination({ ...editingDestination, attractions: updatedAttractions });
    };

    const removeAttraction = (index: number) => {
        if (!editingDestination) return;
        const updatedAttractions = editingDestination.attractions.filter((_, i) => i !== index);
        setEditingDestination({ ...editingDestination, attractions: updatedAttractions });
    };

    const filteredDestinations = destinations.filter(dest => {
        const matchesSearch = dest.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            dest.description.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesCategory = filterCategory === 'all' || dest.category === filterCategory;
        return matchesSearch && matchesCategory;
    });

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <RefreshCw className="h-8 w-8 animate-spin text-purple-600" />
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-3xl font-bold text-gray-900">Trip Builder Management</h2>
                    <p className="text-gray-600 mt-1">Manage destinations, attractions, and booking requests</p>
                </div>
                <div className="flex gap-2">
                    {activeTab === 'destinations' && (
                        <>
                            <Button onClick={handleSeedData} variant="outline" className="gap-2">
                                <RotateCcw className="w-4 h-4" />
                                Seed Default Data
                            </Button>
                            <Button onClick={() => openEditModal()} className="bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-700 hover:to-emerald-700">
                                <Plus className="h-4 w-4 mr-2" />
                                Add Destination
                            </Button>
                        </>
                    )}
                </div>
            </div>

            {/* Tabs */}
            <div className="flex gap-2 border-b border-gray-200">
                <button
                    onClick={() => setActiveTab('destinations')}
                    className={`px-6 py-3 font-medium transition-all ${activeTab === 'destinations'
                        ? 'text-teal-600 border-b-2 border-teal-600'
                        : 'text-gray-500 hover:text-gray-700'
                        }`}
                >
                    <Map className="inline h-5 w-5 mr-2" />
                    Destinations ({destinations.length})
                </button>
                <button
                    onClick={() => setActiveTab('bookings')}
                    className={`px-6 py-3 font-medium transition-all ${activeTab === 'bookings'
                        ? 'text-teal-600 border-b-2 border-teal-600'
                        : 'text-gray-500 hover:text-gray-700'
                        }`}
                >
                    <MapPin className="inline h-5 w-5 mr-2" />
                    Booking Requests ({bookingRequests.length})
                </button>
            </div>

            {/* Destinations Tab */}
            {activeTab === 'destinations' && (
                <>
                    {/* Search and Filter */}
                    <div className="flex gap-4">
                        <div className="flex-1 relative">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                            <Input
                                type="text"
                                placeholder="Search destinations..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="pl-10"
                            />
                        </div>
                        <select
                            value={filterCategory}
                            onChange={(e) => setFilterCategory(e.target.value)}
                            className="px-4 py-2 border border-gray-300 rounded-md"
                        >
                            <option value="all">All Categories</option>
                            {CATEGORIES.map(cat => (
                                <option key={cat.id} value={cat.id}>{cat.label}</option>
                            ))}
                        </select>
                    </div>

                    {/* Destinations Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {filteredDestinations.map(dest => (
                            <Card key={dest.id} className={`${!dest.enabled ? 'opacity-60' : ''}`}>
                                <CardHeader className="pb-3">
                                    <div className="flex items-start justify-between">
                                        <div className="flex items-center gap-2">
                                            <span className="text-2xl">{dest.icon}</span>
                                            <div>
                                                <CardTitle className="text-lg">{dest.name}</CardTitle>
                                                <Badge className={CATEGORIES.find(c => c.id === dest.category)?.color || ''}>
                                                    {dest.category}
                                                </Badge>
                                            </div>
                                        </div>
                                        <button
                                            onClick={() => toggleDestinationStatus(dest.id!, dest.enabled)}
                                            className="text-gray-500 hover:text-gray-700"
                                        >
                                            {dest.enabled ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
                                        </button>
                                    </div>
                                    <CardDescription>{dest.description}</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <div className="relative h-32 mb-4 rounded-md overflow-hidden">
                                        <img
                                            src={dest.image}
                                            alt={dest.name}
                                            className="w-full h-full object-cover"
                                        />
                                    </div>
                                    <div className="space-y-2 text-sm">
                                        <div className="text-gray-600">
                                            📍 {dest.lat.toFixed(4)}, {dest.lng.toFixed(4)}
                                        </div>
                                        <div className="text-gray-600">
                                            🎯 {dest.attractions.length} attractions
                                        </div>
                                    </div>
                                    <div className="flex gap-2 mt-4">
                                        <Button
                                            onClick={() => openEditModal(dest)}
                                            size="sm"
                                            variant="outline"
                                            className="flex-1"
                                        >
                                            <Edit2 className="h-3 w-3 mr-1" />
                                            Edit
                                        </Button>
                                        <Button
                                            onClick={() => deleteDestination(dest.id!)}
                                            size="sm"
                                            variant="outline"
                                            className="text-red-600 hover:bg-red-50"
                                        >
                                            <Trash2 className="h-3 w-3" />
                                        </Button>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </>
            )}

            {/* Bookings Tab */}
            {activeTab === 'bookings' && (
                <div className="space-y-4">
                    {bookingRequests.map(booking => (
                        <Card key={booking.id}>
                            <CardHeader>
                                <div className="flex items-start justify-between">
                                    <div>
                                        <CardTitle>{booking.customerName}</CardTitle>
                                        <CardDescription>{booking.customerEmail} | {booking.customerPhone}</CardDescription>
                                    </div>
                                    <Badge className={
                                        booking.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                                            booking.status === 'confirmed' ? 'bg-green-100 text-green-700' :
                                                'bg-gray-100 text-gray-700'
                                    }>
                                        {booking.status}
                                    </Badge>
                                </div>
                            </CardHeader>
                            <CardContent className="space-y-3">
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                                    <div>
                                        <div className="text-gray-500">Travelers</div>
                                        <div className="font-semibold">{booking.numberOfTravelers} people</div>
                                    </div>
                                    <div>
                                        <div className="text-gray-500">Hotel Rating</div>
                                        <div className="font-semibold">{booking.hotelRating} Stars</div>
                                    </div>
                                    <div>
                                        <div className="text-gray-500">Duration</div>
                                        <div className="font-semibold">{booking.suggestedNights} nights</div>
                                    </div>
                                    <div>
                                        <div className="text-gray-500">Estimated Price</div>
                                        <div className="font-semibold text-teal-600">${booking.estimatedPrice}</div>
                                    </div>
                                </div>
                                <div>
                                    <div className="text-sm text-gray-500 mb-1">Itinerary:</div>
                                    <div className="text-sm font-medium">{booking.summary}</div>
                                </div>
                                {booking.preferredDates && (
                                    <div className="text-sm">
                                        <span className="text-gray-500">Dates:</span> {booking.preferredDates}
                                    </div>
                                )}
                                <div className="flex gap-2">
                                    <Button
                                        onClick={() => updateBookingStatus(booking.id, 'confirmed')}
                                        size="sm"
                                        className="bg-green-600 hover:bg-green-700"
                                    >
                                        Confirm
                                    </Button>
                                    <Button
                                        onClick={() => updateBookingStatus(booking.id, 'cancelled')}
                                        size="sm"
                                        variant="outline"
                                    >
                                        Cancel
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                    {bookingRequests.length === 0 && (
                        <div className="text-center py-12 text-gray-500">
                            No booking requests yet
                        </div>
                    )}
                </div>
            )}

            {/* Edit Modal */}
            <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
                <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle>
                            {editingDestination?.id ? 'Edit Destination' : 'Add New Destination'}
                        </DialogTitle>
                        <DialogDescription>
                            Configure destination details and attractions
                        </DialogDescription>
                    </DialogHeader>

                    {editingDestination && (
                        <div className="space-y-6">
                            {/* Basic Info */}
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <Label>Name *</Label>
                                    <Input
                                        value={editingDestination.name}
                                        onChange={(e) => setEditingDestination({ ...editingDestination, name: e.target.value })}
                                        placeholder="e.g., Mullaitivu"
                                    />
                                </div>
                                <div>
                                    <Label>Category *</Label>
                                    <select
                                        value={editingDestination.category}
                                        onChange={(e) => setEditingDestination({ ...editingDestination, category: e.target.value })}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md"
                                    >
                                        {CATEGORIES.map(cat => (
                                            <option key={cat.id} value={cat.id}>{cat.label}</option>
                                        ))}
                                    </select>
                                </div>
                                <div>
                                    <Label>Latitude *</Label>
                                    <Input
                                        type="number"
                                        step="0.0001"
                                        value={editingDestination.lat}
                                        onChange={(e) => setEditingDestination({ ...editingDestination, lat: parseFloat(e.target.value) })}
                                    />
                                </div>
                                <div>
                                    <Label>Longitude *</Label>
                                    <Input
                                        type="number"
                                        step="0.0001"
                                        value={editingDestination.lng}
                                        onChange={(e) => setEditingDestination({ ...editingDestination, lng: parseFloat(e.target.value) })}
                                    />
                                </div>
                                <div>
                                    <Label>Icon (Emoji)</Label>
                                    <Input
                                        value={editingDestination.icon}
                                        onChange={(e) => setEditingDestination({ ...editingDestination, icon: e.target.value })}
                                        placeholder="🏖️"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label>Image</Label>
                                <ImageUpload
                                    value={editingDestination.image}
                                    onChange={(url) => setEditingDestination({ ...editingDestination, image: url })}
                                    onRemove={() => setEditingDestination({ ...editingDestination, image: '' })}
                                    folder="trip-destinations"
                                    helperText="Recommended: 400x300px (4:3 aspect ratio)"
                                />
                            </div>

                            <div>
                                <Label>Description</Label>
                                <Textarea
                                    value={editingDestination.description}
                                    onChange={(e) => setEditingDestination({ ...editingDestination, description: e.target.value })}
                                    placeholder="Brief description..."
                                    rows={2}
                                />
                            </div>

                            {/* Attractions */}
                            <div>
                                <div className="flex items-center justify-between mb-3">
                                    <Label className="text-lg">Attractions</Label>
                                    <Button
                                        type="button"
                                        onClick={addAttraction}
                                        size="sm"
                                        variant="outline"
                                    >
                                        <Plus className="h-4 w-4 mr-1" />
                                        Add Attraction
                                    </Button>
                                </div>
                                <div className="space-y-4">
                                    {editingDestination.attractions.map((attr, index) => (
                                        <Card key={attr.id} className="p-4">
                                            <div className="grid grid-cols-2 gap-3">
                                                <div className="col-span-2">
                                                    <Label className="text-xs">Attraction Name</Label>
                                                    <Input
                                                        value={attr.name}
                                                        onChange={(e) => updateAttraction(index, 'name', e.target.value)}
                                                        placeholder="e.g., Mullaitivu Beach"
                                                    />
                                                </div>
                                                <div>
                                                    <Label className="text-xs">Price (USD)</Label>
                                                    <Input
                                                        type="number"
                                                        value={attr.price}
                                                        onChange={(e) => updateAttraction(index, 'price', parseFloat(e.target.value))}
                                                    />
                                                </div>
                                                <div>
                                                    <Label className="text-xs">Duration (minutes)</Label>
                                                    <Input
                                                        type="number"
                                                        value={attr.duration}
                                                        onChange={(e) => updateAttraction(index, 'duration', parseInt(e.target.value))}
                                                    />
                                                </div>
                                                <div>
                                                    <Label className="text-xs">Category</Label>
                                                    <select
                                                        value={attr.category}
                                                        onChange={(e) => updateAttraction(index, 'category', e.target.value)}
                                                        className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                                                    >
                                                        {ATTRACTION_CATEGORIES.map(cat => (
                                                            <option key={cat} value={cat}>{cat}</option>
                                                        ))}
                                                    </select>
                                                </div>
                                                <div>
                                                    <Button
                                                        type="button"
                                                        onClick={() => removeAttraction(index)}
                                                        size="sm"
                                                        variant="outline"
                                                        className="text-red-600 hover:bg-red-50 mt-5"
                                                    >
                                                        <Trash2 className="h-3 w-3 mr-1" />
                                                        Remove
                                                    </Button>
                                                </div>
                                                <div className="col-span-2">
                                                    <Label className="text-xs">Description</Label>
                                                    <Textarea
                                                        value={attr.description}
                                                        onChange={(e) => updateAttraction(index, 'description', e.target.value)}
                                                        placeholder="Brief description..."
                                                        rows={2}
                                                    />
                                                </div>
                                            </div>
                                        </Card>
                                    ))}
                                </div>
                            </div>

                            {/* Actions */}
                            <div className="flex gap-2 justify-end pt-4 border-t">
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() => setIsEditModalOpen(false)}
                                >
                                    <X className="h-4 w-4 mr-2" />
                                    Cancel
                                </Button>
                                <Button
                                    onClick={saveDestination}
                                    className="bg-teal-600 hover:bg-teal-700"
                                >
                                    <Save className="h-4 w-4 mr-2" />
                                    Save Destination
                                </Button>
                            </div>
                        </div>
                    )}
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default TripBuilderManager;
