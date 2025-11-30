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
  Plane,
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
  Compass,
  Sparkles,
  ArrowRight,
  Award,
  Timer,
  Wine,
  Wifi,
  Bed,
  Briefcase,
  Globe,
  Zap,
  Lock,
  Heart
} from 'lucide-react';
import { db } from '@/lib/firebase';
import { collection, getDocs, addDoc, doc, getDoc, query, where, limit } from 'firebase/firestore';
import { toast } from 'sonner';
import { luxuryPagesService, LuxuryContactInfo } from '@/services/luxuryPagesService';

// Hero images for the slider
const defaultHeroImages = [
  {
    url: 'https://images.unsplash.com/photo-1540962351504-03099e0a754b?w=1920&q=90',
    title: 'Gulfstream G700',
    subtitle: 'The pinnacle of private aviation'
  },
  {
    url: 'https://images.unsplash.com/photo-1474302770737-173ee21bab63?w=1920&q=90',
    title: 'Global Reach',
    subtitle: 'Non-stop to anywhere in the world'
  },
  {
    url: 'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=1920&q=90',
    title: 'Sky Sanctuary',
    subtitle: 'Your office above the clouds'
  },
  {
    url: 'https://images.unsplash.com/photo-1559128010-7c1ad6e1b6a5?w=1920&q=90',
    title: 'Effortless Travel',
    subtitle: 'Skip the terminals, own your schedule'
  }
];

// Jet fleet with detailed specifications
const jetFleet = [
  {
    id: 'g700',
    name: 'Gulfstream G700',
    type: 'Ultra Long Range',
    image: 'https://images.unsplash.com/photo-1540962351504-03099e0a754b?w=800&q=80',
    passengers: 19,
    range: '14,260 km',
    speed: 'Mach 0.925',
    maxAltitude: '51,000 ft',
    cabinLength: '17.35 m',
    cabinWidth: '2.49 m',
    cabinHeight: '1.91 m',
    baggageCapacity: '5.52 m³',
    features: ['5 living areas', 'Full galley', 'Crew rest', 'Ka-band WiFi', 'Circadian lighting', '100% fresh air', 'Ultra-quiet cabin'],
    amenities: ['Master suite with shower', 'Conference room', 'Entertainment system', 'Satellite phone', 'Private lavatory'],
    pricePerHour: 'USD 15,000',
    description: 'The flagship of private aviation. The G700 offers the tallest, widest, and longest cabin in the industry with revolutionary Symmetry Flight Deck.',
    manufacturer: 'Gulfstream',
    yearIntroduced: 2022
  },
  {
    id: 'global7500',
    name: 'Bombardier Global 7500',
    type: 'Ultra Long Range',
    image: 'https://images.unsplash.com/photo-1474302770737-173ee21bab63?w=800&q=80',
    passengers: 17,
    range: '14,260 km',
    speed: 'Mach 0.925',
    maxAltitude: '51,000 ft',
    cabinLength: '16.59 m',
    cabinWidth: '2.44 m',
    cabinHeight: '1.88 m',
    baggageCapacity: '5.29 m³',
    features: ['4 living spaces', 'Nuage seats', 'Kitchen with oven', 'Pür Air system', 'Soleil lighting', 'Entertainment suite'],
    amenities: ['Permanent bedroom', 'En-suite shower', 'Executive suite', 'Dining for 6', 'Crew quarters'],
    pricePerHour: 'USD 14,500',
    description: 'Industry-leading range and the smoothest ride. The Global 7500 features the patented Nuage seat and revolutionary wing design.',
    manufacturer: 'Bombardier',
    yearIntroduced: 2018
  },
  {
    id: 'falcon8x',
    name: 'Dassault Falcon 8X',
    type: 'Long Range',
    image: 'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=800&q=80',
    passengers: 14,
    range: '11,945 km',
    speed: 'Mach 0.90',
    maxAltitude: '51,000 ft',
    cabinLength: '13.00 m',
    cabinWidth: '2.34 m',
    cabinHeight: '1.88 m',
    baggageCapacity: '3.70 m³',
    features: ['3 engines', 'Steep approach', 'Digital flight controls', 'FalconEye HUD', 'Quiet cabin', 'Fuel efficient'],
    amenities: ['Multiple configurations', 'Crew rest area', 'Full lavatory', 'Galley', 'Entertainment'],
    pricePerHour: 'USD 11,500',
    description: 'French engineering excellence. The tri-jet Falcon 8X can access challenging airports others cannot, with exceptional fuel efficiency.',
    manufacturer: 'Dassault',
    yearIntroduced: 2016
  },
  {
    id: 'challenger650',
    name: 'Bombardier Challenger 650',
    type: 'Super Midsize',
    image: 'https://images.unsplash.com/photo-1559128010-7c1ad6e1b6a5?w=800&q=80',
    passengers: 12,
    range: '7,408 km',
    speed: 'Mach 0.85',
    maxAltitude: '41,000 ft',
    cabinLength: '8.66 m',
    cabinWidth: '2.49 m',
    cabinHeight: '1.85 m',
    baggageCapacity: '2.32 m³',
    features: ['Wide cabin', 'Low operating costs', 'Proven reliability', 'WiFi ready', 'Entertainment system'],
    amenities: ['Club seating', 'Divan', 'Full galley', 'Private lavatory', 'Baggage access'],
    pricePerHour: 'USD 7,500',
    description: 'The benchmark in super midsize. The Challenger 650 combines the widest cabin in its class with legendary reliability.',
    manufacturer: 'Bombardier',
    yearIntroduced: 2015
  }
];

// Popular routes
const popularRoutes = [
  {
    name: 'Colombo to Dubai',
    duration: '4 hr 30 min',
    distance: '3,400 km',
    description: 'Business hub connection',
    price: 'From USD 52,000'
  },
  {
    name: 'Colombo to Singapore',
    duration: '3 hr 45 min',
    distance: '2,900 km',
    description: 'Southeast Asia gateway',
    price: 'From USD 45,000'
  },
  {
    name: 'Colombo to London',
    duration: '10 hr 30 min',
    distance: '8,700 km',
    description: 'Non-stop to Europe',
    price: 'From USD 125,000'
  },
  {
    name: 'Colombo to Maldives',
    duration: '1 hr 15 min',
    distance: '750 km',
    description: 'Island paradise escape',
    price: 'From USD 18,000'
  }
];

// Premium services
const premiumServices = [
  {
    icon: Lock,
    title: 'Private Terminals',
    description: 'Skip commercial terminals with dedicated FBO access worldwide'
  },
  {
    icon: Briefcase,
    title: 'Airborne Office',
    description: 'High-speed WiFi, satellite phone, and conference facilities'
  },
  {
    icon: Wine,
    title: 'Bespoke Catering',
    description: 'Michelin-starred chefs prepare your preferred cuisine'
  },
  {
    icon: Bed,
    title: 'Lie-Flat Comfort',
    description: 'Full beds and private suites for overnight journeys'
  },
  {
    icon: Shield,
    title: 'Security & Privacy',
    description: 'Discreet travel with executive protection available'
  },
  {
    icon: Heart,
    title: 'Medical Evacuation',
    description: 'Air ambulance configuration with medical staff'
  }
];

const PrivateJets = () => {
  const [heroIndex, setHeroIndex] = useState(0);
  const [heroImages, setHeroImages] = useState(defaultHeroImages);
  const [fleet, setFleet] = useState(jetFleet);
  const [routes, setRoutes] = useState(popularRoutes);
  const [selectedJet, setSelectedJet] = useState(jetFleet[0]);
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
    departureDate: '',
    returnDate: '',
    passengers: '4',
    departure: '',
    destination: '',
    jet: '',
    tripType: 'one-way',
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
        const docRef = doc(db, 'luxuryPages', 'private-jets');
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const data = docSnap.data();
          if (data.heroImages?.length) {
            setHeroImages(data.heroImages);
          }
          if (data.fleet?.length) {
            setFleet(data.fleet);
            setSelectedJet(data.fleet[0]);
          }
          if (data.routes?.length) {
            setRoutes(data.routes);
          }
        }

        // Load contact info
        const contact = await luxuryPagesService.getContactInfo();
        setContactInfo(contact);
      } catch (error) {
        console.error('Error loading jet page content:', error);
      }
    };
    loadContent();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const docRef = await addDoc(collection(db, 'jetInquiries'), {
        ...formData,
        createdAt: new Date(),
        status: 'new',
        source: 'private-jets-page',
        notificationSent: false
      });
      
      // Send email notification
      try {
        await fetch('https://us-central1-recharge-travels-73e76.cloudfunctions.net/sendLuxuryInquiryEmail', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            to: 'luxury@rechargetravels.com',
            subject: `✈️ New Private Jet Inquiry - ${formData.name}`,
            inquiryId: docRef.id,
            customerName: formData.name,
            customerEmail: formData.email,
            customerPhone: formData.phone,
            departureDate: formData.departureDate,
            returnDate: formData.returnDate,
            passengers: formData.passengers,
            departure: formData.departure,
            destination: formData.destination,
            jet: formData.jet || 'Any available',
            tripType: formData.tripType,
            specialRequests: formData.requests,
            type: 'private-jet'
          })
        });
      } catch (emailError) {
        console.log('Email notification queued for retry');
      }
      
      toast.success('Your private jet inquiry has been submitted. Our aviation concierge will contact you within 1 hour.', {
        duration: 5000,
        icon: '✈️'
      });
      
      setFormData({
        name: '',
        email: '',
        phone: '',
        departureDate: '',
        returnDate: '',
        passengers: '4',
        departure: '',
        destination: '',
        jet: '',
        tripType: 'one-way',
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
        <title>Private Jet Charter Sri Lanka | Gulfstream, Bombardier | Recharge Travels</title>
        <meta name="description" content="Charter private jets from Sri Lanka. Gulfstream G700, Global 7500, Falcon 8X. Worldwide destinations, FBO access, bespoke catering, 24/7 concierge." />
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
              <div className="inline-flex items-center gap-2 bg-gradient-to-r from-amber-500/20 to-orange-500/20 border border-amber-400/30 px-6 py-2 rounded-full mb-8">
                <Plane className="w-5 h-5 text-amber-400" />
                <span className="text-amber-300 font-semibold tracking-wider text-sm uppercase">Private Aviation</span>
              </div>

              <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold mb-6 leading-tight">
                <span className="text-white">Fly Without</span>
                <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-orange-400 to-red-400">
                  Limits
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
                  className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white px-10 py-7 text-lg rounded-full shadow-2xl shadow-amber-500/25"
                  onClick={() => document.getElementById('booking')?.scrollIntoView({ behavior: 'smooth' })}
                >
                  <Plane className="w-5 h-5 mr-2" />
                  Request Charter
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="border-2 border-white/30 text-white hover:bg-white/10 px-10 py-7 text-lg rounded-full"
                  onClick={() => document.getElementById('fleet')?.scrollIntoView({ behavior: 'smooth' })}
                >
                  View Fleet
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </div>

              <div className="mt-16 flex flex-wrap justify-center gap-12">
                {[
                  { icon: Plane, value: '4', label: 'Aircraft Types' },
                  { icon: Globe, value: '200+', label: 'Destinations' },
                  { icon: Timer, value: '<2 hrs', label: 'Booking Time' },
                  { icon: Shield, value: 'USD 100M', label: 'Coverage' }
                ].map((stat, idx) => (
                  <div key={idx} className="flex items-center gap-3">
                    <stat.icon className="w-6 h-6 text-amber-400" />
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
                  className={`h-2 rounded-full transition-all ${idx === heroIndex ? 'w-8 bg-amber-400' : 'w-2 bg-white/40'}`}
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
              <Badge className="bg-amber-500/20 text-amber-300 border-amber-400/30 mb-4">
                <Crown className="w-4 h-4 mr-2" />
                Our Fleet
              </Badge>
              <h2 className="text-4xl md:text-5xl font-bold mb-4">
                World-Class Aircraft
              </h2>
              <p className="text-xl text-gray-400 max-w-3xl mx-auto">
                Access the finest private jets from leading manufacturers, 
                each maintained to the highest standards with experienced crews.
              </p>
            </div>

            {/* Fleet Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
              {fleet.map((jet) => (
                <motion.div
                  key={jet.id}
                  whileHover={{ y: -8 }}
                  className={`relative rounded-2xl overflow-hidden cursor-pointer transition-all ${
                    selectedJet.id === jet.id
                      ? 'ring-2 ring-amber-400 shadow-xl shadow-amber-500/20'
                      : 'hover:shadow-xl'
                  }`}
                  onClick={() => setSelectedJet(jet)}
                >
                  <div className="aspect-[4/3] relative">
                    <img src={jet.image} alt={jet.name} className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />
                    <Badge className="absolute top-3 left-3 bg-amber-500/80 text-white">{jet.type}</Badge>
                  </div>
                  <div className="absolute bottom-0 left-0 right-0 p-4">
                    <h3 className="text-lg font-bold text-white mb-1">{jet.name}</h3>
                    <div className="flex items-center gap-4 text-sm text-gray-300">
                      <span className="flex items-center gap-1">
                        <Users className="w-4 h-4" />
                        {jet.passengers}
                      </span>
                      <span>{jet.range}</span>
                    </div>
                  </div>
                  {selectedJet.id === jet.id && (
                    <div className="absolute top-3 right-3 w-6 h-6 rounded-full bg-amber-500 flex items-center justify-center">
                      <Check className="w-4 h-4 text-white" />
                    </div>
                  )}
                </motion.div>
              ))}
            </div>

            {/* Selected Jet Details */}
            <motion.div
              key={selectedJet.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 rounded-3xl p-8 border border-white/10"
            >
              <div className="grid lg:grid-cols-2 gap-8">
                <div>
                  <div className="flex items-center gap-3 mb-4">
                    <h3 className="text-3xl font-bold">{selectedJet.name}</h3>
                    <Badge className="bg-amber-500/20 text-amber-300">{selectedJet.manufacturer}</Badge>
                  </div>
                  <p className="text-gray-400 mb-6">{selectedJet.description}</p>
                  
                  {/* Primary Specs */}
                  <div className="grid grid-cols-4 gap-3 mb-6">
                    <div className="bg-white/5 rounded-xl p-3 text-center">
                      <Users className="w-5 h-5 text-amber-400 mx-auto mb-1" />
                      <div className="text-lg font-bold">{selectedJet.passengers}</div>
                      <div className="text-xs text-gray-400">Passengers</div>
                    </div>
                    <div className="bg-white/5 rounded-xl p-3 text-center">
                      <Compass className="w-5 h-5 text-amber-400 mx-auto mb-1" />
                      <div className="text-lg font-bold">{selectedJet.range}</div>
                      <div className="text-xs text-gray-400">Range</div>
                    </div>
                    <div className="bg-white/5 rounded-xl p-3 text-center">
                      <Zap className="w-5 h-5 text-amber-400 mx-auto mb-1" />
                      <div className="text-lg font-bold">{selectedJet.speed}</div>
                      <div className="text-xs text-gray-400">Speed</div>
                    </div>
                    <div className="bg-white/5 rounded-xl p-3 text-center">
                      <Globe className="w-5 h-5 text-amber-400 mx-auto mb-1" />
                      <div className="text-lg font-bold">{selectedJet.maxAltitude}</div>
                      <div className="text-xs text-gray-400">Ceiling</div>
                    </div>
                  </div>

                  {/* Cabin Specifications */}
                  <div className="bg-white/5 rounded-xl p-4 mb-6">
                    <h4 className="text-sm font-semibold text-amber-400 uppercase tracking-wider mb-3">Cabin Dimensions</h4>
                    <div className="grid grid-cols-2 gap-3 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-500">Length</span>
                        <span className="text-white font-medium">{selectedJet.cabinLength}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-500">Width</span>
                        <span className="text-white font-medium">{selectedJet.cabinWidth}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-500">Height</span>
                        <span className="text-white font-medium">{selectedJet.cabinHeight}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-500">Baggage</span>
                        <span className="text-white font-medium">{selectedJet.baggageCapacity}</span>
                      </div>
                    </div>
                  </div>

                  {/* Features */}
                  <div className="flex flex-wrap gap-2 mb-4">
                    {selectedJet.features.map((feature, idx) => (
                      <Badge key={idx} variant="outline" className="text-amber-300 border-amber-400/30">
                        <Check className="w-3 h-3 mr-1" />
                        {feature}
                      </Badge>
                    ))}
                  </div>

                  {/* Amenities */}
                  <div className="text-sm text-gray-400">
                    <span className="font-semibold text-white">Amenities: </span>
                    {selectedJet.amenities.join(' • ')}
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="relative aspect-video rounded-2xl overflow-hidden">
                    <img 
                      src={selectedJet.image} 
                      alt={selectedJet.name}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute bottom-4 left-4 right-4 bg-black/80 backdrop-blur-sm rounded-xl p-4">
                      <div className="flex justify-between items-center">
                        <div>
                          <div className="text-sm text-gray-400">Hourly Rate</div>
                          <div className="text-amber-400 font-bold text-xl">{selectedJet.pricePerHour}</div>
                        </div>
                        <div className="text-right">
                          <div className="text-sm text-gray-400">Since</div>
                          <div className="text-white font-bold text-xl">{selectedJet.yearIntroduced}</div>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <Button
                    className="w-full bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white py-6 rounded-xl"
                    onClick={() => {
                      setFormData({ ...formData, jet: selectedJet.name });
                      document.getElementById('booking')?.scrollIntoView({ behavior: 'smooth' });
                    }}
                  >
                    <Plane className="w-5 h-5 mr-2" />
                    Charter {selectedJet.name}
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </Button>
                  
                  <a
                    href={`https://wa.me/94777721999?text=Hi%20Recharge%20Travels,%20I'm%20interested%20in%20chartering%20the%20${encodeURIComponent(selectedJet.name)}.`}
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

        {/* PREMIUM SERVICES */}
        <section className="py-24 bg-slate-900">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <Badge className="bg-purple-500/20 text-purple-300 border-purple-400/30 mb-4">
                <Sparkles className="w-4 h-4 mr-2" />
                Premium Services
              </Badge>
              <h2 className="text-4xl md:text-5xl font-bold mb-4">
                Beyond First Class
              </h2>
              <p className="text-xl text-gray-400 max-w-3xl mx-auto">
                Every journey includes white-glove service and bespoke amenities
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {premiumServices.map((service, idx) => (
                <Card key={idx} className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 border-white/10 hover:border-amber-400/30 transition-all group">
                  <CardContent className="p-6">
                    <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-amber-500/20 to-orange-500/20 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                      <service.icon className="w-7 h-7 text-amber-400" />
                    </div>
                    <h3 className="text-xl font-bold mb-2">{service.title}</h3>
                    <p className="text-gray-400">{service.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* POPULAR ROUTES */}
        <section className="py-24 bg-gradient-to-b from-slate-900 to-black">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <Badge className="bg-cyan-500/20 text-cyan-300 border-cyan-400/30 mb-4">
                <MapPin className="w-4 h-4 mr-2" />
                Popular Routes
              </Badge>
              <h2 className="text-4xl md:text-5xl font-bold mb-4">
                Fly Anywhere
              </h2>
              <p className="text-xl text-gray-400 max-w-3xl mx-auto">
                From regional hops to intercontinental journeys
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {routes.map((route, idx) => (
                <motion.div
                  key={idx}
                  whileHover={{ y: -4 }}
                  className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 rounded-2xl p-6 border border-white/10 hover:border-amber-400/30 transition-all"
                >
                  <div className="flex items-center gap-2 text-amber-400 mb-3">
                    <Clock className="w-5 h-5" />
                    <span className="font-semibold">{route.duration}</span>
                  </div>
                  <h3 className="text-xl font-bold mb-2">{route.name}</h3>
                  <p className="text-gray-400 text-sm mb-2">{route.description}</p>
                  <p className="text-gray-500 text-sm mb-4">{route.distance}</p>
                  <div className="text-amber-400 font-bold">{route.price}</div>
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
                <Badge className="bg-amber-500/20 text-amber-300 border-amber-400/30 mb-4">
                  <Plane className="w-4 h-4 mr-2" />
                  Charter Request
                </Badge>
                <h2 className="text-4xl md:text-5xl font-bold mb-4">
                  Ready for Takeoff?
                </h2>
                <p className="text-xl text-gray-400">
                  Our aviation concierge will confirm availability within 2 hours
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
                    <label className="block text-sm font-medium text-gray-300 mb-2">Trip Type</label>
                    <select
                      value={formData.tripType}
                      onChange={(e) => setFormData({ ...formData, tripType: e.target.value })}
                      className="w-full bg-white/5 border border-white/20 text-white rounded-md px-3 py-2"
                    >
                      <option value="one-way">One Way</option>
                      <option value="round-trip">Round Trip</option>
                      <option value="multi-leg">Multi-Leg</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Departure Date *</label>
                    <Input
                      required
                      type="date"
                      value={formData.departureDate}
                      onChange={(e) => setFormData({ ...formData, departureDate: e.target.value })}
                      className="bg-white/5 border-white/20 text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Return Date</label>
                    <Input
                      type="date"
                      value={formData.returnDate}
                      onChange={(e) => setFormData({ ...formData, returnDate: e.target.value })}
                      className="bg-white/5 border-white/20 text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Departure City *</label>
                    <Input
                      required
                      placeholder="e.g., Colombo"
                      value={formData.departure}
                      onChange={(e) => setFormData({ ...formData, departure: e.target.value })}
                      className="bg-white/5 border-white/20 text-white placeholder:text-gray-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Destination *</label>
                    <Input
                      required
                      placeholder="e.g., Dubai"
                      value={formData.destination}
                      onChange={(e) => setFormData({ ...formData, destination: e.target.value })}
                      className="bg-white/5 border-white/20 text-white placeholder:text-gray-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Passengers</label>
                    <Input
                      type="number"
                      min="1"
                      max="19"
                      value={formData.passengers}
                      onChange={(e) => setFormData({ ...formData, passengers: e.target.value })}
                      className="bg-white/5 border-white/20 text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Preferred Aircraft</label>
                    <select
                      value={formData.jet}
                      onChange={(e) => setFormData({ ...formData, jet: e.target.value })}
                      className="w-full bg-white/5 border border-white/20 text-white rounded-md px-3 py-2"
                    >
                      <option value="">Any available</option>
                      {fleet.map((j) => (
                        <option key={j.id} value={j.name}>{j.name} - {j.type}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="mb-8">
                  <label className="block text-sm font-medium text-gray-300 mb-2">Special Requirements</label>
                  <Textarea
                    placeholder="Catering preferences, ground transportation, special occasions, etc."
                    rows={4}
                    value={formData.requests}
                    onChange={(e) => setFormData({ ...formData, requests: e.target.value })}
                    className="bg-white/5 border-white/20 text-white placeholder:text-gray-500"
                  />
                </div>

                <Button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white py-6 text-lg rounded-xl"
                >
                  {loading ? 'Submitting...' : 'Request Quote'}
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>

                <p className="text-center text-gray-500 text-sm mt-4">
                  Empty leg availability and multi-city itineraries available. No commitment required.
                </p>
              </form>
            </div>
          </div>
        </section>

        {/* CONTACT BAR */}
        <section className="py-12 bg-gradient-to-r from-amber-600 to-orange-600">
          <div className="container mx-auto px-4">
            <div className="flex flex-col md:flex-row items-center justify-between gap-6">
              <div>
                <h3 className="text-2xl font-bold text-white mb-2">Urgent Charter Request?</h3>
                <p className="text-amber-100">Our aviation desk operates 24/7 for last-minute flights</p>
              </div>
              <div className="flex flex-wrap gap-3">
                <a 
                  href="https://wa.me/94777721999?text=Hi%20Recharge%20Travels,%20I%20need%20an%20urgent%20private%20jet%20charter."
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 bg-[#25D366] text-white px-6 py-3 rounded-full font-semibold hover:bg-[#128C7E] transition-all"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/></svg>
                  WhatsApp
                </a>
                <a href="tel:+94777721999" className="flex items-center gap-2 bg-white text-amber-600 px-6 py-3 rounded-full font-semibold hover:bg-amber-50 transition-all">
                  <Phone className="w-5 h-5" />
                  +94 777 721 999
                </a>
                <a href="mailto:luxury@rechargetravels.com?subject=Private%20Jet%20Charter%20Inquiry" className="flex items-center gap-2 bg-white/20 text-white px-6 py-3 rounded-full font-semibold hover:bg-white/30 transition-all">
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

export default PrivateJets;
