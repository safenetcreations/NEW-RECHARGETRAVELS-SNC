import React, { useState, useEffect, useMemo } from 'react';
import { Helmet } from 'react-helmet-async';
import { useAboutSriLankaContent } from '@/hooks/useAboutSriLankaContent';
import { getAboutSriLankaHeroSlides, AboutSriLankaHeroSlide, DEFAULT_ABOUT_SLIDES } from '@/services/aboutSriLankaHeroService';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Globe, Users, Leaf, Award, MapPin, Camera,
  Play, X, ChevronLeft, ChevronRight, Star,
  Calendar, Clock, Palmtree, Mountain, Waves,
  Sunrise, UtensilsCrossed, Heart, Quote,
  Thermometer, CloudRain, Sun, Plane, Car, Train,
  Phone, Shield, CreditCard, Wifi, Languages,
  Utensils, Coffee, Beer, Sparkles, ChevronDown,
  ThumbsUp
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Link } from 'react-router-dom';

/**
 * ABOUT SRI LANKA PAGE - ENHANCED LUXURY EDITION
 *
 * Features:
 * - Full-screen hero with auto-sliding images (admin manageable)
 * - Comprehensive tourist information
 * - Best time to visit section
 * - Getting around guide
 * - Essential travel tips
 * - Food & cuisine section
 * - Safety information
 */

interface AboutSriLankaProps {
  embedded?: boolean;
}

const AboutSriLanka: React.FC<AboutSriLankaProps> = ({ embedded = false }) => {
  const { content, loading, error } = useAboutSriLankaContent();
  const [selectedVideo, setSelectedVideo] = useState<string | null>(null);
  const [selectedGalleryImage, setSelectedGalleryImage] = useState<number | null>(null);
  const [currentTestimonial, setCurrentTestimonial] = useState(0);

  // Hero slider state
  const [heroSlides, setHeroSlides] = useState<AboutSriLankaHeroSlide[]>(DEFAULT_ABOUT_SLIDES);
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const [heroLoading, setHeroLoading] = useState(true);

  // Load hero slides
  useEffect(() => {
    const loadHeroSlides = async () => {
      try {
        const slides = await getAboutSriLankaHeroSlides();
        // Filter out slides with empty or invalid image URLs
        const validSlides = slides?.filter(slide => slide.image && slide.image.trim() !== '') || [];
        if (validSlides.length > 0) {
          setHeroSlides(validSlides);
        }
        // Keep DEFAULT_ABOUT_SLIDES if no valid slides from Firebase
      } catch (error) {
        console.error('Failed to load hero slides:', error);
      } finally {
        setHeroLoading(false);
      }
    };
    loadHeroSlides();
  }, []);

  // Sync hero slides with CMS content
  useEffect(() => {
    if (content?.heroSlides && content.heroSlides.length > 0) {
      const customSlides = content.heroSlides
        .filter((slide) => slide.image && slide.image.trim() !== '')
        .map((slide, index) => ({
          id: `cms-slide-${index}`,
          ...slide
        }));

      if (customSlides.length > 0) {
        setHeroSlides(customSlides);
        return;
      }
    }

    if (content?.heroImage) {
      setHeroSlides([{
        id: 'cms-hero',
        image: content.heroImage,
        title: content.heroTitle || 'The Pearl of the Indian Ocean',
        subtitle: content.heroSubtitle || 'Discover Sri Lanka\'s Rich Heritage and Natural Beauty',
        badge: 'Discover Paradise'
      }]);
    }
  }, [content]);

  // Auto-advance slides every 6 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlideIndex((prev) => (prev + 1) % heroSlides.length);
    }, 6000);
    return () => clearInterval(interval);
  }, [heroSlides.length]);

  // Extract content data with memoization - MUST be before any early returns
  const contentAny = content as any;
  const testimonials = useMemo(() => contentAny.testimonials ?? [], [contentAny.testimonials]);

  // Auto-rotate testimonials every 5 seconds - MUST be before any early returns
  useEffect(() => {
    if (!testimonials || testimonials.length <= 1) return;

    const interval = setInterval(() => {
      setCurrentTestimonial((prev) => {
        const next = (prev + 1) % testimonials.length;
        return next;
      });
    }, 5000);

    return () => clearInterval(interval);
  }, [testimonials]);

  // Extract data before early returns so hooks are consistent
  const destinations = contentAny.destinations ?? [];
  const experiences = contentAny.experiences ?? [];
  const gallery = contentAny.gallery ?? [];
  const videoTours = contentAny.videoTours ?? [];

  // Gallery validation effect - MUST be before early returns
  useEffect(() => {
    if (!gallery.length) {
      setSelectedGalleryImage(null);
      return;
    }

    if (selectedGalleryImage !== null && selectedGalleryImage >= gallery.length) {
      setSelectedGalleryImage(0);
    }
  }, [gallery.length, selectedGalleryImage]);

  const currentSlide = heroSlides[currentSlideIndex];

  // Navigation functions
  const nextSlide = () => {
    setCurrentSlideIndex((prev) => (prev + 1) % heroSlides.length);
  };

  const prevSlide = () => {
    setCurrentSlideIndex((prev) => (prev - 1 + heroSlides.length) % heroSlides.length);
  };

  const scrollToContent = () => {
    document.getElementById('explore')?.scrollIntoView({ behavior: 'smooth' });
  };

  // Loading state - AFTER all hooks
  if (loading) {
    return (
      <div className={`${embedded ? 'min-h-[400px]' : 'min-h-screen'} flex items-center justify-center bg-gradient-to-br from-blue-50 to-teal-50`}>
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600 mx-auto mb-6"></div>
          <p className="text-xl text-gray-600 font-medium">Loading Sri Lanka information...</p>
        </div>
      </div>
    );
  }

  const stats = [
    { icon: Globe, ...(content.stats?.area ?? {}) },
    { icon: Users, ...(content.stats?.population ?? {}) },
    { icon: Leaf, ...(content.stats?.species ?? {}) },
    { icon: Award, ...(content.stats?.unesco ?? {}) }
  ];

  // Navigation functions for gallery
  const nextGalleryImage = () => {
    if (selectedGalleryImage !== null) {
      setSelectedGalleryImage((selectedGalleryImage + 1) % gallery.length);
    }
  };

  const prevGalleryImage = () => {
    if (selectedGalleryImage !== null) {
      setSelectedGalleryImage((selectedGalleryImage - 1 + gallery.length) % gallery.length);
    }
  };

  const nextTestimonial = () => {
    setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
  };

  const prevTestimonial = () => {
    setCurrentTestimonial((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  // Best time to visit data
  const seasons = [
    {
      name: "December - March",
      title: "Best for West & South Coast",
      icon: Sun,
      description: "Perfect beach weather, ideal for surfing in Hikkaduwa, whale watching in Mirissa",
      temp: "28-32°C",
      color: "from-orange-500 to-yellow-500"
    },
    {
      name: "May - September",
      title: "Best for East Coast",
      icon: Waves,
      description: "Great for Arugam Bay surfing, Trincomalee beaches, and Pasikuda snorkeling",
      temp: "27-30°C",
      color: "from-blue-500 to-cyan-500"
    },
    {
      name: "January - April",
      title: "Best for Hill Country",
      icon: Mountain,
      description: "Dry season for Ella, Nuwara Eliya, and tea plantation visits",
      temp: "15-25°C",
      color: "from-green-500 to-emerald-500"
    },
    {
      name: "February - July",
      title: "Best for Wildlife",
      icon: Palmtree,
      description: "Peak season for Yala leopards, Udawalawe elephants, and bird watching",
      temp: "26-32°C",
      color: "from-amber-500 to-orange-500"
    }
  ];

  // Getting around data
  const transportOptions = [
    {
      icon: Car,
      title: "Private Driver/Car",
      description: "Most comfortable way to explore. Air-conditioned vehicles with English-speaking drivers who double as guides.",
      tip: "Book through Recharge Travels for vetted, professional drivers",
      recommended: true
    },
    {
      icon: Train,
      title: "Scenic Railways",
      description: "One of the world's most beautiful train journeys. Kandy to Ella route is unmissable with stunning mountain views.",
      tip: "Book first class tickets in advance, especially for weekend travel"
    },
    {
      icon: Plane,
      title: "Domestic Flights",
      description: "Cinnamon Air and SriLankan Airlines offer seaplane and helicopter transfers to save time.",
      tip: "Perfect for reaching remote areas like Sigiriya or Trincomalee quickly"
    }
  ];

  // Essential tips
  const essentialTips = [
    {
      icon: Languages,
      title: "Language",
      info: "Sinhala & Tamil are official languages. English is widely spoken in tourist areas."
    },
    {
      icon: CreditCard,
      title: "Currency",
      info: "Sri Lankan Rupee (LKR). ATMs available everywhere. Credit cards accepted at hotels."
    },
    {
      icon: Phone,
      title: "SIM Cards",
      info: "Dialog, Mobitel, and Airtel offer tourist SIMs at the airport. About $5-10 for data."
    },
    {
      icon: Shield,
      title: "Safety",
      info: "Very safe for tourists. Use common sense, respect temples, and dress modestly at religious sites."
    },
    {
      icon: Wifi,
      title: "Connectivity",
      info: "4G coverage is excellent across the island. Most hotels and cafes have free WiFi."
    },
    {
      icon: Thermometer,
      title: "Climate",
      info: "Tropical climate year-round. Pack light clothes, but bring layers for hill country."
    }
  ];

  // Food & Cuisine
  const cuisineHighlights = [
    {
      icon: Utensils,
      title: "Rice & Curry",
      description: "The national dish - rice served with multiple curries, sambols, and papadum"
    },
    {
      icon: Coffee,
      title: "Ceylon Tea",
      description: "World-famous tea from the hill country. Visit a plantation for fresh brew"
    },
    {
      icon: UtensilsCrossed,
      title: "Hoppers",
      description: "Bowl-shaped pancakes - egg hoppers for breakfast are a must-try"
    },
    {
      icon: Sparkles,
      title: "Kottu Roti",
      description: "Chopped flatbread stir-fried with vegetables, egg, and your choice of meat"
    }
  ];

  return (
    <>
      {!embedded && (
        <Helmet>
          <title>{content.seoTitle}</title>
          <meta name="description" content={content.seoDescription} />
          <meta name="keywords" content={content.seoKeywords} />
          <meta property="og:title" content={content.seoTitle} />
          <meta property="og:description" content={content.seoDescription} />
          <meta property="og:image" content={currentSlide?.image || content.heroImage} />
          <meta property="og:type" content="website" />
          <meta name="twitter:card" content="summary_large_image" />
          <link rel="canonical" href="https://recharge-travels.com/about/sri-lanka" />
        </Helmet>
      )}

      <div className="bg-white">
        {/* ========== HERO SECTION - COMPLETELY REBUILT ========== */}
        <section className={`relative ${embedded ? 'h-[60vh] min-h-[500px]' : 'h-screen'} overflow-hidden`}>

          {/* LAYER 1: Background Images from Admin Panel */}
          {heroSlides.map((slide, index) => (
            <div
              key={slide.id || `slide-${index}`}
              className="absolute inset-0 w-full h-full"
              style={{
                opacity: index === currentSlideIndex ? 1 : 0,
                transition: 'opacity 1.2s ease-in-out',
                zIndex: 1
              }}
            >
              <img
                src={slide.image}
                alt={slide.title || 'Sri Lanka'}
                className="w-full h-full object-cover"
                loading="lazy"
              />
            </div>
          ))}

          {/* LAYER 2: Dark Overlay */}
          <div
            className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/40 to-black/60"
            style={{ zIndex: 2 }}
          />

          {/* LAYER 3: Static Content - Never moves, never animates */}
          <div
            className="absolute inset-0 flex flex-col items-center justify-center px-4"
            style={{ zIndex: 3 }}
          >
            {/* Badge */}
            <span className="inline-block bg-white/20 backdrop-blur-sm text-white border border-white/30 px-6 py-2 rounded-full text-sm font-semibold mb-6">
              Discover Paradise
            </span>

            {/* Main Title */}
            <h1
              className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-bold text-white text-center mb-4 leading-tight"
              style={{
                fontFamily: 'Playfair Display, serif',
                textShadow: '0 4px 20px rgba(0,0,0,0.4)'
              }}
            >
              Sri Lanka
            </h1>

            {/* Subtitle */}
            <p
              className="text-lg sm:text-xl md:text-2xl lg:text-3xl text-white/90 text-center mb-10 max-w-3xl font-light"
              style={{ textShadow: '0 2px 10px rgba(0,0,0,0.3)' }}
            >
              The Pearl of the Indian Ocean
            </p>

            {/* STATIC BUTTONS - Absolutely no animation */}
            <div className="flex flex-col sm:flex-row gap-4 sm:gap-6">
              <Link to="/destinations" className="block">
                <button
                  type="button"
                  className="flex items-center justify-center gap-3 bg-gradient-to-r from-orange-500 to-amber-500 text-white text-lg sm:text-xl font-bold px-8 sm:px-10 py-4 sm:py-5 rounded-full shadow-lg hover:from-orange-600 hover:to-amber-600 hover:shadow-xl transition-colors duration-200"
                  style={{ minWidth: '200px' }}
                >
                  <Sparkles className="w-5 h-5 sm:w-6 sm:h-6" />
                  Explore Now
                </button>
              </Link>

              <Link to="/ai-trip-planner" className="block">
                <button
                  type="button"
                  className="flex items-center justify-center gap-3 bg-white/15 backdrop-blur-sm text-white text-lg sm:text-xl font-bold px-8 sm:px-10 py-4 sm:py-5 rounded-full border-2 border-white hover:bg-white hover:text-gray-900 transition-colors duration-200"
                  style={{ minWidth: '200px' }}
                >
                  <Calendar className="w-5 h-5 sm:w-6 sm:h-6" />
                  Plan Your Trip
                </button>
              </Link>
            </div>
          </div>

          {/* LAYER 4: Navigation Controls */}
          {heroSlides.length > 1 && (
            <>
              {/* Left Arrow */}
              <button
                type="button"
                onClick={prevSlide}
                className="absolute left-4 sm:left-6 top-1/2 -translate-y-1/2 w-12 h-12 sm:w-14 sm:h-14 flex items-center justify-center bg-black/30 hover:bg-black/50 text-white rounded-full backdrop-blur-sm transition-colors duration-200"
                style={{ zIndex: 4 }}
                aria-label="Previous slide"
              >
                <ChevronLeft className="w-6 h-6 sm:w-8 sm:h-8" />
              </button>

              {/* Right Arrow */}
              <button
                type="button"
                onClick={nextSlide}
                className="absolute right-4 sm:right-6 top-1/2 -translate-y-1/2 w-12 h-12 sm:w-14 sm:h-14 flex items-center justify-center bg-black/30 hover:bg-black/50 text-white rounded-full backdrop-blur-sm transition-colors duration-200"
                style={{ zIndex: 4 }}
                aria-label="Next slide"
              >
                <ChevronRight className="w-6 h-6 sm:w-8 sm:h-8" />
              </button>

              {/* Slide Indicators */}
              <div
                className="absolute bottom-20 sm:bottom-24 left-1/2 -translate-x-1/2 flex gap-2 sm:gap-3"
                style={{ zIndex: 4 }}
              >
                {heroSlides.map((_, index) => (
                  <button
                    key={`indicator-${index}`}
                    type="button"
                    onClick={() => setCurrentSlideIndex(index)}
                    className={`h-2 sm:h-3 rounded-full transition-all duration-300 ${index === currentSlideIndex
                        ? 'w-8 sm:w-10 bg-orange-400'
                        : 'w-2 sm:w-3 bg-white/50 hover:bg-white/70'
                      }`}
                    aria-label={`Go to slide ${index + 1}`}
                  />
                ))}
              </div>
            </>
          )}

          {/* LAYER 5: Scroll Indicator */}
          <div
            className="absolute bottom-6 sm:bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center text-white/70 hover:text-white cursor-pointer transition-colors"
            style={{ zIndex: 4 }}
            onClick={scrollToContent}
          >
            <span className="text-xs sm:text-sm mb-1">Scroll to explore</span>
            <ChevronDown className="w-5 h-5 sm:w-6 sm:h-6 animate-bounce" />
          </div>
        </section>
        {/* ========== END HERO SECTION ========== */}

        {/* Main Introduction Section */}
        <section id="explore" className="py-24 bg-gradient-to-br from-blue-50 via-white to-teal-50">
          <div className="container mx-auto px-4 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
              <motion.div
                initial={{ opacity: 0, x: -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
              >
                <Badge className="mb-4 bg-blue-100 text-blue-700 px-4 py-1">About Sri Lanka</Badge>
                <h2 className="text-4xl md:text-6xl font-bold text-gray-900 mt-4 mb-6 font-playfair">
                  The Pearl of the Indian Ocean
                </h2>
                <p className="text-xl text-gray-700 mb-6 leading-relaxed">
                  {content.mainDescription}
                </p>
                <p className="text-xl text-gray-700 mb-8 leading-relaxed">
                  {content.secondaryDescription}
                </p>
                <div className="flex gap-4 flex-wrap">
                  <Link to="/destinations">
                    <Button
                      size="lg"
                      className="bg-blue-600 hover:bg-blue-700 text-white px-8 rounded-full"
                    >
                      <MapPin className="w-5 h-5 mr-2" />
                      View Destinations
                    </Button>
                  </Link>
                  <Link to="/book-now">
                    <Button
                      size="lg"
                      variant="outline"
                      className="border-2 border-blue-600 text-blue-600 hover:bg-blue-50 px-8 rounded-full"
                    >
                      <Calendar className="w-5 h-5 mr-2" />
                      Plan Your Trip
                    </Button>
                  </Link>
                </div>
              </motion.div>

              {/* Stats Grid */}
              <motion.div
                initial={{ opacity: 0, x: 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="grid grid-cols-2 gap-6"
              >
                {stats.map((stat, index) => {
                  const IconComponent = stat.icon;
                  return (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 30 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.6, delay: index * 0.1 }}
                      whileHover={{ scale: 1.05, boxShadow: "0 20px 40px rgba(0,0,0,0.1)" }}
                      className="text-center p-8 bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all cursor-pointer"
                    >
                      <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-teal-500 rounded-full flex items-center justify-center mx-auto mb-4">
                        <IconComponent className="w-8 h-8 text-white" />
                      </div>
                      <div className="text-4xl font-bold text-gray-900 mb-2">{stat.value}</div>
                      <div className="text-sm font-semibold text-gray-700 mb-1">{stat.label}</div>
                      <div className="text-xs text-gray-500">{stat.desc}</div>
                    </motion.div>
                  );
                })}
              </motion.div>
            </div>
          </div>
        </section>

        {/* Best Time to Visit Section */}
        <section className="py-24 bg-white">
          <div className="container mx-auto px-4 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="text-center mb-16"
            >
              <Badge className="mb-4 bg-amber-100 text-amber-700 px-4 py-1">
                <Calendar className="w-3 h-3 mr-1 inline" />
                Travel Planning
              </Badge>
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4 font-playfair">
                Best Time to Visit
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Sri Lanka enjoys two monsoon seasons, meaning there's always a perfect destination regardless of when you visit
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {seasons.map((season, index) => {
                const IconComponent = season.icon;
                return (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                    whileHover={{ scale: 1.05, y: -5 }}
                    className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100 hover:shadow-2xl transition-all"
                  >
                    <div className={`h-2 bg-gradient-to-r ${season.color}`}></div>
                    <div className="p-6">
                      <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${season.color} flex items-center justify-center mb-4`}>
                        <IconComponent className="w-7 h-7 text-white" />
                      </div>
                      <div className="text-sm font-bold text-gray-500 mb-1">{season.name}</div>
                      <h3 className="text-lg font-bold text-gray-900 mb-2">{season.title}</h3>
                      <p className="text-sm text-gray-600 mb-4">{season.description}</p>
                      <div className="flex items-center text-sm">
                        <Thermometer className="w-4 h-4 mr-2 text-gray-400" />
                        <span className="font-semibold text-gray-700">{season.temp}</span>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Getting Around Section */}
        <section className="py-24 bg-gradient-to-br from-slate-900 to-slate-800 text-white">
          <div className="container mx-auto px-4 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="text-center mb-16"
            >
              <Badge className="mb-4 bg-white/10 backdrop-blur-sm text-white border-white/20 px-4 py-1">
                <Car className="w-3 h-3 mr-1 inline" />
                Transportation
              </Badge>
              <h2 className="text-4xl md:text-5xl font-bold mb-4 font-playfair">
                Getting Around Sri Lanka
              </h2>
              <p className="text-xl text-gray-300 max-w-3xl mx-auto">
                Choose your preferred way to explore the island, from luxurious private transfers to scenic train journeys
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {transportOptions.map((option, index) => {
                const IconComponent = option.icon;
                return (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                    className={`relative bg-white/5 backdrop-blur-sm rounded-2xl p-8 border ${option.recommended ? 'border-emerald-500' : 'border-white/10'} hover:bg-white/10 transition-all`}
                  >
                    {option.recommended && (
                      <Badge className="absolute -top-3 right-4 bg-emerald-500 text-white">
                        Recommended
                      </Badge>
                    )}
                    <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center mb-6">
                      <IconComponent className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="text-xl font-bold mb-3">{option.title}</h3>
                    <p className="text-gray-300 mb-4">{option.description}</p>
                    <div className="bg-white/10 rounded-lg p-3">
                      <p className="text-sm text-emerald-400">
                        <Star className="w-4 h-4 inline mr-1" />
                        {option.tip}
                      </p>
                    </div>
                  </motion.div>
                );
              })}
            </div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="text-center mt-12"
            >
              <Link to="/book-now">
                <Button size="lg" className="bg-emerald-500 hover:bg-emerald-600 text-white px-8 py-6 text-lg rounded-full">
                  Book Private Transfer
                </Button>
              </Link>
            </motion.div>
          </div>
        </section>

        {/* Essential Travel Tips */}
        <section className="py-24 bg-white">
          <div className="container mx-auto px-4 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="text-center mb-16"
            >
              <Badge className="mb-4 bg-purple-100 text-purple-700 px-4 py-1">
                <Shield className="w-3 h-3 mr-1 inline" />
                Travel Tips
              </Badge>
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4 font-playfair">
                Essential Information
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Everything you need to know before traveling to Sri Lanka
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {essentialTips.map((tip, index) => {
                const IconComponent = tip.icon;
                return (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: index * 0.05 }}
                    className="flex items-start gap-4 p-6 bg-gray-50 rounded-xl hover:bg-gray-100 transition-all"
                  >
                    <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center shrink-0">
                      <IconComponent className="w-6 h-6 text-purple-600" />
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-900 mb-1">{tip.title}</h3>
                      <p className="text-sm text-gray-600">{tip.info}</p>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Food & Cuisine Section */}
        <section className="py-24 bg-gradient-to-br from-orange-50 to-yellow-50">
          <div className="container mx-auto px-4 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="text-center mb-16"
            >
              <Badge className="mb-4 bg-orange-100 text-orange-700 px-4 py-1">
                <Utensils className="w-3 h-3 mr-1 inline" />
                Culinary Journey
              </Badge>
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4 font-playfair">
                Sri Lankan Cuisine
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                A vibrant fusion of spices, flavors, and culinary traditions you must experience
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {cuisineHighlights.map((item, index) => {
                const IconComponent = item.icon;
                return (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                    whileHover={{ scale: 1.05 }}
                    className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all text-center"
                  >
                    <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-yellow-500 rounded-full flex items-center justify-center mx-auto mb-4">
                      <IconComponent className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="font-bold text-gray-900 mb-2">{item.title}</h3>
                    <p className="text-sm text-gray-600">{item.description}</p>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Highlights Section */}
        <section className="py-24 bg-white">
          <div className="container mx-auto px-4 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="text-center mb-16"
            >
              <Badge className="mb-4 bg-teal-100 text-teal-700 px-4 py-1">What to Experience</Badge>
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4 font-playfair">
                What Makes Sri Lanka Special
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Discover the unique experiences that make Sri Lanka a truly remarkable destination
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {content.highlights.map((highlight, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  whileHover={{ scale: 1.05, y: -5 }}
                  className="bg-gradient-to-br from-teal-50 via-cyan-50 to-teal-50 p-8 rounded-2xl border border-teal-100 hover:shadow-2xl transition-all cursor-pointer"
                >
                  <div className="w-12 h-12 bg-gradient-to-br from-teal-500 to-cyan-500 rounded-full flex items-center justify-center mb-4">
                    <Star className="w-6 h-6 text-white" />
                  </div>
                  <div className="text-lg font-bold text-gray-900 mb-2">{highlight}</div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Gallery Section */}
        {gallery.length > 0 && (
          <section className="py-24 bg-gradient-to-b from-slate-50 to-white">
            <div className="container mx-auto px-4 lg:px-8">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
                className="text-center mb-16"
              >
                <Badge className="mb-4 bg-slate-900/90 text-white px-4 py-1">
                  <Camera className="w-3 h-3 mr-1 inline" />
                  Immersive Gallery
                </Badge>
                <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4 font-playfair">
                  Real Moments from Sri Lanka
                </h2>
                <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                  Every image below is managed from your admin panel, so updating the gallery is as easy as uploading a photo.
                </p>
              </motion.div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {gallery.map((image, index) => (
                  <motion.button
                    key={`${image.url}-${index}`}
                    type="button"
                    onClick={() => setSelectedGalleryImage(index)}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: index * 0.05 }}
                    className="group relative overflow-hidden rounded-3xl shadow-lg hover:shadow-2xl transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
                  >
                    <div className="aspect-[4/3] w-full overflow-hidden">
                      <img
                        src={image.url}
                        alt={image.caption || `Sri Lanka gallery image ${index + 1}`}
                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                      />
                    </div>
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    <div className="absolute bottom-4 left-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300 text-left">
                      <p className="text-white text-lg font-semibold">{image.caption || 'View photo'}</p>
                    </div>
                  </motion.button>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Enhanced Testimonials Section */}
        {testimonials && testimonials.length > 0 && testimonials[currentTestimonial] && (
          <section className="py-24 bg-gradient-to-br from-slate-900 via-gray-900 to-slate-900 text-white relative overflow-hidden">
            {/* Animated Background */}
            <div className="absolute inset-0 opacity-10">
              <motion.div
                className="absolute top-20 left-10 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl"
                animate={{
                  x: [0, 50, 0],
                  y: [0, 30, 0],
                  scale: [1, 1.1, 1],
                }}
                transition={{
                  duration: 20,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              />
              <motion.div
                className="absolute bottom-20 right-10 w-80 h-80 bg-purple-500/20 rounded-full blur-3xl"
                animate={{
                  x: [0, -40, 0],
                  y: [0, -50, 0],
                  scale: [1, 1.2, 1],
                }}
                transition={{
                  duration: 25,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              />
              <motion.div
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-teal-500/15 rounded-full blur-3xl"
                animate={{
                  scale: [1, 1.3, 1],
                  opacity: [0.3, 0.6, 0.3],
                }}
                transition={{
                  duration: 15,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              />
            </div>

            <div className="container mx-auto px-4 lg:px-8 relative z-10">
              {/* Section Header */}
              <motion.div
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
                className="text-center mb-16"
              >
                <motion.div
                  initial={{ scale: 0.9, opacity: 0 }}
                  whileInView={{ scale: 1, opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.2, type: "spring", bounce: 0.5 }}
                  className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-500/20 to-purple-500/20 px-6 py-3 rounded-full mb-6 border border-white/20 backdrop-blur-sm"
                >
                  <Heart className="w-5 h-5 text-red-400 animate-pulse" />
                  <span className="text-white font-semibold tracking-wide">TRAVELER STORIES</span>
                  <Heart className="w-5 h-5 text-red-400 animate-pulse" />
                </motion.div>

                <motion.h2
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.3, duration: 0.8 }}
                  className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 font-playfair leading-tight"
                >
                  What Our <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">Travelers</span> Say
                </motion.h2>

                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.4, duration: 0.8 }}
                  className="text-xl md:text-2xl text-gray-300 max-w-4xl mx-auto leading-relaxed"
                >
                  Authentic experiences from real travelers who discovered the magic of Sri Lanka with us
                </motion.p>
              </motion.div>

              {/* Main Testimonial Display */}
              <div className="max-w-6xl mx-auto">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={currentTestimonial}
                    initial={{ opacity: 0, scale: 0.95, y: 50 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: -50 }}
                    transition={{
                      duration: 0.6,
                      ease: "easeInOut",
                      type: "spring",
                      bounce: 0.3
                    }}
                    className="relative"
                  >
                    {/* Large Quote Icon */}
                    <motion.div
                      initial={{ rotate: -180, scale: 0 }}
                      animate={{ rotate: 0, scale: 1 }}
                      transition={{ delay: 0.3, type: "spring", bounce: 0.6 }}
                      className="absolute -top-8 -left-8 z-10"
                    >
                      <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-2xl">
                        <Quote className="w-10 h-10 text-white" />
                      </div>
                    </motion.div>

                    {/* Testimonial Card */}
                    <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-8 md:p-12 lg:p-16 border border-white/20 shadow-2xl relative overflow-hidden">
                      {/* Decorative Elements */}
                      <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-blue-500/20 to-transparent rounded-full blur-2xl" />
                      <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-purple-500/20 to-transparent rounded-full blur-2xl" />

                      <div className="grid lg:grid-cols-[1fr,300px] gap-8 lg:gap-12 items-center relative z-10">
                        {/* Content */}
                        <div className="text-center lg:text-left">
                          {/* Stars */}
                          <motion.div
                            initial={{ opacity: 0, scale: 0 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: 0.5, type: "spring", bounce: 0.5 }}
                            className="flex justify-center lg:justify-start gap-2 mb-8"
                          >
                            {[...Array(5)].map((_, i) => (
                              <motion.div
                                key={i}
                                initial={{ scale: 0, rotate: -180 }}
                                animate={{ scale: 1, rotate: 0 }}
                                transition={{
                                  delay: 0.5 + i * 0.1,
                                  type: "spring",
                                  bounce: 0.6
                                }}
                                className="relative"
                              >
                                <Star className="w-8 h-8 fill-yellow-400 text-yellow-400 drop-shadow-lg" />
                                <motion.div
                                  className="absolute inset-0 fill-yellow-400 text-yellow-400"
                                  animate={{
                                    scale: [1, 1.2, 1],
                                    opacity: [0.7, 1, 0.7]
                                  }}
                                  transition={{
                                    duration: 2,
                                    repeat: Infinity,
                                    delay: i * 0.2
                                  }}
                                />
                              </motion.div>
                            ))}
                          </motion.div>

                          {/* Quote Text */}
                          <motion.p
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.6, duration: 0.8 }}
                            className="text-2xl md:text-3xl lg:text-4xl text-white leading-relaxed mb-8 font-light italic"
                          >
                            "{testimonials[currentTestimonial].text}"
                          </motion.p>

                          {/* Author Info */}
                          <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.7, duration: 0.8 }}
                            className="flex items-center justify-center lg:justify-start gap-6"
                          >
                            <div className="relative">
                              {testimonials[currentTestimonial].avatar ? (
                                <motion.img
                                  initial={{ scale: 0, rotate: -180 }}
                                  animate={{ scale: 1, rotate: 0 }}
                                  transition={{ delay: 0.8, type: "spring", bounce: 0.5 }}
                                  src={testimonials[currentTestimonial].avatar}
                                  alt={testimonials[currentTestimonial].name}
                                  className="w-20 h-20 rounded-full object-cover ring-4 ring-white/30 shadow-xl"
                                />
                              ) : (
                                <motion.div
                                  initial={{ scale: 0, rotate: -180 }}
                                  animate={{ scale: 1, rotate: 0 }}
                                  transition={{ delay: 0.8, type: "spring", bounce: 0.5 }}
                                  className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center ring-4 ring-white/30 shadow-xl"
                                >
                                  <span className="text-2xl font-bold text-white">
                                    {testimonials[currentTestimonial].name.charAt(0)}
                                  </span>
                                </motion.div>
                              )}
                              <motion.div
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                transition={{ delay: 1, type: "spring", bounce: 0.6 }}
                                className="absolute -bottom-1 -right-1 w-8 h-8 bg-green-500 rounded-full flex items-center justify-center border-4 border-slate-900"
                              >
                                <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                </svg>
                              </motion.div>
                            </div>
                            <div>
                              <motion.h4
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.9, duration: 0.6 }}
                                className="text-2xl font-bold text-white mb-1"
                              >
                                {testimonials[currentTestimonial].name}
                              </motion.h4>
                              <motion.div
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 1, duration: 0.6 }}
                                className="flex items-center gap-2 text-gray-300"
                              >
                                <MapPin className="w-4 h-4" />
                                <span className="text-lg">{testimonials[currentTestimonial].location}</span>
                              </motion.div>
                            </div>
                          </motion.div>
                        </div>

                        {/* Trip Info Card */}
                        <motion.div
                          initial={{ opacity: 0, scale: 0.8, rotateY: 90 }}
                          animate={{ opacity: 1, scale: 1, rotateY: 0 }}
                          transition={{ delay: 0.8, duration: 0.8, type: "spring", bounce: 0.4 }}
                          className="bg-gradient-to-br from-blue-600/20 to-purple-600/20 backdrop-blur-sm rounded-2xl p-6 border border-white/20 hidden lg:block"
                        >
                          <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 1, duration: 0.6 }}
                            className="text-center mb-6"
                          >
                            <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
                              <Award className="w-8 h-8 text-white" />
                            </div>
                            <h5 className="text-xl font-bold text-white">Verified Trip</h5>
                          </motion.div>
                          <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 1.2, duration: 0.6 }}
                            className="space-y-4"
                          >
                            <div className="flex items-center gap-3 bg-white/10 rounded-lg p-3">
                              <Calendar className="w-5 h-5 text-blue-400" />
                              <span className="text-white font-medium">Recent Trip</span>
                            </div>
                            <div className="flex items-center gap-3 bg-white/10 rounded-lg p-3">
                              <ThumbsUp className="w-5 h-5 text-green-400" />
                              <span className="text-white font-medium">Highly Recommended</span>
                            </div>
                          </motion.div>
                        </motion.div>
                      </div>
                    </div>
                  </motion.div>
                </AnimatePresence>

                {/* Navigation Controls */}
                <motion.div
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.5, duration: 0.8 }}
                  className="flex items-center justify-center gap-6 mt-12"
                >
                  {/* Previous Button */}
                  <motion.div
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={prevTestimonial}
                      className="w-14 h-14 rounded-full bg-white/10 backdrop-blur-sm border-white/30 text-white hover:bg-white/20 hover:border-white/50 shadow-xl transition-all duration-300"
                    >
                      <ChevronLeft className="w-6 h-6" />
                    </Button>
                  </motion.div>

                  {/* Progress Indicators */}
                  <div className="flex items-center gap-3">
                    {testimonials.map((_, index) => (
                      <motion.button
                        key={index}
                        onClick={() => setCurrentTestimonial(index)}
                        className={`relative transition-all duration-500 ${index === currentTestimonial
                          ? 'w-12 h-3 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full'
                          : 'w-3 h-3 bg-white/30 rounded-full hover:bg-white/50'
                          }`}
                        whileHover={{ scale: 1.2 }}
                        whileTap={{ scale: 0.9 }}
                      >
                        {index === currentTestimonial && (
                          <motion.div
                            className="absolute inset-0 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full"
                            layoutId="activeIndicator"
                            transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                          />
                        )}
                      </motion.button>
                    ))}
                  </div>

                  {/* Next Button */}
                  <motion.div
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={nextTestimonial}
                      className="w-14 h-14 rounded-full bg-white/10 backdrop-blur-sm border-white/30 text-white hover:bg-white/20 hover:border-white/50 shadow-xl transition-all duration-300"
                    >
                      <ChevronRight className="w-6 h-6" />
                    </Button>
                  </motion.div>
                </motion.div>

                {/* Auto-play Indicator */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 1.5, duration: 0.6 }}
                  className="flex justify-center mt-8"
                >
                  <div className="flex items-center gap-2 text-gray-400 text-sm">
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                      className="w-4 h-4 border-2 border-gray-400 border-t-transparent rounded-full"
                    />
                    <span>Auto-rotating every 5 seconds</span>
                  </div>
                </motion.div>
              </div>
            </div>
          </section>
        )}

        {/* Call to Action Section */}
        <section className="py-24 bg-gradient-to-r from-blue-600 via-teal-600 to-blue-600 text-white relative overflow-hidden">
          <motion.div
            className="absolute inset-0 opacity-20"
            animate={{
              backgroundPosition: ['0% 0%', '100% 100%'],
            }}
            transition={{
              duration: 20,
              repeat: Infinity,
              repeatType: 'reverse',
            }}
            style={{
              backgroundImage: 'radial-gradient(circle, white 2px, transparent 2px)',
              backgroundSize: '50px 50px',
            }}
          />

          <div className="container mx-auto px-4 lg:px-8 text-center relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <h2 className="text-4xl md:text-6xl font-bold mb-6 font-playfair">
                Ready to Explore Sri Lanka?
              </h2>
              <p className="text-xl md:text-2xl mb-12 opacity-95 max-w-3xl mx-auto">
                Start planning your unforgettable journey to the Pearl of the Indian Ocean
              </p>
              <div className="flex flex-col sm:flex-row gap-6 justify-center">
                <a
                  href="https://wa.me/94777721999?text=Hello%20Recharge%20Travels,%20I'm%20interested%20in%20Sri%20Lanka%20tours"
                  className="inline-flex items-center justify-center px-10 py-5 bg-green-600 hover:bg-green-700 rounded-full font-semibold text-lg transition-all hover:scale-105 shadow-2xl"
                >
                  WhatsApp +94 77 77 21 999
                </a>
                <Link
                  to="/tours"
                  className="inline-flex items-center justify-center px-10 py-5 bg-white text-blue-600 hover:bg-gray-100 rounded-full font-semibold text-lg transition-all hover:scale-105 shadow-2xl"
                >
                  <MapPin className="w-5 h-5 mr-2" />
                  Explore Tours
                </Link>
              </div>
            </motion.div>
          </div>
        </section>
      </div>

      {selectedGalleryImage !== null && gallery[selectedGalleryImage] && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
          <div
            className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            onClick={() => setSelectedGalleryImage(null)}
          />
          <div className="relative z-10 w-full max-w-5xl">
            <div className="relative bg-slate-900 rounded-3xl p-4 md:p-8 shadow-2xl">
              <button
                type="button"
                onClick={() => setSelectedGalleryImage(null)}
                className="absolute right-4 top-4 rounded-full bg-white/20 p-2 text-white hover:bg-white/30 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="relative">
                <img
                  src={gallery[selectedGalleryImage].url}
                  alt={gallery[selectedGalleryImage].caption || 'Sri Lanka gallery image'}
                  className="w-full max-h-[70vh] object-contain rounded-2xl"
                />

                {gallery.length > 1 && (
                  <>
                    <button
                      type="button"
                      onClick={prevGalleryImage}
                      className="absolute left-2 top-1/2 -translate-y-1/2 rounded-full bg-white/20 p-3 text-white hover:bg-white/30 transition-colors"
                    >
                      <ChevronLeft className="w-6 h-6" />
                    </button>
                    <button
                      type="button"
                      onClick={nextGalleryImage}
                      className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full bg-white/20 p-3 text-white hover:bg-white/30 transition-colors"
                    >
                      <ChevronRight className="w-6 h-6" />
                    </button>
                  </>
                )}
              </div>

              {gallery[selectedGalleryImage].caption && (
                <p className="mt-6 text-center text-white/80 text-lg">
                  {gallery[selectedGalleryImage].caption}
                </p>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default AboutSriLanka;
