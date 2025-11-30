import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { AnimatePresence, motion } from 'framer-motion';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger
} from '@/components/ui/accordion';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Backpack,
  CheckCircle,
  Clock,
  Compass,
  Flame,
  Leaf,
  Loader2,
  MapPin,
  MessageCircle,
  Mountain,
  Package,
  Phone,
  Shield,
  Star,
  Tent,
  Trees
} from 'lucide-react';
import jungleCampingPageService, { JungleCampingPageContent } from '@/services/jungleCampingPageService';
import { cachedFetch } from '@/lib/cache';

const getOptimizedImageUrl = (url: string, width: number = 1920): string => {
  if (!url) return '';
  if (url.includes('unsplash.com')) {
    const cleanUrl = url.split('?')[0];
    return `${cleanUrl}?w=${width}&q=80&auto=format&fit=crop`;
  }
  return url;
};

const fallbackHeroSlides = [
  {
    id: 'fallback-1',
    url: 'https://images.unsplash.com/photo-1504280390367-361c6d9f38f4',
    caption: 'Sunrise over leopard country',
    tag: 'Dawn brews'
  }
];

const iconMap: Record<string, React.ComponentType<any>> = {
  Tent,
  Trees,
  Leaf,
  Star,
  Shield,
  MapPin,
  Campfire: Flame,
  Compass,
  Mountain,
  Backpack,
  Package
};

const JungleCamping: React.FC = () => {
  const [content, setContent] = useState<JungleCampingPageContent>(
    jungleCampingPageService.getDefaultContent()
  );
  const [loading, setLoading] = useState(true);
  const [heroIndex, setHeroIndex] = useState(0);
  const [selectedCampId, setSelectedCampId] = useState<string | null>(null);
  const bookingSectionRef = useRef<HTMLDivElement | null>(null);
  const [formData, setFormData] = useState({
    date: '',
    nights: 2,
    adults: 2,
    teens: 0,
    campPreference: '',
    pickup: '',
    contactName: '',
    contactEmail: '',
    contactPhone: '',
    requests: ''
  });

  useEffect(() => {
    const load = async () => {
      try {
        const data = await cachedFetch<JungleCampingPageContent>(
          'jungle-camping-page',
          () => jungleCampingPageService.getPageContent(),
          10 * 60 * 1000
        );
        setContent(data);
        if (data.campingPackages.length > 0) {
          setSelectedCampId(data.campingPackages[0].id);
          setFormData((prev) => ({
            ...prev,
            campPreference: data.campingPackages[0].name,
            pickup: data.logistics.meetingPoint
          }));
        }
      } catch (error) {
        console.error('Error loading jungle camping content', error);
        const fallback = jungleCampingPageService.getDefaultContent();
        setContent(fallback);
        setSelectedCampId(fallback.campingPackages[0]?.id ?? null);
        setFormData((prev) => ({
          ...prev,
          campPreference: fallback.campingPackages[0]?.name ?? '',
          pickup: fallback.logistics.meetingPoint
        }));
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

  const heroSlides = content.hero.images.length ? content.hero.images : fallbackHeroSlides;
  const currentSlide = heroSlides[heroIndex % heroSlides.length];

  const selectedCamp = useMemo(
    () => content.campingPackages.find((pkg) => pkg.id === selectedCampId) ?? content.campingPackages[0],
    [content.campingPackages, selectedCampId]
  );

  const teenPrice = Math.round(
    content.pricing.startingPrice * (1 - content.pricing.teenDiscountPercent / 100)
  );
  const estimatedTotal =
    content.pricing.startingPrice * formData.adults + teenPrice * formData.teens;

  const handleInputChange = (field: keyof typeof formData, value: string | number) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value
    }));
  };

  const scrollToBooking = (campName?: string, campId?: string) => {
    if (campName) {
      handleInputChange('campPreference', campName);
    }
    if (campId) {
      setSelectedCampId(campId);
    }
    bookingSectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    alert('Thanks! Our jungle concierge will confirm your basecamp within 30 minutes.');
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-emerald-50">
        <div className="text-center">
          <Loader2 className="mx-auto mb-4 h-10 w-10 animate-spin text-emerald-600" />
          <p className="text-slate-600">Loading jungle camping experience…</p>
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
        <link rel="canonical" href="https://www.rechargetravels.com/experiences/jungle-camping" />
      </Helmet>

      <Header />

      <section className="relative h-[70vh] min-h-[600px] overflow-hidden">
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
              src={getOptimizedImageUrl(currentSlide.url)}
              alt={currentSlide.caption}
              className="h-full w-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-slate-950/85 via-slate-900/60 to-slate-950/90" />
          </motion.div>
        </AnimatePresence>

        <div className="relative z-10 mx-auto flex h-full max-w-5xl flex-col items-center justify-center px-4 text-center text-white">
          <Badge className="mb-6 bg-white/10 text-white backdrop-blur">{content.hero.badge}</Badge>
          <h1 className="text-4xl font-semibold leading-tight sm:text-5xl lg:text-6xl">
            {content.hero.title}
              </h1>
          <p className="mt-4 max-w-3xl text-lg text-white/85">{content.hero.subtitle}</p>
          <div className="mt-6 flex flex-wrap items-center justify-center gap-3 text-sm">
            {content.stats.map((stat) => {
              const Icon = iconMap[stat.iconName] || Tent;
              return (
                <span
                  key={stat.id}
                  className="inline-flex items-center gap-2 rounded-full border border-white/20 px-4 py-2 text-white/90 backdrop-blur"
                >
                  <Icon className="h-4 w-4" />
                  <strong className="font-semibold">{stat.value}</strong>
                  <span className="text-white/70">{stat.label}</span>
                </span>
              );
            })}
          </div>
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <Button size="lg" className="bg-emerald-500 px-8 py-6 text-base" onClick={() => scrollToBooking(selectedCamp?.name, selectedCamp?.id)}>
              Reserve jungle camp
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
          <div className="mt-6 text-xs uppercase tracking-[0.4em] text-white/70">
            {currentSlide.tag}
          </div>
        </div>

        <div className="absolute bottom-6 left-1/2 flex -translate-x-1/2 gap-2">
          {heroSlides.map((slide, idx) => (
            <button
              key={slide.id}
              onClick={() => setHeroIndex(idx)}
              className={`h-2 rounded-full transition-all ${idx === heroIndex ? 'w-12 bg-white' : 'w-6 bg-white/40'}`}
              aria-label={`Show hero slide ${idx + 1}`}
            />
          ))}
        </div>
      </section>

      <section className="bg-white py-16">
        <div className="mx-auto max-w-6xl px-4">
          <div className="grid gap-10 md:grid-cols-[1.1fr_0.9fr]">
            <div>
              <p className="text-xs uppercase tracking-[0.4em] text-emerald-500">Wilderness concierge</p>
              <h2 className="mt-4 text-3xl font-semibold text-slate-900">{content.overview.title}</h2>
              <p className="mt-4 text-lg text-slate-600">{content.overview.description}</p>
            </div>
            <div className="grid gap-4">
              {content.overview.highlights.map((highlight) => (
                <div key={highlight.id} className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                  <p className="text-xs uppercase tracking-[0.3em] text-emerald-500">{highlight.label}</p>
                  <p className="mt-2 text-sm text-slate-700">{highlight.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="bg-emerald-50 py-16">
        <div className="mx-auto max-w-6xl px-4">
          <div className="mb-10 flex flex-col gap-2">
            <p className="text-xs uppercase tracking-[0.4em] text-emerald-500">Camp atelier</p>
            <h3 className="text-3xl font-semibold text-slate-900">Pick your basecamp</h3>
            <p className="text-slate-600">Every stay includes private naturalists, gourmet dining, and concierge transfers.</p>
          </div>
          <div className="grid gap-6 md:grid-cols-2">
            {content.campingPackages.map((pkg) => (
              <motion.button
                key={pkg.id}
                type="button"
                onClick={() => {
                  setSelectedCampId(pkg.id);
                  handleInputChange('campPreference', pkg.name);
                }}
                whileHover={{ y: -4 }}
                className={`flex h-full flex-col overflow-hidden rounded-3xl border text-left shadow-sm transition ${
                  selectedCampId === pkg.id ? 'border-emerald-400 bg-white shadow-xl' : 'border-slate-200 bg-white hover:border-emerald-200'
                }`}
              >
                <div className="relative h-56 w-full overflow-hidden">
                  <img src={pkg.image} alt={pkg.name} className="h-full w-full object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-transparent to-transparent" />
                  <div className="absolute bottom-4 left-4 flex items-center gap-2 text-sm text-white">
                    <Badge className="bg-emerald-500/90 text-white">{pkg.duration}</Badge>
                    <span>{pkg.difficulty}</span>
                  </div>
                </div>
                <div className="flex flex-1 flex-col gap-4 p-6">
                  <div>
                    <h4 className="text-xl font-semibold text-slate-900">{pkg.name}</h4>
                    <p className="mt-2 text-sm text-slate-600">{pkg.summary}</p>
                  </div>
                  <ul className="space-y-1 text-sm text-slate-600">
                    {pkg.highlights.map((item) => (
                      <li key={item} className="flex items-center gap-2">
                        <CheckCircle className="h-3.5 w-3.5 text-emerald-500" />
                        {item}
                      </li>
                    ))}
                    </ul>
                  <div className="rounded-2xl border border-slate-200 bg-slate-50/70 p-4 text-sm text-slate-600">
                    <p className="font-medium text-slate-900">Includes</p>
                    <p className="mt-1 text-slate-600">
                      {pkg.included.slice(0, 3).join(' • ')}
                      {pkg.included.length > 3 ? '…' : ''}
                    </p>
                    <p className="mt-2 text-xs text-slate-500">
                      {pkg.startLocation} · {pkg.transportNote}
                    </p>
                  </div>
                  <div className="mt-auto flex items-center justify-between">
                    <span className="text-lg font-semibold text-emerald-600">{pkg.priceLabel}</span>
                    <Button variant="outline" onClick={() => scrollToBooking(pkg.name, pkg.id)}>
                      Hold camp
                    </Button>
              </div>
                      </div>
              </motion.button>
            ))}
                      </div>
                    </div>
      </section>

      <section className="bg-white py-16">
        <div className="mx-auto grid max-w-6xl gap-10 px-4 lg:grid-cols-[1.1fr_0.9fr]">
          <div>
            <p className="text-xs uppercase tracking-[0.4em] text-emerald-500">Wildlife windows</p>
            <h3 className="mt-3 text-3xl font-semibold text-slate-900">Species diaries</h3>
            <div className="mt-6 space-y-4">
              {content.wildlifeSpottings.map((spotting) => (
                <div key={spotting.id} className="rounded-2xl border border-slate-200 p-4">
                  <div className="flex items-center justify-between">
                    <p className="text-lg font-semibold text-slate-900">{spotting.animal}</p>
                    <Badge variant="secondary">{spotting.frequency}</Badge>
                  </div>
                  <p className="mt-2 text-sm text-slate-600">{spotting.description}</p>
                  <p className="mt-3 flex items-center gap-2 text-xs uppercase tracking-[0.3em] text-slate-500">
                    <Clock className="h-3.5 w-3.5" /> {spotting.bestTime}
                  </p>
                </div>
              ))}
                            </div>
                          </div>
          <div className="rounded-3xl border border-emerald-100 bg-emerald-950 p-8 text-white">
            <p className="text-xs uppercase tracking-[0.4em] text-emerald-200">Camp logistics</p>
            <h3 className="mt-3 text-2xl font-semibold">Everything dialed in</h3>
            <div className="mt-6 space-y-4 text-sm text-white/80">
              <div>
                <p className="text-xs uppercase tracking-[0.3em] text-emerald-200">Meeting point</p>
                <p className="mt-1">{content.logistics.meetingPoint}</p>
              </div>
              <div>
                <p className="text-xs uppercase tracking-[0.3em] text-emerald-200">Stay length</p>
                <p className="mt-1">{content.logistics.stayLength}</p>
              </div>
                          <div>
                <p className="text-xs uppercase tracking-[0.3em] text-emerald-200">Start windows</p>
                <ul className="mt-2 space-y-1">
                  {content.logistics.startWindows.map((slot) => (
                    <li key={slot} className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-emerald-300" />
                      {slot}
                                </li>
                              ))}
                            </ul>
                          </div>
                          <div>
                <p className="text-xs uppercase tracking-[0.3em] text-emerald-200">Amenities</p>
                <p className="mt-1">{content.logistics.amenities.join(' • ')}</p>
              </div>
              <div>
                <p className="text-xs uppercase tracking-[0.3em] text-emerald-200">Bring list</p>
                <p className="mt-1">{content.logistics.packingList.join(' • ')}</p>
              </div>
              <p className="text-emerald-100">{content.logistics.transferNote}</p>
              <p className="text-emerald-200/80">{content.logistics.weatherNote}</p>
            </div>
          </div>
                    </div>
      </section>

      <section className="bg-slate-50 py-16">
        <div className="mx-auto max-w-6xl px-4">
          <div className="mb-8 flex flex-col gap-2">
            <p className="text-xs uppercase tracking-[0.4em] text-emerald-500">Prep list</p>
            <h3 className="text-3xl font-semibold text-slate-900">What to pack & what we cover</h3>
                    </div>
          <div className="grid gap-6 md:grid-cols-3">
            {content.campingEssentials.map((category) => {
              const Icon = iconMap[category.iconName] || Shield;
              return (
                <div key={category.id} className="rounded-3xl border border-slate-200 bg-white p-5">
                  <div className="flex items-center gap-3">
                    <span className="rounded-2xl bg-emerald-50 p-2 text-emerald-600">
                      <Icon className="h-5 w-5" />
                    </span>
                    <p className="text-base font-semibold text-slate-900">{category.category}</p>
                  </div>
                  <ul className="mt-4 space-y-1 text-sm text-slate-600">
                    {category.items.map((item) => (
                      <li key={item} className="flex items-center gap-2">
                        <CheckCircle className="h-3.5 w-3.5 text-emerald-500" />
                        {item}
                            </li>
                          ))}
                        </ul>
                </div>
                  );
                })}
              </div>
        </div>
      </section>

      <section className="bg-white py-16">
        <div className="mx-auto max-w-6xl px-4">
          <h3 className="text-3xl font-semibold text-slate-900">Gallery</h3>
          <p className="mt-2 text-slate-600">Camp moods, wildlife sightings, and twilight dinners.</p>
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {content.gallery.map((item) => (
              <div key={item.id} className="group relative h-56 overflow-hidden rounded-2xl">
                <img
                  src={item.url}
                  alt={item.alt}
                  className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/70 via-transparent to-transparent opacity-0 transition group-hover:opacity-100" />
                <p className="absolute bottom-3 left-3 text-sm font-medium text-white">{item.alt}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-slate-50 py-16">
        <div className="mx-auto max-w-5xl px-4">
          <h3 className="text-3xl font-semibold text-center text-slate-900">Frequently asked</h3>
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

      <section
        ref={bookingSectionRef}
        className="bg-gradient-to-b from-slate-950 via-emerald-950 to-slate-950 py-20 text-white"
      >
        <div className="mx-auto grid max-w-6xl gap-10 px-4 md:grid-cols-[1.05fr_0.95fr]">
          <div>
            <p className="text-xs uppercase tracking-[0.4em] text-emerald-200">Concierge request</p>
            <h3 className="mt-3 text-3xl font-semibold">Lock in your camp</h3>
            <p className="mt-4 text-slate-200">{content.booking.conciergeNote}</p>
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
                className="mt-4 w-full bg-emerald-500 text-white hover:bg-emerald-400"
                onClick={() => window.open(content.booking.whatsapp, '_blank')}
              >
                WhatsApp concierge
              </Button>
              <p className="text-xs text-emerald-100">{content.booking.depositNote}</p>
              <p className="text-xs text-emerald-100">{content.booking.priceIncludes.join(' • ')}</p>
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
                Nights
                <input
                  type="number"
                  min={1}
                  value={formData.nights}
                  onChange={(e) => handleInputChange('nights', Number(e.target.value))}
                  className="mt-1 w-full rounded-2xl border border-slate-300 px-3 py-3"
                />
              </label>
            </div>
            <label className="text-sm font-medium">
              Preferred camp
              <select
                value={formData.campPreference}
                onChange={(e) => handleInputChange('campPreference', e.target.value)}
                className="mt-1 w-full rounded-2xl border border-slate-300 px-3 py-3"
              >
                {content.campingPackages.map((pkg) => (
                  <option key={pkg.id}>{pkg.name}</option>
                ))}
              </select>
            </label>
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
                Teens
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
              Pickup / notes
              <input
                type="text"
                value={formData.pickup}
                onChange={(e) => handleInputChange('pickup', e.target.value)}
                className="mt-1 w-full rounded-2xl border border-slate-300 px-3 py-3"
                placeholder="e.g., Colombo hotel, seaplane request"
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
              Requests (diet, add-ons)
              <textarea
                rows={3}
                value={formData.requests}
                onChange={(e) => handleInputChange('requests', e.target.value)}
                className="mt-1 w-full rounded-2xl border border-slate-300 px-3 py-3"
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
              <p className="mt-3 text-xs text-slate-500">{content.pricing.privateCampSurcharge}</p>
              <p className="text-xs text-slate-500">{content.pricing.addOns.join(' • ')}</p>
            </div>
            <Button type="submit" className="w-full bg-emerald-500 py-3 text-base text-white hover:bg-emerald-400">
              Request itinerary
            </Button>
          </form>
        </div>
      </section>

      <section className="bg-gradient-to-br from-emerald-600 to-emerald-700 py-16 text-white">
        <div className="mx-auto max-w-4xl px-4 text-center">
          <h3 className="text-3xl font-semibold">{content.cta.title}</h3>
          <p className="mt-3 text-lg text-white/90">{content.cta.description}</p>
          <div className="mt-6 flex flex-wrap justify-center gap-4">
            <Button className="bg-white text-emerald-700 hover:bg-white/90" onClick={() => scrollToBooking(selectedCamp?.name, selectedCamp?.id)}>
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

export default JungleCamping;
