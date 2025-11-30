import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { motion, AnimatePresence } from 'framer-motion';
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
  Globe,
  Mail,
  MessageCircle,
  Phone,
  Plane,
  Ship,
  Sparkles,
  Users,
  Waves
} from 'lucide-react';
import {
  privateChartersPageService,
  PrivateChartersPageContent
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

const PrivateCharters = () => {
  const [content, setContent] = useState<PrivateChartersPageContent>(
    privateChartersPageService.getDefaultContent()
  );
  const [loading, setLoading] = useState(true);
  const [heroIndex, setHeroIndex] = useState(0);
  const bookingRef = useRef<HTMLDivElement | null>(null);
  const [formData, setFormData] = useState({
    startDate: '',
    guests: 8,
    charterType: 'Superyacht',
    route: '',
    pickup: '',
    contactName: '',
    contactEmail: '',
    contactPhone: '',
    requests: ''
  });

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
    }, 5500);
    return () => clearInterval(timer);
  }, [content.hero.images.length]);

  const heroSlide = content.hero.images[heroIndex] ?? content.hero.images[0];

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
    alert('Thank you. Our private charter desk will confirm availability shortly.');
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50">
        <div className="text-center">
          <div className="mx-auto mb-4 h-12 w-12 animate-spin rounded-full border-b-2 border-teal-500" />
          <p className="text-slate-500">Preparing your manifest…</p>
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

      <section className="relative overflow-hidden bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 text-white">
        <AnimatePresence mode="wait">
          <motion.div
            key={heroSlide?.id}
            className="absolute inset-0"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1 }}
          >
            {heroSlide && (
              <img src={heroSlide.image} alt={heroSlide.caption} className="h-full w-full object-cover" />
            )}
            <div className="absolute inset-0 bg-gradient-to-b from-slate-950/90 via-slate-900/60 to-slate-950/90" />
          </motion.div>
        </AnimatePresence>

        <div className="relative mx-auto flex min-h-[520px] max-w-5xl flex-col items-center gap-6 px-4 py-24 text-center">
          <Badge className="bg-white/10 text-white backdrop-blur">{content.hero.badge}</Badge>
          <h1 className="text-4xl font-semibold leading-tight sm:text-5xl lg:text-6xl">{content.hero.title}</h1>
          <p className="max-w-3xl text-lg text-white/85">{content.hero.subtitle}</p>
          <div className="flex flex-wrap justify-center gap-4">
            <Button
              size="lg"
              className="bg-emerald-500 px-8 py-6 text-base shadow-lg shadow-emerald-600/30 hover:bg-emerald-400"
              onClick={scrollToBooking}
            >
              <Crown className="mr-2 h-5 w-5" />
              {content.hero.ctaText}
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-white/40 px-8 py-6 text-base text-white hover:bg-white/10"
              onClick={() => window.open(content.booking.whatsapp, '_blank')}
            >
              <MessageCircle className="mr-2 h-5 w-5" /> WhatsApp concierge
            </Button>
          </div>
          <div className="mt-6 flex flex-wrap justify-center gap-2">
            {content.hero.images.map((slide, idx) => (
              <button
                key={slide.id}
                type="button"
                className={`h-2 rounded-full transition-all ${
                  idx === heroIndex ? 'w-12 bg-white' : 'w-6 bg-white/40 hover:bg-white/80'
                }`}
                onClick={() => setHeroIndex(idx)}
                aria-label={`Show hero slide ${idx + 1}`}
              />
            ))}
          </div>
        </div>
      </section>

      <section className="bg-white py-16">
        <div className="mx-auto grid max-w-6xl gap-10 lg:grid-cols-[1.05fr_0.95fr]">
          <div>
            <p className="text-sm uppercase tracking-[0.4em] text-emerald-600">Concierge program</p>
            <h2 className="mt-3 text-3xl font-semibold text-slate-900">{content.hero.title}</h2>
            <p className="mt-4 text-lg text-slate-600">{content.overview.summary}</p>
            <div className="mt-8 grid gap-4 md:grid-cols-2">
              {content.overview.highlights.map((highlight) => (
                <Card key={highlight.id} className="border-slate-200/80 shadow-sm">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">{highlight.label}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-slate-600">{highlight.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            {content.stats.map((stat) => {
              const Icon = statIconMap[stat.iconName] || Sparkles;
              return (
                <div key={stat.id} className="rounded-3xl border border-slate-200 bg-slate-50 p-6 text-center">
                  <Icon className="mx-auto mb-3 h-8 w-8 text-emerald-500" />
                  <div className="text-3xl font-semibold text-slate-900">{stat.value}</div>
                  <p className="mt-1 text-sm text-slate-600">{stat.label}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="bg-slate-50 py-16">
        <div className="mx-auto max-w-6xl">
          <div className="mb-10 text-center">
            <p className="text-xs uppercase tracking-[0.4em] text-emerald-600">Fleet</p>
            <h2 className="text-3xl font-semibold text-slate-900">Flagship assets on call</h2>
          </div>
          <div className="grid gap-6 md:grid-cols-3">
            {content.fleet.map((asset) => (
              <Card key={asset.id} className="flex h-full flex-col border-none bg-white shadow-xl shadow-slate-900/5">
                <CardHeader>
                  <img src={asset.image} alt={asset.name} className="h-48 w-full rounded-3xl object-cover" />
                  <div className="mt-4 space-y-2">
                    <Badge className="w-fit bg-emerald-100 text-emerald-700">{asset.vesselType}</Badge>
                    <CardTitle className="text-2xl">{asset.name}</CardTitle>
                    <p className="text-sm text-slate-500">{asset.capacity}</p>
                    <p className="text-sm text-slate-500">{asset.range}</p>
                  </div>
                </CardHeader>
                <CardContent className="flex flex-1 flex-col gap-4">
                  <div>
                    <h4 className="text-sm font-semibold uppercase tracking-wide text-slate-500">Performance</h4>
                    <ul className="mt-2 space-y-1 text-sm text-slate-600">
                      {asset.highlights.map((item) => (
                        <li key={item} className="flex gap-2">
                          <ArrowRight className="h-4 w-4 text-emerald-500" />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold uppercase tracking-wide text-slate-500">Hospitality</h4>
                    <ul className="mt-2 space-y-1 text-sm text-slate-600">
                      {asset.hospitality.map((item) => (
                        <li key={item} className="flex gap-2">
                          <CheckCircle className="h-4 w-4 text-emerald-500" />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="mt-auto rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-600">
                    <p className="font-semibold text-slate-900">{asset.priceLabel}</p>
                    <p className="text-xs text-slate-500">Includes concierge provisioning + ground transfers</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-white py-16">
        <div className="mx-auto max-w-6xl">
          <div className="mb-10 flex flex-col gap-3 text-center">
            <p className="text-xs uppercase tracking-[0.4em] text-emerald-600">Signature journeys</p>
            <h2 className="text-3xl font-semibold text-slate-900">Design-first itineraries</h2>
          </div>
          <div className="grid gap-6 md:grid-cols-3">
            {content.journeys.map((journey) => (
              <Card key={journey.id} className="border-slate-200/80 bg-slate-50">
                <CardHeader>
                  <CardTitle className="text-xl">{journey.title}</CardTitle>
                  <p className="text-sm text-slate-500">{journey.duration}</p>
                  <p className="text-sm text-slate-500">{journey.route}</p>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-sm text-slate-600">{journey.description}</p>
                  <div className="rounded-2xl border border-slate-200 bg-white p-4 text-sm text-slate-600">
                    <p className="text-xs uppercase tracking-[0.3em] text-slate-500">Services</p>
                    <ul className="mt-2 space-y-1">
                      {journey.services.map((item) => (
                        <li key={item} className="flex gap-2">
                          <Sparkles className="h-4 w-4 text-emerald-500" />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-slate-900 py-16 text-white">
        <div className="mx-auto max-w-6xl">
          <div className="mb-10 text-center">
            <p className="text-xs uppercase tracking-[0.4em] text-emerald-200/90">Concierge tiers</p>
            <h2 className="mt-3 text-3xl font-semibold">Sea, sky, ground coverage</h2>
          </div>
          <div className="grid gap-6 md:grid-cols-3">
            {content.serviceTiers.map((tier) => (
              <div key={tier.id} className="rounded-3xl border border-emerald-200/30 bg-white/5 p-6 backdrop-blur">
                <Badge className="mb-3 bg-white/10 text-white">{tier.name}</Badge>
                <p className="text-sm text-slate-200">{tier.description}</p>
                <ul className="mt-4 space-y-2 text-sm text-slate-100">
                  {tier.deliverables.map((item) => (
                    <li key={item} className="flex gap-2">
                      <CheckCircle className="h-4 w-4 text-emerald-300" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section ref={bookingRef} className="bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 py-20 text-white">
        <div className="mx-auto grid max-w-6xl gap-10 lg:grid-cols-2">
          <div className="space-y-6">
            <p className="text-xs uppercase tracking-[0.4em] text-emerald-200/80">24/7 desk</p>
            <h2 className="text-3xl font-semibold">Plan your charter</h2>
            <p className="text-slate-300">{content.booking.conciergeNote}</p>
            <div className="space-y-3 rounded-3xl border border-white/10 bg-white/5 p-6 text-sm text-slate-100">
              <div className="flex items-center gap-3">
                <Phone className="h-4 w-4 text-emerald-300" /> {content.booking.contactPhone}
              </div>
              <div className="flex items-center gap-3">
                <MessageCircle className="h-4 w-4 text-emerald-300" /> {content.booking.whatsapp}
              </div>
              <div className="flex items-center gap-3">
                <Mail className="h-4 w-4 text-emerald-300" /> {content.booking.email}
              </div>
              <p className="text-xs uppercase tracking-[0.4em] text-slate-300">{content.booking.responseTime}</p>
              <p className="text-xs text-slate-300">{content.booking.depositNote}</p>
              <p className="text-xs text-slate-300">{content.booking.contractNote}</p>
            </div>
            <div className="rounded-3xl border border-white/15 bg-white/5 p-6 text-sm text-slate-100">
              <h4 className="text-base font-semibold text-white">Typical add-ons</h4>
              <ul className="mt-3 space-y-2">
                {content.pricing.addOns.map((item) => (
                  <li key={item} className="flex gap-2">
                    <Sparkles className="h-4 w-4 text-emerald-300" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
          <Card className="border-none bg-white text-slate-900 shadow-2xl shadow-slate-950/30">
            <CardHeader>
              <CardTitle className="text-2xl">Request availability</CardTitle>
              <p className="text-sm text-slate-500">We reply within 15 minutes with aircraft/yacht holds.</p>
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
                  Route or focus
                  <input
                    type="text"
                    value={formData.route}
                    onChange={(e) => handleInputChange('route', e.target.value)}
                    placeholder="Colombo → Maldives sunset weekender"
                    className="mt-2 w-full rounded-2xl border border-slate-200 px-3 py-3"
                  />
                </label>
                <label className="text-sm font-medium text-slate-700">
                  Pickup / landing notes
                  <input
                    type="text"
                    value={formData.pickup}
                    onChange={(e) => handleInputChange('pickup', e.target.value)}
                    placeholder="Cinnamon Grand helipad · Colombo International"
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
                  Preferences or onboard requests
                  <textarea
                    rows={3}
                    value={formData.requests}
                    onChange={(e) => handleInputChange('requests', e.target.value)}
                    className="mt-2 w-full rounded-2xl border border-slate-200 px-3 py-3"
                  />
                </label>
                <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-600">
                  <div className="flex items-center justify-between text-slate-900">
                    <span className="font-medium">Estimated from</span>
                    <span className="text-lg font-semibold">{content.pricing.currency} {estimatedTotal.toLocaleString()}</span>
                  </div>
                  <p className="mt-2 text-xs text-slate-500">
                    Superyacht min {content.pricing.currency} {content.pricing.yachtMinimum.toLocaleString()} · Private jet min {content.pricing.currency}{' '}
                    {content.pricing.jetMinimum.toLocaleString()}
                  </p>
                </div>
                <Button type="submit" className="w-full bg-emerald-500 py-3 text-base font-semibold text-white hover:bg-emerald-400">
                  Hold my charter
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </section>

      <section className="bg-white py-16">
        <div className="mx-auto max-w-6xl">
          <div className="mb-10 text-center">
            <p className="text-xs uppercase tracking-[0.4em] text-emerald-600">Gallery</p>
            <h2 className="text-3xl font-semibold text-slate-900">Moments from the fleet</h2>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {content.gallery.map((image) => (
              <motion.figure
                key={image.id}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4 }}
                className="overflow-hidden rounded-2xl"
              >
                <img src={image.image} alt={image.caption} className="h-56 w-full object-cover" />
                <figcaption className="bg-slate-900/80 px-4 py-3 text-sm text-white">{image.caption}</figcaption>
              </motion.figure>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-slate-50 py-16">
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
