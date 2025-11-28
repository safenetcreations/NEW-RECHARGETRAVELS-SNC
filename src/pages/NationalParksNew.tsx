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
    Crown, Home, Leaf, Binoculars, TrendingUp, MessageCircle
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

            const toursData: NationalParksTour[] = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            } as NationalParksTour));

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
                    <p className="text-xl font-semibold text-gray-700">Loading NationalParks Wildlife Adventures...</p>
                </div>
            </div>
        );
    }

    return (
        <>
            <Helmet>
                <title>Luxury NationalParks Wildlife Tours Sri Lanka - Binoculars Wildlife Retreats | Recharge Travels</title>
                <meta name="description" content="Discover exclusive tea estate retreats, colonial luxury, and misty mountain escapes. Private tastings, vintage railways, and premium hill country experiences in Sri Lanka." />
                <meta name="keywords" content="Sri Lanka hill country, tea estate tours, Nuwara Eliya, Ella, tea plantations, luxury mountain retreats" />
                <meta property="og:title" content="Luxury NationalParks Wildlife Tours Sri Lanka - Recharge Travels" />
                <meta property="og:description" content="Exclusive tea estate retreats in Sri Lanka's misty mountains" />
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
                            NationalParks Wildlife
                            <span className="block bg-gradient-to-r from-amber-300 via-yellow-200 to-amber-300 bg-clip-text text-transparent">
                                Tea Retreats
                            </span>
                        </h1>

                        <p className="text-2xl md:text-3xl font-serif mb-8 animate-fade-in opacity-90 leading-relaxed">
                            Escape to exclusive tea estate retreats where colonial elegance<br />
                            meets Ceylon's misty mountains
                        </p>

                        <div className="flex flex-wrap justify-center gap-6 mb-8 text-sm">
                            {[
                                { icon: Coffee, text: 'Private Estate Tastings' },
                                { icon: Train, text: 'Wildlife Railways' },
                                { icon: Crown, text: 'Colonial Luxury' },
                                { icon: Mountain, text: 'Misty Peaks' }
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
                                Discover Binoculars Wildlifes
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
                                { icon: Home, label: 'Wildlife Estates', value: '20+' },
                                { icon: Mountain, label: 'Scenic Routes', value: '30+' },
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
                                    placeholder="Search tea estates, mountains, experiences..."
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
                                        <SelectItem value="all">All Experiences</SelectItem>
                                        <SelectItem value="safari">Tea Tastings</SelectItem>
                                        <SelectItem value="leopard-tracking">Estate Stays</SelectItem>
                                        <SelectItem value="elephant-watching">Train Journeys</SelectItem>
                                        <SelectItem value="jeep-safari">Mountain Treks</SelectItem>
                                        <SelectItem value="multi-day">Multi-Day Tours</SelectItem>
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
                                Binoculars Wildlife Adventures
                            </h2>
                            <p className="text-xl text-gray-600 max-w-3xl mx-auto font-serif leading-relaxed">
                                Curated luxury experiences showcasing the finest of Ceylon tea culture and colonial heritage
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
                            <h2 className="text-5xl font-serif font-bold mb-6">Why Our Binoculars Wildlife Retreats?</h2>
                            <p className="text-xl opacity-90 max-w-2xl mx-auto">
                                Immerse yourself in refined elegance of Ceylon's colonial tea heritage
                            </p>
                        </div>

                        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                            {[
                                {
                                    icon: Coffee,
                                    title: 'Master Tea Experiences',
                                    description: 'Private sessions with estate masters and exclusive tastings'
                                },
                                {
                                    icon: Home,
                                    title: 'Colonial Luxury Stays',
                                    description: 'Wildlife bungalows with period furnishings and butler service'
                                },
                                {
                                    icon: Crown,
                                    title: 'Exclusive Access',
                                    description: 'Private estate tours and vintage train first-class carriages'
                                },
                                {
                                    icon: Leaf,
                                    title: 'Authentic Wildlife',
                                    description: 'Century-old plantations with stories spanning generations'
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
                            <h2 className="text-5xl font-serif font-bold text-gray-900 mb-6">Estate Guest Testimonials</h2>
                            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                                Distinguished guests who've experienced our luxury tea estate retreats
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
                        <h2 className="text-5xl font-serif font-bold mb-6">Ready for Your NationalParks Wildlife Escape?</h2>
                        <p className="text-2xl mb-8 opacity-90 max-w-2xl mx-auto">
                            Join us for an unforgettable journey through Ceylon's misty tea estates
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
        guests: 1,
        contactName: '',
        contactEmail: '',
        contactPhone: '',
        specialRequests: '',
    });

    return (
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
                <DialogTitle className="text-2xl font-serif">{tour.title}</DialogTitle>
                <DialogDescription>
                    Complete your booking for this hill country experience
                </DialogDescription>
            </DialogHeader>

            <div className="space-y-6 py-4">
                <div className="bg-green-50 rounded-lg p-4 border border-green-200">
                    <div className="flex justify-between items-start mb-3">
                        <div>
                            <div className="font-semibold text-gray-900">{tour.location}</div>
                            <div className="text-sm text-gray-600">{tour.duration}</div>
                        </div>
                        <div className="text-right">
                            <div className="text-2xl font-bold text-green-600">${tour.price}</div>
                            <div className="text-sm text-gray-600">per person</div>
                        </div>
                    </div>

                    {tour.highlights && (
                        <div className="flex flex-wrap gap-2 mt-3">
                            {tour.highlights.slice(0, 4).map((highlight, i) => (
                                <Badge key={i} className="bg-green-100 text-green-800 text-xs">
                                    <Check className="w-3 h-3 mr-1" />
                                    {highlight}
                                </Badge>
                            ))}
                        </div>
                    )}
                </div>

                <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Date</label>
                            <Input
                                type="date"
                                value={bookingData.date}
                                onChange={(e) => setBookingData({ ...bookingData, date: e.target.value })}
                                className="border-green-200 focus:border-green-500"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Number of Guests</label>
                            <Input
                                type="number"
                                min="1"
                                max={tour.maxGroupSize}
                                value={bookingData.guests}
                                onChange={(e) => setBookingData({ ...bookingData, guests: parseInt(e.target.value) })}
                                className="border-green-200 focus:border-green-500"
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium">Full Name</label>
                        <Input
                            placeholder="Your full name"
                            value={bookingData.contactName}
                            onChange={(e) => setBookingData({ ...bookingData, contactName: e.target.value })}
                            className="border-green-200 focus:border-green-500"
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Email</label>
                            <Input
                                type="email"
                                placeholder="your@email.com"
                                value={bookingData.contactEmail}
                                onChange={(e) => setBookingData({ ...bookingData, contactEmail: e.target.value })}
                                className="border-green-200 focus:border-green-500"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Phone</label>
                            <Input
                                type="tel"
                                placeholder="+94 XX XXX XXXX"
                                value={bookingData.contactPhone}
                                onChange={(e) => setBookingData({ ...bookingData, contactPhone: e.target.value })}
                                className="border-green-200 focus:border-green-500"
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium">Special Requests (Optional)</label>
                        <Textarea
                            placeholder="Dietary requirements, preferences, or special requirements..."
                            rows={3}
                            value={bookingData.specialRequests}
                            onChange={(e) => setBookingData({ ...bookingData, specialRequests: e.target.value })}
                            className="border-green-200 focus:border-green-500 resize-none"
                        />
                    </div>
                </div>

                <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                    <div className="flex justify-between items-center mb-2">
                        <span className="text-gray-600">Price per person</span>
                        <span className="font-semibold">${tour.price}</span>
                    </div>
                    <div className="flex justify-between items-center mb-2">
                        <span className="text-gray-600">Number of guests</span>
                        <span className="font-semibold">× {bookingData.guests}</span>
                    </div>
                    <div className="border-t border-gray-300 pt-2 mt-2">
                        <div className="flex justify-between items-center">
                            <span className="text-lg font-bold">Total</span>
                            <span className="text-2xl font-bold text-green-600">
                                ${tour.price * bookingData.guests}
                            </span>
                        </div>
                    </div>
                </div>

                <Button
                    className="w-full bg-gradient-to-r from-green-600 to-amber-600 hover:from-green-700 hover:to-amber-700 text-white py-6 text-lg rounded-full shadow-lg"
                >
                    Confirm Booking
                </Button>
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
        title: "Private Tea Tasting with Estate Master",
        location: "Nuwara Eliya",
        image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800",
        description: "Exclusive sessions with master tea makers at century-old plantations. Experience rare Ceylon varieties in historic tea rooms.",
        highlights: ["Estate Master Guidance", "Private Tasting Room", "Tea Blending Workshop", "Plantation History"],
        price: 280,
        rating: 4.9,
        reviews: 87,
        category: "safari",
        duration: "3 hours",
        difficulty: "Easy",
        maxGroupSize: 8,
        included: ["Expert guide", "All tastings", "Tea samples", "Certificate"],
        altitude: "1800m",
        featured: true,
    },
    {
        id: '2',
        title: "Sunrise Horton Plains Luxury Hike",
        location: "Horton Plains",
        image: "https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=800",
        description: "Private guided trek to World's End with gourmet breakfast service and stunning panoramic views.",
        highlights: ["Private Guide", "Gourmet Breakfast", "World's End Viewing", "NationalParks Support"],
        price: 340,
        rating: 4.9,
        reviews: 124,
        category: "jeep-safari",
        duration: "6 hours",
        difficulty: "Moderate",
        maxGroupSize: 10,
        included: ["Private guide", "Breakfast", "Transportation", "Park fees"],
        altitude: "2100m-2300m",
        featured: true,
    },
    {
        id: '3',
        title: "Luxury Vintage Train through Ella",
        location: "Ella",
        image: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=800",
        description: "First-class heritage rail journey with fine dining and Ceylon's most scenic mountain views.",
        highlights: ["First-Class Carriages", "Fine Dining Service", "Panoramic Windows", "Wildlife Experience"],
        price: 420,
        rating: 4.8,
        reviews: 156,
        category: "elephant-watching",
        duration: "4 hours",
        difficulty: "Easy",
        maxGroupSize: 12,
        included: ["First-class tickets", "Fine dining", "Refreshments", "Photo stops"],
        featured: true,
    },
    {
        id: '4',
        title: "Wildlife Binoculars Wildlife Bungalow Stay",
        location: "Nuwara Eliya",
        image: "https://images.unsplash.com/photo-1578761537730-a6eb9c4c5e8c?w=800",
        description: "Colonial-era bungalow experience with butler service, private tea garden, and mountain views.",
        highlights: ["Private Tea Garden", "Butler Service", "Vintage Furnishings", "Mountain Views"],
        price: 450,
        rating: 4.9,
        reviews: 67,
        category: "leopard-tracking",
        duration: "Per night",
        difficulty: "Easy",
        maxGroupSize: 6,
        included: ["Butler service", "All meals", "Tea ceremonies", "Estate tours"],
        altitude: "1900m",
    },
    {
        id: '5',
        title: "Ella Rock Sunrise Trek & Estate Breakfast",
        location: "Ella",
        image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800",
        description: "Dawn hike to Ella Rock followed by gourmet breakfast at a heritage tea estate.",
        highlights: ["Sunrise Views", "Gourmet Breakfast", "Binoculars Wildlife Tour", "Wildlife Guide"],
        price: 180,
        rating: 4.7,
        reviews: 203,
        category: "jeep-safari",
        duration: "5 hours",
        difficulty: "Moderate",
        maxGroupSize: 15,
        included: ["Guide", "Breakfast", "Tea tasting", "Transportation"],
        altitude: "1041m-1525m",
    },
    {
        id: '6',
        title: "4-Day Tea & Trains Luxury Odyssey",
        location: "NationalParks Wildlife",
        image: "https://images.unsplash.com/photo-1571934811356-5cc061b6821f?w=800",
        description: "Complete hill country journey combining multiple estates and heritage railways with luxury accommodation.",
        highlights: ["Multiple Estates", "First-Class Trains", "Colonial Hotels", "Private Guides"],
        price: 1680,
        rating: 4.9,
        reviews: 45,
        category: "multi-day",
        duration: "4 days",
        difficulty: "Easy",
        maxGroupSize: 8,
        included: ["Accommodation", "All meals", "Transportation", "Guided tours"],
        featured: true,
    },
];

const defaultReviews: Review[] = [
    {
        id: '1',
        tourId: '1',
        userName: 'Lord Harrison Pemberton',
        rating: 5,
        comment: 'The most exquisite tea estate experience I\'ve encountered. The private tastings and colonial ambiance transported us to a bygone era of elegance.',
        date: 'November 2024',
        helpful: 34,
    },
    {
        id: '2',
        tourId: '3',
        userName: 'Catherine Van Der Berg',
        rating: 5,
        comment: 'Our vintage train journey through Ella was absolutely magical. The service and attention to detail exceeded our highest expectations.',
        date: 'October 2024',
        helpful: 28,
    },
    {
        id: '3',
        tourId: '4',
        userName: 'James Morrison',
        rating: 5,
        comment: 'The luxury tea estate bungalow offered the perfect retreat. Waking up to mist-covered mountains and the aroma of fresh Ceylon tea was unforgettable.',
        date: 'November 2024',
        helpful: 42,
    },
];

export default NationalParksToursNew;
