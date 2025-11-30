import React, { useState, useEffect, useRef } from 'react';
import { Helmet } from 'react-helmet-async';
import { motion, AnimatePresence, useScroll, useTransform, useInView } from 'framer-motion';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Star, MapPin, Phone, Mail, ArrowRight, Wifi, Car, Utensils, Waves, Dumbbell, Sparkles, Heart, Crown, Coffee, Wind, Gem, Quote, Users, Calendar, CheckCircle2, Building2, Mountain, TreePalm, Compass } from 'lucide-react';
import LuxuryBookingForm from '@/components/luxury/LuxuryBookingForm';

const heroSlides = [
  { url: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=1920&q=90', title: 'Shangri-La', subtitle: 'Colombo', tagline: 'Urban sanctuary above the Indian Ocean' },
  { url: 'https://images.unsplash.com/photo-1582719508461-905c673771fd?w=1920&q=90', title: 'Ceylon Tea Trails', subtitle: 'Hill Country', tagline: 'Colonial elegance in misty tea estates' },
  { url: 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=1920&q=90', title: 'Amanwella', subtitle: 'Tangalle', tagline: 'Minimalist luxury on pristine shores' },
  { url: 'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=1920&q=90', title: 'Heritance Kandalama', subtitle: 'Dambulla', tagline: 'Geoffrey Bawa\'s jungle masterpiece' }
];

const regions = [
  { id: 'all', name: 'All Regions', icon: Compass },
  { id: 'colombo', name: 'Colombo', icon: Building2 },
  { id: 'hill-country', name: 'Hill Country', icon: Mountain },
  { id: 'south-coast', name: 'South Coast', icon: TreePalm },
  { id: 'east-coast', name: 'East Coast', icon: Waves },
  { id: 'north', name: 'North', icon: Compass },
  { id: 'cultural-triangle', name: 'Cultural Triangle', icon: Crown }
];

const hotelCollection = [
  // COLOMBO
  { id: 'shangri-la-colombo', name: 'Shangri-La Colombo', location: 'Colombo', region: 'colombo', image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=1200&q=90', category: '5-Star Luxury', stars: 5, rooms: 500, pricePerNight: 450, description: 'Rising 47 floors above the Indian Ocean, Shangri-La Colombo offers unparalleled city and ocean views with world-class dining and the largest spa in Sri Lanka.', highlights: ['Horizon Club Lounge', 'Table One - 8 Cuisines', 'Chi Spa', 'Infinity Pool'], amenities: ['Ocean View', 'Fine Dining', 'Rooftop Bar', 'Luxury Spa', 'Fitness Center', 'Pool'], rating: 4.9, reviews: 2847 },
  { id: 'grand-hyatt-colombo', name: 'Grand Hyatt Colombo', location: 'Colombo', region: 'colombo', image: 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=1200&q=90', category: '5-Star Luxury', stars: 5, rooms: 457, pricePerNight: 380, description: 'Overlooking Beira Lake and the city skyline, Grand Hyatt brings contemporary luxury to the heart of Colombo with exceptional service.', highlights: ['Grand Club Access', 'Eight Restaurants', 'Santosa Spa', 'Rooftop Pool'], amenities: ['Lake View', 'Multiple Dining', 'Spa', 'Pool', 'Gym', 'Business Center'], rating: 4.8, reviews: 1956 },
  { id: 'cinnamon-grand', name: 'Cinnamon Grand Colombo', location: 'Colombo', region: 'colombo', image: 'https://images.unsplash.com/photo-1596178065887-1198b6148b2b?w=1200&q=90', category: '5-Star Luxury', stars: 5, rooms: 501, pricePerNight: 280, description: 'An iconic landmark in the heart of Colombo, Cinnamon Grand offers 14 dining venues, a casino, and legendary Sri Lankan hospitality.', highlights: ['Chequerboard Restaurant', 'On-Site Casino', 'Spa Ceylon', 'Convention Center'], amenities: ['City Center', '14 Restaurants', 'Casino', 'Spa', 'Pool', 'Shopping'], rating: 4.7, reviews: 3421 },
  
  // HILL COUNTRY - KANDY
  { id: 'kings-pavilion-kandy', name: 'The Kings Pavilion', location: 'Kandy', region: 'hill-country', image: 'https://images.unsplash.com/photo-1584132967334-10e028bd69f7?w=1200&q=90', category: 'Heritage Boutique', stars: 5, rooms: 8, pricePerNight: 650, description: 'A restored colonial mansion overlooking Kandy Lake, offering intimate luxury with just 8 suites and panoramic views of the Temple of the Tooth.', highlights: ['Lake & Temple Views', 'Private Butler', 'Heritage Architecture', 'Kandyan Cuisine'], amenities: ['Lake View', 'Butler Service', 'Fine Dining', 'Spa', 'Garden', 'Cultural Tours'], rating: 4.9, reviews: 412 },
  { id: 'earls-regency', name: 'Earls Regency', location: 'Kandy', region: 'hill-country', image: 'https://images.unsplash.com/photo-1578683010236-d716f9a3f461?w=1200&q=90', category: '5-Star Resort', stars: 5, rooms: 199, pricePerNight: 220, description: 'Perched on a misty hillside above Kandy, this eco-luxury resort offers stunning valley views and authentic cultural experiences.', highlights: ['Valley Views', 'Kandyan Dance Shows', 'Ayurveda Center', 'Nature Trails'], amenities: ['Mountain View', 'Ayurveda', 'Pool', 'Gym', 'Tennis', 'Cultural Shows'], rating: 4.6, reviews: 1823 },
  
  // HILL COUNTRY - NUWARA ELIYA
  { id: 'grand-hotel-nuwara', name: 'Grand Hotel Nuwara Eliya', location: 'Nuwara Eliya', region: 'hill-country', image: 'https://images.unsplash.com/photo-1445019980597-93fa8acb246c?w=1200&q=90', category: 'Heritage Colonial', stars: 5, rooms: 154, pricePerNight: 280, description: 'Built in 1891, this Tudor-style mansion is Little England\'s crown jewel, offering colonial grandeur amid manicured gardens and misty mountains.', highlights: ['Colonial Heritage', 'English Gardens', 'Golf Course Access', 'High Tea Tradition'], amenities: ['Heritage Building', 'Gardens', 'Billiards', 'Library', 'Golf', 'Fireplace Rooms'], rating: 4.7, reviews: 1245 },
  { id: 'heritance-tea-factory', name: 'Heritance Tea Factory', location: 'Nuwara Eliya', region: 'hill-country', image: 'https://images.unsplash.com/photo-1582719508461-905c673771fd?w=1200&q=90', category: 'Boutique Heritage', stars: 5, rooms: 57, pricePerNight: 350, description: 'A converted 19th-century tea factory transformed into an extraordinary hotel, where industrial heritage meets contemporary luxury 2000m above sea level.', highlights: ['Tea Museum', 'Factory Tours', '360° Mountain Views', 'Train Restaurant'], amenities: ['Tea Estate', 'Museum', 'Spa', 'Hiking', 'Tea Tasting', 'Vintage Decor'], rating: 4.8, reviews: 987 },
  
  // HILL COUNTRY - ELLA
  { id: '98-acres-ella', name: '98 Acres Resort', location: 'Ella', region: 'hill-country', image: 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=1200&q=90', category: 'Eco Luxury', stars: 5, rooms: 42, pricePerNight: 420, description: 'Suspended between Ella Rock and Little Adam\'s Peak, this eco-resort offers breathtaking views from every angle with sustainable luxury.', highlights: ['Ella Gap Views', 'Infinity Pool', 'Treehouse Cabins', 'Organic Farm'], amenities: ['Mountain View', 'Pool', 'Farm-to-Table', 'Hiking', 'Yoga', 'Spa'], rating: 4.9, reviews: 1567 },
  
  // SOUTH COAST - WELIGAMA/MIRISSA
  { id: 'cape-weligama', name: 'Cape Weligama', location: 'Weligama', region: 'south-coast', image: 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=1200&q=90', category: 'Clifftop Resort', stars: 5, rooms: 40, pricePerNight: 750, description: 'A Relais & Châteaux masterpiece perched on dramatic cliffs, offering 40 private pool villas and Sri Lanka\'s most spectacular coastal views.', highlights: ['Private Pool Villas', 'Clifftop Location', 'Moon Bar', 'Whale Watching'], amenities: ['Private Pools', 'Ocean View', 'Fine Dining', 'Spa', 'Beach Club', 'Excursions'], rating: 4.9, reviews: 723 },
  { id: 'anantara-tangalle', name: 'Anantara Peace Haven', location: 'Tangalle', region: 'south-coast', image: 'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=1200&q=90', category: '5-Star Beach Resort', stars: 5, rooms: 152, pricePerNight: 520, description: 'Set on a coconut plantation beside a golden beach, Anantara delivers barefoot luxury with villas, treehouse dining, and elephant encounters.', highlights: ['Beach Villas', 'Elephant Experience', 'Treehouse Dining', 'Diving Center'], amenities: ['Beachfront', 'Private Pools', 'Spa', 'Water Sports', 'Wildlife', 'Kids Club'], rating: 4.8, reviews: 1834 },
  { id: 'w15-weligama', name: 'W15 Weligama', location: 'Weligama', region: 'south-coast', image: 'https://images.unsplash.com/photo-1584132869994-873f9363a562?w=1200&q=90', category: 'Surf Boutique', stars: 4, rooms: 15, pricePerNight: 280, description: 'The surfer\'s luxury hideaway. This boutique gem overlooks Weligama Bay with rooftop sundowners and direct beach access for wave hunters.', highlights: ['Surf School', 'Rooftop Bar', 'Bay Views', 'Boutique Design'], amenities: ['Beachfront', 'Surf Lessons', 'Rooftop', 'Pool', 'Yoga', 'Bar'], rating: 4.7, reviews: 534 },
  
  // SOUTH COAST - HAMBANTOTA
  { id: 'shangri-la-hambantota', name: 'Shangri-La Hambantota', location: 'Hambantota', region: 'south-coast', image: 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=1200&q=90', category: 'Golf & Beach Resort', stars: 5, rooms: 274, pricePerNight: 380, description: 'An 18-hole golf resort stretching along the southern coast with private beach, wildlife encounters, and sweeping ocean views.', highlights: ['Championship Golf', '3km Private Beach', 'Artisan Village', 'Safari Access'], amenities: ['Golf Course', 'Private Beach', 'Multiple Pools', 'Spa', 'Kids Club', 'Water Sports'], rating: 4.7, reviews: 1456 },
  
  // EAST COAST - TRINCOMALEE
  { id: 'jungle-beach-trinco', name: 'Jungle Beach Trincomalee', location: 'Trincomalee', region: 'east-coast', image: 'https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?w=1200&q=90', category: 'Eco Beach Resort', stars: 5, rooms: 48, pricePerNight: 450, description: 'Hidden between jungle and pristine beach, this Uga Escapes property offers untouched natural beauty with sustainable luxury.', highlights: ['Pristine Beach', 'Wildlife', 'Whale Watching', 'Diving & Snorkeling'], amenities: ['Private Beach', 'Pool', 'Diving Center', 'Spa', 'Nature Trails', 'Yoga'], rating: 4.8, reviews: 876 },
  { id: 'trinco-blu', name: 'Trinco Blu by Cinnamon', location: 'Trincomalee', region: 'east-coast', image: 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=1200&q=90', category: 'Beach Resort', stars: 4, rooms: 81, pricePerNight: 180, description: 'On the shores of Uppuveli Beach, this resort offers crystal-clear waters, whale watching excursions, and access to historic Fort Frederick.', highlights: ['Uppuveli Beach', 'Whale Watching', 'Water Sports', 'Historic Fort'], amenities: ['Beachfront', 'Pool', 'Water Sports', 'Diving', 'Ayurveda', 'Kids Activities'], rating: 4.5, reviews: 1234 },
  
  // EAST COAST - BATTICALOA
  { id: 'malu-malu-batticaloa', name: 'Malu Malu Resort', location: 'Batticaloa', region: 'east-coast', image: 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=1200&q=90', category: 'Beach Boutique', stars: 4, rooms: 24, pricePerNight: 220, description: 'A hidden gem on Passikudah Beach with crystal-clear waters, coral reefs, and the warm hospitality of Sri Lanka\'s undiscovered east.', highlights: ['Passikudah Beach', 'Coral Snorkeling', 'Lagoon Tours', 'Cultural Excursions'], amenities: ['Beachfront', 'Pool', 'Snorkeling', 'Kayaking', 'Spa', 'Restaurant'], rating: 4.6, reviews: 445 },
  
  // NORTH - JAFFNA
  { id: 'jetwing-jaffna', name: 'Jetwing Jaffna', location: 'Jaffna', region: 'north', image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=1200&q=90', category: 'City Hotel', stars: 4, rooms: 55, pricePerNight: 150, description: 'The gateway to Sri Lanka\'s Tamil north, offering contemporary comfort with easy access to ancient temples, islands, and unique cuisine.', highlights: ['City Center', 'Jaffna Fort', 'Temple Tours', 'Tamil Cuisine'], amenities: ['Rooftop Dining', 'Pool', 'Cultural Tours', 'Bike Rental', 'Spa', 'Conference'], rating: 4.5, reviews: 678 },
  { id: 'thinnai-boutique', name: 'Thinnai Boutique Hotel', location: 'Jaffna', region: 'north', image: 'https://images.unsplash.com/photo-1584132967334-10e028bd69f7?w=1200&q=90', category: 'Heritage Boutique', stars: 4, rooms: 12, pricePerNight: 180, description: 'A restored colonial mansion showcasing Jaffna\'s rich heritage, with traditional architecture and authentic northern Sri Lankan experiences.', highlights: ['Colonial Heritage', 'Traditional Cuisine', 'Island Excursions', 'Cultural Immersion'], amenities: ['Heritage Building', 'Garden', 'Restaurant', 'Library', 'Tours', 'Bicycles'], rating: 4.7, reviews: 234 },
  
  // CULTURAL TRIANGLE
  { id: 'heritance-kandalama', name: 'Heritance Kandalama', location: 'Dambulla', region: 'cultural-triangle', image: 'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=1200&q=90', category: 'Eco Architecture', stars: 5, rooms: 152, pricePerNight: 280, description: 'Geoffrey Bawa\'s jungle masterpiece built into the rock face, offering dramatic views of Sigiriya and the ancient reservoir of Kandalama.', highlights: ['Bawa Architecture', 'Sigiriya Views', 'Wildlife', 'Infinity Pool'], amenities: ['Jungle Setting', 'Pool', 'Spa', 'Bird Watching', 'Cycling', 'Cultural Tours'], rating: 4.8, reviews: 2134 },
  { id: 'water-garden-sigiriya', name: 'Water Garden Sigiriya', location: 'Sigiriya', region: 'cultural-triangle', image: 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=1200&q=90', category: '5-Star Resort', stars: 5, rooms: 30, pricePerNight: 520, description: 'Inspired by the ancient water gardens of Sigiriya, this luxury resort floats on lotus ponds with the iconic rock fortress as backdrop.', highlights: ['Sigiriya Rock Views', 'Lotus Ponds', 'Private Pool Villas', 'Cultural Heritage'], amenities: ['Private Pools', 'Rock Views', 'Spa', 'Fine Dining', 'Cycling', 'Hot Air Balloon'], rating: 4.9, reviews: 567 }
];

const amenityIcons: Record<string, any> = {
  'Pool': Waves, 'Spa': Sparkles, 'Fine Dining': Utensils, 'Gym': Dumbbell, 'Wifi': Wifi, 'Beach': TreePalm, 'Mountain': Mountain, 'Golf': Crown
};

const AnimatedSection = ({ children, className = '' }: { children: React.ReactNode; className?: string }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  return (
    <motion.div ref={ref} initial={{ opacity: 0, y: 60 }} animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 60 }} transition={{ duration: 0.8 }} className={className}>
      {children}
    </motion.div>
  );
};

const LuxuryHotels = () => {
  const [heroIndex, setHeroIndex] = useState(0);
  const [selectedRegion, setSelectedRegion] = useState('all');
  const [selectedHotel, setSelectedHotel] = useState<string>('');
  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const heroY = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

  const filteredHotels = selectedRegion === 'all' ? hotelCollection : hotelCollection.filter(h => h.region === selectedRegion);

  const bookingFields = [
    { name: 'name', label: 'Full Name', type: 'text' as const, placeholder: 'Your name', required: true },
    { name: 'email', label: 'Email', type: 'email' as const, placeholder: 'your@email.com', required: true },
    { name: 'phone', label: 'Phone', type: 'tel' as const, placeholder: '+94 77 123 4567', required: true },
    { name: 'checkIn', label: 'Check-In Date', type: 'date' as const, required: true },
    { name: 'checkOut', label: 'Check-Out Date', type: 'date' as const, required: true },
    { name: 'guests', label: 'Number of Guests', type: 'select' as const, required: true, options: [
      { value: '1', label: '1 Guest' }, { value: '2', label: '2 Guests' }, { value: '3', label: '3 Guests' }, { value: '4', label: '4 Guests' }, { value: '5+', label: '5+ Guests' }
    ]},
    { name: 'roomType', label: 'Room Preference', type: 'select' as const, options: [
      { value: '', label: 'Any Room Type' }, { value: 'standard', label: 'Deluxe Room' }, { value: 'suite', label: 'Suite' }, { value: 'villa', label: 'Villa/Bungalow' }, { value: 'penthouse', label: 'Penthouse' }
    ]},
    { name: 'hotel', label: 'Preferred Hotel', type: 'select' as const, options: [
      { value: '', label: 'Recommend Best Option' },
      ...hotelCollection.map(h => ({ value: h.name, label: `${h.name} - ${h.location}` }))
    ]},
    { name: 'requests', label: 'Special Requests', type: 'textarea' as const, placeholder: 'Occasion, dietary needs, room preferences, transfers...', halfWidth: false }
  ];

  useEffect(() => {
    const timer = setInterval(() => setHeroIndex((prev) => (prev + 1) % heroSlides.length), 7000);
    return () => clearInterval(timer);
  }, []);

  return (
    <>
      <Helmet>
        <title>Luxury Hotels Sri Lanka | 5-Star Resorts Colombo, Kandy, South Coast | Recharge Travels</title>
        <meta name="description" content="Book luxury hotels in Sri Lanka. 5-star resorts in Colombo, heritage stays in Kandy, beach resorts in South Coast, boutique hotels in Ella & Jaffna." />
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
                <div className="h-px w-12 bg-gradient-to-r from-transparent to-amber-400/60" />
                <span className="text-amber-400/80 font-light tracking-[0.3em] text-xs uppercase">Luxury Collection</span>
                <div className="h-px w-12 bg-gradient-to-l from-transparent to-amber-400/60" />
              </div>

              <AnimatePresence mode="wait">
                <motion.div key={heroIndex}>
                  <motion.h1 initial={{ y: 50, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: -50, opacity: 0 }} className="text-5xl md:text-7xl lg:text-8xl font-extralight tracking-tight text-white mb-2">
                    {heroSlides[heroIndex].title}
                  </motion.h1>
                  <motion.h2 initial={{ y: 30, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: -30, opacity: 0 }} transition={{ delay: 0.1 }} className="text-4xl md:text-6xl font-extralight text-amber-400/90 mb-6">
                    {heroSlides[heroIndex].subtitle}
                  </motion.h2>
                  <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ delay: 0.2 }} className="text-lg text-gray-300 font-light">
                    {heroSlides[heroIndex].tagline}
                  </motion.p>
                </motion.div>
              </AnimatePresence>

              <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1, delay: 1 }} className="mt-12 flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg" className="group bg-amber-500 hover:bg-amber-400 text-black px-10 py-7 text-sm font-medium tracking-widest uppercase rounded-none" onClick={() => document.getElementById('hotels')?.scrollIntoView({ behavior: 'smooth' })}>
                  Explore Hotels <ArrowRight className="w-4 h-4 ml-3 group-hover:translate-x-1 transition-transform" />
                </Button>
                <Button size="lg" variant="outline" className="border border-white/20 text-white hover:bg-white/10 px-10 py-7 text-sm tracking-widest uppercase rounded-none" onClick={() => document.getElementById('booking')?.scrollIntoView({ behavior: 'smooth' })}>
                  <Phone className="w-4 h-4 mr-3" /> Book Now
                </Button>
              </motion.div>
            </motion.div>
          </motion.div>

          <div className="absolute bottom-12 left-1/2 -translate-x-1/2 z-20 flex items-center gap-4">
            {heroSlides.map((_, idx) => (
              <button key={idx} onClick={() => setHeroIndex(idx)} className={`w-2 h-2 rounded-full transition-all ${idx === heroIndex ? 'bg-amber-400 w-8' : 'bg-white/30 hover:bg-white/50'}`} />
            ))}
          </div>
        </section>

        {/* STATS BAR */}
        <section className="py-12 bg-gradient-to-r from-amber-900/20 via-amber-800/10 to-amber-900/20 border-y border-amber-500/10">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
              {[
                { value: '20+', label: 'Luxury Properties' },
                { value: '9', label: 'Destinations' },
                { value: '4.8', label: 'Avg. Rating' },
                { value: '24/7', label: 'Concierge' }
              ].map((stat, idx) => (
                <div key={idx}>
                  <div className="text-3xl md:text-4xl font-light text-amber-400 mb-1">{stat.value}</div>
                  <div className="text-xs text-gray-500 uppercase tracking-wider">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* REGION FILTER */}
        <section className="py-8 bg-[#0a0a0a] sticky top-0 z-30 border-b border-white/5">
          <div className="container mx-auto px-4">
            <div className="flex flex-wrap justify-center gap-2">
              {regions.map((region) => (
                <Button
                  key={region.id}
                  variant={selectedRegion === region.id ? "default" : "outline"}
                  className={`rounded-none text-sm tracking-wider ${selectedRegion === region.id ? 'bg-amber-500 text-black hover:bg-amber-400' : 'border-white/20 text-gray-400 hover:bg-white/5 hover:text-white'}`}
                  onClick={() => setSelectedRegion(region.id)}
                >
                  <region.icon className="w-4 h-4 mr-2" />
                  {region.name}
                </Button>
              ))}
            </div>
          </div>
        </section>

        {/* HOTEL COLLECTION */}
        <section id="hotels" className="py-24 bg-[#0a0a0a]">
          <div className="container mx-auto px-4">
            <AnimatedSection className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-extralight tracking-tight mb-4">
                {selectedRegion === 'all' ? 'All' : regions.find(r => r.id === selectedRegion)?.name} <span className="text-amber-400">Hotels</span>
              </h2>
              <p className="text-gray-400 font-light">{filteredHotels.length} exceptional properties</p>
            </AnimatedSection>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredHotels.map((hotel, idx) => (
                <AnimatedSection key={hotel.id}>
                  <motion.div whileHover={{ y: -8 }} transition={{ duration: 0.3 }} className="bg-white/[0.02] border border-white/5 hover:border-amber-500/30 transition-all duration-500 overflow-hidden group h-full flex flex-col">
                    <div className="relative aspect-[4/3] overflow-hidden">
                      <motion.img src={hotel.image} alt={hotel.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                      <div className="absolute top-4 left-4">
                        <Badge className="bg-amber-500/90 text-black border-0 font-medium">{hotel.category}</Badge>
                      </div>
                      <div className="absolute top-4 right-4 flex items-center gap-1 bg-black/60 backdrop-blur-sm px-2 py-1">
                        <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
                        <span className="text-white font-medium">{hotel.rating}</span>
                        <span className="text-gray-400 text-xs">({hotel.reviews})</span>
                      </div>
                      <div className="absolute bottom-4 left-4 right-4">
                        <div className="flex items-center gap-2 text-amber-400/80 text-sm mb-2">
                          <MapPin className="w-4 h-4" />
                          <span>{hotel.location}</span>
                        </div>
                        <h3 className="text-xl font-light text-white">{hotel.name}</h3>
                      </div>
                    </div>
                    
                    <div className="p-5 flex-1 flex flex-col">
                      <p className="text-gray-400 text-sm font-light mb-4 line-clamp-2">{hotel.description}</p>
                      
                      <div className="flex flex-wrap gap-2 mb-4">
                        {hotel.highlights.slice(0, 3).map((h, i) => (
                          <span key={i} className="text-xs px-2 py-1 bg-amber-500/10 text-amber-400/80 border border-amber-500/20">{h}</span>
                        ))}
                      </div>
                      
                      <div className="mt-auto pt-4 border-t border-white/5 flex items-center justify-between">
                        <div>
                          <div className="text-xs text-gray-500">From</div>
                          <div className="text-xl font-light text-white">${hotel.pricePerNight}<span className="text-sm text-gray-500">/night</span></div>
                        </div>
                        <div className="flex gap-2">
                          <Button size="sm" className="bg-amber-500 hover:bg-amber-400 text-black rounded-none" onClick={() => { setSelectedHotel(hotel.name); document.getElementById('booking')?.scrollIntoView({ behavior: 'smooth' }); }}>
                            Book
                          </Button>
                          <a href={`https://wa.me/94777721999?text=I'm%20interested%20in%20${encodeURIComponent(hotel.name)}`} target="_blank" rel="noopener noreferrer" className="p-2 border border-white/20 hover:border-[#25D366] hover:bg-[#25D366]/10 transition-all">
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

        {/* WHY BOOK WITH US */}
        <section className="py-24 bg-gradient-to-b from-[#0a0a0a] via-amber-950/10 to-[#0a0a0a]">
          <div className="container mx-auto px-4">
            <AnimatedSection className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-extralight tracking-tight mb-4">Why Book <span className="text-amber-400">With Us</span></h2>
            </AnimatedSection>
            <div className="grid md:grid-cols-4 gap-6">
              {[
                { icon: Crown, title: 'Best Rate Guarantee', desc: 'Price match plus 10% off' },
                { icon: Heart, title: 'VIP Treatment', desc: 'Room upgrades when available' },
                { icon: CheckCircle2, title: 'Instant Confirmation', desc: 'Real-time availability' },
                { icon: Users, title: 'Local Expertise', desc: '15+ years in Sri Lanka' }
              ].map((item, idx) => (
                <motion.div key={idx} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: idx * 0.1 }} className="text-center p-6 bg-white/[0.02] border border-white/5 hover:border-amber-500/30 transition-all">
                  <div className="w-14 h-14 mx-auto mb-4 rounded-full bg-amber-500/10 flex items-center justify-center">
                    <item.icon className="w-7 h-7 text-amber-400" />
                  </div>
                  <h3 className="text-white font-medium mb-2">{item.title}</h3>
                  <p className="text-sm text-gray-500">{item.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* BOOKING FORM */}
        <section id="booking" className="py-24 bg-[#0a0a0a]">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <AnimatedSection className="text-center mb-12">
                <h2 className="text-4xl md:text-5xl font-extralight tracking-tight mb-4">Reserve Your <span className="text-amber-400">Stay</span></h2>
                <p className="text-gray-400 font-light">Best rates guaranteed • Free cancellation on most bookings</p>
              </AnimatedSection>
              <LuxuryBookingForm
                type="villa"
                title="Hotel Reservation Request"
                subtitle="We'll confirm availability within 2 hours"
                fields={bookingFields}
                accentColor="amber"
              />
            </div>
          </div>
        </section>

        {/* CONTACT BAR */}
        <section className="py-12 bg-amber-900/20 border-t border-amber-500/10">
          <div className="container mx-auto px-4">
            <div className="flex flex-col lg:flex-row items-center justify-between gap-6">
              <div className="text-center lg:text-left">
                <h3 className="text-xl font-light text-white mb-1">Need Help Choosing?</h3>
                <p className="text-gray-400 text-sm">Our luxury travel experts are here 24/7</p>
              </div>
              <div className="flex flex-wrap justify-center gap-4">
                <a href="https://wa.me/94777721999?text=I'm%20looking%20for%20luxury%20hotel%20recommendations%20in%20Sri%20Lanka" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 bg-[#25D366] hover:bg-[#128C7E] text-white px-6 py-3 transition-all">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/></svg>
                  WhatsApp
                </a>
                <a href="tel:+94777721999" className="flex items-center gap-2 border border-amber-500/30 text-amber-400 hover:bg-amber-500/10 px-6 py-3 transition-all">
                  <Phone className="w-4 h-4" /> +94 777 721 999
                </a>
                <a href="mailto:luxury@rechargetravels.com" className="flex items-center gap-2 border border-white/20 text-white hover:bg-white/5 px-6 py-3 transition-all">
                  <Mail className="w-4 h-4" /> luxury@rechargetravels.com
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

export default LuxuryHotels;
