import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { motion, AnimatePresence } from 'framer-motion';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Crown,
  Anchor,
  Clock,
  Shield,
  MapPin,
  Phone,
  Mail,
  Star,
  ChevronLeft,
  ChevronRight,
  Check,
  Users,
  Ship,
  Waves,
  Compass,
  Sparkles,
  ArrowRight,
  Award,
  Timer,
  Wine,
  UtensilsCrossed,
  Wifi,
  Wind,
  Sun,
  Moon,
  Camera,
  Music
} from 'lucide-react';
import { db } from '@/lib/firebase';
import { collection, getDocs, addDoc, query, where, limit } from 'firebase/firestore';
import { toast } from 'sonner';
import { luxuryPagesService, YachtData, YachtDestination, LuxuryContactInfo } from '@/services/luxuryPagesService';

// Hero images for the slider
const defaultHeroImages = [
  {
    url: 'https://images.unsplash.com/photo-1567899378494-47b22a2ae96a?w=1920&q=90',
    title: 'Superyacht Excellence',
    subtitle: 'Where ocean meets opulence'
  },
  {
    url: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=1920&q=90',
    title: 'Sunset Cruises',
    subtitle: 'Golden hours on sapphire waters'
  },
  {
    url: 'https://images.unsplash.com/photo-1540946485063-a40da27545f8?w=1920&q=90',
    title: 'Island Hopping',
    subtitle: 'Discover Sri Lanka\'s hidden coastline'
  },
  {
    url: 'https://images.unsplash.com/photo-1569263979104-865ab7cd8d13?w=1920&q=90',
    title: 'Private Charters',
    subtitle: 'Your vessel, your journey'
  }
];

// Yacht fleet with detailed specifications
const yachtFleet = [
  {
    id: 'superyacht-azure',
    name: 'M/Y Azure Dream',
    type: 'Superyacht',
    image: 'https://images.unsplash.com/photo-1567899378494-47b22a2ae96a?w=800&q=80',
    length: '45m (148ft)',
    guests: 12,
    cabins: 6,
    crew: 9,
    speed: '16 knots',
    cruisingSpeed: '12 knots',
    builder: 'Benetti',
    yearBuilt: 2019,
    refit: 2023,
    features: ['Jacuzzi on deck', 'Beach club', 'Jet skis', 'Tender', 'Stabilizers', 'WiFi', 'Cinema room'],
    amenities: ['Master suite with balcony', 'Full-beam VIP cabin', 'Spa treatment room', 'Gym', 'Wine cellar'],
    pricePerDay: 'USD 18,500',
    pricePerWeek: 'USD 115,000',
    description: 'Elegant Italian craftsmanship meets modern luxury. This Benetti masterpiece offers unparalleled comfort with zero-speed stabilizers for the smoothest sailing experience.'
  },
  {
    id: 'motor-yacht-pearl',
    name: 'M/Y Pearl Horizon',
    type: 'Motor Yacht',
    image: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=800&q=80',
    length: '32m (105ft)',
    guests: 10,
    cabins: 5,
    crew: 6,
    speed: '22 knots',
    cruisingSpeed: '14 knots',
    builder: 'Sunseeker',
    yearBuilt: 2021,
    refit: null,
    features: ['Flybridge', 'Hydraulic swim platform', 'Jet tender', 'Seabobs', 'Snorkeling gear', 'Paddleboards'],
    amenities: ['Full-beam master', 'Open-plan salon', 'Al fresco dining', 'Bar', 'Sound system'],
    pricePerDay: 'USD 12,500',
    pricePerWeek: 'USD 78,000',
    description: 'British elegance and performance. The Sunseeker delivers exhilarating speed with sophisticated interiors, perfect for island exploration.'
  },
  {
    id: 'catamaran-serenity',
    name: 'S/Y Serenity',
    type: 'Luxury Catamaran',
    image: 'https://images.unsplash.com/photo-1540946485063-a40da27545f8?w=800&q=80',
    length: '24m (78ft)',
    guests: 8,
    cabins: 4,
    crew: 4,
    speed: '12 knots',
    cruisingSpeed: '8 knots',
    builder: 'Lagoon',
    yearBuilt: 2022,
    refit: null,
    features: ['Trampolines', 'Solar panels', 'Electric winches', 'Kayaks', 'Fishing gear', 'BBQ'],
    amenities: ['Spacious deck salon', 'Panoramic windows', 'Equal cabins', 'Eco-friendly systems'],
    pricePerDay: 'USD 6,500',
    pricePerWeek: 'USD 42,000',
    description: 'Sustainable luxury meets stability. This eco-conscious catamaran offers incredible space and smooth sailing, ideal for families and groups.'
  },
  {
    id: 'classic-yacht',
    name: 'S/Y Ceylon Star',
    type: 'Classic Sailing Yacht',
    image: 'https://images.unsplash.com/photo-1569263979104-865ab7cd8d13?w=800&q=80',
    length: '28m (92ft)',
    guests: 8,
    cabins: 4,
    crew: 5,
    speed: '14 knots',
    cruisingSpeed: '10 knots',
    builder: 'Royal Huisman',
    yearBuilt: 1998,
    refit: 2022,
    features: ['Teak decks', 'Classic rigging', 'Modern navigation', 'Tender', 'Snorkeling', 'Fishing'],
    amenities: ['Wood-paneled interiors', 'Library', 'Formal dining', 'Antique furnishings'],
    pricePerDay: 'USD 8,500',
    pricePerWeek: 'USD 55,000',
    description: 'Timeless elegance under sail. This meticulously restored classic yacht combines heritage craftsmanship with modern safety and comfort.'
  }
];

// Popular destinations
const destinations = [
  {
    name: 'Trincomalee Bay',
    duration: '3-5 days',
    description: 'Crystal clear waters, whale watching, and pristine beaches',
    highlights: ['Pigeon Island', 'Whale watching', 'Marble Beach', 'Hot springs'],
    bestSeason: 'April - September'
  },
  {
    name: 'Southern Coast',
    duration: '5-7 days',
    description: 'From Galle Fort to Mirissa, explore the tropical south',
    highlights: ['Galle Fort', 'Unawatuna', 'Whale watching Mirissa', 'Weligama Bay'],
    bestSeason: 'November - April'
  },
  {
    name: 'Kalpitiya & Bar Reef',
    duration: '2-4 days',
    description: 'Dolphins, kitesurfing, and untouched islands',
    highlights: ['Dolphin pods', 'Bar Reef sanctuary', 'Dutch Bay', 'Kitesurfing'],
    bestSeason: 'May - October'
  },
  {
    name: 'Maldives Extension',
    duration: '7-14 days',
    description: 'Cross the Indian Ocean to paradise atolls',
    highlights: ['Male Atoll', 'Baa Atoll', 'Private islands', 'Diving'],
    bestSeason: 'Year-round'
  }
];

// Onboard experiences
const experiences = [
  {
    icon: UtensilsCrossed,
    title: 'Private Chef',
    description: 'Michelin-trained chefs prepare personalized menus with local seafood'
  },
  {
    icon: Wine,
    title: 'Sommelier Service',
    description: 'Curated wine selections and champagne from our onboard cellar'
  },
  {
    icon: Sun,
    title: 'Water Sports',
    description: 'Jet skis, seabobs, kayaks, paddleboards, and diving equipment'
  },
  {
    icon: Camera,
    title: 'Aerial Photography',
    description: 'Drone footage and professional photography of your voyage'
  },
  {
    icon: Music,
    title: 'Live Entertainment',
    description: 'DJ, musicians, or traditional Sri Lankan performances on deck'
  },
  {
    icon: Moon,
    title: 'Night Fishing',
    description: 'Traditional fishing expeditions with your catch prepared fresh'
  }
];

const PrivateYachts = () => {
  const [heroIndex, setHeroIndex] = useState(0);
  const [heroImages, setHeroImages] = useState(defaultHeroImages);
  const [fleet, setFleet] = useState(yachtFleet);
  const [yachtDestinations, setYachtDestinations] = useState(destinations);
  const [selectedYacht, setSelectedYacht] = useState(yachtFleet[0]);
  const [loading, setLoading] = useState(false);
  const [contactInfo, setContactInfo] = useState<LuxuryContactInfo>({
    phone: '+94 777 721 999',
    whatsApp: '94777721999',
    email: 'luxury@rechargetravels.com'
  });
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    startDate: '',
    endDate: '',
    guests: '4',
    yacht: '',
    destination: '',
    requests: ''
  });

  // Auto-rotate hero images
  useEffect(() => {
    const timer = setInterval(() => {
      setHeroIndex((prev) => (prev + 1) % heroImages.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [heroImages.length]);

  // Load content from Firebase
  useEffect(() => {
    const loadContent = async () => {
      try {
        // Load page content
        const pageContent = await luxuryPagesService.getYachtPageContent();
        if (pageContent) {
          if (pageContent.heroImages?.length) {
            setHeroImages(pageContent.heroImages);
          }
        }

        // Load fleet from Firebase (if available)
        const fleetData = await luxuryPagesService.getYachtFleet();
        if (fleetData.length > 0) {
          setFleet(fleetData as any);
          setSelectedYacht(fleetData[0] as any);
        }

        // Load destinations from Firebase (if available)
        const destData = await luxuryPagesService.getYachtDestinations();
        if (destData.length > 0) {
          setYachtDestinations(destData as any);
        }

        // Load contact info
        const contact = await luxuryPagesService.getContactInfo();
        setContactInfo(contact);
      } catch (error) {
        console.error('Error loading yacht page content:', error);
      }
    };
    loadContent();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const docRef = await addDoc(collection(db, 'yachtInquiries'), {
        ...formData,
        createdAt: new Date(),
        status: 'new',
        source: 'private-yachts-page',
        notificationSent: false
      });
      
      // Send email notification
      try {
        await fetch('https://us-central1-recharge-travels-73e76.cloudfunctions.net/sendLuxuryInquiryEmail', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            to: 'luxury@rechargetravels.com',
            subject: `⚓ New Yacht Charter Inquiry - ${formData.name}`,
            inquiryId: docRef.id,
            customerName: formData.name,
            customerEmail: formData.email,
            customerPhone: formData.phone,
            startDate: formData.startDate,
            endDate: formData.endDate,
            guests: formData.guests,
            yacht: formData.yacht || 'Any available',
            destination: formData.destination,
            specialRequests: formData.requests,
            type: 'yacht-charter'
          })
        });
      } catch (emailError) {
        console.log('Email notification queued for retry');
      }
      
      toast.success('Your yacht inquiry has been submitted. Our maritime concierge will contact you within 2 hours.', {
        duration: 5000,
        icon: '⚓'
      });
      
      setFormData({
        name: '',
        email: '',
        phone: '',
        startDate: '',
        endDate: '',
        guests: '4',
        yacht: '',
        destination: '',
        requests: ''
      });
    } catch (error) {
      console.error('Error submitting inquiry:', error);
      toast.error('Failed to submit inquiry. Please try again or contact us directly.');
    } finally {
      setLoading(false);
    }
  };

  const nextSlide = () => setHeroIndex((prev) => (prev + 1) % heroImages.length);
  const prevSlide = () => setHeroIndex((prev) => (prev - 1 + heroImages.length) % heroImages.length);

  return (
    <>
      <Helmet>
        <title>Private Yacht Charters Sri Lanka | Luxury Superyachts | Recharge Travels</title>
        <meta name="description" content="Charter luxury yachts in Sri Lanka. Superyachts, motor yachts, catamarans. Explore Trincomalee, Southern Coast, Maldives. Full crew, chef, water sports included." />
      </Helmet>

      <Header />

      <main className="min-h-screen bg-black text-white">
        {/* HERO SECTION */}
        <section className="relative h-screen overflow-hidden">
          <AnimatePresence mode="wait">
            <motion.div
              key={heroIndex}
              initial={{ opacity: 0, scale: 1.1 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1.5 }}
              className="absolute inset-0"
            >
              <img
                src={heroImages[heroIndex].url}
                alt={heroImages[heroIndex].title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/30 to-black" />
            </motion.div>
          </AnimatePresence>

          <div className="relative z-10 h-full flex flex-col justify-center items-center text-center px-4">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.5 }}
              className="max-w-5xl"
            >
              <div className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-500/20 to-cyan-500/20 border border-blue-400/30 px-6 py-2 rounded-full mb-8">
                <Anchor className="w-5 h-5 text-blue-400" />
                <span className="text-blue-300 font-semibold tracking-wider text-sm uppercase">Private Yacht Fleet</span>
              </div>

              <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold mb-6 leading-tight">
                <span className="text-white">Sail Into</span>
                <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-cyan-400 to-teal-400">
                  Paradise
                </span>
              </h1>

              <AnimatePresence mode="wait">
                <motion.p
                  key={heroIndex}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="text-xl md:text-2xl text-gray-300 mb-8 max-w-3xl mx-auto"
                >
                  {heroImages[heroIndex].subtitle}
                </motion.p>
              </AnimatePresence>

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button
                  size="lg"
                  className="bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white px-10 py-7 text-lg rounded-full shadow-2xl shadow-blue-500/25"
                  onClick={() => document.getElementById('booking')?.scrollIntoView({ behavior: 'smooth' })}
                >
                  <Anchor className="w-5 h-5 mr-2" />
                  Charter Now
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="border-2 border-white/30 text-white hover:bg-white/10 px-10 py-7 text-lg rounded-full"
                  onClick={() => document.getElementById('fleet')?.scrollIntoView({ behavior: 'smooth' })}
                >
                  Explore Fleet
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </div>

              <div className="mt-16 flex flex-wrap justify-center gap-12">
                {[
                  { icon: Ship, value: '4', label: 'Luxury Vessels' },
                  { icon: Users, value: '8-12', label: 'Guests Capacity' },
                  { icon: Award, value: '5-Star', label: 'Service Rating' },
                  { icon: Compass, value: '24/7', label: 'Concierge' }
                ].map((stat, idx) => (
                  <div key={idx} className="flex items-center gap-3">
                    <stat.icon className="w-6 h-6 text-blue-400" />
                    <div className="text-left">
                      <div className="text-2xl font-bold text-white">{stat.value}</div>
                      <div className="text-sm text-gray-400">{stat.label}</div>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Slider Controls */}
          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex items-center gap-4">
            <button onClick={prevSlide} className="w-12 h-12 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center hover:bg-white/20 transition-all">
              <ChevronLeft className="w-6 h-6" />
            </button>
            <div className="flex gap-2">
              {heroImages.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setHeroIndex(idx)}
                  className={`h-2 rounded-full transition-all ${idx === heroIndex ? 'w-8 bg-blue-400' : 'w-2 bg-white/40'}`}
                />
              ))}
            </div>
            <button onClick={nextSlide} className="w-12 h-12 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center hover:bg-white/20 transition-all">
              <ChevronRight className="w-6 h-6" />
            </button>
          </div>
        </section>

        {/* FLEET SECTION */}
        <section id="fleet" className="py-24 bg-gradient-to-b from-black via-slate-950 to-slate-900">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <Badge className="bg-blue-500/20 text-blue-300 border-blue-400/30 mb-4">
                <Crown className="w-4 h-4 mr-2" />
                Our Fleet
              </Badge>
              <h2 className="text-4xl md:text-5xl font-bold mb-4">
                Luxury Vessels
              </h2>
              <p className="text-xl text-gray-400 max-w-3xl mx-auto">
                From sleek motor yachts to majestic superyachts, each vessel in our fleet 
                is maintained to the highest standards with professional crew.
              </p>
            </div>

            {/* Fleet Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
              {fleet.map((yacht) => (
                <motion.div
                  key={yacht.id}
                  whileHover={{ y: -8 }}
                  className={`relative rounded-2xl overflow-hidden cursor-pointer transition-all ${
                    selectedYacht.id === yacht.id
                      ? 'ring-2 ring-blue-400 shadow-xl shadow-blue-500/20'
                      : 'hover:shadow-xl'
                  }`}
                  onClick={() => setSelectedYacht(yacht)}
                >
                  <div className="aspect-[4/3] relative">
                    <img src={yacht.image} alt={yacht.name} className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />
                    <Badge className="absolute top-3 left-3 bg-blue-500/80 text-white">{yacht.type}</Badge>
                  </div>
                  <div className="absolute bottom-0 left-0 right-0 p-4">
                    <h3 className="text-lg font-bold text-white mb-1">{yacht.name}</h3>
                    <div className="flex items-center gap-4 text-sm text-gray-300">
                      <span className="flex items-center gap-1">
                        <Users className="w-4 h-4" />
                        {yacht.guests} guests
                      </span>
                      <span>{yacht.length}</span>
                    </div>
                  </div>
                  {selectedYacht.id === yacht.id && (
                    <div className="absolute top-3 right-3 w-6 h-6 rounded-full bg-blue-500 flex items-center justify-center">
                      <Check className="w-4 h-4 text-white" />
                    </div>
                  )}
                </motion.div>
              ))}
            </div>

            {/* Selected Yacht Details */}
            <motion.div
              key={selectedYacht.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 rounded-3xl p-8 border border-white/10"
            >
              <div className="grid lg:grid-cols-2 gap-8">
                <div>
                  <div className="flex items-center gap-3 mb-4">
                    <h3 className="text-3xl font-bold">{selectedYacht.name}</h3>
                    <Badge className="bg-blue-500/20 text-blue-300">{selectedYacht.builder}</Badge>
                  </div>
                  <p className="text-gray-400 mb-6">{selectedYacht.description}</p>
                  
                  {/* Primary Specs */}
                  <div className="grid grid-cols-4 gap-3 mb-6">
                    <div className="bg-white/5 rounded-xl p-3 text-center">
                      <Ship className="w-5 h-5 text-blue-400 mx-auto mb-1" />
                      <div className="text-lg font-bold">{selectedYacht.length}</div>
                      <div className="text-xs text-gray-400">Length</div>
                    </div>
                    <div className="bg-white/5 rounded-xl p-3 text-center">
                      <Users className="w-5 h-5 text-blue-400 mx-auto mb-1" />
                      <div className="text-lg font-bold">{selectedYacht.guests}</div>
                      <div className="text-xs text-gray-400">Guests</div>
                    </div>
                    <div className="bg-white/5 rounded-xl p-3 text-center">
                      <Moon className="w-5 h-5 text-blue-400 mx-auto mb-1" />
                      <div className="text-lg font-bold">{selectedYacht.cabins}</div>
                      <div className="text-xs text-gray-400">Cabins</div>
                    </div>
                    <div className="bg-white/5 rounded-xl p-3 text-center">
                      <Wind className="w-5 h-5 text-blue-400 mx-auto mb-1" />
                      <div className="text-lg font-bold">{selectedYacht.speed}</div>
                      <div className="text-xs text-gray-400">Max Speed</div>
                    </div>
                  </div>

                  {/* Technical Details */}
                  <div className="bg-white/5 rounded-xl p-4 mb-6">
                    <h4 className="text-sm font-semibold text-blue-400 uppercase tracking-wider mb-3">Specifications</h4>
                    <div className="grid grid-cols-2 gap-3 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-500">Builder</span>
                        <span className="text-white font-medium">{selectedYacht.builder}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-500">Year Built</span>
                        <span className="text-white font-medium">{selectedYacht.yearBuilt}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-500">Crew</span>
                        <span className="text-white font-medium">{selectedYacht.crew} members</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-500">Cruise Speed</span>
                        <span className="text-white font-medium">{selectedYacht.cruisingSpeed}</span>
                      </div>
                      {selectedYacht.refit && (
                        <div className="flex justify-between col-span-2">
                          <span className="text-gray-500">Last Refit</span>
                          <span className="text-white font-medium">{selectedYacht.refit}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Features */}
                  <div className="flex flex-wrap gap-2 mb-4">
                    {selectedYacht.features.map((feature, idx) => (
                      <Badge key={idx} variant="outline" className="text-blue-300 border-blue-400/30">
                        <Check className="w-3 h-3 mr-1" />
                        {feature}
                      </Badge>
                    ))}
                  </div>

                  {/* Amenities */}
                  <div className="text-sm text-gray-400">
                    <span className="font-semibold text-white">Amenities: </span>
                    {selectedYacht.amenities.join(' • ')}
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="relative aspect-video rounded-2xl overflow-hidden">
                    <img 
                      src={selectedYacht.image} 
                      alt={selectedYacht.name}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute bottom-4 left-4 right-4 bg-black/80 backdrop-blur-sm rounded-xl p-4">
                      <div className="flex justify-between items-center">
                        <div>
                          <div className="text-sm text-gray-400">Daily Rate</div>
                          <div className="text-blue-400 font-bold text-xl">{selectedYacht.pricePerDay}</div>
                        </div>
                        <div className="text-right">
                          <div className="text-sm text-gray-400">Weekly Rate</div>
                          <div className="text-white font-bold text-xl">{selectedYacht.pricePerWeek}</div>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <Button
                    className="w-full bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white py-6 rounded-xl"
                    onClick={() => {
                      setFormData({ ...formData, yacht: selectedYacht.name });
                      document.getElementById('booking')?.scrollIntoView({ behavior: 'smooth' });
                    }}
                  >
                    <Anchor className="w-5 h-5 mr-2" />
                    Charter {selectedYacht.name}
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </Button>
                  
                  <a
                    href={`https://wa.me/94777721999?text=Hi%20Recharge%20Travels,%20I'm%20interested%20in%20chartering%20the%20${encodeURIComponent(selectedYacht.name)}.`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2 w-full bg-[#25D366] hover:bg-[#128C7E] text-white py-4 rounded-xl transition-all"
                  >
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/></svg>
                    WhatsApp Inquiry
                  </a>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* ONBOARD EXPERIENCES */}
        <section className="py-24 bg-slate-900">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <Badge className="bg-amber-500/20 text-amber-300 border-amber-400/30 mb-4">
                <Sparkles className="w-4 h-4 mr-2" />
                Onboard Luxury
              </Badge>
              <h2 className="text-4xl md:text-5xl font-bold mb-4">
                Beyond Expectations
              </h2>
              <p className="text-xl text-gray-400 max-w-3xl mx-auto">
                Every charter includes world-class amenities and experiences
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {experiences.map((exp, idx) => (
                <Card key={idx} className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 border-white/10 hover:border-blue-400/30 transition-all group">
                  <CardContent className="p-6">
                    <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-500/20 to-cyan-500/20 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                      <exp.icon className="w-7 h-7 text-blue-400" />
                    </div>
                    <h3 className="text-xl font-bold mb-2">{exp.title}</h3>
                    <p className="text-gray-400">{exp.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* DESTINATIONS */}
        <section className="py-24 bg-gradient-to-b from-slate-900 to-black">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <Badge className="bg-cyan-500/20 text-cyan-300 border-cyan-400/30 mb-4">
                <MapPin className="w-4 h-4 mr-2" />
                Destinations
              </Badge>
              <h2 className="text-4xl md:text-5xl font-bold mb-4">
                Explore Sri Lanka's Waters
              </h2>
              <p className="text-xl text-gray-400 max-w-3xl mx-auto">
                From hidden coves to whale watching grounds, discover paradise by sea
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {yachtDestinations.map((dest, idx) => (
                <motion.div
                  key={idx}
                  whileHover={{ y: -4 }}
                  className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 rounded-2xl p-6 border border-white/10 hover:border-cyan-400/30 transition-all"
                >
                  <div className="flex items-center gap-2 text-cyan-400 mb-3">
                    <Clock className="w-5 h-5" />
                    <span className="font-semibold">{dest.duration}</span>
                  </div>
                  <h3 className="text-xl font-bold mb-2">{dest.name}</h3>
                  <p className="text-gray-400 text-sm mb-4">{dest.description}</p>
                  <div className="flex flex-wrap gap-1 mb-3">
                    {dest.highlights.slice(0, 3).map((h, i) => (
                      <Badge key={i} variant="outline" className="text-xs text-gray-300 border-gray-600">{h}</Badge>
                    ))}
                  </div>
                  <div className="text-sm text-blue-400">
                    <Sun className="w-4 h-4 inline mr-1" />
                    Best: {dest.bestSeason}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* BOOKING FORM */}
        <section id="booking" className="py-24 bg-black">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <div className="text-center mb-12">
                <Badge className="bg-blue-500/20 text-blue-300 border-blue-400/30 mb-4">
                  <Anchor className="w-4 h-4 mr-2" />
                  Charter Inquiry
                </Badge>
                <h2 className="text-4xl md:text-5xl font-bold mb-4">
                  Set Sail Today
                </h2>
                <p className="text-xl text-gray-400">
                  Our maritime concierge will craft your perfect voyage
                </p>
              </div>

              <form onSubmit={handleSubmit} className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 rounded-3xl p-8 md:p-12 border border-white/10">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Full Name *</label>
                    <Input
                      required
                      placeholder="Your name"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="bg-white/5 border-white/20 text-white placeholder:text-gray-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Email *</label>
                    <Input
                      required
                      type="email"
                      placeholder="your@email.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="bg-white/5 border-white/20 text-white placeholder:text-gray-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Phone *</label>
                    <Input
                      required
                      placeholder="+1 234 567 8900"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="bg-white/5 border-white/20 text-white placeholder:text-gray-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Number of Guests</label>
                    <Input
                      type="number"
                      min="1"
                      max="12"
                      value={formData.guests}
                      onChange={(e) => setFormData({ ...formData, guests: e.target.value })}
                      className="bg-white/5 border-white/20 text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Start Date</label>
                    <Input
                      type="date"
                      value={formData.startDate}
                      onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                      className="bg-white/5 border-white/20 text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">End Date</label>
                    <Input
                      type="date"
                      value={formData.endDate}
                      onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                      className="bg-white/5 border-white/20 text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Preferred Yacht</label>
                    <select
                      value={formData.yacht}
                      onChange={(e) => setFormData({ ...formData, yacht: e.target.value })}
                      className="w-full bg-white/5 border border-white/20 text-white rounded-md px-3 py-2"
                    >
                      <option value="">Any available</option>
                      {fleet.map((y) => (
                        <option key={y.id} value={y.name}>{y.name} - {y.type}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Destination</label>
                    <select
                      value={formData.destination}
                      onChange={(e) => setFormData({ ...formData, destination: e.target.value })}
                      className="w-full bg-white/5 border border-white/20 text-white rounded-md px-3 py-2"
                    >
                      <option value="">Select destination</option>
                      {yachtDestinations.map((d, i) => (
                        <option key={i} value={d.name}>{d.name}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="mb-8">
                  <label className="block text-sm font-medium text-gray-300 mb-2">Special Requests</label>
                  <Textarea
                    placeholder="Celebrations, dietary requirements, specific activities, etc."
                    rows={4}
                    value={formData.requests}
                    onChange={(e) => setFormData({ ...formData, requests: e.target.value })}
                    className="bg-white/5 border-white/20 text-white placeholder:text-gray-500"
                  />
                </div>

                <Button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white py-6 text-lg rounded-xl"
                >
                  {loading ? 'Submitting...' : 'Request Charter Quote'}
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>

                <p className="text-center text-gray-500 text-sm mt-4">
                  Complimentary itinerary planning included. No commitment required.
                </p>
              </form>
            </div>
          </div>
        </section>

        {/* CONTACT BAR */}
        <section className="py-12 bg-gradient-to-r from-blue-600 to-cyan-600">
          <div className="container mx-auto px-4">
            <div className="flex flex-col md:flex-row items-center justify-between gap-6">
              <div>
                <h3 className="text-2xl font-bold text-white mb-2">Ready to Set Sail?</h3>
                <p className="text-blue-100">Our maritime concierge is available 24/7</p>
              </div>
              <div className="flex flex-wrap gap-3">
                <a 
                  href="https://wa.me/94777721999?text=Hi%20Recharge%20Travels,%20I'm%20interested%20in%20yacht%20charter%20services."
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 bg-[#25D366] text-white px-6 py-3 rounded-full font-semibold hover:bg-[#128C7E] transition-all"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/></svg>
                  WhatsApp
                </a>
                <a href="tel:+94777721999" className="flex items-center gap-2 bg-white text-blue-600 px-6 py-3 rounded-full font-semibold hover:bg-blue-50 transition-all">
                  <Phone className="w-5 h-5" />
                  +94 777 721 999
                </a>
                <a href="mailto:luxury@rechargetravels.com?subject=Yacht%20Charter%20Inquiry" className="flex items-center gap-2 bg-white/20 text-white px-6 py-3 rounded-full font-semibold hover:bg-white/30 transition-all">
                  <Mail className="w-5 h-5" />
                  luxury@rechargetravels.com
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

export default PrivateYachts;
