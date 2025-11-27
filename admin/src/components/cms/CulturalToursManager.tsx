import React, { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import {
    Plus, Edit, Trash2, Save, X, Church, DollarSign, Clock,
    Users, MapPin, Star, Image, Upload, Eye, EyeOff, Award, Calendar, Search
} from 'lucide-react';
import {
    collection, getDocs, addDoc, updateDoc, deleteDoc, doc,
    query, where, orderBy, Timestamp
} from 'firebase/firestore';
import { db, storage } from '@/lib/firebase';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';

interface CulturalTour {
    id?: string;
    title: string;
    description: string;
    location: string;
    duration: string;
    price: number;
    image: string;
    rating: number;
    reviews: number;
    category: string;
    highlights: string[];
    difficulty: string;
    maxGroupSize: number;
    included: string[];
    menu?: string[];
    chef?: string;
    featured?: boolean;
    videoUrl?: string;
    gallery?: string[];
    availability?: string;
    is_active: boolean;
    created_at?: any;
    updated_at?: any;
}

interface Booking {
    id: string;
    tourId: string;
    tourTitle: string;
    userId: string;
    date: string;
    guests: number;
    contactName: string;
    contactEmail: string;
    contactPhone: string;
    specialRequests?: string;
    status: 'pending' | 'confirmed' | 'cancelled';
    createdAt: string;
    totalPrice: number;
}

export const CulturalToursManager = () => {
    const [tours, setTours] = useState<CulturalTour[]>([]);
    const [bookings, setBookings] = useState<Booking[]>([]);
    const [selectedTour, setSelectedTour] = useState<CulturalTour | null>(null);
    const [isEditing, setIsEditing] = useState(false);
    const [isCreating, setIsCreating] = useState(false);
    const [loading, setLoading] = useState(true);
    const [uploading, setUploading] = useState(false);
    const [activeTab, setActiveTab] = useState('tours');
    const [searchQuery, setSearchQuery] = useState('');
    const { toast } = useToast();

    const [formData, setFormData] = useState<CulturalTour>({
        title: '',
        description: '',
        location: '',
        duration: '',
        price: 0,
        image: '',
        rating: 4.5,
        reviews: 0,
        category: 'cooking-class',
        highlights: [],
        difficulty: 'Easy',
        maxGroupSize: 10,
        included: [],
        menu: [],
        chef: '',
        featured: false,
        videoUrl: '',
        gallery: [],
        availability: 'Available',
        is_active: true,
    });

    const [highlightInput, setHighlightInput] = useState('');
    const [includedInput, setIncludedInput] = useState('');
    const [menuInput, setMenuInput] = useState('');

    const categories = [
        { value: 'cooking-class', label: 'Cooking Class' },
        { value: 'street-food', label: 'Street Food Tour' },
        { value: 'fine-dining', label: 'Fine Dining' },
        { value: 'spice-garden', label: 'Spice Garden' },
        { value: 'tea-experience', label: 'Tea Experience' },
    ];

    const difficulties = [
        { value: 'Easy', label: 'Easy' },
        { value: 'Moderate', label: 'Moderate' },
        { value: 'Challenging', label: 'Challenging' },
    ];

    // Fetch tours
    const fetchTours = useCallback(async () => {
        try {
            setLoading(true);
            const toursRef = collection(db, 'cultural_tours');
            const q = query(toursRef, orderBy('created_at', 'desc'));
            const snapshot = await getDocs(q);

            const toursData = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            } as CulturalTour));

            setTours(toursData);
        } catch (error) {
            console.error('Error fetching tours:', error);
            toast({
                title: "Error",
                description: "Failed to fetch cultural tours",
                variant: "destructive"
            });
        } finally {
            setLoading(false);
        }
    }, [toast]);

    // Fetch bookings
    const fetchBookings = useCallback(async () => {
        try {
            const bookingsRef = collection(db, 'cultural_bookings');
            const q = query(bookingsRef, orderBy('createdAt', 'desc'));
            const snapshot = await getDocs(q);

            const bookingsData = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            } as Booking));

            setBookings(bookingsData);
        } catch (error) {
            console.error('Error fetching bookings:', error);
            toast({
                title: "Error",
                description: "Failed to fetch bookings",
                variant: "destructive"
            });
        }
    }, [toast]);

    useEffect(() => {
        fetchTours();
        fetchBookings();
    }, [fetchTours, fetchBookings]);

    // Handle image upload
    const handleImageUpload = async (file: File, fieldName: 'image' | 'gallery') => {
        try {
            setUploading(true);
            const timestamp = Date.now();
            const storageRef = ref(storage, `cultural-tours/${timestamp}_${file.name}`);

            await uploadBytes(storageRef, file);
            const downloadURL = await getDownloadURL(storageRef);

            if (fieldName === 'image') {
                setFormData(prev => ({ ...prev, image: downloadURL }));
            } else {
                setFormData(prev => ({
                    ...prev,
                    gallery: [...(prev.gallery || []), downloadURL]
                }));
            }

            toast({
                title: "Success",
                description: "Image uploaded successfully",
            });
        } catch (error) {
            console.error('Error uploading image:', error);
            toast({
                title: "Error",
                description: "Failed to upload image",
                variant: "destructive"
            });
        } finally {
            setUploading(false);
        }
    };

    // Create or update tour
    const handleSave = async () => {
        try {
            if (!formData.title || !formData.description || !formData.location) {
                toast({
                    title: "Validation Error",
                    description: "Please fill in all required fields",
                    variant: "destructive"
                });
                return;
            }

            const tourData = {
                ...formData,
                updated_at: Timestamp.now(),
            };

            if (isCreating) {
                await addDoc(collection(db, 'cultural_tours'), {
                    ...tourData,
                    created_at: Timestamp.now(),
                });

                toast({
                    title: "Success",
                    description: "Hill Country tour created successfully"
                });
            } else if (selectedTour?.id) {
                await updateDoc(doc(db, 'cultural_tours', selectedTour.id), tourData);

                toast({
                    title: "Success",
                    description: "Hill Country tour updated successfully"
                });
            }

            fetchTours();
            resetForm();
        } catch (error) {
            console.error('Error saving tour:', error);
            toast({
                title: "Error",
                description: "Failed to save tour",
                variant: "destructive"
            });
        }
    };

    // Delete tour
    const handleDelete = async (tourId: string) => {
        if (!window.confirm('Are you sure you want to delete this tour?')) {
            return;
        }

        try {
            await deleteDoc(doc(db, 'cultural_tours', tourId));
            toast({
                title: "Success",
                description: "Tour deleted successfully"
            });
            fetchTours();
        } catch (error) {
            console.error('Error deleting tour:', error);
            toast({
                title: "Error",
                description: "Failed to delete tour",
                variant: "destructive"
            });
        }
    };

    // Update booking status
    const updateBookingStatus = async (bookingId: string, status: 'confirmed' | 'cancelled') => {
        try {
            await updateDoc(doc(db, 'cultural_bookings', bookingId), {
                status,
                updated_at: Timestamp.now(),
            });

            toast({
                title: "Success",
                description: `Booking ${status} successfully`
            });
            fetchBookings();
        } catch (error) {
            console.error('Error updating booking:', error);
            toast({
                title: "Error",
                description: "Failed to update booking status",
                variant: "destructive"
            });
        }
    };

    const resetForm = () => {
        setFormData({
            title: '',
            description: '',
            location: '',
            duration: '',
            price: 0,
            image: '',
            rating: 4.5,
            reviews: 0,
            category: 'cooking-class',
            highlights: [],
            difficulty: 'Easy',
            maxGroupSize: 10,
            included: [],
            menu: [],
            chef: '',
            featured: false,
            videoUrl: '',
            gallery: [],
            availability: 'Available',
            is_active: true,
        });
        setSelectedTour(null);
        setIsEditing(false);
        setIsCreating(false);
        setHighlightInput('');
        setIncludedInput('');
        setMenuInput('');
    };

    const startEdit = (tour: CulturalTour) => {
        setSelectedTour(tour);
        setFormData(tour);
        setIsEditing(true);
        setIsCreating(false);
    };

    const startCreate = () => {
        resetForm();
        setIsCreating(true);
        setIsEditing(true);
    };

    const addArrayItem = (field: 'highlights' | 'included' | 'menu', value: string) => {
        if (!value.trim()) return;

        setFormData(prev => ({
            ...prev,
            [field]: [...(prev[field] || []), value.trim()]
        }));

        // Reset input
        if (field === 'highlights') setHighlightInput('');
        if (field === 'included') setIncludedInput('');
        if (field === 'menu') setMenuInput('');
    };

    const removeArrayItem = (field: 'highlights' | 'included' | 'menu' | 'gallery', index: number) => {
        setFormData(prev => ({
            ...prev,
            [field]: (prev[field] || []).filter((_, i) => i !== index)
        }));
    };

    const filteredTours = tours.filter(tour =>
        tour.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        tour.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
        tour.category.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const filteredBookings = bookings.filter(booking =>
        booking.tourTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
        booking.contactName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        booking.contactEmail.toLowerCase().includes(searchQuery.toLowerCase())
    );

    if (loading) {
        return <div className="flex justify-center p-8">Loading cultural tours...</div>;
    }

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-3xl font-bold flex items-center gap-2">
                        <Church className="h-8 w-8 text-orange-600" />
                        Hill Country Tours Management
                    </h2>
                    <p className="text-muted-foreground">Manage cultural experiences and bookings</p>
                </div>

                <Button
                    onClick={startCreate}
                    className="flex items-center gap-2 bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-700 hover:to-amber-700"
                >
                    <Plus className="h-4 w-4" />
                    Add New Tour
                </Button>
            </div>

            <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsList className="grid w-full grid-cols-2 max-w-md">
                    <TabsTrigger value="tours">
                        Tours ({tours.length})
                    </TabsTrigger>
                    <TabsTrigger value="bookings">
                        Bookings ({bookings.length})
                    </TabsTrigger>
                </TabsList>

                {/* Tours Tab */}
                <TabsContent value="tours" className="space-y-4">
                    {/* Search */}
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                        <Input
                            placeholder="Search tours..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="pl-10"
                        />
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {/* Tours List */}
                        <Card>
                            <CardHeader>
                                <CardTitle>All Tours</CardTitle>
                                <CardDescription>Manage your cultural tour offerings</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4 max-h-[600px] overflow-y-auto">
                                {filteredTours.map((tour) => (
                                    <div
                                        key={tour.id}
                                        className="border rounded-lg p-4 hover:bg-accent/5 transition-colors"
                                    >
                                        <div className="flex gap-4">
                                            {tour.image && (
                                                <img
                                                    src={tour.image}
                                                    alt={tour.title}
                                                    className="w-24 h-24 object-cover rounded-lg"
                                                />
                                            )}

                                            <div className="flex-1">
                                                <div className="flex justify-between items-start mb-2">
                                                    <div>
                                                        <h3 className="font-semibold flex items-center gap-2">
                                                            {tour.title}
                                                            {tour.featured && (
                                                                <Award className="h-4 w-4 text-yellow-500" />
                                                            )}
                                                        </h3>
                                                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                                            <Badge variant="secondary">{tour.category}</Badge>
                                                            <span className="flex items-center gap-1">
                                                                <MapPin className="h-3 w-3" />
                                                                {tour.location}
                                                            </span>
                                                        </div>
                                                    </div>

                                                    <div className="flex gap-2">
                                                        <Button
                                                            size="sm"
                                                            variant="outline"
                                                            onClick={() => startEdit(tour)}
                                                        >
                                                            <Edit className="h-3 w-3" />
                                                        </Button>
                                                        <Button
                                                            size="sm"
                                                            variant="destructive"
                                                            onClick={() => handleDelete(tour.id!)}
                                                        >
                                                            <Trash2 className="h-3 w-3" />
                                                        </Button>
                                                    </div>
                                                </div>

                                                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                                                    <span className="flex items-center gap-1">
                                                        <DollarSign className="h-3 w-3" />
                                                        ${tour.price}
                                                    </span>
                                                    <span className="flex items-center gap-1">
                                                        <Clock className="h-3 w-3" />
                                                        {tour.duration}
                                                    </span>
                                                    <span className="flex items-center gap-1">
                                                        <Users className="h-3 w-3" />
                                                        Max {tour.maxGroupSize}
                                                    </span>
                                                    <span className="flex items-center gap-1">
                                                        <Star className="h-3 w-3 text-yellow-500" />
                                                        {tour.rating}
                                                    </span>
                                                </div>

                                                <div className="mt-2 flex items-center gap-2">
                                                    {tour.is_active ? (
                                                        <Badge className="bg-green-100 text-green-800">
                                                            <Eye className="h-3 w-3 mr-1" />
                                                            Active
                                                        </Badge>
                                                    ) : (
                                                        <Badge className="bg-gray-100 text-gray-800">
                                                            <EyeOff className="h-3 w-3 mr-1" />
                                                            Inactive
                                                        </Badge>
                                                    )}
                                                    {tour.chef && (
                                                        <Badge variant="outline" className="text-xs">
                                                            <Church className="h-3 w-3 mr-1" />
                                                            {tour.chef}
                                                        </Badge>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}

                                {filteredTours.length === 0 && (
                                    <div className="text-center py-8 text-muted-foreground">
                                        No tours found
                                    </div>
                                )}
                            </CardContent>
                        </Card>

                        {/* Tour Editor */}
                        {isEditing && (
                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center justify-between">
                                        <span>{isCreating ? 'Create New Tour' : `Edit: ${selectedTour?.title}`}</span>
                                        <Button variant="ghost" size="sm" onClick={resetForm}>
                                            <X className="h-4 w-4" />
                                        </Button>
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4 max-h-[600px] overflow-y-auto">
                                    {/* Basic Info */}
                                    <div className="space-y-2">
                                        <Label htmlFor="title">Tour Title *</Label>
                                        <Input
                                            id="title"
                                            value={formData.title}
                                            onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                                            placeholder="Enter tour title"
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="description">Description *</Label>
                                        <Textarea
                                            id="description"
                                            value={formData.description}
                                            onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                                            placeholder="Describe the cultural experience..."
                                            rows={4}
                                        />
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <Label htmlFor="location">Location *</Label>
                                            <Input
                                                id="location"
                                                value={formData.location}
                                                onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
                                                placeholder="e.g., Colombo"
                                            />
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="duration">Duration</Label>
                                            <Input
                                                id="duration"
                                                value={formData.duration}
                                                onChange={(e) => setFormData(prev => ({ ...prev, duration: e.target.value }))}
                                                placeholder="e.g., 4 hours"
                                            />
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <Label htmlFor="price">Price (USD)</Label>
                                            <Input
                                                id="price"
                                                type="number"
                                                value={formData.price}
                                                onChange={(e) => setFormData(prev => ({ ...prev, price: parseFloat(e.target.value) || 0 }))}
                                                placeholder="0"
                                            />
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="maxGroupSize">Max Group Size</Label>
                                            <Input
                                                id="maxGroupSize"
                                                type="number"
                                                value={formData.maxGroupSize}
                                                onChange={(e) => setFormData(prev => ({ ...prev, maxGroupSize: parseInt(e.target.value) || 10 }))}
                                            />
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <Label htmlFor="category">Category</Label>
                                            <Select
                                                value={formData.category}
                                                onValueChange={(value) => setFormData(prev => ({ ...prev, category: value }))}
                                            >
                                                <SelectTrigger>
                                                    <SelectValue />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {categories.map(cat => (
                                                        <SelectItem key={cat.value} value={cat.value}>
                                                            {cat.label}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="difficulty">Difficulty</Label>
                                            <Select
                                                value={formData.difficulty}
                                                onValueChange={(value) => setFormData(prev => ({ ...prev, difficulty: value }))}
                                            >
                                                <SelectTrigger>
                                                    <SelectValue />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {difficulties.map(diff => (
                                                        <SelectItem key={diff.value} value={diff.value}>
                                                            {diff.label}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <Label htmlFor="chef">Chef Name</Label>
                                            <Input
                                                id="chef"
                                                value={formData.chef}
                                                onChange={(e) => setFormData(prev => ({ ...prev, chef: e.target.value }))}
                                                placeholder="e.g., Chef Kumari"
                                            />
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="rating">Rating</Label>
                                            <Input
                                                id="rating"
                                                type="number"
                                                step="0.1"
                                                min="0"
                                                max="5"
                                                value={formData.rating}
                                                onChange={(e) => setFormData(prev => ({ ...prev, rating: parseFloat(e.target.value) || 4.5 }))}
                                            />
                                        </div>
                                    </div>

                                    {/* Image Upload */}
                                    <div className="space-y-2">
                                        <Label>Main Image</Label>
                                        <div className="space-y-2">
                                            {formData.image && (
                                                <img src={formData.image} alt="Preview" className="w-full h-40 object-cover rounded-lg" />
                                            )}
                                            <Input
                                                type="file"
                                                accept="image/*"
                                                onChange={(e) => {
                                                    const file = e.target.files?.[0];
                                                    if (file) handleImageUpload(file, 'image');
                                                }}
                                                disabled={uploading}
                                            />
                                        </div>
                                    </div>

                                    {/* Highlights */}
                                    <div className="space-y-2">
                                        <Label>Highlights</Label>
                                        <div className="flex gap-2">
                                            <Input
                                                value={highlightInput}
                                                onChange={(e) => setHighlightInput(e.target.value)}
                                                placeholder="Add highlight..."
                                                onKeyDown={(e) => {
                                                    if (e.key === 'Enter') {
                                                        e.preventDefault();
                                                        addArrayItem('highlights', highlightInput);
                                                    }
                                                }}
                                            />
                                            <Button
                                                type="button"
                                                onClick={() => addArrayItem('highlights', highlightInput)}
                                            >
                                                <Plus className="h-4 w-4" />
                                            </Button>
                                        </div>
                                        <div className="flex flex-wrap gap-2 mt-2">
                                            {formData.highlights.map((item, idx) => (
                                                <Badge key={idx} variant="secondary" className="flex items-center gap-1">
                                                    {item}
                                                    <X
                                                        className="h-3 w-3 cursor-pointer"
                                                        onClick={() => removeArrayItem('highlights', idx)}
                                                    />
                                                </Badge>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Included Items */}
                                    <div className="space-y-2">
                                        <Label>Included</Label>
                                        <div className="flex gap-2">
                                            <Input
                                                value={includedInput}
                                                onChange={(e) => setIncludedInput(e.target.value)}
                                                placeholder="Add included item..."
                                                onKeyDown={(e) => {
                                                    if (e.key === 'Enter') {
                                                        e.preventDefault();
                                                        addArrayItem('included', includedInput);
                                                    }
                                                }}
                                            />
                                            <Button
                                                type="button"
                                                onClick={() => addArrayItem('included', includedInput)}
                                            >
                                                <Plus className="h-4 w-4" />
                                            </Button>
                                        </div>
                                        <div className="flex flex-wrap gap-2 mt-2">
                                            {formData.included.map((item, idx) => (
                                                <Badge key={idx} variant="outline" className="flex items-center gap-1">
                                                    {item}
                                                    <X
                                                        className="h-3 w-3 cursor-pointer"
                                                        onClick={() => removeArrayItem('included', idx)}
                                                    />
                                                </Badge>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Toggles */}
                                    <div className="flex items-center gap-4">
                                        <label className="flex items-center gap-2 cursor-pointer">
                                            <input
                                                type="checkbox"
                                                checked={formData.featured}
                                                onChange={(e) => setFormData(prev => ({ ...prev, featured: e.target.checked }))}
                                                className="rounded"
                                            />
                                            <span className="text-sm">Featured Tour</span>
                                        </label>

                                        <label className="flex items-center gap-2 cursor-pointer">
                                            <input
                                                type="checkbox"
                                                checked={formData.is_active}
                                                onChange={(e) => setFormData(prev => ({ ...prev, is_active: e.target.checked }))}
                                                className="rounded"
                                            />
                                            <span className="text-sm">Active</span>
                                        </label>
                                    </div>

                                    {/* Action Buttons */}
                                    <div className="flex gap-2 pt-4 border-t">
                                        <Button
                                            onClick={handleSave}
                                            className="flex-1 bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-700 hover:to-amber-700"
                                            disabled={uploading}
                                        >
                                            <Save className="h-4 w-4 mr-2" />
                                            {isCreating ? 'Create Tour' : 'Save Changes'}
                                        </Button>
                                        <Button variant="outline" onClick={resetForm}>
                                            Cancel
                                        </Button>
                                    </div>
                                </CardContent>
                            </Card>
                        )}
                    </div>
                </TabsContent>

                {/* Bookings Tab */}
                <TabsContent value="bookings" className="space-y-4">
                    <Card>
                        <CardHeader>
                            <CardTitle>Hill Country Tour Bookings</CardTitle>
                            <CardDescription>Manage customer bookings and reservations</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {filteredBookings.map((booking) => (
                                <div
                                    key={booking.id}
                                    className="border rounded-lg p-4 hover:bg-accent/5 transition-colors"
                                >
                                    <div className="flex justify-between items-start mb-3">
                                        <div>
                                            <h3 className="font-semibold">{booking.tourTitle}</h3>
                                            <p className="text-sm text-muted-foreground">{booking.contactName}</p>
                                        </div>
                                        <Badge
                                            variant={
                                                booking.status === 'confirmed' ? 'default' :
                                                    booking.status === 'pending' ? 'secondary' :
                                                        'destructive'
                                            }
                                        >
                                            {booking.status}
                                        </Badge>
                                    </div>

                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm mb-3">
                                        <div>
                                            <div className="text-muted-foreground">Date</div>
                                            <div className="font-medium flex items-center gap-1">
                                                <Calendar className="h-3 w-3" />
                                                {booking.date}
                                            </div>
                                        </div>
                                        <div>
                                            <div className="text-muted-foreground">Guests</div>
                                            <div className="font-medium flex items-center gap-1">
                                                <Users className="h-3 w-3" />
                                                {booking.guests}
                                            </div>
                                        </div>
                                        <div>
                                            <div className="text-muted-foreground">Contact</div>
                                            <div className="font-medium">{booking.contactEmail}</div>
                                        </div>
                                        <div>
                                            <div className="text-muted-foreground">Total</div>
                                            <div className="font-medium flex items-center gap-1">
                                                <DollarSign className="h-3 w-3" />
                                                ${booking.totalPrice}
                                            </div>
                                        </div>
                                    </div>

                                    {booking.specialRequests && (
                                        <div className="mb-3 p-2 bg-gray-50 rounded text-sm">
                                            <div className="text-muted-foreground font-medium mb-1">Special Requests:</div>
                                            <div>{booking.specialRequests}</div>
                                        </div>
                                    )}

                                    {booking.status === 'pending' && (
                                        <div className="flex gap-2">
                                            <Button
                                                size="sm"
                                                onClick={() => updateBookingStatus(booking.id, 'confirmed')}
                                                className="bg-green-600 hover:bg-green-700"
                                            >
                                                Confirm
                                            </Button>
                                            <Button
                                                size="sm"
                                                variant="destructive"
                                                onClick={() => updateBookingStatus(booking.id, 'cancelled')}
                                            >
                                                Cancel
                                            </Button>
                                        </div>
                                    )}
                                </div>
                            ))}

                            {filteredBookings.length === 0 && (
                                <div className="text-center py-8 text-muted-foreground">
                                    No bookings found
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    );
};

export default CulturalToursManager;
