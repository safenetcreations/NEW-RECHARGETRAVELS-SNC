import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MapPin, Plane, Train, Car, Bus, Send, Phone, Mail } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import SEOHead from '@/components/cms/SEOHead';
import { Button } from '@/components/ui/button';
import TransferBookingForm from '@/modules/transfers/components/TransferBookingForm';
import PrivateTourBookingForm from '@/components/booking/PrivateTourBookingForm';
import GroupTransportBookingForm from '@/components/booking/GroupTransportBookingForm';
import TrainBookingForm from '@/components/booking/TrainBookingForm';
import { getBookNowHeroSlides, DEFAULT_BOOK_NOW_SLIDES, type BookNowHeroSlide } from '@/services/bookNowHeroService';

const BookNow = () => {
  const [heroSlides, setHeroSlides] = useState<BookNowHeroSlide[]>(DEFAULT_BOOK_NOW_SLIDES.slice(1, 6));
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);

  // Use the first available slide (skip the first per prior request) as a static hero background
  useEffect(() => {
    const loadHero = async () => {
      try {
        const slides = await getBookNowHeroSlides();
        const valid = (slides || []).filter(s => s.image && s.image.trim() !== '');
        const cleaned = (valid.length > 0 ? valid : DEFAULT_BOOK_NOW_SLIDES).slice(1); // drop broken first image
        const limited = cleaned.slice(0, 5);
        if (limited.length > 0) {
          setHeroSlides(limited);
          setCurrentSlideIndex(Math.floor(Math.random() * limited.length));
        }
      } catch (err) {
        console.error('Failed to load hero image', err);
      }
    };
    loadHero();
  }, []);

  // Auto-slide hero images
  useEffect(() => {
    if (heroSlides.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentSlideIndex((prev) => (prev + 1) % heroSlides.length);
    }, 6000);
    return () => clearInterval(interval);
  }, [heroSlides.length]);

  const scrollToEngine = () => {
    const el = document.getElementById('booking-engine');
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <div className="min-h-screen bg-white text-slate-900">
      <SEOHead
        title="Book Now | Tours, Transfers, Trains & Rentals | Recharge Travels"
        description="Instantly book Sri Lanka tours, airport transfers, train tickets, and vehicle rentals. Licensed operator, 24/7 concierge, and quick confirmations."
        canonicalUrl="https://rechargetravels.com/book-now"
      />

      <div className="sticky top-0 z-50 bg-white/90 backdrop-blur shadow-sm">
        <Header />
      </div>

      {/* Hero with carousel */}
      <section className="relative min-h-[60vh] flex items-center overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentSlideIndex}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8 }}
            className="absolute inset-0"
          >
            {heroSlides[currentSlideIndex]?.image && (
              <img
                src={heroSlides[currentSlideIndex].image}
                alt={heroSlides[currentSlideIndex].title || 'Sri Lanka'}
                className="w-full h-full object-cover"
              />
            )}
            <div className="absolute inset-0 bg-gradient-to-br from-slate-900/80 via-slate-900/60 to-emerald-900/70" />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-slate-900/40" />
          </motion.div>
        </AnimatePresence>

        {heroSlides.length > 1 && (
          <>
            <button
              onClick={() => setCurrentSlideIndex((prev) => (prev - 1 + heroSlides.length) % heroSlides.length)}
              className="absolute left-4 md:left-8 z-20 p-2 rounded-full bg-white/80 hover:bg-white shadow-lg transition-all"
              aria-label="Previous slide"
            >
              <span className="text-lg font-bold text-slate-700">&#8249;</span>
            </button>
            <button
              onClick={() => setCurrentSlideIndex((prev) => (prev + 1) % heroSlides.length)}
              className="absolute right-4 md:right-8 z-20 p-2 rounded-full bg-white/80 hover:bg-white shadow-lg transition-all"
              aria-label="Next slide"
            >
              <span className="text-lg font-bold text-slate-700">&#8250;</span>
            </button>
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 flex gap-2">
              {heroSlides.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentSlideIndex(i)}
                  className={`h-2 w-2 rounded-full transition-all ${i === currentSlideIndex ? 'bg-emerald-500 w-6' : 'bg-white/70 hover:bg-white'}`}
                  aria-label={`Go to slide ${i + 1}`}
                />
              ))}
            </div>
          </>
        )}

        <div className="relative z-10 container mx-auto px-4 py-12 md:py-16">
          <div className="max-w-4xl space-y-5 text-white">
            <div className="inline-flex items-center gap-2 bg-emerald-500/15 border border-emerald-400/30 px-4 py-2 rounded-full text-sm">
              <MapPin className="w-4 h-4" />
              Licensed operator • Instant confirmations • 24/7 WhatsApp
            </div>
            <h1 className="text-4xl md:text-5xl font-bold leading-tight">
              Book Tours, Transfers, Trains & Rentals
              <span className="text-emerald-300"> in One Place</span>
            </h1>
            <p className="text-lg text-slate-200 max-w-3xl">
              Use the booking engine below to reserve airport transfers, private tours, trains, or vehicles. Everything routes to our concierge for fast WhatsApp confirmation.
            </p>
            <div className="flex flex-wrap gap-3">
              <Button
                size="lg"
                className="bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white shadow-lg"
                onClick={scrollToEngine}
              >
                <Send className="w-4 h-4 mr-2" />
                Start Booking
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="bg-white/10 text-white border-white/40 hover:bg-white/20"
                onClick={scrollToEngine}
              >
                View Booking Engine
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Booking Engine */}
      <section id="booking-engine" className="bg-white py-12 md:py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto space-y-4 text-center">
            <p className="text-sm text-emerald-600 font-semibold uppercase tracking-wide">All-in-one Booking</p>
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900">Select a Service & Book Instantly</h2>
            <p className="text-slate-600 max-w-2xl mx-auto">
              Choose a category below. Each tab loads the existing booking engine for that service—no extra steps needed.
            </p>
          </div>

          <div className="mt-8 bg-white border border-slate-200 shadow-xl rounded-2xl p-4 md:p-6">
            <Tabs defaultValue="transfers" className="w-full">
              <TabsList className="grid grid-cols-2 md:grid-cols-4 gap-2 mb-6">
                <TabsTrigger value="transfers" className="flex items-center gap-2">
                  <Plane className="w-4 h-4" /> Airport Transfers
                </TabsTrigger>
                <TabsTrigger value="tours" className="flex items-center gap-2">
                  <Car className="w-4 h-4" /> Private Tours
                </TabsTrigger>
                <TabsTrigger value="group" className="flex items-center gap-2">
                  <Bus className="w-4 h-4" /> Group Transport
                </TabsTrigger>
                <TabsTrigger value="train" className="flex items-center gap-2">
                  <Train className="w-4 h-4" /> Train Bookings
                </TabsTrigger>
              </TabsList>

              <TabsContent value="transfers">
                <TransferBookingForm />
              </TabsContent>
              <TabsContent value="tours">
                <PrivateTourBookingForm />
              </TabsContent>
              <TabsContent value="group">
                <GroupTransportBookingForm />
              </TabsContent>
              <TabsContent value="train">
                <TrainBookingForm />
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </section>

      {/* Contact + Footer */}
      <section className="bg-slate-50 py-10">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="rounded-2xl bg-white border border-slate-200 p-5 flex items-center gap-3 shadow-sm">
              <div className="w-12 h-12 rounded-xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center">
                <Phone className="w-5 h-5" />
              </div>
              <div>
                <p className="text-sm text-slate-500">Call us</p>
                <p className="font-semibold text-slate-900">+94 77 772 1999</p>
              </div>
            </div>
            <div className="rounded-2xl bg-white border border-slate-200 p-5 flex items-center gap-3 shadow-sm">
              <div className="w-12 h-12 rounded-xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center">
                <Mail className="w-5 h-5" />
              </div>
              <div>
                <p className="text-sm text-slate-500">Email</p>
                <p className="font-semibold text-slate-900">info@rechargetravels.com</p>
              </div>
            </div>
            <div className="rounded-2xl bg-white border border-slate-200 p-5 flex items-center gap-3 shadow-sm">
              <div className="w-12 h-12 rounded-xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center">
                <MapPin className="w-5 h-5" />
              </div>
              <div>
                <p className="text-sm text-slate-500">Locations</p>
                <p className="font-semibold text-slate-900">Colombo | Kandy | Galle</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default BookNow;
