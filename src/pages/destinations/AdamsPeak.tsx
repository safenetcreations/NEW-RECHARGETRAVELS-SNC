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
  Mountain, Footprints, Moon, Sunrise, Church, TreePalm, Sparkles,
  Building, Landmark, Bike, Coffee, UtensilsCrossed,
  Wifi, ParkingCircle, AirVent, Dumbbell, Globe, Map, Navigation
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import DestinationMap from '@/components/destinations/DestinationMap';
import WeatherWidget from '@/components/destinations/WeatherWidget';
import { getDestinationBySlug } from '@/services/destinationContentService';

const ADAMS_PEAK_CENTER = { lat: 6.8096, lng: 80.4994 };

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

const AdamsPeak = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [selectedTab, setSelectedTab] = useState('attractions');

  // Content state with defaults
  const [heroSlides, setHeroSlides] = useState<HeroSlide[]>([
    { id: '1', image: "https://images.unsplash.com/photo-1580835845419-bb7c9c878f57?auto=format&fit=crop&q=80", title: "Discover Adam's Peak", subtitle: "Sacred Mountain of Sri Lanka" },
    { id: '2', image: "https://images.unsplash.com/photo-1546587348-d12660c30c50?auto=format&fit=crop&q=80", title: "Sri Pada Summit", subtitle: "Sacred Footprint at the Top" },
    { id: '3', image: "https://images.unsplash.com/photo-1571536802807-30451e3f3d43?auto=format&fit=crop&q=80", title: "Sunrise Trek", subtitle: "Breathtaking Dawn Views" },
    { id: '4', image: "https://images.unsplash.com/photo-1627894483216-2138af692e32?auto=format&fit=crop&q=80", title: "Pilgrim Trail", subtitle: "5,500 Steps to Enlightenment" },
    { id: '5', image: "https://images.unsplash.com/photo-1588598198321-39f8c2be97ba?auto=format&fit=crop&q=80", title: "Shadow Triangle", subtitle: "Mysterious Pyramid Shadow" }
  ]);

  const [attractions, setAttractions] = useState<Attraction[]>([
    {
      id: '1',
      name: 'Sacred Footprint (Sri Pada)',
      description: 'The 1.8-meter rock formation at the summit bearing a footprint-like indentation, covered by a golden canopy. Sacred to Buddhists, Hindus, Christians, and Muslims.',
      image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&q=80',
      icon: 'Footprints',
      duration: 'At summit',
      highlights: ['Multi-faith Site', 'Golden Canopy', 'Sacred Bells', 'Prayer Offerings']
    },
    {
      id: '2',
      name: 'Sunrise Viewing Point',
      description: 'The breathtaking sunrise view from the summit is legendary, with the peak casting a perfect triangular shadow on the clouds below.',
      image: 'https://images.unsplash.com/photo-1486870591958-9b9d0d1dda99?auto=format&fit=crop&q=80',
      icon: 'Sunrise',
      duration: '6:00-6:30 AM',
      highlights: ['Triangular Shadow', 'Sea of Clouds', '360° Views', 'Photo Opportunity']
    },
    {
      id: '3',
      name: 'Peace Pagoda (Sama Chetiya)',
      description: 'Japanese Peace Pagoda along the climbing route, offering a rest point and spectacular views. Built to promote world peace.',
      image: 'https://images.unsplash.com/photo-1545558014-8692077e9b5c?auto=format&fit=crop&q=80',
      icon: 'Church',
      duration: '30 minutes',
      highlights: ['Japanese Architecture', 'Rest Point', 'Valley Views', 'Meditation Space']
    },
    {
      id: '4',
      name: 'Seetha Gangula Stream',
      description: 'A sacred stream about halfway up where pilgrims traditionally bathe and refresh. The cold mountain water is believed to have healing properties.',
      image: 'https://images.unsplash.com/photo-1596040033550-d0c85b8c8b23?auto=format&fit=crop&q=80',
      icon: 'Droplets',
      duration: '15 minutes',
      highlights: ['Sacred Bathing', 'Mountain Stream', 'Rest Area', 'Refreshment Point']
    },
    {
      id: '5',
      name: 'Dalhousie Town',
      description: 'The main starting point for the pilgrimage, this small town comes alive during climbing season with shops and accommodation for pilgrims.',
      image: 'https://images.unsplash.com/photo-1519904981063-b0cf448d479e?auto=format&fit=crop&q=80',
      icon: 'Building',
      duration: 'Overnight stay',
      highlights: ['Starting Point', 'Pilgrim Facilities', 'Supplies', 'Accommodation']
    },
    {
      id: '6',
      name: 'Peak Wilderness Sanctuary',
      description: "The mountain is surrounded by pristine forest reserve, home to endemic species including leopards, endemic birds, and unique montane vegetation.",
      image: 'https://images.unsplash.com/photo-1511497584788-876760111969?auto=format&fit=crop&q=80',
      icon: 'TreePalm',
      duration: 'Various trails',
      highlights: ['Endemic Species', 'Cloud Forest', 'Biodiversity', 'Protected Area']
    }
  ]);

  const [activities, setActivities] = useState<Activity[]>([
    {
      id: '1',
      name: 'Traditional Night Climb',
      description: 'Join thousands of pilgrims on the illuminated trail starting at 2 AM for the sacred sunrise experience',
      icon: 'Moon',
      duration: '6-8 hours',
      price: 'From $50',
      difficulty: 'Moderate'
    },
    {
      id: '2',
      name: 'Guided Pilgrimage Tour',
      description: 'Expert guides share religious significance and assist with the climb to the sacred summit',
      icon: 'Users',
      duration: 'Full experience',
      price: 'From $75',
      difficulty: 'Moderate'
    },
    {
      id: '3',
      name: 'Sunrise Photography Tour',
      description: 'Specialized tour for photographers to capture the perfect sunrise and triangular shadow',
      icon: 'Camera',
      duration: 'Overnight',
      price: 'From $100',
      difficulty: 'Moderate'
    },
    {
      id: '4',
      name: 'Off-Season Day Hike',
      description: 'Less crowded daytime climb during off-season months through pristine wilderness',
      icon: 'Sun',
      duration: '8-10 hours',
      price: 'From $60',
      difficulty: 'Challenging'
    },
    {
      id: '5',
      name: 'Alternative Route Trek',
      description: 'Explore less-traveled routes through Peak Wilderness with experienced guides',
      icon: 'Footprints',
      duration: 'Full day',
      price: 'From $80',
      difficulty: 'Challenging'
    },
    {
      id: '6',
      name: 'Cultural Experience Tour',
      description: 'Learn about multi-faith traditions and local customs surrounding the sacred mountain',
      icon: 'Heart',
      duration: 'Half day',
      price: 'From $40',
      difficulty: 'Easy'
    }
  ]);

  const [restaurants, setRestaurants] = useState<Restaurant[]>([
    {
      id: '1',
      name: 'Pilgrim Rest House',
      cuisine: 'Sri Lankan & Vegetarian',
      priceRange: '$',
      rating: 4.3,
      image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&q=80',
      description: 'Traditional Sri Lankan meals for pilgrims, serving hot rice and curry before and after the climb.',
      specialties: ['Rice & Curry', 'String Hoppers', 'Hot Tea', 'Vegetarian Options']
    },
    {
      id: '2',
      name: 'Summit View Cafe',
      cuisine: 'Local & International',
      priceRange: '$$',
      rating: 4.4,
      image: 'https://images.unsplash.com/photo-1552566626-52f8b828add9?auto=format&fit=crop&q=80',
      description: 'Cozy cafe in Dalhousie serving hearty meals and hot beverages for climbers.',
      specialties: ['Breakfast Sets', 'Kottu', 'Noodles', 'Hot Chocolate']
    },
    {
      id: '3',
      name: 'Tea Shop Rotis',
      cuisine: 'Sri Lankan Street Food',
      priceRange: '$',
      rating: 4.5,
      image: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&q=80',
      description: 'Traditional tea shops along the climbing route serving hot tea, rotis, and snacks.',
      specialties: ['Plain Roti', 'Egg Roti', 'Sweet Tea', 'Energy Snacks']
    },
    {
      id: '4',
      name: 'Hatton Hotel Restaurant',
      cuisine: 'Sri Lankan & Chinese',
      priceRange: '$$',
      rating: 4.2,
      image: 'https://images.unsplash.com/photo-1466978913421-dad2ebd01d17?auto=format&fit=crop&q=80',
      description: 'Full-service restaurant in nearby Hatton town serving diverse cuisine for travelers.',
      specialties: ['Fried Rice', 'Deviled Chicken', 'Fish Curry', 'Noodles']
    }
  ]);

  const [hotels, setHotels] = useState<HotelInfo[]>([
    {
      id: '1',
      name: "Slightly Chilled Guest House",
      category: 'Boutique Guesthouse',
      priceRange: '$$',
      rating: 4.6,
      image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&q=80',
      description: 'Popular climber-friendly guesthouse in Dalhousie with cozy rooms and helpful staff.',
      amenities: ['Hot Water', 'Wake-up Call', 'Parking', 'Restaurant', 'Luggage Storage']
    },
    {
      id: '2',
      name: 'White House Dalhousie',
      category: 'Budget Hotel',
      priceRange: '$',
      rating: 4.3,
      image: 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?auto=format&fit=crop&q=80',
      description: 'Clean and affordable accommodation right at the base of the climbing trail.',
      amenities: ['Near Trailhead', 'Hot Showers', 'Basic Meals', 'Guides Available']
    },
    {
      id: '3',
      name: 'Hunas Falls Hotel',
      category: 'Resort',
      priceRange: '$$$',
      rating: 4.7,
      image: 'https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?auto=format&fit=crop&q=80',
      description: 'Luxury hillside resort near Kandy with stunning views, perfect for recovery after the climb.',
      amenities: ['Pool', 'Spa', 'Fine Dining', 'Nature Trails', 'WiFi']
    },
    {
      id: '4',
      name: 'Hatton Rest House',
      category: 'Heritage Hotel',
      priceRange: '$$',
      rating: 4.4,
      image: 'https://images.unsplash.com/photo-1596178065887-1198b6148b2b?auto=format&fit=crop&q=80',
      description: 'Colonial-era rest house in Hatton town, convenient for early morning transfers to Dalhousie.',
      amenities: ['Heritage Building', 'Restaurant', 'Garden', 'Transport Arranged']
    }
  ]);

  const [destinationInfo, setDestinationInfo] = useState<DestinationInfo>({
    population: '3,000 (Dalhousie)',
    elevation: '2,243m (7,359 ft)',
    bestTime: 'December - May',
    language: 'Sinhala, Tamil'
  });

  const [weatherInfo, setWeatherInfo] = useState<WeatherInfo>({
    season: 'Mountain Climate',
    temperature: '5-15°C at summit',
    rainfall: 'Dry Dec-Apr',
    humidity: '80-95%',
    bestMonths: ['December', 'January', 'February', 'March', 'April'],
    packingTips: ['Warm jacket for summit', 'Comfortable hiking shoes', 'Flashlight/headlamp', '2-3 liters water', 'Rain jacket', 'Walking stick', 'Cash for donations']
  });

  const [travelTips, setTravelTips] = useState<TravelTip[]>([
    {
      id: '1',
      category: 'Season',
      icon: 'Calendar',
      title: 'Climbing Season',
      description: 'December to May is pilgrimage season with illuminated paths. January-March offers best weather. Avoid monsoon months (May-November).'
    },
    {
      id: '2',
      category: 'Timing',
      icon: 'Clock',
      title: 'When to Start',
      description: 'Most pilgrims start at 2-3 AM to reach summit by sunrise (~6:15 AM). This allows 3-4 hours for climbing.'
    },
    {
      id: '3',
      category: 'Difficulty',
      icon: 'Mountain',
      title: 'Physical Preparation',
      description: '5,500 steps over 7km, gaining 1,000m elevation. Moderate fitness required. Children and elderly complete it regularly with breaks.'
    },
    {
      id: '4',
      category: 'Essentials',
      icon: 'Info',
      title: 'What to Bring',
      description: 'Warm layers, headlamp, water (2-3L), snacks, rain jacket, cash for donations and tea shops. Dress modestly for religious sites.'
    },
    {
      id: '5',
      category: 'Route',
      icon: 'Map',
      title: 'Climbing Routes',
      description: 'Nallathanniya (Dalhousie) route is most popular and well-lit. Ratnapura route is longer but scenic. Kuruwita is most challenging.'
    },
    {
      id: '6',
      category: 'Culture',
      icon: 'Heart',
      title: 'Religious Significance',
      description: "Sacred to four religions. Ring the bell at summit for each successful climb. Respect fellow pilgrims and sacred customs."
    }
  ]);

  const [seoSettings, setSeoSettings] = useState<SEOSettings>({
    metaTitle: "Adam's Peak Sri Lanka - Sacred Mountain Pilgrimage & Sunrise Trek | Recharge Travels",
    metaDescription: "Climb Adam's Peak (Sri Pada), Sri Lanka's sacred mountain. Experience the spiritual pilgrimage, witness spectacular sunrise views, and join thousands on this ancient trail.",
    keywords: "Adam's Peak Sri Lanka, Sri Pada pilgrimage, sacred mountain trek, sunrise Adam's Peak, Buddhist pilgrimage"
  });

  const [ctaSection, setCtaSection] = useState<CTASection>({
    title: "Ready for Your Sacred Sunrise Trek?",
    subtitle: "Experience the ancient pilgrimage to Sri Lanka's holiest mountain with expert guides",
    buttonText: 'Plan My Pilgrimage'
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
      'Mountain': Mountain,
      'Footprints': Footprints,
      'Moon': Moon,
      'Sunrise': Sunrise,
      'Church': Church,
      'TreePalm': TreePalm,
      'Sparkles': Sparkles,
      'Building': Building,
      'Landmark': Landmark,
      'Bike': Bike,
      'Coffee': Coffee,
      'UtensilsCrossed': UtensilsCrossed,
      'Wifi': Wifi,
      'ParkingCircle': ParkingCircle,
      'AirVent': AirVent,
      'Dumbbell': Dumbbell,
      'Globe': Globe,
      'Map': Map,
      'Navigation': Navigation
    };
    return iconMap[iconName] || Mountain;
  };

  // Load content from Firebase
  useEffect(() => {
    const loadContent = async () => {
      try {
        const data = await getDestinationBySlug('adams-peak');
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
        console.error("Error loading Adam's Peak content:", error);
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

  const handleBooking = (service: string = 'Adams Peak Tour', tourData?: { id: string; name: string; description: string; duration: string; price: number; features: string[]; image?: string }) => {
    const params = new URLSearchParams({
      title: tourData?.name || service,
      id: tourData?.id || service.toLowerCase().replace(/\s+/g, '-'),
      duration: tourData?.duration || 'Full Day',
      price: String(tourData?.price || 75),
      image: tourData?.image || 'https://images.unsplash.com/photo-1586233065346-10b7ad15e2f9?w=800',
      subtitle: `Adams Peak - ${tourData?.name || service}`
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
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 to-purple-100">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-indigo-800 font-medium">Loading Adam's Peak...</p>
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
        <link rel="canonical" href="https://www.rechargetravels.com/destinations/adams-peak" />
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
                <Badge className="bg-indigo-500/80 text-white px-4 py-1 text-sm">
                  <Mountain className="w-4 h-4 mr-2 inline" />
                  Sacred Pilgrimage Destination
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
                  className="bg-indigo-600 hover:bg-indigo-700 text-white px-8"
                  onClick={() => handleBooking("Adam's Peak Sunrise Trek")}
                >
                  Plan My Pilgrimage
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="border-white text-white hover:bg-white/20 px-8"
                  onClick={() => document.getElementById('attractions')?.scrollIntoView({ behavior: 'smooth' })}
                >
                  Explore
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
                  index === currentSlide ? 'w-8 bg-indigo-400' : 'w-2 bg-white/50'
                }`}
              />
            ))}
          </div>
        </section>

        {/* Quick Info Bar */}
        <section className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-6 shadow-lg">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              <div className="flex items-center gap-3 justify-center">
                <div className="p-2 bg-white/20 rounded-lg">
                  <Mountain className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-white/70 text-xs">Elevation</p>
                  <p className="font-semibold">{destinationInfo.elevation}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 justify-center">
                <div className="p-2 bg-white/20 rounded-lg">
                  <Footprints className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-white/70 text-xs">Steps to Summit</p>
                  <p className="font-semibold">5,500 Steps</p>
                </div>
              </div>
              <div className="flex items-center gap-3 justify-center">
                <div className="p-2 bg-white/20 rounded-lg">
                  <Sunrise className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-white/70 text-xs">Sunrise Time</p>
                  <p className="font-semibold">~6:15 AM</p>
                </div>
              </div>
              <div className="flex items-center gap-3 justify-center">
                <div className="p-2 bg-white/20 rounded-lg">
                  <Calendar className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-white/70 text-xs">Season</p>
                  <p className="font-semibold">{destinationInfo.bestTime}</p>
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
                      ? 'border-indigo-600 text-indigo-600'
                      : 'border-transparent text-gray-600 hover:text-indigo-600'
                  }`}
                >
                  {tab.label}
                  {tab.count !== null && (
                    <Badge variant="secondary" className="ml-2 bg-indigo-100 text-indigo-700">
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
                  <h2 className="text-4xl font-bold text-gray-900 mb-4">Key Points of Adam's Peak</h2>
                  <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                    Sacred sites and natural wonders along the pilgrimage route
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
                            <Badge className="bg-indigo-600 text-white">
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
                              <Badge key={idx} variant="outline" className="text-xs border-indigo-200 text-indigo-700">
                                {highlight}
                              </Badge>
                            ))}
                          </div>
                          <Button
                            className="w-full bg-indigo-600 hover:bg-indigo-700"
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
                  <h2 className="text-4xl font-bold text-gray-900 mb-4">Adam's Peak Experiences</h2>
                  <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                    Pilgrimage options and trekking adventures
                  </p>
                </div>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {activities.map((activity) => {
                    const IconComponent = getIconComponent(activity.icon);
                    return (
                      <Card key={activity.id} className="hover:shadow-lg transition-shadow">
                        <CardHeader>
                          <div className="flex items-start gap-4">
                            <div className="p-3 bg-indigo-100 rounded-xl">
                              <IconComponent className="w-6 h-6 text-indigo-600" />
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
                            <span className="font-semibold text-indigo-600">{activity.price}</span>
                          </div>
                          <Button
                            variant="outline"
                            className="w-full border-indigo-600 text-indigo-600 hover:bg-indigo-600 hover:text-white"
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
                  <h2 className="text-4xl font-bold text-gray-900 mb-4">Where to Eat</h2>
                  <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                    Pilgrim rest houses and local eateries near Adam's Peak
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
                            <Badge className="bg-indigo-100 text-indigo-700">{restaurant.priceRange}</Badge>
                          </div>
                          <p className="text-indigo-600 text-sm mb-2">{restaurant.cuisine}</p>
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
                  <h2 className="text-4xl font-bold text-gray-900 mb-4">Where to Stay</h2>
                  <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                    Pilgrim accommodations and nearby hotels
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
                          <Badge className="bg-white text-indigo-700">{hotel.priceRange}</Badge>
                        </div>
                        <div className="absolute bottom-4 left-4">
                          <Badge className="bg-indigo-600 text-white">{hotel.category}</Badge>
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
                            <Badge key={idx} variant="outline" className="text-xs border-indigo-200">
                              {amenity}
                            </Badge>
                          ))}
                        </div>
                        <Button
                          className="w-full bg-indigo-600 hover:bg-indigo-700"
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
                  <h2 className="text-4xl font-bold text-gray-900 mb-4">Adam's Peak Weather</h2>
                  <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                    Mountain climate information for planning your climb
                  </p>
                </div>
                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
                  <Card className="text-center p-6 bg-gradient-to-br from-indigo-50 to-purple-50">
                    <Thermometer className="w-12 h-12 text-indigo-600 mx-auto mb-4" />
                    <h3 className="font-semibold text-gray-900 mb-2">Summit Temp</h3>
                    <p className="text-2xl font-bold text-indigo-600">{weatherInfo.temperature}</p>
                    <p className="text-sm text-gray-500 mt-1">Cold at night/dawn</p>
                  </Card>
                  <Card className="text-center p-6 bg-gradient-to-br from-indigo-50 to-purple-50">
                    <Droplets className="w-12 h-12 text-purple-600 mx-auto mb-4" />
                    <h3 className="font-semibold text-gray-900 mb-2">Humidity</h3>
                    <p className="text-2xl font-bold text-purple-600">{weatherInfo.humidity}</p>
                    <p className="text-sm text-gray-500 mt-1">Mountain mist common</p>
                  </Card>
                  <Card className="text-center p-6 bg-gradient-to-br from-indigo-50 to-purple-50">
                    <Umbrella className="w-12 h-12 text-indigo-600 mx-auto mb-4" />
                    <h3 className="font-semibold text-gray-900 mb-2">Rainfall</h3>
                    <p className="text-2xl font-bold text-indigo-600">{weatherInfo.rainfall}</p>
                    <p className="text-sm text-gray-500 mt-1">Avoid monsoon months</p>
                  </Card>
                  <Card className="text-center p-6 bg-gradient-to-br from-indigo-50 to-purple-50">
                    <Sunrise className="w-12 h-12 text-purple-600 mx-auto mb-4" />
                    <h3 className="font-semibold text-gray-900 mb-2">Sunrise</h3>
                    <p className="text-lg font-bold text-purple-600">~6:15 AM</p>
                    <p className="text-sm text-gray-500 mt-1">Varies by month</p>
                  </Card>
                </div>

                <div className="grid md:grid-cols-2 gap-8">
                  <Card className="p-6">
                    <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                      <Calendar className="w-5 h-5 mr-2 text-indigo-600" />
                      Best Months to Climb
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {weatherInfo.bestMonths.map((month, idx) => (
                        <Badge key={idx} className="bg-indigo-600 text-white px-4 py-2">
                          {month}
                        </Badge>
                      ))}
                    </div>
                    <p className="text-gray-600 mt-4 text-sm">
                      Pilgrimage season runs December to May. January-March offers the best weather conditions
                      with clear skies. Avoid monsoon months (May-November).
                    </p>
                  </Card>
                  <Card className="p-6">
                    <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                      <CheckCircle className="w-5 h-5 mr-2 text-indigo-600" />
                      Essential Packing List
                    </h3>
                    <ul className="space-y-2">
                      {weatherInfo.packingTips.map((tip, idx) => (
                        <li key={idx} className="flex items-center text-gray-600">
                          <CheckCircle className="w-4 h-4 mr-2 text-indigo-500" />
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
                  <h2 className="text-4xl font-bold text-gray-900 mb-4">Essential Tips for Adam's Peak</h2>
                  <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                    Everything you need to know for a successful pilgrimage
                  </p>
                </div>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {travelTips.map((tip) => {
                    const IconComponent = getIconComponent(tip.icon);
                    return (
                      <Card key={tip.id} className="p-6 hover:shadow-lg transition-shadow">
                        <div className="flex items-start gap-4">
                          <div className="p-3 bg-indigo-100 rounded-xl">
                            <IconComponent className="w-6 h-6 text-indigo-600" />
                          </div>
                          <div>
                            <Badge variant="outline" className="mb-2 text-xs border-indigo-200 text-indigo-700">
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
                <div>
                  <h2 className="text-3xl font-bold mb-8">Explore Adams Peak Map</h2>
                  <div className="grid lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-2">
                      <Card className="overflow-hidden h-[500px]">
                        <DestinationMap
                          destinationName="Adams Peak"
                          center={ADAMS_PEAK_CENTER}
                          attractions={[
                            { name: 'Sri Pada Summit', description: 'Sacred mountain peak (2,243m)', coordinates: { lat: 6.8096, lng: 80.4994 } },
                            { name: 'Nallathanniya Base', description: 'Starting point for climb', coordinates: { lat: 6.8300, lng: 80.5100 } },
                            { name: 'Seetha Gangula', description: 'Waterfall on the trail', coordinates: { lat: 6.8200, lng: 80.5050 } },
                            { name: 'Peak Wilderness Sanctuary', description: 'Protected forest area', coordinates: { lat: 6.7900, lng: 80.4800 } },
                            { name: 'Maskeliya', description: 'Gateway town', coordinates: { lat: 6.8400, lng: 80.5400 } }
                          ]}
                          height="500px"
                        />
                      </Card>
                    </div>
                    <div className="lg:col-span-1">
                      <WeatherWidget
                        locationName="Adams Peak"
                        latitude={ADAMS_PEAK_CENTER.lat}
                        longitude={ADAMS_PEAK_CENTER.lng}
                      />
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* CTA Section */}
        <section className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-16">
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
                  className="bg-white text-indigo-600 hover:bg-gray-100"
                  onClick={() => handleBooking("Adam's Peak Pilgrimage Package")}
                >
                  <Phone className="w-5 h-5 mr-2" />
                  {ctaSection.buttonText}
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="border-white text-white hover:bg-white/20"
                  onClick={() => window.location.href = 'mailto:info@rechargetravels.com?subject=Adams Peak Inquiry'}
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
        href="https://wa.me/94777721999?text=Hi! I'm interested in booking an Adams Peak pilgrimage tour."
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

export default AdamsPeak;
