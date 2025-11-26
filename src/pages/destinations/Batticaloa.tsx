import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Fish, 
  Waves, 
  Music, 
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
  Palmtree,
  Mountain,
  Sparkles,
  Sunrise
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import EnhancedBookingModal from '@/components/EnhancedBookingModal';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';

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

const Batticaloa = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [selectedTab, setSelectedTab] = useState('attractions');
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [selectedAttraction, setSelectedAttraction] = useState<string>('');

  const [heroSlides, setHeroSlides] = useState<HeroSlide[]>([
    {
      image: "https://images.unsplash.com/photo-1559494007-9f5847c49d94?auto=format&fit=crop&q=80",
      title: "Discover Batticaloa",
      subtitle: "Land of the Singing Fish"
    },
    {
      image: "https://images.unsplash.com/photo-1506929562872-bb421503ef21?auto=format&fit=crop&q=80",
      title: "Eastern Serenity",
      subtitle: "Pristine Beaches & Peaceful Lagoons"
    },
    {
      image: "https://images.unsplash.com/photo-1523712999610-f77fbcfc3843?auto=format&fit=crop&q=80",
      title: "Coastal Paradise",
      subtitle: "Where Culture Meets the Ocean"
    }
  ]);

  const [attractions, setAttractions] = useState<Attraction[]>([
    {
      name: "Batticaloa Lagoon",
      description: "Famous for the mysterious 'singing fish' phenomenon on full moon nights, best experienced from Kallady Bridge with local guides",
      image: "https://images.unsplash.com/photo-1559827260-dc66d52bef19?auto=format&fit=crop&q=80",
      category: "Natural Wonders",
      rating: 4.9,
      duration: "2-3 hours",
      price: "$10"
    },
    {
      name: "Passikudah Beach",
      description: "One of Sri Lanka's longest shallow coastlines, perfect for swimming with calm, crystal-clear waters stretching for kilometers",
      image: "https://images.unsplash.com/photo-1540541338287-41700207dee6?auto=format&fit=crop&q=80",
      category: "Beaches",
      rating: 4.8,
      duration: "Half Day",
      price: "Free"
    },
    {
      name: "Batticaloa Fort",
      description: "Dutch colonial fort built in 1628, surrounded by the lagoon on all four sides, offering insights into colonial history",
      image: "https://images.unsplash.com/photo-1584138868687-dc3e30ba8c52?auto=format&fit=crop&q=80",
      category: "Historical Sites",
      rating: 4.5,
      duration: "1 hour",
      price: "Free"
    },
    {
      name: "Kallady Beach",
      description: "Serene beach with golden sand and swaying palms, less crowded than Passikudah with excellent sunset views",
      image: "https://images.unsplash.com/photo-1519046904884-53103b34b206?auto=format&fit=crop&q=80",
      category: "Beaches",
      rating: 4.6,
      duration: "Half Day",
      price: "Free"
    },
    {
      name: "Lighthouse (Batticaloa)",
      description: "Historic lighthouse offering panoramic views of the lagoon, ocean, and surrounding landscapes, especially beautiful at sunset",
      image: "https://images.unsplash.com/photo-1533761816737-e7c6f54a43c6?auto=format&fit=crop&q=80",
      category: "Landmarks",
      rating: 4.7,
      duration: "1 hour",
      price: "$2"
    },
    {
      name: "St. Mary's Cathedral",
      description: "Beautiful Catholic cathedral with unique architecture, peaceful atmosphere, and historical significance to the local community",
      image: "https://images.unsplash.com/photo-1548625361-1cf0745e3502?auto=format&fit=crop&q=80",
      category: "Religious Sites",
      rating: 4.4,
      duration: "30 minutes",
      price: "Free"
    }
  ]);

  const [activities, setActivities] = useState<Activity[]>([
    {
      name: "Singing Fish Experience",
      description: "Night lagoon tour to hear the mysterious musical sounds",
      icon: Music,
      price: "From $30",
      duration: "2 hours",
      popular: true
    },
    {
      name: "Beach Hopping Tour",
      description: "Visit Passikudah, Kallady, and hidden beaches",
      icon: Palmtree,
      price: "From $40",
      duration: "Full Day"
    },
    {
      name: "Lagoon Boat Safari",
      description: "Explore mangroves and spot exotic birds",
      icon: Waves,
      price: "From $25",
      duration: "3 hours"
    },
    {
      name: "Sunrise Photography",
      description: "Capture stunning east coast sunrises",
      icon: Sunrise,
      price: "From $35",
      duration: "3 hours"
    },
    {
      name: "Traditional Fishing Tour",
      description: "Learn local fishing techniques with fishermen",
      icon: Fish,
      price: "From $30",
      duration: "Half Day"
    },
    {
      name: "Cultural Heritage Walk",
      description: "Explore fort, temples, and colonial architecture",
      icon: Building,
      price: "From $20",
      duration: "3 hours"
    }
  ]);

  const [destinationInfo, setDestinationInfo] = useState<DestinationInfo>({
    population: "92,000",
    area: "854 km²",
    elevation: "Sea level",
    bestTime: "May to September",
    language: "Tamil, Sinhala",
    currency: "Sri Lankan Rupee (LKR)"
  });

  const [weatherInfo] = useState({
    temperature: "25-32°C",
    humidity: "75-85%",
    rainfall: "Low-Moderate",
    season: "Tropical Coastal"
  });

  // Load content from Firebase
  useEffect(() => {
    const loadContent = async () => {
      try {
        const docRef = doc(db, 'destinations', 'batticaloa');
        const docSnap = await getDoc(docRef);
        
        if (docSnap.exists()) {
          const data = docSnap.data();
          if (data.heroSlides) setHeroSlides(data.heroSlides);
          if (data.attractions) setAttractions(data.attractions);
          if (data.activities) {
            setActivities(data.activities.map((activity: any) => ({
              ...activity,
              icon: getIconComponent(activity.icon)
            })));
          }
          if (data.destinationInfo) setDestinationInfo(data.destinationInfo);
        }
      } catch (error) {
        console.error('Error loading content:', error);
      }
    };

    loadContent();
  }, []);

  // Helper function to get icon component from string
  const getIconComponent = (iconName: string) => {
    const iconMap: { [key: string]: any } = {
      'Music': Music,
      'Palmtree': Palmtree,
      'Waves': Waves,
      'Sunrise': Sunrise,
      'Fish': Fish,
      'Building': Building,
      'Navigation': Navigation
    };
    return iconMap[iconName] || Music;
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
        <title>Batticaloa - Singing Fish Lagoon & Pristine East Coast Beaches | Sri Lanka</title>
        <meta name="description" content="Experience Batticaloa's mysterious singing fish, pristine Passikudah beach, peaceful lagoons, and authentic east coast culture in Sri Lanka." />
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
                <Button size="lg" variant="outline" className="bg-white/10 backdrop-blur-sm">
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
              <h2 className="text-3xl font-bold mb-8">Top Attractions in Batticaloa</h2>
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
              <h2 className="text-3xl font-bold mb-8">Things to Do in Batticaloa</h2>
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
            <div className="text-center py-12">
              <Hotel className="w-16 h-16 mx-auto mb-4 text-gray-400" />
              <h3 className="text-xl font-semibold mb-2">Hotels Coming Soon</h3>
              <p className="text-gray-600">We're working on bringing you the best hotel recommendations in Batticaloa</p>
            </div>
          )}

          {/* Restaurants Tab */}
          {selectedTab === 'restaurants' && (
            <div className="text-center py-12">
              <Utensils className="w-16 h-16 mx-auto mb-4 text-gray-400" />
              <h3 className="text-xl font-semibold mb-2">Restaurants Coming Soon</h3>
              <p className="text-gray-600">Discover the best dining experiences in Batticaloa</p>
            </div>
          )}

          {/* Weather Tab */}
          {selectedTab === 'weather' && (
            <div>
              <h2 className="text-3xl font-bold mb-8">Weather in Batticaloa</h2>
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
                    <p className="text-gray-600">Sea breeze comfort</p>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <Cloud className="w-8 h-8 text-gray-500 mb-2" />
                    <CardTitle>Rainfall</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-2xl font-bold">{weatherInfo.rainfall}</p>
                    <p className="text-gray-600">Nov-Jan monsoon</p>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <Calendar className="w-8 h-8 text-green-500 mb-2" />
                    <CardTitle>Best Time</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-2xl font-bold">{destinationInfo.bestTime}</p>
                    <p className="text-gray-600">Perfect beach weather</p>
                  </CardContent>
                </Card>
              </div>
            </div>
          )}
        </section>

        {/* Travel Tips Section */}
        <section className="bg-gray-50 py-12">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold mb-8 text-center">Travel Tips for Batticaloa</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-4xl mx-auto">
              <Card>
                <CardHeader>
                  <Music className="w-8 h-8 text-amber-600 mb-2" />
                  <CardTitle>Singing Fish Mystery</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600">Visit Kallady Bridge on full moon nights between April-September. The mysterious musical sounds are best heard around 8-10 PM.</p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <Palmtree className="w-8 h-8 text-amber-600 mb-2" />
                  <CardTitle>Beach Paradise</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600">Passikudah's shallow waters extend 150-200m from shore, making it perfect for families. Visit early morning for the calmest waters.</p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <Sunrise className="w-8 h-8 text-amber-600 mb-2" />
                  <CardTitle>East Coast Sunrises</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600">Batticaloa offers spectacular sunrises. Wake up early to witness the sun rising from the Indian Ocean - a photographer's dream!</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="bg-gradient-to-r from-amber-600 to-orange-600 py-16">
          <div className="container mx-auto px-4 text-center text-white">
            <h2 className="text-4xl font-bold mb-4">Ready for East Coast Tranquility?</h2>
            <p className="text-xl mb-8 max-w-2xl mx-auto">
              Experience the mysterious singing fish, pristine beaches, and peaceful charm of Batticaloa
            </p>
            <div className="flex gap-4 justify-center">
              <Button size="lg" variant="secondary" onClick={() => handleBookNow()}>
                Book Your Escape
              </Button>
              <Button size="lg" variant="outline" className="bg-white/10 backdrop-blur-sm text-white border-white hover:bg-white/20">
                Talk to Local Guide
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

export default Batticaloa;