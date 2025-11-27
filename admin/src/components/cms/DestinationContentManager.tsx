import React, { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/hooks/use-toast';
import {
    Plus, Edit, Trash2, Save, X, MapPin, Image, Upload, Eye, EyeOff,
    Star, Clock, DollarSign, Users, Building, Camera, Utensils, Hotel,
    Sun, Cloud, Search, Globe, Settings, FileText, Compass, Navigation,
    Coffee, Train, ShoppingBag, Heart, Mountain, Waves, TreePine, Bike, Car, Plane, Anchor, Map
} from 'lucide-react';
import {
    collection, getDocs, doc, getDoc, setDoc, updateDoc, deleteDoc,
    query, orderBy, serverTimestamp
} from 'firebase/firestore';
import { db, storage } from '@/lib/firebase';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';

// Types
interface HeroSlide {
    id?: string;
    image: string;
    title: string;
    subtitle: string;
    order?: number;
}

interface Attraction {
    id?: string;
    name: string;
    description: string;
    image: string;
    category: string;
    rating: number;
    duration: string;
    price: string;
    featured?: boolean;
    order?: number;
}

interface Activity {
    id?: string;
    name: string;
    description: string;
    icon: string;
    price: string;
    duration: string;
    popular?: boolean;
    order?: number;
}

interface Restaurant {
    id?: string;
    name: string;
    description: string;
    image: string;
    cuisine: string;
    priceRange: string;
    rating: number;
    address: string;
    phone?: string;
    website?: string;
    featured?: boolean;
}

interface HotelItem {
    id?: string;
    name: string;
    description: string;
    image: string;
    starRating: number;
    priceRange: string;
    amenities: string[];
    address: string;
    phone?: string;
    website?: string;
    featured?: boolean;
}

interface DestinationInfo {
    population: string;
    area: string;
    elevation: string;
    bestTime: string;
    language: string;
    currency: string;
}

interface WeatherInfo {
    temperature: string;
    humidity: string;
    rainfall: string;
    season: string;
    bestMonths?: string[];
}

interface TravelTip {
    id?: string;
    title: string;
    content: string;
    icon?: string;
    category: string;
}

interface DestinationContent {
    id: string;
    name: string;
    slug: string;
    tagline?: string;
    description?: string;
    heroSlides: HeroSlide[];
    attractions: Attraction[];
    activities: Activity[];
    restaurants: Restaurant[];
    hotels: HotelItem[];
    destinationInfo: DestinationInfo;
    weatherInfo: WeatherInfo;
    travelTips: TravelTip[];
    seo: {
        title: string;
        description: string;
        keywords: string[];
    };
    ctaSection?: {
        title: string;
        subtitle: string;
        buttonText: string;
    };
    isPublished: boolean;
    updatedAt?: any;
    createdAt?: any;
}

const COLLECTION_NAME = 'destinations';

// Icon options
const ACTIVITY_ICONS = [
    'Navigation', 'Utensils', 'ShoppingBag', 'Sun', 'Building', 'Camera',
    'Coffee', 'Train', 'Hotel', 'Heart', 'Star', 'Mountain', 'Waves',
    'TreePine', 'Bike', 'Car', 'Plane', 'Anchor', 'Map', 'Compass'
];

const ATTRACTION_CATEGORIES = [
    'Religious Sites', 'Parks & Nature', 'Museums', 'Shopping', 'Monuments',
    'Historical Sites', 'Beaches', 'Adventure', 'Wildlife', 'Cultural', 'Entertainment'
];

const CUISINE_TYPES = [
    'Sri Lankan', 'Indian', 'Chinese', 'Japanese', 'Thai', 'Italian',
    'Continental', 'Seafood', 'Vegetarian', 'Fast Food', 'Cafe', 'Fine Dining', 'Street Food'
];

const TIP_CATEGORIES = [
    'Transportation', 'Safety', 'Culture', 'Money', 'Health', 'Communication', 'Food', 'Shopping'
];

// Default destination content template
const DEFAULT_DESTINATION: Omit<DestinationContent, 'id' | 'name' | 'slug'> = {
    tagline: 'Discover the beauty of this destination',
    description: 'A wonderful destination waiting to be explored.',
    heroSlides: [],
    attractions: [],
    activities: [],
    restaurants: [],
    hotels: [],
    destinationInfo: {
        population: 'Unknown',
        area: 'Unknown',
        elevation: 'Unknown',
        bestTime: 'Year-round',
        language: 'Sinhala, Tamil, English',
        currency: 'Sri Lankan Rupee (LKR)'
    },
    weatherInfo: {
        temperature: '25-30°C',
        humidity: '70-80%',
        rainfall: 'Moderate',
        season: 'Tropical'
    },
    travelTips: [],
    seo: {
        title: '',
        description: '',
        keywords: []
    },
    ctaSection: {
        title: 'Ready to Explore?',
        subtitle: 'Book your perfect experience with our expert guides',
        buttonText: 'Book Now'
    },
    isPublished: false
};

export const DestinationContentManager: React.FC = () => {
    const [destinations, setDestinations] = useState<DestinationContent[]>([]);
    const [selectedDestination, setSelectedDestination] = useState<DestinationContent | null>(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [activeTab, setActiveTab] = useState('hero');
    const [searchQuery, setSearchQuery] = useState('');
    const [isCreating, setIsCreating] = useState(false);
    const [newDestinationName, setNewDestinationName] = useState('');
    const { toast } = useToast();

    // Fetch all destinations
    const fetchDestinations = useCallback(async () => {
        try {
            setLoading(true);
            const q = query(collection(db, COLLECTION_NAME), orderBy('name'));
            const snapshot = await getDocs(q);
            const data = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            })) as DestinationContent[];
            setDestinations(data);
        } catch (error) {
            console.error('Error fetching destinations:', error);
            toast({
                title: "Error",
                description: "Failed to fetch destinations",
                variant: "destructive"
            });
        } finally {
            setLoading(false);
        }
    }, [toast]);

    useEffect(() => {
        fetchDestinations();
    }, [fetchDestinations]);

    // Handle image upload
    const handleImageUpload = async (file: File, folder: string = 'destinations'): Promise<string> => {
        try {
            setUploading(true);
            const timestamp = Date.now();
            const storageRef = ref(storage, `${folder}/${timestamp}_${file.name}`);
            await uploadBytes(storageRef, file);
            const downloadURL = await getDownloadURL(storageRef);
            return downloadURL;
        } catch (error) {
            console.error('Error uploading image:', error);
            toast({
                title: "Error",
                description: "Failed to upload image",
                variant: "destructive"
            });
            throw error;
        } finally {
            setUploading(false);
        }
    };

    // Create new destination
    const handleCreateDestination = async () => {
        if (!newDestinationName.trim()) {
            toast({
                title: "Validation Error",
                description: "Please enter a destination name",
                variant: "destructive"
            });
            return;
        }

        try {
            setSaving(true);
            const slug = newDestinationName.toLowerCase().replace(/\s+/g, '-');
            const docRef = doc(db, COLLECTION_NAME, slug);

            await setDoc(docRef, {
                ...DEFAULT_DESTINATION,
                id: slug,
                name: newDestinationName,
                slug,
                seo: {
                    title: `${newDestinationName} - Sri Lanka | Travel Guide & Tours`,
                    description: `Discover ${newDestinationName}'s top attractions, tours, and travel experiences.`,
                    keywords: [newDestinationName, 'Sri Lanka', 'travel', 'tours']
                },
                createdAt: serverTimestamp(),
                updatedAt: serverTimestamp()
            });

            toast({
                title: "Success",
                description: "Destination created successfully"
            });

            setNewDestinationName('');
            setIsCreating(false);
            fetchDestinations();
        } catch (error) {
            console.error('Error creating destination:', error);
            toast({
                title: "Error",
                description: "Failed to create destination",
                variant: "destructive"
            });
        } finally {
            setSaving(false);
        }
    };

    // Save destination changes
    const handleSaveDestination = async () => {
        if (!selectedDestination) return;

        try {
            setSaving(true);
            const docRef = doc(db, COLLECTION_NAME, selectedDestination.slug);
            await updateDoc(docRef, {
                ...selectedDestination,
                updatedAt: serverTimestamp()
            });

            toast({
                title: "Success",
                description: "Destination updated successfully"
            });
            fetchDestinations();
        } catch (error) {
            console.error('Error saving destination:', error);
            toast({
                title: "Error",
                description: "Failed to save destination",
                variant: "destructive"
            });
        } finally {
            setSaving(false);
        }
    };

    // Delete destination
    const handleDeleteDestination = async (slug: string) => {
        if (!window.confirm('Are you sure you want to delete this destination?')) return;

        try {
            await deleteDoc(doc(db, COLLECTION_NAME, slug));
            toast({
                title: "Success",
                description: "Destination deleted successfully"
            });
            setSelectedDestination(null);
            fetchDestinations();
        } catch (error) {
            console.error('Error deleting destination:', error);
            toast({
                title: "Error",
                description: "Failed to delete destination",
                variant: "destructive"
            });
        }
    };

    // Toggle publish status
    const handleTogglePublish = async () => {
        if (!selectedDestination) return;

        const newStatus = !selectedDestination.isPublished;
        setSelectedDestination({
            ...selectedDestination,
            isPublished: newStatus
        });
    };

    // Update destination field
    const updateField = (field: string, value: any) => {
        if (!selectedDestination) return;
        setSelectedDestination({
            ...selectedDestination,
            [field]: value
        });
    };

    // Hero Slides Management
    const addHeroSlide = () => {
        if (!selectedDestination) return;
        const newSlide: HeroSlide = {
            id: `slide_${Date.now()}`,
            image: '',
            title: '',
            subtitle: '',
            order: selectedDestination.heroSlides.length
        };
        updateField('heroSlides', [...selectedDestination.heroSlides, newSlide]);
    };

    const updateHeroSlide = (index: number, field: string, value: string) => {
        if (!selectedDestination) return;
        const slides = [...selectedDestination.heroSlides];
        slides[index] = { ...slides[index], [field]: value };
        updateField('heroSlides', slides);
    };

    const removeHeroSlide = (index: number) => {
        if (!selectedDestination) return;
        const slides = selectedDestination.heroSlides.filter((_, i) => i !== index);
        updateField('heroSlides', slides);
    };

    // Attractions Management
    const addAttraction = () => {
        if (!selectedDestination) return;
        const newAttraction: Attraction = {
            id: `attr_${Date.now()}`,
            name: '',
            description: '',
            image: '',
            category: 'Cultural',
            rating: 4.5,
            duration: '',
            price: '',
            featured: false
        };
        updateField('attractions', [...selectedDestination.attractions, newAttraction]);
    };

    const updateAttraction = (index: number, field: string, value: any) => {
        if (!selectedDestination) return;
        const attractions = [...selectedDestination.attractions];
        attractions[index] = { ...attractions[index], [field]: value };
        updateField('attractions', attractions);
    };

    const removeAttraction = (index: number) => {
        if (!selectedDestination) return;
        const attractions = selectedDestination.attractions.filter((_, i) => i !== index);
        updateField('attractions', attractions);
    };

    // Activities Management
    const addActivity = () => {
        if (!selectedDestination) return;
        const newActivity: Activity = {
            id: `act_${Date.now()}`,
            name: '',
            description: '',
            icon: 'Navigation',
            price: '',
            duration: '',
            popular: false
        };
        updateField('activities', [...selectedDestination.activities, newActivity]);
    };

    const updateActivity = (index: number, field: string, value: any) => {
        if (!selectedDestination) return;
        const activities = [...selectedDestination.activities];
        activities[index] = { ...activities[index], [field]: value };
        updateField('activities', activities);
    };

    const removeActivity = (index: number) => {
        if (!selectedDestination) return;
        const activities = selectedDestination.activities.filter((_, i) => i !== index);
        updateField('activities', activities);
    };

    // Restaurants Management
    const addRestaurant = () => {
        if (!selectedDestination) return;
        const newRestaurant: Restaurant = {
            id: `rest_${Date.now()}`,
            name: '',
            description: '',
            image: '',
            cuisine: 'Sri Lankan',
            priceRange: '$$',
            rating: 4.0,
            address: '',
            featured: false
        };
        updateField('restaurants', [...selectedDestination.restaurants, newRestaurant]);
    };

    const updateRestaurant = (index: number, field: string, value: any) => {
        if (!selectedDestination) return;
        const restaurants = [...selectedDestination.restaurants];
        restaurants[index] = { ...restaurants[index], [field]: value };
        updateField('restaurants', restaurants);
    };

    const removeRestaurant = (index: number) => {
        if (!selectedDestination) return;
        const restaurants = selectedDestination.restaurants.filter((_, i) => i !== index);
        updateField('restaurants', restaurants);
    };

    // Hotels Management
    const addHotel = () => {
        if (!selectedDestination) return;
        const newHotel: HotelItem = {
            id: `hotel_${Date.now()}`,
            name: '',
            description: '',
            image: '',
            starRating: 4,
            priceRange: '$$$',
            amenities: [],
            address: '',
            featured: false
        };
        updateField('hotels', [...selectedDestination.hotels, newHotel]);
    };

    const updateHotel = (index: number, field: string, value: any) => {
        if (!selectedDestination) return;
        const hotels = [...selectedDestination.hotels];
        hotels[index] = { ...hotels[index], [field]: value };
        updateField('hotels', hotels);
    };

    const removeHotel = (index: number) => {
        if (!selectedDestination) return;
        const hotels = selectedDestination.hotels.filter((_, i) => i !== index);
        updateField('hotels', hotels);
    };

    // Travel Tips Management
    const addTravelTip = () => {
        if (!selectedDestination) return;
        const newTip: TravelTip = {
            id: `tip_${Date.now()}`,
            title: '',
            content: '',
            category: 'Culture'
        };
        updateField('travelTips', [...selectedDestination.travelTips, newTip]);
    };

    const updateTravelTip = (index: number, field: string, value: string) => {
        if (!selectedDestination) return;
        const tips = [...selectedDestination.travelTips];
        tips[index] = { ...tips[index], [field]: value };
        updateField('travelTips', tips);
    };

    const removeTravelTip = (index: number) => {
        if (!selectedDestination) return;
        const tips = selectedDestination.travelTips.filter((_, i) => i !== index);
        updateField('travelTips', tips);
    };

    const filteredDestinations = destinations.filter(dest =>
        dest.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        dest.slug.toLowerCase().includes(searchQuery.toLowerCase())
    );

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-3xl font-bold flex items-center gap-2">
                        <Compass className="h-8 w-8 text-blue-600" />
                        Destination Content Manager
                    </h2>
                    <p className="text-muted-foreground">Manage destination pages content for the website</p>
                </div>
                <Button
                    onClick={() => setIsCreating(true)}
                    className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-teal-600"
                >
                    <Plus className="h-4 w-4" />
                    Add New Destination
                </Button>
            </div>

            {/* Create New Destination Dialog */}
            {isCreating && (
                <Card className="border-2 border-blue-200">
                    <CardHeader>
                        <CardTitle>Create New Destination</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <Label>Destination Name</Label>
                            <Input
                                value={newDestinationName}
                                onChange={(e) => setNewDestinationName(e.target.value)}
                                placeholder="e.g., Colombo, Kandy, Galle..."
                            />
                        </div>
                        <div className="flex gap-2">
                            <Button onClick={handleCreateDestination} disabled={saving}>
                                {saving ? 'Creating...' : 'Create Destination'}
                            </Button>
                            <Button variant="outline" onClick={() => setIsCreating(false)}>
                                Cancel
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                {/* Destinations List */}
                <Card className="lg:col-span-1">
                    <CardHeader>
                        <CardTitle className="text-lg">Destinations</CardTitle>
                        <div className="relative mt-2">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                            <Input
                                placeholder="Search..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="pl-10"
                            />
                        </div>
                    </CardHeader>
                    <CardContent className="space-y-2 max-h-[600px] overflow-y-auto">
                        {filteredDestinations.map((dest) => (
                            <div
                                key={dest.id}
                                onClick={() => setSelectedDestination(dest)}
                                className={`p-3 rounded-lg cursor-pointer transition-colors ${
                                    selectedDestination?.id === dest.id
                                        ? 'bg-blue-100 border-2 border-blue-500'
                                        : 'bg-gray-50 hover:bg-gray-100'
                                }`}
                            >
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <MapPin className="h-4 w-4 text-blue-600" />
                                        <span className="font-medium">{dest.name}</span>
                                    </div>
                                    {dest.isPublished ? (
                                        <Badge className="bg-green-100 text-green-800 text-xs">
                                            <Eye className="h-3 w-3 mr-1" />
                                            Live
                                        </Badge>
                                    ) : (
                                        <Badge variant="secondary" className="text-xs">
                                            <EyeOff className="h-3 w-3 mr-1" />
                                            Draft
                                        </Badge>
                                    )}
                                </div>
                                <div className="text-xs text-gray-500 mt-1">
                                    {dest.attractions?.length || 0} attractions • {dest.activities?.length || 0} activities
                                </div>
                            </div>
                        ))}

                        {filteredDestinations.length === 0 && (
                            <div className="text-center py-8 text-gray-500">
                                No destinations found
                            </div>
                        )}
                    </CardContent>
                </Card>

                {/* Editor Panel */}
                <div className="lg:col-span-3">
                    {selectedDestination ? (
                        <Card>
                            <CardHeader>
                                <div className="flex justify-between items-center">
                                    <div>
                                        <CardTitle className="flex items-center gap-2">
                                            <Globe className="h-5 w-5" />
                                            Editing: {selectedDestination.name}
                                        </CardTitle>
                                        <CardDescription>
                                            Slug: /destinations/{selectedDestination.slug}
                                        </CardDescription>
                                    </div>
                                    <div className="flex items-center gap-4">
                                        <div className="flex items-center gap-2">
                                            <Label htmlFor="publish-switch">Publish</Label>
                                            <Switch
                                                id="publish-switch"
                                                checked={selectedDestination.isPublished}
                                                onCheckedChange={handleTogglePublish}
                                            />
                                        </div>
                                        <Button
                                            onClick={handleSaveDestination}
                                            disabled={saving}
                                            className="bg-gradient-to-r from-blue-600 to-teal-600"
                                        >
                                            <Save className="h-4 w-4 mr-2" />
                                            {saving ? 'Saving...' : 'Save Changes'}
                                        </Button>
                                        <Button
                                            variant="destructive"
                                            size="icon"
                                            onClick={() => handleDeleteDestination(selectedDestination.slug)}
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </Button>
                                    </div>
                                </div>
                            </CardHeader>
                            <CardContent>
                                <Tabs value={activeTab} onValueChange={setActiveTab}>
                                    <TabsList className="grid grid-cols-8 w-full mb-4">
                                        <TabsTrigger value="hero">Hero</TabsTrigger>
                                        <TabsTrigger value="info">Info</TabsTrigger>
                                        <TabsTrigger value="attractions">Attractions</TabsTrigger>
                                        <TabsTrigger value="activities">Activities</TabsTrigger>
                                        <TabsTrigger value="restaurants">Restaurants</TabsTrigger>
                                        <TabsTrigger value="hotels">Hotels</TabsTrigger>
                                        <TabsTrigger value="tips">Tips</TabsTrigger>
                                        <TabsTrigger value="seo">SEO</TabsTrigger>
                                    </TabsList>

                                    {/* Hero Slides Tab */}
                                    <TabsContent value="hero" className="space-y-4">
                                        <div className="flex justify-between items-center">
                                            <h3 className="text-lg font-semibold">Hero Slides</h3>
                                            <Button onClick={addHeroSlide} size="sm">
                                                <Plus className="h-4 w-4 mr-1" />
                                                Add Slide
                                            </Button>
                                        </div>

                                        {/* Basic Info */}
                                        <div className="grid grid-cols-2 gap-4 p-4 bg-gray-50 rounded-lg">
                                            <div className="space-y-2">
                                                <Label>Destination Tagline</Label>
                                                <Input
                                                    value={selectedDestination.tagline || ''}
                                                    onChange={(e) => updateField('tagline', e.target.value)}
                                                    placeholder="A short catchy tagline"
                                                />
                                            </div>
                                            <div className="space-y-2 col-span-2">
                                                <Label>Description</Label>
                                                <Textarea
                                                    value={selectedDestination.description || ''}
                                                    onChange={(e) => updateField('description', e.target.value)}
                                                    placeholder="Brief description of the destination"
                                                    rows={3}
                                                />
                                            </div>
                                        </div>

                                        {/* Hero Slides */}
                                        <div className="space-y-4 max-h-[400px] overflow-y-auto">
                                            {selectedDestination.heroSlides.map((slide, index) => (
                                                <div key={slide.id || index} className="border rounded-lg p-4 space-y-3">
                                                    <div className="flex justify-between items-center">
                                                        <span className="font-medium">Slide {index + 1}</span>
                                                        <Button
                                                            variant="destructive"
                                                            size="sm"
                                                            onClick={() => removeHeroSlide(index)}
                                                        >
                                                            <Trash2 className="h-3 w-3" />
                                                        </Button>
                                                    </div>

                                                    {slide.image && (
                                                        <img
                                                            src={slide.image}
                                                            alt={slide.title}
                                                            className="w-full h-32 object-cover rounded"
                                                        />
                                                    )}

                                                    <div className="space-y-2">
                                                        <Label>Image URL</Label>
                                                        <div className="flex gap-2">
                                                            <Input
                                                                value={slide.image}
                                                                onChange={(e) => updateHeroSlide(index, 'image', e.target.value)}
                                                                placeholder="https://..."
                                                            />
                                                            <input
                                                                type="file"
                                                                accept="image/*"
                                                                className="hidden"
                                                                id={`hero-upload-${index}`}
                                                                onChange={async (e) => {
                                                                    const file = e.target.files?.[0];
                                                                    if (file) {
                                                                        const url = await handleImageUpload(file, `destinations/${selectedDestination.slug}/hero`);
                                                                        updateHeroSlide(index, 'image', url);
                                                                    }
                                                                }}
                                                            />
                                                            <Button
                                                                variant="outline"
                                                                onClick={() => document.getElementById(`hero-upload-${index}`)?.click()}
                                                                disabled={uploading}
                                                            >
                                                                <Upload className="h-4 w-4" />
                                                            </Button>
                                                        </div>
                                                    </div>

                                                    <div className="grid grid-cols-2 gap-4">
                                                        <div className="space-y-2">
                                                            <Label>Title</Label>
                                                            <Input
                                                                value={slide.title}
                                                                onChange={(e) => updateHeroSlide(index, 'title', e.target.value)}
                                                                placeholder="Welcome to..."
                                                            />
                                                        </div>
                                                        <div className="space-y-2">
                                                            <Label>Subtitle</Label>
                                                            <Input
                                                                value={slide.subtitle}
                                                                onChange={(e) => updateHeroSlide(index, 'subtitle', e.target.value)}
                                                                placeholder="Subtitle text"
                                                            />
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}

                                            {selectedDestination.heroSlides.length === 0 && (
                                                <div className="text-center py-8 text-gray-500 border-2 border-dashed rounded-lg">
                                                    No hero slides yet. Click "Add Slide" to create one.
                                                </div>
                                            )}
                                        </div>
                                    </TabsContent>

                                    {/* Info Tab */}
                                    <TabsContent value="info" className="space-y-6">
                                        {/* Destination Info */}
                                        <div>
                                            <h3 className="text-lg font-semibold mb-4">Destination Information</h3>
                                            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                                <div className="space-y-2">
                                                    <Label>Population</Label>
                                                    <Input
                                                        value={selectedDestination.destinationInfo.population}
                                                        onChange={(e) => updateField('destinationInfo', {
                                                            ...selectedDestination.destinationInfo,
                                                            population: e.target.value
                                                        })}
                                                    />
                                                </div>
                                                <div className="space-y-2">
                                                    <Label>Area</Label>
                                                    <Input
                                                        value={selectedDestination.destinationInfo.area}
                                                        onChange={(e) => updateField('destinationInfo', {
                                                            ...selectedDestination.destinationInfo,
                                                            area: e.target.value
                                                        })}
                                                    />
                                                </div>
                                                <div className="space-y-2">
                                                    <Label>Elevation</Label>
                                                    <Input
                                                        value={selectedDestination.destinationInfo.elevation}
                                                        onChange={(e) => updateField('destinationInfo', {
                                                            ...selectedDestination.destinationInfo,
                                                            elevation: e.target.value
                                                        })}
                                                    />
                                                </div>
                                                <div className="space-y-2">
                                                    <Label>Best Time to Visit</Label>
                                                    <Input
                                                        value={selectedDestination.destinationInfo.bestTime}
                                                        onChange={(e) => updateField('destinationInfo', {
                                                            ...selectedDestination.destinationInfo,
                                                            bestTime: e.target.value
                                                        })}
                                                    />
                                                </div>
                                                <div className="space-y-2">
                                                    <Label>Language</Label>
                                                    <Input
                                                        value={selectedDestination.destinationInfo.language}
                                                        onChange={(e) => updateField('destinationInfo', {
                                                            ...selectedDestination.destinationInfo,
                                                            language: e.target.value
                                                        })}
                                                    />
                                                </div>
                                                <div className="space-y-2">
                                                    <Label>Currency</Label>
                                                    <Input
                                                        value={selectedDestination.destinationInfo.currency}
                                                        onChange={(e) => updateField('destinationInfo', {
                                                            ...selectedDestination.destinationInfo,
                                                            currency: e.target.value
                                                        })}
                                                    />
                                                </div>
                                            </div>
                                        </div>

                                        {/* Weather Info */}
                                        <div>
                                            <h3 className="text-lg font-semibold mb-4">Weather Information</h3>
                                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                                <div className="space-y-2">
                                                    <Label>Temperature</Label>
                                                    <Input
                                                        value={selectedDestination.weatherInfo.temperature}
                                                        onChange={(e) => updateField('weatherInfo', {
                                                            ...selectedDestination.weatherInfo,
                                                            temperature: e.target.value
                                                        })}
                                                    />
                                                </div>
                                                <div className="space-y-2">
                                                    <Label>Humidity</Label>
                                                    <Input
                                                        value={selectedDestination.weatherInfo.humidity}
                                                        onChange={(e) => updateField('weatherInfo', {
                                                            ...selectedDestination.weatherInfo,
                                                            humidity: e.target.value
                                                        })}
                                                    />
                                                </div>
                                                <div className="space-y-2">
                                                    <Label>Rainfall</Label>
                                                    <Input
                                                        value={selectedDestination.weatherInfo.rainfall}
                                                        onChange={(e) => updateField('weatherInfo', {
                                                            ...selectedDestination.weatherInfo,
                                                            rainfall: e.target.value
                                                        })}
                                                    />
                                                </div>
                                                <div className="space-y-2">
                                                    <Label>Season</Label>
                                                    <Input
                                                        value={selectedDestination.weatherInfo.season}
                                                        onChange={(e) => updateField('weatherInfo', {
                                                            ...selectedDestination.weatherInfo,
                                                            season: e.target.value
                                                        })}
                                                    />
                                                </div>
                                            </div>
                                        </div>

                                        {/* CTA Section */}
                                        <div>
                                            <h3 className="text-lg font-semibold mb-4">Call-to-Action Section</h3>
                                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                                <div className="space-y-2">
                                                    <Label>CTA Title</Label>
                                                    <Input
                                                        value={selectedDestination.ctaSection?.title || ''}
                                                        onChange={(e) => updateField('ctaSection', {
                                                            ...selectedDestination.ctaSection,
                                                            title: e.target.value
                                                        })}
                                                    />
                                                </div>
                                                <div className="space-y-2">
                                                    <Label>CTA Subtitle</Label>
                                                    <Input
                                                        value={selectedDestination.ctaSection?.subtitle || ''}
                                                        onChange={(e) => updateField('ctaSection', {
                                                            ...selectedDestination.ctaSection,
                                                            subtitle: e.target.value
                                                        })}
                                                    />
                                                </div>
                                                <div className="space-y-2">
                                                    <Label>Button Text</Label>
                                                    <Input
                                                        value={selectedDestination.ctaSection?.buttonText || ''}
                                                        onChange={(e) => updateField('ctaSection', {
                                                            ...selectedDestination.ctaSection,
                                                            buttonText: e.target.value
                                                        })}
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    </TabsContent>

                                    {/* Attractions Tab */}
                                    <TabsContent value="attractions" className="space-y-4">
                                        <div className="flex justify-between items-center">
                                            <h3 className="text-lg font-semibold">Attractions ({selectedDestination.attractions.length})</h3>
                                            <Button onClick={addAttraction} size="sm">
                                                <Plus className="h-4 w-4 mr-1" />
                                                Add Attraction
                                            </Button>
                                        </div>

                                        <div className="space-y-4 max-h-[500px] overflow-y-auto">
                                            {selectedDestination.attractions.map((attraction, index) => (
                                                <div key={attraction.id || index} className="border rounded-lg p-4 space-y-3">
                                                    <div className="flex justify-between items-center">
                                                        <span className="font-medium">{attraction.name || `Attraction ${index + 1}`}</span>
                                                        <div className="flex gap-2">
                                                            <Button
                                                                variant={attraction.featured ? "default" : "outline"}
                                                                size="sm"
                                                                onClick={() => updateAttraction(index, 'featured', !attraction.featured)}
                                                            >
                                                                <Star className={`h-3 w-3 ${attraction.featured ? 'fill-white' : ''}`} />
                                                            </Button>
                                                            <Button
                                                                variant="destructive"
                                                                size="sm"
                                                                onClick={() => removeAttraction(index)}
                                                            >
                                                                <Trash2 className="h-3 w-3" />
                                                            </Button>
                                                        </div>
                                                    </div>

                                                    <div className="grid grid-cols-2 gap-4">
                                                        <div className="space-y-2">
                                                            <Label>Name</Label>
                                                            <Input
                                                                value={attraction.name}
                                                                onChange={(e) => updateAttraction(index, 'name', e.target.value)}
                                                            />
                                                        </div>
                                                        <div className="space-y-2">
                                                            <Label>Category</Label>
                                                            <Select
                                                                value={attraction.category}
                                                                onValueChange={(value) => updateAttraction(index, 'category', value)}
                                                            >
                                                                <SelectTrigger>
                                                                    <SelectValue />
                                                                </SelectTrigger>
                                                                <SelectContent>
                                                                    {ATTRACTION_CATEGORIES.map(cat => (
                                                                        <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                                                                    ))}
                                                                </SelectContent>
                                                            </Select>
                                                        </div>
                                                    </div>

                                                    <div className="space-y-2">
                                                        <Label>Description</Label>
                                                        <Textarea
                                                            value={attraction.description}
                                                            onChange={(e) => updateAttraction(index, 'description', e.target.value)}
                                                            rows={2}
                                                        />
                                                    </div>

                                                    <div className="space-y-2">
                                                        <Label>Image URL</Label>
                                                        <div className="flex gap-2">
                                                            <Input
                                                                value={attraction.image}
                                                                onChange={(e) => updateAttraction(index, 'image', e.target.value)}
                                                            />
                                                            <input
                                                                type="file"
                                                                accept="image/*"
                                                                className="hidden"
                                                                id={`attr-upload-${index}`}
                                                                onChange={async (e) => {
                                                                    const file = e.target.files?.[0];
                                                                    if (file) {
                                                                        const url = await handleImageUpload(file, `destinations/${selectedDestination.slug}/attractions`);
                                                                        updateAttraction(index, 'image', url);
                                                                    }
                                                                }}
                                                            />
                                                            <Button
                                                                variant="outline"
                                                                onClick={() => document.getElementById(`attr-upload-${index}`)?.click()}
                                                            >
                                                                <Upload className="h-4 w-4" />
                                                            </Button>
                                                        </div>
                                                    </div>

                                                    <div className="grid grid-cols-3 gap-4">
                                                        <div className="space-y-2">
                                                            <Label>Rating</Label>
                                                            <Input
                                                                type="number"
                                                                step="0.1"
                                                                min="0"
                                                                max="5"
                                                                value={attraction.rating}
                                                                onChange={(e) => updateAttraction(index, 'rating', parseFloat(e.target.value))}
                                                            />
                                                        </div>
                                                        <div className="space-y-2">
                                                            <Label>Duration</Label>
                                                            <Input
                                                                value={attraction.duration}
                                                                onChange={(e) => updateAttraction(index, 'duration', e.target.value)}
                                                                placeholder="e.g., 2-3 hours"
                                                            />
                                                        </div>
                                                        <div className="space-y-2">
                                                            <Label>Price</Label>
                                                            <Input
                                                                value={attraction.price}
                                                                onChange={(e) => updateAttraction(index, 'price', e.target.value)}
                                                                placeholder="e.g., $5 or Free"
                                                            />
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}

                                            {selectedDestination.attractions.length === 0 && (
                                                <div className="text-center py-8 text-gray-500 border-2 border-dashed rounded-lg">
                                                    No attractions yet. Click "Add Attraction" to create one.
                                                </div>
                                            )}
                                        </div>
                                    </TabsContent>

                                    {/* Activities Tab */}
                                    <TabsContent value="activities" className="space-y-4">
                                        <div className="flex justify-between items-center">
                                            <h3 className="text-lg font-semibold">Activities ({selectedDestination.activities.length})</h3>
                                            <Button onClick={addActivity} size="sm">
                                                <Plus className="h-4 w-4 mr-1" />
                                                Add Activity
                                            </Button>
                                        </div>

                                        <div className="space-y-4 max-h-[500px] overflow-y-auto">
                                            {selectedDestination.activities.map((activity, index) => (
                                                <div key={activity.id || index} className="border rounded-lg p-4 space-y-3">
                                                    <div className="flex justify-between items-center">
                                                        <span className="font-medium">{activity.name || `Activity ${index + 1}`}</span>
                                                        <div className="flex gap-2">
                                                            <Button
                                                                variant={activity.popular ? "default" : "outline"}
                                                                size="sm"
                                                                onClick={() => updateActivity(index, 'popular', !activity.popular)}
                                                            >
                                                                <Heart className={`h-3 w-3 ${activity.popular ? 'fill-white' : ''}`} />
                                                            </Button>
                                                            <Button
                                                                variant="destructive"
                                                                size="sm"
                                                                onClick={() => removeActivity(index)}
                                                            >
                                                                <Trash2 className="h-3 w-3" />
                                                            </Button>
                                                        </div>
                                                    </div>

                                                    <div className="grid grid-cols-2 gap-4">
                                                        <div className="space-y-2">
                                                            <Label>Name</Label>
                                                            <Input
                                                                value={activity.name}
                                                                onChange={(e) => updateActivity(index, 'name', e.target.value)}
                                                            />
                                                        </div>
                                                        <div className="space-y-2">
                                                            <Label>Icon</Label>
                                                            <Select
                                                                value={activity.icon}
                                                                onValueChange={(value) => updateActivity(index, 'icon', value)}
                                                            >
                                                                <SelectTrigger>
                                                                    <SelectValue />
                                                                </SelectTrigger>
                                                                <SelectContent>
                                                                    {ACTIVITY_ICONS.map(icon => (
                                                                        <SelectItem key={icon} value={icon}>{icon}</SelectItem>
                                                                    ))}
                                                                </SelectContent>
                                                            </Select>
                                                        </div>
                                                    </div>

                                                    <div className="space-y-2">
                                                        <Label>Description</Label>
                                                        <Textarea
                                                            value={activity.description}
                                                            onChange={(e) => updateActivity(index, 'description', e.target.value)}
                                                            rows={2}
                                                        />
                                                    </div>

                                                    <div className="grid grid-cols-2 gap-4">
                                                        <div className="space-y-2">
                                                            <Label>Price</Label>
                                                            <Input
                                                                value={activity.price}
                                                                onChange={(e) => updateActivity(index, 'price', e.target.value)}
                                                                placeholder="e.g., From $35"
                                                            />
                                                        </div>
                                                        <div className="space-y-2">
                                                            <Label>Duration</Label>
                                                            <Input
                                                                value={activity.duration}
                                                                onChange={(e) => updateActivity(index, 'duration', e.target.value)}
                                                                placeholder="e.g., Full Day"
                                                            />
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}

                                            {selectedDestination.activities.length === 0 && (
                                                <div className="text-center py-8 text-gray-500 border-2 border-dashed rounded-lg">
                                                    No activities yet. Click "Add Activity" to create one.
                                                </div>
                                            )}
                                        </div>
                                    </TabsContent>

                                    {/* Restaurants Tab */}
                                    <TabsContent value="restaurants" className="space-y-4">
                                        <div className="flex justify-between items-center">
                                            <h3 className="text-lg font-semibold">Restaurants ({selectedDestination.restaurants.length})</h3>
                                            <Button onClick={addRestaurant} size="sm">
                                                <Plus className="h-4 w-4 mr-1" />
                                                Add Restaurant
                                            </Button>
                                        </div>

                                        <div className="space-y-4 max-h-[500px] overflow-y-auto">
                                            {selectedDestination.restaurants.map((restaurant, index) => (
                                                <div key={restaurant.id || index} className="border rounded-lg p-4 space-y-3">
                                                    <div className="flex justify-between items-center">
                                                        <span className="font-medium">{restaurant.name || `Restaurant ${index + 1}`}</span>
                                                        <div className="flex gap-2">
                                                            <Button
                                                                variant={restaurant.featured ? "default" : "outline"}
                                                                size="sm"
                                                                onClick={() => updateRestaurant(index, 'featured', !restaurant.featured)}
                                                            >
                                                                <Star className={`h-3 w-3 ${restaurant.featured ? 'fill-white' : ''}`} />
                                                            </Button>
                                                            <Button
                                                                variant="destructive"
                                                                size="sm"
                                                                onClick={() => removeRestaurant(index)}
                                                            >
                                                                <Trash2 className="h-3 w-3" />
                                                            </Button>
                                                        </div>
                                                    </div>

                                                    <div className="grid grid-cols-2 gap-4">
                                                        <div className="space-y-2">
                                                            <Label>Name</Label>
                                                            <Input
                                                                value={restaurant.name}
                                                                onChange={(e) => updateRestaurant(index, 'name', e.target.value)}
                                                            />
                                                        </div>
                                                        <div className="space-y-2">
                                                            <Label>Cuisine</Label>
                                                            <Select
                                                                value={restaurant.cuisine}
                                                                onValueChange={(value) => updateRestaurant(index, 'cuisine', value)}
                                                            >
                                                                <SelectTrigger>
                                                                    <SelectValue />
                                                                </SelectTrigger>
                                                                <SelectContent>
                                                                    {CUISINE_TYPES.map(type => (
                                                                        <SelectItem key={type} value={type}>{type}</SelectItem>
                                                                    ))}
                                                                </SelectContent>
                                                            </Select>
                                                        </div>
                                                    </div>

                                                    <div className="space-y-2">
                                                        <Label>Description</Label>
                                                        <Textarea
                                                            value={restaurant.description}
                                                            onChange={(e) => updateRestaurant(index, 'description', e.target.value)}
                                                            rows={2}
                                                        />
                                                    </div>

                                                    <div className="space-y-2">
                                                        <Label>Image URL</Label>
                                                        <div className="flex gap-2">
                                                            <Input
                                                                value={restaurant.image}
                                                                onChange={(e) => updateRestaurant(index, 'image', e.target.value)}
                                                            />
                                                            <input
                                                                type="file"
                                                                accept="image/*"
                                                                className="hidden"
                                                                id={`rest-upload-${index}`}
                                                                onChange={async (e) => {
                                                                    const file = e.target.files?.[0];
                                                                    if (file) {
                                                                        const url = await handleImageUpload(file, `destinations/${selectedDestination.slug}/restaurants`);
                                                                        updateRestaurant(index, 'image', url);
                                                                    }
                                                                }}
                                                            />
                                                            <Button
                                                                variant="outline"
                                                                onClick={() => document.getElementById(`rest-upload-${index}`)?.click()}
                                                            >
                                                                <Upload className="h-4 w-4" />
                                                            </Button>
                                                        </div>
                                                    </div>

                                                    <div className="grid grid-cols-4 gap-4">
                                                        <div className="space-y-2">
                                                            <Label>Rating</Label>
                                                            <Input
                                                                type="number"
                                                                step="0.1"
                                                                min="0"
                                                                max="5"
                                                                value={restaurant.rating}
                                                                onChange={(e) => updateRestaurant(index, 'rating', parseFloat(e.target.value))}
                                                            />
                                                        </div>
                                                        <div className="space-y-2">
                                                            <Label>Price Range</Label>
                                                            <Select
                                                                value={restaurant.priceRange}
                                                                onValueChange={(value) => updateRestaurant(index, 'priceRange', value)}
                                                            >
                                                                <SelectTrigger>
                                                                    <SelectValue />
                                                                </SelectTrigger>
                                                                <SelectContent>
                                                                    <SelectItem value="$">$ - Budget</SelectItem>
                                                                    <SelectItem value="$$">$$ - Mid-range</SelectItem>
                                                                    <SelectItem value="$$$">$$$ - Upscale</SelectItem>
                                                                    <SelectItem value="$$$$">$$$$ - Fine Dining</SelectItem>
                                                                </SelectContent>
                                                            </Select>
                                                        </div>
                                                        <div className="space-y-2 col-span-2">
                                                            <Label>Address</Label>
                                                            <Input
                                                                value={restaurant.address}
                                                                onChange={(e) => updateRestaurant(index, 'address', e.target.value)}
                                                            />
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}

                                            {selectedDestination.restaurants.length === 0 && (
                                                <div className="text-center py-8 text-gray-500 border-2 border-dashed rounded-lg">
                                                    No restaurants yet. Click "Add Restaurant" to create one.
                                                </div>
                                            )}
                                        </div>
                                    </TabsContent>

                                    {/* Hotels Tab */}
                                    <TabsContent value="hotels" className="space-y-4">
                                        <div className="flex justify-between items-center">
                                            <h3 className="text-lg font-semibold">Hotels ({selectedDestination.hotels.length})</h3>
                                            <Button onClick={addHotel} size="sm">
                                                <Plus className="h-4 w-4 mr-1" />
                                                Add Hotel
                                            </Button>
                                        </div>

                                        <div className="space-y-4 max-h-[500px] overflow-y-auto">
                                            {selectedDestination.hotels.map((hotel, index) => (
                                                <div key={hotel.id || index} className="border rounded-lg p-4 space-y-3">
                                                    <div className="flex justify-between items-center">
                                                        <span className="font-medium">{hotel.name || `Hotel ${index + 1}`}</span>
                                                        <div className="flex gap-2">
                                                            <Button
                                                                variant={hotel.featured ? "default" : "outline"}
                                                                size="sm"
                                                                onClick={() => updateHotel(index, 'featured', !hotel.featured)}
                                                            >
                                                                <Star className={`h-3 w-3 ${hotel.featured ? 'fill-white' : ''}`} />
                                                            </Button>
                                                            <Button
                                                                variant="destructive"
                                                                size="sm"
                                                                onClick={() => removeHotel(index)}
                                                            >
                                                                <Trash2 className="h-3 w-3" />
                                                            </Button>
                                                        </div>
                                                    </div>

                                                    <div className="grid grid-cols-2 gap-4">
                                                        <div className="space-y-2">
                                                            <Label>Name</Label>
                                                            <Input
                                                                value={hotel.name}
                                                                onChange={(e) => updateHotel(index, 'name', e.target.value)}
                                                            />
                                                        </div>
                                                        <div className="space-y-2">
                                                            <Label>Star Rating</Label>
                                                            <Select
                                                                value={String(hotel.starRating)}
                                                                onValueChange={(value) => updateHotel(index, 'starRating', parseInt(value))}
                                                            >
                                                                <SelectTrigger>
                                                                    <SelectValue />
                                                                </SelectTrigger>
                                                                <SelectContent>
                                                                    {[1, 2, 3, 4, 5].map(star => (
                                                                        <SelectItem key={star} value={String(star)}>{star} Star</SelectItem>
                                                                    ))}
                                                                </SelectContent>
                                                            </Select>
                                                        </div>
                                                    </div>

                                                    <div className="space-y-2">
                                                        <Label>Description</Label>
                                                        <Textarea
                                                            value={hotel.description}
                                                            onChange={(e) => updateHotel(index, 'description', e.target.value)}
                                                            rows={2}
                                                        />
                                                    </div>

                                                    <div className="space-y-2">
                                                        <Label>Image URL</Label>
                                                        <div className="flex gap-2">
                                                            <Input
                                                                value={hotel.image}
                                                                onChange={(e) => updateHotel(index, 'image', e.target.value)}
                                                            />
                                                            <input
                                                                type="file"
                                                                accept="image/*"
                                                                className="hidden"
                                                                id={`hotel-upload-${index}`}
                                                                onChange={async (e) => {
                                                                    const file = e.target.files?.[0];
                                                                    if (file) {
                                                                        const url = await handleImageUpload(file, `destinations/${selectedDestination.slug}/hotels`);
                                                                        updateHotel(index, 'image', url);
                                                                    }
                                                                }}
                                                            />
                                                            <Button
                                                                variant="outline"
                                                                onClick={() => document.getElementById(`hotel-upload-${index}`)?.click()}
                                                            >
                                                                <Upload className="h-4 w-4" />
                                                            </Button>
                                                        </div>
                                                    </div>

                                                    <div className="grid grid-cols-2 gap-4">
                                                        <div className="space-y-2">
                                                            <Label>Price Range</Label>
                                                            <Select
                                                                value={hotel.priceRange}
                                                                onValueChange={(value) => updateHotel(index, 'priceRange', value)}
                                                            >
                                                                <SelectTrigger>
                                                                    <SelectValue />
                                                                </SelectTrigger>
                                                                <SelectContent>
                                                                    <SelectItem value="$">$ - Budget</SelectItem>
                                                                    <SelectItem value="$$">$$ - Mid-range</SelectItem>
                                                                    <SelectItem value="$$$">$$$ - Upscale</SelectItem>
                                                                    <SelectItem value="$$$$">$$$$ - Luxury</SelectItem>
                                                                </SelectContent>
                                                            </Select>
                                                        </div>
                                                        <div className="space-y-2">
                                                            <Label>Address</Label>
                                                            <Input
                                                                value={hotel.address}
                                                                onChange={(e) => updateHotel(index, 'address', e.target.value)}
                                                            />
                                                        </div>
                                                    </div>

                                                    <div className="space-y-2">
                                                        <Label>Amenities (comma-separated)</Label>
                                                        <Input
                                                            value={hotel.amenities?.join(', ') || ''}
                                                            onChange={(e) => updateHotel(index, 'amenities', e.target.value.split(',').map(s => s.trim()).filter(Boolean))}
                                                            placeholder="Pool, Spa, WiFi, Restaurant..."
                                                        />
                                                    </div>
                                                </div>
                                            ))}

                                            {selectedDestination.hotels.length === 0 && (
                                                <div className="text-center py-8 text-gray-500 border-2 border-dashed rounded-lg">
                                                    No hotels yet. Click "Add Hotel" to create one.
                                                </div>
                                            )}
                                        </div>
                                    </TabsContent>

                                    {/* Travel Tips Tab */}
                                    <TabsContent value="tips" className="space-y-4">
                                        <div className="flex justify-between items-center">
                                            <h3 className="text-lg font-semibold">Travel Tips ({selectedDestination.travelTips.length})</h3>
                                            <Button onClick={addTravelTip} size="sm">
                                                <Plus className="h-4 w-4 mr-1" />
                                                Add Tip
                                            </Button>
                                        </div>

                                        <div className="space-y-4 max-h-[500px] overflow-y-auto">
                                            {selectedDestination.travelTips.map((tip, index) => (
                                                <div key={tip.id || index} className="border rounded-lg p-4 space-y-3">
                                                    <div className="flex justify-between items-center">
                                                        <span className="font-medium">{tip.title || `Tip ${index + 1}`}</span>
                                                        <Button
                                                            variant="destructive"
                                                            size="sm"
                                                            onClick={() => removeTravelTip(index)}
                                                        >
                                                            <Trash2 className="h-3 w-3" />
                                                        </Button>
                                                    </div>

                                                    <div className="grid grid-cols-2 gap-4">
                                                        <div className="space-y-2">
                                                            <Label>Title</Label>
                                                            <Input
                                                                value={tip.title}
                                                                onChange={(e) => updateTravelTip(index, 'title', e.target.value)}
                                                            />
                                                        </div>
                                                        <div className="space-y-2">
                                                            <Label>Category</Label>
                                                            <Select
                                                                value={tip.category}
                                                                onValueChange={(value) => updateTravelTip(index, 'category', value)}
                                                            >
                                                                <SelectTrigger>
                                                                    <SelectValue />
                                                                </SelectTrigger>
                                                                <SelectContent>
                                                                    {TIP_CATEGORIES.map(cat => (
                                                                        <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                                                                    ))}
                                                                </SelectContent>
                                                            </Select>
                                                        </div>
                                                    </div>

                                                    <div className="space-y-2">
                                                        <Label>Content</Label>
                                                        <Textarea
                                                            value={tip.content}
                                                            onChange={(e) => updateTravelTip(index, 'content', e.target.value)}
                                                            rows={3}
                                                        />
                                                    </div>
                                                </div>
                                            ))}

                                            {selectedDestination.travelTips.length === 0 && (
                                                <div className="text-center py-8 text-gray-500 border-2 border-dashed rounded-lg">
                                                    No travel tips yet. Click "Add Tip" to create one.
                                                </div>
                                            )}
                                        </div>
                                    </TabsContent>

                                    {/* SEO Tab */}
                                    <TabsContent value="seo" className="space-y-4">
                                        <h3 className="text-lg font-semibold">SEO Settings</h3>

                                        <div className="space-y-4">
                                            <div className="space-y-2">
                                                <Label>Page Title</Label>
                                                <Input
                                                    value={selectedDestination.seo.title}
                                                    onChange={(e) => updateField('seo', {
                                                        ...selectedDestination.seo,
                                                        title: e.target.value
                                                    })}
                                                    placeholder="e.g., Colombo - Sri Lanka's Vibrant Capital | Travel Guide"
                                                />
                                                <p className="text-xs text-gray-500">{selectedDestination.seo.title.length}/60 characters</p>
                                            </div>

                                            <div className="space-y-2">
                                                <Label>Meta Description</Label>
                                                <Textarea
                                                    value={selectedDestination.seo.description}
                                                    onChange={(e) => updateField('seo', {
                                                        ...selectedDestination.seo,
                                                        description: e.target.value
                                                    })}
                                                    placeholder="A compelling description for search results..."
                                                    rows={3}
                                                />
                                                <p className="text-xs text-gray-500">{selectedDestination.seo.description.length}/160 characters</p>
                                            </div>

                                            <div className="space-y-2">
                                                <Label>Keywords (comma-separated)</Label>
                                                <Textarea
                                                    value={selectedDestination.seo.keywords.join(', ')}
                                                    onChange={(e) => updateField('seo', {
                                                        ...selectedDestination.seo,
                                                        keywords: e.target.value.split(',').map(k => k.trim()).filter(Boolean)
                                                    })}
                                                    placeholder="colombo, sri lanka travel, tours, attractions..."
                                                    rows={2}
                                                />
                                            </div>

                                            {/* Preview */}
                                            <div className="p-4 bg-gray-50 rounded-lg">
                                                <h4 className="font-medium mb-2">Search Result Preview</h4>
                                                <div className="border rounded p-3 bg-white">
                                                    <p className="text-blue-600 text-lg hover:underline cursor-pointer">
                                                        {selectedDestination.seo.title || `${selectedDestination.name} - Travel Guide`}
                                                    </p>
                                                    <p className="text-green-700 text-sm">
                                                        rechargetravels.com/destinations/{selectedDestination.slug}
                                                    </p>
                                                    <p className="text-gray-600 text-sm mt-1">
                                                        {selectedDestination.seo.description || selectedDestination.description || 'No description set'}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    </TabsContent>
                                </Tabs>
                            </CardContent>
                        </Card>
                    ) : (
                        <Card className="h-full flex items-center justify-center">
                            <CardContent className="text-center py-12">
                                <Compass className="h-16 w-16 mx-auto mb-4 text-gray-300" />
                                <h3 className="text-xl font-semibold text-gray-700 mb-2">Select a Destination</h3>
                                <p className="text-gray-500">Choose a destination from the list to edit its content</p>
                            </CardContent>
                        </Card>
                    )}
                </div>
            </div>
        </div>
    );
};

export default DestinationContentManager;
