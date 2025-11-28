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
  TreePine,
  Languages,
  CircleDollarSign,
  BookOpen,
  Castle,
  Footprints,
  Trees,
  Bird,
  History,
  Gem,
  Sunrise,
  Leaf,
  Train,
  Church
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

// Default Content for Hatton
const defaultHeroSlides: HeroSlide[] = [
  {
    id: '1',
    image: 'https://images.unsplash.com/photo-1586190848861-99aa4a171e90?auto=format&fit=crop&q=80',
    title: 'Welcome to Hatton',
    subtitle: 'Gateway to Sri Pada & Ceylon Tea Country'
  },
  {
    id: '2',
    image: 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&q=80',
    title: 'Adam\'s Peak Pilgrimage',
    subtitle: 'Sacred Mountain with Breathtaking Sunrise Views'
  },
  {
    id: '3',
    image: 'https://images.unsplash.com/photo-1582650625119-3a3dbd4a76b1?auto=format&fit=crop&q=80',
    title: 'Rolling Tea Plantations',
    subtitle: 'Experience the Legacy of Ceylon Tea'
  }
];

const defaultAttractions: Attraction[] = [
  {
    id: '1',
    name: 'Adam\'s Peak (Sri Pada)',
    description: 'Sacred mountain standing at 2,243m, revered by Buddhists, Hindus, Christians, and Muslims. The pre-dawn pilgrimage to witness the spectacular sunrise from the summit is a life-changing experience.',
    image: 'https://images.unsplash.com/photo-1586190848861-99aa4a171e90?auto=format&fit=crop&q=80',
    category: 'Sacred Site',
    rating: 4.9,
    duration: '6-8 hours',
    price: 'Free',
    highlights: ['Sacred Footprint', 'Sunrise Views', '5,500 Steps', 'Spiritual Journey'],
    icon: 'Mountain'
  },
  {
    id: '2',
    name: 'Ceylon Tea Plantations',
    description: 'Endless emerald-green tea estates covering the hillsides. Visit working tea factories, learn the art of tea making, and taste some of the world\'s finest Ceylon tea.',
    image: 'https://images.unsplash.com/photo-1582650625119-3a3dbd4a76b1?auto=format&fit=crop&q=80',
    category: 'Heritage',
    rating: 4.8,
    duration: '3-4 hours',
    price: 'From $15',
    highlights: ['Tea Factory Tour', 'Tea Tasting', 'Scenic Views', 'Photo Opportunities'],
    icon: 'Leaf'
  },
  {
    id: '3',
    name: 'St. Clair\'s Falls',
    description: 'Known as the "Little Niagara of Sri Lanka", this spectacular 80-meter waterfall cascades down in two sections surrounded by lush tea plantations.',
    image: 'https://images.unsplash.com/photo-1432405972618-c60b0225b8f9?auto=format&fit=crop&q=80',
    category: 'Waterfall',
    rating: 4.7,
    duration: '1-2 hours',
    price: 'Free',
    highlights: ['Twin Falls', 'Tea Estate Views', 'Photography', 'Scenic Drive'],
    icon: 'Waves'
  },
  {
    id: '4',
    name: 'Devon Falls',
    description: 'Beautiful 97-meter waterfall named after a British coffee planter. One of the tallest and most scenic waterfalls in Sri Lanka, visible from the main road.',
    image: 'https://images.unsplash.com/photo-1546587348-d12660c30c50?auto=format&fit=crop&q=80',
    category: 'Waterfall',
    rating: 4.6,
    duration: '1 hour',
    price: 'Free',
    highlights: ['97m Height', 'Roadside View', 'Tea Plantations', 'Misty Atmosphere'],
    icon: 'Waves'
  },
  {
    id: '5',
    name: 'Castlereagh Reservoir',
    description: 'Stunning man-made lake surrounded by tea estates and mountains. Perfect for peaceful walks, photography, and enjoying the serene hill country atmosphere.',
    image: 'https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&q=80',
    category: 'Nature',
    rating: 4.5,
    duration: '2-3 hours',
    price: 'Free',
    highlights: ['Scenic Lake', 'Mountain Views', 'Peaceful Walks', 'Bird Watching'],
    icon: 'Trees'
  },
  {
    id: '6',
    name: 'Dalhousie Village',
    description: 'The base camp for Adam\'s Peak pilgrimage. This charming village comes alive during pilgrimage season with pilgrims, shops, and authentic local culture.',
    image: 'https://images.unsplash.com/photo-1596895111956-bf1cf0599ce5?auto=format&fit=crop&q=80',
    category: 'Village',
    rating: 4.4,
    duration: '2-3 hours',
    price: 'Free',
    highlights: ['Pilgrimage Base', 'Local Culture', 'Mountain Views', 'Authentic Experience'],
    icon: 'Building'
  }
];

const defaultActivities: Activity[] = [
  {
    id: '1',
    name: 'Adam\'s Peak Sunrise Trek',
    description: 'Begin the sacred climb at 2 AM to reach the summit for a magical sunrise experience over the clouds',
    icon: 'Sunrise',
    price: 'From $45',
    duration: '6-8 hours',
    difficulty: 'Challenging',
    popular: true
  },
  {
    id: '2',
    name: 'Tea Factory Experience',
    description: 'Visit a working tea factory, learn the complete tea-making process, and enjoy exclusive tastings',
    icon: 'Leaf',
    price: 'From $25',
    duration: '2-3 hours',
    difficulty: 'Easy',
    popular: true
  },
  {
    id: '3',
    name: 'Tea Plantation Walk',
    description: 'Guided walk through scenic tea estates, meeting tea pluckers and learning about plantation life',
    icon: 'Footprints',
    price: 'From $20',
    duration: '2-3 hours',
    difficulty: 'Easy'
  },
  {
    id: '4',
    name: 'Waterfall Trail',
    description: 'Visit multiple stunning waterfalls including St. Clair\'s and Devon Falls in one scenic tour',
    icon: 'Waves',
    price: 'From $35',
    duration: 'Half Day',
    difficulty: 'Easy'
  },
  {
    id: '5',
    name: 'Hill Country Train Journey',
    description: 'Scenic train ride through tea plantations, tunnels, and bridges - one of the world\'s most beautiful rail journeys',
    icon: 'Train',
    price: 'From $15',
    duration: '3-4 hours',
    difficulty: 'Easy',
    popular: true
  },
  {
    id: '6',
    name: 'Bird Watching Tour',
    description: 'Spot endemic and migratory birds in the rich biodiversity of the hill country forests',
    icon: 'Bird',
    price: 'From $40',
    duration: '4-5 hours',
    difficulty: 'Easy'
  },
  {
    id: '7',
    name: 'Photography Expedition',
    description: 'Capture stunning landscapes, tea estates, waterfalls, and sunrise views with expert guidance',
    icon: 'Camera',
    price: 'From $55',
    duration: 'Full Day',
    difficulty: 'Easy'
  },
  {
    id: '8',
    name: 'Village Cultural Tour',
    description: 'Experience authentic hill country village life, meet plantation workers, and enjoy traditional cuisine',
    icon: 'Users',
    price: 'From $30',
    duration: '3-4 hours',
    difficulty: 'Easy'
  }
];

const defaultRestaurants: Restaurant[] = [
  {
    id: '1',
    name: 'The Tea Terrace',
    cuisine: 'Sri Lankan & Continental',
    priceRange: '$$',
    rating: 4.5,
    image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&q=80',
    description: 'Elegant restaurant with panoramic views of tea estates. Famous for high tea service and Ceylon tea specialties.',
    specialties: ['High Tea', 'Rice & Curry', 'Tea-infused dishes', 'Fresh Pastries'],
    openHours: '7:00 AM - 9:00 PM'
  },
  {
    id: '2',
    name: 'Hatton View Restaurant',
    cuisine: 'Sri Lankan Traditional',
    priceRange: '$',
    rating: 4.3,
    image: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&q=80',
    description: 'Local favorite serving authentic hill country cuisine with valley views. Perfect for traditional breakfast before Adam\'s Peak climb.',
    specialties: ['String Hoppers', 'Milk Rice', 'Kottu', 'Fresh Juices'],
    openHours: '5:00 AM - 10:00 PM'
  },
  {
    id: '3',
    name: 'Pilgrim\'s Rest Cafe',
    cuisine: 'Multi-Cuisine',
    priceRange: '$',
    rating: 4.2,
    image: 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?auto=format&fit=crop&q=80',
    description: 'Cozy cafe near Dalhousie, perfect for pre-climb meals and post-trek recovery. Open early for pilgrims.',
    specialties: ['Energy Breakfast', 'Hot Soup', 'Sandwiches', 'Hot Chocolate'],
    openHours: '3:00 AM - 8:00 PM (Season)'
  },
  {
    id: '4',
    name: 'Estate Bungalow Kitchen',
    cuisine: 'Colonial & Local',
    priceRange: '$$-$$$',
    rating: 4.6,
    image: 'https://images.unsplash.com/photo-1559339352-11d035aa65de?auto=format&fit=crop&q=80',
    description: 'Historic tea estate bungalow restaurant offering colonial-era recipes with modern touches. Reservation recommended.',
    specialties: ['Roast Dinner', 'Afternoon Tea', 'Lamprais', 'British Classics'],
    openHours: '7:00 AM - 9:30 PM'
  }
];

const defaultHotels: HotelInfo[] = [
  {
    id: '1',
    name: 'Ceylon Tea Trails',
    category: 'Luxury Bungalows',
    priceRange: 'From $400/night',
    rating: 4.9,
    image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&q=80',
    description: 'Award-winning collection of restored colonial tea bungalows offering ultra-luxury accommodation with butler service.',
    amenities: ['Butler Service', 'Private Chef', 'Tea Estate Tours', 'Infinity Pool', 'Spa'],
    location: 'Tea Estates'
  },
  {
    id: '2',
    name: 'Hatton Hill Resort',
    category: 'Boutique Hotel',
    priceRange: 'From $120/night',
    rating: 4.5,
    image: 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?auto=format&fit=crop&q=80',
    description: 'Modern boutique hotel with stunning mountain views and comfortable rooms. Ideal base for Adam\'s Peak.',
    amenities: ['Mountain Views', 'Restaurant', 'Free WiFi', 'Tour Desk', 'Parking'],
    location: 'Hatton Town'
  },
  {
    id: '3',
    name: 'Slightly Chilled Lounge',
    category: 'Eco Lodge',
    priceRange: 'From $80/night',
    rating: 4.4,
    image: 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?auto=format&fit=crop&q=80',
    description: 'Unique eco-friendly accommodation in the heart of tea country. Perfect for nature lovers and trekkers.',
    amenities: ['Eco-friendly', 'Tea Tours', 'Hiking Guides', 'Organic Meals', 'Yoga'],
    location: 'Near Dalhousie'
  },
  {
    id: '4',
    name: 'Wathsala Inn',
    category: 'Budget Guesthouse',
    priceRange: 'From $35/night',
    rating: 4.0,
    image: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&q=80',
    description: 'Clean and comfortable guesthouse with warm hospitality. Popular with Adam\'s Peak pilgrims.',
    amenities: ['Hot Water', 'Home-cooked Meals', 'Early Breakfast', 'Trekking Info', 'Parking'],
    location: 'Dalhousie'
  },
  {
    id: '5',
    name: 'The Plantation Villa',
    category: 'Heritage Villa',
    priceRange: 'From $200/night',
    rating: 4.7,
    image: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&q=80',
    description: 'Beautifully restored colonial planter\'s villa with period furniture and modern comforts amid tea gardens.',
    amenities: ['Heritage Rooms', 'Private Gardens', 'Tea Experiences', 'Fine Dining', 'Library'],
    location: 'Tea Estate'
  }
];

const defaultWeatherInfo: WeatherInfo = {
  season: 'Cool Tropical Highland',
  temperature: '12-22°C (54-72°F)',
  rainfall: 'Wettest: Oct-Dec, Driest: Jan-Mar',
  humidity: '75-90%',
  bestMonths: ['December', 'January', 'February', 'March', 'April'],
  packingTips: [
    'Warm layers for early morning treks',
    'Waterproof jacket (rain common)',
    'Comfortable hiking shoes with grip',
    'Headlamp/flashlight for Adam\'s Peak',
    'Warm hat and gloves for summit',
    'Sunscreen for high altitude',
    'Reusable water bottle',
    'Light backpack for day trips'
  ]
};

const defaultTravelTips: TravelTip[] = [
  {
    id: '1',
    title: 'Getting to Hatton',
    icon: 'Car',
    tips: [
      'Train from Colombo: 6-7 hours (scenic route)',
      'Train from Kandy: 3-4 hours',
      'By road from Colombo: 4-5 hours',
      'Nearest airport: Colombo (BIA) - 150km',
      'Local transport: Tuk-tuks and buses',
      'Private driver recommended for flexibility'
    ]
  },
  {
    id: '2',
    title: 'Adam\'s Peak Tips',
    icon: 'Mountain',
    tips: [
      'Pilgrimage season: December to May',
      'Start climb at 2-3 AM for sunrise',
      'Allow 3-4 hours up, 2-3 hours down',
      '5,500 steps to the summit',
      'Carry snacks, water, and warm clothes',
      'Weekends are very crowded - go weekdays'
    ]
  },
  {
    id: '3',
    title: 'Tea Country Etiquette',
    icon: 'Leaf',
    tips: [
      'Ask permission before photographing workers',
      'Buy tea directly from estates when possible',
      'Tip your guides appropriately',
      'Respect private estate properties',
      'Support local tea shops and cafes',
      'Learn about fair trade practices'
    ]
  },
  {
    id: '4',
    title: 'Best Time to Visit',
    icon: 'Calendar',
    tips: [
      'Dec-May: Best for Adam\'s Peak (season)',
      'Jan-Mar: Clearest weather',
      'Apr-May: Spring blooms',
      'Jun-Sep: Can be rainy but fewer crowds',
      'Poya (full moon) days are special',
      'Book ahead during pilgrimage season'
    ]
  },
  {
    id: '5',
    title: 'What to Pack',
    icon: 'Luggage',
    tips: [
      'Layers - temperatures vary greatly',
      'Rain gear essential year-round',
      'Good walking shoes for treks',
      'Camera for stunning scenery',
      'Cash (limited ATMs in villages)',
      'Basic medicines and first aid'
    ]
  }
];

const defaultDestinationInfo: DestinationInfo = {
  population: '~15,000',
  area: '45 km²',
  elevation: '1,271 m (4,170 ft)',
  bestTime: 'Dec - May',
  language: 'Tamil / Sinhala',
  currency: 'LKR / USD'
};

const defaultSEOSettings: SEOSettings = {
  title: 'Hatton Sri Lanka - Adam\'s Peak, Tea Plantations & Hill Country | Recharge Travels',
  description: 'Discover Hatton, gateway to Adam\'s Peak and Ceylon tea country. Experience sacred sunrise treks, lush tea plantations, stunning waterfalls, and colonial heritage. Complete travel guide.',
  keywords: 'Hatton Sri Lanka, Adam\'s Peak, Sri Pada, Ceylon tea plantations, tea factory tour, St Clair Falls, Devon Falls, hill country Sri Lanka, Hatton hotels, tea trails'
};

const defaultCTASection: CTASection = {
  title: 'Ready to Explore Hatton?',
  subtitle: 'Experience sacred peaks, world-famous tea, and breathtaking hill country landscapes',
  buttonText: 'Book Your Hill Country Adventure',
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
    'TreePine': TreePine,
    'Trees': Trees,
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
    'Languages': Languages,
    'CircleDollarSign': CircleDollarSign,
    'BookOpen': BookOpen,
    'Castle': Castle,
    'Footprints': Footprints,
    'Bird': Bird,
    'History': History,
    'Gem': Gem,
    'Sunrise': Sunrise,
    'Leaf': Leaf,
    'Train': Train,
    'Church': Church
  };
  return iconMap[iconName] || Info;
};

const Hatton: React.FC = () => {
  // State
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
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [selectedExperience, setSelectedExperience] = useState<string>('');

  // Load content from Firebase
  useEffect(() => {
    const loadContent = async () => {
      try {
        const data = await getDestinationBySlug('hatton');
        if (data) {
          if (data.heroSlides) setHeroSlides(data.heroSlides);
          if (data.attractions) setAttractions(data.attractions);
          if (data.activities) setActivities(data.activities);
          if (data.restaurants) setRestaurants(data.restaurants);
          if (data.hotels) setHotels(data.hotels);
          if (data.weatherInfo) setWeatherInfo(data.weatherInfo);
          if (data.travelTips) setTravelTips(data.travelTips);
          if (data.destinationInfo) setDestinationInfo(data.destinationInfo);
          if (data.seoSettings) setSeoSettings(data.seoSettings);
          if (data.ctaSection) setCtaSection(data.ctaSection);
        }
      } catch (error) {
        console.log('Using default content for Hatton');
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

  const handleBookNow = (experience: string) => {
    setSelectedExperience(experience);
    setIsBookingModalOpen(true);
  };

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + heroSlides.length) % heroSlides.length);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-emerald-50 to-green-100">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-emerald-800 font-medium">Loading Hatton...</p>
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
        <meta property="og:url" content="https://www.rechargetravels.com/destinations/hatton" />
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="Recharge Travels" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={seoSettings.title} />
        <meta name="twitter:description" content={seoSettings.description} />
        <meta name="twitter:image" content={heroSlides[0]?.image} />
        <link rel="canonical" href="https://www.rechargetravels.com/destinations/hatton" />
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
                <Badge className="bg-emerald-500/80 text-white px-4 py-1 text-sm">
                  Sacred Peaks & Ceylon Tea Heritage
                </Badge>
              </motion.div>
              <motion.h1
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="text-5xl md:text-7xl font-bold mb-4 drop-shadow-lg"
              >
                {heroSlides[currentSlide]?.title}
              </motion.h1>
              <motion.p
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.6 }}
                className="text-xl md:text-2xl mb-8 drop-shadow-md"
              >
                {heroSlides[currentSlide]?.subtitle}
              </motion.p>
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.8 }}
                className="flex flex-wrap gap-4 justify-center"
              >
                <Button
                  size="lg"
                  className="bg-emerald-600 hover:bg-emerald-700 text-white px-8"
                  onClick={() => handleBookNow('Hatton Tour')}
                >
                  <Mountain className="mr-2 h-5 w-5" />
                  Explore Hatton
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="border-white text-white hover:bg-white/20 px-8"
                  onClick={() => handleBookNow("Adam's Peak Trek")}
                >
                  <Sunrise className="mr-2 h-5 w-5" />
                  Book Adam's Peak
                </Button>
              </motion.div>
            </div>
          </div>

          {/* Hero Navigation */}
          <button
            onClick={prevSlide}
            className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/30 hover:bg-black/50 text-white p-3 rounded-full transition-all"
          >
            <ChevronLeft className="h-6 w-6" />
          </button>
          <button
            onClick={nextSlide}
            className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/30 hover:bg-black/50 text-white p-3 rounded-full transition-all"
          >
            <ChevronRight className="h-6 w-6" />
          </button>

          {/* Slide Indicators */}
          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-2">
            {heroSlides.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentSlide(index)}
                className={`w-3 h-3 rounded-full transition-all ${
                  currentSlide === index ? 'bg-white w-8' : 'bg-white/50'
                }`}
              />
            ))}
          </div>
        </section>

        {/* Quick Info Bar */}
        <section className="bg-gradient-to-r from-emerald-600 to-green-600 py-4">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-2 md:grid-cols-6 gap-4 text-white text-center">
              <div className="flex flex-col items-center">
                <Users className="h-5 w-5 mb-1" />
                <span className="text-xs opacity-80">Population</span>
                <span className="font-semibold text-sm">{destinationInfo.population}</span>
              </div>
              <div className="flex flex-col items-center">
                <MapPin className="h-5 w-5 mb-1" />
                <span className="text-xs opacity-80">Area</span>
                <span className="font-semibold text-sm">{destinationInfo.area}</span>
              </div>
              <div className="flex flex-col items-center">
                <Mountain className="h-5 w-5 mb-1" />
                <span className="text-xs opacity-80">Elevation</span>
                <span className="font-semibold text-sm">{destinationInfo.elevation}</span>
              </div>
              <div className="flex flex-col items-center">
                <Calendar className="h-5 w-5 mb-1" />
                <span className="text-xs opacity-80">Best Time</span>
                <span className="font-semibold text-sm">{destinationInfo.bestTime}</span>
              </div>
              <div className="flex flex-col items-center">
                <Languages className="h-5 w-5 mb-1" />
                <span className="text-xs opacity-80">Language</span>
                <span className="font-semibold text-sm">{destinationInfo.language}</span>
              </div>
              <div className="flex flex-col items-center">
                <CircleDollarSign className="h-5 w-5 mb-1" />
                <span className="text-xs opacity-80">Currency</span>
                <span className="font-semibold text-sm">{destinationInfo.currency}</span>
              </div>
            </div>
          </div>
        </section>

        {/* Introduction Section */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
              >
                <h2 className="text-4xl font-bold text-gray-900 mb-6">
                  Discover Hatton
                </h2>
                <p className="text-lg text-gray-600 leading-relaxed mb-8">
                  Nestled in the heart of Sri Lanka's central highlands, Hatton is the gateway to one 
                  of the world's most sacred pilgrimages—Adam's Peak (Sri Pada)—and the legendary 
                  Ceylon tea country. At an elevation of over 1,200 meters, this misty hill town is 
                  surrounded by endless rolling tea plantations, spectacular waterfalls, and colonial-era 
                  tea estate bungalows. Whether you're seeking spiritual enlightenment at sunrise on 
                  the sacred peak, exploring the art of tea making, or simply escaping into the cool, 
                  green embrace of the highlands, Hatton offers an unforgettable experience.
                </p>
                <div className="flex flex-wrap justify-center gap-3">
                  <Badge variant="secondary" className="px-4 py-2">
                    <Mountain className="h-4 w-4 mr-2" /> Adam's Peak
                  </Badge>
                  <Badge variant="secondary" className="px-4 py-2">
                    <Leaf className="h-4 w-4 mr-2" /> Tea Plantations
                  </Badge>
                  <Badge variant="secondary" className="px-4 py-2">
                    <Waves className="h-4 w-4 mr-2" /> Waterfalls
                  </Badge>
                  <Badge variant="secondary" className="px-4 py-2">
                    <Train className="h-4 w-4 mr-2" /> Scenic Trains
                  </Badge>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Attractions Section */}
        <section className="py-16 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold text-gray-900 mb-4">Top Attractions</h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                From sacred peaks to stunning waterfalls and tea estates
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {attractions.map((attraction, index) => {
                const IconComponent = getIconComponent(attraction.icon || 'MapPin');
                return (
                  <motion.div
                    key={attraction.id}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Card className="h-full overflow-hidden hover:shadow-xl transition-all duration-300 group">
                      <div className="relative h-56 overflow-hidden">
                        <img
                          src={attraction.image}
                          alt={attraction.name}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                        />
                        <div className="absolute top-4 left-4">
                          <Badge className="bg-emerald-600 text-white">
                            {attraction.category}
                          </Badge>
                        </div>
                        <div className="absolute top-4 right-4 bg-white/90 px-2 py-1 rounded-full flex items-center">
                          <Star className="h-4 w-4 text-yellow-500 fill-yellow-500 mr-1" />
                          <span className="text-sm font-medium">{attraction.rating}</span>
                        </div>
                      </div>
                      <CardContent className="p-6">
                        <div className="flex items-center gap-2 mb-3">
                          <IconComponent className="h-5 w-5 text-emerald-600" />
                          <h3 className="text-xl font-bold">{attraction.name}</h3>
                        </div>
                        <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                          {attraction.description}
                        </p>
                        <div className="flex flex-wrap gap-2 mb-4">
                          {attraction.highlights.slice(0, 3).map((highlight, i) => (
                            <Badge key={i} variant="outline" className="text-xs">
                              {highlight}
                            </Badge>
                          ))}
                        </div>
                        <div className="flex justify-between items-center text-sm text-gray-500 mb-4">
                          <span className="flex items-center">
                            <Clock className="h-4 w-4 mr-1" /> {attraction.duration}
                          </span>
                          <span className="flex items-center font-semibold text-emerald-600">
                            {attraction.price}
                          </span>
                        </div>
                        <Button
                          className="w-full bg-emerald-600 hover:bg-emerald-700"
                          onClick={() => handleBookNow(attraction.name)}
                        >
                          Explore This
                        </Button>
                      </CardContent>
                    </Card>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Activities Section */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold text-gray-900 mb-4">Things To Do</h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                Adventures, experiences, and cultural immersion in the hill country
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {activities.map((activity, index) => {
                const IconComponent = getIconComponent(activity.icon);
                return (
                  <motion.div
                    key={activity.id}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <Card className={`h-full hover:shadow-lg transition-all duration-300 ${activity.popular ? 'border-emerald-500 border-2' : ''}`}>
                      <CardContent className="p-6">
                        {activity.popular && (
                          <Badge className="bg-emerald-100 text-emerald-700 mb-3">
                            <Sparkles className="h-3 w-3 mr-1" /> Popular
                          </Badge>
                        )}
                        <div className="bg-emerald-100 w-14 h-14 rounded-xl flex items-center justify-center mb-4">
                          <IconComponent className="h-7 w-7 text-emerald-600" />
                        </div>
                        <h3 className="font-bold text-lg mb-2">{activity.name}</h3>
                        <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                          {activity.description}
                        </p>
                        <div className="flex justify-between items-center text-sm mb-4">
                          <span className="text-gray-500">
                            <Clock className="h-4 w-4 inline mr-1" />
                            {activity.duration}
                          </span>
                          <span className="font-bold text-emerald-600">{activity.price}</span>
                        </div>
                        {activity.difficulty && (
                          <Badge variant="outline" className="mb-4">
                            {activity.difficulty}
                          </Badge>
                        )}
                        <Button
                          variant="outline"
                          className="w-full border-emerald-600 text-emerald-600 hover:bg-emerald-50"
                          onClick={() => handleBookNow(activity.name)}
                        >
                          Book Activity
                        </Button>
                      </CardContent>
                    </Card>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Restaurants Section */}
        <section className="py-16 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold text-gray-900 mb-4">Where To Eat</h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                From estate bungalow dining to cozy pilgrim cafes
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {restaurants.map((restaurant, index) => (
                <motion.div
                  key={restaurant.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card className="h-full overflow-hidden hover:shadow-lg transition-all">
                    <div className="relative h-40 overflow-hidden">
                      <img
                        src={restaurant.image}
                        alt={restaurant.name}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute top-3 right-3 bg-white/90 px-2 py-1 rounded-full flex items-center">
                        <Star className="h-3 w-3 text-yellow-500 fill-yellow-500 mr-1" />
                        <span className="text-xs font-medium">{restaurant.rating}</span>
                      </div>
                    </div>
                    <CardContent className="p-4">
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="font-bold">{restaurant.name}</h3>
                        <span className="text-emerald-600 font-semibold">{restaurant.priceRange}</span>
                      </div>
                      <p className="text-gray-500 text-xs mb-2">{restaurant.cuisine}</p>
                      <p className="text-gray-600 text-sm mb-3 line-clamp-2">{restaurant.description}</p>
                      <div className="flex flex-wrap gap-1 mb-3">
                        {restaurant.specialties.slice(0, 2).map((item, i) => (
                          <Badge key={i} variant="secondary" className="text-xs">
                            {item}
                          </Badge>
                        ))}
                      </div>
                      <div className="flex items-center text-xs text-gray-500">
                        <Clock className="h-3 w-3 mr-1" />
                        {restaurant.openHours}
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Hotels Section */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold text-gray-900 mb-4">Where To Stay</h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                From luxury tea bungalows to cozy guesthouses near Adam's Peak
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {hotels.map((hotel, index) => (
                <motion.div
                  key={hotel.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card className="h-full overflow-hidden hover:shadow-xl transition-all group">
                    <div className="relative h-52 overflow-hidden">
                      <img
                        src={hotel.image}
                        alt={hotel.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <div className="absolute top-4 left-4">
                        <Badge className="bg-emerald-600 text-white">{hotel.category}</Badge>
                      </div>
                      <div className="absolute top-4 right-4 bg-white/90 px-2 py-1 rounded-full flex items-center">
                        <Star className="h-4 w-4 text-yellow-500 fill-yellow-500 mr-1" />
                        <span className="text-sm font-medium">{hotel.rating}</span>
                      </div>
                    </div>
                    <CardContent className="p-6">
                      <h3 className="text-xl font-bold mb-2">{hotel.name}</h3>
                      <div className="flex items-center text-gray-500 text-sm mb-3">
                        <MapPin className="h-4 w-4 mr-1" />
                        {hotel.location}
                      </div>
                      <p className="text-gray-600 text-sm mb-4 line-clamp-2">{hotel.description}</p>
                      <div className="flex flex-wrap gap-2 mb-4">
                        {hotel.amenities.slice(0, 4).map((amenity, i) => (
                          <Badge key={i} variant="outline" className="text-xs">
                            {amenity}
                          </Badge>
                        ))}
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-emerald-600 font-bold">{hotel.priceRange}</span>
                        <Button
                          size="sm"
                          className="bg-emerald-600 hover:bg-emerald-700"
                          onClick={() => handleBookNow(hotel.name)}
                        >
                          Book Now
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Weather & Packing Section */}
        <section className="py-16 bg-gradient-to-br from-emerald-50 to-green-50">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold text-gray-900 mb-4">Weather & Packing</h2>
              <p className="text-gray-600">Plan your hill country adventure with the right essentials</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Weather Card */}
              <Card className="overflow-hidden">
                <CardHeader className="bg-gradient-to-r from-emerald-600 to-green-600 text-white">
                  <CardTitle className="flex items-center gap-2">
                    <Sun className="h-6 w-6" />
                    Climate Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="grid grid-cols-2 gap-4 mb-6">
                    <div className="text-center p-4 bg-gray-50 rounded-lg">
                      <Thermometer className="h-8 w-8 mx-auto mb-2 text-blue-500" />
                      <p className="text-sm text-gray-500">Temperature</p>
                      <p className="font-bold">{weatherInfo.temperature}</p>
                    </div>
                    <div className="text-center p-4 bg-gray-50 rounded-lg">
                      <Droplets className="h-8 w-8 mx-auto mb-2 text-blue-500" />
                      <p className="text-sm text-gray-500">Humidity</p>
                      <p className="font-bold">{weatherInfo.humidity}</p>
                    </div>
                  </div>
                  <div className="mb-4">
                    <p className="text-sm text-gray-500 mb-2">Best Months to Visit:</p>
                    <div className="flex flex-wrap gap-2">
                      {weatherInfo.bestMonths.map((month, i) => (
                        <Badge key={i} className="bg-emerald-100 text-emerald-700">
                          {month}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  <p className="text-sm text-gray-600">
                    <Cloud className="h-4 w-4 inline mr-1" />
                    {weatherInfo.rainfall}
                  </p>
                </CardContent>
              </Card>

              {/* Packing Tips Card */}
              <Card>
                <CardHeader className="bg-gradient-to-r from-emerald-600 to-green-600 text-white">
                  <CardTitle className="flex items-center gap-2">
                    <Luggage className="h-6 w-6" />
                    Packing Essentials
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {weatherInfo.packingTips.map((tip, i) => (
                      <div key={i} className="flex items-start gap-2">
                        <CheckCircle className="h-5 w-5 text-emerald-600 flex-shrink-0 mt-0.5" />
                        <span className="text-sm text-gray-700">{tip}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Travel Tips Section */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold text-gray-900 mb-4">Travel Tips</h2>
              <p className="text-gray-600">Essential information for your Hatton adventure</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {travelTips.map((tip, index) => {
                const IconComponent = getIconComponent(tip.icon);
                return (
                  <motion.div
                    key={tip.id}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Card className="h-full hover:shadow-lg transition-all">
                      <CardHeader>
                        <CardTitle className="flex items-center gap-3">
                          <div className="bg-emerald-100 p-3 rounded-xl">
                            <IconComponent className="h-6 w-6 text-emerald-600" />
                          </div>
                          <span className="text-lg">{tip.title}</span>
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <ul className="space-y-2">
                          {tip.tips.map((item, i) => (
                            <li key={i} className="flex items-start gap-2 text-sm text-gray-600">
                              <CheckCircle className="h-4 w-4 text-emerald-500 flex-shrink-0 mt-0.5" />
                              {item}
                            </li>
                          ))}
                        </ul>
                      </CardContent>
                    </Card>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 bg-gradient-to-r from-emerald-600 via-green-600 to-emerald-700">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center text-white">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
              >
                <Mountain className="h-16 w-16 mx-auto mb-6 opacity-80" />
                <h2 className="text-4xl md:text-5xl font-bold mb-4">
                  {ctaSection.title}
                </h2>
                <p className="text-xl mb-8 opacity-90">
                  {ctaSection.subtitle}
                </p>
                <div className="flex flex-wrap gap-4 justify-center">
                  <Button
                    size="lg"
                    className="bg-white text-emerald-600 hover:bg-gray-100 px-8"
                    onClick={() => handleBookNow('Hatton Complete Tour')}
                  >
                    <Compass className="mr-2 h-5 w-5" />
                    {ctaSection.buttonText}
                  </Button>
                  <Button
                    size="lg"
                    variant="outline"
                    className="border-white text-white hover:bg-white/20 px-8"
                    onClick={() => window.location.href = '/book-now'}
                  >
                    <Phone className="mr-2 h-5 w-5" />
                    Contact Us
                  </Button>
                </div>
              </motion.div>
            </div>
          </div>
        </section>
      </main>

      <Footer />

      {/* Booking Modal */}
      <EnhancedBookingModal
        isOpen={isBookingModalOpen}
        onClose={() => setIsBookingModalOpen(false)}
        selectedExperience={selectedExperience}
        destination="Hatton"
      />
    </>
  );
};

export default Hatton;
