import React, { useState, useEffect, useMemo } from 'react';
import { Helmet } from 'react-helmet-async';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Car,
  User,
  MapPin,
  Star,
  Calendar,
  Users,
  ChevronDown,
  ChevronRight,
  ChevronLeft,
  Shield,
  Headphones,
  Clock,
  Route,
  Camera,
  Award,
  Check,
  Heart,
  Globe,
  Mountain,
  Waves,
  Bird,
  Landmark,
  Compass,
  Leaf,
  Phone,
  MessageCircle,
  Quote,
  Sparkles,
  Zap,
  Coffee,
  Wifi
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import TransferBookingForm from '@/modules/transfers/components/TransferBookingForm';
import { privateToursService } from '@/services/privateToursService';
import { Link } from 'react-router-dom';
import type {
  PrivateToursPageContent,
  PrivateTourPackage,
  PrivateTourCategory,
  PrivateTourGuide,
  PrivateTourTestimonial
} from '@/types/private-tours';

// Icon mapping
const iconMap: Record<string, React.ComponentType<any>> = {
  User, Route, Car, Camera, Heart, Shield, Clock, MapPin, Star, Award,
  Globe, Mountain, Waves, Bird, Landmark, Compass, Leaf, Phone
};

const relatedTransport = [
  { title: 'Transport Hub', href: '/transport' },
  { title: 'Airport Transfers', href: '/transport/airport-transfers' },
  { title: 'Group Transport', href: '/transport/group-transport' }
];

const PrivateTours = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [currentTestimonial, setCurrentTestimonial] = useState(0);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState<string | null>(null);

  // Data states
  const [pageContent, setPageContent] = useState<PrivateToursPageContent | null>(null);
  const [packages, setPackages] = useState<PrivateTourPackage[]>([]);
  const [categories, setCategories] = useState<PrivateTourCategory[]>([]);
  const [guides, setGuides] = useState<PrivateTourGuide[]>([]);
  const [testimonials, setTestimonials] = useState<PrivateTourTestimonial[]>([]);

  // Load all data
  useEffect(() => {
    const loadData = async () => {
      try {
        const [content, pkgs, cats, gds, tests] = await Promise.all([
          privateToursService.getPageContent(),
          privateToursService.getPackages({ status: 'published', limitCount: 12 }),
          privateToursService.getCategories(),
          privateToursService.getGuides({ featured: true, limitCount: 4 }),
          privateToursService.getTestimonials(6)
        ]);

        setPageContent(content);
        setPackages(pkgs);
        setCategories(cats);
        setGuides(gds);
        setTestimonials(tests);
      } catch (error) {
        console.error('Error loading data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  // Auto-rotate hero slides
  useEffect(() => {
    if (!pageContent?.heroSlides.length) return;

    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % pageContent.heroSlides.length);
    }, 6000);

    return () => clearInterval(timer);
  }, [pageContent?.heroSlides.length]);

  // Auto-rotate testimonials
  useEffect(() => {
    if (testimonials.length <= 1) return;

    const timer = setInterval(() => {
      setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
    }, 5000);

    return () => clearInterval(timer);
  }, [testimonials.length]);

  // Filter packages by category
  const filteredPackages = useMemo(() => {
    if (!activeCategory) return packages;
    return packages.filter(pkg => pkg.categoryId === activeCategory);
  }, [packages, activeCategory]);

  // Default packages if none loaded
  const displayPackages = filteredPackages.length > 0 ? filteredPackages : [
    {
      id: '1',
      name: 'Cultural Triangle Explorer',
      slug: 'cultural-triangle',
      categoryId: 'cultural',
      shortDescription: 'Discover ancient kingdoms and UNESCO World Heritage sites',
      duration: { days: 3, nights: 2 },
      heroImage: 'https://images.unsplash.com/photo-1588979355313-6711a095465f?auto=format&fit=crop&q=80',
      highlights: [
        { title: 'Sigiriya Rock Fortress' },
        { title: 'Dambulla Cave Temple' },
        { title: 'Polonnaruwa Ancient City' },
        { title: 'Minneriya Safari' }
      ],
      pricing: { basePrice: 350, currency: 'USD' },
      featured: true,
      popular: true,
      rating: 4.9,
      reviewCount: 156
    },
    {
      id: '2',
      name: 'Hill Country Adventure',
      slug: 'hill-country',
      categoryId: 'hill-country',
      shortDescription: 'Tea plantations, scenic trains, and misty mountains',
      duration: { days: 2, nights: 1 },
      heroImage: 'https://images.unsplash.com/photo-1567157577867-05ccb1388e66?auto=format&fit=crop&q=80',
      highlights: [
        { title: 'Kandy Temple of Tooth' },
        { title: 'Tea Factory Visit' },
        { title: 'Nine Arch Bridge' },
        { title: "Little Adam's Peak" }
      ],
      pricing: { basePrice: 280, currency: 'USD' },
      featured: false,
      popular: true,
      rating: 4.8,
      reviewCount: 124
    },
    {
      id: '3',
      name: 'Wildlife Safari Special',
      slug: 'wildlife-safari',
      categoryId: 'wildlife',
      shortDescription: 'Track leopards and elephants in their natural habitat',
      duration: { days: 2, nights: 1 },
      heroImage: 'https://images.unsplash.com/photo-1552832230-c0197dd311b5?auto=format&fit=crop&q=80',
      highlights: [
        { title: 'Yala National Park' },
        { title: 'Udawalawe Elephants' },
        { title: 'Bird Watching' },
        { title: 'Bundala Wetlands' }
      ],
      pricing: { basePrice: 320, currency: 'USD' },
      featured: true,
      popular: true,
      rating: 4.9,
      reviewCount: 198
    },
    {
      id: '4',
      name: 'Southern Coast Journey',
      slug: 'southern-coast',
      categoryId: 'beach',
      shortDescription: 'Historic forts, whale watching, and pristine beaches',
      duration: { days: 2, nights: 1 },
      heroImage: 'https://images.unsplash.com/photo-1586861203927-800a5acdcc4d?auto=format&fit=crop&q=80',
      highlights: [
        { title: 'Galle Fort UNESCO' },
        { title: 'Mirissa Whale Watching' },
        { title: 'Turtle Hatchery' },
        { title: 'Beach Relaxation' }
      ],
      pricing: { basePrice: 260, currency: 'USD' },
      featured: false,
      popular: false,
      rating: 4.7,
      reviewCount: 89
    },
    {
      id: '5',
      name: 'Ancient Cities Heritage',
      slug: 'ancient-cities',
      categoryId: 'cultural',
      shortDescription: 'Journey through 2,500 years of Sri Lankan history',
      duration: { days: 4, nights: 3 },
      heroImage: 'https://images.unsplash.com/photo-1580742314292-5a6bc77e93a6?auto=format&fit=crop&q=80',
      highlights: [
        { title: 'Anuradhapura' },
        { title: 'Mihintale' },
        { title: 'Sigiriya' },
        { title: 'Polonnaruwa' }
      ],
      pricing: { basePrice: 450, currency: 'USD' },
      featured: true,
      popular: true,
      rating: 4.9,
      reviewCount: 167
    },
    {
      id: '6',
      name: 'Full Island Discovery',
      slug: 'full-island',
      categoryId: 'adventure',
      shortDescription: 'The ultimate Sri Lanka experience - all highlights in one trip',
      duration: { days: 7, nights: 6 },
      heroImage: 'https://images.unsplash.com/photo-1546587348-d12660c30c50?auto=format&fit=crop&q=80',
      highlights: [
        { title: 'All Major Attractions' },
        { title: 'Beach & Mountains' },
        { title: 'Wildlife & Culture' },
        { title: 'Fully Customizable' }
      ],
      pricing: { basePrice: 850, currency: 'USD' },
      featured: true,
      popular: true,
      rating: 5.0,
      reviewCount: 234
    }
  ];

  const scrollToBooking = () => {
    document.getElementById('booking-section')?.scrollIntoView({ behavior: 'smooth' });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 to-pink-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-purple-600 mx-auto mb-6"></div>
          <p className="text-xl text-gray-600">Loading amazing tours...</p>
        </div>
      </div>
    );
  }

  const heroSlides = pageContent?.heroSlides || [];
  const currentHeroSlide = heroSlides[currentSlide] || heroSlides[0];

  return (
    <>
      <Helmet>
        <title>{pageContent?.seoTitle || 'Private Tours in Sri Lanka - Recharge Travels'}</title>
        <meta name="description" content={pageContent?.seoDescription || 'Explore Sri Lanka with personalized private tours.'} />
        <meta name="keywords" content={pageContent?.seoKeywords?.join(', ') || 'private tours Sri Lanka'} />
      </Helmet>

      <Header />

      <div className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 py-4 flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
          <div className="text-sm text-slate-700 flex items-center gap-2">
            <Link to="/transport" className="text-emerald-700 font-semibold hover:text-emerald-800">Transport</Link>
            <span aria-hidden>›</span>
            <span className="font-semibold text-slate-900">Private Tours & Chauffeurs</span>
          </div>
          <div className="flex flex-wrap gap-3 text-xs">
            {relatedTransport.map(link => (
              <Link
                key={link.href}
                to={link.href}
                className="rounded-full border border-slate-200 bg-white px-3 py-1 font-semibold text-slate-700 hover:border-emerald-400 hover:text-emerald-700 transition"
              >
                {link.title}
              </Link>
            ))}
          </div>
        </div>
      </div>

      <div className="min-h-screen bg-background">
        {/* ==================== HERO SECTION ==================== */}
        <section className="relative w-full min-h-screen overflow-hidden">
          {/* Background Slideshow */}
          <AnimatePresence mode="wait">
            {currentHeroSlide && (
              <motion.div
                key={currentSlide}
                initial={{ opacity: 0, scale: 1.05 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 2, ease: "easeInOut" }}
                className="absolute inset-0 z-0"
              >
                <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/70 z-10" />
                <img
                  src={currentHeroSlide.image}
                  alt={currentHeroSlide.title}
                  className="w-full h-full object-cover"
                />
              </motion.div>
            )}
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
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.3, type: "spring" }}
                    className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm px-6 py-3 rounded-full mb-6"
                  >
                    <Sparkles className="w-5 h-5 text-yellow-400" />
                    <span className="text-white font-medium">Personalized Journeys Since 2012</span>
                  </motion.div>

                  <motion.h1
                    key={currentSlide}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="text-5xl md:text-7xl lg:text-8xl font-bold text-white mb-6 font-playfair"
                  >
                    {currentHeroSlide?.title || 'Discover Sri Lanka Your Way'}
                  </motion.h1>

                  <motion.p
                    key={`subtitle-${currentSlide}`}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                    className="text-2xl md:text-3xl text-white/90 mb-4 font-light"
                  >
                    {currentHeroSlide?.subtitle || 'Private Tours with Local Experts'}
                  </motion.p>

                  <motion.p
                    key={`desc-${currentSlide}`}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.4 }}
                    className="text-lg md:text-xl text-white/80 max-w-3xl mx-auto mb-8"
                  >
                    {currentHeroSlide?.description || 'Create unforgettable memories with personalized tours'}
                  </motion.p>

                  {/* Trust Indicators */}
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.6 }}
                    className="flex flex-wrap items-center justify-center gap-6 mb-12"
                  >
                    <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full text-white">
                      <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                      <span className="font-semibold">{pageContent?.trustIndicators.rating}/5</span>
                      <span className="text-white/70">({pageContent?.trustIndicators.totalReviews} reviews)</span>
                    </div>
                    <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full text-white">
                      <Award className="w-5 h-5 text-green-400" />
                      <span>TripAdvisor Excellence</span>
                    </div>
                    <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full text-white">
                      <Shield className="w-5 h-5 text-blue-400" />
                      <span>{pageContent?.trustIndicators.support} Support</span>
                    </div>
                  </motion.div>

                  {/* CTA Buttons */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.8 }}
                    className="flex flex-col sm:flex-row gap-4 justify-center"
                  >
                    <Button
                      size="lg"
                      onClick={scrollToBooking}
                      className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-8 py-6 text-lg rounded-full shadow-2xl"
                    >
                      <Route className="w-5 h-5 mr-2" />
                      Plan Your Tour
                    </Button>
                    <a href={`https://wa.me/${pageContent?.ctaSection?.whatsappNumber?.replace(/\+/g, '') || '94777721999'}`}>
                      <Button
                        size="lg"
                        variant="outline"
                        className="border-2 border-white text-white hover:bg-white/10 px-8 py-6 text-lg rounded-full backdrop-blur-sm"
                      >
                        <MessageCircle className="w-5 h-5 mr-2" />
                        WhatsApp Us
                      </Button>
                    </a>
                  </motion.div>
                </motion.div>

                {/* Quick Stats */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1 }}
                  className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto"
                >
                  {[
                    { icon: Globe, value: pageContent?.trustIndicators.toursCompleted || '5,000+', label: 'Tours Completed' },
                    { icon: Users, value: pageContent?.trustIndicators.totalReviews || '1,892', label: 'Happy Travelers' },
                    { icon: Clock, value: pageContent?.trustIndicators.yearsExperience || '12', label: 'Years Experience' },
                    { icon: Award, value: '100%', label: 'Satisfaction Rate' }
                  ].map((stat, idx) => (
                    <div key={idx} className="text-center bg-white/10 backdrop-blur-sm rounded-2xl p-4">
                      <stat.icon className="w-8 h-8 text-white/80 mx-auto mb-2" />
                      <div className="text-2xl font-bold text-white">{stat.value}</div>
                      <div className="text-sm text-white/70">{stat.label}</div>
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
                  currentSlide === index ? 'w-8 bg-white' : 'bg-white/50 hover:bg-white/70'
                }`}
              />
            ))}
          </div>

          {/* Scroll Indicator */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1, y: [0, 10, 0] }}
            transition={{ delay: 1.5, y: { repeat: Infinity, duration: 1.5 } }}
            className="absolute bottom-20 left-1/2 transform -translate-x-1/2 z-30"
          >
            <ChevronDown className="w-8 h-8 text-white/60" />
          </motion.div>
        </section>

        {/* ==================== CATEGORIES SECTION ==================== */}
        <section className="py-20 bg-gradient-to-b from-gray-50 to-white">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-12"
            >
              <Badge className="mb-4 bg-purple-100 text-purple-700 px-4 py-1">Explore By Interest</Badge>
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4 font-playfair">
                Choose Your Adventure
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                From ancient temples to wild safaris, find the perfect tour for your interests
              </p>
            </motion.div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              {categories.map((category, index) => {
                const IconComponent = iconMap[category.icon] || Globe;
                return (
                  <motion.button
                    key={category.id}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                    whileHover={{ scale: 1.05, y: -5 }}
                    onClick={() => setActiveCategory(activeCategory === category.id ? null : category.id)}
                    className={`p-6 rounded-2xl text-center transition-all ${
                      activeCategory === category.id
                        ? 'bg-purple-600 text-white shadow-xl'
                        : 'bg-white text-gray-700 hover:shadow-lg border border-gray-100'
                    }`}
                  >
                    <div
                      className={`w-14 h-14 rounded-xl mx-auto mb-3 flex items-center justify-center ${
                        activeCategory === category.id ? 'bg-white/20' : 'bg-purple-100'
                      }`}
                      style={{ backgroundColor: activeCategory !== category.id ? `${category.color}20` : undefined }}
                    >
                      <IconComponent
                        className="w-7 h-7"
                        style={{ color: activeCategory === category.id ? 'white' : category.color }}
                      />
                    </div>
                    <h3 className="font-semibold text-sm">{category.name}</h3>
                  </motion.button>
                );
              })}
            </div>
          </div>
        </section>

        {/* ==================== TOUR PACKAGES SECTION ==================== */}
        <section className="py-20 bg-white">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-12"
            >
              <Badge className="mb-4 bg-green-100 text-green-700 px-4 py-1">
                {activeCategory ? 'Filtered Tours' : 'Popular Packages'}
              </Badge>
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4 font-playfair">
                {activeCategory
                  ? `${categories.find(c => c.id === activeCategory)?.name} Tours`
                  : 'Popular Private Tour Packages'}
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Handcrafted itineraries designed by local experts for unforgettable experiences
              </p>
            </motion.div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {displayPackages.map((pkg: any, index) => (
                <motion.div
                  key={pkg.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ y: -10 }}
                >
                  <Card className={`overflow-hidden h-full hover:shadow-2xl transition-all duration-300 ${
                    pkg.popular ? 'ring-2 ring-purple-500' : ''
                  }`}>
                    {/* Image */}
                    <div className="relative h-52 overflow-hidden">
                      <img
                        src={pkg.heroImage}
                        alt={pkg.name}
                        className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />

                      {/* Badges */}
                      <div className="absolute top-4 left-4 flex gap-2">
                        {pkg.popular && (
                          <Badge className="bg-purple-600 text-white">Most Popular</Badge>
                        )}
                        {pkg.featured && (
                          <Badge className="bg-yellow-500 text-white">Featured</Badge>
                        )}
                      </div>

                      {/* Rating */}
                      {pkg.rating && (
                        <div className="absolute top-4 right-4 flex items-center gap-1 bg-white/90 px-2 py-1 rounded-full">
                          <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                          <span className="text-sm font-semibold">{pkg.rating}</span>
                          <span className="text-xs text-gray-500">({pkg.reviewCount})</span>
                        </div>
                      )}

                      {/* Duration & Price */}
                      <div className="absolute bottom-4 left-4 right-4 flex justify-between items-end">
                        <div className="flex items-center gap-1 text-white">
                          <Clock className="w-4 h-4" />
                          <span className="text-sm font-medium">
                            {pkg.duration?.days || 3} Days / {pkg.duration?.nights || 2} Nights
                          </span>
                        </div>
                        <div className="text-right">
                          <div className="text-xs text-white/80">From</div>
                          <div className="text-2xl font-bold text-white">
                            ${pkg.pricing?.basePrice || 350}
                          </div>
                        </div>
                      </div>
                    </div>

                    <CardHeader className="pb-2">
                      <CardTitle className="text-xl">{pkg.name}</CardTitle>
                      <CardDescription>{pkg.shortDescription}</CardDescription>
                    </CardHeader>

                    <CardContent>
                      {/* Highlights */}
                      <div className="space-y-2 mb-4">
                        {(pkg.highlights || []).slice(0, 4).map((highlight: any, idx: number) => (
                          <div key={idx} className="flex items-center gap-2 text-sm text-gray-600">
                            <Check className="w-4 h-4 text-green-500 flex-shrink-0" />
                            <span>{highlight.title || highlight}</span>
                          </div>
                        ))}
                      </div>

                      {/* CTA */}
                      <div className="flex gap-2">
                        <Button
                          className="flex-1 bg-purple-600 hover:bg-purple-700"
                          onClick={scrollToBooking}
                        >
                          Book Now
                        </Button>
                        <Button variant="outline" className="border-purple-200 text-purple-600">
                          Details
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>

            {/* Custom Tour CTA */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mt-12"
            >
              <p className="text-gray-600 mb-4">Don't see what you're looking for?</p>
              <Button
                size="lg"
                variant="outline"
                onClick={scrollToBooking}
                className="border-2 border-purple-600 text-purple-600 hover:bg-purple-50"
              >
                <Sparkles className="w-5 h-5 mr-2" />
                Create Custom Tour
              </Button>
            </motion.div>
          </div>
        </section>

        {/* ==================== BOOKING SECTION ==================== */}
        <section id="booking-section" className="py-20 bg-gradient-to-br from-purple-900 via-purple-800 to-pink-900">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-12"
            >
              <Badge className="mb-4 bg-white/20 text-white px-4 py-1">Start Planning</Badge>
              <h2 className="text-4xl md:text-5xl font-bold text-white mb-4 font-playfair">
                Book Your Private Tour
              </h2>
              <p className="text-xl text-white/80 max-w-3xl mx-auto">
                Tell us your preferences and we'll create the perfect itinerary for you
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="bg-white rounded-3xl shadow-2xl overflow-hidden max-w-5xl mx-auto"
            >
              <div className="p-8">
                <TransferBookingForm />
              </div>
            </motion.div>
          </div>
        </section>

        {/* ==================== MEET OUR GUIDES ==================== */}
        <section className="py-20 bg-gray-50">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-12"
            >
              <Badge className="mb-4 bg-blue-100 text-blue-700 px-4 py-1">Expert Team</Badge>
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4 font-playfair">
                Meet Your Guides
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Passionate locals who know every hidden gem and secret story
              </p>
            </motion.div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-5xl mx-auto">
              {guides.map((guide, index) => (
                <motion.div
                  key={guide.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ y: -5 }}
                >
                  <Card className="text-center overflow-hidden hover:shadow-xl transition-all">
                    <div className="relative pt-8 pb-4 bg-gradient-to-br from-purple-500 to-pink-500">
                      <img
                        src={guide.photo}
                        alt={guide.name}
                        className="w-24 h-24 rounded-full mx-auto border-4 border-white shadow-lg object-cover"
                      />
                    </div>
                    <CardContent className="pt-4">
                      <h3 className="text-xl font-bold text-gray-900 mb-1">{guide.name}</h3>
                      <div className="flex items-center justify-center gap-1 mb-3">
                        <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                        <span className="font-semibold">{guide.rating}</span>
                        <span className="text-gray-500 text-sm">({guide.reviewCount} reviews)</span>
                      </div>
                      <div className="flex flex-wrap justify-center gap-1 mb-3">
                        {guide.languages.map((lang, idx) => (
                          <Badge key={idx} variant="secondary" className="text-xs">{lang}</Badge>
                        ))}
                      </div>
                      <p className="text-gray-600 text-sm mb-3">{guide.bio}</p>
                      <div className="flex flex-wrap justify-center gap-1">
                        {guide.specialties.map((spec, idx) => (
                          <Badge key={idx} className="bg-purple-100 text-purple-700 text-xs">{spec}</Badge>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* ==================== TESTIMONIALS ==================== */}
        <section className="py-20 bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white overflow-hidden">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-12"
            >
              <Badge className="mb-4 bg-white/20 text-white px-4 py-1">Traveler Stories</Badge>
              <h2 className="text-4xl md:text-5xl font-bold mb-4 font-playfair">
                What Our Travelers Say
              </h2>
              <p className="text-xl text-white/80 max-w-3xl mx-auto">
                Real experiences from real travelers
              </p>
            </motion.div>

            <div className="max-w-4xl mx-auto">
              <AnimatePresence mode="wait">
                {testimonials[currentTestimonial] && (
                  <motion.div
                    key={currentTestimonial}
                    initial={{ opacity: 0, x: 50 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -50 }}
                    className="bg-white/10 backdrop-blur-xl rounded-3xl p-8 md:p-12"
                  >
                    <Quote className="w-12 h-12 text-purple-400 mb-6" />
                    <p className="text-2xl md:text-3xl text-white leading-relaxed mb-8 italic">
                      "{testimonials[currentTestimonial].text}"
                    </p>
                    <div className="flex items-center gap-4">
                      <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-2xl font-bold">
                        {testimonials[currentTestimonial].avatar || testimonials[currentTestimonial].name.charAt(0)}
                      </div>
                      <div>
                        <h4 className="text-xl font-bold">{testimonials[currentTestimonial].name}</h4>
                        <div className="flex items-center gap-2 text-white/70">
                          <MapPin className="w-4 h-4" />
                          <span>{testimonials[currentTestimonial].country}</span>
                          <span>•</span>
                          <span>{testimonials[currentTestimonial].tourType}</span>
                        </div>
                        <div className="flex gap-1 mt-1">
                          {[...Array(testimonials[currentTestimonial].rating)].map((_, i) => (
                            <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                          ))}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Navigation */}
              <div className="flex justify-center items-center gap-4 mt-8">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setCurrentTestimonial((prev) => (prev - 1 + testimonials.length) % testimonials.length)}
                  className="text-white hover:bg-white/10"
                >
                  <ChevronLeft className="w-6 h-6" />
                </Button>
                <div className="flex gap-2">
                  {testimonials.map((_, idx) => (
                    <button
                      key={idx}
                      onClick={() => setCurrentTestimonial(idx)}
                      className={`w-2 h-2 rounded-full transition-all ${
                        idx === currentTestimonial ? 'w-8 bg-white' : 'bg-white/40'
                      }`}
                    />
                  ))}
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setCurrentTestimonial((prev) => (prev + 1) % testimonials.length)}
                  className="text-white hover:bg-white/10"
                >
                  <ChevronRight className="w-6 h-6" />
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* ==================== WHY CHOOSE US ==================== */}
        <section className="py-20 bg-white">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-12"
            >
              <Badge className="mb-4 bg-purple-100 text-purple-700 px-4 py-1">Our Promise</Badge>
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4 font-playfair">
                Why Choose Our Private Tours?
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Experience the difference of truly personalized travel
              </p>
            </motion.div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {(pageContent?.whyChooseUs || []).map((item, index) => {
                const IconComponent = iconMap[item.icon] || Globe;
                return (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                    whileHover={{ y: -5, scale: 1.02 }}
                  >
                    <Card className="h-full hover:shadow-xl transition-all border-2 border-transparent hover:border-purple-200">
                      <CardHeader>
                        <div className="w-14 h-14 bg-purple-100 rounded-xl flex items-center justify-center mb-4">
                          <IconComponent className="w-7 h-7 text-purple-600" />
                        </div>
                        <CardTitle className="text-xl">{item.title}</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-gray-600 mb-4">{item.description}</p>
                        <div className="flex items-center text-purple-600 font-semibold">
                          <Zap className="w-4 h-4 mr-2" />
                          {item.benefit}
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </section>

        {/* ==================== WHAT'S INCLUDED ==================== */}
        <section className="py-20 bg-gray-50">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-12"
            >
              <Badge className="mb-4 bg-green-100 text-green-700 px-4 py-1">All Inclusive</Badge>
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4 font-playfair">
                What's Included
              </h2>
            </motion.div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-5xl mx-auto">
              {[
                { icon: Car, title: 'Premium Vehicle', desc: 'Air-conditioned with WiFi' },
                { icon: User, title: 'Expert Guide', desc: 'English-speaking local' },
                { icon: Wifi, title: 'Free WiFi', desc: 'Stay connected always' },
                { icon: Coffee, title: 'Refreshments', desc: 'Water & snacks included' },
                { icon: Camera, title: 'Photo Stops', desc: 'Unlimited scenic stops' },
                { icon: Shield, title: 'Full Insurance', desc: 'Travel with peace of mind' },
                { icon: Headphones, title: '24/7 Support', desc: 'Always here for you' },
                { icon: Heart, title: 'Customizable', desc: 'Your pace, your way' }
              ].map((item, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.05 }}
                  className="flex items-start gap-4 p-4 bg-white rounded-xl shadow-sm"
                >
                  <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center flex-shrink-0">
                    <item.icon className="w-6 h-6 text-green-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">{item.title}</h4>
                    <p className="text-sm text-gray-600">{item.desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* ==================== FINAL CTA ==================== */}
        <section className="py-24 bg-gradient-to-r from-purple-600 via-pink-600 to-purple-600 relative overflow-hidden">
          {/* Animated background */}
          <div className="absolute inset-0 opacity-20">
            <motion.div
              className="absolute top-20 left-10 w-72 h-72 bg-white rounded-full blur-3xl"
              animate={{ x: [0, 50, 0], y: [0, 30, 0] }}
              transition={{ duration: 20, repeat: Infinity }}
            />
            <motion.div
              className="absolute bottom-20 right-10 w-96 h-96 bg-yellow-400 rounded-full blur-3xl"
              animate={{ x: [0, -50, 0], y: [0, -30, 0] }}
              transition={{ duration: 25, repeat: Infinity }}
            />
          </div>

          <div className="container mx-auto px-4 relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center text-white"
            >
              <h2 className="text-4xl md:text-6xl font-bold mb-6 font-playfair">
                {pageContent?.ctaSection?.title || 'Ready to Start Your Adventure?'}
              </h2>
              <p className="text-xl md:text-2xl mb-10 max-w-3xl mx-auto opacity-90">
                {pageContent?.ctaSection?.subtitle || "Let us create the perfect Sri Lankan journey tailored just for you"}
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button
                  size="lg"
                  onClick={scrollToBooking}
                  className="bg-white text-purple-600 hover:bg-gray-100 px-10 py-6 text-lg rounded-full shadow-2xl"
                >
                  <Route className="w-5 h-5 mr-2" />
                  {pageContent?.ctaSection?.primaryCta || 'Book Private Tour'}
                </Button>
                <a href={`https://wa.me/${pageContent?.ctaSection?.whatsappNumber?.replace(/\+/g, '') || '94777721999'}`}>
                  <Button
                    size="lg"
                    variant="outline"
                    className="border-2 border-white text-white hover:bg-white/10 px-10 py-6 text-lg rounded-full"
                  >
                    <MessageCircle className="w-5 h-5 mr-2" />
                    {pageContent?.ctaSection?.secondaryCta || 'Talk to Expert'}
                  </Button>
                </a>
              </div>

              <p className="mt-8 text-white/70">
                Or call us directly: <a href="tel:+94777721999" className="underline font-semibold">+94 77 77 21 999</a>
              </p>
            </motion.div>
          </div>
        </section>
      </div>

      <Footer />
    </>
  );
};

export default PrivateTours;
