import React, { useState, useEffect } from 'react';
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
import EnhancedBookingModal from '@/components/EnhancedBookingModal';
import { getDestinationBySlug } from '@/services/destinationContentService';

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
  {
    id: '1',
    image: 'https://images.unsplash.com/photo-1621164448337-f84d90e911f6?auto=format&fit=crop&q=80',
    title: 'Welcome to Jaffna',
    subtitle: 'The Cultural Heart of Northern Sri Lanka'
  },
  {
    id: '2',
    image: 'https://images.unsplash.com/photo-1563246530-7c9c406af659?auto=format&fit=crop&q=80',
    title: 'Ancient Tamil Heritage',
    subtitle: 'Where History Lives On'
  },
  {
    id: '3',
    image: 'https://images.unsplash.com/photo-1577717903315-1691ae25ab3f?auto=format&fit=crop&q=80',
    title: 'Peninsula Paradise',
    subtitle: 'Discover Untouched Islands and Temples'
  }
];

const defaultAttractions: Attraction[] = [
  {
    id: '1',
    name: 'Nallur Kandaswamy Temple',
    description: 'The most significant Hindu temple in Jaffna with stunning Dravidian architecture and vibrant festivals. The annual Nallur Festival draws thousands of devotees.',
    image: 'https://images.unsplash.com/photo-1552832230-c0197dd311b5?auto=format&fit=crop&q=80',
    category: 'Religious',
    rating: 4.8,
    duration: '2-3 hours',
    price: 'Free',
    highlights: ['Dravidian Architecture', 'Annual Festival', 'Sacred Chariot', 'Cultural Experience'],
    icon: 'Sparkles'
  },
  {
    id: '2',
    name: 'Jaffna Fort',
    description: 'Historic Dutch fort built in 1618, one of the best-preserved colonial forts in Asia. Offers panoramic views and insights into colonial history.',
    image: 'https://images.unsplash.com/photo-1599661046289-e31897846d41?auto=format&fit=crop&q=80',
    category: 'Historical',
    rating: 4.5,
    duration: '2 hours',
    price: '$3',
    highlights: ['Dutch Colonial', 'Panoramic Views', 'Museum Inside', 'Photo Spots'],
    icon: 'Castle'
  },
  {
    id: '3',
    name: 'Casuarina Beach',
    description: 'Pristine beach on Karainagar Island known for its shallow crystal-clear waters, casuarina trees, and peaceful atmosphere.',
    image: 'https://images.unsplash.com/photo-1519046904884-53103b34b206?auto=format&fit=crop&q=80',
    category: 'Beach',
    rating: 4.6,
    duration: 'Half Day',
    price: 'Free',
    highlights: ['Crystal Waters', 'Casuarina Trees', 'Safe Swimming', 'Sunset Views'],
    icon: 'Waves'
  },
  {
    id: '4',
    name: 'Jaffna Public Library',
    description: 'Architecturally stunning library rebuilt after destruction in the civil war. Symbol of Tamil literary heritage and resilience.',
    image: 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?auto=format&fit=crop&q=80',
    category: 'Cultural',
    rating: 4.7,
    duration: '1 hour',
    price: 'Free',
    highlights: ['Indo-Saracenic Style', 'Literary Heritage', 'Historic Symbol', 'Rare Books'],
    icon: 'BookOpen'
  },
  {
    id: '5',
    name: 'Nagadeepa Purana Viharaya',
    description: 'Ancient Buddhist temple on Nainativu Island, believed to be where Lord Buddha settled a dispute. One of the holiest Buddhist sites.',
    image: 'https://images.unsplash.com/photo-1593432144894-44b102fe7399?auto=format&fit=crop&q=80',
    category: 'Religious',
    rating: 4.8,
    duration: 'Half Day',
    price: '$5 (boat)',
    highlights: ['Buddhist Sacred Site', 'Boat Journey', 'Ancient History', 'Island Temple'],
    icon: 'Landmark'
  },
  {
    id: '6',
    name: 'Delft Island',
    description: 'Remote island with wild ponies, baobab trees, and Dutch colonial ruins. Experience untouched natural beauty and unique heritage.',
    image: 'https://images.unsplash.com/photo-1596895111956-bf1cf0599ce5?auto=format&fit=crop&q=80',
    category: 'Island',
    rating: 4.4,
    duration: 'Full Day',
    price: '$10 (boat)',
    highlights: ['Wild Ponies', 'Baobab Trees', 'Dutch Ruins', 'Untouched Nature'],
    icon: 'Compass'
  }
];

const defaultActivities: Activity[] = [
  {
    id: '1',
    name: 'Island Hopping Tour',
    description: 'Visit Nainativu, Delft Island, and Kayts with boat transfers and guided exploration',
    icon: 'Ship',
    price: 'From $60',
    duration: 'Full Day',
    difficulty: 'Easy',
    popular: true
  },
  {
    id: '2',
    name: 'Tamil Heritage Walk',
    description: 'Explore ancient temples, colonial buildings, and vibrant local markets with expert guides',
    icon: 'Building',
    price: 'From $25',
    duration: 'Half Day',
    difficulty: 'Easy',
    popular: true
  },
  {
    id: '3',
    name: 'Jaffna Cooking Class',
    description: 'Learn authentic Tamil cuisine including crab curry, dosai, and traditional sweets',
    icon: 'Utensils',
    price: 'From $40',
    duration: '4 hours',
    difficulty: 'Easy'
  },
  {
    id: '4',
    name: 'Photography Tour',
    description: 'Capture colorful temples, colonial architecture, and authentic daily life scenes',
    icon: 'Camera',
    price: 'From $35',
    duration: 'Half Day',
    difficulty: 'Easy'
  },
  {
    id: '5',
    name: 'Cycling Tour',
    description: 'Explore Jaffna Peninsula villages, farms, and coastal roads by bicycle',
    icon: 'Bike',
    price: 'From $30',
    duration: '4-5 hours',
    difficulty: 'Moderate'
  },
  {
    id: '6',
    name: 'Palmyra Experience',
    description: 'Visit palmyra farms, taste toddy, and learn about this iconic northern tree',
    icon: 'TreePalm',
    price: 'From $25',
    duration: '3 hours',
    difficulty: 'Easy'
  }
];

const defaultRestaurants: Restaurant[] = [
  {
    id: '1',
    name: 'Malayan Cafe',
    cuisine: 'Traditional Jaffna Tamil',
    priceRange: '$',
    rating: 4.6,
    image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&q=80',
    description: 'Iconic local eatery famous for authentic Jaffna crab curry and traditional Tamil dishes since 1954.',
    specialties: ['Jaffna Crab Curry', 'Mutton Varuval', 'Dosai', 'String Hoppers'],
    openHours: '7:00 AM - 9:00 PM'
  },
  {
    id: '2',
    name: 'Cosy Restaurant',
    cuisine: 'Sri Lankan & International',
    priceRange: '$$',
    rating: 4.4,
    image: 'https://images.unsplash.com/photo-1552566626-52f8b828add9?auto=format&fit=crop&q=80',
    description: 'Popular family restaurant offering a mix of Tamil specialties and continental dishes.',
    specialties: ['Seafood Platter', 'Biriyani', 'Kottu', 'Ice Cream'],
    openHours: '10:00 AM - 10:00 PM'
  },
  {
    id: '3',
    name: 'Rio Ice Cream',
    cuisine: 'Desserts & Light Meals',
    priceRange: '$',
    rating: 4.5,
    image: 'https://images.unsplash.com/photo-1501443762994-82bd5dace89a?auto=format&fit=crop&q=80',
    description: 'Famous local ice cream parlor known for unique flavors and refreshing treats.',
    specialties: ['Faluda', 'Ice Cream Sundaes', 'Fresh Juices', 'Short Eats'],
    openHours: '9:00 AM - 10:00 PM'
  },
  {
    id: '4',
    name: 'Jetwing Jaffna Restaurant',
    cuisine: 'Fine Dining & Fusion',
    priceRange: '$$$',
    rating: 4.7,
    image: 'https://images.unsplash.com/photo-1559339352-11d035aa65de?auto=format&fit=crop&q=80',
    description: 'Upscale hotel restaurant offering refined Tamil cuisine with modern presentation.',
    specialties: ['Tasting Menu', 'Seafood Specialties', 'Vegetarian Thali', 'Wine Selection'],
    openHours: '6:30 AM - 10:30 PM'
  }
];

const defaultHotels: HotelInfo[] = [
  {
    id: '1',
    name: 'Jetwing Jaffna',
    category: '4-Star Hotel',
    priceRange: 'From $120/night',
    rating: 4.6,
    image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&q=80',
    description: 'Modern luxury hotel in the heart of Jaffna with contemporary design, rooftop restaurant, and excellent service.',
    amenities: ['Rooftop Restaurant', 'Swimming Pool', 'Spa', 'Free WiFi', 'Airport Transfer'],
    location: 'City Center'
  },
  {
    id: '2',
    name: 'Fox Resorts Jaffna',
    category: 'Boutique Resort',
    priceRange: 'From $90/night',
    rating: 4.4,
    image: 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?auto=format&fit=crop&q=80',
    description: 'Charming boutique resort with traditional touches, beautiful gardens, and personalized service.',
    amenities: ['Garden Restaurant', 'Pool', 'Bicycle Rental', 'Tour Desk', 'Free Parking'],
    location: 'Nallur Area'
  },
  {
    id: '3',
    name: 'Tilko Jaffna City Hotel',
    category: '3-Star Hotel',
    priceRange: 'From $60/night',
    rating: 4.2,
    image: 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?auto=format&fit=crop&q=80',
    description: 'Comfortable mid-range hotel with good location, friendly staff, and clean modern rooms.',
    amenities: ['Restaurant', 'Air Conditioning', 'Free WiFi', 'Room Service', 'Laundry'],
    location: 'City Center'
  },
  {
    id: '4',
    name: 'Thinnai Hotel',
    category: 'Heritage Boutique',
    priceRange: 'From $75/night',
    rating: 4.5,
    image: 'https://images.unsplash.com/photo-1582719508461-905c673771fd?auto=format&fit=crop&q=80',
    description: 'Restored heritage building offering authentic Tamil hospitality with traditional architecture.',
    amenities: ['Heritage Rooms', 'Courtyard', 'Traditional Meals', 'Cultural Programs', 'Library'],
    location: 'Old Town'
  }
];

const defaultWeatherInfo: WeatherInfo = {
  season: 'Tropical Dry Climate',
  temperature: '24-33°C (75-91°F)',
  rainfall: 'Low Feb-Sep, Monsoon Oct-Jan',
  humidity: '70-80%',
  bestMonths: ['February', 'March', 'April', 'May', 'June', 'July', 'August', 'September'],
  packingTips: [
    'Light, breathable cotton clothing',
    'Modest dress for temple visits',
    'Strong sunscreen and hat',
    'Comfortable walking shoes',
    'Umbrella for occasional showers',
    'Light scarf/shawl for temples'
  ]
};

const defaultTravelTips: TravelTip[] = [
  {
    id: '1',
    title: 'Best Time to Visit',
    icon: 'Calendar',
    tips: [
      'February to September: Dry season, ideal weather',
      'August: Nallur Festival - spectacular but crowded',
      'October to January: Northeast monsoon rains',
      'Weekdays: Less crowded temples and sites'
    ]
  },
  {
    id: '2',
    title: 'Getting Around',
    icon: 'Car',
    tips: [
      'Flights from Colombo (1 hour) or train (8-10 hours)',
      'Three-wheelers (tuk-tuks) for local travel',
      'Rent a bicycle for peninsula exploration',
      'Boats to islands from Kurikattuwan Jetty',
      'Hire a car with driver for day trips'
    ]
  },
  {
    id: '3',
    title: 'Cultural Tips',
    icon: 'Users',
    tips: [
      'Dress modestly when visiting temples',
      'Remove shoes before entering religious sites',
      'Learn basic Tamil greetings (Vanakkam)',
      'Photography may require permission at temples',
      'Respect local customs and traditions',
      'Try local Tamil cuisine - it\'s unique!'
    ]
  },
  {
    id: '4',
    title: 'Practical Information',
    icon: 'Shield',
    tips: [
      'ATMs available but carry some cash',
      'English widely spoken in tourist areas',
      'Safe destination for all travelers',
      'Book island tours in advance',
      'Travel insurance recommended',
      'Water bottles and sunscreen essential'
    ]
  }
];

const defaultDestinationInfo: DestinationInfo = {
  population: '88,138',
  area: '1,025 km²',
  elevation: '3 m',
  bestTime: 'Feb - Sep',
  language: 'Tamil, English',
  currency: 'LKR / USD'
};

const defaultSEOSettings: SEOSettings = {
  title: 'Jaffna Sri Lanka - Tamil Heritage, Islands & Cultural Travel Guide | Recharge Travels',
  description: 'Discover Jaffna\'s ancient Hindu temples, pristine islands, and rich Tamil culture. Complete travel guide to Sri Lanka\'s northern peninsula with tours, hotels, and activities.',
  keywords: 'Jaffna Sri Lanka, Tamil heritage, Nallur Temple, Jaffna Fort, Delft Island, Northern Sri Lanka, Jaffna tours, Jaffna hotels, Tamil culture, island hopping Jaffna'
};

const defaultCTASection: CTASection = {
  title: 'Ready to Explore Jaffna?',
  subtitle: 'Experience the unique Tamil culture, ancient temples, and pristine islands with our expert guides',
  buttonText: 'Book Your Journey',
  buttonLink: '/book'
};

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
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [selectedService, setSelectedService] = useState<string>('');
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
          if (data.weatherInfo) setWeatherInfo(data.weatherInfo);
          if (data.travelTips?.length) setTravelTips(data.travelTips);
          if (data.destinationInfo) setDestinationInfo(data.destinationInfo);
          if (data.seoSettings) setSeoSettings(data.seoSettings);
          if (data.ctaSection) setCtaSection(data.ctaSection);
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
    { id: 'weather', label: 'Weather', count: null },
    { id: 'tips', label: 'Travel Tips', count: travelTips.length }
  ];

  const handleBooking = (service: string) => {
    setSelectedService(service);
    setShowBookingModal(true);
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

  return (
    <>
      <Helmet>
        <title>{seoSettings.title}</title>
        <meta name="description" content={seoSettings.description} />
        <meta name="keywords" content={seoSettings.keywords} />
        <meta property="og:title" content={seoSettings.title} />
        <meta property="og:description" content={seoSettings.description} />
        <meta property="og:image" content={heroSlides[0]?.image} />
        <meta property="og:url" content="https://recharge-travels-73e76.web.app/destinations/jaffna" />
        <link rel="canonical" href="https://recharge-travels-73e76.web.app/destinations/jaffna" />
      </Helmet>

      <Header />

      <main className="min-h-screen bg-background">
        {/* Hero Section */}
        <section className="relative h-[85vh] overflow-hidden">
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
        <section className="relative -mt-16 z-10 px-4">
          <div className="container mx-auto">
            <Card className="bg-white/95 backdrop-blur-md shadow-2xl border-0">
              <CardContent className="py-6">
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6 text-center">
                  <div className="flex flex-col items-center">
                    <Users className="w-6 h-6 text-rose-600 mb-2" />
                    <span className="text-sm text-muted-foreground">Population</span>
                    <span className="font-semibold">{destinationInfo.population}</span>
                  </div>
                  <div className="flex flex-col items-center">
                    <MapPin className="w-6 h-6 text-rose-600 mb-2" />
                    <span className="text-sm text-muted-foreground">Area</span>
                    <span className="font-semibold">{destinationInfo.area}</span>
                  </div>
                  <div className="flex flex-col items-center">
                    <Thermometer className="w-6 h-6 text-rose-600 mb-2" />
                    <span className="text-sm text-muted-foreground">Temperature</span>
                    <span className="font-semibold">{weatherInfo.temperature}</span>
                  </div>
                  <div className="flex flex-col items-center">
                    <Calendar className="w-6 h-6 text-rose-600 mb-2" />
                    <span className="text-sm text-muted-foreground">Best Time</span>
                    <span className="font-semibold">{destinationInfo.bestTime}</span>
                  </div>
                  <div className="flex flex-col items-center">
                    <Languages className="w-6 h-6 text-rose-600 mb-2" />
                    <span className="text-sm text-muted-foreground">Language</span>
                    <span className="font-semibold">{destinationInfo.language}</span>
                  </div>
                  <div className="flex flex-col items-center">
                    <CircleDollarSign className="w-6 h-6 text-rose-600 mb-2" />
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
                              <Badge className="bg-rose-600 text-white">
                                {attraction.category}
                              </Badge>
                            </div>
                            <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm rounded-full p-2">
                              <IconComponent className="w-5 h-5 text-rose-600" />
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
                                <Badge key={idx} variant="outline" className="text-xs border-rose-200 text-rose-700">
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
                              className="w-full bg-rose-600 hover:bg-rose-700"
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
                        key={activity.id}
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
                              <Badge variant="outline" className="border-rose-200 text-rose-700">
                                {restaurant.cuisine}
                              </Badge>
                              <Badge className="bg-rose-100 text-rose-700">
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
                  <h2 className="text-4xl font-bold mb-4">Where to Stay in Jaffna</h2>
                  <p className="text-muted-foreground max-w-2xl mx-auto">
                    From heritage boutiques to modern hotels
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
                            <Badge className="bg-rose-600 text-white">{hotel.category}</Badge>
                          </div>
                          <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm rounded-full px-3 py-1 flex items-center">
                            <Star className="w-4 h-4 text-yellow-500 fill-current" />
                            <span className="ml-1 text-sm font-medium">{hotel.rating}</span>
                          </div>
                        </div>
                        <CardContent className="p-6">
                          <div className="flex items-start justify-between mb-2">
                            <h3 className="text-xl font-bold">{hotel.name}</h3>
                            <span className="text-rose-600 font-semibold text-sm">{hotel.priceRange}</span>
                          </div>
                          <div className="flex items-center text-sm text-muted-foreground mb-3">
                            <MapPin className="w-4 h-4 mr-1" />
                            {hotel.location}
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

            {/* Weather Tab */}
            {selectedTab === 'weather' && (
              <motion.section
                key="weather"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
              >
                <div className="text-center mb-12">
                  <h2 className="text-4xl font-bold mb-4">Weather in Jaffna</h2>
                  <p className="text-muted-foreground max-w-2xl mx-auto">
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
                        {weatherInfo.bestMonths.map((month, idx) => (
                          <Badge key={idx} className="bg-rose-100 text-rose-700 px-4 py-2">
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
                  <h2 className="text-4xl font-bold mb-4">Travel Tips for Jaffna</h2>
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
                              <div className="p-2 bg-rose-100 rounded-lg">
                                <IconComponent className="w-6 h-6 text-rose-600" />
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
          </AnimatePresence>
        </div>

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

      {/* Booking Modal */}
      <EnhancedBookingModal
        isOpen={showBookingModal}
        onClose={() => setShowBookingModal(false)}
        preSelectedService={selectedService}
      />
    </>
  );
};

export default Jaffna;
