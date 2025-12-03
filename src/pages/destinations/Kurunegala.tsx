import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { useNavigate } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Mountain,
  Crown,
  Navigation,
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
  Building,
  ShoppingBag,
  TreePine,
  Eye,
  Compass,
  Thermometer,
  Droplets,
  Lightbulb,
  Landmark,
  Footprints
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import DestinationMap from '@/components/destinations/DestinationMap';
import WeatherWidget from '@/components/destinations/WeatherWidget';
import { getDestinationBySlug } from '@/services/destinationContentService';

const KURUNEGALA_CENTER = { lat: 7.4863, lng: 80.3647 };

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
    Mountain, Crown, Navigation, MapPin, Calendar, Clock, Star, Wifi, Utensils,
    Camera, Hotel, Heart, Users, DollarSign, Info, Sun, Cloud, Building,
    ShoppingBag, TreePine, Eye, Compass, Thermometer, Droplets, Lightbulb,
    Landmark, Footprints
  };
  return iconMap[iconName] || Mountain;
};

// Default content for Kurunegala
const defaultHeroSlides: HeroSlide[] = [
  { image: "https://images.unsplash.com/photo-1588598198321-39f8c2be97ba?auto=format&fit=crop&q=80", title: "Discover Kurunegala", subtitle: "City of the Elephant Rock" },
  { image: "https://images.unsplash.com/photo-1552465011-b4e21bf6e79a?auto=format&fit=crop&q=80", title: "Ethagala", subtitle: "Iconic Elephant-Shaped Rock" },
  { image: "https://images.unsplash.com/photo-1586613835341-78c143aef52c?auto=format&fit=crop&q=80", title: "Kurunegala Lake", subtitle: "Scenic Urban Reservoir" },
  { image: "https://images.unsplash.com/photo-1571536802807-30451e3f3d43?auto=format&fit=crop&q=80", title: "Ancient Temples", subtitle: "Buddhist Heritage Sites" },
  { image: "https://images.unsplash.com/photo-1578128178243-721cd32ce739?auto=format&fit=crop&q=80", title: "Ridi Viharaya", subtitle: "Silver Temple Caves" }
];

const defaultAttractions: Attraction[] = [
  {
    name: "Elephant Rock (Ethagala)",
    description: "Massive rock formation resembling an elephant, offering breathtaking 360-degree panoramic views of the city after a moderate 30-45 minute climb.",
    image: "https://images.unsplash.com/photo-1580398033920-f03c87fa9d2e?auto=format&fit=crop&q=80",
    category: "Natural Landmarks",
    rating: 4.9,
    duration: "2-3 hours",
    price: "Free",
    icon: "Mountain"
  },
  {
    name: "Ridi Viharaya (Silver Temple)",
    description: "Ancient cave temple complex dating back to 2nd century BC, famous for its silver-plated doors, stunning cave paintings, and historical significance.",
    image: "https://images.unsplash.com/photo-1611510338559-2f463335092c?auto=format&fit=crop&q=80",
    category: "Religious Sites",
    rating: 4.7,
    duration: "1-2 hours",
    price: "$3",
    icon: "Landmark"
  },
  {
    name: "Yapahuwa Rock Fortress",
    description: "13th-century rock fortress and former royal capital, featuring ornate stone carvings, steep stairway, and ancient palace ruins with museum.",
    image: "https://images.unsplash.com/photo-1624382651814-6457b4aebaec?auto=format&fit=crop&q=80",
    category: "Historical Sites",
    rating: 4.8,
    duration: "3-4 hours",
    price: "$5",
    icon: "Crown"
  },
  {
    name: "Kurunegala Lake",
    description: "Scenic man-made lake in the city center, perfect for evening walks and boat rides with views of surrounding rock formations and wildlife.",
    image: "https://images.unsplash.com/photo-1570288685369-f7305163d0e3?auto=format&fit=crop&q=80",
    category: "Nature & Lakes",
    rating: 4.5,
    duration: "1-2 hours",
    price: "Free",
    icon: "Eye"
  },
  {
    name: "Panduwasnuwara",
    description: "Ancient ruined city with well-preserved royal palace complex, moonstones, guard stones, and archaeological remains from the 12th century.",
    image: "https://images.unsplash.com/photo-1599661046289-e31897846d41?auto=format&fit=crop&q=80",
    category: "Archaeological Sites",
    rating: 4.5,
    duration: "2 hours",
    price: "$3",
    icon: "Building"
  },
  {
    name: "Athugala Buddha Statue",
    description: "Impressive giant standing Buddha statue carved into the rock face atop Athugala hill, offering stunning views and peaceful atmosphere.",
    image: "https://images.unsplash.com/photo-1605648183612-2de8fa332610?auto=format&fit=crop&q=80",
    category: "Religious Sites",
    rating: 4.6,
    duration: "1 hour",
    price: "Free",
    icon: "Landmark"
  }
];

const defaultActivities: Activity[] = [
  {
    name: "Elephant Rock Sunrise Hike",
    description: "Early morning climb to catch breathtaking sunrise views over the city",
    icon: "Mountain",
    price: "From $25",
    duration: "3 hours",
    difficulty: "Moderate",
    popular: true
  },
  {
    name: "Cultural Triangle Tour",
    description: "Day trip to Dambulla, Sigiriya, and Polonnaruwa from Kurunegala",
    icon: "Crown",
    price: "From $60",
    duration: "Full Day",
    difficulty: "Easy",
    popular: true
  },
  {
    name: "Rock Fortress Circuit",
    description: "Visit Yapahuwa, Panduwasnuwara, and other ancient rock fortresses",
    icon: "Compass",
    price: "From $45",
    duration: "Full Day",
    difficulty: "Moderate"
  },
  {
    name: "Photography Workshop",
    description: "Capture stunning landscapes and ancient architecture with expert guidance",
    icon: "Camera",
    price: "From $40",
    duration: "Half Day",
    difficulty: "Easy"
  },
  {
    name: "Temple Heritage Walk",
    description: "Explore ancient cave temples with knowledgeable local guides",
    icon: "Building",
    price: "From $30",
    duration: "4 hours",
    difficulty: "Easy"
  },
  {
    name: "Village Experience Tour",
    description: "Experience rural life, traditional crafts, and local cuisine",
    icon: "Footprints",
    price: "From $35",
    duration: "Half Day",
    difficulty: "Easy"
  }
];

const defaultRestaurants: Restaurant[] = [
  {
    name: "The Grand Indian",
    cuisine: "North Indian",
    description: "Popular restaurant serving authentic North Indian cuisine with rich flavors",
    priceRange: "$$",
    rating: 4.4
  },
  {
    name: "Hotel Diya Dahara",
    cuisine: "Sri Lankan",
    description: "Traditional rice and curry with stunning lake views",
    priceRange: "$",
    rating: 4.3
  },
  {
    name: "Jade Green Restaurant",
    cuisine: "Chinese & Sri Lankan",
    description: "Fusion cuisine in a modern setting with city views",
    priceRange: "$$",
    rating: 4.5
  },
  {
    name: "Lake View Restaurant",
    cuisine: "International",
    description: "Diverse menu with beautiful views of Kurunegala Lake",
    priceRange: "$$",
    rating: 4.4
  }
];

const defaultHotels: HotelInfo[] = [
  {
    name: "The Elephant Stables",
    type: "Boutique Hotel",
    priceRange: "$100-180",
    rating: 4.6,
    amenities: ["Pool", "Restaurant", "Spa", "Cultural Tours"]
  },
  {
    name: "Cadjan Wild",
    type: "Eco Resort",
    priceRange: "$80-150",
    rating: 4.5,
    amenities: ["Nature Setting", "Restaurant", "WiFi", "Tours"]
  },
  {
    name: "Hotel Diya Dahara",
    type: "Business Hotel",
    priceRange: "$50-90",
    rating: 4.3,
    amenities: ["Lake View", "Restaurant", "Conference", "WiFi"]
  },
  {
    name: "Kurunegala Rest House",
    type: "Heritage",
    priceRange: "$40-70",
    rating: 4.2,
    amenities: ["Colonial Charm", "Central Location", "Restaurant", "Garden"]
  }
];

const defaultTravelTips: TravelTip[] = [
  {
    title: "Elephant Rock Climb",
    description: "Start early morning (5:30-6 AM) to avoid heat and catch sunrise. The climb takes 30-45 minutes. Wear comfortable shoes and bring water.",
    icon: "Mountain"
  },
  {
    title: "Cultural Triangle Base",
    description: "Kurunegala is perfectly located for day trips to Dambulla, Sigiriya, Anuradhapura, and Polonnaruwa. Lower accommodation costs than tourist hubs.",
    icon: "Compass"
  },
  {
    title: "Getting Around",
    description: "Tuk-tuks are affordable ($2-5 for most trips). Hire a car with driver for day trips to Cultural Triangle sites. Bus station connects to all major cities.",
    icon: "Navigation"
  },
  {
    title: "Hidden Gems",
    description: "Visit Yapahuwa and Panduwasnuwara for fewer crowds. Ridi Viharaya is best explored in the morning. Try local restaurants for authentic cuisine.",
    icon: "Lightbulb"
  }
];

const defaultDestinationInfo: DestinationInfo = {
  population: "122,000",
  area: "1,611 km²",
  elevation: "116 m",
  bestTime: "January to April",
  language: "Sinhala, Tamil, English",
  currency: "Sri Lankan Rupee (LKR)"
};

const defaultWeatherInfo: WeatherInfo = {
  temperature: "22-32°C",
  humidity: "70-85%",
  rainfall: "Moderate",
  bestMonths: "January to April"
};

const defaultSEO: SEOSettings = {
  metaTitle: "Kurunegala - Elephant Rock & Cultural Triangle Gateway | Recharge Travels",
  metaDescription: "Climb Elephant Rock, explore ancient Yapahuwa fortress, and use Kurunegala as your base for Cultural Triangle adventures. Discover this central Sri Lankan hub.",
  keywords: ["Kurunegala", "Elephant Rock", "Ethagala", "Yapahuwa", "Cultural Triangle", "Ridi Viharaya", "Panduwasnuwara", "Sri Lanka"]
};

const defaultCTA: CTASection = {
  title: "Ready to Climb Elephant Rock?",
  subtitle: "Experience stunning views, ancient temples, and use Kurunegala as your gateway to Sri Lanka's Cultural Triangle",
  buttonText: "Start Your Adventure"
};

const Kurunegala = () => {
  const navigate = useNavigate();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [activeTab, setActiveTab] = useState('attractions');
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
        const data = await getDestinationBySlug('kurunegala');
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
        console.error('Error loading Kurunegala content:', error);
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

  const handleBooking = (service: string = 'Kurunegala Tour', tourData?: { id: string; name: string; description: string; duration: string; price: number; features: string[]; image?: string }) => {
    const params = new URLSearchParams({
      title: tourData?.name || service,
      id: tourData?.id || service.toLowerCase().replace(/\s+/g, '-'),
      duration: tourData?.duration || 'Full Day',
      price: String(tourData?.price || 45),
      image: tourData?.image || 'https://images.unsplash.com/photo-1588598198321-9735fd509ed5?w=800',
      subtitle: `Kurunegala - ${tourData?.name || service}`
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
    { id: 'map', label: 'Map', count: null },
    { id: 'tips', label: 'Travel Tips', count: travelTips.length }
  ];

  return (
    <>
      <Helmet>
        <title>{seoSettings.metaTitle}</title>
        <meta name="description" content={seoSettings.metaDescription} />
        <meta name="keywords" content={seoSettings.keywords.join(', ')} />
        <meta property="og:title" content={seoSettings.metaTitle} />
        <meta property="og:description" content={seoSettings.metaDescription} />
        <link rel="canonical" href="https://rechargetravels.com/destinations/kurunegala" />
      </Helmet>

      <Header />

      <main className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
        {/* Hero Section with Slideshow */}
        <section className="relative aspect-video max-h-[75vh] overflow-hidden">
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
                <div className="absolute inset-0 bg-gradient-to-b from-stone-900/40 via-black/30 to-black/60" />
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
                <Badge className="bg-stone-600/80 text-white px-4 py-1 text-sm">
                  Gateway to Cultural Triangle
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
                  className="bg-stone-700 hover:bg-stone-800 text-white px-8 py-6 text-lg shadow-xl"
                  onClick={() => handleBooking('Kurunegala Tour')}
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
        <section className="bg-gradient-to-r from-stone-700 to-stone-600 text-white py-4 shadow-lg">
          <div className="container mx-auto px-4">
            <div className="flex flex-wrap justify-center items-center gap-6 md:gap-10 text-sm">
              <div className="flex items-center gap-2">
                <Mountain className="w-5 h-5" />
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
                      ? 'border-stone-700 text-stone-700'
                      : 'border-transparent text-gray-600 hover:text-stone-700'
                  }`}
                >
                  {tab.label}
                  {tab.count !== null && (
                    <Badge variant="secondary" className="ml-2 bg-stone-100 text-stone-700">
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
                    Discover Kurunegala's iconic rock formations, ancient temples, and historical fortresses
                  </p>
                </div>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {attractions.map((attraction, index) => {
                    const IconComponent = getIconComponent(attraction.icon || 'Mountain');
                    return (
                      <Card key={index} className="group hover:shadow-2xl transition-all duration-300 overflow-hidden border-0 shadow-lg">
                        <div className="aspect-video overflow-hidden relative">
                          <img
                            src={attraction.image}
                            alt={attraction.name}
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                          />
                          <div className="absolute top-4 left-4">
                            <Badge className="bg-stone-700 text-white">
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
                            <IconComponent className="w-5 h-5 text-stone-700" />
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
                            <div className="flex items-center font-semibold text-stone-700">
                              <DollarSign className="w-4 h-4 mr-1" />
                              {attraction.price}
                            </div>
                          </div>
                          <Button
                            className="w-full bg-stone-700 hover:bg-stone-800"
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
                    From sunrise hikes to Cultural Triangle tours, experience unforgettable adventures
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
                              <div className="p-3 bg-stone-100 rounded-xl">
                                <IconComponent className="w-6 h-6 text-stone-700" />
                              </div>
                              <div>
                                <CardTitle className="text-lg">{activity.name}</CardTitle>
                                {activity.popular && (
                                  <Badge className="mt-1 bg-amber-500 text-white">Popular</Badge>
                                )}
                              </div>
                            </div>
                          </div>
                        </CardHeader>
                        <CardContent>
                          <p className="text-gray-600 mb-4">{activity.description}</p>
                          <div className="flex flex-wrap gap-2 mb-4">
                            <Badge variant="outline" className="text-stone-700 border-stone-200">
                              {activity.duration}
                            </Badge>
                            {activity.difficulty && (
                              <Badge variant="outline" className="text-gray-600">
                                {activity.difficulty}
                              </Badge>
                            )}
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-xl font-bold text-stone-700">{activity.price}</span>
                            <Button
                              variant="outline"
                              className="border-stone-700 text-stone-700 hover:bg-stone-700 hover:text-white"
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
                    Discover authentic Sri Lankan cuisine and international flavors in Kurunegala
                  </p>
                </div>
                <div className="grid md:grid-cols-2 gap-6">
                  {restaurants.map((restaurant, index) => (
                    <Card key={index} className="hover:shadow-xl transition-all duration-300 border-0 shadow-md">
                      <CardContent className="p-6">
                        <div className="flex items-start gap-4">
                          <div className="p-3 bg-stone-100 rounded-xl">
                            <Utensils className="w-6 h-6 text-stone-700" />
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
                              <span className="text-stone-700 font-semibold">{restaurant.priceRange}</span>
                              <Button
                                variant="outline"
                                size="sm"
                                className="border-stone-700 text-stone-700 hover:bg-stone-700 hover:text-white"
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
                    Comfortable accommodation options - your base for Cultural Triangle adventures
                  </p>
                </div>
                <div className="space-y-6">
                  {hotels.map((hotel, index) => (
                    <Card key={index} className="hover:shadow-xl transition-all duration-300 border-0 shadow-md overflow-hidden">
                      <CardContent className="p-6">
                        <div className="flex flex-col md:flex-row justify-between gap-6">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              <Hotel className="w-6 h-6 text-stone-700" />
                              <h3 className="text-xl font-semibold">{hotel.name}</h3>
                              {hotel.rating && (
                                <div className="flex items-center bg-stone-100 px-2 py-1 rounded-full">
                                  <Star className="w-4 h-4 text-yellow-500 mr-1" />
                                  <span className="text-sm font-medium">{hotel.rating}</span>
                                </div>
                              )}
                            </div>
                            <Badge variant="outline" className="mb-3">{hotel.type}</Badge>
                            <div className="flex flex-wrap gap-2">
                              {hotel.amenities.map((amenity, idx) => (
                                <Badge key={idx} variant="secondary" className="bg-stone-50 text-stone-700">
                                  {amenity}
                                </Badge>
                              ))}
                            </div>
                          </div>
                          <div className="text-right flex flex-col justify-between">
                            <div>
                              <p className="text-2xl font-bold text-stone-700">{hotel.priceRange}</p>
                              <p className="text-sm text-gray-500">per night</p>
                            </div>
                            <Button
                              className="mt-4 bg-stone-700 hover:bg-stone-800"
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
                    Plan your visit with detailed weather information for Kurunegala
                  </p>
                </div>
                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                  <Card className="text-center p-6 border-0 shadow-lg bg-gradient-to-br from-orange-50 to-white">
                    <Thermometer className="w-12 h-12 text-orange-500 mx-auto mb-4" />
                    <h3 className="font-semibold text-gray-900 mb-2">Temperature</h3>
                    <p className="text-2xl font-bold text-orange-500">{weatherInfo.temperature}</p>
                    <p className="text-sm text-gray-500 mt-2">Pleasant tropical</p>
                  </Card>
                  <Card className="text-center p-6 border-0 shadow-lg bg-gradient-to-br from-blue-50 to-white">
                    <Droplets className="w-12 h-12 text-blue-600 mx-auto mb-4" />
                    <h3 className="font-semibold text-gray-900 mb-2">Humidity</h3>
                    <p className="text-2xl font-bold text-blue-600">{weatherInfo.humidity}</p>
                    <p className="text-sm text-gray-500 mt-2">Tropical levels</p>
                  </Card>
                  <Card className="text-center p-6 border-0 shadow-lg bg-gradient-to-br from-stone-50 to-white">
                    <Cloud className="w-12 h-12 text-stone-600 mx-auto mb-4" />
                    <h3 className="font-semibold text-gray-900 mb-2">Rainfall</h3>
                    <p className="text-2xl font-bold text-stone-600">{weatherInfo.rainfall}</p>
                    <p className="text-sm text-gray-500 mt-2">Two monsoon seasons</p>
                  </Card>
                  <Card className="text-center p-6 border-0 shadow-lg bg-gradient-to-br from-green-50 to-white">
                    <Sun className="w-12 h-12 text-green-500 mx-auto mb-4" />
                    <h3 className="font-semibold text-gray-900 mb-2">Best Months</h3>
                    <p className="text-2xl font-bold text-green-500">{weatherInfo.bestMonths}</p>
                    <p className="text-sm text-gray-500 mt-2">Dry season</p>
                  </Card>
                </div>

                <Card className="mt-8 border-0 shadow-lg">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Info className="w-5 h-5 text-stone-700" />
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

            {/* Map Tab */}
            {activeTab === 'map' && (
              <motion.div
                key="map"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                <div className="text-center mb-10">
                  <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                    Explore Kurunegala Map
                  </h2>
                  <p className="text-gray-600 max-w-2xl mx-auto">
                    Navigate through Kurunegala's iconic landmarks and attractions
                  </p>
                </div>
                <div className="grid lg:grid-cols-3 gap-8">
                  <div className="lg:col-span-2">
                    <Card className="overflow-hidden h-[500px]">
                      <DestinationMap
                        destinationName="Kurunegala"
                        center={KURUNEGALA_CENTER}
                        attractions={[
                          { name: 'Ethagala Rock', description: 'Elephant Rock viewpoint', coordinates: { lat: 7.4900, lng: 80.3700 } },
                          { name: 'Kurunegala Lake', description: 'Scenic city lake', coordinates: { lat: 7.4850, lng: 80.3650 } },
                          { name: 'Athugala Temple', description: 'Rock temple with Buddha statue', coordinates: { lat: 7.4920, lng: 80.3680 } },
                          { name: 'Ridi Viharaya', description: 'Ancient silver temple', coordinates: { lat: 7.4200, lng: 80.3100 } },
                          { name: 'Yapahuwa Rock Fortress', description: 'Medieval rock fortress', coordinates: { lat: 7.7900, lng: 80.3100 } }
                        ]}
                        height="500px"
                      />
                    </Card>
                  </div>
                  <div className="lg:col-span-1">
                    <WeatherWidget
                      locationName="Kurunegala"
                      latitude={KURUNEGALA_CENTER.lat}
                      longitude={KURUNEGALA_CENTER.lng}
                    />
                  </div>
                </div>
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
                    Essential information to make the most of your Kurunegala adventure
                  </p>
                </div>
                <div className="grid md:grid-cols-2 gap-6">
                  {travelTips.map((tip, index) => {
                    const IconComponent = getIconComponent(tip.icon);
                    return (
                      <Card key={index} className="border-0 shadow-lg hover:shadow-xl transition-all duration-300">
                        <CardContent className="p-6">
                          <div className="flex items-start gap-4">
                            <div className="p-3 bg-stone-100 rounded-xl shrink-0">
                              <IconComponent className="w-6 h-6 text-stone-700" />
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
          </AnimatePresence>
        </div>

        {/* CTA Section */}
        <section className="bg-gradient-to-r from-stone-700 via-stone-600 to-stone-700 text-white py-16">
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
                className="bg-white text-stone-700 hover:bg-gray-100 px-8 py-6 text-lg shadow-xl"
                onClick={() => handleBooking('Kurunegala Complete Tour')}
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
        href="https://wa.me/94777721999?text=Hi! I'm interested in booking a Kurunegala tour."
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

export default Kurunegala;
