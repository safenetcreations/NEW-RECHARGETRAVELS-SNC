import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Mountain, 
  Train, 
  Coffee, 
  MapPin,
  Calendar,
  Clock,
  Star,
  ChevronDown,
  Wifi,
  Home,
  Utensils,
  Camera,
  TreePine,
  Heart,
  Users,
  DollarSign,
  Info,
  Sun,
  Cloud,
  Navigation,
  Sunrise,
  Wind
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import EnhancedBookingModal from '@/components/EnhancedBookingModal';
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
  season: string;
  rainfall: string;
}

interface Accommodation {
  name: string;
  type: string;
  price: string;
  features: string[];
}

interface DiningOption {
  name: string;
  cuisine: string;
  specialty: string;
  priceRange: string;
}

interface CTASection {
  title: string;
  subtitle: string;
  buttonText: string;
}

const Ella = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [selectedTab, setSelectedTab] = useState('attractions');
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [selectedAttraction, setSelectedAttraction] = useState<string>('');

  const [heroSlides, setHeroSlides] = useState<HeroSlide[]>([
    {
      image: "https://images.unsplash.com/photo-1566296440685-38a26e48b3fa?auto=format&fit=crop&q=80",
      title: "Welcome to Ella",
      subtitle: "Scenic Hill Station with Breathtaking Views"
    },
    {
      image: "https://images.unsplash.com/photo-1588312336500-1d50753d80f8?auto=format&fit=crop&q=80",
      title: "Nine Arch Bridge",
      subtitle: "Architectural Marvel Amidst Lush Greenery"
    },
    {
      image: "https://images.unsplash.com/photo-1584467735815-f04249e61c67?auto=format&fit=crop&q=80",
      title: "Tea Country Paradise",
      subtitle: "Rolling Hills of Emerald Tea Plantations"
    }
  ]);

  const [attractions, setAttractions] = useState<Attraction[]>([
    {
      name: "Ella Rock",
      description: "Challenging hiking trail leading to a summit with spectacular panoramic views of the surrounding valleys and tea plantations",
      image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&q=80",
      category: "Adventure",
      rating: 4.8,
      duration: "4-5 hours",
      price: "Guide: $20"
    },
    {
      name: "Nine Arch Bridge",
      description: "Iconic colonial-era railway bridge known as 'Bridge in the Sky', surrounded by dense jungle and tea fields",
      image: "https://images.unsplash.com/photo-1588312336500-1d50753d80f8?auto=format&fit=crop&q=80",
      category: "Landmarks",
      rating: 4.9,
      duration: "1-2 hours",
      price: "Free"
    },
    {
      name: "Little Adam's Peak",
      description: "Easier alternative to Ella Rock with equally stunning views, perfect for sunrise or sunset hikes",
      image: "https://images.unsplash.com/photo-1454391304352-2bf4678b1a7a?auto=format&fit=crop&q=80",
      category: "Adventure",
      rating: 4.7,
      duration: "2-3 hours",
      price: "Free"
    },
    {
      name: "Ravana Falls",
      description: "Spectacular 25m high waterfall named after the legendary king Ravana, with natural pools for swimming",
      image: "https://images.unsplash.com/photo-1526080676457-4f8e0d5e8b4a?auto=format&fit=crop&q=80",
      category: "Nature",
      rating: 4.5,
      duration: "1-2 hours",
      price: "Free"
    },
    {
      name: "Lipton's Seat",
      description: "Viewpoint where Sir Thomas Lipton surveyed his tea empire, offering 360-degree views on clear days",
      image: "https://images.unsplash.com/photo-1584467735815-f04249e61c67?auto=format&fit=crop&q=80",
      category: "Viewpoints",
      rating: 4.6,
      duration: "Half Day",
      price: "Transport: $30"
    },
    {
      name: "Tea Factory Tours",
      description: "Visit working tea factories to learn about Ceylon tea production from leaf to cup",
      image: "https://images.unsplash.com/photo-1564501049412-61c2a3083791?auto=format&fit=crop&q=80",
      category: "Cultural",
      rating: 4.4,
      duration: "2-3 hours",
      price: "$10"
    }
  ]);

  const [activities, setActivities] = useState<Activity[]>([
    {
      name: "Sunrise Hike to Ella Rock",
      description: "Early morning trek to catch spectacular sunrise views",
      icon: Sunrise,
      price: "From $25",
      duration: "5 hours",
      popular: true
    },
    {
      name: "Train Ride to Kandy",
      description: "One of the world's most scenic train journeys",
      icon: Train,
      price: "From $3",
      duration: "6-7 hours",
      popular: true
    },
    {
      name: "Tea Tasting Experience",
      description: "Sample various grades of Ceylon tea",
      icon: Coffee,
      price: "From $15",
      duration: "2 hours"
    },
    {
      name: "Cooking Class",
      description: "Learn to prepare authentic Sri Lankan dishes",
      icon: Utensils,
      price: "From $30",
      duration: "3 hours"
    },
    {
      name: "Zip Lining Adventure",
      description: "Fly through the tea plantations on zip lines",
      icon: Wind,
      price: "From $40",
      duration: "2 hours"
    },
    {
      name: "Photography Tour",
      description: "Capture Ella's most photogenic locations",
      icon: Camera,
      price: "From $35",
      duration: "4 hours"
    }
  ]);

  const [destinationInfo, setDestinationInfo] = useState<DestinationInfo>({
    population: "45,000",
    area: "24.5 km²",
    elevation: "1,041 m",
    bestTime: "January to April",
    language: "Sinhala, Tamil, English",
    currency: "Sri Lankan Rupee (LKR)"
  });

  const [accommodations, setAccommodations] = useState<Accommodation[]>([
    {
      name: "98 Acres Resort & Spa",
      type: "Luxury Resort",
      price: "$200-400",
      features: ["Spa", "Infinity Pool", "Tea Plantation Views"]
    },
    {
      name: "Ella Jungle Resort",
      type: "Eco Lodge",
      price: "$80-150",
      features: ["Nature Views", "Organic Food", "Yoga Classes"]
    },
    {
      name: "Ella Mount Heaven",
      type: "Boutique Hotel",
      price: "$60-120",
      features: ["Mountain Views", "Restaurant", "Free WiFi"]
    },
    {
      name: "Ella Rock House",
      type: "Guesthouse",
      price: "$30-60",
      features: ["Homely Atmosphere", "Local Breakfast", "Tour Assistance"]
    }
  ]);

  const [restaurants, setRestaurants] = useState<DiningOption[]>([
    {
      name: "Cafe Chill",
      cuisine: "International & Local",
      specialty: "Wood-fired pizzas and Sri Lankan rice & curry",
      priceRange: "$$"
    },
    {
      name: "AK Ristoro",
      cuisine: "Italian",
      specialty: "Authentic pasta and mountain views",
      priceRange: "$$$"
    },
    {
      name: "Matey Hut",
      cuisine: "Sri Lankan",
      specialty: "Traditional kottu and hoppers",
      priceRange: "$"
    },
    {
      name: "Jade Green Tea Restaurant",
      cuisine: "Asian Fusion",
      specialty: "Fresh ingredients from own garden",
      priceRange: "$$"
    }
  ]);

  const [weatherInfo, setWeatherInfo] = useState<WeatherInfo>({
    temperature: "15-25°C",
    season: "Cool and Pleasant",
    rainfall: "Low (Jan-Apr), High (Oct-Dec)"
  });

  const [ctaSection, setCtaSection] = useState<CTASection>({
    title: "Ready to Explore Ella's Natural Beauty?",
    subtitle:
      "Let us help you plan the perfect hill country getaway with customized tours and experiences",
    buttonText: "Start Planning Your Trip",
  });

  // Cycle through hero slides
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [heroSlides.length]);

  // Load dynamic content from Firestore destination document
  useEffect(() => {
    const loadContent = async () => {
      try {
        const data = await getDestinationBySlug('ella');

        if (data) {
          const anyData: any = data;

          if (Array.isArray(anyData.heroSlides) && anyData.heroSlides.length) {
            setHeroSlides(anyData.heroSlides as HeroSlide[]);
          } else if (Array.isArray(anyData.heroImages) && anyData.heroImages.length) {
            // Backwards compatibility with older schema
            setHeroSlides(anyData.heroImages as HeroSlide[]);
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
              temperature: anyData.weatherInfo.temperature || "15-25°C",
              season: anyData.weatherInfo.season || "Cool and Pleasant",
              rainfall: anyData.weatherInfo.rainfall || "Low (Jan-Apr), High (Oct-Dec)",
            });
          }

          if (Array.isArray(anyData.hotels) && anyData.hotels.length) {
            setAccommodations(
              anyData.hotels.map((hotel: any) => ({
                name: hotel.name,
                type: hotel.type || (hotel.starRating ? `${hotel.starRating}-Star Hotel` : 'Hotel'),
                price: hotel.priceRange || hotel.price || '',
                features: hotel.amenities || [],
              }))
            );
          }

          if (Array.isArray(anyData.restaurants) && anyData.restaurants.length) {
            setRestaurants(
              anyData.restaurants.map((rest: any) => ({
                name: rest.name,
                cuisine: rest.cuisine || '',
                specialty: rest.description || rest.specialty || '',
                priceRange: rest.priceRange || '',
              }))
            );
          }

          if (anyData.ctaSection) {
            setCtaSection({
              title: anyData.ctaSection.title || "Ready to Explore Ella's Natural Beauty?",
              subtitle:
                anyData.ctaSection.subtitle ||
                "Let us help you plan the perfect hill country getaway with customized tours and experiences",
              buttonText: anyData.ctaSection.buttonText || "Start Planning Your Trip",
            });
          }
        }
      } catch (error) {
        console.error('Error loading destination content for Ella:', error);
      }
    };

    loadContent();
  }, []);

  const getIconComponent = (iconName: string) => {
    const iconMap: { [key: string]: any } = {
      Sunrise,
      Train,
      Coffee,
      Utensils,
      Wind,
      Camera,
      Mountain,
      TreePine,
      Heart,
      Navigation,
      Sun,
    };

    return iconMap[iconName] || Camera;
  };

  const tabs = [
    { id: 'attractions', label: 'Attractions', count: attractions.length },
    { id: 'activities', label: 'Activities', count: activities.length },
    { id: 'accommodation', label: 'Stay', count: accommodations.length },
    { id: 'dining', label: 'Dining', count: restaurants.length },
    { id: 'info', label: 'Travel Info', count: null }
  ];

  return (
    <>
      <Helmet>
        <title>Ella - Scenic Hill Station & Tea Country Paradise | Recharge Travels</title>
        <meta name="description" content="Discover Ella, Sri Lanka's scenic hill station with breathtaking views, hiking trails, tea plantations, and the famous Nine Arch Bridge. Plan your mountain retreat with Recharge Travels." />
        <meta name="keywords" content="Ella Sri Lanka, Nine Arch Bridge, Ella Rock, Little Adams Peak, tea plantations, hill country, hiking trails, train rides, Ravana Falls" />
      </Helmet>
      
      <Header />
      
      <div className="min-h-screen bg-background">
        {/* Hero Section with Slideshow */}
        <div className="relative h-[70vh] overflow-hidden">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentSlide}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1 }}
              className="absolute inset-0"
            >
              <div 
                className="h-full bg-cover bg-center"
                style={{ backgroundImage: `url(${heroSlides[currentSlide].image})` }}
              >
                <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/30 to-black/60" />
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Hero Content */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center text-white px-4 max-w-4xl">
              <motion.h1 
                initial={{ y: 30, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="text-5xl md:text-7xl font-bold mb-6"
              >
                {heroSlides[currentSlide].title}
              </motion.h1>
              <motion.p 
                initial={{ y: 30, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="text-xl md:text-2xl mb-8"
              >
                {heroSlides[currentSlide].subtitle}
              </motion.p>
              <motion.div
                initial={{ y: 30, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.7 }}
              >
                <Button 
                  size="lg" 
                  className="bg-emerald-600 hover:bg-emerald-700 text-white px-8 py-6 text-lg"
                  onClick={() => setShowBookingModal(true)}
                >
                  Plan Your Ella Adventure
                </Button>
              </motion.div>
            </div>
          </div>

          {/* Slide Indicators */}
          <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex space-x-2">
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
        </div>

        {/* Quick Info Bar */}
        <div className="bg-emerald-700 text-white py-4">
          <div className="container mx-auto px-4">
            <div className="flex flex-wrap justify-center items-center gap-8 text-sm">
              <div className="flex items-center gap-2">
                <Mountain className="w-4 h-4" />
                <span>Elevation: {destinationInfo.elevation}</span>
              </div>
              <div className="flex items-center gap-2">
                <Sun className="w-4 h-4" />
                <span>Climate: {weatherInfo.temperature}</span>
              </div>
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4" />
                <span>Population: {destinationInfo.population}</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                <span>Best Time: {destinationInfo.bestTime}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs Navigation */}
        <div className="sticky top-0 z-40 bg-background border-b">
          <div className="container mx-auto px-4">
            <div className="flex overflow-x-auto scrollbar-hide">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setSelectedTab(tab.id)}
                  className={`px-6 py-4 font-medium transition-all whitespace-nowrap border-b-2 ${
                    selectedTab === tab.id
                      ? 'border-emerald-600 text-emerald-600'
                      : 'border-transparent text-muted-foreground hover:text-foreground'
                  }`}
                >
                  {tab.label}
                  {tab.count && (
                    <Badge variant="secondary" className="ml-2">
                      {tab.count}
                    </Badge>
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Content Sections */}
        <div className="container mx-auto px-4 py-12">
          <AnimatePresence mode="wait">
            {/* Attractions Tab */}
            {selectedTab === 'attractions' && (
              <motion.div
                key="attractions"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
              >
                {attractions.map((attraction, index) => (
                  <Card key={index} className="group hover:shadow-xl transition-all duration-300 overflow-hidden">
                    <div className="aspect-video overflow-hidden">
                      <img 
                        src={attraction.image} 
                        alt={attraction.name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                      />
                    </div>
                    <CardHeader>
                      <div className="flex justify-between items-start">
                        <CardTitle className="text-xl">{attraction.name}</CardTitle>
                        <Badge variant="secondary" className="ml-2">
                          {attraction.category}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-muted-foreground mb-4">{attraction.description}</p>
                      <div className="space-y-2 mb-4">
                        <div className="flex items-center text-sm">
                          <Star className="w-4 h-4 text-yellow-500 mr-2" />
                          <span>{attraction.rating} rating</span>
                        </div>
                        <div className="flex items-center text-sm text-muted-foreground">
                          <Clock className="w-4 h-4 mr-2" />
                          <span>{attraction.duration}</span>
                        </div>
                        <div className="flex items-center text-sm text-muted-foreground">
                          <DollarSign className="w-4 h-4 mr-2" />
                          <span>{attraction.price}</span>
                        </div>
                      </div>
                      <Button 
                        className="w-full bg-emerald-600 hover:bg-emerald-700"
                        onClick={() => {
                          setSelectedAttraction(attraction.name);
                          setShowBookingModal(true);
                        }}
                      >
                        Book Now
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </motion.div>
            )}

            {/* Activities Tab */}
            {selectedTab === 'activities' && (
              <motion.div
                key="activities"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
              >
                {activities.map((activity, index) => (
                  <Card key={index} className="hover:shadow-lg transition-shadow">
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div className="flex items-center">
                          <div className="p-3 bg-emerald-100 rounded-lg mr-4">
                            <activity.icon className="w-6 h-6 text-emerald-600" />
                          </div>
                          <div>
                            <CardTitle className="text-lg">{activity.name}</CardTitle>
                            {activity.popular && (
                              <Badge variant="default" className="mt-1 bg-orange-500">
                                Popular
                              </Badge>
                            )}
                          </div>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-muted-foreground mb-4">{activity.description}</p>
                      <div className="flex justify-between items-center mb-4">
                        <span className="text-lg font-semibold text-emerald-600">{activity.price}</span>
                        <span className="text-sm text-muted-foreground">{activity.duration}</span>
                      </div>
                      <Button 
                        variant="outline" 
                        className="w-full hover:bg-emerald-600 hover:text-white"
                        onClick={() => {
                          setSelectedAttraction(activity.name);
                          setShowBookingModal(true);
                        }}
                      >
                        Book Activity
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </motion.div>
            )}

            {/* Accommodation Tab */}
            {selectedTab === 'accommodation' && (
              <motion.div
                key="accommodation"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="space-y-6"
              >
                {accommodations.map((hotel, index) => (
                  <Card key={index} className="hover:shadow-lg transition-shadow">
                    <CardContent className="p-6">
                      <div className="flex flex-col md:flex-row justify-between">
                        <div className="flex-1">
                          <div className="flex items-center mb-2">
                            <Home className="w-5 h-5 mr-2 text-emerald-600" />
                            <h3 className="text-xl font-semibold">{hotel.name}</h3>
                          </div>
                          <Badge variant="outline" className="mb-3">
                            {hotel.type}
                          </Badge>
                          <div className="flex flex-wrap gap-2 mt-3">
                            {hotel.features.map((feature, idx) => (
                              <Badge key={idx} variant="secondary">
                                {feature}
                              </Badge>
                            ))}
                          </div>
                        </div>
                        <div className="mt-4 md:mt-0 md:ml-8 text-right">
                          <p className="text-2xl font-bold text-emerald-600">{hotel.price}</p>
                          <p className="text-sm text-muted-foreground">per night</p>
                          <Button 
                            className="mt-4 bg-emerald-600 hover:bg-emerald-700"
                            onClick={() => {
                              setSelectedAttraction(hotel.name);
                              setShowBookingModal(true);
                            }}
                          >
                            Check Availability
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </motion.div>
            )}

            {/* Dining Tab */}
            {selectedTab === 'dining' && (
              <motion.div
                key="dining"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="grid md:grid-cols-2 gap-6"
              >
                {restaurants.map((restaurant, index) => (
                  <Card key={index} className="hover:shadow-lg transition-shadow">
                    <CardContent className="p-6">
                      <div className="flex items-start">
                        <div className="p-3 bg-emerald-100 rounded-lg mr-4">
                          <Utensils className="w-6 h-6 text-emerald-600" />
                        </div>
                        <div className="flex-1">
                          <h3 className="text-xl font-semibold mb-1">{restaurant.name}</h3>
                          <p className="text-muted-foreground mb-2">{restaurant.cuisine}</p>
                          <p className="text-sm mb-3">{restaurant.specialty}</p>
                          <Badge variant="outline">{restaurant.priceRange}</Badge>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </motion.div>
            )}

            {/* Travel Info Tab */}
            {selectedTab === 'info' && (
              <motion.div
                key="info"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="grid md:grid-cols-2 gap-8"
              >
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Info className="w-5 h-5 mr-2" />
                      Destination Information
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-muted-foreground">Population</p>
                        <p className="font-semibold">{destinationInfo.population}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Area</p>
                        <p className="font-semibold">{destinationInfo.area}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Elevation</p>
                        <p className="font-semibold">{destinationInfo.elevation}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Best Time to Visit</p>
                        <p className="font-semibold">{destinationInfo.bestTime}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Cloud className="w-5 h-5 mr-2" />
                      Weather & Climate
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div>
                        <p className="text-sm text-muted-foreground">Temperature Range</p>
                        <p className="font-semibold">{weatherInfo.temperature}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Season</p>
                        <p className="font-semibold">{weatherInfo.season}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Rainfall Pattern</p>
                        <p className="font-semibold">{weatherInfo.rainfall}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Navigation className="w-5 h-5 mr-2" />
                      Getting There
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div>
                      <p className="font-semibold">From Colombo</p>
                      <p className="text-sm text-muted-foreground">Train: 6-7 hours | Car: 5 hours</p>
                    </div>
                    <div>
                      <p className="font-semibold">From Kandy</p>
                      <p className="text-sm text-muted-foreground">Train: 3-4 hours | Car: 2.5 hours</p>
                    </div>
                    <div>
                      <p className="font-semibold">From Nuwara Eliya</p>
                      <p className="text-sm text-muted-foreground">Train: 2 hours | Car: 1.5 hours</p>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Train className="w-5 h-5 mr-2" />
                      Famous Train Journey
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground mb-4">
                      The train journey from Kandy to Ella is considered one of the most scenic train rides in the world.
                    </p>
                    <div className="space-y-2">
                      <p className="text-sm"><strong>Duration:</strong> 6-7 hours</p>
                      <p className="text-sm"><strong>Best Seats:</strong> Right side from Kandy</p>
                      <p className="text-sm"><strong>Ticket Price:</strong> $3-15 depending on class</p>
                      <p className="text-sm"><strong>Book in Advance:</strong> Highly recommended</p>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Call to Action Section */}
        <div className="bg-gradient-to-r from-emerald-600 to-teal-600 text-white py-16">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              {ctaSection.title}
            </h2>
            <p className="text-xl mb-8 max-w-2xl mx-auto">
              {ctaSection.subtitle}
            </p>
            <Button 
              size="lg" 
              className="bg-white text-emerald-600 hover:bg-gray-100"
              onClick={() => setShowBookingModal(true)}
            >
              {ctaSection.buttonText}
            </Button>
          </div>
        </div>
      </div>

      <Footer />

      {/* Enhanced Booking Modal */}
      <EnhancedBookingModal
        isOpen={showBookingModal}
        onClose={() => setShowBookingModal(false)}
        preSelectedService={selectedAttraction}
      />
    </>
  );
};

export default Ella;