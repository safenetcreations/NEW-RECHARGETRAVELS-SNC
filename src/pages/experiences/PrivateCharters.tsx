import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { AnimatePresence, motion } from 'framer-motion';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger
} from '@/components/ui/accordion';
import {
  Anchor,
  ArrowRight,
  Building2,
  Car,
  CheckCircle,
  ChevronRight,
  Clock,
  Crown,
  Diamond,
  Globe,
  Hotel,
  Gem,
  Mail,
  MapPin,
  MessageCircle,
  Phone,
  Plane,
  Play,
  Shield,
  Ship,
  Sparkles,
  Star,
  TrendingUp,
  Users,
  Waves,
  Wine,
  Zap
} from 'lucide-react';
import {
  privateChartersPageService,
  PrivateChartersPageContent,
  HeroMicroFormField
} from '@/services/privateChartersPageService';
import { cachedFetch } from '@/lib/cache';

const statIconMap: Record<string, React.ComponentType<any>> = {
  Ship,
  Plane,
  Clock,
  Users,
  Crown,
  Anchor,
  Waves,
  Car,
  Hotel,
  Diamond,
  Globe,
  Shield,
  Gem,
  Building2,
  Wine,
  TrendingUp
};

// Luxury service categories for the concierge hub
const luxuryCategories = [
  {
    id: 'yachts',
    name: 'Superyachts',
    icon: Ship,
    tagline: 'Ocean Palaces',
    description: 'Benetti · Feadship · Lürssen',
    priceFrom: 'USD 18,500/day',
    color: 'from-blue-500 to-cyan-400',
    bgColor: 'bg-blue-500/10',
    borderColor: 'border-blue-400/30'
  },
  {
    id: 'jets',
    name: 'Private Aviation',
    icon: Plane,
    tagline: 'Sky Sanctuaries',
    description: 'Gulfstream G700 · Global 7500',
    priceFrom: 'USD 12,800/hr',
    color: 'from-amber-500 to-orange-400',
    bgColor: 'bg-amber-500/10',
    borderColor: 'border-amber-400/30'
  },
  {
    id: 'helicopters',
    name: 'Executive Heli',
    icon: Zap,
    tagline: 'Instant Access',
    description: 'Airbus H160 · Night-Vision Ops',
    priceFrom: 'USD 6,200/hr',
    color: 'from-emerald-500 to-teal-400',
    bgColor: 'bg-emerald-500/10',
    borderColor: 'border-emerald-400/30'
  },
  {
    id: 'hotels',
    name: 'Private Estates',
    icon: Hotel,
    tagline: 'Palatial Retreats',
    description: 'Aman · Four Seasons · Buyouts',
    priceFrom: 'USD 8,500/night',
    color: 'from-purple-500 to-pink-400',
    bgColor: 'bg-purple-500/10',
    borderColor: 'border-purple-400/30'
  }
];

// Exclusive amenities for billionaire clients
const exclusiveAmenities = [
  { icon: Wine, label: 'Master Sommelier', desc: '500-bottle cellar onboard' },
  { icon: Shield, label: 'Executive Protection', desc: 'Discreet 24/7 security' },
  { icon: Gem, label: 'Luxury Acquisitions', desc: 'Rare art & jewelry sourcing' },
  { icon: Globe, label: 'Diplomatic Access', desc: 'VIP customs & immigration' }
];

const fallbackHeroVideo = 'https://cdn.coverr.co/videos/coverr-super-yacht-at-sunset-9339/1080p.mp4';
const fallbackPoster = 'https://images.unsplash.com/photo-1500375592092-40eb2168fd21?auto=format&fit=crop&w=2000&q=80';

const fallbackTestimonials = [
  {
    quote:
      'Recharge executed a Colombo-to-Maldives escape with 90 minutes notice. The Michelin chef, master sommelier, and pilot brief were flawless. This is how billionaires should travel.',
    author: 'Amara & Devan K. · Zurich'
  },
  {
    quote:
      'Boardroom on the Gulfstream, seaplane to the catamaran, IV therapy on deck, underwater dining in the Maldives—all in 48 hours. Unprecedented.',
    author: 'Charles W. · Venture Capital Partner'
  },
  {
    quote:
      'Night-vision helicopter into Yala, sunrise balloon over Sigiriya, yacht brunch by noon. No other concierge operates at this level.',
    author: 'Helena O. · Creative Director, Fortune 100'
  },
  {
    quote:
      'We needed a proposal setup on a private atoll with 6 hours notice. Recharge delivered fireworks, a string quartet, and a Michelin dinner. She said yes.',
    author: 'Anonymous UHNW Client'
  }
];
const fallbackPartners = ['Benetti', 'Gulfstream', 'Airbus Corporate Jets', 'VistaJet', 'Aman Resorts', 'Four Seasons'];
const fallbackStats = [
  { id: 'stat-fallback-1', iconName: 'Crown', label: 'UHNW Clients', value: '5,800+' },
  { id: 'stat-fallback-2', iconName: 'Clock', label: 'Response Time', value: '<12 min' },
  { id: 'stat-fallback-3', iconName: 'Shield', label: 'Coverage', value: 'USD 50M' }
];

const defaultPrivateChartersContent = privateChartersPageService.getDefaultContent();

const PrivateCharters = () => {
  const [content, setContent] = useState<PrivateChartersPageContent>(defaultPrivateChartersContent);
  const [loading, setLoading] = useState(true);
  const [heroIndex, setHeroIndex] = useState(0);
  const [selectedCategory, setSelectedCategory] = useState('yachts');
  const bookingRef = useRef<HTMLDivElement | null>(null);
  const heroVideoRef = useRef<HTMLVideoElement | null>(null);
  const fallbackTimerRef = useRef<NodeJS.Timeout | null>(null);
  const [videoReady, setVideoReady] = useState(false);
  const [heroFallback, setHeroFallback] = useState(false);
  const [microFormValues, setMicroFormValues] = useState<Record<string, string>>({});
  const [microFormStatus, setMicroFormStatus] = useState<'idle' | 'success'>('idle');
  const [formData, setFormData] = useState({
    startDate: '',
    guests: 6,
    charterType: 'Superyacht',
    route: '',
    pickup: '',
    contactName: '',
    contactEmail: '',
    contactPhone: '',
    requests: ''
  });
  const heroSlide = content.hero.images[heroIndex] ?? content.hero.images[0];
  const heroVideo = content.hero.videoUrl || fallbackHeroVideo;
  const heroPoster = content.hero.videoPoster || heroSlide?.image || fallbackPoster;
  const testimonials = content.testimonials?.length ? content.testimonials : fallbackTestimonials;
  const partnerLogos = content.partners?.length ? content.partners : fallbackPartners;
  const heroStats = (content.stats?.length ? content.stats : fallbackStats).slice(0, 3);
  const heroThumbnails = content.hero.images.slice(0, 3);
  const heroMicroForm = content.hero?.microForm ?? defaultPrivateChartersContent.hero.microForm;
  const missions = content.missions ?? defaultPrivateChartersContent.missions ?? [];
  const crewHighlights = content.crew ?? defaultPrivateChartersContent.crew ?? [];
  const rituals = content.rituals ?? defaultPrivateChartersContent.rituals ?? [];

  useEffect(() => {
    const load = async () => {
      try {
        const data = await cachedFetch<PrivateChartersPageContent>(
          'private-charters-page',
          () => privateChartersPageService.getPageContent(),
          10 * 60 * 1000
        );
        setContent(data);
      } catch (error) {
        console.error('Error loading private charter content', error);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  useEffect(() => {
    if (!content.hero.images.length) return;
    const timer = setInterval(() => {
      setHeroIndex((prev) => (prev + 1) % content.hero.images.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [content.hero.images.length]);

  useEffect(() => {
    const video = heroVideoRef.current;
    if (!video) return;
    setVideoReady(false);
    setHeroFallback(false);
    if (fallbackTimerRef.current) {
      clearTimeout(fallbackTimerRef.current);
    }
    const handleCanPlay = () => {
      if (fallbackTimerRef.current) {
        clearTimeout(fallbackTimerRef.current);
      }
      setVideoReady(true);
      setHeroFallback(false);
      const playPromise = video.play();
      if (playPromise?.catch) {
        playPromise.catch(() => {
          setHeroFallback(true);
        });
      }
    };
    const handleError = () => {
      if (fallbackTimerRef.current) {
        clearTimeout(fallbackTimerRef.current);
      }
      setHeroFallback(true);
      setVideoReady(true);
    };
    video.addEventListener('canplay', handleCanPlay);
    video.addEventListener('error', handleError);
    video.load();
    // Reduced timeout from 6s to 2.5s for snappier UX
    fallbackTimerRef.current = setTimeout(() => {
      setHeroFallback(true);
      setVideoReady(true);
    }, 2500);
    return () => {
      video.removeEventListener('canplay', handleCanPlay);
      video.removeEventListener('error', handleError);
      if (fallbackTimerRef.current) {
        clearTimeout(fallbackTimerRef.current);
      }
    };
  }, [heroVideo]);

  useEffect(() => {
    const defaults: Record<string, string> = {};
    heroMicroForm.fields.forEach((field) => {
      defaults[field.id] = field.defaultValue || '';
    });
    setMicroFormValues((prev) => ({ ...defaults, ...prev }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [heroMicroForm.fields.map((field) => `${field.id}-${field.defaultValue ?? ''}`).join('|')]);

  const handleMicroFieldChange = (field: HeroMicroFormField, value: string) => {
    setMicroFormValues((prev) => ({ ...prev, [field.id]: value }));
  };

  const handleMicroFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const updated = { ...formData };
    heroMicroForm.fields.forEach((field) => {
      const value = microFormValues[field.id];
      if (!value) return;
      const key = field.id.toLowerCase();
      if (key.includes('date')) {
        updated.startDate = value;
      } else if (key.includes('asset')) {
        updated.charterType = value;
      } else if (key.includes('guest')) {
        const parsed = Number(value);
        if (!Number.isNaN(parsed)) {
          updated.guests = parsed;
        }
      }
    });
    setFormData(updated);
    setMicroFormStatus('success');
    scrollToBooking();
    setTimeout(() => setMicroFormStatus('idle'), 3200);
  };

  const handleInputChange = (key: keyof typeof formData, value: string | number) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
  };

  const scrollToBooking = () => {
    bookingRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const estimatedTotal = useMemo(() => {
    if (formData.charterType === 'Superyacht') return content.pricing.yachtMinimum;
    if (formData.charterType === 'Private Jet') return content.pricing.jetMinimum;
    if (formData.charterType === 'Helicopter') return content.pricing.helicopterMinimum;
    return content.pricing.yachtMinimum;
  }, [content, formData.charterType]);

  const submitRequest = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    alert('Merci—our billionaire desk just received your manifest. Expect a reply within 15 minutes.');
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50">
        <div className="text-center">
          <div className="mx-auto mb-4 h-12 w-12 animate-spin rounded-full border-b-2 border-emerald-500" />
          <p className="text-slate-500">Synchronising assets…</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>{content.seo.title}</title>
        <meta name="description" content={content.seo.description} />
        <meta name="keywords" content={content.seo.keywords.join(', ')} />
        <meta property="og:title" content={content.seo.title} />
        <meta property="og:description" content={content.seo.description} />
        <meta property="og:image" content={content.seo.ogImage} />
        <link rel="canonical" href="https://www.rechargetravels.com/experiences/private-charters" />
      </Helmet>

      <Header />

      {/* HERO - Luxury TV Frame Display */}
      <section className="relative min-h-screen overflow-hidden bg-gradient-to-br from-slate-950 via-slate-900 to-black text-white">
        {/* Animated gradient background - pointer-events-none to not block clicks */}
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="absolute -left-1/4 -top-1/4 h-[800px] w-[800px] animate-pulse rounded-full bg-amber-500/8 blur-[150px]" />
          <div className="absolute -bottom-1/4 -right-1/4 h-[600px] w-[600px] animate-pulse rounded-full bg-purple-500/8 blur-[120px]" style={{ animationDelay: '1s' }} />
          <div className="absolute left-1/3 top-1/2 h-[500px] w-[900px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-cyan-500/5 blur-[100px]" />
        </div>

        {/* Luxury pattern overlay - pointer-events-none to not block clicks */}
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.02]"
          style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, rgba(255,215,0,0.3) 1px, transparent 0)`,
            backgroundSize: '40px 40px'
          }}
        />

        {/* Top bar - Billionaire status */}
        <div className="relative z-20 border-b border-white/5 bg-black/40 backdrop-blur-xl">
          <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3">
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-2">
                <Diamond className="h-4 w-4 text-amber-400" />
                <span className="text-xs font-medium uppercase tracking-[0.3em] text-white/60">Private Concierge</span>
              </div>
              <div className="hidden h-4 w-px bg-white/20 md:block" />
              <div className="hidden items-center gap-2 md:flex">
                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
                </span>
                <span className="text-xs text-emerald-400">Desk Live 24/7</span>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <span className="hidden text-xs text-white/50 sm:block">Response &lt; 15 min</span>
              <Button
                size="sm"
                className="bg-amber-500 text-xs font-semibold text-black hover:bg-amber-400"
                onClick={() => window.open(content.booking.whatsapp, '_blank')}
              >
                <Phone className="mr-1 h-3 w-3" /> +94 77 772 1999
              </Button>
            </div>
          </div>
        </div>

        <div className="relative z-10 mx-auto flex min-h-[calc(100vh-60px)] max-w-7xl flex-col px-4 pb-8 pt-8 lg:flex-row lg:items-center lg:gap-10">
          {/* Left: Luxury TV Frame with Video */}
          <div className="flex-1 lg:flex-[1.3]">
            {/* Luxury Category Selector - Above TV */}
            <div className="mx-auto mb-6 max-w-3xl">
              <div className="flex flex-wrap justify-center gap-2">
                {luxuryCategories.map((cat) => {
                  const Icon = cat.icon;
                  const isActive = selectedCategory === cat.id;
                  return (
                    <button
                      key={cat.id}
                      type="button"
                      onClick={() => setSelectedCategory(cat.id)}
                      className={`group flex items-center gap-2 rounded-full px-4 py-2 text-xs font-medium uppercase tracking-wider transition-all duration-300 ${
                        isActive
                          ? `bg-gradient-to-r ${cat.color} text-white shadow-lg`
                          : 'border border-white/10 bg-white/5 text-white/70 hover:border-white/30 hover:bg-white/10'
                      }`}
                    >
                      <Icon className={`h-3.5 w-3.5 ${isActive ? 'text-white' : 'text-white/50'}`} />
                      {cat.name}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* TV Frame Container */}
            <div className="relative mx-auto max-w-3xl">
              {/* Outer frame - brushed gold/platinum effect */}
              <div className="relative rounded-[32px] bg-gradient-to-b from-amber-700/40 via-slate-800 to-slate-900 p-[4px] shadow-2xl shadow-black/60">
                {/* Inner bezel - premium dark glass */}
                <div className="relative overflow-hidden rounded-[28px] bg-gradient-to-br from-slate-900 via-black to-slate-950 p-4 lg:p-5">
                  {/* Screen bezel highlight - decorative */}
                  <div className="pointer-events-none absolute inset-0 rounded-[28px] bg-gradient-to-br from-amber-400/10 via-transparent to-transparent opacity-60" />
                  
                  {/* The Screen */}
                  <div className="relative aspect-video overflow-hidden rounded-2xl bg-black shadow-inner ring-1 ring-white/10">
                    {/* Screen reflection overlay */}
                    <div className="pointer-events-none absolute inset-0 z-20 bg-gradient-to-br from-white/5 via-transparent to-transparent" />
                    
                    {/* Poster image (always visible for instant load) */}
                    <img
                      src={heroPoster}
                      alt={content.hero.title}
                      className="absolute inset-0 h-full w-full object-cover"
                      loading="eager"
                      decoding="async"
                      fetchPriority="high"
                    />

                    {/* Video fades in when ready */}
                    {!heroFallback && (
                      <div
                        className={`absolute inset-0 transition-opacity duration-1000 ${
                          videoReady ? 'opacity-100' : 'opacity-0'
                        }`}
                      >
                        <video
                          ref={heroVideoRef}
                          className="h-full w-full object-cover"
                          src={heroVideo}
                          poster={heroPoster}
                          autoPlay
                          playsInline
                          muted
                          loop
                          preload="auto"
                        />
                      </div>
                    )}

                    {/* Cinematic letterbox bars */}
                    <div className="pointer-events-none absolute inset-x-0 top-0 h-6 bg-gradient-to-b from-black/70 to-transparent" />
                    <div className="pointer-events-none absolute inset-x-0 bottom-0 h-6 bg-gradient-to-t from-black/70 to-transparent" />

                    {/* Live indicator - decorative */}
                    <div className="pointer-events-none absolute left-4 top-4 z-30 flex items-center gap-2 rounded-full bg-black/70 px-3 py-1.5 backdrop-blur-sm">
                      <span className="relative flex h-2 w-2">
                        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-red-400 opacity-75" />
                        <span className="relative inline-flex h-2 w-2 rounded-full bg-red-500" />
                      </span>
                      <span className="text-[10px] font-semibold uppercase tracking-wider text-white/90">Live</span>
                    </div>

                    {/* Channel/Brand badge - decorative */}
                    <div className="pointer-events-none absolute right-4 top-4 z-30 flex items-center gap-2 rounded-lg bg-gradient-to-r from-amber-500/20 to-amber-600/20 px-3 py-1.5 backdrop-blur-sm">
                      <Crown className="h-3 w-3 text-amber-400" />
                      <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-amber-300">Recharge Elite</span>
                    </div>

                    {/* Play button overlay - decorative only */}
                    <div className="pointer-events-none absolute inset-0 z-10 flex items-center justify-center">
                      <div className="rounded-full bg-white/10 p-4 backdrop-blur-sm">
                        <Play className="h-8 w-8 text-white" fill="white" />
                      </div>
                    </div>

                    {/* Bottom info bar - decorative */}
                    <div className="pointer-events-none absolute inset-x-0 bottom-0 z-30 bg-gradient-to-t from-black/90 via-black/60 to-transparent p-4">
                      <div className="flex items-end justify-between">
                        <div>
                          <p className="text-xs uppercase tracking-[0.3em] text-amber-400">Now Showing</p>
                          <p className="text-lg font-semibold text-white">{luxuryCategories.find(c => c.id === selectedCategory)?.tagline}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-xs text-white/60">Starting from</p>
                          <p className="text-lg font-bold text-amber-400">{luxuryCategories.find(c => c.id === selectedCategory)?.priceFrom}</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* TV Control bar */}
                  <div className="mt-4 flex items-center justify-between px-2">
                    <div className="flex items-center gap-6">
                      <div className="flex items-center gap-2">
                        <div className="h-2 w-2 rounded-full bg-emerald-400 shadow-lg shadow-emerald-400/50" />
                        <span className="text-[9px] uppercase tracking-[0.15em] text-white/40">Power</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="h-2 w-2 rounded-full bg-amber-400 shadow-lg shadow-amber-400/50" />
                        <span className="text-[9px] uppercase tracking-[0.15em] text-white/40">8K HDR</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="h-2 w-2 rounded-full bg-blue-400 shadow-lg shadow-blue-400/50" />
                        <span className="text-[9px] uppercase tracking-[0.15em] text-white/40">Dolby Atmos</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-[9px] uppercase tracking-[0.15em] text-white/40">OLED Pro Display</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* TV Stand / Base - Premium */}
              <div className="relative mx-auto -mt-1 flex justify-center">
                <div className="h-10 w-24 rounded-b-xl bg-gradient-to-b from-slate-700 via-slate-800 to-slate-900 shadow-xl">
                  <div className="mx-auto mt-2 h-1 w-16 rounded-full bg-amber-500/30" />
                </div>
                <div className="absolute -bottom-3 h-4 w-48 rounded-full bg-gradient-to-b from-slate-600 to-slate-900 shadow-2xl" />
              </div>

              {/* Ambient glow under TV */}
              <div className="absolute -bottom-12 left-1/2 h-20 w-4/5 -translate-x-1/2 rounded-full bg-amber-500/15 blur-3xl" />
            </div>

            {/* Thumbnail gallery below TV */}
            {heroThumbnails.length > 0 && (
              <div className="mx-auto mt-10 max-w-2xl">
                <div className="flex gap-3">
                  {heroThumbnails.map((slide, index) => (
                    <button
                      key={slide.id}
                      type="button"
                      onClick={() => setHeroIndex(index)}
                      className={`group relative flex-1 overflow-hidden rounded-xl border-2 transition-all duration-300 ${
                        index === heroIndex
                          ? 'border-amber-400/80 shadow-lg shadow-amber-400/20'
                          : 'border-white/10 hover:border-white/30'
                      }`}
                      aria-label={`Show ${slide.caption}`}
                    >
                      <img
                        src={slide.image}
                        alt={slide.caption}
                        className="aspect-video w-full object-cover transition duration-500 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                      <div className="absolute inset-x-2 bottom-2 text-left">
                        <p className="truncate text-xs font-medium text-white">{slide.caption}</p>
                        {slide.tag && <p className="truncate text-[10px] text-amber-300/80">{slide.tag}</p>}
                      </div>
                      {index === heroIndex && (
                        <div className="absolute inset-x-0 bottom-0 h-0.5 bg-gradient-to-r from-transparent via-amber-400 to-transparent" />
                      )}
                    </button>
                  ))}
                </div>
                {/* Mobile dots */}
                <div className="mt-4 flex justify-center gap-2 lg:hidden">
                  {content.hero.images.map((slide, idx) => (
                    <button
                      key={slide.id}
                      type="button"
                      className={`h-1.5 rounded-full transition-all ${
                        idx === heroIndex ? 'w-6 bg-amber-400' : 'w-1.5 bg-white/30'
                      }`}
                      onClick={() => setHeroIndex(idx)}
                      aria-label={`Show hero slide ${idx + 1}`}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right: Content & Form */}
          <div className="mt-8 flex-1 space-y-5 lg:mt-0">
            {/* Badge & Title */}
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <Badge className="border border-amber-400/30 bg-gradient-to-r from-amber-500/20 to-amber-600/10 text-xs uppercase tracking-[0.4em] text-amber-300">
                  <Diamond className="mr-1.5 h-3 w-3" />
                  {content.hero.badge}
                </Badge>
                <div className="h-px flex-1 bg-gradient-to-r from-amber-400/30 to-transparent" />
              </div>
              <h1 className="text-3xl font-bold leading-tight sm:text-4xl lg:text-[2.75rem]">
                <span className="bg-gradient-to-r from-white via-white to-white/60 bg-clip-text text-transparent">
                  Billionaire Concierge
                </span>
              </h1>
              <p className="text-sm text-white/60 lg:text-base">{content.hero.subtitle}</p>
            </div>

            {/* Exclusive Amenities Grid */}
            <div className="grid grid-cols-2 gap-2">
              {exclusiveAmenities.map((item) => {
                const Icon = item.icon;
                return (
                  <div key={item.label} className="flex items-center gap-2 rounded-xl border border-white/5 bg-white/5 px-3 py-2">
                    <Icon className="h-4 w-4 text-amber-400" />
                    <div>
                      <p className="text-xs font-medium text-white">{item.label}</p>
                      <p className="text-[10px] text-white/50">{item.desc}</p>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Stats chips */}
            <div className="flex flex-wrap gap-2">
              {heroStats.map((stat) => {
                const Icon = statIconMap[stat.iconName] || Sparkles;
                return (
                  <div
                    key={stat.id}
                    className="flex items-center gap-2 rounded-full border border-amber-400/20 bg-amber-500/10 px-3 py-1.5 text-xs"
                  >
                    <Icon className="h-3 w-3 text-amber-400" />
                    <span className="text-white/70">{stat.label}:</span>
                    <span className="font-bold text-amber-300">{stat.value}</span>
                  </div>
                );
              })}
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-wrap gap-3">
              <Button
                size="lg"
                className="flex-1 bg-gradient-to-r from-amber-500 via-amber-500 to-amber-600 px-6 py-6 text-sm font-bold uppercase tracking-wider text-black shadow-xl shadow-amber-500/30 hover:from-amber-400 hover:to-amber-500"
                onClick={scrollToBooking}
              >
                <Crown className="mr-2 h-4 w-4" /> Request Manifest
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-white/20 bg-white/5 px-6 py-6 text-sm font-medium text-white backdrop-blur hover:bg-white/10"
                onClick={() => window.open(content.booking.whatsapp, '_blank')}
              >
                <MessageCircle className="mr-2 h-4 w-4" /> Chat
              </Button>
            </div>

            {/* Micro Form */}
            <form
              onSubmit={handleMicroFormSubmit}
              className="rounded-2xl border border-amber-400/20 bg-gradient-to-br from-amber-500/10 via-white/5 to-transparent p-4 backdrop-blur-xl"
            >
              <p className="text-xs uppercase tracking-[0.4em] text-white/60">Express manifest</p>
              <h3 className="mt-3 text-2xl font-semibold">{heroMicroForm.heading}</h3>
              <p className="text-sm text-white/70">{heroMicroForm.subheading}</p>
              <div className="mt-4 grid gap-3">
                {heroMicroForm.fields.map((field) => {
                  const commonProps = {
                    id: field.id,
                    name: field.id,
                    value: microFormValues[field.id] || '',
                    onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
                      handleMicroFieldChange(field, e.target.value),
                    className: 'w-full rounded-2xl border border-white/20 bg-black/20 px-3 py-2 text-sm text-white placeholder:text-white/50 focus:border-white/60 focus:outline-none'
                  };
                  if (field.type === 'select' && field.options) {
                    return (
                      <select key={field.id} {...commonProps}>
                        {field.options.map((option) => (
                          <option key={option} value={option}>
                            {option}
                          </option>
                        ))}
                      </select>
                    );
                  }
                  const inputType = field.type === 'date' ? 'date' : field.type === 'number' ? 'number' : 'text';
                  return (
                    <input
                      key={field.id}
                      type={inputType}
                      placeholder={field.placeholder}
                      {...commonProps}
                    />
                  );
                })}
              </div>
              <Button type="submit" className="mt-4 w-full bg-white/90 text-slate-900 hover:bg-white">
                {heroMicroForm.submitLabel}
              </Button>
              {microFormStatus === 'success' && (
                <p className="mt-2 rounded-xl bg-emerald-500/20 px-3 py-2 text-sm text-emerald-100">
                  {heroMicroForm.successMessage}
                </p>
              )}
            </form>

            {/* Concierge Desk Card */}
            <div className="rounded-2xl border border-amber-400/20 bg-gradient-to-br from-amber-500/10 via-amber-400/5 to-transparent p-5 backdrop-blur">
              <div className="flex items-center justify-between">
                <p className="text-xs uppercase tracking-[0.3em] text-amber-300/80">Concierge Desk</p>
                <div className="flex items-center gap-2">
                  <span
                    className={`inline-flex h-2 w-2 rounded-full ${
                      content.booking.isLive ? 'bg-emerald-400 animate-pulse shadow-lg shadow-emerald-400/50' : 'bg-amber-400'
                    }`}
                  />
                  <span className="text-xs text-white/70">
                    {content.booking.isLive ? 'Live' : 'Standby'}
                  </span>
                </div>
              </div>
              <h3 className="mt-2 text-xl font-semibold text-white">{content.booking.contactPhone}</h3>
              <p className="text-xs text-white/60">{content.booking.responseTime}</p>
              <div className="mt-3 flex gap-2">
                <Button
                  size="sm"
                  className="flex-1 bg-amber-500 text-xs font-semibold text-black hover:bg-amber-400"
                  onClick={scrollToBooking}
                >
                  Reserve Now
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  className="border-white/20 text-xs text-white hover:bg-white/10"
                  onClick={() => window.open(content.booking.whatsapp, '_blank')}
                >
                  <MessageCircle className="mr-1 h-3 w-3" /> Chat
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* LUXURY SERVICES SHOWCASE */}
      <section className="relative overflow-hidden bg-gradient-to-b from-black via-slate-950 to-black py-24">
        {/* Background effects */}
        <div className="absolute inset-0">
          <div className="absolute left-0 top-0 h-px w-full bg-gradient-to-r from-transparent via-amber-500/30 to-transparent" />
          <div className="absolute bottom-0 left-0 h-px w-full bg-gradient-to-r from-transparent via-amber-500/20 to-transparent" />
        </div>

        <div className="relative mx-auto max-w-7xl px-4">
          {/* Section header */}
          <div className="mb-16 text-center">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-amber-400/30 bg-amber-500/10 px-4 py-2">
              <Diamond className="h-4 w-4 text-amber-400" />
              <span className="text-xs font-semibold uppercase tracking-[0.3em] text-amber-300">Exclusive Services</span>
            </div>
            <h2 className="text-4xl font-bold text-white lg:text-5xl">
              <span className="bg-gradient-to-r from-white via-white to-white/60 bg-clip-text text-transparent">
                Four Pillars of Luxury
              </span>
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-lg text-white/60">
              Seamlessly orchestrated sea, sky, and land experiences for the world's most discerning travelers
            </p>
          </div>

          {/* Service Cards Grid */}
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {luxuryCategories.map((category, index) => {
              const Icon = category.icon;
              const isActive = selectedCategory === category.id;
              return (
                <motion.div
                  key={category.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className={`group relative cursor-pointer overflow-hidden rounded-3xl border transition-all duration-500 ${
                    isActive
                      ? `${category.borderColor} shadow-2xl`
                      : 'border-white/10 hover:border-white/20'
                  }`}
                  onClick={() => setSelectedCategory(category.id)}
                >
                  {/* Card background */}
                  <div className={`absolute inset-0 transition-opacity duration-500 ${isActive ? 'opacity-100' : 'opacity-0'}`}>
                    <div className={`h-full w-full bg-gradient-to-br ${category.color} opacity-10`} />
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-b from-white/5 to-transparent" />

                  <div className="relative p-6">
                    {/* Icon */}
                    <div className={`mb-4 inline-flex rounded-2xl p-3 ${category.bgColor}`}>
                      <Icon className={`h-8 w-8 bg-gradient-to-br ${category.color} bg-clip-text text-transparent`} style={{ color: isActive ? undefined : 'rgba(255,255,255,0.7)' }} />
                    </div>

                    {/* Content */}
                    <div className="space-y-2">
                      <p className="text-xs font-semibold uppercase tracking-[0.3em] text-white/50">{category.tagline}</p>
                      <h3 className="text-xl font-bold text-white">{category.name}</h3>
                      <p className="text-sm text-white/60">{category.description}</p>
                    </div>

                    {/* Price */}
                    <div className="mt-4 flex items-center justify-between">
                      <div>
                        <p className="text-xs text-white/40">Starting from</p>
                        <p className={`text-lg font-bold ${isActive ? 'text-amber-400' : 'text-white'}`}>{category.priceFrom}</p>
                      </div>
                      <div className={`rounded-full p-2 transition-all ${isActive ? 'bg-amber-500 text-black' : 'bg-white/10 text-white/60'}`}>
                        <ChevronRight className="h-4 w-4" />
                      </div>
                    </div>

                    {/* Active indicator */}
                    {isActive && (
                      <div className="absolute inset-x-0 bottom-0 h-1 bg-gradient-to-r from-transparent via-amber-400 to-transparent" />
                    )}
                  </div>
                </motion.div>
              );
            })}
          </div>

          {/* Trust badges */}
          <div className="mt-16 flex flex-wrap items-center justify-center gap-8 border-t border-white/10 pt-12">
            <div className="flex items-center gap-3">
              <Shield className="h-6 w-6 text-amber-400" />
              <div>
                <p className="text-sm font-semibold text-white">Comprehensive Coverage</p>
                <p className="text-xs text-white/50">USD 50M liability</p>
              </div>
            </div>
            <div className="h-8 w-px bg-white/20" />
            <div className="flex items-center gap-3">
              <Clock className="h-6 w-6 text-amber-400" />
              <div>
                <p className="text-sm font-semibold text-white">Instant Response</p>
                <p className="text-xs text-white/50">&lt;12 min reply time</p>
              </div>
            </div>
            <div className="h-8 w-px bg-white/20" />
            <div className="flex items-center gap-3">
              <Globe className="h-6 w-6 text-amber-400" />
              <div>
                <p className="text-sm font-semibold text-white">Global Reach</p>
                <p className="text-xs text-white/50">120+ destinations</p>
              </div>
            </div>
            <div className="h-8 w-px bg-white/20" />
            <div className="flex items-center gap-3">
              <Crown className="h-6 w-6 text-amber-400" />
              <div>
                <p className="text-sm font-semibold text-white">UHNW Trusted</p>
                <p className="text-xs text-white/50">5,800+ elite clients</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* OVERVIEW + STATS */}
      <section className="bg-[#050608] py-20 text-white">
        <div className="mx-auto grid max-w-6xl gap-12 px-4 lg:grid-cols-[1.1fr_0.9fr]">
          <div>
            <p className="text-xs uppercase tracking-[0.4em] text-amber-400">The Recharge Protocol</p>
            <h2 className="mt-4 text-3xl font-bold">Where Billionaires Escape</h2>
            <p className="mt-6 text-lg text-white/70">{content.overview.summary}</p>
            <div className="mt-10 grid gap-4 sm:grid-cols-2">
              {content.overview.highlights.map((highlight) => (
                <div key={highlight.id} className="rounded-2xl border border-amber-400/20 bg-gradient-to-br from-amber-500/10 to-transparent p-5">
                  <p className="text-sm font-semibold text-amber-300">{highlight.label}</p>
                  <p className="mt-2 text-sm text-white/70">{highlight.description}</p>
                </div>
              ))}
            </div>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            {content.stats.map((stat) => {
              const Icon = statIconMap[stat.iconName] || Sparkles;
              return (
                <div key={stat.id} className="rounded-2xl border border-white/10 bg-gradient-to-b from-white/10 to-white/0 p-6 text-center">
                  <Icon className="mx-auto mb-3 h-7 w-7 text-amber-400" />
                  <p className="text-3xl font-bold text-white">{stat.value}</p>
                  <p className="text-xs uppercase tracking-[0.3em] text-white/50">{stat.label}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* FLEET CAROUSEL */}
      <section className="relative overflow-hidden bg-gradient-to-b from-[#03040a] via-slate-950 to-black py-24 text-white">
        {/* Decorative elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -right-40 top-20 h-80 w-80 rounded-full bg-amber-500/5 blur-[100px]" />
          <div className="absolute -left-40 bottom-20 h-80 w-80 rounded-full bg-purple-500/5 blur-[100px]" />
        </div>

        <div className="relative mx-auto max-w-7xl px-4">
          <div className="mb-12 flex flex-wrap items-end justify-between gap-6">
            <div>
              <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-amber-400/30 bg-amber-500/10 px-3 py-1.5">
                <Crown className="h-3.5 w-3.5 text-amber-400" />
                <span className="text-xs font-semibold uppercase tracking-[0.2em] text-amber-300">The Armada</span>
              </div>
              <h2 className="text-3xl font-bold lg:text-4xl">Your Fleet Awaits</h2>
              <p className="mt-2 text-white/60">Superyachts, Gulfstreams, and executive helicopters—ready on your command</p>
            </div>
            <Button variant="outline" className="border-amber-400/30 bg-amber-500/10 text-amber-300 hover:bg-amber-500/20">
              <ArrowRight className="mr-2 h-4 w-4" /> Request Fleet Dossier
            </Button>
          </div>

          <div className="no-scrollbar flex gap-6 overflow-x-auto pb-6">
            {content.fleet.map((asset, index) => (
              <motion.div
                key={asset.id}
                initial={{ opacity: 0, x: 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="group min-w-[340px] lg:min-w-[400px]"
              >
                <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-b from-white/5 to-transparent transition-all duration-500 hover:border-amber-400/30 hover:shadow-2xl hover:shadow-amber-500/10">
                  {/* Image */}
                  <div className="relative h-60 overflow-hidden">
                    <motion.img
                      whileHover={{ scale: 1.08 }}
                      transition={{ duration: 0.8 }}
                      src={asset.image}
                      alt={asset.name}
                      className="h-full w-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                    
                    {/* Overlay badge */}
                    <div className="absolute left-4 top-4">
                      <Badge className="border border-amber-400/30 bg-black/60 text-xs uppercase tracking-[0.2em] text-amber-300 backdrop-blur-sm">
                        {asset.vesselType}
                      </Badge>
                    </div>

                    {/* Price tag */}
                    <div className="absolute bottom-4 right-4 rounded-xl bg-black/70 px-3 py-2 backdrop-blur-sm">
                      <p className="text-xs text-white/60">From</p>
                      <p className="text-lg font-bold text-amber-400">{asset.priceLabel}</p>
                    </div>
                  </div>

                  <div className="space-y-4 p-6">
                    <div>
                      <h3 className="text-2xl font-bold">{asset.name}</h3>
                      <p className="text-sm text-white/60">{asset.capacity} · {asset.range}</p>
                    </div>

                    {/* Highlights */}
                    <div className="space-y-2">
                      {asset.highlights.slice(0, 3).map((item) => (
                        <div key={item} className="flex items-center gap-2 text-sm text-white/80">
                          <CheckCircle className="h-4 w-4 text-amber-400" />
                          {item}
                        </div>
                      ))}
                    </div>

                    {/* Hospitality */}
                    <div className="rounded-xl border border-white/10 bg-white/5 p-3">
                      <p className="mb-2 text-[10px] uppercase tracking-[0.3em] text-white/40">Hospitality Included</p>
                      <div className="flex flex-wrap gap-2">
                        {asset.hospitality.slice(0, 2).map((item) => (
                          <span key={item} className="rounded-full bg-amber-500/10 px-2 py-1 text-xs text-amber-300">
                            {item}
                          </span>
                        ))}
                      </div>
                    </div>

                    <Button
                      className="w-full bg-gradient-to-r from-amber-500 to-amber-600 font-semibold text-black hover:from-amber-400 hover:to-amber-500"
                      onClick={scrollToBooking}
                    >
                      <Crown className="mr-2 h-4 w-4" /> Reserve This Asset
                    </Button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* JOURNEY TIMELINE */}
      <section className="bg-gradient-to-b from-slate-50 to-white py-24">
        <div className="mx-auto max-w-6xl px-4">
          <div className="mb-14 text-center">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-amber-400/30 bg-amber-500/10 px-4 py-2">
              <MapPin className="h-4 w-4 text-amber-600" />
              <span className="text-xs font-semibold uppercase tracking-[0.3em] text-amber-700">Signature Odysseys</span>
            </div>
            <h2 className="text-3xl font-bold text-slate-900 lg:text-4xl">Impossible Itineraries, Perfectly Executed</h2>
            <p className="mx-auto mt-4 max-w-2xl text-slate-600">Multi-modal journeys that span sea, sky, and land—orchestrated to the minute</p>
          </div>
          <div className="relative before:absolute before:left-[12px] before:top-0 before:h-full before:w-px before:bg-gradient-to-b before:from-amber-400 before:to-amber-200">
            {content.journeys.map((journey, index) => (
              <motion.div
                key={journey.id}
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="relative mb-10 pl-14"
              >
                <div className="absolute left-0 top-2 flex h-6 w-6 items-center justify-center rounded-full border-4 border-white bg-gradient-to-br from-amber-400 to-amber-600 shadow-lg shadow-amber-500/30">
                  <span className="text-[10px] font-bold text-white">{index + 1}</span>
                </div>
                <div className="rounded-3xl border border-slate-200/80 bg-white p-6 shadow-xl shadow-slate-900/5 transition-all hover:border-amber-300/50 hover:shadow-amber-500/10">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-[0.3em] text-amber-600">Odyssey {index + 1}</p>
                      <h3 className="text-2xl font-bold text-slate-900">{journey.title}</h3>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-semibold text-slate-900">{journey.duration}</p>
                      <p className="text-xs text-slate-500">{journey.route}</p>
                    </div>
                  </div>
                  <p className="mt-4 text-sm leading-relaxed text-slate-600">{journey.description}</p>
                  <div className="mt-5 flex flex-wrap gap-2">
                    {journey.services.map((service) => (
                      <span key={service} className="rounded-full border border-amber-200 bg-amber-50 px-3 py-1 text-xs font-medium text-amber-700">
                        {service}
                      </span>
                    ))}
                  </div>
                  <Button
                    className="mt-5 bg-gradient-to-r from-amber-500 to-amber-600 font-semibold text-black hover:from-amber-400 hover:to-amber-500"
                    onClick={scrollToBooking}
                  >
                    <Crown className="mr-2 h-4 w-4" /> Book This Journey
                  </Button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {missions.length > 0 && (
        <section className="bg-gradient-to-b from-[#010207] to-black py-20 text-white">
          <div className="mx-auto max-w-5xl space-y-12 px-4">
            <div className="text-center">
              <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-amber-400/30 bg-amber-500/10 px-4 py-2">
                <Clock className="h-4 w-4 text-amber-400" />
                <span className="text-xs font-semibold uppercase tracking-[0.3em] text-amber-300">Live Dispatch Log</span>
              </div>
              <h2 className="text-3xl font-bold lg:text-4xl">From Request to Champagne Sabrage</h2>
              <p className="mx-auto mt-4 max-w-xl text-white/60">A real dispatch from our ops desk—executed in under 4 hours</p>
            </div>
            <div className="relative border-l border-white/15 pl-8">
              {missions.map((mission, index) => (
                <div key={mission.id} className="relative pb-10">
                  <span className="absolute -left-[10px] top-1.5 h-3 w-3 rounded-full bg-emerald-400" />
                  <div className="rounded-3xl border border-white/10 bg-white/5 p-5 backdrop-blur">
                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <div>
                        <p className="text-xs uppercase tracking-[0.4em] text-white/50">
                          Phase {index + 1}
                        </p>
                        <h3 className="text-xl font-semibold">{mission.title}</h3>
                      </div>
                      <p className="text-sm text-white/70">{mission.timestamp}</p>
                    </div>
                    <p className="mt-3 text-sm text-white/80">{mission.description}</p>
                    {mission.quote && (
                      <p className="mt-3 rounded-2xl bg-white/5 p-3 text-sm text-white/70">
                        “{mission.quote}”
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {crewHighlights.length > 0 && (
        <section className="bg-gradient-to-b from-white to-slate-50 py-20">
          <div className="mx-auto max-w-6xl space-y-10 px-4">
            <div className="text-center">
              <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-amber-400/30 bg-amber-500/10 px-4 py-2">
                <Users className="h-4 w-4 text-amber-600" />
                <span className="text-xs font-semibold uppercase tracking-[0.3em] text-amber-700">Elite Personnel</span>
              </div>
              <h2 className="text-3xl font-bold text-slate-900 lg:text-4xl">The Minds Behind Your Escape</h2>
              <p className="mx-auto mt-4 max-w-xl text-slate-600">World-class captains, sommeliers, and wellness experts at your service</p>
            </div>
            <div className="grid gap-6 md:grid-cols-3">
              {crewHighlights.map((crew) => (
                <div key={crew.id} className="rounded-3xl border border-slate-100 bg-slate-50/60 p-6">
                  <div className="mb-4 space-y-1">
                    <p className="text-sm uppercase tracking-[0.3em] text-emerald-600">{crew.role}</p>
                    <h3 className="text-xl font-semibold text-slate-900">{crew.name}</h3>
                  </div>
                  <p className="text-sm text-slate-600">{crew.bio}</p>
                  {crew.badges.length > 0 && (
                    <div className="mt-4 flex flex-wrap gap-2">
                      {crew.badges.map((badge) => (
                        <span key={badge} className="rounded-full bg-white px-3 py-1 text-xs font-semibold text-slate-700">
                          {badge}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {rituals.length > 0 && (
        <section className="bg-gradient-to-b from-[#03040a] to-black py-20 text-white">
          <div className="mx-auto max-w-6xl space-y-10 px-4">
            <div className="text-center">
              <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-amber-400/30 bg-amber-500/10 px-4 py-2">
                <Sparkles className="h-4 w-4 text-amber-400" />
                <span className="text-xs font-semibold uppercase tracking-[0.3em] text-amber-300">Signature Rituals</span>
              </div>
              <h2 className="text-3xl font-bold lg:text-4xl">The Art of Arrival</h2>
              <p className="mx-auto mt-4 max-w-xl text-white/60">Curated experiences that transform travel into transcendence</p>
            </div>
            <div className="grid gap-5 md:grid-cols-3">
              {rituals.map((ritual) => (
                <div key={ritual.id} className="rounded-3xl border border-white/10 bg-white/5 p-5 backdrop-blur">
                  <p className="text-xs uppercase tracking-[0.3em] text-white/50">{ritual.tag}</p>
                  <h3 className="mt-2 text-xl font-semibold">{ritual.title}</h3>
                  <p className="mt-3 text-sm text-white/80">{ritual.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CONCIERGE RITUALS / TESTIMONIALS */}
      <section className="bg-gradient-to-b from-[#02040b] to-black py-24 text-white">
        <div className="mx-auto grid max-w-6xl gap-10 px-4 lg:grid-cols-2">
          <div className="space-y-6 rounded-3xl border border-amber-400/20 bg-gradient-to-br from-amber-500/10 to-transparent p-8">
            <div className="inline-flex items-center gap-2 rounded-full border border-amber-400/30 bg-amber-500/10 px-3 py-1.5">
              <Crown className="h-3.5 w-3.5 text-amber-400" />
              <span className="text-xs font-semibold uppercase tracking-[0.2em] text-amber-300">The Recharge Standard</span>
            </div>
            <h3 className="text-3xl font-bold">Every Detail, Orchestrated</h3>
            <ul className="space-y-4 text-sm text-white/80">
              <li className="flex gap-3">
                <CheckCircle className="mt-0.5 h-5 w-5 text-amber-400" /> 
                <span>Dedicated concierge drafts ops manifest + wellness program within <strong className="text-white">12 minutes</strong></span>
              </li>
              <li className="flex gap-3">
                <CheckCircle className="mt-0.5 h-5 w-5 text-amber-400" /> 
                <span>Diplomatic customs clearance, armored transfers, and butler brief—<strong className="text-white">one call</strong></span>
              </li>
              <li className="flex gap-3">
                <CheckCircle className="mt-0.5 h-5 w-5 text-amber-400" /> 
                <span>Night-vision heli or yacht chase boat delivers champagne sabrage <strong className="text-white">on arrival</strong></span>
              </li>
              <li className="flex gap-3">
                <CheckCircle className="mt-0.5 h-5 w-5 text-amber-400" /> 
                <span>Michelin chef, master sommelier, and security detail <strong className="text-white">pre-positioned</strong></span>
              </li>
            </ul>
            <div className="rounded-2xl border border-amber-400/30 bg-gradient-to-r from-amber-500/20 to-amber-600/10 p-5">
              <p className="text-xs uppercase tracking-[0.3em] text-amber-300/80">Billionaire Desk</p>
              <p className="mt-1 text-xl font-bold text-white">+94 77 772 1999</p>
              <p className="text-sm text-white/60">elite@rechargetravels.com</p>
              <p className="mt-2 text-xs text-amber-300">Response in &lt;12 minutes · 24/7 Global Ops</p>
            </div>
          </div>
          <div className="space-y-6">
            {testimonials.map((item) => (
              <div key={item.author} className="rounded-[32px] border border-white/10 bg-gradient-to-br from-white/05 to-white/0 p-6">
                <p className="text-lg text-white/90">“{item.quote}”</p>
                <p className="mt-4 text-sm uppercase tracking-[0.3em] text-white/50">{item.author}</p>
              </div>
            ))}
            <div className="flex flex-wrap items-center gap-4 text-xs uppercase tracking-[0.4em] text-white/40">
              {partnerLogos.map((logo) => (
                <span key={logo}>{logo}</span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* BOOKING MODULE */}
      <section ref={bookingRef} className="bg-[#010207] py-20 text-white">
        <div className="mx-auto grid max-w-6xl gap-10 lg:grid-cols-[1.05fr_0.95fr]">
          <div className="space-y-6">
            <p className="text-xs uppercase tracking-[0.4em] text-emerald-300">24/7 dispatch desk</p>
            <h2 className="text-3xl font-semibold">Plan your charter</h2>
            <p className="text-white/70">{content.booking.conciergeNote}</p>
            <div className="space-y-4 rounded-[32px] border border-white/10 bg-white/5 p-6 text-sm">
              <div className="flex items-center gap-3">
                <Phone className="h-4 w-4 text-emerald-300" /> {content.booking.contactPhone}
              </div>
              <div className="flex items-center gap-3">
                <MessageCircle className="h-4 w-4 text-emerald-300" /> {content.booking.whatsapp}
              </div>
              <div className="flex items-center gap-3">
                <Mail className="h-4 w-4 text-emerald-300" /> {content.booking.email}
              </div>
              <p className="text-xs uppercase tracking-[0.4em] text-white/40">{content.booking.responseTime}</p>
              <p className="text-xs text-white/40">{content.booking.depositNote}</p>
              <p className="text-xs text-white/40">{content.booking.contractNote}</p>
            </div>
          </div>
          <Card className="border-white/10 bg-white text-slate-900 shadow-2xl">
            <CardHeader>
              <CardTitle className="text-2xl">Hold my charter</CardTitle>
              <p className="text-sm text-slate-500">We reply with manifest documents & builder options in under 15 minutes.</p>
            </CardHeader>
            <CardContent>
              <form className="space-y-4" onSubmit={submitRequest}>
                <div className="grid gap-4 md:grid-cols-2">
                  <label className="text-sm font-medium text-slate-700">
                    Preferred date
                    <input
                      type="date"
                      required
                      value={formData.startDate}
                      onChange={(e) => handleInputChange('startDate', e.target.value)}
                      className="mt-2 w-full rounded-2xl border border-slate-200 px-3 py-3"
                    />
                  </label>
                  <label className="text-sm font-medium text-slate-700">
                    Guests
                    <input
                      type="number"
                      min={1}
                      value={formData.guests}
                      onChange={(e) => handleInputChange('guests', Number(e.target.value))}
                      className="mt-2 w-full rounded-2xl border border-slate-200 px-3 py-3"
                    />
                  </label>
                </div>
                <label className="text-sm font-medium text-slate-700">
                  Charter type
                  <select
                    value={formData.charterType}
                    onChange={(e) => handleInputChange('charterType', e.target.value)}
                    className="mt-2 w-full rounded-2xl border border-slate-200 px-3 py-3"
                  >
                    <option>Superyacht</option>
                    <option>Private Jet</option>
                    <option>Helicopter</option>
                    <option>Multi-modal</option>
                  </select>
                </label>
                <label className="text-sm font-medium text-slate-700">
                  Route / Focus
                  <input
                    type="text"
                    value={formData.route}
                    onChange={(e) => handleInputChange('route', e.target.value)}
                    placeholder="Colombo → Maldives · sunset sabrage"
                    className="mt-2 w-full rounded-2xl border border-slate-200 px-3 py-3"
                  />
                </label>
                <label className="text-sm font-medium text-slate-700">
                  Pickup / Landing notes
                  <input
                    type="text"
                    value={formData.pickup}
                    onChange={(e) => handleInputChange('pickup', e.target.value)}
                    placeholder="Port City helipad · Velana VIP"
                    className="mt-2 w-full rounded-2xl border border-slate-200 px-3 py-3"
                  />
                </label>
                <div className="grid gap-4 md:grid-cols-2">
                  <label className="text-sm font-medium text-slate-700">
                    Full name
                    <input
                      type="text"
                      required
                      value={formData.contactName}
                      onChange={(e) => handleInputChange('contactName', e.target.value)}
                      className="mt-2 w-full rounded-2xl border border-slate-200 px-3 py-3"
                    />
                  </label>
                  <label className="text-sm font-medium text-slate-700">
                    Email
                    <input
                      type="email"
                      required
                      value={formData.contactEmail}
                      onChange={(e) => handleInputChange('contactEmail', e.target.value)}
                      className="mt-2 w-full rounded-2xl border border-slate-200 px-3 py-3"
                    />
                  </label>
                </div>
                <label className="text-sm font-medium text-slate-700">
                  Phone / WhatsApp
                  <input
                    type="tel"
                    required
                    value={formData.contactPhone}
                    onChange={(e) => handleInputChange('contactPhone', e.target.value)}
                    className="mt-2 w-full rounded-2xl border border-slate-200 px-3 py-3"
                  />
                </label>
                <label className="text-sm font-medium text-slate-700">
                  Preferences & onboard rituals
                  <textarea
                    rows={3}
                    value={formData.requests}
                    onChange={(e) => handleInputChange('requests', e.target.value)}
                    placeholder="Chef preferences, floral, wellness, entertainment"
                    className="mt-2 w-full rounded-2xl border border-slate-200 px-3 py-3"
                  />
                </label>
                <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-600">
                  <div className="flex items-center justify-between text-slate-900">
                    <span className="font-medium">Estimated from</span>
                    <span className="text-lg font-semibold">
                      {content.pricing.currency} {estimatedTotal.toLocaleString()}
                    </span>
                  </div>
                  <p className="mt-2 text-xs text-slate-500">
                    Superyachts from {content.pricing.currency} {content.pricing.yachtMinimum.toLocaleString()} · Jets from {content.pricing.currency}{' '}
                    {content.pricing.jetMinimum.toLocaleString()}
                  </p>
                </div>
                <Button type="submit" className="w-full bg-emerald-500 py-3 text-base font-semibold text-white hover:bg-emerald-400">
                  Secure dispatch window
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* GALLERY */}
      <section className="bg-white py-20">
        <div className="mx-auto max-w-6xl">
          <div className="mb-10 text-center">
            <p className="text-xs uppercase tracking-[0.4em] text-emerald-600">Gallery</p>
            <h2 className="text-3xl font-semibold text-slate-900">Moments from the fleet</h2>
          </div>
          <div className="grid gap-4 md:grid-cols-3">
            {content.gallery.map((image) => (
              <motion.figure
                key={image.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
                className="relative overflow-hidden rounded-[32px]"
              >
                <img src={image.image} alt={image.caption} className="h-72 w-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/0" />
                <figcaption className="absolute bottom-4 left-4 text-sm text-white">{image.caption}</figcaption>
              </motion.figure>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="bg-slate-50 py-20">
        <div className="mx-auto max-w-4xl">
          <div className="mb-10 text-center">
            <p className="text-xs uppercase tracking-[0.4em] text-emerald-600">FAQs</p>
            <h2 className="text-3xl font-semibold text-slate-900">Plan with confidence</h2>
          </div>
          <Accordion type="single" collapsible className="space-y-4">
            {content.faqs.map((faq) => (
              <AccordionItem key={faq.id} value={faq.id} className="rounded-2xl border border-slate-200 bg-white px-4">
                <AccordionTrigger className="text-left text-base font-semibold text-slate-900">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="pb-4 text-sm leading-relaxed text-slate-600">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </section>

      <Footer />
    </>
  );
};

export default PrivateCharters;
