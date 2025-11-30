import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { useNavigate } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
    Mountain, Clock, Users, Star, MapPin, Heart,
    Filter, Search, Play, Award, TreePine, Coffee, Train,
    Crown, Home, Leaf, TrendingUp, MessageCircle
} from 'lucide-react';
import { collection, getDocs, query, where, orderBy } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { BookingWizard } from '@/components/booking/BookingWizard';

interface CulturalTour {
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
    pickupOptions?: { id: string; label: string; time: string; additionalCost: number }[];
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

const CulturalToursNew = () => {
    const [tours, setTours] = useState<CulturalTour[]>([]);
    const [filteredTours, setFilteredTours] = useState<CulturalTour[]>([]);
    const [reviews, setReviews] = useState<Review[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedCategory, setSelectedCategory] = useState('all');
    const [searchQuery, setSearchQuery] = useState('');
    const [priceFilter, setPriceFilter] = useState('all');
    const [selectedTour, setSelectedTour] = useState<CulturalTour | null>(null);
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
            const toursRef = collection(db, 'cultural_tours');
            const q = query(toursRef, where('is_active', '==', true), orderBy('featured', 'desc'));
            const snapshot = await getDocs(q);

            const toursData: CulturalTour[] = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            } as CulturalTour));

            if (toursData.length === 0) {
                setTours(defaultCulturalTours);
            } else {
                setTours(toursData);
            }
        } catch (error) {
            console.error('Error fetching tours:', error);
            setTours(defaultCulturalTours);
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
            const reviewsRef = collection(db, 'cultural_reviews');
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
                    <p className="text-xl font-semibold text-gray-700">Loading Cultural Heritage Adventures...</p>
                </div>
            </div>
        );
    }

    return (
        <>
            <Helmet>
                <title>Luxury Cultural Heritage Tours Sri Lanka - UNESCO Heritage Retreats | Recharge Travels</title>
                <meta name="description" content="Discover exclusive tea estate retreats, colonial luxury, and misty mountain escapes. Private tastings, vintage railways, and premium hill country experiences in Sri Lanka." />
                <meta name="keywords" content="Sri Lanka hill country, tea estate tours, Nuwara Eliya, Ella, tea plantations, luxury mountain retreats" />
                <meta property="og:title" content="Luxury Cultural Heritage Tours Sri Lanka - Recharge Travels" />
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
                            Cultural Heritage
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
                                { icon: Train, text: 'Heritage Railways' },
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
                                Discover UNESCO Heritages
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
                                { icon: Home, label: 'Heritage Estates', value: '20+' },
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
                                    <SelectContent className="bg-white">
                                        <SelectItem value="all">All Experiences</SelectItem>
                                        <SelectItem value="temple-tour">Tea Tastings</SelectItem>
                                        <SelectItem value="heritage-stay">Estate Stays</SelectItem>
                                        <SelectItem value="ancient-city">Train Journeys</SelectItem>
                                        <SelectItem value="pilgrimage">Mountain Treks</SelectItem>
                                        <SelectItem value="multi-day">Multi-Day Tours</SelectItem>
                                    </SelectContent>
                                </Select>

                                <Select value={priceFilter} onValueChange={setPriceFilter}>
                                    <SelectTrigger className="w-[160px] rounded-full border-2 border-green-200 bg-white shadow-sm">
                                        <SelectValue placeholder="Price Range" />
                                    </SelectTrigger>
                                    <SelectContent className="bg-white">
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
                                UNESCO Heritage Adventures
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
                            <h2 className="text-5xl font-serif font-bold mb-6">Why Our UNESCO Heritage Retreats?</h2>
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
                                    description: 'Heritage bungalows with period furnishings and butler service'
                                },
                                {
                                    icon: Crown,
                                    title: 'Exclusive Access',
                                    description: 'Private estate tours and vintage train first-class carriages'
                                },
                                {
                                    icon: Leaf,
                                    title: 'Authentic Heritage',
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
                        <h2 className="text-5xl font-serif font-bold mb-6">Ready for Your Cultural Heritage Escape?</h2>
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
                <BookingWizard
                    tour={selectedTour}
                    onClose={() => setSelectedTour(null)}
                />
            )}
        </>
    );
};

// Tour Grid Component
const TourGrid = ({ tours, onSelectTour, wishlist, onToggleWishlist }: any) => {
    return (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {tours.map((tour: CulturalTour) => (
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
                            <Button
                                className="bg-gradient-to-r from-green-600 to-amber-600 hover:from-green-700 hover:to-amber-700 text-white rounded-full px-6 shadow-lg transform hover:scale-105 transition-all duration-300"
                                onClick={() => onSelectTour(tour)}
                            >
                                Reserve Now
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            ))}
        </div>
    );
};

// Default data
const defaultCulturalTours: CulturalTour[] = [
    {
        id: '1',
        title: 'Ceylon Tea Trails Experience',
        description: 'Journey through the misty hills of Hatton, visiting historic tea factories and staying in colonial bungalows.',
        location: 'Hatton, Central Highlands',
        duration: '2 Days',
        price: 450,
        image: 'https://images.unsplash.com/photo-1566296314736-6eaac1ca0cb9?auto=format&fit=crop&w=800&q=80',
        rating: 4.9,
        reviews: 128,
        category: 'heritage-stay',
        highlights: ['Tea Factory Visit', 'Colonial Bungalow Stay', 'Tea Tasting Session', 'Scenic Train Ride'],
        difficulty: 'Easy',
        maxGroupSize: 8,
        included: ['Accommodation', 'All Meals', 'Transport', 'Guide'],
        pickupOptions: [
            { id: 'colombo', label: 'Colombo', time: '06:00 AM', additionalCost: 0 },
            { id: 'kandy', label: 'Kandy', time: '08:00 AM', additionalCost: 0 },
            { id: 'negombo', label: 'Negombo', time: '05:30 AM', additionalCost: 20 }
        ],
        estateType: 'Premium',
        altitude: '1200m',
        featured: true
    },
    {
        id: '2',
        title: 'Ella Rock & Nine Arch Bridge',
        description: 'Explore the famous Nine Arch Bridge and hike up Ella Rock for breathtaking panoramic views.',
        location: 'Ella, Badulla',
        duration: '1 Day',
        price: 85,
        image: 'https://images.unsplash.com/photo-1588258524675-c61d334d6260?auto=format&fit=crop&w=800&q=80',
        rating: 4.8,
        reviews: 342,
        category: 'pilgrimage',
        highlights: ['Nine Arch Bridge', 'Ella Rock Hike', 'Little Adams Peak', 'Ravana Falls'],
        difficulty: 'Moderate',
        maxGroupSize: 12,
        included: ['Lunch', 'Guide', 'Transport'],
        pickupOptions: [
            { id: 'ella', label: 'Ella Town', time: '07:00 AM', additionalCost: 0 },
            { id: 'bandarawela', label: 'Bandarawela', time: '06:30 AM', additionalCost: 10 }
        ],
        altitude: '1041m',
        featured: true
    },
    {
        id: '3',
        title: 'Nuwara Eliya Colonial Tour',
        description: 'Step back in time in "Little England", visiting the Grand Hotel, Victoria Park, and Gregory Lake.',
        location: 'Nuwara Eliya',
        duration: '1 Day',
        price: 120,
        image: 'https://images.unsplash.com/photo-1546522589-9b626156e792?auto=format&fit=crop&w=800&q=80',
        rating: 4.7,
        reviews: 215,
        category: 'temple-tour',
        highlights: ['Grand Hotel High Tea', 'Gregory Lake Boat Ride', 'Victoria Park', 'Post Office'],
        difficulty: 'Easy',
        maxGroupSize: 10,
        included: ['High Tea', 'Entrance Fees', 'Transport'],
        pickupOptions: [
            { id: 'nuwara-eliya', label: 'Nuwara Eliya Hotel', time: '09:00 AM', additionalCost: 0 }
        ],
        altitude: '1868m',
        featured: false
    }
];

const defaultReviews: Review[] = [
    {
        id: '1',
        tourId: '1',
        userName: 'Sarah Jenkins',
        rating: 5,
        comment: 'The Tea Trails experience was absolutely magical. The bungalow was exquisite and the service impeccable.',
        date: '2 weeks ago',
        helpful: 12
    },
    {
        id: '2',
        tourId: '1',
        userName: 'David Chen',
        rating: 5,
        comment: 'Walking through the tea plantations at sunrise was the highlight of our trip. Highly recommended!',
        date: '1 month ago',
        helpful: 8
    },
    {
        id: '3',
        tourId: '2',
        userName: 'Emma Wilson',
        rating: 4,
        comment: 'Ella is beautiful but the hike can be a bit steep. The view is worth it though!',
        date: '3 weeks ago',
        helpful: 15
    }
];

export default CulturalToursNew;
