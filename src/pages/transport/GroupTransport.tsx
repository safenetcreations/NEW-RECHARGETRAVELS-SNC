import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Bus,
  Users,
  Luggage,
  Calendar,
  MapPin,
  ChevronDown,
  Star,
  Shield,
  Headphones,
  Clock,
  Check,
  Wifi,
  Music,
  Wind,
  Baby,
  Heart,
  Award
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import TransferBookingForm from '@/modules/transfers/components/TransferBookingForm';
import {
  groupTransportHeroService,
  groupTransportVehiclesService,
  groupTransportFeaturesService,
  groupTransportBenefitsService,
  groupTransportSettingsService
} from '@/services/cmsService';

interface HeroSlide {
  image: string;
  title: string;
  subtitle: string;
  description: string;
}

interface VehicleOption {
  name: string;
  capacity: string;
  features: string[];
  price: string;
  image: string;
  popular?: boolean;
}

interface ServiceFeature {
  title: string;
  description: string;
  icon: any;
  highlight: string;
}

interface GroupBenefit {
  title: string;
  description: string;
  icon: any;
}

const GroupTransport = () => {
  const [isBookingExpanded, setIsBookingExpanded] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [heroSlides, setHeroSlides] = useState<HeroSlide[]>([
    {
      image: "https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&q=80",
      title: "Travel Together, Save Together",
      subtitle: "Premium Group Transportation Solutions",
      description: "Comfortable coaches and vans for families, corporate groups, and large tour parties"
    },
    {
      image: "https://images.unsplash.com/photo-1557223562-6c77ef16210f?auto=format&fit=crop&q=80",
      title: "Corporate & Event Transport",
      subtitle: "Professional Fleet for Business",
      description: "Reliable transportation for conferences, weddings, and special events across Sri Lanka"
    },
    {
      image: "https://images.unsplash.com/photo-1474487548417-781cb71495f3?auto=format&fit=crop&q=80",
      title: "School & Educational Tours",
      subtitle: "Safe Journey for Students",
      description: "Certified drivers and well-maintained vehicles for educational excursions"
    }
  ]);

  const [vehicleOptions, setVehicleOptions] = useState<VehicleOption[]>([
    {
      name: "Premium Van",
      capacity: "8-10 Passengers",
      features: ["Air Conditioning", "Comfortable Seats", "Luggage Space", "USB Charging"],
      price: "From $80/day",
      image: "https://images.unsplash.com/photo-1561361513-2d000a50f0dc?auto=format&fit=crop&q=80",
      popular: true
    },
    {
      name: "Mini Coach",
      capacity: "15-20 Passengers",
      features: ["Reclining Seats", "Entertainment System", "Cool Box", "WiFi Available"],
      price: "From $120/day",
      image: "https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&q=80"
    },
    {
      name: "Luxury Coach",
      capacity: "30-35 Passengers",
      features: ["Premium Seats", "AC", "Toilet", "Entertainment", "Refreshments"],
      price: "From $200/day",
      image: "https://images.unsplash.com/photo-1557223562-6c77ef16210f?auto=format&fit=crop&q=80"
    },
    {
      name: "Large Coach",
      capacity: "45-55 Passengers",
      features: ["Spacious Interior", "Luggage Compartment", "PA System", "Safety Features"],
      price: "From $280/day",
      image: "https://images.unsplash.com/photo-1567157577867-05ccb1388e66?auto=format&fit=crop&q=80"
    }
  ]);

  const [serviceFeatures, setServiceFeatures] = useState<ServiceFeature[]>([
    {
      title: "Professional Drivers",
      description: "Experienced, licensed drivers with excellent safety records",
      icon: Users,
      highlight: "English speaking"
    },
    {
      title: "Modern Fleet",
      description: "Well-maintained vehicles with latest comfort features",
      icon: Bus,
      highlight: "Regular servicing"
    },
    {
      title: "Flexible Booking",
      description: "Easy modifications and cancellations up to 48 hours",
      icon: Calendar,
      highlight: "No hidden fees"
    },
    {
      title: "All-Inclusive Pricing",
      description: "Fuel, driver allowances, and parking fees included",
      icon: Shield,
      highlight: "Transparent costs"
    },
    {
      title: "24/7 Support",
      description: "Round-the-clock assistance for your journey",
      icon: Headphones,
      highlight: "Emergency helpline"
    },
    {
      title: "Route Planning",
      description: "Optimized routes for efficiency and comfort",
      icon: MapPin,
      highlight: "Local expertise"
    }
  ]);

  const [groupBenefits, setGroupBenefits] = useState<GroupBenefit[]>([
    {
      title: "Cost Effective",
      description: "Save up to 60% compared to multiple cars",
      icon: Heart
    },
    {
      title: "Eco Friendly",
      description: "Reduce carbon footprint by traveling together",
      icon: Wind
    },
    {
      title: "Social Experience",
      description: "Enjoy the journey together with your group",
      icon: Users
    },
    {
      title: "Stress Free",
      description: "No driving fatigue or navigation worries",
      icon: Shield
    }
  ]);

  const [trustIndicators, setTrustIndicators] = useState({
    rating: "4.8/5",
    reviews: "1,456",
    support: "24/7 Support"
  });

  // Load content from Firebase
  useEffect(() => {
    const loadContent = async () => {
      try {
        // Load all content from Firebase using CMS services
        const [heroData, vehiclesData, featuresData, benefitsData, settingsData] = await Promise.all([
          groupTransportHeroService.getAll(),
          groupTransportVehiclesService.getAll(),
          groupTransportFeaturesService.getAll(),
          groupTransportBenefitsService.getAll(),
          groupTransportSettingsService.getActive(),
        ]);

        // Update hero slides
        if (heroData && heroData.length > 0) {
          setHeroSlides(heroData.map(slide => ({
            image: slide.image,
            title: slide.title,
            subtitle: slide.subtitle,
            description: slide.description,
          })));
        }

        // Update vehicle options
        if (vehiclesData && vehiclesData.length > 0) {
          setVehicleOptions(vehiclesData.map(vehicle => ({
            name: vehicle.name,
            capacity: vehicle.capacity,
            features: vehicle.features,
            price: vehicle.price,
            image: vehicle.image,
            popular: vehicle.popular,
          })));
        }

        // Update service features with icon mapping
        if (featuresData && featuresData.length > 0) {
          const iconMap: { [key: string]: any } = {
            'Users': Users,
            'Bus': Bus,
            'Calendar': Calendar,
            'Shield': Shield,
            'Headphones': Headphones,
            'MapPin': MapPin,
            'Clock': Clock,
            'Luggage': Luggage,
            'Wifi': Wifi,
            'Music': Music,
            'Wind': Wind,
            'Baby': Baby,
            'Heart': Heart,
            'Award': Award
          };

          setServiceFeatures(featuresData.map(feature => ({
            title: feature.title,
            description: feature.description,
            icon: iconMap[feature.icon] || Bus,
            highlight: feature.highlight,
          })));
        }

        // Update group benefits with icon mapping
        if (benefitsData && benefitsData.length > 0) {
          const iconMap: { [key: string]: any } = {
            'Heart': Heart,
            'Wind': Wind,
            'Users': Users,
            'Shield': Shield
          };

          setGroupBenefits(benefitsData.map(benefit => ({
            title: benefit.title,
            description: benefit.description,
            icon: iconMap[benefit.icon] || Users,
          })));
        }

        // Update trust indicators
        if (settingsData) {
          setTrustIndicators(settingsData.trustIndicators);
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
        <title>Group Transport in Sri Lanka - Coaches, Vans & Buses | Recharge Travels</title>
        <meta name="description" content="Premium group transportation for families, corporate events, and tours. Modern fleet from 8 to 55 passengers. Professional drivers, competitive rates." />
      </Helmet>

      <Header />

      <div className="min-h-screen bg-background">
        {/* Hero Section with Group Booking */}
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
                      <span>Safety Certified Fleet</span>
                    </div>
                    <div className="flex items-center gap-2 text-white/90">
                      <Headphones className="w-5 h-5" />
                      <span>{trustIndicators.support}</span>
                    </div>
                  </motion.div>
                </motion.div>

                {/* Group Booking Widget */}
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
                        {/* Vehicle Type */}
                        <div className="lg:col-span-1">
                          <label className="block text-sm font-semibold text-gray-700 mb-2">Vehicle Type</label>
                          <div className="relative">
                            <Bus className="absolute left-3 top-3.5 w-5 h-5 text-gray-400" />
                            <input
                              type="text"
                              placeholder="Select vehicle"
                              className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                              onClick={() => setIsBookingExpanded(true)}
                            />
                          </div>
                        </div>

                        {/* Pickup Location */}
                        <div className="lg:col-span-1">
                          <label className="block text-sm font-semibold text-gray-700 mb-2">Pickup From</label>
                          <div className="relative">
                            <MapPin className="absolute left-3 top-3.5 w-5 h-5 text-gray-400" />
                            <input
                              type="text"
                              placeholder="Location"
                              className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                              onClick={() => setIsBookingExpanded(true)}
                            />
                          </div>
                        </div>

                        {/* Date */}
                        <div className="lg:col-span-1">
                          <label className="block text-sm font-semibold text-gray-700 mb-2">Travel Date</label>
                          <div className="relative">
                            <Calendar className="absolute left-3 top-3.5 w-5 h-5 text-gray-400" />
                            <input
                              type="text"
                              placeholder="Select date"
                              className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
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
                              placeholder="Passengers"
                              className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                              onClick={() => setIsBookingExpanded(true)}
                            />
                          </div>
                        </div>

                        {/* Book Button */}
                        <div className="lg:col-span-1">
                          <Button
                            onClick={() => setIsBookingExpanded(true)}
                            className="w-full bg-gradient-to-r from-green-600 to-teal-600 hover:from-green-700 hover:to-teal-700 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg"
                          >
                            <Bus className="w-5 h-5 mr-2" />
                            Get Quote
                          </Button>
                        </div>
                      </div>

                      {/* Popular Routes */}
                      <div className="mt-6 flex flex-wrap items-center gap-4">
                        <span className="text-sm font-medium text-gray-600">Popular group trips:</span>
                        <div className="flex flex-wrap gap-2">
                          {['Corporate Events', 'School Tours', 'Wedding Transport', 'Airport Groups'].map((trip) => (
                            <button
                              key={trip}
                              className="text-sm px-4 py-2 bg-green-100 hover:bg-green-200 text-green-700 rounded-full transition-colors"
                              onClick={() => setIsBookingExpanded(true)}
                            >
                              {trip}
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
                      <div className="bg-gradient-to-r from-green-600 to-teal-600 p-6 text-white">
                        <div className="flex items-center justify-between">
                          <div>
                            <h3 className="text-2xl font-bold mb-1">Book Group Transport</h3>
                            <p className="text-green-100">Professional drivers • Modern fleet • Best group rates</p>
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
                    { icon: Bus, title: "Modern Fleet", desc: "8-55 passengers" },
                    { icon: Shield, title: "Fully Insured", desc: "Complete coverage" },
                    { icon: Users, title: "Pro Drivers", desc: "Licensed & trained" },
                    { icon: Clock, title: "Flexible Hours", desc: "Day & multi-day" }
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
                className={`w-2 h-2 rounded-full transition-all duration-300 ${currentSlide === index ? 'w-8 bg-white' : 'bg-white/50'
                  }`}
              />
            ))}
          </div>
        </section>

        {/* Vehicle Options Section */}
        <div className="bg-gray-50 py-16">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold mb-4">Our Group Transport Fleet</h2>
              <p className="text-xl text-gray-600">Choose the perfect vehicle for your group size and comfort needs</p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
              {vehicleOptions.map((vehicle, index) => (
                <Card key={index} className={`hover:shadow-xl transition-all cursor-pointer ${vehicle.popular ? 'border-green-500 border-2' : ''}`}>
                  {vehicle.popular && (
                    <div className="bg-green-500 text-white text-center py-2 text-sm font-semibold">
                      MOST POPULAR
                    </div>
                  )}
                  <div className="aspect-w-16 aspect-h-9 relative h-48">
                    <img
                      src={vehicle.image}
                      alt={vehicle.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <CardHeader>
                    <CardTitle className="text-xl">{vehicle.name}</CardTitle>
                    <div className="flex items-center justify-between mt-2">
                      <span className="text-gray-600 flex items-center gap-1">
                        <Users className="w-4 h-4" />
                        {vehicle.capacity}
                      </span>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2 mb-4">
                      {vehicle.features.map((feature, idx) => (
                        <li key={idx} className="flex items-center gap-2">
                          <Check className="w-4 h-4 text-green-500 flex-shrink-0" />
                          <span className="text-sm text-gray-700">{feature}</span>
                        </li>
                      ))}
                    </ul>
                    <div className="text-center">
                      <p className="text-2xl font-bold text-green-600 mb-3">{vehicle.price}</p>
                      <Button
                        className="w-full bg-green-600 hover:bg-green-700"
                        onClick={() => setIsBookingExpanded(true)}
                      >
                        Book This Vehicle
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>

        {/* Service Features Section */}
        <div className="container mx-auto px-4 py-16">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4">Why Choose Our Group Transport?</h2>
            <p className="text-xl text-gray-600">Experience the difference with our premium service</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {serviceFeatures.map((feature, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-center mb-4">
                    <div className="p-3 bg-green-100 rounded-full">
                      <feature.icon className="w-8 h-8 text-green-600" />
                    </div>
                    <CardTitle className="ml-3">{feature.title}</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground mb-4">{feature.description}</p>
                  <div className="flex items-center text-sm text-green-600 font-semibold">
                    <Check className="w-4 h-4 mr-2" />
                    {feature.highlight}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Group Benefits Section */}
        <div className="bg-gradient-to-br from-green-50 to-teal-50 py-16">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold mb-4">Benefits of Group Travel</h2>
              <p className="text-xl text-gray-600">More than just transportation</p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-5xl mx-auto">
              {groupBenefits.map((benefit, index) => (
                <div key={index} className="text-center">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-white rounded-full shadow-lg mb-4">
                    <benefit.icon className="w-8 h-8 text-green-600" />
                  </div>
                  <h3 className="font-bold text-lg mb-2">{benefit.title}</h3>
                  <p className="text-gray-600">{benefit.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Special Services */}
        <div className="container mx-auto px-4 py-16">
          <div className="bg-gradient-to-r from-green-600 to-teal-600 rounded-3xl p-8 md:p-12 text-white">
            <div className="max-w-4xl mx-auto text-center">
              <h2 className="text-3xl md:text-4xl font-bold mb-6">Special Group Services</h2>
              <div className="grid md:grid-cols-3 gap-8 mb-8">
                <div>
                  <Baby className="w-12 h-12 mx-auto mb-3" />
                  <h3 className="font-semibold mb-2">Child Safety</h3>
                  <p className="text-green-100">Baby seats and booster seats available on request</p>
                </div>
                <div>
                  <Wifi className="w-12 h-12 mx-auto mb-3" />
                  <h3 className="font-semibold mb-2">Stay Connected</h3>
                  <p className="text-green-100">WiFi available in selected vehicles</p>
                </div>
                <div>
                  <Music className="w-12 h-12 mx-auto mb-3" />
                  <h3 className="font-semibold mb-2">Entertainment</h3>
                  <p className="text-green-100">Audio systems for music and announcements</p>
                </div>
              </div>
              <Button
                size="lg"
                className="bg-white text-green-600 hover:bg-gray-100"
                onClick={() => setIsBookingExpanded(true)}
              >
                Book Your Group Transport
              </Button>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
};

export default GroupTransport;