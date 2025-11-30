import React, { useEffect, useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import {
  Calendar,
  Clock,
  MapPin,
  Users,
  Check,
  Shield,
  Star,
  Info,
  Phone,
} from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import {
  whaleBookingService,
  WhaleBookingContent,
  defaultWhaleBookingContent,
} from '@/services/whaleBookingService';

const WhaleBooking: React.FC = () => {
  const [content, setContent] = useState<WhaleBookingContent>(defaultWhaleBookingContent);
  const [loading, setLoading] = useState(true);
  const [seasonKey, setSeasonKey] = useState<string>('');
  const heroSlides = useMemo(() => {
    const gallery = content.hero.gallery?.filter((slide) => slide.image?.trim());
    if (gallery && gallery.length > 0) {
      return gallery;
    }
    return [
      {
        image: content.hero.backgroundImage,
        caption: content.hero.subtitle,
      },
    ];
  }, [content.hero]);
  const [heroSlideIndex, setHeroSlideIndex] = useState(0);
  const [formData, setFormData] = useState({
    date: '',
    adults: 2,
    children: 0,
    pickupLocation: '',
    firstName: '',
    lastName: '',
    contactEmail: '',
    contactPhone: '',
    specialRequests: '',
  });

  useEffect(() => {
    const loadContent = async () => {
      try {
        const data = await whaleBookingService.getContent();
        setContent(data);
        if (data.seasons.length > 0) {
          setSeasonKey(data.seasons[0].id);
          setFormData((prev) => ({
            ...prev,
            pickupLocation: data.seasons[0].pickupPoint,
          }));
        }
      } catch (error) {
        console.error('Failed to load whale booking content', error);
        setContent(defaultWhaleBookingContent);
        setSeasonKey(defaultWhaleBookingContent.seasons[0].id);
        setFormData((prev) => ({
          ...prev,
          pickupLocation: defaultWhaleBookingContent.seasons[0].pickupPoint,
        }));
      } finally {
        setLoading(false);
      }
    };

    loadContent();
  }, []);

  useEffect(() => {
    setHeroSlideIndex(0);
  }, [heroSlides.length]);

  useEffect(() => {
    if (heroSlides.length <= 1) return undefined;
    const intervalId = setInterval(() => {
      setHeroSlideIndex((prev) => (prev + 1) % heroSlides.length);
    }, 6000);
    return () => clearInterval(intervalId);
  }, [heroSlides.length]);

  const currentSeason =
    content.seasons.find((season) => season.id === seasonKey) || content.seasons[0] || null;

  useEffect(() => {
    if (currentSeason) {
      setFormData((prev) => ({
        ...prev,
        pickupLocation: currentSeason.pickupPoint,
      }));
    }
  }, [currentSeason]);

  const handleInputChange = (field: string, value: string | number) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const totalPrice =
    (content.pricing.adultPrice || 0) * (formData.adults || 0) +
    (content.pricing.childPrice || 0) * (formData.children || 0);

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    alert('Thanks! A concierge will confirm whale watching seats within 30 minutes.');
  };

  if (loading || !currentSeason) {
    return (
      <>
        <Header />
        <div className="flex min-h-screen items-center justify-center bg-white">
          <div className="text-center">
            <div className="mx-auto mb-4 h-12 w-12 animate-spin rounded-full border-b-2 border-sky-500" />
            <p className="text-slate-500">Loading whale booking content...</p>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Helmet>
        <title>{content.hero.title}</title>
        <meta name="description" content={content.hero.subtitle} />
      </Helmet>

      <Header />

      <section className="relative overflow-hidden bg-gradient-to-b from-slate-950 via-blue-950/70 to-cyan-950 text-white">
        <AnimatePresence mode="wait">
          <motion.div
            key={heroSlides[heroSlideIndex].image}
            className="absolute inset-0"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.1 }}
          >
            <img
              src={heroSlides[heroSlideIndex].image}
              alt={content.hero.title}
              className="h-full w-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-slate-950/95 via-slate-950/70 to-cyan-950/80" />
          </motion.div>
        </AnimatePresence>
        <div className="relative z-10 px-4 py-24 sm:py-28">
          <div className="mx-auto flex max-w-5xl flex-col items-center text-center space-y-6">
            <p className="text-xs uppercase tracking-[0.5em] text-sky-200/80">{content.hero.badge}</p>
            <h1 className="text-4xl font-semibold leading-tight sm:text-5xl lg:text-6xl">{content.hero.title}</h1>
            <p className="max-w-3xl text-lg text-slate-200/90">{content.hero.subtitle}</p>
            <div className="flex flex-wrap items-center justify-center gap-3 text-sm text-slate-200">
              {content.overview.badges.map((badge) => (
                <span
                  key={badge}
                  className="inline-flex items-center gap-2 rounded-full border border-white/20 px-4 py-2 backdrop-blur-sm"
                >
                  <Check className="h-3.5 w-3.5 text-emerald-300" />
                  {badge}
                </span>
              ))}
            </div>
            {heroSlides[heroSlideIndex].caption && (
              <p className="text-sm text-slate-200/70">{heroSlides[heroSlideIndex].caption}</p>
            )}
            {heroSlides.length > 1 && (
              <div className="mt-6 flex flex-wrap items-center justify-center gap-2">
                {heroSlides.map((slide, idx) => (
                  <button
                    key={slide.image}
                    type="button"
                    onClick={() => setHeroSlideIndex(idx)}
                    className={`h-2.5 rounded-full transition-all ${
                      idx === heroSlideIndex ? 'w-10 bg-cyan-300' : 'w-6 bg-white/40 hover:bg-white/70'
                    }`}
                    aria-label={`Show hero slide ${idx + 1}`}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </section>

      <section className="bg-slate-50 py-14 px-4">
        <div className="mx-auto max-w-6xl space-y-8">
          <div className="grid gap-6 md:grid-cols-2">
            {content.seasons.map((season) => (
              <motion.button
                key={season.id}
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
                onClick={() => setSeasonKey(season.id)}
                className={`rounded-3xl p-6 text-left transition-all ${
                  seasonKey === season.id
                    ? 'bg-slate-900 text-white shadow-2xl shadow-slate-300/40'
                    : 'bg-white text-slate-900 border border-slate-200 hover:border-slate-300'
                }`}
              >
                <p className="text-xs uppercase tracking-[0.3em] text-slate-400">{season.months}</p>
                <h3 className="mt-3 text-2xl font-semibold">{season.title}</h3>
                <p className={`mt-2 text-sm ${seasonKey === season.id ? 'text-slate-200' : 'text-slate-600'}`}>
                  {season.description}
                </p>
                <p className="mt-4 flex items-center gap-2 text-sm font-medium">
                  <Star className="h-4 w-4 text-amber-400" />
                  {season.successStat}
                </p>
                <ul className="mt-4 space-y-2 text-sm">
                  {season.highlights.map((highlight) => (
                    <li key={highlight} className="flex items-start gap-2">
                      <Check className="mt-0.5 h-4 w-4 text-emerald-400" />
                      {highlight}
                    </li>
                  ))}
                </ul>
              </motion.button>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-white px-4 py-16">
        <div className="mx-auto max-w-6xl lg:grid lg:grid-cols-[minmax(0,1fr)_380px] lg:gap-12">
          <div className="mb-10 lg:mb-0">
            <div className="mb-10 space-y-4">
              <p className="text-slate-500">{content.overview.summary}</p>
              <div className="grid gap-3 sm:grid-cols-2">
                {content.overview.highlights.map((highlight) => (
                  <div key={highlight} className="rounded-2xl border border-slate-200 p-4">
                    <p className="text-sm text-slate-700">{highlight}</p>
                  </div>
                ))}
              </div>
            </div>

            <Tabs defaultValue="overview">
              <TabsList className="flex flex-wrap gap-2 rounded-2xl bg-slate-100 p-1">
                {['overview', 'details', 'itinerary', 'operator', 'reviews', 'about'].map((tab) => (
                  <TabsTrigger key={tab} value={tab} className="flex-1 rounded-xl text-sm">
                    {tab.charAt(0).toUpperCase() + tab.slice(1)}
                  </TabsTrigger>
                ))}
              </TabsList>

              <TabsContent value="overview" className="mt-8 space-y-6">
                <div className="grid gap-6 md:grid-cols-2">
                  <div className="rounded-2xl border border-slate-200 p-5">
                    <h4 className="mb-3 text-sm font-semibold text-slate-800">What’s included</h4>
                    <ul className="space-y-2 text-sm text-slate-600">
                      {content.details.includes.map((item) => (
                        <li key={item} className="flex items-start gap-2">
                          <Check className="mt-1 h-4 w-4 text-emerald-500" />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="rounded-2xl border border-slate-200 p-5">
                    <h4 className="mb-3 text-sm font-semibold text-slate-800">What’s not included</h4>
                    <ul className="space-y-2 text-sm text-slate-600">
                      {content.details.excludes.map((item) => (
                        <li key={item} className="flex items-start gap-2">
                          <Info className="mt-1 h-4 w-4 text-rose-500" />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="details" className="mt-8 space-y-6">
                <div className="grid gap-4 sm:grid-cols-2">
                  {[
                    { label: 'Duration', value: content.details.duration },
                    { label: 'Pickup', value: content.details.pickupInfo },
                    { label: 'Languages', value: content.details.languages.join(', ') },
                    { label: 'Ticket type', value: content.details.ticketType },
                    { label: 'Cancellation', value: content.details.cancellation },
                    { label: 'Accessibility', value: content.details.accessibility },
                    { label: 'Age range', value: content.details.ageRange },
                  ].map((item) => (
                    <div key={item.label} className="rounded-2xl border border-slate-200 p-4">
                      <p className="text-xs uppercase tracking-wide text-slate-500">{item.label}</p>
                      <p className="mt-2 text-sm text-slate-800">{item.value}</p>
                    </div>
                  ))}
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-slate-800">Important notes</h4>
                  <ul className="mt-3 space-y-2 text-sm text-slate-600">
                    {content.details.importantNotes.map((note) => (
                      <li key={note} className="flex items-start gap-2">
                        <Info className="mt-1 h-4 w-4 text-sky-500" />
                        {note}
                      </li>
                    ))}
                  </ul>
                </div>
              </TabsContent>

              <TabsContent value="itinerary" className="mt-8 space-y-6">
                {content.itinerary.map((stop, index) => (
                  <div key={stop.id} className="rounded-2xl border border-slate-200 p-5">
                    <div className="flex items-center justify-between text-sm">
                      <span className="font-semibold text-slate-700">
                        {index + 1}. {stop.title}
                      </span>
                      <span className="text-slate-500">{stop.duration}</span>
                    </div>
                    <p className="mt-3 text-sm text-slate-600">{stop.description}</p>
                    {stop.location && (
                      <p className="mt-2 flex items-center gap-2 text-xs text-slate-500">
                        <MapPin className="h-3.5 w-3.5" />
                        {stop.location}
                      </p>
                    )}
                  </div>
                ))}
              </TabsContent>

              <TabsContent value="operator" className="mt-8 space-y-4">
                <div className="rounded-2xl border border-slate-200 p-5">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div>
                      <p className="text-xs uppercase tracking-wide text-slate-500">Operator</p>
                      <h4 className="text-xl font-semibold text-slate-900">{content.operator.name}</h4>
                      <p className="text-sm text-slate-600">{content.operator.description}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-semibold text-amber-500">
                        {content.operator.rating.toFixed(2)}
                      </p>
                      <p className="text-xs text-slate-500">{content.operator.reviewsCount}+ reviews</p>
                    </div>
                  </div>
                  <div className="mt-4 flex flex-wrap items-center gap-2">
                    {content.operator.licenses.map((license) => (
                      <Badge key={license} variant="secondary">
                        {license}
                      </Badge>
                    ))}
                  </div>
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="rounded-2xl border border-slate-200 p-5">
                    <p className="text-xs uppercase tracking-wide text-slate-500">Concierge</p>
                    <p className="mt-2 flex items-center gap-2 text-sm text-slate-800">
                      <Phone className="h-4 w-4 text-emerald-500" />
                      {content.operator.contactPhone}
                    </p>
                    <p className="text-sm text-slate-600">{content.operator.contactEmail}</p>
                    <p className="text-xs text-slate-500">{content.operator.supportHours}</p>
                  </div>
                  <div className="rounded-2xl border border-slate-200 p-5">
                    <p className="text-xs uppercase tracking-wide text-slate-500">Assurances</p>
                    <ul className="mt-2 space-y-2 text-sm text-slate-600">
                      {content.operator.assurances.map((assurance) => (
                        <li key={assurance} className="flex items-start gap-2">
                          <Shield className="mt-1 h-4 w-4 text-emerald-500" />
                          {assurance}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="reviews" className="mt-8 space-y-4">
                {content.reviews.map((review) => (
                  <div key={review.id} className="rounded-2xl border border-slate-200 p-5">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div>
                        <p className="text-sm font-semibold text-slate-800">{review.name}</p>
                        <p className="text-xs text-slate-500">{review.date}</p>
                      </div>
                      <div className="flex items-center gap-1 text-amber-400">
                        {[...Array(Math.round(review.rating))].map((_, idx) => (
                          <Star key={idx} className="h-3.5 w-3.5 fill-current" />
                        ))}
                        <span className="text-xs text-slate-600">{review.rating.toFixed(1)}</span>
                      </div>
                    </div>
                    <p className="mt-3 text-sm font-semibold text-slate-800">{review.title}</p>
                    <p className="text-sm text-slate-600">{review.comment}</p>
                    {review.travelerType && (
                      <p className="mt-2 text-xs text-slate-500">Traveler type: {review.travelerType}</p>
                    )}
                  </div>
                ))}
              </TabsContent>

              <TabsContent value="about" className="mt-8 space-y-6">
                <p className="text-sm text-slate-600">{content.about.description}</p>
                <div>
                  <h4 className="text-sm font-semibold text-slate-800">Sustainability commitments</h4>
                  <ul className="mt-3 space-y-2 text-sm text-slate-600">
                    {content.about.sustainabilityCommitments.map((item) => (
                      <li key={item} className="flex items-start gap-2">
                        <Check className="mt-1 h-4 w-4 text-emerald-500" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-slate-800">FAQs</h4>
                  <div className="mt-3 space-y-3">
                    {content.about.faqs.map((faq) => (
                      <div key={faq.question} className="rounded-2xl border border-slate-200 p-4">
                        <p className="text-sm font-semibold text-slate-800">{faq.question}</p>
                        <p className="mt-1 text-sm text-slate-600">{faq.answer}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </div>

          <div className="space-y-6">
            <form onSubmit={handleSubmit} className="rounded-3xl border border-slate-200 bg-slate-50/60 p-6 shadow-xl">
              <div className="space-y-4">
                <div>
                  <p className="text-xs uppercase tracking-[0.4em] text-slate-400">Step 1</p>
                  <h3 className="text-lg font-semibold text-slate-900">Contact details</h3>
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-600">First name</label>
                    <input
                      type="text"
                      value={formData.firstName}
                      onChange={(e) => handleInputChange('firstName', e.target.value)}
                      className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 focus:border-sky-500 focus:outline-none"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-600">Last name</label>
                    <input
                      type="text"
                      value={formData.lastName}
                      onChange={(e) => handleInputChange('lastName', e.target.value)}
                      className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 focus:border-sky-500 focus:outline-none"
                      required
                    />
                  </div>
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-600">Email</label>
                    <input
                      type="email"
                      value={formData.contactEmail}
                      onChange={(e) => handleInputChange('contactEmail', e.target.value)}
                      className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 focus:border-sky-500 focus:outline-none"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-600">Phone / WhatsApp</label>
                    <input
                      type="tel"
                      value={formData.contactPhone}
                      onChange={(e) => handleInputChange('contactPhone', e.target.value)}
                      className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 focus:border-sky-500 focus:outline-none"
                      required
                    />
                  </div>
                </div>
              </div>

              <div className="mt-8 space-y-4">
                <div>
                  <p className="text-xs uppercase tracking-[0.4em] text-slate-400">Step 2</p>
                  <h3 className="text-lg font-semibold text-slate-900">Activity details</h3>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-600">Preferred date</label>
                  <input
                    type="date"
                    value={formData.date}
                    onChange={(e) => handleInputChange('date', e.target.value)}
                    className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 focus:border-sky-500 focus:outline-none"
                    required
                  />
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-600">Adults</label>
                    <input
                      type="number"
                      min={1}
                      max={20}
                      value={formData.adults}
                      onChange={(e) => handleInputChange('adults', Number(e.target.value))}
                      className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 focus:border-sky-500 focus:outline-none"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-600">Children (under 12)</label>
                    <input
                      type="number"
                      min={0}
                      max={10}
                      value={formData.children}
                      onChange={(e) => handleInputChange('children', Number(e.target.value))}
                      className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 focus:border-sky-500 focus:outline-none"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-600">Pickup / meeting point</label>
                  <input
                    type="text"
                    value={formData.pickupLocation}
                    onChange={(e) => handleInputChange('pickupLocation', e.target.value)}
                    className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 focus:border-sky-500 focus:outline-none"
                    required
                  />
                  <p className="text-xs text-slate-500">
                    Standard pickup: {currentSeason.pickupPoint}. Other locations incur a transfer supplement.
                  </p>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-600">Special requests</label>
                  <textarea
                    value={formData.specialRequests}
                    onChange={(e) => handleInputChange('specialRequests', e.target.value)}
                    rows={4}
                    className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 focus:border-sky-500 focus:outline-none"
                    placeholder="Dietary preferences, child seats, motion comfort, photography goals..."
                  />
                </div>
              </div>

              <div className="mt-8 space-y-3 rounded-2xl border border-slate-200 bg-white p-5">
                <p className="text-sm font-semibold text-slate-900">Price summary</p>
                <div className="flex items-center justify-between text-sm text-slate-600">
                  <span>Adults ({formData.adults} × ${content.pricing.adultPrice})</span>
                  <span>USD {(content.pricing.adultPrice * formData.adults).toFixed(2)}</span>
                </div>
                <div className="flex items-center justify-between text-sm text-slate-600">
                  <span>Children ({formData.children} × ${content.pricing.childPrice})</span>
                  <span>USD {(content.pricing.childPrice * formData.children).toFixed(2)}</span>
                </div>
                <div className="border-t border-slate-200 pt-3">
                  <div className="flex items-center justify-between">
                    <span className="text-lg font-semibold text-slate-900">Total</span>
                    <span className="text-2xl font-bold text-sky-600">USD {totalPrice.toFixed(2)}</span>
                  </div>
                  <p className="mt-1 text-xs text-slate-500">{content.pricing.depositNote}</p>
                  <p className="text-xs text-rose-500">{content.pricing.refundPolicy}</p>
                </div>
                <p className="text-xs text-slate-500">{content.pricing.lowestPriceGuarantee}</p>
              </div>

              <button
                type="submit"
                className="mt-6 w-full rounded-2xl bg-gradient-to-r from-sky-600 to-indigo-500 py-4 text-base font-semibold text-white shadow-lg shadow-sky-200 hover:from-sky-700 hover:to-indigo-600"
              >
                Reserve whale watching seats
              </button>
            </form>

            <div className="rounded-2xl border border-slate-200 bg-white p-5 text-sm text-slate-600">
              <p className="font-semibold text-slate-900">Have booking questions?</p>
              <p className="mt-1">
                We reply in under 30 minutes via WhatsApp or phone. 24/7 concierge hotline:
              </p>
              <p className="mt-2 flex items-center gap-2 text-slate-900">
                <Phone className="h-4 w-4 text-emerald-500" />
                {content.operator.contactPhone}
              </p>
              <p className="text-xs text-slate-500">{content.operator.supportHours}</p>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
};

export default WhaleBooking;

