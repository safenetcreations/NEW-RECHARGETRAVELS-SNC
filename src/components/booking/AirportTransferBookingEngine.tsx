import React, { useState, useEffect, useMemo, useRef } from 'react';
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
  calculateDynamicPrice,
  ROUTE_DISTANCES,
  PRELOADED_HOTELS,
  TRANSFER_EXTRAS,
  CMB_AIRPORT_COORDS,
  JAF_AIRPORT_COORDS,
  calculateHaversineDistance,
  calculateDuration,
  calculateTotalWithExtrasUSD,
  searchHotels,
  DEFAULT_VEHICLE_PRICING,
} from '@/services/airportTransferService';
import type {
  AirportTransferBooking,
  AirportTransferPageContent,
  HotelLocation,
  TransferExtra,
  FlightInfo,
  PriceBreakdown,
  VehiclePricing,
} from '@/services/airportTransferService';
import {
  searchFlight,
  debounceFlightSearch,
  formatArrivalTime,
  getStatusColor,
  getStatusText,
  getAirlineFromFlightNumber,
} from '@/services/flightTrackingService';
import { GoogleMap, DirectionsRenderer, Marker, useJsApiLoader, Autocomplete } from '@react-google-maps/api';
import { getEffectiveApiKey, isDemoMode, googleMapsLibraries } from '@/lib/googleMapsConfig';
import { Route, Milestone, LocateFixed, FileText, Send } from 'lucide-react';
import {
  downloadBookingPDF,
  openWhatsAppConfirmation,
  notifyAdminWhatsApp,
  sendBookingConfirmation,
} from '@/services/bookingConfirmationService';

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

interface AirportTransferBookingEngineProps {
  showHeader?: boolean;
  embedded?: boolean;
  className?: string;
}

const AirportTransferBookingEngine: React.FC<AirportTransferBookingEngineProps> = ({
  showHeader = true,
  embedded = false,
  className = ''
}) => {
  // Page content state
  const [pageContent, setPageContent] = useState<AirportTransferPageContent | null>(null);
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
  const [completedBooking, setCompletedBooking] = useState<AirportTransferBooking | null>(null);

  // Flight tracking state
  const [flightSearchQuery, setFlightSearchQuery] = useState('');
  const [selectedFlight, setSelectedFlight] = useState<FlightInfo | null>(null);
  const [flightSearchLoading, setFlightSearchLoading] = useState(false);

  // Hotel selection state
  const [hotelSearchQuery, setHotelSearchQuery] = useState('');
  const [selectedHotel, setSelectedHotel] = useState<HotelLocation | null>(null);
  const [showHotelResults, setShowHotelResults] = useState(false);

  // Extras state
  const [selectedExtras, setSelectedExtras] = useState<string[]>(['meet-greet']);
  const [childSeatCount, setChildSeatCount] = useState(0);

  // Payment state
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'paypal' | 'cash' | null>(null);
  const [agreedToTerms, setAgreedToTerms] = useState(false);

  // Route calculation
  const [calculatedDistance, setCalculatedDistance] = useState(0);
  const [calculatedDuration, setCalculatedDuration] = useState('');

  // Google Maps state
  const [directions, setDirections] = useState<google.maps.DirectionsResult | null>(null);
  const [mapLoaded, setMapLoaded] = useState(false);

  // Google Maps API loader - use same ID as other components to avoid conflicts
  const apiKey = getEffectiveApiKey();
  const { isLoaded: googleMapsLoaded, loadError } = useJsApiLoader({
    id: 'google-map-script',  // Use same ID to share loader instance
    googleMapsApiKey: apiKey || '',
    libraries: googleMapsLibraries
  });

  // Check if Google Places is truly ready
  const isGooglePlacesReady = googleMapsLoaded && !loadError && apiKey && !isDemoMode() &&
    typeof window !== 'undefined' && window.google?.maps?.places;

  // Refs
  const airportInputRef = useRef<HTMLDivElement>(null);
  const destinationInputRef = useRef<HTMLDivElement>(null);
  const hotelInputRef = useRef<HTMLDivElement>(null);

  // Google Places Autocomplete refs
  const [destinationAutocomplete, setDestinationAutocomplete] = useState<google.maps.places.Autocomplete | null>(null);
  const [placesDestination, setPlacesDestination] = useState<{
    name: string;
    address: string;
    coordinates: { lat: number; lng: number };
    placeId: string;
  } | null>(null);

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

  // Calculate distance when hotel/destination is selected
  useEffect(() => {
    if (!selectedAirport) return;

    const airportCoords = selectedAirport.code === 'CMB' ? CMB_AIRPORT_COORDS :
                         selectedAirport.code === 'JAF' ? JAF_AIRPORT_COORDS :
                         CMB_AIRPORT_COORDS;

    // Priority 1: Selected hotel (from hotel search or Google Places)
    if (selectedHotel?.coordinates) {
      const distance = calculateHaversineDistance(airportCoords, selectedHotel.coordinates);
      const duration = calculateDuration(distance);
      console.log('Distance calculated from hotel:', distance, 'km');
      setCalculatedDistance(distance);
      setCalculatedDuration(duration);
      return;
    }

    // Priority 2: Google Places destination
    if (placesDestination?.coordinates) {
      const distance = calculateHaversineDistance(airportCoords, placesDestination.coordinates);
      const duration = calculateDuration(distance);
      console.log('Distance calculated from Google Places:', distance, 'km');
      setCalculatedDistance(distance);
      setCalculatedDuration(duration);
      return;
    }

    // Priority 3: Static destination selection
    if (selectedDestination) {
      const destKey = selectedDestination.area.toLowerCase().replace(/\s+/g, '-');
      const distance = ROUTE_DISTANCES[destKey] || 100;
      console.log('Distance calculated from static destination:', distance, 'km');
      setCalculatedDistance(distance);
      setCalculatedDuration(calculateDuration(distance));
      return;
    }

    // Reset if nothing selected
    setCalculatedDistance(0);
    setCalculatedDuration('');
  }, [selectedHotel, selectedAirport, selectedDestination, placesDestination]);

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
    if (!selectedVehicle) return null;
    let distance = calculatedDistance;

    // Use fallback distance if not calculated yet
    if (distance === 0) {
      if (selectedDestination) {
        const destKey = selectedDestination.area.toLowerCase().replace(/\s+/g, '-');
        distance = ROUTE_DISTANCES[destKey] || 100;
      } else if (placesDestination || selectedHotel) {
        // Default distance for Google Places selections if calculation hasn't run yet
        distance = 50;
      } else {
        distance = 30; // Minimum default
      }
    }

    console.log('Price calculation - Distance:', distance, 'Vehicle:', selectedVehicle.id);
    return calculateDynamicPrice(
      distance,
      selectedVehicle.id,
      pageContent?.vehiclePricing,
      transferType === 'round-trip'
    );
  }, [selectedDestination, selectedVehicle, transferType, calculatedDistance, pageContent?.vehiclePricing, placesDestination, selectedHotel]);

  // Calculate extras total
  const extrasTotal = useMemo(() => {
    let total = 0;
    selectedExtras.forEach(extraId => {
      const extra = TRANSFER_EXTRAS.find(e => e.id === extraId);
      if (extra && extra.priceUSD > 0) {
        total += extra.priceUSD;
      }
    });
    // Add child seat cost ($5 per seat)
    if (selectedExtras.includes('child-seat') && childSeatCount > 0) {
      total += childSeatCount * 5;
    }
    return total;
  }, [selectedExtras, childSeatCount]);

  // Calculate grand total with extras
  const grandTotal = useMemo(() => {
    if (!calculatedPrice) return 0;
    return calculatedPrice.price + extrasTotal;
  }, [calculatedPrice, extrasTotal]);

  // Filtered vehicles by passenger count
  const suitableVehicles = useMemo(() => {
    const totalPassengers = adults + children;
    return VEHICLE_TYPES.filter(v => v.passengers >= totalPassengers);
  }, [adults, children]);

  // Step validation
  const canProceedToStep = (targetStep: number): boolean => {
    const hasDestination = !!(selectedHotel || selectedDestination || placesDestination);
    switch (targetStep) {
      case 2:
        return !!(selectedAirport && hasDestination && pickupDate && pickupTime);
      case 3:
        return !!(selectedAirport && hasDestination && pickupDate && pickupTime);
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
            } catch (e) {
              console.error('Unable to parse arrival time', e);
            }
          }
        }
        setFlightSearchLoading(false);
      });
    } else {
      setSelectedFlight(null);
    }
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

  // Google Places Autocomplete handlers
  const onDestinationAutocompleteLoad = (autocomplete: google.maps.places.Autocomplete) => {
    setDestinationAutocomplete(autocomplete);
  };

  const onDestinationPlaceChanged = () => {
    if (destinationAutocomplete) {
      const place = destinationAutocomplete.getPlace();
      if (place.geometry && place.geometry.location) {
        const lat = place.geometry.location.lat();
        const lng = place.geometry.location.lng();

        setPlacesDestination({
          name: place.name || place.formatted_address || 'Selected Location',
          address: place.formatted_address || '',
          coordinates: { lat, lng },
          placeId: place.place_id || '',
        });

        // Also set as hotel for distance calculation
        setSelectedHotel({
          id: place.place_id || `place-${Date.now()}`,
          name: place.name || 'Selected Location',
          city: place.vicinity || place.formatted_address?.split(',')[1]?.trim() || 'Sri Lanka',
          area: place.formatted_address?.split(',')[0] || 'Sri Lanka',
          coordinates: { lat, lng },
          rating: 4.5,
          image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=400',
        });

        setDestinationSearch(place.name || place.formatted_address || '');
        setShowDestinationResults(false);
        setSelectedDestination(null);
        setDirections(null);
      }
    }
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

  // Get min date
  const getMinDate = () => new Date().toISOString().split('T')[0];

  // Handle booking submission
  const handleSubmitBooking = async () => {
    const hasDestination = !!(selectedHotel || selectedDestination || placesDestination);

    // Debug logging
    console.log('Booking submission check:', {
      selectedAirport: !!selectedAirport,
      hasDestination,
      selectedVehicle: !!selectedVehicle,
      calculatedPrice: calculatedPrice,
      calculatedDistance,
      firstName, lastName, email, phone, country
    });

    if (!selectedAirport || !hasDestination || !selectedVehicle) {
      toast.error('Missing Information', { description: 'Please select airport, destination and vehicle.' });
      return;
    }

    // Ensure we have a price - calculate if missing
    let priceToUse = calculatedPrice;
    if (!priceToUse) {
      const fallbackDistance = calculatedDistance > 0 ? calculatedDistance : 50;
      priceToUse = calculateDynamicPrice(
        fallbackDistance,
        selectedVehicle.id,
        pageContent?.vehiclePricing,
        transferType === 'round-trip'
      );
      console.log('Used fallback price calculation:', priceToUse);
    }

    if (!firstName || !lastName || !email || !phone || !country) {
      toast.error('Missing Customer Details', { description: 'Please fill in all customer details.' });
      return;
    }

    setIsSubmitting(true);

    const destinationName = placesDestination?.name || selectedHotel?.name || selectedDestination?.name || 'Unknown';
    const destinationArea = placesDestination?.address || selectedHotel?.city || selectedDestination?.area || 'Sri Lanka';

    try {
      console.log('Creating booking with price:', priceToUse);
      const booking = await airportTransferService.createBooking({
        transferType,
        pickupAirport: {
          code: selectedAirport.code,
          name: selectedAirport.name,
          city: selectedAirport.city,
          country: selectedAirport.country
        },
        dropoffLocation: {
          name: destinationName,
          area: destinationArea
        },
        flightNumber,
        pickupDate,
        pickupTime,
        returnDate: transferType === 'round-trip' ? returnDate : null,
        returnTime: transferType === 'round-trip' ? returnTime : null,
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
          basePrice: priceToUse.breakdown.basePrice,
          distance: calculatedDistance > 0 ? calculatedDistance : 50,
          extrasPrice: extrasTotal,
          totalPrice: priceToUse.price + extrasTotal,
          currency: priceToUse.currency
        },
        extras: selectedExtras.filter(id => id !== 'meet-greet'),
        childSeatCount: selectedExtras.includes('child-seat') ? childSeatCount : 0,
        specialRequests,
        childSeats: selectedExtras.includes('child-seat') ? childSeatCount : childSeats,
        meetAndGreet: true,
        flightTracking: true,
        status: 'pending',
        paymentStatus: 'pending'
      });

      setBookingReference(booking.bookingReference);
      setCompletedBooking(booking);
      setBookingComplete(true);
      setBookingState('success');

      try {
        await sendBookingConfirmation(booking);
      } catch (confirmError) {
        console.error('Error sending confirmations:', confirmError);
      }

      toast.success('Booking Confirmed!', {
        description: `Your booking reference is ${booking.bookingReference}`
      });
    } catch (error: any) {
      console.error('Booking error:', error);
      console.error('Error details:', {
        code: error?.code,
        message: error?.message,
        stack: error?.stack
      });
      setBookingState('error');

      // Provide more specific error messages
      let errorMessage = 'Please try again or contact support.';
      if (error?.code === 'permission-denied') {
        errorMessage = 'Permission denied. Please refresh and try again.';
      } else if (error?.code === 'unavailable') {
        errorMessage = 'Service temporarily unavailable. Please try again in a moment.';
      } else if (error?.message) {
        errorMessage = error.message;
      }

      toast.error('Booking Failed', {
        description: errorMessage
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[400px] flex items-center justify-center">
        <Loader2 className="w-10 h-10 text-sky-600 animate-spin" />
      </div>
    );
  }

  return (
    <div className={`${embedded ? '' : 'min-h-screen'} ${className}`}>
      <div className={`${embedded ? '' : 'max-w-7xl mx-auto px-4 py-8'}`}>
        {/* Progress Steps */}
        {!bookingComplete && (
          <div className="flex justify-center gap-2 md:gap-4 mb-8 relative pb-4">
            <div className="absolute top-5 left-1/4 right-1/4 h-0.5 bg-slate-200 -z-0" />
            {BOOKING_STEPS.map((stepInfo) => {
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
                        ? 'bg-sky-600 border-sky-600 text-white'
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
          <div className="bg-white rounded-3xl p-6 md:p-8 shadow-xl" style={{ boxShadow: '0 25px 60px rgba(0, 0, 0, 0.08)' }}>
            {/* Step 1: Route Selection */}
            {step === 1 && !bookingComplete && (
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-6"
              >
                <div className="mb-6">
                  <h2 className="text-2xl md:text-3xl font-bold text-sky-800" style={{ fontFamily: '"Playfair Display", serif' }}>
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
                          ? 'bg-sky-600 text-white shadow-lg'
                          : 'bg-sky-50 text-sky-800 hover:bg-sky-100 border-2 border-sky-100'
                      }`}
                      style={transferType === value ? { boxShadow: '0 10px 30px rgba(2, 132, 199, 0.25)' } : {}}
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
                      <Plane className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-sky-600" />
                      <Input
                        value={airportSearch}
                        onChange={(e) => {
                          setAirportSearch(e.target.value);
                          setShowAirportResults(true);
                          if (!e.target.value) setSelectedAirport(null);
                        }}
                        onFocus={() => setShowAirportResults(true)}
                        placeholder="Search airports..."
                        className="pl-10 py-3 h-14 bg-white border-2 border-sky-200 focus:border-sky-600 focus:ring-2 focus:ring-sky-100 rounded-xl text-slate-800 placeholder:text-slate-400 font-medium"
                      />
                      {selectedAirport && (
                        <button onClick={() => { setSelectedAirport(null); setAirportSearch(''); }} className="absolute right-3 top-1/2 -translate-y-1/2">
                          <X className="w-4 h-4 text-slate-400 hover:text-slate-600" />
                        </button>
                      )}
                    </div>
                    {showAirportResults && airportResults.length > 0 && (
                      <div className="absolute z-50 w-full mt-2 bg-white rounded-xl shadow-2xl border border-sky-100 max-h-80 overflow-y-auto">
                        {airportResults.map((airport) => (
                          <button
                            key={airport.code}
                            onClick={() => handleAirportSelect(airport)}
                            className="w-full px-4 py-3 text-left hover:bg-sky-50 flex items-start gap-3 border-b border-slate-50 last:border-0 transition-colors"
                          >
                            <div className="w-12 h-8 bg-sky-100 rounded flex items-center justify-center text-sky-700 font-bold text-sm">
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

                  {/* Destination Search with Google Places */}
                  <div ref={destinationInputRef} className="relative">
                    <Label className="text-sm font-semibold text-slate-600 mb-2 block">
                      {transferType === 'departure' ? 'Pickup Location' : 'Drop-off Location'}
                    </Label>
                    <div className="relative">
                      <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-amber-500 z-10" />

                      {/* Google Places Autocomplete */}
                      {isGooglePlacesReady ? (
                        <Autocomplete
                          onLoad={onDestinationAutocompleteLoad}
                          onPlaceChanged={onDestinationPlaceChanged}
                          options={{
                            componentRestrictions: { country: 'lk' },
                            types: ['establishment', 'geocode'],
                            fields: ['place_id', 'geometry', 'name', 'formatted_address', 'vicinity'],
                          }}
                        >
                          <input
                            type="text"
                            value={destinationSearch}
                            onChange={(e) => {
                              setDestinationSearch(e.target.value);
                              setShowDestinationResults(true);
                              if (!e.target.value) {
                                setSelectedDestination(null);
                                setSelectedHotel(null);
                                setPlacesDestination(null);
                              }
                            }}
                            onFocus={() => setShowDestinationResults(true)}
                            placeholder="Search hotel, address, or place..."
                            className="w-full pl-10 pr-10 py-3 h-14 bg-white border-2 border-sky-200 focus:border-sky-600 focus:ring-2 focus:ring-sky-100 rounded-xl text-slate-800 placeholder:text-slate-400 font-medium outline-none"
                          />
                        </Autocomplete>
                      ) : (
                        /* Fallback to static search when Google Places not ready */
                        <Input
                          value={destinationSearch}
                          onChange={(e) => {
                            setDestinationSearch(e.target.value);
                            setShowDestinationResults(true);
                            if (!e.target.value) setSelectedDestination(null);
                          }}
                          onFocus={() => setShowDestinationResults(true)}
                          placeholder="Hotel, city, or destination..."
                          className="pl-10 py-3 h-14 bg-white border-2 border-sky-200 focus:border-sky-600 focus:ring-2 focus:ring-sky-100 rounded-xl text-slate-800 placeholder:text-slate-400 font-medium"
                        />
                      )}

                      {(selectedDestination || placesDestination) && (
                        <button onClick={() => { setSelectedDestination(null); setSelectedHotel(null); setPlacesDestination(null); setDestinationSearch(''); setDirections(null); }} className="absolute right-3 top-1/2 -translate-y-1/2 z-10">
                          <X className="w-4 h-4 text-slate-400 hover:text-slate-600" />
                        </button>
                      )}
                    </div>

                    {/* Google Places Status Indicator */}
                    {isGooglePlacesReady && (
                      <div className="flex items-center gap-1 mt-1">
                        <LocateFixed className="w-3 h-3 text-sky-500" />
                        <span className="text-xs text-sky-600">Google Places enabled - search any location</span>
                      </div>
                    )}

                    {/* Fallback: Static Destination Results Dropdown (when Google Places not ready) */}
                    {!isGooglePlacesReady && showDestinationResults && destinationResults.length > 0 && (
                      <div className="absolute z-50 w-full mt-2 bg-white rounded-xl shadow-2xl border border-sky-100 max-h-80 overflow-y-auto">
                        {destinationResults.map((dest, i) => (
                          <button
                            key={i}
                            onClick={() => handleDestinationSelect(dest)}
                            className="w-full px-4 py-3 text-left hover:bg-amber-50 flex items-center gap-3 border-b border-slate-50 last:border-0 transition-colors"
                          >
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                              dest.type === 'beach' ? 'bg-cyan-100 text-cyan-600' :
                              dest.type === 'city' ? 'bg-sky-100 text-sky-600' :
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
                    <Label htmlFor="pickup-date" className="text-sm font-semibold text-slate-600 mb-2 block">Pickup Date</Label>
                    <div className="relative">
                      <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-sky-600 pointer-events-none" />
                      <Input
                        id="pickup-date"
                        type="date"
                        value={pickupDate}
                        onChange={(e) => setPickupDate(e.target.value)}
                        min={getMinDate()}
                        aria-label="Select pickup date"
                        className="pl-10 py-3 h-14 bg-white border-2 border-sky-200 focus:border-sky-600 focus:ring-2 focus:ring-sky-100 rounded-xl text-slate-800 font-medium"
                      />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="pickup-time" className="text-sm font-semibold text-slate-600 mb-2 block">
                      {transferType === 'arrival' ? 'Flight Arrival Time' : 'Pickup Time'}
                    </Label>
                    <div className="relative">
                      <Clock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-sky-600 pointer-events-none" />
                      <Input
                        id="pickup-time"
                        type="time"
                        value={pickupTime}
                        onChange={(e) => setPickupTime(e.target.value)}
                        aria-label="Select pickup time"
                        className="pl-10 py-3 h-14 bg-white border-2 border-sky-200 focus:border-sky-600 focus:ring-2 focus:ring-sky-100 rounded-xl text-slate-800 font-medium"
                      />
                    </div>
                  </div>
                  {transferType === 'round-trip' && (
                    <>
                      <div>
                        <Label htmlFor="return-date" className="text-sm font-semibold text-slate-600 mb-2 block">Return Date</Label>
                        <Input id="return-date" type="date" value={returnDate} onChange={(e) => setReturnDate(e.target.value)} min={pickupDate || getMinDate()} aria-label="Select return date" className="py-3 h-14 bg-white border-2 border-sky-200 focus:border-sky-600 focus:ring-2 focus:ring-sky-100 rounded-xl text-slate-800 font-medium" />
                      </div>
                      <div>
                        <Label htmlFor="return-time" className="text-sm font-semibold text-slate-600 mb-2 block">Return Time</Label>
                        <Input id="return-time" type="time" value={returnTime} onChange={(e) => setReturnTime(e.target.value)} aria-label="Select return time" className="py-3 h-14 bg-white border-2 border-sky-200 focus:border-sky-600 focus:ring-2 focus:ring-sky-100 rounded-xl text-slate-800 font-medium" />
                      </div>
                    </>
                  )}
                </div>

                {/* Passengers & Luggage */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {[
                    { label: 'Adults', icon: Users, value: adults, setValue: setAdults, min: 1 },
                    { label: 'Children', icon: User, value: children, setValue: setChildren, min: 0 },
                    { label: 'Infants', icon: Baby, value: infants, setValue: setInfants, min: 0 },
                    { label: 'Luggage', icon: Luggage, value: luggage, setValue: setLuggage, min: 0 },
                  ].map(({ label, icon: Icon, value, setValue, min }) => (
                    <div key={label} className="bg-sky-50 rounded-xl p-3">
                      <Label className="text-sm font-semibold text-slate-600 mb-2 flex items-center gap-2">
                        <Icon className="w-4 h-4 text-sky-600" /> {label}
                      </Label>
                      <div className="flex items-center justify-between">
                        <button type="button" onClick={() => setValue((prev: number) => Math.max(min, prev - 1))} aria-label={`Decrease ${label.toLowerCase()}`} className="w-9 h-9 rounded-full bg-white border-2 border-sky-600 text-sky-700 font-bold hover:bg-sky-100 transition-colors">-</button>
                        <span className="text-lg font-bold text-slate-800" aria-live="polite">{value}</span>
                        <button type="button" onClick={() => setValue((prev: number) => prev + 1)} aria-label={`Increase ${label.toLowerCase()}`} className="w-9 h-9 rounded-full bg-white border-2 border-sky-600 text-sky-700 font-bold hover:bg-sky-100 transition-colors">+</button>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Route Preview */}
                {selectedAirport && (selectedHotel || selectedDestination) && calculatedDistance > 0 && (
                  <div className="bg-gradient-to-r from-sky-50 to-amber-50 rounded-xl p-4 border-2 border-sky-200">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-sky-600 rounded-full flex items-center justify-center">
                          <Plane className="w-6 h-6 text-white" />
                        </div>
                        <div>
                          <span className="font-bold text-lg text-sky-800">{selectedAirport.code}</span>
                          <p className="text-xs text-slate-500">{selectedAirport.city}</p>
                        </div>
                      </div>
                      <div className="flex-1 mx-4 relative">
                        <div className="border-t-2 border-dashed border-sky-400" />
                        <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-white px-3 py-1 rounded-full border border-sky-200">
                          <span className="text-sm font-semibold text-sky-700">{calculatedDistance} km</span>
                          <span className="text-xs text-slate-500 ml-1">• ~{calculatedDuration}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <div>
                          <span className="font-bold text-lg text-amber-600">{selectedHotel?.city || selectedDestination?.area}</span>
                          <p className="text-xs text-slate-500 text-right">{selectedHotel?.name || selectedDestination?.name}</p>
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
                    style={{ background: 'linear-gradient(135deg, #0369a1, #0ea5e9)', boxShadow: '0 12px 30px rgba(3, 105, 161, 0.25)' }}
                  >
                    Continue to Flight Details <ArrowRight className="w-5 h-5" />
                  </Button>
                </div>
              </motion.div>
            )}

            {/* Step 2: Flight Information */}
            {step === 2 && !bookingComplete && (
              <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
                <div className="mb-6">
                  <h2 className="text-2xl md:text-3xl font-bold text-sky-800" style={{ fontFamily: '"Playfair Display", serif' }}>Flight Information</h2>
                  <p className="text-slate-500 mt-1">Help us track your flight for seamless pickup</p>
                </div>
                <div className="space-y-4">
                  <div>
                    <Label className="text-sm font-semibold text-slate-600 mb-2 block">Flight Number</Label>
                    <div className="relative">
                      <Plane className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-sky-600" />
                      <Input value={flightSearchQuery || flightNumber} onChange={(e) => handleFlightSearch(e.target.value.toUpperCase())} placeholder="e.g., UL504, EK650, QR668" className="pl-10 py-3 h-14 bg-white border-2 border-sky-200 focus:border-sky-600 focus:ring-2 focus:ring-sky-100 rounded-xl text-slate-800 placeholder:text-slate-400 font-semibold uppercase" />
                      {flightSearchLoading && <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-sky-600 animate-spin" />}
                    </div>
                  </div>
                  {selectedFlight && (
                    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="bg-gradient-to-r from-sky-50 to-teal-50 border-2 border-sky-200 rounded-xl p-4">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 bg-sky-700 rounded-lg flex items-center justify-center"><Plane className="w-6 h-6 text-white" /></div>
                          <div>
                            <span className="text-xl font-bold text-sky-800">{selectedFlight.flightNumber}</span>
                            <p className="text-sm text-slate-600">{selectedFlight.airline}</p>
                          </div>
                        </div>
                        <Badge className={getStatusColor(selectedFlight.status)}>{getStatusText(selectedFlight.status, selectedFlight.delayMinutes)}</Badge>
                      </div>
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div><span className="text-slate-500">From</span><p className="font-semibold text-slate-800">{selectedFlight.origin} - {selectedFlight.originCity}</p></div>
                        <div><span className="text-slate-500">Arriving</span><p className="font-semibold text-slate-800">{formatArrivalTime(selectedFlight.estimatedArrival || selectedFlight.scheduledArrival)}{selectedFlight.terminal && ` • Terminal ${selectedFlight.terminal}`}</p></div>
                      </div>
                      <div className="mt-3 flex items-center gap-2 text-sky-700 text-sm"><Check className="w-4 h-4" /><span>Flight tracking enabled - we'll adjust for delays</span></div>
                    </motion.div>
                  )}
                  <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex gap-3">
                    <div className="w-10 h-10 bg-amber-100 rounded-full flex items-center justify-center flex-shrink-0"><Clock className="w-5 h-5 text-amber-600" /></div>
                    <div>
                      <h4 className="font-semibold text-slate-800">Flight Tracking Included</h4>
                      <p className="text-sm text-slate-600">We monitor your flight in real-time and adjust pickup time automatically for delays. No extra charge!</p>
                    </div>
                  </div>
                </div>
                <div className="pt-6 border-t border-slate-100 flex flex-col sm:flex-row gap-4">
                  <Button variant="outline" onClick={() => setStep(1)} className="flex-1 py-4 text-lg font-semibold rounded-xl border-2 border-slate-200"><ChevronLeft className="mr-2 w-5 h-5" /> Back</Button>
                  <Button onClick={() => setStep(3)} className="flex-1 py-4 text-lg font-semibold rounded-xl text-white" style={{ background: 'linear-gradient(135deg, #0369a1, #0ea5e9)', boxShadow: '0 12px 30px rgba(3, 105, 161, 0.25)' }}>{flightNumber ? 'Continue' : 'Skip'} <ArrowRight className="ml-2 w-5 h-5" /></Button>
                </div>
              </motion.div>
            )}

            {/* Step 3: Vehicle Selection */}
            {step === 3 && !bookingComplete && (
              <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
                <div className="mb-6">
                  <h2 className="text-2xl md:text-3xl font-bold text-sky-800" style={{ fontFamily: '"Playfair Display", serif' }}>Select Your Vehicle</h2>
                  <p className="text-slate-500 mt-1">{selectedAirport?.code} → {selectedHotel?.city || selectedDestination?.name}<span className="mx-2">•</span>{adults + children} passengers • {calculatedDistance} km</p>
                </div>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {suitableVehicles.map((vehicle) => {
                    const distance = calculatedDistance > 0 ? calculatedDistance : (selectedDestination ? ROUTE_DISTANCES[selectedDestination.area.toLowerCase().replace(/\s+/g, '-')] || 100 : 100);
                    const price = calculateDynamicPrice(distance, vehicle.id, pageContent?.vehiclePricing, transferType === 'round-trip');
                    return (
                      <div key={vehicle.id} onClick={() => setSelectedVehicle(vehicle)} className={`relative rounded-2xl border-2 overflow-hidden cursor-pointer transition-all ${selectedVehicle?.id === vehicle.id ? 'border-sky-600 bg-sky-50/50' : 'border-slate-200 hover:border-slate-300 hover:shadow-md'}`} style={selectedVehicle?.id === vehicle.id ? { boxShadow: '0 10px 30px rgba(3, 105, 161, 0.15)' } : {}}>
                        {selectedVehicle?.id === vehicle.id && <div className="absolute top-3 right-3 w-6 h-6 bg-sky-700 rounded-full flex items-center justify-center"><Check className="w-4 h-4 text-white" /></div>}
                        <div className="h-32 overflow-hidden"><img src={vehicle.image} alt={vehicle.name} className="w-full h-full object-cover" /></div>
                        <div className="p-4">
                          <h4 className="font-bold text-slate-800">{vehicle.name}</h4>
                          <p className="text-sm text-slate-500 mb-3">{vehicle.description}</p>
                          <div className="flex items-center gap-4 text-sm text-slate-600 mb-3">
                            <span className="flex items-center gap-1"><Users className="w-4 h-4" /> {vehicle.passengers}</span>
                            <span className="flex items-center gap-1"><Luggage className="w-4 h-4" /> {vehicle.luggage}</span>
                          </div>
                          <div className="flex items-baseline gap-1">
                            <span className="text-2xl font-bold text-sky-700">${price.price}</span>
                            <span className="text-slate-500 text-sm">{transferType === 'round-trip' ? 'round trip' : 'one way'}</span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
                <div className="pt-6 border-t border-slate-100 flex flex-col sm:flex-row gap-4">
                  <Button variant="outline" onClick={() => setStep(2)} className="flex-1 py-4 text-lg font-semibold rounded-xl border-2 border-slate-200"><ChevronLeft className="mr-2 w-5 h-5" /> Back</Button>
                  <Button onClick={() => setStep(4)} disabled={!canProceedToStep(4)} className="flex-1 py-4 text-lg font-semibold rounded-xl text-white" style={{ background: 'linear-gradient(135deg, #0369a1, #0ea5e9)', boxShadow: '0 12px 30px rgba(3, 105, 161, 0.25)' }}>Continue to Extras <ArrowRight className="ml-2 w-5 h-5" /></Button>
                </div>
              </motion.div>
            )}

            {/* Step 4: Extras Selection */}
            {step === 4 && !bookingComplete && (
              <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
                <div className="mb-6">
                  <h2 className="text-2xl md:text-3xl font-bold text-sky-800" style={{ fontFamily: '"Playfair Display", serif' }}>Enhance Your Journey</h2>
                  <p className="text-slate-500 mt-1">Add extras to make your transfer more comfortable</p>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {TRANSFER_EXTRAS.map((extra) => {
                    const Icon = extraIconMap[extra.icon] || Sparkles;
                    const isSelected = selectedExtras.includes(extra.id);
                    const isIncluded = extra.isIncluded;
                    return (
                      <div key={extra.id} onClick={() => !isIncluded && toggleExtra(extra.id)} className={`relative p-4 rounded-xl border-2 transition-all ${isIncluded ? 'bg-sky-50 border-sky-300 cursor-default' : isSelected ? 'bg-sky-50 border-sky-600 cursor-pointer' : 'bg-white border-slate-200 cursor-pointer hover:border-slate-300 hover:shadow-sm'}`} style={isSelected && !isIncluded ? { boxShadow: '0 10px 30px rgba(3, 105, 161, 0.12)' } : {}}>
                        {isIncluded && <div className="absolute -top-2 -right-2 bg-sky-600 text-white text-xs px-2 py-0.5 rounded-full">Included</div>}
                        {isSelected && !isIncluded && <div className="absolute top-2 right-2 w-5 h-5 bg-sky-700 rounded-full flex items-center justify-center"><Check className="w-3 h-3 text-white" /></div>}
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center mb-3 ${isIncluded ? 'bg-sky-100' : isSelected ? 'bg-sky-100' : 'bg-slate-100'}`}>
                          <Icon className={`w-5 h-5 ${isIncluded ? 'text-sky-700' : isSelected ? 'text-sky-700' : 'text-slate-500'}`} />
                        </div>
                        <h4 className="font-semibold text-sm text-slate-800 mb-1">{extra.name}</h4>
                        <p className="text-xs text-slate-500 mb-2 line-clamp-2">{extra.description}</p>
                        <p className={`font-bold ${isIncluded ? 'text-sky-700' : 'text-sky-700'}`}>{isIncluded ? 'Free' : extra.price === 0 ? 'Free' : `+$${extra.priceUSD}`}</p>
                      </div>
                    );
                  })}
                </div>
                {selectedExtras.includes('child-seat') && (
                  <div className="bg-sky-50 rounded-xl p-4 border border-sky-200">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-sky-100 rounded-full flex items-center justify-center"><Baby className="w-5 h-5 text-sky-700" /></div>
                        <div><h4 className="font-semibold text-slate-800">Child Seats</h4><p className="text-sm text-slate-500">$5 per seat</p></div>
                      </div>
                      <div className="flex items-center gap-3">
                        <button type="button" onClick={() => setChildSeatCount(prev => Math.max(0, prev - 1))} className="w-10 h-10 rounded-full bg-white border-2 border-sky-600 flex items-center justify-center text-lg font-bold text-sky-700 hover:bg-sky-100">-</button>
                        <span className="text-xl font-bold w-8 text-center">{childSeatCount}</span>
                        <button type="button" onClick={() => setChildSeatCount(prev => prev + 1)} className="w-10 h-10 rounded-full bg-white border-2 border-sky-600 flex items-center justify-center text-lg font-bold text-sky-700 hover:bg-sky-100">+</button>
                      </div>
                    </div>
                  </div>
                )}
                <div>
                  <Label className="text-sm font-semibold text-slate-600 mb-2 block">Special Requests (Optional)</Label>
                  <Textarea value={specialRequests} onChange={(e) => setSpecialRequests(e.target.value)} placeholder="Any special requirements? e.g., wheelchair assistance, extra luggage space..." className="min-h-[100px] !bg-white !text-slate-800 border-2 border-sky-200 focus:border-sky-600 rounded-xl placeholder:!text-slate-400" />
                </div>
                <div className="pt-6 border-t border-slate-100 flex flex-col sm:flex-row gap-4">
                  <Button variant="outline" onClick={() => setStep(3)} className="flex-1 py-4 text-lg font-semibold rounded-xl border-2 border-slate-200"><ChevronLeft className="mr-2 w-5 h-5" /> Back</Button>
                  <Button onClick={() => setStep(5)} className="flex-1 py-4 text-lg font-semibold rounded-xl text-white" style={{ background: 'linear-gradient(135deg, #0369a1, #0ea5e9)', boxShadow: '0 12px 30px rgba(3, 105, 161, 0.25)' }}>Continue <ArrowRight className="ml-2 w-5 h-5" /></Button>
                </div>
              </motion.div>
            )}

            {/* Step 5: Customer Details */}
            {step === 5 && !bookingComplete && (
              <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
                <div className="mb-6">
                  <h2 className="text-2xl md:text-3xl font-bold text-sky-800" style={{ fontFamily: '"Playfair Display", serif' }}>Your Details</h2>
                  <p className="text-slate-500 mt-1">We'll send confirmation and driver details to you</p>
                </div>
                <div className="grid md:grid-cols-2 gap-4">
                  <div><Label className="text-sm font-semibold text-slate-600 mb-2 block">First Name *</Label><Input value={firstName} onChange={(e) => setFirstName(e.target.value)} placeholder="John" className="h-14 !bg-white !text-slate-800 border-2 border-sky-200 focus:border-sky-600 rounded-xl placeholder:!text-slate-400" /></div>
                  <div><Label className="text-sm font-semibold text-slate-600 mb-2 block">Last Name *</Label><Input value={lastName} onChange={(e) => setLastName(e.target.value)} placeholder="Smith" className="h-14 !bg-white !text-slate-800 border-2 border-sky-200 focus:border-sky-600 rounded-xl placeholder:!text-slate-400" /></div>
                </div>
                <div className="grid md:grid-cols-2 gap-4">
                  <div><Label className="text-sm font-semibold text-slate-600 mb-2 block">Email *</Label><Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="john@example.com" className="h-14 !bg-white !text-slate-800 border-2 border-sky-200 focus:border-sky-600 rounded-xl placeholder:!text-slate-400" /></div>
                  <div><Label className="text-sm font-semibold text-slate-600 mb-2 block">WhatsApp Number *</Label><Input value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="+44 123 456 7890" className="h-14 !bg-white !text-slate-800 border-2 border-sky-200 focus:border-sky-600 rounded-xl placeholder:!text-slate-400" /></div>
                </div>
                <div className="grid md:grid-cols-2 gap-4">
                  <div><Label className="text-sm font-semibold text-slate-600 mb-2 block">Country *</Label><Input value={country} onChange={(e) => setCountry(e.target.value)} placeholder="United Kingdom" className="h-14 !bg-white !text-slate-800 border-2 border-sky-200 focus:border-sky-600 rounded-xl placeholder:!text-slate-400" /></div>
                  <div><Label className="text-sm font-semibold text-slate-600 mb-2 block">Flight Number</Label><Input value={flightNumber} onChange={(e) => setFlightNumber(e.target.value)} placeholder="UL504" className="h-14 !bg-white !text-slate-800 border-2 border-sky-200 focus:border-sky-600 rounded-xl placeholder:!text-slate-400" /></div>
                </div>
                <div className="pt-6 border-t border-slate-100 flex flex-col sm:flex-row gap-4">
                  <Button variant="outline" onClick={() => setStep(4)} className="flex-1 py-4 text-lg font-semibold rounded-xl border-2 border-slate-200"><ChevronLeft className="mr-2 w-5 h-5" /> Back</Button>
                  <Button onClick={() => setStep(6)} disabled={!canProceedToStep(6)} className="flex-1 py-4 text-lg font-semibold rounded-xl text-white" style={{ background: 'linear-gradient(135deg, #0369a1, #0ea5e9)', boxShadow: '0 12px 30px rgba(3, 105, 161, 0.25)' }}>Continue to Payment <ArrowRight className="ml-2 w-5 h-5" /></Button>
                </div>
              </motion.div>
            )}

            {/* Step 6: Payment */}
            {step === 6 && !bookingComplete && (
              <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
                <div className="mb-6">
                  <h2 className="text-2xl md:text-3xl font-bold text-sky-800" style={{ fontFamily: '"Playfair Display", serif' }}>Review & Pay</h2>
                  <p className="text-slate-500 mt-1">Review your journey details and complete payment</p>
                </div>

                {/* Route Map Preview */}
                {googleMapsLoaded && apiKey && selectedAirport && (selectedHotel || placesDestination) && (
                  <div className="rounded-2xl overflow-hidden border-2 border-sky-100 shadow-lg">
                    <div className="h-[200px] relative">
                      <GoogleMap
                        mapContainerStyle={{ width: '100%', height: '100%' }}
                        center={{
                          lat: (selectedAirport.code === 'CMB' ? CMB_AIRPORT_COORDS.lat : JAF_AIRPORT_COORDS.lat),
                          lng: (selectedAirport.code === 'CMB' ? CMB_AIRPORT_COORDS.lng : JAF_AIRPORT_COORDS.lng)
                        }}
                        zoom={9}
                        options={{
                          disableDefaultUI: true,
                          zoomControl: false,
                          mapTypeControl: false,
                          streetViewControl: false,
                          fullscreenControl: false,
                        }}
                      >
                        {/* Airport Marker */}
                        <Marker
                          position={{
                            lat: selectedAirport.code === 'CMB' ? CMB_AIRPORT_COORDS.lat : JAF_AIRPORT_COORDS.lat,
                            lng: selectedAirport.code === 'CMB' ? CMB_AIRPORT_COORDS.lng : JAF_AIRPORT_COORDS.lng
                          }}
                          icon={{
                            url: 'https://maps.google.com/mapfiles/ms/icons/blue-dot.png',
                            scaledSize: new window.google.maps.Size(40, 40)
                          }}
                        />
                        {/* Destination Marker */}
                        {(selectedHotel?.coordinates || placesDestination?.coordinates) && (
                          <Marker
                            position={{
                              lat: selectedHotel?.coordinates?.lat || placesDestination?.coordinates?.lat || 0,
                              lng: selectedHotel?.coordinates?.lng || placesDestination?.coordinates?.lng || 0
                            }}
                            icon={{
                              url: 'https://maps.google.com/mapfiles/ms/icons/red-dot.png',
                              scaledSize: new window.google.maps.Size(40, 40)
                            }}
                          />
                        )}
                        {directions && <DirectionsRenderer directions={directions} options={{ suppressMarkers: true, polylineOptions: { strokeColor: '#0369a1', strokeWeight: 4 } }} />}
                      </GoogleMap>
                      <div className="absolute bottom-2 left-2 bg-white/90 rounded-lg px-3 py-1.5 text-sm font-medium text-sky-700 shadow">
                        <Navigation className="w-4 h-4 inline mr-1" /> {calculatedDistance} km • {calculatedDuration}
                      </div>
                    </div>
                  </div>
                )}

                {/* Journey Summary */}
                <div className="bg-gradient-to-br from-sky-50 to-white rounded-2xl border-2 border-sky-100 overflow-hidden p-4">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
                    <div className="bg-white rounded-xl p-3 border border-sky-100 text-center"><Plane className="w-5 h-5 text-sky-600 mx-auto mb-1" /><p className="text-xs text-slate-500">From</p><p className="font-bold text-slate-800 text-sm">{selectedAirport?.code || 'CMB'}</p></div>
                    <div className="bg-white rounded-xl p-3 border border-sky-100 text-center"><MapPin className="w-5 h-5 text-sky-600 mx-auto mb-1" /><p className="text-xs text-slate-500">To</p><p className="font-bold text-slate-800 text-sm truncate">{selectedHotel?.name || selectedDestination?.name || 'Destination'}</p></div>
                    <div className="bg-white rounded-xl p-3 border border-sky-100 text-center"><Milestone className="w-5 h-5 text-sky-600 mx-auto mb-1" /><p className="text-xs text-slate-500">Distance</p><p className="font-bold text-sky-700 text-sm">{calculatedDistance} km</p></div>
                    <div className="bg-white rounded-xl p-3 border border-sky-100 text-center"><Clock className="w-5 h-5 text-sky-600 mx-auto mb-1" /><p className="text-xs text-slate-500">Duration</p><p className="font-bold text-sky-700 text-sm">{calculatedDuration || '~2h'}</p></div>
                  </div>
                  <div className="grid md:grid-cols-2 gap-3">
                    <div className="flex items-center gap-3 bg-white rounded-xl p-3 border border-slate-100"><Calendar className="w-5 h-5 text-sky-600" /><div><p className="text-xs text-slate-500">Pickup Date & Time</p><p className="font-semibold text-slate-800">{pickupDate} at {pickupTime}</p></div></div>
                    <div className="flex items-center gap-3 bg-white rounded-xl p-3 border border-slate-100"><Car className="w-5 h-5 text-sky-600" /><div><p className="text-xs text-slate-500">Vehicle</p><p className="font-semibold text-slate-800">{selectedVehicle?.name || 'Standard Sedan'}</p></div></div>
                  </div>
                  {/* Extras Summary */}
                  {extrasTotal > 0 && (
                    <div className="mt-3 bg-amber-50 rounded-xl p-3 border border-amber-200">
                      <p className="text-xs font-semibold text-amber-700 mb-2 flex items-center gap-1"><Sparkles className="w-3 h-3" /> Selected Extras (+${extrasTotal})</p>
                      <div className="flex flex-wrap gap-2">
                        {selectedExtras.filter(id => id !== 'meet-greet').map(extraId => {
                          const extra = TRANSFER_EXTRAS.find(e => e.id === extraId);
                          if (!extra || (extraId === 'child-seat' && childSeatCount === 0)) return null;
                          return (
                            <span key={extraId} className="text-xs bg-amber-100 text-amber-800 px-2 py-1 rounded-full">
                              {extra.name}{extraId === 'child-seat' && childSeatCount > 0 ? ` ×${childSeatCount}` : ''}
                            </span>
                          );
                        })}
                      </div>
                    </div>
                  )}
                  {/* Price Summary */}
                  <div className="mt-3 bg-sky-100 rounded-xl p-4 flex justify-between items-center">
                    <div>
                      <p className="text-sm text-sky-700">Transfer: ${calculatedPrice?.price || 0}</p>
                      {extrasTotal > 0 && <p className="text-sm text-amber-600">Extras: +${extrasTotal}</p>}
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-slate-500">Grand Total</p>
                      <p className="text-2xl font-bold text-sky-700">${grandTotal}</p>
                    </div>
                  </div>
                </div>
                {/* Payment Methods */}
                <div>
                  <h3 className="text-sm font-semibold text-slate-600 mb-3">Payment Method</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    {[{ id: 'card', label: 'Credit/Debit', sublabel: 'Visa • MasterCard • AmEx', icon: CreditCard }, { id: 'paypal', label: 'PayPal', sublabel: 'Fast & secure', icon: Wallet }, { id: 'cash', label: 'Cash to Driver', sublabel: 'Pay on arrival', icon: DollarSign }].map(({ id, label, sublabel, icon: Icon }) => (
                      <button key={id} onClick={() => setPaymentMethod(id as any)} className={`p-4 rounded-xl border-2 text-left transition-all ${paymentMethod === id ? 'border-sky-600 bg-sky-50' : 'border-slate-200 hover:border-slate-300'}`} style={paymentMethod === id ? { boxShadow: '0 10px 30px rgba(3, 105, 161, 0.12)' } : {}}>
                        <div className="flex items-center gap-3">
                          <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${paymentMethod === id ? 'bg-sky-100' : 'bg-slate-100'}`}><Icon className={`w-5 h-5 ${paymentMethod === id ? 'text-sky-700' : 'text-slate-600'}`} /></div>
                          <div><p className="font-semibold text-slate-800">{label}</p><p className="text-xs text-slate-500">{sublabel}</p></div>
                          {paymentMethod === id && <Check className="w-5 h-5 text-sky-700 ml-auto" />}
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
                {/* Terms */}
                <div className="pt-4">
                  <label className="flex items-start gap-3 cursor-pointer">
                    <input type="checkbox" checked={agreedToTerms} onChange={(e) => setAgreedToTerms(e.target.checked)} className="mt-1 w-5 h-5 text-sky-600 rounded border-slate-300 focus:ring-sky-500" />
                    <span className="text-sm text-slate-600">I accept Recharge Travels' <a href="#" className="text-sky-700 hover:underline">Terms & Conditions</a> and <a href="#" className="text-sky-700 hover:underline">Cancellation Policy</a>.</span>
                  </label>
                  <div className="mt-4 bg-sky-50 rounded-xl p-4 flex gap-3">
                    <Check className="w-5 h-5 text-sky-700 flex-shrink-0 mt-0.5" />
                    <div><p className="font-semibold text-slate-800">Free cancellation up to 24h</p><p className="text-sm text-slate-600">Full refund if you cancel 24 hours before pickup. After that, charges may apply.</p></div>
                  </div>
                </div>
                {/* Form Actions */}
                <div className="pt-6 border-t border-slate-100 flex flex-col sm:flex-row gap-4">
                  <Button variant="outline" onClick={() => setStep(5)} className="flex-1 py-4 text-lg font-semibold rounded-xl border-2 border-slate-200"><ChevronLeft className="mr-2 w-5 h-5" /> Back</Button>
                  <Button onClick={handleSubmitBooking} disabled={!paymentMethod || !agreedToTerms || isSubmitting} className="flex-1 py-4 text-lg font-semibold rounded-xl text-white" style={{ background: 'linear-gradient(135deg, #0369a1, #0ea5e9)', boxShadow: '0 12px 30px rgba(3, 105, 161, 0.25)' }}>
                    {isSubmitting ? <><Loader2 className="mr-2 w-5 h-5 animate-spin" />Processing...</> : <>{paymentMethod === 'cash' ? 'Confirm Booking' : `Pay $${grandTotal || 0}`} <Check className="ml-2 w-5 h-5" /></>}
                  </Button>
                </div>
              </motion.div>
            )}

            {/* Booking Success - PDF Style Confirmation */}
            {bookingComplete && completedBooking && (
              <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="py-4">
                {/* Print Styles */}
                <style>{`
                  @media print {
                    body * { visibility: hidden; }
                    .print-receipt, .print-receipt * { visibility: visible !important; }
                    .print-receipt {
                      position: absolute;
                      left: 0;
                      top: 0;
                      width: 100%;
                      padding: 0;
                      margin: 0;
                      box-shadow: none !important;
                      border: none !important;
                    }
                    .no-print { display: none !important; }
                    .print-header {
                      background: linear-gradient(to right, #0369a1, #0284c7, #059669) !important;
                      -webkit-print-color-adjust: exact !important;
                      print-color-adjust: exact !important;
                    }
                    .print-bg {
                      -webkit-print-color-adjust: exact !important;
                      print-color-adjust: exact !important;
                    }
                    @page {
                      margin: 10mm;
                      size: A4;
                    }
                  }
                `}</style>
                {/* PDF-Style Receipt Card */}
                <div className="print-receipt bg-white rounded-2xl shadow-2xl overflow-hidden border border-slate-200" style={{ boxShadow: '0 25px 50px rgba(0, 0, 0, 0.15)' }}>
                  {/* Header with Logo */}
                  <div className="print-header bg-gradient-to-r from-sky-700 via-sky-600 to-emerald-600 p-6 text-white">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-16 h-16 bg-white rounded-xl flex items-center justify-center shadow-lg p-1">
                          <img src="/logo-v2.png" alt="Recharge Travels" className="w-full h-full object-contain" />
                        </div>
                        <div>
                          <h1 className="text-2xl font-bold tracking-wide">RECHARGE TRAVELS</h1>
                          <p className="text-sky-100 text-sm">Premium Airport Transfer Services</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sky-100 text-xs uppercase tracking-wider">Booking Confirmation</p>
                        <p className="text-2xl font-bold">{bookingReference}</p>
                      </div>
                    </div>
                  </div>

                  {/* Success Badge */}
                  <div className="print-bg bg-emerald-50 border-b border-emerald-100 px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="print-bg w-10 h-10 bg-emerald-500 rounded-full flex items-center justify-center">
                        <Check className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <p className="font-bold text-emerald-800">Booking Confirmed!</p>
                        <p className="text-sm text-emerald-600">Your airport transfer has been successfully booked.</p>
                      </div>
                    </div>
                  </div>

                  {/* Journey Details */}
                  <div className="p-6 border-b border-slate-100">
                    <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4">Journey Details</h3>
                    <div className="print-bg bg-gradient-to-r from-sky-50 via-white to-amber-50 rounded-xl p-5 border border-sky-100">
                      <div className="flex items-center justify-between">
                        <div className="text-center">
                          <div className="print-bg w-12 h-12 bg-sky-600 rounded-full flex items-center justify-center mx-auto mb-2">
                            <Plane className="w-6 h-6 text-white" />
                          </div>
                          <p className="text-2xl font-bold text-sky-700">{completedBooking.pickupAirport?.code || 'CMB'}</p>
                          <p className="text-xs text-slate-500">{completedBooking.pickupAirport?.name || 'Colombo Airport'}</p>
                        </div>
                        <div className="flex-1 px-4">
                          <div className="relative">
                            <div className="border-t-2 border-dashed border-slate-300"></div>
                            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white px-3">
                              <div className="flex items-center gap-2 text-amber-600">
                                <Car className="w-5 h-5" />
                                <span className="text-sm font-semibold">{completedBooking.pricing?.distance || calculatedDistance} km</span>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="text-center">
                          <div className="print-bg w-12 h-12 bg-amber-500 rounded-full flex items-center justify-center mx-auto mb-2">
                            <MapPin className="w-6 h-6 text-white" />
                          </div>
                          <p className="text-lg font-bold text-slate-800">{completedBooking.dropoffLocation?.name?.split(',')[0] || 'Destination'}</p>
                          <p className="text-xs text-slate-500">{completedBooking.dropoffLocation?.area || ''}</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Booking Information Grid */}
                  <div className="p-6 border-b border-slate-100">
                    <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4">Booking Information</h3>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div className="bg-slate-50 rounded-xl p-4">
                        <div className="flex items-center gap-2 mb-2">
                          <Calendar className="w-4 h-4 text-sky-600" />
                          <p className="text-xs text-slate-500 font-medium">Pickup Date</p>
                        </div>
                        <p className="font-bold text-slate-800">{completedBooking.pickupDate}</p>
                      </div>
                      <div className="bg-slate-50 rounded-xl p-4">
                        <div className="flex items-center gap-2 mb-2">
                          <Clock className="w-4 h-4 text-sky-600" />
                          <p className="text-xs text-slate-500 font-medium">Pickup Time</p>
                        </div>
                        <p className="font-bold text-slate-800">{completedBooking.pickupTime}</p>
                      </div>
                      <div className="bg-slate-50 rounded-xl p-4">
                        <div className="flex items-center gap-2 mb-2">
                          <Car className="w-4 h-4 text-sky-600" />
                          <p className="text-xs text-slate-500 font-medium">Vehicle</p>
                        </div>
                        <p className="font-bold text-slate-800">{completedBooking.vehicleName}</p>
                      </div>
                      <div className="bg-slate-50 rounded-xl p-4">
                        <div className="flex items-center gap-2 mb-2">
                          <Users className="w-4 h-4 text-sky-600" />
                          <p className="text-xs text-slate-500 font-medium">Passengers</p>
                        </div>
                        <p className="font-bold text-slate-800">{completedBooking.adults} Adults{completedBooking.children > 0 ? `, ${completedBooking.children} Children` : ''}</p>
                      </div>
                    </div>
                    {completedBooking.transferType === 'round-trip' && completedBooking.returnDate && (
                      <div className="mt-4 bg-amber-50 rounded-xl p-4 border border-amber-200">
                        <p className="text-xs font-bold text-amber-700 uppercase tracking-wider mb-2">Return Journey</p>
                        <p className="font-semibold text-slate-800">{completedBooking.returnDate} at {completedBooking.returnTime}</p>
                      </div>
                    )}
                  </div>

                  {/* Customer Details */}
                  <div className="p-6 border-b border-slate-100">
                    <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4">Customer Details</h3>
                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-sky-100 rounded-full flex items-center justify-center">
                          <User className="w-5 h-5 text-sky-600" />
                        </div>
                        <div>
                          <p className="text-xs text-slate-500">Full Name</p>
                          <p className="font-semibold text-slate-800">{completedBooking.customerInfo?.firstName} {completedBooking.customerInfo?.lastName}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-sky-100 rounded-full flex items-center justify-center">
                          <Mail className="w-5 h-5 text-sky-600" />
                        </div>
                        <div>
                          <p className="text-xs text-slate-500">Email</p>
                          <p className="font-semibold text-slate-800">{completedBooking.customerInfo?.email}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-sky-100 rounded-full flex items-center justify-center">
                          <Phone className="w-5 h-5 text-sky-600" />
                        </div>
                        <div>
                          <p className="text-xs text-slate-500">WhatsApp</p>
                          <p className="font-semibold text-slate-800">{completedBooking.customerInfo?.phone}</p>
                        </div>
                      </div>
                      {completedBooking.flightNumber && (
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-sky-100 rounded-full flex items-center justify-center">
                            <Plane className="w-5 h-5 text-sky-600" />
                          </div>
                          <div>
                            <p className="text-xs text-slate-500">Flight Number</p>
                            <p className="font-semibold text-slate-800">{completedBooking.flightNumber}</p>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Pricing Summary */}
                  <div className="p-6 border-b border-slate-100 bg-gradient-to-r from-sky-50 to-white">
                    <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4">Payment Summary</h3>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-slate-600">Transfer ({completedBooking.transferType === 'round-trip' ? 'Round Trip' : 'One Way'})</span>
                        <span className="font-semibold text-slate-800">${completedBooking.pricing?.basePrice || (completedBooking.pricing?.totalPrice - (completedBooking.pricing?.extrasPrice || 0))}</span>
                      </div>
                      {completedBooking.pricing?.extrasPrice > 0 && (
                        <div className="flex justify-between items-center">
                          <span className="text-slate-600">Extras & Add-ons</span>
                          <span className="font-semibold text-amber-600">+${completedBooking.pricing?.extrasPrice}</span>
                        </div>
                      )}
                      <div className="border-t-2 border-dashed border-slate-200 pt-3 mt-3">
                        <div className="flex justify-between items-center">
                          <span className="text-lg font-bold text-slate-800">Total Amount</span>
                          <span className="text-3xl font-bold text-sky-700">${completedBooking.pricing?.totalPrice || 0}</span>
                        </div>
                        <p className="text-xs text-slate-500 mt-1 text-right">Payment: {completedBooking.paymentMethod === 'cash' ? 'Cash to Driver' : completedBooking.paymentMethod === 'card' ? 'Credit/Debit Card' : 'PayPal'}</p>
                      </div>
                    </div>
                  </div>

                  {/* What's Included */}
                  <div className="p-6 border-b border-slate-100">
                    <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4">What's Included</h3>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                      {[
                        { icon: UserCheck, text: 'Meet & Greet' },
                        { icon: Plane, text: 'Flight Tracking' },
                        { icon: Clock, text: '60min Free Wait' },
                        { icon: Shield, text: 'Fully Insured' }
                      ].map(({ icon: Icon, text }, i) => (
                        <div key={i} className="flex items-center gap-2 text-sm text-slate-600">
                          <Icon className="w-4 h-4 text-emerald-500" />
                          <span>{text}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Contact Information */}
                  <div className="p-6 bg-slate-50">
                    <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4">Contact Us</h3>
                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center">
                          <MessageCircle className="w-5 h-5 text-white" />
                        </div>
                        <div>
                          <p className="text-xs text-slate-500">WhatsApp 24/7</p>
                          <a href="https://wa.me/94777721999" className="font-semibold text-green-600 hover:underline">+94 777 721 999</a>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-sky-500 rounded-full flex items-center justify-center">
                          <Phone className="w-5 h-5 text-white" />
                        </div>
                        <div>
                          <p className="text-xs text-slate-500">Hotline</p>
                          <a href="tel:+94777721999" className="font-semibold text-sky-600 hover:underline">+94 777 721 999</a>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-red-500 rounded-full flex items-center justify-center">
                          <Mail className="w-5 h-5 text-white" />
                        </div>
                        <div>
                          <p className="text-xs text-slate-500">Email</p>
                          <a href="mailto:info@rechargetravels.com" className="font-semibold text-red-600 hover:underline">info@rechargetravels.com</a>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-purple-500 rounded-full flex items-center justify-center">
                          <Globe className="w-5 h-5 text-white" />
                        </div>
                        <div>
                          <p className="text-xs text-slate-500">Website</p>
                          <a href="https://www.rechargetravels.com" target="_blank" className="font-semibold text-purple-600 hover:underline">www.rechargetravels.com</a>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Footer */}
                  <div className="print-bg bg-slate-800 text-white p-4 text-center">
                    <p className="text-sm">Thank you for choosing <strong>Recharge Travels</strong></p>
                    <p className="text-xs text-slate-400 mt-1">Sri Lanka's Premium Airport Transfer Service</p>
                  </div>
                </div>

                {/* Action Buttons - Hidden when printing */}
                <div className="no-print mt-6 space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <Button className="w-full py-4 text-white rounded-xl font-semibold" style={{ background: 'linear-gradient(135deg, #0369a1, #0ea5e9)' }} onClick={() => completedBooking && downloadBookingPDF(completedBooking)}>
                      <Download className="mr-2 w-5 h-5" /> Download PDF Receipt
                    </Button>
                    <Button className="w-full py-4 bg-green-500 hover:bg-green-600 text-white rounded-xl font-semibold" onClick={() => completedBooking && openWhatsAppConfirmation(completedBooking)}>
                      <MessageCircle className="mr-2 w-5 h-5" /> Send via WhatsApp
                    </Button>
                  </div>
                  {/* Print Button */}
                  <Button onClick={() => window.print()} variant="outline" className="w-full py-3 rounded-xl border-2 border-slate-300 text-slate-700">
                    <Printer className="mr-2 w-5 h-5" /> Print Confirmation
                  </Button>
                  <div className="p-4 bg-blue-50 rounded-xl border border-blue-100">
                    <p className="text-sm text-blue-700 flex items-center gap-2"><Mail className="w-4 h-4" />Confirmation email sent to <strong>{email}</strong></p>
                  </div>
                  <div className="text-center pt-4">
                    <Button onClick={() => { setStep(1); setBookingComplete(false); setBookingState('idle'); setCompletedBooking(null); setSelectedAirport(null); setSelectedDestination(null); setSelectedHotel(null); setPlacesDestination(null); setAirportSearch(''); setDestinationSearch(''); setSelectedVehicle(null); setFirstName(''); setLastName(''); setEmail(''); setPhone(''); setCountry(''); setSelectedExtras(['meet-greet']); setPaymentMethod(null); setAgreedToTerms(false); setDirections(null); setCalculatedDistance(0); }} variant="outline" className="rounded-xl border-2 border-slate-200 py-3 px-6">
                      <ArrowRight className="mr-2 w-4 h-4" /> Book Another Transfer
                    </Button>
                  </div>
                </div>
              </motion.div>
            )}
          </div>

          {/* Summary Sidebar */}
          {!bookingComplete && (
            <aside className="lg:sticky lg:top-24">
              <div className="bg-white rounded-3xl overflow-hidden shadow-xl" style={{ boxShadow: '0 25px 60px rgba(0, 0, 0, 0.12)' }}>
                {/* Logo & Airport Background Header */}
                <div className="relative h-56 overflow-hidden">
                  {/* Airport/Flight Background */}
                  <img src="https://images.unsplash.com/photo-1436491865332-7a61a109cc05?auto=format&fit=crop&w=900&q=80" alt="Airport Transfer" className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-b from-sky-900/80 via-sky-800/60 to-black/70" />

                  {/* Logo at Top */}
                  <div className="absolute top-4 left-0 right-0 flex justify-center">
                    <div className="bg-white/95 backdrop-blur-sm rounded-xl px-4 py-2 shadow-lg flex items-center gap-2">
                      <div className="w-8 h-8 bg-gradient-to-br from-sky-600 to-emerald-500 rounded-lg flex items-center justify-center">
                        <Plane className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <p className="text-xs font-bold text-sky-800 leading-tight">RECHARGE</p>
                        <p className="text-[10px] text-slate-600 leading-tight">TRAVELS</p>
                      </div>
                    </div>
                  </div>

                  {/* Title & Reviews */}
                  <div className="absolute bottom-4 left-5 right-5 text-white">
                    <div className="flex items-center gap-2 mb-1">
                      <div className="p-1.5 bg-amber-500 rounded-lg">
                        <Plane className="w-4 h-4 text-white" />
                      </div>
                      <p className="text-xl font-bold">Airport Transfer</p>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1">
                        {[...Array(5)].map((_, i) => <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />)}
                        <span className="text-sm ml-1 opacity-90">(127 reviews)</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="p-5 space-y-5">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-bold text-lg text-slate-800" style={{ fontFamily: '"Playfair Display", serif' }}>Journey Overview</h3>
                      <p className="text-sm text-slate-500">Hosted by Recharge Travels Concierge</p>
                    </div>
                    <div className="p-2 bg-sky-50 rounded-xl">
                      <Navigation className="w-5 h-5 text-sky-600" />
                    </div>
                  </div>
                  {selectedAirport && (selectedDestination || selectedHotel) && (
                    <div className="flex items-center gap-2 text-sm">
                      <span className="flex items-center gap-1 text-sky-700"><Plane className="w-4 h-4" /> {selectedAirport.code}</span>
                      <span className="text-slate-400">→</span>
                      <span className="flex items-center gap-1 text-amber-600"><MapPin className="w-4 h-4" /> {selectedHotel?.city || selectedDestination?.area}</span>
                    </div>
                  )}
                  <div className="bg-sky-50 rounded-2xl p-4">
                    {calculatedPrice ? (
                      <>
                        <div className="flex justify-between items-center mb-2"><span className="text-slate-600">Vehicle</span><span className="font-semibold">{selectedVehicle?.name || '-'}</span></div>
                        <div className="flex justify-between items-center mb-2"><span className="text-slate-600">Distance</span><span className="font-semibold">{calculatedDistance} km</span></div>
                        <div className="flex justify-between items-center mb-2"><span className="text-slate-600">Duration</span><span className="font-semibold">{calculatedDuration || '~2h'}</span></div>
                        <div className="flex justify-between items-center mb-2"><span className="text-slate-600">Transfer</span><span className="font-semibold">${calculatedPrice.price}</span></div>
                        {/* Extras breakdown */}
                        {extrasTotal > 0 && (
                          <div className="border-t border-sky-200 pt-2 mt-2 space-y-1">
                            <p className="text-xs font-semibold text-slate-500 uppercase mb-1">Extras</p>
                            {selectedExtras.filter(id => id !== 'meet-greet').map(extraId => {
                              const extra = TRANSFER_EXTRAS.find(e => e.id === extraId);
                              if (!extra || extra.priceUSD === 0) return null;
                              if (extraId === 'child-seat') {
                                return childSeatCount > 0 ? (
                                  <div key={extraId} className="flex justify-between items-center text-sm">
                                    <span className="text-slate-600">{extra.name} ×{childSeatCount}</span>
                                    <span className="font-medium text-amber-600">+${childSeatCount * 5}</span>
                                  </div>
                                ) : null;
                              }
                              return (
                                <div key={extraId} className="flex justify-between items-center text-sm">
                                  <span className="text-slate-600">{extra.name}</span>
                                  <span className="font-medium text-amber-600">+${extra.priceUSD}</span>
                                </div>
                              );
                            })}
                          </div>
                        )}
                        <div className="border-t border-sky-200 pt-3 mt-3">
                          <div className="flex justify-between items-center"><span className="text-lg font-bold text-slate-800">Total</span><span className="text-2xl font-bold text-sky-700">${grandTotal}</span></div>
                          <p className="text-xs text-slate-500 mt-1">{transferType === 'round-trip' ? 'Round trip (10% discount applied)' : 'One way'}{extrasTotal > 0 && ' + extras'}</p>
                        </div>
                      </>
                    ) : (
                      <p className="text-sm text-slate-500 text-center py-4">Select route and vehicle to see price</p>
                    )}
                  </div>
                  <div className="space-y-3">
                    {[{ icon: Check, text: 'Free cancellation up to 24h' }, { icon: Shield, text: 'Safe & insured drivers' }, { icon: Clock, text: '60 min free wait time' }, { icon: Plane, text: 'Flight tracking included' }].map(({ icon: Icon, text }, i) => (
                      <div key={i} className="flex items-center gap-3 text-sm text-slate-600"><Icon className="w-4 h-4 text-sky-600" /><span>{text}</span></div>
                    ))}
                  </div>
                  <div className="pt-4 border-t border-slate-100">
                    <p className="text-xs text-slate-500 text-center">Questions? <a href="https://wa.me/94777721999" target="_blank" className="text-sky-600 hover:underline">WhatsApp us</a></p>
                  </div>
                </div>
              </div>
            </aside>
          )}
        </div>
      </div>
    </div>
  );
};

export default AirportTransferBookingEngine;
