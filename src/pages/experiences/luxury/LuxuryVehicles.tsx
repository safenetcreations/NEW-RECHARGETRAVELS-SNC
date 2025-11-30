import React, { useState, useEffect, useRef } from 'react';
import { Helmet } from 'react-helmet-async';
import { motion, AnimatePresence, useScroll, useTransform, useInView } from 'framer-motion';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Crown, Car, MapPin, Phone, Mail, Star, Users, Sparkles, ArrowRight, Award, Shield, Gem, Quote, Gauge, Settings, Clock, Calendar, Zap, Briefcase } from 'lucide-react';
import LuxuryBookingForm from '@/components/luxury/LuxuryBookingForm';

const heroSlides = [
  { url: 'https://images.unsplash.com/photo-1563720360172-67b8f3dce741?w=1920&q=90', title: 'Rolls-Royce', subtitle: 'Phantom', tagline: 'The pinnacle of automotive luxury' },
  { url: 'https://images.unsplash.com/photo-1617814076367-b759c7d7e738?w=1920&q=90', title: 'Bentley', subtitle: 'Continental', tagline: 'Handcrafted British excellence' },
  { url: 'https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?w=1920&q=90', title: 'Mercedes', subtitle: 'Maybach', tagline: 'Where innovation meets opulence' },
  { url: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=1920&q=90', title: 'Porsche', subtitle: '911 Turbo', tagline: 'Performance without compromise' }
];

const vehicleCollection = [
  { id: 'rolls-phantom', name: 'Rolls-Royce Phantom', category: 'Ultra Luxury Sedan', image: 'https://images.unsplash.com/photo-1563720360172-67b8f3dce741?w=1200&q=90', passengers: 4, luggage: 3, transmission: 'Automatic', engine: '6.75L V12', power: '563 HP', features: ['Starlight Headliner', 'Rear Theater', 'Champagne Cooler', 'Massage Seats', 'Privacy Glass', 'Bespoke Audio'], amenities: ['Professional Chauffeur', 'Red Carpet Service', 'Complimentary WiFi', 'Refreshments'], pricePerDay: 1500, pricePerHour: 250, description: 'The ultimate expression of luxury motoring. The Phantom VIII offers an unparalleled sanctuary of calm, with its legendary magic carpet ride and whisper-quiet cabin.', highlights: ['Most Prestigious', 'Magic Carpet Ride', 'Bespoke Interior'], rating: 5.0, reviews: 28 },
  { id: 'bentley-continental', name: 'Bentley Continental GT', category: 'Grand Tourer', image: 'https://images.unsplash.com/photo-1617814076367-b759c7d7e738?w=1200&q=90', passengers: 4, luggage: 2, transmission: 'Automatic', engine: '6.0L W12', power: '650 HP', features: ['Diamond Quilting', 'Rotating Display', 'Naim Audio', 'Air Suspension', 'Night Vision', 'Wellness Seats'], amenities: ['Professional Chauffeur', 'Airport Meet & Greet', 'Complimentary WiFi', 'Water & Snacks'], pricePerDay: 1200, pricePerHour: 200, description: 'The definitive grand tourer. Combining breathtaking performance with handcrafted luxury, the Continental GT is the embodiment of Bentley\'s design philosophy.', highlights: ['Handcrafted Interior', '0-100 in 3.6s', 'British Excellence'], rating: 4.9, reviews: 34 },
  { id: 'mercedes-maybach', name: 'Mercedes-Maybach S680', category: 'Executive Sedan', image: 'https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?w=1200&q=90', passengers: 4, luggage: 3, transmission: 'Automatic', engine: '6.0L V12', power: '621 HP', features: ['Executive Rear Seats', 'Burmester 4D Sound', 'MBUX Entertainment', 'Hot Stone Massage', 'Champagne Flutes', 'Partition Wall'], amenities: ['Executive Chauffeur', 'Red Carpet', 'Premium WiFi', 'Newspapers & Tablets'], pricePerDay: 1100, pricePerHour: 180, description: 'The ultimate S-Class. The Maybach S680 represents the apex of Mercedes-Benz luxury, with rear-seat comfort that rivals first-class air travel.', highlights: ['First-Class Rear', 'V12 Power', 'German Engineering'], rating: 4.9, reviews: 41 },
  { id: 'range-rover', name: 'Range Rover Autobiography', category: 'Luxury SUV', image: 'https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?w=1200&q=90', passengers: 5, luggage: 4, transmission: 'Automatic', engine: '4.4L V8', power: '530 HP', features: ['Executive Class Rear', 'Terrain Response', 'Meridian Signature', 'Pixel LED Lights', 'Panoramic Roof', 'Hot Tub Seats'], amenities: ['Safari Ready', 'All-Terrain Capability', 'Cooler Box', 'Premium Audio'], pricePerDay: 800, pricePerHour: 140, description: 'Commanding presence meets serene refinement. The Range Rover Autobiography conquers any terrain while cocooning occupants in absolute luxury.', highlights: ['Go Anywhere', 'Safari Perfect', 'Commanding View'], rating: 4.8, reviews: 52 },
  { id: 'porsche-911', name: 'Porsche 911 Turbo S', category: 'Sports Car', image: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=1200&q=90', passengers: 2, luggage: 1, transmission: 'PDK Auto', engine: '3.8L Twin-Turbo', power: '640 HP', features: ['Sport Chrono', 'PASM Suspension', 'Ceramic Brakes', 'Sport Exhaust', 'Burmester Audio', 'Carbon Interior'], amenities: ['Self-Drive Available', 'Track Day Option', 'Driving Gloves', 'Route Planning'], pricePerDay: 900, pricePerHour: 150, description: 'The benchmark for sports cars. The 911 Turbo S delivers supercar performance with everyday usability and timeless design.', highlights: ['0-100 in 2.7s', 'Track Ready', 'Iconic Design'], rating: 4.9, reviews: 38 },
  { id: 'mercedes-v-class', name: 'Mercedes V-Class Exclusive', category: 'Luxury MPV', image: 'https://images.unsplash.com/photo-1609521263047-f8f205293f24?w=1200&q=90', passengers: 7, luggage: 5, transmission: 'Automatic', engine: '2.0L Diesel', power: '239 HP', features: ['Captain Chairs', 'Conference Seating', 'Ambient Lighting', 'Electric Doors', 'Privacy Glass', 'Entertainment System'], amenities: ['Group Travel', 'Airport Transfers', 'WiFi Hotspot', 'Refreshment Bar'], pricePerDay: 500, pricePerHour: 90, description: 'Luxury for the entire party. The V-Class Exclusive transforms group travel into a first-class experience with individual captain chairs and executive amenities.', highlights: ['Group Luxury', 'Conference Ready', 'Airport Perfect'], rating: 4.8, reviews: 67 },
  { id: 'bmw-7-series', name: 'BMW 760i xDrive', category: 'Executive Sedan', image: 'https://images.unsplash.com/photo-1555215695-3004980ad54e?w=1200&q=90', passengers: 4, luggage: 3, transmission: 'Automatic', engine: '4.4L V8', power: '544 HP', features: ['Executive Lounge', 'Sky Lounge Roof', 'Bowers & Wilkins', 'Gesture Control', 'Rear Entertainment', 'Massage Program'], amenities: ['Professional Driver', 'Airport Service', 'Business WiFi', 'Newspapers'], pricePerDay: 700, pricePerHour: 120, description: 'The ultimate driving machine, perfected. The BMW 7 Series combines dynamic performance with rear-seat luxury that rivals private jets.', highlights: ['Tech Leader', 'Dynamic Luxury', 'Executive Choice'], rating: 4.8, reviews: 45 },
  { id: 'lexus-lm', name: 'Lexus LM 350h', category: 'Ultra Luxury MPV', image: 'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=1200&q=90', passengers: 4, luggage: 2, transmission: 'Automatic', engine: '2.5L Hybrid', power: '250 HP', features: ['Partition Screen', 'Ottoman Seats', '26" Display', 'Refrigerator', 'Mark Levinson Audio', 'Reading Lights'], amenities: ['VIP Transfers', 'Privacy Guaranteed', 'Silent Cabin', 'Climate Control'], pricePerDay: 650, pricePerHour: 110, description: 'The four-seat limousine reimagined. The Lexus LM offers unmatched privacy and comfort with its innovative partition and first-class rear cabin.', highlights: ['Ultimate Privacy', 'Silent Hybrid', 'Japanese Luxury'], rating: 4.9, reviews: 29 }
];

const services = [
  { icon: Shield, title: 'Professional Chauffeurs', desc: 'Trained, vetted & multilingual' },
  { icon: Clock, title: '24/7 Availability', desc: 'Round-the-clock service' },
  { icon: MapPin, title: 'Island-Wide Coverage', desc: 'From Colombo to every corner' },
  { icon: Briefcase, title: 'Corporate Accounts', desc: 'Streamlined business travel' },
  { icon: Calendar, title: 'Wedding Packages', desc: 'Make your day unforgettable' },
  { icon: Zap, title: 'Instant Booking', desc: '2-hour confirmation' }
];

const testimonials = [
  { name: 'David Richardson', location: 'London, UK', vehicle: 'Rolls-Royce Phantom', image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&q=80', text: 'The Phantom was immaculate, and our chauffeur Kumar was exceptional. Made our anniversary trip truly special.', rating: 5 },
  { name: 'Sakura Tanaka', location: 'Tokyo, Japan', vehicle: 'Lexus LM 350h', image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&q=80', text: 'Perfect for our business delegation. The privacy partition and silent cabin impressed our entire team.', rating: 5 },
  { name: 'Marcus Weber', location: 'Zurich', vehicle: 'Porsche 911 Turbo S', image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&q=80', text: 'Drove from Colombo to Galle on my own. The car was pristine and the coastal roads were pure joy.', rating: 5 }
];

const AnimatedSection = ({ children, className = '' }: { children: React.ReactNode; className?: string }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  return (
    <motion.div ref={ref} initial={{ opacity: 0, y: 60 }} animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 60 }} transition={{ duration: 0.8 }} className={className}>
      {children}
    </motion.div>
  );
};

const LuxuryVehicles = () => {
  const [heroIndex, setHeroIndex] = useState(0);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedVehicle, setSelectedVehicle] = useState<string>('');
  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const heroY = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

  const categories = [...new Set(vehicleCollection.map(v => v.category))];
  const filteredVehicles = selectedCategory ? vehicleCollection.filter(v => v.category === selectedCategory) : vehicleCollection;

  // Form fields configuration
  const bookingFields = [
    { name: 'name', label: 'Full Name', type: 'text' as const, placeholder: 'Your name', required: true },
    { name: 'email', label: 'Email', type: 'email' as const, placeholder: 'your@email.com', required: true },
    { name: 'phone', label: 'Phone', type: 'tel' as const, placeholder: '+94 77 123 4567', required: true },
    { name: 'serviceType', label: 'Service Type', type: 'select' as const, required: true, options: [
      { value: 'chauffeur', label: 'With Chauffeur' },
      { value: 'self-drive', label: 'Self Drive' },
      { value: 'airport', label: 'Airport Transfer' },
      { value: 'wedding', label: 'Wedding' },
      { value: 'corporate', label: 'Corporate Event' }
    ]},
    { name: 'pickupDate', label: 'Pickup Date', type: 'date' as const, required: true },
    { name: 'pickupTime', label: 'Pickup Time', type: 'time' as const, required: true },
    { name: 'pickupLocation', label: 'Pickup Location', type: 'text' as const, placeholder: 'Hotel name or address', required: true },
    { name: 'vehicle', label: 'Preferred Vehicle', type: 'select' as const, options: [
      { value: '', label: 'Any available' },
      ...vehicleCollection.map(v => ({ value: v.name, label: v.name }))
    ]},
    { name: 'requests', label: 'Special Requests', type: 'textarea' as const, placeholder: 'Drop-off location, multiple stops, special requirements...', halfWidth: false }
  ];

  useEffect(() => {
    const timer = setInterval(() => setHeroIndex((prev) => (prev + 1) % heroSlides.length), 7000);
    return () => clearInterval(timer);
  }, []);

  return (
    <>
      <Helmet>
        <title>Luxury Car Rental Sri Lanka | Rolls-Royce, Bentley, Maybach | Recharge Travels</title>
        <meta name="description" content="Rent luxury cars in Sri Lanka with professional chauffeurs. Rolls-Royce Phantom, Bentley Continental, Mercedes-Maybach, Range Rover. From $90/hour." />
      </Helmet>
      <Header />
      <main className="min-h-screen bg-[#0a0a0a] text-white overflow-hidden">
        
        {/* CINEMATIC HERO */}
        <section ref={heroRef} className="relative h-screen overflow-hidden">
          <motion.div style={{ y: heroY }} className="absolute inset-0">
            <AnimatePresence mode="wait">
              <motion.div key={heroIndex} initial={{ opacity: 0, scale: 1.2 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} transition={{ duration: 2 }} className="absolute inset-0">
                <img src={heroSlides[heroIndex].url} alt={heroSlides[heroIndex].title} className="w-full h-full object-cover" />
              </motion.div>
            </AnimatePresence>
            <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-transparent to-[#0a0a0a]" />
            <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-transparent to-black/60" />
          </motion.div>

          <motion.div style={{ opacity: heroOpacity }} className="relative z-10 h-full flex flex-col justify-center items-center text-center px-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1, delay: 0.5 }} className="max-w-5xl">
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1, delay: 0.8 }} className="inline-flex items-center gap-3 mb-8">
                <div className="h-px w-12 bg-gradient-to-r from-transparent to-slate-400" />
                <span className="text-slate-300 font-light tracking-[0.3em] text-xs uppercase">Premium Fleet</span>
                <div className="h-px w-12 bg-gradient-to-l from-transparent to-slate-400" />
              </motion.div>

              <div className="overflow-hidden mb-4">
                <AnimatePresence mode="wait">
                  <motion.h1 key={heroIndex} initial={{ y: 100 }} animate={{ y: 0 }} exit={{ y: -100 }} transition={{ duration: 0.8 }} className="text-6xl md:text-8xl lg:text-9xl font-extralight tracking-tight text-white">
                    {heroSlides[heroIndex].title}
                  </motion.h1>
                </AnimatePresence>
              </div>
              <div className="overflow-hidden mb-8">
                <AnimatePresence mode="wait">
                  <motion.h2 key={heroIndex} initial={{ y: 80 }} animate={{ y: 0 }} exit={{ y: -80 }} transition={{ duration: 0.8, delay: 0.1 }} className="text-5xl md:text-7xl lg:text-8xl font-extralight tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-slate-200 via-white to-slate-200">
                    {heroSlides[heroIndex].subtitle}
                  </motion.h2>
                </AnimatePresence>
              </div>

              <AnimatePresence mode="wait">
                <motion.p key={heroIndex} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="text-lg md:text-xl text-gray-400 font-light tracking-wide mb-12">
                  {heroSlides[heroIndex].tagline}
                </motion.p>
              </AnimatePresence>

              <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1, delay: 1.2 }} className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg" className="group bg-white hover:bg-gray-100 text-black px-12 py-7 text-sm font-medium tracking-widest uppercase rounded-none" onClick={() => document.getElementById('fleet')?.scrollIntoView({ behavior: 'smooth' })}>
                  View Fleet <ArrowRight className="w-4 h-4 ml-3 group-hover:translate-x-1 transition-transform" />
                </Button>
                <Button size="lg" variant="outline" className="border border-white/20 text-white hover:bg-white/5 hover:border-white/40 px-12 py-7 text-sm font-medium tracking-widest uppercase rounded-none backdrop-blur-sm" onClick={() => document.getElementById('booking')?.scrollIntoView({ behavior: 'smooth' })}>
                  <Phone className="w-4 h-4 mr-3" /> Book Now
                </Button>
              </motion.div>
            </motion.div>
          </motion.div>

          <div className="absolute bottom-12 left-1/2 -translate-x-1/2 z-20 flex items-center gap-6">
            {heroSlides.map((_, idx) => (
              <button key={idx} onClick={() => setHeroIndex(idx)} className="group relative">
                <div className={`w-16 h-0.5 transition-all duration-500 ${idx === heroIndex ? 'bg-white' : 'bg-white/20 group-hover:bg-white/40'}`} />
                <span className={`absolute -top-6 left-1/2 -translate-x-1/2 text-xs transition-all ${idx === heroIndex ? 'text-white opacity-100' : 'text-white/40 opacity-0 group-hover:opacity-100'}`}>0{idx + 1}</span>
              </button>
            ))}
          </div>
        </section>

        {/* INTRODUCTION */}
        <section className="py-32 relative">
          <div className="absolute inset-0 bg-gradient-to-b from-[#0a0a0a] via-[#111] to-[#0a0a0a]" />
          <div className="container mx-auto px-4 relative z-10">
            <AnimatedSection className="max-w-4xl mx-auto text-center">
              <motion.div initial={{ scale: 0 }} whileInView={{ scale: 1 }} viewport={{ once: true }} className="w-20 h-20 mx-auto mb-8 rounded-full bg-gradient-to-br from-white/10 to-white/5 flex items-center justify-center border border-white/10">
                <Car className="w-8 h-8 text-white" />
              </motion.div>
              <h2 className="text-4xl md:text-5xl font-extralight mb-8 tracking-tight">Travel in <span className="text-white font-light">Absolute</span> Style</h2>
              <p className="text-lg text-gray-400 font-light leading-relaxed mb-12">From the legendary Rolls-Royce Phantom to the dynamic Porsche 911, our curated fleet represents the finest automobiles in the world. Each vehicle is meticulously maintained and comes with the option of an expertly trained chauffeur.</p>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                {[{ value: '8+', label: 'Luxury Vehicles', icon: Car }, { value: 'Pro', label: 'Chauffeurs', icon: Award }, { value: '24/7', label: 'Availability', icon: Clock }, { value: '100%', label: 'Insured', icon: Shield }].map((stat, idx) => (
                  <motion.div key={idx} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: idx * 0.1 }} className="text-center">
                    <stat.icon className="w-6 h-6 text-white/60 mx-auto mb-3" />
                    <div className="text-3xl font-light text-white mb-1">{stat.value}</div>
                    <div className="text-xs text-gray-500 uppercase tracking-widest">{stat.label}</div>
                  </motion.div>
                ))}
              </div>
            </AnimatedSection>
          </div>
        </section>

        {/* CATEGORY FILTER */}
        <section className="py-8 bg-[#0a0a0a] sticky top-0 z-30 border-b border-white/5">
          <div className="container mx-auto px-4">
            <div className="flex flex-wrap justify-center gap-3">
              <Button variant={selectedCategory === null ? "default" : "outline"} className={`rounded-none text-sm tracking-wider ${selectedCategory === null ? 'bg-white text-black hover:bg-gray-100' : 'border-white/20 text-gray-400 hover:bg-white/5 hover:text-white'}`} onClick={() => setSelectedCategory(null)}>
                All Vehicles
              </Button>
              {categories.map((cat) => (
                <Button key={cat} variant={selectedCategory === cat ? "default" : "outline"} className={`rounded-none text-sm tracking-wider ${selectedCategory === cat ? 'bg-white text-black hover:bg-gray-100' : 'border-white/20 text-gray-400 hover:bg-white/5 hover:text-white'}`} onClick={() => setSelectedCategory(cat)}>
                  {cat}
                </Button>
              ))}
            </div>
          </div>
        </section>

        {/* VEHICLE FLEET */}
        <section id="fleet" className="py-24 bg-[#0a0a0a]">
          <div className="container mx-auto px-4">
            <AnimatedSection className="text-center mb-20">
              <div className="inline-flex items-center gap-3 mb-6">
                <div className="h-px w-12 bg-gradient-to-r from-transparent to-white/30" />
                <span className="text-white/60 font-light tracking-[0.3em] text-xs uppercase">The Fleet</span>
                <div className="h-px w-12 bg-gradient-to-l from-transparent to-white/30" />
              </div>
              <h2 className="text-4xl md:text-6xl font-extralight tracking-tight">Exceptional <span className="text-white">Automobiles</span></h2>
            </AnimatedSection>

            <div className="grid md:grid-cols-2 gap-8">
              {filteredVehicles.map((vehicle, idx) => (
                <AnimatedSection key={vehicle.id}>
                  <motion.div whileHover={{ y: -8 }} transition={{ duration: 0.4 }} className="bg-white/[0.02] border border-white/5 hover:border-white/20 transition-all duration-500 overflow-hidden group">
                    <div className="relative aspect-[16/10] overflow-hidden">
                      <motion.img src={vehicle.image} alt={vehicle.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                      <div className="absolute top-4 left-4 flex gap-2">
                        <Badge className="bg-black/60 backdrop-blur-md text-white border-0 font-light">{vehicle.category}</Badge>
                      </div>
                      <div className="absolute top-4 right-4 bg-black/60 backdrop-blur-md px-3 py-1 flex items-center gap-1">
                        <Star className="w-4 h-4 text-white fill-white" />
                        <span className="text-white font-medium">{vehicle.rating}</span>
                      </div>
                      <div className="absolute bottom-4 left-4 right-4">
                        <h3 className="text-2xl font-light text-white mb-1">{vehicle.name}</h3>
                        <p className="text-gray-400 text-sm font-light">{vehicle.description.substring(0, 80)}...</p>
                      </div>
                    </div>
                    
                    <div className="p-6">
                      <div className="flex flex-wrap gap-4 mb-6 text-sm">
                        <div className="flex items-center gap-2 text-gray-400"><Users className="w-4 h-4" />{vehicle.passengers} Seats</div>
                        <div className="flex items-center gap-2 text-gray-400"><Briefcase className="w-4 h-4" />{vehicle.luggage} Bags</div>
                        <div className="flex items-center gap-2 text-gray-400"><Gauge className="w-4 h-4" />{vehicle.power}</div>
                        <div className="flex items-center gap-2 text-gray-400"><Settings className="w-4 h-4" />{vehicle.transmission}</div>
                      </div>
                      
                      <div className="flex flex-wrap gap-2 mb-6">
                        {vehicle.features.slice(0, 4).map((f, i) => (
                          <span key={i} className="text-xs px-3 py-1 bg-white/5 text-gray-400">{f}</span>
                        ))}
                        {vehicle.features.length > 4 && <span className="text-xs px-3 py-1 bg-white/5 text-gray-500">+{vehicle.features.length - 4} more</span>}
                      </div>
                      
                      <div className="flex items-center justify-between pt-4 border-t border-white/5">
                        <div>
                          <div className="text-xs text-gray-500 uppercase tracking-wider">From</div>
                          <div className="text-xl font-light text-white">${vehicle.pricePerHour}<span className="text-sm text-gray-500">/hour</span></div>
                          <div className="text-sm text-gray-500">${vehicle.pricePerDay}/day</div>
                        </div>
                        <div className="flex gap-2">
                          <Button className="bg-white hover:bg-gray-100 text-black rounded-none px-6" onClick={() => { setSelectedVehicle(vehicle.name); document.getElementById('booking')?.scrollIntoView({ behavior: 'smooth' }); }}>
                            Book <ArrowRight className="w-4 h-4 ml-2" />
                          </Button>
                          <a href={`https://wa.me/94777721999?text=I'm%20interested%20in%20the%20${encodeURIComponent(vehicle.name)}`} target="_blank" rel="noopener noreferrer" className="p-3 border border-white/20 hover:border-[#25D366] hover:bg-[#25D366]/10 transition-all">
                            <svg className="w-5 h-5 text-[#25D366]" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/></svg>
                          </a>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                </AnimatedSection>
              ))}
            </div>
          </div>
        </section>

        {/* SERVICES */}
        <section className="py-32 bg-gradient-to-b from-[#0a0a0a] via-[#0f0f0f] to-[#0a0a0a]">
          <div className="container mx-auto px-4">
            <AnimatedSection className="text-center mb-20">
              <div className="inline-flex items-center gap-3 mb-6"><div className="h-px w-12 bg-gradient-to-r from-transparent to-white/30" /><span className="text-white/60 font-light tracking-[0.3em] text-xs uppercase">Our Service</span><div className="h-px w-12 bg-gradient-to-l from-transparent to-white/30" /></div>
              <h2 className="text-4xl md:text-6xl font-extralight tracking-tight mb-6">Beyond <span className="text-white">Transportation</span></h2>
            </AnimatedSection>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
              {services.map((service, idx) => (
                <motion.div key={idx} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: idx * 0.1 }} whileHover={{ y: -8 }} className="group text-center p-6 bg-white/[0.02] border border-white/5 hover:border-white/20 transition-all duration-500">
                  <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-white/10 to-white/5 flex items-center justify-center group-hover:from-white/20 transition-all"><service.icon className="w-7 h-7 text-white/80" /></div>
                  <h3 className="text-white font-light mb-1">{service.title}</h3>
                  <p className="text-xs text-gray-500">{service.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* TESTIMONIALS */}
        <section className="py-32 bg-[#0a0a0a]">
          <div className="container mx-auto px-4">
            <AnimatedSection className="text-center mb-16">
              <div className="inline-flex items-center gap-3 mb-6"><div className="h-px w-12 bg-gradient-to-r from-transparent to-white/30" /><span className="text-white/60 font-light tracking-[0.3em] text-xs uppercase">Client Stories</span><div className="h-px w-12 bg-gradient-to-l from-transparent to-white/30" /></div>
              <h2 className="text-4xl md:text-5xl font-extralight tracking-tight">Driven by <span className="text-white">Excellence</span></h2>
            </AnimatedSection>
            <div className="grid md:grid-cols-3 gap-8">
              {testimonials.map((t, idx) => (
                <motion.div key={idx} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: idx * 0.2 }} className="bg-white/[0.02] border border-white/5 p-8 relative">
                  <Quote className="absolute top-6 right-6 w-8 h-8 text-white/10" />
                  <div className="flex gap-1 mb-6">{[...Array(t.rating)].map((_, i) => <Star key={i} className="w-4 h-4 text-white fill-white" />)}</div>
                  <p className="text-gray-300 font-light leading-relaxed mb-8 italic">"{t.text}"</p>
                  <div className="flex items-center gap-4">
                    <img src={t.image} alt={t.name} className="w-12 h-12 rounded-full object-cover" />
                    <div><div className="text-white font-light">{t.name}</div><div className="text-xs text-gray-500">{t.location}</div></div>
                  </div>
                  <div className="mt-4 pt-4 border-t border-white/5"><span className="text-xs text-white/40 uppercase tracking-wider">{t.vehicle}</span></div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* BOOKING FORM */}
        <section id="booking" className="py-32 bg-gradient-to-b from-[#0a0a0a] to-[#111] relative">
          <div className="absolute inset-0 opacity-20"><div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-white/5 rounded-full blur-[120px]" /></div>
          <div className="container mx-auto px-4 relative z-10">
            <div className="max-w-4xl mx-auto">
              <AnimatedSection className="text-center mb-16">
                <div className="inline-flex items-center gap-3 mb-6"><div className="h-px w-12 bg-gradient-to-r from-transparent to-white/30" /><span className="text-white/60 font-light tracking-[0.3em] text-xs uppercase">Reserve</span><div className="h-px w-12 bg-gradient-to-l from-transparent to-white/30" /></div>
                <h2 className="text-4xl md:text-6xl font-extralight tracking-tight mb-4">Book Your <span className="text-white">Ride</span></h2>
                <p className="text-gray-400 font-light">Confirmation within 2 hours, 24/7</p>
              </AnimatedSection>

              <LuxuryBookingForm
                type="vehicle"
                title="Request Luxury Vehicle"
                subtitle="Get instant confirmation via email & WhatsApp"
                fields={bookingFields}
                accentColor="white"
              />
            </div>
          </div>
        </section>

        {/* CONTACT BAR */}
        <section className="py-16 bg-[#111] border-t border-white/5">
          <div className="container mx-auto px-4">
            <div className="flex flex-col lg:flex-row items-center justify-between gap-8">
              <div className="text-center lg:text-left">
                <h3 className="text-2xl font-extralight text-white mb-2">Ready for <span className="text-white">Luxury</span> Travel?</h3>
                <p className="text-gray-400 font-light">Our concierge team is available around the clock</p>
              </div>
              <div className="flex flex-wrap justify-center gap-4">
                <a href="https://wa.me/94777721999?text=I'm%20interested%20in%20luxury%20vehicle%20rental" target="_blank" rel="noopener noreferrer" className="group flex items-center gap-3 bg-[#25D366]/10 hover:bg-[#25D366] border border-[#25D366]/30 hover:border-[#25D366] text-white px-8 py-4 transition-all duration-300">
                  <svg className="w-5 h-5 text-[#25D366] group-hover:text-white transition-colors" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/></svg>
                  <span className="font-medium tracking-wider">WhatsApp</span>
                </a>
                <a href="tel:+94777721999" className="flex items-center gap-3 border border-white/20 hover:border-white/40 text-white px-8 py-4 transition-all"><Phone className="w-5 h-5" /><span className="font-light">+94 777 721 999</span></a>
                <a href="mailto:luxury@rechargetravels.com" className="flex items-center gap-3 border border-white/20 hover:border-white/40 text-white px-8 py-4 transition-all"><Mail className="w-5 h-5" /><span className="font-light">luxury@rechargetravels.com</span></a>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
};

export default LuxuryVehicles;
