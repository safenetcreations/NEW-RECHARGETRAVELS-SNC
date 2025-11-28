import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Train,
  Mountain,
  Camera,
  Clock,
  MapPin,
  Calendar,
  Star,
  Users,
  Ticket,
  Map,
  Coffee,
  Eye,
  Sunrise,
  Cloud,
  TreePine,
  ChevronDown,
  CheckCircle,
  Info,
  DollarSign,
  Wifi,
  Package,
  AlertCircle,
  ChevronRight,
  Globe,
  Phone,
  Mail,
  Navigation
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import EnhancedBookingModal from '@/components/EnhancedBookingModal';
import { trainJourneysPageService, TrainJourneysPageContent } from '@/services/trainJourneysPageService';
import { toast } from 'sonner';
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

// Default fallback hero images for train journeys
const defaultHeroImages = [
  { id: '1', url: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957', caption: 'Scenic Train Through Tea Country' },
  { id: '2', url: 'https://images.unsplash.com/photo-1474487548417-781cb71495f3', caption: 'Famous Nine Arch Bridge' },
  { id: '3', url: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4', caption: 'Mountain Railway Views' },
  { id: '4', url: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4', caption: 'Blue Train Journey' }
];

const TrainJourneys = () => {
  const [activeTab, setActiveTab] = useState('routes');
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [selectedPackage, setSelectedPackage] = useState<string | null>(null);
  const [heroImageIndex, setHeroImageIndex] = useState(0);
  const [content, setContent] = useState<TrainJourneysPageContent | null>(null);
  const [loading, setLoading] = useState(true);

  // Icon mapping function
  const getIconComponent = (iconName: string) => {
    const iconMap: Record<string, React.FC<any>> = {
      Train, Mountain, Camera, Clock, MapPin, Calendar, Star, Users,
      Ticket, Map, Coffee, Eye, Sunrise, Cloud, TreePine, Package,
      Navigation, Info, DollarSign, Phone, Mail, Globe
    };
    return iconMap[iconName] || Star;
  };

  // Load content from Firebase with caching
  useEffect(() => {
    const loadContent = async () => {
      try {
        setLoading(true);
        const data = await cachedFetch<TrainJourneysPageContent>(
          'train-journeys-page',
          () => trainJourneysPageService.getPageContent(),
          10 * 60 * 1000 // Cache for 10 minutes
        );
        setContent(data);

        // Preload hero images for faster display
        if (data?.hero?.images?.length) {
          data.hero.images.slice(0, 3).forEach((img, index) => {
            const link = document.createElement('link');
            link.rel = index === 0 ? 'preload' : 'prefetch';
            link.as = 'image';
            link.href = getOptimizedImageUrl(img.url, 1920);
            document.head.appendChild(link);
          });
        }
      } catch (error) {
        console.error('Error loading train journeys content:', error);
        toast.error('Failed to load page content');
      } finally {
        setLoading(false);
      }
    };

    loadContent();
  }, []);

  // Get hero images with fallback
  const heroImages = content?.hero?.images?.length ? content.hero.images : defaultHeroImages;

  // Hero image carousel
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

  if (loading || !content) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600"></div>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>{content.seo.title}</title>
        <meta name="description" content={content.seo.description} />
        <meta name="keywords" content={content.seo.keywords.join(', ')} />
        <meta property="og:title" content={content.seo.title} />
        <meta property="og:description" content={content.seo.description} />
        <meta property="og:image" content={content.seo.ogImage} />
        <link rel="canonical" href="https://www.rechargetravels.com/experiences/train-journeys" />
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
              alt={heroImages[heroImageIndex]?.caption || 'Scenic Train Journey'}
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
                {content.hero.title}
              </h1>
              <p className="text-xl md:text-2xl mb-8 font-light drop-shadow">
                {content.hero.subtitle}
              </p>
              <Button
                onClick={() => handleBookingClick()}
                size="lg"
                className="bg-emerald-600 hover:bg-emerald-700 text-white px-8 py-6 text-lg rounded-full
                         transform hover:scale-105 transition-all duration-300 shadow-xl"
              >
                <Train className="mr-2 h-5 w-5" />
                {content.hero.ctaText}
              </Button>
            </motion.div>
          </div>
        </div>

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
            <h2 className="text-4xl font-bold mb-6">{content.overview.title}</h2>
            <p className="text-xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
              {content.overview.description}
            </p>
          </motion.div>

          {/* Quick Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12">
            {content.stats.map((stat, index) => {
              const IconComponent = getIconComponent(stat.iconName);
              return (
                <motion.div
                  key={stat.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="text-center"
                >
                  <IconComponent className="h-12 w-12 text-emerald-600 mx-auto mb-3" />
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
              <TabsTrigger value="routes">Popular Routes</TabsTrigger>
              <TabsTrigger value="classes">Train Classes</TabsTrigger>
              <TabsTrigger value="packages">Tour Packages</TabsTrigger>
              <TabsTrigger value="tips">Travel Tips</TabsTrigger>
            </TabsList>

            {/* Routes Tab */}
            <TabsContent value="routes" className="space-y-6">
              <h3 className="text-2xl font-bold mb-6">Iconic Railway Routes</h3>
              <div className="grid md:grid-cols-2 gap-6">
                {content.routes.map((route, index) => (
                  <motion.div
                    key={route.id}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Card className="h-full hover:shadow-lg transition-shadow">
                      <CardHeader>
                        <div className="flex justify-between items-start mb-2">
                          <CardTitle className="text-xl">{route.name}</CardTitle>
                          <Badge variant={route.difficulty === 'Easy' ? 'default' : 'secondary'}>
                            {route.difficulty}
                          </Badge>
                        </div>
                        <p className="text-gray-600">{route.description}</p>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div className="flex items-center">
                            <Clock className="h-4 w-4 mr-2 text-gray-500" />
                            <span>{route.duration}</span>
                          </div>
                          <div className="flex items-center">
                            <MapPin className="h-4 w-4 mr-2 text-gray-500" />
                            <span>{route.distance}</span>
                          </div>
                          <div className="flex items-center">
                            <DollarSign className="h-4 w-4 mr-2 text-gray-500" />
                            <span>{route.price}</span>
                          </div>
                          <div className="flex items-center">
                            <Sunrise className="h-4 w-4 mr-2 text-gray-500" />
                            <span>{route.bestTime}</span>
                          </div>
                        </div>
                        <div>
                          <h4 className="font-semibold mb-2">Highlights:</h4>
                          <div className="flex flex-wrap gap-2">
                            {route.highlights.map((highlight, idx) => (
                              <Badge key={idx} variant="outline">
                                {highlight}
                              </Badge>
                            ))}
                          </div>
                        </div>
                        <Button
                          className="w-full"
                          onClick={() => handleBookingClick(`${route.name} Journey`)}
                        >
                          Book This Route
                        </Button>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </TabsContent>

            {/* Train Classes Tab */}
            <TabsContent value="classes" className="space-y-6">
              <h3 className="text-2xl font-bold mb-6">Choose Your Train Class</h3>
              <div className="grid md:grid-cols-2 gap-6">
                {content.trainClasses.map((trainClass, index) => {
                  const IconComponent = getIconComponent(trainClass.iconName);
                  return (
                    <motion.div
                      key={trainClass.id}
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <Card className="h-full hover:shadow-lg transition-shadow">
                        <CardHeader>
                          <div className="flex items-center mb-3">
                            <IconComponent className="h-8 w-8 text-emerald-600 mr-3" />
                            <div>
                              <CardTitle>{trainClass.name}</CardTitle>
                              <p className="text-lg font-semibold text-emerald-600">{trainClass.price}</p>
                            </div>
                          </div>
                          <p className="text-gray-600">{trainClass.description}</p>
                        </CardHeader>
                        <CardContent>
                          <h4 className="font-semibold mb-3">Features:</h4>
                          <ul className="space-y-2">
                            {trainClass.features.map((feature, idx) => (
                              <li key={idx} className="flex items-center">
                                <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                                <span className="text-gray-700">{feature}</span>
                              </li>
                            ))}
                          </ul>
                        </CardContent>
                      </Card>
                    </motion.div>
                  );
                })}
              </div>
            </TabsContent>

            {/* Tour Packages Tab */}
            <TabsContent value="packages" className="space-y-6">
              <h3 className="text-2xl font-bold mb-6">Curated Rail Experiences</h3>
              <div className="grid lg:grid-cols-3 gap-6">
                {content.tourPackages.map((pkg, index) => {
                  const IconComponent = getIconComponent(pkg.iconName);
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
                            <IconComponent className="h-10 w-10 text-emerald-600" />
                            <Badge className="bg-emerald-600">{pkg.duration}</Badge>
                          </div>
                          <CardTitle className="text-xl">{pkg.name}</CardTitle>
                          <p className="text-2xl font-bold text-emerald-600">From {pkg.price}</p>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          <div>
                            <h4 className="font-semibold mb-2">Highlights:</h4>
                            <ul className="space-y-1 text-sm">
                              {pkg.highlights.map((highlight, idx) => (
                                <li key={idx} className="flex items-start">
                                  <ChevronRight className="h-4 w-4 text-emerald-600 mr-1 mt-0.5 flex-shrink-0" />
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
                            className="w-full bg-emerald-600 hover:bg-emerald-700"
                            onClick={() => handleBookingClick(pkg.name)}
                          >
                            Book Package
                          </Button>
                        </CardContent>
                      </Card>
                    </motion.div>
                  );
                })}
              </div>
            </TabsContent>

            {/* Travel Tips Tab */}
            <TabsContent value="tips" className="space-y-6">
              <h3 className="text-2xl font-bold mb-6">Essential Travel Tips</h3>
              <div className="grid md:grid-cols-2 gap-6 mb-8">
                {content.bookingTips.map((tip, index) => {
                  const IconComponent = getIconComponent(tip.iconName);
                  return (
                    <motion.div
                      key={tip.id}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <Card>
                        <CardHeader>
                          <div className="flex items-center">
                            <IconComponent className="h-8 w-8 text-emerald-600 mr-3" />
                            <CardTitle className="text-lg">{tip.title}</CardTitle>
                          </div>
                        </CardHeader>
                        <CardContent>
                          <p className="text-gray-600">{tip.description}</p>
                        </CardContent>
                      </Card>
                    </motion.div>
                  );
                })}
              </div>

              {/* What to Bring */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-xl">What to Bring</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-3 gap-4">
                    <div>
                      <h4 className="font-semibold mb-2">Essentials</h4>
                      <ul className="space-y-1 text-sm text-gray-600">
                        {content.whatToBring.essentials.map((item, idx) => (
                          <li key={idx}>• {item}</li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-2">Comfort Items</h4>
                      <ul className="space-y-1 text-sm text-gray-600">
                        {content.whatToBring.comfortItems.map((item, idx) => (
                          <li key={idx}>• {item}</li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-2">Photography</h4>
                      <ul className="space-y-1 text-sm text-gray-600">
                        {content.whatToBring.photography.map((item, idx) => (
                          <li key={idx}>• {item}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </section>

      {/* Journey Highlights Section */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">Journey Highlights</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {content.journeyHighlights.map((highlight, index) => {
              const IconComponent = getIconComponent(highlight.iconName);
              return (
                <motion.div
                  key={highlight.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="group cursor-pointer"
                >
                  <div className="relative overflow-hidden rounded-lg mb-4">
                    <img
                      src={getOptimizedImageUrl(highlight.image, 400)}
                      alt={highlight.title}
                      className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-500"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                    <IconComponent className="absolute bottom-4 left-4 h-8 w-8 text-white" />
                  </div>
                  <h3 className="font-semibold text-lg mb-2">{highlight.title}</h3>
                  <p className="text-gray-600 text-sm">{highlight.description}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Photo Gallery */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">Journey Through Our Lens</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {content.photoGallery.map((image, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.05 }}
                className="relative overflow-hidden rounded-lg group cursor-pointer"
              >
                <img
                  src={getOptimizedImageUrl(image, 400)}
                  alt={`Train journey ${index + 1}`}
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
            {content.faqs.map((faq, index) => (
              <AccordionItem key={faq.id} value={faq.id}>
                <AccordionTrigger className="text-left hover:text-emerald-600">
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
      <section className="py-20 px-4 bg-gradient-to-br from-emerald-600 to-teal-700">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl font-bold mb-6 text-white">
              {content.cta.title}
            </h2>
            <p className="text-xl mb-8 text-white/90">
              {content.cta.description}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                size="lg"
                className="bg-white text-emerald-700 hover:bg-gray-100 px-8 py-6 text-lg"
                onClick={() => handleBookingClick()}
              >
                <Ticket className="mr-2 h-5 w-5" />
                {content.cta.primaryButtonText}
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-white text-white hover:bg-white/10 px-8 py-6 text-lg"
                onClick={() => window.location.href = `tel:${content.contact.phone.replace(/\s/g, '')}`}
              >
                <Phone className="mr-2 h-5 w-5" />
                {content.cta.secondaryButtonText}
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
              <Phone className="h-8 w-8 mb-3 text-emerald-400" />
              <h3 className="font-semibold mb-2">Call Us</h3>
              <p className="text-gray-300">{content.contact.phone}</p>
              <p className="text-sm text-gray-400">Available 24/7</p>
            </div>
            <div className="flex flex-col items-center">
              <Mail className="h-8 w-8 mb-3 text-emerald-400" />
              <h3 className="font-semibold mb-2">Email Us</h3>
              <p className="text-gray-300">{content.contact.email}</p>
              <p className="text-sm text-gray-400">Quick response</p>
            </div>
            <div className="flex flex-col items-center">
              <Globe className="h-8 w-8 mb-3 text-emerald-400" />
              <h3 className="font-semibold mb-2">Visit Website</h3>
              <p className="text-gray-300">{content.contact.website}</p>
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
        itemTitle={selectedPackage || "Scenic Train Journey"}
      />
    </>
  );
};

export default TrainJourneys;
