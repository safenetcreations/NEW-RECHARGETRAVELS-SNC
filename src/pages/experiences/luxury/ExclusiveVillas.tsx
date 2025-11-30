import React, { useState, useEffect, useRef } from 'react';
import { Helmet } from 'react-helmet-async';
import { motion, AnimatePresence, useScroll, useTransform, useInView } from 'framer-motion';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Crown, Home, MapPin, Phone, Mail, Star, ChevronLeft, ChevronRight, Check, Users, Bed, Bath, Sparkles, ArrowRight, Award, Waves, Mountain, Car, Flower2, Baby, PawPrint, Heart, Play, Quote, Shield, Gem, ChefHat } from 'lucide-react';
import { db } from '@/lib/firebase';
import { collection, addDoc } from 'firebase/firestore';
import { toast } from 'sonner';
import { luxuryPagesService, LuxuryContactInfo } from '@/services/luxuryPagesService';

const heroSlides = [
  { url: 'https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=1920&q=90', title: 'Beachfront', subtitle: 'Paradise', tagline: 'Where the ocean meets opulence' },
  { url: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1920&q=90', title: 'Heritage', subtitle: 'Estates', tagline: 'Colonial grandeur, modern luxury' },
  { url: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=1920&q=90', title: 'Mountain', subtitle: 'Retreats', tagline: 'Elevated living among the clouds' },
  { url: 'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?w=1920&q=90', title: 'Private', subtitle: 'Sanctuaries', tagline: 'Your world, your rules' }
];

const villaCollection = [
  { id: 'ocean-pearl', name: 'Ocean Pearl Villa', location: 'Mirissa', region: 'Southern Coast', image: 'https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=1200&q=90', bedrooms: 6, bathrooms: 7, maxGuests: 12, poolSize: '20m Infinity', style: 'Contemporary Tropical', features: ['Beachfront', 'Infinity Pool', 'Private Beach', 'Cinema Room', 'Wine Cellar', 'Spa Pavilion'], amenities: ['24/7 Butler', 'Private Chef', 'Airport Transfer'], pricePerNight: 2500, description: 'A stunning contemporary masterpiece perched on Mirissa\'s dramatic coastline with panoramic Indian Ocean views.', highlights: ['Whale Season Nov-Apr', 'Direct Beach', 'Award-Winning Design'], rating: 4.9, reviews: 47 },
  { id: 'tea-garden', name: 'Tea Garden Estate', location: 'Nuwara Eliya', region: 'Hill Country', image: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1200&q=90', bedrooms: 8, bathrooms: 9, maxGuests: 16, poolSize: 'Heated Indoor', style: 'Colonial Heritage', features: ['Tea Plantation', 'Indoor Pool', 'Library', 'Billiards', 'Fireplaces', 'Garden Maze'], amenities: ['Estate Manager', 'Private Chef', 'Chauffeur'], pricePerNight: 3200, description: 'A magnificent 1890s colonial mansion set within a 15-acre working tea plantation.', highlights: ['Historic 1890s', 'Cool Climate', 'Working Estate'], rating: 5.0, reviews: 32 },
  { id: 'jungle-hideaway', name: 'Jungle Hideaway', location: 'Yala', region: 'Wildlife Zone', image: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=1200&q=90', bedrooms: 4, bathrooms: 5, maxGuests: 8, poolSize: 'Natural Rock', style: 'Eco-Luxury', features: ['Safari Views', 'Rock Pool', 'Treehouse Suite', 'Observation Deck', 'Solar Powered'], amenities: ['Safari Guide', 'Bush Chef', 'Game Drives'], pricePerNight: 1800, description: 'Carbon-neutral retreat at the edge of Yala National Park with intimate wildlife encounters.', highlights: ['Adjacent to Yala', 'Leopard Sightings', 'Carbon Neutral'], rating: 4.8, reviews: 56 },
  { id: 'galle-mansion', name: 'Galle Fort Mansion', location: 'Galle Fort', region: 'Heritage Coast', image: 'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?w=1200&q=90', bedrooms: 5, bathrooms: 6, maxGuests: 10, poolSize: 'Courtyard', style: 'Dutch Colonial', features: ['UNESCO Site', 'Courtyard Pool', 'Sunset Rooftop', 'Antiques', 'Art Collection'], amenities: ['Butler', 'In-House Chef', 'Fort Tours'], pricePerNight: 2100, description: 'Meticulously restored 17th-century Dutch mansion within UNESCO World Heritage Galle Fort.', highlights: ['UNESCO Heritage', '17th Century', 'Walk to Dining'], rating: 4.9, reviews: 68 },
  { id: 'kandy-royal', name: 'Kandy Royal Residence', location: 'Kandy', region: 'Cultural Triangle', image: 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=1200&q=90', bedrooms: 7, bathrooms: 8, maxGuests: 14, poolSize: '18m Infinity', style: 'Kandyan Contemporary', features: ['Lake Views', 'Infinity Pool', 'Meditation Pavilion', 'Ayurveda Center', 'Spice Garden'], amenities: ['Estate Staff', 'Ayurveda Doctor', 'Cultural Guide'], pricePerNight: 2800, description: 'Grand hillside estate overlooking sacred Kandy Lake with in-house Ayurveda center.', highlights: ['Lake Views', 'In-House Ayurveda', 'Temple Proximity'], rating: 4.9, reviews: 41 },
  { id: 'trinco-beach', name: 'Trincomalee Beach House', location: 'Trincomalee', region: 'East Coast', image: 'https://images.unsplash.com/photo-1499793983690-e29da59ef1c2?w=1200&q=90', bedrooms: 5, bathrooms: 5, maxGuests: 10, poolSize: '15m Beachfront', style: 'Tropical Modern', features: ['Private Beach', 'Beachfront Pool', 'Dive Center', 'Water Sports', 'Beach Cabanas'], amenities: ['Beach Butler', 'Chef', 'Dive Master'], pricePerNight: 1900, description: 'Pristine beachfront sanctuary on Sri Lanka\'s untouched east coast with in-house dive center.', highlights: ['Best Diving Apr-Oct', 'Whale Season', 'Private Beach'], rating: 4.8, reviews: 29 }
];

const testimonials = [
  { name: 'James & Victoria Chen', location: 'Singapore', villa: 'Ocean Pearl Villa', image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&q=80', text: 'Celebrating our anniversary here was nothing short of magical. The staff anticipated our every need.', rating: 5 },
  { name: 'The Morrison Family', location: 'London, UK', villa: 'Tea Garden Estate', image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&q=80', text: 'A week wasn\'t enough. The children learned about tea, and evenings by the fire were pure bliss.', rating: 5 },
  { name: 'Robert van der Berg', location: 'Amsterdam', villa: 'Jungle Hideaway', image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&q=80', text: 'Saw three leopards in four days. The bush dinner under the stars was the highlight of a lifetime.', rating: 5 }
];

const AnimatedSection = ({ children, className = '' }: { children: React.ReactNode; className?: string }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  return (
    <motion.div ref={ref} initial={{ opacity: 0, y: 60 }} animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 60 }} transition={{ duration: 0.8 }} className={className}>
      {children}
    </motion.div>
  );
};

const ExclusiveVillas = () => {
  const [heroIndex, setHeroIndex] = useState(0);
  const [selectedVilla, setSelectedVilla] = useState<typeof villaCollection[0] | null>(null);
  const [loading, setLoading] = useState(false);
  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const heroY = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);
  
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', checkIn: '', checkOut: '', guests: '4', villa: '', occasion: '', requests: '' });

  useEffect(() => {
    const timer = setInterval(() => setHeroIndex((prev) => (prev + 1) % heroSlides.length), 7000);
    return () => clearInterval(timer);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await addDoc(collection(db, 'villaInquiries'), { ...formData, createdAt: new Date(), status: 'new' });
      toast.success('Your villa inquiry has been received. A specialist will contact you within 2 hours.', { duration: 5000, icon: '🏛️' });
      setFormData({ name: '', email: '', phone: '', checkIn: '', checkOut: '', guests: '4', villa: '', occasion: '', requests: '' });
    } catch (error) {
      toast.error('Please try again or contact us directly.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Helmet>
        <title>Exclusive Villa Rentals Sri Lanka | Private Luxury Estates | Recharge Travels</title>
        <meta name="description" content="Rent exclusive private villas in Sri Lanka. Beachfront estates, colonial mansions, safari lodges. Full staff, private chef, pool. From $1,800/night." />
      </Helmet>
      <Header />
      <main className="min-h-screen bg-[#0a0a0a] text-white overflow-hidden">
        {/* CINEMATIC HERO */}
        <section ref={heroRef} className="relative h-screen overflow-hidden">
          <motion.div style={{ y: heroY }} className="absolute inset-0">
            <AnimatePresence mode="wait">
              <motion.div key={heroIndex} initial={{ opacity: 0, scale: 1.2 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} transition={{ duration: 2 }} className="absolute inset-0">
                <img src={heroSlides[heroIndex].url} alt={heroSlides[heroIndex].title} className="w-full h-full object-cover" />
              </motion.div>
            </AnimatePresence>
            <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-transparent to-[#0a0a0a]" />
            <div className="absolute inset-0 bg-gradient-to-r from-black/50 via-transparent to-black/50" />
          </motion.div>

          <motion.div style={{ opacity: heroOpacity }} className="relative z-10 h-full flex flex-col justify-center items-center text-center px-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1, delay: 0.5 }} className="max-w-5xl">
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1, delay: 0.8 }} className="inline-flex items-center gap-3 mb-8">
                <div className="h-px w-12 bg-gradient-to-r from-transparent to-amber-400" />
                <span className="text-amber-400 font-light tracking-[0.3em] text-xs uppercase">Curated Collection</span>
                <div className="h-px w-12 bg-gradient-to-l from-transparent to-amber-400" />
              </motion.div>

              <div className="overflow-hidden mb-4">
                <AnimatePresence mode="wait">
                  <motion.h1 key={heroIndex} initial={{ y: 100 }} animate={{ y: 0 }} exit={{ y: -100 }} transition={{ duration: 0.8 }} className="text-6xl md:text-8xl lg:text-9xl font-extralight tracking-tight text-white">
                    {heroSlides[heroIndex].title}
                  </motion.h1>
                </AnimatePresence>
              </div>
              <div className="overflow-hidden mb-8">
                <AnimatePresence mode="wait">
                  <motion.h2 key={heroIndex} initial={{ y: 80 }} animate={{ y: 0 }} exit={{ y: -80 }} transition={{ duration: 0.8, delay: 0.1 }} className="text-5xl md:text-7xl lg:text-8xl font-extralight tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-amber-400 to-amber-200">
                    {heroSlides[heroIndex].subtitle}
                  </motion.h2>
                </AnimatePresence>
              </div>

              <AnimatePresence mode="wait">
                <motion.p key={heroIndex} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="text-lg md:text-xl text-gray-400 font-light tracking-wide mb-12">
                  {heroSlides[heroIndex].tagline}
                </motion.p>
              </AnimatePresence>

              <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1, delay: 1.2 }} className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg" className="group bg-gradient-to-r from-amber-500 via-amber-400 to-amber-500 hover:from-amber-400 hover:to-amber-400 text-black px-12 py-7 text-sm font-medium tracking-widest uppercase rounded-none" onClick={() => document.getElementById('collection')?.scrollIntoView({ behavior: 'smooth' })}>
                  Explore Collection <ArrowRight className="w-4 h-4 ml-3 group-hover:translate-x-1 transition-transform" />
                </Button>
                <Button size="lg" variant="outline" className="border border-white/20 text-white hover:bg-white/5 hover:border-amber-400/50 px-12 py-7 text-sm font-medium tracking-widest uppercase rounded-none backdrop-blur-sm" onClick={() => document.getElementById('booking')?.scrollIntoView({ behavior: 'smooth' })}>
                  <Phone className="w-4 h-4 mr-3" /> Contact Us
                </Button>
              </motion.div>
            </motion.div>
          </motion.div>

          <div className="absolute bottom-12 left-1/2 -translate-x-1/2 z-20 flex items-center gap-6">
            {heroSlides.map((_, idx) => (
              <button key={idx} onClick={() => setHeroIndex(idx)} className="group relative">
                <div className={`w-16 h-0.5 transition-all duration-500 ${idx === heroIndex ? 'bg-amber-400' : 'bg-white/20 group-hover:bg-white/40'}`} />
                <span className={`absolute -top-6 left-1/2 -translate-x-1/2 text-xs transition-all ${idx === heroIndex ? 'text-amber-400 opacity-100' : 'text-white/40 opacity-0 group-hover:opacity-100'}`}>0{idx + 1}</span>
              </button>
            ))}
          </div>
        </section>

        {/* INTRODUCTION */}
        <section className="py-32 relative">
          <div className="absolute inset-0 bg-gradient-to-b from-[#0a0a0a] via-[#111] to-[#0a0a0a]" />
          <div className="container mx-auto px-4 relative z-10">
            <AnimatedSection className="max-w-4xl mx-auto text-center">
              <motion.div initial={{ scale: 0 }} whileInView={{ scale: 1 }} viewport={{ once: true }} className="w-20 h-20 mx-auto mb-8 rounded-full bg-gradient-to-br from-amber-500/20 to-amber-600/10 flex items-center justify-center border border-amber-500/20">
                <Crown className="w-8 h-8 text-amber-400" />
              </motion.div>
              <h2 className="text-4xl md:text-5xl font-extralight mb-8 tracking-tight">Where <span className="text-amber-400 font-light">Extraordinary</span> Becomes Everyday</h2>
              <p className="text-lg text-gray-400 font-light leading-relaxed mb-12">Each villa in our collection has been personally inspected and chosen for its exceptional character, uncompromising service, and ability to transform a stay into a story worth telling.</p>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                {[{ value: '6', label: 'Curated Villas', icon: Home }, { value: '4-8', label: 'Bedrooms', icon: Bed }, { value: '24/7', label: 'Butler Service', icon: Award }, { value: '100%', label: 'Privacy', icon: Shield }].map((stat, idx) => (
                  <motion.div key={idx} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: idx * 0.1 }} className="text-center">
                    <stat.icon className="w-6 h-6 text-amber-400/60 mx-auto mb-3" />
                    <div className="text-3xl font-light text-white mb-1">{stat.value}</div>
                    <div className="text-xs text-gray-500 uppercase tracking-widest">{stat.label}</div>
                  </motion.div>
                ))}
              </div>
            </AnimatedSection>
          </div>
        </section>

        {/* VILLA COLLECTION */}
        <section id="collection" className="py-24 bg-[#0a0a0a]">
          <div className="container mx-auto px-4">
            <AnimatedSection className="text-center mb-20">
              <div className="inline-flex items-center gap-3 mb-6">
                <div className="h-px w-12 bg-gradient-to-r from-transparent to-amber-400/50" />
                <span className="text-amber-400/80 font-light tracking-[0.3em] text-xs uppercase">The Collection</span>
                <div className="h-px w-12 bg-gradient-to-l from-transparent to-amber-400/50" />
              </div>
              <h2 className="text-4xl md:text-6xl font-extralight tracking-tight">Six <span className="text-amber-400">Exceptional</span> Estates</h2>
            </AnimatedSection>

            <div className="space-y-32">
              {villaCollection.map((villa, idx) => (
                <AnimatedSection key={villa.id}>
                  <div className={`grid lg:grid-cols-2 gap-12 items-center ${idx % 2 === 1 ? 'lg:flex-row-reverse' : ''}`}>
                    <div className={idx % 2 === 1 ? 'lg:order-2' : ''}>
                      <motion.div whileHover={{ scale: 1.02 }} transition={{ duration: 0.6 }} className="relative aspect-[4/3] overflow-hidden">
                        <img src={villa.image} alt={villa.name} className="w-full h-full object-cover" />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                        <div className="absolute top-6 left-6 bg-black/60 backdrop-blur-md px-4 py-2 flex items-center gap-2">
                          <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
                          <span className="text-white font-medium">{villa.rating}</span>
                          <span className="text-gray-400 text-sm">({villa.reviews})</span>
                        </div>
                        <div className="absolute bottom-6 right-6 text-right">
                          <div className="text-xs text-gray-400 uppercase tracking-wider mb-1">From</div>
                          <div className="text-2xl font-light text-white">${villa.pricePerNight.toLocaleString()}<span className="text-sm text-gray-400">/night</span></div>
                        </div>
                      </motion.div>
                    </div>
                    <div className={`space-y-6 ${idx % 2 === 1 ? 'lg:order-1' : ''}`}>
                      <div>
                        <Badge className="bg-amber-500/10 text-amber-400 border-amber-500/20 mb-4 font-light tracking-wider">{villa.region}</Badge>
                        <h3 className="text-3xl md:text-4xl font-extralight mb-2">{villa.name}</h3>
                        <div className="flex items-center gap-2 text-gray-400"><MapPin className="w-4 h-4 text-amber-400/60" /><span className="font-light">{villa.location}</span></div>
                      </div>
                      <p className="text-gray-400 font-light leading-relaxed">{villa.description}</p>
                      <div className="flex gap-8 py-6 border-y border-white/10">
                        {[{ icon: Bed, value: villa.bedrooms, label: 'Bedrooms' }, { icon: Bath, value: villa.bathrooms, label: 'Bathrooms' }, { icon: Users, value: villa.maxGuests, label: 'Guests' }, { icon: Waves, value: villa.poolSize.split(' ')[0], label: 'Pool' }].map((spec, i) => (
                          <div key={i} className="text-center">
                            <spec.icon className="w-5 h-5 text-amber-400/60 mx-auto mb-2" />
                            <div className="text-xl font-light">{spec.value}</div>
                            <div className="text-xs text-gray-500 uppercase tracking-wider">{spec.label}</div>
                          </div>
                        ))}
                      </div>
                      <div className="flex flex-wrap gap-3">
                        {villa.highlights.map((h, hIdx) => (
                          <span key={hIdx} className="inline-flex items-center gap-2 px-4 py-2 bg-white/5 text-sm text-gray-300"><Gem className="w-3 h-3 text-amber-400/60" />{h}</span>
                        ))}
                      </div>
                      <div className="flex gap-4 pt-4">
                        <Button className="flex-1 bg-gradient-to-r from-amber-500 to-amber-400 hover:from-amber-400 hover:to-amber-300 text-black font-medium tracking-wider uppercase text-sm py-6 rounded-none" onClick={() => { setFormData({ ...formData, villa: villa.name }); document.getElementById('booking')?.scrollIntoView({ behavior: 'smooth' }); }}>
                          Reserve Now <ArrowRight className="w-4 h-4 ml-2" />
                        </Button>
                        <a href={`https://wa.me/94777721999?text=I'm%20interested%20in%20${encodeURIComponent(villa.name)}`} target="_blank" rel="noopener noreferrer" className="px-6 py-4 border border-white/20 hover:border-[#25D366] hover:bg-[#25D366]/10 transition-all flex items-center gap-2">
                          <svg className="w-5 h-5 text-[#25D366]" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/></svg>
                        </a>
                      </div>
                    </div>
                  </div>
                </AnimatedSection>
              ))}
            </div>
          </div>
        </section>

        {/* SERVICES */}
        <section className="py-32 bg-gradient-to-b from-[#0a0a0a] via-[#0f0f0f] to-[#0a0a0a] relative overflow-hidden">
          <div className="absolute inset-0 opacity-30"><div className="absolute top-0 left-1/4 w-96 h-96 bg-amber-500/5 rounded-full blur-3xl" /><div className="absolute bottom-0 right-1/4 w-96 h-96 bg-amber-500/5 rounded-full blur-3xl" /></div>
          <div className="container mx-auto px-4 relative z-10">
            <AnimatedSection className="text-center mb-20">
              <div className="inline-flex items-center gap-3 mb-6"><div className="h-px w-12 bg-gradient-to-r from-transparent to-amber-400/50" /><span className="text-amber-400/80 font-light tracking-[0.3em] text-xs uppercase">Bespoke Service</span><div className="h-px w-12 bg-gradient-to-l from-transparent to-amber-400/50" /></div>
              <h2 className="text-4xl md:text-6xl font-extralight tracking-tight mb-6">Every Detail, <span className="text-amber-400">Perfected</span></h2>
            </AnimatedSection>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
              {[{ icon: ChefHat, title: 'Private Chef', desc: 'Personalized menus' }, { icon: Flower2, title: 'Spa & Wellness', desc: 'In-villa treatments' }, { icon: Car, title: 'Chauffeur', desc: 'Luxury fleet' }, { icon: Baby, title: 'Family Care', desc: 'Nannies & activities' }, { icon: PawPrint, title: 'Pet Friendly', desc: 'Furry friends welcome' }, { icon: Heart, title: 'Celebrations', desc: 'Special occasions' }].map((service, idx) => (
                <motion.div key={idx} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: idx * 0.1 }} whileHover={{ y: -8 }} className="group text-center p-6 bg-white/[0.02] border border-white/5 hover:border-amber-400/20 transition-all duration-500">
                  <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-amber-500/10 to-amber-600/5 flex items-center justify-center group-hover:from-amber-500/20 group-hover:to-amber-600/10 transition-all"><service.icon className="w-7 h-7 text-amber-400/80" /></div>
                  <h3 className="text-white font-light mb-1">{service.title}</h3>
                  <p className="text-xs text-gray-500">{service.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* TESTIMONIALS */}
        <section className="py-32 bg-[#0a0a0a]">
          <div className="container mx-auto px-4">
            <AnimatedSection className="text-center mb-16">
              <div className="inline-flex items-center gap-3 mb-6"><div className="h-px w-12 bg-gradient-to-r from-transparent to-amber-400/50" /><span className="text-amber-400/80 font-light tracking-[0.3em] text-xs uppercase">Guest Stories</span><div className="h-px w-12 bg-gradient-to-l from-transparent to-amber-400/50" /></div>
              <h2 className="text-4xl md:text-5xl font-extralight tracking-tight">In Their <span className="text-amber-400">Words</span></h2>
            </AnimatedSection>
            <div className="grid md:grid-cols-3 gap-8">
              {testimonials.map((testimonial, idx) => (
                <motion.div key={idx} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: idx * 0.2 }} className="bg-white/[0.02] border border-white/5 p-8 relative">
                  <Quote className="absolute top-6 right-6 w-8 h-8 text-amber-400/20" />
                  <div className="flex gap-1 mb-6">{[...Array(testimonial.rating)].map((_, i) => <Star key={i} className="w-4 h-4 text-amber-400 fill-amber-400" />)}</div>
                  <p className="text-gray-300 font-light leading-relaxed mb-8 italic">"{testimonial.text}"</p>
                  <div className="flex items-center gap-4">
                    <img src={testimonial.image} alt={testimonial.name} className="w-12 h-12 rounded-full object-cover" />
                    <div><div className="text-white font-light">{testimonial.name}</div><div className="text-xs text-gray-500">{testimonial.location}</div></div>
                  </div>
                  <div className="mt-4 pt-4 border-t border-white/5"><span className="text-xs text-amber-400/60 uppercase tracking-wider">{testimonial.villa}</span></div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* BOOKING FORM */}
        <section id="booking" className="py-32 bg-gradient-to-b from-[#0a0a0a] to-[#111] relative">
          <div className="absolute inset-0 opacity-20"><div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-amber-500/10 rounded-full blur-[120px]" /></div>
          <div className="container mx-auto px-4 relative z-10">
            <div className="max-w-4xl mx-auto">
              <AnimatedSection className="text-center mb-16">
                <div className="inline-flex items-center gap-3 mb-6"><div className="h-px w-12 bg-gradient-to-r from-transparent to-amber-400/50" /><span className="text-amber-400/80 font-light tracking-[0.3em] text-xs uppercase">Reserve</span><div className="h-px w-12 bg-gradient-to-l from-transparent to-amber-400/50" /></div>
                <h2 className="text-4xl md:text-6xl font-extralight tracking-tight mb-4">Begin Your <span className="text-amber-400">Journey</span></h2>
                <p className="text-gray-400 font-light">Our villa specialists will curate the perfect experience</p>
              </AnimatedSection>

              <form onSubmit={handleSubmit} className="bg-white/[0.02] border border-white/10 p-8 md:p-12">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                  <div><label className="block text-xs font-light text-gray-400 uppercase tracking-wider mb-2">Full Name</label><Input required placeholder="Your name" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} className="bg-white/5 border-white/10 text-white placeholder:text-gray-600 rounded-none h-14 focus:border-amber-400/50" /></div>
                  <div><label className="block text-xs font-light text-gray-400 uppercase tracking-wider mb-2">Email</label><Input required type="email" placeholder="your@email.com" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} className="bg-white/5 border-white/10 text-white placeholder:text-gray-600 rounded-none h-14 focus:border-amber-400/50" /></div>
                  <div><label className="block text-xs font-light text-gray-400 uppercase tracking-wider mb-2">Phone</label><Input required placeholder="+1 234 567 8900" value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} className="bg-white/5 border-white/10 text-white placeholder:text-gray-600 rounded-none h-14 focus:border-amber-400/50" /></div>
                  <div><label className="block text-xs font-light text-gray-400 uppercase tracking-wider mb-2">Guests</label><Input type="number" min="1" max="20" value={formData.guests} onChange={(e) => setFormData({ ...formData, guests: e.target.value })} className="bg-white/5 border-white/10 text-white rounded-none h-14 focus:border-amber-400/50" /></div>
                  <div><label className="block text-xs font-light text-gray-400 uppercase tracking-wider mb-2">Check-in</label><Input required type="date" value={formData.checkIn} onChange={(e) => setFormData({ ...formData, checkIn: e.target.value })} className="bg-white/5 border-white/10 text-white rounded-none h-14 focus:border-amber-400/50" /></div>
                  <div><label className="block text-xs font-light text-gray-400 uppercase tracking-wider mb-2">Check-out</label><Input required type="date" value={formData.checkOut} onChange={(e) => setFormData({ ...formData, checkOut: e.target.value })} className="bg-white/5 border-white/10 text-white rounded-none h-14 focus:border-amber-400/50" /></div>
                  <div><label className="block text-xs font-light text-gray-400 uppercase tracking-wider mb-2">Preferred Villa</label><select value={formData.villa} onChange={(e) => setFormData({ ...formData, villa: e.target.value })} className="w-full bg-white/5 border border-white/10 text-white rounded-none h-14 px-3 focus:border-amber-400/50 focus:outline-none"><option value="" className="bg-[#111]">Any available</option>{villaCollection.map((v) => <option key={v.id} value={v.name} className="bg-[#111]">{v.name}</option>)}</select></div>
                  <div><label className="block text-xs font-light text-gray-400 uppercase tracking-wider mb-2">Occasion</label><select value={formData.occasion} onChange={(e) => setFormData({ ...formData, occasion: e.target.value })} className="w-full bg-white/5 border border-white/10 text-white rounded-none h-14 px-3 focus:border-amber-400/50 focus:outline-none"><option value="" className="bg-[#111]">Select occasion</option><option value="vacation" className="bg-[#111]">Family Vacation</option><option value="honeymoon" className="bg-[#111]">Honeymoon</option><option value="anniversary" className="bg-[#111]">Anniversary</option><option value="birthday" className="bg-[#111]">Birthday</option><option value="wedding" className="bg-[#111]">Wedding/Event</option><option value="retreat" className="bg-[#111]">Corporate Retreat</option></select></div>
                </div>
                <div className="mb-8"><label className="block text-xs font-light text-gray-400 uppercase tracking-wider mb-2">Special Requests</label><Textarea placeholder="Dietary requirements, celebrations, specific experiences..." rows={4} value={formData.requests} onChange={(e) => setFormData({ ...formData, requests: e.target.value })} className="bg-white/5 border-white/10 text-white placeholder:text-gray-600 rounded-none focus:border-amber-400/50" /></div>
                <Button type="submit" disabled={loading} className="w-full bg-gradient-to-r from-amber-500 via-amber-400 to-amber-500 hover:from-amber-400 hover:to-amber-400 text-black font-medium tracking-widest uppercase text-sm py-7 rounded-none">{loading ? 'Submitting...' : 'Request Reservation'}<ArrowRight className="w-4 h-4 ml-3" /></Button>
                <p className="text-center text-gray-500 text-xs mt-6 font-light">Complimentary consultation • No booking fees • Response within 2 hours</p>
              </form>
            </div>
          </div>
        </section>

        {/* CONTACT BAR */}
        <section className="py-16 bg-[#111] border-t border-white/5">
          <div className="container mx-auto px-4">
            <div className="flex flex-col lg:flex-row items-center justify-between gap-8">
              <div className="text-center lg:text-left">
                <h3 className="text-2xl font-extralight text-white mb-2">Ready to Experience <span className="text-amber-400">Extraordinary</span>?</h3>
                <p className="text-gray-400 font-light">Our villa specialists are available 7 days a week</p>
              </div>
              <div className="flex flex-wrap justify-center gap-4">
                <a href="https://wa.me/94777721999?text=I'm%20interested%20in%20exclusive%20villa%20rentals" target="_blank" rel="noopener noreferrer" className="group flex items-center gap-3 bg-[#25D366]/10 hover:bg-[#25D366] border border-[#25D366]/30 hover:border-[#25D366] text-white px-8 py-4 transition-all duration-300">
                  <svg className="w-5 h-5 text-[#25D366] group-hover:text-white transition-colors" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/></svg>
                  <span className="font-medium tracking-wider">WhatsApp</span>
                </a>
                <a href="tel:+94777721999" className="flex items-center gap-3 border border-white/20 hover:border-amber-400/50 text-white px-8 py-4 transition-all"><Phone className="w-5 h-5 text-amber-400" /><span className="font-light">+94 777 721 999</span></a>
                <a href="mailto:luxury@rechargetravels.com" className="flex items-center gap-3 border border-white/20 hover:border-amber-400/50 text-white px-8 py-4 transition-all"><Mail className="w-5 h-5 text-amber-400" /><span className="font-light">luxury@rechargetravels.com</span></a>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
};

export default ExclusiveVillas;
