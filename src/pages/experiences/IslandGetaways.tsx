import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Anchor,
  Fish,
  Camera,
  Clock,
  MapPin,
  Calendar,
  Star,
  Users,
  Waves,
  Sun,
  Compass,
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
  Shell,
  Palmtree,
  Sunset
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import EnhancedBookingModal from '@/components/EnhancedBookingModal';

interface Island {
  name: string;
  description: string;
  location: string;
  accessibility: string;
  highlights: string[];
  bestTime: string;
  activities: string[];
  uniqueFeature: string;
}

interface IslandPackage {
  name: string;
  duration: string;
  price: string;
  highlights: string[];
  included: string[];
  icon: React.FC<any>;
  islands: string[];
}

const IslandGetaways = () => {
  const [activeTab, setActiveTab] = useState('islands');
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [selectedPackage, setSelectedPackage] = useState<string | null>(null);
  const [heroImageIndex, setHeroImageIndex] = useState(0);

  const heroImages = [
    {
      url: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=1920&h=1080&fit=crop',
      caption: 'Pigeon Island Paradise'
    },
    {
      url: 'https://images.unsplash.com/photo-1506665531195-3566af2b4dfa?w=1920&h=1080&fit=crop',
      caption: 'Tropical Island Beach'
    },
    {
      url: 'https://images.unsplash.com/photo-1583037189850-1921ae7c6c22?w=1920&h=1080&fit=crop',
      caption: 'Coral Reef Snorkeling'
    },
    {
      url: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=1920&h=1080&fit=crop',
      caption: 'Island Sunset Views'
    }
  ];

  const islands: Island[] = [
    {
      name: "Pigeon Island",
      description: "One of Sri Lanka's two marine national parks with pristine coral reefs and abundant marine life.",
      location: "Off Nilaveli, Trincomalee",
      accessibility: "15-minute boat ride",
      highlights: ["Coral Gardens", "Blacktip Sharks", "Sea Turtles", "Rock Pigeon Colony"],
      bestTime: "May to September",
      activities: ["Snorkeling", "Diving", "Beach relaxation", "Wildlife watching"],
      uniqueFeature: "Best coral reef diving in Sri Lanka"
    },
    {
      name: "Delft Island",
      description: "Remote island with wild horses, baobab trees, and ancient ruins in the Jaffna Peninsula.",
      location: "Jaffna Peninsula",
      accessibility: "1-hour ferry ride",
      highlights: ["Wild Horses", "Baobab Tree", "Growing Stone", "Dutch Fort Ruins"],
      bestTime: "March to September",
      activities: ["Cultural exploration", "Photography", "Beach walks", "Historical tours"],
      uniqueFeature: "Only place with wild horses in Sri Lanka"
    },
    {
      name: "Mannar Island",
      description: "Historic island known for pearl diving, bird sanctuaries, and the ancient Baobab tree.",
      location: "Northwest coast",
      accessibility: "Connected by causeway",
      highlights: ["Adam's Bridge", "Baobab Tree", "Bird Sanctuary", "Pearl Banks"],
      bestTime: "December to March",
      activities: ["Bird watching", "Kite surfing", "Cultural tours", "Beach activities"],
      uniqueFeature: "Ancient pearl diving center"
    },
    {
      name: "Great & Little Basses",
      description: "Twin reef formations famous for wreck diving and seasonal gatherings of marine life.",
      location: "Off Kirinda, South coast",
      accessibility: "Boat dive only",
      highlights: ["Shipwrecks", "Reef Sharks", "Manta Rays", "Napoleon Wrasse"],
      bestTime: "March to April",
      activities: ["Wreck diving", "Deep diving", "Photography", "Marine research"],
      uniqueFeature: "Best wreck diving sites"
    },
    {
      name: "Kayts Island",
      description: "Tranquil island in Jaffna with pristine beaches, fishing villages, and colonial heritage.",
      location: "Jaffna Peninsula",
      accessibility: "Causeway connection",
      highlights: ["Hammenhiel Fort", "Chatty Beach", "Fishing Villages", "Casuarina Beach"],
      bestTime: "May to September",
      activities: ["Beach relaxation", "Fort visits", "Village tours", "Seafood dining"],
      uniqueFeature: "Untouched beaches and local life"
    },
    {
      name: "Crow Island",
      description: "Small sanctuary island important for migratory birds and marine biodiversity.",
      location: "Off Colombo coast",
      accessibility: "Special permits required",
      highlights: ["Bird Sanctuary", "Marine Life", "Research Station", "Coral Formations"],
      bestTime: "November to March",
      activities: ["Bird watching", "Research visits", "Snorkeling", "Educational tours"],
      uniqueFeature: "Important bird migration stopover"
    }
  ];

  const islandPackages: IslandPackage[] = [
    {
      name: "Northern Islands Explorer",
      duration: "4 Days / 3 Nights",
      price: "$549",
      highlights: [
        "Delft Island wild horses",
        "Kayts beaches",
        "Jaffna cultural sites",
        "Island hopping adventure"
      ],
      included: [
        "Island transportation",
        "Accommodation",
        "Local guide",
        "All meals",
        "Ferry tickets"
      ],
      icon: Compass,
      islands: ["Delft", "Kayts", "Nainativu"]
    },
    {
      name: "Marine Paradise Package",
      duration: "3 Days / 2 Nights",
      price: "$399",
      highlights: [
        "Pigeon Island snorkeling",
        "Coral reef exploration",
        "Beach resort stay",
        "Marine life encounters"
      ],
      included: [
        "Beach resort",
        "Snorkeling equipment",
        "Boat transfers",
        "Marine guide",
        "Meals"
      ],
      icon: Fish,
      islands: ["Pigeon Island"]
    },
    {
      name: "Island Hopping Adventure",
      duration: "6 Days / 5 Nights",
      price: "$899",
      highlights: [
        "Multiple island visits",
        "Diverse experiences",
        "Cultural immersion",
        "Beach and nature"
      ],
      included: [
        "All island transfers",
        "Mixed accommodation",
        "Professional guide",
        "Activities",
        "Full board"
      ],
      icon: Ship,
      islands: ["Mannar", "Delft", "Pigeon", "Kayts"]
    },
    {
      name: "Diving Expedition",
      duration: "5 Days / 4 Nights",
      price: "$1,299",
      highlights: [
        "Great Basses wreck dives",
        "Pigeon Island reefs",
        "PADI certification",
        "Underwater photography"
      ],
      included: [
        "Dive resort stay",
        "All diving equipment",
        "Certified instructors",
        "Boat dives",
        "Dive insurance"
      ],
      icon: Anchor,
      islands: ["Pigeon", "Great Basses"]
    }
  ];

  const islandActivities = [
    {
      activity: "Snorkeling & Diving",
      description: "Explore vibrant coral reefs and encounter tropical marine life",
      locations: ["Pigeon Island", "Great Basses", "Bar Reef"],
      equipment: "Provided or rental available",
      difficulty: "Beginner to Advanced"
    },
    {
      activity: "Island Hopping",
      description: "Visit multiple islands to experience diverse landscapes and cultures",
      locations: ["Jaffna Islands", "East Coast Islands"],
      equipment: "Boat transfers arranged",
      difficulty: "Easy"
    },
    {
      activity: "Bird Watching",
      description: "Observe resident and migratory birds in island sanctuaries",
      locations: ["Mannar", "Crow Island", "Delft"],
      equipment: "Binoculars recommended",
      difficulty: "Easy"
    },
    {
      activity: "Cultural Exploration",
      description: "Discover unique island cultures, traditions, and historical sites",
      locations: ["Delft", "Mannar", "Jaffna Islands"],
      equipment: "Comfortable walking shoes",
      difficulty: "Easy"
    }
  ];

  const faqs = [
    {
      question: "Do I need special permits to visit these islands?",
      answer: "Most islands are freely accessible, but some like Crow Island require special permits for conservation reasons. Pigeon Island requires a national park entry ticket. We handle all permits and tickets as part of our packages."
    },
    {
      question: "What's the best time for island hopping in Sri Lanka?",
      answer: "The best time varies by location. East coast islands (like Pigeon Island) are best from May to September, while west and south coast islands are ideal from December to March. Northern islands can be visited most of the year except during monsoons."
    },
    {
      question: "Are the islands suitable for non-swimmers?",
      answer: "Yes! While snorkeling and diving are popular, islands offer many activities like beach walks, cultural tours, bird watching, and photography. Life jackets are always provided for boat rides and water activities."
    },
    {
      question: "What should I bring for an island visit?",
      answer: "Essential items include sunscreen, hat, sunglasses, swimwear, light clothing, camera, water bottle, and any personal medications. Snorkeling equipment can be rented at most locations. Bring cash as ATMs are rare on islands."
    },
    {
      question: "How developed are the island facilities?",
      answer: "Development varies greatly. Pigeon Island is uninhabited with basic facilities. Islands like Mannar and Kayts have towns with accommodation and restaurants. Remote islands may have limited facilities, so we plan accordingly."
    },
    {
      question: "Can we camp on the islands?",
      answer: "Camping is restricted on most islands for conservation reasons. However, some islands near the coast offer beach camping experiences with proper permits. Ask about our special camping packages for approved locations."
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
        <title>Sri Lanka Island Escapes | Island Hopping Tours | Recharge Travels</title>
        <meta name="description" content="Explore Sri Lanka's pristine islands including Pigeon Island, Delft Island, and more. Book island hopping tours and marine adventures with Recharge Travels." />
        <meta name="keywords" content="Sri Lanka islands, Pigeon Island snorkeling, Delft Island, island hopping tours, marine national park, coral reef diving" />
        <meta property="og:title" content="Island Escapes - Discover Sri Lanka's Hidden Islands" />
        <meta property="og:description" content="Escape to pristine islands with coral reefs, wild horses, and untouched beaches in Sri Lanka." />
        <meta property="og:image" content="https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=1200&h=630&fit=crop" />
        <link rel="canonical" href="https://www.rechargetravels.com/experiences/island-getaways" />
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
                Island Escapes
              </h1>
              <p className="text-xl md:text-2xl mb-8 font-light drop-shadow">
                Discover Pristine Islands & Hidden Paradise Beaches
              </p>
              <Button
                onClick={() => handleBookingClick()}
                size="lg"
                className="bg-cyan-600 hover:bg-cyan-700 text-white px-8 py-6 text-lg rounded-full 
                         transform hover:scale-105 transition-all duration-300 shadow-xl"
              >
                <Anchor className="mr-2 h-5 w-5" />
                Explore Islands
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
            <h2 className="text-4xl font-bold mb-6">Escape to Sri Lanka's Hidden Islands</h2>
            <p className="text-xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
              Discover a world of pristine beaches, vibrant coral reefs, and unique island cultures. 
              From the marine paradise of Pigeon Island to the wild horses of Delft, each island 
              offers its own adventure. Experience untouched nature, crystal-clear waters, and the 
              warm hospitality of island communities.
            </p>
          </motion.div>

          {/* Quick Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12">
            {[
              { icon: Anchor, label: "Islands", value: "40+" },
              { icon: Fish, label: "Marine Species", value: "300+" },
              { icon: Shell, label: "Coral Varieties", value: "170+" },
              { icon: Palmtree, label: "Beach Miles", value: "1,000+" }
            ].map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="text-center"
              >
                <stat.icon className="h-12 w-12 text-cyan-600 mx-auto mb-3" />
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
              <TabsTrigger value="islands">Featured Islands</TabsTrigger>
              <TabsTrigger value="activities">Island Activities</TabsTrigger>
              <TabsTrigger value="packages">Tour Packages</TabsTrigger>
            </TabsList>

            {/* Islands Tab */}
            <TabsContent value="islands" className="space-y-6">
              <h3 className="text-2xl font-bold mb-6">Discover Our Featured Islands</h3>
              <div className="grid gap-6">
                {islands.map((island, index) => (
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
                            <CardTitle className="text-xl mb-2">{island.name}</CardTitle>
                            <div className="flex items-center gap-4 text-sm text-gray-600 mb-2">
                              <span className="flex items-center">
                                <MapPin className="h-4 w-4 mr-1" />
                                {island.location}
                              </span>
                              <span className="flex items-center">
                                <Ship className="h-4 w-4 mr-1" />
                                {island.accessibility}
                              </span>
                            </div>
                            <p className="text-gray-600">{island.description}</p>
                          </div>
                          <Badge className="bg-cyan-600">{island.uniqueFeature}</Badge>
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div>
                          <h4 className="font-semibold mb-2">Island Highlights:</h4>
                          <div className="flex flex-wrap gap-2">
                            {island.highlights.map((highlight, idx) => (
                              <Badge key={idx} variant="secondary">
                                {highlight}
                              </Badge>
                            ))}
                          </div>
                        </div>
                        <div className="grid md:grid-cols-2 gap-4">
                          <div>
                            <h4 className="font-semibold mb-2">Activities:</h4>
                            <ul className="space-y-1 text-sm">
                              {island.activities.map((activity, idx) => (
                                <li key={idx} className="flex items-center">
                                  <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                                  {activity}
                                </li>
                              ))}
                            </ul>
                          </div>
                          <div>
                            <h4 className="font-semibold mb-2">Best Time:</h4>
                            <div className="flex items-center text-sm">
                              <Sun className="h-4 w-4 text-yellow-500 mr-2" />
                              {island.bestTime}
                            </div>
                          </div>
                        </div>
                        <Button 
                          className="w-full"
                          onClick={() => handleBookingClick(`${island.name} Island Tour`)}
                        >
                          Explore {island.name}
                        </Button>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </TabsContent>

            {/* Activities Tab */}
            <TabsContent value="activities" className="space-y-6">
              <h3 className="text-2xl font-bold mb-6">Island Adventure Activities</h3>
              <div className="grid gap-6">
                {islandActivities.map((activity, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Card className="hover:shadow-lg transition-shadow">
                      <CardHeader>
                        <CardTitle className="text-xl">{activity.activity}</CardTitle>
                        <p className="text-gray-600">{activity.description}</p>
                      </CardHeader>
                      <CardContent>
                        <div className="grid md:grid-cols-3 gap-4 text-sm">
                          <div>
                            <h4 className="font-semibold mb-2">Top Locations:</h4>
                            <ul className="space-y-1">
                              {activity.locations.map((location, idx) => (
                                <li key={idx} className="flex items-center">
                                  <MapPin className="h-4 w-4 text-cyan-600 mr-2" />
                                  {location}
                                </li>
                              ))}
                            </ul>
                          </div>
                          <div>
                            <h4 className="font-semibold mb-2">Equipment:</h4>
                            <p className="text-gray-600">{activity.equipment}</p>
                          </div>
                          <div>
                            <h4 className="font-semibold mb-2">Difficulty:</h4>
                            <Badge variant="outline">{activity.difficulty}</Badge>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </TabsContent>

            {/* Packages Tab */}
            <TabsContent value="packages" className="space-y-6">
              <h3 className="text-2xl font-bold mb-6">Island Escape Packages</h3>
              <div className="grid md:grid-cols-2 gap-6">
                {islandPackages.map((pkg, index) => (
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
                          <pkg.icon className="h-10 w-10 text-cyan-600" />
                          <Badge className="bg-cyan-600">{pkg.duration}</Badge>
                        </div>
                        <CardTitle className="text-xl">{pkg.name}</CardTitle>
                        <p className="text-2xl font-bold text-cyan-600">{pkg.price}</p>
                        <div className="flex flex-wrap gap-2 mt-2">
                          {pkg.islands.map((island, idx) => (
                            <Badge key={idx} variant="outline">{island}</Badge>
                          ))}
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div>
                          <h4 className="font-semibold mb-2">Package Highlights:</h4>
                          <ul className="space-y-1 text-sm">
                            {pkg.highlights.map((highlight, idx) => (
                              <li key={idx} className="flex items-start">
                                <ChevronRight className="h-4 w-4 text-cyan-600 mr-1 mt-0.5 flex-shrink-0" />
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
                          className="w-full bg-cyan-600 hover:bg-cyan-700"
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
          </Tabs>
        </div>
      </section>

      {/* Travel Tips Section */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">Island Travel Tips</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                icon: Sun,
                title: "Sun Protection",
                tips: [
                  "High SPF sunscreen essential",
                  "Reapply after swimming",
                  "Protective clothing recommended",
                  "Stay hydrated always"
                ]
              },
              {
                icon: Waves,
                title: "Ocean Safety",
                tips: [
                  "Check current conditions",
                  "Swim in designated areas",
                  "Use life jackets when needed",
                  "Respect marine life"
                ]
              },
              {
                icon: Package,
                title: "What to Pack",
                tips: [
                  "Waterproof bag for electronics",
                  "Reef-safe sunscreen",
                  "Quick-dry clothing",
                  "Basic first aid kit"
                ]
              }
            ].map((section, index) => (
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
                      <section.icon className="h-8 w-8 text-cyan-600 mr-3" />
                      <CardTitle className="text-lg">{section.title}</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      {section.tips.map((tip, idx) => (
                        <li key={idx} className="flex items-start text-sm text-gray-600">
                          <ChevronRight className="h-4 w-4 text-cyan-600 mr-1 mt-0.5 flex-shrink-0" />
                          <span>{tip}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Photo Gallery */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">Island Paradise Gallery</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {[
              "https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=400&h=300&fit=crop",
              "https://images.unsplash.com/photo-1583037189850-1921ae7c6c22?w=400&h=300&fit=crop",
              "https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=400&h=300&fit=crop",
              "https://images.unsplash.com/photo-1559128010-7c1ad6e1b6a5?w=400&h=300&fit=crop",
              "https://images.unsplash.com/photo-1506665531195-3566af2b4dfa?w=400&h=300&fit=crop",
              "https://images.unsplash.com/photo-1527004760346-e47d0e5e62f4?w=400&h=300&fit=crop",
              "https://images.unsplash.com/photo-1544551763-77ef2d0cfc6c?w=400&h=300&fit=crop",
              "https://images.unsplash.com/photo-1582967788606-a171c1080cb0?w=400&h=300&fit=crop"
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
                  alt={`Island paradise ${index + 1}`}
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
                <AccordionTrigger className="text-left hover:text-cyan-600">
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
      <section className="py-20 px-4 bg-gradient-to-br from-cyan-600 to-blue-700">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl font-bold mb-6 text-white">
              Ready for Your Island Adventure?
            </h2>
            <p className="text-xl mb-8 text-white/90">
              Escape to pristine beaches, explore vibrant coral reefs, and discover 
              the unique charm of Sri Lanka's islands.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                size="lg"
                className="bg-white text-cyan-700 hover:bg-gray-100 px-8 py-6 text-lg"
                onClick={() => handleBookingClick()}
              >
                <Anchor className="mr-2 h-5 w-5" />
                Book Island Tour
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
              <Phone className="h-8 w-8 mb-3 text-cyan-400" />
              <h3 className="font-semibold mb-2">Call Us</h3>
              <p className="text-gray-300">+94 76 505 9595</p>
              <p className="text-sm text-gray-400">Available 24/7</p>
            </div>
            <div className="flex flex-col items-center">
              <Mail className="h-8 w-8 mb-3 text-cyan-400" />
              <h3 className="font-semibold mb-2">Email Us</h3>
              <p className="text-gray-300">info@rechargetravels.com</p>
              <p className="text-sm text-gray-400">Quick response</p>
            </div>
            <div className="flex flex-col items-center">
              <Globe className="h-8 w-8 mb-3 text-cyan-400" />
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
        itemTitle={selectedPackage || "Island Escape Tour"}
      />
    </>
  );
};

export default IslandGetaways;