import React, { useState, useEffect, useRef } from 'react';
import { Helmet } from 'react-helmet-async';
import { motion, AnimatePresence, useScroll, useTransform, useInView } from 'framer-motion';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Star, MapPin, Phone, Mail, ArrowRight, Wifi, Car, Bed, Bath, Maximize, Building, Utensils, Waves, Dumbbell, Sparkles, Home, Crown, Coffee, Wind, Gem, Users, Calendar, CheckCircle2, Shield, Clock, Tv, AirVent, ChefHat, Shirt, Key, Sofa } from 'lucide-react';
import LuxuryBookingForm from '@/components/luxury/LuxuryBookingForm';

const heroSlides = [
  { url: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=1920&q=90', title: 'Penthouse Living', subtitle: 'Colombo', tagline: 'Sky-high luxury with panoramic city views' },
  { url: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=1920&q=90', title: 'Serviced Suites', subtitle: 'Prime Locations', tagline: 'Hotel amenities, home comfort' },
  { url: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1920&q=90', title: 'Executive Living', subtitle: 'Business Class', tagline: 'Work, live, and thrive' }
];

const locations = [
  { id: 'all', name: 'All Locations' },
  { id: 'colombo-1-3', name: 'Colombo 1-3' },
  { id: 'colombo-4-7', name: 'Colombo 4-7' },
  { id: 'kandy', name: 'Kandy' },
  { id: 'galle', name: 'Galle' },
  { id: 'negombo', name: 'Negombo' }
];

const apartmentCollection = [
  // COLOMBO PRIME (1-3)
  { id: 'cinnamon-life-penthouse', name: 'Cinnamon Life Penthouse', location: 'Colombo 1', area: 'colombo-1-3', image: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=1200&q=90', category: 'Penthouse', bedrooms: 4, bathrooms: 5, sqft: 5500, floor: '47th Floor', pricePerNight: 1200, pricePerMonth: 25000, description: 'Sri Lanka\'s most prestigious address. This 47th floor penthouse offers 360° views of Colombo, the ocean, and beyond from the iconic Cinnamon Life tower.', highlights: ['360° Views', 'Private Pool', 'Smart Home', 'Helipad Access'], amenities: ['Concierge', 'Infinity Pool', 'Gym', 'Spa', 'Parking', 'Security'], rating: 5.0, reviews: 45 },
  { id: 'altair-sky-villa', name: 'Altair Sky Villa', location: 'Colombo 2', area: 'colombo-1-3', image: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1200&q=90', category: 'Sky Villa', bedrooms: 3, bathrooms: 4, sqft: 4200, floor: '55th Floor', pricePerNight: 950, pricePerMonth: 18000, description: 'In Asia\'s tallest residential twin towers, this sky villa features wraparound terraces and unobstructed Indian Ocean views.', highlights: ['Tallest in Asia', 'Ocean Views', 'Designer Interior', 'Private Terrace'], amenities: ['Sky Lounge', 'Pool', 'Gym', 'Concierge', 'Parking', 'BBQ Deck'], rating: 4.9, reviews: 67 },
  { id: 'shangri-la-residence', name: 'Shangri-La Residence', location: 'Colombo 1', area: 'colombo-1-3', image: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=1200&q=90', category: 'Serviced Apartment', bedrooms: 2, bathrooms: 2, sqft: 1800, floor: '32nd Floor', pricePerNight: 550, pricePerMonth: 12000, description: 'Live within the Shangri-La Hotel with full access to all hotel facilities including the legendary Chi Spa and signature restaurants.', highlights: ['Hotel Services', 'Chi Spa Access', 'Room Service', 'Housekeeping'], amenities: ['Concierge', 'Pool', 'Spa', 'Restaurants', 'Parking', 'Gym'], rating: 4.9, reviews: 234 },
  { id: 'clearpoint-colombo', name: 'Clearpoint Residencies', location: 'Colombo 3', area: 'colombo-1-3', image: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=1200&q=90', category: 'Luxury Apartment', bedrooms: 3, bathrooms: 3, sqft: 2800, floor: '28th Floor', pricePerNight: 380, pricePerMonth: 8000, description: 'Modern luxury in the heart of Colpetty, walking distance to premium shopping, restaurants, and the Indian Ocean waterfront.', highlights: ['Central Location', 'Modern Design', 'City Views', 'Walk to Beach'], amenities: ['Pool', 'Gym', 'Parking', 'Security', 'Generator', 'Lift'], rating: 4.7, reviews: 156 },
  
  // COLOMBO SUBURBAN (4-7)
  { id: 'havelock-city-duplex', name: 'Havelock City Duplex', location: 'Colombo 5', area: 'colombo-4-7', image: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=1200&q=90', category: 'Duplex Penthouse', bedrooms: 4, bathrooms: 4, sqft: 4000, floor: 'Top 2 Floors', pricePerNight: 650, pricePerMonth: 14000, description: 'Sprawling duplex penthouse in Colombo\'s premier mixed-use development with private rooftop garden and entertainment space.', highlights: ['Rooftop Garden', 'Private Lift', 'Entertainment Room', 'Mall Access'], amenities: ['Mall Below', 'Pool', 'Gym', 'Tennis', 'Parking', 'Concierge'], rating: 4.8, reviews: 89 },
  { id: 'cresent-residence', name: 'Crescent Residence', location: 'Colombo 4', area: 'colombo-4-7', image: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=1200&q=90', category: 'Executive Suite', bedrooms: 2, bathrooms: 2, sqft: 1600, floor: '18th Floor', pricePerNight: 280, pricePerMonth: 5500, description: 'Elegant serviced apartments near embassies and hospitals, ideal for medical travelers and business executives.', highlights: ['Near Hospitals', 'Embassy District', 'Quiet Location', 'Green Views'], amenities: ['Pool', 'Gym', 'Parking', 'Housekeeping', 'Laundry', 'Security'], rating: 4.6, reviews: 198 },
  { id: 'ocean-edge-apartment', name: 'Ocean Edge Colombo', location: 'Colombo 6', area: 'colombo-4-7', image: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1200&q=90', category: 'Beachfront Apartment', bedrooms: 3, bathrooms: 3, sqft: 2400, floor: '15th Floor', pricePerNight: 420, pricePerMonth: 9000, description: 'Wake up to the sound of waves in this beachfront apartment along Galle Face, with direct sunset views every evening.', highlights: ['Beachfront', 'Sunset Views', 'Galle Face Access', 'Premium Finishes'], amenities: ['Beach Access', 'Pool', 'Gym', 'Parking', 'BBQ', 'Security'], rating: 4.8, reviews: 123 },
  { id: 'nawam-mawatha-loft', name: 'Nawam Mawatha Loft', location: 'Colombo 7', area: 'colombo-4-7', image: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=1200&q=90', category: 'Designer Loft', bedrooms: 2, bathrooms: 2, sqft: 1900, floor: 'Triplex', pricePerNight: 350, pricePerMonth: 7500, description: 'Converted warehouse loft in trendy Cinnamon Gardens, featuring exposed brick, double-height ceilings, and industrial chic design.', highlights: ['Warehouse Conversion', 'Double Height', 'Industrial Design', 'Art District'], amenities: ['Rooftop', 'Parking', 'Designer Kitchen', 'Smart Home', 'Security', 'Fiber Internet'], rating: 4.7, reviews: 78 },
  
  // KANDY
  { id: 'kandy-hills-penthouse', name: 'Kandy Hills Penthouse', location: 'Kandy', area: 'kandy', image: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=1200&q=90', category: 'Penthouse', bedrooms: 3, bathrooms: 3, sqft: 3200, floor: '12th Floor', pricePerNight: 320, pricePerMonth: 6500, description: 'Panoramic views of Kandy Lake and the sacred Temple of the Tooth from this modern penthouse in the cultural capital.', highlights: ['Lake Views', 'Temple Views', 'Mountain Backdrop', 'Cultural Access'], amenities: ['Pool', 'Gym', 'Parking', 'Concierge', 'Garden', 'Security'], rating: 4.8, reviews: 67 },
  { id: 'peradeniya-garden-suite', name: 'Peradeniya Garden Suite', location: 'Kandy', area: 'kandy', image: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=1200&q=90', category: 'Garden Apartment', bedrooms: 2, bathrooms: 2, sqft: 1400, floor: 'Ground + Garden', pricePerNight: 180, pricePerMonth: 3500, description: 'Private garden apartment near the famous Peradeniya Botanical Gardens, perfect for nature lovers and families.', highlights: ['Private Garden', 'Near Botanical Gardens', 'Quiet Setting', 'Family Friendly'], amenities: ['Garden', 'Parking', 'Kitchen', 'Laundry', 'BBQ', 'Pet Friendly'], rating: 4.6, reviews: 89 },
  
  // GALLE
  { id: 'galle-fort-penthouse', name: 'Galle Fort Penthouse', location: 'Galle', area: 'galle', image: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1200&q=90', category: 'Heritage Penthouse', bedrooms: 3, bathrooms: 3, sqft: 2800, floor: 'Rooftop', pricePerNight: 450, pricePerMonth: 9500, description: 'A stunning rooftop penthouse within the UNESCO World Heritage Galle Fort, with 360° views of ramparts and ocean.', highlights: ['UNESCO Heritage', 'Fort Views', 'Ocean Views', 'Rooftop Terrace'], amenities: ['Rooftop', 'Private Pool', 'Chef Available', 'Concierge', 'AC', 'WiFi'], rating: 4.9, reviews: 134 },
  { id: 'unawatuna-beach-suite', name: 'Unawatuna Beach Suite', location: 'Galle', area: 'galle', image: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=1200&q=90', category: 'Beach Apartment', bedrooms: 2, bathrooms: 2, sqft: 1200, floor: 'Beachfront', pricePerNight: 220, pricePerMonth: 4500, description: 'Steps from the golden sands of Unawatuna Beach, this apartment offers the perfect blend of beach life and comfort.', highlights: ['Beachfront', 'Surfing', 'Restaurants Nearby', 'Sunset Views'], amenities: ['Beach Access', 'Pool', 'AC', 'WiFi', 'Kitchen', 'Balcony'], rating: 4.7, reviews: 201 },
  
  // NEGOMBO
  { id: 'negombo-lagoon-villa', name: 'Negombo Lagoon Villa', location: 'Negombo', area: 'negombo', image: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=1200&q=90', category: 'Waterfront Villa', bedrooms: 4, bathrooms: 4, sqft: 3500, floor: 'Ground', pricePerNight: 380, pricePerMonth: 8000, description: 'Stunning lagoon-front property just 15 minutes from the airport, ideal for first and last night stays in Sri Lanka.', highlights: ['Lagoon Views', '15 min to Airport', 'Private Dock', 'Bird Watching'], amenities: ['Pool', 'Garden', 'Parking', 'Kitchen', 'BBQ', 'Boat Tours'], rating: 4.8, reviews: 167 },
  { id: 'beach-road-apartment', name: 'Beach Road Apartment', location: 'Negombo', area: 'negombo', image: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=1200&q=90', category: 'Beach Apartment', bedrooms: 2, bathrooms: 2, sqft: 1100, floor: '3rd Floor', pricePerNight: 120, pricePerMonth: 2500, description: 'Affordable beachside living near Negombo\'s famous fish market and vibrant dining scene, perfect for airport stopovers.', highlights: ['Beach Walking Distance', 'Near Airport', 'Restaurants', 'Fish Market'], amenities: ['AC', 'WiFi', 'Kitchen', 'Balcony', 'Parking', 'Laundry'], rating: 4.5, reviews: 289 }
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

const LuxuryApartments = () => {
  const [heroIndex, setHeroIndex] = useState(0);
  const [selectedLocation, setSelectedLocation] = useState('all');
  const [stayType, setStayType] = useState<'short' | 'long'>('short');
  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const heroY = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

  const filteredApartments = selectedLocation === 'all' ? apartmentCollection : apartmentCollection.filter(a => a.area === selectedLocation);

  const bookingFields = [
    { name: 'name', label: 'Full Name', type: 'text' as const, placeholder: 'Your name', required: true },
    { name: 'email', label: 'Email', type: 'email' as const, placeholder: 'your@email.com', required: true },
    { name: 'phone', label: 'Phone', type: 'tel' as const, placeholder: '+94 77 123 4567', required: true },
    { name: 'stayType', label: 'Stay Duration', type: 'select' as const, required: true, options: [
      { value: 'short', label: 'Short Stay (1-30 nights)' },
      { value: 'monthly', label: 'Monthly (1-6 months)' },
      { value: 'longterm', label: 'Long Term (6+ months)' }
    ]},
    { name: 'moveIn', label: 'Move-In Date', type: 'date' as const, required: true },
    { name: 'moveOut', label: 'Move-Out Date', type: 'date' as const },
    { name: 'guests', label: 'Number of Guests', type: 'select' as const, required: true, options: [
      { value: '1', label: '1 Guest' }, { value: '2', label: '2 Guests' }, { value: '3-4', label: '3-4 Guests' }, { value: '5+', label: '5+ Guests' }
    ]},
    { name: 'apartment', label: 'Preferred Apartment', type: 'select' as const, options: [
      { value: '', label: 'Recommend Best Option' },
      ...apartmentCollection.map(a => ({ value: a.name, label: `${a.name} - ${a.location}` }))
    ]},
    { name: 'budget', label: 'Monthly Budget', type: 'select' as const, options: [
      { value: '', label: 'Any Budget' },
      { value: '2000-5000', label: '$2,000 - $5,000' },
      { value: '5000-10000', label: '$5,000 - $10,000' },
      { value: '10000-20000', label: '$10,000 - $20,000' },
      { value: '20000+', label: '$20,000+' }
    ]},
    { name: 'requests', label: 'Special Requirements', type: 'textarea' as const, placeholder: 'Parking needs, pet policy, specific amenities, work from home setup...', halfWidth: false }
  ];

  useEffect(() => {
    const timer = setInterval(() => setHeroIndex((prev) => (prev + 1) % heroSlides.length), 6000);
    return () => clearInterval(timer);
  }, []);

  return (
    <>
      <Helmet>
        <title>Luxury Apartments Sri Lanka | Penthouses Colombo | Serviced Residences | Recharge Travels</title>
        <meta name="description" content="Rent luxury apartments in Colombo. Penthouses, serviced residences, executive suites in Altair, Cinnamon Life, Shangri-La. Short & long term stays." />
      </Helmet>
      <Header />
      <main className="min-h-screen bg-[#0a0a0a] text-white overflow-hidden">
        
        {/* CINEMATIC HERO */}
        <section ref={heroRef} className="relative h-screen overflow-hidden">
          <motion.div style={{ y: heroY }} className="absolute inset-0">
            <AnimatePresence mode="wait">
              <motion.div key={heroIndex} initial={{ opacity: 0, scale: 1.1 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} transition={{ duration: 1.5 }} className="absolute inset-0">
                <img src={heroSlides[heroIndex].url} alt={heroSlides[heroIndex].title} className="w-full h-full object-cover" />
              </motion.div>
            </AnimatePresence>
            <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/30 to-[#0a0a0a]" />
          </motion.div>

          <motion.div style={{ opacity: heroOpacity }} className="relative z-10 h-full flex flex-col justify-center items-center text-center px-4">
            <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1, delay: 0.5 }} className="max-w-5xl">
              <div className="inline-flex items-center gap-3 mb-8">
                <div className="h-px w-12 bg-gradient-to-r from-transparent to-blue-400/60" />
                <span className="text-blue-400/80 font-light tracking-[0.3em] text-xs uppercase">Premium Residences</span>
                <div className="h-px w-12 bg-gradient-to-l from-transparent to-blue-400/60" />
              </div>

              <AnimatePresence mode="wait">
                <motion.div key={heroIndex}>
                  <motion.h1 initial={{ y: 50, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: -50, opacity: 0 }} className="text-5xl md:text-7xl lg:text-8xl font-extralight tracking-tight text-white mb-2">
                    {heroSlides[heroIndex].title}
                  </motion.h1>
                  <motion.h2 initial={{ y: 30, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: -30, opacity: 0 }} transition={{ delay: 0.1 }} className="text-4xl md:text-6xl font-extralight text-blue-400/90 mb-6">
                    {heroSlides[heroIndex].subtitle}
                  </motion.h2>
                  <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ delay: 0.2 }} className="text-lg text-gray-300 font-light">
                    {heroSlides[heroIndex].tagline}
                  </motion.p>
                </motion.div>
              </AnimatePresence>

              <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1, delay: 1 }} className="mt-12 flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg" className="group bg-blue-500 hover:bg-blue-400 text-white px-10 py-7 text-sm font-medium tracking-widest uppercase rounded-none" onClick={() => document.getElementById('apartments')?.scrollIntoView({ behavior: 'smooth' })}>
                  View Apartments <ArrowRight className="w-4 h-4 ml-3 group-hover:translate-x-1 transition-transform" />
                </Button>
                <Button size="lg" variant="outline" className="border border-white/20 text-white hover:bg-white/10 px-10 py-7 text-sm tracking-widest uppercase rounded-none" onClick={() => document.getElementById('booking')?.scrollIntoView({ behavior: 'smooth' })}>
                  <Phone className="w-4 h-4 mr-3" /> Inquire Now
                </Button>
              </motion.div>
            </motion.div>
          </motion.div>
        </section>

        {/* STAY TYPE TOGGLE */}
        <section className="py-8 bg-gradient-to-r from-blue-900/20 via-blue-800/10 to-blue-900/20 border-y border-blue-500/10">
          <div className="container mx-auto px-4">
            <div className="flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="flex items-center gap-4">
                <span className="text-gray-400 text-sm">View prices for:</span>
                <div className="flex bg-white/5 p-1 rounded-none">
                  <button onClick={() => setStayType('short')} className={`px-6 py-2 text-sm transition-all ${stayType === 'short' ? 'bg-blue-500 text-white' : 'text-gray-400 hover:text-white'}`}>
                    Per Night
                  </button>
                  <button onClick={() => setStayType('long')} className={`px-6 py-2 text-sm transition-all ${stayType === 'long' ? 'bg-blue-500 text-white' : 'text-gray-400 hover:text-white'}`}>
                    Per Month
                  </button>
                </div>
              </div>
              <div className="flex items-center gap-4 text-sm">
                <div className="flex items-center gap-2 text-gray-400"><CheckCircle2 className="w-4 h-4 text-green-500" /> Flexible Terms</div>
                <div className="flex items-center gap-2 text-gray-400"><Shield className="w-4 h-4 text-blue-400" /> Verified Properties</div>
                <div className="flex items-center gap-2 text-gray-400"><Clock className="w-4 h-4 text-amber-400" /> 24h Response</div>
              </div>
            </div>
          </div>
        </section>

        {/* LOCATION FILTER */}
        <section className="py-6 bg-[#0a0a0a] sticky top-0 z-30 border-b border-white/5">
          <div className="container mx-auto px-4">
            <div className="flex flex-wrap justify-center gap-2">
              {locations.map((loc) => (
                <Button key={loc.id} variant={selectedLocation === loc.id ? "default" : "outline"} className={`rounded-none text-sm tracking-wider ${selectedLocation === loc.id ? 'bg-blue-500 text-white hover:bg-blue-400' : 'border-white/20 text-gray-400 hover:bg-white/5 hover:text-white'}`} onClick={() => setSelectedLocation(loc.id)}>
                  {loc.name}
                </Button>
              ))}
            </div>
          </div>
        </section>

        {/* APARTMENT COLLECTION */}
        <section id="apartments" className="py-20 bg-[#0a0a0a]">
          <div className="container mx-auto px-4">
            <AnimatedSection className="text-center mb-12">
              <h2 className="text-4xl md:text-5xl font-extralight tracking-tight mb-4">
                Premium <span className="text-blue-400">Apartments</span>
              </h2>
              <p className="text-gray-400 font-light">{filteredApartments.length} properties available</p>
            </AnimatedSection>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredApartments.map((apt) => (
                <AnimatedSection key={apt.id}>
                  <motion.div whileHover={{ y: -8 }} transition={{ duration: 0.3 }} className="bg-white/[0.02] border border-white/5 hover:border-blue-500/30 transition-all duration-500 overflow-hidden group h-full flex flex-col">
                    <div className="relative aspect-[4/3] overflow-hidden">
                      <motion.img src={apt.image} alt={apt.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                      <div className="absolute top-4 left-4">
                        <Badge className="bg-blue-500/90 text-white border-0 font-medium">{apt.category}</Badge>
                      </div>
                      <div className="absolute top-4 right-4 flex items-center gap-1 bg-black/60 backdrop-blur-sm px-2 py-1">
                        <Star className="w-4 h-4 text-blue-400 fill-blue-400" />
                        <span className="text-white font-medium">{apt.rating}</span>
                      </div>
                      <div className="absolute bottom-4 left-4 right-4">
                        <div className="flex items-center gap-2 text-blue-400/80 text-sm mb-2">
                          <MapPin className="w-4 h-4" />{apt.location}
                          <span className="text-gray-500">•</span>
                          <Building className="w-4 h-4" />{apt.floor}
                        </div>
                        <h3 className="text-xl font-light text-white">{apt.name}</h3>
                      </div>
                    </div>
                    
                    <div className="p-5 flex-1 flex flex-col">
                      {/* Specs */}
                      <div className="flex items-center gap-4 text-sm text-gray-400 mb-4">
                        <div className="flex items-center gap-1"><Bed className="w-4 h-4" />{apt.bedrooms} Bed</div>
                        <div className="flex items-center gap-1"><Bath className="w-4 h-4" />{apt.bathrooms} Bath</div>
                        <div className="flex items-center gap-1"><Maximize className="w-4 h-4" />{apt.sqft} sqft</div>
                      </div>

                      <p className="text-gray-400 text-sm font-light mb-4 line-clamp-2">{apt.description}</p>
                      
                      <div className="flex flex-wrap gap-2 mb-4">
                        {apt.highlights.slice(0, 3).map((h, i) => (
                          <span key={i} className="text-xs px-2 py-1 bg-blue-500/10 text-blue-400/80 border border-blue-500/20">{h}</span>
                        ))}
                      </div>
                      
                      <div className="mt-auto pt-4 border-t border-white/5 flex items-center justify-between">
                        <div>
                          {stayType === 'short' ? (
                            <>
                              <div className="text-xs text-gray-500">From</div>
                              <div className="text-xl font-light text-white">${apt.pricePerNight}<span className="text-sm text-gray-500">/night</span></div>
                            </>
                          ) : (
                            <>
                              <div className="text-xs text-gray-500">From</div>
                              <div className="text-xl font-light text-white">${apt.pricePerMonth.toLocaleString()}<span className="text-sm text-gray-500">/month</span></div>
                            </>
                          )}
                        </div>
                        <div className="flex gap-2">
                          <Button size="sm" className="bg-blue-500 hover:bg-blue-400 text-white rounded-none" onClick={() => document.getElementById('booking')?.scrollIntoView({ behavior: 'smooth' })}>
                            Inquire
                          </Button>
                          <a href={`https://wa.me/94777721999?text=I'm%20interested%20in%20${encodeURIComponent(apt.name)}%20apartment`} target="_blank" rel="noopener noreferrer" className="p-2 border border-white/20 hover:border-[#25D366] hover:bg-[#25D366]/10 transition-all">
                            <svg className="w-4 h-4 text-[#25D366]" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/></svg>
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
        <section className="py-20 bg-gradient-to-b from-[#0a0a0a] via-blue-950/10 to-[#0a0a0a]">
          <div className="container mx-auto px-4">
            <AnimatedSection className="text-center mb-12">
              <h2 className="text-4xl font-extralight tracking-tight mb-4">Included <span className="text-blue-400">Services</span></h2>
            </AnimatedSection>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {[
                { icon: Wifi, title: 'High-Speed WiFi' },
                { icon: ChefHat, title: 'Chef on Request' },
                { icon: Shirt, title: 'Laundry Service' },
                { icon: Car, title: 'Airport Transfer' },
                { icon: Key, title: 'Keyless Entry' },
                { icon: Sofa, title: 'Furnished' }
              ].map((service, idx) => (
                <motion.div key={idx} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: idx * 0.1 }} className="text-center p-4 bg-white/[0.02] border border-white/5">
                  <service.icon className="w-8 h-8 text-blue-400 mx-auto mb-2" />
                  <span className="text-sm text-gray-400">{service.title}</span>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* BOOKING FORM */}
        <section id="booking" className="py-20 bg-[#0a0a0a]">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <AnimatedSection className="text-center mb-12">
                <h2 className="text-4xl md:text-5xl font-extralight tracking-tight mb-4">Find Your Perfect <span className="text-blue-400">Stay</span></h2>
                <p className="text-gray-400 font-light">Short term or long term • Flexible lease options</p>
              </AnimatedSection>
              <LuxuryBookingForm
                type="villa"
                title="Apartment Inquiry"
                subtitle="We'll match you with the perfect property"
                fields={bookingFields}
                accentColor="blue"
              />
            </div>
          </div>
        </section>

        {/* CONTACT */}
        <section className="py-12 bg-blue-900/20 border-t border-blue-500/10">
          <div className="container mx-auto px-4">
            <div className="flex flex-col lg:flex-row items-center justify-between gap-6">
              <div className="text-center lg:text-left">
                <h3 className="text-xl font-light text-white mb-1">Relocating to Sri Lanka?</h3>
                <p className="text-gray-400 text-sm">We specialize in corporate relocations and long-term stays</p>
              </div>
              <div className="flex flex-wrap justify-center gap-4">
                <a href="https://wa.me/94777721999?text=I'm%20looking%20for%20a%20luxury%20apartment%20in%20Sri%20Lanka" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 bg-[#25D366] hover:bg-[#128C7E] text-white px-6 py-3 transition-all">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/></svg>
                  WhatsApp
                </a>
                <a href="tel:+94777721999" className="flex items-center gap-2 border border-blue-500/30 text-blue-400 hover:bg-blue-500/10 px-6 py-3 transition-all">
                  <Phone className="w-4 h-4" /> +94 777 721 999
                </a>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
};

export default LuxuryApartments;
