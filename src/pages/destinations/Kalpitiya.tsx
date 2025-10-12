import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Waves, 
  Sun, 
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
  Bird,
  Shell,
  Map,
  ChevronDown,
  Phone,
  Mail,
  CheckCircle,
  ChevronRight,
  Globe,
  Heart,
  Bike,
  Sparkles
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

interface KalpitiyaContent {
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

const defaultContent: KalpitiyaContent = {
  hero: {
    slides: [
      {
        id: '1',
        image: "https://images.unsplash.com/photo-1559827260-dc66d52bef19?auto=format&fit=crop&q=80",
        title: "Welcome to Kalpitiya",
        subtitle: "Sri Lanka's Kitesurfing Capital"
      },
      {
        id: '2',
        image: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&q=80",
        title: "Marine Paradise",
        subtitle: "Dolphins, Whales & Pristine Lagoons"
      },
      {
        id: '3',
        image: "https://images.unsplash.com/photo-1506477331477-33d5d8b3dc85?auto=format&fit=crop&q=80",
        title: "Adventure Awaits",
        subtitle: "Where Wind Meets Water"
      }
    ],
    title: "Kalpitiya",
    subtitle: "Discover Sri Lanka's Ultimate Water Sports Destination"
  },
  overview: {
    title: "Why Visit Kalpitiya?",
    description: "Kalpitiya, a peninsula on Sri Lanka's northwest coast, has emerged as the island's premier destination for kitesurfing and water sports. This fishing village turned adventure hub offers 14 pristine islands, extensive lagoons, and consistent winds that attract water sports enthusiasts from around the world. Beyond the adrenaline rush, Kalpitiya is home to large pods of dolphins, occasional whale sightings, and the unique Bar Reef - Sri Lanka's largest coral reef system.",
    highlights: [
      "World-class kitesurfing conditions (May-Oct, Dec-Mar)",
      "Dolphin watching with hundreds of spinner dolphins",
      "Bar Reef Marine Sanctuary - largest coral reef",
      "14 islands perfect for island hopping",
      "Wilpattu National Park nearby",
      "Traditional fishing village culture",
      "Mangrove forests and lagoon ecosystems",
      "Consistent wind conditions for water sports"
    ]
  },
  seo: {
    title: "Kalpitiya Sri Lanka - Kitesurfing, Dolphin Watching & Beach Tours | Recharge Travels",
    description: "Experience Kalpitiya, Sri Lanka's kitesurfing paradise. Book dolphin watching tours, kitesurfing lessons, and island hopping adventures with Recharge Travels.",
    keywords: "Kalpitiya kitesurfing, dolphin watching Sri Lanka, Bar Reef snorkeling, Kalpitiya water sports, wind surfing Sri Lanka, Kalpitiya tours, marine sanctuary, island hopping Kalpitiya"
  },
  attractions: [
    {
      id: '1',
      name: "Dolphin Watching",
      description: "Witness hundreds of spinner dolphins in their natural habitat. Kalpitiya's waters host one of the largest dolphin populations in the world, with sightings almost guaranteed year-round.",
      image: "https://images.unsplash.com/photo-1607153333879-c174d265f1d2?auto=format&fit=crop&q=80",
      category: "Marine Life",
      rating: 4.9,
      duration: "3-4 hours",
      price: "From $30",
      highlights: ["Spinner Dolphins", "Large Pods", "Morning Tours", "98% Success Rate"]
    },
    {
      id: '2',
      name: "Bar Reef Marine Sanctuary",
      description: "Sri Lanka's largest coral reef system stretching 3km offshore. This biodiversity hotspot offers excellent snorkeling and diving with over 150 species of fish and pristine coral formations.",
      image: "https://images.unsplash.com/photo-1583212292454-1fe6229603b7?auto=format&fit=crop&q=80",
      category: "Marine Sanctuary",
      rating: 4.8,
      duration: "Half day",
      price: "From $45",
      highlights: ["Coral Gardens", "156 Fish Species", "Snorkeling", "Glass Bottom Boats"]
    },
    {
      id: '3',
      name: "Kalpitiya Lagoon",
      description: "A vast lagoon system perfect for kitesurfing with flat water conditions and consistent winds. The shallow waters and steady breeze make it ideal for beginners and professionals alike.",
      image: "https://images.unsplash.com/photo-1527004013197-933c4bb611b3?auto=format&fit=crop&q=80",
      category: "Water Sports",
      rating: 4.9,
      duration: "Flexible",
      price: "From $50/session",
      highlights: ["Flat Water", "Consistent Wind", "Kite Schools", "Equipment Rental"]
    },
    {
      id: '4',
      name: "Dutch Bay Islands",
      description: "A cluster of 14 small islands offering pristine beaches, mangrove forests, and traditional fishing villages. Perfect for island hopping adventures and experiencing local culture.",
      image: "https://images.unsplash.com/photo-1559827260-dc66d52bef19?auto=format&fit=crop&q=80",
      category: "Islands",
      rating: 4.6,
      duration: "Full day",
      price: "From $40",
      highlights: ["14 Islands", "Pristine Beaches", "Fishing Villages", "Mangroves"]
    },
    {
      id: '5',
      name: "St. Anne's Church",
      description: "Historic Catholic church on Talawila beach, famous for its annual feast in March/July attracting thousands of pilgrims. The unique beachside location adds to its charm.",
      image: "https://images.unsplash.com/photo-1548625149-fc4a29cf7092?auto=format&fit=crop&q=80",
      category: "Religious",
      rating: 4.4,
      duration: "1-2 hours",
      price: "Free",
      highlights: ["Historic Church", "Beach Location", "Annual Feast", "Pilgrimage Site"]
    },
    {
      id: '6',
      name: "Wilpattu National Park",
      description: "Sri Lanka's largest national park, just 1 hour from Kalpitiya. Home to leopards, elephants, sloth bears, and numerous bird species in a unique dry zone forest setting.",
      image: "https://images.unsplash.com/photo-1549366021-9f761d450615?auto=format&fit=crop&q=80",
      category: "Wildlife",
      rating: 4.7,
      duration: "Half/Full day",
      price: "From $40",
      highlights: ["Leopards", "Elephants", "Natural Lakes", "Bird Watching"]
    }
  ],
  activities: [
    {
      id: '1',
      name: "Kitesurfing",
      description: "Learn or perfect your kitesurfing skills in ideal conditions",
      icon: Wind,
      price: "From $60",
      duration: "2-3 hours",
      popular: true
    },
    {
      id: '2',
      name: "Dolphin & Whale Watching",
      description: "Early morning boat trips to see marine mammals",
      icon: Fish,
      price: "From $35",
      duration: "3-4 hours",
      popular: true
    },
    {
      id: '3',
      name: "Snorkeling at Bar Reef",
      description: "Explore Sri Lanka's largest coral reef system",
      icon: Waves,
      price: "From $45",
      duration: "Half day"
    },
    {
      id: '4',
      name: "Island Hopping",
      description: "Visit multiple islands by traditional boat",
      icon: Ship,
      price: "From $50",
      duration: "Full day"
    },
    {
      id: '5',
      name: "Mangrove Kayaking",
      description: "Paddle through pristine mangrove forests",
      icon: Anchor,
      price: "From $25",
      duration: "2-3 hours"
    },
    {
      id: '6',
      name: "Stand-Up Paddleboarding",
      description: "SUP in calm lagoon waters perfect for beginners",
      icon: Activity,
      price: "From $20",
      duration: "1-2 hours"
    }
  ],
  itineraries: [
    {
      id: '1',
      title: "Kalpitiya Marine Adventure",
      duration: "1 Day",
      description: "Perfect day trip for marine life enthusiasts and water sports lovers",
      highlights: [
        "Early morning dolphin watching cruise",
        "Snorkeling at Bar Reef Marine Sanctuary",
        "Beach lunch with fresh seafood",
        "Afternoon kitesurfing or SUP session",
        "Sunset at Alankuda Beach"
      ],
      price: "From $120 per person"
    },
    {
      id: '2',
      title: "Kalpitiya Weekend Escape",
      duration: "2 Days / 1 Night",
      description: "Complete Kalpitiya experience with water sports and island exploration",
      highlights: [
        "Day 1: Dolphin watching, kitesurfing lessons",
        "Evening: Beach BBQ and lagoon sunset",
        "Day 2: Island hopping to Dutch Bay islands",
        "Mangrove kayaking adventure",
        "Visit traditional fishing villages",
        "Fresh seafood experiences"
      ],
      price: "From $250 per person"
    },
    {
      id: '3',
      title: "Ultimate Kalpitiya Adventure",
      duration: "3 Days / 2 Nights",
      description: "Comprehensive adventure package including wildlife and water sports",
      highlights: [
        "Multiple dolphin watching sessions",
        "Full kitesurfing course with certification",
        "Bar Reef diving/snorkeling expedition",
        "Wilpattu National Park safari",
        "Island camping experience",
        "Mangrove and lagoon exploration",
        "Cultural village interactions"
      ],
      price: "From $450 per person"
    }
  ],
  faqs: [
    {
      id: '1',
      question: "When is the best time for kitesurfing in Kalpitiya?",
      answer: "Kalpitiya has two main wind seasons: May to October (southwest monsoon) with stronger winds, and December to March (northeast monsoon) with consistent but lighter winds. Both seasons offer excellent conditions, with the summer months being ideal for advanced riders and winter for beginners."
    },
    {
      id: '2',
      question: "How reliable are dolphin sightings in Kalpitiya?",
      answer: "Dolphin sightings in Kalpitiya have a success rate of over 95%. The area hosts large resident pods of spinner dolphins year-round. Best viewing times are early morning (6-9 AM) when dolphins are most active. Boats depart daily, weather permitting."
    },
    {
      id: '3',
      question: "How far is Kalpitiya from Colombo?",
      answer: "Kalpitiya is approximately 170 km from Colombo, taking about 3-3.5 hours by road. The route goes via Negombo and Chilaw. Private transfers, buses, and trains (to Puttalam, then road) are available. The nearest airport is Colombo International."
    },
    {
      id: '4',
      question: "Do I need experience for kitesurfing in Kalpitiya?",
      answer: "No experience is necessary. Kalpitiya has several IKO-certified schools offering beginner courses. The flat, shallow lagoon provides ideal learning conditions. Complete beginner courses typically take 3-4 days. Equipment rental and advanced coaching are also available."
    },
    {
      id: '5',
      question: "What accommodation options are available?",
      answer: "Kalpitiya offers accommodations from budget guesthouses to luxury kite resorts. Many places cater specifically to water sports enthusiasts with equipment storage, beach access, and rescue boat services. Eco-lodges and camping options are also available. Book early during peak wind season."
    },
    {
      id: '6',
      question: "Can I combine Kalpitiya with other destinations?",
      answer: "Yes! Kalpitiya works well with Wilpattu National Park (1 hour), Anuradhapura (2 hours), and Negombo (2 hours). Many visitors combine it with the Cultural Triangle or as a beach stop between Colombo and the north. We offer combination packages."
    }
  ],
  gallery: [
    "https://images.unsplash.com/photo-1559827260-dc66d52bef19?auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1607153333879-c174d265f1d2?auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1527004013197-933c4bb611b3?auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1583212292454-1fe6229603b7?auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1506477331477-33d5d8b3dc85?auto=format&fit=crop&q=80"
  ],
  travelTips: [
    {
      id: '1',
      title: "Best Time to Visit",
      icon: Calendar,
      tips: [
        "May to October: Strong winds for kitesurfing",
        "December to March: Lighter winds, beginners",
        "Year-round: Dolphin watching",
        "Avoid November: Monsoon transition"
      ]
    },
    {
      id: '2',
      title: "What to Pack",
      icon: Sun,
      tips: [
        "Reef-safe sunscreen (high SPF)",
        "Rash guard for water sports",
        "Water shoes for rocky areas",
        "Waterproof phone case",
        "Light, quick-dry clothing",
        "Insect repellent for evenings"
      ]
    },
    {
      id: '3',
      title: "Water Sports Tips",
      icon: Wind,
      tips: [
        "Book kitesurfing lessons in advance",
        "Check wind forecasts daily",
        "Stay hydrated during activities",
        "Respect local fishing areas",
        "Use provided safety equipment",
        "Listen to instructor briefings"
      ]
    }
  ]
};

const Kalpitiya = () => {
  const [content, setContent] = useState<KalpitiyaContent>(defaultContent);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [selectedTab, setSelectedTab] = useState('attractions');
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [selectedService, setSelectedService] = useState<string>('');
  const [galleryIndex, setGalleryIndex] = useState(0);

  // Load content from Firebase and set up real-time listener
  useEffect(() => {
    const docRef = doc(db, 'destinations', 'kalpitiya');
    
    // Set up real-time listener
    const unsubscribe = onSnapshot(docRef, (docSnap) => {
      if (docSnap.exists()) {
        const data = docSnap.data() as KalpitiyaContent;
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
    season: "Dry zone, windy conditions",
    rainfall: "Low year-round"
  };

  const destinationInfo: DestinationInfo = {
    population: "70,000",
    area: "165 km²",
    elevation: "Sea level",
    bestTime: "May to October",
    language: "Tamil, Sinhala, English",
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
    "name": "Kalpitiya, Sri Lanka",
    "description": content.overview.description,
    "image": content.hero.slides.map(slide => slide.image),
    "touristType": ["Adventure Tourism", "Water Sports", "Marine Tourism"],
    "geo": {
      "@type": "GeoCoordinates",
      "latitude": "8.2333",
      "longitude": "79.7667"
    },
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": "4.8",
      "reviewCount": "1876"
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
        <meta property="og:url" content="https://recharge-travels-73e76.web.app/destinations/kalpitiya" />
        <meta property="og:type" content="website" />
        
        {/* Twitter Card Tags */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={content.seo.title} />
        <meta name="twitter:description" content={content.seo.description} />
        <meta name="twitter:image" content={content.hero.slides[0].image} />
        
        {/* Canonical URL */}
        <link rel="canonical" href="https://recharge-travels-73e76.web.app/destinations/kalpitiya" />
        
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
                  onClick={() => handleBooking('Kalpitiya Adventure Package')}
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
                <Wind className="w-4 h-4" />
                <span>Wind Season: May-Oct</span>
              </div>
              <div className="flex items-center gap-2">
                <Sun className="w-4 h-4" />
                <span>Climate: {weatherInfo.temperature}</span>
              </div>
              <div className="flex items-center gap-2">
                <Fish className="w-4 h-4" />
                <span>Dolphins: Year-round</span>
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
                <h3 className="text-3xl font-bold mb-8 text-center">Top Attractions in Kalpitiya</h3>
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
                <h3 className="text-3xl font-bold mb-8 text-center">Things to Do in Kalpitiya</h3>
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
                <h3 className="text-3xl font-bold mb-8 text-center">Travel Tips for Kalpitiya</h3>
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
            <h3 className="text-3xl font-bold mb-8 text-center">Getting to Kalpitiya</h3>
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
                      src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d126550.89134869147!2d79.7334!3d8.2333!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3afd7491e7ff9c3b%3A0x5b30763ff5f8e536!2sKalpitiya%2C%20Sri%20Lanka!5e0!3m2!1sen!2sus!4v1647887431289!5m2!1sen!2sus"
                      width="100%"
                      height="100%"
                      style={{ border: 0 }}
                      allowFullScreen
                      loading="lazy"
                      referrerPolicy="no-referrer-when-downgrade"
                      title="Kalpitiya Map"
                    ></iframe>
                  </div>
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-semibold mb-2">From Colombo (170 km)</h4>
                      <p className="text-sm text-muted-foreground">
                        • By Car: 3-3.5 hours via Negombo<br />
                        • By Bus: 4 hours to Puttalam + local bus<br />
                        • Private Transfer: Most convenient option
                      </p>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-2">From Negombo (140 km)</h4>
                      <p className="text-sm text-muted-foreground">
                        • By Car/Van: 2.5 hours<br />
                        • Perfect stopover from airport<br />
                        • Coastal route available
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
                      Direct transfers from Colombo Airport (3.5 hours). 
                      We arrange pickups with kitesurfing equipment transport if needed.
                    </p>
                    <Button 
                      className="mt-3 bg-blue-600 hover:bg-blue-700"
                      onClick={() => handleBooking('Airport Transfer to Kalpitiya')}
                    >
                      Book Transfer
                    </Button>
                  </div>
                  <div className="space-y-2">
                    <p className="text-sm flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                      Local tuk-tuks available for short distances
                    </p>
                    <p className="text-sm flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                      Bicycle rentals at many hotels
                    </p>
                    <p className="text-sm flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                      Boat services for island hopping
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
            <h3 className="text-3xl font-bold mb-8 text-center">Kalpitiya Gallery</h3>
            <div className="relative rounded-lg overflow-hidden aspect-video max-w-4xl mx-auto">
              <AnimatePresence mode="wait">
                <motion.img
                  key={galleryIndex}
                  src={content.gallery[galleryIndex]}
                  alt={`Kalpitiya gallery image ${galleryIndex + 1}`}
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
              Ready to Ride the Wind and Waves?
            </h2>
            <p className="text-xl mb-8 max-w-2xl mx-auto">
              Experience world-class kitesurfing, dolphin encounters, and island adventures in Kalpitiya
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                size="lg" 
                className="bg-white text-blue-600 hover:bg-gray-100"
                onClick={() => handleBooking('Kalpitiya Complete Package')}
              >
                <Phone className="w-5 h-5 mr-2" />
                Book Your Adventure
              </Button>
              <Button 
                size="lg" 
                variant="outline"
                className="bg-transparent text-white border-white hover:bg-white/20"
                onClick={() => window.location.href = 'mailto:info@rechargetravels.com?subject=Kalpitiya Inquiry'}
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

export default Kalpitiya;
