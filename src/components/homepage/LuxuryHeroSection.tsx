import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Car, Plane, MapPin, Calendar, Users, Clock, ChevronDown, Star, Shield, Headphones } from 'lucide-react';
import { Button } from '@/components/ui/button';
import TransferBookingForm from '@/modules/transfers/components/TransferBookingForm';
import { heroSlidesService } from '@/services/cmsService';
import type { HeroSlide } from '@/types/cms';

interface LuxuryHeroSectionProps {
  hoveredRegion: {name: string, description: string} | null;
  onLocationsChange: (locations: { pickup: string; dropoff: string }) => void;
}

const LuxuryHeroSection = ({ hoveredRegion, onLocationsChange }: LuxuryHeroSectionProps) => {
  const [isBookingExpanded, setIsBookingExpanded] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [loading, setLoading] = useState(true);

  // Default fallback slides in case Firestore is empty or fails
  const defaultSlides = [
    {
      image: "https://i.imgur.com/AEnBWJf.jpeg",
      title: "Sigiriya Rock Fortress",
      subtitle: "The Eighth Wonder of the World",
      description: "Ancient royal citadel atop a 200-meter rock plateau, featuring stunning frescoes and the iconic Lion's Gate"
    },
    {
      image: "https://i.imgur.com/cTqS05p.jpeg",
      title: "Nine Arch Bridge",
      subtitle: "Colonial Engineering Marvel",
      description: "Iconic railway viaduct in Ella built entirely of stone and brick, with trains passing through misty mountains"
    },
    {
      image: "https://i.imgur.com/QBIw5qw.jpeg",
      title: "Ravana Falls",
      subtitle: "Legendary Cascade of the Hills",
      description: "Spectacular 82-foot waterfall named after the mythical King Ravana, surrounded by lush tropical rainforest"
    },
    {
      image: "https://i.imgur.com/oGUvzQL.jpeg",
      title: "Sri Lankan Leopard",
      subtitle: "Apex Predator of Yala",
      description: "The elusive Panthera pardus kotiya, found only in Sri Lanka, prowling through Yala National Park's wilderness"
    },
    {
      image: "https://i.imgur.com/l2jvb2Y.jpeg",
      title: "Blue Whale",
      subtitle: "Sail with the Giants of Trinco",
      description: "The majestic blue whale. Just minutes offshore, these gentle giants surface gracefully, offering breathtaking sightings between March–April and August–October"
    },
    {
      image: "https://i.imgur.com/xRFe6sI.jpeg",
      title: "Arugam Bay",
      subtitle: "World-Class Surfing Paradise",
      description: "Pristine crescent-shaped beach renowned for perfect waves, golden sands, and vibrant beach culture"
    },
    {
      image: "https://i.imgur.com/qHEsIhu.jpeg",
      title: "Wild Elephant Gathering",
      subtitle: "The Gathering at Minneriya",
      description: "Hundreds of Asian elephants congregate at Minneriya Tank during the dry season - one of nature's greatest spectacles"
    }
  ];

  const [heroSlides, setHeroSlides] = useState(defaultSlides);

  // Load hero slides from Firestore CMS
  useEffect(() => {
    const loadHeroSlides = async () => {
      try {
        setLoading(true);
        const slides = await heroSlidesService.getAll();

        // Only update if we got slides from Firestore
        if (slides && slides.length > 0) {
          console.log('✅ Loaded', slides.length, 'hero slides from CMS');
          setHeroSlides(slides);
        } else {
          console.log('ℹ️ No slides in CMS, using default slides');
        }
      } catch (error) {
        console.error('❌ Error loading hero slides from CMS:', error);
        // Keep default slides on error
      } finally {
        setLoading(false);
      }
    };

    loadHeroSlides();
  }, []);

  // Preload images for smooth transitions
  useEffect(() => {
    heroSlides.forEach((slide) => {
      const img = new Image();
      img.src = slide.image;
    });
  }, [heroSlides]);

  useEffect(() => {
    if (heroSlides.length > 0) {
      const timer = setInterval(() => {
        setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
      }, 5000);
      return () => clearInterval(timer);
    }
  }, [heroSlides.length]);

  // Safety check to ensure we have slides
  if (!heroSlides || heroSlides.length === 0) {
    return (
      <section className="relative w-full min-h-screen overflow-hidden flex items-center justify-center bg-gray-900">
        <div className="text-white text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
          <p>Loading hero section...</p>
        </div>
      </section>
    );
  }

  const currentSlideData = heroSlides[currentSlide];

  return (
    <section className="relative w-full min-h-screen overflow-hidden">
      {/* Background Slideshow */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentSlide}
          initial={{ opacity: 0, scale: 1.05 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 2, ease: "easeInOut" }}
          className="absolute inset-0 z-0"
        >
          <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/30 to-black/60 z-10" />
          <img
            src={currentSlideData.image}
            alt={currentSlideData.title}
            className="w-full h-full object-cover"
          />
        </motion.div>
      </AnimatePresence>

      {/* Hero Content */}
      <div className="relative z-20 min-h-screen flex flex-col justify-center">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="max-w-7xl mx-auto">
            {/* Hero Text */}
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-center mb-12"
            >
              <motion.h1
                key={currentSlide}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="text-5xl md:text-7xl lg:text-8xl font-bold text-white mb-6 font-playfair"
              >
                {currentSlideData.title}
              </motion.h1>

              <motion.p
                key={`subtitle-${currentSlide}`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="text-2xl md:text-3xl text-white/90 mb-4 font-light"
              >
                {currentSlideData.subtitle}
              </motion.p>

              <motion.p
                key={`desc-${currentSlide}`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                className="text-lg md:text-xl text-white/80 max-w-3xl mx-auto mb-8"
              >
                {currentSlideData.description}
              </motion.p>

              {/* CTA Button (if configured in CMS) */}
              {currentSlideData.ctaText && currentSlideData.ctaLink && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.6 }}
                  className="mb-8"
                >
                  <Button
                    asChild
                    className="bg-orange-600 hover:bg-orange-700 text-white font-semibold px-8 py-6 rounded-xl text-lg transition-all duration-300 transform hover:scale-105 shadow-2xl"
                  >
                    <a href={currentSlideData.ctaLink}>
                      {currentSlideData.ctaText}
                    </a>
                  </Button>
                </motion.div>
              )}

              {/* Trust Indicators */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6 }}
                className="flex flex-wrap items-center justify-center gap-6 mb-12"
              >
                <div className="flex items-center gap-2 text-white/90">
                  <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                  <span className="font-semibold">4.9/5</span>
                  <span className="text-white/70">from 2,847 reviews</span>
                </div>
                <div className="flex items-center gap-2 text-white/90">
                  <Shield className="w-5 h-5" />
                  <span>100% Safe & Secure</span>
                </div>
                <div className="flex items-center gap-2 text-white/90">
                  <Headphones className="w-5 h-5" />
                  <span>24/7 Support</span>
                </div>
              </motion.div>
            </motion.div>

            {/* Transfer Booking Widget */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="relative"
            >
              {!isBookingExpanded ? (
                /* Elegant Compact Booking Widget */
                <div className="bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl p-8 max-w-5xl mx-auto">
                  <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 items-end">
                    {/* Pickup Location */}
                    <div className="lg:col-span-1">
                      <label className="block text-sm font-semibold text-gray-700 mb-2">From</label>
                      <div className="relative">
                        <MapPin className="absolute left-3 top-3.5 w-5 h-5 text-gray-400" />
                        <input
                          type="text"
                          placeholder="Pickup location"
                          className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                          onClick={() => setIsBookingExpanded(true)}
                        />
                      </div>
                    </div>

                    {/* Destination */}
                    <div className="lg:col-span-1">
                      <label className="block text-sm font-semibold text-gray-700 mb-2">To</label>
                      <div className="relative">
                        <MapPin className="absolute left-3 top-3.5 w-5 h-5 text-gray-400" />
                        <input
                          type="text"
                          placeholder="Drop-off location"
                          className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                          onClick={() => setIsBookingExpanded(true)}
                        />
                      </div>
                    </div>

                    {/* Date */}
                    <div className="lg:col-span-1">
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Date</label>
                      <div className="relative">
                        <Calendar className="absolute left-3 top-3.5 w-5 h-5 text-gray-400" />
                        <input
                          type="text"
                          placeholder="Select date"
                          className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                          onClick={() => setIsBookingExpanded(true)}
                        />
                      </div>
                    </div>

                    {/* Passengers */}
                    <div className="lg:col-span-1">
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Passengers</label>
                      <div className="relative">
                        <Users className="absolute left-3 top-3.5 w-5 h-5 text-gray-400" />
                        <input
                          type="text"
                          placeholder="Guests"
                          className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                          onClick={() => setIsBookingExpanded(true)}
                        />
                      </div>
                    </div>

                    {/* Search Button */}
                    <div className="lg:col-span-1">
                      <Button
                        onClick={() => setIsBookingExpanded(true)}
                        className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg"
                      >
                        <Car className="w-5 h-5 mr-2" />
                        Book Transfer
                      </Button>
                    </div>
                  </div>

                  {/* Popular Routes */}
                  <div className="mt-6 flex flex-wrap items-center gap-4">
                    <span className="text-sm font-medium text-gray-600">Popular routes:</span>
                    <div className="flex flex-wrap gap-2">
                      {['Airport → Colombo', 'Colombo → Kandy', 'Kandy → Ella', 'Galle → Mirissa'].map((route) => (
                        <button
                          key={route}
                          className="text-sm px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-full transition-colors"
                          onClick={() => setIsBookingExpanded(true)}
                        >
                          {route}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              ) : (
                /* Expanded Booking Form */
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl overflow-hidden max-w-6xl mx-auto"
                >
                  {/* Form Header */}
                  <div className="bg-gradient-to-r from-blue-600 to-blue-700 p-6 text-white">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-2xl font-bold mb-1">Book Your Premium Transfer</h3>
                        <p className="text-blue-100">Professional drivers • Luxury vehicles • Best prices guaranteed</p>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setIsBookingExpanded(false)}
                        className="text-white hover:bg-white/10 rounded-full"
                      >
                        <ChevronDown className="w-6 h-6 rotate-180" />
                      </Button>
                    </div>
                  </div>
                  
                  {/* Form Content */}
                  <div className="p-6">
                    <TransferBookingForm />
                  </div>
                </motion.div>
              )}
            </motion.div>

            {/* Feature Highlights */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto"
            >
              {[
                { icon: Plane, title: "Airport Transfers", desc: "Meet & greet service" },
                { icon: Car, title: "Private Cars", desc: "Luxury fleet available" },
                { icon: Clock, title: "24/7 Available", desc: "Round the clock service" },
                { icon: Shield, title: "Safe Travel", desc: "Licensed & insured" }
              ].map((feature, index) => (
                <div key={index} className="text-center text-white">
                  <div className="inline-flex items-center justify-center w-12 h-12 bg-white/20 backdrop-blur-sm rounded-full mb-3">
                    <feature.icon className="w-6 h-6" />
                  </div>
                  <h4 className="font-semibold mb-1">{feature.title}</h4>
                  <p className="text-sm text-white/70">{feature.desc}</p>
                </div>
              ))}
            </motion.div>
          </div>
        </div>
      </div>

      {/* Slide Indicators */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex gap-2 z-30">
        {heroSlides.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentSlide(index)}
            className={`w-2 h-2 rounded-full transition-all duration-300 ${
              currentSlide === index ? 'w-8 bg-white' : 'bg-white/50'
            }`}
          />
        ))}
      </div>
    </section>
  );
};

export default LuxuryHeroSection;