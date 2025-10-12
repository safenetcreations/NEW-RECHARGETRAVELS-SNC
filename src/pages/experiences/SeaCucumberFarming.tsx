import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Shell,
  Fish,
  Camera,
  Clock,
  MapPin,
  Calendar,
  Star,
  Users,
  Waves,
  Info,
  Compass,
  Ship,
  ChevronDown,
  CheckCircle,
  DollarSign,
  Package,
  AlertCircle,
  ChevronRight,
  Globe,
  Phone,
  Mail,
  Droplets,
  Microscope,
  TrendingUp
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import EnhancedBookingModal from '@/components/EnhancedBookingModal';

interface FarmLocation {
  name: string;
  description: string;
  location: string;
  specialization: string;
  tourFeatures: string[];
  duration: string;
  groupSize: string;
  accessibility: string;
}

interface TourPackage {
  name: string;
  duration: string;
  price: string;
  highlights: string[];
  included: string[];
  icon: React.FC<any>;
  level: string;
}

const SeaCucumberFarming = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [selectedPackage, setSelectedPackage] = useState<string | null>(null);
  const [heroImageIndex, setHeroImageIndex] = useState(0);

  const heroImages = [
    {
      url: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=1920&h=1080&fit=crop',
      caption: 'Sea Cucumber Farming Facility'
    },
    {
      url: 'https://images.unsplash.com/photo-1583212292454-1fe6229603b7?w=1920&h=1080&fit=crop',
      caption: 'Underwater Sea Gardens'
    },
    {
      url: 'https://images.unsplash.com/photo-1559128010-7c1ad6e1b6a5?w=1920&h=1080&fit=crop',
      caption: 'Marine Aquaculture'
    },
    {
      url: 'https://images.unsplash.com/photo-1682687981630-cefe9cd73072?w=1920&h=1080&fit=crop',
      caption: 'Sustainable Ocean Farming'
    }
  ];

  const farmLocations: FarmLocation[] = [
    {
      name: "Mannar Sea Cucumber Research Center",
      description: "Leading facility for sea cucumber research and sustainable farming practices in Sri Lanka.",
      location: "Mannar District",
      specialization: "Research & Commercial Farming",
      tourFeatures: ["Research lab visit", "Breeding facility tour", "Underwater observation", "Expert presentations"],
      duration: "3 hours",
      groupSize: "Up to 15 people",
      accessibility: "Wheelchair accessible areas"
    },
    {
      name: "Jaffna Peninsula Aquaculture Farms",
      description: "Traditional and modern sea cucumber farming techniques in the historic waters of Jaffna.",
      location: "Jaffna Peninsula",
      specialization: "Traditional Farming Methods",
      tourFeatures: ["Traditional harvesting demo", "Processing facility", "Local community interaction", "Market visit"],
      duration: "4 hours",
      groupSize: "Up to 20 people",
      accessibility: "Partial accessibility"
    },
    {
      name: "Kalpitiya Sustainable Marine Farm",
      description: "Eco-friendly sea cucumber farming integrated with marine conservation efforts.",
      location: "Kalpitiya",
      specialization: "Sustainable Aquaculture",
      tourFeatures: ["Eco-farming methods", "Snorkeling with sea cucumbers", "Conservation workshop", "Coral reef integration"],
      duration: "Half day",
      groupSize: "Up to 12 people",
      accessibility: "Beach and boat access"
    },
    {
      name: "Eastern Province Export Facility",
      description: "Commercial sea cucumber farming operation with focus on international export standards.",
      location: "Batticaloa",
      specialization: "Export Processing",
      tourFeatures: ["Commercial operations", "Quality control lab", "Export processing", "Business insights"],
      duration: "2.5 hours",
      groupSize: "Up to 10 people",
      accessibility: "Full facility access"
    }
  ];

  const tourPackages: TourPackage[] = [
    {
      name: "Educational Farm Visit",
      duration: "Half Day",
      price: "$45",
      highlights: [
        "Guided facility tour",
        "Expert presentations",
        "Hands-on activities",
        "Q&A session"
      ],
      included: [
        "Transport from hotel",
        "Professional guide",
        "Refreshments",
        "Educational materials",
        "Certificate"
      ],
      icon: Microscope,
      level: "All levels"
    },
    {
      name: "Marine Biologist Experience",
      duration: "Full Day",
      price: "$120",
      highlights: [
        "Work with researchers",
        "Laboratory experience",
        "Underwater observation",
        "Data collection"
      ],
      included: [
        "All equipment",
        "Lunch included",
        "Research participation",
        "Snorkeling gear",
        "Professional photos"
      ],
      icon: Fish,
      level: "Intermediate"
    },
    {
      name: "Investor's Tour",
      duration: "2 Days",
      price: "$350",
      highlights: [
        "Multiple farm visits",
        "Business presentations",
        "Market analysis",
        "Networking opportunities"
      ],
      included: [
        "Accommodation",
        "All meals",
        "Business meetings",
        "Market tours",
        "Investment guide"
      ],
      icon: TrendingUp,
      level: "Business focused"
    },
    {
      name: "Family Discovery Tour",
      duration: "3 Hours",
      price: "$30 per person",
      highlights: [
        "Kid-friendly activities",
        "Touch pool experience",
        "Educational games",
        "Photo opportunities"
      ],
      included: [
        "Family guide",
        "Children's activities",
        "Snacks and drinks",
        "Educational booklets",
        "Souvenir"
      ],
      icon: Users,
      level: "Family friendly"
    }
  ];

  const seaCucumberFacts = [
    {
      title: "Ecological Importance",
      facts: [
        "Recycle nutrients in marine ecosystems",
        "Clean ocean floor sediments",
        "Improve water quality",
        "Support coral reef health"
      ]
    },
    {
      title: "Economic Value",
      facts: [
        "High demand in Asian markets",
        "Medicinal properties",
        "Luxury food product",
        "Growing global market"
      ]
    },
    {
      title: "Farming Benefits",
      facts: [
        "Sustainable income source",
        "Low environmental impact",
        "Community employment",
        "Export opportunities"
      ]
    }
  ];

  const faqs = [
    {
      question: "What exactly are sea cucumbers?",
      answer: "Sea cucumbers are marine animals that live on the ocean floor. Despite their name, they're not vegetables but echinoderms related to starfish and sea urchins. They play a crucial role in marine ecosystems and are considered a delicacy in many Asian cuisines."
    },
    {
      question: "Is it safe to touch or handle sea cucumbers?",
      answer: "Yes, most farmed sea cucumber species are completely safe to touch. Our guides will show you the proper handling techniques. Some species can release sticky threads when stressed, but these are harmless. We provide gloves for those who prefer them."
    },
    {
      question: "What should I wear for the farm tour?",
      answer: "Wear comfortable, water-resistant clothing and shoes that can get wet. Sun protection is essential. For tours involving snorkeling or water activities, bring swimwear. We provide any specialized equipment needed for the tours."
    },
    {
      question: "Are the tours suitable for children?",
      answer: "Yes! Our Family Discovery Tours are designed specifically for children aged 5 and above. The educational content is adapted to be engaging and age-appropriate. Children must be supervised at all times, especially near water areas."
    },
    {
      question: "Can I purchase sea cucumbers at the farms?",
      answer: "Some facilities have retail shops where you can purchase processed sea cucumber products. However, live specimens are not sold to tourists. We can arrange visits to local markets where dried sea cucumber products are available."
    },
    {
      question: "What's the best time of year to visit?",
      answer: "Sea cucumber farms operate year-round, but the best visiting conditions are during the dry seasons (December to March for the west coast, May to September for the east coast). This ensures calmer seas for any water-based activities."
    }
  ];

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

  return (
    <>
      <Helmet>
        <title>Sea Cucumber Farm Tours Sri Lanka | Marine Aquaculture Experience | Recharge Travels</title>
        <meta name="description" content="Visit sustainable sea cucumber farms in Sri Lanka. Educational tours showcasing marine aquaculture, conservation, and traditional farming methods." />
        <meta name="keywords" content="sea cucumber farming Sri Lanka, marine aquaculture tours, sustainable farming, educational tours, Mannar sea cucumber, aquaculture experience" />
        <meta property="og:title" content="Sea Cucumber Farm Tours - Discover Marine Aquaculture" />
        <meta property="og:description" content="Explore sustainable sea cucumber farming in Sri Lanka with educational tours and hands-on experiences." />
        <meta property="og:image" content="https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=1200&h=630&fit=crop" />
        <link rel="canonical" href="https://www.rechargetravels.com/experiences/sea-cucumber-farming" />
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
                Sea Cucumber Farm Tours
              </h1>
              <p className="text-xl md:text-2xl mb-8 font-light drop-shadow">
                Discover Sustainable Marine Aquaculture in Sri Lanka
              </p>
              <Button
                onClick={() => handleBookingClick()}
                size="lg"
                className="bg-teal-600 hover:bg-teal-700 text-white px-8 py-6 text-lg rounded-full 
                         transform hover:scale-105 transition-all duration-300 shadow-xl"
              >
                <Shell className="mr-2 h-5 w-5" />
                Book Farm Tour
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
            <h2 className="text-4xl font-bold mb-6">Explore the World of Sea Cucumber Farming</h2>
            <p className="text-xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
              Discover the fascinating world of sea cucumber aquaculture in Sri Lanka. Visit 
              state-of-the-art farming facilities, learn about sustainable marine farming practices, 
              and understand the ecological and economic importance of these remarkable creatures. 
              Perfect for students, researchers, investors, and curious travelers.
            </p>
          </motion.div>

          {/* Quick Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12">
            {[
              { icon: Shell, label: "Farm Locations", value: "15+" },
              { icon: Fish, label: "Species Farmed", value: "8" },
              { icon: TrendingUp, label: "Annual Production", value: "500+ tons" },
              { icon: Users, label: "Jobs Created", value: "2,000+" }
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

      {/* Main Content Tabs */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-4 mb-8">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="locations">Farm Locations</TabsTrigger>
              <TabsTrigger value="tours">Tour Packages</TabsTrigger>
              <TabsTrigger value="education">Learn More</TabsTrigger>
            </TabsList>

            {/* Overview Tab */}
            <TabsContent value="overview" className="space-y-6">
              <h3 className="text-2xl font-bold mb-6">Understanding Sea Cucumber Farming</h3>
              
              <div className="grid md:grid-cols-3 gap-6 mb-8">
                {seaCucumberFacts.map((section, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Card className="h-full">
                      <CardHeader>
                        <CardTitle className="text-lg">{section.title}</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <ul className="space-y-2">
                          {section.facts.map((fact, idx) => (
                            <li key={idx} className="flex items-start text-sm">
                              <CheckCircle className="h-4 w-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                              <span>{fact}</span>
                            </li>
                          ))}
                        </ul>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>

              <Card>
                <CardHeader>
                  <CardTitle>The Farming Process</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <h4 className="font-semibold mb-3">Traditional Methods</h4>
                        <p className="text-sm text-gray-600 mb-3">
                          Traditional sea cucumber farming in Sri Lanka involves collecting wild juveniles 
                          and growing them in protected sea pens. This method has been practiced for 
                          generations by coastal communities.
                        </p>
                        <ul className="space-y-2 text-sm">
                          <li className="flex items-start">
                            <span className="text-teal-600 mr-2">•</span>
                            Sea pen construction using local materials
                          </li>
                          <li className="flex items-start">
                            <span className="text-teal-600 mr-2">•</span>
                            Natural feeding in tidal areas
                          </li>
                          <li className="flex items-start">
                            <span className="text-teal-600 mr-2">•</span>
                            Community-based management
                          </li>
                        </ul>
                      </div>
                      <div>
                        <h4 className="font-semibold mb-3">Modern Techniques</h4>
                        <p className="text-sm text-gray-600 mb-3">
                          Modern aquaculture facilities use advanced breeding techniques, controlled 
                          environments, and scientific monitoring to optimize growth and ensure 
                          sustainability.
                        </p>
                        <ul className="space-y-2 text-sm">
                          <li className="flex items-start">
                            <span className="text-teal-600 mr-2">•</span>
                            Hatchery breeding programs
                          </li>
                          <li className="flex items-start">
                            <span className="text-teal-600 mr-2">•</span>
                            Water quality monitoring systems
                          </li>
                          <li className="flex items-start">
                            <span className="text-teal-600 mr-2">•</span>
                            Sustainable feed development
                          </li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Locations Tab */}
            <TabsContent value="locations" className="space-y-6">
              <h3 className="text-2xl font-bold mb-6">Visit Our Partner Farms</h3>
              <div className="grid gap-6">
                {farmLocations.map((location, index) => (
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
                            <CardTitle className="text-xl">{location.name}</CardTitle>
                            <div className="flex items-center gap-4 text-sm text-gray-600 mt-2">
                              <span className="flex items-center">
                                <MapPin className="h-4 w-4 mr-1" />
                                {location.location}
                              </span>
                              <span className="flex items-center">
                                <Clock className="h-4 w-4 mr-1" />
                                {location.duration}
                              </span>
                            </div>
                          </div>
                          <Badge className="bg-teal-600">{location.specialization}</Badge>
                        </div>
                        <p className="text-gray-600 mt-3">{location.description}</p>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div>
                          <h4 className="font-semibold mb-2">Tour Features:</h4>
                          <div className="grid md:grid-cols-2 gap-2">
                            {location.tourFeatures.map((feature, idx) => (
                              <div key={idx} className="flex items-center text-sm">
                                <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                                <span>{feature}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                        <div className="flex items-center justify-between text-sm text-gray-600">
                          <span><Users className="h-4 w-4 inline mr-1" />{location.groupSize}</span>
                          <span>{location.accessibility}</span>
                        </div>
                        <Button 
                          className="w-full"
                          onClick={() => handleBookingClick(`${location.name} Tour`)}
                        >
                          Book Tour at {location.name}
                        </Button>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </TabsContent>

            {/* Tours Tab */}
            <TabsContent value="tours" className="space-y-6">
              <h3 className="text-2xl font-bold mb-6">Choose Your Experience Level</h3>
              <div className="grid md:grid-cols-2 gap-6">
                {tourPackages.map((tour, index) => (
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
                          <tour.icon className="h-10 w-10 text-teal-600" />
                          <div className="text-right">
                            <Badge className="bg-teal-600">{tour.duration}</Badge>
                            <Badge variant="outline" className="ml-2">{tour.level}</Badge>
                          </div>
                        </div>
                        <CardTitle className="text-xl">{tour.name}</CardTitle>
                        <p className="text-2xl font-bold text-teal-600">{tour.price}</p>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div>
                          <h4 className="font-semibold mb-2">Experience Highlights:</h4>
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
                        <Button 
                          className="w-full bg-teal-600 hover:bg-teal-700"
                          onClick={() => handleBookingClick(tour.name)}
                        >
                          Book This Experience
                        </Button>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </TabsContent>

            {/* Education Tab */}
            <TabsContent value="education" className="space-y-6">
              <h3 className="text-2xl font-bold mb-6">Educational Resources</h3>
              
              <div className="grid md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Info className="h-5 w-5 mr-2" />
                      Species Information
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div>
                        <h4 className="font-semibold mb-2">Common Species Farmed:</h4>
                        <ul className="space-y-2 text-sm">
                          <li><strong>Holothuria scabra</strong> - Sandfish, most valuable species</li>
                          <li><strong>Holothuria atra</strong> - Black sea cucumber</li>
                          <li><strong>Stichopus chloronotus</strong> - Greenfish</li>
                          <li><strong>Actinopyga mauritiana</strong> - Surf redfish</li>
                        </ul>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Droplets className="h-5 w-5 mr-2" />
                      Environmental Benefits
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2 text-sm">
                      <li className="flex items-start">
                        <CheckCircle className="h-4 w-4 text-green-500 mr-2 mt-0.5" />
                        <span>Bioturbation improves sediment quality</span>
                      </li>
                      <li className="flex items-start">
                        <CheckCircle className="h-4 w-4 text-green-500 mr-2 mt-0.5" />
                        <span>Natural water filtration system</span>
                      </li>
                      <li className="flex items-start">
                        <CheckCircle className="h-4 w-4 text-green-500 mr-2 mt-0.5" />
                        <span>Reduces ocean acidification locally</span>
                      </li>
                      <li className="flex items-start">
                        <CheckCircle className="h-4 w-4 text-green-500 mr-2 mt-0.5" />
                        <span>Supports biodiversity</span>
                      </li>
                    </ul>
                  </CardContent>
                </Card>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle>Visitor Guidelines</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-semibold mb-3 text-green-600">Do's</h4>
                      <ul className="space-y-2 text-sm">
                        <li className="flex items-start">
                          <CheckCircle className="h-4 w-4 text-green-500 mr-2 mt-0.5" />
                          <span>Follow guide instructions carefully</span>
                        </li>
                        <li className="flex items-start">
                          <CheckCircle className="h-4 w-4 text-green-500 mr-2 mt-0.5" />
                          <span>Ask questions and engage with experts</span>
                        </li>
                        <li className="flex items-start">
                          <CheckCircle className="h-4 w-4 text-green-500 mr-2 mt-0.5" />
                          <span>Take photos in designated areas</span>
                        </li>
                        <li className="flex items-start">
                          <CheckCircle className="h-4 w-4 text-green-500 mr-2 mt-0.5" />
                          <span>Wear appropriate sun protection</span>
                        </li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-3 text-red-600">Don'ts</h4>
                      <ul className="space-y-2 text-sm">
                        <li className="flex items-start">
                          <AlertCircle className="h-4 w-4 text-red-500 mr-2 mt-0.5" />
                          <span>Don't touch equipment without permission</span>
                        </li>
                        <li className="flex items-start">
                          <AlertCircle className="h-4 w-4 text-red-500 mr-2 mt-0.5" />
                          <span>Don't disturb the farming pools</span>
                        </li>
                        <li className="flex items-start">
                          <AlertCircle className="h-4 w-4 text-red-500 mr-2 mt-0.5" />
                          <span>Don't feed the sea cucumbers</span>
                        </li>
                        <li className="flex items-start">
                          <AlertCircle className="h-4 w-4 text-red-500 mr-2 mt-0.5" />
                          <span>Don't litter in farm areas</span>
                        </li>
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
          <h2 className="text-3xl font-bold text-center mb-12">Sea Cucumber Farming Gallery</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {[
              "https://images.unsplash.com/photo-1583212292454-1fe6229603b7?w=400&h=300&fit=crop",
              "https://images.unsplash.com/photo-1559128010-7c1ad6e1b6a5?w=400&h=300&fit=crop",
              "https://images.unsplash.com/photo-1682687981630-cefe9cd73072?w=400&h=300&fit=crop",
              "https://images.unsplash.com/photo-1574482620811-1aa16ffe3c82?w=400&h=300&fit=crop",
              "https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=400&h=300&fit=crop",
              "https://images.unsplash.com/photo-1682687220777-2c60708d6889?w=400&h=300&fit=crop",
              "https://images.unsplash.com/photo-1584649054802-56f5e38a8e72?w=400&h=300&fit=crop",
              "https://images.unsplash.com/photo-1574263867128-a3d06eb5a883?w=400&h=300&fit=crop"
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
                  alt={`Sea cucumber farming ${index + 1}`}
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
      <section className="py-20 px-4 bg-gradient-to-br from-teal-600 to-cyan-700">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl font-bold mb-6 text-white">
              Ready to Explore Marine Aquaculture?
            </h2>
            <p className="text-xl mb-8 text-white/90">
              Join us for an educational journey into sustainable sea cucumber farming. 
              Perfect for students, researchers, and eco-conscious travelers.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                size="lg"
                className="bg-white text-teal-700 hover:bg-gray-100 px-8 py-6 text-lg"
                onClick={() => handleBookingClick()}
              >
                <Shell className="mr-2 h-5 w-5" />
                Book Farm Tour
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
              <p className="text-sm text-gray-400">More experiences</p>
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
        itemTitle={selectedPackage || "Sea Cucumber Farm Tour"}
      />
    </>
  );
};

export default SeaCucumberFarming;