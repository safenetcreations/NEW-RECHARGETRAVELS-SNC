import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Wind,
  Waves,
  Camera,
  Clock,
  MapPin,
  Calendar,
  Star,
  Users,
  Sun,
  Cloud,
  Activity,
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
  Zap
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import EnhancedBookingModal from '@/components/EnhancedBookingModal';

interface KitePackage {
  name: string;
  duration: string;
  price: string;
  highlights: string[];
  included: string[];
  icon: React.FC<any>;
  level: string;
}

interface WindCondition {
  month: string;
  windSpeed: string;
  windDirection: string;
  kitingDays: string;
  conditions: string;
}

const KalpitiyaKiteSurfing = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [selectedPackage, setSelectedPackage] = useState<string | null>(null);
  const [heroImageIndex, setHeroImageIndex] = useState(0);

  const heroImages = [
    {
      url: 'https://images.unsplash.com/photo-1537003203736-b8dd0e5d16e6?w=1920&h=1080&fit=crop',
      caption: 'Kite Surfing Action'
    },
    {
      url: 'https://images.unsplash.com/photo-1526761122248-c31c93f8b2b9?w=1920&h=1080&fit=crop',
      caption: 'Perfect Wind Conditions'
    },
    {
      url: 'https://images.unsplash.com/photo-1505459785268-c5e5a1f88c19?w=1920&h=1080&fit=crop',
      caption: 'Kalpitiya Lagoon'
    },
    {
      url: 'https://images.unsplash.com/photo-1574482620826-40685ca5ebd2?w=1920&h=1080&fit=crop',
      caption: 'Sunset Kiting Session'
    }
  ];

  const kitePackages: KitePackage[] = [
    {
      name: "Beginner Discovery Course",
      duration: "3 Days",
      price: "$350",
      highlights: [
        "IKO certified instruction",
        "All equipment provided",
        "Safety first approach",
        "Certificate on completion"
      ],
      included: [
        "9 hours instruction",
        "Complete kite equipment",
        "Safety gear",
        "Theory lessons",
        "Beach transfers"
      ],
      icon: Users,
      level: "Complete Beginner"
    },
    {
      name: "Intermediate Progression",
      duration: "5 Days",
      price: "$550",
      highlights: [
        "Advanced techniques",
        "Jumping and tricks",
        "Upwind riding mastery",
        "Equipment selection guide"
      ],
      included: [
        "15 hours coaching",
        "Premium equipment",
        "Video analysis",
        "Spot guidance",
        "Rescue boat support"
      ],
      icon: Activity,
      level: "Intermediate"
    },
    {
      name: "Wave Riding Master Class",
      duration: "7 Days",
      price: "$750",
      highlights: [
        "Wave riding techniques",
        "Strapless kitesurfing",
        "Advanced maneuvers",
        "Competition preparation"
      ],
      included: [
        "21 hours expert coaching",
        "High-end equipment",
        "Multiple spot access",
        "Professional photos",
        "Private boat sessions"
      ],
      icon: Zap,
      level: "Advanced"
    },
    {
      name: "Kite Safari Package",
      duration: "10 Days",
      price: "$1,200",
      highlights: [
        "Multiple locations",
        "Downwinders included",
        "Local spot exploration",
        "Cultural experiences"
      ],
      included: [
        "Daily kiting sessions",
        "Equipment & transport",
        "Accommodation",
        "Meals included",
        "Professional guide"
      ],
      icon: Navigation,
      level: "All Levels"
    }
  ];

  const windConditions: WindCondition[] = [
    {
      month: "May - September",
      windSpeed: "20-30 knots",
      windDirection: "SW Monsoon",
      kitingDays: "28+ days/month",
      conditions: "Perfect consistent wind"
    },
    {
      month: "December - March",
      windSpeed: "15-25 knots",
      windDirection: "NE Monsoon",
      kitingDays: "20+ days/month",
      conditions: "Good morning sessions"
    },
    {
      month: "April & October",
      windSpeed: "10-20 knots",
      windDirection: "Variable",
      kitingDays: "15+ days/month",
      conditions: "Lighter winds, good for beginners"
    },
    {
      month: "November",
      windSpeed: "5-15 knots",
      windDirection: "Transition period",
      kitingDays: "10+ days/month",
      conditions: "Unpredictable, not ideal"
    }
  ];

  const kitingSpots = [
    {
      name: "Kalpitiya Lagoon",
      type: "Flat Water",
      depth: "Waist to chest deep",
      features: ["Perfect for beginners", "Flat water paradise", "No waves or currents", "Large riding area"],
      bestFor: "Learning and freestyle"
    },
    {
      name: "Vella Island",
      type: "Wave Spot",
      depth: "Deep water",
      features: ["Clean waves", "Offshore wind", "Advanced riders only", "Boat access required"],
      bestFor: "Wave riding"
    },
    {
      name: "Dream Spot",
      type: "Flat to Choppy",
      depth: "Shallow sandbar",
      features: ["Huge riding area", "Downwind possibilities", "Variable conditions", "Scenic location"],
      bestFor: "Cruising and speed"
    },
    {
      name: "Donkey Point",
      type: "Mixed Conditions",
      depth: "Variable",
      features: ["Less crowded", "Good wind angle", "Beach launch", "Local favorite"],
      bestFor: "Intermediate practice"
    }
  ];

  const faqs = [
    {
      question: "Do I need prior experience to start kitesurfing?",
      answer: "No prior experience is needed for our beginner courses. However, being comfortable in water and basic swimming skills are essential. Any board sports experience (surfing, wakeboarding, snowboarding) can help but isn't required. We start with comprehensive safety and theory lessons."
    },
    {
      question: "What makes Kalpitiya ideal for kitesurfing?",
      answer: "Kalpitiya offers consistent thermal winds, large flat-water lagoons perfect for learning, warm water year-round (no wetsuit needed), and multiple spots for all levels. The main season (May-October) provides incredibly reliable wind conditions with 90% kiteable days."
    },
    {
      question: "How long does it take to learn kitesurfing?",
      answer: "Most people can get up and riding in 9-12 hours of instruction (typically 3-4 days). However, becoming independent and confident usually takes 2-3 weeks of practice. Progress depends on fitness level, previous board experience, and wind conditions during learning."
    },
    {
      question: "What's included in the lesson packages?",
      answer: "All packages include IKO certified instruction, complete kite equipment (kite, bar, harness, board), safety gear (helmet, impact vest, leash), and theoretical materials. Multi-day packages also include daily transfers to the best spots based on conditions."
    },
    {
      question: "Is kitesurfing dangerous?",
      answer: "When taught properly with modern safety systems, kitesurfing is relatively safe. We use the latest safety equipment including quick-release systems, and our instructors prioritize safety. Most accidents occur when people try to self-teach or ignore safety guidelines."
    },
    {
      question: "What should I bring for kitesurfing?",
      answer: "Bring swimwear, reef-safe sunscreen (lots of it!), sunglasses with strap, rash guard or lycra shirt, board shorts, water bottle, and positive attitude. We provide all technical equipment. A waterproof camera or GoPro is great for capturing your progress."
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
        <title>Kite Surfing Kalpitiya | Learn Kiteboarding Sri Lanka | Recharge Travels</title>
        <meta name="description" content="Experience world-class kitesurfing in Kalpitiya, Sri Lanka. IKO certified instruction, perfect wind conditions, and flat-water lagoons ideal for all levels." />
        <meta name="keywords" content="kite surfing Kalpitiya, kiteboarding Sri Lanka, learn kitesurfing, Kalpitiya wind conditions, kite school, water sports Sri Lanka" />
        <meta property="og:title" content="Kite Surfing in Kalpitiya - Sri Lanka's Wind Paradise" />
        <meta property="og:description" content="Learn to kitesurf in Kalpitiya's perfect conditions with IKO certified instructors and consistent winds." />
        <meta property="og:image" content="https://images.unsplash.com/photo-1537003203736-b8dd0e5d16e6?w=1200&h=630&fit=crop" />
        <link rel="canonical" href="https://www.rechargetravels.com/experiences/kalpitiya-kite-surfing" />
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
                Kite Surfing Kalpitiya
              </h1>
              <p className="text-xl md:text-2xl mb-8 font-light drop-shadow">
                Ride the Wind in Sri Lanka's Kitesurfing Paradise
              </p>
              <Button
                onClick={() => handleBookingClick()}
                size="lg"
                className="bg-sky-600 hover:bg-sky-700 text-white px-8 py-6 text-lg rounded-full 
                         transform hover:scale-105 transition-all duration-300 shadow-xl"
              >
                <Wind className="mr-2 h-5 w-5" />
                Start Your Adventure
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
            <h2 className="text-4xl font-bold mb-6">Welcome to Asia's Kitesurfing Hotspot</h2>
            <p className="text-xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
              Kalpitiya has emerged as one of the world's premier kitesurfing destinations, offering 
              consistent thermal winds, vast flat-water lagoons, and year-round tropical conditions. 
              Whether you're taking your first lesson or perfecting advanced tricks, our IKO-certified 
              school provides everything you need for an incredible kitesurfing experience.
            </p>
          </motion.div>

          {/* Quick Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12">
            {[
              { icon: Wind, label: "Avg Wind Speed", value: "20-30 knots" },
              { icon: Sun, label: "Kiteable Days", value: "300+/year" },
              { icon: Award, label: "IKO Certified", value: "Since 2010" },
              { icon: Users, label: "Students Taught", value: "5,000+" }
            ].map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="text-center"
              >
                <stat.icon className="h-12 w-12 text-sky-600 mx-auto mb-3" />
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
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="conditions">Wind & Spots</TabsTrigger>
              <TabsTrigger value="courses">Courses</TabsTrigger>
              <TabsTrigger value="prepare">Preparation</TabsTrigger>
            </TabsList>

            {/* Overview Tab */}
            <TabsContent value="overview" className="space-y-6">
              <h3 className="text-2xl font-bold mb-6">Why Choose Kalpitiya?</h3>
              
              <div className="grid md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Wind className="h-5 w-5 mr-2 text-sky-600" />
                      Perfect Wind Conditions
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600 mb-4">
                      Kalpitiya benefits from two monsoon seasons providing reliable thermal winds. 
                      The Kalpitiya lagoon creates a venturi effect, accelerating winds and providing 
                      consistent conditions throughout the day.
                    </p>
                    <ul className="space-y-2 text-sm">
                      <li className="flex items-center">
                        <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                        Thermal winds from 11 AM to sunset
                      </li>
                      <li className="flex items-center">
                        <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                        Cross-shore wind direction
                      </li>
                      <li className="flex items-center">
                        <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                        No gusty or offshore winds
                      </li>
                    </ul>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Waves className="h-5 w-5 mr-2 text-sky-600" />
                      Ideal Learning Environment
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600 mb-4">
                      The massive shallow lagoon provides perfect flat-water conditions for beginners 
                      and freestylers. Multiple spots cater to all skill levels from first-timers to 
                      professional riders.
                    </p>
                    <ul className="space-y-2 text-sm">
                      <li className="flex items-center">
                        <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                        Flat, shallow water lagoon
                      </li>
                      <li className="flex items-center">
                        <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                        No sharks or dangerous marine life
                      </li>
                      <li className="flex items-center">
                        <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                        28°C water temperature
                      </li>
                    </ul>
                  </CardContent>
                </Card>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle>Our Teaching Philosophy</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-3 gap-6">
                    <div>
                      <h4 className="font-semibold mb-2 flex items-center">
                        <Shield className="h-5 w-5 mr-2 text-sky-600" />
                        Safety First
                      </h4>
                      <p className="text-sm text-gray-600">
                        We prioritize safety with modern equipment, thorough briefings, and constant 
                        supervision. All instructors are rescue-trained and first-aid certified.
                      </p>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-2 flex items-center">
                        <Users className="h-5 w-5 mr-2 text-sky-600" />
                        Personal Progress
                      </h4>
                      <p className="text-sm text-gray-600">
                        Small group sizes (max 4 students per instructor) ensure personalized attention 
                        and faster progress. We adapt to your learning pace.
                      </p>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-2 flex items-center">
                        <Award className="h-5 w-5 mr-2 text-sky-600" />
                        IKO Standards
                      </h4>
                      <p className="text-sm text-gray-600">
                        Following International Kiteboarding Organization standards ensures quality 
                        instruction and globally recognized certification.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Conditions Tab */}
            <TabsContent value="conditions" className="space-y-6">
              <h3 className="text-2xl font-bold mb-6">Wind Conditions & Kiting Spots</h3>
              
              {/* Wind Conditions */}
              <div>
                <h4 className="text-xl font-semibold mb-4">Seasonal Wind Patterns</h4>
                <div className="grid md:grid-cols-2 gap-4">
                  {windConditions.map((condition, index) => (
                    <Card key={index}>
                      <CardHeader>
                        <CardTitle className="text-lg">{condition.month}</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span className="text-gray-600">Wind Speed:</span>
                            <span className="font-semibold">{condition.windSpeed}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Direction:</span>
                            <span className="font-semibold">{condition.windDirection}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Kiteable Days:</span>
                            <span className="font-semibold">{condition.kitingDays}</span>
                          </div>
                          <Badge className="mt-2" variant="outline">{condition.conditions}</Badge>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>

              {/* Kiting Spots */}
              <div>
                <h4 className="text-xl font-semibold mb-4">Kiting Spots</h4>
                <div className="space-y-4">
                  {kitingSpots.map((spot, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <Card>
                        <CardHeader>
                          <div className="flex justify-between items-start">
                            <div>
                              <CardTitle className="text-lg">{spot.name}</CardTitle>
                              <p className="text-sm text-gray-600">{spot.type} • {spot.depth}</p>
                            </div>
                            <Badge className="bg-sky-600">{spot.bestFor}</Badge>
                          </div>
                        </CardHeader>
                        <CardContent>
                          <div className="grid md:grid-cols-2 gap-2">
                            {spot.features.map((feature, idx) => (
                              <div key={idx} className="flex items-center text-sm">
                                <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                                <span>{feature}</span>
                              </div>
                            ))}
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))}
                </div>
              </div>
            </TabsContent>

            {/* Courses Tab */}
            <TabsContent value="courses" className="space-y-6">
              <h3 className="text-2xl font-bold mb-6">Kitesurfing Courses & Packages</h3>
              <div className="grid md:grid-cols-2 gap-6">
                {kitePackages.map((pkg, index) => (
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
                          <pkg.icon className="h-10 w-10 text-sky-600" />
                          <div className="text-right">
                            <Badge className="bg-sky-600">{pkg.duration}</Badge>
                            <Badge variant="outline" className="ml-2">{pkg.level}</Badge>
                          </div>
                        </div>
                        <CardTitle className="text-xl">{pkg.name}</CardTitle>
                        <p className="text-2xl font-bold text-sky-600">{pkg.price}</p>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div>
                          <h4 className="font-semibold mb-2">Course Highlights:</h4>
                          <ul className="space-y-1 text-sm">
                            {pkg.highlights.map((highlight, idx) => (
                              <li key={idx} className="flex items-start">
                                <ChevronRight className="h-4 w-4 text-sky-600 mr-1 mt-0.5 flex-shrink-0" />
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
                          className="w-full bg-sky-600 hover:bg-sky-700"
                          onClick={() => handleBookingClick(pkg.name)}
                        >
                          Book This Course
                        </Button>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </TabsContent>

            {/* Preparation Tab */}
            <TabsContent value="prepare" className="space-y-6">
              <h3 className="text-2xl font-bold mb-6">Prepare for Your Kiting Adventure</h3>
              
              <div className="grid md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>What to Bring</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div>
                        <h4 className="font-semibold mb-2">Essential Items</h4>
                        <ul className="space-y-2 text-sm">
                          <li className="flex items-center">
                            <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                            Reef-safe sunscreen (SPF 50+)
                          </li>
                          <li className="flex items-center">
                            <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                            Rash guard or lycra shirt
                          </li>
                          <li className="flex items-center">
                            <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                            Board shorts/bikini
                          </li>
                          <li className="flex items-center">
                            <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                            Sunglasses with strap
                          </li>
                          <li className="flex items-center">
                            <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                            Water bottle (1.5L+)
                          </li>
                        </ul>
                      </div>
                      <div>
                        <h4 className="font-semibold mb-2">Optional Items</h4>
                        <ul className="space-y-2 text-sm">
                          <li className="flex items-center">
                            <Info className="h-4 w-4 text-blue-500 mr-2" />
                            GoPro or waterproof camera
                          </li>
                          <li className="flex items-center">
                            <Info className="h-4 w-4 text-blue-500 mr-2" />
                            Zinc cream for face
                          </li>
                          <li className="flex items-center">
                            <Info className="h-4 w-4 text-blue-500 mr-2" />
                            Energy bars/snacks
                          </li>
                        </ul>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Physical Preparation</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div>
                        <h4 className="font-semibold mb-2">Fitness Requirements</h4>
                        <p className="text-sm text-gray-600 mb-2">
                          Kitesurfing is physically demanding but doesn't require extreme fitness. 
                          Basic preparation helps:
                        </p>
                        <ul className="space-y-2 text-sm">
                          <li className="flex items-center">
                            <Activity className="h-4 w-4 text-sky-600 mr-2" />
                            Core strength exercises
                          </li>
                          <li className="flex items-center">
                            <Activity className="h-4 w-4 text-sky-600 mr-2" />
                            Swimming practice
                          </li>
                          <li className="flex items-center">
                            <Activity className="h-4 w-4 text-sky-600 mr-2" />
                            Flexibility stretching
                          </li>
                          <li className="flex items-center">
                            <Activity className="h-4 w-4 text-sky-600 mr-2" />
                            Balance training
                          </li>
                        </ul>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle>Learning Timeline</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="grid md:grid-cols-3 gap-4">
                      <div>
                        <h4 className="font-semibold mb-2">Day 1-2</h4>
                        <ul className="space-y-1 text-sm text-gray-600">
                          <li>• Safety & theory</li>
                          <li>• Kite control on beach</li>
                          <li>• Body dragging</li>
                          <li>• Self-rescue techniques</li>
                        </ul>
                      </div>
                      <div>
                        <h4 className="font-semibold mb-2">Day 3-4</h4>
                        <ul className="space-y-1 text-sm text-gray-600">
                          <li>• Board recovery</li>
                          <li>• Water starts</li>
                          <li>• First rides</li>
                          <li>• Staying upwind</li>
                        </ul>
                      </div>
                      <div>
                        <h4 className="font-semibold mb-2">Day 5+</h4>
                        <ul className="space-y-1 text-sm text-gray-600">
                          <li>• Riding both directions</li>
                          <li>• Speed control</li>
                          <li>• Basic transitions</li>
                          <li>• Independent riding</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </section>

      {/* Photo Gallery */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">Kalpitiya Kitesurfing Gallery</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {[
              "https://images.unsplash.com/photo-1537003203736-b8dd0e5d16e6?w=400&h=300&fit=crop",
              "https://images.unsplash.com/photo-1526761122248-c31c93f8b2b9?w=400&h=300&fit=crop",
              "https://images.unsplash.com/photo-1505459785268-c5e5a1f88c19?w=400&h=300&fit=crop",
              "https://images.unsplash.com/photo-1574482620826-40685ca5ebd2?w=400&h=300&fit=crop",
              "https://images.unsplash.com/photo-1537004340197-e7a3e8ba6d9c?w=400&h=300&fit=crop",
              "https://images.unsplash.com/photo-1502680390469-be75c86b636f?w=400&h=300&fit=crop",
              "https://images.unsplash.com/photo-1526762017063-70a24b88a1f5?w=400&h=300&fit=crop",
              "https://images.unsplash.com/photo-1505142468610-359e7d316be0?w=400&h=300&fit=crop"
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
                  alt={`Kitesurfing ${index + 1}`}
                  className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300" />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQs Section */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">Frequently Asked Questions</h2>
          <Accordion type="single" collapsible className="space-y-4">
            {faqs.map((faq, index) => (
              <AccordionItem key={index} value={`item-${index}`}>
                <AccordionTrigger className="text-left hover:text-sky-600">
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
      <section className="py-20 px-4 bg-gradient-to-br from-sky-600 to-blue-700">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl font-bold mb-6 text-white">
              Ready to Ride the Wind?
            </h2>
            <p className="text-xl mb-8 text-white/90">
              Join us in Kalpitiya for an unforgettable kitesurfing experience. 
              Perfect conditions, expert instruction, and the adventure of a lifetime await!
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                size="lg"
                className="bg-white text-sky-700 hover:bg-gray-100 px-8 py-6 text-lg"
                onClick={() => handleBookingClick()}
              >
                <Wind className="mr-2 h-5 w-5" />
                Book Your Course
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-white text-white hover:bg-white/10 px-8 py-6 text-lg"
                onClick={() => window.location.href = 'tel:+94765059595'}
              >
                <Phone className="mr-2 h-5 w-5" />
                Call for Info
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
              <Phone className="h-8 w-8 mb-3 text-sky-400" />
              <h3 className="font-semibold mb-2">Call Us</h3>
              <p className="text-gray-300">+94 76 505 9595</p>
              <p className="text-sm text-gray-400">Available 24/7</p>
            </div>
            <div className="flex flex-col items-center">
              <Mail className="h-8 w-8 mb-3 text-sky-400" />
              <h3 className="font-semibold mb-2">Email Us</h3>
              <p className="text-gray-300">info@rechargetravels.com</p>
              <p className="text-sm text-gray-400">Quick response</p>
            </div>
            <div className="flex flex-col items-center">
              <Globe className="h-8 w-8 mb-3 text-sky-400" />
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
        itemTitle={selectedPackage || "Kitesurfing Course"}
      />
    </>
  );
};

export default KalpitiyaKiteSurfing;