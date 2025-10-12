import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Cloud,
  Mountain,
  Camera,
  Clock,
  MapPin,
  Calendar,
  Star,
  Users,
  Sunrise,
  Sun,
  Wind,
  Navigation,
  ChevronDown,
  CheckCircle,
  Info,
  DollarSign,
  Package,
  AlertCircle,
  ChevronRight,
  Globe,
  Phone,
  Mail,
  Shield,
  Award,
  Heart
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import EnhancedBookingModal from '@/components/EnhancedBookingModal';

interface FlightPackage {
  name: string;
  duration: string;
  price: string;
  highlights: string[];
  included: string[];
  icon: React.FC<any>;
  bestFor: string;
}

interface TimeSlot {
  time: string;
  description: string;
  advantages: string[];
  price: string;
}

const HotAirBalloonSigiriya = () => {
  const [activeTab, setActiveTab] = useState('experience');
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [selectedPackage, setSelectedPackage] = useState<string | null>(null);
  const [heroImageIndex, setHeroImageIndex] = useState(0);

  const heroImages = [
    {
      url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=1920&h=1080&fit=crop',
      caption: 'Hot Air Balloon over Sigiriya'
    },
    {
      url: 'https://images.unsplash.com/photo-1569163139394-de4b5c4c4e3f?w=1920&h=1080&fit=crop',
      caption: 'Sunrise Balloon Flight'
    },
    {
      url: 'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=1920&h=1080&fit=crop',
      caption: 'Aerial View of Ancient City'
    },
    {
      url: 'https://images.unsplash.com/photo-1540979388789-6cee28a1cdc9?w=1920&h=1080&fit=crop',
      caption: 'Floating Above the Clouds'
    }
  ];

  const flightPackages: FlightPackage[] = [
    {
      name: "Classic Sunrise Flight",
      duration: "1 hour flight",
      price: "$210 per person",
      highlights: [
        "Sunrise views over Sigiriya",
        "360-degree panoramic views",
        "Traditional champagne toast",
        "Flight certificate"
      ],
      included: [
        "Hotel pickup (5:00 AM)",
        "Light refreshments",
        "1-hour balloon flight",
        "Champagne celebration",
        "Return transfer"
      ],
      icon: Sunrise,
      bestFor: "First-time flyers"
    },
    {
      name: "Premium Photo Flight",
      duration: "1.5 hours flight",
      price: "$280 per person",
      highlights: [
        "Extended flight time",
        "Professional photographer",
        "Multiple altitude levels",
        "Private basket section"
      ],
      included: [
        "VIP hotel pickup",
        "Breakfast box",
        "90-minute flight",
        "Photo package (50+ images)",
        "Luxury return transfer"
      ],
      icon: Camera,
      bestFor: "Photography enthusiasts"
    },
    {
      name: "Romantic Couple Flight",
      duration: "1 hour flight",
      price: "$450 per couple",
      highlights: [
        "Private basket compartment",
        "Romantic sunrise setting",
        "Special champagne service",
        "Commemorative gifts"
      ],
      included: [
        "Private transfers",
        "Exclusive basket area",
        "Premium champagne",
        "Professional photos",
        "Romantic breakfast"
      ],
      icon: Heart,
      bestFor: "Couples & anniversaries"
    },
    {
      name: "Family Adventure Flight",
      duration: "1 hour flight",
      price: "$180 per person (kids 50% off)",
      highlights: [
        "Family-friendly experience",
        "Educational commentary",
        "Kids' activity pack",
        "Group photos included"
      ],
      included: [
        "Family vehicle pickup",
        "Kid-friendly snacks",
        "Safety briefing for children",
        "Flight certificates for all",
        "Comfortable transfers"
      ],
      icon: Users,
      bestFor: "Families with children 7+"
    }
  ];

  const timeSlots: TimeSlot[] = [
    {
      time: "5:30 AM - 7:00 AM",
      description: "Early Morning Sunrise Flight",
      advantages: [
        "Spectacular sunrise views",
        "Coolest temperatures",
        "Calmest wind conditions",
        "Best photography light"
      ],
      price: "Standard rates"
    },
    {
      time: "6:00 AM - 7:30 AM",
      description: "Prime Morning Flight",
      advantages: [
        "Golden hour lighting",
        "Clear visibility",
        "Optimal weather conditions",
        "Wildlife activity below"
      ],
      price: "Standard rates"
    }
  ];

  const flightPath = [
    {
      stage: "Launch Site",
      description: "Begin at Kandalama or Dambulla launch field",
      duration: "20 minutes prep"
    },
    {
      stage: "Initial Ascent",
      description: "Gentle rise to 500 feet for panoramic views",
      duration: "10 minutes"
    },
    {
      stage: "Sigiriya Approach",
      description: "Float towards the iconic Lion Rock fortress",
      duration: "20 minutes"
    },
    {
      stage: "Maximum Altitude",
      description: "Reach up to 2,000 feet for stunning vistas",
      duration: "15 minutes"
    },
    {
      stage: "Cultural Triangle Tour",
      description: "Views of ancient cities and temples",
      duration: "15 minutes"
    },
    {
      stage: "Descent & Landing",
      description: "Gentle descent to designated landing area",
      duration: "10 minutes"
    }
  ];

  const faqs = [
    {
      question: "Is hot air ballooning safe?",
      answer: "Yes, hot air ballooning is one of the safest forms of aviation. Our pilots are internationally certified with thousands of flight hours. All equipment is regularly inspected and maintained to international standards. We monitor weather conditions closely and only fly in safe conditions."
    },
    {
      question: "What should I wear for the balloon flight?",
      answer: "Dress in comfortable layers as mornings can be cool but warm up quickly. Wear flat, closed-toe shoes (no heels or sandals). Avoid loose scarves or hats that might blow away. Bring a light jacket and sunglasses. The temperature in the balloon is similar to ground level."
    },
    {
      question: "Are there age or health restrictions?",
      answer: "Children must be at least 7 years old and tall enough to see over the basket edge (about 4 feet). Pregnant women cannot fly for safety reasons. Passengers should be able to stand for the duration of the flight. Those with heart conditions or mobility issues should consult their doctor."
    },
    {
      question: "What happens if the weather is bad?",
      answer: "Safety is our priority. If weather conditions are unsuitable, we'll reschedule your flight for the next available date. If rescheduling isn't possible, we provide a full refund. We make weather decisions by 10 PM the night before and will contact you immediately."
    },
    {
      question: "How high do the balloons fly?",
      answer: "Typically between 500 to 2,000 feet, depending on wind conditions and air traffic regulations. This altitude provides the best views while maintaining safety. The pilot varies the altitude throughout the flight for different perspectives of the landscape."
    },
    {
      question: "Can I bring a camera?",
      answer: "Absolutely! We encourage photography. Ensure your camera has a strap. Drones are not permitted due to aviation regulations. Many passengers find phones adequate for photos, but professional cameras are welcome. Some packages include a professional photographer."
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
        <title>Hot Air Ballooning Sigiriya | Sunrise Flights Over Lion Rock | Recharge Travels</title>
        <meta name="description" content="Experience breathtaking hot air balloon rides over Sigiriya Rock Fortress. Sunrise flights with panoramic views of Sri Lanka's Cultural Triangle." />
        <meta name="keywords" content="hot air balloon Sigiriya, balloon rides Sri Lanka, Sigiriya sunrise flight, aerial tours, Lion Rock balloon, adventure activities Sri Lanka" />
        <meta property="og:title" content="Hot Air Ballooning Over Sigiriya - Unforgettable Sky Adventure" />
        <meta property="og:description" content="Float above ancient kingdoms with sunrise hot air balloon flights over Sigiriya and Sri Lanka's Cultural Triangle." />
        <meta property="og:image" content="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=1200&h=630&fit=crop" />
        <link rel="canonical" href="https://www.rechargetravels.com/experiences/hot-air-balloon-sigiriya" />
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
                Hot Air Ballooning
              </h1>
              <p className="text-xl md:text-2xl mb-8 font-light drop-shadow">
                Soar Above Sigiriya's Ancient Wonders at Sunrise
              </p>
              <Button
                onClick={() => handleBookingClick()}
                size="lg"
                className="bg-purple-600 hover:bg-purple-700 text-white px-8 py-6 text-lg rounded-full 
                         transform hover:scale-105 transition-all duration-300 shadow-xl"
              >
                <Cloud className="mr-2 h-5 w-5" />
                Book Your Flight
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
            <h2 className="text-4xl font-bold mb-6">A Magical Journey Above Ancient Kingdoms</h2>
            <p className="text-xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
              Experience the breathtaking beauty of Sri Lanka's Cultural Triangle from a unique perspective. 
              Float peacefully above the iconic Sigiriya Rock Fortress, ancient cities, and lush landscapes 
              as the sun rises over the horizon. This once-in-a-lifetime adventure offers unparalleled views 
              and unforgettable memories.
            </p>
          </motion.div>

          {/* Quick Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12">
            {[
              { icon: Navigation, label: "Flight Altitude", value: "2,000ft" },
              { icon: Clock, label: "Flight Duration", value: "60-90min" },
              { icon: Award, label: "Safety Record", value: "100%" },
              { icon: Users, label: "Happy Flyers", value: "15,000+" }
            ].map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="text-center"
              >
                <stat.icon className="h-12 w-12 text-purple-600 mx-auto mb-3" />
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
              <TabsTrigger value="experience">The Experience</TabsTrigger>
              <TabsTrigger value="packages">Flight Packages</TabsTrigger>
              <TabsTrigger value="journey">Flight Journey</TabsTrigger>
              <TabsTrigger value="prepare">Preparation</TabsTrigger>
            </TabsList>

            {/* Experience Tab */}
            <TabsContent value="experience" className="space-y-6">
              <h3 className="text-2xl font-bold mb-6">What to Expect</h3>
              
              <div className="grid md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Sunrise className="h-5 w-5 mr-2 text-purple-600" />
                      Pre-Dawn Adventure
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600 mb-4">
                      Your adventure begins before sunrise with a pickup from your hotel. 
                      Arrive at the launch site to watch the magical inflation process as 
                      your balloon comes to life in the pre-dawn light.
                    </p>
                    <ul className="space-y-2 text-sm">
                      <li className="flex items-start">
                        <CheckCircle className="h-4 w-4 text-green-500 mr-2 mt-0.5" />
                        <span>Hotel pickup around 5:00 AM</span>
                      </li>
                      <li className="flex items-start">
                        <CheckCircle className="h-4 w-4 text-green-500 mr-2 mt-0.5" />
                        <span>Safety briefing by certified pilot</span>
                      </li>
                      <li className="flex items-start">
                        <CheckCircle className="h-4 w-4 text-green-500 mr-2 mt-0.5" />
                        <span>Watch balloon inflation process</span>
                      </li>
                      <li className="flex items-start">
                        <CheckCircle className="h-4 w-4 text-green-500 mr-2 mt-0.5" />
                        <span>Board basket for takeoff</span>
                      </li>
                    </ul>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Cloud className="h-5 w-5 mr-2 text-purple-600" />
                      In-Flight Experience
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600 mb-4">
                      As you gently rise into the sky, watch the landscape transform below. 
                      Your pilot will point out landmarks and share stories about the ancient 
                      kingdoms that once ruled these lands.
                    </p>
                    <ul className="space-y-2 text-sm">
                      <li className="flex items-start">
                        <CheckCircle className="h-4 w-4 text-green-500 mr-2 mt-0.5" />
                        <span>360-degree panoramic views</span>
                      </li>
                      <li className="flex items-start">
                        <CheckCircle className="h-4 w-4 text-green-500 mr-2 mt-0.5" />
                        <span>Fly over Sigiriya Rock Fortress</span>
                      </li>
                      <li className="flex items-start">
                        <CheckCircle className="h-4 w-4 text-green-500 mr-2 mt-0.5" />
                        <span>See ancient irrigation systems</span>
                      </li>
                      <li className="flex items-start">
                        <CheckCircle className="h-4 w-4 text-green-500 mr-2 mt-0.5" />
                        <span>Spot wildlife from above</span>
                      </li>
                    </ul>
                  </CardContent>
                </Card>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle>Scenic Highlights</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-3 gap-6">
                    <div>
                      <h4 className="font-semibold mb-2 flex items-center">
                        <Mountain className="h-4 w-4 mr-2 text-purple-600" />
                        Sigiriya Lion Rock
                      </h4>
                      <p className="text-sm text-gray-600">
                        The iconic 5th-century fortress rises majestically from the plains, 
                        offering spectacular aerial views of its summit and ancient gardens.
                      </p>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-2 flex items-center">
                        <Navigation className="h-4 w-4 mr-2 text-purple-600" />
                        Cultural Triangle
                      </h4>
                      <p className="text-sm text-gray-600">
                        Glimpse ancient capitals of Anuradhapura and Polonnaruwa, with their 
                        stupas and reservoirs visible from your elevated vantage point.
                      </p>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-2 flex items-center">
                        <Sun className="h-4 w-4 mr-2 text-purple-600" />
                        Sunrise Splendor
                      </h4>
                      <p className="text-sm text-gray-600">
                        Watch the sun rise over misty mountains and forests, painting the 
                        landscape in golden hues - a photographer's dream come true.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Packages Tab */}
            <TabsContent value="packages" className="space-y-6">
              <h3 className="text-2xl font-bold mb-6">Choose Your Perfect Flight</h3>
              <div className="grid md:grid-cols-2 gap-6">
                {flightPackages.map((pkg, index) => (
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
                          <pkg.icon className="h-10 w-10 text-purple-600" />
                          <Badge className="bg-purple-600">{pkg.duration}</Badge>
                        </div>
                        <CardTitle className="text-xl">{pkg.name}</CardTitle>
                        <p className="text-2xl font-bold text-purple-600">{pkg.price}</p>
                        <p className="text-sm text-gray-500">{pkg.bestFor}</p>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div>
                          <h4 className="font-semibold mb-2">Experience Highlights:</h4>
                          <ul className="space-y-1 text-sm">
                            {pkg.highlights.map((highlight, idx) => (
                              <li key={idx} className="flex items-start">
                                <ChevronRight className="h-4 w-4 text-purple-600 mr-1 mt-0.5 flex-shrink-0" />
                                <span>{highlight}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                        <div>
                          <h4 className="font-semibold mb-2">Package Includes:</h4>
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
                          className="w-full bg-purple-600 hover:bg-purple-700"
                          onClick={() => handleBookingClick(pkg.name)}
                        >
                          Book This Package
                        </Button>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>

              {/* Time Slots */}
              <div>
                <h4 className="text-xl font-semibold mb-4">Flight Time Options</h4>
                <div className="grid md:grid-cols-2 gap-4">
                  {timeSlots.map((slot, index) => (
                    <Card key={index}>
                      <CardHeader>
                        <CardTitle className="text-lg flex items-center">
                          <Clock className="h-5 w-5 mr-2 text-purple-600" />
                          {slot.time}
                        </CardTitle>
                        <p className="text-sm text-gray-600">{slot.description}</p>
                      </CardHeader>
                      <CardContent>
                        <ul className="space-y-1">
                          {slot.advantages.map((advantage, idx) => (
                            <li key={idx} className="text-sm flex items-center">
                              <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                              {advantage}
                            </li>
                          ))}
                        </ul>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            </TabsContent>

            {/* Journey Tab */}
            <TabsContent value="journey" className="space-y-6">
              <h3 className="text-2xl font-bold mb-6">Your Flight Journey</h3>
              
              <Card>
                <CardHeader>
                  <CardTitle>Flight Path & Timeline</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {flightPath.map((stage, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: index * 0.1 }}
                        className="flex items-start"
                      >
                        <div className="flex-shrink-0 w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center mr-4">
                          <span className="text-purple-600 font-semibold">{index + 1}</span>
                        </div>
                        <div className="flex-grow">
                          <h4 className="font-semibold">{stage.stage}</h4>
                          <p className="text-sm text-gray-600">{stage.description}</p>
                          <p className="text-xs text-purple-600 mt-1">{stage.duration}</p>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <div className="grid md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Camera className="h-5 w-5 mr-2 text-purple-600" />
                      Photography Tips
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2 text-sm">
                      <li className="flex items-start">
                        <Info className="h-4 w-4 text-blue-500 mr-2 mt-0.5" />
                        <span>Bring fully charged cameras/phones</span>
                      </li>
                      <li className="flex items-start">
                        <Info className="h-4 w-4 text-blue-500 mr-2 mt-0.5" />
                        <span>Wide-angle lens recommended</span>
                      </li>
                      <li className="flex items-start">
                        <Info className="h-4 w-4 text-blue-500 mr-2 mt-0.5" />
                        <span>Secure camera straps essential</span>
                      </li>
                      <li className="flex items-start">
                        <Info className="h-4 w-4 text-blue-500 mr-2 mt-0.5" />
                        <span>Best light during golden hour</span>
                      </li>
                    </ul>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Wind className="h-5 w-5 mr-2 text-purple-600" />
                      Weather Conditions
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2 text-sm">
                      <li className="flex items-start">
                        <Info className="h-4 w-4 text-blue-500 mr-2 mt-0.5" />
                        <span>Flights depend on calm weather</span>
                      </li>
                      <li className="flex items-start">
                        <Info className="h-4 w-4 text-blue-500 mr-2 mt-0.5" />
                        <span>Best season: December to April</span>
                      </li>
                      <li className="flex items-start">
                        <Info className="h-4 w-4 text-blue-500 mr-2 mt-0.5" />
                        <span>Morning flights most reliable</span>
                      </li>
                      <li className="flex items-start">
                        <Info className="h-4 w-4 text-blue-500 mr-2 mt-0.5" />
                        <span>Decision made night before</span>
                      </li>
                    </ul>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Preparation Tab */}
            <TabsContent value="prepare" className="space-y-6">
              <h3 className="text-2xl font-bold mb-6">Prepare for Your Flight</h3>
              
              <div className="grid md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>What to Wear</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-3">
                      <li className="flex items-start">
                        <CheckCircle className="h-5 w-5 text-green-500 mr-2 mt-0.5" />
                        <div>
                          <span className="font-semibold">Layered clothing</span>
                          <p className="text-sm text-gray-600">Cool morning, warm after sunrise</p>
                        </div>
                      </li>
                      <li className="flex items-start">
                        <CheckCircle className="h-5 w-5 text-green-500 mr-2 mt-0.5" />
                        <div>
                          <span className="font-semibold">Flat, closed shoes</span>
                          <p className="text-sm text-gray-600">For safety during boarding</p>
                        </div>
                      </li>
                      <li className="flex items-start">
                        <CheckCircle className="h-5 w-5 text-green-500 mr-2 mt-0.5" />
                        <div>
                          <span className="font-semibold">Hat and sunglasses</span>
                          <p className="text-sm text-gray-600">Sun protection at altitude</p>
                        </div>
                      </li>
                      <li className="flex items-start">
                        <CheckCircle className="h-5 w-5 text-green-500 mr-2 mt-0.5" />
                        <div>
                          <span className="font-semibold">Comfortable pants</span>
                          <p className="text-sm text-gray-600">Avoid skirts or loose clothing</p>
                        </div>
                      </li>
                    </ul>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Important Guidelines</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-3">
                      <li className="flex items-start">
                        <AlertCircle className="h-5 w-5 text-amber-500 mr-2 mt-0.5" />
                        <div>
                          <span className="font-semibold">No smoking</span>
                          <p className="text-sm text-gray-600">Balloons use open flame</p>
                        </div>
                      </li>
                      <li className="flex items-start">
                        <AlertCircle className="h-5 w-5 text-amber-500 mr-2 mt-0.5" />
                        <div>
                          <span className="font-semibold">Secure loose items</span>
                          <p className="text-sm text-gray-600">Phones, cameras need straps</p>
                        </div>
                      </li>
                      <li className="flex items-start">
                        <AlertCircle className="h-5 w-5 text-amber-500 mr-2 mt-0.5" />
                        <div>
                          <span className="font-semibold">Listen to pilot</span>
                          <p className="text-sm text-gray-600">Follow all safety instructions</p>
                        </div>
                      </li>
                      <li className="flex items-start">
                        <AlertCircle className="h-5 w-5 text-amber-500 mr-2 mt-0.5" />
                        <div>
                          <span className="font-semibold">Health declaration</span>
                          <p className="text-sm text-gray-600">Inform of any conditions</p>
                        </div>
                      </li>
                    </ul>
                  </CardContent>
                </Card>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle>Booking & Logistics</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-3 gap-6">
                    <div>
                      <h4 className="font-semibold mb-2">Booking Timeline</h4>
                      <ul className="space-y-1 text-sm text-gray-600">
                        <li>• Book 2-3 days in advance</li>
                        <li>• Confirmation within 24 hours</li>
                        <li>• Weather check night before</li>
                        <li>• Final confirmation by 10 PM</li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-2">Pickup Locations</h4>
                      <ul className="space-y-1 text-sm text-gray-600">
                        <li>• Sigiriya area hotels</li>
                        <li>• Dambulla hotels</li>
                        <li>• Habarana resorts</li>
                        <li>• Custom pickup available</li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-2">Duration</h4>
                      <ul className="space-y-1 text-sm text-gray-600">
                        <li>• Total experience: 3-4 hours</li>
                        <li>• Hotel pickup: 5:00-5:30 AM</li>
                        <li>• Flight time: 60-90 minutes</li>
                        <li>• Return by: 9:00-10:00 AM</li>
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </section>

      {/* Safety Section */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">Safety First</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                icon: Shield,
                title: "Certified Pilots",
                description: "All pilots hold international commercial licenses with thousands of flight hours experience."
              },
              {
                icon: Award,
                title: "Premium Equipment",
                description: "Modern balloons maintained to highest international aviation standards with regular inspections."
              },
              {
                icon: Users,
                title: "Insurance Coverage",
                description: "Comprehensive insurance coverage for all passengers included in your flight package."
              }
            ].map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="text-center"
              >
                <item.icon className="h-16 w-16 text-purple-600 mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">{item.title}</h3>
                <p className="text-gray-600">{item.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Photo Gallery */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">Balloon Flight Gallery</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {[
              "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=300&fit=crop",
              "https://images.unsplash.com/photo-1569163139394-de4b5c4c4e3f?w=400&h=300&fit=crop",
              "https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=400&h=300&fit=crop",
              "https://images.unsplash.com/photo-1540979388789-6cee28a1cdc9?w=400&h=300&fit=crop",
              "https://images.unsplash.com/photo-1514762263431-d3255330e167?w=400&h=300&fit=crop",
              "https://images.unsplash.com/photo-1495546992359-fa0d45e1f588?w=400&h=300&fit=crop",
              "https://images.unsplash.com/photo-1473448912268-2022ce9509d8?w=400&h=300&fit=crop",
              "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=400&h=300&fit=crop"
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
                  alt={`Hot air balloon ${index + 1}`}
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
                <AccordionTrigger className="text-left hover:text-purple-600">
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
      <section className="py-20 px-4 bg-gradient-to-br from-purple-600 to-indigo-700">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl font-bold mb-6 text-white">
              Ready to Touch the Sky?
            </h2>
            <p className="text-xl mb-8 text-white/90">
              Book your hot air balloon adventure over Sigiriya today. 
              Create memories that will last a lifetime as you float above ancient wonders.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                size="lg"
                className="bg-white text-purple-700 hover:bg-gray-100 px-8 py-6 text-lg"
                onClick={() => handleBookingClick()}
              >
                <Cloud className="mr-2 h-5 w-5" />
                Book Your Flight
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-white text-white hover:bg-white/10 px-8 py-6 text-lg"
                onClick={() => window.location.href = 'tel:+94765059595'}
              >
                <Phone className="mr-2 h-5 w-5" />
                Call for Details
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
              <Phone className="h-8 w-8 mb-3 text-purple-400" />
              <h3 className="font-semibold mb-2">Call Us</h3>
              <p className="text-gray-300">+94 76 505 9595</p>
              <p className="text-sm text-gray-400">Available 24/7</p>
            </div>
            <div className="flex flex-col items-center">
              <Mail className="h-8 w-8 mb-3 text-purple-400" />
              <h3 className="font-semibold mb-2">Email Us</h3>
              <p className="text-gray-300">info@rechargetravels.com</p>
              <p className="text-sm text-gray-400">Quick response</p>
            </div>
            <div className="flex flex-col items-center">
              <Globe className="h-8 w-8 mb-3 text-purple-400" />
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
        itemTitle={selectedPackage || "Hot Air Balloon Flight"}
      />
    </>
  );
};

export default HotAirBalloonSigiriya;