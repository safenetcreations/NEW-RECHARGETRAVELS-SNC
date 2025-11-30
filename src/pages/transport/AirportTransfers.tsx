import React, { useState, useEffect, useMemo, useRef } from 'react';
import { Helmet } from 'react-helmet-async';
import Header from '@/components/Header';
import RechargeFooter from '@/components/ui/RechargeFooter';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Plane, Car, Clock, Shield, MapPin, Calendar, Users, ChevronDown, ChevronUp,
  Star, Headphones, Check, ArrowRight, Luggage, Baby, Phone, Mail, User,
  Globe, CreditCard, Navigation, Search, X, ChevronLeft, ChevronRight,
  Loader2, BadgeCheck, Quote, Sparkles, Wifi, Flower2, Droplets, Smartphone,
  Zap, UserCheck, Wallet, Printer, Download, MessageCircle, Hotel, DollarSign
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import {
  airportTransferService,
  SRI_LANKA_AIRPORTS,
  SRI_LANKA_DESTINATIONS,
  VEHICLE_TYPES,
  searchAirports,
  searchDestinations,
  calculateTransferPrice,
  ROUTE_DISTANCES,
  PRELOADED_HOTELS,
  TRANSFER_EXTRAS,
  CMB_AIRPORT_COORDS,
  JAF_AIRPORT_COORDS,
  calculateHaversineDistance,
  calculateDuration,
  calculateTotalWithExtras,
  searchHotels,
} from '@/services/airportTransferService';
import type {
  AirportTransferBooking,
  AirportTransferPageContent,
  HotelLocation,
  TransferExtra,
  FlightInfo,
  PriceBreakdown,
} from '@/services/airportTransferService';
import {
  searchFlight,
  debounceFlightSearch,
  formatArrivalTime,
  getStatusColor,
  getStatusText,
  getAirlineFromFlightNumber,
} from '@/services/flightTrackingService';

// Icon mapping for extras
const extraIconMap: { [key: string]: React.ElementType } = {
  'UserCheck': UserCheck,
  'Baby': Baby,
  'Wifi': Wifi,
  'Flower2': Flower2,
  'Droplets': Droplets,
  'Smartphone': Smartphone,
  'Luggage': Luggage,
  'Zap': Zap,
};

// 6-Step Progress Configuration
const BOOKING_STEPS = [
  { id: 1, key: 'route', label: 'Route', icon: MapPin },
  { id: 2, key: 'flight', label: 'Flight', icon: Plane },
  { id: 3, key: 'vehicle', label: 'Vehicle', icon: Car },
  { id: 4, key: 'extras', label: 'Extras', icon: Sparkles },
  { id: 5, key: 'details', label: 'Details', icon: User },
  { id: 6, key: 'payment', label: 'Payment', icon: CreditCard },
];

const AirportTransfers = () => {
  // Page content state
  const [pageContent, setPageContent] = useState<AirportTransferPageContent | null>(null);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [loading, setLoading] = useState(true);

  // Booking form state
  const [step, setStep] = useState(1);
  const [transferType, setTransferType] = useState<'arrival' | 'departure' | 'round-trip'>('arrival');

  // Search states
  const [airportSearch, setAirportSearch] = useState('');
  const [destinationSearch, setDestinationSearch] = useState('');
  const [showAirportResults, setShowAirportResults] = useState(false);
  const [showDestinationResults, setShowDestinationResults] = useState(false);
  const [selectedAirport, setSelectedAirport] = useState<typeof SRI_LANKA_AIRPORTS[0] | null>(null);
  const [selectedDestination, setSelectedDestination] = useState<typeof SRI_LANKA_DESTINATIONS[0] | null>(null);

  // Journey details
  const [pickupDate, setPickupDate] = useState('');
  const [pickupTime, setPickupTime] = useState('');
  const [returnDate, setReturnDate] = useState('');
  const [returnTime, setReturnTime] = useState('');
  const [adults, setAdults] = useState(2);
  const [children, setChildren] = useState(0);
  const [infants, setInfants] = useState(0);
  const [luggage, setLuggage] = useState(2);

  // Vehicle selection
  const [selectedVehicle, setSelectedVehicle] = useState<typeof VEHICLE_TYPES[0] | null>(null);

  // Customer details
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [country, setCountry] = useState('');
  const [flightNumber, setFlightNumber] = useState('');
  const [specialRequests, setSpecialRequests] = useState('');
  const [childSeats, setChildSeats] = useState(0);

  // Booking state
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [bookingComplete, setBookingComplete] = useState(false);
  const [bookingReference, setBookingReference] = useState('');
  const [bookingState, setBookingState] = useState<'idle' | 'processing' | 'success' | 'error'>('idle');

  // Flight tracking state (Step 2)
  const [flightSearchQuery, setFlightSearchQuery] = useState('');
  const [selectedFlight, setSelectedFlight] = useState<FlightInfo | null>(null);
  const [flightSearchLoading, setFlightSearchLoading] = useState(false);

  // Hotel selection state
  const [hotelSearchQuery, setHotelSearchQuery] = useState('');
  const [selectedHotel, setSelectedHotel] = useState<HotelLocation | null>(null);
  const [showHotelResults, setShowHotelResults] = useState(false);

  // Extras state (Step 4)
  const [selectedExtras, setSelectedExtras] = useState<string[]>(['meet-greet']);
  const [childSeatCount, setChildSeatCount] = useState(0);

  // Payment state (Step 6)
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'paypal' | 'cash' | null>(null);
  const [agreedToTerms, setAgreedToTerms] = useState(false);

  // Route calculation
  const [calculatedDistance, setCalculatedDistance] = useState(0);
  const [calculatedDuration, setCalculatedDuration] = useState('');

  // Refs
  const airportInputRef = useRef<HTMLDivElement>(null);
  const destinationInputRef = useRef<HTMLDivElement>(null);
  const hotelInputRef = useRef<HTMLDivElement>(null);

  // Load page content
  useEffect(() => {
    const loadContent = async () => {
      try {
        const content = await airportTransferService.getPageContent();
        setPageContent(content);
      } catch (error) {
        console.error('Error loading content:', error);
      } finally {
        setLoading(false);
      }
    };
    loadContent();
  }, []);

  // Click outside handlers
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (airportInputRef.current && !airportInputRef.current.contains(e.target as Node)) {
        setShowAirportResults(false);
      }
      if (destinationInputRef.current && !destinationInputRef.current.contains(e.target as Node)) {
        setShowDestinationResults(false);
      }
      if (hotelInputRef.current && !hotelInputRef.current.contains(e.target as Node)) {
        setShowHotelResults(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Calculate distance when hotel is selected
  useEffect(() => {
    if (selectedHotel && selectedAirport) {
      const airportCoords = selectedAirport.code === 'CMB' ? CMB_AIRPORT_COORDS :
                           selectedAirport.code === 'JAF' ? JAF_AIRPORT_COORDS :
                           CMB_AIRPORT_COORDS;
      const distance = calculateHaversineDistance(airportCoords, selectedHotel.coordinates);
      const duration = calculateDuration(distance);
      setCalculatedDistance(distance);
      setCalculatedDuration(duration);
    } else if (selectedDestination) {
      const destKey = selectedDestination.area.toLowerCase().replace(/\s+/g, '-');
      const distance = ROUTE_DISTANCES[destKey] || 100;
      setCalculatedDistance(distance);
      setCalculatedDuration(calculateDuration(distance));
    }
  }, [selectedHotel, selectedAirport, selectedDestination]);

  // Auto-play slideshow
  useEffect(() => {
    if (!pageContent?.heroSlides || pageContent.heroSlides.length <= 1) return;

    const interval = setInterval(() => {
      setCurrentSlide(prev =>
        prev === pageContent.heroSlides.length - 1 ? 0 : prev + 1
      );
    }, 5000); // Change slide every 5 seconds

    return () => clearInterval(interval);
  }, [pageContent?.heroSlides]);

  // Airport search results
  const airportResults = useMemo(() => {
    return searchAirports(airportSearch);
  }, [airportSearch]);

  // Destination search results
  const destinationResults = useMemo(() => {
    return searchDestinations(destinationSearch);
  }, [destinationSearch]);

  // Calculate price
  const calculatedPrice = useMemo(() => {
    if (!selectedDestination || !selectedVehicle) return null;
    const destKey = selectedDestination.area.toLowerCase().replace(/\s+/g, '-');
    const distance = ROUTE_DISTANCES[destKey] || 100;
    return calculateTransferPrice(distance, selectedVehicle.id, transferType === 'round-trip');
  }, [selectedDestination, selectedVehicle, transferType]);

  // Filtered vehicles by passenger count
  const suitableVehicles = useMemo(() => {
    const totalPassengers = adults + children;
    return VEHICLE_TYPES.filter(v => v.passengers >= totalPassengers);
  }, [adults, children]);

  // Hotel search results
  const hotelResults = useMemo(() => {
    return searchHotels(hotelSearchQuery);
  }, [hotelSearchQuery]);

  // Enhanced price calculation with extras
  const enhancedPrice = useMemo((): PriceBreakdown | null => {
    if (!selectedVehicle || calculatedDistance === 0) return null;
    return calculateTotalWithExtras(
      calculatedDistance,
      selectedVehicle.id,
      selectedExtras,
      childSeatCount,
      transferType === 'round-trip'
    );
  }, [selectedVehicle, calculatedDistance, selectedExtras, childSeatCount, transferType]);

  // Step validation
  const canProceedToStep = (targetStep: number): boolean => {
    switch (targetStep) {
      case 2:
        return !!(selectedAirport && (selectedHotel || selectedDestination) && pickupDate && pickupTime);
      case 3:
        return !!(selectedAirport && (selectedHotel || selectedDestination) && pickupDate && pickupTime);
      case 4:
        return !!selectedVehicle;
      case 5:
        return !!selectedVehicle;
      case 6:
        return !!(firstName && lastName && email && phone && country);
      default:
        return true;
    }
  };

  // Handle flight search
  const handleFlightSearch = async (query: string) => {
    setFlightSearchQuery(query);
    if (query.length >= 3) {
      setFlightSearchLoading(true);
      debounceFlightSearch(query, (result) => {
        setSelectedFlight(result);
        if (result) {
          setFlightNumber(result.flightNumber);
          if (result.estimatedArrival || result.scheduledArrival) {
            const arrivalTime = result.estimatedArrival || result.scheduledArrival;
            try {
              const time = new Date(arrivalTime).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });
              setPickupTime(time);
            } catch (e) {}
          }
        }
        setFlightSearchLoading(false);
      });
    } else {
      setSelectedFlight(null);
    }
  };

  // Handle hotel selection
  const handleHotelSelect = (hotel: HotelLocation) => {
    setSelectedHotel(hotel);
    setHotelSearchQuery('');
    setShowHotelResults(false);
    setDestinationSearch(`${hotel.name}, ${hotel.city}`);
    setSelectedDestination(null);
  };

  // Toggle extras
  const toggleExtra = (extraId: string) => {
    if (extraId === 'meet-greet') return;
    setSelectedExtras(prev =>
      prev.includes(extraId)
        ? prev.filter(id => id !== extraId)
        : [...prev, extraId]
    );
  };

  // Handle airport selection
  const handleAirportSelect = (airport: typeof SRI_LANKA_AIRPORTS[0]) => {
    setSelectedAirport(airport);
    setAirportSearch(`${airport.code} - ${airport.name}`);
    setShowAirportResults(false);
  };

  // Handle destination selection
  const handleDestinationSelect = (dest: typeof SRI_LANKA_DESTINATIONS[0]) => {
    setSelectedDestination(dest);
    setDestinationSearch(`${dest.name}, ${dest.area}`);
    setShowDestinationResults(false);
  };

  // Get min date (today)
  const getMinDate = () => new Date().toISOString().split('T')[0];

  // Handle booking submission
  const handleSubmitBooking = async () => {
    if (!selectedAirport || !selectedDestination || !selectedVehicle || !calculatedPrice) return;
    if (!firstName || !lastName || !email || !phone || !country) return;

    setIsSubmitting(true);

    try {
      const booking = await airportTransferService.createBooking({
        transferType,
        pickupAirport: {
          code: selectedAirport.code,
          name: selectedAirport.name,
          city: selectedAirport.city,
          country: selectedAirport.country
        },
        dropoffLocation: {
          name: selectedDestination.name,
          area: selectedDestination.area
        },
        flightNumber,
        pickupDate,
        pickupTime,
        returnDate: transferType === 'round-trip' ? returnDate : undefined,
        returnTime: transferType === 'round-trip' ? returnTime : undefined,
        adults,
        children,
        infants,
        luggage,
        vehicleType: selectedVehicle.id,
        vehicleName: selectedVehicle.name,
        customerInfo: {
          firstName,
          lastName,
          email,
          phone,
          country
        },
        pricing: {
          basePrice: calculatedPrice.breakdown.basePrice,
          distance: calculatedPrice.breakdown.distance,
          totalPrice: calculatedPrice.price,
          currency: calculatedPrice.currency
        },
        specialRequests,
        childSeats,
        meetAndGreet: true,
        flightTracking: true,
        status: 'pending',
        paymentStatus: 'pending'
      });

      setBookingReference(booking.bookingReference);
      setBookingComplete(true);
      setBookingState('success');

      toast.success('Booking Confirmed!', {
        description: `Your booking reference is ${booking.bookingReference}`
      });
    } catch (error) {
      console.error('Booking error:', error);
      setBookingState('error');
      toast.error('Booking Failed', {
        description: 'Please try again or contact support.'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #f6fbf8 0%, #dcede4 45%, #eef7f3 100%)' }}>
        <Loader2 className="w-12 h-12 text-emerald-700 animate-spin" />
      </div>
    );
  }

  const trustIndicators = pageContent?.trustIndicators;

  return (
    <>
      <Helmet>
        <title>{pageContent?.seoTitle || 'Airport Transfers Sri Lanka - Recharge Travels'}</title>
        <meta name="description" content={pageContent?.seoDescription || 'Premium airport transfers to and from Colombo Airport.'} />
        <meta name="keywords" content={pageContent?.seoKeywords?.join(', ') || 'airport transfer sri lanka'} />
      </Helmet>

      <Header />

      {/* Main Container with Green Gradient Background */}
      <div
        className="min-h-screen pt-20"
        style={{
          background: 'linear-gradient(135deg, #f6fbf8 0%, #dcede4 45%, #eef7f3 100%)',
          fontFamily: '"DM Sans", -apple-system, BlinkMacSystemFont, sans-serif'
        }}
      >
        <div className="max-w-7xl mx-auto px-4 py-8">
          {/* Hero Slideshow Section - Above Booking Form */}
          {pageContent?.heroSlides && pageContent.heroSlides.length > 0 && (
            <div className="mb-10">
              {/* Hero Slideshow */}
              <div className="relative rounded-3xl overflow-hidden shadow-2xl" style={{ boxShadow: '0 30px 80px rgba(13, 92, 70, 0.2)' }}>
                <div className="relative h-[350px] md:h-[450px]">
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={currentSlide}
                      initial={{ opacity: 0, scale: 1.05 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      transition={{ duration: 0.7 }}
                      className="absolute inset-0"
                    >
                      <img
                        src={pageContent.heroSlides[currentSlide]?.image || 'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?auto=format&fit=crop&q=80'}
                        alt={pageContent.heroSlides[currentSlide]?.title || 'Airport Transfer'}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />

                      {/* Slide Content */}
                      <div className="absolute bottom-0 left-0 right-0 p-8 md:p-12 text-white">
                        <motion.div
                          initial={{ y: 30, opacity: 0 }}
                          animate={{ y: 0, opacity: 1 }}
                          transition={{ delay: 0.3 }}
                        >
                          <span className="inline-block px-4 py-1.5 bg-emerald-600 rounded-full text-sm font-semibold mb-4">
                            Recharge Travels
                          </span>
                          <h1 className="text-3xl md:text-5xl font-bold mb-3" style={{ fontFamily: '"Playfair Display", serif' }}>
                            {pageContent.heroSlides[currentSlide]?.title || 'Premium Transfers'}
                          </h1>
                          <p className="text-lg md:text-xl text-white/90 max-w-2xl">
                            {pageContent.heroSlides[currentSlide]?.subtitle || 'Your Journey Begins with Comfort'}
                          </p>
                          {pageContent.heroSlides[currentSlide]?.description && (
                            <p className="text-white/70 mt-2 max-w-xl">
                              {pageContent.heroSlides[currentSlide].description}
                            </p>
                          )}
                        </motion.div>
                      </div>
                    </motion.div>
                  </AnimatePresence>

                  {/* Slide Navigation Arrows */}
                  {pageContent.heroSlides.length > 1 && (
                    <>
                      <button
                        onClick={() => setCurrentSlide(prev => prev === 0 ? pageContent.heroSlides.length - 1 : prev - 1)}
                        className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-white/30 transition-colors"
                      >
                        <ChevronLeft className="w-6 h-6" />
                      </button>
                      <button
                        onClick={() => setCurrentSlide(prev => prev === pageContent.heroSlides.length - 1 ? 0 : prev + 1)}
                        className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-white/30 transition-colors"
                      >
                        <ChevronRight className="w-6 h-6" />
                      </button>
                    </>
                  )}
                </div>

                {/* Slide Dots */}
                {pageContent.heroSlides.length > 1 && (
                  <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                    {pageContent.heroSlides.map((_, index) => (
                      <button
                        key={index}
                        onClick={() => setCurrentSlide(index)}
                        className={`w-3 h-3 rounded-full transition-all ${
                          index === currentSlide
                            ? 'bg-white w-8'
                            : 'bg-white/40 hover:bg-white/60'
                        }`}
                      />
                    ))}
                  </div>
                )}
              </div>

              {/* Trust Indicators */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
                {[
                  { icon: Star, label: trustIndicators?.rating || '4.9/5', sublabel: 'Customer Rating' },
                  { icon: Users, label: trustIndicators?.totalReviews || '2,847', sublabel: 'Happy Travelers' },
                  { icon: Shield, label: '100%', sublabel: 'Safe & Secure' },
                  { icon: Headphones, label: trustIndicators?.support || '24/7', sublabel: 'Support Available' },
                ].map(({ icon: Icon, label, sublabel }, i) => (
                  <div key={i} className="bg-white rounded-2xl p-4 text-center shadow-lg border border-emerald-100">
                    <div className="w-10 h-10 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-2">
                      <Icon className="w-5 h-5 text-emerald-700" />
                    </div>
                    <p className="text-xl font-bold text-emerald-800">{label}</p>
                    <p className="text-xs text-slate-500">{sublabel}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Default Hero if no content loaded */}
          {(!pageContent?.heroSlides || pageContent.heroSlides.length === 0) && (
            <div className="mb-10">
              <div className="relative rounded-3xl overflow-hidden shadow-2xl h-[350px]" style={{ boxShadow: '0 30px 80px rgba(13, 92, 70, 0.2)' }}>
                <img
                  src="https://images.unsplash.com/photo-1436491865332-7a61a109cc05?auto=format&fit=crop&q=80"
                  alt="Airport Transfer"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-8 md:p-12 text-white">
                  <span className="inline-block px-4 py-1.5 bg-emerald-600 rounded-full text-sm font-semibold mb-4">
                    Recharge Travels
                  </span>
                  <h1 className="text-3xl md:text-5xl font-bold mb-3" style={{ fontFamily: '"Playfair Display", serif' }}>
                    Premium Airport Transfers
                  </h1>
                  <p className="text-lg md:text-xl text-white/90 max-w-2xl">
                    Your Journey Begins with Comfort
                  </p>
                </div>
              </div>

              {/* Trust Indicators */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
                {[
                  { icon: Star, label: '4.9/5', sublabel: 'Customer Rating' },
                  { icon: Users, label: '2,847+', sublabel: 'Happy Travelers' },
                  { icon: Shield, label: '100%', sublabel: 'Safe & Secure' },
                  { icon: Headphones, label: '24/7', sublabel: 'Support Available' },
                ].map(({ icon: Icon, label, sublabel }, i) => (
                  <div key={i} className="bg-white rounded-2xl p-4 text-center shadow-lg border border-emerald-100">
                    <div className="w-10 h-10 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-2">
                      <Icon className="w-5 h-5 text-emerald-700" />
                    </div>
                    <p className="text-xl font-bold text-emerald-800">{label}</p>
                    <p className="text-xs text-slate-500">{sublabel}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Progress Steps - Green Theme */}
          {!bookingComplete && (
            <div className="flex justify-center gap-2 md:gap-4 mb-8 relative pb-4">
              {/* Progress Line */}
              <div className="absolute top-5 left-1/4 right-1/4 h-0.5 bg-slate-200 -z-0" />

              {BOOKING_STEPS.map((stepInfo, i) => {
                const isActive = step === stepInfo.id;
                const isCompleted = step > stepInfo.id;

                return (
                  <div key={stepInfo.key} className="relative z-10 flex flex-col items-center px-2 md:px-4">
                    <button
                      onClick={() => isCompleted && setStep(stepInfo.id)}
                      disabled={!isCompleted}
                      className={`w-10 h-10 md:w-11 md:h-11 rounded-full flex items-center justify-center font-semibold text-sm border-3 transition-all ${
                        isCompleted
                          ? 'bg-amber-400 border-amber-400 text-white cursor-pointer'
                          : isActive
                          ? 'bg-emerald-700 border-emerald-700 text-white'
                          : 'bg-white border-slate-200 text-slate-400'
                      }`}
                      style={{ borderWidth: '3px' }}
                    >
                      {isCompleted ? <Check className="w-5 h-5" /> : stepInfo.id}
                    </button>
                    <span className={`mt-2 text-xs font-semibold uppercase tracking-wider ${
                      isActive || isCompleted ? 'text-slate-700' : 'text-slate-400'
                    }`}>
                      {stepInfo.label}
                    </span>
                  </div>
                );
              })}
            </div>
          )}

          {/* Two Column Layout */}
          <div className="grid lg:grid-cols-[1fr_360px] gap-8 items-start">
            {/* Form Column */}
            <div className="bg-white rounded-3xl p-6 md:p-8 shadow-xl" style={{ boxShadow: '0 25px 60px rgba(13, 92, 70, 0.08)' }}>
              {/* Step 1: Route Selection */}
              {step === 1 && !bookingComplete && (
                <motion.div
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-6"
                >
                  <div className="mb-6">
                    <h2 className="text-2xl md:text-3xl font-bold text-emerald-800" style={{ fontFamily: '"Playfair Display", serif' }}>
                      Plan Your Transfer
                    </h2>
                    <p className="text-slate-500 mt-1">Select your pickup and drop-off locations</p>
                  </div>

                  {/* Transfer Type Tabs */}
                  <div className="flex flex-wrap gap-2 justify-center mb-6">
                    {[
                      { value: 'arrival', label: 'Airport Pickup', icon: Plane },
                      { value: 'departure', label: 'Airport Drop-off', icon: Car },
                      { value: 'round-trip', label: 'Round Trip', icon: ArrowRight }
                    ].map(({ value, label, icon: Icon }) => (
                      <button
                        key={value}
                        onClick={() => setTransferType(value as any)}
                        className={`flex items-center gap-2 px-5 py-3 rounded-xl font-medium transition-all ${
                          transferType === value
                            ? 'bg-emerald-700 text-white shadow-lg'
                            : 'bg-emerald-50 text-emerald-800 hover:bg-emerald-100 border-2 border-emerald-100'
                        }`}
                        style={transferType === value ? { boxShadow: '0 10px 30px rgba(13, 92, 70, 0.25)' } : {}}
                      >
                        <Icon className="w-4 h-4" />
                        {label}
                      </button>
                    ))}
                  </div>

                  {/* Search Grid */}
                  <div className="grid md:grid-cols-2 gap-4">
                    {/* Airport Search */}
                    <div ref={airportInputRef} className="relative">
                      <Label className="text-sm font-semibold text-slate-600 mb-2 block">
                        {transferType === 'departure' ? 'Drop-off Airport' : 'Pickup Airport'}
                      </Label>
                      <div className="relative">
                        <Plane className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-emerald-600" />
                        <Input
                          value={airportSearch}
                          onChange={(e) => {
                            setAirportSearch(e.target.value);
                            setShowAirportResults(true);
                            if (!e.target.value) setSelectedAirport(null);
                          }}
                          onFocus={() => setShowAirportResults(true)}
                          placeholder="Search airports..."
                          className="pl-10 py-3 h-14 bg-white border-2 border-emerald-200 focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100 rounded-xl text-slate-800 placeholder:text-slate-400 font-medium"
                        />
                        {selectedAirport && (
                          <button
                            onClick={() => {
                              setSelectedAirport(null);
                              setAirportSearch('');
                            }}
                            className="absolute right-3 top-1/2 -translate-y-1/2"
                          >
                            <X className="w-4 h-4 text-slate-400 hover:text-slate-600" />
                          </button>
                        )}
                      </div>

                      {/* Airport Results Dropdown */}
                      {showAirportResults && airportResults.length > 0 && (
                        <div className="absolute z-50 w-full mt-2 bg-white rounded-xl shadow-2xl border border-emerald-100 max-h-80 overflow-y-auto">
                          {airportResults.map((airport) => (
                            <button
                              key={airport.code}
                              onClick={() => handleAirportSelect(airport)}
                              className="w-full px-4 py-3 text-left hover:bg-emerald-50 flex items-start gap-3 border-b border-slate-50 last:border-0 transition-colors"
                            >
                              <div className="w-12 h-8 bg-emerald-100 rounded flex items-center justify-center text-emerald-700 font-bold text-sm">
                                {airport.code}
                              </div>
                              <div className="flex-1">
                                <div className="font-medium text-slate-800">{airport.name}</div>
                                <div className="text-sm text-slate-500">{airport.city}, {airport.country}</div>
                              </div>
                            </button>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Destination Search */}
                    <div ref={destinationInputRef} className="relative">
                      <Label className="text-sm font-semibold text-slate-600 mb-2 block">
                        {transferType === 'departure' ? 'Pickup Location' : 'Drop-off Location'}
                      </Label>
                      <div className="relative">
                        <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-amber-500" />
                        <Input
                          value={destinationSearch}
                          onChange={(e) => {
                            setDestinationSearch(e.target.value);
                            setShowDestinationResults(true);
                            if (!e.target.value) setSelectedDestination(null);
                          }}
                          onFocus={() => setShowDestinationResults(true)}
                          placeholder="Hotel, city, or destination..."
                          className="pl-10 py-3 h-14 bg-white border-2 border-emerald-200 focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100 rounded-xl text-slate-800 placeholder:text-slate-400 font-medium"
                        />
                        {selectedDestination && (
                          <button
                            onClick={() => {
                              setSelectedDestination(null);
                              setDestinationSearch('');
                            }}
                            className="absolute right-3 top-1/2 -translate-y-1/2"
                          >
                            <X className="w-4 h-4 text-slate-400 hover:text-slate-600" />
                          </button>
                        )}
                      </div>

                      {/* Destination Results Dropdown */}
                      {showDestinationResults && destinationResults.length > 0 && (
                        <div className="absolute z-50 w-full mt-2 bg-white rounded-xl shadow-2xl border border-emerald-100 max-h-80 overflow-y-auto">
                          {destinationResults.map((dest, i) => (
                            <button
                              key={i}
                              onClick={() => handleDestinationSelect(dest)}
                              className="w-full px-4 py-3 text-left hover:bg-amber-50 flex items-center gap-3 border-b border-slate-50 last:border-0 transition-colors"
                            >
                              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                                dest.type === 'beach' ? 'bg-cyan-100 text-cyan-600' :
                                dest.type === 'city' ? 'bg-emerald-100 text-emerald-600' :
                                dest.type === 'attraction' ? 'bg-amber-100 text-amber-600' :
                                dest.type === 'wildlife' ? 'bg-green-100 text-green-600' :
                                'bg-purple-100 text-purple-600'
                              }`}>
                                <MapPin className="w-4 h-4" />
                              </div>
                              <div>
                                <div className="font-medium text-slate-800">{dest.name}</div>
                                <div className="text-sm text-slate-500">{dest.area}</div>
                              </div>
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Date & Time */}
                  <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div>
                      <Label className="text-sm font-semibold text-slate-600 mb-2 block">Pickup Date</Label>
                      <div className="relative">
                        <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-emerald-600" />
                        <Input
                          type="date"
                          value={pickupDate}
                          onChange={(e) => setPickupDate(e.target.value)}
                          min={getMinDate()}
                          className="pl-10 py-3 h-14 bg-white border-2 border-emerald-200 focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100 rounded-xl text-slate-800 font-medium"
                        />
                      </div>
                    </div>

                    <div>
                      <Label className="text-sm font-semibold text-slate-600 mb-2 block">
                        {transferType === 'arrival' ? 'Flight Arrival Time' : 'Pickup Time'}
                      </Label>
                      <div className="relative">
                        <Clock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-emerald-600" />
                        <Input
                          type="time"
                          value={pickupTime}
                          onChange={(e) => setPickupTime(e.target.value)}
                          className="pl-10 py-3 h-14 bg-white border-2 border-emerald-200 focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100 rounded-xl text-slate-800 font-medium"
                        />
                      </div>
                    </div>

                    {transferType === 'round-trip' && (
                      <>
                        <div>
                          <Label className="text-sm font-semibold text-slate-600 mb-2 block">Return Date</Label>
                          <Input
                            type="date"
                            value={returnDate}
                            onChange={(e) => setReturnDate(e.target.value)}
                            min={pickupDate || getMinDate()}
                            className="py-3 h-14 bg-white border-2 border-emerald-200 focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100 rounded-xl text-slate-800 font-medium"
                          />
                        </div>
                        <div>
                          <Label className="text-sm font-semibold text-slate-600 mb-2 block">Return Time</Label>
                          <Input
                            type="time"
                            value={returnTime}
                            onChange={(e) => setReturnTime(e.target.value)}
                            className="py-3 h-14 bg-white border-2 border-emerald-200 focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100 rounded-xl text-slate-800 font-medium"
                          />
                        </div>
                      </>
                    )}
                  </div>

                  {/* Passengers & Luggage - Fixed Counter Components */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {/* Adults Counter */}
                    <div className="bg-emerald-50 rounded-xl p-3">
                      <Label className="text-sm font-semibold text-slate-600 mb-2 flex items-center gap-2">
                        <Users className="w-4 h-4 text-emerald-600" /> Adults
                      </Label>
                      <div className="flex items-center justify-between">
                        <button
                          type="button"
                          onClick={() => setAdults(prev => Math.max(1, prev - 1))}
                          className="w-9 h-9 rounded-full bg-white border-2 border-emerald-600 text-emerald-700 font-bold hover:bg-emerald-100 transition-colors"
                        >-</button>
                        <span className="text-lg font-bold text-slate-800">{adults}</span>
                        <button
                          type="button"
                          onClick={() => setAdults(prev => prev + 1)}
                          className="w-9 h-9 rounded-full bg-white border-2 border-emerald-600 text-emerald-700 font-bold hover:bg-emerald-100 transition-colors"
                        >+</button>
                      </div>
                    </div>

                    {/* Children Counter */}
                    <div className="bg-emerald-50 rounded-xl p-3">
                      <Label className="text-sm font-semibold text-slate-600 mb-2 flex items-center gap-2">
                        <User className="w-4 h-4 text-emerald-600" /> Children
                      </Label>
                      <div className="flex items-center justify-between">
                        <button
                          type="button"
                          onClick={() => setChildren(prev => Math.max(0, prev - 1))}
                          className="w-9 h-9 rounded-full bg-white border-2 border-emerald-600 text-emerald-700 font-bold hover:bg-emerald-100 transition-colors"
                        >-</button>
                        <span className="text-lg font-bold text-slate-800">{children}</span>
                        <button
                          type="button"
                          onClick={() => setChildren(prev => prev + 1)}
                          className="w-9 h-9 rounded-full bg-white border-2 border-emerald-600 text-emerald-700 font-bold hover:bg-emerald-100 transition-colors"
                        >+</button>
                      </div>
                    </div>

                    {/* Infants Counter */}
                    <div className="bg-emerald-50 rounded-xl p-3">
                      <Label className="text-sm font-semibold text-slate-600 mb-2 flex items-center gap-2">
                        <Baby className="w-4 h-4 text-emerald-600" /> Infants
                      </Label>
                      <div className="flex items-center justify-between">
                        <button
                          type="button"
                          onClick={() => setInfants(prev => Math.max(0, prev - 1))}
                          className="w-9 h-9 rounded-full bg-white border-2 border-emerald-600 text-emerald-700 font-bold hover:bg-emerald-100 transition-colors"
                        >-</button>
                        <span className="text-lg font-bold text-slate-800">{infants}</span>
                        <button
                          type="button"
                          onClick={() => setInfants(prev => prev + 1)}
                          className="w-9 h-9 rounded-full bg-white border-2 border-emerald-600 text-emerald-700 font-bold hover:bg-emerald-100 transition-colors"
                        >+</button>
                      </div>
                    </div>

                    {/* Luggage Counter */}
                    <div className="bg-emerald-50 rounded-xl p-3">
                      <Label className="text-sm font-semibold text-slate-600 mb-2 flex items-center gap-2">
                        <Luggage className="w-4 h-4 text-emerald-600" /> Luggage
                      </Label>
                      <div className="flex items-center justify-between">
                        <button
                          type="button"
                          onClick={() => setLuggage(prev => Math.max(0, prev - 1))}
                          className="w-9 h-9 rounded-full bg-white border-2 border-emerald-600 text-emerald-700 font-bold hover:bg-emerald-100 transition-colors"
                        >-</button>
                        <span className="text-lg font-bold text-slate-800">{luggage}</span>
                        <button
                          type="button"
                          onClick={() => setLuggage(prev => prev + 1)}
                          className="w-9 h-9 rounded-full bg-white border-2 border-emerald-600 text-emerald-700 font-bold hover:bg-emerald-100 transition-colors"
                        >+</button>
                      </div>
                    </div>
                  </div>

                  {/* Route Preview */}
                  {selectedAirport && (selectedHotel || selectedDestination) && calculatedDistance > 0 && (
                    <div className="bg-gradient-to-r from-emerald-50 to-amber-50 rounded-xl p-4 border-2 border-emerald-200">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 bg-emerald-700 rounded-full flex items-center justify-center">
                            <Plane className="w-6 h-6 text-white" />
                          </div>
                          <div>
                            <span className="font-bold text-lg text-emerald-800">{selectedAirport.code}</span>
                            <p className="text-xs text-slate-500">{selectedAirport.city}</p>
                          </div>
                        </div>

                        <div className="flex-1 mx-4 relative">
                          <div className="border-t-2 border-dashed border-emerald-400" />
                          <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-white px-3 py-1 rounded-full border border-emerald-200">
                            <span className="text-sm font-semibold text-emerald-700">{calculatedDistance} km</span>
                            <span className="text-xs text-slate-500 ml-1">• ~{calculatedDuration}</span>
                          </div>
                        </div>

                        <div className="flex items-center gap-3">
                          <div>
                            <span className="font-bold text-lg text-amber-600">
                              {selectedHotel?.city || selectedDestination?.area}
                            </span>
                            <p className="text-xs text-slate-500 text-right">
                              {selectedHotel?.name || selectedDestination?.name}
                            </p>
                          </div>
                          <div className="w-12 h-12 bg-amber-500 rounded-full flex items-center justify-center">
                            <MapPin className="w-6 h-6 text-white" />
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Form Actions */}
                  <div className="pt-6 border-t border-slate-100">
                    <Button
                      onClick={() => setStep(2)}
                      disabled={!canProceedToStep(2)}
                      className="w-full md:w-auto md:ml-auto flex items-center justify-center gap-2 px-8 py-4 text-lg font-semibold rounded-xl text-white transition-all"
                      style={{
                        background: 'linear-gradient(135deg, #0d5c46, #1a7f5f)',
                        boxShadow: '0 12px 30px rgba(13, 92, 70, 0.25)'
                      }}
                    >
                      Continue to Flight Details <ArrowRight className="w-5 h-5" />
                    </Button>
                  </div>
                </motion.div>
              )}

              {/* Step 2: Flight Information */}
              {step === 2 && !bookingComplete && (
                <motion.div
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-6"
                >
                  <div className="mb-6">
                    <h2 className="text-2xl md:text-3xl font-bold text-emerald-800" style={{ fontFamily: '"Playfair Display", serif' }}>
                      Flight Information
                    </h2>
                    <p className="text-slate-500 mt-1">Help us track your flight for seamless pickup</p>
                  </div>

                  {/* Flight Number Search */}
                  <div className="space-y-4">
                    <div>
                      <Label className="text-sm font-semibold text-slate-600 mb-2 block">
                        Flight Number
                      </Label>
                      <div className="relative">
                        <Plane className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-emerald-600" />
                        <Input
                          value={flightSearchQuery || flightNumber}
                          onChange={(e) => handleFlightSearch(e.target.value.toUpperCase())}
                          placeholder="e.g., UL504, EK650, QR668"
                          className="pl-10 py-3 h-14 bg-white border-2 border-emerald-200 focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100 rounded-xl text-slate-800 placeholder:text-slate-400 font-semibold uppercase"
                        />
                        {flightSearchLoading && (
                          <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-emerald-600 animate-spin" />
                        )}
                      </div>
                    </div>

                    {/* Flight Result */}
                    {selectedFlight && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-gradient-to-r from-emerald-50 to-teal-50 border-2 border-emerald-200 rounded-xl p-4"
                      >
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex items-center gap-3">
                            <div className="w-12 h-12 bg-emerald-700 rounded-lg flex items-center justify-center">
                              <Plane className="w-6 h-6 text-white" />
                            </div>
                            <div>
                              <span className="text-xl font-bold text-emerald-800">{selectedFlight.flightNumber}</span>
                              <p className="text-sm text-slate-600">{selectedFlight.airline}</p>
                            </div>
                          </div>
                          <Badge className={getStatusColor(selectedFlight.status)}>
                            {getStatusText(selectedFlight.status, selectedFlight.delayMinutes)}
                          </Badge>
                        </div>

                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div>
                            <span className="text-slate-500">From</span>
                            <p className="font-semibold text-slate-800">{selectedFlight.origin} - {selectedFlight.originCity}</p>
                          </div>
                          <div>
                            <span className="text-slate-500">Arriving</span>
                            <p className="font-semibold text-slate-800">
                              {formatArrivalTime(selectedFlight.estimatedArrival || selectedFlight.scheduledArrival)}
                              {selectedFlight.terminal && ` • Terminal ${selectedFlight.terminal}`}
                            </p>
                          </div>
                        </div>

                        <div className="mt-3 flex items-center gap-2 text-emerald-700 text-sm">
                          <Check className="w-4 h-4" />
                          <span>Flight tracking enabled - we'll adjust for delays</span>
                        </div>
                      </motion.div>
                    )}

                    {/* Info Card */}
                    <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex gap-3">
                      <div className="w-10 h-10 bg-amber-100 rounded-full flex items-center justify-center flex-shrink-0">
                        <Clock className="w-5 h-5 text-amber-600" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-slate-800">Flight Tracking Included</h4>
                        <p className="text-sm text-slate-600">
                          We monitor your flight in real-time and adjust pickup time automatically for delays. No extra charge!
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Form Actions */}
                  <div className="pt-6 border-t border-slate-100 flex flex-col sm:flex-row gap-4">
                    <Button
                      variant="outline"
                      onClick={() => setStep(1)}
                      className="flex-1 py-4 text-lg font-semibold rounded-xl border-2 border-slate-200"
                    >
                      <ChevronLeft className="mr-2 w-5 h-5" /> Back
                    </Button>
                    <Button
                      onClick={() => setStep(3)}
                      className="flex-1 py-4 text-lg font-semibold rounded-xl text-white"
                      style={{
                        background: 'linear-gradient(135deg, #0d5c46, #1a7f5f)',
                        boxShadow: '0 12px 30px rgba(13, 92, 70, 0.25)'
                      }}
                    >
                      {flightNumber ? 'Continue' : 'Skip'} <ArrowRight className="ml-2 w-5 h-5" />
                    </Button>
                  </div>
                </motion.div>
              )}

              {/* Step 3: Vehicle Selection */}
              {step === 3 && !bookingComplete && (
                <motion.div
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-6"
                >
                  <div className="mb-6">
                    <h2 className="text-2xl md:text-3xl font-bold text-emerald-800" style={{ fontFamily: '"Playfair Display", serif' }}>
                      Select Your Vehicle
                    </h2>
                    <p className="text-slate-500 mt-1">
                      {selectedAirport?.code} → {selectedHotel?.city || selectedDestination?.name}
                      <span className="mx-2">•</span>
                      {adults + children} passengers • {calculatedDistance} km
                    </p>
                  </div>

                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {suitableVehicles.map((vehicle) => {
                      const destKey = selectedDestination?.area.toLowerCase().replace(/\s+/g, '-') || '';
                      const distance = ROUTE_DISTANCES[destKey] || 100;
                      const price = calculateTransferPrice(distance, vehicle.id, transferType === 'round-trip');

                      return (
                        <div
                          key={vehicle.id}
                          onClick={() => setSelectedVehicle(vehicle)}
                          className={`relative rounded-2xl border-2 overflow-hidden cursor-pointer transition-all ${
                            selectedVehicle?.id === vehicle.id
                              ? 'border-emerald-600 bg-emerald-50/50'
                              : 'border-slate-200 hover:border-slate-300 hover:shadow-md'
                          }`}
                          style={selectedVehicle?.id === vehicle.id ? { boxShadow: '0 10px 30px rgba(13, 92, 70, 0.15)' } : {}}
                        >
                          {selectedVehicle?.id === vehicle.id && (
                            <div className="absolute top-3 right-3 w-6 h-6 bg-emerald-700 rounded-full flex items-center justify-center">
                              <Check className="w-4 h-4 text-white" />
                            </div>
                          )}

                          <div className="h-32 overflow-hidden">
                            <img
                              src={vehicle.image}
                              alt={vehicle.name}
                              className="w-full h-full object-cover"
                            />
                          </div>

                          <div className="p-4">
                            <h4 className="font-bold text-slate-800">{vehicle.name}</h4>
                            <p className="text-sm text-slate-500 mb-3">{vehicle.description}</p>

                            <div className="flex items-center gap-4 text-sm text-slate-600 mb-3">
                              <span className="flex items-center gap-1">
                                <Users className="w-4 h-4" /> {vehicle.passengers}
                              </span>
                              <span className="flex items-center gap-1">
                                <Luggage className="w-4 h-4" /> {vehicle.luggage}
                              </span>
                            </div>

                            <div className="flex items-baseline gap-1">
                              <span className="text-2xl font-bold text-emerald-700">${price.price}</span>
                              <span className="text-slate-500 text-sm">
                                {transferType === 'round-trip' ? 'round trip' : 'one way'}
                              </span>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* Form Actions */}
                  <div className="pt-6 border-t border-slate-100 flex flex-col sm:flex-row gap-4">
                    <Button
                      variant="outline"
                      onClick={() => setStep(2)}
                      className="flex-1 py-4 text-lg font-semibold rounded-xl border-2 border-slate-200"
                    >
                      <ChevronLeft className="mr-2 w-5 h-5" /> Back
                    </Button>
                    <Button
                      onClick={() => setStep(4)}
                      disabled={!canProceedToStep(4)}
                      className="flex-1 py-4 text-lg font-semibold rounded-xl text-white"
                      style={{
                        background: 'linear-gradient(135deg, #0d5c46, #1a7f5f)',
                        boxShadow: '0 12px 30px rgba(13, 92, 70, 0.25)'
                      }}
                    >
                      Continue to Extras <ArrowRight className="ml-2 w-5 h-5" />
                    </Button>
                  </div>
                </motion.div>
              )}

              {/* Step 4: Extras Selection */}
              {step === 4 && !bookingComplete && (
                <motion.div
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-6"
                >
                  <div className="mb-6">
                    <h2 className="text-2xl md:text-3xl font-bold text-emerald-800" style={{ fontFamily: '"Playfair Display", serif' }}>
                      Enhance Your Journey
                    </h2>
                    <p className="text-slate-500 mt-1">Add extras to make your transfer more comfortable</p>
                  </div>

                  {/* Extras Grid */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {TRANSFER_EXTRAS.map((extra) => {
                      const Icon = extraIconMap[extra.icon] || Sparkles;
                      const isSelected = selectedExtras.includes(extra.id);
                      const isIncluded = extra.isIncluded;

                      return (
                        <div
                          key={extra.id}
                          onClick={() => !isIncluded && toggleExtra(extra.id)}
                          className={`relative p-4 rounded-xl border-2 transition-all ${
                            isIncluded
                              ? 'bg-emerald-50 border-emerald-300 cursor-default'
                              : isSelected
                              ? 'bg-emerald-50 border-emerald-600 cursor-pointer'
                              : 'bg-white border-slate-200 cursor-pointer hover:border-slate-300 hover:shadow-sm'
                          }`}
                          style={isSelected && !isIncluded ? { boxShadow: '0 10px 30px rgba(13, 92, 70, 0.12)' } : {}}
                        >
                          {isIncluded && (
                            <div className="absolute -top-2 -right-2 bg-emerald-600 text-white text-xs px-2 py-0.5 rounded-full">
                              Included
                            </div>
                          )}
                          {isSelected && !isIncluded && (
                            <div className="absolute top-2 right-2 w-5 h-5 bg-emerald-700 rounded-full flex items-center justify-center">
                              <Check className="w-3 h-3 text-white" />
                            </div>
                          )}

                          <div className={`w-10 h-10 rounded-full flex items-center justify-center mb-3 ${
                            isIncluded ? 'bg-emerald-100' : isSelected ? 'bg-emerald-100' : 'bg-slate-100'
                          }`}>
                            <Icon className={`w-5 h-5 ${
                              isIncluded ? 'text-emerald-700' : isSelected ? 'text-emerald-700' : 'text-slate-500'
                            }`} />
                          </div>

                          <h4 className="font-semibold text-sm text-slate-800 mb-1">{extra.name}</h4>
                          <p className="text-xs text-slate-500 mb-2 line-clamp-2">{extra.description}</p>
                          <p className={`font-bold ${isIncluded ? 'text-emerald-700' : 'text-emerald-700'}`}>
                            {isIncluded ? 'Free' : extra.price === 0 ? 'Free' : `+$${extra.priceUSD}`}
                          </p>
                        </div>
                      );
                    })}
                  </div>

                  {/* Child Seats Counter */}
                  {selectedExtras.includes('child-seat') && (
                    <div className="bg-emerald-50 rounded-xl p-4 border border-emerald-200">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-emerald-100 rounded-full flex items-center justify-center">
                            <Baby className="w-5 h-5 text-emerald-700" />
                          </div>
                          <div>
                            <h4 className="font-semibold text-slate-800">Child Seats</h4>
                            <p className="text-sm text-slate-500">$5 per seat</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <button
                            type="button"
                            onClick={() => setChildSeatCount(prev => Math.max(0, prev - 1))}
                            className="w-10 h-10 rounded-full bg-white border-2 border-emerald-600 flex items-center justify-center text-lg font-bold text-emerald-700 hover:bg-emerald-100"
                          >
                            -
                          </button>
                          <span className="text-xl font-bold w-8 text-center">{childSeatCount}</span>
                          <button
                            type="button"
                            onClick={() => setChildSeatCount(prev => prev + 1)}
                            className="w-10 h-10 rounded-full bg-white border-2 border-emerald-600 flex items-center justify-center text-lg font-bold text-emerald-700 hover:bg-emerald-100"
                          >
                            +
                          </button>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Special Requests */}
                  <div>
                    <Label className="text-sm font-semibold text-slate-600 mb-2 block">
                      Special Requests (Optional)
                    </Label>
                    <Textarea
                      value={specialRequests}
                      onChange={(e) => setSpecialRequests(e.target.value)}
                      placeholder="Any special requirements? e.g., wheelchair assistance, extra luggage space..."
                      className="min-h-[100px] border-2 border-emerald-200 focus:border-emerald-600 rounded-xl"
                    />
                  </div>

                  {/* Form Actions */}
                  <div className="pt-6 border-t border-slate-100 flex flex-col sm:flex-row gap-4">
                    <Button
                      variant="outline"
                      onClick={() => setStep(3)}
                      className="flex-1 py-4 text-lg font-semibold rounded-xl border-2 border-slate-200"
                    >
                      <ChevronLeft className="mr-2 w-5 h-5" /> Back
                    </Button>
                    <Button
                      onClick={() => setStep(5)}
                      className="flex-1 py-4 text-lg font-semibold rounded-xl text-white"
                      style={{
                        background: 'linear-gradient(135deg, #0d5c46, #1a7f5f)',
                        boxShadow: '0 12px 30px rgba(13, 92, 70, 0.25)'
                      }}
                    >
                      Continue <ArrowRight className="ml-2 w-5 h-5" />
                    </Button>
                  </div>
                </motion.div>
              )}

              {/* Step 5: Customer Details */}
              {step === 5 && !bookingComplete && (
                <motion.div
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-6"
                >
                  <div className="mb-6">
                    <h2 className="text-2xl md:text-3xl font-bold text-emerald-800" style={{ fontFamily: '"Playfair Display", serif' }}>
                      Your Details
                    </h2>
                    <p className="text-slate-500 mt-1">We'll send confirmation and driver details to you</p>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <Label className="text-sm font-semibold text-slate-600 mb-2 block">First Name *</Label>
                      <Input
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                        placeholder="John"
                        className="h-14 border-2 border-emerald-200 focus:border-emerald-600 rounded-xl"
                      />
                    </div>
                    <div>
                      <Label className="text-sm font-semibold text-slate-600 mb-2 block">Last Name *</Label>
                      <Input
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                        placeholder="Smith"
                        className="h-14 border-2 border-emerald-200 focus:border-emerald-600 rounded-xl"
                      />
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <Label className="text-sm font-semibold text-slate-600 mb-2 block">Email *</Label>
                      <Input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="john@example.com"
                        className="h-14 border-2 border-emerald-200 focus:border-emerald-600 rounded-xl"
                      />
                    </div>
                    <div>
                      <Label className="text-sm font-semibold text-slate-600 mb-2 block">WhatsApp Number *</Label>
                      <Input
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="+44 123 456 7890"
                        className="h-14 border-2 border-emerald-200 focus:border-emerald-600 rounded-xl"
                      />
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <Label className="text-sm font-semibold text-slate-600 mb-2 block">Country *</Label>
                      <Input
                        value={country}
                        onChange={(e) => setCountry(e.target.value)}
                        placeholder="United Kingdom"
                        className="h-14 border-2 border-emerald-200 focus:border-emerald-600 rounded-xl"
                      />
                    </div>
                    <div>
                      <Label className="text-sm font-semibold text-slate-600 mb-2 block">Flight Number</Label>
                      <Input
                        value={flightNumber}
                        onChange={(e) => setFlightNumber(e.target.value)}
                        placeholder="UL504"
                        className="h-14 border-2 border-emerald-200 focus:border-emerald-600 rounded-xl"
                      />
                    </div>
                  </div>

                  {/* Form Actions */}
                  <div className="pt-6 border-t border-slate-100 flex flex-col sm:flex-row gap-4">
                    <Button
                      variant="outline"
                      onClick={() => setStep(4)}
                      className="flex-1 py-4 text-lg font-semibold rounded-xl border-2 border-slate-200"
                    >
                      <ChevronLeft className="mr-2 w-5 h-5" /> Back
                    </Button>
                    <Button
                      onClick={() => setStep(6)}
                      disabled={!canProceedToStep(6)}
                      className="flex-1 py-4 text-lg font-semibold rounded-xl text-white"
                      style={{
                        background: 'linear-gradient(135deg, #0d5c46, #1a7f5f)',
                        boxShadow: '0 12px 30px rgba(13, 92, 70, 0.25)'
                      }}
                    >
                      Continue to Payment <ArrowRight className="ml-2 w-5 h-5" />
                    </Button>
                  </div>
                </motion.div>
              )}

              {/* Step 6: Payment */}
              {step === 6 && !bookingComplete && (
                <motion.div
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-6"
                >
                  <div className="mb-6">
                    <h2 className="text-2xl md:text-3xl font-bold text-emerald-800" style={{ fontFamily: '"Playfair Display", serif' }}>
                      Payment
                    </h2>
                    <p className="text-slate-500 mt-1">Secure 256-bit checkout. We accept global cards & PayPal.</p>
                  </div>

                  {/* Payment Methods */}
                  <div>
                    <h3 className="text-sm font-semibold text-slate-600 mb-3">Payment Method</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      {[
                        { id: 'card', label: 'Credit/Debit', sublabel: 'Visa • MasterCard • AmEx', icon: CreditCard },
                        { id: 'paypal', label: 'PayPal', sublabel: 'Fast & secure', icon: Wallet },
                        { id: 'cash', label: 'Cash to Driver', sublabel: 'Pay on arrival', icon: DollarSign },
                      ].map(({ id, label, sublabel, icon: Icon }) => (
                        <button
                          key={id}
                          onClick={() => setPaymentMethod(id as any)}
                          className={`p-4 rounded-xl border-2 text-left transition-all ${
                            paymentMethod === id
                              ? 'border-emerald-600 bg-emerald-50'
                              : 'border-slate-200 hover:border-slate-300'
                          }`}
                          style={paymentMethod === id ? { boxShadow: '0 10px 30px rgba(13, 92, 70, 0.12)' } : {}}
                        >
                          <div className="flex items-center gap-3">
                            <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                              paymentMethod === id ? 'bg-emerald-100' : 'bg-slate-100'
                            }`}>
                              <Icon className={`w-5 h-5 ${paymentMethod === id ? 'text-emerald-700' : 'text-slate-600'}`} />
                            </div>
                            <div>
                              <p className="font-semibold text-slate-800">{label}</p>
                              <p className="text-xs text-slate-500">{sublabel}</p>
                            </div>
                            {paymentMethod === id && (
                              <Check className="w-5 h-5 text-emerald-700 ml-auto" />
                            )}
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Terms & Conditions */}
                  <div className="pt-4">
                    <label className="flex items-start gap-3 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={agreedToTerms}
                        onChange={(e) => setAgreedToTerms(e.target.checked)}
                        className="mt-1 w-5 h-5 text-emerald-600 rounded border-slate-300 focus:ring-emerald-500"
                      />
                      <span className="text-sm text-slate-600">
                        I accept Recharge Travels' <a href="#" className="text-emerald-700 hover:underline">Terms & Conditions</a> and <a href="#" className="text-emerald-700 hover:underline">Cancellation Policy</a>.
                      </span>
                    </label>

                    {/* Cancellation Policy */}
                    <div className="mt-4 bg-emerald-50 rounded-xl p-4 flex gap-3">
                      <Check className="w-5 h-5 text-emerald-700 flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="font-semibold text-slate-800">Free cancellation up to 24h</p>
                        <p className="text-sm text-slate-600">Full refund if you cancel 24 hours before pickup. After that, charges may apply.</p>
                      </div>
                    </div>
                  </div>

                  {/* Form Actions */}
                  <div className="pt-6 border-t border-slate-100 flex flex-col sm:flex-row gap-4">
                    <Button
                      variant="outline"
                      onClick={() => setStep(5)}
                      className="flex-1 py-4 text-lg font-semibold rounded-xl border-2 border-slate-200"
                    >
                      <ChevronLeft className="mr-2 w-5 h-5" /> Back
                    </Button>
                    <Button
                      onClick={handleSubmitBooking}
                      disabled={!paymentMethod || !agreedToTerms || isSubmitting}
                      className="flex-1 py-4 text-lg font-semibold rounded-xl text-white"
                      style={{
                        background: 'linear-gradient(135deg, #0d5c46, #1a7f5f)',
                        boxShadow: '0 12px 30px rgba(13, 92, 70, 0.25)'
                      }}
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 className="mr-2 w-5 h-5 animate-spin" />
                          Processing...
                        </>
                      ) : (
                        <>
                          {paymentMethod === 'cash' ? 'Confirm Booking' : `Pay $${calculatedPrice?.price || 0}`} <Check className="ml-2 w-5 h-5" />
                        </>
                      )}
                    </Button>
                  </div>
                </motion.div>
              )}

              {/* Booking Success */}
              {bookingComplete && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="text-center py-8"
                >
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: 'spring', bounce: 0.5 }}
                    className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6"
                  >
                    <Check className="w-10 h-10 text-emerald-700" />
                  </motion.div>

                  <h2 className="text-3xl font-bold text-slate-800 mb-2" style={{ fontFamily: '"Playfair Display", serif' }}>
                    Booking Confirmed!
                  </h2>
                  <p className="text-slate-600 mb-6">Your airport transfer has been successfully booked.</p>

                  <div className="bg-emerald-50 rounded-2xl p-6 max-w-md mx-auto mb-6">
                    <p className="text-sm text-slate-600 mb-2">Your Booking Reference</p>
                    <p className="text-3xl font-bold text-emerald-700">{bookingReference}</p>
                  </div>

                  <p className="text-sm text-slate-500 mb-8">
                    A confirmation email has been sent to <strong>{email}</strong>
                  </p>

                  <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Button
                      onClick={() => {
                        setStep(1);
                        setBookingComplete(false);
                        setBookingState('idle');
                        // Reset form
                        setSelectedAirport(null);
                        setSelectedDestination(null);
                        setAirportSearch('');
                        setDestinationSearch('');
                        setSelectedVehicle(null);
                        setFirstName('');
                        setLastName('');
                        setEmail('');
                        setPhone('');
                        setCountry('');
                        setSelectedExtras(['meet-greet']);
                        setPaymentMethod(null);
                        setAgreedToTerms(false);
                      }}
                      variant="outline"
                      className="px-8 py-3 border-2 border-slate-200 rounded-xl"
                    >
                      Book Another Transfer
                    </Button>
                    <Button
                      className="px-8 py-3 text-white rounded-xl"
                      style={{ background: 'linear-gradient(135deg, #0d5c46, #1a7f5f)' }}
                      onClick={() => window.print()}
                    >
                      <Printer className="mr-2 w-4 h-4" /> Print Confirmation
                    </Button>
                  </div>

                  {/* WhatsApp Support */}
                  <div className="mt-8 pt-8 border-t border-slate-100">
                    <p className="text-sm text-slate-500 mb-3">Need help with your booking?</p>
                    <a
                      href="https://wa.me/94777721999"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-6 py-3 bg-green-500 text-white font-semibold rounded-full hover:bg-green-600 transition-colors"
                    >
                      <MessageCircle className="w-5 h-5" /> WhatsApp Concierge
                    </a>
                  </div>
                </motion.div>
              )}
            </div>

            {/* Summary Sidebar */}
            {!bookingComplete && (
              <aside className="lg:sticky lg:top-24">
                <div className="bg-white rounded-3xl overflow-hidden shadow-xl" style={{ boxShadow: '0 25px 60px rgba(13, 92, 70, 0.12)' }}>
                  {/* Header Image */}
                  <div className="relative h-48 overflow-hidden">
                    <img
                      src="https://images.unsplash.com/photo-1573790387438-4da905039392?auto=format&fit=crop&w=900&q=80"
                      alt="Sri Lanka Airport Transfer"
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                    <div className="absolute bottom-4 left-5 text-white">
                      <p className="text-sm opacity-80">Recharge Travels</p>
                      <p className="text-xl font-bold">Airport Transfer</p>
                      <div className="flex items-center gap-1 mt-1">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                        ))}
                        <span className="text-sm ml-1">(127 reviews)</span>
                      </div>
                    </div>
                  </div>

                  {/* Summary Body */}
                  <div className="p-5 space-y-5">
                    {/* Journey Overview */}
                    <div>
                      <h3 className="font-bold text-lg text-slate-800" style={{ fontFamily: '"Playfair Display", serif' }}>
                        Journey Overview
                      </h3>
                      <p className="text-sm text-slate-500">Hosted by Recharge Travels Concierge</p>
                    </div>

                    {/* Route Info */}
                    {selectedAirport && (selectedDestination || selectedHotel) && (
                      <div className="flex items-center gap-2 text-sm">
                        <span className="flex items-center gap-1 text-emerald-700">
                          <Plane className="w-4 h-4" /> {selectedAirport.code}
                        </span>
                        <span className="text-slate-400">→</span>
                        <span className="flex items-center gap-1 text-amber-600">
                          <MapPin className="w-4 h-4" /> {selectedHotel?.city || selectedDestination?.area}
                        </span>
                      </div>
                    )}

                    {/* Price Box */}
                    <div className="bg-emerald-50 rounded-2xl p-4">
                      {selectedVehicle && (
                        <div className="flex justify-between text-sm mb-2">
                          <span className="text-slate-600">{selectedVehicle.name}</span>
                          <span className="text-slate-800">${calculatedPrice?.breakdown.basePrice || 0}</span>
                        </div>
                      )}
                      {calculatedDistance > 0 && (
                        <div className="flex justify-between text-sm mb-2">
                          <span className="text-slate-600">Distance ({calculatedDistance}km)</span>
                          <span className="text-slate-800">${calculatedPrice?.breakdown.distance || 0}</span>
                        </div>
                      )}
                      {selectedExtras.filter(id => id !== 'meet-greet').length > 0 && (
                        <div className="flex justify-between text-sm mb-2">
                          <span className="text-slate-600">Extras</span>
                          <span className="text-slate-800">
                            +${selectedExtras.filter(id => id !== 'meet-greet').reduce((sum, id) => {
                              const extra = TRANSFER_EXTRAS.find(e => e.id === id);
                              return sum + (extra?.priceUSD || 0);
                            }, 0)}
                          </span>
                        </div>
                      )}
                      <div className="flex justify-between items-baseline pt-3 border-t border-emerald-200 mt-2">
                        <span className="text-slate-600 font-medium">Total</span>
                        <span className="text-2xl font-bold text-emerald-800">${calculatedPrice?.price || 0}</span>
                      </div>
                    </div>

                    {/* Highlights */}
                    <div>
                      <h4 className="font-semibold text-slate-800 mb-3">Included</h4>
                      <ul className="space-y-2 text-sm text-slate-600">
                        <li className="flex items-center gap-2">
                          <Check className="w-4 h-4 text-emerald-700" /> Meet & greet at airport
                        </li>
                        <li className="flex items-center gap-2">
                          <Check className="w-4 h-4 text-emerald-700" /> Flight tracking included
                        </li>
                        <li className="flex items-center gap-2">
                          <Check className="w-4 h-4 text-emerald-700" /> Free cancellation 24h
                        </li>
                        <li className="flex items-center gap-2">
                          <Check className="w-4 h-4 text-emerald-700" /> 24/7 support
                        </li>
                      </ul>
                    </div>

                    {/* WhatsApp Support */}
                    <div className="text-center p-4 border-2 border-dashed border-slate-200 rounded-xl">
                      <p className="text-sm text-slate-500 mb-2">Need help before booking?</p>
                      <a
                        href="https://wa.me/94777721999"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 px-5 py-2.5 bg-green-500 text-white font-semibold rounded-full text-sm hover:bg-green-600 transition-colors"
                      >
                        <MessageCircle className="w-4 h-4" /> WhatsApp Concierge
                      </a>
                    </div>
                  </div>
                </div>
              </aside>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="bg-white border-t border-slate-100 mt-12">
          <div className="max-w-7xl mx-auto px-4 py-4 flex flex-wrap justify-between items-center gap-4 text-sm text-slate-500">
            <span>© 2025 Recharge Travels & Tours • Colombo • Jaffna • Yala</span>
            <div className="flex items-center gap-4">
              <span className="flex items-center gap-1">
                <Shield className="w-4 h-4 text-emerald-600" /> PCI-DSS Secure
              </span>
              <span className="flex items-center gap-1">
                <Plane className="w-4 h-4 text-emerald-600" /> IATA-accredited
              </span>
              <span className="flex items-center gap-1">
                <Headphones className="w-4 h-4 text-emerald-600" /> 24/7 Hotline
              </span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default AirportTransfers;
