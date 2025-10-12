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
  Eye,
  Map,
  CloudFog
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

const EllaRock = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [selectedPackage, setSelectedPackage] = useState<string | null>(null);
  const [heroImageIndex, setHeroImageIndex] = useState(0);
  const [scenicData, setScenicData] = useState<ScenicDetail | null>(null);
  const [loading, setLoading] = useState(true);

  const heroImages = [
    {
      url: 'https://images.unsplash.com/photo-1566296314736-6eaac1ca0cb9?w=1920&h=1080&fit=crop',
      caption: 'Ella Rock Summit View'
    },
    {
      url: 'https://images.unsplash.com/photo-1542831371-29b0f74f9713?w=1920&h=1080&fit=crop',
      caption: 'Sunrise from Ella Rock'
    },
    {
      url: 'https://images.unsplash.com/photo-1445363692815-ebcd599f7621?w=1920&h=1080&fit=crop',
      caption: 'Trail Through Tea Estates'
    },
    {
      url: 'https://images.unsplash.com/photo-1464278533981-50106e6176b1?w=1920&h=1080&fit=crop',
      caption: 'Misty Mountain Views'
    }
  ];

  const defaultScenicData: ScenicDetail = {
    id: 'ella-rock',
    name: 'Ella Rock',
    description: `Ella Rock is one of Sri Lanka's most iconic hiking destinations, offering breathtaking panoramic views from its 
    1,041-meter summit. This challenging trek takes you through lush tea plantations, eucalyptus forests, and railway tracks, 
    culminating in spectacular vistas of the Ella Gap and surrounding mountains. The rock face drops dramatically on one side, 
    creating the perfect spot for sunrise photography and contemplation above the clouds.`,
    elevation: '1,041 meters (3,415 feet)',
    location: 'Ella, Badulla District',
    bestTime: 'December to March (dry season)',
    difficulty: 'Moderate to Challenging',
    duration: '4-5 hours round trip',
    highlights: [
      "Spectacular sunrise views from summit",
      "360-degree panoramic mountain vistas",
      "Trek through tea plantations",
      "Dramatic cliff-edge viewpoints",
      "Views of Ella Gap and Little Adam's Peak",
      "Railway track walking experience",
      "Cloud forest environment",
      "Photography paradise"
    ],
    trailInfo: [
      "Start from Ella Railway Station",
      "Follow tracks to Kithalella Station",
      "Turn left at tea factory junction",
      "Steep ascent through eucalyptus forest",
      "Rock scrambling near summit",
      "Multiple viewpoints at top"
    ],
    facilities: [
      "Trail markers (limited)",
      "Local guide services",
      "Small shops near start",
      "Tea shops along route",
      "Basic rest stops",
      "Mobile coverage (partial)"
    ],
    nearbyAttractions: [
      "Little Adam's Peak (30 minutes)",
      "Nine Arch Bridge",
      "Ravana Falls",
      "Ella town center",
      "Lipton's Seat (2 hours)",
      "Dowa Temple"
    ],
    photographyTips: [
      "Best light at sunrise (5:30-6:30 AM)",
      "Bring wide-angle lens for vistas",
      "Tripod essential for dawn shots",
      "Capture mist rolling through valleys",
      "Drone photography spectacular (where permitted)"
    ],
    tips: [
      "Start hike by 5 AM for sunrise",
      "Wear proper hiking boots",
      "Bring headlamp for pre-dawn start",
      "Carry minimum 2L water",
      "Pack rain gear even in dry season",
      "Download offline maps beforehand"
    ],
    entrance: {
      local: 'Free',
      foreign: 'Free'
    },
    guides: {
      available: true,
      cost: 'LKR 2,000-3,500 per group'
    }
  };

  const suggestedTours: SuggestedTour[] = [
    {
      name: "Sunrise Summit Experience",
      duration: "Half Day",
      price: "$40",
      highlights: [
        "Pre-dawn pickup from hotel",
        "Guided hike with headlamps",
        "Sunrise from summit",
        "Breakfast picnic"
      ],
      included: [
        "Hotel pickup (4:30 AM)",
        "Professional guide",
        "Headlamps",
        "Breakfast pack",
        "Hot beverages"
      ],
      difficulty: "Moderate to Challenging",
      groupSize: "2-8 people"
    },
    {
      name: "Ella Rock & Little Adam's Peak",
      duration: "Full Day",
      price: "$60",
      highlights: [
        "Two iconic peaks in one day",
        "Morning at Ella Rock",
        "Afternoon at Little Adam's Peak",
        "Valley lunch break"
      ],
      included: [
        "All transportation",
        "Expert guide",
        "Lunch",
        "Snacks & water",
        "Photography assistance"
      ],
      difficulty: "Challenging",
      groupSize: "2-10 people"
    },
    {
      name: "Photography Trek Special",
      duration: "Dawn to Noon",
      price: "$65",
      highlights: [
        "Photography-focused trek",
        "Best viewpoint guidance",
        "Composition tips",
        "Golden hour shooting"
      ],
      included: [
        "Photography guide",
        "Early transport",
        "Tripod if needed",
        "Snacks",
        "Photo location scouting"
      ],
      difficulty: "Moderate",
      groupSize: "2-6 photographers"
    },
    {
      name: "Ella Highlands Explorer",
      duration: "2 Days",
      price: "$120",
      highlights: [
        "Ella Rock sunrise",
        "Nine Arch Bridge",
        "Tea factory visit",
        "Camping option"
      ],
      included: [
        "1 night accommodation",
        "All meals",
        "Transport",
        "Guide services",
        "Entry fees"
      ],
      difficulty: "Moderate",
      groupSize: "4-12 people"
    }
  ];

  const faqs = [
    {
      question: "How difficult is the Ella Rock hike?",
      answer: "The hike is moderate to challenging, requiring good fitness. The trail includes railway tracks, steep sections, and some rock scrambling near the summit. The 4-5 hour round trip covers about 8km with significant elevation gain. Most reasonably fit people can complete it with breaks."
    },
    {
      question: "Do I need a guide for Ella Rock?",
      answer: "While not mandatory, a guide is highly recommended, especially for first-timers. The trail isn't well-marked and has several confusing junctions. Local guides know the best routes, viewpoints, and can ensure safety. They typically charge LKR 2,000-3,500 per group."
    },
    {
      question: "What's the best time to hike Ella Rock?",
      answer: "Start by 5:00 AM to reach the summit for sunrise - the views are spectacular and you'll avoid the heat. December to March offers the clearest weather. Avoid rainy days as trails become slippery and dangerous. Early morning also means fewer crowds at the viewpoints."
    },
    {
      question: "What should I bring for the Ella Rock hike?",
      answer: "Essentials include: sturdy hiking shoes, 2-3L water, snacks, headlamp (for pre-dawn starts), rain jacket, sunscreen, hat, camera, and first aid basics. Wear layers as it's cool in the morning but warms up quickly. Bring a plastic bag for any trash."
    },
    {
      question: "Is it safe to hike Ella Rock?",
      answer: "Generally yes, but take precautions. Stay on marked trails, avoid cliff edges especially in windy/wet conditions, and don't hike alone in the dark. Be careful on railway tracks - trains do pass. During monsoon season, trails can be dangerously slippery."
    },
    {
      question: "Can I see Ella Rock without hiking?",
      answer: "You can see Ella Rock from various viewpoints in Ella town and from Little Adam's Peak, but you won't get the panoramic summit views. For those unable to hike, Little Adam's Peak offers similar views with an easier 45-minute walk."
    }
  ];

  useEffect(() => {
    const fetchScenicData = async () => {
      try {
        const docRef = doc(db, 'scenicLocations', 'ella-rock');
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
        <title>Ella Rock - Sunrise Hiking Destination | Recharge Travels</title>
        <meta name="description" content="Trek to Ella Rock for breathtaking sunrise views and panoramic mountain vistas. Experience one of Sri Lanka's most rewarding hikes through tea plantations to dramatic cliff-edge viewpoints." />
        <meta name="keywords" content="Ella Rock hike, sunrise trek Sri Lanka, Ella hiking trails, mountain viewpoints, tea plantation walks, Ella Gap views, adventure hiking" />
        <meta property="og:title" content="Ella Rock - Epic Sunrise Hiking Adventure" />
        <meta property="og:description" content="Conquer Ella Rock's challenging trail for spectacular sunrise views. Trek through tea estates and forests to reach panoramic mountain vistas at 1,041 meters." />
        <meta property="og:image" content="https://images.unsplash.com/photo-1566296314736-6eaac1ca0cb9?w=1200&h=630&fit=crop" />
        <link rel="canonical" href="https://www.rechargetravels.com/scenic/ella-rock" />
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
                Ella Rock
              </h1>
              <p className="text-xl md:text-2xl mb-8 font-light drop-shadow">
                Conquer the Summit for Unforgettable Sunrise Views
              </p>
              <Button
                onClick={() => handleBookingClick()}
                size="lg"
                className="bg-orange-600 hover:bg-orange-700 text-white px-8 py-6 text-lg rounded-full 
                         transform hover:scale-105 transition-all duration-300 shadow-xl"
              >
                <Sunrise className="mr-2 h-5 w-5" />
                Book Sunrise Trek
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
            <h2 className="text-4xl font-bold mb-6">Discover Ella Rock</h2>
            <p className="text-xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
              {scenicData.description}
            </p>
          </motion.div>

          {/* Quick Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12">
            {[
              { icon: Mountain, label: "Elevation", value: "1,041m" },
              { icon: Clock, label: "Duration", value: scenicData.duration },
              { icon: Footprints, label: "Difficulty", value: "Moderate+" },
              { icon: Calendar, label: "Best Time", value: "Dec-Mar" }
            ].map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="text-center"
              >
                <stat.icon className="h-12 w-12 text-orange-600 mx-auto mb-3" />
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
          <h2 className="text-3xl font-bold text-center mb-12">Trek Highlights</h2>
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
                <CheckCircle className="h-6 w-6 text-orange-600 mb-3" />
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
              <TabsTrigger value="trail">Trail Info</TabsTrigger>
              <TabsTrigger value="tours">Guided Tours</TabsTrigger>
              <TabsTrigger value="tips">Hiking Tips</TabsTrigger>
            </TabsList>

            {/* Overview Tab */}
            <TabsContent value="overview" className="space-y-6">
              <div className="grid md:grid-cols-2 gap-8">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <MapPin className="h-5 w-5 mr-2 text-orange-600" />
                      Location & Access
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600 mb-4">
                      Located in {scenicData.location}, Ella Rock is accessible via:
                    </p>
                    <ul className="space-y-2 text-sm">
                      <li className="flex items-start">
                        <ChevronRight className="h-4 w-4 text-orange-600 mr-2 mt-0.5" />
                        <span>Start from Ella Railway Station</span>
                      </li>
                      <li className="flex items-start">
                        <ChevronRight className="h-4 w-4 text-orange-600 mr-2 mt-0.5" />
                        <span>Walk along railway tracks (1.5km)</span>
                      </li>
                      <li className="flex items-start">
                        <ChevronRight className="h-4 w-4 text-orange-600 mr-2 mt-0.5" />
                        <span>Alternative route via Waterfall Road</span>
                      </li>
                    </ul>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Info className="h-5 w-5 mr-2 text-orange-600" />
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
                    <Camera className="h-5 w-5 mr-2 text-orange-600" />
                    Photography Guide
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-2 gap-4">
                    {scenicData.photographyTips.map((tip, idx) => (
                      <div key={idx} className="flex items-start">
                        <Eye className="h-4 w-4 text-orange-600 mr-2 mt-0.5 flex-shrink-0" />
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
                    <Compass className="h-5 w-5 mr-2 text-orange-600" />
                    Step-by-Step Trail Guide
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ol className="space-y-3">
                    {scenicData.trailInfo.map((step, index) => (
                      <li key={index} className="flex items-start">
                        <span className="font-bold text-orange-600 mr-3">{index + 1}.</span>
                        <span className="text-gray-700">{step}</span>
                      </li>
                    ))}
                  </ol>
                </CardContent>
              </Card>

              <div className="grid md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Trail Conditions</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2 text-sm">
                      <li className="flex items-center">
                        <TreePine className="h-4 w-4 text-green-600 mr-2" />
                        <span>Mixed terrain: tracks, forest, rock</span>
                      </li>
                      <li className="flex items-center">
                        <CloudFog className="h-4 w-4 text-gray-600 mr-2" />
                        <span>Often misty in early morning</span>
                      </li>
                      <li className="flex items-center">
                        <Wind className="h-4 w-4 text-blue-600 mr-2" />
                        <span>Windy at summit - secure loose items</span>
                      </li>
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
                          <Map className="h-4 w-4 text-orange-600 mr-2" />
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
              <h3 className="text-2xl font-bold mb-6">Guided Trek Options</h3>
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
                            <p className="text-2xl font-bold text-orange-600">{tour.price}</p>
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
                                <ChevronRight className="h-4 w-4 text-orange-600 mr-1 mt-0.5 flex-shrink-0" />
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
                            className="bg-orange-600 hover:bg-orange-700"
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
              <h3 className="text-2xl font-bold mb-6">Essential Hiking Tips</h3>
              <div className="grid md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Sunrise className="h-5 w-5 mr-2 text-orange-600" />
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
                      <Mountain className="h-5 w-5 mr-2 text-green-600" />
                      During Your Hike
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-3">
                      {scenicData.tips.slice(3).map((tip, idx) => (
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
                  <CardTitle>Guide Services & Costs</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-3 gap-6">
                    <div>
                      <h4 className="font-semibold mb-2">Trail Access</h4>
                      <p className="text-sm text-gray-600">Free public access</p>
                      <p className="text-sm text-gray-600">No permits required</p>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-2">Guide Services</h4>
                      <p className="text-sm text-gray-600">{scenicData.guides.cost}</p>
                      <p className="text-sm text-gray-500 mt-1">Recommended for safety</p>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-2">Best Months</h4>
                      <p className="text-sm text-gray-600">December - March</p>
                      <p className="text-sm text-gray-600">Avoid monsoon season</p>
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
              "https://images.unsplash.com/photo-1566296314736-6eaac1ca0cb9?w=400&h=300&fit=crop",
              "https://images.unsplash.com/photo-1542831371-29b0f74f9713?w=400&h=300&fit=crop",
              "https://images.unsplash.com/photo-1445363692815-ebcd599f7621?w=400&h=300&fit=crop",
              "https://images.unsplash.com/photo-1464278533981-50106e6176b1?w=400&h=300&fit=crop",
              "https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=400&h=300&fit=crop",
              "https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=400&h=300&fit=crop",
              "https://images.unsplash.com/photo-1465146344425-f00d5f5c8f07?w=400&h=300&fit=crop",
              "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop"
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
                  alt={`Ella Rock view ${index + 1}`}
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
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d15847.5!2d81.0460!3d6.8749!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3ae465505f6c5225%3A0x8e5e2b1b3f6e6c73!2sElla%20Rock!5e0!3m2!1sen!2slk!4v1234567890"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Ella Rock Location"
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
                <AccordionTrigger className="text-left hover:text-orange-600">
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
      <section className="py-20 px-4 bg-gradient-to-br from-orange-600 to-red-700">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl font-bold mb-6 text-white">
              Ready to Conquer Ella Rock?
            </h2>
            <p className="text-xl mb-8 text-white/90">
              Join us for an unforgettable sunrise trek to one of Sri Lanka's most 
              spectacular viewpoints. Experience the magic above the clouds.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                size="lg"
                className="bg-white text-orange-700 hover:bg-gray-100 px-8 py-6 text-lg"
                onClick={() => handleBookingClick()}
              >
                <Sunrise className="mr-2 h-5 w-5" />
                Book Your Trek
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
              <Phone className="h-8 w-8 mb-3 text-orange-400" />
              <h3 className="font-semibold mb-2">Call Us</h3>
              <p className="text-gray-300">+94 76 505 9595</p>
              <p className="text-sm text-gray-400">Available 24/7</p>
            </div>
            <div className="flex flex-col items-center">
              <Mail className="h-8 w-8 mb-3 text-orange-400" />
              <h3 className="font-semibold mb-2">Email Us</h3>
              <p className="text-gray-300">info@rechargetravels.com</p>
              <p className="text-sm text-gray-400">Quick response</p>
            </div>
            <div className="flex flex-col items-center">
              <Globe className="h-8 w-8 mb-3 text-orange-400" />
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
        itemTitle={selectedPackage || "Ella Rock Sunrise Trek"}
      />
    </>
  );
};

export default EllaRock;