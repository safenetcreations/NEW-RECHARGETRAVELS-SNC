import { useEffect, useState } from 'react';
import { Link, Navigate, useParams, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import {
  ArrowLeft,
  Calendar,
  Users,
  User,
  Mail,
  Phone,
  MessageSquare,
  Plane,
  AlertTriangle,
  Upload,
  CheckCircle2,
  Loader2,
  Percent,
  Globe,
  ChevronDown
} from 'lucide-react';
import { useB2BAuth } from '@/contexts/B2BAuthContext';
import { useB2BApi } from '@/hooks/useB2BApi';
import { B2BTour, B2BPriceCalculation } from '@/types/b2b';
import { useB2BLanguage } from '@/hooks/useB2BLanguage';
import { languageFlags, languageNames, B2BLanguage } from '@/i18n/b2b-translations';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

const B2BBookingForm = () => {
  const { tourId } = useParams<{ tourId: string }>();
  const navigate = useNavigate();
  const { isAuthenticated, isLoading: authLoading } = useB2BAuth();
  const { getTourById, createBooking, calculatePrice, loading } = useB2BApi();
  const { t, language, setLanguage } = useB2BLanguage();

  const [tour, setTour] = useState<B2BTour | null>(null);
  const [pricing, setPricing] = useState<B2BPriceCalculation | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [bookingId, setBookingId] = useState<string | null>(null);
  const [showLangMenu, setShowLangMenu] = useState(false);

  const [formData, setFormData] = useState({
    guestCount: 2,
    clientName: '',
    clientEmail: '',
    clientPhone: '',
    tourDate: '',
    specialRequests: '',
    isAirportTransfer: false,
    isEmergency: false
  });

  useEffect(() => {
    const fetchTour = async () => {
      if (!tourId) return;
      const result = await getTourById(tourId);
      if (result.success && result.data) {
        setTour(result.data);
        const initialPricing = calculatePrice(result.data.priceUSD, formData.guestCount);
        setPricing(initialPricing);
      }
    };

    if (isAuthenticated) {
      fetchTour();
    }
  }, [isAuthenticated, tourId, getTourById]);

  useEffect(() => {
    if (tour) {
      const newPricing = calculatePrice(tour.priceUSD, formData.guestCount);
      setPricing(newPricing);
    }
  }, [formData.guestCount, tour, calculatePrice]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!tourId) return;

    setIsSubmitting(true);
    setError(null);

    // Check 48-hour rule for non-emergency bookings
    const tourDate = new Date(formData.tourDate);
    const hoursUntilDeparture = (tourDate.getTime() - Date.now()) / (1000 * 60 * 60);

    if (!formData.isEmergency && hoursUntilDeparture < 48) {
      setError('Bookings must be made at least 48 hours in advance. Enable "Emergency Booking" for urgent requests.');
      setIsSubmitting(false);
      return;
    }

    const result = await createBooking({
      tourId,
      guestCount: formData.guestCount,
      clientName: formData.clientName,
      clientEmail: formData.clientEmail,
      clientPhone: formData.clientPhone,
      tourDate: formData.tourDate,
      specialRequests: formData.specialRequests,
      isAirportTransfer: formData.isAirportTransfer,
      isEmergency: formData.isEmergency
    });

    if (result.success) {
      setSuccess(true);
      setBookingId(result.data?.id || null);
    } else {
      setError(result.message);
    }

    setIsSubmitting(false);
  };

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-100">
        <Loader2 className="w-8 h-8 animate-spin text-emerald-500" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/about/partners/b2b/login" replace />;
  }

  if (success) {
    return (
      <>
        <Helmet>
          <title>Booking Confirmed | B2B Portal | Recharge Travels</title>
        </Helmet>
        <Header />
        <main className="min-h-screen bg-gradient-to-br from-slate-100 via-emerald-50/30 to-teal-50/30 py-12">
          <div className="container mx-auto px-4">
            <div className="max-w-lg mx-auto text-center">
              <div className="bg-white rounded-2xl shadow-xl p-8">
                <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <CheckCircle2 className="w-10 h-10 text-emerald-500" />
                </div>
                <h1 className="text-2xl font-bold text-slate-900 mb-4">Booking Confirmed!</h1>
                <p className="text-slate-600 mb-6">
                  Your booking has been successfully created. A confirmation has been sent to {formData.clientEmail} via email and WhatsApp.
                </p>
                {bookingId && (
                  <p className="text-sm text-slate-500 mb-6">
                    Booking ID: <span className="font-mono font-semibold">{bookingId}</span>
                  </p>
                )}
                <div className="space-y-3">
                  <Link
                    to="/about/partners/b2b/bookings"
                    className="block w-full bg-emerald-500 text-white py-3 rounded-xl font-semibold hover:bg-emerald-600"
                  >
                    View My Bookings
                  </Link>
                  <Link
                    to="/about/partners/b2b/tours"
                    className="block w-full bg-slate-200 text-slate-700 py-3 rounded-xl font-semibold hover:bg-slate-300"
                  >
                    Book Another Tour
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Helmet>
        <title>Book Tour | B2B Portal | Recharge Travels</title>
      </Helmet>

      <Header />

      {/* Language Bar */}
      <div className="bg-slate-900 text-white px-4 py-2 border-b border-slate-800">
        <div className="container mx-auto flex justify-end">
          <div className="relative">
            <button
              onClick={() => setShowLangMenu(!showLangMenu)}
              className="flex items-center gap-2 hover:text-emerald-400 transition-colors text-sm font-medium"
            >
              <Globe className="w-4 h-4" />
              <span>{languageFlags[language]} {languageNames[language]}</span>
              <ChevronDown className="w-3 h-3" />
            </button>

            {showLangMenu && (
              <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-xl shadow-xl border border-slate-100 py-2 z-50 max-h-64 overflow-y-auto">
                {(Object.keys(languageNames) as B2BLanguage[]).map((lang) => (
                  <button
                    key={lang}
                    onClick={() => {
                      setLanguage(lang);
                      setShowLangMenu(false);
                    }}
                    className={`w-full text-left px-4 py-2 text-sm hover:bg-slate-50 flex items-center gap-3 ${language === lang ? 'text-emerald-600 bg-emerald-50 font-medium' : 'text-slate-600'
                      }`}
                  >
                    <span className="text-lg">{languageFlags[lang]}</span>
                    {languageNames[lang]}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      <main className="min-h-screen bg-gradient-to-br from-slate-100 via-emerald-50/30 to-teal-50/30 py-8">
        <div className="container mx-auto px-4">
          <Link
            to="/about/partners/b2b/tours"
            className="inline-flex items-center gap-2 text-slate-600 hover:text-slate-900 mb-6"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Tours
          </Link>

          {loading || !tour ? (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="w-8 h-8 animate-spin text-emerald-500" />
            </div>
          ) : (
            <div className="grid lg:grid-cols-3 gap-8">
              {/* Booking Form */}
              <div className="lg:col-span-2">
                <div className="bg-white rounded-2xl shadow-lg border border-slate-200/50 p-8">
                  <h1 className="text-2xl font-bold text-slate-900 mb-6">Book: {tour.tourName}</h1>

                  {error && (
                    <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl flex items-start gap-3">
                      <AlertTriangle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                      <p className="text-sm text-red-700">{error}</p>
                    </div>
                  )}

                  <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Tour Details */}
                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">
                          Tour Date *
                        </label>
                        <div className="relative">
                          <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                          <input
                            type="date"
                            required
                            min={new Date().toISOString().split('T')[0]}
                            value={formData.tourDate}
                            onChange={(e) => setFormData({ ...formData, tourDate: e.target.value })}
                            className="w-full pl-12 pr-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">
                          Number of Guests *
                        </label>
                        <div className="relative">
                          <Users className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                          <input
                            type="number"
                            required
                            min={1}
                            max={tour.maxCapacity}
                            value={formData.guestCount}
                            onChange={(e) => setFormData({ ...formData, guestCount: parseInt(e.target.value) || 1 })}
                            className="w-full pl-12 pr-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Client Info */}
                    <div className="pt-6 border-t border-slate-200">
                      <h3 className="text-lg font-semibold text-slate-900 mb-4">Client Information</h3>
                      <div className="grid md:grid-cols-2 gap-6">
                        <div className="md:col-span-2">
                          <label className="block text-sm font-medium text-slate-700 mb-2">
                            Client Full Name *
                          </label>
                          <div className="relative">
                            <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                            <input
                              type="text"
                              required
                              value={formData.clientName}
                              onChange={(e) => setFormData({ ...formData, clientName: e.target.value })}
                              className="w-full pl-12 pr-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500"
                              placeholder="John Smith"
                            />
                          </div>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-slate-700 mb-2">
                            Client Email *
                          </label>
                          <div className="relative">
                            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                            <input
                              type="email"
                              required
                              value={formData.clientEmail}
                              onChange={(e) => setFormData({ ...formData, clientEmail: e.target.value })}
                              className="w-full pl-12 pr-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500"
                              placeholder="client@email.com"
                            />
                          </div>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-slate-700 mb-2">
                            Client Phone (WhatsApp) *
                          </label>
                          <div className="relative">
                            <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                            <input
                              type="tel"
                              required
                              value={formData.clientPhone}
                              onChange={(e) => setFormData({ ...formData, clientPhone: e.target.value })}
                              className="w-full pl-12 pr-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500"
                              placeholder="+44 123 456 7890"
                            />
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Special Requests */}
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">
                        Special Requests (Optional)
                      </label>
                      <div className="relative">
                        <MessageSquare className="absolute left-4 top-4 w-5 h-5 text-slate-400" />
                        <textarea
                          value={formData.specialRequests}
                          onChange={(e) => setFormData({ ...formData, specialRequests: e.target.value })}
                          rows={3}
                          className="w-full pl-12 pr-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500"
                          placeholder="Dietary requirements, accessibility needs, etc."
                        />
                      </div>
                    </div>

                    {/* Options */}
                    <div className="pt-6 border-t border-slate-200 space-y-4">
                      <label className="flex items-start gap-3 cursor-pointer p-4 bg-slate-50 rounded-xl hover:bg-slate-100 transition-colors">
                        <input
                          type="checkbox"
                          checked={formData.isAirportTransfer}
                          onChange={(e) => setFormData({ ...formData, isAirportTransfer: e.target.checked })}
                          className="w-5 h-5 text-emerald-500 border-slate-300 rounded focus:ring-emerald-500 mt-0.5"
                        />
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <Plane className="w-5 h-5 text-slate-600" />
                            <span className="font-medium text-slate-900">Include Airport Transfer</span>
                          </div>
                          <p className="text-sm text-slate-500 mt-1">
                            Add pickup/dropoff from Colombo International Airport
                          </p>
                        </div>
                      </label>

                      <label className="flex items-start gap-3 cursor-pointer p-4 bg-amber-50 border border-amber-200 rounded-xl hover:bg-amber-100 transition-colors">
                        <input
                          type="checkbox"
                          checked={formData.isEmergency}
                          onChange={(e) => setFormData({ ...formData, isEmergency: e.target.checked })}
                          className="w-5 h-5 text-amber-500 border-slate-300 rounded focus:ring-amber-500 mt-0.5"
                        />
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <AlertTriangle className="w-5 h-5 text-amber-600" />
                            <span className="font-medium text-slate-900">Emergency Booking</span>
                          </div>
                          <p className="text-sm text-amber-700 mt-1">
                            Bypass 48-hour advance booking requirement (subject to availability)
                          </p>
                        </div>
                      </label>
                    </div>

                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full bg-gradient-to-r from-emerald-500 to-teal-500 text-white py-4 rounded-xl font-semibold text-lg hover:from-emerald-600 hover:to-teal-600 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 className="w-5 h-5 animate-spin" />
                          Processing...
                        </>
                      ) : (
                        `Confirm Booking • $${pricing?.finalPrice.toFixed(2)}`
                      )}
                    </button>
                  </form>
                </div>
              </div>

              {/* Price Summary Sidebar */}
              <div>
                <div className="bg-white rounded-2xl shadow-lg border border-slate-200/50 p-6 sticky top-24">
                  <h3 className="font-bold text-slate-900 mb-4">Price Summary</h3>

                  {/* Tour Image */}
                  {tour.images?.[0] && (
                    <div className="rounded-xl overflow-hidden mb-4">
                      <img src={tour.images[0]} alt={tour.tourName} className="w-full h-32 object-cover" />
                    </div>
                  )}

                  <p className="text-sm text-slate-600 mb-4">{tour.tourName}</p>

                  {pricing && (
                    <div className="space-y-3 pt-4 border-t border-slate-200">
                      <div className="flex justify-between text-sm">
                        <span className="text-slate-600">${tour.priceUSD} × {formData.guestCount} guests</span>
                        <span className="text-slate-900">${pricing.originalPrice.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between text-sm text-emerald-600">
                        <span className="flex items-center gap-1">
                          <Percent className="w-4 h-4" />
                          B2B Commission (15%)
                        </span>
                        <span>-${pricing.discount.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between text-lg font-bold pt-3 border-t border-slate-200">
                        <span>Total</span>
                        <span className="text-emerald-600">${pricing.finalPrice.toFixed(2)}</span>
                      </div>
                    </div>
                  )}

                  <div className="mt-6 p-4 bg-emerald-50 rounded-xl">
                    <p className="text-xs text-emerald-700">
                      ✓ Instant confirmation via WhatsApp<br />
                      ✓ 15% B2B commission applied<br />
                      ✓ Free cancellation (48h notice)
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </>
  );
};

export default B2BBookingForm;
