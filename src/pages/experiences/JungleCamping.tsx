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
  Eye,
  Loader2,
  Mountain,
  Leaf,
  Compass,
  Crown,
  Backpack,
  Home
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import EnhancedBookingModal from '@/components/EnhancedBookingModal';
import jungleCampingPageService, { JungleCampingPageContent } from '@/services/jungleCampingPageService';
import { cachedFetch } from '@/lib/cache';

// Optimized image URL generator
const getOptimizedImageUrl = (url: string, width: number = 1200): string => {
  if (!url) return '';
  if (url.includes('unsplash.com')) {
    const baseUrl = url.split('?')[0];
    return `${baseUrl}?w=${width}&q=80&auto=format&fit=crop`;
  }
  return url;
};

// Default fallback hero images
const defaultHeroImages = [
  { id: '1', url: 'https://images.unsplash.com/photo-1504280390367-361c6d9f38f4', caption: 'Jungle Camping Adventure' },
  { id: '2', url: 'https://images.unsplash.com/photo-1510312305653-8ed496efae75', caption: 'Campfire Under Stars' },
  { id: '3', url: 'https://images.unsplash.com/photo-1445308394109-4ec2920981b1', caption: 'Safari Tent Experience' },
  { id: '4', url: 'https://images.unsplash.com/photo-1533873984035-25970ab07461', caption: 'Wilderness Exploration' }
];

// Icon mapping for dynamic icons from Firebase
const iconMap: Record<string, React.FC<any>> = {
  Tent, Trees, Camera, Clock, MapPin, Calendar, Star, Users, Sunrise, Moon,
  Flame, Binoculars, Package, Globe, Phone, Mail, Shield, Flashlight, Eye,
  Mountain, Leaf, Compass, Crown, Backpack, Home, Info, DollarSign
};

const JungleCamping = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [selectedPackage, setSelectedPackage] = useState<string | null>(null);
  const [heroImageIndex, setHeroImageIndex] = useState(0);
  const [pageContent, setPageContent] = useState<JungleCampingPageContent | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch content from Firebase with caching
  useEffect(() => {
    const loadContent = async () => {
      try {
        const content = await cachedFetch<JungleCampingPageContent>(
          'jungle-camping-page',
          () => jungleCampingPageService.getPageContent(),
          10 * 60 * 1000 // Cache for 10 minutes
        );
        setPageContent(content);

        // Preload hero images
        if (content?.hero?.images?.length) {
          content.hero.images.slice(0, 3).forEach((img, index) => {
            const link = document.createElement('link');
            link.rel = index === 0 ? 'preload' : 'prefetch';
            link.as = 'image';
            link.href = getOptimizedImageUrl(img.url, 1920);
            document.head.appendChild(link);
          });
        }
      } catch (error) {
        console.error('Error loading page content:', error);
        setPageContent(jungleCampingPageService.getDefaultContent());
      } finally {
        setIsLoading(false);
      }
    };
    loadContent();
  }, []);

  // Hero image rotation
  useEffect(() => {
    if (!pageContent?.hero?.images?.length) return;
    const interval = setInterval(() => {
      setHeroImageIndex((prev) => (prev + 1) % pageContent.hero.images.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [pageContent?.hero?.images?.length]);

  const handleBookingClick = (packageName?: string) => {
    setSelectedPackage(packageName || null);
    setIsBookingModalOpen(true);
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-green-50">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-green-600 mx-auto mb-4" />
          <p className="text-gray-600">Loading jungle camping experience...</p>
        </div>
      </div>
    );
  }

  const heroImages = pageContent?.hero?.images?.length ? pageContent.hero.images : defaultHeroImages;
  const currentHeroImage = heroImages[heroImageIndex] || defaultHeroImages[0];

  return (
    <>
      <Helmet>
        <title>{pageContent?.seo?.title || 'Jungle Camping Sri Lanka | Recharge Travels'}</title>
        <meta name="description" content={pageContent?.seo?.description || ''} />
        <meta name="keywords" content={pageContent?.seo?.keywords?.join(', ') || ''} />
        <meta property="og:title" content={pageContent?.seo?.title || ''} />
        <meta property="og:description" content={pageContent?.seo?.description || ''} />
        <meta property="og:image" content={pageContent?.seo?.ogImage || ''} />
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
              src={getOptimizedImageUrl(currentHeroImage.url, 1920)}
              alt={currentHeroImage.caption}
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
                {pageContent?.hero?.title || 'Jungle Camping Adventure'}
              </h1>
              <p className="text-xl md:text-2xl mb-8 font-light drop-shadow">
                {pageContent?.hero?.subtitle || 'Sleep Under Stars in the Wild Heart of Sri Lanka'}
              </p>
              <Button
                onClick={() => handleBookingClick()}
                size="lg"
                className="bg-green-600 hover:bg-green-700 text-white px-8 py-6 text-lg rounded-full
                         transform hover:scale-105 transition-all duration-300 shadow-xl"
              >
                <Tent className="mr-2 h-5 w-5" />
                {pageContent?.hero?.ctaText || 'Book Camping Trip'}
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
            <h2 className="text-4xl font-bold mb-6">
              {pageContent?.overview?.title || 'Immerse Yourself in Wilderness'}
            </h2>
            <p className="text-xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
              {pageContent?.overview?.description || ''}
            </p>
          </motion.div>

          {/* Quick Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12">
            {pageContent?.stats?.map((stat, index) => {
              const IconComponent = iconMap[stat.iconName] || Trees;
              return (
                <motion.div
                  key={stat.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="text-center"
                >
                  <IconComponent className="h-12 w-12 text-green-600 mx-auto mb-3" />
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
              <TabsTrigger value="packages">Camping Packages</TabsTrigger>
              <TabsTrigger value="wildlife">Wildlife</TabsTrigger>
              <TabsTrigger value="prepare">Preparation</TabsTrigger>
            </TabsList>

            {/* Overview Tab */}
            <TabsContent value="overview" className="space-y-6">
              <h3 className="text-2xl font-bold mb-6">The Wilderness Experience</h3>

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
                            Pickup and journey to the park
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
                {pageContent?.campingPackages?.map((pkg, index) => {
                  const IconComponent = iconMap[pkg.iconName] || Tent;
                  return (
                    <motion.div
                      key={pkg.id}
                      initial={{ opacity: 0, scale: 0.95 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      viewport={{ once: true }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <Card className="h-full hover:shadow-xl transition-shadow">
                        <CardHeader>
                          <div className="flex items-center justify-between mb-3">
                            <IconComponent className="h-10 w-10 text-green-600" />
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
                              {pkg.highlights?.map((highlight, idx) => (
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
                              {pkg.included?.map((item, idx) => (
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
                  );
                })}
              </div>
            </TabsContent>

            {/* Wildlife Tab */}
            <TabsContent value="wildlife" className="space-y-6">
              <h3 className="text-2xl font-bold mb-6">Wildlife Encounters</h3>

              <Card className="mb-6">
                <CardHeader>
                  <CardTitle>About the National Park</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600">
                    Sri Lanka's national parks are home to incredible biodiversity. The unique feature
                    of natural lakes attracts diverse wildlife, making it one of the best places for
                    wildlife viewing. The varied habitats support an incredible array of fauna.
                  </p>
                </CardContent>
              </Card>

              <div className="grid gap-4">
                {pageContent?.wildlifeSpottings?.map((animal, index) => (
                  <motion.div
                    key={animal.id}
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
                    The park is a birder's paradise with over 200 recorded species including many endemics.
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
                {pageContent?.campingEssentials?.map((category, index) => {
                  const IconComponent = iconMap[category.iconName] || Package;
                  return (
                    <Card key={category.id}>
                      <CardHeader>
                        <CardTitle className="text-lg flex items-center">
                          <IconComponent className="h-5 w-5 mr-2 text-green-600" />
                          {category.category}
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <ul className="space-y-2">
                          {category.items?.map((item, idx) => (
                            <li key={idx} className="flex items-center text-sm">
                              <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                              <span>{item}</span>
                            </li>
                          ))}
                        </ul>
                      </CardContent>
                    </Card>
                  );
                })}
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
            {pageContent?.gallery?.map((image, index) => (
              <motion.div
                key={image.id}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.05 }}
                className="relative overflow-hidden rounded-lg group cursor-pointer"
              >
                <img
                  src={image.url}
                  alt={image.alt}
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
            {pageContent?.faqs?.map((faq, index) => (
              <AccordionItem key={faq.id} value={`item-${index}`}>
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
              {pageContent?.cta?.title || 'Ready for Your Wilderness Adventure?'}
            </h2>
            <p className="text-xl mb-8 text-white/90">
              {pageContent?.cta?.description || 'Experience the thrill of camping in Sri Lanka\'s wild heart.'}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                size="lg"
                className="bg-white text-green-700 hover:bg-gray-100 px-8 py-6 text-lg"
                onClick={() => handleBookingClick()}
              >
                <Tent className="mr-2 h-5 w-5" />
                {pageContent?.cta?.primaryButtonText || 'Book Camping Trip'}
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-white text-white hover:bg-white/10 px-8 py-6 text-lg"
                onClick={() => window.open('https://wa.me/94777721999', '_blank')}
              >
                <Phone className="mr-2 h-5 w-5" />
                {pageContent?.cta?.secondaryButtonText || 'Call for Details'}
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
              <p className="text-gray-300">{pageContent?.contact?.phone || '+94 77 772 1999'}</p>
              <p className="text-sm text-gray-400">{pageContent?.contact?.phoneNote || 'Available 24/7'}</p>
            </a>
            <div className="flex flex-col items-center">
              <Mail className="h-8 w-8 mb-3 text-green-400" />
              <h3 className="font-semibold mb-2">Email Us</h3>
              <p className="text-gray-300">{pageContent?.contact?.email || 'info@rechargetravels.com'}</p>
              <p className="text-sm text-gray-400">{pageContent?.contact?.emailNote || 'Quick response'}</p>
            </div>
            <div className="flex flex-col items-center">
              <Globe className="h-8 w-8 mb-3 text-green-400" />
              <h3 className="font-semibold mb-2">Visit Website</h3>
              <p className="text-gray-300">{pageContent?.contact?.website || 'www.rechargetravels.com'}</p>
              <p className="text-sm text-gray-400">{pageContent?.contact?.websiteNote || 'More experiences'}</p>
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
