import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { useNavigate } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
    Mountain, Clock, Users, Star, Calendar, MapPin, Heart, Share2,
    Filter, Search, Play, X, Check, Award, Binoculars, Coffee, Train,
    Crown, Home, Leaf, TrendingUp, MessageCircle, Shield, AlertTriangle, Car
} from 'lucide-react';
import { collection, getDocs, query, where, orderBy, addDoc, updateDoc, doc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

interface NationalParksTour {
    id: string;
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
    estateType?: string;
    altitude?: string;
    featured?: boolean;
    videoUrl?: string;
    gallery?: string[];
    bestSeason?: string;
    startLocation?: string;
    transportNote?: string;
    importantInfo?: string[];
}

interface Review {
    id: string;
    tourId: string;
    userName: string;
    userAvatar?: string;
    rating: number;
    comment: string;
    date: string;
    helpful: number;
}

interface Booking {
    tourId: string;
    tourTitle: string;
    date: string;
    guests: number;
    specialRequests?: string;
    contactName: string;
    contactEmail: string;
    contactPhone: string;
}

const NationalParksToursNew = () => {
    const [tours, setTours] = useState<NationalParksTour[]>([]);
    const [filteredTours, setFilteredTours] = useState<NationalParksTour[]>([]);
    const [reviews, setReviews] = useState<Review[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedCategory, setSelectedCategory] = useState('all');
    const [searchQuery, setSearchQuery] = useState('');
    const [priceFilter, setPriceFilter] = useState('all');
    const [selectedTour, setSelectedTour] = useState<NationalParksTour | null>(null);
    const [bookingDialogOpen, setBookingDialogOpen] = useState(false);
    const [wishlist, setWishlist] = useState<string[]>([]);

    const { user } = useAuth();
    const { toast } = useToast();
    const navigate = useNavigate();

    useEffect(() => {
        fetchTours();
        fetchReviews();
    }, []);

    useEffect(() => {
        filterTours();
    }, [tours, selectedCategory, searchQuery, priceFilter]);

    const fetchTours = async () => {
        try {
            setLoading(true);
            const toursRef = collection(db, 'nationalparks_tours');
            const q = query(toursRef, where('is_active', '==', true), orderBy('featured', 'desc'));
            const snapshot = await getDocs(q);

            const toursData: NationalParksTour[] = snapshot.docs.map(doc => {
                const raw = doc.data() as NationalParksTour;
                return {
                    id: doc.id,
                    ...raw,
                    startLocation: raw.startLocation || "Colombo / Hotel Pickup",
                    transportNote: raw.transportNote || "We provide pickup from your hotel in Yala, Tissamaharama, or Kataragama. Colombo transfers available on request.",
                    importantInfo: raw.importantInfo && raw.importantInfo.length > 0
                        ? raw.importantInfo
                        : [
                            "Valid ID/Passport required for park entry",
                            "Wear neutral colored clothing (green, beige, brown)",
                            "Do not feed wild animals"
                        ],
                };
            });

            if (toursData.length === 0) {
                setTours(defaultNationalParksTours);
            } else {
                setTours(toursData);
            }
        } catch (error) {
            console.error('Error fetching tours:', error);
            setTours(defaultNationalParksTours);
            toast({
                title: "Info",
                description: "Using default tour data",
            });
        } finally {
            setLoading(false);
        }
    };

    const fetchReviews = async () => {
        try {
            const reviewsRef = collection(db, 'nationalparks_reviews');
            const q = query(reviewsRef, orderBy('date', 'desc'));
            const snapshot = await getDocs(q);

            const reviewsData: Review[] = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data(),
            } as Review));

            setReviews(reviewsData);
        } catch (error) {
            console.error('Error fetching reviews:', error);
        }
    };

    const filterTours = () => {
        let filtered = [...tours];

        if (selectedCategory !== 'all') {
            filtered = filtered.filter(tour => tour.category === selectedCategory);
        }

        if (searchQuery) {
            filtered = filtered.filter(tour =>
                tour.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                tour.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                tour.location.toLowerCase().includes(searchQuery.toLowerCase())
            );
        }

        if (priceFilter !== 'all') {
            switch (priceFilter) {
                case 'budget':
                    filtered = filtered.filter(tour => tour.price < 200);
                    break;
                case 'mid':
                    filtered = filtered.filter(tour => tour.price >= 200 && tour.price < 500);
                    break;
                case 'premium':
                    filtered = filtered.filter(tour => tour.price >= 500);
                    break;
            }
        }

        setFilteredTours(filtered);
    };

    const handleBooking = async (bookingData: Booking) => {
        try {
            if (!user) {
                toast({
                    title: "Login Required",
                    description: "Please login to book a hill country experience",
                    variant: "destructive",
                });
                navigate('/login');
                return;
            }

            const bookingsRef = collection(db, 'nationalparks_bookings');
            await addDoc(bookingsRef, {
                ...bookingData,
                userId: user.uid,
                status: 'pending',
                createdAt: new Date().toISOString(),
            });

            toast({
                title: "Booking Submitted!",
                description: "Your hill country experience has been booked. We'll contact you soon.",
            });

            setBookingDialogOpen(false);
        } catch (error) {
            console.error('Error creating booking:', error);
            toast({
                title: "Error",
                description: "Failed to submit booking. Please try again.",
                variant: "destructive",
            });
        }
    };

    const toggleWishlist = (tourId: string) => {
        setWishlist(prev =>
            prev.includes(tourId)
                ? prev.filter(id => id !== tourId)
                : [...prev, tourId]
        );

        toast({
            title: wishlist.includes(tourId) ? "Removed from wishlist" : "Added to wishlist",
        });
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-green-50 via-amber-50 to-green-50 flex items-center justify-center">
                <div className="text-center">
                    <Mountain className="w-16 h-16 mx-auto mb-4 text-green-600 animate-bounce" />
                    <p className="text-xl font-semibold text-gray-700">Loading National Park Adventures...</p>
                </div>
            </div>
        );
    }

    return (
        <>
            <Helmet>
                <title>National Parks & Wildlife Safaris Sri Lanka | Recharge Travels</title>
                <meta name="description" content="Experience the thrill of Sri Lanka's national parks. Yala leopard safaris, Udawalawe elephant gatherings, and Wilpattu wilderness expeditions." />
                <meta name="keywords" content="Sri Lanka safari, Yala National Park, Wilpattu, Udawalawe, leopard safari, elephant safari, wildlife tours" />
                <meta property="og:title" content="National Parks & Wildlife Safaris Sri Lanka - Recharge Travels" />
                <meta property="og:description" content="Premium wildlife safaris in Sri Lanka's top national parks" />
                <meta property="og:type" content="website" />
            </Helmet>

            <div className="min-h-screen bg-gradient-to-br from-green-50 via-amber-50 to-green-50">
                <Header />

                {/* Hero Section */}
                <section className="relative h-[90vh] flex items-center justify-center overflow-hidden">
                    <div
                        className="absolute inset-0 bg-cover bg-center transform scale-105"
                        style={{
                            backgroundImage: `url('https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&w=2070&q=80')`,
                        }}
                    >
                        <div className="absolute inset-0 bg-gradient-to-b from-green-900/70 via-green-800/60 to-amber-900/80" />
                    </div>

                    <div className="relative z-10 text-center text-white px-4 max-w-5xl mx-auto">
                        <div className="mb-6 flex justify-center gap-2 animate-fade-in">
                            <Badge className="bg-amber-500/90 text-white px-4 py-2 text-sm backdrop-blur-sm">
                                <Award className="w-4 h-4 mr-2 inline" />
                                Colonial Luxury
                            </Badge>
                            <Badge className="bg-green-500/90 text-white px-4 py-2 text-sm backdrop-blur-sm">
                                <TrendingUp className="w-4 h-4 mr-2 inline" />
                                Premium Estates
                            </Badge>
                        </div>

                        <div className="flex items-center justify-center mb-4">
                            <Leaf className="w-8 h-8 text-amber-400" />
                            <span className="text-sm font-medium tracking-wider uppercase mx-4 text-amber-200">Estate Approved Luxury</span>
                            <Leaf className="w-8 h-8 text-amber-400 scale-x-[-1]" />
                        </div>

                        <h1 className="text-7xl md:text-8xl font-serif font-bold mb-6 animate-fade-in leading-tight">
                            National Parks
                            <span className="block bg-gradient-to-r from-amber-300 via-yellow-200 to-amber-300 bg-clip-text text-transparent">
                                & Wildlife Safaris
                            </span>
                        </h1>

                        <p className="text-2xl md:text-3xl font-serif mb-8 animate-fade-in opacity-90 leading-relaxed">
                            Experience the thrill of Sri Lanka's premier national parks<br />
                            Home to leopards, elephants, and untamed wilderness
                        </p>

                        <div className="flex flex-wrap justify-center gap-6 mb-8 text-sm">
                            {[
                                { icon: Car, text: 'Private Jeep Safaris' },
                                { icon: Binoculars, text: 'Expert Tracking' },
                                { icon: Crown, text: 'Luxury Camping' },
                                { icon: Mountain, text: 'Untamed Wilderness' }
                            ].map((item, index) => (
                                <div key={index} className="flex items-center bg-amber-900/30 backdrop-blur-sm px-6 py-3 rounded-full border border-amber-300/20">
                                    <item.icon className="w-5 h-5 mr-2 text-amber-200" />
                                    <span className="text-amber-100">{item.text}</span>
                                </div>
                            ))}
                        </div>

                        <div className="flex flex-wrap justify-center gap-4 animate-scale-in">
                            <Button
                                size="lg"
                                className="bg-gradient-to-r from-amber-600 to-yellow-600 hover:from-amber-700 hover:to-yellow-700 text-white px-10 py-7 text-lg rounded-full shadow-2xl transform hover:scale-105 transition-all duration-300"
                                onClick={() => document.getElementById('experiences')?.scrollIntoView({ behavior: 'smooth' })}
                            >
                                <Leaf className="mr-2 w-5 h-5" />
                                Discover National Parks
                            </Button>

                            <Button
                                size="lg"
                                variant="outline"
                                className="bg-white/10 backdrop-blur-md border-2 border-white/50 text-white hover:bg-white/20 px-10 py-7 text-lg rounded-full shadow-2xl transform hover:scale-105 transition-all duration-300"
                            >
                                <Play className="mr-2 w-5 h-5" />
                                Watch Estate Tour
                            </Button>
                        </div>

                        {/* Stats */}
                        <div className="grid grid-cols-3 gap-8 mt-16 max-w-3xl mx-auto">
                            {[
                                { icon: Home, label: 'National Parks', value: '26+' },
                                { icon: Mountain, label: 'Safari Routes', value: '50+' },
                                { icon: Star, label: 'Rating', value: '4.9' }
                            ].map((stat, idx) => (
                                <div key={idx} className="text-center backdrop-blur-md bg-white/10 rounded-2xl p-6 transform hover:scale-110 transition-all duration-300">
                                    <stat.icon className="w-10 h-10 mx-auto mb-3 text-amber-300" />
                                    <div className="text-4xl font-bold mb-1">{stat.value}</div>
                                    <div className="text-sm opacity-90">{stat.label}</div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
                        <Mountain className="w-10 h-10 text-white" />
                    </div>
                </section>

                {/* Search & Filter Bar */}
                <section className="sticky top-16 z-40 bg-white/95 backdrop-blur-lg shadow-lg border-b border-green-100">
                    <div className="container mx-auto px-4 py-6">
                        <div className="flex flex-wrap gap-4 items-center justify-between">
                            <div className="relative flex-1 min-w-[250px]">
                                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                                <Input
                                    placeholder="Search national parks, animals, safaris..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="pl-12 pr-4 py-6 rounded-full border-2 border-green-200 focus:border-green-500 bg-white shadow-sm"
                                />
                            </div>

                            <div className="flex gap-3 flex-wrap">
                                <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                                    <SelectTrigger className="w-[180px] rounded-full border-2 border-green-200 bg-white shadow-sm">
                                        <Filter className="w-4 h-4 mr-2" />
                                        <SelectValue placeholder="Category" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">All Safaris</SelectItem>
                                        <SelectItem value="yala">Yala National Park</SelectItem>
                                        <SelectItem value="udawalawe">Udawalawe</SelectItem>
                                        <SelectItem value="wilpattu">Wilpattu</SelectItem>
                                        <SelectItem value="minneriya">Minneriya</SelectItem>
                                        <SelectItem value="bundala">Bundala</SelectItem>
                                    </SelectContent>
                                </Select>

                                <Select value={priceFilter} onValueChange={setPriceFilter}>
                                    <SelectTrigger className="w-[160px] rounded-full border-2 border-green-200 bg-white shadow-sm">
                                        <SelectValue placeholder="Price Range" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">All Prices</SelectItem>
                                        <SelectItem value="budget">Under $200</SelectItem>
                                        <SelectItem value="mid">$200 - $500</SelectItem>
                                        <SelectItem value="premium">$500+</SelectItem>
                                    </SelectContent>
                                </Select>

                                <Badge className="px-4 py-2 bg-green-100 text-green-800 text-sm">
                                    {filteredTours.length} {filteredTours.length === 1 ? 'Experience' : 'Experiences'}
                                </Badge>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Featured Tours */}
                <section id="experiences" className="py-20">
                    <div className="container mx-auto px-4">
                        <div className="text-center mb-16">
                            <div className="flex items-center justify-center mb-4">
                                <div className="w-20 h-px bg-amber-600"></div>
                                <Crown className="w-8 h-8 mx-4 text-amber-600" />
                                <div className="w-20 h-px bg-amber-600"></div>
                            </div>
                            <Badge className="mb-4 px-6 py-2 bg-gradient-to-r from-green-600 to-amber-600 text-white text-sm">
                                SIGNATURE EXPERIENCES
                            </Badge>
                            <h2 className="text-6xl font-serif font-bold bg-gradient-to-r from-green-800 via-amber-700 to-green-600 bg-clip-text text-transparent mb-6">
                                National Park Adventures
                            </h2>
                            <p className="text-xl text-gray-600 max-w-3xl mx-auto font-serif leading-relaxed">
                                Curated safari experiences showcasing Sri Lanka's diverse wildlife and natural beauty
                            </p>
                        </div>

                        <TourGrid tours={filteredTours} onSelectTour={setSelectedTour} wishlist={wishlist} onToggleWishlist={toggleWishlist} />
                    </div>
                </section>

                {/* Why Choose Us */}
                <section className="py-20 bg-gradient-to-br from-green-900 to-amber-900 text-white relative overflow-hidden">
                    <div className="absolute inset-0 opacity-10">
                        <div className="absolute top-0 left-0 w-96 h-96 bg-yellow-400 rounded-full blur-3xl"></div>
                        <div className="absolute bottom-0 right-0 w-96 h-96 bg-green-400 rounded-full blur-3xl"></div>
                    </div>

                    <div className="container mx-auto px-4 relative z-10">
                        <div className="text-center mb-16">
                            <h2 className="text-5xl font-serif font-bold mb-6">Why Choose Our Safaris?</h2>
                            <p className="text-xl opacity-90 max-w-2xl mx-auto">
                                Immerse yourself in the raw beauty of Sri Lanka's wilderness with expert guidance
                            </p>
                        </div>

                        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                            {[
                                {
                                    icon: Binoculars,
                                    title: 'Expert Naturalists',
                                    description: 'Guided by experienced trackers who know the parks inside out'
                                },
                                {
                                    icon: Home,
                                    title: 'Luxury Camping',
                                    description: 'Glamping experiences under the stars with modern comforts'
                                },
                                {
                                    icon: Crown,
                                    title: 'Private Jeeps',
                                    description: 'Exclusive 4x4 vehicles for a comfortable and private safari'
                                },
                                {
                                    icon: Leaf,
                                    title: 'Conservation Focused',
                                    description: 'Responsible tourism that supports wildlife conservation'
                                }
                            ].map((feature, idx) => (
                                <Card key={idx} className="bg-white/10 backdrop-blur-lg border-white/20 hover:bg-white/20 transition-all duration-300 transform hover:scale-105">
                                    <CardContent className="p-8 text-center">
                                        <feature.icon className="w-16 h-16 mx-auto mb-4 text-amber-300" />
                                        <h3 className="text-2xl font-bold mb-3">{feature.title}</h3>
                                        <p className="opacity-90">{feature.description}</p>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Testimonials */}
                <section className="py-20 bg-white">
                    <div className="container mx-auto px-4">
                        <div className="text-center mb-16">
                            <h2 className="text-5xl font-serif font-bold text-gray-900 mb-6">Safari Guest Stories</h2>
                            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                                Adventurers who've experienced the magic of Sri Lanka's wildlife
                            </p>
                        </div>

                        <div className="grid md:grid-cols-3 gap-8">
                            {defaultReviews.slice(0, 3).map((review, idx) => (
                                <Card key={idx} className="hover:shadow-2xl transition-all duration-300 border-2 border-green-100">
                                    <CardContent className="p-8">
                                        <div className="flex items-center mb-4">
                                            <div className="w-12 h-12 bg-gradient-to-br from-green-400 to-amber-500 rounded-full flex items-center justify-center text-white font-bold text-lg mr-4">
                                                {review.userName[0]}
                                            </div>
                                            <div>
                                                <div className="font-bold text-gray-900">{review.userName}</div>
                                                <div className="flex items-center">
                                                    {[...Array(5)].map((_, i) => (
                                                        <Star key={i} className={`w-4 h-4 ${i < review.rating ? 'text-yellow-500 fill-current' : 'text-gray-300'}`} />
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                        <p className="text-gray-700 leading-relaxed mb-4">{review.comment}</p>
                                        <p className="text-sm text-gray-500">{review.date}</p>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Call to Action */}
                <section className="py-20 bg-gradient-to-r from-green-700 via-amber-600 to-green-600 text-white">
                    <div className="container mx-auto px-4 text-center">
                        <Mountain className="w-20 h-20 mx-auto mb-6 animate-bounce" />
                        <h2 className="text-5xl font-serif font-bold mb-6">Ready for Your Wildlife Adventure?</h2>
                        <p className="text-2xl mb-8 opacity-90 max-w-2xl mx-auto">
                            Join us for an unforgettable journey into the heart of the wild
                        </p>
                        <div className="flex flex-wrap justify-center gap-4">
                            <Button
                                size="lg"
                                className="bg-white text-green-600 hover:bg-gray-100 px-10 py-7 text-lg rounded-full shadow-2xl transform hover:scale-105 transition-all duration-300"
                                onClick={() => document.getElementById('experiences')?.scrollIntoView({ behavior: 'smooth' })}
                            >
                                Book Your Experience
                            </Button>
                            <Button
                                size="lg"
                                variant="outline"
                                className="border-2 border-white text-white hover:bg-white/10 px-10 py-7 text-lg rounded-full shadow-2xl transform hover:scale-105 transition-all duration-300"
                            >
                                <MessageCircle className="mr-2 w-5 h-5" />
                                Chat with Specialist
                            </Button>
                        </div>
                    </div>
                </section>
            </div>

            <Footer />

            {selectedTour && (
                <BookingDialog
                    tour={selectedTour}
                    open={bookingDialogOpen}
                    onOpenChange={setBookingDialogOpen}
                    onBook={handleBooking}
                />
            )}
        </>
    );
};

// Tour Grid Component
const TourGrid = ({ tours, onSelectTour, wishlist, onToggleWishlist }: any) => {
    return (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {tours.map((tour: NationalParksTour) => (
                <Card
                    key={tour.id}
                    className="group hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 bg-white border-2 border-green-100 overflow-hidden"
                >
                    <div className="relative overflow-hidden h-64">
                        <img
                            src={tour.image}
                            alt={tour.title}
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                        {tour.featured && (
                            <Badge className="absolute top-4 left-4 bg-gradient-to-r from-amber-500 to-yellow-500 text-white">
                                <Crown className="w-3 h-3 mr-1" />
                                Premium Estate
                            </Badge>
                        )}
                        <Badge className="absolute top-4 right-12 bg-green-600 text-white">
                            {tour.category}
                        </Badge>

                        <button
                            onClick={() => onToggleWishlist(tour.id)}
                            className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm rounded-full p-2 hover:bg-white transition-all duration-300 transform hover:scale-110"
                        >
                            <Heart
                                className={`w-5 h-5 ${wishlist.includes(tour.id) ? 'text-red-500 fill-current' : 'text-gray-600'}`}
                            />
                        </button>

                        <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur-sm rounded-full px-4 py-2 flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                            <Star className="w-4 h-4 text-yellow-500 fill-current" />
                            <span className="font-semibold text-gray-900">{tour.rating}</span>
                            <span className="text-sm text-gray-600">({tour.reviews})</span>
                        </div>
                    </div>

                    <CardHeader className="pb-3">
                        <CardTitle className="text-2xl font-serif text-gray-900 group-hover:text-green-600 transition-colors">
                            {tour.title}
                        </CardTitle>
                        <div className="flex items-center text-gray-600">
                            <MapPin className="w-4 h-4 mr-2 text-green-500" />
                            <span className="text-sm">{tour.location}</span>
                        </div>
                    </CardHeader>

                    <CardContent className="space-y-4">
                        <p className="text-gray-600 leading-relaxed line-clamp-2">
                            {tour.description}
                        </p>

                        <div className="flex flex-wrap gap-3 text-sm text-gray-600">
                            <div className="flex items-center">
                                <Clock className="w-4 h-4 mr-1 text-green-500" />
                                {tour.duration}
                            </div>
                            <div className="flex items-center">
                                <Users className="w-4 h-4 mr-1 text-green-500" />
                                Max {tour.maxGroupSize}
                            </div>
                            {tour.altitude && (
                                <div className="flex items-center">
                                    <Mountain className="w-4 h-4 mr-1 text-green-500" />
                                    {tour.altitude}
                                </div>
                            )}
                        </div>

                        <div className="flex flex-wrap gap-2">
                            {tour.highlights.slice(0, 3).map((highlight, i) => (
                                <Badge key={i} variant="outline" className="text-xs border-green-300 text-green-700">
                                    {highlight}
                                </Badge>
                            ))}
                        </div>

                        <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                            <div className="text-3xl font-bold bg-gradient-to-r from-green-600 to-amber-600 bg-clip-text text-transparent">
                                ${tour.price}
                                <span className="text-sm font-normal text-gray-500">/person</span>
                            </div>
                            <Dialog>
                                <DialogTrigger asChild>
                                    <Button
                                        className="bg-gradient-to-r from-green-600 to-amber-600 hover:from-green-700 hover:to-amber-700 text-white rounded-full px-6 shadow-lg transform hover:scale-105 transition-all duration-300"
                                        onClick={() => onSelectTour(tour)}
                                    >
                                        Reserve Now
                                    </Button>
                                </DialogTrigger>
                                <BookingDialogContent tour={tour} />
                            </Dialog>
                        </div>
                    </CardContent>
                </Card>
            ))}
        </div>
    );
};

// Booking Dialog Component
const BookingDialogContent = ({ tour }: { tour: NationalParksTour }) => {
    const [bookingData, setBookingData] = useState({
        date: '',
        guests: 2,
        contactName: '',
        contactEmail: '',
        contactPhone: '',
        specialRequests: '',
        pickupLocation: tour.startLocation || tour.location
    });

    const totalPrice = tour.price * (bookingData.guests || 1);
    const holdingDeposit = Math.round(totalPrice * 0.2);
    const startLocation = tour.startLocation || tour.location;
    const transportNote = tour.transportNote || "We provide pickup from your hotel in Yala, Tissamaharama, or Kataragama. Colombo transfers available on request.";

    return (
        <DialogContent className="max-w-5xl p-0 overflow-hidden border-none bg-transparent shadow-none">
            <div className="grid lg:grid-cols-[1.05fr_0.95fr] gap-0 rounded-3xl border border-emerald-100 bg-white/95 shadow-2xl">
                <div className="relative bg-gradient-to-b from-slate-50 to-white">
                    <div className="relative h-56 w-full overflow-hidden rounded-t-3xl lg:rounded-tr-none">
                        <img
                            src={tour.image}
                            alt={tour.title}
                            className="h-full w-full object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />
                        <div className="absolute bottom-4 left-4 right-4 flex flex-wrap items-center justify-between text-white">
                            <div>
                                <p className="text-xs uppercase tracking-[0.3em] text-white/60">Wildlife Safari</p>
                                <p className="text-lg font-semibold">{tour.title}</p>
                            </div>
                            <div className="text-right">
                                <p className="text-xs text-white/70">From</p>
                                <p className="text-2xl font-bold">${tour.price} <span className="text-sm font-normal text-white/70">per guest</span></p>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-5 p-6 lg:p-8">
                        <div className="flex flex-wrap gap-3 text-sm text-slate-600">
                            <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-3 py-1 text-emerald-700">
                                <Clock className="h-4 w-4" />
                                {tour.duration}
                            </span>
                            <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-3 py-1 text-amber-700">
                                <Users className="h-4 w-4" />
                                Max {tour.maxGroupSize}
                            </span>
                            <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-3 py-1 text-slate-700">
                                <Star className="h-4 w-4" />
                                {tour.rating} ({tour.reviews}+ reviews)
                            </span>
                        </div>

                        <div className="space-y-3 rounded-2xl border border-emerald-100 bg-white p-4 shadow-sm">
                            <div className="flex items-center gap-2 text-sm font-semibold text-slate-800">
                                <Car className="h-4 w-4 text-emerald-600" />
                                Departure logistics
                            </div>
                            <p className="text-sm text-slate-600">
                                {`Primary departure: ${startLocation}.`}
                            </p>
                            <div className="text-xs text-slate-500">
                                {transportNote}
                            </div>
                        </div>

                        <div className="space-y-4">
                            <div>
                                <p className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-500">Highlights</p>
                                <div className="mt-3 flex flex-wrap gap-2">
                                    {tour.highlights?.slice(0, 6).map((highlight, i) => (
                                        <span key={i} className="inline-flex items-center gap-1 rounded-full border border-emerald-100 bg-emerald-50 px-3 py-1 text-xs text-emerald-700">
                                            <Check className="h-3.5 w-3.5" />
                                            {highlight}
                                        </span>
                                    ))}
                                </div>
                                <p className="mt-4 text-sm leading-relaxed text-slate-600">
                                    {tour.description}
                                </p>
                            </div>

                            <div className="grid gap-4 md:grid-cols-2">
                                <div className="rounded-2xl border border-slate-200 bg-white/70 p-4">
                                    <p className="text-sm font-semibold text-slate-800 flex items-center gap-2">
                                        <Shield className="h-4 w-4 text-emerald-600" />
                                        Included
                                    </p>
                                    <ul className="mt-3 space-y-1 text-sm text-slate-600">
                                        {tour.included?.map((item, index) => (
                                            <li key={index} className="flex items-start gap-2">
                                                <span className="mt-1 h-1.5 w-1.5 rounded-full bg-emerald-500" />
                                                {item}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                                <div className="rounded-2xl border border-amber-100 bg-gradient-to-br from-amber-50 to-white p-4">
                                    <p className="text-sm font-semibold text-amber-800 flex items-center gap-2">
                                        <AlertTriangle className="h-4 w-4 text-amber-600" />
                                        Important notes
                                    </p>
                                    <ul className="mt-3 space-y-1.5 text-sm text-amber-900/80">
                                        {(tour.importantInfo || [
                                            "National park permits require passport/NIC copies.",
                                            "Weather or animal movements can alter the routing.",
                                        ]).map((note, index) => (
                                            <li key={index} className="flex items-start gap-2">
                                                <span className="mt-1 h-1.5 w-1.5 rounded-full bg-amber-500/70" />
                                                {note}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="space-y-6 border-t border-emerald-100 bg-white/90 p-6 lg:border-l lg:border-t-0 lg:p-8">
                    <DialogHeader className="text-left space-y-2">
                        <DialogTitle className="text-2xl font-semibold text-slate-900">Reserve your spot</DialogTitle>
                        <DialogDescription className="text-sm text-slate-500">
                            Share your preferred date and party details. Our concierge team will confirm availability and final logistics within 30 minutes.
                        </DialogDescription>
                    </DialogHeader>

                    <div className="space-y-4">
                        <div className="grid gap-4 sm:grid-cols-2">
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-slate-600">Preferred date</label>
                                <Input
                                    type="date"
                                    value={bookingData.date}
                                    onChange={(e) => setBookingData({ ...bookingData, date: e.target.value })}
                                    className="border-slate-200 focus:border-emerald-500 focus:ring-emerald-500"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-slate-600">Guests</label>
                                <Input
                                    type="number"
                                    min="1"
                                    max={tour.maxGroupSize}
                                    value={bookingData.guests}
                                    onChange={(e) => setBookingData({ ...bookingData, guests: parseInt(e.target.value) })}
                                    className="border-slate-200 focus:border-emerald-500 focus:ring-emerald-500"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium text-slate-600">Full Name</label>
                            <Input
                                placeholder="Your full name"
                                value={bookingData.contactName}
                                onChange={(e) => setBookingData({ ...bookingData, contactName: e.target.value })}
                                className="border-slate-200 focus:border-emerald-500 focus:ring-emerald-500"
                            />
                        </div>

                        <div className="grid gap-4 sm:grid-cols-2">
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-slate-600">Email</label>
                                <Input
                                    type="email"
                                    placeholder="your@email.com"
                                    value={bookingData.contactEmail}
                                    onChange={(e) => setBookingData({ ...bookingData, contactEmail: e.target.value })}
                                    className="border-slate-200 focus:border-emerald-500 focus:ring-emerald-500"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-slate-600">Phone</label>
                                <Input
                                    type="tel"
                                    placeholder="+94 XX XXX XXXX"
                                    value={bookingData.contactPhone}
                                    onChange={(e) => setBookingData({ ...bookingData, contactPhone: e.target.value })}
                                    className="border-slate-200 focus:border-emerald-500 focus:ring-emerald-500"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium text-slate-600">Special Requests</label>
                            <Textarea
                                placeholder="Dietary requirements, pickup location details..."
                                rows={3}
                                value={bookingData.specialRequests}
                                onChange={(e) => setBookingData({ ...bookingData, specialRequests: e.target.value })}
                                className="border-slate-200 focus:border-emerald-500 focus:ring-emerald-500 resize-none"
                            />
                        </div>

                        <div className="rounded-xl bg-slate-50 p-4 border border-slate-100">
                            <div className="flex justify-between items-center mb-2 text-sm">
                                <span className="text-slate-600">Price per person</span>
                                <span className="font-semibold text-slate-900">${tour.price}</span>
                            </div>
                            <div className="flex justify-between items-center mb-2 text-sm">
                                <span className="text-slate-600">Guests</span>
                                <span className="font-semibold text-slate-900">× {bookingData.guests}</span>
                            </div>
                            <div className="border-t border-slate-200 pt-2 mt-2">
                                <div className="flex justify-between items-center">
                                    <span className="font-bold text-slate-900">Total Estimate</span>
                                    <span className="text-2xl font-bold text-emerald-600">
                                        ${totalPrice}
                                    </span>
                                </div>
                                <p className="text-xs text-slate-500 mt-1 text-right">
                                    No payment required today
                                </p>
                            </div>
                        </div>

                        <Button className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white py-6 text-lg rounded-xl shadow-lg transition-all duration-300 transform hover:scale-[1.02]">
                            Request Booking
                        </Button>
                    </div>
                </div>
            </div>
        </DialogContent>
    );
};

const BookingDialog = ({ tour, open, onOpenChange, onBook }: any) => {
    return null;
};

// Default data
const defaultNationalParksTours: NationalParksTour[] = [
    {
        id: '1',
        title: "Private Yala Leopard Safari",
        location: "Yala National Park",
        image: "https://images.unsplash.com/photo-1549366021-9f761d450615?w=800",
        description: "Exclusive private jeep safari in Block 1 of Yala National Park, famous for having the highest density of leopards in the world.",
        highlights: ["High Leopard Density", "Private Jeep", "Expert Tracker", "Breakfast in Park"],
        price: 150,
        rating: 4.9,
        reviews: 128,
        category: "yala",
        duration: "Half Day (4-5 hours)",
        difficulty: "Easy",
        maxGroupSize: 6,
        included: ["Private 4x4 Jeep", "Park Entrance Fees", "Expert Guide", "Refreshments"],
        featured: true,
        startLocation: "Yala / Tissamaharama Hotel",
        transportNote: "Free pickup from hotels in Tissamaharama and Yala area.",
        importantInfo: ["Best time for leopards: 6AM-9AM or 3PM-6PM", "Park closed in September"]
    },
    {
        id: '2',
        title: "Udawalawe Elephant Safari",
        location: "Udawalawe National Park",
        image: "https://images.unsplash.com/photo-1585970480901-90d6bb2a48b5?w=800",
        description: "Witness large herds of Asian elephants in their natural habitat. Udawalawe guarantees elephant sightings year-round.",
        highlights: ["Guaranteed Elephants", "Bird Watching", "Scenic Reservoir", "Elephant Transit Home"],
        price: 120,
        rating: 4.8,
        reviews: 95,
        category: "udawalawe",
        duration: "3-4 hours",
        difficulty: "Easy",
        maxGroupSize: 6,
        included: ["Safari Jeep", "Park Tickets", "Guide", "Water"],
        featured: true,
        startLocation: "Udawalawe / Embilipitiya",
    },
    {
        id: '3',
        title: "Wilpattu Wilderness Expedition",
        location: "Wilpattu National Park",
        image: "https://images.unsplash.com/photo-1535591273668-578e31182c4f?w=800",
        description: "Explore Sri Lanka's largest and most scenic national park. Known for its natural lakes ('villus') and elusive leopards and sloth bears.",
        highlights: ["Scenic Lakes", "Leopards & Bears", "Less Crowded", "Full Day Option"],
        price: 180,
        rating: 4.9,
        reviews: 72,
        category: "wilpattu",
        duration: "Full Day",
        difficulty: "Moderate",
        maxGroupSize: 6,
        included: ["Full Day Jeep Hire", "Lunch", "Park Fees", "Tracker"],
        featured: true,
        startLocation: "Wilpattu Entrance / Anuradhapura",
    },
    {
        id: '4',
        title: "Minneriya Elephant Gathering",
        location: "Minneriya National Park",
        image: "https://images.unsplash.com/photo-1557050543-4d5f4e07ef46?w=800",
        description: "Witness 'The Gathering', the largest meeting of Asian elephants in the world, occurring annually during the dry season.",
        highlights: ["The Gathering", "Hundreds of Elephants", "Sunset Safari", "Lake Views"],
        price: 100,
        rating: 4.7,
        reviews: 150,
        category: "minneriya",
        duration: "3 hours",
        difficulty: "Easy",
        maxGroupSize: 6,
        included: ["Jeep Safari", "Park Fees", "Guide"],
        bestSeason: "July to October",
        startLocation: "Habarana / Sigiriya",
    },
    {
        id: '5',
        title: "Bundala Bird Paradise",
        location: "Bundala National Park",
        image: "https://images.unsplash.com/photo-1452570053594-1b985d6ea890?w=800",
        description: "A UNESCO Biosphere Reserve and a paradise for migratory birds, including greater flamingos.",
        highlights: ["Migratory Birds", "Flamingos", "Crocodiles", "Coastal Dunes"],
        price: 90,
        rating: 4.6,
        reviews: 45,
        category: "bundala",
        duration: "3 hours",
        difficulty: "Easy",
        maxGroupSize: 6,
        included: ["Jeep", "Park Fees", "Binoculars", "Guide"],
        startLocation: "Hambantota / Tissamaharama",
    },
    {
        id: '6',
        title: "Luxury Glamping in Yala",
        location: "Yala National Park Border",
        image: "https://images.unsplash.com/photo-1478131143081-80f7f84ca84d?w=800",
        description: "Experience the wild in comfort with an all-inclusive luxury tented camp stay on the border of Yala National Park.",
        highlights: ["Luxury Tent", "BBQ Dinner", "Bonfire", "Night Walk"],
        price: 450,
        rating: 4.9,
        reviews: 60,
        category: "yala",
        duration: "Overnight",
        difficulty: "Easy",
        maxGroupSize: 2,
        included: ["Accommodation", "All Meals", "2 Safaris", "Drinks"],
        featured: true,
        startLocation: "Yala Camp Site",
    },
];

const defaultReviews: Review[] = [
    {
        id: '1',
        tourId: '1',
        userName: 'Sarah Jenkins',
        rating: 5,
        comment: 'Seeing a leopard in the wild was a dream come true! Our tracker was amazing and spotted one within an hour. The private jeep was very comfortable.',
        date: 'November 2024',
        helpful: 34,
    },
    {
        id: '2',
        tourId: '2',
        userName: 'Michael Chen',
        rating: 5,
        comment: 'Udawalawe is incredible. We saw so many elephants, including babies! A must-do experience for animal lovers.',
        date: 'October 2024',
        helpful: 28,
    },
    {
        id: '3',
        tourId: '3',
        userName: 'Emma Thompson',
        rating: 5,
        comment: 'Wilpattu is beautiful and so peaceful compared to other parks. We saw a sloth bear and many birds. The full day tour is worth it.',
        date: 'November 2024',
        helpful: 42,
    },
];

export default NationalParksToursNew;
