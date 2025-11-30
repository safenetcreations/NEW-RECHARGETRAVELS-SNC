import React, { useState, useRef } from 'react';
import { Helmet } from 'react-helmet-async';
import { motion, useScroll, useTransform, useInView } from 'framer-motion';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Crown, Phone, Mail, ArrowRight, Shield, Clock, Users, Sparkles, Star, Gem, Lock, CheckCircle2, ChefHat, Car, Plane, Heart, Gift, Calendar, Camera, Music, Cake, GlassWater, UserCheck, BadgeCheck, Headphones, Key, Shirt, Stethoscope, Baby, Dog } from 'lucide-react';
import { db } from '@/lib/firebase';
import { collection, addDoc, Timestamp } from 'firebase/firestore';
import { toast } from 'sonner';

const conciergeServices = [
  {
    category: 'Culinary Excellence',
    icon: ChefHat,
    description: 'World-class gastronomy, wherever you are',
    services: [
      { name: 'Private Chef Services', detail: 'Michelin-trained chefs for your villa, yacht, or event. Any cuisine, any dietary requirement.' },
      { name: 'Exclusive Restaurant Access', detail: 'Tables at fully-booked establishments. Private dining rooms. After-hours experiences.' },
      { name: 'Culinary Journeys', detail: 'Market tours with master chefs. Private cooking classes. Wine cellar experiences.' },
      { name: 'Event Catering', detail: 'From intimate dinners to grand celebrations. Complete F&B management.' }
    ]
  },
  {
    category: 'Security & Protection',
    icon: Shield,
    description: 'Absolute safety, complete discretion',
    services: [
      { name: 'Executive Protection', detail: 'Former special forces and intelligence personnel. Licensed and vetted.' },
      { name: 'Advance Security Planning', detail: 'Route reconnaissance. Venue assessment. Threat analysis.' },
      { name: 'Secure Transportation', detail: 'Armored vehicles. Trained drivers. GPS tracking and support teams.' },
      { name: 'Privacy Management', detail: 'Counter-surveillance. Digital security. Media management.' }
    ]
  },
  {
    category: 'Event Production',
    icon: Sparkles,
    description: 'Transforming visions into unforgettable moments',
    services: [
      { name: 'Celebration Design', detail: 'Birthdays, anniversaries, proposals. Every detail curated to perfection.' },
      { name: 'Wedding Planning', detail: 'Destination weddings in Sri Lanka. From intimate ceremonies to grand celebrations.' },
      { name: 'Corporate Events', detail: 'Board retreats. Product launches. Incentive programs. Team experiences.' },
      { name: 'Private Concerts', detail: 'Musicians, performers, DJs. Exclusive entertainment for your event.' }
    ]
  },
  {
    category: 'Lifestyle Management',
    icon: Crown,
    description: 'Every detail of your stay, perfected',
    services: [
      { name: 'Personal Shopping', detail: 'Fashion consultants. Jewelers. Artisans. Delivered to your door.' },
      { name: 'Wellness & Beauty', detail: 'Spa therapists. Personal trainers. Yoga instructors. Nutritionists.' },
      { name: 'Childcare & Nannies', detail: 'Vetted childcare professionals. Educational activities. Complete peace of mind.' },
      { name: 'Pet Services', detail: 'Pet-friendly arrangements. Veterinary access. Walking and sitting services.' }
    ]
  },
  {
    category: 'Transportation Fleet',
    icon: Car,
    description: 'Move in absolute comfort and style',
    services: [
      { name: 'Luxury Ground Fleet', detail: 'Rolls-Royce, Bentley, Maybach. Professional chauffeurs 24/7.' },
      { name: 'Helicopter Services', detail: 'Charter flights. Aerial tours. Medical evacuation capability.' },
      { name: 'Private Jet Coordination', detail: 'Arrivals, departures, domestic transfers. FBO coordination.' },
      { name: 'Yacht Charters', detail: 'Day charters to multi-week voyages. Crewed luxury vessels.' }
    ]
  },
  {
    category: 'Medical & Emergency',
    icon: Stethoscope,
    description: 'Your wellbeing is our priority',
    services: [
      { name: 'Medical Concierge', detail: 'Access to top physicians. Hospital VIP coordination. Health screenings.' },
      { name: 'Emergency Response', detail: '24/7 emergency line. Medical evacuation arrangements. Crisis management.' },
      { name: 'Pharmacy & Prescriptions', detail: 'Medication coordination. Specialist referrals. Health documentation.' },
      { name: 'Wellness Programs', detail: 'Ayurvedic consultations. Detox programs. Recovery and rehabilitation support.' }
    ]
  }
];

const capabilityHighlights = [
  { stat: '24/7', label: 'Availability', desc: 'Round-the-clock response' },
  { stat: '2hr', label: 'Response Time', desc: 'For standard requests' },
  { stat: '15min', label: 'Emergency', desc: 'Critical response time' },
  { stat: '100%', label: 'Discretion', desc: 'Absolute confidentiality' }
];

const AnimatedSection = ({ children, className = '' }: { children: React.ReactNode; className?: string }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  return (
    <motion.div ref={ref} initial={{ opacity: 0, y: 60 }} animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 60 }} transition={{ duration: 1 }} className={className}>
      {children}
    </motion.div>
  );
};

const VIPConcierge = () => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', serviceType: '', arrivalDate: '', duration: '', requirements: '' });
  const [expandedCategory, setExpandedCategory] = useState<string | null>(null);
  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const heroY = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await addDoc(collection(db, 'vipConciergeInquiries'), {
        ...formData,
        type: 'vip-concierge',
        createdAt: Timestamp.now(),
        status: 'new',
        priority: 'vip'
      });
      toast.success('Your request has been received. A dedicated concierge will contact you shortly.', { duration: 6000 });
      setFormData({ name: '', email: '', phone: '', serviceType: '', arrivalDate: '', duration: '', requirements: '' });
    } catch (error) {
      toast.error('Please contact us directly at luxury@rechargetravels.com');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Helmet>
        <title>VIP Concierge Services | Private Chefs, Security, Event Planning | Recharge Travels</title>
        <meta name="description" content="White-glove concierge services in Sri Lanka. Private chefs, executive protection, event production, lifestyle management. Available 24/7 for discerning clients." />
      </Helmet>
      <Header />
      <main className="min-h-screen bg-[#030303] text-white overflow-hidden">
        
        {/* HERO */}
        <section ref={heroRef} className="relative h-[100vh] overflow-hidden">
          <motion.div style={{ y: heroY }} className="absolute inset-0">
            <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=1920&q=90')] bg-cover bg-center" />
            <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-[#030303]" />
          </motion.div>

          <motion.div style={{ opacity: heroOpacity }} className="relative z-10 h-full flex flex-col justify-center items-center text-center px-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 2, delay: 0.5 }} className="max-w-4xl">
              
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1.5, delay: 1 }} className="mb-12">
                <div className="inline-flex items-center gap-4 mb-8">
                  <div className="h-px w-16 bg-gradient-to-r from-transparent via-rose-400/60 to-transparent" />
                  <Gem className="w-6 h-6 text-rose-400/80" />
                  <div className="h-px w-16 bg-gradient-to-r from-transparent via-rose-400/60 to-transparent" />
                </div>
              </motion.div>

              <motion.h1 initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1.5, delay: 1.2 }} className="text-5xl md:text-7xl lg:text-8xl font-extralight tracking-tight mb-6">
                VIP <span className="font-light text-rose-200">Concierge</span>
              </motion.h1>

              <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1.5, delay: 1.6 }} className="text-xl md:text-2xl text-gray-300 font-extralight tracking-wide mb-4">
                Personalized service, on demand
              </motion.p>
              
              <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1.5, delay: 1.8 }} className="text-base text-gray-500 font-light max-w-2xl mx-auto mb-12">
                Private chefs, executive protection, bespoke celebrations, and lifestyle management.
                Whatever you need, whenever you need it. We make the impossible effortless.
              </motion.p>

              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1, delay: 2.2 }} className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg" className="group bg-transparent border border-rose-400/30 text-rose-200 hover:bg-rose-400/10 hover:border-rose-400/50 px-10 py-7 text-sm tracking-[0.2em] uppercase rounded-none" onClick={() => document.getElementById('services')?.scrollIntoView({ behavior: 'smooth' })}>
                  Our Services
                </Button>
                <Button size="lg" className="bg-rose-400/10 border border-rose-400/20 text-rose-200 hover:bg-rose-400/20 px-10 py-7 text-sm tracking-[0.2em] uppercase rounded-none" onClick={() => document.getElementById('request')?.scrollIntoView({ behavior: 'smooth' })}>
                  Request Service
                </Button>
              </motion.div>
            </motion.div>
          </motion.div>
        </section>

        {/* CAPABILITY STATS */}
        <section className="py-16 bg-[#050403] border-y border-white/5">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {capabilityHighlights.map((item, idx) => (
                <motion.div key={idx} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: idx * 0.1 }} className="text-center">
                  <div className="text-4xl md:text-5xl font-extralight text-rose-300 mb-2">{item.stat}</div>
                  <div className="text-xs text-rose-400/60 uppercase tracking-[0.2em] mb-1">{item.label}</div>
                  <div className="text-xs text-gray-600">{item.desc}</div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* PROMISE */}
        <section className="py-32 relative">
          <div className="absolute inset-0 bg-gradient-to-b from-[#030303] via-[#0a0506] to-[#030303]" />
          <div className="container mx-auto px-4 relative z-10">
            <AnimatedSection className="max-w-4xl mx-auto text-center">
              <div className="text-rose-400/60 text-xs tracking-[0.4em] uppercase mb-8">Our Promise</div>
              <h2 className="text-3xl md:text-5xl font-extralight leading-relaxed mb-8">
                Your wish is not our command.<br />
                <span className="text-rose-200">It's already done.</span>
              </h2>
              <p className="text-gray-500 font-light text-lg leading-relaxed max-w-3xl mx-auto">
                We don't wait for requests. We anticipate needs. Our concierge team operates with one purpose: 
                to ensure every moment of your experience exceeds expectation. The best service is the one you never have to ask for.
              </p>
            </AnimatedSection>
          </div>
        </section>

        {/* SERVICES */}
        <section id="services" className="py-32 bg-[#030303]">
          <div className="container mx-auto px-4">
            <AnimatedSection className="text-center mb-20">
              <div className="text-rose-400/60 text-xs tracking-[0.4em] uppercase mb-6">Service Categories</div>
              <h2 className="text-4xl md:text-5xl font-extralight tracking-tight">
                Comprehensive <span className="text-rose-200">Capabilities</span>
              </h2>
            </AnimatedSection>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {conciergeServices.map((category, idx) => (
                <motion.div key={category.category} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: idx * 0.1 }} className="border border-white/5 bg-white/[0.01] overflow-hidden">
                  <button onClick={() => setExpandedCategory(expandedCategory === category.category ? null : category.category)} className="w-full p-8 text-left hover:bg-white/[0.02] transition-colors">
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="w-12 h-12 mb-6 rounded-full bg-rose-400/5 flex items-center justify-center border border-rose-400/10">
                          <category.icon className="w-5 h-5 text-rose-400/70" />
                        </div>
                        <h3 className="text-lg font-light text-white mb-2">{category.category}</h3>
                        <p className="text-sm text-gray-600">{category.description}</p>
                      </div>
                      <ArrowRight className={`w-5 h-5 text-rose-400/40 transition-transform ${expandedCategory === category.category ? 'rotate-90' : ''}`} />
                    </div>
                  </button>
                  
                  <motion.div initial={false} animate={{ height: expandedCategory === category.category ? 'auto' : 0 }} className="overflow-hidden">
                    <div className="px-8 pb-8 space-y-4 border-t border-white/5 pt-6">
                      {category.services.map((service, i) => (
                        <div key={i} className="flex items-start gap-3">
                          <CheckCircle2 className="w-4 h-4 text-rose-400/50 mt-1 flex-shrink-0" />
                          <div>
                            <div className="text-sm text-white font-light">{service.name}</div>
                            <div className="text-xs text-gray-600">{service.detail}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* THE TEAM */}
        <section className="py-32 bg-gradient-to-b from-[#030303] via-[#080505] to-[#030303]">
          <div className="container mx-auto px-4">
            <AnimatedSection className="max-w-4xl mx-auto">
              <div className="text-center mb-16">
                <div className="text-rose-400/60 text-xs tracking-[0.4em] uppercase mb-6">Behind Every Request</div>
                <h2 className="text-3xl md:text-4xl font-extralight">The Team You'll Never See</h2>
              </div>
              
              <div className="grid md:grid-cols-2 gap-8">
                {[
                  { title: 'Concierge Directors', desc: 'Former luxury hotel managers and private estate directors who understand the art of invisible service.' },
                  { title: 'Security Specialists', desc: 'Ex-special forces and intelligence professionals providing discreet executive protection.' },
                  { title: 'Event Architects', desc: 'Award-winning designers and producers who transform spaces and create moments.' },
                  { title: 'Culinary Team', desc: 'Michelin-trained chefs and sommeliers available at a moment\'s notice.' }
                ].map((item, idx) => (
                  <motion.div key={idx} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: idx * 0.1 }} className="p-6 border border-white/5 bg-white/[0.01]">
                    <h3 className="text-white font-light mb-2">{item.title}</h3>
                    <p className="text-sm text-gray-600 leading-relaxed">{item.desc}</p>
                  </motion.div>
                ))}
              </div>
            </AnimatedSection>
          </div>
        </section>

        {/* REQUEST FORM */}
        <section id="request" className="py-32 bg-[#030303] relative">
          <div className="absolute inset-0 opacity-30">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-rose-900/20 rounded-full blur-[150px]" />
          </div>
          <div className="container mx-auto px-4 relative z-10">
            <div className="max-w-3xl mx-auto">
              <AnimatedSection className="text-center mb-16">
                <div className="text-rose-400/60 text-xs tracking-[0.4em] uppercase mb-6">Request Service</div>
                <h2 className="text-3xl md:text-5xl font-extralight mb-6">How Can We <span className="text-rose-200">Assist</span>?</h2>
                <p className="text-gray-500 font-light">Tell us what you need. We'll make it happen.</p>
              </AnimatedSection>

              <form onSubmit={handleSubmit} className="space-y-6 bg-white/[0.02] border border-white/5 p-8 md:p-12">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-xs text-gray-500 uppercase tracking-wider mb-2">Full Name</label>
                    <Input required value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} className="bg-transparent border-white/10 text-white rounded-none h-12 focus:border-rose-400/30" />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-500 uppercase tracking-wider mb-2">Email</label>
                    <Input required type="email" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} className="bg-transparent border-white/10 text-white rounded-none h-12 focus:border-rose-400/30" />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-500 uppercase tracking-wider mb-2">Phone</label>
                    <Input required value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} className="bg-transparent border-white/10 text-white rounded-none h-12 focus:border-rose-400/30" />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-500 uppercase tracking-wider mb-2">Service Category</label>
                    <select value={formData.serviceType} onChange={(e) => setFormData({ ...formData, serviceType: e.target.value })} className="w-full bg-transparent border border-white/10 text-white rounded-none h-12 px-3 focus:border-rose-400/30">
                      <option value="" className="bg-[#111]">Select service type</option>
                      {conciergeServices.map(cat => (
                        <option key={cat.category} value={cat.category} className="bg-[#111]">{cat.category}</option>
                      ))}
                      <option value="multiple" className="bg-[#111]">Multiple Services</option>
                      <option value="other" className="bg-[#111]">Other / Custom</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs text-gray-500 uppercase tracking-wider mb-2">Arrival Date</label>
                    <Input type="date" value={formData.arrivalDate} onChange={(e) => setFormData({ ...formData, arrivalDate: e.target.value })} className="bg-transparent border-white/10 text-white rounded-none h-12 focus:border-rose-400/30" />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-500 uppercase tracking-wider mb-2">Duration of Stay</label>
                    <Input value={formData.duration} onChange={(e) => setFormData({ ...formData, duration: e.target.value })} placeholder="e.g., 5 nights, 2 weeks" className="bg-transparent border-white/10 text-white rounded-none h-12 focus:border-rose-400/30" />
                  </div>
                </div>
                <div>
                  <label className="block text-xs text-gray-500 uppercase tracking-wider mb-2">Detailed Requirements</label>
                  <Textarea required value={formData.requirements} onChange={(e) => setFormData({ ...formData, requirements: e.target.value })} placeholder="Please describe your requirements in detail. The more information you provide, the better we can serve you..." rows={5} className="bg-transparent border-white/10 text-white rounded-none focus:border-rose-400/30" />
                </div>
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4">
                  <div className="flex items-center gap-2 text-xs text-gray-600">
                    <Lock className="w-4 h-4" />
                    <span>Encrypted and confidential</span>
                  </div>
                  <Button type="submit" disabled={loading} className="bg-rose-400/10 border border-rose-400/30 text-rose-200 hover:bg-rose-400/20 rounded-none px-10 py-6 text-xs tracking-[0.2em] uppercase">
                    {loading ? 'Submitting...' : 'Submit Request'}
                  </Button>
                </div>
              </form>
            </div>
          </div>
        </section>

        {/* 24/7 HOTLINE */}
        <section className="py-16 bg-rose-950/20 border-t border-rose-400/10">
          <div className="container mx-auto px-4">
            <div className="flex flex-col md:flex-row items-center justify-between gap-8">
              <div className="text-center md:text-left">
                <div className="text-xs text-rose-400/60 uppercase tracking-[0.3em] mb-2">24/7 Concierge Hotline</div>
                <p className="text-gray-500 text-sm">For urgent requests or existing clients</p>
              </div>
              <div className="flex flex-wrap justify-center gap-6">
                <a href="https://wa.me/94777721999?text=VIP%20Concierge%20Request" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 bg-[#25D366]/10 hover:bg-[#25D366]/20 border border-[#25D366]/30 px-6 py-3 transition-all">
                  <svg className="w-5 h-5 text-[#25D366]" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/></svg>
                  <span className="text-sm text-[#25D366]">WhatsApp Now</span>
                </a>
                <a href="tel:+94777721999" className="flex items-center gap-3 border border-rose-400/30 text-rose-300 hover:bg-rose-400/10 px-6 py-3 transition-all">
                  <Phone className="w-4 h-4" />
                  <span className="text-sm">+94 777 721 999</span>
                </a>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
};

export default VIPConcierge;
