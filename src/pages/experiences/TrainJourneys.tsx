import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Train,
  Mountain,
  Camera,
  Clock,
  MapPin,
  Calendar,
  Star,
  Users,
  Ticket,
  Map,
  Coffee,
  Eye,
  Sunrise,
  Cloud,
  TreePine,
  ChevronDown,
  CheckCircle,
  Info,
  DollarSign,
  Wifi,
  Package,
  AlertCircle,
  ChevronRight,
  Globe,
  Phone,
  Mail,
  Navigation
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import EnhancedBookingModal from '@/components/EnhancedBookingModal';
import { doc, getDoc, onSnapshot } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { toast } from 'sonner';

interface RouteInfo {
  name: string;
  description: string;
  duration: string;
  distance: string;
  highlights: string[];
  bestTime: string;
  price: string;
  difficulty: 'Easy' | 'Moderate' | 'Challenging';
}

interface TrainClass {
  name: string;
  description: string;
  price: string;
  features: string[];
  icon: React.FC<any>;
}

interface TourPackage {
  name: string;
  duration: string;
  price: string;
  highlights: string[];
  included: string[];
  icon: React.FC<any>;
}

const TrainJourneys = () => {
  const [activeTab, setActiveTab] = useState('routes');
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [selectedPackage, setSelectedPackage] = useState<string | null>(null);
  const [heroImageIndex, setHeroImageIndex] = useState(0);

  const heroImages = [
    {
      url: 'https://images.unsplash.com/photo-1564769610726-63c0b4b07b27?w=1920&h=1080&fit=crop',
      caption: 'Nine Arch Bridge - Ella'
    },
    {
      url: 'https://images.unsplash.com/photo-1589456506629-b2ea1a8576fb?w=1920&h=1080&fit=crop',
      caption: 'Tea Plantations Journey'
    },
    {
      url: 'https://images.unsplash.com/photo-1609924211018-ba526e55e6e0?w=1920&h=1080&fit=crop',
      caption: 'Hill Country Rails'
    },
    {
      url: 'https://images.unsplash.com/photo-1566396386016-244e66a09199?w=1920&h=1080&fit=crop',
      caption: 'Observation Car Views'
    }
  ];

  const routes: RouteInfo[] = [
    {
      name: "Kandy to Ella",
      description: "The most famous train journey in Sri Lanka, passing through misty mountains, tea plantations, and waterfalls.",
      duration: "6-7 hours",
      distance: "140 km",
      highlights: ["Nine Arch Bridge", "Demodara Loop", "Tea Estates", "Waterfalls"],
      bestTime: "Morning departure for best views",
      price: "From $3-$50",
      difficulty: "Easy"
    },
    {
      name: "Colombo to Badulla",
      description: "The complete hill country railway experience, from coastal plains to the highest railway station.",
      duration: "9-10 hours",
      distance: "290 km",
      highlights: ["Complete Hill Country Route", "Diverse Landscapes", "Colonial Stations", "Local Life"],
      bestTime: "Early morning start",
      price: "From $5-$60",
      difficulty: "Moderate"
    },
    {
      name: "Ella to Haputale",
      description: "Short but spectacular journey through tea country with stunning valley views.",
      duration: "2 hours",
      distance: "45 km",
      highlights: ["Ella Gap Views", "Tea Factory Tours", "Lipton's Seat Access", "Mountain Scenery"],
      bestTime: "Morning for clear views",
      price: "From $1-$15",
      difficulty: "Easy"
    },
    {
      name: "Kandy to Nuwara Eliya",
      description: "Journey to Sri Lanka's 'Little England' through breathtaking highland scenery.",
      duration: "4 hours",
      distance: "80 km",
      highlights: ["Ramboda Falls View", "Tea Country", "Colonial Architecture", "Cool Climate"],
      bestTime: "Mid-morning departure",
      price: "From $2-$30",
      difficulty: "Easy"
    }
  ];

  const trainClasses: TrainClass[] = [
    {
      name: "Observation Car",
      description: "Premium glass-walled carriages with panoramic views and comfortable seating.",
      price: "$50-$60",
      features: ["Large windows", "Air conditioning", "Reserved seating", "Best photo opportunities"],
      icon: Eye
    },
    {
      name: "First Class",
      description: "Comfortable reserved seats with good views and fan cooling.",
      price: "$15-$25",
      features: ["Reserved seats", "Fan cooling", "Good legroom", "Window seats available"],
      icon: Star
    },
    {
      name: "Second Class",
      description: "Reserved seating with basic comfort and local atmosphere.",
      price: "$5-$10",
      features: ["Reserved seats", "Natural ventilation", "Local experience", "Budget-friendly"],
      icon: Users
    },
    {
      name: "Third Class",
      description: "Unreserved seating offering authentic local travel experience.",
      price: "$1-$3",
      features: ["Unreserved seats", "Most authentic", "Very affordable", "Flexible travel"],
      icon: Train
    }
  ];

  const tourPackages: TourPackage[] = [
    {
      name: "Scenic Rail & Chauffeur Combo",
      duration: "2 Days",
      price: "$180",
      highlights: [
        "Train ride Kandy to Ella",
        "Private car pickup/drop-off",
        "Hotel arrangements",
        "Photo stops included"
      ],
      included: [
        "Observation car tickets",
        "Professional driver",
        "Hotel bookings",
        "Station transfers",
        "Refreshments"
      ],
      icon: Package
    },
    {
      name: "Luxury Rail Experience",
      duration: "1 Day",
      price: "$120",
      highlights: [
        "First-class reserved seats",
        "Gourmet packed lunch",
        "Station lounge access",
        "Photography guide"
      ],
      included: [
        "Premium train tickets",
        "Meals and beverages",
        "VIP lounge access",
        "Souvenir package",
        "Insurance"
      ],
      icon: Star
    },
    {
      name: "Hill Country Rail Adventure",
      duration: "3 Days",
      price: "$350",
      highlights: [
        "Multiple train journeys",
        "Tea factory visits",
        "Nine Arch Bridge tour",
        "Ella activities"
      ],
      included: [
        "All train tickets",
        "Accommodation",
        "Guided tours",
        "All meals",
        "Transfers"
      ],
      icon: Mountain
    }
  ];

  const bookingTips = [
    {
      title: "Advance Booking",
      description: "Book observation car and first-class tickets at least 30 days in advance",
      icon: Calendar
    },
    {
      title: "Best Seats",
      description: "Right side seats offer better views on Kandy-Ella route",
      icon: Eye
    },
    {
      title: "Photography",
      description: "Keep camera ready - views change quickly around curves",
      icon: Camera
    },
    {
      title: "Comfort Items",
      description: "Bring snacks, water, and a light jacket for hill country",
      icon: Coffee
    }
  ];

  const faqs = [
    {
      question: "How do I book train tickets in advance?",
      answer: "Tickets can be booked online through Sri Lanka Railways website, at railway stations, or through our tour packages. Observation car tickets must be booked 30-45 days in advance due to high demand."
    },
    {
      question: "Which side of the train has better views?",
      answer: "On the Kandy to Ella route, the right side generally offers better views of tea plantations and valleys. However, both sides have spectacular scenery, and views alternate throughout the journey."
    },
    {
      question: "Can I take photos from the train doors?",
      answer: "Yes, the train doors often remain open, allowing for dramatic photos. Exercise extreme caution, hold on firmly, and never lean too far out. This is at your own risk."
    },
    {
      question: "What's the difference between train classes?",
      answer: "Observation cars have large windows and AC, First Class has reserved seats with fans, Second Class has reserved seats without fans, and Third Class is unreserved seating. All classes travel on the same scenic route."
    },
    {
      question: "Are trains punctual?",
      answer: "Trains can experience delays, especially during peak season. Plan flexible schedules and don't book tight connections. Delays are part of the adventure!"
    },
    {
      question: "What should I bring on the train journey?",
      answer: "Bring water, snacks, camera, power bank, light jacket (for hill country), hand sanitizer, and small bills for vendors. Pack light as storage space is limited."
    }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setHeroImageIndex((prev) => (prev + 1) % heroImages.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const handleBookingClick = (packageName?: string) => {
    setSelectedPackage(packageName || null);
    setIsBookingModalOpen(true);
  };

  return (
    <>
      <Helmet>
        <title>Scenic Train Rides Sri Lanka | Railway Tours & Tickets | Recharge Travels</title>
        <meta name="description" content="Discover Sri Lanka's most scenic train journeys, including the iconic Kandy to Ella route. Book rail experiences and tours with Recharge Travels." />
        <meta name="keywords" content="scenic train rides Sri Lanka, Kandy to Ella train, Sri Lanka railway tours, Nine Arch Bridge, observation car tickets, hill country train journey" />
        <meta property="og:title" content="Scenic Train Rides - Experience Sri Lanka's Railway Paradise" />
        <meta property="og:description" content="Journey through tea plantations, misty mountains, and colonial bridges on Sri Lanka's world-famous scenic train routes." />
        <meta property="og:image" content="https://images.unsplash.com/photo-1564769610726-63c0b4b07b27?w=1200&h=630&fit=crop" />
        <link rel="canonical" href="https://www.rechargetravels.com/experiences/train-journeys" />
      </Helmet>

      <Header />

      {/* Hero Section */}
      <section className="relative h-[70vh] min-h-[600px] w-full overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.div
            key={heroImageIndex}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1 }}
            className="absolute inset-0"
          >
            <img
              src={heroImages[heroImageIndex].url}
              alt={heroImages[heroImageIndex].caption}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/40 to-black/20" />
          </motion.div>
        </AnimatePresence>

        <div className="absolute inset-0 flex items-center justify-center z-10">
          <div className="text-center text-white px-4 max-w-5xl">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <h1 className="text-5xl md:text-7xl font-bold mb-6 drop-shadow-lg">
                Ride the Rails of Paradise
              </h1>
              <p className="text-xl md:text-2xl mb-8 font-light drop-shadow">
                Sri Lanka's Iconic Train Routes Through Misty Hills & Tea Plantations
              </p>
              <Button
                onClick={() => handleBookingClick()}
                size="lg"
                className="bg-emerald-600 hover:bg-emerald-700 text-white px-8 py-6 text-lg rounded-full 
                         transform hover:scale-105 transition-all duration-300 shadow-xl"
              >
                <Train className="mr-2 h-5 w-5" />
                Book Your Journey
              </Button>
            </motion.div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 1.5, repeat: Infinity }}
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2 text-white z-10"
        >
          <ChevronDown className="h-8 w-8" />
        </motion.div>
      </section>

      {/* Overview Section */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl font-bold mb-6">Experience One of the World's Most Beautiful Train Rides</h2>
            <p className="text-xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
              Experience one of the most beautiful train rides in the world, winding through misty hills, 
              lush forests, and tea plantations. Sri Lanka's scenic train journeys are an unforgettable 
              way to explore the island's spectacular highland scenery and colonial heritage.
            </p>
          </motion.div>

          {/* Quick Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12">
            {[
              { icon: Train, label: "Active Routes", value: "10+" },
              { icon: Mountain, label: "Iconic Bridges", value: "50+" },
              { icon: Mountain, label: "Elevation", value: "1,900m" },
              { icon: Camera, label: "Photo Spots", value: "100+" }
            ].map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="text-center"
              >
                <stat.icon className="h-12 w-12 text-emerald-600 mx-auto mb-3" />
                <div className="text-3xl font-bold text-gray-800">{stat.value}</div>
                <div className="text-gray-600">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Main Content Tabs */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-4 mb-8">
              <TabsTrigger value="routes">Popular Routes</TabsTrigger>
              <TabsTrigger value="classes">Train Classes</TabsTrigger>
              <TabsTrigger value="packages">Tour Packages</TabsTrigger>
              <TabsTrigger value="tips">Travel Tips</TabsTrigger>
            </TabsList>

            {/* Routes Tab */}
            <TabsContent value="routes" className="space-y-6">
              <h3 className="text-2xl font-bold mb-6">Iconic Railway Routes</h3>
              <div className="grid md:grid-cols-2 gap-6">
                {routes.map((route, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Card className="h-full hover:shadow-lg transition-shadow">
                      <CardHeader>
                        <div className="flex justify-between items-start mb-2">
                          <CardTitle className="text-xl">{route.name}</CardTitle>
                          <Badge variant={route.difficulty === 'Easy' ? 'default' : 'secondary'}>
                            {route.difficulty}
                          </Badge>
                        </div>
                        <p className="text-gray-600">{route.description}</p>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div className="flex items-center">
                            <Clock className="h-4 w-4 mr-2 text-gray-500" />
                            <span>{route.duration}</span>
                          </div>
                          <div className="flex items-center">
                            <MapPin className="h-4 w-4 mr-2 text-gray-500" />
                            <span>{route.distance}</span>
                          </div>
                          <div className="flex items-center">
                            <DollarSign className="h-4 w-4 mr-2 text-gray-500" />
                            <span>{route.price}</span>
                          </div>
                          <div className="flex items-center">
                            <Sunrise className="h-4 w-4 mr-2 text-gray-500" />
                            <span>{route.bestTime}</span>
                          </div>
                        </div>
                        <div>
                          <h4 className="font-semibold mb-2">Highlights:</h4>
                          <div className="flex flex-wrap gap-2">
                            {route.highlights.map((highlight, idx) => (
                              <Badge key={idx} variant="outline">
                                {highlight}
                              </Badge>
                            ))}
                          </div>
                        </div>
                        <Button 
                          className="w-full"
                          onClick={() => handleBookingClick(`${route.name} Journey`)}
                        >
                          Book This Route
                        </Button>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </TabsContent>

            {/* Train Classes Tab */}
            <TabsContent value="classes" className="space-y-6">
              <h3 className="text-2xl font-bold mb-6">Choose Your Train Class</h3>
              <div className="grid md:grid-cols-2 gap-6">
                {trainClasses.map((trainClass, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Card className="h-full hover:shadow-lg transition-shadow">
                      <CardHeader>
                        <div className="flex items-center mb-3">
                          <trainClass.icon className="h-8 w-8 text-emerald-600 mr-3" />
                          <div>
                            <CardTitle>{trainClass.name}</CardTitle>
                            <p className="text-lg font-semibold text-emerald-600">{trainClass.price}</p>
                          </div>
                        </div>
                        <p className="text-gray-600">{trainClass.description}</p>
                      </CardHeader>
                      <CardContent>
                        <h4 className="font-semibold mb-3">Features:</h4>
                        <ul className="space-y-2">
                          {trainClass.features.map((feature, idx) => (
                            <li key={idx} className="flex items-center">
                              <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                              <span className="text-gray-700">{feature}</span>
                            </li>
                          ))}
                        </ul>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </TabsContent>

            {/* Tour Packages Tab */}
            <TabsContent value="packages" className="space-y-6">
              <h3 className="text-2xl font-bold mb-6">Curated Rail Experiences</h3>
              <div className="grid lg:grid-cols-3 gap-6">
                {tourPackages.map((pkg, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, scale: 0.95 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Card className="h-full hover:shadow-xl transition-shadow">
                      <CardHeader>
                        <div className="flex items-center justify-between mb-3">
                          <pkg.icon className="h-10 w-10 text-emerald-600" />
                          <Badge className="bg-emerald-600">{pkg.duration}</Badge>
                        </div>
                        <CardTitle className="text-xl">{pkg.name}</CardTitle>
                        <p className="text-2xl font-bold text-emerald-600">From {pkg.price}</p>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div>
                          <h4 className="font-semibold mb-2">Highlights:</h4>
                          <ul className="space-y-1 text-sm">
                            {pkg.highlights.map((highlight, idx) => (
                              <li key={idx} className="flex items-start">
                                <ChevronRight className="h-4 w-4 text-emerald-600 mr-1 mt-0.5 flex-shrink-0" />
                                <span>{highlight}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                        <div>
                          <h4 className="font-semibold mb-2">Included:</h4>
                          <ul className="space-y-1 text-sm">
                            {pkg.included.map((item, idx) => (
                              <li key={idx} className="flex items-center">
                                <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                                <span>{item}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                        <Button 
                          className="w-full bg-emerald-600 hover:bg-emerald-700"
                          onClick={() => handleBookingClick(pkg.name)}
                        >
                          Book Package
                        </Button>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </TabsContent>

            {/* Travel Tips Tab */}
            <TabsContent value="tips" className="space-y-6">
              <h3 className="text-2xl font-bold mb-6">Essential Travel Tips</h3>
              <div className="grid md:grid-cols-2 gap-6 mb-8">
                {bookingTips.map((tip, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Card>
                      <CardHeader>
                        <div className="flex items-center">
                          <tip.icon className="h-8 w-8 text-emerald-600 mr-3" />
                          <CardTitle className="text-lg">{tip.title}</CardTitle>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <p className="text-gray-600">{tip.description}</p>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>

              {/* Additional Tips */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-xl">What to Bring</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-3 gap-4">
                    <div>
                      <h4 className="font-semibold mb-2">Essentials</h4>
                      <ul className="space-y-1 text-sm text-gray-600">
                        <li>• Valid tickets/booking confirmation</li>
                        <li>• Passport/ID</li>
                        <li>• Cash in small bills</li>
                        <li>• Mobile phone charged</li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-2">Comfort Items</h4>
                      <ul className="space-y-1 text-sm text-gray-600">
                        <li>• Light jacket/shawl</li>
                        <li>• Snacks and water</li>
                        <li>• Hand sanitizer</li>
                        <li>• Tissues/wet wipes</li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-2">Photography</h4>
                      <ul className="space-y-1 text-sm text-gray-600">
                        <li>• Camera with extra battery</li>
                        <li>• Memory cards</li>
                        <li>• Lens cleaning cloth</li>
                        <li>• Protective bag</li>
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </section>

      {/* Highlights Section */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">Journey Highlights</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                title: "Nine Arch Bridge",
                description: "Iconic colonial-era viaduct surrounded by lush jungle",
                icon: Navigation,
                image: "https://images.unsplash.com/photo-1564769610726-63c0b4b07b27?w=500&h=300&fit=crop"
              },
              {
                title: "Tea Plantations",
                description: "Endless rolling hills covered in emerald tea bushes",
                icon: TreePine,
                image: "https://images.unsplash.com/photo-1606820846835-91e342c0e5a0?w=500&h=300&fit=crop"
              },
              {
                title: "Ella Rock Views",
                description: "Dramatic cliff-edge vistas and morning mists",
                icon: Mountain,
                image: "https://images.unsplash.com/photo-1588584922681-745a2223f72a?w=500&h=300&fit=crop"
              },
              {
                title: "Local Life",
                description: "Authentic glimpses of village life along the tracks",
                icon: Users,
                image: "https://images.unsplash.com/photo-1602216056096-3b40cc63dc26?w=500&h=300&fit=crop"
              }
            ].map((highlight, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="group cursor-pointer"
              >
                <div className="relative overflow-hidden rounded-lg mb-4">
                  <img
                    src={highlight.image}
                    alt={highlight.title}
                    className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  <highlight.icon className="absolute bottom-4 left-4 h-8 w-8 text-white" />
                </div>
                <h3 className="font-semibold text-lg mb-2">{highlight.title}</h3>
                <p className="text-gray-600 text-sm">{highlight.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Photo Gallery */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">Journey Through Our Lens</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {[
              "https://images.unsplash.com/photo-1609924211018-ba526e55e6e0?w=400&h=300&fit=crop",
              "https://images.unsplash.com/photo-1566396386016-244e66a09199?w=400&h=300&fit=crop",
              "https://images.unsplash.com/photo-1589456506629-b2ea1a8576fb?w=400&h=300&fit=crop",
              "https://images.unsplash.com/photo-1588584922681-745a2223f72a?w=400&h=300&fit=crop",
              "https://images.unsplash.com/photo-1606820846835-91e342c0e5a0?w=400&h=300&fit=crop",
              "https://images.unsplash.com/photo-1602216056096-3b40cc63dc26?w=400&h=300&fit=crop",
              "https://images.unsplash.com/photo-1564769625905-50e93615e769?w=400&h=300&fit=crop",
              "https://images.unsplash.com/photo-1566489549387-a3bb095f7e62?w=400&h=300&fit=crop"
            ].map((image, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.05 }}
                className="relative overflow-hidden rounded-lg group cursor-pointer"
              >
                <img
                  src={image}
                  alt={`Train journey ${index + 1}`}
                  className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300" />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQs Section */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">Frequently Asked Questions</h2>
          <Accordion type="single" collapsible className="space-y-4">
            {faqs.map((faq, index) => (
              <AccordionItem key={index} value={`item-${index}`}>
                <AccordionTrigger className="text-left hover:text-emerald-600">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-gray-600">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-gradient-to-br from-emerald-600 to-teal-700">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl font-bold mb-6 text-white">
              Ready to Embark on Your Rail Adventure?
            </h2>
            <p className="text-xl mb-8 text-white/90">
              Don't miss out on one of the world's most scenic train journeys. 
              Book your tickets now and create memories that last a lifetime.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                size="lg"
                className="bg-white text-emerald-700 hover:bg-gray-100 px-8 py-6 text-lg"
                onClick={() => handleBookingClick()}
              >
                <Ticket className="mr-2 h-5 w-5" />
                Book Train Tickets
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-white text-white hover:bg-white/10 px-8 py-6 text-lg"
                onClick={() => window.location.href = 'tel:+94765059595'}
              >
                <Phone className="mr-2 h-5 w-5" />
                Call for Assistance
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Contact Info */}
      <section className="py-12 px-4 bg-gray-900 text-white">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-3 gap-8 text-center">
            <div className="flex flex-col items-center">
              <Phone className="h-8 w-8 mb-3 text-emerald-400" />
              <h3 className="font-semibold mb-2">Call Us</h3>
              <p className="text-gray-300">+94 76 505 9595</p>
              <p className="text-sm text-gray-400">Available 24/7</p>
            </div>
            <div className="flex flex-col items-center">
              <Mail className="h-8 w-8 mb-3 text-emerald-400" />
              <h3 className="font-semibold mb-2">Email Us</h3>
              <p className="text-gray-300">info@rechargetravels.com</p>
              <p className="text-sm text-gray-400">Quick response</p>
            </div>
            <div className="flex flex-col items-center">
              <Globe className="h-8 w-8 mb-3 text-emerald-400" />
              <h3 className="font-semibold mb-2">Visit Website</h3>
              <p className="text-gray-300">www.rechargetravels.com</p>
              <p className="text-sm text-gray-400">More experiences</p>
            </div>
          </div>
        </div>
      </section>

      <Footer />

      {/* Booking Modal */}
      <EnhancedBookingModal
        isOpen={isBookingModalOpen}
        onClose={() => {
          setIsBookingModalOpen(false);
          setSelectedPackage(null);
        }}
        type="tour"
        itemTitle={selectedPackage || "Scenic Train Journey"}
      />
    </>
  );
};

export default TrainJourneys;