import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import {
  Leaf, Calendar, Users, Phone, Mail, User,
  CheckCircle, ArrowRight, ArrowLeft, Clock,
  Shield, MessageSquare, CreditCard, Check, Home,
  Printer, MapPin, Coffee, Mountain
} from 'lucide-react';

// ============================================
// TEA TRAILS BOOKING CONFIGURATION
// ============================================
const PICKUP_OPTIONS = [
  { id: 'colombo', label: 'Pickup from Colombo', time: '5:30 AM', additionalCost: 0 },
  { id: 'kandy', label: 'Pickup from Kandy', time: '6:30 AM', additionalCost: 0 },
  { id: 'airport', label: 'Airport Pickup (BIA)', time: '4:30 AM', additionalCost: 35 },
  { id: 'negombo', label: 'Pickup from Negombo', time: '5:00 AM', additionalCost: 20 },
  { id: 'nuwara-eliya', label: 'Pickup from Nuwara Eliya', time: '7:00 AM', additionalCost: 0 },
];

const TEA_TRAIL_ROUTES = [
  { id: 'kandy-hatton', label: 'Kandy → Hatton Heritage Line', duration: '1 day' },
  { id: 'nuwara-eliya-loop', label: 'Nuwara Eliya Tea Loop', duration: '½ day' },
  { id: 'lipton-seat', label: "Haputale → Lipton's Seat Trail", duration: '4 hours' },
];

const HIGHLIGHTS = [
  'Walk through emerald-green tea plantations',
  'Visit authentic 19th-century tea factories',
  'Learn tea plucking from local estate workers',
  'Premium Ceylon tea tasting included',
  'Free cancellation up to 48 hours before',
];

// ============================================
// TYPES
// ============================================
interface FormData {
  // Step 1
  firstName: string;
  lastName: string;
  email: string;
  countryCode: string;
  phone: string;
  // Step 2
  tourDate: string;
  pickupOption: string;
  pickupAddress: string;
  selectedRoute: string;
  adults: number;
  children: number;
  infants: number;
  teaPreferences: string[];
  specialRequests: string;
  // Step 3
  paymentMethod: 'card' | 'paypal' | 'bank';
  cardNumber: string;
  cardExpiry: string;
  cardCvc: string;
  cardName: string;
  agreeTerms: boolean;
}

// ============================================
// COMPONENT
// ============================================
const TeaTrailsBooking: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  // Get package info from URL
  const packageTitle = searchParams.get('package') || 'Ceylon Tea Trail Experience';
  const packagePrice = parseInt(searchParams.get('price') || '299');
  const packageDuration = searchParams.get('duration') || '3 Days';
  const packageImage = 'https://images.unsplash.com/photo-1606820854416-439b3305ff39?w=800&auto=format&fit=crop';

  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [bookingRef, setBookingRef] = useState('');
  const [errors, setErrors] = useState<Record<string, boolean>>({});

  const [formData, setFormData] = useState<FormData>({
    firstName: '',
    lastName: '',
    email: '',
    countryCode: '+94',
    phone: '',
    tourDate: '',
    pickupOption: 'kandy',
    pickupAddress: '',
    selectedRoute: 'kandy-hatton',
    adults: 2,
    children: 0,
    infants: 0,
    teaPreferences: [],
    specialRequests: '',
    paymentMethod: 'card',
    cardNumber: '',
    cardExpiry: '',
    cardCvc: '',
    cardName: '',
    agreeTerms: false,
  });

  // Generate available dates
  const availableDates = React.useMemo(() => {
    const dates = [];
    const today = new Date();
    for (let i = 2; i <= 90; i++) {
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
  const calculateTotal = () => {
    const pickup = PICKUP_OPTIONS.find(p => p.id === formData.pickupOption);
    const pickupCost = (pickup?.additionalCost || 0) * (formData.adults + formData.children);
    const basePrice = packagePrice || 299;
    const adultPrice = basePrice;
    const childPrice = Math.round(basePrice * 0.5);

    const subtotal = (formData.adults * adultPrice) + (formData.children * childPrice);
    return {
      adultPrice,
      childPrice,
      subtotal,
      pickupCost,
      total: subtotal + pickupCost
    };
  };

  const pricing = calculateTotal();

  // Update form data
  const updateField = (field: keyof FormData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: false }));
    }
  };

  const updateCount = (type: 'adults' | 'children' | 'infants', delta: number) => {
    const min = type === 'adults' ? 1 : 0;
    const max = 10;
    const newVal = Math.max(min, Math.min(max, formData[type] + delta));
    updateField(type, newVal);
  };

  // Format card number
  const formatCardNumber = (value: string) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    const matches = v.match(/\d{4,16}/g);
    const match = matches && matches[0] || '';
    const parts = [];
    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }
    return parts.length ? parts.join(' ') : value;
  };

  // Format expiry
  const formatExpiry = (value: string) => {
    const v = value.replace(/\D/g, '');
    if (v.length >= 2) {
      return v.substring(0, 2) + '/' + v.substring(2, 4);
    }
    return v;
  };

  // Validation
  const validateStep = (step: number): boolean => {
    const newErrors: Record<string, boolean> = {};

    if (step === 1) {
      if (!formData.firstName.trim()) newErrors.firstName = true;
      if (!formData.lastName.trim()) newErrors.lastName = true;
      if (!formData.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) newErrors.email = true;
      if (!formData.phone.trim()) newErrors.phone = true;
    }

    if (step === 2) {
      if (!formData.tourDate) newErrors.tourDate = true;
    }

    if (step === 3) {
      if (formData.paymentMethod === 'card') {
        if (!formData.cardNumber.trim()) newErrors.cardNumber = true;
        if (!formData.cardExpiry.trim()) newErrors.cardExpiry = true;
        if (!formData.cardCvc.trim()) newErrors.cardCvc = true;
        if (!formData.cardName.trim()) newErrors.cardName = true;
      }
      if (!formData.agreeTerms) newErrors.agreeTerms = true;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Navigation
  const nextStep = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => prev + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const prevStep = () => {
    setCurrentStep(prev => prev - 1);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Submit
  const submitBooking = async () => {
    if (!validateStep(3)) return;

    setIsSubmitting(true);
    await new Promise(resolve => setTimeout(resolve, 2000));

    const ref = `TEA-${Date.now().toString(36).toUpperCase()}-${Math.random().toString(36).substr(2, 4).toUpperCase()}`;
    setBookingRef(ref);
    setCurrentStep(4); // Confirmation
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setIsSubmitting(false);
  };

  // Get pickup info
  const selectedPickup = PICKUP_OPTIONS.find(p => p.id === formData.pickupOption);
  const selectedRoute = TEA_TRAIL_ROUTES.find(r => r.id === formData.selectedRoute);

  // Travelers text
  const getTravelersText = () => {
    let text = `${formData.adults} Adult${formData.adults !== 1 ? 's' : ''}`;
    if (formData.children > 0) text += `, ${formData.children} Child${formData.children !== 1 ? 'ren' : ''}`;
    if (formData.infants > 0) text += `, ${formData.infants} Infant${formData.infants !== 1 ? 's' : ''}`;
    return text;
  };

  return (
    <div className="min-h-screen" style={{
      fontFamily: "'DM Sans', -apple-system, BlinkMacSystemFont, sans-serif",
      background: 'linear-gradient(135deg, #f5f7f5 0%, #e8f0e8 100%)',
      color: '#1a2e35'
    }}>
      <Helmet>
        <title>Book {packageTitle} - Recharge Travels</title>
      </Helmet>

      {/* Header */}
      <header className="bg-white border-b border-gray-100 sticky top-0 z-50">
        <div className="max-w-[1200px] mx-auto px-6 py-4 flex justify-between items-center">
          <Link to="/" className="flex items-center gap-2 font-bold text-xl text-[#2d5a27] no-underline">
            <span className="text-2xl">🍃</span>
            <span>Recharge Travels</span>
          </Link>
          <div className="flex items-center gap-2 text-sm text-[#2d5a27] bg-[#e8f5e9] px-4 py-2 rounded-full">
            <Shield className="w-4 h-4" />
            Secure Booking
          </div>
        </div>
      </header>

      <main className="max-w-[1200px] mx-auto px-6 py-8">
        {/* Progress Steps */}
        {currentStep < 4 && (
          <div className="mb-8">
            <div className="flex justify-center gap-4 relative">
              {/* Progress Line */}
              <div className="absolute top-5 left-1/4 right-1/4 h-0.5 bg-gray-200 -z-0" />

              {[
                { num: 1, label: 'Contact Details' },
                { num: 2, label: 'Tour Details' },
                { num: 3, label: 'Payment' }
              ].map(step => (
                <div key={step.num} className="flex flex-col items-center gap-2 z-10 flex-1 max-w-[200px]">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold transition-all
                    ${currentStep === step.num ? 'bg-[#2d5a27] text-white' :
                      currentStep > step.num ? 'bg-green-500 text-white' : 'bg-white border-2 border-gray-200 text-gray-400'}`}
                  >
                    {currentStep > step.num ? <Check className="w-5 h-5" /> : step.num}
                  </div>
                  <span className={`text-sm text-center ${currentStep === step.num ? 'text-[#2d5a27] font-semibold' : 'text-gray-500'}`}>
                    {step.label}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-8 items-start">
          {/* Form Column */}
          <div className="bg-white rounded-2xl p-8 shadow-lg">
            {/* STEP 1: Contact Details */}
            {currentStep === 1 && (
              <div className="animate-fadeIn">
                <div className="mb-8">
                  <h2 className="text-2xl font-bold text-[#2d5a27] mb-2" style={{ fontFamily: "'Playfair Display', serif" }}>
                    Contact Details
                  </h2>
                  <p className="text-gray-500">We'll use this information to send you confirmation and updates.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* First Name */}
                  <div>
                    <label className="block text-sm font-medium mb-2">First Name *</label>
                    <input
                      type="text"
                      value={formData.firstName}
                      onChange={e => updateField('firstName', e.target.value)}
                      placeholder="Enter your first name"
                      className={`w-full px-4 py-3 border-2 rounded-xl text-base transition-all focus:outline-none focus:border-[#2d5a27] focus:ring-2 focus:ring-[#2d5a27]/10
                        ${errors.firstName ? 'border-red-500' : 'border-gray-200'}`}
                    />
                    {errors.firstName && <span className="text-red-500 text-sm mt-1 block">First name is required</span>}
                  </div>

                  {/* Last Name */}
                  <div>
                    <label className="block text-sm font-medium mb-2">Last Name *</label>
                    <input
                      type="text"
                      value={formData.lastName}
                      onChange={e => updateField('lastName', e.target.value)}
                      placeholder="Enter your last name"
                      className={`w-full px-4 py-3 border-2 rounded-xl text-base transition-all focus:outline-none focus:border-[#2d5a27] focus:ring-2 focus:ring-[#2d5a27]/10
                        ${errors.lastName ? 'border-red-500' : 'border-gray-200'}`}
                    />
                    {errors.lastName && <span className="text-red-500 text-sm mt-1 block">Last name is required</span>}
                  </div>

                  {/* Email */}
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium mb-2">Email Address *</label>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={e => updateField('email', e.target.value)}
                      placeholder="your.email@example.com"
                      className={`w-full px-4 py-3 border-2 rounded-xl text-base transition-all focus:outline-none focus:border-[#2d5a27] focus:ring-2 focus:ring-[#2d5a27]/10
                        ${errors.email ? 'border-red-500' : 'border-gray-200'}`}
                    />
                    {errors.email && <span className="text-red-500 text-sm mt-1 block">Please enter a valid email</span>}
                    <span className="text-gray-400 text-sm mt-1 block">Confirmation will be sent to this email</span>
                  </div>

                  {/* Phone */}
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium mb-2">Phone Number *</label>
                    <div className="flex gap-2">
                      <select
                        value={formData.countryCode}
                        onChange={e => updateField('countryCode', e.target.value)}
                        className="w-28 px-3 py-3 border-2 border-gray-200 rounded-xl text-base focus:outline-none focus:border-[#2d5a27]"
                      >
                        <option value="+94">+94</option>
                        <option value="+1">+1</option>
                        <option value="+44">+44</option>
                        <option value="+61">+61</option>
                        <option value="+49">+49</option>
                        <option value="+91">+91</option>
                      </select>
                      <input
                        type="tel"
                        value={formData.phone}
                        onChange={e => updateField('phone', e.target.value)}
                        placeholder="77 123 4567"
                        className={`flex-1 px-4 py-3 border-2 rounded-xl text-base transition-all focus:outline-none focus:border-[#2d5a27] focus:ring-2 focus:ring-[#2d5a27]/10
                          ${errors.phone ? 'border-red-500' : 'border-gray-200'}`}
                      />
                    </div>
                    {errors.phone && <span className="text-red-500 text-sm mt-1 block">Phone number is required</span>}
                    <span className="text-gray-400 text-sm mt-1 block">For WhatsApp communication about your booking</span>
                  </div>
                </div>
              </div>
            )}

            {/* STEP 2: Tour Details */}
            {currentStep === 2 && (
              <div className="animate-fadeIn">
                <div className="mb-8">
                  <h2 className="text-2xl font-bold text-[#2d5a27] mb-2" style={{ fontFamily: "'Playfair Display', serif" }}>
                    Tour Details
                  </h2>
                  <p className="text-gray-500">Select your preferred dates and customize your tea trail experience.</p>
                </div>

                {/* Date Selection */}
                <div className="mb-8">
                  <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                    <Calendar className="w-5 h-5 text-[#2d5a27]" /> Select Tour Date
                  </h3>
                  <select
                    value={formData.tourDate}
                    onChange={e => updateField('tourDate', e.target.value)}
                    className={`w-full px-4 py-3 border-2 rounded-xl text-base focus:outline-none focus:border-[#2d5a27]
                      ${errors.tourDate ? 'border-red-500' : 'border-gray-200'}`}
                  >
                    <option value="">Choose a date...</option>
                    {availableDates.map(date => (
                      <option key={date.value} value={date.value}>{date.label}</option>
                    ))}
                  </select>
                  {errors.tourDate && <span className="text-red-500 text-sm mt-1 block">Please select a date</span>}
                </div>

                {/* Tea Trail Route */}
                <div className="mb-8">
                  <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                    <Mountain className="w-5 h-5 text-[#2d5a27]" /> Select Tea Trail Route
                  </h3>
                  <div className="flex flex-col gap-3">
                    {TEA_TRAIL_ROUTES.map(route => (
                      <label
                        key={route.id}
                        onClick={() => updateField('selectedRoute', route.id)}
                        className={`flex items-center p-4 border-2 rounded-xl cursor-pointer transition-all
                          ${formData.selectedRoute === route.id
                            ? 'border-[#2d5a27] bg-gradient-to-r from-[#e8f5e9] to-[#f1f8f4]'
                            : 'border-gray-200 hover:border-[#2d5a27] hover:bg-gray-50'}`}
                      >
                        <input
                          type="radio"
                          name="route"
                          checked={formData.selectedRoute === route.id}
                          onChange={() => {}}
                          className="mr-4 w-5 h-5 accent-[#2d5a27]"
                        />
                        <div className="flex-1">
                          <span className="font-medium block">{route.label}</span>
                          <span className="text-sm text-gray-500">Duration: {route.duration}</span>
                        </div>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Pickup Location */}
                <div className="mb-8">
                  <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                    <MapPin className="w-5 h-5 text-[#2d5a27]" /> Pickup Location
                  </h3>
                  <div className="flex flex-col gap-3">
                    {PICKUP_OPTIONS.map(option => (
                      <label
                        key={option.id}
                        onClick={() => updateField('pickupOption', option.id)}
                        className={`flex items-center p-4 border-2 rounded-xl cursor-pointer transition-all
                          ${formData.pickupOption === option.id
                            ? 'border-[#2d5a27] bg-gradient-to-r from-[#e8f5e9] to-[#f1f8f4]'
                            : 'border-gray-200 hover:border-[#2d5a27] hover:bg-gray-50'}`}
                      >
                        <input
                          type="radio"
                          name="pickup"
                          checked={formData.pickupOption === option.id}
                          onChange={() => {}}
                          className="mr-4 w-5 h-5 accent-[#2d5a27]"
                        />
                        <div className="flex-1 flex justify-between items-center">
                          <div>
                            <span className="font-medium block">{option.label}</span>
                            <span className="text-sm text-gray-500">Pickup: {option.time}</span>
                          </div>
                          {option.additionalCost > 0 && (
                            <span className="text-sm text-[#2d5a27] font-semibold">+${option.additionalCost}/person</span>
                          )}
                        </div>
                      </label>
                    ))}
                  </div>

                  <div className="mt-4">
                    <label className="block text-sm font-medium mb-2">Hotel/Address for Pickup</label>
                    <input
                      type="text"
                      value={formData.pickupAddress}
                      onChange={e => updateField('pickupAddress', e.target.value)}
                      placeholder="Enter your hotel name or address"
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-[#2d5a27]"
                    />
                    <span className="text-gray-400 text-sm mt-1 block">Our driver will pick you up from this location</span>
                  </div>
                </div>

                {/* Number of Guests */}
                <div className="mb-8">
                  <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                    <Users className="w-5 h-5 text-[#2d5a27]" /> Number of Guests
                  </h3>
                  <div className="flex flex-col gap-3">
                    {/* Adults */}
                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                      <div>
                        <span className="font-medium block">Adults</span>
                        <span className="text-sm text-gray-500">Age 13+</span>
                      </div>
                      <span className="text-[#2d5a27] font-medium mr-6">${pricing.adultPrice} each</span>
                      <div className="flex items-center gap-3">
                        <button
                          type="button"
                          onClick={() => updateCount('adults', -1)}
                          disabled={formData.adults <= 1}
                          className="w-9 h-9 rounded-full border-2 border-[#2d5a27] bg-white text-[#2d5a27] text-xl flex items-center justify-center hover:bg-[#2d5a27] hover:text-white disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                        >
                          -
                        </button>
                        <span className="w-8 text-center font-semibold text-lg">{formData.adults}</span>
                        <button
                          type="button"
                          onClick={() => updateCount('adults', 1)}
                          className="w-9 h-9 rounded-full border-2 border-[#2d5a27] bg-white text-[#2d5a27] text-xl flex items-center justify-center hover:bg-[#2d5a27] hover:text-white transition-all"
                        >
                          +
                        </button>
                      </div>
                    </div>

                    {/* Children */}
                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                      <div>
                        <span className="font-medium block">Children</span>
                        <span className="text-sm text-gray-500">Age 3-12</span>
                      </div>
                      <span className="text-[#2d5a27] font-medium mr-6">${pricing.childPrice} each</span>
                      <div className="flex items-center gap-3">
                        <button
                          type="button"
                          onClick={() => updateCount('children', -1)}
                          disabled={formData.children <= 0}
                          className="w-9 h-9 rounded-full border-2 border-[#2d5a27] bg-white text-[#2d5a27] text-xl flex items-center justify-center hover:bg-[#2d5a27] hover:text-white disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                        >
                          -
                        </button>
                        <span className="w-8 text-center font-semibold text-lg">{formData.children}</span>
                        <button
                          type="button"
                          onClick={() => updateCount('children', 1)}
                          className="w-9 h-9 rounded-full border-2 border-[#2d5a27] bg-white text-[#2d5a27] text-xl flex items-center justify-center hover:bg-[#2d5a27] hover:text-white transition-all"
                        >
                          +
                        </button>
                      </div>
                    </div>

                    {/* Infants */}
                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                      <div>
                        <span className="font-medium block">Infants</span>
                        <span className="text-sm text-gray-500">Under 3</span>
                      </div>
                      <span className="text-[#2d5a27] font-medium mr-6">Free</span>
                      <div className="flex items-center gap-3">
                        <button
                          type="button"
                          onClick={() => updateCount('infants', -1)}
                          disabled={formData.infants <= 0}
                          className="w-9 h-9 rounded-full border-2 border-[#2d5a27] bg-white text-[#2d5a27] text-xl flex items-center justify-center hover:bg-[#2d5a27] hover:text-white disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                        >
                          -
                        </button>
                        <span className="w-8 text-center font-semibold text-lg">{formData.infants}</span>
                        <button
                          type="button"
                          onClick={() => updateCount('infants', 1)}
                          className="w-9 h-9 rounded-full border-2 border-[#2d5a27] bg-white text-[#2d5a27] text-xl flex items-center justify-center hover:bg-[#2d5a27] hover:text-white transition-all"
                        >
                          +
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Tea Preferences */}
                <div className="mb-8">
                  <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                    <Coffee className="w-5 h-5 text-[#2d5a27]" /> Tea Preferences (Optional)
                  </h3>
                  <div className="grid grid-cols-2 gap-3">
                    {['Black Tea', 'Green Tea', 'White Tea', 'Oolong Tea'].map(tea => (
                      <label
                        key={tea}
                        className={`flex items-center gap-3 p-3 border-2 rounded-xl cursor-pointer transition-all
                          ${formData.teaPreferences.includes(tea)
                            ? 'border-[#2d5a27] bg-[#e8f5e9]'
                            : 'border-gray-200 hover:border-[#2d5a27]'}`}
                      >
                        <input
                          type="checkbox"
                          checked={formData.teaPreferences.includes(tea)}
                          onChange={e => {
                            if (e.target.checked) {
                              updateField('teaPreferences', [...formData.teaPreferences, tea]);
                            } else {
                              updateField('teaPreferences', formData.teaPreferences.filter(t => t !== tea));
                            }
                          }}
                          className="w-4 h-4 accent-[#2d5a27]"
                        />
                        <span className="text-sm font-medium">{tea}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Special Requests */}
                <div>
                  <h3 className="text-lg font-semibold mb-4">Special Requests (Optional)</h3>
                  <textarea
                    value={formData.specialRequests}
                    onChange={e => updateField('specialRequests', e.target.value)}
                    rows={3}
                    placeholder="Any dietary requirements, mobility concerns, or special requests..."
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-[#2d5a27] resize-none"
                  />
                </div>
              </div>
            )}

            {/* STEP 3: Payment */}
            {currentStep === 3 && (
              <div className="animate-fadeIn">
                <div className="mb-8">
                  <h2 className="text-2xl font-bold text-[#2d5a27] mb-2" style={{ fontFamily: "'Playfair Display', serif" }}>
                    Payment Details
                  </h2>
                  <p className="text-gray-500">Complete your booking with secure payment.</p>
                </div>

                {/* Price Breakdown */}
                <div className="bg-gray-50 rounded-xl p-6 mb-8">
                  <h3 className="font-semibold mb-4">Price Breakdown</h3>
                  <div className="space-y-2">
                    {formData.adults > 0 && (
                      <div className="flex justify-between py-2">
                        <span>Adults x {formData.adults}</span>
                        <span>${formData.adults * pricing.adultPrice}</span>
                      </div>
                    )}
                    {formData.children > 0 && (
                      <div className="flex justify-between py-2">
                        <span>Children x {formData.children}</span>
                        <span>${formData.children * pricing.childPrice}</span>
                      </div>
                    )}
                    {formData.infants > 0 && (
                      <div className="flex justify-between py-2">
                        <span>Infants x {formData.infants}</span>
                        <span>Free</span>
                      </div>
                    )}
                    {pricing.pickupCost > 0 && (
                      <div className="flex justify-between py-2">
                        <span>Pickup surcharge</span>
                        <span>${pricing.pickupCost}</span>
                      </div>
                    )}
                    <div className="flex justify-between pt-4 mt-2 border-t-2 border-gray-200 text-xl font-bold text-[#2d5a27]">
                      <span>Total</span>
                      <span>${pricing.total.toFixed(2)}</span>
                    </div>
                  </div>
                </div>

                {/* Payment Methods */}
                <div className="mb-8">
                  <h3 className="font-semibold mb-4 flex items-center gap-2">
                    <CreditCard className="w-5 h-5" /> Payment Method
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    {[
                      { id: 'card', icon: '💳', label: 'Credit/Debit Card', sub: 'VISA, MC, AMEX' },
                      { id: 'paypal', icon: '🅿️', label: 'PayPal' },
                      { id: 'bank', icon: '🏦', label: 'Bank Transfer' }
                    ].map(method => (
                      <label
                        key={method.id}
                        onClick={() => updateField('paymentMethod', method.id)}
                        className={`flex flex-col items-center p-4 border-2 rounded-xl cursor-pointer transition-all
                          ${formData.paymentMethod === method.id
                            ? 'border-[#2d5a27] bg-gradient-to-r from-[#e8f5e9] to-[#f1f8f4]'
                            : 'border-gray-200 hover:border-[#2d5a27]'}`}
                      >
                        <span className="text-2xl mb-2">{method.icon}</span>
                        <span className="font-medium text-sm">{method.label}</span>
                        {method.sub && <span className="text-xs text-gray-500">{method.sub}</span>}
                      </label>
                    ))}
                  </div>
                </div>

                {/* Card Details */}
                {formData.paymentMethod === 'card' && (
                  <div className="bg-gray-50 rounded-xl p-6 mb-8">
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium mb-2">Card Number *</label>
                        <input
                          type="text"
                          value={formData.cardNumber}
                          onChange={e => updateField('cardNumber', formatCardNumber(e.target.value))}
                          placeholder="1234 5678 9012 3456"
                          maxLength={19}
                          className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none focus:border-[#2d5a27]
                            ${errors.cardNumber ? 'border-red-500' : 'border-gray-200'}`}
                        />
                        {errors.cardNumber && <span className="text-red-500 text-sm">Card number is required</span>}
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium mb-2">Expiry Date *</label>
                          <input
                            type="text"
                            value={formData.cardExpiry}
                            onChange={e => updateField('cardExpiry', formatExpiry(e.target.value))}
                            placeholder="MM/YY"
                            maxLength={5}
                            className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none focus:border-[#2d5a27]
                              ${errors.cardExpiry ? 'border-red-500' : 'border-gray-200'}`}
                          />
                          {errors.cardExpiry && <span className="text-red-500 text-sm">Required</span>}
                        </div>
                        <div>
                          <label className="block text-sm font-medium mb-2">CVC *</label>
                          <input
                            type="text"
                            value={formData.cardCvc}
                            onChange={e => updateField('cardCvc', e.target.value.replace(/\D/g, ''))}
                            placeholder="123"
                            maxLength={4}
                            className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none focus:border-[#2d5a27]
                              ${errors.cardCvc ? 'border-red-500' : 'border-gray-200'}`}
                          />
                          {errors.cardCvc && <span className="text-red-500 text-sm">Required</span>}
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium mb-2">Name on Card *</label>
                        <input
                          type="text"
                          value={formData.cardName}
                          onChange={e => updateField('cardName', e.target.value.toUpperCase())}
                          placeholder="JOHN DOE"
                          className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none focus:border-[#2d5a27]
                            ${errors.cardName ? 'border-red-500' : 'border-gray-200'}`}
                        />
                        {errors.cardName && <span className="text-red-500 text-sm">Name is required</span>}
                      </div>
                    </div>
                  </div>
                )}

                {/* Terms */}
                <div className="mb-6">
                  <label className="flex items-start gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.agreeTerms}
                      onChange={e => updateField('agreeTerms', e.target.checked)}
                      className="w-5 h-5 mt-0.5 accent-[#2d5a27]"
                    />
                    <span className="text-sm leading-relaxed">
                      I agree to the <a href="/terms" className="text-[#2d5a27] underline">Terms & Conditions</a> and{' '}
                      <a href="/cancellation" className="text-[#2d5a27] underline">Cancellation Policy</a>
                    </span>
                  </label>
                  {errors.agreeTerms && <span className="text-red-500 text-sm mt-1 block">You must agree to the terms</span>}
                </div>

                {/* Policy Box */}
                <div className="flex gap-4 p-4 bg-[#f1f8f4] rounded-xl">
                  <span className="text-2xl">✅</span>
                  <div>
                    <strong className="block mb-1">Cancellation Policy</strong>
                    <p className="text-sm text-gray-600">Free cancellation up to 48 hours before the experience starts</p>
                  </div>
                </div>
              </div>
            )}

            {/* CONFIRMATION */}
            {currentStep === 4 && (
              <div className="text-center py-8 animate-fadeIn">
                <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Check className="w-10 h-10 text-white" />
                </div>
                <h1 className="text-3xl font-bold text-[#2d5a27] mb-4" style={{ fontFamily: "'Playfair Display', serif" }}>
                  Booking Confirmed!
                </h1>
                <p className="text-lg mb-2">
                  Reference: <strong>{bookingRef}</strong>
                </p>
                <p className="text-gray-500 mb-8">
                  A confirmation email has been sent to <strong>{formData.email}</strong>
                </p>

                {/* Booking Details */}
                <div className="text-left border-t pt-8">
                  <h3 className="font-semibold text-lg mb-4">Tour Schedule</h3>
                  <div className="grid grid-cols-2 gap-4 mb-8">
                    <div className="bg-gray-50 rounded-lg p-4">
                      <span className="text-sm text-gray-500 block mb-1">Date</span>
                      <span className="font-semibold">
                        {formData.tourDate && new Date(formData.tourDate).toLocaleDateString('en-US', {
                          weekday: 'long', month: 'long', day: 'numeric', year: 'numeric'
                        })}
                      </span>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-4">
                      <span className="text-sm text-gray-500 block mb-1">Pickup Time</span>
                      <span className="font-semibold">{selectedPickup?.time}</span>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-4">
                      <span className="text-sm text-gray-500 block mb-1">Route</span>
                      <span className="font-semibold">{selectedRoute?.label}</span>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-4">
                      <span className="text-sm text-gray-500 block mb-1">Travelers</span>
                      <span className="font-semibold">{getTravelersText()}</span>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-4 col-span-2">
                      <span className="text-sm text-gray-500 block mb-1">Total Paid</span>
                      <span className="font-semibold text-xl text-[#2d5a27]">${pricing.total.toFixed(2)}</span>
                    </div>
                  </div>

                  <h3 className="font-semibold text-lg mb-4">What's Next?</h3>
                  <ol className="list-decimal pl-6 space-y-2 text-gray-600 mb-8">
                    <li>Check your email for the detailed confirmation</li>
                    <li>Our team will contact you via WhatsApp 24 hours before</li>
                    <li>Be ready at the pickup location at the scheduled time</li>
                    <li>Bring your booking reference, ID, and comfortable walking shoes</li>
                    <li>Enjoy your Ceylon tea trail adventure!</li>
                  </ol>

                  <div className="flex gap-4 justify-center flex-wrap">
                    <button
                      onClick={() => window.print()}
                      className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-[#2d5a27] to-[#4a7c43] text-white rounded-xl font-semibold hover:shadow-lg transition-all"
                    >
                      <Printer className="w-4 h-4" /> Print Confirmation
                    </button>
                    <Link
                      to="/experiences/tea-trails"
                      className="inline-flex items-center gap-2 px-6 py-3 bg-white border-2 border-gray-200 rounded-xl font-semibold hover:border-gray-400 transition-all"
                    >
                      Book Another Experience
                    </Link>
                  </div>
                </div>
              </div>
            )}

            {/* Navigation Buttons */}
            {currentStep < 4 && (
              <div className="flex justify-between mt-8 pt-8 border-t">
                {currentStep > 1 ? (
                  <button
                    onClick={prevStep}
                    className="inline-flex items-center gap-2 px-6 py-3 bg-white border-2 border-gray-200 rounded-xl font-semibold hover:border-gray-400 transition-all"
                  >
                    <ArrowLeft className="w-4 h-4" /> Back
                  </button>
                ) : (
                  <div />
                )}

                {currentStep < 3 ? (
                  <button
                    onClick={nextStep}
                    className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-[#2d5a27] to-[#4a7c43] text-white rounded-xl font-semibold hover:shadow-lg hover:-translate-y-0.5 transition-all ml-auto"
                  >
                    Continue <ArrowRight className="w-4 h-4" />
                  </button>
                ) : (
                  <button
                    onClick={submitBooking}
                    disabled={isSubmitting}
                    className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-[#2d5a27] to-[#4a7c43] text-white rounded-xl font-semibold hover:shadow-lg hover:-translate-y-0.5 transition-all ml-auto disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none"
                  >
                    {isSubmitting ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        Processing...
                      </>
                    ) : (
                      <>Complete Booking <Check className="w-4 h-4" /></>
                    )}
                  </button>
                )}
              </div>
            )}
          </div>

          {/* Summary Sidebar */}
          {currentStep < 4 && (
            <div className="lg:sticky lg:top-24">
              <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
                {/* Image Header */}
                <div className="relative h-44">
                  <img
                    src={packageImage}
                    alt={packageTitle}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/70 to-transparent">
                    <div className="flex items-center gap-1 text-white text-sm">
                      <span className="text-yellow-400">★</span>
                      <span className="font-semibold">4.8</span>
                      <span className="opacity-80">(89 reviews)</span>
                    </div>
                  </div>
                </div>

                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-1" style={{ fontFamily: "'Playfair Display', serif" }}>
                    {packageTitle}
                  </h3>
                  <p className="text-gray-500 text-sm mb-4">by Recharge Travels</p>

                  <div className="flex gap-4 mb-4 text-sm text-gray-600">
                    <span className="flex items-center gap-1">
                      <Clock className="w-4 h-4" /> {packageDuration}
                    </span>
                    <span className="flex items-center gap-1">
                      <Users className="w-4 h-4" /> Private Tour
                    </span>
                  </div>

                  <div className="border-t pt-4 space-y-3 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-500 flex items-center gap-1">
                        <Calendar className="w-4 h-4" /> Date
                      </span>
                      <span className="font-medium text-right">
                        {formData.tourDate
                          ? new Date(formData.tourDate).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })
                          : 'Not selected'}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500 flex items-center gap-1">
                        <Mountain className="w-4 h-4" /> Route
                      </span>
                      <span className="font-medium text-right text-xs">
                        {selectedRoute?.label || 'Not selected'}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500 flex items-center gap-1">
                        <MapPin className="w-4 h-4" /> Pickup
                      </span>
                      <span className="font-medium text-right">
                        {selectedPickup?.label?.replace('Pickup from ', '') || 'Not selected'}
                        <small className="block text-gray-400">{selectedPickup?.time}</small>
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500 flex items-center gap-1">
                        <Users className="w-4 h-4" /> Travelers
                      </span>
                      <span className="font-medium">{getTravelersText()}</span>
                    </div>
                  </div>

                  {/* Pricing */}
                  <div className="bg-gray-50 -mx-6 mt-6 px-6 py-4">
                    <div className="flex justify-between text-sm mb-2">
                      <span>Subtotal</span>
                      <span>${pricing.subtotal.toFixed(2)}</span>
                    </div>
                    {pricing.pickupCost > 0 && (
                      <div className="flex justify-between text-sm mb-2">
                        <span>Pickup surcharge</span>
                        <span>${pricing.pickupCost.toFixed(2)}</span>
                      </div>
                    )}
                    <div className="flex justify-between font-bold text-lg pt-3 border-t">
                      <span>Total</span>
                      <span className="text-[#2d5a27]">${pricing.total.toFixed(2)}</span>
                    </div>
                  </div>

                  {/* Highlights */}
                  <div className="mt-6">
                    <h4 className="font-semibold text-sm mb-3">Highlights</h4>
                    <ul className="space-y-1 text-sm text-gray-600">
                      {HIGHLIGHTS.slice(0, 4).map((h, i) => (
                        <li key={i} className="flex items-start gap-2">
                          <Check className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                          <span>{h}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Support */}
                  <div className="mt-6 pt-6 border-t text-center">
                    <p className="text-sm text-gray-500 mb-3">Need help? Contact us</p>
                    <a
                      href="https://wa.me/94777721999"
                      className="inline-flex items-center gap-2 px-6 py-2.5 bg-[#25d366] text-white rounded-full font-medium text-sm hover:shadow-lg hover:-translate-y-0.5 transition-all"
                    >
                      <MessageSquare className="w-4 h-4" /> WhatsApp Support
                    </a>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t mt-12">
        <div className="max-w-[1200px] mx-auto px-6 py-6 flex flex-wrap justify-between items-center gap-4">
          <div className="flex gap-6 text-sm text-gray-500">
            <span className="flex items-center gap-1"><Shield className="w-4 h-4" /> 256-bit SSL Encrypted</span>
            <span className="flex items-center gap-1"><Check className="w-4 h-4" /> Verified Operator</span>
            <span className="flex items-center gap-1"><MessageSquare className="w-4 h-4" /> 24/7 Support</span>
          </div>
          <div className="flex gap-6 text-sm">
            <a href="/terms" className="text-gray-500 hover:text-[#2d5a27]">Terms & Conditions</a>
            <a href="/privacy" className="text-gray-500 hover:text-[#2d5a27]">Privacy Policy</a>
            <a href="/contact" className="text-gray-500 hover:text-[#2d5a27]">Contact Us</a>
          </div>
        </div>
      </footer>

      {/* Animation Styles */}
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn {
          animation: fadeIn 0.3s ease;
        }
      `}</style>
    </div>
  );
};

export default TeaTrailsBooking;
