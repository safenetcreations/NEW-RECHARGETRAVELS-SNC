import React, { useState, useEffect } from 'react';
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
  Activity,
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
  Zap,
  Heart,
  Loader2
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import EnhancedBookingModal from '@/components/EnhancedBookingModal';
import hikkaduwaWaterSportsPageService, {
  HikkaduwaWaterSportsPageContent,
  WaterSport,
  SportPackage
} from '@/services/hikkaduwaWaterSportsPageService';
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
  { id: '1', url: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5', caption: 'Hikkaduwa Beach Paradise' },
  { id: '2', url: 'https://images.unsplash.com/photo-1530053969600-caed2596d242', caption: 'Snorkeling Adventure' },
  { id: '3', url: 'https://images.unsplash.com/photo-1682687982501-1e58ab814714', caption: 'Water Sports Fun' },
  { id: '4', url: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e', caption: 'Tropical Waters' }
];

// Icon mapping for dynamic icon rendering from Firebase
const iconMap: { [key: string]: React.FC<any> } = {
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
  Activity,
  Shield,
  Zap,
  Heart,
  Package,
  Globe,
  Phone,
  Mail,
  CheckCircle,
  Info,
  DollarSign,
  AlertCircle
};

const HikkaduwaWaterSports = () => {
  const [activeTab, setActiveTab] = useState('activities');
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [selectedPackage, setSelectedPackage] = useState<string | null>(null);
  const [heroImageIndex, setHeroImageIndex] = useState(0);
  const [pageContent, setPageContent] = useState<HikkaduwaWaterSportsPageContent | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch content from Firebase with caching
  useEffect(() => {
    const fetchContent = async () => {
      try {
        const content = await cachedFetch<HikkaduwaWaterSportsPageContent>(
          'hikkaduwa-water-sports-page',
          () => hikkaduwaWaterSportsPageService.getPageContent(),
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
        setPageContent(hikkaduwaWaterSportsPageService.getDefaultContent());
      } finally {
        setIsLoading(false);
      }
    };
    fetchContent();
  }, []);

  // Get hero images with fallback
  const heroImages = pageContent?.hero?.images?.length ? pageContent.hero.images : defaultHeroImages;

  // Hero image slider - works with fallback images
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

  // Helper function to get icon component
  const getIconComponent = (iconName: string) => {
    return iconMap[iconName] || Activity;
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-12 w-12 animate-spin text-orange-600" />
      </div>
    );
  }

  const waterSports = pageContent?.waterSports || [];
  const sportPackages = pageContent?.sportPackages || [];
  const safetyGuidelines = pageContent?.safetyGuidelines || [];
  const faqs = pageContent?.faqs || [];
  const gallery = pageContent?.gallery || [];

  return (
    <>
      <Helmet>
        <title>{pageContent?.seo?.title || 'Hikkaduwa Water Sports | Surfing, Diving & Beach Activities | Recharge Travels'}</title>
        <meta name="description" content={pageContent?.seo?.description || 'Experience thrilling water sports in Hikkaduwa - surfing lessons, scuba diving, snorkeling, jet skiing, and more. Book your beach adventure with Recharge Travels.'} />
        <meta name="keywords" content={pageContent?.seo?.keywords?.join(', ') || 'Hikkaduwa water sports, surfing Sri Lanka, scuba diving Hikkaduwa, snorkeling tours, jet ski rental, beach activities'} />
        <meta property="og:title" content={pageContent?.seo?.title || 'Water Sports in Hikkaduwa - Ultimate Beach Adventures'} />
        <meta property="og:description" content={pageContent?.seo?.description || 'Dive into adventure with surfing, snorkeling, jet skiing and more water sports in Hikkaduwa\'s pristine waters.'} />
        <meta property="og:image" content={pageContent?.seo?.ogImage || 'https://images.unsplash.com/photo-1530870110042-98b2cb110834?w=1200&h=630&fit=crop'} />
        <link rel="canonical" href="https://www.rechargetravels.com/experiences/hikkaduwa-water-sports" />
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
              alt={heroImages[heroImageIndex]?.caption || 'Hikkaduwa Water Sports'}
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
                {pageContent?.hero?.title || 'Hikkaduwa Water Sports'}
              </h1>
              <p className="text-xl md:text-2xl mb-8 font-light drop-shadow">
                {pageContent?.hero?.subtitle || "Dive Into Adventure at Sri Lanka's Premier Beach Destination"}
              </p>
              <Button
                onClick={() => handleBookingClick()}
                size="lg"
                className="bg-orange-600 hover:bg-orange-700 text-white px-8 py-6 text-lg rounded-full
                         transform hover:scale-105 transition-all duration-300 shadow-xl"
              >
                <Waves className="mr-2 h-5 w-5" />
                {pageContent?.hero?.ctaText || 'Book Water Sports'}
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
            <h2 className="text-4xl font-bold mb-6">{pageContent?.overview?.title || 'Your Ultimate Water Sports Playground'}</h2>
            <p className="text-xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
              {pageContent?.overview?.description || "Hikkaduwa Beach offers the perfect combination of consistent waves, crystal-clear waters, and vibrant marine life. Whether you're a thrill-seeker looking for adrenaline-pumping activities or a beginner wanting to try something new, our certified instructors and top-quality equipment ensure safe and unforgettable experiences."}
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
              <TabsTrigger value="activities">Activities</TabsTrigger>
              <TabsTrigger value="packages">Combo Packages</TabsTrigger>
              <TabsTrigger value="safety">Safety Info</TabsTrigger>
              <TabsTrigger value="booking">Booking Info</TabsTrigger>
            </TabsList>

            {/* Activities Tab */}
            <TabsContent value="activities" className="space-y-6">
              <h3 className="text-2xl font-bold mb-6">Choose Your Adventure</h3>
              <div className="grid md:grid-cols-2 gap-6">
                {waterSports.map((sport, index) => (
                  <motion.div
                    key={sport.id || index}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Card className="h-full hover:shadow-lg transition-shadow">
                      <CardHeader>
                        <div className="flex justify-between items-start">
                          <div>
                            <CardTitle className="text-xl">{sport.name}</CardTitle>
                            <p className="text-gray-600 mt-2">{sport.description}</p>
                          </div>
                          <div className="text-right">
                            <Badge className="bg-orange-600">{sport.difficulty}</Badge>
                            <p className="text-2xl font-bold text-orange-600 mt-2">{sport.price}</p>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div>
                            <span className="text-gray-500">Duration:</span>
                            <p className="font-semibold">{sport.duration}</p>
                          </div>
                          <div>
                            <span className="text-gray-500">Best Time:</span>
                            <p className="font-semibold">{sport.bestTime}</p>
                          </div>
                        </div>
                        <div>
                          <h4 className="font-semibold mb-2">Includes:</h4>
                          <div className="grid grid-cols-2 gap-2">
                            {(sport.includes || []).map((item, idx) => (
                              <div key={idx} className="flex items-center text-sm">
                                <CheckCircle className="h-4 w-4 text-green-500 mr-1" />
                                <span>{item}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                        <div>
                          <h4 className="font-semibold mb-2">Requirements:</h4>
                          <ul className="space-y-1">
                            {(sport.requirements || []).map((req, idx) => (
                              <li key={idx} className="text-sm text-gray-600">• {req}</li>
                            ))}
                          </ul>
                        </div>
                        <Button
                          className="w-full"
                          onClick={() => handleBookingClick(sport.name)}
                        >
                          Book {sport.name}
                        </Button>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </TabsContent>

            {/* Packages Tab */}
            <TabsContent value="packages" className="space-y-6">
              <h3 className="text-2xl font-bold mb-6">Value Combo Packages</h3>
              <div className="grid md:grid-cols-2 gap-6">
                {sportPackages.map((pkg, index) => {
                  const IconComponent = getIconComponent(pkg.iconName);
                  return (
                    <motion.div
                      key={pkg.id || index}
                      initial={{ opacity: 0, scale: 0.95 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      viewport={{ once: true }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <Card className="h-full hover:shadow-xl transition-shadow relative overflow-hidden">
                        <div className="absolute top-4 right-4">
                          <Badge className="bg-green-600">{pkg.savings}</Badge>
                        </div>
                        <CardHeader>
                          <div className="flex items-center justify-between mb-3">
                            <IconComponent className="h-10 w-10 text-orange-600" />
                            <Badge className="bg-orange-600">{pkg.duration}</Badge>
                          </div>
                          <CardTitle className="text-xl">{pkg.name}</CardTitle>
                          <p className="text-2xl font-bold text-orange-600">{pkg.price}</p>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          <div>
                            <h4 className="font-semibold mb-2">Package Highlights:</h4>
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
                            Book This Package
                          </Button>
                        </CardContent>
                      </Card>
                    </motion.div>
                  );
                })}
              </div>
            </TabsContent>

            {/* Safety Tab */}
            <TabsContent value="safety" className="space-y-6">
              <h3 className="text-2xl font-bold mb-6">Your Safety is Our Priority</h3>

              <div className="grid md:grid-cols-3 gap-6 mb-8">
                {safetyGuidelines.map((section, index) => (
                  <motion.div
                    key={section.id || index}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-lg flex items-center">
                          <Shield className="h-5 w-5 mr-2 text-orange-600" />
                          {section.title}
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <ul className="space-y-2">
                          {(section.guidelines || []).map((guideline, idx) => (
                            <li key={idx} className="flex items-start text-sm">
                              <CheckCircle className="h-4 w-4 text-green-500 mr-2 mt-0.5" />
                              <span>{guideline}</span>
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
                  <CardTitle>Equipment & Certification</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-semibold mb-3">Our Equipment</h4>
                      <ul className="space-y-2 text-sm">
                        <li className="flex items-start">
                          <CheckCircle className="h-4 w-4 text-green-500 mr-2 mt-0.5" />
                          <span>All equipment regularly inspected and maintained</span>
                        </li>
                        <li className="flex items-start">
                          <CheckCircle className="h-4 w-4 text-green-500 mr-2 mt-0.5" />
                          <span>Life jackets available in all sizes</span>
                        </li>
                        <li className="flex items-start">
                          <CheckCircle className="h-4 w-4 text-green-500 mr-2 mt-0.5" />
                          <span>First aid kits on all boats</span>
                        </li>
                        <li className="flex items-start">
                          <CheckCircle className="h-4 w-4 text-green-500 mr-2 mt-0.5" />
                          <span>Emergency communication devices</span>
                        </li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-3">Our Team</h4>
                      <ul className="space-y-2 text-sm">
                        <li className="flex items-start">
                          <CheckCircle className="h-4 w-4 text-green-500 mr-2 mt-0.5" />
                          <span>PADI certified dive instructors</span>
                        </li>
                        <li className="flex items-start">
                          <CheckCircle className="h-4 w-4 text-green-500 mr-2 mt-0.5" />
                          <span>ISA qualified surf instructors</span>
                        </li>
                        <li className="flex items-start">
                          <CheckCircle className="h-4 w-4 text-green-500 mr-2 mt-0.5" />
                          <span>Trained lifeguards on duty</span>
                        </li>
                        <li className="flex items-start">
                          <CheckCircle className="h-4 w-4 text-green-500 mr-2 mt-0.5" />
                          <span>First aid certified staff</span>
                        </li>
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Booking Info Tab */}
            <TabsContent value="booking" className="space-y-6">
              <h3 className="text-2xl font-bold mb-6">Booking Information</h3>

              <div className="grid md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>How to Book</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ol className="space-y-3">
                      <li className="flex items-start">
                        <span className="font-bold text-orange-600 mr-2">1.</span>
                        <span>Choose your preferred activity or package</span>
                      </li>
                      <li className="flex items-start">
                        <span className="font-bold text-orange-600 mr-2">2.</span>
                        <span>Select date and time (subject to availability)</span>
                      </li>
                      <li className="flex items-start">
                        <span className="font-bold text-orange-600 mr-2">3.</span>
                        <span>Provide participant details and requirements</span>
                      </li>
                      <li className="flex items-start">
                        <span className="font-bold text-orange-600 mr-2">4.</span>
                        <span>Receive confirmation and meeting details</span>
                      </li>
                    </ol>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Cancellation Policy</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2 text-sm">
                      <li className="flex items-start">
                        <Info className="h-4 w-4 text-blue-500 mr-2 mt-0.5" />
                        <span>Free cancellation up to 24 hours before activity</span>
                      </li>
                      <li className="flex items-start">
                        <Info className="h-4 w-4 text-blue-500 mr-2 mt-0.5" />
                        <span>50% refund for cancellations within 24 hours</span>
                      </li>
                      <li className="flex items-start">
                        <Info className="h-4 w-4 text-blue-500 mr-2 mt-0.5" />
                        <span>Full refund for weather-related cancellations</span>
                      </li>
                      <li className="flex items-start">
                        <Info className="h-4 w-4 text-blue-500 mr-2 mt-0.5" />
                        <span>Rescheduling available subject to availability</span>
                      </li>
                    </ul>
                  </CardContent>
                </Card>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle>Meeting Point & Facilities</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-semibold mb-3 flex items-center">
                        <MapPin className="h-5 w-5 mr-2 text-orange-600" />
                        Location
                      </h4>
                      <p className="text-sm mb-2">
                        Hikkaduwa Beach Water Sports Center<br />
                        Galle Road, Hikkaduwa 80240<br />
                        (Next to Hikkaduwa Beach Hotel)
                      </p>
                      <Button variant="outline" size="sm" className="mt-2">
                        <MapPin className="h-4 w-4 mr-2" />
                        View on Map
                      </Button>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-3">Facilities Available</h4>
                      <ul className="space-y-1 text-sm">
                        <li>• Changing rooms and lockers</li>
                        <li>• Fresh water showers</li>
                        <li>• Equipment storage</li>
                        <li>• Beach restaurant and bar</li>
                        <li>• Free parking</li>
                        <li>• WiFi access</li>
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
          <h2 className="text-3xl font-bold text-center mb-12">Water Sports Gallery</h2>
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
                  alt={image.alt || `Water sports ${index + 1}`}
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
              <AccordionItem key={faq.id || index} value={`item-${index}`}>
                <AccordionTrigger className="text-left hover:text-orange-600">
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
      <section className="py-20 px-4 bg-gradient-to-br from-orange-600 to-red-700">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl font-bold mb-6 text-white">
              {pageContent?.cta?.title || 'Ready to Make a Splash?'}
            </h2>
            <p className="text-xl mb-8 text-white/90">
              {pageContent?.cta?.description || 'Join us for unforgettable water sports adventures in Hikkaduwa. Professional instruction, quality equipment, and endless fun await!'}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                size="lg"
                className="bg-white text-orange-700 hover:bg-gray-100 px-8 py-6 text-lg"
                onClick={() => handleBookingClick()}
              >
                <Waves className="mr-2 h-5 w-5" />
                {pageContent?.cta?.primaryButtonText || 'Book Activities Now'}
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-white text-white hover:bg-white/10 px-8 py-6 text-lg"
                onClick={() => window.location.href = `tel:${pageContent?.contact?.phone || '+94765059595'}`}
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
              <Phone className="h-8 w-8 mb-3 text-orange-400" />
              <h3 className="font-semibold mb-2">Call Us</h3>
              <p className="text-gray-300">{pageContent?.contact?.phone || '+94 76 505 9595'}</p>
              <p className="text-sm text-gray-400">{pageContent?.contact?.phoneNote || 'Available 24/7'}</p>
            </div>
            <div className="flex flex-col items-center">
              <Mail className="h-8 w-8 mb-3 text-orange-400" />
              <h3 className="font-semibold mb-2">Email Us</h3>
              <p className="text-gray-300">{pageContent?.contact?.email || 'info@rechargetravels.com'}</p>
              <p className="text-sm text-gray-400">{pageContent?.contact?.emailNote || 'Quick response'}</p>
            </div>
            <div className="flex flex-col items-center">
              <Globe className="h-8 w-8 mb-3 text-orange-400" />
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
        itemTitle={selectedPackage || "Water Sports Activity"}
      />
    </>
  );
};

export default HikkaduwaWaterSports;
