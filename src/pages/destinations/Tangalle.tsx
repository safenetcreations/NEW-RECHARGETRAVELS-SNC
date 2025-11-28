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
  ShoppingBag,
  Turtle,
  Shell,
  Anchor,
  Activity
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
    image: "https://images.unsplash.com/photo-1506953823976-52e1fdc0149a?auto=format&fit=crop&q=80",
    title: "Discover Tangalle",
    subtitle: "Hidden Beach Paradise of Sri Lanka's Deep South"
  },
  {
    image: "https://images.unsplash.com/photo-1539367628448-4bc5c9d171c8?auto=format&fit=crop&q=80",
    title: "Pristine Beaches",
    subtitle: "Miles of Untouched Golden Sand"
  },
  {
    image: "https://images.unsplash.com/photo-1591025207163-942350e47db2?auto=format&fit=crop&q=80",
    title: "Sea Turtle Haven",
    subtitle: "Witness Nature's Ancient Mariners Nesting"
  }
];

const defaultAttractions: Attraction[] = [
  {
    name: "Rekawa Turtle Beach",
    description: "One of Sri Lanka's most important sea turtle nesting sites where all five species come ashore to lay eggs. Night watching tours offer unforgettable wildlife experiences.",
    image: "https://images.unsplash.com/photo-1591025207163-942350e47db2?auto=format&fit=crop&q=80",
    category: "Wildlife",
    rating: 4.9,
    duration: "3-4 hours",
    price: "$25",
    icon: "Turtle"
  },
  {
    name: "Hummanaya Blow Hole",
    description: "The second largest blow hole in the world, shooting water up to 25 meters high during high tide. A spectacular natural phenomenon especially during monsoon season.",
    image: "https://images.unsplash.com/photo-1559827260-dc66d52bef19?auto=format&fit=crop&q=80",
    category: "Natural Wonder",
    rating: 4.6,
    duration: "1-2 hours",
    price: "$2",
    icon: "Waves"
  },
  {
    name: "Silent Beach",
    description: "A secluded pristine beach known for its tranquility and natural beauty. Perfect for those seeking solitude with natural rock pools and dramatic coastal landscapes.",
    image: "https://images.unsplash.com/photo-1519046904884-53103b34b206?auto=format&fit=crop&q=80",
    category: "Beaches",
    rating: 4.8,
    duration: "Half Day",
    price: "Free",
    icon: "Shell"
  },
  {
    name: "Mulkirigala Rock Temple",
    description: "An ancient Buddhist temple complex built on a 205m high rock with caves containing reclining Buddha statues and murals dating back to the 3rd century BC.",
    image: "https://images.unsplash.com/photo-1609920658906-8223bd289001?auto=format&fit=crop&q=80",
    category: "Religious Sites",
    rating: 4.7,
    duration: "2-3 hours",
    price: "$3",
    icon: "Landmark"
  },
  {
    name: "Kalametiya Bird Sanctuary",
    description: "A coastal lagoon sanctuary home to over 150 bird species including rare migrants. Best visited early morning for bird watching and peaceful lagoon boat tours.",
    image: "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?auto=format&fit=crop&q=80",
    category: "Wildlife",
    rating: 4.5,
    duration: "3 hours",
    price: "$15",
    icon: "Bird"
  },
  {
    name: "Tangalle Beach",
    description: "A stunning stretch of golden sand with swaying palms, clear waters, and peaceful atmosphere. Perfect for swimming, sunbathing, and spectacular sunsets.",
    image: "https://images.unsplash.com/photo-1506953823976-52e1fdc0149a?auto=format&fit=crop&q=80",
    category: "Beaches",
    rating: 4.8,
    duration: "Full Day",
    price: "Free",
    icon: "Sun"
  }
];

const defaultActivities: Activity[] = [
  {
    name: "Turtle Night Watch",
    description: "Night tours to witness sea turtles coming ashore to lay eggs at Rekawa Beach conservation site",
    icon: "Turtle",
    price: "From $30",
    duration: "4 hours",
    difficulty: "Easy",
    popular: true
  },
  {
    name: "Lagoon Kayaking",
    description: "Paddle through peaceful lagoons and mangrove ecosystems spotting wildlife and birds",
    icon: "Activity",
    price: "From $25",
    duration: "2-3 hours",
    difficulty: "Easy",
    popular: true
  },
  {
    name: "Bird Watching Safari",
    description: "Early morning tours at Kalametiya sanctuary to spot exotic and migratory birds",
    icon: "Bird",
    price: "From $35",
    duration: "3 hours",
    difficulty: "Easy"
  },
  {
    name: "Fishing Village Tour",
    description: "Experience traditional stilt fishing methods and authentic southern coastal village life",
    icon: "Fish",
    price: "From $20",
    duration: "2 hours",
    difficulty: "Easy"
  },
  {
    name: "Beach Yoga & Wellness",
    description: "Sunrise and sunset yoga sessions on pristine beaches with ocean views",
    icon: "Sunrise",
    price: "From $15",
    duration: "1.5 hours",
    difficulty: "Easy"
  },
  {
    name: "Seafood Cooking Class",
    description: "Learn to prepare traditional southern Sri Lankan seafood dishes with local chefs",
    icon: "Utensils",
    price: "From $40",
    duration: "3 hours",
    difficulty: "Easy"
  }
];

const defaultRestaurants: Restaurant[] = [
  {
    name: "Anantara Peace Haven Restaurant",
    cuisine: "International & Sri Lankan",
    priceRange: "$$$$",
    rating: 4.8,
    image: "https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&q=80",
    specialty: "Fresh Lobster & Seafood",
    location: "Goyambokka"
  },
  {
    name: "Buckingham Place Restaurant",
    cuisine: "Seafood & International",
    priceRange: "$$$",
    rating: 4.6,
    image: "https://images.unsplash.com/photo-1552566626-52f8b828add9?auto=format&fit=crop&q=80",
    specialty: "Grilled Fish Platter",
    location: "Rekawa Beach"
  },
  {
    name: "Rest House Tangalle",
    cuisine: "Traditional Sri Lankan",
    priceRange: "$$",
    rating: 4.4,
    image: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&q=80",
    specialty: "Crab Curry",
    location: "Tangalle Town"
  },
  {
    name: "Seafood Hut",
    cuisine: "Fresh Seafood",
    priceRange: "$$",
    rating: 4.5,
    image: "https://images.unsplash.com/photo-1554118811-1e0d58224f24?auto=format&fit=crop&q=80",
    specialty: "BBQ Prawns",
    location: "Medaketiya Beach"
  }
];

const defaultHotels: HotelInfo[] = [
  {
    name: "Anantara Peace Haven Tangalle Resort",
    category: "5-Star Luxury",
    priceRange: "$$$$",
    rating: 4.9,
    image: "https://images.unsplash.com/photo-1582719508461-905c673771fd?auto=format&fit=crop&q=80",
    amenities: ["Private Beach", "Spa", "Infinity Pool", "Yoga Pavilion", "Water Sports"],
    location: "Goyambokka"
  },
  {
    name: "Buckingham Place",
    category: "Boutique Luxury",
    priceRange: "$$$",
    rating: 4.7,
    image: "https://images.unsplash.com/photo-1578683010236-d716f9a3f461?auto=format&fit=crop&q=80",
    amenities: ["Beachfront", "Pool", "Restaurant", "Turtle Tours"],
    location: "Rekawa"
  },
  {
    name: "Amanwella",
    category: "Ultra Luxury",
    priceRange: "$$$$",
    rating: 4.9,
    image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&q=80",
    amenities: ["Private Suites", "Infinity Pool", "Spa", "Fine Dining", "Butler Service"],
    location: "Godellawela"
  },
  {
    name: "Lagoon Paradise Beach Resort",
    category: "Mid-Range",
    priceRange: "$$",
    rating: 4.4,
    image: "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?auto=format&fit=crop&q=80",
    amenities: ["Beach Access", "Pool", "Restaurant", "Free WiFi", "Parking"],
    location: "Tangalle Beach"
  }
];

const defaultWeatherInfo: WeatherInfo = {
  temperature: "27-32°C",
  humidity: "75-85%",
  rainfall: "Low (Dec-Apr)",
  bestMonths: "December to April",
  climate: "Tropical Coastal",
  waterTemp: "27-29°C"
};

const defaultTravelTips: TravelTip[] = [
  {
    icon: "Turtle",
    title: "Turtle Watching",
    description: "Best season is January-April. Night tours start at 8 PM. Avoid full moon nights. No flash photography allowed - bring a red torch."
  },
  {
    icon: "Waves",
    title: "Beach Safety",
    description: "Strong currents at some beaches. Swim in designated areas. Calmest seas December-March. Silent Beach has natural pools."
  },
  {
    icon: "Sun",
    title: "Sun Protection",
    description: "Strong tropical sun year-round. Use reef-safe sunscreen, wear a hat, and stay hydrated. Best beach time is early morning or late afternoon."
  },
  {
    icon: "Camera",
    title: "Photography Tips",
    description: "Golden hour at Hummanaya Blow Hole is stunning. Bring waterproof gear. Best bird photography at dawn at Kalametiya."
  },
  {
    icon: "Luggage",
    title: "What to Pack",
    description: "Light cotton clothes, swimwear, insect repellent, binoculars for birding, water shoes for rocky beaches, and a light rain jacket."
  },
  {
    icon: "CreditCard",
    title: "Money Tips",
    description: "Cash preferred in small establishments. ATMs in Tangalle town. Most hotels accept cards. Tipping 10% is customary."
  }
];

const defaultSEOSettings: SEOSettings = {
  title: "Tangalle - Pristine Beaches & Turtle Watching Paradise | Sri Lanka",
  description: "Discover Tangalle's pristine beaches, turtle watching at Rekawa, Hummanaya blow hole, and hidden coastal gems. Sri Lanka's unspoiled beach paradise.",
  keywords: ["Tangalle Beach", "Turtle Watching Sri Lanka", "Rekawa Beach", "Hummanaya Blow Hole", "Silent Beach", "Sri Lanka Beaches"]
};

const defaultCTASection: CTASection = {
  title: "Ready to Discover Tangalle's Hidden Paradise?",
  subtitle: "From pristine beaches to turtle watching adventures, experience Sri Lanka's unspoiled southern coast",
  primaryButton: "Book Beach Getaway",
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
    'ShoppingBag': ShoppingBag,
    'Turtle': Turtle,
    'Shell': Shell,
    'Anchor': Anchor,
    'Activity': Activity
  };
  return iconMap[iconName] || Waves;
};

const Tangalle = () => {
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
    population: "11,000",
    area: "28 km²",
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
        const data = await getDestinationBySlug('tangalle');

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
        console.error('Error loading Tangalle content:', error);
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
        <link rel="canonical" href="https://rechargetravels.com/destinations/tangalle" />
      </Helmet>

      <Header />

      <div className="min-h-screen bg-gradient-to-b from-cyan-50 to-white">
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
                <Badge className="bg-cyan-500/90 text-white text-sm px-4 py-2">
                  <Turtle className="w-4 h-4 mr-2 inline" />
                  Hidden Beach Paradise
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
                  className="bg-cyan-500 hover:bg-cyan-600 text-white"
                  onClick={() => handleBookNow()}
                >
                  <Waves className="w-5 h-5 mr-2" />
                  Book Beach Getaway
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
                  currentSlide === index ? 'w-8 bg-cyan-400' : 'w-2 bg-white/50 hover:bg-white/80'
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
                <Users className="w-8 h-8 mx-auto mb-2 text-cyan-600" />
                <h3 className="font-semibold text-gray-800">Population</h3>
                <p className="text-gray-600 text-sm">{destinationInfo.population}</p>
              </div>
              <div className="text-center">
                <MapPin className="w-8 h-8 mx-auto mb-2 text-cyan-600" />
                <h3 className="font-semibold text-gray-800">Area</h3>
                <p className="text-gray-600 text-sm">{destinationInfo.area}</p>
              </div>
              <div className="text-center">
                <Waves className="w-8 h-8 mx-auto mb-2 text-cyan-600" />
                <h3 className="font-semibold text-gray-800">Elevation</h3>
                <p className="text-gray-600 text-sm">{destinationInfo.elevation}</p>
              </div>
              <div className="text-center">
                <Sun className="w-8 h-8 mx-auto mb-2 text-cyan-600" />
                <h3 className="font-semibold text-gray-800">Best Time</h3>
                <p className="text-gray-600 text-sm">{destinationInfo.bestTime}</p>
              </div>
              <div className="text-center">
                <Globe className="w-8 h-8 mx-auto mb-2 text-cyan-600" />
                <h3 className="font-semibold text-gray-800">Language</h3>
                <p className="text-gray-600 text-sm">{destinationInfo.language}</p>
              </div>
              <div className="text-center">
                <DollarSign className="w-8 h-8 mx-auto mb-2 text-cyan-600" />
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
                      ? 'bg-cyan-500 text-white shadow-lg'
                      : 'text-gray-600 hover:bg-cyan-100'
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
                  <h2 className="text-3xl font-bold text-gray-800">Top Attractions in Tangalle</h2>
                  <p className="text-gray-600 mt-2">Discover pristine beaches, turtle nesting sites, and natural wonders</p>
                </div>
              </div>

              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {attractions.map((attraction, index) => {
                  const IconComponent = getIconComponent(attraction.icon || 'Waves');
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
                          <Badge className="absolute top-4 right-4 bg-cyan-500 text-white">
                            {attraction.category}
                          </Badge>
                          <div className="absolute bottom-4 left-4 flex items-center gap-2">
                            <div className="bg-white/90 backdrop-blur-sm rounded-full p-2">
                              <IconComponent className="w-5 h-5 text-cyan-600" />
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
                            <span className="flex items-center gap-1 text-cyan-600 font-semibold">
                              {attraction.price}
                            </span>
                          </div>

                          <Button
                            className="w-full bg-cyan-500 hover:bg-cyan-600"
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
                <h2 className="text-3xl font-bold text-gray-800">Things to Do in Tangalle</h2>
                <p className="text-gray-600 mt-2">Turtle watching, kayaking, and coastal adventures</p>
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
                        activity.popular ? 'border-2 border-cyan-500 relative' : 'border-0 shadow-lg'
                      }`}>
                        {activity.popular && (
                          <div className="absolute -top-3 left-4 bg-cyan-500 text-white text-xs font-bold px-3 py-1 rounded-full">
                            MOST POPULAR
                          </div>
                        )}
                        <CardHeader className="pb-4">
                          <div className="flex items-center justify-between">
                            <div className="bg-cyan-100 p-4 rounded-2xl">
                              <IconComponent className="w-8 h-8 text-cyan-600" />
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
                            <span className="text-2xl font-bold text-cyan-600">{activity.price}</span>
                            <Button
                              className="bg-cyan-500 hover:bg-cyan-600"
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
                <h2 className="text-3xl font-bold text-gray-800">Where to Eat in Tangalle</h2>
                <p className="text-gray-600 mt-2">Fresh seafood and authentic southern Sri Lankan cuisine</p>
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
                            <Badge className="bg-cyan-100 text-cyan-700">{restaurant.priceRange}</Badge>
                          </div>
                          <p className="text-cyan-600 font-medium mb-2">{restaurant.cuisine}</p>
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
                          <Button variant="outline" className="border-cyan-500 text-cyan-600 hover:bg-cyan-50">
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
                <h2 className="text-3xl font-bold text-gray-800">Where to Stay in Tangalle</h2>
                <p className="text-gray-600 mt-2">Luxury beachfront resorts and boutique hotels</p>
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
                          <Badge className="bg-cyan-500 text-white mb-2">{hotel.category}</Badge>
                          <h3 className="text-2xl font-bold text-white">{hotel.name}</h3>
                        </div>
                        <div className="absolute top-4 right-4 bg-white rounded-full px-3 py-1 flex items-center gap-1">
                          <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                          <span className="font-bold text-gray-800">{hotel.rating}</span>
                        </div>
                      </div>
                      <CardContent className="p-6">
                        <div className="flex items-center gap-2 text-gray-600 mb-4">
                          <MapPin className="w-4 h-4 text-cyan-500" />
                          {hotel.location}
                        </div>

                        <div className="flex flex-wrap gap-2 mb-4">
                          {hotel.amenities.map((amenity, i) => (
                            <Badge key={i} variant="outline" className="bg-cyan-50 border-cyan-200">
                              {amenity}
                            </Badge>
                          ))}
                        </div>

                        <div className="flex items-center justify-between pt-4 border-t">
                          <div>
                            <span className="text-gray-500 text-sm">From</span>
                            <p className="text-2xl font-bold text-cyan-600">{hotel.priceRange}</p>
                            <span className="text-gray-500 text-sm">per night</span>
                          </div>
                          <Button className="bg-cyan-500 hover:bg-cyan-600">
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
                <h2 className="text-3xl font-bold text-gray-800">Weather in Tangalle</h2>
                <p className="text-gray-600 mt-2">Tropical coastal climate - warm and sunny year-round</p>
              </div>

              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                <Card className="bg-gradient-to-br from-cyan-400 to-teal-500 text-white border-0">
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
                    <p className="text-white/80 mt-2">Coastal humidity</p>
                  </CardContent>
                </Card>

                <Card className="bg-gradient-to-br from-indigo-400 to-purple-500 text-white border-0">
                  <CardHeader>
                    <Umbrella className="w-12 h-12 mb-2" />
                    <CardTitle className="text-white">Rainfall</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-4xl font-bold">{weatherInfo.rainfall}</p>
                    <p className="text-white/80 mt-2">Dry season best</p>
                  </CardContent>
                </Card>

                <Card className="bg-gradient-to-br from-green-400 to-emerald-500 text-white border-0">
                  <CardHeader>
                    <Calendar className="w-12 h-12 mb-2" />
                    <CardTitle className="text-white">Best Months</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-4xl font-bold">{weatherInfo.bestMonths}</p>
                    <p className="text-white/80 mt-2">Peak beach season</p>
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

                <Card className="bg-gradient-to-br from-amber-400 to-orange-500 text-white border-0">
                  <CardHeader>
                    <Sun className="w-12 h-12 mb-2" />
                    <CardTitle className="text-white">Climate Type</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-4xl font-bold">{weatherInfo.climate}</p>
                    <p className="text-white/80 mt-2">Sunny year-round</p>
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
                <h2 className="text-3xl font-bold text-gray-800">Travel Tips for Tangalle</h2>
                <p className="text-gray-600 mt-2">Essential advice for your beach paradise adventure</p>
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
                          <div className="bg-cyan-100 w-14 h-14 rounded-2xl flex items-center justify-center mb-4">
                            <IconComponent className="w-7 h-7 text-cyan-600" />
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
        <section className="bg-gradient-to-r from-cyan-500 via-teal-500 to-cyan-500 py-20">
          <div className="container mx-auto px-4 text-center text-white">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <Turtle className="w-16 h-16 mx-auto mb-6 opacity-80" />
              <h2 className="text-4xl md:text-5xl font-bold mb-4">{ctaSection.title}</h2>
              <p className="text-xl mb-8 max-w-2xl mx-auto text-white/90">
                {ctaSection.subtitle}
              </p>
              <div className="flex flex-wrap gap-4 justify-center">
                <Button
                  size="lg"
                  className="bg-white text-cyan-600 hover:bg-gray-100"
                  onClick={() => handleBookNow()}
                >
                  <Waves className="w-5 h-5 mr-2" />
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

export default Tangalle;
