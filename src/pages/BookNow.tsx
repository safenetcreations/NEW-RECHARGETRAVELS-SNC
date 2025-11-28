import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Calendar, Users, Phone, Mail, MessageSquare, Send,
  Car, Compass, Train, Shield, BadgeCheck, Star, Headphones,
  MapPin, Clock, CheckCircle, ChevronLeft, ChevronRight
} from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from '@/hooks/use-toast';
import SEOHead from '@/components/cms/SEOHead';
import { fetchDrivers } from '@/services/driverDirectoryService';
import { assignDriverAndBlock } from '@/services/driverBookingService';
import { auth } from '@/lib/firebase';
import {
  getBookNowHeroSlides,
  getBookNowPackages,
  BookNowHeroSlide,
  PopularPackage,
  DEFAULT_BOOK_NOW_SLIDES,
  DEFAULT_PACKAGES
} from '@/services/bookNowHeroService';

type TabType = 'transfers' | 'tours' | 'groups' | 'train';

const BookNow = () => {
  const [activeTab, setActiveTab] = useState<TabType>('transfers');
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const [heroSlides, setHeroSlides] = useState<BookNowHeroSlide[]>(DEFAULT_BOOK_NOW_SLIDES);
  const [packages, setPackages] = useState<PopularPackage[]>(
    DEFAULT_PACKAGES.map((pkg, i) => ({ ...pkg, id: `default-${i}` }))
  );
  const [isLoading, setIsLoading] = useState(true);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    tourType: '',
    startDate: '',
    endDate: '',
    adults: '2',
    children: '0',
    message: ''
  });
  const [drivers, setDrivers] = useState<{ id: string; full_name?: string; tier?: string }[]>([])
  const [selectedDriver, setSelectedDriver] = useState<string>('')

  const tabs = [
    { id: 'transfers' as TabType, label: 'Transfers', icon: Car },
    { id: 'tours' as TabType, label: 'Tours', icon: Compass },
    { id: 'groups' as TabType, label: 'Groups', icon: Users },
    { id: 'train' as TabType, label: 'Train', icon: Train },
  ];

  const tourTypes = [
    'Wildlife Safari',
    'Cultural Heritage Tour',
    'Beach Holiday',
    'Adventure Tour',
    'Honeymoon Package',
    'Hill Country Tour',
    'Photography Tour',
    'Custom Itinerary'
  ];

  const assuranceItems = [
    { icon: Shield, title: 'Safe & Secure', description: '100% secure payments' },
    { icon: BadgeCheck, title: 'SLTDA Licensed', description: 'Government certified' },
    { icon: Star, title: '4.9/5 Rating', description: '1000+ happy travelers' },
    { icon: Headphones, title: '24/7 Support', description: 'Always here to help' },
  ];

  // Fetch hero slides and packages from Firebase
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [slidesData, packagesData] = await Promise.all([
          getBookNowHeroSlides(),
          getBookNowPackages()
        ]);
        // Filter out slides with empty or invalid image URLs
        const validSlides = slidesData?.filter(slide => slide.image && slide.image.trim() !== '') || [];
        if (validSlides.length > 0) {
          setHeroSlides(validSlides);
        }
        // Keep DEFAULT_BOOK_NOW_SLIDES if no valid slides from Firebase
        if (packagesData.length > 0) setPackages(packagesData);
      } catch (error) {
        console.error('Error fetching Book Now data:', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  // Auto-slide hero images every 6 seconds
  useEffect(() => {
    if (heroSlides.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentSlideIndex((prev) => (prev + 1) % heroSlides.length);
    }, 6000);
    return () => clearInterval(interval);
  }, [heroSlides.length]);

  useEffect(() => {
    const loadDrivers = async () => {
      try {
        const list = await fetchDrivers({ minRating: 4 })
        setDrivers(list)
      } catch (err) {
        console.error('Failed to load drivers', err)
      }
    }
    loadDrivers()
  }, [])

  const goToSlide = (index: number) => {
    setCurrentSlideIndex(index);
  };

  const goToPrevSlide = () => {
    setCurrentSlideIndex((prev) => (prev - 1 + heroSlides.length) % heroSlides.length);
  };

  const goToNextSlide = () => {
    setCurrentSlideIndex((prev) => (prev + 1) % heroSlides.length);
  };

  const currentSlide = heroSlides[currentSlideIndex] || DEFAULT_BOOK_NOW_SLIDES[0];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    console.log('Booking form submitted:', formData);

    toast({
      title: "Booking Request Sent!",
      description: "We'll contact you within 24 hours to confirm your booking.",
    });

    if (selectedDriver && auth?.currentUser?.uid) {
      const bookingId = `bk-${Date.now()}`
      try {
        await assignDriverAndBlock({
          driverId: selectedDriver,
          bookingId,
          customerId: auth.currentUser.uid,
          bookingType: 'tour',
          startDate: formData.startDate || new Date().toISOString(),
          endDate: formData.endDate || undefined,
          timeSlot: 'full_day'
        })
        toast({
          title: 'Driver selection recorded',
          description: 'We blocked the driver while we confirm your booking.'
        })
      } catch (err) {
        console.error('Failed to assign driver', err)
      }
    }

    setFormData({
      name: '',
      email: '',
      phone: '',
      tourType: '',
      startDate: '',
      endDate: '',
      adults: '2',
      children: '0',
      message: ''
    });
    setSelectedDriver('')
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-50 via-white to-teal-50">
      <SEOHead
        title="Book Your Sri Lanka Tour | Instant Booking - Recharge Travels"
        description="Book your Sri Lanka adventure today. Wildlife safaris, cultural tours, beach holidays. Instant confirmation, best price guarantee. Licensed tour operator."
        canonicalUrl="https://rechargetravels.com/book-now"
      />

      <Header />

      {/* Hero Section - Sri Lankan Beach with Auto-Slider */}
      <section className="relative h-[45vh] min-h-[380px] flex items-center justify-center overflow-hidden">
        {/* Background Image Slider */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentSlideIndex}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8 }}
            className="absolute inset-0"
          >
            <img
              src={currentSlide.image}
              alt={currentSlide.title}
              className="w-full h-full object-cover"
            />
            {/* Light overlay for readability */}
            <div className="absolute inset-0 bg-gradient-to-b from-white/30 via-transparent to-white/60" />
            <div className="absolute inset-0 bg-gradient-to-r from-teal-600/20 to-sky-600/20" />
          </motion.div>
        </AnimatePresence>

        {/* Navigation Arrows */}
        {heroSlides.length > 1 && (
          <>
            <button
              onClick={goToPrevSlide}
              className="absolute left-4 z-20 p-2 rounded-full bg-white/80 hover:bg-white shadow-lg transition-all"
              aria-label="Previous slide"
            >
              <ChevronLeft className="w-6 h-6 text-gray-700" />
            </button>
            <button
              onClick={goToNextSlide}
              className="absolute right-4 z-20 p-2 rounded-full bg-white/80 hover:bg-white shadow-lg transition-all"
              aria-label="Next slide"
            >
              <ChevronRight className="w-6 h-6 text-gray-700" />
            </button>
          </>
        )}

        {/* Slide Indicators */}
        {heroSlides.length > 1 && (
          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 z-20 flex gap-2">
            {heroSlides.map((_, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                className={`w-2.5 h-2.5 rounded-full transition-all ${
                  index === currentSlideIndex
                    ? 'bg-teal-600 w-8'
                    : 'bg-white/70 hover:bg-white'
                }`}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        )}

        <div className="relative z-10 text-center px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="bg-white/90 backdrop-blur-md rounded-3xl p-8 md:p-10 shadow-2xl max-w-2xl mx-auto border border-white/50"
          >
            <AnimatePresence mode="wait">
              <motion.div
                key={currentSlideIndex}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.4 }}
              >
                <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-3 text-gray-800 font-serif">
                  {currentSlide.title}
                </h1>
                <p className="text-base md:text-lg text-gray-600 mb-6">
                  {currentSlide.subtitle}
                </p>
              </motion.div>
            </AnimatePresence>

            {/* Tab Navigation */}
            <div className="inline-flex gap-2 bg-gray-100 p-1.5 rounded-xl">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center gap-2 px-4 py-2.5 rounded-lg font-medium transition-all duration-200 ${
                      activeTab === tab.id
                        ? 'bg-teal-600 text-white shadow-md'
                        : 'text-gray-600 hover:bg-white hover:text-teal-600'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span className="hidden sm:inline">{tab.label}</span>
                  </button>
                );
              })}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Main Content - Light Background */}
      <section className="py-12 md:py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Booking Form */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="lg:col-span-2"
              >
                <Card className="shadow-xl border-0 rounded-2xl overflow-hidden bg-white">
                  {/* Form Header */}
                  <div className="bg-gradient-to-r from-teal-500 to-teal-600 text-white p-6">
                    <h2 className="text-xl md:text-2xl font-semibold mb-1 flex items-center gap-2">
                      <MapPin className="w-6 h-6" />
                      Tour Booking Request
                    </h2>
                    <p className="opacity-90 text-sm">Fill out the form below and we'll get back to you within 24 hours</p>
                  </div>

                  <CardContent className="p-6 md:p-8 bg-white">
                    <form onSubmit={handleSubmit} className="space-y-8">
                      {/* Personal Information */}
                      <div className="space-y-4">
                        <h3 className="font-semibold text-lg text-gray-800 flex items-center gap-2 border-b pb-2">
                          <Users className="w-5 h-5 text-teal-600" />
                          Personal Information
                        </h3>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="name" className="text-sm font-medium text-gray-700">Full Name *</Label>
                            <Input
                              id="name"
                              name="name"
                              value={formData.name}
                              onChange={handleChange}
                              required
                              placeholder="John Doe"
                              className="h-12 rounded-xl border-gray-200 bg-gray-50 focus:bg-white focus:border-teal-500 focus:ring-teal-500/20"
                            />
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor="email" className="text-sm font-medium text-gray-700">Email *</Label>
                            <Input
                              id="email"
                              name="email"
                              type="email"
                              value={formData.email}
                              onChange={handleChange}
                              required
                              placeholder="john@example.com"
                              className="h-12 rounded-xl border-gray-200 bg-gray-50 focus:bg-white focus:border-teal-500 focus:ring-teal-500/20"
                            />
                          </div>
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="phone" className="text-sm font-medium text-gray-700">Phone Number *</Label>
                          <Input
                            id="phone"
                            name="phone"
                            value={formData.phone}
                            onChange={handleChange}
                            required
                            placeholder="+1 234 567 8900"
                            className="h-12 rounded-xl border-gray-200 bg-gray-50 focus:bg-white focus:border-teal-500 focus:ring-teal-500/20"
                          />
                        </div>
                      </div>

                      {/* Tour Details */}
                      <div className="space-y-4">
                        <h3 className="font-semibold text-lg text-gray-800 flex items-center gap-2 border-b pb-2">
                          <Compass className="w-5 h-5 text-teal-600" />
                          Tour Details
                        </h3>

                        <div className="space-y-2">
                          <Label htmlFor="tourType" className="text-sm font-medium text-gray-700">Tour Type *</Label>
                          <Select
                            value={formData.tourType}
                            onValueChange={(value) => setFormData({ ...formData, tourType: value })}
                          >
                            <SelectTrigger className="h-12 rounded-xl border-gray-200 bg-gray-50 focus:bg-white focus:border-teal-500">
                              <SelectValue placeholder="Select a tour type" />
                            </SelectTrigger>
                            <SelectContent>
                              {tourTypes.map((type) => (
                                <SelectItem key={type} value={type}>
                                  {type}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="startDate" className="text-sm font-medium text-gray-700">Start Date *</Label>
                            <Input
                              id="startDate"
                              name="startDate"
                              type="date"
                              value={formData.startDate}
                              onChange={handleChange}
                              required
                              className="h-12 rounded-xl border-gray-200 bg-gray-50 focus:bg-white focus:border-teal-500 focus:ring-teal-500/20"
                            />
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor="endDate" className="text-sm font-medium text-gray-700">End Date *</Label>
                            <Input
                              id="endDate"
                              name="endDate"
                              type="date"
                              value={formData.endDate}
                              onChange={handleChange}
                              required
                              className="h-12 rounded-xl border-gray-200 bg-gray-50 focus:bg-white focus:border-teal-500 focus:ring-teal-500/20"
                            />
                          </div>
                        </div>
                        <div className="space-y-2">
                          <Label className="text-sm font-medium text-gray-700">Preferred Driver (optional)</Label>
                          <select
                            className="w-full h-12 rounded-xl border border-gray-200 bg-gray-50 px-3"
                            value={selectedDriver}
                            onChange={(e) => setSelectedDriver(e.target.value)}
                          >
                            <option value="">No preference (best match)</option>
                            {drivers.map((d) => (
                              <option key={d.id} value={d.id}>
                                {d.full_name || 'Driver'} {d.tier ? `• ${d.tier.replace(/_/g, ' ')}` : ''}
                              </option>
                            ))}
                          </select>
                          <p className="text-xs text-gray-500">If you are logged in, we’ll hold this driver’s calendar while we confirm.</p>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="adults" className="text-sm font-medium text-gray-700">Number of Adults</Label>
                            <Select
                              value={formData.adults}
                              onValueChange={(value) => setFormData({ ...formData, adults: value })}
                            >
                              <SelectTrigger className="h-12 rounded-xl border-gray-200 bg-gray-50 focus:bg-white focus:border-teal-500">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
                                  <SelectItem key={num} value={num.toString()}>
                                    {num} {num === 1 ? 'Adult' : 'Adults'}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor="children" className="text-sm font-medium text-gray-700">Number of Children</Label>
                            <Select
                              value={formData.children}
                              onValueChange={(value) => setFormData({ ...formData, children: value })}
                            >
                              <SelectTrigger className="h-12 rounded-xl border-gray-200 bg-gray-50 focus:bg-white focus:border-teal-500">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                {[0, 1, 2, 3, 4, 5].map((num) => (
                                  <SelectItem key={num} value={num.toString()}>
                                    {num} {num === 1 ? 'Child' : 'Children'}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                        </div>
                      </div>

                      {/* Additional Information */}
                      <div className="space-y-4">
                        <h3 className="font-semibold text-lg text-gray-800 flex items-center gap-2 border-b pb-2">
                          <MessageSquare className="w-5 h-5 text-teal-600" />
                          Additional Information
                        </h3>

                        <div className="space-y-2">
                          <Label htmlFor="message" className="text-sm font-medium text-gray-700">Special Requests or Questions</Label>
                          <Textarea
                            id="message"
                            name="message"
                            value={formData.message}
                            onChange={handleChange}
                            rows={4}
                            placeholder="Tell us about any special requirements, interests, or questions you have..."
                            className="rounded-xl border-gray-200 bg-gray-50 focus:bg-white focus:border-teal-500 focus:ring-teal-500/20 resize-none"
                          />
                        </div>
                      </div>

                      <Button
                        type="submit"
                        size="lg"
                        className="w-full h-14 text-lg font-semibold rounded-xl bg-gradient-to-r from-teal-500 to-teal-600 hover:from-teal-600 hover:to-teal-700 transition-all duration-200 hover:shadow-lg hover:shadow-teal-500/25 hover:-translate-y-0.5"
                      >
                        <Send className="w-5 h-5 mr-2" />
                        Send Booking Request
                      </Button>
                    </form>
                  </CardContent>
                </Card>
              </motion.div>

              {/* Sidebar */}
              <div className="space-y-6">
                {/* Contact Card */}
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2, duration: 0.5 }}
                >
                  <Card className="rounded-2xl shadow-lg border-0 bg-white hover:shadow-xl transition-all duration-200">
                    <CardHeader className="bg-gradient-to-r from-sky-50 to-teal-50 rounded-t-2xl">
                      <CardTitle className="text-lg text-gray-800">Need Help?</CardTitle>
                      <CardDescription className="text-gray-600">
                        Our travel experts are here to assist you
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4 pt-4">
                      <a href="tel:+94777721999" className="flex items-start gap-4 p-3 rounded-xl hover:bg-teal-50 transition-colors group">
                        <div className="w-10 h-10 rounded-xl bg-teal-100 flex items-center justify-center flex-shrink-0 group-hover:bg-teal-200 transition-colors">
                          <Phone className="w-5 h-5 text-teal-600" />
                        </div>
                        <div>
                          <p className="font-semibold text-sm text-gray-800">Call Us</p>
                          <p className="text-sm text-teal-600 font-medium">+94 777 721 999</p>
                          <p className="text-xs text-gray-500">Available 8 AM - 8 PM</p>
                        </div>
                      </a>

                      <a href="mailto:info@rechargetravels.com" className="flex items-start gap-4 p-3 rounded-xl hover:bg-sky-50 transition-colors group">
                        <div className="w-10 h-10 rounded-xl bg-sky-100 flex items-center justify-center flex-shrink-0 group-hover:bg-sky-200 transition-colors">
                          <Mail className="w-5 h-5 text-sky-600" />
                        </div>
                        <div>
                          <p className="font-semibold text-sm text-gray-800">Email Us</p>
                          <p className="text-sm text-sky-600 font-medium">info@rechargetravels.com</p>
                          <p className="text-xs text-gray-500">Response within 24 hours</p>
                        </div>
                      </a>

                      <a href="https://wa.me/94777721999" target="_blank" rel="noopener noreferrer" className="flex items-start gap-4 p-3 rounded-xl hover:bg-green-50 transition-colors group">
                        <div className="w-10 h-10 rounded-xl bg-green-100 flex items-center justify-center flex-shrink-0 group-hover:bg-green-200 transition-colors">
                          <MessageSquare className="w-5 h-5 text-green-600" />
                        </div>
                        <div>
                          <p className="font-semibold text-sm text-gray-800">WhatsApp</p>
                          <p className="text-sm text-green-600 font-medium">+94 777 721 999</p>
                          <p className="text-xs text-gray-500">Quick responses</p>
                        </div>
                      </a>
                    </CardContent>
                  </Card>
                </motion.div>

                {/* Why Book With Us */}
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3, duration: 0.5 }}
                >
                  <Card className="rounded-2xl shadow-lg border-0 bg-white hover:shadow-xl transition-all duration-200">
                    <CardHeader className="bg-gradient-to-r from-teal-50 to-emerald-50 rounded-t-2xl">
                      <CardTitle className="text-lg text-gray-800">Why Book With Us?</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3 pt-4">
                      {[
                        'Licensed tour operator since 2014',
                        'Best price guarantee',
                        'Expert local guides',
                        '24/7 customer support',
                        'Flexible cancellation'
                      ].map((item, index) => (
                        <div key={index} className="flex items-center gap-3">
                          <CheckCircle className="w-5 h-5 text-teal-500 flex-shrink-0" />
                          <p className="text-sm text-gray-700">{item}</p>
                        </div>
                      ))}
                    </CardContent>
                  </Card>
                </motion.div>

                {/* Quick Tip */}
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4, duration: 0.5 }}
                >
                  <Card className="rounded-2xl shadow-lg border-0 bg-gradient-to-br from-amber-50 to-orange-50 hover:shadow-xl transition-all duration-200">
                    <CardContent className="pt-6">
                      <div className="flex items-start gap-3">
                        <Clock className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                        <p className="text-sm text-amber-800">
                          <strong>Quick Tip:</strong> Book at least 2 weeks in advance for better availability and rates.
                          Peak season (December-March) fills up quickly!
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              </div>
            </div>

            {/* Popular Packages - From Firebase */}
            <motion.section
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="mt-16"
            >
              <div className="text-center mb-8">
                <h2 className="text-3xl md:text-4xl font-bold font-serif text-gray-800 mb-2">Popular Packages</h2>
                <p className="text-gray-600">Choose from our most-loved travel experiences</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {packages.map((pkg, index) => (
                  <motion.div
                    key={pkg.id}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1, duration: 0.4 }}
                  >
                    <Card className="rounded-2xl shadow-lg border-0 overflow-hidden group hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 bg-white">
                      <div className="relative h-52 overflow-hidden">
                        <img
                          src={pkg.image}
                          alt={pkg.title}
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                        />
                        <span className="absolute top-4 left-4 bg-gradient-to-r from-amber-500 to-orange-500 text-white px-3 py-1 rounded-full text-xs font-semibold uppercase shadow-md">
                          {pkg.badge}
                        </span>
                      </div>
                      <CardContent className="p-5">
                        <h4 className="font-semibold text-lg mb-2 text-gray-800">{pkg.title}</h4>
                        <div className="flex items-center gap-4 text-sm text-gray-500 mb-4">
                          <span className="flex items-center gap-1">
                            <Calendar className="w-4 h-4 text-teal-500" />
                            {pkg.duration}
                          </span>
                          <span className="flex items-center gap-1">
                            <Users className="w-4 h-4 text-teal-500" />
                            {pkg.groupSize}
                          </span>
                        </div>
                        <div className="flex items-center justify-between">
                          <div>
                            <span className="text-2xl font-bold text-teal-600">${pkg.price}</span>
                            <span className="text-sm text-gray-500">/person</span>
                          </div>
                          <Button size="sm" className="bg-teal-600 hover:bg-teal-700 rounded-lg shadow-md">
                            Book Now
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </motion.section>

            {/* Assurance Bar */}
            <motion.section
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="mt-16"
            >
              <Card className="rounded-2xl shadow-lg border-0 p-6 md:p-8 bg-gradient-to-r from-teal-50 via-white to-sky-50">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
                  {assuranceItems.map((item, index) => {
                    const Icon = item.icon;
                    return (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        viewport={{ once: true }}
                        transition={{ delay: index * 0.1 }}
                        className="flex items-center gap-4"
                      >
                        <div className="w-12 h-12 rounded-xl bg-white shadow-md flex items-center justify-center flex-shrink-0">
                          <Icon className="w-6 h-6 text-teal-600" />
                        </div>
                        <div>
                          <h5 className="font-semibold text-sm text-gray-800">{item.title}</h5>
                          <p className="text-xs text-gray-500">{item.description}</p>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              </Card>
            </motion.section>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default BookNow;
