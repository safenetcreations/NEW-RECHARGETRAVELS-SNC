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
import { useQuery } from '@tanstack/react-query';
import { db } from '@/lib/firebase';
import { doc, getDoc } from 'firebase/firestore';
import { toast } from 'sonner';

// Optimized image URL generator
const getOptimizedImageUrl = (url: string, width: number = 1200): string => {
  if (!url) return '';
  if (url.includes('unsplash.com')) {
    const baseUrl = url.split('?')[0];
    return `${baseUrl}?w=${width}&q=80&auto=format&fit=crop`;
  }
  return url;
};

interface CookingPackage {
  name: string;
  duration: string;
  price: string;
  highlights: string[];
  included: string[];
  level: string;
  maxParticipants: number;
}

interface Dish {
  name: string;
  type: string;
  difficulty: string;
  description: string;
  keyIngredients: string[];
}

interface CookingTechnique {
  technique: string;
  description: string;
  uses: string;
}

interface GalleryImage {
  url: string;
  caption: string;
}

interface FAQ {
  question: string;
  answer: string;
}

interface Stat {
  icon: string;
  label: string;
  value: string;
}

interface ClassSchedule {
  morning: Array<{ time: string; type: string }>;
  afternoon: Array<{ time: string; type: string }>;
}

interface Contact {
  phone: string;
  email: string;
  website: string;
}

interface CookingClassData {
  id: string;
  slug: string;
  name: string;
  heroImageURL: string;
  seo: {
    title: string;
    description: string;
    keywords: string;
  };
  introParagraph: string;
  highlights: Array<{ icon: string; title: string; blurb60: string }>;
  cookingClasses: CookingPackage[];
  popularDishes: Dish[];
  cookingTechniques: CookingTechnique[];
  gallery: GalleryImage[];
  faqs: FAQ[];
  stats: Stat[];
  classSchedule: ClassSchedule;
  contact: Contact;
}

const CookingClass = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [selectedPackage, setSelectedPackage] = useState<string | null>(null);
  const [heroImageIndex, setHeroImageIndex] = useState(0);

  // Fetch cooking class data from Firestore
  const { data: cookingClassData, isLoading, error } = useQuery({
    queryKey: ['cooking-class-experience'],
    queryFn: async (): Promise<CookingClassData> => {
      const docRef = doc(db, 'experiences', 'cooking-class-sri-lanka');
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        return docSnap.data() as CookingClassData;
      } else {
        throw new Error('Cooking class experience data not found');
      }
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  // Fallback data if Firestore data is not available
  const data = cookingClassData || {
    name: 'Sri Lankan Cooking Classes',
    heroImageURL: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=1920&h=1080&fit=crop',
    seo: {
      title: 'Sri Lankan Cooking Classes | Traditional Recipe Lessons | Recharge Travels',
      description: 'Learn authentic Sri Lankan cooking with expert chefs. From market visits to mastering curries, discover the secrets of Ceylon cuisine in hands-on classes.',
      keywords: 'Sri Lankan cooking class, learn Sri Lankan recipes, curry cooking lessons, Ceylon cuisine, cooking experience Colombo, traditional cooking'
    },
    introParagraph: 'Immerse yourself in the vibrant world of Sri Lankan cuisine through our hands-on cooking classes. Learn time-honored techniques, master the art of spice blending, and create authentic dishes that capture the essence of Ceylon\'s culinary heritage.',
    highlights: [
      { icon: '🛒', title: 'Market Adventure', blurb60: 'Begin with a visit to local markets to select the freshest ingredients and learn about exotic spices.' },
      { icon: '👨‍🍳', title: 'Hands-On Cooking', blurb60: 'Learn traditional techniques and spice combinations under expert guidance in professional kitchens.' },
      { icon: '🍽️', title: 'Authentic Recipes', blurb60: 'Master iconic dishes like Rice & Curry, Kottu Roti, Fish Ambul Thiyal, and traditional desserts.' },
      { icon: '📚', title: 'Recipe Collection', blurb60: 'Take home comprehensive recipe booklets with detailed instructions and spice substitution guides.' }
    ],
    cookingClasses: [],
    popularDishes: [],
    cookingTechniques: [],
    gallery: [],
    faqs: [],
    stats: [],
    classSchedule: { morning: [], afternoon: [] },
    contact: { phone: '+94 76 505 9595', email: 'info@rechargetravels.com', website: 'www.rechargetravels.com' }
  };

  const faqs = (data.faqs && data.faqs.length > 0 ? data.faqs : []) || [];

  const baseUrl = typeof window !== 'undefined'
    ? window.location.origin
    : 'https://www.rechargetravels.com';

  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": faqs.map((faq) => ({
      "@type": "Question",
      "name": faq.question,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": faq.answer,
      },
    })),
  };

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "Home",
        "item": baseUrl,
      },
      {
        "@type": "ListItem",
        "position": 2,
        "name": "Experiences",
        "item": `${baseUrl}/experiences`,
      },
      {
        "@type": "ListItem",
        "position": 3,
        "name": "Sri Lankan Cooking Class",
        "item": `${baseUrl}/experiences/cooking-class-sri-lanka`,
      },
    ],
  };

  // Create hero images array from gallery or use default
  const heroImages = data.gallery && data.gallery.length > 0
    ? data.gallery.slice(0, 4).map(img => ({ url: img.url, caption: img.caption }))
    : [
        { url: data.heroImageURL || 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=1920&h=1080&fit=crop', caption: 'Sri Lankan Spices' },
        { url: 'https://images.unsplash.com/photo-1547592180-e55fa7d7f7c7?w=1920&h=1080&fit=crop', caption: 'Traditional Cooking' },
        { url: 'https://images.unsplash.com/photo-1606923829579-0cb981a83e2e?w=1920&h=1080&fit=crop', caption: 'Fresh Ingredients' },
        { url: 'https://images.unsplash.com/photo-1596797038530-2c107229654b?w=1920&h=1080&fit=crop', caption: 'Authentic Curry Making' }
      ];

  // Hero image rotation - must be called before any early returns
  useEffect(() => {
    const interval = setInterval(() => {
      setHeroImageIndex((prev) => (prev + 1) % heroImages.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [heroImages.length]);

  const handleBookingClick = (packageName?: string) => {
    setSelectedPackage(packageName || null);
    setIsBookingModalOpen(true);
  };

  // Helper function to get icon component from string
  const getIconComponent = (iconName: string) => {
    const iconMap: { [key: string]: React.FC<any> } = {
      'UtensilsCrossed': UtensilsCrossed,
      'Users': Users,
      'Award': Award,
      'Star': Star,
    };
    return iconMap[iconName] || UtensilsCrossed;
  };

  // Show loading state

  // Show error state

  return (
    <>
      <Helmet>
        <title>{data.seo?.title || 'Sri Lankan Cooking Classes | Traditional Recipe Lessons | Recharge Travels'}</title>
        <meta name="description" content={data.seo?.description || 'Learn authentic Sri Lankan cooking with expert chefs. From market visits to mastering curries, discover the secrets of Ceylon cuisine in hands-on classes.'} />
        <meta name="keywords" content={data.seo?.keywords || 'Sri Lankan cooking class, learn Sri Lankan recipes, curry cooking lessons, Ceylon cuisine, cooking experience Colombo, traditional cooking'} />
        <meta property="og:title" content={`${data.name || 'Sri Lankan Cooking Classes'} - Master Authentic Ceylon Cuisine`} />
        <meta property="og:description" content={data.seo?.description || 'Join our hands-on cooking classes to learn traditional Sri Lankan recipes, spice secrets, and culinary techniques.'} />
        <meta property="og:image" content={data.heroImageURL || 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=1200&h=630&fit=crop'} />
        <meta property="og:url" content={`${baseUrl}/experiences/cooking-class-sri-lanka`} />
        <link rel="canonical" href={`${baseUrl}/experiences/cooking-class-sri-lanka`} />
        <script type="application/ld+json">{JSON.stringify(breadcrumbJsonLd)}</script>
        {faqs.length > 0 && (
          <script type="application/ld+json">{JSON.stringify(faqJsonLd)}</script>
        )}
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
              src={getOptimizedImageUrl(heroImages[heroImageIndex].url, 1920)}
              alt={heroImages[heroImageIndex].caption}
              className="w-full h-full object-cover"
              loading={heroImageIndex === 0 ? 'eager' : 'lazy'}
              fetchPriority={heroImageIndex === 0 ? 'high' : 'auto'}
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
              {data.introParagraph || 'Immerse yourself in the vibrant world of Sri Lankan cuisine through our hands-on cooking classes. Learn time-honored techniques, master the art of spice blending, and create authentic dishes that capture the essence of Ceylon\'s culinary heritage. From market tours to plate presentation, experience the complete journey of Sri Lankan cooking.'}
            </p>
          </motion.div>

          {/* Quick Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12">
            {(data.stats || [
              { icon: 'UtensilsCrossed', label: "Dishes Taught", value: "30+" },
              { icon: 'Users', label: "Happy Cooks", value: "5,000+" },
              { icon: 'Award', label: "Years Experience", value: "15+" },
              { icon: 'Star', label: "Google Rating", value: "4.9/5" }
            ]).map((stat, index) => {
              const IconComponent = getIconComponent(stat.icon);
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="text-center"
                >
                  <IconComponent className="h-12 w-12 text-orange-600 mx-auto mb-3" />
                  <div className="text-3xl font-bold text-gray-800">{stat.value}</div>
                  <div className="text-gray-600">{stat.label}</div>
                </motion.div>
              );
            })}
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
                      {(data.highlights && data.highlights[0]) ? data.highlights[0].title : 'Market Adventure'}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600 mb-4">
                      {(data.highlights && data.highlights[0]) ? data.highlights[0].blurb60 : 'Begin your culinary journey with an optional visit to a local market. Learn to select the freshest ingredients, understand exotic vegetables, and discover the secrets of Sri Lankan spices.'}
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
                      {(data.highlights && data.highlights[1]) ? data.highlights[1].title : 'Hands-On Cooking'}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600 mb-4">
                      {(data.highlights && data.highlights[1]) ? data.highlights[1].blurb60 : 'In our fully equipped kitchen, you\'ll prepare multiple dishes under expert guidance. Learn traditional techniques, understand spice combinations, and master the balance of flavors.'}
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
                  {(data.cookingTechniques || []).map((tech, index) => (
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
                {(data.popularDishes || []).map((dish, index) => (
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
                {(data.cookingClasses || []).map((pkg, index) => {
                  const IconComponent = getIconComponent(pkg.icon || 'UtensilsCrossed');
                  return (
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
                            <IconComponent className="h-10 w-10 text-orange-600" />
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
                              {(pkg.highlights || []).map((highlight, idx) => (
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
                              {(pkg.included || []).map((item, idx) => (
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
                  );
                })}
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
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-4 text-gray-900">Cooking Class Gallery</h2>
          <p className="text-center text-gray-600 mb-10 max-w-3xl mx-auto">
            A glimpse into our hands-on Sri Lankan cooking sessions, from market visits to plating your creations.
          </p>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {(data.gallery || []).slice(0, 8).map((image, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.05 }}
                className="relative overflow-hidden rounded-lg group cursor-pointer"
              >
                <img
                  src={getOptimizedImageUrl(image.url, 400)}
                  alt={image.caption || `Cooking class ${index + 1}`}
                  className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-500"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <p className="absolute bottom-3 left-3 right-3 text-white text-xs sm:text-sm">
                    {image.caption || `Sri Lankan cooking class ${index + 1}`}
                  </p>
                </div>
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
            {(data.faqs || []).map((faq, index) => (
              <AccordionItem
                key={index}
                value={`item-${index}`}
                className="border border-gray-200 rounded-2xl px-4 md:px-6 bg-white"
              >
                <AccordionTrigger className="text-left font-semibold text-gray-800 hover:text-orange-600">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-gray-700 pt-2 pb-4">
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
              <p className="text-gray-300">{data.contact?.phone || '+94 76 505 9595'}</p>
              <p className="text-sm text-gray-400">Available 24/7</p>
            </div>
            <div className="flex flex-col items-center">
              <Mail className="h-8 w-8 mb-3 text-orange-400" />
              <h3 className="font-semibold mb-2">Email Us</h3>
              <p className="text-gray-300">{data.contact?.email || 'info@rechargetravels.com'}</p>
              <p className="text-sm text-gray-400">Quick response</p>
            </div>
            <div className="flex flex-col items-center">
              <Globe className="h-8 w-8 mb-3 text-orange-400" />
              <h3 className="font-semibold mb-2">Visit Website</h3>
              <p className="text-gray-300">{data.contact?.website || 'www.rechargetravels.com'}</p>
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