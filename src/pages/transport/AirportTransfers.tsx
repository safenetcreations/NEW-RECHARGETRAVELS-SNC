import React, { useState, useEffect, useMemo, useRef } from 'react';
import { Helmet } from 'react-helmet-async';
import Header from '@/components/Header';
import RechargeFooter from '@/components/ui/RechargeFooter';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Plane, Car, Clock, Shield, MapPin, Calendar, Users, ChevronDown, ChevronUp,
  Star, Headphones, Check, ArrowRight, Luggage, Baby, Phone, Mail, User,
  Globe, CreditCard, Navigation, Search, X, ChevronLeft, ChevronRight,
  Loader2, BadgeCheck, Quote
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
  ROUTE_DISTANCES
} from '@/services/airportTransferService';
import type { AirportTransferBooking, AirportTransferPageContent } from '@/services/airportTransferService';

const AirportTransfers = () => {
  // Page content state
  const [pageContent, setPageContent] = useState<AirportTransferPageContent | null>(null);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [loading, setLoading] = useState(true);

  // Booking form state
  const [step, setStep] = useState(1); // 1: Search, 2: Vehicle, 3: Details, 4: Confirmation
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

  // Refs
  const airportInputRef = useRef<HTMLDivElement>(null);
  const destinationInputRef = useRef<HTMLDivElement>(null);

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

  // Auto-rotate hero slides
  useEffect(() => {
    if (!pageContent?.heroSlides?.length) return;
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % pageContent.heroSlides.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [pageContent?.heroSlides?.length]);

  // Click outside handlers
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (airportInputRef.current && !airportInputRef.current.contains(e.target as Node)) {
        setShowAirportResults(false);
      }
      if (destinationInputRef.current && !destinationInputRef.current.contains(e.target as Node)) {
        setShowDestinationResults(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Airport search results - Show all Sri Lankan airports
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

  // Validate step 1
  const canProceedStep1 = selectedAirport && selectedDestination && pickupDate && pickupTime;

  // Validate step 2
  const canProceedStep2 = selectedVehicle !== null;

  // Validate step 3
  const canProceedStep3 = firstName && lastName && email && phone && country;

  // Handle booking submission
  const handleSubmitBooking = async () => {
    if (!canProceedStep3 || !selectedAirport || !selectedDestination || !selectedVehicle || !calculatedPrice) return;

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
      setStep(4);

      toast.success('Booking Confirmed!', {
        description: `Your booking reference is ${booking.bookingReference}`
      });
    } catch (error) {
      console.error('Booking error:', error);
      toast.error('Booking Failed', {
        description: 'Please try again or contact support.'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Icon mapping
  const iconMap: { [key: string]: any } = {
    'Plane': Plane,
    'Users': Users,
    'Clock': Clock,
    'Shield': Shield,
    'Car': Car,
    'CreditCard': CreditCard
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-900 to-slate-900">
        <Loader2 className="w-12 h-12 text-white animate-spin" />
      </div>
    );
  }

  const heroSlides = pageContent?.heroSlides || [];
  const trustIndicators = pageContent?.trustIndicators;
  const features = pageContent?.features || [];
  const popularRoutes = pageContent?.popularRoutes || [];
  const testimonials = pageContent?.testimonials || [];

  return (
    <>
      <Helmet>
        <title>{pageContent?.seoTitle || 'Airport Transfers Sri Lanka - Recharge Travels'}</title>
        <meta name="description" content={pageContent?.seoDescription || 'Premium airport transfers to and from Colombo Airport.'} />
        <meta name="keywords" content={pageContent?.seoKeywords?.join(', ') || 'airport transfer sri lanka'} />
      </Helmet>

      <Header />

      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
        {/* Hero Section with Static Booking Widget */}
        <section className="relative bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
          {/* Background Image */}
          <div className="absolute inset-0">
            {heroSlides[currentSlide] && (
              <img
                src={heroSlides[currentSlide].image}
                alt={heroSlides[currentSlide].title}
                className="w-full h-full object-cover opacity-25"
              />
            )}
            <div className="absolute inset-0 bg-gradient-to-b from-slate-900/90 via-slate-900/85 to-slate-900/95" />
          </div>

          {/* Hero Content */}
          <div className="relative z-10 container mx-auto px-4 pt-28 pb-12">
            <div className="max-w-7xl mx-auto">
              {/* Hero Text */}
              <div className="text-center mb-8">
                <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md px-4 py-2 rounded-full mb-4">
                  <Globe className="w-4 h-4 text-blue-400" />
                  <span className="text-white/90 text-sm font-medium">Sri Lanka Airport Transfers</span>
                </div>

                <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold text-white mb-3">
                  {heroSlides[currentSlide]?.title || 'Airport Transfers'}
                </h1>

                <p className="text-lg md:text-xl text-white/80 max-w-2xl mx-auto mb-4">
                  {heroSlides[currentSlide]?.description || 'Professional airport transfer service across Sri Lanka'}
                </p>

                {/* Trust Indicators */}
                {trustIndicators && (
                  <div className="flex flex-wrap justify-center gap-4 mb-6">
                    <div className="flex items-center gap-2 text-white/90 bg-white/10 backdrop-blur-sm px-3 py-1.5 rounded-full text-sm">
                      <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                      <span className="font-semibold">{trustIndicators.rating}</span>
                      <span className="text-white/70">({trustIndicators.totalReviews} reviews)</span>
                    </div>
                    <div className="flex items-center gap-2 text-white/90 bg-white/10 backdrop-blur-sm px-3 py-1.5 rounded-full text-sm">
                      <BadgeCheck className="w-4 h-4 text-green-400" />
                      <span>{trustIndicators.transfersCompleted} Transfers</span>
                    </div>
                    <div className="flex items-center gap-2 text-white/90 bg-white/10 backdrop-blur-sm px-3 py-1.5 rounded-full text-sm">
                      <Headphones className="w-4 h-4 text-blue-400" />
                      <span>{trustIndicators.support}</span>
                    </div>
                  </div>
                )}
              </div>

              {/* Booking Widget - Always Visible */}
              <div className="max-w-5xl mx-auto">
                <Card className="bg-white shadow-[0_0_80px_20px_rgba(255,255,255,0.15),0_25px_60px_-15px_rgba(0,0,0,0.5)] border-4 border-white overflow-hidden ring-2 ring-white/30">
                  {/* Step Progress */}
                  {step < 4 && (
                    <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-4">
                      <div className="flex items-center justify-between max-w-2xl mx-auto">
                        {['Search', 'Vehicle', 'Details'].map((label, i) => (
                          <div key={label} className="flex items-center">
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center font-semibold text-sm transition-all ${
                              step > i + 1 ? 'bg-green-500 text-white' : step === i + 1 ? 'bg-white text-blue-600' : 'bg-blue-500/50 text-white/70'
                            }`}>
                              {step > i + 1 ? <Check className="w-4 h-4" /> : i + 1}
                            </div>
                            <span className={`ml-2 text-sm font-medium hidden sm:block ${step >= i + 1 ? 'text-white' : 'text-white/70'}`}>
                              {label}
                            </span>
                            {i < 2 && <ChevronRight className="w-5 h-5 mx-4 text-white/50" />}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  <CardContent className="p-6">
                    {/* Step 1: Search */}
                    {step === 1 && (
                      <div className="space-y-6">
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
                                  ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/25'
                                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                              }`}
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
                            <Label className="text-sm font-semibold text-gray-700 mb-2 block">
                              {transferType === 'departure' ? 'Drop-off Airport' : 'Pickup Airport'}
                            </Label>
                            <div className="relative">
                              <Plane className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-blue-500" />
                              <Input
                                value={airportSearch}
                                onChange={(e) => {
                                  setAirportSearch(e.target.value);
                                  setShowAirportResults(true);
                                  if (!e.target.value) setSelectedAirport(null);
                                }}
                                onFocus={() => setShowAirportResults(true)}
                                placeholder="Search airports..."
                                className="pl-10 py-3 h-14 bg-white border-2 border-gray-400 focus:border-blue-600 focus:ring-2 focus:ring-blue-200 rounded-xl text-gray-900 placeholder:text-gray-600 font-semibold shadow-md"
                              />
                              {selectedAirport && (
                                <button
                                  onClick={() => {
                                    setSelectedAirport(null);
                                    setAirportSearch('');
                                  }}
                                  className="absolute right-3 top-1/2 -translate-y-1/2"
                                >
                                  <X className="w-4 h-4 text-gray-400 hover:text-gray-600" />
                                </button>
                              )}
                            </div>

                            {/* Airport Results Dropdown */}
                            {showAirportResults && airportResults.length > 0 && (
                              <div className="absolute z-50 w-full mt-2 bg-white rounded-xl shadow-2xl border border-gray-100 max-h-80 overflow-y-auto">
                                {airportResults.map((airport) => (
                                  <button
                                    key={airport.code}
                                    onClick={() => handleAirportSelect(airport)}
                                    className="w-full px-4 py-3 text-left hover:bg-blue-50 flex items-start gap-3 border-b border-gray-50 last:border-0 transition-colors"
                                  >
                                    <div className="w-12 h-8 bg-blue-100 rounded flex items-center justify-center text-blue-700 font-bold text-sm">
                                      {airport.code}
                                    </div>
                                    <div className="flex-1">
                                      <div className="font-medium text-gray-900">{airport.name}</div>
                                      <div className="text-sm text-gray-500">{airport.city}, {airport.country}</div>
                                    </div>
                                  </button>
                                ))}
                              </div>
                            )}
                          </div>

                          {/* Destination Search */}
                          <div ref={destinationInputRef} className="relative">
                            <Label className="text-sm font-semibold text-gray-700 mb-2 block">
                              {transferType === 'departure' ? 'Pickup Location' : 'Drop-off Location'}
                            </Label>
                            <div className="relative">
                              <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-green-500" />
                              <Input
                                value={destinationSearch}
                                onChange={(e) => {
                                  setDestinationSearch(e.target.value);
                                  setShowDestinationResults(true);
                                  if (!e.target.value) setSelectedDestination(null);
                                }}
                                onFocus={() => setShowDestinationResults(true)}
                                placeholder="Hotel, city, or destination..."
                                className="pl-10 py-3 h-14 bg-white border-2 border-gray-400 focus:border-blue-600 focus:ring-2 focus:ring-blue-200 rounded-xl text-gray-900 placeholder:text-gray-600 font-semibold shadow-md"
                              />
                              {selectedDestination && (
                                <button
                                  onClick={() => {
                                    setSelectedDestination(null);
                                    setDestinationSearch('');
                                  }}
                                  className="absolute right-3 top-1/2 -translate-y-1/2"
                                >
                                  <X className="w-4 h-4 text-gray-400 hover:text-gray-600" />
                                </button>
                              )}
                            </div>

                            {/* Destination Results Dropdown */}
                            {showDestinationResults && destinationResults.length > 0 && (
                              <div className="absolute z-50 w-full mt-2 bg-white rounded-xl shadow-2xl border border-gray-100 max-h-80 overflow-y-auto">
                                {destinationResults.map((dest, i) => (
                                  <button
                                    key={i}
                                    onClick={() => handleDestinationSelect(dest)}
                                    className="w-full px-4 py-3 text-left hover:bg-green-50 flex items-center gap-3 border-b border-gray-50 last:border-0 transition-colors"
                                  >
                                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                                      dest.type === 'beach' ? 'bg-cyan-100 text-cyan-600' :
                                      dest.type === 'city' ? 'bg-blue-100 text-blue-600' :
                                      dest.type === 'attraction' ? 'bg-amber-100 text-amber-600' :
                                      dest.type === 'wildlife' ? 'bg-green-100 text-green-600' :
                                      'bg-purple-100 text-purple-600'
                                    }`}>
                                      <MapPin className="w-4 h-4" />
                                    </div>
                                    <div>
                                      <div className="font-medium text-gray-900">{dest.name}</div>
                                      <div className="text-sm text-gray-500">{dest.area}</div>
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
                            <Label className="text-sm font-semibold text-gray-700 mb-2 block">Pickup Date</Label>
                            <div className="relative">
                              <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-blue-500" />
                              <Input
                                type="date"
                                value={pickupDate}
                                onChange={(e) => setPickupDate(e.target.value)}
                                min={getMinDate()}
                                className="pl-10 py-3 h-14 bg-white border-2 border-gray-400 focus:border-blue-600 focus:ring-2 focus:ring-blue-200 rounded-xl text-gray-900 font-semibold shadow-md"
                              />
                            </div>
                          </div>

                          <div>
                            <Label className="text-sm font-semibold text-gray-700 mb-2 block">
                              {transferType === 'arrival' ? 'Flight Arrival Time' : 'Pickup Time'}
                            </Label>
                            <div className="relative">
                              <Clock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-blue-500" />
                              <Input
                                type="time"
                                value={pickupTime}
                                onChange={(e) => setPickupTime(e.target.value)}
                                className="pl-10 py-3 h-14 bg-white border-2 border-gray-400 focus:border-blue-600 focus:ring-2 focus:ring-blue-200 rounded-xl text-gray-900 font-semibold shadow-md"
                              />
                            </div>
                          </div>

                          {transferType === 'round-trip' && (
                            <>
                              <div>
                                <Label className="text-sm font-semibold text-gray-700 mb-2 block">Return Date</Label>
                                <Input
                                  type="date"
                                  value={returnDate}
                                  onChange={(e) => setReturnDate(e.target.value)}
                                  min={pickupDate || getMinDate()}
                                  className="py-3 h-14 bg-white border-2 border-gray-400 focus:border-blue-600 focus:ring-2 focus:ring-blue-200 rounded-xl text-gray-900 font-semibold shadow-md"
                                />
                              </div>
                              <div>
                                <Label className="text-sm font-semibold text-gray-700 mb-2 block">Return Time</Label>
                                <Input
                                  type="time"
                                  value={returnTime}
                                  onChange={(e) => setReturnTime(e.target.value)}
                                  className="py-3 h-14 bg-white border-2 border-gray-400 focus:border-blue-600 focus:ring-2 focus:ring-blue-200 rounded-xl text-gray-900 font-semibold shadow-md"
                                />
                              </div>
                            </>
                          )}
                        </div>

                        {/* Passengers & Luggage */}
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                          <div>
                            <Label className="text-sm font-semibold text-gray-700 mb-2 block flex items-center gap-2">
                              <Users className="w-4 h-4 text-blue-500" /> Adults
                            </Label>
                            <div className="flex items-center h-14 bg-white border-2 border-gray-400 rounded-xl overflow-hidden shadow-md">
                              <button
                                type="button"
                                onClick={() => setAdults(Math.max(1, adults - 1))}
                                className="px-4 py-2 hover:bg-gray-200 text-gray-700 font-bold transition-colors"
                              >-</button>
                              <span className="flex-1 text-center font-bold text-gray-900">{adults}</span>
                              <button
                                type="button"
                                onClick={() => setAdults(adults + 1)}
                                className="px-4 py-2 hover:bg-gray-200 text-gray-700 font-bold transition-colors"
                              >+</button>
                            </div>
                          </div>

                          <div>
                            <Label className="text-sm font-semibold text-gray-700 mb-2 block flex items-center gap-2">
                              <User className="w-4 h-4 text-blue-500" /> Children
                            </Label>
                            <div className="flex items-center h-14 bg-white border-2 border-gray-400 rounded-xl overflow-hidden shadow-md">
                              <button
                                type="button"
                                onClick={() => setChildren(Math.max(0, children - 1))}
                                className="px-4 py-2 hover:bg-gray-200 text-gray-700 font-bold transition-colors"
                              >-</button>
                              <span className="flex-1 text-center font-bold text-gray-900">{children}</span>
                              <button
                                type="button"
                                onClick={() => setChildren(children + 1)}
                                className="px-4 py-2 hover:bg-gray-200 text-gray-700 font-bold transition-colors"
                              >+</button>
                            </div>
                          </div>

                          <div>
                            <Label className="text-sm font-semibold text-gray-700 mb-2 block flex items-center gap-2">
                              <Baby className="w-4 h-4 text-blue-500" /> Infants
                            </Label>
                            <div className="flex items-center h-14 bg-white border-2 border-gray-400 rounded-xl overflow-hidden shadow-md">
                              <button
                                type="button"
                                onClick={() => setInfants(Math.max(0, infants - 1))}
                                className="px-4 py-2 hover:bg-gray-200 text-gray-700 font-bold transition-colors"
                              >-</button>
                              <span className="flex-1 text-center font-bold text-gray-900">{infants}</span>
                              <button
                                type="button"
                                onClick={() => setInfants(infants + 1)}
                                className="px-4 py-2 hover:bg-gray-200 text-gray-700 font-bold transition-colors"
                              >+</button>
                            </div>
                          </div>

                          <div>
                            <Label className="text-sm font-semibold text-gray-700 mb-2 block flex items-center gap-2">
                              <Luggage className="w-4 h-4 text-blue-500" /> Luggage
                            </Label>
                            <div className="flex items-center h-14 bg-white border-2 border-gray-400 rounded-xl overflow-hidden shadow-md">
                              <button
                                type="button"
                                onClick={() => setLuggage(Math.max(0, luggage - 1))}
                                className="px-4 py-2 hover:bg-gray-200 text-gray-700 font-bold transition-colors"
                              >-</button>
                              <span className="flex-1 text-center font-bold text-gray-900">{luggage}</span>
                              <button
                                type="button"
                                onClick={() => setLuggage(luggage + 1)}
                                className="px-4 py-2 hover:bg-gray-200 text-gray-700 font-bold transition-colors"
                              >+</button>
                            </div>
                          </div>
                        </div>

                        {/* Next Button */}
                        <Button
                          onClick={() => setStep(2)}
                          disabled={!canProceedStep1}
                          className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 py-4 text-lg font-semibold rounded-xl shadow-lg shadow-blue-500/25"
                        >
                          Select Vehicle <ArrowRight className="ml-2 w-5 h-5" />
                        </Button>
                      </div>
                    )}

                    {/* Step 2: Vehicle Selection */}
                    {step === 2 && (
                      <div className="space-y-6">
                        <button
                          onClick={() => setStep(1)}
                          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4"
                        >
                          <ChevronLeft className="w-4 h-4" /> Back to Search
                        </button>

                        <div className="text-center mb-6">
                          <h3 className="text-2xl font-bold text-gray-900 mb-2">Select Your Vehicle</h3>
                          <p className="text-gray-600">
                            {selectedAirport?.code} → {selectedDestination?.name}
                            <span className="mx-2">•</span>
                            {adults + children} passengers
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
                                    ? 'border-blue-500 shadow-lg shadow-blue-500/20 bg-blue-50/50'
                                    : 'border-gray-200 hover:border-gray-300 hover:shadow-md'
                                }`}
                              >
                                {selectedVehicle?.id === vehicle.id && (
                                  <div className="absolute top-3 right-3 w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center">
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
                                  <h4 className="font-bold text-gray-900">{vehicle.name}</h4>
                                  <p className="text-sm text-gray-500 mb-3">{vehicle.description}</p>

                                  <div className="flex items-center gap-4 text-sm text-gray-600 mb-3">
                                    <span className="flex items-center gap-1">
                                      <Users className="w-4 h-4" /> {vehicle.passengers}
                                    </span>
                                    <span className="flex items-center gap-1">
                                      <Luggage className="w-4 h-4" /> {vehicle.luggage}
                                    </span>
                                  </div>

                                  <div className="flex items-baseline gap-1">
                                    <span className="text-2xl font-bold text-blue-600">${price.price}</span>
                                    <span className="text-gray-500 text-sm">
                                      {transferType === 'round-trip' ? 'round trip' : 'one way'}
                                    </span>
                                  </div>
                                </div>
                              </div>
                            );
                          })}
                        </div>

                        <Button
                          onClick={() => setStep(3)}
                          disabled={!canProceedStep2}
                          className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 py-4 text-lg font-semibold rounded-xl shadow-lg shadow-blue-500/25"
                        >
                          Continue to Details <ArrowRight className="ml-2 w-5 h-5" />
                        </Button>
                      </div>
                    )}

                    {/* Step 3: Customer Details */}
                    {step === 3 && (
                      <div className="space-y-6">
                        <button
                          onClick={() => setStep(2)}
                          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4"
                        >
                          <ChevronLeft className="w-4 h-4" /> Back to Vehicle
                        </button>

                        <div className="grid lg:grid-cols-3 gap-8">
                          {/* Customer Form */}
                          <div className="lg:col-span-2 space-y-4">
                            <h3 className="text-xl font-bold text-gray-900 mb-4">Your Details</h3>

                            <div className="grid md:grid-cols-2 gap-4">
                              <div>
                                <Label className="text-sm font-medium">First Name *</Label>
                                <Input
                                  value={firstName}
                                  onChange={(e) => setFirstName(e.target.value)}
                                  placeholder="John"
                                  className="mt-1"
                                />
                              </div>
                              <div>
                                <Label className="text-sm font-medium">Last Name *</Label>
                                <Input
                                  value={lastName}
                                  onChange={(e) => setLastName(e.target.value)}
                                  placeholder="Smith"
                                  className="mt-1"
                                />
                              </div>
                            </div>

                            <div className="grid md:grid-cols-2 gap-4">
                              <div>
                                <Label className="text-sm font-medium">Email *</Label>
                                <Input
                                  type="email"
                                  value={email}
                                  onChange={(e) => setEmail(e.target.value)}
                                  placeholder="john@example.com"
                                  className="mt-1"
                                />
                              </div>
                              <div>
                                <Label className="text-sm font-medium">Phone Number *</Label>
                                <Input
                                  value={phone}
                                  onChange={(e) => setPhone(e.target.value)}
                                  placeholder="+44 123 456 7890"
                                  className="mt-1"
                                />
                              </div>
                            </div>

                            <div className="grid md:grid-cols-2 gap-4">
                              <div>
                                <Label className="text-sm font-medium">Country *</Label>
                                <Input
                                  value={country}
                                  onChange={(e) => setCountry(e.target.value)}
                                  placeholder="United Kingdom"
                                  className="mt-1"
                                />
                              </div>
                              <div>
                                <Label className="text-sm font-medium">Flight Number</Label>
                                <Input
                                  value={flightNumber}
                                  onChange={(e) => setFlightNumber(e.target.value)}
                                  placeholder="UL123"
                                  className="mt-1"
                                />
                              </div>
                            </div>

                            {children > 0 && (
                              <div>
                                <Label className="text-sm font-medium">Child Seats Required</Label>
                                <div className="flex items-center border rounded-lg mt-1 w-32">
                                  <button
                                    type="button"
                                    onClick={() => setChildSeats(Math.max(0, childSeats - 1))}
                                    className="px-3 py-2 hover:bg-gray-100"
                                  >-</button>
                                  <span className="flex-1 text-center">{childSeats}</span>
                                  <button
                                    type="button"
                                    onClick={() => setChildSeats(Math.min(children, childSeats + 1))}
                                    className="px-3 py-2 hover:bg-gray-100"
                                  >+</button>
                                </div>
                              </div>
                            )}

                            <div>
                              <Label className="text-sm font-medium">Special Requests</Label>
                              <Textarea
                                value={specialRequests}
                                onChange={(e) => setSpecialRequests(e.target.value)}
                                placeholder="Any special requirements..."
                                className="mt-1"
                                rows={3}
                              />
                            </div>
                          </div>

                          {/* Booking Summary */}
                          <div className="lg:col-span-1">
                            <div className="bg-gradient-to-br from-slate-900 to-blue-900 rounded-2xl p-6 text-white sticky top-4">
                              <h4 className="font-bold text-lg mb-4">Booking Summary</h4>

                              <div className="space-y-3 text-sm">
                                <div className="flex justify-between">
                                  <span className="text-white/70">Transfer Type</span>
                                  <span className="capitalize">{transferType.replace('-', ' ')}</span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-white/70">From</span>
                                  <span>{selectedAirport?.code}</span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-white/70">To</span>
                                  <span className="text-right">{selectedDestination?.name}</span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-white/70">Date</span>
                                  <span>{pickupDate}</span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-white/70">Time</span>
                                  <span>{pickupTime}</span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-white/70">Passengers</span>
                                  <span>{adults + children + infants}</span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-white/70">Vehicle</span>
                                  <span>{selectedVehicle?.name}</span>
                                </div>

                                <div className="border-t border-white/20 pt-3 mt-3">
                                  <div className="flex justify-between items-baseline">
                                    <span className="text-white/70">Total</span>
                                    <span className="text-3xl font-bold">${calculatedPrice?.price || 0}</span>
                                  </div>
                                  <p className="text-xs text-white/50 mt-1">Includes all taxes & fees</p>
                                </div>
                              </div>

                              <div className="mt-4 pt-4 border-t border-white/20 space-y-2 text-xs text-white/70">
                                <div className="flex items-center gap-2">
                                  <Check className="w-3 h-3 text-green-400" />
                                  Meet & greet included
                                </div>
                                <div className="flex items-center gap-2">
                                  <Check className="w-3 h-3 text-green-400" />
                                  Flight tracking included
                                </div>
                                <div className="flex items-center gap-2">
                                  <Check className="w-3 h-3 text-green-400" />
                                  Free cancellation 24h
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>

                        <Button
                          onClick={handleSubmitBooking}
                          disabled={!canProceedStep3 || isSubmitting}
                          className="w-full bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 py-4 text-lg font-semibold rounded-xl shadow-lg shadow-green-500/25"
                        >
                          {isSubmitting ? (
                            <>
                              <Loader2 className="mr-2 w-5 h-5 animate-spin" />
                              Processing...
                            </>
                          ) : (
                            <>
                              Confirm Booking <Check className="ml-2 w-5 h-5" />
                            </>
                          )}
                        </Button>
                      </div>
                    )}

                    {/* Step 4: Confirmation */}
                    {step === 4 && (
                      <div className="text-center py-8">
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6"
                        >
                          <Check className="w-10 h-10 text-green-600" />
                        </motion.div>

                        <h2 className="text-3xl font-bold text-gray-900 mb-2">Booking Confirmed!</h2>
                        <p className="text-gray-600 mb-6">Your airport transfer has been successfully booked.</p>

                        <div className="bg-blue-50 rounded-2xl p-6 max-w-md mx-auto mb-6">
                          <p className="text-sm text-gray-600 mb-2">Your Booking Reference</p>
                          <p className="text-3xl font-bold text-blue-600">{bookingReference}</p>
                        </div>

                        <p className="text-sm text-gray-500 mb-8">
                          A confirmation email has been sent to <strong>{email}</strong>
                        </p>

                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                          <Button
                            onClick={() => {
                              setStep(1);
                              setBookingComplete(false);
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
                            }}
                            variant="outline"
                            className="px-8 py-3"
                          >
                            Book Another Transfer
                          </Button>
                          <Button
                            className="px-8 py-3 bg-blue-600 hover:bg-blue-700"
                            onClick={() => window.print()}
                          >
                            Print Confirmation
                          </Button>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>

          {/* Slide Indicators */}
          {heroSlides.length > 1 && (
            <div className="relative z-20 pb-6 flex justify-center gap-2">
              {heroSlides.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentSlide(i)}
                  className={`h-2 rounded-full transition-all ${
                    currentSlide === i ? 'w-8 bg-white' : 'w-2 bg-white/50'
                  }`}
                />
              ))}
            </div>
          )}
        </section>

        {/* Popular Routes Section */}
        {popularRoutes.length > 0 && (
          <section className="py-20 bg-white">
            <div className="container mx-auto px-4">
              <div className="text-center mb-12">
                <Badge className="mb-4 bg-blue-100 text-blue-700 hover:bg-blue-100">Popular Routes</Badge>
                <h2 className="text-4xl font-bold text-gray-900 mb-4">Fixed Price Transfers</h2>
                <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                  From Bandaranaike International Airport to top destinations
                </p>
              </div>

              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
                {popularRoutes.map((route, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.1 }}
                  >
                    <Card
                      className="text-center hover:shadow-xl transition-all cursor-pointer group border-0 shadow-lg"
                      onClick={() => {
                        setStep(1);
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                      }}
                    >
                      <CardContent className="pt-6 pb-8">
                        <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-blue-600 transition-colors">
                          <MapPin className="w-6 h-6 text-blue-600 group-hover:text-white transition-colors" />
                        </div>
                        <h3 className="font-bold text-lg text-gray-900 mb-1">{route.destination}</h3>
                        <p className="text-gray-500 text-sm mb-4">{route.duration} • {route.distance}km</p>
                        <p className="text-3xl font-bold text-blue-600">
                          ${route.price}
                        </p>
                        <p className="text-xs text-gray-400 mt-1">per sedan</p>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Features Section */}
        {features.length > 0 && (
          <section className="py-20 bg-gradient-to-br from-slate-900 to-blue-900 text-white">
            <div className="container mx-auto px-4">
              <div className="text-center mb-12">
                <Badge className="mb-4 bg-white/10 text-white hover:bg-white/20">Why Choose Us</Badge>
                <h2 className="text-4xl font-bold mb-4">Premium Transfer Experience</h2>
                <p className="text-xl text-white/70 max-w-2xl mx-auto">
                  Every detail designed for your comfort and peace of mind
                </p>
              </div>

              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
                {features.map((feature, i) => {
                  const Icon = iconMap[feature.icon] || Shield;
                  return (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: i * 0.1 }}
                      className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 hover:bg-white/10 transition-colors"
                    >
                      <div className="w-14 h-14 bg-blue-500/20 rounded-xl flex items-center justify-center mb-4">
                        <Icon className="w-7 h-7 text-blue-400" />
                      </div>
                      <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
                      <p className="text-white/70 mb-4">{feature.description}</p>
                      <div className="flex items-center gap-2 text-green-400 text-sm font-medium">
                        <Check className="w-4 h-4" />
                        {feature.highlight}
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </div>
          </section>
        )}

        {/* Testimonials Section */}
        {testimonials.length > 0 && (
          <section className="py-20 bg-white">
            <div className="container mx-auto px-4">
              <div className="text-center mb-12">
                <Badge className="mb-4 bg-amber-100 text-amber-700 hover:bg-amber-100">Testimonials</Badge>
                <h2 className="text-4xl font-bold text-gray-900 mb-4">What Our Customers Say</h2>
              </div>

              <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
                {testimonials.map((testimonial, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.1 }}
                    className="bg-gray-50 rounded-2xl p-6"
                  >
                    <div className="flex items-center gap-1 mb-4">
                      {[...Array(5)].map((_, j) => (
                        <Star
                          key={j}
                          className={`w-5 h-5 ${j < testimonial.rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-200'}`}
                        />
                      ))}
                    </div>
                    <p className="text-gray-600 mb-4 italic">"{testimonial.text}"</p>
                    <div>
                      <p className="font-semibold text-gray-900">{testimonial.name}</p>
                      <p className="text-sm text-gray-500">{testimonial.country}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* CTA Section */}
        <section className="py-20 bg-gradient-to-r from-blue-600 to-blue-700">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-4xl font-bold text-white mb-4">
              Ready to Book Your Transfer?
            </h2>
            <p className="text-xl text-white/80 mb-8 max-w-2xl mx-auto">
              Fixed prices, professional drivers, and 24/7 support. Book now and travel with peace of mind.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                size="lg"
                className="bg-white text-blue-600 hover:bg-white/90 px-8 py-6 text-lg"
                onClick={() => {
                  setStep(1);
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
              >
                Book Now <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-white text-white hover:bg-white/10 px-8 py-6 text-lg"
                onClick={() => window.open('https://wa.me/94777123456', '_blank')}
              >
                <Phone className="mr-2 w-5 h-5" /> WhatsApp Us
              </Button>
            </div>
          </div>
        </section>
      </div>

      <RechargeFooter />
    </>
  );
};

export default AirportTransfers;
