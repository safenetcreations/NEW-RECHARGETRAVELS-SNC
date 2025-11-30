import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { motion, AnimatePresence } from 'framer-motion';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { getAboutRechargeHeroSlides, AboutRechargeHeroSlide } from '@/services/aboutRechargeHeroService';
import {
  heroStats,
  timelineEvents,
  achievementHighlights,
  fleetVehicles as defaultFleetVehicles,
  reviewPlatforms,
  customerReviews,
} from '@/data/about/rechargeHistory';

// Fleet vehicle type from admin panel
interface AdminFleetVehicle {
  id: string;
  name: string;
  description: string;
  image: string;
}

// Timeline event type from admin panel
interface AdminTimelineEvent {
  id: string;
  yearRange: string;
  title: string;
  description: string;
  type: 'success' | 'crisis' | 'milestone';
  highlights: string[];
  location: string;
  images: string[];
}
import {
  ChevronLeft, ChevronRight, ChevronDown, Star, Calendar, Users,
  Car, Bus, MapPin, Award, Shield, Phone, MessageCircle,
  Clock, Briefcase, Heart, Quote, Building2, Plane, Trophy,
  TrendingUp, Target, Sparkles
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { Link } from 'react-router-dom';

const AboutRechargeTravel = () => {
  // Hero slider state - start empty, only show admin panel slides
  const [heroSlides, setHeroSlides] = useState<AboutRechargeHeroSlide[]>([]);
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const [heroLoading, setHeroLoading] = useState(true);

  // Fleet vehicles from admin panel
  const [fleetVehicles, setFleetVehicles] = useState<AdminFleetVehicle[]>([]);

  // Timeline events from admin panel (with images)
  const [adminTimeline, setAdminTimeline] = useState<AdminTimelineEvent[]>([]);

  // Track active carousel image for each timeline event
  const [timelineCarouselIndex, setTimelineCarouselIndex] = useState<Record<string, number>>({});

  // Load all content from admin panel
  useEffect(() => {
    const loadAboutContent = async () => {
      try {
        const docRef = doc(db, 'page-content', 'about-recharge-travels');
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const data = docSnap.data();

          // Load fleet vehicles with images
          if (data.fleet && Array.isArray(data.fleet) && data.fleet.length > 0) {
            const validFleet = data.fleet.filter(
              (v: AdminFleetVehicle) => v.name && v.name.trim() !== ''
            );
            if (validFleet.length > 0) {
              setFleetVehicles(validFleet);
            }
          }

          // Load timeline events with images
          if (data.timeline && Array.isArray(data.timeline) && data.timeline.length > 0) {
            const validTimeline = data.timeline.filter(
              (t: AdminTimelineEvent) => t.yearRange && t.title
            );
            if (validTimeline.length > 0) {
              setAdminTimeline(validTimeline);
              // Initialize carousel indexes
              const initialIndexes: Record<string, number> = {};
              validTimeline.forEach((t: AdminTimelineEvent) => {
                initialIndexes[t.id] = 0;
              });
              setTimelineCarouselIndex(initialIndexes);
            }
          }
        }
      } catch (error) {
        console.error('Error loading about content:', error);
      }
    };
    loadAboutContent();
  }, []);

  // Load hero slides from admin panel ONLY
  useEffect(() => {
    const loadHeroSlides = async () => {
      try {
        const slides = await getAboutRechargeHeroSlides();
        // Only use slides from admin panel
        const validSlides = slides?.filter(slide => slide.image && slide.image.trim() !== '') || [];
        setHeroSlides(validSlides);
      } catch (error) {
        console.error('Failed to load hero slides:', error);
        setHeroSlides([]);
      } finally {
        setHeroLoading(false);
      }
    };
    loadHeroSlides();
  }, []);

  // Auto-advance slides every 6 seconds (only if there are slides)
  useEffect(() => {
    if (heroSlides.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentSlideIndex((prev) => (prev + 1) % heroSlides.length);
    }, 6000);
    return () => clearInterval(interval);
  }, [heroSlides.length]);

  const currentSlide = heroSlides[currentSlideIndex];

  const nextSlide = () => {
    setCurrentSlideIndex((prev) => (prev + 1) % heroSlides.length);
  };

  const prevSlide = () => {
    setCurrentSlideIndex((prev) => (prev - 1 + heroSlides.length) % heroSlides.length);
  };

  const scrollToContent = () => {
    document.getElementById('story')?.scrollIntoView({ behavior: 'smooth' });
  };

  // Timeline carousel navigation
  const nextTimelineImage = (eventId: string, totalImages: number) => {
    setTimelineCarouselIndex(prev => ({
      ...prev,
      [eventId]: ((prev[eventId] || 0) + 1) % totalImages
    }));
  };

  const prevTimelineImage = (eventId: string, totalImages: number) => {
    setTimelineCarouselIndex(prev => ({
      ...prev,
      [eventId]: ((prev[eventId] || 0) - 1 + totalImages) % totalImages
    }));
  };

  const setTimelineImage = (eventId: string, index: number) => {
    setTimelineCarouselIndex(prev => ({
      ...prev,
      [eventId]: index
    }));
  };

  // Icon mapping for achievements
  const achievementIcons: Record<string, React.ReactNode> = {
    'tripadvisor': <Trophy className="w-8 h-8" />,
    'partnerships': <Users className="w-8 h-8" />,
    'operations': <Bus className="w-8 h-8" />,
    'satisfaction': <Star className="w-8 h-8" />,
    'airport-specialists': <Plane className="w-8 h-8" />,
    'coverage': <MapPin className="w-8 h-8" />,
  };

  // Fleet icons
  const fleetIcons: Record<string, React.ReactNode> = {
    'luxury-sedans': <Car className="w-12 h-12" />,
    'suvs': <Car className="w-12 h-12" />,
    'tourist-vans': <Car className="w-12 h-12" />,
    'tourist-buses': <Bus className="w-12 h-12" />,
  };

  // Fleet images
  const fleetImages: Record<string, string> = {
    'luxury-sedans': 'https://images.unsplash.com/photo-1555215695-3004980ad54e?w=600&q=80',
    'suvs': 'https://images.unsplash.com/photo-1519641471654-76ce0107ad1b?w=600&q=80',
    'tourist-vans': 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&q=80',
    'tourist-buses': 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=600&q=80',
  };

  return (
    <>
      <Helmet>
        <title>About Recharge Travels - Our Journey Since 2014 | Sri Lanka's Premier Travel Partner</title>
        <meta name="description" content="Discover the inspiring journey of Recharge Travels since 2014. From humble beginnings to becoming Sri Lanka's premier tourist operator, learn about our resilience and commitment to excellence." />
        <meta property="og:title" content="About Recharge Travels - Our Journey Since 2014" />
        <meta property="og:description" content="Sri Lanka's premier tourist transport and experience operator since 2014." />
        <meta property="og:image" content={currentSlide?.image} />
        <link rel="canonical" href="https://recharge-travels.com/about" />
      </Helmet>

      <div className="bg-white">
        {/* Hero Section with Auto-Sliding Images */}
        <section className="relative h-screen flex items-center justify-center overflow-hidden bg-slate-900">
          {/* Static dark background to prevent white flash */}
          <div className="absolute inset-0 bg-slate-900" />

          {/* Crossfade images - no wait mode for smooth transition */}
          <AnimatePresence>
            <motion.div
              key={currentSlideIndex}
              className="absolute inset-0 bg-cover bg-center bg-no-repeat"
              style={{ backgroundImage: `url(${currentSlide?.image})` }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1.2, ease: "easeInOut" }}
            >
              <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/70"></div>
            </motion.div>
          </AnimatePresence>

          {/* Content */}
          <div className="relative z-10 text-center text-white max-w-5xl mx-auto px-4">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentSlideIndex}
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -50 }}
                transition={{ duration: 0.8 }}
              >
                <Badge className="mb-6 bg-white/20 backdrop-blur-sm text-white border-white/30 px-6 py-2 text-sm font-semibold">
                  {currentSlide?.badge || "Est. 2014"}
                </Badge>
                <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold mb-6 font-playfair leading-tight">
                  {currentSlide?.title}
                </h1>
                <p className="text-xl md:text-3xl mb-10 opacity-95 font-light tracking-wide">
                  {currentSlide?.subtitle}
                </p>

                {/* Stats */}
                <div className="flex flex-wrap justify-center gap-8 md:gap-12 mb-10">
                  {heroStats.map((stat) => (
                    <div key={stat.id} className="text-center">
                      <div className="text-4xl md:text-5xl font-bold text-white">{stat.value}</div>
                      <div className="text-sm md:text-base opacity-80">{stat.label}</div>
                    </div>
                  ))}
                </div>

              </motion.div>
            </AnimatePresence>

          </div>

          {/* Static Buttons - Always Visible - Outside animated content */}
          <div className="absolute bottom-40 left-1/2 -translate-x-1/2 z-30 flex flex-col sm:flex-row gap-6 justify-center">
            <Button
              size="lg"
              className="bg-white text-blue-600 hover:bg-blue-50 hover:scale-105 px-12 py-8 text-xl font-bold rounded-full shadow-2xl transition-all duration-300 min-w-[220px]"
              onClick={scrollToContent}
            >
              <Heart className="w-6 h-6 mr-3" />
              Our Story
            </Button>
            <Link to="/book-now">
              <Button
                size="lg"
                className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white hover:scale-105 px-12 py-8 text-xl font-bold rounded-full shadow-2xl transition-all duration-300 min-w-[220px] border-0"
              >
                <Car className="w-6 h-6 mr-3" />
                Book With Us
              </Button>
            </Link>
          </div>

          {/* Slide Navigation */}
          <button
            onClick={prevSlide}
            className="absolute left-4 top-1/2 -translate-y-1/2 z-20 p-3 bg-white/10 backdrop-blur-sm rounded-full hover:bg-white/20 transition-all"
          >
            <ChevronLeft className="w-8 h-8 text-white" />
          </button>
          <button
            onClick={nextSlide}
            className="absolute right-4 top-1/2 -translate-y-1/2 z-20 p-3 bg-white/10 backdrop-blur-sm rounded-full hover:bg-white/20 transition-all"
          >
            <ChevronRight className="w-8 h-8 text-white" />
          </button>

          {/* Slide Indicators */}
          <div className="absolute bottom-24 left-1/2 -translate-x-1/2 z-20 flex gap-2">
            {heroSlides.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentSlideIndex(index)}
                className={`w-3 h-3 rounded-full transition-all ${
                  index === currentSlideIndex
                    ? 'bg-white w-8'
                    : 'bg-white/40 hover:bg-white/60'
                }`}
              />
            ))}
          </div>

          {/* Scroll Indicator */}
          <motion.div
            className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-20 cursor-pointer"
            animate={{ y: [0, 10, 0] }}
            transition={{ repeat: Infinity, duration: 1.5 }}
            onClick={scrollToContent}
          >
            <div className="flex flex-col items-center text-white/80">
              <span className="text-sm mb-2">Discover our story</span>
              <ChevronDown className="w-6 h-6" />
            </div>
          </motion.div>
        </section>

        {/* Our Story Section */}
        <section id="story" className="py-24 bg-gradient-to-br from-blue-50 via-white to-indigo-50">
          <div className="container mx-auto px-4 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
              <motion.div
                initial={{ opacity: 0, x: -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
              >
                <Badge className="mb-4 bg-blue-100 text-blue-700 px-4 py-1">Our Story</Badge>
                <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mt-4 mb-6 font-playfair">
                  A Journey of Resilience
                </h2>
                <p className="text-xl text-gray-700 mb-6 leading-relaxed">
                  Founded in 2014, Recharge Travels began with a simple vision: to redefine Sri Lankan tourism through reliable transport services and curated travel experiences. From our first office in Colombo, we've grown to become one of the island's most trusted travel partners.
                </p>
                <p className="text-xl text-gray-700 mb-8 leading-relaxed">
                  Through the Easter Sunday attacks of 2019, the global pandemic, and Sri Lanka's economic crisis, we've persevered. Each challenge has only strengthened our commitment to excellence and our bond with our customers.
                </p>
                <div className="flex gap-4 flex-wrap">
                  <Link to="/book-now">
                    <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-white px-8 rounded-full">
                      <Car className="w-5 h-5 mr-2" />
                      Book Transfer
                    </Button>
                  </Link>
                  <a href="https://wa.me/94777721999">
                    <Button size="lg" variant="outline" className="border-2 border-green-600 text-green-600 hover:bg-green-50 px-8 rounded-full">
                      <MessageCircle className="w-5 h-5 mr-2" />
                      WhatsApp Us
                    </Button>
                  </a>
                </div>
              </motion.div>

              {/* Mission & Vision Cards */}
              <motion.div
                initial={{ opacity: 0, x: 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="space-y-6"
              >
                <Card className="p-8 shadow-xl border-0 bg-gradient-to-br from-blue-600 to-indigo-700 text-white">
                  <Target className="w-12 h-12 mb-4" />
                  <h3 className="text-2xl font-bold mb-4">Our Mission</h3>
                  <p className="text-lg opacity-90">
                    To provide safe, reliable, and memorable travel experiences across Sri Lanka, exceeding expectations with every journey.
                  </p>
                </Card>
                <Card className="p-8 shadow-xl border-0 bg-gradient-to-br from-amber-500 to-orange-600 text-white">
                  <Sparkles className="w-12 h-12 mb-4" />
                  <h3 className="text-2xl font-bold mb-4">Our Vision</h3>
                  <p className="text-lg opacity-90">
                    To be Sri Lanka's most trusted and innovative travel partner, known for excellence, integrity, and customer delight.
                  </p>
                </Card>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Timeline Section with Image Carousels */}
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
                Our Journey
              </Badge>
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4 font-playfair">
                Through the Years
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                From humble beginnings to becoming Sri Lanka's premier travel partner
              </p>
            </motion.div>

            {/* Timeline with alternating layout and image carousels */}
            <div className="space-y-16 max-w-7xl mx-auto">
              {(adminTimeline.length > 0 ? adminTimeline : timelineEvents).map((event, index) => {
                const isLeft = index % 2 === 0;
                const typeColors = {
                  success: 'border-green-500 bg-green-50',
                  crisis: 'border-red-500 bg-red-50',
                  milestone: 'border-amber-500 bg-amber-50',
                };
                const badgeColors = {
                  success: 'bg-green-500',
                  crisis: 'bg-red-500',
                  milestone: 'bg-amber-500',
                };

                // Get images from admin timeline if available
                const eventImages = (event as AdminTimelineEvent).images?.filter(img => img && img.trim() !== '') || [];
                const hasImages = eventImages.length > 0;
                const currentImageIndex = timelineCarouselIndex[event.id] || 0;

                return (
                  <motion.div
                    key={event.id}
                    initial={{ opacity: 0, y: 50 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                    className={`grid grid-cols-1 lg:grid-cols-2 gap-8 items-center ${!isLeft ? 'lg:flex-row-reverse' : ''}`}
                  >
                    {/* Content Card - alternates position */}
                    <div className={`order-2 ${isLeft ? 'lg:order-1' : 'lg:order-2'}`}>
                      <div className="relative">
                        {/* Year Badge */}
                        <div className={`absolute -top-4 ${isLeft ? 'left-4' : 'right-4'} z-10 px-6 py-3 rounded-full text-white font-bold text-xl shadow-xl ${badgeColors[event.type]}`}>
                          {event.yearRange}
                        </div>

                        <Card className={`p-8 pt-12 border-l-4 ${typeColors[event.type]} shadow-xl hover:shadow-2xl transition-all`}>
                          <h3 className="text-2xl md:text-3xl font-bold text-gray-900 mb-3">{event.title}</h3>
                          {event.location && (
                            <p className="text-sm text-blue-600 font-semibold mb-3 flex items-center gap-2">
                              <MapPin className="w-4 h-4" />
                              {event.location}
                            </p>
                          )}
                          <p className="text-gray-700 text-lg mb-6 leading-relaxed">{event.description}</p>
                          {event.highlights && event.highlights.length > 0 && (
                            <ul className="space-y-2 text-gray-600">
                              {event.highlights.map((h, i) => (
                                <li key={i} className="flex items-center gap-3">
                                  <Star className="w-4 h-4 text-amber-500 shrink-0" />
                                  <span>{h}</span>
                                </li>
                              ))}
                            </ul>
                          )}
                        </Card>
                      </div>
                    </div>

                    {/* Image Carousel - alternates position */}
                    <div className={`order-1 ${isLeft ? 'lg:order-2' : 'lg:order-1'}`}>
                      {hasImages ? (
                        <div className="relative rounded-2xl overflow-hidden shadow-2xl aspect-video bg-slate-900">
                          {/* Background for smooth transitions */}
                          <div className="absolute inset-0 bg-slate-900" />

                          {/* Carousel Images */}
                          <AnimatePresence>
                            <motion.img
                              key={currentImageIndex}
                              src={eventImages[currentImageIndex]}
                              alt={`${event.title} - Image ${currentImageIndex + 1}`}
                              className="absolute inset-0 w-full h-full object-cover"
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              exit={{ opacity: 0 }}
                              transition={{ duration: 0.5 }}
                            />
                          </AnimatePresence>

                          {/* Gradient overlay */}
                          <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />

                          {/* Year overlay badge */}
                          <div className={`absolute top-4 ${isLeft ? 'right-4' : 'left-4'} px-4 py-2 rounded-full bg-white/20 backdrop-blur-sm text-white font-bold`}>
                            {event.yearRange}
                          </div>

                          {/* Navigation Arrows */}
                          {eventImages.length > 1 && (
                            <>
                              <button
                                onClick={() => prevTimelineImage(event.id, eventImages.length)}
                                className="absolute left-3 top-1/2 -translate-y-1/2 p-2 bg-white/20 backdrop-blur-sm rounded-full hover:bg-white/40 transition-all"
                              >
                                <ChevronLeft className="w-6 h-6 text-white" />
                              </button>
                              <button
                                onClick={() => nextTimelineImage(event.id, eventImages.length)}
                                className="absolute right-3 top-1/2 -translate-y-1/2 p-2 bg-white/20 backdrop-blur-sm rounded-full hover:bg-white/40 transition-all"
                              >
                                <ChevronRight className="w-6 h-6 text-white" />
                              </button>
                            </>
                          )}

                          {/* Dots Indicator */}
                          {eventImages.length > 1 && (
                            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                              {eventImages.map((_, imgIndex) => (
                                <button
                                  key={imgIndex}
                                  onClick={() => setTimelineImage(event.id, imgIndex)}
                                  className={`w-2.5 h-2.5 rounded-full transition-all ${
                                    imgIndex === currentImageIndex
                                      ? 'bg-white w-6'
                                      : 'bg-white/50 hover:bg-white/70'
                                  }`}
                                />
                              ))}
                            </div>
                          )}

                          {/* Image counter */}
                          <div className="absolute bottom-4 right-4 px-3 py-1 rounded-full bg-black/50 text-white text-sm">
                            {currentImageIndex + 1} / {eventImages.length}
                          </div>
                        </div>
                      ) : (
                        /* Placeholder when no images */
                        <div className={`relative rounded-2xl overflow-hidden shadow-xl aspect-video bg-gradient-to-br ${
                          event.type === 'success' ? 'from-green-400 to-green-600' :
                          event.type === 'crisis' ? 'from-red-400 to-red-600' :
                          'from-amber-400 to-orange-500'
                        } flex items-center justify-center`}>
                          <div className="text-center text-white">
                            <Calendar className="w-16 h-16 mx-auto mb-4 opacity-80" />
                            <p className="text-4xl font-bold">{event.yearRange}</p>
                            <p className="text-lg opacity-80 mt-2">{event.title}</p>
                          </div>
                        </div>
                      )}
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Achievements Section */}
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
                <Award className="w-3 h-3 mr-1 inline" />
                Achievements
              </Badge>
              <h2 className="text-4xl md:text-5xl font-bold mb-4 font-playfair">
                Our Proud Achievements
              </h2>
              <p className="text-xl text-gray-300 max-w-3xl mx-auto">
                Recognition and milestones that define our commitment to excellence
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {achievementHighlights.map((achievement, index) => (
                <motion.div
                  key={achievement.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  whileHover={{ scale: 1.05, y: -5 }}
                  className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-2xl p-8 text-center shadow-xl"
                >
                  <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-6">
                    {achievementIcons[achievement.id] || <Award className="w-10 h-10" />}
                  </div>
                  <h3 className="text-xl font-bold mb-3">{achievement.title}</h3>
                  <p className="text-gray-200 opacity-90">{achievement.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Fleet Section */}
        <section className="py-24 bg-gradient-to-br from-gray-50 to-blue-50">
          <div className="container mx-auto px-4 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="text-center mb-16"
            >
              <Badge className="mb-4 bg-blue-100 text-blue-700 px-4 py-1">
                <Car className="w-3 h-3 mr-1 inline" />
                Our Fleet
              </Badge>
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4 font-playfair">
                Premium Vehicles
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Well-maintained, comfortable vehicles for every type of journey
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {(fleetVehicles.length > 0 ? fleetVehicles : defaultFleetVehicles).map((vehicle, index) => (
                <motion.div
                  key={vehicle.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  whileHover={{ y: -10 }}
                  className="group"
                >
                  <Card className="overflow-hidden border-0 shadow-xl hover:shadow-2xl transition-all">
                    <div className="relative h-48 overflow-hidden">
                      <img
                        src={vehicle.image || fleetImages[vehicle.id] || 'https://images.unsplash.com/photo-1555215695-3004980ad54e?w=600&q=80'}
                        alt={vehicle.name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                      <div className="absolute bottom-4 left-4 text-white">
                        <Car className="w-12 h-12" />
                      </div>
                    </div>
                    <div className="p-6">
                      <h3 className="text-xl font-bold text-gray-900 mb-2">{vehicle.name}</h3>
                      <p className="text-gray-600">{vehicle.description}</p>
                    </div>
                  </Card>
                </motion.div>
              ))}
            </div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="text-center mt-12"
            >
              <Link to="/vehicles">
                <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-6 text-lg rounded-full">
                  View All Vehicles
                </Button>
              </Link>
            </motion.div>
          </div>
        </section>

        {/* Reviews Section */}
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
                <Heart className="w-3 h-3 mr-1 inline" />
                Testimonials
              </Badge>
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4 font-playfair">
                What Our Customers Say
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Trusted by thousands of travelers from around the world
              </p>
            </motion.div>

            {/* Review Platforms */}
            <div className="flex justify-center gap-12 mb-12 flex-wrap">
              {reviewPlatforms.map((platform) => (
                <motion.div
                  key={platform.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  className="text-center"
                >
                  <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center text-white text-2xl font-bold mx-auto mb-2">
                    {platform.icon}
                  </div>
                  <p className="font-semibold text-gray-700">{platform.label}</p>
                </motion.div>
              ))}
            </div>

            {/* Reviews Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
              {customerReviews.map((review, index) => (
                <motion.div
                  key={review.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  className="bg-gray-50 rounded-2xl p-8 relative"
                >
                  <Quote className="w-10 h-10 text-blue-200 absolute top-4 right-4" />
                  <div className="flex gap-1 mb-4">
                    {[...Array(review.rating)].map((_, i) => (
                      <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                  <p className="text-gray-700 italic mb-6 text-lg">"{review.quote}"</p>
                  <p className="font-bold text-blue-600">
                    — {review.author}, {review.platform}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Locations Section */}
        <section className="py-24 bg-gradient-to-br from-blue-600 to-indigo-700 text-white">
          <div className="container mx-auto px-4 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="text-center mb-16"
            >
              <Badge className="mb-4 bg-white/10 backdrop-blur-sm text-white border-white/20 px-4 py-1">
                <Building2 className="w-3 h-3 mr-1 inline" />
                Our Locations
              </Badge>
              <h2 className="text-4xl md:text-5xl font-bold mb-4 font-playfair">
                Find Us Across Sri Lanka
              </h2>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
              {[
                { name: 'Colombo Office', address: 'Bambalapitiya, Colombo', icon: Building2 },
                { name: 'Katunayake HQ', address: 'Near CMB Airport', icon: Plane },
                { name: 'Jaffna Branch', address: 'Cargills Square, Jaffna', icon: MapPin },
              ].map((location, index) => {
                const IconComponent = location.icon;
                return (
                  <motion.div
                    key={location.name}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                    className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 text-center border border-white/20"
                  >
                    <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
                      <IconComponent className="w-8 h-8" />
                    </div>
                    <h3 className="text-xl font-bold mb-2">{location.name}</h3>
                    <p className="opacity-80">{location.address}</p>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-24 bg-gradient-to-r from-amber-500 via-orange-500 to-amber-500 text-white relative overflow-hidden">
          <motion.div
            className="absolute inset-0 opacity-20"
            animate={{ backgroundPosition: ['0% 0%', '100% 100%'] }}
            transition={{ duration: 20, repeat: Infinity, repeatType: 'reverse' }}
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
                Ready to Travel With Us?
              </h2>
              <p className="text-xl md:text-2xl mb-12 opacity-95 max-w-3xl mx-auto">
                Experience the Recharge Travels difference - reliable, comfortable, and memorable journeys across Sri Lanka
              </p>
              <div className="flex flex-col sm:flex-row gap-6 justify-center">
                <a
                  href="https://wa.me/94777721999?text=Hello%20Recharge%20Travels,%20I'm%20interested%20in%20booking%20a%20transfer"
                  className="inline-flex items-center justify-center px-10 py-5 bg-green-600 hover:bg-green-700 rounded-full font-semibold text-lg transition-all hover:scale-105 shadow-2xl"
                >
                  <MessageCircle className="w-5 h-5 mr-2" />
                  WhatsApp +94 77 77 21 999
                </a>
                <Link
                  to="/book-now"
                  className="inline-flex items-center justify-center px-10 py-5 bg-white text-orange-600 hover:bg-gray-100 rounded-full font-semibold text-lg transition-all hover:scale-105 shadow-2xl"
                >
                  <Car className="w-5 h-5 mr-2" />
                  Book Now
                </Link>
              </div>
            </motion.div>
          </div>
        </section>
      </div>

    </>
  );
};

export default AboutRechargeTravel;
