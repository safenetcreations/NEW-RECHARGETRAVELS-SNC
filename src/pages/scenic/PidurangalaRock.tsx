import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Mountain,
  Sunrise,
  Camera,
  Clock,
  MapPin,
  Calendar,
  Star,
  Users,
  Eye,
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
  Landmark,
  Map,
  AlertTriangle
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
  elevation: string;
  location: string;
  bestTime: string;
  difficulty: string;
  duration: string;
  highlights: string[];
  trailInfo: string[];
  facilities: string[];
  nearbyAttractions: string[];
  photographyTips: string[];
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

const PidurangalaRock = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [selectedPackage, setSelectedPackage] = useState<string | null>(null);
  const [heroImageIndex, setHeroImageIndex] = useState(0);
  const [scenicData, setScenicData] = useState<ScenicDetail | null>(null);
  const [loading, setLoading] = useState(true);

  const heroImages = [
    {
      url: 'https://images.unsplash.com/photo-1588052052295-b8f7e3a3c96f?w=1920&h=1080&fit=crop',
      caption: 'Pidurangala Rock Summit'
    },
    {
      url: 'https://images.unsplash.com/photo-1612278675615-7b093b07772d?w=1920&h=1080&fit=crop',
      caption: 'Sunrise View of Sigiriya'
    },
    {
      url: 'https://images.unsplash.com/photo-1571406252241-db0280bd36cd?w=1920&h=1080&fit=crop',
      caption: 'Rock Temple Complex'
    },
    {
      url: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=1920&h=1080&fit=crop',
      caption: 'Panoramic Views from Top'
    }
  ];

  const defaultScenicData: ScenicDetail = {
    id: 'pidurangala-rock',
    name: 'Pidurangala Rock',
    description: `Pidurangala Rock offers the most spectacular views of Sigiriya Rock Fortress and is increasingly popular as an alternative 
    climb. This ancient rock temple dates back to the 3rd century BC and features a massive reclining Buddha statue. The summit 
    provides unparalleled 360-degree views of the surrounding landscape, making it the perfect spot for sunrise photography. Less 
    crowded than Sigiriya, Pidurangala offers a more adventurous climb with equally rewarding vistas.`,
    elevation: '200 meters above surroundings',
    location: 'Sigiriya, Matale District',
    bestTime: 'Sunrise (5:30-7:00 AM)',
    difficulty: 'Moderate to Challenging',
    duration: '1.5-2 hours round trip',
    highlights: [
      "Best views of Sigiriya Rock Fortress",
      "Spectacular sunrise experience",
      "Ancient Buddhist temple complex",
      "Massive reclining Buddha statue",
      "360-degree panoramic views",
      "Less crowded than Sigiriya",
      "Rock climbing adventure",
      "Photographer's paradise"
    ],
    trailInfo: [
      "Start from ticket counter at base",
      "Pass through temple complex",
      "Remove shoes at temple area",
      "Rocky scramble begins halfway",
      "Final section requires climbing",
      "Wide summit plateau for views"
    ],
    facilities: [
      "Ticket counter",
      "Basic refreshments at base",
      "Parking area",
      "Local guide services",
      "Temple complex",
      "Basic toilets at entrance"
    ],
    nearbyAttractions: [
      "Sigiriya Rock Fortress (1km)",
      "Sigiriya Museum",
      "Cobra Hood Cave",
      "Sigiriya Water Gardens",
      "Dambulla Cave Temple (20km)",
      "Minneriya National Park (30 minutes)"
    ],
    photographyTips: [
      "Arrive 45 minutes before sunrise",
      "Wide-angle lens essential",
      "Bring tripod for low light",
      "Headlamp for pre-dawn climb",
      "Capture Sigiriya in morning light"
    ],
    tips: [
      "Start climb by 5:00 AM for sunrise",
      "Wear shoes with good grip",
      "Bring flashlight/headlamp",
      "Carry water - no shops on trail",
      "Respect temple dress code",
      "Be careful on rocky sections"
    ],
    entrance: {
      local: 'LKR 500',
      foreign: 'LKR 500'
    },
    guides: {
      available: true,
      cost: 'LKR 1,500-2,500 per group'
    }
  };

  const suggestedTours: SuggestedTour[] = [
    {
      name: "Sunrise Summit Experience",
      duration: "Half Day",
      price: "$35",
      highlights: [
        "Pre-dawn pickup (4:30 AM)",
        "Guided climb with headlamps",
        "Sunrise photography session",
        "Temple complex visit"
      ],
      included: [
        "Hotel pickup/drop",
        "Entrance ticket",
        "Professional guide",
        "Headlamp",
        "Light breakfast"
      ],
      difficulty: "Moderate to Challenging",
      groupSize: "2-8 people"
    },
    {
      name: "Twin Rocks Adventure",
      duration: "Full Day",
      price: "$95",
      highlights: [
        "Climb both Pidurangala & Sigiriya",
        "Morning at Pidurangala",
        "Afternoon at Sigiriya",
        "Complete historical tour"
      ],
      included: [
        "All entrance fees",
        "Expert guide",
        "Transport",
        "Lunch",
        "Water & snacks"
      ],
      difficulty: "Challenging",
      groupSize: "2-10 people"
    },
    {
      name: "Photography Masterclass",
      duration: "Dawn Session",
      price: "$65",
      highlights: [
        "Professional photography guide",
        "Best viewpoint positions",
        "Sunrise techniques",
        "Post-processing tips"
      ],
      included: [
        "Photography expert",
        "Early transport",
        "Entrance fee",
        "Tripod if needed",
        "Digital guide"
      ],
      difficulty: "Moderate",
      groupSize: "2-6 photographers"
    },
    {
      name: "Cultural Heritage Tour",
      duration: "Half Day",
      price: "$45",
      highlights: [
        "Temple complex exploration",
        "Reclining Buddha visit",
        "Rock summit climb",
        "Historical insights"
      ],
      included: [
        "Cultural guide",
        "Entrance fees",
        "Transport",
        "Temple offering",
        "Refreshments"
      ],
      difficulty: "Moderate",
      groupSize: "2-12 people"
    }
  ];

  const faqs = [
    {
      question: "How difficult is the Pidurangala Rock climb?",
      answer: "The climb is moderate to challenging. The first half through the temple is easy, but the final section requires scrambling over large boulders and some basic rock climbing. Most reasonably fit people can manage it, but those with mobility issues may find it difficult. The climb takes 30-45 minutes."
    },
    {
      question: "Why choose Pidurangala over Sigiriya?",
      answer: "Pidurangala offers the best views OF Sigiriya Rock, is much less crowded, costs significantly less (LKR 500 vs 5,000+), and provides equally spectacular 360-degree views. It's perfect for sunrise as you can photograph Sigiriya in golden light. Many visitors climb both for different perspectives."
    },
    {
      question: "What should I bring for the sunrise climb?",
      answer: "Essential items: headlamp/flashlight (mandatory for pre-dawn climb), water, camera, good grip shoes, and light jacket (cool at summit). Also bring small bills for entrance fee as they may not have change early morning. Avoid bringing unnecessary items as climbing requires free hands."
    },
    {
      question: "Is it safe to climb in the dark?",
      answer: "Yes, with proper preparation. Use a good headlamp, go with a guide if unsure, and take your time. Many people do the sunrise climb daily. The path is well-worn but watch for loose rocks. Never attempt in rain as rocks become dangerously slippery."
    },
    {
      question: "What's at the temple complex?",
      answer: "The ancient temple features meditation caves, a massive reclining Buddha statue made from bricks and plaster, and ancient inscriptions. You must remove shoes and dress modestly (cover shoulders and knees) when passing through the temple area. Photography is allowed but be respectful."
    },
    {
      question: "When is the best time to visit Pidurangala?",
      answer: "Sunrise (arrive by 5:00 AM) offers the best experience with golden light on Sigiriya and fewer crowds. Late afternoon (4:00-6:00 PM) is also good for sunset views. Avoid midday due to heat. The dry season (December to April) has the clearest views."
    }
  ];

  useEffect(() => {
    const fetchScenicData = async () => {
      try {
        const docRef = doc(db, 'scenicLocations', 'pidurangala-rock');
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
        <title>Pidurangala Rock - Best Views of Sigiriya | Recharge Travels</title>
        <meta name="description" content="Climb Pidurangala Rock for the best views of Sigiriya. Experience sunrise vistas, ancient temple complex, and 360-degree panoramic views with fewer crowds." />
        <meta name="keywords" content="Pidurangala Rock, Sigiriya views, sunrise climb Sri Lanka, rock climbing, Buddhist temple, panoramic views, alternative to Sigiriya" />
        <meta property="og:title" content="Pidurangala Rock - Spectacular Views of Sigiriya" />
        <meta property="og:description" content="Discover Pidurangala Rock's sunrise magic with unmatched views of Sigiriya. Ancient temple, adventurous climb, and photographer's paradise at a fraction of the cost." />
        <meta property="og:image" content="https://images.unsplash.com/photo-1588052052295-b8f7e3a3c96f?w=1200&h=630&fit=crop" />
        <link rel="canonical" href="https://www.rechargetravels.com/scenic/pidurangala-rock" />
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
                Pidurangala Rock
              </h1>
              <p className="text-xl md:text-2xl mb-8 font-light drop-shadow">
                The Ultimate Viewpoint for Sigiriya Rock Fortress
              </p>
              <Button
                onClick={() => handleBookingClick()}
                size="lg"
                className="bg-amber-600 hover:bg-amber-700 text-white px-8 py-6 text-lg rounded-full 
                         transform hover:scale-105 transition-all duration-300 shadow-xl"
              >
                <Sunrise className="mr-2 h-5 w-5" />
                Book Sunrise Climb
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
            <h2 className="text-4xl font-bold mb-6">Discover Pidurangala Rock</h2>
            <p className="text-xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
              {scenicData.description}
            </p>
          </motion.div>

          {/* Quick Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12">
            {[
              { icon: Mountain, label: "Elevation", value: "200m" },
              { icon: Clock, label: "Climb Time", value: "30-45 min" },
              { icon: Footprints, label: "Difficulty", value: scenicData.difficulty },
              { icon: Sunrise, label: "Best Time", value: "Sunrise" }
            ].map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="text-center"
              >
                <stat.icon className="h-12 w-12 text-amber-600 mx-auto mb-3" />
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
                <CheckCircle className="h-6 w-6 text-amber-600 mb-3" />
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
              <TabsTrigger value="trail">Trail Guide</TabsTrigger>
              <TabsTrigger value="tours">Guided Tours</TabsTrigger>
              <TabsTrigger value="tips">Climbing Tips</TabsTrigger>
            </TabsList>

            {/* Overview Tab */}
            <TabsContent value="overview" className="space-y-6">
              <div className="grid md:grid-cols-2 gap-8">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <MapPin className="h-5 w-5 mr-2 text-amber-600" />
                      Location & Access
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600 mb-4">
                      Located in {scenicData.location}, just 1km from Sigiriya:
                    </p>
                    <ul className="space-y-2 text-sm">
                      <li className="flex items-start">
                        <ChevronRight className="h-4 w-4 text-amber-600 mr-2 mt-0.5" />
                        <span>From Sigiriya: 5 minutes by tuk-tuk</span>
                      </li>
                      <li className="flex items-start">
                        <ChevronRight className="h-4 w-4 text-amber-600 mr-2 mt-0.5" />
                        <span>From Dambulla: 30 minutes by vehicle</span>
                      </li>
                      <li className="flex items-start">
                        <ChevronRight className="h-4 w-4 text-amber-600 mr-2 mt-0.5" />
                        <span>Well-marked entrance with parking</span>
                      </li>
                    </ul>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Info className="h-5 w-5 mr-2 text-amber-600" />
                      Facilities & Services
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-1 text-sm text-gray-600">
                      {scenicData.facilities.map((facility, idx) => (
                        <li key={idx} className="flex items-center">
                          <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                          {facility}
                        </li>
                      ))}
                    </ul>
                    <div className="mt-4">
                      <p className="text-sm font-semibold">Guide Services:</p>
                      <p className="text-sm text-gray-600">{scenicData.guides.cost}</p>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Camera className="h-5 w-5 mr-2 text-amber-600" />
                    Photography Guide
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-2 gap-4">
                    {scenicData.photographyTips.map((tip, idx) => (
                      <div key={idx} className="flex items-start">
                        <Eye className="h-4 w-4 text-amber-600 mr-2 mt-0.5 flex-shrink-0" />
                        <span className="text-sm text-gray-600">{tip}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Trail Tab */}
            <TabsContent value="trail" className="space-y-6">
              <h3 className="text-2xl font-bold mb-6">Trail Information</h3>
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Compass className="h-5 w-5 mr-2 text-amber-600" />
                    Step-by-Step Climbing Guide
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ol className="space-y-3">
                    {scenicData.trailInfo.map((step, index) => (
                      <li key={index} className="flex items-start">
                        <span className="font-bold text-amber-600 mr-3">{index + 1}.</span>
                        <span className="text-gray-700">{step}</span>
                      </li>
                    ))}
                  </ol>
                </CardContent>
              </Card>

              <div className="grid md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Landmark className="h-5 w-5 mr-2 text-amber-600" />
                      Temple Complex
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2 text-sm">
                      <li>• Ancient monastery dating to 3rd century BC</li>
                      <li>• Massive reclining Buddha statue</li>
                      <li>• Meditation caves with inscriptions</li>
                      <li>• Remove shoes and dress modestly</li>
                      <li>• Photography allowed respectfully</li>
                    </ul>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Nearby Attractions</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {scenicData.nearbyAttractions.map((attraction, idx) => (
                        <div key={idx} className="flex items-center text-sm">
                          <Map className="h-4 w-4 text-amber-600 mr-2" />
                          <span className="text-gray-700">{attraction}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Tours Tab */}
            <TabsContent value="tours" className="space-y-6">
              <h3 className="text-2xl font-bold mb-6">Guided Tour Options</h3>
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
                            <p className="text-2xl font-bold text-amber-600">{tour.price}</p>
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
                                <ChevronRight className="h-4 w-4 text-amber-600 mr-1 mt-0.5 flex-shrink-0" />
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
                            className="bg-amber-600 hover:bg-amber-700"
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
              <h3 className="text-2xl font-bold mb-6">Essential Climbing Tips</h3>
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
                      <li className="flex items-start">
                        <AlertCircle className="h-5 w-5 text-orange-600 mr-2 mt-0.5 flex-shrink-0" />
                        <span className="text-sm">Never climb in rain - rocks become extremely slippery</span>
                      </li>
                      <li className="flex items-start">
                        <AlertCircle className="h-5 w-5 text-orange-600 mr-2 mt-0.5 flex-shrink-0" />
                        <span className="text-sm">Use headlamp for pre-dawn climbs</span>
                      </li>
                      <li className="flex items-start">
                        <AlertCircle className="h-5 w-5 text-orange-600 mr-2 mt-0.5 flex-shrink-0" />
                        <span className="text-sm">Keep hands free for climbing sections</span>
                      </li>
                    </ul>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Info className="h-5 w-5 mr-2 text-blue-600" />
                      What to Bring
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
                  <CardTitle>Entrance Fees & Timing</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-3 gap-6">
                    <div>
                      <h4 className="font-semibold mb-2">Entrance Fees</h4>
                      <p className="text-sm text-gray-600">Local: {scenicData.entrance.local}</p>
                      <p className="text-sm text-gray-600">Foreign: {scenicData.entrance.foreign}</p>
                      <p className="text-sm text-gray-500 mt-1">Much cheaper than Sigiriya!</p>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-2">Best Times</h4>
                      <p className="text-sm text-gray-600">Sunrise: 5:00-7:00 AM</p>
                      <p className="text-sm text-gray-600">Sunset: 5:00-6:30 PM</p>
                      <p className="text-sm text-gray-600">Avoid: 10 AM-3 PM (hot)</p>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-2">Duration</h4>
                      <p className="text-sm text-gray-600">Climb up: 30-45 min</p>
                      <p className="text-sm text-gray-600">At summit: 30-60 min</p>
                      <p className="text-sm text-gray-600">Total: 1.5-2.5 hours</p>
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
              "https://images.unsplash.com/photo-1588052052295-b8f7e3a3c96f?w=400&h=300&fit=crop",
              "https://images.unsplash.com/photo-1612278675615-7b093b07772d?w=400&h=300&fit=crop",
              "https://images.unsplash.com/photo-1571406252241-db0280bd36cd?w=400&h=300&fit=crop",
              "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=300&fit=crop",
              "https://images.unsplash.com/photo-1567157577867-05ccb1388e66?w=400&h=300&fit=crop",
              "https://images.unsplash.com/photo-1586523969132-b407ac2dfedc?w=400&h=300&fit=crop",
              "https://images.unsplash.com/photo-1624113439502-0ce16b73bc7f?w=400&h=300&fit=crop",
              "https://images.unsplash.com/photo-1588607842830-eeac30741e92?w=400&h=300&fit=crop"
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
                  alt={`Pidurangala Rock view ${index + 1}`}
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
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3954.5!2d80.7594!3d7.9559!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3afca0af88341157%3A0x50b0b1ed3ff0e895!2sPidurangala%20Rock!5e0!3m2!1sen!2slk!4v1234567890"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Pidurangala Rock Location"
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
                <AccordionTrigger className="text-left hover:text-amber-600">
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
      <section className="py-20 px-4 bg-gradient-to-br from-amber-600 to-orange-700">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl font-bold mb-6 text-white">
              Ready for the Ultimate Sigiriya View?
            </h2>
            <p className="text-xl mb-8 text-white/90">
              Climb Pidurangala Rock for unforgettable sunrise views and 
              the best perspective of Sigiriya Rock Fortress.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                size="lg"
                className="bg-white text-amber-700 hover:bg-gray-100 px-8 py-6 text-lg"
                onClick={() => handleBookingClick()}
              >
                <Sunrise className="mr-2 h-5 w-5" />
                Book Your Climb
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
              <Phone className="h-8 w-8 mb-3 text-amber-400" />
              <h3 className="font-semibold mb-2">Call Us</h3>
              <p className="text-gray-300">+94 76 505 9595</p>
              <p className="text-sm text-gray-400">Available 24/7</p>
            </div>
            <div className="flex flex-col items-center">
              <Mail className="h-8 w-8 mb-3 text-amber-400" />
              <h3 className="font-semibold mb-2">Email Us</h3>
              <p className="text-gray-300">info@rechargetravels.com</p>
              <p className="text-sm text-gray-400">Quick response</p>
            </div>
            <div className="flex flex-col items-center">
              <Globe className="h-8 w-8 mb-3 text-amber-400" />
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
        itemTitle={selectedPackage || "Pidurangala Rock Climb"}
      />
    </>
  );
};

export default PidurangalaRock;