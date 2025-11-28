import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { motion, AnimatePresence } from 'framer-motion';
import {
  MapPin,
  Calendar,
  Clock,
  Star,
  Wifi,
  Utensils,
  Camera,
  Hotel,
  Users,
  DollarSign,
  Info,
  Sun,
  Cloud,
  Thermometer,
  Droplets,
  Wind,
  Umbrella,
  Navigation,
  Mountain,
  Waves,
  Ship,
  Plane,
  Compass,
  Anchor,
  TreePine,
  Bird,
  Binoculars,
  Sunrise,
  Fish,
  Globe,
  Luggage,
  CreditCard,
  Phone,
  Shield,
  Heart,
  Coffee,
  Award,
  Sparkles,
  ChevronRight,
  ChevronLeft,
  Building2,
  Landmark,
  Palmtree,
  ShoppingBag
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import EnhancedBookingModal from '@/components/EnhancedBookingModal';
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
  priceRange: string;
  rating: number;
  image: string;
  specialty: string;
  location: string;
}

interface HotelInfo {
  name: string;
  category: string;
  priceRange: string;
  rating: number;
  image: string;
  amenities: string[];
  location: string;
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
  temperature: string;
  humidity: string;
  rainfall: string;
  bestMonths: string;
  climate: string;
  waterTemp?: string;
}

interface TravelTip {
  icon: string;
  title: string;
  description: string;
}

interface SEOSettings {
  title: string;
  description: string;
  keywords: string[];
}

interface CTASection {
  title: string;
  subtitle: string;
  primaryButton: string;
  secondaryButton: string;
}

// Default content
const defaultHeroSlides: HeroSlide[] = [
  {
    image: "https://images.unsplash.com/photo-1568430462989-44163eb1752f?auto=format&fit=crop&q=80",
    title: "Discover Hambantota",
    subtitle: "Where Modern Development Meets Natural Beauty"
  },
  {
    image: "https://images.unsplash.com/photo-1564760055775-d63b17a55c44?auto=format&fit=crop&q=80",
    title: "Gateway to Wildlife",
    subtitle: "Your Safari Adventure Starts Here"
  },
  {
    image: "https://images.unsplash.com/photo-1590523741831-ab7e8b8f9c7f?auto=format&fit=crop&q=80",
    title: "Sri Lanka's Deep South",
    subtitle: "Pristine Beaches & Emerging Port City"
  }
];

const defaultAttractions: Attraction[] = [
  {
    name: "Bundala National Park",
    description: "UNESCO biosphere reserve famous for migratory birds, especially flamingos, and home to elephants, crocodiles, and sea turtles. A paradise for birdwatchers.",
    image: "https://images.unsplash.com/photo-1564760055775-d63b17a55c44?auto=format&fit=crop&q=80",
    category: "Wildlife & Safari",
    rating: 4.8,
    duration: "Half Day",
    price: "$35",
    icon: "Bird"
  },
  {
    name: "Hambantota Port",
    description: "One of Asia's most modern deep-water ports, showcasing Sri Lanka's maritime infrastructure development. Guided tours available for visitors.",
    image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?auto=format&fit=crop&q=80",
    category: "Modern Infrastructure",
    rating: 4.5,
    duration: "2 hours",
    price: "$15",
    icon: "Ship"
  },
  {
    name: "Ridiyagama Safari Park",
    description: "Open safari experience where you can see lions, elephants, giraffes, and other wildlife roaming in large natural enclosures.",
    image: "https://images.unsplash.com/photo-1516426122078-c23e76319801?auto=format&fit=crop&q=80",
    category: "Wildlife & Safari",
    rating: 4.7,
    duration: "3 hours",
    price: "$25",
    icon: "Binoculars"
  },
  {
    name: "Dry Zone Botanic Gardens",
    description: "Specialized botanical garden featuring drought-resistant plants, indigenous flora, and sustainable gardening practices unique to Sri Lanka's dry zone.",
    image: "https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?auto=format&fit=crop&q=80",
    category: "Nature & Gardens",
    rating: 4.6,
    duration: "2-3 hours",
    price: "$5",
    icon: "TreePine"
  },
  {
    name: "Mattala Rajapaksa International Airport",
    description: "Modern international airport with unique architecture. Often called the world's emptiest airport - a fascinating visit for aviation enthusiasts.",
    image: "https://images.unsplash.com/photo-1556388158-158ea5ccacbd?auto=format&fit=crop&q=80",
    category: "Modern Infrastructure",
    rating: 4.2,
    duration: "1 hour",
    price: "$10",
    icon: "Plane"
  },
  {
    name: "Kalametiya Bird Sanctuary",
    description: "Pristine lagoon ecosystem home to over 150 bird species including rare migrants. Perfect for nature photography and peaceful boat rides.",
    image: "https://images.unsplash.com/photo-1555852003-80d89d823d0f?auto=format&fit=crop&q=80",
    category: "Wildlife & Nature",
    rating: 4.7,
    duration: "3 hours",
    price: "$20",
    icon: "Bird"
  }
];

const defaultActivities: Activity[] = [
  {
    name: "Bundala Safari Adventure",
    description: "Early morning wildlife safari with expert naturalist guides to spot flamingos, elephants, and crocodiles",
    icon: "Compass",
    price: "From $45",
    duration: "4 hours",
    difficulty: "Easy",
    popular: true
  },
  {
    name: "Whale & Dolphin Watching",
    description: "Ocean excursion from Mirissa to spot blue whales, sperm whales, and dolphins in their natural habitat",
    icon: "Waves",
    price: "From $55",
    duration: "6 hours",
    difficulty: "Easy",
    popular: true
  },
  {
    name: "Port & City Development Tour",
    description: "Explore modern infrastructure including the port, convention center, and international cricket stadium",
    icon: "Ship",
    price: "From $35",
    duration: "3 hours",
    difficulty: "Easy"
  },
  {
    name: "Bird Photography Expedition",
    description: "Guided photography tour through Bundala and Kalametiya to capture migratory birds and flamingos",
    icon: "Camera",
    price: "From $60",
    duration: "5 hours",
    difficulty: "Easy"
  },
  {
    name: "Deep Sea Fishing",
    description: "Offshore fishing adventure with experienced local fishermen targeting tuna, marlin, and barracuda",
    icon: "Fish",
    price: "From $80",
    duration: "Full Day",
    difficulty: "Moderate"
  },
  {
    name: "Salt Pan & Traditional Industry Tour",
    description: "Discover traditional salt harvesting methods in the ancient Hambantota salt pans",
    icon: "Sunrise",
    price: "From $25",
    duration: "2 hours",
    difficulty: "Easy"
  }
];

const defaultRestaurants: Restaurant[] = [
  {
    name: "Peacock Beach Hotel Restaurant",
    cuisine: "Sri Lankan & International",
    priceRange: "$$$",
    rating: 4.6,
    image: "https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&q=80",
    specialty: "Fresh Seafood Platters",
    location: "Tangalle Beach Road"
  },
  {
    name: "The Sands Restaurant",
    cuisine: "Seafood & Fusion",
    priceRange: "$$$",
    rating: 4.7,
    image: "https://images.unsplash.com/photo-1552566626-52f8b828add9?auto=format&fit=crop&q=80",
    specialty: "Grilled Lobster",
    location: "Rekawa Beach"
  },
  {
    name: "Hambantota Rest House",
    cuisine: "Traditional Sri Lankan",
    priceRange: "$$",
    rating: 4.4,
    image: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&q=80",
    specialty: "Rice & Curry Buffet",
    location: "Hambantota Town"
  },
  {
    name: "Ocean Edge Café",
    cuisine: "Café & Light Bites",
    priceRange: "$$",
    rating: 4.5,
    image: "https://images.unsplash.com/photo-1554118811-1e0d58224f24?auto=format&fit=crop&q=80",
    specialty: "Fresh Fruit Smoothies",
    location: "Tangalle"
  }
];

const defaultHotels: HotelInfo[] = [
  {
    name: "Shangri-La's Hambantota Golf Resort & Spa",
    category: "5-Star Luxury",
    priceRange: "$$$$",
    rating: 4.9,
    image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&q=80",
    amenities: ["Golf Course", "Spa", "Pool", "Beach Access", "Fine Dining"],
    location: "Chithragala"
  },
  {
    name: "Anantara Peace Haven Tangalle Resort",
    category: "5-Star Luxury",
    priceRange: "$$$$",
    rating: 4.8,
    image: "https://images.unsplash.com/photo-1582719508461-905c673771fd?auto=format&fit=crop&q=80",
    amenities: ["Private Beach", "Spa", "Infinity Pool", "Yoga Pavilion"],
    location: "Tangalle"
  },
  {
    name: "Chena Huts by Uga Escapes",
    category: "Boutique Luxury",
    priceRange: "$$$$",
    rating: 4.9,
    image: "https://images.unsplash.com/photo-1578683010236-d716f9a3f461?auto=format&fit=crop&q=80",
    amenities: ["Private Cabins", "Safari", "Pool", "Sunset Views"],
    location: "Yala Border"
  },
  {
    name: "The Safari Hotel",
    category: "Mid-Range",
    priceRange: "$$",
    rating: 4.3,
    image: "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?auto=format&fit=crop&q=80",
    amenities: ["Pool", "Restaurant", "Safari Packages", "Free Parking"],
    location: "Tissamaharama Road"
  }
];

const defaultWeatherInfo: WeatherInfo = {
  temperature: "26-33°C",
  humidity: "70-85%",
  rainfall: "Low (Dry Zone)",
  bestMonths: "December to April",
  climate: "Tropical Dry",
  waterTemp: "27-29°C"
};

const defaultTravelTips: TravelTip[] = [
  {
    icon: "Compass",
    title: "Safari Timing",
    description: "Book early morning (5:30 AM) or late afternoon (3 PM) safaris for the best wildlife sightings and cooler temperatures."
  },
  {
    icon: "Sun",
    title: "Sun Protection",
    description: "The dry zone sun is intense. Bring high SPF sunscreen, a hat, and stay hydrated throughout your visit."
  },
  {
    icon: "Camera",
    title: "Photography Tips",
    description: "For flamingo photography at Bundala, bring telephoto lenses. Best light is early morning for golden hour shots."
  },
  {
    icon: "Ship",
    title: "Port Tours",
    description: "Advance booking required for port tours due to security clearance. Photography restrictions apply in certain areas."
  },
  {
    icon: "Luggage",
    title: "Safari Essentials",
    description: "Wear neutral colors (khaki, brown, olive), bring binoculars, and carry plenty of water for safari trips."
  },
  {
    icon: "CreditCard",
    title: "Payment Options",
    description: "Cash is preferred in smaller establishments. ATMs available in Hambantota town and at larger hotels."
  }
];

const defaultSEOSettings: SEOSettings = {
  title: "Hambantota - Safari Gateway & Modern Port City | Sri Lanka",
  description: "Explore Hambantota's Bundala National Park, modern port, and pristine beaches. Your gateway to wildlife safaris, whale watching, and southern Sri Lanka adventures.",
  keywords: ["Hambantota", "Bundala National Park", "Sri Lanka Safari", "Hambantota Port", "Whale Watching", "Bird Sanctuary"]
};

const defaultCTASection: CTASection = {
  title: "Ready to Explore Safari Country?",
  subtitle: "Experience world-class wildlife, pristine beaches, and modern marvels in Hambantota",
  primaryButton: "Book Your Safari",
  secondaryButton: "Plan Your Trip"
};

// Icon mapping function
const getIconComponent = (iconName: string) => {
  const iconMap: { [key: string]: any } = {
    'MapPin': MapPin,
    'Calendar': Calendar,
    'Clock': Clock,
    'Star': Star,
    'Wifi': Wifi,
    'Utensils': Utensils,
    'Camera': Camera,
    'Hotel': Hotel,
    'Users': Users,
    'DollarSign': DollarSign,
    'Info': Info,
    'Sun': Sun,
    'Cloud': Cloud,
    'Thermometer': Thermometer,
    'Droplets': Droplets,
    'Wind': Wind,
    'Umbrella': Umbrella,
    'Navigation': Navigation,
    'Mountain': Mountain,
    'Waves': Waves,
    'Ship': Ship,
    'Plane': Plane,
    'Compass': Compass,
    'Anchor': Anchor,
    'TreePine': TreePine,
    'Bird': Bird,
    'Binoculars': Binoculars,
    'Sunrise': Sunrise,
    'Fish': Fish,
    'Globe': Globe,
    'Luggage': Luggage,
    'CreditCard': CreditCard,
    'Phone': Phone,
    'Shield': Shield,
    'Heart': Heart,
    'Coffee': Coffee,
    'Award': Award,
    'Sparkles': Sparkles,
    'Building2': Building2,
    'Landmark': Landmark,
    'ShoppingBag': ShoppingBag
  };
  return iconMap[iconName] || Compass;
};

const Hambantota = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [selectedTab, setSelectedTab] = useState('attractions');
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [selectedAttraction, setSelectedAttraction] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);

  // State for all content sections
  const [heroSlides, setHeroSlides] = useState<HeroSlide[]>(defaultHeroSlides);
  const [attractions, setAttractions] = useState<Attraction[]>(defaultAttractions);
  const [activities, setActivities] = useState<Activity[]>(defaultActivities);
  const [restaurants, setRestaurants] = useState<Restaurant[]>(defaultRestaurants);
  const [hotels, setHotels] = useState<HotelInfo[]>(defaultHotels);
  const [destinationInfo, setDestinationInfo] = useState<DestinationInfo>({
    population: "48,000",
    area: "999 km²",
    elevation: "Sea Level",
    bestTime: "December - April",
    language: "Sinhala, Tamil, English",
    currency: "Sri Lankan Rupee (LKR)"
  });
  const [weatherInfo, setWeatherInfo] = useState<WeatherInfo>(defaultWeatherInfo);
  const [travelTips, setTravelTips] = useState<TravelTip[]>(defaultTravelTips);
  const [seoSettings, setSeoSettings] = useState<SEOSettings>(defaultSEOSettings);
  const [ctaSection, setCtaSection] = useState<CTASection>(defaultCTASection);

  // Load content from Firebase
  useEffect(() => {
    const loadContent = async () => {
      try {
        const data = await getDestinationBySlug('hambantota');

        if (data) {
          if (data.heroSlides?.length) setHeroSlides(data.heroSlides);
          if (data.attractions?.length) setAttractions(data.attractions);
          if (data.activities?.length) setActivities(data.activities);
          if (data.restaurants?.length) setRestaurants(data.restaurants);
          if (data.hotels?.length) setHotels(data.hotels);
          if (data.destinationInfo) setDestinationInfo(data.destinationInfo);
          if (data.weatherInfo) setWeatherInfo(data.weatherInfo);
          if (data.travelTips?.length) setTravelTips(data.travelTips);
          if (data.seoSettings) setSeoSettings(data.seoSettings);
          if (data.ctaSection) setCtaSection(data.ctaSection);
        }
      } catch (error) {
        console.error('Error loading Hambantota content:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadContent();
  }, []);

  // Auto-rotate hero slides
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [heroSlides.length]);

  const handleBookNow = (attractionName: string = '') => {
    setSelectedAttraction(attractionName);
    setShowBookingModal(true);
  };

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
    { id: 'weather', label: 'Weather', count: null },
    { id: 'tips', label: 'Travel Tips', count: travelTips.length }
  ];

  return (
    <>
      <Helmet>
        <title>{seoSettings.title}</title>
        <meta name="description" content={seoSettings.description} />
        <meta name="keywords" content={seoSettings.keywords.join(', ')} />
        <meta property="og:title" content={seoSettings.title} />
        <meta property="og:description" content={seoSettings.description} />
        <link rel="canonical" href="https://rechargetravels.com/destinations/hambantota" />
      </Helmet>

      <Header />

      <div className="min-h-screen bg-gradient-to-b from-amber-50 to-white">
        {/* Hero Section */}
        <section className="relative h-[85vh] overflow-hidden">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentSlide}
              initial={{ opacity: 0, scale: 1.1 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1.5 }}
              className="absolute inset-0"
            >
              <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/30 to-black/70 z-10" />
              <img
                src={heroSlides[currentSlide]?.image}
                alt={heroSlides[currentSlide]?.title}
                className="w-full h-full object-cover"
              />
            </motion.div>
          </AnimatePresence>

          {/* Hero Content */}
          <div className="relative z-20 h-full flex items-center justify-center text-center text-white">
            <div className="max-w-5xl mx-auto px-4">
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-6"
              >
                <Badge className="bg-amber-500/90 text-white text-sm px-4 py-2">
                  <Compass className="w-4 h-4 mr-2 inline" />
                  Safari Gateway of Sri Lanka
                </Badge>
              </motion.div>

              <motion.h1
                key={`title-${currentSlide}`}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                className="text-5xl md:text-7xl font-bold mb-6 drop-shadow-lg"
              >
                {heroSlides[currentSlide]?.title}
              </motion.h1>

              <motion.p
                key={`subtitle-${currentSlide}`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="text-xl md:text-2xl mb-8 text-white/90"
              >
                {heroSlides[currentSlide]?.subtitle}
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.4 }}
                className="flex flex-wrap gap-4 justify-center"
              >
                <Button
                  size="lg"
                  className="bg-amber-500 hover:bg-amber-600 text-white"
                  onClick={() => handleBookNow()}
                >
                  <Compass className="w-5 h-5 mr-2" />
                  Book Safari Experience
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="bg-white/10 backdrop-blur-sm border-white text-white hover:bg-white/20"
                >
                  <Info className="w-5 h-5 mr-2" />
                  Explore Guide
                </Button>
              </motion.div>
            </div>
          </div>

          {/* Navigation Arrows */}
          <button
            onClick={prevSlide}
            className="absolute left-4 top-1/2 -translate-y-1/2 z-30 bg-white/20 hover:bg-white/40 backdrop-blur-sm p-3 rounded-full transition-all"
          >
            <ChevronLeft className="w-6 h-6 text-white" />
          </button>
          <button
            onClick={nextSlide}
            className="absolute right-4 top-1/2 -translate-y-1/2 z-30 bg-white/20 hover:bg-white/40 backdrop-blur-sm p-3 rounded-full transition-all"
          >
            <ChevronRight className="w-6 h-6 text-white" />
          </button>

          {/* Slide Indicators */}
          <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex gap-3 z-30">
            {heroSlides.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentSlide(index)}
                className={`h-2 rounded-full transition-all duration-300 ${
                  currentSlide === index ? 'w-8 bg-amber-500' : 'w-2 bg-white/50 hover:bg-white/80'
                }`}
              />
            ))}
          </div>
        </section>

        {/* Quick Info Bar */}
        <section className="bg-white shadow-lg py-8 -mt-16 relative z-30 mx-4 lg:mx-auto max-w-6xl rounded-2xl">
          <div className="container mx-auto px-6">
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
              <div className="text-center">
                <Users className="w-8 h-8 mx-auto mb-2 text-amber-600" />
                <h3 className="font-semibold text-gray-800">Population</h3>
                <p className="text-gray-600 text-sm">{destinationInfo.population}</p>
              </div>
              <div className="text-center">
                <MapPin className="w-8 h-8 mx-auto mb-2 text-amber-600" />
                <h3 className="font-semibold text-gray-800">Area</h3>
                <p className="text-gray-600 text-sm">{destinationInfo.area}</p>
              </div>
              <div className="text-center">
                <Waves className="w-8 h-8 mx-auto mb-2 text-amber-600" />
                <h3 className="font-semibold text-gray-800">Elevation</h3>
                <p className="text-gray-600 text-sm">{destinationInfo.elevation}</p>
              </div>
              <div className="text-center">
                <Sun className="w-8 h-8 mx-auto mb-2 text-amber-600" />
                <h3 className="font-semibold text-gray-800">Best Time</h3>
                <p className="text-gray-600 text-sm">{destinationInfo.bestTime}</p>
              </div>
              <div className="text-center">
                <Globe className="w-8 h-8 mx-auto mb-2 text-amber-600" />
                <h3 className="font-semibold text-gray-800">Language</h3>
                <p className="text-gray-600 text-sm">{destinationInfo.language}</p>
              </div>
              <div className="text-center">
                <DollarSign className="w-8 h-8 mx-auto mb-2 text-amber-600" />
                <h3 className="font-semibold text-gray-800">Currency</h3>
                <p className="text-gray-600 text-sm">{destinationInfo.currency}</p>
              </div>
            </div>
          </div>
        </section>

        {/* Tab Navigation */}
        <section className="sticky top-0 z-40 bg-white/95 backdrop-blur-md shadow-md mt-8">
          <div className="container mx-auto px-4">
            <div className="flex space-x-1 overflow-x-auto py-2">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setSelectedTab(tab.id)}
                  className={`px-6 py-3 rounded-full whitespace-nowrap transition-all flex items-center gap-2 ${
                    selectedTab === tab.id
                      ? 'bg-amber-500 text-white shadow-lg'
                      : 'text-gray-600 hover:bg-amber-100'
                  }`}
                >
                  {tab.label}
                  {tab.count !== null && (
                    <Badge variant={selectedTab === tab.id ? "secondary" : "outline"} className="ml-1">
                      {tab.count}
                    </Badge>
                  )}
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* Content Sections */}
        <section className="container mx-auto px-4 py-12">
          {/* Attractions Tab */}
          {selectedTab === 'attractions' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h2 className="text-3xl font-bold text-gray-800">Top Attractions in Hambantota</h2>
                  <p className="text-gray-600 mt-2">Discover wildlife sanctuaries, modern marvels, and natural beauty</p>
                </div>
              </div>

              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {attractions.map((attraction, index) => {
                  const IconComponent = getIconComponent(attraction.icon || 'Compass');
                  return (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <Card className="overflow-hidden hover:shadow-2xl transition-all duration-300 group border-0 shadow-lg">
                        <div className="relative h-56 overflow-hidden">
                          <img
                            src={attraction.image}
                            alt={attraction.name}
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                          <Badge className="absolute top-4 right-4 bg-amber-500 text-white">
                            {attraction.category}
                          </Badge>
                          <div className="absolute bottom-4 left-4 flex items-center gap-2">
                            <div className="bg-white/90 backdrop-blur-sm rounded-full p-2">
                              <IconComponent className="w-5 h-5 text-amber-600" />
                            </div>
                          </div>
                        </div>
                        <CardContent className="p-6">
                          <h3 className="text-xl font-bold mb-2 text-gray-800">{attraction.name}</h3>
                          <p className="text-gray-600 mb-4 line-clamp-2">{attraction.description}</p>

                          <div className="flex items-center gap-4 mb-4 text-sm">
                            <span className="flex items-center gap-1 text-yellow-500">
                              <Star className="w-4 h-4 fill-current" />
                              {attraction.rating}
                            </span>
                            <span className="flex items-center gap-1 text-gray-500">
                              <Clock className="w-4 h-4" />
                              {attraction.duration}
                            </span>
                            <span className="flex items-center gap-1 text-amber-600 font-semibold">
                              {attraction.price}
                            </span>
                          </div>

                          <Button
                            className="w-full bg-amber-500 hover:bg-amber-600"
                            onClick={() => handleBookNow(attraction.name)}
                          >
                            Book Experience
                          </Button>
                        </CardContent>
                      </Card>
                    </motion.div>
                  );
                })}
              </div>
            </motion.div>
          )}

          {/* Activities Tab */}
          {selectedTab === 'activities' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <div className="mb-8">
                <h2 className="text-3xl font-bold text-gray-800">Things to Do in Hambantota</h2>
                <p className="text-gray-600 mt-2">Safari adventures, whale watching, and unique experiences</p>
              </div>

              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {activities.map((activity, index) => {
                  const IconComponent = getIconComponent(activity.icon);
                  return (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <Card className={`hover:shadow-xl transition-all duration-300 ${
                        activity.popular ? 'border-2 border-amber-500 relative' : 'border-0 shadow-lg'
                      }`}>
                        {activity.popular && (
                          <div className="absolute -top-3 left-4 bg-amber-500 text-white text-xs font-bold px-3 py-1 rounded-full">
                            MOST POPULAR
                          </div>
                        )}
                        <CardHeader className="pb-4">
                          <div className="flex items-center justify-between">
                            <div className="bg-amber-100 p-4 rounded-2xl">
                              <IconComponent className="w-8 h-8 text-amber-600" />
                            </div>
                            <div className="text-right">
                              <Badge variant="outline" className="mb-1">{activity.duration}</Badge>
                              {activity.difficulty && (
                                <p className="text-xs text-gray-500">{activity.difficulty}</p>
                              )}
                            </div>
                          </div>
                          <CardTitle className="mt-4 text-xl">{activity.name}</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <p className="text-gray-600 mb-6">{activity.description}</p>
                          <div className="flex items-center justify-between">
                            <span className="text-2xl font-bold text-amber-600">{activity.price}</span>
                            <Button
                              className="bg-amber-500 hover:bg-amber-600"
                              onClick={() => handleBookNow(activity.name)}
                            >
                              Book Now
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  );
                })}
              </div>
            </motion.div>
          )}

          {/* Dining Tab */}
          {selectedTab === 'dining' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <div className="mb-8">
                <h2 className="text-3xl font-bold text-gray-800">Where to Eat in Hambantota</h2>
                <p className="text-gray-600 mt-2">Fresh seafood and authentic Sri Lankan cuisine</p>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                {restaurants.map((restaurant, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: index % 2 === 0 ? -20 : 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Card className="overflow-hidden hover:shadow-xl transition-all flex flex-col md:flex-row border-0 shadow-lg">
                      <div className="md:w-2/5 h-48 md:h-auto">
                        <img
                          src={restaurant.image}
                          alt={restaurant.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <CardContent className="md:w-3/5 p-6 flex flex-col justify-between">
                        <div>
                          <div className="flex items-start justify-between mb-2">
                            <h3 className="text-xl font-bold text-gray-800">{restaurant.name}</h3>
                            <Badge className="bg-amber-100 text-amber-700">{restaurant.priceRange}</Badge>
                          </div>
                          <p className="text-amber-600 font-medium mb-2">{restaurant.cuisine}</p>
                          <p className="text-gray-600 text-sm mb-3">
                            <span className="font-semibold">Specialty:</span> {restaurant.specialty}
                          </p>
                          <p className="text-gray-500 text-sm flex items-center gap-1">
                            <MapPin className="w-4 h-4" />
                            {restaurant.location}
                          </p>
                        </div>
                        <div className="flex items-center justify-between mt-4">
                          <div className="flex items-center gap-1">
                            <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                            <span className="font-bold">{restaurant.rating}</span>
                          </div>
                          <Button variant="outline" className="border-amber-500 text-amber-600 hover:bg-amber-50">
                            View Menu
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}

          {/* Stay Tab */}
          {selectedTab === 'stay' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <div className="mb-8">
                <h2 className="text-3xl font-bold text-gray-800">Where to Stay in Hambantota</h2>
                <p className="text-gray-600 mt-2">Luxury resorts, safari lodges, and boutique accommodations</p>
              </div>

              <div className="grid md:grid-cols-2 gap-8">
                {hotels.map((hotel, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Card className="overflow-hidden hover:shadow-2xl transition-all border-0 shadow-lg">
                      <div className="relative h-64">
                        <img
                          src={hotel.image}
                          alt={hotel.name}
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                        <div className="absolute bottom-4 left-4 right-4">
                          <Badge className="bg-amber-500 text-white mb-2">{hotel.category}</Badge>
                          <h3 className="text-2xl font-bold text-white">{hotel.name}</h3>
                        </div>
                        <div className="absolute top-4 right-4 bg-white rounded-full px-3 py-1 flex items-center gap-1">
                          <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                          <span className="font-bold text-gray-800">{hotel.rating}</span>
                        </div>
                      </div>
                      <CardContent className="p-6">
                        <div className="flex items-center gap-2 text-gray-600 mb-4">
                          <MapPin className="w-4 h-4 text-amber-500" />
                          {hotel.location}
                        </div>

                        <div className="flex flex-wrap gap-2 mb-4">
                          {hotel.amenities.map((amenity, i) => (
                            <Badge key={i} variant="outline" className="bg-amber-50 border-amber-200">
                              {amenity}
                            </Badge>
                          ))}
                        </div>

                        <div className="flex items-center justify-between pt-4 border-t">
                          <div>
                            <span className="text-gray-500 text-sm">From</span>
                            <p className="text-2xl font-bold text-amber-600">{hotel.priceRange}</p>
                            <span className="text-gray-500 text-sm">per night</span>
                          </div>
                          <Button className="bg-amber-500 hover:bg-amber-600">
                            Check Availability
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}

          {/* Weather Tab */}
          {selectedTab === 'weather' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <div className="mb-8">
                <h2 className="text-3xl font-bold text-gray-800">Weather in Hambantota</h2>
                <p className="text-gray-600 mt-2">Tropical dry zone climate - warm and sunny year-round</p>
              </div>

              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                <Card className="bg-gradient-to-br from-orange-400 to-amber-500 text-white border-0">
                  <CardHeader>
                    <Thermometer className="w-12 h-12 mb-2" />
                    <CardTitle className="text-white">Temperature</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-4xl font-bold">{weatherInfo.temperature}</p>
                    <p className="text-white/80 mt-2">Warm tropical climate</p>
                  </CardContent>
                </Card>

                <Card className="bg-gradient-to-br from-blue-400 to-cyan-500 text-white border-0">
                  <CardHeader>
                    <Droplets className="w-12 h-12 mb-2" />
                    <CardTitle className="text-white">Humidity</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-4xl font-bold">{weatherInfo.humidity}</p>
                    <p className="text-white/80 mt-2">Coastal humidity levels</p>
                  </CardContent>
                </Card>

                <Card className="bg-gradient-to-br from-green-400 to-emerald-500 text-white border-0">
                  <CardHeader>
                    <Umbrella className="w-12 h-12 mb-2" />
                    <CardTitle className="text-white">Rainfall</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-4xl font-bold">{weatherInfo.rainfall}</p>
                    <p className="text-white/80 mt-2">{weatherInfo.climate} zone</p>
                  </CardContent>
                </Card>

                <Card className="bg-gradient-to-br from-purple-400 to-violet-500 text-white border-0">
                  <CardHeader>
                    <Calendar className="w-12 h-12 mb-2" />
                    <CardTitle className="text-white">Best Months</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-4xl font-bold">{weatherInfo.bestMonths}</p>
                    <p className="text-white/80 mt-2">Peak safari season</p>
                  </CardContent>
                </Card>

                <Card className="bg-gradient-to-br from-teal-400 to-cyan-500 text-white border-0">
                  <CardHeader>
                    <Waves className="w-12 h-12 mb-2" />
                    <CardTitle className="text-white">Water Temperature</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-4xl font-bold">{weatherInfo.waterTemp}</p>
                    <p className="text-white/80 mt-2">Perfect for swimming</p>
                  </CardContent>
                </Card>

                <Card className="bg-gradient-to-br from-yellow-400 to-orange-500 text-white border-0">
                  <CardHeader>
                    <Sun className="w-12 h-12 mb-2" />
                    <CardTitle className="text-white">Climate Type</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-4xl font-bold">{weatherInfo.climate}</p>
                    <p className="text-white/80 mt-2">Dry zone weather</p>
                  </CardContent>
                </Card>
              </div>
            </motion.div>
          )}

          {/* Travel Tips Tab */}
          {selectedTab === 'tips' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <div className="mb-8">
                <h2 className="text-3xl font-bold text-gray-800">Travel Tips for Hambantota</h2>
                <p className="text-gray-600 mt-2">Essential advice for your safari and beach adventure</p>
              </div>

              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {travelTips.map((tip, index) => {
                  const IconComponent = getIconComponent(tip.icon);
                  return (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <Card className="h-full hover:shadow-lg transition-shadow border-0 shadow-md bg-white">
                        <CardHeader>
                          <div className="bg-amber-100 w-14 h-14 rounded-2xl flex items-center justify-center mb-4">
                            <IconComponent className="w-7 h-7 text-amber-600" />
                          </div>
                          <CardTitle className="text-lg">{tip.title}</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <p className="text-gray-600">{tip.description}</p>
                        </CardContent>
                      </Card>
                    </motion.div>
                  );
                })}
              </div>
            </motion.div>
          )}
        </section>

        {/* CTA Section */}
        <section className="bg-gradient-to-r from-amber-600 via-orange-500 to-amber-600 py-20">
          <div className="container mx-auto px-4 text-center text-white">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <Compass className="w-16 h-16 mx-auto mb-6 opacity-80" />
              <h2 className="text-4xl md:text-5xl font-bold mb-4">{ctaSection.title}</h2>
              <p className="text-xl mb-8 max-w-2xl mx-auto text-white/90">
                {ctaSection.subtitle}
              </p>
              <div className="flex flex-wrap gap-4 justify-center">
                <Button
                  size="lg"
                  className="bg-white text-amber-600 hover:bg-gray-100"
                  onClick={() => handleBookNow()}
                >
                  <Bird className="w-5 h-5 mr-2" />
                  {ctaSection.primaryButton}
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="border-white text-white hover:bg-white/20 bg-transparent"
                >
                  <Navigation className="w-5 h-5 mr-2" />
                  {ctaSection.secondaryButton}
                </Button>
              </div>
            </motion.div>
          </div>
        </section>
      </div>

      {/* Booking Modal */}
      <EnhancedBookingModal
        isOpen={showBookingModal}
        onClose={() => setShowBookingModal(false)}
        preSelectedService={selectedAttraction}
      />

      <Footer />
    </>
  );
};

export default Hambantota;
