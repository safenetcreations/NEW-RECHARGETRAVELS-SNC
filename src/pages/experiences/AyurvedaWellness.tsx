import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Leaf, Star, Clock, Users, ChevronRight, Quote, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import {
  getAyurvedaPageData,
  HeroContent,
  PhilosophyContent,
  CtaContent,
  Retreat,
  Treatment,
  Testimonial
} from '@/services/ayurvedaPublicService';
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

// Default content fallbacks
const defaultHero: HeroContent = {
  title: 'Ayurveda & Wellness Retreats',
  subtitle: 'Discover ancient healing traditions in the heart of Sri Lanka',
  backgroundImage: 'https://images.unsplash.com/photo-1544161515-4ab6ce6db874?auto=format&fit=crop&w=2000&q=80',
  ctaText: 'Explore Retreats',
  ctaLink: '#retreats'
};

const defaultPhilosophy: PhilosophyContent = {
  label: 'The Ancient Wisdom',
  title: 'The Art of Healing & Renewal',
  description: 'Ayurveda, the 5,000-year-old science of life, offers a holistic approach to wellness that harmonizes body, mind, and spirit. Our carefully curated retreats combine authentic treatments with luxurious accommodations in Sri Lanka\'s most serene settings.',
  pillars: ['Balance', 'Harmony', 'Renewal']
};

const defaultCta: CtaContent = {
  title: 'Begin Your Wellness Journey',
  subtitle: 'Let our experts craft a personalized retreat experience just for you',
  buttonText: 'Contact Us',
  buttonLink: '/contact',
  backgroundImage: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=2000&q=80'
};

const AyurvedaWellness = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [hero, setHero] = useState<HeroContent>(defaultHero);
  const [philosophy, setPhilosophy] = useState<PhilosophyContent>(defaultPhilosophy);
  const [cta, setCta] = useState<CtaContent>(defaultCta);
  const [retreats, setRetreats] = useState<Retreat[]>([]);
  const [treatments, setTreatments] = useState<Treatment[]>([]);
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);

  useEffect(() => {
    loadPageData();
  }, []);

  const loadPageData = async () => {
    try {
      const data = await cachedFetch(
        'ayurveda-wellness-page',
        () => getAyurvedaPageData(),
        10 * 60 * 1000 // Cache for 10 minutes
      );
      if (data.hero) {
        setHero(data.hero);
        // Preload hero image
        const link = document.createElement('link');
        link.rel = 'preload';
        link.as = 'image';
        link.href = getOptimizedImageUrl(data.hero.backgroundImage, 1920);
        document.head.appendChild(link);
      }
      if (data.philosophy) setPhilosophy(data.philosophy);
      if (data.cta) setCta(data.cta);
      setRetreats(data.retreats);
      setTreatments(data.treatments);
      setTestimonials(data.testimonials);
    } catch (error) {
      console.error('Error loading page data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleBookNow = (title: string, price: number, duration?: string, type: 'retreat' | 'treatment' = 'retreat') => {
    // Navigate to full-page booking with package details
    const params = new URLSearchParams({
      package: title,
      price: price.toString(),
      duration: duration || '',
      type: type
    });
    navigate(`/booking/ayurveda?${params.toString()}`);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-emerald-50 to-amber-50 flex items-center justify-center">
        <div className="text-center">
          <Leaf className="w-16 h-16 text-emerald-600 animate-pulse mx-auto mb-4" />
          <p className="text-emerald-800 font-medium">Loading wellness experience...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-emerald-50 to-amber-50">
      <Header />

      {/* Hero Section */}
      <section className="relative h-[90vh] overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${getOptimizedImageUrl(hero.backgroundImage, 1920)})` }}
        >
          <div className="absolute inset-0 bg-gradient-to-b from-emerald-900/70 via-emerald-900/50 to-emerald-900/80" />
        </div>

        <div className="relative h-full flex items-center justify-center text-center px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
            className="max-w-4xl"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.3, type: 'spring' }}
              className="w-20 h-20 mx-auto mb-8 bg-amber-500/20 rounded-full flex items-center justify-center backdrop-blur-sm"
            >
              <Leaf className="w-10 h-10 text-amber-400" />
            </motion.div>

            <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight">
              {hero.title}
            </h1>
            <p className="text-xl md:text-2xl text-emerald-100 mb-10 max-w-2xl mx-auto">
              {hero.subtitle}
            </p>

            <Button
              size="lg"
              className="bg-amber-500 hover:bg-amber-600 text-emerald-900 font-semibold px-8 py-6 text-lg rounded-full shadow-lg shadow-amber-500/30"
              onClick={() => document.getElementById('retreats')?.scrollIntoView({ behavior: 'smooth' })}
            >
              {hero.ctaText}
              <ChevronRight className="ml-2 w-5 h-5" />
            </Button>
          </motion.div>
        </div>

        {/* Decorative wave */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 120" fill="none" className="w-full">
            <path d="M0 120V60C240 20 480 0 720 0C960 0 1200 20 1440 60V120H0Z" className="fill-emerald-50/90" />
          </svg>
        </div>
      </section>

      {/* Philosophy Section */}
      <section className="py-24 px-4 bg-gradient-to-b from-emerald-50/90 to-white">
        <div className="container mx-auto max-w-6xl">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <span className="text-amber-600 font-medium tracking-wider uppercase text-sm">
              {philosophy.label}
            </span>
            <h2 className="text-4xl md:text-5xl font-bold text-emerald-900 mt-4 mb-6">
              {philosophy.title}
            </h2>
            <p className="text-lg text-emerald-700/80 max-w-3xl mx-auto leading-relaxed">
              {philosophy.description}
            </p>
          </motion.div>

          {/* Three Pillars */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {philosophy.pillars.map((pillar, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.2, duration: 0.6 }}
                className="text-center"
              >
                <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-emerald-100 to-amber-100 rounded-full flex items-center justify-center shadow-lg">
                  <Sparkles className="w-10 h-10 text-emerald-600" />
                </div>
                <h3 className="text-2xl font-semibold text-emerald-900 mb-3">{pillar}</h3>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Retreats Section */}
      <section id="retreats" className="py-24 px-4 bg-white">
        <div className="container mx-auto max-w-7xl">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <span className="text-amber-600 font-medium tracking-wider uppercase text-sm">
              Curated Experiences
            </span>
            <h2 className="text-4xl md:text-5xl font-bold text-emerald-900 mt-4">
              Wellness Retreats
            </h2>
          </motion.div>

          {retreats.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {retreats.map((retreat, index) => (
                <motion.div
                  key={retreat.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1, duration: 0.5 }}
                >
                  <Card className="overflow-hidden border-0 shadow-xl hover:shadow-2xl transition-all duration-500 group h-full">
                    <div className="relative h-64 overflow-hidden">
                      <img
                        src={getOptimizedImageUrl(retreat.image || 'https://images.unsplash.com/photo-1600334089648-b0d9d3028eb2', 800)}
                        alt={retreat.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                        loading="lazy"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-emerald-900/60 to-transparent" />
                      <Badge className="absolute top-4 right-4 bg-amber-500 text-emerald-900">
                        {retreat.duration}
                      </Badge>
                    </div>
                    <CardContent className="p-6">
                      <h3 className="text-xl font-bold text-emerald-900 mb-2">{retreat.title}</h3>
                      <p className="text-emerald-700/70 mb-4 line-clamp-2">{retreat.description}</p>

                      {retreat.highlights?.length > 0 && (
                        <div className="flex flex-wrap gap-2 mb-4">
                          {retreat.highlights.slice(0, 3).map((highlight, i) => (
                            <Badge key={i} variant="outline" className="text-emerald-600 border-emerald-200">
                              {highlight}
                            </Badge>
                          ))}
                        </div>
                      )}

                      <div className="flex items-center justify-between pt-4 border-t border-emerald-100">
                        <div>
                          <span className="text-sm text-emerald-600">From</span>
                          <p className="text-2xl font-bold text-amber-600">${retreat.price}</p>
                        </div>
                        <Button
                          className="bg-emerald-600 hover:bg-emerald-700"
                          onClick={() => handleBookNow(retreat.title, retreat.price, retreat.duration, 'retreat')}
                        >
                          Book Now
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <Leaf className="w-16 h-16 text-emerald-300 mx-auto mb-4" />
              <p className="text-emerald-600">Retreat packages coming soon...</p>
            </div>
          )}
        </div>
      </section>

      {/* Treatments Section */}
      <section className="py-24 px-4 bg-gradient-to-b from-emerald-50 to-amber-50/50">
        <div className="container mx-auto max-w-7xl">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <span className="text-amber-600 font-medium tracking-wider uppercase text-sm">
              Healing Therapies
            </span>
            <h2 className="text-4xl md:text-5xl font-bold text-emerald-900 mt-4">
              Signature Treatments
            </h2>
          </motion.div>

          {treatments.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {treatments.map((treatment, index) => (
                <motion.div
                  key={treatment.id}
                  initial={{ opacity: 0, x: index % 2 === 0 ? -30 : 30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6 }}
                  className="bg-white rounded-2xl shadow-lg overflow-hidden flex flex-col md:flex-row"
                >
                  <div className="md:w-2/5 h-48 md:h-auto">
                    <img
                      src={getOptimizedImageUrl(treatment.image || 'https://images.unsplash.com/photo-1515377905703-c4788e51af15', 800)}
                      alt={treatment.title}
                      className="w-full h-full object-cover"
                      loading="lazy"
                    />
                  </div>
                  <div className="md:w-3/5 p-6 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center gap-2 mb-3">
                        <Clock className="w-4 h-4 text-amber-500" />
                        <span className="text-sm text-emerald-600">{treatment.duration}</span>
                      </div>
                      <h3 className="text-xl font-bold text-emerald-900 mb-2">{treatment.title}</h3>
                      <p className="text-emerald-700/70 mb-4 line-clamp-2">{treatment.description}</p>

                      {treatment.benefits?.length > 0 && (
                        <div className="flex flex-wrap gap-1 mb-4">
                          {treatment.benefits.slice(0, 3).map((benefit, i) => (
                            <span key={i} className="text-xs bg-emerald-100 text-emerald-700 px-2 py-1 rounded-full">
                              {benefit}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>

                    <div className="flex items-center justify-between">
                      <p className="text-2xl font-bold text-amber-600">${treatment.price}</p>
                      <Button
                        variant="outline"
                        className="border-emerald-600 text-emerald-600 hover:bg-emerald-600 hover:text-white"
                        onClick={() => handleBookNow(treatment.title, treatment.price, treatment.duration, 'treatment')}
                      >
                        Book Treatment
                      </Button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <Sparkles className="w-16 h-16 text-emerald-300 mx-auto mb-4" />
              <p className="text-emerald-600">Treatment options coming soon...</p>
            </div>
          )}
        </div>
      </section>

      {/* Testimonials Section */}
      {testimonials.length > 0 && (
        <section className="py-24 px-4 bg-emerald-900">
          <div className="container mx-auto max-w-6xl">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <span className="text-amber-400 font-medium tracking-wider uppercase text-sm">
                Guest Experiences
              </span>
              <h2 className="text-4xl md:text-5xl font-bold text-white mt-4">
                What Our Guests Say
              </h2>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {testimonials.map((testimonial, index) => (
                <motion.div
                  key={testimonial.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1, duration: 0.5 }}
                  className="bg-emerald-800/50 backdrop-blur-sm rounded-2xl p-6 border border-emerald-700/50"
                >
                  <Quote className="w-10 h-10 text-amber-500/50 mb-4" />
                  <p className="text-emerald-100 mb-6 italic">"{testimonial.comment}"</p>

                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-emerald-700 flex items-center justify-center overflow-hidden">
                      {testimonial.image ? (
                        <img src={testimonial.image} alt={testimonial.name} className="w-full h-full object-cover" />
                      ) : (
                        <span className="text-amber-400 font-bold">{testimonial.name[0]}</span>
                      )}
                    </div>
                    <div>
                      <p className="text-white font-semibold">{testimonial.name}</p>
                      <p className="text-emerald-300 text-sm">{testimonial.country}</p>
                    </div>
                    <div className="ml-auto flex">
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                      ))}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CTA Section */}
      <section className="relative py-32 px-4 overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center bg-fixed"
          style={{ backgroundImage: `url(${getOptimizedImageUrl(cta.backgroundImage, 1920)})` }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-emerald-900/90 to-amber-900/80" />
        </div>

        <div className="relative container mx-auto max-w-4xl text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              {cta.title}
            </h2>
            <p className="text-xl text-emerald-100 mb-10 max-w-2xl mx-auto">
              {cta.subtitle}
            </p>
            <Button
              size="lg"
              className="bg-amber-500 hover:bg-amber-600 text-emerald-900 font-semibold px-10 py-6 text-lg rounded-full shadow-lg shadow-amber-500/30"
              onClick={() => navigate('/booking/ayurveda')}
            >
              {cta.buttonText}
              <ChevronRight className="ml-2 w-5 h-5" />
            </Button>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default AyurvedaWellness;
