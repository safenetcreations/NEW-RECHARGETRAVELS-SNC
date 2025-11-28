import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Bird,
  Waves,
  Sunrise,
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
  Users,
  DollarSign,
  Info,
  Sun,
  Cloud,
  Navigation,
  Building,
  ShoppingBag,
  Fish,
  Mountain,
  Sparkles
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import EnhancedBookingModal from '@/components/EnhancedBookingModal';
import { Link } from 'react-router-dom';
import { getDestinationBySlug } from '@/services/destinationContentService';

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

const Puttalam = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [selectedTab, setSelectedTab] = useState('attractions');
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [selectedAttraction, setSelectedAttraction] = useState<string>('');

  const [heroSlides, setHeroSlides] = useState<HeroSlide[]>([
    {
      image: "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?auto=format&fit=crop&q=80",
      title: "Discover Puttalam",
      subtitle: "Where Lagoons Meet the Sky"
    },
    {
      image: "https://images.unsplash.com/photo-1518509562904-e7ef99cdcc86?auto=format&fit=crop&q=80",
      title: "Salt Pans & Flamingos",
      subtitle: "A Haven for Migratory Birds"
    },
    {
      image: "https://images.unsplash.com/photo-1546026423-cc4642628d2b?auto=format&fit=crop&q=80",
      title: "Coastal Paradise",
      subtitle: "Untouched Lagoons & Pristine Nature"
    }
  ]);

  const [attractions, setAttractions] = useState<Attraction[]>([
    {
      name: "Puttalam Lagoon",
      description: "A spectacular brackish water lagoon spanning 327 sq km, home to thousands of migratory birds including flamingos, pelicans, and herons",
      image: "https://images.unsplash.com/photo-1559827260-dc66d52bef19?auto=format&fit=crop&q=80",
      category: "Nature & Wildlife",
      rating: 4.8,
      duration: "3-4 hours",
      price: "$15"
    },
    {
      name: "Munneswaram Temple",
      description: "Ancient Hindu temple complex dedicated to Lord Shiva, one of the five ancient Shiva temples in Sri Lanka with rich archaeological significance",
      image: "https://images.unsplash.com/photo-1584607263236-8fcf0a1a7a10?auto=format&fit=crop&q=80",
      category: "Religious Sites",
      rating: 4.7,
      duration: "1-2 hours",
      price: "$5"
    },
    {
      name: "Salt Pans of Puttalam",
      description: "Vast expanses of traditional salt production fields, creating stunning geometric patterns and attracting numerous bird species",
      image: "https://images.unsplash.com/photo-1500463959177-e0869687df26?auto=format&fit=crop&q=80",
      category: "Cultural Experience",
      rating: 4.5,
      duration: "2 hours",
      price: "Free"
    },
    {
      name: "Wilpattu National Park (South Gate)",
      description: "Access point to Sri Lanka's largest national park, home to leopards, elephants, and over 30 species of mammals",
      image: "https://images.unsplash.com/photo-1584888780470-d96de377e680?auto=format&fit=crop&q=80",
      category: "Wildlife & Safari",
      rating: 4.9,
      duration: "Full Day",
      price: "$45"
    },
    {
      name: "Anawilundawa Wetland Sanctuary",
      description: "Ramsar-recognized wetland sanctuary with six tanks, hosting over 150 bird species and diverse aquatic life",
      image: "https://images.unsplash.com/photo-1558667111-72a6cbe0a5ef?auto=format&fit=crop&q=80",
      category: "Nature Reserve",
      rating: 4.6,
      duration: "3 hours",
      price: "$10"
    },
    {
      name: "Palavi Beach",
      description: "Secluded beach with golden sand and calm waters, perfect for swimming and witnessing spectacular sunsets",
      image: "https://images.unsplash.com/photo-1520942702018-0862200e6873?auto=format&fit=crop&q=80",
      category: "Beaches",
      rating: 4.4,
      duration: "Half Day",
      price: "Free"
    }
  ]);

  const [activities, setActivities] = useState<Activity[]>([
    {
      name: "Lagoon Bird Watching Tour",
      description: "Early morning guided tour to spot flamingos, pelicans, and rare migratory birds",
      icon: Bird,
      price: "From $35",
      duration: "4 hours",
      popular: true
    },
    {
      name: "Traditional Fishing Experience",
      description: "Join local fishermen using traditional methods in the lagoon",
      icon: Fish,
      price: "From $25",
      duration: "3 hours"
    },
    {
      name: "Salt Production Tour",
      description: "Learn about traditional salt harvesting methods",
      icon: Sparkles,
      price: "From $20",
      duration: "2 hours"
    },
    {
      name: "Sunset Lagoon Cruise",
      description: "Scenic boat ride through mangroves at golden hour",
      icon: Sunrise,
      price: "From $30",
      duration: "2 hours"
    },
    {
      name: "Wetland Safari",
      description: "Explore Anawilundawa's diverse ecosystem by boat",
      icon: Waves,
      price: "From $40",
      duration: "Half Day"
    },
    {
      name: "Photography Workshop",
      description: "Capture salt pans, birds, and coastal landscapes",
      icon: Camera,
      price: "From $45",
      duration: "Full Day"
    }
  ]);

  const [destinationInfo, setDestinationInfo] = useState<DestinationInfo>({
    population: "76,000",
    area: "2,953 km²",
    elevation: "Sea level",
    bestTime: "November to April",
    language: "Sinhala, Tamil",
    currency: "Sri Lankan Rupee (LKR)"
  });

  const [weatherInfo, setWeatherInfo] = useState<WeatherInfo>({
    temperature: "26-32°C",
    humidity: "70-80%",
    rainfall: "Low-Moderate",
    season: "Tropical Dry Zone"
  });

  const [hotels, setHotels] = useState<HotelItem[]>([]);
  const [restaurants, setRestaurants] = useState<RestaurantItem[]>([]);
  const [travelTips, setTravelTips] = useState<TravelTip[]>([]);
  const [ctaSection, setCtaSection] = useState<CTASection>({
    title: "Ready to Explore Puttalam's Natural Wonders?",
    subtitle:
      "Experience the magic of flamingo-filled lagoons, traditional salt pans, and untouched coastal beauty",
    buttonText: "Book Your Adventure",
  });

  // Load content from Firestore destination document
  useEffect(() => {
    const loadContent = async () => {
      try {
        const data = await getDestinationBySlug('puttalam');

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
              temperature: anyData.weatherInfo.temperature || "26-32°C",
              humidity: anyData.weatherInfo.humidity || "70-80%",
              rainfall: anyData.weatherInfo.rainfall || "Low-Moderate",
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
              title:
                anyData.ctaSection.title ||
                "Ready to Explore Puttalam's Natural Wonders?",
              subtitle:
                anyData.ctaSection.subtitle ||
                "Experience the magic of flamingo-filled lagoons, traditional salt pans, and untouched coastal beauty",
              buttonText: anyData.ctaSection.buttonText || "Book Your Adventure",
            });
          }
        }
      } catch (error) {
        console.error('Error loading destination content for Puttalam:', error);
      }
    };

    loadContent();
  }, []);

  // Helper function to get icon component from string
  const getIconComponent = (iconName: string) => {
    const iconMap: { [key: string]: any } = {
      'Bird': Bird,
      'Fish': Fish,
      'Sparkles': Sparkles,
      'Sunrise': Sunrise,
      'Waves': Waves,
      'Camera': Camera,
      'Navigation': Navigation
    };
    return iconMap[iconName] || Bird;
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

  return (
    <>
      <Helmet>
        <title>Puttalam - Lagoons, Salt Pans & Bird Watching Paradise | Sri Lanka Travel Guide</title>
        <meta name="description" content="Explore Puttalam's vast lagoons, traditional salt pans, and incredible bird watching. Discover flamingos, wetlands, and coastal culture in Sri Lanka's northwest." />
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
                <Button size="lg" onClick={() => handleBookNow()}>
                  Book Your Experience
                </Button>
                <Button
                  asChild
                  size="lg"
                  variant="outline"
                  className="bg-white/10 backdrop-blur-sm"
                >
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
              {['attractions', 'activities', 'hotels', 'restaurants', 'weather'].map((tab) => (
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
              <h2 className="text-3xl font-bold mb-8">Top Attractions in Puttalam</h2>
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
              <h2 className="text-3xl font-bold mb-8">Things to Do in Puttalam</h2>
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
                        <Button onClick={() => handleBookNow(activity.name)}>
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
              <h2 className="text-3xl font-bold mb-8">Where to Stay in Puttalam</h2>
              {hotels.length === 0 ? (
                <div className="text-center py-12">
                  <Hotel className="w-16 h-16 mx-auto mb-4 text-gray-400" />
                  <h3 className="text-xl font-semibold mb-2">Hotels Coming Soon</h3>
                  <p className="text-gray-600">
                    We're working on bringing you the best hotel recommendations in Puttalam
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
                          onClick={() => handleBookNow(hotel.name)}
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
              <h2 className="text-3xl font-bold mb-8">Where to Eat in Puttalam</h2>
              {restaurants.length === 0 ? (
                <div className="text-center py-12">
                  <Utensils className="w-16 h-16 mx-auto mb-4 text-gray-400" />
                  <h3 className="text-xl font-semibold mb-2">Restaurants Coming Soon</h3>
                  <p className="text-gray-600">
                    Discover the best dining experiences in Puttalam
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

          {/* Weather Tab */}
          {selectedTab === 'weather' && (
            <div>
              <h2 className="text-3xl font-bold mb-8">Weather in Puttalam</h2>
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                <Card>
                  <CardHeader>
                    <Sun className="w-8 h-8 text-orange-500 mb-2" />
                    <CardTitle>Temperature</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-2xl font-bold">{weatherInfo.temperature}</p>
                    <p className="text-gray-600">Warm coastal climate</p>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <Cloud className="w-8 h-8 text-blue-500 mb-2" />
                    <CardTitle>Humidity</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-2xl font-bold">{weatherInfo.humidity}</p>
                    <p className="text-gray-600">Coastal influence</p>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <Cloud className="w-8 h-8 text-gray-500 mb-2" />
                    <CardTitle>Rainfall</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-2xl font-bold">{weatherInfo.rainfall}</p>
                    <p className="text-gray-600">Oct-Dec monsoon</p>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <Calendar className="w-8 h-8 text-green-500 mb-2" />
                    <CardTitle>Best Time</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-2xl font-bold">{destinationInfo.bestTime}</p>
                    <p className="text-gray-600">Bird migration season</p>
                  </CardContent>
                </Card>
              </div>
            </div>
          )}
        </section>

        {/* Travel Tips Section */}
        <section className="bg-gray-50 py-12">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold mb-8 text-center">Travel Tips for Puttalam</h2>
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
                    <Bird className="w-8 h-8 text-amber-600 mb-2" />
                    <CardTitle>Best Bird Watching</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600">Visit during November to March when thousands of migratory birds arrive. Early morning is the best time for sightings.</p>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <Sunrise className="w-8 h-8 text-amber-600 mb-2" />
                    <CardTitle>Salt Pan Photography</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600">The salt pans create stunning geometric patterns best captured during golden hour. Respect workers' privacy when photographing.</p>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <Fish className="w-8 h-8 text-amber-600 mb-2" />
                    <CardTitle>Fresh Seafood</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600">Try the local lagoon prawns and crab curry. Visit the fish market early morning for the freshest catch.</p>
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
              <Button size="lg" variant="secondary" onClick={() => handleBookNow()}>
                {ctaSection.buttonText}
              </Button>
              <Button
                asChild
                size="lg"
                variant="outline"
                className="bg-white/10 backdrop-blur-sm text-white border-white hover:bg-white/20"
              >
                <Link to="/book-now">
                  Contact Our Experts
                </Link>
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

export default Puttalam;