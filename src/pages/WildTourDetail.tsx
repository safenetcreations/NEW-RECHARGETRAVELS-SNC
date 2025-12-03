import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { BookingDialog } from '@/components/wildTours/BookingDialog';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { wildToursService, WildTourFirestore } from '@/services/firebaseWildToursService';
import { wildToursData, EnhancedTourPackage } from '@/data/wildToursData';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import {
  ArrowLeft,
  MapPin,
  Clock,
  Star,
  Users,
  Calendar,
  Check,
  Shield,
  AlertTriangle,
  MessageCircle,
  Mountain,
  Phone,
  Mail,
  CheckCircle,
  XCircle,
  Camera,
  Utensils,
  Bed,
  Car,
  Share2,
  Heart
} from 'lucide-react';

const WildTourDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useAuth();
  const [tour, setTour] = useState<WildTourFirestore | EnhancedTourPackage | null>(null);
  const [loading, setLoading] = useState(true);
  const [bookingDialogOpen, setBookingDialogOpen] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);

  useEffect(() => {
    const fetchTour = async () => {
      if (!id) return;
      setLoading(true);
      try {
        // Try fetching from Firestore first
        const firestoreTour = await wildToursService.getTourById(id);
        if (firestoreTour) {
          setTour(firestoreTour);
        } else {
          // Fallback to static data
          const allTours = Object.values(wildToursData).flat();
          const foundTour = allTours.find(t => t.id === id);
          if (foundTour) {
            setTour(foundTour);
          } else {
            navigate('/tours/wildtours');
          }
        }
      } catch (error) {
        console.error('Error fetching tour:', error);
        // Fallback to static data on error
        const allTours = Object.values(wildToursData).flat();
        const foundTour = allTours.find(t => t.id === id);
        if (foundTour) {
          setTour(foundTour);
        } else {
          navigate('/tours/wildtours');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchTour();
  }, [id, navigate]);

  const handleBooking = async (bookingData: any) => {
    try {
      // Optional: Enforce login or allow guest
      const userId = user ? user.uid : 'guest';

      await wildToursService.createBooking({
        ...bookingData,
        userId,
        userEmail: user?.email || bookingData.contactEmail,
        createdAt: new Date().toISOString()
      });

      toast({
        title: "Booking Confirmed!",
        description: "Your wildlife experience has been booked. Check your email for confirmation details.",
      });

      setBookingDialogOpen(false);
    } catch (error) {
      console.error('Error creating booking:', error);
      toast({
        title: "Booking Error",
        description: "Failed to submit booking. Please try again or contact support.",
        variant: "destructive",
      });
    }
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: tour?.title,
          text: `Check out this amazing ${tour?.title} tour in Sri Lanka!`,
          url: window.location.href,
        });
      } catch (err) {
        console.log('Share cancelled');
      }
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast({
        title: "Link Copied!",
        description: "Tour link has been copied to clipboard.",
      });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50">
        <Header />
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-green-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading tour details...</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (!tour) {
    return (
      <div className="min-h-screen bg-slate-50">
        <Header />
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Tour Not Found</h2>
            <p className="text-gray-600 mb-6">The tour you're looking for doesn't exist.</p>
            <Button onClick={() => navigate('/tours/wildtours')}>
              Browse All Tours
            </Button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  // Helper to safely get array data
  const getList = (data: any) => Array.isArray(data) ? data : [];
  const tierColors = {
    'semi-luxury': 'bg-gradient-to-r from-amber-500 to-orange-500',
    'budget': 'bg-gradient-to-r from-green-500 to-emerald-500'
  };

  return (
    <>
      <Helmet>
        <title>{tour.title} - Wildlife Tours Sri Lanka | Recharge Travels</title>
        <meta name="description" content={Array.isArray(tour.description) ? tour.description.join(' ') : tour.description} />
        <meta property="og:title" content={`${tour.title} - Wildlife Tours Sri Lanka`} />
        <meta property="og:description" content={Array.isArray(tour.description) ? tour.description[0] : tour.description} />
        <meta property="og:image" content={tour.image} />
        <meta property="og:url" content={window.location.href} />
        <link rel="canonical" href={window.location.href} />
      </Helmet>

      <div className="min-h-screen bg-slate-50">
        <Header />

        {/* Hero Section */}
        <div className="relative h-[60vh] md:h-[70vh] w-full overflow-hidden">
          <img
            src={tour.image}
            alt={tour.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />

          {/* Back Button */}
          <div className="absolute top-24 left-4 md:left-8 z-20">
            <Button
              variant="ghost"
              className="text-white hover:bg-white/20 gap-2 backdrop-blur-sm bg-black/20"
              onClick={() => navigate('/tours/wildtours')}
            >
              <ArrowLeft className="w-5 h-5" />
              Back to Wild Tours
            </Button>
          </div>

          {/* Share & Favorite Buttons */}
          <div className="absolute top-24 right-4 md:right-8 z-20 flex gap-2">
            <Button
              variant="ghost"
              size="icon"
              className="text-white hover:bg-white/20 backdrop-blur-sm bg-black/20"
              onClick={handleShare}
            >
              <Share2 className="w-5 h-5" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className={`hover:bg-white/20 backdrop-blur-sm bg-black/20 ${isFavorite ? 'text-red-500' : 'text-white'}`}
              onClick={() => setIsFavorite(!isFavorite)}
            >
              <Heart className={`w-5 h-5 ${isFavorite ? 'fill-current' : ''}`} />
            </Button>
          </div>

          {/* Hero Content */}
          <div className="absolute bottom-0 left-0 right-0 p-6 md:p-12 text-white">
            <div className="max-w-7xl mx-auto">
              <div className="flex flex-wrap gap-3 mb-4">
                <Badge className={`${tierColors[tour.tier as keyof typeof tierColors] || 'bg-green-600'} text-white border-none text-sm px-4 py-1.5 uppercase font-semibold`}>
                  {tour.tier === 'semi-luxury' ? 'Semi-Luxury' : 'Budget-Friendly'}
                </Badge>
                {tour.difficulty && (
                  <Badge variant="outline" className="text-white border-white/50 backdrop-blur-sm">
                    {tour.difficulty}
                  </Badge>
                )}
              </div>
              <h1 className="text-3xl md:text-5xl lg:text-6xl font-serif font-bold mb-4 leading-tight">
                {tour.title}
              </h1>
              <div className="flex flex-wrap gap-4 md:gap-6 text-sm md:text-base opacity-90">
                <div className="flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-green-400" />
                  <span>{tour.location}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-5 h-5 text-green-400" />
                  <span>{tour.duration}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Star className="w-5 h-5 text-yellow-400 fill-current" />
                  <span>{tour.rating} ({tour.reviewCount || 0} reviews)</span>
                </div>
                <div className="flex items-center gap-2">
                  <Users className="w-5 h-5 text-green-400" />
                  <span>Max {tour.maxParticipants || 6} guests</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-7xl mx-auto px-4 py-8 md:py-12 grid lg:grid-cols-[1fr_400px] gap-8 md:gap-12">

          {/* Left Column - Tour Details */}
          <div className="space-y-10">

            {/* Overview */}
            <section>
              <h2 className="text-2xl md:text-3xl font-serif font-bold text-slate-900 mb-6">Experience Overview</h2>
              <div className="text-base md:text-lg text-slate-700 leading-relaxed space-y-4">
                {Array.isArray(tour.description) ? (
                  tour.description.map((desc, idx) => <p key={idx}>{desc}</p>)
                ) : (
                  <p>{tour.description}</p>
                )}
              </div>

              {/* Highlights */}
              {getList(tour.highlights).length > 0 && (
                <div className="grid sm:grid-cols-2 gap-4 mt-8">
                  {getList(tour.highlights).map((highlight: string, idx: number) => (
                    <div key={idx} className="flex items-start gap-3 p-4 rounded-xl bg-white border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
                      <div className="p-2 rounded-full bg-green-50 text-green-600 flex-shrink-0">
                        <Check className="w-5 h-5" />
                      </div>
                      <span className="font-medium text-slate-700 pt-1">{highlight}</span>
                    </div>
                  ))}
                </div>
              )}
            </section>

            {/* Day-by-Day Itinerary */}
            {tour.itinerary && Array.isArray(tour.itinerary) && tour.itinerary.length > 0 && (
              <section>
                <h2 className="text-2xl md:text-3xl font-serif font-bold text-slate-900 mb-6 flex items-center gap-3">
                  <Calendar className="w-7 h-7 text-amber-600" />
                  Day-by-Day Itinerary
                </h2>
                <Accordion type="single" collapsible className="space-y-3">
                  {tour.itinerary.map((day: any) => (
                    <AccordionItem key={day.day} value={`day-${day.day}`} className="border rounded-2xl px-6 bg-white shadow-sm">
                      <AccordionTrigger className="hover:no-underline py-5">
                        <div className="flex items-center gap-4 text-left">
                          <div className="bg-gradient-to-r from-amber-500 to-orange-500 text-white font-bold rounded-full w-12 h-12 flex items-center justify-center text-lg shadow-md">
                            {day.day}
                          </div>
                          <div>
                            <div className="font-semibold text-lg text-slate-900">{day.title}</div>
                            <div className="text-sm text-slate-600 mt-1">{day.description}</div>
                          </div>
                        </div>
                      </AccordionTrigger>
                      <AccordionContent className="pb-6">
                        <ul className="space-y-3 ml-16">
                          {day.activities && day.activities.map((activity: string, idx: number) => (
                            <li key={idx} className="flex items-start gap-3 text-slate-700">
                              <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                              <span>{activity}</span>
                            </li>
                          ))}
                        </ul>
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </section>
            )}

            {/* Inclusions & Exclusions */}
            <section className="grid md:grid-cols-2 gap-6">
              {/* What's Included */}
              <div className="bg-white p-6 md:p-8 rounded-3xl border border-slate-100 shadow-sm">
                <h3 className="text-xl font-bold mb-6 flex items-center gap-2 text-green-700">
                  <Shield className="w-6 h-6" />
                  What's Included
                </h3>
                <ul className="space-y-3">
                  {getList(tour.included).length > 0 ? (
                    getList(tour.included).map((item: string, idx: number) => (
                      <li key={idx} className="flex items-start gap-3 text-slate-600">
                        <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                        <span>{item}</span>
                      </li>
                    ))
                  ) : (
                    // Fallback to inclusions object if included array is empty
                    <>
                      {tour.inclusions?.vehicle && (
                        <li className="flex items-start gap-3 text-slate-600">
                          <Car className="w-5 h-5 text-blue-500 flex-shrink-0" />
                          <span>{tour.inclusions.vehicle}</span>
                        </li>
                      )}
                      {tour.inclusions?.guide && (
                        <li className="flex items-start gap-3 text-slate-600">
                          <Users className="w-5 h-5 text-green-500 flex-shrink-0" />
                          <span>{tour.inclusions.guide}</span>
                        </li>
                      )}
                      {tour.inclusions?.accommodation && (
                        <li className="flex items-start gap-3 text-slate-600">
                          <Bed className="w-5 h-5 text-purple-500 flex-shrink-0" />
                          <span>{tour.inclusions.accommodation}</span>
                        </li>
                      )}
                      {tour.inclusions?.meals && (
                        <li className="flex items-start gap-3 text-slate-600">
                          <Utensils className="w-5 h-5 text-orange-500 flex-shrink-0" />
                          <span>{tour.inclusions.meals}</span>
                        </li>
                      )}
                      {tour.inclusions?.extras && tour.inclusions.extras.map((extra: string, idx: number) => (
                        <li key={idx} className="flex items-start gap-3 text-slate-600">
                          <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                          <span>{extra}</span>
                        </li>
                      ))}
                    </>
                  )}
                </ul>
              </div>

              {/* Important Notes / Excluded */}
              <div className="bg-amber-50 p-6 md:p-8 rounded-3xl border border-amber-100">
                <h3 className="text-xl font-bold mb-6 flex items-center gap-2 text-amber-800">
                  <AlertTriangle className="w-6 h-6 text-amber-600" />
                  Important Notes
                </h3>
                <ul className="space-y-3">
                  {getList(tour.excluded).map((item: string, idx: number) => (
                    <li key={idx} className="flex items-start gap-3 text-amber-900/80">
                      <XCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                      <span>Not Included: {item}</span>
                    </li>
                  ))}
                  {tour.cancellationPolicy && (
                    <li className="flex items-start gap-3 text-amber-900/80 mt-4 pt-4 border-t border-amber-200">
                      <AlertTriangle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                      <span><strong>Cancellation:</strong> {tour.cancellationPolicy}</span>
                    </li>
                  )}
                </ul>
              </div>
            </section>

            {/* Best Time to Visit */}
            {tour.bestTime && (
              <section className="bg-gradient-to-r from-green-50 to-emerald-50 p-6 md:p-8 rounded-3xl border border-green-100">
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-white rounded-full shadow-sm flex-shrink-0">
                    <Calendar className="w-8 h-8 text-green-600" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-slate-900 mb-2">Best Time to Visit</h3>
                    <p className="text-slate-700 text-lg">{tour.bestTime}</p>
                    <p className="text-sm text-slate-500 mt-2">
                      This period offers the best weather conditions and wildlife sighting opportunities for this tour.
                    </p>
                  </div>
                </div>
              </section>
            )}

            {/* FAQ Section */}
            {tour.faq && Array.isArray(tour.faq) && tour.faq.length > 0 && (
              <section>
                <h2 className="text-2xl md:text-3xl font-serif font-bold text-slate-900 mb-6">
                  Frequently Asked Questions
                </h2>
                <Accordion type="single" collapsible className="space-y-3">
                  {tour.faq.map((item: any, idx: number) => (
                    <AccordionItem key={idx} value={`faq-${idx}`} className="border rounded-2xl px-6 bg-white shadow-sm">
                      <AccordionTrigger className="text-left font-semibold py-5 text-slate-900 hover:no-underline">
                        {item.question}
                      </AccordionTrigger>
                      <AccordionContent className="text-slate-700 leading-relaxed pb-5">
                        {item.answer}
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </section>
            )}
          </div>

          {/* Right Column - Sticky Booking Card */}
          <div className="lg:sticky lg:top-24 h-fit space-y-6">
            <Card className="border-none shadow-2xl bg-white rounded-3xl overflow-hidden">
              <div className={`${tierColors[tour.tier as keyof typeof tierColors] || 'bg-slate-900'} p-6 text-white text-center`}>
                <p className="text-sm uppercase tracking-widest opacity-80 mb-1">Starting From</p>
                <div className="text-4xl md:text-5xl font-bold">
                  ${tour.price}
                  <span className="text-lg font-normal opacity-70">/person</span>
                </div>
                {(tour as any).originalPrice && (
                  <div className="mt-2">
                    <span className="line-through opacity-60 text-lg">${(tour as any).originalPrice}</span>
                    <Badge className="ml-2 bg-white/20 text-white">
                      Save ${(tour as any).originalPrice - tour.price}
                    </Badge>
                  </div>
                )}
              </div>
              <CardContent className="p-6 space-y-6">
                <div className="space-y-4 text-sm text-slate-600">
                  <div className="flex justify-between py-3 border-b border-slate-100">
                    <span className="flex items-center gap-2"><Clock className="w-4 h-4" /> Duration</span>
                    <span className="font-semibold text-slate-900">{tour.duration}</span>
                  </div>
                  <div className="flex justify-between py-3 border-b border-slate-100">
                    <span className="flex items-center gap-2"><Users className="w-4 h-4" /> Group Size</span>
                    <span className="font-semibold text-slate-900">Max {tour.maxParticipants || 6}</span>
                  </div>
                  <div className="flex justify-between py-3 border-b border-slate-100">
                    <span className="flex items-center gap-2"><MapPin className="w-4 h-4" /> Location</span>
                    <span className="font-semibold text-slate-900">{tour.location}</span>
                  </div>
                  {tour.difficulty && (
                    <div className="flex justify-between py-3 border-b border-slate-100">
                      <span className="flex items-center gap-2"><Mountain className="w-4 h-4" /> Difficulty</span>
                      <Badge variant="outline">{tour.difficulty}</Badge>
                    </div>
                  )}
                  <div className="flex justify-between py-3">
                    <span className="flex items-center gap-2"><Star className="w-4 h-4" /> Rating</span>
                    <span className="font-semibold text-slate-900 flex items-center gap-1">
                      <Star className="w-4 h-4 text-yellow-500 fill-current" />
                      {tour.rating} ({tour.reviewCount} reviews)
                    </span>
                  </div>
                </div>

                <Button
                  className={`w-full py-6 text-lg font-semibold ${tierColors[tour.tier as keyof typeof tierColors] || 'bg-green-600'} hover:opacity-90 shadow-lg hover:shadow-xl transition-all duration-300 rounded-xl`}
                  onClick={() => setBookingDialogOpen(true)}
                >
                  Book Now - ${tour.price}
                </Button>

                <p className="text-xs text-center text-slate-400">
                  Free cancellation up to 48 hours before departure
                </p>

                <div className="flex items-center justify-center gap-4 text-xs text-slate-500 pt-2">
                  <div className="flex items-center gap-1">
                    <Shield className="w-4 h-4 text-green-600" />
                    Secure Booking
                  </div>
                  <div className="flex items-center gap-1">
                    <CheckCircle className="w-4 h-4 text-green-600" />
                    Instant Confirm
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Need Help Card */}
            <div className="bg-white p-6 rounded-3xl shadow-lg border border-slate-100">
              <h4 className="font-bold text-slate-900 mb-4 flex items-center gap-2">
                <MessageCircle className="w-5 h-5 text-green-600" />
                Need Help?
              </h4>
              <p className="text-sm text-slate-600 mb-4">
                Speak to our wildlife tour specialists for custom requirements or group bookings.
              </p>
              <div className="space-y-3">
                <a
                  href="https://wa.me/94777721999"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 p-3 rounded-xl bg-green-50 text-green-700 hover:bg-green-100 transition-colors"
                >
                  <Phone className="w-5 h-5" />
                  <span className="font-medium">WhatsApp: +94 777 721 999</span>
                </a>
                <a
                  href="mailto:tours@rechargetravels.com"
                  className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 text-slate-700 hover:bg-slate-100 transition-colors"
                >
                  <Mail className="w-5 h-5" />
                  <span className="font-medium">tours@rechargetravels.com</span>
                </a>
              </div>
            </div>
          </div>

        </div>

        <Footer />

        {/* Booking Dialog */}
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

export default WildTourDetail;
