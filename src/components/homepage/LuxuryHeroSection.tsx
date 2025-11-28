import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Car, ChevronDown, Star, Shield, Headphones, Map, Bus, Train, Crown, Building2, CalendarCheck, Sparkles, Calendar, Users, Compass, ArrowRight, Plus, Minus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import TransferBookingForm from '@/modules/transfers/components/TransferBookingForm';
import PrivateTourBookingForm from '@/components/booking/PrivateTourBookingForm';
import GroupTransportBookingForm from '@/components/booking/GroupTransportBookingForm';
import TrainBookingForm from '@/components/booking/TrainBookingForm';
import { getHeroSlides, HeroSlide, DEFAULT_SLIDES } from '@/services/heroService';

interface LuxuryHeroSectionProps {
  hoveredRegion?: { name: string; description: string } | null;
  onLocationsChange?: (locations: { pickup: string; dropoff: string }) => void;
}

const LuxuryHeroSection = ({ hoveredRegion, onLocationsChange }: LuxuryHeroSectionProps) => {
  const navigate = useNavigate();
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [currentSlide, setCurrentSlide] = useState<HeroSlide>(DEFAULT_SLIDES[0]);
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
    const updateSlideBasedOnHour = async () => {
      try {
        const slides = await getHeroSlides();
        // Filter out slides with empty or invalid image URLs
        const validSlides = slides?.filter(slide => slide.image && slide.image.trim() !== '') || [];

        const hour = new Date().getHours();
        if (validSlides.length > 0) {
          const index = hour % validSlides.length;
          setCurrentSlide(validSlides[index]);
        } else {
          // Use default slides if no valid slides from Firebase
          const index = hour % DEFAULT_SLIDES.length;
          setCurrentSlide(DEFAULT_SLIDES[index]);
        }
      } catch (error) {
        console.error('Failed to update slide:', error);
        // Use default slide on error
        const hour = new Date().getHours();
        const index = hour % DEFAULT_SLIDES.length;
        setCurrentSlide(DEFAULT_SLIDES[index]);
      } finally {
        setLoading(false);
      }
    };

    updateSlideBasedOnHour();

    const interval = setInterval(() => {
      const date = new Date();
      if (date.getMinutes() === 0) {
        updateSlideBasedOnHour();
      }
    }, 60000);

    return () => clearInterval(interval);
  }, []);

  const scrollToContent = () => {
    const content = document.getElementById('featured-destinations');
    if (content) {
      content.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div style={{
      position: 'relative',
      height: '100vh',
      width: '100%',
      overflow: 'hidden',
      backgroundColor: '#1a1a2e',
      backgroundImage: `url('https://i.imgur.com/AEnBWJf.jpeg')`,
      backgroundSize: 'cover',
      backgroundPosition: 'center'
    }}>
      {/* Background Image */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        zIndex: 0
      }}>
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          backgroundColor: 'rgba(0,0,0,0.4)',
          zIndex: 1
        }} />
        <img
          src={currentSlide.image}
          alt={currentSlide.title}
          onError={(e) => {
            e.currentTarget.style.display = 'none'; // Hide broken image to avoid alt text in corner
            e.currentTarget.parentElement!.style.backgroundImage = `url('https://i.imgur.com/AEnBWJf.jpeg')`;
            e.currentTarget.parentElement!.style.backgroundSize = 'cover';
            e.currentTarget.parentElement!.style.backgroundPosition = 'center';
          }}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            objectPosition: 'center',
            opacity: loading ? 0 : 1,
            transition: 'opacity 1s ease-in-out'
          }}
        />
      </div>

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

        {/* Main Text Content */}
        <div style={{
          textAlign: 'center',
          marginBottom: '40px',
          maxWidth: '900px',
          width: '100%'
        }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            backgroundColor: 'rgba(255,255,255,0.1)',
            backdropFilter: 'blur(10px)',
            padding: '8px 16px',
            borderRadius: '9999px',
            marginBottom: '24px',
            border: '1px solid rgba(255,255,255,0.2)'
          }}>
            <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
            <span style={{ fontSize: '14px', fontWeight: 500 }}>#1 Premium Travel Service in Sri Lanka</span>
          </div>

          <h1 style={{
            fontSize: 'clamp(40px, 5vw, 80px)',
            fontWeight: 'bold',
            lineHeight: 1.1,
            marginBottom: '24px',
            textShadow: '0 2px 10px rgba(0,0,0,0.3)',
            fontFamily: 'Playfair Display, serif'
          }}>
            {currentSlide.title}
          </h1>

          <p style={{
            fontSize: 'clamp(18px, 2vw, 24px)',
            maxWidth: '700px',
            margin: '0 auto 32px',
            textShadow: '0 2px 5px rgba(0,0,0,0.3)',
            opacity: 0.9
          }}>
            {currentSlide.subtitle}
          </p>

          {/* Trust Indicators */}
          <div style={{
            display: 'flex',
            justifyContent: 'center',
            gap: '30px',
            flexWrap: 'wrap',
            marginBottom: '40px'
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

          {/* Quick Access Buttons */}
          {!isBookingOpen && (
            <div className="flex flex-wrap justify-center gap-6 mb-8 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-200">
              <Link to="/tours/luxury">
                <button className="luxury-secondary-btn group relative overflow-hidden rounded-full bg-gradient-to-r from-purple-500/10 to-pink-500/10 backdrop-blur-md border border-purple-400/30 px-8 py-6 text-white transition-all duration-500 ease-out hover:border-purple-400/60 hover:bg-gradient-to-r hover:from-purple-500/20 hover:to-pink-500/20 hover:shadow-lg hover:shadow-purple-500/20 hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-purple-400/50 focus:ring-offset-2 focus:ring-offset-transparent">
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 ease-out"></div>
                  <div className="relative flex items-center gap-3">
                    <Crown className="w-5 h-5 text-purple-300 group-hover:text-yellow-300 transition-colors duration-300" />
                    <span className="font-semibold text-lg">Elite Concierge</span>
                  </div>
                </button>
              </Link>

              <Link to="/hotels">
                <button className="luxury-secondary-btn group relative overflow-hidden rounded-full bg-gradient-to-r from-blue-500/10 to-cyan-500/10 backdrop-blur-md border border-blue-400/30 px-8 py-6 text-white transition-all duration-500 ease-out hover:border-blue-400/60 hover:bg-gradient-to-r hover:from-blue-500/20 hover:to-cyan-500/20 hover:shadow-lg hover:shadow-blue-500/20 hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-blue-400/50 focus:ring-offset-2 focus:ring-offset-transparent">
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 ease-out"></div>
                  <div className="relative flex items-center gap-3">
                    <Building2 className="w-5 h-5 text-blue-300 group-hover:text-cyan-300 transition-colors duration-300" />
                    <span className="font-semibold text-lg">Luxury Hotels</span>
                  </div>
                </button>
              </Link>

              <Link to="/book-now">
                <button className="luxury-secondary-btn group relative overflow-hidden rounded-full bg-gradient-to-r from-orange-500/10 to-red-500/10 backdrop-blur-md border border-orange-400/30 px-8 py-6 text-white transition-all duration-500 ease-out hover:border-orange-400/60 hover:bg-gradient-to-r hover:from-orange-500/20 hover:to-red-500/20 hover:shadow-lg hover:shadow-orange-500/20 hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-orange-400/50 focus:ring-offset-2 focus:ring-offset-transparent">
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 ease-out"></div>
                  <div className="relative flex items-center gap-3">
                    <CalendarCheck className="w-5 h-5 text-orange-300 group-hover:text-yellow-300 transition-colors duration-300" />
                    <span className="font-semibold text-lg">Book Now</span>
                  </div>
                </button>
              </Link>
            </div>
          )}

          {/* Booking Widget Toggle */}
          <div style={{ position: 'relative', zIndex: 50 }}>
            {!isBookingOpen ? (
              <button
                onClick={() => setIsBookingOpen(true)}
                className="luxury-primary-btn group relative overflow-hidden rounded-full bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-600 px-12 py-8 text-white font-bold text-2xl transition-all duration-700 ease-out hover:shadow-2xl hover:shadow-emerald-500/30 hover:scale-105 focus:outline-none focus:ring-4 focus:ring-emerald-400/30 focus:ring-offset-4 focus:ring-offset-transparent transform-gpu"
                style={{
                  background: 'linear-gradient(135deg, #059669 0%, #0d9488 50%, #0891b2 100%)',
                  boxShadow: '0 4px 20px rgba(5, 150, 105, 0.3), 0 2px 10px rgba(5, 150, 105, 0.2)',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.boxShadow = '0 8px 40px rgba(5, 150, 105, 0.4), 0 4px 20px rgba(5, 150, 105, 0.3)';
                  e.currentTarget.style.transform = 'scale(1.05) translateY(-2px)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.boxShadow = '0 4px 20px rgba(5, 150, 105, 0.3), 0 2px 10px rgba(5, 150, 105, 0.2)';
                  e.currentTarget.style.transform = 'scale(1) translateY(0)';
                }}
              >
                {/* Magnetic ripple effect */}
                <div className="absolute inset-0 rounded-full bg-gradient-to-r from-white/0 via-white/10 to-white/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

                {/* Subtle shimmer */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000 ease-out"></div>

                {/* Premium glow ring */}
                <div className="absolute inset-0 rounded-full border-2 border-white/20 group-hover:border-white/40 transition-colors duration-500"></div>

                <div className="relative flex items-center gap-4">
                  <Car className="w-7 h-7 text-white/90 group-hover:text-white transition-colors duration-300" />
                  <span className="relative z-10">Book Your Journey</span>
                </div>

                {/* Floating accent */}
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-yellow-400 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500 animate-pulse"></div>
              </button>
            ) : (
              <div className="w-full max-w-4xl mx-auto bg-white rounded-xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-300">
                <div className="bg-blue-600 p-4 flex justify-between items-center">
                  <h3 className="text-white font-bold text-lg flex items-center gap-2">
                    <Car className="w-5 h-5" />
                    Book Your Journey
                  </h3>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setIsBookingOpen(false)}
                    className="text-white hover:bg-blue-700"
                  >
                    Close
                  </Button>
                </div>

                <div className="p-4 bg-gray-50">
                  <Tabs defaultValue="ai-planner" className="w-full">
                    <TabsList className="grid w-full grid-cols-5 mb-4">
                      <TabsTrigger value="ai-planner" className="flex items-center gap-2 bg-gradient-to-r from-purple-500/10 to-teal-500/10 data-[state=active]:from-purple-500 data-[state=active]:to-teal-500 data-[state=active]:text-white">
                        <Sparkles className="w-4 h-4" /> AI Plan
                      </TabsTrigger>
                      <TabsTrigger value="transfer" className="flex items-center gap-2">
                        <Car className="w-4 h-4" /> Transfers
                      </TabsTrigger>
                      <TabsTrigger value="tours" className="flex items-center gap-2">
                        <Map className="w-4 h-4" /> Tours
                      </TabsTrigger>
                      <TabsTrigger value="group" className="flex items-center gap-2">
                        <Bus className="w-4 h-4" /> Group
                      </TabsTrigger>
                      <TabsTrigger value="train" className="flex items-center gap-2">
                        <Train className="w-4 h-4" /> Train
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
                                    className={`px-4 py-2 rounded-lg font-medium transition-all ${
                                      tripDays === days
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
                                    className={`p-2 rounded-lg text-sm font-medium transition-all flex flex-col items-center gap-1 ${
                                      selectedInterests.includes(interest.id)
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
            )}
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      {!isBookingOpen && (
        <div style={{
          position: 'absolute',
          bottom: '40px',
          left: '50%',
          transform: 'translateX(-50%)',
          zIndex: 10,
          animation: 'bounce 2s infinite'
        }}>
          <Button
            variant="ghost"
            size="icon"
            onClick={scrollToContent}
            className="text-white hover:bg-white/10 rounded-full"
          >
            <ChevronDown className="w-8 h-8" />
          </Button>
        </div>
      )}

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

      <style>{`
        @keyframes bounce {
          0%, 20%, 50%, 80%, 100% {
            transform: translateY(0) translateX(-50%);
          }
          40% {
            transform: translateY(-10px) translateX(-50%);
          }
          60% {
            transform: translateY(-5px) translateX(-50%);
          }
        }

        /* Material Design easing curves for premium feel */
        .luxury-primary-btn {
          transition: all 0.4s cubic-bezier(0.4, 0.0, 0.2, 1);
        }

        .luxury-secondary-btn {
          transition: all 0.3s cubic-bezier(0.4, 0.0, 0.2, 1);
        }

        /* Subtle hover effects for secondary buttons */
        .luxury-secondary-btn:hover {
          transform: translateY(-1px);
        }

        /* Respect user preferences for reduced motion */
        @media (prefers-reduced-motion: reduce) {
          .luxury-primary-btn,
          .luxury-secondary-btn {
            transition: none;
          }

          .luxury-primary-btn:hover,
          .luxury-secondary-btn:hover {
            transform: none;
          }
        }

        /* Focus states for accessibility */
        .luxury-primary-btn:focus-visible,
        .luxury-secondary-btn:focus-visible {
          outline: 2px solid rgba(255, 255, 255, 0.8);
          outline-offset: 2px;
        }
      `}</style>
    </div>
  );
};

export default LuxuryHeroSection;
