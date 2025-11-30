import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { AnimatePresence, motion } from 'framer-motion';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger
} from '@/components/ui/accordion';
import {
  Camera,
  CheckCircle,
  ChevronRight,
  Clock,
  Compass,
  Flame,
  MessageCircle,
  Navigation,
  Phone,
  Shield,
  Star,
  Sun,
  Sunrise,
  Users,
  Wind
} from 'lucide-react';
import hotAirBalloonSigiriyaPageService, {
  HotAirBalloonSigiriyaPageContent
} from '@/services/hotAirBalloonSigiriyaPageService';
import { cachedFetch } from '@/lib/cache';

const getOptimizedImageUrl = (url: string, width = 1920) => {
  if (!url) return '';
  if (url.includes('unsplash.com')) {
    const clean = url.split('?')[0];
    return `${clean}?w=${width}&q=80&auto=format&fit=crop`;
  }
  return url;
};

const iconMap: Record<string, React.ComponentType<any>> = {
  Navigation,
  Clock,
  Shield,
  Users,
  Sun,
  Sunrise,
  Camera,
  Wind,
  Compass,
  Star,
  Flame
};

const HotAirBalloonSigiriya = () => {
  const [content, setContent] = useState<HotAirBalloonSigiriyaPageContent>(
    hotAirBalloonSigiriyaPageService.getDefaultContent()
  );
  const [loading, setLoading] = useState(true);
  const [heroIndex, setHeroIndex] = useState(0);
  const [selectedPackageId, setSelectedPackageId] = useState<string | null>(null);
  const bookingRef = useRef<HTMLDivElement | null>(null);
  const [formData, setFormData] = useState({
    date: '',
    adults: 2,
    teens: 0,
    package: '',
    pickup: '',
    contactName: '',
    contactEmail: '',
    contactPhone: '',
    requests: ''
  });

  useEffect(() => {
    const load = async () => {
      try {
        const data = await cachedFetch<HotAirBalloonSigiriyaPageContent>(
          'hot-air-balloon-sigiriya-page',
          () => hotAirBalloonSigiriyaPageService.getPageContent(),
          10 * 60 * 1000
        );
        setContent(data);
        if (data.packages.length > 0) {
          setSelectedPackageId(data.packages[0].id);
          setFormData((prev) => ({
            ...prev,
            package: data.packages[0].name,
            pickup: data.logistics.meetingPoint
          }));
        }
      } catch (error) {
        console.error('Error loading hot air balloon content', error);
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

  const heroSlides = content.hero.images.length ? content.hero.images : hotAirBalloonSigiriyaPageService.getDefaultContent().hero.images;
  const currentSlide = heroSlides[heroIndex % heroSlides.length];

  const selectedPackage = useMemo(
    () => content.packages.find((pkg) => pkg.id === selectedPackageId) ?? content.packages[0],
    [content.packages, selectedPackageId]
  );

  const teenPrice = Math.round(content.pricing.startingPrice * 0.6);
  const estimatedTotal =
    content.pricing.startingPrice * formData.adults + teenPrice * formData.teens;

  const handleInputChange = (field: keyof typeof formData, value: string | number) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value
    }));
  };

  const scrollToBooking = (pkg?: { id: string; name: string }) => {
    if (pkg) {
      setSelectedPackageId(pkg.id);
      handleInputChange('package', pkg.name);
    }
    bookingRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    alert('Thanks! Our dawn concierge will hold your seats and reply within 15 minutes.');
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-purple-50">
        <div className="text-center">
          <div className="mx-auto mb-4 h-10 w-10 animate-spin rounded-full border-b-2 border-purple-500" />
          <p className="text-slate-500">Loading ballooning experience…</p>
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
        <link rel="canonical" href="https://www.rechargetravels.com/experiences/hot-air-balloon-sigiriya" />
      </Helmet>

      <Header />

      <section className="relative overflow-hidden bg-gradient-to-b from-slate-950 via-purple-950/80 to-indigo-950 text-white">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentSlide.id}
            className="absolute inset-0"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1 }}
          >
            <img
              src={getOptimizedImageUrl(currentSlide.image)}
              alt={currentSlide.caption}
              className="h-full w-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-slate-950/90 via-slate-950/70 to-slate-950/90" />
          </motion.div>
        </AnimatePresence>

        <div className="relative mx-auto flex min-h-[520px] max-w-6xl flex-col items-center gap-6 px-4 py-24 text-center">
          <Badge className="bg-white/10 text-white backdrop-blur">{content.hero.badge}</Badge>
          <h1 className="text-4xl font-semibold leading-tight sm:text-5xl lg:text-6xl">{content.hero.title}</h1>
          <p className="max-w-3xl text-lg text-white/85">{content.hero.subtitle}</p>
          <div className="flex flex-wrap items-center justify-center gap-3 text-xs uppercase tracking-[0.35em] text-white/70">
            {content.stats.map((stat) => (
              <span key={stat.id} className="inline-flex items-center gap-1 text-white/80">
                <strong className="text-white">{stat.value}</strong>
                <span>{stat.label}</span>
              </span>
            ))}
          </div>
          <div className="mt-6 flex flex-wrap justify-center gap-4">
            <Button size="lg" className="bg-purple-500 px-8 py-6 text-base hover:bg-purple-400" onClick={() => scrollToBooking(selectedPackage)}>
              Hold launch slot
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-white/50 bg-white/10 px-8 py-6 text-base text-white hover:bg-white/20"
              onClick={() => window.open(content.booking.whatsapp, '_blank')}
            >
              <MessageCircle className="mr-2 h-4 w-4" /> WhatsApp concierge
            </Button>
          </div>
          <div className="mt-8 flex gap-2">
            {heroSlides.map((slide, idx) => (
              <button
                key={slide.id}
                onClick={() => setHeroIndex(idx)}
                className={`h-2 rounded-full transition-all ${idx === heroIndex ? 'w-12 bg-white' : 'w-6 bg-white/40'}`}
                aria-label={`Show hero slide ${idx + 1}`}
              />
            ))}
          </div>
        </div>
      </section>

      <section className="bg-white py-16">
        <div className="mx-auto max-w-6xl px-4">
          <div className="grid gap-10 md:grid-cols-[1.1fr_0.9fr]">
            <div>
              <p className="text-xs uppercase tracking-[0.4em] text-purple-500">Why fly with us</p>
              <p className="mt-3 text-lg text-slate-600">{content.overview.summary}</p>
            </div>
            <div className="grid gap-4">
              {content.overview.highlights.map((highlight) => (
                <div key={highlight.id} className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                  <p className="text-xs uppercase tracking-[0.35em] text-purple-500">{highlight.label}</p>
                  <p className="mt-2 text-sm text-slate-700">{highlight.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="bg-slate-50 py-16">
        <div className="mx-auto max-w-6xl px-4">
          <div className="mb-8 flex flex-col gap-2">
            <p className="text-xs uppercase tracking-[0.4em] text-purple-500">Flight styles</p>
            <h2 className="text-3xl font-semibold text-slate-900">Pick your launch experience</h2>
          </div>
          <div className="grid gap-6 md:grid-cols-2">
            {content.packages.map((pkg) => (
              <motion.div
                key={pkg.id}
                whileHover={{ y: -4 }}
                className={`flex h-full flex-col overflow-hidden rounded-3xl border text-left shadow-sm transition ${
                  selectedPackageId === pkg.id ? 'border-purple-400 bg-white shadow-xl' : 'border-slate-200 bg-white hover:border-purple-200'
                }`}
              >
                <div className="relative h-56 w-full overflow-hidden">
                  <img src={pkg.image} alt={pkg.name} className="h-full w-full object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-transparent to-transparent" />
                  <div className="absolute bottom-4 left-4 text-sm text-white">
                    <Badge className="bg-purple-500/90 text-white">{pkg.duration}</Badge>
                  </div>
                </div>
                <div className="flex flex-1 flex-col gap-4 p-6">
                  <div>
                    <p className="text-xs uppercase tracking-[0.35em] text-purple-500">{pkg.bestFor}</p>
                    <h3 className="mt-2 text-2xl font-semibold text-slate-900">{pkg.name}</h3>
                    <p className="text-lg font-semibold text-purple-600">{pkg.priceLabel}</p>
                  </div>
                  <ul className="space-y-2 text-sm text-slate-600">
                    {pkg.highlights.map((item) => (
                      <li key={item} className="flex items-start gap-2">
                        <CheckCircle className="mt-0.5 h-4 w-4 text-emerald-500" />
                        {item}
                      </li>
                    ))}
                  </ul>
                  <div className="rounded-2xl border border-slate-200 bg-slate-50/70 p-4 text-sm text-slate-600">
                    <p className="font-medium text-slate-900">Includes</p>
                    <p className="mt-1 text-slate-600">{pkg.included.join(' • ')}</p>
                  </div>
                  <div className="mt-auto flex flex-wrap gap-3">
                    <Button className="flex-1 bg-purple-500 hover:bg-purple-400" onClick={() => scrollToBooking(pkg)}>
                      Book this flight
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      className="flex-1 border-purple-200 text-purple-700 hover:bg-purple-50"
                      onClick={() => {
                        setSelectedPackageId(pkg.id);
                        handleInputChange('package', pkg.name);
                      }}
                    >
                      Select package
                    </Button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-white py-16">
        <div className="mx-auto max-w-6xl px-4">
          <div className="mb-8 flex flex-col gap-2">
            <p className="text-xs uppercase tracking-[0.4em] text-purple-500">Flight journey</p>
            <h2 className="text-3xl font-semibold text-slate-900">From launch prep to champagne landing</h2>
          </div>
          <div className="space-y-6">
            {content.journey.map((stage, index) => (
              <motion.div
                key={stage.id}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.05 }}
                className="flex items-start gap-4 rounded-3xl border border-slate-200 bg-slate-50 p-5"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-purple-100 text-purple-600 font-semibold">
                  {index + 1}
                </div>
                <div>
                  <p className="text-xs uppercase tracking-[0.35em] text-purple-500">{stage.duration}</p>
                  <h3 className="text-xl font-semibold text-slate-900">{stage.title}</h3>
                  <p className="text-sm text-slate-600">{stage.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-slate-950 py-16 text-white">
        <div className="mx-auto grid max-w-6xl gap-10 px-4 lg:grid-cols-[1.05fr_0.95fr]">
          <div>
            <p className="text-xs uppercase tracking-[0.4em] text-purple-200">Operator & crew</p>
            <h2 className="mt-3 text-3xl font-semibold">{content.operator.name}</h2>
            <p className="mt-3 text-sm text-slate-200">{content.operator.description}</p>
            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                <p className="text-xs uppercase tracking-[0.3em] text-purple-200">Licenses</p>
                <p className="mt-2 text-sm text-white/90">{content.operator.licenses.join(' • ')}</p>
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                <p className="text-xs uppercase tracking-[0.3em] text-purple-200">Assurances</p>
                <p className="mt-2 text-sm text-white/90">{content.operator.assurances.join(' • ')}</p>
              </div>
            </div>
          </div>
          <div className="space-y-4 rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur">
            <h3 className="text-xl font-semibold">Logistics</h3>
            <p className="text-sm text-white/80">{content.logistics.meetingPoint}</p>
            <ul className="space-y-2 text-sm text-white/80">
              <li>
                <strong className="text-white">Pickup windows:</strong> {content.logistics.pickupWindows.join(' • ')}
              </li>
              <li>
                <strong className="text-white">Flight season:</strong> {content.logistics.flightSeason}
              </li>
              <li>
                <strong className="text-white">Dress code:</strong> {content.logistics.dressCode}
              </li>
              <li>
                <strong className="text-white">Gear provided:</strong> {content.logistics.gearProvided.join(', ')}
              </li>
              <li>
                <strong className="text-white">Bring along:</strong> {content.logistics.bringAlong.join(', ')}
              </li>
            </ul>
            <p className="text-xs text-purple-100">{content.logistics.weatherPolicy}</p>
          </div>
        </div>
      </section>

      <section className="bg-white py-16">
        <div className="mx-auto max-w-6xl px-4">
          <h2 className="text-3xl font-semibold text-slate-900">Photo gallery</h2>
          <p className="mt-2 text-slate-600">Glide through sunrise above Lion Rock.</p>
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {content.gallery.map((item) => (
              <div key={item.id} className="group relative h-60 overflow-hidden rounded-2xl">
                <img
                  src={getOptimizedImageUrl(item.image, 900)}
                  alt={item.caption}
                  className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/70 via-transparent to-transparent opacity-0 transition group-hover:opacity-100" />
                <p className="absolute bottom-3 left-3 text-sm font-medium text-white">{item.caption}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-slate-50 py-16">
        <div className="mx-auto max-w-5xl px-4">
          <h2 className="text-3xl font-semibold text-center text-slate-900">Frequently asked</h2>
          <Accordion type="single" collapsible className="mt-8 space-y-4">
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

      <section ref={bookingRef} className="bg-gradient-to-b from-slate-950 via-purple-950 to-slate-950 py-20 text-white">
        <div className="mx-auto grid max-w-6xl gap-10 px-4 md:grid-cols-[1.05fr_0.95fr]">
          <div>
            <p className="text-xs uppercase tracking-[0.4em] text-purple-200">Concierge request</p>
            <h3 className="mt-3 text-3xl font-semibold">Hold sunrise seats</h3>
            <p className="mt-3 text-slate-200">{content.booking.conciergeNote}</p>
            <div className="mt-8 space-y-3 rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur">
              <div className="flex items-center gap-3 text-sm">
                <Phone className="h-4 w-4 text-emerald-300" />
                {content.booking.contactPhone}
              </div>
              <div className="flex items-center gap-3 text-sm">
                <MessageCircle className="h-4 w-4 text-emerald-300" />
                {content.booking.responseTime}
              </div>
              <Button
                size="sm"
                className="mt-4 w-full bg-purple-500 text-white hover:bg-purple-400"
                onClick={() => window.open(content.booking.whatsapp, '_blank')}
              >
                WhatsApp concierge
              </Button>
              <p className="text-xs text-purple-100">{content.booking.depositNote}</p>
              <p className="text-xs text-purple-100">{content.booking.seatHoldPolicy}</p>
              <p className="text-xs text-purple-100">Add-ons: {content.pricing.addOns.join(' • ')}</p>
            </div>
          </div>
          <form
            onSubmit={handleSubmit}
            className="space-y-5 rounded-3xl border border-white/10 bg-white/95 p-6 text-slate-900 shadow-2xl"
          >
            <div className="grid gap-4 md:grid-cols-2">
              <label className="text-sm font-medium">
                Date
                <input
                  type="date"
                  required
                  value={formData.date}
                  onChange={(e) => handleInputChange('date', e.target.value)}
                  className="mt-1 w-full rounded-2xl border border-slate-300 px-3 py-3"
                />
              </label>
              <label className="text-sm font-medium">
                Package
                <select
                  value={formData.package}
                  onChange={(e) => handleInputChange('package', e.target.value)}
                  className="mt-1 w-full rounded-2xl border border-slate-300 px-3 py-3"
                >
                  {content.packages.map((pkg) => (
                    <option key={pkg.id}>{pkg.name}</option>
                  ))}
                </select>
              </label>
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              <label className="text-sm font-medium">
                Adults
                <input
                  type="number"
                  min={1}
                  value={formData.adults}
                  onChange={(e) => handleInputChange('adults', Number(e.target.value))}
                  className="mt-1 w-full rounded-2xl border border-slate-300 px-3 py-3"
                />
              </label>
              <label className="text-sm font-medium">
                Teens (7+)
                <input
                  type="number"
                  min={0}
                  value={formData.teens}
                  onChange={(e) => handleInputChange('teens', Number(e.target.value))}
                  className="mt-1 w-full rounded-2xl border border-slate-300 px-3 py-3"
                />
              </label>
            </div>
            <label className="text-sm font-medium">
              Hotel / pickup note
              <input
                type="text"
                value={formData.pickup}
                onChange={(e) => handleInputChange('pickup', e.target.value)}
                className="mt-1 w-full rounded-2xl border border-slate-300 px-3 py-3"
                placeholder="Sigiriya, Dambulla, Habarana…"
              />
            </label>
            <div className="grid gap-4 md:grid-cols-2">
              <label className="text-sm font-medium">
                Full name
                <input
                  type="text"
                  required
                  value={formData.contactName}
                  onChange={(e) => handleInputChange('contactName', e.target.value)}
                  className="mt-1 w-full rounded-2xl border border-slate-300 px-3 py-3"
                />
              </label>
              <label className="text-sm font-medium">
                Email
                <input
                  type="email"
                  required
                  value={formData.contactEmail}
                  onChange={(e) => handleInputChange('contactEmail', e.target.value)}
                  className="mt-1 w-full rounded-2xl border border-slate-300 px-3 py-3"
                />
              </label>
            </div>
            <label className="text-sm font-medium">
              Phone / WhatsApp
              <input
                type="tel"
                required
                value={formData.contactPhone}
                onChange={(e) => handleInputChange('contactPhone', e.target.value)}
                className="mt-1 w-full rounded-2xl border border-slate-300 px-3 py-3"
              />
            </label>
            <label className="text-sm font-medium">
              Requests or add-ons
              <textarea
                rows={3}
                value={formData.requests}
                onChange={(e) => handleInputChange('requests', e.target.value)}
                className="mt-1 w-full rounded-2xl border border-slate-300 px-3 py-3"
                placeholder="Photo crew, bouquet, signage…"
              />
            </label>
            <div className="rounded-2xl border border-slate-200 bg-slate-50/80 p-4 text-sm text-slate-600">
              <div className="flex items-center justify-between text-slate-900">
                <span className="font-medium">Estimated from</span>
                <span className="text-lg font-semibold">
                  {content.pricing.currency} {estimatedTotal.toLocaleString()}
                </span>
              </div>
              <p className="mt-2 text-xs text-slate-500">
                Adults at {content.pricing.currency} {content.pricing.startingPrice.toLocaleString()} • Teens at {content.pricing.currency}{' '}
                {teenPrice.toLocaleString()}
              </p>
              <p className="mt-3 text-xs text-slate-500">Private charter: {content.pricing.currency} {content.pricing.privateCharterPrice.toLocaleString()}</p>
            </div>
            <Button type="submit" className="w-full bg-purple-500 py-3 text-base text-white hover:bg-purple-400">
              Request confirmation
            </Button>
          </form>
        </div>
      </section>

      <section className="bg-gradient-to-br from-purple-600 to-indigo-700 py-16 text-white">
        <div className="mx-auto max-w-4xl px-4 text-center">
          <h2 className="text-3xl font-semibold">{content.cta.title}</h2>
          <p className="mt-3 text-lg text-white/85">{content.cta.description}</p>
          <div className="mt-6 flex flex-wrap justify-center gap-4">
            <Button className="bg-white text-purple-700 hover:bg-white/90" onClick={() => scrollToBooking(selectedPackage)}>
              {content.cta.primaryButtonText}
            </Button>
            <Button variant="outline" className="border-white text-white hover:bg-white/10" onClick={() => window.open(content.booking.whatsapp, '_blank')}>
              {content.cta.secondaryButtonText}
            </Button>
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
};

export default HotAirBalloonSigiriya;
