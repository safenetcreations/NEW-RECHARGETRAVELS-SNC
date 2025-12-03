import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { useNavigate } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Waves,
  MapPin,
  Calendar,
  Clock,
  Star,
  Wifi,
  Utensils,
  Camera,
  Hotel,
  Heart,
  Users,
  DollarSign,
  Info,
  Sun,
  Cloud,
  Navigation,
  Building,
  ShoppingBag,
  Anchor,
  Fish,
  Shell,
  TreePalm,
  Thermometer,
  Droplets,
  Lightbulb,
  Landmark,
  Ship,
  Sunrise,
  Binoculars,
  MessageCircle
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import DestinationMap from '@/components/destinations/DestinationMap';
import WeatherWidget from '@/components/destinations/WeatherWidget';
import { getDestinationBySlug } from '@/services/destinationContentService';

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

interface HotelInfo {
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

// Coordinates for Trincomalee
const TRINCOMALEE_CENTER = { lat: 8.5874, lng: 81.2152 };

// Icon mapping function
const getIconComponent = (iconName: string) => {
  const iconMap: { [key: string]: any } = {
    Waves, MapPin, Calendar, Clock, Star, Wifi, Utensils, Camera, Hotel, Heart,
    Users, DollarSign, Info, Sun, Cloud, Navigation, Building, ShoppingBag,
    Anchor, Fish, Shell, TreePalm, Thermometer, Droplets, Lightbulb, Landmark,
    Ship, Sunrise, Binoculars
  };
  return iconMap[iconName] || Waves;
};

// Default content for Trincomalee
const defaultHeroSlides: HeroSlide[] = [
  { image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80", title: "Discover Trincomalee", subtitle: "Sri Lanka's Eastern Paradise" },
  { image: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&q=80", title: "Nilaveli Beach", subtitle: "Pristine White Sand Shores" },
  { image: "https://images.unsplash.com/photo-1559827291-72ee739d0d9a?auto=format&fit=crop&q=80", title: "Koneswaram Temple", subtitle: "Sacred Hindu Shrine on the Cliff" },
  { image: "https://images.unsplash.com/photo-1583212292454-1fe6229603b7?auto=format&fit=crop&q=80", title: "Pigeon Island", subtitle: "Marine Sanctuary & Coral Reefs" },
  { image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&q=80", title: "Natural Harbor", subtitle: "One of the World's Finest" }
];

const defaultAttractions: Attraction[] = [
  {
    name: "Koneswaram Temple",
    description: "Ancient Hindu temple perched dramatically on Swami Rock cliff, offering stunning ocean views and rich mythology dating back 2000+ years.",
    image: "https://images.unsplash.com/photo-1552832230-c0197dd311b5?auto=format&fit=crop&q=80",
    category: "Sacred Sites",
    rating: 4.9,
    duration: "2-3 hours",
    price: "Free",
    icon: "Landmark"
  },
  {
    name: "Nilaveli Beach",
    description: "Pristine 4km white sand beach with crystal clear turquoise waters, perfect for swimming, sunbathing, and water sports.",
    image: "https://images.unsplash.com/photo-1510414842594-a61c69b5ae57?auto=format&fit=crop&q=80",
    category: "Beaches",
    rating: 4.8,
    duration: "Half Day",
    price: "Free",
    icon: "TreePalm"
  },
  {
    name: "Pigeon Island National Park",
    description: "Sri Lanka's premier snorkeling destination with vibrant coral reefs, blacktip reef sharks, sea turtles, and colorful tropical fish.",
    image: "https://images.unsplash.com/photo-1583212292454-1fe6229603b7?auto=format&fit=crop&q=80",
    category: "Marine Parks",
    rating: 4.9,
    duration: "3-4 hours",
    price: "$20",
    icon: "Fish"
  },
  {
    name: "Fort Frederick",
    description: "17th-century Dutch colonial fort with well-preserved ramparts, historic cannons, and panoramic views of the natural harbor.",
    image: "https://images.unsplash.com/photo-1580974852861-c381510bc98a?auto=format&fit=crop&q=80",
    category: "Historical",
    rating: 4.5,
    duration: "1-2 hours",
    price: "$2",
    icon: "Building"
  },
  {
    name: "Marble Beach",
    description: "Secluded beach within naval base premises featuring unique marble-like white sand, calm waters, and peaceful atmosphere.",
    image: "https://images.unsplash.com/photo-1527004760323-3c6b9c0c0c5f?auto=format&fit=crop&q=80",
    category: "Beaches",
    rating: 4.6,
    duration: "Half Day",
    price: "Free",
    icon: "Shell"
  },
  {
    name: "Kanniya Hot Springs",
    description: "Seven ancient hot water wells with varying temperatures, believed to have healing properties and mythological significance.",
    image: "https://images.unsplash.com/photo-1570168007204-dfb528c6958f?auto=format&fit=crop&q=80",
    category: "Natural Sites",
    rating: 4.3,
    duration: "1 hour",
    price: "$3",
    icon: "Droplets"
  }
];

const defaultActivities: Activity[] = [
  {
    name: "Whale & Dolphin Watching",
    description: "Witness blue whales, sperm whales, and playful dolphins in their natural habitat",
    icon: "Fish",
    price: "From $65",
    duration: "Half Day",
    difficulty: "Easy",
    popular: true
  },
  {
    name: "Scuba Diving at Pigeon Island",
    description: "Explore vibrant coral reefs and swim with sea turtles and reef sharks",
    icon: "Waves",
    price: "From $60",
    duration: "3-4 hours",
    difficulty: "Beginner-Advanced",
    popular: true
  },
  {
    name: "Snorkeling Adventure",
    description: "Discover underwater wonders with colorful fish and coral gardens",
    icon: "Binoculars",
    price: "From $35",
    duration: "2-3 hours",
    difficulty: "Easy"
  },
  {
    name: "Beach Hopping Tour",
    description: "Visit Nilaveli, Marble Beach, Uppuveli, and hidden coastal coves",
    icon: "TreePalm",
    price: "From $40",
    duration: "Full Day",
    difficulty: "Easy"
  },
  {
    name: "Sunset Sailing Cruise",
    description: "Romantic boat ride along the eastern coast with refreshments",
    icon: "Ship",
    price: "From $45",
    duration: "2 hours",
    difficulty: "Easy"
  },
  {
    name: "Traditional Fishing Experience",
    description: "Join local fishermen on stilt fishing or traditional boat fishing",
    icon: "Anchor",
    price: "From $50",
    duration: "4 hours",
    difficulty: "Moderate"
  }
];

const defaultRestaurants: Restaurant[] = [
  {
    name: "Fernando's Restaurant",
    cuisine: "Seafood & Sri Lankan",
    description: "Fresh catch of the day with stunning beachfront views at Nilaveli",
    priceRange: "$$",
    rating: 4.6
  },
  {
    name: "Crab Restaurant",
    cuisine: "Seafood",
    description: "Famous for fresh crab preparations and grilled lobster",
    priceRange: "$$$",
    rating: 4.7
  },
  {
    name: "Palm Beach Hotel Restaurant",
    cuisine: "International & Local",
    description: "Diverse menu with ocean views and live cooking stations",
    priceRange: "$$",
    rating: 4.4
  },
  {
    name: "Nilaveli Beach Hotel Restaurant",
    cuisine: "Sri Lankan & Continental",
    description: "Beachside dining with traditional rice and curry buffet",
    priceRange: "$$",
    rating: 4.5
  }
];

const defaultHotels: HotelInfo[] = [
  {
    name: "Jungle Beach by Uga Escapes",
    type: "Luxury Eco Resort",
    priceRange: "$350-600",
    rating: 4.9,
    amenities: ["Private Beach", "Spa", "Infinity Pool", "Fine Dining"]
  },
  {
    name: "Trinco Blu by Cinnamon",
    type: "Beach Resort",
    priceRange: "$150-280",
    rating: 4.6,
    amenities: ["Beachfront", "Pool", "Water Sports", "Kids Club"]
  },
  {
    name: "Anantamaa Hotel",
    type: "Boutique Hotel",
    priceRange: "$80-150",
    rating: 4.5,
    amenities: ["Garden View", "Restaurant", "Free WiFi", "Airport Transfer"]
  },
  {
    name: "Nilaveli Beach Hotel",
    type: "Mid-Range",
    priceRange: "$60-120",
    rating: 4.3,
    amenities: ["Direct Beach Access", "Pool", "Restaurant", "Dive Center"]
  }
];

const defaultTravelTips: TravelTip[] = [
  {
    title: "Best Time to Visit",
    description: "May to October offers calm seas, perfect for diving and whale watching. Avoid November-January monsoon season when seas are rough.",
    icon: "Calendar"
  },
  {
    title: "What to Pack",
    description: "Light cotton clothing, reef-safe sunscreen, snorkeling gear, and underwater camera. Modest dress for temple visits.",
    icon: "ShoppingBag"
  },
  {
    title: "Getting Around",
    description: "Tuk-tuks are affordable for short trips ($2-5). Rent a scooter for beach hopping or hire a car with driver for day trips.",
    icon: "Navigation"
  },
  {
    title: "Local Tips",
    description: "Book whale watching tours early morning for best sightings. Pigeon Island gets crowded by 10am - arrive early. Try fresh cuttlefish at local restaurants.",
    icon: "Lightbulb"
  }
];

const defaultDestinationInfo: DestinationInfo = {
  population: "108,420",
  area: "2,727 km²",
  elevation: "2 m",
  bestTime: "May to October",
  language: "Tamil, Sinhala, English",
  currency: "Sri Lankan Rupee (LKR)"
};

const defaultWeatherInfo: WeatherInfo = {
  temperature: "26-33°C",
  humidity: "75-85%",
  rainfall: "Low (May-Oct)",
  bestMonths: "May to October"
};

const defaultSEO: SEOSettings = {
  metaTitle: "Trincomalee - Eastern Coast Paradise | Recharge Travels",
  metaDescription: "Discover Trincomalee's pristine beaches, world-class diving at Pigeon Island, whale watching, and ancient temples. Plan your eastern coast adventure.",
  keywords: ["Trincomalee", "Nilaveli Beach", "Pigeon Island", "whale watching", "diving Sri Lanka", "Koneswaram Temple", "eastern coast", "beach holiday"]
};

const defaultCTA: CTASection = {
  title: "Ready to Explore Trincomalee?",
  subtitle: "Dive into crystal clear waters and discover the eastern coast's best kept secrets with our expert local guides",
  buttonText: "Plan Your Beach Escape"
};

const Trincomalee = () => {
  const navigate = useNavigate();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [activeTab, setActiveTab] = useState('attractions');
  const [selectedItem, setSelectedItem] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  // Content state
  const [heroSlides, setHeroSlides] = useState<HeroSlide[]>(defaultHeroSlides);
  const [attractions, setAttractions] = useState<Attraction[]>(defaultAttractions);
  const [activities, setActivities] = useState<Activity[]>(defaultActivities);
  const [restaurants, setRestaurants] = useState<Restaurant[]>(defaultRestaurants);
  const [hotels, setHotels] = useState<HotelInfo[]>(defaultHotels);
  const [travelTips, setTravelTips] = useState<TravelTip[]>(defaultTravelTips);
  const [destinationInfo, setDestinationInfo] = useState<DestinationInfo>(defaultDestinationInfo);
  const [weatherInfo, setWeatherInfo] = useState<WeatherInfo>(defaultWeatherInfo);
  const [seoSettings, setSeoSettings] = useState<SEOSettings>(defaultSEO);
  const [ctaSection, setCtaSection] = useState<CTASection>(defaultCTA);

  // Load content from Firebase
  useEffect(() => {
    const loadContent = async () => {
      try {
        const data = await getDestinationBySlug('trincomalee');
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
        console.error('Error loading Trincomalee content:', error);
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

  const handleBooking = (itemName: string) => {
    setSelectedItem(itemName);
    navigate('/book-tour', { state: { preSelectedService: itemName } });
  };

  // Dynamic tabs based on available content
  const tabs = [
    { id: 'attractions', label: 'Attractions', count: attractions.length },
    { id: 'activities', label: 'Activities', count: activities.length },
    { id: 'restaurants', label: 'Dining', count: restaurants.length },
    { id: 'hotels', label: 'Stay', count: hotels.length },
    { id: 'weather', label: 'Weather', count: null },
    { id: 'map', label: 'Map', count: null },
    { id: 'tips', label: 'Travel Tips', count: travelTips.length }
  ];

  // Map attractions for DestinationMap component
  const mapAttractions = [
    { name: 'Fort Frederick', lat: 8.5874, lng: 81.2152 },
    { name: 'Koneswaram Temple', lat: 8.5874, lng: 81.2350 },
    { name: 'Marble Beach', lat: 8.6000, lng: 81.2200 },
    { name: 'Uppuveli Beach', lat: 8.6250, lng: 81.2150 },
    { name: 'Nilaveli Beach', lat: 8.6800, lng: 81.2100 },
    { name: 'Pigeon Island', lat: 8.7050, lng: 81.2180 }
  ];

  return (
    <>
      <Helmet>
        <title>{seoSettings.metaTitle}</title>
        <meta name="description" content={seoSettings.metaDescription} />
        <meta name="keywords" content={seoSettings.keywords.join(', ')} />
        <meta property="og:title" content={seoSettings.metaTitle} />
        <meta property="og:description" content={seoSettings.metaDescription} />
        <link rel="canonical" href="https://rechargetravels.com/destinations/trincomalee" />
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
                <div className="absolute inset-0 bg-gradient-to-b from-cyan-900/40 via-black/30 to-black/60" />
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
                <Badge className="bg-cyan-600/80 text-white px-4 py-1 text-sm">
                  Eastern Coast Paradise
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
                  className="bg-cyan-600 hover:bg-cyan-700 text-white px-8 py-6 text-lg shadow-xl"
                  onClick={() => handleBooking('Trincomalee Tour')}
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
        <section className="bg-gradient-to-r from-cyan-600 to-teal-600 text-white py-4 shadow-lg">
          <div className="container mx-auto px-4">
            <div className="flex flex-wrap justify-center items-center gap-6 md:gap-10 text-sm">
              <div className="flex items-center gap-2">
                <Waves className="w-5 h-5" />
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
                      ? 'border-cyan-600 text-cyan-600'
                      : 'border-transparent text-gray-600 hover:text-cyan-600'
                  }`}
                >
                  {tab.label}
                  {tab.count !== null && (
                    <Badge variant="secondary" className="ml-2 bg-cyan-100 text-cyan-700">
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
                    Top Attractions
                  </h2>
                  <p className="text-gray-600 max-w-2xl mx-auto">
                    Discover Trincomalee's stunning beaches, ancient temples, and pristine marine parks
                  </p>
                </div>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {attractions.map((attraction, index) => {
                    const IconComponent = getIconComponent(attraction.icon || 'Waves');
                    return (
                      <Card key={index} className="group hover:shadow-2xl transition-all duration-300 overflow-hidden border-0 shadow-lg">
                        <div className="aspect-video overflow-hidden relative">
                          <img
                            src={attraction.image}
                            alt={attraction.name}
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                          />
                          <div className="absolute top-4 left-4">
                            <Badge className="bg-cyan-600 text-white">
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
                            <IconComponent className="w-5 h-5 text-cyan-600" />
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
                            <div className="flex items-center font-semibold text-cyan-600">
                              <DollarSign className="w-4 h-4 mr-1" />
                              {attraction.price}
                            </div>
                          </div>
                          <Button
                            className="w-full bg-cyan-600 hover:bg-cyan-700"
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
                    From whale watching to scuba diving, experience unforgettable adventures in Trincomalee
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
                              <div className="p-3 bg-cyan-100 rounded-xl">
                                <IconComponent className="w-6 h-6 text-cyan-600" />
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
                            <Badge variant="outline" className="text-cyan-600 border-cyan-200">
                              {activity.duration}
                            </Badge>
                            {activity.difficulty && (
                              <Badge variant="outline" className="text-gray-600">
                                {activity.difficulty}
                              </Badge>
                            )}
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-xl font-bold text-cyan-600">{activity.price}</span>
                            <Button
                              variant="outline"
                              className="border-cyan-600 text-cyan-600 hover:bg-cyan-600 hover:text-white"
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
                    Savor fresh seafood and authentic Sri Lankan cuisine at Trincomalee's best restaurants
                  </p>
                </div>
                <div className="grid md:grid-cols-2 gap-6">
                  {restaurants.map((restaurant, index) => (
                    <Card key={index} className="hover:shadow-xl transition-all duration-300 border-0 shadow-md">
                      <CardContent className="p-6">
                        <div className="flex items-start gap-4">
                          <div className="p-3 bg-cyan-100 rounded-xl">
                            <Utensils className="w-6 h-6 text-cyan-600" />
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
                              <span className="text-cyan-600 font-semibold">{restaurant.priceRange}</span>
                              <Button
                                variant="outline"
                                size="sm"
                                className="border-cyan-600 text-cyan-600 hover:bg-cyan-600 hover:text-white"
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
                    From luxury eco resorts to beachfront hotels, find your perfect accommodation
                  </p>
                </div>
                <div className="space-y-6">
                  {hotels.map((hotel, index) => (
                    <Card key={index} className="hover:shadow-xl transition-all duration-300 border-0 shadow-md overflow-hidden">
                      <CardContent className="p-6">
                        <div className="flex flex-col md:flex-row justify-between gap-6">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              <Hotel className="w-6 h-6 text-cyan-600" />
                              <h3 className="text-xl font-semibold">{hotel.name}</h3>
                              {hotel.rating && (
                                <div className="flex items-center bg-cyan-100 px-2 py-1 rounded-full">
                                  <Star className="w-4 h-4 text-yellow-500 mr-1" />
                                  <span className="text-sm font-medium">{hotel.rating}</span>
                                </div>
                              )}
                            </div>
                            <Badge variant="outline" className="mb-3">{hotel.type}</Badge>
                            <div className="flex flex-wrap gap-2">
                              {hotel.amenities.map((amenity, idx) => (
                                <Badge key={idx} variant="secondary" className="bg-cyan-50 text-cyan-700">
                                  {amenity}
                                </Badge>
                              ))}
                            </div>
                          </div>
                          <div className="text-right flex flex-col justify-between">
                            <div>
                              <p className="text-2xl font-bold text-cyan-600">{hotel.priceRange}</p>
                              <p className="text-sm text-gray-500">per night</p>
                            </div>
                            <Button
                              className="mt-4 bg-cyan-600 hover:bg-cyan-700"
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
                    Plan your visit with detailed weather information for Trincomalee's tropical coast
                  </p>
                </div>
                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                  <Card className="text-center p-6 border-0 shadow-lg bg-gradient-to-br from-orange-50 to-white">
                    <Thermometer className="w-12 h-12 text-orange-500 mx-auto mb-4" />
                    <h3 className="font-semibold text-gray-900 mb-2">Temperature</h3>
                    <p className="text-2xl font-bold text-orange-500">{weatherInfo.temperature}</p>
                    <p className="text-sm text-gray-500 mt-2">Warm year-round</p>
                  </Card>
                  <Card className="text-center p-6 border-0 shadow-lg bg-gradient-to-br from-blue-50 to-white">
                    <Droplets className="w-12 h-12 text-blue-600 mx-auto mb-4" />
                    <h3 className="font-semibold text-gray-900 mb-2">Humidity</h3>
                    <p className="text-2xl font-bold text-blue-600">{weatherInfo.humidity}</p>
                    <p className="text-sm text-gray-500 mt-2">Coastal humidity</p>
                  </Card>
                  <Card className="text-center p-6 border-0 shadow-lg bg-gradient-to-br from-cyan-50 to-white">
                    <Cloud className="w-12 h-12 text-cyan-600 mx-auto mb-4" />
                    <h3 className="font-semibold text-gray-900 mb-2">Rainfall</h3>
                    <p className="text-2xl font-bold text-cyan-600">{weatherInfo.rainfall}</p>
                    <p className="text-sm text-gray-500 mt-2">Nov-Jan monsoon</p>
                  </Card>
                  <Card className="text-center p-6 border-0 shadow-lg bg-gradient-to-br from-green-50 to-white">
                    <Sun className="w-12 h-12 text-green-500 mx-auto mb-4" />
                    <h3 className="font-semibold text-gray-900 mb-2">Best Months</h3>
                    <p className="text-2xl font-bold text-green-500">{weatherInfo.bestMonths}</p>
                    <p className="text-sm text-gray-500 mt-2">Calm seas for diving</p>
                  </Card>
                </div>

                <Card className="mt-8 border-0 shadow-lg">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Info className="w-5 h-5 text-cyan-600" />
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
                    Explore Trincomalee
                  </h2>
                  <p className="text-gray-600 max-w-2xl mx-auto">
                    Discover key attractions and plan your route around Trincomalee
                  </p>
                </div>

                <div className="grid lg:grid-cols-3 gap-6">
                  <div className="lg:col-span-2">
                    <DestinationMap
                      center={TRINCOMALEE_CENTER}
                      attractions={mapAttractions}
                      zoom={12}
                    />
                  </div>
                  <div>
                    <WeatherWidget city="Trincomalee" />
                  </div>
                </div>
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
                    Essential information to make the most of your Trincomalee beach holiday
                  </p>
                </div>
                <div className="grid md:grid-cols-2 gap-6">
                  {travelTips.map((tip, index) => {
                    const IconComponent = getIconComponent(tip.icon);
                    return (
                      <Card key={index} className="border-0 shadow-lg hover:shadow-xl transition-all duration-300">
                        <CardContent className="p-6">
                          <div className="flex items-start gap-4">
                            <div className="p-3 bg-cyan-100 rounded-xl shrink-0">
                              <IconComponent className="w-6 h-6 text-cyan-600" />
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
        <section className="bg-gradient-to-r from-cyan-600 via-teal-600 to-cyan-700 text-white py-16">
          <div className="container mx-auto px-4 text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-3xl md:text-4xl font-bold mb-4">{ctaSection.title}</h2>
              <p className="text-xl mb-8 max-w-2xl mx-auto opacity-90">{ctaSection.subtitle}</p>
              <div className="flex flex-wrap justify-center gap-4">
                <Button
                  size="lg"
                  className="bg-white text-cyan-700 hover:bg-gray-100 px-8 py-6 text-lg shadow-xl"
                  onClick={() => handleBooking('Trincomalee Complete Tour')}
                >
                  {ctaSection.buttonText}
                </Button>
                <Button
                  size="lg"
                  className="bg-green-500 hover:bg-green-600 text-white px-8 py-6 text-lg shadow-xl flex items-center gap-2"
                  onClick={() => window.open('https://wa.me/94777123456?text=Hi, I am interested in booking a Trincomalee tour', '_blank')}
                >
                  <MessageCircle className="w-5 h-5" />
                  WhatsApp Us
                </Button>
              </div>
            </motion.div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
};

export default Trincomalee;
