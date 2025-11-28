import { useState, useEffect, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Calendar, Users, Sparkles, ArrowRight, ArrowLeft, Check,
  Loader2, MapPin, Clock, DollarSign, ChevronDown, ChevronUp,
  Send, Download, Share2, Star, Hotel, Utensils, Car, Plus, Minus,
  Plane, Sun, Compass, Mountain, Waves, Bird, TreePine, Train,
  Lightbulb, Zap, Bot, Printer, Map, Wallet, MessageSquare
} from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { collection, addDoc, Timestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import SEOHead from '@/components/cms/SEOHead';
import SmartDatePicker from '@/components/ai-planner/SmartDatePicker';
import PrintableItinerary, { PrintableItineraryHandle } from '@/components/ai-planner/PrintableItinerary';
import {
  TripPreferences,
  GeneratedItinerary,
  generateGeminiItinerary,
  getGeminiApiKey,
} from '@/services/geminiTripPlannerService';
import {
  INTEREST_OPTIONS,
  BUDGET_OPTIONS,
} from '@/services/aiTripPlannerService';

// Vehicle options for trip
const VEHICLE_OPTIONS = [
  { id: 'sedan', name: 'Sedan', desc: 'Toyota Axio/Premio', capacity: '3 pax', rate: 50, icon: '🚗' },
  { id: 'suv', name: 'SUV', desc: 'Toyota Prado/Fortuner', capacity: '5 pax', rate: 80, icon: '🚙' },
  { id: 'van', name: 'Mini Van', desc: 'Toyota KDH', capacity: '8 pax', rate: 100, icon: '🚐' },
  { id: 'luxury', name: 'Luxury', desc: 'Mercedes/BMW', capacity: '3 pax', rate: 150, icon: '✨' },
];

// Activity preference options
const ACTIVITY_PREFERENCES = [
  { id: 'early_bird', label: 'Early Morning Activities', icon: '🌅' },
  { id: 'photography', label: 'Photography Spots', icon: '📸' },
  { id: 'local_food', label: 'Local Food Experiences', icon: '🍛' },
  { id: 'spa_wellness', label: 'Spa & Wellness', icon: '💆' },
  { id: 'shopping', label: 'Shopping Stops', icon: '🛍️' },
  { id: 'night_life', label: 'Evening Entertainment', icon: '🌙' },
];

const AITripPlanner = () => {
  const { toast } = useToast();
  const [searchParams] = useSearchParams();
  const printRef = useRef<PrintableItineraryHandle>(null);
  const [currentStep, setCurrentStep] = useState(1);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedItinerary, setGeneratedItinerary] = useState<GeneratedItinerary | null>(null);
  const [expandedDay, setExpandedDay] = useState<number | null>(1);
  const [isQuoteOpen, setIsQuoteOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [aiStatus, setAiStatus] = useState<'checking' | 'connected' | 'fallback'>('checking');
  const [showMap, setShowMap] = useState(false);
  const [showPrintPreview, setShowPrintPreview] = useState(false);

  // Enhanced preferences
  const [budgetLimit, setBudgetLimit] = useState<number | null>(null);
  const [selectedVehicle, setSelectedVehicle] = useState('sedan');
  const [activityPrefs, setActivityPrefs] = useState<string[]>([]);
  const [specialRequests, setSpecialRequests] = useState('');

  const [preferences, setPreferences] = useState<TripPreferences>({
    startDate: null,
    endDate: null,
    travelers: { adults: 2, children: 0 },
    interests: [],
    budget: 'mid-range',
    pace: 'moderate',
  });

  // Check AI status and handle URL params
  useEffect(() => {
    const checkAI = async () => {
      const apiKey = await getGeminiApiKey();
      setAiStatus(apiKey ? 'connected' : 'fallback');
    };
    checkAI();

    // Handle URL params from hero quick setup
    const days = searchParams.get('days');
    const adults = searchParams.get('adults');
    const children = searchParams.get('children');
    const interests = searchParams.get('interests');

    if (days) {
      const startDate = new Date();
      startDate.setDate(startDate.getDate() + 7);
      const endDate = new Date(startDate);
      endDate.setDate(endDate.getDate() + parseInt(days));
      setPreferences(prev => ({ ...prev, startDate, endDate }));
    }
    if (adults) {
      setPreferences(prev => ({
        ...prev,
        travelers: { ...prev.travelers, adults: parseInt(adults) }
      }));
    }
    if (children) {
      setPreferences(prev => ({
        ...prev,
        travelers: { ...prev.travelers, children: parseInt(children) }
      }));
    }
    if (interests) {
      setPreferences(prev => ({
        ...prev,
        interests: interests.split(',').filter(Boolean)
      }));
    }
  }, [searchParams]);

  const [quoteForm, setQuoteForm] = useState({
    name: '',
    email: '',
    phone: '',
    message: '',
  });

  const steps = [
    { number: 1, title: 'Dates', icon: Calendar },
    { number: 2, title: 'Travelers', icon: Users },
    { number: 3, title: 'Interests', icon: Compass },
    { number: 4, title: 'Budget', icon: DollarSign },
    { number: 5, title: 'Generate', icon: Sparkles },
  ];

  const handleDateChange = (field: 'startDate' | 'endDate', value: string) => {
    setPreferences(prev => ({
      ...prev,
      [field]: value ? new Date(value) : null,
    }));
  };

  const handleTravelersChange = (type: 'adults' | 'children', delta: number) => {
    setPreferences(prev => ({
      ...prev,
      travelers: {
        ...prev.travelers,
        [type]: Math.max(type === 'adults' ? 1 : 0, prev.travelers[type] + delta),
      },
    }));
  };

  const toggleInterest = (interestId: string) => {
    setPreferences(prev => ({
      ...prev,
      interests: prev.interests.includes(interestId)
        ? prev.interests.filter(i => i !== interestId)
        : [...prev.interests, interestId],
    }));
  };

  const handleGenerateItinerary = async () => {
    if (!preferences.startDate || !preferences.endDate) {
      toast({
        title: 'Please select dates',
        description: 'Choose your travel dates to generate an itinerary.',
        variant: 'destructive',
      });
      setCurrentStep(1);
      return;
    }

    if (preferences.interests.length === 0) {
      toast({
        title: 'Select at least one interest',
        description: 'Tell us what you\'d like to experience in Sri Lanka.',
        variant: 'destructive',
      });
      setCurrentStep(3);
      return;
    }

    setIsGenerating(true);
    try {
      // Use Gemini AI service
      const itinerary = await generateGeminiItinerary(preferences);
      setGeneratedItinerary(itinerary);
      setCurrentStep(6); // Show results
      toast({
        title: aiStatus === 'connected' ? 'AI Itinerary Generated!' : 'Itinerary Generated!',
        description: aiStatus === 'connected'
          ? 'Gemini AI has created your personalized Sri Lanka trip.'
          : 'Your personalized Sri Lanka trip is ready.',
      });
    } catch (error) {
      console.error('Error generating itinerary:', error);
      toast({
        title: 'Error',
        description: 'Failed to generate itinerary. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const handleQuoteSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!quoteForm.name || !quoteForm.email) {
      toast({
        title: 'Missing information',
        description: 'Please provide your name and email.',
        variant: 'destructive',
      });
      return;
    }

    setIsSubmitting(true);
    try {
      await addDoc(collection(db, 'ai_trip_requests'), {
        customerName: quoteForm.name,
        customerEmail: quoteForm.email,
        customerPhone: quoteForm.phone,
        message: quoteForm.message,
        preferences: {
          startDate: preferences.startDate?.toISOString(),
          endDate: preferences.endDate?.toISOString(),
          travelers: preferences.travelers,
          interests: preferences.interests,
          budget: preferences.budget,
          pace: preferences.pace,
        },
        generatedItinerary: generatedItinerary ? {
          title: generatedItinerary.title,
          duration: generatedItinerary.duration,
          totalCost: generatedItinerary.totalCost,
          highlights: generatedItinerary.highlights,
        } : null,
        createdAt: Timestamp.now(),
        status: 'pending',
        source: 'ai-trip-planner',
      });

      toast({
        title: 'Request Sent!',
        description: 'Our travel experts will contact you within 24 hours.',
      });
      setIsQuoteOpen(false);
      setQuoteForm({ name: '', email: '', phone: '', message: '' });
    } catch (error) {
      console.error('Error submitting quote:', error);
      toast({
        title: 'Error',
        description: 'Failed to submit request. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const calculateDuration = () => {
    if (!preferences.startDate || !preferences.endDate) return 0;
    return Math.ceil((preferences.endDate.getTime() - preferences.startDate.getTime()) / (1000 * 60 * 60 * 24));
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 via-white to-teal-50">
      <SEOHead
        title="AI Trip Planner | Plan Your Sri Lanka Adventure - Recharge Travels"
        description="Use our AI-powered trip planner to create your perfect Sri Lanka itinerary. Personalized recommendations based on your interests, budget, and travel style."
        canonicalUrl="https://rechargetravels.com/ai-trip-planner"
      />

      <Header />

      {/* Hero Section */}
      <section className="relative py-16 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-purple-600/10 to-teal-600/10" />
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-purple-400/20 to-transparent rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-gradient-to-tr from-teal-400/20 to-transparent rounded-full blur-3xl" />

        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center max-w-3xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex flex-wrap items-center justify-center gap-3 mb-6"
            >
              <div className="inline-flex items-center gap-2 bg-gradient-to-r from-purple-500 to-teal-500 text-white px-6 py-2 rounded-full shadow-lg">
                <Sparkles className="w-5 h-5" />
                <span className="font-semibold">AI-Powered Trip Planning</span>
              </div>
              {aiStatus === 'connected' && (
                <div className="inline-flex items-center gap-2 bg-green-100 text-green-700 px-4 py-2 rounded-full">
                  <Bot className="w-4 h-4" />
                  <span className="text-sm font-medium">Gemini AI Connected</span>
                  <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                </div>
              )}
              {aiStatus === 'fallback' && (
                <div className="inline-flex items-center gap-2 bg-amber-100 text-amber-700 px-4 py-2 rounded-full">
                  <Zap className="w-4 h-4" />
                  <span className="text-sm font-medium">Smart Algorithm Mode</span>
                </div>
              )}
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-6"
            >
              Plan Your Dream{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-teal-600">
                Sri Lanka Trip
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-xl text-gray-600 mb-8"
            >
              Tell us your preferences and our AI will create a personalized itinerary just for you.
              Get instant recommendations, pricing, and expert tips.
            </motion.p>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto">
            {/* Progress Steps */}
            {currentStep <= 5 && (
              <div className="flex justify-center mb-12">
                <div className="flex items-center gap-2 bg-white rounded-2xl px-6 py-4 shadow-lg">
                  {steps.map((step, index) => {
                    const Icon = step.icon;
                    const isActive = currentStep === step.number;
                    const isCompleted = currentStep > step.number;

                    return (
                      <div key={step.number} className="flex items-center">
                        <button
                          onClick={() => step.number < currentStep && setCurrentStep(step.number)}
                          className={`flex items-center gap-2 px-4 py-2 rounded-xl font-medium transition-all ${
                            isActive
                              ? 'bg-gradient-to-r from-purple-500 to-teal-500 text-white shadow-lg scale-105'
                              : isCompleted
                              ? 'bg-teal-100 text-teal-700 hover:bg-teal-200'
                              : 'bg-gray-100 text-gray-400'
                          }`}
                        >
                          <span className="w-7 h-7 rounded-full bg-white/20 flex items-center justify-center">
                            {isCompleted ? <Check className="w-4 h-4" /> : <Icon className="w-4 h-4" />}
                          </span>
                          <span className="hidden sm:inline text-sm">{step.title}</span>
                        </button>
                        {index < steps.length - 1 && (
                          <ArrowRight className={`w-4 h-4 mx-2 ${isCompleted ? 'text-teal-400' : 'text-gray-300'}`} />
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Step Content */}
            <AnimatePresence mode="wait">
              {/* Step 1: Dates */}
              {currentStep === 1 && (
                <motion.div
                  key="step1"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                >
                  <Card className="shadow-xl border-0 rounded-3xl overflow-hidden">
                    <CardHeader className="bg-gradient-to-r from-purple-500 to-purple-600 text-white p-8">
                      <CardTitle className="text-2xl flex items-center gap-3">
                        <Calendar className="w-7 h-7" />
                        When do you want to travel?
                      </CardTitle>
                      <p className="text-purple-100 mt-2">Select your travel dates to begin planning</p>
                    </CardHeader>
                    <CardContent className="p-8">
                      {/* Smart Date Picker with Calendar & AI Suggestions */}
                      <SmartDatePicker
                        startDate={preferences.startDate}
                        endDate={preferences.endDate}
                        onDateChange={(start, end) => {
                          setPreferences(prev => ({
                            ...prev,
                            startDate: start,
                            endDate: end,
                          }));
                        }}
                        interests={preferences.interests}
                      />

                      <div className="flex justify-end mt-8">
                        <Button
                          onClick={() => setCurrentStep(2)}
                          className="bg-gradient-to-r from-purple-500 to-teal-500 hover:from-purple-600 hover:to-teal-600 text-white px-8 py-6 text-lg rounded-xl"
                        >
                          Continue
                          <ArrowRight className="w-5 h-5 ml-2" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              )}

              {/* Step 2: Travelers */}
              {currentStep === 2 && (
                <motion.div
                  key="step2"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                >
                  <Card className="shadow-xl border-0 rounded-3xl overflow-hidden">
                    <CardHeader className="bg-gradient-to-r from-blue-500 to-blue-600 text-white p-8">
                      <CardTitle className="text-2xl flex items-center gap-3">
                        <Users className="w-7 h-7" />
                        Who's traveling?
                      </CardTitle>
                      <p className="text-blue-100 mt-2">Tell us about your travel group</p>
                    </CardHeader>
                    <CardContent className="p-8">
                      <div className="space-y-6">
                        {/* Adults */}
                        <div className="flex items-center justify-between p-6 bg-gray-50 rounded-2xl">
                          <div>
                            <h3 className="text-xl font-semibold text-gray-900">Adults</h3>
                            <p className="text-gray-500">Age 12+</p>
                          </div>
                          <div className="flex items-center gap-4">
                            <Button
                              variant="outline"
                              size="icon"
                              onClick={() => handleTravelersChange('adults', -1)}
                              disabled={preferences.travelers.adults <= 1}
                              className="h-12 w-12 rounded-xl"
                            >
                              <Minus className="w-5 h-5" />
                            </Button>
                            <span className="text-3xl font-bold w-12 text-center">
                              {preferences.travelers.adults}
                            </span>
                            <Button
                              variant="outline"
                              size="icon"
                              onClick={() => handleTravelersChange('adults', 1)}
                              className="h-12 w-12 rounded-xl"
                            >
                              <Plus className="w-5 h-5" />
                            </Button>
                          </div>
                        </div>

                        {/* Children */}
                        <div className="flex items-center justify-between p-6 bg-gray-50 rounded-2xl">
                          <div>
                            <h3 className="text-xl font-semibold text-gray-900">Children</h3>
                            <p className="text-gray-500">Age 2-11</p>
                          </div>
                          <div className="flex items-center gap-4">
                            <Button
                              variant="outline"
                              size="icon"
                              onClick={() => handleTravelersChange('children', -1)}
                              disabled={preferences.travelers.children <= 0}
                              className="h-12 w-12 rounded-xl"
                            >
                              <Minus className="w-5 h-5" />
                            </Button>
                            <span className="text-3xl font-bold w-12 text-center">
                              {preferences.travelers.children}
                            </span>
                            <Button
                              variant="outline"
                              size="icon"
                              onClick={() => handleTravelersChange('children', 1)}
                              className="h-12 w-12 rounded-xl"
                            >
                              <Plus className="w-5 h-5" />
                            </Button>
                          </div>
                        </div>

                        {/* Trip Pace */}
                        <div className="mt-8">
                          <h3 className="text-lg font-semibold text-gray-900 mb-4">Preferred Pace</h3>
                          <div className="grid grid-cols-3 gap-4">
                            {[
                              { id: 'relaxed', label: 'Relaxed', desc: 'Fewer activities, more downtime' },
                              { id: 'moderate', label: 'Moderate', desc: 'Balanced mix of activities' },
                              { id: 'active', label: 'Active', desc: 'Packed itinerary, see more' },
                            ].map((pace) => (
                              <button
                                key={pace.id}
                                onClick={() => setPreferences(prev => ({ ...prev, pace: pace.id as any }))}
                                className={`p-4 rounded-xl border-2 transition-all text-left ${
                                  preferences.pace === pace.id
                                    ? 'border-blue-500 bg-blue-50'
                                    : 'border-gray-200 hover:border-blue-300'
                                }`}
                              >
                                <div className="font-semibold">{pace.label}</div>
                                <div className="text-xs text-gray-500 mt-1">{pace.desc}</div>
                              </button>
                            ))}
                          </div>
                        </div>
                      </div>

                      <div className="flex justify-between mt-8">
                        <Button
                          variant="outline"
                          onClick={() => setCurrentStep(1)}
                          className="px-6 py-6 rounded-xl"
                        >
                          <ArrowLeft className="w-5 h-5 mr-2" />
                          Back
                        </Button>
                        <Button
                          onClick={() => setCurrentStep(3)}
                          className="bg-gradient-to-r from-purple-500 to-teal-500 hover:from-purple-600 hover:to-teal-600 text-white px-8 py-6 text-lg rounded-xl"
                        >
                          Continue
                          <ArrowRight className="w-5 h-5 ml-2" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              )}

              {/* Step 3: Interests */}
              {currentStep === 3 && (
                <motion.div
                  key="step3"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                >
                  <Card className="shadow-xl border-0 rounded-3xl overflow-hidden">
                    <CardHeader className="bg-gradient-to-r from-teal-500 to-teal-600 text-white p-8">
                      <CardTitle className="text-2xl flex items-center gap-3">
                        <Compass className="w-7 h-7" />
                        What interests you?
                      </CardTitle>
                      <p className="text-teal-100 mt-2">Select all that apply - we'll customize your trip accordingly</p>
                    </CardHeader>
                    <CardContent className="p-8">
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                        {INTEREST_OPTIONS.map((interest) => {
                          const isSelected = preferences.interests.includes(interest.id);
                          return (
                            <button
                              key={interest.id}
                              onClick={() => toggleInterest(interest.id)}
                              className={`p-6 rounded-2xl border-2 transition-all text-left ${
                                isSelected
                                  ? 'border-teal-500 bg-teal-50 shadow-lg scale-105'
                                  : 'border-gray-200 hover:border-teal-300 hover:bg-gray-50'
                              }`}
                            >
                              <div className="text-4xl mb-3">{interest.icon}</div>
                              <div className="font-semibold text-gray-900">{interest.label}</div>
                              {isSelected && (
                                <Check className="w-5 h-5 text-teal-600 mt-2" />
                              )}
                            </button>
                          );
                        })}
                      </div>

                      {preferences.interests.length > 0 && (
                        <div className="mt-6 p-4 bg-teal-50 rounded-xl">
                          <p className="text-teal-700">
                            Selected: <span className="font-semibold">{preferences.interests.length}</span> interests
                          </p>
                        </div>
                      )}

                      <div className="flex justify-between mt-8">
                        <Button
                          variant="outline"
                          onClick={() => setCurrentStep(2)}
                          className="px-6 py-6 rounded-xl"
                        >
                          <ArrowLeft className="w-5 h-5 mr-2" />
                          Back
                        </Button>
                        <Button
                          onClick={() => setCurrentStep(4)}
                          className="bg-gradient-to-r from-purple-500 to-teal-500 hover:from-purple-600 hover:to-teal-600 text-white px-8 py-6 text-lg rounded-xl"
                        >
                          Continue
                          <ArrowRight className="w-5 h-5 ml-2" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              )}

              {/* Step 4: Budget & Options */}
              {currentStep === 4 && (
                <motion.div
                  key="step4"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-6"
                >
                  {/* Budget Style */}
                  <Card className="shadow-xl border-0 rounded-3xl overflow-hidden">
                    <CardHeader className="bg-gradient-to-r from-amber-500 to-amber-600 text-white p-6">
                      <CardTitle className="text-xl flex items-center gap-3">
                        <DollarSign className="w-6 h-6" />
                        Budget Style
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="p-6">
                      <div className="grid md:grid-cols-2 gap-3">
                        {BUDGET_OPTIONS.map((budget) => {
                          const isSelected = preferences.budget === budget.id;
                          return (
                            <button
                              key={budget.id}
                              onClick={() => setPreferences(prev => ({ ...prev, budget: budget.id as any }))}
                              className={`p-4 rounded-xl border-2 transition-all text-left ${
                                isSelected
                                  ? 'border-amber-500 bg-amber-50 shadow-lg'
                                  : 'border-gray-200 hover:border-amber-300'
                              }`}
                            >
                              <div className="flex items-center justify-between">
                                <h3 className="font-bold text-gray-900">{budget.label}</h3>
                                {isSelected && <Check className="w-5 h-5 text-amber-600" />}
                              </div>
                              <p className="text-sm text-gray-500 mt-1">{budget.description}</p>
                              <p className="text-amber-600 font-semibold text-sm mt-1">{budget.priceRange}</p>
                            </button>
                          );
                        })}
                      </div>

                      {/* Total Budget Limit */}
                      <div className="mt-6 p-4 bg-amber-50 rounded-xl">
                        <label className="text-sm font-medium text-gray-700 flex items-center gap-2 mb-2">
                          <Wallet className="w-4 h-4 text-amber-600" />
                          Set Maximum Budget (Optional)
                        </label>
                        <div className="flex items-center gap-3">
                          <span className="text-lg font-bold text-gray-600">$</span>
                          <Input
                            type="number"
                            placeholder="e.g., 2000"
                            value={budgetLimit || ''}
                            onChange={(e) => setBudgetLimit(e.target.value ? parseInt(e.target.value) : null)}
                            className="flex-1"
                          />
                          <span className="text-sm text-gray-500">total for trip</span>
                        </div>
                        <p className="text-xs text-amber-600 mt-2">
                          We'll optimize your itinerary to stay within this budget
                        </p>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Vehicle Selection */}
                  <Card className="shadow-xl border-0 rounded-3xl overflow-hidden">
                    <CardHeader className="bg-gradient-to-r from-blue-500 to-blue-600 text-white p-6">
                      <CardTitle className="text-xl flex items-center gap-3">
                        <Car className="w-6 h-6" />
                        Choose Your Vehicle
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="p-6">
                      <div className="grid md:grid-cols-2 gap-3">
                        {VEHICLE_OPTIONS.map((vehicle) => {
                          const isSelected = selectedVehicle === vehicle.id;
                          return (
                            <button
                              key={vehicle.id}
                              onClick={() => setSelectedVehicle(vehicle.id)}
                              className={`p-4 rounded-xl border-2 transition-all text-left ${
                                isSelected
                                  ? 'border-blue-500 bg-blue-50 shadow-lg'
                                  : 'border-gray-200 hover:border-blue-300'
                              }`}
                            >
                              <div className="flex items-center gap-3">
                                <span className="text-3xl">{vehicle.icon}</span>
                                <div className="flex-1">
                                  <div className="flex items-center justify-between">
                                    <h3 className="font-bold text-gray-900">{vehicle.name}</h3>
                                    {isSelected && <Check className="w-5 h-5 text-blue-600" />}
                                  </div>
                                  <p className="text-sm text-gray-500">{vehicle.desc}</p>
                                  <div className="flex items-center justify-between mt-1">
                                    <span className="text-xs text-gray-400">{vehicle.capacity}</span>
                                    <span className="text-blue-600 font-semibold">${vehicle.rate}/day</span>
                                  </div>
                                </div>
                              </div>
                            </button>
                          );
                        })}
                      </div>
                    </CardContent>
                  </Card>

                  {/* Activity Preferences */}
                  <Card className="shadow-xl border-0 rounded-3xl overflow-hidden">
                    <CardHeader className="bg-gradient-to-r from-purple-500 to-purple-600 text-white p-6">
                      <CardTitle className="text-xl flex items-center gap-3">
                        <Sparkles className="w-6 h-6" />
                        Activity Preferences (Optional)
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="p-6">
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                        {ACTIVITY_PREFERENCES.map((pref) => {
                          const isSelected = activityPrefs.includes(pref.id);
                          return (
                            <button
                              key={pref.id}
                              onClick={() => {
                                setActivityPrefs(prev =>
                                  isSelected ? prev.filter(p => p !== pref.id) : [...prev, pref.id]
                                );
                              }}
                              className={`p-3 rounded-xl border-2 transition-all ${
                                isSelected
                                  ? 'border-purple-500 bg-purple-50'
                                  : 'border-gray-200 hover:border-purple-300'
                              }`}
                            >
                              <span className="text-2xl">{pref.icon}</span>
                              <p className="text-sm font-medium mt-1">{pref.label}</p>
                            </button>
                          );
                        })}
                      </div>

                      {/* Special Requests */}
                      <div className="mt-6">
                        <label className="text-sm font-medium text-gray-700 flex items-center gap-2 mb-2">
                          <MessageSquare className="w-4 h-4 text-purple-600" />
                          Special Requests or Notes
                        </label>
                        <Textarea
                          placeholder="e.g., Wheelchair accessible, vegetarian meals, celebrate anniversary..."
                          value={specialRequests}
                          onChange={(e) => setSpecialRequests(e.target.value)}
                          rows={3}
                        />
                      </div>
                    </CardContent>
                  </Card>

                  <div className="flex justify-between">
                    <Button
                      variant="outline"
                      onClick={() => setCurrentStep(3)}
                      className="px-6 py-6 rounded-xl"
                    >
                      <ArrowLeft className="w-5 h-5 mr-2" />
                      Back
                    </Button>
                    <Button
                      onClick={() => setCurrentStep(5)}
                      className="bg-gradient-to-r from-purple-500 to-teal-500 hover:from-purple-600 hover:to-teal-600 text-white px-8 py-6 text-lg rounded-xl"
                    >
                      Continue
                      <ArrowRight className="w-5 h-5 ml-2" />
                    </Button>
                  </div>
                </motion.div>
              )}

              {/* Step 5: Generate */}
              {currentStep === 5 && (
                <motion.div
                  key="step5"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                >
                  <Card className="shadow-xl border-0 rounded-3xl overflow-hidden">
                    <CardHeader className="bg-gradient-to-r from-purple-500 to-teal-500 text-white p-8">
                      <CardTitle className="text-2xl flex items-center gap-3">
                        <Sparkles className="w-7 h-7" />
                        Ready to Generate Your Itinerary
                      </CardTitle>
                      <p className="text-purple-100 mt-2">Review your preferences and let our AI create your perfect trip</p>
                    </CardHeader>
                    <CardContent className="p-8">
                      {/* Summary */}
                      <div className="grid md:grid-cols-2 gap-6 mb-8">
                        <div className="p-4 bg-gray-50 rounded-xl">
                          <div className="flex items-center gap-2 text-gray-600 mb-2">
                            <Calendar className="w-5 h-5" />
                            <span className="font-medium">Travel Dates</span>
                          </div>
                          <p className="text-lg font-semibold">
                            {preferences.startDate?.toLocaleDateString()} - {preferences.endDate?.toLocaleDateString()}
                          </p>
                          <p className="text-purple-600 font-medium">{calculateDuration()} days</p>
                        </div>

                        <div className="p-4 bg-gray-50 rounded-xl">
                          <div className="flex items-center gap-2 text-gray-600 mb-2">
                            <Users className="w-5 h-5" />
                            <span className="font-medium">Travelers</span>
                          </div>
                          <p className="text-lg font-semibold">
                            {preferences.travelers.adults} Adults
                            {preferences.travelers.children > 0 && `, ${preferences.travelers.children} Children`}
                          </p>
                          <p className="text-purple-600 font-medium capitalize">{preferences.pace} pace</p>
                        </div>

                        <div className="p-4 bg-gray-50 rounded-xl">
                          <div className="flex items-center gap-2 text-gray-600 mb-2">
                            <Compass className="w-5 h-5" />
                            <span className="font-medium">Interests</span>
                          </div>
                          <div className="flex flex-wrap gap-2">
                            {preferences.interests.map((id) => {
                              const interest = INTEREST_OPTIONS.find(i => i.id === id);
                              return (
                                <Badge key={id} className={interest?.color}>
                                  {interest?.icon} {interest?.label}
                                </Badge>
                              );
                            })}
                          </div>
                        </div>

                        <div className="p-4 bg-gray-50 rounded-xl">
                          <div className="flex items-center gap-2 text-gray-600 mb-2">
                            <DollarSign className="w-5 h-5" />
                            <span className="font-medium">Budget</span>
                          </div>
                          <p className="text-lg font-semibold capitalize">{preferences.budget}</p>
                          <p className="text-purple-600 font-medium">
                            {BUDGET_OPTIONS.find(b => b.id === preferences.budget)?.priceRange}
                          </p>
                        </div>
                      </div>

                      <div className="flex justify-between">
                        <Button
                          variant="outline"
                          onClick={() => setCurrentStep(4)}
                          className="px-6 py-6 rounded-xl"
                        >
                          <ArrowLeft className="w-5 h-5 mr-2" />
                          Back
                        </Button>
                        <Button
                          onClick={handleGenerateItinerary}
                          disabled={isGenerating}
                          className="bg-gradient-to-r from-purple-500 to-teal-500 hover:from-purple-600 hover:to-teal-600 text-white px-10 py-6 text-lg rounded-xl shadow-lg"
                        >
                          {isGenerating ? (
                            <>
                              <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                              Generating...
                            </>
                          ) : (
                            <>
                              <Sparkles className="w-5 h-5 mr-2" />
                              Generate My Itinerary
                            </>
                          )}
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              )}

              {/* Step 6: Results */}
              {currentStep === 6 && generatedItinerary && (
                <motion.div
                  key="step6"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-6"
                >
                  {/* Itinerary Header */}
                  <Card className="shadow-xl border-0 rounded-3xl overflow-hidden">
                    <div className="bg-gradient-to-r from-purple-600 to-teal-600 text-white p-8">
                      <div className="flex items-center gap-2 mb-4">
                        <Sparkles className="w-6 h-6" />
                        <Badge className="bg-white/20 text-white">AI Generated</Badge>
                      </div>
                      <h1 className="text-3xl md:text-4xl font-bold mb-3">{generatedItinerary.title}</h1>
                      <p className="text-lg text-purple-100">{generatedItinerary.summary}</p>

                      <div className="flex flex-wrap gap-4 mt-6">
                        <div className="bg-white/10 rounded-xl px-4 py-3">
                          <div className="text-sm opacity-80">Duration</div>
                          <div className="text-xl font-bold">{generatedItinerary.duration} Days</div>
                        </div>
                        <div className="bg-white/10 rounded-xl px-4 py-3">
                          <div className="text-sm opacity-80">Estimated Cost</div>
                          <div className="text-xl font-bold">${generatedItinerary.totalCost.total}</div>
                        </div>
                        <div className="bg-white/10 rounded-xl px-4 py-3">
                          <div className="text-sm opacity-80">Travelers</div>
                          <div className="text-xl font-bold">
                            {preferences.travelers.adults + preferences.travelers.children} People
                          </div>
                        </div>
                      </div>
                    </div>

                    <CardContent className="p-8">
                      {/* Highlights */}
                      <div className="mb-8">
                        <h3 className="text-xl font-bold text-gray-900 mb-4">Trip Highlights</h3>
                        <div className="flex flex-wrap gap-2">
                          {generatedItinerary.highlights.map((highlight, i) => (
                            <Badge key={i} variant="outline" className="px-4 py-2">
                              {highlight}
                            </Badge>
                          ))}
                        </div>
                      </div>

                      {/* Day by Day */}
                      <h3 className="text-xl font-bold text-gray-900 mb-4">Day-by-Day Itinerary</h3>
                      <div className="space-y-4">
                        {generatedItinerary.days.map((day) => (
                          <div
                            key={day.day}
                            className="border rounded-2xl overflow-hidden"
                          >
                            <button
                              onClick={() => setExpandedDay(expandedDay === day.day ? null : day.day)}
                              className="w-full flex items-center justify-between p-4 bg-gray-50 hover:bg-gray-100 transition-colors"
                            >
                              <div className="flex items-center gap-4">
                                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-teal-500 text-white flex items-center justify-center font-bold">
                                  {day.day}
                                </div>
                                <div className="text-left">
                                  <div className="font-bold text-gray-900">{day.location}</div>
                                  <div className="text-sm text-gray-500">{day.date}</div>
                                </div>
                              </div>
                              <div className="flex items-center gap-3">
                                <Badge variant="outline">{day.activities.length} activities</Badge>
                                {expandedDay === day.day ? (
                                  <ChevronUp className="w-5 h-5 text-gray-400" />
                                ) : (
                                  <ChevronDown className="w-5 h-5 text-gray-400" />
                                )}
                              </div>
                            </button>

                            <AnimatePresence>
                              {expandedDay === day.day && (
                                <motion.div
                                  initial={{ height: 0, opacity: 0 }}
                                  animate={{ height: 'auto', opacity: 1 }}
                                  exit={{ height: 0, opacity: 0 }}
                                  className="px-4 pb-4"
                                >
                                  {/* Activities */}
                                  <div className="space-y-3 mt-4">
                                    {day.activities.map((activity, i) => (
                                      <div key={i} className="flex gap-4 p-3 bg-white rounded-xl border">
                                        <div className="text-sm font-medium text-purple-600 w-20">
                                          {activity.time}
                                        </div>
                                        <div className="flex-1">
                                          <div className="font-semibold">{activity.activity}</div>
                                          <div className="text-sm text-gray-500">{activity.description}</div>
                                          <div className="flex items-center gap-4 mt-2 text-xs text-gray-400">
                                            <span className="flex items-center gap-1">
                                              <Clock className="w-3 h-3" />
                                              {activity.duration}
                                            </span>
                                            {activity.cost !== undefined && activity.cost > 0 && (
                                              <span className="flex items-center gap-1">
                                                <DollarSign className="w-3 h-3" />
                                                ${activity.cost}
                                              </span>
                                            )}
                                          </div>
                                        </div>
                                      </div>
                                    ))}
                                  </div>

                                  {/* Accommodation */}
                                  <div className="mt-4 p-4 bg-amber-50 rounded-xl">
                                    <div className="flex items-center gap-2 text-amber-700 font-semibold mb-2">
                                      <Hotel className="w-5 h-5" />
                                      Accommodation
                                    </div>
                                    <div className="font-medium">{day.accommodation.name}</div>
                                    <div className="flex items-center gap-2 text-sm text-gray-500">
                                      <div className="flex">
                                        {[...Array(day.accommodation.rating)].map((_, i) => (
                                          <Star key={i} className="w-4 h-4 text-amber-500 fill-amber-500" />
                                        ))}
                                      </div>
                                      <span>{day.accommodation.type}</span>
                                      <span className="font-medium text-amber-600">
                                        ${day.accommodation.price}/night
                                      </span>
                                    </div>
                                  </div>

                                  {/* Tips */}
                                  {day.tips.length > 0 && (
                                    <div className="mt-4 p-4 bg-blue-50 rounded-xl">
                                      <div className="text-blue-700 font-semibold mb-2">Tips</div>
                                      <ul className="text-sm text-blue-600 space-y-1">
                                        {day.tips.map((tip, i) => (
                                          <li key={i}>• {tip}</li>
                                        ))}
                                      </ul>
                                    </div>
                                  )}
                                </motion.div>
                              )}
                            </AnimatePresence>
                          </div>
                        ))}
                      </div>

                      {/* Cost Breakdown */}
                      <div className="mt-8 p-6 bg-gradient-to-r from-purple-50 to-teal-50 rounded-2xl">
                        <h3 className="text-xl font-bold text-gray-900 mb-4">Cost Estimate</h3>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                          <div>
                            <div className="text-sm text-gray-500">Accommodation</div>
                            <div className="text-lg font-bold">${generatedItinerary.totalCost.accommodation}</div>
                          </div>
                          <div>
                            <div className="text-sm text-gray-500">Activities</div>
                            <div className="text-lg font-bold">${generatedItinerary.totalCost.activities}</div>
                          </div>
                          <div>
                            <div className="text-sm text-gray-500">Transport</div>
                            <div className="text-lg font-bold">${generatedItinerary.totalCost.transport}</div>
                          </div>
                          <div>
                            <div className="text-sm text-gray-500">Meals</div>
                            <div className="text-lg font-bold">${generatedItinerary.totalCost.meals}</div>
                          </div>
                        </div>
                        <div className="pt-4 border-t border-purple-200">
                          <div className="flex justify-between items-center">
                            <span className="text-xl font-bold text-gray-900">Total Estimated Cost</span>
                            <span className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-teal-600">
                              ${generatedItinerary.totalCost.total}
                            </span>
                          </div>
                          <p className="text-sm text-gray-500 mt-2">
                            * Per person, based on double occupancy. Final prices may vary.
                          </p>
                        </div>
                      </div>

                      {/* Google Map Route */}
                      <div className="mt-8">
                        <div className="flex items-center justify-between mb-4">
                          <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                            <Map className="w-6 h-6 text-teal-600" />
                            Your Journey Route
                          </h3>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setShowMap(!showMap)}
                          >
                            {showMap ? 'Hide Map' : 'Show Map'}
                          </Button>
                        </div>

                        {showMap && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            className="rounded-2xl overflow-hidden shadow-lg mb-4"
                          >
                            <iframe
                              src={`https://www.google.com/maps/embed/v1/directions?key=AIzaSyBMXM3xNrL8zKu1fi1dbdj0VbkJK2MRxgM&origin=${encodeURIComponent(generatedItinerary.days[0]?.location + ', Sri Lanka')}&destination=${encodeURIComponent(generatedItinerary.days[generatedItinerary.days.length - 1]?.location + ', Sri Lanka')}&waypoints=${generatedItinerary.days.slice(1, -1).map(d => encodeURIComponent(d.location + ', Sri Lanka')).join('|')}&mode=driving`}
                              width="100%"
                              height="400"
                              style={{ border: 0 }}
                              allowFullScreen
                              loading="lazy"
                              referrerPolicy="no-referrer-when-downgrade"
                            />
                            <div className="bg-gray-50 p-4">
                              <p className="text-sm text-gray-600 mb-2">Route stops:</p>
                              <div className="flex flex-wrap gap-2">
                                {[...new Set(generatedItinerary.days.map(d => d.location))].map((loc, i) => (
                                  <Badge key={loc} variant="outline" className="bg-white">
                                    <span className="w-5 h-5 rounded-full bg-teal-500 text-white text-xs flex items-center justify-center mr-2">{i + 1}</span>
                                    {loc}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                          </motion.div>
                        )}
                      </div>

                      {/* Vehicle Details */}
                      <div className="mt-6 p-4 bg-blue-50 rounded-xl">
                        <div className="flex items-center gap-2 text-blue-700 font-semibold mb-3">
                          <Car className="w-5 h-5" />
                          Selected Vehicle
                        </div>
                        <div className="flex items-center justify-between">
                          <div>
                            <span className="text-2xl mr-2">
                              {VEHICLE_OPTIONS.find(v => v.id === selectedVehicle)?.icon}
                            </span>
                            <span className="font-bold text-gray-900">
                              {VEHICLE_OPTIONS.find(v => v.id === selectedVehicle)?.name}
                            </span>
                            <span className="text-gray-500 ml-2">
                              ({VEHICLE_OPTIONS.find(v => v.id === selectedVehicle)?.desc})
                            </span>
                          </div>
                          <div className="text-right">
                            <div className="text-sm text-gray-500">
                              ${VEHICLE_OPTIONS.find(v => v.id === selectedVehicle)?.rate}/day × {generatedItinerary.duration} days
                            </div>
                            <div className="text-xl font-bold text-blue-600">
                              ${(VEHICLE_OPTIONS.find(v => v.id === selectedVehicle)?.rate || 50) * generatedItinerary.duration}
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Action Buttons */}
                      <div className="flex flex-wrap gap-3 mt-8">
                        <Button
                          onClick={() => setIsQuoteOpen(true)}
                          className="flex-1 bg-gradient-to-r from-purple-500 to-teal-500 hover:from-purple-600 hover:to-teal-600 text-white py-6 text-lg rounded-xl"
                        >
                          <Send className="w-5 h-5 mr-2" />
                          Get Expert Quote
                        </Button>
                        <Button
                          variant="outline"
                          onClick={() => printRef.current?.print()}
                          className="py-6 rounded-xl"
                        >
                          <Printer className="w-5 h-5 mr-2" />
                          Print Itinerary
                        </Button>
                        <Button
                          variant="outline"
                          onClick={() => setCurrentStep(1)}
                          className="py-6 rounded-xl"
                        >
                          Start Over
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </section>

      {/* Quote Dialog */}
      <Dialog open={isQuoteOpen} onOpenChange={setIsQuoteOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Send className="w-5 h-5 text-purple-600" />
              Get Your Personalized Quote
            </DialogTitle>
            <DialogDescription>
              Our travel experts will review your itinerary and contact you within 24 hours with a customized quote.
            </DialogDescription>
          </DialogHeader>

          {generatedItinerary && (
            <div className="bg-gradient-to-r from-purple-50 to-teal-50 rounded-xl p-4 mb-4">
              <div className="font-semibold text-gray-900">{generatedItinerary.title}</div>
              <div className="flex items-center gap-4 mt-2 text-sm text-gray-600">
                <span>{generatedItinerary.duration} days</span>
                <span>~${generatedItinerary.totalCost.total}</span>
              </div>
            </div>
          )}

          <form onSubmit={handleQuoteSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="name">Your Name *</Label>
                <Input
                  id="name"
                  value={quoteForm.name}
                  onChange={(e) => setQuoteForm({ ...quoteForm, name: e.target.value })}
                  placeholder="John Doe"
                  required
                />
              </div>
              <div>
                <Label htmlFor="email">Email *</Label>
                <Input
                  id="email"
                  type="email"
                  value={quoteForm.email}
                  onChange={(e) => setQuoteForm({ ...quoteForm, email: e.target.value })}
                  placeholder="you@example.com"
                  required
                />
              </div>
            </div>
            <div>
              <Label htmlFor="phone">Phone / WhatsApp</Label>
              <Input
                id="phone"
                value={quoteForm.phone}
                onChange={(e) => setQuoteForm({ ...quoteForm, phone: e.target.value })}
                placeholder="+1 234 567 8900"
              />
            </div>
            <div>
              <Label htmlFor="message">Special Requests</Label>
              <Textarea
                id="message"
                value={quoteForm.message}
                onChange={(e) => setQuoteForm({ ...quoteForm, message: e.target.value })}
                placeholder="Any special requirements or questions..."
                rows={3}
              />
            </div>
            <div className="flex gap-3 pt-2">
              <Button type="button" variant="outline" onClick={() => setIsQuoteOpen(false)} className="flex-1">
                Cancel
              </Button>
              <Button
                type="submit"
                className="flex-1 bg-gradient-to-r from-purple-500 to-teal-500"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Sending...
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4 mr-2" />
                    Send Request
                  </>
                )}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Hidden Printable Itinerary Component */}
      {generatedItinerary && (
        <div className="hidden">
          <PrintableItinerary
            ref={printRef}
            itinerary={generatedItinerary}
            preferences={preferences}
            vehicleDetails={{
              type: VEHICLE_OPTIONS.find(v => v.id === selectedVehicle)?.name || 'Sedan',
              dailyRate: VEHICLE_OPTIONS.find(v => v.id === selectedVehicle)?.rate || 50,
              totalDays: generatedItinerary.duration,
            }}
          />
        </div>
      )}

      <Footer />
    </div>
  );
};

export default AITripPlanner;
