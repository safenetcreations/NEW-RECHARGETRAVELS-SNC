import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { useNavigate } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Waves,
  Fish,
  Camera,
  Clock,
  MapPin,
  Calendar,
  Star,
  Users,
  Anchor,
  Sun,
  Wind,
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
  Binoculars,
  Navigation,
  Eye
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { whaleWatchingPageService, WhaleWatchingPageContent } from '@/services/whaleWatchingPageService';
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

// Default fallback hero images for whale watching
const defaultHeroImages = [
  { id: '1', url: 'https://images.unsplash.com/photo-1570913149827-d2ac84ab3f9a', caption: 'Blue Whale in Sri Lankan Waters' },
  { id: '2', url: 'https://images.unsplash.com/photo-1511259474226-3c0a03c2b1a8', caption: 'Whale Tail Breaching' },
  { id: '3', url: 'https://images.unsplash.com/photo-1568430462989-44163eb1752f', caption: 'Dolphins Swimming' },
  { id: '4', url: 'https://images.unsplash.com/photo-1454372182658-c712e4c5a1db', caption: 'Whale Watching Boat Tour' }
];

const WhaleWatching = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('locations');
  const [heroImageIndex, setHeroImageIndex] = useState(0);
  const [content, setContent] = useState<WhaleWatchingPageContent | null>(null);
  const [loading, setLoading] = useState(true);

  // Icon mapping function
  const getIconComponent = (iconName: string) => {
    const iconMap: Record<string, React.FC<any>> = {
      Waves, Fish, Camera, Clock, MapPin, Calendar, Star, Users,
      Anchor, Sun, Wind, Ship, Binoculars, Navigation, Eye,
      CheckCircle, AlertCircle, ChevronRight, Globe, Phone, Mail,
      Info, DollarSign, Package, ChevronDown
    };
    return iconMap[iconName] || Star;
  };

  // Load content from Firebase with caching
  useEffect(() => {
    const loadContent = async () => {
      try {
        setLoading(true);
        const data = await cachedFetch(
          'whale-watching-page',
          () => whaleWatchingPageService.getPageContent(),
          10 * 60 * 1000 // Cache for 10 minutes
        );
        setContent(data);

        // Preload first hero image
        if (data?.hero?.images?.[0]?.url) {
          const link = document.createElement('link');
          link.rel = 'preload';
          link.as = 'image';
          link.href = getOptimizedImageUrl(data.hero.images[0].url, 1920);
          document.head.appendChild(link);
        }
      } catch (error) {
        console.error('Error loading whale watching content:', error);
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
    navigate('/booking/whale-watching');
  };

  if (loading || !content) {
    return (
      <>
        <Header />
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading whale watching experiences...</p>
          </div>
        </div>
        <Footer />
      </>
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
        <link rel="canonical" href="https://www.rechargetravels.com/experiences/whale-watching" />
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
              alt={heroImages[heroImageIndex]?.caption || 'Whale Watching'}
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
                className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-6 text-lg rounded-full
                         transform hover:scale-105 transition-all duration-300 shadow-xl"
              >
                <Waves className="mr-2 h-5 w-5" />
                {content.hero.ctaText}
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
                  <IconComponent className="h-12 w-12 text-blue-600 mx-auto mb-3" />
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
              <TabsTrigger value="locations">Top Locations</TabsTrigger>
              <TabsTrigger value="species">Marine Species</TabsTrigger>
              <TabsTrigger value="tours">Tour Options</TabsTrigger>
              <TabsTrigger value="guidelines">Guidelines</TabsTrigger>
            </TabsList>

            {/* Locations Tab */}
            <TabsContent value="locations" className="space-y-6">
              <h3 className="text-2xl font-bold mb-6">Premier Whale Watching Destinations</h3>
              <div className="grid gap-6">
                {content.locations.map((location, index) => (
                  <motion.div
                    key={location.id}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Card className="hover:shadow-lg transition-shadow">
                      <CardHeader>
                        <div className="flex justify-between items-start">
                          <div>
                            <CardTitle className="text-xl mb-2">{location.name}</CardTitle>
                            <p className="text-gray-600">{location.description}</p>
                          </div>
                          <Badge className="bg-blue-600">Success: {location.successRate}</Badge>
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="grid md:grid-cols-2 gap-4">
                          <div>
                            <h4 className="font-semibold mb-2 flex items-center">
                              <Fish className="h-4 w-4 mr-2" />
                              Marine Species
                            </h4>
                            <div className="flex flex-wrap gap-2">
                              {location.species.map((species, idx) => (
                                <Badge key={idx} variant="secondary">
                                  {species}
                                </Badge>
                              ))}
                            </div>
                          </div>
                          <div>
                            <h4 className="font-semibold mb-2 flex items-center">
                              <Eye className="h-4 w-4 mr-2" />
                              Other Wildlife
                            </h4>
                            <div className="flex flex-wrap gap-2">
                              {location.otherWildlife.map((wildlife, idx) => (
                                <Badge key={idx} variant="outline">
                                  {wildlife}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                          <div>
                            <span className="text-gray-500">Best Season</span>
                            <p className="font-semibold">{location.bestMonths}</p>
                          </div>
                          <div>
                            <span className="text-gray-500">Distance</span>
                            <p className="font-semibold">{location.distance}</p>
                          </div>
                          <div>
                            <span className="text-gray-500">Tour Duration</span>
                            <p className="font-semibold">{location.tourDuration}</p>
                          </div>
                          <div>
                            <Button
                              size="sm"
                              className="mt-2"
                              onClick={() => handleBookingClick(`${location.name} Whale Tour`)}
                            >
                              Book Tour
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </TabsContent>

            {/* Species Tab */}
            <TabsContent value="species" className="space-y-6">
              <h3 className="text-2xl font-bold mb-6">Marine Giants You'll Encounter</h3>
              <div className="grid md:grid-cols-2 gap-6">
                {content.species.map((species, index) => (
                  <motion.div
                    key={species.id}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Card className="h-full hover:shadow-lg transition-shadow">
                      <CardHeader>
                        <CardTitle className="text-xl">{species.name}</CardTitle>
                        <p className="text-sm text-gray-500 italic">{species.scientificName}</p>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div>
                            <span className="text-gray-500">Size:</span>
                            <p className="font-semibold">{species.size}</p>
                          </div>
                          <div>
                            <span className="text-gray-500">Weight:</span>
                            <p className="font-semibold">{species.weight}</p>
                          </div>
                        </div>
                        <div>
                          <span className="text-gray-500 text-sm">Characteristics:</span>
                          <p className="text-sm mt-1">{species.characteristics}</p>
                        </div>
                        <div>
                          <span className="text-gray-500 text-sm">Best Viewing Locations:</span>
                          <p className="text-sm font-semibold mt-1">{species.bestSpots}</p>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </TabsContent>

            {/* Tours Tab */}
            <TabsContent value="tours" className="space-y-6">
              <h3 className="text-2xl font-bold mb-6">Choose Your Whale Watching Experience</h3>
              <div className="grid md:grid-cols-2 gap-6">
                {content.tours.map((tour, index) => {
                  const TourIcon = getIconComponent(tour.iconName);
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
                            <TourIcon className="h-10 w-10 text-blue-600" />
                            <div className="text-right">
                              <Badge className="bg-blue-600">{tour.duration}</Badge>
                              <p className="text-sm text-gray-500 mt-1">Departs: {tour.departures}</p>
                            </div>
                          </div>
                          <CardTitle className="text-xl">{tour.name}</CardTitle>
                          <p className="text-2xl font-bold text-blue-600">{tour.price}</p>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          <div>
                            <h4 className="font-semibold mb-2">Tour Highlights:</h4>
                            <ul className="space-y-1 text-sm">
                              {tour.highlights.map((highlight, idx) => (
                                <li key={idx} className="flex items-start">
                                  <ChevronRight className="h-4 w-4 text-blue-600 mr-1 mt-0.5 flex-shrink-0" />
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
                            className="w-full bg-blue-600 hover:bg-blue-700"
                            onClick={() => handleBookingClick(tour.name)}
                          >
                            Book This Tour
                          </Button>
                        </CardContent>
                      </Card>
                    </motion.div>
                  );
                })}
              </div>
            </TabsContent>

            {/* Guidelines Tab */}
            <TabsContent value="guidelines" className="space-y-6">
              <h3 className="text-2xl font-bold mb-6">Responsible Whale Watching Guidelines</h3>
              <div className="grid md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <CheckCircle className="h-6 w-6 text-green-500 mr-2" />
                      Best Practices
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-3">
                      {content.guidelines.bestPractices.map((guideline) => (
                        <li key={guideline.id} className="flex items-start">
                          <CheckCircle className="h-5 w-5 text-green-500 mr-2 mt-0.5" />
                          <span className="text-sm">{guideline.text}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <AlertCircle className="h-6 w-6 text-red-500 mr-2" />
                      Things to Avoid
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-3">
                      {content.guidelines.thingsToAvoid.map((guideline) => (
                        <li key={guideline.id} className="flex items-start">
                          <AlertCircle className="h-5 w-5 text-red-500 mr-2 mt-0.5" />
                          <span className="text-sm">{guideline.text}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle>Preparation Tips</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-3 gap-6">
                    {content.preparationTips.map((tip) => {
                      const TipIcon = getIconComponent(tip.iconName);
                      return (
                        <div key={tip.id}>
                          <h4 className="font-semibold mb-2 flex items-center">
                            <TipIcon className="h-5 w-5 mr-2" />
                            {tip.category}
                          </h4>
                          <ul className="space-y-1 text-sm text-gray-600">
                            {tip.items.map((item, idx) => (
                              <li key={idx}>• {item}</li>
                            ))}
                          </ul>
                        </div>
                      );
                    })}
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
          <h2 className="text-3xl font-bold text-center mb-12">Whale Watching Gallery</h2>
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
                  src={image}
                  alt={`Whale watching ${index + 1}`}
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
            {content.faqs.map((faq) => (
              <AccordionItem key={faq.id} value={faq.id}>
                <AccordionTrigger className="text-left hover:text-blue-600">
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
      <section className="py-20 px-4 bg-gradient-to-br from-blue-600 to-indigo-700">
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
                className="bg-white text-blue-700 hover:bg-gray-100 px-8 py-6 text-lg"
                onClick={() => handleBookingClick()}
              >
                <Waves className="mr-2 h-5 w-5" />
                {content.cta.primaryButtonText}
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-white text-white hover:bg-white/10 px-8 py-6 text-lg"
                onClick={() => window.location.href = `tel:${content.contact.phone}`}
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
              <Phone className="h-8 w-8 mb-3 text-blue-400" />
              <h3 className="font-semibold mb-2">Call Us</h3>
              <p className="text-gray-300">{content.contact.phone}</p>
              <p className="text-sm text-gray-400">Available 24/7</p>
            </div>
            <div className="flex flex-col items-center">
              <Mail className="h-8 w-8 mb-3 text-blue-400" />
              <h3 className="font-semibold mb-2">Email Us</h3>
              <p className="text-gray-300">{content.contact.email}</p>
              <p className="text-sm text-gray-400">Quick response</p>
            </div>
            <div className="flex flex-col items-center">
              <Globe className="h-8 w-8 mb-3 text-blue-400" />
              <h3 className="font-semibold mb-2">Visit Website</h3>
              <p className="text-gray-300">{content.contact.website}</p>
              <p className="text-sm text-gray-400">More experiences</p>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
};

export default WhaleWatching;
