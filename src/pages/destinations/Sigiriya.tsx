import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Building,
  ShoppingBag,
  Coffee,
  MapPin,
  Calendar,
  Clock,
  Star,
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
  Phone,
  Globe,
  Mountain,
  Waves,
  TreePine,
  Bike,
  Car,
  Plane,
  Anchor,
  Map,
  Compass,
  Lightbulb,
  Shield,
  CreditCard,
  MessageCircle,
  Crown,
  Palette,
  Footprints
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import EnhancedBookingModal from '@/components/EnhancedBookingModal';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';

interface HeroSlide {
  id?: string;
  image: string;
  title: string;
  subtitle: string;
}

interface Attraction {
  id?: string;
  name: string;
  description: string;
  image: string;
  category: string;
  rating: number;
  duration: string;
  price: string;
  featured?: boolean;
}

interface Activity {
  id?: string;
  name: string;
  description: string;
  icon: string;
  price: string;
  duration: string;
  popular?: boolean;
}

interface Restaurant {
  id?: string;
  name: string;
  description: string;
  image: string;
  cuisine: string;
  priceRange: string;
  rating: number;
  address: string;
  phone?: string;
  website?: string;
  featured?: boolean;
}

interface HotelItem {
  id?: string;
  name: string;
  description: string;
  image: string;
  starRating: number;
  priceRange: string;
  amenities: string[];
  address: string;
  phone?: string;
  website?: string;
  featured?: boolean;
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
  temperature: string;
  humidity: string;
  rainfall: string;
  season: string;
}

interface TravelTip {
  id?: string;
  title: string;
  content: string;
  icon?: string;
  category: string;
}

interface CTASection {
  title: string;
  subtitle: string;
  buttonText: string;
}

interface SEOInfo {
  title: string;
  description: string;
  keywords: string[];
}

// Icon mapping
const iconMap: { [key: string]: any } = {
  'Navigation': Navigation,
  'Utensils': Utensils,
  'ShoppingBag': ShoppingBag,
  'Sun': Sun,
  'Building': Building,
  'Camera': Camera,
  'Coffee': Coffee,
  'Hotel': Hotel,
  'Heart': Heart,
  'Star': Star,
  'Mountain': Mountain,
  'Waves': Waves,
  'TreePine': TreePine,
  'Bike': Bike,
  'Car': Car,
  'Plane': Plane,
  'Anchor': Anchor,
  'Map': Map,
  'Compass': Compass,
  'Crown': Crown,
  'Palette': Palette,
  'Footprints': Footprints
};

// Tip category icons
const tipCategoryIcons: { [key: string]: any } = {
  'Transportation': Car,
  'Safety': Shield,
  'Culture': Heart,
  'Money': CreditCard,
  'Health': Heart,
  'Communication': MessageCircle,
  'Food': Utensils,
  'Shopping': ShoppingBag
};

// Default content for Sigiriya
const DEFAULT_HERO_SLIDES: HeroSlide[] = [
  {
    image: "https://images.unsplash.com/photo-1588598198321-f3d0829d0c8b?auto=format&fit=crop&q=80",
    title: "Welcome to Sigiriya",
    subtitle: "The Eighth Wonder of the World"
  },
  {
    image: "https://images.unsplash.com/photo-1586183189334-3d0e7f3c0c11?auto=format&fit=crop&q=80",
    title: "Ancient Rock Fortress",
    subtitle: "UNESCO World Heritage Site"
  },
  {
    image: "https://images.unsplash.com/photo-1546587348-d12660c30c50?auto=format&fit=crop&q=80",
    title: "Lion Rock",
    subtitle: "5th Century Royal Palace in the Sky"
  }
];

const DEFAULT_ATTRACTIONS: Attraction[] = [
  {
    name: "Sigiriya Rock Fortress",
    description: "The iconic 200-meter high rock fortress, featuring the ruins of King Kasyapa's 5th-century palace complex with stunning views and ancient engineering marvels",
    image: "https://images.unsplash.com/photo-1588598198321-f3d0829d0c8b?auto=format&fit=crop&q=80",
    category: "Historical Sites",
    rating: 4.9,
    duration: "3-4 hours",
    price: "$30"
  },
  {
    name: "Sigiriya Frescoes",
    description: "Ancient cave paintings of celestial maidens (Apsaras) dating back 1,500 years, showcasing remarkable artistic achievement of the era",
    image: "https://images.unsplash.com/photo-1546587348-d12660c30c50?auto=format&fit=crop&q=80",
    category: "Cultural",
    rating: 4.8,
    duration: "30 mins",
    price: "Included"
  },
  {
    name: "Mirror Wall",
    description: "Ancient wall covered with verses written by visitors over centuries, featuring the oldest graffiti in the world dating from the 8th century",
    image: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?auto=format&fit=crop&q=80",
    category: "Historical Sites",
    rating: 4.5,
    duration: "20 mins",
    price: "Included"
  },
  {
    name: "Lion's Paw Entrance",
    description: "The massive lion's paws carved from rock at the northern entrance, remnants of a colossal lion statue that once guarded the fortress",
    image: "https://images.unsplash.com/photo-1590123715937-e3ae9d56c618?auto=format&fit=crop&q=80",
    category: "Monuments",
    rating: 4.7,
    duration: "15 mins",
    price: "Included"
  },
  {
    name: "Water Gardens",
    description: "Ancient symmetrical water gardens at the base of the rock, featuring sophisticated hydraulic systems and beautiful landscaping",
    image: "https://images.unsplash.com/photo-1609921141835-ed42426faa5f?auto=format&fit=crop&q=80",
    category: "Parks & Nature",
    rating: 4.6,
    duration: "45 mins",
    price: "Included"
  },
  {
    name: "Pidurangala Rock",
    description: "Adjacent rock formation offering spectacular views of Sigiriya, perfect for sunrise photography and a less crowded climbing experience",
    image: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&q=80",
    category: "Adventure",
    rating: 4.7,
    duration: "2 hours",
    price: "$5"
  }
];

const DEFAULT_ACTIVITIES: Activity[] = [
  {
    name: "Sigiriya Climb",
    description: "Guided climb to the summit with expert commentary on history",
    icon: "Mountain",
    price: "From $45",
    duration: "4 hours",
    popular: true
  },
  {
    name: "Sunrise at Pidurangala",
    description: "Early morning hike for stunning sunrise views of Sigiriya",
    icon: "Sun",
    price: "From $25",
    duration: "3 hours"
  },
  {
    name: "Village Safari",
    description: "Experience rural Sri Lankan life with bullock cart rides and farming",
    icon: "TreePine",
    price: "From $30",
    duration: "3 hours"
  },
  {
    name: "Elephant Safari",
    description: "Jeep safari to spot elephants at nearby Minneriya or Kaudulla",
    icon: "Compass",
    price: "From $50",
    duration: "4 hours"
  },
  {
    name: "Hot Air Balloon",
    description: "Breathtaking aerial views of Sigiriya and the cultural triangle",
    icon: "Plane",
    price: "From $200",
    duration: "1 hour"
  },
  {
    name: "Photography Tour",
    description: "Professional photography tour capturing the best angles of Sigiriya",
    icon: "Camera",
    price: "From $40",
    duration: "5 hours"
  }
];

const DEFAULT_DESTINATION_INFO: DestinationInfo = {
  population: "10,000",
  area: "11 km²",
  elevation: "349 m",
  bestTime: "January to April",
  language: "Sinhala, English",
  currency: "Sri Lankan Rupee (LKR)"
};

const DEFAULT_WEATHER_INFO: WeatherInfo = {
  temperature: "24-32°C",
  humidity: "70-80%",
  rainfall: "Moderate",
  season: "Tropical Dry"
};

const DEFAULT_CTA: CTASection = {
  title: "Ready to Climb Sigiriya?",
  subtitle: "Book your adventure to the ancient rock fortress with our expert guides",
  buttonText: "Book Now"
};

const DEFAULT_SEO: SEOInfo = {
  title: "Sigiriya - Ancient Rock Fortress | UNESCO World Heritage Site",
  description: "Visit Sigiriya, the 8th Wonder of the World. Explore the 5th-century rock fortress, ancient frescoes, and water gardens. Book guided tours and experiences.",
  keywords: ["Sigiriya", "Lion Rock", "Sri Lanka", "UNESCO", "rock fortress", "ancient", "frescoes", "travel", "tours"]
};

const Sigiriya = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [selectedTab, setSelectedTab] = useState('attractions');
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [selectedAttraction, setSelectedAttraction] = useState<string>('');
  const [loading, setLoading] = useState(true);

  // Content state
  const [heroSlides, setHeroSlides] = useState<HeroSlide[]>(DEFAULT_HERO_SLIDES);
  const [attractions, setAttractions] = useState<Attraction[]>(DEFAULT_ATTRACTIONS);
  const [activities, setActivities] = useState<Activity[]>(DEFAULT_ACTIVITIES);
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [hotels, setHotels] = useState<HotelItem[]>([]);
  const [destinationInfo, setDestinationInfo] = useState<DestinationInfo>(DEFAULT_DESTINATION_INFO);
  const [weatherInfo, setWeatherInfo] = useState<WeatherInfo>(DEFAULT_WEATHER_INFO);
  const [travelTips, setTravelTips] = useState<TravelTip[]>([]);
  const [ctaSection, setCtaSection] = useState<CTASection>(DEFAULT_CTA);
  const [seoInfo, setSeoInfo] = useState<SEOInfo>(DEFAULT_SEO);
  const [tagline, setTagline] = useState("The Eighth Wonder of the World");

  // Load content from Firebase
  useEffect(() => {
    const loadContent = async () => {
      try {
        setLoading(true);
        const docRef = doc(db, 'destinations', 'sigiriya');
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const data = docSnap.data();

          if (data.heroSlides && data.heroSlides.length > 0) {
            setHeroSlides(data.heroSlides);
          }
          if (data.attractions && data.attractions.length > 0) {
            setAttractions(data.attractions);
          }
          if (data.activities && data.activities.length > 0) {
            setActivities(data.activities);
          }
          if (data.restaurants && data.restaurants.length > 0) {
            setRestaurants(data.restaurants);
          }
          if (data.hotels && data.hotels.length > 0) {
            setHotels(data.hotels);
          }
          if (data.destinationInfo) {
            setDestinationInfo(data.destinationInfo);
          }
          if (data.weatherInfo) {
            setWeatherInfo(data.weatherInfo);
          }
          if (data.travelTips && data.travelTips.length > 0) {
            setTravelTips(data.travelTips);
          }
          if (data.ctaSection) {
            setCtaSection(data.ctaSection);
          }
          if (data.seo) {
            setSeoInfo(data.seo);
          }
          if (data.tagline) {
            setTagline(data.tagline);
          }
        }
      } catch (error) {
        console.error('Error loading content:', error);
      } finally {
        setLoading(false);
      }
    };

    loadContent();
  }, []);

  // Get icon component from string
  const getIconComponent = (iconName: string) => {
    return iconMap[iconName] || Building;
  };

  // Auto-rotate hero slides
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [heroSlides.length]);

  const handleBookNow = (attractionName: string = '') => {
    setSelectedAttraction(attractionName);
    setShowBookingModal(true);
  };

  // Get available tabs based on content
  const getAvailableTabs = () => {
    const tabs = ['attractions', 'activities'];
    if (restaurants.length > 0) tabs.push('restaurants');
    if (hotels.length > 0) tabs.push('hotels');
    tabs.push('weather');
    if (travelTips.length > 0) tabs.push('tips');
    return tabs;
  };

  const availableTabs = getAvailableTabs();

  return (
    <>
      <Helmet>
        <title>{seoInfo.title}</title>
        <meta name="description" content={seoInfo.description} />
        <meta name="keywords" content={seoInfo.keywords.join(', ')} />
        <meta property="og:title" content={seoInfo.title} />
        <meta property="og:description" content={seoInfo.description} />
        <link rel="canonical" href="https://rechargetravels.com/destinations/sigiriya" />
      </Helmet>

      <Header />

      <div className="min-h-screen bg-background">
        {/* Hero Section */}
        <section className="relative h-[80vh] overflow-hidden">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentSlide}
              initial={{ opacity: 0, scale: 1.1 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1.5 }}
              className="absolute inset-0"
            >
              <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/20 to-black/60 z-10" />
              <img
                src={heroSlides[currentSlide]?.image}
                alt={heroSlides[currentSlide]?.title}
                className="w-full h-full object-cover"
              />
            </motion.div>
          </AnimatePresence>

          <div className="relative z-20 h-full flex items-center justify-center text-center text-white">
            <div className="max-w-4xl mx-auto px-4">
              <motion.h1
                key={`title-${currentSlide}`}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                className="text-5xl md:text-7xl font-bold mb-4"
              >
                {heroSlides[currentSlide]?.title}
              </motion.h1>
              <motion.p
                key={`subtitle-${currentSlide}`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="text-xl md:text-2xl mb-8"
              >
                {heroSlides[currentSlide]?.subtitle}
              </motion.p>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.4 }}
                className="flex gap-4 justify-center"
              >
                <Button size="lg" onClick={() => handleBookNow()} className="bg-amber-600 hover:bg-amber-700">
                  Book Your Adventure
                </Button>
                <Button size="lg" variant="outline" className="bg-white/10 backdrop-blur-sm border-white text-white hover:bg-white/20">
                  <Info className="w-4 h-4 mr-2" />
                  Travel Guide
                </Button>
              </motion.div>
            </div>
          </div>

          {/* Slide Indicators */}
          <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex gap-2 z-30">
            {heroSlides.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentSlide(index)}
                className={`w-2 h-2 rounded-full transition-all ${
                  currentSlide === index ? 'w-8 bg-white' : 'bg-white/50'
                }`}
              />
            ))}
          </div>
        </section>

        {/* Quick Info Section */}
        <section className="bg-gradient-to-r from-amber-50 to-orange-50 py-12">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
              <div className="text-center p-4 bg-white rounded-xl shadow-sm">
                <Users className="w-8 h-8 mx-auto mb-2 text-amber-600" />
                <h3 className="font-semibold text-gray-800">Population</h3>
                <p className="text-gray-600 text-sm">{destinationInfo.population}</p>
              </div>
              <div className="text-center p-4 bg-white rounded-xl shadow-sm">
                <MapPin className="w-8 h-8 mx-auto mb-2 text-amber-600" />
                <h3 className="font-semibold text-gray-800">Area</h3>
                <p className="text-gray-600 text-sm">{destinationInfo.area}</p>
              </div>
              <div className="text-center p-4 bg-white rounded-xl shadow-sm">
                <Mountain className="w-8 h-8 mx-auto mb-2 text-amber-600" />
                <h3 className="font-semibold text-gray-800">Elevation</h3>
                <p className="text-gray-600 text-sm">{destinationInfo.elevation}</p>
              </div>
              <div className="text-center p-4 bg-white rounded-xl shadow-sm">
                <Sun className="w-8 h-8 mx-auto mb-2 text-orange-500" />
                <h3 className="font-semibold text-gray-800">Best Time</h3>
                <p className="text-gray-600 text-sm">{destinationInfo.bestTime}</p>
              </div>
              <div className="text-center p-4 bg-white rounded-xl shadow-sm">
                <MessageCircle className="w-8 h-8 mx-auto mb-2 text-green-600" />
                <h3 className="font-semibold text-gray-800">Language</h3>
                <p className="text-gray-600 text-sm">{destinationInfo.language}</p>
              </div>
              <div className="text-center p-4 bg-white rounded-xl shadow-sm">
                <DollarSign className="w-8 h-8 mx-auto mb-2 text-emerald-600" />
                <h3 className="font-semibold text-gray-800">Currency</h3>
                <p className="text-gray-600 text-sm">{destinationInfo.currency}</p>
              </div>
            </div>
          </div>
        </section>

        {/* Tab Navigation */}
        <section className="sticky top-0 z-40 bg-white shadow-md">
          <div className="container mx-auto px-4">
            <div className="flex space-x-8 overflow-x-auto">
              {availableTabs.map((tab) => (
                <button
                  key={tab}
                  onClick={() => setSelectedTab(tab)}
                  className={`py-4 px-2 capitalize whitespace-nowrap border-b-2 transition-colors font-medium ${
                    selectedTab === tab
                      ? 'border-amber-600 text-amber-600'
                      : 'border-transparent text-gray-600 hover:text-gray-900'
                  }`}
                >
                  {tab === 'tips' ? 'Travel Tips' : tab}
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* Content Sections */}
        <section className="container mx-auto px-4 py-12">
          {/* Attractions Tab */}
          {selectedTab === 'attractions' && (
            <div>
              <h2 className="text-3xl font-bold mb-8">Top Attractions in Sigiriya</h2>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {attractions.map((attraction, index) => (
                  <Card key={attraction.id || index} className="overflow-hidden hover:shadow-xl transition-shadow">
                    <div className="aspect-w-16 aspect-h-9 relative h-48">
                      <img
                        src={attraction.image}
                        alt={attraction.name}
                        className="w-full h-full object-cover"
                      />
                      <Badge className="absolute top-4 right-4 bg-white/90 text-gray-800">
                        {attraction.category}
                      </Badge>
                      {attraction.featured && (
                        <Badge className="absolute top-4 left-4 bg-yellow-500 text-white">
                          Featured
                        </Badge>
                      )}
                    </div>
                    <CardContent className="p-6">
                      <h3 className="text-xl font-bold mb-2">{attraction.name}</h3>
                      <p className="text-gray-600 mb-4 line-clamp-2">{attraction.description}</p>

                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-4 text-sm text-gray-600">
                          <span className="flex items-center gap-1">
                            <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                            {attraction.rating}
                          </span>
                          <span className="flex items-center gap-1">
                            <Clock className="w-4 h-4" />
                            {attraction.duration}
                          </span>
                          <span className="flex items-center gap-1">
                            <DollarSign className="w-4 h-4" />
                            {attraction.price}
                          </span>
                        </div>
                      </div>

                      <Button
                        className="w-full bg-amber-600 hover:bg-amber-700"
                        onClick={() => handleBookNow(attraction.name)}
                      >
                        Book Now
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {/* Activities Tab */}
          {selectedTab === 'activities' && (
            <div>
              <h2 className="text-3xl font-bold mb-8">Things to Do in Sigiriya</h2>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {activities.map((activity, index) => {
                  const IconComponent = getIconComponent(activity.icon);
                  return (
                    <Card key={activity.id || index} className={`hover:shadow-lg transition-shadow ${activity.popular ? 'border-amber-500 border-2' : ''}`}>
                      {activity.popular && (
                        <div className="bg-amber-500 text-white text-center py-2 text-sm font-semibold">
                          MOST POPULAR
                        </div>
                      )}
                      <CardHeader>
                        <div className="flex items-center justify-between">
                          <IconComponent className="w-12 h-12 text-amber-600" />
                          <Badge variant="secondary">{activity.duration}</Badge>
                        </div>
                        <CardTitle className="mt-4">{activity.name}</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-gray-600 mb-4">{activity.description}</p>
                        <div className="flex items-center justify-between">
                          <span className="text-2xl font-bold text-amber-600">{activity.price}</span>
                          <Button onClick={() => handleBookNow(activity.name)} className="bg-amber-600 hover:bg-amber-700">
                            Book Now
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </div>
          )}

          {/* Restaurants Tab */}
          {selectedTab === 'restaurants' && (
            <div>
              <h2 className="text-3xl font-bold mb-8">Where to Eat in Sigiriya</h2>
              {restaurants.length > 0 ? (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {restaurants.map((restaurant, index) => (
                    <Card key={restaurant.id || index} className="overflow-hidden hover:shadow-xl transition-shadow">
                      <div className="relative h-48">
                        <img
                          src={restaurant.image || 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&q=80'}
                          alt={restaurant.name}
                          className="w-full h-full object-cover"
                        />
                        <Badge className="absolute top-4 right-4 bg-white/90 text-gray-800">
                          {restaurant.cuisine}
                        </Badge>
                      </div>
                      <CardContent className="p-6">
                        <h3 className="text-xl font-bold mb-2">{restaurant.name}</h3>
                        <p className="text-gray-600 mb-4 line-clamp-2">{restaurant.description}</p>
                        <div className="flex items-center gap-4 text-sm text-gray-600 mb-3">
                          <span className="flex items-center gap-1">
                            <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                            {restaurant.rating}
                          </span>
                          <span className="font-medium text-green-600">{restaurant.priceRange}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-500">
                          <MapPin className="w-4 h-4" />
                          <span className="truncate">{restaurant.address}</span>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <Utensils className="w-16 h-16 mx-auto mb-4 text-gray-400" />
                  <h3 className="text-xl font-semibold mb-2">Restaurants Coming Soon</h3>
                  <p className="text-gray-600">Discover the best dining experiences near Sigiriya</p>
                </div>
              )}
            </div>
          )}

          {/* Hotels Tab */}
          {selectedTab === 'hotels' && (
            <div>
              <h2 className="text-3xl font-bold mb-8">Where to Stay in Sigiriya</h2>
              {hotels.length > 0 ? (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {hotels.map((hotel, index) => (
                    <Card key={hotel.id || index} className="overflow-hidden hover:shadow-xl transition-shadow">
                      <div className="relative h-48">
                        <img
                          src={hotel.image || 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&q=80'}
                          alt={hotel.name}
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute top-4 right-4 flex gap-1">
                          {[...Array(hotel.starRating)].map((_, i) => (
                            <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                          ))}
                        </div>
                      </div>
                      <CardContent className="p-6">
                        <h3 className="text-xl font-bold mb-2">{hotel.name}</h3>
                        <p className="text-gray-600 mb-4 line-clamp-2">{hotel.description}</p>
                        <div className="mb-4">
                          <span className="text-lg font-bold text-amber-600">{hotel.priceRange}</span>
                          <span className="text-gray-500 text-sm"> / night</span>
                        </div>
                        <Button className="w-full bg-amber-600 hover:bg-amber-700" onClick={() => handleBookNow(hotel.name)}>
                          Check Availability
                        </Button>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <Hotel className="w-16 h-16 mx-auto mb-4 text-gray-400" />
                  <h3 className="text-xl font-semibold mb-2">Hotels Coming Soon</h3>
                  <p className="text-gray-600">Discover the best hotels near Sigiriya</p>
                </div>
              )}
            </div>
          )}

          {/* Weather Tab */}
          {selectedTab === 'weather' && (
            <div>
              <h2 className="text-3xl font-bold mb-8">Weather in Sigiriya</h2>
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                <Card className="bg-gradient-to-br from-orange-50 to-yellow-50">
                  <CardHeader>
                    <Sun className="w-10 h-10 text-orange-500 mb-2" />
                    <CardTitle>Temperature</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-3xl font-bold text-orange-600">{weatherInfo.temperature}</p>
                    <p className="text-gray-600 mt-2">Warm tropical climate year-round</p>
                  </CardContent>
                </Card>

                <Card className="bg-gradient-to-br from-blue-50 to-cyan-50">
                  <CardHeader>
                    <Cloud className="w-10 h-10 text-blue-500 mb-2" />
                    <CardTitle>Humidity</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-3xl font-bold text-blue-600">{weatherInfo.humidity}</p>
                    <p className="text-gray-600 mt-2">Comfortable for climbing</p>
                  </CardContent>
                </Card>

                <Card className="bg-gradient-to-br from-gray-50 to-slate-100">
                  <CardHeader>
                    <Cloud className="w-10 h-10 text-gray-500 mb-2" />
                    <CardTitle>Rainfall</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-3xl font-bold text-gray-600">{weatherInfo.rainfall}</p>
                    <p className="text-gray-600 mt-2">Oct-Nov monsoon season</p>
                  </CardContent>
                </Card>

                <Card className="bg-gradient-to-br from-green-50 to-emerald-50">
                  <CardHeader>
                    <Calendar className="w-10 h-10 text-green-500 mb-2" />
                    <CardTitle>Best Time</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-3xl font-bold text-green-600">{destinationInfo.bestTime}</p>
                    <p className="text-gray-600 mt-2">Dry season recommended</p>
                  </CardContent>
                </Card>
              </div>
            </div>
          )}

          {/* Travel Tips Tab */}
          {selectedTab === 'tips' && travelTips.length > 0 && (
            <div>
              <h2 className="text-3xl font-bold mb-8">Travel Tips for Sigiriya</h2>
              <div className="grid md:grid-cols-2 gap-6">
                {travelTips.map((tip, index) => {
                  const TipIcon = tipCategoryIcons[tip.category] || Lightbulb;
                  return (
                    <Card key={tip.id || index} className="hover:shadow-lg transition-shadow">
                      <CardHeader>
                        <div className="flex items-start gap-4">
                          <div className="p-3 bg-amber-100 rounded-lg">
                            <TipIcon className="w-6 h-6 text-amber-600" />
                          </div>
                          <div>
                            <Badge variant="secondary" className="mb-2">{tip.category}</Badge>
                            <CardTitle className="text-lg">{tip.title}</CardTitle>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <p className="text-gray-600">{tip.content}</p>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </div>
          )}
        </section>

        {/* CTA Section */}
        <section className="bg-gradient-to-r from-amber-600 to-orange-600 py-16">
          <div className="container mx-auto px-4 text-center text-white">
            <h2 className="text-4xl font-bold mb-4">{ctaSection.title}</h2>
            <p className="text-xl mb-8 max-w-2xl mx-auto opacity-90">
              {ctaSection.subtitle}
            </p>
            <div className="flex gap-4 justify-center">
              <Button size="lg" variant="secondary" onClick={() => handleBookNow()} className="bg-white text-amber-600 hover:bg-gray-100">
                {ctaSection.buttonText}
              </Button>
              <Button size="lg" variant="outline" className="bg-white/10 backdrop-blur-sm text-white border-white hover:bg-white/20">
                Contact Us
              </Button>
            </div>
          </div>
        </section>
      </div>

      {/* Booking Modal */}
      <EnhancedBookingModal
        isOpen={showBookingModal}
        onClose={() => setShowBookingModal(false)}
        preSelectedService={selectedAttraction}
      />

      <Footer />
    </>
  );
};

export default Sigiriya;
