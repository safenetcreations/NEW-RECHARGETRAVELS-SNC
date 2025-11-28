import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Cloud,
  Mountain,
  Camera,
  Clock,
  MapPin,
  Calendar,
  Star,
  Users,
  Sunrise,
  Sun,
  Wind,
  Navigation,
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
  Award,
  Heart,
  Loader2
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import EnhancedBookingModal from '@/components/EnhancedBookingModal';
import hotAirBalloonSigiriyaPageService, { HotAirBalloonSigiriyaPageContent } from '@/services/hotAirBalloonSigiriyaPageService';
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
  { id: '1', url: 'https://images.unsplash.com/photo-1507608616759-54f48f0af0ee', caption: 'Hot Air Balloon at Sunrise' },
  { id: '2', url: 'https://images.unsplash.com/photo-1495562569060-2eec283d3391', caption: 'Sigiriya Rock from Above' },
  { id: '3', url: 'https://images.unsplash.com/photo-1474496517593-015d8c59cd3e', caption: 'Balloon Flight Adventure' },
  { id: '4', url: 'https://images.unsplash.com/photo-1570710891163-6d3b5c47248b', caption: 'Sri Lanka Landscape' }
];

// Icon mapping for dynamic icons from Firebase
const iconMap: Record<string, React.FC<any>> = {
  Cloud, Mountain, Camera, Clock, MapPin, Calendar, Star, Users, Sunrise, Sun,
  Wind, Navigation, Package, Globe, Phone, Mail, Shield, Award, Heart, Info
};

const HotAirBalloonSigiriya = () => {
  const [activeTab, setActiveTab] = useState('experience');
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [selectedPackage, setSelectedPackage] = useState<string | null>(null);
  const [heroImageIndex, setHeroImageIndex] = useState(0);
  const [pageContent, setPageContent] = useState<HotAirBalloonSigiriyaPageContent | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch content from Firebase with caching
  useEffect(() => {
    const loadContent = async () => {
      try {
        const content = await cachedFetch<HotAirBalloonSigiriyaPageContent>(
          'hot-air-balloon-sigiriya-page',
          () => hotAirBalloonSigiriyaPageService.getPageContent(),
          10 * 60 * 1000 // Cache for 10 minutes
        );
        setPageContent(content);

        // Preload hero images for faster display
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
        setPageContent(hotAirBalloonSigiriyaPageService.getDefaultContent());
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
      <div className="min-h-screen flex items-center justify-center bg-purple-50">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-purple-600 mx-auto mb-4" />
          <p className="text-gray-600">Loading hot air balloon experience...</p>
        </div>
      </div>
    );
  }

  const heroImages = pageContent?.hero?.images?.length ? pageContent.hero.images : defaultHeroImages;
  const currentHeroImage = heroImages[heroImageIndex] || { url: '', caption: '' };

  return (
    <>
      <Helmet>
        <title>{pageContent?.seo?.title || 'Hot Air Ballooning Sigiriya | Recharge Travels'}</title>
        <meta name="description" content={pageContent?.seo?.description || ''} />
        <meta name="keywords" content={pageContent?.seo?.keywords?.join(', ') || ''} />
        <meta property="og:title" content={pageContent?.seo?.title || ''} />
        <meta property="og:description" content={pageContent?.seo?.description || ''} />
        <meta property="og:image" content={pageContent?.seo?.ogImage || ''} />
        <link rel="canonical" href="https://www.rechargetravels.com/experiences/hot-air-balloon-sigiriya" />
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
                {pageContent?.hero?.title || 'Hot Air Ballooning'}
              </h1>
              <p className="text-xl md:text-2xl mb-8 font-light drop-shadow">
                {pageContent?.hero?.subtitle || "Soar Above Sigiriya's Ancient Wonders at Sunrise"}
              </p>
              <Button
                onClick={() => handleBookingClick()}
                size="lg"
                className="bg-purple-600 hover:bg-purple-700 text-white px-8 py-6 text-lg rounded-full
                         transform hover:scale-105 transition-all duration-300 shadow-xl"
              >
                <Cloud className="mr-2 h-5 w-5" />
                {pageContent?.hero?.ctaText || 'Book Your Flight'}
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
              {pageContent?.overview?.title || 'A Magical Journey Above Ancient Kingdoms'}
            </h2>
            <p className="text-xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
              {pageContent?.overview?.description || ''}
            </p>
          </motion.div>

          {/* Quick Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12">
            {pageContent?.stats?.map((stat, index) => {
              const IconComponent = iconMap[stat.iconName] || Navigation;
              return (
                <motion.div
                  key={stat.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="text-center"
                >
                  <IconComponent className="h-12 w-12 text-purple-600 mx-auto mb-3" />
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
              <TabsTrigger value="experience">The Experience</TabsTrigger>
              <TabsTrigger value="packages">Flight Packages</TabsTrigger>
              <TabsTrigger value="journey">Flight Journey</TabsTrigger>
              <TabsTrigger value="prepare">Preparation</TabsTrigger>
            </TabsList>

            {/* Experience Tab */}
            <TabsContent value="experience" className="space-y-6">
              <h3 className="text-2xl font-bold mb-6">What to Expect</h3>

              <div className="grid md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Sunrise className="h-5 w-5 mr-2 text-purple-600" />
                      Pre-Dawn Adventure
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600 mb-4">
                      Your adventure begins before sunrise with a pickup from your hotel.
                      Arrive at the launch site to watch the magical inflation process as
                      your balloon comes to life in the pre-dawn light.
                    </p>
                    <ul className="space-y-2 text-sm">
                      <li className="flex items-start">
                        <CheckCircle className="h-4 w-4 text-green-500 mr-2 mt-0.5" />
                        <span>Hotel pickup around 5:00 AM</span>
                      </li>
                      <li className="flex items-start">
                        <CheckCircle className="h-4 w-4 text-green-500 mr-2 mt-0.5" />
                        <span>Safety briefing by certified pilot</span>
                      </li>
                      <li className="flex items-start">
                        <CheckCircle className="h-4 w-4 text-green-500 mr-2 mt-0.5" />
                        <span>Watch balloon inflation process</span>
                      </li>
                      <li className="flex items-start">
                        <CheckCircle className="h-4 w-4 text-green-500 mr-2 mt-0.5" />
                        <span>Board basket for takeoff</span>
                      </li>
                    </ul>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Cloud className="h-5 w-5 mr-2 text-purple-600" />
                      In-Flight Experience
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600 mb-4">
                      As you gently rise into the sky, watch the landscape transform below.
                      Your pilot will point out landmarks and share stories about the ancient
                      kingdoms that once ruled these lands.
                    </p>
                    <ul className="space-y-2 text-sm">
                      <li className="flex items-start">
                        <CheckCircle className="h-4 w-4 text-green-500 mr-2 mt-0.5" />
                        <span>360-degree panoramic views</span>
                      </li>
                      <li className="flex items-start">
                        <CheckCircle className="h-4 w-4 text-green-500 mr-2 mt-0.5" />
                        <span>Fly over Sigiriya Rock Fortress</span>
                      </li>
                      <li className="flex items-start">
                        <CheckCircle className="h-4 w-4 text-green-500 mr-2 mt-0.5" />
                        <span>See ancient irrigation systems</span>
                      </li>
                      <li className="flex items-start">
                        <CheckCircle className="h-4 w-4 text-green-500 mr-2 mt-0.5" />
                        <span>Spot wildlife from above</span>
                      </li>
                    </ul>
                  </CardContent>
                </Card>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle>Scenic Highlights</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-3 gap-6">
                    <div>
                      <h4 className="font-semibold mb-2 flex items-center">
                        <Mountain className="h-4 w-4 mr-2 text-purple-600" />
                        Sigiriya Lion Rock
                      </h4>
                      <p className="text-sm text-gray-600">
                        The iconic 5th-century fortress rises majestically from the plains,
                        offering spectacular aerial views of its summit and ancient gardens.
                      </p>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-2 flex items-center">
                        <Navigation className="h-4 w-4 mr-2 text-purple-600" />
                        Cultural Triangle
                      </h4>
                      <p className="text-sm text-gray-600">
                        Glimpse ancient capitals of Anuradhapura and Polonnaruwa, with their
                        stupas and reservoirs visible from your elevated vantage point.
                      </p>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-2 flex items-center">
                        <Sun className="h-4 w-4 mr-2 text-purple-600" />
                        Sunrise Splendor
                      </h4>
                      <p className="text-sm text-gray-600">
                        Watch the sun rise over misty mountains and forests, painting the
                        landscape in golden hues - a photographer's dream come true.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Packages Tab */}
            <TabsContent value="packages" className="space-y-6">
              <h3 className="text-2xl font-bold mb-6">Choose Your Perfect Flight</h3>
              <div className="grid md:grid-cols-2 gap-6">
                {pageContent?.flightPackages?.map((pkg, index) => {
                  const IconComponent = iconMap[pkg.iconName] || Cloud;
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
                            <IconComponent className="h-10 w-10 text-purple-600" />
                            <Badge className="bg-purple-600">{pkg.duration}</Badge>
                          </div>
                          <CardTitle className="text-xl">{pkg.name}</CardTitle>
                          <p className="text-2xl font-bold text-purple-600">{pkg.price}</p>
                          <p className="text-sm text-gray-500">{pkg.bestFor}</p>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          <div>
                            <h4 className="font-semibold mb-2">Experience Highlights:</h4>
                            <ul className="space-y-1 text-sm">
                              {pkg.highlights?.map((highlight, idx) => (
                                <li key={idx} className="flex items-start">
                                  <ChevronRight className="h-4 w-4 text-purple-600 mr-1 mt-0.5 flex-shrink-0" />
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
                            className="w-full bg-purple-600 hover:bg-purple-700"
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

              {/* Time Slots */}
              <div>
                <h4 className="text-xl font-semibold mb-4">Flight Time Options</h4>
                <div className="grid md:grid-cols-2 gap-4">
                  {pageContent?.timeSlots?.map((slot) => (
                    <Card key={slot.id}>
                      <CardHeader>
                        <CardTitle className="text-lg flex items-center">
                          <Clock className="h-5 w-5 mr-2 text-purple-600" />
                          {slot.time}
                        </CardTitle>
                        <p className="text-sm text-gray-600">{slot.description}</p>
                      </CardHeader>
                      <CardContent>
                        <ul className="space-y-1">
                          {slot.advantages?.map((advantage, idx) => (
                            <li key={idx} className="text-sm flex items-center">
                              <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                              {advantage}
                            </li>
                          ))}
                        </ul>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            </TabsContent>

            {/* Journey Tab */}
            <TabsContent value="journey" className="space-y-6">
              <h3 className="text-2xl font-bold mb-6">Your Flight Journey</h3>

              <Card>
                <CardHeader>
                  <CardTitle>Flight Path & Timeline</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {pageContent?.flightPath?.map((stage, index) => (
                      <motion.div
                        key={stage.id}
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: index * 0.1 }}
                        className="flex items-start"
                      >
                        <div className="flex-shrink-0 w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center mr-4">
                          <span className="text-purple-600 font-semibold">{index + 1}</span>
                        </div>
                        <div className="flex-grow">
                          <h4 className="font-semibold">{stage.stage}</h4>
                          <p className="text-sm text-gray-600">{stage.description}</p>
                          <p className="text-xs text-purple-600 mt-1">{stage.duration}</p>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <div className="grid md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Camera className="h-5 w-5 mr-2 text-purple-600" />
                      Photography Tips
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2 text-sm">
                      <li className="flex items-start">
                        <Info className="h-4 w-4 text-blue-500 mr-2 mt-0.5" />
                        <span>Bring fully charged cameras/phones</span>
                      </li>
                      <li className="flex items-start">
                        <Info className="h-4 w-4 text-blue-500 mr-2 mt-0.5" />
                        <span>Wide-angle lens recommended</span>
                      </li>
                      <li className="flex items-start">
                        <Info className="h-4 w-4 text-blue-500 mr-2 mt-0.5" />
                        <span>Secure camera straps essential</span>
                      </li>
                      <li className="flex items-start">
                        <Info className="h-4 w-4 text-blue-500 mr-2 mt-0.5" />
                        <span>Best light during golden hour</span>
                      </li>
                    </ul>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Wind className="h-5 w-5 mr-2 text-purple-600" />
                      Weather Conditions
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2 text-sm">
                      <li className="flex items-start">
                        <Info className="h-4 w-4 text-blue-500 mr-2 mt-0.5" />
                        <span>Flights depend on calm weather</span>
                      </li>
                      <li className="flex items-start">
                        <Info className="h-4 w-4 text-blue-500 mr-2 mt-0.5" />
                        <span>Best season: December to April</span>
                      </li>
                      <li className="flex items-start">
                        <Info className="h-4 w-4 text-blue-500 mr-2 mt-0.5" />
                        <span>Morning flights most reliable</span>
                      </li>
                      <li className="flex items-start">
                        <Info className="h-4 w-4 text-blue-500 mr-2 mt-0.5" />
                        <span>Decision made night before</span>
                      </li>
                    </ul>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Preparation Tab */}
            <TabsContent value="prepare" className="space-y-6">
              <h3 className="text-2xl font-bold mb-6">Prepare for Your Flight</h3>

              <div className="grid md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>What to Wear</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-3">
                      <li className="flex items-start">
                        <CheckCircle className="h-5 w-5 text-green-500 mr-2 mt-0.5" />
                        <div>
                          <span className="font-semibold">Layered clothing</span>
                          <p className="text-sm text-gray-600">Cool morning, warm after sunrise</p>
                        </div>
                      </li>
                      <li className="flex items-start">
                        <CheckCircle className="h-5 w-5 text-green-500 mr-2 mt-0.5" />
                        <div>
                          <span className="font-semibold">Flat, closed shoes</span>
                          <p className="text-sm text-gray-600">For safety during boarding</p>
                        </div>
                      </li>
                      <li className="flex items-start">
                        <CheckCircle className="h-5 w-5 text-green-500 mr-2 mt-0.5" />
                        <div>
                          <span className="font-semibold">Hat and sunglasses</span>
                          <p className="text-sm text-gray-600">Sun protection at altitude</p>
                        </div>
                      </li>
                      <li className="flex items-start">
                        <CheckCircle className="h-5 w-5 text-green-500 mr-2 mt-0.5" />
                        <div>
                          <span className="font-semibold">Comfortable pants</span>
                          <p className="text-sm text-gray-600">Avoid skirts or loose clothing</p>
                        </div>
                      </li>
                    </ul>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Important Guidelines</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-3">
                      <li className="flex items-start">
                        <AlertCircle className="h-5 w-5 text-amber-500 mr-2 mt-0.5" />
                        <div>
                          <span className="font-semibold">No smoking</span>
                          <p className="text-sm text-gray-600">Balloons use open flame</p>
                        </div>
                      </li>
                      <li className="flex items-start">
                        <AlertCircle className="h-5 w-5 text-amber-500 mr-2 mt-0.5" />
                        <div>
                          <span className="font-semibold">Secure loose items</span>
                          <p className="text-sm text-gray-600">Phones, cameras need straps</p>
                        </div>
                      </li>
                      <li className="flex items-start">
                        <AlertCircle className="h-5 w-5 text-amber-500 mr-2 mt-0.5" />
                        <div>
                          <span className="font-semibold">Listen to pilot</span>
                          <p className="text-sm text-gray-600">Follow all safety instructions</p>
                        </div>
                      </li>
                      <li className="flex items-start">
                        <AlertCircle className="h-5 w-5 text-amber-500 mr-2 mt-0.5" />
                        <div>
                          <span className="font-semibold">Health declaration</span>
                          <p className="text-sm text-gray-600">Inform of any conditions</p>
                        </div>
                      </li>
                    </ul>
                  </CardContent>
                </Card>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle>Booking & Logistics</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-3 gap-6">
                    <div>
                      <h4 className="font-semibold mb-2">Booking Timeline</h4>
                      <ul className="space-y-1 text-sm text-gray-600">
                        <li>• Book 2-3 days in advance</li>
                        <li>• Confirmation within 24 hours</li>
                        <li>• Weather check night before</li>
                        <li>• Final confirmation by 10 PM</li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-2">Pickup Locations</h4>
                      <ul className="space-y-1 text-sm text-gray-600">
                        <li>• Sigiriya area hotels</li>
                        <li>• Dambulla hotels</li>
                        <li>• Habarana resorts</li>
                        <li>• Custom pickup available</li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-2">Duration</h4>
                      <ul className="space-y-1 text-sm text-gray-600">
                        <li>• Total experience: 3-4 hours</li>
                        <li>• Hotel pickup: 5:00-5:30 AM</li>
                        <li>• Flight time: 60-90 minutes</li>
                        <li>• Return by: 9:00-10:00 AM</li>
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </section>

      {/* Safety Section */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">Safety First</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {pageContent?.safetyFeatures?.map((item, index) => {
              const IconComponent = iconMap[item.iconName] || Shield;
              return (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="text-center"
                >
                  <IconComponent className="h-16 w-16 text-purple-600 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold mb-2">{item.title}</h3>
                  <p className="text-gray-600">{item.description}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Photo Gallery */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">Balloon Flight Gallery</h2>
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
                  src={getOptimizedImageUrl(image.url, 400)}
                  alt={image.alt}
                  className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-500"
                  loading="lazy"
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
            {pageContent?.faqs?.map((faq, index) => (
              <AccordionItem key={faq.id} value={`item-${index}`}>
                <AccordionTrigger className="text-left hover:text-purple-600">
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
      <section className="py-20 px-4 bg-gradient-to-br from-purple-600 to-indigo-700">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl font-bold mb-6 text-white">
              {pageContent?.cta?.title || 'Ready to Touch the Sky?'}
            </h2>
            <p className="text-xl mb-8 text-white/90">
              {pageContent?.cta?.description || 'Book your hot air balloon adventure over Sigiriya today.'}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                size="lg"
                className="bg-white text-purple-700 hover:bg-gray-100 px-8 py-6 text-lg"
                onClick={() => handleBookingClick()}
              >
                <Cloud className="mr-2 h-5 w-5" />
                {pageContent?.cta?.primaryButtonText || 'Book Your Flight'}
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
              <Mail className="h-8 w-8 mb-3 text-purple-400" />
              <h3 className="font-semibold mb-2">Email Us</h3>
              <p className="text-gray-300">{pageContent?.contact?.email || 'info@rechargetravels.com'}</p>
              <p className="text-sm text-gray-400">{pageContent?.contact?.emailNote || 'Quick response'}</p>
            </div>
            <div className="flex flex-col items-center">
              <Globe className="h-8 w-8 mb-3 text-purple-400" />
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
        itemTitle={selectedPackage || "Hot Air Balloon Flight"}
      />
    </>
  );
};

export default HotAirBalloonSigiriya;
