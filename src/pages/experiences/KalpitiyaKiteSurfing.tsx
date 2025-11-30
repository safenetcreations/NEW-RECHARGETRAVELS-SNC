import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { AnimatePresence, motion } from 'framer-motion';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import {
  Activity,
  Camera,
  CheckCircle,
  Clock,
  Compass,
  Flag,
  Loader2,
  Mail,
  MapPin,
  MessageCircle,
  Phone,
  Shield,
  Sparkles,
  Sun,
  TrendingUp,
  Users,
  Wind
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import {
  kalpitiyaKitesurfingPageService,
  defaultKalpitiyaContent,
  KalpitiyaKitesurfingPageContent
} from '@/services/kalpitiyaKitesurfingPageService';
import { cachedFetch } from '@/lib/cache';

const iconMap: Record<string, React.ComponentType<any>> = {
  Activity,
  Camera,
  CheckCircle,
  Compass,
  Flag,
  MapPin,
  Shield,
  Sparkles,
  Sun,
  TrendingUp,
  Users,
  Wind
};

const KalpitiyaKiteSurfing = () => {
  const [content, setContent] = useState<KalpitiyaKitesurfingPageContent>(defaultKalpitiyaContent);
  const [loading, setLoading] = useState(true);
  const [heroIndex, setHeroIndex] = useState(0);
  const [selectedExperience, setSelectedExperience] = useState<string>(defaultKalpitiyaContent.experiences[0]?.name ?? '');
  const [formData, setFormData] = useState({
    date: '',
    session: defaultKalpitiyaContent.logistics.sessionTimes[0],
    riders: 2,
    observers: 0,
    pickup: 'Kalpitiya Lagoon | Guesthouse',
    contactName: '',
    contactEmail: '',
    contactPhone: '',
    requests: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const bookingSectionRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const load = async () => {
      try {
        const data = await cachedFetch<KalpitiyaKitesurfingPageContent>(
          'kalpitiya-kitesurfing-page',
          () => kalpitiyaKitesurfingPageService.getContent(),
          5 * 60 * 1000
        );
        setContent(data);
        setSelectedExperience(data.experiences[0]?.name ?? '');
        setFormData((prev) => ({
          ...prev,
          session: data.logistics.sessionTimes[0] ?? prev.session
        }));
      } catch (error) {
        console.error('Failed to load Kalpitiya kitesurfing content', error);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const heroSlides = useMemo(() => content.hero.gallery, [content.hero.gallery]);

  useEffect(() => {
    if (heroSlides.length === 0) return;
    const timer = setInterval(() => {
      setHeroIndex((prev) => (prev + 1) % heroSlides.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [heroSlides.length]);

  const handleInputChange = (field: string, value: string | number) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (isSubmitting) return;
    setIsSubmitting(true);
    setTimeout(() => {
      alert('Thanks! Our Kalpitiya concierge will reply with wind intel and session timing.');
      setIsSubmitting(false);
    }, 900);
  };

  const scrollToBooking = (experienceName?: string) => {
    if (experienceName) {
      setSelectedExperience(experienceName);
    }
    bookingSectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const riderRate = content.pricing.startingPrice;
  const observerRate = Math.round(riderRate * 0.4);
  const estimatedTotal = riderRate * formData.riders + observerRate * formData.observers;

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-950 text-white">
        <Loader2 className="h-12 w-12 animate-spin text-cyan-300" />
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
        <link rel="canonical" href="https://www.rechargetravels.com/experiences/kalpitiya-kitesurfing" />
      </Helmet>

      <Header />

      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 text-white">
        <AnimatePresence mode="wait">
          <motion.div
            key={heroSlides[heroIndex]?.image}
            className="absolute inset-0"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.1 }}
          >
            <img
              src={heroSlides[heroIndex]?.image}
              alt={heroSlides[heroIndex]?.caption}
              className="h-full w-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-slate-950/90 via-slate-900/70 to-slate-950/90" />
          </motion.div>
        </AnimatePresence>

        <div className="relative mx-auto flex min-h-[520px] max-w-6xl flex-col items-center gap-6 px-4 py-24 text-center">
          <Badge className="bg-white/10 text-white backdrop-blur">{content.hero.badge}</Badge>
          <h1 className="text-4xl font-semibold leading-tight sm:text-5xl lg:text-6xl">{content.hero.title}</h1>
          <p className="max-w-3xl text-lg text-white/80">{content.hero.subtitle}</p>
          <div className="flex flex-wrap items-center justify-center gap-3 text-xs uppercase tracking-[0.4em] text-cyan-200/80">
            {heroSlides.map((slide, idx) => (
              <button
                key={slide.image}
                type="button"
                onClick={() => setHeroIndex(idx)}
                className={`h-2 w-10 rounded-full transition ${idx === heroIndex ? 'bg-cyan-300' : 'bg-white/30 hover:bg-white/60'}`}
                aria-label={`Show hero slide ${idx + 1}`}
              />
            ))}
          </div>
          <div className="flex flex-wrap justify-center gap-3">
            {content.overview.badges.map((badge) => {
              const Icon = iconMap[badge.iconName] || Activity;
              return (
                <span
                  key={badge.label}
                  className="inline-flex items-center gap-2 rounded-full border border-white/15 px-4 py-2 text-sm text-white/90 backdrop-blur"
                >
                  <Icon className="h-4 w-4 text-cyan-200" />
                  {badge.label}: <strong className="font-semibold">{badge.value}</strong>
                </span>
              );
            })}
          </div>
          <div className="mt-6 flex flex-wrap justify-center gap-4">
            <Button
              size="lg"
              className="bg-cyan-500 px-8 py-6 text-base hover:bg-cyan-600"
              onClick={() => scrollToBooking()}
            >
              Ride the wind
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-white/40 px-8 py-6 text-base text-white hover:bg-white/10"
              onClick={() => window.open(content.booking.whatsapp, '_blank')}
            >
              <MessageCircle className="mr-2 h-4 w-4" /> WhatsApp concierge
            </Button>
          </div>
        </div>
      </section>

      {/* Overview */}
      <section className="bg-white py-16">
        <div className="mx-auto grid max-w-6xl gap-10 px-4 md:grid-cols-[1.2fr_0.8fr]">
          <div>
            <p className="text-xs uppercase tracking-[0.4em] text-slate-500">Why Kalpitiya</p>
            <h2 className="mt-3 text-3xl font-semibold text-slate-900">Trade-wind playground</h2>
            <p className="mt-4 text-lg text-slate-600">{content.overview.summary}</p>
          </div>
          <div className="space-y-4">
            {content.overview.highlights.map((highlight) => (
              <div key={highlight.label} className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <p className="text-xs uppercase tracking-[0.4em] text-slate-500">{highlight.label}</p>
                <p className="mt-2 text-sm text-slate-700">{highlight.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Experiences */}
      <section className="bg-slate-50 py-16">
        <div className="mx-auto max-w-6xl px-4">
          <div className="mb-8 flex flex-col gap-2">
            <p className="text-xs uppercase tracking-[0.4em] text-slate-500">Signature Sessions</p>
            <h3 className="text-3xl font-semibold text-slate-900">Choose your ride</h3>
          </div>
          <div className="grid gap-6 md:grid-cols-2">
            {content.experiences.map((experience) => (
              <motion.div key={experience.id} whileHover={{ y: -4 }} className="flex h-full flex-col overflow-hidden rounded-3xl border bg-white shadow-sm">
                {experience.image && (
                  <div className="relative h-56 w-full overflow-hidden">
                    <img src={experience.image} alt={experience.name} className="h-full w-full object-cover" />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900/70 via-slate-900/20 to-transparent" />
                    <div className="absolute bottom-4 left-4 flex gap-2 text-sm font-medium text-white">
                      <Badge className="bg-cyan-500/90 text-white">{experience.level}</Badge>
                      <span>{experience.duration}</span>
                    </div>
                  </div>
                )}
                <div className="flex flex-1 flex-col gap-4 p-6">
                  <div>
                    <h4 className="text-xl font-semibold text-slate-900">{experience.name}</h4>
                    <p className="mt-2 text-sm text-slate-600">{experience.summary}</p>
                  </div>
                  <ul className="space-y-2 text-sm text-slate-600">
                    {experience.includes.map((include) => (
                      <li key={include} className="flex items-center gap-2">
                        <CheckCircle className="h-3.5 w-3.5 text-emerald-500" />
                        <span>{include}</span>
                      </li>
                    ))}
                  </ul>
                  <div className="mt-auto flex items-center justify-between">
                    <span className="text-lg font-semibold text-cyan-700">{experience.priceLabel}</span>
                    <Button variant="outline" size="sm" onClick={() => scrollToBooking(experience.name)}>
                      Reserve
                    </Button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Combos */}
      <section className="bg-white py-16">
        <div className="mx-auto max-w-6xl px-4">
          <div className="mb-8 flex flex-col gap-2">
            <p className="text-xs uppercase tracking-[0.4em] text-slate-500">Concierge Bundles</p>
            <h3 className="text-3xl font-semibold text-slate-900">Ready-made combos</h3>
          </div>
          <div className="grid gap-6 lg:grid-cols-3">
            {content.combos.map((combo) => {
              const Icon = iconMap[combo.iconName] || Sparkles;
              return (
                <div key={combo.id} className="rounded-3xl border border-slate-100 bg-gradient-to-b from-white to-slate-50 p-6 shadow-sm">
                  <div className="mb-4 flex items-center justify-between">
                    <Icon className="h-10 w-10 text-cyan-600" />
                    <Badge className="bg-cyan-600/10 text-cyan-700">{combo.badge}</Badge>
                  </div>
                  <h4 className="text-xl font-semibold text-slate-900">{combo.name}</h4>
                  <p className="mt-2 text-sm font-medium text-cyan-700">{combo.priceLabel}</p>
                  <p className="text-sm text-slate-500">{combo.duration}</p>
                  <div className="mt-4 space-y-2 text-sm text-slate-600">
                    {combo.highlights.map((highlight) => (
                      <div key={highlight} className="flex items-start gap-2">
                        <Flag className="h-4 w-4 text-cyan-500" />
                        <span>{highlight}</span>
                      </div>
                    ))}
                  </div>
                  <div className="mt-4 space-y-1 text-sm text-slate-500">
                    {combo.includes.map((include) => (
                      <div key={include} className="flex items-center gap-2">
                        <CheckCircle className="h-3.5 w-3.5 text-emerald-500" />
                        <span>{include}</span>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Logistics + Safety */}
      <section className="bg-slate-950 py-16 text-white">
        <div className="mx-auto grid max-w-6xl gap-10 px-4 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="space-y-5">
            <p className="text-xs uppercase tracking-[0.4em] text-cyan-200/70">Logistics</p>
            <h3 className="text-3xl font-semibold">Everything dialled in</h3>
            <div className="space-y-4 text-sm text-white/80">
              <div>
                <p className="text-xs uppercase tracking-[0.3em] text-cyan-200/80">Meeting point</p>
                <p className="text-base">{content.logistics.meetingPoint}</p>
              </div>
              <div>
                <p className="text-xs uppercase tracking-[0.3em] text-cyan-200/80">Session windows</p>
                <ul className="mt-2 space-y-1">
                  {content.logistics.sessionTimes.map((slot) => (
                    <li key={slot} className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-cyan-300" />
                      {slot}
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <p className="text-xs uppercase tracking-[0.3em] text-cyan-200/80">Gear provided</p>
                <p>{content.logistics.gearProvided.join(', ')}</p>
              </div>
              <div>
                <p className="text-xs uppercase tracking-[0.3em] text-cyan-200/80">Bring along</p>
                <p>{content.logistics.bringList.join(', ')}</p>
              </div>
              <p>{content.logistics.transferNote}</p>
              <p className="text-cyan-100">{content.logistics.weatherPolicy}</p>
            </div>
          </div>
          <div className="space-y-4 rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur">
            <h4 className="text-xl font-semibold">Safety & Coverage</h4>
            <ul className="space-y-3 text-sm text-white/80">
              {content.safety.map((item) => (
                <li key={item} className="flex items-start gap-2">
                  <Shield className="mt-0.5 h-4 w-4 text-emerald-300" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* Gallery */}
      <section className="bg-white py-16">
        <div className="mx-auto max-w-6xl px-4">
          <h3 className="text-3xl font-semibold text-slate-900">Recent media + vibes</h3>
          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {content.gallery.map((item) => (
              <div key={item.id} className="group relative h-48 overflow-hidden rounded-2xl">
                <img src={item.image} alt={item.caption} className="h-full w-full object-cover transition duration-500 group-hover:scale-105" />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/70 via-transparent to-transparent opacity-0 transition group-hover:opacity-100" />
                <p className="absolute bottom-3 left-3 text-sm font-medium text-white drop-shadow">{item.caption}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Booking Section */}
      <section ref={bookingSectionRef} className="bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 py-20 text-white">
        <div className="mx-auto max-w-6xl px-4">
          <div className="grid gap-10 md:grid-cols-[1.05fr_0.95fr]">
            <div>
              <p className="text-xs uppercase tracking-[0.4em] text-cyan-200/70">Concierge Request</p>
              <h3 className="mt-2 text-3xl font-semibold">Lock in your sessions</h3>
              <p className="mt-3 text-slate-300">{content.booking.conciergeNote}</p>
              <div className="mt-8 space-y-4 rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur">
                <div className="flex items-center gap-3 text-sm text-slate-100">
                  <Phone className="h-4 w-4 text-cyan-300" />
                  <span>{content.booking.contactPhone}</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-slate-100">
                  <Mail className="h-4 w-4 text-cyan-300" />
                  <span>{content.booking.email}</span>
                </div>
                <div className="text-xs uppercase tracking-[0.3em] text-slate-300">{content.booking.responseTime}</div>
                <Button
                  size="sm"
                  className="mt-2 w-full justify-center bg-emerald-500/90 text-white hover:bg-emerald-500"
                  onClick={() => window.open(content.booking.whatsapp, '_blank')}
                >
                  <MessageCircle className="mr-2 h-4 w-4" /> WhatsApp concierge
                </Button>
              </div>
            </div>
            <form
              onSubmit={handleSubmit}
              className="space-y-5 rounded-3xl border border-white/15 bg-white/95 p-6 text-slate-900 shadow-2xl shadow-slate-950/30"
            >
              <div className="grid gap-4 md:grid-cols-2">
                <label className="text-sm font-medium text-slate-800">
                  Date
                  <input
                    type="date"
                    required
                    value={formData.date}
                    onChange={(e) => handleInputChange('date', e.target.value)}
                    className="mt-1 w-full rounded-2xl border border-slate-300 bg-white/90 px-3 py-3 text-slate-900 placeholder-slate-400 focus:border-cyan-500 focus:outline-none"
                  />
                </label>
                <label className="text-sm font-medium text-slate-800">
                  Session
                  <select
                    value={formData.session}
                    onChange={(e) => handleInputChange('session', e.target.value)}
                    className="mt-1 w-full rounded-2xl border border-slate-300 bg-white/90 px-3 py-3 text-slate-900 focus:border-cyan-500 focus:outline-none"
                  >
                    {content.logistics.sessionTimes.map((slot) => (
                      <option key={slot}>{slot}</option>
                    ))}
                  </select>
                </label>
              </div>
              <label className="text-sm font-medium text-slate-800">
                Experience
                <select
                  value={selectedExperience}
                  onChange={(e) => setSelectedExperience(e.target.value)}
                  className="mt-1 w-full rounded-2xl border border-slate-300 bg-white/90 px-3 py-3 text-slate-900 focus:border-cyan-500 focus:outline-none"
                >
                  {content.experiences.map((experience) => (
                    <option key={experience.id}>{experience.name}</option>
                  ))}
                </select>
              </label>
              <div className="grid gap-4 md:grid-cols-2">
                <label className="text-sm font-medium text-slate-800">
                  Riders
                  <input
                    type="number"
                    min={1}
                    value={formData.riders}
                    onChange={(e) => handleInputChange('riders', Number(e.target.value))}
                    className="mt-1 w-full rounded-2xl border border-slate-300 bg-white/90 px-3 py-3 text-slate-900 focus:border-cyan-500 focus:outline-none"
                  />
                </label>
                <label className="text-sm font-medium text-slate-800">
                  Observers
                  <input
                    type="number"
                    min={0}
                    value={formData.observers}
                    onChange={(e) => handleInputChange('observers', Number(e.target.value))}
                    className="mt-1 w-full rounded-2xl border border-slate-300 bg-white/90 px-3 py-3 text-slate-900 focus:border-cyan-500 focus:outline-none"
                  />
                </label>
              </div>
              <label className="text-sm font-medium text-slate-800">
                Hotel / pickup note
                <input
                  type="text"
                  value={formData.pickup}
                  onChange={(e) => handleInputChange('pickup', e.target.value)}
                  className="mt-1 w-full rounded-2xl border border-slate-300 bg-white/90 px-3 py-3 text-slate-900 placeholder-slate-400 focus:border-cyan-500 focus:outline-none"
                  placeholder="e.g. Kalpitiya Lagoon View Lodge"
                />
              </label>
              <div className="grid gap-4 md:grid-cols-2">
                <label className="text-sm font-medium text-slate-800">
                  Full name
                  <input
                    type="text"
                    required
                    value={formData.contactName}
                    onChange={(e) => handleInputChange('contactName', e.target.value)}
                    className="mt-1 w-full rounded-2xl border border-slate-300 bg-white/90 px-3 py-3 text-slate-900 focus:border-cyan-500 focus:outline-none"
                  />
                </label>
                <label className="text-sm font-medium text-slate-800">
                  Email
                  <input
                    type="email"
                    required
                    value={formData.contactEmail}
                    onChange={(e) => handleInputChange('contactEmail', e.target.value)}
                    className="mt-1 w-full rounded-2xl border border-slate-300 bg-white/90 px-3 py-3 text-slate-900 focus:border-cyan-500 focus:outline-none"
                  />
                </label>
              </div>
              <label className="text-sm font-medium text-slate-800">
                Phone / WhatsApp
                <input
                  type="tel"
                  required
                  value={formData.contactPhone}
                  onChange={(e) => handleInputChange('contactPhone', e.target.value)}
                  className="mt-1 w-full rounded-2xl border border-slate-300 bg-white/90 px-3 py-3 text-slate-900 focus:border-cyan-500 focus:outline-none"
                />
              </label>
              <label className="text-sm font-medium text-slate-800">
                Requests or add-ons
                <textarea
                  value={formData.requests}
                  onChange={(e) => handleInputChange('requests', e.target.value)}
                  rows={3}
                  className="mt-1 w-full rounded-2xl border border-slate-300 bg-white/90 px-3 py-3 text-slate-900 placeholder-slate-400 focus:border-cyan-500 focus:outline-none"
                  placeholder="Downwinders, foil lessons, photo teams, seaplane arrivals..."
                />
              </label>
              <div className="rounded-3xl border border-slate-200/60 bg-slate-50/80 p-4 text-sm text-slate-600">
                <div className="flex items-center justify-between text-slate-800">
                  <span className="font-medium">Estimated from</span>
                  <span className="text-lg font-semibold">
                    {content.pricing.currency} {estimatedTotal.toLocaleString()}
                  </span>
                </div>
                <p className="mt-2 text-xs text-slate-500">
                  Riders at {content.pricing.currency} {riderRate.toLocaleString()} • Observers at {content.pricing.currency}{' '}
                  {observerRate.toLocaleString()}
                </p>
                <p className="mt-3 text-xs text-slate-500">{content.pricing.depositNote}</p>
                <p className="text-xs text-slate-500">{content.pricing.refundPolicy}</p>
              </div>
              <Button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-gradient-to-r from-cyan-500 to-cyan-600 py-3 text-base font-semibold text-white hover:from-cyan-600 hover:to-cyan-700"
              >
                {isSubmitting ? 'Sending request…' : 'Request availability'}
              </Button>
            </form>
          </div>
        </div>
      </section>

      {/* FAQs */}
      <section className="bg-white py-16">
        <div className="mx-auto max-w-4xl px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Frequently Asked Questions</h2>
          <Accordion type="single" collapsible className="space-y-4">
            {content.faqs.map((faq, index) => (
              <AccordionItem
                key={faq.id}
                value={`faq-${index}`}
                className="rounded-2xl border border-slate-200 bg-slate-50 px-4"
              >
                <AccordionTrigger className="text-left text-base font-semibold text-slate-900 hover:text-cyan-600">
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

      {/* Contact CTA */}
      <section className="bg-slate-950 px-4 py-12 text-white">
        <div className="mx-auto grid max-w-6xl gap-6 md:grid-cols-3">
          <a
            href={content.booking.whatsapp}
            target="_blank"
            rel="noopener noreferrer"
            className="flex flex-col items-center rounded-3xl border border-white/10 bg-white/5 p-6 text-center transition hover:border-emerald-300/60 hover:bg-white/10"
          >
            <MessageCircle className="h-9 w-9 text-emerald-400" />
            <p className="mt-4 text-sm uppercase tracking-[0.3em] text-emerald-200/80">WhatsApp</p>
            <p className="mt-2 text-lg font-semibold">{content.booking.contactPhone}</p>
            <p className="text-sm text-slate-300">Tap to open concierge chat</p>
          </a>
          <div className="flex flex-col items-center rounded-3xl border border-white/10 bg-white/5 p-6 text-center">
            <Mail className="h-9 w-9 text-cyan-300" />
            <p className="mt-4 text-sm uppercase tracking-[0.3em] text-cyan-200/80">Email</p>
            <p className="mt-2 text-lg font-semibold">{content.booking.email}</p>
            <p className="text-sm text-slate-300">{content.booking.responseTime}</p>
          </div>
          <div className="flex flex-col items-center rounded-3xl border border-white/10 bg-white/5 p-6 text-center">
            <Phone className="h-9 w-9 text-orange-300" />
            <p className="mt-4 text-sm uppercase tracking-[0.3em] text-orange-200/80">Hotline</p>
            <p className="mt-2 text-lg font-semibold">{content.booking.contactPhone}</p>
            <p className="text-sm text-slate-300">Global support 6 AM – 10 PM (GMT+5:30)</p>
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
};

export default KalpitiyaKiteSurfing;
