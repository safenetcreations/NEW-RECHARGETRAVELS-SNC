import React, { useState, useEffect, useRef } from 'react';
import { Helmet } from 'react-helmet-async';
import { motion, AnimatePresence, useScroll, useTransform, useInView } from 'framer-motion';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Star, MapPin, Phone, Mail, ArrowRight, Wifi, Car, Bed, Bath, Maximize, Home, Utensils, Waves, TreePalm, Sparkles, Heart, Crown, Mountain, Gem, Users, Calendar, CheckCircle2, Shield, UtensilsCrossed, Shirt, PersonStanding, Fence, Trees, Flower2 } from 'lucide-react';
import LuxuryBookingForm from '@/components/luxury/LuxuryBookingForm';

const heroSlides = [
  { url: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1920&q=90', title: 'Private Estates', subtitle: 'South Coast', tagline: 'Your own slice of tropical paradise' },
  { url: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1920&q=90', title: 'Colonial Mansions', subtitle: 'Hill Country', tagline: 'Heritage elegance in misty highlands' },
  { url: 'https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=1920&q=90', title: 'Beach Villas', subtitle: 'Tropical Coast', tagline: 'Where the ocean is your backyard' },
  { url: 'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?w=1920&q=90', title: 'Jungle Retreats', subtitle: 'Wildlife Country', tagline: 'Luxury amidst untamed nature' }
];

const regions = [
  { id: 'all', name: 'All Regions', icon: Home },
  { id: 'south-coast', name: 'South Coast', icon: Waves },
  { id: 'hill-country', name: 'Hill Country', icon: Mountain },
  { id: 'colombo', name: 'Colombo', icon: Crown },
  { id: 'east-coast', name: 'East Coast', icon: TreePalm },
  { id: 'north', name: 'North', icon: Gem },
  { id: 'wildlife', name: 'Wildlife Country', icon: Trees }
];

const houseCollection = [
  // SOUTH COAST - WELIGAMA, MIRISSA, TANGALLE, HAMBANTOTA
  { id: 'weligama-surf-estate', name: 'Weligama Surf Estate', location: 'Weligama', region: 'south-coast', image: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1200&q=90', category: 'Beachfront Estate', bedrooms: 6, bathrooms: 7, sqft: 8500, land: '1.5 acres', pool: '25m Infinity', staff: 8, pricePerNight: 1800, description: 'A stunning beachfront compound overlooking Sri Lanka\'s premier surf break. Six bedroom suites, private beach access, and a legendary infinity pool.', highlights: ['Private Beach', 'Surf Break Access', '25m Infinity Pool', 'Full Staff'], amenities: ['Beach', 'Pool', 'Chef', 'Butler', 'Gym', 'Yoga Deck', 'BBQ', 'Cinema'], rating: 5.0, reviews: 89 },
  { id: 'mirissa-whale-house', name: 'Mirissa Whale House', location: 'Mirissa', region: 'south-coast', image: 'https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=1200&q=90', category: 'Clifftop Villa', bedrooms: 5, bathrooms: 5, sqft: 6000, land: '0.8 acres', pool: '18m Infinity', staff: 6, pricePerNight: 1200, description: 'Perched on dramatic cliffs with front-row views to whale migration routes. Watch blue whales from your private infinity pool.', highlights: ['Whale Watching Views', 'Clifftop Location', 'Sunrise & Sunset', 'Private Chef'], amenities: ['Pool', 'Chef', 'Kayaks', 'Snorkeling', 'Beach Access', 'Telescope'], rating: 4.9, reviews: 134 },
  { id: 'tangalle-palm-villa', name: 'Tangalle Palm Villa', location: 'Tangalle', region: 'south-coast', image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1200&q=90', category: 'Beach Villa', bedrooms: 4, bathrooms: 4, sqft: 5200, land: '2 acres', pool: '20m Lagoon', staff: 5, pricePerNight: 950, description: 'Hidden in a coconut grove with direct access to one of Sri Lanka\'s most pristine beaches. Complete privacy and barefoot luxury.', highlights: ['Pristine Beach', 'Coconut Grove', 'Turtle Nesting', 'Safari Access'], amenities: ['Pool', 'Chef', 'Beach', 'Garden', 'BBQ', 'Bicycles', 'Yoga'], rating: 4.9, reviews: 98 },
  { id: 'hambantota-safari-lodge', name: 'Hambantota Safari Lodge', location: 'Hambantota', region: 'south-coast', image: 'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?w=1200&q=90', category: 'Safari Estate', bedrooms: 5, bathrooms: 5, sqft: 7000, land: '5 acres', pool: '15m Natural', staff: 7, pricePerNight: 1100, description: 'Gateway to Yala and Bundala national parks. This safari-style estate offers wildlife at your doorstep with luxury amenities.', highlights: ['Yala Safari Access', 'Private Game Drives', 'Wildlife Viewing', 'Bush Dining'], amenities: ['Pool', 'Safari Vehicle', 'Chef', 'Naturalist', 'Boma', 'Spa'], rating: 4.8, reviews: 67 },
  
  // HILL COUNTRY - KANDY, NUWARA ELIYA, ELLA
  { id: 'kandy-lake-manor', name: 'Kandy Lake Manor', location: 'Kandy', region: 'hill-country', image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1200&q=90', category: 'Heritage Manor', bedrooms: 5, bathrooms: 6, sqft: 7500, land: '1.2 acres', pool: 'Heated 15m', staff: 6, pricePerNight: 1400, description: 'A restored 1890s colonial manor overlooking Kandy Lake with views of the sacred Temple of the Tooth. Heritage meets contemporary luxury.', highlights: ['Lake & Temple Views', 'Colonial Heritage', 'Heated Pool', 'Cultural Tours'], amenities: ['Pool', 'Chef', 'Butler', 'Garden', 'Library', 'Piano', 'Tuk-Tuk'], rating: 5.0, reviews: 78 },
  { id: 'nuwara-eliya-tea-bungalow', name: 'Tea Planter\'s Bungalow', location: 'Nuwara Eliya', region: 'hill-country', image: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1200&q=90', category: 'Tea Estate Bungalow', bedrooms: 4, bathrooms: 4, sqft: 4500, land: '50 acres', pool: 'None', staff: 5, pricePerNight: 850, description: 'An authentic tea planter\'s bungalow set within a working estate 6000ft above sea level. Log fires, misty mornings, and endless tea gardens.', highlights: ['Working Tea Estate', 'Log Fires', 'Tea Factory Tours', 'Mountain Hikes'], amenities: ['Fireplace', 'Chef', 'Estate Tours', 'Golf Nearby', 'Hiking', 'High Tea'], rating: 4.9, reviews: 112 },
  { id: 'ella-gap-house', name: 'Ella Gap House', location: 'Ella', region: 'hill-country', image: 'https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=1200&q=90', category: 'Mountain Villa', bedrooms: 3, bathrooms: 3, sqft: 3200, land: '0.5 acres', pool: '12m Infinity', staff: 4, pricePerNight: 650, description: 'Suspended between Ella Rock and Little Adam\'s Peak with jaw-dropping views of the famous Ella Gap. The ultimate mountain escape.', highlights: ['Ella Gap Views', 'Train Spotting', 'Hiking Base', 'Waterfall Access'], amenities: ['Pool', 'Chef', 'Garden', 'Yoga Deck', 'Bicycles', 'Hammocks'], rating: 4.9, reviews: 156 },
  
  // COLOMBO
  { id: 'cinnamon-gardens-mansion', name: 'Cinnamon Gardens Mansion', location: 'Colombo 7', region: 'colombo', image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1200&q=90', category: 'City Mansion', bedrooms: 6, bathrooms: 7, sqft: 9000, land: '0.75 acres', pool: '20m Lap', staff: 7, pricePerNight: 2200, description: 'An architectural masterpiece in Colombo\'s most prestigious neighborhood. Geoffrey Bawa-influenced design with mature tropical gardens.', highlights: ['Bawa Architecture', 'Tropical Gardens', 'Art Collection', 'Central Location'], amenities: ['Pool', 'Chef', 'Butler', 'Garden', 'Gym', 'Wine Cellar', 'Gallery'], rating: 5.0, reviews: 45 },
  { id: 'colombo-penthouse-villa', name: 'Colombo Sky Villa', location: 'Colombo 3', region: 'colombo', image: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1200&q=90', category: 'Penthouse Villa', bedrooms: 4, bathrooms: 5, sqft: 6500, land: 'Rooftop', pool: '15m Rooftop', staff: 4, pricePerNight: 1500, description: 'A rare rooftop villa spanning the top two floors with private pool, 360° city views, and the sophistication of a private residence.', highlights: ['360° City Views', 'Private Rooftop', 'Smart Home', 'Sunset Terrace'], amenities: ['Pool', 'Chef', 'Terrace', 'Home Cinema', 'Gym', 'Concierge'], rating: 4.9, reviews: 67 },
  
  // EAST COAST - TRINCOMALEE, BATTICALOA
  { id: 'trinco-beach-house', name: 'Trincomalee Beach House', location: 'Trincomalee', region: 'east-coast', image: 'https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=1200&q=90', category: 'Beach House', bedrooms: 4, bathrooms: 4, sqft: 4000, land: '0.6 acres', pool: '15m', staff: 5, pricePerNight: 750, description: 'On the pristine shores of Nilaveli Beach with crystal-clear waters, coral reefs, and Pigeon Island just offshore for snorkeling.', highlights: ['Nilaveli Beach', 'Pigeon Island', 'Whale Watching', 'Diving'], amenities: ['Pool', 'Beach', 'Chef', 'Diving Gear', 'Kayaks', 'BBQ'], rating: 4.8, reviews: 89 },
  { id: 'batticaloa-lagoon-house', name: 'Batticaloa Lagoon House', location: 'Batticaloa', region: 'east-coast', image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1200&q=90', category: 'Lagoon Villa', bedrooms: 3, bathrooms: 3, sqft: 2800, land: '0.4 acres', pool: '12m', staff: 4, pricePerNight: 450, description: 'A serene retreat on the Batticaloa lagoon, famous for its singing fish phenomenon. Authentic east coast culture and untouched beauty.', highlights: ['Singing Fish Lagoon', 'Bird Watching', 'Cultural Tours', 'Passikudah Beach'], amenities: ['Pool', 'Lagoon', 'Chef', 'Boat', 'Bicycles', 'Garden'], rating: 4.7, reviews: 56 },
  
  // NORTH - JAFFNA
  { id: 'jaffna-heritage-house', name: 'Jaffna Heritage House', location: 'Jaffna', region: 'north', image: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1200&q=90', category: 'Heritage House', bedrooms: 4, bathrooms: 4, sqft: 3500, land: '0.5 acres', pool: '10m', staff: 4, pricePerNight: 550, description: 'A beautifully restored Tamil manor house with traditional architecture, courtyard garden, and authentic northern Sri Lankan hospitality.', highlights: ['Tamil Heritage', 'Courtyard Garden', 'Island Excursions', 'Temple Tours'], amenities: ['Pool', 'Chef', 'Garden', 'Bicycles', 'Cultural Guide', 'Cooking Class'], rating: 4.8, reviews: 78 },
  { id: 'delft-island-retreat', name: 'Delft Island Retreat', location: 'Jaffna Islands', region: 'north', image: 'https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=1200&q=90', category: 'Island House', bedrooms: 3, bathrooms: 3, sqft: 2200, land: '1 acre', pool: 'None', staff: 3, pricePerNight: 380, description: 'A remote escape on historic Delft Island with wild ponies, ancient baobabs, and the ruins of Dutch forts. True off-grid luxury.', highlights: ['Wild Ponies', 'Dutch Ruins', 'Ancient Baobabs', 'Remote Paradise'], amenities: ['Beach', 'Chef', 'Boat Transfers', 'Fishing', 'Stargazing', 'History Tours'], rating: 4.7, reviews: 34 },
  
  // WILDLIFE COUNTRY
  { id: 'yala-leopard-lodge', name: 'Yala Leopard Lodge', location: 'Yala', region: 'wildlife', image: 'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?w=1200&q=90', category: 'Safari Lodge', bedrooms: 4, bathrooms: 4, sqft: 4500, land: '3 acres', pool: '15m', staff: 6, pricePerNight: 1300, description: 'At the doorstep of Yala National Park, home to the world\'s highest leopard density. Private safari vehicle and expert naturalist included.', highlights: ['Leopard Territory', 'Private Safaris', 'Bush Dinners', 'Wildlife Viewing'], amenities: ['Pool', 'Safari Vehicle', 'Naturalist', 'Chef', 'Boma', 'Hides'], rating: 4.9, reviews: 145 },
  { id: 'wilpattu-wilderness', name: 'Wilpattu Wilderness House', location: 'Wilpattu', region: 'wildlife', image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1200&q=90', category: 'Wilderness Lodge', bedrooms: 3, bathrooms: 3, sqft: 3000, land: '2 acres', pool: '12m Natural', staff: 5, pricePerNight: 850, description: 'Bordering Sri Lanka\'s largest national park, this wilderness house offers intimate wildlife encounters with leopards, sloth bears, and elephants.', highlights: ['Wilpattu Access', 'Sloth Bears', 'Natural Pool', 'Star Beds'], amenities: ['Pool', 'Safari', 'Chef', 'Star Beds', 'Bird Watching', 'Camping'], rating: 4.8, reviews: 89 }
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

const LuxuryHouses = () => {
  const [heroIndex, setHeroIndex] = useState(0);
  const [selectedRegion, setSelectedRegion] = useState('all');
  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const heroY = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

  const filteredHouses = selectedRegion === 'all' ? houseCollection : houseCollection.filter(h => h.region === selectedRegion);

  const bookingFields = [
    { name: 'name', label: 'Full Name', type: 'text' as const, placeholder: 'Your name', required: true },
    { name: 'email', label: 'Email', type: 'email' as const, placeholder: 'your@email.com', required: true },
    { name: 'phone', label: 'Phone', type: 'tel' as const, placeholder: '+94 77 123 4567', required: true },
    { name: 'checkIn', label: 'Check-In Date', type: 'date' as const, required: true },
    { name: 'checkOut', label: 'Check-Out Date', type: 'date' as const, required: true },
    { name: 'guests', label: 'Number of Guests', type: 'select' as const, required: true, options: [
      { value: '1-2', label: '1-2 Guests' }, { value: '3-4', label: '3-4 Guests' }, { value: '5-6', label: '5-6 Guests' }, { value: '7-10', label: '7-10 Guests' }, { value: '10+', label: '10+ Guests' }
    ]},
    { name: 'occasion', label: 'Occasion', type: 'select' as const, options: [
      { value: '', label: 'Select Occasion' }, { value: 'vacation', label: 'Family Vacation' }, { value: 'honeymoon', label: 'Honeymoon' }, { value: 'celebration', label: 'Birthday/Anniversary' }, { value: 'wedding', label: 'Wedding' }, { value: 'retreat', label: 'Corporate Retreat' }, { value: 'other', label: 'Other' }
    ]},
    { name: 'house', label: 'Preferred Property', type: 'select' as const, options: [
      { value: '', label: 'Help Me Choose' },
      ...houseCollection.map(h => ({ value: h.name, label: `${h.name} - ${h.location}` }))
    ]},
    { name: 'requests', label: 'Special Requests', type: 'textarea' as const, placeholder: 'Dietary needs, activities, celebrations, transfers, child ages...', halfWidth: false }
  ];

  useEffect(() => {
    const timer = setInterval(() => setHeroIndex((prev) => (prev + 1) % heroSlides.length), 6000);
    return () => clearInterval(timer);
  }, []);

  return (
    <>
      <Helmet>
        <title>Luxury Villas Sri Lanka | Private Beach Houses, Safari Lodges, Heritage Mansions | Recharge Travels</title>
        <meta name="description" content="Rent exclusive private villas in Sri Lanka. Beach houses in Weligama & Mirissa, tea bungalows in Nuwara Eliya, safari lodges near Yala, heritage homes in Jaffna." />
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
                <div className="h-px w-12 bg-gradient-to-r from-transparent to-emerald-400/60" />
                <span className="text-emerald-400/80 font-light tracking-[0.3em] text-xs uppercase">Private Estates</span>
                <div className="h-px w-12 bg-gradient-to-l from-transparent to-emerald-400/60" />
              </div>

              <AnimatePresence mode="wait">
                <motion.div key={heroIndex}>
                  <motion.h1 initial={{ y: 50, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: -50, opacity: 0 }} className="text-5xl md:text-7xl lg:text-8xl font-extralight tracking-tight text-white mb-2">
                    {heroSlides[heroIndex].title}
                  </motion.h1>
                  <motion.h2 initial={{ y: 30, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: -30, opacity: 0 }} transition={{ delay: 0.1 }} className="text-4xl md:text-6xl font-extralight text-emerald-400/90 mb-6">
                    {heroSlides[heroIndex].subtitle}
                  </motion.h2>
                  <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ delay: 0.2 }} className="text-lg text-gray-300 font-light">
                    {heroSlides[heroIndex].tagline}
                  </motion.p>
                </motion.div>
              </AnimatePresence>

              <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1, delay: 1 }} className="mt-12 flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg" className="group bg-emerald-500 hover:bg-emerald-400 text-black px-10 py-7 text-sm font-medium tracking-widest uppercase rounded-none" onClick={() => document.getElementById('houses')?.scrollIntoView({ behavior: 'smooth' })}>
                  Explore Properties <ArrowRight className="w-4 h-4 ml-3 group-hover:translate-x-1 transition-transform" />
                </Button>
                <Button size="lg" variant="outline" className="border border-white/20 text-white hover:bg-white/10 px-10 py-7 text-sm tracking-widest uppercase rounded-none" onClick={() => document.getElementById('booking')?.scrollIntoView({ behavior: 'smooth' })}>
                  <Phone className="w-4 h-4 mr-3" /> Book Now
                </Button>
              </motion.div>
            </motion.div>
          </motion.div>
        </section>

        {/* STATS */}
        <section className="py-10 bg-gradient-to-r from-emerald-900/20 via-emerald-800/10 to-emerald-900/20 border-y border-emerald-500/10">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
              {[
                { value: '15+', label: 'Private Estates' },
                { value: '7', label: 'Regions' },
                { value: 'Full', label: 'Staff Included' },
                { value: '24/7', label: 'Concierge' }
              ].map((stat, idx) => (
                <div key={idx}>
                  <div className="text-3xl font-light text-emerald-400 mb-1">{stat.value}</div>
                  <div className="text-xs text-gray-500 uppercase tracking-wider">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* REGION FILTER */}
        <section className="py-6 bg-[#0a0a0a] sticky top-0 z-30 border-b border-white/5">
          <div className="container mx-auto px-4">
            <div className="flex flex-wrap justify-center gap-2">
              {regions.map((region) => (
                <Button key={region.id} variant={selectedRegion === region.id ? "default" : "outline"} className={`rounded-none text-sm tracking-wider ${selectedRegion === region.id ? 'bg-emerald-500 text-black hover:bg-emerald-400' : 'border-white/20 text-gray-400 hover:bg-white/5 hover:text-white'}`} onClick={() => setSelectedRegion(region.id)}>
                  <region.icon className="w-4 h-4 mr-2" />{region.name}
                </Button>
              ))}
            </div>
          </div>
        </section>

        {/* HOUSE COLLECTION */}
        <section id="houses" className="py-20 bg-[#0a0a0a]">
          <div className="container mx-auto px-4">
            <AnimatedSection className="text-center mb-12">
              <h2 className="text-4xl md:text-5xl font-extralight tracking-tight mb-4">
                {selectedRegion === 'all' ? 'All' : regions.find(r => r.id === selectedRegion)?.name} <span className="text-emerald-400">Properties</span>
              </h2>
              <p className="text-gray-400 font-light">{filteredHouses.length} exclusive estates</p>
            </AnimatedSection>

            <div className="space-y-8">
              {filteredHouses.map((house, idx) => (
                <AnimatedSection key={house.id}>
                  <motion.div whileHover={{ y: -4 }} transition={{ duration: 0.3 }} className={`bg-white/[0.02] border border-white/5 hover:border-emerald-500/30 transition-all duration-500 overflow-hidden ${idx % 2 === 0 ? '' : 'md:flex-row-reverse'} md:flex`}>
                    {/* Image */}
                    <div className="md:w-1/2 relative aspect-[16/10] md:aspect-auto overflow-hidden">
                      <motion.img src={house.image} alt={house.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent md:bg-gradient-to-r md:from-transparent md:via-transparent md:to-black/40" />
                      <div className="absolute top-4 left-4">
                        <Badge className="bg-emerald-500/90 text-black border-0 font-medium">{house.category}</Badge>
                      </div>
                      <div className="absolute top-4 right-4 flex items-center gap-1 bg-black/60 backdrop-blur-sm px-2 py-1">
                        <Star className="w-4 h-4 text-emerald-400 fill-emerald-400" />
                        <span className="text-white font-medium">{house.rating}</span>
                      </div>
                    </div>
                    
                    {/* Content */}
                    <div className="md:w-1/2 p-6 md:p-8 flex flex-col">
                      <div className="flex items-center gap-2 text-emerald-400/80 text-sm mb-2">
                        <MapPin className="w-4 h-4" />{house.location}
                      </div>
                      <h3 className="text-2xl md:text-3xl font-light text-white mb-3">{house.name}</h3>
                      <p className="text-gray-400 font-light mb-4">{house.description}</p>
                      
                      {/* Specs */}
                      <div className="grid grid-cols-3 md:grid-cols-6 gap-3 mb-4">
                        <div className="text-center p-2 bg-white/5">
                          <Bed className="w-4 h-4 text-emerald-400 mx-auto mb-1" />
                          <div className="text-white text-sm">{house.bedrooms}</div>
                          <div className="text-xs text-gray-500">Beds</div>
                        </div>
                        <div className="text-center p-2 bg-white/5">
                          <Bath className="w-4 h-4 text-emerald-400 mx-auto mb-1" />
                          <div className="text-white text-sm">{house.bathrooms}</div>
                          <div className="text-xs text-gray-500">Baths</div>
                        </div>
                        <div className="text-center p-2 bg-white/5">
                          <Maximize className="w-4 h-4 text-emerald-400 mx-auto mb-1" />
                          <div className="text-white text-sm">{house.sqft.toLocaleString()}</div>
                          <div className="text-xs text-gray-500">sqft</div>
                        </div>
                        <div className="text-center p-2 bg-white/5">
                          <Fence className="w-4 h-4 text-emerald-400 mx-auto mb-1" />
                          <div className="text-white text-sm">{house.land}</div>
                          <div className="text-xs text-gray-500">Land</div>
                        </div>
                        <div className="text-center p-2 bg-white/5">
                          <Waves className="w-4 h-4 text-emerald-400 mx-auto mb-1" />
                          <div className="text-white text-sm">{house.pool}</div>
                          <div className="text-xs text-gray-500">Pool</div>
                        </div>
                        <div className="text-center p-2 bg-white/5">
                          <Users className="w-4 h-4 text-emerald-400 mx-auto mb-1" />
                          <div className="text-white text-sm">{house.staff}</div>
                          <div className="text-xs text-gray-500">Staff</div>
                        </div>
                      </div>
                      
                      {/* Highlights */}
                      <div className="flex flex-wrap gap-2 mb-4">
                        {house.highlights.map((h, i) => (
                          <span key={i} className="text-xs px-2 py-1 bg-emerald-500/10 text-emerald-400/80 border border-emerald-500/20">{h}</span>
                        ))}
                      </div>
                      
                      {/* Price & CTA */}
                      <div className="mt-auto pt-4 border-t border-white/5 flex items-center justify-between">
                        <div>
                          <div className="text-xs text-gray-500">From</div>
                          <div className="text-2xl font-light text-white">${house.pricePerNight.toLocaleString()}<span className="text-sm text-gray-500">/night</span></div>
                          <div className="text-xs text-emerald-400">All-inclusive with staff</div>
                        </div>
                        <div className="flex gap-2">
                          <Button className="bg-emerald-500 hover:bg-emerald-400 text-black rounded-none px-6" onClick={() => document.getElementById('booking')?.scrollIntoView({ behavior: 'smooth' })}>
                            Book Now
                          </Button>
                          <a href={`https://wa.me/94777721999?text=I'm%20interested%20in%20${encodeURIComponent(house.name)}`} target="_blank" rel="noopener noreferrer" className="p-3 border border-white/20 hover:border-[#25D366] hover:bg-[#25D366]/10 transition-all">
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

        {/* WHAT'S INCLUDED */}
        <section className="py-20 bg-gradient-to-b from-[#0a0a0a] via-emerald-950/10 to-[#0a0a0a]">
          <div className="container mx-auto px-4">
            <AnimatedSection className="text-center mb-12">
              <h2 className="text-4xl font-extralight tracking-tight mb-4">What's <span className="text-emerald-400">Included</span></h2>
              <p className="text-gray-400">Every booking includes these premium services</p>
            </AnimatedSection>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {[
                { icon: UtensilsCrossed, title: 'Private Chef' },
                { icon: PersonStanding, title: 'Butler Service' },
                { icon: Shirt, title: 'Housekeeping' },
                { icon: Car, title: 'Airport Transfer' },
                { icon: Wifi, title: 'High-Speed WiFi' },
                { icon: Shield, title: '24/7 Security' }
              ].map((service, idx) => (
                <motion.div key={idx} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: idx * 0.1 }} className="text-center p-4 bg-white/[0.02] border border-white/5 hover:border-emerald-500/30 transition-all">
                  <service.icon className="w-8 h-8 text-emerald-400 mx-auto mb-2" />
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
                <h2 className="text-4xl md:text-5xl font-extralight tracking-tight mb-4">Reserve Your <span className="text-emerald-400">Estate</span></h2>
                <p className="text-gray-400 font-light">Full staff • All-inclusive • Bespoke experiences</p>
              </AnimatedSection>
              <LuxuryBookingForm
                type="villa"
                title="Private House Inquiry"
                subtitle="Our concierge will create your perfect stay"
                fields={bookingFields}
                accentColor="emerald"
              />
            </div>
          </div>
        </section>

        {/* CONTACT */}
        <section className="py-12 bg-emerald-900/20 border-t border-emerald-500/10">
          <div className="container mx-auto px-4">
            <div className="flex flex-col lg:flex-row items-center justify-between gap-6">
              <div className="text-center lg:text-left">
                <h3 className="text-xl font-light text-white mb-1">Planning a Special Occasion?</h3>
                <p className="text-gray-400 text-sm">Weddings, celebrations, corporate retreats - we do it all</p>
              </div>
              <div className="flex flex-wrap justify-center gap-4">
                <a href="https://wa.me/94777721999?text=I'm%20looking%20for%20a%20private%20villa%20in%20Sri%20Lanka" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 bg-[#25D366] hover:bg-[#128C7E] text-white px-6 py-3 transition-all">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/></svg>
                  WhatsApp
                </a>
                <a href="tel:+94777721999" className="flex items-center gap-2 border border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/10 px-6 py-3 transition-all">
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

export default LuxuryHouses;
