import React, { useState, useEffect, useMemo, useRef } from 'react';
import { Helmet } from 'react-helmet-async';
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
import { Link } from 'react-router-dom';

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

const relatedTransport = [
  { title: 'Transport Hub', href: '/transport' },
  { title: 'Private Tours', href: '/transport/private-tours' },
  { title: 'Group Transport', href: '/transport/group-transport' }
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
  const [completedBooking, setCompletedBooking] = useState<AirportTransferBooking | null>(null);

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

  // Google Maps state
  const [directions, setDirections] = useState<google.maps.DirectionsResult | null>(null);
  const [mapLoaded, setMapLoaded] = useState(false);

  // Google Maps API loader - use same ID as other components to avoid conflicts
  const apiKey = getEffectiveApiKey();
  const { isLoaded: googleMapsLoaded, loadError } = useJsApiLoader({
    id: 'google-map-script',  // Shared ID to prevent multiple loader instances
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

  // Parse URL parameters and pre-fill form (from homepage booking section)
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const pickup = urlParams.get('pickup');
    const dropoff = urlParams.get('dropoff');
    const date = urlParams.get('date');
    const time = urlParams.get('time');
    const passengers = urlParams.get('passengers');
    const type = urlParams.get('type');

    // Set transfer type
    if (type === 'arrival' || type === 'departure') {
      setTransferType(type);
    }

    // Set date and time
    if (date) setPickupDate(date);
    if (time) setPickupTime(time);
    if (passengers) setAdults(parseInt(passengers) || 2);

    // Try to match pickup to an airport
    if (pickup) {
      const matchedAirport = SRI_LANKA_AIRPORTS.find(
        a => a.name.toLowerCase().includes(pickup.toLowerCase()) ||
          a.code.toLowerCase() === pickup.toLowerCase()
      );
      if (matchedAirport) {
        setSelectedAirport(matchedAirport);
        setAirportSearch(matchedAirport.name);
      } else {
        // Try matching to a destination for departure transfers
        const matchedDest = SRI_LANKA_DESTINATIONS.find(
          d => d.name.toLowerCase().includes(pickup.toLowerCase())
        );
        if (matchedDest) {
          setSelectedDestination(matchedDest);
          setDestinationSearch(matchedDest.name);
        }
      }
    }

    // Try to match dropoff to destination or airport
    if (dropoff) {
      const matchedDest = SRI_LANKA_DESTINATIONS.find(
        d => d.name.toLowerCase().includes(dropoff.toLowerCase())
      );
      if (matchedDest) {
        setSelectedDestination(matchedDest);
        setDestinationSearch(matchedDest.name);
      } else {
        // Try matching to an airport for departure transfers
        const matchedAirport = SRI_LANKA_AIRPORTS.find(
          a => a.name.toLowerCase().includes(dropoff.toLowerCase()) ||
            a.code.toLowerCase() === dropoff.toLowerCase()
        );
        if (matchedAirport && type === 'departure') {
          setSelectedAirport(matchedAirport);
          setAirportSearch(matchedAirport.name);
        }
      }
    }

    // Clear URL params after processing (optional - keeps URL clean)
    if (pickup || dropoff || date || time) {
      window.history.replaceState({}, '', window.location.pathname);
    }
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

  // Calculate Google Maps directions when entering step 5 or 6 (pre-fetch for better UX)
  useEffect(() => {
    if ((step === 5 || step === 6) && googleMapsLoaded && selectedAirport && (selectedDestination || selectedHotel || placesDestination) && !directions) {
      const calculateDirections = async () => {
        try {
          const directionsService = new google.maps.DirectionsService();

          // Get airport coordinates
          const airportCoords = selectedAirport.code === 'CMB' ? CMB_AIRPORT_COORDS :
            selectedAirport.code === 'JAF' ? JAF_AIRPORT_COORDS :
              CMB_AIRPORT_COORDS;

          // Get destination coordinates (priority: Google Places > Hotel > Static destination)
          let destCoords = { lat: 7.2906, lng: 80.6337 }; // Default Kandy
          if (placesDestination) {
            // Google Places selected location
            destCoords = placesDestination.coordinates;
          } else if (selectedHotel) {
            destCoords = selectedHotel.coordinates;
          } else if (selectedDestination) {
            // Map destinations to approximate coordinates
            const destCoordinates: { [key: string]: { lat: number; lng: number } } = {
              'colombo': { lat: 6.9271, lng: 79.8612 },
              'negombo': { lat: 7.2008, lng: 79.8358 },
              'kandy': { lat: 7.2906, lng: 80.6337 },
              'galle': { lat: 6.0535, lng: 80.2210 },
              'bentota': { lat: 6.4280, lng: 79.9958 },
              'hikkaduwa': { lat: 6.1395, lng: 80.1037 },
              'mirissa': { lat: 5.9485, lng: 80.4718 },
              'tangalle': { lat: 6.0241, lng: 80.7968 },
              'ella': { lat: 6.8667, lng: 81.0466 },
              'nuwara eliya': { lat: 6.9497, lng: 80.7891 },
              'sigiriya': { lat: 7.9570, lng: 80.7603 },
              'dambulla': { lat: 7.8675, lng: 80.6517 },
              'polonnaruwa': { lat: 7.9403, lng: 81.0188 },
              'anuradhapura': { lat: 8.3114, lng: 80.4037 },
              'yala': { lat: 6.3728, lng: 81.5158 },
              'trincomalee': { lat: 8.5874, lng: 81.2152 },
              'jaffna': { lat: 9.6615, lng: 80.0255 },
              'arugam bay': { lat: 6.8406, lng: 81.8369 },
            };
            const destKey = selectedDestination.area.toLowerCase();
            destCoords = destCoordinates[destKey] || { lat: 7.2906, lng: 80.6337 };
          }

          // Determine origin and destination based on transfer type
          const origin = transferType === 'departure'
            ? new google.maps.LatLng(destCoords.lat, destCoords.lng)
            : new google.maps.LatLng(airportCoords.lat, airportCoords.lng);
          const destination = transferType === 'departure'
            ? new google.maps.LatLng(airportCoords.lat, airportCoords.lng)
            : new google.maps.LatLng(destCoords.lat, destCoords.lng);

          const result = await directionsService.route({
            origin,
            destination,
            travelMode: google.maps.TravelMode.DRIVING,
          });

          setDirections(result);
          setMapLoaded(true);
        } catch (error) {
          console.error('Error calculating directions:', error);
          setMapLoaded(true); // Still show map without directions
        }
      };

      calculateDirections();
    }
  }, [step, googleMapsLoaded, selectedAirport, selectedDestination, selectedHotel, placesDestination, directions, transferType]);

  // Airport search results
  const airportResults = useMemo(() => {
    return searchAirports(airportSearch);
  }, [airportSearch]);

  // Destination search results
  const destinationResults = useMemo(() => {
    return searchDestinations(destinationSearch);
  }, [destinationSearch]);

  // Calculate price - works with both static destinations and Google Places
  // Uses dynamic pricing from admin panel (Firebase) in USD
  const calculatedPrice = useMemo(() => {
    if (!selectedVehicle) return null;

    // Use calculatedDistance which is set from either:
    // - selectedHotel coordinates (Google Places)
    // - selectedDestination (static list)
    let distance = calculatedDistance;

    // Fallback to route distances for static destinations
    if (distance === 0 && selectedDestination) {
      const destKey = selectedDestination.area.toLowerCase().replace(/\s+/g, '-');
      distance = ROUTE_DISTANCES[destKey] || 100;
    }

    // Default minimum distance
    if (distance === 0) {
      distance = 30; // Default 30km if nothing selected
    }

    // Use dynamic pricing from admin panel (pageContent?.vehiclePricing) or defaults
    return calculateDynamicPrice(
      distance,
      selectedVehicle.id,
      pageContent?.vehiclePricing,
      transferType === 'round-trip'
    );
  }, [selectedDestination, selectedVehicle, transferType, calculatedDistance, pageContent?.vehiclePricing]);

  // Filtered vehicles by passenger count
  const suitableVehicles = useMemo(() => {
    const totalPassengers = adults + children;
    return VEHICLE_TYPES.filter(v => v.passengers >= totalPassengers);
  }, [adults, children]);

  // Hotel search results
  const hotelResults = useMemo(() => {
    return searchHotels(hotelSearchQuery);
  }, [hotelSearchQuery]);

  // Enhanced price calculation with extras (USD, dynamic pricing from admin panel)
  const enhancedPrice = useMemo((): PriceBreakdown | null => {
    if (!selectedVehicle || calculatedDistance === 0) return null;
    return calculateTotalWithExtrasUSD(
      calculatedDistance,
      selectedVehicle.id,
      selectedExtras,
      childSeatCount,
      transferType === 'round-trip',
      pageContent?.vehiclePricing,
      pageContent?.transferExtras
    );
  }, [selectedVehicle, calculatedDistance, selectedExtras, childSeatCount, transferType, pageContent?.vehiclePricing, pageContent?.transferExtras]);

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
        setSelectedDestination(null); // Clear static selection
        setDirections(null); // Reset directions to recalculate
      }
    }
  };

  // Get min date (today)
  const getMinDate = () => new Date().toISOString().split('T')[0];

  // Handle booking submission
  const handleSubmitBooking = async () => {
    const hasDestination = !!(selectedHotel || selectedDestination || placesDestination);

    // Validation
    if (!selectedAirport || !hasDestination || !selectedVehicle || !calculatedPrice) {
      toast.error('Missing Information', {
        description: 'Please complete all required fields.'
      });
      return;
    }

    if (!firstName || !lastName || !email || !phone || !country) {
      toast.error('Customer Details Required', {
        description: 'Please fill in all customer information.'
      });
      return;
    }

    if (!paymentMethod) {
      toast.error('Select Payment Method', {
        description: 'Please choose how you\'d like to pay.'
      });
      return;
    }

    if (!agreedToTerms) {
      toast.error('Accept Terms', {
        description: 'Please accept the terms and conditions to continue.'
      });
      return;
    }

    setIsSubmitting(true);
    setBookingState('processing');

    // Get destination info from either Google Places or static selection
    const destinationName = placesDestination?.name || selectedHotel?.name || selectedDestination?.name || 'Unknown';
    const destinationArea = placesDestination?.address || selectedHotel?.city || selectedDestination?.area || 'Sri Lanka';

    try {
      // If credit card payment is selected, simulate Stripe payment processing
      if (paymentMethod === 'card') {
        toast.info('Processing Payment...', {
          description: 'Please wait while we process your payment.'
        });

        // Simulate Stripe payment (replace with actual Stripe integration)
        await new Promise(resolve => setTimeout(resolve, 2000));

        // Mock payment success (90% success rate for demo)
        const paymentSuccess = Math.random() > 0.1;

        if (!paymentSuccess) {
          throw new Error('Payment declined. Please try a different card.');
        }

        toast.success('Payment Successful!', {
          description: 'Creating your booking...'
        });
      }

      // If PayPal is selected, simulate PayPal payment
      if (paymentMethod === 'paypal') {
        toast.info('Opening PayPal...', {
          description: 'Please complete payment in the PayPal window.'
        });

        await new Promise(resolve => setTimeout(resolve, 2000));

        toast.success('PayPal Payment Successful!', {
          description: 'Creating your booking...'
        });
      }

      // Create the booking with appropriate payment status
      const paymentStatus = paymentMethod === 'cash' ? 'pending' : 'paid';

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
          distance: calculatedDistance,
          extrasPrice: enhancedPrice?.extrasPrice || 0,
          totalPrice: enhancedPrice?.total || calculatedPrice.price,
          currency: calculatedPrice.currency
        },
        extras: selectedExtras.filter(id => id !== 'meet-greet'),
        childSeatCount: selectedExtras.includes('child-seat') ? childSeatCount : 0,
        specialRequests,
        childSeats: selectedExtras.includes('child-seat') ? childSeatCount : 0,
        meetAndGreet: true,
        flightTracking: true,
        status: 'pending',
        paymentStatus: paymentStatus,
        paymentMethod: paymentMethod
      });

      setBookingReference(booking.bookingReference);
      setCompletedBooking(booking);
      setBookingComplete(true);
      setBookingState('success');

      // Send confirmation emails and log for WhatsApp
      try {
        await sendBookingConfirmation(booking);
      } catch (confirmError) {
        console.error('Error sending confirmations:', confirmError);
      }

      // Show appropriate success message based on payment method
      if (paymentMethod === 'cash') {
        toast.success('Booking Confirmed!', {
          description: `Reference: ${booking.bookingReference}. Pay cash to driver on arrival.`
        });
      } else {
        toast.success('Booking & Payment Confirmed!', {
          description: `Reference: ${booking.bookingReference}. Confirmation sent to ${email}.`
        });
      }
    } catch (error: any) {
      console.error('Booking error:', error);
      setBookingState('error');

      // Show appropriate error message
      let errorMessage = 'Please try again or contact support.';
      if (error?.message?.includes('Payment')) {
        errorMessage = error.message;
      } else if (error?.code === 'permission-denied') {
        errorMessage = 'Permission denied. Please refresh and try again.';
      } else if (error?.code === 'unavailable') {
        errorMessage = 'Service temporarily unavailable. Please try again in a moment.';
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

      {/* Full-Width Hero Section */}
      <section className="relative min-h-[70vh] md:min-h-[80vh] overflow-hidden">
        {/* Background Slideshow */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentSlide}
            initial={{ opacity: 0, scale: 1.05 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.8 }}
            className="absolute inset-0"
          >
            <img
              src={pageContent?.heroSlides?.[currentSlide]?.image || 'https://images.unsplash.com/photo-1606567595334-d39972c85dfd?auto=format&fit=crop&q=80'}
              alt={pageContent?.heroSlides?.[currentSlide]?.title || 'Sri Lanka Airport Transfer'}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/70" />
          </motion.div>
        </AnimatePresence>

        {/* Hero Content */}
        <div className="relative z-10 h-full flex flex-col justify-center items-center text-center px-4 pt-24 pb-16">
          <motion.div
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="max-w-4xl mx-auto"
          >
            {/* Breadcrumb - Subtle */}
            <div className="flex items-center justify-center gap-2 text-white/70 text-sm mb-6">
              <Link to="/" className="hover:text-white transition">Home</Link>
              <ChevronRight className="w-4 h-4" />
              <Link to="/transport" className="hover:text-white transition">Transport</Link>
              <ChevronRight className="w-4 h-4" />
              <span className="text-white font-medium">Airport Transfers</span>
            </div>

            {/* Badge */}
            <span className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-600/90 backdrop-blur rounded-full text-white text-sm font-semibold mb-6">
              <Plane className="w-4 h-4" />
              Premium Sri Lanka Airport Transfers
            </span>

            {/* Main Title */}
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-6 leading-tight">
              {pageContent?.heroSlides?.[currentSlide]?.title || 'Seamless Airport Transfers'}
            </h1>

            {/* Subtitle */}
            <p className="text-xl md:text-2xl text-white/90 mb-8 max-w-2xl mx-auto">
              {pageContent?.heroSlides?.[currentSlide]?.subtitle || 'Start your Sri Lanka adventure with comfort and style'}
            </p>

            {/* Trust Stats Row */}
            <div className="flex flex-wrap justify-center gap-6 md:gap-10 mb-10">
              <div className="flex items-center gap-2 text-white">
                <Star className="w-5 h-5 text-yellow-400 fill-yellow-400" />
                <span className="font-bold">{trustIndicators?.rating || '4.9'}</span>
                <span className="text-white/70">Rating</span>
              </div>
              <div className="flex items-center gap-2 text-white">
                <Users className="w-5 h-5 text-emerald-400" />
                <span className="font-bold">{trustIndicators?.totalReviews || '2,847+'}</span>
                <span className="text-white/70">Transfers</span>
              </div>
              <div className="flex items-center gap-2 text-white">
                <Shield className="w-5 h-5 text-blue-400" />
                <span className="font-bold">100%</span>
                <span className="text-white/70">Safe</span>
              </div>
              <div className="flex items-center gap-2 text-white">
                <Headphones className="w-5 h-5 text-purple-400" />
                <span className="font-bold">24/7</span>
                <span className="text-white/70">Support</span>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-wrap justify-center gap-4">
              <Button
                size="lg"
                className="bg-emerald-600 hover:bg-emerald-700 text-white px-8 py-6 text-lg rounded-full shadow-lg hover:shadow-xl transition-all"
                onClick={() => document.getElementById('booking-form')?.scrollIntoView({ behavior: 'smooth' })}
              >
                Book Your Transfer
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-2 border-white text-white hover:bg-white hover:text-slate-900 px-8 py-6 text-lg rounded-full"
                onClick={() => window.open(`https://wa.me/94773401305?text=${encodeURIComponent('Hi! I need an airport transfer in Sri Lanka.')}`, '_blank')}
              >
                <Phone className="w-5 h-5 mr-2" />
                WhatsApp Us
              </Button>
            </div>
          </motion.div>

          {/* Slide Navigation */}
          {pageContent?.heroSlides && pageContent.heroSlides.length > 1 && (
            <>
              <button
                onClick={() => setCurrentSlide(prev => prev === 0 ? pageContent.heroSlides.length - 1 : prev - 1)}
                className="absolute left-4 md:left-8 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-white/30 transition-colors"
                aria-label="Previous slide"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>
              <button
                onClick={() => setCurrentSlide(prev => prev === pageContent.heroSlides.length - 1 ? 0 : prev + 1)}
                className="absolute right-4 md:right-8 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-white/30 transition-colors"
                aria-label="Next slide"
              >
                <ChevronRight className="w-6 h-6" />
              </button>

              {/* Slide Dots */}
              <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-2">
                {pageContent.heroSlides.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentSlide(index)}
                    className={`w-3 h-3 rounded-full transition-all ${index === currentSlide
                      ? 'bg-white w-8'
                      : 'bg-white/40 hover:bg-white/60'
                      }`}
                    aria-label={`Go to slide ${index + 1}`}
                  />
                ))}
              </div>
            </>
          )}
        </div>

        {/* Bottom Wave Decoration */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full">
            <path d="M0 120L60 110C120 100 240 80 360 70C480 60 600 60 720 65C840 70 960 80 1080 85C1200 90 1320 90 1380 90L1440 90V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0Z" fill="#f8fafb" />
          </svg>
        </div>
      </section>

      {/* Quick Transport Links */}
      <div className="bg-[#f8fafb] py-4 border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex flex-wrap items-center justify-center gap-3">
            <span className="text-sm text-slate-500 mr-2">More Transport:</span>
            {relatedTransport.map(link => (
              <Link
                key={link.href}
                to={link.href}
                className="inline-flex items-center gap-1 px-4 py-2 bg-white rounded-full border border-slate-200 text-sm font-medium text-slate-700 hover:border-emerald-400 hover:text-emerald-700 transition-all shadow-sm hover:shadow"
              >
                {link.title}
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Main Container */}
      <div
        id="booking-form"
        className="min-h-screen"
        style={{
          background: 'linear-gradient(180deg, #f8fafb 0%, #f1f5f9 100%)',
          fontFamily: '"DM Sans", -apple-system, BlinkMacSystemFont, sans-serif'
        }}
      >
        <div className="max-w-7xl mx-auto px-4 py-12">

          {/* Booking Form Section */}
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
                      className={`w-10 h-10 md:w-11 md:h-11 rounded-full flex items-center justify-center font-semibold text-sm border-3 transition-all ${isCompleted
                        ? 'bg-amber-400 border-amber-400 text-white cursor-pointer'
                        : isActive
                          ? 'bg-emerald-700 border-emerald-700 text-white'
                          : 'bg-white border-slate-200 text-slate-400'
                        }`}
                      style={{ borderWidth: '3px' }}
                    >
                      {isCompleted ? <Check className="w-5 h-5" /> : stepInfo.id}
                    </button>
                    <span className={`mt-2 text-xs font-semibold uppercase tracking-wider ${isActive || isCompleted ? 'text-slate-700' : 'text-slate-400'
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
                        className={`flex items-center gap-2 px-5 py-3 rounded-xl font-medium transition-all ${transferType === value
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
                          onKeyDown={(e) => {
                            if (e.key === 'Enter' && showAirportResults && airportResults.length > 0) {
                              e.preventDefault();
                              handleAirportSelect(airportResults[0]);
                            }
                          }}
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

                    {/* Destination Search with Google Places */}
                    <div ref={destinationInputRef} className="relative">
                      <Label className="text-sm font-semibold text-slate-600 mb-2 block">
                        {transferType === 'departure' ? 'Pickup Location' : 'Drop-off Location'}
                      </Label>
                      <div className="relative">
                        <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-amber-500 z-10" />

                        {/* Google Places Autocomplete */}
                        {googleMapsLoaded && apiKey && !isDemoMode() ? (
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
                              className="w-full pl-10 pr-10 py-3 h-14 bg-white border-2 border-emerald-200 focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100 rounded-xl text-slate-800 placeholder:text-slate-400 font-medium outline-none"
                            />
                          </Autocomplete>
                        ) : (
                          /* Fallback to static search when no API key */
                          <Input
                            value={destinationSearch}
                            onChange={(e) => {
                              setDestinationSearch(e.target.value);
                              setShowDestinationResults(true);
                              if (!e.target.value) setSelectedDestination(null);
                            }}
                            onKeyDown={(e) => {
                              if (e.key === 'Enter' && showDestinationResults && destinationResults.length > 0) {
                                e.preventDefault();
                                handleDestinationSelect(destinationResults[0]);
                              }
                            }}
                            onFocus={() => setShowDestinationResults(true)}
                            placeholder="Hotel, city, or destination..."
                            className="pl-10 py-3 h-14 bg-white border-2 border-emerald-200 focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100 rounded-xl text-slate-800 placeholder:text-slate-400 font-medium"
                          />
                        )}

                        {(selectedDestination || placesDestination) && (
                          <button
                            onClick={() => {
                              setSelectedDestination(null);
                              setSelectedHotel(null);
                              setPlacesDestination(null);
                              setDestinationSearch('');
                              setDirections(null);
                            }}
                            className="absolute right-3 top-1/2 -translate-y-1/2 z-10"
                          >
                            <X className="w-4 h-4 text-slate-400 hover:text-slate-600" />
                          </button>
                        )}
                      </div>

                      {/* Google Places Status Indicator */}
                      {googleMapsLoaded && apiKey && !isDemoMode() && (
                        <div className="flex items-center gap-1 mt-1">
                          <LocateFixed className="w-3 h-3 text-emerald-500" />
                          <span className="text-xs text-emerald-600">Google Places enabled</span>
                        </div>
                      )}

                      {/* Fallback: Static Destination Results Dropdown (when no Google API) */}
                      {(!googleMapsLoaded || !apiKey || isDemoMode()) && showDestinationResults && destinationResults.length > 0 && (
                        <div className="absolute z-50 w-full mt-2 bg-white rounded-xl shadow-2xl border border-emerald-100 max-h-80 overflow-y-auto">
                          {destinationResults.map((dest, i) => (
                            <button
                              key={i}
                              onClick={() => handleDestinationSelect(dest)}
                              className="w-full px-4 py-3 text-left hover:bg-amber-50 flex items-center gap-3 border-b border-slate-50 last:border-0 transition-colors"
                            >
                              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${dest.type === 'beach' ? 'bg-cyan-100 text-cyan-600' :
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
                      // Use calculatedDistance for Google Places, or fallback to route distances
                      const distance = calculatedDistance > 0 ? calculatedDistance :
                        (selectedDestination ? ROUTE_DISTANCES[selectedDestination.area.toLowerCase().replace(/\s+/g, '-')] || 100 : 100);
                      const price = calculateDynamicPrice(distance, vehicle.id, pageContent?.vehiclePricing, transferType === 'round-trip');

                      return (
                        <div
                          key={vehicle.id}
                          onClick={() => setSelectedVehicle(vehicle)}
                          className={`relative rounded-2xl border-2 overflow-hidden cursor-pointer transition-all ${selectedVehicle?.id === vehicle.id
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
                    {(pageContent?.transferExtras || TRANSFER_EXTRAS).map((extra) => {
                      const Icon = extraIconMap[extra.icon] || Sparkles;
                      const isSelected = selectedExtras.includes(extra.id);
                      const isIncluded = extra.isIncluded;

                      return (
                        <div
                          key={extra.id}
                          onClick={() => !isIncluded && toggleExtra(extra.id)}
                          className={`relative p-4 rounded-xl border-2 transition-all ${isIncluded
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

                          <div className={`w-10 h-10 rounded-full flex items-center justify-center mb-3 ${isIncluded ? 'bg-emerald-100' : isSelected ? 'bg-emerald-100' : 'bg-slate-100'
                            }`}>
                            <Icon className={`w-5 h-5 ${isIncluded ? 'text-emerald-700' : isSelected ? 'text-emerald-700' : 'text-slate-500'
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
                      Review & Pay
                    </h2>
                    <p className="text-slate-500 mt-1">Review your journey details and complete payment</p>
                  </div>

                  {/* Journey Map Preview */}
                  <div className="bg-gradient-to-br from-emerald-50 to-white rounded-2xl border-2 border-emerald-100 overflow-hidden">
                    <div className="p-4 border-b border-emerald-100 bg-emerald-50/50">
                      <h3 className="font-bold text-emerald-800 flex items-center gap-2">
                        <Route className="w-5 h-5" />
                        Your Journey Route
                      </h3>
                    </div>

                    {/* Route Info Cards */}
                    <div className="p-4">
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
                        <div className="bg-white rounded-xl p-3 border border-emerald-100 text-center">
                          <Plane className="w-5 h-5 text-emerald-600 mx-auto mb-1" />
                          <p className="text-xs text-slate-500">From</p>
                          <p className="font-bold text-slate-800 text-sm">{selectedAirport?.code || 'CMB'}</p>
                        </div>
                        <div className="bg-white rounded-xl p-3 border border-emerald-100 text-center">
                          <MapPin className="w-5 h-5 text-emerald-600 mx-auto mb-1" />
                          <p className="text-xs text-slate-500">To</p>
                          <p className="font-bold text-slate-800 text-sm truncate">
                            {selectedHotel?.name || selectedDestination?.name || 'Destination'}
                          </p>
                        </div>
                        <div className="bg-white rounded-xl p-3 border border-emerald-100 text-center">
                          <Milestone className="w-5 h-5 text-emerald-600 mx-auto mb-1" />
                          <p className="text-xs text-slate-500">Distance</p>
                          <p className="font-bold text-emerald-700 text-sm">{calculatedDistance} km</p>
                        </div>
                        <div className="bg-white rounded-xl p-3 border border-emerald-100 text-center">
                          <Clock className="w-5 h-5 text-emerald-600 mx-auto mb-1" />
                          <p className="text-xs text-slate-500">Duration</p>
                          <p className="font-bold text-emerald-700 text-sm">{calculatedDuration || '~2h'}</p>
                        </div>
                      </div>

                      {/* Google Map - Shows route when directions are loaded */}
                      <div className="rounded-xl overflow-hidden border border-emerald-200" style={{ height: '280px' }}>
                        {googleMapsLoaded && apiKey && !isDemoMode() && directions ? (
                          <GoogleMap
                            mapContainerStyle={{ width: '100%', height: '100%' }}
                            center={directions ? undefined : { lat: 7.8731, lng: 80.7718 }}
                            zoom={directions ? undefined : 8}
                            onLoad={(map) => {
                              // Auto-fit bounds when map loads with directions
                              if (directions && directions.routes[0]?.bounds) {
                                map.fitBounds(directions.routes[0].bounds);
                                // Add slight padding
                                setTimeout(() => {
                                  const currentZoom = map.getZoom();
                                  if (currentZoom && currentZoom > 12) {
                                    map.setZoom(12);
                                  }
                                }, 100);
                              }
                            }}
                            options={{
                              zoomControl: true,
                              streetViewControl: false,
                              mapTypeControl: false,
                              fullscreenControl: false,
                              styles: [
                                { featureType: 'poi', elementType: 'labels', stylers: [{ visibility: 'off' }] },
                                { featureType: 'transit', stylers: [{ visibility: 'off' }] },
                              ]
                            }}
                          >
                            {directions && (
                              <DirectionsRenderer
                                directions={directions}
                                options={{
                                  suppressMarkers: false,
                                  polylineOptions: {
                                    strokeColor: '#0d5c46',
                                    strokeOpacity: 0.9,
                                    strokeWeight: 5,
                                  },
                                  markerOptions: {
                                    zIndex: 100,
                                  },
                                  preserveViewport: false // Allow auto-fit to route
                                }}
                              />
                            )}
                          </GoogleMap>
                        ) : googleMapsLoaded && apiKey && !isDemoMode() && !directions ? (
                          /* Loading state while fetching directions */
                          <div className="w-full h-full bg-gradient-to-br from-emerald-100 to-emerald-50 flex flex-col items-center justify-center">
                            <div className="text-center">
                              <Loader2 className="w-10 h-10 text-emerald-600 animate-spin mx-auto mb-3" />
                              <p className="text-emerald-700 font-semibold">Calculating your route...</p>
                              <p className="text-sm text-emerald-600">
                                {selectedAirport?.code || 'CMB'} → {placesDestination?.name?.split(',')[0] || selectedHotel?.name?.split(' ')[0] || selectedDestination?.area || 'Destination'}
                              </p>
                            </div>
                          </div>
                        ) : (
                          /* Fallback Static Map Preview */
                          <div className="w-full h-full bg-gradient-to-br from-emerald-100 to-emerald-50 flex flex-col items-center justify-center relative">
                            <div className="absolute inset-0 opacity-10">
                              <svg viewBox="0 0 400 300" className="w-full h-full">
                                <path d="M50,250 Q150,100 200,150 T350,50" stroke="#0d5c46" strokeWidth="3" fill="none" strokeDasharray="8,4" />
                                <circle cx="50" cy="250" r="8" fill="#0d5c46" />
                                <circle cx="350" cy="50" r="8" fill="#f0b429" />
                              </svg>
                            </div>
                            <div className="relative z-10 text-center">
                              <div className="flex items-center justify-center gap-4 mb-4">
                                <div className="bg-emerald-600 text-white rounded-full p-3">
                                  <Plane className="w-6 h-6" />
                                </div>
                                <div className="flex flex-col items-center">
                                  <div className="w-24 h-0.5 bg-emerald-400 relative">
                                    <div className="absolute -top-1 left-1/2 transform -translate-x-1/2">
                                      <Car className="w-4 h-4 text-emerald-600" />
                                    </div>
                                  </div>
                                  <span className="text-xs text-emerald-600 mt-1">{calculatedDistance} km</span>
                                </div>
                                <div className="bg-amber-500 text-white rounded-full p-3">
                                  <MapPin className="w-6 h-6" />
                                </div>
                              </div>
                              <p className="text-emerald-700 font-semibold">
                                {selectedAirport?.code || 'CMB'} → {placesDestination?.name?.split(',')[0] || selectedHotel?.name?.split(' ')[0] || selectedDestination?.area || 'Destination'}
                              </p>
                              <p className="text-sm text-emerald-600">Estimated {calculatedDuration || '~2 hours'} drive</p>
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Journey Details */}
                      <div className="mt-4 grid md:grid-cols-2 gap-3">
                        <div className="flex items-center gap-3 bg-white rounded-xl p-3 border border-slate-100">
                          <Calendar className="w-5 h-5 text-emerald-600" />
                          <div>
                            <p className="text-xs text-slate-500">Pickup Date & Time</p>
                            <p className="font-semibold text-slate-800">{pickupDate} at {pickupTime}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3 bg-white rounded-xl p-3 border border-slate-100">
                          <Car className="w-5 h-5 text-emerald-600" />
                          <div>
                            <p className="text-xs text-slate-500">Vehicle</p>
                            <p className="font-semibold text-slate-800">{selectedVehicle?.name || 'Standard Sedan'}</p>
                          </div>
                        </div>
                      </div>
                    </div>
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
                          className={`p-4 rounded-xl border-2 text-left transition-all ${paymentMethod === id
                            ? 'border-emerald-600 bg-emerald-50'
                            : 'border-slate-200 hover:border-slate-300'
                            }`}
                          style={paymentMethod === id ? { boxShadow: '0 10px 30px rgba(13, 92, 70, 0.12)' } : {}}
                        >
                          <div className="flex items-center gap-3">
                            <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${paymentMethod === id ? 'bg-emerald-100' : 'bg-slate-100'
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
              {bookingComplete && completedBooking && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="py-6"
                >
                  {/* Success Header */}
                  <div className="text-center mb-8">
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
                    <p className="text-slate-600">Your airport transfer has been successfully booked.</p>
                  </div>

                  {/* Booking Reference */}
                  <div className="bg-emerald-50 rounded-2xl p-6 max-w-md mx-auto mb-8">
                    <p className="text-sm text-slate-600 mb-2">Your Booking Reference</p>
                    <p className="text-3xl font-bold text-emerald-700">{bookingReference}</p>
                  </div>

                  {/* Booking Summary Preview */}
                  <div className="bg-white rounded-2xl border border-slate-200 p-6 mb-8">
                    <h3 className="font-bold text-lg text-slate-800 mb-4 flex items-center gap-2">
                      <FileText className="w-5 h-5 text-emerald-600" /> Booking Summary
                    </h3>

                    {/* Route */}
                    <div className="bg-gradient-to-r from-emerald-50 to-amber-50 rounded-xl p-4 mb-4">
                      <div className="flex items-center justify-center gap-4 text-lg font-bold">
                        <span className="text-emerald-700">{completedBooking.pickupAirport?.code || 'CMB'}</span>
                        <span className="text-amber-500">{completedBooking.transferType === 'round-trip' ? '⇄' : '→'}</span>
                        <span className="text-emerald-700">{completedBooking.dropoffLocation?.name?.split(',')[0]}</span>
                      </div>
                    </div>

                    {/* Details Grid */}
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div className="bg-slate-50 rounded-lg p-3">
                        <p className="text-slate-500 text-xs mb-1">Date</p>
                        <p className="font-semibold text-slate-800">{completedBooking.pickupDate}</p>
                      </div>
                      <div className="bg-slate-50 rounded-lg p-3">
                        <p className="text-slate-500 text-xs mb-1">Time</p>
                        <p className="font-semibold text-slate-800">{completedBooking.pickupTime}</p>
                      </div>
                      <div className="bg-slate-50 rounded-lg p-3">
                        <p className="text-slate-500 text-xs mb-1">Vehicle</p>
                        <p className="font-semibold text-slate-800">{completedBooking.vehicleName}</p>
                      </div>
                      <div className="bg-slate-50 rounded-lg p-3">
                        <p className="text-slate-500 text-xs mb-1">Passengers</p>
                        <p className="font-semibold text-slate-800">{completedBooking.adults}A + {completedBooking.children}C</p>
                      </div>
                      <div className="bg-slate-50 rounded-lg p-3">
                        <p className="text-slate-500 text-xs mb-1">Distance</p>
                        <p className="font-semibold text-slate-800">{completedBooking.pricing?.distance || 0} km</p>
                      </div>
                      <div className="bg-emerald-100 rounded-lg p-3">
                        <p className="text-emerald-600 text-xs mb-1">Total</p>
                        <p className="font-bold text-emerald-700 text-lg">${completedBooking.pricing?.totalPrice || 0}</p>
                      </div>
                    </div>

                    {/* Passenger Info */}
                    <div className="mt-4 pt-4 border-t border-slate-100">
                      <p className="text-sm text-slate-600">
                        <strong>Passenger:</strong> {completedBooking.customerInfo?.firstName} {completedBooking.customerInfo?.lastName}
                      </p>
                      <p className="text-sm text-slate-600">
                        <strong>Email:</strong> {completedBooking.customerInfo?.email}
                      </p>
                      <p className="text-sm text-slate-600">
                        <strong>Phone:</strong> {completedBooking.customerInfo?.phone}
                      </p>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="space-y-4">
                    {/* Primary Actions */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <Button
                        className="w-full py-4 text-white rounded-xl font-semibold"
                        style={{ background: 'linear-gradient(135deg, #0d5c46, #1a7f5f)' }}
                        onClick={() => completedBooking && downloadBookingPDF(completedBooking)}
                      >
                        <Download className="mr-2 w-5 h-5" /> Download PDF Receipt
                      </Button>
                      <Button
                        className="w-full py-4 bg-green-500 hover:bg-green-600 text-white rounded-xl font-semibold"
                        onClick={() => completedBooking && openWhatsAppConfirmation(completedBooking)}
                      >
                        <MessageCircle className="mr-2 w-5 h-5" /> Send via WhatsApp
                      </Button>
                    </div>

                    {/* Secondary Actions */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <Button
                        variant="outline"
                        className="w-full py-3 border-2 border-slate-200 rounded-xl"
                        onClick={() => window.print()}
                      >
                        <Printer className="mr-2 w-4 h-4" /> Print Confirmation
                      </Button>
                      <Button
                        variant="outline"
                        className="w-full py-3 border-2 border-amber-300 text-amber-700 hover:bg-amber-50 rounded-xl"
                        onClick={() => completedBooking && notifyAdminWhatsApp(completedBooking)}
                      >
                        <Send className="mr-2 w-4 h-4" /> Notify Admin (WhatsApp)
                      </Button>
                    </div>
                  </div>

                  {/* Email Confirmation Notice */}
                  <div className="mt-6 p-4 bg-blue-50 rounded-xl border border-blue-100">
                    <p className="text-sm text-blue-700 flex items-center gap-2">
                      <Mail className="w-4 h-4" />
                      Confirmation email sent to <strong>{email}</strong> and admin at <strong>info@rechargetravels.com</strong>
                    </p>
                  </div>

                  {/* Book Another */}
                  <div className="mt-8 pt-6 border-t border-slate-100 text-center">
                    <Button
                      onClick={() => {
                        setStep(1);
                        setBookingComplete(false);
                        setBookingState('idle');
                        setCompletedBooking(null);
                        // Reset form
                        setSelectedAirport(null);
                        setSelectedDestination(null);
                        setSelectedHotel(null);
                        setPlacesDestination(null);
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
                        setDirections(null);
                        setCalculatedDistance(0);
                      }}
                      variant="ghost"
                      className="text-emerald-700 hover:text-emerald-800 hover:bg-emerald-50"
                    >
                      <ArrowRight className="mr-2 w-4 h-4" /> Book Another Transfer
                    </Button>
                  </div>

                  {/* 24/7 Support */}
                  <div className="mt-6 text-center">
                    <p className="text-sm text-slate-500 mb-2">Need assistance?</p>
                    <a
                      href="https://wa.me/94777721999"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 text-green-600 font-semibold hover:text-green-700"
                    >
                      <Headphones className="w-4 h-4" /> 24/7 WhatsApp Concierge
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
                      {selectedVehicle && calculatedPrice && (
                        <div className="flex justify-between text-sm mb-2">
                          <span className="text-slate-600">{selectedVehicle.name}</span>
                          <span className="text-slate-800">${calculatedPrice.breakdown.basePrice || 0}</span>
                        </div>
                      )}
                      {calculatedDistance > 0 && calculatedPrice && (
                        <div className="flex justify-between text-sm mb-2">
                          <span className="text-slate-600">Distance ({calculatedDistance}km)</span>
                          <span className="text-slate-800">${calculatedPrice.breakdown.distancePrice || 0}</span>
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
                        <span className="text-2xl font-bold text-emerald-800">
                          ${calculatedPrice ? (
                            calculatedPrice.price + selectedExtras.filter(id => id !== 'meet-greet').reduce((sum, id) => {
                              const extra = TRANSFER_EXTRAS.find(e => e.id === id);
                              return sum + (extra?.priceUSD || 0);
                            }, 0) + (selectedExtras.includes('child-seat') ? childSeatCount * 5 : 0)
                          ) : 0}
                        </span>
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

          {/* Popular Routes Section */}
          <div className="mt-16">
            <h2 className="text-2xl md:text-3xl font-bold text-emerald-800 text-center mb-2" style={{ fontFamily: '"Playfair Display", serif' }}>
              Popular Routes from Colombo Airport
            </h2>
            <p className="text-slate-500 text-center mb-8">Fixed prices for economy sedan • All-inclusive rates</p>

            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {[
                { dest: 'Colombo City', price: 35, time: '45 min' },
                { dest: 'Negombo', price: 15, time: '15 min' },
                { dest: 'Kandy', price: 85, time: '3.5 hrs' },
                { dest: 'Galle Fort', price: 95, time: '2.5 hrs' },
                { dest: 'Sigiriya', price: 110, time: '4 hrs' },
                { dest: 'Ella', price: 145, time: '6 hrs' },
                { dest: 'Mirissa', price: 105, time: '3 hrs' },
                { dest: 'Bentota', price: 65, time: '1.5 hrs' },
                { dest: 'Nuwara Eliya', price: 120, time: '5 hrs' },
                { dest: 'Yala', price: 160, time: '6 hrs' },
                { dest: 'Trincomalee', price: 150, time: '6 hrs' },
                { dest: 'Jaffna', price: 195, time: '8 hrs' },
              ].map((route, i) => (
                <div key={i} className="bg-white rounded-xl p-4 shadow-md hover:shadow-lg transition-shadow border border-emerald-50 text-center">
                  <p className="font-semibold text-slate-800">{route.dest}</p>
                  <p className="text-2xl font-bold text-emerald-700 my-1">${route.price}</p>
                  <p className="text-xs text-slate-500">{route.time}</p>
                </div>
              ))}
            </div>
            <p className="text-center text-sm text-slate-500 mt-4">
              * Prices for Economy Sedan (1-3 passengers). SUV and Van rates available on request.
            </p>
          </div>

          {/* FAQ Section */}
          <div className="mt-16 bg-white rounded-3xl p-8 shadow-xl">
            <h2 className="text-2xl md:text-3xl font-bold text-emerald-800 text-center mb-8" style={{ fontFamily: '"Playfair Display", serif' }}>
              Frequently Asked Questions
            </h2>

            <div className="grid md:grid-cols-2 gap-6 max-w-5xl mx-auto">
              {[
                {
                  q: "What happens if my flight is delayed?",
                  a: "We track all flights in real-time. Your driver will adjust their arrival time based on your actual landing. There's no extra charge for flight delays."
                },
                {
                  q: "How do I find my driver at the airport?",
                  a: "Your driver will wait at the arrivals hall with a name board showing your name. You'll receive their photo and contact number before arrival."
                },
                {
                  q: "Can I book a transfer from my hotel to the airport?",
                  a: "Yes! Select 'Airport Drop-off' or 'Round Trip' when booking. We offer transfers from any location in Sri Lanka to all airports."
                },
                {
                  q: "What payment methods do you accept?",
                  a: "We accept credit/debit cards (Visa, Mastercard), PayPal, and cash payment to driver. Pre-payment secures your booking."
                },
                {
                  q: "Can I cancel or modify my booking?",
                  a: "Free cancellation up to 24 hours before pickup. Modifications can be made anytime by contacting our support team."
                },
                {
                  q: "Do you provide child seats?",
                  a: "Yes, we offer infant seats (0-12 months) and child seats (1-4 years) for $5 per seat. Please request when booking."
                },
                {
                  q: "What's included in the price?",
                  a: "All prices include: vehicle, professional driver, fuel, tolls, parking, meet & greet service, flight tracking, and 60-minute free waiting time."
                },
                {
                  q: "How long is the free waiting time?",
                  a: "60 minutes free waiting time from your flight landing. Additional waiting is charged at $10 per 30 minutes."
                },
              ].map((faq, i) => (
                <div key={i} className="bg-emerald-50/50 rounded-xl p-5">
                  <h3 className="font-semibold text-slate-800 mb-2 flex items-start gap-2">
                    <span className="bg-emerald-700 text-white w-6 h-6 rounded-full flex items-center justify-center text-sm flex-shrink-0">?</span>
                    {faq.q}
                  </h3>
                  <p className="text-slate-600 text-sm pl-8">{faq.a}</p>
                </div>
              ))}
            </div>
          </div>

          {/* WhatsApp CTA Section */}
          <div className="mt-16 bg-gradient-to-r from-green-600 to-green-500 rounded-3xl p-8 text-white text-center">
            <h2 className="text-2xl md:text-3xl font-bold mb-4" style={{ fontFamily: '"Playfair Display", serif' }}>
              Need a Custom Quote?
            </h2>
            <p className="text-white/90 mb-6 max-w-xl mx-auto">
              Message us on WhatsApp for instant quotes, multi-day transfers, or special requests. Our team responds within minutes!
            </p>
            <a
              href="https://wa.me/94777721999?text=Hi%2C%20I%20need%20a%20quote%20for%20airport%20transfer%20in%20Sri%20Lanka"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-3 px-8 py-4 bg-white text-green-600 font-bold rounded-full text-lg hover:bg-gray-100 transition-colors shadow-lg"
            >
              <MessageCircle className="w-6 h-6" /> Get Instant Quote on WhatsApp
            </a>
            <p className="text-white/70 text-sm mt-4">
              +94 77 772 1999 • Available 24/7
            </p>
          </div>
        </div>

        {/* Floating WhatsApp Button */}
        <a
          href="https://wa.me/94777721999?text=Hi%2C%20I%20need%20help%20with%20airport%20transfer"
          target="_blank"
          rel="noopener noreferrer"
          className="fixed bottom-6 right-6 z-50 w-16 h-16 bg-green-500 rounded-full shadow-2xl flex items-center justify-center hover:bg-green-600 transition-all hover:scale-110"
          title="Chat on WhatsApp"
        >
          <MessageCircle className="w-8 h-8 text-white" />
        </a>
      </div>
    </>
  );
};

export default AirportTransfers;
