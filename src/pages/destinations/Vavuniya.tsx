import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Store, 
  Users, 
  TreePine, 
  MapPin,
  Calendar,
  Clock,
  Star,
  ChevronDown,
  Wifi,
  Train,
  Utensils,
  Camera,
  Hotel,
  Heart,
  DollarSign,
  Info,
  Sun,
  Cloud,
  Navigation,
  Building,
  ShoppingBag,
  Flower,
  Mountain,
  Sparkles,
  Bus
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Link, useNavigate } from 'react-router-dom';
import DestinationMap from '@/components/destinations/DestinationMap';
import WeatherWidget from '@/components/destinations/WeatherWidget';
import { getDestinationBySlug } from '@/services/destinationContentService';

// Vavuniya coordinates
const VAVUNIYA_CENTER = { lat: 8.7514, lng: 80.4971 };

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
}

interface Activity {
  name: string;
  description: string;
  icon: any;
  price: string;
  duration: string;
  popular?: boolean;
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

interface HotelItem {
  name: string;
  description: string;
  image: string;
  starRating: number;
  priceRange: string;
  amenities: string[];
  address: string;
}

interface RestaurantItem {
  name: string;
  description: string;
  image: string;
  cuisine: string;
  priceRange: string;
  rating: number;
  address: string;
}

interface TravelTip {
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

const Vavuniya = () => {
  const navigate = useNavigate();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [selectedTab, setSelectedTab] = useState('attractions');

  const [heroSlides, setHeroSlides] = useState<HeroSlide[]>([
    {
      image: "https://images.unsplash.com/photo-1588598198321-39f8c2be97ba?auto=format&fit=crop&q=80",
      title: "Discover Vavuniya",
      subtitle: "Gateway to the North"
    },
    {
      image: "https://images.unsplash.com/photo-1552465011-b4e21bf6e79a?auto=format&fit=crop&q=80",
      title: "Kandasamy Temple",
      subtitle: "Sacred Hindu Shrine"
    },
    {
      image: "https://images.unsplash.com/photo-1586613835341-78c143aef52c?auto=format&fit=crop&q=80",
      title: "Archaeological Sites",
      subtitle: "Ancient Tamil Heritage"
    },
    {
      image: "https://images.unsplash.com/photo-1571536802807-30451e3f3d43?auto=format&fit=crop&q=80",
      title: "Vavuniya Tank",
      subtitle: "Historic Reservoir"
    },
    {
      image: "https://images.unsplash.com/photo-1578128178243-721cd32ce739?auto=format&fit=crop&q=80",
      title: "Cultural Center",
      subtitle: "Hub of Northern Culture"
    }
  ]);

  const [attractions, setAttractions] = useState<Attraction[]>([
    {
      name: "Kandaswamy Kovil",
      description: "Ancient Hindu temple dedicated to Lord Murugan, featuring intricate Dravidian architecture and vibrant religious festivals",
      image: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&q=80",
      category: "Religious Sites",
      rating: 4.8,
      duration: "1-2 hours",
      price: "Free"
    },
    {
      name: "Vavuniya Archaeological Museum",
      description: "Showcases ancient artifacts from the Northern Province, including pottery, coins, and sculptures dating back to early civilizations",
      image: "https://images.unsplash.com/photo-1518998053901-5348d3961a04?auto=format&fit=crop&q=80",
      category: "Museums",
      rating: 4.5,
      duration: "1-2 hours",
      price: "$3"
    },
    {
      name: "Main Street Market",
      description: "Bustling local market offering traditional Tamil handicrafts, textiles, spices, and authentic street food experiences",
      image: "https://images.unsplash.com/photo-1555529669-e69e7aa0ba9a?auto=format&fit=crop&q=80",
      category: "Markets & Shopping",
      rating: 4.6,
      duration: "2-3 hours",
      price: "Free"
    },
    {
      name: "Madukanda Viharaya",
      description: "Ancient Buddhist temple with historical significance, featuring ancient ruins and a peaceful meditation environment",
      image: "https://images.unsplash.com/photo-1548013146-72479768bada?auto=format&fit=crop&q=80",
      category: "Religious Sites",
      rating: 4.4,
      duration: "1 hour",
      price: "Free"
    },
    {
      name: "Giant's Tank (Yoda Wewa)",
      description: "Ancient irrigation reservoir built by King Dhatusena, offering scenic views and insights into ancient engineering",
      image: "https://images.unsplash.com/photo-1596402184320-417e7178b2cd?auto=format&fit=crop&q=80",
      category: "Historical Sites",
      rating: 4.7,
      duration: "2 hours",
      price: "Free"
    },
    {
      name: "Vavuniya Cultural Center",
      description: "Promotes traditional Tamil arts, dance, and music with regular performances and cultural exhibitions",
      image: "https://images.unsplash.com/photo-1528731708534-816fe59f90cb?auto=format&fit=crop&q=80",
      category: "Cultural Sites",
      rating: 4.5,
      duration: "2 hours",
      price: "$5"
    }
  ]);

  const [activities, setActivities] = useState<Activity[]>([
    {
      name: "Tamil Cultural Experience",
      description: "Immerse in traditional music, dance, and cuisine",
      icon: Users,
      price: "From $40",
      duration: "Half Day",
      popular: true
    },
    {
      name: "Market & Food Tour",
      description: "Explore local markets and taste authentic Tamil cuisine",
      icon: Store,
      price: "From $25",
      duration: "3 hours"
    },
    {
      name: "Temple Heritage Walk",
      description: "Visit ancient Hindu and Buddhist temples with guides",
      icon: Building,
      price: "From $30",
      duration: "4 hours"
    },
    {
      name: "Rural Village Experience",
      description: "Visit traditional villages and interact with locals",
      icon: TreePine,
      price: "From $35",
      duration: "Half Day"
    },
    {
      name: "Photography Tour",
      description: "Capture northern life, temples, and landscapes",
      icon: Camera,
      price: "From $45",
      duration: "Full Day"
    },
    {
      name: "Northern Transit Tour",
      description: "Use Vavuniya as base to explore northern regions",
      icon: Bus,
      price: "From $60",
      duration: "Full Day"
    }
  ]);

  const [destinationInfo, setDestinationInfo] = useState<DestinationInfo>({
    population: "100,000",
    area: "1,967 km²",
    elevation: "98 m",
    bestTime: "May to September",
    language: "Tamil, Sinhala",
    currency: "Sri Lankan Rupee (LKR)"
  });

  const [weatherInfo, setWeatherInfo] = useState<WeatherInfo>({
    temperature: "24-33°C",
    humidity: "65-80%",
    rainfall: "Moderate",
    season: "Tropical Dry Zone"
  });

  const [hotels, setHotels] = useState<HotelItem[]>([]);
  const [restaurants, setRestaurants] = useState<RestaurantItem[]>([]);
  const [travelTips, setTravelTips] = useState<TravelTip[]>([]);
  const [ctaSection, setCtaSection] = useState<CTASection>({
    title: "Ready to Experience Northern Sri Lanka?",
    subtitle:
      "Discover the authentic Tamil culture, ancient heritage, and warm hospitality of Vavuniya",
    buttonText: "Plan Your Visit",
  });

  // Load content from Firestore destination document
  useEffect(() => {
    const loadContent = async () => {
      try {
        const data = await getDestinationBySlug('vavuniya');

        if (data) {
          const anyData: any = data;

          if (Array.isArray(anyData.heroSlides) && anyData.heroSlides.length) {
            setHeroSlides(anyData.heroSlides as HeroSlide[]);
          }

          if (Array.isArray(anyData.attractions) && anyData.attractions.length) {
            setAttractions(anyData.attractions as Attraction[]);
          }

          if (Array.isArray(anyData.activities) && anyData.activities.length) {
            setActivities(
              anyData.activities.map((activity: any) => ({
                ...activity,
                icon: getIconComponent(activity.icon),
              }))
            );
          }

          if (anyData.destinationInfo) {
            setDestinationInfo(anyData.destinationInfo as DestinationInfo);
          }

          if (anyData.weatherInfo) {
            setWeatherInfo({
              temperature: anyData.weatherInfo.temperature || "24-33°C",
              humidity: anyData.weatherInfo.humidity || "65-80%",
              rainfall: anyData.weatherInfo.rainfall || "Moderate",
              season: anyData.weatherInfo.season || "Tropical Dry Zone",
            });
          }

          if (Array.isArray(anyData.hotels) && anyData.hotels.length) {
            setHotels(
              anyData.hotels.map((hotel: any) => ({
                name: hotel.name,
                description: hotel.description || '',
                image: hotel.image || '',
                starRating: hotel.starRating || 0,
                priceRange: hotel.priceRange || hotel.price || '',
                amenities: hotel.amenities || [],
                address: hotel.address || '',
              }))
            );
          }

          if (Array.isArray(anyData.restaurants) && anyData.restaurants.length) {
            setRestaurants(
              anyData.restaurants.map((rest: any) => ({
                name: rest.name,
                description: rest.description || '',
                image: rest.image || '',
                cuisine: rest.cuisine || '',
                priceRange: rest.priceRange || '',
                rating: rest.rating || 0,
                address: rest.address || '',
              }))
            );
          }

          if (Array.isArray(anyData.travelTips) && anyData.travelTips.length) {
            setTravelTips(anyData.travelTips as TravelTip[]);
          }

          if (anyData.ctaSection) {
            setCtaSection({
              title: anyData.ctaSection.title || "Ready to Experience Northern Sri Lanka?",
              subtitle:
                anyData.ctaSection.subtitle ||
                "Discover the authentic Tamil culture, ancient heritage, and warm hospitality of Vavuniya",
              buttonText: anyData.ctaSection.buttonText || "Plan Your Visit",
            });
          }
        }
      } catch (error) {
        console.error('Error loading destination content for Vavuniya:', error);
      }
    };

    loadContent();
  }, []);

  // Helper function to get icon component from string
  const getIconComponent = (iconName: string) => {
    const iconMap: { [key: string]: any } = {
      'Users': Users,
      'Store': Store,
      'Building': Building,
      'TreePine': TreePine,
      'Camera': Camera,
      'Bus': Bus,
      'Navigation': Navigation
    };
    return iconMap[iconName] || Users;
  };

  // Auto-rotate hero slides
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [heroSlides.length]);

  const handleBooking = (service: string, tourData?: { id: string; name: string; description: string; duration: string; price: number; features: string[]; image?: string }) => {
    const params = new URLSearchParams({
      title: tourData?.name || service,
      id: tourData?.id || service.toLowerCase().replace(/\s+/g, '-'),
      duration: tourData?.duration || 'Full Day',
      price: String(tourData?.price || 50),
      image: tourData?.image || 'https://images.unsplash.com/photo-1590073242678-70ee3fc28e8e?w=800',
      subtitle: `Vavuniya - ${tourData?.name || service}`
    });
    navigate(`/book-tour?${params.toString()}`);
  };

  return (
    <>
      <Helmet>
        <title>Vavuniya - Northern Gateway & Tamil Cultural Hub | Sri Lanka Travel Guide</title>
        <meta name="description" content="Discover Vavuniya's rich Tamil heritage, ancient temples, vibrant markets, and authentic northern Sri Lankan culture. Your gateway to exploring the north." />
      </Helmet>
      
      <Header />
      
      <div className="min-h-screen bg-background">
        {/* Hero Section */}
        <section className="relative aspect-video max-h-[80vh] overflow-hidden">
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
                src={heroSlides[currentSlide].image}
                alt={heroSlides[currentSlide].title}
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
                {heroSlides[currentSlide].title}
              </motion.h1>
              <motion.p
                key={`subtitle-${currentSlide}`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="text-xl md:text-2xl mb-8"
              >
                {heroSlides[currentSlide].subtitle}
              </motion.p>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.4 }}
                className="flex gap-4 justify-center"
              >
                <Button size="lg" onClick={() => handleBooking()}>
                  Book Your Experience
                </Button>
                <Button asChild size="lg" variant="outline" className="bg-white/10 backdrop-blur-sm">
                  <Link to="/travel-guide">
                    <Info className="w-4 h-4 mr-2" />
                    Travel Guide
                  </Link>
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
        <section className="bg-gray-50 py-12">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
              <div className="text-center">
                <Users className="w-8 h-8 mx-auto mb-2 text-amber-600" />
                <h3 className="font-semibold">Population</h3>
                <p className="text-gray-600">{destinationInfo.population}</p>
              </div>
              <div className="text-center">
                <MapPin className="w-8 h-8 mx-auto mb-2 text-amber-600" />
                <h3 className="font-semibold">Area</h3>
                <p className="text-gray-600">{destinationInfo.area}</p>
              </div>
              <div className="text-center">
                <Mountain className="w-8 h-8 mx-auto mb-2 text-amber-600" />
                <h3 className="font-semibold">Elevation</h3>
                <p className="text-gray-600">{destinationInfo.elevation}</p>
              </div>
              <div className="text-center">
                <Sun className="w-8 h-8 mx-auto mb-2 text-amber-600" />
                <h3 className="font-semibold">Best Time</h3>
                <p className="text-gray-600">{destinationInfo.bestTime}</p>
              </div>
              <div className="text-center">
                <Info className="w-8 h-8 mx-auto mb-2 text-amber-600" />
                <h3 className="font-semibold">Language</h3>
                <p className="text-gray-600">{destinationInfo.language}</p>
              </div>
              <div className="text-center">
                <DollarSign className="w-8 h-8 mx-auto mb-2 text-amber-600" />
                <h3 className="font-semibold">Currency</h3>
                <p className="text-gray-600">{destinationInfo.currency}</p>
              </div>
            </div>
          </div>
        </section>

        {/* Tab Navigation */}
        <section className="sticky top-0 z-40 bg-white shadow-md">
          <div className="container mx-auto px-4">
            <div className="flex space-x-8 overflow-x-auto">
              {['attractions', 'activities', 'hotels', 'restaurants', 'map', 'weather'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setSelectedTab(tab)}
                  className={`py-4 px-2 capitalize whitespace-nowrap border-b-2 transition-colors ${
                    selectedTab === tab
                      ? 'border-amber-600 text-amber-600'
                      : 'border-transparent text-gray-600 hover:text-gray-900'
                  }`}
                >
                  {tab}
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
              <h2 className="text-3xl font-bold mb-8">Top Attractions in Vavuniya</h2>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {attractions.map((attraction, index) => (
                  <Card key={index} className="overflow-hidden hover:shadow-xl transition-shadow">
                    <div className="aspect-w-16 aspect-h-9 relative h-48">
                      <img 
                        src={attraction.image} 
                        alt={attraction.name}
                        className="w-full h-full object-cover"
                      />
                      <Badge className="absolute top-4 right-4 bg-white/90 text-gray-800">
                        {attraction.category}
                      </Badge>
                    </div>
                    <CardContent className="p-6">
                      <h3 className="text-xl font-bold mb-2">{attraction.name}</h3>
                      <p className="text-gray-600 mb-4">{attraction.description}</p>
                      
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
                        className="w-full"
                        onClick={() => handleBooking(attraction.name)}
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
              <h2 className="text-3xl font-bold mb-8">Things to Do in Vavuniya</h2>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {activities.map((activity, index) => (
                  <Card key={index} className={`hover:shadow-lg transition-shadow ${activity.popular ? 'border-amber-500 border-2' : ''}`}>
                    {activity.popular && (
                      <div className="bg-amber-500 text-white text-center py-2 text-sm font-semibold">
                        MOST POPULAR
                      </div>
                    )}
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <activity.icon className="w-12 h-12 text-amber-600" />
                        <Badge variant="secondary">{activity.duration}</Badge>
                      </div>
                      <CardTitle className="mt-4">{activity.name}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-gray-600 mb-4">{activity.description}</p>
                      <div className="flex items-center justify-between">
                        <span className="text-2xl font-bold text-amber-600">{activity.price}</span>
                        <Button onClick={() => handleBooking(activity.name)}>
                          Book Now
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {/* Hotels Tab */}
          {selectedTab === 'hotels' && (
            <div>
              <h2 className="text-3xl font-bold mb-8">Where to Stay in Vavuniya</h2>
              {hotels.length === 0 ? (
                <div className="text-center py-12">
                  <Hotel className="w-16 h-16 mx-auto mb-4 text-gray-400" />
                  <h3 className="text-xl font-semibold mb-2">Hotels Coming Soon</h3>
                  <p className="text-gray-600">
                    We're working on bringing you the best hotel recommendations in Vavuniya
                  </p>
                </div>
              ) : (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {hotels.map((hotel, index) => (
                    <Card
                      key={index}
                      className="overflow-hidden hover:shadow-xl transition-shadow"
                    >
                      <div className="h-48 relative">
                        {hotel.image && (
                          <img
                            src={hotel.image}
                            alt={hotel.name}
                            className="w-full h-full object-cover"
                          />
                        )}
                        {hotel.starRating > 0 && (
                          <Badge className="absolute top-4 left-4 bg-black/70 text-white">
                            {hotel.starRating}-star
                          </Badge>
                        )}
                      </div>
                      <CardContent className="p-6 space-y-3">
                        <h3 className="text-xl font-bold">{hotel.name}</h3>
                        {hotel.description && (
                          <p className="text-gray-600 text-sm">{hotel.description}</p>
                        )}
                        {hotel.address && (
                          <p className="text-sm text-gray-500">{hotel.address}</p>
                        )}
                        <div className="flex items-center justify-between mt-2">
                          <span className="text-amber-600 font-semibold">
                            {hotel.priceRange}
                          </span>
                        </div>
                        {hotel.amenities.length > 0 && (
                          <div className="mt-2 flex flex-wrap gap-1">
                            {hotel.amenities.map((amenity, i) => (
                              <Badge
                                key={i}
                                variant="outline"
                                className="text-xs text-gray-600 border-gray-200"
                              >
                                {amenity}
                              </Badge>
                            ))}
                          </div>
                        )}
                        <Button
                          className="w-full mt-3"
                          onClick={() => handleBooking(hotel.name)}
                        >
                          Book This Stay
                        </Button>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Restaurants Tab */}
          {selectedTab === 'restaurants' && (
            <div>
              <h2 className="text-3xl font-bold mb-8">Where to Eat in Vavuniya</h2>
              {restaurants.length === 0 ? (
                <div className="text-center py-12">
                  <Utensils className="w-16 h-16 mx-auto mb-4 text-gray-400" />
                  <h3 className="text-xl font-semibold mb-2">Restaurants Coming Soon</h3>
                  <p className="text-gray-600">
                    Discover the best dining experiences in Vavuniya
                  </p>
                </div>
              ) : (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {restaurants.map((restaurant, index) => (
                    <Card
                      key={index}
                      className="overflow-hidden hover:shadow-xl transition-shadow"
                    >
                      <div className="h-40 relative">
                        {restaurant.image && (
                          <img
                            src={restaurant.image}
                            alt={restaurant.name}
                            className="w-full h-full object-cover"
                          />
                        )}
                        {restaurant.cuisine && (
                          <Badge className="absolute top-4 left-4 bg-black/70 text-white">
                            {restaurant.cuisine}
                          </Badge>
                        )}
                      </div>
                      <CardContent className="p-6 space-y-3">
                        <h3 className="text-xl font-bold">{restaurant.name}</h3>
                        {restaurant.description && (
                          <p className="text-gray-600 text-sm">{restaurant.description}</p>
                        )}
                        {restaurant.address && (
                          <p className="text-sm text-gray-500">{restaurant.address}</p>
                        )}
                        <div className="flex items-center justify-between mt-2 text-sm text-gray-600">
                          <span>{restaurant.priceRange}</span>
                          {restaurant.rating > 0 && (
                            <span className="flex items-center gap-1">
                              <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                              {restaurant.rating.toFixed(1)}
                            </span>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Map Tab */}
          {selectedTab === 'map' && (
            <div>
              <h2 className="text-3xl font-bold mb-8">Explore Vavuniya Map</h2>
              <p className="text-gray-600 mb-8 text-center max-w-2xl mx-auto">
                Discover key attractions, temples, and points of interest across Vavuniya
              </p>
              <div className="grid lg:grid-cols-3 gap-8">
                {/* Interactive Map */}
                <div className="lg:col-span-2">
                  <Card className="overflow-hidden h-[500px]">
                    <DestinationMap
                      destinationName="Vavuniya"
                      center={VAVUNIYA_CENTER}
                      attractions={[
                        { name: 'Vavuniya Town Center', description: 'Main town area', coordinates: VAVUNIYA_CENTER },
                        { name: 'Kandaswamy Kovil', description: 'Ancient Hindu temple', coordinates: { lat: 8.7600, lng: 80.4900 } },
                        { name: 'Vavuniya Archaeological Museum', description: 'Historical artifacts', coordinates: { lat: 8.7450, lng: 80.5050 } },
                        { name: 'Main Street Market', description: 'Local market & crafts', coordinates: { lat: 8.7550, lng: 80.4850 } },
                        { name: 'Giant\'s Tank', description: 'Ancient reservoir', coordinates: { lat: 8.7400, lng: 80.4800 } },
                        { name: 'Railway Station', description: 'Northern line terminus', coordinates: { lat: 8.7650, lng: 80.5100 } },
                      ]}
                      height="500px"
                    />
                  </Card>
                </div>

                {/* Weather Widget */}
                <div className="lg:col-span-1">
                  <WeatherWidget
                    locationName="Vavuniya"
                    latitude={VAVUNIYA_CENTER.lat}
                    longitude={VAVUNIYA_CENTER.lng}
                  />
                </div>
              </div>
            </div>
          )}

          {/* Weather Tab */}
          {selectedTab === 'weather' && (
            <div>
              <h2 className="text-3xl font-bold mb-8">Weather in Vavuniya</h2>
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                <Card>
                  <CardHeader>
                    <Sun className="w-8 h-8 text-orange-500 mb-2" />
                    <CardTitle>Temperature</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-2xl font-bold">{weatherInfo.temperature}</p>
                    <p className="text-gray-600">Warm climate</p>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <Cloud className="w-8 h-8 text-blue-500 mb-2" />
                    <CardTitle>Humidity</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-2xl font-bold">{weatherInfo.humidity}</p>
                    <p className="text-gray-600">Moderate levels</p>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <Cloud className="w-8 h-8 text-gray-500 mb-2" />
                    <CardTitle>Rainfall</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-2xl font-bold">{weatherInfo.rainfall}</p>
                    <p className="text-gray-600">Oct-Jan monsoon</p>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <Calendar className="w-8 h-8 text-green-500 mb-2" />
                    <CardTitle>Best Time</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-2xl font-bold">{destinationInfo.bestTime}</p>
                    <p className="text-gray-600">Dry season</p>
                  </CardContent>
                </Card>
              </div>
            </div>
          )}
        </section>

        {/* Travel Tips Section */}
        <section className="bg-gray-50 py-12">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold mb-8 text-center">Travel Tips for Vavuniya</h2>
            {travelTips.length > 0 ? (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-4xl mx-auto">
                {travelTips.map((tip, index) => (
                  <Card key={index}>
                    <CardHeader>
                      <CardTitle>{tip.title}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-gray-600">{tip.content}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-4xl mx-auto">
                <Card>
                  <CardHeader>
                    <Users className="w-8 h-8 text-amber-600 mb-2" />
                    <CardTitle>Cultural Respect</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600">Dress modestly when visiting temples. Remove shoes before entering religious sites and be respectful of local customs.</p>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <Store className="w-8 h-8 text-amber-600 mb-2" />
                    <CardTitle>Market Shopping</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600">Best shopping is early morning at the main market. Bargaining is expected. Try local snacks like vadai and murukku.</p>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <Bus className="w-8 h-8 text-amber-600 mb-2" />
                    <CardTitle>Northern Gateway</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600">Vavuniya is the perfect base for exploring Jaffna, Mannar, and other northern destinations. Regular buses and trains available.</p>
                  </CardContent>
                </Card>
              </div>
            )}
          </div>
        </section>

        {/* CTA Section */}
        <section className="bg-gradient-to-r from-amber-600 to-orange-600 py-16">
          <div className="container mx-auto px-4 text-center text-white">
            <h2 className="text-4xl font-bold mb-4">{ctaSection.title}</h2>
            <p className="text-xl mb-8 max-w-2xl mx-auto">
              {ctaSection.subtitle}
            </p>
            <div className="flex gap-4 justify-center">
              <Button size="lg" variant="secondary" onClick={() => handleBooking()}>
                {ctaSection.buttonText}
              </Button>
              <Button
                asChild
                size="lg"
                variant="outline"
                className="bg-white/10 backdrop-blur-sm text-white border-white hover:bg-white/20"
              >
                <Link to="/book-now">
                  Speak to Local Expert
                </Link>
              </Button>
            </div>
          </div>
        </section>
      </div>

      <Footer />

      {/* WhatsApp Float Button */}
      <a
        href="https://wa.me/94777721999?text=Hi! I'm interested in booking a Vavuniya tour."
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

export default Vavuniya;