import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  UtensilsCrossed,
  Flame,
  Camera,
  Clock,
  MapPin,
  Calendar,
  Star,
  Users,
  ShoppingBasket,
  Coffee,
  Leaf,
  Fish,
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
  Award,
  Heart,
  Book
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import EnhancedBookingModal from '@/components/EnhancedBookingModal';

interface CookingPackage {
  name: string;
  duration: string;
  price: string;
  highlights: string[];
  included: string[];
  icon: React.FC<any>;
  level: string;
}

interface Dish {
  name: string;
  type: string;
  difficulty: string;
  description: string;
  keyIngredients: string[];
}

const CookingClass = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [selectedPackage, setSelectedPackage] = useState<string | null>(null);
  const [heroImageIndex, setHeroImageIndex] = useState(0);

  const heroImages = [
    {
      url: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=1920&h=1080&fit=crop',
      caption: 'Sri Lankan Spices'
    },
    {
      url: 'https://images.unsplash.com/photo-1547592180-e55fa7d7f7c7?w=1920&h=1080&fit=crop',
      caption: 'Traditional Cooking'
    },
    {
      url: 'https://images.unsplash.com/photo-1606923829579-0cb981a83e2e?w=1920&h=1080&fit=crop',
      caption: 'Fresh Ingredients'
    },
    {
      url: 'https://images.unsplash.com/photo-1596797038530-2c107229654b?w=1920&h=1080&fit=crop',
      caption: 'Authentic Curry Making'
    }
  ];

  const cookingPackages: CookingPackage[] = [
    {
      name: "Essential Sri Lankan",
      duration: "3 hours",
      price: "$45 per person",
      highlights: [
        "5 authentic dishes",
        "Market visit included",
        "Recipe booklet",
        "Lunch with your creations"
      ],
      included: [
        "All ingredients",
        "Professional chef",
        "Cooking equipment",
        "Printed recipes",
        "Refreshments"
      ],
      icon: UtensilsCrossed,
      level: "Beginner"
    },
    {
      name: "Master Chef Experience",
      duration: "5 hours",
      price: "$75 per person",
      highlights: [
        "8-10 complex dishes",
        "Advanced techniques",
        "Spice blending workshop",
        "Certificate of completion"
      ],
      included: [
        "Premium ingredients",
        "Expert chef instructor",
        "Professional kitchen",
        "Video recipes",
        "Full meal service"
      ],
      icon: Award,
      level: "Intermediate"
    },
    {
      name: "Family Cooking Fun",
      duration: "2.5 hours",
      price: "$35 per person (kids 50% off)",
      highlights: [
        "Kid-friendly recipes",
        "Interactive cooking",
        "Fun presentations",
        "Family meal together"
      ],
      included: [
        "Simple ingredients",
        "Family instructor",
        "Kid-safe equipment",
        "Fun aprons",
        "Photo opportunities"
      ],
      icon: Heart,
      level: "All Ages"
    },
    {
      name: "Vegetarian Delights",
      duration: "4 hours",
      price: "$55 per person",
      highlights: [
        "Plant-based menu",
        "Ayurvedic principles",
        "Organic ingredients",
        "Health-focused recipes"
      ],
      included: [
        "Organic produce",
        "Specialist chef",
        "Nutrition guide",
        "Recipe collection",
        "Herbal tea service"
      ],
      icon: Leaf,
      level: "All Levels"
    }
  ];

  const popularDishes: Dish[] = [
    {
      name: "Rice & Curry",
      type: "Main Course",
      difficulty: "Medium",
      description: "The national dish featuring rice with multiple curries including vegetables, meat, and sambols",
      keyIngredients: ["Basmati rice", "Coconut milk", "Curry leaves", "Various spices"]
    },
    {
      name: "Kottu Roti",
      type: "Street Food",
      difficulty: "Easy",
      description: "Chopped flatbread stir-fried with vegetables, eggs, and meat on a hot griddle",
      keyIngredients: ["Godamba roti", "Vegetables", "Eggs", "Curry spices"]
    },
    {
      name: "Fish Ambul Thiyal",
      type: "Curry",
      difficulty: "Medium",
      description: "Sour fish curry with goraka (garcinia), a signature dish from Southern Sri Lanka",
      keyIngredients: ["Tuna", "Goraka", "Black pepper", "Curry leaves"]
    },
    {
      name: "Pol Sambol",
      type: "Condiment",
      difficulty: "Easy",
      description: "Fresh coconut relish with chili, onions, and lime - essential accompaniment",
      keyIngredients: ["Fresh coconut", "Red chili", "Red onions", "Lime juice"]
    },
    {
      name: "Hoppers (Appa)",
      type: "Breakfast",
      difficulty: "Hard",
      description: "Bowl-shaped crispy pancakes made from fermented rice flour and coconut milk",
      keyIngredients: ["Rice flour", "Coconut milk", "Yeast", "Sugar"]
    },
    {
      name: "Watalappan",
      type: "Dessert",
      difficulty: "Medium",
      description: "Traditional coconut custard pudding with jaggery, cardamom, and cashews",
      keyIngredients: ["Coconut milk", "Jaggery", "Eggs", "Cardamom"]
    }
  ];

  const cookingTechniques = [
    {
      technique: "Tempering (Thunpaha)",
      description: "The art of blooming spices in hot oil to release flavors",
      uses: "Start of most curries"
    },
    {
      technique: "Coconut Grinding",
      description: "Fresh coconut preparation for milk extraction and sambols",
      uses: "Base for curries and condiments"
    },
    {
      technique: "Clay Pot Cooking",
      description: "Traditional slow cooking method for enhanced flavors",
      uses: "Rice dishes and slow curries"
    },
    {
      technique: "Spice Roasting",
      description: "Dry roasting whole spices to intensify flavors",
      uses: "Spice blend preparation"
    }
  ];

  const faqs = [
    {
      question: "Do I need any cooking experience?",
      answer: "No prior cooking experience is needed! Our classes cater to all skill levels, from complete beginners to experienced cooks. Our patient instructors guide you through each step, ensuring everyone can create delicious dishes regardless of their starting point."
    },
    {
      question: "Are the classes suitable for vegetarians/vegans?",
      answer: "Absolutely! We offer dedicated vegetarian classes and can adapt most recipes to be vegan. Sri Lankan cuisine has many naturally vegetarian dishes. Please inform us of dietary requirements when booking, and we'll customize the menu accordingly."
    },
    {
      question: "What's included in the market visit?",
      answer: "The market visit includes transportation, guide services, and ingredient purchases for the class. You'll learn to identify exotic vegetables, select fresh spices, understand local pricing, and experience the vibrant atmosphere of a Sri Lankan market."
    },
    {
      question: "Can I take the recipes home?",
      answer: "Yes! All participants receive a recipe booklet with detailed instructions for recreating the dishes at home. We also provide tips on sourcing ingredients in your home country and suitable substitutions for hard-to-find items."
    },
    {
      question: "How spicy is the food?",
      answer: "Sri Lankan food can be spicy, but we adjust the heat level to your preference. You'll learn to balance spices for flavor without overwhelming heat. We teach you how to control spiciness so you can adapt recipes to your taste."
    },
    {
      question: "What should I bring to the class?",
      answer: "Just bring yourself and an appetite! We provide aprons, all cooking equipment, and ingredients. You might want to bring a camera to capture the experience and a container if you'd like to take leftovers (though most people eat everything!)."
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
        <title>Sri Lankan Cooking Classes | Traditional Recipe Lessons | Recharge Travels</title>
        <meta name="description" content="Learn authentic Sri Lankan cooking with expert chefs. From market visits to mastering curries, discover the secrets of Ceylon cuisine in hands-on classes." />
        <meta name="keywords" content="Sri Lankan cooking class, learn Sri Lankan recipes, curry cooking lessons, Ceylon cuisine, cooking experience Colombo, traditional cooking" />
        <meta property="og:title" content="Sri Lankan Cooking Classes - Master Authentic Ceylon Cuisine" />
        <meta property="og:description" content="Join our hands-on cooking classes to learn traditional Sri Lankan recipes, spice secrets, and culinary techniques." />
        <meta property="og:image" content="https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=1200&h=630&fit=crop" />
        <link rel="canonical" href="https://www.rechargetravels.com/experiences/cooking-class" />
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
                Sri Lankan Cooking Class
              </h1>
              <p className="text-xl md:text-2xl mb-8 font-light drop-shadow">
                Master the Art of Authentic Ceylon Cuisine
              </p>
              <Button
                onClick={() => handleBookingClick()}
                size="lg"
                className="bg-orange-600 hover:bg-orange-700 text-white px-8 py-6 text-lg rounded-full 
                         transform hover:scale-105 transition-all duration-300 shadow-xl"
              >
                <UtensilsCrossed className="mr-2 h-5 w-5" />
                Book Cooking Class
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
            <h2 className="text-4xl font-bold mb-6">Discover the Flavors of Sri Lanka</h2>
            <p className="text-xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
              Immerse yourself in the vibrant world of Sri Lankan cuisine through our hands-on 
              cooking classes. Learn time-honored techniques, master the art of spice blending, 
              and create authentic dishes that capture the essence of Ceylon's culinary heritage. 
              From market tours to plate presentation, experience the complete journey of Sri Lankan cooking.
            </p>
          </motion.div>

          {/* Quick Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12">
            {[
              { icon: UtensilsCrossed, label: "Dishes Taught", value: "30+" },
              { icon: Users, label: "Happy Cooks", value: "5,000+" },
              { icon: Award, label: "Years Experience", value: "15+" },
              { icon: Star, label: "Google Rating", value: "4.9/5" }
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

      {/* Main Content Tabs */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-4 mb-8">
              <TabsTrigger value="overview">Experience</TabsTrigger>
              <TabsTrigger value="menu">Menu & Dishes</TabsTrigger>
              <TabsTrigger value="packages">Class Options</TabsTrigger>
              <TabsTrigger value="details">Class Details</TabsTrigger>
            </TabsList>

            {/* Overview Tab */}
            <TabsContent value="overview" className="space-y-6">
              <h3 className="text-2xl font-bold mb-6">Your Culinary Journey</h3>
              
              <div className="grid md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <ShoppingBasket className="h-5 w-5 mr-2 text-orange-600" />
                      Market Adventure
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600 mb-4">
                      Begin your culinary journey with an optional visit to a local market. Learn to 
                      select the freshest ingredients, understand exotic vegetables, and discover the 
                      secrets of Sri Lankan spices.
                    </p>
                    <ul className="space-y-2 text-sm">
                      <li className="flex items-center">
                        <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                        Identify authentic spices
                      </li>
                      <li className="flex items-center">
                        <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                        Select fresh produce
                      </li>
                      <li className="flex items-center">
                        <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                        Local vendor interaction
                      </li>
                      <li className="flex items-center">
                        <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                        Cultural insights
                      </li>
                    </ul>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Flame className="h-5 w-5 mr-2 text-orange-600" />
                      Hands-On Cooking
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600 mb-4">
                      In our fully equipped kitchen, you'll prepare multiple dishes under expert 
                      guidance. Learn traditional techniques, understand spice combinations, and 
                      master the balance of flavors.
                    </p>
                    <ul className="space-y-2 text-sm">
                      <li className="flex items-center">
                        <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                        Step-by-step instruction
                      </li>
                      <li className="flex items-center">
                        <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                        Individual cooking stations
                      </li>
                      <li className="flex items-center">
                        <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                        Professional techniques
                      </li>
                      <li className="flex items-center">
                        <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                        Tips and tricks
                      </li>
                    </ul>
                  </CardContent>
                </Card>
              </div>

              <div>
                <h4 className="text-xl font-semibold mb-4">Traditional Cooking Techniques</h4>
                <div className="grid md:grid-cols-2 gap-4">
                  {cookingTechniques.map((tech, index) => (
                    <Card key={index}>
                      <CardHeader>
                        <CardTitle className="text-lg">{tech.technique}</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-gray-600 mb-2">{tech.description}</p>
                        <div className="flex items-center text-sm">
                          <Info className="h-4 w-4 mr-2 text-orange-600" />
                          <span className="font-medium">Used for:</span>
                          <span className="ml-2">{tech.uses}</span>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            </TabsContent>

            {/* Menu Tab */}
            <TabsContent value="menu" className="space-y-6">
              <h3 className="text-2xl font-bold mb-6">Popular Dishes You'll Learn</h3>
              
              <div className="grid gap-4">
                {popularDishes.map((dish, index) => (
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
                          <div>
                            <CardTitle className="text-lg">{dish.name}</CardTitle>
                            <p className="text-sm text-gray-500">{dish.type}</p>
                          </div>
                          <Badge className={dish.difficulty === "Easy" ? "bg-green-600" : 
                                          dish.difficulty === "Medium" ? "bg-yellow-600" : "bg-red-600"}>
                            {dish.difficulty}
                          </Badge>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-gray-600 mb-3">{dish.description}</p>
                        <div>
                          <span className="text-sm font-semibold">Key Ingredients:</span>
                          <div className="flex flex-wrap gap-2 mt-2">
                            {dish.keyIngredients.map((ingredient, idx) => (
                              <Badge key={idx} variant="outline" className="text-xs">
                                {ingredient}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>

              <Card>
                <CardHeader>
                  <CardTitle>Spice Knowledge</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 mb-4">
                    Understanding spices is crucial to Sri Lankan cooking. You'll learn about:
                  </p>
                  <div className="grid md:grid-cols-3 gap-4">
                    <div>
                      <h4 className="font-semibold mb-2">Essential Spices</h4>
                      <ul className="space-y-1 text-sm text-gray-600">
                        <li>• Cinnamon (true Ceylon)</li>
                        <li>• Cardamom pods</li>
                        <li>• Cloves</li>
                        <li>• Black pepper</li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-2">Curry Essentials</h4>
                      <ul className="space-y-1 text-sm text-gray-600">
                        <li>• Curry leaves</li>
                        <li>• Pandan leaves</li>
                        <li>• Lemongrass</li>
                        <li>• Fenugreek seeds</li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-2">Special Ingredients</h4>
                      <ul className="space-y-1 text-sm text-gray-600">
                        <li>• Goraka (garcinia)</li>
                        <li>• Maldive fish</li>
                        <li>• Coconut milk</li>
                        <li>• Tamarind</li>
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Packages Tab */}
            <TabsContent value="packages" className="space-y-6">
              <h3 className="text-2xl font-bold mb-6">Choose Your Cooking Experience</h3>
              <div className="grid md:grid-cols-2 gap-6">
                {cookingPackages.map((pkg, index) => (
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
                          <pkg.icon className="h-10 w-10 text-orange-600" />
                          <div className="text-right">
                            <Badge className="bg-orange-600">{pkg.duration}</Badge>
                            <Badge variant="outline" className="ml-2">{pkg.level}</Badge>
                          </div>
                        </div>
                        <CardTitle className="text-xl">{pkg.name}</CardTitle>
                        <p className="text-2xl font-bold text-orange-600">{pkg.price}</p>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div>
                          <h4 className="font-semibold mb-2">Class Highlights:</h4>
                          <ul className="space-y-1 text-sm">
                            {pkg.highlights.map((highlight, idx) => (
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
                            {pkg.included.map((item, idx) => (
                              <li key={idx} className="flex items-center">
                                <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                                <span>{item}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                        <Button 
                          className="w-full bg-orange-600 hover:bg-orange-700"
                          onClick={() => handleBookingClick(pkg.name)}
                        >
                          Book This Class
                        </Button>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </TabsContent>

            {/* Details Tab */}
            <TabsContent value="details" className="space-y-6">
              <h3 className="text-2xl font-bold mb-6">Class Information</h3>
              
              <div className="grid md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Class Schedule</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div>
                        <h4 className="font-semibold mb-2">Morning Classes</h4>
                        <ul className="space-y-2 text-sm">
                          <li className="flex items-center">
                            <Clock className="h-4 w-4 mr-2 text-orange-600" />
                            9:00 AM - 12:00 PM (Essential)
                          </li>
                          <li className="flex items-center">
                            <Clock className="h-4 w-4 mr-2 text-orange-600" />
                            8:00 AM - 1:00 PM (Master Chef)
                          </li>
                        </ul>
                      </div>
                      <div>
                        <h4 className="font-semibold mb-2">Afternoon Classes</h4>
                        <ul className="space-y-2 text-sm">
                          <li className="flex items-center">
                            <Clock className="h-4 w-4 mr-2 text-orange-600" />
                            2:00 PM - 5:00 PM (Essential)
                          </li>
                          <li className="flex items-center">
                            <Clock className="h-4 w-4 mr-2 text-orange-600" />
                            3:00 PM - 5:30 PM (Family)
                          </li>
                        </ul>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Location & Facilities</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex items-start">
                        <MapPin className="h-5 w-5 mr-2 text-orange-600 mt-0.5" />
                        <div>
                          <p className="font-semibold">Multiple Locations</p>
                          <p className="text-sm text-gray-600">Colombo, Galle, Kandy</p>
                        </div>
                      </div>
                      <div className="flex items-start">
                        <Users className="h-5 w-5 mr-2 text-orange-600 mt-0.5" />
                        <div>
                          <p className="font-semibold">Class Size</p>
                          <p className="text-sm text-gray-600">Maximum 8 participants</p>
                        </div>
                      </div>
                      <div className="flex items-start">
                        <Award className="h-5 w-5 mr-2 text-orange-600 mt-0.5" />
                        <div>
                          <p className="font-semibold">Certification</p>
                          <p className="text-sm text-gray-600">Certificate provided on completion</p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle>What Makes Our Classes Special</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-semibold mb-3">Authentic Experience</h4>
                      <ul className="space-y-2 text-sm">
                        <li className="flex items-start">
                          <CheckCircle className="h-4 w-4 text-green-500 mr-2 mt-0.5" />
                          <span>Traditional family recipes passed down generations</span>
                        </li>
                        <li className="flex items-start">
                          <CheckCircle className="h-4 w-4 text-green-500 mr-2 mt-0.5" />
                          <span>Use of authentic cooking methods and tools</span>
                        </li>
                        <li className="flex items-start">
                          <CheckCircle className="h-4 w-4 text-green-500 mr-2 mt-0.5" />
                          <span>Local chef instructors with decades of experience</span>
                        </li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-3">Take-Home Value</h4>
                      <ul className="space-y-2 text-sm">
                        <li className="flex items-start">
                          <CheckCircle className="h-4 w-4 text-green-500 mr-2 mt-0.5" />
                          <span>Comprehensive recipe book with photos</span>
                        </li>
                        <li className="flex items-start">
                          <CheckCircle className="h-4 w-4 text-green-500 mr-2 mt-0.5" />
                          <span>Spice pack to recreate dishes at home</span>
                        </li>
                        <li className="flex items-start">
                          <CheckCircle className="h-4 w-4 text-green-500 mr-2 mt-0.5" />
                          <span>Online support for future cooking questions</span>
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
          <h2 className="text-3xl font-bold text-center mb-12">Cooking Class Gallery</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {[
              "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&h=300&fit=crop",
              "https://images.unsplash.com/photo-1547592180-e55fa7d7f7c7?w=400&h=300&fit=crop",
              "https://images.unsplash.com/photo-1606923829579-0cb981a83e2e?w=400&h=300&fit=crop",
              "https://images.unsplash.com/photo-1596797038530-2c107229654b?w=400&h=300&fit=crop",
              "https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=400&h=300&fit=crop",
              "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=300&fit=crop",
              "https://images.unsplash.com/photo-1556911220-bff31c812dba?w=400&h=300&fit=crop",
              "https://images.unsplash.com/photo-1551218808-94e220e084d2?w=400&h=300&fit=crop"
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
                  alt={`Cooking class ${index + 1}`}
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
              Ready to Cook Like a Sri Lankan?
            </h2>
            <p className="text-xl mb-8 text-white/90">
              Join us for an unforgettable culinary adventure. Learn, cook, eat, and 
              take home the flavors of Sri Lanka!
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                size="lg"
                className="bg-white text-orange-700 hover:bg-gray-100 px-8 py-6 text-lg"
                onClick={() => handleBookingClick()}
              >
                <UtensilsCrossed className="mr-2 h-5 w-5" />
                Book Your Class
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
        itemTitle={selectedPackage || "Cooking Class Experience"}
      />
    </>
  );
};

export default CookingClass;