import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { useNavigate } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Waves,
  Fish,
  Camera,
  Clock,
  MapPin,
  Calendar,
  Star,
  Users,
  Anchor,
  Sun,
  Wind,
  Ship,
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
  Binoculars,
  Navigation,
  Eye
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';

interface WhaleLocation {
  name: string;
  description: string;
  bestMonths: string;
  distance: string;
  species: string[];
  successRate: string;
  otherWildlife: string[];
  tourDuration: string;
}

interface WhaleTour {
  name: string;
  duration: string;
  price: string;
  highlights: string[];
  included: string[];
  icon: React.FC<any>;
  departures: string;
}

const WhaleWatching = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('locations');
  const [heroImageIndex, setHeroImageIndex] = useState(0);

  const heroImages = [
    {
      url: 'https://images.unsplash.com/photo-1568430462989-44163eb1752f?w=1920&h=1080&fit=crop',
      caption: 'Blue Whale Breach'
    },
    {
      url: 'https://images.unsplash.com/photo-1596414086775-3e321ab08f36?w=1920&h=1080&fit=crop',
      caption: 'Sperm Whale Encounter'
    },
    {
      url: 'https://images.unsplash.com/photo-1544551763-92b13f5a8f89?w=1920&h=1080&fit=crop',
      caption: 'Dolphin Pod Swimming'
    },
    {
      url: 'https://images.unsplash.com/photo-1618075253632-c4a6a901a744?w=1920&h=1080&fit=crop',
      caption: 'Whale Tail Sunset'
    }
  ];

  const whaleLocations: WhaleLocation[] = [
    {
      name: "Mirissa",
      description: "The most popular whale watching destination with the highest success rates for blue whale sightings.",
      bestMonths: "November to April",
      distance: "6-10km offshore",
      species: ["Blue Whales", "Sperm Whales", "Fin Whales", "Dolphins"],
      successRate: "90-95%",
      otherWildlife: ["Sea Turtles", "Flying Fish", "Manta Rays"],
      tourDuration: "4-5 hours"
    },
    {
      name: "Trincomalee",
      description: "Less crowded alternative offering excellent whale watching, especially for sperm whales.",
      bestMonths: "March to August",
      distance: "8-15km offshore",
      species: ["Sperm Whales", "Blue Whales", "Bryde's Whales", "Spinner Dolphins"],
      successRate: "85-90%",
      otherWildlife: ["Pilot Whales", "Sea Birds", "Turtles"],
      tourDuration: "4-6 hours"
    },
    {
      name: "Kalpitiya",
      description: "Famous for large pods of dolphins and seasonal whale migrations, plus Bar Reef access.",
      bestMonths: "November to March",
      distance: "3-8km offshore",
      species: ["Spinner Dolphins", "Sperm Whales", "Pilot Whales", "Bottlenose Dolphins"],
      successRate: "95% (dolphins), 70% (whales)",
      otherWildlife: ["Dugongs", "Sea Turtles", "Reef Fish"],
      tourDuration: "3-4 hours"
    },
    {
      name: "Dondra Point",
      description: "The southernmost point of Sri Lanka where deep ocean currents bring whales close to shore.",
      bestMonths: "December to April",
      distance: "5-12km offshore",
      species: ["Blue Whales", "Sperm Whales", "Killer Whales", "Dolphins"],
      successRate: "85-90%",
      otherWildlife: ["Whale Sharks", "Sea Eagles", "Tuna"],
      tourDuration: "4-5 hours"
    }
  ];

  const whaleTours: WhaleTour[] = [
    {
      name: "Premium Blue Whale Safari",
      duration: "Half Day",
      price: "$65",
      highlights: [
        "Early morning departure",
        "Marine biologist guide",
        "Guaranteed second trip if no sightings",
        "Maximum 15 passengers"
      ],
      included: [
        "Hotel pickup/drop",
        "Breakfast on board",
        "Life jackets",
        "Binoculars",
        "Refreshments"
      ],
      icon: Ship,
      departures: "5:30 AM"
    },
    {
      name: "Whale & Dolphin Combo",
      duration: "Full Day",
      price: "$85",
      highlights: [
        "Extended ocean time",
        "Multiple species search",
        "Snorkeling opportunity",
        "Lunch included"
      ],
      included: [
        "All transfers",
        "Meals & drinks",
        "Snorkeling gear",
        "Photography tips",
        "Certificate"
      ],
      icon: Fish,
      departures: "6:00 AM"
    },
    {
      name: "Private Yacht Experience",
      duration: "Half Day",
      price: "$450 (up to 6 people)",
      highlights: [
        "Private luxury yacht",
        "Flexible timing",
        "Personalized route",
        "Champagne service"
      ],
      included: [
        "Private yacht charter",
        "Captain & crew",
        "Gourmet breakfast",
        "All equipment",
        "Photographer available"
      ],
      icon: Anchor,
      departures: "Flexible"
    },
    {
      name: "Research Vessel Tour",
      duration: "6 Hours",
      price: "$95",
      highlights: [
        "Join marine researchers",
        "Hydrophone listening",
        "Data collection participation",
        "Educational presentation"
      ],
      included: [
        "Research boat access",
        "Expert scientists",
        "Equipment use",
        "Lunch",
        "Research certificate"
      ],
      icon: Binoculars,
      departures: "6:30 AM"
    }
  ];

  const whaleSpecies = [
    {
      name: "Blue Whale",
      scientificName: "Balaenoptera musculus",
      size: "Up to 30 meters",
      weight: "Up to 200 tons",
      characteristics: "Largest animal ever known, distinctive blue-gray coloring",
      bestSpots: "Mirissa, Dondra Point"
    },
    {
      name: "Sperm Whale",
      scientificName: "Physeter macrocephalus",
      size: "Up to 20 meters",
      weight: "Up to 50 tons",
      characteristics: "Massive square head, deep diving ability",
      bestSpots: "Trincomalee, Kalpitiya"
    },
    {
      name: "Spinner Dolphin",
      scientificName: "Stenella longirostris",
      size: "Up to 2 meters",
      weight: "Up to 80 kg",
      characteristics: "Acrobatic spinning jumps, large pods",
      bestSpots: "Kalpitiya, All locations"
    },
    {
      name: "Bryde's Whale",
      scientificName: "Balaenoptera edeni",
      size: "Up to 15 meters",
      weight: "Up to 25 tons",
      characteristics: "Year-round residents, surface feeders",
      bestSpots: "Trincomalee"
    }
  ];

  const faqs = [
    {
      question: "What is the best time of year for whale watching in Sri Lanka?",
      answer: "The best time varies by location. For the south coast (Mirissa, Dondra), November to April is ideal. For the east coast (Trincomalee), March to August is best. The calmest seas and highest success rates are typically from December to March on the south coast."
    },
    {
      question: "What are the chances of seeing whales?",
      answer: "Success rates are very high in Sri Lanka, typically 85-95% for whale sightings during the season. Blue whales are most commonly seen from December to March. Even if whales aren't spotted, dolphins are almost always encountered."
    },
    {
      question: "Is whale watching safe for pregnant women and children?",
      answer: "While tours are generally safe, pregnant women should consult their doctor first. Children are welcome but must be supervised at all times and wear life jackets. Some operators have minimum age requirements (usually 5 years). Sea conditions can be rough, so consider motion sickness medication."
    },
    {
      question: "What should I bring on a whale watching tour?",
      answer: "Essential items include sunscreen, sunglasses, hat, camera with zoom lens, motion sickness medication (if needed), light jacket, and water. Binoculars are usually provided. Wear comfortable, non-slip shoes and avoid loose items that could blow away."
    },
    {
      question: "How close do boats get to the whales?",
      answer: "Responsible operators follow strict guidelines, maintaining at least 100 meters distance from whales. The whales sometimes approach boats out of curiosity. All reputable operators follow international whale watching regulations to ensure animal welfare."
    },
    {
      question: "What if we don't see any whales?",
      answer: "Most reputable operators offer a second trip free of charge or a partial refund if no whales or dolphins are sighted. Always confirm the operator's policy before booking. Remember that wildlife sightings can never be 100% guaranteed."
    }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setHeroImageIndex((prev) => (prev + 1) % heroImages.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const handleBookingClick = (packageName?: string) => {
    // Navigate to dedicated booking page
    navigate('/booking/whale-watching');
  };

  return (
    <>
      <Helmet>
        <title>Whale Watching Sri Lanka | Blue Whale Tours Mirissa | Recharge Travels</title>
        <meta name="description" content="Experience world-class whale watching in Sri Lanka. See blue whales, sperm whales, and dolphins in Mirissa, Trincomalee, and Kalpitiya with expert guides." />
        <meta name="keywords" content="whale watching Sri Lanka, Mirissa whale watching, blue whale tours, dolphin watching, Trincomalee whales, marine wildlife tours" />
        <meta property="og:title" content="Whale Watching - Encounter Giants of the Ocean" />
        <meta property="og:description" content="Join us for unforgettable whale watching experiences to see blue whales, sperm whales, and playful dolphins in Sri Lankan waters." />
        <meta property="og:image" content="https://images.unsplash.com/photo-1568430462989-44163eb1752f?w=1200&h=630&fit=crop" />
        <link rel="canonical" href="https://www.rechargetravels.com/experiences/whale-watching" />
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
                Whale Watching Adventures
              </h1>
              <p className="text-xl md:text-2xl mb-8 font-light drop-shadow">
                Encounter Blue Whales & Dolphins in Their Natural Habitat
              </p>
              <Button
                onClick={() => handleBookingClick()}
                size="lg"
                className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-6 text-lg rounded-full 
                         transform hover:scale-105 transition-all duration-300 shadow-xl"
              >
                <Waves className="mr-2 h-5 w-5" />
                Book Whale Tour
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
            <h2 className="text-4xl font-bold mb-6">World-Class Whale Watching in Sri Lanka</h2>
            <p className="text-xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
              Sri Lanka is one of the best places in the world to see blue whales, the largest 
              animals ever known to have lived on Earth. Our warm tropical waters attract these 
              magnificent creatures year-round, along with sperm whales, dolphins, and other marine 
              life. Join expert guides for responsible, unforgettable encounters.
            </p>
          </motion.div>

          {/* Quick Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12">
            {[
              { icon: Fish, label: "Whale Species", value: "26" },
              { icon: Eye, label: "Success Rate", value: "90%+" },
              { icon: Calendar, label: "Season Length", value: "6 Months" },
              { icon: Users, label: "Annual Visitors", value: "50,000+" }
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

      {/* Main Content Tabs */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-4 mb-8">
              <TabsTrigger value="locations">Top Locations</TabsTrigger>
              <TabsTrigger value="species">Marine Species</TabsTrigger>
              <TabsTrigger value="tours">Tour Options</TabsTrigger>
              <TabsTrigger value="guidelines">Guidelines</TabsTrigger>
            </TabsList>

            {/* Locations Tab */}
            <TabsContent value="locations" className="space-y-6">
              <h3 className="text-2xl font-bold mb-6">Premier Whale Watching Destinations</h3>
              <div className="grid gap-6">
                {whaleLocations.map((location, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Card className="hover:shadow-lg transition-shadow">
                      <CardHeader>
                        <div className="flex justify-between items-start">
                          <div>
                            <CardTitle className="text-xl mb-2">{location.name}</CardTitle>
                            <p className="text-gray-600">{location.description}</p>
                          </div>
                          <Badge className="bg-blue-600">Success: {location.successRate}</Badge>
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="grid md:grid-cols-2 gap-4">
                          <div>
                            <h4 className="font-semibold mb-2 flex items-center">
                              <Fish className="h-4 w-4 mr-2" />
                              Marine Species
                            </h4>
                            <div className="flex flex-wrap gap-2">
                              {location.species.map((species, idx) => (
                                <Badge key={idx} variant="secondary">
                                  {species}
                                </Badge>
                              ))}
                            </div>
                          </div>
                          <div>
                            <h4 className="font-semibold mb-2 flex items-center">
                              <Eye className="h-4 w-4 mr-2" />
                              Other Wildlife
                            </h4>
                            <div className="flex flex-wrap gap-2">
                              {location.otherWildlife.map((wildlife, idx) => (
                                <Badge key={idx} variant="outline">
                                  {wildlife}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                          <div>
                            <span className="text-gray-500">Best Season</span>
                            <p className="font-semibold">{location.bestMonths}</p>
                          </div>
                          <div>
                            <span className="text-gray-500">Distance</span>
                            <p className="font-semibold">{location.distance}</p>
                          </div>
                          <div>
                            <span className="text-gray-500">Tour Duration</span>
                            <p className="font-semibold">{location.tourDuration}</p>
                          </div>
                          <div>
                            <Button 
                              size="sm" 
                              className="mt-2"
                              onClick={() => handleBookingClick(`${location.name} Whale Tour`)}
                            >
                              Book Tour
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </TabsContent>

            {/* Species Tab */}
            <TabsContent value="species" className="space-y-6">
              <h3 className="text-2xl font-bold mb-6">Marine Giants You'll Encounter</h3>
              <div className="grid md:grid-cols-2 gap-6">
                {whaleSpecies.map((species, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Card className="h-full hover:shadow-lg transition-shadow">
                      <CardHeader>
                        <CardTitle className="text-xl">{species.name}</CardTitle>
                        <p className="text-sm text-gray-500 italic">{species.scientificName}</p>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div>
                            <span className="text-gray-500">Size:</span>
                            <p className="font-semibold">{species.size}</p>
                          </div>
                          <div>
                            <span className="text-gray-500">Weight:</span>
                            <p className="font-semibold">{species.weight}</p>
                          </div>
                        </div>
                        <div>
                          <span className="text-gray-500 text-sm">Characteristics:</span>
                          <p className="text-sm mt-1">{species.characteristics}</p>
                        </div>
                        <div>
                          <span className="text-gray-500 text-sm">Best Viewing Locations:</span>
                          <p className="text-sm font-semibold mt-1">{species.bestSpots}</p>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </TabsContent>

            {/* Tours Tab */}
            <TabsContent value="tours" className="space-y-6">
              <h3 className="text-2xl font-bold mb-6">Choose Your Whale Watching Experience</h3>
              <div className="grid md:grid-cols-2 gap-6">
                {whaleTours.map((tour, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, scale: 0.95 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Card className="h-full hover:shadow-xl transition-shadow">
                      <CardHeader>
                        <div className="flex items-center justify-between mb-3">
                          <tour.icon className="h-10 w-10 text-blue-600" />
                          <div className="text-right">
                            <Badge className="bg-blue-600">{tour.duration}</Badge>
                            <p className="text-sm text-gray-500 mt-1">Departs: {tour.departures}</p>
                          </div>
                        </div>
                        <CardTitle className="text-xl">{tour.name}</CardTitle>
                        <p className="text-2xl font-bold text-blue-600">{tour.price}</p>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div>
                          <h4 className="font-semibold mb-2">Tour Highlights:</h4>
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
                        <Button 
                          className="w-full bg-blue-600 hover:bg-blue-700"
                          onClick={() => handleBookingClick(tour.name)}
                        >
                          Book This Tour
                        </Button>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </TabsContent>

            {/* Guidelines Tab */}
            <TabsContent value="guidelines" className="space-y-6">
              <h3 className="text-2xl font-bold mb-6">Responsible Whale Watching Guidelines</h3>
              <div className="grid md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <CheckCircle className="h-6 w-6 text-green-500 mr-2" />
                      Best Practices
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-3">
                      <li className="flex items-start">
                        <CheckCircle className="h-5 w-5 text-green-500 mr-2 mt-0.5" />
                        <span className="text-sm">Choose operators certified by responsible whale watching organizations</span>
                      </li>
                      <li className="flex items-start">
                        <CheckCircle className="h-5 w-5 text-green-500 mr-2 mt-0.5" />
                        <span className="text-sm">Maintain respectful distance (minimum 100m from whales)</span>
                      </li>
                      <li className="flex items-start">
                        <CheckCircle className="h-5 w-5 text-green-500 mr-2 mt-0.5" />
                        <span className="text-sm">Limit viewing time to 30 minutes per whale encounter</span>
                      </li>
                      <li className="flex items-start">
                        <CheckCircle className="h-5 w-5 text-green-500 mr-2 mt-0.5" />
                        <span className="text-sm">Support conservation through eco-friendly tour operators</span>
                      </li>
                    </ul>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <AlertCircle className="h-6 w-6 text-red-500 mr-2" />
                      Things to Avoid
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-3">
                      <li className="flex items-start">
                        <AlertCircle className="h-5 w-5 text-red-500 mr-2 mt-0.5" />
                        <span className="text-sm">Never touch, feed, or swim with whales</span>
                      </li>
                      <li className="flex items-start">
                        <AlertCircle className="h-5 w-5 text-red-500 mr-2 mt-0.5" />
                        <span className="text-sm">Avoid loud noises or sudden movements on boats</span>
                      </li>
                      <li className="flex items-start">
                        <AlertCircle className="h-5 w-5 text-red-500 mr-2 mt-0.5" />
                        <span className="text-sm">Don't throw anything overboard, including food</span>
                      </li>
                      <li className="flex items-start">
                        <AlertCircle className="h-5 w-5 text-red-500 mr-2 mt-0.5" />
                        <span className="text-sm">Never chase or harass marine animals</span>
                      </li>
                    </ul>
                  </CardContent>
                </Card>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle>Preparation Tips</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-3 gap-6">
                    <div>
                      <h4 className="font-semibold mb-2 flex items-center">
                        <Camera className="h-5 w-5 mr-2" />
                        Photography
                      </h4>
                      <ul className="space-y-1 text-sm text-gray-600">
                        <li>• Zoom lens (200mm+) recommended</li>
                        <li>• Waterproof camera protection</li>
                        <li>• Extra batteries and memory cards</li>
                        <li>• Avoid flash photography</li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-2 flex items-center">
                        <Sun className="h-5 w-5 mr-2" />
                        Sun Protection
                      </h4>
                      <ul className="space-y-1 text-sm text-gray-600">
                        <li>• High SPF sunscreen</li>
                        <li>• Wide-brimmed hat</li>
                        <li>• UV-protective clothing</li>
                        <li>• Polarized sunglasses</li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-2 flex items-center">
                        <Wind className="h-5 w-5 mr-2" />
                        Comfort Items
                      </h4>
                      <ul className="space-y-1 text-sm text-gray-600">
                        <li>• Motion sickness medication</li>
                        <li>• Light windbreaker</li>
                        <li>• Non-slip shoes</li>
                        <li>• Small dry bag for valuables</li>
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
      <section className="py-16 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">Whale Watching Gallery</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {[
              "https://images.unsplash.com/photo-1568430462989-44163eb1752f?w=400&h=300&fit=crop",
              "https://images.unsplash.com/photo-1596414086775-3e321ab08f36?w=400&h=300&fit=crop",
              "https://images.unsplash.com/photo-1544551763-92b13f5a8f89?w=400&h=300&fit=crop",
              "https://images.unsplash.com/photo-1618075253632-c4a6a901a744?w=400&h=300&fit=crop",
              "https://images.unsplash.com/photo-1580017601223-0a88a5142d5f?w=400&h=300&fit=crop",
              "https://images.unsplash.com/photo-1604202234978-df739b9c6783?w=400&h=300&fit=crop",
              "https://images.unsplash.com/photo-1517584704925-10a5edf06e2f?w=400&h=300&fit=crop",
              "https://images.unsplash.com/photo-1518399104871-600557593095?w=400&h=300&fit=crop"
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
                  alt={`Whale watching ${index + 1}`}
                  className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300" />
              </motion.div>
            ))}
          </div>
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
      <section className="py-20 px-4 bg-gradient-to-br from-blue-600 to-indigo-700">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl font-bold mb-6 text-white">
              Ready to Meet the Giants of the Ocean?
            </h2>
            <p className="text-xl mb-8 text-white/90">
              Join us for an unforgettable whale watching adventure. 
              Experience these magnificent creatures in their natural habitat.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                size="lg"
                className="bg-white text-blue-700 hover:bg-gray-100 px-8 py-6 text-lg"
                onClick={() => handleBookingClick()}
              >
                <Waves className="mr-2 h-5 w-5" />
                Book Whale Tour
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
              <Phone className="h-8 w-8 mb-3 text-blue-400" />
              <h3 className="font-semibold mb-2">Call Us</h3>
              <p className="text-gray-300">+94 76 505 9595</p>
              <p className="text-sm text-gray-400">Available 24/7</p>
            </div>
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
              <p className="text-sm text-gray-400">More experiences</p>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
};

export default WhaleWatching;