import React, { useState, useEffect, useMemo } from 'react';
import { Helmet } from 'react-helmet-async';
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
  Eye,
  Shield
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { whaleWatchingPageService, WhaleWatchingPageContent, WhaleTour } from '@/services/whaleWatchingPageService';
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

type EnrichedWhaleTour = WhaleTour & {
  priceValue: number;
  priceDisplay: string;
  maxGuestsValue: number;
  ratingValue: number;
  startLocationValue: string;
  transportNoteValue: string;
  importantInfoValue: string[];
};

const enrichTour = (tour: WhaleTour): EnrichedWhaleTour => {
  const rawPrice = tour.price ?? 0;
  const priceValue = typeof rawPrice === 'number'
    ? rawPrice
    : Number(String(rawPrice).replace(/[^\d.]/g, '')) || 0;
  const priceDisplay =
    tour.priceLabel ||
    (typeof rawPrice === 'string'
      ? rawPrice
      : priceValue
        ? `USD ${priceValue.toLocaleString()}`
        : 'On Request');

  return {
    ...tour,
    price: priceValue,
    priceValue,
    priceDisplay,
    maxGuestsValue: tour.maxGuests ?? 24,
    ratingValue: tour.rating ?? 4.9,
    startLocationValue: tour.startLocation || 'Mirissa Harbour Jetty 03',
    transportNoteValue:
      tour.transportNote ||
      'All departures begin at the listed harbour. Transfers requested outside the base city can be arranged for an additional fee.',
    importantInfoValue:
      tour.importantInfo && tour.importantInfo.length > 0
        ? tour.importantInfo
        : [
            'Arrive 20 minutes before departure for the safety briefing.',
            'Passport or NIC required for harbour security clearance.',
            'Sea conditions may adjust route or duration for guest safety.'
          ],
  };
};

const WhaleWatching = () => {
  const [activeTab, setActiveTab] = useState('locations');
  const [heroImageIndex, setHeroImageIndex] = useState(0);
  const [content, setContent] = useState<WhaleWatchingPageContent | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedTour, setSelectedTour] = useState<EnrichedWhaleTour | null>(null);
  const tours = useMemo<EnrichedWhaleTour[]>(() => {
    if (!content?.tours || content.tours.length === 0) {
      return [];
    }
    return content.tours.map(enrichTour);
  }, [content]);

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

  const handleBookingClick = (tour?: EnrichedWhaleTour) => {
    const targetTour = tour ?? tours[0];
    if (targetTour) {
      setSelectedTour(targetTour);
    } else {
      toast.info('Share your preferences via WhatsApp and our concierge will curate a whale watching plan for you.');
    }
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
                              onClick={() => handleBookingClick()}
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
                {tours.map((tour, index) => {
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
                          <div>
                            <p className="text-2xl font-bold text-blue-600">{tour.priceDisplay}</p>
                            <p className="text-sm text-gray-500 mt-1">
                              Departs from {tour.startLocationValue}
                            </p>
                          </div>
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
                            onClick={() => handleBookingClick(tour)}
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

      <Dialog
        open={!!selectedTour}
        onOpenChange={(open) => {
          if (!open) {
            setSelectedTour(null);
          }
        }}
      >
        {selectedTour && <WhaleBookingDialog tour={selectedTour} />}
      </Dialog>

      <Footer />
    </>
  );
};

export default WhaleWatching;

const WhaleBookingDialog = ({ tour }: { tour: EnrichedWhaleTour }) => {
  const [formData, setFormData] = useState({
    date: '',
    guests: 2,
    contactName: '',
    contactEmail: '',
    contactPhone: '',
    pickupLocation: tour.startLocationValue,
    specialRequests: '',
  });

  const clampGuests = (value: number) =>
    Math.min(Math.max(value || 1, 1), tour.maxGuestsValue || 50);

  const handleInputChange = (field: keyof typeof formData, value: string | number) => {
    setFormData((prev) => ({
      ...prev,
      [field]: typeof value === 'number' ? clampGuests(value) : value,
    }));
  };

  const guestCount = formData.guests || 1;
  const totalPrice = tour.priceValue * guestCount;
  const holdingDeposit = Math.max(50, Math.round(totalPrice * 0.25));

  return (
    <DialogContent className="max-w-5xl border-none bg-transparent p-0">
      <div className="grid lg:grid-cols-[1.05fr_0.95fr] overflow-hidden rounded-3xl border border-blue-100 bg-white shadow-2xl">
        <div className="relative bg-gradient-to-b from-sky-50 to-white">
          <div className="relative h-56 w-full overflow-hidden rounded-t-3xl lg:rounded-tr-none">
            <img
              src={tour.image || 'https://images.unsplash.com/photo-1570913149827-d2ac84ab3f9a?w=1600&auto=format&fit=crop'}
              alt={tour.name}
              className="h-full w-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-900/70 via-slate-900/10 to-transparent" />
            <div className="absolute bottom-4 left-4 right-4 flex flex-wrap items-center justify-between gap-4 text-white">
              <div>
                <p className="text-xs uppercase tracking-[0.3em] text-white/70">Whale Watch</p>
                <p className="text-lg font-semibold">{tour.name}</p>
              </div>
              <div className="text-right">
                <p className="text-xs text-white/70">From</p>
                <p className="text-2xl font-bold">
                  {tour.priceDisplay}{' '}
                  <span className="text-sm font-normal text-white/70">per guest</span>
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-5 p-6 lg:p-8">
            <div className="flex flex-wrap gap-3 text-sm text-sky-900">
              <span className="inline-flex items-center gap-1 rounded-full bg-white/80 px-3 py-1 text-slate-700 shadow-sm">
                <Clock className="h-4 w-4 text-sky-500" />
                {tour.duration}
              </span>
              <span className="inline-flex items-center gap-1 rounded-full bg-white/80 px-3 py-1 text-slate-700 shadow-sm">
                <Calendar className="h-4 w-4 text-sky-500" />
                {tour.departures}
              </span>
              <span className="inline-flex items-center gap-1 rounded-full bg-white/80 px-3 py-1 text-slate-700 shadow-sm">
                <Users className="h-4 w-4 text-sky-500" />
                Max {tour.maxGuestsValue}
              </span>
              <span className="inline-flex items-center gap-1 rounded-full bg-white/80 px-3 py-1 text-slate-700 shadow-sm">
                <Star className="h-4 w-4 text-amber-400" />
                {tour.ratingValue.toFixed(1)} rating
              </span>
            </div>

            <div className="space-y-3 rounded-2xl border border-blue-100 bg-white p-4 shadow-sm">
              <div className="flex items-center gap-2 text-sm font-semibold text-slate-800">
                <Ship className="h-4 w-4 text-sky-500" />
                Departure logistics
              </div>
              <p className="text-sm text-slate-600">
                Primary departure: <span className="font-semibold">{tour.startLocationValue}</span>
              </p>
              <p className="text-xs text-slate-500">{tour.transportNoteValue}</p>
            </div>

            <div className="space-y-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-500">
                  Highlights
                </p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {tour.highlights?.slice(0, 6).map((highlight, index) => (
                    <span
                      key={`${highlight}-${index}`}
                      className="inline-flex items-center gap-1 rounded-full border border-blue-100 bg-sky-50 px-3 py-1 text-xs text-sky-800"
                    >
                      <CheckCircle className="h-3.5 w-3.5 text-sky-500" />
                      {highlight}
                    </span>
                  ))}
                </div>
                <p className="mt-4 text-sm leading-relaxed text-slate-600">{tour.description}</p>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="rounded-2xl border border-slate-200 bg-white/80 p-4">
                  <p className="text-sm font-semibold text-slate-800 flex items-center gap-2">
                    <Shield className="h-4 w-4 text-green-500" />
                    Included
                  </p>
                  <ul className="mt-3 space-y-1 text-sm text-slate-600">
                    {tour.included?.map((item, index) => (
                      <li key={`${item}-${index}`} className="flex items-start gap-2">
                        <span className="mt-1 h-1.5 w-1.5 rounded-full bg-green-500" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="rounded-2xl border border-amber-100 bg-gradient-to-br from-amber-50 to-white p-4">
                  <p className="text-sm font-semibold text-amber-900 flex items-center gap-2">
                    <AlertCircle className="h-4 w-4 text-amber-500" />
                    Important notes
                  </p>
                  <ul className="mt-3 space-y-1.5 text-sm text-amber-900/80">
                    {tour.importantInfoValue.map((note, index) => (
                      <li key={`${note}-${index}`} className="flex items-start gap-2">
                        <span className="mt-1 h-1.5 w-1.5 rounded-full bg-amber-500/70" />
                        {note}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-6 border-t border-blue-100 bg-white/95 p-6 lg:border-l lg:border-t-0 lg:p-8">
          <DialogHeader className="text-left space-y-2">
            <DialogTitle className="text-2xl font-semibold text-slate-900">Reserve your seats</DialogTitle>
            <DialogDescription className="text-sm text-slate-500">
              Share your preferred date, party details, and pickup plan. A marine concierge confirms availability within 30 minutes.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-600">Preferred date</label>
                <Input
                  type="date"
                  value={formData.date}
                  onChange={(e) => handleInputChange('date', e.target.value)}
                  className="rounded-2xl border-slate-200 bg-slate-50/60 focus-visible:ring-sky-500"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-600">Guests</label>
                <Input
                  type="number"
                  min={1}
                  max={tour.maxGuestsValue}
                  value={formData.guests}
                  onChange={(e) => handleInputChange('guests', Number(e.target.value))}
                  className="rounded-2xl border-slate-200 bg-slate-50/60 focus-visible:ring-sky-500"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-600">Lead guest name</label>
              <Input
                placeholder="Your full name"
                value={formData.contactName}
                onChange={(e) => handleInputChange('contactName', e.target.value)}
                className="rounded-2xl border-slate-200 bg-slate-50/60 focus-visible:ring-sky-500"
              />
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-600">Email</label>
                <Input
                  type="email"
                  placeholder="you@email.com"
                  value={formData.contactEmail}
                  onChange={(e) => handleInputChange('contactEmail', e.target.value)}
                  className="rounded-2xl border-slate-200 bg-slate-50/60 focus-visible:ring-sky-500"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-600">Phone / WhatsApp</label>
                <Input
                  type="tel"
                  placeholder="+94 77 123 4567"
                  value={formData.contactPhone}
                  onChange={(e) => handleInputChange('contactPhone', e.target.value)}
                  className="rounded-2xl border-slate-200 bg-slate-50/60 focus-visible:ring-sky-500"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-600">Pickup / meeting point</label>
              <Input
                placeholder="e.g., Mirissa Harbour Jetty 03"
                value={formData.pickupLocation}
                onChange={(e) => handleInputChange('pickupLocation', e.target.value)}
                className="rounded-2xl border-slate-200 bg-slate-50/60 focus-visible:ring-sky-500"
              />
              <p className="text-xs text-slate-500">
                Transfers outside the base harbour are quoted separately after we receive your request.
              </p>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-600">Special requests</label>
              <Textarea
                placeholder="Dietary preferences, child seats, photography goals..."
                rows={3}
                value={formData.specialRequests}
                onChange={(e) => handleInputChange('specialRequests', e.target.value)}
                className="rounded-2xl border-slate-200 bg-slate-50/60 focus-visible:ring-sky-500"
              />
            </div>
          </div>

          <div className="space-y-4 rounded-2xl border border-slate-200 bg-slate-50/80 p-5">
            <div className="flex items-center justify-between text-sm text-slate-600">
              <span>Price per guest</span>
              <span className="font-semibold text-slate-900">
                {tour.priceValue ? `USD ${tour.priceValue.toLocaleString()}` : 'On request'}
              </span>
            </div>
            <div className="flex items-center justify-between text-sm text-slate-600">
              <span>Guests</span>
              <span className="font-semibold text-slate-900">× {guestCount}</span>
            </div>
            <div className="flex items-center justify-between text-sm text-slate-600">
              <span>Concierge assurance deposit (25%)</span>
              <span className="font-semibold text-slate-900">
                USD {holdingDeposit.toLocaleString()}
              </span>
            </div>
            <div className="border-t border-slate-200 pt-3">
              <div className="flex items-center justify-between">
                <span className="text-lg font-semibold text-slate-900">Estimated total</span>
                <span className="text-2xl font-bold text-blue-600">
                  USD {totalPrice.toLocaleString()}
                </span>
              </div>
              <p className="mt-1 text-xs text-slate-500">
                Final invoice confirms transport supplements, private upgrades, or harbour taxes if requested.
              </p>
            </div>
          </div>

          <Button className="w-full rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-500 py-5 text-base font-semibold shadow-lg shadow-blue-200 hover:from-blue-700 hover:to-indigo-600">
            Send reservation request
          </Button>

          <div className="flex items-start gap-3 rounded-2xl border border-slate-200 bg-white/80 p-4 text-xs text-slate-500">
            <MessageCircle className="h-4 w-4 text-blue-600" />
            <p>
              A concierge will reply via WhatsApp or email with availability, permit details, and secure payment links.
              Need instant help? Call +94 7777 21 999 after submitting your request.
            </p>
          </div>
        </div>
      </div>
    </DialogContent>
  );
};
