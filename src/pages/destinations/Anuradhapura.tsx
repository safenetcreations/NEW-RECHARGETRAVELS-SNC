import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { useNavigate } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import DestinationMap from '@/components/destinations/DestinationMap';
import WeatherWidget from '@/components/destinations/WeatherWidget';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Building,
  Sun,
  MapPin,
  Calendar,
  Clock,
  Star,
  Mountain,
  Utensils,
  Camera,
  Users,
  DollarSign,
  Info,
  Cloud,
  Thermometer,
  Droplets,
  Wind,
  TreePalm,
  Crown,
  Church,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Phone,
  Mail,
  CheckCircle,
  Globe,
  Heart,
  Bike,
  History,
  Sparkles,
  Trees,
  Compass,
  Luggage,
  Shield,
  Car,
  Wifi,
  Coffee,
  Bed,
  Languages,
  CircleDollarSign,
  Sunrise,
  Landmark,
  BookOpen,
  UtensilsCrossed,
  Leaf,
  MessageCircle
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { getDestinationBySlug } from '@/services/destinationContentService';

// Coordinates for Anuradhapura
const ANURADHAPURA_CENTER = { lat: 8.3114, lng: 80.4037 };

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
  { id: '1', image: "https://images.unsplash.com/photo-1588598198321-39f8c2be97ba?auto=format&fit=crop&q=80", title: "Discover Anuradhapura", subtitle: "Ancient Kingdom of Sri Lanka" },
  { id: '2', image: "https://images.unsplash.com/photo-1552465011-b4e21bf6e79a?auto=format&fit=crop&q=80", title: "Sacred Bo Tree", subtitle: "Sri Maha Bodhi - Oldest Tree" },
  { id: '3', image: "https://images.unsplash.com/photo-1586613835341-78c143aef52c?auto=format&fit=crop&q=80", title: "Ruwanwelisaya", subtitle: "Magnificent Ancient Stupa" },
  { id: '4', image: "https://images.unsplash.com/photo-1571536802807-30451e3f3d43?auto=format&fit=crop&q=80", title: "Jetavanaramaya", subtitle: "Tallest Ancient Brick Structure" },
  { id: '5', image: "https://images.unsplash.com/photo-1578128178243-721cd32ce739?auto=format&fit=crop&q=80", title: "Thuparamaya", subtitle: "First Stupa in Sri Lanka" }
];

const defaultAttractions: Attraction[] = [
  {
    id: '1',
    name: 'Sri Maha Bodhi',
    description: 'The sacred fig tree grown from a cutting of the original Bodhi tree under which Buddha attained enlightenment. At over 2,300 years old, it\'s the oldest documented tree in the world.',
    image: 'https://images.unsplash.com/photo-1610109703742-6e5c8b1a4871?auto=format&fit=crop&q=80',
    category: 'Sacred Site',
    rating: 5.0,
    duration: '1-2 hours',
    price: 'Donation',
    highlights: ['2,300+ Years Old', 'Most Sacred Site', 'Buddhist Pilgrimage', 'Golden Fence'],
    icon: 'Sparkles'
  },
  {
    id: '2',
    name: 'Ruwanwelisaya',
    description: 'Magnificent white dagoba built by King Dutugemunu in 140 BC, one of the world\'s tallest ancient monuments. The perfectly proportioned stupa is surrounded by elephant wall carvings.',
    image: 'https://images.unsplash.com/photo-1588002013238-64f0e1a8f6cf?auto=format&fit=crop&q=80',
    category: 'Religious',
    rating: 4.9,
    duration: '1-1.5 hours',
    price: 'Free',
    highlights: ['Great Stupa', 'Elephant Wall', 'Active Worship', '2nd Century BC'],
    icon: 'Landmark'
  },
  {
    id: '3',
    name: 'Jetavanaramaya',
    description: 'Once the world\'s third tallest structure after the pyramids of Giza. This massive brick stupa stands 122 meters tall, representing ancient engineering excellence.',
    image: 'https://images.unsplash.com/photo-1552742882-6de5f0852c79?auto=format&fit=crop&q=80',
    category: 'Archaeological',
    rating: 4.8,
    duration: '45 minutes',
    price: 'Included in ticket',
    highlights: ['Ancient Skyscraper', '93 Million Bricks', 'Engineering Marvel', '3rd Century'],
    icon: 'Building'
  },
  {
    id: '4',
    name: 'Mihintale',
    description: 'The mountain peak where Buddhism was introduced to Sri Lanka in 247 BC. Climb 1,840 granite steps to reach ancient monuments, caves, and stupas with panoramic views.',
    image: 'https://images.unsplash.com/photo-1624287532544-c5fc3c7a4d87?auto=format&fit=crop&q=80',
    category: 'Sacred Mountain',
    rating: 4.7,
    duration: '2-3 hours',
    price: 'From $3',
    highlights: ['Buddhist Introduction Site', '1,840 Steps', 'Mountain Monastery', 'Panoramic Views'],
    icon: 'Mountain'
  },
  {
    id: '5',
    name: 'Abhayagiri Monastery',
    description: 'Once home to 5,000 monks, this vast monastic complex includes a 75-meter stupa, moonstone carvings, guardstones, and the famous Samadhi Buddha statue.',
    image: 'https://images.unsplash.com/photo-1552841865-5e7c642a0191?auto=format&fit=crop&q=80',
    category: 'Monastery',
    rating: 4.6,
    duration: '1.5-2 hours',
    price: 'Included in ticket',
    highlights: ['Monastic Complex', 'Samadhi Buddha', 'Moonstone', 'Ancient Library'],
    icon: 'Church'
  },
  {
    id: '6',
    name: 'Twin Ponds (Kuttam Pokuna)',
    description: 'Ancient bathing pools showcasing sophisticated hydraulic engineering with underground water supply systems. The geometric precision and decorative elements are remarkable.',
    image: 'https://images.unsplash.com/photo-1596040033550-d0c85b8c8b23?auto=format&fit=crop&q=80',
    category: 'Engineering',
    rating: 4.5,
    duration: '30 minutes',
    price: 'Included in ticket',
    highlights: ['Ancient Pools', 'Hydraulic System', 'Geometric Design', '6th Century'],
    icon: 'Droplets'
  }
];

const defaultActivities: Activity[] = [
  {
    id: '1',
    name: 'Sacred Sites Pilgrimage',
    description: 'Visit the eight sacred places (Atamasthana) with a knowledgeable guide',
    icon: 'Church',
    price: 'From $30',
    duration: 'Full day',
    difficulty: 'Moderate',
    popular: true
  },
  {
    id: '2',
    name: 'Cycling Tour',
    description: 'Explore the vast ancient city by bicycle with expert guides through ruins',
    icon: 'Bike',
    price: 'From $20',
    duration: 'Half day',
    difficulty: 'Moderate',
    popular: true
  },
  {
    id: '3',
    name: 'Sunrise at Mihintale',
    description: 'Early morning climb to witness magical sunrise from the sacred mountain',
    icon: 'Sunrise',
    price: 'From $25',
    duration: '4 hours',
    difficulty: 'Challenging'
  },
  {
    id: '4',
    name: 'Archaeological Tour',
    description: 'In-depth exploration of ruins with archaeology expert and historian',
    icon: 'History',
    price: 'From $40',
    duration: 'Half day',
    difficulty: 'Easy'
  },
  {
    id: '5',
    name: 'Buddhist Meditation',
    description: 'Meditation session at ancient monastery sites with Buddhist monks',
    icon: 'Sparkles',
    price: 'From $15',
    duration: '2 hours',
    difficulty: 'Easy'
  },
  {
    id: '6',
    name: 'Photography Tour',
    description: 'Capture stunning dagobas and ancient ruins with professional guidance',
    icon: 'Camera',
    price: 'From $35',
    duration: 'Half day',
    difficulty: 'Easy'
  }
];

const defaultRestaurants: Restaurant[] = [
  {
    id: '1',
    name: 'Mihintale Pilgrims Rest',
    cuisine: 'Traditional Sri Lankan',
    priceRange: '$',
    rating: 4.4,
    image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&q=80',
    description: 'Authentic vegetarian Sri Lankan cuisine near the sacred sites, perfect for pilgrims and visitors.',
    specialties: ['Rice & Curry', 'Vegetable Kottu', 'String Hoppers', 'Fresh Juices'],
    openHours: '6:00 AM - 9:00 PM'
  },
  {
    id: '2',
    name: 'Ulagalla Restaurant',
    cuisine: 'Fine Dining & International',
    priceRange: '$$$$',
    rating: 4.8,
    image: 'https://images.unsplash.com/photo-1559339352-11d035aa65de?auto=format&fit=crop&q=80',
    description: 'Award-winning restaurant at luxury resort offering farm-to-table dining with ancient city views.',
    specialties: ['Tasting Menu', 'Organic Vegetables', 'Wine Pairing', 'Private Dining'],
    openHours: '7:00 AM - 10:30 PM'
  },
  {
    id: '3',
    name: 'Shalini Restaurant',
    cuisine: 'Sri Lankan & Chinese',
    priceRange: '$$',
    rating: 4.3,
    image: 'https://images.unsplash.com/photo-1552566626-52f8b828add9?auto=format&fit=crop&q=80',
    description: 'Popular local restaurant known for generous portions and friendly service near the Sacred City.',
    specialties: ['Devilled Chicken', 'Fried Rice', 'Seafood', 'Biriyani'],
    openHours: '10:00 AM - 10:00 PM'
  },
  {
    id: '4',
    name: 'Palm Garden Village',
    cuisine: 'Buffet & Sri Lankan',
    priceRange: '$$',
    rating: 4.5,
    image: 'https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?auto=format&fit=crop&q=80',
    description: 'Open-air restaurant at eco-resort serving authentic Sri Lankan buffets with village atmosphere.',
    specialties: ['Lunch Buffet', 'Traditional Sweets', 'Wood-Fired Cooking', 'Organic Produce'],
    openHours: '7:00 AM - 9:30 PM'
  }
];

const defaultHotels: HotelInfo[] = [
  {
    id: '1',
    name: 'Ulagalla by Uga Escapes',
    category: '5-Star Luxury',
    priceRange: 'From $350/night',
    rating: 4.9,
    image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&q=80',
    description: 'Ultra-luxury resort on 58-acre estate with private chalets, infinity pool, and panoramic views of ancient reservoirs.',
    amenities: ['Private Pool Villas', 'Spa', 'Horse Riding', 'Cycling', 'Fine Dining'],
    location: '15 min from Sacred City'
  },
  {
    id: '2',
    name: 'Palm Garden Village',
    category: 'Eco Resort',
    priceRange: 'From $80/night',
    rating: 4.5,
    image: 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?auto=format&fit=crop&q=80',
    description: 'Charming eco-resort with traditional chalets set in coconut grove, offering authentic village experience.',
    amenities: ['Pool', 'Restaurant', 'Bicycle Rental', 'Bird Watching', 'Village Tours'],
    location: '5 min from Sacred City'
  },
  {
    id: '3',
    name: 'Rajarata Hotel',
    category: '3-Star Hotel',
    priceRange: 'From $50/night',
    rating: 4.2,
    image: 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?auto=format&fit=crop&q=80',
    description: 'Comfortable mid-range hotel with good location, clean rooms, and helpful staff for exploring ruins.',
    amenities: ['Restaurant', 'Air Conditioning', 'Free WiFi', 'Tour Desk', 'Parking'],
    location: 'City Center'
  },
  {
    id: '4',
    name: 'Forest Rock Garden Resort',
    category: 'Nature Resort',
    priceRange: 'From $120/night',
    rating: 4.6,
    image: 'https://images.unsplash.com/photo-1582719508461-905c673771fd?auto=format&fit=crop&q=80',
    description: 'Unique resort built around ancient rock formations surrounded by forest, perfect for nature lovers.',
    amenities: ['Natural Pool', 'Rock Dining', 'Nature Trails', 'Bird Watching', 'Yoga'],
    location: '20 min from Sacred City'
  }
];

const defaultWeatherInfo: WeatherInfo = {
  season: 'Dry Zone Climate',
  temperature: '24-33°C (75-91°F)',
  rainfall: 'Low Feb-Sep, High Oct-Jan',
  humidity: '65-80%',
  bestMonths: ['February', 'March', 'April', 'May', 'June', 'July', 'August', 'September'],
  packingTips: [
    'Light, modest clothing (cover knees & shoulders)',
    'White or light-colored clothes for temples',
    'Comfortable walking shoes and socks',
    'Strong sunscreen and wide-brimmed hat',
    'Water bottles - stay hydrated',
    'Small denominations for temple donations'
  ]
};

const defaultTravelTips: TravelTip[] = [
  {
    id: '1',
    title: 'Best Time to Visit',
    icon: 'Calendar',
    tips: [
      'February to September: Dry season ideal',
      'Early morning (6-10 AM): Best to avoid heat',
      'Full moon (Poya) days: Special but crowded',
      'Avoid December-January monsoon season',
      'Weekdays less crowded than weekends'
    ]
  },
  {
    id: '2',
    title: 'Getting Around',
    icon: 'Car',
    tips: [
      '200km from Colombo (3.5-4 hours by car)',
      'Train service available from Colombo',
      'Bicycle rental highly recommended for ruins',
      'Tuk-tuks available for elderly/disabled',
      'Private driver most comfortable option'
    ]
  },
  {
    id: '3',
    title: 'Sacred Site Etiquette',
    icon: 'Church',
    tips: [
      'Remove shoes and hats at sacred sites',
      'Dress modestly - cover shoulders and knees',
      'Walk clockwise around dagobas',
      'No photography with back to Buddha',
      'Maintain silence at worship areas',
      'Ask permission before photographing monks'
    ]
  },
  {
    id: '4',
    title: 'Practical Information',
    icon: 'Shield',
    tips: [
      'Entry ticket: $25 USD for foreigners',
      'Site covers 40 km² - plan full day minimum',
      'Bring snacks, water, and sunscreen',
      'Licensed guides enhance experience',
      'Archaeological Museum worth visiting',
      'ATMs available in town center'
    ]
  }
];

const defaultDestinationInfo: DestinationInfo = {
  population: '50,000',
  area: '40 km² (Sacred Area)',
  elevation: '81 m',
  bestTime: 'Feb - Sep',
  language: 'Sinhala, English',
  currency: 'LKR / USD'
};

const defaultSEOSettings: SEOSettings = {
  title: 'Anuradhapura Sri Lanka - Sacred Buddhist City & UNESCO Heritage Site | Recharge Travels',
  description: 'Visit Anuradhapura, Sri Lanka\'s first capital and sacred Buddhist city. Explore ancient dagobas, Sri Maha Bodhi tree, and UNESCO heritage sites with expert guides.',
  keywords: 'Anuradhapura ancient city, Sri Maha Bodhi tree, Ruwanwelisaya dagoba, Buddhist pilgrimage Sri Lanka, UNESCO World Heritage, Jetavanaramaya stupa, Anuradhapura tours, sacred city Sri Lanka'
};

const defaultCTASection: CTASection = {
  title: 'Ready to Explore the Sacred City?',
  subtitle: 'Walk in the footsteps of ancient kings and pilgrims through 2,500 years of Buddhist heritage',
  buttonText: 'Book Your Pilgrimage',
  buttonLink: '/book'
};

// Icon mapping function
const getIconComponent = (iconName: string) => {
  const iconMap: { [key: string]: any } = {
    'Building': Building,
    'Sun': Sun,
    'MapPin': MapPin,
    'Calendar': Calendar,
    'Clock': Clock,
    'Star': Star,
    'Mountain': Mountain,
    'Utensils': Utensils,
    'Camera': Camera,
    'Users': Users,
    'DollarSign': DollarSign,
    'Info': Info,
    'Cloud': Cloud,
    'Thermometer': Thermometer,
    'Droplets': Droplets,
    'Wind': Wind,
    'TreePalm': TreePalm,
    'Crown': Crown,
    'Church': Church,
    'Phone': Phone,
    'Mail': Mail,
    'CheckCircle': CheckCircle,
    'Globe': Globe,
    'Heart': Heart,
    'Bike': Bike,
    'History': History,
    'Sparkles': Sparkles,
    'Trees': Trees,
    'Compass': Compass,
    'Luggage': Luggage,
    'Shield': Shield,
    'Car': Car,
    'Wifi': Wifi,
    'Coffee': Coffee,
    'Bed': Bed,
    'Languages': Languages,
    'CircleDollarSign': CircleDollarSign,
    'Sunrise': Sunrise,
    'Landmark': Landmark,
    'BookOpen': BookOpen,
    'UtensilsCrossed': UtensilsCrossed,
    'Leaf': Leaf
  };
  return iconMap[iconName] || Landmark;
};

const Anuradhapura = () => {
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
        const data = await getDestinationBySlug('anuradhapura');
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
        console.error('Error loading Anuradhapura content:', error);
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
    { id: 'map', label: 'Map', count: null },
    { id: 'tips', label: 'Travel Tips', count: travelTips.length }
  ];

  const handleBooking = () => {
    navigate('/book-tour');
  };

  const handleWhatsAppClick = () => {
    const message = encodeURIComponent('Hi! I\'m interested in booking an Anuradhapura tour. Could you provide more information?');
    window.open(`https://wa.me/94772557560?text=${message}`, '_blank');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-amber-50 to-orange-100">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-amber-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-amber-800 font-medium">Loading Anuradhapura...</p>
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
        <meta property="og:url" content="https://www.rechargetravels.com/destinations/anuradhapura" />
        <link rel="canonical" href="https://www.rechargetravels.com/destinations/anuradhapura" />
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
                <Badge className="bg-amber-600/80 text-white text-sm px-4 py-1">
                  Sacred Buddhist Capital
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
                  className="bg-amber-600 hover:bg-amber-700 text-white px-8 py-6 text-lg"
                  onClick={handleBooking}
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
                    <Crown className="w-6 h-6 text-amber-600 mb-2" />
                    <span className="text-sm text-muted-foreground">UNESCO Site</span>
                    <span className="font-semibold">Since 1982</span>
                  </div>
                  <div className="flex flex-col items-center">
                    <Thermometer className="w-6 h-6 text-amber-600 mb-2" />
                    <span className="text-sm text-muted-foreground">Temperature</span>
                    <span className="font-semibold">{weatherInfo.temperature}</span>
                  </div>
                  <div className="flex flex-col items-center">
                    <MapPin className="w-6 h-6 text-amber-600 mb-2" />
                    <span className="text-sm text-muted-foreground">Area</span>
                    <span className="font-semibold">{destinationInfo.area}</span>
                  </div>
                  <div className="flex flex-col items-center">
                    <Calendar className="w-6 h-6 text-amber-600 mb-2" />
                    <span className="text-sm text-muted-foreground">Best Time</span>
                    <span className="font-semibold">{destinationInfo.bestTime}</span>
                  </div>
                  <div className="flex flex-col items-center">
                    <Languages className="w-6 h-6 text-amber-600 mb-2" />
                    <span className="text-sm text-muted-foreground">Language</span>
                    <span className="font-semibold">{destinationInfo.language}</span>
                  </div>
                  <div className="flex flex-col items-center">
                    <CircleDollarSign className="w-6 h-6 text-amber-600 mb-2" />
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
                      ? 'border-amber-600 text-amber-600'
                      : 'border-transparent text-muted-foreground hover:text-foreground'
                  }`}
                >
                  {tab.label}
                  {tab.count && (
                    <Badge variant="secondary" className="ml-2 bg-amber-100 text-amber-700">
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
                  <h2 className="text-4xl font-bold mb-4">Sacred Sites of Anuradhapura</h2>
                  <p className="text-muted-foreground max-w-2xl mx-auto">
                    Explore ancient dagobas, the sacred Bodhi tree, and 2,500 years of Buddhist heritage
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
                              <Badge className="bg-amber-600 text-white">
                                {attraction.category}
                              </Badge>
                            </div>
                            <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm rounded-full p-2">
                              <IconComponent className="w-5 h-5 text-amber-600" />
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
                                <Badge key={idx} variant="outline" className="text-xs border-amber-200 text-amber-700">
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
                              className="w-full bg-amber-600 hover:bg-amber-700"
                              onClick={handleBooking}
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
                  <h2 className="text-4xl font-bold mb-4">Things to Do in Anuradhapura</h2>
                  <p className="text-muted-foreground max-w-2xl mx-auto">
                    From sacred pilgrimages to cycling tours through ancient ruins
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
                                <div className="p-3 bg-amber-100 rounded-xl mr-4">
                                  <IconComponent className="w-6 h-6 text-amber-600" />
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
                              <span className="text-amber-600 font-semibold">{activity.price}</span>
                              <span className="text-muted-foreground">{activity.duration}</span>
                            </div>
                            {activity.difficulty && (
                              <Badge variant="outline" className="mb-4 border-amber-200">
                                {activity.difficulty}
                              </Badge>
                            )}
                            <Button
                              variant="outline"
                              className="w-full border-amber-600 text-amber-600 hover:bg-amber-600 hover:text-white"
                              onClick={handleBooking}
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
                  <h2 className="text-4xl font-bold mb-4">Where to Eat in Anuradhapura</h2>
                  <p className="text-muted-foreground max-w-2xl mx-auto">
                    Traditional Sri Lankan cuisine and dining options near the sacred sites
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
                              <Badge variant="outline" className="border-amber-200 text-amber-700">
                                {restaurant.cuisine}
                              </Badge>
                              <Badge className="bg-amber-100 text-amber-700">
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
                  <h2 className="text-4xl font-bold mb-4">Where to Stay in Anuradhapura</h2>
                  <p className="text-muted-foreground max-w-2xl mx-auto">
                    From luxury eco-resorts to comfortable hotels near the sacred city
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
                            <Badge className="bg-amber-600 text-white">{hotel.category}</Badge>
                          </div>
                          <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm rounded-full px-3 py-1 flex items-center">
                            <Star className="w-4 h-4 text-yellow-500 fill-current" />
                            <span className="ml-1 text-sm font-medium">{hotel.rating}</span>
                          </div>
                        </div>
                        <CardContent className="p-6">
                          <div className="flex items-start justify-between mb-2">
                            <h3 className="text-xl font-bold">{hotel.name}</h3>
                            <span className="text-amber-600 font-semibold text-sm">{hotel.priceRange}</span>
                          </div>
                          <div className="flex items-center text-sm text-muted-foreground mb-3">
                            <MapPin className="w-4 h-4 mr-1" />
                            {hotel.location}
                          </div>
                          <p className="text-muted-foreground text-sm mb-4">{hotel.description}</p>
                          <div className="flex flex-wrap gap-2 mb-4">
                            {hotel.amenities.slice(0, 4).map((amenity, idx) => (
                              <Badge key={idx} variant="outline" className="text-xs border-amber-200">
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
                            className="w-full bg-amber-600 hover:bg-amber-700"
                            onClick={handleBooking}
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
                  <h2 className="text-4xl font-bold mb-4">Weather in Anuradhapura</h2>
                  <p className="text-muted-foreground max-w-2xl mx-auto">
                    Plan your pilgrimage with our comprehensive weather guide
                  </p>
                </div>
                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
                  <Card className="text-center p-6 bg-gradient-to-br from-amber-50 to-orange-50">
                    <Thermometer className="w-10 h-10 text-amber-600 mx-auto mb-3" />
                    <h3 className="font-semibold mb-1">Temperature</h3>
                    <p className="text-2xl font-bold text-amber-600">{weatherInfo.temperature}</p>
                  </Card>
                  <Card className="text-center p-6 bg-gradient-to-br from-amber-50 to-orange-50">
                    <Cloud className="w-10 h-10 text-amber-600 mx-auto mb-3" />
                    <h3 className="font-semibold mb-1">Climate</h3>
                    <p className="text-lg font-medium text-amber-600">{weatherInfo.season}</p>
                  </Card>
                  <Card className="text-center p-6 bg-gradient-to-br from-amber-50 to-orange-50">
                    <Droplets className="w-10 h-10 text-amber-600 mx-auto mb-3" />
                    <h3 className="font-semibold mb-1">Humidity</h3>
                    <p className="text-2xl font-bold text-amber-600">{weatherInfo.humidity}</p>
                  </Card>
                  <Card className="text-center p-6 bg-gradient-to-br from-amber-50 to-orange-50">
                    <Wind className="w-10 h-10 text-amber-600 mx-auto mb-3" />
                    <h3 className="font-semibold mb-1">Rainfall</h3>
                    <p className="text-sm font-medium text-amber-600">{weatherInfo.rainfall}</p>
                  </Card>
                </div>

                <div className="grid md:grid-cols-2 gap-8">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Calendar className="w-5 h-5 text-amber-600" />
                        Best Months to Visit
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="flex flex-wrap gap-2">
                        {weatherInfo.bestMonths.map((month, idx) => (
                          <Badge key={idx} className="bg-amber-100 text-amber-700 px-4 py-2">
                            {month}
                          </Badge>
                        ))}
                      </div>
                      <p className="text-muted-foreground mt-4 text-sm">
                        The dry season from February to September offers the best weather for exploring ancient ruins and sacred sites.
                      </p>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Luggage className="w-5 h-5 text-amber-600" />
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

            {/* Map Tab */}
            {selectedTab === 'map' && (
              <motion.section
                key="map"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
              >
                <div className="text-center mb-12">
                  <h2 className="text-4xl font-bold mb-4">Explore Anuradhapura</h2>
                  <p className="text-muted-foreground max-w-2xl mx-auto">
                    Discover the locations of major attractions and plan your visit
                  </p>
                </div>
                <div className="grid lg:grid-cols-3 gap-8">
                  <div className="lg:col-span-2">
                    <Card className="overflow-hidden">
                      <CardContent className="p-0">
                        <DestinationMap
                          center={ANURADHAPURA_CENTER}
                          attractions={[
                            { lat: 8.3456, lng: 80.3967, name: 'Sri Maha Bodhi', type: 'Sacred Site' },
                            { lat: 8.3514, lng: 80.3989, name: 'Ruwanwelisaya', type: 'Religious' },
                            { lat: 8.3589, lng: 80.4028, name: 'Jetavanaramaya', type: 'Archaeological' },
                            { lat: 8.3656, lng: 80.3992, name: 'Abhayagiri Monastery', type: 'Monastery' },
                            { lat: 8.3520, lng: 80.4100, name: 'Isurumuniya', type: 'Temple' },
                            { lat: 8.3478, lng: 80.3945, name: 'Thuparamaya', type: 'Stupa' }
                          ]}
                        />
                      </CardContent>
                    </Card>
                  </div>
                  <div>
                    <WeatherWidget city="Anuradhapura" />
                  </div>
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
                  <h2 className="text-4xl font-bold mb-4">Travel Tips for Anuradhapura</h2>
                  <p className="text-muted-foreground max-w-2xl mx-auto">
                    Essential information for visiting the sacred city
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
                              <div className="p-2 bg-amber-100 rounded-lg">
                                <IconComponent className="w-6 h-6 text-amber-600" />
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
        <section className="bg-gradient-to-r from-amber-600 to-orange-600 text-white py-16">
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
                  className="bg-white text-amber-600 hover:bg-gray-100"
                  onClick={handleBooking}
                >
                  <Phone className="w-5 h-5 mr-2" />
                  {ctaSection.buttonText}
                </Button>
                <Button
                  size="lg"
                  className="bg-green-500 text-white hover:bg-green-600 border-0"
                  onClick={handleWhatsAppClick}
                >
                  <MessageCircle className="w-5 h-5 mr-2" />
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

export default Anuradhapura;
