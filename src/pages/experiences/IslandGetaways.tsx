import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Anchor,
  Fish,
  Camera,
  Clock,
  MapPin,
  Calendar,
  Star,
  Users,
  Waves,
  Sun,
  Compass,
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
  Shell,
  Palmtree,
  Sunset,
  Loader2
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import EnhancedBookingModal from '@/components/EnhancedBookingModal';
import islandGetawaysPageService, {
  IslandGetawaysPageContent,
  Island,
  IslandPackage
} from '@/services/islandGetawaysPageService';
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
  { id: '1', url: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19', caption: 'Pigeon Island Paradise' },
  { id: '2', url: 'https://images.unsplash.com/photo-1506665531195-3566af2b4dfa', caption: 'Tropical Island Beach' },
  { id: '3', url: 'https://images.unsplash.com/photo-1583037189850-1921ae7c6c22', caption: 'Coral Reef Snorkeling' },
  { id: '4', url: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5', caption: 'Island Sunset Views' }
];

// Icon mapping for dynamic icon rendering from Firebase
const iconMap: { [key: string]: React.FC<any> } = {
  Anchor,
  Fish,
  Camera,
  Clock,
  MapPin,
  Calendar,
  Star,
  Users,
  Waves,
  Sun,
  Compass,
  Ship,
  Globe,
  Phone,
  Mail,
  Shell,
  Palmtree,
  Sunset,
  Package,
  CheckCircle,
  Info,
  DollarSign,
  AlertCircle
};

const IslandGetaways = () => {
  const [activeTab, setActiveTab] = useState('islands');
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [selectedPackage, setSelectedPackage] = useState<string | null>(null);
  const [heroImageIndex, setHeroImageIndex] = useState(0);
  const [pageContent, setPageContent] = useState<IslandGetawaysPageContent | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch content from Firebase with caching
  useEffect(() => {
    const fetchContent = async () => {
      try {
        const content = await cachedFetch<IslandGetawaysPageContent>(
          'island-getaways-page',
          () => islandGetawaysPageService.getPageContent(),
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
        console.error('Error fetching page content:', error);
        setPageContent(islandGetawaysPageService.getDefaultContent());
      } finally {
        setIsLoading(false);
      }
    };
    fetchContent();
  }, []);

  // Hero image slider
  useEffect(() => {
    if (!pageContent?.hero?.images?.length) return;
    const interval = setInterval(() => {
      setHeroImageIndex((prev) => (prev + 1) % (pageContent?.hero?.images?.length || 1));
    }, 5000);
    return () => clearInterval(interval);
  }, [pageContent?.hero?.images?.length]);

  const handleBookingClick = (packageName?: string) => {
    setSelectedPackage(packageName || null);
    setIsBookingModalOpen(true);
  };

  // Helper function to get icon component
  const getIconComponent = (iconName: string) => {
    return iconMap[iconName] || Anchor;
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-12 w-12 animate-spin text-cyan-600" />
      </div>
    );
  }

  const heroImages = pageContent?.hero?.images?.length ? pageContent.hero.images : defaultHeroImages;
  const islands = pageContent?.islands || [];
  const islandActivities = pageContent?.islandActivities || [];
  const islandPackages = pageContent?.islandPackages || [];
  const travelTips = pageContent?.travelTips || [];
  const faqs = pageContent?.faqs || [];
  const gallery = pageContent?.gallery || [];

  return (
    <>
      <Helmet>
        <title>{pageContent?.seo?.title || 'Sri Lanka Island Escapes | Island Hopping Tours | Recharge Travels'}</title>
        <meta name="description" content={pageContent?.seo?.description || "Explore Sri Lanka's pristine islands including Pigeon Island, Delft Island, and more. Book island hopping tours and marine adventures with Recharge Travels."} />
        <meta name="keywords" content={pageContent?.seo?.keywords?.join(', ') || 'Sri Lanka islands, Pigeon Island snorkeling, Delft Island, island hopping tours, marine national park, coral reef diving'} />
        <meta property="og:title" content={pageContent?.seo?.title || 'Island Escapes - Discover Sri Lanka\'s Hidden Islands'} />
        <meta property="og:description" content={pageContent?.seo?.description || "Escape to pristine islands with coral reefs, wild horses, and untouched beaches in Sri Lanka."} />
        <meta property="og:image" content={pageContent?.seo?.ogImage || 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=1200&h=630&fit=crop'} />
        <link rel="canonical" href="https://www.rechargetravels.com/experiences/island-getaways" />
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
              alt={heroImages[heroImageIndex]?.caption || 'Island Getaways'}
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
                {pageContent?.hero?.title || 'Island Escapes'}
              </h1>
              <p className="text-xl md:text-2xl mb-8 font-light drop-shadow">
                {pageContent?.hero?.subtitle || 'Discover Pristine Islands & Hidden Paradise Beaches'}
              </p>
              <Button
                onClick={() => handleBookingClick()}
                size="lg"
                className="bg-cyan-600 hover:bg-cyan-700 text-white px-8 py-6 text-lg rounded-full
                         transform hover:scale-105 transition-all duration-300 shadow-xl"
              >
                <Anchor className="mr-2 h-5 w-5" />
                {pageContent?.hero?.ctaText || 'Explore Islands'}
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
            <h2 className="text-4xl font-bold mb-6">{pageContent?.overview?.title || "Escape to Sri Lanka's Hidden Islands"}</h2>
            <p className="text-xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
              {pageContent?.overview?.description || "Discover a world of pristine beaches, vibrant coral reefs, and unique island cultures. From the marine paradise of Pigeon Island to the wild horses of Delft, each island offers its own adventure. Experience untouched nature, crystal-clear waters, and the warm hospitality of island communities."}
            </p>
          </motion.div>

          {/* Quick Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12">
            {(pageContent?.stats || []).map((stat, index) => {
              const IconComponent = getIconComponent(stat.iconName);
              return (
                <motion.div
                  key={stat.id || index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="text-center"
                >
                  <IconComponent className="h-12 w-12 text-cyan-600 mx-auto mb-3" />
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
            <TabsList className="grid w-full grid-cols-3 mb-8">
              <TabsTrigger value="islands">Featured Islands</TabsTrigger>
              <TabsTrigger value="activities">Island Activities</TabsTrigger>
              <TabsTrigger value="packages">Tour Packages</TabsTrigger>
            </TabsList>

            {/* Islands Tab */}
            <TabsContent value="islands" className="space-y-6">
              <h3 className="text-2xl font-bold mb-6">Discover Our Featured Islands</h3>
              <div className="grid gap-6">
                {islands.map((island, index) => (
                  <motion.div
                    key={island.id || index}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Card className="hover:shadow-lg transition-shadow">
                      <CardHeader>
                        <div className="flex justify-between items-start">
                          <div>
                            <CardTitle className="text-xl mb-2">{island.name}</CardTitle>
                            <div className="flex items-center gap-4 text-sm text-gray-600 mb-2">
                              <span className="flex items-center">
                                <MapPin className="h-4 w-4 mr-1" />
                                {island.location}
                              </span>
                              <span className="flex items-center">
                                <Ship className="h-4 w-4 mr-1" />
                                {island.accessibility}
                              </span>
                            </div>
                            <p className="text-gray-600">{island.description}</p>
                          </div>
                          <Badge className="bg-cyan-600">{island.uniqueFeature}</Badge>
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div>
                          <h4 className="font-semibold mb-2">Island Highlights:</h4>
                          <div className="flex flex-wrap gap-2">
                            {(island.highlights || []).map((highlight, idx) => (
                              <Badge key={idx} variant="secondary">
                                {highlight}
                              </Badge>
                            ))}
                          </div>
                        </div>
                        <div className="grid md:grid-cols-2 gap-4">
                          <div>
                            <h4 className="font-semibold mb-2">Activities:</h4>
                            <ul className="space-y-1 text-sm">
                              {(island.activities || []).map((activity, idx) => (
                                <li key={idx} className="flex items-center">
                                  <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                                  {activity}
                                </li>
                              ))}
                            </ul>
                          </div>
                          <div>
                            <h4 className="font-semibold mb-2">Best Time:</h4>
                            <div className="flex items-center text-sm">
                              <Sun className="h-4 w-4 text-yellow-500 mr-2" />
                              {island.bestTime}
                            </div>
                          </div>
                        </div>
                        <Button
                          className="w-full"
                          onClick={() => handleBookingClick(`${island.name} Island Tour`)}
                        >
                          Explore {island.name}
                        </Button>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </TabsContent>

            {/* Activities Tab */}
            <TabsContent value="activities" className="space-y-6">
              <h3 className="text-2xl font-bold mb-6">Island Adventure Activities</h3>
              <div className="grid gap-6">
                {islandActivities.map((activity, index) => (
                  <motion.div
                    key={activity.id || index}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Card className="hover:shadow-lg transition-shadow">
                      <CardHeader>
                        <CardTitle className="text-xl">{activity.activity}</CardTitle>
                        <p className="text-gray-600">{activity.description}</p>
                      </CardHeader>
                      <CardContent>
                        <div className="grid md:grid-cols-3 gap-4 text-sm">
                          <div>
                            <h4 className="font-semibold mb-2">Top Locations:</h4>
                            <ul className="space-y-1">
                              {(activity.locations || []).map((location, idx) => (
                                <li key={idx} className="flex items-center">
                                  <MapPin className="h-4 w-4 text-cyan-600 mr-2" />
                                  {location}
                                </li>
                              ))}
                            </ul>
                          </div>
                          <div>
                            <h4 className="font-semibold mb-2">Equipment:</h4>
                            <p className="text-gray-600">{activity.equipment}</p>
                          </div>
                          <div>
                            <h4 className="font-semibold mb-2">Difficulty:</h4>
                            <Badge variant="outline">{activity.difficulty}</Badge>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </TabsContent>

            {/* Packages Tab */}
            <TabsContent value="packages" className="space-y-6">
              <h3 className="text-2xl font-bold mb-6">Island Escape Packages</h3>
              <div className="grid md:grid-cols-2 gap-6">
                {islandPackages.map((pkg, index) => {
                  const IconComponent = getIconComponent(pkg.iconName);
                  return (
                    <motion.div
                      key={pkg.id || index}
                      initial={{ opacity: 0, scale: 0.95 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      viewport={{ once: true }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <Card className="h-full hover:shadow-xl transition-shadow">
                        <CardHeader>
                          <div className="flex items-center justify-between mb-3">
                            <IconComponent className="h-10 w-10 text-cyan-600" />
                            <Badge className="bg-cyan-600">{pkg.duration}</Badge>
                          </div>
                          <CardTitle className="text-xl">{pkg.name}</CardTitle>
                          <p className="text-2xl font-bold text-cyan-600">{pkg.price}</p>
                          <div className="flex flex-wrap gap-2 mt-2">
                            {(pkg.islands || []).map((island, idx) => (
                              <Badge key={idx} variant="outline">{island}</Badge>
                            ))}
                          </div>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          <div>
                            <h4 className="font-semibold mb-2">Package Highlights:</h4>
                            <ul className="space-y-1 text-sm">
                              {(pkg.highlights || []).map((highlight, idx) => (
                                <li key={idx} className="flex items-start">
                                  <ChevronRight className="h-4 w-4 text-cyan-600 mr-1 mt-0.5 flex-shrink-0" />
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
                            className="w-full bg-cyan-600 hover:bg-cyan-700"
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
          </Tabs>
        </div>
      </section>

      {/* Travel Tips Section */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">Island Travel Tips</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {travelTips.map((section, index) => {
              const IconComponent = getIconComponent(section.iconName);
              return (
                <motion.div
                  key={section.id || index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card>
                    <CardHeader>
                      <div className="flex items-center">
                        <IconComponent className="h-8 w-8 text-cyan-600 mr-3" />
                        <CardTitle className="text-lg">{section.title}</CardTitle>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-2">
                        {(section.tips || []).map((tip, idx) => (
                          <li key={idx} className="flex items-start text-sm text-gray-600">
                            <ChevronRight className="h-4 w-4 text-cyan-600 mr-1 mt-0.5 flex-shrink-0" />
                            <span>{tip}</span>
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Photo Gallery */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">Island Paradise Gallery</h2>
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
                  src={getOptimizedImageUrl(image.url, 400)}
                  alt={image.alt || `Island paradise ${index + 1}`}
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
            {faqs.map((faq, index) => (
              <AccordionItem key={faq.id || index} value={`item-${index}`}>
                <AccordionTrigger className="text-left hover:text-cyan-600">
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
      <section className="py-20 px-4 bg-gradient-to-br from-cyan-600 to-blue-700">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl font-bold mb-6 text-white">
              {pageContent?.cta?.title || 'Ready for Your Island Adventure?'}
            </h2>
            <p className="text-xl mb-8 text-white/90">
              {pageContent?.cta?.description || "Escape to pristine beaches, explore vibrant coral reefs, and discover the unique charm of Sri Lanka's islands."}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                size="lg"
                className="bg-white text-cyan-700 hover:bg-gray-100 px-8 py-6 text-lg"
                onClick={() => handleBookingClick()}
              >
                <Anchor className="mr-2 h-5 w-5" />
                {pageContent?.cta?.primaryButtonText || 'Book Island Tour'}
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
              <Phone className="h-8 w-8 mb-3 text-cyan-400" />
              <h3 className="font-semibold mb-2">Call Us</h3>
              <p className="text-gray-300">{pageContent?.contact?.phone || '+94 76 505 9595'}</p>
              <p className="text-sm text-gray-400">{pageContent?.contact?.phoneNote || 'Available 24/7'}</p>
            </div>
            <div className="flex flex-col items-center">
              <Mail className="h-8 w-8 mb-3 text-cyan-400" />
              <h3 className="font-semibold mb-2">Email Us</h3>
              <p className="text-gray-300">{pageContent?.contact?.email || 'info@rechargetravels.com'}</p>
              <p className="text-sm text-gray-400">{pageContent?.contact?.emailNote || 'Quick response'}</p>
            </div>
            <div className="flex flex-col items-center">
              <Globe className="h-8 w-8 mb-3 text-cyan-400" />
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
        itemTitle={selectedPackage || "Island Escape Tour"}
      />
    </>
  );
};

export default IslandGetaways;
