import React, { useRef, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Crown, Plane, Anchor, Mountain, MapPin, Phone, Mail, ArrowRight, Shield, Clock, Users, Sparkles, Star, Compass, Gem, Quote, Lock, CheckCircle2, Calendar, Globe, Sunrise, Sunset, Moon } from 'lucide-react';
import { db } from '@/lib/firebase';
import { collection, addDoc, Timestamp } from 'firebase/firestore';
import { toast } from 'sonner';
import DreamHero from './DreamHero';

// NUCLEAR OPTION: Force EVERYTHING to be visible - NO ANIMATIONS WHATSOEVER
const heroStyles = `
  /* GLOBAL: Kill EVERY animation on this entire page */
  .dream-page-no-animation,
  .dream-page-no-animation *,
  .dream-page-no-animation *::before,
  .dream-page-no-animation *::after,
  .dream-page-no-animation h1,
  .dream-page-no-animation h2,
  .dream-page-no-animation h3,
  .dream-page-no-animation p,
  .dream-page-no-animation div,
  .dream-page-no-animation span,
  .dream-page-no-animation button,
  .dream-page-no-animation section {
    opacity: 1 !important;
    transform: none !important;
    visibility: visible !important;
    animation: none !important;
    animation-delay: 0s !important;
    animation-duration: 0s !important;
    animation-play-state: paused !important;
    transition: none !important;
    transition-delay: 0s !important;
    transition-duration: 0s !important;
    will-change: auto !important;
  }
  
  /* Specifically kill fade-in and fade-in-up classes that might be applied */
  .fade-in,
  .fade-in-up,
  .animate-fade-in,
  .animate-fade-up {
    opacity: 1 !important;
    transform: none !important;
    animation: none !important;
  }
  
  /* Force hero section and ALL descendants to be 100% visible */
  .dream-hero-content,
  .dream-hero-content *,
  .dream-hero-content h1,
  .dream-hero-content h2,
  .dream-hero-content p,
  .dream-hero-content div,
  .dream-hero-content button,
  .dream-hero-content span,
  .dream-hero-content a {
    opacity: 1 !important;
    visibility: visible !important;
    display: inherit !important;
    pointer-events: auto !important;
    transform: none !important;
    animation: none !important;
    transition: none !important;
  }
  
  /* Specifically target hero text classes */
  .hero-title,
  .hero-subtitle,
  .hero-description {
    opacity: 1 !important;
    visibility: visible !important;
    display: block !important;
    color: white !important;
    transform: none !important;
    animation: none !important;
    transition: none !important;
  }
  
  /* Override ANY inline styles */
  [style*="opacity: 0"],
  [style*="opacity:0"],
  [style*="display: none"],
  [style*="display:none"],
  [style*="visibility: hidden"],
  [style*="visibility:hidden"] {
    opacity: 1 !important;
    visibility: visible !important;
    display: inherit !important;
  }
  
  /* Override Framer Motion or any JS-injected styles */
  [data-framer-motion],
  [data-motion] {
    opacity: 1 !important;
    transform: none !important;
    animation: none !important;
  }
`;

// Signature Journeys - each one is a masterpiece
type CMSJourney = {
  id?: string;
  name: string;
  image?: string;
  description: string;
  features?: string[];
  pricePerDay?: string;
  passengers?: number;
  sortOrder?: number;
  duration?: string;
  route?: string;
  highlights?: string[];
  tagline?: string;
  inclusions?: string[];
  guests?: string;
  startingFrom?: string;
};

const signatureJourneys: CMSJourney[] = [
  {
    id: 'ceylon-awakening',
    name: 'The Ceylon Awakening',
    duration: '5 Days',
    tagline: 'From ancient kingdoms to infinite horizons',
    description: 'Begin at sunrise atop Sigiriya by private helicopter. Descend to a breakfast prepared by a Michelin-starred chef amidst 5th-century ruins. Journey through the Cultural Triangle by vintage Rolls-Royce, with private access to temples closed to the public. Conclude on your private yacht, watching blue whales breach as the sun sets over the Indian Ocean.',
    highlights: [
      'Private helicopter to Sigiriya at sunrise - no other visitors',
      'Breakfast cooked by visiting Michelin chef in ancient palace ruins',
      'Private blessing ceremony at Temple of the Tooth by head monk',
      'Vintage Rolls-Royce Phantom convoy through tea country',
      'Your own 120ft yacht for 2-day whale watching expedition',
      'Private island dinner prepared by Sri Lanka\'s top culinary team'
    ],
    inclusions: ['Private helicopter transfers', 'Superyacht charter', 'Michelin chef throughout', '24/7 concierge & security', 'All exclusive access fees'],
    image: 'https://images.unsplash.com/photo-1596402184320-417e7178b2cd?w=1600&q=90',
    guests: '2-6',
    startingFrom: 'Upon Request'
  },
  {
    id: 'leopard-kingdom',
    name: 'The Leopard Kingdom',
    duration: '4 Days',
    tagline: 'Where the wild reveals its secrets',
    description: 'An unprecedented wildlife immersion. Your private bush camp is erected deep within Wilpattu - the only guests in 130,000 hectares. Track leopards with Sri Lanka\'s most renowned wildlife photographer as your personal guide. Dine under constellations unseen in the modern world. Depart by helicopter as elephants gather at dawn waterholes below.',
    highlights: [
      'Exclusive-use private camp in Wilpattu - no other humans for 50km',
      'Personal wildlife photographer & former park warden as guide',
      'Thermal imaging night safaris for nocturnal predator tracking',
      'Bush dinner prepared by private chef under the Milky Way',
      'Helicopter departure with aerial wildlife spotting',
      'Donation to leopard conservation in your name'
    ],
    inclusions: ['Private camp setup & breakdown', 'Safari vehicles & expert guides', 'Helicopter transfers', 'Gourmet bush cuisine', 'Conservation contribution'],
    image: 'https://images.unsplash.com/photo-1549366021-9f761d450615?w=1600&q=90',
    guests: '2-4',
    startingFrom: 'Upon Request'
  },
  {
    id: 'tea-silk-spice',
    name: 'The Tea, Silk & Spice Route',
    duration: '6 Days',
    tagline: 'Retracing the path of emperors',
    description: 'Journey along the ancient trade routes that brought emperors to Ceylon. Begin in Colombo\'s colonial quarters with a private historian. Ascend to mist-wrapped tea estates where you\'ll blend your own private reserve. Visit silk weavers whose families have served royalty for twelve generations. Conclude in Galle Fort with a spice-infused feast in a 400-year-old Dutch mansion.',
    highlights: [
      'Private curator-led tour of Colombo\'s hidden colonial treasures',
      'Your own tea blend created at an 1890 estate - 100kg shipped home',
      'Meet the weaver whose family dressed Sri Lankan kings',
      'Cooking with spices harvested that morning from secret gardens',
      'Private dinner in a UNESCO-listed Dutch mansion',
      'Helicopter transfer over Nine Arch Bridge at golden hour'
    ],
    inclusions: ['Heritage access permits', 'Master artisan sessions', '100kg personal tea blend shipped', 'Colonial mansion accommodation', 'Private historian throughout'],
    image: 'https://images.unsplash.com/photo-1582719508461-905c673771fd?w=1600&q=90',
    guests: '2-8',
    startingFrom: 'Upon Request'
  },
  {
    id: 'ocean-odyssey',
    name: 'The Ocean Odyssey',
    duration: '7 Days',
    tagline: 'Where the sea meets the soul',
    description: 'A maritime journey of discovery. Your 150ft expedition yacht becomes home as you explore Sri Lanka\'s untouched coastline. Dive pristine reefs with marine biologists. Surface to find lunch prepared by your onboard chef. Anchor at uninhabited islands. Watch blue whales - the largest creatures ever to exist - breach within meters of your vessel.',
    highlights: [
      '150ft expedition yacht exclusively yours for 7 days',
      'Marine biologist & underwater photographer aboard',
      'Diving at sites never before explored',
      'Private island picnics on uninhabited atolls',
      'Blue whale encounters with research team',
      'Sunset champagne on deck as dolphins ride your bow wave'
    ],
    inclusions: ['Expedition yacht & crew', 'Marine research team', 'Full diving equipment & instruction', 'Gourmet cuisine & premium beverages', 'Helicopter embarkation option'],
    image: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=1600&q=90',
    guests: '2-6',
    startingFrom: 'Upon Request'
  }
];

const testimonials = [
  { text: 'They made the impossible possible. Every detail was beyond our imagination.', attribution: 'Private Client, UAE', context: 'Multi-generational family celebration' },
  { text: 'Absolute discretion, flawless execution. We will return.', attribution: 'European Industrialist', context: 'Anniversary journey' },
  { text: 'The access they arranged simply doesn\'t exist elsewhere.', attribution: 'Private Office, Singapore', context: 'Cultural immersion program' }
];

const AnimatedSection = ({ children, className = '' }: { children: React.ReactNode; className?: string }) => (
  <div className={className}>{children}</div>
);

const DreamJourneys = () => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', preferredDates: '', guests: '', interests: '', requirements: '' });
  const journeys: CMSJourney[] = signatureJourneys;
  const heroRef = useRef<HTMLDivElement>(null);
  const heroImageUrl = 'https://images.unsplash.com/photo-1596402184320-417e7178b2cd?w=1920&q=85&auto=format&fit=crop';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await addDoc(collection(db, 'dreamJourneyInquiries'), {
        ...formData,
        type: 'dream-journey',
        createdAt: Timestamp.now(),
        status: 'new',
        priority: 'vip'
      });
      toast.success('Your inquiry has been received. Our private travel director will contact you within 24 hours.', { duration: 6000 });
      setFormData({ name: '', email: '', phone: '', preferredDates: '', guests: '', interests: '', requirements: '' });
    } catch (error) {
      toast.error('Please contact us directly at luxury@rechargetravels.com');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="dream-page-no-animation">
      <Helmet>
        <title>Dream Journeys | Ultra-Luxury Multi-Day Experiences | Recharge Travels</title>
        <meta name="description" content="Bespoke multi-day journeys combining private helicopters, superyachts, and exclusive access. For discerning travelers who expect the extraordinary." />
      </Helmet>

      <Header />
      <main className="min-h-screen bg-[#030303] text-white overflow-x-hidden">

        {/* NEW STABLE HERO SECTION */}
        <DreamHero />

        {/* PHILOSOPHY */}
        <section className="py-24 bg-[#050505] text-white">
          <div className="container mx-auto px-4 max-w-6xl">
            <div className="max-w-4xl mx-auto text-center mb-16">
              <div className="text-amber-300/70 text-[11px] tracking-[0.35em] uppercase mb-6">Our Philosophy</div>
              <h2 className="text-3xl md:text-5xl font-extralight leading-relaxed mb-6">
                We don&apos;t offer tours.<br />
                <span className="text-amber-200">We orchestrate transformations.</span>
              </h2>
              <p className="text-gray-300 font-light text-lg leading-relaxed">
                Every Dream Journey is conceived, designed, and executed for you alone. We combine assets that have never been combined, arrange access that has never been granted, and create moments that exist nowhere else on earth.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {[
                { icon: Compass, title: 'Unprecedented Access', desc: 'Temples opened at dawn. Museums after hours. Experiences money alone cannot buy.' },
                { icon: Shield, title: 'Absolute Discretion', desc: 'Your privacy is sacred. No social media. No press. Just you and the extraordinary.' },
                { icon: Sparkles, title: 'Invisible Perfection', desc: 'Every detail anticipated. Every moment seamless. Nothing but wonder.' }
              ].map((item) => (
                <div key={item.title} className="text-center p-8 border border-white/10 bg-white/5 backdrop-blur-sm">
                  <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-amber-300/10 flex items-center justify-center border border-amber-300/20">
                    <item.icon className="w-7 h-7 text-amber-300/80" />
                  </div>
                  <h3 className="text-lg font-light text-white mb-3">{item.title}</h3>
                  <p className="text-sm text-gray-300 font-light leading-relaxed">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* SIGNATURE JOURNEYS */}
        <section id="journeys" className="py-32 bg-[#030303]">
          <div className="container mx-auto px-4">
            <AnimatedSection className="text-center mb-20">
              <div className="text-amber-400/60 text-xs tracking-[0.4em] uppercase mb-6">Signature Journeys</div>
              <h2 className="text-4xl md:text-5xl font-extralight tracking-tight">
                Four Paths to the <span className="text-amber-200">Extraordinary</span>
              </h2>
            </AnimatedSection>

            <div className="space-y-32">
              {journeys.map((journey, idx) => (
                <AnimatedSection key={journey.id}>
                  <div className={`flex flex-col ${idx % 2 === 1 ? 'lg:flex-row-reverse' : 'lg:flex-row'} gap-12 items-center`}>
                    {/* Image */}
                    <div className="lg:w-1/2 relative">
                      <div className="aspect-[4/3] overflow-hidden">
                        <img src={journey.image || 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&w=1600&q=90'} alt={journey.name} className="w-full h-full object-cover" />
                      </div>
                      <div className="absolute top-6 left-6 bg-black/60 backdrop-blur-sm px-4 py-2">
                        <div className="text-amber-400 text-xs tracking-[0.2em] uppercase">
                          {(journey.duration || journey.pricePerDay || 'Bespoke Journey')}
                          {journey.passengers ? ` • ${journey.passengers} Guests` : ''}
                        </div>
                      </div>
                    </div>

                    {/* Content */}
                    <div className="lg:w-1/2">
                      <div className="text-amber-400/60 text-xs tracking-[0.3em] uppercase mb-4">
                        {journey.tagline || journey.pricePerDay || 'Exclusive Access'}
                      </div>
                      <h3 className="text-3xl md:text-4xl font-extralight text-white mb-6">{journey.name}</h3>
                      <p className="text-gray-400 font-light leading-relaxed mb-8">{journey.description}</p>

                      <div className="space-y-3 mb-8">
                        {(journey.highlights || journey.features || []).slice(0, 4).map((highlight, i) => (
                          <div key={i} className="flex items-start gap-3">
                            <CheckCircle2 className="w-4 h-4 text-amber-400/60 mt-1 flex-shrink-0" />
                            <span className="text-sm text-gray-500 font-light">{highlight}</span>
                          </div>
                        ))}
                      </div>

                      <div className="flex items-center gap-6">
                        <Button className="bg-transparent border border-amber-400/30 text-amber-200 hover:bg-amber-400/10 rounded-none px-8 py-6 text-xs tracking-[0.2em] uppercase" onClick={() => document.getElementById('inquiry')?.scrollIntoView({ behavior: 'smooth' })}>
                          Request This Journey
                        </Button>
                        <div className="text-xs text-gray-600 uppercase tracking-wider">{journey.pricePerDay || 'Pricing upon consultation'}</div>
                      </div>
                    </div>
                  </div>
                </AnimatedSection>
              ))}
            </div>
          </div>
        </section>

        {/* TESTIMONIALS */}
        <section className="py-32 bg-gradient-to-b from-[#030303] via-[#080604] to-[#030303]">
          <div className="container mx-auto px-4">
            <AnimatedSection className="text-center mb-16">
              <div className="text-amber-400/60 text-xs tracking-[0.4em] uppercase mb-6">Client Reflections</div>
              <h2 className="text-3xl md:text-4xl font-extralight">In Their Words</h2>
            </AnimatedSection>
            <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
              {testimonials.map((t, idx) => (
                <div key={idx} className="p-8 border border-white/5 bg-white/[0.01] relative">
                  <Quote className="absolute top-6 right-6 w-8 h-8 text-amber-400/10" />
                  <p className="text-gray-300 font-light italic mb-6 leading-relaxed">"{t.text}"</p>
                  <div className="text-xs text-amber-400/60 uppercase tracking-wider mb-1">{t.attribution}</div>
                  <div className="text-xs text-gray-600">{t.context}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* BESPOKE INQUIRY */}
        <section id="inquiry" className="py-32 bg-[#030303] relative">
          <div className="absolute inset-0 opacity-30">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-amber-900/20 rounded-full blur-[150px]" />
          </div>
          <div className="container mx-auto px-4 relative z-10">
            <div className="max-w-3xl mx-auto">
              <AnimatedSection className="text-center mb-16">
                <div className="text-amber-400/60 text-xs tracking-[0.4em] uppercase mb-6">Begin Your Journey</div>
                <h2 className="text-3xl md:text-5xl font-extralight mb-6">Private <span className="text-amber-200">Consultation</span></h2>
                <p className="text-gray-500 font-light">Share your vision. Our private travel director will craft a journey that exists for you alone.</p>
              </AnimatedSection>

              <form onSubmit={handleSubmit} className="space-y-6 bg-white/[0.02] border border-white/5 p-8 md:p-12">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-xs text-gray-500 uppercase tracking-wider mb-2">Full Name</label>
                    <Input required value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} placeholder="As you wish to be addressed" className="bg-transparent border-white/10 text-white rounded-none h-12 focus:border-amber-400/30" />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-500 uppercase tracking-wider mb-2">Email</label>
                    <Input required type="email" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} placeholder="your@email.com" className="bg-transparent border-white/10 text-white rounded-none h-12 focus:border-amber-400/30" />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-500 uppercase tracking-wider mb-2">Phone</label>
                    <Input required value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} placeholder="Including country code" className="bg-transparent border-white/10 text-white rounded-none h-12 focus:border-amber-400/30" />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-500 uppercase tracking-wider mb-2">Preferred Travel Dates</label>
                    <Input value={formData.preferredDates} onChange={(e) => setFormData({ ...formData, preferredDates: e.target.value })} placeholder="Flexible or specific" className="bg-transparent border-white/10 text-white rounded-none h-12 focus:border-amber-400/30" />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-500 uppercase tracking-wider mb-2">Number of Guests</label>
                    <Input value={formData.guests} onChange={(e) => setFormData({ ...formData, guests: e.target.value })} placeholder="Adults and children" className="bg-transparent border-white/10 text-white rounded-none h-12 focus:border-amber-400/30" />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-500 uppercase tracking-wider mb-2">Interests</label>
                    <Input value={formData.interests} onChange={(e) => setFormData({ ...formData, interests: e.target.value })} placeholder="Wildlife, culture, ocean, adventure..." className="bg-transparent border-white/10 text-white rounded-none h-12 focus:border-amber-400/30" />
                  </div>
                </div>
                <div>
                  <label className="block text-xs text-gray-500 uppercase tracking-wider mb-2">Special Requirements</label>
                  <Textarea value={formData.requirements} onChange={(e) => setFormData({ ...formData, requirements: e.target.value })} placeholder="Dietary, accessibility, privacy level, security needs, any specific requests..." rows={4} className="bg-transparent border-white/10 text-white rounded-none focus:border-amber-400/30" />
                </div>
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4">
                  <div className="flex items-center gap-2 text-xs text-gray-600">
                    <Lock className="w-4 h-4" />
                    <span>All inquiries are confidential</span>
                  </div>
                  <Button type="submit" disabled={loading} className="bg-amber-400/10 border border-amber-400/30 text-amber-200 hover:bg-amber-400/20 rounded-none px-10 py-6 text-xs tracking-[0.2em] uppercase">
                    {loading ? 'Submitting...' : 'Request Consultation'}
                  </Button>
                </div>
              </form>
            </div>
          </div>
        </section>

        {/* CONTACT */}
        <section className="py-16 bg-[#050403] border-t border-white/5">
          <div className="container mx-auto px-4">
            <div className="flex flex-col md:flex-row items-center justify-between gap-8">
              <div className="text-center md:text-left">
                <div className="text-xs text-amber-400/60 uppercase tracking-[0.3em] mb-2">Direct Line</div>
                <p className="text-gray-500 text-sm">For immediate assistance or existing clients</p>
              </div>
              <div className="flex flex-wrap justify-center gap-6">
                <a href="https://wa.me/94777721999?text=I'm%20interested%20in%20a%20Dream%20Journey%20consultation" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 text-gray-400 hover:text-white transition-colors">
                  <span className="text-sm">WhatsApp</span>
                </a>
                <a href="tel:+94777721999" className="flex items-center gap-3 text-gray-400 hover:text-white transition-colors">
                  <Phone className="w-4 h-4" />
                  <span className="text-sm">+94 777 721 999</span>
                </a>
                <a href="mailto:luxury@rechargetravels.com" className="flex items-center gap-3 text-gray-400 hover:text-white transition-colors">
                  <Mail className="w-4 h-4" />
                  <span className="text-sm">luxury@rechargetravels.com</span>
                </a>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default DreamJourneys;
