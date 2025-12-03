import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  MapPin,
  Calendar,
  Clock,
  Star,
  Users,
  DollarSign,
  Info,
  Sun,
  Cloud,
  Navigation,
  Heart,
  Camera,
  ChevronDown,
  Globe,
  Shield,
  Mic,
  Home,
  Utensils,
  Car,
  HelpCircle,
  Activity,
  Waves,
  Fish,
  Sunrise,
  ShoppingBag,
  Anchor,
  Zap,
  Flower2,
  Bike,
  Building,
  Coffee,
  Binoculars,
  Music
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import EnhancedBookingModal from '@/components/EnhancedBookingModal';
import { doc, onSnapshot } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { 
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

interface DestinationConfig {
  id: string;
  name: string;
  tagline: string;
  description: string;
  highlights: string[];
  heroImages: {
    image: string;
    title: string;
    subtitle: string;
  }[];
  attractions: {
    name: string;
    description: string;
    image: string;
    category: string;
    rating: number;
    duration: string;
    price: string;
  }[];
  activities: {
    name: string;
    description: string;
    icon: string;
    price: string;
    duration: string;
    popular?: boolean;
  }[];
  destinationInfo: {
    population: string;
    area: string;
    elevation: string;
    bestTime: string;
    language: string;
    currency: string;
  };
  weatherInfo: {
    temperature: string;
    season: string;
    rainfall: string;
  };
  accommodations: {
    name: string;
    type: string;
    price: string;
    features: string[];
  }[];
  restaurants: {
    name: string;
    cuisine: string;
    specialty: string;
    priceRange: string;
  }[];
  transportInfo: {
    fromColombo: string;
    fromAirport: string;
    localTransport: string;
  };
  tips: string[];
  faqs: {
    question: string;
    answer: string;
  }[];
}

// Icon mapping
const iconMap: { [key: string]: any } = {
  'Waves': Waves,
  'Fish': Fish,
  'Sunrise': Sunrise,
  'Heart': Heart,
  'ShoppingBag': ShoppingBag,
  'Anchor': Anchor,
  'Zap': Zap,
  'Flower2': Flower2,
  'Bike': Bike,
  'Camera': Camera,
  'Navigation': Navigation,
  'Activity': Activity,
  'Sun': Sun,
  'Cloud': Cloud,
  'Building': Building,
  'Coffee': Coffee,
  'Utensils': Utensils,
  'Binoculars': Binoculars,
  'Music': Music
};

const getIcon = (iconName: string) => {
  return iconMap[iconName] || Activity;
};

interface DestinationPageProps {
  config: DestinationConfig;
}

const DestinationPage: React.FC<DestinationPageProps> = ({ config }) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [selectedTab, setSelectedTab] = useState('attractions');
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [selectedAttraction, setSelectedAttraction] = useState<string>('');
  const [dynamicContent, setDynamicContent] = useState(config);

  // Real-time Firebase sync
  useEffect(() => {
    const unsubscribe = onSnapshot(doc(db, 'destinations', config.id), (doc) => {
      if (doc.exists()) {
        const data = doc.data();
        setDynamicContent({
          ...config,
          ...data,
          activities: data.activities?.map((activity: any) => ({
            ...activity,
            icon: activity.icon || 'Activity'
          })) || config.activities
        });
      }
    });

    return () => unsubscribe();
  }, [config.id]);

  // Cycle through hero slides
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % dynamicContent.heroImages.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [dynamicContent.heroImages.length]);

  const tabs = [
    { id: 'attractions', label: 'Attractions', count: dynamicContent.attractions.length },
    { id: 'activities', label: 'Activities', count: dynamicContent.activities.length },
    { id: 'accommodation', label: 'Stay', count: dynamicContent.accommodations.length },
    { id: 'dining', label: 'Dining', count: dynamicContent.restaurants.length },
    { id: 'transport', label: 'Getting Here', count: null },
    { id: 'tips', label: 'Travel Tips', count: dynamicContent.tips.length },
    { id: 'faqs', label: 'FAQs', count: dynamicContent.faqs.length }
  ];

  // SEO Schema
  const schemaData = {
    "@context": "https://schema.org",
    "@type": "TouristDestination",
    "name": dynamicContent.name,
    "description": dynamicContent.description,
    "url": `https://www.rechargetravels.com/destinations/${config.id}`,
    "image": dynamicContent.heroImages[0].image,
    "address": {
      "@type": "PostalAddress",
      "addressCountry": "Sri Lanka",
      "addressLocality": dynamicContent.name
    },
    "touristType": dynamicContent.highlights,
    "publicAccess": true,
    "isAccessibleForFree": false
  };

  return (
    <>
      <Helmet>
        <title>{dynamicContent.name} - {dynamicContent.tagline} | Recharge Travels</title>
        <meta name="description" content={`${dynamicContent.description} Explore ${dynamicContent.highlights.join(', ')}. Plan your perfect visit to ${dynamicContent.name} with Recharge Travels.`} />
        <meta name="keywords" content={`${dynamicContent.name} Sri Lanka, ${dynamicContent.highlights.join(', ')}, ${dynamicContent.name} travel guide, things to do in ${dynamicContent.name}`} />
        
        {/* Open Graph */}
        <meta property="og:title" content={`${dynamicContent.name} - ${dynamicContent.tagline}`} />
        <meta property="og:description" content={dynamicContent.description} />
        <meta property="og:image" content={dynamicContent.heroImages[0].image} />
        <meta property="og:type" content="website" />
        
        {/* Structured Data */}
        <script type="application/ld+json">
          {JSON.stringify(schemaData)}
        </script>
      </Helmet>
      
      <Header />
      
      <div className="min-h-screen bg-background">
        {/* Hero Section with Slideshow */}
        <section className="relative h-[70vh] overflow-hidden" role="banner" aria-label="Destination hero">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentSlide}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1 }}
              className="absolute inset-0"
            >
              <div 
                className="h-full bg-cover bg-center"
                style={{ backgroundImage: `url(${dynamicContent.heroImages[currentSlide].image})` }}
              >
                <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/30 to-black/60" />
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Hero Content */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center text-white px-4 max-w-4xl">
              <motion.h1 
                initial={{ y: 30, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="text-5xl md:text-7xl font-bold mb-6"
              >
                {dynamicContent.heroImages[currentSlide].title}
              </motion.h1>
              <motion.p 
                initial={{ y: 30, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="text-xl md:text-2xl mb-8"
              >
                {dynamicContent.heroImages[currentSlide].subtitle}
              </motion.p>
              <motion.div
                initial={{ y: 30, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.7 }}
              >
                <Button 
                  size="lg" 
                  className="bg-primary hover:bg-primary/90 text-white px-8 py-6 text-lg"
                  onClick={() => setShowBookingModal(true)}
                >
                  Plan Your {dynamicContent.name} Experience
                </Button>
              </motion.div>
            </div>
          </div>

          {/* Slide Indicators */}
          <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex space-x-2">
            {dynamicContent.heroImages.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentSlide(index)}
                className={`w-3 h-3 rounded-full transition-all ${
                  currentSlide === index ? 'bg-white w-8' : 'bg-white/50'
                }`}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        </section>

        {/* Quick Info Bar */}
        <section className="bg-primary text-white py-4" aria-label="Quick information">
          <div className="container mx-auto px-4">
            <div className="flex flex-wrap justify-center items-center gap-8 text-sm">
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4" />
                <span>Population: {dynamicContent.destinationInfo.population}</span>
              </div>
              <div className="flex items-center gap-2">
                <Sun className="w-4 h-4" />
                <span>Climate: {dynamicContent.weatherInfo.temperature}</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                <span>Best Time: {dynamicContent.destinationInfo.bestTime}</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4" />
                <span>Elevation: {dynamicContent.destinationInfo.elevation}</span>
              </div>
            </div>
          </div>
        </section>

        {/* Overview Section */}
        <section className="container mx-auto px-4 py-12">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-4">{dynamicContent.tagline}</h2>
            <p className="text-lg text-muted-foreground mb-8">{dynamicContent.description}</p>
            <div className="flex flex-wrap justify-center gap-4">
              {dynamicContent.highlights.map((highlight, index) => (
                <Badge key={index} variant="secondary" className="text-sm py-2 px-4">
                  {highlight}
                </Badge>
              ))}
            </div>
          </div>
        </section>

        {/* Tabs Navigation */}
        <nav className="sticky top-0 z-40 bg-background border-b" role="navigation" aria-label="Content sections">
          <div className="container mx-auto px-4">
            <div className="flex overflow-x-auto scrollbar-hide">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setSelectedTab(tab.id)}
                  className={`px-6 py-4 font-medium transition-all whitespace-nowrap border-b-2 ${
                    selectedTab === tab.id
                      ? 'border-primary text-primary'
                      : 'border-transparent text-muted-foreground hover:text-foreground'
                  }`}
                  aria-selected={selectedTab === tab.id}
                  role="tab"
                >
                  {tab.label}
                  {tab.count && (
                    <Badge variant="secondary" className="ml-2">
                      {tab.count}
                    </Badge>
                  )}
                </button>
              ))}
            </div>
          </div>
        </nav>

        {/* Content Sections */}
        <main className="container mx-auto px-4 py-12">
          <AnimatePresence mode="wait">
            {/* Attractions Tab */}
            {selectedTab === 'attractions' && (
              <motion.div
                key="attractions"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
              >
                {dynamicContent.attractions.map((attraction, index) => (
                  <Card key={index} className="group hover:shadow-xl transition-all duration-300 overflow-hidden">
                    <div className="aspect-video overflow-hidden">
                      <img 
                        src={attraction.image} 
                        alt={attraction.name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                        loading="lazy"
                      />
                    </div>
                    <CardHeader>
                      <div className="flex justify-between items-start">
                        <CardTitle className="text-xl">{attraction.name}</CardTitle>
                        <Badge variant="secondary" className="ml-2">
                          {attraction.category}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-muted-foreground mb-4">{attraction.description}</p>
                      <div className="space-y-2 mb-4">
                        <div className="flex items-center text-sm">
                          <Star className="w-4 h-4 text-yellow-500 mr-2" />
                          <span>{attraction.rating} rating</span>
                        </div>
                        <div className="flex items-center text-sm text-muted-foreground">
                          <Clock className="w-4 h-4 mr-2" />
                          <span>{attraction.duration}</span>
                        </div>
                        <div className="flex items-center text-sm text-muted-foreground">
                          <DollarSign className="w-4 h-4 mr-2" />
                          <span>{attraction.price}</span>
                        </div>
                      </div>
                      <Button 
                        className="w-full"
                        onClick={() => {
                          setSelectedAttraction(attraction.name);
                          setShowBookingModal(true);
                        }}
                      >
                        Book Now
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </motion.div>
            )}

            {/* Activities Tab */}
            {selectedTab === 'activities' && (
              <motion.div
                key="activities"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
              >
                {dynamicContent.activities.map((activity, index) => {
                  const IconComponent = getIcon(activity.icon);
                  return (
                    <Card key={index} className="hover:shadow-lg transition-shadow">
                      <CardHeader>
                        <div className="flex items-start justify-between">
                          <div className="flex items-center">
                            <div className="p-3 bg-primary/10 rounded-lg mr-4">
                              <IconComponent className="w-6 h-6 text-primary" />
                            </div>
                            <div>
                              <CardTitle className="text-lg">{activity.name}</CardTitle>
                              {activity.popular && (
                                <Badge variant="default" className="mt-1 bg-orange-500">
                                  Popular
                                </Badge>
                              )}
                            </div>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <p className="text-muted-foreground mb-4">{activity.description}</p>
                        <div className="flex justify-between items-center mb-4">
                          <span className="text-lg font-semibold text-primary">{activity.price}</span>
                          <span className="text-sm text-muted-foreground">{activity.duration}</span>
                        </div>
                        <Button 
                          variant="outline" 
                          className="w-full hover:bg-primary hover:text-white"
                          onClick={() => {
                            setSelectedAttraction(activity.name);
                            setShowBookingModal(true);
                          }}
                        >
                          Book Activity
                        </Button>
                      </CardContent>
                    </Card>
                  );
                })}
              </motion.div>
            )}

            {/* Accommodation Tab */}
            {selectedTab === 'accommodation' && (
              <motion.div
                key="accommodation"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="space-y-6"
              >
                {dynamicContent.accommodations.map((hotel, index) => (
                  <Card key={index} className="hover:shadow-lg transition-shadow">
                    <CardContent className="p-6">
                      <div className="flex flex-col md:flex-row justify-between">
                        <div className="flex-1">
                          <div className="flex items-center mb-2">
                            <Home className="w-5 h-5 mr-2 text-primary" />
                            <h3 className="text-xl font-semibold">{hotel.name}</h3>
                          </div>
                          <Badge variant="outline" className="mb-3">
                            {hotel.type}
                          </Badge>
                          <div className="flex flex-wrap gap-2 mt-3">
                            {hotel.features.map((feature, idx) => (
                              <Badge key={idx} variant="secondary">
                                {feature}
                              </Badge>
                            ))}
                          </div>
                        </div>
                        <div className="mt-4 md:mt-0 md:ml-8 text-right">
                          <p className="text-2xl font-bold text-primary">{hotel.price}</p>
                          <p className="text-sm text-muted-foreground">per night</p>
                          <Button 
                            className="mt-4"
                            onClick={() => {
                              setSelectedAttraction(hotel.name);
                              setShowBookingModal(true);
                            }}
                          >
                            Check Availability
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </motion.div>
            )}

            {/* Dining Tab */}
            {selectedTab === 'dining' && (
              <motion.div
                key="dining"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="grid md:grid-cols-2 gap-6"
              >
                {dynamicContent.restaurants.map((restaurant, index) => (
                  <Card key={index} className="hover:shadow-lg transition-shadow">
                    <CardContent className="p-6">
                      <div className="flex items-start">
                        <div className="p-3 bg-primary/10 rounded-lg mr-4">
                          <Utensils className="w-6 h-6 text-primary" />
                        </div>
                        <div className="flex-1">
                          <h3 className="text-xl font-semibold mb-1">{restaurant.name}</h3>
                          <p className="text-muted-foreground mb-2">{restaurant.cuisine}</p>
                          <p className="text-sm mb-3">{restaurant.specialty}</p>
                          <Badge variant="outline">{restaurant.priceRange}</Badge>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </motion.div>
            )}

            {/* Transport Tab */}
            {selectedTab === 'transport' && (
              <motion.div
                key="transport"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="grid md:grid-cols-2 gap-8"
              >
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Navigation className="w-5 h-5 mr-2" />
                      Getting Here
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <p className="font-semibold mb-2">From Colombo</p>
                      <p className="text-sm text-muted-foreground">{dynamicContent.transportInfo.fromColombo}</p>
                    </div>
                    <div>
                      <p className="font-semibold mb-2">From Airport</p>
                      <p className="text-sm text-muted-foreground">{dynamicContent.transportInfo.fromAirport}</p>
                    </div>
                    <div>
                      <p className="font-semibold mb-2">Local Transport</p>
                      <p className="text-sm text-muted-foreground">{dynamicContent.transportInfo.localTransport}</p>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Cloud className="w-5 h-5 mr-2" />
                      Weather & Climate
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div>
                        <p className="text-sm text-muted-foreground">Temperature Range</p>
                        <p className="font-semibold">{dynamicContent.weatherInfo.temperature}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Season</p>
                        <p className="font-semibold">{dynamicContent.weatherInfo.season}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Rainfall</p>
                        <p className="font-semibold">{dynamicContent.weatherInfo.rainfall}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )}

            {/* Tips Tab */}
            {selectedTab === 'tips' && (
              <motion.div
                key="tips"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
              >
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Activity className="w-5 h-5 mr-2" />
                      Travel Tips for {dynamicContent.name}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-3">
                      {dynamicContent.tips.map((tip, index) => (
                        <li key={index} className="flex items-start">
                          <ChevronDown className="w-4 h-4 mr-2 mt-0.5 text-primary flex-shrink-0" />
                          <span className="text-sm">{tip}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              </motion.div>
            )}

            {/* FAQs Tab */}
            {selectedTab === 'faqs' && (
              <motion.div
                key="faqs"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
              >
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <HelpCircle className="w-5 h-5 mr-2" />
                      Frequently Asked Questions
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Accordion type="single" collapsible className="w-full">
                      {dynamicContent.faqs.map((faq, index) => (
                        <AccordionItem key={index} value={`item-${index}`}>
                          <AccordionTrigger className="text-left">
                            {faq.question}
                          </AccordionTrigger>
                          <AccordionContent>
                            {faq.answer}
                          </AccordionContent>
                        </AccordionItem>
                      ))}
                    </Accordion>
                  </CardContent>
                </Card>
              </motion.div>
            )}
          </AnimatePresence>
        </main>

        {/* Call to Action Section */}
        <section className="bg-gradient-to-r from-primary to-primary/80 text-white py-16">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Ready to Explore {dynamicContent.name}?
            </h2>
            <p className="text-xl mb-8 max-w-2xl mx-auto">
              Let us help you plan the perfect {dynamicContent.name} experience with expert guides and local insights
            </p>
            <Button 
              size="lg" 
              className="bg-white text-primary hover:bg-gray-100"
              onClick={() => setShowBookingModal(true)}
            >
              Start Planning Your Trip
            </Button>
          </div>
        </section>

        {/* Security & AI-Friendly Footer */}
        <div className="bg-gray-100 py-8">
          <div className="container mx-auto px-4">
            <div className="flex flex-wrap justify-center items-center gap-8 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <Shield className="w-4 h-4" />
                <span>Secure Booking</span>
              </div>
              <div className="flex items-center gap-2">
                <Mic className="w-4 h-4" />
                <span>Voice Assistant Ready</span>
              </div>
              <div className="flex items-center gap-2">
                <Globe className="w-4 h-4" />
                <span>Multi-language Support</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />

      {/* Enhanced Booking Modal */}
      <EnhancedBookingModal
        isOpen={showBookingModal}
        onClose={() => setShowBookingModal(false)}
        preSelectedService={selectedAttraction}
      />
    </>
  );
};

export default DestinationPage;
