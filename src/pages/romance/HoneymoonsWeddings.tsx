import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import { Heart, MapPin, Calendar, Users, Star, Check, Sparkles, Camera, Plane, Mountain, Waves, Music, Phone, Mail, X, Send, Loader2, Quote, Flower2, MessageCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Badge } from '@/components/ui/badge';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { getAllRomanceData, WeddingPackage, HoneymoonPackage, RomanceFAQ, RomanceTestimonial, RomancePageSettings } from '@/services/romanceService';

const weddingThemes: Record<string, { gradient: string; bg: string; text: string }> = {
  beach: { gradient: 'from-cyan-400 to-teal-400', bg: 'bg-gradient-to-br from-cyan-50 to-teal-50', text: 'text-teal-800' },
  elephant: { gradient: 'from-amber-400 to-orange-400', bg: 'bg-gradient-to-br from-amber-50 to-orange-50', text: 'text-amber-900' },
  cultural: { gradient: 'from-purple-400 to-pink-400', bg: 'bg-gradient-to-br from-purple-50 to-pink-50', text: 'text-purple-900' },
  'tea-country': { gradient: 'from-emerald-400 to-green-400', bg: 'bg-gradient-to-br from-emerald-50 to-green-50', text: 'text-emerald-900' },
  elopement: { gradient: 'from-rose-400 to-pink-400', bg: 'bg-gradient-to-br from-rose-50 to-pink-50', text: 'text-rose-900' },
  luxury: { gradient: 'from-yellow-400 to-amber-400', bg: 'bg-gradient-to-br from-yellow-50 to-amber-50', text: 'text-yellow-900' }
};

const honeymoonThemes: Record<string, { gradient: string; bg: string }> = {
  budget: { gradient: 'from-emerald-400 to-teal-500', bg: 'bg-gradient-to-br from-emerald-50 to-teal-50' },
  signature: { gradient: 'from-rose-400 to-pink-500', bg: 'bg-gradient-to-br from-rose-50 to-pink-50' },
  luxury: { gradient: 'from-amber-400 to-orange-500', bg: 'bg-gradient-to-br from-amber-50 to-orange-50' }
};

// Wedding Detail Modal
const WeddingModal = ({ pkg, onClose, onBook }: { pkg: WeddingPackage; onClose: () => void; onBook: () => void }) => {
  const theme = weddingThemes[pkg.type] || weddingThemes.beach;
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[200] overflow-y-auto" onClick={onClose}>
      <div className={`min-h-screen ${theme.bg}`} onClick={e => e.stopPropagation()}>
        <button onClick={onClose} className="fixed top-6 right-6 z-50 p-3 bg-white/90 hover:bg-white shadow-lg rounded-full"><X className="w-6 h-6 text-gray-700" /></button>
        <div className="relative h-[60vh] overflow-hidden">
          <img src={pkg.image} alt={pkg.name} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-white via-white/30 to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 p-8 md:p-12">
            <div className={`inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r ${theme.gradient} text-white rounded-full text-sm mb-4`}>
              <Heart className="w-4 h-4" />{pkg.type.replace('-', ' ').toUpperCase()}
            </div>
            <h1 className={`text-4xl md:text-5xl font-light ${theme.text} mb-2`}>{pkg.name}</h1>
            <p className="text-xl text-gray-600 italic">{pkg.tagline}</p>
          </div>
        </div>
        <div className="max-w-5xl mx-auto px-6 py-12">
          <div className="flex flex-wrap justify-center gap-8 mb-12 p-6 bg-white/80 rounded-2xl shadow-lg">
            <div className="text-center"><div className="text-3xl font-light text-rose-500">${pkg.priceFrom.toLocaleString()}</div><div className="text-gray-500 text-sm">Starting From</div></div>
            <div className="w-px bg-gray-200" />
            <div className="text-center"><div className="text-3xl font-light text-rose-500">{pkg.guestsUpTo}</div><div className="text-gray-500 text-sm">Guests Max</div></div>
            <div className="w-px bg-gray-200" />
            <div className="text-center"><div className="text-3xl font-light text-rose-500">{pkg.venues.length}</div><div className="text-gray-500 text-sm">Venues</div></div>
          </div>
          <p className="text-lg text-gray-700 text-center mb-12 max-w-3xl mx-auto">{pkg.fullDescription}</p>
          <div className="grid md:grid-cols-2 gap-8 mb-12">
            <div className="bg-white rounded-2xl p-6 shadow-lg">
              <h3 className="text-xl font-medium text-gray-800 mb-4 flex items-center gap-2"><Check className="w-6 h-6 text-emerald-500" />What's Included</h3>
              <ul className="space-y-2">{pkg.includes.map((item, i) => <li key={i} className="flex items-start gap-2 text-gray-600"><Check className="w-4 h-4 text-emerald-500 mt-1 flex-shrink-0" />{item}</li>)}</ul>
            </div>
            <div className="bg-white rounded-2xl p-6 shadow-lg">
              <h3 className="text-xl font-medium text-gray-800 mb-4 flex items-center gap-2"><Sparkles className="w-6 h-6 text-amber-500" />Highlights</h3>
              <div className="space-y-2">{pkg.highlights.map((h, i) => <div key={i} className="flex items-center gap-2 p-2 bg-rose-50 rounded-lg"><Star className="w-4 h-4 text-amber-400" /><span className="text-gray-700">{h}</span></div>)}</div>
            </div>
          </div>
          <div className="text-center mb-12">
            <h3 className="text-xl font-medium text-gray-800 mb-4">Available Venues</h3>
            <div className="flex flex-wrap justify-center gap-3">{pkg.venues.map((v, i) => <span key={i} className="px-4 py-2 bg-white rounded-full shadow text-gray-700">{v}</span>)}</div>
          </div>
          <div className={`bg-gradient-to-r ${theme.gradient} rounded-2xl p-8 text-white text-center`}>
            <Heart className="w-12 h-12 mx-auto mb-4 opacity-80" />
            <h3 className="text-2xl font-light mb-4">Ready to Say "I Do"?</h3>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="bg-white text-gray-800 hover:bg-gray-100" onClick={onBook}><Calendar className="w-5 h-5 mr-2" />Book Now</Button>
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/20 bg-transparent" onClick={() => window.open('https://wa.me/94777721999', '_blank')}><MessageCircle className="w-5 h-5 mr-2" />WhatsApp</Button>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

// Honeymoon Detail Modal
const HoneymoonModal = ({ pkg, onClose, onBook }: { pkg: HoneymoonPackage; onClose: () => void; onBook: () => void }) => {
  const theme = honeymoonThemes[pkg.tier] || honeymoonThemes.signature;
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[200] overflow-y-auto" onClick={onClose}>
      <div className={`min-h-screen ${theme.bg}`} onClick={e => e.stopPropagation()}>
        <button onClick={onClose} className="fixed top-6 right-6 z-50 p-3 bg-white/90 hover:bg-white shadow-lg rounded-full"><X className="w-6 h-6 text-gray-700" /></button>
        <div className="relative h-[60vh] overflow-hidden">
          <img src={pkg.image} alt={pkg.name} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-white via-white/30 to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 p-8 md:p-12">
            <div className={`inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r ${theme.gradient} text-white rounded-full text-sm mb-4`}>
              <Plane className="w-4 h-4" />{pkg.tier.toUpperCase()} HONEYMOON
            </div>
            <h1 className="text-4xl md:text-5xl font-light text-gray-800 mb-2">{pkg.name}</h1>
            <p className="text-xl text-gray-600 italic">{pkg.tagline}</p>
          </div>
        </div>
        <div className="max-w-5xl mx-auto px-6 py-12">
          <div className="flex flex-wrap justify-center gap-8 mb-12 p-6 bg-white/80 rounded-2xl shadow-lg">
            <div className="text-center"><div className="text-3xl font-light text-rose-500">${pkg.priceFrom.toLocaleString()}</div><div className="text-gray-500 text-sm">Per Couple</div></div>
            <div className="w-px bg-gray-200" />
            <div className="text-center"><div className="text-3xl font-light text-rose-500">{pkg.nights}</div><div className="text-gray-500 text-sm">Nights</div></div>
          </div>
          <p className="text-lg text-gray-700 text-center mb-12 max-w-3xl mx-auto">{pkg.fullDescription}</p>
          <div className="grid md:grid-cols-2 gap-8 mb-12">
            <div className="bg-white rounded-2xl p-6 shadow-lg">
              <h3 className="text-xl font-medium text-gray-800 mb-4"><Sparkles className="w-6 h-6 text-rose-400 inline mr-2" />Highlights</h3>
              <div className="space-y-2">{pkg.highlights.map((h, i) => <div key={i} className="flex items-center gap-2 p-2 bg-rose-50 rounded-lg"><Star className="w-4 h-4 text-amber-400" /><span className="text-gray-700">{h}</span></div>)}</div>
            </div>
            <div className="bg-white rounded-2xl p-6 shadow-lg">
              <h3 className="text-xl font-medium text-gray-800 mb-4"><Check className="w-6 h-6 text-emerald-500 inline mr-2" />Included</h3>
              <ul className="space-y-2">{pkg.includes.map((item, i) => <li key={i} className="flex items-start gap-2 text-gray-600"><Check className="w-4 h-4 text-emerald-500 mt-1" />{item}</li>)}</ul>
            </div>
          </div>
          {pkg.itinerary && pkg.itinerary.length > 0 && (
            <div className="mb-12">
              <h3 className="text-xl font-medium text-gray-800 mb-6 text-center">Your Journey</h3>
              <div className="space-y-4">{pkg.itinerary.map((day, i) => (
                <div key={i} className="flex gap-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-rose-400 to-pink-400 rounded-full flex items-center justify-center text-white font-medium flex-shrink-0">D{day.day}</div>
                  <div className="flex-1 bg-white rounded-xl p-4 shadow"><h4 className="font-medium text-gray-800">{day.title}</h4><p className="text-gray-600 text-sm">{day.description}</p></div>
                </div>
              ))}</div>
            </div>
          )}
          <div className={`bg-gradient-to-r ${theme.gradient} rounded-2xl p-8 text-white text-center`}>
            <Heart className="w-12 h-12 mx-auto mb-4 opacity-80" />
            <h3 className="text-2xl font-light mb-4">Begin Your Love Story</h3>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="bg-white text-gray-800 hover:bg-gray-100" onClick={onBook}><Calendar className="w-5 h-5 mr-2" />Book Now</Button>
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/20 bg-transparent" onClick={() => window.open('https://wa.me/94777721999', '_blank')}><MessageCircle className="w-5 h-5 mr-2" />WhatsApp</Button>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

const HoneymoonsWeddings: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [settings, setSettings] = useState<RomancePageSettings | null>(null);
  const [weddingPackages, setWeddingPackages] = useState<WeddingPackage[]>([]);
  const [honeymoonPackages, setHoneymoonPackages] = useState<HoneymoonPackage[]>([]);
  const [faqs, setFaqs] = useState<RomanceFAQ[]>([]);
  const [testimonials, setTestimonials] = useState<RomanceTestimonial[]>([]);
  const [selectedWedding, setSelectedWedding] = useState<WeddingPackage | null>(null);
  const [selectedHoneymoon, setSelectedHoneymoon] = useState<HoneymoonPackage | null>(null);
  const [activeTab, setActiveTab] = useState<string>('weddings');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getAllRomanceData();
        setSettings(data.settings);
        setWeddingPackages(data.weddingPackages);
        setHoneymoonPackages(data.honeymoonPackages);
        setFaqs(data.faqs);
        setTestimonials(data.testimonials);
      } catch (error) { console.error('Error:', error); }
      setLoading(false);
    };
    fetchData();
  }, []);

  const bookWedding = (pkg: WeddingPackage) => {
    const params = new URLSearchParams({
      type: 'wedding', packageId: pkg.id, package: pkg.name, price: pkg.priceFrom.toString(),
      image: pkg.image, weddingType: pkg.type, venues: pkg.venues.join(',')
    });
    navigate(`/booking/romance?${params.toString()}`);
  };

  const bookHoneymoon = (pkg: HoneymoonPackage) => {
    const params = new URLSearchParams({
      type: 'honeymoon', packageId: pkg.id, package: pkg.name, price: pkg.priceFrom.toString(),
      image: pkg.image, nights: pkg.nights.toString()
    });
    navigate(`/booking/romance?${params.toString()}`);
  };

  if (loading) return <div className="min-h-screen bg-gradient-to-br from-rose-50 to-pink-50 flex items-center justify-center"><Loader2 className="w-12 h-12 animate-spin text-rose-500" /></div>;

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 via-white to-pink-50">
      <Helmet><title>Weddings & Honeymoons in Sri Lanka | Recharge Travels</title></Helmet>
      <Header />

      {/* HERO - 16:9 aspect ratio with buttons overlay */}
      <section className="relative">
        {/* Hero Image */}
        <div className="relative aspect-video max-h-[75vh] overflow-hidden">
          <img src={settings?.heroImageUrl || 'https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=1920'} alt="Romance" className="absolute inset-0 w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-b from-rose-900/50 via-rose-800/30 to-rose-900/60" />
          
          {/* Hero Content */}
          <div className="absolute inset-0 flex flex-col items-center justify-center px-4 text-center">
            <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} className="w-16 h-16 md:w-20 md:h-20 bg-white/30 rounded-full flex items-center justify-center mb-4 md:mb-6">
              <Heart className="w-8 h-8 md:w-10 md:h-10 text-white" fill="currentColor" />
            </motion.div>
            <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="text-rose-100 tracking-[0.2em] uppercase text-xs md:text-sm mb-2 md:mb-3">Destination Weddings & Honeymoons</motion.p>
            <motion.h1 initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="text-3xl md:text-5xl lg:text-6xl font-light text-white mb-2 md:mb-3">
              Sri Lankan <span className="font-serif italic text-rose-200">Romance</span>
            </motion.h1>
            <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }} className="text-base md:text-lg text-white/90 max-w-xl">Where your love story becomes an unforgettable celebration</motion.p>
          </div>
        </div>

        {/* Buttons - Positioned at bottom, overlapping the hero */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }} 
          animate={{ opacity: 1, y: 0 }} 
          transition={{ delay: 0.8 }} 
          className="absolute bottom-0 left-0 right-0 transform translate-y-1/2 z-20 flex justify-center px-4"
        >
          <div className="flex flex-col sm:flex-row gap-4 md:gap-6 bg-white/10 backdrop-blur-md p-4 md:p-6 rounded-3xl shadow-2xl">
            <motion.button
              whileHover={{ scale: 1.05, boxShadow: '0 25px 50px rgba(244, 63, 94, 0.5)' }}
              whileTap={{ scale: 0.98 }}
              onClick={() => { setActiveTab('weddings'); document.getElementById('packages')?.scrollIntoView({ behavior: 'smooth' }); }}
              className="group relative overflow-hidden bg-gradient-to-r from-rose-500 via-pink-500 to-rose-400 text-white px-10 md:px-14 py-5 md:py-6 rounded-full text-lg md:text-xl font-semibold shadow-2xl shadow-rose-500/40 transition-all duration-300"
            >
              <span className="absolute inset-0 bg-gradient-to-r from-pink-400 via-rose-400 to-pink-500 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <span className="relative flex items-center gap-3">
                <Heart className="w-6 h-6 md:w-7 md:h-7 animate-pulse" fill="currentColor" />
                <span>Wedding Packages</span>
                <Sparkles className="w-5 h-5 md:w-6 md:h-6 opacity-80" />
              </span>
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05, boxShadow: '0 25px 50px rgba(255, 255, 255, 0.4)' }}
              whileTap={{ scale: 0.98 }}
              onClick={() => { setActiveTab('honeymoons'); document.getElementById('packages')?.scrollIntoView({ behavior: 'smooth' }); }}
              className="group relative overflow-hidden bg-white text-rose-600 px-10 md:px-14 py-5 md:py-6 rounded-full text-lg md:text-xl font-semibold shadow-2xl transition-all duration-300"
            >
              <span className="absolute inset-0 bg-gradient-to-r from-rose-50 to-pink-100 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <span className="relative flex items-center gap-3">
                <Plane className="w-6 h-6 md:w-7 md:h-7 group-hover:translate-x-1 transition-transform" />
                <span>Honeymoon Escapes</span>
                <Star className="w-5 h-5 md:w-6 md:h-6 opacity-80" />
              </span>
            </motion.button>
          </div>
        </motion.div>
      </section>
      
      {/* Spacer for buttons overflow */}
      <div className="h-16 md:h-20 bg-white"></div>

      {/* WHY SRI LANKA */}
      <section className="py-20 px-4 bg-white">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-12">
            <Flower2 className="w-10 h-10 text-rose-400 mx-auto mb-4" />
            <h2 className="text-3xl md:text-4xl font-light text-gray-800">Why Sri Lanka for <span className="font-serif italic text-rose-500">Romance</span>?</h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
            {[
              { icon: Waves, title: 'Pristine Beaches', desc: 'Golden sands & turquoise waters' },
              { icon: Mountain, title: 'Misty Highlands', desc: 'Tea plantations & cool air' },
              { icon: Heart, title: 'Ethical Elephants', desc: 'Majestic blessing ceremonies' },
              { icon: Star, title: 'Affordable Luxury', desc: 'World-class at great value' },
              { icon: Camera, title: 'Stunning Photos', desc: 'Breathtaking backdrops' },
              { icon: Users, title: 'Warm Hospitality', desc: 'Friendly locals' }
            ].map((item, i) => (
              <div key={i} className="p-5 bg-gradient-to-br from-rose-50 to-pink-50 rounded-xl text-center">
                <div className="w-12 h-12 bg-gradient-to-r from-rose-400 to-pink-400 rounded-full flex items-center justify-center mx-auto mb-3">
                  <item.icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="font-medium text-gray-800 mb-1">{item.title}</h3>
                <p className="text-gray-600 text-sm">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PACKAGES */}
      <section id="packages" className="py-20 px-4 bg-gradient-to-br from-rose-50 via-white to-pink-50">
        <div className="container mx-auto max-w-7xl">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <div className="flex justify-center mb-10">
              <TabsList className="bg-white shadow-lg p-1 rounded-full">
                <TabsTrigger value="weddings" className="px-6 py-3 rounded-full data-[state=active]:bg-rose-500 data-[state=active]:text-white"><Heart className="w-4 h-4 mr-2" />Weddings</TabsTrigger>
                <TabsTrigger value="honeymoons" className="px-6 py-3 rounded-full data-[state=active]:bg-rose-500 data-[state=active]:text-white"><Plane className="w-4 h-4 mr-2" />Honeymoons</TabsTrigger>
              </TabsList>
            </div>
            <TabsContent value="weddings">
              <div className="text-center mb-10"><h2 className="text-3xl font-light text-gray-800">Destination <span className="font-serif italic text-rose-500">Wedding</span> Packages</h2></div>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {weddingPackages.map((pkg) => {
                  const theme = weddingThemes[pkg.type] || weddingThemes.beach;
                  return (
                    <Card key={pkg.id} className="bg-white border-0 shadow-lg hover:shadow-xl transition-all overflow-hidden rounded-2xl cursor-pointer" onClick={() => setSelectedWedding(pkg)}>
                      <div className="relative h-52 overflow-hidden">
                        <img src={pkg.image} alt={pkg.name} className="w-full h-full object-cover hover:scale-110 transition-transform duration-500" />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                        {pkg.isFeatured && <Badge className="absolute top-3 right-3 bg-amber-400 text-amber-900">Popular</Badge>}
                        <div className={`absolute top-3 left-3 px-3 py-1 bg-gradient-to-r ${theme.gradient} text-white rounded-full text-xs`}>{pkg.type.replace('-', ' ')}</div>
                        <div className="absolute bottom-3 left-3 right-3"><h3 className="text-xl font-light text-white">{pkg.name}</h3></div>
                      </div>
                      <CardContent className="p-5">
                        <p className="text-gray-600 text-sm mb-4 line-clamp-2">{pkg.description}</p>
                        <div className="flex items-center justify-between pt-3 border-t">
                          <div><span className="text-gray-400 text-xs">From</span><p className="text-xl font-light text-rose-500">${pkg.priceFrom.toLocaleString()}</p></div>
                          <div className="flex gap-2">
                            <Button variant="outline" className="border-rose-300 text-rose-500 hover:bg-rose-50 rounded-full text-sm" onClick={(e) => { e.stopPropagation(); setSelectedWedding(pkg); }}>Details</Button>
                            <Button className="bg-rose-500 text-white hover:bg-rose-600 rounded-full text-sm" onClick={(e) => { e.stopPropagation(); bookWedding(pkg); }}>Book Now</Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </TabsContent>
            <TabsContent value="honeymoons">
              <div className="text-center mb-10"><h2 className="text-3xl font-light text-gray-800">Romantic <span className="font-serif italic text-rose-500">Honeymoon</span> Escapes</h2></div>
              <div className="grid lg:grid-cols-3 gap-6">
                {honeymoonPackages.map((pkg) => {
                  const theme = honeymoonThemes[pkg.tier] || honeymoonThemes.signature;
                  return (
                    <div key={pkg.id} className="relative h-[480px] rounded-2xl overflow-hidden shadow-xl cursor-pointer group" onClick={() => setSelectedHoneymoon(pkg)}>
                      <img src={pkg.image} alt={pkg.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
                      {pkg.isFeatured && <Badge className="absolute top-4 right-4 bg-amber-400 text-amber-900">Best Seller</Badge>}
                      <div className="absolute inset-0 p-6 flex flex-col justify-end">
                        <div className={`inline-flex items-center gap-2 px-3 py-1 bg-gradient-to-r ${theme.gradient} text-white rounded-full text-sm w-fit mb-3`}><Star className="w-3 h-3" />{pkg.tier.toUpperCase()}</div>
                        <h3 className="text-2xl font-light text-white mb-2">{pkg.name}</h3>
                        <p className="text-white/80 text-sm mb-4">{pkg.tagline}</p>
                        <div className="flex items-center justify-between pt-4 border-t border-white/20">
                          <div><span className="text-white/60 text-xs">From</span><p className="text-2xl font-light text-white">${pkg.priceFrom.toLocaleString()}</p></div>
                          <div className="flex gap-2">
                            <Button variant="outline" className="border-white text-white hover:bg-white/20 rounded-full text-sm bg-transparent" onClick={(e) => { e.stopPropagation(); setSelectedHoneymoon(pkg); }}>Details</Button>
                            <Button className="bg-white text-gray-800 hover:bg-gray-100 rounded-full text-sm" onClick={(e) => { e.stopPropagation(); bookHoneymoon(pkg); }}>Book Now</Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="py-20 px-4 bg-white">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-12"><Quote className="w-10 h-10 text-rose-300 mx-auto mb-4" /><h2 className="text-3xl font-light text-gray-800">Real <span className="font-serif italic text-rose-500">Love</span> Stories</h2></div>
          <div className="grid md:grid-cols-3 gap-6">
            {testimonials.map((t) => (
              <div key={t.id} className="p-6 bg-gradient-to-br from-rose-50 to-pink-50 rounded-2xl">
                <div className="flex mb-3">{[...Array(t.rating)].map((_, j) => <Star key={j} className="w-4 h-4 text-amber-400" fill="currentColor" />)}</div>
                <p className="text-gray-700 italic mb-4">"{t.quote}"</p>
                <div className="flex items-center gap-3">
                  <img src={t.image} alt={t.names} className="w-10 h-10 rounded-full object-cover" />
                  <div><p className="font-medium text-gray-800 text-sm">{t.names}</p><p className="text-gray-500 text-xs">{t.country}</p></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-20 px-4 bg-gradient-to-br from-rose-50 to-pink-50">
        <div className="container mx-auto max-w-3xl">
          <div className="text-center mb-12"><h2 className="text-3xl font-light text-gray-800">Frequently <span className="font-serif italic text-rose-500">Asked</span></h2></div>
          <Accordion type="single" collapsible className="space-y-3">
            {faqs.map((faq) => (
              <AccordionItem key={faq.id} value={faq.id} className="bg-white rounded-xl shadow px-5 border-0">
                <AccordionTrigger className="text-gray-800 hover:text-rose-500 py-4">{faq.question}</AccordionTrigger>
                <AccordionContent className="text-gray-600 pb-4">{faq.answer}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-4 bg-gradient-to-r from-rose-500 to-pink-500">
        <div className="container mx-auto max-w-4xl text-center text-white">
          <Heart className="w-16 h-16 mx-auto mb-6 opacity-80" />
          <h2 className="text-4xl font-light mb-4">Ready to Start Planning?</h2>
          <p className="text-xl opacity-90 mb-8">Our romance specialists are here to create your perfect Sri Lankan celebration</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-white text-rose-600 hover:bg-gray-100 px-8 py-6 text-lg" onClick={() => window.open('https://wa.me/94777721999', '_blank')}>
              <MessageCircle className="w-5 h-5 mr-2" />Chat on WhatsApp
            </Button>
            <Button size="lg" variant="outline" className="border-2 border-white text-white hover:bg-white/20 px-8 py-6 text-lg bg-transparent">
              <Phone className="w-5 h-5 mr-2" />+94 777 721 999
            </Button>
          </div>
        </div>
      </section>

      {/* Modals */}
      <AnimatePresence>
        {selectedWedding && <WeddingModal pkg={selectedWedding} onClose={() => setSelectedWedding(null)} onBook={() => { bookWedding(selectedWedding); setSelectedWedding(null); }} />}
        {selectedHoneymoon && <HoneymoonModal pkg={selectedHoneymoon} onClose={() => setSelectedHoneymoon(null)} onBook={() => { bookHoneymoon(selectedHoneymoon); setSelectedHoneymoon(null); }} />}
      </AnimatePresence>

      <Footer />
    </div>
  );
};

export default HoneymoonsWeddings;
