import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Crown, Phone, Mail, ArrowRight, Shield, Sparkles, Star, Gem, Lock, KeyRound, Landmark, BookOpen, Palette, Music2, Drama, Church, TreeDeciduous, GraduationCap, Handshake, Users, Quote, CheckCircle2, Loader2 } from 'lucide-react';
import { db } from '@/lib/firebase';
import { collection, addDoc, Timestamp } from 'firebase/firestore';
import { toast } from 'sonner';
import {
  getExclusiveAccessHero,
  getExperienceCategories,
  getExclusiveExperiences,
  ExclusiveAccessHero,
  ExperienceCategory,
  ExclusiveExperience,
  DEFAULT_HERO,
  DEFAULT_CATEGORIES,
  DEFAULT_EXPERIENCES
} from '@/services/exclusiveAccessService';

// Icon mapping for dynamic icons
const iconMap: Record<string, React.ElementType> = {
  Church, Palette, BookOpen, TreeDeciduous, Crown, Sparkles, Star, Gem, Lock, KeyRound, Landmark, Music2, Drama, GraduationCap
};

const accessPrinciples = [
  { icon: KeyRound, title: 'Earned Trust', desc: 'Our access comes from relationships built over 15+ years of respectful engagement with communities, institutions, and guardians.' },
  { icon: Handshake, title: 'Reciprocal Value', desc: 'Every experience benefits its custodians—through donations, conservation support, or cultural preservation initiatives.' },
  { icon: Shield, title: 'Sacred Discretion', desc: 'Some experiences remain unpublicized to protect their sanctity. We share only what our partners permit.' }
];

const fallbackImage = 'https://images.unsplash.com/photo-1596402184320-417e7178b2cd?w=1200&q=80';
const fallbackHeroImage = 'https://images.unsplash.com/photo-1596402184320-417e7178b2cd?w=1920&q=90';

const ExclusiveAccess = () => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', interests: '', travelDates: '', groupSize: '', background: '' });
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  // Dynamic content state - initialized with defaults
  const [heroData, setHeroData] = useState<ExclusiveAccessHero>(DEFAULT_HERO);
  const [categories, setCategories] = useState<ExperienceCategory[]>(DEFAULT_CATEGORIES);
  const [experiences, setExperiences] = useState<ExclusiveExperience[]>(
    DEFAULT_EXPERIENCES.map((exp, idx) => ({ ...exp, id: `default-${idx}` }))
  );

  // Fetch dynamic content
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [hero, cats, exps] = await Promise.all([
          getExclusiveAccessHero(),
          getExperienceCategories(),
          getExclusiveExperiences()
        ]);

        // Service now handles merging with defaults, so just set the data
        setHeroData(hero);

        const activeCategories = cats.filter(c => c.isActive !== false);
        if (activeCategories.length > 0) {
          setCategories(activeCategories);
        }

        const activeExperiences = exps.filter(e => e.isActive !== false);
        if (activeExperiences.length > 0) {
          setExperiences(activeExperiences);
        }
      } catch (error) {
        console.error('Error fetching exclusive access data:', error);
        // Keep defaults on error (already set in initial state)
      }
    };

    fetchData();
  }, []);

  // Group experiences by category - always returns valid data
  const groupedExperiences = React.useMemo(() => {
    const grouped = categories.map(cat => ({
      ...cat,
      icon: iconMap[cat.icon] || Church,
      experiences: experiences.filter(exp => exp.categoryId === cat.name)
    })).filter(cat => cat.experiences.length > 0);

    // Fallback to defaults if nothing matches
    if (grouped.length === 0) {
      return DEFAULT_CATEGORIES.map(cat => ({
        ...cat,
        icon: iconMap[cat.icon] || Church,
        experiences: DEFAULT_EXPERIENCES
          .filter(exp => exp.categoryId === cat.name)
          .map((exp, idx) => ({ ...exp, id: `default-${idx}` }))
      })).filter(cat => cat.experiences.length > 0);
    }

    return grouped;
  }, [categories, experiences]);

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

  const heroImage = heroData.image && heroData.image.trim() !== '' ? heroData.image : fallbackHeroImage;

  return (
    <>
      <Helmet>
        <title>Exclusive Access | Private Cultural Immersions | Temple Blessings | Recharge Travels</title>
        <meta name="description" content="Access that money alone cannot buy. Private temple blessings, museum after-hours, cultural immersions through relationships built over decades." />
      </Helmet>
      <Header />

      <main className="bg-[#030303] text-white">
        {/* HERO SECTION */}
        <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden">
          {/* Background Image */}
          <div className="absolute inset-0">
            <img
              src={heroImage}
              alt="Exclusive Access"
              className="w-full h-full object-cover"
              onError={(e) => { e.currentTarget.src = fallbackHeroImage; }}
            />
            <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-[#030303]" />
          </div>

          {/* Hero Content */}
          <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1 }}
            >
              <div className="inline-flex items-center gap-4 mb-8">
                <div className="h-px w-16 bg-gradient-to-r from-transparent via-violet-400/60 to-transparent" />
                <KeyRound className="w-6 h-6 text-violet-400/80" />
                <div className="h-px w-16 bg-gradient-to-r from-transparent via-violet-400/60 to-transparent" />
              </div>

              <h1 className="text-5xl md:text-7xl lg:text-8xl font-extralight tracking-tight mb-6">
                {heroData.title.split(' ')[0]}{' '}
                <span className="font-light text-violet-200">
                  {heroData.title.split(' ').slice(1).join(' ')}
                </span>
              </h1>

              <p className="text-xl md:text-2xl text-gray-300 font-extralight tracking-wide mb-4">
                {heroData.subtitle}
              </p>

              <p className="text-base text-gray-400 font-light max-w-2xl mx-auto mb-10">
                {heroData.description}
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button
                  size="lg"
                  className="bg-transparent border border-violet-400/30 text-violet-200 hover:bg-violet-400/10 hover:border-violet-400/50 px-10 py-7 text-sm tracking-[0.2em] uppercase rounded-none"
                  onClick={() => document.getElementById('experiences')?.scrollIntoView({ behavior: 'smooth' })}
                >
                  Discover Access
                </Button>
                <Button
                  size="lg"
                  className="bg-violet-400/10 border border-violet-400/20 text-violet-200 hover:bg-violet-400/20 px-10 py-7 text-sm tracking-[0.2em] uppercase rounded-none"
                  onClick={() => document.getElementById('request')?.scrollIntoView({ behavior: 'smooth' })}
                >
                  Request Access
                </Button>
              </div>
            </motion.div>
          </div>
        </section>

        {/* PHILOSOPHY SECTION */}
        <section className="py-20 md:py-28 bg-gradient-to-b from-[#030303] via-[#080508] to-[#030303]">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center mb-16">
              <div className="text-violet-400/60 text-xs tracking-[0.4em] uppercase mb-6">Our Philosophy</div>
              <h2 className="text-3xl md:text-5xl font-extralight leading-relaxed mb-8">
                Some doors cannot be bought.<br />
                <span className="text-violet-200">They must be earned.</span>
              </h2>
              <p className="text-gray-400 font-light text-lg leading-relaxed max-w-3xl mx-auto">
                Over 15 years, we've cultivated relationships with temple custodians, museum directors,
                master artisans, and conservation scientists. These connections—built on trust, respect,
                and mutual benefit—unlock experiences that exist nowhere else.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
              {accessPrinciples.map((item, idx) => (
                <div key={idx} className="text-center p-8 border border-white/5 bg-white/[0.02] hover:border-violet-400/20 transition-all duration-300">
                  <div className="w-14 h-14 mx-auto mb-6 rounded-full bg-violet-400/10 flex items-center justify-center border border-violet-400/20">
                    <item.icon className="w-6 h-6 text-violet-400" />
                  </div>
                  <h3 className="text-lg font-light text-white mb-3">{item.title}</h3>
                  <p className="text-sm text-gray-500 font-light leading-relaxed">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* EXPERIENCES BY CATEGORY */}
        <section id="experiences" className="py-20 md:py-28 bg-[#030303]">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <div className="text-violet-400/60 text-xs tracking-[0.4em] uppercase mb-6">Realms of Access</div>
              <h2 className="text-4xl md:text-5xl font-extralight tracking-tight">
                Where We Can <span className="text-violet-200">Take You</span>
              </h2>
            </div>

            {/* Category Selector */}
            <div className="flex flex-wrap justify-center gap-3 mb-16">
              <Button
                variant={selectedCategory === null ? "default" : "outline"}
                className={`rounded-none text-sm ${selectedCategory === null ? 'bg-violet-500/20 text-violet-200 border-violet-400/30' : 'border-white/10 text-gray-400 hover:text-white hover:border-white/20'}`}
                onClick={() => setSelectedCategory(null)}
              >
                All Experiences
              </Button>
              {groupedExperiences.map((cat) => {
                const IconComponent = cat.icon;
                return (
                  <Button
                    key={cat.name}
                    variant={selectedCategory === cat.name ? "default" : "outline"}
                    className={`rounded-none text-sm ${selectedCategory === cat.name ? 'bg-violet-500/20 text-violet-200 border-violet-400/30' : 'border-white/10 text-gray-400 hover:text-white hover:border-white/20'}`}
                    onClick={() => setSelectedCategory(cat.name)}
                  >
                    <IconComponent className="w-4 h-4 mr-2" />{cat.name}
                  </Button>
                );
              })}
            </div>

            {/* Experience Cards */}
            <div className="space-y-20">
              {groupedExperiences
                .filter(cat => !selectedCategory || cat.name === selectedCategory)
                .map((category) => {
                  const IconComponent = category.icon;
                  return (
                    <div key={category.name}>
                      <div className="flex items-center gap-4 mb-8">
                        <div className="w-12 h-12 rounded-full bg-violet-400/10 flex items-center justify-center border border-violet-400/20">
                          <IconComponent className="w-6 h-6 text-violet-400" />
                        </div>
                        <div>
                          <h3 className="text-2xl font-light text-white">{category.name}</h3>
                          <p className="text-sm text-violet-400/60">{category.tagline}</p>
                        </div>
                      </div>

                      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {category.experiences.map((exp) => (
                          <div
                            key={exp.id || exp.name}
                            className="group border border-white/5 bg-white/[0.02] overflow-hidden hover:border-violet-400/20 transition-all duration-500"
                          >
                            <div className="aspect-[16/10] overflow-hidden relative">
                              <img
                                src={exp.image || fallbackImage}
                                alt={exp.name}
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                                onError={(e) => { e.currentTarget.src = fallbackImage; }}
                              />
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
                                <p className="text-xs text-gray-500 leading-relaxed">{exp.whatMakesItExclusive}</p>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })}
            </div>
          </div>
        </section>

        {/* THE UNLISTED */}
        <section className="py-20 md:py-28 bg-gradient-to-b from-[#030303] via-[#0a050a] to-[#030303]">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center">
              <div className="w-16 h-16 mx-auto mb-8 rounded-full bg-violet-400/10 flex items-center justify-center border border-violet-400/20">
                <Lock className="w-7 h-7 text-violet-400" />
              </div>
              <div className="text-violet-400/60 text-xs tracking-[0.4em] uppercase mb-6">The Unlisted</div>
              <h2 className="text-3xl md:text-4xl font-extralight mb-6">Some Experiences Cannot Be Named</h2>
              <p className="text-gray-400 font-light leading-relaxed mb-8">
                We have access to experiences so rare, so sacred, that to publish them would betray the trust
                of their custodians. These exist only in private conversation—shared when we understand your
                deepest interests and can match them with possibilities you didn't know existed.
              </p>
              <Button
                className="bg-transparent border border-violet-400/30 text-violet-200 hover:bg-violet-400/10 rounded-none px-8 py-6 text-xs tracking-[0.2em] uppercase"
                onClick={() => document.getElementById('request')?.scrollIntoView({ behavior: 'smooth' })}
              >
                Begin the Conversation
              </Button>
            </div>
          </div>
        </section>

        {/* REQUEST FORM */}
        <section id="request" className="py-20 md:py-28 bg-[#030303] relative">
          <div className="absolute inset-0 opacity-30">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-violet-900/20 rounded-full blur-[150px]" />
          </div>
          <div className="container mx-auto px-4 relative z-10">
            <div className="max-w-3xl mx-auto">
              <div className="text-center mb-12">
                <div className="text-violet-400/60 text-xs tracking-[0.4em] uppercase mb-6">Request Access</div>
                <h2 className="text-3xl md:text-5xl font-extralight mb-6">
                  Where Do You Wish to <span className="text-violet-200">Go</span>?
                </h2>
                <p className="text-gray-400 font-light">Share your interests. We'll reveal what's possible.</p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6 bg-white/[0.02] border border-white/5 p-8 md:p-12">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-xs text-gray-400 uppercase tracking-wider mb-2">Full Name</label>
                    <Input
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="bg-transparent border-white/10 text-white rounded-none h-12 focus:border-violet-400/30"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-400 uppercase tracking-wider mb-2">Email</label>
                    <Input
                      required
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="bg-transparent border-white/10 text-white rounded-none h-12 focus:border-violet-400/30"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-400 uppercase tracking-wider mb-2">Phone</label>
                    <Input
                      required
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="bg-transparent border-white/10 text-white rounded-none h-12 focus:border-violet-400/30"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-400 uppercase tracking-wider mb-2">Group Size</label>
                    <Input
                      value={formData.groupSize}
                      onChange={(e) => setFormData({ ...formData, groupSize: e.target.value })}
                      placeholder="e.g., 2 adults, family of 4"
                      className="bg-transparent border-white/10 text-white rounded-none h-12 focus:border-violet-400/30 placeholder:text-gray-600"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-xs text-gray-400 uppercase tracking-wider mb-2">Travel Dates</label>
                    <Input
                      value={formData.travelDates}
                      onChange={(e) => setFormData({ ...formData, travelDates: e.target.value })}
                      placeholder="Specific dates or flexible timeframe"
                      className="bg-transparent border-white/10 text-white rounded-none h-12 focus:border-violet-400/30 placeholder:text-gray-600"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-xs text-gray-400 uppercase tracking-wider mb-2">Areas of Interest</label>
                  <Textarea
                    value={formData.interests}
                    onChange={(e) => setFormData({ ...formData, interests: e.target.value })}
                    placeholder="What draws you? Sacred sites, art, nature, craftsmanship, history, wildlife..."
                    rows={3}
                    className="bg-transparent border-white/10 text-white rounded-none focus:border-violet-400/30 placeholder:text-gray-600"
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-400 uppercase tracking-wider mb-2">Tell Us About Yourself</label>
                  <Textarea
                    value={formData.background}
                    onChange={(e) => setFormData({ ...formData, background: e.target.value })}
                    placeholder="Your background, passions, and what you hope to discover. The more we understand, the more we can offer..."
                    rows={4}
                    className="bg-transparent border-white/10 text-white rounded-none focus:border-violet-400/30 placeholder:text-gray-600"
                  />
                </div>
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4">
                  <div className="flex items-center gap-2 text-xs text-gray-500">
                    <Lock className="w-4 h-4" />
                    <span>All communications are strictly confidential</span>
                  </div>
                  <Button
                    type="submit"
                    disabled={loading}
                    className="bg-violet-400/10 border border-violet-400/30 text-violet-200 hover:bg-violet-400/20 rounded-none px-10 py-6 text-xs tracking-[0.2em] uppercase"
                  >
                    {loading ? 'Submitting...' : 'Request Access'}
                  </Button>
                </div>
              </form>
            </div>
          </div>
        </section>

        {/* CONTACT BAR */}
        <section className="py-12 bg-violet-950/20 border-t border-violet-400/10">
          <div className="container mx-auto px-4">
            <div className="flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="text-center md:text-left">
                <div className="text-xs text-violet-400/60 uppercase tracking-[0.3em] mb-2">Private Line</div>
                <p className="text-gray-400 text-sm">For sensitive inquiries or existing relationships</p>
              </div>
              <div className="flex flex-wrap justify-center gap-4">
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
