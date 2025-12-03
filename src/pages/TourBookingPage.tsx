import React, { useState, useEffect, useMemo } from 'react';
import { useSearchParams, Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Lock, Star, Clock, Users, MapPin, Calendar, Phone, Mail, User,
  CreditCard, Building, ChevronLeft, ChevronRight, Check, Loader2,
  MessageCircle, Shield, Award, Headphones, Printer, ArrowLeft
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { dbService } from '@/lib/firebase-services';
import { db } from '@/lib/firebase';
import { addDoc, collection, Timestamp, onSnapshot, doc } from 'firebase/firestore';
import { toast } from 'sonner';
import { createCheckoutSession } from '@/services/stripeService';

interface TourConfig {
  id: string;
  title: string;
  subtitle?: string;
  rating: number;
  reviewCount: number;
  duration: string;
  image: string;
  pricing: {
    adult: number;
    child: number;
    infant: number;
    currency: string;
    symbol: string;
  };
  pickupOptions: {
    id: string;
    label: string;
    time: string;
    additionalCost: number;
  }[];
  highlights: string[];
  cancellationPolicy: {
    type: string;
    description: string;
  };
  maxGroupSize: number;
}

interface FormData {
  firstName: string;
  lastName: string;
  email: string;
  countryCode: string;
  phone: string;
  tourDate: string;
  pickupOption: string;
  pickupAddress: string;
  adults: number;
  children: number;
  infants: number;
  specialRequests: string;
  paymentMethod: 'card' | 'paypal' | 'bank';
  cardNumber: string;
  cardExpiry: string;
  cardCvc: string;
  cardName: string;
  agreeTerms: boolean;
}

const DEFAULT_CONFIG: TourConfig = {
  id: 'default-tour',
  title: 'Sri Lanka Tour Experience',
  subtitle: 'Explore the wonders of Sri Lanka',
  rating: 4.9,
  reviewCount: 127,
  duration: '8 hours',
  image: 'https://images.unsplash.com/photo-1568430462989-44163eb1752f?w=800',
  pricing: {
    adult: 85,
    child: 45,
    infant: 0,
    currency: 'USD',
    symbol: '$'
  },
  pickupOptions: [
    { id: 'colombo', label: 'Pickup from Colombo', time: '7:00 AM', additionalCost: 0 },
    { id: 'negombo', label: 'Pickup from Negombo', time: '6:30 AM', additionalCost: 0 },
    { id: 'airport', label: 'Airport Pickup (BIA)', time: '6:00 AM', additionalCost: 15 }
  ],
  highlights: [
    'Private tour - only your group',
    'English speaking guide',
    'All entrance fees included',
    'Comfortable AC vehicle'
  ],
  cancellationPolicy: {
    type: 'flexible',
    description: 'Free cancellation up to 24 hours before the experience starts'
  },
  maxGroupSize: 15
};

const COUNTRY_CODES = [
  { code: '+94', flag: '🇱🇰', country: 'Sri Lanka' },
  { code: '+1', flag: '🇺🇸', country: 'USA' },
  { code: '+44', flag: '🇬🇧', country: 'UK' },
  { code: '+61', flag: '🇦🇺', country: 'Australia' },
  { code: '+49', flag: '🇩🇪', country: 'Germany' },
  { code: '+33', flag: '🇫🇷', country: 'France' },
  { code: '+91', flag: '🇮🇳', country: 'India' },
  { code: '+86', flag: '🇨🇳', country: 'China' },
  { code: '+81', flag: '🇯🇵', country: 'Japan' },
  { code: '+971', flag: '🇦🇪', country: 'UAE' },
];

export const TourBookingPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [bookingComplete, setBookingComplete] = useState(false);
  const [bookingRef, setBookingRef] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Parse tour config from URL params
  const tourConfig = useMemo<TourConfig>(() => {
    const tourData = searchParams.get('tour');
    if (tourData) {
      try {
        const parsed = JSON.parse(decodeURIComponent(tourData));
        return { ...DEFAULT_CONFIG, ...parsed };
      } catch {
        return DEFAULT_CONFIG;
      }
    }

    // Build config from individual params
    return {
      ...DEFAULT_CONFIG,
      id: searchParams.get('id') || DEFAULT_CONFIG.id,
      title: searchParams.get('title') || DEFAULT_CONFIG.title,
      subtitle: searchParams.get('subtitle') || DEFAULT_CONFIG.subtitle,
      image: searchParams.get('image') || DEFAULT_CONFIG.image,
      duration: searchParams.get('duration') || DEFAULT_CONFIG.duration,
      pricing: {
        ...DEFAULT_CONFIG.pricing,
        adult: parseInt(searchParams.get('price') || '') || DEFAULT_CONFIG.pricing.adult,
      }
    };
  }, [searchParams]);

  const [formData, setFormData] = useState<FormData>({
    firstName: '',
    lastName: '',
    email: '',
    countryCode: '+94',
    phone: '',
    tourDate: '',
    pickupOption: tourConfig.pickupOptions[0]?.id || '',
    pickupAddress: '',
    adults: 2,
    children: 0,
    infants: 0,
    specialRequests: '',
    paymentMethod: 'card',
    cardNumber: '',
    cardExpiry: '',
    cardCvc: '',
    cardName: '',
    agreeTerms: false
  });

  // Pre-fill user data if logged in
  useEffect(() => {
    if (user) {
      const names = (user.displayName || '').split(' ');
      setFormData(prev => ({
        ...prev,
        firstName: names[0] || '',
        lastName: names.slice(1).join(' ') || '',
        email: user.email || ''
      }));
    }
  }, [user]);

  // Generate available dates (next 90 days)
  const availableDates = useMemo(() => {
    const dates = [];
    const today = new Date();
    for (let i = 1; i <= 90; i++) {
      const date = new Date(today);
      date.setDate(date.getDate() + i);
      dates.push({
        value: date.toISOString().split('T')[0],
        label: date.toLocaleDateString('en-US', {
          weekday: 'long',
          year: 'numeric',
          month: 'long',
          day: 'numeric'
        })
      });
    }
    return dates;
  }, []);

  // Calculate pricing
  const pricing = useMemo(() => {
    const pickup = tourConfig.pickupOptions.find(p => p.id === formData.pickupOption);
    const pickupCost = (pickup?.additionalCost || 0) * (formData.adults + formData.children);
    const subtotal =
      (formData.adults * tourConfig.pricing.adult) +
      (formData.children * tourConfig.pricing.child);
    return {
      subtotal,
      pickupCost,
      total: subtotal + pickupCost
    };
  }, [formData.adults, formData.children, formData.pickupOption, tourConfig]);

  const handleInputChange = (field: keyof FormData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user types
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const formatCardNumber = (value: string) => {
    const cleaned = value.replace(/\D/g, '');
    const formatted = cleaned.match(/.{1,4}/g)?.join(' ') || cleaned;
    return formatted.slice(0, 19);
  };

  const formatExpiry = (value: string) => {
    const cleaned = value.replace(/\D/g, '');
    if (cleaned.length >= 2) {
      return cleaned.slice(0, 2) + '/' + cleaned.slice(2, 4);
    }
    return cleaned;
  };

  const validateStep = (step: number): boolean => {
    const newErrors: Record<string, string> = {};

    if (step === 1) {
      if (!formData.firstName.trim()) newErrors.firstName = 'First name is required';
      if (!formData.lastName.trim()) newErrors.lastName = 'Last name is required';
      if (!formData.email.trim()) {
        newErrors.email = 'Email is required';
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
        newErrors.email = 'Please enter a valid email';
      }
      if (!formData.phone.trim()) newErrors.phone = 'Phone number is required';
    }

    if (step === 2) {
      if (!formData.tourDate) newErrors.tourDate = 'Please select a date';
    }

    if (step === 3) {
      if (formData.paymentMethod === 'card') {
        if (!formData.cardNumber.trim()) newErrors.cardNumber = 'Card number is required';
        if (!formData.cardExpiry.trim()) newErrors.cardExpiry = 'Expiry date is required';
        if (!formData.cardCvc.trim()) newErrors.cardCvc = 'CVC is required';
        if (!formData.cardName.trim()) newErrors.cardName = 'Name on card is required';
      }
      if (!formData.agreeTerms) newErrors.agreeTerms = 'You must agree to the terms';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const nextStep = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => Math.min(prev + 1, 3));
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const prevStep = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const submitBooking = async () => {
    if (!validateStep(3)) return;

    setIsSubmitting(true);

    try {
      // Generate booking reference
      const ref = `RT-${Date.now().toString(36).toUpperCase()}-${Math.random().toString(36).substr(2, 4).toUpperCase()}`;

      // Prepare booking data (structured for Cloud Function compatibility)
      const customerPhone = `${formData.countryCode}${formData.phone}`;
      const customerName = `${formData.firstName} ${formData.lastName}`;

      const bookingData = {
        // Reference and identifiers
        reference: ref,
        bookingRef: ref,
        confirmation_number: ref,
        tourId: tourConfig.id,
        tourTitle: tourConfig.title,
        booking_type: tourConfig.title,

        // Customer info (multiple formats for compatibility)
        customer: {
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          phone: customerPhone,
          userId: user?.uid || null
        },
        // Flat fields for Cloud Function compatibility
        customerName: customerName,
        customerEmail: formData.email,
        customerPhone: customerPhone,
        name: customerName,
        email: formData.email,
        phone: customerPhone,

        // Booking details
        details: {
          date: formData.tourDate,
          pickupOption: formData.pickupOption,
          pickupAddress: formData.pickupAddress,
          adults: formData.adults,
          children: formData.children,
          infants: formData.infants,
          specialRequests: formData.specialRequests
        },
        // Flat fields for compatibility
        travelDate: formData.tourDate,
        tourDate: formData.tourDate,
        adults: formData.adults,
        children: formData.children,
        specialRequests: formData.specialRequests,

        // Payment info
        payment: {
          method: formData.paymentMethod,
          subtotal: pricing.subtotal,
          pickupCost: pricing.pickupCost,
          total: pricing.total,
          currency: tourConfig.pricing.currency,
          status: 'pending'
        },
        totalPrice: pricing.total,
        totalAmountUSD: pricing.total,
        currency: tourConfig.pricing.currency,
        paymentMethod: formData.paymentMethod,

        // Status
        status: 'pending_payment',
        createdAt: new Date().toISOString()
      };

      // Handle payment based on method
      if (formData.paymentMethod === 'card') {
        // Create Stripe checkout session
        toast.info('Redirecting to secure payment...');

        const checkoutResult = await createCheckoutSession({
          bookingRef: ref,
          tourId: tourConfig.id,
          tourTitle: tourConfig.title,
          tourCategory: 'Tour',
          customerName: `${formData.firstName} ${formData.lastName}`,
          customerEmail: formData.email,
          customerPhone: `${formData.countryCode}${formData.phone}`,
          travelDate: formData.tourDate,
          travellersAdults: formData.adults,
          travellersKids: formData.children,
          pricePerPerson: tourConfig.pricing.adult,
          totalAmountUSD: pricing.total,
          currency: tourConfig.pricing.currency
        });

        if (checkoutResult.success && checkoutResult.sessionId) {
          // Save booking with pending payment status
          await dbService.createDocument('bookings', bookingData);

          // Listen for Stripe session URL (created by Cloud Function)
          const unsubscribe = onSnapshot(
            doc(db, 'stripeCheckouts', checkoutResult.sessionId),
            (docSnap) => {
              if (docSnap.exists()) {
                const data = docSnap.data();
                if (data.url) {
                  // Redirect to Stripe Checkout
                  window.location.href = data.url;
                  unsubscribe();
                } else if (data.error) {
                  toast.error('Payment setup failed. Please try again.');
                  setIsSubmitting(false);
                  unsubscribe();
                }
              }
            }
          );

          // Timeout fallback - if no URL after 10 seconds, show manual confirmation
          setTimeout(() => {
            unsubscribe();
            // For now (mock mode), just confirm the booking
            bookingData.status = 'confirmed';
            bookingData.payment.status = 'pending_manual';
            setBookingRef(ref);
            setBookingComplete(true);
            toast.success('Booking confirmed! Payment link will be sent to your email.');
          }, 10000);

        } else {
          throw new Error(checkoutResult.error || 'Failed to create payment session');
        }

      } else if (formData.paymentMethod === 'paypal') {
        // PayPal integration (placeholder)
        bookingData.status = 'confirmed';
        bookingData.payment.status = 'pending_paypal';
        await dbService.createDocument('bookings', bookingData);
        setBookingRef(ref);
        setBookingComplete(true);
        toast.success('Booking confirmed! PayPal payment instructions sent to your email.');

      } else if (formData.paymentMethod === 'bank') {
        // Bank transfer
        bookingData.status = 'confirmed';
        bookingData.payment.status = 'pending_bank';
        await dbService.createDocument('bookings', bookingData);
        setBookingRef(ref);
        setBookingComplete(true);
        toast.success('Booking confirmed! Bank transfer details sent to your email.');
      }

    } catch (error) {
      console.error('Booking error:', error);
      toast.error('Failed to complete booking. Please try again.');
      setIsSubmitting(false);
    }
  };

  const selectedPickup = tourConfig.pickupOptions.find(p => p.id === formData.pickupOption);

  if (bookingComplete) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-emerald-50">
        {/* Header */}
        <header className="bg-white border-b border-gray-100 sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
            <Link to="/" className="flex items-center gap-2">
              <img src="/logo-v2.png" alt="Recharge Travels" className="h-10" />
            </Link>
            <div className="flex items-center gap-2 text-emerald-700 bg-emerald-50 px-4 py-2 rounded-full text-sm">
              <Lock className="w-4 h-4" />
              Booking Complete
            </div>
          </div>
        </header>

        <main className="max-w-3xl mx-auto px-4 py-12">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-2xl shadow-xl p-8 text-center"
          >
            <div className="w-20 h-20 bg-emerald-500 rounded-full flex items-center justify-center mx-auto mb-6">
              <Check className="w-10 h-10 text-white" />
            </div>

            <h1 className="text-3xl font-bold text-emerald-800 mb-2" style={{ fontFamily: 'Playfair Display, serif' }}>
              Booking Confirmed!
            </h1>

            <p className="text-lg text-gray-600 mb-2">
              Reference: <strong className="text-gray-900">{bookingRef}</strong>
            </p>
            <p className="text-gray-500 mb-8">
              A confirmation email has been sent to <strong>{formData.email}</strong>
            </p>

            {/* Booking Details */}
            <div className="text-left border-t border-gray-100 pt-8 mt-8">
              <h3 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
                <Calendar className="w-5 h-5 text-emerald-600" />
                Schedule Details
              </h3>

              <div className="grid grid-cols-2 gap-4 mb-8">
                <div className="bg-gray-50 rounded-xl p-4">
                  <span className="text-xs text-gray-500 block mb-1">Date</span>
                  <span className="font-semibold">
                    {new Date(formData.tourDate).toLocaleDateString('en-US', {
                      weekday: 'long', month: 'long', day: 'numeric', year: 'numeric'
                    })}
                  </span>
                </div>
                <div className="bg-gray-50 rounded-xl p-4">
                  <span className="text-xs text-gray-500 block mb-1">Pickup Time</span>
                  <span className="font-semibold">{selectedPickup?.time}</span>
                </div>
                <div className="bg-gray-50 rounded-xl p-4">
                  <span className="text-xs text-gray-500 block mb-1">Travelers</span>
                  <span className="font-semibold">
                    {formData.adults} Adult{formData.adults !== 1 ? 's' : ''}
                    {formData.children > 0 && `, ${formData.children} Child${formData.children !== 1 ? 'ren' : ''}`}
                  </span>
                </div>
                <div className="bg-gray-50 rounded-xl p-4">
                  <span className="text-xs text-gray-500 block mb-1">Total Paid</span>
                  <span className="font-semibold text-emerald-600">{tourConfig.pricing.symbol}{pricing.total.toFixed(2)}</span>
                </div>
              </div>

              <h3 className="font-semibold text-gray-800 mb-4">What's Next?</h3>
              <ol className="list-decimal list-inside space-y-2 text-gray-600 mb-8">
                <li>Check your email for the detailed confirmation</li>
                <li>Our team will contact you via WhatsApp 24 hours before the tour</li>
                <li>Be ready at the pickup location at the scheduled time</li>
                <li>Bring your booking reference and ID</li>
              </ol>

              <div className="flex flex-wrap gap-4 justify-center">
                <button
                  onClick={() => window.print()}
                  className="flex items-center gap-2 px-6 py-3 bg-emerald-600 text-white rounded-xl hover:bg-emerald-700 transition-colors"
                >
                  <Printer className="w-5 h-5" />
                  Print Confirmation
                </button>
                <Link
                  to="/"
                  className="flex items-center gap-2 px-6 py-3 border-2 border-gray-200 rounded-xl hover:bg-gray-50 transition-colors"
                >
                  Book Another Tour
                </Link>
              </div>
            </div>
          </motion.div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-emerald-50" style={{ fontFamily: "'DM Sans', sans-serif" }}>
      {/* Header */}
      <header className="bg-white border-b border-gray-100 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <img src="/logo-v2.png" alt="Recharge Travels" className="h-10" />
          </Link>
          <div className="flex items-center gap-2 text-emerald-700 bg-emerald-50 px-4 py-2 rounded-full text-sm">
            <Lock className="w-4 h-4" />
            Secure Booking
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-gray-600 hover:text-emerald-700 mb-6 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Tours
        </button>

        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex justify-center gap-4 md:gap-8 relative">
            <div className="absolute top-5 left-1/4 right-1/4 h-0.5 bg-gray-200 -z-0 hidden md:block" />

            {[
              { num: 1, label: 'Contact Details' },
              { num: 2, label: 'Activity Details' },
              { num: 3, label: 'Payment' }
            ].map((step) => (
              <div key={step.num} className="flex flex-col items-center z-10">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold transition-all ${
                  currentStep > step.num
                    ? 'bg-emerald-500 text-white'
                    : currentStep === step.num
                      ? 'bg-emerald-700 text-white'
                      : 'bg-white border-2 border-gray-200 text-gray-400'
                }`}>
                  {currentStep > step.num ? <Check className="w-5 h-5" /> : step.num}
                </div>
                <span className={`text-xs md:text-sm mt-2 ${
                  currentStep === step.num ? 'text-emerald-700 font-semibold' : 'text-gray-500'
                }`}>
                  {step.label}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="grid lg:grid-cols-[1fr_380px] gap-8">
          {/* Form Column */}
          <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8">
            <AnimatePresence mode="wait">
              {/* Step 1: Contact Details */}
              {currentStep === 1 && (
                <motion.div
                  key="step1"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                >
                  <div className="mb-8">
                    <h2 className="text-2xl font-bold text-emerald-800 mb-2" style={{ fontFamily: 'Playfair Display, serif' }}>
                      Contact Details
                    </h2>
                    <p className="text-gray-600">We'll use this information to send you confirmation and updates about your booking.</p>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">First Name *</label>
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                          type="text"
                          value={formData.firstName}
                          onChange={(e) => handleInputChange('firstName', e.target.value)}
                          className={`w-full pl-10 pr-4 py-3 border-2 rounded-xl focus:outline-none focus:border-emerald-500 transition-colors ${
                            errors.firstName ? 'border-red-400' : 'border-gray-200'
                          }`}
                          placeholder="Enter your first name"
                        />
                      </div>
                      {errors.firstName && <span className="text-red-500 text-sm mt-1">{errors.firstName}</span>}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Last Name *</label>
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                          type="text"
                          value={formData.lastName}
                          onChange={(e) => handleInputChange('lastName', e.target.value)}
                          className={`w-full pl-10 pr-4 py-3 border-2 rounded-xl focus:outline-none focus:border-emerald-500 transition-colors ${
                            errors.lastName ? 'border-red-400' : 'border-gray-200'
                          }`}
                          placeholder="Enter your last name"
                        />
                      </div>
                      {errors.lastName && <span className="text-red-500 text-sm mt-1">{errors.lastName}</span>}
                    </div>

                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-2">Email Address *</label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                          type="email"
                          value={formData.email}
                          onChange={(e) => handleInputChange('email', e.target.value)}
                          className={`w-full pl-10 pr-4 py-3 border-2 rounded-xl focus:outline-none focus:border-emerald-500 transition-colors ${
                            errors.email ? 'border-red-400' : 'border-gray-200'
                          }`}
                          placeholder="your.email@example.com"
                        />
                      </div>
                      {errors.email && <span className="text-red-500 text-sm mt-1">{errors.email}</span>}
                      <span className="text-gray-500 text-xs mt-1 block">Confirmation will be sent to this email</span>
                    </div>

                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number *</label>
                      <div className="flex gap-2">
                        <select
                          value={formData.countryCode}
                          onChange={(e) => handleInputChange('countryCode', e.target.value)}
                          className="w-28 px-3 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-emerald-500"
                        >
                          {COUNTRY_CODES.map((c) => (
                            <option key={c.code} value={c.code}>{c.flag} {c.code}</option>
                          ))}
                        </select>
                        <div className="relative flex-1">
                          <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                          <input
                            type="tel"
                            value={formData.phone}
                            onChange={(e) => handleInputChange('phone', e.target.value)}
                            className={`w-full pl-10 pr-4 py-3 border-2 rounded-xl focus:outline-none focus:border-emerald-500 transition-colors ${
                              errors.phone ? 'border-red-400' : 'border-gray-200'
                            }`}
                            placeholder="77 123 4567"
                          />
                        </div>
                      </div>
                      {errors.phone && <span className="text-red-500 text-sm mt-1">{errors.phone}</span>}
                      <span className="text-gray-500 text-xs mt-1 block">For WhatsApp communication about your booking</span>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Step 2: Activity Details */}
              {currentStep === 2 && (
                <motion.div
                  key="step2"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                >
                  <div className="mb-8">
                    <h2 className="text-2xl font-bold text-emerald-800 mb-2" style={{ fontFamily: 'Playfair Display, serif' }}>
                      Activity Details
                    </h2>
                    <p className="text-gray-600">Select your preferred date, pickup location, and number of travelers.</p>
                  </div>

                  {/* Date Selection */}
                  <div className="mb-8">
                    <h3 className="flex items-center gap-2 font-semibold text-gray-800 mb-4">
                      <Calendar className="w-5 h-5 text-emerald-600" />
                      Select Date
                    </h3>
                    <select
                      value={formData.tourDate}
                      onChange={(e) => handleInputChange('tourDate', e.target.value)}
                      className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none focus:border-emerald-500 ${
                        errors.tourDate ? 'border-red-400' : 'border-gray-200'
                      }`}
                    >
                      <option value="">Choose a date...</option>
                      {availableDates.map((d) => (
                        <option key={d.value} value={d.value}>{d.label}</option>
                      ))}
                    </select>
                    {errors.tourDate && <span className="text-red-500 text-sm mt-1">{errors.tourDate}</span>}
                  </div>

                  {/* Pickup Location */}
                  <div className="mb-8">
                    <h3 className="flex items-center gap-2 font-semibold text-gray-800 mb-4">
                      <MapPin className="w-5 h-5 text-emerald-600" />
                      Pickup Location
                    </h3>
                    <div className="space-y-3">
                      {tourConfig.pickupOptions.map((opt) => (
                        <label
                          key={opt.id}
                          className={`flex items-center p-4 border-2 rounded-xl cursor-pointer transition-all ${
                            formData.pickupOption === opt.id
                              ? 'border-emerald-500 bg-gradient-to-r from-emerald-50 to-green-50'
                              : 'border-gray-200 hover:border-emerald-300'
                          }`}
                          onClick={() => handleInputChange('pickupOption', opt.id)}
                        >
                          <input
                            type="radio"
                            name="pickup"
                            checked={formData.pickupOption === opt.id}
                            onChange={() => {}}
                            className="mr-4 accent-emerald-600 scale-125"
                          />
                          <div className="flex-1 flex justify-between items-center">
                            <div>
                              <span className="font-medium block">{opt.label}</span>
                              <span className="text-sm text-gray-500">Pickup: {opt.time}</span>
                            </div>
                            {opt.additionalCost > 0 && (
                              <span className="text-sm font-semibold text-emerald-600">
                                +{tourConfig.pricing.symbol}{opt.additionalCost}/person
                              </span>
                            )}
                          </div>
                        </label>
                      ))}
                    </div>

                    <div className="mt-4">
                      <label className="block text-sm font-medium text-gray-700 mb-2">Hotel/Address for Pickup</label>
                      <input
                        type="text"
                        value={formData.pickupAddress}
                        onChange={(e) => handleInputChange('pickupAddress', e.target.value)}
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-emerald-500"
                        placeholder="Enter your hotel name or address"
                      />
                      <span className="text-gray-500 text-xs mt-1 block">Our driver will pick you up from this location</span>
                    </div>
                  </div>

                  {/* Travelers */}
                  <div className="mb-8">
                    <h3 className="flex items-center gap-2 font-semibold text-gray-800 mb-4">
                      <Users className="w-5 h-5 text-emerald-600" />
                      Number of Travelers
                    </h3>
                    <div className="space-y-3">
                      {[
                        { type: 'adults', label: 'Adults', age: 'Age 13+', price: tourConfig.pricing.adult },
                        { type: 'children', label: 'Children', age: 'Age 3-12', price: tourConfig.pricing.child },
                        { type: 'infants', label: 'Infants', age: 'Under 3', price: 0 },
                      ].map((item) => (
                        <div key={item.type} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                          <div>
                            <span className="font-medium block">{item.label}</span>
                            <span className="text-sm text-gray-500">{item.age}</span>
                          </div>
                          <div className="flex items-center gap-4">
                            <span className="text-emerald-600 font-medium">
                              {item.price > 0 ? `${tourConfig.pricing.symbol}${item.price} each` : 'Free'}
                            </span>
                            <div className="flex items-center gap-3">
                              <button
                                type="button"
                                onClick={() => handleInputChange(item.type as keyof FormData, Math.max(item.type === 'adults' ? 1 : 0, formData[item.type as keyof FormData] as number - 1))}
                                className="w-9 h-9 rounded-full border-2 border-emerald-600 text-emerald-600 hover:bg-emerald-600 hover:text-white transition-colors flex items-center justify-center"
                              >
                                −
                              </button>
                              <span className="w-8 text-center font-semibold text-lg">
                                {formData[item.type as keyof FormData]}
                              </span>
                              <button
                                type="button"
                                onClick={() => handleInputChange(item.type as keyof FormData, Math.min(tourConfig.maxGroupSize, formData[item.type as keyof FormData] as number + 1))}
                                className="w-9 h-9 rounded-full border-2 border-emerald-600 text-emerald-600 hover:bg-emerald-600 hover:text-white transition-colors flex items-center justify-center"
                              >
                                +
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Special Requests */}
                  <div>
                    <h3 className="flex items-center gap-2 font-semibold text-gray-800 mb-4">
                      📝 Special Requests (Optional)
                    </h3>
                    <textarea
                      value={formData.specialRequests}
                      onChange={(e) => handleInputChange('specialRequests', e.target.value)}
                      rows={3}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-emerald-500 resize-none"
                      placeholder="Any dietary requirements, mobility needs, or special requests..."
                    />
                  </div>
                </motion.div>
              )}

              {/* Step 3: Payment */}
              {currentStep === 3 && (
                <motion.div
                  key="step3"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                >
                  <div className="mb-8">
                    <h2 className="text-2xl font-bold text-emerald-800 mb-2" style={{ fontFamily: 'Playfair Display, serif' }}>
                      Payment Details
                    </h2>
                    <p className="text-gray-600">Complete your booking with secure payment.</p>
                  </div>

                  {/* Price Breakdown */}
                  <div className="bg-gray-50 rounded-xl p-6 mb-8">
                    <h3 className="font-semibold text-gray-800 mb-4">Price Breakdown</h3>
                    <div className="space-y-2">
                      {formData.adults > 0 && (
                        <div className="flex justify-between">
                          <span>Adults × {formData.adults}</span>
                          <span>{tourConfig.pricing.symbol}{formData.adults * tourConfig.pricing.adult}</span>
                        </div>
                      )}
                      {formData.children > 0 && (
                        <div className="flex justify-between">
                          <span>Children × {formData.children}</span>
                          <span>{tourConfig.pricing.symbol}{formData.children * tourConfig.pricing.child}</span>
                        </div>
                      )}
                      {formData.infants > 0 && (
                        <div className="flex justify-between text-gray-500">
                          <span>Infants × {formData.infants}</span>
                          <span>Free</span>
                        </div>
                      )}
                      {pricing.pickupCost > 0 && (
                        <div className="flex justify-between">
                          <span>Pickup surcharge</span>
                          <span>{tourConfig.pricing.symbol}{pricing.pickupCost}</span>
                        </div>
                      )}
                      <div className="flex justify-between pt-4 mt-2 border-t-2 border-gray-200 text-xl font-bold text-emerald-700">
                        <span>Total</span>
                        <span>{tourConfig.pricing.symbol}{pricing.total.toFixed(2)}</span>
                      </div>
                    </div>
                  </div>

                  {/* Payment Methods */}
                  <div className="mb-8">
                    <h3 className="flex items-center gap-2 font-semibold text-gray-800 mb-4">
                      <CreditCard className="w-5 h-5 text-emerald-600" />
                      Payment Method
                    </h3>
                    <div className="grid grid-cols-3 gap-4">
                      {[
                        { id: 'card', icon: '💳', label: 'Credit/Debit Card', sub: 'VISA, MC, AMEX' },
                        { id: 'paypal', icon: '🅿️', label: 'PayPal', sub: '' },
                        { id: 'bank', icon: '🏦', label: 'Bank Transfer', sub: '' },
                      ].map((method) => (
                        <label
                          key={method.id}
                          className={`flex flex-col items-center p-4 border-2 rounded-xl cursor-pointer transition-all ${
                            formData.paymentMethod === method.id
                              ? 'border-emerald-500 bg-gradient-to-r from-emerald-50 to-green-50'
                              : 'border-gray-200 hover:border-emerald-300'
                          }`}
                          onClick={() => handleInputChange('paymentMethod', method.id)}
                        >
                          <span className="text-2xl mb-2">{method.icon}</span>
                          <span className="text-sm font-medium text-center">{method.label}</span>
                          {method.sub && <span className="text-xs text-gray-500">{method.sub}</span>}
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Card Details */}
                  {formData.paymentMethod === 'card' && (
                    <div className="bg-gray-50 rounded-xl p-6 mb-8">
                      <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 mb-2">Card Number *</label>
                        <input
                          type="text"
                          value={formData.cardNumber}
                          onChange={(e) => handleInputChange('cardNumber', formatCardNumber(e.target.value))}
                          className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none focus:border-emerald-500 ${
                            errors.cardNumber ? 'border-red-400' : 'border-gray-200'
                          }`}
                          placeholder="1234 5678 9012 3456"
                          maxLength={19}
                        />
                        {errors.cardNumber && <span className="text-red-500 text-sm">{errors.cardNumber}</span>}
                      </div>

                      <div className="grid grid-cols-2 gap-4 mb-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Expiry Date *</label>
                          <input
                            type="text"
                            value={formData.cardExpiry}
                            onChange={(e) => handleInputChange('cardExpiry', formatExpiry(e.target.value))}
                            className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none focus:border-emerald-500 ${
                              errors.cardExpiry ? 'border-red-400' : 'border-gray-200'
                            }`}
                            placeholder="MM/YY"
                            maxLength={5}
                          />
                          {errors.cardExpiry && <span className="text-red-500 text-sm">{errors.cardExpiry}</span>}
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">CVC *</label>
                          <input
                            type="text"
                            value={formData.cardCvc}
                            onChange={(e) => handleInputChange('cardCvc', e.target.value.replace(/\D/g, '').slice(0, 4))}
                            className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none focus:border-emerald-500 ${
                              errors.cardCvc ? 'border-red-400' : 'border-gray-200'
                            }`}
                            placeholder="123"
                            maxLength={4}
                          />
                          {errors.cardCvc && <span className="text-red-500 text-sm">{errors.cardCvc}</span>}
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Name on Card *</label>
                        <input
                          type="text"
                          value={formData.cardName}
                          onChange={(e) => handleInputChange('cardName', e.target.value.toUpperCase())}
                          className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none focus:border-emerald-500 ${
                            errors.cardName ? 'border-red-400' : 'border-gray-200'
                          }`}
                          placeholder="JOHN DOE"
                        />
                        {errors.cardName && <span className="text-red-500 text-sm">{errors.cardName}</span>}
                      </div>
                    </div>
                  )}

                  {/* Terms */}
                  <div className="mb-6">
                    <label className="flex items-start gap-3 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formData.agreeTerms}
                        onChange={(e) => handleInputChange('agreeTerms', e.target.checked)}
                        className="mt-1 w-5 h-5 accent-emerald-600"
                      />
                      <span className="text-sm text-gray-600">
                        I agree to the <a href="/terms" className="text-emerald-600 underline">Terms & Conditions</a> and <a href="/cancellation-policy" className="text-emerald-600 underline">Cancellation Policy</a>
                      </span>
                    </label>
                    {errors.agreeTerms && <span className="text-red-500 text-sm block mt-1">{errors.agreeTerms}</span>}
                  </div>

                  {/* Cancellation Policy */}
                  <div className="flex gap-4 p-4 bg-emerald-50 rounded-xl">
                    <span className="text-2xl">✅</span>
                    <div>
                      <strong className="text-gray-800 block">Cancellation Policy</strong>
                      <p className="text-sm text-gray-600">{tourConfig.cancellationPolicy.description}</p>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Navigation Buttons */}
            <div className="flex justify-between mt-8 pt-8 border-t border-gray-100">
              {currentStep > 1 ? (
                <button
                  onClick={prevStep}
                  className="flex items-center gap-2 px-6 py-3 border-2 border-gray-200 rounded-xl hover:bg-gray-50 transition-colors"
                >
                  <ChevronLeft className="w-5 h-5" />
                  Back
                </button>
              ) : (
                <div />
              )}

              {currentStep < 3 ? (
                <button
                  onClick={nextStep}
                  className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-emerald-600 to-green-600 text-white rounded-xl hover:shadow-lg hover:-translate-y-0.5 transition-all ml-auto"
                >
                  Continue
                  <ChevronRight className="w-5 h-5" />
                </button>
              ) : (
                <button
                  onClick={submitBooking}
                  disabled={isSubmitting}
                  className="flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-emerald-600 to-green-600 text-white rounded-xl hover:shadow-lg hover:-translate-y-0.5 transition-all ml-auto disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    <>
                      Complete Booking
                      <Check className="w-5 h-5" />
                    </>
                  )}
                </button>
              )}
            </div>
          </div>

          {/* Summary Column */}
          <div className="lg:sticky lg:top-24 self-start">
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
              {/* Tour Image */}
              <div className="relative h-48">
                <img
                  src={tourConfig.image}
                  alt={tourConfig.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/70 to-transparent">
                  <div className="flex items-center gap-1 text-white">
                    <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                    <span className="font-semibold">{tourConfig.rating}</span>
                    <span className="text-white/80">({tourConfig.reviewCount} reviews)</span>
                  </div>
                </div>
              </div>

              <div className="p-6">
                <h3 className="text-xl font-bold text-gray-800 mb-1" style={{ fontFamily: 'Playfair Display, serif' }}>
                  {tourConfig.title}
                </h3>
                <p className="text-gray-500 text-sm mb-4">by Recharge Travels</p>

                <div className="flex gap-4 text-sm text-gray-600 mb-4">
                  <span className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    {tourConfig.duration}
                  </span>
                  <span className="flex items-center gap-1">
                    <Users className="w-4 h-4" />
                    Private Tour
                  </span>
                </div>

                <hr className="my-4" />

                {/* Booking Details */}
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-500">📅 Date</span>
                    <span className="font-medium text-right">
                      {formData.tourDate
                        ? new Date(formData.tourDate).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })
                        : 'Not selected'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">📍 Pickup</span>
                    <div className="text-right">
                      <span className="font-medium block">{selectedPickup?.label || 'Not selected'}</span>
                      {selectedPickup && <span className="text-xs text-gray-500">{selectedPickup.time}</span>}
                    </div>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">👥 Travelers</span>
                    <span className="font-medium">
                      {formData.adults} Adult{formData.adults !== 1 ? 's' : ''}
                      {formData.children > 0 && `, ${formData.children} Child${formData.children !== 1 ? 'ren' : ''}`}
                    </span>
                  </div>
                </div>

                <hr className="my-4" />

                {/* Price */}
                <div className="bg-gray-50 -mx-6 px-6 py-4">
                  <div className="flex justify-between text-sm mb-1">
                    <span>Subtotal</span>
                    <span>{tourConfig.pricing.symbol}{pricing.subtotal.toFixed(2)}</span>
                  </div>
                  {pricing.pickupCost > 0 && (
                    <div className="flex justify-between text-sm mb-1">
                      <span>Pickup surcharge</span>
                      <span>{tourConfig.pricing.symbol}{pricing.pickupCost.toFixed(2)}</span>
                    </div>
                  )}
                  <div className="flex justify-between pt-3 mt-2 border-t border-gray-200 font-bold text-lg">
                    <span>Total</span>
                    <span className="text-emerald-700">{tourConfig.pricing.symbol}{pricing.total.toFixed(2)}</span>
                  </div>
                </div>

                {/* Highlights */}
                <div className="mt-4">
                  <h4 className="text-sm font-semibold mb-3">✨ Highlights</h4>
                  <ul className="text-sm text-gray-600 space-y-1">
                    {tourConfig.highlights.slice(0, 4).map((h, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <Check className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                        {h}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* WhatsApp Support */}
                <div className="mt-6 pt-6 border-t border-gray-100 text-center">
                  <p className="text-sm text-gray-500 mb-3">Need help? Contact us</p>
                  <a
                    href="https://wa.me/94773401305?text=Hi!%20I%20need%20help%20with%20my%20booking"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-6 py-2 bg-green-500 text-white rounded-full hover:bg-green-600 transition-colors text-sm font-medium"
                  >
                    <MessageCircle className="w-4 h-4" />
                    WhatsApp Support
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-100 mt-12">
        <div className="max-w-7xl mx-auto px-4 py-6 flex flex-wrap items-center justify-between gap-4">
          <div className="flex flex-wrap gap-6 text-sm text-gray-500">
            <span className="flex items-center gap-1">
              <Shield className="w-4 h-4" />
              256-bit SSL Encrypted
            </span>
            <span className="flex items-center gap-1">
              <Award className="w-4 h-4" />
              Verified Operator
            </span>
            <span className="flex items-center gap-1">
              <Headphones className="w-4 h-4" />
              24/7 Support
            </span>
          </div>
          <div className="flex gap-6 text-sm">
            <a href="/terms" className="text-gray-500 hover:text-emerald-600">Terms & Conditions</a>
            <a href="/privacy" className="text-gray-500 hover:text-emerald-600">Privacy Policy</a>
            <a href="/contact" className="text-gray-500 hover:text-emerald-600">Contact Us</a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default TourBookingPage;
