import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Building,
  MapPin,
  Calendar,
  Clock,
  Star,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Utensils,
  Camera,
  Heart,
  Users,
  DollarSign,
  Info,
  Sun,
  Cloud,
  Thermometer,
  Droplets,
  Wind,
  Waves,
  Palmtree,
  Landmark,
  Phone,
  Mail,
  CheckCircle,
  Globe,
  Sparkles,
  Umbrella,
  Bed,
  Wifi,
  Car,
  Coffee,
  Compass,
  Luggage,
  Shield,
  Plane,
  Mountain,
  Ship,
  Fish,
  TreePalm,
  Languages,
  CircleDollarSign,
  BookOpen,
  Temple,
  Castle,
  Anchor,
  Bike,
  UtensilsCrossed,
  Leaf
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import DestinationMap from '@/components/destinations/DestinationMap';
import WeatherWidget from '@/components/destinations/WeatherWidget';
import { getDestinationBySlug } from '@/services/destinationContentService';
import { jaffnaDestinationContent } from '@/data/destinations/jaffnaContent';

// Jaffna center coordinates
const JAFFNA_CENTER = { lat: 9.6615, lng: 80.0255 };

// Type Definitions
interface HeroSlide {
  id: string;
  image: string;
  title: string;
  subtitle: string;
}

interface Attraction {
  id: string;
  name: string;
  description: string;
  image: string;
  category: string;
  rating: number;
  duration: string;
  price: string;
  highlights: string[];
  icon?: string;
}

interface Activity {
  id: string;
  name: string;
  description: string;
  icon: string;
  price: string;
  duration: string;
  difficulty?: string;
  popular?: boolean;
}

interface Restaurant {
  id?: string;
  name: string;
  cuisine: string;
  priceRange: string;
  rating: number;
  image: string;
  description: string;
  address: string;
  specialties?: string[];
  openHours?: string;
}

interface HotelInfo {
  id?: string;
  name: string;
  category?: string;
  priceRange: string;
  starRating: number;
  image: string;
  description: string;
  amenities: string[];
  address: string;
}

interface DestinationInfo {
  population: string;
  area: string;
  elevation: string;
  bestTime: string;
  language: string;
  currency: string;
}

interface WeatherInfo {
  season: string;
  temperature: string;
  rainfall: string;
  humidity: string;
  bestMonths?: string[];
  packingTips?: string[];
}

interface TravelTip {
  id?: string;
  title: string;
  icon?: string;
  tips?: string[];
  content?: string;
  category?: string;
}

interface SEOSettings {
  title: string;
  description: string;
  keywords: string[];
}

interface CTASection {
  title: string;
  subtitle: string;
  buttonText: string;
}

interface SignatureTour {
  id?: string;
  name: string;
  description: string;
  image: string;
  duration: string;
  priceFrom: string;
  highlights: string[];
  includes: string[];
  badge?: string;
  isBestSeller?: boolean;
}

// Default Content fed by CMS seed file
const defaultHeroSlides: HeroSlide[] = jaffnaDestinationContent.heroSlides;
const defaultAttractions: Attraction[] = jaffnaDestinationContent.attractions;
const defaultActivities: Activity[] = jaffnaDestinationContent.activities;
const defaultRestaurants: Restaurant[] = jaffnaDestinationContent.restaurants;
const defaultHotels: HotelInfo[] = jaffnaDestinationContent.hotels;
const defaultWeatherInfo: WeatherInfo = {
  ...jaffnaDestinationContent.weatherInfo,
  bestMonths: jaffnaDestinationContent.weatherInfo.bestMonths || [],
  packingTips: jaffnaDestinationContent.weatherInfo.packingTips || []
};
const defaultTravelTips: TravelTip[] = jaffnaDestinationContent.travelTips;
const defaultDestinationInfo: DestinationInfo = jaffnaDestinationContent.destinationInfo;
const defaultSEOSettings: SEOSettings = jaffnaDestinationContent.seo;
const defaultCTASection: CTASection = jaffnaDestinationContent.ctaSection || {
  title: 'Ready to Explore Jaffna?',
  subtitle: 'Experience the unique Tamil culture, ancient temples, and pristine islands with our expert guides',
  buttonText: 'Book Your Journey'
};
const defaultSignatureTours: SignatureTour[] = jaffnaDestinationContent.signatureTours || [];

// Icon mapping function
const getIconComponent = (iconName: string) => {
  const iconMap: { [key: string]: any } = {
    'Building': Building,
    'MapPin': MapPin,
    'Calendar': Calendar,
    'Clock': Clock,
    'Star': Star,
    'Utensils': Utensils,
    'Camera': Camera,
    'Heart': Heart,
    'Users': Users,
    'DollarSign': DollarSign,
    'Info': Info,
    'Sun': Sun,
    'Cloud': Cloud,
    'Thermometer': Thermometer,
    'Droplets': Droplets,
    'Wind': Wind,
    'Waves': Waves,
    'Palmtree': Palmtree,
    'TreePalm': TreePalm,
    'Landmark': Landmark,
    'Phone': Phone,
    'Mail': Mail,
    'CheckCircle': CheckCircle,
    'Globe': Globe,
    'Sparkles': Sparkles,
    'Umbrella': Umbrella,
    'Bed': Bed,
    'Wifi': Wifi,
    'Car': Car,
    'Coffee': Coffee,
    'Compass': Compass,
    'Luggage': Luggage,
    'Shield': Shield,
    'Plane': Plane,
    'Mountain': Mountain,
    'Ship': Ship,
    'Fish': Fish,
    'Languages': Languages,
    'CircleDollarSign': CircleDollarSign,
    'BookOpen': BookOpen,
    'Castle': Castle,
    'Anchor': Anchor,
    'Bike': Bike,
    'UtensilsCrossed': UtensilsCrossed,
    'Leaf': Leaf
  };
  return iconMap[iconName] || Landmark;
};

const Jaffna = () => {
  const navigate = useNavigate();

  // State for content
  const [heroSlides, setHeroSlides] = useState<HeroSlide[]>(defaultHeroSlides);
  const [attractions, setAttractions] = useState<Attraction[]>(defaultAttractions);
  const [activities, setActivities] = useState<Activity[]>(defaultActivities);
  const [restaurants, setRestaurants] = useState<Restaurant[]>(defaultRestaurants);
  const [hotels, setHotels] = useState<HotelInfo[]>(defaultHotels);
  const [weatherInfo, setWeatherInfo] = useState<WeatherInfo>(defaultWeatherInfo);
  const [travelTips, setTravelTips] = useState<TravelTip[]>(defaultTravelTips);
  const [destinationInfo, setDestinationInfo] = useState<DestinationInfo>(defaultDestinationInfo);
  const [seoSettings, setSeoSettings] = useState<SEOSettings>(defaultSEOSettings);
  const [ctaSection, setCtaSection] = useState<CTASection>(defaultCTASection);
  const [signatureTours, setSignatureTours] = useState<SignatureTour[]>(defaultSignatureTours);

  // UI State
  const [currentSlide, setCurrentSlide] = useState(0);
  const [selectedTab, setSelectedTab] = useState('attractions');
  const [isLoading, setIsLoading] = useState(true);

  // Load content from Firebase
  useEffect(() => {
    const loadContent = async () => {
      try {
        const data = await getDestinationBySlug('jaffna');
        if (data) {
          if (data.heroSlides?.length) setHeroSlides(data.heroSlides);
          if (data.attractions?.length) setAttractions(data.attractions);
          if (data.activities?.length) setActivities(data.activities);
          if (data.restaurants?.length) setRestaurants(data.restaurants);
          if (data.hotels?.length) setHotels(data.hotels);
          if (data.weatherInfo) {
            setWeatherInfo({
              ...defaultWeatherInfo,
              ...data.weatherInfo,
              bestMonths: data.weatherInfo.bestMonths || defaultWeatherInfo.bestMonths,
              packingTips: data.weatherInfo.packingTips || defaultWeatherInfo.packingTips
            });
          }
          if (data.travelTips?.length) {
            const normalizedTips = data.travelTips.map((tip, index) => {
              const entries =
                tip.tips && tip.tips.length
                  ? tip.tips
                  : tip.content
                    ? tip.content
                        .split('\n')
                        .map((item) => item.trim())
                        .filter(Boolean)
                    : [];
              return {
                ...tip,
                id: tip.id || `tip-${index}`,
                tips: entries
              };
            });
            setTravelTips(normalizedTips);
          }
          if (data.destinationInfo) setDestinationInfo(data.destinationInfo);
          if (data.seo) setSeoSettings(data.seo);
          if (data.ctaSection) setCtaSection(data.ctaSection);
          if (data.signatureTours?.length) setSignatureTours(data.signatureTours);
        }
      } catch (error) {
        console.error('Error loading Jaffna content:', error);
      } finally {
        setIsLoading(false);
      }
    };
    loadContent();
  }, []);

  // Auto-cycle hero slides
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [heroSlides.length]);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + heroSlides.length) % heroSlides.length);
  };

  const tabs = [
    { id: 'attractions', label: 'Attractions', count: attractions.length },
    { id: 'activities', label: 'Activities', count: activities.length },
    { id: 'dining', label: 'Dining', count: restaurants.length },
    { id: 'stay', label: 'Stay', count: hotels.length },
    { id: 'map', label: 'Map', count: null },
    { id: 'weather', label: 'Weather', count: null },
    { id: 'tips', label: 'Travel Tips', count: travelTips.length }
  ];

  const handleBooking = (service: string, tourData?: { id: string; name: string; description: string; duration: string; price: number; features: string[]; image?: string }) => {
    const params = new URLSearchParams({
      title: tourData?.name || service,
      id: tourData?.id || service.toLowerCase().replace(/\s+/g, '-'),
      duration: tourData?.duration || '8 hours',
      price: String(tourData?.price || 95),
      image: tourData?.image || 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800',
      subtitle: `Jaffna - ${tourData?.name || service}`
    });
    navigate(`/book-tour?${params.toString()}`);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-rose-50 to-red-100">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-rose-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-rose-800 font-medium">Loading Jaffna...</p>
        </div>
      </div>
    );
  }

  const keywordContent = Array.isArray(seoSettings.keywords)
    ? seoSettings.keywords.join(', ')
    : seoSettings.keywords || '';

  return (
    <>
      <Helmet>
        <title>{seoSettings.title}</title>
        <meta name="description" content={seoSettings.description} />
        <meta name="keywords" content={keywordContent} />
        <meta property="og:title" content={seoSettings.title} />
        <meta property="og:description" content={seoSettings.description} />
        <meta property="og:image" content={heroSlides[0]?.image} />
        <meta property="og:url" content="https://www.rechargetravels.com/destinations/jaffna" />
        <link rel="canonical" href="https://www.rechargetravels.com/destinations/jaffna" />
      </Helmet>

      <Header />

      <main className="min-h-screen bg-background">
        {/* Hero Section */}
        <section className="relative aspect-video max-h-[80vh] overflow-hidden">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentSlide}
              initial={{ opacity: 0, scale: 1.1 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1.2 }}
              className="absolute inset-0"
            >
              <div
                className="h-full bg-cover bg-center"
                style={{ backgroundImage: `url(${heroSlides[currentSlide]?.image})` }}
              >
                <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/20 to-black/70" />
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Hero Content */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center text-white px-4 max-w-5xl">
              <motion.div
                initial={{ y: -20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="mb-4"
              >
                <Badge className="bg-rose-600/80 text-white text-sm px-4 py-1">
                  Tamil Heritage Capital
                </Badge>
              </motion.div>
              <motion.h1
                initial={{ y: 30, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="text-5xl md:text-7xl font-bold mb-6"
              >
                {heroSlides[currentSlide]?.title}
              </motion.h1>
              <motion.p
                initial={{ y: 30, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.6 }}
                className="text-xl md:text-2xl mb-8 text-white/90"
              >
                {heroSlides[currentSlide]?.subtitle}
              </motion.p>
              <motion.div
                initial={{ y: 30, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.8 }}
                className="flex gap-4 justify-center flex-wrap"
              >
                <Button
                  size="lg"
                  className="bg-rose-600 hover:bg-rose-700 text-white px-8 py-6 text-lg"
                  onClick={() => handleBooking('Jaffna Cultural Tour')}
                >
                  Book Now
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="bg-white/10 backdrop-blur-sm text-white border-white hover:bg-white/20 px-8 py-6 text-lg"
                  onClick={() => document.getElementById('content')?.scrollIntoView({ behavior: 'smooth' })}
                >
                  Explore More
                </Button>
              </motion.div>
            </div>
          </div>

          {/* Navigation Arrows */}
          <button
            onClick={prevSlide}
            className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/20 backdrop-blur-sm text-white p-3 rounded-full hover:bg-white/30 transition-all"
            aria-label="Previous slide"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
          <button
            onClick={nextSlide}
            className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/20 backdrop-blur-sm text-white p-3 rounded-full hover:bg-white/30 transition-all"
            aria-label="Next slide"
          >
            <ChevronRight className="w-6 h-6" />
          </button>

          {/* Slide Indicators */}
          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-2">
            {heroSlides.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentSlide(index)}
                className={`h-2 rounded-full transition-all ${
                  currentSlide === index ? 'bg-white w-8' : 'bg-white/50 w-2'
                }`}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>

          {/* Scroll Indicator */}
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ repeat: Infinity, duration: 2 }}
            className="absolute bottom-20 left-1/2 -translate-x-1/2"
          >
            <ChevronDown className="w-8 h-8 text-white/70" />
          </motion.div>
        </section>

        {/* Quick Info Bar */}
        <section className="relative -mt-4 md:mt-0 lg:mt-8 z-10 px-4">
          <div className="container mx-auto">
            <Card className="bg-white/95 backdrop-blur-md shadow-2xl border-0">
              <CardContent className="py-6">
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6 text-center">
                  <div className="flex flex-col items-center">
                    <Users className="w-6 h-6 text-rose-600 mb-2" />
                    <span className="text-sm text-gray-500">Population</span>
                    <span className="font-semibold text-gray-900">{destinationInfo.population}</span>
                  </div>
                  <div className="flex flex-col items-center">
                    <MapPin className="w-6 h-6 text-rose-600 mb-2" />
                    <span className="text-sm text-gray-500">Area</span>
                    <span className="font-semibold text-gray-900">{destinationInfo.area}</span>
                  </div>
                  <div className="flex flex-col items-center">
                    <Thermometer className="w-6 h-6 text-rose-600 mb-2" />
                    <span className="text-sm text-gray-500">Temperature</span>
                    <span className="font-semibold text-gray-900">{weatherInfo.temperature}</span>
                  </div>
                  <div className="flex flex-col items-center">
                    <Calendar className="w-6 h-6 text-rose-600 mb-2" />
                    <span className="text-sm text-gray-500">Best Time</span>
                    <span className="font-semibold text-gray-900">{destinationInfo.bestTime}</span>
                  </div>
                  <div className="flex flex-col items-center">
                    <Languages className="w-6 h-6 text-rose-600 mb-2" />
                    <span className="text-sm text-gray-500">Language</span>
                    <span className="font-semibold text-gray-900">{destinationInfo.language}</span>
                  </div>
                  <div className="flex flex-col items-center">
                    <CircleDollarSign className="w-6 h-6 text-rose-600 mb-2" />
                    <span className="text-sm text-gray-500">Currency</span>
                    <span className="font-semibold text-gray-900">{destinationInfo.currency}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Tabs Navigation */}
        <nav id="content" className="sticky top-0 z-40 bg-white border-b shadow-sm mt-8">
          <div className="container mx-auto px-4">
            <div className="flex overflow-x-auto scrollbar-hide">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setSelectedTab(tab.id)}
                  className={`px-6 py-4 font-medium transition-all whitespace-nowrap border-b-2 ${
                    selectedTab === tab.id
                      ? 'border-rose-600 text-rose-600'
                      : 'border-transparent text-muted-foreground hover:text-foreground'
                  }`}
                >
                  {tab.label}
                  {tab.count && (
                    <Badge variant="secondary" className="ml-2 bg-rose-100 text-rose-700">
                      {tab.count}
                    </Badge>
                  )}
                </button>
              ))}
            </div>
          </div>
        </nav>

        {/* Content Sections */}
        <div className="container mx-auto px-4 py-12">
          <AnimatePresence mode="wait">
            {/* Attractions Tab */}
            {selectedTab === 'attractions' && (
              <motion.section
                key="attractions"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
              >
                <div className="text-center mb-12">
                  <h2 className="text-4xl font-bold mb-4">Top Attractions in Jaffna</h2>
                  <p className="text-muted-foreground max-w-2xl mx-auto">
                    Discover ancient temples, colonial forts, and pristine islands
                  </p>
                </div>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {attractions.map((attraction, index) => {
                    const IconComponent = getIconComponent(attraction.icon || 'Landmark');
                    return (
                      <motion.div
                        key={`${attraction.id || attraction.name}-${index}`}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                      >
                        <Card className="group relative h-full overflow-hidden border-0 shadow-xl text-white">
                          <div
                            className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105"
                            style={{ backgroundImage: `url(${attraction.image})` }}
                          />
                          <div className="absolute inset-0 bg-gradient-to-br from-black/80 via-black/60 to-black/80" />
                          <div className="relative z-10 flex flex-col h-full p-6">
                            <div className="flex items-center justify-between mb-4">
                              <Badge className="bg-rose-500/80 text-white">
                                {attraction.category}
                              </Badge>
                              <div className="flex items-center gap-2">
                                <div className="bg-white/10 rounded-full p-2">
                                  <IconComponent className="w-5 h-5 text-white" />
                                </div>
                                <div className="flex items-center text-yellow-300">
                                  <Star className="w-4 h-4 fill-yellow-300" />
                                  <span className="ml-1 text-sm">{attraction.rating}</span>
                                </div>
                              </div>
                            </div>
                            <h3 className="text-2xl font-semibold mb-2">{attraction.name}</h3>
                            <p className="text-white/80 text-sm mb-4 line-clamp-2">{attraction.description}</p>
                            <div className="flex flex-wrap gap-2 mb-6">
                              {(attraction.highlights || []).slice(0, 4).map((highlight, idx) => (
                                <Badge
                                  key={`${highlight}-${idx}`}
                                  variant="outline"
                                  className="border-white/30 text-white/90 text-xs bg-white/5"
                                >
                                  {highlight}
                                </Badge>
                              ))}
                            </div>
                            <div className="mt-auto flex items-center justify-between text-sm text-white/80">
                              <span className="flex items-center gap-1">
                                <Clock className="w-4 h-4" />
                                {attraction.duration}
                              </span>
                              <span className="flex items-center gap-1">
                                <DollarSign className="w-4 h-4" />
                                {attraction.price}
                              </span>
                            </div>
                            <Button
                              className="mt-4 bg-white text-rose-600 hover:bg-rose-50"
                              onClick={() => handleBooking(attraction.name)}
                            >
                              Reserve Experience
                            </Button>
                          </div>
                        </Card>
                      </motion.div>
                    );
                  })}
                </div>
              </motion.section>
            )}

            {/* Activities Tab */}
            {selectedTab === 'activities' && (
              <motion.section
                key="activities"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
              >
                <div className="text-center mb-12">
                  <h2 className="text-4xl font-bold mb-4">Things to Do in Jaffna</h2>
                  <p className="text-muted-foreground max-w-2xl mx-auto">
                    From island hopping to cultural immersions, discover exciting experiences
                  </p>
                </div>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {activities.map((activity, index) => {
                    const IconComponent = getIconComponent(activity.icon);
                    return (
                      <motion.div
                        key={`${activity.id || activity.name}-${index}`}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                      >
                        <Card className="h-full hover:shadow-lg transition-shadow">
                          <CardHeader>
                            <div className="flex items-start justify-between">
                              <div className="flex items-center">
                                <div className="p-3 bg-rose-100 rounded-xl mr-4">
                                  <IconComponent className="w-6 h-6 text-rose-600" />
                                </div>
                                <div>
                                  <CardTitle className="text-lg">{activity.name}</CardTitle>
                                  {activity.popular && (
                                    <Badge className="mt-1 bg-orange-500 text-white">Popular</Badge>
                                  )}
                                </div>
                              </div>
                            </div>
                          </CardHeader>
                          <CardContent>
                            <p className="text-muted-foreground mb-4">{activity.description}</p>
                            <div className="flex items-center justify-between text-sm mb-4">
                              <span className="text-rose-600 font-semibold">{activity.price}</span>
                              <span className="text-muted-foreground">{activity.duration}</span>
                            </div>
                            {activity.difficulty && (
                              <Badge variant="outline" className="mb-4 border-rose-200">
                                {activity.difficulty}
                              </Badge>
                            )}
                            <Button
                              variant="outline"
                              className="w-full border-rose-600 text-rose-600 hover:bg-rose-600 hover:text-white"
                              onClick={() => handleBooking(activity.name)}
                            >
                              Book Activity
                            </Button>
                          </CardContent>
                        </Card>
                      </motion.div>
                    );
                  })}
                </div>
              </motion.section>
            )}

            {/* Dining Tab */}
            {selectedTab === 'dining' && (
              <motion.section
                key="dining"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
              >
                <div className="text-center mb-12">
                  <h2 className="text-4xl font-bold mb-4">Where to Eat in Jaffna</h2>
                  <p className="text-muted-foreground max-w-2xl mx-auto">
                    Authentic Tamil cuisine and local favorites
                  </p>
                </div>
                <div className="grid md:grid-cols-2 gap-8">
                  {restaurants.map((restaurant, index) => (
                    <motion.div
                      key={`${restaurant.id || restaurant.name}-${index}`}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <Card className="h-full hover:shadow-xl transition-all overflow-hidden">
                        <div className="md:flex">
                          <div className="md:w-2/5">
                            <img
                              src={restaurant.image}
                              alt={restaurant.name}
                          className="w-full h-48 md:h-full object-cover"
                        />
                      </div>
                      <div className="md:w-3/5 p-6">
                        <div className="flex items-start justify-between mb-2">
                              <h3 className="text-xl font-bold">{restaurant.name}</h3>
                              <div className="flex items-center">
                                <Star className="w-4 h-4 text-yellow-500 fill-current" />
                                <span className="ml-1 text-sm">{restaurant.rating}</span>
                              </div>
                        </div>
                        <div className="flex items-center gap-2 mb-3">
                          <Badge variant="outline" className="border-rose-200 text-rose-700">
                            {restaurant.cuisine}
                          </Badge>
                          <Badge className="bg-rose-100 text-rose-700">
                            {restaurant.priceRange}
                          </Badge>
                        </div>
                        <div className="flex items-center text-sm text-muted-foreground mb-2">
                          <MapPin className="w-4 h-4 mr-1" />
                          {restaurant.address || 'Jaffna Peninsula'}
                        </div>
                        <p className="text-muted-foreground text-sm mb-4">{restaurant.description}</p>
                        {restaurant.specialties?.length ? (
                          <div className="mb-4">
                            <p className="text-xs text-muted-foreground mb-2">Signature dishes:</p>
                            <div className="flex flex-wrap gap-1">
                              {restaurant.specialties.map((specialty, idx) => (
                                <Badge key={`${specialty}-${idx}`} variant="secondary" className="text-xs">
                                  {specialty}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        ) : null}
                        {restaurant.openHours && (
                          <div className="flex items-center text-sm text-muted-foreground">
                            <Clock className="w-4 h-4 mr-1" />
                            {restaurant.openHours}
                          </div>
                        )}
                      </div>
                    </div>
                  </Card>
                </motion.div>
              ))}
                </div>
              </motion.section>
            )}

            {/* Stay Tab */}
            {selectedTab === 'stay' && (
              <motion.section
                key="stay"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
              >
                <div className="text-center mb-12">
                  <h2 className="text-4xl font-bold mb-4">Where to Stay in Jaffna</h2>
                  <p className="text-muted-foreground max-w-2xl mx-auto">
                    From heritage boutiques to modern hotels
                  </p>
                </div>
                <div className="grid md:grid-cols-2 gap-8">
                  {hotels.map((hotel, index) => (
                    <motion.div
                      key={`${hotel.id || hotel.name}-${index}`}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <Card className="h-full hover:shadow-xl transition-all overflow-hidden">
                        <div className="relative">
                          <img
                            src={hotel.image}
                            alt={hotel.name}
                            className="w-full h-56 object-cover"
                          />
                          {hotel.category && (
                            <div className="absolute top-4 left-4">
                              <Badge className="bg-rose-600 text-white">{hotel.category}</Badge>
                            </div>
                          )}
                          <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm rounded-full px-3 py-1 flex items-center">
                            <Star className="w-4 h-4 text-yellow-500 fill-current" />
                            <span className="ml-1 text-sm font-medium">
                              {hotel.starRating?.toFixed ? hotel.starRating.toFixed(1) : hotel.starRating}
                            </span>
                          </div>
                        </div>
                        <CardContent className="p-6">
                          <div className="flex items-start justify-between mb-2">
                            <h3 className="text-xl font-bold">{hotel.name}</h3>
                            <span className="text-rose-600 font-semibold text-sm">{hotel.priceRange}</span>
                          </div>
                          <div className="flex items-center text-sm text-muted-foreground mb-3">
                            <MapPin className="w-4 h-4 mr-1" />
                            {hotel.address || 'Jaffna Peninsula'}
                          </div>
                          <p className="text-muted-foreground text-sm mb-4">{hotel.description}</p>
                          <div className="flex flex-wrap gap-2 mb-4">
                            {hotel.amenities.slice(0, 4).map((amenity, idx) => (
                              <Badge key={idx} variant="outline" className="text-xs border-rose-200">
                                {amenity}
                              </Badge>
                            ))}
                            {hotel.amenities.length > 4 && (
                              <Badge variant="outline" className="text-xs">
                                +{hotel.amenities.length - 4} more
                              </Badge>
                            )}
                          </div>
                          <Button
                            className="w-full bg-rose-600 hover:bg-rose-700"
                            onClick={() => handleBooking(`${hotel.name} Booking`)}
                          >
                            Check Availability
                          </Button>
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))}
                </div>
              </motion.section>
            )}

            {/* Map Tab */}
            {selectedTab === 'map' && (
              <motion.section
                key="map"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
              >
                <div className="text-center mb-12">
                  <h2 className="text-4xl font-bold text-gray-900 mb-4">Explore Jaffna Map</h2>
                  <p className="text-gray-600 max-w-2xl mx-auto">
                    Discover temples, beaches, islands and cultural landmarks across the Jaffna Peninsula
                  </p>
                </div>

                <div className="grid lg:grid-cols-3 gap-8">
                  {/* Map */}
                  <div className="lg:col-span-2">
                    <DestinationMap
                      destinationName="Jaffna"
                      center={JAFFNA_CENTER}
                      attractions={attractions.map(a => ({
                        name: a.name,
                        description: a.description,
                        image: a.image,
                        category: a.category,
                        rating: a.rating,
                        duration: a.duration,
                        price: a.price,
                        highlights: a.highlights
                      }))}
                      height="600px"
                      onAttractionClick={(attraction) => handleBooking(attraction.name)}
                    />
                  </div>

                  {/* Weather Widget */}
                  <div>
                    <WeatherWidget
                      latitude={JAFFNA_CENTER.lat}
                      longitude={JAFFNA_CENTER.lng}
                      locationName="Jaffna"
                    />
                  </div>
                </div>
              </motion.section>
            )}

            {/* Weather Tab */}
            {selectedTab === 'weather' && (
              <motion.section
                key="weather"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
              >
                <div className="text-center mb-12">
                  <h2 className="text-4xl font-bold text-gray-900 mb-4">Weather in Jaffna</h2>
                  <p className="text-gray-600 max-w-2xl mx-auto">
                    Plan your visit with our comprehensive weather guide
                  </p>
                </div>
                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
                  <Card className="text-center p-6 bg-gradient-to-br from-rose-50 to-red-50">
                    <Thermometer className="w-10 h-10 text-rose-600 mx-auto mb-3" />
                    <h3 className="font-semibold mb-1">Temperature</h3>
                    <p className="text-2xl font-bold text-rose-600">{weatherInfo.temperature}</p>
                  </Card>
                  <Card className="text-center p-6 bg-gradient-to-br from-rose-50 to-red-50">
                    <Cloud className="w-10 h-10 text-rose-600 mx-auto mb-3" />
                    <h3 className="font-semibold mb-1">Climate</h3>
                    <p className="text-lg font-medium text-rose-600">{weatherInfo.season}</p>
                  </Card>
                  <Card className="text-center p-6 bg-gradient-to-br from-rose-50 to-red-50">
                    <Droplets className="w-10 h-10 text-rose-600 mx-auto mb-3" />
                    <h3 className="font-semibold mb-1">Humidity</h3>
                    <p className="text-2xl font-bold text-rose-600">{weatherInfo.humidity}</p>
                  </Card>
                  <Card className="text-center p-6 bg-gradient-to-br from-rose-50 to-red-50">
                    <Wind className="w-10 h-10 text-rose-600 mx-auto mb-3" />
                    <h3 className="font-semibold mb-1">Rainfall</h3>
                    <p className="text-sm font-medium text-rose-600">{weatherInfo.rainfall}</p>
                  </Card>
                </div>

                <div className="grid md:grid-cols-2 gap-8">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Calendar className="w-5 h-5 text-rose-600" />
                        Best Months to Visit
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="flex flex-wrap gap-2">
                        {(weatherInfo.bestMonths || defaultWeatherInfo.bestMonths || []).map((month, idx) => (
                          <Badge key={`${month}-${idx}`} className="bg-rose-100 text-rose-700 px-4 py-2">
                            {month}
                          </Badge>
                        ))}
                      </div>
                      <p className="text-muted-foreground mt-4 text-sm">
                        The dry season from February to September offers the best weather for temple visits and island exploration.
                      </p>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Luggage className="w-5 h-5 text-rose-600" />
                        What to Pack
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-2">
                        {(weatherInfo.packingTips || defaultWeatherInfo.packingTips || []).map((tip, idx) => (
                          <li key={`${tip}-${idx}`} className="flex items-start gap-2">
                            <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                            <span className="text-sm">{tip}</span>
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                </div>
              </motion.section>
            )}

            {/* Travel Tips Tab */}
            {selectedTab === 'tips' && (
              <motion.section
                key="tips"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
              >
                <div className="text-center mb-12">
                  <h2 className="text-4xl font-bold mb-4">Travel Tips for Jaffna</h2>
                  <p className="text-muted-foreground max-w-2xl mx-auto">
                    Essential information to make the most of your visit
                  </p>
                </div>
                <div className="grid md:grid-cols-2 gap-8">
                  {travelTips.map((tipSection, index) => {
                    const IconComponent = getIconComponent(tipSection.icon || 'Info');
                    const bulletPoints =
                      tipSection.tips && tipSection.tips.length
                        ? tipSection.tips
                        : tipSection.content
                          ? tipSection.content
                              .split('\n')
                              .map((item) => item.trim())
                              .filter(Boolean)
                          : [];
                    return (
                      <motion.div
                        key={`${tipSection.id || tipSection.title}-${index}`}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                      >
                        <Card className="h-full">
                          <CardHeader>
                            <CardTitle className="flex items-center gap-3">
                              <div className="p-2 bg-rose-100 rounded-lg">
                                <IconComponent className="w-6 h-6 text-rose-600" />
                              </div>
                              <div>
                                <span>{tipSection.title}</span>
                                {tipSection.category && (
                                  <div className="text-xs uppercase tracking-wide text-muted-foreground">
                                    {tipSection.category}
                                  </div>
                                )}
                              </div>
                            </CardTitle>
                          </CardHeader>
                          <CardContent>
                            <ul className="space-y-3">
                              {bulletPoints.map((tip, idx) => (
                                <li key={idx} className="flex items-start gap-2">
                                  <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                                  <span className="text-sm">{tip}</span>
                                </li>
                              ))}
                            </ul>
                          </CardContent>
                        </Card>
                      </motion.div>
                    );
                  })}
                </div>
              </motion.section>
            )}
          </AnimatePresence>
        </div>

        {signatureTours.length > 0 && (
          <section className="bg-slate-950 text-white py-20">
            <div className="container mx-auto px-4">
              <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-12">
                <div>
                  <p className="uppercase tracking-[0.2em] text-sm text-white/80 mb-2">Concierge itineraries</p>
                  <h2 className="text-4xl md:text-5xl font-bold text-white">Signature Jaffna Journeys</h2>
                  <p className="text-white max-w-2xl mt-2 leading-relaxed">
                    Limited-run expeditions curated by Recharge Travels with private charters, bilingual hosts,
                    and behind-the-scenes access across the northern peninsula.
                  </p>
                </div>
                <Button
                  variant="outline"
                  className="bg-white/10 border-white/50 text-white hover:bg-white hover:text-slate-900"
                  onClick={() => handleBooking('Bespoke Jaffna Journey')}
                >
                  <Sparkles className="w-4 h-4 mr-2" />
                  Build a Bespoke Tour
                </Button>
              </div>

              <div className="grid md:grid-cols-2 gap-8">
                {signatureTours.map((tour, index) => (
                  <motion.div
                    key={`${tour.id || tour.name}-${index}`}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    viewport={{ once: true }}
                  >
                    <Card className="h-full overflow-hidden rounded-3xl border-white/10 bg-white text-slate-900 shadow-2xl">
                      <div className="relative h-60">
                        <img
                          src={tour.image}
                          alt={tour.name}
                          className="absolute inset-0 h-full w-full object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-slate-900/10 to-transparent" />
                        <div className="relative z-10 flex items-center justify-between p-6 text-white">
                          {tour.badge && (
                            <Badge className="bg-rose-500 text-white shadow-lg">{tour.badge}</Badge>
                          )}
                          <div className="flex items-center gap-2 text-sm font-medium">
                            <Clock className="w-4 h-4" />
                            {tour.duration}
                          </div>
                        </div>
                      </div>
                      <CardContent className="p-6 flex flex-col h-full">
                        <div className="flex items-start justify-between gap-4 mb-4">
                          <div>
                            <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Concierge tour</p>
                            <h3 className="text-2xl font-semibold">{tour.name}</h3>
                          </div>
                          <div className="text-right">
                            <p className="text-xs uppercase tracking-wide text-slate-500">From</p>
                            <p className="text-2xl font-bold text-rose-600">{tour.priceFrom}</p>
                          </div>
                        </div>
                        <p className="text-sm text-slate-600 leading-relaxed mb-4">{tour.description}</p>
                        <div className="mb-4">
                          <p className="text-xs font-semibold text-slate-500 mb-2">Highlights</p>
                          <div className="flex flex-wrap gap-2">
                            {tour.highlights.slice(0, 4).map((highlight, idx) => (
                              <Badge
                                key={`${highlight}-${idx}`}
                                variant="secondary"
                                className="bg-rose-50 text-rose-700 border border-rose-100"
                              >
                                {highlight}
                              </Badge>
                            ))}
                          </div>
                        </div>
                        <div className="mb-6">
                          <p className="text-xs font-semibold text-slate-500 mb-2">Includes</p>
                          <ul className="grid grid-cols-1 gap-1 text-sm text-slate-600">
                            {tour.includes.slice(0, 4).map((item, idx) => (
                              <li key={`${item}-${idx}`} className="flex items-center gap-2">
                                <CheckCircle className="w-4 h-4 text-emerald-500" />
                                {item}
                              </li>
                            ))}
                            {tour.includes.length > 4 && (
                              <li className="text-xs text-slate-500">
                                +{tour.includes.length - 4} additional inclusions
                              </li>
                            )}
                          </ul>
                        </div>
                        {/* Book Button */}
                        <div className="mt-6 pt-4 border-t border-gray-100">
                          <div className="flex items-center justify-between gap-3">
                            {tour.isBestSeller && (
                              <Badge className="bg-emerald-600 text-white">Best Seller</Badge>
                            )}
                            <Button
                              size="lg"
                              className="flex-1 bg-rose-600 hover:bg-rose-700 text-white font-semibold py-3 text-base"
                              onClick={() => handleBooking(tour.name, {
                                id: tour.id || `tour-${index}`,
                                name: tour.name,
                                description: tour.description,
                                duration: tour.duration,
                                price: parseInt(tour.priceFrom.replace(/[^0-9]/g, '')) || 100,
                                features: tour.highlights || [],
                                image: tour.image
                              })}
                            >
                              Book & Pay Now
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* CTA Section */}
        <section className="bg-gradient-to-r from-rose-600 to-red-600 text-white py-16">
          <div className="container mx-auto px-4 text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <h2 className="text-3xl md:text-4xl font-bold mb-4">{ctaSection.title}</h2>
              <p className="text-xl mb-8 text-white/90 max-w-2xl mx-auto">{ctaSection.subtitle}</p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button
                  size="lg"
                  className="bg-white text-rose-600 hover:bg-gray-100"
                  onClick={() => handleBooking('Jaffna Complete Package')}
                >
                  <Phone className="w-5 h-5 mr-2" />
                  {ctaSection.buttonText}
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="bg-transparent text-white border-white hover:bg-white/20"
                  onClick={() => window.location.href = 'mailto:info@rechargetravels.com?subject=Jaffna Inquiry'}
                >
                  <Mail className="w-5 h-5 mr-2" />
                  Contact Us
                </Button>
              </div>
            </motion.div>
          </div>
        </section>
      </main>

      <Footer />

      {/* WhatsApp Float Button */}
      <a
        href="https://wa.me/94777721999?text=Hi! I'm interested in booking a Jaffna tour."
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-6 right-6 z-50 bg-green-500 hover:bg-green-600 text-white p-4 rounded-full shadow-lg transition-all hover:scale-110"
        aria-label="Contact via WhatsApp"
      >
        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
        </svg>
      </a>
    </>
  );
};

export default Jaffna;
