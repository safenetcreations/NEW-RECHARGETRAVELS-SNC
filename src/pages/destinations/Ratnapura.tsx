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
  Gem,
  Mountain,
  Trees
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

interface RatnapuraContent {
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

const defaultContent: RatnapuraContent = {
  hero: {
    slides: [
      {
        id: '1',
        image: "https://images.unsplash.com/photo-1601469090980-fc95e8d95544?auto=format&fit=crop&q=80",
        title: "Welcome to Ratnapura",
        subtitle: "The City of Gems"
      },
      {
        id: '2',
        image: "https://images.unsplash.com/photo-1599582909646-9d1c219db59f?auto=format&fit=crop&q=80",
        title: "Gem Mining Heritage",
        subtitle: "Discover Precious Stones"
      },
      {
        id: '3',
        image: "https://images.unsplash.com/photo-1511884642898-4c92249e20b6?auto=format&fit=crop&q=80",
        title: "Rainforest Gateway",
        subtitle: "Explore Sinharaja Reserve"
      }
    ],
    title: "Ratnapura",
    subtitle: "City of Gems with Rainforest Access"
  },
  overview: {
    title: "Why Visit Ratnapura?",
    description: "Ratnapura, literally meaning 'City of Gems', is the gem capital of Sri Lanka and the gateway to the pristine Sinharaja Rainforest. This bustling city has been the center of Sri Lanka's gem trade for centuries, where sapphires, rubies, and other precious stones are mined. Beyond gems, Ratnapura offers access to stunning waterfalls, rainforest adventures, and authentic Sri Lankan culture.",
    highlights: [
      "World-famous gem mines and markets",
      "Gateway to Sinharaja World Heritage Rainforest",
      "Traditional gem cutting and polishing",
      "Bopath Ella and Katugas Ella waterfalls",
      "Adam's Peak pilgrimage starting point",
      "Authentic gem trading experience",
      "Rainforest trekking and birdwatching",
      "Rich biodiversity and endemic species"
    ]
  },
  seo: {
    title: "Ratnapura Sri Lanka - Gem City & Sinharaja Rainforest | Recharge Travels",
    description: "Explore Ratnapura's gem mines, visit Sinharaja rainforest, and discover waterfalls. Experience Sri Lanka's gem capital with expert guides and tours.",
    keywords: "Ratnapura gems, Sinharaja rainforest, gem mining Sri Lanka, Ratnapura waterfalls, gem market, Bopath Ella, Adam's Peak from Ratnapura, gem tours"
  },
  attractions: [
    {
      id: '1',
      name: "Gem Mines & Museums",
      description: "Visit working gem mines to see the mining process and explore museums showcasing Sri Lanka's precious stones including blue sapphires, rubies, and cat's eyes.",
      image: "https://images.unsplash.com/photo-1601469090980-fc95e8d95544?auto=format&fit=crop&q=80",
      category: "Cultural",
      rating: 4.7,
      duration: "2-3 hours",
      price: "From $20",
      highlights: ["Mine Tours", "Gem Museum", "Mining Process", "Precious Stones"]
    },
    {
      id: '2',
      name: "Sinharaja Forest Reserve",
      description: "UNESCO World Heritage rainforest, home to endemic birds, butterflies, and rare wildlife. One of the last remaining primary rainforests in Sri Lanka.",
      image: "https://images.unsplash.com/photo-1511884642898-4c92249e20b6?auto=format&fit=crop&q=80",
      category: "Natural",
      rating: 4.9,
      duration: "Full day",
      price: "From $30",
      highlights: ["Endemic Species", "Rainforest Trek", "Bird Watching", "UNESCO Site"]
    },
    {
      id: '3',
      name: "Bopath Ella Falls",
      description: "A 30-meter waterfall shaped like a Bo tree leaf, surrounded by lush vegetation. Popular for swimming and picnics with easy access.",
      image: "https://images.unsplash.com/photo-1432405972618-c60b0225b8f9?auto=format&fit=crop&q=80",
      category: "Natural",
      rating: 4.5,
      duration: "1-2 hours",
      price: "Free",
      highlights: ["Bo Leaf Shape", "Swimming", "Easy Access", "Photography"]
    },
    {
      id: '4',
      name: "Ratnapura Gem Market",
      description: "The bustling gem trading center where dealers from around the world come to buy precious stones. Watch expert gem traders at work.",
      image: "https://images.unsplash.com/photo-1599582909646-9d1c219db59f?auto=format&fit=crop&q=80",
      category: "Shopping",
      rating: 4.6,
      duration: "2 hours",
      price: "Free to browse",
      highlights: ["Gem Trading", "Local Market", "Authentic Experience", "Gem Dealers"]
    },
    {
      id: '5',
      name: "Katugas Ella Falls",
      description: "A hidden 15-meter waterfall requiring a short jungle trek. Less crowded than other falls, offering a peaceful nature experience.",
      image: "https://images.unsplash.com/photo-1621569896088-46cc0d472c8d?auto=format&fit=crop&q=80",
      category: "Natural",
      rating: 4.4,
      duration: "2-3 hours",
      price: "From $5",
      highlights: ["Hidden Falls", "Jungle Trek", "Natural Pool", "Less Crowded"]
    },
    {
      id: '6',
      name: "Maha Saman Devalaya",
      description: "Sacred temple dedicated to god Saman, the deity of Adam's Peak. Important pilgrimage site with beautiful architecture and religious significance.",
      image: "https://images.unsplash.com/photo-1609920658906-8223bd289001?auto=format&fit=crop&q=80",
      category: "Religious",
      rating: 4.5,
      duration: "1 hour",
      price: "Free",
      highlights: ["Sacred Temple", "Pilgrimage Site", "Architecture", "Religious Art"]
    }
  ],
  activities: [
    {
      id: '1',
      name: "Gem Mine Experience",
      description: "Descend into a working gem mine and try gem washing",
      icon: Gem,
      price: "From $30",
      duration: "3 hours",
      popular: true
    },
    {
      id: '2',
      name: "Sinharaja Trekking",
      description: "Guided rainforest trek with endemic species spotting",
      icon: Trees,
      price: "From $40",
      duration: "Full day",
      popular: true
    },
    {
      id: '3',
      name: "Gem Cutting Workshop",
      description: "Learn traditional gem cutting and polishing techniques",
      icon: Activity,
      price: "From $25",
      duration: "2 hours"
    },
    {
      id: '4',
      name: "Waterfall Expedition",
      description: "Visit multiple waterfalls with swimming opportunities",
      icon: Mountain,
      price: "From $35",
      duration: "Half day"
    },
    {
      id: '5',
      name: "Bird Watching Tour",
      description: "Early morning birding in rainforest edges",
      icon: Camera,
      price: "From $45",
      duration: "4 hours"
    },
    {
      id: '6',
      name: "Night Safari",
      description: "Nocturnal wildlife spotting in forest areas",
      icon: Sunrise,
      price: "From $50",
      duration: "3 hours"
    }
  ],
  itineraries: [
    {
      id: '1',
      title: "Gems & Nature Day Tour",
      duration: "1 Day",
      description: "Experience Ratnapura's famous gems and natural beauty",
      highlights: [
        "Morning gem mine visit and museum",
        "Gem market exploration",
        "Lunch with local cuisine",
        "Afternoon at Bopath Ella Falls",
        "Visit gem cutting workshop"
      ],
      price: "From $75 per person"
    },
    {
      id: '2',
      title: "Ratnapura Discovery",
      duration: "2 Days / 1 Night",
      description: "Comprehensive gem city experience with nature",
      highlights: [
        "Day 1: Gem mines, market, and workshops",
        "Evening temple visit",
        "Day 2: Early morning to Sinharaja",
        "Rainforest trekking",
        "Waterfall visits"
      ],
      price: "From $180 per person"
    },
    {
      id: '3',
      title: "Gems & Rainforest Adventure",
      duration: "3 Days / 2 Nights",
      description: "Deep dive into gems, rainforest, and local culture",
      highlights: [
        "Complete gem industry experience",
        "Full day Sinharaja exploration",
        "Multiple waterfall visits",
        "Night safari experience",
        "Traditional village visit",
        "Adam's Peak preparation tour"
      ],
      price: "From $380 per person"
    }
  ],
  faqs: [
    {
      id: '1',
      question: "Is it safe to buy gems in Ratnapura?",
      answer: "While Ratnapura is the gem capital, tourists should be cautious when purchasing gems. Always buy from licensed dealers, ask for certificates of authenticity, and consider getting an independent appraisal. Our guided tours include visits to reputable dealers only."
    },
    {
      id: '2',
      question: "What's the best time to visit Sinharaja Rainforest?",
      answer: "The best time is from December to April when rainfall is lower. However, as a rainforest, expect some rain year-round. Early mornings (6-10 AM) are best for wildlife spotting. Avoid visiting during heavy monsoon periods (May-July, October-November)."
    },
    {
      id: '3',
      question: "How far is Ratnapura from Colombo?",
      answer: "Ratnapura is about 100 km from Colombo, approximately 2-2.5 hours by car via the Colombo-Ratnapura highway. Public buses are available but take longer (3-4 hours). The journey offers scenic views of rubber plantations and rural landscapes."
    },
    {
      id: '4',
      question: "Can I swim at the waterfalls?",
      answer: "Yes, swimming is possible at Bopath Ella during the dry season when water levels are safe. Always check current conditions and follow local advice. Some waterfalls have designated swimming areas. Never swim during or after heavy rains."
    },
    {
      id: '5',
      question: "Do I need special permits for Sinharaja?",
      answer: "Yes, entry to Sinharaja requires a permit which can be obtained at the entrance. Foreign visitors pay a higher fee than locals. A guide is mandatory for forest treks. We handle all permits and provide experienced guides in our tour packages."
    },
    {
      id: '6',
      question: "What gems are found in Ratnapura?",
      answer: "Ratnapura is famous for blue sapphires, rubies, cat's eyes, alexandrite, topaz, garnet, amethyst, and aquamarine. The area produces some of the world's finest blue sapphires. Star sapphires and padparadscha sapphires are particularly prized."
    }
  ],
  gallery: [
    "https://images.unsplash.com/photo-1601469090980-fc95e8d95544?auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1599582909646-9d1c219db59f?auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1511884642898-4c92249e20b6?auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1432405972618-c60b0225b8f9?auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1621569896088-46cc0d472c8d?auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1609920658906-8223bd289001?auto=format&fit=crop&q=80"
  ],
  travelTips: [
    {
      id: '1',
      title: "Gem Buying Tips",
      icon: Gem,
      tips: [
        "Only buy from licensed dealers",
        "Ask for authenticity certificates",
        "Compare prices at multiple shops",
        "Be wary of street sellers",
        "Consider professional appraisal"
      ]
    },
    {
      id: '2',
      title: "Rainforest Preparation",
      icon: Trees,
      tips: [
        "Wear long pants and closed shoes",
        "Bring insect repellent (DEET)",
        "Carry rain protection always",
        "Hire authorized guides only",
        "Start treks early morning"
      ]
    },
    {
      id: '3',
      title: "Best Time to Visit",
      icon: Calendar,
      tips: [
        "December to April: Less rain",
        "Early mornings for wildlife",
        "Avoid monsoon peaks",
        "Weekdays less crowded",
        "Book Sinharaja permits ahead"
      ]
    }
  ]
};

const Ratnapura = () => {
  const [content, setContent] = useState<RatnapuraContent>(defaultContent);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [selectedTab, setSelectedTab] = useState('attractions');
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [selectedService, setSelectedService] = useState<string>('');
  const [galleryIndex, setGalleryIndex] = useState(0);

  // Load content from Firebase and set up real-time listener
  useEffect(() => {
    const docRef = doc(db, 'destinations', 'ratnapura');
    
    // Set up real-time listener
    const unsubscribe = onSnapshot(docRef, (docSnap) => {
      if (docSnap.exists()) {
        const data = docSnap.data() as RatnapuraContent;
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
    temperature: "22-32°C",
    season: "Tropical with rainfall",
    rainfall: "High (May-Nov), Moderate (Dec-Apr)"
  };

  const destinationInfo: DestinationInfo = {
    population: "52,000",
    area: "20.4 km²",
    elevation: "130m above sea level",
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
    "name": "Ratnapura, Sri Lanka",
    "description": content.overview.description,
    "image": content.hero.slides.map(slide => slide.image),
    "touristType": ["Cultural Tourism", "Nature Tourism", "Shopping Tourism"],
    "geo": {
      "@type": "GeoCoordinates",
      "latitude": "6.7056",
      "longitude": "80.3847"
    },
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": "4.6",
      "reviewCount": "1678"
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
        <meta property="og:url" content="https://rechargetravels.com/destinations/ratnapura" />
        <meta property="og:type" content="website" />
        
        {/* Twitter Card Tags */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={content.seo.title} />
        <meta name="twitter:description" content={content.seo.description} />
        <meta name="twitter:image" content={content.hero.slides[0].image} />
        
        {/* Canonical URL */}
        <link rel="canonical" href="https://rechargetravels.com/destinations/ratnapura" />
        
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
                  onClick={() => handleBooking('Ratnapura Tour Package')}
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
                <Gem className="w-4 h-4" />
                <span>Gem Capital</span>
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
                <h3 className="text-3xl font-bold mb-8 text-center">Top Attractions in Ratnapura</h3>
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
                <h3 className="text-3xl font-bold mb-8 text-center">Things to Do in Ratnapura</h3>
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
                <h3 className="text-3xl font-bold mb-8 text-center">Travel Tips for Ratnapura</h3>
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
            <h3 className="text-3xl font-bold mb-8 text-center">Getting to Ratnapura</h3>
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
                      src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d63479.34658720456!2d80.3647!3d6.7056!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3ae3bf2f6e7f6e7f%3A0x6e6e6e6e6e6e6e6e!2sRatnapura%2C%20Sri%20Lanka!5e0!3m2!1sen!2sus!4v1647887431289!5m2!1sen!2sus"
                      width="100%"
                      height="100%"
                      style={{ border: 0 }}
                      allowFullScreen
                      loading="lazy"
                      referrerPolicy="no-referrer-when-downgrade"
                      title="Ratnapura Map"
                    ></iframe>
                  </div>
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-semibold mb-2">From Colombo (100 km)</h4>
                      <p className="text-sm text-muted-foreground">
                        • By Car: 2-2.5 hours via A4 highway<br />
                        • By Bus: 3-4 hours from Pettah<br />
                        • Private transport recommended
                      </p>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-2">To Sinharaja (25 km)</h4>
                      <p className="text-sm text-muted-foreground">
                        • By Car: 45 minutes to entrance<br />
                        • Arrange transport through hotels<br />
                        • 4WD recommended in rainy season
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
                    <h4 className="font-semibold mb-2">Gem & Nature Tours</h4>
                    <p className="text-sm">
                      Book our guided tours for safe gem shopping and rainforest exploration. 
                      Expert guides and comfortable transport included.
                    </p>
                    <Button 
                      className="mt-3 bg-blue-600 hover:bg-blue-700"
                      onClick={() => handleBooking('Ratnapura Guided Tour')}
                    >
                      Book Tour
                    </Button>
                  </div>
                  <div className="space-y-2">
                    <p className="text-sm flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                      Tuk-tuks available for city tours
                    </p>
                    <p className="text-sm flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                      Private vehicles needed for Sinharaja
                    </p>
                    <p className="text-sm flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                      Walking distance to gem markets
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
            <h3 className="text-3xl font-bold mb-8 text-center">Ratnapura Gallery</h3>
            <div className="relative rounded-lg overflow-hidden aspect-video max-w-4xl mx-auto">
              <AnimatePresence mode="wait">
                <motion.img
                  key={galleryIndex}
                  src={content.gallery[galleryIndex]}
                  alt={`Ratnapura gallery image ${galleryIndex + 1}`}
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
              Ready to Discover Ratnapura's Treasures?
            </h2>
            <p className="text-xl mb-8 max-w-2xl mx-auto">
              From precious gems to pristine rainforests, let us guide you through Sri Lanka's city of gems
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                size="lg" 
                className="bg-white text-blue-600 hover:bg-gray-100"
                onClick={() => handleBooking('Ratnapura Complete Package')}
              >
                <Phone className="w-5 h-5 mr-2" />
                Book Your Trip
              </Button>
              <Button 
                size="lg" 
                variant="outline"
                className="bg-transparent text-white border-white hover:bg-white/20"
                onClick={() => window.location.href = 'mailto:info@rechargetravels.com?subject=Ratnapura Inquiry'}
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

export default Ratnapura;
