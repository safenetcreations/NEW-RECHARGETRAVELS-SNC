import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
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
  Waves
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
    image: 'https://images.unsplash.com/photo-1588598198321-9735fd4f2b45?auto=format&fit=crop&q=80',
    title: 'Welcome to Polonnaruwa',
    subtitle: 'Medieval Capital & UNESCO World Heritage Site'
  },
  {
    id: '2',
    image: 'https://images.unsplash.com/photo-1609920658906-8223bd289001?auto=format&fit=crop&q=80',
    title: 'Ancient Kingdom',
    subtitle: '11th-13th Century Royal City'
  },
  {
    id: '3',
    image: 'https://images.unsplash.com/photo-1624296398627-22e8db73fbdb?auto=format&fit=crop&q=80',
    title: 'Archaeological Wonder',
    subtitle: 'Where History Comes Alive'
  }
];

const defaultAttractions: Attraction[] = [
  {
    id: '1',
    name: 'Gal Vihara',
    description: 'A rock temple featuring four magnificent Buddha statues carved from a single granite wall, considered the pinnacle of Sinhalese rock carving. The standing, seated, and reclining Buddha figures showcase extraordinary artistic detail.',
    image: 'https://images.unsplash.com/photo-1609920658906-8223bd289001?auto=format&fit=crop&q=80',
    category: 'Religious',
    rating: 4.9,
    duration: '1-2 hours',
    price: 'Included in ticket',
    highlights: ['Rock Carvings', '4 Buddha Statues', '12th Century Art', 'UNESCO Monument'],
    icon: 'Sparkles'
  },
  {
    id: '2',
    name: 'Royal Palace Complex',
    description: 'The ruins of King Parakramabahu\'s palace, originally seven stories high with 1,000 rooms. The audience hall with its elephant carvings and the council chamber showcase royal grandeur.',
    image: 'https://images.unsplash.com/photo-1588598198321-9735fd4f2b45?auto=format&fit=crop&q=80',
    category: 'Historical',
    rating: 4.7,
    duration: '1-1.5 hours',
    price: 'Included in ticket',
    highlights: ['Royal Architecture', 'Audience Hall', 'Council Chamber', '7-Story Palace'],
    icon: 'Crown'
  },
  {
    id: '3',
    name: 'Sacred Quadrangle (Dalada Maluwa)',
    description: 'A compact group of ancient religious monuments including the Vatadage, Hatadage, and Atadage. This raised platform contains some of the most sacred and architecturally significant structures.',
    image: 'https://images.unsplash.com/photo-1624296398627-22e8db73fbdb?auto=format&fit=crop&q=80',
    category: 'Religious',
    rating: 4.8,
    duration: '1.5-2 hours',
    price: 'Included in ticket',
    highlights: ['Vatadage', 'Tooth Relic Temples', 'Stone Inscriptions', 'Sacred Architecture'],
    icon: 'Church'
  },
  {
    id: '4',
    name: 'Parakrama Samudra',
    description: 'A massive man-made reservoir built by King Parakramabahu I, covering 2,500 hectares. This ancient irrigation marvel still provides water for cultivation and is perfect for sunset views.',
    image: 'https://images.unsplash.com/photo-1596040033550-d0c85b8c8b23?auto=format&fit=crop&q=80',
    category: 'Engineering',
    rating: 4.6,
    duration: '30-45 minutes',
    price: 'Free',
    highlights: ['Ancient Reservoir', 'Sunset Views', 'Engineering Marvel', 'Birdwatching'],
    icon: 'Waves'
  },
  {
    id: '5',
    name: 'Rankoth Vehera',
    description: 'The largest stupa in Polonnaruwa, standing 54 meters high. Built by King Nissanka Malla, it follows the architectural style of Anuradhapura period stupas.',
    image: 'https://images.unsplash.com/photo-1552841833-f7248b8f5b59?auto=format&fit=crop&q=80',
    category: 'Religious',
    rating: 4.5,
    duration: '30-45 minutes',
    price: 'Included in ticket',
    highlights: ['Golden Pinnacle', '4th Largest Stupa', '12th Century', 'Buddhist Architecture'],
    icon: 'Landmark'
  },
  {
    id: '6',
    name: 'Archaeological Museum',
    description: 'Houses artifacts discovered from Polonnaruwa including sculptures, inscriptions, and everyday objects that provide insights into medieval life in the ancient capital.',
    image: 'https://images.unsplash.com/photo-1575387873341-dc6809fc860f?auto=format&fit=crop&q=80',
    category: 'Museum',
    rating: 4.4,
    duration: '1 hour',
    price: 'From $3',
    highlights: ['Ancient Artifacts', 'Bronze Statues', 'Model City', 'Historical Context'],
    icon: 'BookOpen'
  }
];

const defaultActivities: Activity[] = [
  {
    id: '1',
    name: 'Guided Archaeological Tour',
    description: 'Expert-led tour covering all major monuments with historical insights',
    icon: 'History',
    price: 'From $25',
    duration: 'Half day',
    difficulty: 'Moderate',
    popular: true
  },
  {
    id: '2',
    name: 'Cycling Tour',
    description: 'Explore the ancient city on bicycle, covering more ground comfortably',
    icon: 'Bike',
    price: 'From $15',
    duration: '3-4 hours',
    difficulty: 'Moderate',
    popular: true
  },
  {
    id: '3',
    name: 'Sunrise Photography',
    description: 'Early morning photo tour capturing monuments in golden light',
    icon: 'Camera',
    price: 'From $40',
    duration: '3 hours',
    difficulty: 'Easy'
  },
  {
    id: '4',
    name: 'Minneriya Safari',
    description: 'Afternoon elephant safari at nearby Minneriya National Park',
    icon: 'Mountain',
    price: 'From $45',
    duration: '4 hours',
    difficulty: 'Easy',
    popular: true
  },
  {
    id: '5',
    name: 'Traditional Village Tour',
    description: 'Visit nearby villages to experience rural life and traditional crafts',
    icon: 'Users',
    price: 'From $30',
    duration: 'Half day',
    difficulty: 'Easy'
  },
  {
    id: '6',
    name: 'Night Museum Tour',
    description: 'Special evening tour of illuminated monuments (seasonal)',
    icon: 'Sparkles',
    price: 'From $35',
    duration: '2 hours',
    difficulty: 'Easy'
  }
];

const defaultRestaurants: Restaurant[] = [
  {
    id: '1',
    name: 'Lakeside Restaurant',
    cuisine: 'Traditional Sri Lankan',
    priceRange: '$$',
    rating: 4.5,
    image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&q=80',
    description: 'Beautiful lakeside dining with views of Parakrama Samudra. Serves authentic rice and curry buffets.',
    specialties: ['Rice & Curry Buffet', 'Fresh Fish', 'Vegetarian Options', 'Lake Views'],
    openHours: '7:00 AM - 9:30 PM'
  },
  {
    id: '2',
    name: 'Deer Park Hotel Restaurant',
    cuisine: 'International & Sri Lankan',
    priceRange: '$$$',
    rating: 4.6,
    image: 'https://images.unsplash.com/photo-1559339352-11d035aa65de?auto=format&fit=crop&q=80',
    description: 'Elegant dining at a colonial-style hotel with wildlife views and refined cuisine.',
    specialties: ['Tasting Menu', 'BBQ Nights', 'Western Cuisine', 'Garden Setting'],
    openHours: '6:30 AM - 10:00 PM'
  },
  {
    id: '3',
    name: 'Thissamaharama Rest House',
    cuisine: 'Sri Lankan Buffet',
    priceRange: '$$',
    rating: 4.3,
    image: 'https://images.unsplash.com/photo-1552566626-52f8b828add9?auto=format&fit=crop&q=80',
    description: 'Historic rest house offering generous lunch buffets popular with tour groups.',
    specialties: ['Lunch Buffet', 'Kottu', 'Hoppers', 'Cool Drinks'],
    openHours: '7:00 AM - 10:00 PM'
  },
  {
    id: '4',
    name: 'New Araliya Restaurant',
    cuisine: 'Local Cuisine',
    priceRange: '$',
    rating: 4.2,
    image: 'https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?auto=format&fit=crop&q=80',
    description: 'Popular local eatery near the entrance with quick service and budget-friendly prices.',
    specialties: ['Fried Rice', 'Noodles', 'Short Eats', 'Fresh Juices'],
    openHours: '6:00 AM - 9:00 PM'
  }
];

const defaultHotels: HotelInfo[] = [
  {
    id: '1',
    name: 'Deer Park Hotel',
    category: '4-Star Hotel',
    priceRange: 'From $150/night',
    rating: 4.6,
    image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&q=80',
    description: 'Colonial-style hotel with wildlife roaming the grounds, pool, and views of the ancient ruins.',
    amenities: ['Pool', 'Wildlife Views', 'Restaurant', 'Bar', 'Free WiFi'],
    location: 'Near Ancient City'
  },
  {
    id: '2',
    name: 'The Lake Hotel',
    category: 'Heritage Hotel',
    priceRange: 'From $100/night',
    rating: 4.4,
    image: 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?auto=format&fit=crop&q=80',
    description: 'Charming lakeside property with stunning views of Parakrama Samudra and comfortable rooms.',
    amenities: ['Lake Views', 'Restaurant', 'Garden', 'Tour Desk', 'Parking'],
    location: 'Lakefront'
  },
  {
    id: '3',
    name: 'Sudu Araliya Hotel',
    category: 'Mid-Range',
    priceRange: 'From $50/night',
    rating: 4.2,
    image: 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?auto=format&fit=crop&q=80',
    description: 'Comfortable hotel with pool and garden setting, perfect base for exploring the ruins.',
    amenities: ['Swimming Pool', 'Restaurant', 'Air Conditioning', 'Free WiFi', 'Bicycle Rental'],
    location: 'Town Center'
  },
  {
    id: '4',
    name: 'Giritale Hotel',
    category: 'Nature Resort',
    priceRange: 'From $80/night',
    rating: 4.5,
    image: 'https://images.unsplash.com/photo-1582719508461-905c673771fd?auto=format&fit=crop&q=80',
    description: 'Hilltop resort overlooking Giritale Tank with excellent wildlife and bird watching opportunities.',
    amenities: ['Hilltop Location', 'Pool', 'Bird Watching', 'Nature Walks', 'Ayurveda'],
    location: '15 min from Ruins'
  }
];

const defaultWeatherInfo: WeatherInfo = {
  season: 'Dry Zone Climate',
  temperature: '24-33°C (75-91°F)',
  rainfall: 'Low Feb-Sep, Moderate Oct-Jan',
  humidity: '65-80%',
  bestMonths: ['January', 'February', 'March', 'April', 'July', 'August', 'September'],
  packingTips: [
    'Light, modest clothing (cover knees & shoulders)',
    'Comfortable walking shoes with good grip',
    'Strong sunscreen and wide-brimmed hat',
    'Plenty of water bottles',
    'Sarong or shawl for temple visits',
    'Insect repellent for evening'
  ]
};

const defaultTravelTips: TravelTip[] = [
  {
    id: '1',
    title: 'Best Time to Visit',
    icon: 'Calendar',
    tips: [
      'January to April: Dry season, ideal weather',
      'July to September: Less rain, good visibility',
      'Early morning (6-10 AM): Cooler, better photos',
      'Avoid weekends and holidays for fewer crowds',
      'Site opens at 7 AM daily'
    ]
  },
  {
    id: '2',
    title: 'Getting Around',
    icon: 'Car',
    tips: [
      '230km from Colombo (4-5 hours by car)',
      'Bicycle rental highly recommended ($3-5/day)',
      'Tuk-tuks available for elderly/disabled',
      'Site covers large area - plan transport',
      'Combine with Sigiriya/Dambulla nearby'
    ]
  },
  {
    id: '3',
    title: 'Site Etiquette',
    icon: 'Church',
    tips: [
      'Remove shoes and hats at sacred sites',
      'Dress modestly - cover shoulders and knees',
      'Don\'t turn back to Buddha statues for photos',
      'Don\'t climb on ruins or monuments',
      'Keep voices low at religious sites',
      'Licensed guides enhance the experience'
    ]
  },
  {
    id: '4',
    title: 'Practical Information',
    icon: 'Shield',
    tips: [
      'Entry ticket: $25 USD for foreigners',
      'Plan minimum 4-5 hours for main sites',
      'Bring snacks - limited shops inside',
      'Museum has separate small fee',
      'Tickets valid for one day only',
      'ATMs available in town'
    ]
  }
];

const defaultDestinationInfo: DestinationInfo = {
  population: '15,000',
  area: '122 km²',
  elevation: '50-100 m',
  bestTime: 'Jan - Sep',
  language: 'Sinhala, English',
  currency: 'LKR / USD'
};

const defaultSEOSettings: SEOSettings = {
  title: 'Polonnaruwa Sri Lanka - Ancient Medieval Capital & UNESCO Heritage Site | Recharge Travels',
  description: 'Explore Polonnaruwa, Sri Lanka\'s medieval capital and UNESCO World Heritage Site. Discover Gal Vihara Buddha statues, royal palaces, and ancient ruins with expert guided tours.',
  keywords: 'Polonnaruwa ancient city, UNESCO World Heritage Sri Lanka, Gal Vihara Buddha statues, Parakrama Samudra, Polonnaruwa tours, medieval capital Sri Lanka, Sacred Quadrangle, Vatadage'
};

const defaultCTASection: CTASection = {
  title: 'Ready to Walk Through History?',
  subtitle: 'Explore the magnificent ruins of Sri Lanka\'s medieval capital with our expert guides',
  buttonText: 'Book Your Tour',
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
    'Leaf': Leaf,
    'Waves': Waves
  };
  return iconMap[iconName] || Landmark;
};

const Polonnaruwa = () => {
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
        const data = await getDestinationBySlug('polonnaruwa');
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
        console.error('Error loading Polonnaruwa content:', error);
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
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-50 to-amber-100">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-orange-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-orange-800 font-medium">Loading Polonnaruwa...</p>
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
        <meta property="og:url" content="https://recharge-travels-73e76.web.app/destinations/polonnaruwa" />
        <link rel="canonical" href="https://recharge-travels-73e76.web.app/destinations/polonnaruwa" />
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
                <Badge className="bg-orange-600/80 text-white text-sm px-4 py-1">
                  Medieval Kingdom Capital
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
                  className="bg-orange-600 hover:bg-orange-700 text-white px-8 py-6 text-lg"
                  onClick={() => handleBooking('Polonnaruwa Heritage Tour')}
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
                    <Crown className="w-6 h-6 text-orange-600 mb-2" />
                    <span className="text-sm text-muted-foreground">UNESCO Site</span>
                    <span className="font-semibold">Since 1982</span>
                  </div>
                  <div className="flex flex-col items-center">
                    <Thermometer className="w-6 h-6 text-orange-600 mb-2" />
                    <span className="text-sm text-muted-foreground">Temperature</span>
                    <span className="font-semibold">{weatherInfo.temperature}</span>
                  </div>
                  <div className="flex flex-col items-center">
                    <MapPin className="w-6 h-6 text-orange-600 mb-2" />
                    <span className="text-sm text-muted-foreground">Area</span>
                    <span className="font-semibold">{destinationInfo.area}</span>
                  </div>
                  <div className="flex flex-col items-center">
                    <Calendar className="w-6 h-6 text-orange-600 mb-2" />
                    <span className="text-sm text-muted-foreground">Best Time</span>
                    <span className="font-semibold">{destinationInfo.bestTime}</span>
                  </div>
                  <div className="flex flex-col items-center">
                    <Languages className="w-6 h-6 text-orange-600 mb-2" />
                    <span className="text-sm text-muted-foreground">Language</span>
                    <span className="font-semibold">{destinationInfo.language}</span>
                  </div>
                  <div className="flex flex-col items-center">
                    <CircleDollarSign className="w-6 h-6 text-orange-600 mb-2" />
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
                      ? 'border-orange-600 text-orange-600'
                      : 'border-transparent text-muted-foreground hover:text-foreground'
                  }`}
                >
                  {tab.label}
                  {tab.count && (
                    <Badge variant="secondary" className="ml-2 bg-orange-100 text-orange-700">
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
                  <h2 className="text-4xl font-bold mb-4">Top Attractions in Polonnaruwa</h2>
                  <p className="text-muted-foreground max-w-2xl mx-auto">
                    Explore ancient ruins, rock carvings, and the masterpieces of medieval Sri Lankan architecture
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
                              <Badge className="bg-orange-600 text-white">
                                {attraction.category}
                              </Badge>
                            </div>
                            <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm rounded-full p-2">
                              <IconComponent className="w-5 h-5 text-orange-600" />
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
                                <Badge key={idx} variant="outline" className="text-xs border-orange-200 text-orange-700">
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
                              className="w-full bg-orange-600 hover:bg-orange-700"
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
                  <h2 className="text-4xl font-bold mb-4">Things to Do in Polonnaruwa</h2>
                  <p className="text-muted-foreground max-w-2xl mx-auto">
                    From cycling tours to wildlife safaris, discover exciting experiences
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
                                <div className="p-3 bg-orange-100 rounded-xl mr-4">
                                  <IconComponent className="w-6 h-6 text-orange-600" />
                                </div>
                                <div>
                                  <CardTitle className="text-lg">{activity.name}</CardTitle>
                                  {activity.popular && (
                                    <Badge className="mt-1 bg-green-500 text-white">Popular</Badge>
                                  )}
                                </div>
                              </div>
                            </div>
                          </CardHeader>
                          <CardContent>
                            <p className="text-muted-foreground mb-4">{activity.description}</p>
                            <div className="flex items-center justify-between text-sm mb-4">
                              <span className="text-orange-600 font-semibold">{activity.price}</span>
                              <span className="text-muted-foreground">{activity.duration}</span>
                            </div>
                            {activity.difficulty && (
                              <Badge variant="outline" className="mb-4 border-orange-200">
                                {activity.difficulty}
                              </Badge>
                            )}
                            <Button
                              variant="outline"
                              className="w-full border-orange-600 text-orange-600 hover:bg-orange-600 hover:text-white"
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
                  <h2 className="text-4xl font-bold mb-4">Where to Eat in Polonnaruwa</h2>
                  <p className="text-muted-foreground max-w-2xl mx-auto">
                    From lakeside dining to local eateries near the ancient city
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
                              <Badge variant="outline" className="border-orange-200 text-orange-700">
                                {restaurant.cuisine}
                              </Badge>
                              <Badge className="bg-orange-100 text-orange-700">
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
                  <h2 className="text-4xl font-bold mb-4">Where to Stay in Polonnaruwa</h2>
                  <p className="text-muted-foreground max-w-2xl mx-auto">
                    From heritage hotels to nature resorts near the ancient city
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
                            <Badge className="bg-orange-600 text-white">{hotel.category}</Badge>
                          </div>
                          <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm rounded-full px-3 py-1 flex items-center">
                            <Star className="w-4 h-4 text-yellow-500 fill-current" />
                            <span className="ml-1 text-sm font-medium">{hotel.rating}</span>
                          </div>
                        </div>
                        <CardContent className="p-6">
                          <div className="flex items-start justify-between mb-2">
                            <h3 className="text-xl font-bold">{hotel.name}</h3>
                            <span className="text-orange-600 font-semibold text-sm">{hotel.priceRange}</span>
                          </div>
                          <div className="flex items-center text-sm text-muted-foreground mb-3">
                            <MapPin className="w-4 h-4 mr-1" />
                            {hotel.location}
                          </div>
                          <p className="text-muted-foreground text-sm mb-4">{hotel.description}</p>
                          <div className="flex flex-wrap gap-2 mb-4">
                            {hotel.amenities.slice(0, 4).map((amenity, idx) => (
                              <Badge key={idx} variant="outline" className="text-xs border-orange-200">
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
                            className="w-full bg-orange-600 hover:bg-orange-700"
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
                  <h2 className="text-4xl font-bold mb-4">Weather in Polonnaruwa</h2>
                  <p className="text-muted-foreground max-w-2xl mx-auto">
                    Plan your visit with our comprehensive weather guide
                  </p>
                </div>
                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
                  <Card className="text-center p-6 bg-gradient-to-br from-orange-50 to-amber-50">
                    <Thermometer className="w-10 h-10 text-orange-600 mx-auto mb-3" />
                    <h3 className="font-semibold mb-1">Temperature</h3>
                    <p className="text-2xl font-bold text-orange-600">{weatherInfo.temperature}</p>
                  </Card>
                  <Card className="text-center p-6 bg-gradient-to-br from-orange-50 to-amber-50">
                    <Cloud className="w-10 h-10 text-orange-600 mx-auto mb-3" />
                    <h3 className="font-semibold mb-1">Climate</h3>
                    <p className="text-lg font-medium text-orange-600">{weatherInfo.season}</p>
                  </Card>
                  <Card className="text-center p-6 bg-gradient-to-br from-orange-50 to-amber-50">
                    <Droplets className="w-10 h-10 text-orange-600 mx-auto mb-3" />
                    <h3 className="font-semibold mb-1">Humidity</h3>
                    <p className="text-2xl font-bold text-orange-600">{weatherInfo.humidity}</p>
                  </Card>
                  <Card className="text-center p-6 bg-gradient-to-br from-orange-50 to-amber-50">
                    <Wind className="w-10 h-10 text-orange-600 mx-auto mb-3" />
                    <h3 className="font-semibold mb-1">Rainfall</h3>
                    <p className="text-sm font-medium text-orange-600">{weatherInfo.rainfall}</p>
                  </Card>
                </div>

                <div className="grid md:grid-cols-2 gap-8">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Calendar className="w-5 h-5 text-orange-600" />
                        Best Months to Visit
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="flex flex-wrap gap-2">
                        {weatherInfo.bestMonths.map((month, idx) => (
                          <Badge key={idx} className="bg-orange-100 text-orange-700 px-4 py-2">
                            {month}
                          </Badge>
                        ))}
                      </div>
                      <p className="text-muted-foreground mt-4 text-sm">
                        The dry season offers the best conditions for exploring the ancient ruins with minimal heat and rain.
                      </p>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Luggage className="w-5 h-5 text-orange-600" />
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
                  <h2 className="text-4xl font-bold mb-4">Travel Tips for Polonnaruwa</h2>
                  <p className="text-muted-foreground max-w-2xl mx-auto">
                    Essential information for visiting the medieval capital
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
                              <div className="p-2 bg-orange-100 rounded-lg">
                                <IconComponent className="w-6 h-6 text-orange-600" />
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
        <section className="bg-gradient-to-r from-orange-600 to-amber-600 text-white py-16">
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
                  className="bg-white text-orange-600 hover:bg-gray-100"
                  onClick={() => handleBooking('Polonnaruwa Complete Package')}
                >
                  <Phone className="w-5 h-5 mr-2" />
                  {ctaSection.buttonText}
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="bg-transparent text-white border-white hover:bg-white/20"
                  onClick={() => window.location.href = 'mailto:info@rechargetravels.com?subject=Polonnaruwa Inquiry'}
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

export default Polonnaruwa;
