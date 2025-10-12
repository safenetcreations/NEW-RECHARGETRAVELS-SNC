import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Car, 
  User, 
  MapPin, 
  Star, 
  Calendar, 
  Users, 
  ChevronDown, 
  Shield, 
  Headphones,
  Clock,
  Route,
  Camera,
  Award,
  Check,
  Heart,
  Globe
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import TransferBookingForm from '@/modules/transfers/components/TransferBookingForm';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';

interface HeroSlide {
  image: string;
  title: string;
  subtitle: string;
  description: string;
}

interface TourPackage {
  name: string;
  duration: string;
  price: string;
  highlights: string[];
  popular?: boolean;
}

interface ServiceFeature {
  title: string;
  description: string;
  icon: any;
  benefit: string;
}

const PrivateTours = () => {
  const [isBookingExpanded, setIsBookingExpanded] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [heroSlides, setHeroSlides] = useState<HeroSlide[]>([
    {
      image: "https://images.unsplash.com/photo-1588979355313-6711a095465f?auto=format&fit=crop&q=80",
      title: "Discover Sri Lanka Your Way",
      subtitle: "Private Tours with Local Experts",
      description: "Create unforgettable memories with personalized tours guided by experienced locals"
    },
    {
      image: "https://images.unsplash.com/photo-1567157577867-05ccb1388e66?auto=format&fit=crop&q=80",
      title: "Ancient Cities & Sacred Sites",
      subtitle: "Journey Through History",
      description: "Explore UNESCO World Heritage sites with knowledgeable guides who bring history to life"
    },
    {
      image: "https://images.unsplash.com/photo-1552832230-c0197dd311b5?auto=format&fit=crop&q=80",
      title: "Wildlife & Nature Adventures",
      subtitle: "Experience the Wild Side",
      description: "From elephants to leopards, discover Sri Lanka's incredible biodiversity"
    }
  ]);

  const [tourPackages, setTourPackages] = useState<TourPackage[]>([
    {
      name: "Cultural Triangle Tour",
      duration: "3 Days",
      price: "$350",
      highlights: ["Sigiriya Rock", "Dambulla Cave Temple", "Polonnaruwa", "Minneriya Safari"],
      popular: true
    },
    {
      name: "Hill Country Explorer",
      duration: "2 Days",
      price: "$280",
      highlights: ["Kandy Temple", "Tea Plantations", "Nine Arch Bridge", "Little Adam's Peak"]
    },
    {
      name: "Southern Coast Journey",
      duration: "2 Days",
      price: "$260",
      highlights: ["Galle Fort", "Mirissa Whale Watching", "Turtle Hatchery", "Beach Time"]
    },
    {
      name: "Wildlife Safari Special",
      duration: "2 Days",
      price: "$320",
      highlights: ["Yala National Park", "Udawalawe Elephants", "Bird Watching", "Bundala"]
    },
    {
      name: "Ancient Cities Heritage",
      duration: "4 Days",
      price: "$450",
      highlights: ["Anuradhapura", "Mihintale", "Sigiriya", "Polonnaruwa"],
      popular: true
    },
    {
      name: "Full Island Discovery",
      duration: "7 Days",
      price: "$850",
      highlights: ["All Major Attractions", "Beach & Mountains", "Wildlife & Culture", "Customizable"]
    }
  ]);

  const [serviceFeatures, setServiceFeatures] = useState<ServiceFeature[]>([
    {
      title: "Expert Local Guides",
      description: "Knowledgeable guides who share insider stories and hidden gems",
      icon: User,
      benefit: "Authentic experiences"
    },
    {
      title: "Flexible Itineraries",
      description: "Customize your tour on the go - stay longer at places you love",
      icon: Route,
      benefit: "Your pace, your way"
    },
    {
      title: "Premium Vehicles",
      description: "Air-conditioned vehicles with Wi-Fi and refreshments",
      icon: Car,
      benefit: "Travel in comfort"
    },
    {
      title: "Photography Stops",
      description: "Unlimited photo stops at scenic viewpoints and Instagram spots",
      icon: Camera,
      benefit: "Capture memories"
    },
    {
      title: "Cultural Immersion",
      description: "Visit local villages, try authentic food, meet friendly locals",
      icon: Heart,
      benefit: "Connect with culture"
    },
    {
      title: "Safety First",
      description: "Licensed guides, insured vehicles, and 24/7 support",
      icon: Shield,
      benefit: "Peace of mind"
    }
  ]);

  const [trustIndicators, setTrustIndicators] = useState({
    rating: "4.9/5",
    reviews: "1,892",
    support: "24/7 Support"
  });

  // Load content from Firebase
  useEffect(() => {
    const loadContent = async () => {
      try {
        const docRef = doc(db, 'page-content', 'private-tours');
        const docSnap = await getDoc(docRef);
        
        if (docSnap.exists()) {
          const data = docSnap.data();
          if (data.heroSlides) setHeroSlides(data.heroSlides);
          if (data.tourPackages) setTourPackages(data.tourPackages);
          if (data.serviceFeatures) {
            // Convert icon strings to actual icon components
            const iconMap: { [key: string]: any } = {
              'User': User,
              'Route': Route,
              'Car': Car,
              'Camera': Camera,
              'Heart': Heart,
              'Shield': Shield,
              'Clock': Clock,
              'MapPin': MapPin,
              'Star': Star,
              'Award': Award,
              'Globe': Globe
            };
            
            setServiceFeatures(data.serviceFeatures.map((feature: any) => ({
              ...feature,
              icon: iconMap[feature.icon] || Car
            })));
          }
          if (data.trustIndicators) setTrustIndicators(data.trustIndicators);
        }
      } catch (error) {
        console.error('Error loading content:', error);
      }
    };

    loadContent();
  }, []);

  // Auto-rotate slides
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [heroSlides.length]);

  // Preload images
  useEffect(() => {
    heroSlides.forEach((slide) => {
      const img = new Image();
      img.src = slide.image;
    });
  }, [heroSlides]);

  return (
    <>
      <Helmet>
        <title>Private Tours in Sri Lanka - Customized Travel Experiences | Recharge Travels</title>
        <meta name="description" content="Explore Sri Lanka with personalized private tours. Expert local guides, flexible itineraries, premium vehicles. Create your perfect journey today!" />
      </Helmet>
      
      <Header />
      
      <div className="min-h-screen bg-background">
        {/* Hero Section with Tour Booking */}
        <section className="relative w-full min-h-screen overflow-hidden">
          {/* Background Slideshow */}
          <AnimatePresence mode="wait">
            <motion.div
              key={currentSlide}
              initial={{ opacity: 0, scale: 1.05 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 2, ease: "easeInOut" }}
              className="absolute inset-0 z-0"
            >
              <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/30 to-black/60 z-10" />
              <img
                src={heroSlides[currentSlide].image}
                alt={heroSlides[currentSlide].title}
                className="w-full h-full object-cover"
              />
            </motion.div>
          </AnimatePresence>

          {/* Hero Content */}
          <div className="relative z-20 min-h-screen flex flex-col justify-center">
            <div className="container mx-auto px-4 lg:px-8">
              <div className="max-w-7xl mx-auto">
                {/* Hero Text */}
                <motion.div
                  initial={{ opacity: 0, y: 50 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8 }}
                  className="text-center mb-12"
                >
                  <motion.h1 
                    key={currentSlide}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="text-5xl md:text-7xl lg:text-8xl font-bold text-white mb-6 font-playfair"
                  >
                    {heroSlides[currentSlide].title}
                  </motion.h1>
                  
                  <motion.p 
                    key={`subtitle-${currentSlide}`}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                    className="text-2xl md:text-3xl text-white/90 mb-4 font-light"
                  >
                    {heroSlides[currentSlide].subtitle}
                  </motion.p>
                  
                  <motion.p 
                    key={`desc-${currentSlide}`}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.4 }}
                    className="text-lg md:text-xl text-white/80 max-w-3xl mx-auto mb-8"
                  >
                    {heroSlides[currentSlide].description}
                  </motion.p>

                  {/* Trust Indicators */}
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.6 }}
                    className="flex flex-wrap items-center justify-center gap-6 mb-12"
                  >
                    <div className="flex items-center gap-2 text-white/90">
                      <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                      <span className="font-semibold">{trustIndicators.rating}</span>
                      <span className="text-white/70">from {trustIndicators.reviews} reviews</span>
                    </div>
                    <div className="flex items-center gap-2 text-white/90">
                      <Award className="w-5 h-5" />
                      <span>TripAdvisor Excellence</span>
                    </div>
                    <div className="flex items-center gap-2 text-white/90">
                      <Headphones className="w-5 h-5" />
                      <span>{trustIndicators.support}</span>
                    </div>
                  </motion.div>
                </motion.div>

                {/* Tour Booking Widget */}
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.4 }}
                  className="relative"
                >
                  {!isBookingExpanded ? (
                    /* Compact Booking Widget */
                    <div className="bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl p-8 max-w-5xl mx-auto">
                      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 items-end">
                        {/* Tour Type */}
                        <div className="lg:col-span-1">
                          <label className="block text-sm font-semibold text-gray-700 mb-2">Tour Type</label>
                          <div className="relative">
                            <Globe className="absolute left-3 top-3.5 w-5 h-5 text-gray-400" />
                            <input
                              type="text"
                              placeholder="Select tour"
                              className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                              onClick={() => setIsBookingExpanded(true)}
                            />
                          </div>
                        </div>

                        {/* Start Location */}
                        <div className="lg:col-span-1">
                          <label className="block text-sm font-semibold text-gray-700 mb-2">Start From</label>
                          <div className="relative">
                            <MapPin className="absolute left-3 top-3.5 w-5 h-5 text-gray-400" />
                            <input
                              type="text"
                              placeholder="Pickup location"
                              className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                              onClick={() => setIsBookingExpanded(true)}
                            />
                          </div>
                        </div>

                        {/* Date */}
                        <div className="lg:col-span-1">
                          <label className="block text-sm font-semibold text-gray-700 mb-2">Tour Date</label>
                          <div className="relative">
                            <Calendar className="absolute left-3 top-3.5 w-5 h-5 text-gray-400" />
                            <input
                              type="text"
                              placeholder="Select date"
                              className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                              onClick={() => setIsBookingExpanded(true)}
                            />
                          </div>
                        </div>

                        {/* Group Size */}
                        <div className="lg:col-span-1">
                          <label className="block text-sm font-semibold text-gray-700 mb-2">Group Size</label>
                          <div className="relative">
                            <Users className="absolute left-3 top-3.5 w-5 h-5 text-gray-400" />
                            <input
                              type="text"
                              placeholder="Guests"
                              className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                              onClick={() => setIsBookingExpanded(true)}
                            />
                          </div>
                        </div>

                        {/* Book Button */}
                        <div className="lg:col-span-1">
                          <Button
                            onClick={() => setIsBookingExpanded(true)}
                            className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg"
                          >
                            <Route className="w-5 h-5 mr-2" />
                            Book Tour
                          </Button>
                        </div>
                      </div>

                      {/* Popular Tours */}
                      <div className="mt-6 flex flex-wrap items-center gap-4">
                        <span className="text-sm font-medium text-gray-600">Popular tours:</span>
                        <div className="flex flex-wrap gap-2">
                          {['Cultural Triangle', 'Hill Country', 'Wildlife Safari', 'Ancient Cities'].map((tour) => (
                            <button
                              key={tour}
                              className="text-sm px-4 py-2 bg-purple-100 hover:bg-purple-200 text-purple-700 rounded-full transition-colors"
                              onClick={() => setIsBookingExpanded(true)}
                            >
                              {tour}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  ) : (
                    /* Expanded Booking Form */
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl overflow-hidden max-w-6xl mx-auto"
                    >
                      {/* Form Header */}
                      <div className="bg-gradient-to-r from-purple-600 to-pink-600 p-6 text-white">
                        <div className="flex items-center justify-between">
                          <div>
                            <h3 className="text-2xl font-bold mb-1">Book Your Private Tour</h3>
                            <p className="text-purple-100">Expert guides • Flexible itineraries • Unforgettable experiences</p>
                          </div>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => setIsBookingExpanded(false)}
                            className="text-white hover:bg-white/10 rounded-full"
                          >
                            <ChevronDown className="w-6 h-6 rotate-180" />
                          </Button>
                        </div>
                      </div>
                      
                      {/* Form Content */}
                      <div className="p-6">
                        <TransferBookingForm />
                      </div>
                    </motion.div>
                  )}
                </motion.div>

                {/* Feature Highlights */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.6 }}
                  className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto"
                >
                  {[
                    { icon: User, title: "Expert Guides", desc: "Local knowledge" },
                    { icon: Route, title: "Custom Routes", desc: "Your interests first" },
                    { icon: Clock, title: "Flexible Timing", desc: "No rush, no stress" },
                    { icon: Camera, title: "Photo Stops", desc: "Capture memories" }
                  ].map((feature, index) => (
                    <div key={index} className="text-center text-white">
                      <div className="inline-flex items-center justify-center w-12 h-12 bg-white/20 backdrop-blur-sm rounded-full mb-3">
                        <feature.icon className="w-6 h-6" />
                      </div>
                      <h4 className="font-semibold mb-1">{feature.title}</h4>
                      <p className="text-sm text-white/70">{feature.desc}</p>
                    </div>
                  ))}
                </motion.div>
              </div>
            </div>
          </div>

          {/* Slide Indicators */}
          <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex gap-2 z-30">
            {heroSlides.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentSlide(index)}
                className={`w-2 h-2 rounded-full transition-all duration-300 ${
                  currentSlide === index ? 'w-8 bg-white' : 'bg-white/50'
                }`}
              />
            ))}
          </div>
        </section>

        {/* Tour Packages Section */}
        <div className="bg-gray-50 py-16">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold mb-4">Popular Private Tour Packages</h2>
              <p className="text-xl text-gray-600">Choose from our curated experiences or create your own</p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
              {tourPackages.map((tour, index) => (
                <Card key={index} className={`hover:shadow-xl transition-all cursor-pointer ${tour.popular ? 'border-purple-500 border-2' : ''}`}>
                  {tour.popular && (
                    <div className="bg-purple-500 text-white text-center py-2 text-sm font-semibold">
                      MOST POPULAR
                    </div>
                  )}
                  <CardHeader>
                    <CardTitle className="text-xl">{tour.name}</CardTitle>
                    <div className="flex items-center justify-between mt-2">
                      <span className="text-gray-600 flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        {tour.duration}
                      </span>
                      <span className="text-2xl font-bold text-purple-600">{tour.price}</span>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="font-semibold mb-3">Tour Highlights:</p>
                    <ul className="space-y-2">
                      {tour.highlights.map((highlight, idx) => (
                        <li key={idx} className="flex items-start gap-2">
                          <Check className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                          <span className="text-sm text-gray-700">{highlight}</span>
                        </li>
                      ))}
                    </ul>
                    <Button 
                      className="w-full mt-6 bg-purple-600 hover:bg-purple-700"
                      onClick={() => setIsBookingExpanded(true)}
                    >
                      Book This Tour
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>

            <div className="text-center mt-8">
              <p className="text-gray-600 mb-4">Don't see what you're looking for?</p>
              <Button 
                variant="outline" 
                size="lg"
                onClick={() => setIsBookingExpanded(true)}
                className="border-purple-600 text-purple-600 hover:bg-purple-50"
              >
                Create Custom Tour
              </Button>
            </div>
          </div>
        </div>

        {/* Service Features Section */}
        <div className="container mx-auto px-4 py-16">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4">Why Choose Our Private Tours?</h2>
            <p className="text-xl text-gray-600">Experience Sri Lanka like never before</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {serviceFeatures.map((feature, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-center mb-4">
                    <div className="p-3 bg-purple-100 rounded-full">
                      <feature.icon className="w-8 h-8 text-purple-600" />
                    </div>
                    <CardTitle className="ml-3">{feature.title}</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground mb-4">{feature.description}</p>
                  <div className="flex items-center text-sm text-purple-600 font-semibold">
                    <Star className="w-4 h-4 mr-2" />
                    {feature.benefit}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Call to Action Section */}
        <div className="bg-gradient-to-r from-purple-600 to-pink-600 py-16">
          <div className="container mx-auto px-4 text-center text-white">
            <h2 className="text-4xl font-bold mb-6">Ready to Start Your Adventure?</h2>
            <p className="text-xl mb-8 max-w-2xl mx-auto">
              Let us create the perfect Sri Lankan journey tailored just for you
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                size="lg" 
                className="bg-white text-purple-600 hover:bg-gray-100"
                onClick={() => setIsBookingExpanded(true)}
              >
                Book Private Tour
              </Button>
              <Button 
                size="lg" 
                variant="outline" 
                className="border-white text-white hover:bg-white/10"
              >
                <Headphones className="w-5 h-5 mr-2" />
                Talk to Expert
              </Button>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
};

export default PrivateTours;