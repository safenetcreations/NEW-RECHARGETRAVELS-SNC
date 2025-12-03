import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
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
  Car,
  CheckCircle,
  Clock,
  Crown,
  Mail,
  MessageCircle,
  Phone,
  Plane,
  Ship,
  Sparkles,
  Star,
  Users,
  Waves
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
  Car
};

const fallbackHeroVideo = 'https://cdn.coverr.co/videos/coverr-super-yacht-at-sunset-9339/1080p.mp4';
const fallbackPoster = 'https://images.unsplash.com/photo-1500375592092-40eb2168fd21?auto=format&fit=crop&w=2000&q=80';

const fallbackTestimonials = [
  {
    quote:
      'Recharge choreographed a Colombo-to-Maldives escape with minutes-notice. Chef, sommelier, and pilot brief were immaculate.',
    author: 'Amara & Devan (Zurich)'
  },
  {
    quote:
      'Boardroom setup on the Gulfstream, seaplane transfer to the catamaran, and IV lounge on deck—flawless execution.',
    author: 'C. Wellington, Venture Partner'
  },
  {
    quote:
      'Night-vision heli into Yala, sunrise balloon over Lion Rock, and yacht brunch within 24 hours. No one else runs ops like this.',
    author: 'Helena Ortiz, Creative Director'
  }
];
const fallbackPartners = ['Benetti', 'Gulfstream', 'Airbus', 'VistaJet', 'Relais & Châteaux'];
const fallbackStats = [
  { id: 'stat-fallback-1', iconName: 'Crown', label: 'UHNW manifests', value: '5,800+' },
  { id: 'stat-fallback-2', iconName: 'Clock', label: 'Concierge response', value: '<15 min' },
  { id: 'stat-fallback-3', iconName: 'Plane', label: 'Global fleet', value: 'Sea · Sky · Ground' }
];

const defaultPrivateChartersContent = privateChartersPageService.getDefaultContent();

const PrivateCharters = () => {
  const [content, setContent] = useState<PrivateChartersPageContent>(defaultPrivateChartersContent);
  const [loading, setLoading] = useState(true);
  const [heroIndex, setHeroIndex] = useState(0);
  const bookingRef = useRef<HTMLDivElement | null>(null);
  const heroVideoRef = useRef<HTMLVideoElement | null>(null);
  const fallbackTimerRef = useRef<NodeJS.Timeout | null>(null);
  const [videoReady, setVideoReady] = useState(false);
  const [showVideo, setShowVideo] = useState(false);
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
    setShowVideo(false);
    if (fallbackTimerRef.current) {
      clearTimeout(fallbackTimerRef.current);
    }
    const handleCanPlay = () => {
      if (fallbackTimerRef.current) {
        clearTimeout(fallbackTimerRef.current);
      }
      setVideoReady(true);
      setShowVideo(true);
      const playPromise = video.play();
      if (playPromise?.catch) {
        playPromise.catch(() => {
          setShowVideo(false);
        });
      }
    };
    const handleError = () => {
      if (fallbackTimerRef.current) {
        clearTimeout(fallbackTimerRef.current);
      }
      setShowVideo(false);
      setVideoReady(true);
    };
    video.addEventListener('canplay', handleCanPlay);
    video.addEventListener('error', handleError);
    video.load();
    fallbackTimerRef.current = setTimeout(() => {
      setShowVideo(false);
      setVideoReady(true);
    }, 4000);
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

      {/* HERO */}
      <section className="relative min-h-[85vh] overflow-hidden bg-black text-white">
        <div className="absolute inset-0" aria-live="polite">
          {/* Always render poster as base to avoid black gaps */}
          <img src={heroPoster} alt={content.hero.title} className="h-full w-full object-cover" />
          {showVideo && (
            <video
              ref={heroVideoRef}
              className="absolute inset-0 h-full w-full object-cover"
              src={heroVideo}
              poster={heroPoster}
              autoPlay
              playsInline
              muted
              loop
              preload="metadata"
            />
          )}
          <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/55 to-black/90" />
          {!videoReady && (
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 bg-black/70 text-center text-white">
              <div className="h-12 w-12 animate-spin rounded-full border-2 border-white/30 border-t-transparent" />
              <p className="text-sm uppercase tracking-[0.4em] text-white/60">
                Warming up the charter reel…
              </p>
            </div>
          )}
        </div>

        <div className="relative z-10 mx-auto grid min-h-[85vh] max-w-6xl gap-8 px-4 pb-16 pt-24 lg:grid-cols-[minmax(0,1fr)_360px]">
          <div className="flex flex-col justify-end space-y-6 text-left">
            <div className="space-y-5">
              <Badge className="w-fit bg-white/10 text-xs uppercase tracking-[0.4em] text-white">
                {content.hero.badge}
              </Badge>
              <h1 className="text-4xl font-semibold leading-tight sm:text-5xl lg:text-6xl">
                {content.hero.title}
              </h1>
              <p className="max-w-2xl text-lg text-white/85">{content.hero.subtitle}</p>
              <div className="flex flex-wrap gap-3">
                {heroStats.map((stat) => {
                  const Icon = statIconMap[stat.iconName] || Sparkles;
                  return (
                    <div
                      key={stat.id}
                      className="flex items-center gap-3 rounded-full border border-white/20 bg-white/5 px-4 py-2 text-sm text-white/80 backdrop-blur"
                    >
                      <Icon className="h-4 w-4 text-emerald-300" />
                      <div>
                        <p className="text-xs uppercase tracking-[0.3em] text-white/60">{stat.label}</p>
                        <p className="text-base font-semibold text-white">{stat.value}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="flex flex-wrap gap-4">
              <Button
                size="lg"
                className="bg-white/90 px-10 py-6 text-base font-semibold text-slate-900 hover:bg-white"
                onClick={scrollToBooking}
              >
                <Crown className="mr-2 h-5 w-5" /> Request manifest
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-white/40 px-10 py-6 text-base text-white hover:bg-white/10"
                onClick={() => window.open(content.booking.whatsapp, '_blank')}
              >
                <MessageCircle className="mr-2 h-5 w-5" /> 24/7 WhatsApp desk
              </Button>
            </div>

            {heroThumbnails.length > 0 && (
              <>
                <div className="hidden gap-3 pt-2 md:flex">
                  {heroThumbnails.map((slide, index) => (
                    <button
                      key={slide.id}
                      type="button"
                      onClick={() => setHeroIndex(index)}
                      className={`group relative flex-1 overflow-hidden rounded-2xl border transition ${
                        index === heroIndex ? 'border-white/60' : 'border-white/20 hover:border-white/50'
                      }`}
                      aria-label={`Show ${slide.caption}`}
                    >
                      <img
                        src={slide.image}
                        alt={slide.caption}
                        className="h-28 w-full object-cover transition duration-500 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                      <div className="absolute inset-x-3 bottom-3 text-left text-sm">
                        <p className="font-semibold">{slide.caption}</p>
                        {slide.tag && <p className="text-xs text-white/70">{slide.tag}</p>}
                      </div>
                    </button>
                  ))}
                </div>
                <div className="mt-4 flex gap-2 md:hidden">
                  {content.hero.images.map((slide, idx) => (
                    <button
                      key={slide.id}
                      type="button"
                      className={`h-2 flex-1 rounded-full transition-all ${idx === heroIndex ? 'bg-white' : 'bg-white/40'}`}
                      onClick={() => setHeroIndex(idx)}
                      aria-label={`Show hero slide ${idx + 1}`}
                    />
                  ))}
                </div>
              </>
            )}
          </div>

          <div className="space-y-5">
            <form
              onSubmit={handleMicroFormSubmit}
              className="rounded-[32px] border border-white/15 bg-white/5 p-6 backdrop-blur"
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

            <div className="rounded-[32px] border border-white/15 bg-white/5 p-6 backdrop-blur">
              <div className="flex items-center gap-3 text-sm font-semibold">
                <span
                  className={`inline-flex h-2.5 w-2.5 rounded-full ${
                    content.booking.isLive ? 'bg-emerald-300 animate-pulse' : 'bg-amber-300'
                  }`}
                />
                {content.booking.isLive ? 'Desk live now' : 'Desk on standby'}
              </div>
              <p className="text-xs uppercase tracking-[0.4em] text-white/60">Concierge desk</p>
              <h3 className="mt-3 text-3xl font-semibold">{content.booking.contactPhone}</h3>
              <p className="text-sm text-white/70">{content.booking.responseTime}</p>
              {content.booking.nextAvailabilityWindow && (
                <p className="text-xs text-white/60">{content.booking.nextAvailabilityWindow}</p>
              )}
              <p className="mt-4 text-sm text-white/75">{content.booking.conciergeNote}</p>
              <div className="mt-5 space-y-3 text-sm text-white/80">
                <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
                  <Phone className="h-4 w-4 text-emerald-300" />
                  <div>
                    <p className="text-xs uppercase tracking-[0.3em] text-white/60">Call</p>
                    <p className="text-white">{content.booking.contactPhone}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
                  <MessageCircle className="h-4 w-4 text-emerald-300" />
                  <div>
                    <p className="text-xs uppercase tracking-[0.3em] text-white/60">WhatsApp</p>
                    <p className="text-white">{content.booking.whatsapp}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
                  <Mail className="h-4 w-4 text-emerald-300" />
                  <div>
                    <p className="text-xs uppercase tracking-[0.3em] text-white/60">Email</p>
                    <p className="text-white break-all">{content.booking.email}</p>
                  </div>
                </div>
              </div>
              <div className="mt-6 space-y-3">
                <Button
                  className="w-full bg-emerald-500 py-3 text-base font-semibold text-white hover:bg-emerald-400"
                  onClick={scrollToBooking}
                >
                  Hold my charter window
                </Button>
                <Button
                  variant="outline"
                  className="w-full border-white/40 text-white hover:bg-white/10"
                  onClick={() => window.open(content.booking.whatsapp, '_blank')}
                >
                  <MessageCircle className="mr-2 h-4 w-4" /> Message concierge
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* OVERVIEW + STATS */}
      <section className="bg-[#050608] py-20 text-white">
        <div className="mx-auto grid max-w-6xl gap-12 lg:grid-cols-[1.1fr_0.9fr]">
          <div>
            <p className="text-xs uppercase tracking-[0.4em] text-emerald-300">Concierge doctrine</p>
            <h2 className="mt-4 text-3xl font-semibold">{content.hero.title}</h2>
            <p className="mt-6 text-lg text-white/70">{content.overview.summary}</p>
            <div className="mt-10 grid gap-4 sm:grid-cols-2">
              {content.overview.highlights.map((highlight) => (
                <div key={highlight.id} className="rounded-3xl border border-white/10 bg-white/5 p-5">
                  <p className="text-sm font-semibold text-white">{highlight.label}</p>
                  <p className="mt-2 text-sm text-white/70">{highlight.description}</p>
                </div>
              ))}
            </div>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            {content.stats.map((stat) => {
              const Icon = statIconMap[stat.iconName] || Sparkles;
              return (
                <div key={stat.id} className="rounded-3xl border border-white/10 bg-gradient-to-b from-white/10 to-white/0 p-6 text-center">
                  <Icon className="mx-auto mb-3 h-7 w-7 text-emerald-300" />
                  <p className="text-3xl font-semibold text-white">{stat.value}</p>
                  <p className="text-xs uppercase tracking-[0.3em] text-white/50">{stat.label}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* FLEET CAROUSEL */}
      <section className="bg-[#03040a] py-20 text-white">
        <div className="mx-auto max-w-6xl">
          <div className="mb-10 flex flex-wrap items-center justify-between gap-4">
            <div>
              <p className="text-xs uppercase tracking-[0.4em] text-emerald-300">Fleet dossier</p>
              <h2 className="mt-3 text-3xl font-semibold">Flagship assets on call</h2>
            </div>
            <Button variant="outline" className="border-white/30 text-white hover:bg-white/10">
              Download fleet brief
            </Button>
          </div>
          <div className="no-scrollbar flex gap-6 overflow-x-auto pb-4">
            {content.fleet.map((asset) => (
              <div
                key={asset.id}
                className="group min-w-[320px] lg:min-w-[380px]"
              >
                <div className="relative overflow-hidden rounded-[32px] border border-white/10 bg-white/5">
                  <motion.img
                    whileHover={{ scale: 1.05 }}
                    transition={{ duration: 0.6 }}
                    src={asset.image}
                    alt={asset.name}
                    loading="lazy"
                    className="h-56 w-full object-cover"
                  />
                  <div className="space-y-4 px-6 py-6">
                    <Badge className="bg-white/10 text-xs uppercase tracking-[0.3em] text-white/80">
                      {asset.vesselType}
                    </Badge>
                    <div>
                      <h3 className="text-2xl font-semibold">{asset.name}</h3>
                      <p className="text-sm text-white/70">{asset.capacity} · {asset.range}</p>
                    </div>
                    <div className="space-y-2 text-sm text-white/80">
                      {asset.highlights.slice(0, 3).map((item) => (
                        <div key={item} className="flex gap-2">
                          <ArrowRight className="h-4 w-4 text-emerald-300" />
                          {item}
                        </div>
                      ))}
                    </div>
                    <div className="space-y-2 text-sm text-white/60">
                      <p className="uppercase tracking-[0.3em] text-xs text-white/40">Hospitality</p>
                      {asset.hospitality.slice(0, 2).map((item) => (
                        <div key={item} className="flex gap-2">
                          <CheckCircle className="h-4 w-4 text-emerald-300" />
                          {item}
                        </div>
                      ))}
                    </div>
                    <div className="rounded-2xl border border-white/15 bg-white/5 p-4 text-sm">
                      <p className="text-white">{asset.priceLabel}</p>
                      <p className="text-xs text-white/50">APA managed by Recharge</p>
                    </div>
                    <Button className="w-full bg-white text-slate-900 hover:bg-white/90">
                      Hold this asset
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* JOURNEY TIMELINE */}
      <section className="bg-white py-20">
        <div className="mx-auto max-w-6xl">
          <div className="mb-12 text-center">
            <p className="text-xs uppercase tracking-[0.4em] text-emerald-600">Signature arcs</p>
            <h2 className="mt-3 text-3xl font-semibold text-slate-900">Bespoke journeys on standby</h2>
          </div>
          <div className="relative before:absolute before:left-[12px] before:top-0 before:h-full before:w-px before:bg-emerald-200">
            {content.journeys.map((journey, index) => (
              <div key={journey.id} className="relative mb-10 pl-14">
                <div className="absolute left-0 top-2 h-6 w-6 rounded-full border-4 border-white bg-emerald-500 shadow-lg" />
                <div className="rounded-3xl border border-slate-100 bg-white/90 p-6 shadow-xl shadow-slate-900/5">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div>
                      <p className="text-xs uppercase tracking-[0.4em] text-emerald-500">Journey {index + 1}</p>
                      <h3 className="text-2xl font-semibold text-slate-900">{journey.title}</h3>
                    </div>
                    <div className="text-right text-sm text-slate-500">
                      <p>{journey.duration}</p>
                      <p>{journey.route}</p>
                    </div>
                  </div>
                  <p className="mt-4 text-sm text-slate-600">{journey.description}</p>
                  <div className="mt-4 flex flex-wrap gap-2">
                    {journey.services.map((service) => (
                      <span key={service} className="rounded-full border border-slate-200 px-4 py-1 text-xs uppercase tracking-[0.3em] text-slate-500">
                        {service}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {missions.length > 0 && (
        <section className="bg-[#010207] py-16 text-white">
          <div className="mx-auto max-w-5xl space-y-10 px-4">
            <div className="text-center">
              <p className="text-xs uppercase tracking-[0.4em] text-emerald-300">Dispatch log</p>
              <h2 className="mt-3 text-3xl font-semibold">Flight plan to champagne landing</h2>
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
        <section className="bg-white py-16">
          <div className="mx-auto max-w-6xl space-y-8 px-4">
            <div className="text-center">
              <p className="text-xs uppercase tracking-[0.4em] text-emerald-600">Crew detail</p>
              <h2 className="mt-3 text-3xl font-semibold text-slate-900">Concierge brains onboard</h2>
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
        <section className="bg-[#03040a] py-16 text-white">
          <div className="mx-auto max-w-6xl space-y-8 px-4">
            <div className="text-center">
              <p className="text-xs uppercase tracking-[0.4em] text-emerald-300">Lifestyle rituals</p>
              <h2 className="mt-3 text-3xl font-semibold">What unfolds once onboard</h2>
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
      <section className="bg-[#02040b] py-20 text-white">
        <div className="mx-auto grid max-w-6xl gap-10 lg:grid-cols-2">
          <div className="space-y-6 rounded-[32px] border border-white/10 bg-white/5 p-8">
            <p className="text-xs uppercase tracking-[0.4em] text-emerald-300">Dispatch rituals</p>
            <h3 className="text-3xl font-semibold">From manifest to champagne landing</h3>
            <ul className="space-y-4 text-sm text-white/80">
              <li className="flex gap-3">
                <Star className="mt-1 h-4 w-4 text-emerald-300" /> Dedicated concierge drafts ops sheet + dietary program within 15 minutes.
              </li>
              <li className="flex gap-3">
                <Star className="mt-1 h-4 w-4 text-emerald-300" /> Customs fast-track, armored ground transfers, and onboard butler brief handled in one call.
              </li>
              <li className="flex gap-3">
                <Star className="mt-1 h-4 w-4 text-emerald-300" /> Night-vision heli or yacht chase boat arranges welcome ritual + champagne sabrage.
              </li>
            </ul>
            <div className="rounded-3xl border border-white/15 bg-white/5 p-5 text-sm">
              <p className="text-xs uppercase tracking-[0.4em] text-white/40">Ops desk</p>
              <p className="text-lg font-semibold text-white">+94 77 772 1999 · charters@rechargetravels.com</p>
              <p className="text-xs text-white/50">Response &lt; 15 min · 24/7</p>
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
                <img src={image.image} alt={image.caption} loading="lazy" className="h-72 w-full object-cover" />
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
