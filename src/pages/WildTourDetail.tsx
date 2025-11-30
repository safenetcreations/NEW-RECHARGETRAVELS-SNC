import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { db } from '@/lib/firebase';
import { collection, addDoc } from 'firebase/firestore';
import {
    MapPin, Clock, Users, Star, Check, Shield, AlertTriangle,
    Calendar, MessageCircle, ArrowLeft, Play, Image as ImageIcon,
    Mountain, Leaf, Coffee
} from 'lucide-react';
import { defaultWildToursTours, WildToursTour } from '@/data/wildToursNewData';

const WildTourDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { toast } = useToast();
    const { user } = useAuth();
    const [tour, setTour] = useState<WildToursTour | null>(null);
    const [bookingDialogOpen, setBookingDialogOpen] = useState(false);
    const [activeTab, setActiveTab] = useState('overview');

    useEffect(() => {
        const foundTour = defaultWildToursTours.find(t => t.id === id);
        if (foundTour) {
            setTour(foundTour);
        } else {
            // Handle not found
            navigate('/tours/wildtours');
        }
    }, [id, navigate]);

    const handleBooking = async (bookingData: any) => {
        try {
            if (!user) {
                toast({
                    title: "Login Required",
                    description: "Please login to book this experience",
                    variant: "destructive",
                });
                navigate('/login');
                return;
            }

            const bookingsRef = collection(db, 'wildtours_bookings');
            await addDoc(bookingsRef, {
                ...bookingData,
                userId: user.uid,
                status: 'pending',
                createdAt: new Date().toISOString(),
            });

            toast({
                title: "Booking Submitted!",
                description: "Your experience has been booked. We'll contact you soon.",
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

    if (!tour) return null;

    return (
        <>
            <Helmet>
                <title>{tour.title} - Wild Tours | Recharge Travels</title>
                <meta name="description" content={tour.description} />
            </Helmet>

            <div className="min-h-screen bg-slate-50">
                <Header />

                {/* Hero Section */}
                <div className="relative h-[70vh] w-full overflow-hidden">
                    <img
                        src={tour.image}
                        alt={tour.title}
                        className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />

                    <div className="absolute top-24 left-4 md:left-8 z-20">
                        <Button
                            variant="ghost"
                            className="text-white hover:bg-white/20 gap-2"
                            onClick={() => navigate('/tours/wildtours')}
                        >
                            <ArrowLeft className="w-5 h-5" />
                            Back to Wild Tours
                        </Button>
                    </div>

                    <div className="absolute bottom-0 left-0 right-0 p-8 md:p-16 text-white max-w-7xl mx-auto">
                        <div className="flex flex-wrap gap-3 mb-4">
                            <Badge className="bg-green-600 hover:bg-green-700 text-white border-none text-sm px-3 py-1">
                                {tour.category}
                            </Badge>
                            {tour.featured && (
                                <Badge className="bg-amber-500 hover:bg-amber-600 text-white border-none text-sm px-3 py-1">
                                    Premium Experience
                                </Badge>
                            )}
                        </div>
                        <h1 className="text-4xl md:text-6xl font-serif font-bold mb-4 leading-tight">
                            {tour.title}
                        </h1>
                        <div className="flex flex-wrap gap-6 text-sm md:text-base opacity-90">
                            <div className="flex items-center gap-2">
                                <MapPin className="w-5 h-5 text-green-400" />
                                {tour.location}
                            </div>
                            <div className="flex items-center gap-2">
                                <Clock className="w-5 h-5 text-green-400" />
                                {tour.duration}
                            </div>
                            <div className="flex items-center gap-2">
                                <Star className="w-5 h-5 text-yellow-400 fill-current" />
                                {tour.rating} ({tour.reviews} reviews)
                            </div>
                        </div>
                    </div>
                </div>

                {/* Main Content */}
                <div className="max-w-7xl mx-auto px-4 py-12 grid lg:grid-cols-[1fr_380px] gap-12">

                    {/* Left Column */}
                    <div className="space-y-12">

                        {/* Overview */}
                        <section>
                            <h2 className="text-3xl font-serif font-bold text-slate-900 mb-6">Experience Overview</h2>
                            <p className="text-lg text-slate-700 leading-relaxed mb-8">
                                {tour.description}
                            </p>

                            <div className="grid sm:grid-cols-2 gap-4">
                                {tour.highlights.map((highlight, idx) => (
                                    <div key={idx} className="flex items-start gap-3 p-4 rounded-xl bg-white border border-slate-100 shadow-sm">
                                        <div className="p-2 rounded-full bg-green-50 text-green-600">
                                            <Check className="w-5 h-5" />
                                        </div>
                                        <span className="font-medium text-slate-700 pt-1">{highlight}</span>
                                    </div>
                                ))}
                            </div>
                        </section>

                        {/* Video Section */}
                        {tour.videoUrl && (
                            <section>
                                <h2 className="text-3xl font-serif font-bold text-slate-900 mb-6 flex items-center gap-3">
                                    <Play className="w-8 h-8 text-red-600 fill-current" />
                                    Video Tour
                                </h2>
                                <div className="aspect-video rounded-2xl overflow-hidden shadow-xl">
                                    <iframe
                                        width="100%"
                                        height="100%"
                                        src={tour.videoUrl}
                                        title="Tour Video"
                                        frameBorder="0"
                                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                        allowFullScreen
                                    ></iframe>
                                </div>
                            </section>
                        )}

                        {/* Gallery */}
                        {tour.gallery && tour.gallery.length > 0 && (
                            <section>
                                <h2 className="text-3xl font-serif font-bold text-slate-900 mb-6 flex items-center gap-3">
                                    <ImageIcon className="w-8 h-8 text-blue-600" />
                                    Photo Gallery
                                </h2>
                                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                    {tour.gallery.map((img, idx) => (
                                        <div key={idx} className={`rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 ${idx === 0 ? 'md:col-span-2 md:row-span-2' : ''}`}>
                                            <img
                                                src={img}
                                                alt={`Gallery ${idx + 1}`}
                                                className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                                            />
                                        </div>
                                    ))}
                                </div>
                            </section>
                        )}

                        {/* Inclusions & Important Info */}
                        <section className="grid md:grid-cols-2 gap-8">
                            <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm">
                                <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                                    <Shield className="w-6 h-6 text-green-600" />
                                    What's Included
                                </h3>
                                <ul className="space-y-3">
                                    {tour.included.map((item, idx) => (
                                        <li key={idx} className="flex items-start gap-3 text-slate-600">
                                            <div className="w-1.5 h-1.5 rounded-full bg-green-500 mt-2" />
                                            {item}
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            <div className="bg-amber-50 p-8 rounded-3xl border border-amber-100">
                                <h3 className="text-xl font-bold mb-6 flex items-center gap-2 text-amber-800">
                                    <AlertTriangle className="w-6 h-6 text-amber-600" />
                                    Important Notes
                                </h3>
                                <ul className="space-y-3">
                                    {tour.importantInfo?.map((item, idx) => (
                                        <li key={idx} className="flex items-start gap-3 text-amber-900/80">
                                            <div className="w-1.5 h-1.5 rounded-full bg-amber-500 mt-2" />
                                            {item}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </section>

                        {/* Best Season */}
                        {tour.bestSeason && (
                            <section className="bg-gradient-to-r from-green-50 to-emerald-50 p-8 rounded-3xl border border-green-100">
                                <div className="flex items-start gap-4">
                                    <div className="p-3 bg-white rounded-full shadow-sm">
                                        <Calendar className="w-8 h-8 text-green-600" />
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-bold text-slate-900 mb-2">Best Time to Visit</h3>
                                        <p className="text-slate-700">{tour.bestSeason}</p>
                                        <p className="text-sm text-slate-500 mt-2">
                                            This period offers the best weather conditions and wildlife sighting opportunities for this specific tour.
                                        </p>
                                    </div>
                                </div>
                            </section>
                        )}

                    </div>

                    {/* Right Column - Sticky Booking Card */}
                    <div className="lg:sticky lg:top-24 h-fit space-y-6">
                        <Card className="border-none shadow-2xl bg-white rounded-3xl overflow-hidden">
                            <div className="bg-slate-900 p-6 text-white text-center">
                                <p className="text-sm uppercase tracking-widest opacity-70 mb-1">Starting From</p>
                                <div className="text-4xl font-bold">
                                    ${tour.price}
                                    <span className="text-lg font-normal opacity-70">/person</span>
                                </div>
                            </div>
                            <CardContent className="p-6 space-y-6">
                                <div className="space-y-4 text-sm text-slate-600">
                                    <div className="flex justify-between py-2 border-b border-slate-100">
                                        <span className="flex items-center gap-2"><Clock className="w-4 h-4" /> Duration</span>
                                        <span className="font-medium text-slate-900">{tour.duration}</span>
                                    </div>
                                    <div className="flex justify-between py-2 border-b border-slate-100">
                                        <span className="flex items-center gap-2"><Users className="w-4 h-4" /> Group Size</span>
                                        <span className="font-medium text-slate-900">Max {tour.maxGroupSize}</span>
                                    </div>
                                    <div className="flex justify-between py-2 border-b border-slate-100">
                                        <span className="flex items-center gap-2"><Mountain className="w-4 h-4" /> Difficulty</span>
                                        <span className="font-medium text-slate-900">{tour.difficulty}</span>
                                    </div>
                                </div>

                                <Button
                                    className="w-full py-6 text-lg font-semibold bg-gradient-to-r from-green-600 to-amber-600 hover:from-green-700 hover:to-amber-700 shadow-lg hover:shadow-xl transition-all duration-300 rounded-xl"
                                    onClick={() => setBookingDialogOpen(true)}
                                >
                                    Reserve Now
                                </Button>

                                <p className="text-xs text-center text-slate-400">
                                    Free cancellation up to 48 hours before departure
                                </p>
                            </CardContent>
                        </Card>

                        <div className="bg-white p-6 rounded-3xl shadow-lg border border-slate-100">
                            <h4 className="font-bold text-slate-900 mb-4 flex items-center gap-2">
                                <MessageCircle className="w-5 h-5 text-green-600" />
                                Need Help?
                            </h4>
                            <p className="text-sm text-slate-600 mb-4">
                                Speak to our wild tour specialists for custom requirements.
                            </p>
                            <Button variant="outline" className="w-full border-2 hover:bg-slate-50">
                                Contact Specialist
                            </Button>
                        </div>
                    </div>

                </div>

                <Footer />

                <BookingDialog
                    tour={tour}
                    open={bookingDialogOpen}
                    onOpenChange={setBookingDialogOpen}
                    onBook={handleBooking}
                />
            </div>
        </>
    );
};

// Reusing the BookingDialog component logic (simplified for this file)
const BookingDialogContent = ({ tour, onBook }: { tour: WildToursTour; onBook?: (data: any) => void }) => {
    const [bookingData, setBookingData] = useState({
        date: '',
        guests: 2,
        contactName: '',
        contactEmail: '',
        contactPhone: '',
        country: '',
        pickupLocation: tour.startLocation || tour.location,
        specialRequests: ''
    });

    const totalPrice = tour.price * (bookingData.guests || 1);
    const holdingDeposit = Math.round(totalPrice * 0.2);

    const handleSubmit = () => {
        if (!onBook) return;

        // Basic Validation
        if (!bookingData.date) {
            alert("Please select a date.");
            return;
        }
        if (!bookingData.contactName || !bookingData.contactEmail || !bookingData.contactPhone) {
            alert("Please fill in your contact details.");
            return;
        }
        if (!bookingData.guests || isNaN(bookingData.guests) || bookingData.guests < 1) {
            alert("Please enter a valid number of guests.");
            return;
        }

        onBook({
            tourId: tour.id,
            tourTitle: tour.title,
            ...bookingData,
            guests: Number(bookingData.guests) // Ensure it's a number
        });
    };

    return (
        <DialogContent className="max-w-5xl w-[95vw] max-h-[85vh] overflow-y-auto p-0 border-none bg-transparent shadow-none top-12 translate-y-0 sm:top-24">
            <div className="grid lg:grid-cols-[1.05fr_0.95fr] gap-0 rounded-3xl border border-emerald-100 bg-white/95 shadow-2xl">
                <div className="relative bg-gradient-to-b from-slate-50 to-white hidden lg:block">
                    <div className="relative h-full w-full overflow-hidden rounded-l-3xl">
                        <img
                            src={tour.image}
                            alt={tour.title}
                            className="h-full w-full object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                        <div className="absolute bottom-8 left-8 text-white">
                            <p className="text-sm uppercase tracking-widest mb-2 opacity-80">Confirm Booking</p>
                            <h3 className="text-3xl font-serif font-bold">{tour.title}</h3>
                        </div>
                    </div>
                </div>

                <div className="space-y-6 bg-white/90 p-6 lg:p-8">
                    <DialogHeader className="text-left space-y-2">
                        <DialogTitle className="text-2xl font-semibold text-slate-900">Reserve your spot</DialogTitle>
                        <DialogDescription className="text-sm text-slate-500">
                            Complete your reservation details below.
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
                                    className="rounded-xl bg-slate-50"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-slate-600">Guests</label>
                                <Input
                                    type="number"
                                    min="1"
                                    max={tour.maxGroupSize}
                                    value={bookingData.guests}
                                    onChange={(e) => setBookingData({ ...bookingData, guests: parseInt(e.target.value) || 0 })}
                                    className="rounded-xl bg-slate-50"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium text-slate-600">Full Name</label>
                            <Input
                                placeholder="Your full name"
                                value={bookingData.contactName}
                                onChange={(e) => setBookingData({ ...bookingData, contactName: e.target.value })}
                                className="rounded-xl bg-slate-50"
                            />
                        </div>

                        <div className="grid gap-4 sm:grid-cols-2">
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-slate-600">Email</label>
                                <Input
                                    type="email"
                                    placeholder="you@email.com"
                                    value={bookingData.contactEmail}
                                    onChange={(e) => setBookingData({ ...bookingData, contactEmail: e.target.value })}
                                    className="rounded-xl bg-slate-50"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-slate-600">Phone</label>
                                <Input
                                    type="tel"
                                    placeholder="+94..."
                                    value={bookingData.contactPhone}
                                    onChange={(e) => setBookingData({ ...bookingData, contactPhone: e.target.value })}
                                    className="rounded-xl bg-slate-50"
                                />
                            </div>
                        </div>

                        <div className="grid gap-4 sm:grid-cols-2">
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-slate-600">Country</label>
                                <Input
                                    placeholder="Your Country"
                                    value={bookingData.country}
                                    onChange={(e) => setBookingData({ ...bookingData, country: e.target.value })}
                                    className="rounded-xl bg-slate-50"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-slate-600">Pickup Location</label>
                                <Input
                                    placeholder="Hotel or Airport"
                                    value={bookingData.pickupLocation}
                                    onChange={(e) => setBookingData({ ...bookingData, pickupLocation: e.target.value })}
                                    className="rounded-xl bg-slate-50"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium text-slate-600">Special Requests</label>
                            <Textarea
                                placeholder="Dietary requirements, etc."
                                value={bookingData.specialRequests}
                                onChange={(e) => setBookingData({ ...bookingData, specialRequests: e.target.value })}
                                className="rounded-xl bg-slate-50"
                            />
                        </div>
                    </div>

                    <div className="bg-slate-50 p-4 rounded-xl space-y-2">
                        <div className="flex justify-between text-sm">
                            <span className="text-slate-600">Total Price</span>
                            <span className="font-semibold">${totalPrice}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                            <span className="text-slate-600">Deposit Required (20%)</span>
                            <span className="font-bold text-green-600">${holdingDeposit}</span>
                        </div>
                    </div>

                    <Button
                        className="w-full py-6 text-lg font-semibold bg-green-600 hover:bg-green-700 rounded-xl"
                        onClick={handleSubmit}
                    >
                        Confirm Request
                    </Button>
                </div>
            </div>
        </DialogContent>
    );
};

const BookingDialog = ({ tour, open, onOpenChange, onBook }: any) => {
    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <BookingDialogContent tour={tour} onBook={onBook} />
        </Dialog>
    );
};

export default WildTourDetail;
