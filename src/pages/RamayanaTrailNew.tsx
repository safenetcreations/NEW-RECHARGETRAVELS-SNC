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
import {
    Mountain, Clock, Users, Star, MapPin, Heart,
    Filter, Search, Play, Check, Award, TrendingUp, MessageCircle,
    BookOpen, Landmark, Sun
} from 'lucide-react';
import { collection, getDocs, query, where, orderBy, addDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

interface RamayanaTour {
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

const RamayanaToursNew = () => {
    const [tours, setTours] = useState<RamayanaTour[]>([]);
    const [filteredTours, setFilteredTours] = useState<RamayanaTour[]>([]);
    const [reviews, setReviews] = useState<Review[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedCategory, setSelectedCategory] = useState('all');
    const [searchQuery, setSearchQuery] = useState('');
    const [priceFilter, setPriceFilter] = useState('all');
    const [selectedTour, setSelectedTour] = useState<RamayanaTour | null>(null);
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
            const toursRef = collection(db, 'ramayana_tours');
            const q = query(toursRef, where('is_active', '==', true), orderBy('featured', 'desc'));
            const snapshot = await getDocs(q);

            const toursData: RamayanaTour[] = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            } as RamayanaTour));

            if (toursData.length === 0) {
                setTours(defaultRamayanaTours);
            } else {
                setTours(toursData);
            }
        } catch (error) {
            console.error('Error fetching tours:', error);
            setTours(defaultRamayanaTours);
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
            const reviewsRef = collection(db, 'ramayana_reviews');
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
                    filtered = filtered.filter(tour => tour.price < 500);
                    break;
                case 'mid':
                    filtered = filtered.filter(tour => tour.price >= 500 && tour.price < 1500);
                    break;
                case 'premium':
                    filtered = filtered.filter(tour => tour.price >= 1500);
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
                    description: "Please login to book a Ramayana experience",
                    variant: "destructive",
                });
                navigate('/login');
                return;
            }

            const bookingsRef = collection(db, 'ramayana_bookings');
            await addDoc(bookingsRef, {
                ...bookingData,
                userId: user.uid,
                status: 'pending',
                createdAt: new Date().toISOString(),
            });

            toast({
                title: "Booking Submitted!",
                description: "Your Ramayana journey has been booked. We'll contact you soon.",
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
            <div className="min-h-screen bg-gradient-to-br from-orange-50 via-amber-50 to-orange-50 flex items-center justify-center">
                <div className="text-center">
                    <Sun className="w-16 h-16 mx-auto mb-4 text-orange-600 animate-spin-slow" />
                    <p className="text-xl font-semibold text-gray-700">Loading Ramayana Journeys...</p>
                </div>
            </div>
        );
    }

    return (
        <>
            <Helmet>
                <title>Ramayana Trail Pilgrimage Sri Lanka - Mythological Journeys | Recharge Travels</title>
                <meta name="description" content="Follow the sacred path of Lord Rama, Sita, and Hanuman across Sri Lanka. Visit ancient temples, mythological sites, and experience the Ramayana legend." />
                <meta name="keywords" content="Ramayana Trail, Sri Lanka pilgrimage, Ramayana sites, Sita Eliya, Ashok Vatika, Hanuman temple, Ravana Falls" />
                <meta property="og:title" content="Ramayana Trail Pilgrimage Sri Lanka - Recharge Travels" />
                <meta property="og:description" content="A sacred journey through the legends of the Ramayana in Sri Lanka" />
                <meta property="og:type" content="website" />
            </Helmet>

            <div className="min-h-screen bg-gradient-to-br from-orange-50 via-amber-50 to-orange-50">
                <Header />

                {/* Hero Section */}
                <section className="relative h-[90vh] flex items-center justify-center overflow-hidden">
                    <div
                        className="absolute inset-0 bg-cover bg-center transform scale-105"
                        style={{
                            backgroundImage: `url('https://images.unsplash.com/photo-1588595280408-d42f76931a51?auto=format&fit=crop&w=2070&q=80')`,
                        }}
                    >
                        <div className="absolute inset-0 bg-gradient-to-b from-orange-900/70 via-amber-900/60 to-orange-900/80" />
                    </div>

                    <div className="relative z-10 text-center text-white px-4 max-w-5xl mx-auto">
                        <div className="mb-6 flex justify-center gap-2 animate-fade-in">
                            <Badge className="bg-amber-500/90 text-white px-4 py-2 text-sm backdrop-blur-sm">
                                <Award className="w-4 h-4 mr-2 inline" />
                                Sacred Journey
                            </Badge>
                            <Badge className="bg-orange-500/90 text-white px-4 py-2 text-sm backdrop-blur-sm">
                                <TrendingUp className="w-4 h-4 mr-2 inline" />
                                Mythological Trail
                            </Badge>
                        </div>

                        <div className="flex items-center justify-center mb-4">
                            <Sun className="w-8 h-8 text-amber-400" />
                            <span className="text-sm font-medium tracking-wider uppercase mx-4 text-amber-200">Legendary Path</span>
                            <Sun className="w-8 h-8 text-amber-400" />
                        </div>

                        <h1 className="text-7xl md:text-8xl font-serif font-bold mb-6 animate-fade-in leading-tight">
                            Ramayana Trail
                            <span className="block bg-gradient-to-r from-amber-300 via-yellow-200 to-amber-300 bg-clip-text text-transparent">
                                Pilgrimage
                            </span>
                        </h1>

                        <p className="text-2xl md:text-3xl font-serif mb-8 animate-fade-in opacity-90 leading-relaxed">
                            Follow the footsteps of Lord Rama, Sita, and Hanuman<br />
                            across the sacred landscapes of Lanka
                        </p>

                        <div className="flex flex-wrap justify-center gap-6 mb-8 text-sm">
                            {[
                                { icon: Landmark, text: 'Ancient Temples' },
                                { icon: Mountain, text: 'Sacred Mountains' },
                                { icon: BookOpen, text: 'Mythological Sites' },
                                { icon: Star, text: 'Spiritual Experience' }
                            ].map((item, index) => (
                                <div key={index} className="flex items-center bg-orange-900/30 backdrop-blur-sm px-6 py-3 rounded-full border border-amber-300/20">
                                    <item.icon className="w-5 h-5 mr-2 text-amber-200" />
                                    <span className="text-amber-100">{item.text}</span>
                                </div>
                            ))}
                        </div>

                        <div className="flex flex-wrap justify-center gap-4 animate-scale-in">
                            <Button
                                size="lg"
                                className="bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-700 hover:to-amber-700 text-white px-10 py-7 text-lg rounded-full shadow-2xl transform hover:scale-105 transition-all duration-300"
                                onClick={() => document.getElementById('experiences')?.scrollIntoView({ behavior: 'smooth' })}
                            >
                                <BookOpen className="mr-2 w-5 h-5" />
                                Explore the Trail
                            </Button>

                            <Button
                                size="lg"
                                variant="outline"
                                className="bg-white/10 backdrop-blur-md border-2 border-white/50 text-white hover:bg-white/20 px-10 py-7 text-lg rounded-full shadow-2xl transform hover:scale-105 transition-all duration-300"
                            >
                                <Play className="mr-2 w-5 h-5" />
                                Watch Journey
                            </Button>
                        </div>

                        {/* Stats */}
                        <div className="grid grid-cols-3 gap-8 mt-16 max-w-3xl mx-auto">
                            {[
                                { icon: Landmark, label: 'Sacred Sites', value: '50+' },
                                { icon: MapPin, label: 'Destinations', value: '15+' },
                                { icon: Star, label: 'Pilgrim Rating', value: '4.9' }
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
                <section className="sticky top-16 z-40 bg-white/95 backdrop-blur-lg shadow-lg border-b border-orange-100">
                    <div className="container mx-auto px-4 py-6">
                        <div className="flex flex-wrap gap-4 items-center justify-between">
                            <div className="relative flex-1 min-w-[250px]">
                                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                                <Input
                                    placeholder="Search temples, sites, stories..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="pl-12 pr-4 py-6 rounded-full border-2 border-orange-200 focus:border-orange-500 bg-white shadow-sm"
                                />
                            </div>

                            <div className="flex gap-3 flex-wrap">
                                <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                                    <SelectTrigger className="w-[180px] rounded-full border-2 border-orange-200 bg-white shadow-sm">
                                        <Filter className="w-4 h-4 mr-2" />
                                        <SelectValue placeholder="Category" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">All Sites</SelectItem>
                                        <SelectItem value="pilgrimage">Pilgrimage</SelectItem>
                                        <SelectItem value="mythology">Mythology</SelectItem>
                                        <SelectItem value="historical">Historical</SelectItem>
                                        <SelectItem value="nature">Nature</SelectItem>
                                        <SelectItem value="adventure">Adventure</SelectItem>
                                    </SelectContent>
                                </Select>

                                <Select value={priceFilter} onValueChange={setPriceFilter}>
                                    <SelectTrigger className="w-[160px] rounded-full border-2 border-orange-200 bg-white shadow-sm">
                                        <SelectValue placeholder="Price Range" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">All Prices</SelectItem>
                                        <SelectItem value="budget">Under $500</SelectItem>
                                        <SelectItem value="mid">$500 - $1500</SelectItem>
                                        <SelectItem value="premium">$1500+</SelectItem>
                                    </SelectContent>
                                </Select>

                                <Badge className="px-4 py-2 bg-orange-100 text-orange-800 text-sm">
                                    {filteredTours.length} {filteredTours.length === 1 ? 'Journey' : 'Journeys'}
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
                                <div className="w-20 h-px bg-orange-600"></div>
                                <Sun className="w-8 h-8 mx-4 text-orange-600" />
                                <div className="w-20 h-px bg-orange-600"></div>
                            </div>
                            <Badge className="mb-4 px-6 py-2 bg-gradient-to-r from-orange-600 to-amber-600 text-white text-sm">
                                SACRED JOURNEYS
                            </Badge>
                            <h2 className="text-6xl font-serif font-bold bg-gradient-to-r from-orange-800 via-amber-700 to-orange-600 bg-clip-text text-transparent mb-6">
                                The Legend Comes Alive
                            </h2>
                            <p className="text-xl text-gray-600 max-w-3xl mx-auto font-serif leading-relaxed">
                                Experience the epic Ramayana through curated pilgrimages to significant sites across Sri Lanka
                            </p>
                        </div>

                        <TourGrid tours={filteredTours} onSelectTour={setSelectedTour} wishlist={wishlist} onToggleWishlist={toggleWishlist} />
                    </div>
                </section>

                {/* Why Choose Us */}
                <section className="py-20 bg-gradient-to-br from-orange-900 to-amber-900 text-white relative overflow-hidden">
                    <div className="absolute inset-0 opacity-10">
                        <div className="absolute top-0 left-0 w-96 h-96 bg-yellow-400 rounded-full blur-3xl"></div>
                        <div className="absolute bottom-0 right-0 w-96 h-96 bg-orange-400 rounded-full blur-3xl"></div>
                    </div>

                    <div className="container mx-auto px-4 relative z-10">
                        <div className="text-center mb-16">
                            <h2 className="text-5xl font-serif font-bold mb-6">Why Choose Our Ramayana Trail?</h2>
                            <p className="text-xl opacity-90 max-w-2xl mx-auto">
                                Deepen your spiritual connection with expert-guided pilgrimages
                            </p>
                        </div>

                        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                            {[
                                {
                                    icon: BookOpen,
                                    title: 'Expert Guides',
                                    description: 'Historians and spiritual guides well-versed in the Ramayana epic'
                                },
                                {
                                    icon: Landmark,
                                    title: 'Exclusive Access',
                                    description: 'Special pujas and access to sacred temple sanctums'
                                },
                                {
                                    icon: MapPin,
                                    title: 'Comprehensive Trail',
                                    description: 'Covering all major sites from Chilaw to Ella and beyond'
                                },
                                {
                                    icon: Heart,
                                    title: 'Comfort & Care',
                                    description: 'Luxury transport and accommodation for a peaceful journey'
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
                            <h2 className="text-5xl font-serif font-bold text-gray-900 mb-6">Pilgrim Testimonials</h2>
                            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                                Hear from devotees who have walked the path with us
                            </p>
                        </div>

                        <div className="grid md:grid-cols-3 gap-8">
                            {defaultReviews.slice(0, 3).map((review, idx) => (
                                <Card key={idx} className="hover:shadow-2xl transition-all duration-300 border-2 border-orange-100">
                                    <CardContent className="p-8">
                                        <div className="flex items-center mb-4">
                                            <div className="w-12 h-12 bg-gradient-to-br from-orange-400 to-amber-500 rounded-full flex items-center justify-center text-white font-bold text-lg mr-4">
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
                <section className="py-20 bg-gradient-to-r from-orange-700 via-amber-600 to-orange-600 text-white">
                    <div className="container mx-auto px-4 text-center">
                        <Sun className="w-20 h-20 mx-auto mb-6 animate-spin-slow" />
                        <h2 className="text-5xl font-serif font-bold mb-6">Begin Your Spiritual Journey</h2>
                        <p className="text-2xl mb-8 opacity-90 max-w-2xl mx-auto">
                            Let us guide you through the sacred legends of the Ramayana
                        </p>
                        <div className="flex flex-wrap justify-center gap-4">
                            <Button
                                size="lg"
                                className="bg-white text-orange-600 hover:bg-gray-100 px-10 py-7 text-lg rounded-full shadow-2xl transform hover:scale-105 transition-all duration-300"
                                onClick={() => document.getElementById('experiences')?.scrollIntoView({ behavior: 'smooth' })}
                            >
                                Book Your Pilgrimage
                            </Button>
                            <Button
                                size="lg"
                                variant="outline"
                                className="border-2 border-white text-white hover:bg-white/10 px-10 py-7 text-lg rounded-full shadow-2xl transform hover:scale-105 transition-all duration-300"
                            >
                                <MessageCircle className="mr-2 w-5 h-5" />
                                Chat with Expert
                            </Button>
                        </div>
                    </div>
                </section>
            </div>

            <Footer />

            {selectedTour && (
                <Dialog open={bookingDialogOpen} onOpenChange={setBookingDialogOpen}>
                    <BookingDialogContent tour={selectedTour} />
                </Dialog>
            )}
        </>
    );
};

// Tour Grid Component
const TourGrid = ({ tours, onSelectTour, wishlist, onToggleWishlist }: any) => {
    return (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {tours.map((tour: RamayanaTour) => (
                <Card
                    key={tour.id}
                    className="group hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 bg-white border-2 border-orange-100 overflow-hidden"
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
                                <Award className="w-3 h-3 mr-1" />
                                Popular Pilgrimage
                            </Badge>
                        )}
                        <Badge className="absolute top-4 right-12 bg-orange-600 text-white">
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
                        <CardTitle className="text-2xl font-serif text-gray-900 group-hover:text-orange-600 transition-colors">
                            {tour.title}
                        </CardTitle>
                        <div className="flex items-center text-gray-600">
                            <MapPin className="w-4 h-4 mr-2 text-orange-500" />
                            <span className="text-sm">{tour.location}</span>
                        </div>
                    </CardHeader>

                    <CardContent className="space-y-4">
                        <p className="text-gray-600 leading-relaxed line-clamp-2">
                            {tour.description}
                        </p>

                        <div className="flex flex-wrap gap-3 text-sm text-gray-600">
                            <div className="flex items-center">
                                <Clock className="w-4 h-4 mr-1 text-orange-500" />
                                {tour.duration}
                            </div>
                            <div className="flex items-center">
                                <Users className="w-4 h-4 mr-1 text-orange-500" />
                                Max {tour.maxGroupSize}
                            </div>
                        </div>

                        <div className="flex flex-wrap gap-2">
                            {tour.highlights.slice(0, 3).map((highlight, i) => (
                                <Badge key={i} variant="outline" className="text-xs border-orange-300 text-orange-700">
                                    {highlight}
                                </Badge>
                            ))}
                        </div>

                        <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                            <div className="text-3xl font-bold bg-gradient-to-r from-orange-600 to-amber-600 bg-clip-text text-transparent">
                                ${tour.price}
                                <span className="text-sm font-normal text-gray-500">/person</span>
                            </div>
                            <Dialog>
                                <DialogTrigger asChild>
                                    <Button
                                        className="bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-700 hover:to-amber-700 text-white rounded-full px-6 shadow-lg transform hover:scale-105 transition-all duration-300"
                                        onClick={() => onSelectTour(tour)}
                                    >
                                        View Details
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
const BookingDialogContent = ({ tour }: { tour: RamayanaTour }) => {
    const [bookingData, setBookingData] = useState({
        date: '',
        guests: 1,
        contactName: '',
        contactEmail: '',
        contactPhone: '',
        specialRequests: '',
    });

    const { user } = useAuth();
    const { toast } = useToast();

    const handleBookingSubmit = async () => {
        // Implementation similar to parent handleBooking
        // For now just show toast
        toast({
            title: "Booking Request Sent",
            description: "We will contact you shortly to confirm your pilgrimage.",
        });
    };

    return (
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
                <DialogTitle className="text-2xl font-serif">{tour.title}</DialogTitle>
                <DialogDescription>
                    Complete your booking for this sacred journey
                </DialogDescription>
            </DialogHeader>

            <div className="space-y-6 py-4">
                <div className="bg-orange-50 rounded-lg p-4 border border-orange-200">
                    <div className="flex justify-between items-start mb-3">
                        <div>
                            <div className="font-semibold text-gray-900">{tour.location}</div>
                            <div className="text-sm text-gray-600">{tour.duration}</div>
                        </div>
                        <div className="text-right">
                            <div className="text-2xl font-bold text-orange-600">${tour.price}</div>
                            <div className="text-sm text-gray-600">per person</div>
                        </div>
                    </div>

                    {tour.highlights && (
                        <div className="flex flex-wrap gap-2 mt-3">
                            {tour.highlights.slice(0, 4).map((highlight, i) => (
                                <Badge key={i} className="bg-orange-100 text-orange-800 text-xs">
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
                                className="border-orange-200 focus:border-orange-500"
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
                                className="border-orange-200 focus:border-orange-500"
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium">Full Name</label>
                        <Input
                            placeholder="Your full name"
                            value={bookingData.contactName}
                            onChange={(e) => setBookingData({ ...bookingData, contactName: e.target.value })}
                            className="border-orange-200 focus:border-orange-500"
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
                                className="border-orange-200 focus:border-orange-500"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Phone</label>
                            <Input
                                type="tel"
                                placeholder="+94 XX XXX XXXX"
                                value={bookingData.contactPhone}
                                onChange={(e) => setBookingData({ ...bookingData, contactPhone: e.target.value })}
                                className="border-orange-200 focus:border-orange-500"
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
                            className="border-orange-200 focus:border-orange-500 resize-none"
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
                            <span className="text-2xl font-bold text-orange-600">
                                ${tour.price * bookingData.guests}
                            </span>
                        </div>
                    </div>
                </div>

                <Button
                    className="w-full bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-700 hover:to-amber-700 text-white py-6 text-lg rounded-full shadow-lg"
                    onClick={handleBookingSubmit}
                >
                    Confirm Booking
                </Button>
            </div>
        </DialogContent>
    );
};

// Default data
const defaultRamayanaTours: RamayanaTour[] = [
    {
        id: '1',
        title: 'Complete Ramayana Trail',
        description: 'A comprehensive 10-day journey covering all major Ramayana sites from Chilaw to Ella, including Munneswaram, Manavari, and Ravana Falls.',
        location: 'Island-wide',
        duration: '10 Days',
        price: 1850,
        image: 'https://images.unsplash.com/photo-1588595280408-d42f76931a51?auto=format&fit=crop&w=800&q=80',
        rating: 4.9,
        reviews: 124,
        category: 'pilgrimage',
        highlights: ['Munneswaram Temple', 'Ashok Vatika', 'Ravana Falls', 'Divurumpola'],
        difficulty: 'Moderate',
        maxGroupSize: 12,
        included: ['Accommodation', 'Transport', 'Guide', 'Entry Fees'],
        featured: true
    },
    {
        id: '2',
        title: 'Hill Country Mythological Tour',
        description: 'Focus on the significant sites in the central highlands, including Sita Eliya and the footprints of Hanuman.',
        location: 'Nuwara Eliya & Ella',
        duration: '5 Days',
        price: 950,
        image: 'https://images.unsplash.com/photo-1589308078059-be1415eab4c3?auto=format&fit=crop&w=800&q=80',
        rating: 4.8,
        reviews: 89,
        category: 'mythology',
        highlights: ['Sita Amman Temple', 'Hakgala Gardens', 'Gayathri Peedam'],
        difficulty: 'Easy',
        maxGroupSize: 8,
        included: ['Accommodation', 'Transport', 'Guide'],
        featured: true
    },
    {
        id: '3',
        title: 'Ravana\'s Kingdom Adventure',
        description: 'Explore the legendary caves and waterfalls associated with King Ravana in the lush landscapes of Ella.',
        location: 'Ella',
        duration: '3 Days',
        price: 450,
        image: 'https://images.unsplash.com/photo-1586861635167-e5223aeb4227?auto=format&fit=crop&w=800&q=80',
        rating: 4.7,
        reviews: 56,
        category: 'adventure',
        highlights: ['Ravana Cave', 'Ravana Falls', 'Nil Diya Pokuna'],
        difficulty: 'Moderate',
        maxGroupSize: 10,
        included: ['Transport', 'Guide', 'Cave Trek'],
        featured: false
    }
];

const defaultReviews: Review[] = [
    {
        id: '1',
        tourId: '1',
        userName: 'Ramesh Kumar',
        rating: 5,
        comment: 'A truly spiritual experience. The guide was very knowledgeable about the Ramayana history.',
        date: '2024-02-15',
        helpful: 12
    },
    {
        id: '2',
        tourId: '1',
        userName: 'Priya Sharma',
        rating: 5,
        comment: 'Visiting Sita Eliya was the highlight of my trip. Very well organized tour.',
        date: '2024-01-20',
        helpful: 8
    },
    {
        id: '3',
        tourId: '2',
        userName: 'Anita Patel',
        rating: 4,
        comment: 'Beautiful locations and comfortable stay. Highly recommended for families.',
        date: '2023-12-10',
        helpful: 5
    }
];

export default RamayanaToursNew;
