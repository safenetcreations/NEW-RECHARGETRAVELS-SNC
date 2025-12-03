import { useEffect, useMemo, useState, useRef } from 'react';
import { Helmet } from 'react-helmet-async';
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion';
import {
  Crown, Shield, Sparkles, Car, ChefHat, Stethoscope,
  Phone, Mail, MapPin, Calendar, Users, Clock, CreditCard,
  Check, ArrowRight, ArrowLeft, Star, Award, Lock, Headphones,
  Plane, Briefcase, Heart, Globe, MessageCircle, Building
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { dbService } from '@/lib/firebase-services';
import { paymentGateway } from '@/services/paymentGateway';
import emailService from '@/services/emailService';
import './ConciergeBooking.css';

type PaymentMethod = 'card' | 'paypal' | 'bank';

interface ServiceCategory {
  id: string;
  category: string;
  icon: any;
  image: string;
  description: string;
  services: string[];
  startingPrice: number;
}

const CONCIERGE_SERVICES: ServiceCategory[] = [
  {
    id: 'culinary',
    category: 'Culinary Excellence',
    icon: ChefHat,
    image: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?auto=format&fit=crop&w=800&q=80',
    description: 'Private chefs, exclusive dining experiences, and rare wine collections',
    services: [
      'Private Michelin-Star Chef Experiences',
      'Exclusive Restaurant Reservations',
      'Wine Cellar Tours & Tastings',
      'Traditional Sri Lankan Culinary Journeys',
      'Private Beachside Dining Setup',
      'Custom Menu Creation'
    ],
    startingPrice: 500
  },
  {
    id: 'security',
    category: 'Security & Protection',
    icon: Shield,
    image: 'https://images.unsplash.com/photo-1521791136064-7986c2920216?auto=format&fit=crop&w=800&q=80',
    description: 'Executive protection, secure transportation, and privacy assurance',
    services: [
      'Executive Close Protection',
      'Secure Airport Transfers',
      'Private Security Personnel',
      'Advance Location Security',
      'Secure Communication Setup',
      'VIP Escort Services'
    ],
    startingPrice: 800
  },
  {
    id: 'events',
    category: 'Event Production',
    icon: Sparkles,
    image: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=800&q=80',
    description: 'Luxury event planning, private celebrations, and exclusive venues',
    services: [
      'Destination Wedding Planning',
      'Private Party Organization',
      'Corporate Event Management',
      'Exclusive Venue Booking',
      'Celebrity Entertainment Booking',
      'Floral & Decor Design'
    ],
    startingPrice: 2000
  },
  {
    id: 'lifestyle',
    category: 'Lifestyle Management',
    icon: Crown,
    image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80',
    description: 'Personal shopping, real estate tours, and lifestyle curation',
    services: [
      'Personal Shopping Assistant',
      'Luxury Real Estate Tours',
      'Art & Antique Acquisitions',
      'Bespoke Gift Procurement',
      'Personal Styling Services',
      'Household Staff Arrangement'
    ],
    startingPrice: 350
  },
  {
    id: 'transport',
    category: 'Transportation Fleet',
    icon: Car,
    image: 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=800&q=80',
    description: 'Luxury vehicles, private jets, and yacht charters',
    services: [
      'Rolls Royce & Bentley Fleet',
      'Private Jet Charter',
      'Luxury Yacht Rental',
      'Helicopter Tours',
      'Classic Car Experience',
      'Chauffeur Services 24/7'
    ],
    startingPrice: 600
  },
  {
    id: 'medical',
    category: 'Medical & Wellness',
    icon: Stethoscope,
    image: 'https://images.unsplash.com/photo-1544161515-4ab6ce6db874?auto=format&fit=crop&w=800&q=80',
    description: 'Private healthcare, wellness retreats, and emergency medical services',
    services: [
      'Private Medical Consultations',
      'Ayurveda Wellness Programs',
      'Emergency Medical Evacuation',
      'Personal Fitness Training',
      'Spa & Rejuvenation Packages',
      'Mental Wellness Retreats'
    ],
    startingPrice: 450
  }
];

const TRUST_STATS = [
  { icon: Clock, value: '24/7', label: 'Availability' },
  { icon: Globe, value: '2hr', label: 'Response Time' },
  { icon: Shield, value: '15min', label: 'Emergency Response' },
  { icon: Lock, value: '100%', label: 'Discretion' }
];

const buildDateList = () => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const list: string[] = [];
  for (let i = 1; i <= 180; i += 1) {
    const date = new Date(today);
    date.setDate(date.getDate() + i);
    list.push(date.toISOString().split('T')[0]);
  }
  return list;
};

const ConciergeBooking = () => {
  const { toast } = useToast();
  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"]
  });

  const heroY = useTransform(scrollYProgress, [0, 1], [0, 200]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

  const [currentStep, setCurrentStep] = useState(1);
  const [tourDates, setTourDates] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedServices, setSelectedServices] = useState<string[]>([]);
  const [confirmation, setConfirmation] = useState<{
    reference: string;
    total: string;
    date: string;
    services: string[];
    paymentMethod: PaymentMethod;
    paymentUrl?: string;
  } | null>(null);

  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    countryCode: '+94',
    phone: '',
    preferredDate: '',
    alternateDate: '',
    location: '',
    guests: 2,
    duration: '1 day',
    budget: '',
    specialRequests: '',
    paymentMethod: 'card' as PaymentMethod,
    cardNumber: '',
    cardExpiry: '',
    cardCvc: '',
    cardName: '',
    agreeTerms: false
  });

  useEffect(() => {
    setTourDates(buildDateList());
    document.body.classList.add('concierge-booking-active');
    return () => {
      document.body.classList.remove('concierge-booking-active');
    };
  }, []);

  const selectedServiceDetails = useMemo(() => {
    return CONCIERGE_SERVICES.filter(s => selectedServices.includes(s.id));
  }, [selectedServices]);

  const estimatedTotal = useMemo(() => {
    return selectedServiceDetails.reduce((sum, s) => sum + s.startingPrice, 0);
  }, [selectedServiceDetails]);

  const updateForm = (field: keyof typeof form, value: any) => {
    setForm(prev => ({ ...prev, [field]: value }));
  };

  const toggleService = (serviceId: string) => {
    setSelectedServices(prev =>
      prev.includes(serviceId)
        ? prev.filter(id => id !== serviceId)
        : [...prev, serviceId]
    );
  };

  const steps = [
    { id: 1, label: 'Select Services', icon: Sparkles },
    { id: 2, label: 'Your Details', icon: Users },
    { id: 3, label: 'Payment', icon: CreditCard },
    { id: 4, label: 'Confirmation', icon: Check }
  ];

  const validateStep = (step: number) => {
    if (step === 1) {
      return selectedServices.length > 0;
    }
    if (step === 2) {
      return form.firstName && form.lastName && form.email && form.phone && form.preferredDate;
    }
    if (step === 3) {
      if (!form.agreeTerms) return false;
      if (form.paymentMethod === 'card') {
        return form.cardNumber && form.cardName && form.cardExpiry && form.cardCvc;
      }
      return true;
    }
    return true;
  };

  const goToNextStep = () => {
    if (!validateStep(currentStep)) {
      toast({
        title: 'Incomplete Information',
        description: currentStep === 1
          ? 'Please select at least one service to continue.'
          : 'Please fill in all required fields.',
        variant: 'destructive'
      });
      return;
    }
    setCurrentStep(prev => Math.min(prev + 1, 4));
  };

  const goToPreviousStep = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
  };

  const submitBooking = async () => {
    if (!validateStep(3)) {
      toast({
        title: 'Payment Details Required',
        description: 'Please review your payment information.',
        variant: 'destructive'
      });
      return;
    }

    setIsSubmitting(true);
    const bookingRef = `VIP-${Date.now().toString(36).toUpperCase()}`;

    try {
      await dbService.create('concierge_bookings', {
        bookingRef,
        ...form,
        selectedServices,
        selectedServiceDetails: selectedServiceDetails.map(s => s.category),
        estimatedTotal,
        status: 'pending',
        created_via: 'luxury_concierge_form',
        createdAt: new Date().toISOString()
      });

      await emailService.sendBookingConfirmation(form.email, {
        customerName: `${form.firstName} ${form.lastName}`,
        confirmationNumber: bookingRef,
        bookingType: 'VIP Concierge Services',
        travelDate: form.preferredDate,
        adults: form.guests,
        children: 0,
        totalAmount: estimatedTotal,
        currency: 'USD',
        specialRequests: form.specialRequests
      });

      let paymentUrl: string | undefined;
      const paymentPayload = {
        amount: estimatedTotal,
        currency: 'USD',
        orderId: bookingRef,
        returnUrl: window.location.href,
        cancelUrl: window.location.href,
        notifyUrl: window.location.href,
        customerName: `${form.firstName} ${form.lastName}`,
        customerEmail: form.email,
        customerPhone: `${form.countryCode} ${form.phone}`,
        items: selectedServiceDetails.map(s => s.category).join(', ')
      };

      if (form.paymentMethod === 'card') {
        const resp = await paymentGateway.initiateStripePayment(paymentPayload);
        if (resp.success && resp.paymentUrl) {
          paymentUrl = resp.paymentUrl;
        }
      } else if (form.paymentMethod === 'paypal') {
        const resp = await paymentGateway.initiatePayPalPayment(paymentPayload);
        if (resp.success && resp.paymentUrl) {
          paymentUrl = resp.paymentUrl;
        }
      } else {
        const resp = await paymentGateway.initiateBankTransfer('BOC', estimatedTotal, bookingRef);
        if (!resp.success) {
          throw new Error(resp.error || 'Failed to initiate bank transfer');
        }
      }

      setConfirmation({
        reference: bookingRef,
        total: `$${estimatedTotal.toLocaleString()}`,
        date: form.preferredDate,
        services: selectedServiceDetails.map(s => s.category),
        paymentMethod: form.paymentMethod,
        paymentUrl
      });

      if (paymentUrl) {
        window.open(paymentUrl, '_blank', 'noopener');
      }
      setCurrentStep(4);
    } catch (error: any) {
      console.error(error);
      toast({
        title: 'Booking Failed',
        description: error?.message || 'We could not process your request. Please try again.',
        variant: 'destructive'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="concierge-shell">
      <Helmet>
        <title>VIP Concierge Services | Recharge Travels - Luxury Sri Lanka</title>
        <meta name="description" content="Experience world-class VIP concierge services in Sri Lanka. Private chefs, luxury transportation, executive protection, and bespoke lifestyle management." />
      </Helmet>

      {/* Fixed Header */}
      <motion.header
        className="concierge-header"
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        <div className="header-inner">
          <a href="/" className="logo-link">
            <div className="logo-icon">
              <Crown className="w-6 h-6" />
            </div>
            <div className="logo-text">
              <span className="logo-main">Recharge</span>
              <span className="logo-sub">Concierge</span>
            </div>
          </a>

          <div className="header-right">
            <div className="header-badge">
              <Lock className="w-4 h-4" />
              <span>256-bit Encrypted</span>
            </div>
            <a href="tel:+94777721999" className="header-phone">
              <Phone className="w-4 h-4" />
              <span>+94 777 721 999</span>
            </a>
          </div>
        </div>
      </motion.header>

      {/* Hero Section with Parallax */}
      <div ref={heroRef} className="concierge-hero">
        <motion.div
          className="hero-bg"
          style={{ y: heroY }}
        >
          <img
            src="https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=2000&q=80"
            alt="Luxury Concierge"
          />
          <div className="hero-overlay" />
        </motion.div>

        <motion.div
          className="hero-content"
          style={{ opacity: heroOpacity }}
        >
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.8 }}
          >
            <span className="hero-badge">
              <Star className="w-4 h-4" />
              Exclusive VIP Services
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.8 }}
          >
            Your Personal
            <br />
            <span className="text-gradient">Concierge Awaits</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7, duration: 0.8 }}
            className="hero-subtitle"
          >
            Unlock extraordinary experiences with our bespoke concierge services.
            <br />
            Every detail curated to perfection.
          </motion.p>

          <motion.div
            className="hero-stats"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9, duration: 0.8 }}
          >
            {TRUST_STATS.map((stat, index) => (
              <div key={index} className="stat-item">
                <stat.icon className="stat-icon" />
                <div className="stat-content">
                  <span className="stat-value">{stat.value}</span>
                  <span className="stat-label">{stat.label}</span>
                </div>
              </div>
            ))}
          </motion.div>
        </motion.div>

        <div className="hero-scroll-indicator">
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <ArrowRight className="w-6 h-6 rotate-90" />
          </motion.div>
        </div>
      </div>

      {/* Main Booking Section */}
      <main className="concierge-main">
        {/* Progress Steps */}
        <div className="progress-container">
          <div className="progress-steps">
            {steps.map((step, index) => (
              <div
                key={step.id}
                className={`progress-step ${
                  currentStep === step.id ? 'active' :
                  currentStep > step.id ? 'completed' : ''
                }`}
              >
                <div className="step-circle">
                  {currentStep > step.id ? (
                    <Check className="w-5 h-5" />
                  ) : (
                    <step.icon className="w-5 h-5" />
                  )}
                </div>
                <span className="step-label">{step.label}</span>
                {index < steps.length - 1 && <div className="step-line" />}
              </div>
            ))}
          </div>
        </div>

        {/* Step Content */}
        <AnimatePresence mode="wait">
          {/* Step 1: Service Selection */}
          {currentStep === 1 && (
            <motion.div
              key="step1"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              transition={{ duration: 0.4 }}
              className="step-content"
            >
              <div className="step-header">
                <h2>Select Your Services</h2>
                <p>Choose one or more concierge services for your bespoke experience</p>
              </div>

              <div className="services-grid">
                {CONCIERGE_SERVICES.map((service) => {
                  const isSelected = selectedServices.includes(service.id);
                  const Icon = service.icon;

                  return (
                    <motion.div
                      key={service.id}
                      className={`service-card ${isSelected ? 'selected' : ''}`}
                      onClick={() => toggleService(service.id)}
                      whileHover={{ scale: 1.02, y: -5 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <div className="service-image">
                        <img src={service.image} alt={service.category} />
                        <div className="service-overlay">
                          {isSelected && (
                            <motion.div
                              className="check-badge"
                              initial={{ scale: 0 }}
                              animate={{ scale: 1 }}
                            >
                              <Check className="w-6 h-6" />
                            </motion.div>
                          )}
                        </div>
                      </div>

                      <div className="service-content">
                        <div className="service-icon">
                          <Icon className="w-6 h-6" />
                        </div>
                        <h3>{service.category}</h3>
                        <p>{service.description}</p>

                        <ul className="service-list">
                          {service.services.slice(0, 3).map((item, idx) => (
                            <li key={idx}>
                              <Check className="w-4 h-4" />
                              {item}
                            </li>
                          ))}
                          {service.services.length > 3 && (
                            <li className="more">+{service.services.length - 3} more services</li>
                          )}
                        </ul>

                        <div className="service-footer">
                          <span className="service-price">
                            From <strong>${service.startingPrice}</strong>
                          </span>
                          <span className={`select-btn ${isSelected ? 'selected' : ''}`}>
                            {isSelected ? 'Selected' : 'Select'}
                          </span>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>

              {selectedServices.length > 0 && (
                <motion.div
                  className="selection-summary"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  <div className="summary-left">
                    <span className="summary-count">{selectedServices.length} service{selectedServices.length > 1 ? 's' : ''} selected</span>
                    <span className="summary-total">Estimated from ${estimatedTotal.toLocaleString()}</span>
                  </div>
                  <button className="continue-btn" onClick={goToNextStep}>
                    Continue
                    <ArrowRight className="w-5 h-5" />
                  </button>
                </motion.div>
              )}
            </motion.div>
          )}

          {/* Step 2: Contact & Details */}
          {currentStep === 2 && (
            <motion.div
              key="step2"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              transition={{ duration: 0.4 }}
              className="step-content"
            >
              <div className="booking-layout">
                <div className="form-panel">
                  <div className="step-header">
                    <h2>Your Details</h2>
                    <p>Tell us about yourself so we can personalize your experience</p>
                  </div>

                  <div className="form-section">
                    <h3>
                      <Users className="w-5 h-5" />
                      Contact Information
                    </h3>
                    <div className="form-grid">
                      <div className="form-group">
                        <label>First Name *</label>
                        <input
                          type="text"
                          value={form.firstName}
                          onChange={(e) => updateForm('firstName', e.target.value)}
                          placeholder="Enter your first name"
                        />
                      </div>
                      <div className="form-group">
                        <label>Last Name *</label>
                        <input
                          type="text"
                          value={form.lastName}
                          onChange={(e) => updateForm('lastName', e.target.value)}
                          placeholder="Enter your last name"
                        />
                      </div>
                      <div className="form-group">
                        <label>Email Address *</label>
                        <div className="input-with-icon">
                          <Mail className="input-icon" />
                          <input
                            type="email"
                            value={form.email}
                            onChange={(e) => updateForm('email', e.target.value)}
                            placeholder="your.email@example.com"
                          />
                        </div>
                      </div>
                      <div className="form-group">
                        <label>Phone Number *</label>
                        <div className="phone-input">
                          <select
                            value={form.countryCode}
                            onChange={(e) => updateForm('countryCode', e.target.value)}
                          >
                            {['+94', '+1', '+44', '+61', '+49', '+33', '+91', '+971', '+65', '+852'].map(code => (
                              <option key={code} value={code}>{code}</option>
                            ))}
                          </select>
                          <input
                            type="tel"
                            value={form.phone}
                            onChange={(e) => updateForm('phone', e.target.value)}
                            placeholder="77 772 1999"
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="form-section">
                    <h3>
                      <Calendar className="w-5 h-5" />
                      Service Details
                    </h3>
                    <div className="form-grid">
                      <div className="form-group">
                        <label>Preferred Date *</label>
                        <div className="input-with-icon">
                          <Calendar className="input-icon" />
                          <select
                            value={form.preferredDate}
                            onChange={(e) => updateForm('preferredDate', e.target.value)}
                          >
                            <option value="">Select a date...</option>
                            {tourDates.map(date => (
                              <option key={date} value={date}>
                                {new Date(date).toLocaleDateString('en-US', {
                                  weekday: 'long',
                                  year: 'numeric',
                                  month: 'long',
                                  day: 'numeric'
                                })}
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>
                      <div className="form-group">
                        <label>Alternate Date (Optional)</label>
                        <select
                          value={form.alternateDate}
                          onChange={(e) => updateForm('alternateDate', e.target.value)}
                        >
                          <option value="">Select alternate date...</option>
                          {tourDates.map(date => (
                            <option key={date} value={date}>
                              {new Date(date).toLocaleDateString('en-US', {
                                weekday: 'short',
                                month: 'short',
                                day: 'numeric'
                              })}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div className="form-group">
                        <label>Location in Sri Lanka</label>
                        <div className="input-with-icon">
                          <MapPin className="input-icon" />
                          <input
                            type="text"
                            value={form.location}
                            onChange={(e) => updateForm('location', e.target.value)}
                            placeholder="Colombo, Kandy, Galle..."
                          />
                        </div>
                      </div>
                      <div className="form-group">
                        <label>Number of Guests</label>
                        <div className="guest-counter">
                          <button
                            type="button"
                            onClick={() => updateForm('guests', Math.max(1, form.guests - 1))}
                          >
                            −
                          </button>
                          <span>{form.guests}</span>
                          <button
                            type="button"
                            onClick={() => updateForm('guests', form.guests + 1)}
                          >
                            +
                          </button>
                        </div>
                      </div>
                      <div className="form-group">
                        <label>Duration</label>
                        <select
                          value={form.duration}
                          onChange={(e) => updateForm('duration', e.target.value)}
                        >
                          <option value="half day">Half Day</option>
                          <option value="1 day">Full Day</option>
                          <option value="2 days">2 Days</option>
                          <option value="3 days">3 Days</option>
                          <option value="1 week">1 Week</option>
                          <option value="custom">Custom Duration</option>
                        </select>
                      </div>
                      <div className="form-group">
                        <label>Estimated Budget (USD)</label>
                        <select
                          value={form.budget}
                          onChange={(e) => updateForm('budget', e.target.value)}
                        >
                          <option value="">Select budget range...</option>
                          <option value="500-1000">$500 - $1,000</option>
                          <option value="1000-2500">$1,000 - $2,500</option>
                          <option value="2500-5000">$2,500 - $5,000</option>
                          <option value="5000-10000">$5,000 - $10,000</option>
                          <option value="10000+">$10,000+</option>
                          <option value="flexible">Flexible</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  <div className="form-section">
                    <h3>
                      <MessageCircle className="w-5 h-5" />
                      Special Requests
                    </h3>
                    <div className="form-group full-width">
                      <textarea
                        rows={4}
                        value={form.specialRequests}
                        onChange={(e) => updateForm('specialRequests', e.target.value)}
                        placeholder="Any specific requirements, preferences, dietary restrictions, or special occasions we should know about..."
                      />
                    </div>
                  </div>
                </div>

                {/* Summary Sidebar */}
                <div className="summary-sidebar">
                  <div className="summary-card">
                    <div className="summary-header-card">
                      <Crown className="w-6 h-6" />
                      <h3>Booking Summary</h3>
                    </div>

                    <div className="summary-services">
                      <h4>Selected Services</h4>
                      {selectedServiceDetails.map(service => (
                        <div key={service.id} className="summary-service-item">
                          <service.icon className="w-4 h-4" />
                          <span>{service.category}</span>
                          <span className="service-price-small">from ${service.startingPrice}</span>
                        </div>
                      ))}
                    </div>

                    <div className="summary-divider" />

                    <div className="summary-details-card">
                      {form.preferredDate && (
                        <div className="detail-row">
                          <Calendar className="w-4 h-4" />
                          <span>{new Date(form.preferredDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                        </div>
                      )}
                      <div className="detail-row">
                        <Users className="w-4 h-4" />
                        <span>{form.guests} Guest{form.guests > 1 ? 's' : ''}</span>
                      </div>
                      <div className="detail-row">
                        <Clock className="w-4 h-4" />
                        <span>{form.duration}</span>
                      </div>
                    </div>

                    <div className="summary-divider" />

                    <div className="summary-total-card">
                      <span>Estimated Total</span>
                      <span className="total-amount">${estimatedTotal.toLocaleString()}+</span>
                    </div>

                    <p className="summary-note">
                      * Final pricing will be confirmed by our concierge team based on your specific requirements.
                    </p>

                    <div className="summary-support">
                      <Headphones className="w-5 h-5" />
                      <div>
                        <p>Need assistance?</p>
                        <a href="https://wa.me/94777721999">Chat on WhatsApp</a>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Navigation */}
              <div className="form-navigation">
                <button className="nav-btn secondary" onClick={goToPreviousStep}>
                  <ArrowLeft className="w-5 h-5" />
                  Back
                </button>
                <button className="nav-btn primary" onClick={goToNextStep}>
                  Continue to Payment
                  <ArrowRight className="w-5 h-5" />
                </button>
              </div>
            </motion.div>
          )}

          {/* Step 3: Payment */}
          {currentStep === 3 && (
            <motion.div
              key="step3"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              transition={{ duration: 0.4 }}
              className="step-content"
            >
              <div className="booking-layout">
                <div className="form-panel">
                  <div className="step-header">
                    <h2>Secure Payment</h2>
                    <p>Choose your preferred payment method to complete your booking</p>
                  </div>

                  <div className="form-section">
                    <h3>
                      <CreditCard className="w-5 h-5" />
                      Payment Method
                    </h3>
                    <div className="payment-methods">
                      {[
                        { id: 'card', label: 'Credit/Debit Card', icon: CreditCard, brands: ['Visa', 'MC', 'Amex'] },
                        { id: 'paypal', label: 'PayPal', icon: Globe, brands: [] },
                        { id: 'bank', label: 'Bank Transfer', icon: Building, brands: [] }
                      ].map(method => (
                        <label
                          key={method.id}
                          className={`payment-method ${form.paymentMethod === method.id ? 'selected' : ''}`}
                        >
                          <input
                            type="radio"
                            name="paymentMethod"
                            checked={form.paymentMethod === method.id}
                            onChange={() => updateForm('paymentMethod', method.id as PaymentMethod)}
                          />
                          <method.icon className="method-icon" />
                          <div className="method-content">
                            <span className="method-label">{method.label}</span>
                            {method.brands.length > 0 && (
                              <div className="card-brands">
                                {method.brands.map(brand => (
                                  <span key={brand}>{brand}</span>
                                ))}
                              </div>
                            )}
                          </div>
                        </label>
                      ))}
                    </div>
                  </div>

                  {form.paymentMethod === 'card' && (
                    <motion.div
                      className="form-section card-details"
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                    >
                      <div className="form-grid">
                        <div className="form-group full-width">
                          <label>Card Number *</label>
                          <div className="input-with-icon">
                            <CreditCard className="input-icon" />
                            <input
                              type="text"
                              value={form.cardNumber}
                              onChange={(e) => updateForm('cardNumber', e.target.value)}
                              placeholder="1234 5678 9012 3456"
                              maxLength={19}
                            />
                          </div>
                        </div>
                        <div className="form-group">
                          <label>Expiry Date *</label>
                          <input
                            type="text"
                            value={form.cardExpiry}
                            onChange={(e) => updateForm('cardExpiry', e.target.value)}
                            placeholder="MM/YY"
                            maxLength={5}
                          />
                        </div>
                        <div className="form-group">
                          <label>CVC *</label>
                          <input
                            type="text"
                            value={form.cardCvc}
                            onChange={(e) => updateForm('cardCvc', e.target.value)}
                            placeholder="123"
                            maxLength={4}
                          />
                        </div>
                        <div className="form-group full-width">
                          <label>Name on Card *</label>
                          <input
                            type="text"
                            value={form.cardName}
                            onChange={(e) => updateForm('cardName', e.target.value)}
                            placeholder="JOHN DOE"
                          />
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {form.paymentMethod === 'bank' && (
                    <motion.div
                      className="form-section bank-details"
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                    >
                      <div className="bank-info-card">
                        <h4>Bank Transfer Details</h4>
                        <div className="bank-detail-row">
                          <span>Bank:</span>
                          <strong>Bank of Ceylon</strong>
                        </div>
                        <div className="bank-detail-row">
                          <span>Account Name:</span>
                          <strong>Recharge Travels & Tours Ltd</strong>
                        </div>
                        <div className="bank-detail-row">
                          <span>Account Number:</span>
                          <strong>85XXXXXX</strong>
                        </div>
                        <div className="bank-detail-row">
                          <span>SWIFT Code:</span>
                          <strong>BABORLK</strong>
                        </div>
                        <p className="bank-note">
                          Please include your booking reference in the transfer description.
                          Your booking will be confirmed upon receipt of payment.
                        </p>
                      </div>
                    </motion.div>
                  )}

                  <div className="form-section">
                    <label className="terms-checkbox">
                      <input
                        type="checkbox"
                        checked={form.agreeTerms}
                        onChange={(e) => updateForm('agreeTerms', e.target.checked)}
                      />
                      <span>
                        I agree to the <a href="/terms">Terms & Conditions</a> and <a href="/privacy">Privacy Policy</a>.
                        I understand that the final pricing may vary based on specific service requirements.
                      </span>
                    </label>

                    <div className="policy-card">
                      <Check className="w-5 h-5 text-emerald" />
                      <div>
                        <strong>Flexible Cancellation</strong>
                        <p>Full refund if cancelled 72+ hours before service date</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Summary Sidebar */}
                <div className="summary-sidebar">
                  <div className="summary-card">
                    <div className="summary-header-card">
                      <Lock className="w-6 h-6" />
                      <h3>Order Summary</h3>
                    </div>

                    <div className="summary-services">
                      {selectedServiceDetails.map(service => (
                        <div key={service.id} className="summary-service-item">
                          <service.icon className="w-4 h-4" />
                          <span>{service.category}</span>
                          <span className="service-price-small">${service.startingPrice}</span>
                        </div>
                      ))}
                    </div>

                    <div className="summary-divider" />

                    <div className="price-breakdown">
                      <div className="breakdown-row">
                        <span>Services Base Price</span>
                        <span>${estimatedTotal.toLocaleString()}</span>
                      </div>
                      <div className="breakdown-row">
                        <span>Processing Fee</span>
                        <span>$0</span>
                      </div>
                    </div>

                    <div className="summary-divider" />

                    <div className="summary-total-card">
                      <span>Total Due Today</span>
                      <span className="total-amount">${estimatedTotal.toLocaleString()}</span>
                    </div>

                    <div className="security-badges">
                      <div className="badge">
                        <Lock className="w-4 h-4" />
                        <span>SSL Secure</span>
                      </div>
                      <div className="badge">
                        <Shield className="w-4 h-4" />
                        <span>PCI Compliant</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Navigation */}
              <div className="form-navigation">
                <button className="nav-btn secondary" onClick={goToPreviousStep}>
                  <ArrowLeft className="w-5 h-5" />
                  Back
                </button>
                <button
                  className="nav-btn primary submit-btn"
                  onClick={submitBooking}
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <div className="spinner" />
                      Processing...
                    </>
                  ) : (
                    <>
                      Complete Booking
                      <Lock className="w-5 h-5" />
                    </>
                  )}
                </button>
              </div>
            </motion.div>
          )}

          {/* Step 4: Confirmation */}
          {currentStep === 4 && confirmation && (
            <motion.div
              key="step4"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              className="step-content confirmation-step"
            >
              <div className="confirmation-container">
                <motion.div
                  className="success-icon"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                >
                  <Check className="w-12 h-12" />
                </motion.div>

                <motion.h1
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                >
                  Booking Confirmed!
                </motion.h1>

                <motion.p
                  className="confirmation-subtitle"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                >
                  Your VIP concierge request has been received. Our team will contact you within 2 hours.
                </motion.p>

                <motion.div
                  className="confirmation-ref"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 }}
                >
                  <span>Booking Reference</span>
                  <strong>{confirmation.reference}</strong>
                </motion.div>

                <motion.div
                  className="confirmation-details"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.7 }}
                >
                  <div className="confirmation-grid">
                    <div className="confirmation-item">
                      <Calendar className="w-5 h-5" />
                      <div>
                        <span className="item-label">Date</span>
                        <span className="item-value">
                          {new Date(confirmation.date).toLocaleDateString('en-US', {
                            weekday: 'long',
                            month: 'long',
                            day: 'numeric',
                            year: 'numeric'
                          })}
                        </span>
                      </div>
                    </div>
                    <div className="confirmation-item">
                      <Sparkles className="w-5 h-5" />
                      <div>
                        <span className="item-label">Services</span>
                        <span className="item-value">{confirmation.services.join(', ')}</span>
                      </div>
                    </div>
                    <div className="confirmation-item">
                      <CreditCard className="w-5 h-5" />
                      <div>
                        <span className="item-label">Payment</span>
                        <span className="item-value capitalize">{confirmation.paymentMethod}</span>
                      </div>
                    </div>
                    <div className="confirmation-item">
                      <Award className="w-5 h-5" />
                      <div>
                        <span className="item-label">Total</span>
                        <span className="item-value">{confirmation.total}</span>
                      </div>
                    </div>
                  </div>
                </motion.div>

                <motion.p
                  className="email-note"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.8 }}
                >
                  A confirmation email has been sent to <strong>{form.email}</strong>
                </motion.p>

                <motion.div
                  className="confirmation-actions"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.9 }}
                >
                  <button className="action-btn primary" onClick={() => window.print()}>
                    Print Confirmation
                  </button>
                  <a
                    href={`https://wa.me/94777721999?text=Hi, I just made a VIP concierge booking. My reference number is ${confirmation.reference}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="action-btn whatsapp"
                  >
                    <MessageCircle className="w-5 h-5" />
                    Contact on WhatsApp
                  </a>
                  {confirmation.paymentUrl && (
                    <button
                      className="action-btn secondary"
                      onClick={() => window.open(confirmation.paymentUrl, '_blank')}
                    >
                      Open Payment Link
                    </button>
                  )}
                </motion.div>

                <motion.a
                  href="/"
                  className="back-home"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 1 }}
                >
                  ← Back to Homepage
                </motion.a>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Footer */}
      <footer className="concierge-footer">
        <div className="footer-content">
          <div className="footer-trust">
            <div className="trust-item">
              <Lock className="w-4 h-4" />
              <span>256-bit SSL Encrypted</span>
            </div>
            <div className="trust-item">
              <Award className="w-4 h-4" />
              <span>Verified VIP Partner</span>
            </div>
            <div className="trust-item">
              <Headphones className="w-4 h-4" />
              <span>24/7 Concierge Support</span>
            </div>
          </div>
          <div className="footer-links">
            <a href="/terms">Terms</a>
            <a href="/privacy">Privacy</a>
            <a href="/contact">Contact</a>
          </div>
          <p className="footer-copy">© 2025 Recharge Travels & Tours Ltd. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default ConciergeBooking;
