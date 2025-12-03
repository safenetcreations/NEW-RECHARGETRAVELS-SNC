import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Car, Star, Shield, Headphones, Map, Bus, Train, Sparkles, Calendar, Users, Compass, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import TransferBookingForm from '@/modules/transfers/components/TransferBookingForm';
import PrivateTourBookingForm from '@/components/booking/PrivateTourBookingForm';
import GroupTransportBookingForm from '@/components/booking/GroupTransportBookingForm';
import TrainBookingForm from '@/components/booking/TrainBookingForm';
import { heroSlidesService } from '@/services/cmsService';
import type { HeroSlide } from '@/types/cms';

// Default fallback slides
const DEFAULT_HERO_SLIDES: HeroSlide[] = [
  {
    id: 'default-1',
    title: 'Discover Sri Lanka',
    subtitle: 'Experience the Pearl of the Indian Ocean',
    description: 'Luxury travel experiences across the island',
    image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1920&q=80',
    order: 0,
    isActive: true,
    createdAt: null,
    updatedAt: null
  },
  {
    id: 'default-2',
    title: 'Ancient Wonders',
    subtitle: 'Explore 2500 Years of History',
    description: 'Visit UNESCO World Heritage sites',
    image: 'https://images.unsplash.com/photo-1588598198321-9735fd52045b?w=1920&q=80',
    order: 1,
    isActive: true,
    createdAt: null,
    updatedAt: null
  }
];

interface LuxuryHeroSectionProps {
  hoveredRegion?: { name: string; description: string } | null;
  onLocationsChange?: (locations: { pickup: string; dropoff: string }) => void;
}

const LuxuryHeroSection = ({ hoveredRegion, onLocationsChange }: LuxuryHeroSectionProps) => {
  const navigate = useNavigate();
  const [slides, setSlides] = useState<HeroSlide[]>(DEFAULT_HERO_SLIDES);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);

  // AI Planner state
  const [tripDays, setTripDays] = useState(7);
  const [adults, setAdults] = useState(2);
  const [children, setChildren] = useState(0);
  const [selectedInterests, setSelectedInterests] = useState<string[]>([]);

  const interestOptions = [
    { id: 'cultural', label: 'Cultural', icon: '🏛️' },
    { id: 'wildlife', label: 'Wildlife', icon: '🐆' },
    { id: 'beach', label: 'Beach', icon: '🏖️' },
    { id: 'adventure', label: 'Adventure', icon: '🥾' },
    { id: 'nature', label: 'Nature', icon: '🍃' },
    { id: 'train', label: 'Train Rides', icon: '🚂' },
  ];

  const toggleInterest = (id: string) => {
    setSelectedInterests(prev =>
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const handleAIPlannerContinue = () => {
    // Navigate to full AI planner with pre-filled data
    const params = new URLSearchParams({
      days: tripDays.toString(),
      adults: adults.toString(),
      children: children.toString(),
      interests: selectedInterests.join(','),
    });
    navigate(`/ai-trip-planner?${params.toString()}`);
  };

  useEffect(() => {
    const loadSlides = async () => {
      try {
        // Start with defaults immediately for instant display
        setLoading(false);
        
        const fetched = await heroSlidesService.getAll();
        const activeSlides = (fetched || []).filter((slide: any) => {
          const hasImage = slide.image && typeof slide.image === 'string' && slide.image.trim() !== '';
          return hasImage;
        }) as HeroSlide[];

        const finalSlides = activeSlides.length > 0 ? activeSlides : DEFAULT_HERO_SLIDES;

        // Preload first image for instant display
        if (finalSlides[0]?.image) {
          const img = new Image();
          img.src = finalSlides[0].image;
        }

        setSlides(finalSlides);
        const startIndex = Math.floor(Math.random() * finalSlides.length);
        setCurrentIndex(startIndex);
      } catch {
        // Silently use defaults - no console spam
        setSlides(DEFAULT_HERO_SLIDES);
        setCurrentIndex(0);
        setLoading(false);
      }
    };

    loadSlides();
  }, []);

  useEffect(() => {
    if (slides.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentIndex(prev => (prev + 1) % slides.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [slides.length]);

  // Safe fallback if no slides are available
  const currentSlide = slides[currentIndex] || {
    id: 'default',
    title: 'Welcome to Sri Lanka',
    subtitle: 'Experience the Pearl of the Indian Ocean',
    description: '',
    image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1920&q=80', // Generic fallback image
    order: 0,
    isActive: true,
    createdAt: null,
    updatedAt: null
  } as unknown as HeroSlide;

  const scrollToContent = () => {
    const content = document.getElementById('featured-destinations');
    if (content) {
      content.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Only load current and next slide to save bandwidth (40MB+ savings)
  const visibleSlides = slides.length > 0 ? [
    currentIndex,
    (currentIndex + 1) % slides.length
  ] : [];

  return (
    <div style={{
      position: 'relative',
      width: '100%',
      // 16:9 aspect ratio = 56.25% of width, with min/max for responsiveness
      aspectRatio: '16/9',
      minHeight: '500px', // Minimum for mobile
      maxHeight: '85vh', // Don't exceed viewport
      overflow: 'hidden',
      backgroundColor: '#1a1a2e'
    }}>
      {/* Background Images - Only load current + next slide for performance */}
      {visibleSlides.map((slideIndex) => {
        const slide = slides[slideIndex];
        if (!slide) return null;
        
        // Optimize Firebase Storage URLs - request smaller size
        const optimizedSrc = slide.image?.includes('firebasestorage.googleapis.com') 
          ? slide.image // Firebase doesn't support resize params, but we'll handle with CSS
          : slide.image?.includes('unsplash.com')
            ? slide.image.replace(/w=\d+/, 'w=1280').replace(/q=\d+/, 'q=75')
            : slide.image;
        
        return (
          <div
            key={slide.id || `slide-${slideIndex}`}
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              opacity: slideIndex === currentIndex ? 1 : 0,
              transition: 'opacity 1s ease-in-out',
              zIndex: 1
            }}
          >
            <img
              src={optimizedSrc}
              alt={slide.title || 'Sri Lanka'}
              loading={slideIndex === currentIndex ? 'eager' : 'lazy'}
              fetchPriority={slideIndex === currentIndex ? 'high' : 'low'}
              decoding="async"
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                objectPosition: 'center'
              }}
              onError={(e) => {
                e.currentTarget.src = 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1280&q=75';
              }}
            />
          </div>
        );
      })}

      {/* Dark overlay - always visible */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        backgroundColor: 'rgba(0,0,0,0.4)',
        zIndex: 2
      }} />

      {/* Content Container */}
      <div style={{
        position: 'relative',
        zIndex: 10,
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        color: 'white',
        padding: '0 20px'
      }}>

        {/* Main Text Content - Compact for 16:9 ratio */}
        <div style={{
          textAlign: 'center',
          marginBottom: '20px',
          maxWidth: '900px',
          width: '100%',
          position: 'relative'
        }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            backgroundColor: 'rgba(255,255,255,0.1)',
            backdropFilter: 'blur(10px)',
            padding: '6px 14px',
            borderRadius: '9999px',
            marginBottom: '16px',
            border: '1px solid rgba(255,255,255,0.2)'
          }}>
            <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
            <span style={{ fontSize: '13px', fontWeight: 500 }}>#1 Premium Travel Service in Sri Lanka</span>
          </div>

          {/* Synchronized Title & Subtitle - stacked with opacity transitions */}
          <div style={{ position: 'relative', height: '140px' }}>
            {slides.map((slide, index) => (
              <div
                key={`text-${slide.id || index}`}
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '100%',
                  opacity: index === currentIndex ? 1 : 0,
                  transition: 'opacity 1s ease-in-out',
                  pointerEvents: index === currentIndex ? 'auto' : 'none'
                }}
              >
                <h1 style={{
                  fontSize: 'clamp(32px, 4vw, 64px)',
                  fontWeight: 'bold',
                  lineHeight: 1.1,
                  marginBottom: '16px',
                  color: '#FFFFFF',
                  textShadow: '0 0 30px rgba(255,255,255,0.5), 0 0 60px rgba(255,255,255,0.3), 0 4px 20px rgba(0,0,0,0.5)',
                  fontFamily: 'Playfair Display, serif',
                  letterSpacing: '-0.02em'
                }}>
                  {slide.title}
                </h1>

                <p style={{
                  fontSize: 'clamp(16px, 1.8vw, 22px)',
                  maxWidth: '700px',
                  margin: '0 auto',
                  color: 'rgba(255,255,255,0.95)',
                  textShadow: '0 0 20px rgba(255,255,255,0.3), 0 2px 10px rgba(0,0,0,0.4)'
                }}>
                  {slide.subtitle}
                </p>
              </div>
            ))}
          </div>

          {/* Trust Indicators - More compact */}
          <div style={{
            display: 'flex',
            justifyContent: 'center',
            gap: '20px',
            flexWrap: 'wrap',
            marginBottom: '20px'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div style={{ backgroundColor: 'rgba(255,255,255,0.2)', padding: '8px', borderRadius: '50%' }}>
                <Star className="w-5 h-5 text-yellow-400 fill-yellow-400" />
              </div>
              <div style={{ textAlign: 'left' }}>
                <div style={{ fontWeight: 'bold', fontSize: '14px' }}>4.9/5 Rating</div>
                <div style={{ fontSize: '12px', opacity: 0.8 }}>From 1000+ Reviews</div>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div style={{ backgroundColor: 'rgba(255,255,255,0.2)', padding: '8px', borderRadius: '50%' }}>
                <Shield className="w-5 h-5 text-green-400" />
              </div>
              <div style={{ textAlign: 'left' }}>
                <div style={{ fontWeight: 'bold', fontSize: '14px' }}>Safe & Secure</div>
                <div style={{ fontSize: '12px', opacity: 0.8 }}>Verified Drivers</div>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div style={{ backgroundColor: 'rgba(255,255,255,0.2)', padding: '8px', borderRadius: '50%' }}>
                <Headphones className="w-5 h-5 text-blue-400" />
              </div>
              <div style={{ textAlign: 'left' }}>
                <div style={{ fontWeight: 'bold', fontSize: '14px' }}>24/7 Support</div>
                <div style={{ fontSize: '12px', opacity: 0.8 }}>Always Here For You</div>
              </div>
            </div>
          </div>

          {/* Booking Widget - Pinned Open */}
          <div style={{ position: 'relative', zIndex: 50 }}>
            <div className="w-full max-w-[95vw] sm:max-w-4xl mx-auto bg-white rounded-xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-300">
              <div className="bg-blue-600 p-3 sm:p-4 flex justify-between items-center">
                <h3 className="text-white font-bold text-base sm:text-lg flex items-center gap-2">
                  <Car className="w-4 h-4 sm:w-5 sm:h-5" />
                  <span className="hidden sm:inline">Book Your Journey</span>
                  <span className="sm:hidden">Book Now</span>
                </h3>
                <span className="text-white/80 text-xs sm:text-sm font-medium">
                  Booking menu stays open
                </span>
              </div>

              <div className="p-2 sm:p-4 bg-gray-50">
                <Tabs defaultValue="ai-planner" className="w-full">
                  <TabsList className="grid w-full grid-cols-3 sm:grid-cols-5 gap-1 mb-4 h-auto">
                    <TabsTrigger value="ai-planner" className="flex items-center justify-center gap-1 sm:gap-2 px-2 py-2 text-xs sm:text-sm bg-gradient-to-r from-purple-500/10 to-teal-500/10 data-[state=active]:from-purple-500 data-[state=active]:to-teal-500 data-[state=active]:text-white">
                      <Sparkles className="w-3 h-3 sm:w-4 sm:h-4" /> <span className="hidden xs:inline">AI</span> Plan
                    </TabsTrigger>
                    <TabsTrigger value="transfer" className="flex items-center justify-center gap-1 sm:gap-2 px-2 py-2 text-xs sm:text-sm">
                      <Car className="w-3 h-3 sm:w-4 sm:h-4" /> <span className="hidden sm:inline">Transfers</span><span className="sm:hidden">Transfer</span>
                    </TabsTrigger>
                    <TabsTrigger value="tours" className="flex items-center justify-center gap-1 sm:gap-2 px-2 py-2 text-xs sm:text-sm">
                      <Map className="w-3 h-3 sm:w-4 sm:h-4" /> Tours
                    </TabsTrigger>
                    <TabsTrigger value="group" className="flex items-center justify-center gap-1 sm:gap-2 px-2 py-2 text-xs sm:text-sm col-span-1 sm:col-span-1">
                      <Bus className="w-3 h-3 sm:w-4 sm:h-4" /> Group
                    </TabsTrigger>
                    <TabsTrigger value="train" className="flex items-center justify-center gap-1 sm:gap-2 px-2 py-2 text-xs sm:text-sm col-span-2 sm:col-span-1">
                      <Train className="w-3 h-3 sm:w-4 sm:h-4" /> Train
                    </TabsTrigger>
                  </TabsList>

                  <div className="max-h-[60vh] overflow-y-auto pr-2">
                    <TabsContent value="ai-planner">
                      <div className="p-4 bg-gradient-to-br from-purple-50 to-teal-50 rounded-xl">
                        <div className="text-center mb-4">
                          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-purple-500 to-teal-500 text-white px-4 py-1.5 rounded-full text-sm font-medium mb-2">
                            <Sparkles className="w-4 h-4" />
                            AI-Powered Trip Planning
                          </div>
                          <h3 className="text-lg font-bold text-gray-800">Create Your Perfect Itinerary</h3>
                        </div>

                        {/* Quick Setup */}
                        <div className="space-y-4">
                          {/* Trip Duration */}
                          <div className="bg-white rounded-xl p-4 shadow-sm">
                            <label className="text-sm font-medium text-gray-700 mb-2 block flex items-center gap-2">
                              <Calendar className="w-4 h-4 text-purple-500" />
                              Trip Duration
                            </label>
                            <div className="flex gap-2 flex-wrap">
                              {[5, 7, 10, 14].map((days) => (
                                <button
                                  key={days}
                                  onClick={() => setTripDays(days)}
                                  className={`px-4 py-2 rounded-lg font-medium transition-all ${tripDays === days
                                    ? 'bg-gradient-to-r from-purple-500 to-teal-500 text-white shadow-md'
                                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                    }`}
                                >
                                  {days} Days
                                </button>
                              ))}
                            </div>
                          </div>

                          {/* Travelers */}
                          <div className="bg-white rounded-xl p-4 shadow-sm">
                            <label className="text-sm font-medium text-gray-700 mb-3 block flex items-center gap-2">
                              <Users className="w-4 h-4 text-purple-500" />
                              Travelers
                            </label>
                            <div className="grid grid-cols-2 gap-4">
                              {/* Adults */}
                              <div className="bg-gray-50 rounded-xl p-3">
                                <span className="text-sm text-gray-600 block mb-2">Adults (12+)</span>
                                <div className="flex items-center justify-between">
                                  <button
                                    onClick={() => setAdults(Math.max(1, adults - 1))}
                                    className="w-10 h-10 rounded-xl bg-purple-100 hover:bg-purple-200 flex items-center justify-center text-purple-700 font-bold text-xl transition-colors"
                                  >
                                    −
                                  </button>
                                  <span className="font-bold text-2xl text-gray-900 w-10 text-center">{adults}</span>
                                  <button
                                    onClick={() => setAdults(adults + 1)}
                                    className="w-10 h-10 rounded-xl bg-purple-100 hover:bg-purple-200 flex items-center justify-center text-purple-700 font-bold text-xl transition-colors"
                                  >
                                    +
                                  </button>
                                </div>
                              </div>
                              {/* Children */}
                              <div className="bg-gray-50 rounded-xl p-3">
                                <span className="text-sm text-gray-600 block mb-2">Children (2-11)</span>
                                <div className="flex items-center justify-between">
                                  <button
                                    onClick={() => setChildren(Math.max(0, children - 1))}
                                    className="w-10 h-10 rounded-xl bg-teal-100 hover:bg-teal-200 flex items-center justify-center text-teal-700 font-bold text-xl transition-colors"
                                  >
                                    −
                                  </button>
                                  <span className="font-bold text-2xl text-gray-900 w-10 text-center">{children}</span>
                                  <button
                                    onClick={() => setChildren(children + 1)}
                                    className="w-10 h-10 rounded-xl bg-teal-100 hover:bg-teal-200 flex items-center justify-center text-teal-700 font-bold text-xl transition-colors"
                                  >
                                    +
                                  </button>
                                </div>
                              </div>
                            </div>
                          </div>

                          {/* Interests */}
                          <div className="bg-white rounded-xl p-4 shadow-sm">
                            <label className="text-sm font-medium text-gray-700 mb-2 block flex items-center gap-2">
                              <Compass className="w-4 h-4 text-purple-500" />
                              What interests you?
                            </label>
                            <div className="grid grid-cols-3 gap-2">
                              {interestOptions.map((interest) => (
                                <button
                                  key={interest.id}
                                  onClick={() => toggleInterest(interest.id)}
                                  className={`p-2 rounded-lg text-sm font-medium transition-all flex flex-col items-center gap-1 ${selectedInterests.includes(interest.id)
                                    ? 'bg-gradient-to-r from-purple-500 to-teal-500 text-white shadow-md'
                                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                    }`}
                                >
                                  <span className="text-lg">{interest.icon}</span>
                                  <span className="text-xs">{interest.label}</span>
                                </button>
                              ))}
                            </div>
                          </div>

                          {/* Generate Button */}
                          <Button
                            onClick={handleAIPlannerContinue}
                            className="w-full bg-gradient-to-r from-purple-500 to-teal-500 hover:from-purple-600 hover:to-teal-600 text-white py-6 text-lg font-semibold rounded-xl shadow-lg"
                          >
                            <Sparkles className="w-5 h-5 mr-2" />
                            Generate My Itinerary
                            <ArrowRight className="w-5 h-5 ml-2" />
                          </Button>

                          <p className="text-xs text-center text-gray-500">
                            Get a personalized day-by-day itinerary with activities, hotels & pricing
                          </p>
                        </div>
                      </div>
                    </TabsContent>
                    <TabsContent value="transfer">
                      <TransferBookingForm />
                    </TabsContent>
                    <TabsContent value="tours">
                      <PrivateTourBookingForm />
                    </TabsContent>
                    <TabsContent value="group">
                      <GroupTransportBookingForm />
                    </TabsContent>
                    <TabsContent value="train">
                      <TrainBookingForm />
                    </TabsContent>
                  </div>
                </Tabs>
              </div>
            </div>
          </div>
          </div>
        </div>

      {/* Bottom Gradient */}
      <div style={{
        position: 'absolute',
        bottom: 0,
        left: 0,
        width: '100%',
        height: '150px',
        background: 'linear-gradient(to top, #000, transparent)',
        zIndex: 5
      }} />

    </div>
  );
};

export default LuxuryHeroSection;
