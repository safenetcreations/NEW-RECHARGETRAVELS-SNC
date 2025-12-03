import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { AnimatePresence, motion } from 'framer-motion';
import {
  Activity,
  Anchor,
  Camera,
  CheckCircle,
  ChevronRight,
  Clock,
  Globe,
  Loader2,
  Mail,
  MapPin,
  MessageCircle,
  Phone,
  Shield,
  Sparkles,
  Star,
  Sunrise,
  TreePine,
  Waves,
  Users,
  Binoculars
} from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import lagoonSafariPageService, { LagoonSafariPageContent } from '@/services/lagoonSafariPageService';
import { cachedFetch } from '@/lib/cache';

const iconMap: Record<string, React.ComponentType<any>> = {
  Waves,
  Activity,
  Sparkles,
  Shield,
  Camera,
  Clock,
  MapPin,
  Star,
  Sunrise,
  Anchor,
  Users,
  Globe,
  TreePine,
  Binoculars
};

const defaultLagoonContent = lagoonSafariPageService.getDefaultContent();

const LagoonSafari = () => {
  const [content, setContent] = useState<LagoonSafariPageContent>(defaultLagoonContent);
  const [isLoading, setIsLoading] = useState(true);
  const heroSlides = useMemo(
    () => (content.hero.gallery?.length ? content.hero.gallery : defaultLagoonContent.hero.gallery),
    [content.hero.gallery]
  );
  const [slideIndex, setSlideIndex] = useState(0);
  const [selectedExperience, setSelectedExperience] = useState(content.experiences[0]?.name ?? '');
  const [formData, setFormData] = useState({
    date: '',
    session: content.logistics.sessionTimes[0] ?? '',
    adults: 2,
    teens: 0,
    pickup: 'Bentota / Dedduwa hotel',
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
        const data = await cachedFetch<LagoonSafariPageContent>(
          'lagoon-safari-concierge',
          () => lagoonSafariPageService.getPageContent(),
          10 * 60 * 1000
        );
        setContent(data);
        setSelectedExperience(data.experiences[0]?.name ?? '');
        setFormData((prev) => ({
          ...prev,
          session: data.logistics.sessionTimes[0] ?? prev.session
        }));
      } catch (error) {
        console.error('Failed to load lagoon safari content', error);
        setContent(defaultLagoonContent);
      } finally {
        setIsLoading(false);
      }
    };
    load();
  }, []);

  useEffect(() => {
    const ticker = setInterval(() => {
      if (heroSlides.length === 0) return;
      setSlideIndex((prev) => (prev + 1) % heroSlides.length);
    }, 6000);
    return () => clearInterval(ticker);
  }, [heroSlides.length]);

  const handleInputChange = (field: string, value: string | number) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (isSubmitting) return;
    setIsSubmitting(true);
    setTimeout(() => {
      alert('Thanks! A lagoon concierge will confirm your circuit shortly.');
      setIsSubmitting(false);
    }, 900);
  };

  const scrollToBooking = (experienceName?: string) => {
    if (experienceName) {
      setSelectedExperience(experienceName);
    }
    bookingSectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const basePrice = content.pricing.startingPrice || 0;
  const teenPrice = Math.round(basePrice * 0.6);
  const estimatedTotal = basePrice * formData.adults + teenPrice * formData.teens;

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50">
        <Loader2 className="h-12 w-12 animate-spin text-cyan-600" />
      </div>
    );
  }

  const getIcon = (iconName: string) => iconMap[iconName] || Activity;

  return (
    <>
      <Helmet>
        <title>{content.seo.title}</title>
        <meta name="description" content={content.seo.description} />
        <meta name="keywords" content={content.seo.keywords.join(', ')} />
        <meta property="og:title" content={content.seo.title} />
        <meta property="og:description" content={content.seo.description} />
        <meta property="og:image" content={content.seo.ogImage} />
        <link rel="canonical" href="https://www.rechargetravels.com/experiences/lagoon-safari" />
      </Helmet>

      <Header />

      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 text-white">
        <AnimatePresence mode="wait">
          <motion.div
            key={heroSlides[slideIndex]?.image}
            className="absolute inset-0"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.1 }}
          >
            <img
              src={heroSlides[slideIndex]?.image}
              alt={heroSlides[slideIndex]?.caption}
              className="h-full w-full object-cover object-center"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-slate-950/90 via-slate-950/70 to-slate-950/90" />
          </motion.div>
        </AnimatePresence>

        <div className="relative mx-auto flex min-h-[520px] max-w-6xl flex-col items-center gap-6 px-4 py-24 text-center">
          <Badge className="bg-white/10 text-white backdrop-blur">{content.hero.badge}</Badge>
          <h1 className="text-4xl font-semibold leading-tight sm:text-5xl lg:text-6xl">{content.hero.title}</h1>
          <p className="max-w-3xl text-lg text-white/80">{content.hero.subtitle}</p>
          {heroSlides[slideIndex]?.tag && (
            <div className="flex flex-wrap items-center justify-center gap-3 text-xs uppercase tracking-[0.4em] text-cyan-200/80">
              <span>{heroSlides[slideIndex]?.tag}</span>
            </div>
          )}
          <div className="mt-4 flex flex-wrap items-center justify-center gap-3">
            {content.overview.badges.map((badge) => {
              const Icon = getIcon(badge.iconName);
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
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <Button size="lg" className="bg-cyan-500 px-8 py-6 text-base hover:bg-cyan-600" onClick={() => scrollToBooking()}>
              Reserve slot
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-white/40 bg-white/10 px-8 py-6 text-base text-white hover:bg-white/20"
              onClick={() => scrollToBooking()}
            >
              Talk to concierge
            </Button>
          </div>
        </div>
      </section>

      {/* Overview */}
      <section className="bg-white py-16">
        <div className="mx-auto grid max-w-6xl gap-10 px-4 md:grid-cols-[1.2fr_0.8fr]">
          <div>
            <h2 className="text-3xl font-semibold text-slate-900">Why book Bentota lagoon with Recharge</h2>
            <p className="mt-4 text-lg text-slate-600">{content.overview.summary}</p>
          </div>
          <div className="grid gap-4">
            {content.overview.highlights.map((highlight) => (
              <div key={highlight.label} className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <p className="text-xs uppercase tracking-[0.3em] text-slate-500">{highlight.label}</p>
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
            <p className="text-xs uppercase tracking-[0.4em] text-slate-500">Signature Circuits</p>
            <h3 className="text-3xl font-semibold text-slate-900">Pick your lead experience</h3>
          </div>
          <div className="grid gap-6 md:grid-cols-2">
            {content.experiences.map((experience) => (
              <motion.button
                key={experience.id}
                whileHover={{ y: -4 }}
                onClick={() => setSelectedExperience(experience.name)}
                className={`flex h-full flex-col overflow-hidden rounded-3xl border bg-white text-left shadow-sm transition ${
                  selectedExperience === experience.name ? 'border-cyan-400 shadow-lg' : 'border-slate-100'
                }`}
                type="button"
              >
                {experience.image && (
                  <div className="relative h-56 w-full overflow-hidden">
                    <img src={experience.image} alt={experience.name} className="h-full w-full object-cover" />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900/70 via-slate-900/20 to-transparent" />
                    <div className="absolute bottom-4 left-4 flex items-center gap-2 text-sm font-medium text-white">
                      <Badge className="bg-cyan-500/90 text-white">{experience.level}</Badge>
                      <span>{experience.duration}</span>
                    </div>
                  </div>
                )}
                <div className="flex flex-1 flex-col gap-4 p-6">
                  <div>
                    <h4 className="text-xl font-semibold">{experience.name}</h4>
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
                    <Button size="sm" variant="outline" onClick={() => scrollToBooking(experience.name)}>
                      Reserve
                    </Button>
                  </div>
                </div>
              </motion.button>
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
              const Icon = getIcon(combo.iconName);
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
                        <ChevronRight className="h-4 w-4 text-cyan-500" />
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
                  <Button className="mt-6 w-full bg-cyan-600 hover:bg-cyan-700" onClick={() => scrollToBooking(combo.name)}>
                    Reserve combo
                  </Button>
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
            <p className="text-xs uppercase tracking-[0.4em] text-cyan-200/70">Lagoon Logistics</p>
            <h3 className="text-3xl font-semibold">Everything dialed in</h3>
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
                <p className="text-xs uppercase tracking-[0.3em] text-cyan-200/80">Launch points</p>
                <div className="mt-2 flex flex-wrap gap-2">
                  {content.logistics.launchPoints.map((point) => (
                    <span key={point} className="rounded-full border border-white/20 px-3 py-1 text-xs text-white/90">
                      {point}
                    </span>
                  ))}
                </div>
              </div>
              <div>
                <p className="text-xs uppercase tracking-[0.3em] text-cyan-200/80">Transfers & service</p>
                <p>{content.logistics.transferOptions}</p>
              </div>
              <div>
                <p className="text-xs uppercase tracking-[0.3em] text-cyan-200/80">Gear onboard</p>
                <p>{content.logistics.gearProvided.join(', ')}</p>
              </div>
              <div>
                <p className="text-xs uppercase tracking-[0.3em] text-cyan-200/80">Bring along</p>
                <p>{content.logistics.bringList.join(', ')}</p>
              </div>
              <p>{content.logistics.weatherPolicy}</p>
              <p className="text-cyan-100">{content.logistics.sustainabilityNote}</p>
            </div>
          </div>
          <div className="space-y-4 rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur">
            <h4 className="text-xl font-semibold">Safety & Stewardship</h4>
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

      {/* FAQs & Gallery */}
      <section className="bg-white py-16">
        <div className="mx-auto grid max-w-6xl gap-10 px-4 lg:grid-cols-[1fr_1.1fr]">
          <div>
            <h3 className="text-3xl font-semibold text-slate-900">Lagoon FAQs</h3>
            <Accordion type="single" collapsible className="mt-6">
              {content.faqs.map((faq) => (
                <AccordionItem key={faq.id} value={faq.id} className="border-b border-slate-200">
                  <AccordionTrigger className="text-left text-sm font-semibold text-slate-800">{faq.question}</AccordionTrigger>
                  <AccordionContent className="text-sm text-slate-600">{faq.answer}</AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
          <div>
            <h3 className="text-3xl font-semibold text-slate-900">Recent media + vibes</h3>
            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              {content.gallery.map((item) => (
                <div key={item.id} className="group relative h-48 overflow-hidden rounded-2xl">
                  <img src={item.image} alt={item.caption} className="h-full w-full object-cover transition duration-500 group-hover:scale-105" />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900/70 via-transparent to-transparent opacity-0 transition group-hover:opacity-100" />
                  <p className="absolute bottom-3 left-3 text-sm font-medium text-white drop-shadow">{item.caption}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Booking form */}
      <section ref={bookingSectionRef} className="bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 py-20 text-white">
        <div className="mx-auto max-w-6xl px-4">
          <div className="grid gap-10 md:grid-cols-[1.05fr_0.95fr]">
            <div>
              <p className="text-xs uppercase tracking-[0.4em] text-cyan-200/70">Concierge Request</p>
              <h3 className="mt-2 text-3xl font-semibold">Lock in your circuit</h3>
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
                <div className="text-xs uppercase tracking-[0.3em] text-slate-300">{content.booking.deskHours}</div>
                <Button
                  size="sm"
                  className="mt-2 w-full justify-center bg-emerald-500/90 text-white hover:bg-emerald-500"
                  onClick={() => window.open(content.booking.whatsapp || 'https://wa.me/94777721999', '_blank')}
                >
                  <MessageCircle className="mr-2 h-4 w-4" />
                  WhatsApp concierge
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
                Primary circuit
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
                  Adults
                  <input
                    type="number"
                    min={1}
                    value={formData.adults}
                    onChange={(e) => handleInputChange('adults', Number(e.target.value))}
                    className="mt-1 w-full rounded-2xl border border-slate-300 bg-white/90 px-3 py-3 text-slate-900 focus:border-cyan-500 focus:outline-none"
                  />
                </label>
                <label className="text-sm font-medium text-slate-800">
                  Teens (8-15)
                  <input
                    type="number"
                    min={0}
                    value={formData.teens}
                    onChange={(e) => handleInputChange('teens', Number(e.target.value))}
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
                  className="mt-1 w-full rounded-2xl border border-slate-300 bg-white/90 px-3 py-3 text-slate-900 focus:border-cyan-500 focus:outline-none"
                />
              </label>
              <div className="grid gap-4 md:grid-cols-2">
                <label className="text-sm font-medium text-slate-800">
                  Your name
                  <input
                    type="text"
                    value={formData.contactName}
                    onChange={(e) => handleInputChange('contactName', e.target.value)}
                    className="mt-1 w-full rounded-2xl border border-slate-300 bg-white/90 px-3 py-3 text-slate-900 focus:border-cyan-500 focus:outline-none"
                    required
                  />
                </label>
                <label className="text-sm font-medium text-slate-800">
                  Email
                  <input
                    type="email"
                    value={formData.contactEmail}
                    onChange={(e) => handleInputChange('contactEmail', e.target.value)}
                    className="mt-1 w-full rounded-2xl border border-slate-300 bg-white/90 px-3 py-3 text-slate-900 focus:border-cyan-500 focus:outline-none"
                    required
                  />
                </label>
              </div>
              <label className="text-sm font-medium text-slate-800">
                Phone / WhatsApp
                <input
                  type="tel"
                  value={formData.contactPhone}
                  onChange={(e) => handleInputChange('contactPhone', e.target.value)}
                  className="mt-1 w-full rounded-2xl border border-slate-300 bg-white/90 px-3 py-3 text-slate-900 focus:border-cyan-500 focus:outline-none"
                  required
                />
              </label>
              <label className="text-sm font-medium text-slate-800">
                Requests or add-ons
                <textarea
                  value={formData.requests}
                  onChange={(e) => handleInputChange('requests', e.target.value)}
                  rows={3}
                  className="mt-1 w-full rounded-2xl border border-slate-300 bg-white/90 px-3 py-3 text-slate-900 placeholder-slate-400 focus:border-cyan-500 focus:outline-none"
                  placeholder="Fish spa stop, cinnamon island lunch, photographer..."
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
                  Adults at {content.pricing.currency} {basePrice.toLocaleString()} • Teens at {content.pricing.currency}{' '}
                  {teenPrice.toLocaleString()}
                </p>
                <p className="mt-3 text-xs text-slate-500">{content.pricing.depositNote}</p>
                <p className="text-xs text-slate-500">{content.pricing.refundPolicy}</p>
                <p className="text-xs text-slate-500">{content.pricing.privateUpgrade}</p>
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

      {/* Concierge contact */}
      <section className="bg-slate-950 px-4 py-12 text-white">
        <div className="mx-auto grid max-w-6xl gap-6 md:grid-cols-3">
          <a
            href={content.booking.whatsapp || 'https://wa.me/94777721999'}
            target="_blank"
            rel="noopener noreferrer"
            className="flex flex-col items-center rounded-3xl border border-white/10 bg-white/5 p-6 text-center transition hover:border-emerald-300/60 hover:bg-white/10"
          >
            <svg className="h-9 w-9 text-emerald-400" viewBox="0 0 24 24" fill="currentColor">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347" />
              <path d="M11.999 2c-5.511 0-10 4.489-10 10 0 1.77.465 3.494 1.347 5.009L2 22l5.154-1.349A10 10 0 1 0 12 2Zm0 18c-1.64 0-3.228-.438-4.626-1.267l-.33-.195-3.053.8.82-2.991-.199-.316A7.98 7.98 0 0 1 4 12c0-4.411 3.589-8 8-8s8 3.589 8 8-3.589 8-8 8Z" />
            </svg>
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

export default LagoonSafari;
