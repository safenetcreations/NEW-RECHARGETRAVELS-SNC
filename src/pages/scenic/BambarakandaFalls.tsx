import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Mountain,
  Droplets,
  Camera,
  Clock,
  MapPin,
  Calendar,
  Star,
  Users,
  TreePine,
  Footprints,
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
  photography: string[];
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

const BambarakandaFalls = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [selectedPackage, setSelectedPackage] = useState<string | null>(null);
  const [heroImageIndex, setHeroImageIndex] = useState(0);
  const [scenicData, setScenicData] = useState<ScenicDetail | null>(null);
  const [loading, setLoading] = useState(true);

  const heroImages = [
    {
      url: 'https://images.unsplash.com/photo-1588392382834-a891154bca4d?w=1920&h=1080&fit=crop',
      caption: 'Majestic Bambarakanda Falls'
    },
    {
      url: 'https://images.unsplash.com/photo-1566650515715-390bca494b70?w=1920&h=1080&fit=crop',
      caption: 'Aerial View of the Falls'
    },
    {
      url: 'https://images.unsplash.com/photo-1432405972618-c60b0225b8f9?w=1920&h=1080&fit=crop',
      caption: 'Hiking Trail to Bambarakanda'
    },
    {
      url: 'https://images.unsplash.com/photo-1523528283115-9bf9b1699245?w=1920&h=1080&fit=crop',
      caption: 'Misty Morning at the Falls'
    }
  ];

  const defaultScenicData: ScenicDetail = {
    id: 'bambarakanda-falls',
    name: 'Bambarakanda Falls',
    description: `Bambarakanda Falls stands as Sri Lanka's tallest waterfall and the 461st highest waterfall in the world, 
    cascading majestically from a height of 263 meters (863 feet). Located in the Badulla District, this natural wonder 
    is formed by Kuda Oya, a tributary of the Walawe River. The waterfall's name derives from 'Bambara' meaning bamboo 
    grove and 'kanda' meaning mountain, referencing the bamboo groves that once adorned the surrounding hillsides.`,
    height: '263 meters (863 feet)',
    location: 'Kalupahana, Badulla District',
    bestTime: 'October to March (highest water flow)',
    difficulty: 'Moderate to Challenging',
    duration: '3-4 hours round trip',
    highlights: [
      "Sri Lanka's tallest waterfall at 263 meters",
      "Spectacular views of the surrounding mountains",
      "Pine forest hiking trails",
      "Natural swimming pools at the base",
      "Diverse flora and fauna along the trail",
      "Traditional village life experiences",
      "Photography opportunities at multiple viewpoints",
      "Cool mountain climate year-round"
    ],
    activities: [
      "Waterfall viewing and photography",
      "Hiking and trekking",
      "Swimming in natural pools",
      "Bird watching",
      "Village tours",
      "Picnicking",
      "Nature walks",
      "Camping (with permission)"
    ],
    facilities: [
      "Parking area",
      "Basic refreshment stalls",
      "Local guide services",
      "Viewpoint platforms",
      "Trail markers",
      "Rest stops along the trail"
    ],
    nearbyAttractions: [
      "Horton Plains National Park (1 hour)",
      "Ohiya Railway Station",
      "Lanka Falls",
      "Diyaluma Falls",
      "Haputale Town",
      "Lipton's Seat"
    ],
    photography: [
      "Best light in early morning (6-8 AM)",
      "Use polarizing filter for waterfall shots",
      "Wide-angle lens for full waterfall view",
      "Tripod essential for long exposures",
      "Drone shots from designated areas only"
    ],
    tips: [
      "Wear sturdy hiking shoes with good grip",
      "Carry rain protection even in dry season",
      "Start early to avoid afternoon mists",
      "Bring water and snacks for the hike",
      "Respect local customs and environment",
      "Check weather conditions before visiting"
    ],
    entrance: {
      local: 'Free',
      foreign: 'Free'
    },
    guides: {
      available: true,
      cost: 'LKR 2,000-3,000 per group'
    }
  };

  const suggestedTours: SuggestedTour[] = [
    {
      name: "Bambarakanda Explorer Package",
      duration: "Full Day",
      price: "$45",
      highlights: [
        "Early morning pickup from Haputale/Ella",
        "Guided hike to waterfall base",
        "Traditional village breakfast",
        "Swimming at natural pools"
      ],
      included: [
        "Transportation",
        "Professional guide",
        "Breakfast and lunch",
        "Water and snacks",
        "Photography assistance"
      ],
      difficulty: "Moderate",
      groupSize: "2-8 people"
    },
    {
      name: "Waterfall & Horton Plains Combo",
      duration: "2 Days",
      price: "$120",
      highlights: [
        "Visit Bambarakanda Falls",
        "Horton Plains trek",
        "World's End viewpoint",
        "Baker's Falls visit"
      ],
      included: [
        "All transportation",
        "1 night accommodation",
        "All meals",
        "Park entrance fees",
        "Expert naturalist guide"
      ],
      difficulty: "Moderate to Challenging",
      groupSize: "2-12 people"
    },
    {
      name: "Photography Special Tour",
      duration: "Dawn to Dusk",
      price: "$75",
      highlights: [
        "Pre-dawn departure for sunrise",
        "Multiple viewpoint access",
        "Long exposure workshop",
        "Drone photography spots"
      ],
      included: [
        "Photography guide",
        "Transport in 4WD",
        "Tripod if needed",
        "Packed meals",
        "Photo editing tips"
      ],
      difficulty: "Moderate",
      groupSize: "2-6 photographers"
    },
    {
      name: "Adventure Trekking Experience",
      duration: "2 Days",
      price: "$95",
      highlights: [
        "Challenging trek routes",
        "Overnight camping",
        "Multiple waterfall visits",
        "Traditional cooking class"
      ],
      included: [
        "Camping equipment",
        "All meals",
        "Professional trekking guide",
        "Porter service",
        "First aid support"
      ],
      difficulty: "Challenging",
      groupSize: "4-10 people"
    }
  ];

  const faqs = [
    {
      question: "What is the best time to visit Bambarakanda Falls?",
      answer: "The best time to visit is from October to March when the waterfall has its highest water flow due to monsoon rains. Early mornings (6-9 AM) offer the clearest views before mist sets in. Avoid visiting during heavy rains as trails can become slippery and dangerous."
    },
    {
      question: "How difficult is the hike to Bambarakanda Falls?",
      answer: "The hike is moderate to challenging, taking 3-4 hours round trip. The trail includes steep sections, uneven terrain, and can be slippery when wet. A reasonable level of fitness is required. The path to the base involves a descent of about 1.5 km through forest and village areas."
    },
    {
      question: "Can we swim at Bambarakanda Falls?",
      answer: "Yes, there are natural pools at the base of the falls where swimming is possible. However, exercise caution as rocks can be slippery and water flow can be strong during rainy season. Always check with locals about current conditions and never swim alone."
    },
    {
      question: "Are guides necessary for visiting the falls?",
      answer: "While not mandatory, hiring a local guide is highly recommended, especially for first-time visitors. Guides know the safest routes, can share local knowledge, and help navigate the sometimes confusing trail network. They typically charge LKR 2,000-3,000 per group."
    },
    {
      question: "What should I bring for the hike?",
      answer: "Essential items include: sturdy hiking shoes, water (at least 2 liters), snacks, rain jacket, sun protection, camera with extra batteries, small first aid kit, and cash for local purchases. Wear layers as temperature varies with altitude."
    },
    {
      question: "How do I reach Bambarakanda Falls?",
      answer: "The falls are accessible from Haputale (45 minutes) or Ella (1.5 hours) by vehicle. Public buses run to Kalupahana village, from where it's a 5 km journey to the falls trailhead. Most visitors hire a tuk-tuk or join organized tours for convenience."
    }
  ];

  useEffect(() => {
    const fetchScenicData = async () => {
      try {
        const docRef = doc(db, 'scenicLocations', 'bambarakanda-falls');
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
        <title>Bambarakanda Falls - Sri Lanka's Tallest Waterfall | Recharge Travels</title>
        <meta name="description" content="Discover Bambarakanda Falls, Sri Lanka's tallest waterfall at 263 meters. Experience breathtaking views, hiking trails, natural pools, and mountain scenery in Badulla District." />
        <meta name="keywords" content="Bambarakanda Falls, tallest waterfall Sri Lanka, hiking Bambarakanda, waterfall trekking, Badulla waterfalls, Sri Lanka nature, mountain hiking, natural pools" />
        <meta property="og:title" content="Bambarakanda Falls - Sri Lanka's Tallest Waterfall" />
        <meta property="og:description" content="Experience the majesty of Sri Lanka's tallest waterfall. Hike through pine forests, swim in natural pools, and capture stunning photography at 263 meters high Bambarakanda Falls." />
        <meta property="og:image" content="https://images.unsplash.com/photo-1588392382834-a891154bca4d?w=1200&h=630&fit=crop" />
        <link rel="canonical" href="https://www.rechargetravels.com/scenic/bambarakanda-falls" />
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
                Bambarakanda Falls
              </h1>
              <p className="text-xl md:text-2xl mb-8 font-light drop-shadow">
                Sri Lanka's Tallest Waterfall - A 263-Meter Natural Wonder
              </p>
              <Button
                onClick={() => handleBookingClick()}
                size="lg"
                className="bg-green-600 hover:bg-green-700 text-white px-8 py-6 text-lg rounded-full 
                         transform hover:scale-105 transition-all duration-300 shadow-xl"
              >
                <Mountain className="mr-2 h-5 w-5" />
                Book Your Adventure
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
            <h2 className="text-4xl font-bold mb-6">Discover Bambarakanda Falls</h2>
            <p className="text-xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
              {scenicData.description}
            </p>
          </motion.div>

          {/* Quick Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12">
            {[
              { icon: Ruler, label: "Height", value: scenicData.height || "263m" },
              { icon: Clock, label: "Hike Duration", value: scenicData.duration },
              { icon: Footprints, label: "Difficulty", value: scenicData.difficulty },
              { icon: Calendar, label: "Best Time", value: scenicData.bestTime }
            ].map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="text-center"
              >
                <stat.icon className="h-12 w-12 text-green-600 mx-auto mb-3" />
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
                <CheckCircle className="h-6 w-6 text-green-600 mb-3" />
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
              <TabsTrigger value="tours">Suggested Tours</TabsTrigger>
              <TabsTrigger value="tips">Travel Tips</TabsTrigger>
            </TabsList>

            {/* Overview Tab */}
            <TabsContent value="overview" className="space-y-6">
              <div className="grid md:grid-cols-2 gap-8">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <MapPin className="h-5 w-5 mr-2 text-green-600" />
                      Location & Access
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600 mb-4">
                      Located in {scenicData.location}, Bambarakanda Falls is accessible via:
                    </p>
                    <ul className="space-y-2 text-sm">
                      <li className="flex items-start">
                        <ChevronRight className="h-4 w-4 text-green-600 mr-2 mt-0.5" />
                        <span>From Haputale: 45 minutes by vehicle</span>
                      </li>
                      <li className="flex items-start">
                        <ChevronRight className="h-4 w-4 text-green-600 mr-2 mt-0.5" />
                        <span>From Ella: 1.5 hours via A5 highway</span>
                      </li>
                      <li className="flex items-start">
                        <ChevronRight className="h-4 w-4 text-green-600 mr-2 mt-0.5" />
                        <span>Public bus to Kalupahana, then 5km to trailhead</span>
                      </li>
                    </ul>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Info className="h-5 w-5 mr-2 text-green-600" />
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
                            `Local guides available - ${scenicData.guides.cost}` : 
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
                    <Camera className="h-5 w-5 mr-2 text-green-600" />
                    Photography Guide
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-2 gap-4">
                    {scenicData.photography.map((tip, idx) => (
                      <div key={idx} className="flex items-start">
                        <Eye className="h-4 w-4 text-green-600 mr-2 mt-0.5 flex-shrink-0" />
                        <span className="text-sm text-gray-600">{tip}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Activities Tab */}
            <TabsContent value="activities" className="space-y-6">
              <h3 className="text-2xl font-bold mb-6">Things to Do at Bambarakanda</h3>
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
                      <TreePine className="h-6 w-6 text-green-600 mr-3" />
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
                        <Map className="h-4 w-4 text-green-600 mr-2" />
                        <span className="text-gray-700">{attraction}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Tours Tab */}
            <TabsContent value="tours" className="space-y-6">
              <h3 className="text-2xl font-bold mb-6">Recommended Tour Packages</h3>
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
                            <p className="text-2xl font-bold text-green-600">{tour.price}</p>
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
                                <ChevronRight className="h-4 w-4 text-green-600 mr-1 mt-0.5 flex-shrink-0" />
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
                            className="bg-green-600 hover:bg-green-700"
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

            {/* Tips Tab */}
            <TabsContent value="tips" className="space-y-6">
              <h3 className="text-2xl font-bold mb-6">Essential Travel Tips</h3>
              <div className="grid md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <AlertCircle className="h-5 w-5 mr-2 text-orange-600" />
                      Before You Go
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-3">
                      {scenicData.tips.slice(0, 3).map((tip, idx) => (
                        <li key={idx} className="flex items-start">
                          <Info className="h-5 w-5 text-orange-600 mr-2 mt-0.5 flex-shrink-0" />
                          <span className="text-sm">{tip}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Compass className="h-5 w-5 mr-2 text-blue-600" />
                      During Your Visit
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-3">
                      {scenicData.tips.slice(3).map((tip, idx) => (
                        <li key={idx} className="flex items-start">
                          <CheckCircle className="h-5 w-5 text-blue-600 mr-2 mt-0.5 flex-shrink-0" />
                          <span className="text-sm">{tip}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle>Entrance Fees & Costs</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-3 gap-6">
                    <div>
                      <h4 className="font-semibold mb-2">Entrance Fees</h4>
                      <p className="text-sm text-gray-600">Local Visitors: {scenicData.entrance.local}</p>
                      <p className="text-sm text-gray-600">Foreign Visitors: {scenicData.entrance.foreign}</p>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-2">Guide Services</h4>
                      <p className="text-sm text-gray-600">{scenicData.guides.cost}</p>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-2">Transport</h4>
                      <p className="text-sm text-gray-600">Tuk-tuk from Haputale: LKR 3,000-4,000</p>
                      <p className="text-sm text-gray-600">Bus to Kalupahana: LKR 50-100</p>
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
              "https://images.unsplash.com/photo-1588392382834-a891154bca4d?w=400&h=300&fit=crop",
              "https://images.unsplash.com/photo-1566650515715-390bca494b70?w=400&h=300&fit=crop",
              "https://images.unsplash.com/photo-1432405972618-c60b0225b8f9?w=400&h=300&fit=crop",
              "https://images.unsplash.com/photo-1523528283115-9bf9b1699245?w=400&h=300&fit=crop",
              "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=400&h=300&fit=crop",
              "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=400&h=300&fit=crop",
              "https://images.unsplash.com/photo-1426604966848-d7adac402bff?w=400&h=300&fit=crop",
              "https://images.unsplash.com/photo-1447752875215-b2761acb3c5d?w=400&h=300&fit=crop"
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
                  alt={`Bambarakanda Falls view ${index + 1}`}
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
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3962.3744!2d80.8375!3d6.7242!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3ae3924249f7e53d%3A0x8637cd24e9ef10fb!2sBambarakanda%20Falls!5e0!3m2!1sen!2slk!4v1234567890"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Bambarakanda Falls Location"
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
                <AccordionTrigger className="text-left hover:text-green-600">
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
      <section className="py-20 px-4 bg-gradient-to-br from-green-600 to-emerald-700">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl font-bold mb-6 text-white">
              Ready to Experience Bambarakanda Falls?
            </h2>
            <p className="text-xl mb-8 text-white/90">
              Join us for an unforgettable adventure to Sri Lanka's tallest waterfall. 
              Experience the majesty of nature and create lasting memories.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                size="lg"
                className="bg-white text-green-700 hover:bg-gray-100 px-8 py-6 text-lg"
                onClick={() => handleBookingClick()}
              >
                <Mountain className="mr-2 h-5 w-5" />
                Book Your Visit
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-white text-white hover:bg-white/10 px-8 py-6 text-lg"
                onClick={() => window.open('https://wa.me/94777721999', '_blank')}
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
            <a href="https://wa.me/94777721999" target="_blank" rel="noopener noreferrer" className="flex flex-col items-center hover:text-green-400 transition-colors">
              <svg className="h-8 w-8 mb-3 text-green-400" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
              <h3 className="font-semibold mb-2">WhatsApp Us</h3>
              <p className="text-gray-300">+94 77 772 1999</p>
              <p className="text-sm text-gray-400">Available 24/7</p>
            </a>
            <div className="flex flex-col items-center">
              <Mail className="h-8 w-8 mb-3 text-green-400" />
              <h3 className="font-semibold mb-2">Email Us</h3>
              <p className="text-gray-300">info@rechargetravels.com</p>
              <p className="text-sm text-gray-400">Quick response</p>
            </div>
            <div className="flex flex-col items-center">
              <Globe className="h-8 w-8 mb-3 text-green-400" />
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
        itemTitle={selectedPackage || "Bambarakanda Falls Tour"}
      />
    </>
  );
};

export default BambarakandaFalls;