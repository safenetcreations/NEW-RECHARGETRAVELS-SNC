import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { useNavigate } from 'react-router-dom';
import Header from '@/components/Header';
import RechargeFooter from '@/components/ui/RechargeFooter';
import { motion, AnimatePresence } from 'framer-motion';
import {
  MapPin, Calendar, Clock, Star, Users, ChevronLeft, ChevronRight,
  Utensils, Hotel, Cloud, Sun, Umbrella, Thermometer, Wind, Droplets,
  CheckCircle, Info, Phone, Car, Plane, Heart, Camera, DollarSign,
  Waves, Fish, Ship, Anchor, Activity, Bird, TreePalm, Shell,
  Building, Landmark, Mountain, Bike, Coffee, UtensilsCrossed,
  Wifi, ParkingCircle, AirVent, Dumbbell, Sparkles, Globe, Map
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import DestinationMap from '@/components/destinations/DestinationMap';
import WeatherWidget from '@/components/destinations/WeatherWidget';
import { getDestinationBySlug } from '@/services/destinationContentService';

const KALPITIYA_CENTER = { lat: 8.2333, lng: 79.7667 };

// Interfaces
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
  icon: string;
  duration: string;
  highlights: string[];
}

interface Activity {
  id: string;
  name: string;
  description: string;
  icon: string;
  duration: string;
  price: string;
  difficulty: string;
}

interface Restaurant {
  id: string;
  name: string;
  cuisine: string;
  priceRange: string;
  rating: number;
  image: string;
  description: string;
  specialties: string[];
}

interface HotelInfo {
  id: string;
  name: string;
  category: string;
  priceRange: string;
  rating: number;
  image: string;
  description: string;
  amenities: string[];
}

interface DestinationInfo {
  population: string;
  elevation: string;
  bestTime: string;
  language: string;
}

interface WeatherInfo {
  season: string;
  temperature: string;
  rainfall: string;
  humidity: string;
  bestMonths: string[];
  packingTips: string[];
}

interface TravelTip {
  id: string;
  category: string;
  icon: string;
  title: string;
  description: string;
}

interface SEOSettings {
  metaTitle: string;
  metaDescription: string;
  keywords: string;
}

interface CTASection {
  title: string;
  subtitle: string;
  buttonText: string;
}

const Kalpitiya = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [selectedTab, setSelectedTab] = useState('attractions');

  // Content state with defaults
  const [heroSlides, setHeroSlides] = useState<HeroSlide[]>([
    {
      id: '1',
      image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80',
      title: 'Discover Kalpitiya',
      subtitle: 'Wind Sports Capital'
    },
    {
      id: '2',
      image: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&q=80',
      title: 'Kitesurfing Paradise',
      subtitle: 'World-Class Wind Conditions'
    },
    {
      id: '3',
      image: 'https://images.unsplash.com/photo-1559827291-72ee739d0d9a?auto=format&fit=crop&q=80',
      title: 'Dolphin Watching',
      subtitle: 'Spinner Dolphins at Dawn'
    },
    {
      id: '4',
      image: 'https://images.unsplash.com/photo-1583212292454-1fe6229603b7?auto=format&fit=crop&q=80',
      title: 'Bar Reef',
      subtitle: 'Premier Diving Destination'
    },
    {
      id: '5',
      image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&q=80',
      title: 'Lagoon Islands',
      subtitle: 'Pristine Island Escapes'
    }
  ]);

  const [attractions, setAttractions] = useState<Attraction[]>([
    {
      id: '1',
      name: 'Dolphin Watching',
      description: 'Witness hundreds of spinner dolphins in their natural habitat with one of the largest dolphin populations in the world.',
      image: 'https://images.unsplash.com/photo-1607153333879-c174d265f1d2?auto=format&fit=crop&q=80',
      icon: 'Fish',
      duration: '3-4 hours',
      highlights: ['Spinner Dolphins', 'Large Pods', 'Morning Tours', '98% Success Rate']
    },
    {
      id: '2',
      name: 'Bar Reef Marine Sanctuary',
      description: "Sri Lanka's largest coral reef system stretching 3km offshore with over 150 species of fish and pristine coral formations.",
      image: 'https://images.unsplash.com/photo-1583212292454-1fe6229603b7?auto=format&fit=crop&q=80',
      icon: 'Waves',
      duration: 'Half day',
      highlights: ['Coral Gardens', '156 Fish Species', 'Snorkeling', 'Glass Bottom Boats']
    },
    {
      id: '3',
      name: 'Kalpitiya Lagoon',
      description: 'A vast lagoon system perfect for kitesurfing with flat water conditions and consistent winds ideal for all skill levels.',
      image: 'https://images.unsplash.com/photo-1527004013197-933c4bb611b3?auto=format&fit=crop&q=80',
      icon: 'Wind',
      duration: 'Flexible',
      highlights: ['Flat Water', 'Consistent Wind', 'Kite Schools', 'Equipment Rental']
    },
    {
      id: '4',
      name: 'Dutch Bay Islands',
      description: 'A cluster of 14 small islands offering pristine beaches, mangrove forests, and traditional fishing villages.',
      image: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?auto=format&fit=crop&q=80',
      icon: 'TreePalm',
      duration: 'Full day',
      highlights: ['14 Islands', 'Pristine Beaches', 'Fishing Villages', 'Mangroves']
    },
    {
      id: '5',
      name: "St. Anne's Church",
      description: 'Historic Catholic church on Talawila beach, famous for its annual feast in March/July attracting thousands of pilgrims.',
      image: 'https://images.unsplash.com/photo-1548625149-fc4a29cf7092?auto=format&fit=crop&q=80',
      icon: 'Building',
      duration: '1-2 hours',
      highlights: ['Historic Church', 'Beach Location', 'Annual Feast', 'Pilgrimage Site']
    },
    {
      id: '6',
      name: 'Wilpattu National Park',
      description: "Sri Lanka's largest national park just 1 hour from Kalpitiya, home to leopards, elephants, and sloth bears.",
      image: 'https://images.unsplash.com/photo-1549366021-9f761d450615?auto=format&fit=crop&q=80',
      icon: 'Mountain',
      duration: 'Half/Full day',
      highlights: ['Leopards', 'Elephants', 'Natural Lakes', 'Bird Watching']
    }
  ]);

  const [activities, setActivities] = useState<Activity[]>([
    {
      id: '1',
      name: 'Kitesurfing',
      description: 'Learn or perfect your kitesurfing skills in ideal flat water conditions with consistent winds',
      icon: 'Wind',
      duration: '2-3 hours',
      price: 'From $60',
      difficulty: 'All Levels'
    },
    {
      id: '2',
      name: 'Dolphin & Whale Watching',
      description: 'Early morning boat trips to see spinner dolphins and occasional whale sightings',
      icon: 'Fish',
      duration: '3-4 hours',
      price: 'From $35',
      difficulty: 'Easy'
    },
    {
      id: '3',
      name: 'Snorkeling at Bar Reef',
      description: "Explore Sri Lanka's largest coral reef system with diverse marine life",
      icon: 'Waves',
      duration: 'Half day',
      price: 'From $45',
      difficulty: 'Easy'
    },
    {
      id: '4',
      name: 'Island Hopping',
      description: 'Visit multiple islands by traditional boat and explore pristine beaches',
      icon: 'Ship',
      duration: 'Full day',
      price: 'From $50',
      difficulty: 'Easy'
    },
    {
      id: '5',
      name: 'Mangrove Kayaking',
      description: 'Paddle through pristine mangrove forests and spot exotic birds',
      icon: 'Anchor',
      duration: '2-3 hours',
      price: 'From $25',
      difficulty: 'Easy'
    },
    {
      id: '6',
      name: 'Stand-Up Paddleboarding',
      description: 'SUP in calm lagoon waters perfect for beginners and sunset sessions',
      icon: 'Activity',
      duration: '1-2 hours',
      price: 'From $20',
      difficulty: 'Easy'
    }
  ]);

  const [restaurants, setRestaurants] = useState<Restaurant[]>([
    {
      id: '1',
      name: 'Palagama Beach Restaurant',
      cuisine: 'Seafood & Sri Lankan',
      priceRange: '$$',
      rating: 4.6,
      image: 'https://images.unsplash.com/photo-1514933651103-005eec06c04b?auto=format&fit=crop&q=80',
      description: 'Beachfront dining with fresh catch of the day and traditional Sri Lankan seafood preparations.',
      specialties: ['Grilled Lobster', 'Prawn Curry', 'Lagoon Crab', 'Beach BBQ']
    },
    {
      id: '2',
      name: 'Kite Lagoon Cafe',
      cuisine: 'International & Fusion',
      priceRange: '$$',
      rating: 4.5,
      image: 'https://images.unsplash.com/photo-1552566626-52f8b828add9?auto=format&fit=crop&q=80',
      description: 'Popular hangout for kitesurfers serving healthy bowls, smoothies and international cuisine.',
      specialties: ['Acai Bowls', 'Fresh Juices', 'Grilled Fish Tacos', 'Pasta']
    },
    {
      id: '3',
      name: 'Dolphin Beach Grill',
      cuisine: 'Seafood & BBQ',
      priceRange: '$',
      rating: 4.4,
      image: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&q=80',
      description: 'Casual beachside grill serving fresh grilled seafood and Sri Lankan rice and curry.',
      specialties: ['Grilled Seer Fish', 'Rice & Curry', 'Deviled Prawns', 'Kottu']
    },
    {
      id: '4',
      name: 'Margarita Village',
      cuisine: 'Mexican & Seafood',
      priceRange: '$$',
      rating: 4.5,
      image: 'https://images.unsplash.com/photo-1466978913421-dad2ebd01d17?auto=format&fit=crop&q=80',
      description: 'Colorful beachfront restaurant with Mexican-inspired dishes and cocktails at sunset.',
      specialties: ['Fish Tacos', 'Ceviche', 'Margaritas', 'Seafood Platter']
    }
  ]);

  const [hotels, setHotels] = useState<HotelInfo[]>([
    {
      id: '1',
      name: 'Dolphin Beach Resort',
      category: 'Boutique Resort',
      priceRange: '$$$',
      rating: 4.7,
      image: 'https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?auto=format&fit=crop&q=80',
      description: 'Beachfront resort with direct lagoon access, perfect for kitesurfers and marine enthusiasts.',
      amenities: ['Beachfront', 'Kite Storage', 'Pool', 'Restaurant', 'Boat Tours']
    },
    {
      id: '2',
      name: 'Kalpitiya Kite Resort',
      category: 'Kite Resort',
      priceRange: '$$$',
      rating: 4.8,
      image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&q=80',
      description: 'Dedicated kitesurfing resort with on-site school, equipment rental, and rescue boat services.',
      amenities: ['Kite School', 'Equipment Rental', 'Flat Water Access', 'Beach Bar', 'WiFi']
    },
    {
      id: '3',
      name: 'Bar Reef Resort',
      category: 'Eco Resort',
      priceRange: '$$',
      rating: 4.5,
      image: 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?auto=format&fit=crop&q=80',
      description: 'Eco-friendly resort near Bar Reef with snorkeling trips and sustainable practices.',
      amenities: ['Snorkel Trips', 'Eco-Friendly', 'Restaurant', 'Garden', 'Tours']
    },
    {
      id: '4',
      name: 'Alankuda Beach Cabanas',
      category: 'Budget Cabanas',
      priceRange: '$',
      rating: 4.3,
      image: 'https://images.unsplash.com/photo-1596178065887-1198b6148b2b?auto=format&fit=crop&q=80',
      description: 'Simple beachfront cabanas with authentic local experience and homemade seafood meals.',
      amenities: ['Beachfront', 'Home Cooking', 'Fishing Trips', 'Bike Rental']
    }
  ]);

  const [destinationInfo, setDestinationInfo] = useState<DestinationInfo>({
    population: '70,000',
    elevation: 'Sea Level',
    bestTime: 'May - October',
    language: 'Tamil, Sinhala'
  });

  const [weatherInfo, setWeatherInfo] = useState<WeatherInfo>({
    season: 'Tropical Coastal',
    temperature: '26-32°C',
    rainfall: 'Low (Dry Zone)',
    humidity: '70-80%',
    bestMonths: ['May', 'June', 'July', 'August', 'September', 'October'],
    packingTips: ['Reef-safe sunscreen', 'Rash guard', 'Water shoes', 'Waterproof phone case', 'Light quick-dry clothing', 'Insect repellent']
  });

  const [travelTips, setTravelTips] = useState<TravelTip[]>([
    {
      id: '1',
      category: 'Best Time',
      icon: 'Calendar',
      title: 'Wind Seasons',
      description: 'May-October: Strong SW monsoon winds (advanced). Dec-March: Lighter NE winds (beginners). Dolphins year-round.'
    },
    {
      id: '2',
      category: 'Getting There',
      icon: 'Car',
      title: 'Transportation',
      description: '170km from Colombo (3-3.5 hours). Private transfer recommended. Route via Negombo and Chilaw.'
    },
    {
      id: '3',
      category: 'Water Sports',
      icon: 'Wind',
      title: 'Kitesurfing Tips',
      description: 'Book lessons in advance during peak season. IKO-certified schools available. Shallow lagoon ideal for learning.'
    },
    {
      id: '4',
      category: 'Marine Life',
      icon: 'Fish',
      title: 'Dolphin Watching',
      description: 'Best time 6-9 AM when dolphins are most active. 98% sighting success rate. Boats depart daily, weather permitting.'
    },
    {
      id: '5',
      category: 'Safety',
      icon: 'Info',
      title: 'Water Safety',
      description: 'Always use provided safety equipment. Stay hydrated during activities. Respect local fishing areas.'
    },
    {
      id: '6',
      category: 'Culture',
      icon: 'Heart',
      title: 'Local Culture',
      description: 'Traditional fishing community. Visit morning fish markets. St. Anne\'s feast in March/July attracts pilgrims.'
    }
  ]);

  const [seoSettings, setSeoSettings] = useState<SEOSettings>({
    metaTitle: 'Kalpitiya Sri Lanka - Kitesurfing, Dolphin Watching & Beach Tours | Recharge Travels',
    metaDescription: "Experience Kalpitiya, Sri Lanka's kitesurfing paradise. Book dolphin watching tours, kitesurfing lessons, and island hopping adventures with Recharge Travels.",
    keywords: 'Kalpitiya kitesurfing, dolphin watching Sri Lanka, Bar Reef snorkeling, Kalpitiya water sports, island hopping'
  });

  const [ctaSection, setCtaSection] = useState<CTASection>({
    title: 'Ready to Ride the Wind and Waves?',
    subtitle: 'Experience world-class kitesurfing, dolphin encounters, and island adventures in Kalpitiya',
    buttonText: 'Book Your Adventure'
  });

  // Icon mapping function
  const getIconComponent = (iconName: string) => {
    const iconMap: { [key: string]: any } = {
      'MapPin': MapPin,
      'Calendar': Calendar,
      'Clock': Clock,
      'Star': Star,
      'Users': Users,
      'Utensils': Utensils,
      'Hotel': Hotel,
      'Cloud': Cloud,
      'Sun': Sun,
      'Umbrella': Umbrella,
      'Thermometer': Thermometer,
      'Wind': Wind,
      'Droplets': Droplets,
      'CheckCircle': CheckCircle,
      'Info': Info,
      'Phone': Phone,
      'Car': Car,
      'Plane': Plane,
      'Heart': Heart,
      'Camera': Camera,
      'DollarSign': DollarSign,
      'Waves': Waves,
      'Fish': Fish,
      'Ship': Ship,
      'Anchor': Anchor,
      'Activity': Activity,
      'Bird': Bird,
      'TreePalm': TreePalm,
      'Shell': Shell,
      'Building': Building,
      'Landmark': Landmark,
      'Mountain': Mountain,
      'Bike': Bike,
      'Coffee': Coffee,
      'UtensilsCrossed': UtensilsCrossed,
      'Wifi': Wifi,
      'ParkingCircle': ParkingCircle,
      'AirVent': AirVent,
      'Dumbbell': Dumbbell,
      'Sparkles': Sparkles,
      'Globe': Globe,
      'Map': Map
    };
    return iconMap[iconName] || Waves;
  };

  // Load content from Firebase
  useEffect(() => {
    const loadContent = async () => {
      try {
        const data = await getDestinationBySlug('kalpitiya');
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
        console.error('Error loading Kalpitiya content:', error);
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
    }, 5000);
    return () => clearInterval(timer);
  }, [heroSlides.length]);

  const nextSlide = () => setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
  const prevSlide = () => setCurrentSlide((prev) => (prev - 1 + heroSlides.length) % heroSlides.length);

  const handleBooking = (service: string = 'Kalpitiya Tour', tourData?: { id: string; name: string; description: string; duration: string; price: number; features: string[]; image?: string }) => {
    const params = new URLSearchParams({
      title: tourData?.name || service,
      id: tourData?.id || service.toLowerCase().replace(/\s+/g, '-'),
      duration: tourData?.duration || 'Full Day',
      price: String(tourData?.price || 65),
      image: tourData?.image || 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=800',
      subtitle: `Kalpitiya - ${tourData?.name || service}`
    });
    navigate(`/book-tour?${params.toString()}`);
  };

  const tabs = [
    { id: 'attractions', label: 'Attractions', count: attractions.length },
    { id: 'activities', label: 'Activities', count: activities.length },
    { id: 'dining', label: 'Dining', count: restaurants.length },
    { id: 'stay', label: 'Stay', count: hotels.length },
    { id: 'weather', label: 'Weather', count: null },
    { id: 'tips', label: 'Travel Tips', count: travelTips.length },
    { id: 'map', label: 'Map', count: null }
  ];

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-cyan-50 to-blue-100">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-cyan-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-cyan-800 font-medium">Loading Kalpitiya...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>{seoSettings.metaTitle}</title>
        <meta name="description" content={seoSettings.metaDescription} />
        <meta name="keywords" content={seoSettings.keywords} />
        <meta property="og:title" content={seoSettings.metaTitle} />
        <meta property="og:description" content={seoSettings.metaDescription} />
        <meta property="og:image" content={heroSlides[0]?.image} />
        <link rel="canonical" href="https://www.rechargetravels.com/destinations/kalpitiya" />
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
              transition={{ duration: 0.7 }}
              className="absolute inset-0"
            >
              <div
                className="absolute inset-0 bg-cover bg-center"
                style={{ backgroundImage: `url(${heroSlides[currentSlide]?.image})` }}
              />
              <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/70" />
            </motion.div>
          </AnimatePresence>

          {/* Hero Content */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center text-white px-4 max-w-5xl">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="mb-4"
              >
                <Badge className="bg-cyan-500/80 text-white px-4 py-1 text-sm">
                  <Wind className="w-4 h-4 mr-2 inline" />
                  Kitesurfing Capital of Sri Lanka
                </Badge>
              </motion.div>
              <motion.h1
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="text-5xl md:text-7xl font-bold mb-4"
              >
                {heroSlides[currentSlide]?.title}
              </motion.h1>
              <motion.p
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="text-xl md:text-2xl mb-8 text-white/90"
              >
                {heroSlides[currentSlide]?.subtitle}
              </motion.p>
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className="flex gap-4 justify-center flex-wrap"
              >
                <Button
                  size="lg"
                  className="bg-cyan-600 hover:bg-cyan-700 text-white px-8"
                  onClick={() => handleBooking('Kalpitiya Adventure Package')}
                >
                  Book Your Adventure
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="border-white text-white hover:bg-white/20 px-8"
                  onClick={() => document.getElementById('attractions')?.scrollIntoView({ behavior: 'smooth' })}
                >
                  Explore Kalpitiya
                </Button>
              </motion.div>
            </div>
          </div>

          {/* Navigation Arrows */}
          <button
            onClick={prevSlide}
            className="absolute left-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-white/20 hover:bg-white/40 text-white transition-all backdrop-blur-sm"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
          <button
            onClick={nextSlide}
            className="absolute right-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-white/20 hover:bg-white/40 text-white transition-all backdrop-blur-sm"
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
                  index === currentSlide ? 'w-8 bg-cyan-400' : 'w-2 bg-white/50'
                }`}
              />
            ))}
          </div>
        </section>

        {/* Quick Info Bar */}
        <section className="bg-gradient-to-r from-cyan-600 to-blue-600 text-white py-6 shadow-lg">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              <div className="flex items-center gap-3 justify-center">
                <div className="p-2 bg-white/20 rounded-lg">
                  <Wind className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-white/70 text-xs">Wind Season</p>
                  <p className="font-semibold">May - October</p>
                </div>
              </div>
              <div className="flex items-center gap-3 justify-center">
                <div className="p-2 bg-white/20 rounded-lg">
                  <Fish className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-white/70 text-xs">Dolphins</p>
                  <p className="font-semibold">Year-round</p>
                </div>
              </div>
              <div className="flex items-center gap-3 justify-center">
                <div className="p-2 bg-white/20 rounded-lg">
                  <Thermometer className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-white/70 text-xs">Temperature</p>
                  <p className="font-semibold">{weatherInfo.temperature}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 justify-center">
                <div className="p-2 bg-white/20 rounded-lg">
                  <Car className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-white/70 text-xs">From Colombo</p>
                  <p className="font-semibold">3-3.5 Hours</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Tab Navigation */}
        <nav className="sticky top-0 z-40 bg-white border-b shadow-sm">
          <div className="container mx-auto px-4">
            <div className="flex overflow-x-auto scrollbar-hide">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setSelectedTab(tab.id)}
                  className={`px-6 py-4 font-medium whitespace-nowrap transition-all border-b-2 ${
                    selectedTab === tab.id
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

        {/* Tab Content */}
        <div id="attractions" className="container mx-auto px-4 py-12">
          <AnimatePresence mode="wait">
            {/* Attractions Tab */}
            {selectedTab === 'attractions' && (
              <motion.div
                key="attractions"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
              >
                <div className="text-center mb-12">
                  <h2 className="text-4xl font-bold text-gray-900 mb-4">Top Attractions in Kalpitiya</h2>
                  <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                    Discover marine wonders, pristine islands, and wildlife adventures
                  </p>
                </div>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {attractions.map((attraction) => {
                    const IconComponent = getIconComponent(attraction.icon);
                    return (
                      <Card key={attraction.id} className="group overflow-hidden hover:shadow-xl transition-all duration-300">
                        <div className="relative h-56 overflow-hidden">
                          <img
                            src={attraction.image}
                            alt={attraction.name}
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                          />
                          <div className="absolute top-4 left-4">
                            <Badge className="bg-cyan-600 text-white">
                              <IconComponent className="w-3 h-3 mr-1" />
                              {attraction.duration}
                            </Badge>
                          </div>
                        </div>
                        <CardHeader>
                          <CardTitle className="text-xl text-gray-900">{attraction.name}</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <p className="text-gray-600 mb-4">{attraction.description}</p>
                          <div className="flex flex-wrap gap-2 mb-4">
                            {attraction.highlights.map((highlight, idx) => (
                              <Badge key={idx} variant="outline" className="text-xs border-cyan-200 text-cyan-700">
                                {highlight}
                              </Badge>
                            ))}
                          </div>
                          <Button
                            className="w-full bg-cyan-600 hover:bg-cyan-700"
                            onClick={() => handleBooking(attraction.name)}
                          >
                            Book Experience
                          </Button>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              </motion.div>
            )}

            {/* Activities Tab */}
            {selectedTab === 'activities' && (
              <motion.div
                key="activities"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
              >
                <div className="text-center mb-12">
                  <h2 className="text-4xl font-bold text-gray-900 mb-4">Things to Do in Kalpitiya</h2>
                  <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                    Water sports, marine adventures, and island exploration await
                  </p>
                </div>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {activities.map((activity) => {
                    const IconComponent = getIconComponent(activity.icon);
                    return (
                      <Card key={activity.id} className="hover:shadow-lg transition-shadow">
                        <CardHeader>
                          <div className="flex items-start gap-4">
                            <div className="p-3 bg-cyan-100 rounded-xl">
                              <IconComponent className="w-6 h-6 text-cyan-600" />
                            </div>
                            <div className="flex-1">
                              <CardTitle className="text-lg">{activity.name}</CardTitle>
                              <Badge variant="outline" className="mt-1 text-xs">
                                {activity.difficulty}
                              </Badge>
                            </div>
                          </div>
                        </CardHeader>
                        <CardContent>
                          <p className="text-gray-600 mb-4">{activity.description}</p>
                          <div className="flex justify-between items-center mb-4">
                            <div className="flex items-center text-gray-500">
                              <Clock className="w-4 h-4 mr-1" />
                              <span className="text-sm">{activity.duration}</span>
                            </div>
                            <span className="font-semibold text-cyan-600">{activity.price}</span>
                          </div>
                          <Button
                            variant="outline"
                            className="w-full border-cyan-600 text-cyan-600 hover:bg-cyan-600 hover:text-white"
                            onClick={() => handleBooking(activity.name)}
                          >
                            Book Activity
                          </Button>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              </motion.div>
            )}

            {/* Dining Tab */}
            {selectedTab === 'dining' && (
              <motion.div
                key="dining"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
              >
                <div className="text-center mb-12">
                  <h2 className="text-4xl font-bold text-gray-900 mb-4">Where to Eat in Kalpitiya</h2>
                  <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                    Fresh seafood and beachfront dining experiences
                  </p>
                </div>
                <div className="grid md:grid-cols-2 gap-8">
                  {restaurants.map((restaurant) => (
                    <Card key={restaurant.id} className="overflow-hidden hover:shadow-xl transition-shadow">
                      <div className="md:flex">
                        <div className="md:w-2/5 h-48 md:h-auto">
                          <img
                            src={restaurant.image}
                            alt={restaurant.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="md:w-3/5 p-6">
                          <div className="flex justify-between items-start mb-2">
                            <h3 className="text-xl font-bold text-gray-900">{restaurant.name}</h3>
                            <Badge className="bg-cyan-100 text-cyan-700">{restaurant.priceRange}</Badge>
                          </div>
                          <p className="text-cyan-600 text-sm mb-2">{restaurant.cuisine}</p>
                          <div className="flex items-center mb-3">
                            <Star className="w-4 h-4 text-yellow-500 fill-current" />
                            <span className="ml-1 text-sm font-medium">{restaurant.rating}</span>
                          </div>
                          <p className="text-gray-600 text-sm mb-3">{restaurant.description}</p>
                          <div className="flex flex-wrap gap-1">
                            {restaurant.specialties.map((specialty, idx) => (
                              <Badge key={idx} variant="outline" className="text-xs">
                                {specialty}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Stay Tab */}
            {selectedTab === 'stay' && (
              <motion.div
                key="stay"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
              >
                <div className="text-center mb-12">
                  <h2 className="text-4xl font-bold text-gray-900 mb-4">Where to Stay in Kalpitiya</h2>
                  <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                    From kite resorts to beachfront cabanas
                  </p>
                </div>
                <div className="grid md:grid-cols-2 gap-8">
                  {hotels.map((hotel) => (
                    <Card key={hotel.id} className="overflow-hidden hover:shadow-xl transition-shadow">
                      <div className="relative h-56">
                        <img
                          src={hotel.image}
                          alt={hotel.name}
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute top-4 right-4">
                          <Badge className="bg-white text-cyan-700">{hotel.priceRange}</Badge>
                        </div>
                        <div className="absolute bottom-4 left-4">
                          <Badge className="bg-cyan-600 text-white">{hotel.category}</Badge>
                        </div>
                      </div>
                      <CardHeader>
                        <div className="flex justify-between items-start">
                          <CardTitle className="text-xl">{hotel.name}</CardTitle>
                          <div className="flex items-center">
                            <Star className="w-4 h-4 text-yellow-500 fill-current" />
                            <span className="ml-1 font-medium">{hotel.rating}</span>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <p className="text-gray-600 mb-4">{hotel.description}</p>
                        <div className="flex flex-wrap gap-2 mb-4">
                          {hotel.amenities.map((amenity, idx) => (
                            <Badge key={idx} variant="outline" className="text-xs border-cyan-200">
                              {amenity}
                            </Badge>
                          ))}
                        </div>
                        <Button
                          className="w-full bg-cyan-600 hover:bg-cyan-700"
                          onClick={() => handleBooking(`${hotel.name} Booking`)}
                        >
                          Check Availability
                        </Button>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Weather Tab */}
            {selectedTab === 'weather' && (
              <motion.div
                key="weather"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
              >
                <div className="text-center mb-12">
                  <h2 className="text-4xl font-bold text-gray-900 mb-4">Kalpitiya Weather & Climate</h2>
                  <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                    Plan your visit around the wind seasons
                  </p>
                </div>
                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
                  <Card className="text-center p-6 bg-gradient-to-br from-cyan-50 to-blue-50">
                    <Thermometer className="w-12 h-12 text-cyan-600 mx-auto mb-4" />
                    <h3 className="font-semibold text-gray-900 mb-2">Temperature</h3>
                    <p className="text-2xl font-bold text-cyan-600">{weatherInfo.temperature}</p>
                    <p className="text-sm text-gray-500 mt-1">Year-round warm</p>
                  </Card>
                  <Card className="text-center p-6 bg-gradient-to-br from-cyan-50 to-blue-50">
                    <Droplets className="w-12 h-12 text-blue-600 mx-auto mb-4" />
                    <h3 className="font-semibold text-gray-900 mb-2">Humidity</h3>
                    <p className="text-2xl font-bold text-blue-600">{weatherInfo.humidity}</p>
                    <p className="text-sm text-gray-500 mt-1">Tropical coastal</p>
                  </Card>
                  <Card className="text-center p-6 bg-gradient-to-br from-cyan-50 to-blue-50">
                    <Umbrella className="w-12 h-12 text-cyan-600 mx-auto mb-4" />
                    <h3 className="font-semibold text-gray-900 mb-2">Rainfall</h3>
                    <p className="text-2xl font-bold text-cyan-600">{weatherInfo.rainfall}</p>
                    <p className="text-sm text-gray-500 mt-1">Dry zone climate</p>
                  </Card>
                  <Card className="text-center p-6 bg-gradient-to-br from-cyan-50 to-blue-50">
                    <Wind className="w-12 h-12 text-blue-600 mx-auto mb-4" />
                    <h3 className="font-semibold text-gray-900 mb-2">Best Months</h3>
                    <p className="text-lg font-bold text-blue-600">May - Oct</p>
                    <p className="text-sm text-gray-500 mt-1">Peak wind season</p>
                  </Card>
                </div>

                <div className="grid md:grid-cols-2 gap-8">
                  <Card className="p-6">
                    <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                      <Calendar className="w-5 h-5 mr-2 text-cyan-600" />
                      Best Months to Visit
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {weatherInfo.bestMonths.map((month, idx) => (
                        <Badge key={idx} className="bg-cyan-600 text-white px-4 py-2">
                          {month}
                        </Badge>
                      ))}
                    </div>
                    <p className="text-gray-600 mt-4 text-sm">
                      May-October offers strong SW monsoon winds ideal for advanced kitesurfing.
                      December-March brings lighter NE winds perfect for beginners.
                    </p>
                  </Card>
                  <Card className="p-6">
                    <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                      <CheckCircle className="w-5 h-5 mr-2 text-cyan-600" />
                      Packing Tips
                    </h3>
                    <ul className="space-y-2">
                      {weatherInfo.packingTips.map((tip, idx) => (
                        <li key={idx} className="flex items-center text-gray-600">
                          <CheckCircle className="w-4 h-4 mr-2 text-cyan-500" />
                          {tip}
                        </li>
                      ))}
                    </ul>
                  </Card>
                </div>
              </motion.div>
            )}

            {/* Travel Tips Tab */}
            {selectedTab === 'tips' && (
              <motion.div
                key="tips"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
              >
                <div className="text-center mb-12">
                  <h2 className="text-4xl font-bold text-gray-900 mb-4">Kalpitiya Travel Tips</h2>
                  <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                    Essential information for planning your Kalpitiya adventure
                  </p>
                </div>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {travelTips.map((tip) => {
                    const IconComponent = getIconComponent(tip.icon);
                    return (
                      <Card key={tip.id} className="p-6 hover:shadow-lg transition-shadow">
                        <div className="flex items-start gap-4">
                          <div className="p-3 bg-cyan-100 rounded-xl">
                            <IconComponent className="w-6 h-6 text-cyan-600" />
                          </div>
                          <div>
                            <Badge variant="outline" className="mb-2 text-xs border-cyan-200 text-cyan-700">
                              {tip.category}
                            </Badge>
                            <h3 className="font-semibold text-gray-900 mb-2">{tip.title}</h3>
                            <p className="text-gray-600 text-sm">{tip.description}</p>
                          </div>
                        </div>
                      </Card>
                    );
                  })}
                </div>
              </motion.div>
            )}

            {/* Map Tab */}
            {selectedTab === 'map' && (
              <motion.div
                key="map"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
              >
                <div className="text-center mb-12">
                  <h2 className="text-4xl font-bold text-gray-900 mb-4">Explore Kalpitiya Map</h2>
                  <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                    Discover key attractions and plan your journey
                  </p>
                </div>
                <div className="grid lg:grid-cols-3 gap-8">
                  <div className="lg:col-span-2">
                    <Card className="overflow-hidden h-[500px]">
                      <DestinationMap
                        destinationName="Kalpitiya"
                        center={KALPITIYA_CENTER}
                        attractions={[
                          { name: 'Kalpitiya Lagoon', description: 'Famous for dolphin watching', coordinates: { lat: 8.2333, lng: 79.7667 } },
                          { name: 'Bar Reef', description: 'Sri Lanka\'s largest coral reef', coordinates: { lat: 8.4000, lng: 79.7500 } },
                          { name: 'Dutch Fort', description: 'Colonial era fortress', coordinates: { lat: 8.2300, lng: 79.7600 } },
                          { name: 'Alankuda Beach', description: 'Pristine sandy beach', coordinates: { lat: 8.2500, lng: 79.7400 } },
                          { name: 'Wilpattu National Park', description: 'Nearby wildlife sanctuary', coordinates: { lat: 8.4500, lng: 80.0000 } }
                        ]}
                        height="500px"
                      />
                    </Card>
                  </div>
                  <div className="lg:col-span-1">
                    <WeatherWidget
                      locationName="Kalpitiya"
                      latitude={KALPITIYA_CENTER.lat}
                      longitude={KALPITIYA_CENTER.lng}
                    />
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* CTA Section */}
        <section className="bg-gradient-to-r from-cyan-600 to-blue-600 text-white py-16">
          <div className="container mx-auto px-4 text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-3xl md:text-4xl font-bold mb-4">{ctaSection.title}</h2>
              <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">{ctaSection.subtitle}</p>
              <div className="flex gap-4 justify-center flex-wrap">
                <Button
                  size="lg"
                  className="bg-white text-cyan-600 hover:bg-gray-100"
                  onClick={() => handleBooking('Kalpitiya Complete Package')}
                >
                  <Phone className="w-5 h-5 mr-2" />
                  {ctaSection.buttonText}
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="border-white text-white hover:bg-white/20"
                  onClick={() => window.location.href = 'mailto:info@rechargetravels.com?subject=Kalpitiya Inquiry'}
                >
                  Contact Us
                </Button>
              </div>
            </motion.div>
          </div>
        </section>
      </main>

      <RechargeFooter />

      {/* WhatsApp Floating Button */}
      <a
        href="https://wa.me/94777721999?text=Hi! I'm interested in booking a Kalpitiya dolphin watching tour."
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

export default Kalpitiya;
