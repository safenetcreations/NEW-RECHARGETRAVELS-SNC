import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Droplets,
  Mountain,
  Camera,
  Clock,
  MapPin,
  Calendar,
  Star,
  Users,
  Waves,
  AlertTriangle,
  Wind,
  Compass,
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
  Ruler,
  Map,
  Eye
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import EnhancedBookingModal from '@/components/EnhancedBookingModal';
import { db } from '@/lib/firebase';
import { collection, doc, getDoc } from 'firebase/firestore';

interface ScenicDetail {
  id: string;
  name: string;
  description: string;
  height?: string;
  location: string;
  bestTime: string;
  difficulty: string;
  duration: string;
  highlights: string[];
  activities: string[];
  facilities: string[];
  nearbyAttractions: string[];
  safetyTips: string[];
  tips: string[];
  entrance: {
    local: string;
    foreign: string;
  };
  guides: {
    available: boolean;
    cost: string;
  };
}

interface SuggestedTour {
  name: string;
  duration: string;
  price: string;
  highlights: string[];
  included: string[];
  difficulty: string;
  groupSize: string;
}

const DiyalumaFalls = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [selectedPackage, setSelectedPackage] = useState<string | null>(null);
  const [heroImageIndex, setHeroImageIndex] = useState(0);
  const [scenicData, setScenicData] = useState<ScenicDetail | null>(null);
  const [loading, setLoading] = useState(true);

  const heroImages = [
    {
      url: 'https://images.unsplash.com/photo-1614595077592-5e3a19a19317?w=1920&h=1080&fit=crop',
      caption: 'Diyaluma Falls Cascades'
    },
    {
      url: 'https://images.unsplash.com/photo-1523612192437-66de9804ac3a?w=1920&h=1080&fit=crop',
      caption: 'Natural Infinity Pools'
    },
    {
      url: 'https://images.unsplash.com/photo-1576413326475-ea6c788332fb?w=1920&h=1080&fit=crop',
      caption: 'Upper Falls View'
    },
    {
      url: 'https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?w=1920&h=1080&fit=crop',
      caption: 'Misty Mountain Setting'
    }
  ];

  const defaultScenicData: ScenicDetail = {
    id: 'diyaluma-falls',
    name: 'Diyaluma Falls',
    description: `Diyaluma Falls is Sri Lanka's second-highest waterfall, cascading 220 meters down rugged cliffs near Koslanda. 
    What makes Diyaluma truly special are the natural infinity pools at the top, offering breathtaking views while you swim. 
    The waterfall consists of multiple tiers, each with its own pools and cascades, creating a natural water park high in the 
    mountains. The challenging hike to the top rewards adventurers with one of Sri Lanka's most spectacular experiences.`,
    height: '220 meters (721 feet)',
    location: 'Koslanda, Badulla District',
    bestTime: 'February to May (full flow)',
    difficulty: 'Moderate to Challenging',
    duration: '2-3 hours to top',
    highlights: [
      "Natural infinity pools at the summit",
      "Second highest waterfall in Sri Lanka",
      "Multiple tiers with swimming opportunities",
      "360-degree mountain views from top",
      "Less crowded than other famous falls",
      "Pristine natural environment",
      "Instagram-worthy photo spots",
      "Cool mountain water pools"
    ],
    activities: [
      "Swimming in natural pools",
      "Cliff jumping (selected pools)",
      "Waterfall photography",
      "Mountain hiking",
      "Picnicking",
      "Rock climbing",
      "Nature observation",
      "Meditation by pools"
    ],
    facilities: [
      "Parking area at base",
      "Small local shops",
      "Basic changing areas",
      "Local guide services",
      "Trail markers",
      "Emergency contact points"
    ],
    nearbyAttractions: [
      "Bambarakanda Falls (45 minutes)",
      "Haputale town (30 minutes)",
      "Lipton's Seat",
      "Dambatenne Tea Factory",
      "Rawana Falls",
      "Ella (1.5 hours)"
    ],
    safetyTips: [
      "Never swim during heavy rain or floods",
      "Check water depth before jumping",
      "Stay on marked trails",
      "Wear appropriate footwear with grip",
      "Bring first aid supplies",
      "Don't swim alone in pools",
      "Watch for slippery rocks",
      "Respect safety barriers"
    ],
    tips: [
      "Start early morning for best experience",
      "Bring swimwear and towel",
      "Pack waterproof bags for electronics",
      "Carry enough water (2L minimum)",
      "Wear sun protection",
      "Bring energy snacks"
    ],
    entrance: {
      local: 'LKR 20',
      foreign: 'LKR 50'
    },
    guides: {
      available: true,
      cost: 'LKR 1,500-2,500 per group'
    }
  };

  const suggestedTours: SuggestedTour[] = [
    {
      name: "Infinity Pool Adventure",
      duration: "Full Day",
      price: "$55",
      highlights: [
        "Guided hike to summit pools",
        "Swimming in natural infinity pools",
        "Packed lunch at viewpoint",
        "Photography assistance"
      ],
      included: [
        "Transport from Ella/Haputale",
        "Professional guide",
        "Lunch & snacks",
        "Waterproof bags",
        "Basic first aid"
      ],
      difficulty: "Moderate to Challenging",
      groupSize: "2-8 people"
    },
    {
      name: "Diyaluma & Bambarakanda Combo",
      duration: "Full Day",
      price: "$75",
      highlights: [
        "Visit two tallest waterfalls",
        "Swimming at Diyaluma",
        "Bambarakanda viewpoints",
        "Traditional lunch"
      ],
      included: [
        "All transportation",
        "Expert guides",
        "Meals & refreshments",
        "Entry fees",
        "Photography stops"
      ],
      difficulty: "Moderate",
      groupSize: "2-12 people"
    },
    {
      name: "Sunrise Pool Experience",
      duration: "Half Day",
      price: "$45",
      highlights: [
        "Pre-dawn start",
        "Sunrise from pools",
        "Morning swim",
        "Breakfast picnic"
      ],
      included: [
        "Early pickup",
        "Headlamps",
        "Guide service",
        "Breakfast",
        "Hot beverages"
      ],
      difficulty: "Challenging",
      groupSize: "2-6 people"
    },
    {
      name: "Family Waterfall Tour",
      duration: "Half Day",
      price: "$40",
      highlights: [
        "Lower falls exploration",
        "Safe swimming areas",
        "Easy hiking trails",
        "Kids activities"
      ],
      included: [
        "Transport",
        "Family guide",
        "Snacks & drinks",
        "Safety equipment",
        "Fun activities"
      ],
      difficulty: "Easy to Moderate",
      groupSize: "2-15 people"
    }
  ];

  const faqs = [
    {
      question: "Is it safe to swim in the infinity pools at Diyaluma?",
      answer: "Yes, swimming is generally safe during dry weather when water levels are normal. However, avoid swimming during or after heavy rains when currents can be strong. Always check pool depth, never swim alone, and be extremely careful near edges. Some pools are safer than others - follow your guide's advice."
    },
    {
      question: "How difficult is the hike to the top pools?",
      answer: "The hike is moderate to challenging, taking 2-3 hours depending on fitness level. The trail includes steep sections, some scrambling over rocks, and can be slippery when wet. A reasonable fitness level is required. There's also an easier route from the Poonagala side that's longer but less steep."
    },
    {
      question: "What should I bring for the Diyaluma Falls trek?",
      answer: "Essential items: swimwear, towel, change of clothes, sturdy hiking shoes with good grip, 2L water minimum, snacks, sunscreen, waterproof bag for electronics, basic first aid kit, and camera. Optional: water shoes for pools, dry bag, hiking poles for steep sections."
    },
    {
      question: "When is the best time to visit Diyaluma Falls?",
      answer: "February to May offers the best balance of water flow and safe swimming conditions. Avoid monsoon season (October-January) when trails are slippery and pools can be dangerous. Early morning visits (7-10 AM) provide cooler hiking conditions and better photography light."
    },
    {
      question: "Are there facilities at Diyaluma Falls?",
      answer: "Facilities are basic. There's parking at the base, a few small shops selling snacks and drinks, and basic changing areas. No proper restaurants or washrooms at the top. Most visitors change behind rocks. Bring everything you need for the day."
    },
    {
      question: "Can we visit Diyaluma Falls without a guide?",
      answer: "While it's possible to hike without a guide, hiring one is recommended, especially for first-time visitors. Guides know the safest routes, best swimming spots, and can assist in emergencies. They cost around LKR 1,500-2,500 per group and significantly enhance safety and experience."
    }
  ];

  useEffect(() => {
    const fetchScenicData = async () => {
      try {
        const docRef = doc(db, 'scenicLocations', 'diyaluma-falls');
        const docSnap = await getDoc(docRef);
        
        if (docSnap.exists()) {
          setScenicData(docSnap.data() as ScenicDetail);
        } else {
          setScenicData(defaultScenicData);
        }
      } catch (error) {
        console.error('Error fetching scenic data:', error);
        setScenicData(defaultScenicData);
      } finally {
        setLoading(false);
      }
    };

    fetchScenicData();
  }, []);

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

  if (loading || !scenicData) {
    return (
      <>
        <Header />
        <div className="min-h-screen flex items-center justify-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Helmet>
        <title>Diyaluma Falls - Natural Infinity Pools | Recharge Travels</title>
        <meta name="description" content="Experience Diyaluma Falls, Sri Lanka's second-highest waterfall with natural infinity pools. Swim at the summit, enjoy 360-degree views, and adventure in pristine nature." />
        <meta name="keywords" content="Diyaluma Falls, natural infinity pools, Sri Lanka waterfalls, cliff jumping, swimming pools, Koslanda, adventure tourism, waterfall hiking" />
        <meta property="og:title" content="Diyaluma Falls - Natural Infinity Pools Adventure" />
        <meta property="og:description" content="Discover the magic of Diyaluma Falls with its famous natural infinity pools. Swim 220 meters above ground with breathtaking mountain views in Sri Lanka." />
        <meta property="og:image" content="https://images.unsplash.com/photo-1614595077592-5e3a19a19317?w=1200&h=630&fit=crop" />
        <link rel="canonical" href="https://www.rechargetravels.com/scenic/diyaluma-falls" />
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
                Diyaluma Falls
              </h1>
              <p className="text-xl md:text-2xl mb-8 font-light drop-shadow">
                Natural Infinity Pools in the Sky
              </p>
              <Button
                onClick={() => handleBookingClick()}
                size="lg"
                className="bg-cyan-600 hover:bg-cyan-700 text-white px-8 py-6 text-lg rounded-full 
                         transform hover:scale-105 transition-all duration-300 shadow-xl"
              >
                <Waves className="mr-2 h-5 w-5" />
                Book Pool Adventure
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
            <h2 className="text-4xl font-bold mb-6">Discover Diyaluma Falls</h2>
            <p className="text-xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
              {scenicData.description}
            </p>
          </motion.div>

          {/* Quick Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12">
            {[
              { icon: Ruler, label: "Height", value: "220m" },
              { icon: Clock, label: "Hike Time", value: scenicData.duration },
              { icon: Mountain, label: "Difficulty", value: "Moderate+" },
              { icon: Calendar, label: "Best Time", value: "Feb-May" }
            ].map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="text-center"
              >
                <stat.icon className="h-12 w-12 text-cyan-600 mx-auto mb-3" />
                <div className="text-3xl font-bold text-gray-800">{stat.value}</div>
                <div className="text-gray-600">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Highlights Section */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">Experience Highlights</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {scenicData.highlights.map((highlight, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow"
              >
                <CheckCircle className="h-6 w-6 text-cyan-600 mb-3" />
                <p className="text-gray-700">{highlight}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Main Content Tabs */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-4 mb-8">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="activities">Activities</TabsTrigger>
              <TabsTrigger value="tours">Tour Packages</TabsTrigger>
              <TabsTrigger value="safety">Safety & Tips</TabsTrigger>
            </TabsList>

            {/* Overview Tab */}
            <TabsContent value="overview" className="space-y-6">
              <div className="grid md:grid-cols-2 gap-8">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <MapPin className="h-5 w-5 mr-2 text-cyan-600" />
                      Location & Access
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600 mb-4">
                      Located in {scenicData.location}, Diyaluma Falls is accessible via:
                    </p>
                    <ul className="space-y-2 text-sm">
                      <li className="flex items-start">
                        <ChevronRight className="h-4 w-4 text-cyan-600 mr-2 mt-0.5" />
                        <span>From Ella: 1.5 hours via Wellawaya</span>
                      </li>
                      <li className="flex items-start">
                        <ChevronRight className="h-4 w-4 text-cyan-600 mr-2 mt-0.5" />
                        <span>From Haputale: 30 minutes by vehicle</span>
                      </li>
                      <li className="flex items-start">
                        <ChevronRight className="h-4 w-4 text-cyan-600 mr-2 mt-0.5" />
                        <span>Two routes: Via Koslanda (steep) or Poonagala (longer, easier)</span>
                      </li>
                    </ul>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Info className="h-5 w-5 mr-2 text-cyan-600" />
                      Facilities & Services
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div>
                        <h4 className="font-semibold mb-2">Available Facilities:</h4>
                        <ul className="space-y-1 text-sm text-gray-600">
                          {scenicData.facilities.map((facility, idx) => (
                            <li key={idx} className="flex items-center">
                              <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                              {facility}
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div>
                        <h4 className="font-semibold mb-2">Guide Services:</h4>
                        <p className="text-sm text-gray-600">
                          {scenicData.guides.available ? 
                            `Recommended - ${scenicData.guides.cost}` : 
                            'Self-guided visits only'}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Camera className="h-5 w-5 mr-2 text-cyan-600" />
                    Natural Pools Information
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <h4 className="font-semibold mb-2">Main Infinity Pools</h4>
                      <ul className="space-y-1 text-sm text-gray-600">
                        <li>• Upper pool: Best views, 2m deep</li>
                        <li>• Middle pools: Multiple options</li>
                        <li>• Lower cascades: Easier access</li>
                        <li>• Water temperature: 18-22°C</li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-2">Swimming Tips</h4>
                      <ul className="space-y-1 text-sm text-gray-600">
                        <li>• Check depth before entering</li>
                        <li>• Stay away from edges</li>
                        <li>• Best time: Morning</li>
                        <li>• Bring water shoes</li>
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Activities Tab */}
            <TabsContent value="activities" className="space-y-6">
              <h3 className="text-2xl font-bold mb-6">Things to Do at Diyaluma</h3>
              <div className="grid md:grid-cols-2 gap-6">
                {scenicData.activities.map((activity, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                    className="bg-gray-50 p-6 rounded-lg"
                  >
                    <div className="flex items-center mb-3">
                      <Droplets className="h-6 w-6 text-cyan-600 mr-3" />
                      <h4 className="font-semibold text-lg">{activity}</h4>
                    </div>
                  </motion.div>
                ))}
              </div>

              <Card className="mt-8">
                <CardHeader>
                  <CardTitle>Nearby Attractions</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-2 gap-4">
                    {scenicData.nearbyAttractions.map((attraction, idx) => (
                      <div key={idx} className="flex items-center">
                        <Map className="h-4 w-4 text-cyan-600 mr-2" />
                        <span className="text-gray-700">{attraction}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Tours Tab */}
            <TabsContent value="tours" className="space-y-6">
              <h3 className="text-2xl font-bold mb-6">Diyaluma Adventure Packages</h3>
              <div className="grid md:grid-cols-2 gap-6">
                {suggestedTours.map((tour, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, scale: 0.95 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Card className="h-full hover:shadow-xl transition-shadow">
                      <CardHeader>
                        <div className="flex justify-between items-start mb-3">
                          <div>
                            <CardTitle className="text-xl">{tour.name}</CardTitle>
                            <p className="text-sm text-gray-500 mt-1">{tour.duration}</p>
                          </div>
                          <div className="text-right">
                            <p className="text-2xl font-bold text-cyan-600">{tour.price}</p>
                            <Badge variant="outline">{tour.difficulty}</Badge>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div>
                          <h4 className="font-semibold mb-2">Highlights:</h4>
                          <ul className="space-y-1 text-sm">
                            {tour.highlights.map((highlight, idx) => (
                              <li key={idx} className="flex items-start">
                                <ChevronRight className="h-4 w-4 text-cyan-600 mr-1 mt-0.5 flex-shrink-0" />
                                <span>{highlight}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                        <div>
                          <h4 className="font-semibold mb-2">Included:</h4>
                          <ul className="space-y-1 text-sm">
                            {tour.included.map((item, idx) => (
                              <li key={idx} className="flex items-center">
                                <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                                <span>{item}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                        <div className="flex items-center justify-between text-sm text-gray-500">
                          <span className="flex items-center">
                            <Users className="h-4 w-4 mr-1" />
                            {tour.groupSize}
                          </span>
                          <Button 
                            size="sm"
                            className="bg-cyan-600 hover:bg-cyan-700"
                            onClick={() => handleBookingClick(tour.name)}
                          >
                            Book This Tour
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </TabsContent>

            {/* Safety Tab */}
            <TabsContent value="safety" className="space-y-6">
              <h3 className="text-2xl font-bold mb-6">Safety Guidelines & Tips</h3>
              <div className="grid md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <AlertTriangle className="h-5 w-5 mr-2 text-orange-600" />
                      Safety Guidelines
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-3">
                      {scenicData.safetyTips.map((tip, idx) => (
                        <li key={idx} className="flex items-start">
                          <AlertCircle className="h-5 w-5 text-orange-600 mr-2 mt-0.5 flex-shrink-0" />
                          <span className="text-sm">{tip}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Info className="h-5 w-5 mr-2 text-blue-600" />
                      Essential Tips
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-3">
                      {scenicData.tips.map((tip, idx) => (
                        <li key={idx} className="flex items-start">
                          <CheckCircle className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                          <span className="text-sm">{tip}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle>Entry Fees & Costs</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-3 gap-6">
                    <div>
                      <h4 className="font-semibold mb-2">Entrance Fees</h4>
                      <p className="text-sm text-gray-600">Local: {scenicData.entrance.local}</p>
                      <p className="text-sm text-gray-600">Foreign: {scenicData.entrance.foreign}</p>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-2">Guide Services</h4>
                      <p className="text-sm text-gray-600">{scenicData.guides.cost}</p>
                      <p className="text-sm text-gray-500 mt-1">Highly recommended</p>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-2">Transport</h4>
                      <p className="text-sm text-gray-600">From Ella: LKR 3,000-4,000</p>
                      <p className="text-sm text-gray-600">From Haputale: LKR 2,000-3,000</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </section>

      {/* Photo Gallery */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">Photo Gallery</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {[
              "https://images.unsplash.com/photo-1614595077592-5e3a19a19317?w=400&h=300&fit=crop",
              "https://images.unsplash.com/photo-1523612192437-66de9804ac3a?w=400&h=300&fit=crop",
              "https://images.unsplash.com/photo-1576413326475-ea6c788332fb?w=400&h=300&fit=crop",
              "https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?w=400&h=300&fit=crop",
              "https://images.unsplash.com/photo-1533604108233-fcd7e77b58ea?w=400&h=300&fit=crop",
              "https://images.unsplash.com/photo-1432887382605-0abf9cc466e5?w=400&h=300&fit=crop",
              "https://images.unsplash.com/photo-1505881402582-c5bc11054f91?w=400&h=300&fit=crop",
              "https://images.unsplash.com/photo-1584794171574-fe3f84b43838?w=400&h=300&fit=crop"
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
                  alt={`Diyaluma Falls view ${index + 1}`}
                  className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300" />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Location Map Section */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">Location Map</h2>
          <Card className="overflow-hidden">
            <div className="aspect-video relative">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3963.2!2d81.0341!3d6.8191!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3ae465d0e89f7c47%3A0x6c8f38e7c6f7d0a6!2sDiyaluma%20Falls!5e0!3m2!1sen!2slk!4v1234567890"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Diyaluma Falls Location"
              />
            </div>
          </Card>
        </div>
      </section>

      {/* FAQs Section */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">Frequently Asked Questions</h2>
          <Accordion type="single" collapsible className="space-y-4">
            {faqs.map((faq, index) => (
              <AccordionItem key={index} value={`item-${index}`}>
                <AccordionTrigger className="text-left hover:text-cyan-600">
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
      <section className="py-20 px-4 bg-gradient-to-br from-cyan-600 to-blue-700">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl font-bold mb-6 text-white">
              Ready for Your Infinity Pool Adventure?
            </h2>
            <p className="text-xl mb-8 text-white/90">
              Experience the thrill of swimming in natural infinity pools 220 meters high. 
              Book your Diyaluma Falls adventure today.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                size="lg"
                className="bg-white text-cyan-700 hover:bg-gray-100 px-8 py-6 text-lg"
                onClick={() => handleBookingClick()}
              >
                <Waves className="mr-2 h-5 w-5" />
                Book Your Adventure
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
              <Phone className="h-8 w-8 mb-3 text-cyan-400" />
              <h3 className="font-semibold mb-2">Call Us</h3>
              <p className="text-gray-300">+94 76 505 9595</p>
              <p className="text-sm text-gray-400">Available 24/7</p>
            </div>
            <div className="flex flex-col items-center">
              <Mail className="h-8 w-8 mb-3 text-cyan-400" />
              <h3 className="font-semibold mb-2">Email Us</h3>
              <p className="text-gray-300">info@rechargetravels.com</p>
              <p className="text-sm text-gray-400">Quick response</p>
            </div>
            <div className="flex flex-col items-center">
              <Globe className="h-8 w-8 mb-3 text-cyan-400" />
              <h3 className="font-semibold mb-2">Visit Website</h3>
              <p className="text-gray-300">www.rechargetravels.com</p>
              <p className="text-sm text-gray-400">More destinations</p>
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
        itemTitle={selectedPackage || "Diyaluma Falls Adventure"}
      />
    </>
  );
};

export default DiyalumaFalls;