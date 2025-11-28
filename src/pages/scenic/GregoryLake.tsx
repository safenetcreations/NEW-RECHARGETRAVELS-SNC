import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Waves,
  Sailboat,
  Camera,
  Clock,
  MapPin,
  Calendar,
  Star,
  Users,
  TreePine,
  Bike,
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
  Anchor,
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
  lakeSize: string;
  location: string;
  bestTime: string;
  altitude: string;
  temperature: string;
  highlights: string[];
  activities: string[];
  facilities: string[];
  nearbyAttractions: string[];
  boatingInfo: string[];
  tips: string[];
  entrance: {
    local: string;
    foreign: string;
  };
  activityPrices: {
    boating: string;
    cycling: string;
    horseRiding: string;
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

const GregoryLake = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [selectedPackage, setSelectedPackage] = useState<string | null>(null);
  const [heroImageIndex, setHeroImageIndex] = useState(0);
  const [scenicData, setScenicData] = useState<ScenicDetail | null>(null);
  const [loading, setLoading] = useState(true);

  const heroImages = [
    {
      url: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=1920&h=1080&fit=crop',
      caption: 'Gregory Lake at Sunset'
    },
    {
      url: 'https://images.unsplash.com/photo-1600298881974-6be191ceeda1?w=1920&h=1080&fit=crop',
      caption: 'Boating on Gregory Lake'
    },
    {
      url: 'https://images.unsplash.com/photo-1517654443271-11c621d1e9ce?w=1920&h=1080&fit=crop',
      caption: 'Lake View Park'
    },
    {
      url: 'https://images.unsplash.com/photo-1580223267446-8ce868a81a63?w=1920&h=1080&fit=crop',
      caption: 'Morning Mist on Lake'
    }
  ];

  const defaultScenicData: ScenicDetail = {
    id: 'gregory-lake',
    name: 'Gregory Lake',
    description: `Gregory Lake is a stunning man-made reservoir in the heart of Nuwara Eliya, created in 1873 during the British colonial period. 
    This picturesque lake spans 91 hectares and serves as a recreational hub, offering boating, cycling, and leisurely walks along its 
    tree-lined shores. Surrounded by mountains and often shrouded in mist, the lake provides a serene escape with cool temperatures and 
    English countryside charm that makes Nuwara Eliya famous as 'Little England'.`,
    lakeSize: '91 hectares',
    location: 'Nuwara Eliya City Center',
    bestTime: 'Year-round (avoid heavy rains)',
    altitude: '1,868 meters (6,128 feet)',
    temperature: '10-20°C year-round',
    highlights: [
      "Scenic boat rides on calm waters",
      "Lakeside cycling path",
      "Horse riding along the shore",
      "Gregory Lake Park with gardens",
      "Mountain views from all angles",
      "Cool climate perfect for activities",
      "Swan boats and speed boats available",
      "Beautiful sunset views"
    ],
    activities: [
      "Pedal boating",
      "Speed boat rides",
      "Jet skiing",
      "Cycling around lake",
      "Horse riding",
      "Walking/jogging path",
      "Picnicking",
      "Photography"
    ],
    facilities: [
      "Boat rental services",
      "Bicycle rental shops",
      "Horse riding club",
      "Food courts and cafes",
      "Children's play area",
      "Public restrooms",
      "Parking areas",
      "Walking paths"
    ],
    nearbyAttractions: [
      "Victoria Park (10 minutes walk)",
      "Nuwara Eliya Golf Club",
      "Single Tree Hill",
      "Grand Hotel",
      "Post Office",
      "Market area",
      "Galway's Land Bird Sanctuary",
      "Seetha Amman Temple (20 minutes)"
    ],
    boatingInfo: [
      "Pedal boats: 30-60 minutes sessions",
      "Speed boats: 10-15 minute rides",
      "Swan boats for families",
      "Jet ski rentals available",
      "Life jackets provided",
      "Operating hours: 9 AM - 6 PM"
    ],
    tips: [
      "Visit early morning for mist-covered views",
      "Bring warm clothing year-round",
      "Book boat rides in advance on weekends",
      "Try local food at lakeside stalls",
      "Best photography during golden hour",
      "Avoid monsoon season for water activities"
    ],
    entrance: {
      local: 'LKR 50',
      foreign: 'LKR 100'
    },
    activityPrices: {
      boating: 'LKR 500-2,000 per ride',
      cycling: 'LKR 300-500 per hour',
      horseRiding: 'LKR 1,500-3,000 per round'
    }
  };

  const suggestedTours: SuggestedTour[] = [
    {
      name: "Lake Adventure Package",
      duration: "Half Day",
      price: "$35",
      highlights: [
        "Speed boat experience",
        "Cycling tour around lake",
        "Visit Gregory Lake Park",
        "Tea and snacks included"
      ],
      included: [
        "All activity tickets",
        "Bicycle rental",
        "Boat rides",
        "Guide service",
        "Refreshments"
      ],
      difficulty: "Easy",
      groupSize: "2-8 people"
    },
    {
      name: "Nuwara Eliya City & Lake Tour",
      duration: "Full Day",
      price: "$65",
      highlights: [
        "Gregory Lake activities",
        "Victoria Park visit",
        "City colonial tour",
        "High tea experience"
      ],
      included: [
        "Transport",
        "All entrance fees",
        "Lunch",
        "High tea",
        "Professional guide"
      ],
      difficulty: "Easy",
      groupSize: "2-12 people"
    },
    {
      name: "Romantic Lake Evening",
      duration: "3 Hours",
      price: "$55",
      highlights: [
        "Private boat ride",
        "Sunset viewing",
        "Lakeside dinner setup",
        "Photography session"
      ],
      included: [
        "Private boat",
        "Dinner for two",
        "Photographer",
        "Special decorations",
        "Pickup/drop"
      ],
      difficulty: "Easy",
      groupSize: "Couples"
    },
    {
      name: "Family Fun Day",
      duration: "Full Day",
      price: "$120 (family of 4)",
      highlights: [
        "All lake activities",
        "Children's playground",
        "Family picnic setup",
        "Horse riding for kids"
      ],
      included: [
        "All activities",
        "Picnic lunch",
        "Snacks & drinks",
        "Family photos",
        "Kids entertainment"
      ],
      difficulty: "Easy",
      groupSize: "Families"
    }
  ];

  const faqs = [
    {
      question: "What are the best activities at Gregory Lake?",
      answer: "Popular activities include pedal boating, speed boat rides, jet skiing, cycling around the 3.5km lake path, and horse riding. The lake also offers swan boats for families with children. Walking or jogging along the lakeside path is free and offers beautiful views."
    },
    {
      question: "What is the best time to visit Gregory Lake?",
      answer: "Gregory Lake can be visited year-round, but the best time is from January to March and July to September when rainfall is minimal. Early mornings offer misty, magical views, while evenings are perfect for sunset boat rides. Avoid heavy monsoon periods for water activities."
    },
    {
      question: "How much do activities cost at Gregory Lake?",
      answer: "Entry fee is LKR 50 for locals and LKR 100 for foreigners. Boat rides range from LKR 500-2,000 depending on type and duration. Bicycle rentals cost LKR 300-500 per hour, and horse riding is LKR 1,500-3,000 per round. Food and drinks are available at reasonable prices."
    },
    {
      question: "Is Gregory Lake suitable for children?",
      answer: "Yes, Gregory Lake is very family-friendly. There's a children's playground, safe pedal boats and swan boats for families, and the cycling path is suitable for older children. Horse riding with guides is available for children. Always supervise children near water."
    },
    {
      question: "What should I wear when visiting Gregory Lake?",
      answer: "Nuwara Eliya is cold year-round (10-20°C), so bring warm clothing including jackets, long pants, and closed shoes. For water activities, you might want to bring a change of clothes. The weather can change quickly, so layers are recommended."
    },
    {
      question: "Are there dining options at Gregory Lake?",
      answer: "Yes, there are several food courts and cafes around the lake offering local and international cuisine. You'll find everything from Sri Lankan rice and curry to sandwiches and hot beverages. Many visitors enjoy hot tea or coffee while enjoying the lake views."
    }
  ];

  useEffect(() => {
    const fetchScenicData = async () => {
      try {
        const docRef = doc(db, 'scenicLocations', 'gregory-lake');
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
        <title>Gregory Lake - Boating in Nuwara Eliya | Recharge Travels</title>
        <meta name="description" content="Experience Gregory Lake in Nuwara Eliya with boating, cycling, and horse riding. Enjoy cool climate activities at this scenic 91-hectare lake surrounded by mountains." />
        <meta name="keywords" content="Gregory Lake, Nuwara Eliya lake, boating Sri Lanka, cycling Gregory Lake, horse riding, lake activities, Little England, cool climate destinations" />
        <meta property="og:title" content="Gregory Lake - Scenic Lake Activities in Nuwara Eliya" />
        <meta property="og:description" content="Discover Gregory Lake's boating, cycling, and recreational activities. Experience the cool climate charm of Nuwara Eliya's iconic lake with mountain views." />
        <meta property="og:image" content="https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=1200&h=630&fit=crop" />
        <link rel="canonical" href="https://www.rechargetravels.com/scenic/gregory-lake" />
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
                Gregory Lake
              </h1>
              <p className="text-xl md:text-2xl mb-8 font-light drop-shadow">
                Nuwara Eliya's Scenic Lake Paradise
              </p>
              <Button
                onClick={() => handleBookingClick()}
                size="lg"
                className="bg-sky-600 hover:bg-sky-700 text-white px-8 py-6 text-lg rounded-full 
                         transform hover:scale-105 transition-all duration-300 shadow-xl"
              >
                <Sailboat className="mr-2 h-5 w-5" />
                Book Lake Activities
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
            <h2 className="text-4xl font-bold mb-6">Welcome to Gregory Lake</h2>
            <p className="text-xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
              {scenicData.description}
            </p>
          </motion.div>

          {/* Quick Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12">
            {[
              { icon: Waves, label: "Lake Size", value: scenicData.lakeSize },
              { icon: TreePine, label: "Altitude", value: "1,868m" },
              { icon: Wind, label: "Temperature", value: scenicData.temperature },
              { icon: Calendar, label: "Best Time", value: "Year-round" }
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

      {/* Highlights Section */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">Lake Highlights</h2>
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
                <CheckCircle className="h-6 w-6 text-sky-600 mb-3" />
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
              <TabsTrigger value="tips">Visitor Tips</TabsTrigger>
            </TabsList>

            {/* Overview Tab */}
            <TabsContent value="overview" className="space-y-6">
              <div className="grid md:grid-cols-2 gap-8">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <MapPin className="h-5 w-5 mr-2 text-sky-600" />
                      Location & Access
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600 mb-4">
                      Located in {scenicData.location}, Gregory Lake is easily accessible:
                    </p>
                    <ul className="space-y-2 text-sm">
                      <li className="flex items-start">
                        <ChevronRight className="h-4 w-4 text-sky-600 mr-2 mt-0.5" />
                        <span>Walking distance from city center</span>
                      </li>
                      <li className="flex items-start">
                        <ChevronRight className="h-4 w-4 text-sky-600 mr-2 mt-0.5" />
                        <span>Tuk-tuk from anywhere in Nuwara Eliya</span>
                      </li>
                      <li className="flex items-start">
                        <ChevronRight className="h-4 w-4 text-sky-600 mr-2 mt-0.5" />
                        <span>Ample parking available</span>
                      </li>
                    </ul>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Info className="h-5 w-5 mr-2 text-sky-600" />
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
                    <Anchor className="h-5 w-5 mr-2 text-sky-600" />
                    Boating Information
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-2 gap-4">
                    {scenicData.boatingInfo.map((info, idx) => (
                      <div key={idx} className="flex items-start">
                        <Sailboat className="h-4 w-4 text-sky-600 mr-2 mt-0.5 flex-shrink-0" />
                        <span className="text-sm text-gray-600">{info}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Activities Tab */}
            <TabsContent value="activities" className="space-y-6">
              <h3 className="text-2xl font-bold mb-6">Lake Activities</h3>
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
                      <Waves className="h-6 w-6 text-sky-600 mr-3" />
                      <h4 className="font-semibold text-lg">{activity}</h4>
                    </div>
                  </motion.div>
                ))}
              </div>

              <Card>
                <CardHeader>
                  <CardTitle>Activity Pricing</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-3 gap-4">
                    <div>
                      <h4 className="font-semibold mb-2 flex items-center">
                        <Sailboat className="h-5 w-5 mr-2" />
                        Boating
                      </h4>
                      <p className="text-sm text-gray-600">{scenicData.activityPrices.boating}</p>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-2 flex items-center">
                        <Bike className="h-5 w-5 mr-2" />
                        Cycling
                      </h4>
                      <p className="text-sm text-gray-600">{scenicData.activityPrices.cycling}</p>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-2 flex items-center">
                        <Users className="h-5 w-5 mr-2" />
                        Horse Riding
                      </h4>
                      <p className="text-sm text-gray-600">{scenicData.activityPrices.horseRiding}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Nearby Attractions</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-2 gap-4">
                    {scenicData.nearbyAttractions.map((attraction, idx) => (
                      <div key={idx} className="flex items-center">
                        <Map className="h-4 w-4 text-sky-600 mr-2" />
                        <span className="text-gray-700">{attraction}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Tours Tab */}
            <TabsContent value="tours" className="space-y-6">
              <h3 className="text-2xl font-bold mb-6">Lake Experience Packages</h3>
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
                            <p className="text-2xl font-bold text-sky-600">{tour.price}</p>
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
                                <ChevronRight className="h-4 w-4 text-sky-600 mr-1 mt-0.5 flex-shrink-0" />
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
                            className="bg-sky-600 hover:bg-sky-700"
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
              <h3 className="text-2xl font-bold mb-6">Visitor Tips</h3>
              <div className="grid md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Info className="h-5 w-5 mr-2 text-blue-600" />
                      Best Practices
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
                      <Wind className="h-5 w-5 mr-2 text-sky-600" />
                      Weather & Clothing
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-3">
                      <li className="flex items-start">
                        <Info className="h-5 w-5 text-sky-600 mr-2 mt-0.5 flex-shrink-0" />
                        <span className="text-sm">Temperature: 10-20°C year-round</span>
                      </li>
                      <li className="flex items-start">
                        <Info className="h-5 w-5 text-sky-600 mr-2 mt-0.5 flex-shrink-0" />
                        <span className="text-sm">Bring warm jackets and layers</span>
                      </li>
                      <li className="flex items-start">
                        <Info className="h-5 w-5 text-sky-600 mr-2 mt-0.5 flex-shrink-0" />
                        <span className="text-sm">Rain gear during monsoon</span>
                      </li>
                    </ul>
                  </CardContent>
                </Card>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle>Entry Fees & Timings</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-3 gap-6">
                    <div>
                      <h4 className="font-semibold mb-2">Entrance Fees</h4>
                      <p className="text-sm text-gray-600">Local: {scenicData.entrance.local}</p>
                      <p className="text-sm text-gray-600">Foreign: {scenicData.entrance.foreign}</p>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-2">Operating Hours</h4>
                      <p className="text-sm text-gray-600">Park: 6 AM - 6 PM</p>
                      <p className="text-sm text-gray-600">Boating: 9 AM - 6 PM</p>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-2">Best Time</h4>
                      <p className="text-sm text-gray-600">Morning: Misty views</p>
                      <p className="text-sm text-gray-600">Evening: Sunset</p>
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
              "https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=400&h=300&fit=crop",
              "https://images.unsplash.com/photo-1600298881974-6be191ceeda1?w=400&h=300&fit=crop",
              "https://images.unsplash.com/photo-1517654443271-11c621d1e9ce?w=400&h=300&fit=crop",
              "https://images.unsplash.com/photo-1580223267446-8ce868a81a63?w=400&h=300&fit=crop",
              "https://images.unsplash.com/photo-1514890547357-a9ee288728e0?w=400&h=300&fit=crop",
              "https://images.unsplash.com/photo-1464207687429-7505649dae38?w=400&h=300&fit=crop",
              "https://images.unsplash.com/photo-1538681105587-85640961bf8b?w=400&h=300&fit=crop",
              "https://images.unsplash.com/photo-1556075798-4825dfaaf498?w=400&h=300&fit=crop"
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
                  alt={`Gregory Lake view ${index + 1}`}
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
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d7915.1!2d80.7648!3d6.9561!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3ae3809c5b283de9%3A0x2a5e4aa0d28b3d66!2sGregory%20Lake!5e0!3m2!1sen!2slk!4v1234567890"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Gregory Lake Location"
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
              Ready for Lake Adventures?
            </h2>
            <p className="text-xl mb-8 text-white/90">
              Experience the beauty and activities of Gregory Lake. 
              Book your lake adventure in Nuwara Eliya's cool climate paradise.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                size="lg"
                className="bg-white text-sky-700 hover:bg-gray-100 px-8 py-6 text-lg"
                onClick={() => handleBookingClick()}
              >
                <Sailboat className="mr-2 h-5 w-5" />
                Book Lake Activities
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
              <Mail className="h-8 w-8 mb-3 text-sky-400" />
              <h3 className="font-semibold mb-2">Email Us</h3>
              <p className="text-gray-300">info@rechargetravels.com</p>
              <p className="text-sm text-gray-400">Quick response</p>
            </div>
            <div className="flex flex-col items-center">
              <Globe className="h-8 w-8 mb-3 text-sky-400" />
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
        itemTitle={selectedPackage || "Gregory Lake Activities"}
      />
    </>
  );
};

export default GregoryLake;