import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  MapPin, Calendar, Users, Car, User, Package, CreditCard, CheckCircle,
  ChevronRight, ChevronLeft, Plus, Minus, Star, Shield, Clock, Coffee,
  Camera, Wifi, Baby, Check, X, Info, Sparkles, Award, Globe, Heart,
  Navigation, Phone, Mail, Building, Printer, Download, ArrowRight,
  Mountain, Waves, Bird, Landmark, Leaf, TreePine, Compass, Route
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import {
  privateToursBookingService,
  TOUR_DESTINATIONS,
  TOUR_VEHICLES,
  DRIVER_TYPES,
  TOUR_EXTRAS,
  TOUR_PACKAGES,
  calculateTourPrice,
  TourDestination,
  TourVehicle,
  TourDriver,
  TourExtra,
  TourPackage
} from '@/services/privateToursBookingService';

// Step definitions
const STEPS = [
  { id: 1, title: 'Tour Type', subtitle: 'Package or Custom', icon: Compass },
  { id: 2, title: 'Destinations', subtitle: 'Where to visit', icon: MapPin },
  { id: 3, title: 'Schedule', subtitle: 'Date & Duration', icon: Calendar },
  { id: 4, title: 'Vehicle', subtitle: 'Choose your ride', icon: Car },
  { id: 5, title: 'Driver', subtitle: 'Guide options', icon: User },
  { id: 6, title: 'Extras', subtitle: 'Add-ons', icon: Package },
  { id: 7, title: 'Details', subtitle: 'Your info', icon: Users },
  { id: 8, title: 'Payment', subtitle: 'Confirm & Pay', icon: CreditCard }
];

// Category icons
const categoryIcons: Record<string, React.ComponentType<any>> = {
  cultural: Landmark,
  wildlife: Bird,
  beach: Waves,
  nature: TreePine,
  adventure: Mountain,
  religious: Globe,
  scenic: Compass
};

interface PrivateToursBookingWizardProps {
  initialPackageId?: string;
}

const PrivateToursBookingWizard: React.FC<PrivateToursBookingWizardProps> = ({ initialPackageId }) => {
  // Wizard state
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [bookingComplete, setBookingComplete] = useState(false);
  const [bookingReference, setBookingReference] = useState('');

  // Tour type state
  const [tourType, setTourType] = useState<'package' | 'custom'>('custom');
  const [selectedPackage, setSelectedPackage] = useState<TourPackage | null>(null);

  // Destinations state
  const [selectedDestinations, setSelectedDestinations] = useState<TourDestination[]>([]);
  const [destinationFilter, setDestinationFilter] = useState<string>('all');

  // Schedule state
  const [durationType, setDurationType] = useState<'half-day' | 'full-day' | 'multi-day'>('full-day');
  const [durationDays, setDurationDays] = useState(1);
  const [startDate, setStartDate] = useState('');
  const [pickupTime, setPickupTime] = useState('08:00');
  const [pickupLocation, setPickupLocation] = useState('');
  const [dropoffLocation, setDropoffLocation] = useState('');

  // Vehicle state
  const [selectedVehicle, setSelectedVehicle] = useState<TourVehicle | null>(null);

  // Driver state
  const [selectedDriver, setSelectedDriver] = useState<TourDriver>(DRIVER_TYPES[0]);

  // Passengers state
  const [passengers, setPassengers] = useState({ adults: 2, children: 0, infants: 0 });

  // Extras state
  const [selectedExtras, setSelectedExtras] = useState<{ extra: TourExtra; quantity: number }[]>([]);

  // Customer info state
  const [customerInfo, setCustomerInfo] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    whatsapp: '',
    nationality: '',
    hotelName: '',
    hotelAddress: ''
  });

  // Special requests
  const [specialRequests, setSpecialRequests] = useState('');
  const [dietaryRequirements, setDietaryRequirements] = useState('');

  // Payment state
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'paypal' | 'cash'>('card');
  const [agreedToTerms, setAgreedToTerms] = useState(false);

  // Initialize with package if provided
  useEffect(() => {
    if (initialPackageId) {
      const pkg = TOUR_PACKAGES.find(p => p.id === initialPackageId);
      if (pkg) {
        setTourType('package');
        setSelectedPackage(pkg);
        setDurationDays(pkg.durationDays);
        setDurationType(pkg.durationDays < 1 ? 'half-day' : pkg.durationDays === 1 ? 'full-day' : 'multi-day');
        const destinations = TOUR_DESTINATIONS.filter(d => pkg.destinations.includes(d.id));
        setSelectedDestinations(destinations);
      }
    }
  }, [initialPackageId]);

  // Calculate pricing
  const pricing = useMemo(() => {
    if (!selectedVehicle) return null;

    return calculateTourPrice({
      duration: { type: durationType, days: durationDays },
      vehicle: selectedVehicle,
      driver: selectedDriver,
      passengers,
      selectedDestinations: selectedDestinations.map(d => ({ entranceFee: d.entranceFee })),
      extras: selectedExtras.map(e => ({
        price: e.extra.price,
        priceType: e.extra.priceType,
        quantity: e.quantity
      }))
    });
  }, [selectedVehicle, selectedDriver, durationType, durationDays, passengers, selectedDestinations, selectedExtras]);

  // Filter destinations by category
  const filteredDestinations = useMemo(() => {
    if (destinationFilter === 'all') return TOUR_DESTINATIONS;
    return TOUR_DESTINATIONS.filter(d => d.category === destinationFilter);
  }, [destinationFilter]);

  // Toggle destination selection
  const toggleDestination = (destination: TourDestination) => {
    setSelectedDestinations(prev => {
      const exists = prev.find(d => d.id === destination.id);
      if (exists) {
        return prev.filter(d => d.id !== destination.id);
      }
      return [...prev, destination];
    });
  };

  // Toggle extra selection
  const toggleExtra = (extra: TourExtra) => {
    setSelectedExtras(prev => {
      const exists = prev.find(e => e.extra.id === extra.id);
      if (exists) {
        return prev.filter(e => e.extra.id !== extra.id);
      }
      return [...prev, { extra, quantity: 1 }];
    });
  };

  // Update extra quantity
  const updateExtraQuantity = (extraId: string, delta: number) => {
    setSelectedExtras(prev =>
      prev.map(e => {
        if (e.extra.id === extraId) {
          const newQty = Math.max(1, e.quantity + delta);
          return { ...e, quantity: newQty };
        }
        return e;
      })
    );
  };

  // Validate current step
  const canProceed = () => {
    switch (currentStep) {
      case 1: return tourType === 'package' ? !!selectedPackage : true;
      case 2: return selectedDestinations.length > 0;
      case 3: return startDate && pickupTime && pickupLocation;
      case 4: return !!selectedVehicle;
      case 5: return !!selectedDriver;
      case 6: return true;
      case 7: return customerInfo.firstName && customerInfo.lastName && customerInfo.email && customerInfo.phone;
      case 8: return agreedToTerms;
      default: return false;
    }
  };

  // Handle booking submission
  const handleSubmit = async () => {
    if (!selectedVehicle || !pricing) return;

    setIsSubmitting(true);
    try {
      const endDate = new Date(startDate);
      endDate.setDate(endDate.getDate() + durationDays - 1);

      const result = await privateToursBookingService.createBooking({
        tourType,
        packageId: selectedPackage?.id,
        packageName: selectedPackage?.name,
        selectedDestinations: selectedDestinations.map(d => ({
          id: d.id,
          name: d.name,
          duration: d.durationHours,
          entranceFee: d.entranceFee
        })),
        startDate,
        endDate: endDate.toISOString().split('T')[0],
        duration: { type: durationType, days: durationDays },
        pickupTime,
        pickupLocation,
        dropoffLocation: dropoffLocation || pickupLocation,
        vehicle: {
          type: selectedVehicle.type,
          name: selectedVehicle.name,
          price: pricing.vehicleCost
        },
        driver: {
          type: selectedDriver.type,
          name: selectedDriver.name,
          price: pricing.driverCost
        },
        passengers,
        extras: selectedExtras.map(e => ({
          id: e.extra.id,
          name: e.extra.name,
          price: e.extra.price,
          quantity: e.quantity
        })),
        specialRequests,
        dietaryRequirements,
        customerInfo,
        pricing: {
          ...pricing,
          currency: 'USD'
        },
        paymentMethod,
        paymentStatus: 'pending',
        status: 'pending'
      });

      setBookingReference(result.bookingReference);
      setBookingComplete(true);
    } catch (error) {
      console.error('Booking failed:', error);
      alert('Booking failed. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Render step content
  const renderStepContent = () => {
    switch (currentStep) {
      // Step 1: Tour Type Selection
      case 1:
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-gray-900">How would you like to explore Sri Lanka?</h2>
              <p className="text-gray-600 mt-2">Choose a curated package or create your own adventure</p>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              {/* Custom Tour Option */}
              <motion.div
                whileHover={{ scale: 1.02 }}
                onClick={() => { setTourType('custom'); setSelectedPackage(null); }}
                className={`p-6 rounded-2xl border-2 cursor-pointer transition-all ${
                  tourType === 'custom'
                    ? 'border-emerald-500 bg-emerald-50 shadow-lg'
                    : 'border-gray-200 hover:border-emerald-300'
                }`}
              >
                <div className="flex items-center gap-4 mb-4">
                  <div className={`w-14 h-14 rounded-xl flex items-center justify-center ${
                    tourType === 'custom' ? 'bg-emerald-500 text-white' : 'bg-gray-100 text-gray-600'
                  }`}>
                    <Compass className="w-7 h-7" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold">Custom Tour</h3>
                    <p className="text-gray-500 text-sm">Design your own itinerary</p>
                  </div>
                </div>
                <ul className="space-y-2">
                  {['Choose your destinations', 'Flexible timing', 'Personalized experience', 'Any duration'].map((item, i) => (
                    <li key={i} className="flex items-center gap-2 text-sm text-gray-600">
                      <Check className="w-4 h-4 text-emerald-500" />
                      {item}
                    </li>
                  ))}
                </ul>
              </motion.div>

              {/* Package Tour Option */}
              <motion.div
                whileHover={{ scale: 1.02 }}
                onClick={() => setTourType('package')}
                className={`p-6 rounded-2xl border-2 cursor-pointer transition-all ${
                  tourType === 'package'
                    ? 'border-emerald-500 bg-emerald-50 shadow-lg'
                    : 'border-gray-200 hover:border-emerald-300'
                }`}
              >
                <div className="flex items-center gap-4 mb-4">
                  <div className={`w-14 h-14 rounded-xl flex items-center justify-center ${
                    tourType === 'package' ? 'bg-emerald-500 text-white' : 'bg-gray-100 text-gray-600'
                  }`}>
                    <Package className="w-7 h-7" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold">Tour Packages</h3>
                    <p className="text-gray-500 text-sm">Curated experiences</p>
                  </div>
                </div>
                <ul className="space-y-2">
                  {['Expert-planned routes', 'Best value pricing', 'Popular destinations', 'Hassle-free booking'].map((item, i) => (
                    <li key={i} className="flex items-center gap-2 text-sm text-gray-600">
                      <Check className="w-4 h-4 text-emerald-500" />
                      {item}
                    </li>
                  ))}
                </ul>
              </motion.div>
            </div>

            {/* Package Selection */}
            {tourType === 'package' && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-8"
              >
                <h3 className="text-lg font-semibold mb-4">Select a Tour Package</h3>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {TOUR_PACKAGES.filter(p => p.isFeatured).map(pkg => (
                    <motion.div
                      key={pkg.id}
                      whileHover={{ y: -4 }}
                      onClick={() => {
                        setSelectedPackage(pkg);
                        setDurationDays(pkg.durationDays);
                        setDurationType(pkg.durationDays < 1 ? 'half-day' : pkg.durationDays === 1 ? 'full-day' : 'multi-day');
                        const destinations = TOUR_DESTINATIONS.filter(d => pkg.destinations.includes(d.id));
                        setSelectedDestinations(destinations);
                      }}
                      className={`rounded-xl overflow-hidden border-2 cursor-pointer transition-all ${
                        selectedPackage?.id === pkg.id
                          ? 'border-emerald-500 shadow-lg ring-2 ring-emerald-200'
                          : 'border-gray-200 hover:border-emerald-300'
                      }`}
                    >
                      <div className="h-32 relative">
                        <img src={pkg.image} alt={pkg.name} className="w-full h-full object-cover" />
                        <div className="absolute inset-0 bg-gradient-to-t from-emerald-900/70 to-transparent" />
                        <div className="absolute bottom-2 left-3 right-3">
                          <p className="text-white font-semibold text-sm">{pkg.name}</p>
                          <p className="text-white/80 text-xs">{pkg.duration}</p>
                        </div>
                        {pkg.isPopular && (
                          <Badge className="absolute top-2 right-2 bg-amber-500">Popular</Badge>
                        )}
                      </div>
                      <div className="p-3">
                        <p className="text-xs text-gray-500 line-clamp-2">{pkg.shortDescription}</p>
                        <p className="text-emerald-600 font-bold mt-2">From ${pkg.startingPrice}</p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}
          </div>
        );

      // Step 2: Destinations
      case 2:
        return (
          <div className="space-y-6">
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900">
                {tourType === 'package' ? 'Tour Destinations' : 'Choose Your Destinations'}
              </h2>
              <p className="text-gray-600 mt-2">
                {tourType === 'package'
                  ? 'These destinations are included in your package'
                  : 'Select the places you want to visit'}
              </p>
            </div>

            {/* Category Filter */}
            {tourType === 'custom' && (
              <div className="flex flex-wrap gap-2 justify-center mb-6">
                {['all', 'cultural', 'wildlife', 'beach', 'nature', 'religious', 'scenic'].map(cat => (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setDestinationFilter(cat)}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                      destinationFilter === cat
                        ? 'bg-emerald-600 text-white'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    {cat.charAt(0).toUpperCase() + cat.slice(1)}
                  </button>
                ))}
              </div>
            )}

            {/* Selected Destinations Summary */}
            {selectedDestinations.length > 0 && (
              <div className="bg-emerald-50 rounded-xl p-4 mb-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-semibold text-emerald-800">
                    {selectedDestinations.length} Destination{selectedDestinations.length > 1 ? 's' : ''} Selected
                  </span>
                  <span className="text-sm text-emerald-600">
                    ~{selectedDestinations.reduce((sum, d) => sum + d.durationHours, 0)} hours total
                  </span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {selectedDestinations.map(d => (
                    <Badge key={d.id} variant="secondary" className="bg-white">
                      {d.name}
                      {tourType === 'custom' && (
                        <X
                          className="w-3 h-3 ml-1 cursor-pointer"
                          onClick={() => toggleDestination(d)}
                        />
                      )}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {/* Destinations Grid */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 max-h-[500px] overflow-y-auto pr-2">
              {(tourType === 'package' ? selectedDestinations : filteredDestinations).map(dest => {
                const isSelected = selectedDestinations.some(d => d.id === dest.id);
                const CategoryIcon = categoryIcons[dest.category] || MapPin;

                return (
                  <motion.div
                    key={dest.id}
                    whileHover={{ y: -4 }}
                    onClick={() => tourType === 'custom' && toggleDestination(dest)}
                    className={`rounded-xl overflow-hidden border-2 transition-all ${
                      tourType === 'custom' ? 'cursor-pointer' : ''
                    } ${
                      isSelected
                        ? 'border-emerald-500 shadow-md'
                        : 'border-gray-200 hover:border-emerald-300'
                    }`}
                  >
                    <div className="h-36 relative">
                      <img src={dest.image} alt={dest.name} className="w-full h-full object-cover" />
                      <div className="absolute inset-0 bg-gradient-to-t from-emerald-900/70 to-transparent" />
                      <div className="absolute bottom-3 left-3 right-3">
                        <h3 className="text-white font-bold">{dest.name}</h3>
                        <div className="flex items-center gap-2 text-white/80 text-xs">
                          <Clock className="w-3 h-3" />
                          {dest.durationHours}h
                          {dest.entranceFee && (
                            <>
                              <span>•</span>
                              <span>${dest.entranceFee} entry</span>
                            </>
                          )}
                        </div>
                      </div>
                      <div className="absolute top-2 right-2 flex gap-1">
                        <span className={`w-8 h-8 rounded-full flex items-center justify-center ${
                          isSelected ? 'bg-emerald-500 text-white' : 'bg-white/90 text-gray-600'
                        }`}>
                          {isSelected ? <Check className="w-4 h-4" /> : <CategoryIcon className="w-4 h-4" />}
                        </span>
                      </div>
                      {dest.isPopular && (
                        <Badge className="absolute top-2 left-2 bg-amber-500 text-xs">Popular</Badge>
                      )}
                    </div>
                    <div className="p-3">
                      <p className="text-xs text-gray-500 line-clamp-2">{dest.description}</p>
                      <div className="flex flex-wrap gap-1 mt-2">
                        {dest.highlights.slice(0, 2).map((h, i) => (
                          <span key={i} className="text-xs bg-gray-100 px-2 py-0.5 rounded">
                            {h}
                          </span>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        );

      // Step 3: Schedule
      case 3:
        return (
          <div className="space-y-6">
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Plan Your Schedule</h2>
              <p className="text-gray-600 mt-2">When would you like to start your adventure?</p>
            </div>

            {/* Duration Type */}
            <div>
              <Label className="text-sm font-medium mb-3 block">Tour Duration</Label>
              <div className="grid grid-cols-3 gap-3">
                {[
                  { value: 'half-day', label: 'Half Day', desc: '4-5 hours' },
                  { value: 'full-day', label: 'Full Day', desc: '8-10 hours' },
                  { value: 'multi-day', label: 'Multi-Day', desc: 'Overnight trips' }
                ].map(opt => (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => {
                      setDurationType(opt.value as any);
                      if (opt.value !== 'multi-day') setDurationDays(opt.value === 'half-day' ? 0.5 : 1);
                    }}
                    className={`p-4 rounded-xl border-2 text-left transition-all ${
                      durationType === opt.value
                        ? 'border-emerald-500 bg-emerald-50'
                        : 'border-gray-200 hover:border-emerald-300'
                    }`}
                  >
                    <p className="font-semibold">{opt.label}</p>
                    <p className="text-sm text-gray-500">{opt.desc}</p>
                  </button>
                ))}
              </div>
            </div>

            {/* Multi-day duration selector */}
            {durationType === 'multi-day' && (
              <div>
                <Label className="text-sm font-medium mb-3 block">Number of Days</Label>
                <div className="flex items-center gap-4">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => setDurationDays(Math.max(2, durationDays - 1))}
                  >
                    <Minus className="w-4 h-4" />
                  </Button>
                  <span className="text-2xl font-bold w-16 text-center">{durationDays}</span>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => setDurationDays(Math.min(14, durationDays + 1))}
                  >
                    <Plus className="w-4 h-4" />
                  </Button>
                  <span className="text-gray-500">days</span>
                </div>
              </div>
            )}

            {/* Date & Time */}
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="startDate" className="text-sm font-medium mb-2 block">Start Date *</Label>
                <Input
                  id="startDate"
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  min={new Date().toISOString().split('T')[0]}
                  className="w-full"
                />
              </div>
              <div>
                <Label htmlFor="pickupTime" className="text-sm font-medium mb-2 block">Pickup Time *</Label>
                <Input
                  id="pickupTime"
                  type="time"
                  value={pickupTime}
                  onChange={(e) => setPickupTime(e.target.value)}
                  className="w-full"
                />
              </div>
            </div>

            {/* Pickup Location */}
            <div>
              <Label htmlFor="pickupLocation" className="text-sm font-medium mb-2 block">Pickup Location *</Label>
              <Input
                id="pickupLocation"
                placeholder="Hotel name, address, or airport"
                value={pickupLocation}
                onChange={(e) => setPickupLocation(e.target.value)}
              />
            </div>

            {/* Dropoff Location */}
            <div>
              <Label htmlFor="dropoffLocation" className="text-sm font-medium mb-2 block">Drop-off Location (Optional)</Label>
              <Input
                id="dropoffLocation"
                placeholder="Same as pickup if left empty"
                value={dropoffLocation}
                onChange={(e) => setDropoffLocation(e.target.value)}
              />
            </div>

            {/* Passengers */}
            <div>
              <Label className="text-sm font-medium mb-3 block">Number of Travelers</Label>
              <div className="grid grid-cols-3 gap-4">
                {[
                  { key: 'adults', label: 'Adults', desc: '12+ years' },
                  { key: 'children', label: 'Children', desc: '2-11 years' },
                  { key: 'infants', label: 'Infants', desc: 'Under 2' }
                ].map(({ key, label, desc }) => (
                  <div key={key} className="bg-gray-50 rounded-xl p-4">
                    <p className="font-medium text-sm">{label}</p>
                    <p className="text-xs text-gray-500 mb-2">{desc}</p>
                    <div className="flex items-center justify-center gap-3">
                      <button
                        type="button"
                        onClick={() => setPassengers(prev => ({
                          ...prev,
                          [key]: Math.max(key === 'adults' ? 1 : 0, prev[key as keyof typeof prev] - 1)
                        }))}
                        className="w-8 h-8 rounded-full bg-white border flex items-center justify-center hover:bg-gray-100"
                      >
                        <Minus className="w-4 h-4" />
                      </button>
                      <span className="text-xl font-bold w-8 text-center">
                        {passengers[key as keyof typeof passengers]}
                      </span>
                      <button
                        type="button"
                        onClick={() => setPassengers(prev => ({
                          ...prev,
                          [key]: prev[key as keyof typeof prev] + 1
                        }))}
                        className="w-8 h-8 rounded-full bg-white border flex items-center justify-center hover:bg-gray-100"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );

      // Step 4: Vehicle Selection
      case 4:
        return (
          <div className="space-y-6">
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Select Your Vehicle</h2>
              <p className="text-gray-600 mt-2">
                {passengers.adults + passengers.children} travelers • {durationType === 'half-day' ? 'Half day' : durationDays + ' day(s)'}
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              {TOUR_VEHICLES.filter(v => v.maxPassengers >= passengers.adults + passengers.children).map(vehicle => {
                const isSelected = selectedVehicle?.id === vehicle.id;
                const price = durationType === 'half-day'
                  ? vehicle.pricePerHalfDay
                  : vehicle.pricePerDay * (durationType === 'multi-day' ? durationDays : 1);

                return (
                  <motion.div
                    key={vehicle.id}
                    whileHover={{ y: -4 }}
                    onClick={() => setSelectedVehicle(vehicle)}
                    className={`rounded-xl overflow-hidden border-2 cursor-pointer transition-all ${
                      isSelected
                        ? 'border-emerald-500 bg-emerald-50 shadow-lg'
                        : 'border-gray-200 hover:border-emerald-300'
                    }`}
                  >
                    <div className="h-40 relative">
                      <img src={vehicle.image} alt={vehicle.name} className="w-full h-full object-cover" />
                      {vehicle.isLuxury && (
                        <Badge className="absolute top-2 right-2 bg-amber-500">
                          <Sparkles className="w-3 h-3 mr-1" />
                          Luxury
                        </Badge>
                      )}
                      {isSelected && (
                        <div className="absolute top-2 left-2 w-8 h-8 bg-emerald-500 rounded-full flex items-center justify-center">
                          <Check className="w-5 h-5 text-white" />
                        </div>
                      )}
                    </div>
                    <div className="p-4">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <h3 className="font-bold text-lg">{vehicle.name}</h3>
                          <p className="text-sm text-gray-500">{vehicle.description}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-emerald-600 font-bold text-xl">${price}</p>
                          <p className="text-xs text-gray-500">
                            {durationType === 'half-day' ? 'half day' : durationType === 'multi-day' ? `${durationDays} days` : 'per day'}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4 text-sm text-gray-600 mt-3">
                        <span className="flex items-center gap-1">
                          <Users className="w-4 h-4" />
                          {vehicle.maxPassengers} passengers
                        </span>
                        <span className="flex items-center gap-1">
                          <Package className="w-4 h-4" />
                          {vehicle.maxLuggage} bags
                        </span>
                      </div>
                      <div className="flex flex-wrap gap-1 mt-3">
                        {vehicle.features.slice(0, 4).map((f, i) => (
                          <span key={i} className="text-xs bg-gray-100 px-2 py-1 rounded">
                            {f}
                          </span>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        );

      // Step 5: Driver Selection
      case 5:
        return (
          <div className="space-y-6">
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Choose Your Driver</h2>
              <p className="text-gray-600 mt-2">Select the service level that suits your needs</p>
            </div>

            <div className="space-y-4">
              {DRIVER_TYPES.map(driver => {
                const isSelected = selectedDriver.type === driver.type;
                const price = durationType === 'half-day'
                  ? driver.pricePerDay * 0.5
                  : driver.pricePerDay * (durationType === 'multi-day' ? durationDays : 1);

                return (
                  <motion.div
                    key={driver.type}
                    whileHover={{ scale: 1.01 }}
                    onClick={() => setSelectedDriver(driver)}
                    className={`p-5 rounded-xl border-2 cursor-pointer transition-all ${
                      isSelected
                        ? 'border-emerald-500 bg-emerald-50 shadow-lg'
                        : 'border-gray-200 hover:border-emerald-300'
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-4">
                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                          isSelected ? 'bg-emerald-500 text-white' : 'bg-gray-100 text-gray-600'
                        }`}>
                          {driver.type === 'driver-guide' ? <Award className="w-6 h-6" /> :
                           driver.type === 'sltda-certified' ? <Shield className="w-6 h-6" /> :
                           <User className="w-6 h-6" />}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <h3 className="font-bold text-lg">{driver.name}</h3>
                            {driver.recommended && (
                              <Badge className="bg-amber-500 text-xs">Recommended</Badge>
                            )}
                          </div>
                          <p className="text-sm text-gray-500 mt-1">{driver.description}</p>
                          <ul className="mt-3 grid grid-cols-2 gap-x-4 gap-y-1">
                            {driver.features.map((f, i) => (
                              <li key={i} className="flex items-center gap-1 text-sm text-gray-600">
                                <Check className="w-3 h-3 text-emerald-500" />
                                {f}
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                      <div className="text-right">
                        {driver.pricePerDay > 0 ? (
                          <>
                            <p className="text-emerald-600 font-bold text-xl">+${Math.round(price)}</p>
                            <p className="text-xs text-gray-500">total</p>
                          </>
                        ) : (
                          <p className="text-emerald-600 font-bold">Included</p>
                        )}
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        );

      // Step 6: Extras
      case 6:
        return (
          <div className="space-y-6">
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Add Extras</h2>
              <p className="text-gray-600 mt-2">Enhance your tour with these optional add-ons</p>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              {TOUR_EXTRAS.map(extra => {
                const selectedExtra = selectedExtras.find(e => e.extra.id === extra.id);
                const isSelected = !!selectedExtra;

                return (
                  <motion.div
                    key={extra.id}
                    whileHover={{ scale: 1.02 }}
                    onClick={() => toggleExtra(extra)}
                    className={`p-4 rounded-xl border-2 cursor-pointer transition-all ${
                      isSelected
                        ? 'border-emerald-500 bg-emerald-50'
                        : 'border-gray-200 hover:border-emerald-300'
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-3">
                        <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                          isSelected ? 'bg-emerald-500 text-white' : 'bg-gray-100 text-gray-600'
                        }`}>
                          {isSelected ? <Check className="w-5 h-5" /> :
                           extra.icon === 'Coffee' ? <Coffee className="w-5 h-5" /> :
                           extra.icon === 'Camera' ? <Camera className="w-5 h-5" /> :
                           extra.icon === 'Wifi' ? <Wifi className="w-5 h-5" /> :
                           extra.icon === 'Baby' ? <Baby className="w-5 h-5" /> :
                           <Package className="w-5 h-5" />}
                        </div>
                        <div>
                          <h3 className="font-semibold">{extra.name}</h3>
                          <p className="text-xs text-gray-500">{extra.description}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-emerald-600 font-bold">${extra.price}</p>
                        <p className="text-xs text-gray-500">{extra.priceType.replace('-', '/')}</p>
                      </div>
                    </div>

                    {/* Quantity selector for selected extras */}
                    {isSelected && (
                      <div className="flex items-center justify-end gap-2 mt-3 pt-3 border-t" onClick={e => e.stopPropagation()}>
                        <span className="text-sm text-gray-600">Qty:</span>
                        <button
                          type="button"
                          onClick={() => updateExtraQuantity(extra.id, -1)}
                          className="w-7 h-7 rounded-full bg-white border flex items-center justify-center hover:bg-gray-100"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="font-bold w-6 text-center">{selectedExtra?.quantity}</span>
                        <button
                          type="button"
                          onClick={() => updateExtraQuantity(extra.id, 1)}
                          className="w-7 h-7 rounded-full bg-white border flex items-center justify-center hover:bg-gray-100"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>
                    )}
                  </motion.div>
                );
              })}
            </div>
          </div>
        );

      // Step 7: Customer Details
      case 7:
        return (
          <div className="space-y-6">
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Your Details</h2>
              <p className="text-gray-600 mt-2">Please provide your contact information</p>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="firstName">First Name *</Label>
                <Input
                  id="firstName"
                  value={customerInfo.firstName}
                  onChange={e => setCustomerInfo(prev => ({ ...prev, firstName: e.target.value }))}
                  placeholder="John"
                />
              </div>
              <div>
                <Label htmlFor="lastName">Last Name *</Label>
                <Input
                  id="lastName"
                  value={customerInfo.lastName}
                  onChange={e => setCustomerInfo(prev => ({ ...prev, lastName: e.target.value }))}
                  placeholder="Doe"
                />
              </div>
              <div>
                <Label htmlFor="email">Email Address *</Label>
                <Input
                  id="email"
                  type="email"
                  value={customerInfo.email}
                  onChange={e => setCustomerInfo(prev => ({ ...prev, email: e.target.value }))}
                  placeholder="john@example.com"
                />
              </div>
              <div>
                <Label htmlFor="phone">Phone Number *</Label>
                <Input
                  id="phone"
                  value={customerInfo.phone}
                  onChange={e => setCustomerInfo(prev => ({ ...prev, phone: e.target.value }))}
                  placeholder="+1 234 567 8900"
                />
              </div>
              <div>
                <Label htmlFor="whatsapp">WhatsApp (Optional)</Label>
                <Input
                  id="whatsapp"
                  value={customerInfo.whatsapp}
                  onChange={e => setCustomerInfo(prev => ({ ...prev, whatsapp: e.target.value }))}
                  placeholder="Same as phone or different"
                />
              </div>
              <div>
                <Label htmlFor="nationality">Nationality</Label>
                <Input
                  id="nationality"
                  value={customerInfo.nationality}
                  onChange={e => setCustomerInfo(prev => ({ ...prev, nationality: e.target.value }))}
                  placeholder="USA, UK, Germany..."
                />
              </div>
            </div>

            <div className="border-t pt-4 mt-4">
              <h3 className="font-semibold mb-3">Accommodation Details (Optional)</h3>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="hotelName">Hotel Name</Label>
                  <Input
                    id="hotelName"
                    value={customerInfo.hotelName}
                    onChange={e => setCustomerInfo(prev => ({ ...prev, hotelName: e.target.value }))}
                    placeholder="Hotel name for pickup"
                  />
                </div>
                <div>
                  <Label htmlFor="hotelAddress">Hotel Address</Label>
                  <Input
                    id="hotelAddress"
                    value={customerInfo.hotelAddress}
                    onChange={e => setCustomerInfo(prev => ({ ...prev, hotelAddress: e.target.value }))}
                    placeholder="Full address"
                  />
                </div>
              </div>
            </div>

            <div className="border-t pt-4 mt-4">
              <h3 className="font-semibold mb-3">Special Requirements</h3>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="specialRequests">Special Requests</Label>
                  <Textarea
                    id="specialRequests"
                    value={specialRequests}
                    onChange={e => setSpecialRequests(e.target.value)}
                    placeholder="Any special requirements or preferences..."
                    rows={3}
                  />
                </div>
                <div>
                  <Label htmlFor="dietary">Dietary Requirements</Label>
                  <Input
                    id="dietary"
                    value={dietaryRequirements}
                    onChange={e => setDietaryRequirements(e.target.value)}
                    placeholder="Vegetarian, allergies, etc."
                  />
                </div>
              </div>
            </div>
          </div>
        );

      // Step 8: Payment & Confirmation
      case 8:
        return (
          <div className="space-y-6">
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Review & Confirm</h2>
              <p className="text-gray-600 mt-2">Please review your booking details</p>
            </div>

            {/* Booking Summary */}
            <div className="bg-gray-50 rounded-xl p-5 space-y-4">
              <h3 className="font-bold text-lg border-b pb-2">Booking Summary</h3>

              {/* Tour Details */}
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-600">Tour Type</span>
                  <span className="font-medium">{tourType === 'package' ? selectedPackage?.name : 'Custom Tour'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Destinations</span>
                  <span className="font-medium">{selectedDestinations.length} places</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Date</span>
                  <span className="font-medium">{startDate} at {pickupTime}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Duration</span>
                  <span className="font-medium">
                    {durationType === 'half-day' ? 'Half Day' : `${durationDays} Day${durationDays > 1 ? 's' : ''}`}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Travelers</span>
                  <span className="font-medium">
                    {passengers.adults} Adult{passengers.adults > 1 ? 's' : ''}
                    {passengers.children > 0 && `, ${passengers.children} Child${passengers.children > 1 ? 'ren' : ''}`}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Vehicle</span>
                  <span className="font-medium">{selectedVehicle?.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Driver</span>
                  <span className="font-medium">{selectedDriver.name}</span>
                </div>
              </div>

              {/* Price Breakdown */}
              {pricing && (
                <div className="border-t pt-4 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Vehicle Cost</span>
                    <span>${pricing.vehicleCost}</span>
                  </div>
                  {pricing.driverCost > 0 && (
                    <div className="flex justify-between text-sm">
                      <span>Driver Upgrade</span>
                      <span>${pricing.driverCost}</span>
                    </div>
                  )}
                  {pricing.entranceFees > 0 && (
                    <div className="flex justify-between text-sm">
                      <span>Entrance Fees (estimated)</span>
                      <span>${pricing.entranceFees}</span>
                    </div>
                  )}
                  {pricing.extrasCost > 0 && (
                    <div className="flex justify-between text-sm">
                      <span>Extras</span>
                      <span>${pricing.extrasCost}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-sm">
                    <span>Service Fee (5%)</span>
                    <span>${pricing.serviceFee}</span>
                  </div>
                  <div className="flex justify-between font-bold text-lg border-t pt-2 mt-2">
                    <span>Total</span>
                    <span className="text-emerald-600">${pricing.total} USD</span>
                  </div>
                </div>
              )}
            </div>

            {/* Customer Info Summary */}
            <div className="bg-gray-50 rounded-xl p-5">
              <h3 className="font-bold mb-3">Contact Information</h3>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div><span className="text-gray-500">Name:</span> {customerInfo.firstName} {customerInfo.lastName}</div>
                <div><span className="text-gray-500">Email:</span> {customerInfo.email}</div>
                <div><span className="text-gray-500">Phone:</span> {customerInfo.phone}</div>
                <div><span className="text-gray-500">Pickup:</span> {pickupLocation}</div>
              </div>
            </div>

            {/* Payment Method */}
            <div>
              <Label className="font-semibold mb-3 block">Payment Method</Label>
              <div className="grid grid-cols-3 gap-3">
                {['card', 'paypal', 'cash'].map(method => (
                  <button
                    key={method}
                    type="button"
                    onClick={() => setPaymentMethod(method as any)}
                    className={`p-4 rounded-xl border-2 transition-all ${
                      paymentMethod === method
                        ? 'border-emerald-500 bg-emerald-50'
                        : 'border-gray-200 hover:border-emerald-300'
                    }`}
                  >
                    <CreditCard className="w-6 h-6 mx-auto mb-1" />
                    <p className="text-sm font-medium capitalize">{method === 'card' ? 'Credit Card' : method}</p>
                  </button>
                ))}
              </div>
            </div>

            {/* Terms */}
            <label className="flex items-start gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={agreedToTerms}
                onChange={e => setAgreedToTerms(e.target.checked)}
                className="mt-1 w-5 h-5 rounded border-gray-300 text-emerald-600 focus:ring-emerald-500"
              />
              <span className="text-sm text-gray-600">
                I agree to the <a href="#" className="text-emerald-600 underline">Terms & Conditions</a> and <a href="#" className="text-emerald-600 underline">Cancellation Policy</a>. I understand that entrance fees shown are estimates and actual fees will be paid directly at the sites.
              </span>
            </label>
          </div>
        );

      default:
        return null;
    }
  };

  // Booking Confirmation
  if (bookingComplete) {
    return (
      <div className="max-w-2xl mx-auto p-6">
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="text-center"
        >
          <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-10 h-10 text-emerald-600" />
          </div>
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Booking Confirmed!</h2>
          <p className="text-gray-600 mb-4">Your private tour has been booked successfully</p>

          <div className="bg-emerald-50 rounded-xl p-6 mb-6">
            <p className="text-sm text-gray-600 mb-1">Booking Reference</p>
            <p className="text-3xl font-bold text-emerald-600">{bookingReference}</p>
          </div>

          <div className="bg-gray-50 rounded-xl p-5 text-left mb-6">
            <h3 className="font-bold mb-3">What's Next?</h3>
            <ul className="space-y-2 text-sm text-gray-600">
              <li className="flex items-start gap-2">
                <Check className="w-4 h-4 text-emerald-500 mt-0.5" />
                Confirmation email sent to {customerInfo.email}
              </li>
              <li className="flex items-start gap-2">
                <Check className="w-4 h-4 text-emerald-500 mt-0.5" />
                Our team will contact you within 24 hours
              </li>
              <li className="flex items-start gap-2">
                <Check className="w-4 h-4 text-emerald-500 mt-0.5" />
                Driver details will be shared before your tour
              </li>
            </ul>
          </div>

          <div className="flex gap-3 justify-center">
            <Button onClick={() => window.print()} variant="outline">
              <Printer className="w-4 h-4 mr-2" />
              Print
            </Button>
            <Button onClick={() => window.location.reload()} className="bg-emerald-600 hover:bg-emerald-700">
              Book Another Tour
            </Button>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      {/* Progress Steps */}
      <div className="mb-8 overflow-x-auto pb-2">
        <div className="flex items-center justify-center min-w-max px-4">
          {STEPS.map((step, index) => {
            const isActive = currentStep === step.id;
            const isCompleted = currentStep > step.id;
            const StepIcon = step.icon;

            return (
              <React.Fragment key={step.id}>
                <div className="flex flex-col items-center">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${
                      isCompleted
                        ? 'bg-emerald-500 text-white'
                        : isActive
                        ? 'bg-emerald-600 text-white ring-4 ring-emerald-100'
                        : 'bg-gray-200 text-gray-500'
                    }`}
                  >
                    {isCompleted ? <Check className="w-5 h-5" /> : <StepIcon className="w-5 h-5" />}
                  </div>
                  <p className={`text-xs mt-1 font-medium ${isActive ? 'text-emerald-600' : 'text-gray-500'}`}>
                    {step.title}
                  </p>
                </div>
                {index < STEPS.length - 1 && (
                  <div
                    className={`w-8 md:w-12 h-1 mx-1 rounded ${
                      currentStep > step.id ? 'bg-emerald-500' : 'bg-gray-200'
                    }`}
                  />
                )}
              </React.Fragment>
            );
          })}
        </div>
      </div>

      {/* Step Content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentStep}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          className="bg-white rounded-2xl shadow-lg p-6 md:p-8"
        >
          {renderStepContent()}
        </motion.div>
      </AnimatePresence>

      {/* Price Summary (sticky) */}
      {pricing && currentStep > 3 && (
        <div className="mt-4 bg-emerald-50 rounded-xl p-4 flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-600">Estimated Total</p>
            <p className="text-2xl font-bold text-emerald-600">${pricing.total} USD</p>
          </div>
          <div className="text-right text-sm text-gray-500">
            {selectedVehicle?.name} • {selectedDriver.name}
          </div>
        </div>
      )}

      {/* Navigation Buttons */}
      <div className="flex justify-between mt-6">
        <Button
          variant="outline"
          onClick={() => setCurrentStep(prev => prev - 1)}
          disabled={currentStep === 1}
          className="px-6"
        >
          <ChevronLeft className="w-4 h-4 mr-2" />
          Back
        </Button>

        {currentStep < 8 ? (
          <Button
            onClick={() => setCurrentStep(prev => prev + 1)}
            disabled={!canProceed()}
            className="bg-emerald-600 hover:bg-emerald-700 px-6"
          >
            Continue
            <ChevronRight className="w-4 h-4 ml-2" />
          </Button>
        ) : (
          <Button
            onClick={handleSubmit}
            disabled={!canProceed() || isSubmitting}
            className="bg-emerald-600 hover:bg-emerald-700 px-8"
          >
            {isSubmitting ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                Processing...
              </>
            ) : (
              <>
                Confirm Booking
                <CheckCircle className="w-4 h-4 ml-2" />
              </>
            )}
          </Button>
        )}
      </div>
    </div>
  );
};

export default PrivateToursBookingWizard;
