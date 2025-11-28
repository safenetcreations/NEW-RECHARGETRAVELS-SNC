import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Helmet } from 'react-helmet-async';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Wind,
  Waves,
  Camera,
  Clock,
  MapPin,
  Calendar,
  Star,
  Users,
  Sun,
  Cloud,
  Activity,
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
  Zap,
  Compass,
  GraduationCap,
  TrendingUp,
  Map,
  Shirt,
  Loader2
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import EnhancedBookingModal from '@/components/EnhancedBookingModal';
import { kalpitiyaKitesurfingPageService, KalpitiyaKitesurfingPageContent } from '@/services/kalpitiyaKitesurfingPageService';
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

// Default fallback hero images for kitesurfing
const defaultHeroImages = [
  { id: '1', url: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19', caption: 'Kitesurfing at Kalpitiya Lagoon' },
  { id: '2', url: 'https://images.unsplash.com/photo-1536180949009-c9cfc6b24dbb', caption: 'Wind Surfing Adventure' },
  { id: '3', url: 'https://images.unsplash.com/photo-1534180477871-5d6cc81f3920', caption: 'Kite Flying Over the Water' },
  { id: '4', url: 'https://images.unsplash.com/photo-1505533321630-975218a5f66f', caption: 'Sunset Kitesurfing Session' }
];

// Icon mapping for dynamic rendering
const iconMap: { [key: string]: React.FC<any> } = {
  Wind, Waves, Camera, Clock, MapPin, Calendar, Star, Users, Sun, Cloud,
  Activity, Navigation, Globe, Phone, Mail, Shield, Award, Zap, Compass,
  GraduationCap, TrendingUp, Map, Shirt, CheckCircle, Info, Package
};

const KalpitiyaKiteSurfing = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [selectedPackage, setSelectedPackage] = useState<string | null>(null);
  const [heroImageIndex, setHeroImageIndex] = useState(0);
  const [pageContent, setPageContent] = useState<KalpitiyaKitesurfingPageContent | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchContent = async () => {
      try {
        // Use cached fetch for faster subsequent loads
        const content = await cachedFetch(
          'kalpitiya-kitesurfing-page',
          () => kalpitiyaKitesurfingPageService.getPageContent(),
          10 * 60 * 1000 // Cache for 10 minutes
        );
        setPageContent(content);

        // Preload first hero image for faster LCP
        if (content?.hero?.images?.[0]?.url) {
          const link = document.createElement('link');
          link.rel = 'preload';
          link.as = 'image';
          link.href = getOptimizedImageUrl(content.hero.images[0].url, 1920);
          document.head.appendChild(link);
        }
      } catch (error) {
        console.error('Error fetching page content:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchContent();
  }, []);

  // Get hero images with fallback
  const heroImages = pageContent?.hero?.images?.length ? pageContent.hero.images : defaultHeroImages;

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

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-12 w-12 animate-spin text-sky-600" />
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>{pageContent?.seo?.title || 'Kite Surfing Kalpitiya | Learn Kiteboarding Sri Lanka | Recharge Travels'}</title>
        <meta name="description" content={pageContent?.seo?.description || 'Experience world-class kitesurfing in Kalpitiya, Sri Lanka. IKO certified lessons, equipment rental, and kite safaris. Perfect wind conditions from May to October.'} />
        <meta name="keywords" content={pageContent?.seo?.keywords?.join(', ') || 'kite surfing Kalpitiya, kiteboarding Sri Lanka, IKO certified, kite lessons, kite safari'} />
        <meta property="og:title" content={pageContent?.seo?.title || 'Kite Surfing Kalpitiya | Recharge Travels'} />
        <meta property="og:description" content={pageContent?.seo?.description || 'Experience world-class kitesurfing in Kalpitiya, Sri Lanka.'} />
        <meta property="og:image" content={pageContent?.seo?.ogImage || 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=1200&h=630&fit=crop'} />
        <meta property="og:url" content="https://www.rechargetravels.com/experiences/kalpitiya-kitesurfing" />
        <meta property="og:type" content="website" />
        <meta name="twitter:card" content="summary_large_image" />
        <link rel="canonical" href="https://www.rechargetravels.com/experiences/kalpitiya-kitesurfing" />

        {/* Structured Data for SEO */}
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "TouristAttraction",
            "name": "Kalpitiya Kitesurfing",
            "description": "World-class kitesurfing destination in Sri Lanka with consistent winds, warm waters, and stunning lagoon conditions. Perfect for beginners and experienced riders.",
            "image": pageContent?.seo?.ogImage || "https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=1200&h=630&fit=crop",
            "address": {
              "@type": "PostalAddress",
              "addressLocality": "Kalpitiya",
              "addressRegion": "North Western Province",
              "addressCountry": "Sri Lanka"
            },
            "geo": {
              "@type": "GeoCoordinates",
              "latitude": "8.2333",
              "longitude": "79.7667"
            },
            "openingHours": "Mo-Su 06:00-18:00",
            "priceRange": "$299 - $899",
            "aggregateRating": {
              "@type": "AggregateRating",
              "ratingValue": "4.9",
              "reviewCount": "5000"
            },
            "amenityFeature": [
              {"@type": "LocationFeatureSpecification", "name": "IKO Certified Instructors", "value": true},
              {"@type": "LocationFeatureSpecification", "name": "Equipment Rental", "value": true},
              {"@type": "LocationFeatureSpecification", "name": "Boat Rescue Support", "value": true}
            ]
          })}
        </script>

        {/* Product Schema for Packages */}
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Product",
            "name": "Kalpitiya Kitesurfing Lessons & Packages",
            "description": "IKO certified kitesurfing lessons in Kalpitiya, Sri Lanka. From beginner courses to advanced wave riding master classes.",
            "image": pageContent?.seo?.ogImage || "https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=1200&h=630&fit=crop",
            "brand": {
              "@type": "Brand",
              "name": "Recharge Travels"
            },
            "offers": {
              "@type": "AggregateOffer",
              "lowPrice": "299",
              "highPrice": "899",
              "priceCurrency": "USD",
              "offerCount": "4",
              "availability": "https://schema.org/InStock"
            },
            "aggregateRating": {
              "@type": "AggregateRating",
              "ratingValue": "4.9",
              "reviewCount": "5000",
              "bestRating": "5"
            }
          })}
        </script>

        {/* FAQ Schema */}
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            "mainEntity": [
              {
                "@type": "Question",
                "name": "Do I need prior experience to learn kitesurfing?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "No prior experience is needed! Our beginner courses start from scratch, teaching you everything from kite control to your first water starts. Basic swimming ability is the only requirement. Most students are riding independently within 3-4 days of lessons."
                }
              },
              {
                "@type": "Question",
                "name": "What is the best time of year for kitesurfing in Kalpitiya?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "The peak season runs from May to October when the southwest monsoon brings consistent 15-25 knot winds. A secondary season from December to March offers lighter northeast winds (12-20 knots), ideal for beginners and freestyle."
                }
              },
              {
                "@type": "Question",
                "name": "What equipment do I need to bring?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "We provide all kitesurfing equipment including kites, boards, harnesses, and safety gear. You should bring swimwear, high SPF sunscreen, sunglasses with a strap, and optionally reef shoes and a rash guard."
                }
              },
              {
                "@type": "Question",
                "name": "Is kitesurfing safe for beginners?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "Yes, when learned properly with qualified instructors. All our instructors are IKO certified with extensive experience. We use modern safety systems, provide thorough briefings, and maintain rescue boat support."
                }
              }
            ]
          })}
        </script>

        {/* Organization Schema */}
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Organization",
            "name": "Recharge Travels",
            "url": "https://www.rechargetravels.com",
            "logo": "https://www.rechargetravels.com/logo-v2.png",
            "contactPoint": {
              "@type": "ContactPoint",
              "telephone": "+94-77-77-21-999",
              "contactType": "customer service",
              "availableLanguage": ["English", "Sinhala", "Tamil"]
            },
            "sameAs": [
              "https://www.facebook.com/rechargetravels",
              "https://www.instagram.com/rechargetravels"
            ]
          })}
        </script>
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
              src={getOptimizedImageUrl(heroImages[heroImageIndex]?.url || '', 1920)}
              alt={heroImages[heroImageIndex]?.caption || 'Kitesurfing'}
              className="w-full h-full object-cover"
              loading={heroImageIndex === 0 ? 'eager' : 'lazy'}
              decoding="async"
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
                {pageContent?.hero?.title || 'Kalpitiya Kitesurfing'}
              </h1>
              <p className="text-xl md:text-2xl mb-8 font-light drop-shadow">
                {pageContent?.hero?.subtitle || "Ride the Wind at Sri Lanka's Premier Kite Destination"}
              </p>
              <Button
                onClick={() => handleBookingClick()}
                size="lg"
                className="bg-sky-600 hover:bg-sky-700 text-white px-8 py-6 text-lg rounded-full
                         transform hover:scale-105 transition-all duration-300 shadow-xl"
              >
                <Wind className="mr-2 h-5 w-5" />
                {pageContent?.hero?.ctaText || 'Start Your Adventure'}
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
            <h2 className="text-4xl font-bold mb-6">{pageContent?.overview?.title || "Sri Lanka's Kitesurfing Paradise"}</h2>
            <p className="text-xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
              {pageContent?.overview?.description || 'Experience world-class kitesurfing in Kalpitiya.'}
            </p>
          </motion.div>

          {/* Quick Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12">
            {pageContent?.stats?.map((stat, index) => {
              const IconComponent = iconMap[stat.iconName] || Wind;
              return (
                <motion.div
                  key={stat.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="text-center"
                >
                  <IconComponent className="h-12 w-12 text-sky-600 mx-auto mb-3" />
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
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="conditions">Wind & Spots</TabsTrigger>
              <TabsTrigger value="courses">Courses</TabsTrigger>
              <TabsTrigger value="prepare">Preparation</TabsTrigger>
            </TabsList>

            {/* Overview Tab */}
            <TabsContent value="overview" className="space-y-6">
              <h3 className="text-2xl font-bold mb-6">Why Choose Kalpitiya?</h3>

              <div className="grid md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Wind className="h-5 w-5 mr-2 text-sky-600" />
                      Perfect Wind Conditions
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600 mb-4">
                      Kalpitiya benefits from two monsoon seasons providing reliable thermal winds.
                      The Kalpitiya lagoon creates a venturi effect, accelerating winds and providing
                      consistent conditions throughout the day.
                    </p>
                    <ul className="space-y-2 text-sm">
                      <li className="flex items-center">
                        <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                        Thermal winds from 11 AM to sunset
                      </li>
                      <li className="flex items-center">
                        <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                        Cross-shore wind direction
                      </li>
                      <li className="flex items-center">
                        <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                        No gusty or offshore winds
                      </li>
                    </ul>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Waves className="h-5 w-5 mr-2 text-sky-600" />
                      Ideal Learning Environment
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600 mb-4">
                      The massive shallow lagoon provides perfect flat-water conditions for beginners
                      and freestylers. Multiple spots cater to all skill levels from first-timers to
                      professional riders.
                    </p>
                    <ul className="space-y-2 text-sm">
                      <li className="flex items-center">
                        <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                        Flat, shallow water lagoon
                      </li>
                      <li className="flex items-center">
                        <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                        No sharks or dangerous marine life
                      </li>
                      <li className="flex items-center">
                        <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                        28°C water temperature
                      </li>
                    </ul>
                  </CardContent>
                </Card>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle>Our Teaching Philosophy</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-3 gap-6">
                    <div>
                      <h4 className="font-semibold mb-2 flex items-center">
                        <Shield className="h-5 w-5 mr-2 text-sky-600" />
                        Safety First
                      </h4>
                      <p className="text-sm text-gray-600">
                        We prioritize safety with modern equipment, thorough briefings, and constant
                        supervision. All instructors are rescue-trained and first-aid certified.
                      </p>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-2 flex items-center">
                        <Users className="h-5 w-5 mr-2 text-sky-600" />
                        Personal Progress
                      </h4>
                      <p className="text-sm text-gray-600">
                        Small group sizes (max 4 students per instructor) ensure personalized attention
                        and faster progress. We adapt to your learning pace.
                      </p>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-2 flex items-center">
                        <Award className="h-5 w-5 mr-2 text-sky-600" />
                        IKO Standards
                      </h4>
                      <p className="text-sm text-gray-600">
                        Following International Kiteboarding Organization standards ensures quality
                        instruction and globally recognized certification.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Conditions Tab */}
            <TabsContent value="conditions" className="space-y-6">
              <h3 className="text-2xl font-bold mb-6">Wind Conditions & Kiting Spots</h3>

              {/* Wind Conditions */}
              <div>
                <h4 className="text-xl font-semibold mb-4">Seasonal Wind Patterns</h4>
                <div className="grid md:grid-cols-2 gap-4">
                  {pageContent?.windConditions?.map((condition) => (
                    <Card key={condition.id}>
                      <CardHeader>
                        <CardTitle className="text-lg">{condition.season}</CardTitle>
                        <p className="text-sm text-gray-600">{condition.months}</p>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span className="text-gray-600">Wind Speed:</span>
                            <span className="font-semibold">{condition.windSpeed}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Direction:</span>
                            <span className="font-semibold">{condition.direction}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Conditions:</span>
                            <span className="font-semibold">{condition.conditions}</span>
                          </div>
                          <Badge className="mt-2" variant="outline">{condition.recommended}</Badge>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>

              {/* Kiting Spots */}
              <div>
                <h4 className="text-xl font-semibold mb-4">Kiting Spots</h4>
                <div className="space-y-4">
                  {pageContent?.kitingSpots?.map((spot, index) => (
                    <motion.div
                      key={spot.id}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <Card>
                        <CardHeader>
                          <div className="flex justify-between items-start">
                            <div>
                              <CardTitle className="text-lg">{spot.name}</CardTitle>
                              <p className="text-sm text-gray-600">{spot.conditions} • {spot.waterDepth}</p>
                            </div>
                            <Badge className="bg-sky-600">{spot.bestFor}</Badge>
                          </div>
                        </CardHeader>
                        <CardContent>
                          <p className="text-gray-600 mb-4">{spot.description}</p>
                          <div className="grid md:grid-cols-2 gap-2">
                            {spot.features?.map((feature, idx) => (
                              <div key={idx} className="flex items-center text-sm">
                                <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                                <span>{feature}</span>
                              </div>
                            ))}
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))}
                </div>
              </div>
            </TabsContent>

            {/* Courses Tab */}
            <TabsContent value="courses" className="space-y-6">
              <h3 className="text-2xl font-bold mb-6">Kitesurfing Courses & Packages</h3>
              <div className="grid md:grid-cols-2 gap-6">
                {pageContent?.kitePackages?.map((pkg, index) => {
                  const IconComponent = iconMap[pkg.iconName] || Wind;
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
                            <IconComponent className="h-10 w-10 text-sky-600" />
                            <div className="text-right">
                              <Badge className="bg-sky-600">{pkg.duration}</Badge>
                              <Badge variant="outline" className="ml-2">{pkg.level}</Badge>
                            </div>
                          </div>
                          <CardTitle className="text-xl">{pkg.name}</CardTitle>
                          <p className="text-2xl font-bold text-sky-600">{pkg.price}</p>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          <div>
                            <h4 className="font-semibold mb-2">Course Highlights:</h4>
                            <ul className="space-y-1 text-sm">
                              {pkg.highlights?.map((highlight, idx) => (
                                <li key={idx} className="flex items-start">
                                  <ChevronRight className="h-4 w-4 text-sky-600 mr-1 mt-0.5 flex-shrink-0" />
                                  <span>{highlight}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                          <div>
                            <h4 className="font-semibold mb-2">Included:</h4>
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
                            className="w-full bg-sky-600 hover:bg-sky-700"
                            onClick={() => handleBookingClick(pkg.name)}
                          >
                            Book This Course
                          </Button>
                        </CardContent>
                      </Card>
                    </motion.div>
                  );
                })}
              </div>
            </TabsContent>

            {/* Preparation Tab */}
            <TabsContent value="prepare" className="space-y-6">
              <h3 className="text-2xl font-bold mb-6">Prepare for Your Kiting Adventure</h3>

              <div className="grid md:grid-cols-3 gap-6">
                {pageContent?.preparation?.map((prep) => {
                  const IconComponent = iconMap[prep.iconName] || CheckCircle;
                  return (
                    <Card key={prep.id}>
                      <CardHeader>
                        <CardTitle className="flex items-center">
                          <IconComponent className="h-5 w-5 mr-2 text-sky-600" />
                          {prep.title}
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <ul className="space-y-2 text-sm">
                          {prep.items?.map((item, idx) => (
                            <li key={idx} className="flex items-center">
                              <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                              {item}
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
                  <CardTitle>Learning Timeline</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="grid md:grid-cols-3 gap-4">
                      <div>
                        <h4 className="font-semibold mb-2">Day 1-2</h4>
                        <ul className="space-y-1 text-sm text-gray-600">
                          <li>• Safety & theory</li>
                          <li>• Kite control on beach</li>
                          <li>• Body dragging</li>
                          <li>• Self-rescue techniques</li>
                        </ul>
                      </div>
                      <div>
                        <h4 className="font-semibold mb-2">Day 3-4</h4>
                        <ul className="space-y-1 text-sm text-gray-600">
                          <li>• Board recovery</li>
                          <li>• Water starts</li>
                          <li>• First rides</li>
                          <li>• Staying upwind</li>
                        </ul>
                      </div>
                      <div>
                        <h4 className="font-semibold mb-2">Day 5+</h4>
                        <ul className="space-y-1 text-sm text-gray-600">
                          <li>• Riding both directions</li>
                          <li>• Speed control</li>
                          <li>• Basic transitions</li>
                          <li>• Independent riding</li>
                        </ul>
                      </div>
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
          <h2 className="text-3xl font-bold text-center mb-12">Kalpitiya Kitesurfing Gallery</h2>
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
                <AccordionTrigger className="text-left hover:text-sky-600">
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
      <section className="py-20 px-4 bg-gradient-to-br from-sky-600 to-blue-700">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl font-bold mb-6 text-white">
              {pageContent?.cta?.title || 'Ready to Ride the Wind?'}
            </h2>
            <p className="text-xl mb-8 text-white/90">
              {pageContent?.cta?.description || 'Join us in Kalpitiya for an unforgettable kitesurfing experience.'}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                size="lg"
                className="bg-white text-sky-700 hover:bg-gray-100 px-8 py-6 text-lg"
                onClick={() => handleBookingClick()}
              >
                <Wind className="mr-2 h-5 w-5" />
                {pageContent?.cta?.primaryButtonText || 'Book Your Course'}
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-white text-white hover:bg-white/10 px-8 py-6 text-lg"
                onClick={() => window.open('https://wa.me/94777721999', '_blank')}
              >
                <Phone className="mr-2 h-5 w-5" />
                {pageContent?.cta?.secondaryButtonText || 'Call for Info'}
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
              <Mail className="h-8 w-8 mb-3 text-sky-400" />
              <h3 className="font-semibold mb-2">Email Us</h3>
              <p className="text-gray-300">{pageContent?.contact?.email || 'info@rechargetravels.com'}</p>
              <p className="text-sm text-gray-400">{pageContent?.contact?.emailNote || 'Quick response'}</p>
            </div>
            <div className="flex flex-col items-center">
              <Globe className="h-8 w-8 mb-3 text-sky-400" />
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
        itemTitle={selectedPackage || "Kitesurfing Course"}
      />
    </>
  );
};

export default KalpitiyaKiteSurfing;
