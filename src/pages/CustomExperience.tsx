import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { AnimatePresence, motion } from 'framer-motion';
import {
  ArrowLeft,
  ArrowRight,
  Calendar,
  CheckCircle,
  Clock,
  Compass,
  Loader2,
  Mail,
  MapPin,
  MessageCircle,
  Phone,
  Shield,
  Sparkles,
  Star,
  Users
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import {
  customExperiencePageService,
  type CustomExperiencePageContent
} from '@/services/customExperiencePageService';
import { emailService } from '@/services/emailService';
import { cachedFetch } from '@/lib/cache';

const iconMap: Record<string, React.ComponentType<any>> = {
  Compass,
  Star,
  Clock,
  MapPin,
  Users,
  Calendar,
  Sparkles,
  Shield
};

const MEAL_OPTIONS = ['Street food crawls', 'Fine dining', 'Vegan friendly', 'Halal friendly', 'Gluten free'];
const ACCOMMODATION_OPTIONS = ['Boutique Luxury', 'Tea Bungalows', 'Beach Villas', 'Family Suites', 'City Hotels'];

const DEFAULT_FORM = {
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  country: '',
  startDate: '',
  flexibleDates: true,
  groupSize: 2,
  groupType: 'couple',
  accommodation: 'Boutique Luxury',
  budgetAmount: '3500',
  budgetType: 'total',
  currency: 'USD',
  travelStyle: 'luxury',
  travelPace: 'balanced',
  celebration: '',
  preferredDestinations: '',
  interests: [] as string[],
  mealPreferences: [] as string[],
  communication: 'email',
  specialRequests: '',
  previousVisits: false,
  mobility: '',
  medical: ''
};

const paceBadges: Record<string, string> = {
  relaxed: 'Spa days + long stays',
  balanced: 'Blend of slow + active',
  fast: 'Cover more ground'
};

const CustomExperience = () => {
  const { toast } = useToast();
  const [pageContent, setPageContent] = useState<CustomExperiencePageContent | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [step, setStep] = useState(1);
  const [form, setForm] = useState(DEFAULT_FORM);
  const [customAnswers, setCustomAnswers] = useState<Record<string, string | string[]>>({});
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [bookingRef, setBookingRef] = useState('');
  const [error, setError] = useState<string | null>(null);

  const heroSlides = useMemo(
    () => pageContent?.hero.gallery || [],
    [pageContent?.hero.gallery]
  );
  const [slideIndex, setSlideIndex] = useState(0);
  const formSectionRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const load = async () => {
      try {
        const content = await cachedFetch<CustomExperiencePageContent>(
          'custom-experience-page',
          () => customExperiencePageService.getPageContent(),
          5 * 60 * 1000
        );
        setPageContent(content);
      } catch (err) {
        console.error('Failed to load custom experience content', err);
      } finally {
        setIsLoading(false);
      }
    };
    load();
  }, []);

  useEffect(() => {
    if (heroSlides.length > 0) {
      const ticker = setInterval(() => {
        setSlideIndex((prev) => (prev + 1) % heroSlides.length);
      }, 6000);
      return () => clearInterval(ticker);
    }
  }, [heroSlides.length]);

  const experienceTypes = useMemo(
    () => pageContent?.experienceTypes || [],
    [pageContent?.experienceTypes]
  );

  const benefits = useMemo(
    () => pageContent?.benefits || [],
    [pageContent?.benefits]
  );

  const testimonials = useMemo(
    () => pageContent?.testimonials || [],
    [pageContent?.testimonials]
  );

  const booking = pageContent?.booking || {
    contactPhone: '+94 777 721 999',
    whatsapp: 'https://wa.me/94777721999',
    email: 'concierge@rechargetravels.com',
    responseTime: 'Replies within 12 hours',
    conciergeNote: ''
  };

  const updateForm = (field: keyof typeof form, value: any) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const toggleInterest = (value: string) => {
    setForm((prev) => ({
      ...prev,
      interests: prev.interests.includes(value)
        ? prev.interests.filter((item) => item !== value)
        : [...prev.interests, value]
    }));
  };

  const toggleMeal = (value: string) => {
    setForm((prev) => ({
      ...prev,
      mealPreferences: prev.mealPreferences.includes(value)
        ? prev.mealPreferences.filter((item) => item !== value)
        : [...prev.mealPreferences, value]
    }));
  };

  const handleCustomQuestionChange = (id: string, value: string | string[]) => {
    setCustomAnswers((prev) => ({ ...prev, [id]: value }));
  };

  const validateStep = (targetStep: number): boolean => {
    setError(null);
    if (targetStep === 2) {
      if (!form.firstName || !form.lastName || !form.email || !form.phone || !form.country) {
        setError('Please complete your personal details.');
        return false;
      }
    }
    if (targetStep === 3) {
      if (!form.budgetAmount) {
        setError('Please include a budget estimate so we can tailor experiences.');
        return false;
      }
      if (!form.startDate && !form.flexibleDates) {
        setError('Select a start date or mark the dates as flexible.');
        return false;
      }
    }
    return true;
  };

  const goToStep = (targetStep: number) => {
    if (targetStep > step && !validateStep(targetStep)) return;
    setStep(targetStep);
  };

  const scrollToForm = () => {
    formSectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const summary = useMemo(
    () => ({
      traveler: `${form.firstName || 'Traveler'} ${form.lastName}`,
      group: `${form.groupSize} ${form.groupSize > 1 ? 'guests' : 'guest'} (${form.groupType})`,
      pace: form.travelPace,
      style: form.travelStyle,
      interests: form.interests,
      meals: form.mealPreferences,
      celebration: form.celebration || 'None listed',
      budget: `${form.currency} ${Number(form.budgetAmount || 0).toLocaleString()} ${form.budgetType === 'perPerson' ? 'per guest' : 'total'}`,
    destinations: form.preferredDestinations || "We'll recommend combinations"
    }),
    [form]
  );

  const sendConfirmationEmails = async (submissionId: string) => {
    const adminEmail = booking.email;
    const conciergeName = booking.contactPhone ? `Concierge • ${booking.contactPhone}` : 'Recharge Concierge';
    const introList = `
      <ul>
        <li>Travelers: ${summary.group}</li>
        <li>Preferred Style: ${form.travelStyle} / ${form.travelPace}</li>
        <li>Budget: ${summary.budget}</li>
        <li>Interests: ${summary.interests.join(', ') || 'Not specified'}</li>
      </ul>
    `;

    await emailService.sendEmail({
      to: form.email,
      subject: `We're designing your Sri Lanka journey (ref ${submissionId})`,
      html: `
        <p>Hi ${form.firstName},</p>
        <p>Our travel designers just received your request and are reserving the best guides, transfers, and villas that match your preferences.</p>
        ${introList}
        <p>Your concierge will reach out within 12 hours from <strong>${conciergeName}</strong>. Need anything sooner? WhatsApp ${booking.whatsapp}.</p>
        <p>— Recharge Travels</p>
      `,
      text: `Hi ${form.firstName}, our team has started building your itinerary. Concierge: ${conciergeName}.`
    });

    const adminDetails = `
      <p><strong>New custom experience request</strong></p>
      <p>Reference: ${submissionId}</p>
      <p>Name: ${form.firstName} ${form.lastName} • ${form.email} • ${form.phone}</p>
      <p>Country: ${form.country}</p>
      ${introList}
      <p>Special requests: ${form.specialRequests || 'N/A'}</p>
    `;

    await emailService.sendEmail({
      to: adminEmail,
      subject: `New custom experience lead • ${form.firstName} (${submissionId})`,
      html: adminDetails,
      text: `New lead ${form.firstName} ${form.lastName} (${form.email}). Ref ${submissionId}`
    });
  };

  const handleSubmit = async () => {
    if (!validateStep(3)) return;
    setSubmitting(true);
    setError(null);

    try {
      const payload = {
        name: `${form.firstName} ${form.lastName}`.trim(),
        email: form.email,
        phone: form.phone,
        country: form.country,
        startDate: form.startDate,
        endDate: '',
        flexibleDates: form.flexibleDates,
        groupSize: Number(form.groupSize),
        budget: {
          amount: Number(form.budgetAmount) || 0,
          currency: form.currency,
          perPerson: form.budgetType === 'perPerson'
        },
        interests: form.interests,
        experienceTypes: form.interests,
        accommodationPreference: form.accommodation,
        mealPreferences: form.mealPreferences,
        specialRequests: form.specialRequests,
        customAnswers,
        previousVisits: form.previousVisits,
        mobilityRequirements: form.mobility,
        medicalConditions: form.medical,
        travelStyle: form.travelStyle,
        travelPace: form.travelPace as 'relaxed' | 'balanced' | 'fast',
        celebration: form.celebration,
        preferredDestinations: form.preferredDestinations
          ? form.preferredDestinations
              .split(',')
              .map((dest) => dest.trim())
              .filter(Boolean)
          : [],
        communicationPreference: form.communication as 'email' | 'whatsapp' | 'phone',
        channel: 'web'
      };

      const submissionId = await customExperiencePageService.submitRequest(payload);
      setBookingRef(submissionId);
      setSubmitted(true);
      await sendConfirmationEmails(submissionId);

      toast({
        title: '✨ Request Submitted!',
        description: `Reference: ${submissionId}. Your concierge will reach out soon.`
      });
    } catch (err) {
      console.error('Custom experience submission error', err);
      setError('We could not submit your request. Please try again or WhatsApp our concierge.');
      toast({
        title: 'Submission Failed',
        description: 'Please try again or contact us via WhatsApp.',
        variant: 'destructive'
      });
    } finally {
      setSubmitting(false);
    }
  };

  const getIcon = (iconName: string) => iconMap[iconName] || Compass;

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50">
        <Loader2 className="h-12 w-12 animate-spin text-amber-600" />
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>{pageContent?.seo.title || 'Custom Sri Lanka Travel | Recharge Travels'}</title>
        <meta name="description" content={pageContent?.seo.description || ''} />
        <meta name="keywords" content={pageContent?.seo.keywords?.join(', ') || ''} />
        <meta property="og:title" content={pageContent?.seo.title} />
        <meta property="og:description" content={pageContent?.seo.description} />
        <meta property="og:image" content={pageContent?.seo.ogImage} />
        <link rel="canonical" href="https://www.rechargetravels.com/custom-experience" />
      </Helmet>

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
          <Badge className="bg-white/10 text-white backdrop-blur">{pageContent?.hero.badge}</Badge>
          <h1 className="text-4xl font-semibold leading-tight sm:text-5xl lg:text-6xl">
            {pageContent?.hero.title}
          </h1>
          <p className="max-w-3xl text-lg text-white/80">{pageContent?.hero.subtitle}</p>
          <div className="flex flex-wrap items-center justify-center gap-3 text-xs uppercase tracking-[0.4em] text-amber-200/80">
            <span>{heroSlides[slideIndex]?.tag}</span>
          </div>
          <div className="mt-4 flex flex-wrap items-center justify-center gap-3">
            {pageContent?.overview.badges.map((badge) => {
              const Icon = getIcon(badge.iconName);
              return (
                <span
                  key={badge.label}
                  className="inline-flex items-center gap-2 rounded-full border border-white/15 px-4 py-2 text-sm text-white/90 backdrop-blur"
                >
                  <Icon className="h-4 w-4 text-amber-200" />
                  {badge.label}: <strong className="font-semibold">{badge.value}</strong>
                </span>
              );
            })}
          </div>
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <Button
              size="lg"
              className="bg-amber-500 hover:bg-amber-600 px-8 py-6 text-base"
              onClick={scrollToForm}
            >
              Start planning
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-white/40 bg-white/10 px-8 py-6 text-base text-white hover:bg-white/20"
              onClick={() => window.open(booking.whatsapp, '_blank')}
            >
              <MessageCircle className="mr-2 h-4 w-4" />
              WhatsApp concierge
            </Button>
          </div>
        </div>
      </section>

      {/* Overview */}
      <section className="bg-white py-16">
        <div className="mx-auto grid max-w-6xl gap-10 px-4 md:grid-cols-[1.2fr_0.8fr]">
          <div>
            <h2 className="text-3xl font-semibold text-slate-900">How we design your trip</h2>
            <p className="mt-4 text-lg text-slate-600">{pageContent?.overview.summary}</p>
          </div>
          <div className="grid gap-4">
            {pageContent?.overview.highlights.map((highlight) => (
              <div key={highlight.label} className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <p className="text-xs uppercase tracking-[0.3em] text-slate-500">{highlight.label}</p>
                <p className="mt-2 text-sm text-slate-700">{highlight.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="bg-slate-50 py-16">
        <div className="mx-auto max-w-6xl px-4">
          <div className="mb-10 text-center">
            <p className="text-xs uppercase tracking-[0.4em] text-slate-500">Why Recharge</p>
            <h3 className="text-3xl font-semibold text-slate-900">The concierge difference</h3>
          </div>
          <div className="grid gap-6 md:grid-cols-3">
            {benefits.map((benefit) => (
              <Card key={benefit.id} className="overflow-hidden border-0 shadow-sm">
                <div className="relative h-48">
                  <img src={benefit.image} alt={benefit.title} className="h-full w-full object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 via-transparent to-transparent" />
                  <div className="absolute bottom-4 left-4 text-3xl">{benefit.icon}</div>
                </div>
                <CardContent className="p-5">
                  <h4 className="text-lg font-semibold text-slate-900">{benefit.title}</h4>
                  <p className="mt-2 text-sm text-slate-600">{benefit.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Experience Types (Interactive) */}
      <section className="bg-white py-16">
        <div className="mx-auto max-w-6xl px-4">
          <div className="mb-10 text-center">
            <p className="text-xs uppercase tracking-[0.4em] text-slate-500">Curate Your Trip</p>
            <h3 className="text-3xl font-semibold text-slate-900">Tap interests to add to your wishlist</h3>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {experienceTypes.map((exp) => (
              <button
                key={exp.id}
                type="button"
                onClick={() => toggleInterest(exp.title)}
                className={`text-left rounded-2xl border p-5 transition hover:shadow ${
                  form.interests.includes(exp.title)
                    ? 'border-amber-500 bg-amber-50'
                    : 'border-slate-200 bg-white'
                }`}
              >
                <div className="flex items-center gap-3 mb-2">
                  <span className="text-2xl">{exp.icon}</span>
                  <h4 className="font-semibold text-slate-900">{exp.title}</h4>
                </div>
                <p className="text-sm text-slate-600">{exp.description}</p>
                {form.interests.includes(exp.title) && (
                  <div className="mt-3 flex items-center text-xs text-amber-600">
                    <CheckCircle className="mr-1 h-3.5 w-3.5" /> Added to wishlist
                  </div>
                )}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Multi-Step Form */}
      <section
        ref={formSectionRef}
        className="bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 py-20 text-white"
      >
        <div className="mx-auto max-w-4xl px-4">
          <div className="mb-10 text-center">
            <Badge className="bg-white/10 text-white backdrop-blur">Concierge Intake</Badge>
            <h3 className="mt-4 text-3xl font-semibold">Tell us about your dream trip</h3>
            <p className="mt-2 text-slate-300">{booking.conciergeNote}</p>
          </div>

          <Card className="border-0 shadow-2xl bg-white text-slate-900">
            <CardContent className="p-6 md:p-10">
              {/* Step indicators */}
              <div className="flex justify-center gap-3 mb-10">
                {[1, 2, 3].map((s) => (
                  <div key={s} className="flex flex-col items-center">
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold ${
                        step >= s ? 'bg-amber-500 text-white' : 'bg-slate-200 text-slate-500'
                      }`}
                    >
                      {s}
                    </div>
                    <span className="text-xs mt-2 text-slate-500">{['You', 'Trip', 'Review'][s - 1]}</span>
                  </div>
                ))}
              </div>

              {error && (
                <div className="mb-6 rounded-xl bg-red-50 border border-red-200 text-red-600 p-3 text-sm">
                  {error}
                </div>
              )}

              <AnimatePresence mode="wait">
                {step === 1 && (
                  <motion.div
                    key="step1"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                  >
                    <h4 className="text-xl font-semibold mb-6 text-slate-800">Who's traveling?</h4>
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm font-medium text-slate-600 mb-1 block">First name *</label>
                        <Input value={form.firstName} onChange={(e) => updateForm('firstName', e.target.value)} className="rounded-xl" />
                      </div>
                      <div>
                        <label className="text-sm font-medium text-slate-600 mb-1 block">Last name *</label>
                        <Input value={form.lastName} onChange={(e) => updateForm('lastName', e.target.value)} className="rounded-xl" />
                      </div>
                      <div>
                        <label className="text-sm font-medium text-slate-600 mb-1 block">Email *</label>
                        <Input type="email" value={form.email} onChange={(e) => updateForm('email', e.target.value)} className="rounded-xl" />
                      </div>
                      <div>
                        <label className="text-sm font-medium text-slate-600 mb-1 block">Phone / WhatsApp *</label>
                        <Input value={form.phone} onChange={(e) => updateForm('phone', e.target.value)} placeholder="+1 555 123 4567" className="rounded-xl" />
                      </div>
                      <div>
                        <label className="text-sm font-medium text-slate-600 mb-1 block">Country of residence *</label>
                        <Input value={form.country} onChange={(e) => updateForm('country', e.target.value)} className="rounded-xl" />
                      </div>
                      <div>
                        <label className="text-sm font-medium text-slate-600 mb-1 block">Preferred contact</label>
                        <Select value={form.communication} onValueChange={(value) => updateForm('communication', value)}>
                          <SelectTrigger className="rounded-xl"><SelectValue placeholder="Choose channel" /></SelectTrigger>
                          <SelectContent>
                            <SelectItem value="email">Email</SelectItem>
                            <SelectItem value="whatsapp">WhatsApp</SelectItem>
                            <SelectItem value="phone">Phone call</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <div className="flex justify-end mt-8">
                      <Button onClick={() => goToStep(2)} className="bg-amber-500 hover:bg-amber-600">
                        Continue <ArrowRight className="w-4 h-4 ml-2" />
                      </Button>
                    </div>
                  </motion.div>
                )}

                {step === 2 && (
                  <motion.div
                    key="step2"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                  >
                    <h4 className="text-xl font-semibold mb-6 text-slate-800">Trip preferences</h4>
                    <div className="grid md:grid-cols-2 gap-4 mb-6">
                      <div>
                        <label className="text-sm font-medium text-slate-600 mb-1 block">Start date</label>
                        <Input type="date" value={form.startDate} onChange={(e) => updateForm('startDate', e.target.value)} disabled={form.flexibleDates} className="rounded-xl" />
                        <label className="flex items-center gap-2 text-sm text-slate-500 mt-2">
                          <Checkbox checked={form.flexibleDates} onCheckedChange={(checked) => updateForm('flexibleDates', Boolean(checked))} />
                          My dates are flexible
                        </label>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-slate-600 mb-1 block">Group size</label>
                        <Input type="number" min={1} value={form.groupSize} onChange={(e) => updateForm('groupSize', Number(e.target.value))} className="rounded-xl" />
                      </div>
                      <div>
                        <label className="text-sm font-medium text-slate-600 mb-1 block">Accommodation</label>
                        <Select value={form.accommodation} onValueChange={(value) => updateForm('accommodation', value)}>
                          <SelectTrigger className="rounded-xl"><SelectValue placeholder="Select preference" /></SelectTrigger>
                          <SelectContent>
                            {ACCOMMODATION_OPTIONS.map((option) => (
                              <SelectItem key={option} value={option}>{option}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-slate-600 mb-1 block">Budget estimate</label>
                        <div className="flex gap-2">
                          <Input value={form.budgetAmount} onChange={(e) => updateForm('budgetAmount', e.target.value.replace(/\D/g, ''))} placeholder="3500" className="rounded-xl" />
                          <Select value={form.budgetType} onValueChange={(value) => updateForm('budgetType', value)}>
                            <SelectTrigger className="w-36 rounded-xl"><SelectValue /></SelectTrigger>
                            <SelectContent>
                              <SelectItem value="total">Total trip</SelectItem>
                              <SelectItem value="perPerson">Per guest</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                    </div>

                    <div className="mb-6">
                      <label className="text-sm font-medium text-slate-600 mb-2 block">Travel pace</label>
                      <div className="flex flex-wrap gap-3">
                        {([
                          { value: 'relaxed', label: 'Slow & soulful', icon: '🕯️' },
                          { value: 'balanced', label: 'Balanced', icon: '⚖️' },
                          { value: 'fast', label: 'See it all', icon: '⚡' }
                        ] as const).map((pace) => (
                          <button
                            key={pace.value}
                            type="button"
                            onClick={() => updateForm('travelPace', pace.value)}
                            className={`px-4 py-3 rounded-2xl border text-left transition ${
                              form.travelPace === pace.value
                                ? 'border-amber-500 bg-amber-50 text-amber-600'
                                : 'border-slate-200'
                            }`}
                          >
                            <div className="text-xl">{pace.icon}</div>
                            <div className="text-sm font-semibold">{pace.label}</div>
                            <div className="text-xs text-slate-500">{paceBadges[pace.value]}</div>
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="mb-6">
                      <label className="text-sm font-medium text-slate-600 mb-2 block">Preferred destinations</label>
                      <Textarea
                        value={form.preferredDestinations}
                        onChange={(e) => updateForm('preferredDestinations', e.target.value)}
                        placeholder="Ex: Tea Country, Yala, Galle Fort..."
                        className="rounded-xl"
                      />
                    </div>

                    <div className="mb-6">
                      <label className="text-sm font-medium text-slate-600 mb-2 block">Meal preferences</label>
                      <div className="flex flex-wrap gap-3">
                        {MEAL_OPTIONS.map((option) => (
                          <label
                            key={option}
                            className={`flex items-center gap-2 px-4 py-2 rounded-full border text-sm cursor-pointer ${
                              form.mealPreferences.includes(option)
                                ? 'border-amber-500 bg-amber-50 text-amber-600'
                                : 'border-slate-200 text-slate-600'
                            }`}
                          >
                            <Checkbox checked={form.mealPreferences.includes(option)} onCheckedChange={() => toggleMeal(option)} />
                            {option}
                          </label>
                        ))}
                      </div>
                    </div>

                    {pageContent?.formConfig?.customQuestions?.length > 0 && (
                      <div className="space-y-4 mb-6">
                        {pageContent.formConfig.customQuestions.map((question) => (
                          <div key={question.id}>
                            <label className="text-sm font-medium text-slate-600 mb-1 block">
                              {question.question}
                              {question.required && <span className="text-amber-500 ml-1">*</span>}
                            </label>
                            {question.type === 'textarea' && (
                              <Textarea value={(customAnswers[question.id] as string) || ''} onChange={(e) => handleCustomQuestionChange(question.id, e.target.value)} className="rounded-xl" />
                            )}
                            {question.type === 'text' && (
                              <Input value={(customAnswers[question.id] as string) || ''} onChange={(e) => handleCustomQuestionChange(question.id, e.target.value)} className="rounded-xl" />
                            )}
                            {question.type === 'select' && (
                              <Select value={(customAnswers[question.id] as string) || ''} onValueChange={(value) => handleCustomQuestionChange(question.id, value)}>
                                <SelectTrigger className="rounded-xl"><SelectValue placeholder="Choose" /></SelectTrigger>
                                <SelectContent>
                                  {question.options?.map((option) => (
                                    <SelectItem key={option} value={option}>{option}</SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            )}
                          </div>
                        ))}
                      </div>
                    )}

                    <div className="flex justify-between mt-8">
                      <Button variant="outline" onClick={() => goToStep(1)}>
                        <ArrowLeft className="w-4 h-4 mr-2" /> Back
                      </Button>
                      <Button onClick={() => goToStep(3)} className="bg-amber-500 hover:bg-amber-600">
                        Continue <ArrowRight className="w-4 h-4 ml-2" />
                      </Button>
                    </div>
                  </motion.div>
                )}

                {step === 3 && (
                  <motion.div
                    key="step3"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                  >
                    <h4 className="text-xl font-semibold mb-6 text-slate-800">Review & share details</h4>
                    <div className="grid md:grid-cols-[2fr_1fr] gap-6">
                      <div className="space-y-4">
                        <div>
                          <label className="text-sm font-medium text-slate-600 mb-1 block">Is this trip celebrating something?</label>
                          <Input value={form.celebration} onChange={(e) => updateForm('celebration', e.target.value)} placeholder="Anniversary, honeymoon, milestone..." className="rounded-xl" />
                        </div>
                        <div>
                          <label className="text-sm font-medium text-slate-600 mb-1 block">Special requests</label>
                          <Textarea value={form.specialRequests} onChange={(e) => updateForm('specialRequests', e.target.value)} rows={4} placeholder="Tell us about dream experiences, must-eat dishes, or things to avoid." className="rounded-xl" />
                        </div>
                        <div className="grid md:grid-cols-2 gap-4">
                          <div>
                            <label className="text-sm font-medium text-slate-600 mb-1 block">Been to Sri Lanka before?</label>
                            <Select value={form.previousVisits ? 'yes' : 'no'} onValueChange={(value) => updateForm('previousVisits', value === 'yes')}>
                              <SelectTrigger className="rounded-xl"><SelectValue /></SelectTrigger>
                              <SelectContent>
                                <SelectItem value="no">Not yet</SelectItem>
                                <SelectItem value="yes">Yes, returning</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          <div>
                            <label className="text-sm font-medium text-slate-600 mb-1 block">Mobility or medical notes</label>
                            <Input value={form.mobility} onChange={(e) => updateForm('mobility', e.target.value)} placeholder="Wheelchair access, allergies..." className="rounded-xl" />
                          </div>
                        </div>
                      </div>

                      <Card className="border border-amber-100 bg-amber-50/80">
                        <CardContent className="p-4 space-y-3">
                          <div className="flex items-center gap-2 text-amber-700 font-semibold">
                            <Sparkles className="w-4 h-4" />
                            Trip snapshot
                          </div>
                          <div className="space-y-2 text-sm">
                            <div className="flex justify-between"><span className="text-slate-500">Group</span><span className="font-medium">{summary.group}</span></div>
                            <div className="flex justify-between"><span className="text-slate-500">Budget</span><span className="font-medium">{summary.budget}</span></div>
                            <div className="flex justify-between"><span className="text-slate-500">Pace</span><span className="font-medium capitalize">{summary.pace}</span></div>
                            <div className="flex justify-between"><span className="text-slate-500">Style</span><span className="font-medium capitalize">{summary.style}</span></div>
                            <div>
                              <div className="text-slate-500 mb-1">Interests</div>
                              <div className="flex flex-wrap gap-1">
                                {summary.interests.length > 0 ? summary.interests.map((interest) => <Badge key={interest} variant="outline" className="text-xs">{interest}</Badge>) : <span className="text-slate-400">We'll suggest ideas</span>}
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </div>

                    <div className="flex justify-between mt-8">
                      <Button variant="outline" onClick={() => goToStep(2)}>
                        <ArrowLeft className="w-4 h-4 mr-2" /> Back
                      </Button>
                      <Button onClick={handleSubmit} disabled={submitting} className="bg-amber-500 hover:bg-amber-600 px-8">
                        {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <>Submit request <ArrowRight className="w-4 h-4 ml-2" /></>}
                      </Button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {submitted && (
                <div className="mt-8 rounded-2xl border border-green-200 bg-green-50 p-6 space-y-3">
                  <div className="flex items-center gap-3 text-green-700">
                    <CheckCircle className="w-5 h-5" />
                    <div>
                      <p className="font-semibold">We're on it!</p>
                      <p className="text-sm text-green-600">Reference ID <strong>{bookingRef}</strong>. Your concierge will WhatsApp or email soon.</p>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <Button variant="outline" onClick={() => window.open(booking.whatsapp, '_blank')}>
                      <MessageCircle className="w-4 h-4 mr-2" />WhatsApp Concierge
                    </Button>
                    <Button variant="outline" onClick={() => window.open(`mailto:${booking.email}`)}>
                      <Mail className="w-4 h-4 mr-2" />Email Concierge
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Testimonials */}
      <section className="bg-white py-16">
        <div className="mx-auto max-w-6xl px-4">
          <div className="mb-10 text-center">
            <p className="text-xs uppercase tracking-[0.4em] text-slate-500">Guest Stories</p>
            <h3 className="text-3xl font-semibold text-slate-900">Recently designed journeys</h3>
          </div>
          <div className="grid gap-6 md:grid-cols-3">
            {testimonials.map((testimonial) => (
              <Card key={testimonial.id} className="border-0 shadow">
                <CardContent className="p-6 space-y-4">
                  <div className="flex items-center gap-3">
                    <img src={testimonial.avatar} alt={testimonial.name} className="w-12 h-12 rounded-full object-cover" />
                    <div>
                      <div className="font-semibold">{testimonial.name}</div>
                      <div className="text-sm text-slate-500">{testimonial.location}</div>
                    </div>
                    <div className="ml-auto flex text-amber-500">
                      {Array.from({ length: testimonial.rating }).map((_, idx) => (
                        <Star key={idx} className="w-4 h-4 fill-current" />
                      ))}
                    </div>
                  </div>
                  {testimonial.tripType && <Badge variant="outline" className="text-xs">{testimonial.tripType}</Badge>}
                  <p className="text-slate-600">{testimonial.text}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Concierge contact */}
      <section className="bg-slate-950 px-4 py-12 text-white">
        <div className="mx-auto grid max-w-6xl gap-6 md:grid-cols-3">
          <a
            href={booking.whatsapp}
            target="_blank"
            rel="noopener noreferrer"
            className="flex flex-col items-center rounded-3xl border border-white/10 bg-white/5 p-6 text-center transition hover:border-amber-300/60 hover:bg-white/10"
          >
            <svg className="h-9 w-9 text-amber-400" viewBox="0 0 24 24" fill="currentColor">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347" />
              <path d="M11.999 2c-5.511 0-10 4.489-10 10 0 1.77.465 3.494 1.347 5.009L2 22l5.154-1.349A10 10 0 1 0 12 2Zm0 18c-1.64 0-3.228-.438-4.626-1.267l-.33-.195-3.053.8.82-2.991-.199-.316A7.98 7.98 0 0 1 4 12c0-4.411 3.589-8 8-8s8 3.589 8 8-3.589 8-8 8Z" />
            </svg>
            <p className="mt-4 text-sm uppercase tracking-[0.3em] text-amber-200/80">WhatsApp</p>
            <p className="mt-2 text-lg font-semibold">{booking.contactPhone}</p>
            <p className="text-sm text-slate-300">Tap to open concierge chat</p>
          </a>
          <div className="flex flex-col items-center rounded-3xl border border-white/10 bg-white/5 p-6 text-center">
            <Mail className="h-9 w-9 text-amber-300" />
            <p className="mt-4 text-sm uppercase tracking-[0.3em] text-amber-200/80">Email</p>
            <p className="mt-2 text-lg font-semibold">{booking.email}</p>
            <p className="text-sm text-slate-300">{booking.responseTime}</p>
          </div>
          <div className="flex flex-col items-center rounded-3xl border border-white/10 bg-white/5 p-6 text-center">
            <Phone className="h-9 w-9 text-orange-300" />
            <p className="mt-4 text-sm uppercase tracking-[0.3em] text-orange-200/80">Hotline</p>
            <p className="mt-2 text-lg font-semibold">{booking.contactPhone}</p>
            <p className="text-sm text-slate-300">Global support 6 AM – 10 PM (GMT+5:30)</p>
          </div>
        </div>
      </section>
    </>
  );
};

export default CustomExperience;
