import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { useNavigate } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Waves,
  Sun,
  MapPin,
  Calendar,
  Clock,
  Star,
  Fish,
  Utensils,
  Camera,
  Users,
  DollarSign,
  Info,
  Cloud,
  Thermometer,
  Droplets,
  Wind,
  Home,
  Anchor,
  TreePalm,
  Ship,
  Heart,
  Shell,
  Map,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Phone,
  Mail,
  CheckCircle,
  Globe,
  Sparkles,
  Building,
  Umbrella,
  Bed,
  Wifi,
  Car,
  Coffee,
  Sunrise,
  Palmtree,
  Compass,
  Luggage,
  CreditCard,
  Shield,
  Plane,
  Mountain,
  UtensilsCrossed,
  GlassWater,
  Shirt,
  Languages,
  CircleDollarSign,
  Bath,
  AirVent,
  Tv,
  Dumbbell,
  Leaf
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import DestinationMap from '@/components/destinations/DestinationMap';
import WeatherWidget from '@/components/destinations/WeatherWidget';
import { getDestinationBySlug } from '@/services/destinationContentService';

const WADDUWA_CENTER = { lat: 6.6361, lng: 79.9389 };

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
  id: string;
  name: string;
  cuisine: string;
  priceRange: string;
  rating: number;
  image: string;
  description: string;
  specialties: string[];
  openHours: string;
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
  season: string;
  temperature: string;
  rainfall: string;
  humidity: string;
  bestMonths: string[];
  packingTips: string[];
}

interface TravelTip {
  id: string;
  title: string;
  icon: string;
  tips: string[];
}

interface SEOSettings {
  title: string;
  description: string;
  keywords: string;
}

interface CTASection {
  title: string;
  subtitle: string;
  buttonText: string;
  buttonLink: string;
}

// Default Content
const defaultHeroSlides: HeroSlide[] = [
  { id: '1', image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80", title: "Discover Wadduwa", subtitle: "Peaceful Beach Retreat" },
  { id: '2', image: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&q=80", title: "Wadduwa Beach", subtitle: "Serene Coastal Paradise" },
  { id: '3', image: "https://images.unsplash.com/photo-1559827291-72ee739d0d9a?auto=format&fit=crop&q=80", title: "Ayurveda Resorts", subtitle: "Wellness & Healing" },
  { id: '4', image: "https://images.unsplash.com/photo-1583212292454-1fe6229603b7?auto=format&fit=crop&q=80", title: "River Safaris", subtitle: "Bentota River Cruises" },
  { id: '5', image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&q=80", title: "Sunset Views", subtitle: "Golden Hour Magic" }
];

const defaultAttractions: Attraction[] = [
  {
    id: '1',
    name: 'Wadduwa Beach',
    description: 'A beautiful 3km stretch of golden sand beach perfect for swimming, sunbathing, and long walks. The beach is less crowded than southern beaches, offering a peaceful retreat with stunning sunsets.',
    image: 'https://images.unsplash.com/photo-1519046904884-53103b34b206?auto=format&fit=crop&q=80',
    category: 'Beach',
    rating: 4.7,
    duration: 'Full day',
    price: 'Free',
    highlights: ['Golden Sand', 'Safe Swimming', 'Sunset Views', 'Beach Walks'],
    icon: 'Waves'
  },
  {
    id: '2',
    name: 'Richmond Castle',
    description: 'A stunning Edwardian mansion built in 1896, blending British and Indian architectural styles. This two-story mansion features intricate woodwork, stained glass windows, and beautiful gardens.',
    image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?auto=format&fit=crop&q=80',
    category: 'Historical',
    rating: 4.5,
    duration: '1-2 hours',
    price: 'From $3',
    highlights: ['Edwardian Architecture', 'Teak Carvings', 'Historic Gardens', 'Photo Opportunity'],
    icon: 'Building'
  },
  {
    id: '3',
    name: 'Traditional Fish Market',
    description: 'Experience the vibrant local fish market where fishermen bring their daily catch. Best visited early morning to see the boats returning and the bustling trade in fresh seafood.',
    image: 'https://images.unsplash.com/photo-1559339352-11d035aa65de?auto=format&fit=crop&q=80',
    category: 'Cultural',
    rating: 4.3,
    duration: '1 hour',
    price: 'Free',
    highlights: ['Local Culture', 'Fresh Seafood', 'Traditional Boats', 'Morning Activity'],
    icon: 'Fish'
  },
  {
    id: '4',
    name: 'Pothupitiya Beach',
    description: 'A quieter section of beach south of main Wadduwa beach, perfect for those seeking more privacy. Popular with locals and features several beachside restaurants.',
    image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&q=80',
    category: 'Beach',
    rating: 4.4,
    duration: 'Half day',
    price: 'Free',
    highlights: ['Quiet Beach', 'Local Vibe', 'Seafood Restaurants', 'Swimming'],
    icon: 'Umbrella'
  },
  {
    id: '5',
    name: 'Barberyn Island',
    description: 'A small island visible from Wadduwa beach, home to an ancient lighthouse and monastery ruins. Can be reached by boat during low tide for exploration.',
    image: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?auto=format&fit=crop&q=80',
    category: 'Island',
    rating: 4.2,
    duration: '2-3 hours',
    price: 'Boat: $10',
    highlights: ['Lighthouse', 'Monastery Ruins', 'Island Walk', 'Ocean Views'],
    icon: 'Compass'
  },
  {
    id: '6',
    name: 'Kalutara Bodhiya',
    description: 'Located 10km north, this sacred Buddhist site features one of the world\'s only hollow dagobas. The site offers panoramic views of the Kalu River and ocean.',
    image: 'https://images.unsplash.com/photo-1588598198321-9735fd4f2b45?auto=format&fit=crop&q=80',
    category: 'Religious',
    rating: 4.6,
    duration: '1-2 hours',
    price: 'Free',
    highlights: ['Sacred Site', 'River Views', 'Hollow Stupa', 'Buddhist Art'],
    icon: 'Sparkles'
  }
];

const defaultActivities: Activity[] = [
  {
    id: '1',
    name: 'Beach Resort Relaxation',
    description: 'Enjoy luxury spa treatments and beachfront facilities at world-class resorts',
    icon: 'Umbrella',
    price: 'From $50',
    duration: 'Half/Full day',
    difficulty: 'Easy',
    popular: true
  },
  {
    id: '2',
    name: 'Traditional Fishing Experience',
    description: 'Join local fishermen for authentic traditional fishing methods on catamarans',
    icon: 'Fish',
    price: 'From $30',
    duration: '3-4 hours',
    difficulty: 'Moderate',
    popular: true
  },
  {
    id: '3',
    name: 'Water Sports Adventure',
    description: 'Jet skiing, banana boat rides, kayaking, and paddleboarding',
    icon: 'Waves',
    price: 'From $25',
    duration: '1-2 hours',
    difficulty: 'Moderate'
  },
  {
    id: '4',
    name: 'Seafood Cooking Class',
    description: 'Learn to prepare authentic Sri Lankan seafood dishes with local chefs',
    icon: 'Utensils',
    price: 'From $40',
    duration: '3 hours',
    difficulty: 'Easy'
  },
  {
    id: '5',
    name: 'Kalu River Safari',
    description: 'Explore mangroves and spot crocodiles, monitor lizards, and exotic birds',
    icon: 'Ship',
    price: 'From $35',
    duration: '2-3 hours',
    difficulty: 'Easy',
    popular: true
  },
  {
    id: '6',
    name: 'Sunset Catamaran Cruise',
    description: 'Romantic sunset sailing with refreshments and dolphin watching',
    icon: 'Sunrise',
    price: 'From $45',
    duration: '2 hours',
    difficulty: 'Easy'
  }
];

const defaultRestaurants: Restaurant[] = [
  {
    id: '1',
    name: 'Blue Water Restaurant',
    cuisine: 'Seafood & International',
    priceRange: '$$$',
    rating: 4.7,
    image: 'https://images.unsplash.com/photo-1559339352-11d035aa65de?auto=format&fit=crop&q=80',
    description: 'Elegant beachfront dining at The Blue Water hotel with fresh seafood and panoramic ocean views.',
    specialties: ['Grilled Lobster', 'Seafood Platter', 'Crab Curry', 'Sunset Cocktails'],
    openHours: '7:00 AM - 10:30 PM'
  },
  {
    id: '2',
    name: 'Siddhalepa Ayurveda Restaurant',
    cuisine: 'Ayurvedic & Health Food',
    priceRange: '$$',
    rating: 4.5,
    image: 'https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?auto=format&fit=crop&q=80',
    description: 'Healthy Ayurvedic cuisine prepared according to ancient Sri Lankan wellness traditions.',
    specialties: ['Herbal Soups', 'Detox Menu', 'Organic Vegetables', 'Fresh Juices'],
    openHours: '7:00 AM - 9:00 PM'
  },
  {
    id: '3',
    name: 'Beach Hut Seafood',
    cuisine: 'Local Seafood',
    priceRange: '$',
    rating: 4.4,
    image: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&q=80',
    description: 'Casual beachside restaurant serving the freshest catch of the day at local prices.',
    specialties: ['Grilled Fish', 'Devilled Prawns', 'Fish Ambul Thiyal', 'Kottu'],
    openHours: '10:00 AM - 10:00 PM'
  },
  {
    id: '4',
    name: 'Serene Pavilions',
    cuisine: 'Fine Dining & Fusion',
    priceRange: '$$$$',
    rating: 4.8,
    image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&q=80',
    description: 'Award-winning fine dining experience with creative fusion cuisine in a romantic villa setting.',
    specialties: ['Tasting Menu', 'Wine Pairing', 'Fresh Sashimi', 'Chocolate Desserts'],
    openHours: '6:30 PM - 10:30 PM'
  }
];

const defaultHotels: HotelInfo[] = [
  {
    id: '1',
    name: 'The Blue Water Hotel & Spa',
    category: '5-Star Luxury',
    priceRange: 'From $180/night',
    rating: 4.7,
    image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&q=80',
    description: 'Award-winning luxury beachfront resort with Geoffrey Bawa architecture, spa, and multiple dining options.',
    amenities: ['Private Beach', 'Infinity Pool', 'Full Spa', 'Water Sports', 'Fine Dining'],
    location: 'Beachfront'
  },
  {
    id: '2',
    name: 'Siddhalepa Ayurveda Health Resort',
    category: 'Wellness Resort',
    priceRange: 'From $120/night',
    rating: 4.6,
    image: 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?auto=format&fit=crop&q=80',
    description: 'Authentic Ayurvedic wellness resort offering traditional treatments, yoga, and healthy cuisine.',
    amenities: ['Ayurvedic Treatments', 'Yoga Sessions', 'Meditation', 'Organic Garden', 'Beach Access'],
    location: 'Beachfront'
  },
  {
    id: '3',
    name: 'Serene Pavilions',
    category: 'Boutique Villas',
    priceRange: 'From $250/night',
    rating: 4.8,
    image: 'https://images.unsplash.com/photo-1582719508461-905c673771fd?auto=format&fit=crop&q=80',
    description: 'Exclusive boutique resort featuring private pool villas with butler service and personalized experiences.',
    amenities: ['Private Pools', 'Butler Service', 'Fine Dining', 'Spa', 'Beach Cabanas'],
    location: 'Beachfront'
  },
  {
    id: '4',
    name: 'Villa Ocean View',
    category: 'Mid-Range',
    priceRange: 'From $65/night',
    rating: 4.3,
    image: 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?auto=format&fit=crop&q=80',
    description: 'Comfortable family-run guesthouse with ocean views, home-cooked meals, and personalized service.',
    amenities: ['Ocean View Rooms', 'Home Cooking', 'Garden', 'Airport Transfer', 'Tour Booking'],
    location: '200m from Beach'
  }
];

const defaultWeatherInfo: WeatherInfo = {
  season: 'Tropical Maritime',
  temperature: '27-32°C (80-90°F)',
  rainfall: 'Low Dec-Mar, Moderate Apr-Nov',
  humidity: '70-80%',
  bestMonths: ['December', 'January', 'February', 'March'],
  packingTips: [
    'Light, breathable cotton clothing',
    'Reef-safe sunscreen SPF 30+',
    'Comfortable beach sandals',
    'Light rain jacket for monsoon season',
    'Hat and quality sunglasses',
    'Modest clothing for temple visits'
  ]
};

const defaultTravelTips: TravelTip[] = [
  {
    id: '1',
    title: 'Best Time to Visit',
    icon: 'Calendar',
    tips: [
      'November to April: Dry season with calm seas',
      'May to October: Southwest monsoon but still pleasant',
      'Weekdays offer less crowded beaches',
      'Full moon Poya days: temples busy but culturally interesting'
    ]
  },
  {
    id: '2',
    title: 'Getting Around',
    icon: 'Car',
    tips: [
      '35km from Colombo (45 min - 1 hour)',
      'Train service to Wadduwa Station',
      'Tuk-tuks readily available locally',
      'Many hotels offer shuttle services',
      'Pre-book airport transfers for convenience'
    ]
  },
  {
    id: '3',
    title: 'Local Tips',
    icon: 'Users',
    tips: [
      'Try fresh seafood from local restaurants',
      'Visit fish market early morning (6-7 AM)',
      'Bargain respectfully at local markets',
      'Learn basic Sinhala greetings',
      'Carry cash for small vendors',
      'Respect temple dress codes'
    ]
  },
  {
    id: '4',
    title: 'Money & Safety',
    icon: 'Shield',
    tips: [
      'ATMs available in town center',
      'Credit cards accepted at hotels/resorts',
      'Safe destination for families',
      'Swim in designated areas only',
      'Keep valuables in hotel safe',
      'Travel insurance recommended'
    ]
  }
];

const defaultDestinationInfo: DestinationInfo = {
  population: '35,000',
  area: '14 km²',
  elevation: 'Sea level',
  bestTime: 'Nov - Apr',
  language: 'Sinhala, English',
  currency: 'LKR / USD'
};

const defaultSEOSettings: SEOSettings = {
  title: 'Wadduwa Beach Sri Lanka - Coastal Resort Town Near Colombo | Recharge Travels',
  description: 'Experience Wadduwa\'s golden beaches, traditional fishing culture, and luxury resorts just 30 minutes from Colombo. Book your perfect beach getaway with Recharge Travels.',
  keywords: 'Wadduwa beach, Sri Lanka beach resorts, Colombo beach nearby, Wadduwa hotels, fishing village Sri Lanka, west coast beaches, Wadduwa travel guide, beach vacation Sri Lanka'
};

const defaultCTASection: CTASection = {
  title: 'Ready for Your Beach Escape?',
  subtitle: 'Experience the perfect blend of relaxation and adventure on Wadduwa\'s golden shores',
  buttonText: 'Book Your Stay',
  buttonLink: '/book'
};

// Icon mapping function
const getIconComponent = (iconName: string) => {
  const iconMap: { [key: string]: any } = {
    'Waves': Waves,
    'Sun': Sun,
    'MapPin': MapPin,
    'Calendar': Calendar,
    'Clock': Clock,
    'Star': Star,
    'Fish': Fish,
    'Utensils': Utensils,
    'Camera': Camera,
    'Users': Users,
    'DollarSign': DollarSign,
    'Info': Info,
    'Cloud': Cloud,
    'Thermometer': Thermometer,
    'Droplets': Droplets,
    'Wind': Wind,
    'Home': Home,
    'Anchor': Anchor,
    'TreePalm': TreePalm,
    'Palmtree': Palmtree,
    'Ship': Ship,
    'Heart': Heart,
    'Shell': Shell,
    'Map': Map,
    'Phone': Phone,
    'Mail': Mail,
    'CheckCircle': CheckCircle,
    'Globe': Globe,
    'Sparkles': Sparkles,
    'Building': Building,
    'Umbrella': Umbrella,
    'Bed': Bed,
    'Wifi': Wifi,
    'Car': Car,
    'Coffee': Coffee,
    'Sunrise': Sunrise,
    'Compass': Compass,
    'Luggage': Luggage,
    'CreditCard': CreditCard,
    'Shield': Shield,
    'Plane': Plane,
    'Mountain': Mountain,
    'UtensilsCrossed': UtensilsCrossed,
    'GlassWater': GlassWater,
    'Shirt': Shirt,
    'Languages': Languages,
    'CircleDollarSign': CircleDollarSign,
    'Bath': Bath,
    'AirVent': AirVent,
    'Tv': Tv,
    'Dumbbell': Dumbbell,
    'Leaf': Leaf
  };
  return iconMap[iconName] || Waves;
};

const Wadduwa = () => {
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

  // UI State
  const [currentSlide, setCurrentSlide] = useState(0);
  const [selectedTab, setSelectedTab] = useState('attractions');
  const [isLoading, setIsLoading] = useState(true);

  // Load content from Firebase
  useEffect(() => {
    const loadContent = async () => {
      try {
        const data = await getDestinationBySlug('wadduwa');
        if (data) {
          if (data.heroSlides?.length) setHeroSlides(data.heroSlides);
          if (data.attractions?.length) setAttractions(data.attractions);
          if (data.activities?.length) setActivities(data.activities);
          if (data.restaurants?.length) setRestaurants(data.restaurants);
          if (data.hotels?.length) setHotels(data.hotels);
          if (data.weatherInfo) setWeatherInfo(data.weatherInfo);
          if (data.travelTips?.length) setTravelTips(data.travelTips);
          if (data.destinationInfo) setDestinationInfo(data.destinationInfo);
          if (data.seoSettings) setSeoSettings(data.seoSettings);
          if (data.ctaSection) setCtaSection(data.ctaSection);
        }
      } catch (error) {
        console.error('Error loading Wadduwa content:', error);
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
    { id: 'weather', label: 'Weather', count: null },
    { id: 'tips', label: 'Travel Tips', count: travelTips.length },
    { id: 'map', label: 'Map', count: null }
  ];

  const handleBooking = (service: string = 'Wadduwa Tour', tourData?: { id: string; name: string; description: string; duration: string; price: number; features: string[]; image?: string }) => {
    const params = new URLSearchParams({
      title: tourData?.name || service,
      id: tourData?.id || service.toLowerCase().replace(/\s+/g, '-'),
      duration: tourData?.duration || 'Full Day',
      price: String(tourData?.price || 45),
      image: tourData?.image || 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800',
      subtitle: `Wadduwa - ${tourData?.name || service}`
    });
    navigate(`/book-tour?${params.toString()}`);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-sky-50 to-blue-100">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-sky-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-sky-800 font-medium">Loading Wadduwa...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>{seoSettings.title}</title>
        <meta name="description" content={seoSettings.description} />
        <meta name="keywords" content={seoSettings.keywords} />
        <meta property="og:title" content={seoSettings.title} />
        <meta property="og:description" content={seoSettings.description} />
        <meta property="og:image" content={heroSlides[0]?.image} />
        <meta property="og:url" content="https://www.rechargetravels.com/destinations/wadduwa" />
        <link rel="canonical" href="https://www.rechargetravels.com/destinations/wadduwa" />
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
                <Badge className="bg-sky-500/80 text-white text-sm px-4 py-1">
                  Coastal Paradise Near Colombo
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
                  className="bg-sky-600 hover:bg-sky-700 text-white px-8 py-6 text-lg"
                  onClick={() => handleBooking('Wadduwa Beach Getaway')}
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
        <section className="relative -mt-16 z-10 px-4">
          <div className="container mx-auto">
            <Card className="bg-white/95 backdrop-blur-md shadow-2xl border-0">
              <CardContent className="py-6">
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6 text-center">
                  <div className="flex flex-col items-center">
                    <MapPin className="w-6 h-6 text-sky-600 mb-2" />
                    <span className="text-sm text-muted-foreground">Distance</span>
                    <span className="font-semibold">35km from Colombo</span>
                  </div>
                  <div className="flex flex-col items-center">
                    <Thermometer className="w-6 h-6 text-sky-600 mb-2" />
                    <span className="text-sm text-muted-foreground">Temperature</span>
                    <span className="font-semibold">{weatherInfo.temperature}</span>
                  </div>
                  <div className="flex flex-col items-center">
                    <Users className="w-6 h-6 text-sky-600 mb-2" />
                    <span className="text-sm text-muted-foreground">Population</span>
                    <span className="font-semibold">{destinationInfo.population}</span>
                  </div>
                  <div className="flex flex-col items-center">
                    <Calendar className="w-6 h-6 text-sky-600 mb-2" />
                    <span className="text-sm text-muted-foreground">Best Time</span>
                    <span className="font-semibold">{destinationInfo.bestTime}</span>
                  </div>
                  <div className="flex flex-col items-center">
                    <Languages className="w-6 h-6 text-sky-600 mb-2" />
                    <span className="text-sm text-muted-foreground">Language</span>
                    <span className="font-semibold">{destinationInfo.language}</span>
                  </div>
                  <div className="flex flex-col items-center">
                    <CircleDollarSign className="w-6 h-6 text-sky-600 mb-2" />
                    <span className="text-sm text-muted-foreground">Currency</span>
                    <span className="font-semibold">{destinationInfo.currency}</span>
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
                      ? 'border-sky-600 text-sky-600'
                      : 'border-transparent text-muted-foreground hover:text-foreground'
                  }`}
                >
                  {tab.label}
                  {tab.count && (
                    <Badge variant="secondary" className="ml-2 bg-sky-100 text-sky-700">
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
                  <h2 className="text-4xl font-bold mb-4">Top Attractions in Wadduwa</h2>
                  <p className="text-muted-foreground max-w-2xl mx-auto">
                    Discover pristine beaches, historic landmarks, and authentic fishing villages
                  </p>
                </div>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {attractions.map((attraction, index) => {
                    const IconComponent = getIconComponent(attraction.icon || 'Waves');
                    return (
                      <motion.div
                        key={attraction.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                      >
                        <Card className="group h-full hover:shadow-xl transition-all duration-300 overflow-hidden">
                          <div className="aspect-video overflow-hidden relative">
                            <img
                              src={attraction.image}
                              alt={attraction.name}
                              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                            />
                            <div className="absolute top-4 left-4">
                              <Badge className="bg-sky-600 text-white">
                                {attraction.category}
                              </Badge>
                            </div>
                            <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm rounded-full p-2">
                              <IconComponent className="w-5 h-5 text-sky-600" />
                            </div>
                          </div>
                          <CardHeader>
                            <CardTitle className="flex items-center justify-between">
                              <span>{attraction.name}</span>
                              <div className="flex items-center text-yellow-500">
                                <Star className="w-4 h-4 fill-current" />
                                <span className="ml-1 text-sm">{attraction.rating}</span>
                              </div>
                            </CardTitle>
                          </CardHeader>
                          <CardContent>
                            <p className="text-muted-foreground mb-4 line-clamp-2">{attraction.description}</p>
                            <div className="flex flex-wrap gap-2 mb-4">
                              {attraction.highlights.slice(0, 3).map((highlight, idx) => (
                                <Badge key={idx} variant="outline" className="text-xs border-sky-200 text-sky-700">
                                  {highlight}
                                </Badge>
                              ))}
                            </div>
                            <div className="flex items-center justify-between text-sm text-muted-foreground mb-4">
                              <span className="flex items-center">
                                <Clock className="w-4 h-4 mr-1" />
                                {attraction.duration}
                              </span>
                              <span className="flex items-center">
                                <DollarSign className="w-4 h-4 mr-1" />
                                {attraction.price}
                              </span>
                            </div>
                            <Button
                              className="w-full bg-sky-600 hover:bg-sky-700"
                              onClick={() => handleBooking(attraction.name)}
                            >
                              Book Visit
                            </Button>
                          </CardContent>
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
                  <h2 className="text-4xl font-bold mb-4">Things to Do in Wadduwa</h2>
                  <p className="text-muted-foreground max-w-2xl mx-auto">
                    From water sports to cultural experiences, discover exciting activities
                  </p>
                </div>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {activities.map((activity, index) => {
                    const IconComponent = getIconComponent(activity.icon);
                    return (
                      <motion.div
                        key={activity.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                      >
                        <Card className="h-full hover:shadow-lg transition-shadow">
                          <CardHeader>
                            <div className="flex items-start justify-between">
                              <div className="flex items-center">
                                <div className="p-3 bg-sky-100 rounded-xl mr-4">
                                  <IconComponent className="w-6 h-6 text-sky-600" />
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
                              <span className="text-sky-600 font-semibold">{activity.price}</span>
                              <span className="text-muted-foreground">{activity.duration}</span>
                            </div>
                            {activity.difficulty && (
                              <Badge variant="outline" className="mb-4 border-sky-200">
                                {activity.difficulty}
                              </Badge>
                            )}
                            <Button
                              variant="outline"
                              className="w-full border-sky-600 text-sky-600 hover:bg-sky-600 hover:text-white"
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
                  <h2 className="text-4xl font-bold mb-4">Where to Eat in Wadduwa</h2>
                  <p className="text-muted-foreground max-w-2xl mx-auto">
                    Fresh seafood, authentic Sri Lankan cuisine, and international dining options
                  </p>
                </div>
                <div className="grid md:grid-cols-2 gap-8">
                  {restaurants.map((restaurant, index) => (
                    <motion.div
                      key={restaurant.id}
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
                              <Badge variant="outline" className="border-sky-200 text-sky-700">
                                {restaurant.cuisine}
                              </Badge>
                              <Badge className="bg-sky-100 text-sky-700">
                                {restaurant.priceRange}
                              </Badge>
                            </div>
                            <p className="text-muted-foreground text-sm mb-4">{restaurant.description}</p>
                            <div className="mb-4">
                              <p className="text-xs text-muted-foreground mb-2">Specialties:</p>
                              <div className="flex flex-wrap gap-1">
                                {restaurant.specialties.map((specialty, idx) => (
                                  <Badge key={idx} variant="secondary" className="text-xs">
                                    {specialty}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                            <div className="flex items-center text-sm text-muted-foreground">
                              <Clock className="w-4 h-4 mr-1" />
                              {restaurant.openHours}
                            </div>
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
                  <h2 className="text-4xl font-bold mb-4">Where to Stay in Wadduwa</h2>
                  <p className="text-muted-foreground max-w-2xl mx-auto">
                    From luxury beachfront resorts to cozy guesthouses
                  </p>
                </div>
                <div className="grid md:grid-cols-2 gap-8">
                  {hotels.map((hotel, index) => (
                    <motion.div
                      key={hotel.id}
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
                          <div className="absolute top-4 left-4">
                            <Badge className="bg-sky-600 text-white">{hotel.category}</Badge>
                          </div>
                          <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm rounded-full px-3 py-1 flex items-center">
                            <Star className="w-4 h-4 text-yellow-500 fill-current" />
                            <span className="ml-1 text-sm font-medium">{hotel.rating}</span>
                          </div>
                        </div>
                        <CardContent className="p-6">
                          <div className="flex items-start justify-between mb-2">
                            <h3 className="text-xl font-bold">{hotel.name}</h3>
                            <span className="text-sky-600 font-semibold text-sm">{hotel.priceRange}</span>
                          </div>
                          <div className="flex items-center text-sm text-muted-foreground mb-3">
                            <MapPin className="w-4 h-4 mr-1" />
                            {hotel.location}
                          </div>
                          <p className="text-muted-foreground text-sm mb-4">{hotel.description}</p>
                          <div className="flex flex-wrap gap-2 mb-4">
                            {hotel.amenities.slice(0, 4).map((amenity, idx) => (
                              <Badge key={idx} variant="outline" className="text-xs border-sky-200">
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
                            className="w-full bg-sky-600 hover:bg-sky-700"
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

            {/* Weather Tab */}
            {selectedTab === 'weather' && (
              <motion.section
                key="weather"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
              >
                <div className="text-center mb-12">
                  <h2 className="text-4xl font-bold mb-4">Weather in Wadduwa</h2>
                  <p className="text-muted-foreground max-w-2xl mx-auto">
                    Plan your visit with our comprehensive weather guide
                  </p>
                </div>
                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
                  <Card className="text-center p-6 bg-gradient-to-br from-sky-50 to-blue-50">
                    <Thermometer className="w-10 h-10 text-sky-600 mx-auto mb-3" />
                    <h3 className="font-semibold mb-1">Temperature</h3>
                    <p className="text-2xl font-bold text-sky-600">{weatherInfo.temperature}</p>
                  </Card>
                  <Card className="text-center p-6 bg-gradient-to-br from-sky-50 to-blue-50">
                    <Cloud className="w-10 h-10 text-sky-600 mx-auto mb-3" />
                    <h3 className="font-semibold mb-1">Climate</h3>
                    <p className="text-lg font-medium text-sky-600">{weatherInfo.season}</p>
                  </Card>
                  <Card className="text-center p-6 bg-gradient-to-br from-sky-50 to-blue-50">
                    <Droplets className="w-10 h-10 text-sky-600 mx-auto mb-3" />
                    <h3 className="font-semibold mb-1">Humidity</h3>
                    <p className="text-2xl font-bold text-sky-600">{weatherInfo.humidity}</p>
                  </Card>
                  <Card className="text-center p-6 bg-gradient-to-br from-sky-50 to-blue-50">
                    <Wind className="w-10 h-10 text-sky-600 mx-auto mb-3" />
                    <h3 className="font-semibold mb-1">Rainfall</h3>
                    <p className="text-sm font-medium text-sky-600">{weatherInfo.rainfall}</p>
                  </Card>
                </div>

                <div className="grid md:grid-cols-2 gap-8">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Calendar className="w-5 h-5 text-sky-600" />
                        Best Months to Visit
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="flex flex-wrap gap-2">
                        {weatherInfo.bestMonths.map((month, idx) => (
                          <Badge key={idx} className="bg-sky-100 text-sky-700 px-4 py-2">
                            {month}
                          </Badge>
                        ))}
                      </div>
                      <p className="text-muted-foreground mt-4 text-sm">
                        The dry season offers the best beach weather with calm seas perfect for swimming and water sports.
                      </p>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Luggage className="w-5 h-5 text-sky-600" />
                        What to Pack
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-2">
                        {weatherInfo.packingTips.map((tip, idx) => (
                          <li key={idx} className="flex items-start gap-2">
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
                  <h2 className="text-4xl font-bold mb-4">Travel Tips for Wadduwa</h2>
                  <p className="text-muted-foreground max-w-2xl mx-auto">
                    Essential information to make the most of your visit
                  </p>
                </div>
                <div className="grid md:grid-cols-2 gap-8">
                  {travelTips.map((tipSection, index) => {
                    const IconComponent = getIconComponent(tipSection.icon);
                    return (
                      <motion.div
                        key={tipSection.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                      >
                        <Card className="h-full">
                          <CardHeader>
                            <CardTitle className="flex items-center gap-3">
                              <div className="p-2 bg-sky-100 rounded-lg">
                                <IconComponent className="w-6 h-6 text-sky-600" />
                              </div>
                              {tipSection.title}
                            </CardTitle>
                          </CardHeader>
                          <CardContent>
                            <ul className="space-y-3">
                              {tipSection.tips.map((tip, idx) => (
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

            {/* Map Tab */}
            {selectedTab === 'map' && (
              <motion.section
                key="map"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
              >
                <div className="text-center mb-12">
                  <h2 className="text-4xl font-bold mb-4">Explore Wadduwa Map</h2>
                  <p className="text-muted-foreground max-w-2xl mx-auto">
                    Discover key attractions and get real-time weather updates
                  </p>
                </div>
                <div className="grid lg:grid-cols-3 gap-8">
                  <div className="lg:col-span-2">
                    <Card className="overflow-hidden h-[500px]">
                      <DestinationMap
                        destinationName="Wadduwa"
                        center={WADDUWA_CENTER}
                        attractions={[
                          { name: 'Wadduwa Beach', description: 'Golden sand beach', coordinates: { lat: 6.6361, lng: 79.9389 } },
                          { name: 'Madu Ganga River', description: 'Wetland boat safari', coordinates: { lat: 6.5000, lng: 79.9500 } },
                          { name: 'Brief Garden', description: 'Artist\'s landscape garden', coordinates: { lat: 6.6200, lng: 79.9800 } },
                          { name: 'Kalutara Bodhiya', description: 'Sacred Bo tree temple', coordinates: { lat: 6.5850, lng: 79.9600 } },
                          { name: 'Kalutara Beach', description: 'Nearby coastal stretch', coordinates: { lat: 6.5800, lng: 79.9550 } }
                        ]}
                        height="500px"
                      />
                    </Card>
                  </div>
                  <div className="lg:col-span-1">
                    <WeatherWidget
                      locationName="Wadduwa"
                      latitude={WADDUWA_CENTER.lat}
                      longitude={WADDUWA_CENTER.lng}
                    />
                  </div>
                </div>
              </motion.section>
            )}
          </AnimatePresence>
        </div>

        {/* CTA Section */}
        <section className="bg-gradient-to-r from-sky-600 to-blue-600 text-white py-16">
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
                  className="bg-white text-sky-600 hover:bg-gray-100"
                  onClick={() => handleBooking('Wadduwa Complete Package')}
                >
                  <Phone className="w-5 h-5 mr-2" />
                  {ctaSection.buttonText}
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="bg-transparent text-white border-white hover:bg-white/20"
                  onClick={() => window.location.href = 'mailto:info@rechargetravels.com?subject=Wadduwa Inquiry'}
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

      {/* WhatsApp Floating Button */}
      <a
        href="https://wa.me/94777721999?text=Hi! I'm interested in booking a Wadduwa beach tour."
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

export default Wadduwa;
