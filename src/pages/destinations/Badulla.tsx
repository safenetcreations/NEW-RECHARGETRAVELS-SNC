import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { useNavigate } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { motion, AnimatePresence } from 'framer-motion';
import DestinationMap from '@/components/destinations/DestinationMap';
import WeatherWidget from '@/components/destinations/WeatherWidget';
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
  Train,
  TreePine,
  Bird,
  Binoculars,
  Sunrise,
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
  ShoppingBag,
  Home,
  Footprints
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { getDestinationBySlug } from '@/services/destinationContentService';

const BADULLA_CENTER = { lat: 6.9934, lng: 81.0550 };

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
  { image: "https://images.unsplash.com/photo-1588598198321-39f8c2be97ba?auto=format&fit=crop&q=80", title: "Discover Badulla", subtitle: "Gateway to Uva Province" },
  { image: "https://images.unsplash.com/photo-1546587348-d12660c30c50?auto=format&fit=crop&q=80", title: "Dunhinda Falls", subtitle: "Bridal Veil Waterfall" },
  { image: "https://images.unsplash.com/photo-1571536802807-30451e3f3d43?auto=format&fit=crop&q=80", title: "Muthiyangana Temple", subtitle: "Ancient Sacred Buddhist Site" },
  { image: "https://images.unsplash.com/photo-1627894483216-2138af692e32?auto=format&fit=crop&q=80", title: "Tea Estates", subtitle: "Rolling Hills of Green" },
  { image: "https://images.unsplash.com/photo-1580835845419-bb7c9c878f57?auto=format&fit=crop&q=80", title: "Namunukula Mountain", subtitle: "9 Peaks Mountain Range" }
];

const defaultAttractions: Attraction[] = [
  {
    name: "Dunhinda Falls",
    description: "One of Sri Lanka's most beautiful waterfalls, cascading 64 meters through misty spray. The trek passes through scenic jungle paths and smaller cascades.",
    image: "https://images.unsplash.com/photo-1621569896088-46cc0d472c8d?auto=format&fit=crop&q=80",
    category: "Waterfalls",
    rating: 4.8,
    duration: "2-3 hours",
    price: "$2",
    icon: "Droplets"
  },
  {
    name: "Muthiyangana Raja Maha Viharaya",
    description: "One of the Solosmasthana (16 sacred sites), this ancient temple dates back to Buddha's time. Features beautiful paintings and a sacred Bo tree.",
    image: "https://images.unsplash.com/photo-1609920658906-8223bd289001?auto=format&fit=crop&q=80",
    category: "Religious Sites",
    rating: 4.7,
    duration: "1-2 hours",
    price: "Free",
    icon: "Landmark"
  },
  {
    name: "Badulla Railway Station",
    description: "A charming colonial-era station marking the end of the scenic hill country railway line. The journey here is considered one of the world's most beautiful train rides.",
    image: "https://images.unsplash.com/photo-1564760055775-d63b17a55c44?auto=format&fit=crop&q=80",
    category: "Historical",
    rating: 4.5,
    duration: "1 hour",
    price: "Free",
    icon: "Train"
  },
  {
    name: "Ravana Falls",
    description: "A stunning 25-meter waterfall linked to the Ramayana epic. Located on the Ella-Badulla road, it's easily accessible and offers great photo opportunities.",
    image: "https://images.unsplash.com/photo-1621569898744-04b17bb249d0?auto=format&fit=crop&q=80",
    category: "Waterfalls",
    rating: 4.6,
    duration: "1 hour",
    price: "Free",
    icon: "Waves"
  },
  {
    name: "Bogoda Wooden Bridge",
    description: "An ancient wooden bridge built in the 16th century without using any nails. One of the oldest surviving wooden bridges in Sri Lanka with unique architecture.",
    image: "https://images.unsplash.com/photo-1588668214407-6ea9a6d8c272?auto=format&fit=crop&q=80",
    category: "Historical",
    rating: 4.4,
    duration: "1 hour",
    price: "Free",
    icon: "Building2"
  },
  {
    name: "Dhowa Rock Temple",
    description: "An ancient rock temple featuring an unfinished 12-meter Buddha statue carved into rock face and beautiful cave paintings from the Kandyan period.",
    image: "https://images.unsplash.com/photo-1552832230-c0197dd311b5?auto=format&fit=crop&q=80",
    category: "Religious Sites",
    rating: 4.3,
    duration: "1 hour",
    price: "Donation",
    icon: "Mountain"
  }
];

const defaultActivities: Activity[] = [
  {
    name: "Waterfall Trekking",
    description: "Guided hikes to multiple waterfalls including Dunhinda and hidden cascades in the surrounding hills",
    icon: "Droplets",
    price: "From $25",
    duration: "Half Day",
    difficulty: "Moderate",
    popular: true
  },
  {
    name: "Scenic Train Journey",
    description: "Experience the famous Badulla-Ella-Kandy train route, one of the world's most beautiful rail journeys",
    icon: "Train",
    price: "From $5",
    duration: "2-6 hours",
    difficulty: "Easy",
    popular: true
  },
  {
    name: "Temple & Heritage Tour",
    description: "Visit ancient temples including Muthiyangana and Dhowa Rock Temple with expert guides",
    icon: "Landmark",
    price: "From $30",
    duration: "4 hours",
    difficulty: "Easy"
  },
  {
    name: "Tea Estate Visit",
    description: "Tour nearby tea plantations and factories, learn about Ceylon tea production",
    icon: "TreePine",
    price: "From $20",
    duration: "3 hours",
    difficulty: "Easy"
  },
  {
    name: "Village Experience",
    description: "Authentic hill country village life - farming, cooking, and local traditions",
    icon: "Home",
    price: "From $35",
    duration: "Half Day",
    difficulty: "Easy"
  },
  {
    name: "Photography Tours",
    description: "Capture misty mountains, waterfalls, and tea country landscapes at golden hour",
    icon: "Camera",
    price: "From $40",
    duration: "Full Day",
    difficulty: "Easy"
  }
];

const defaultRestaurants: Restaurant[] = [
  {
    name: "Badulla Rest House",
    cuisine: "Sri Lankan Traditional",
    priceRange: "$$",
    rating: 4.3,
    image: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&q=80",
    specialty: "Rice & Curry Buffet",
    location: "Town Center"
  },
  {
    name: "Hill Country Kitchen",
    cuisine: "Sri Lankan & Chinese",
    priceRange: "$$",
    rating: 4.4,
    image: "https://images.unsplash.com/photo-1552566626-52f8b828add9?auto=format&fit=crop&q=80",
    specialty: "Hill Country Vegetables",
    location: "Main Street"
  },
  {
    name: "Tea Garden Café",
    cuisine: "Café & Bakery",
    priceRange: "$",
    rating: 4.2,
    image: "https://images.unsplash.com/photo-1554118811-1e0d58224f24?auto=format&fit=crop&q=80",
    specialty: "Fresh Baked Goods & Tea",
    location: "Near Railway Station"
  },
  {
    name: "Uva Province Restaurant",
    cuisine: "Multi-Cuisine",
    priceRange: "$$",
    rating: 4.5,
    image: "https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&q=80",
    specialty: "Local Uva Specialties",
    location: "Badulla Town"
  }
];

const defaultHotels: HotelInfo[] = [
  {
    name: "Dunhinda Falls Inn",
    category: "Mid-Range",
    priceRange: "$$",
    rating: 4.5,
    image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&q=80",
    amenities: ["Mountain View", "Restaurant", "Free Parking", "WiFi"],
    location: "Near Dunhinda"
  },
  {
    name: "Badulla Heritage Hotel",
    category: "Heritage",
    priceRange: "$$$",
    rating: 4.6,
    image: "https://images.unsplash.com/photo-1582719508461-905c673771fd?auto=format&fit=crop&q=80",
    amenities: ["Colonial Building", "Garden", "Restaurant", "Bar"],
    location: "Town Center"
  },
  {
    name: "Hill View Guest House",
    category: "Budget Friendly",
    priceRange: "$",
    rating: 4.2,
    image: "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?auto=format&fit=crop&q=80",
    amenities: ["Home Cooking", "Garden", "Parking", "Tour Booking"],
    location: "Residential Area"
  },
  {
    name: "Tea Country Bungalow",
    category: "Boutique",
    priceRange: "$$$",
    rating: 4.7,
    image: "https://images.unsplash.com/photo-1578683010236-d716f9a3f461?auto=format&fit=crop&q=80",
    amenities: ["Tea Estate Views", "Fireplace", "Butler Service", "Trekking"],
    location: "Haputale Road"
  }
];

const defaultWeatherInfo: WeatherInfo = {
  temperature: "15-28°C",
  humidity: "70-85%",
  rainfall: "Moderate",
  bestMonths: "December to April",
  climate: "Cool Hill Country",
  waterTemp: "18-22°C"
};

const defaultTravelTips: TravelTip[] = [
  {
    icon: "Cloud",
    title: "Weather & Clothing",
    description: "Pack layers as temperatures vary from 15-28°C. Bring a light jacket for evenings and rain gear, especially October-November."
  },
  {
    icon: "Train",
    title: "Train Journey Tips",
    description: "Book first or second class train tickets in advance. The journey from Kandy/Ella offers breathtaking views - sit on the right side heading to Badulla."
  },
  {
    icon: "Footprints",
    title: "Waterfall Trekking",
    description: "Wear sturdy shoes with good grip - paths to waterfalls can be slippery. The Dunhinda trek takes 45 minutes each way with moderate difficulty."
  },
  {
    icon: "Camera",
    title: "Photography Tips",
    description: "Best light for waterfalls is early morning. Bring waterproof protection for your camera during misty conditions near falls."
  },
  {
    icon: "Luggage",
    title: "What to Pack",
    description: "Insect repellent, sunscreen, comfortable walking shoes, layers for temperature changes, and a small daypack for treks."
  },
  {
    icon: "CreditCard",
    title: "Money & Payments",
    description: "Cash preferred in smaller establishments. ATMs available in Badulla town. Major hotels accept cards."
  }
];

const defaultSEOSettings: SEOSettings = {
  title: "Badulla - Waterfalls, Temples & Hill Country Heritage | Sri Lanka",
  description: "Explore Badulla's stunning Dunhinda Falls, ancient temples, and scenic train journeys. Discover Sri Lanka's Uva Province capital and hill country heritage.",
  keywords: ["Badulla", "Dunhinda Falls", "Sri Lanka Hill Country", "Muthiyangana Temple", "Scenic Train", "Ravana Falls", "Uva Province"]
};

const defaultCTASection: CTASection = {
  title: "Ready to Explore Badulla's Natural Wonders?",
  subtitle: "From cascading waterfalls to ancient temples, discover the heart of Sri Lanka's hill country",
  primaryButton: "Book Hill Country Tour",
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
    'Train': Train,
    'TreePine': TreePine,
    'Bird': Bird,
    'Binoculars': Binoculars,
    'Sunrise': Sunrise,
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
    'ShoppingBag': ShoppingBag,
    'Home': Home,
    'Footprints': Footprints
  };
  return iconMap[iconName] || Mountain;
};

const Badulla = () => {
  const navigate = useNavigate();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [selectedTab, setSelectedTab] = useState('attractions');
  const [isLoading, setIsLoading] = useState(true);

  // State for all content sections
  const [heroSlides, setHeroSlides] = useState<HeroSlide[]>(defaultHeroSlides);
  const [attractions, setAttractions] = useState<Attraction[]>(defaultAttractions);
  const [activities, setActivities] = useState<Activity[]>(defaultActivities);
  const [restaurants, setRestaurants] = useState<Restaurant[]>(defaultRestaurants);
  const [hotels, setHotels] = useState<HotelInfo[]>(defaultHotels);
  const [destinationInfo, setDestinationInfo] = useState<DestinationInfo>({
    population: "47,500",
    area: "23.5 km²",
    elevation: "680m",
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
        const data = await getDestinationBySlug('badulla');

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
        console.error('Error loading Badulla content:', error);
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

  const handleBooking = (service: string = 'Badulla Tour', tourData?: { id: string; name: string; description: string; duration: string; price: number; features: string[]; image?: string }) => {
    const params = new URLSearchParams({
      title: tourData?.name || service,
      id: tourData?.id || service.toLowerCase().replace(/\s+/g, '-'),
      duration: tourData?.duration || 'Full Day',
      price: String(tourData?.price || 50),
      image: tourData?.image || 'https://images.unsplash.com/photo-1546587348-d12660c30c50?w=800',
      subtitle: `Badulla - ${tourData?.name || service}`
    });
    navigate(`/book-tour?${params.toString()}`);
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
    { id: 'map', label: 'Map', count: null },
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
        <link rel="canonical" href="https://rechargetravels.com/destinations/badulla" />
      </Helmet>

      <Header />

      <div className="min-h-screen bg-gradient-to-b from-emerald-50 to-white">
        {/* Hero Section */}
        <section className="relative aspect-video max-h-[85vh] overflow-hidden">
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
                <Badge className="bg-emerald-600/90 text-white text-sm px-4 py-2">
                  <Mountain className="w-4 h-4 mr-2 inline" />
                  Uva Province Capital
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
                  className="bg-emerald-600 hover:bg-emerald-700 text-white"
                  onClick={() => handleBooking()}
                >
                  <Train className="w-5 h-5 mr-2" />
                  Book Hill Country Tour
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
                  currentSlide === index ? 'w-8 bg-emerald-500' : 'w-2 bg-white/50 hover:bg-white/80'
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
                <Users className="w-8 h-8 mx-auto mb-2 text-emerald-600" />
                <h3 className="font-semibold text-gray-800">Population</h3>
                <p className="text-gray-600 text-sm">{destinationInfo.population}</p>
              </div>
              <div className="text-center">
                <MapPin className="w-8 h-8 mx-auto mb-2 text-emerald-600" />
                <h3 className="font-semibold text-gray-800">Area</h3>
                <p className="text-gray-600 text-sm">{destinationInfo.area}</p>
              </div>
              <div className="text-center">
                <Mountain className="w-8 h-8 mx-auto mb-2 text-emerald-600" />
                <h3 className="font-semibold text-gray-800">Elevation</h3>
                <p className="text-gray-600 text-sm">{destinationInfo.elevation}</p>
              </div>
              <div className="text-center">
                <Sun className="w-8 h-8 mx-auto mb-2 text-emerald-600" />
                <h3 className="font-semibold text-gray-800">Best Time</h3>
                <p className="text-gray-600 text-sm">{destinationInfo.bestTime}</p>
              </div>
              <div className="text-center">
                <Globe className="w-8 h-8 mx-auto mb-2 text-emerald-600" />
                <h3 className="font-semibold text-gray-800">Language</h3>
                <p className="text-gray-600 text-sm">{destinationInfo.language}</p>
              </div>
              <div className="text-center">
                <DollarSign className="w-8 h-8 mx-auto mb-2 text-emerald-600" />
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
                      ? 'bg-emerald-600 text-white shadow-lg'
                      : 'text-gray-600 hover:bg-emerald-100'
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
                  <h2 className="text-3xl font-bold text-gray-800">Top Attractions in Badulla</h2>
                  <p className="text-gray-600 mt-2">Discover waterfalls, ancient temples, and scenic railways</p>
                </div>
              </div>

              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {attractions.map((attraction, index) => {
                  const IconComponent = getIconComponent(attraction.icon || 'Mountain');
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
                          <Badge className="absolute top-4 right-4 bg-emerald-600 text-white">
                            {attraction.category}
                          </Badge>
                          <div className="absolute bottom-4 left-4 flex items-center gap-2">
                            <div className="bg-white/90 backdrop-blur-sm rounded-full p-2">
                              <IconComponent className="w-5 h-5 text-emerald-600" />
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
                            <span className="flex items-center gap-1 text-emerald-600 font-semibold">
                              {attraction.price}
                            </span>
                          </div>

                          <Button
                            className="w-full bg-emerald-600 hover:bg-emerald-700"
                            onClick={() => handleBooking(attraction.name)}
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
                <h2 className="text-3xl font-bold text-gray-800">Things to Do in Badulla</h2>
                <p className="text-gray-600 mt-2">Waterfall treks, train journeys, and cultural experiences</p>
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
                        activity.popular ? 'border-2 border-emerald-500 relative' : 'border-0 shadow-lg'
                      }`}>
                        {activity.popular && (
                          <div className="absolute -top-3 left-4 bg-emerald-600 text-white text-xs font-bold px-3 py-1 rounded-full">
                            MOST POPULAR
                          </div>
                        )}
                        <CardHeader className="pb-4">
                          <div className="flex items-center justify-between">
                            <div className="bg-emerald-100 p-4 rounded-2xl">
                              <IconComponent className="w-8 h-8 text-emerald-600" />
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
                            <span className="text-2xl font-bold text-emerald-600">{activity.price}</span>
                            <Button
                              className="bg-emerald-600 hover:bg-emerald-700"
                              onClick={() => handleBooking(activity.name)}
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
                <h2 className="text-3xl font-bold text-gray-800">Where to Eat in Badulla</h2>
                <p className="text-gray-600 mt-2">Traditional hill country cuisine and local favorites</p>
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
                            <Badge className="bg-emerald-100 text-emerald-700">{restaurant.priceRange}</Badge>
                          </div>
                          <p className="text-emerald-600 font-medium mb-2">{restaurant.cuisine}</p>
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
                          <Button variant="outline" className="border-emerald-500 text-emerald-600 hover:bg-emerald-50">
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
                <h2 className="text-3xl font-bold text-gray-800">Where to Stay in Badulla</h2>
                <p className="text-gray-600 mt-2">Heritage hotels, guesthouses, and tea country bungalows</p>
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
                          <Badge className="bg-emerald-600 text-white mb-2">{hotel.category}</Badge>
                          <h3 className="text-2xl font-bold text-white">{hotel.name}</h3>
                        </div>
                        <div className="absolute top-4 right-4 bg-white rounded-full px-3 py-1 flex items-center gap-1">
                          <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                          <span className="font-bold text-gray-800">{hotel.rating}</span>
                        </div>
                      </div>
                      <CardContent className="p-6">
                        <div className="flex items-center gap-2 text-gray-600 mb-4">
                          <MapPin className="w-4 h-4 text-emerald-500" />
                          {hotel.location}
                        </div>

                        <div className="flex flex-wrap gap-2 mb-4">
                          {hotel.amenities.map((amenity, i) => (
                            <Badge key={i} variant="outline" className="bg-emerald-50 border-emerald-200">
                              {amenity}
                            </Badge>
                          ))}
                        </div>

                        <div className="flex items-center justify-between pt-4 border-t">
                          <div>
                            <span className="text-gray-500 text-sm">From</span>
                            <p className="text-2xl font-bold text-emerald-600">{hotel.priceRange}</p>
                            <span className="text-gray-500 text-sm">per night</span>
                          </div>
                          <Button className="bg-emerald-600 hover:bg-emerald-700">
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
                <h2 className="text-3xl font-bold text-gray-800">Weather in Badulla</h2>
                <p className="text-gray-600 mt-2">Cool hill country climate - pleasant year-round</p>
              </div>

              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                <Card className="bg-gradient-to-br from-emerald-500 to-teal-600 text-white border-0">
                  <CardHeader>
                    <Thermometer className="w-12 h-12 mb-2" />
                    <CardTitle className="text-white">Temperature</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-4xl font-bold">{weatherInfo.temperature}</p>
                    <p className="text-white/80 mt-2">Cool hill country climate</p>
                  </CardContent>
                </Card>

                <Card className="bg-gradient-to-br from-cyan-500 to-blue-500 text-white border-0">
                  <CardHeader>
                    <Droplets className="w-12 h-12 mb-2" />
                    <CardTitle className="text-white">Humidity</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-4xl font-bold">{weatherInfo.humidity}</p>
                    <p className="text-white/80 mt-2">Mountain humidity levels</p>
                  </CardContent>
                </Card>

                <Card className="bg-gradient-to-br from-indigo-500 to-purple-500 text-white border-0">
                  <CardHeader>
                    <Umbrella className="w-12 h-12 mb-2" />
                    <CardTitle className="text-white">Rainfall</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-4xl font-bold">{weatherInfo.rainfall}</p>
                    <p className="text-white/80 mt-2">Oct-Nov peak rainfall</p>
                  </CardContent>
                </Card>

                <Card className="bg-gradient-to-br from-green-500 to-emerald-500 text-white border-0">
                  <CardHeader>
                    <Calendar className="w-12 h-12 mb-2" />
                    <CardTitle className="text-white">Best Months</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-4xl font-bold">{weatherInfo.bestMonths}</p>
                    <p className="text-white/80 mt-2">Dry season</p>
                  </CardContent>
                </Card>

                <Card className="bg-gradient-to-br from-teal-500 to-cyan-500 text-white border-0">
                  <CardHeader>
                    <Waves className="w-12 h-12 mb-2" />
                    <CardTitle className="text-white">Waterfall Pools</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-4xl font-bold">{weatherInfo.waterTemp}</p>
                    <p className="text-white/80 mt-2">Cool mountain water</p>
                  </CardContent>
                </Card>

                <Card className="bg-gradient-to-br from-amber-500 to-orange-500 text-white border-0">
                  <CardHeader>
                    <Sun className="w-12 h-12 mb-2" />
                    <CardTitle className="text-white">Climate Type</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-4xl font-bold">{weatherInfo.climate}</p>
                    <p className="text-white/80 mt-2">Mild year-round</p>
                  </CardContent>
                </Card>
              </div>
            </motion.div>
          )}

          {/* Map Tab */}
          {selectedTab === 'map' && (
            <div>
              <h2 className="text-3xl font-bold mb-8">Explore Badulla Map</h2>
              <div className="grid lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2">
                  <Card className="overflow-hidden h-[500px]">
                    <DestinationMap
                      destinationName="Badulla"
                      center={BADULLA_CENTER}
                      attractions={[
                        { name: 'Dunhinda Falls', description: 'Bridal veil waterfall', coordinates: { lat: 7.0200, lng: 81.0300 } },
                        { name: 'Muthiyangana Temple', description: 'Ancient Buddhist temple', coordinates: { lat: 6.9900, lng: 81.0550 } },
                        { name: 'Namunukula Mountain', description: 'Nine peaks mountain range', coordinates: { lat: 6.9500, lng: 81.0800 } },
                        { name: 'Bogoda Wooden Bridge', description: 'Ancient wooden bridge', coordinates: { lat: 6.9200, lng: 81.0400 } },
                        { name: 'Dhowa Rock Temple', description: 'Rock-cut Buddha statue', coordinates: { lat: 6.8800, lng: 81.0100 } }
                      ]}
                      height="500px"
                    />
                  </Card>
                </div>
                <div className="lg:col-span-1">
                  <WeatherWidget
                    locationName="Badulla"
                    latitude={BADULLA_CENTER.lat}
                    longitude={BADULLA_CENTER.lng}
                  />
                </div>
              </div>
            </div>
          )}

          {/* Travel Tips Tab */}
          {selectedTab === 'tips' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <div className="mb-8">
                <h2 className="text-3xl font-bold text-gray-800">Travel Tips for Badulla</h2>
                <p className="text-gray-600 mt-2">Essential advice for your hill country adventure</p>
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
                          <div className="bg-emerald-100 w-14 h-14 rounded-2xl flex items-center justify-center mb-4">
                            <IconComponent className="w-7 h-7 text-emerald-600" />
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
        <section className="bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-600 py-20">
          <div className="container mx-auto px-4 text-center text-white">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <Mountain className="w-16 h-16 mx-auto mb-6 opacity-80" />
              <h2 className="text-4xl md:text-5xl font-bold mb-4">{ctaSection.title}</h2>
              <p className="text-xl mb-8 max-w-2xl mx-auto text-white/90">
                {ctaSection.subtitle}
              </p>
              <div className="flex flex-wrap gap-4 justify-center">
                <Button
                  size="lg"
                  className="bg-white text-emerald-600 hover:bg-gray-100"
                  onClick={() => handleBooking()}
                >
                  <Train className="w-5 h-5 mr-2" />
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

      {/* WhatsApp Floating Button */}
      <a
        href="https://wa.me/94777721999?text=Hi! I'm interested in booking a Badulla tour."
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-6 right-6 z-50 bg-green-500 hover:bg-green-600 text-white p-4 rounded-full shadow-lg transition-all hover:scale-110"
        aria-label="Contact via WhatsApp"
      >
        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
        </svg>
      </a>

      <Footer />
    </>
  );
};

export default Badulla;
