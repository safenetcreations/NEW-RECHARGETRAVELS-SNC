import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
  Sparkles,
  Calendar,
  Users,
  DollarSign,
  MapPin,
  Heart,
  CheckCircle,
  ArrowRight,
  Phone,
  Mail,
  Globe,
  Star,
  Quote,
  ChevronLeft,
  ChevronRight,
  Send,
  MessageSquare
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Card, CardContent } from '@/components/ui/card';
import { customExperiencePageService, type CustomExperiencePageContent } from '@/services/customExperiencePageService';
import { toast } from 'sonner';
import { format } from 'date-fns';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ComprehensiveSEO from '@/components/seo/ComprehensiveSEO';

const CustomExperience = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [step, setStep] = useState(1);
  const [submitted, setSubmitted] = useState(false);
  const [content, setContent] = useState<CustomExperiencePageContent | null>(null);
  const [currentTestimonial, setCurrentTestimonial] = useState(0);

  // Form data
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    country: '',
    startDate: '',
    endDate: '',
    flexibleDates: false,
    groupSize: 2,
    budget: {
      amount: 0,
      currency: 'USD',
      perPerson: true
    },
    interests: [] as string[],
    experienceTypes: [] as string[],
    accommodationPreference: 'luxury',
    mealPreferences: [] as string[],
    specialRequests: '',
    customAnswers: {} as Record<string, any>,
    previousVisits: false,
    mobilityRequirements: '',
    medicalConditions: ''
  });

  useEffect(() => {
    loadContent();
  }, []);

  const loadContent = async () => {
    try {
      setLoading(true);
      const pageContent = await customExperiencePageService.getPageContent();
      setContent(pageContent);
    } catch (error) {
      console.error('Error loading page content:', error);
      toast.error('Failed to load page content');
    } finally {
      setLoading(false);
    }
  };

  const interests = [
    'Wildlife & Nature',
    'Culture & Heritage',
    'Adventure & Sports',
    'Wellness & Relaxation',
    'Photography',
    'Food & Culinary',
    'Beach & Marine Life',
    'Mountains & Hiking',
    'Local Communities',
    'Luxury & Comfort',
    'Off-the-beaten-path',
    'Family Activities'
  ];

  const experienceTypes = [
    'Wildlife Safari',
    'Cultural Tours',
    'Beach Escapes',
    'Adventure Tours',
    'Wellness Retreats',
    'Honeymoon Packages'
  ];

  const mealOptions = [
    'Vegetarian',
    'Vegan',
    'Halal',
    'Kosher',
    'Gluten-free',
    'No restrictions'
  ];

  const handleInterestToggle = (interest: string) => {
    setFormData(prev => ({
      ...prev,
      interests: prev.interests.includes(interest)
        ? prev.interests.filter(i => i !== interest)
        : [...prev.interests, interest]
    }));
  };

  const handleExperienceToggle = (type: string) => {
    setFormData(prev => ({
      ...prev,
      experienceTypes: prev.experienceTypes.includes(type)
        ? prev.experienceTypes.filter(t => t !== type)
        : [...prev.experienceTypes, type]
    }));
  };

  const handleMealToggle = (meal: string) => {
    setFormData(prev => ({
      ...prev,
      mealPreferences: prev.mealPreferences.includes(meal)
        ? prev.mealPreferences.filter(m => m !== meal)
        : [...prev.mealPreferences, meal]
    }));
  };

  const validateStep = () => {
    switch (step) {
      case 1:
        if (!formData.name || !formData.email || !formData.phone || !formData.country) {
          toast.error('Please fill in all contact information');
          return false;
        }
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
          toast.error('Please enter a valid email address');
          return false;
        }
        break;
      case 2:
        if (!formData.startDate || !formData.endDate || !formData.budget.amount) {
          toast.error('Please fill in all trip details');
          return false;
        }
        if (new Date(formData.startDate) >= new Date(formData.endDate)) {
          toast.error('End date must be after start date');
          return false;
        }
        break;
      case 3:
        if (formData.interests.length === 0) {
          toast.error('Please select at least one interest');
          return false;
        }
        break;
    }
    return true;
  };

  const handleNext = () => {
    if (validateStep()) {
      setStep(step + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleSubmit = async () => {
    try {
      setSubmitting(true);
      await customExperiencePageService.submitRequest(formData);
      setSubmitted(true);
      toast.success('Your request has been submitted successfully!');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (error) {
      console.error('Error submitting request:', error);
      toast.error('Failed to submit request. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  // Auto-rotate testimonials
  useEffect(() => {
    if (content?.testimonials && content.testimonials.length > 0) {
      const interval = setInterval(() => {
        setCurrentTestimonial((prev) =>
          (prev + 1) % content.testimonials.length
        );
      }, 5000);
      return () => clearInterval(interval);
    }
  }, [content?.testimonials]);

  const nextTestimonial = () => {
    if (content?.testimonials) {
      setCurrentTestimonial((prev) => (prev + 1) % content.testimonials.length);
    }
  };

  const prevTestimonial = () => {
    if (content?.testimonials) {
      setCurrentTestimonial((prev) =>
        prev === 0 ? content.testimonials.length - 1 : prev - 1
      );
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-amber-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading experience...</p>
        </div>
      </div>
    );
  }

  if (submitted) {
    return (
      <>
        <Header />
        <div className="min-h-screen flex items-center justify-center px-4 bg-gradient-to-br from-amber-50 via-orange-50 to-rose-50">
          <motion.div
            initial={{ scale: 0.8, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="max-w-2xl w-full text-center"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: 'spring', stiffness: 200, damping: 15 }}
              className="w-32 h-32 bg-gradient-to-br from-green-400 to-emerald-600 rounded-full flex items-center justify-center mx-auto mb-8 shadow-2xl"
            >
              <CheckCircle className="w-16 h-16 text-white" strokeWidth={2.5} />
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-amber-600 via-orange-600 to-rose-600 bg-clip-text text-transparent"
            >
              Request Received!
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="text-xl text-gray-700 mb-4 leading-relaxed"
            >
              Thank you for choosing Recharge Travels for your custom Sri Lankan experience.
            </motion.p>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="text-lg text-gray-600 mb-10 leading-relaxed"
            >
              Our expert travel designers are already reviewing your request and will contact you
              within <span className="font-bold text-amber-600">24 hours</span> to start crafting your dream journey.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
              className="bg-white rounded-2xl p-8 shadow-xl border border-amber-100 mb-10"
            >
              <h3 className="text-xl font-semibold mb-4 text-gray-800">What happens next?</h3>
              <div className="space-y-4 text-left">
                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 bg-amber-500 rounded-full flex items-center justify-center text-white font-bold flex-shrink-0">1</div>
                  <div>
                    <p className="font-medium text-gray-800">Personalized Consultation</p>
                    <p className="text-sm text-gray-600">Our travel designer will call you to discuss your vision in detail</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 bg-amber-500 rounded-full flex items-center justify-center text-white font-bold flex-shrink-0">2</div>
                  <div>
                    <p className="font-medium text-gray-800">Custom Itinerary Creation</p>
                    <p className="text-sm text-gray-600">Receive a detailed, personalized itinerary crafted just for you</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 bg-amber-500 rounded-full flex items-center justify-center text-white font-bold flex-shrink-0">3</div>
                  <div>
                    <p className="font-medium text-gray-800">Refinement & Booking</p>
                    <p className="text-sm text-gray-600">Perfect every detail together, then confirm your dream adventure</p>
                  </div>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
              className="flex flex-col sm:flex-row gap-4 justify-center"
            >
              <Button
                onClick={() => navigate('/')}
                size="lg"
                variant="outline"
                className="text-lg px-8 py-6 border-2 border-amber-500 hover:bg-amber-50"
              >
                Return Home
              </Button>
              <Button
                onClick={() => navigate('/experiences')}
                size="lg"
                className="bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white text-lg px-8 py-6 shadow-lg hover:shadow-xl transition-all"
              >
                Explore Experiences
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </motion.div>
          </motion.div>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      {content && (
        <ComprehensiveSEO
          title={content.seo.title}
          description={content.seo.description}
          keywords={content.seo.keywords}
          canonicalUrl="/custom-experience"
          ogImage={content.hero.backgroundImage}
        />
      )}

      <Header />

      <div className="min-h-screen">
        {/* Cinematic Hero Section */}
        <section className="relative h-[70vh] min-h-[600px] flex items-center justify-center overflow-hidden">
          {/* Parallax Background */}
          <motion.div
            initial={{ scale: 1.1 }}
            animate={{ scale: 1 }}
            transition={{ duration: 1.5, ease: 'easeOut' }}
            className="absolute inset-0"
          >
            <div
              className="absolute inset-0 bg-cover bg-center"
              style={{
                backgroundImage: `url(${content?.hero.backgroundImage || 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=1920'})`
              }}
            />
            <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/70" />
          </motion.div>

          {/* Hero Content */}
          <div className="relative z-10 container mx-auto px-4 text-center">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.8 }}
            >
              <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md rounded-full px-6 py-3 mb-6 border border-white/20">
                <Sparkles className="w-5 h-5 text-amber-400" />
                <span className="text-white font-medium">Bespoke Travel Experiences</span>
              </div>

              <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 drop-shadow-2xl" style={{ textShadow: '0 4px 20px rgba(0,0,0,0.5)' }}>
                {content?.hero.title || 'Design Your Dream Sri Lankan Adventure'}
              </h1>

              <p className="text-xl md:text-2xl text-white/90 max-w-3xl mx-auto mb-10 drop-shadow-lg" style={{ textShadow: '0 2px 10px rgba(0,0,0,0.5)' }}>
                {content?.hero.subtitle || 'Let our expert travel designers create a bespoke journey tailored exclusively to your desires, interests, and dreams.'}
              </p>

              <Button
                onClick={() => {
                  const formSection = document.getElementById('booking-form');
                  formSection?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }}
                size="lg"
                className="bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white text-lg px-10 py-7 rounded-full shadow-2xl hover:shadow-amber-500/50 transition-all hover:scale-105"
              >
                {content?.hero.ctaText || 'Start Planning'}
                <ArrowRight className="ml-2 w-6 h-6" />
              </Button>
            </motion.div>
          </div>

          {/* Scroll Indicator */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1, duration: 1 }}
            className="absolute bottom-10 left-1/2 transform -translate-x-1/2"
          >
            <motion.div
              animate={{ y: [0, 10, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="w-8 h-12 border-2 border-white/50 rounded-full flex items-start justify-center p-2"
            >
              <motion.div
                animate={{ y: [0, 16, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="w-1.5 h-1.5 bg-white rounded-full"
              />
            </motion.div>
          </motion.div>
        </section>

        {/* Features Section */}
        <section className="py-24 bg-white">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="text-center mb-16"
            >
              <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent">
                Why Choose Custom Experiences?
              </h2>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                Every journey is unique, every detail matters
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-7xl mx-auto">
              {content?.features.map((feature, index) => (
                <motion.div
                  key={feature.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1, duration: 0.6 }}
                  whileHover={{ y: -10, scale: 1.02 }}
                  className="group"
                >
                  <Card className="h-full border-2 border-transparent hover:border-amber-300 transition-all duration-300 hover:shadow-2xl">
                    <CardContent className="p-8 text-center">
                      <motion.div
                        whileHover={{ rotate: [0, -10, 10, -10, 0], scale: 1.2 }}
                        transition={{ duration: 0.5 }}
                        className="text-6xl mb-6"
                      >
                        {feature.icon}
                      </motion.div>
                      <h3 className="text-xl font-bold mb-3 text-gray-800 group-hover:text-amber-600 transition-colors">
                        {feature.title}
                      </h3>
                      <p className="text-gray-600 leading-relaxed">
                        {feature.description}
                      </p>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Benefits Section */}
        <section className="py-24 bg-gradient-to-b from-gray-50 to-white">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <h2 className="text-4xl md:text-5xl font-bold mb-4 text-gray-900">
                Experiences Crafted for You
              </h2>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                From wildlife safaris to cultural immersions, we curate every moment
              </p>
            </motion.div>

            <div className="space-y-24 max-w-6xl mx-auto">
              {content?.benefits.map((benefit, index) => (
                <motion.div
                  key={benefit.id}
                  initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.8 }}
                  className={`flex flex-col ${index % 2 === 0 ? 'lg:flex-row' : 'lg:flex-row-reverse'} gap-12 items-center`}
                >
                  <div className="flex-1">
                    <motion.div
                      whileHover={{ scale: 1.05 }}
                      transition={{ duration: 0.4 }}
                      className="relative rounded-3xl overflow-hidden shadow-2xl group"
                    >
                      <img
                        src={benefit.image}
                        alt={benefit.title}
                        className="w-full h-[400px] object-cover transition-transform duration-700 group-hover:scale-110"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    </motion.div>
                  </div>

                  <div className="flex-1">
                    <h3 className="text-3xl md:text-4xl font-bold mb-6 text-gray-900">
                      {benefit.title}
                    </h3>
                    <p className="text-lg text-gray-600 leading-relaxed mb-6">
                      {benefit.description}
                    </p>
                    <div className="flex items-center gap-2 text-amber-600 font-semibold">
                      <Heart className="w-5 h-5 fill-current" />
                      <span>Tailored to your preferences</span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Testimonials Section */}
        {content?.testimonials && content.testimonials.length > 0 && (
          <section className="py-24 bg-gradient-to-br from-amber-50 via-orange-50 to-rose-50">
            <div className="container mx-auto px-4">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="text-center mb-16"
              >
                <h2 className="text-4xl md:text-5xl font-bold mb-4 text-gray-900">
                  Stories from Our Travelers
                </h2>
                <p className="text-xl text-gray-600">
                  Real experiences from real adventurers
                </p>
              </motion.div>

              <div className="max-w-4xl mx-auto relative">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={currentTestimonial}
                    initial={{ opacity: 0, x: 50 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -50 }}
                    transition={{ duration: 0.5 }}
                    className="bg-white rounded-3xl p-12 shadow-2xl border border-amber-100"
                  >
                    <Quote className="w-16 h-16 text-amber-400 mb-6 opacity-50" />

                    <p className="text-2xl text-gray-700 mb-8 leading-relaxed italic">
                      "{content.testimonials[currentTestimonial].text}"
                    </p>

                    <div className="flex items-center gap-2 mb-6 justify-center">
                      {Array.from({ length: content.testimonials[currentTestimonial].rating }).map((_, i) => (
                        <Star key={i} className="w-6 h-6 text-amber-500 fill-current" />
                      ))}
                    </div>

                    <div className="flex items-center gap-4 justify-center">
                      <img
                        src={content.testimonials[currentTestimonial].avatar}
                        alt={content.testimonials[currentTestimonial].name}
                        className="w-16 h-16 rounded-full border-2 border-amber-300"
                      />
                      <div className="text-left">
                        <p className="font-bold text-lg text-gray-900">
                          {content.testimonials[currentTestimonial].name}
                        </p>
                        <p className="text-gray-600">
                          {content.testimonials[currentTestimonial].location}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                </AnimatePresence>

                {/* Navigation Arrows */}
                <button
                  onClick={prevTestimonial}
                  className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 lg:-translate-x-16 w-12 h-12 bg-white rounded-full shadow-xl flex items-center justify-center hover:bg-amber-50 transition-all hover:scale-110"
                >
                  <ChevronLeft className="w-6 h-6 text-gray-800" />
                </button>

                <button
                  onClick={nextTestimonial}
                  className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 lg:translate-x-16 w-12 h-12 bg-white rounded-full shadow-xl flex items-center justify-center hover:bg-amber-50 transition-all hover:scale-110"
                >
                  <ChevronRight className="w-6 h-6 text-gray-800" />
                </button>

                {/* Dots Indicator */}
                <div className="flex justify-center gap-2 mt-8">
                  {content.testimonials.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentTestimonial(index)}
                      className={`w-3 h-3 rounded-full transition-all ${
                        index === currentTestimonial
                          ? 'bg-amber-500 w-8'
                          : 'bg-gray-300 hover:bg-gray-400'
                      }`}
                    />
                  ))}
                </div>
              </div>
            </div>
          </section>
        )}

        {/* Booking Form Section */}
        <section id="booking-form" className="py-24 bg-white">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-12"
            >
              <h2 className="text-4xl md:text-5xl font-bold mb-4 text-gray-900">
                Begin Your Journey
              </h2>
              <p className="text-xl text-gray-600">
                Share your vision with us in just a few simple steps
              </p>
            </motion.div>

            {/* Progress Bar */}
            <div className="max-w-4xl mx-auto mb-12">
              <div className="flex items-center justify-between mb-4">
                {[
                  { num: 1, label: 'Contact' },
                  { num: 2, label: 'Trip Details' },
                  { num: 3, label: 'Preferences' },
                  { num: 4, label: 'Review' }
                ].map((item, index) => (
                  <div
                    key={item.num}
                    className={`flex items-center ${index < 3 ? 'flex-1' : ''}`}
                  >
                    <motion.div
                      initial={false}
                      animate={{
                        scale: step === item.num ? 1.1 : 1,
                        backgroundColor: step >= item.num ? '#f59e0b' : '#e5e7eb'
                      }}
                      className={`w-12 h-12 rounded-full flex items-center justify-center font-bold shadow-lg
                        ${step >= item.num ? 'text-white' : 'text-gray-500'}`}
                    >
                      {item.num}
                    </motion.div>
                    {index < 3 && (
                      <motion.div
                        initial={false}
                        animate={{
                          backgroundColor: step > item.num ? '#f59e0b' : '#e5e7eb'
                        }}
                        className="flex-1 h-2 mx-3 rounded-full"
                      />
                    )}
                  </div>
                ))}
              </div>
              <div className="flex justify-between text-sm font-medium text-gray-600">
                <span>Contact Info</span>
                <span>Trip Details</span>
                <span>Preferences</span>
                <span>Review</span>
              </div>
            </div>

            {/* Form Card */}
            <Card className="max-w-4xl mx-auto shadow-2xl border-2 border-gray-100">
              <CardContent className="p-8 md:p-12">
                <AnimatePresence mode="wait">
                  {/* Step 1: Contact Information */}
                  {step === 1 && (
                    <motion.div
                      key="step1"
                      initial={{ opacity: 0, x: 30 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -30 }}
                      transition={{ duration: 0.4 }}
                      className="space-y-8"
                    >
                      <div className="flex items-center gap-3 mb-8">
                        <div className="w-12 h-12 bg-gradient-to-br from-amber-500 to-orange-600 rounded-xl flex items-center justify-center">
                          <Users className="w-6 h-6 text-white" />
                        </div>
                        <h3 className="text-3xl font-bold text-gray-900">Your Contact Information</h3>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <Label htmlFor="name" className="text-base font-semibold">Full Name *</Label>
                          <Input
                            id="name"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            placeholder="John Doe"
                            className="h-12 text-base border-2 focus:border-amber-500"
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="email" className="text-base font-semibold">Email Address *</Label>
                          <Input
                            id="email"
                            type="email"
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            placeholder="john@example.com"
                            className="h-12 text-base border-2 focus:border-amber-500"
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="phone" className="text-base font-semibold">Phone Number *</Label>
                          <Input
                            id="phone"
                            value={formData.phone}
                            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                            placeholder="+1 234 567 8900"
                            className="h-12 text-base border-2 focus:border-amber-500"
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="country" className="text-base font-semibold">Country *</Label>
                          <Input
                            id="country"
                            value={formData.country}
                            onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                            placeholder="United States"
                            className="h-12 text-base border-2 focus:border-amber-500"
                          />
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {/* Step 2: Trip Details */}
                  {step === 2 && (
                    <motion.div
                      key="step2"
                      initial={{ opacity: 0, x: 30 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -30 }}
                      transition={{ duration: 0.4 }}
                      className="space-y-8"
                    >
                      <div className="flex items-center gap-3 mb-8">
                        <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center">
                          <Calendar className="w-6 h-6 text-white" />
                        </div>
                        <h3 className="text-3xl font-bold text-gray-900">Trip Details</h3>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <Label htmlFor="startDate" className="text-base font-semibold">Preferred Start Date *</Label>
                          <Input
                            id="startDate"
                            type="date"
                            value={formData.startDate}
                            onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                            min={format(new Date(), 'yyyy-MM-dd')}
                            className="h-12 text-base border-2 focus:border-amber-500"
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="endDate" className="text-base font-semibold">Preferred End Date *</Label>
                          <Input
                            id="endDate"
                            type="date"
                            value={formData.endDate}
                            onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                            min={formData.startDate || format(new Date(), 'yyyy-MM-dd')}
                            className="h-12 text-base border-2 focus:border-amber-500"
                          />
                        </div>
                      </div>

                      <div className="bg-blue-50 border-2 border-blue-200 rounded-xl p-4">
                        <div className="flex items-start gap-3">
                          <Checkbox
                            id="flexible"
                            checked={formData.flexibleDates}
                            onCheckedChange={(checked) =>
                              setFormData({ ...formData, flexibleDates: checked as boolean })
                            }
                            className="mt-1"
                          />
                          <div>
                            <Label htmlFor="flexible" className="font-semibold text-base cursor-pointer">
                              My dates are flexible
                            </Label>
                            <p className="text-sm text-gray-600 mt-1">
                              I can adjust my travel dates by +/- 3 days for better availability or pricing
                            </p>
                          </div>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="groupSize" className="text-base font-semibold">Number of Travelers *</Label>
                        <div className="flex items-center gap-4">
                          <Input
                            id="groupSize"
                            type="number"
                            min="1"
                            max="50"
                            value={formData.groupSize}
                            onChange={(e) => setFormData({ ...formData, groupSize: parseInt(e.target.value) || 1 })}
                            className="h-12 text-base border-2 focus:border-amber-500 max-w-xs"
                          />
                          <span className="text-gray-600">travelers</span>
                        </div>
                      </div>

                      <div className="space-y-3">
                        <Label className="text-base font-semibold">Budget Range *</Label>
                        <div className="flex flex-col md:flex-row gap-4">
                          <div className="flex-1">
                            <Input
                              type="number"
                              min="0"
                              value={formData.budget.amount || ''}
                              onChange={(e) => setFormData({
                                ...formData,
                                budget: { ...formData.budget, amount: parseFloat(e.target.value) || 0 }
                              })}
                              placeholder="5000"
                              className="h-12 text-base border-2 focus:border-amber-500"
                            />
                          </div>
                          <Select
                            value={formData.budget.currency}
                            onValueChange={(value) => setFormData({
                              ...formData,
                              budget: { ...formData.budget, currency: value }
                            })}
                          >
                            <SelectTrigger className="h-12 w-full md:w-[140px] border-2">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="USD">USD ($)</SelectItem>
                              <SelectItem value="EUR">EUR (€)</SelectItem>
                              <SelectItem value="GBP">GBP (£)</SelectItem>
                              <SelectItem value="LKR">LKR (Rs)</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        <RadioGroup
                          value={formData.budget.perPerson ? 'person' : 'total'}
                          onValueChange={(value) =>
                            setFormData({
                              ...formData,
                              budget: { ...formData.budget, perPerson: value === 'person' }
                            })
                          }
                          className="flex gap-6 mt-3"
                        >
                          <div className="flex items-center gap-2">
                            <RadioGroupItem value="person" id="person" />
                            <Label htmlFor="person" className="font-medium cursor-pointer">Per person</Label>
                          </div>
                          <div className="flex items-center gap-2">
                            <RadioGroupItem value="total" id="total" />
                            <Label htmlFor="total" className="font-medium cursor-pointer">Total budget</Label>
                          </div>
                        </RadioGroup>
                      </div>
                    </motion.div>
                  )}

                  {/* Step 3: Preferences */}
                  {step === 3 && (
                    <motion.div
                      key="step3"
                      initial={{ opacity: 0, x: 30 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -30 }}
                      transition={{ duration: 0.4 }}
                      className="space-y-8"
                    >
                      <div className="flex items-center gap-3 mb-8">
                        <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl flex items-center justify-center">
                          <Heart className="w-6 h-6 text-white" />
                        </div>
                        <h3 className="text-3xl font-bold text-gray-900">Your Preferences</h3>
                      </div>

                      <div>
                        <Label className="text-lg font-semibold mb-4 block">What are you interested in? *</Label>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                          {interests.map((interest) => (
                            <motion.label
                              key={interest}
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.98 }}
                              className={`flex items-center gap-3 p-4 rounded-xl border-2 cursor-pointer transition-all
                                ${formData.interests.includes(interest)
                                  ? 'bg-gradient-to-br from-amber-50 to-orange-50 border-amber-400 shadow-lg'
                                  : 'bg-white border-gray-200 hover:border-amber-300 hover:shadow-md'}`}
                            >
                              <Checkbox
                                checked={formData.interests.includes(interest)}
                                onCheckedChange={() => handleInterestToggle(interest)}
                              />
                              <span className="text-sm font-medium">{interest}</span>
                            </motion.label>
                          ))}
                        </div>
                      </div>

                      <div>
                        <Label className="text-lg font-semibold mb-4 block">Experience Types</Label>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {experienceTypes.map((type) => (
                            <motion.label
                              key={type}
                              whileHover={{ scale: 1.02 }}
                              whileTap={{ scale: 0.98 }}
                              className={`flex items-start gap-3 p-5 rounded-xl border-2 cursor-pointer transition-all
                                ${formData.experienceTypes.includes(type)
                                  ? 'bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-400 shadow-lg'
                                  : 'bg-white border-gray-200 hover:border-blue-300 hover:shadow-md'}`}
                            >
                              <Checkbox
                                checked={formData.experienceTypes.includes(type)}
                                onCheckedChange={() => handleExperienceToggle(type)}
                                className="mt-1"
                              />
                              <span className="font-medium">{type}</span>
                            </motion.label>
                          ))}
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="accommodation" className="text-base font-semibold">Accommodation Preference</Label>
                        <Select
                          value={formData.accommodationPreference}
                          onValueChange={(value: any) =>
                            setFormData({ ...formData, accommodationPreference: value })
                          }
                        >
                          <SelectTrigger className="h-12 border-2">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="luxury">Luxury Hotels & Resorts</SelectItem>
                            <SelectItem value="boutique">Boutique Properties</SelectItem>
                            <SelectItem value="eco">Eco Lodges</SelectItem>
                            <SelectItem value="mixed">Mix of Styles</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div>
                        <Label className="text-lg font-semibold mb-4 block">Dietary Requirements</Label>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                          {mealOptions.map((meal) => (
                            <motion.label
                              key={meal}
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.98 }}
                              className={`flex items-center gap-3 p-4 rounded-xl border-2 cursor-pointer transition-all
                                ${formData.mealPreferences.includes(meal)
                                  ? 'bg-gradient-to-br from-green-50 to-emerald-50 border-green-400 shadow-lg'
                                  : 'bg-white border-gray-200 hover:border-green-300 hover:shadow-md'}`}
                            >
                              <Checkbox
                                checked={formData.mealPreferences.includes(meal)}
                                onCheckedChange={() => handleMealToggle(meal)}
                              />
                              <span className="text-sm font-medium">{meal}</span>
                            </motion.label>
                          ))}
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="special" className="text-base font-semibold">Special Requests or Must-See Places</Label>
                        <Textarea
                          id="special"
                          value={formData.specialRequests}
                          onChange={(e) => setFormData({ ...formData, specialRequests: e.target.value })}
                          placeholder="Tell us about specific places you want to visit, activities you'd like to do, celebrations, or any special requirements..."
                          rows={5}
                          className="text-base border-2 focus:border-amber-500 resize-none"
                        />
                      </div>

                      {/* Custom Questions from Firebase */}
                      {content?.formConfig.customQuestions.map((question) => (
                        <div key={question.id} className="space-y-2">
                          <Label className="text-base font-semibold">
                            {question.question} {question.required && '*'}
                          </Label>

                          {question.type === 'text' && (
                            <Input
                              value={formData.customAnswers[question.id] || ''}
                              onChange={(e) => setFormData({
                                ...formData,
                                customAnswers: { ...formData.customAnswers, [question.id]: e.target.value }
                              })}
                              className="h-12 text-base border-2 focus:border-amber-500"
                            />
                          )}

                          {question.type === 'textarea' && (
                            <Textarea
                              value={formData.customAnswers[question.id] || ''}
                              onChange={(e) => setFormData({
                                ...formData,
                                customAnswers: { ...formData.customAnswers, [question.id]: e.target.value }
                              })}
                              rows={4}
                              className="text-base border-2 focus:border-amber-500"
                            />
                          )}

                          {question.type === 'select' && question.options && (
                            <Select
                              value={formData.customAnswers[question.id] || ''}
                              onValueChange={(value) => setFormData({
                                ...formData,
                                customAnswers: { ...formData.customAnswers, [question.id]: value }
                              })}
                            >
                              <SelectTrigger className="h-12 border-2">
                                <SelectValue placeholder="Select an option" />
                              </SelectTrigger>
                              <SelectContent>
                                {question.options.map((option) => (
                                  <SelectItem key={option} value={option}>{option}</SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          )}
                        </div>
                      ))}
                    </motion.div>
                  )}

                  {/* Step 4: Review & Additional Info */}
                  {step === 4 && (
                    <motion.div
                      key="step4"
                      initial={{ opacity: 0, x: 30 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -30 }}
                      transition={{ duration: 0.4 }}
                      className="space-y-8"
                    >
                      <div className="flex items-center gap-3 mb-8">
                        <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center">
                          <CheckCircle className="w-6 h-6 text-white" />
                        </div>
                        <h3 className="text-3xl font-bold text-gray-900">Review & Submit</h3>
                      </div>

                      {/* Summary Card */}
                      <Card className="bg-gradient-to-br from-amber-50 via-orange-50 to-rose-50 border-2 border-amber-200">
                        <CardContent className="p-8">
                          <h4 className="text-2xl font-bold mb-6 text-gray-900 flex items-center gap-2">
                            <Sparkles className="w-6 h-6 text-amber-500" />
                            Your Custom Experience Summary
                          </h4>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-4">
                              <div>
                                <p className="text-sm text-gray-600 mb-1">Contact Person</p>
                                <p className="font-semibold text-lg text-gray-900">{formData.name}</p>
                              </div>
                              <div>
                                <p className="text-sm text-gray-600 mb-1">Email</p>
                                <p className="font-semibold text-gray-900">{formData.email}</p>
                              </div>
                              <div>
                                <p className="text-sm text-gray-600 mb-1">Phone</p>
                                <p className="font-semibold text-gray-900">{formData.phone}</p>
                              </div>
                              <div>
                                <p className="text-sm text-gray-600 mb-1">Country</p>
                                <p className="font-semibold text-gray-900">{formData.country}</p>
                              </div>
                            </div>

                            <div className="space-y-4">
                              <div>
                                <p className="text-sm text-gray-600 mb-1">Travel Dates</p>
                                <p className="font-semibold text-gray-900">
                                  {formData.startDate} to {formData.endDate}
                                  {formData.flexibleDates && (
                                    <span className="text-sm text-amber-600 ml-2">(Flexible)</span>
                                  )}
                                </p>
                              </div>
                              <div>
                                <p className="text-sm text-gray-600 mb-1">Group Size</p>
                                <p className="font-semibold text-gray-900">{formData.groupSize} travelers</p>
                              </div>
                              <div>
                                <p className="text-sm text-gray-600 mb-1">Budget</p>
                                <p className="font-semibold text-gray-900">
                                  {formData.budget.currency} {formData.budget.amount.toLocaleString()}
                                  <span className="text-sm"> ({formData.budget.perPerson ? 'per person' : 'total'})</span>
                                </p>
                              </div>
                              <div>
                                <p className="text-sm text-gray-600 mb-1">Accommodation</p>
                                <p className="font-semibold text-gray-900 capitalize">{formData.accommodationPreference}</p>
                              </div>
                            </div>
                          </div>

                          {formData.interests.length > 0 && (
                            <div className="mt-6">
                              <p className="text-sm text-gray-600 mb-2">Interests</p>
                              <div className="flex flex-wrap gap-2">
                                {formData.interests.map((interest) => (
                                  <span
                                    key={interest}
                                    className="px-3 py-1 bg-amber-200 text-amber-800 rounded-full text-sm font-medium"
                                  >
                                    {interest}
                                  </span>
                                ))}
                              </div>
                            </div>
                          )}

                          {formData.mealPreferences.length > 0 && (
                            <div className="mt-4">
                              <p className="text-sm text-gray-600 mb-2">Dietary Requirements</p>
                              <div className="flex flex-wrap gap-2">
                                {formData.mealPreferences.map((meal) => (
                                  <span
                                    key={meal}
                                    className="px-3 py-1 bg-green-200 text-green-800 rounded-full text-sm font-medium"
                                  >
                                    {meal}
                                  </span>
                                ))}
                              </div>
                            </div>
                          )}
                        </CardContent>
                      </Card>

                      {/* Additional Information */}
                      <div className="space-y-6">
                        <div className="bg-purple-50 border-2 border-purple-200 rounded-xl p-5">
                          <div className="flex items-start gap-3">
                            <Checkbox
                              id="previous"
                              checked={formData.previousVisits}
                              onCheckedChange={(checked) =>
                                setFormData({ ...formData, previousVisits: checked as boolean })
                              }
                              className="mt-1"
                            />
                            <Label htmlFor="previous" className="font-medium cursor-pointer">
                              I have visited Sri Lanka before
                            </Label>
                          </div>
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="mobility" className="text-base font-semibold">
                            Mobility Requirements or Accessibility Needs
                          </Label>
                          <Textarea
                            id="mobility"
                            value={formData.mobilityRequirements}
                            onChange={(e) => setFormData({ ...formData, mobilityRequirements: e.target.value })}
                            placeholder="Please let us know if you have any mobility restrictions or need special accessibility arrangements..."
                            rows={3}
                            className="text-base border-2 focus:border-amber-500"
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="medical" className="text-base font-semibold">
                            Medical Conditions or Allergies
                          </Label>
                          <Textarea
                            id="medical"
                            value={formData.medicalConditions}
                            onChange={(e) => setFormData({ ...formData, medicalConditions: e.target.value })}
                            placeholder="Please share any medical conditions, allergies, or health considerations we should be aware of..."
                            rows={3}
                            className="text-base border-2 focus:border-amber-500"
                          />
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Navigation Buttons */}
                <div className="flex justify-between mt-12 pt-8 border-t-2">
                  {step > 1 && (
                    <Button
                      variant="outline"
                      onClick={() => {
                        setStep(step - 1);
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                      }}
                      size="lg"
                      className="border-2 border-gray-300 hover:bg-gray-100 px-8"
                    >
                      <ChevronLeft className="mr-2 w-5 h-5" />
                      Back
                    </Button>
                  )}

                  <div className={step === 1 ? 'ml-auto' : ''}>
                    {step < 4 ? (
                      <Button
                        onClick={handleNext}
                        size="lg"
                        className="bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white px-8 shadow-lg"
                      >
                        Continue
                        <ChevronRight className="ml-2 w-5 h-5" />
                      </Button>
                    ) : (
                      <Button
                        onClick={handleSubmit}
                        disabled={submitting}
                        size="lg"
                        className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white px-10 shadow-xl hover:shadow-2xl transition-all"
                      >
                        {submitting ? (
                          <>
                            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                            Submitting...
                          </>
                        ) : (
                          <>
                            <Send className="mr-2 w-5 h-5" />
                            Submit Request
                          </>
                        )}
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Contact Section */}
        <section className="py-20 bg-gradient-to-br from-slate-900 via-gray-900 to-slate-800 text-white">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
              >
                <MessageSquare className="w-16 h-16 text-amber-400 mx-auto mb-6" />
                <h2 className="text-3xl md:text-4xl font-bold mb-4">
                  Prefer to Speak Directly?
                </h2>
                <p className="text-xl text-gray-300 mb-10">
                  Our travel experts are here to help bring your vision to life
                </p>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <motion.a
                    href={`tel:${content?.contact.phone || '+94777721999'}`}
                    whileHover={{ scale: 1.05, y: -5 }}
                    className="flex flex-col items-center gap-3 p-6 bg-white/10 backdrop-blur-sm rounded-2xl border border-white/20 hover:bg-white/20 transition-all"
                  >
                    <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center">
                      <Phone className="w-7 h-7 text-white" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-400 mb-1">Call Us</p>
                      <p className="font-semibold text-lg">{content?.contact.phone || '+94 7777 21 999'}</p>
                    </div>
                  </motion.a>

                  <motion.a
                    href={`mailto:${content?.contact.email || 'custom@rechargetravels.com'}`}
                    whileHover={{ scale: 1.05, y: -5 }}
                    className="flex flex-col items-center gap-3 p-6 bg-white/10 backdrop-blur-sm rounded-2xl border border-white/20 hover:bg-white/20 transition-all"
                  >
                    <div className="w-14 h-14 bg-gradient-to-br from-rose-500 to-pink-600 rounded-full flex items-center justify-center">
                      <Mail className="w-7 h-7 text-white" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-400 mb-1">Email Us</p>
                      <p className="font-semibold text-lg">{content?.contact.email || 'custom@rechargetravels.com'}</p>
                    </div>
                  </motion.a>

                  <motion.a
                    href={`https://wa.me/${content?.contact.whatsapp || '94777721999'}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    whileHover={{ scale: 1.05, y: -5 }}
                    className="flex flex-col items-center gap-3 p-6 bg-white/10 backdrop-blur-sm rounded-2xl border border-white/20 hover:bg-white/20 transition-all"
                  >
                    <div className="w-14 h-14 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center">
                      <MessageSquare className="w-7 h-7 text-white" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-400 mb-1">WhatsApp</p>
                      <p className="font-semibold text-lg">Chat Now</p>
                    </div>
                  </motion.a>
                </div>

                <div className="mt-10 flex items-center justify-center gap-2 text-amber-400">
                  <Globe className="w-5 h-5" />
                  <span className="text-lg font-medium">{content?.contact.availability || 'Available 24/7'}</span>
                </div>
              </motion.div>
            </div>
          </div>
        </section>
      </div>

      <Footer />
    </>
  );
};

export default CustomExperience;
