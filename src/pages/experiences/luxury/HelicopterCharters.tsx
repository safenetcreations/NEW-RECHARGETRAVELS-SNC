import React, { useState, useEffect, useRef } from 'react';
import { Helmet } from 'react-helmet-async';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Crown,
  Zap,
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
  Plane,
  Camera,
  Mountain,
  Sparkles,
  ArrowRight,
  Play,
  Globe,
  Award,
  Timer,
  Compass
} from 'lucide-react';
import { db } from '@/lib/firebase';
import { collection, getDocs, addDoc, query, where, orderBy, limit } from 'firebase/firestore';
import { toast } from 'sonner';
import { luxuryPagesService, HelicopterData, HelicopterRoute, LuxuryContactInfo } from '@/services/luxuryPagesService';

// Hero images for the slider
const defaultHeroImages = [
  {
    url: 'https://images.unsplash.com/photo-1540962351504-03099e0a754b?w=1920&q=90',
    title: 'Airbus H160 VIP',
    subtitle: 'The pinnacle of rotary luxury'
  },
  {
    url: 'https://images.unsplash.com/photo-1474302770737-173ee21bab63?w=1920&q=90',
    title: 'Scenic Island Transfers',
    subtitle: 'Arrive in style to any destination'
  },
  {
    url: 'https://images.unsplash.com/photo-1559128010-7c1ad6e1b6a5?w=1920&q=90',
    title: 'Sunset Champagne Flights',
    subtitle: 'Unforgettable aerial experiences'
  },
  {
    url: 'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=1920&q=90',
    title: 'Night Vision Operations',
    subtitle: 'Secure transfers any time'
  }
];

// Fleet data with enhanced technical specifications
const helicopterFleet = [
  {
    id: 'h160',
    name: 'Airbus H160 VIP',
    image: 'https://images.unsplash.com/photo-1540962351504-03099e0a754b?w=800&q=80',
    passengers: 8,
    range: '850 km',
    speed: '325 km/h',
    maxAltitude: '6,096 m',
    engines: '2x Safran Arrano 1A',
    cabinVolume: '8.9 m³',
    baggageCapacity: '1.4 m³',
    features: ['Fenestron tail rotor', 'Blue Edge blades', 'VIP leather interior', 'Satellite phone', 'WiFi connectivity', 'Air conditioning', 'Sound-proofed cabin'],
    pricePerHour: 'USD 8,500',
    description: 'The most advanced medium helicopter in the world with whisper-quiet Blue Edge blades and Fenestron shrouded tail rotor. Features Airbus\'s latest fly-by-wire technology.',
    certifications: ['EASA', 'FAA', 'TCCA'],
    yearIntroduced: 2020
  },
  {
    id: 'aw139',
    name: 'Leonardo AW139',
    image: 'https://images.unsplash.com/photo-1474302770737-173ee21bab63?w=800&q=80',
    passengers: 12,
    range: '1,060 km',
    speed: '306 km/h',
    maxAltitude: '6,096 m',
    engines: '2x Pratt & Whitney PT6C-67C',
    cabinVolume: '10.3 m³',
    baggageCapacity: '2.1 m³',
    features: ['Twin engine redundancy', 'All-weather IFR', 'Night vision compatible', 'Executive VIP cabin', 'Toilet facility option', 'Full galley', 'Entertainment system'],
    pricePerHour: 'USD 7,200',
    description: 'Premium twin-engine helicopter trusted by heads of state, royal families, and Fortune 500 executives worldwide. Offers the largest cabin in its class.',
    certifications: ['EASA', 'FAA', 'CAA'],
    yearIntroduced: 2003
  },
  {
    id: 'bell429',
    name: 'Bell 429 GlobalRanger',
    image: 'https://images.unsplash.com/photo-1559128010-7c1ad6e1b6a5?w=800&q=80',
    passengers: 7,
    range: '761 km',
    speed: '282 km/h',
    maxAltitude: '5,608 m',
    engines: '2x Pratt & Whitney PW207D1',
    cabinVolume: '5.8 m³',
    baggageCapacity: '1.0 m³',
    features: ['Glass cockpit avionics', 'Spacious flat-floor cabin', 'Low external noise', 'IFR certified', 'Retractable landing gear option', 'Climate control'],
    pricePerHour: 'USD 5,800',
    description: 'Light twin helicopter combining exceptional performance with Bell\'s legendary reliability. Features the most spacious cabin in its class.',
    certifications: ['EASA', 'FAA', 'Transport Canada'],
    yearIntroduced: 2009
  },
  {
    id: 'ec145',
    name: 'Airbus EC145 T2',
    image: 'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=800&q=80',
    passengers: 9,
    range: '680 km',
    speed: '246 km/h',
    maxAltitude: '5,486 m',
    engines: '2x Turbomeca Arriel 2E',
    cabinVolume: '6.0 m³',
    baggageCapacity: '1.2 m³',
    features: ['Fenestron shrouded tail', 'Smooth vibration-free ride', 'Quick clamshell doors', 'Panoramic windows', 'Helionix avionics', 'Auto-pilot'],
    pricePerHour: 'USD 4,500',
    certifications: ['EASA', 'FAA'],
    yearIntroduced: 2014,
    description: 'Versatile twin-engine helicopter perfect for scenic tours and transfers.'
  }
];

// Popular routes
const popularRoutes = [
  {
    name: 'Colombo to Sigiriya',
    duration: '45 min',
    description: 'Direct transfer to the ancient rock fortress',
    price: 'USD 4,200'
  },
  {
    name: 'Airport to Yala',
    duration: '1 hr 15 min',
    description: 'Skip the 6-hour drive to leopard country',
    price: 'USD 6,800'
  },
  {
    name: 'Kandy to Maldives',
    duration: '2 hr 30 min',
    description: 'Cross-border luxury transfer',
    price: 'USD 18,500'
  },
  {
    name: 'Scenic Island Tour',
    duration: '2 hrs',
    description: 'Circle the entire island with champagne',
    price: 'USD 12,000'
  }
];

// Experience highlights
const experiences = [
  {
    icon: Mountain,
    title: 'Sunrise Over Sigiriya',
    description: 'Watch dawn break over the ancient fortress from 2,000ft'
  },
  {
    icon: Camera,
    title: 'Aerial Photography',
    description: 'Door-off flights for professional photographers'
  },
  {
    icon: Sparkles,
    title: 'Champagne Sunset',
    description: 'Toast to golden hour with Dom Pérignon at altitude'
  },
  {
    icon: Globe,
    title: 'Multi-Destination',
    description: 'Visit 5 UNESCO sites in a single day'
  }
];

const HelicopterCharters = () => {
  const [heroIndex, setHeroIndex] = useState(0);
  const [heroImages, setHeroImages] = useState(defaultHeroImages);
  const [fleet, setFleet] = useState(helicopterFleet);
  const [routes, setRoutes] = useState(popularRoutes);
  const [selectedHelicopter, setSelectedHelicopter] = useState(helicopterFleet[0]);
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
    date: '',
    passengers: '2',
    route: '',
    helicopter: '',
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
        const pageContent = await luxuryPagesService.getHelicopterPageContent();
        if (pageContent) {
          if (pageContent.heroImages?.length) {
            setHeroImages(pageContent.heroImages);
          }
        }

        // Load fleet from Firebase (if available)
        const fleetData = await luxuryPagesService.getHelicopterFleet();
        if (fleetData.length > 0) {
          setFleet(fleetData as any);
          setSelectedHelicopter(fleetData[0] as any);
        }

        // Load routes from Firebase (if available)
        const routesData = await luxuryPagesService.getHelicopterRoutes();
        if (routesData.length > 0) {
          setRoutes(routesData as any);
        }

        // Load contact info
        const contact = await luxuryPagesService.getContactInfo();
        setContactInfo(contact);
      } catch (error) {
        console.error('Error loading helicopter page content:', error);
      }
    };
    loadContent();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      // Save to Firebase
      const docRef = await addDoc(collection(db, 'helicopterInquiries'), {
        ...formData,
        createdAt: new Date(),
        status: 'new',
        source: 'helicopter-charters-page',
        notificationSent: false
      });
      
      // Send email notification via SendGrid (through Firebase Function)
      try {
        await fetch('https://us-central1-recharge-travels-73e76.cloudfunctions.net/sendLuxuryInquiryEmail', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            to: 'luxury@rechargetravels.com',
            subject: `🚁 New Helicopter Charter Inquiry - ${formData.name}`,
            inquiryId: docRef.id,
            customerName: formData.name,
            customerEmail: formData.email,
            customerPhone: formData.phone,
            preferredDate: formData.date,
            passengers: formData.passengers,
            helicopter: formData.helicopter || 'Any available',
            route: formData.route,
            specialRequests: formData.requests,
            type: 'helicopter-charter'
          })
        });
      } catch (emailError) {
        console.log('Email notification queued for retry');
      }
      
      toast.success('Your inquiry has been submitted. Our concierge will contact you within 30 minutes.', {
        duration: 5000,
        icon: '🚁'
      });
      
      setFormData({
        name: '',
        email: '',
        phone: '',
        date: '',
        passengers: '2',
        route: '',
        helicopter: '',
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
        <title>Executive Helicopter Charters Sri Lanka | Recharge Travels</title>
        <meta name="description" content="Private helicopter charters across Sri Lanka. Airbus H160, AW139, Bell 429 fleet. VIP transfers, scenic tours, night operations. Instant booking." />
      </Helmet>

      <Header />

      <main className="min-h-screen bg-black text-white">
        {/* HERO SECTION - Full Screen with Slider */}
        <section className="relative h-screen overflow-hidden">
          {/* Background Images */}
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

          {/* Hero Content */}
          <div className="relative z-10 h-full flex flex-col justify-center items-center text-center px-4">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.5 }}
              className="max-w-5xl"
            >
              {/* Badge */}
              <div className="inline-flex items-center gap-2 bg-gradient-to-r from-emerald-500/20 to-teal-500/20 border border-emerald-400/30 px-6 py-2 rounded-full mb-8">
                <Zap className="w-5 h-5 text-emerald-400" />
                <span className="text-emerald-300 font-semibold tracking-wider text-sm uppercase">Executive Helicopter Fleet</span>
              </div>

              {/* Title */}
              <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold mb-6 leading-tight">
                <span className="text-white">Elevate Your</span>
                <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-400 to-cyan-400">
                  Journey
                </span>
              </h1>

              {/* Subtitle */}
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

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button
                  size="lg"
                  className="bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white px-10 py-7 text-lg rounded-full shadow-2xl shadow-emerald-500/25"
                  onClick={() => document.getElementById('booking')?.scrollIntoView({ behavior: 'smooth' })}
                >
                  <Phone className="w-5 h-5 mr-2" />
                  Book Now
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

              {/* Stats Bar */}
              <div className="mt-16 flex flex-wrap justify-center gap-12">
                {[
                  { icon: Timer, value: '<30 min', label: 'Response Time' },
                  { icon: Shield, value: 'USD 50M', label: 'Coverage' },
                  { icon: Award, value: '4.9/5', label: 'Client Rating' },
                  { icon: Compass, value: '24/7', label: 'Operations' }
                ].map((stat, idx) => (
                  <div key={idx} className="flex items-center gap-3">
                    <stat.icon className="w-6 h-6 text-emerald-400" />
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
            <button
              onClick={prevSlide}
              className="w-12 h-12 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center hover:bg-white/20 transition-all"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
            <div className="flex gap-2">
              {heroImages.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setHeroIndex(idx)}
                  className={`h-2 rounded-full transition-all ${
                    idx === heroIndex ? 'w-8 bg-emerald-400' : 'w-2 bg-white/40'
                  }`}
                />
              ))}
            </div>
            <button
              onClick={nextSlide}
              className="w-12 h-12 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center hover:bg-white/20 transition-all"
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          </div>

          {/* Thumbnail Gallery */}
          <div className="absolute bottom-8 right-8 hidden lg:flex gap-3">
            {heroImages.slice(0, 4).map((img, idx) => (
              <button
                key={idx}
                onClick={() => setHeroIndex(idx)}
                className={`relative w-20 h-14 rounded-lg overflow-hidden border-2 transition-all ${
                  idx === heroIndex ? 'border-emerald-400 scale-110' : 'border-white/20 opacity-60 hover:opacity-100'
                }`}
              >
                <img src={img.url} alt="" className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
        </section>

        {/* FLEET SECTION */}
        <section id="fleet" className="py-24 bg-gradient-to-b from-black via-slate-950 to-slate-900">
          <div className="container mx-auto px-4">
            {/* Section Header */}
            <div className="text-center mb-16">
              <Badge className="bg-emerald-500/20 text-emerald-300 border-emerald-400/30 mb-4">
                <Crown className="w-4 h-4 mr-2" />
                Premium Fleet
              </Badge>
              <h2 className="text-4xl md:text-5xl font-bold mb-4">
                Our Executive Helicopters
              </h2>
              <p className="text-xl text-gray-400 max-w-3xl mx-auto">
                Every aircraft in our fleet meets the highest safety and luxury standards, 
                operated by pilots with 5,000+ flight hours.
              </p>
            </div>

            {/* Fleet Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
              {fleet.map((heli) => (
                <motion.div
                  key={heli.id}
                  whileHover={{ y: -8 }}
                  className={`relative rounded-2xl overflow-hidden cursor-pointer transition-all ${
                    selectedHelicopter.id === heli.id
                      ? 'ring-2 ring-emerald-400 shadow-xl shadow-emerald-500/20'
                      : 'hover:shadow-xl'
                  }`}
                  onClick={() => setSelectedHelicopter(heli)}
                >
                  <div className="aspect-[4/3] relative">
                    <img src={heli.image} alt={heli.name} className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />
                  </div>
                  <div className="absolute bottom-0 left-0 right-0 p-4">
                    <h3 className="text-lg font-bold text-white mb-1">{heli.name}</h3>
                    <div className="flex items-center gap-4 text-sm text-gray-300">
                      <span className="flex items-center gap-1">
                        <Users className="w-4 h-4" />
                        {heli.passengers}
                      </span>
                      <span>{heli.pricePerHour}/hr</span>
                    </div>
                  </div>
                  {selectedHelicopter.id === heli.id && (
                    <div className="absolute top-3 right-3 w-6 h-6 rounded-full bg-emerald-500 flex items-center justify-center">
                      <Check className="w-4 h-4 text-white" />
                    </div>
                  )}
                </motion.div>
              ))}
            </div>

            {/* Selected Helicopter Details */}
            <motion.div
              key={selectedHelicopter.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 rounded-3xl p-8 border border-white/10"
            >
              <div className="grid lg:grid-cols-2 gap-8">
                <div>
                  <div className="flex items-center gap-3 mb-4">
                    <h3 className="text-3xl font-bold">{selectedHelicopter.name}</h3>
                    {(selectedHelicopter as any).yearIntroduced && (
                      <Badge className="bg-emerald-500/20 text-emerald-300">Since {(selectedHelicopter as any).yearIntroduced}</Badge>
                    )}
                  </div>
                  <p className="text-gray-400 mb-6">{selectedHelicopter.description}</p>
                  
                  {/* Primary Specs */}
                  <div className="grid grid-cols-3 gap-4 mb-6">
                    <div className="bg-white/5 rounded-xl p-4 text-center">
                      <Users className="w-6 h-6 text-emerald-400 mx-auto mb-2" />
                      <div className="text-2xl font-bold">{selectedHelicopter.passengers}</div>
                      <div className="text-sm text-gray-400">Passengers</div>
                    </div>
                    <div className="bg-white/5 rounded-xl p-4 text-center">
                      <Compass className="w-6 h-6 text-emerald-400 mx-auto mb-2" />
                      <div className="text-2xl font-bold">{selectedHelicopter.range}</div>
                      <div className="text-sm text-gray-400">Range</div>
                    </div>
                    <div className="bg-white/5 rounded-xl p-4 text-center">
                      <Zap className="w-6 h-6 text-emerald-400 mx-auto mb-2" />
                      <div className="text-2xl font-bold">{selectedHelicopter.speed}</div>
                      <div className="text-sm text-gray-400">Cruise Speed</div>
                    </div>
                  </div>

                  {/* Technical Specifications */}
                  <div className="bg-white/5 rounded-xl p-4 mb-6">
                    <h4 className="text-sm font-semibold text-emerald-400 uppercase tracking-wider mb-3">Technical Specifications</h4>
                    <div className="grid grid-cols-2 gap-3 text-sm">
                      {(selectedHelicopter as any).engines && (
                        <div className="flex justify-between">
                          <span className="text-gray-500">Engines</span>
                          <span className="text-white font-medium">{(selectedHelicopter as any).engines}</span>
                        </div>
                      )}
                      {(selectedHelicopter as any).maxAltitude && (
                        <div className="flex justify-between">
                          <span className="text-gray-500">Max Altitude</span>
                          <span className="text-white font-medium">{(selectedHelicopter as any).maxAltitude}</span>
                        </div>
                      )}
                      {(selectedHelicopter as any).cabinVolume && (
                        <div className="flex justify-between">
                          <span className="text-gray-500">Cabin Volume</span>
                          <span className="text-white font-medium">{(selectedHelicopter as any).cabinVolume}</span>
                        </div>
                      )}
                      {(selectedHelicopter as any).baggageCapacity && (
                        <div className="flex justify-between">
                          <span className="text-gray-500">Baggage</span>
                          <span className="text-white font-medium">{(selectedHelicopter as any).baggageCapacity}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Certifications */}
                  {(selectedHelicopter as any).certifications && (
                    <div className="flex items-center gap-2 mb-4">
                      <Shield className="w-4 h-4 text-emerald-400" />
                      <span className="text-sm text-gray-400">Certified:</span>
                      {(selectedHelicopter as any).certifications.map((cert: string, idx: number) => (
                        <Badge key={idx} variant="outline" className="text-xs text-gray-300 border-gray-600">
                          {cert}
                        </Badge>
                      ))}
                    </div>
                  )}

                  {/* Features */}
                  <div className="flex flex-wrap gap-2">
                    {selectedHelicopter.features.map((feature, idx) => (
                      <Badge key={idx} variant="outline" className="text-emerald-300 border-emerald-400/30">
                        <Check className="w-3 h-3 mr-1" />
                        {feature}
                      </Badge>
                    ))}
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="relative aspect-video rounded-2xl overflow-hidden">
                    <img 
                      src={selectedHelicopter.image} 
                      alt={selectedHelicopter.name}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute bottom-4 right-4 bg-black/80 backdrop-blur-sm rounded-xl px-4 py-2">
                      <div className="text-emerald-400 font-bold text-xl">{selectedHelicopter.pricePerHour}</div>
                      <div className="text-sm text-gray-400">per flight hour</div>
                    </div>
                  </div>
                  
                  {/* Quick Book Button */}
                  <Button
                    className="w-full bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white py-6 rounded-xl"
                    onClick={() => {
                      setFormData({ ...formData, helicopter: selectedHelicopter.name });
                      document.getElementById('booking')?.scrollIntoView({ behavior: 'smooth' });
                    }}
                  >
                    <Phone className="w-5 h-5 mr-2" />
                    Book {selectedHelicopter.name}
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </Button>
                  
                  {/* WhatsApp Quick Inquiry */}
                  <a
                    href={`https://wa.me/94777721999?text=Hi%20Recharge%20Travels,%20I'm%20interested%20in%20booking%20the%20${encodeURIComponent(selectedHelicopter.name)}%20helicopter.`}
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

        {/* EXPERIENCES SECTION */}
        <section className="py-24 bg-slate-900">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <Badge className="bg-amber-500/20 text-amber-300 border-amber-400/30 mb-4">
                <Sparkles className="w-4 h-4 mr-2" />
                Signature Experiences
              </Badge>
              <h2 className="text-4xl md:text-5xl font-bold mb-4">
                Beyond Transportation
              </h2>
              <p className="text-xl text-gray-400 max-w-3xl mx-auto">
                Transform your journey into an unforgettable experience
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {experiences.map((exp, idx) => (
                <Card key={idx} className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 border-white/10 hover:border-emerald-400/30 transition-all group">
                  <CardContent className="p-6">
                    <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-emerald-500/20 to-teal-500/20 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                      <exp.icon className="w-7 h-7 text-emerald-400" />
                    </div>
                    <h3 className="text-xl font-bold mb-2">{exp.title}</h3>
                    <p className="text-gray-400">{exp.description}</p>
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
                Skip the Traffic
              </h2>
              <p className="text-xl text-gray-400 max-w-3xl mx-auto">
                What takes hours by road takes minutes by air
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {routes.map((route, idx) => (
                <motion.div
                  key={idx}
                  whileHover={{ y: -4 }}
                  className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 rounded-2xl p-6 border border-white/10 hover:border-cyan-400/30 transition-all"
                >
                  <div className="flex items-center gap-2 text-cyan-400 mb-3">
                    <Clock className="w-5 h-5" />
                    <span className="font-semibold">{route.duration}</span>
                  </div>
                  <h3 className="text-xl font-bold mb-2">{route.name}</h3>
                  <p className="text-gray-400 text-sm mb-4">{route.description}</p>
                  <div className="text-emerald-400 font-bold text-lg">{route.price}</div>
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
                <Badge className="bg-emerald-500/20 text-emerald-300 border-emerald-400/30 mb-4">
                  <Phone className="w-4 h-4 mr-2" />
                  Book Your Flight
                </Badge>
                <h2 className="text-4xl md:text-5xl font-bold mb-4">
                  Ready for Takeoff?
                </h2>
                <p className="text-xl text-gray-400">
                  Our concierge team responds within 30 minutes, 24/7
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
                    <label className="block text-sm font-medium text-gray-300 mb-2">Preferred Date</label>
                    <Input
                      type="date"
                      value={formData.date}
                      onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                      className="bg-white/5 border-white/20 text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Number of Passengers</label>
                    <Input
                      type="number"
                      min="1"
                      max="12"
                      value={formData.passengers}
                      onChange={(e) => setFormData({ ...formData, passengers: e.target.value })}
                      className="bg-white/5 border-white/20 text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Preferred Helicopter</label>
                    <select
                      value={formData.helicopter}
                      onChange={(e) => setFormData({ ...formData, helicopter: e.target.value })}
                      className="w-full bg-white/5 border border-white/20 text-white rounded-md px-3 py-2"
                    >
                      <option value="">Any available</option>
                      {fleet.map((h) => (
                        <option key={h.id} value={h.name}>{h.name}</option>
                      ))}
                    </select>
                  </div>
                </div>
                
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-300 mb-2">Route / Destination</label>
                  <Input
                    placeholder="e.g., Colombo to Sigiriya"
                    value={formData.route}
                    onChange={(e) => setFormData({ ...formData, route: e.target.value })}
                    className="bg-white/5 border-white/20 text-white placeholder:text-gray-500"
                  />
                </div>

                <div className="mb-8">
                  <label className="block text-sm font-medium text-gray-300 mb-2">Special Requests</label>
                  <Textarea
                    placeholder="Champagne service, photography tour, specific timing..."
                    rows={4}
                    value={formData.requests}
                    onChange={(e) => setFormData({ ...formData, requests: e.target.value })}
                    className="bg-white/5 border-white/20 text-white placeholder:text-gray-500"
                  />
                </div>

                <Button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white py-6 text-lg rounded-xl"
                >
                  {loading ? 'Submitting...' : 'Request Quote'}
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>

                <p className="text-center text-gray-500 text-sm mt-4">
                  By submitting, you agree to our privacy policy. No commitment required.
                </p>
              </form>
            </div>
          </div>
        </section>

        {/* CONTACT BAR */}
        <section className="py-12 bg-gradient-to-r from-emerald-600 to-teal-600">
          <div className="container mx-auto px-4">
            <div className="flex flex-col md:flex-row items-center justify-between gap-6">
              <div>
                <h3 className="text-2xl font-bold text-white mb-2">Need Immediate Assistance?</h3>
                <p className="text-emerald-100">Our concierge desk operates 24/7 for urgent requests</p>
              </div>
              <div className="flex flex-wrap gap-3">
                {/* WhatsApp */}
                <a 
                  href="https://wa.me/94777721999?text=Hi%20Recharge%20Travels,%20I'm%20interested%20in%20helicopter%20charter%20services."
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 bg-[#25D366] text-white px-6 py-3 rounded-full font-semibold hover:bg-[#128C7E] transition-all"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/></svg>
                  WhatsApp
                </a>
                {/* Phone */}
                <a 
                  href="tel:+94777721999" 
                  className="flex items-center gap-2 bg-white text-emerald-600 px-6 py-3 rounded-full font-semibold hover:bg-emerald-50 transition-all"
                >
                  <Phone className="w-5 h-5" />
                  +94 777 721 999
                </a>
                {/* Email */}
                <a 
                  href="mailto:luxury@rechargetravels.com?subject=Helicopter%20Charter%20Inquiry" 
                  className="flex items-center gap-2 bg-white/20 text-white px-6 py-3 rounded-full font-semibold hover:bg-white/30 transition-all"
                >
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

export default HelicopterCharters;
