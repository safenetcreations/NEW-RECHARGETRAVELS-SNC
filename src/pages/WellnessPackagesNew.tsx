import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Sparkles, Star, ChevronRight, Quote, Heart,
  Calendar, MapPin, Check, Phone, Clock, Users,
  X, Flower2, Sun, Moon, Waves, TreePine, Dumbbell,
  Loader2, ArrowRight, Play, Pause
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { getAllWellnessData, WellnessPackage, SpaService, WellnessTestimonial, WellnessPageSettings } from '@/services/wellnessService';

// Category icons
const categoryIcons: Record<string, any> = {
  spa: Sparkles,
  detox: Flower2,
  mindfulness: Moon,
  luxury: Star,
  retreat: Sun,
  massage: Heart,
  facial: Sparkles,
  body: Waves,
  bath: Flower2,
  signature: Star
};

const categoryColors: Record<string, string> = {
  spa: 'from-pink-500 to-rose-500',
  detox: 'from-emerald-500 to-teal-500',
  mindfulness: 'from-purple-500 to-indigo-500',
  luxury: 'from-amber-500 to-orange-500',
  retreat: 'from-blue-500 to-cyan-500'
};

// Package Detail Modal
const PackageModal = ({ pkg, onClose, onBook }: { pkg: WellnessPackage; onClose: () => void; onBook: () => void }) => {
  const Icon = categoryIcons[pkg.category] || Sparkles;
  
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 20 }}
        transition={{ type: "spring", duration: 0.5 }}
        className="relative w-full max-w-5xl max-h-[90vh] overflow-y-auto bg-gradient-to-b from-[#1a1a1a] to-[#0a0a0a] rounded-2xl border border-rose-500/20"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button onClick={onClose} className="absolute top-4 right-4 z-10 p-2 bg-black/50 hover:bg-rose-500/20 rounded-full transition-colors">
          <X className="w-6 h-6 text-white" />
        </button>

        {/* Hero Image */}
        <div className="relative h-72 md:h-96 overflow-hidden">
          <img src={pkg.image} alt={pkg.name} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#1a1a1a] via-transparent to-transparent" />
          <div className="absolute bottom-6 left-6 right-6">
            <div className="flex items-center gap-3 mb-3">
              <Badge className={`bg-gradient-to-r ${categoryColors[pkg.category]} text-white border-0`}>
                <Icon className="w-3 h-3 mr-1" />{pkg.category.toUpperCase()}
              </Badge>
              <Badge className="bg-white/20 text-white border-0">{pkg.duration}</Badge>
            </div>
            <h2 className="text-4xl md:text-5xl font-light text-white mb-2">{pkg.name}</h2>
            <p className="text-rose-300 text-lg">{pkg.tagline}</p>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 md:p-10">
          {/* Resort & Rating */}
          <div className="flex flex-wrap items-center gap-4 mb-8 pb-6 border-b border-white/10">
            <div className="flex items-center gap-2 text-white/70">
              <MapPin className="w-5 h-5 text-rose-400" />
              <span>{pkg.resort}, {pkg.location}</span>
            </div>
            <div className="flex items-center gap-1">
              <Star className="w-5 h-5 fill-amber-400 text-amber-400" />
              <span className="text-white font-medium">{pkg.rating}</span>
              <span className="text-white/50">({pkg.reviews} reviews)</span>
            </div>
          </div>

          {/* Description */}
          <div className="mb-8">
            <p className="text-white/80 text-lg leading-relaxed font-light">{pkg.fullDescription}</p>
          </div>

          {/* Highlights */}
          <div className="mb-8">
            <h3 className="text-xl font-medium text-white mb-4">Package Highlights</h3>
            <div className="flex flex-wrap gap-3">
              {pkg.highlights.map((h, i) => (
                <span key={i} className="px-4 py-2 bg-rose-500/10 text-rose-300 rounded-full border border-rose-500/20 flex items-center gap-2">
                  <Check className="w-4 h-4" />{h}
                </span>
              ))}
            </div>
          </div>

          {/* What's Included */}
          <div className="mb-8 p-6 bg-white/5 rounded-xl border border-white/10">
            <h3 className="text-xl font-medium text-white mb-4">What's Included</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {pkg.includes.map((item, i) => (
                <div key={i} className="flex items-center gap-2 text-white/70">
                  <Check className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                  {item}
                </div>
              ))}
            </div>
          </div>

          {/* Daily Schedule */}
          <div className="mb-8">
            <h3 className="text-xl font-medium text-white mb-4">Daily Schedule</h3>
            <div className="space-y-4">
              {pkg.schedule.map((day, i) => (
                <div key={i} className="flex gap-4">
                  <div className="w-20 flex-shrink-0">
                    <span className="px-3 py-1 bg-rose-500/20 text-rose-300 text-sm rounded-full">{day.day}</span>
                  </div>
                  <div className="flex-1">
                    <ul className="text-white/70 text-sm space-y-1">
                      {day.activities.map((activity, j) => (
                        <li key={j} className="flex items-center gap-2">
                          <div className="w-1.5 h-1.5 bg-rose-400 rounded-full" />{activity}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Best For */}
          <div className="mb-8">
            <h3 className="text-xl font-medium text-white mb-4">Best For</h3>
            <div className="flex flex-wrap gap-2">
              {pkg.bestFor.map((item, i) => (
                <span key={i} className="px-3 py-1 bg-amber-500/10 text-amber-300 text-sm rounded-full border border-amber-500/20">
                  {item}
                </span>
              ))}
            </div>
          </div>

          {/* Price & Book */}
          <div className="flex flex-col md:flex-row items-center justify-between gap-6 p-6 bg-gradient-to-r from-rose-500/10 to-transparent rounded-xl border border-rose-500/20">
            <div>
              <span className="text-white/50 text-sm">Starting from</span>
              <div className="flex items-baseline gap-3">
                <span className="text-4xl font-light text-rose-400">${pkg.price.toLocaleString()}</span>
                {pkg.originalPrice && pkg.originalPrice > pkg.price && (
                  <span className="text-lg text-white/40 line-through">${pkg.originalPrice.toLocaleString()}</span>
                )}
              </div>
              <span className="text-white/50 text-sm">per person, {pkg.nights} nights</span>
            </div>
            <div className="flex gap-4">
              <Button variant="outline" className="border-white/30 text-white hover:bg-white/10 bg-transparent" onClick={() => window.open('https://wa.me/94777721999', '_blank')}>
                <Phone className="w-4 h-4 mr-2" />Enquire
              </Button>
              <Button size="lg" className="bg-gradient-to-r from-rose-600 to-rose-500 hover:from-rose-500 hover:to-rose-400 text-white font-medium px-8" onClick={onBook}>
                Book Now<ChevronRight className="w-5 h-5 ml-2" />
              </Button>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

const WellnessPackagesNew = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [selectedPackage, setSelectedPackage] = useState<WellnessPackage | null>(null);
  const [activeFilter, setActiveFilter] = useState<string>('all');

  // Dynamic data states
  const [settings, setSettings] = useState<WellnessPageSettings | null>(null);
  const [packages, setPackages] = useState<WellnessPackage[]>([]);
  const [services, setServices] = useState<SpaService[]>([]);
  const [testimonials, setTestimonials] = useState<WellnessTestimonial[]>([]);

  // Fetch data
  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getAllWellnessData();
        setSettings(data.settings);
        setPackages(data.packages);
        setServices(data.services);
        setTestimonials(data.testimonials);
      } catch (error) {
        console.error('Error fetching wellness data:', error);
      }
      setLoading(false);
    };
    fetchData();
  }, []);

  const handleBookPackage = (pkg: WellnessPackage) => {
    const params = new URLSearchParams({
      package: pkg.name,
      price: pkg.price.toString(),
      duration: pkg.duration,
      resort: pkg.resort,
      type: 'wellness'
    });
    navigate(`/booking/wellness?${params.toString()}`);
  };

  // Filtered packages
  const filteredPackages = activeFilter === 'all' 
    ? packages 
    : packages.filter(p => p.category === activeFilter);

  const featuredPackages = packages.filter(p => p.isFeatured);

  // Settings with defaults
  const heroTitle = settings?.heroTitle || 'Wellness & Spa Retreats';
  const heroSubtitle = settings?.heroSubtitle || 'Rejuvenate your body, mind, and soul';
  const heroTagline = settings?.heroTagline || 'Luxury Wellness Experiences';
  const heroImageUrl = settings?.heroImageUrl || 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=1920&q=80';
  const phoneNumber = settings?.phoneNumber || '+94 777 721 999';

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
        <Loader2 className="w-12 h-12 animate-spin text-rose-500" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a]">
      <Header />

      {/* ===== HERO SECTION ===== */}
      <section className="relative h-screen overflow-hidden">
        <div className="absolute inset-0">
          <img src={heroImageUrl} alt="Wellness" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black" />
        </div>

        {/* Decorative Lines */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-0 left-1/4 w-px h-full bg-gradient-to-b from-transparent via-rose-500/30 to-transparent" />
          <div className="absolute top-0 right-1/4 w-px h-full bg-gradient-to-b from-transparent via-rose-500/30 to-transparent" />
        </div>

        <div className="relative h-full flex flex-col items-center justify-center px-4 text-center">
          <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 1.5 }} className="mb-8">
            <div className="w-24 h-24 mx-auto mb-6 relative">
              <div className="absolute inset-0 border-2 border-rose-500/50 rounded-full animate-pulse" />
              <div className="absolute inset-2 border border-rose-400/30 rounded-full" />
              <Sparkles className="w-12 h-12 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-rose-400" />
            </div>
          </motion.div>

          <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1, delay: 0.3 }} className="text-rose-400 tracking-[0.4em] uppercase text-sm font-light mb-6">
            {heroTagline}
          </motion.p>

          <motion.h1 initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1.2, delay: 0.5 }} className="text-5xl md:text-7xl lg:text-8xl font-light text-white mb-6 tracking-tight">
            <span className="block font-extralight">{heroTitle.split(' ').slice(0, 2).join(' ')}</span>
            <span className="block font-serif italic text-rose-300">{heroTitle.split(' ').slice(2).join(' ') || 'Retreats'}</span>
          </motion.h1>

          <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1, delay: 0.8 }} className="text-xl md:text-2xl text-white/70 font-light max-w-2xl mb-12">
            {heroSubtitle}
          </motion.p>

          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1, delay: 1.2 }} className="flex flex-col sm:flex-row gap-6">
            <Button size="lg" className="bg-gradient-to-r from-rose-600 to-rose-500 hover:from-rose-500 hover:to-rose-400 text-white font-medium px-12 py-7 text-lg tracking-wide" onClick={() => document.getElementById('packages')?.scrollIntoView({ behavior: 'smooth' })}>
              <Sparkles className="mr-3 w-5 h-5" />Explore Packages
            </Button>
            <Button size="lg" variant="outline" className="border-rose-500/50 text-rose-300 hover:bg-rose-500/10 hover:border-rose-400 px-12 py-7 text-lg tracking-wide bg-transparent" onClick={() => document.getElementById('services')?.scrollIntoView({ behavior: 'smooth' })}>
              Spa Services
            </Button>
          </motion.div>

          {/* Scroll Indicator */}
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 2 }} className="absolute bottom-12 left-1/2 -translate-x-1/2">
            <div className="flex flex-col items-center gap-2">
              <span className="text-rose-500/60 text-xs tracking-[0.3em] uppercase">Scroll</span>
              <div className="w-px h-16 bg-gradient-to-b from-rose-500/60 to-transparent" />
            </div>
          </motion.div>
        </div>
      </section>

      {/* ===== FEATURED PACKAGES ===== */}
      {featuredPackages.length > 0 && (
        <section className="py-24 px-4 bg-gradient-to-b from-[#0a0a0a] to-[#0f0f0f]">
          <div className="container mx-auto max-w-7xl">
            <motion.div initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-16">
              <p className="text-rose-500 tracking-[0.3em] uppercase text-sm mb-4">Featured</p>
              <h2 className="text-4xl md:text-5xl font-light text-white">Most <span className="font-serif italic text-rose-400">Popular</span> Retreats</h2>
            </motion.div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {featuredPackages.slice(0, 3).map((pkg, index) => {
                const Icon = categoryIcons[pkg.category] || Sparkles;
                return (
                  <motion.div key={pkg.id} initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: index * 0.1 }} className="group cursor-pointer" onClick={() => setSelectedPackage(pkg)}>
                    <div className="relative h-[500px] rounded-2xl overflow-hidden">
                      <img src={pkg.image} alt={pkg.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />
                      
                      {/* Save Badge */}
                      {pkg.originalPrice && pkg.originalPrice > pkg.price && (
                        <div className="absolute top-4 right-4 px-3 py-1 bg-emerald-500 text-white text-sm font-medium rounded-full">
                          Save ${pkg.originalPrice - pkg.price}
                        </div>
                      )}

                      <div className="absolute inset-0 p-6 flex flex-col justify-end">
                        <Badge className={`w-fit mb-3 bg-gradient-to-r ${categoryColors[pkg.category]} text-white border-0`}>
                          <Icon className="w-3 h-3 mr-1" />{pkg.category}
                        </Badge>
                        <h3 className="text-2xl font-light text-white mb-2">{pkg.name}</h3>
                        <p className="text-white/60 text-sm mb-3">{pkg.tagline}</p>
                        
                        <div className="flex items-center gap-4 text-white/50 text-sm mb-4">
                          <span className="flex items-center gap-1"><Clock className="w-4 h-4" />{pkg.duration}</span>
                          <span className="flex items-center gap-1"><MapPin className="w-4 h-4" />{pkg.location}</span>
                        </div>

                        <div className="flex items-center justify-between">
                          <div>
                            <span className="text-white/40 text-xs">From</span>
                            <p className="text-2xl font-light text-rose-400">${pkg.price.toLocaleString()}</p>
                          </div>
                          <Button size="sm" className="bg-rose-500 hover:bg-rose-400 text-white opacity-0 group-hover:opacity-100 transition-opacity">
                            View Details
                          </Button>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* ===== ALL PACKAGES ===== */}
      <section id="packages" className="py-24 px-4 bg-[#080808]">
        <div className="container mx-auto max-w-7xl">
          <motion.div initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-12">
            <p className="text-rose-500 tracking-[0.3em] uppercase text-sm mb-4">{settings?.packagesSubtitle || 'Multi-Day Experiences'}</p>
            <h2 className="text-4xl md:text-5xl font-light text-white">{settings?.packagesTitle || 'Wellness Packages'}</h2>
          </motion.div>

          {/* Filter Tabs */}
          <div className="flex flex-wrap justify-center gap-3 mb-12">
            {['all', 'spa', 'detox', 'mindfulness', 'luxury', 'retreat'].map((filter) => (
              <Button key={filter} variant={activeFilter === filter ? 'default' : 'outline'} onClick={() => setActiveFilter(filter)} className={activeFilter === filter ? 'bg-rose-500 hover:bg-rose-400 text-white' : 'border-white/20 text-white/70 hover:bg-white/10 bg-transparent'}>
                {filter === 'all' ? 'All Packages' : filter.charAt(0).toUpperCase() + filter.slice(1)}
              </Button>
            ))}
          </div>

          {/* Package Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredPackages.map((pkg, index) => {
              const Icon = categoryIcons[pkg.category] || Sparkles;
              return (
                <motion.div key={pkg.id} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: index * 0.05 }} className="group cursor-pointer" onClick={() => setSelectedPackage(pkg)}>
                  <Card className="h-full bg-white/5 border-white/10 hover:border-rose-500/30 transition-all overflow-hidden">
                    <div className="relative h-48 overflow-hidden">
                      <img src={pkg.image} alt={pkg.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
                      <Badge className={`absolute top-3 left-3 bg-gradient-to-r ${categoryColors[pkg.category]} text-white border-0`}>
                        <Icon className="w-3 h-3 mr-1" />{pkg.category}
                      </Badge>
                      <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between">
                        <span className="text-white/70 text-sm">{pkg.duration}</span>
                        <div className="flex items-center gap-1">
                          <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                          <span className="text-white text-sm">{pkg.rating}</span>
                        </div>
                      </div>
                    </div>
                    <CardContent className="p-4">
                      <h3 className="text-lg font-medium text-white mb-1">{pkg.name}</h3>
                      <p className="text-white/50 text-sm mb-3">{pkg.resort}, {pkg.location}</p>
                      <div className="flex items-center justify-between">
                        <div>
                          <span className="text-white/40 text-xs">From</span>
                          <p className="text-xl font-light text-rose-400">${pkg.price.toLocaleString()}</p>
                        </div>
                        <Button size="sm" variant="outline" className="border-rose-500/30 text-rose-400 hover:bg-rose-500/10 bg-transparent">
                          Details
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ===== SPA SERVICES ===== */}
      <section id="services" className="py-24 px-4 bg-gradient-to-b from-[#080808] to-[#0a0a0a]">
        <div className="container mx-auto max-w-7xl">
          <motion.div initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-16">
            <p className="text-rose-500 tracking-[0.3em] uppercase text-sm mb-4">{settings?.servicesSubtitle || 'Individual Treatments'}</p>
            <h2 className="text-4xl md:text-5xl font-light text-white">{settings?.servicesTitle || 'Spa Services'}</h2>
          </motion.div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {services.map((service, index) => {
              const Icon = categoryIcons[service.category] || Sparkles;
              return (
                <motion.div key={service.id} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: index * 0.05 }} className="group cursor-pointer">
                  <div className="relative h-48 rounded-xl overflow-hidden">
                    <img src={service.image} alt={service.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent" />
                    <div className="absolute inset-0 p-4 flex flex-col justify-end">
                      <Icon className="w-6 h-6 text-rose-400 mb-2" />
                      <h4 className="text-white text-sm font-medium line-clamp-2">{service.name}</h4>
                      <div className="flex items-center justify-between mt-2">
                        <span className="text-white/50 text-xs">{service.duration}</span>
                        <span className="text-rose-400 font-medium">${service.price}</span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ===== TESTIMONIALS ===== */}
      <section className="py-24 px-4 bg-[#0a0a0a] relative overflow-hidden">
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-rose-500 rounded-full blur-[200px]" />
        </div>

        <div className="container mx-auto max-w-6xl relative">
          <motion.div initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-16">
            <p className="text-rose-500 tracking-[0.3em] uppercase text-sm mb-4">Testimonials</p>
            <h2 className="text-4xl md:text-5xl font-light text-white">Guest <span className="font-serif italic text-rose-400">Experiences</span></h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <motion.div key={testimonial.id} initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: index * 0.2 }}>
                <div className="p-8 bg-gradient-to-b from-white/5 to-transparent border border-white/10 rounded-2xl h-full">
                  <Quote className="w-10 h-10 text-rose-500/30 mb-6" />
                  <p className="text-white/80 font-light italic leading-relaxed mb-6">"{testimonial.quote}"</p>
                  <div className="flex items-center gap-4">
                    <img src={testimonial.image} alt={testimonial.name} className="w-14 h-14 rounded-full object-cover border-2 border-rose-500/30" />
                    <div>
                      <p className="text-white font-medium">{testimonial.name}</p>
                      <p className="text-white/50 text-sm">{testimonial.country}</p>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== CTA ===== */}
      <section className="relative py-40 px-4 overflow-hidden">
        <div className="absolute inset-0">
          <img src={settings?.ctaBackgroundImage || 'https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=1920&q=80'} alt="CTA" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-black/70" />
        </div>

        <div className="relative container mx-auto max-w-4xl text-center">
          <motion.div initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <Sparkles className="w-16 h-16 text-rose-500/50 mx-auto mb-8" />
            <h2 className="text-4xl md:text-6xl font-light text-white mb-6">
              {(settings?.ctaTitle || 'Start Your Journey').split(' ').slice(0, -1).join(' ')} <span className="font-serif italic text-rose-400">{(settings?.ctaTitle || 'Start Your Journey').split(' ').slice(-1)}</span>
            </h2>
            <p className="text-xl text-white/60 font-light mb-12 max-w-2xl mx-auto">{settings?.ctaSubtitle || 'Let us design your perfect retreat experience'}</p>
            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              <Button size="lg" className="bg-gradient-to-r from-rose-600 to-rose-500 hover:from-rose-500 hover:to-rose-400 text-white font-medium px-12 py-7 text-lg" onClick={() => navigate('/booking/wellness')}>
                <Calendar className="mr-3 w-5 h-5" />Book Your Retreat
              </Button>
              <Button size="lg" variant="outline" className="border-white/30 text-white hover:bg-white/10 px-12 py-7 text-lg bg-transparent">
                <Phone className="mr-3 w-5 h-5" />{phoneNumber}
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Package Modal */}
      <AnimatePresence>
        {selectedPackage && (
          <PackageModal
            pkg={selectedPackage}
            onClose={() => setSelectedPackage(null)}
            onBook={() => {
              handleBookPackage(selectedPackage);
              setSelectedPackage(null);
            }}
          />
        )}
      </AnimatePresence>

      <Footer />
    </div>
  );
};

export default WellnessPackagesNew;
