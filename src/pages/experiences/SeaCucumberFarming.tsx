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
  ArrowRight,
  CheckCircle,
  Clock,
  Droplets,
  Globe,
  MapPin,
  MessageCircle,
  Phone,
  Shield,
  Shell,
  Users
} from 'lucide-react';
import {
  seaCucumberPageService,
  SeaCucumberPageContent
} from '@/services/seaCucumberPageService';
import { cachedFetch } from '@/lib/cache';

const iconMap: Record<string, React.ComponentType<any>> = {
  Shell,
  Users,
  Clock,
  Droplets,
  Globe,
  MapPin,
  Shield,
  ArrowRight
};

const SeaCucumberFarming = () => {
  const [content, setContent] = useState<SeaCucumberPageContent>(
    seaCucumberPageService.getDefaultContent()
  );
  const [loading, setLoading] = useState(true);
  const [heroIndex, setHeroIndex] = useState(0);
  const [selectedExperienceId, setSelectedExperienceId] = useState<string | null>(null);
  const bookingRef = useRef<HTMLDivElement | null>(null);
  const [formData, setFormData] = useState({
    date: '',
    guests: 4,
    focus: '',
    pickup: '',
    contactName: '',
    contactEmail: '',
    contactPhone: '',
    requests: ''
  });

  useEffect(() => {
    const load = async () => {
      try {
        const data = await cachedFetch<SeaCucumberPageContent>(
          'sea-cucumber-farming-page',
          () => seaCucumberPageService.getContent(),
          10 * 60 * 1000
        );
        setContent(data);
        if (data.experiences.length) {
          setSelectedExperienceId(data.experiences[0].id);
          setFormData((prev) => ({ ...prev, focus: data.experiences[0].name }));
        }
      } catch (error) {
        console.error('Error loading sea cucumber content', error);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  useEffect(() => {
    if (!content.hero.images.length) return;
    const interval = setInterval(() => {
      setHeroIndex((prev) => (prev + 1) % content.hero.images.length);
    }, 6000);
    return () => clearInterval(interval);
  }, [content.hero.images.length]);

  const selectedExperience = useMemo(() => {
    return content.experiences.find((exp) => exp.id === selectedExperienceId) || content.experiences[0];
  }, [content.experiences, selectedExperienceId]);

  const handleInputChange = (key: keyof typeof formData, value: string | number) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
  };

  const scrollToBooking = (experienceId?: string) => {
    if (experienceId) {
      const exp = content.experiences.find((item) => item.id === experienceId);
      if (exp) {
        setSelectedExperienceId(exp.id);
        handleInputChange('focus', exp.name);
      }
    }
    bookingRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const estimatedInvestment =
    (formData.guests || 1) * content.pricing.dayRate + content.pricing.labAddon;

  const submitRequest = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    alert('Thanks! Our marine concierge will confirm availability within 30 minutes.');
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50">
        <div className="text-center">
          <div className="mx-auto mb-4 h-12 w-12 animate-spin rounded-full border-b-2 border-teal-500" />
          <p className="text-slate-500">Preparing your field notes…</p>
        </div>
      </div>
    );
  }

  const heroSlide = content.hero.images[heroIndex] ?? content.hero.images[0];

  return (
    <>
      <Helmet>
        <title>{content.seo.title}</title>
        <meta name="description" content={content.seo.description} />
        <meta name="keywords" content={content.seo.keywords.join(', ')} />
        <meta property="og:title" content={content.seo.title} />
        <meta property="og:description" content={content.seo.description} />
        <meta property="og:image" content={content.seo.ogImage} />
        <link rel="canonical" href="https://www.rechargetravels.com/experiences/sea-cucumber-farming" />
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
              className="bg-teal-500 px-8 py-6 text-base shadow-lg shadow-teal-500/30 hover:bg-teal-400"
              onClick={() => scrollToBooking()}
            >
              <Shell className="mr-2 h-5 w-5" />
              {content.hero.ctaText}
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-white/40 px-8 py-6 text-base text-white hover:bg-white/10"
              onClick={() => window.open(content.booking.whatsapp, '_blank')}
            >
              <MessageCircle className="mr-2 h-5 w-5" />
              WhatsApp concierge
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
        <div className="mx-auto grid max-w-6xl gap-10 lg:grid-cols-[1.2fr_0.8fr]">
          <div>
            <p className="text-sm uppercase tracking-[0.4em] text-teal-600">Field intelligence</p>
            <h2 className="mt-3 text-3xl font-semibold text-slate-900">Blue economy immersion</h2>
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
              const Icon = iconMap[stat.iconName] || Shell;
              return (
                <div key={stat.id} className="rounded-3xl border border-slate-200 bg-slate-50 p-6 text-center">
                  <Icon className="mx-auto mb-3 h-8 w-8 text-teal-500" />
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
          <div className="mb-10 flex flex-col gap-3 text-center">
            <p className="text-xs uppercase tracking-[0.4em] text-teal-500">Field sites</p>
            <h2 className="text-3xl font-semibold text-slate-900">Partner farms & hatcheries</h2>
            <p className="text-slate-600">
              Curated visits across Mannar, Kalpitiya, and Batticaloa with logistics, interpreter, and insurance handled end-to-end.
            </p>
          </div>
          <div className="grid gap-6 md:grid-cols-2">
            {content.farms.map((farm) => (
              <Card key={farm.id} className="border-none bg-white shadow-xl shadow-slate-700/5">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <Badge className="mb-3 w-fit bg-teal-100 text-teal-700">{farm.badge}</Badge>
                      <CardTitle className="text-2xl">{farm.name}</CardTitle>
                      <p className="text-sm text-slate-500">{farm.region}</p>
                    </div>
                    <span className="rounded-full border border-slate-200 px-3 py-1 text-xs text-slate-500">
                      {farm.capacity}
                    </span>
                  </div>
                  <p className="mt-4 text-slate-600">{farm.description}</p>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex flex-wrap gap-4 text-sm text-slate-600">
                    <span className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-teal-500" />
                      {farm.duration}
                    </span>
                    <span className="flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-teal-500" />
                      {farm.logistics.meetingPoint}
                    </span>
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold uppercase tracking-wide text-slate-500">Highlights</h4>
                    <div className="mt-2 grid gap-2 text-sm">
                      {farm.highlights.map((item) => (
                        <span key={item} className="flex items-start gap-2 text-slate-600">
                          <CheckCircle className="mt-0.5 h-4 w-4 text-emerald-500" />
                          {item}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="rounded-2xl border border-dashed border-slate-200 p-4 text-sm text-slate-600">
                    <p className="font-semibold text-slate-800">Best season: {farm.logistics.bestSeason}</p>
                    <p className="mt-1">{farm.logistics.transferNote}</p>
                  </div>
                  <Button className="w-full" variant="outline" onClick={() => scrollToBooking()}>
                    Book {farm.name}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-white py-16">
        <div className="mx-auto max-w-6xl">
          <div className="mb-10 flex flex-col gap-3 text-center">
            <p className="text-xs uppercase tracking-[0.4em] text-teal-500">Experiences</p>
            <h2 className="text-3xl font-semibold text-slate-900">Choose your immersion</h2>
            <p className="text-slate-600">Academic cohorts, investors, or families — pick the package that suits your goals.</p>
          </div>
          <div className="grid gap-6 md:grid-cols-3">
            {content.experiences.map((experience) => (
              <Card key={experience.id} className="flex h-full flex-col border-slate-200/80 shadow-sm">
                <CardHeader>
                  <Badge className="mb-3 w-fit bg-slate-900 text-white">{experience.level}</Badge>
                  <CardTitle className="text-2xl">{experience.name}</CardTitle>
                  <p className="text-sm text-slate-500">{experience.duration}</p>
                  <p className="mt-2 text-lg font-semibold text-teal-600">{experience.priceLabel}</p>
                  <p className="mt-3 text-sm text-slate-600">{experience.summary}</p>
                </CardHeader>
                <CardContent className="flex flex-1 flex-col gap-4">
                  <div>
                    <h4 className="text-sm font-semibold uppercase tracking-wide text-slate-500">Highlights</h4>
                    <ul className="mt-2 space-y-1 text-sm text-slate-600">
                      {experience.highlights.map((item) => (
                        <li key={item} className="flex gap-2">
                          <ArrowRight className="h-4 w-4 text-teal-500" />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold uppercase tracking-wide text-slate-500">Included</h4>
                    <ul className="mt-2 space-y-1 text-sm text-slate-600">
                      {experience.included.map((item) => (
                        <li key={item} className="flex gap-2">
                          <CheckCircle className="h-4 w-4 text-emerald-500" />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <Button className="mt-auto" onClick={() => scrollToBooking(experience.id)}>
                    Reserve this circuit
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-slate-900 py-16 text-white">
        <div className="mx-auto max-w-6xl">
          <div className="mb-10 text-center">
            <p className="text-xs uppercase tracking-[0.4em] text-cyan-200/80">Research streams</p>
            <h2 className="mt-3 text-3xl font-semibold">Pick a focus track</h2>
            <p className="mt-3 text-slate-300">
              Co-create agendas with marine biologists, economists, and technologists depending on your outcomes.
            </p>
          </div>
          <div className="grid gap-6 md:grid-cols-3">
            {content.researchTracks.map((track) => (
              <div key={track.id} className="rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur">
                <Badge className="mb-3 bg-white/10 text-white">{track.badge}</Badge>
                <h3 className="text-xl font-semibold">{track.title}</h3>
                <p className="mt-2 text-sm text-slate-200">{track.description}</p>
                <ul className="mt-4 space-y-2 text-sm text-slate-100">
                  {track.bullets.map((bullet) => (
                    <li key={bullet} className="flex gap-2">
                      <CheckCircle className="h-4 w-4 text-emerald-300" />
                      {bullet}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-white py-16">
        <div className="mx-auto max-w-6xl">
          <div className="mb-10 text-center">
            <p className="text-xs uppercase tracking-[0.4em] text-teal-500">Gallery</p>
            <h2 className="text-3xl font-semibold text-slate-900">Field moments</h2>
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

      <section ref={bookingRef} className="bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 py-20 text-white">
        <div className="mx-auto grid max-w-6xl gap-10 lg:grid-cols-2">
          <div>
            <p className="text-xs uppercase tracking-[0.4em] text-cyan-200/80">Concierge brief</p>
            <h2 className="mt-4 text-3xl font-semibold">Plan your marine lab day</h2>
            <p className="mt-4 text-slate-300">{content.booking.conciergeNote}</p>
            <div className="mt-6 space-y-4 rounded-3xl border border-white/10 bg-white/5 p-6">
              <div className="flex items-center gap-3 text-sm text-white">
                <Phone className="h-5 w-5 text-emerald-200" />
                {content.booking.contactPhone}
              </div>
              <div className="flex items-center gap-3 text-sm text-white">
                <MessageCircle className="h-5 w-5 text-emerald-200" />
                {content.booking.responseTime}
              </div>
              <p className="text-sm text-slate-200">{content.booking.depositNote}</p>
              <p className="text-sm text-slate-200">{content.booking.groupSuitability}</p>
            </div>
            <div className="mt-6 rounded-3xl border border-white/15 bg-white/5 p-6 text-sm text-slate-100">
              <h4 className="text-base font-semibold text-white">Popular add-ons</h4>
              <ul className="mt-3 space-y-2">
                {content.booking.addOns.map((addon) => (
                  <li key={addon} className="flex gap-2">
                    <ArrowRight className="h-4 w-4 text-emerald-300" />
                    {addon}
                  </li>
                ))}
              </ul>
            </div>
          </div>
          <Card className="border-none bg-white text-slate-900 shadow-2xl shadow-slate-900/20">
            <CardHeader>
              <CardTitle className="text-2xl">Request availability</CardTitle>
              <p className="text-sm text-slate-500">We reply within 30 minutes, 06:00 – 22:00 GMT+5:30.</p>
            </CardHeader>
            <CardContent>
              <form className="space-y-4" onSubmit={submitRequest}>
                <div className="grid gap-4 md:grid-cols-2">
                  <label className="text-sm font-medium text-slate-700">
                    Preferred date
                    <input
                      type="date"
                      required
                      value={formData.date}
                      onChange={(e) => handleInputChange('date', e.target.value)}
                      className="mt-2 w-full rounded-2xl border border-slate-200 px-3 py-3"
                    />
                  </label>
                  <label className="text-sm font-medium text-slate-700">
                    Group size
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
                  Focus track
                  <select
                    value={formData.focus}
                    onChange={(e) => handleInputChange('focus', e.target.value)}
                    className="mt-2 w-full rounded-2xl border border-slate-200 px-3 py-3"
                  >
                    {content.experiences.map((experience) => (
                      <option key={experience.id} value={experience.name}>
                        {experience.name}
                      </option>
                    ))}
                  </select>
                </label>
                <label className="text-sm font-medium text-slate-700">
                  Pickup / overnight base
                  <input
                    type="text"
                    value={formData.pickup}
                    onChange={(e) => handleInputChange('pickup', e.target.value)}
                    placeholder="e.g., Colombo, Anuradhapura, Kalpitiya"
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
                  Requests (research goals, logistics, media)
                  <textarea
                    value={formData.requests}
                    onChange={(e) => handleInputChange('requests', e.target.value)}
                    rows={3}
                    className="mt-2 w-full rounded-2xl border border-slate-200 px-3 py-3"
                  />
                </label>
                <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-600">
                  <div className="flex items-center justify-between text-slate-900">
                    <span className="font-medium">Est. from</span>
                    <span className="text-lg font-semibold">
                      {content.pricing.currency} {estimatedInvestment.toLocaleString()}
                    </span>
                  </div>
                  <p className="mt-2 text-xs text-slate-500">Day rate x guests + lab access token</p>
                  <p className="mt-2 text-xs text-slate-500">Add-ons: {content.pricing.extras.join(' · ')}</p>
                </div>
                <Button type="submit" className="w-full bg-teal-500 py-3 text-base font-semibold text-white hover:bg-teal-400">
                  Submit request
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </section>

      <section className="bg-white py-16">
        <div className="mx-auto max-w-5xl">
          <div className="mb-10 text-center">
            <p className="text-xs uppercase tracking-[0.4em] text-teal-500">FAQs</p>
            <h2 className="text-3xl font-semibold text-slate-900">Plan with confidence</h2>
          </div>
          <Accordion type="single" collapsible className="space-y-4">
            {content.faqs.map((faq) => (
              <AccordionItem key={faq.id} value={faq.id} className="rounded-2xl border border-slate-200 px-4">
                <AccordionTrigger className="text-left text-lg font-medium text-slate-900">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="pb-4 text-sm leading-relaxed text-slate-600">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
          <div className="mt-12 grid gap-6 text-center sm:grid-cols-3">
            <div className="rounded-3xl border border-slate-200 p-6">
              <Phone className="mx-auto mb-3 h-6 w-6 text-teal-500" />
              <p className="text-sm uppercase tracking-[0.3em] text-slate-500">Hotline</p>
              <p className="mt-2 text-lg font-semibold text-slate-900">{content.booking.contactPhone}</p>
            </div>
            <div className="rounded-3xl border border-slate-200 p-6">
              <MessageCircle className="mx-auto mb-3 h-6 w-6 text-teal-500" />
              <p className="text-sm uppercase tracking-[0.3em] text-slate-500">WhatsApp</p>
              <Button variant="link" className="mt-2 text-lg" onClick={() => window.open(content.booking.whatsapp, '_blank')}>
                Open chat
              </Button>
            </div>
            <div className="rounded-3xl border border-slate-200 p-6">
              <Globe className="mx-auto mb-3 h-6 w-6 text-teal-500" />
              <p className="text-sm uppercase tracking-[0.3em] text-slate-500">Email</p>
              <p className="mt-2 text-lg font-semibold text-slate-900">{content.booking.email}</p>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
};

export default SeaCucumberFarming;
