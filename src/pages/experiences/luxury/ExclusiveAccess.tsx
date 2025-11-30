import React, { useState, useRef } from 'react';
import { Helmet } from 'react-helmet-async';
import { motion, useScroll, useTransform, useInView } from 'framer-motion';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Crown, Phone, Mail, ArrowRight, Shield, Sparkles, Star, Gem, Lock, KeyRound, Landmark, BookOpen, Palette, Music2, Drama, Church, TreeDeciduous, GraduationCap, Handshake, Users, Quote, CheckCircle2 } from 'lucide-react';
import { db } from '@/lib/firebase';
import { collection, addDoc, Timestamp } from 'firebase/firestore';
import { toast } from 'sonner';

const exclusiveExperiences = [
  {
    category: 'Sacred Privileges',
    icon: Church,
    tagline: 'Where faith meets reverence',
    experiences: [
      {
        name: 'Private Temple Blessing',
        location: 'Temple of the Tooth, Kandy',
        description: 'A private blessing ceremony in the inner sanctum of Sri Lanka\'s holiest site—where the Sacred Tooth Relic of Buddha resides. Conducted by the temple\'s chief monk before public hours, followed by a private viewing of the relic chamber.',
        whatMakesItExclusive: 'This privilege is extended to heads of state and spiritual leaders. We are one of the few permitted to arrange this for private guests.',
        image: 'https://images.unsplash.com/photo-1596402184320-417e7178b2cd?w=1200&q=90'
      },
      {
        name: 'Monastic Immersion',
        location: 'Ancient Forest Monastery',
        description: 'Spend a day in the life of Buddhist monks at a remote forest hermitage. Participate in dawn meditations, receive personal teachings from a revered master, and share the midday meal in noble silence.',
        whatMakesItExclusive: 'This monastery accepts no visitors. Our relationship with the abbot, built over 15 years, makes this singular access possible.',
        image: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=1200&q=90'
      },
      {
        name: 'Hindu Temple Consecration',
        location: 'Nallur Kandaswamy, Jaffna',
        description: 'Witness the ancient Kumbhabhishekam ceremony—the consecration ritual that occurs once every twelve years. Receive personal blessings from the high priest and participate in rituals closed to all but the faithful.',
        whatMakesItExclusive: 'Active participation in temple rituals requires explicit permission from the temple trust, granted through our long-standing community relationships.',
        image: 'https://images.unsplash.com/photo-1582719508461-905c673771fd?w=1200&q=90'
      }
    ]
  },
  {
    category: 'Cultural Treasures',
    icon: Palette,
    tagline: 'Behind the velvet rope',
    experiences: [
      {
        name: 'Museum After Hours',
        location: 'National Museum, Colombo',
        description: 'The museum closes, but for you, it opens. A private evening tour with the museum director, examining artifacts not on public display. Handle ancient regalia. Study manuscripts by lamplight. Dinner served in the throne room.',
        whatMakesItExclusive: 'Private after-hours access requires ministerial approval. We maintain the relationships that make this possible.',
        image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=1200&q=90'
      },
      {
        name: 'Royal Archive Access',
        location: 'Department of National Archives',
        description: 'Examine centuries-old palm leaf manuscripts, royal correspondence, and colonial maps in the climate-controlled vaults of Sri Lanka\'s national archive. Guided by the chief archivist, discover documents that reveal hidden histories.',
        whatMakesItExclusive: 'Archive access is restricted to academic researchers. Our cultural partnerships extend this privilege to our guests.',
        image: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=1200&q=90'
      },
      {
        name: 'Artist Studio Visits',
        location: 'Private Studios, Island-wide',
        description: 'Enter the private studios of Sri Lanka\'s most celebrated artists. Watch masters at work. Commission pieces created in your presence. Access collections never offered to galleries.',
        whatMakesItExclusive: 'These artists do not accept visitors. Our personal relationships, some spanning decades, open these doors.',
        image: 'https://images.unsplash.com/photo-1549366021-9f761d450615?w=1200&q=90'
      }
    ]
  },
  {
    category: 'Living Heritage',
    icon: BookOpen,
    tagline: 'Traditions preserved in time',
    experiences: [
      {
        name: 'Royal Kandyan Dance Lineage',
        location: 'Ancestral Dance School',
        description: 'Train with the direct descendants of court dancers who performed for Kandyan kings. Learn the sacred rituals. Wear authentic ceremonial costumes. Perform in their private temple—a privilege never extended to outsiders.',
        whatMakesItExclusive: 'This family has guarded their traditions for centuries. Our relationship spans three generations.',
        image: 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=1200&q=90'
      },
      {
        name: 'Master Craftsman Sessions',
        location: 'Heritage Workshops',
        description: 'Work alongside Sri Lanka\'s designated "Living National Treasures"—master craftsmen in woodcarving, metalwork, and textile arts. Create under their guidance. Understand techniques passed down for millennia.',
        whatMakesItExclusive: 'These masters accept no apprentices. Through our heritage foundation partnerships, we arrange what would otherwise be impossible.',
        image: 'https://images.unsplash.com/photo-1584132967334-10e028bd69f7?w=1200&q=90'
      },
      {
        name: 'Ayurvedic Master Consultation',
        location: 'Traditional Physician\'s Home',
        description: 'Consult with a vaidya whose family has practiced Ayurvedic medicine for 14 generations. Receive a full traditional diagnosis. Learn secret family formulations. Visit their private herb garden.',
        whatMakesItExclusive: 'These traditional physicians see only referred patients within their community. Our introduction opens ancestral doors.',
        image: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1200&q=90'
      }
    ]
  },
  {
    category: 'Natural Sanctuaries',
    icon: TreeDeciduous,
    tagline: 'Nature\'s inner chambers',
    experiences: [
      {
        name: 'Research Station Access',
        location: 'Sinharaja Rainforest',
        description: 'Join conservation scientists at their remote research station deep within Sri Lanka\'s last primeval rainforest. Participate in ongoing studies. Track endemic species. Sleep in the research camp under the canopy.',
        whatMakesItExclusive: 'Active research stations are closed to visitors. Our conservation partnerships enable this scientific immersion.',
        image: 'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?w=1200&q=90'
      },
      {
        name: 'Elephant Corridor Dawn',
        location: 'Undisclosed Location',
        description: 'At a secret location known to few, witness wild elephants crossing an ancient migration corridor at first light. Guided by the researchers who discovered it. No other tourists. No vehicles. Just you and the giants.',
        whatMakesItExclusive: 'This location is protected information. Our wildlife conservation work grants us access that protects both elephants and the secret.',
        image: 'https://images.unsplash.com/photo-1549366021-9f761d450615?w=1200&q=90'
      },
      {
        name: 'Marine Research Dive',
        location: 'Protected Reef Systems',
        description: 'Dive with marine biologists in reef systems closed to recreational divers. Participate in coral surveys. Encounter species on no tourist itinerary. Contribute to research that protects these waters.',
        whatMakesItExclusive: 'These marine sanctuaries are strictly protected. Our research partnerships enable scientific-level access.',
        image: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=1200&q=90'
      }
    ]
  }
];

const accessPrinciples = [
  { icon: KeyRound, title: 'Earned Trust', desc: 'Our access comes from relationships built over 15+ years of respectful engagement with communities, institutions, and guardians.' },
  { icon: Handshake, title: 'Reciprocal Value', desc: 'Every experience benefits its custodians—through donations, conservation support, or cultural preservation initiatives.' },
  { icon: Shield, title: 'Sacred Discretion', desc: 'Some experiences remain unpublicized to protect their sanctity. We share only what our partners permit.' }
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

const ExclusiveAccess = () => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', interests: '', travelDates: '', groupSize: '', background: '' });
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const heroY = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await addDoc(collection(db, 'exclusiveAccessInquiries'), {
        ...formData,
        type: 'exclusive-access',
        createdAt: Timestamp.now(),
        status: 'new',
        priority: 'vip'
      });
      toast.success('Your request has been received. Our cultural liaison will contact you to discuss possibilities.', { duration: 6000 });
      setFormData({ name: '', email: '', phone: '', interests: '', travelDates: '', groupSize: '', background: '' });
    } catch (error) {
      toast.error('Please contact us directly at luxury@rechargetravels.com');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Helmet>
        <title>Exclusive Access | Private Cultural Immersions | Temple Blessings | Recharge Travels</title>
        <meta name="description" content="Access that money alone cannot buy. Private temple blessings, museum after-hours, cultural immersions through relationships built over decades." />
      </Helmet>
      <Header />
      <main className="min-h-screen bg-[#030303] text-white overflow-hidden">
        
        {/* HERO */}
        <section ref={heroRef} className="relative h-[100vh] overflow-hidden">
          <motion.div style={{ y: heroY }} className="absolute inset-0">
            <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1596402184320-417e7178b2cd?w=1920&q=90')] bg-cover bg-center" />
            <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-[#030303]" />
          </motion.div>

          <motion.div style={{ opacity: heroOpacity }} className="relative z-10 h-full flex flex-col justify-center items-center text-center px-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 2, delay: 0.5 }} className="max-w-4xl">
              
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1.5, delay: 1 }} className="mb-12">
                <div className="inline-flex items-center gap-4 mb-8">
                  <div className="h-px w-16 bg-gradient-to-r from-transparent via-violet-400/60 to-transparent" />
                  <KeyRound className="w-6 h-6 text-violet-400/80" />
                  <div className="h-px w-16 bg-gradient-to-r from-transparent via-violet-400/60 to-transparent" />
                </div>
              </motion.div>

              <motion.h1 initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1.5, delay: 1.2 }} className="text-5xl md:text-7xl lg:text-8xl font-extralight tracking-tight mb-6">
                Exclusive <span className="font-light text-violet-200">Access</span>
              </motion.h1>

              <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1.5, delay: 1.6 }} className="text-xl md:text-2xl text-gray-300 font-extralight tracking-wide mb-4">
                Beyond the velvet rope
              </motion.p>
              
              <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1.5, delay: 1.8 }} className="text-base text-gray-500 font-light max-w-2xl mx-auto mb-12">
                Private temple blessings. Museum after-hours. Cultural immersions through relationships 
                that took decades to build. Access that money alone cannot buy.
              </motion.p>

              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1, delay: 2.2 }} className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg" className="group bg-transparent border border-violet-400/30 text-violet-200 hover:bg-violet-400/10 hover:border-violet-400/50 px-10 py-7 text-sm tracking-[0.2em] uppercase rounded-none" onClick={() => document.getElementById('experiences')?.scrollIntoView({ behavior: 'smooth' })}>
                  Discover Access
                </Button>
                <Button size="lg" className="bg-violet-400/10 border border-violet-400/20 text-violet-200 hover:bg-violet-400/20 px-10 py-7 text-sm tracking-[0.2em] uppercase rounded-none" onClick={() => document.getElementById('request')?.scrollIntoView({ behavior: 'smooth' })}>
                  Request Access
                </Button>
              </motion.div>
            </motion.div>
          </motion.div>
        </section>

        {/* PHILOSOPHY */}
        <section className="py-32 relative">
          <div className="absolute inset-0 bg-gradient-to-b from-[#030303] via-[#080508] to-[#030303]" />
          <div className="container mx-auto px-4 relative z-10">
            <AnimatedSection className="max-w-4xl mx-auto text-center mb-20">
              <div className="text-violet-400/60 text-xs tracking-[0.4em] uppercase mb-8">Our Philosophy</div>
              <h2 className="text-3xl md:text-5xl font-extralight leading-relaxed mb-8">
                Some doors cannot be bought.<br />
                <span className="text-violet-200">They must be earned.</span>
              </h2>
              <p className="text-gray-500 font-light text-lg leading-relaxed max-w-3xl mx-auto">
                Over 15 years, we've cultivated relationships with temple custodians, museum directors, 
                master artisans, and conservation scientists. These connections—built on trust, respect, 
                and mutual benefit—unlock experiences that exist nowhere else.
              </p>
            </AnimatedSection>

            <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
              {accessPrinciples.map((item, idx) => (
                <motion.div key={idx} initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: idx * 0.2 }} className="text-center p-8 border border-white/5 bg-white/[0.01]">
                  <div className="w-14 h-14 mx-auto mb-6 rounded-full bg-violet-400/5 flex items-center justify-center border border-violet-400/10">
                    <item.icon className="w-6 h-6 text-violet-400/70" />
                  </div>
                  <h3 className="text-lg font-light text-white mb-3">{item.title}</h3>
                  <p className="text-sm text-gray-600 font-light leading-relaxed">{item.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* EXPERIENCES BY CATEGORY */}
        <section id="experiences" className="py-32 bg-[#030303]">
          <div className="container mx-auto px-4">
            <AnimatedSection className="text-center mb-16">
              <div className="text-violet-400/60 text-xs tracking-[0.4em] uppercase mb-6">Realms of Access</div>
              <h2 className="text-4xl md:text-5xl font-extralight tracking-tight">
                Where We Can <span className="text-violet-200">Take You</span>
              </h2>
            </AnimatedSection>

            {/* Category Selector */}
            <div className="flex flex-wrap justify-center gap-4 mb-16">
              <Button variant={selectedCategory === null ? "default" : "outline"} className={`rounded-none text-sm ${selectedCategory === null ? 'bg-violet-500/20 text-violet-200 border-violet-400/30' : 'border-white/10 text-gray-500 hover:text-white'}`} onClick={() => setSelectedCategory(null)}>
                All Experiences
              </Button>
              {exclusiveExperiences.map((cat) => (
                <Button key={cat.category} variant={selectedCategory === cat.category ? "default" : "outline"} className={`rounded-none text-sm ${selectedCategory === cat.category ? 'bg-violet-500/20 text-violet-200 border-violet-400/30' : 'border-white/10 text-gray-500 hover:text-white'}`} onClick={() => setSelectedCategory(cat.category)}>
                  <cat.icon className="w-4 h-4 mr-2" />{cat.category}
                </Button>
              ))}
            </div>

            {/* Experience Cards */}
            <div className="space-y-24">
              {exclusiveExperiences.filter(cat => !selectedCategory || cat.category === selectedCategory).map((category) => (
                <AnimatedSection key={category.category}>
                  <div className="mb-12">
                    <div className="flex items-center gap-4 mb-4">
                      <div className="w-10 h-10 rounded-full bg-violet-400/10 flex items-center justify-center">
                        <category.icon className="w-5 h-5 text-violet-400/70" />
                      </div>
                      <div>
                        <h3 className="text-2xl font-light text-white">{category.category}</h3>
                        <p className="text-sm text-violet-400/60">{category.tagline}</p>
                      </div>
                    </div>
                  </div>

                  <div className="grid lg:grid-cols-3 gap-6">
                    {category.experiences.map((exp, idx) => (
                      <motion.div key={exp.name} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: idx * 0.15 }} className="group border border-white/5 bg-white/[0.01] overflow-hidden hover:border-violet-400/20 transition-all duration-500">
                        <div className="aspect-[16/10] overflow-hidden relative">
                          <img src={exp.image} alt={exp.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                          <div className="absolute bottom-4 left-4 right-4">
                            <div className="text-xs text-violet-400/80 mb-1">{exp.location}</div>
                            <h4 className="text-lg font-light text-white">{exp.name}</h4>
                          </div>
                        </div>
                        <div className="p-6">
                          <p className="text-sm text-gray-400 font-light leading-relaxed mb-4">{exp.description}</p>
                          <div className="pt-4 border-t border-white/5">
                            <div className="text-xs text-violet-400/60 uppercase tracking-wider mb-2">What makes it exclusive</div>
                            <p className="text-xs text-gray-600 leading-relaxed">{exp.whatMakesItExclusive}</p>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </AnimatedSection>
              ))}
            </div>
          </div>
        </section>

        {/* THE UNLISTED */}
        <section className="py-32 bg-gradient-to-b from-[#030303] via-[#0a050a] to-[#030303]">
          <div className="container mx-auto px-4">
            <AnimatedSection className="max-w-3xl mx-auto text-center">
              <div className="w-16 h-16 mx-auto mb-8 rounded-full bg-violet-400/5 flex items-center justify-center border border-violet-400/10">
                <Lock className="w-7 h-7 text-violet-400/70" />
              </div>
              <div className="text-violet-400/60 text-xs tracking-[0.4em] uppercase mb-6">The Unlisted</div>
              <h2 className="text-3xl md:text-4xl font-extralight mb-6">Some Experiences Cannot Be Named</h2>
              <p className="text-gray-500 font-light leading-relaxed mb-8">
                We have access to experiences so rare, so sacred, that to publish them would betray the trust 
                of their custodians. These exist only in private conversation—shared when we understand your 
                deepest interests and can match them with possibilities you didn't know existed.
              </p>
              <Button className="bg-transparent border border-violet-400/30 text-violet-200 hover:bg-violet-400/10 rounded-none px-8 py-6 text-xs tracking-[0.2em] uppercase" onClick={() => document.getElementById('request')?.scrollIntoView({ behavior: 'smooth' })}>
                Begin the Conversation
              </Button>
            </AnimatedSection>
          </div>
        </section>

        {/* REQUEST FORM */}
        <section id="request" className="py-32 bg-[#030303] relative">
          <div className="absolute inset-0 opacity-30">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-violet-900/20 rounded-full blur-[150px]" />
          </div>
          <div className="container mx-auto px-4 relative z-10">
            <div className="max-w-3xl mx-auto">
              <AnimatedSection className="text-center mb-16">
                <div className="text-violet-400/60 text-xs tracking-[0.4em] uppercase mb-6">Request Access</div>
                <h2 className="text-3xl md:text-5xl font-extralight mb-6">Where Do You Wish to <span className="text-violet-200">Go</span>?</h2>
                <p className="text-gray-500 font-light">Share your interests. We'll reveal what's possible.</p>
              </AnimatedSection>

              <form onSubmit={handleSubmit} className="space-y-6 bg-white/[0.02] border border-white/5 p-8 md:p-12">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-xs text-gray-500 uppercase tracking-wider mb-2">Full Name</label>
                    <Input required value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} className="bg-transparent border-white/10 text-white rounded-none h-12 focus:border-violet-400/30" />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-500 uppercase tracking-wider mb-2">Email</label>
                    <Input required type="email" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} className="bg-transparent border-white/10 text-white rounded-none h-12 focus:border-violet-400/30" />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-500 uppercase tracking-wider mb-2">Phone</label>
                    <Input required value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} className="bg-transparent border-white/10 text-white rounded-none h-12 focus:border-violet-400/30" />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-500 uppercase tracking-wider mb-2">Group Size</label>
                    <Input value={formData.groupSize} onChange={(e) => setFormData({ ...formData, groupSize: e.target.value })} placeholder="e.g., 2 adults, family of 4" className="bg-transparent border-white/10 text-white rounded-none h-12 focus:border-violet-400/30" />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-xs text-gray-500 uppercase tracking-wider mb-2">Travel Dates</label>
                    <Input value={formData.travelDates} onChange={(e) => setFormData({ ...formData, travelDates: e.target.value })} placeholder="Specific dates or flexible timeframe" className="bg-transparent border-white/10 text-white rounded-none h-12 focus:border-violet-400/30" />
                  </div>
                </div>
                <div>
                  <label className="block text-xs text-gray-500 uppercase tracking-wider mb-2">Areas of Interest</label>
                  <Textarea value={formData.interests} onChange={(e) => setFormData({ ...formData, interests: e.target.value })} placeholder="What draws you? Sacred sites, art, nature, craftsmanship, history, wildlife..." rows={3} className="bg-transparent border-white/10 text-white rounded-none focus:border-violet-400/30" />
                </div>
                <div>
                  <label className="block text-xs text-gray-500 uppercase tracking-wider mb-2">Tell Us About Yourself</label>
                  <Textarea value={formData.background} onChange={(e) => setFormData({ ...formData, background: e.target.value })} placeholder="Your background, passions, and what you hope to discover. The more we understand, the more we can offer..." rows={4} className="bg-transparent border-white/10 text-white rounded-none focus:border-violet-400/30" />
                </div>
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4">
                  <div className="flex items-center gap-2 text-xs text-gray-600">
                    <Lock className="w-4 h-4" />
                    <span>All communications are strictly confidential</span>
                  </div>
                  <Button type="submit" disabled={loading} className="bg-violet-400/10 border border-violet-400/30 text-violet-200 hover:bg-violet-400/20 rounded-none px-10 py-6 text-xs tracking-[0.2em] uppercase">
                    {loading ? 'Submitting...' : 'Request Access'}
                  </Button>
                </div>
              </form>
            </div>
          </div>
        </section>

        {/* CONTACT */}
        <section className="py-16 bg-violet-950/20 border-t border-violet-400/10">
          <div className="container mx-auto px-4">
            <div className="flex flex-col md:flex-row items-center justify-between gap-8">
              <div className="text-center md:text-left">
                <div className="text-xs text-violet-400/60 uppercase tracking-[0.3em] mb-2">Private Line</div>
                <p className="text-gray-500 text-sm">For sensitive inquiries or existing relationships</p>
              </div>
              <div className="flex flex-wrap justify-center gap-6">
                <a href="tel:+94777721999" className="flex items-center gap-3 border border-violet-400/30 text-violet-300 hover:bg-violet-400/10 px-6 py-3 transition-all">
                  <Phone className="w-4 h-4" />
                  <span className="text-sm">+94 777 721 999</span>
                </a>
                <a href="mailto:luxury@rechargetravels.com" className="flex items-center gap-3 border border-white/10 text-gray-400 hover:bg-white/5 px-6 py-3 transition-all">
                  <Mail className="w-4 h-4" />
                  <span className="text-sm">luxury@rechargetravels.com</span>
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

export default ExclusiveAccess;
