import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Landmark, 
  Sun, 
  MapPin,
  Calendar,
  Clock,
  Star,
  Mountain,
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
  TreePalm,
  Building,
  Crown,
  Map,
  ChevronDown,
  Phone,
  Mail,
  CheckCircle,
  ChevronRight,
  Globe,
  Heart,
  Bike,
  History,
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

interface PolonnaruwaContent {
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

const defaultContent: PolonnaruwaContent = {
  hero: {
    slides: [
      {
        id: '1',
        image: "https://images.unsplash.com/photo-1588598198321-9735fd4f2b45?auto=format&fit=crop&q=80",
        title: "Ancient Kingdom of Polonnaruwa",
        subtitle: "UNESCO World Heritage Site Since 1982"
      },
      {
        id: '2',
        image: "https://images.unsplash.com/photo-1609920658906-8223bd289001?auto=format&fit=crop&q=80",
        title: "Medieval Capital",
        subtitle: "11th-13th Century Royal City"
      },
      {
        id: '3',
        image: "https://images.unsplash.com/photo-1624296398627-22e8db73fbdb?auto=format&fit=crop&q=80",
        title: "Archaeological Wonder",
        subtitle: "Where History Comes Alive"
      }
    ],
    title: "Polonnaruwa",
    subtitle: "Journey Through Sri Lanka's Medieval Capital"
  },
  overview: {
    title: "Why Visit Polonnaruwa?",
    description: "Polonnaruwa, the second ancient capital of Sri Lanka, stands as a magnificent testament to the island's golden age of architecture and irrigation. This UNESCO World Heritage Site showcases the ruins of the medieval capital established by King Vijayabahu I in 1070 AD. The city flourished under King Parakramabahu I, who built an extensive irrigation system including the massive Parakrama Samudra. Today, visitors can explore well-preserved ruins, ancient temples, and colossal Buddha statues that tell the story of a sophisticated civilization.",
    highlights: [
      "UNESCO World Heritage Site with ancient ruins",
      "Gal Vihara - Rock temple with Buddha statues",
      "Royal Palace complex and audience hall",
      "Parakrama Samudra - Ancient man-made reservoir",
      "Vatadage - Circular relic house",
      "Rankoth Vehera - Golden pinnacle stupa",
      "Archaeological Museum with artifacts",
      "Sacred Quadrangle with multiple temples"
    ]
  },
  seo: {
    title: "Polonnaruwa Ancient City Sri Lanka - UNESCO Heritage Site Tours | Recharge Travels",
    description: "Explore Polonnaruwa, Sri Lanka's medieval capital and UNESCO World Heritage Site. Discover ancient ruins, Buddha statues, and royal palaces with expert guided tours from Recharge Travels.",
    keywords: "Polonnaruwa ancient city, UNESCO World Heritage Sri Lanka, Gal Vihara Buddha statues, Parakrama Samudra, Polonnaruwa tours, medieval capital Sri Lanka, archaeological sites, Vatadage Polonnaruwa"
  },
  attractions: [
    {
      id: '1',
      name: "Gal Vihara",
      description: "A rock temple featuring four magnificent Buddha statues carved from a single granite wall, considered the pinnacle of Sinhalese rock carving. The standing, seated, and reclining Buddha figures showcase extraordinary artistic detail.",
      image: "https://images.unsplash.com/photo-1609920658906-8223bd289001?auto=format&fit=crop&q=80",
      category: "Religious",
      rating: 4.9,
      duration: "1-2 hours",
      price: "Included in site ticket",
      highlights: ["Rock Carvings", "4 Buddha Statues", "12th Century Art", "UNESCO Monument"]
    },
    {
      id: '2',
      name: "Royal Palace Complex",
      description: "The ruins of King Parakramabahu's palace, originally seven stories high with 1,000 rooms. The audience hall with its elephant carvings and the council chamber showcase royal grandeur.",
      image: "https://images.unsplash.com/photo-1588598198321-9735fd4f2b45?auto=format&fit=crop&q=80",
      category: "Historical",
      rating: 4.7,
      duration: "1-1.5 hours",
      price: "Included in site ticket",
      highlights: ["Royal Architecture", "Audience Hall", "Council Chamber", "Ancient Ruins"]
    },
    {
      id: '3',
      name: "Sacred Quadrangle (Dalada Maluwa)",
      description: "A compact group of ancient religious monuments including the Vatadage, Hatadage, and Atadage. This raised platform contains some of the most sacred and architecturally significant structures.",
      image: "https://images.unsplash.com/photo-1624296398627-22e8db73fbdb?auto=format&fit=crop&q=80",
      category: "Religious",
      rating: 4.8,
      duration: "1.5-2 hours",
      price: "Included in site ticket",
      highlights: ["Vatadage", "Tooth Relic Temples", "Stone Inscriptions", "Sacred Architecture"]
    },
    {
      id: '4',
      name: "Parakrama Samudra",
      description: "A massive man-made reservoir built by King Parakramabahu I, covering 2,500 hectares. This ancient irrigation marvel still provides water for cultivation and is perfect for sunset views.",
      image: "https://images.unsplash.com/photo-1596040033550-d0c85b8c8b23?auto=format&fit=crop&q=80",
      category: "Engineering",
      rating: 4.6,
      duration: "30-45 minutes",
      price: "Free",
      highlights: ["Ancient Reservoir", "Sunset Views", "Engineering Marvel", "Birdwatching"]
    },
    {
      id: '5',
      name: "Rankoth Vehera",
      description: "The largest stupa in Polonnaruwa, standing 54 meters high. Built by King Nissanka Malla, it follows the architectural style of Anuradhapura period stupas.",
      image: "https://images.unsplash.com/photo-1552841833-f7248b8f5b59?auto=format&fit=crop&q=80",
      category: "Religious",
      rating: 4.5,
      duration: "30-45 minutes",
      price: "Included in site ticket",
      highlights: ["Golden Pinnacle", "4th Largest Stupa", "12th Century", "Buddhist Architecture"]
    },
    {
      id: '6',
      name: "Archaeological Museum",
      description: "Houses artifacts discovered from Polonnaruwa including sculptures, inscriptions, and everyday objects that provide insights into medieval life in the ancient capital.",
      image: "https://images.unsplash.com/photo-1575387873341-dc6809fc860f?auto=format&fit=crop&q=80",
      category: "Museum",
      rating: 4.4,
      duration: "1 hour",
      price: "From $3",
      highlights: ["Ancient Artifacts", "Bronze Statues", "Model City", "Historical Context"]
    }
  ],
  activities: [
    {
      id: '1',
      name: "Guided Archaeological Tour",
      description: "Expert-led tour covering all major monuments with historical insights",
      icon: History,
      price: "From $25",
      duration: "Half day",
      popular: true
    },
    {
      id: '2',
      name: "Cycling Tour",
      description: "Explore the ancient city on bicycle, covering more ground comfortably",
      icon: Bike,
      price: "From $15",
      duration: "3-4 hours",
      popular: true
    },
    {
      id: '3',
      name: "Sunrise Photography",
      description: "Early morning photo tour capturing monuments in golden light",
      icon: Camera,
      price: "From $40",
      duration: "3 hours"
    },
    {
      id: '4',
      name: "Traditional Village Tour",
      description: "Visit nearby villages to experience rural life and traditional crafts",
      icon: Users,
      price: "From $30",
      duration: "Half day"
    },
    {
      id: '5',
      name: "Minneriya Safari",
      description: "Afternoon elephant safari at nearby Minneriya National Park",
      icon: Mountain,
      price: "From $45",
      duration: "4 hours"
    },
    {
      id: '6',
      name: "Night Museum Tour",
      description: "Special evening tour of illuminated monuments (seasonal)",
      icon: Sparkles,
      price: "From $35",
      duration: "2 hours"
    }
  ],
  itineraries: [
    {
      id: '1',
      title: "Polonnaruwa Heritage Day Tour",
      duration: "1 Day",
      description: "Comprehensive tour of the ancient city's main attractions",
      highlights: [
        "Early morning start to beat the heat",
        "Royal Palace and Council Chamber",
        "Sacred Quadrangle exploration",
        "Gal Vihara Buddha statues",
        "Traditional Sri Lankan lunch",
        "Parakrama Samudra sunset"
      ],
      price: "From $60 per person"
    },
    {
      id: '2',
      title: "Ancient Capitals Combo",
      duration: "2 Days / 1 Night",
      description: "Explore both Polonnaruwa and nearby Sigiriya Rock Fortress",
      highlights: [
        "Day 1: Complete Polonnaruwa tour with museum",
        "Evening: Traditional dance performance",
        "Day 2: Early morning Sigiriya climb",
        "Dambulla Cave Temple visit",
        "Village safari and lunch",
        "Return via spice garden"
      ],
      price: "From $180 per person"
    },
    {
      id: '3',
      title: "Cultural Triangle Explorer",
      duration: "3 Days / 2 Nights",
      description: "In-depth exploration of Polonnaruwa and surrounding heritage sites",
      highlights: [
        "Detailed Polonnaruwa exploration with expert guide",
        "Minneriya National Park elephant safari",
        "Sigiriya and Pidurangala rocks",
        "Dambulla Cave Temples",
        "Traditional village experiences",
        "Ancient irrigation system tour"
      ],
      price: "From $350 per person"
    }
  ],
  faqs: [
    {
      id: '1',
      question: "What is the best time to visit Polonnaruwa?",
      answer: "The best time to visit is from January to April and July to September when rainfall is minimal. Early morning (6-10 AM) or late afternoon (3-6 PM) visits are recommended to avoid the midday heat. The site opens at 7 AM daily."
    },
    {
      id: '2',
      question: "How much time do I need to explore Polonnaruwa properly?",
      answer: "A minimum of 3-4 hours is needed to see the main attractions. For a comprehensive visit including the museum, plan for 5-6 hours. Cycling can help cover more ground efficiently. Many visitors combine Polonnaruwa with nearby attractions for a full day trip."
    },
    {
      id: '3',
      question: "What is the entrance fee for Polonnaruwa?",
      answer: "Foreign adults pay $25 USD (or LKR equivalent) for the site ticket, which covers all monuments within the archaeological site. Children under 12 enter at half price. The museum has a separate small fee. Tickets are valid for one day only."
    },
    {
      id: '4',
      question: "Can I hire a guide at Polonnaruwa?",
      answer: "Yes, licensed guides are available at the entrance. Official guides charge around $20-30 for a 3-hour tour. Having a guide greatly enhances the experience as they provide historical context and point out details you might miss. Book through your hotel or at the ticket office."
    },
    {
      id: '5',
      question: "What should I wear when visiting Polonnaruwa?",
      answer: "Wear comfortable walking shoes, light-colored loose clothing, and a hat. When entering sacred sites like Vatadage, you must remove shoes and hats. Shoulders and knees should be covered at religious monuments. Bring sunscreen and water as shade is limited."
    },
    {
      id: '6',
      question: "Is photography allowed at Polonnaruwa?",
      answer: "Photography is allowed at most sites for personal use. However, flash photography is prohibited inside museums, and you cannot photograph with your back to Buddha statues (considered disrespectful). Drone photography requires special permission. Commercial photography needs permits."
    }
  ],
  gallery: [
    "https://images.unsplash.com/photo-1588598198321-9735fd4f2b45?auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1609920658906-8223bd289001?auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1624296398627-22e8db73fbdb?auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1552841833-f7248b8f5b59?auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1596040033550-d0c85b8c8b23?auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1575387873341-dc6809fc860f?auto=format&fit=crop&q=80"
  ],
  travelTips: [
    {
      id: '1',
      title: "Best Time to Visit",
      icon: Calendar,
      tips: [
        "January to April: Dry season, ideal weather",
        "July to September: Less rain, good visibility",
        "Early morning: Cooler temperatures, better photos",
        "Avoid weekends and holidays for fewer crowds"
      ]
    },
    {
      id: '2',
      title: "What to Bring",
      icon: Sun,
      tips: [
        "Plenty of water (limited shops inside)",
        "Sun protection: hat, sunscreen, sunglasses",
        "Comfortable walking shoes",
        "Sarong/shawl for temple visits",
        "Insect repellent for evening visits",
        "Camera with extra batteries"
      ]
    },
    {
      id: '3',
      title: "Site Etiquette",
      icon: Users,
      tips: [
        "Remove shoes and hats at sacred sites",
        "Don't turn back to Buddha statues for photos",
        "Dress modestly covering shoulders and knees",
        "Don't climb on ruins or monuments",
        "Keep voices low at religious sites",
        "Follow guide instructions and signs"
      ]
    }
  ]
};

const Polonnaruwa = () => {
  const [content, setContent] = useState<PolonnaruwaContent>(defaultContent);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [selectedTab, setSelectedTab] = useState('attractions');
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [selectedService, setSelectedService] = useState<string>('');
  const [galleryIndex, setGalleryIndex] = useState(0);

  // Load content from Firebase and set up real-time listener
  useEffect(() => {
    const docRef = doc(db, 'destinations', 'polonnaruwa');
    
    // Set up real-time listener
    const unsubscribe = onSnapshot(docRef, (docSnap) => {
      if (docSnap.exists()) {
        const data = docSnap.data() as PolonnaruwaContent;
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
    temperature: "24-33°C",
    season: "Dry zone climate",
    rainfall: "Low (Feb-Sep), Moderate (Oct-Jan)"
  };

  const destinationInfo: DestinationInfo = {
    population: "15,000",
    area: "122 km²",
    elevation: "50-100m",
    bestTime: "January to September",
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
    "name": "Polonnaruwa, Sri Lanka",
    "description": content.overview.description,
    "image": content.hero.slides.map(slide => slide.image),
    "touristType": ["Cultural Tourism", "Archaeological Sites", "Heritage Tourism"],
    "geo": {
      "@type": "GeoCoordinates",
      "latitude": "7.9403",
      "longitude": "81.0188"
    },
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": "4.8",
      "reviewCount": "3567"
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
        <meta property="og:url" content="https://recharge-travels-73e76.web.app/destinations/polonnaruwa" />
        <meta property="og:type" content="website" />
        
        {/* Twitter Card Tags */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={content.seo.title} />
        <meta name="twitter:description" content={content.seo.description} />
        <meta name="twitter:image" content={content.hero.slides[0].image} />
        
        {/* Canonical URL */}
        <link rel="canonical" href="https://recharge-travels-73e76.web.app/destinations/polonnaruwa" />
        
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
                  onClick={() => handleBooking('Polonnaruwa Tour Package')}
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
                <Landmark className="w-4 h-4" />
                <span>UNESCO Site: Since 1982</span>
              </div>
              <div className="flex items-center gap-2">
                <Sun className="w-4 h-4" />
                <span>Climate: {weatherInfo.temperature}</span>
              </div>
              <div className="flex items-center gap-2">
                <Crown className="w-4 h-4" />
                <span>Medieval Capital: 1070-1232 AD</span>
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
                <h3 className="text-3xl font-bold mb-8 text-center">Top Attractions in Polonnaruwa</h3>
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
                <h3 className="text-3xl font-bold mb-8 text-center">Things to Do in Polonnaruwa</h3>
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
                <h3 className="text-3xl font-bold mb-8 text-center">Travel Tips for Polonnaruwa</h3>
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
            <h3 className="text-3xl font-bold mb-8 text-center">Getting to Polonnaruwa</h3>
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
                      src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d63287.30830507937!2d80.9829!3d7.9403!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3afb44ba3b16ce27%3A0x3b87d96e2a1d4f3f!2sPolonnaruwa%2C%20Sri%20Lanka!5e0!3m2!1sen!2sus!4v1647887431289!5m2!1sen!2sus"
                      width="100%"
                      height="100%"
                      style={{ border: 0 }}
                      allowFullScreen
                      loading="lazy"
                      referrerPolicy="no-referrer-when-downgrade"
                      title="Polonnaruwa Map"
                    ></iframe>
                  </div>
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-semibold mb-2">From Colombo (230 km)</h4>
                      <p className="text-sm text-muted-foreground">
                        • By Car: 4-5 hours via A1 highway<br />
                        • By Bus: 5-6 hours direct service<br />
                        • By Train: To Habarana, then bus (6 hours total)
                      </p>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-2">From Kandy (100 km)</h4>
                      <p className="text-sm text-muted-foreground">
                        • By Car/Van: 2.5-3 hours<br />
                        • By Bus: 3-4 hours<br />
                        • Via Dambulla for combined tour
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
                    <h4 className="font-semibold mb-2">Cultural Triangle Tours</h4>
                    <p className="text-sm">
                      Combine Polonnaruwa with Sigiriya and Dambulla in our special Cultural Triangle package. 
                      Includes transport, guide, and entrance tickets.
                    </p>
                    <Button 
                      className="mt-3 bg-blue-600 hover:bg-blue-700"
                      onClick={() => handleBooking('Cultural Triangle Tour Package')}
                    >
                      Book Package
                    </Button>
                  </div>
                  <div className="space-y-2">
                    <p className="text-sm flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                      Bicycle rentals available at entrance (recommended)
                    </p>
                    <p className="text-sm flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                      Tuk-tuk tours available for elderly visitors
                    </p>
                    <p className="text-sm flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                      Licensed guides available at ticket office
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
            <h3 className="text-3xl font-bold mb-8 text-center">Polonnaruwa Gallery</h3>
            <div className="relative rounded-lg overflow-hidden aspect-video max-w-4xl mx-auto">
              <AnimatePresence mode="wait">
                <motion.img
                  key={galleryIndex}
                  src={content.gallery[galleryIndex]}
                  alt={`Polonnaruwa gallery image ${galleryIndex + 1}`}
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
              Ready to Walk Through History?
            </h2>
            <p className="text-xl mb-8 max-w-2xl mx-auto">
              Explore the magnificent ruins of Sri Lanka's medieval capital with our expert guides and comfortable tours
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                size="lg" 
                className="bg-white text-blue-600 hover:bg-gray-100"
                onClick={() => handleBooking('Polonnaruwa Complete Package')}
              >
                <Phone className="w-5 h-5 mr-2" />
                Book Your Tour
              </Button>
              <Button 
                size="lg" 
                variant="outline"
                className="bg-transparent text-white border-white hover:bg-white/20"
                onClick={() => window.location.href = 'mailto:info@rechargetravels.com?subject=Polonnaruwa Inquiry'}
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

export default Polonnaruwa;
