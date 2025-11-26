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
  Sparkles,
  History,
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
  accessibility: string;
  duration: string;
  highlights: string[];
  mythology: string[];
  facilities: string[];
  nearbyAttractions: string[];
  photographyTips: string[];
  tips: string[];
  entrance: {
    local: string;
    foreign: string;
  };
  parking: {
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

const RavanaFalls = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [selectedPackage, setSelectedPackage] = useState<string | null>(null);
  const [heroImageIndex, setHeroImageIndex] = useState(0);
  const [scenicData, setScenicData] = useState<ScenicDetail | null>(null);
  const [loading, setLoading] = useState(true);

  const heroImages = [
    {
      url: 'https://images.unsplash.com/photo-1609137144813-7d9921338f24?w=1920&h=1080&fit=crop',
      caption: 'Ravana Falls Cascading'
    },
    {
      url: 'https://images.unsplash.com/photo-1605537040919-e46920fa3011?w=1920&h=1080&fit=crop',
      caption: 'Waterfall Through Forest'
    },
    {
      url: 'https://images.unsplash.com/photo-1580619305218-8423a7ef79b4?w=1920&h=1080&fit=crop',
      caption: 'Misty Falls View'
    },
    {
      url: 'https://images.unsplash.com/photo-1482685945432-29a7abf21e75?w=1920&h=1080&fit=crop',
      caption: 'Rocky Pool Below Falls'
    }
  ];

  const defaultScenicData: ScenicDetail = {
    id: 'ravana-falls',
    name: 'Ravana Falls',
    description: `Ravana Falls is one of Sri Lanka's most popular waterfalls, steeped in ancient mythology and natural beauty. 
    Located just 6km from Ella, this 25-meter cascade is easily accessible from the main road, making it a favorite stop 
    for travelers. According to legend, King Ravana hid Princess Sita in caves behind the waterfall, adding mystical 
    significance to its natural splendor. The falls are particularly impressive during the rainy season when water thunders 
    down the rock face, creating a mesmerizing spectacle.`,
    height: '25 meters (82 feet)',
    location: 'Ella, Badulla District',
    bestTime: 'May to September (high flow)',
    accessibility: 'Easy - roadside viewing',
    duration: '30 minutes to 1 hour',
    highlights: [
      "Legendary waterfall from Ramayana epic",
      "Easy roadside access for all ages",
      "Natural pools for bathing",
      "Cave exploration behind falls",
      "Stunning photography opportunities",
      "Cool mist on hot days",
      "Local vendor snacks and drinks",
      "Multiple viewing platforms"
    ],
    mythology: [
      "King Ravana hid Princess Sita here",
      "Caves behind falls were Ravana's palace",
      "Named after legendary king of Lanka",
      "Part of Ramayana Trail",
      "Sacred site for local communities",
      "Ancient bathing pools of royalty"
    ],
    facilities: [
      "Roadside parking",
      "Viewing platforms",
      "Local food stalls",
      "Souvenir shops",
      "Changing areas",
      "Safety railings",
      "Steps to lower pools",
      "Photography points"
    ],
    nearbyAttractions: [
      "Ella Rock (30 minutes)",
      "Nine Arch Bridge (20 minutes)",
      "Little Adam's Peak (25 minutes)",
      "Ravana Cave (5 minutes)",
      "Ella town (10 minutes)",
      "Dowa Temple (15 minutes)"
    ],
    photographyTips: [
      "Best light in early morning",
      "Use slow shutter for silky water",
      "Wide angle for full falls view",
      "Capture mist with backlight",
      "Include people for scale"
    ],
    tips: [
      "Visit early morning to avoid crowds",
      "Be careful on wet rocks",
      "Swimming allowed in lower pools only",
      "Respect local customs at sacred site",
      "Don't climb behind waterfall in high flow",
      "Bring change of clothes if swimming"
    ],
    entrance: {
      local: 'Free',
      foreign: 'Free'
    },
    parking: {
      available: true,
      cost: 'LKR 50-100'
    }
  };

  const suggestedTours: SuggestedTour[] = [
    {
      name: "Ravana Falls & Cave Tour",
      duration: "Half Day",
      price: "$30",
      highlights: [
        "Waterfall viewing and photography",
        "Ravana Cave exploration",
        "Mythology storytelling",
        "Swimming in pools"
      ],
      included: [
        "Transport from Ella",
        "Professional guide",
        "Cave entrance",
        "Refreshments",
        "Towels"
      ],
      difficulty: "Easy",
      groupSize: "2-15 people"
    },
    {
      name: "Ramayana Trail Experience",
      duration: "Full Day",
      price: "$65",
      highlights: [
        "Multiple Ramayana sites",
        "Ravana Falls & Cave",
        "Seetha Amman Temple",
        "Traditional lunch"
      ],
      included: [
        "All transport",
        "Expert mythology guide",
        "Entry fees",
        "Lunch",
        "Cultural insights"
      ],
      difficulty: "Easy",
      groupSize: "2-12 people"
    },
    {
      name: "Ella Waterfalls Circuit",
      duration: "Full Day",
      price: "$55",
      highlights: [
        "Visit 3 waterfalls",
        "Ravana Falls",
        "Diyaluma Falls views",
        "Secret waterfall"
      ],
      included: [
        "4WD transport",
        "Waterfall guide",
        "Picnic lunch",
        "Swimming stops",
        "Photography tips"
      ],
      difficulty: "Moderate",
      groupSize: "2-8 people"
    },
    {
      name: "Photography Special",
      duration: "Sunrise Session",
      price: "$45",
      highlights: [
        "Early morning shoot",
        "No crowds",
        "Best light conditions",
        "Multiple angles"
      ],
      included: [
        "5 AM pickup",
        "Photography guide",
        "Tripod if needed",
        "Breakfast",
        "Edited photos"
      ],
      difficulty: "Easy",
      groupSize: "2-6 photographers"
    }
  ];

  const faqs = [
    {
      question: "Is it safe to swim at Ravana Falls?",
      answer: "Swimming is allowed in the lower pools during low water flow periods. The pools can be deep and rocky, so exercise caution. Never attempt to swim during heavy rains or high water flow. The upper sections near the main fall are dangerous and off-limits for swimming."
    },
    {
      question: "What is the mythology behind Ravana Falls?",
      answer: "According to the Ramayana epic, King Ravana, the legendary ruler of Lanka, hid Princess Sita in caves behind this waterfall after abducting her from India. The caves are said to be part of a network of tunnels Ravana used. This makes the falls a significant site in the Ramayana Trail."
    },
    {
      question: "When is the best time to visit Ravana Falls?",
      answer: "The waterfall is most impressive from May to September when water flow is highest. However, it's beautiful year-round. Visit early morning (7-9 AM) for the best photography light and fewer crowds. Avoid visiting immediately after heavy rains when paths can be slippery."
    },
    {
      question: "How accessible is Ravana Falls?",
      answer: "Ravana Falls is one of the most accessible waterfalls in Sri Lanka. It's visible from the main Ella-Wellawaya road with parking available. There are concrete steps leading to lower viewing points and pools. The entire visit can be done in 30 minutes, making it suitable for all ages."
    },
    {
      question: "Can we go behind the waterfall?",
      answer: "Yes, there are caves behind the falls that can be explored during low water flow periods. However, this can be dangerous during high flow and should only be attempted with a guide. The caves are slippery and dark, so proper footwear and a flashlight are essential."
    },
    {
      question: "Are there facilities at Ravana Falls?",
      answer: "Basic facilities include roadside parking (LKR 50-100), local food stalls selling snacks and drinks, and small souvenir shops. There are no proper changing rooms, but locals sometimes offer this service for a small fee. Public toilets are available but basic."
    }
  ];

  useEffect(() => {
    const fetchScenicData = async () => {
      try {
        const docRef = doc(db, 'scenicLocations', 'ravana-falls');
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
        <title>Ravana Falls - Mythical Waterfall | Recharge Travels</title>
        <meta name="description" content="Visit Ravana Falls near Ella, a legendary waterfall from the Ramayana epic. Easy access, natural pools, cave exploration, and rich mythology make it a must-see destination." />
        <meta name="keywords" content="Ravana Falls, Ella waterfalls, Ramayana Trail, Sri Lanka mythology, waterfall swimming, Ravana Cave, easy access waterfall" />
        <meta property="og:title" content="Ravana Falls - Where Mythology Meets Nature" />
        <meta property="og:description" content="Discover Ravana Falls, the legendary waterfall where King Ravana hid Princess Sita. Experience natural pools, cave exploration, and stunning views just minutes from Ella." />
        <meta property="og:image" content="https://images.unsplash.com/photo-1609137144813-7d9921338f24?w=1200&h=630&fit=crop" />
        <link rel="canonical" href="https://www.rechargetravels.com/scenic/ravana-falls" />
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
                Ravana Falls
              </h1>
              <p className="text-xl md:text-2xl mb-8 font-light drop-shadow">
                Where Ancient Legends Meet Natural Beauty
              </p>
              <Button
                onClick={() => handleBookingClick()}
                size="lg"
                className="bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-6 text-lg rounded-full 
                         transform hover:scale-105 transition-all duration-300 shadow-xl"
              >
                <Sparkles className="mr-2 h-5 w-5" />
                Explore Mythical Falls
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
            <h2 className="text-4xl font-bold mb-6">Discover the Legend of Ravana Falls</h2>
            <p className="text-xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
              {scenicData.description}
            </p>
          </motion.div>

          {/* Quick Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12">
            {[
              { icon: Ruler, label: "Height", value: "25m" },
              { icon: Clock, label: "Visit Time", value: scenicData.duration },
              { icon: Mountain, label: "Accessibility", value: "Easy" },
              { icon: Calendar, label: "Best Time", value: "May-Sep" }
            ].map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="text-center"
              >
                <stat.icon className="h-12 w-12 text-indigo-600 mx-auto mb-3" />
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
                <CheckCircle className="h-6 w-6 text-indigo-600 mb-3" />
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
              <TabsTrigger value="mythology">Mythology</TabsTrigger>
              <TabsTrigger value="tours">Tours</TabsTrigger>
              <TabsTrigger value="tips">Visitor Tips</TabsTrigger>
            </TabsList>

            {/* Overview Tab */}
            <TabsContent value="overview" className="space-y-6">
              <div className="grid md:grid-cols-2 gap-8">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <MapPin className="h-5 w-5 mr-2 text-indigo-600" />
                      Location & Access
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600 mb-4">
                      Located in {scenicData.location}, just 6km from Ella town:
                    </p>
                    <ul className="space-y-2 text-sm">
                      <li className="flex items-start">
                        <ChevronRight className="h-4 w-4 text-indigo-600 mr-2 mt-0.5" />
                        <span>On Ella-Wellawaya main road (A23)</span>
                      </li>
                      <li className="flex items-start">
                        <ChevronRight className="h-4 w-4 text-indigo-600 mr-2 mt-0.5" />
                        <span>10 minutes from Ella by tuk-tuk</span>
                      </li>
                      <li className="flex items-start">
                        <ChevronRight className="h-4 w-4 text-indigo-600 mr-2 mt-0.5" />
                        <span>Roadside parking available</span>
                      </li>
                    </ul>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Info className="h-5 w-5 mr-2 text-indigo-600" />
                      Facilities
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
                  </CardContent>
                </Card>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Camera className="h-5 w-5 mr-2 text-indigo-600" />
                    Photography Guide
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-2 gap-4">
                    {scenicData.photographyTips.map((tip, idx) => (
                      <div key={idx} className="flex items-start">
                        <Eye className="h-4 w-4 text-indigo-600 mr-2 mt-0.5 flex-shrink-0" />
                        <span className="text-sm text-gray-600">{tip}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Mythology Tab */}
            <TabsContent value="mythology" className="space-y-6">
              <h3 className="text-2xl font-bold mb-6">The Ramayana Connection</h3>
              <div className="grid gap-4">
                {scenicData.mythology.map((myth, index) => (
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
                          <History className="h-5 w-5 text-indigo-600 mr-3 mt-0.5" />
                          <p className="text-gray-700">{myth}</p>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>

              <Card>
                <CardHeader>
                  <CardTitle>Nearby Ramayana Sites</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <h4 className="font-semibold mb-2">Within 30 minutes:</h4>
                      <ul className="space-y-1 text-sm text-gray-600">
                        <li>• Ravana Cave - Where Sita was hidden</li>
                        <li>• Seetha Amman Temple - Sita's prayer site</li>
                        <li>• Hakgala Gardens - Sita's pleasure garden</li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-2">Day trips:</h4>
                      <ul className="space-y-1 text-sm text-gray-600">
                        <li>• Divurumpola - Sita's trial by fire</li>
                        <li>• Rumassala - Hanuman's herb mountain</li>
                        <li>• Ussangoda - Ravana's aircraft landing</li>
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Tours Tab */}
            <TabsContent value="tours" className="space-y-6">
              <h3 className="text-2xl font-bold mb-6">Ravana Falls Experiences</h3>
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
                            <p className="text-2xl font-bold text-indigo-600">{tour.price}</p>
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
                                <ChevronRight className="h-4 w-4 text-indigo-600 mr-1 mt-0.5 flex-shrink-0" />
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
                            className="bg-indigo-600 hover:bg-indigo-700"
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
              <h3 className="text-2xl font-bold mb-6">Visitor Information</h3>
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
                  <CardTitle>Visitor Information</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-3 gap-6">
                    <div>
                      <h4 className="font-semibold mb-2">Entrance & Parking</h4>
                      <p className="text-sm text-gray-600">Entry: Free</p>
                      <p className="text-sm text-gray-600">Parking: {scenicData.parking.cost}</p>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-2">Best Times</h4>
                      <p className="text-sm text-gray-600">Morning: 7-9 AM</p>
                      <p className="text-sm text-gray-600">Less crowded weekdays</p>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-2">Nearby</h4>
                      <p className="text-sm text-gray-600">Ella town: 10 min</p>
                      <p className="text-sm text-gray-600">Many attractions</p>
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
              "https://images.unsplash.com/photo-1609137144813-7d9921338f24?w=400&h=300&fit=crop",
              "https://images.unsplash.com/photo-1605537040919-e46920fa3011?w=400&h=300&fit=crop",
              "https://images.unsplash.com/photo-1580619305218-8423a7ef79b4?w=400&h=300&fit=crop",
              "https://images.unsplash.com/photo-1482685945432-29a7abf21e75?w=400&h=300&fit=crop",
              "https://images.unsplash.com/photo-1493713838217-28e560b1a5b9?w=400&h=300&fit=crop",
              "https://images.unsplash.com/photo-1533709752211-118fcaf03312?w=400&h=300&fit=crop",
              "https://images.unsplash.com/photo-1523528283115-4bf9b1699245?w=400&h=300&fit=crop",
              "https://images.unsplash.com/photo-1431794062232-2a99a5431c6c?w=400&h=300&fit=crop"
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
                  alt={`Ravana Falls view ${index + 1}`}
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
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3962.7!2d81.0540!3d6.9005!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3ae4650b8f4a9f23%3A0x9a2f9c1234567890!2sRavana%20Falls!5e0!3m2!1sen!2slk!4v1234567890"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Ravana Falls Location"
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
                <AccordionTrigger className="text-left hover:text-indigo-600">
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
      <section className="py-20 px-4 bg-gradient-to-br from-indigo-600 to-purple-700">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl font-bold mb-6 text-white">
              Ready to Explore the Legendary Falls?
            </h2>
            <p className="text-xl mb-8 text-white/90">
              Experience the magic of Ravana Falls where ancient mythology 
              meets natural beauty. Book your visit today.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                size="lg"
                className="bg-white text-indigo-700 hover:bg-gray-100 px-8 py-6 text-lg"
                onClick={() => handleBookingClick()}
              >
                <Sparkles className="mr-2 h-5 w-5" />
                Book Your Visit
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
              <Phone className="h-8 w-8 mb-3 text-indigo-400" />
              <h3 className="font-semibold mb-2">Call Us</h3>
              <p className="text-gray-300">+94 76 505 9595</p>
              <p className="text-sm text-gray-400">Available 24/7</p>
            </div>
            <div className="flex flex-col items-center">
              <Mail className="h-8 w-8 mb-3 text-indigo-400" />
              <h3 className="font-semibold mb-2">Email Us</h3>
              <p className="text-gray-300">info@rechargetravels.com</p>
              <p className="text-sm text-gray-400">Quick response</p>
            </div>
            <div className="flex flex-col items-center">
              <Globe className="h-8 w-8 mb-3 text-indigo-400" />
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
        itemTitle={selectedPackage || "Ravana Falls Tour"}
      />
    </>
  );
};

export default RavanaFalls;