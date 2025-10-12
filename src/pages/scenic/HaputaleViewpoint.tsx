import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Mountain,
  Cloud,
  Camera,
  Clock,
  MapPin,
  Calendar,
  Star,
  Users,
  Eye,
  Sunrise,
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
  Thermometer,
  Map,
  TreePine
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
  visibility: string;
  temperature: string;
  highlights: string[];
  viewpoints: string[];
  facilities: string[];
  nearbyAttractions: string[];
  photographyTips: string[];
  tips: string[];
  entrance: {
    local: string;
    foreign: string;
  };
  transport: {
    fromElla: string;
    fromBandarawela: string;
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

const HaputaleViewpoint = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [selectedPackage, setSelectedPackage] = useState<string | null>(null);
  const [heroImageIndex, setHeroImageIndex] = useState(0);
  const [scenicData, setScenicData] = useState<ScenicDetail | null>(null);
  const [loading, setLoading] = useState(true);

  const heroImages = [
    {
      url: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1920&h=1080&fit=crop',
      caption: 'Misty Mountains of Haputale'
    },
    {
      url: 'https://images.unsplash.com/photo-1519904981063-b0cf448d479e?w=1920&h=1080&fit=crop',
      caption: 'Sunrise Over the Clouds'
    },
    {
      url: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=1920&h=1080&fit=crop',
      caption: 'Panoramic Valley Views'
    },
    {
      url: 'https://images.unsplash.com/photo-1486870591958-9b9d0d1dda99?w=1920&h=1080&fit=crop',
      caption: 'Tea Plantations Below'
    }
  ];

  const defaultScenicData: ScenicDetail = {
    id: 'haputale-viewpoint',
    name: 'Haputale Viewpoint',
    description: `Perched at an elevation of 1,431 meters, Haputale offers some of the most breathtaking panoramic views in Sri Lanka. 
    On clear days, visibility extends over 80 kilometers, revealing a stunning tapestry of mountains, valleys, tea plantations, 
    and distant coastal plains. The town's strategic location on a mountain ridge provides 360-degree views, making it a 
    photographer's paradise and a haven for those seeking dramatic misty landscapes and spectacular sunrises.`,
    elevation: '1,431 meters (4,695 feet)',
    location: 'Haputale, Badulla District',
    bestTime: 'December to March (clearest views)',
    visibility: 'Up to 80km on clear days',
    temperature: '15-25°C year-round',
    highlights: [
      "360-degree panoramic mountain views",
      "Dramatic misty morning landscapes",
      "Views of tea plantations stretching to horizon",
      "Spectacular sunrise and sunset vistas",
      "Cool mountain climate year-round",
      "Lipton's Seat nearby (highest viewpoint)",
      "Traditional hill country town atmosphere",
      "Cloud forest hiking trails"
    ],
    viewpoints: [
      "Lipton's Seat - Sir Thomas Lipton's favorite spot",
      "Adisham Bungalow viewpoint",
      "Thangamale Sanctuary views",
      "Dambatenne Tea Factory overlook",
      "St. Andrew's Church hill",
      "Haputale Gap - dramatic cliff edge"
    ],
    facilities: [
      "Multiple viewpoint platforms",
      "Local restaurants and cafes",
      "Accommodation options",
      "Transport services",
      "Guide services",
      "Small shops and markets"
    ],
    nearbyAttractions: [
      "Lipton's Seat (7km)",
      "Dambatenne Tea Factory",
      "Adisham Bungalow",
      "Thangamale Bird Sanctuary",
      "Diyaluma Falls (30 minutes)",
      "Bambarakanda Falls (45 minutes)"
    ],
    photographyTips: [
      "Visit at sunrise for golden hour shots",
      "Bring wide-angle lens for panoramas",
      "Use polarizing filter to cut haze",
      "Capture mist rolling through valleys",
      "Best clarity after morning rain"
    ],
    tips: [
      "Start early for clearest mountain views",
      "Bring warm clothing for cool mornings",
      "Check weather forecast for visibility",
      "Hire local transport to reach viewpoints",
      "Carry water and snacks for hikes",
      "Respect private property boundaries"
    ],
    entrance: {
      local: 'Free (public viewpoints)',
      foreign: 'Free (public viewpoints)'
    },
    transport: {
      fromElla: '1 hour by train/bus',
      fromBandarawela: '30 minutes by bus'
    }
  };

  const suggestedTours: SuggestedTour[] = [
    {
      name: "Sunrise Viewpoint Tour",
      duration: "Half Day",
      price: "$35",
      highlights: [
        "Pre-dawn pickup from hotel",
        "Visit Lipton's Seat for sunrise",
        "Tea factory tour",
        "Traditional breakfast"
      ],
      included: [
        "Transportation",
        "Guide service",
        "Breakfast",
        "Tea tasting",
        "Photography assistance"
      ],
      difficulty: "Easy",
      groupSize: "2-8 people"
    },
    {
      name: "Hill Country Explorer",
      duration: "Full Day",
      price: "$65",
      highlights: [
        "Multiple viewpoint visits",
        "Adisham Bungalow tour",
        "Local village experience",
        "Tea plantation walk"
      ],
      included: [
        "All transport",
        "Professional guide",
        "Lunch",
        "Entry fees",
        "Tea & snacks"
      ],
      difficulty: "Moderate",
      groupSize: "2-12 people"
    },
    {
      name: "Photography Masterclass",
      duration: "Dawn to Dusk",
      price: "$85",
      highlights: [
        "Professional photography guide",
        "Best viewpoint access",
        "Landscape techniques",
        "Post-processing tips"
      ],
      included: [
        "Photography expert",
        "4WD transport",
        "Meals",
        "Tripod if needed",
        "Digital tips guide"
      ],
      difficulty: "Easy to Moderate",
      groupSize: "2-6 photographers"
    },
    {
      name: "Haputale & Waterfalls Combo",
      duration: "Full Day",
      price: "$75",
      highlights: [
        "Morning viewpoints tour",
        "Visit Diyaluma Falls",
        "Natural infinity pools",
        "Scenic train ride option"
      ],
      included: [
        "Transport",
        "Guide",
        "Breakfast & lunch",
        "Safety equipment",
        "Train tickets"
      ],
      difficulty: "Moderate",
      groupSize: "2-10 people"
    }
  ];

  const faqs = [
    {
      question: "What's the best time to visit Haputale for clear views?",
      answer: "The clearest views are typically from December to March during the dry season. Early mornings (5:30-8:00 AM) offer the best visibility before clouds roll in. After heavy rain, the following morning often provides exceptionally clear panoramic views."
    },
    {
      question: "How do I get to Lipton's Seat from Haputale?",
      answer: "Lipton's Seat is 7km from Haputale town. You can hire a tuk-tuk (LKR 1,500-2,000 round trip), take a guided tour, or trek through tea estates. The road is steep and winding. Most visitors leave by 5:00 AM to catch the sunrise."
    },
    {
      question: "What should I wear when visiting Haputale?",
      answer: "Haputale's elevation means cool temperatures year-round (15-25°C). Bring layers including a warm jacket for early mornings, comfortable walking shoes, and rain protection. The weather can change quickly in the mountains."
    },
    {
      question: "Is it worth visiting Haputale on a cloudy day?",
      answer: "Even on cloudy days, Haputale offers a unique experience with dramatic mist-covered landscapes. The clouds create mystical atmospheres perfect for photography. However, for panoramic views, check weather forecasts and plan accordingly."
    },
    {
      question: "What are the must-visit viewpoints around Haputale?",
      answer: "Don't miss Lipton's Seat (best sunrise spot), Haputale Gap for dramatic cliff views, Adisham Bungalow gardens, and the viewpoint near St. Andrew's Church. Each offers unique perspectives of the surrounding landscape."
    },
    {
      question: "Can I visit tea factories near Haputale?",
      answer: "Yes! Dambatenne Tea Factory, established by Sir Thomas Lipton, offers tours showing the tea-making process. It's near Lipton's Seat and provides stunning views. Tours run from 8:00 AM to 3:00 PM, except Sundays and Mondays."
    }
  ];

  useEffect(() => {
    const fetchScenicData = async () => {
      try {
        const docRef = doc(db, 'scenicLocations', 'haputale-viewpoint');
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
        <title>Haputale Viewpoint - Misty Hill Views | Recharge Travels</title>
        <meta name="description" content="Experience breathtaking panoramic views from Haputale. 360-degree vistas of mountains, tea plantations, and valleys. Visit Lipton's Seat and enjoy cool mountain climate." />
        <meta name="keywords" content="Haputale viewpoint, Lipton's Seat, Sri Lanka hill country, mountain views, tea plantations, panoramic vistas, sunrise tours, misty landscapes" />
        <meta property="og:title" content="Haputale Viewpoint - Spectacular Mountain Vistas" />
        <meta property="og:description" content="Discover Haputale's 360-degree panoramic views at 1,431m elevation. Experience misty landscapes, tea plantations, and dramatic sunrise vistas in Sri Lanka's hill country." />
        <meta property="og:image" content="https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1200&h=630&fit=crop" />
        <link rel="canonical" href="https://www.rechargetravels.com/scenic/haputale-viewpoint" />
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
                Haputale Viewpoint
              </h1>
              <p className="text-xl md:text-2xl mb-8 font-light drop-shadow">
                Where Earth Meets Sky - Panoramic Hill Country Vistas
              </p>
              <Button
                onClick={() => handleBookingClick()}
                size="lg"
                className="bg-purple-600 hover:bg-purple-700 text-white px-8 py-6 text-lg rounded-full 
                         transform hover:scale-105 transition-all duration-300 shadow-xl"
              >
                <Mountain className="mr-2 h-5 w-5" />
                Book Viewpoint Tour
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
            <h2 className="text-4xl font-bold mb-6">Above the Clouds in Haputale</h2>
            <p className="text-xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
              {scenicData.description}
            </p>
          </motion.div>

          {/* Quick Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12">
            {[
              { icon: Mountain, label: "Elevation", value: "1,431m" },
              { icon: Eye, label: "Visibility", value: scenicData.visibility },
              { icon: Thermometer, label: "Temperature", value: scenicData.temperature },
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
                <stat.icon className="h-12 w-12 text-purple-600 mx-auto mb-3" />
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
                <CheckCircle className="h-6 w-6 text-purple-600 mb-3" />
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
              <TabsTrigger value="viewpoints">Viewpoints</TabsTrigger>
              <TabsTrigger value="tours">Tours</TabsTrigger>
              <TabsTrigger value="tips">Travel Tips</TabsTrigger>
            </TabsList>

            {/* Overview Tab */}
            <TabsContent value="overview" className="space-y-6">
              <div className="grid md:grid-cols-2 gap-8">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <MapPin className="h-5 w-5 mr-2 text-purple-600" />
                      Location & Access
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600 mb-4">
                      Located in {scenicData.location}, Haputale is accessible via:
                    </p>
                    <ul className="space-y-2 text-sm">
                      <li className="flex items-start">
                        <ChevronRight className="h-4 w-4 text-purple-600 mr-2 mt-0.5" />
                        <span>From Ella: {scenicData.transport.fromElla}</span>
                      </li>
                      <li className="flex items-start">
                        <ChevronRight className="h-4 w-4 text-purple-600 mr-2 mt-0.5" />
                        <span>From Bandarawela: {scenicData.transport.fromBandarawela}</span>
                      </li>
                      <li className="flex items-start">
                        <ChevronRight className="h-4 w-4 text-purple-600 mr-2 mt-0.5" />
                        <span>Scenic train route available</span>
                      </li>
                    </ul>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Info className="h-5 w-5 mr-2 text-purple-600" />
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
                    <Camera className="h-5 w-5 mr-2 text-purple-600" />
                    Photography Guide
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-2 gap-4">
                    {scenicData.photographyTips.map((tip, idx) => (
                      <div key={idx} className="flex items-start">
                        <Eye className="h-4 w-4 text-purple-600 mr-2 mt-0.5 flex-shrink-0" />
                        <span className="text-sm text-gray-600">{tip}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Viewpoints Tab */}
            <TabsContent value="viewpoints" className="space-y-6">
              <h3 className="text-2xl font-bold mb-6">Famous Viewpoints</h3>
              <div className="grid gap-4">
                {scenicData.viewpoints.map((viewpoint, index) => (
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
                          <Eye className="h-5 w-5 text-purple-600 mr-3 mt-0.5" />
                          <div>
                            <p className="font-semibold text-gray-800">{viewpoint}</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>

              <Card>
                <CardHeader>
                  <CardTitle>Nearby Attractions</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-2 gap-4">
                    {scenicData.nearbyAttractions.map((attraction, idx) => (
                      <div key={idx} className="flex items-center">
                        <Map className="h-4 w-4 text-purple-600 mr-2" />
                        <span className="text-gray-700">{attraction}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Tours Tab */}
            <TabsContent value="tours" className="space-y-6">
              <h3 className="text-2xl font-bold mb-6">Viewpoint Tour Packages</h3>
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
                            <p className="text-2xl font-bold text-purple-600">{tour.price}</p>
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
                                <ChevronRight className="h-4 w-4 text-purple-600 mr-1 mt-0.5 flex-shrink-0" />
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
                            className="bg-purple-600 hover:bg-purple-700"
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
                      <Sunrise className="h-5 w-5 mr-2 text-orange-600" />
                      Best Viewing Times
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-3">
                      <li className="flex items-start">
                        <Info className="h-5 w-5 text-orange-600 mr-2 mt-0.5 flex-shrink-0" />
                        <span className="text-sm">Sunrise (5:30-7:00 AM) for clearest views</span>
                      </li>
                      <li className="flex items-start">
                        <Info className="h-5 w-5 text-orange-600 mr-2 mt-0.5 flex-shrink-0" />
                        <span className="text-sm">Early morning before clouds roll in</span>
                      </li>
                      <li className="flex items-start">
                        <Info className="h-5 w-5 text-orange-600 mr-2 mt-0.5 flex-shrink-0" />
                        <span className="text-sm">Evening for sunset colors</span>
                      </li>
                    </ul>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Cloud className="h-5 w-5 mr-2 text-blue-600" />
                      Weather Considerations
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
                  <CardTitle>Climate & Clothing</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-3 gap-6">
                    <div>
                      <h4 className="font-semibold mb-2">Temperature</h4>
                      <p className="text-sm text-gray-600">Day: 20-25°C</p>
                      <p className="text-sm text-gray-600">Night: 10-15°C</p>
                      <p className="text-sm text-gray-600">Early morning: 8-12°C</p>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-2">What to Wear</h4>
                      <p className="text-sm text-gray-600">Layered clothing</p>
                      <p className="text-sm text-gray-600">Warm jacket</p>
                      <p className="text-sm text-gray-600">Comfortable shoes</p>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-2">Essentials</h4>
                      <p className="text-sm text-gray-600">Rain protection</p>
                      <p className="text-sm text-gray-600">Sun protection</p>
                      <p className="text-sm text-gray-600">Camera gear</p>
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
          <h2 className="text-3xl font-bold text-center mb-12">Haputale Gallery</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {[
              "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop",
              "https://images.unsplash.com/photo-1519904981063-b0cf448d479e?w=400&h=300&fit=crop",
              "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=400&h=300&fit=crop",
              "https://images.unsplash.com/photo-1486870591958-9b9d0d1dda99?w=400&h=300&fit=crop",
              "https://images.unsplash.com/photo-1540979388789-6cee28a1cdc9?w=400&h=300&fit=crop",
              "https://images.unsplash.com/photo-1444927714506-8492d94b4e3d?w=400&h=300&fit=crop",
              "https://images.unsplash.com/photo-1454391304352-2bf4678b1a7a?w=400&h=300&fit=crop",
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
                  alt={`Haputale view ${index + 1}`}
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
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d15843.5!2d80.9567!3d6.7684!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3ae3a30b8d914e3d%3A0x9a8e97d5f5f8a183!2sHaputale!5e0!3m2!1sen!2slk!4v1234567890"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Haputale Location"
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
              Ready to Touch the Clouds?
            </h2>
            <p className="text-xl mb-8 text-white/90">
              Experience the breathtaking beauty of Haputale's mountain vistas. 
              Book your viewpoint tour for unforgettable panoramic views.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                size="lg"
                className="bg-white text-purple-700 hover:bg-gray-100 px-8 py-6 text-lg"
                onClick={() => handleBookingClick()}
              >
                <Mountain className="mr-2 h-5 w-5" />
                Book Your Tour
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
        itemTitle={selectedPackage || "Haputale Viewpoint Tour"}
      />
    </>
  );
};

export default HaputaleViewpoint;