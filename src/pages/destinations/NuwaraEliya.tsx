import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Mountain,
  Flower2,
  Coffee,
  MapPin,
  Calendar,
  Clock,
  Star,
  Wifi,
  Home,
  Utensils,
  Camera,
  TreePine,
  Heart,
  Users,
  DollarSign,
  Info,
  Sun,
  Cloud,
  Navigation,
  Sunrise,
  Wind,
  Thermometer,
  Droplets,
  Lightbulb,
  ShoppingBag,
  Hotel,
  Landmark,
  Fish,
  Bike,
  Eye
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useNavigate } from 'react-router-dom';
import DestinationMap from '@/components/destinations/DestinationMap';
import WeatherWidget from '@/components/destinations/WeatherWidget';
import { getDestinationBySlug } from '@/services/destinationContentService';

// Nuwara Eliya coordinates
const NUWARA_ELIYA_CENTER = { lat: 6.9497, lng: 80.7891 };

// Type definitions
interface HeroSlide {
  image: string;
  title: string;
  subtitle: string;
}

interface Attraction {
  name: string;
  description: string;
  image: string;
  category: string;
  rating: number;
  duration: string;
  price: string;
  icon?: string;
}

interface Activity {
  name: string;
  description: string;
  icon: string;
  price: string;
  duration: string;
  difficulty?: string;
  popular?: boolean;
}

interface Restaurant {
  name: string;
  cuisine: string;
  description: string;
  priceRange: string;
  rating?: number;
  image?: string;
}

interface Hotel {
  name: string;
  type: string;
  priceRange: string;
  rating?: number;
  amenities: string[];
  image?: string;
}

interface DestinationInfo {
  population: string;
  area: string;
  elevation: string;
  bestTime: string;
  language?: string;
  currency?: string;
}

interface WeatherInfo {
  temperature: string;
  humidity: string;
  rainfall: string;
  bestMonths: string;
}

interface TravelTip {
  title: string;
  description: string;
  icon: string;
}

interface SEOSettings {
  metaTitle: string;
  metaDescription: string;
  keywords: string[];
}

interface CTASection {
  title: string;
  subtitle: string;
  buttonText: string;
}

// Icon mapping function
const getIconComponent = (iconName: string) => {
  const iconMap: { [key: string]: any } = {
    Mountain, Flower2, Coffee, MapPin, Calendar, Clock, Star, Wifi, Home,
    Utensils, Camera, TreePine, Heart, Users, DollarSign, Info, Sun, Cloud,
    Navigation, Sunrise, Wind, Thermometer, Droplets, Lightbulb, ShoppingBag,
    Hotel, Landmark, Fish, Bike, Eye
  };
  return iconMap[iconName] || MapPin;
};

// Default content for Nuwara Eliya
const defaultHeroSlides: HeroSlide[] = [
  {
    image: "https://images.unsplash.com/photo-1588598198321-39f8c2be97ba?auto=format&fit=crop&q=80",
    title: "Welcome to Nuwara Eliya",
    subtitle: "Little England in the Hills"
  },
  {
    image: "https://images.unsplash.com/photo-1571536802807-30451e3f3d43?auto=format&fit=crop&q=80",
    title: "Tea Country",
    subtitle: "Verdant Ceylon Tea Estates"
  },
  {
    image: "https://images.unsplash.com/photo-1580835845419-bb7c9c878f57?auto=format&fit=crop&q=80",
    title: "Gregory Lake",
    subtitle: "Scenic Lakeside Recreation"
  },
  {
    image: "https://images.unsplash.com/photo-1627894483216-2138af692e32?auto=format&fit=crop&q=80",
    title: "Victoria Park",
    subtitle: "Colonial Era Gardens"
  },
  {
    image: "https://images.unsplash.com/photo-1546587348-d12660c30c50?auto=format&fit=crop&q=80",
    title: "Horton Plains",
    subtitle: "World's End Trek"
  }
];

const defaultAttractions: Attraction[] = [
  {
    name: "Horton Plains National Park",
    description: "UNESCO World Heritage Site featuring World's End cliff, Baker's Falls, and unique cloud forest ecosystems with endemic flora and fauna.",
    image: "https://images.unsplash.com/photo-1605538032404-d7fbc1b839ec?auto=format&fit=crop&q=80",
    category: "Nature",
    rating: 4.9,
    duration: "4-5 hours",
    price: "$25",
    icon: "Mountain"
  },
  {
    name: "Gregory Lake",
    description: "Scenic man-made lake in the heart of Nuwara Eliya, perfect for boating, horse riding, and lakeside picnics with stunning mountain backdrops.",
    image: "https://images.unsplash.com/photo-1596402184320-417e7178b2cd?auto=format&fit=crop&q=80",
    category: "Recreation",
    rating: 4.5,
    duration: "2-3 hours",
    price: "From $5",
    icon: "Fish"
  },
  {
    name: "Pedro Tea Estate",
    description: "One of the oldest and most famous tea estates in Sri Lanka, offering guided tours through the factory and tasting sessions of premium Ceylon tea.",
    image: "https://images.unsplash.com/photo-1564501049412-61c2a3083791?auto=format&fit=crop&q=80",
    category: "Cultural",
    rating: 4.7,
    duration: "2 hours",
    price: "$8",
    icon: "Coffee"
  },
  {
    name: "Hakgala Botanical Gardens",
    description: "Second largest botanical garden in Sri Lanka, featuring exotic plants, roses, orchids, and the enchanted Seetha Amman Temple nearby.",
    image: "https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?auto=format&fit=crop&q=80",
    category: "Nature",
    rating: 4.6,
    duration: "2-3 hours",
    price: "$10",
    icon: "Flower2"
  },
  {
    name: "Victoria Park",
    description: "Beautiful urban park with well-maintained gardens, children's play areas, and excellent bird-watching opportunities in the heart of the city.",
    image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?auto=format&fit=crop&q=80",
    category: "Parks",
    rating: 4.4,
    duration: "1-2 hours",
    price: "$3",
    icon: "TreePine"
  },
  {
    name: "Lover's Leap Waterfall",
    description: "Romantic waterfall surrounded by tea estates, named after a legendary love story. Perfect for photography and peaceful nature walks.",
    image: "https://images.unsplash.com/photo-1432405972618-c60b0225b8f9?auto=format&fit=crop&q=80",
    category: "Nature",
    rating: 4.3,
    duration: "1-2 hours",
    price: "Free",
    icon: "Droplets"
  }
];

const defaultActivities: Activity[] = [
  {
    name: "World's End Trek",
    description: "Early morning hike to the famous 880m cliff drop with panoramic views",
    icon: "Mountain",
    price: "From $30",
    duration: "5-6 hours",
    difficulty: "Moderate",
    popular: true
  },
  {
    name: "Tea Plantation Walk",
    description: "Guided walk through lush tea gardens learning about Ceylon tea production",
    icon: "Coffee",
    price: "From $15",
    duration: "2-3 hours",
    difficulty: "Easy",
    popular: true
  },
  {
    name: "Golf at Nuwara Eliya",
    description: "Play at one of Asia's finest and oldest golf courses",
    icon: "Landmark",
    price: "From $80",
    duration: "4 hours",
    difficulty: "Various"
  },
  {
    name: "Boat Ride on Gregory Lake",
    description: "Paddle boats, swan boats, and motor boats available",
    icon: "Fish",
    price: "From $10",
    duration: "1 hour",
    difficulty: "Easy"
  },
  {
    name: "Strawberry Farm Visit",
    description: "Pick fresh strawberries and enjoy farm-fresh treats",
    icon: "Flower2",
    price: "From $5",
    duration: "1-2 hours",
    difficulty: "Easy"
  },
  {
    name: "Cycling Through Tea Country",
    description: "Mountain biking through scenic tea plantation trails",
    icon: "Bike",
    price: "From $25",
    duration: "3-4 hours",
    difficulty: "Moderate"
  }
];

const defaultRestaurants: Restaurant[] = [
  {
    name: "Grand Indian",
    cuisine: "Indian & North Indian",
    description: "Authentic Indian cuisine with panoramic hill views",
    priceRange: "$$$",
    rating: 4.6
  },
  {
    name: "Milano Restaurant",
    cuisine: "Italian & Continental",
    description: "Wood-fired pizzas and pasta in a cozy colonial setting",
    priceRange: "$$",
    rating: 4.5
  },
  {
    name: "Grand Hotel Restaurant",
    cuisine: "British Colonial",
    description: "Classic high tea and English breakfast in heritage setting",
    priceRange: "$$$",
    rating: 4.7
  },
  {
    name: "Salmiya Restaurant",
    cuisine: "Sri Lankan",
    description: "Traditional rice and curry with local hill country specialties",
    priceRange: "$",
    rating: 4.3
  }
];

const defaultHotels: Hotel[] = [
  {
    name: "Heritance Tea Factory",
    type: "Luxury Heritage Hotel",
    priceRange: "$250-450",
    rating: 4.9,
    amenities: ["Spa", "Fine Dining", "Tea Factory Tour", "Mountain Views"]
  },
  {
    name: "Grand Hotel",
    type: "Colonial Heritage",
    priceRange: "$150-300",
    rating: 4.7,
    amenities: ["Historic Architecture", "High Tea", "Gardens", "Golf Access"]
  },
  {
    name: "Jetwing St. Andrew's",
    type: "Boutique Hotel",
    priceRange: "$120-220",
    rating: 4.6,
    amenities: ["Colonial Charm", "Restaurant", "Bar", "Garden"]
  },
  {
    name: "The Blackpool",
    type: "Budget Friendly",
    priceRange: "$40-80",
    rating: 4.2,
    amenities: ["City Center", "Restaurant", "Room Service", "WiFi"]
  }
];

const defaultTravelTips: TravelTip[] = [
  {
    title: "Best Time to Visit",
    description: "March to May for clear skies; avoid April for crowds during Sinhala New Year. Horton Plains best visited early morning (6 AM) before mist.",
    icon: "Calendar"
  },
  {
    title: "What to Pack",
    description: "Warm layers essential - temperatures drop to 10°C at night. Bring rain gear, comfortable walking shoes, and sun protection.",
    icon: "ShoppingBag"
  },
  {
    title: "Getting Around",
    description: "Tuk-tuks are affordable for short trips. Hire a car for Horton Plains (35km). Train from Kandy offers spectacular scenery.",
    icon: "Navigation"
  },
  {
    title: "Local Tips",
    description: "Try fresh strawberries and cream at local farms. Book Horton Plains entrance online to avoid queues. Golf course offers day passes.",
    icon: "Lightbulb"
  }
];

const defaultDestinationInfo: DestinationInfo = {
  population: "27,500",
  area: "12.4 km²",
  elevation: "1,868 m",
  bestTime: "March to May",
  language: "Sinhala, Tamil, English",
  currency: "Sri Lankan Rupee (LKR)"
};

const defaultWeatherInfo: WeatherInfo = {
  temperature: "10-20°C",
  humidity: "70-85%",
  rainfall: "Moderate (Oct-Jan)",
  bestMonths: "March to May"
};

const defaultSEO: SEOSettings = {
  metaTitle: "Nuwara Eliya - Little England Hill Station | Recharge Travels",
  metaDescription: "Discover Nuwara Eliya, Sri Lanka's Little England with tea plantations, Horton Plains, Gregory Lake, and colonial charm. Plan your hill country escape.",
  keywords: ["Nuwara Eliya", "Little England", "tea plantations", "Horton Plains", "World's End", "Gregory Lake", "hill country", "Ceylon tea"]
};

const defaultCTA: CTASection = {
  title: "Experience the Magic of Little England",
  subtitle: "Let us craft your perfect hill country retreat with tea estate stays, nature walks, and colonial heritage experiences",
  buttonText: "Plan Your Hill Country Escape"
};

const NuwaraEliya = () => {
  const navigate = useNavigate();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [activeTab, setActiveTab] = useState('attractions');
  const [isLoading, setIsLoading] = useState(true);

  // Content state
  const [heroSlides, setHeroSlides] = useState<HeroSlide[]>(defaultHeroSlides);
  const [attractions, setAttractions] = useState<Attraction[]>(defaultAttractions);
  const [activities, setActivities] = useState<Activity[]>(defaultActivities);
  const [restaurants, setRestaurants] = useState<Restaurant[]>(defaultRestaurants);
  const [hotels, setHotels] = useState<Hotel[]>(defaultHotels);
  const [travelTips, setTravelTips] = useState<TravelTip[]>(defaultTravelTips);
  const [destinationInfo, setDestinationInfo] = useState<DestinationInfo>(defaultDestinationInfo);
  const [weatherInfo, setWeatherInfo] = useState<WeatherInfo>(defaultWeatherInfo);
  const [seoSettings, setSeoSettings] = useState<SEOSettings>(defaultSEO);
  const [ctaSection, setCtaSection] = useState<CTASection>(defaultCTA);

  // Load content from Firebase
  useEffect(() => {
    const loadContent = async () => {
      try {
        const data = await getDestinationBySlug('nuwaraeliya');
        if (data) {
          if (data.heroSlides?.length) setHeroSlides(data.heroSlides);
          if (data.attractions?.length) setAttractions(data.attractions);
          if (data.activities?.length) setActivities(data.activities);
          if (data.restaurants?.length) setRestaurants(data.restaurants);
          if (data.hotels?.length) setHotels(data.hotels);
          if (data.travelTips?.length) setTravelTips(data.travelTips);
          if (data.destinationInfo) setDestinationInfo(data.destinationInfo);
          if (data.weatherInfo) setWeatherInfo(data.weatherInfo);
          if (data.seoSettings) setSeoSettings(data.seoSettings);
          if (data.ctaSection) setCtaSection(data.ctaSection);
        }
      } catch (error) {
        console.error('Error loading Nuwara Eliya content:', error);
      } finally {
        setIsLoading(false);
      }
    };
    loadContent();
  }, []);

  // Hero slideshow timer
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [heroSlides.length]);

  const handleBooking = (service: string = 'Nuwara Eliya Tour') => {
    const params = new URLSearchParams({
      title: service,
      id: service.toLowerCase().replace(/\s+/g, '-'),
      duration: 'Full Day',
      price: '60',
      image: 'https://images.unsplash.com/photo-1590523277543-a94d2e4eb00b?w=800',
      subtitle: `Nuwara Eliya - ${service}`
    });
    navigate(`/book-tour?${params.toString()}`);
  };

  // Dynamic tabs based on available content
  const tabs = [
    { id: 'attractions', label: 'Attractions', count: attractions.length },
    { id: 'activities', label: 'Activities', count: activities.length },
    { id: 'restaurants', label: 'Dining', count: restaurants.length },
    { id: 'hotels', label: 'Stay', count: hotels.length },
    { id: 'map', label: 'Map', count: null },
    { id: 'weather', label: 'Weather', count: null },
    { id: 'tips', label: 'Travel Tips', count: travelTips.length }
  ];

  return (
    <>
      <Helmet>
        <title>{seoSettings.metaTitle}</title>
        <meta name="description" content={seoSettings.metaDescription} />
        <meta name="keywords" content={seoSettings.keywords.join(', ')} />
        <meta property="og:title" content={seoSettings.metaTitle} />
        <meta property="og:description" content={seoSettings.metaDescription} />
        <link rel="canonical" href="https://rechargetravels.com/destinations/nuwaraeliya" />
      </Helmet>

      <Header />

      <main className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
        {/* Hero Section with Slideshow */}
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
                className="h-full w-full bg-cover bg-center"
                style={{ backgroundImage: `url(${heroSlides[currentSlide]?.image})` }}
              >
                <div className="absolute inset-0 bg-gradient-to-b from-purple-900/40 via-black/30 to-black/60" />
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Hero Content */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center text-white px-4 max-w-5xl">
              <motion.div
                initial={{ y: 30, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="mb-4"
              >
                <Badge className="bg-purple-600/80 text-white px-4 py-1 text-sm">
                  Sri Lanka's Little England
                </Badge>
              </motion.div>
              <motion.h1
                initial={{ y: 30, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="text-5xl md:text-7xl font-bold mb-6 drop-shadow-lg"
              >
                {heroSlides[currentSlide]?.title}
              </motion.h1>
              <motion.p
                initial={{ y: 30, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="text-xl md:text-2xl mb-8 drop-shadow-md"
              >
                {heroSlides[currentSlide]?.subtitle}
              </motion.p>
              <motion.div
                initial={{ y: 30, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.6 }}
                className="flex flex-wrap justify-center gap-4"
              >
                <Button
                  size="lg"
                  className="bg-purple-600 hover:bg-purple-700 text-white px-8 py-6 text-lg shadow-xl"
                  onClick={() => handleBooking('Nuwara Eliya Tour')}
                >
                  Plan Your Visit
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="border-white text-white hover:bg-white/20 px-8 py-6 text-lg"
                  onClick={() => setActiveTab('attractions')}
                >
                  Explore Attractions
                </Button>
              </motion.div>
            </div>
          </div>

          {/* Slide Indicators */}
          <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex space-x-3">
            {heroSlides.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentSlide(index)}
                className={`h-2 rounded-full transition-all duration-300 ${
                  currentSlide === index ? 'bg-white w-8' : 'bg-white/50 w-2'
                }`}
              />
            ))}
          </div>
        </section>

        {/* Quick Info Bar */}
        <section className="bg-gradient-to-r from-purple-700 to-violet-600 text-white py-4 shadow-lg">
          <div className="container mx-auto px-4">
            <div className="flex flex-wrap justify-center items-center gap-6 md:gap-10 text-sm">
              <div className="flex items-center gap-2">
                <Mountain className="w-5 h-5" />
                <span>Elevation: {destinationInfo.elevation}</span>
              </div>
              <div className="flex items-center gap-2">
                <Thermometer className="w-5 h-5" />
                <span>Temperature: {weatherInfo.temperature}</span>
              </div>
              <div className="flex items-center gap-2">
                <Users className="w-5 h-5" />
                <span>Population: {destinationInfo.population}</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="w-5 h-5" />
                <span>Best Time: {destinationInfo.bestTime}</span>
              </div>
            </div>
          </div>
        </section>

        {/* Tab Navigation */}
        <nav className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b shadow-sm">
          <div className="container mx-auto px-4">
            <div className="flex overflow-x-auto scrollbar-hide py-1">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-6 py-4 font-medium transition-all whitespace-nowrap border-b-2 ${
                    activeTab === tab.id
                      ? 'border-purple-600 text-purple-600'
                      : 'border-transparent text-gray-600 hover:text-purple-600'
                  }`}
                >
                  {tab.label}
                  {tab.count !== null && (
                    <Badge variant="secondary" className="ml-2 bg-purple-100 text-purple-700">
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
            {activeTab === 'attractions' && (
              <motion.div
                key="attractions"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                <div className="text-center mb-10">
                  <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                    Must-Visit Attractions
                  </h2>
                  <p className="text-gray-600 max-w-2xl mx-auto">
                    Explore the enchanting sights of Nuwara Eliya, from misty mountains to colonial gardens
                  </p>
                </div>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {attractions.map((attraction, index) => {
                    const IconComponent = getIconComponent(attraction.icon || 'MapPin');
                    return (
                      <Card key={index} className="group hover:shadow-2xl transition-all duration-300 overflow-hidden border-0 shadow-lg">
                        <div className="aspect-video overflow-hidden relative">
                          <img
                            src={attraction.image}
                            alt={attraction.name}
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                          />
                          <div className="absolute top-4 left-4">
                            <Badge className="bg-purple-600 text-white">
                              {attraction.category}
                            </Badge>
                          </div>
                          <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm rounded-full px-3 py-1 flex items-center">
                            <Star className="w-4 h-4 text-yellow-500 mr-1" />
                            <span className="font-semibold text-sm">{attraction.rating}</span>
                          </div>
                        </div>
                        <CardHeader className="pb-2">
                          <CardTitle className="text-xl flex items-center gap-2">
                            <IconComponent className="w-5 h-5 text-purple-600" />
                            {attraction.name}
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <p className="text-gray-600 mb-4 line-clamp-2">{attraction.description}</p>
                          <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                            <div className="flex items-center">
                              <Clock className="w-4 h-4 mr-1" />
                              {attraction.duration}
                            </div>
                            <div className="flex items-center font-semibold text-purple-600">
                              <DollarSign className="w-4 h-4 mr-1" />
                              {attraction.price}
                            </div>
                          </div>
                          <Button
                            className="w-full bg-purple-600 hover:bg-purple-700"
                            onClick={() => handleBooking(attraction.name)}
                          >
                            Book Visit
                          </Button>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              </motion.div>
            )}

            {/* Activities Tab */}
            {activeTab === 'activities' && (
              <motion.div
                key="activities"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                <div className="text-center mb-10">
                  <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                    Things to Do
                  </h2>
                  <p className="text-gray-600 max-w-2xl mx-auto">
                    From scenic hikes to tea tastings, discover unforgettable experiences in Nuwara Eliya
                  </p>
                </div>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {activities.map((activity, index) => {
                    const IconComponent = getIconComponent(activity.icon);
                    return (
                      <Card key={index} className="hover:shadow-xl transition-all duration-300 border-0 shadow-md">
                        <CardHeader>
                          <div className="flex items-start justify-between">
                            <div className="flex items-center gap-3">
                              <div className="p-3 bg-purple-100 rounded-xl">
                                <IconComponent className="w-6 h-6 text-purple-600" />
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
                          <p className="text-gray-600 mb-4">{activity.description}</p>
                          <div className="flex flex-wrap gap-2 mb-4">
                            <Badge variant="outline" className="text-purple-600 border-purple-200">
                              {activity.duration}
                            </Badge>
                            {activity.difficulty && (
                              <Badge variant="outline" className="text-gray-600">
                                {activity.difficulty}
                              </Badge>
                            )}
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-xl font-bold text-purple-600">{activity.price}</span>
                            <Button
                              variant="outline"
                              className="border-purple-600 text-purple-600 hover:bg-purple-600 hover:text-white"
                              onClick={() => handleBooking(activity.name)}
                            >
                              Book Now
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              </motion.div>
            )}

            {/* Restaurants Tab */}
            {activeTab === 'restaurants' && (
              <motion.div
                key="restaurants"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                <div className="text-center mb-10">
                  <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                    Where to Dine
                  </h2>
                  <p className="text-gray-600 max-w-2xl mx-auto">
                    From colonial high tea to authentic Sri Lankan cuisine, savor the flavors of Nuwara Eliya
                  </p>
                </div>
                <div className="grid md:grid-cols-2 gap-6">
                  {restaurants.map((restaurant, index) => (
                    <Card key={index} className="hover:shadow-xl transition-all duration-300 border-0 shadow-md">
                      <CardContent className="p-6">
                        <div className="flex items-start gap-4">
                          <div className="p-3 bg-purple-100 rounded-xl">
                            <Utensils className="w-6 h-6 text-purple-600" />
                          </div>
                          <div className="flex-1">
                            <div className="flex justify-between items-start mb-2">
                              <h3 className="text-xl font-semibold">{restaurant.name}</h3>
                              {restaurant.rating && (
                                <div className="flex items-center">
                                  <Star className="w-4 h-4 text-yellow-500 mr-1" />
                                  <span className="font-medium">{restaurant.rating}</span>
                                </div>
                              )}
                            </div>
                            <Badge variant="outline" className="mb-2">{restaurant.cuisine}</Badge>
                            <p className="text-gray-600 mb-3">{restaurant.description}</p>
                            <div className="flex justify-between items-center">
                              <span className="text-purple-600 font-semibold">{restaurant.priceRange}</span>
                              <Button
                                variant="outline"
                                size="sm"
                                className="border-purple-600 text-purple-600 hover:bg-purple-600 hover:text-white"
                                onClick={() => handleBooking(`Dinner at ${restaurant.name}`)}
                              >
                                Reserve Table
                              </Button>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Hotels Tab */}
            {activeTab === 'hotels' && (
              <motion.div
                key="hotels"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                <div className="text-center mb-10">
                  <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                    Where to Stay
                  </h2>
                  <p className="text-gray-600 max-w-2xl mx-auto">
                    From colonial heritage hotels to cozy tea estate bungalows, find your perfect retreat
                  </p>
                </div>
                <div className="space-y-6">
                  {hotels.map((hotel, index) => (
                    <Card key={index} className="hover:shadow-xl transition-all duration-300 border-0 shadow-md overflow-hidden">
                      <CardContent className="p-6">
                        <div className="flex flex-col md:flex-row justify-between gap-6">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              <Hotel className="w-6 h-6 text-purple-600" />
                              <h3 className="text-xl font-semibold">{hotel.name}</h3>
                              {hotel.rating && (
                                <div className="flex items-center bg-purple-100 px-2 py-1 rounded-full">
                                  <Star className="w-4 h-4 text-yellow-500 mr-1" />
                                  <span className="text-sm font-medium">{hotel.rating}</span>
                                </div>
                              )}
                            </div>
                            <Badge variant="outline" className="mb-3">{hotel.type}</Badge>
                            <div className="flex flex-wrap gap-2">
                              {hotel.amenities.map((amenity, idx) => (
                                <Badge key={idx} variant="secondary" className="bg-purple-50 text-purple-700">
                                  {amenity}
                                </Badge>
                              ))}
                            </div>
                          </div>
                          <div className="text-right flex flex-col justify-between">
                            <div>
                              <p className="text-2xl font-bold text-purple-600">{hotel.priceRange}</p>
                              <p className="text-sm text-gray-500">per night</p>
                            </div>
                            <Button
                              className="mt-4 bg-purple-600 hover:bg-purple-700"
                              onClick={() => handleBooking(hotel.name)}
                            >
                              Check Availability
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Map Tab */}
            {activeTab === 'map' && (
              <motion.div
                key="map"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                <div className="text-center mb-10">
                  <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                    Explore Nuwara Eliya
                  </h2>
                  <p className="text-gray-600 max-w-2xl mx-auto">
                    Navigate through the scenic hill country and discover key attractions
                  </p>
                </div>
                <div className="grid lg:grid-cols-3 gap-6">
                  <div className="lg:col-span-2">
                    <DestinationMap
                      center={NUWARA_ELIYA_CENTER}
                      destinationName="Nuwara Eliya"
                      attractions={[
                        { name: 'Gregory Lake', lat: 6.9475, lng: 80.7766 },
                        { name: 'Victoria Park', lat: 6.9497, lng: 80.7628 },
                        { name: 'Hakgala Botanical Garden', lat: 6.8975, lng: 80.8147 },
                        { name: 'Pedro Tea Estate', lat: 6.9622, lng: 80.7794 },
                        { name: 'Horton Plains', lat: 6.8103, lng: 80.7944 },
                        { name: 'Single Tree Hill', lat: 6.9550, lng: 80.7575 }
                      ]}
                    />
                  </div>
                  <div>
                    <WeatherWidget
                      lat={NUWARA_ELIYA_CENTER.lat}
                      lng={NUWARA_ELIYA_CENTER.lng}
                      locationName="Nuwara Eliya"
                    />
                  </div>
                </div>
              </motion.div>
            )}

            {/* Weather Tab */}
            {activeTab === 'weather' && (
              <motion.div
                key="weather"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                <div className="text-center mb-10">
                  <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                    Weather & Climate
                  </h2>
                  <p className="text-gray-600 max-w-2xl mx-auto">
                    Plan your visit with detailed weather information for Sri Lanka's coolest city
                  </p>
                </div>
                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                  <Card className="text-center p-6 border-0 shadow-lg bg-gradient-to-br from-purple-50 to-white">
                    <Thermometer className="w-12 h-12 text-purple-600 mx-auto mb-4" />
                    <h3 className="font-semibold text-gray-900 mb-2">Temperature</h3>
                    <p className="text-2xl font-bold text-purple-600">{weatherInfo.temperature}</p>
                    <p className="text-sm text-gray-500 mt-2">Year-round average</p>
                  </Card>
                  <Card className="text-center p-6 border-0 shadow-lg bg-gradient-to-br from-blue-50 to-white">
                    <Droplets className="w-12 h-12 text-blue-600 mx-auto mb-4" />
                    <h3 className="font-semibold text-gray-900 mb-2">Humidity</h3>
                    <p className="text-2xl font-bold text-blue-600">{weatherInfo.humidity}</p>
                    <p className="text-sm text-gray-500 mt-2">Average humidity</p>
                  </Card>
                  <Card className="text-center p-6 border-0 shadow-lg bg-gradient-to-br from-teal-50 to-white">
                    <Cloud className="w-12 h-12 text-teal-600 mx-auto mb-4" />
                    <h3 className="font-semibold text-gray-900 mb-2">Rainfall</h3>
                    <p className="text-2xl font-bold text-teal-600">{weatherInfo.rainfall}</p>
                    <p className="text-sm text-gray-500 mt-2">Monsoon season</p>
                  </Card>
                  <Card className="text-center p-6 border-0 shadow-lg bg-gradient-to-br from-orange-50 to-white">
                    <Sun className="w-12 h-12 text-orange-500 mx-auto mb-4" />
                    <h3 className="font-semibold text-gray-900 mb-2">Best Months</h3>
                    <p className="text-2xl font-bold text-orange-500">{weatherInfo.bestMonths}</p>
                    <p className="text-sm text-gray-500 mt-2">Ideal for visits</p>
                  </Card>
                </div>

                <Card className="mt-8 border-0 shadow-lg">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Info className="w-5 h-5 text-purple-600" />
                      Destination Information
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid md:grid-cols-3 gap-6">
                      <div>
                        <p className="text-sm text-gray-500">Elevation</p>
                        <p className="font-semibold text-lg">{destinationInfo.elevation}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Area</p>
                        <p className="font-semibold text-lg">{destinationInfo.area}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Population</p>
                        <p className="font-semibold text-lg">{destinationInfo.population}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Best Time to Visit</p>
                        <p className="font-semibold text-lg">{destinationInfo.bestTime}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Languages</p>
                        <p className="font-semibold text-lg">{destinationInfo.language}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Currency</p>
                        <p className="font-semibold text-lg">{destinationInfo.currency}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )}

            {/* Travel Tips Tab */}
            {activeTab === 'tips' && (
              <motion.div
                key="tips"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                <div className="text-center mb-10">
                  <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                    Travel Tips & Advice
                  </h2>
                  <p className="text-gray-600 max-w-2xl mx-auto">
                    Essential information to make the most of your Nuwara Eliya adventure
                  </p>
                </div>
                <div className="grid md:grid-cols-2 gap-6">
                  {travelTips.map((tip, index) => {
                    const IconComponent = getIconComponent(tip.icon);
                    return (
                      <Card key={index} className="border-0 shadow-lg hover:shadow-xl transition-all duration-300">
                        <CardContent className="p-6">
                          <div className="flex items-start gap-4">
                            <div className="p-3 bg-purple-100 rounded-xl shrink-0">
                              <IconComponent className="w-6 h-6 text-purple-600" />
                            </div>
                            <div>
                              <h3 className="text-lg font-semibold mb-2">{tip.title}</h3>
                              <p className="text-gray-600">{tip.description}</p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* CTA Section */}
        <section className="bg-gradient-to-r from-purple-700 via-violet-600 to-purple-800 text-white py-16">
          <div className="container mx-auto px-4 text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-3xl md:text-4xl font-bold mb-4">{ctaSection.title}</h2>
              <p className="text-xl mb-8 max-w-2xl mx-auto opacity-90">{ctaSection.subtitle}</p>
              <Button
                size="lg"
                className="bg-white text-purple-700 hover:bg-gray-100 px-8 py-6 text-lg shadow-xl"
                onClick={() => handleBooking('Nuwara Eliya Complete Tour')}
              >
                {ctaSection.buttonText}
              </Button>
            </motion.div>
          </div>
        </section>
      </main>

      <Footer />

      {/* WhatsApp Float Button */}
      <a
        href="https://wa.me/94777721999?text=Hi! I'm interested in booking a Nuwara Eliya tour."
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-6 right-6 z-50 bg-green-500 hover:bg-green-600 text-white p-4 rounded-full shadow-lg transition-all hover:scale-110"
        aria-label="Contact via WhatsApp"
      >
        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
        </svg>
      </a>
    </>
  );
};

export default NuwaraEliya;
