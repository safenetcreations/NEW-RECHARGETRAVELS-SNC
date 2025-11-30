import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import { useNavigate } from 'react-router-dom';
import {
  Calendar, MapPin, Clock, Users, Star, Check, X, ChevronDown, ChevronUp,
  Heart, Share2, Play, Phone, MessageCircle, Mail, Shield, Award, Globe,
  Camera, Utensils, Car, Hotel, Plane, Info, ArrowRight, Loader2, CreditCard
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { useToast } from '@/hooks/use-toast';

// Types
export interface TourData {
  id: string;
  title: string;
  subtitle: string;
  category: string;
  region: string;
  location: string;
  duration: string;
  durationDays: number;
  priceUSD: number;
  originalPrice?: number;
  description: string;
  shortDescription: string;
  highlights: string[];
  itinerary: ItineraryDay[];
  inclusions: string[];
  exclusions: string[];
  heroImage: string;
  imageGallery: string[];
  youtubeVideoURL?: string;
  tags: string[];
  difficulty: 'easy' | 'moderate' | 'challenging';
  maxGroupSize: number;
  languages: string[];
  meetingPoint: string;
  startTime: string;
  rating: number;
  reviewCount: number;
  faqs: FAQ[];
  mapEmbedUrl?: string;
}

export interface ItineraryDay {
  day: number;
  title: string;
  description: string;
  activities: string[];
  meals: string[];
  accommodation?: string;
  highlights?: string[];
}

export interface FAQ {
  question: string;
  answer: string;
}

export interface BookingFormData {
  tourId: string;
  tourTitle: string;
  tourCategory: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  nationality: string;
  travellersAdults: number;
  travellersKids: number;
  travelDate: string;
  pickupLocation: string;
  hotelName: string;
  additionalNotes: string;
  dietaryRequirements: string;
  pricePerPerson: number;
  totalAmountUSD: number;
}

interface TourDetailTemplateProps {
  tour: TourData;
  relatedTours?: TourData[];
  onBookingSubmit: (data: BookingFormData) => Promise<{ success: boolean; bookingRef?: string; error?: string }>;
  onStripeCheckout?: (data: BookingFormData) => Promise<{ url?: string; error?: string }>;
  themeColor?: string;
  showStripePayment?: boolean;
}

const TourDetailTemplate = ({
  tour,
  relatedTours = [],
  onBookingSubmit,
  onStripeCheckout,
  themeColor = 'amber',
  showStripePayment = false
}: TourDetailTemplateProps) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [activeImage, setActiveImage] = useState(0);
  const [showVideo, setShowVideo] = useState(false);
  const [showGallery, setShowGallery] = useState(false);
  const [showBookingDialog, setShowBookingDialog] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [bookingSuccess, setBookingSuccess] = useState<string | null>(null);
  const [expandedDay, setExpandedDay] = useState<number | null>(1);

  const [booking, setBooking] = useState<BookingFormData>({
    tourId: tour.id,
    tourTitle: tour.title,
    tourCategory: tour.category,
    customerName: '',
    customerEmail: '',
    customerPhone: '',
    nationality: '',
    travellersAdults: 2,
    travellersKids: 0,
    travelDate: '',
    pickupLocation: '',
    hotelName: '',
    additionalNotes: '',
    dietaryRequirements: '',
    pricePerPerson: tour.priceUSD,
    totalAmountUSD: tour.priceUSD * 2
  });

  // Update total when travelers change
  useEffect(() => {
    const adults = booking.travellersAdults;
    const kids = booking.travellersKids;
    const total = (adults * tour.priceUSD) + (kids * tour.priceUSD * 0.5);
    setBooking(prev => ({ ...prev, totalAmountUSD: total }));
  }, [booking.travellersAdults, booking.travellersKids, tour.priceUSD]);

  const updateBooking = (field: string, value: any) => {
    setBooking(prev => ({ ...prev, [field]: value }));
  };

  const handleBookingSubmit = async () => {
    if (!booking.customerName || !booking.customerEmail || !booking.customerPhone || !booking.travelDate) {
      toast({ title: 'Please fill all required fields', variant: 'destructive' });
      return;
    }

    setSubmitting(true);
    try {
      const result = await onBookingSubmit(booking);
      if (result.success && result.bookingRef) {
        setBookingSuccess(result.bookingRef);
      } else {
        toast({ title: result.error || 'Booking failed', variant: 'destructive' });
      }
    } catch (e) {
      toast({ title: 'Error submitting booking', variant: 'destructive' });
    }
    setSubmitting(false);
  };

  const handleStripePayment = async () => {
    if (!onStripeCheckout) return;
    
    if (!booking.customerName || !booking.customerEmail || !booking.customerPhone || !booking.travelDate) {
      toast({ title: 'Please fill all required fields', variant: 'destructive' });
      return;
    }

    setSubmitting(true);
    try {
      const result = await onStripeCheckout(booking);
      if (result.url) {
        window.location.href = result.url;
      } else {
        toast({ title: result.error || 'Payment failed', variant: 'destructive' });
      }
    } catch (e) {
      toast({ title: 'Error initiating payment', variant: 'destructive' });
    }
    setSubmitting(false);
  };

  const colorClasses = {
    amber: { bg: 'bg-amber-500', hover: 'hover:bg-amber-600', text: 'text-amber-600', light: 'bg-amber-50', border: 'border-amber-500' },
    emerald: { bg: 'bg-emerald-500', hover: 'hover:bg-emerald-600', text: 'text-emerald-600', light: 'bg-emerald-50', border: 'border-emerald-500' },
    rose: { bg: 'bg-rose-500', hover: 'hover:bg-rose-600', text: 'text-rose-600', light: 'bg-rose-50', border: 'border-rose-500' },
    blue: { bg: 'bg-blue-500', hover: 'hover:bg-blue-600', text: 'text-blue-600', light: 'bg-blue-50', border: 'border-blue-500' },
    purple: { bg: 'bg-purple-500', hover: 'hover:bg-purple-600', text: 'text-purple-600', light: 'bg-purple-50', border: 'border-purple-500' }
  };

  const theme = colorClasses[themeColor as keyof typeof colorClasses] || colorClasses.amber;

  return (
    <div className="min-h-screen bg-gray-50">
      <Helmet>
        <title>{tour.title} | Recharge Travels</title>
        <meta name="description" content={tour.shortDescription} />
      </Helmet>
      <Header />

      {/* HERO */}
      <section className="relative h-[60vh] md:h-[70vh] overflow-hidden">
        <img src={tour.heroImage} alt={tour.title} className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
        
        {/* Gallery Thumbnails */}
        <div className="absolute bottom-6 left-6 flex gap-2">
          {tour.imageGallery.slice(0, 4).map((img, i) => (
            <button key={i} onClick={() => { setActiveImage(i); setShowGallery(true); }} className="w-16 h-16 rounded-lg overflow-hidden border-2 border-white/50 hover:border-white transition-all">
              <img src={img} alt="" className="w-full h-full object-cover" />
            </button>
          ))}
          {tour.imageGallery.length > 4 && (
            <button onClick={() => setShowGallery(true)} className="w-16 h-16 rounded-lg bg-black/50 flex items-center justify-center text-white text-sm font-medium">
              +{tour.imageGallery.length - 4}
            </button>
          )}
        </div>

        {/* Video Button */}
        {tour.youtubeVideoURL && (
          <button onClick={() => setShowVideo(true)} className="absolute bottom-6 right-6 flex items-center gap-2 bg-white/20 backdrop-blur-sm text-white px-4 py-2 rounded-full hover:bg-white/30 transition-all">
            <Play className="w-5 h-5" fill="currentColor" />Watch Video
          </button>
        )}

        {/* Hero Content */}
        <div className="absolute bottom-0 left-0 right-0 p-6 md:p-12">
          <div className="container mx-auto max-w-6xl">
            <div className="flex flex-wrap gap-2 mb-3">
              {tour.tags.slice(0, 3).map((tag, i) => (
                <Badge key={i} className={`${theme.bg} text-white`}>{tag}</Badge>
              ))}
            </div>
            <h1 className="text-3xl md:text-5xl font-bold text-white mb-2">{tour.title}</h1>
            <p className="text-lg text-white/90 max-w-2xl mb-4">{tour.subtitle}</p>
            <div className="flex flex-wrap gap-4 text-white/80 text-sm">
              <span className="flex items-center gap-1"><MapPin className="w-4 h-4" />{tour.location}</span>
              <span className="flex items-center gap-1"><Clock className="w-4 h-4" />{tour.duration}</span>
              <span className="flex items-center gap-1"><Users className="w-4 h-4" />Max {tour.maxGroupSize}</span>
              <span className="flex items-center gap-1"><Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />{tour.rating} ({tour.reviewCount} reviews)</span>
            </div>
          </div>
        </div>
      </section>

      <div className="container mx-auto max-w-6xl px-4 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Overview */}
            <Card>
              <CardHeader><CardTitle>Overview</CardTitle></CardHeader>
              <CardContent>
                <p className="text-gray-700 leading-relaxed">{tour.description}</p>
              </CardContent>
            </Card>

            {/* Highlights */}
            <Card>
              <CardHeader><CardTitle>Highlights</CardTitle></CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-3">
                  {tour.highlights.map((h, i) => (
                    <div key={i} className="flex items-start gap-2">
                      <Check className={`w-5 h-5 ${theme.text} flex-shrink-0 mt-0.5`} />
                      <span className="text-gray-700">{h}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Itinerary */}
            <Card>
              <CardHeader><CardTitle>Itinerary</CardTitle></CardHeader>
              <CardContent className="space-y-4">
                {tour.itinerary.map((day) => (
                  <div key={day.day} className={`border rounded-lg overflow-hidden ${expandedDay === day.day ? theme.border : 'border-gray-200'}`}>
                    <button
                      onClick={() => setExpandedDay(expandedDay === day.day ? null : day.day)}
                      className={`w-full flex items-center justify-between p-4 text-left ${expandedDay === day.day ? theme.light : 'bg-white hover:bg-gray-50'}`}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-full ${theme.bg} text-white flex items-center justify-center font-bold`}>{day.day}</div>
                        <div>
                          <h4 className="font-semibold">{day.title}</h4>
                          {day.meals.length > 0 && <p className="text-sm text-gray-500">Meals: {day.meals.join(', ')}</p>}
                        </div>
                      </div>
                      {expandedDay === day.day ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                    </button>
                    <AnimatePresence>
                      {expandedDay === day.day && (
                        <motion.div initial={{ height: 0 }} animate={{ height: 'auto' }} exit={{ height: 0 }} className="overflow-hidden">
                          <div className="p-4 border-t bg-white">
                            <p className="text-gray-700 mb-4">{day.description}</p>
                            {day.activities.length > 0 && (
                              <div className="mb-4">
                                <h5 className="font-medium mb-2">Activities:</h5>
                                <ul className="list-disc list-inside text-gray-600 space-y-1">
                                  {day.activities.map((a, i) => <li key={i}>{a}</li>)}
                                </ul>
                              </div>
                            )}
                            {day.accommodation && (
                              <div className="flex items-center gap-2 text-sm text-gray-600">
                                <Hotel className="w-4 h-4" />Accommodation: {day.accommodation}
                              </div>
                            )}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Inclusions / Exclusions */}
            <div className="grid md:grid-cols-2 gap-6">
              <Card>
                <CardHeader><CardTitle className="text-green-600">What's Included</CardTitle></CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {tour.inclusions.map((item, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <Check className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                        <span className="text-gray-700">{item}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
              <Card>
                <CardHeader><CardTitle className="text-red-600">Not Included</CardTitle></CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {tour.exclusions.map((item, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <X className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                        <span className="text-gray-700">{item}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </div>

            {/* FAQs */}
            {tour.faqs.length > 0 && (
              <Card>
                <CardHeader><CardTitle>Frequently Asked Questions</CardTitle></CardHeader>
                <CardContent>
                  <Accordion type="single" collapsible>
                    {tour.faqs.map((faq, i) => (
                      <AccordionItem key={i} value={`faq-${i}`}>
                        <AccordionTrigger>{faq.question}</AccordionTrigger>
                        <AccordionContent>{faq.answer}</AccordionContent>
                      </AccordionItem>
                    ))}
                  </Accordion>
                </CardContent>
              </Card>
            )}

            {/* Map */}
            {tour.mapEmbedUrl && (
              <Card>
                <CardHeader><CardTitle>Meeting Point</CardTitle></CardHeader>
                <CardContent>
                  <p className="text-gray-600 mb-4"><MapPin className="w-4 h-4 inline mr-1" />{tour.meetingPoint}</p>
                  <div className="aspect-video rounded-lg overflow-hidden">
                    <iframe src={tour.mapEmbedUrl} width="100%" height="100%" style={{ border: 0 }} loading="lazy" />
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Sidebar - Booking Card */}
          <div className="lg:col-span-1">
            <div className="sticky top-6">
              <Card className="shadow-xl border-0">
                <CardContent className="p-6">
                  {/* Price */}
                  <div className="flex items-baseline gap-2 mb-4">
                    <span className={`text-3xl font-bold ${theme.text}`}>${tour.priceUSD}</span>
                    {tour.originalPrice && <span className="text-gray-400 line-through">${tour.originalPrice}</span>}
                    <span className="text-gray-500">/ person</span>
                  </div>

                  {/* Quick Info */}
                  <div className="grid grid-cols-2 gap-3 mb-6 text-sm">
                    <div className="bg-gray-50 p-3 rounded-lg"><span className="text-gray-500 block">Duration</span><strong>{tour.duration}</strong></div>
                    <div className="bg-gray-50 p-3 rounded-lg"><span className="text-gray-500 block">Group Size</span><strong>Max {tour.maxGroupSize}</strong></div>
                    <div className="bg-gray-50 p-3 rounded-lg"><span className="text-gray-500 block">Difficulty</span><strong className="capitalize">{tour.difficulty}</strong></div>
                    <div className="bg-gray-50 p-3 rounded-lg"><span className="text-gray-500 block">Start Time</span><strong>{tour.startTime}</strong></div>
                  </div>

                  {/* Book Button */}
                  <Button className={`w-full ${theme.bg} ${theme.hover} text-white py-6 text-lg mb-4`} onClick={() => setShowBookingDialog(true)}>
                    Book Now
                  </Button>

                  {/* Trust Badges */}
                  <div className="flex items-center justify-center gap-4 text-sm text-gray-500">
                    <span className="flex items-center gap-1"><Shield className="w-4 h-4" />Secure</span>
                    <span className="flex items-center gap-1"><Award className="w-4 h-4" />Best Price</span>
                  </div>

                  {/* Contact */}
                  <div className="mt-6 pt-6 border-t">
                    <p className="text-center text-gray-600 mb-3">Need help?</p>
                    <div className="flex gap-2">
                      <Button variant="outline" className="flex-1" size="sm" onClick={() => window.open('https://wa.me/94777721999', '_blank')}>
                        <MessageCircle className="w-4 h-4 mr-1" />WhatsApp
                      </Button>
                      <Button variant="outline" className="flex-1" size="sm" onClick={() => window.open('tel:+94777721999')}>
                        <Phone className="w-4 h-4 mr-1" />Call
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>

        {/* Related Tours */}
        {relatedTours.length > 0 && (
          <section className="mt-12">
            <h2 className="text-2xl font-bold mb-6">You May Also Like</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedTours.map(t => (
                <Card key={t.id} className="overflow-hidden hover:shadow-lg transition-all cursor-pointer" onClick={() => navigate(`/tours/${t.category}/${t.id}`)}>
                  <div className="h-40 overflow-hidden">
                    <img src={t.heroImage} alt={t.title} className="w-full h-full object-cover hover:scale-105 transition-transform" />
                  </div>
                  <CardContent className="p-4">
                    <h3 className="font-semibold mb-1 line-clamp-1">{t.title}</h3>
                    <p className="text-sm text-gray-500 mb-2">{t.location} • {t.duration}</p>
                    <div className="flex justify-between items-center">
                      <span className={`font-bold ${theme.text}`}>${t.priceUSD}</span>
                      <span className="text-sm flex items-center gap-1"><Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />{t.rating}</span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>
        )}
      </div>

      {/* Booking Dialog */}
      <Dialog open={showBookingDialog} onOpenChange={setShowBookingDialog}>
        <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{bookingSuccess ? 'Booking Confirmed!' : `Book ${tour.title}`}</DialogTitle>
          </DialogHeader>

          {bookingSuccess ? (
            <div className="text-center py-6">
              <div className={`w-20 h-20 ${theme.bg} rounded-full flex items-center justify-center mx-auto mb-4`}>
                <Check className="w-10 h-10 text-white" />
              </div>
              <h3 className="text-xl font-bold mb-2">Thank You!</h3>
              <p className="text-lg font-mono mb-2">{bookingSuccess}</p>
              <p className="text-gray-600 mb-6">We'll send confirmation to your email and WhatsApp</p>
              <div className="flex gap-3 justify-center">
                <Button variant="outline" onClick={() => setShowBookingDialog(false)}>Close</Button>
                <Button className={`${theme.bg} ${theme.hover}`} onClick={() => window.open('https://wa.me/94777721999', '_blank')}>
                  <MessageCircle className="w-4 h-4 mr-2" />WhatsApp Us
                </Button>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              {/* Tour Summary */}
              <div className={`${theme.light} p-4 rounded-lg`}>
                <div className="flex justify-between items-center">
                  <div>
                    <h4 className="font-semibold">{tour.title}</h4>
                    <p className="text-sm text-gray-600">{tour.duration} • {tour.location}</p>
                  </div>
                  <div className="text-right">
                    <span className={`text-xl font-bold ${theme.text}`}>${tour.priceUSD}</span>
                    <span className="text-gray-500 text-sm block">per person</span>
                  </div>
                </div>
              </div>

              {/* Form Fields */}
              <div className="grid grid-cols-2 gap-3">
                <div className="col-span-2">
                  <label className="text-sm font-medium text-gray-700 block mb-1">Full Name *</label>
                  <Input value={booking.customerName} onChange={e => updateBooking('customerName', e.target.value)} placeholder="John Smith" />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700 block mb-1">Email *</label>
                  <Input type="email" value={booking.customerEmail} onChange={e => updateBooking('customerEmail', e.target.value)} placeholder="john@email.com" />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700 block mb-1">Phone (WhatsApp) *</label>
                  <Input value={booking.customerPhone} onChange={e => updateBooking('customerPhone', e.target.value)} placeholder="+1 234 567 8900" />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700 block mb-1">Travel Date *</label>
                  <Input type="date" value={booking.travelDate} onChange={e => updateBooking('travelDate', e.target.value)} />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700 block mb-1">Nationality</label>
                  <Input value={booking.nationality} onChange={e => updateBooking('nationality', e.target.value)} placeholder="United States" />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700 block mb-1">Adults</label>
                  <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm" onClick={() => updateBooking('travellersAdults', Math.max(1, booking.travellersAdults - 1))}>-</Button>
                    <span className="w-8 text-center font-semibold">{booking.travellersAdults}</span>
                    <Button variant="outline" size="sm" onClick={() => updateBooking('travellersAdults', booking.travellersAdults + 1)}>+</Button>
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700 block mb-1">Children</label>
                  <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm" onClick={() => updateBooking('travellersKids', Math.max(0, booking.travellersKids - 1))}>-</Button>
                    <span className="w-8 text-center font-semibold">{booking.travellersKids}</span>
                    <Button variant="outline" size="sm" onClick={() => updateBooking('travellersKids', booking.travellersKids + 1)}>+</Button>
                  </div>
                </div>
                <div className="col-span-2">
                  <label className="text-sm font-medium text-gray-700 block mb-1">Hotel / Pickup Location</label>
                  <Input value={booking.pickupLocation} onChange={e => updateBooking('pickupLocation', e.target.value)} placeholder="Hotel name or address" />
                </div>
                <div className="col-span-2">
                  <label className="text-sm font-medium text-gray-700 block mb-1">Special Requests</label>
                  <Textarea value={booking.additionalNotes} onChange={e => updateBooking('additionalNotes', e.target.value)} placeholder="Dietary requirements, special occasions..." rows={2} />
                </div>
              </div>

              {/* Total */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="flex justify-between items-center text-lg">
                  <span>Total ({booking.travellersAdults} adults{booking.travellersKids > 0 ? `, ${booking.travellersKids} children` : ''})</span>
                  <span className={`text-2xl font-bold ${theme.text}`}>${booking.totalAmountUSD.toFixed(2)}</span>
                </div>
                {booking.travellersKids > 0 && <p className="text-sm text-gray-500 mt-1">Children: 50% off</p>}
              </div>

              {/* Submit Buttons */}
              <div className="flex gap-3">
                <Button variant="outline" className="flex-1" onClick={() => setShowBookingDialog(false)}>Cancel</Button>
                {showStripePayment && onStripeCheckout ? (
                  <Button className={`flex-1 ${theme.bg} ${theme.hover}`} onClick={handleStripePayment} disabled={submitting}>
                    {submitting ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <CreditCard className="w-4 h-4 mr-2" />}
                    Pay Now
                  </Button>
                ) : (
                  <Button className={`flex-1 ${theme.bg} ${theme.hover}`} onClick={handleBookingSubmit} disabled={submitting}>
                    {submitting ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : null}
                    {submitting ? 'Submitting...' : 'Confirm Booking'}
                  </Button>
                )}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Video Modal */}
      <Dialog open={showVideo} onOpenChange={setShowVideo}>
        <DialogContent className="max-w-4xl p-0">
          <div className="aspect-video">
            <iframe src={tour.youtubeVideoURL?.replace('watch?v=', 'embed/')} className="w-full h-full" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen />
          </div>
        </DialogContent>
      </Dialog>

      {/* Gallery Modal */}
      <Dialog open={showGallery} onOpenChange={setShowGallery}>
        <DialogContent className="max-w-4xl">
          <div className="relative">
            <img src={tour.imageGallery[activeImage]} alt="" className="w-full rounded-lg" />
            <div className="flex gap-2 mt-4 overflow-x-auto pb-2">
              {tour.imageGallery.map((img, i) => (
                <button key={i} onClick={() => setActiveImage(i)} className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 ${activeImage === i ? theme.border : 'border-transparent'}`}>
                  <img src={img} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <Footer />
    </div>
  );
};

export default TourDetailTemplate;
