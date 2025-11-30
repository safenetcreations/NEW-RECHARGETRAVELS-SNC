import React, { useState, useEffect, Suspense } from 'react';
import { Helmet } from 'react-helmet-async';
import { useNavigate } from 'react-router-dom';
import { collection, doc, getDoc, getDocs, query, where, orderBy, limit } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useQuery } from '@tanstack/react-query';
import { motion, AnimatePresence } from 'framer-motion';
import { MapContainer, TileLayer, Polyline, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import {
  Leaf, Clock, MapPin, ChevronRight, Play, Phone, Mail,
  Send, Camera, Coffee, Mountain, Users, Calendar, DollarSign,
  Star, Award, CheckCircle, Heart, Shield, Zap
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';

// Optimized image URL generator
const getOptimizedImageUrl = (url: string, width: number = 1200): string => {
  if (!url) return '';
  if (url.includes('unsplash.com')) {
    const baseUrl = url.split('?')[0];
    return `${baseUrl}?w=${width}&q=80&auto=format&fit=crop`;
  }
  return url;
};

// Enhanced Types with full admin control
interface TeaTrailsData {
  id: string;
  slug: string;
  name: string;
  heroImageURL: string;
  seo: {
    title: string;
    description: string;
    keywords?: string;
  };
  introParagraph: string;
  highlights: Array<{
    icon: string;
    title: string;
    blurb60: string;
  }>;
  routes: Array<{
    routeName: string;
    duration: string;
    distanceKm: number;
    bestClass: string;
    mapGPXUrl?: string;
    difficulty?: string;
    elevation?: string;
  }>;
  galleryImages: Array<{
    url: string;
    alt: string;
    caption?: string;
  }>;
  faqTag: string;
  faqs?: Array<{
    question: string;
    answer: string;
  }>;
  ctaHeadline: string;
  ctaSub: string;
  videoURL?: string;
  isPublished: boolean;
  createdAt: Date;
  updatedAt: Date;
}

interface Tour {
  id: string;
  title: string;
  thumbnail: string;
  badges: string[];
  duration: string;
  salePriceUSD: number;
  regularPriceUSD?: number;
  highlights: string[];
  maxGroupSize?: number;
  includes?: string[];
  excludes?: string[];
  itinerary?: Array<{
    day: number;
    title: string;
    description: string;
  }>;
  isPublished: boolean;
}

// Custom marker icon
const customIcon = L.divIcon({
  className: 'custom-div-icon',
  html: `<div style="background-color: #10b981; color: white; padding: 8px; border-radius: 50%; display: flex; align-items: center; justify-content: center;">
    <svg width="20" height="20" viewBox="0 0 24 24" fill="white">
      <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z"/>
    </svg>
  </div>`,
  iconSize: [32, 32],
  iconAnchor: [16, 32],
  popupAnchor: [0, -32]
});

// Enhanced default data with full admin control capabilities
const defaultTeaTrailsData: TeaTrailsData = {
  id: 'tea-trails',
  slug: "tea-trails",
  name: "Sri Lanka Tea Trails",
  heroImageURL: "https://images.unsplash.com/photo-1606820854416-439b3305ff39?q=80&w=3840&h=2160&auto=format&fit=crop",
  seo: {
    title: "Sri Lanka Tea Trails | Ceylon Tea Estates & Scenic Walks – Recharge Travels",
    description: "Walk emerald‑green plantations, visit 19th‑century tea factories and sip world‑famous Ceylon tea in misty hill country. Plan your perfect Tea‑Trails journey with Recharge Travels.",
    keywords: "Sri Lanka tea trails, Ceylon tea, tea plantations, Nuwara Eliya, tea tasting, tea factory tour"
  },
  introParagraph: "Wake to the aroma of fresh Ceylon tea, hike through velvety carpets of emerald leaves and learn 150 years of plantation lore from local pickers. Sri Lanka's Tea Trails weave between lofty peaks, tumbling waterfalls and colonial bungalows that once housed British planters. This experience pairs gentle adventure with liquid gold in your cup, revealing how a tiny leaf shaped the island's history—and still fuels its high‑country culture today.",
  highlights: [
    { icon: "🌿", title: "Estate Walks", blurb60: "Stroll with an expert guide among century‑old bushes and learn how altitude shapes aroma." },
    { icon: "🫖", title: "Factory & Tasting", blurb60: "Tour a working 19th‑century factory, see withering & rolling, then taste white, green and classic BOP." },
    { icon: "👒", title: "Pluck‑Like‑a‑Pro", blurb60: "Try your hand at two‑leaf‑and‑a‑bud picking alongside smiling estate workers." },
    { icon: "🌄", title: "Lipton's Seat Hike", blurb60: "Sunrise trek to Sir Thomas Lipton's lookout for panoramas across five provinces." }
  ],
  routes: [
    {
      routeName: "Kandy → Hatton Heritage Line",
      duration: "1 day / 105 km",
      distanceKm: 105,
      bestClass: "Observation coach",
      difficulty: "Easy",
      elevation: "500-1500m"
    },
    {
      routeName: "Nuwara Eliya Tea Loop",
      duration: "½ day / 30 km scenic drive",
      distanceKm: 30,
      bestClass: "Private van",
      difficulty: "Easy",
      elevation: "1800-2000m"
    },
    {
      routeName: "Haputale → Lipton's Seat Trail",
      duration: "4 hr hike / 7 km",
      distanceKm: 7,
      bestClass: "On foot",
      difficulty: "Moderate",
      elevation: "1400-1800m"
    }
  ],
  galleryImages: [
    { url: "https://images.unsplash.com/photo-1596018589855-e9c3e317c4dc?w=1200&h=800&auto=format&fit=crop", alt: "Woman in vibrant sari plucking Ceylon tea leaves at sunrise", caption: "Traditional tea plucking at dawn" },
    { url: "https://images.unsplash.com/photo-1605451730973-b0e21c0b5b0a?w=1200&h=800&auto=format&fit=crop", alt: "Old British tea factory with cast‑iron machinery in Sri Lanka", caption: "Historic tea processing machinery" },
    { url: "https://images.unsplash.com/photo-1582735689369-4fe89db7114c?w=1200&h=800&auto=format&fit=crop", alt: "Aerial view of terraced plantations and misty mountains near Haputale", caption: "Breathtaking aerial view of tea terraces" },
    { url: "https://images.unsplash.com/photo-1563911892727-df9c92c2d5d2?w=1200&h=800&auto=format&fit=crop", alt: "Ceylon tea tasting session with traditional cups", caption: "Authentic tea tasting experience" },
    { url: "https://images.unsplash.com/photo-1606821306103-85ca0e88bdd8?w=1200&h=800&auto=format&fit=crop", alt: "Misty morning over tea estate hills", caption: "Misty mornings in the tea country" },
    { url: "https://images.unsplash.com/photo-1576092768241-dec231879fc3?w=1200&h=800&auto=format&fit=crop", alt: "Tea pickers working in the plantations", caption: "Dedicated tea plantation workers" }
  ],
  faqTag: "tea-trails",
  faqs: [
    {
      question: "What is the best time to visit tea plantations?",
      answer: "The best time is from December to May when the weather is dry and clear. However, tea plantations can be visited year-round. The misty atmosphere during the monsoon season (June-September) also offers a unique charm."
    },
    {
      question: "Can I participate in tea plucking?",
      answer: "Yes! Many estates offer tea plucking experiences where you can dress like a tea plucker and learn the traditional 'two leaves and a bud' technique. It's usually available in the morning when actual plucking happens."
    },
    {
      question: "What should I wear when visiting tea estates?",
      answer: "Wear comfortable walking shoes with good grip as paths can be steep and slippery. Bring layers as temperatures can be cool in the morning and evening. Long pants are recommended to protect against insects and plants."
    },
    {
      question: "How long does a typical tea factory tour take?",
      answer: "A comprehensive factory tour usually takes 1.5 to 2 hours, including the processing demonstration and tea tasting session. Some estates offer shorter 45-minute tours."
    },
    {
      question: "Can I buy tea directly from the estates?",
      answer: "Absolutely! Estate shops offer fresh tea at factory prices. You can buy various grades of tea, from premium whole leaf to everyday blends. Staff can help you choose based on your preferences."
    }
  ],
  ctaHeadline: "Sip the World's Finest Tea Where It's Grown",
  ctaSub: "Let Recharge Travels craft your perfect hill‑country escape—private transport, colonial bungalows and insider tastings included.",
  videoURL: "https://www.youtube.com/embed/dQw4w9WgXcQ",
  isPublished: true,
  createdAt: new Date(),
  updatedAt: new Date()
};

const TeaTrails = () => {
  const navigate = useNavigate();
  const [contactForm, setContactForm] = useState({
    name: '',
    email: '',
    phone: '',
    message: ''
  });

  // Fetch experience data from Firestore
  const { data: experienceData, isLoading: isLoadingExperience } = useQuery({
    queryKey: ['experience', 'tea-trails'],
    queryFn: async () => {
      try {
        const docRef = doc(db, 'experiences', 'tea-trails');
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          return docSnap.data() as TeaTrailsData;
        }
        return defaultTeaTrailsData;
      } catch (error) {
        console.error('Error fetching experience data:', error);
        return defaultTeaTrailsData;
      }
    }
  });

  // Fetch live tours
  const { data: tours, isLoading: isLoadingTours } = useQuery({
    queryKey: ['tours', 'tea-trails'],
    queryFn: async () => {
      try {
        const toursRef = collection(db, 'tours');
        const q = query(
          toursRef,
          where('experienceSlug', '==', 'tea-trails'),
          where('isPublished', '==', true),
          orderBy('salePriceUSD', 'asc'),
          limit(6)
        );
        const querySnapshot = await getDocs(q);
        return querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as Tour[];
      } catch (error) {
        console.error('Error fetching tours:', error);
        // Return mock data for now
        return [
          {
            id: '1',
            title: 'Ultimate Tea Trail Experience',
            thumbnail: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&auto=format&fit=crop',
            badges: ['Bestseller', 'Small Group'],
            duration: '3 Days',
            salePriceUSD: 299,
            regularPriceUSD: 399,
            highlights: ['3 Tea Estates', 'Factory Tours', 'Tea Plucking', 'Colonial Stays']
          },
          {
            id: '2',
            title: 'Nuwara Eliya Tea Discovery',
            thumbnail: 'https://images.unsplash.com/photo-1589456506629-b2ea1a8576fb?w=400&h=300&auto=format&fit=crop',
            badges: ['Popular'],
            duration: '2 Days',
            salePriceUSD: 189,
            highlights: ['Pedro Estate', 'High Tea', 'City Tour', 'Lake Views']
          },
          {
            id: '3',
            title: "Lipton's Seat Adventure",
            thumbnail: 'https://images.unsplash.com/photo-1606820854416-439b3305ff39?w=400&h=300&auto=format&fit=crop',
            badges: ['Adventure'],
            duration: '1 Day',
            salePriceUSD: 89,
            highlights: ['Sunrise Trek', 'Dambatenne Factory', 'Tea Tasting', 'Scenic Drive']
          }
        ];
      }
    }
  });

  const data = experienceData || defaultTeaTrailsData;

  const faqs = (data.faqs && data.faqs.length > 0
    ? data.faqs
    : defaultTeaTrailsData.faqs) || [];

  const baseUrl = typeof window !== 'undefined'
    ? window.location.origin
    : 'https://www.rechargetravels.com';

  // Handle contact form submission
  const handleContactSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // In production, this would save to Firestore
    toast.success('Thank you! We\'ll contact you within 24 hours.');
    setContactForm({ name: '', email: '', phone: '', message: '' });
  };

  // Handle tour booking - Navigate to full-page booking
  const handleBookTour = (tour: Tour) => {
    const params = new URLSearchParams({
      package: tour.title,
      price: tour.salePriceUSD.toString(),
      duration: tour.duration,
    });
    navigate(`/booking/tea-trails?${params.toString()}`);
  };

  // Handle general booking - Navigate to full-page booking
  const handleBookNow = (title?: string, price?: number, duration?: string) => {
    const params = new URLSearchParams({
      package: title || 'Ceylon Tea Trail Experience',
      price: (price || 299).toString(),
      duration: duration || '3 Days',
    });
    navigate(`/booking/tea-trails?${params.toString()}`);
  };

  // JSON-LD structured data
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "TouristAttraction",
    "name": data.name,
    "description": data.seo.description,
    "image": data.heroImageURL,
    "address": {
      "@type": "PostalAddress",
      "addressCountry": "LK",
      "addressRegion": "Central Province"
    },
    "geo": {
      "@type": "GeoCoordinates",
      "latitude": 6.9497,
      "longitude": 80.7891
    },
    "offers": tours?.map(tour => ({
      "@type": "Offer",
      "name": tour.title,
      "price": tour.salePriceUSD,
      "priceCurrency": "USD",
      "availability": "https://schema.org/InStock"
    }))
  };

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "Home",
        "item": baseUrl
      },
      {
        "@type": "ListItem",
        "position": 2,
        "name": "Experiences",
        "item": `${baseUrl}/experiences`
      },
      {
        "@type": "ListItem",
        "position": 3,
        "name": "Tea Trails",
        "item": `${baseUrl}/experiences/tea-trails`
      }
    ]
  };

  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": faqs.map(faq => ({
      "@type": "Question",
      "name": faq.question,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": faq.answer
      }
    }))
  };

  if (isLoadingExperience) {
    return (
      <>
        <Header />
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <Leaf className="w-12 h-12 text-green-600 animate-pulse mx-auto mb-4" />
            <p>Loading tea trails experience...</p>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Helmet>
        <title>{data.seo.title}</title>
        <meta name="description" content={data.seo.description} />
        <meta property="og:title" content={data.name} />
        <meta property="og:description" content={data.seo.description} />
        <meta property="og:image" content={data.heroImageURL} />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={`${baseUrl}/experiences/tea-trails`} />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={data.name} />
        <meta name="twitter:description" content={data.seo.description} />
        <meta name="twitter:image" content={data.heroImageURL} />
        <link rel="canonical" href={`${baseUrl}/experiences/tea-trails`} />
        <script type="application/ld+json">{JSON.stringify(jsonLd)}</script>
        <script type="application/ld+json">{JSON.stringify(breadcrumbJsonLd)}</script>
        <script type="application/ld+json">{JSON.stringify(faqJsonLd)}</script>
      </Helmet>

      <Header />

      {/* Hero Section */}
      <section data-block="hero" className="relative h-[60vh] min-h-[500px] flex items-center justify-center overflow-hidden">
        <picture>
          <source 
            media="(max-width: 768px)" 
            srcSet={`${data.heroImageURL}?w=768&h=500&auto=format&fit=crop`}
          />
          <source 
            media="(max-width: 1200px)" 
            srcSet={`${data.heroImageURL}?w=1200&h=600&auto=format&fit=crop`}
          />
          <img
            src={`${data.heroImageURL}?w=3840&h=2160&auto=format&fit=crop`}
            alt={data.name}
            className="absolute inset-0 w-full h-full object-cover"
            loading="eager"
          />
        </picture>
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/30 to-black/60" />
        
        <div className="relative z-10 text-center text-white px-4 max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <Badge className="mb-4 bg-green-600/90 text-white text-sm px-4 py-1">
              <Leaf className="w-4 h-4 mr-2" />
              Ceylon Tea Heritage
            </Badge>
            
            <h1 className="text-5xl md:text-7xl font-bold mb-6 tracking-tight drop-shadow-lg">
              {data.name}
            </h1>
            
            <p className="text-xl md:text-2xl mb-8 text-gray-100 drop-shadow">
              From misty plantations to your perfect cup
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                size="lg" 
                className="bg-green-600 hover:bg-green-700 text-white shadow-xl hover:shadow-2xl transition-all duration-200"
                onClick={() => handleBookNow()}
              >
                <Calendar className="w-5 h-5 mr-2" />
                Book Tea Trail Tour
              </Button>
              <Button 
                size="lg" 
                variant="outline" 
                className="bg-white/10 backdrop-blur-sm text-white border-white/30 hover:bg-white/20"
                onClick={() => document.getElementById('live-tours')?.scrollIntoView({ behavior: 'smooth' })}
              >
                View Packages
                <ChevronRight className="w-5 h-5 ml-2" />
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Intro Section */}
      <section data-block="intro" className="py-12 px-4 bg-white">
        <div className="max-w-3xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="prose prose-lg mx-auto"
          >
            <p className="text-gray-800 leading-relaxed">
              {data.introParagraph}
            </p>
          </motion.div>
        </div>
      </section>

      {/* Highlights Section */}
      <section data-block="highlights" className="py-16 px-4 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-12 text-gray-800">Experience Highlights</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {data.highlights.map((highlight, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="h-full hover:shadow-xl transition-all duration-200 rounded-2xl">
                  <CardContent className="p-6 text-center">
                    <div className="text-4xl mb-4">{highlight.icon}</div>
                    <h3 className="text-xl font-semibold mb-2 text-gray-800">{highlight.title}</h3>
                    <p className="text-gray-600">{highlight.blurb60}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Routes Section */}
      <section data-block="routes" className="py-16 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-12 text-gray-800">Tea Trail Routes</h2>
          <div className="space-y-8">
            {data.routes.map((route, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: index % 2 === 0 ? -20 : 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="overflow-hidden hover:shadow-xl transition-all duration-200 rounded-2xl bg-white border border-gray-200">
                  <div className="grid grid-cols-1 lg:grid-cols-2">
                    <div className="h-[300px] lg:h-auto">
                      <MapContainer
                        center={[6.9497, 80.7891]}
                        zoom={10}
                        scrollWheelZoom={false}
                        className="h-full w-full"
                      >
                        <TileLayer
                          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                          attribution='&copy; OpenStreetMap contributors'
                        />
                        <Marker position={[6.9497, 80.7891]} icon={customIcon}>
                          <Popup>{route.routeName}</Popup>
                        </Marker>
                      </MapContainer>
                    </div>
                    <CardContent className="p-8 bg-white text-gray-800">
                      <h3 className="text-2xl md:text-3xl font-extrabold mb-4 text-green-700">
                        {route.routeName}
                      </h3>
                      <div className="space-y-3 mb-6 text-base md:text-lg">
                        <div className="flex items-center gap-3">
                          <Clock className="w-5 h-5 text-green-600" />
                          <span className="text-gray-800">{route.duration}</span>
                        </div>
                        <div className="flex items-center gap-3">
                          <MapPin className="w-5 h-5 text-green-600" />
                          <span className="text-gray-800">{route.distanceKm} km</span>
                        </div>
                        <div className="flex items-center gap-3">
                          <Users className="w-5 h-5 text-green-600" />
                          <span className="text-gray-800">Best class: {route.bestClass}</span>
                        </div>
                        {route.difficulty && (
                          <div className="flex items-center gap-3">
                            <Zap className="w-5 h-5 text-green-600" />
                            <span className="text-gray-800">Difficulty: {route.difficulty}</span>
                          </div>
                        )}
                        {route.elevation && (
                          <div className="flex items-center gap-3">
                            <Mountain className="w-5 h-5 text-green-600" />
                            <span className="text-gray-800">Elevation: {route.elevation}</span>
                          </div>
                        )}
                      </div>
                      <Button className="bg-green-600 hover:bg-green-700" onClick={() => handleBookNow()}>
                        Book This Route
                      </Button>
                    </CardContent>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Gallery Section */}
      <section data-block="gallery" className="py-16 px-4 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-12 text-gray-800">Tea Trail Gallery</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {data.galleryImages.map((image, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.05 }}
                className="relative overflow-hidden rounded-2xl group cursor-pointer"
              >
                <picture>
                  <source 
                    media="(max-width: 768px)" 
                    srcSet={`${image.url}?w=400&h=300&auto=format&fit=crop`}
                  />
                  <img
                    src={`${image.url}?w=800&h=600&auto=format&fit=crop`}
                    alt={image.alt}
                    className="w-full h-64 md:h-80 object-cover group-hover:scale-110 transition-transform duration-500"
                    loading="lazy"
                  />
                </picture>
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <p className="absolute bottom-4 left-4 right-4 text-white text-sm">{image.caption || image.alt}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Live Tours Section */}
      <section data-block="live-tours" id="live-tours" className="py-16 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-12 text-gray-800">Available Tea Trail Tours</h2>
          {isLoadingTours ? (
            <div className="text-center">
              <Coffee className="w-12 h-12 text-green-600 animate-pulse mx-auto mb-4" />
              <p>Loading tours...</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {tours?.map((tour, index) => (
                <motion.div
                  key={tour.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card className="h-full hover:shadow-xl transition-all duration-200 rounded-2xl overflow-hidden">
                    <div className="relative h-48">
                      <img
                        src={tour.thumbnail}
                        alt={tour.title}
                        className="w-full h-full object-cover"
                        loading="lazy"
                      />
                      <div className="absolute top-4 left-4 flex gap-2">
                        {tour.badges.map((badge, idx) => (
                          <Badge key={idx} className="bg-orange-500 text-white">
                            {badge}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    <CardContent className="p-6">
                      <h3 className="text-xl font-semibold mb-2 text-gray-800">{tour.title}</h3>
                      <div className="flex items-center gap-2 mb-4">
                        <Clock className="w-4 h-4 text-gray-500" />
                        <span className="text-sm text-gray-600">{tour.duration}</span>
                      </div>
                      <ul className="space-y-1 mb-4">
                        {tour.highlights.slice(0, 3).map((highlight, idx) => (
                          <li key={idx} className="text-sm text-gray-600 flex items-start gap-2">
                            <ChevronRight className="w-4 h-4 text-green-500 mt-0.5" />
                            <span>{highlight}</span>
                          </li>
                        ))}
                      </ul>
                      <div className="flex items-center justify-between">
                        <div>
                          {tour.regularPriceUSD && (
                            <span className="text-sm text-gray-500 line-through mr-2">
                              US${tour.regularPriceUSD}
                            </span>
                          )}
                          <span className="text-2xl font-bold text-green-600">
                            From US${tour.salePriceUSD}
                          </span>
                        </div>
                        <Button 
                          size="sm" 
                          className="bg-green-600 hover:bg-green-700"
                          onClick={() => handleBookTour(tour)}
                        >
                          Book Now
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Video Section */}
      {data.videoURL && (
        <section data-block="video" className="py-16 px-4 bg-gray-50">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-4xl font-bold text-center mb-12 text-gray-800">Experience Tea Trails</h2>
            <div className="relative pb-[56.25%] h-0 overflow-hidden rounded-2xl shadow-xl">
              <iframe
                src={data.videoURL}
                title="Tea Trails Video"
                className="absolute top-0 left-0 w-full h-full"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
          </div>
        </section>
      )}

      {/* FAQs Section */}
      <section data-block="faqs" className="py-16 px-4 bg-white">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-12 text-gray-800">Frequently Asked Questions</h2>
          <Accordion type="single" collapsible className="space-y-4">
            {faqs.map((faq, index) => (
              <AccordionItem key={index} value={`item-${index}`} className="border rounded-2xl px-6">
                <AccordionTrigger className="text-left text-gray-800 font-semibold hover:text-green-600">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-gray-700 pt-2 pb-4">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </section>

      {/* CTA Section */}
      <section data-block="cta" className="relative py-20 px-4 overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center bg-fixed"
          style={{
            backgroundImage: `url(${data.heroImageURL})`,
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-green-900/90 to-green-700/90" />
        <div className="relative z-10 max-w-4xl mx-auto text-center text-white">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              {data.ctaHeadline}
            </h2>
            <p className="text-xl mb-8 text-white/90">
              {data.ctaSub}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                size="lg"
                className="bg-white text-green-700 hover:bg-gray-100 shadow-xl hover:shadow-2xl transition-all duration-200"
                onClick={() => handleBookNow()}
              >
                <Leaf className="w-5 h-5 mr-2" />
                Start Your Tea Journey
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-white text-white hover:bg-white/10"
                onClick={() => window.location.href = 'tel:+94777721999'}
              >
                <Phone className="w-5 h-5 mr-2" />
                Call +94 777 721 999
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Contact Form Section */}
      <section data-block="form" className="py-16 px-4 bg-gray-50">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-12 text-gray-800">Plan Your Tea Trail Adventure</h2>
          <Card className="shadow-xl rounded-2xl">
            <CardContent className="p-8">
              <form onSubmit={handleContactSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Your Name
                    </label>
                    <Input
                      type="text"
                      value={contactForm.name}
                      onChange={(e) => setContactForm({ ...contactForm, name: e.target.value })}
                      required
                      className="w-full"
                      placeholder="John Doe"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email Address
                    </label>
                    <Input
                      type="email"
                      value={contactForm.email}
                      onChange={(e) => setContactForm({ ...contactForm, email: e.target.value })}
                      required
                      className="w-full"
                      placeholder="john@example.com"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Phone Number
                  </label>
                  <Input
                    type="tel"
                    value={contactForm.phone}
                    onChange={(e) => setContactForm({ ...contactForm, phone: e.target.value })}
                    required
                    className="w-full"
                    placeholder="+1 234 567 8900"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Message (Optional)
                  </label>
                  <Textarea
                    value={contactForm.message}
                    onChange={(e) => setContactForm({ ...contactForm, message: e.target.value })}
                    rows={4}
                    className="w-full"
                    placeholder="Tell us about your dream tea trail experience..."
                  />
                </div>
                <Button 
                  type="submit" 
                  size="lg" 
                  className="w-full bg-green-600 hover:bg-green-700"
                >
                  <Send className="w-5 h-5 mr-2" />
                  Send Inquiry
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </section>

      <Footer />
    </>
  );
};

export default TeaTrails;