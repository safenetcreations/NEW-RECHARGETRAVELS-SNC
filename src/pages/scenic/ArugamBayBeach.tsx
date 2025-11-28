import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Waves,
  Sun,
  Camera,
  Clock,
  MapPin,
  Calendar,
  Star,
  Users,
  Wind,
  Palmtree,
  Fish,
  Sunrise,
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
  Activity,
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
  location: string;
  bestTime: string;
  surfLevel: string;
  beachLength: string;
  highlights: string[];
  activities: string[];
  facilities: string[];
  nearbyAttractions: string[];
  surfingInfo: string[];
  tips: string[];
  entrance: {
    local: string;
    foreign: string;
  };
  services: {
    surfLessons: string;
    boardRental: string;
  };
}

interface SuggestedTour {
  name: string;
  duration: string;
  price: string;
  highlights: string[];
  included: string[];
  level: string;
  groupSize: string;
}

const ArugamBayBeach = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [selectedPackage, setSelectedPackage] = useState<string | null>(null);
  const [heroImageIndex, setHeroImageIndex] = useState(0);
  const [scenicData, setScenicData] = useState<ScenicDetail | null>(null);
  const [loading, setLoading] = useState(true);

  const heroImages = [
    {
      url: 'https://images.unsplash.com/photo-1502680390469-be75c86b636f?w=1920&h=1080&fit=crop',
      caption: 'Arugam Bay Surf Break'
    },
    {
      url: 'https://images.unsplash.com/photo-1509914398892-963f53e6e2f1?w=1920&h=1080&fit=crop',
      caption: 'Perfect Waves at Sunset'
    },
    {
      url: 'https://images.unsplash.com/photo-1505142468610-359e7d316be0?w=1920&h=1080&fit=crop',
      caption: 'Beach Paradise'
    },
    {
      url: 'https://images.unsplash.com/photo-1539185441755-769473a23570?w=1920&h=1080&fit=crop',
      caption: 'Surfing at Dawn'
    }
  ];

  const defaultScenicData: ScenicDetail = {
    id: 'arugam-bay-beach',
    name: 'Arugam Bay Beach',
    description: `Arugam Bay is Sri Lanka's surfing capital and one of the top surf spots in the world. This crescent-shaped 
    bay on the east coast offers world-class waves from April to September, attracting surfers from around the globe. 
    Beyond surfing, Arugam Bay maintains its laid-back fishing village charm with pristine beaches, vibrant nightlife, 
    and a unique blend of local culture and international surf community.`,
    location: 'Pottuvil, Eastern Province',
    bestTime: 'April to September (surf season)',
    surfLevel: 'Beginner to Advanced',
    beachLength: '3 kilometers',
    highlights: [
      "World-class surf breaks including Main Point",
      "Pristine golden sand beaches",
      "Vibrant international surf community",
      "Beachfront restaurants and cafes",
      "Stunning sunrise views",
      "Lagoon wildlife and bird watching",
      "Relaxed bohemian atmosphere",
      "Year-round warm water surfing"
    ],
    activities: [
      "Surfing at multiple point breaks",
      "Swimming and sunbathing",
      "Beach yoga and meditation",
      "Lagoon safari tours",
      "Fishing trips",
      "Beach volleyball",
      "Kitesurfing",
      "Stand-up paddleboarding"
    ],
    facilities: [
      "Surf schools and instructors",
      "Board rental shops",
      "Beachfront accommodation",
      "Restaurants and beach bars",
      "ATMs and shops",
      "Medical facilities",
      "Tour operators",
      "Yoga studios"
    ],
    nearbyAttractions: [
      "Pottuvil Lagoon",
      "Muhudu Maha Viharaya Temple",
      "Kumana National Park (1 hour)",
      "Okanda Beach",
      "Whiskey Point",
      "Peanut Farm surf break",
      "Crocodile Rock",
      "Panama Village"
    ],
    surfingInfo: [
      "Main Point: Right-hand point break, best for intermediate to advanced",
      "Whiskey Point: Beginner-friendly beach break",
      "Peanut Farm: Long right-hander, all levels",
      "Okanda: Powerful right point break",
      "Best swell: May to August",
      "Water temperature: 27-29°C year-round"
    ],
    tips: [
      "Book accommodation early during peak surf season",
      "Respect local customs and dress modestly off the beach",
      "Use reef-safe sunscreen to protect marine life",
      "Learn basic surf etiquette before entering the lineup",
      "Carry cash as not all places accept cards",
      "Stay hydrated and protect yourself from the sun"
    ],
    entrance: {
      local: 'Free',
      foreign: 'Free'
    },
    services: {
      surfLessons: '$20-40 per session',
      boardRental: '$10-15 per day'
    }
  };

  const suggestedTours: SuggestedTour[] = [
    {
      name: "Surf & Stay Package",
      duration: "3 Days/2 Nights",
      price: "$180",
      highlights: [
        "Daily surf sessions with instructor",
        "Beachfront accommodation",
        "Welcome BBQ dinner",
        "Lagoon safari tour"
      ],
      included: [
        "2 nights accommodation",
        "6 surf lessons",
        "Board rental",
        "All meals",
        "Airport transfer"
      ],
      level: "All Levels",
      groupSize: "2-8 people"
    },
    {
      name: "Surf Safari Week",
      duration: "7 Days",
      price: "$450",
      highlights: [
        "Surf multiple breaks",
        "Video analysis coaching",
        "Wildlife safari day trip",
        "Beach yoga sessions"
      ],
      included: [
        "7 nights accommodation",
        "Daily surf guiding",
        "All equipment",
        "Breakfast daily",
        "Safari park entrance"
      ],
      level: "Intermediate+",
      groupSize: "4-10 people"
    },
    {
      name: "Learn to Surf Camp",
      duration: "5 Days",
      price: "$320",
      highlights: [
        "Beginner-focused program",
        "Small group lessons",
        "Beach safety training",
        "Cultural excursions"
      ],
      included: [
        "Accommodation",
        "10 surf lessons",
        "Equipment",
        "Meals",
        "Certificate"
      ],
      level: "Beginners",
      groupSize: "2-6 people"
    },
    {
      name: "Surf & Explore East Coast",
      duration: "4 Days",
      price: "$280",
      highlights: [
        "Surf Arugam Bay breaks",
        "Visit Kumana National Park",
        "Lagoon boat safari",
        "Beach camping night"
      ],
      included: [
        "Transport",
        "Surf guide",
        "Park fees",
        "Camping gear",
        "Meals"
      ],
      level: "All Levels",
      groupSize: "4-12 people"
    }
  ];

  const faqs = [
    {
      question: "When is the best time to surf at Arugam Bay?",
      answer: "The best surf season is from April to September when the southwest monsoon brings consistent swells to the east coast. May to August typically has the biggest and most consistent waves. The water is warm year-round, but outside surf season, the bay is calmer and better for swimming."
    },
    {
      question: "Is Arugam Bay suitable for beginner surfers?",
      answer: "Yes! Arugam Bay has surf breaks for all levels. Whiskey Point and Baby Point are perfect for beginners with gentle, forgiving waves. Main Point and Peanut Farm have sections suitable for improving surfers. Many surf schools offer beginner lessons with experienced instructors."
    },
    {
      question: "What should I bring for a surf trip to Arugam Bay?",
      answer: "Essentials include: reef-safe sunscreen, rash guard, board shorts/swimsuit, reef booties (for rocky areas), basic first aid kit, and insect repellent. You can rent surfboards locally, but bring your own if you have specific preferences. Don't forget a waterproof phone case for photos!"
    },
    {
      question: "Are there accommodations for all budgets?",
      answer: "Arugam Bay offers accommodation from budget hostels ($10-20/night) to luxury beachfront villas ($100+/night). Most places are within walking distance of the surf breaks. Book early during peak season (June-August) as the best places fill up quickly."
    },
    {
      question: "What else can I do besides surfing?",
      answer: "Plenty! Visit Kumana National Park for wildlife, take a lagoon safari to see crocodiles and birds, explore ancient temples, try local cuisine, join beach yoga sessions, or simply relax in a hammock. The area also offers great cycling routes and cultural experiences."
    },
    {
      question: "Is Arugam Bay safe for solo travelers?",
      answer: "Yes, Arugam Bay is generally safe for solo travelers, including women. The surf community is welcoming and helpful. Use common sense precautions: avoid isolated areas at night, secure your valuables, and respect local customs. Many solo travelers make friends quickly here."
    }
  ];

  useEffect(() => {
    const fetchScenicData = async () => {
      try {
        const docRef = doc(db, 'scenicLocations', 'arugam-bay-beach');
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
        <title>Arugam Bay Beach - Surfing Paradise | Recharge Travels</title>
        <meta name="description" content="Discover Arugam Bay, Sri Lanka's premier surfing destination. World-class waves, pristine beaches, vibrant surf culture, and unforgettable adventures on the east coast." />
        <meta name="keywords" content="Arugam Bay surfing, Sri Lanka surf spots, beach holiday, surf lessons, Main Point, Whiskey Point, east coast beaches, surf camps" />
        <meta property="og:title" content="Arugam Bay Beach - Sri Lanka's Surfing Paradise" />
        <meta property="og:description" content="Experience world-class surfing at Arugam Bay. Perfect waves from April to September, vibrant beach culture, and adventures for all skill levels." />
        <meta property="og:image" content="https://images.unsplash.com/photo-1502680390469-be75c86b636f?w=1200&h=630&fit=crop" />
        <link rel="canonical" href="https://www.rechargetravels.com/scenic/arugam-bay-beach" />
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
                Arugam Bay Beach
              </h1>
              <p className="text-xl md:text-2xl mb-8 font-light drop-shadow">
                Sri Lanka's Premier Surfing Paradise
              </p>
              <Button
                onClick={() => handleBookingClick()}
                size="lg"
                className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-6 text-lg rounded-full 
                         transform hover:scale-105 transition-all duration-300 shadow-xl"
              >
                <Waves className="mr-2 h-5 w-5" />
                Book Surf Experience
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
            <h2 className="text-4xl font-bold mb-6">Welcome to Arugam Bay</h2>
            <p className="text-xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
              {scenicData.description}
            </p>
          </motion.div>

          {/* Quick Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12">
            {[
              { icon: Waves, label: "Surf Level", value: scenicData.surfLevel },
              { icon: Calendar, label: "Best Season", value: "Apr-Sep" },
              { icon: Sun, label: "Water Temp", value: "27-29°C" },
              { icon: Palmtree, label: "Beach Length", value: scenicData.beachLength }
            ].map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="text-center"
              >
                <stat.icon className="h-12 w-12 text-blue-600 mx-auto mb-3" />
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
          <h2 className="text-3xl font-bold text-center mb-12">Why Choose Arugam Bay</h2>
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
                <CheckCircle className="h-6 w-6 text-blue-600 mb-3" />
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
              <TabsTrigger value="surfing">Surfing Info</TabsTrigger>
              <TabsTrigger value="tours">Surf Packages</TabsTrigger>
              <TabsTrigger value="tips">Travel Tips</TabsTrigger>
            </TabsList>

            {/* Overview Tab */}
            <TabsContent value="overview" className="space-y-6">
              <div className="grid md:grid-cols-2 gap-8">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <MapPin className="h-5 w-5 mr-2 text-blue-600" />
                      Location & Access
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600 mb-4">
                      Located in {scenicData.location}, Arugam Bay is accessible via:
                    </p>
                    <ul className="space-y-2 text-sm">
                      <li className="flex items-start">
                        <ChevronRight className="h-4 w-4 text-blue-600 mr-2 mt-0.5" />
                        <span>From Colombo: 6-7 hours by road (320km)</span>
                      </li>
                      <li className="flex items-start">
                        <ChevronRight className="h-4 w-4 text-blue-600 mr-2 mt-0.5" />
                        <span>From Ella: 3 hours via Wellawaya</span>
                      </li>
                      <li className="flex items-start">
                        <ChevronRight className="h-4 w-4 text-blue-600 mr-2 mt-0.5" />
                        <span>Airport transfers available from Colombo</span>
                      </li>
                    </ul>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Info className="h-5 w-5 mr-2 text-blue-600" />
                      Beach Facilities
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div>
                        <h4 className="font-semibold mb-2">Available Services:</h4>
                        <ul className="space-y-1 text-sm text-gray-600">
                          {scenicData.facilities.map((facility, idx) => (
                            <li key={idx} className="flex items-center">
                              <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                              {facility}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Activity className="h-5 w-5 mr-2 text-blue-600" />
                    Activities Beyond Surfing
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-2 gap-4">
                    {scenicData.activities.map((activity, idx) => (
                      <div key={idx} className="flex items-center">
                        <Fish className="h-4 w-4 text-blue-600 mr-2" />
                        <span className="text-gray-700">{activity}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Surfing Tab */}
            <TabsContent value="surfing" className="space-y-6">
              <h3 className="text-2xl font-bold mb-6">Surf Breaks & Conditions</h3>
              <div className="grid gap-4">
                {scenicData.surfingInfo.map((info, index) => (
                  <Card key={index}>
                    <CardContent className="pt-6">
                      <div className="flex items-start">
                        <Waves className="h-5 w-5 text-blue-600 mr-3 mt-0.5" />
                        <p className="text-gray-700">{info}</p>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              <Card>
                <CardHeader>
                  <CardTitle>Surf Services & Pricing</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-semibold mb-2 flex items-center">
                        <Users className="h-5 w-5 mr-2" />
                        Surf Lessons
                      </h4>
                      <p className="text-gray-600">{scenicData.services.surfLessons}</p>
                      <p className="text-sm text-gray-500 mt-1">Includes board & instructor</p>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-2 flex items-center">
                        <Activity className="h-5 w-5 mr-2" />
                        Board Rental
                      </h4>
                      <p className="text-gray-600">{scenicData.services.boardRental}</p>
                      <p className="text-sm text-gray-500 mt-1">Various sizes available</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Nearby Surf Spots</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-2 gap-4">
                    {scenicData.nearbyAttractions.filter(spot => 
                      spot.includes('Point') || spot.includes('Farm')
                    ).map((spot, idx) => (
                      <div key={idx} className="flex items-center">
                        <Map className="h-4 w-4 text-blue-600 mr-2" />
                        <span className="text-gray-700">{spot}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Tours Tab */}
            <TabsContent value="tours" className="space-y-6">
              <h3 className="text-2xl font-bold mb-6">Surf Packages & Camps</h3>
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
                            <p className="text-2xl font-bold text-blue-600">{tour.price}</p>
                            <Badge variant="outline">{tour.level}</Badge>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div>
                          <h4 className="font-semibold mb-2">Highlights:</h4>
                          <ul className="space-y-1 text-sm">
                            {tour.highlights.map((highlight, idx) => (
                              <li key={idx} className="flex items-start">
                                <ChevronRight className="h-4 w-4 text-blue-600 mr-1 mt-0.5 flex-shrink-0" />
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
                            className="bg-blue-600 hover:bg-blue-700"
                            onClick={() => handleBookingClick(tour.name)}
                          >
                            Book Package
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
              <h3 className="text-2xl font-bold mb-6">Travel & Surf Tips</h3>
              <div className="grid md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Sunrise className="h-5 w-5 mr-2 text-orange-600" />
                      Surf Essentials
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-3">
                      <li className="flex items-start">
                        <Info className="h-5 w-5 text-orange-600 mr-2 mt-0.5 flex-shrink-0" />
                        <span className="text-sm">Check surf forecast daily at dawn</span>
                      </li>
                      <li className="flex items-start">
                        <Info className="h-5 w-5 text-orange-600 mr-2 mt-0.5 flex-shrink-0" />
                        <span className="text-sm">Use reef-safe sunscreen SPF 50+</span>
                      </li>
                      <li className="flex items-start">
                        <Info className="h-5 w-5 text-orange-600 mr-2 mt-0.5 flex-shrink-0" />
                        <span className="text-sm">Respect surf lineup etiquette</span>
                      </li>
                    </ul>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <AlertCircle className="h-5 w-5 mr-2 text-red-600" />
                      Safety Guidelines
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
                  <CardTitle>Local Information</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-3 gap-6">
                    <div>
                      <h4 className="font-semibold mb-2">Best Months</h4>
                      <p className="text-sm text-gray-600">April - September</p>
                      <p className="text-sm text-gray-600">Peak: June - August</p>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-2">Currency</h4>
                      <p className="text-sm text-gray-600">Sri Lankan Rupee (LKR)</p>
                      <p className="text-sm text-gray-600">ATMs available</p>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-2">Language</h4>
                      <p className="text-sm text-gray-600">Tamil (local)</p>
                      <p className="text-sm text-gray-600">English widely spoken</p>
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
          <h2 className="text-3xl font-bold text-center mb-12">Arugam Bay Gallery</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {[
              "https://images.unsplash.com/photo-1502680390469-be75c86b636f?w=400&h=300&fit=crop",
              "https://images.unsplash.com/photo-1509914398892-963f53e6e2f1?w=400&h=300&fit=crop",
              "https://images.unsplash.com/photo-1505142468610-359e7d316be0?w=400&h=300&fit=crop",
              "https://images.unsplash.com/photo-1539185441755-769473a23570?w=400&h=300&fit=crop",
              "https://images.unsplash.com/photo-1527004013197-933c4bb611b3?w=400&h=300&fit=crop",
              "https://images.unsplash.com/photo-1468931467769-06a09c69aad3?w=400&h=300&fit=crop",
              "https://images.unsplash.com/photo-1471922694854-ff1b63b20054?w=400&h=300&fit=crop",
              "https://images.unsplash.com/photo-1502933691298-84fc14542831?w=400&h=300&fit=crop"
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
                  alt={`Arugam Bay view ${index + 1}`}
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
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d31731.239!2d81.8367!3d6.8409!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3ae5b313d1e8b8b3%3A0x3e90b4f2b9c76a7a!2sArugam%20Bay!5e0!3m2!1sen!2slk!4v1234567890"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Arugam Bay Location"
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
                <AccordionTrigger className="text-left hover:text-blue-600">
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
      <section className="py-20 px-4 bg-gradient-to-br from-blue-600 to-cyan-700">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl font-bold mb-6 text-white">
              Ready to Catch the Perfect Wave?
            </h2>
            <p className="text-xl mb-8 text-white/90">
              Join us at Arugam Bay for an unforgettable surfing adventure. 
              Whether you're a beginner or pro, paradise awaits.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                size="lg"
                className="bg-white text-blue-700 hover:bg-gray-100 px-8 py-6 text-lg"
                onClick={() => handleBookingClick()}
              >
                <Waves className="mr-2 h-5 w-5" />
                Book Surf Trip
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-white text-white hover:bg-white/10 px-8 py-6 text-lg"
                onClick={() => window.open('https://wa.me/94777721999', '_blank')}
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
            <a href="https://wa.me/94777721999" target="_blank" rel="noopener noreferrer" className="flex flex-col items-center hover:text-green-400 transition-colors">
              <svg className="h-8 w-8 mb-3 text-green-400" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
              <h3 className="font-semibold mb-2">WhatsApp Us</h3>
              <p className="text-gray-300">+94 77 772 1999</p>
              <p className="text-sm text-gray-400">Available 24/7</p>
            </a>
            <div className="flex flex-col items-center">
              <Mail className="h-8 w-8 mb-3 text-blue-400" />
              <h3 className="font-semibold mb-2">Email Us</h3>
              <p className="text-gray-300">info@rechargetravels.com</p>
              <p className="text-sm text-gray-400">Quick response</p>
            </div>
            <div className="flex flex-col items-center">
              <Globe className="h-8 w-8 mb-3 text-blue-400" />
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
        itemTitle={selectedPackage || "Arugam Bay Surf Experience"}
      />
    </>
  );
};

export default ArugamBayBeach;