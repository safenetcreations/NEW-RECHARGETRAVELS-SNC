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
  TrendingUp,
  Loader2
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import EnhancedBookingModal from '@/components/EnhancedBookingModal';
import { seaCucumberPageService, SeaCucumberPageContent } from '@/services/seaCucumberPageService';
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
  { id: '1', url: 'https://images.unsplash.com/photo-1583212292454-1fe6229603b7', caption: 'Sea Cucumber Farm' },
  { id: '2', url: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5', caption: 'Coastal Waters' },
  { id: '3', url: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e', caption: 'Marine Life' },
  { id: '4', url: 'https://images.unsplash.com/photo-1559825481-12a05cc00344', caption: 'Ocean Experience' }
];

// Icon mapping for dynamic content
const iconMap: Record<string, React.FC<any>> = {
  Shell, Fish, TrendingUp, Users, Microscope, Waves, Camera, Clock, MapPin
};

const SeaCucumberFarming = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [selectedPackage, setSelectedPackage] = useState<string | null>(null);
  const [heroImageIndex, setHeroImageIndex] = useState(0);
  const [pageContent, setPageContent] = useState<SeaCucumberPageContent | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Load content from Firebase with caching
  useEffect(() => {
    const loadContent = async () => {
      try {
        const content = await cachedFetch<SeaCucumberPageContent>(
          'sea-cucumber-farming-page',
          () => seaCucumberPageService.getPageContent(),
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
        // Use default content on error
        setPageContent(seaCucumberPageService.getDefaultContent());
      } finally {
        setIsLoading(false);
      }
    };
    loadContent();
  }, []);

  // Get data from pageContent or use defaults
  const heroImages = pageContent?.hero?.images?.length ? pageContent.hero.images : defaultHeroImages;
  const farmLocations = pageContent?.farmLocations || [];
  const tourPackages = pageContent?.tourPackages || [];
  const seaCucumberFacts = pageContent?.facts || [];
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
        <title>{pageContent?.seo.title || 'Sea Cucumber Farm Tours Sri Lanka | Recharge Travels'}</title>
        <meta name="description" content={pageContent?.seo.description || 'Visit sustainable sea cucumber farms in Sri Lanka.'} />
        <meta name="keywords" content={pageContent?.seo.keywords?.join(', ') || 'sea cucumber farming Sri Lanka'} />
        <meta property="og:title" content={pageContent?.hero.title || 'Sea Cucumber Farm Tours'} />
        <meta property="og:description" content={pageContent?.seo.description || ''} />
        <meta property="og:image" content={pageContent?.seo.ogImage || ''} />
        <link rel="canonical" href="https://www.rechargetravels.com/experiences/sea-cucumber-farming" />
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
                {pageContent?.hero.title || 'Sea Cucumber Farm Tours'}
              </h1>
              <p className="text-xl md:text-2xl mb-8 font-light drop-shadow">
                {pageContent?.hero.subtitle || 'Discover Sustainable Marine Aquaculture in Sri Lanka'}
              </p>
              <Button
                onClick={() => handleBookingClick()}
                size="lg"
                className="bg-teal-600 hover:bg-teal-700 text-white px-8 py-6 text-lg rounded-full
                         transform hover:scale-105 transition-all duration-300 shadow-xl"
              >
                <Shell className="mr-2 h-5 w-5" />
                {pageContent?.hero.ctaText || 'Book Farm Tour'}
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
            <h2 className="text-4xl font-bold mb-6">{pageContent?.overview.title || 'Explore the World of Sea Cucumber Farming'}</h2>
            <p className="text-xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
              {pageContent?.overview.description || 'Discover the fascinating world of sea cucumber aquaculture in Sri Lanka.'}
            </p>
          </motion.div>

          {/* Quick Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12">
            {stats.map((stat, index) => {
              const IconComponent = iconMap[stat.iconName] || Shell;
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
                {tourPackages.map((tour, index) => {
                  const TourIcon = iconMap[tour.iconName] || Shell;
                  return (
                    <motion.div
                      key={tour.id}
                      initial={{ opacity: 0, scale: 0.95 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      viewport={{ once: true }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <Card className="h-full hover:shadow-xl transition-shadow">
                        <CardHeader>
                          <div className="flex items-center justify-between mb-3">
                            <TourIcon className="h-10 w-10 text-teal-600" />
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
                  );
                })}
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
                  alt={image.alt || `Sea cucumber farming ${index + 1}`}
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
              {pageContent?.cta?.title || 'Ready to Explore Marine Aquaculture?'}
            </h2>
            <p className="text-xl mb-8 text-white/90">
              {pageContent?.cta?.description || 'Join us for an educational journey into sustainable sea cucumber farming. Perfect for students, researchers, and eco-conscious travelers.'}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                size="lg"
                className="bg-white text-teal-700 hover:bg-gray-100 px-8 py-6 text-lg"
                onClick={() => handleBookingClick()}
              >
                <Shell className="mr-2 h-5 w-5" />
                {pageContent?.cta?.primaryButtonText || 'Book Farm Tour'}
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-white text-white hover:bg-white/10 px-8 py-6 text-lg"
                onClick={() => window.location.href = `tel:${pageContent?.contact?.phone || '+94765059595'}`}
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
            <div className="flex flex-col items-center">
              <Phone className="h-8 w-8 mb-3 text-teal-400" />
              <h3 className="font-semibold mb-2">Call Us</h3>
              <p className="text-gray-300">{pageContent?.contact?.phone || '+94 76 505 9595'}</p>
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
        itemTitle={selectedPackage || "Sea Cucumber Farm Tour"}
      />
    </>
  );
};

export default SeaCucumberFarming;