import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Waves,
  TreePine,
  Camera,
  Clock,
  MapPin,
  Calendar,
  Star,
  Users,
  Fish,
  Tent,
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
  Droplets,
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
  riverLength: string;
  location: string;
  bestTime: string;
  waterLevel: string;
  temperature: string;
  highlights: string[];
  activities: string[];
  facilities: string[];
  nearbyAttractions: string[];
  riverActivities: string[];
  tips: string[];
  entrance: {
    local: string;
    foreign: string;
  };
  activityPrices: {
    rafting: string;
    camping: string;
    trekking: string;
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

const BelihuloyaRiver = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [selectedPackage, setSelectedPackage] = useState<string | null>(null);
  const [heroImageIndex, setHeroImageIndex] = useState(0);
  const [scenicData, setScenicData] = useState<ScenicDetail | null>(null);
  const [loading, setLoading] = useState(true);

  const heroImages = [
    {
      url: 'https://images.unsplash.com/photo-1511593358241-7eea1f3c84e5?w=1920&h=1080&fit=crop',
      caption: 'Belihuloya River Valley'
    },
    {
      url: 'https://images.unsplash.com/photo-1524634126442-357e0eac3c14?w=1920&h=1080&fit=crop',
      caption: 'River Swimming Spots'
    },
    {
      url: 'https://images.unsplash.com/photo-1523987355523-c7b5b0dd90a7?w=1920&h=1080&fit=crop',
      caption: 'Camping by the River'
    },
    {
      url: 'https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?w=1920&h=1080&fit=crop',
      caption: 'Nature Retreat'
    }
  ];

  const defaultScenicData: ScenicDetail = {
    id: 'belihuloya-river',
    name: 'Belihuloya River',
    description: `Belihuloya is a pristine river valley nestled between the wet and dry zones of Sri Lanka, offering a perfect nature retreat. 
    The crystal-clear waters of the Belihuloya River flow through dramatic landscapes, creating natural pools, rapids, and waterfalls. 
    This eco-tourism paradise is ideal for adventure activities, camping, and relaxation amidst untouched nature. The area's biodiversity, 
    cool climate, and peaceful environment make it a hidden gem for those seeking authentic wilderness experiences.`,
    riverLength: '38 kilometers',
    location: 'Belihuloya, Ratnapura District',
    bestTime: 'December to April',
    waterLevel: 'Varies seasonally',
    temperature: '18-28°C',
    highlights: [
      "Crystal-clear river pools for swimming",
      "White water rafting adventures",
      "Riverside camping experiences",
      "Trekking through pristine forests",
      "Natural water slides and rapids",
      "Abundant birdlife and butterflies",
      "Traditional village experiences",
      "Peaceful nature retreat atmosphere"
    ],
    activities: [
      "River swimming",
      "White water rafting",
      "Camping",
      "Trekking and hiking",
      "Bird watching",
      "Photography",
      "Village tours",
      "Nature walks"
    ],
    facilities: [
      "Eco-lodges and camping sites",
      "Adventure activity centers",
      "Local guides",
      "Basic restaurants",
      "Parking areas",
      "Equipment rental",
      "First aid stations",
      "Picnic spots"
    ],
    nearbyAttractions: [
      "Samanalawewa Reservoir",
      "Papagala Mountain",
      "Bambarakanda Falls (30 minutes)",
      "Lanka Falls",
      "Galagama Falls",
      "Horton Plains (1.5 hours)"
    ],
    riverActivities: [
      "Swimming in natural pools - Safe designated areas",
      "Rafting Grade 2-3 rapids - Seasonal",
      "River crossing experiences",
      "Natural jacuzzis in rock pools",
      "Fishing (with permits)",
      "Riverside picnics"
    ],
    tips: [
      "Check water levels before swimming",
      "Bring water shoes for rocky areas",
      "Book camping spots in advance",
      "Carry insect repellent",
      "Respect local village customs",
      "Don't litter - keep nature pristine"
    ],
    entrance: {
      local: 'Free (public areas)',
      foreign: 'Free (public areas)'
    },
    activityPrices: {
      rafting: 'LKR 3,000-5,000 per person',
      camping: 'LKR 1,500-3,000 per tent/night',
      trekking: 'LKR 2,000-3,500 with guide'
    }
  };

  const suggestedTours: SuggestedTour[] = [
    {
      name: "River Adventure Package",
      duration: "Full Day",
      price: "$55",
      highlights: [
        "White water rafting session",
        "Swimming in natural pools",
        "Riverside BBQ lunch",
        "Nature walk"
      ],
      included: [
        "All equipment",
        "Professional guides",
        "Lunch",
        "Transport",
        "Safety briefing"
      ],
      difficulty: "Moderate",
      groupSize: "4-12 people"
    },
    {
      name: "Wilderness Camping Experience",
      duration: "2 Days/1 Night",
      price: "$85",
      highlights: [
        "Riverside camping",
        "Night safari walk",
        "Campfire dinner",
        "Morning bird watching"
      ],
      included: [
        "Camping equipment",
        "All meals",
        "Guide services",
        "Activities",
        "First aid support"
      ],
      difficulty: "Easy to Moderate",
      groupSize: "2-8 people"
    },
    {
      name: "Nature Trekking Tour",
      duration: "Half Day",
      price: "$35",
      highlights: [
        "Forest trekking",
        "Waterfall visits",
        "Village interaction",
        "Tea estate walk"
      ],
      included: [
        "Expert naturalist",
        "Transport",
        "Snacks",
        "Village tea",
        "Binoculars"
      ],
      difficulty: "Moderate",
      groupSize: "2-10 people"
    },
    {
      name: "Family River Retreat",
      duration: "Full Day",
      price: "$120 (family of 4)",
      highlights: [
        "Safe swimming areas",
        "Easy nature walks",
        "Picnic by river",
        "Butterfly watching"
      ],
      included: [
        "Family guide",
        "Picnic lunch",
        "Activities",
        "Safety equipment",
        "Photography"
      ],
      difficulty: "Easy",
      groupSize: "Families"
    }
  ];

  const faqs = [
    {
      question: "Is it safe to swim in Belihuloya River?",
      answer: "Yes, swimming is safe in designated areas with calm pools. Always check with locals about current conditions and avoid swimming during heavy rains when water levels rise rapidly. Some areas have strong currents and should be avoided. Wear water shoes as riverbeds can be rocky."
    },
    {
      question: "What's the best time for white water rafting?",
      answer: "The best rafting conditions are from November to March when water levels are optimal. During this period, the rapids are Grade 2-3, suitable for beginners and intermediate rafters. Avoid monsoon seasons when water levels can be dangerously high."
    },
    {
      question: "Can we camp anywhere along the river?",
      answer: "While the area is camping-friendly, it's best to use designated camping sites for safety and facilities. These sites have basic amenities and are located in safe areas away from flash flood zones. Wild camping requires permission from local authorities."
    },
    {
      question: "What should I bring for a day trip to Belihuloya?",
      answer: "Essentials include: swimwear, towel, water shoes, change of clothes, sunscreen, insect repellent, camera in waterproof case, snacks, water, and a small first aid kit. If planning activities, check with operators about specific requirements."
    },
    {
      question: "Are there accommodations near Belihuloya River?",
      answer: "Yes, options range from basic camping sites (LKR 1,500-3,000) to eco-lodges and guesthouses (LKR 3,000-10,000 per night). Most accommodations offer river views and easy access to activities. Book in advance during peak season."
    },
    {
      question: "What wildlife can be seen in the Belihuloya area?",
      answer: "The area is rich in biodiversity with over 100 bird species, butterflies, and small mammals. Common sightings include kingfishers, eagles, water monitors, and various fish species. Early morning and late afternoon are best for wildlife viewing."
    }
  ];

  useEffect(() => {
    const fetchScenicData = async () => {
      try {
        const docRef = doc(db, 'scenicLocations', 'belihuloya-river');
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
        <title>Belihuloya River - Nature Retreat | Recharge Travels</title>
        <meta name="description" content="Discover Belihuloya River's pristine waters, natural pools, and adventure activities. Experience white water rafting, camping, and trekking in this hidden paradise." />
        <meta name="keywords" content="Belihuloya River, river camping Sri Lanka, white water rafting, natural pools, eco tourism, nature retreat, adventure activities" />
        <meta property="og:title" content="Belihuloya River - Pristine Nature Retreat" />
        <meta property="og:description" content="Escape to Belihuloya's crystal-clear river pools, adventure activities, and peaceful camping spots. Experience authentic wilderness in Sri Lanka's hidden gem." />
        <meta property="og:image" content="https://images.unsplash.com/photo-1511593358241-7eea1f3c84e5?w=1200&h=630&fit=crop" />
        <link rel="canonical" href="https://www.rechargetravels.com/scenic/belihuloya-river" />
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
                Belihuloya River
              </h1>
              <p className="text-xl md:text-2xl mb-8 font-light drop-shadow">
                Pristine Waters & Adventure in Nature's Paradise
              </p>
              <Button
                onClick={() => handleBookingClick()}
                size="lg"
                className="bg-teal-600 hover:bg-teal-700 text-white px-8 py-6 text-lg rounded-full 
                         transform hover:scale-105 transition-all duration-300 shadow-xl"
              >
                <Waves className="mr-2 h-5 w-5" />
                Book River Adventure
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
            <h2 className="text-4xl font-bold mb-6">Discover Belihuloya River</h2>
            <p className="text-xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
              {scenicData.description}
            </p>
          </motion.div>

          {/* Quick Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12">
            {[
              { icon: Waves, label: "River Length", value: scenicData.riverLength },
              { icon: TreePine, label: "Location", value: "Ratnapura" },
              { icon: Wind, label: "Temperature", value: scenicData.temperature },
              { icon: Calendar, label: "Best Time", value: "Dec-Apr" }
            ].map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="text-center"
              >
                <stat.icon className="h-12 w-12 text-teal-600 mx-auto mb-3" />
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
          <h2 className="text-3xl font-bold text-center mb-12">River Highlights</h2>
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
                <CheckCircle className="h-6 w-6 text-teal-600 mb-3" />
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
                      <MapPin className="h-5 w-5 mr-2 text-teal-600" />
                      Location & Access
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600 mb-4">
                      Located in {scenicData.location}, Belihuloya is accessible via:
                    </p>
                    <ul className="space-y-2 text-sm">
                      <li className="flex items-start">
                        <ChevronRight className="h-4 w-4 text-teal-600 mr-2 mt-0.5" />
                        <span>From Colombo: 4 hours via Ratnapura</span>
                      </li>
                      <li className="flex items-start">
                        <ChevronRight className="h-4 w-4 text-teal-600 mr-2 mt-0.5" />
                        <span>From Ella: 2 hours via Wellawaya</span>
                      </li>
                      <li className="flex items-start">
                        <ChevronRight className="h-4 w-4 text-teal-600 mr-2 mt-0.5" />
                        <span>Public buses available to Belihuloya town</span>
                      </li>
                    </ul>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Info className="h-5 w-5 mr-2 text-teal-600" />
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
                    <Droplets className="h-5 w-5 mr-2 text-teal-600" />
                    River Activities Information
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-2 gap-4">
                    {scenicData.riverActivities.map((activity, idx) => (
                      <div key={idx} className="flex items-start">
                        <Fish className="h-4 w-4 text-teal-600 mr-2 mt-0.5 flex-shrink-0" />
                        <span className="text-sm text-gray-600">{activity}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Activities Tab */}
            <TabsContent value="activities" className="space-y-6">
              <h3 className="text-2xl font-bold mb-6">River & Nature Activities</h3>
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
                      <Tent className="h-6 w-6 text-teal-600 mr-3" />
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
                        <Waves className="h-5 w-5 mr-2" />
                        Rafting
                      </h4>
                      <p className="text-sm text-gray-600">{scenicData.activityPrices.rafting}</p>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-2 flex items-center">
                        <Tent className="h-5 w-5 mr-2" />
                        Camping
                      </h4>
                      <p className="text-sm text-gray-600">{scenicData.activityPrices.camping}</p>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-2 flex items-center">
                        <TreePine className="h-5 w-5 mr-2" />
                        Trekking
                      </h4>
                      <p className="text-sm text-gray-600">{scenicData.activityPrices.trekking}</p>
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
                        <Map className="h-4 w-4 text-teal-600 mr-2" />
                        <span className="text-gray-700">{attraction}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Tours Tab */}
            <TabsContent value="tours" className="space-y-6">
              <h3 className="text-2xl font-bold mb-6">River Adventure Packages</h3>
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
                            <p className="text-2xl font-bold text-teal-600">{tour.price}</p>
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
                                <ChevronRight className="h-4 w-4 text-teal-600 mr-1 mt-0.5 flex-shrink-0" />
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
                            className="bg-teal-600 hover:bg-teal-700"
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
              <h3 className="text-2xl font-bold mb-6">Visitor Tips & Guidelines</h3>
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
                  <CardTitle>Best Seasons & Weather</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-3 gap-6">
                    <div>
                      <h4 className="font-semibold mb-2">Dry Season</h4>
                      <p className="text-sm text-gray-600">December - April</p>
                      <p className="text-sm text-gray-600">Best for all activities</p>
                      <p className="text-sm text-gray-600">Clear water, sunny days</p>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-2">Monsoon</h4>
                      <p className="text-sm text-gray-600">May - November</p>
                      <p className="text-sm text-gray-600">High water levels</p>
                      <p className="text-sm text-gray-600">Limited activities</p>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-2">Temperature</h4>
                      <p className="text-sm text-gray-600">Day: 25-28°C</p>
                      <p className="text-sm text-gray-600">Night: 18-22°C</p>
                      <p className="text-sm text-gray-600">Water: Refreshingly cool</p>
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
              "https://images.unsplash.com/photo-1511593358241-7eea1f3c84e5?w=400&h=300&fit=crop",
              "https://images.unsplash.com/photo-1524634126442-357e0eac3c14?w=400&h=300&fit=crop",
              "https://images.unsplash.com/photo-1523987355523-c7b5b0dd90a7?w=400&h=300&fit=crop",
              "https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?w=400&h=300&fit=crop",
              "https://images.unsplash.com/photo-1455763916899-e8b50eca9967?w=400&h=300&fit=crop",
              "https://images.unsplash.com/photo-1491555103944-7c647fd857e6?w=400&h=300&fit=crop",
              "https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=400&h=300&fit=crop",
              "https://images.unsplash.com/photo-1526080652727-5b77f74eacd2?w=400&h=300&fit=crop"
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
                  alt={`Belihuloya River view ${index + 1}`}
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
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d31700.5!2d80.7858!3d6.6567!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3ae3bfa7d0e91733%3A0x6c7f0e2b0f8a8f9a!2sBelihuloya!5e0!3m2!1sen!2slk!4v1234567890"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Belihuloya River Location"
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
                <AccordionTrigger className="text-left hover:text-teal-600">
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
      <section className="py-20 px-4 bg-gradient-to-br from-teal-600 to-green-700">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl font-bold mb-6 text-white">
              Ready for Your River Adventure?
            </h2>
            <p className="text-xl mb-8 text-white/90">
              Experience the pristine beauty of Belihuloya River. 
              Crystal-clear waters, thrilling activities, and peaceful nature await.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                size="lg"
                className="bg-white text-teal-700 hover:bg-gray-100 px-8 py-6 text-lg"
                onClick={() => handleBookingClick()}
              >
                <Waves className="mr-2 h-5 w-5" />
                Book River Experience
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
              <Phone className="h-8 w-8 mb-3 text-teal-400" />
              <h3 className="font-semibold mb-2">Call Us</h3>
              <p className="text-gray-300">+94 76 505 9595</p>
              <p className="text-sm text-gray-400">Available 24/7</p>
            </div>
            <div className="flex flex-col items-center">
              <Mail className="h-8 w-8 mb-3 text-teal-400" />
              <h3 className="font-semibold mb-2">Email Us</h3>
              <p className="text-gray-300">info@rechargetravels.com</p>
              <p className="text-sm text-gray-400">Quick response</p>
            </div>
            <div className="flex flex-col items-center">
              <Globe className="h-8 w-8 mb-3 text-teal-400" />
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
        itemTitle={selectedPackage || "Belihuloya River Adventure"}
      />
    </>
  );
};

export default BelihuloyaRiver;