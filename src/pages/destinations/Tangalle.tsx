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
  Telescope,
  Bird
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

interface TangalleContent {
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

const defaultContent: TangalleContent = {
  hero: {
    slides: [
      {
        id: '1',
        image: "https://images.unsplash.com/photo-1506953823976-52e1fdc0149a?auto=format&fit=crop&q=80",
        title: "Welcome to Tangalle",
        subtitle: "Hidden Beach Paradise of the South"
      },
      {
        id: '2',
        image: "https://images.unsplash.com/photo-1539367628448-4bc5c9d171c8?auto=format&fit=crop&q=80",
        title: "Pristine Beaches",
        subtitle: "Miles of Untouched Golden Sand"
      },
      {
        id: '3',
        image: "https://images.unsplash.com/photo-1559827260-dc66d52bef19?auto=format&fit=crop&q=80",
        title: "Sea Turtle Haven",
        subtitle: "Witness Nature's Ancient Mariners"
      }
    ],
    title: "Tangalle",
    subtitle: "Discover Sri Lanka's Hidden Beach Escape"
  },
  overview: {
    title: "Why Visit Tangalle?",
    description: "Tangalle is a tranquil coastal town on Sri Lanka's southern shore, offering some of the island's most pristine and uncrowded beaches. Known for its laid-back atmosphere, turtle watching opportunities, and dramatic coastal landscapes, Tangalle provides the perfect escape for beach lovers seeking authenticity away from tourist crowds. Its strategic location makes it an ideal base for exploring the diverse attractions of the deep south.",
    highlights: [
      "Pristine, uncrowded beaches stretching for miles",
      "Five species of sea turtles nesting sites",
      "Rekawa Turtle Conservation Project",
      "Dramatic blow holes at Hummanaya",
      "Ancient Mulkirigala Rock Temple",
      "Fresh seafood and local cuisine",
      "Lagoons perfect for kayaking",
      "Authentic fishing village experiences"
    ]
  },
  seo: {
    title: "Tangalle Beach Sri Lanka - Turtle Watching & Hidden Beaches | Recharge Travels",
    description: "Explore Tangalle's pristine beaches, turtle watching sites, and authentic coastal experiences. Discover Sri Lanka's hidden beach paradise with our expert guides.",
    keywords: "Tangalle beach, turtle watching Sri Lanka, Rekawa turtle beach, Hummanaya blow hole, Tangalle hotels, Mulkirigala temple, hidden beaches Sri Lanka, Tangalle travel guide"
  },
  attractions: [
    {
      id: '1',
      name: "Rekawa Beach & Turtle Conservation",
      description: "One of Sri Lanka's most important sea turtle nesting sites where five species come ashore to lay eggs. Night watching tours offer unforgettable wildlife experiences.",
      image: "https://images.unsplash.com/photo-1591025207163-942350e47db2?auto=format&fit=crop&q=80",
      category: "Wildlife",
      rating: 4.9,
      duration: "3-4 hours",
      price: "From $20",
      highlights: ["Sea Turtle Nesting", "Night Tours", "Conservation Center", "Five Turtle Species"]
    },
    {
      id: '2',
      name: "Tangalle Beach",
      description: "A stunning stretch of golden sand with swaying palms, clear waters, and peaceful atmosphere. Perfect for swimming, sunbathing, and long beach walks.",
      image: "https://images.unsplash.com/photo-1506953823976-52e1fdc0149a?auto=format&fit=crop&q=80",
      category: "Beaches",
      rating: 4.8,
      duration: "Full day",
      price: "Free",
      highlights: ["Swimming", "Sunbathing", "Beach Walks", "Sunset Views"]
    },
    {
      id: '3',
      name: "Hummanaya Blow Hole",
      description: "The second largest blow hole in the world, shooting water up to 25 meters high during high tide. A spectacular natural phenomenon especially during monsoon season.",
      image: "https://images.unsplash.com/photo-1559827260-dc66d52bef19?auto=format&fit=crop&q=80",
      category: "Natural",
      rating: 4.6,
      duration: "1-2 hours",
      price: "From $2",
      highlights: ["Natural Fountain", "25m Water Spouts", "Best at High Tide", "Coastal Views"]
    },
    {
      id: '4',
      name: "Mulkirigala Rock Temple",
      description: "An ancient Buddhist temple complex built on a 205m high rock with caves containing reclining Buddha statues and ancient murals dating back to the 3rd century.",
      image: "https://images.unsplash.com/photo-1609920658906-8223bd289001?auto=format&fit=crop&q=80",
      category: "Religious",
      rating: 4.7,
      duration: "2-3 hours",
      price: "From $3",
      highlights: ["Ancient Caves", "Buddha Statues", "Panoramic Views", "Historic Murals"]
    },
    {
      id: '5',
      name: "Kalametiya Bird Sanctuary",
      description: "A coastal lagoon sanctuary home to over 150 bird species including migrants. Best visited early morning for bird watching and peaceful lagoon views.",
      image: "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?auto=format&fit=crop&q=80",
      category: "Wildlife",
      rating: 4.5,
      duration: "2-3 hours",
      price: "From $10",
      highlights: ["150+ Bird Species", "Lagoon Ecosystem", "Boat Tours", "Photography"]
    },
    {
      id: '6',
      name: "Silent Beach",
      description: "A secluded beach known for its tranquility and natural beauty. Perfect for those seeking solitude and untouched coastal landscapes.",
      image: "https://images.unsplash.com/photo-1519046904884-53103b34b206?auto=format&fit=crop&q=80",
      category: "Beaches",
      rating: 4.7,
      duration: "Half day",
      price: "Free",
      highlights: ["Secluded Beach", "Natural Pools", "Rock Formations", "Privacy"]
    }
  ],
  activities: [
    {
      id: '1',
      name: "Turtle Watching Tour",
      description: "Night tours to witness sea turtles nesting on the beach",
      icon: Turtle,
      price: "From $25",
      duration: "3-4 hours",
      popular: true
    },
    {
      id: '2',
      name: "Lagoon Kayaking",
      description: "Paddle through peaceful lagoons and mangroves",
      icon: Activity,
      price: "From $20",
      duration: "2-3 hours",
      popular: true
    },
    {
      id: '3',
      name: "Bird Watching Safari",
      description: "Early morning tours to spot exotic and migratory birds",
      icon: Bird,
      price: "From $30",
      duration: "3 hours"
    },
    {
      id: '4',
      name: "Fishing Village Tour",
      description: "Experience traditional fishing methods and local life",
      icon: Fish,
      price: "From $15",
      duration: "2 hours"
    },
    {
      id: '5',
      name: "Beach Yoga Sessions",
      description: "Sunrise and sunset yoga on pristine beaches",
      icon: Sunrise,
      price: "From $10",
      duration: "1.5 hours"
    },
    {
      id: '6',
      name: "Cooking with Locals",
      description: "Learn to prepare traditional southern dishes",
      icon: Utensils,
      price: "From $35",
      duration: "3 hours"
    }
  ],
  itineraries: [
    {
      id: '1',
      title: "Tangalle Beach & Wildlife Day",
      duration: "1 Day",
      description: "Experience the best of Tangalle's beaches and wildlife in a single day",
      highlights: [
        "Morning beach time at Silent Beach",
        "Visit Hummanaya Blow Hole",
        "Lunch at a beachfront restaurant",
        "Afternoon at Kalametiya Bird Sanctuary",
        "Evening turtle watching at Rekawa"
      ],
      price: "From $70 per person"
    },
    {
      id: '2',
      title: "Tangalle Nature Escape",
      duration: "2 Days / 1 Night",
      description: "Immerse yourself in Tangalle's natural wonders and peaceful beaches",
      highlights: [
        "Day 1: Beach exploration and lagoon kayaking",
        "Sunset at Tangalle Beach",
        "Night turtle watching experience",
        "Day 2: Mulkirigala Temple visit",
        "Fishing village tour and seafood lunch"
      ],
      price: "From $150 per person"
    },
    {
      id: '3',
      title: "Southern Coast Discovery",
      duration: "3 Days / 2 Nights",
      description: "Comprehensive exploration of Tangalle and surrounding coastal gems",
      highlights: [
        "Multiple beach visits and water activities",
        "Wildlife experiences including turtles and birds",
        "Cultural sites and temple visits",
        "Local cooking class",
        "Day trip to nearby attractions",
        "Sunrise and sunset yoga sessions"
      ],
      price: "From $350 per person"
    }
  ],
  faqs: [
    {
      id: '1',
      question: "When is the best time for turtle watching in Tangalle?",
      answer: "The best time for turtle watching is from November to April, with peak nesting season between January and April. Turtles come ashore at night, typically between 8 PM and 2 AM. Full moon nights generally see fewer turtles due to the bright light."
    },
    {
      id: '2',
      question: "Are Tangalle beaches safe for swimming?",
      answer: "Most Tangalle beaches have moderate to strong currents, so caution is advised. Silent Beach and certain sections of Tangalle Beach have calmer waters. Always check local conditions and swim in designated safe areas. The calmest seas are from December to March."
    },
    {
      id: '3',
      question: "How far is Tangalle from major cities?",
      answer: "Tangalle is about 195 km from Colombo (3.5 hours by car), 80 km from Galle (1.5 hours), and 35 km from Matara (45 minutes). The journey from Colombo via the Southern Expressway is scenic and comfortable."
    },
    {
      id: '4',
      question: "What makes Tangalle different from other beach towns?",
      answer: "Tangalle offers a more authentic, less commercialized beach experience compared to popular spots like Mirissa or Unawatuna. It has longer, less crowded beaches, important turtle nesting sites, and maintains its fishing village charm while offering good tourist facilities."
    },
    {
      id: '5',
      question: "Can I see all five species of turtles at Rekawa?",
      answer: "Rekawa Beach is unique as all five species found in Sri Lanka (Green, Hawksbill, Olive Ridley, Loggerhead, and Leatherback) nest here. However, seeing all species depends on timing and luck. Green turtles are most common, while Leatherback sightings are rare."
    },
    {
      id: '6',
      question: "Are there good restaurants in Tangalle?",
      answer: "Yes, Tangalle has excellent dining options ranging from local rice and curry shops to upscale beachfront restaurants. Fresh seafood is a specialty, and many hotels offer excellent international cuisine. Don't miss trying the local crab curry and fresh tropical fruits."
    }
  ],
  gallery: [
    "https://images.unsplash.com/photo-1506953823976-52e1fdc0149a?auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1539367628448-4bc5c9d171c8?auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1591025207163-942350e47db2?auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1559827260-dc66d52bef19?auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1519046904884-53103b34b206?auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?auto=format&fit=crop&q=80"
  ],
  travelTips: [
    {
      id: '1',
      title: "Best Time to Visit",
      icon: Calendar,
      tips: [
        "December to April: Dry season, calm seas",
        "January to April: Peak turtle nesting",
        "May to November: Monsoon, dramatic waves",
        "Avoid full moon nights for turtle watching"
      ]
    },
    {
      id: '2',
      title: "What to Bring",
      icon: Sun,
      tips: [
        "Red light torch for turtle watching",
        "Insect repellent for evening activities",
        "Reef-safe sunscreen",
        "Light rain jacket for boat trips",
        "Binoculars for bird watching",
        "Water shoes for rocky beaches"
      ]
    },
    {
      id: '3',
      title: "Local Guidelines",
      icon: Users,
      tips: [
        "No flash photography during turtle watching",
        "Keep voices low near nesting sites",
        "Don't touch or disturb turtles",
        "Respect local fishing activities",
        "Follow guide instructions at all times",
        "Support eco-friendly businesses"
      ]
    }
  ]
};

const Tangalle = () => {
  const [content, setContent] = useState<TangalleContent>(defaultContent);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [selectedTab, setSelectedTab] = useState('attractions');
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [selectedService, setSelectedService] = useState<string>('');
  const [galleryIndex, setGalleryIndex] = useState(0);

  // Load content from Firebase and set up real-time listener
  useEffect(() => {
    const docRef = doc(db, 'destinations', 'tangalle');
    
    // Set up real-time listener
    const unsubscribe = onSnapshot(docRef, (docSnap) => {
      if (docSnap.exists()) {
        const data = docSnap.data() as TangalleContent;
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
    temperature: "27-32°C",
    season: "Tropical year-round",
    rainfall: "Low (Dec-Apr), High (May-Nov)"
  };

  const destinationInfo: DestinationInfo = {
    population: "11,000",
    area: "28 km²",
    elevation: "Sea level",
    bestTime: "December to April",
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
    "name": "Tangalle, Sri Lanka",
    "description": content.overview.description,
    "image": content.hero.slides.map(slide => slide.image),
    "touristType": ["Beach Tourism", "Wildlife Tourism", "Eco Tourism"],
    "geo": {
      "@type": "GeoCoordinates",
      "latitude": "6.0241",
      "longitude": "80.7947"
    },
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": "4.7",
      "reviewCount": "1523"
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
        <meta property="og:url" content="https://rechargetravels.com/destinations/tangalle" />
        <meta property="og:type" content="website" />
        
        {/* Twitter Card Tags */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={content.seo.title} />
        <meta name="twitter:description" content={content.seo.description} />
        <meta name="twitter:image" content={content.hero.slides[0].image} />
        
        {/* Canonical URL */}
        <link rel="canonical" href="https://rechargetravels.com/destinations/tangalle" />
        
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
                  onClick={() => handleBooking('Tangalle Tour Package')}
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
                <Turtle className="w-4 h-4" />
                <span>Turtle Season: Jan-Apr</span>
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
                <h3 className="text-3xl font-bold mb-8 text-center">Top Attractions in Tangalle</h3>
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
                <h3 className="text-3xl font-bold mb-8 text-center">Things to Do in Tangalle</h3>
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
                <h3 className="text-3xl font-bold mb-8 text-center">Travel Tips for Tangalle</h3>
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
            <h3 className="text-3xl font-bold mb-8 text-center">Getting to Tangalle</h3>
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
                      src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d31718.425671905657!2d80.7747!3d6.0241!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3ae173bb5a9d7c1f%3A0x3c8e7e8d8e8e7e8d!2sTangalle%2C%20Sri%20Lanka!5e0!3m2!1sen!2sus!4v1647887431289!5m2!1sen!2sus"
                      width="100%"
                      height="100%"
                      style={{ border: 0 }}
                      allowFullScreen
                      loading="lazy"
                      referrerPolicy="no-referrer-when-downgrade"
                      title="Tangalle Map"
                    ></iframe>
                  </div>
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-semibold mb-2">From Colombo (195 km)</h4>
                      <p className="text-sm text-muted-foreground">
                        • By Car: 3.5 hours via Southern Expressway<br />
                        • By Bus: 4-5 hours direct service<br />
                        • Private transfer recommended
                      </p>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-2">From Galle (80 km)</h4>
                      <p className="text-sm text-muted-foreground">
                        • By Car: 1.5 hours coastal route<br />
                        • By Bus: 2 hours with connections<br />
                        • Scenic coastal drive recommended
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
                      Pre-arranged transfers from Colombo Airport available. 
                      Contact us for comfortable, air-conditioned vehicles with experienced drivers.
                    </p>
                    <Button 
                      className="mt-3 bg-blue-600 hover:bg-blue-700"
                      onClick={() => handleBooking('Airport Transfer to Tangalle')}
                    >
                      Book Transfer
                    </Button>
                  </div>
                  <div className="space-y-2">
                    <p className="text-sm flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                      Tuk-tuks available for local transport
                    </p>
                    <p className="text-sm flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                      Bicycle rentals for beach exploration
                    </p>
                    <p className="text-sm flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                      Boat services for lagoon tours
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
            <h3 className="text-3xl font-bold mb-8 text-center">Tangalle Gallery</h3>
            <div className="relative rounded-lg overflow-hidden aspect-video max-w-4xl mx-auto">
              <AnimatePresence mode="wait">
                <motion.img
                  key={galleryIndex}
                  src={content.gallery[galleryIndex]}
                  alt={`Tangalle gallery image ${galleryIndex + 1}`}
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
              Ready to Discover Tangalle's Hidden Treasures?
            </h2>
            <p className="text-xl mb-8 max-w-2xl mx-auto">
              From pristine beaches to turtle watching adventures, let us help you experience the authentic beauty of Tangalle
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                size="lg" 
                className="bg-white text-blue-600 hover:bg-gray-100"
                onClick={() => handleBooking('Tangalle Complete Package')}
              >
                <Phone className="w-5 h-5 mr-2" />
                Book Your Trip
              </Button>
              <Button 
                size="lg" 
                variant="outline"
                className="bg-transparent text-white border-white hover:bg-white/20"
                onClick={() => window.location.href = 'mailto:info@rechargetravels.com?subject=Tangalle Inquiry'}
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

export default Tangalle;
