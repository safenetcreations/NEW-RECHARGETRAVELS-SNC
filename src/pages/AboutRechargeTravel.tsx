import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { motion, AnimatePresence } from 'framer-motion';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { getAboutRechargeHeroSlides, AboutRechargeHeroSlide, DEFAULT_RECHARGE_SLIDES } from '@/services/aboutRechargeHeroService';
import {
  heroStats,
  timelineEvents,
  achievementHighlights,
  fleetVehicles,
  reviewPlatforms,
  customerReviews,
} from '@/data/about/rechargeHistory';
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
  // Hero slider state
  const [heroSlides, setHeroSlides] = useState<AboutRechargeHeroSlide[]>(DEFAULT_RECHARGE_SLIDES);
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const [heroLoading, setHeroLoading] = useState(true);

  // Load hero slides
  useEffect(() => {
    const loadHeroSlides = async () => {
      try {
        const slides = await getAboutRechargeHeroSlides();
        if (slides && slides.length > 0) {
          setHeroSlides(slides);
        }
      } catch (error) {
        console.error('Failed to load hero slides:', error);
      } finally {
        setHeroLoading(false);
      }
    };
    loadHeroSlides();
  }, []);

  // Auto-advance slides every 6 seconds
  useEffect(() => {
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

      <Header />

      <div className="bg-white">
        {/* Hero Section with Auto-Sliding Images */}
        <section className="relative h-screen flex items-center justify-center overflow-hidden">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentSlideIndex}
              className="absolute inset-0 bg-cover bg-center bg-no-repeat"
              style={{ backgroundImage: `url(${currentSlide?.image})` }}
              initial={{ opacity: 0, scale: 1.1 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1.5 }}
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

                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button
                    size="lg"
                    className="bg-white text-blue-600 hover:bg-blue-50 px-8 py-6 text-lg font-semibold rounded-full shadow-xl"
                    onClick={scrollToContent}
                  >
                    Our Story
                  </Button>
                  <Link to="/book-now">
                    <Button
                      size="lg"
                      variant="outline"
                      className="border-2 border-white text-white hover:bg-white/10 px-8 py-6 text-lg font-semibold rounded-full backdrop-blur-sm"
                    >
                      Book With Us
                    </Button>
                  </Link>
                </div>
              </motion.div>
            </AnimatePresence>
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

        {/* Timeline Section */}
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

            <div className="relative max-w-4xl mx-auto">
              {/* Timeline Line */}
              <div className="absolute left-1/2 top-0 bottom-0 w-1 bg-gradient-to-b from-blue-600 via-amber-500 to-green-600 transform -translate-x-1/2 hidden md:block"></div>

              {timelineEvents.map((event, index) => {
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

                return (
                  <motion.div
                    key={event.id}
                    initial={{ opacity: 0, x: isLeft ? -50 : 50 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                    className={`relative mb-12 md:w-1/2 ${isLeft ? 'md:pr-12 md:text-right' : 'md:pl-12 md:ml-auto'}`}
                  >
                    {/* Year Badge */}
                    <div className={`absolute top-0 ${isLeft ? 'md:right-0 md:translate-x-1/2' : 'md:left-0 md:-translate-x-1/2'} hidden md:flex w-20 h-20 rounded-full ${badgeColors[event.type]} items-center justify-center text-white font-bold text-lg shadow-lg z-10`}>
                      {event.yearRange}
                    </div>

                    <Card className={`p-6 border-l-4 ${typeColors[event.type]} shadow-lg hover:shadow-xl transition-shadow`}>
                      <div className={`md:hidden mb-3 inline-block px-4 py-1 rounded-full text-white text-sm font-bold ${badgeColors[event.type]}`}>
                        {event.yearRange}
                      </div>
                      <h3 className="text-xl font-bold text-gray-900 mb-2">{event.title}</h3>
                      {event.location && (
                        <p className="text-sm text-blue-600 font-semibold mb-2 flex items-center gap-1 justify-start md:justify-end">
                          <MapPin className="w-4 h-4" />
                          {event.location}
                        </p>
                      )}
                      <p className="text-gray-700 mb-4">{event.description}</p>
                      {event.highlights.length > 0 && (
                        <ul className={`space-y-1 text-sm text-gray-600 ${isLeft ? 'md:text-right' : ''}`}>
                          {event.highlights.map((h, i) => (
                            <li key={i} className="flex items-center gap-2">
                              <Star className="w-3 h-3 text-amber-500 shrink-0" />
                              {h}
                            </li>
                          ))}
                        </ul>
                      )}
                    </Card>
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
              {fleetVehicles.map((vehicle, index) => (
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
                        src={fleetImages[vehicle.id]}
                        alt={vehicle.name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                      <div className="absolute bottom-4 left-4 text-white">
                        {fleetIcons[vehicle.id]}
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

      <Footer />
    </>
  );
};

export default AboutRechargeTravel;
