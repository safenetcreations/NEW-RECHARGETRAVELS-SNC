import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Waves, 
  Sun, 
  Palmtree, 
  MapPin,
  Calendar,
  Clock,
  Star,
  Fish,
  Utensils,
  Camera,
  Users,
  DollarSign,
  Info,
  Cloud,
  Navigation,
  Sunrise,
  Wind,
  Home,
  Activity,
  Anchor,
  TreePalm
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

interface SurfSpot {
  name: string;
  level: string;
  waveType: string;
  bestTime: string;
  crowdLevel: string;
}

interface CTASection {
  title: string;
  subtitle: string;
  buttonText: string;
}

const ArugamBay = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [selectedTab, setSelectedTab] = useState('attractions');
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [selectedAttraction, setSelectedAttraction] = useState<string>('');

  const [heroSlides, setHeroSlides] = useState<HeroSlide[]>([
    {
      image: "https://images.unsplash.com/photo-1502680390469-be75c86b636f?auto=format&fit=crop&q=80",
      title: "Welcome to Arugam Bay",
      subtitle: "Sri Lanka's Premier Surfing Paradise"
    },
    {
      image: "https://images.unsplash.com/photo-1502933691298-84fc14542831?auto=format&fit=crop&q=80",
      title: "World-Class Waves",
      subtitle: "International Surfing Destination"
    },
    {
      image: "https://images.unsplash.com/photo-1527004760551-13e8a5e0e6c4?auto=format&fit=crop&q=80",
      title: "Tropical Beach Paradise",
      subtitle: "Endless Summer Vibes"
    }
  ]);

  const [attractions, setAttractions] = useState<Attraction[]>([
    {
      name: "Main Point",
      description: "The most famous surf break in Arugam Bay, offering consistent right-hand point breaks perfect for intermediate to advanced surfers",
      image: "https://images.unsplash.com/photo-1502680390469-be75c86b636f?auto=format&fit=crop&q=80",
      category: "Surfing",
      rating: 4.9,
      duration: "2-4 hours",
      price: "Board rental: $10-20/day"
    },
    {
      name: "Whiskey Point",
      description: "A scenic surf spot north of Arugam Bay, ideal for beginners with gentle waves and a relaxed atmosphere",
      image: "https://images.unsplash.com/photo-1459745930869-b3d0d72c3271?auto=format&fit=crop&q=80",
      category: "Surfing",
      rating: 4.7,
      duration: "Half day",
      price: "Lessons: $30-50"
    },
    {
      name: "Elephant Rock",
      description: "A massive rock formation offering panoramic views of the coastline, perfect for sunset watching and photography",
      image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&q=80",
      category: "Viewpoints",
      rating: 4.6,
      duration: "1-2 hours",
      price: "Free"
    },
    {
      name: "Pottuvil Lagoon",
      description: "Serene lagoon perfect for kayaking, bird watching, and spotting crocodiles in their natural habitat",
      image: "https://images.unsplash.com/photo-1547036967-23d11aacaee0?auto=format&fit=crop&q=80",
      category: "Nature",
      rating: 4.5,
      duration: "2-3 hours",
      price: "Safari: $25-40"
    },
    {
      name: "Kudumbigala Monastery",
      description: "Ancient forest hermitage dating back to 2nd century BC, offering spiritual experiences and jungle trekking",
      image: "https://images.unsplash.com/photo-1609921141835-ed42426faa5f?auto=format&fit=crop&q=80",
      category: "Cultural",
      rating: 4.4,
      duration: "3-4 hours",
      price: "Guide: $15-20"
    },
    {
      name: "Panama Beach",
      description: "Pristine beach south of Arugam Bay with golden sand, fewer crowds, and excellent swimming conditions",
      image: "https://images.unsplash.com/photo-1519046904884-53103b34b206?auto=format&fit=crop&q=80",
      category: "Beaches",
      rating: 4.8,
      duration: "Half day",
      price: "Free"
    }
  ]);

  const [activities, setActivities] = useState<Activity[]>([
    {
      name: "Surfing Lessons",
      description: "Professional instructors for all skill levels",
      icon: Waves,
      price: "From $30",
      duration: "2 hours",
      popular: true
    },
    {
      name: "Lagoon Safari",
      description: "Wildlife spotting in Pottuvil Lagoon",
      icon: Anchor,
      price: "From $35",
      duration: "3 hours",
      popular: true
    },
    {
      name: "Yoga on the Beach",
      description: "Morning yoga sessions with ocean views",
      icon: Sunrise,
      price: "From $15",
      duration: "1.5 hours"
    },
    {
      name: "Deep Sea Fishing",
      description: "Traditional fishing experience with locals",
      icon: Fish,
      price: "From $60",
      duration: "4 hours"
    },
    {
      name: "Cooking Classes",
      description: "Learn authentic Sri Lankan seafood dishes",
      icon: Utensils,
      price: "From $25",
      duration: "3 hours"
    },
    {
      name: "Photography Tours",
      description: "Capture the best of beach life and culture",
      icon: Camera,
      price: "From $40",
      duration: "4 hours"
    }
  ]);

  const [destinationInfo, setDestinationInfo] = useState<DestinationInfo>({
    population: "3,500",
    area: "16.2 km²",
    elevation: "Sea level",
    bestTime: "April to October",
    language: "Tamil, Sinhala, English",
    currency: "Sri Lankan Rupee (LKR)"
  });

  const [accommodations, setAccommodations] = useState<Accommodation[]>([
    {
      name: "Jetwing Surf",
      type: "Luxury Resort",
      price: "$150-300",
      features: ["Beachfront", "Pool", "Spa", "Surf School"]
    },
    {
      name: "The Danish Villa",
      type: "Boutique Hotel",
      price: "$80-150",
      features: ["Ocean View", "Restaurant", "Yoga Deck"]
    },
    {
      name: "Arugam Bay Surf Resort",
      type: "Beach Resort",
      price: "$50-100",
      features: ["Direct Beach Access", "Surf Board Storage", "Bar"]
    },
    {
      name: "Stardust Beach Hotel",
      type: "Budget Hotel",
      price: "$30-60",
      features: ["Near Beach", "Free WiFi", "Breakfast"]
    }
  ]);

  const [restaurants, setRestaurants] = useState<DiningOption[]>([
    {
      name: "Hideaway Restaurant",
      cuisine: "Seafood & International",
      specialty: "Fresh grilled seafood and ocean views",
      priceRange: "$$$"
    },
    {
      name: "Mambos",
      cuisine: "Western & Local",
      specialty: "Beach BBQ and live music nights",
      priceRange: "$$"
    },
    {
      name: "Ranga's Beach Hut",
      cuisine: "Sri Lankan",
      specialty: "Authentic local dishes and fresh juice",
      priceRange: "$"
    },
    {
      name: "Gecko Restaurant",
      cuisine: "Fusion",
      specialty: "Creative fusion dishes with local ingredients",
      priceRange: "$$"
    }
  ]);

  const [surfSpots, setSurfSpots] = useState<SurfSpot[]>([
    {
      name: "Main Point",
      level: "Intermediate to Advanced",
      waveType: "Right-hand point break",
      bestTime: "May to September",
      crowdLevel: "High"
    },
    {
      name: "Whiskey Point",
      level: "Beginner to Intermediate",
      waveType: "Beach break",
      bestTime: "April to October",
      crowdLevel: "Medium"
    },
    {
      name: "Peanut Farm",
      level: "Advanced",
      waveType: "Reef break",
      bestTime: "June to August",
      crowdLevel: "Low"
    },
    {
      name: "Baby Point",
      level: "Beginner",
      waveType: "Gentle beach break",
      bestTime: "Year-round",
      crowdLevel: "Low"
    }
  ]);

  const [weatherInfo, setWeatherInfo] = useState<WeatherInfo>({
    temperature: "26-32°C",
    season: "Dry Season (Apr-Oct)",
    rainfall: "Low during surf season"
  });

  const [ctaSection, setCtaSection] = useState<CTASection>({
    title: "Ready to Catch the Perfect Wave?",
    subtitle:
      "Let us help you plan the ultimate surf adventure in Arugam Bay with expert guides and local insights",
    buttonText: "Start Planning Your Surf Trip",
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
        let data = await getDestinationBySlug('arugam-bay');

        // Backward compatibility with legacy doc id
        if (!data) {
          data = await getDestinationBySlug('arugambay');
        }

        if (data) {
          const anyData: any = data;

          if (Array.isArray(anyData.heroSlides) && anyData.heroSlides.length) {
            setHeroSlides(anyData.heroSlides as HeroSlide[]);
          } else if (Array.isArray(anyData.heroImages) && anyData.heroImages.length) {
            // Legacy field name
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
              temperature: anyData.weatherInfo.temperature || "26-32°C",
              season: anyData.weatherInfo.season || "Dry Season (Apr-Oct)",
              rainfall: anyData.weatherInfo.rainfall || "Low during surf season",
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

          if (Array.isArray(anyData.surfSpots) && anyData.surfSpots.length) {
            setSurfSpots(anyData.surfSpots as SurfSpot[]);
          }

          if (anyData.ctaSection) {
            setCtaSection({
              title: anyData.ctaSection.title || "Ready to Catch the Perfect Wave?",
              subtitle:
                anyData.ctaSection.subtitle ||
                "Let us help you plan the ultimate surf adventure in Arugam Bay with expert guides and local insights",
              buttonText: anyData.ctaSection.buttonText || "Start Planning Your Surf Trip",
            });
          }
        }
      } catch (error) {
        console.error('Error loading destination content for Arugam Bay:', error);
      }
    };

    loadContent();
  }, []);

  const getIconComponent = (iconName: string) => {
    const iconMap: { [key: string]: any } = {
      Waves,
      Anchor,
      Sunrise,
      Fish,
      Utensils,
      Camera,
      Wind,
      Sun,
      TreePalm,
    };

    return iconMap[iconName] || Waves;
  };

  const tabs = [
    { id: 'attractions', label: 'Attractions', count: attractions.length },
    { id: 'activities', label: 'Activities', count: activities.length },
    { id: 'surfing', label: 'Surf Spots', count: surfSpots.length },
    { id: 'accommodation', label: 'Stay', count: accommodations.length },
    { id: 'dining', label: 'Dining', count: restaurants.length },
    { id: 'info', label: 'Travel Info', count: null }
  ];

  return (
    <>
      <Helmet>
        <title>Arugam Bay - Surfing Paradise & Beach Haven | Recharge Travels</title>
        <meta name="description" content="Discover Arugam Bay, Sri Lanka's premier surfing destination with world-class waves, pristine beaches, vibrant nightlife, and laid-back atmosphere. Plan your surf adventure with Recharge Travels." />
        <meta name="keywords" content="Arugam Bay Sri Lanka, surfing Sri Lanka, Main Point, Whiskey Point, beach holiday, surf lessons, Pottuvil Lagoon, Panama Beach, surf camps" />
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
                  className="bg-cyan-600 hover:bg-cyan-700 text-white px-8 py-6 text-lg"
                  onClick={() => setShowBookingModal(true)}
                >
                  Plan Your Surf Adventure
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
        <div className="bg-cyan-700 text-white py-4">
          <div className="container mx-auto px-4">
            <div className="flex flex-wrap justify-center items-center gap-8 text-sm">
              <div className="flex items-center gap-2">
                <Waves className="w-4 h-4" />
                <span>Surf Season: Apr-Oct</span>
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
                      ? 'border-cyan-600 text-cyan-600'
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
                        className="w-full bg-cyan-600 hover:bg-cyan-700"
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
                          <div className="p-3 bg-cyan-100 rounded-lg mr-4">
                            <activity.icon className="w-6 h-6 text-cyan-600" />
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
                        <span className="text-lg font-semibold text-cyan-600">{activity.price}</span>
                        <span className="text-sm text-muted-foreground">{activity.duration}</span>
                      </div>
                      <Button 
                        variant="outline" 
                        className="w-full hover:bg-cyan-600 hover:text-white"
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

            {/* Surfing Tab */}
            {selectedTab === 'surfing' && (
              <motion.div
                key="surfing"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="space-y-6"
              >
                <Card className="mb-6 bg-gradient-to-r from-cyan-50 to-blue-50">
                  <CardHeader>
                    <CardTitle className="flex items-center text-2xl">
                      <Waves className="w-6 h-6 mr-3 text-cyan-600" />
                      Surf Season Information
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-lg mb-4">
                      Arugam Bay's surf season runs from April to October when the southwest monsoon creates perfect conditions on the east coast.
                    </p>
                    <div className="grid md:grid-cols-3 gap-4">
                      <div className="text-center p-4 bg-white rounded-lg">
                        <h4 className="font-semibold mb-2">Peak Season</h4>
                        <p className="text-cyan-600 font-bold">June - August</p>
                      </div>
                      <div className="text-center p-4 bg-white rounded-lg">
                        <h4 className="font-semibold mb-2">Wave Height</h4>
                        <p className="text-cyan-600 font-bold">3-6 feet</p>
                      </div>
                      <div className="text-center p-4 bg-white rounded-lg">
                        <h4 className="font-semibold mb-2">Water Temp</h4>
                        <p className="text-cyan-600 font-bold">28-30°C</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {surfSpots.map((spot, index) => (
                  <Card key={index} className="hover:shadow-lg transition-shadow">
                    <CardContent className="p-6">
                      <div className="flex items-start">
                        <div className="p-3 bg-cyan-100 rounded-lg mr-4">
                          <Waves className="w-6 h-6 text-cyan-600" />
                        </div>
                        <div className="flex-1">
                          <h3 className="text-xl font-semibold mb-2">{spot.name}</h3>
                          <div className="grid md:grid-cols-2 gap-4 mt-3">
                            <div>
                              <p className="text-sm text-muted-foreground">Skill Level</p>
                              <p className="font-medium">{spot.level}</p>
                            </div>
                            <div>
                              <p className="text-sm text-muted-foreground">Wave Type</p>
                              <p className="font-medium">{spot.waveType}</p>
                            </div>
                            <div>
                              <p className="text-sm text-muted-foreground">Best Time</p>
                              <p className="font-medium">{spot.bestTime}</p>
                            </div>
                            <div>
                              <p className="text-sm text-muted-foreground">Crowd Level</p>
                              <Badge variant={spot.crowdLevel === 'Low' ? 'default' : spot.crowdLevel === 'Medium' ? 'secondary' : 'destructive'}>
                                {spot.crowdLevel}
                              </Badge>
                            </div>
                          </div>
                          <Button 
                            className="mt-4 bg-cyan-600 hover:bg-cyan-700"
                            onClick={() => {
                              setSelectedAttraction(`Surfing at ${spot.name}`);
                              setShowBookingModal(true);
                            }}
                          >
                            Book Surf Session
                          </Button>
                        </div>
                      </div>
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
                            <Home className="w-5 h-5 mr-2 text-cyan-600" />
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
                          <p className="text-2xl font-bold text-cyan-600">{hotel.price}</p>
                          <p className="text-sm text-muted-foreground">per night</p>
                          <Button 
                            className="mt-4 bg-cyan-600 hover:bg-cyan-700"
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
                        <div className="p-3 bg-cyan-100 rounded-lg mr-4">
                          <Utensils className="w-6 h-6 text-cyan-600" />
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
                        <p className="text-sm text-muted-foreground">Surf Season</p>
                        <p className="font-semibold">{weatherInfo.season}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Rainfall</p>
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
                      <p className="text-sm text-muted-foreground">Bus: 7-8 hours | Car: 6 hours | Flight + Car: 2 hours</p>
                    </div>
                    <div>
                      <p className="font-semibold">From Ella</p>
                      <p className="text-sm text-muted-foreground">Bus: 3-4 hours | Car: 2.5 hours</p>
                    </div>
                    <div>
                      <p className="font-semibold">From Yala</p>
                      <p className="text-sm text-muted-foreground">Car: 1.5 hours</p>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Activity className="w-5 h-5 mr-2" />
                      Essential Tips
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2 text-sm">
                      <li>• Best surf conditions early morning (6-9 AM)</li>
                      <li>• Reef booties recommended for some spots</li>
                      <li>• Respect local surf etiquette</li>
                      <li>• Sun protection essential - strong UV</li>
                      <li>• Cash preferred - limited ATMs</li>
                      <li>• Book accommodation early in peak season</li>
                      <li>• Try local seafood - fresh daily catch</li>
                    </ul>
                  </CardContent>
                </Card>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Call to Action Section */}
        <div className="bg-gradient-to-r from-cyan-600 to-blue-600 text-white py-16">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              {ctaSection.title}
            </h2>
            <p className="text-xl mb-8 max-w-2xl mx-auto">
              {ctaSection.subtitle}
            </p>
            <Button 
              size="lg" 
              className="bg-white text-cyan-600 hover:bg-gray-100"
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

export default ArugamBay;