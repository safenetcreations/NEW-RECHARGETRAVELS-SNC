
import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { motion, AnimatePresence } from 'framer-motion';
import { Plane, Car, Clock, Shield, MapPin, Calendar, Users, ChevronDown, Star, Headphones, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import TransferBookingForm from '@/modules/transfers/components/TransferBookingForm';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';

const AirportTransfers = () => {
  const [isBookingExpanded, setIsBookingExpanded] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [heroSlides, setHeroSlides] = useState([
    {
      image: "https://images.unsplash.com/photo-1436491865332-7a61a109cc05?auto=format&fit=crop&q=80",
      title: "Premium Airport Transfers",
      subtitle: "Your Journey Begins with Comfort",
      description: "Professional drivers, luxury vehicles, and seamless transfers to and from Bandaranaike International Airport"
    },
    {
      image: "https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?auto=format&fit=crop&q=80",
      title: "24/7 Airport Service",
      subtitle: "Available Round the Clock",
      description: "We're ready whenever you land - day or night. Flight tracking ensures we're there when you need us"
    },
    {
      image: "https://images.unsplash.com/photo-1474487548417-781cb71495f3?auto=format&fit=crop&q=80",
      title: "Meet & Greet Service",
      subtitle: "VIP Treatment from Arrival",
      description: "Your driver awaits with a name board, assists with luggage, and ensures a smooth start to your Sri Lankan adventure"
    }
  ]);
  const [serviceFeatures, setServiceFeatures] = useState([
    {
      title: "Meet & Greet Service",
      description: "Your driver will be waiting at arrivals with a name board",
      icon: Users,
      feature: "Complimentary waiting time"
    },
    {
      title: "Flight Monitoring",
      description: "We track your flight and adjust pickup time accordingly",
      icon: Plane,
      feature: "No extra charge for delays"
    },
    {
      title: "24/7 Service",
      description: "Available round the clock for all flight times",
      icon: Clock,
      feature: "Night service available"
    },
    {
      title: "Fixed Pricing",
      description: "No hidden charges or surge pricing",
      icon: Shield,
      feature: "Transparent pricing"
    },
    {
      title: "Premium Vehicles",
      description: "Modern, air-conditioned fleet with professional drivers",
      icon: Car,
      feature: "Luxury options available"
    },
    {
      title: "Free Cancellation",
      description: "Cancel up to 24 hours before pickup",
      icon: Shield,
      feature: "Flexible booking"
    }
  ]);
  const [priceRoutes, setPriceRoutes] = useState([
    { destination: "Colombo City", price: "$35", duration: "45 mins" },
    { destination: "Negombo", price: "$20", duration: "20 mins" },
    { destination: "Kandy", price: "$85", duration: "3 hours" },
    { destination: "Galle", price: "$95", duration: "3.5 hours" },
    { destination: "Bentota", price: "$75", duration: "2.5 hours" },
    { destination: "Sigiriya", price: "$110", duration: "4 hours" },
    { destination: "Ella", price: "$135", duration: "5.5 hours" },
    { destination: "Mirissa", price: "$105", duration: "3.5 hours" }
  ]);
  const [trustIndicators, setTrustIndicators] = useState({
    rating: "4.9/5",
    reviews: "2,847",
    support: "24/7 Support"
  });

  // Load content from Firebase
  useEffect(() => {
    const loadContent = async () => {
      try {
        const docRef = doc(db, 'page-content', 'airport-transfers');
        const docSnap = await getDoc(docRef);
        
        if (docSnap.exists()) {
          const data = docSnap.data();
          if (data.heroSlides) setHeroSlides(data.heroSlides);
          if (data.serviceFeatures) {
            // Convert icon strings to actual icon components
            const iconMap: { [key: string]: any } = {
              'Users': Users,
              'Plane': Plane,
              'Clock': Clock,
              'Shield': Shield,
              'Car': Car,
              'Check': Check
            };
            
            setServiceFeatures(data.serviceFeatures.map((feature: any) => ({
              ...feature,
              icon: iconMap[feature.icon] || Car
            })));
          }
          if (data.priceRoutes) setPriceRoutes(data.priceRoutes);
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
        <title>Airport Transfers in Sri Lanka - Recharge Travels</title>
        <meta name="description" content="Premium airport transfers to and from Colombo Airport. Professional drivers, luxury vehicles, 24/7 service." />
      </Helmet>
      
      <Header />
      
      <div className="min-h-screen bg-background">
        {/* Hero Section with Transfer Booking */}
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
                      <Shield className="w-5 h-5" />
                      <span>100% Safe & Secure</span>
                    </div>
                    <div className="flex items-center gap-2 text-white/90">
                      <Headphones className="w-5 h-5" />
                      <span>{trustIndicators.support}</span>
                    </div>
                  </motion.div>
                </motion.div>

                {/* Transfer Booking Widget */}
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.4 }}
                  className="relative"
                >
                  {!isBookingExpanded ? (
                    /* Elegant Compact Booking Widget */
                    <div className="bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl p-8 max-w-5xl mx-auto">
                      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 items-end">
                        {/* Pickup Location */}
                        <div className="lg:col-span-1">
                          <label className="block text-sm font-semibold text-gray-700 mb-2">From</label>
                          <div className="relative">
                            <MapPin className="absolute left-3 top-3.5 w-5 h-5 text-gray-400" />
                            <input
                              type="text"
                              placeholder="Airport / Location"
                              className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                              onClick={() => setIsBookingExpanded(true)}
                            />
                          </div>
                        </div>

                        {/* Destination */}
                        <div className="lg:col-span-1">
                          <label className="block text-sm font-semibold text-gray-700 mb-2">To</label>
                          <div className="relative">
                            <MapPin className="absolute left-3 top-3.5 w-5 h-5 text-gray-400" />
                            <input
                              type="text"
                              placeholder="Hotel / Destination"
                              className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                              onClick={() => setIsBookingExpanded(true)}
                            />
                          </div>
                        </div>

                        {/* Date */}
                        <div className="lg:col-span-1">
                          <label className="block text-sm font-semibold text-gray-700 mb-2">Date</label>
                          <div className="relative">
                            <Calendar className="absolute left-3 top-3.5 w-5 h-5 text-gray-400" />
                            <input
                              type="text"
                              placeholder="Select date"
                              className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                              onClick={() => setIsBookingExpanded(true)}
                            />
                          </div>
                        </div>

                        {/* Passengers */}
                        <div className="lg:col-span-1">
                          <label className="block text-sm font-semibold text-gray-700 mb-2">Passengers</label>
                          <div className="relative">
                            <Users className="absolute left-3 top-3.5 w-5 h-5 text-gray-400" />
                            <input
                              type="text"
                              placeholder="Guests"
                              className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                              onClick={() => setIsBookingExpanded(true)}
                            />
                          </div>
                        </div>

                        {/* Search Button */}
                        <div className="lg:col-span-1">
                          <Button
                            onClick={() => setIsBookingExpanded(true)}
                            className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg"
                          >
                            <Plane className="w-5 h-5 mr-2" />
                            Book Transfer
                          </Button>
                        </div>
                      </div>

                      {/* Popular Routes */}
                      <div className="mt-6 flex flex-wrap items-center gap-4">
                        <span className="text-sm font-medium text-gray-600">Popular routes:</span>
                        <div className="flex flex-wrap gap-2">
                          {['Airport → Colombo', 'Airport → Kandy', 'Airport → Galle', 'Airport → Negombo'].map((route) => (
                            <button
                              key={route}
                              className="text-sm px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-full transition-colors"
                              onClick={() => setIsBookingExpanded(true)}
                            >
                              {route}
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
                      <div className="bg-gradient-to-r from-blue-600 to-blue-700 p-6 text-white">
                        <div className="flex items-center justify-between">
                          <div>
                            <h3 className="text-2xl font-bold mb-1">Book Your Airport Transfer</h3>
                            <p className="text-blue-100">Professional drivers • Meet & greet service • Flight tracking included</p>
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
                    { icon: Plane, title: "Flight Tracking", desc: "Real-time monitoring" },
                    { icon: Car, title: "Premium Fleet", desc: "Luxury vehicles only" },
                    { icon: Clock, title: "Always On Time", desc: "Punctuality guaranteed" },
                    { icon: Shield, title: "Fully Insured", desc: "Complete coverage" }
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

        {/* Additional Services Section */}
        <div className="container mx-auto px-4 py-16">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4">Why Choose Our Airport Transfers?</h2>
            <p className="text-xl text-gray-600">Experience the difference with our premium service</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {serviceFeatures.map((service, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-center mb-4">
                    <div className="p-3 bg-blue-100 rounded-full">
                      <service.icon className="w-8 h-8" />
                    </div>
                    <CardTitle className="ml-3">{service.title}</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground mb-4">{service.description}</p>
                  <div className="flex items-center text-sm text-blue-600 font-semibold">
                    <Check className="w-4 h-4 mr-2" />
                    {service.feature}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Pricing Section */}
        <div className="bg-gray-50 py-16">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold mb-4">Transparent Pricing</h2>
              <p className="text-xl text-gray-600">Fixed rates from the airport to popular destinations</p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
              {priceRoutes.map((route, index) => (
                <Card key={index} className="text-center hover:shadow-lg transition-shadow cursor-pointer" onClick={() => setIsBookingExpanded(true)}>
                  <CardContent className="pt-6">
                    <h3 className="font-bold text-lg mb-2">{route.destination}</h3>
                    <p className="text-3xl font-bold text-blue-600 mb-2">{route.price}</p>
                    <p className="text-gray-600 text-sm mb-4">{route.duration}</p>
                    <Button className="w-full" size="sm">Book Now</Button>
                  </CardContent>
                </Card>
              ))}
            </div>

            <p className="text-center mt-8 text-gray-600">
              * Prices are for sedan vehicles (1-3 passengers). Larger vehicles available at additional cost.
            </p>
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
};

export default AirportTransfers;
