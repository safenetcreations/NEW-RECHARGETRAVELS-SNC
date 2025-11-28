import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Train,
  Camera,
  Clock,
  MapPin,
  Calendar,
  Star,
  Users,
  History,
  TreePine,
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
  Building,
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
  bridgeLength: string;
  location: string;
  bestTime: string;
  accessibility: string;
  visitDuration: string;
  highlights: string[];
  history: string[];
  facilities: string[];
  nearbyAttractions: string[];
  photographyTips: string[];
  tips: string[];
  entrance: {
    local: string;
    foreign: string;
  };
  trainSchedule: {
    morning: string[];
    afternoon: string[];
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

const NineArchBridge = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [selectedPackage, setSelectedPackage] = useState<string | null>(null);
  const [heroImageIndex, setHeroImageIndex] = useState(0);
  const [scenicData, setScenicData] = useState<ScenicDetail | null>(null);
  const [loading, setLoading] = useState(true);

  const heroImages = [
    {
      url: 'https://images.unsplash.com/photo-1580886096914-bad3c0870c42?w=1920&h=1080&fit=crop',
      caption: 'Nine Arch Bridge with Train'
    },
    {
      url: 'https://images.unsplash.com/photo-1588479859177-8b96ad5e6a28?w=1920&h=1080&fit=crop',
      caption: 'Aerial View of Bridge'
    },
    {
      url: 'https://images.unsplash.com/photo-1566138216193-e493332c1ca6?w=1920&h=1080&fit=crop',
      caption: 'Bridge Through Tea Estates'
    },
    {
      url: 'https://images.unsplash.com/photo-1624957563238-f93ae069a0d0?w=1920&h=1080&fit=crop',
      caption: 'Morning Mist at Bridge'
    }
  ];

  const defaultScenicData: ScenicDetail = {
    id: 'nine-arch-bridge',
    name: 'Nine Arch Bridge',
    description: `The Nine Arch Bridge, also known as the 'Bridge in the Sky', is one of Sri Lanka's most iconic colonial-era railway 
    constructions. Built entirely of stone bricks and cement without any steel, this architectural marvel stands 24 meters high 
    and spans 91 meters across a lush green valley. Located between Ella and Demodara railway stations, the bridge has become 
    a symbol of Sri Lanka's hill country, attracting photographers and train enthusiasts from around the world.`,
    bridgeLength: '91 meters (300 feet)',
    location: 'Gotuwala, Ella',
    bestTime: 'Morning for photos, Train times',
    accessibility: 'Easy - 30 min walk',
    visitDuration: '1-2 hours',
    highlights: [
      "Iconic colonial-era railway bridge",
      "Built without steel in 1921",
      "Perfect Instagram photography spot",
      "Watch trains cross the bridge",
      "Surrounded by tea plantations",
      "Walking on railway tracks allowed",
      "Multiple viewpoints available",
      "Stunning valley views"
    ],
    history: [
      "Constructed during British colonial period (1921)",
      "Built entirely of stone bricks and cement",
      "No steel or metal used in construction",
      "Part of Colombo-Badulla railway line",
      "Designed by British engineers",
      "Local name 'Ahas Namaye Palama' (Nine Sky Bridge)"
    ],
    facilities: [
      "Small cafes nearby",
      "Souvenir shops",
      "Local guides available",
      "Multiple viewpoints",
      "Basic toilets",
      "Parking area (limited)",
      "Photography spots marked",
      "Seating areas"
    ],
    nearbyAttractions: [
      "Ella town (2km)",
      "Little Adam's Peak (30 minutes)",
      "Ella Rock (1 hour)",
      "Demodara Loop",
      "Ravana Falls (15 minutes)",
      "Ella Spice Garden"
    ],
    photographyTips: [
      "Best shots when train crosses (check schedule)",
      "Early morning for misty atmosphere",
      "Drone shots from valley (where permitted)",
      "Use people for scale reference",
      "Golden hour lighting is magical"
    ],
    tips: [
      "Check train schedule for best photo ops",
      "Walk carefully on railway tracks",
      "Visit early morning to avoid crowds",
      "Wear comfortable walking shoes",
      "Bring water - walk can be humid",
      "Respect local tea pickers' privacy"
    ],
    entrance: {
      local: 'Free',
      foreign: 'Free'
    },
    trainSchedule: {
      morning: ['6:00 AM', '9:30 AM', '11:00 AM'],
      afternoon: ['12:45 PM', '3:00 PM', '5:45 PM']
    }
  };

  const suggestedTours: SuggestedTour[] = [
    {
      name: "Train & Bridge Experience",
      duration: "Half Day",
      price: "$35",
      highlights: [
        "Ride train over bridge",
        "Multiple photo stops",
        "Tea estate walk",
        "Local guide insights"
      ],
      included: [
        "Train tickets",
        "Professional guide",
        "Hotel pickup",
        "Refreshments",
        "Photography tips"
      ],
      difficulty: "Easy",
      groupSize: "2-10 people"
    },
    {
      name: "Ella Heritage Walk",
      duration: "Full Day",
      price: "$55",
      highlights: [
        "Nine Arch Bridge visit",
        "Demodara Loop",
        "Colonial tea factory",
        "Traditional lunch"
      ],
      included: [
        "All transport",
        "Heritage guide",
        "Factory tour",
        "Lunch",
        "Tea tasting"
      ],
      difficulty: "Easy",
      groupSize: "2-15 people"
    },
    {
      name: "Photography Masterclass",
      duration: "Sunrise to Noon",
      price: "$65",
      highlights: [
        "Sunrise photography",
        "Train crossing shots",
        "Drone photography",
        "Post-processing tips"
      ],
      included: [
        "Photo expert guide",
        "Early transport",
        "Train schedule",
        "Breakfast",
        "Digital guide"
      ],
      difficulty: "Easy",
      groupSize: "2-6 photographers"
    },
    {
      name: "Family Bridge Adventure",
      duration: "3 Hours",
      price: "$80 (family of 4)",
      highlights: [
        "Safe bridge exploration",
        "Train watching",
        "Tea garden visit",
        "Kids activities"
      ],
      included: [
        "Family guide",
        "Transport",
        "Snacks",
        "Fun facts for kids",
        "Photo session"
      ],
      difficulty: "Easy",
      groupSize: "Families"
    }
  ];

  const faqs = [
    {
      question: "When do trains cross the Nine Arch Bridge?",
      answer: "Trains typically cross at 6:00 AM, 9:30 AM, 11:00 AM, 12:45 PM, 3:00 PM, and 5:45 PM. However, schedules can change, so it's best to confirm with locals or your hotel. The blue train is particularly photogenic. Arrive 30 minutes early to secure a good photography spot."
    },
    {
      question: "How do I get to Nine Arch Bridge?",
      answer: "From Ella town, it's a scenic 30-minute walk through tea plantations. Follow the railway track from Ella station for about 1km, then take the path down to the bridge. Alternatively, tuk-tuks can drop you at the top viewpoint. The walk is easy but can be slippery after rain."
    },
    {
      question: "Is it safe to walk on the railway tracks?",
      answer: "Yes, locals and tourists regularly walk on the tracks, but always be cautious. Listen for train horns and step off the tracks well before trains approach. The tracks can be slippery, and there are no barriers, so supervise children closely. Never stand on the bridge when a train is crossing."
    },
    {
      question: "What's the best time for photography?",
      answer: "Early morning (6-8 AM) offers misty, atmospheric shots. The 9:30 AM train crossing usually has good light. Late afternoon provides golden hour lighting. Cloudy days create dramatic moody shots. For fewer crowds, visit on weekdays or during off-season."
    },
    {
      question: "Can I fly a drone at Nine Arch Bridge?",
      answer: "Drone usage is generally permitted for personal use, but always ask locals first and fly responsibly. Don't fly near trains or over crowds. The best drone shots are from the valley below the bridge. Commercial drone photography may require permits."
    },
    {
      question: "Are there facilities at the bridge?",
      answer: "Basic facilities include small cafes serving drinks and snacks, souvenir stalls, and simple toilets. However, options are limited, so bring water and snacks. Several viewpoint restaurants offer better facilities with scenic views of the bridge."
    }
  ];

  useEffect(() => {
    const fetchScenicData = async () => {
      try {
        const docRef = doc(db, 'scenicLocations', 'nine-arch-bridge');
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
        <title>Nine Arch Bridge - Iconic Train Bridge | Recharge Travels</title>
        <meta name="description" content="Visit the iconic Nine Arch Bridge in Ella, Sri Lanka's most photographed railway bridge. Watch trains cross this colonial marvel surrounded by tea plantations and misty valleys." />
        <meta name="keywords" content="Nine Arch Bridge, Ella bridge, train bridge Sri Lanka, Instagram spots, colonial architecture, tea country, railway photography, Demodara" />
        <meta property="og:title" content="Nine Arch Bridge - Bridge in the Sky" />
        <meta property="og:description" content="Experience the iconic Nine Arch Bridge in Ella. Built without steel in 1921, this architectural marvel offers stunning photography opportunities when trains cross through tea country." />
        <meta property="og:image" content="https://images.unsplash.com/photo-1580886096914-bad3c0870c42?w=1200&h=630&fit=crop" />
        <link rel="canonical" href="https://www.rechargetravels.com/scenic/nine-arch-bridge" />
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
                Nine Arch Bridge
              </h1>
              <p className="text-xl md:text-2xl mb-8 font-light drop-shadow">
                The Iconic Bridge in the Sky
              </p>
              <Button
                onClick={() => handleBookingClick()}
                size="lg"
                className="bg-emerald-600 hover:bg-emerald-700 text-white px-8 py-6 text-lg rounded-full 
                         transform hover:scale-105 transition-all duration-300 shadow-xl"
              >
                <Train className="mr-2 h-5 w-5" />
                Book Bridge Tour
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
            <h2 className="text-4xl font-bold mb-6">Discover the Nine Arch Bridge</h2>
            <p className="text-xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
              {scenicData.description}
            </p>
          </motion.div>

          {/* Quick Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12">
            {[
              { icon: Building, label: "Length", value: "91m" },
              { icon: History, label: "Built", value: "1921" },
              { icon: Train, label: "Daily Trains", value: "6+" },
              { icon: Camera, label: "Visit Time", value: scenicData.visitDuration }
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

      {/* Highlights Section */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">Bridge Highlights</h2>
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
                <CheckCircle className="h-6 w-6 text-emerald-600 mb-3" />
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
              <TabsTrigger value="history">History</TabsTrigger>
              <TabsTrigger value="tours">Tours</TabsTrigger>
              <TabsTrigger value="tips">Visitor Tips</TabsTrigger>
            </TabsList>

            {/* Overview Tab */}
            <TabsContent value="overview" className="space-y-6">
              <div className="grid md:grid-cols-2 gap-8">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <MapPin className="h-5 w-5 mr-2 text-emerald-600" />
                      Location & Access
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600 mb-4">
                      Located in {scenicData.location}, easily accessible from Ella:
                    </p>
                    <ul className="space-y-2 text-sm">
                      <li className="flex items-start">
                        <ChevronRight className="h-4 w-4 text-emerald-600 mr-2 mt-0.5" />
                        <span>30-minute scenic walk from Ella</span>
                      </li>
                      <li className="flex items-start">
                        <ChevronRight className="h-4 w-4 text-emerald-600 mr-2 mt-0.5" />
                        <span>Follow railway tracks from Ella station</span>
                      </li>
                      <li className="flex items-start">
                        <ChevronRight className="h-4 w-4 text-emerald-600 mr-2 mt-0.5" />
                        <span>Tuk-tuk to viewpoint (LKR 300-500)</span>
                      </li>
                    </ul>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Train className="h-5 w-5 mr-2 text-emerald-600" />
                      Train Schedule
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div>
                        <h4 className="font-semibold mb-1">Morning Trains:</h4>
                        <div className="flex flex-wrap gap-2">
                          {scenicData.trainSchedule.morning.map((time, idx) => (
                            <Badge key={idx} variant="secondary">{time}</Badge>
                          ))}
                        </div>
                      </div>
                      <div>
                        <h4 className="font-semibold mb-1">Afternoon Trains:</h4>
                        <div className="flex flex-wrap gap-2">
                          {scenicData.trainSchedule.afternoon.map((time, idx) => (
                            <Badge key={idx} variant="secondary">{time}</Badge>
                          ))}
                        </div>
                      </div>
                      <p className="text-sm text-gray-500 mt-2">*Times may vary, confirm locally</p>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Camera className="h-5 w-5 mr-2 text-emerald-600" />
                    Photography Guide
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-2 gap-4">
                    {scenicData.photographyTips.map((tip, idx) => (
                      <div key={idx} className="flex items-start">
                        <Eye className="h-4 w-4 text-emerald-600 mr-2 mt-0.5 flex-shrink-0" />
                        <span className="text-sm text-gray-600">{tip}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* History Tab */}
            <TabsContent value="history" className="space-y-6">
              <h3 className="text-2xl font-bold mb-6">Bridge History & Architecture</h3>
              <div className="grid gap-4">
                {scenicData.history.map((fact, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Card>
                      <CardContent className="pt-6">
                        <div className="flex items-start">
                          <History className="h-5 w-5 text-emerald-600 mr-3 mt-0.5" />
                          <p className="text-gray-700">{fact}</p>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>

              <Card>
                <CardHeader>
                  <CardTitle>Architectural Marvel</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <p className="text-gray-600">
                      The bridge's unique construction without any steel reinforcement makes it an 
                      engineering marvel of its time. The nine arches distribute weight evenly, 
                      allowing trains to pass safely for over 100 years.
                    </p>
                    <div className="grid md:grid-cols-2 gap-4 mt-4">
                      <div>
                        <h4 className="font-semibold mb-2">Construction Details:</h4>
                        <ul className="space-y-1 text-sm text-gray-600">
                          <li>• Height: 24 meters (80 feet)</li>
                          <li>• Length: 91 meters (300 feet)</li>
                          <li>• Width: 7.62 meters (25 feet)</li>
                          <li>• Materials: Stone, brick, cement</li>
                        </ul>
                      </div>
                      <div>
                        <h4 className="font-semibold mb-2">Railway Line:</h4>
                        <ul className="space-y-1 text-sm text-gray-600">
                          <li>• Part of Colombo-Badulla line</li>
                          <li>• Between Ella and Demodara</li>
                          <li>• Elevation: 945m above sea level</li>
                          <li>• Daily passenger & freight trains</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Tours Tab */}
            <TabsContent value="tours" className="space-y-6">
              <h3 className="text-2xl font-bold mb-6">Nine Arch Bridge Experiences</h3>
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
                            <p className="text-2xl font-bold text-emerald-600">{tour.price}</p>
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
                                <ChevronRight className="h-4 w-4 text-emerald-600 mr-1 mt-0.5 flex-shrink-0" />
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
                            className="bg-emerald-600 hover:bg-emerald-700"
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
              <h3 className="text-2xl font-bold mb-6">Visitor Tips & Information</h3>
              <div className="grid md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Info className="h-5 w-5 mr-2 text-blue-600" />
                      Essential Tips
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-3">
                      {scenicData.tips.slice(0, 3).map((tip, idx) => (
                        <li key={idx} className="flex items-start">
                          <CheckCircle className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                          <span className="text-sm">{tip}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <AlertCircle className="h-5 w-5 mr-2 text-orange-600" />
                      Safety Guidelines
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-3">
                      {scenicData.tips.slice(3).map((tip, idx) => (
                        <li key={idx} className="flex items-start">
                          <Info className="h-5 w-5 text-orange-600 mr-2 mt-0.5 flex-shrink-0" />
                          <span className="text-sm">{tip}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle>Facilities & Services</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-semibold mb-2">Available Facilities:</h4>
                      <ul className="space-y-1 text-sm text-gray-600">
                        {scenicData.facilities.slice(0, 4).map((facility, idx) => (
                          <li key={idx} className="flex items-center">
                            <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                            {facility}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-2">Nearby Attractions:</h4>
                      <ul className="space-y-1 text-sm text-gray-600">
                        {scenicData.nearbyAttractions.slice(0, 4).map((attraction, idx) => (
                          <li key={idx} className="flex items-center">
                            <Map className="h-4 w-4 text-emerald-600 mr-2" />
                            {attraction}
                          </li>
                        ))}
                      </ul>
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
              "https://images.unsplash.com/photo-1580886096914-bad3c0870c42?w=400&h=300&fit=crop",
              "https://images.unsplash.com/photo-1588479859177-8b96ad5e6a28?w=400&h=300&fit=crop",
              "https://images.unsplash.com/photo-1566138216193-e493332c1ca6?w=400&h=300&fit=crop",
              "https://images.unsplash.com/photo-1624957563238-f93ae069a0d0?w=400&h=300&fit=crop",
              "https://images.unsplash.com/photo-1569163139394-de4798aa36d1?w=400&h=300&fit=crop",
              "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=300&fit=crop",
              "https://images.unsplash.com/photo-1570789210967-2cac24afeb00?w=400&h=300&fit=crop",
              "https://images.unsplash.com/photo-1624113530318-af0bae5f33eb?w=400&h=300&fit=crop"
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
                  alt={`Nine Arch Bridge view ${index + 1}`}
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
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3962.9!2d81.0465!3d6.8727!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3ae465897c0f3d25%3A0x3b0f2c8f951c79e3!2sNine%20Arch%20Bridge!5e0!3m2!1sen!2slk!4v1234567890"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Nine Arch Bridge Location"
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
              Ready to Experience the Iconic Bridge?
            </h2>
            <p className="text-xl mb-8 text-white/90">
              Visit the Nine Arch Bridge and capture unforgettable moments as trains 
              cross this architectural marvel through tea country.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                size="lg"
                className="bg-white text-emerald-700 hover:bg-gray-100 px-8 py-6 text-lg"
                onClick={() => handleBookingClick()}
              >
                <Train className="mr-2 h-5 w-5" />
                Book Bridge Tour
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
              <Mail className="h-8 w-8 mb-3 text-emerald-400" />
              <h3 className="font-semibold mb-2">Email Us</h3>
              <p className="text-gray-300">info@rechargetravels.com</p>
              <p className="text-sm text-gray-400">Quick response</p>
            </div>
            <div className="flex flex-col items-center">
              <Globe className="h-8 w-8 mb-3 text-emerald-400" />
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
        itemTitle={selectedPackage || "Nine Arch Bridge Tour"}
      />
    </>
  );
};

export default NineArchBridge;