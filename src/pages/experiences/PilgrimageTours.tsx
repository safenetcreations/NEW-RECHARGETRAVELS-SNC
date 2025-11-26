import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Heart,
  Mountain,
  Camera,
  Clock,
  MapPin,
  Calendar,
  Star,
  Users,
  Sunrise,
  Moon,
  TreePine,
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
  Flower,
  Sparkles
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import EnhancedBookingModal from '@/components/EnhancedBookingModal';

interface SacredSite {
  name: string;
  description: string;
  location: string;
  significance: string;
  highlights: string[];
  bestTime: string;
  duration: string;
  religion: string;
}

interface PilgrimagePackage {
  name: string;
  duration: string;
  price: string;
  highlights: string[];
  included: string[];
  icon: React.FC<any>;
  type: string;
}

const PilgrimageTours = () => {
  const [activeTab, setActiveTab] = useState('sites');
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [selectedPackage, setSelectedPackage] = useState<string | null>(null);
  const [heroImageIndex, setHeroImageIndex] = useState(0);

  const heroImages = [
    {
      url: 'https://images.unsplash.com/photo-1590329273188-041ec23505f7?w=1920&h=1080&fit=crop',
      caption: 'Temple of the Sacred Tooth Relic'
    },
    {
      url: 'https://images.unsplash.com/photo-1609920658906-8223bd289001?w=1920&h=1080&fit=crop',
      caption: 'Sri Pada (Adam\'s Peak)'
    },
    {
      url: 'https://images.unsplash.com/photo-1552832230-c0197dd311b5?w=1920&h=1080&fit=crop',
      caption: 'Ancient Buddhist Temple'
    },
    {
      url: 'https://images.unsplash.com/photo-1582568653140-d688528df885?w=1920&h=1080&fit=crop',
      caption: 'Sacred Bodhi Tree'
    }
  ];

  const sacredSites: SacredSite[] = [
    {
      name: "Sri Pada (Adam's Peak)",
      description: "Sacred mountain revered by all religions, with the famous 'sacred footprint' at its summit.",
      location: "Central Highlands",
      significance: "Multi-religious pilgrimage site",
      highlights: ["Sacred Footprint", "Sunrise Views", "Bell Tower", "Shadow Phenomenon"],
      bestTime: "December to May",
      duration: "6-8 hours climb",
      religion: "Buddhist, Hindu, Christian, Muslim"
    },
    {
      name: "Temple of the Tooth (Dalada Maligawa)",
      description: "Houses the sacred tooth relic of Lord Buddha, Sri Lanka's most important Buddhist shrine.",
      location: "Kandy",
      significance: "UNESCO World Heritage Site",
      highlights: ["Sacred Tooth Relic", "Daily Rituals", "Museum", "Royal Palace Complex"],
      bestTime: "During Puja times",
      duration: "2-3 hours",
      religion: "Buddhist"
    },
    {
      name: "Kataragama",
      description: "Multi-religious sacred city dedicated to Kataragama deviyo, revered by Buddhists, Hindus, and Muslims.",
      location: "Southern Province",
      significance: "Multi-faith worship center",
      highlights: ["Maha Devale", "Kiri Vehera", "Sacred Bo Tree", "Annual Festival"],
      bestTime: "July-August (Festival)",
      duration: "Half day",
      religion: "Buddhist, Hindu, Muslim"
    },
    {
      name: "Anuradhapura Sacred City",
      description: "Ancient capital with sacred Buddhist sites including the Sri Maha Bodhi tree grown from Buddha's enlightenment tree.",
      location: "North Central Province",
      significance: "UNESCO World Heritage Site",
      highlights: ["Sri Maha Bodhi", "Ruwanwelisaya", "Jetavanaramaya", "Mihintale"],
      bestTime: "Year-round",
      duration: "Full day",
      religion: "Buddhist"
    },
    {
      name: "Nagadeepa Purana Viharaya",
      description: "Ancient Buddhist temple on Nainativu Island, believed to be visited by Lord Buddha.",
      location: "Jaffna, Northern Province",
      significance: "Buddha's visit site",
      highlights: ["Ancient Stupa", "Buddha Statue", "Island Setting", "Tamil Buddhist Heritage"],
      bestTime: "Year-round",
      duration: "Half day",
      religion: "Buddhist"
    },
    {
      name: "St. Anthony's Shrine, Kochchikade",
      description: "Famous Catholic church known for miraculous healing, attracting devotees from all faiths.",
      location: "Colombo",
      significance: "Miraculous healing shrine",
      highlights: ["Tuesday Novena", "Multi-faith Worship", "Healing Miracles", "Annual Feast"],
      bestTime: "Tuesday prayers",
      duration: "2 hours",
      religion: "Catholic (Multi-faith visitors)"
    }
  ];

  const pilgrimagePackages: PilgrimagePackage[] = [
    {
      name: "Buddhist Heritage Circuit",
      duration: "5 Days / 4 Nights",
      price: "$449",
      highlights: [
        "Temple of Tooth visit",
        "Anuradhapura sacred sites",
        "Mihintale monastery",
        "Dambulla Cave Temple"
      ],
      included: [
        "Accommodation",
        "Buddhist guide",
        "All temple entries",
        "Vegetarian meals",
        "Transportation"
      ],
      icon: Building,
      type: "Buddhist"
    },
    {
      name: "Adam's Peak Pilgrimage",
      duration: "2 Days / 1 Night",
      price: "$149",
      highlights: [
        "Guided night climb",
        "Sunrise at summit",
        "All safety equipment",
        "Sacred footprint visit"
      ],
      included: [
        "Base accommodation",
        "Professional guide",
        "Packed meals",
        "Headlamps",
        "First aid support"
      ],
      icon: Mountain,
      type: "Multi-faith"
    },
    {
      name: "Multi-Faith Harmony Tour",
      duration: "7 Days / 6 Nights",
      price: "$699",
      highlights: [
        "Buddhist temples",
        "Hindu kovils",
        "Historic mosques",
        "Catholic churches",
        "Interfaith dialogue"
      ],
      included: [
        "All accommodations",
        "Multi-lingual guide",
        "All entrance fees",
        "Meals (special diets)",
        "AC transportation"
      ],
      icon: Heart,
      type: "Multi-faith"
    },
    {
      name: "Sacred Triangle Tour",
      duration: "3 Days / 2 Nights",
      price: "$299",
      highlights: [
        "Kandy Temple of Tooth",
        "Anuradhapura Bodhi Tree",
        "Mihintale climb",
        "Ancient stupas"
      ],
      included: [
        "Heritage hotels",
        "Expert guide",
        "Temple offerings",
        "All meals",
        "Private transport"
      ],
      icon: Sparkles,
      type: "Buddhist"
    }
  ];

  const pilgrimageGuidelines = [
    {
      title: "Dress Code",
      description: "Modest clothing covering shoulders and knees for all religious sites",
      icon: Info
    },
    {
      title: "Temple Etiquette",
      description: "Remove shoes, hats, and avoid pointing feet at religious objects",
      icon: Building
    },
    {
      title: "Photography",
      description: "Ask permission and avoid flash photography in sacred areas",
      icon: Camera
    },
    {
      title: "Offerings",
      description: "Flowers, incense, and oil lamps are common offerings",
      icon: Flower
    }
  ];

  const faqs = [
    {
      question: "What should I wear when visiting religious sites?",
      answer: "Dress modestly with covered shoulders and knees. White clothing is preferred for Buddhist temples. Remove shoes, hats, and sunglasses before entering sacred areas. Bring a scarf to cover if needed."
    },
    {
      question: "Can non-believers visit these religious sites?",
      answer: "Yes, most religious sites welcome visitors of all faiths. Show respect for religious practices and customs. Some areas may be restricted to devotees only - always check with guides or temple authorities."
    },
    {
      question: "What is the best time to climb Adam's Peak?",
      answer: "The pilgrimage season runs from December to May (Poya full moon day in May). Most pilgrims climb at night to reach the summit for sunrise. Start climbing between 2-4 AM for the best experience."
    },
    {
      question: "Are there facilities for elderly or disabled pilgrims?",
      answer: "Many major temples have wheelchair access and facilities. Adam's Peak has rest stops but requires physical fitness. Some sites offer sedan chair services. Always inform us of special requirements when booking."
    },
    {
      question: "What offerings should I bring to temples?",
      answer: "Common offerings include flowers (especially lotus), incense, oil for lamps, and fruits. These can usually be purchased near temple entrances. Avoid offering alcohol or meat products at any religious site."
    },
    {
      question: "Can I participate in religious ceremonies?",
      answer: "Many temples welcome respectful participation. Daily pujas (worship ceremonies) are often open to all. Special ceremonies may require prior arrangement. Your guide can help you understand and participate appropriately."
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
        <title>Sri Lanka Pilgrimage Tours | Sacred Sites & Religious Tours | Recharge Travels</title>
        <meta name="description" content="Discover Sri Lanka's sacred pilgrimage sites including Adam's Peak, Temple of Tooth, and Kataragama. Book spiritual journeys with Recharge Travels." />
        <meta name="keywords" content="Sri Lanka pilgrimage tours, Adam's Peak climb, Temple of Tooth Kandy, Buddhist pilgrimage, religious tours Sri Lanka, sacred sites" />
        <meta property="og:title" content="Pilgrimage Tours - Sacred Journeys in Sri Lanka" />
        <meta property="og:description" content="Experience spiritual journeys to Sri Lanka's most sacred Buddhist, Hindu, Christian and Muslim pilgrimage sites." />
        <meta property="og:image" content="https://images.unsplash.com/photo-1590329273188-041ec23505f7?w=1200&h=630&fit=crop" />
        <link rel="canonical" href="https://www.rechargetravels.com/experiences/pilgrimage-tours" />
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
                Sacred Pilgrimage Sites
              </h1>
              <p className="text-xl md:text-2xl mb-8 font-light drop-shadow">
                Spiritual Journeys Through Sri Lanka's Holy Places
              </p>
              <Button
                onClick={() => handleBookingClick()}
                size="lg"
                className="bg-amber-600 hover:bg-amber-700 text-white px-8 py-6 text-lg rounded-full 
                         transform hover:scale-105 transition-all duration-300 shadow-xl"
              >
                <Heart className="mr-2 h-5 w-5" />
                Begin Your Pilgrimage
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
            <h2 className="text-4xl font-bold mb-6">Journey to Sacred Places of Worship</h2>
            <p className="text-xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
              Sri Lanka is a land of profound spirituality, where ancient temples, sacred mountains, 
              and holy shrines draw pilgrims from around the world. Experience the island's rich 
              religious heritage through visits to Buddhist temples, Hindu kovils, historic mosques, 
              and Catholic churches, each offering unique spiritual experiences and architectural wonders.
            </p>
          </motion.div>

          {/* Quick Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12">
            {[
              { icon: Building, label: "Sacred Sites", value: "100+" },
              { icon: Mountain, label: "Holy Mountains", value: "16" },
              { icon: Users, label: "Annual Pilgrims", value: "2M+" },
              { icon: Star, label: "UNESCO Sites", value: "8" }
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

      {/* Main Content Tabs */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-3 mb-8">
              <TabsTrigger value="sites">Sacred Sites</TabsTrigger>
              <TabsTrigger value="packages">Pilgrimage Packages</TabsTrigger>
              <TabsTrigger value="guidelines">Guidelines & Tips</TabsTrigger>
            </TabsList>

            {/* Sacred Sites Tab */}
            <TabsContent value="sites" className="space-y-6">
              <h3 className="text-2xl font-bold mb-6">Major Pilgrimage Destinations</h3>
              <div className="grid gap-6">
                {sacredSites.map((site, index) => (
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
                            <CardTitle className="text-xl mb-2">{site.name}</CardTitle>
                            <div className="flex items-center gap-4 text-sm text-gray-600 mb-2">
                              <span className="flex items-center">
                                <MapPin className="h-4 w-4 mr-1" />
                                {site.location}
                              </span>
                              <span className="flex items-center">
                                <Clock className="h-4 w-4 mr-1" />
                                {site.duration}
                              </span>
                            </div>
                            <Badge variant="outline" className="mb-3">{site.religion}</Badge>
                            <p className="text-gray-600">{site.description}</p>
                          </div>
                          <Badge className="bg-amber-600">{site.significance}</Badge>
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div>
                          <h4 className="font-semibold mb-2">Key Highlights:</h4>
                          <div className="flex flex-wrap gap-2">
                            {site.highlights.map((highlight, idx) => (
                              <Badge key={idx} variant="secondary">
                                {highlight}
                              </Badge>
                            ))}
                          </div>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-600">
                            <Sunrise className="h-4 w-4 inline mr-1" />
                            Best Time: {site.bestTime}
                          </span>
                          <Button 
                            onClick={() => handleBookingClick(`${site.name} Pilgrimage`)}
                          >
                            Book Pilgrimage
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </TabsContent>

            {/* Packages Tab */}
            <TabsContent value="packages" className="space-y-6">
              <h3 className="text-2xl font-bold mb-6">Curated Pilgrimage Packages</h3>
              <div className="grid md:grid-cols-2 gap-6">
                {pilgrimagePackages.map((pkg, index) => (
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
                          <pkg.icon className="h-10 w-10 text-amber-600" />
                          <div className="text-right">
                            <Badge className="bg-amber-600 mb-1">{pkg.duration}</Badge>
                            <Badge variant="outline" className="ml-2">{pkg.type}</Badge>
                          </div>
                        </div>
                        <CardTitle className="text-xl">{pkg.name}</CardTitle>
                        <p className="text-2xl font-bold text-amber-600">{pkg.price}</p>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div>
                          <h4 className="font-semibold mb-2">Tour Highlights:</h4>
                          <ul className="space-y-1 text-sm">
                            {pkg.highlights.map((highlight, idx) => (
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
                            {pkg.included.map((item, idx) => (
                              <li key={idx} className="flex items-center">
                                <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                                <span>{item}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                        <Button 
                          className="w-full bg-amber-600 hover:bg-amber-700"
                          onClick={() => handleBookingClick(pkg.name)}
                        >
                          Book This Package
                        </Button>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </TabsContent>

            {/* Guidelines Tab */}
            <TabsContent value="guidelines" className="space-y-6">
              <h3 className="text-2xl font-bold mb-6">Pilgrimage Guidelines & Tips</h3>
              <div className="grid md:grid-cols-2 gap-6 mb-8">
                {pilgrimageGuidelines.map((guideline, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Card>
                      <CardHeader>
                        <div className="flex items-center">
                          <guideline.icon className="h-8 w-8 text-amber-600 mr-3" />
                          <CardTitle className="text-lg">{guideline.title}</CardTitle>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <p className="text-gray-600">{guideline.description}</p>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>

              {/* Additional Guidelines */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-xl">Religious Site Etiquette</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-semibold mb-3">Do's</h4>
                      <ul className="space-y-2 text-sm text-gray-600">
                        <li className="flex items-start">
                          <CheckCircle className="h-4 w-4 text-green-500 mr-2 mt-0.5" />
                          <span>Dress modestly and remove shoes when required</span>
                        </li>
                        <li className="flex items-start">
                          <CheckCircle className="h-4 w-4 text-green-500 mr-2 mt-0.5" />
                          <span>Ask permission before photographing people or rituals</span>
                        </li>
                        <li className="flex items-start">
                          <CheckCircle className="h-4 w-4 text-green-500 mr-2 mt-0.5" />
                          <span>Maintain silence in prayer areas</span>
                        </li>
                        <li className="flex items-start">
                          <CheckCircle className="h-4 w-4 text-green-500 mr-2 mt-0.5" />
                          <span>Follow clockwise direction around shrines</span>
                        </li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-3">Don'ts</h4>
                      <ul className="space-y-2 text-sm text-gray-600">
                        <li className="flex items-start">
                          <AlertCircle className="h-4 w-4 text-red-500 mr-2 mt-0.5" />
                          <span>Don't point feet towards religious objects</span>
                        </li>
                        <li className="flex items-start">
                          <AlertCircle className="h-4 w-4 text-red-500 mr-2 mt-0.5" />
                          <span>Don't touch Buddha statues or sacred objects</span>
                        </li>
                        <li className="flex items-start">
                          <AlertCircle className="h-4 w-4 text-red-500 mr-2 mt-0.5" />
                          <span>Don't turn your back on Buddha images</span>
                        </li>
                        <li className="flex items-start">
                          <AlertCircle className="h-4 w-4 text-red-500 mr-2 mt-0.5" />
                          <span>Don't wear revealing clothing</span>
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

      {/* Special Experiences Section */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">Special Pilgrimage Experiences</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                title: "Full Moon Poya Days",
                description: "Join thousands of devotees for special full moon ceremonies at temples",
                icon: Moon,
                image: "https://images.unsplash.com/photo-1604607861708-e08ce08e7420?w=400&h=300&fit=crop"
              },
              {
                title: "Dawn Rituals",
                description: "Witness morning pujas and participate in traditional offerings",
                icon: Sunrise,
                image: "https://images.unsplash.com/photo-1590925503330-f105cf5c6e24?w=400&h=300&fit=crop"
              },
              {
                title: "Festival Celebrations",
                description: "Experience colorful religious festivals and processions",
                icon: Sparkles,
                image: "https://images.unsplash.com/photo-1582568653140-d688528df885?w=400&h=300&fit=crop"
              }
            ].map((experience, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="group cursor-pointer"
              >
                <div className="relative overflow-hidden rounded-lg mb-4">
                  <img
                    src={experience.image}
                    alt={experience.title}
                    className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  <experience.icon className="absolute bottom-4 left-4 h-8 w-8 text-white" />
                </div>
                <h3 className="font-semibold text-lg mb-2">{experience.title}</h3>
                <p className="text-gray-600 text-sm">{experience.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Photo Gallery */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">Sacred Moments Captured</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {[
              "https://images.unsplash.com/photo-1548013146-72479768bada?w=400&h=300&fit=crop",
              "https://images.unsplash.com/photo-1599834562135-59d6fb00066a?w=400&h=300&fit=crop",
              "https://images.unsplash.com/photo-1609920658906-8223bd289001?w=400&h=300&fit=crop",
              "https://images.unsplash.com/photo-1602002418679-43121356bf41?w=400&h=300&fit=crop",
              "https://images.unsplash.com/photo-1590925538540-5cf86af3931d?w=400&h=300&fit=crop",
              "https://images.unsplash.com/photo-1582719508461-905c673771fd?w=400&h=300&fit=crop",
              "https://images.unsplash.com/photo-1586430993811-9b2b56b4e5c8?w=400&h=300&fit=crop",
              "https://images.unsplash.com/photo-1552832230-c0197dd311b5?w=400&h=300&fit=crop"
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
                  alt={`Pilgrimage site ${index + 1}`}
                  className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300" />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQs Section */}
      <section className="py-16 px-4 bg-white">
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
              Begin Your Spiritual Journey
            </h2>
            <p className="text-xl mb-8 text-white/90">
              Let us guide you through Sri Lanka's sacred sites with respect, 
              understanding, and authentic spiritual experiences.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                size="lg"
                className="bg-white text-amber-700 hover:bg-gray-100 px-8 py-6 text-lg"
                onClick={() => handleBookingClick()}
              >
                <Heart className="mr-2 h-5 w-5" />
                Book Pilgrimage Tour
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-white text-white hover:bg-white/10 px-8 py-6 text-lg"
                onClick={() => window.location.href = 'tel:+94765059595'}
              >
                <Phone className="mr-2 h-5 w-5" />
                Speak to Guide
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
        itemTitle={selectedPackage || "Pilgrimage Tour"}
      />
    </>
  );
};

export default PilgrimageTours;