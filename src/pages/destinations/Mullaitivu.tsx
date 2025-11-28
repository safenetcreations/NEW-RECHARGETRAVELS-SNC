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
  TreePine,
  Languages,
  CircleDollarSign,
  BookOpen,
  Church,
  Castle,
  Anchor,
  Bike,
  UtensilsCrossed,
  Leaf,
  Footprints,
  Trees,
  Bird,
  History,
  Gem
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

// Default Content for Mullaitivu
const defaultHeroSlides: HeroSlide[] = [
  {
    id: '1',
    image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&q=80',
    title: 'Welcome to Mullaitivu',
    subtitle: 'Pristine Beaches of Northern Sri Lanka'
  },
  {
    id: '2',
    image: 'https://images.unsplash.com/photo-1519046904884-53103b34b206?auto=format&fit=crop&q=80',
    title: 'Untouched Coastal Paradise',
    subtitle: 'Where Golden Sands Meet Azure Waters'
  },
  {
    id: '3',
    image: 'https://images.unsplash.com/photo-1476673160081-cf065c1a6c12?auto=format&fit=crop&q=80',
    title: 'Rich Heritage & War Memorials',
    subtitle: 'A Land of Resilience and Recovery'
  }
];

const defaultAttractions: Attraction[] = [
  {
    id: '1',
    name: 'Mullaitivu Beach',
    description: 'Stunning 12-kilometer stretch of pristine golden sand beach with crystal-clear waters. One of the most beautiful and least crowded beaches in Sri Lanka, perfect for swimming and relaxation.',
    image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&q=80',
    category: 'Beach',
    rating: 4.9,
    duration: 'Half Day',
    price: 'Free',
    highlights: ['Golden Sand', 'Crystal Waters', 'Swimming', 'Sunset Views'],
    icon: 'Waves'
  },
  {
    id: '2',
    name: 'Nandikadal Lagoon',
    description: 'A serene lagoon surrounded by lush greenery, perfect for birdwatching and kayaking. The calm waters reflect stunning sunsets and offer peaceful boat rides.',
    image: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&q=80',
    category: 'Nature',
    rating: 4.7,
    duration: '2-3 hours',
    price: 'Free',
    highlights: ['Birdwatching', 'Kayaking', 'Sunset Views', 'Peaceful Atmosphere'],
    icon: 'Fish'
  },
  {
    id: '3',
    name: 'Mullivaikkal Memorial',
    description: 'A poignant war memorial commemorating those who lost their lives during the civil conflict. An important site for understanding Sri Lanka\'s recent history and the path to reconciliation.',
    image: 'https://images.unsplash.com/photo-1599661046289-e31897846d41?auto=format&fit=crop&q=80',
    category: 'Memorial',
    rating: 4.5,
    duration: '1 hour',
    price: 'Free',
    highlights: ['War Memorial', 'Historical Site', 'Peaceful Reflection', 'Cultural Understanding'],
    icon: 'Landmark'
  },
  {
    id: '4',
    name: 'Kokkuthoduvai Beach',
    description: 'A hidden gem featuring untouched sandy shores lined with palm trees. Excellent for fishing, swimming, and experiencing authentic coastal village life.',
    image: 'https://images.unsplash.com/photo-1519046904884-53103b34b206?auto=format&fit=crop&q=80',
    category: 'Beach',
    rating: 4.6,
    duration: '3-4 hours',
    price: 'Free',
    highlights: ['Palm-lined Shore', 'Fishing Village', 'Swimming', 'Local Culture'],
    icon: 'Trees'
  },
  {
    id: '5',
    name: 'Mullaitivu Fishing Harbour',
    description: 'Bustling fishing harbour where you can witness traditional fishing methods, buy fresh catch, and experience the daily life of local fishermen.',
    image: 'https://images.unsplash.com/photo-1544551763-77ef2d0cfc6c?auto=format&fit=crop&q=80',
    category: 'Cultural',
    rating: 4.4,
    duration: '1-2 hours',
    price: 'Free',
    highlights: ['Fresh Seafood', 'Fishing Boats', 'Local Life', 'Morning Activity'],
    icon: 'Anchor'
  },
  {
    id: '6',
    name: 'Pudukudiyiruppu Beaches',
    description: 'Secluded beach stretch near PTK known for its pristine condition and lack of development. Perfect for those seeking solitude and natural beauty.',
    image: 'https://images.unsplash.com/photo-1473186578172-c141e6798cf4?auto=format&fit=crop&q=80',
    category: 'Beach',
    rating: 4.7,
    duration: 'Half Day',
    price: 'Free',
    highlights: ['Secluded Beach', 'Untouched Nature', 'Privacy', 'Scenic Views'],
    icon: 'Waves'
  }
];

const defaultActivities: Activity[] = [
  {
    id: '1',
    name: 'Beach Hopping Tour',
    description: 'Explore multiple pristine beaches along the Mullaitivu coastline in one day with a knowledgeable local guide',
    icon: 'Waves',
    price: 'From $45',
    duration: 'Full Day',
    difficulty: 'Easy',
    popular: true
  },
  {
    id: '2',
    name: 'Lagoon Kayaking',
    description: 'Paddle through the serene Nandikadal Lagoon, observing diverse bird species and enjoying peaceful waters',
    icon: 'Fish',
    price: 'From $35',
    duration: '2-3 hours',
    difficulty: 'Easy',
    popular: true
  },
  {
    id: '3',
    name: 'Deep Sea Fishing',
    description: 'Join local fishermen for an authentic deep-sea fishing experience in the rich waters off Mullaitivu',
    icon: 'Anchor',
    price: 'From $60',
    duration: '4-5 hours',
    difficulty: 'Moderate'
  },
  {
    id: '4',
    name: 'Sunrise Beach Yoga',
    description: 'Start your day with peaceful yoga sessions on the pristine beach as the sun rises over the ocean',
    icon: 'Sun',
    price: 'From $25',
    duration: '1.5 hours',
    difficulty: 'Easy'
  },
  {
    id: '5',
    name: 'Cultural Village Tour',
    description: 'Visit traditional Tamil fishing villages, meet locals, and learn about their way of life and recovery',
    icon: 'Users',
    price: 'From $30',
    duration: '3-4 hours',
    difficulty: 'Easy'
  },
  {
    id: '6',
    name: 'Photography Expedition',
    description: 'Capture stunning landscapes, beaches, sunsets, and local life with photography guidance',
    icon: 'Camera',
    price: 'From $50',
    duration: 'Full Day',
    difficulty: 'Easy'
  },
  {
    id: '7',
    name: 'Snorkeling Adventure',
    description: 'Discover colorful marine life and coral formations in the clear waters near Mullaitivu',
    icon: 'Fish',
    price: 'From $40',
    duration: '2-3 hours',
    difficulty: 'Moderate'
  },
  {
    id: '8',
    name: 'Sunset Boat Cruise',
    description: 'Romantic boat ride along the coast to witness spectacular sunsets over the Indian Ocean',
    icon: 'Ship',
    price: 'From $55',
    duration: '2 hours',
    difficulty: 'Easy'
  }
];

const defaultRestaurants: Restaurant[] = [
  {
    id: '1',
    name: 'Mullaitivu Seafood Hut',
    cuisine: 'Fresh Seafood',
    priceRange: '$',
    rating: 4.5,
    image: 'https://images.unsplash.com/photo-1559339352-11d035aa65de?auto=format&fit=crop&q=80',
    description: 'Fresh catch from local fishermen prepared with authentic Tamil spices. The best seafood experience in Mullaitivu.',
    specialties: ['Grilled Fish', 'Crab Curry', 'Prawn Masala', 'Fish Kottu'],
    openHours: '7:00 AM - 8:00 PM'
  },
  {
    id: '2',
    name: 'Beach View Restaurant',
    cuisine: 'Sri Lankan Tamil',
    priceRange: '$-$$',
    rating: 4.3,
    image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&q=80',
    description: 'Enjoy traditional Tamil cuisine with stunning views of the beach. Family-run establishment with homestyle cooking.',
    specialties: ['String Hoppers', 'Dosai', 'Fish Curry', 'Coconut Sambol'],
    openHours: '6:30 AM - 9:00 PM'
  },
  {
    id: '3',
    name: 'Nandikadal Lagoon Cafe',
    cuisine: 'Cafe & Local Food',
    priceRange: '$',
    rating: 4.2,
    image: 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?auto=format&fit=crop&q=80',
    description: 'Relaxed cafe atmosphere with views of the lagoon. Perfect for light meals and refreshments.',
    specialties: ['Fresh Juices', 'Rice & Curry', 'Short Eats', 'Tea & Coffee'],
    openHours: '8:00 AM - 6:00 PM'
  },
  {
    id: '4',
    name: 'PTK Fish Market Eatery',
    cuisine: 'Street Food & Seafood',
    priceRange: '$',
    rating: 4.4,
    image: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&q=80',
    description: 'Authentic local eatery near the fishing harbour. Choose your fish and have it cooked fresh.',
    specialties: ['Fresh Grilled Fish', 'Squid Fry', 'Fish Rolls', 'Cuttlefish Curry'],
    openHours: '6:00 AM - 7:00 PM'
  }
];

const defaultHotels: HotelInfo[] = [
  {
    id: '1',
    name: 'Lagoon View Resort',
    category: 'Boutique Resort',
    priceRange: 'From $80/night',
    rating: 4.4,
    image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&q=80',
    description: 'Comfortable resort overlooking Nandikadal Lagoon with modern amenities and traditional charm.',
    amenities: ['Lagoon View', 'Restaurant', 'Free WiFi', 'Air Conditioning', 'Tour Desk'],
    location: 'Near Nandikadal Lagoon'
  },
  {
    id: '2',
    name: 'Mullaitivu Beach Hotel',
    category: 'Beach Hotel',
    priceRange: 'From $65/night',
    rating: 4.2,
    image: 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?auto=format&fit=crop&q=80',
    description: 'Beachfront hotel offering direct access to Mullaitivu Beach. Simple rooms with ocean views.',
    amenities: ['Beach Access', 'Sea View Rooms', 'Restaurant', 'Parking', 'Beach Activities'],
    location: 'Mullaitivu Beach'
  },
  {
    id: '3',
    name: 'Northern Breeze Guesthouse',
    category: 'Guesthouse',
    priceRange: 'From $40/night',
    rating: 4.0,
    image: 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?auto=format&fit=crop&q=80',
    description: 'Cozy family-run guesthouse offering authentic hospitality and home-cooked Tamil meals.',
    amenities: ['Home-cooked Meals', 'Local Tours', 'WiFi', 'Fan Rooms', 'Bicycle Rental'],
    location: 'Mullaitivu Town'
  },
  {
    id: '4',
    name: 'Coastal Paradise Inn',
    category: 'Budget Inn',
    priceRange: 'From $35/night',
    rating: 3.8,
    image: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&q=80',
    description: 'Affordable accommodation close to the beach. Basic but clean rooms with friendly service.',
    amenities: ['Near Beach', 'Basic Rooms', 'Shared Kitchen', 'Hot Water', 'Parking'],
    location: 'Near Mullaitivu Beach'
  },
  {
    id: '5',
    name: 'Sunrise Beach Camp',
    category: 'Eco Camp',
    priceRange: 'From $50/night',
    rating: 4.3,
    image: 'https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?auto=format&fit=crop&q=80',
    description: 'Unique beachfront glamping experience with comfortable tents overlooking the ocean.',
    amenities: ['Beachfront Tents', 'Campfire Dinners', 'Sunrise Views', 'Beach Access', 'Eco-friendly'],
    location: 'Kokkuthoduvai Beach'
  }
];

const defaultWeatherInfo: WeatherInfo = {
  season: 'Tropical Monsoon Climate',
  temperature: '26-33°C (79-91°F)',
  rainfall: 'Dry: Feb-Sep, Monsoon: Oct-Jan',
  humidity: '70-85%',
  bestMonths: ['February', 'March', 'April', 'May', 'June', 'July', 'August', 'September'],
  packingTips: [
    'Light cotton clothing for tropical heat',
    'Strong sunscreen (SPF 50+) essential',
    'Wide-brimmed hat and quality sunglasses',
    'Comfortable sandals and water shoes',
    'Swimwear and quick-dry towels',
    'Insect repellent for evening',
    'Reusable water bottle',
    'Waterproof bag for electronics'
  ]
};

const defaultTravelTips: TravelTip[] = [
  {
    id: '1',
    title: 'Getting to Mullaitivu',
    icon: 'Car',
    tips: [
      'From Colombo: 8-9 hours by car via A9 highway',
      'From Jaffna: 2-3 hours by road',
      'From Trincomalee: 3-4 hours via coastal route',
      'No direct train service - drive or bus',
      'Private car/driver recommended for flexibility',
      'Road conditions have improved significantly'
    ]
  },
  {
    id: '2',
    title: 'Essential Preparations',
    icon: 'Shield',
    tips: [
      'Carry enough cash - limited ATMs available',
      'Mobile signal available but can be weak',
      'Fuel up before leaving major towns',
      'Book accommodation in advance (limited options)',
      'Carry basic medicines and first aid',
      'Learn a few Tamil phrases - locals appreciate it'
    ]
  },
  {
    id: '3',
    title: 'Beach Safety',
    icon: 'Waves',
    tips: [
      'Swim only in designated safe areas',
      'Be aware of strong currents at some beaches',
      'No lifeguards on most beaches',
      'Avoid swimming during monsoon season',
      'Respect local customs - modest swimwear',
      'Keep valuables secure on beach'
    ]
  },
  {
    id: '4',
    title: 'Best Time to Visit',
    icon: 'Calendar',
    tips: [
      'February to September: Ideal beach weather',
      'March to May: Best for swimming',
      'Avoid October to January (northeast monsoon)',
      'Weekdays less crowded than weekends',
      'Early morning best for photography',
      'Evening best for sunset boat rides'
    ]
  },
  {
    id: '5',
    title: 'Cultural Sensitivity',
    icon: 'Heart',
    tips: [
      'Respect war memorial sites and local sentiments',
      'Ask permission before photographing locals',
      'Dress modestly when visiting villages',
      'Remove shoes at temples and homes',
      'Support local businesses and guides',
      'Be patient - this region is still recovering'
    ]
  }
];

const defaultDestinationInfo: DestinationInfo = {
  population: '~92,000 (district)',
  area: '2,617 km²',
  elevation: '0-50 m',
  bestTime: 'Feb - Sep',
  language: 'Tamil',
  currency: 'LKR / USD'
};

const defaultSEOSettings: SEOSettings = {
  title: 'Mullaitivu Sri Lanka - Pristine Beaches, Lagoons & Northern Heritage | Recharge Travels',
  description: 'Discover Mullaitivu in Northern Sri Lanka. Explore pristine beaches, Nandikadal Lagoon, fishing villages, and experience authentic Tamil culture. Complete travel guide with hotels and tours.',
  keywords: 'Mullaitivu Sri Lanka, Mullaitivu beach, Northern Sri Lanka beaches, Nandikadal Lagoon, Tamil fishing villages, Mullaitivu hotels, Mullaitivu tours, off the beaten path Sri Lanka'
};

const defaultCTASection: CTASection = {
  title: 'Ready to Explore Mullaitivu?',
  subtitle: 'Experience untouched beaches, serene lagoons, and authentic Northern Sri Lankan culture',
  buttonText: 'Book Your Coastal Adventure',
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
    'Palmtree': TreePine,
    'TreePalm': TreePine,
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
    'Fish': Fish,
    'Languages': Languages,
    'CircleDollarSign': CircleDollarSign,
    'BookOpen': BookOpen,
    'Temple': Church,
    'Church': Church,
    'Castle': Castle,
    'Anchor': Anchor,
    'Bike': Bike,
    'UtensilsCrossed': UtensilsCrossed,
    'Leaf': Leaf,
    'Footprints': Footprints,
    'Bird': Bird,
    'History': History,
    'Gem': Gem,
    'Tent': Building,
    'Sailboat': Ship
  };
  return iconMap[iconName] || Info;
};

const Mullaitivu: React.FC = () => {
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
  const [expandedSection, setExpandedSection] = useState<string | null>('attractions');

  // Load content from Firebase
  useEffect(() => {
    const loadContent = async () => {
      try {
        const data = await getDestinationBySlug('mullaitivu');
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
        console.log('Using default content for Mullaitivu');
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

  const toggleSection = (section: string) => {
    setExpandedSection(expandedSection === section ? null : section);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-cyan-50 to-blue-100">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-cyan-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-cyan-800 font-medium">Loading Mullaitivu...</p>
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
        <meta property="og:url" content="https://www.rechargetravels.com/destinations/mullaitivu" />
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="Recharge Travels" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={seoSettings.title} />
        <meta name="twitter:description" content={seoSettings.description} />
        <meta name="twitter:image" content={heroSlides[0]?.image} />
        <link rel="canonical" href="https://www.rechargetravels.com/destinations/mullaitivu" />
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
                <Badge className="bg-cyan-500/80 text-white px-4 py-1 text-sm">
                  Northern Sri Lanka's Hidden Beach Paradise
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
                  className="bg-cyan-600 hover:bg-cyan-700 text-white px-8"
                  onClick={() => handleBookNow('Mullaitivu Tour')}
                >
                  <Compass className="mr-2 h-5 w-5" />
                  Explore Mullaitivu
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="border-white text-white hover:bg-white/20 px-8"
                  onClick={() => toggleSection('attractions')}
                >
                  <MapPin className="mr-2 h-5 w-5" />
                  View Attractions
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
                className={`w-3 h-3 rounded-full transition-all ${currentSlide === index ? 'bg-white w-8' : 'bg-white/50'
                  }`}
              />
            ))}
          </div>
        </section>

        {/* Quick Info Bar */}
        <section className="bg-gradient-to-r from-cyan-600 to-blue-600 py-4">
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
                  Discover Mullaitivu
                </h2>
                <p className="text-lg text-gray-600 leading-relaxed mb-8">
                  Mullaitivu, located in the Northern Province of Sri Lanka, is an emerging destination
                  known for its pristine beaches, serene lagoons, and authentic Tamil fishing communities.
                  Once a region heavily affected by civil conflict, Mullaitivu has transformed into a
                  peaceful coastal paradise offering untouched natural beauty and genuine cultural
                  experiences. The district boasts over 60 kilometers of golden coastline, crystal-clear
                  waters, and the beautiful Nandikadal Lagoon—perfect for travelers seeking an
                  off-the-beaten-path adventure in Sri Lanka.
                </p>
                <div className="flex flex-wrap justify-center gap-3">
                  <Badge variant="secondary" className="px-4 py-2">
                    <Waves className="h-4 w-4 mr-2" /> Pristine Beaches
                  </Badge>
                  <Badge variant="secondary" className="px-4 py-2">
                    <Fish className="h-4 w-4 mr-2" /> Lagoon Paradise
                  </Badge>
                  <Badge variant="secondary" className="px-4 py-2">
                    <Anchor className="h-4 w-4 mr-2" /> Fishing Culture
                  </Badge>
                  <Badge variant="secondary" className="px-4 py-2">
                    <Heart className="h-4 w-4 mr-2" /> Authentic Experiences
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
                Explore the best beaches, lagoons, and cultural sites in Mullaitivu
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
                          <Badge className="bg-cyan-600 text-white">
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
                          <IconComponent className="h-5 w-5 text-cyan-600" />
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
                          <span className="flex items-center font-semibold text-cyan-600">
                            {attraction.price}
                          </span>
                        </div>
                        <Button
                          className="w-full bg-cyan-600 hover:bg-cyan-700"
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
                Adventure, relaxation, and cultural experiences await in Mullaitivu
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
                    <Card className={`h-full hover:shadow-lg transition-all duration-300 ${activity.popular ? 'border-cyan-500 border-2' : ''}`}>
                      <CardContent className="p-6">
                        {activity.popular && (
                          <Badge className="bg-cyan-100 text-cyan-700 mb-3">
                            <Sparkles className="h-3 w-3 mr-1" /> Popular
                          </Badge>
                        )}
                        <div className="bg-cyan-100 w-14 h-14 rounded-xl flex items-center justify-center mb-4">
                          <IconComponent className="h-7 w-7 text-cyan-600" />
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
                          <span className="font-bold text-cyan-600">{activity.price}</span>
                        </div>
                        {activity.difficulty && (
                          <Badge variant="outline" className="mb-4">
                            {activity.difficulty}
                          </Badge>
                        )}
                        <Button
                          variant="outline"
                          className="w-full border-cyan-600 text-cyan-600 hover:bg-cyan-50"
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
                Savor fresh seafood and authentic Tamil cuisine
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
                        <span className="text-cyan-600 font-semibold">{restaurant.priceRange}</span>
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
                From beachfront resorts to cozy guesthouses and unique camping experiences
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
                        <Badge className="bg-cyan-600 text-white">{hotel.category}</Badge>
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
                        <span className="text-cyan-600 font-bold">{hotel.priceRange}</span>
                        <Button
                          size="sm"
                          className="bg-cyan-600 hover:bg-cyan-700"
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
        <section className="py-16 bg-gradient-to-br from-cyan-50 to-blue-50">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold text-gray-900 mb-4">Weather & Packing</h2>
              <p className="text-gray-600">Plan your trip with the right essentials</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Weather Card */}
              <Card className="overflow-hidden">
                <CardHeader className="bg-gradient-to-r from-cyan-600 to-blue-600 text-white">
                  <CardTitle className="flex items-center gap-2">
                    <Sun className="h-6 w-6" />
                    Climate Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="grid grid-cols-2 gap-4 mb-6">
                    <div className="text-center p-4 bg-gray-50 rounded-lg">
                      <Thermometer className="h-8 w-8 mx-auto mb-2 text-orange-500" />
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
                        <Badge key={i} className="bg-cyan-100 text-cyan-700">
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
                <CardHeader className="bg-gradient-to-r from-cyan-600 to-blue-600 text-white">
                  <CardTitle className="flex items-center gap-2">
                    <Luggage className="h-6 w-6" />
                    Packing Essentials
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {weatherInfo.packingTips.map((tip, i) => (
                      <div key={i} className="flex items-start gap-2">
                        <CheckCircle className="h-5 w-5 text-cyan-600 flex-shrink-0 mt-0.5" />
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
              <p className="text-gray-600">Essential information for your Mullaitivu adventure</p>
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
                          <div className="bg-cyan-100 p-3 rounded-xl">
                            <IconComponent className="h-6 w-6 text-cyan-600" />
                          </div>
                          <span className="text-lg">{tip.title}</span>
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <ul className="space-y-2">
                          {tip.tips.map((item, i) => (
                            <li key={i} className="flex items-start gap-2 text-sm text-gray-600">
                              <CheckCircle className="h-4 w-4 text-cyan-500 flex-shrink-0 mt-0.5" />
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
        <section className="py-20 bg-gradient-to-r from-cyan-600 via-blue-600 to-cyan-700">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center text-white">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
              >
                <Waves className="h-16 w-16 mx-auto mb-6 opacity-80" />
                <h2 className="text-4xl md:text-5xl font-bold mb-4">
                  {ctaSection.title}
                </h2>
                <p className="text-xl mb-8 opacity-90">
                  {ctaSection.subtitle}
                </p>
                <div className="flex flex-wrap gap-4 justify-center">
                  <Button
                    size="lg"
                    className="bg-white text-cyan-600 hover:bg-gray-100 px-8"
                    onClick={() => handleBookNow('Mullaitivu Complete Tour')}
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
        destination="Mullaitivu"
      />
    </>
  );
};

export default Mullaitivu;
