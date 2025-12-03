import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { useNavigate } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { motion, AnimatePresence } from 'framer-motion';
import DestinationMap from '@/components/destinations/DestinationMap';
import WeatherWidget from '@/components/destinations/WeatherWidget';
import {
  Fish,
  Waves,
  Music,
  MapPin,
  Calendar,
  Clock,
  Star,
  Wifi,
  Utensils,
  Camera,
  Hotel,
  Heart,
  Users,
  DollarSign,
  Info,
  Sun,
  Cloud,
  Navigation,
  Building,
  ShoppingBag,
  TreePalm,
  Thermometer,
  Droplets,
  Lightbulb,
  Landmark,
  Sunrise,
  Bird,
  Anchor
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { getDestinationBySlug } from '@/services/destinationContentService';

// Coordinates
const BATTICALOA_CENTER = { lat: 7.7310, lng: 81.6747 };

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
  description: string;
  priceRange: string;
  rating?: number;
  image?: string;
}

interface HotelInfo {
  name: string;
  type: string;
  priceRange: string;
  rating?: number;
  amenities: string[];
  image?: string;
}

interface DestinationInfo {
  population: string;
  area: string;
  elevation: string;
  bestTime: string;
  language?: string;
  currency?: string;
}

interface WeatherInfo {
  temperature: string;
  humidity: string;
  rainfall: string;
  bestMonths: string;
}

interface TravelTip {
  title: string;
  description: string;
  icon: string;
}

interface SEOSettings {
  metaTitle: string;
  metaDescription: string;
  keywords: string[];
}

interface CTASection {
  title: string;
  subtitle: string;
  buttonText: string;
}

// Icon mapping function
const getIconComponent = (iconName: string) => {
  const iconMap: { [key: string]: any } = {
    Fish, Waves, Music, MapPin, Calendar, Clock, Star, Wifi, Utensils, Camera,
    Hotel, Heart, Users, DollarSign, Info, Sun, Cloud, Navigation, Building,
    ShoppingBag, TreePalm, Thermometer, Droplets, Lightbulb, Landmark, Sunrise,
    Bird, Anchor
  };
  return iconMap[iconName] || Music;
};

// Default content for Batticaloa
const defaultHeroSlides: HeroSlide[] = [
  { image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80", title: "Discover Batticaloa", subtitle: "Land of the Singing Fish" },
  { image: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&q=80", title: "Batticaloa Lagoon", subtitle: "Mysterious Musical Waters" },
  { image: "https://images.unsplash.com/photo-1559827291-72ee739d0d9a?auto=format&fit=crop&q=80", title: "Dutch Fort", subtitle: "Colonial Heritage Site" },
  { image: "https://images.unsplash.com/photo-1583212292454-1fe6229603b7?auto=format&fit=crop&q=80", title: "Kallady Beach", subtitle: "Eastern Coastal Beauty" },
  { image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&q=80", title: "Pasikudah", subtitle: "Crystal Clear Shallow Waters" }
];

const defaultAttractions: Attraction[] = [
  {
    name: "Batticaloa Lagoon",
    description: "Famous for the mysterious 'singing fish' phenomenon heard on full moon nights from Kallady Bridge - a unique natural wonder found nowhere else.",
    image: "https://images.unsplash.com/photo-1559827260-dc66d52bef19?auto=format&fit=crop&q=80",
    category: "Natural Wonders",
    rating: 4.9,
    duration: "2-3 hours",
    price: "$10",
    icon: "Music"
  },
  {
    name: "Passikudah Beach",
    description: "One of Sri Lanka's longest shallow coastlines, with crystal-clear waters stretching 150-200m from shore - perfect for families and swimming.",
    image: "https://images.unsplash.com/photo-1540541338287-41700207dee6?auto=format&fit=crop&q=80",
    category: "Beaches",
    rating: 4.8,
    duration: "Half Day",
    price: "Free",
    icon: "TreePalm"
  },
  {
    name: "Batticaloa Fort",
    description: "17th-century Dutch colonial fort built in 1628, uniquely surrounded by the lagoon on all four sides, housing historical artifacts and exhibitions.",
    image: "https://images.unsplash.com/photo-1584138868687-dc3e30ba8c52?auto=format&fit=crop&q=80",
    category: "Historical",
    rating: 4.5,
    duration: "1-2 hours",
    price: "Free",
    icon: "Building"
  },
  {
    name: "Kallady Beach & Bridge",
    description: "Iconic bridge connecting two parts of the city, famous for the singing fish phenomenon and stunning sunset views over the lagoon.",
    image: "https://images.unsplash.com/photo-1519046904884-53103b34b206?auto=format&fit=crop&q=80",
    category: "Beaches",
    rating: 4.7,
    duration: "2 hours",
    price: "Free",
    icon: "Waves"
  },
  {
    name: "Batticaloa Lighthouse",
    description: "Historic lighthouse offering panoramic 360-degree views of the lagoon, ocean, and city - especially magical during sunrise and sunset.",
    image: "https://images.unsplash.com/photo-1533761816737-e7c6f54a43c6?auto=format&fit=crop&q=80",
    category: "Landmarks",
    rating: 4.6,
    duration: "1 hour",
    price: "$2",
    icon: "Landmark"
  },
  {
    name: "St. Mary's Cathedral",
    description: "Beautiful Gothic-style Catholic cathedral with impressive architecture, peaceful gardens, and historical significance to the Tamil community.",
    image: "https://images.unsplash.com/photo-1548625361-1cf0745e3502?auto=format&fit=crop&q=80",
    category: "Religious Sites",
    rating: 4.4,
    duration: "30 minutes",
    price: "Free",
    icon: "Building"
  }
];

const defaultActivities: Activity[] = [
  {
    name: "Singing Fish Experience",
    description: "Night boat tour on full moon nights to hear the mysterious musical sounds from the lagoon",
    icon: "Music",
    price: "From $30",
    duration: "2-3 hours",
    difficulty: "Easy",
    popular: true
  },
  {
    name: "Lagoon Boat Safari",
    description: "Explore mangrove forests and spot exotic birds, crocodiles, and marine life",
    icon: "Bird",
    price: "From $25",
    duration: "3 hours",
    difficulty: "Easy",
    popular: true
  },
  {
    name: "Beach Hopping Tour",
    description: "Visit Passikudah, Kallady, Kalkudah, and hidden coastal gems",
    icon: "TreePalm",
    price: "From $40",
    duration: "Full Day",
    difficulty: "Easy"
  },
  {
    name: "Sunrise Photography",
    description: "Capture stunning east coast sunrises at the best photography spots",
    icon: "Sunrise",
    price: "From $35",
    duration: "3 hours",
    difficulty: "Easy"
  },
  {
    name: "Traditional Fishing Trip",
    description: "Join local fishermen on traditional catamarans and learn ancient techniques",
    icon: "Fish",
    price: "From $30",
    duration: "Half Day",
    difficulty: "Moderate"
  },
  {
    name: "Cultural Heritage Walk",
    description: "Explore the fort, temples, churches, and colonial architecture with a local guide",
    icon: "Building",
    price: "From $20",
    duration: "3 hours",
    difficulty: "Easy"
  }
];

const defaultRestaurants: Restaurant[] = [
  {
    name: "Riviera Resort Restaurant",
    cuisine: "Seafood & Sri Lankan",
    description: "Fresh seafood with lagoon views at this popular beachside restaurant",
    priceRange: "$$",
    rating: 4.5
  },
  {
    name: "Sunrise Beach Restaurant",
    cuisine: "Local & International",
    description: "Famous for fresh catch of the day and traditional Tamil cuisine",
    priceRange: "$$",
    rating: 4.4
  },
  {
    name: "Passikudah Bay Restaurant",
    cuisine: "Seafood & Continental",
    description: "Upscale dining with beach views and extensive wine selection",
    priceRange: "$$$",
    rating: 4.6
  },
  {
    name: "Lagoon View Cafe",
    cuisine: "Sri Lankan",
    description: "Authentic kottu roti and rice & curry in a casual setting",
    priceRange: "$",
    rating: 4.3
  }
];

const defaultHotels: HotelInfo[] = [
  {
    name: "Uga Bay by Uga Escapes",
    type: "Luxury Beach Resort",
    priceRange: "$300-500",
    rating: 4.8,
    amenities: ["Private Beach", "Spa", "Infinity Pool", "Water Sports"]
  },
  {
    name: "Amaya Beach Resort",
    type: "Beach Resort",
    priceRange: "$150-280",
    rating: 4.6,
    amenities: ["Beachfront", "Pool", "Restaurant", "Diving Center"]
  },
  {
    name: "Maalu Maalu Resort & Spa",
    type: "Boutique Resort",
    priceRange: "$120-200",
    rating: 4.5,
    amenities: ["Spa", "Garden View", "Restaurant", "Beach Access"]
  },
  {
    name: "Sun Aqua Pasikuda",
    type: "Luxury Resort",
    priceRange: "$180-350",
    rating: 4.7,
    amenities: ["All-Inclusive", "Pool", "Spa", "Kids Club"]
  }
];

const defaultTravelTips: TravelTip[] = [
  {
    title: "Singing Fish Secret",
    description: "Visit Kallady Bridge on full moon nights between April-September. The mysterious musical sounds are best heard around 8-10 PM with minimal boat traffic.",
    icon: "Music"
  },
  {
    title: "Best Time to Visit",
    description: "May to September offers the best weather with calm seas. Avoid November-January when the northeast monsoon brings rain and rough waters.",
    icon: "Calendar"
  },
  {
    title: "Getting Around",
    description: "Tuk-tuks are the main transport ($3-8 for most trips). Rent a bicycle for Passikudah beach area or hire a car for day trips to nearby attractions.",
    icon: "Navigation"
  },
  {
    title: "Local Experience",
    description: "Wake early for spectacular east coast sunrises. Try fresh crab and prawns at local restaurants. Learn a few Tamil phrases - locals appreciate the effort!",
    icon: "Lightbulb"
  }
];

const defaultDestinationInfo: DestinationInfo = {
  population: "92,000",
  area: "854 km²",
  elevation: "Sea level",
  bestTime: "May to September",
  language: "Tamil, Sinhala, English",
  currency: "Sri Lankan Rupee (LKR)"
};

const defaultWeatherInfo: WeatherInfo = {
  temperature: "25-32°C",
  humidity: "75-85%",
  rainfall: "Low (May-Sep)",
  bestMonths: "May to September"
};

const defaultSEO: SEOSettings = {
  metaTitle: "Batticaloa - Land of the Singing Fish | Recharge Travels",
  metaDescription: "Discover Batticaloa's mysterious singing fish, pristine Passikudah beach, peaceful lagoons, and authentic Tamil culture. Plan your east coast escape.",
  keywords: ["Batticaloa", "singing fish", "Passikudah beach", "east coast Sri Lanka", "Kallady Bridge", "lagoon safari", "Tamil culture", "Sri Lanka beaches"]
};

const defaultCTA: CTASection = {
  title: "Ready for East Coast Tranquility?",
  subtitle: "Experience the mysterious singing fish, pristine beaches, and authentic Tamil culture of Batticaloa with our expert local guides",
  buttonText: "Plan Your Batticaloa Escape"
};

const Batticaloa = () => {
  const navigate = useNavigate();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [activeTab, setActiveTab] = useState('attractions');
  const [selectedItem, setSelectedItem] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  // Content state
  const [heroSlides, setHeroSlides] = useState<HeroSlide[]>(defaultHeroSlides);
  const [attractions, setAttractions] = useState<Attraction[]>(defaultAttractions);
  const [activities, setActivities] = useState<Activity[]>(defaultActivities);
  const [restaurants, setRestaurants] = useState<Restaurant[]>(defaultRestaurants);
  const [hotels, setHotels] = useState<HotelInfo[]>(defaultHotels);
  const [travelTips, setTravelTips] = useState<TravelTip[]>(defaultTravelTips);
  const [destinationInfo, setDestinationInfo] = useState<DestinationInfo>(defaultDestinationInfo);
  const [weatherInfo, setWeatherInfo] = useState<WeatherInfo>(defaultWeatherInfo);
  const [seoSettings, setSeoSettings] = useState<SEOSettings>(defaultSEO);
  const [ctaSection, setCtaSection] = useState<CTASection>(defaultCTA);

  // Load content from Firebase
  useEffect(() => {
    const loadContent = async () => {
      try {
        const data = await getDestinationBySlug('batticaloa');
        if (data) {
          if (data.heroSlides?.length) setHeroSlides(data.heroSlides);
          if (data.attractions?.length) setAttractions(data.attractions);
          if (data.activities?.length) setActivities(data.activities);
          if (data.restaurants?.length) setRestaurants(data.restaurants);
          if (data.hotels?.length) setHotels(data.hotels);
          if (data.travelTips?.length) setTravelTips(data.travelTips);
          if (data.destinationInfo) setDestinationInfo(data.destinationInfo);
          if (data.weatherInfo) setWeatherInfo(data.weatherInfo);
          if (data.seoSettings) setSeoSettings(data.seoSettings);
          if (data.ctaSection) setCtaSection(data.ctaSection);
        }
      } catch (error) {
        console.error('Error loading Batticaloa content:', error);
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
    }, 6000);
    return () => clearInterval(timer);
  }, [heroSlides.length]);

  const handleBooking = (service: string = 'Batticaloa Tour', tourData?: { id: string; name: string; description: string; duration: string; price: number; features: string[]; image?: string }) => {
    const params = new URLSearchParams({
      title: tourData?.name || service,
      id: tourData?.id || service.toLowerCase().replace(/\s+/g, '-'),
      duration: tourData?.duration || 'Full Day',
      price: String(tourData?.price || 55),
      image: tourData?.image || 'https://images.unsplash.com/photo-1596402184320-417e7178b2cd?w=800',
      subtitle: `Batticaloa - ${tourData?.name || service}`
    });
    navigate(`/book-tour?${params.toString()}`);
  };

  // Dynamic tabs based on available content
  const tabs = [
    { id: 'attractions', label: 'Attractions', count: attractions.length },
    { id: 'activities', label: 'Activities', count: activities.length },
    { id: 'restaurants', label: 'Dining', count: restaurants.length },
    { id: 'hotels', label: 'Stay', count: hotels.length },
    { id: 'weather', label: 'Weather', count: null },
    { id: 'tips', label: 'Travel Tips', count: travelTips.length },
    { id: 'map', label: 'Map', count: null }
  ];

  return (
    <>
      <Helmet>
        <title>{seoSettings.metaTitle}</title>
        <meta name="description" content={seoSettings.metaDescription} />
        <meta name="keywords" content={seoSettings.keywords.join(', ')} />
        <meta property="og:title" content={seoSettings.metaTitle} />
        <meta property="og:description" content={seoSettings.metaDescription} />
        <link rel="canonical" href="https://rechargetravels.com/destinations/batticaloa" />
      </Helmet>

      <Header />

      <main className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
        {/* Hero Section with Slideshow */}
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
                className="h-full w-full bg-cover bg-center"
                style={{ backgroundImage: `url(${heroSlides[currentSlide]?.image})` }}
              >
                <div className="absolute inset-0 bg-gradient-to-b from-amber-900/40 via-black/30 to-black/60" />
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Hero Content */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center text-white px-4 max-w-5xl">
              <motion.div
                initial={{ y: 30, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="mb-4"
              >
                <Badge className="bg-amber-600/80 text-white px-4 py-1 text-sm">
                  Land of the Singing Fish
                </Badge>
              </motion.div>
              <motion.h1
                initial={{ y: 30, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="text-5xl md:text-7xl font-bold mb-6 drop-shadow-lg"
              >
                {heroSlides[currentSlide]?.title}
              </motion.h1>
              <motion.p
                initial={{ y: 30, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="text-xl md:text-2xl mb-8 drop-shadow-md"
              >
                {heroSlides[currentSlide]?.subtitle}
              </motion.p>
              <motion.div
                initial={{ y: 30, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.6 }}
                className="flex flex-wrap justify-center gap-4"
              >
                <Button
                  size="lg"
                  className="bg-amber-600 hover:bg-amber-700 text-white px-8 py-6 text-lg shadow-xl"
                  onClick={() => handleBooking('Batticaloa Tour')}
                >
                  Plan Your Visit
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="border-white text-white hover:bg-white/20 px-8 py-6 text-lg"
                  onClick={() => setActiveTab('attractions')}
                >
                  Explore Attractions
                </Button>
              </motion.div>
            </div>
          </div>

          {/* Slide Indicators */}
          <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex space-x-3">
            {heroSlides.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentSlide(index)}
                className={`h-2 rounded-full transition-all duration-300 ${
                  currentSlide === index ? 'bg-white w-8' : 'bg-white/50 w-2'
                }`}
              />
            ))}
          </div>
        </section>

        {/* Quick Info Bar */}
        <section className="bg-gradient-to-r from-amber-600 to-orange-600 text-white py-4 shadow-lg">
          <div className="container mx-auto px-4">
            <div className="flex flex-wrap justify-center items-center gap-6 md:gap-10 text-sm">
              <div className="flex items-center gap-2">
                <Waves className="w-5 h-5" />
                <span>Elevation: {destinationInfo.elevation}</span>
              </div>
              <div className="flex items-center gap-2">
                <Thermometer className="w-5 h-5" />
                <span>Temperature: {weatherInfo.temperature}</span>
              </div>
              <div className="flex items-center gap-2">
                <Users className="w-5 h-5" />
                <span>Population: {destinationInfo.population}</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="w-5 h-5" />
                <span>Best Time: {destinationInfo.bestTime}</span>
              </div>
            </div>
          </div>
        </section>

        {/* Tab Navigation */}
        <nav className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b shadow-sm">
          <div className="container mx-auto px-4">
            <div className="flex overflow-x-auto scrollbar-hide py-1">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-6 py-4 font-medium transition-all whitespace-nowrap border-b-2 ${
                    activeTab === tab.id
                      ? 'border-amber-600 text-amber-600'
                      : 'border-transparent text-gray-600 hover:text-amber-600'
                  }`}
                >
                  {tab.label}
                  {tab.count !== null && (
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
            {activeTab === 'attractions' && (
              <motion.div
                key="attractions"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                <div className="text-center mb-10">
                  <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                    Top Attractions
                  </h2>
                  <p className="text-gray-600 max-w-2xl mx-auto">
                    Discover Batticaloa's unique lagoon, pristine beaches, and rich Tamil heritage
                  </p>
                </div>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {attractions.map((attraction, index) => {
                    const IconComponent = getIconComponent(attraction.icon || 'Music');
                    return (
                      <Card key={index} className="group hover:shadow-2xl transition-all duration-300 overflow-hidden border-0 shadow-lg">
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
                          <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm rounded-full px-3 py-1 flex items-center">
                            <Star className="w-4 h-4 text-yellow-500 mr-1" />
                            <span className="font-semibold text-sm">{attraction.rating}</span>
                          </div>
                        </div>
                        <CardHeader className="pb-2">
                          <CardTitle className="text-xl flex items-center gap-2">
                            <IconComponent className="w-5 h-5 text-amber-600" />
                            {attraction.name}
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <p className="text-gray-600 mb-4 line-clamp-2">{attraction.description}</p>
                          <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                            <div className="flex items-center">
                              <Clock className="w-4 h-4 mr-1" />
                              {attraction.duration}
                            </div>
                            <div className="flex items-center font-semibold text-amber-600">
                              <DollarSign className="w-4 h-4 mr-1" />
                              {attraction.price}
                            </div>
                          </div>
                          <Button
                            className="w-full bg-amber-600 hover:bg-amber-700"
                            onClick={() => handleBooking(attraction.name)}
                          >
                            Book Visit
                          </Button>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              </motion.div>
            )}

            {/* Activities Tab */}
            {activeTab === 'activities' && (
              <motion.div
                key="activities"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                <div className="text-center mb-10">
                  <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                    Things to Do
                  </h2>
                  <p className="text-gray-600 max-w-2xl mx-auto">
                    From the mysterious singing fish to lagoon safaris, experience unforgettable adventures
                  </p>
                </div>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {activities.map((activity, index) => {
                    const IconComponent = getIconComponent(activity.icon);
                    return (
                      <Card key={index} className="hover:shadow-xl transition-all duration-300 border-0 shadow-md">
                        <CardHeader>
                          <div className="flex items-start justify-between">
                            <div className="flex items-center gap-3">
                              <div className="p-3 bg-amber-100 rounded-xl">
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
                          <p className="text-gray-600 mb-4">{activity.description}</p>
                          <div className="flex flex-wrap gap-2 mb-4">
                            <Badge variant="outline" className="text-amber-600 border-amber-200">
                              {activity.duration}
                            </Badge>
                            {activity.difficulty && (
                              <Badge variant="outline" className="text-gray-600">
                                {activity.difficulty}
                              </Badge>
                            )}
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-xl font-bold text-amber-600">{activity.price}</span>
                            <Button
                              variant="outline"
                              className="border-amber-600 text-amber-600 hover:bg-amber-600 hover:text-white"
                              onClick={() => handleBooking(activity.name)}
                            >
                              Book Now
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              </motion.div>
            )}

            {/* Restaurants Tab */}
            {activeTab === 'restaurants' && (
              <motion.div
                key="restaurants"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                <div className="text-center mb-10">
                  <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                    Where to Dine
                  </h2>
                  <p className="text-gray-600 max-w-2xl mx-auto">
                    Savor fresh seafood and authentic Tamil cuisine at Batticaloa's best restaurants
                  </p>
                </div>
                <div className="grid md:grid-cols-2 gap-6">
                  {restaurants.map((restaurant, index) => (
                    <Card key={index} className="hover:shadow-xl transition-all duration-300 border-0 shadow-md">
                      <CardContent className="p-6">
                        <div className="flex items-start gap-4">
                          <div className="p-3 bg-amber-100 rounded-xl">
                            <Utensils className="w-6 h-6 text-amber-600" />
                          </div>
                          <div className="flex-1">
                            <div className="flex justify-between items-start mb-2">
                              <h3 className="text-xl font-semibold">{restaurant.name}</h3>
                              {restaurant.rating && (
                                <div className="flex items-center">
                                  <Star className="w-4 h-4 text-yellow-500 mr-1" />
                                  <span className="font-medium">{restaurant.rating}</span>
                                </div>
                              )}
                            </div>
                            <Badge variant="outline" className="mb-2">{restaurant.cuisine}</Badge>
                            <p className="text-gray-600 mb-3">{restaurant.description}</p>
                            <div className="flex justify-between items-center">
                              <span className="text-amber-600 font-semibold">{restaurant.priceRange}</span>
                              <Button
                                variant="outline"
                                size="sm"
                                className="border-amber-600 text-amber-600 hover:bg-amber-600 hover:text-white"
                                onClick={() => handleBooking(`Dinner at ${restaurant.name}`)}
                              >
                                Reserve Table
                              </Button>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Hotels Tab */}
            {activeTab === 'hotels' && (
              <motion.div
                key="hotels"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                <div className="text-center mb-10">
                  <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                    Where to Stay
                  </h2>
                  <p className="text-gray-600 max-w-2xl mx-auto">
                    From luxury beach resorts to boutique hotels, find your perfect coastal retreat
                  </p>
                </div>
                <div className="space-y-6">
                  {hotels.map((hotel, index) => (
                    <Card key={index} className="hover:shadow-xl transition-all duration-300 border-0 shadow-md overflow-hidden">
                      <CardContent className="p-6">
                        <div className="flex flex-col md:flex-row justify-between gap-6">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              <Hotel className="w-6 h-6 text-amber-600" />
                              <h3 className="text-xl font-semibold">{hotel.name}</h3>
                              {hotel.rating && (
                                <div className="flex items-center bg-amber-100 px-2 py-1 rounded-full">
                                  <Star className="w-4 h-4 text-yellow-500 mr-1" />
                                  <span className="text-sm font-medium">{hotel.rating}</span>
                                </div>
                              )}
                            </div>
                            <Badge variant="outline" className="mb-3">{hotel.type}</Badge>
                            <div className="flex flex-wrap gap-2">
                              {hotel.amenities.map((amenity, idx) => (
                                <Badge key={idx} variant="secondary" className="bg-amber-50 text-amber-700">
                                  {amenity}
                                </Badge>
                              ))}
                            </div>
                          </div>
                          <div className="text-right flex flex-col justify-between">
                            <div>
                              <p className="text-2xl font-bold text-amber-600">{hotel.priceRange}</p>
                              <p className="text-sm text-gray-500">per night</p>
                            </div>
                            <Button
                              className="mt-4 bg-amber-600 hover:bg-amber-700"
                              onClick={() => handleBooking(hotel.name)}
                            >
                              Check Availability
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Weather Tab */}
            {activeTab === 'weather' && (
              <motion.div
                key="weather"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                <div className="text-center mb-10">
                  <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                    Weather & Climate
                  </h2>
                  <p className="text-gray-600 max-w-2xl mx-auto">
                    Plan your visit with detailed weather information for Batticaloa's tropical coast
                  </p>
                </div>
                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                  <Card className="text-center p-6 border-0 shadow-lg bg-gradient-to-br from-orange-50 to-white">
                    <Thermometer className="w-12 h-12 text-orange-500 mx-auto mb-4" />
                    <h3 className="font-semibold text-gray-900 mb-2">Temperature</h3>
                    <p className="text-2xl font-bold text-orange-500">{weatherInfo.temperature}</p>
                    <p className="text-sm text-gray-500 mt-2">Warm year-round</p>
                  </Card>
                  <Card className="text-center p-6 border-0 shadow-lg bg-gradient-to-br from-blue-50 to-white">
                    <Droplets className="w-12 h-12 text-blue-600 mx-auto mb-4" />
                    <h3 className="font-semibold text-gray-900 mb-2">Humidity</h3>
                    <p className="text-2xl font-bold text-blue-600">{weatherInfo.humidity}</p>
                    <p className="text-sm text-gray-500 mt-2">Sea breeze comfort</p>
                  </Card>
                  <Card className="text-center p-6 border-0 shadow-lg bg-gradient-to-br from-amber-50 to-white">
                    <Cloud className="w-12 h-12 text-amber-600 mx-auto mb-4" />
                    <h3 className="font-semibold text-gray-900 mb-2">Rainfall</h3>
                    <p className="text-2xl font-bold text-amber-600">{weatherInfo.rainfall}</p>
                    <p className="text-sm text-gray-500 mt-2">Nov-Jan monsoon</p>
                  </Card>
                  <Card className="text-center p-6 border-0 shadow-lg bg-gradient-to-br from-green-50 to-white">
                    <Sun className="w-12 h-12 text-green-500 mx-auto mb-4" />
                    <h3 className="font-semibold text-gray-900 mb-2">Best Months</h3>
                    <p className="text-2xl font-bold text-green-500">{weatherInfo.bestMonths}</p>
                    <p className="text-sm text-gray-500 mt-2">Perfect beach weather</p>
                  </Card>
                </div>

                <Card className="mt-8 border-0 shadow-lg">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Info className="w-5 h-5 text-amber-600" />
                      Destination Information
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid md:grid-cols-3 gap-6">
                      <div>
                        <p className="text-sm text-gray-500">Elevation</p>
                        <p className="font-semibold text-lg">{destinationInfo.elevation}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Area</p>
                        <p className="font-semibold text-lg">{destinationInfo.area}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Population</p>
                        <p className="font-semibold text-lg">{destinationInfo.population}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Best Time to Visit</p>
                        <p className="font-semibold text-lg">{destinationInfo.bestTime}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Languages</p>
                        <p className="font-semibold text-lg">{destinationInfo.language}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Currency</p>
                        <p className="font-semibold text-lg">{destinationInfo.currency}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )}

            {/* Travel Tips Tab */}
            {activeTab === 'tips' && (
              <motion.div
                key="tips"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                <div className="text-center mb-10">
                  <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                    Travel Tips & Advice
                  </h2>
                  <p className="text-gray-600 max-w-2xl mx-auto">
                    Essential information to make the most of your Batticaloa adventure
                  </p>
                </div>
                <div className="grid md:grid-cols-2 gap-6">
                  {travelTips.map((tip, index) => {
                    const IconComponent = getIconComponent(tip.icon);
                    return (
                      <Card key={index} className="border-0 shadow-lg hover:shadow-xl transition-all duration-300">
                        <CardContent className="p-6">
                          <div className="flex items-start gap-4">
                            <div className="p-3 bg-amber-100 rounded-xl shrink-0">
                              <IconComponent className="w-6 h-6 text-amber-600" />
                            </div>
                            <div>
                              <h3 className="text-lg font-semibold mb-2">{tip.title}</h3>
                              <p className="text-gray-600">{tip.description}</p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              </motion.div>
            )}

            {/* Map Tab */}
            {activeTab === 'map' && (
              <motion.div
                key="map"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                <div>
                  <h2 className="text-3xl font-bold mb-8">Explore Batticaloa Map</h2>
                  <div className="grid lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-2">
                      <Card className="overflow-hidden h-[500px]">
                        <DestinationMap
                          destinationName="Batticaloa"
                          center={BATTICALOA_CENTER}
                          attractions={[
                            { name: 'Batticaloa Lagoon', description: 'Famous singing fish lagoon', coordinates: { lat: 7.7310, lng: 81.6747 } },
                            { name: 'Kallady Beach', description: 'Popular beach area', coordinates: { lat: 7.7150, lng: 81.7050 } },
                            { name: 'Batticaloa Fort', description: 'Dutch colonial fort', coordinates: { lat: 7.7170, lng: 81.7000 } },
                            { name: 'Pasikudah Beach', description: 'Beautiful sandy beach', coordinates: { lat: 7.9200, lng: 81.5600 } },
                            { name: 'Kalkudah Beach', description: 'Serene coastal stretch', coordinates: { lat: 7.9100, lng: 81.5700 } }
                          ]}
                          height="500px"
                        />
                      </Card>
                    </div>
                    <div className="lg:col-span-1">
                      <WeatherWidget
                        locationName="Batticaloa"
                        latitude={BATTICALOA_CENTER.lat}
                        longitude={BATTICALOA_CENTER.lng}
                      />
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* CTA Section */}
        <section className="bg-gradient-to-r from-amber-600 via-orange-600 to-amber-700 text-white py-16">
          <div className="container mx-auto px-4 text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-3xl md:text-4xl font-bold mb-4">{ctaSection.title}</h2>
              <p className="text-xl mb-8 max-w-2xl mx-auto opacity-90">{ctaSection.subtitle}</p>
              <Button
                size="lg"
                className="bg-white text-amber-700 hover:bg-gray-100 px-8 py-6 text-lg shadow-xl"
                onClick={() => handleBooking('Batticaloa Complete Tour')}
              >
                {ctaSection.buttonText}
              </Button>
            </motion.div>
          </div>
        </section>
      </main>

      <Footer />

      {/* WhatsApp Floating Button */}
      <a
        href="https://wa.me/94777721999?text=Hi! I'm interested in booking a Batticaloa tour."
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

export default Batticaloa;
