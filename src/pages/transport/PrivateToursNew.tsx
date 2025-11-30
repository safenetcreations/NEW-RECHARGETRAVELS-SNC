import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import Header from '@/components/Header';
import RechargeFooter from '@/components/ui/RechargeFooter';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Car, MapPin, Star, Shield, Clock, Users, ChevronLeft, ChevronRight,
  Phone, MessageCircle, Award, Check, Heart, Globe, Mountain,
  Camera, Sparkles, Quote, Compass, Bird, Waves, TreePine, Landmark
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import PrivateToursBookingWizard from '@/components/booking/PrivateToursBookingWizard';
import { TOUR_PACKAGES, TOUR_DESTINATIONS } from '@/services/privateToursBookingService';

// Hero slides
const heroSlides = [
  {
    image: 'https://images.unsplash.com/photo-1586613835341-25f4d7b8a8b8?w=1920',
    title: 'Discover Ancient Wonders',
    subtitle: 'Explore Sri Lanka\'s UNESCO World Heritage sites with expert guides'
  },
  {
    image: 'https://images.unsplash.com/photo-1564760055775-d63b17a55c44?w=1920',
    title: 'Wildlife Safari Adventures',
    subtitle: 'Witness leopards, elephants and exotic wildlife in their natural habitat'
  },
  {
    image: 'https://images.unsplash.com/photo-1586804223333-2f3a3a5aafb8?w=1920',
    title: 'Scenic Tea Country',
    subtitle: 'Journey through misty mountains and emerald tea plantations'
  },
  {
    image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1920',
    title: 'Pristine Beach Escapes',
    subtitle: 'Relax on golden beaches along Sri Lanka\'s stunning coastline'
  }
];

// Testimonials
const testimonials = [
  {
    name: 'Sarah Mitchell',
    country: 'United Kingdom',
    avatar: 'https://randomuser.me/api/portraits/women/44.jpg',
    rating: 5,
    text: 'Our driver guide Kumara was exceptional! His knowledge of Sri Lankan history and hidden gems made our cultural tour unforgettable. Highly recommend!',
    tour: 'Cultural Triangle Explorer'
  },
  {
    name: 'Michael Chen',
    country: 'Australia',
    avatar: 'https://randomuser.me/api/portraits/men/32.jpg',
    rating: 5,
    text: 'The safari experience was incredible. Our driver knew exactly where to find the leopards. Professional service from start to finish.',
    tour: 'Yala Safari Adventure'
  },
  {
    name: 'Emma Thompson',
    country: 'Canada',
    avatar: 'https://randomuser.me/api/portraits/women/68.jpg',
    rating: 5,
    text: 'From the tea plantations to Nine Arch Bridge, every moment was magical. The vehicle was comfortable and our driver was so friendly.',
    tour: 'Tea Country & Ella'
  }
];

// Stats
const stats = [
  { value: '5000+', label: 'Happy Travelers' },
  { value: '4.9', label: 'Average Rating' },
  { value: '50+', label: 'Destinations' },
  { value: '24/7', label: 'Support' }
];

// Why choose us features
const features = [
  {
    icon: Shield,
    title: 'Licensed & Insured',
    description: 'All drivers are SLTDA certified with comprehensive insurance coverage'
  },
  {
    icon: Award,
    title: 'Expert Guides',
    description: 'Knowledgeable driver-guides with deep local expertise'
  },
  {
    icon: Car,
    title: 'Premium Vehicles',
    description: 'Modern, air-conditioned vehicles maintained to the highest standards'
  },
  {
    icon: Clock,
    title: 'Flexible Schedules',
    description: 'Customize your itinerary - go at your own pace'
  },
  {
    icon: Heart,
    title: 'Personalized Service',
    description: 'Tailored experiences based on your interests'
  },
  {
    icon: Globe,
    title: 'Local Knowledge',
    description: 'Insider tips and access to hidden gems'
  }
];

const PrivateToursNew: React.FC = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [currentTestimonial, setCurrentTestimonial] = useState(0);
  const [showBookingWizard, setShowBookingWizard] = useState(false);
  const [selectedPackageId, setSelectedPackageId] = useState<string | undefined>();

  // Auto-rotate hero slides
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide(prev => (prev + 1) % heroSlides.length);
    }, 6000);
    return () => clearInterval(interval);
  }, []);

  // Auto-rotate testimonials
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTestimonial(prev => (prev + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const openBookingWizard = (packageId?: string) => {
    setSelectedPackageId(packageId);
    setShowBookingWizard(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <>
      <Helmet>
        <title>Private Tours Sri Lanka | Custom Day Tours & Multi-Day Adventures</title>
        <meta name="description" content="Experience Sri Lanka with private tours. Expert driver guides, luxury vehicles, flexible itineraries. Book cultural tours, wildlife safaris, beach escapes & more." />
      </Helmet>

      <Header />

      <main className="min-h-screen bg-gray-50">
        {/* Hero Section */}
        {!showBookingWizard && (
          <section className="relative h-[85vh] min-h-[600px] overflow-hidden">
            {/* Background Slides */}
            <AnimatePresence mode="wait">
              <motion.div
                key={currentSlide}
                initial={{ opacity: 0, scale: 1.1 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 1 }}
                className="absolute inset-0"
              >
                <div
                  className="absolute inset-0 bg-cover bg-center"
                  style={{ backgroundImage: `url(${heroSlides[currentSlide].image})` }}
                />
                <div className="absolute inset-0 bg-gradient-to-b from-emerald-900/60 via-emerald-800/40 to-emerald-900/80" />
              </motion.div>
            </AnimatePresence>

            {/* Hero Content */}
            <div className="relative z-10 h-full flex flex-col justify-center items-center text-center px-4">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="max-w-4xl"
              >
                <Badge className="bg-emerald-500 text-white mb-4 px-4 py-1">
                  <Sparkles className="w-4 h-4 mr-2" />
                  Premium Private Tours
                </Badge>
                <AnimatePresence mode="wait">
                  <motion.h1
                    key={`title-${currentSlide}`}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className="text-4xl md:text-6xl font-bold text-white mb-4"
                  >
                    {heroSlides[currentSlide].title}
                  </motion.h1>
                </AnimatePresence>
                <AnimatePresence mode="wait">
                  <motion.p
                    key={`subtitle-${currentSlide}`}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className="text-xl md:text-2xl text-white/90 mb-8"
                  >
                    {heroSlides[currentSlide].subtitle}
                  </motion.p>
                </AnimatePresence>

                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button
                    onClick={() => openBookingWizard()}
                    size="lg"
                    className="bg-emerald-600 hover:bg-emerald-700 text-white px-8 py-6 text-lg rounded-xl"
                  >
                    <Compass className="w-5 h-5 mr-2" />
                    Plan Your Tour
                  </Button>
                  <Button
                    variant="outline"
                    size="lg"
                    className="bg-white/10 backdrop-blur-sm border-white/30 text-white hover:bg-white/20 px-8 py-6 text-lg rounded-xl"
                    onClick={() => document.getElementById('packages')?.scrollIntoView({ behavior: 'smooth' })}
                  >
                    View Packages
                  </Button>
                </div>
              </motion.div>

              {/* Slide Indicators */}
              <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-2">
                {heroSlides.map((_, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => setCurrentSlide(i)}
                    className={`w-3 h-3 rounded-full transition-all ${
                      i === currentSlide ? 'bg-white w-8' : 'bg-white/50 hover:bg-white/70'
                    }`}
                  />
                ))}
              </div>

              {/* Slide Navigation */}
              <button
                type="button"
                onClick={() => setCurrentSlide(prev => (prev - 1 + heroSlides.length) % heroSlides.length)}
                className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/10 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-white/20 transition-all"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>
              <button
                type="button"
                onClick={() => setCurrentSlide(prev => (prev + 1) % heroSlides.length)}
                className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/10 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-white/20 transition-all"
              >
                <ChevronRight className="w-6 h-6" />
              </button>
            </div>

            {/* Trust Indicators */}
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-emerald-900/90 to-transparent py-6">
              <div className="max-w-6xl mx-auto px-4">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center text-white">
                  {stats.map((stat, i) => (
                    <div key={i}>
                      <p className="text-2xl md:text-3xl font-bold">{stat.value}</p>
                      <p className="text-sm text-white/70">{stat.label}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>
        )}

        {/* Booking Wizard Section */}
        {showBookingWizard && (
          <section className="py-8 px-4 bg-gradient-to-b from-emerald-900 to-emerald-800">
            <div className="max-w-5xl mx-auto">
              <button
                type="button"
                onClick={() => setShowBookingWizard(false)}
                className="text-white/80 hover:text-white mb-4 flex items-center gap-2"
              >
                <ChevronLeft className="w-5 h-5" />
                Back to Overview
              </button>
              <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
                <div className="bg-emerald-600 p-6 text-white text-center">
                  <h2 className="text-2xl font-bold">Book Your Private Tour</h2>
                  <p className="text-emerald-100">Design your perfect Sri Lankan adventure</p>
                </div>
                <div className="p-6">
                  <PrivateToursBookingWizard initialPackageId={selectedPackageId} />
                </div>
              </div>
            </div>
          </section>
        )}

        {!showBookingWizard && (
          <>
            {/* Popular Packages Section */}
            <section id="packages" className="py-16 px-4 bg-white">
              <div className="max-w-7xl mx-auto">
                <div className="text-center mb-12">
                  <Badge className="bg-emerald-100 text-emerald-700 mb-4">Popular Tours</Badge>
                  <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                    Curated Tour Packages
                  </h2>
                  <p className="text-gray-600 max-w-2xl mx-auto">
                    Expert-designed itineraries featuring Sri Lanka's most iconic destinations
                  </p>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {TOUR_PACKAGES.filter(p => p.isFeatured).map(pkg => (
                    <motion.div
                      key={pkg.id}
                      whileHover={{ y: -8 }}
                      className="bg-white rounded-2xl overflow-hidden shadow-lg border border-gray-100 group"
                    >
                      <div className="relative h-52">
                        <img
                          src={pkg.image}
                          alt={pkg.name}
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-emerald-900/70 via-transparent to-transparent" />
                        <div className="absolute top-4 left-4 flex gap-2">
                          {pkg.isPopular && (
                            <Badge className="bg-amber-500">Popular</Badge>
                          )}
                          <Badge className="bg-white/90 text-gray-800">{pkg.duration}</Badge>
                        </div>
                        <div className="absolute bottom-4 left-4 right-4">
                          <h3 className="text-xl font-bold text-white">{pkg.name}</h3>
                        </div>
                      </div>
                      <div className="p-5">
                        <p className="text-gray-600 text-sm mb-4 line-clamp-2">{pkg.shortDescription}</p>
                        <div className="flex flex-wrap gap-2 mb-4">
                          {pkg.highlights.slice(0, 3).map((h, i) => (
                            <span key={i} className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full">
                              {h}
                            </span>
                          ))}
                        </div>
                        <div className="flex items-center justify-between pt-4 border-t">
                          <div>
                            <p className="text-sm text-gray-500">Starting from</p>
                            <p className="text-2xl font-bold text-emerald-600">${pkg.startingPrice}</p>
                          </div>
                          <Button
                            onClick={() => openBookingWizard(pkg.id)}
                            className="bg-emerald-600 hover:bg-emerald-700"
                          >
                            Book Now
                          </Button>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>

                <div className="text-center mt-10">
                  <Button
                    onClick={() => openBookingWizard()}
                    size="lg"
                    variant="outline"
                    className="border-emerald-600 text-emerald-600 hover:bg-emerald-50"
                  >
                    <Compass className="w-5 h-5 mr-2" />
                    Create Custom Tour
                  </Button>
                </div>
              </div>
            </section>

            {/* Popular Destinations Grid */}
            <section className="py-16 px-4 bg-gray-50">
              <div className="max-w-7xl mx-auto">
                <div className="text-center mb-12">
                  <Badge className="bg-emerald-100 text-emerald-700 mb-4">Destinations</Badge>
                  <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                    Explore Sri Lanka
                  </h2>
                  <p className="text-gray-600 max-w-2xl mx-auto">
                    From ancient temples to pristine beaches - discover the wonders that await
                  </p>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                  {TOUR_DESTINATIONS.filter(d => d.isPopular).slice(0, 12).map(dest => (
                    <motion.div
                      key={dest.id}
                      whileHover={{ scale: 1.05 }}
                      className="relative rounded-xl overflow-hidden aspect-square cursor-pointer group"
                      onClick={() => openBookingWizard()}
                    >
                      <img
                        src={dest.image}
                        alt={dest.name}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-emerald-900/70 to-transparent" />
                      <div className="absolute bottom-3 left-3 right-3">
                        <p className="text-white font-semibold text-sm">{dest.name}</p>
                        <p className="text-white/70 text-xs flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {dest.durationHours}h visit
                        </p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </section>

            {/* Why Choose Us */}
            <section className="py-16 px-4 bg-emerald-900 text-white">
              <div className="max-w-7xl mx-auto">
                <div className="text-center mb-12">
                  <Badge className="bg-emerald-500/30 text-emerald-100 mb-4">Why Choose Us</Badge>
                  <h2 className="text-3xl md:text-4xl font-bold mb-4">
                    The Recharge Travels Difference
                  </h2>
                  <p className="text-emerald-100 max-w-2xl mx-auto">
                    We're not just a tour company - we're your gateway to authentic Sri Lankan experiences
                  </p>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {features.map((feature, i) => {
                    const Icon = feature.icon;
                    return (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.1 }}
                        className="bg-white/10 backdrop-blur-sm rounded-xl p-6 hover:bg-white/20 transition-all"
                      >
                        <div className="w-12 h-12 bg-emerald-500 rounded-xl flex items-center justify-center mb-4">
                          <Icon className="w-6 h-6 text-white" />
                        </div>
                        <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
                        <p className="text-emerald-100">{feature.description}</p>
                      </motion.div>
                    );
                  })}
                </div>
              </div>
            </section>

            {/* Testimonials */}
            <section className="py-16 px-4 bg-white">
              <div className="max-w-4xl mx-auto">
                <div className="text-center mb-12">
                  <Badge className="bg-amber-100 text-amber-700 mb-4">Reviews</Badge>
                  <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                    What Our Travelers Say
                  </h2>
                </div>

                <div className="relative">
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={currentTestimonial}
                      initial={{ opacity: 0, x: 50 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -50 }}
                      className="bg-gray-50 rounded-2xl p-8 text-center"
                    >
                      <Quote className="w-12 h-12 text-emerald-300 mx-auto mb-4" />
                      <p className="text-lg text-gray-700 mb-6 italic">
                        "{testimonials[currentTestimonial].text}"
                      </p>
                      <div className="flex items-center justify-center gap-4">
                        <img
                          src={testimonials[currentTestimonial].avatar}
                          alt={testimonials[currentTestimonial].name}
                          className="w-14 h-14 rounded-full"
                        />
                        <div className="text-left">
                          <p className="font-bold text-gray-900">{testimonials[currentTestimonial].name}</p>
                          <p className="text-sm text-gray-500">{testimonials[currentTestimonial].country}</p>
                          <div className="flex gap-1 mt-1">
                            {[...Array(testimonials[currentTestimonial].rating)].map((_, i) => (
                              <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                            ))}
                          </div>
                        </div>
                      </div>
                      <Badge className="mt-4 bg-emerald-100 text-emerald-700">
                        {testimonials[currentTestimonial].tour}
                      </Badge>
                    </motion.div>
                  </AnimatePresence>

                  {/* Testimonial Navigation */}
                  <div className="flex justify-center gap-2 mt-6">
                    {testimonials.map((_, i) => (
                      <button
                        key={i}
                        type="button"
                        onClick={() => setCurrentTestimonial(i)}
                        className={`w-2 h-2 rounded-full transition-all ${
                          i === currentTestimonial ? 'bg-emerald-600 w-6' : 'bg-gray-300'
                        }`}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </section>

            {/* CTA Section */}
            <section className="py-16 px-4 bg-gradient-to-r from-emerald-600 to-emerald-700">
              <div className="max-w-4xl mx-auto text-center">
                <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                  Ready to Explore Sri Lanka?
                </h2>
                <p className="text-emerald-100 text-lg mb-8">
                  Book your private tour today and create unforgettable memories
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button
                    onClick={() => openBookingWizard()}
                    size="lg"
                    className="bg-white text-emerald-700 hover:bg-gray-100 px-8 py-6 text-lg"
                  >
                    <Compass className="w-5 h-5 mr-2" />
                    Start Planning
                  </Button>
                  <Button
                    size="lg"
                    variant="outline"
                    className="border-white text-white hover:bg-white/10 px-8 py-6 text-lg"
                  >
                    <Phone className="w-5 h-5 mr-2" />
                    Contact Us
                  </Button>
                </div>
              </div>
            </section>
          </>
        )}
      </main>

      <RechargeFooter />
    </>
  );
};

export default PrivateToursNew;
