import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Waves, 
  Sun, 
  Palmtree, 
  MapPin,
  Calendar,
  Clock,
  Star,
  Fish,
  Utensils,
  Camera,
  Users,
  DollarSign,
  Info,
  Cloud,
  Navigation,
  Sunrise,
  Wind,
  Home,
  Activity,
  Anchor,
  TreePalm,
  Ship,
  Turtle,
  Shell,
  Map,
  ChevronDown,
  Phone,
  Mail,
  CheckCircle,
  ChevronRight,
  Globe,
  Heart,
  Plane,
  Church
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import EnhancedBookingModal from '@/components/EnhancedBookingModal';
import { doc, getDoc, onSnapshot } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { toast } from 'sonner';

interface HeroSlide {
  id: string;
  image: string;
  title: string;
  subtitle: string;
}

interface Attraction {
  id: string;
  name: string;
  description: string;
  image: string;
  category: string;
  rating: number;
  duration: string;
  price: string;
  highlights: string[];
}

interface Activity {
  id: string;
  name: string;
  description: string;
  icon: any;
  price: string;
  duration: string;
  popular?: boolean;
}

interface DestinationInfo {
  population: string;
  area: string;
  elevation: string;
  bestTime: string;
  language: string;
  currency: string;
}

interface FAQ {
  id: string;
  question: string;
  answer: string;
}

interface Itinerary {
  id: string;
  title: string;
  duration: string;
  description: string;
  highlights: string[];
  price: string;
}

interface TravelTip {
  id: string;
  title: string;
  icon: any;
  tips: string[];
}

interface NegomboContent {
  hero: {
    slides: HeroSlide[];
    title: string;
    subtitle: string;
  };
  overview: {
    title: string;
    description: string;
    highlights: string[];
  };
  seo: {
    title: string;
    description: string;
    keywords: string;
  };
  attractions: Attraction[];
  activities: Activity[];
  itineraries: Itinerary[];
  faqs: FAQ[];
  gallery: string[];
  travelTips: TravelTip[];
}

const defaultContent: NegomboContent = {
  hero: {
    slides: [
      {
        id: '1',
        image: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?auto=format&fit=crop&q=80",
        title: "Welcome to Negombo",
        subtitle: "The Beach Gateway to Sri Lanka"
      },
      {
        id: '2',
        image: "https://images.unsplash.com/photo-1586500036706-41963de24d8b?auto=format&fit=crop&q=80",
        title: "Fishing Heritage",
        subtitle: "Experience Traditional Lagoon Life"
      },
      {
        id: '3',
        image: "https://images.unsplash.com/photo-1559592413-7cec4d0cae2b?auto=format&fit=crop&q=80",
        title: "Dutch Canals",
        subtitle: "Navigate Historic Waterways"
      }
    ],
    title: "Negombo",
    subtitle: "Beach Gateway Near Airport with Canals"
  },
  overview: {
    title: "Why Visit Negombo?",
    description: "Negombo, known as 'Little Rome' for its strong Catholic heritage, is a vibrant beach town just minutes from Colombo's international airport. This historic fishing town offers beautiful beaches, Dutch-era canals, colorful fish markets, and colonial architecture. Its proximity to the airport makes it perfect for first or last night stays, while its rich culture and seafood cuisine make it worth a longer visit.",
    highlights: [
      "Just 10km from Colombo International Airport",
      "Long sandy beaches with water sports",
      "Historic Dutch canals and Hamilton Canal",
      "Colorful Negombo Fish Market (Lellama)",
      "Colonial churches and Catholic heritage",
      "Fresh seafood and lagoon prawns",
      "Boat tours through mangroves",
      "Vibrant nightlife and beach restaurants"
    ]
  },
  seo: {
    title: "Negombo Beach Sri Lanka - Airport Hotels & Beach Guide | Recharge Travels",
    description: "Discover Negombo's beaches, Dutch canals, and fish markets just 10km from Colombo Airport. Perfect for transit stays or beach holidays near the airport.",
    keywords: "Negombo beach, hotels near Colombo airport, Negombo fish market, Dutch canals Sri Lanka, Negombo lagoon, airport beach hotels, Negombo travel guide, Little Rome Sri Lanka"
  },
  attractions: [
    {
      id: '1',
      name: "Negombo Beach",
      description: "A long stretch of golden sand beach perfect for swimming, sunbathing, and water sports. The beach comes alive with restaurants and bars in the evening.",
      image: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?auto=format&fit=crop&q=80",
      category: "Beaches",
      rating: 4.5,
      duration: "Half day",
      price: "Free",
      highlights: ["Swimming", "Water Sports", "Beach Dining", "Sunset Views"]
    },
    {
      id: '2',
      name: "Negombo Fish Market",
      description: "One of Sri Lanka's largest fish markets, bustling with activity in the early morning. Watch traditional fishing boats arrive with their catch and experience local life.",
      image: "https://images.unsplash.com/photo-1559303208-40f570b8275a?auto=format&fit=crop&q=80",
      category: "Cultural",
      rating: 4.6,
      duration: "1-2 hours",
      price: "Free",
      highlights: ["Fresh Seafood", "Traditional Boats", "Local Culture", "Photography"]
    },
    {
      id: '3',
      name: "Dutch Canal (Hamilton Canal)",
      description: "Historic canal system built by the Dutch in the 18th century, perfect for boat tours through mangroves and local villages. Spot birds and monitor lizards.",
      image: "https://images.unsplash.com/photo-1586500036706-41963de24d8b?auto=format&fit=crop&q=80",
      category: "Historical",
      rating: 4.4,
      duration: "2-3 hours",
      price: "From $15",
      highlights: ["Boat Tours", "Mangroves", "Bird Watching", "Dutch History"]
    },
    {
      id: '4',
      name: "St. Mary's Church",
      description: "One of the largest cathedrals in Sri Lanka, showcasing beautiful religious art and architecture. The church reflects Negombo's strong Catholic heritage.",
      image: "https://images.unsplash.com/photo-1569163139394-de4798aa3c5d?auto=format&fit=crop&q=80",
      category: "Religious",
      rating: 4.5,
      duration: "1 hour",
      price: "Free",
      highlights: ["Catholic Heritage", "Architecture", "Religious Art", "Peaceful"]
    },
    {
      id: '5',
      name: "Negombo Lagoon",
      description: "Large lagoon famous for its prawns and crabs. Take boat tours to see traditional fishing methods, mangroves, and diverse birdlife including migratory species.",
      image: "https://images.unsplash.com/photo-1559592413-7cec4d0cae2b?auto=format&fit=crop&q=80",
      category: "Natural",
      rating: 4.6,
      duration: "2-3 hours",
      price: "From $20",
      highlights: ["Lagoon Tours", "Prawn Fishing", "Mangroves", "Birdlife"]
    },
    {
      id: '6',
      name: "Angurukaramulla Temple",
      description: "Ancient Buddhist temple featuring a 6-meter Buddha statue, dragon entrance, and colorful murals depicting Buddhist stories and teachings.",
      image: "https://images.unsplash.com/photo-1609920658906-8223bd289001?auto=format&fit=crop&q=80",
      category: "Religious",
      rating: 4.3,
      duration: "1 hour",
      price: "Donation",
      highlights: ["Buddha Statue", "Dragon Entrance", "Ancient Murals", "Local Temple"]
    }
  ],
  activities: [
    {
      id: '1',
      name: "Airport Transfer Service",
      description: "Quick and comfortable transfers to/from Colombo Airport",
      icon: Plane,
      price: "From $15",
      duration: "20 minutes",
      popular: true
    },
    {
      id: '2',
      name: "Lagoon Boat Safari",
      description: "Explore mangroves and spot wildlife on the lagoon",
      icon: Ship,
      price: "From $25",
      duration: "2-3 hours",
      popular: true
    },
    {
      id: '3',
      name: "Deep Sea Fishing",
      description: "Join fishermen for traditional or sport fishing",
      icon: Fish,
      price: "From $50",
      duration: "Half day"
    },
    {
      id: '4',
      name: "Seafood Cooking Class",
      description: "Learn to prepare fresh seafood Sri Lankan style",
      icon: Utensils,
      price: "From $40",
      duration: "3 hours"
    },
    {
      id: '5',
      name: "Water Sports Package",
      description: "Jet skiing, banana boat, and parasailing",
      icon: Activity,
      price: "From $30",
      duration: "Per activity"
    },
    {
      id: '6',
      name: "Church & Temple Tour",
      description: "Explore religious heritage sites",
      icon: Church,
      price: "From $20",
      duration: "3 hours"
    }
  ],
  itineraries: [
    {
      id: '1',
      title: "Negombo Transit Special",
      duration: "1 Day",
      description: "Perfect for travelers with a long layover or arriving late/departing early",
      highlights: [
        "Airport pickup and drop-off included",
        "Quick beach visit and lunch",
        "Negombo Fish Market tour (early morning)",
        "Dutch Canal boat ride",
        "Souvenir shopping opportunity"
      ],
      price: "From $80 per person"
    },
    {
      id: '2',
      title: "Negombo Beach Break",
      duration: "2 Days / 1 Night",
      description: "Relax and explore before or after your international flight",
      highlights: [
        "Day 1: Beach time and water sports",
        "Sunset dinner at beach restaurant",
        "Day 2: Early morning fish market visit",
        "Lagoon boat safari",
        "Church and temple visits",
        "Airport transfer included"
      ],
      price: "From $160 per person"
    },
    {
      id: '3',
      title: "Negombo Cultural Experience",
      duration: "3 Days / 2 Nights",
      description: "Discover the fishing heritage and colonial history of Negombo",
      highlights: [
        "Complete fish market and harbor tour",
        "Dutch canal exploration by boat",
        "Traditional fishing experience",
        "Seafood cooking masterclass",
        "Religious sites tour",
        "Beach activities and relaxation"
      ],
      price: "From $320 per person"
    }
  ],
  faqs: [
    {
      id: '1',
      question: "How close is Negombo to the airport?",
      answer: "Negombo is just 10km (about 20 minutes drive) from Bandaranaike International Airport in Colombo. This makes it the perfect destination for your first or last night in Sri Lanka, or for travelers with long layovers."
    },
    {
      id: '2',
      question: "Is Negombo beach good for swimming?",
      answer: "Yes, Negombo beach is generally safe for swimming, especially in the calm season from November to April. However, always check local conditions as currents can be strong during monsoon season. The northern part of the beach tends to be calmer."
    },
    {
      id: '3',
      question: "What time should I visit the fish market?",
      answer: "The best time to visit Negombo Fish Market is early morning, between 5:00 AM and 8:00 AM, when fishing boats return with their catch. The market is busiest and most colorful at this time. Afternoon visits show the retail side of the market."
    },
    {
      id: '4',
      question: "Can I take a boat tour in the Dutch Canal?",
      answer: "Yes, boat tours through the Dutch Canal (Hamilton Canal) are popular and available daily. Tours typically last 2-3 hours and take you through mangroves, past local villages, and offer opportunities to spot birds, monitor lizards, and water monitors."
    },
    {
      id: '5',
      question: "What seafood specialties should I try in Negombo?",
      answer: "Negombo is famous for its lagoon prawns, crab curry, and fresh fish preparations. Don't miss the Negombo-style fish ambul thiyal (sour fish curry), prawns in coconut milk, and the daily catch grilled with local spices."
    },
    {
      id: '6',
      question: "Is Negombo suitable for families?",
      answer: "Yes, Negombo is very family-friendly with calm beach areas, boat rides suitable for children, and many restaurants catering to families. The proximity to the airport also makes it convenient for families traveling with children."
    }
  ],
  gallery: [
    "https://images.unsplash.com/photo-1578662996442-48f60103fc96?auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1586500036706-41963de24d8b?auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1559303208-40f570b8275a?auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1559592413-7cec4d0cae2b?auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1540202403-b7abd6747a18?auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1552733407-5d5c46c3bb3b?auto=format&fit=crop&q=80"
  ],
  travelTips: [
    {
      id: '1',
      title: "Airport Logistics",
      icon: Plane,
      tips: [
        "Pre-arrange airport transfers for convenience",
        "Allow 30 minutes for airport journey",
        "Many hotels offer free airport shuttles",
        "Taxis and tuk-tuks readily available",
        "Store luggage at hotels for day trips"
      ]
    },
    {
      id: '2',
      title: "Best Time to Visit",
      icon: Calendar,
      tips: [
        "November to April: Dry season, calm seas",
        "May to October: Monsoon, fewer tourists",
        "Year-round destination due to proximity",
        "Early mornings best for fish market",
        "Evenings perfect for beach dining"
      ]
    },
    {
      id: '3',
      title: "Local Transport",
      icon: Navigation,
      tips: [
        "Tuk-tuks abundant and affordable",
        "Negotiate prices before starting journey",
        "Bicycles available for rent",
        "Boats for canal and lagoon tours",
        "Walking distance to most attractions"
      ]
    }
  ]
};

const Negombo = () => {
  const [content, setContent] = useState<NegomboContent>(defaultContent);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [selectedTab, setSelectedTab] = useState('attractions');
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [selectedService, setSelectedService] = useState<string>('');
  const [galleryIndex, setGalleryIndex] = useState(0);

  // Load content from Firebase and set up real-time listener
  useEffect(() => {
    const docRef = doc(db, 'destinations', 'negombo');
    
    // Set up real-time listener
    const unsubscribe = onSnapshot(docRef, (docSnap) => {
      if (docSnap.exists()) {
        const data = docSnap.data() as NegomboContent;
        setContent({
          ...defaultContent,
          ...data
        });
        toast.success('Content updated', { duration: 2000 });
      }
    }, (error) => {
      console.error('Error listening to document:', error);
      toast.error('Failed to sync content updates');
    });

    return () => unsubscribe();
  }, []);

  // Cycle through hero slides
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % content.hero.slides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [content.hero.slides.length]);

  // Auto-cycle gallery
  useEffect(() => {
    const timer = setInterval(() => {
      setGalleryIndex((prev) => (prev + 1) % content.gallery.length);
    }, 4000);
    return () => clearInterval(timer);
  }, [content.gallery.length]);

  const weatherInfo = {
    temperature: "26-32°C",
    season: "Tropical year-round",
    rainfall: "Low (Dec-Apr), High (May-Nov)"
  };

  const destinationInfo: DestinationInfo = {
    population: "142,000",
    area: "31 km²",
    elevation: "Sea level",
    bestTime: "November to April",
    language: "Sinhala, Tamil, English",
    currency: "Sri Lankan Rupee (LKR)"
  };

  const tabs = [
    { id: 'attractions', label: 'Attractions', count: content.attractions.length },
    { id: 'activities', label: 'Activities', count: content.activities.length },
    { id: 'itineraries', label: 'Tours', count: content.itineraries.length },
    { id: 'travel-tips', label: 'Travel Tips', count: content.travelTips.length },
    { id: 'faqs', label: 'FAQs', count: content.faqs.length }
  ];

  const handleBooking = (service: string) => {
    setSelectedService(service);
    setShowBookingModal(true);
  };

  // JSON-LD Structured Data for SEO
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "TouristDestination",
    "name": "Negombo, Sri Lanka",
    "description": content.overview.description,
    "image": content.hero.slides.map(slide => slide.image),
    "touristType": ["Beach Tourism", "Cultural Tourism", "Transit Tourism"],
    "geo": {
      "@type": "GeoCoordinates",
      "latitude": "7.2008",
      "longitude": "79.8737"
    },
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": "4.5",
      "reviewCount": "2156"
    },
    "offers": content.activities.map(activity => ({
      "@type": "Offer",
      "name": activity.name,
      "price": activity.price,
      "priceCurrency": "USD"
    }))
  };

  return (
    <>
      <Helmet>
        <title>{content.seo.title}</title>
        <meta name="description" content={content.seo.description} />
        <meta name="keywords" content={content.seo.keywords} />
        
        {/* Open Graph Tags */}
        <meta property="og:title" content={content.seo.title} />
        <meta property="og:description" content={content.seo.description} />
        <meta property="og:image" content={content.hero.slides[0].image} />
        <meta property="og:url" content="https://rechargetravels.com/destinations/negombo" />
        <meta property="og:type" content="website" />
        
        {/* Twitter Card Tags */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={content.seo.title} />
        <meta name="twitter:description" content={content.seo.description} />
        <meta name="twitter:image" content={content.hero.slides[0].image} />
        
        {/* Canonical URL */}
        <link rel="canonical" href="https://rechargetravels.com/destinations/negombo" />
        
        {/* JSON-LD Structured Data */}
        <script type="application/ld+json">
          {JSON.stringify(structuredData)}
        </script>
      </Helmet>
      
      <Header />
      
      <main className="min-h-screen bg-background">
        {/* Hero Section with Video/Image Slideshow */}
        <section className="relative h-[80vh] overflow-hidden" aria-label="Hero">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentSlide}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1 }}
              className="absolute inset-0"
            >
              <div 
                className="h-full bg-cover bg-center"
                style={{ backgroundImage: `url(${content.hero.slides[currentSlide].image})` }}
              >
                <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/20 to-black/60" />
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Hero Content */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center text-white px-4 max-w-5xl">
              <motion.h1 
                initial={{ y: 30, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="text-5xl md:text-7xl font-bold mb-6"
              >
                {content.hero.slides[currentSlide].title}
              </motion.h1>
              <motion.p 
                initial={{ y: 30, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="text-xl md:text-2xl mb-8"
              >
                {content.hero.slides[currentSlide].subtitle}
              </motion.p>
              <motion.div
                initial={{ y: 30, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.7 }}
                className="flex gap-4 justify-center"
              >
                <Button 
                  size="lg" 
                  className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-6 text-lg"
                  onClick={() => handleBooking('Negombo Tour Package')}
                >
                  Book Now
                </Button>
                <Button 
                  size="lg" 
                  variant="outline"
                  className="bg-white/10 backdrop-blur-sm text-white border-white hover:bg-white/20 px-8 py-6 text-lg"
                  onClick={() => document.getElementById('overview')?.scrollIntoView({ behavior: 'smooth' })}
                >
                  Learn More
                </Button>
              </motion.div>
            </div>
          </div>

          {/* Slide Indicators */}
          <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex space-x-2">
            {content.hero.slides.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentSlide(index)}
                className={`w-3 h-3 rounded-full transition-all ${
                  currentSlide === index ? 'bg-white w-8' : 'bg-white/50'
                }`}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>

          {/* Scroll Indicator */}
          <motion.div 
            animate={{ y: [0, 10, 0] }}
            transition={{ repeat: Infinity, duration: 2 }}
            className="absolute bottom-12 left-1/2 transform -translate-x-1/2"
          >
            <ChevronDown className="w-8 h-8 text-white" />
          </motion.div>
        </section>

        {/* Quick Info Bar */}
        <section className="bg-blue-700 text-white py-4" aria-label="Quick Information">
          <div className="container mx-auto px-4">
            <div className="flex flex-wrap justify-center items-center gap-8 text-sm">
              <div className="flex items-center gap-2">
                <Plane className="w-4 h-4" />
                <span>10km from Airport</span>
              </div>
              <div className="flex items-center gap-2">
                <Sun className="w-4 h-4" />
                <span>Climate: {weatherInfo.temperature}</span>
              </div>
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4" />
                <span>Population: {destinationInfo.population}</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                <span>Best Time: {destinationInfo.bestTime}</span>
              </div>
            </div>
          </div>
        </section>

        {/* Overview Section */}
        <section id="overview" className="py-16 bg-gray-50" aria-label="Overview">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="max-w-4xl mx-auto text-center"
            >
              <h2 className="text-4xl font-bold mb-6">{content.overview.title}</h2>
              <p className="text-lg text-gray-700 mb-8 leading-relaxed">
                {content.overview.description}
              </p>
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 mt-12">
                {content.overview.highlights.map((highlight, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                    viewport={{ once: true }}
                    className="bg-white p-4 rounded-lg shadow-md flex items-center gap-3"
                  >
                    <CheckCircle className="w-5 h-5 text-blue-600 flex-shrink-0" />
                    <span className="text-sm">{highlight}</span>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </section>

        {/* Tabs Navigation */}
        <nav className="sticky top-0 z-40 bg-background border-b" aria-label="Content Navigation">
          <div className="container mx-auto px-4">
            <div className="flex overflow-x-auto scrollbar-hide">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setSelectedTab(tab.id)}
                  className={`px-6 py-4 font-medium transition-all whitespace-nowrap border-b-2 ${
                    selectedTab === tab.id
                      ? 'border-blue-600 text-blue-600'
                      : 'border-transparent text-muted-foreground hover:text-foreground'
                  }`}
                  aria-label={`View ${tab.label}`}
                  aria-current={selectedTab === tab.id ? 'page' : undefined}
                >
                  {tab.label}
                  {tab.count && (
                    <Badge variant="secondary" className="ml-2">
                      {tab.count}
                    </Badge>
                  )}
                </button>
              ))}
            </div>
          </div>
        </nav>

        {/* Content Sections */}
        <div className="container mx-auto px-4 py-12">
          <AnimatePresence mode="wait">
            {/* Attractions Tab */}
            {selectedTab === 'attractions' && (
              <motion.section
                key="attractions"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                aria-label="Top Attractions"
              >
                <h3 className="text-3xl font-bold mb-8 text-center">Top Attractions in Negombo</h3>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {content.attractions.map((attraction) => (
                    <Card key={attraction.id} className="group hover:shadow-xl transition-all duration-300 overflow-hidden">
                      <div className="aspect-video overflow-hidden">
                        <img 
                          src={attraction.image} 
                          alt={attraction.name}
                          loading="lazy"
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                        />
                      </div>
                      <CardHeader>
                        <div className="flex justify-between items-start">
                          <CardTitle className="text-xl">{attraction.name}</CardTitle>
                          <Badge variant="secondary" className="ml-2">
                            {attraction.category}
                          </Badge>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <p className="text-muted-foreground mb-4">{attraction.description}</p>
                        <div className="flex flex-wrap gap-2 mb-4">
                          {attraction.highlights.map((highlight, idx) => (
                            <Badge key={idx} variant="outline" className="text-xs">
                              {highlight}
                            </Badge>
                          ))}
                        </div>
                        <div className="space-y-2 mb-4">
                          <div className="flex items-center text-sm">
                            <Star className="w-4 h-4 text-yellow-500 mr-2" />
                            <span>{attraction.rating} rating</span>
                          </div>
                          <div className="flex items-center text-sm text-muted-foreground">
                            <Clock className="w-4 h-4 mr-2" />
                            <span>{attraction.duration}</span>
                          </div>
                          <div className="flex items-center text-sm text-muted-foreground">
                            <DollarSign className="w-4 h-4 mr-2" />
                            <span>{attraction.price}</span>
                          </div>
                        </div>
                        <Button 
                          className="w-full bg-blue-600 hover:bg-blue-700"
                          onClick={() => handleBooking(attraction.name)}
                        >
                          Book Now
                        </Button>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </motion.section>
            )}

            {/* Activities Tab */}
            {selectedTab === 'activities' && (
              <motion.section
                key="activities"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                aria-label="Activities"
              >
                <h3 className="text-3xl font-bold mb-8 text-center">Things to Do in Negombo</h3>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {content.activities.map((activity) => (
                    <Card key={activity.id} className="hover:shadow-lg transition-shadow">
                      <CardHeader>
                        <div className="flex items-start justify-between">
                          <div className="flex items-center">
                            <div className="p-3 bg-blue-100 rounded-lg mr-4">
                              <activity.icon className="w-6 h-6 text-blue-600" />
                            </div>
                            <div>
                              <CardTitle className="text-lg">{activity.name}</CardTitle>
                              {activity.popular && (
                                <Badge variant="default" className="mt-1 bg-orange-500">
                                  Popular
                                </Badge>
                              )}
                            </div>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <p className="text-muted-foreground mb-4">{activity.description}</p>
                        <div className="flex justify-between items-center mb-4">
                          <span className="text-lg font-semibold text-blue-600">{activity.price}</span>
                          <span className="text-sm text-muted-foreground">{activity.duration}</span>
                        </div>
                        <Button 
                          variant="outline" 
                          className="w-full hover:bg-blue-600 hover:text-white"
                          onClick={() => handleBooking(activity.name)}
                        >
                          Book Activity
                        </Button>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </motion.section>
            )}

            {/* Itineraries Tab */}
            {selectedTab === 'itineraries' && (
              <motion.section
                key="itineraries"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                aria-label="Suggested Tours"
              >
                <h3 className="text-3xl font-bold mb-8 text-center">Suggested Tours & Itineraries</h3>
                <div className="space-y-8">
                  {content.itineraries.map((itinerary) => (
                    <Card key={itinerary.id} className="overflow-hidden">
                      <div className="md:flex">
                        <div className="md:flex-1 p-6">
                          <div className="flex items-center justify-between mb-4">
                            <h4 className="text-2xl font-semibold">{itinerary.title}</h4>
                            <Badge className="bg-blue-100 text-blue-700">
                              {itinerary.duration}
                            </Badge>
                          </div>
                          <p className="text-muted-foreground mb-6">{itinerary.description}</p>
                          <div className="space-y-2 mb-6">
                            {itinerary.highlights.map((highlight, idx) => (
                              <div key={idx} className="flex items-start gap-2">
                                <ChevronRight className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                                <span className="text-sm">{highlight}</span>
                              </div>
                            ))}
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-2xl font-bold text-blue-600">{itinerary.price}</span>
                            <Button 
                              className="bg-blue-600 hover:bg-blue-700"
                              onClick={() => handleBooking(itinerary.title)}
                            >
                              Book This Tour
                            </Button>
                          </div>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              </motion.section>
            )}

            {/* Travel Tips Tab */}
            {selectedTab === 'travel-tips' && (
              <motion.section
                key="travel-tips"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                aria-label="Travel Tips"
              >
                <h3 className="text-3xl font-bold mb-8 text-center">Travel Tips for Negombo</h3>
                <div className="grid md:grid-cols-3 gap-8">
                  {content.travelTips.map((tipSection) => (
                    <Card key={tipSection.id}>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-3">
                          <tipSection.icon className="w-6 h-6 text-blue-600" />
                          {tipSection.title}
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <ul className="space-y-2">
                          {tipSection.tips.map((tip, idx) => (
                            <li key={idx} className="flex items-start gap-2">
                              <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                              <span className="text-sm">{tip}</span>
                            </li>
                          ))}
                        </ul>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </motion.section>
            )}

            {/* FAQs Tab */}
            {selectedTab === 'faqs' && (
              <motion.section
                key="faqs"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                aria-label="Frequently Asked Questions"
              >
                <h3 className="text-3xl font-bold mb-8 text-center">Frequently Asked Questions</h3>
                <div className="max-w-3xl mx-auto">
                  <Accordion type="single" collapsible className="space-y-4">
                    {content.faqs.map((faq) => (
                      <AccordionItem key={faq.id} value={faq.id} className="border rounded-lg px-4">
                        <AccordionTrigger className="text-left hover:no-underline">
                          <h4 className="font-semibold">{faq.question}</h4>
                        </AccordionTrigger>
                        <AccordionContent>
                          <p className="text-muted-foreground">{faq.answer}</p>
                        </AccordionContent>
                      </AccordionItem>
                    ))}
                  </Accordion>
                </div>
              </motion.section>
            )}
          </AnimatePresence>
        </div>

        {/* Map & Directions Section */}
        <section className="py-16 bg-gray-50" aria-label="Location and Map">
          <div className="container mx-auto px-4">
            <h3 className="text-3xl font-bold mb-8 text-center">Getting to Negombo</h3>
            <div className="grid lg:grid-cols-2 gap-8">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Map className="w-5 h-5 text-blue-600" />
                    Location & Directions
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="aspect-video rounded-lg overflow-hidden mb-6">
                    <iframe
                      src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d63329.19832567945!2d79.8237!3d7.2008!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3ae2ee9c6bb2f73b%3A0x7e0d5d5d5d5d5d5d!2sNegombo%2C%20Sri%20Lanka!5e0!3m2!1sen!2sus!4v1647887431289!5m2!1sen!2sus"
                      width="100%"
                      height="100%"
                      style={{ border: 0 }}
                      allowFullScreen
                      loading="lazy"
                      referrerPolicy="no-referrer-when-downgrade"
                      title="Negombo Map"
                    ></iframe>
                  </div>
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-semibold mb-2">From Colombo Airport (10 km)</h4>
                      <p className="text-sm text-muted-foreground">
                        • By Taxi: 20 minutes (pre-arrange recommended)<br />
                        • By Tuk-tuk: 30 minutes (negotiate fare)<br />
                        • Hotel Shuttle: Many hotels offer free transfers
                      </p>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-2">From Colombo City (35 km)</h4>
                      <p className="text-sm text-muted-foreground">
                        • By Car: 45 minutes via highway<br />
                        • By Train: 1 hour to Negombo station<br />
                        • By Bus: 1.5 hours direct service
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Navigation className="w-5 h-5 text-blue-600" />
                    Transportation Tips
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="p-4 bg-blue-50 rounded-lg">
                    <h4 className="font-semibold mb-2">Airport Transfers</h4>
                    <p className="text-sm">
                      We offer reliable airport transfers with meet & greet service. 
                      Perfect for arrivals and departures at any time.
                    </p>
                    <Button 
                      className="mt-3 bg-blue-600 hover:bg-blue-700"
                      onClick={() => handleBooking('Airport Transfer Service')}
                    >
                      Book Transfer
                    </Button>
                  </div>
                  <div className="space-y-2">
                    <p className="text-sm flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                      24/7 airport transfer services available
                    </p>
                    <p className="text-sm flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                      Fixed rates for airport transfers
                    </p>
                    <p className="text-sm flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                      Local transport easily available
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Gallery Section */}
        <section className="py-16" aria-label="Photo Gallery">
          <div className="container mx-auto px-4">
            <h3 className="text-3xl font-bold mb-8 text-center">Negombo Gallery</h3>
            <div className="relative rounded-lg overflow-hidden aspect-video max-w-4xl mx-auto">
              <AnimatePresence mode="wait">
                <motion.img
                  key={galleryIndex}
                  src={content.gallery[galleryIndex]}
                  alt={`Negombo gallery image ${galleryIndex + 1}`}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.5 }}
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              </AnimatePresence>
              <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2">
                {content.gallery.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setGalleryIndex(index)}
                    className={`w-2 h-2 rounded-full transition-all ${
                      galleryIndex === index ? 'bg-white w-8' : 'bg-white/50'
                    }`}
                    aria-label={`View gallery image ${index + 1}`}
                  />
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Call to Action Section */}
        <section className="bg-gradient-to-r from-blue-600 to-cyan-600 text-white py-16" aria-label="Call to Action">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Start Your Sri Lankan Journey in Negombo
            </h2>
            <p className="text-xl mb-8 max-w-2xl mx-auto">
              From convenient airport transfers to beach relaxation and cultural experiences, let us make your Negombo stay memorable
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                size="lg" 
                className="bg-white text-blue-600 hover:bg-gray-100"
                onClick={() => handleBooking('Negombo Complete Package')}
              >
                <Phone className="w-5 h-5 mr-2" />
                Book Your Trip
              </Button>
              <Button 
                size="lg" 
                variant="outline"
                className="bg-transparent text-white border-white hover:bg-white/20"
                onClick={() => window.location.href = 'mailto:info@rechargetravels.com?subject=Negombo Inquiry'}
              >
                <Mail className="w-5 h-5 mr-2" />
                Contact Us
              </Button>
            </div>
          </div>
        </section>

      </main>

      <Footer />

      {/* Enhanced Booking Modal */}
      <EnhancedBookingModal
        isOpen={showBookingModal}
        onClose={() => setShowBookingModal(false)}
        preSelectedService={selectedService}
      />
    </>
  );
};

export default Negombo;
