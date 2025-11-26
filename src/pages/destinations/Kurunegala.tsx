import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
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
  Building,
  ShoppingBag,
  TreePine,
  Sparkles,
  Eye,
  Compass
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

const Kurunegala = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [selectedTab, setSelectedTab] = useState('attractions');
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [selectedAttraction, setSelectedAttraction] = useState<string>('');

  const [heroSlides, setHeroSlides] = useState<HeroSlide[]>([
    {
      image: "https://images.unsplash.com/photo-1580541832626-2a7131ee809f?auto=format&fit=crop&q=80",
      title: "Discover Kurunegala",
      subtitle: "Gateway to the Cultural Triangle"
    },
    {
      image: "https://images.unsplash.com/photo-1588982832579-86f4a0ce272e?auto=format&fit=crop&q=80",
      title: "Majestic Elephant Rock",
      subtitle: "Climb the Iconic Ethagala"
    },
    {
      image: "https://images.unsplash.com/photo-1606142113105-58b79af5de72?auto=format&fit=crop&q=80",
      title: "Central Crossroads",
      subtitle: "Where History Meets Adventure"
    }
  ]);

  const [attractions, setAttractions] = useState<Attraction[]>([
    {
      name: "Elephant Rock (Ethagala)",
      description: "Massive rock formation resembling an elephant, offering panoramic views of the city after a moderate climb with ancient Buddha statue at summit",
      image: "https://images.unsplash.com/photo-1580398033920-f03c87fa9d2e?auto=format&fit=crop&q=80",
      category: "Natural Landmarks",
      rating: 4.9,
      duration: "2-3 hours",
      price: "Free"
    },
    {
      name: "Ridi Viharaya (Silver Temple)",
      description: "Ancient cave temple complex dating back to 2nd century BC, famous for its silver-plated doors and beautiful cave paintings",
      image: "https://images.unsplash.com/photo-1611510338559-2f463335092c?auto=format&fit=crop&q=80",
      category: "Religious Sites",
      rating: 4.7,
      duration: "1-2 hours",
      price: "$3"
    },
    {
      name: "Kurunegala Lake",
      description: "Scenic man-made lake in the city center, perfect for evening walks and boat rides with views of surrounding rock formations",
      image: "https://images.unsplash.com/photo-1570288685369-f7305163d0e3?auto=format&fit=crop&q=80",
      category: "Nature & Lakes",
      rating: 4.5,
      duration: "1-2 hours",
      price: "Free"
    },
    {
      name: "Athugala Buddha Statue",
      description: "Giant standing Buddha statue carved into the rock face, visible from across the city and offering stunning sunset views",
      image: "https://images.unsplash.com/photo-1605648183612-2de8fa332610?auto=format&fit=crop&q=80",
      category: "Religious Sites",
      rating: 4.6,
      duration: "1 hour",
      price: "Free"
    },
    {
      name: "Yapahuwa Rock Fortress",
      description: "13th-century rock fortress and former capital, featuring ornate stone carvings and steep stairway to ancient palace ruins",
      image: "https://images.unsplash.com/photo-1624382651814-6457b4aebaec?auto=format&fit=crop&q=80",
      category: "Historical Sites",
      rating: 4.8,
      duration: "3-4 hours",
      price: "$5"
    },
    {
      name: "Panduwasnuwara",
      description: "Ancient ruined city with well-preserved palace complex, moonstones, and archaeological remains from 12th century",
      image: "https://images.unsplash.com/photo-1599661046289-e31897846d41?auto=format&fit=crop&q=80",
      category: "Archaeological Sites",
      rating: 4.5,
      duration: "2 hours",
      price: "$3"
    }
  ]);

  const [activities, setActivities] = useState<Activity[]>([
    {
      name: "Elephant Rock Sunrise Hike",
      description: "Early morning climb to catch breathtaking sunrise views",
      icon: Mountain,
      price: "From $25",
      duration: "3 hours",
      popular: true
    },
    {
      name: "Cultural Triangle Tour",
      description: "Day trip to nearby ancient cities and temples",
      icon: Crown,
      price: "From $60",
      duration: "Full Day"
    },
    {
      name: "Rock Fortress Circuit",
      description: "Visit multiple ancient rock fortresses in the region",
      icon: Compass,
      price: "From $45",
      duration: "Full Day"
    },
    {
      name: "Photography Workshop",
      description: "Capture landscapes and ancient architecture",
      icon: Camera,
      price: "From $40",
      duration: "Half Day"
    },
    {
      name: "Temple Heritage Walk",
      description: "Explore ancient temples with expert guides",
      icon: Building,
      price: "From $30",
      duration: "4 hours"
    },
    {
      name: "Scenic Viewpoint Tour",
      description: "Visit all major rock formations and viewpoints",
      icon: Eye,
      price: "From $35",
      duration: "Half Day"
    }
  ]);

  const [destinationInfo, setDestinationInfo] = useState<DestinationInfo>({
    population: "122,000",
    area: "1,611 km²",
    elevation: "116 m",
    bestTime: "January to April",
    language: "Sinhala, Tamil, English",
    currency: "Sri Lankan Rupee (LKR)"
  });

  const [weatherInfo] = useState({
    temperature: "22-32°C",
    humidity: "70-85%",
    rainfall: "Moderate",
    season: "Tropical Climate"
  });

  // Load content from Firebase
  useEffect(() => {
    const loadContent = async () => {
      try {
        const docRef = doc(db, 'destinations', 'kurunegala');
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
      'Mountain': Mountain,
      'Crown': Crown,
      'Compass': Compass,
      'Camera': Camera,
      'Building': Building,
      'Eye': Eye,
      'Navigation': Navigation
    };
    return iconMap[iconName] || Mountain;
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
        <title>Kurunegala - Elephant Rock & Cultural Triangle Gateway | Sri Lanka Travel Guide</title>
        <meta name="description" content="Climb Elephant Rock, explore ancient temples, and use Kurunegala as your base for Cultural Triangle adventures. Discover this central Sri Lankan hub." />
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
              <h2 className="text-3xl font-bold mb-8">Top Attractions in Kurunegala</h2>
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
              <h2 className="text-3xl font-bold mb-8">Things to Do in Kurunegala</h2>
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
              <p className="text-gray-600">We're working on bringing you the best hotel recommendations in Kurunegala</p>
            </div>
          )}

          {/* Restaurants Tab */}
          {selectedTab === 'restaurants' && (
            <div className="text-center py-12">
              <Utensils className="w-16 h-16 mx-auto mb-4 text-gray-400" />
              <h3 className="text-xl font-semibold mb-2">Restaurants Coming Soon</h3>
              <p className="text-gray-600">Discover the best dining experiences in Kurunegala</p>
            </div>
          )}

          {/* Weather Tab */}
          {selectedTab === 'weather' && (
            <div>
              <h2 className="text-3xl font-bold mb-8">Weather in Kurunegala</h2>
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                <Card>
                  <CardHeader>
                    <Sun className="w-8 h-8 text-orange-500 mb-2" />
                    <CardTitle>Temperature</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-2xl font-bold">{weatherInfo.temperature}</p>
                    <p className="text-gray-600">Pleasant climate</p>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <Cloud className="w-8 h-8 text-blue-500 mb-2" />
                    <CardTitle>Humidity</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-2xl font-bold">{weatherInfo.humidity}</p>
                    <p className="text-gray-600">Tropical levels</p>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <Cloud className="w-8 h-8 text-gray-500 mb-2" />
                    <CardTitle>Rainfall</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-2xl font-bold">{weatherInfo.rainfall}</p>
                    <p className="text-gray-600">Two monsoon seasons</p>
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
            <h2 className="text-3xl font-bold mb-8 text-center">Travel Tips for Kurunegala</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-4xl mx-auto">
              <Card>
                <CardHeader>
                  <Mountain className="w-8 h-8 text-amber-600 mb-2" />
                  <CardTitle>Elephant Rock Climb</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600">Start early morning to avoid heat. The climb takes 30-45 minutes. Wear comfortable shoes and bring water. The view is worth it!</p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <Compass className="w-8 h-8 text-amber-600 mb-2" />
                  <CardTitle>Cultural Triangle Base</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600">Kurunegala is perfectly located for day trips to Dambulla, Sigiriya, and Anuradhapura. Consider staying here for lower accommodation costs.</p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <Crown className="w-8 h-8 text-amber-600 mb-2" />
                  <CardTitle>Ancient Capitals</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600">Visit Yapahuwa and Panduwasnuwara early in the day. These lesser-known sites offer fascinating history without the crowds.</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="bg-gradient-to-r from-amber-600 to-orange-600 py-16">
          <div className="container mx-auto px-4 text-center text-white">
            <h2 className="text-4xl font-bold mb-4">Ready to Climb Elephant Rock?</h2>
            <p className="text-xl mb-8 max-w-2xl mx-auto">
              Experience stunning views, ancient temples, and use Kurunegala as your gateway to Sri Lanka's Cultural Triangle
            </p>
            <div className="flex gap-4 justify-center">
              <Button size="lg" variant="secondary" onClick={() => handleBookNow()}>
                Start Your Adventure
              </Button>
              <Button size="lg" variant="outline" className="bg-white/10 backdrop-blur-sm text-white border-white hover:bg-white/20">
                Plan Your Journey
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

export default Kurunegala;