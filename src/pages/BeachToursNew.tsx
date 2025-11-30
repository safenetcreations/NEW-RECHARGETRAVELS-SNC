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
    Waves, Sun, Umbrella, Anchor, Palmtree, Fish, Ship, MapPin, Clock, Users, Star, Heart, Check, Search, Filter, Crown, Calendar, Mail, Phone
} from 'lucide-react';
import BookingDialogContent from '@/components/tours/BookingDialogContent';
import { collection, getDocs, query, where, orderBy, addDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { BeachTour } from '@/types/beachTour';
import { defaultBeachTours } from '@/data/beachToursData';

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

const BeachToursNew = () => {
    const [tours, setTours] = useState<BeachTour[]>([]);
    const [filteredTours, setFilteredTours] = useState<BeachTour[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedCategory, setSelectedCategory] = useState('all');
    const [searchQuery, setSearchQuery] = useState('');
    const [priceFilter, setPriceFilter] = useState('all');
    const [selectedTour, setSelectedTour] = useState<BeachTour | null>(null);
    const [bookingDialogOpen, setBookingDialogOpen] = useState(false);
    const [wishlist, setWishlist] = useState<string[]>([]);

    const { user } = useAuth();
    const { toast } = useToast();
    const navigate = useNavigate();

    useEffect(() => {
        fetchTours();
    }, []);

    useEffect(() => {
        filterTours();
    }, [tours, selectedCategory, searchQuery, priceFilter]);

    const fetchTours = async () => {
        try {
            setLoading(true);
            const toursRef = collection(db, 'beach_tours');
            const q = query(toursRef, where('is_active', '==', true), orderBy('featured', 'desc'));
            const snapshot = await getDocs(q);

            const toursData: BeachTour[] = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            } as BeachTour));

            if (toursData.length === 0) {
                setTours(defaultBeachTours);
            } else {
                setTours(toursData);
            }
        } catch (error) {
            console.error('Error fetching tours:', error);
            setTours(defaultBeachTours);
            toast({
                title: "Info",
                description: "Using default tour data",
            });
        } finally {
            setLoading(false);
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
                    filtered = filtered.filter(tour => tour.price < 50);
                    break;
                case 'mid':
                    filtered = filtered.filter(tour => tour.price >= 50 && tour.price < 150);
                    break;
                case 'premium':
                    filtered = filtered.filter(tour => tour.price >= 150);
                    break;
            }
        }

        setFilteredTours(filtered);
    };

    const handleBooking = async (data: Booking) => {
        try {
            // Create Booking in Firestore
            const bookingRef = await addDoc(collection(db, 'beach_bookings'), {
                ...data,
                userId: user?.uid || 'guest',
                status: 'pending',
                paymentStatus: 'pending_payment',
                createdAt: new Date(),
                totalAmount: selectedTour ? selectedTour.price * data.guests : 0
            });

            // Close the dialog
            setBookingDialogOpen(false);

            // Show success message
            toast({
                title: "✅ Booking Request Received!",
                description: `Your booking (${bookingRef.id}) has been submitted. Our team will contact you shortly to confirm payment details.`,
                duration: 6000,
            });

            console.log('Booking created:', bookingRef.id);

        } catch (error) {
            console.error("Error saving booking:", error);
            toast({
                title: "Booking Failed",
                description: "There was an error saving your booking. Please try again.",
                variant: "destructive"
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
            <div className="min-h-screen bg-blue-50 flex items-center justify-center">
                <div className="text-center">
                    <Waves className="w-16 h-16 mx-auto mb-4 text-blue-600 animate-bounce" />
                    <p className="text-xl font-semibold text-gray-700">Loading Beach Adventures...</p>
                </div>
            </div>
        );
    }

    return (
        <>
            <Helmet>
                <title>Luxury Beach & Coastal Tours Sri Lanka | Recharge Travels</title>
                <meta name="description" content="Discover pristine beaches, water sports, whale watching, and coastal luxury in Sri Lanka. Book your perfect beach getaway with Recharge Travels." />
                <meta name="keywords" content="Sri Lanka beach tours, whale watching Mirissa, surfing Arugam Bay, snorkeling Trincomalee, Bentota water sports" />
            </Helmet>

            <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
                <Header />

                {/* Hero Section */}
                <section className="relative h-[80vh] flex items-center justify-center overflow-hidden">
                    <div
                        className="absolute inset-0 bg-cover bg-center transform scale-105"
                        style={{
                            backgroundImage: `url('https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=2073&q=80')`,
                        }}
                    >
                        <div className="absolute inset-0 bg-gradient-to-b from-blue-900/40 via-transparent to-blue-900/60" />
                    </div>

                    <div className="relative z-10 text-center text-white px-4 max-w-5xl mx-auto">
                        <div className="mb-6 flex justify-center gap-2 animate-fade-in">
                            <Badge className="bg-blue-500/90 text-white px-4 py-2 text-sm backdrop-blur-sm">
                                <Waves className="w-4 h-4 mr-2 inline" />
                                Coastal Paradise
                            </Badge>
                            <Badge className="bg-amber-500/90 text-white px-4 py-2 text-sm backdrop-blur-sm">
                                <Sun className="w-4 h-4 mr-2 inline" />
                                Endless Summer
                            </Badge>
                        </div>

                        <h1 className="text-6xl md:text-8xl font-serif font-bold mb-6 animate-fade-in leading-tight drop-shadow-lg">
                            Sri Lanka's
                            <span className="block text-amber-300">
                                Golden Coasts
                            </span>
                        </h1>

                        <p className="text-xl md:text-2xl font-light mb-8 animate-fade-in opacity-95 max-w-3xl mx-auto drop-shadow-md">
                            From the surfing waves of Arugam Bay to the pristine sands of Mirissa.
                            Experience the ultimate tropical island getaway.
                        </p>

                        <div className="flex flex-wrap justify-center gap-4 animate-scale-in">
                            <Button
                                size="lg"
                                className="bg-amber-500 hover:bg-amber-600 text-white px-8 py-6 text-lg rounded-full shadow-xl transition-all duration-300"
                                onClick={() => document.getElementById('tours')?.scrollIntoView({ behavior: 'smooth' })}
                            >
                                Explore Beaches
                            </Button>
                        </div>
                    </div>
                </section>

                {/* Search & Filter Bar */}
                <section className="sticky top-16 z-40 bg-white/95 backdrop-blur-lg shadow-md border-b border-blue-100">
                    <div className="container mx-auto px-4 py-4">
                        <div className="flex flex-wrap gap-4 items-center justify-between">
                            <div className="relative flex-1 min-w-[250px]">
                                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                                <Input
                                    placeholder="Search beaches, activities, locations..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="pl-12 pr-4 py-2 rounded-full border-blue-200 focus:border-blue-500 bg-blue-50/50"
                                />
                            </div>

                            <div className="flex gap-3 flex-wrap">
                                <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                                    <SelectTrigger className="w-[180px] rounded-full border-blue-200 bg-white">
                                        <Filter className="w-4 h-4 mr-2" />
                                        <SelectValue placeholder="Activity Type" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">All Activities</SelectItem>
                                        <SelectItem value="surfing">Surfing</SelectItem>
                                        <SelectItem value="diving">Diving</SelectItem>
                                        <SelectItem value="snorkeling">Snorkeling</SelectItem>
                                        <SelectItem value="watersports">Water Sports</SelectItem>
                                        <SelectItem value="relaxation">Relaxation</SelectItem>
                                        <SelectItem value="luxury">Luxury Cruise</SelectItem>
                                        <SelectItem value="family">Family Fun</SelectItem>
                                    </SelectContent>
                                </Select>

                                <Select value={priceFilter} onValueChange={setPriceFilter}>
                                    <SelectTrigger className="w-[160px] rounded-full border-blue-200 bg-white">
                                        <SelectValue placeholder="Price Range" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">All Prices</SelectItem>
                                        <SelectItem value="budget">Budget (&lt;$50)</SelectItem>
                                        <SelectItem value="mid">Mid ($50-$150)</SelectItem>
                                        <SelectItem value="premium">Premium ($150+)</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Tours Grid */}
                <section id="tours" className="py-16 container mx-auto px-4">
                    <div className="text-center mb-12">
                        <h2 className="text-4xl font-bold text-blue-900 mb-4">Coastal Adventures</h2>
                        <p className="text-gray-600 max-w-2xl mx-auto">
                            Discover our hand-picked selection of the best beach experiences in Sri Lanka.
                        </p>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {filteredTours.map((tour) => (
                            <Card key={tour.id} className="group hover:shadow-2xl transition-all duration-300 border-blue-100 overflow-hidden flex flex-col bg-blue-50">
                                <div className="relative h-64 overflow-hidden">
                                    <img
                                        src={tour.image}
                                        alt={tour.title}
                                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                                    <div className="absolute top-4 right-4">
                                        <button
                                            onClick={() => toggleWishlist(tour.id)}
                                            className="p-2 bg-white/90 rounded-full hover:bg-white transition-colors shadow-sm"
                                        >
                                            <Heart className={`w-5 h-5 ${wishlist.includes(tour.id) ? 'text-red-500 fill-current' : 'text-gray-600'}`} />
                                        </button>
                                    </div>

                                    <div className="absolute top-4 left-4">
                                        <Badge className="bg-blue-600 text-white hover:bg-blue-700">
                                            {tour.category}
                                        </Badge>
                                    </div>

                                    <div className="absolute bottom-4 left-4 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                        <div className="flex items-center gap-1">
                                            <Star className="w-4 h-4 text-yellow-400 fill-current" />
                                            <span className="font-bold">{tour.rating}</span>
                                            <span className="text-sm text-gray-200">({tour.reviews} reviews)</span>
                                        </div>
                                    </div>
                                </div>

                                <CardContent className="p-6 flex-1 flex flex-col">
                                    <div className="flex justify-between items-start mb-2">
                                        <h3 className="text-xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors line-clamp-1">
                                            {tour.title}
                                        </h3>
                                    </div>

                                    <div className="flex items-center text-gray-500 text-sm mb-4">
                                        <MapPin className="w-4 h-4 mr-1 text-blue-500" />
                                        {tour.location}
                                    </div>

                                    <p className="text-gray-600 text-sm mb-4 line-clamp-2 flex-1">
                                        {tour.description}
                                    </p>

                                    <div className="flex flex-wrap gap-2 mb-4">
                                        {tour.highlights.slice(0, 3).map((h, i) => (
                                            <Badge key={i} variant="secondary" className="text-xs bg-blue-50 text-blue-700">
                                                {h}
                                            </Badge>
                                        ))}
                                    </div>

                                    <div className="flex items-center justify-between pt-4 border-t border-gray-100 mt-auto">
                                        <div>
                                            <span className="text-xs text-gray-500 block">From</span>
                                            <span className="text-2xl font-bold text-blue-900">${tour.price}</span>
                                            <span className="text-xs text-gray-500"> / person</span>
                                        </div>
                                        <Dialog open={bookingDialogOpen && selectedTour?.id === tour.id} onOpenChange={(open) => {
                                            setBookingDialogOpen(open);
                                            if (!open) setSelectedTour(null);
                                        }}>
                                            <DialogTrigger asChild>
                                                <Button
                                                    className="bg-blue-600 hover:bg-blue-700 text-white rounded-full px-6"
                                                    onClick={() => {
                                                        setSelectedTour(tour);
                                                        setBookingDialogOpen(true);
                                                    }}
                                                >
                                                    Book Now
                                                </Button>
                                            </DialogTrigger>
                                            <BookingDialogContent tour={tour} onBook={handleBooking} />
                                        </Dialog>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </section>

                {/* Why Choose Us */}
                <section className="py-20 bg-blue-900 text-white relative overflow-hidden">
                    <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>
                    <div className="container mx-auto px-4 relative z-10">
                        <div className="text-center mb-16">
                            <h2 className="text-4xl font-bold mb-4">Why Choose Our Beach Tours?</h2>
                            <p className="text-blue-200 max-w-2xl mx-auto">
                                We specialize in creating unforgettable coastal experiences with safety and luxury in mind.
                            </p>
                        </div>

                        <div className="grid md:grid-cols-4 gap-8">
                            {[
                                { icon: Anchor, title: 'Expert Guides', desc: 'Certified instructors and local experts' },
                                { icon: Umbrella, title: 'Premium Gear', desc: 'Top quality equipment included' },
                                { icon: Ship, title: 'Private Boats', desc: 'Luxury vessels for your comfort' },
                                { icon: Fish, title: 'Eco Friendly', desc: 'Sustainable tourism practices' }
                            ].map((item, idx) => (
                                <div key={idx} className="text-center p-6 rounded-xl bg-white/5 backdrop-blur-sm hover:bg-white/10 transition-colors">
                                    <item.icon className="w-12 h-12 mx-auto mb-4 text-amber-400" />
                                    <h3 className="text-xl font-bold mb-2">{item.title}</h3>
                                    <p className="text-blue-200 text-sm">{item.desc}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>
            </div>
            <Footer />
        </>
    );
};

export default BeachToursNew;
