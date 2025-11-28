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

// Default Content for Delft Island
const defaultHeroSlides: HeroSlide[] = [
  {
    id: '1',
    image: 'https://images.unsplash.com/photo-1596895111956-bf1cf0599ce5?auto=format&fit=crop&q=80',
    title: 'Welcome to Delft Island',
    subtitle: 'The Untouched Gem of Jaffna Peninsula'
  },
  {
    id: '2',
    image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&q=80',
    title: 'Wild Ponies & Baobab Trees',
    subtitle: 'Where Nature Reigns Supreme'
  },
  {
    id: '3',
    image: 'https://images.unsplash.com/photo-1559128010-7c1ad6e1b6a5?auto=format&fit=crop&q=80',
    title: 'Dutch Colonial Heritage',
    subtitle: 'Explore Ancient Ruins & History'
  }
];

const defaultAttractions: Attraction[] = [
  {
    id: '1',
    name: 'Wild Ponies of Delft',
    description: 'Descendants of Portuguese-era horses roaming freely across the island. These iconic wild ponies are a unique sight and the most famous attraction of Delft Island.',
    image: 'https://images.unsplash.com/photo-1553284965-83fd3e82fa5a?auto=format&fit=crop&q=80',
    category: 'Wildlife',
    rating: 4.9,
    duration: '2-3 hours',
    price: 'Free',
    highlights: ['Wild Horses', 'Photography', 'Untouched Nature', 'Colonial History'],
    icon: 'Footprints'
  },
  {
    id: '2',
    name: 'Giant Baobab Tree',
    description: 'Ancient baobab tree believed to be over 600 years old, brought by Arab traders. One of the oldest and largest baobab trees in Sri Lanka.',
    image: 'https://images.unsplash.com/photo-1509316785289-025f5b846b35?auto=format&fit=crop&q=80',
    category: 'Natural Wonder',
    rating: 4.8,
    duration: '1 hour',
    price: 'Free',
    highlights: ['600+ Years Old', 'Arab Heritage', 'Giant Tree', 'Historic Site'],
    icon: 'Trees'
  },
  {
    id: '3',
    name: 'Dutch Fort Ruins',
    description: 'Remnants of a Portuguese and Dutch colonial fort dating back to the 17th century. Explore the ruins and imagine the island\'s strategic importance.',
    image: 'https://images.unsplash.com/photo-1599661046289-e31897846d41?auto=format&fit=crop&q=80',
    category: 'Historical',
    rating: 4.5,
    duration: '1-2 hours',
    price: 'Free',
    highlights: ['Colonial Ruins', '17th Century', 'Historic Fort', 'Photography'],
    icon: 'Castle'
  },
  {
    id: '4',
    name: 'Queens Tower (Quay)',
    description: 'Historic stone structure built during the Dutch colonial period, once used as a navigational landmark for ships approaching the island.',
    image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&q=80',
    category: 'Historical',
    rating: 4.4,
    duration: '30 mins',
    price: 'Free',
    highlights: ['Dutch Architecture', 'Coastal Views', 'Historic Landmark', 'Navigation Tower'],
    icon: 'Landmark'
  },
  {
    id: '5',
    name: 'Delft Beach & Coral Reefs',
    description: 'Pristine beaches with crystal-clear waters and vibrant coral formations. Perfect for swimming, snorkeling, and enjoying untouched coastal beauty.',
    image: 'https://images.unsplash.com/photo-1519046904884-53103b34b206?auto=format&fit=crop&q=80',
    category: 'Beach',
    rating: 4.6,
    duration: 'Half Day',
    price: 'Free',
    highlights: ['Crystal Waters', 'Coral Reefs', 'Swimming', 'Snorkeling'],
    icon: 'Waves'
  },
  {
    id: '6',
    name: 'Pigeon House',
    description: 'Unique stone structure built by the Dutch for breeding pigeons used as messengers. An interesting example of colonial-era communication systems.',
    image: 'https://images.unsplash.com/photo-1548199973-03cce0bbc87b?auto=format&fit=crop&q=80',
    category: 'Historical',
    rating: 4.3,
    duration: '30 mins',
    price: 'Free',
    highlights: ['Dutch Colonial', 'Pigeon Breeding', 'Unique Structure', 'Communication History'],
    icon: 'Bird'
  }
];

const defaultActivities: Activity[] = [
  {
    id: '1',
    name: 'Wild Pony Safari',
    description: 'Guided tour to spot and photograph the famous wild ponies of Delft Island in their natural habitat',
    icon: 'Footprints',
    price: 'From $35',
    duration: '3-4 hours',
    difficulty: 'Easy',
    popular: true
  },
  {
    id: '2',
    name: 'Historical Walking Tour',
    description: 'Explore Dutch colonial ruins, the ancient baobab tree, and learn about the island\'s fascinating history',
    icon: 'History',
    price: 'From $25',
    duration: 'Half Day',
    difficulty: 'Easy',
    popular: true
  },
  {
    id: '3',
    name: 'Snorkeling Adventure',
    description: 'Discover vibrant coral reefs and marine life in the crystal-clear waters surrounding Delft Island',
    icon: 'Fish',
    price: 'From $40',
    duration: '2-3 hours',
    difficulty: 'Moderate'
  },
  {
    id: '4',
    name: 'Photography Expedition',
    description: 'Capture stunning landscapes, wild ponies, and colonial ruins with expert photography guidance',
    icon: 'Camera',
    price: 'From $50',
    duration: 'Full Day',
    difficulty: 'Easy'
  },
  {
    id: '5',
    name: 'Island Cycling Tour',
    description: 'Explore the flat terrain of Delft Island by bicycle, visiting all major attractions',
    icon: 'Bike',
    price: 'From $30',
    duration: '4-5 hours',
    difficulty: 'Moderate'
  },
  {
    id: '6',
    name: 'Village Cultural Experience',
    description: 'Visit local fishing villages, meet the friendly inhabitants, and learn about island life',
    icon: 'Users',
    price: 'From $20',
    duration: '2-3 hours',
    difficulty: 'Easy'
  }
];

const defaultRestaurants: Restaurant[] = [
  {
    id: '1',
    name: 'Local Village Eatery',
    cuisine: 'Traditional Tamil',
    priceRange: '$',
    rating: 4.3,
    image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&q=80',
    description: 'Authentic home-style Tamil cooking by local families. Fresh seafood and traditional dishes prepared with island ingredients.',
    specialties: ['Fresh Fish Curry', 'Crab Masala', 'String Hoppers', 'Coconut Rice'],
    openHours: '8:00 AM - 6:00 PM'
  },
  {
    id: '2',
    name: 'Fisherman\'s Catch',
    cuisine: 'Fresh Seafood',
    priceRange: '$',
    rating: 4.5,
    image: 'https://images.unsplash.com/photo-1559339352-11d035aa65de?auto=format&fit=crop&q=80',
    description: 'Simple beachside dining with the freshest catch from local fishermen. Best seafood experience on the island.',
    specialties: ['Grilled Fish', 'Prawns', 'Squid Curry', 'Lobster (seasonal)'],
    openHours: '10:00 AM - 5:00 PM'
  }
];

const defaultHotels: HotelInfo[] = [
  {
    id: '1',
    name: 'Delft Island Guesthouse',
    category: 'Basic Guesthouse',
    priceRange: 'From $30/night',
    rating: 3.8,
    image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&q=80',
    description: 'Simple but clean accommodation run by a local family. Authentic island experience with home-cooked meals.',
    amenities: ['Home-cooked Meals', 'Basic Rooms', 'Local Guide', 'Island Tours'],
    location: 'Main Village'
  },
  {
    id: '2',
    name: 'Stay in Jaffna',
    category: 'Recommended Alternative',
    priceRange: 'From $60-120/night',
    rating: 4.5,
    image: 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?auto=format&fit=crop&q=80',
    description: 'For more comfort, stay in Jaffna hotels and take a day trip to Delft Island. Multiple hotel options available.',
    amenities: ['Modern Amenities', 'Day Trip Booking', 'Transport Arranged', 'Various Options'],
    location: 'Jaffna City'
  }
];

const defaultWeatherInfo: WeatherInfo = {
  season: 'Tropical Dry Climate',
  temperature: '25-34°C (77-93°F)',
  rainfall: 'Very Low Feb-Sep, Monsoon Oct-Jan',
  humidity: '65-75%',
  bestMonths: ['February', 'March', 'April', 'May', 'June', 'July', 'August', 'September'],
  packingTips: [
    'Light cotton clothing for hot weather',
    'Strong sunscreen (SPF 50+)',
    'Wide-brimmed hat and sunglasses',
    'Comfortable walking shoes for rough terrain',
    'Swimwear and towel for beaches',
    'Plenty of water (limited availability on island)',
    'Snacks (limited food options)',
    'Camera with extra batteries'
  ]
};

const defaultTravelTips: TravelTip[] = [
  {
    id: '1',
    title: 'Getting to Delft Island',
    icon: 'Ship',
    tips: [
      'Boat from Kurikattuwan Jetty (Punkudutivu)',
      'Ferry takes approximately 1 hour each way',
      'First boat: 8:00 AM, Last return: 4:00 PM',
      'Limited boats - arrive early!',
      'Rough seas during monsoon (Oct-Jan)',
      'Book private boat for flexibility'
    ]
  },
  {
    id: '2',
    title: 'Essential Preparations',
    icon: 'Shield',
    tips: [
      'Bring all food and water you need',
      'No ATMs on the island - bring cash',
      'Very limited mobile signal',
      'Start early to cover all attractions',
      'Hire a local guide for best experience',
      'Wear comfortable walking shoes'
    ]
  },
  {
    id: '3',
    title: 'Wildlife Etiquette',
    icon: 'Footprints',
    tips: [
      'Do not feed or approach wild ponies',
      'Keep safe distance for photography',
      'Respect the natural habitat',
      'Do not litter - take trash back',
      'Be quiet near wildlife areas',
      'Follow guide instructions'
    ]
  },
  {
    id: '4',
    title: 'Best Time to Visit',
    icon: 'Calendar',
    tips: [
      'February to September: Ideal weather',
      'Avoid October to January (monsoon)',
      'Weekdays are less crowded',
      'Full day recommended for exploration',
      'Early morning for best wildlife viewing',
      'Plan for full-day trip from Jaffna'
    ]
  }
];

const defaultDestinationInfo: DestinationInfo = {
  population: '~4,000',
  area: '50 km²',
  elevation: '2-5 m',
  bestTime: 'Feb - Sep',
  language: 'Tamil',
  currency: 'LKR / USD'
};

const defaultSEOSettings: SEOSettings = {
  title: 'Delft Island Jaffna - Wild Ponies, Baobab Trees & Dutch Ruins | Recharge Travels',
  description: 'Explore Delft Island in Jaffna, Sri Lanka. Discover wild ponies, ancient baobab trees, Dutch colonial ruins, and pristine beaches. Complete travel guide with tours and tips.',
  keywords: 'Delft Island Sri Lanka, Jaffna islands, wild ponies Delft, baobab tree Sri Lanka, Dutch ruins Jaffna, island hopping Jaffna, Neduntheevu, Delft Island tour'
};

const defaultCTASection: CTASection = {
  title: 'Ready to Explore Delft Island?',
  subtitle: 'Experience the wild beauty, colonial heritage, and untouched nature of this remote island paradise',
  buttonText: 'Book Your Island Adventure',
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
    'Castle': Castle,
    'Anchor': Anchor,
    'Bike': Bike,
    'UtensilsCrossed': UtensilsCrossed,
    'Leaf': Leaf,
    'Footprints': Footprints,
    'Bird': Bird,
    'History': History,
    'Gem': Gem
  };
  return iconMap[iconName] || Landmark;
};

const DelftIsland = () => {
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
        const data = await getDestinationBySlug('delft-island');
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
        console.error('Error loading Delft Island content:', error);
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
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-teal-50 to-cyan-100">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-teal-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-teal-800 font-medium">Loading Delft Island...</p>
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
        <meta property="og:url" content="https://www.rechargetravels.com/destinations/delft-island" />
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="Recharge Travels" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={seoSettings.title} />
        <meta name="twitter:description" content={seoSettings.description} />
        <meta name="twitter:image" content={heroSlides[0]?.image} />
        <link rel="canonical" href="https://www.rechargetravels.com/destinations/delft-island" />
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
                <Badge className="bg-teal-600/80 text-white text-sm px-4 py-1">
                  Remote Island Paradise
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
                  className="bg-teal-600 hover:bg-teal-700 text-white px-8 py-6 text-lg"
                  onClick={() => handleBooking('Delft Island Day Trip')}
                >
                  Book Island Tour
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
                    <Users className="w-6 h-6 text-teal-600 mb-2" />
                    <span className="text-sm text-muted-foreground">Population</span>
                    <span className="font-semibold">{destinationInfo.population}</span>
                  </div>
                  <div className="flex flex-col items-center">
                    <MapPin className="w-6 h-6 text-teal-600 mb-2" />
                    <span className="text-sm text-muted-foreground">Area</span>
                    <span className="font-semibold">{destinationInfo.area}</span>
                  </div>
                  <div className="flex flex-col items-center">
                    <Thermometer className="w-6 h-6 text-teal-600 mb-2" />
                    <span className="text-sm text-muted-foreground">Temperature</span>
                    <span className="font-semibold">{weatherInfo.temperature}</span>
                  </div>
                  <div className="flex flex-col items-center">
                    <Calendar className="w-6 h-6 text-teal-600 mb-2" />
                    <span className="text-sm text-muted-foreground">Best Time</span>
                    <span className="font-semibold">{destinationInfo.bestTime}</span>
                  </div>
                  <div className="flex flex-col items-center">
                    <Languages className="w-6 h-6 text-teal-600 mb-2" />
                    <span className="text-sm text-muted-foreground">Language</span>
                    <span className="font-semibold">{destinationInfo.language}</span>
                  </div>
                  <div className="flex flex-col items-center">
                    <Ship className="w-6 h-6 text-teal-600 mb-2" />
                    <span className="text-sm text-muted-foreground">Access</span>
                    <span className="font-semibold">Boat Only</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Island Introduction */}
        <section className="py-12 px-4 bg-gradient-to-b from-teal-50/50 to-white">
          <div className="container mx-auto max-w-4xl text-center">
            <h2 className="text-3xl font-bold mb-6">Discover Delft Island (Neduntheevu)</h2>
            <p className="text-lg text-muted-foreground leading-relaxed">
              Delft Island, locally known as Neduntheevu, is the largest island in the Jaffna Peninsula and one of Sri Lanka's most remote destinations. 
              Famous for its wild ponies, ancient baobab trees, and Dutch colonial ruins, this untouched paradise offers a unique glimpse into 
              colonial history and natural beauty. The island's flat terrain, limestone formations, and lack of modern development make it 
              feel like stepping back in time.
            </p>
          </div>
        </section>

        {/* Tabs Navigation */}
        <nav id="content" className="sticky top-0 z-40 bg-white border-b shadow-sm">
          <div className="container mx-auto px-4">
            <div className="flex overflow-x-auto scrollbar-hide">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setSelectedTab(tab.id)}
                  className={`px-6 py-4 font-medium transition-all whitespace-nowrap border-b-2 ${
                    selectedTab === tab.id
                      ? 'border-teal-600 text-teal-600'
                      : 'border-transparent text-muted-foreground hover:text-foreground'
                  }`}
                >
                  {tab.label}
                  {tab.count && (
                    <Badge variant="secondary" className="ml-2 bg-teal-100 text-teal-700">
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
                  <h2 className="text-4xl font-bold mb-4">Top Attractions in Delft Island</h2>
                  <p className="text-muted-foreground max-w-2xl mx-auto">
                    Wild ponies, ancient baobab trees, and Dutch colonial heritage await
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
                              <Badge className="bg-teal-600 text-white">
                                {attraction.category}
                              </Badge>
                            </div>
                            <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm rounded-full p-2">
                              <IconComponent className="w-5 h-5 text-teal-600" />
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
                                <Badge key={idx} variant="outline" className="text-xs border-teal-200 text-teal-700">
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
                              className="w-full bg-teal-600 hover:bg-teal-700"
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
                  <h2 className="text-4xl font-bold mb-4">Things to Do on Delft Island</h2>
                  <p className="text-muted-foreground max-w-2xl mx-auto">
                    From wildlife safaris to historical exploration, discover unique island experiences
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
                                <div className="p-3 bg-teal-100 rounded-xl mr-4">
                                  <IconComponent className="w-6 h-6 text-teal-600" />
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
                              <span className="text-teal-600 font-semibold">{activity.price}</span>
                              <span className="text-muted-foreground">{activity.duration}</span>
                            </div>
                            {activity.difficulty && (
                              <Badge variant="outline" className="mb-4 border-teal-200">
                                {activity.difficulty}
                              </Badge>
                            )}
                            <Button
                              variant="outline"
                              className="w-full border-teal-600 text-teal-600 hover:bg-teal-600 hover:text-white"
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
                  <h2 className="text-4xl font-bold mb-4">Dining on Delft Island</h2>
                  <p className="text-muted-foreground max-w-2xl mx-auto">
                    Limited but authentic local dining options - bring snacks and water!
                  </p>
                </div>
                
                {/* Important Notice */}
                <Card className="mb-8 border-amber-200 bg-amber-50">
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <Info className="w-6 h-6 text-amber-600 flex-shrink-0 mt-1" />
                      <div>
                        <h3 className="font-semibold text-amber-800 mb-2">Important: Limited Food Options</h3>
                        <p className="text-amber-700 text-sm">
                          Delft Island has very limited food and water availability. We strongly recommend bringing your own 
                          snacks, lunch, and plenty of water (at least 2-3 liters per person). Local eateries may be closed 
                          or have limited offerings. Pre-order meals through your tour operator for a worry-free experience.
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

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
                              <Badge variant="outline" className="border-teal-200 text-teal-700">
                                {restaurant.cuisine}
                              </Badge>
                              <Badge className="bg-teal-100 text-teal-700">
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
                  <h2 className="text-4xl font-bold mb-4">Where to Stay</h2>
                  <p className="text-muted-foreground max-w-2xl mx-auto">
                    Very limited accommodation on the island - day trips from Jaffna recommended
                  </p>
                </div>

                {/* Recommendation Notice */}
                <Card className="mb-8 border-teal-200 bg-teal-50">
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <Info className="w-6 h-6 text-teal-600 flex-shrink-0 mt-1" />
                      <div>
                        <h3 className="font-semibold text-teal-800 mb-2">Recommended: Day Trip from Jaffna</h3>
                        <p className="text-teal-700 text-sm">
                          Delft Island is best visited as a day trip from Jaffna. Accommodation on the island is very basic 
                          with limited amenities. For a comfortable experience, we recommend staying in Jaffna's hotels and 
                          booking a full-day island tour. This allows you to explore all attractions and return to comfortable 
                          accommodation in the evening.
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

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
                            <Badge className="bg-teal-600 text-white">{hotel.category}</Badge>
                          </div>
                          <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm rounded-full px-3 py-1 flex items-center">
                            <Star className="w-4 h-4 text-yellow-500 fill-current" />
                            <span className="ml-1 text-sm font-medium">{hotel.rating}</span>
                          </div>
                        </div>
                        <CardContent className="p-6">
                          <div className="flex items-start justify-between mb-2">
                            <h3 className="text-xl font-bold">{hotel.name}</h3>
                            <span className="text-teal-600 font-semibold text-sm">{hotel.priceRange}</span>
                          </div>
                          <div className="flex items-center text-sm text-muted-foreground mb-3">
                            <MapPin className="w-4 h-4 mr-1" />
                            {hotel.location}
                          </div>
                          <p className="text-muted-foreground text-sm mb-4">{hotel.description}</p>
                          <div className="flex flex-wrap gap-2 mb-4">
                            {hotel.amenities.slice(0, 4).map((amenity, idx) => (
                              <Badge key={idx} variant="outline" className="text-xs border-teal-200">
                                {amenity}
                              </Badge>
                            ))}
                          </div>
                          <Button
                            className="w-full bg-teal-600 hover:bg-teal-700"
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
                  <h2 className="text-4xl font-bold mb-4">Weather on Delft Island</h2>
                  <p className="text-muted-foreground max-w-2xl mx-auto">
                    Plan your visit with our comprehensive weather guide
                  </p>
                </div>
                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
                  <Card className="text-center p-6 bg-gradient-to-br from-teal-50 to-cyan-50">
                    <Thermometer className="w-10 h-10 text-teal-600 mx-auto mb-3" />
                    <h3 className="font-semibold mb-1">Temperature</h3>
                    <p className="text-2xl font-bold text-teal-600">{weatherInfo.temperature}</p>
                  </Card>
                  <Card className="text-center p-6 bg-gradient-to-br from-teal-50 to-cyan-50">
                    <Sun className="w-10 h-10 text-teal-600 mx-auto mb-3" />
                    <h3 className="font-semibold mb-1">Climate</h3>
                    <p className="text-lg font-medium text-teal-600">{weatherInfo.season}</p>
                  </Card>
                  <Card className="text-center p-6 bg-gradient-to-br from-teal-50 to-cyan-50">
                    <Droplets className="w-10 h-10 text-teal-600 mx-auto mb-3" />
                    <h3 className="font-semibold mb-1">Humidity</h3>
                    <p className="text-2xl font-bold text-teal-600">{weatherInfo.humidity}</p>
                  </Card>
                  <Card className="text-center p-6 bg-gradient-to-br from-teal-50 to-cyan-50">
                    <Wind className="w-10 h-10 text-teal-600 mx-auto mb-3" />
                    <h3 className="font-semibold mb-1">Rainfall</h3>
                    <p className="text-sm font-medium text-teal-600">{weatherInfo.rainfall}</p>
                  </Card>
                </div>

                <div className="grid md:grid-cols-2 gap-8">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Calendar className="w-5 h-5 text-teal-600" />
                        Best Months to Visit
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="flex flex-wrap gap-2">
                        {weatherInfo.bestMonths.map((month, idx) => (
                          <Badge key={idx} className="bg-teal-100 text-teal-700 px-4 py-2">
                            {month}
                          </Badge>
                        ))}
                      </div>
                      <p className="text-muted-foreground mt-4 text-sm">
                        The dry season offers calm seas for boat travel and ideal conditions for exploring the island on foot.
                      </p>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Luggage className="w-5 h-5 text-teal-600" />
                        Essential Packing List
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
                  <h2 className="text-4xl font-bold mb-4">Essential Travel Tips for Delft Island</h2>
                  <p className="text-muted-foreground max-w-2xl mx-auto">
                    Everything you need to know for a successful island adventure
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
                              <div className="p-2 bg-teal-100 rounded-lg">
                                <IconComponent className="w-6 h-6 text-teal-600" />
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
        <section className="bg-gradient-to-r from-teal-600 to-cyan-600 text-white py-16">
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
                  className="bg-white text-teal-600 hover:bg-gray-100"
                  onClick={() => handleBooking('Delft Island Complete Tour')}
                >
                  <Ship className="w-5 h-5 mr-2" />
                  {ctaSection.buttonText}
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="bg-transparent text-white border-white hover:bg-white/20"
                  onClick={() => window.location.href = 'mailto:info@rechargetravels.com?subject=Delft Island Tour Inquiry'}
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

export default DelftIsland;
