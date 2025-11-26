import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Bird, 
  Sun, 
  MapPin,
  Calendar,
  Clock,
  Star,
  Church,
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
  Fish,
  Shell,
  Map,
  ChevronDown,
  Phone,
  Mail,
  CheckCircle,
  ChevronRight,
  Globe,
  Heart,
  Waves,
  Mountain,
  Tent
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

interface MannarContent {
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

const defaultContent: MannarContent = {
  hero: {
    slides: [
      {
        id: '1',
        image: "https://images.unsplash.com/photo-1564594985645-4427056e22e2?auto=format&fit=crop&q=80",
        title: "Welcome to Mannar",
        subtitle: "The Pearl Banks of Ancient Ceylon"
      },
      {
        id: '2',
        image: "https://images.unsplash.com/photo-1574482620826-40685ca5ebd2?auto=format&fit=crop&q=80",
        title: "Bird Watching Paradise",
        subtitle: "Home to Millions of Migratory Birds"
      },
      {
        id: '3',
        image: "https://images.unsplash.com/photo-1559827260-dc66d52bef19?auto=format&fit=crop&q=80",
        title: "Unique Island Experience",
        subtitle: "Where History Meets Natural Beauty"
      }
    ],
    title: "Mannar",
    subtitle: "Discover Sri Lanka's Hidden Island Gem"
  },
  overview: {
    title: "Why Visit Mannar?",
    description: "Mannar, located on the northwestern coast of Sri Lanka, is a unique island district connected to the mainland by a causeway. This historically significant region is famous for its ancient pearl banks, diverse birdlife, pristine beaches, and unique baobab trees. Often overlooked by tourists, Mannar offers an authentic Sri Lankan experience with its blend of Tamil and Muslim cultures, making it a fascinating destination for those seeking off-the-beaten-path adventures.",
    highlights: [
      "Adam's Bridge - Ancient limestone shoals",
      "Millions of migratory birds at wetlands",
      "Ancient Baobab trees over 700 years old",
      "Pristine, uncrowded beaches",
      "Historic Mannar Fort from 1560",
      "Traditional pearl diving heritage",
      "Unique donkey population",
      "Rich multicultural experience"
    ]
  },
  seo: {
    title: "Mannar Island Sri Lanka - Bird Watching & Pearl Banks | Recharge Travels",
    description: "Explore Mannar, Sri Lanka's hidden island paradise. Experience world-class bird watching, ancient baobab trees, pristine beaches, and rich cultural heritage with Recharge Travels.",
    keywords: "Mannar island Sri Lanka, bird watching Mannar, Adam's Bridge, baobab trees Sri Lanka, Mannar Fort, pearl banks Ceylon, Mannar travel guide, off the beaten path Sri Lanka"
  },
  attractions: [
    {
      id: '1',
      name: "Adam's Bridge (Rama's Bridge)",
      description: "A chain of natural limestone shoals between India and Sri Lanka, steeped in mythology and geological wonder. According to legend, this was built by Lord Rama's army.",
      image: "https://images.unsplash.com/photo-1596883013325-cbf191ee93f7?auto=format&fit=crop&q=80",
      category: "Natural Wonder",
      rating: 4.8,
      duration: "2-3 hours",
      price: "From $30",
      highlights: ["Mythological Significance", "Geological Marvel", "NASA Imagery", "Boat Tours"]
    },
    {
      id: '2',
      name: "Mannar Bird Sanctuary",
      description: "A haven for bird watchers with over 200 species, including flamingos, pelicans, and painted storks. The wetlands attract millions of migratory birds from October to March.",
      image: "https://images.unsplash.com/photo-1574482620826-40685ca5ebd2?auto=format&fit=crop&q=80",
      category: "Wildlife",
      rating: 4.9,
      duration: "3-4 hours",
      price: "From $25",
      highlights: ["Flamingo Flocks", "200+ Bird Species", "Wetland Ecosystem", "Photography"]
    },
    {
      id: '3',
      name: "Ancient Baobab Tree",
      description: "A magnificent 700-year-old baobab tree, believed to have been planted by Arab traders. One of the few baobab trees in Sri Lanka with an impressive 20-meter circumference.",
      image: "https://images.unsplash.com/photo-1445966275305-9806327ea2b5?auto=format&fit=crop&q=80",
      category: "Natural Heritage",
      rating: 4.6,
      duration: "1 hour",
      price: "Free",
      highlights: ["700 Years Old", "African Origin", "Photo Opportunity", "Cultural Significance"]
    },
    {
      id: '4',
      name: "Mannar Fort",
      description: "Built by the Portuguese in 1560 and later occupied by the Dutch and British. This four-bastioned fort offers insights into colonial history and panoramic views.",
      image: "https://images.unsplash.com/photo-1518623489648-a173ef7824f3?auto=format&fit=crop&q=80",
      category: "Historical",
      rating: 4.5,
      duration: "1-2 hours",
      price: "From $5",
      highlights: ["Portuguese Architecture", "Ocean Views", "Historical Museum", "Colonial History"]
    },
    {
      id: '5',
      name: "Thiruketheeswaram Temple",
      description: "An ancient Hindu temple mentioned in the Ramayana, one of the five ancient Ishwarams of Lord Shiva in Sri Lanka. Recently renovated with vibrant gopuram.",
      image: "https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&q=80",
      category: "Religious",
      rating: 4.7,
      duration: "1-2 hours",
      price: "Free",
      highlights: ["Ancient Temple", "Ramayana Connection", "Hindu Architecture", "Sacred Tank"]
    },
    {
      id: '6',
      name: "Talaimannar Beach & Pier",
      description: "The westernmost point of Sri Lanka with pristine beaches and the historic pier that once connected to India. Perfect for sunset views and beach walks.",
      image: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&q=80",
      category: "Beaches",
      rating: 4.4,
      duration: "2-3 hours",
      price: "Free",
      highlights: ["Sunset Views", "Historic Pier", "Swimming", "Ferry History"]
    }
  ],
  activities: [
    {
      id: '1',
      name: "Bird Watching Tours",
      description: "Expert-guided tours to spot flamingos, pelicans, and rare migratory birds",
      icon: Bird,
      price: "From $40",
      duration: "Half day",
      popular: true
    },
    {
      id: '2',
      name: "Island Hopping",
      description: "Explore the small islands around Mannar with traditional boats",
      icon: Ship,
      price: "From $50",
      duration: "Full day",
      popular: true
    },
    {
      id: '3',
      name: "Kite Surfing",
      description: "Perfect wind conditions make Mannar ideal for kite surfing",
      icon: Wind,
      price: "From $60",
      duration: "3 hours"
    },
    {
      id: '4',
      name: "Cultural Village Tour",
      description: "Experience traditional fishing villages and local lifestyle",
      icon: Users,
      price: "From $30",
      duration: "Half day"
    },
    {
      id: '5',
      name: "Pearl Diving Experience",
      description: "Learn about ancient pearl diving traditions with local divers",
      icon: Shell,
      price: "From $45",
      duration: "2-3 hours"
    },
    {
      id: '6',
      name: "Donkey Cart Rides",
      description: "Unique experience with Mannar's famous donkey population",
      icon: Activity,
      price: "From $15",
      duration: "1 hour"
    }
  ],
  itineraries: [
    {
      id: '1',
      title: "Mannar Day Explorer",
      duration: "1 Day",
      description: "Perfect introduction to Mannar's highlights for day visitors",
      highlights: [
        "Morning visit to Mannar Fort",
        "Explore ancient Baobab tree",
        "Bird watching at wetlands",
        "Lunch with local seafood",
        "Sunset at Talaimannar Beach"
      ],
      price: "From $80 per person"
    },
    {
      id: '2',
      title: "Mannar Wildlife & Culture",
      duration: "2 Days / 1 Night",
      description: "Comprehensive tour focusing on birds, culture, and history",
      highlights: [
        "Day 1: Fort visit, Thiruketheeswaram Temple, local markets",
        "Evening: Traditional dinner and cultural show",
        "Day 2: Early morning bird watching expedition",
        "Island hopping to nearby islets",
        "Visit fishing villages and pearl diving demonstration"
      ],
      price: "From $180 per person"
    },
    {
      id: '3',
      title: "Mannar Adventure Package",
      duration: "3 Days / 2 Nights",
      description: "Complete Mannar experience with adventure activities",
      highlights: [
        "All major attractions including Adam's Bridge boat tour",
        "Kite surfing lessons with equipment",
        "Extensive bird watching with expert guides",
        "Island camping experience",
        "Night fishing with locals",
        "Donkey sanctuary visit"
      ],
      price: "From $350 per person"
    }
  ],
  faqs: [
    {
      id: '1',
      question: "When is the best time to visit Mannar for bird watching?",
      answer: "The best time for bird watching in Mannar is from October to March when millions of migratory birds arrive from colder regions. Peak months are December and January. The weather is also pleasant during this period with minimal rainfall."
    },
    {
      id: '2',
      question: "How do I reach Mannar from Colombo?",
      answer: "Mannar is approximately 300 km from Colombo. You can reach by car/van (4-5 hours) via A3 highway through Kurunegala and Anuradhapura. Public buses are available but take 5-6 hours. The nearest airport is in Jaffna (2 hours by road). Train service to Mannar was recently restored with limited schedules."
    },
    {
      id: '3',
      question: "Is it safe to visit Mannar?",
      answer: "Yes, Mannar is safe for tourists. The area has been peaceful since 2009 and locals are very welcoming. However, some areas near the naval base may have restrictions. Always check current conditions and respect local customs, especially in religious sites."
    },
    {
      id: '4',
      question: "What should I know about the weather in Mannar?",
      answer: "Mannar has a dry, arid climate. It's one of the driest regions in Sri Lanka. Temperatures range from 25-35°C year-round. The northeast monsoon (October-January) brings some rain. Strong winds are common, making it perfect for wind sports. Always carry sun protection."
    },
    {
      id: '5',
      question: "Are there good accommodation options in Mannar?",
      answer: "Accommodation in Mannar ranges from basic guesthouses to comfortable hotels. Options are limited compared to major tourist areas, so booking in advance is recommended. Several eco-lodges offer unique experiences near bird watching areas. Homestays provide authentic local experiences."
    },
    {
      id: '6',
      question: "Can I see Adam's Bridge from Mannar?",
      answer: "You can see parts of Adam's Bridge from Talaimannar, the westernmost point of Mannar. For better views, boat tours are available (weather permitting). The full chain of shoals is best viewed from aerial photographs. The area has mythological significance in both Hindu and Islamic traditions."
    }
  ],
  gallery: [
    "https://images.unsplash.com/photo-1564594985645-4427056e22e2?auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1574482620826-40685ca5ebd2?auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1445966275305-9806327ea2b5?auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1596883013325-cbf191ee93f7?auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1518623489648-a173ef7824f3?auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&q=80"
  ],
  travelTips: [
    {
      id: '1',
      title: "Best Time to Visit",
      icon: Calendar,
      tips: [
        "October to March: Best for bird watching",
        "December to January: Peak migratory season",
        "April to September: Hot and dry, fewer tourists",
        "Avoid monsoon periods for water activities"
      ]
    },
    {
      id: '2',
      title: "What to Pack",
      icon: Sun,
      tips: [
        "Strong sun protection (SPF 50+)",
        "Binoculars for bird watching",
        "Light, breathable clothing",
        "Good walking shoes for fort and temple visits",
        "Windbreaker for evening beach visits",
        "Insect repellent for wetland areas"
      ]
    },
    {
      id: '3',
      title: "Local Customs",
      icon: Users,
      tips: [
        "Respect religious sites - remove shoes",
        "Dress modestly, especially at temples",
        "Ask permission before photographing locals",
        "Friday prayers important for Muslim community",
        "Learn basic Tamil greetings",
        "Support local businesses and crafts"
      ]
    }
  ]
};

const Mannar = () => {
  const [content, setContent] = useState<MannarContent>(defaultContent);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [selectedTab, setSelectedTab] = useState('attractions');
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [selectedService, setSelectedService] = useState<string>('');
  const [galleryIndex, setGalleryIndex] = useState(0);

  // Load content from Firebase and set up real-time listener
  useEffect(() => {
    const docRef = doc(db, 'destinations', 'mannar');
    
    // Set up real-time listener
    const unsubscribe = onSnapshot(docRef, (docSnap) => {
      if (docSnap.exists()) {
        const data = docSnap.data() as MannarContent;
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
    temperature: "25-35°C",
    season: "Dry and arid year-round",
    rainfall: "Low (Oct-Jan), Very Low (Feb-Sep)"
  };

  const destinationInfo: DestinationInfo = {
    population: "99,000",
    area: "2,002 km²",
    elevation: "Sea level to 10m",
    bestTime: "October to March",
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
    "name": "Mannar, Sri Lanka",
    "description": content.overview.description,
    "image": content.hero.slides.map(slide => slide.image),
    "touristType": ["Nature Tourism", "Bird Watching", "Cultural Tourism"],
    "geo": {
      "@type": "GeoCoordinates",
      "latitude": "8.9810",
      "longitude": "79.9044"
    },
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": "4.7",
      "reviewCount": "892"
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
        <meta property="og:url" content="https://recharge-travels-73e76.web.app/destinations/mannar" />
        <meta property="og:type" content="website" />
        
        {/* Twitter Card Tags */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={content.seo.title} />
        <meta name="twitter:description" content={content.seo.description} />
        <meta name="twitter:image" content={content.hero.slides[0].image} />
        
        {/* Canonical URL */}
        <link rel="canonical" href="https://recharge-travels-73e76.web.app/destinations/mannar" />
        
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
                  onClick={() => handleBooking('Mannar Tour Package')}
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
                <Bird className="w-4 h-4" />
                <span>Bird Season: Oct-Mar</span>
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
                <h3 className="text-3xl font-bold mb-8 text-center">Top Attractions in Mannar</h3>
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
                <h3 className="text-3xl font-bold mb-8 text-center">Things to Do in Mannar</h3>
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
                <h3 className="text-3xl font-bold mb-8 text-center">Travel Tips for Mannar</h3>
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
            <h3 className="text-3xl font-bold mb-8 text-center">Getting to Mannar</h3>
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
                      src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d126406.28095731244!2d79.8711!3d8.9810!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3afc14d9b0b2f3b7%3A0x4b5d8f9068d5e1e0!2sMannar%2C%20Sri%20Lanka!5e0!3m2!1sen!2sus!4v1647887431289!5m2!1sen!2sus"
                      width="100%"
                      height="100%"
                      style={{ border: 0 }}
                      allowFullScreen
                      loading="lazy"
                      referrerPolicy="no-referrer-when-downgrade"
                      title="Mannar Map"
                    ></iframe>
                  </div>
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-semibold mb-2">From Colombo (300 km)</h4>
                      <p className="text-sm text-muted-foreground">
                        • By Car: 4-5 hours via A3 highway<br />
                        • By Bus: 5-6 hours direct service<br />
                        • By Train: Limited service (check schedule)
                      </p>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-2">From Anuradhapura (100 km)</h4>
                      <p className="text-sm text-muted-foreground">
                        • By Car/Van: 1.5-2 hours<br />
                        • By Bus: 2-2.5 hours<br />
                        • Regular connections available
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
                    <h4 className="font-semibold mb-2">Private Transfers</h4>
                    <p className="text-sm">
                      We arrange comfortable air-conditioned vehicles from any location in Sri Lanka. 
                      Ideal for families and groups wanting a hassle-free journey.
                    </p>
                    <Button 
                      className="mt-3 bg-blue-600 hover:bg-blue-700"
                      onClick={() => handleBooking('Private Transfer to Mannar')}
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
                      Bicycle rentals perfect for island exploration
                    </p>
                    <p className="text-sm flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                      Boat services for island hopping adventures
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
            <h3 className="text-3xl font-bold mb-8 text-center">Mannar Gallery</h3>
            <div className="relative rounded-lg overflow-hidden aspect-video max-w-4xl mx-auto">
              <AnimatePresence mode="wait">
                <motion.img
                  key={galleryIndex}
                  src={content.gallery[galleryIndex]}
                  alt={`Mannar gallery image ${galleryIndex + 1}`}
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
              Ready to Explore Mannar's Hidden Treasures?
            </h2>
            <p className="text-xl mb-8 max-w-2xl mx-auto">
              From ancient pearl banks to millions of migratory birds, let us guide you through this unique island experience
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                size="lg" 
                className="bg-white text-blue-600 hover:bg-gray-100"
                onClick={() => handleBooking('Mannar Complete Package')}
              >
                <Phone className="w-5 h-5 mr-2" />
                Book Your Trip
              </Button>
              <Button 
                size="lg" 
                variant="outline"
                className="bg-transparent text-white border-white hover:bg-white/20"
                onClick={() => window.location.href = 'mailto:info@rechargetravels.com?subject=Mannar Inquiry'}
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

export default Mannar;
