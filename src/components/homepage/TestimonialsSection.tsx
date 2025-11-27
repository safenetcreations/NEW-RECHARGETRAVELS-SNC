import { motion, AnimatePresence } from 'framer-motion';
import { Star, Quote, ChevronLeft, ChevronRight, MapPin, Calendar, Heart, Users, Award, ThumbsUp } from 'lucide-react';
import { useState, useEffect, useCallback, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { testimonialsService, homepageStatsService } from '@/services/cmsService';
import type { Testimonial, HomepageStat } from '@/types/cms';

const TestimonialsSection = () => {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [stats, setStats] = useState<HomepageStat[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeIndex, setActiveIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  // Default fallback testimonials
  const defaultTestimonials = useMemo(() => [
    {
      id: '1',
      name: "Sarah Johnson",
      location: "New York, USA",
      image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=200",
      rating: 5,
      text: "Our Sri Lankan adventure exceeded all expectations! The team at Recharge Travels crafted a perfect itinerary that balanced culture, nature, and relaxation. The private transfers were luxurious and our driver was incredibly knowledgeable.",
      tripType: "Honeymoon Trip",
      date: "December 2023",
      isActive: true,
      isFeatured: true,
      order: 0,
      createdAt: null as any,
      updatedAt: null as any,
    },
    {
      id: '2',
      name: "Michael Chen",
      location: "Singapore",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=200",
      rating: 5,
      text: "As a photographer, I was blown away by the locations they took us to. The sunrise at Sigiriya and the tea plantations in Ella were magical. Their attention to detail and local expertise made all the difference.",
      tripType: "Photography Tour",
      date: "January 2024",
      isActive: true,
      isFeatured: true,
      order: 1,
      createdAt: null as any,
      updatedAt: null as any,
    },
    {
      id: '3',
      name: "Emma Thompson",
      location: "London, UK",
      image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=200",
      rating: 5,
      text: "Traveling with my family of 6 was made so easy by Recharge Travels. They handled everything from airport pickups to arranging child-friendly activities. The whale watching in Mirissa was a highlight for the kids!",
      tripType: "Family Vacation",
      date: "November 2023",
      isActive: true,
      isFeatured: true,
      order: 2,
      createdAt: null as any,
      updatedAt: null as any,
    },
    {
      id: '4',
      name: "David & Lisa Martinez",
      location: "Barcelona, Spain",
      image: "https://images.unsplash.com/photo-1522556189639-b150ed9c4330?q=80&w=200",
      rating: 5,
      text: "The cultural triangle tour was phenomenal! Ancient temples, friendly locals, and authentic Sri Lankan cuisine. Recharge Travels made our dream trip come true. Can't wait to return!",
      tripType: "Cultural Tour",
      date: "February 2024",
      isActive: true,
      isFeatured: true,
      order: 3,
      createdAt: null as any,
      updatedAt: null as any,
    },
    {
      id: '5',
      name: "Akiko Tanaka",
      location: "Tokyo, Japan",
      image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=200",
      rating: 5,
      text: "Perfect organization from start to finish. The wildlife safari at Yala was incredible - we saw leopards! The tea country train journey through the hills was breathtaking.",
      tripType: "Wildlife Adventure",
      date: "March 2024",
      isActive: true,
      isFeatured: true,
      order: 4,
      createdAt: null as any,
      updatedAt: null as any,
    }
  ], []);

  // Default fallback stats
  const defaultStats = useMemo(() => [
    { id: '1', label: 'Happy Travelers', value: '2,847', icon: '✈️', order: 0, isActive: true, createdAt: null as any, updatedAt: null as any },
    { id: '2', label: 'Average Rating', value: '4.9', icon: '⭐', order: 1, isActive: true, createdAt: null as any, updatedAt: null as any },
    { id: '3', label: 'Would Recommend', value: '98', icon: '👍', order: 2, isActive: true, createdAt: null as any, updatedAt: null as any },
    { id: '4', label: 'Years Experience', value: '15', icon: '🏆', order: 3, isActive: true, createdAt: null as any, updatedAt: null as any },
  ], []);

  // Load testimonials and stats from Firestore CMS
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const featured = await testimonialsService.getFeatured(5);
        if (featured && featured.length > 0) {
          setTestimonials(featured);
        } else {
          const all = await testimonialsService.getAll();
          setTestimonials(all && all.length > 0 ? all.slice(0, 5) : defaultTestimonials);
        }

        const statsData = await homepageStatsService.getAll();
        setStats(statsData && statsData.length > 0 ? statsData : defaultStats);
      } catch (error) {
        console.error('Error loading testimonials:', error);
        setTestimonials(defaultTestimonials);
        setStats(defaultStats);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [defaultStats, defaultTestimonials]);

  // Auto-rotate testimonials
  useEffect(() => {
    if (!isAutoPlaying || testimonials.length <= 1) return;
    const timer = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [isAutoPlaying, testimonials.length]);

  const nextTestimonial = useCallback(() => {
    setActiveIndex((prev) => (prev + 1) % testimonials.length);
    setIsAutoPlaying(false);
  }, [testimonials.length]);

  const prevTestimonial = useCallback(() => {
    setActiveIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
    setIsAutoPlaying(false);
  }, [testimonials.length]);

  // Animated counter hook
  const AnimatedCounter = ({ value, suffix = '' }: { value: string; suffix?: string }) => {
    const numericValue = parseInt(value.replace(/[^0-9]/g, '')) || 0;
    const [count, setCount] = useState(0);

    useEffect(() => {
      const duration = 2000;
      const steps = 60;
      const increment = numericValue / steps;
      let current = 0;
      const timer = setInterval(() => {
        current += increment;
        if (current >= numericValue) {
          setCount(numericValue);
          clearInterval(timer);
        } else {
          setCount(Math.floor(current));
        }
      }, duration / steps);
      return () => clearInterval(timer);
    }, [numericValue]);

    return <span>{count.toLocaleString()}{suffix}</span>;
  };

  if (loading) {
    return (
      <section className="py-8 bg-gradient-to-br from-orange-50 via-white to-blue-50">
        <div className="container mx-auto px-4 text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-orange-500 border-t-transparent mx-auto" />
        </div>
      </section>
    );
  }

  const currentTestimonial = testimonials[activeIndex];

  return (
    <section className="relative py-6 overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-orange-50 via-white to-blue-50" />

      {/* Floating Decorative Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute top-20 left-10 w-72 h-72 bg-orange-200/30 rounded-full blur-3xl"
          animate={{ x: [0, 50, 0], y: [0, 30, 0] }}
          transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute bottom-20 right-10 w-96 h-96 bg-blue-200/30 rounded-full blur-3xl"
          animate={{ x: [0, -30, 0], y: [0, -50, 0] }}
          transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-yellow-200/20 rounded-full blur-3xl"
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
        />
      </div>

      <div className="container mx-auto px-4 lg:px-8 relative z-10">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-4"
        >
          <motion.div
            initial={{ scale: 0 }}
            whileInView={{ scale: 1 }}
            viewport={{ once: true }}
            transition={{ type: "spring", bounce: 0.5 }}
            className="inline-flex items-center gap-2 bg-gradient-to-r from-orange-500/10 to-red-500/10 px-6 py-3 rounded-full mb-6 border border-orange-200"
          >
            <Heart className="w-5 h-5 text-red-500 animate-pulse" />
            <span className="text-orange-600 font-semibold tracking-wide">LOVED BY TRAVELERS</span>
            <Heart className="w-5 h-5 text-red-500 animate-pulse" />
          </motion.div>

          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-6">
            Unforgettable <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-red-500">Experiences</span>
          </h2>

          <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto">
            Real stories from travelers who discovered the magic of Sri Lanka with us
          </p>
        </motion.div>

        {/* Main Testimonial Card */}
        <div className="max-w-5xl mx-auto mb-8">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeIndex}
              initial={{ opacity: 0, x: 100, scale: 0.95 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: -100, scale: 0.95 }}
              transition={{ duration: 0.5, ease: "easeInOut" }}
              className="relative"
            >
              <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl p-8 md:p-12 border border-white/50">
                {/* Large Quote Icon */}
                <motion.div
                  initial={{ rotate: -10, scale: 0 }}
                  animate={{ rotate: 0, scale: 1 }}
                  transition={{ delay: 0.2, type: "spring" }}
                  className="absolute -top-6 -left-6 w-16 h-16 bg-gradient-to-br from-orange-500 to-red-500 rounded-2xl flex items-center justify-center shadow-lg"
                >
                  <Quote className="w-8 h-8 text-white" />
                </motion.div>

                <div className="grid md:grid-cols-[1fr,300px] gap-8 items-center">
                  {/* Content */}
                  <div>
                    {/* Stars */}
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3 }}
                      className="flex gap-1 mb-6"
                    >
                      {[...Array(currentTestimonial?.rating || 5)].map((_, i) => (
                        <motion.div
                          key={i}
                          initial={{ scale: 0, rotate: -180 }}
                          animate={{ scale: 1, rotate: 0 }}
                          transition={{ delay: 0.3 + i * 0.1, type: "spring" }}
                        >
                          <Star className="w-6 h-6 fill-yellow-400 text-yellow-400" />
                        </motion.div>
                      ))}
                    </motion.div>

                    {/* Quote Text */}
                    <motion.p
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.4 }}
                      className="text-xl md:text-2xl text-gray-700 leading-relaxed mb-8 font-light italic"
                    >
                      "{currentTestimonial?.text}"
                    </motion.p>

                    {/* Author Info */}
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.5 }}
                      className="flex items-center gap-4"
                    >
                      <div className="relative">
                        <img
                          src={currentTestimonial?.image}
                          alt={currentTestimonial?.name}
                          className="w-16 h-16 rounded-full object-cover ring-4 ring-orange-100"
                        />
                        <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center border-2 border-white">
                          <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                        </div>
                      </div>
                      <div>
                        <h4 className="text-xl font-bold text-gray-900">{currentTestimonial?.name}</h4>
                        <div className="flex items-center gap-2 text-gray-500">
                          <MapPin className="w-4 h-4" />
                          <span>{currentTestimonial?.location}</span>
                        </div>
                      </div>
                    </motion.div>
                  </div>

                  {/* Trip Info Card */}
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.6 }}
                    className="bg-gradient-to-br from-orange-500 to-red-500 rounded-2xl p-6 text-white hidden md:block"
                  >
                    <div className="text-center mb-6">
                      <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Award className="w-10 h-10" />
                      </div>
                      <h5 className="text-lg font-bold">{currentTestimonial?.tripType}</h5>
                    </div>
                    <div className="space-y-3">
                      <div className="flex items-center gap-3 bg-white/10 rounded-lg p-3">
                        <Calendar className="w-5 h-5" />
                        <span>{currentTestimonial?.date}</span>
                      </div>
                      <div className="flex items-center gap-3 bg-white/10 rounded-lg p-3">
                        <ThumbsUp className="w-5 h-5" />
                        <span>Verified Trip</span>
                      </div>
                    </div>
                  </motion.div>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Navigation */}
          <div className="flex items-center justify-center gap-4 mt-8">
            <Button
              variant="outline"
              size="icon"
              onClick={prevTestimonial}
              className="w-12 h-12 rounded-full bg-white shadow-lg hover:shadow-xl border-0 hover:bg-orange-50"
            >
              <ChevronLeft className="w-6 h-6 text-gray-700" />
            </Button>

            {/* Dots */}
            <div className="flex gap-2">
              {testimonials.map((_, idx) => (
                <button
                  type="button"
                  key={idx}
                  onClick={() => {
                    setActiveIndex(idx);
                    setIsAutoPlaying(false);
                  }}
                  className={`h-3 rounded-full transition-all duration-300 ${
                    activeIndex === idx
                      ? 'w-10 bg-gradient-to-r from-orange-500 to-red-500'
                      : 'w-3 bg-gray-300 hover:bg-gray-400'
                  }`}
                  aria-label={`View testimonial ${idx + 1}`}
                />
              ))}
            </div>

            <Button
              variant="outline"
              size="icon"
              onClick={nextTestimonial}
              className="w-12 h-12 rounded-full bg-white shadow-lg hover:shadow-xl border-0 hover:bg-orange-50"
            >
              <ChevronRight className="w-6 h-6 text-gray-700" />
            </Button>
          </div>
        </div>

        {/* Stats Section */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="grid grid-cols-2 md:grid-cols-4 gap-6"
        >
          {[
            { icon: Users, label: 'Happy Travelers', value: '2847', suffix: '+', color: 'from-blue-500 to-blue-600' },
            { icon: Star, label: 'Average Rating', value: '4.9', suffix: '/5', color: 'from-yellow-500 to-orange-500' },
            { icon: ThumbsUp, label: 'Would Recommend', value: '98', suffix: '%', color: 'from-green-500 to-emerald-500' },
            { icon: Award, label: 'Years Experience', value: '15', suffix: '+', color: 'from-purple-500 to-pink-500' },
          ].map((stat, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              whileHover={{ y: -10, scale: 1.02 }}
              className="bg-white rounded-2xl p-6 shadow-xl hover:shadow-2xl transition-all duration-300 text-center group"
            >
              <div className={`w-16 h-16 bg-gradient-to-br ${stat.color} rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300`}>
                <stat.icon className="w-8 h-8 text-white" />
              </div>
              <div className="text-4xl font-bold text-gray-900 mb-1">
                <AnimatedCounter value={stat.value} suffix={stat.suffix} />
              </div>
              <div className="text-gray-600 font-medium">{stat.label}</div>
            </motion.div>
          ))}
        </motion.div>

        {/* Mini Testimonials Row */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="mt-8 flex flex-wrap justify-center gap-4"
        >
          {testimonials.slice(0, 5).map((t, idx) => (
            <motion.button
              key={t.id}
              type="button"
              onClick={() => {
                setActiveIndex(idx);
                setIsAutoPlaying(false);
              }}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              className={`relative group ${activeIndex === idx ? 'ring-4 ring-orange-400 ring-offset-2' : ''}`}
            >
              <img
                src={t.image}
                alt={t.name}
                className="w-14 h-14 rounded-full object-cover"
              />
              <div className="absolute inset-0 rounded-full bg-black/0 group-hover:bg-black/20 transition-colors" />
            </motion.button>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
