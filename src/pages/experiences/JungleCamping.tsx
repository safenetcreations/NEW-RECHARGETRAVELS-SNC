import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Tent,
  Trees,
  Camera,
  Clock,
  MapPin,
  Calendar,
  Star,
  Users,
  Sunrise,
  Moon,
  Flame,
  Binoculars,
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
  Shield,
  Flashlight,
  Eye
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import EnhancedBookingModal from '@/components/EnhancedBookingModal';

interface CampingPackage {
  name: string;
  duration: string;
  price: string;
  highlights: string[];
  included: string[];
  icon: React.FC<any>;
  difficulty: string;
}

interface WildlifeSpotting {
  animal: string;
  bestTime: string;
  frequency: string;
  description: string;
}

const JungleCamping = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [selectedPackage, setSelectedPackage] = useState<string | null>(null);
  const [heroImageIndex, setHeroImageIndex] = useState(0);

  const heroImages = [
    {
      url: 'https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?w=1920&h=1080&fit=crop',
      caption: 'Jungle Camping in Wilpattu'
    },
    {
      url: 'https://images.unsplash.com/photo-1533873984035-25970ab07461?w=1920&h=1080&fit=crop',
      caption: 'Campfire Under Stars'
    },
    {
      url: 'https://images.unsplash.com/photo-1517824806704-9040b037703b?w=1920&h=1080&fit=crop',
      caption: 'Wilderness Adventure'
    },
    {
      url: 'https://images.unsplash.com/photo-1563299796-17596ed6b017?w=1920&h=1080&fit=crop',
      caption: 'Safari Tent Experience'
    }
  ];

  const campingPackages: CampingPackage[] = [
    {
      name: "Basic Wilderness Experience",
      duration: "2 Days / 1 Night",
      price: "$120 per person",
      highlights: [
        "Guided jungle trek",
        "Night safari walk",
        "Traditional campfire dinner",
        "Wildlife spotting"
      ],
      included: [
        "Basic tent accommodation",
        "All meals",
        "Park entrance fees",
        "Expert naturalist guide",
        "Safety equipment"
      ],
      icon: Tent,
      difficulty: "Easy"
    },
    {
      name: "Adventure Camping Safari",
      duration: "3 Days / 2 Nights",
      price: "$220 per person",
      highlights: [
        "Multiple camping locations",
        "Jeep safari included",
        "Bird watching sessions",
        "Night photography"
      ],
      included: [
        "Safari tent with bedding",
        "All meals & beverages",
        "4x4 safari vehicle",
        "Camping gear",
        "Binoculars & guides"
      ],
      icon: Binoculars,
      difficulty: "Moderate"
    },
    {
      name: "Luxury Glamping Experience",
      duration: "3 Days / 2 Nights",
      price: "$380 per person",
      highlights: [
        "Luxury safari tents",
        "Private wildlife tours",
        "Gourmet bush dining",
        "Spa treatments available"
      ],
      included: [
        "Deluxe tent with bathroom",
        "Fine dining experience",
        "Private safari guide",
        "Premium amenities",
        "Photography assistance"
      ],
      icon: Star,
      difficulty: "Comfort"
    },
    {
      name: "Family Jungle Adventure",
      duration: "2 Days / 1 Night",
      price: "$95 per person (kids 50% off)",
      highlights: [
        "Family-friendly activities",
        "Educational programs",
        "Safe camping areas",
        "Children's nature walks"
      ],
      included: [
        "Family tents",
        "Kid-friendly meals",
        "Nature activities",
        "Safety supervision",
        "Educational materials"
      ],
      icon: Users,
      difficulty: "Family Friendly"
    }
  ];

  const wildlifeSpottings: WildlifeSpotting[] = [
    {
      animal: "Leopard",
      bestTime: "Early morning & late evening",
      frequency: "Rare but possible",
      description: "Sri Lanka's apex predator, most active during dawn and dusk"
    },
    {
      animal: "Sloth Bear",
      bestTime: "Throughout the day",
      frequency: "Occasional sightings",
      description: "Unique to the region, often seen foraging for termites"
    },
    {
      animal: "Elephants",
      bestTime: "Near water sources",
      frequency: "Common sightings",
      description: "Small herds frequent the park's water holes"
    },
    {
      animal: "Spotted Deer",
      bestTime: "Throughout the day",
      frequency: "Very common",
      description: "Large herds graze in open areas"
    },
    {
      animal: "Water Buffalo",
      bestTime: "Near lakes and ponds",
      frequency: "Common",
      description: "Often seen wallowing in water bodies"
    },
    {
      animal: "Peacocks",
      bestTime: "Morning and evening",
      frequency: "Very common",
      description: "National bird, spectacular during mating displays"
    }
  ];

  const campingEssentials = [
    {
      category: "Clothing",
      items: [
        "Long pants and shirts (protection)",
        "Light jacket for cool nights",
        "Hat and sunglasses",
        "Comfortable hiking shoes",
        "Extra socks and underwear"
      ]
    },
    {
      category: "Personal Items",
      items: [
        "Insect repellent (DEET 30%+)",
        "Sunscreen and lip balm",
        "Personal medications",
        "Toiletries and wet wipes",
        "Small towel"
      ]
    },
    {
      category: "Equipment",
      items: [
        "Headlamp or flashlight",
        "Camera with extra batteries",
        "Binoculars for wildlife",
        "Power bank for devices",
        "Reusable water bottle"
      ]
    },
    {
      category: "Optional Items",
      items: [
        "Books or e-reader",
        "Playing cards",
        "Journal and pen",
        "Snacks from home",
        "Whistle for emergencies"
      ]
    }
  ];

  const faqs = [
    {
      question: "Is jungle camping safe?",
      answer: "Yes, jungle camping in Wilpattu is safe when done with licensed operators. Our experienced guides know the terrain, wildlife behavior, and safety protocols. Camps are set up in designated safe zones, and guides carry communication devices for emergencies. We follow strict safety guidelines and have never had any serious incidents."
    },
    {
      question: "What's the best time for jungle camping?",
      answer: "The best time is during the dry season from February to October when weather is predictable and wildlife congregates near water sources. Avoid monsoon months (November-January) when heavy rains can make camping uncomfortable and some areas inaccessible."
    },
    {
      question: "What wildlife might we see?",
      answer: "Wilpattu is famous for leopards, sloth bears, elephants, spotted deer, water buffalo, crocodiles, and over 200 bird species. While leopard sightings are rare and special, you're almost guaranteed to see deer, peacocks, and various birds. Early morning and evening offer the best wildlife viewing opportunities."
    },
    {
      question: "What facilities are available at the campsite?",
      answer: "Basic camps have tents with mattresses, shared toilet facilities, and a dining area. Adventure camps add better bedding and private facilities. Luxury glamping includes en-suite bathrooms, proper beds, and solar power. All camps provide meals, drinking water, and basic first aid."
    },
    {
      question: "Can children participate in jungle camping?",
      answer: "Yes, we offer family-friendly camping packages suitable for children aged 6 and above. These camps are in safer areas with additional supervision, shorter walks, and engaging educational activities. Children must be supervised at all times."
    },
    {
      question: "What if it rains during camping?",
      answer: "Our tents are waterproof and camps have covered common areas. Light rain adds to the jungle atmosphere! For heavy rain, we have contingency plans including early return options or moving to nearby eco-lodges. Rain gear is provided if needed."
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
        <title>Jungle Camping Wilpattu | Sri Lanka Wildlife Safari Camping | Recharge Travels</title>
        <meta name="description" content="Experience authentic jungle camping in Wilpattu National Park. Wildlife safaris, campfire dinners, and wilderness adventures in Sri Lanka's largest national park." />
        <meta name="keywords" content="jungle camping Sri Lanka, Wilpattu camping, wildlife safari camping, wilderness experience, eco camping, national park camping" />
        <meta property="og:title" content="Jungle Camping in Wilpattu - Wilderness Adventure" />
        <meta property="og:description" content="Camp under the stars in Wilpattu National Park with expert guides, wildlife encounters, and authentic jungle experiences." />
        <meta property="og:image" content="https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?w=1200&h=630&fit=crop" />
        <link rel="canonical" href="https://www.rechargetravels.com/experiences/jungle-camping" />
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
                Jungle Camping Adventure
              </h1>
              <p className="text-xl md:text-2xl mb-8 font-light drop-shadow">
                Sleep Under Stars in Wilpattu's Wild Heart
              </p>
              <Button
                onClick={() => handleBookingClick()}
                size="lg"
                className="bg-green-600 hover:bg-green-700 text-white px-8 py-6 text-lg rounded-full 
                         transform hover:scale-105 transition-all duration-300 shadow-xl"
              >
                <Tent className="mr-2 h-5 w-5" />
                Book Camping Trip
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
            <h2 className="text-4xl font-bold mb-6">Immerse Yourself in Wilderness</h2>
            <p className="text-xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
              Experience the raw beauty of Sri Lanka's largest national park through an authentic 
              jungle camping adventure. Sleep under starlit skies, wake to the calls of exotic birds, 
              and explore pristine wilderness with expert naturalist guides. Wilpattu offers an 
              unmatched opportunity to connect with nature and witness incredible wildlife.
            </p>
          </motion.div>

          {/* Quick Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12">
            {[
              { icon: Trees, label: "Park Area", value: "1,317 km²" },
              { icon: Eye, label: "Wildlife Species", value: "200+" },
              { icon: Moon, label: "Clear Night Sky", value: "90%" },
              { icon: Shield, label: "Safety Record", value: "100%" }
            ].map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="text-center"
              >
                <stat.icon className="h-12 w-12 text-green-600 mx-auto mb-3" />
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
              <TabsTrigger value="overview">Experience</TabsTrigger>
              <TabsTrigger value="packages">Camping Packages</TabsTrigger>
              <TabsTrigger value="wildlife">Wildlife</TabsTrigger>
              <TabsTrigger value="prepare">Preparation</TabsTrigger>
            </TabsList>

            {/* Overview Tab */}
            <TabsContent value="overview" className="space-y-6">
              <h3 className="text-2xl font-bold mb-6">The Wilpattu Experience</h3>
              
              <div className="grid md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Sunrise className="h-5 w-5 mr-2 text-green-600" />
                      Day Adventures
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600 mb-4">
                      Start your days with early morning wildlife drives when animals are most active. 
                      Explore diverse habitats from dense jungle to open grasslands and serene lakes.
                    </p>
                    <ul className="space-y-2 text-sm">
                      <li className="flex items-center">
                        <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                        Guided nature walks
                      </li>
                      <li className="flex items-center">
                        <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                        Wildlife tracking
                      </li>
                      <li className="flex items-center">
                        <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                        Bird watching sessions
                      </li>
                      <li className="flex items-center">
                        <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                        Photography opportunities
                      </li>
                    </ul>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Moon className="h-5 w-5 mr-2 text-green-600" />
                      Night Experience
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600 mb-4">
                      As darkness falls, the jungle comes alive with nocturnal sounds. Gather around 
                      the campfire for stories, traditional dinner, and stargazing opportunities.
                    </p>
                    <ul className="space-y-2 text-sm">
                      <li className="flex items-center">
                        <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                        Campfire gatherings
                      </li>
                      <li className="flex items-center">
                        <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                        Night safari walks
                      </li>
                      <li className="flex items-center">
                        <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                        Astronomy sessions
                      </li>
                      <li className="flex items-center">
                        <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                        Traditional BBQ dinner
                      </li>
                    </ul>
                  </CardContent>
                </Card>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle>Typical Camping Itinerary</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <h4 className="font-semibold mb-3">Day 1</h4>
                        <ul className="space-y-2 text-sm text-gray-600">
                          <li className="flex items-start">
                            <span className="font-medium mr-2">2:00 PM:</span>
                            Pickup and journey to Wilpattu
                          </li>
                          <li className="flex items-start">
                            <span className="font-medium mr-2">4:00 PM:</span>
                            Camp setup and orientation
                          </li>
                          <li className="flex items-start">
                            <span className="font-medium mr-2">5:00 PM:</span>
                            Evening wildlife drive
                          </li>
                          <li className="flex items-start">
                            <span className="font-medium mr-2">7:30 PM:</span>
                            Campfire dinner
                          </li>
                          <li className="flex items-start">
                            <span className="font-medium mr-2">9:00 PM:</span>
                            Night walk and stargazing
                          </li>
                        </ul>
                      </div>
                      <div>
                        <h4 className="font-semibold mb-3">Day 2</h4>
                        <ul className="space-y-2 text-sm text-gray-600">
                          <li className="flex items-start">
                            <span className="font-medium mr-2">5:30 AM:</span>
                            Wake up call and tea
                          </li>
                          <li className="flex items-start">
                            <span className="font-medium mr-2">6:00 AM:</span>
                            Morning safari drive
                          </li>
                          <li className="flex items-start">
                            <span className="font-medium mr-2">8:30 AM:</span>
                            Breakfast at camp
                          </li>
                          <li className="flex items-start">
                            <span className="font-medium mr-2">10:00 AM:</span>
                            Nature walk and bird watching
                          </li>
                          <li className="flex items-start">
                            <span className="font-medium mr-2">12:00 PM:</span>
                            Pack up and departure
                          </li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Packages Tab */}
            <TabsContent value="packages" className="space-y-6">
              <h3 className="text-2xl font-bold mb-6">Choose Your Camping Adventure</h3>
              <div className="grid md:grid-cols-2 gap-6">
                {campingPackages.map((pkg, index) => (
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
                          <pkg.icon className="h-10 w-10 text-green-600" />
                          <div className="text-right">
                            <Badge className="bg-green-600">{pkg.duration}</Badge>
                            <Badge variant="outline" className="ml-2">{pkg.difficulty}</Badge>
                          </div>
                        </div>
                        <CardTitle className="text-xl">{pkg.name}</CardTitle>
                        <p className="text-2xl font-bold text-green-600">{pkg.price}</p>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div>
                          <h4 className="font-semibold mb-2">Experience Highlights:</h4>
                          <ul className="space-y-1 text-sm">
                            {pkg.highlights.map((highlight, idx) => (
                              <li key={idx} className="flex items-start">
                                <ChevronRight className="h-4 w-4 text-green-600 mr-1 mt-0.5 flex-shrink-0" />
                                <span>{highlight}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                        <div>
                          <h4 className="font-semibold mb-2">Package Includes:</h4>
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
                          className="w-full bg-green-600 hover:bg-green-700"
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

            {/* Wildlife Tab */}
            <TabsContent value="wildlife" className="space-y-6">
              <h3 className="text-2xl font-bold mb-6">Wildlife of Wilpattu</h3>
              
              <Card className="mb-6">
                <CardHeader>
                  <CardTitle>About Wilpattu National Park</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600">
                    Wilpattu, meaning "land of lakes," is Sri Lanka's largest and oldest national park. 
                    Its unique feature is the presence of "villus" (natural lakes) that dot the landscape, 
                    attracting diverse wildlife. The park's varied habitats support an incredible array of 
                    fauna, making it one of the best places for wildlife viewing in Sri Lanka.
                  </p>
                </CardContent>
              </Card>

              <div className="grid gap-4">
                {wildlifeSpottings.map((animal, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Card>
                      <CardHeader>
                        <div className="flex justify-between items-start">
                          <CardTitle className="text-lg">{animal.animal}</CardTitle>
                          <Badge variant="outline">{animal.frequency}</Badge>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-gray-600 mb-2">{animal.description}</p>
                        <div className="flex items-center text-sm">
                          <Clock className="h-4 w-4 mr-2 text-green-600" />
                          <span className="font-medium">Best viewing:</span>
                          <span className="ml-2">{animal.bestTime}</span>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>

              <Card>
                <CardHeader>
                  <CardTitle>Bird Life</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 mb-4">
                    Wilpattu is a birder's paradise with over 200 recorded species including many endemics.
                  </p>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <h4 className="font-semibold mb-2">Common Sightings</h4>
                      <ul className="space-y-1 text-sm text-gray-600">
                        <li>• Painted Stork</li>
                        <li>• Lesser Whistling Duck</li>
                        <li>• White-bellied Sea Eagle</li>
                        <li>• Crested Serpent Eagle</li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-2">Endemic Species</h4>
                      <ul className="space-y-1 text-sm text-gray-600">
                        <li>• Sri Lankan Junglefowl</li>
                        <li>• Brown-capped Babbler</li>
                        <li>• Sri Lankan Grey Hornbill</li>
                        <li>• Crimson-fronted Barbet</li>
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Preparation Tab */}
            <TabsContent value="prepare" className="space-y-6">
              <h3 className="text-2xl font-bold mb-6">Prepare for Your Jungle Adventure</h3>
              
              <div className="grid md:grid-cols-2 gap-6">
                {campingEssentials.map((category, index) => (
                  <Card key={index}>
                    <CardHeader>
                      <CardTitle className="text-lg">{category.category}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-2">
                        {category.items.map((item, idx) => (
                          <li key={idx} className="flex items-center text-sm">
                            <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                ))}
              </div>

              <Card>
                <CardHeader>
                  <CardTitle>Important Guidelines</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-semibold mb-3 text-green-600">Do's</h4>
                      <ul className="space-y-2 text-sm">
                        <li className="flex items-start">
                          <CheckCircle className="h-4 w-4 text-green-500 mr-2 mt-0.5" />
                          <span>Follow guide instructions always</span>
                        </li>
                        <li className="flex items-start">
                          <CheckCircle className="h-4 w-4 text-green-500 mr-2 mt-0.5" />
                          <span>Stay quiet near wildlife</span>
                        </li>
                        <li className="flex items-start">
                          <CheckCircle className="h-4 w-4 text-green-500 mr-2 mt-0.5" />
                          <span>Use eco-friendly products</span>
                        </li>
                        <li className="flex items-start">
                          <CheckCircle className="h-4 w-4 text-green-500 mr-2 mt-0.5" />
                          <span>Respect nature and wildlife</span>
                        </li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-3 text-red-600">Don'ts</h4>
                      <ul className="space-y-2 text-sm">
                        <li className="flex items-start">
                          <AlertCircle className="h-4 w-4 text-red-500 mr-2 mt-0.5" />
                          <span>Don't wander off alone</span>
                        </li>
                        <li className="flex items-start">
                          <AlertCircle className="h-4 w-4 text-red-500 mr-2 mt-0.5" />
                          <span>Don't feed any animals</span>
                        </li>
                        <li className="flex items-start">
                          <AlertCircle className="h-4 w-4 text-red-500 mr-2 mt-0.5" />
                          <span>Don't litter in the park</span>
                        </li>
                        <li className="flex items-start">
                          <AlertCircle className="h-4 w-4 text-red-500 mr-2 mt-0.5" />
                          <span>Don't make loud noises</span>
                        </li>
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Health & Safety</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-semibold mb-2 flex items-center">
                        <Shield className="h-5 w-5 mr-2 text-green-600" />
                        Safety Measures
                      </h4>
                      <ul className="space-y-1 text-sm text-gray-600">
                        <li>• First aid kit at camp</li>
                        <li>• Emergency evacuation plan</li>
                        <li>• Communication devices</li>
                        <li>• Trained wilderness guides</li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-2 flex items-center">
                        <Info className="h-5 w-5 mr-2 text-blue-600" />
                        Health Precautions
                      </h4>
                      <ul className="space-y-1 text-sm text-gray-600">
                        <li>• Malaria prophylaxis recommended</li>
                        <li>• Stay hydrated</li>
                        <li>• Protect against insects</li>
                        <li>• Inform about allergies</li>
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
          <h2 className="text-3xl font-bold text-center mb-12">Jungle Camping Gallery</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {[
              "https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?w=400&h=300&fit=crop",
              "https://images.unsplash.com/photo-1533873984035-25970ab07461?w=400&h=300&fit=crop",
              "https://images.unsplash.com/photo-1517824806704-9040b037703b?w=400&h=300&fit=crop",
              "https://images.unsplash.com/photo-1563299796-17596ed6b017?w=400&h=300&fit=crop",
              "https://images.unsplash.com/photo-1445308394109-4ec2920981b1?w=400&h=300&fit=crop",
              "https://images.unsplash.com/photo-1510672981848-a1c4f1cb5ccf?w=400&h=300&fit=crop",
              "https://images.unsplash.com/photo-1487730116645-74489c95b41b?w=400&h=300&fit=crop",
              "https://images.unsplash.com/photo-1496545672447-f699b503d270?w=400&h=300&fit=crop"
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
                  alt={`Jungle camping ${index + 1}`}
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
                <AccordionTrigger className="text-left hover:text-green-600">
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
      <section className="py-20 px-4 bg-gradient-to-br from-green-600 to-emerald-700">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl font-bold mb-6 text-white">
              Ready for Your Wilderness Adventure?
            </h2>
            <p className="text-xl mb-8 text-white/90">
              Experience the thrill of camping in Sri Lanka's wild heart. 
              Book your jungle camping adventure today!
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                size="lg"
                className="bg-white text-green-700 hover:bg-gray-100 px-8 py-6 text-lg"
                onClick={() => handleBookingClick()}
              >
                <Tent className="mr-2 h-5 w-5" />
                Book Camping Trip
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
              <Phone className="h-8 w-8 mb-3 text-green-400" />
              <h3 className="font-semibold mb-2">Call Us</h3>
              <p className="text-gray-300">+94 76 505 9595</p>
              <p className="text-sm text-gray-400">Available 24/7</p>
            </div>
            <div className="flex flex-col items-center">
              <Mail className="h-8 w-8 mb-3 text-green-400" />
              <h3 className="font-semibold mb-2">Email Us</h3>
              <p className="text-gray-300">info@rechargetravels.com</p>
              <p className="text-sm text-gray-400">Quick response</p>
            </div>
            <div className="flex flex-col items-center">
              <Globe className="h-8 w-8 mb-3 text-green-400" />
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
        itemTitle={selectedPackage || "Jungle Camping Adventure"}
      />
    </>
  );
};

export default JungleCamping;