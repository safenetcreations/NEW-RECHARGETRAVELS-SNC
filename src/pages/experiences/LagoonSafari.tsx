import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Anchor,
  Bird,
  Camera,
  Clock,
  MapPin,
  Calendar,
  Star,
  Users,
  Sunrise,
  Waves,
  TreePine,
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
  Binoculars,
  Droplets,
  Leaf,
  Loader2
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import EnhancedBookingModal from '@/components/EnhancedBookingModal';
import { lagoonSafariPageService, LagoonSafariPageContent } from '@/services/lagoonSafariPageService';
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
  { id: '1', url: 'https://images.unsplash.com/photo-1544551763-77932436c73d', caption: 'Lagoon Safari Adventure' },
  { id: '2', url: 'https://images.unsplash.com/photo-1596178065887-1198b6148b2b', caption: 'Mangrove Exploration' },
  { id: '3', url: 'https://images.unsplash.com/photo-1544551763-92ab472cad5d', caption: 'Bird Watching Paradise' },
  { id: '4', url: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e', caption: 'Bentota Lagoon' }
];

// Icon mapping for dynamic content
const iconMap: Record<string, React.FC<any>> = {
  Anchor, Bird, Camera, Clock, MapPin, Calendar, Star, Users, Sunrise, Waves,
  TreePine, Fish, Binoculars, Droplets, Leaf, Globe, Phone, Mail
};

const LagoonSafari = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [selectedPackage, setSelectedPackage] = useState<string | null>(null);
  const [heroImageIndex, setHeroImageIndex] = useState(0);
  const [pageContent, setPageContent] = useState<LagoonSafariPageContent | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Load content from Firebase with caching
  useEffect(() => {
    const loadContent = async () => {
      try {
        const content = await cachedFetch<LagoonSafariPageContent>(
          'lagoon-safari-page',
          () => lagoonSafariPageService.getPageContent(),
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
        setPageContent(lagoonSafariPageService.getDefaultContent());
      } finally {
        setIsLoading(false);
      }
    };
    loadContent();
  }, []);

  // Get data from pageContent or use defaults
  const heroImages = pageContent?.hero?.images?.length ? pageContent.hero.images : defaultHeroImages;
  const safariPackages = pageContent?.safariPackages || [];
  const wildlifeSpottings = pageContent?.wildlifeSpottings || [];
  const lagoonZones = pageContent?.lagoonZones || [];
  const faqs = pageContent?.faqs || [];
  const stats = pageContent?.stats || [];
  const gallery = pageContent?.gallery || [];

  // Hero image rotation
  useEffect(() => {
    if (heroImages.length === 0) return;
    const interval = setInterval(() => {
      setHeroImageIndex((prev) => (prev + 1) % heroImages.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [heroImages.length]);

  const handleBookingClick = (packageName?: string) => {
    setSelectedPackage(packageName || null);
    setIsBookingModalOpen(true);
  };

  // Loading state
  if (isLoading) {
    return (
      <>
        <Header />
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <Loader2 className="h-12 w-12 animate-spin text-teal-600 mx-auto mb-4" />
            <p className="text-gray-600">Loading experience...</p>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Helmet>
        <title>{pageContent?.seo.title || 'Bentota Lagoon Safari | Recharge Travels'}</title>
        <meta name="description" content={pageContent?.seo.description || 'Explore Bentota\'s rich lagoon ecosystem by traditional canoe.'} />
        <meta name="keywords" content={pageContent?.seo.keywords?.join(', ') || 'Bentota lagoon safari, mangrove boat tour'} />
        <meta property="og:title" content={pageContent?.hero.title || 'Lagoon Canoe Safari'} />
        <meta property="og:description" content={pageContent?.seo.description || ''} />
        <meta property="og:image" content={pageContent?.seo.ogImage || ''} />
        <link rel="canonical" href="https://www.rechargetravels.com/experiences/lagoon-safari" />
      </Helmet>

      <Header />

      {/* Hero Section */}
      <section className="relative h-[70vh] min-h-[600px] w-full overflow-hidden">
        <AnimatePresence mode="wait">
          {heroImages[heroImageIndex] && (
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
          )}
        </AnimatePresence>

        <div className="absolute inset-0 flex items-center justify-center z-10">
          <div className="text-center text-white px-4 max-w-5xl">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <h1 className="text-5xl md:text-7xl font-bold mb-6 drop-shadow-lg">
                {pageContent?.hero.title || 'Lagoon Canoe Safari'}
              </h1>
              <p className="text-xl md:text-2xl mb-8 font-light drop-shadow">
                {pageContent?.hero.subtitle || "Navigate Bentota's Enchanting Mangrove Waterways"}
              </p>
              <Button
                onClick={() => handleBookingClick()}
                size="lg"
                className="bg-teal-600 hover:bg-teal-700 text-white px-8 py-6 text-lg rounded-full
                         transform hover:scale-105 transition-all duration-300 shadow-xl"
              >
                <Anchor className="mr-2 h-5 w-5" />
                {pageContent?.hero.ctaText || 'Book Safari Tour'}
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
            <h2 className="text-4xl font-bold mb-6">{pageContent?.overview.title || "Discover Bentota's Hidden Ecosystem"}</h2>
            <p className="text-xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
              {pageContent?.overview.description || "Embark on a tranquil journey through the Bentota Lagoon..."}
            </p>
          </motion.div>

          {/* Quick Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12">
            {stats.map((stat, index) => {
              const IconComponent = iconMap[stat.iconName] || Droplets;
              return (
                <motion.div
                  key={stat.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="text-center"
                >
                  <IconComponent className="h-12 w-12 text-teal-600 mx-auto mb-3" />
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
              <TabsTrigger value="wildlife">Wildlife</TabsTrigger>
              <TabsTrigger value="packages">Safari Options</TabsTrigger>
              <TabsTrigger value="prepare">Preparation</TabsTrigger>
            </TabsList>

            {/* Overview Tab */}
            <TabsContent value="overview" className="space-y-6">
              <h3 className="text-2xl font-bold mb-6">The Lagoon Safari Experience</h3>

              <div className="grid md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Waves className="h-5 w-5 mr-2 text-teal-600" />
                      Journey Through Water
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600 mb-4">
                      Your adventure begins as you board a traditional outrigger canoe or boat,
                      designed to navigate the shallow waters silently. The journey takes you through
                      various ecosystems within the lagoon.
                    </p>
                    <ul className="space-y-2 text-sm">
                      <li className="flex items-center">
                        <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                        Silent approach for wildlife
                      </li>
                      <li className="flex items-center">
                        <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                        Navigate narrow channels
                      </li>
                      <li className="flex items-center">
                        <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                        Access remote areas
                      </li>
                      <li className="flex items-center">
                        <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                        Stable platform for photos
                      </li>
                    </ul>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Leaf className="h-5 w-5 mr-2 text-teal-600" />
                      Mangrove Mysteries
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600 mb-4">
                      The mangrove forests are the heart of the lagoon ecosystem. These unique trees
                      thrive in brackish water and create a complex habitat supporting diverse wildlife.
                    </p>
                    <ul className="space-y-2 text-sm">
                      <li className="flex items-center">
                        <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                        Natural water filtration
                      </li>
                      <li className="flex items-center">
                        <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                        Nursery for fish species
                      </li>
                      <li className="flex items-center">
                        <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                        Bird nesting sites
                      </li>
                      <li className="flex items-center">
                        <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                        Erosion protection
                      </li>
                    </ul>
                  </CardContent>
                </Card>
              </div>

              <div>
                <h4 className="text-xl font-semibold mb-4">Lagoon Zones</h4>
                <div className="grid md:grid-cols-2 gap-4">
                  {lagoonZones.map((zone) => (
                    <Card key={zone.id}>
                      <CardHeader>
                        <CardTitle className="text-lg">{zone.zone}</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-3">
                          <div>
                            <h5 className="font-semibold text-sm mb-1">Features:</h5>
                            <div className="flex flex-wrap gap-2">
                              {zone.features.map((feature, idx) => (
                                <Badge key={idx} variant="outline" className="text-xs">
                                  {feature}
                                </Badge>
                              ))}
                            </div>
                          </div>
                          <div>
                            <h5 className="font-semibold text-sm mb-1">Wildlife:</h5>
                            <div className="flex flex-wrap gap-2">
                              {zone.wildlife.map((animal, idx) => (
                                <Badge key={idx} className="bg-teal-100 text-teal-700 text-xs">
                                  {animal}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            </TabsContent>

            {/* Wildlife Tab */}
            <TabsContent value="wildlife" className="space-y-6">
              <h3 className="text-2xl font-bold mb-6">Lagoon Wildlife Guide</h3>

              <Card className="mb-6">
                <CardHeader>
                  <CardTitle>About the Ecosystem</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600">
                    The Bentota Lagoon is a brackish water ecosystem where freshwater from the river
                    mixes with seawater. This unique environment supports a remarkable diversity of
                    wildlife, from tiny mudskippers to large water monitors and crocodiles. The mangroves
                    provide shelter and breeding grounds for numerous species.
                  </p>
                </CardContent>
              </Card>

              <div className="grid gap-4">
                {wildlifeSpottings.map((wildlife, index) => (
                  <motion.div
                    key={wildlife.id}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Card>
                      <CardHeader>
                        <div className="flex justify-between items-start">
                          <div>
                            <CardTitle className="text-lg">{wildlife.species}</CardTitle>
                            <p className="text-sm text-gray-500">{wildlife.type}</p>
                          </div>
                          <Badge className={wildlife.frequency === "Very Common" ? "bg-green-600" :
                                          wildlife.frequency === "Common" ? "bg-teal-600" :
                                          wildlife.frequency === "Regular" ? "bg-blue-600" :
                                          wildlife.frequency === "Occasional" ? "bg-yellow-600" : "bg-gray-600"}>
                            {wildlife.frequency}
                          </Badge>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-gray-600 mb-2">{wildlife.description}</p>
                        <div className="flex items-center text-sm">
                          <MapPin className="h-4 w-4 mr-2 text-teal-600" />
                          <span className="font-medium">Best viewing:</span>
                          <span className="ml-2">{wildlife.bestSpot}</span>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </TabsContent>

            {/* Packages Tab */}
            <TabsContent value="packages" className="space-y-6">
              <h3 className="text-2xl font-bold mb-6">Choose Your Safari Adventure</h3>
              <div className="grid md:grid-cols-2 gap-6">
                {safariPackages.map((pkg, index) => {
                  const PackageIcon = iconMap[pkg.iconName] || Anchor;
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
                            <PackageIcon className="h-10 w-10 text-teal-600" />
                            <div className="text-right">
                              <Badge className="bg-teal-600">{pkg.duration}</Badge>
                              {pkg.level && <Badge variant="outline" className="ml-2">{pkg.level}</Badge>}
                            </div>
                          </div>
                          <CardTitle className="text-xl">{pkg.name}</CardTitle>
                          <p className="text-2xl font-bold text-teal-600">{pkg.price}</p>
                          <p className="text-sm text-gray-500">Best time: {pkg.bestTime}</p>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          <div>
                            <h4 className="font-semibold mb-2">Safari Highlights:</h4>
                            <ul className="space-y-1 text-sm">
                              {pkg.highlights.map((highlight, idx) => (
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
                              {pkg.included.map((item, idx) => (
                                <li key={idx} className="flex items-center">
                                  <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                                  <span>{item}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                          <Button
                            className="w-full bg-teal-600 hover:bg-teal-700"
                            onClick={() => handleBookingClick(pkg.name)}
                          >
                            Book This Safari
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
              <h3 className="text-2xl font-bold mb-6">Prepare for Your Safari</h3>

              <div className="grid md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>What to Bring</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div>
                        <h4 className="font-semibold mb-2">Essentials</h4>
                        <ul className="space-y-2 text-sm">
                          <li className="flex items-center">
                            <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                            Sunscreen and hat
                          </li>
                          <li className="flex items-center">
                            <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                            Insect repellent
                          </li>
                          <li className="flex items-center">
                            <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                            Camera with zoom
                          </li>
                          <li className="flex items-center">
                            <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                            Light rain jacket
                          </li>
                          <li className="flex items-center">
                            <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                            Water bottle
                          </li>
                        </ul>
                      </div>
                      <div>
                        <h4 className="font-semibold mb-2">Recommended</h4>
                        <ul className="space-y-2 text-sm">
                          <li className="flex items-center">
                            <Info className="h-4 w-4 text-blue-500 mr-2" />
                            Binoculars (if you have)
                          </li>
                          <li className="flex items-center">
                            <Info className="h-4 w-4 text-blue-500 mr-2" />
                            Bird identification book
                          </li>
                          <li className="flex items-center">
                            <Info className="h-4 w-4 text-blue-500 mr-2" />
                            Dry bag for electronics
                          </li>
                        </ul>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>What to Wear</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-3">
                      <li className="flex items-start">
                        <CheckCircle className="h-5 w-5 text-green-500 mr-2 mt-0.5" />
                        <div>
                          <span className="font-semibold">Light, neutral colors</span>
                          <p className="text-sm text-gray-600">Avoid bright colors that may disturb wildlife</p>
                        </div>
                      </li>
                      <li className="flex items-start">
                        <CheckCircle className="h-5 w-5 text-green-500 mr-2 mt-0.5" />
                        <div>
                          <span className="font-semibold">Long sleeves/pants optional</span>
                          <p className="text-sm text-gray-600">For sun and insect protection</p>
                        </div>
                      </li>
                      <li className="flex items-start">
                        <CheckCircle className="h-5 w-5 text-green-500 mr-2 mt-0.5" />
                        <div>
                          <span className="font-semibold">Comfortable footwear</span>
                          <p className="text-sm text-gray-600">Sandals or shoes that can get wet</p>
                        </div>
                      </li>
                      <li className="flex items-start">
                        <CheckCircle className="h-5 w-5 text-green-500 mr-2 mt-0.5" />
                        <div>
                          <span className="font-semibold">Sunglasses</span>
                          <p className="text-sm text-gray-600">Polarized recommended for water glare</p>
                        </div>
                      </li>
                    </ul>
                  </CardContent>
                </Card>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle>Safari Guidelines</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-semibold mb-3 text-green-600">Do's</h4>
                      <ul className="space-y-2 text-sm">
                        <li className="flex items-start">
                          <CheckCircle className="h-4 w-4 text-green-500 mr-2 mt-0.5" />
                          <span>Remain seated in the boat</span>
                        </li>
                        <li className="flex items-start">
                          <CheckCircle className="h-4 w-4 text-green-500 mr-2 mt-0.5" />
                          <span>Keep voices low near wildlife</span>
                        </li>
                        <li className="flex items-start">
                          <CheckCircle className="h-4 w-4 text-green-500 mr-2 mt-0.5" />
                          <span>Follow guide's instructions</span>
                        </li>
                        <li className="flex items-start">
                          <CheckCircle className="h-4 w-4 text-green-500 mr-2 mt-0.5" />
                          <span>Take all litter back</span>
                        </li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-3 text-red-600">Don'ts</h4>
                      <ul className="space-y-2 text-sm">
                        <li className="flex items-start">
                          <AlertCircle className="h-4 w-4 text-red-500 mr-2 mt-0.5" />
                          <span>Don't feed any wildlife</span>
                        </li>
                        <li className="flex items-start">
                          <AlertCircle className="h-4 w-4 text-red-500 mr-2 mt-0.5" />
                          <span>Don't touch mangroves</span>
                        </li>
                        <li className="flex items-start">
                          <AlertCircle className="h-4 w-4 text-red-500 mr-2 mt-0.5" />
                          <span>Don't use flash photography</span>
                        </li>
                        <li className="flex items-start">
                          <AlertCircle className="h-4 w-4 text-red-500 mr-2 mt-0.5" />
                          <span>Don't make sudden movements</span>
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
          <h2 className="text-3xl font-bold text-center mb-12">Lagoon Safari Gallery</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {gallery.map((image, index) => (
              <motion.div
                key={image.id || index}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.05 }}
                className="relative overflow-hidden rounded-lg group cursor-pointer"
              >
                <img
                  src={image.url}
                  alt={image.alt || `Lagoon safari ${index + 1}`}
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
            {faqs.map((faq) => (
              <AccordionItem key={faq.id} value={`item-${faq.id}`}>
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
              {pageContent?.cta?.title || 'Ready to Explore the Lagoon?'}
            </h2>
            <p className="text-xl mb-8 text-white/90">
              {pageContent?.cta?.description || "Embark on a peaceful journey through Bentota's magical waterways."}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                size="lg"
                className="bg-white text-teal-700 hover:bg-gray-100 px-8 py-6 text-lg"
                onClick={() => handleBookingClick()}
              >
                <Anchor className="mr-2 h-5 w-5" />
                {pageContent?.cta?.primaryButtonText || 'Book Safari Tour'}
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
            <div className="flex flex-col items-center">
              <Phone className="h-8 w-8 mb-3 text-teal-400" />
              <h3 className="font-semibold mb-2">Call Us</h3>
              <p className="text-gray-300">{pageContent?.contact?.phone || '+94 77 772 1999'}</p>
              <p className="text-sm text-gray-400">{pageContent?.contact?.phoneNote || 'Available 24/7'}</p>
            </div>
            <div className="flex flex-col items-center">
              <Mail className="h-8 w-8 mb-3 text-teal-400" />
              <h3 className="font-semibold mb-2">Email Us</h3>
              <p className="text-gray-300">{pageContent?.contact?.email || 'info@rechargetravels.com'}</p>
              <p className="text-sm text-gray-400">{pageContent?.contact?.emailNote || 'Quick response'}</p>
            </div>
            <div className="flex flex-col items-center">
              <Globe className="h-8 w-8 mb-3 text-teal-400" />
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
        itemTitle={selectedPackage || "Lagoon Safari Tour"}
      />
    </>
  );
};

export default LagoonSafari;
