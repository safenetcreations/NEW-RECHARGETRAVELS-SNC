import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Building, 
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
  Crown,
  Church,
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
  Sparkles,
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

interface AnuradhapuraContent {
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

const defaultContent: AnuradhapuraContent = {
  hero: {
    slides: [
      {
        id: '1',
        image: "https://images.unsplash.com/photo-1588002013238-64f0e1a8f6cf?auto=format&fit=crop&q=80",
        title: "Sacred City of Anuradhapura",
        subtitle: "UNESCO World Heritage Site & Ancient Capital"
      },
      {
        id: '2',
        image: "https://images.unsplash.com/photo-1624287532544-c5fc3c7a4d87?auto=format&fit=crop&q=80",
        title: "Cradle of Buddhism",
        subtitle: "2,500 Years of Sacred Heritage"
      },
      {
        id: '3',
        image: "https://images.unsplash.com/photo-1610109703742-6e5c8b1a4871?auto=format&fit=crop&q=80",
        title: "Living Ancient City",
        subtitle: "Where Pilgrims Meet History"
      }
    ],
    title: "Anuradhapura",
    subtitle: "Discover Sri Lanka's First Ancient Capital"
  },
  overview: {
    title: "Why Visit Anuradhapura?",
    description: "Anuradhapura, one of the oldest continuously inhabited cities in the world, served as Sri Lanka's capital for over 1,300 years. This sacred city is the cradle of Buddhism in Sri Lanka, home to the Sri Maha Bodhi - a sacred fig tree grown from a cutting of the original tree under which Buddha attained enlightenment. The UNESCO World Heritage Site encompasses massive dagobas (stupas), ancient pools, crumbling temples, and monasteries spread across 40 square kilometers, making it one of the most extensive ruins in the world.",
    highlights: [
      "Sri Maha Bodhi - World's oldest documented tree",
      "Ruwanwelisaya - Magnificent white dagoba",
      "Jetavanaramaya - Once world's tallest structure",
      "Sacred Eight Places (Atamasthana)",
      "Ancient irrigation systems and tanks",
      "Mihintale - Birthplace of Buddhism in Sri Lanka",
      "Archaeological Museum treasures",
      "Active pilgrimage site with living traditions"
    ]
  },
  seo: {
    title: "Anuradhapura Ancient City Sri Lanka - Sacred Buddhist Sites & Tours | Recharge Travels",
    description: "Visit Anuradhapura, Sri Lanka's first capital and sacred Buddhist city. Explore ancient dagobas, Sri Maha Bodhi tree, and UNESCO heritage sites with expert guides from Recharge Travels.",
    keywords: "Anuradhapura ancient city, Sri Maha Bodhi tree, Ruwanwelisaya dagoba, Buddhist pilgrimage Sri Lanka, UNESCO World Heritage, Jetavanaramaya stupa, Anuradhapura tours, sacred city Sri Lanka"
  },
  attractions: [
    {
      id: '1',
      name: "Sri Maha Bodhi",
      description: "The sacred fig tree grown from a cutting of the original Bodhi tree in India under which Buddha attained enlightenment. At over 2,300 years old, it's the oldest documented tree in the world and Sri Lanka's most sacred site.",
      image: "https://images.unsplash.com/photo-1610109703742-6e5c8b1a4871?auto=format&fit=crop&q=80",
      category: "Sacred Site",
      rating: 5.0,
      duration: "1-2 hours",
      price: "Donation",
      highlights: ["2,300+ Years Old", "Most Sacred Site", "Buddhist Pilgrimage", "Golden Fence"]
    },
    {
      id: '2',
      name: "Ruwanwelisaya",
      description: "This magnificent white dagoba built by King Dutugemunu in 140 BC is one of the world's tallest monuments. The perfectly proportioned stupa is surrounded by elephant wall carvings and is an active worship site.",
      image: "https://images.unsplash.com/photo-1588002013238-64f0e1a8f6cf?auto=format&fit=crop&q=80",
      category: "Religious",
      rating: 4.9,
      duration: "1-1.5 hours",
      price: "Free",
      highlights: ["Great Stupa", "Elephant Wall", "Active Worship", "2nd Century BC"]
    },
    {
      id: '3',
      name: "Jetavanaramaya",
      description: "Once the world's third tallest structure after the pyramids of Giza, this massive brick stupa stands 122 meters tall. Built in the 3rd century, it represents ancient engineering excellence.",
      image: "https://images.unsplash.com/photo-1552742882-6de5f0852c79?auto=format&fit=crop&q=80",
      category: "Archaeological",
      rating: 4.8,
      duration: "45 minutes",
      price: "Included in ticket",
      highlights: ["Ancient Skyscraper", "93 Million Bricks", "Engineering Marvel", "3rd Century"]
    },
    {
      id: '4',
      name: "Mihintale",
      description: "The mountain peak where Buddhism was introduced to Sri Lanka in 247 BC. Climb 1,840 granite steps to reach ancient monuments, caves, and stupas with panoramic views.",
      image: "https://images.unsplash.com/photo-1624287532544-c5fc3c7a4d87?auto=format&fit=crop&q=80",
      category: "Sacred Mountain",
      rating: 4.7,
      duration: "2-3 hours",
      price: "From $3",
      highlights: ["Buddhist Introduction Site", "1,840 Steps", "Mountain Monastery", "Panoramic Views"]
    },
    {
      id: '5',
      name: "Abhayagiri Monastery",
      description: "Once home to 5,000 monks, this vast monastic complex includes a 75-meter stupa, moonstone carvings, guardstones, and the famous Samadhi Buddha statue in deep meditation.",
      image: "https://images.unsplash.com/photo-1552841865-5e7c642a0191?auto=format&fit=crop&q=80",
      category: "Monastery",
      rating: 4.6,
      duration: "1.5-2 hours",
      price: "Included in ticket",
      highlights: ["Monastic Complex", "Samadhi Buddha", "Moonstone", "Ancient Library"]
    },
    {
      id: '6',
      name: "Twin Ponds (Kuttam Pokuna)",
      description: "These ancient bathing pools showcase sophisticated hydraulic engineering with underground water supply systems. The geometric precision and decorative elements are remarkable.",
      image: "https://images.unsplash.com/photo-1596040033550-d0c85b8c8b23?auto=format&fit=crop&q=80",
      category: "Engineering",
      rating: 4.5,
      duration: "30 minutes",
      price: "Included in ticket",
      highlights: ["Ancient Pools", "Hydraulic System", "Geometric Design", "6th Century"]
    }
  ],
  activities: [
    {
      id: '1',
      name: "Sacred Sites Pilgrimage",
      description: "Visit the eight sacred places (Atamasthana) with a knowledgeable guide",
      icon: Church,
      price: "From $30",
      duration: "Full day",
      popular: true
    },
    {
      id: '2',
      name: "Cycling Tour",
      description: "Explore the vast ancient city by bicycle with expert guides",
      icon: Bike,
      price: "From $20",
      duration: "Half day",
      popular: true
    },
    {
      id: '3',
      name: "Sunrise at Mihintale",
      description: "Early morning climb to witness sunrise from the sacred mountain",
      icon: Sunrise,
      price: "From $25",
      duration: "4 hours"
    },
    {
      id: '4',
      name: "Archaeological Tour",
      description: "In-depth exploration of ruins with archaeology expert",
      icon: History,
      price: "From $40",
      duration: "Half day"
    },
    {
      id: '5',
      name: "Buddhist Meditation",
      description: "Meditation session at ancient monastery sites",
      icon: Sparkles,
      price: "From $15",
      duration: "2 hours"
    },
    {
      id: '6',
      name: "Full Moon Ceremony",
      description: "Join pilgrims for special full moon day observances",
      icon: Crown,
      price: "Free",
      duration: "Evening"
    }
  ],
  itineraries: [
    {
      id: '1',
      title: "Anuradhapura Sacred Day Tour",
      duration: "1 Day",
      description: "Essential sacred sites and major dagobas in one comprehensive day",
      highlights: [
        "Sri Maha Bodhi tree blessing ceremony",
        "Ruwanwelisaya and Jetavanaramaya stupas",
        "Abhayagiri monastery complex",
        "Traditional Buddhist lunch",
        "Twin Ponds and Moonstone site",
        "Archaeological Museum visit"
      ],
      price: "From $70 per person"
    },
    {
      id: '2',
      title: "Ancient Capitals Heritage",
      duration: "2 Days / 1 Night",
      description: "Combine Anuradhapura with Mihintale and surrounding sites",
      highlights: [
        "Day 1: Complete Anuradhapura sacred circuit",
        "Evening: Sunset at ancient reservoir",
        "Day 2: Mihintale mountain pilgrimage",
        "Visit Aukana Buddha statue",
        "Explore ancient irrigation systems",
        "Traditional village lunch"
      ],
      price: "From $200 per person"
    },
    {
      id: '3',
      title: "Buddhist Pilgrimage Journey",
      duration: "3 Days / 2 Nights",
      description: "Comprehensive spiritual journey through Buddhism's cradle in Sri Lanka",
      highlights: [
        "All eight sacred places (Atamasthana)",
        "Meditation sessions at monasteries",
        "Full moon ceremony participation",
        "Mihintale complete exploration",
        "Ancient tanks and irrigation tour",
        "Meetings with Buddhist monks",
        "Traditional alms giving ceremony"
      ],
      price: "From $380 per person"
    }
  ],
  faqs: [
    {
      id: '1',
      question: "What is the best time to visit Anuradhapura?",
      answer: "The best time is from February to September when rainfall is minimal. Avoid December and January due to heavy rains. Full moon (Poya) days are special but crowded. Early morning visits (starting at 6 AM) are ideal to avoid heat and crowds. The site is open from sunrise to sunset daily."
    },
    {
      id: '2',
      question: "How should I dress when visiting sacred sites?",
      answer: "Modest dress is essential. Cover shoulders and knees, remove shoes and hats at sacred sites. White clothing is preferred for Sri Maha Bodhi and dagobas. Avoid shorts, sleeveless tops, and tight clothing. Bring socks as ground can be hot. Photography with back to Buddha statues is forbidden."
    },
    {
      id: '3',
      question: "How much area does Anuradhapura cover?",
      answer: "The ancient city covers about 40 square kilometers with monuments spread across a vast area. Walking is challenging due to distances and heat. Bicycles (available for rent) or tuk-tuks are recommended. A vehicle with driver is most comfortable. Plan at least a full day for major sites."
    },
    {
      id: '4',
      question: "What are the entrance fees?",
      answer: "Foreign adults pay $25 USD for a day ticket covering most archaeological sites. Sri Maha Bodhi has no fee but donations are welcome. Mihintale charges separately ($3). Some sites like Ruwanwelisaya are free. Children under 12 get 50% discount. Tickets available at the archaeological museum."
    },
    {
      id: '5',
      question: "Can I visit Anuradhapura and Polonnaruwa in one day?",
      answer: "While possible, it's not recommended. Both cities deserve full days. They're 100km apart (2-hour drive). If you must, start very early, visit key sites in each, but you'll miss much. Better to stay overnight and properly explore both ancient capitals. Consider our 2-day package covering both."
    },
    {
      id: '6',
      question: "What facilities are available at the site?",
      answer: "Basic facilities include toilets at major sites, small shops for water/snacks, and shaded rest areas. The archaeological museum has good facilities. Restaurants are outside the sacred area. Bring water, snacks, sunscreen, and hat. Wheelchair access is limited. First aid available at museum."
    }
  ],
  gallery: [
    "https://images.unsplash.com/photo-1588002013238-64f0e1a8f6cf?auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1610109703742-6e5c8b1a4871?auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1624287532544-c5fc3c7a4d87?auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1552742882-6de5f0852c79?auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1552841865-5e7c642a0191?auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1596040033550-d0c85b8c8b23?auto=format&fit=crop&q=80"
  ],
  travelTips: [
    {
      id: '1',
      title: "Best Time to Visit",
      icon: Calendar,
      tips: [
        "February to September: Dry season",
        "Early morning: 6-10 AM best timing",
        "Full moon days: Special but crowded",
        "Avoid December-January monsoon"
      ]
    },
    {
      id: '2',
      title: "What to Bring",
      icon: Sun,
      tips: [
        "Modest clothing covering knees/shoulders",
        "Comfortable walking shoes and socks",
        "Sun protection: hat, sunscreen, umbrella",
        "Water bottles (stay hydrated)",
        "Small denominations for donations",
        "Sarong or shawl for temples"
      ]
    },
    {
      id: '3',
      title: "Sacred Site Etiquette",
      icon: Church,
      tips: [
        "Remove shoes and hats at sacred sites",
        "Walk clockwise around dagobas",
        "No photography with back to Buddha",
        "Maintain silence at worship areas",
        "Don't point feet toward sacred objects",
        "Ask permission before photographing monks"
      ]
    }
  ]
};

const Anuradhapura = () => {
  const [content, setContent] = useState<AnuradhapuraContent>(defaultContent);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [selectedTab, setSelectedTab] = useState('attractions');
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [selectedService, setSelectedService] = useState<string>('');
  const [galleryIndex, setGalleryIndex] = useState(0);

  // Load content from Firebase and set up real-time listener
  useEffect(() => {
    const docRef = doc(db, 'destinations', 'anuradhapura');
    
    // Set up real-time listener
    const unsubscribe = onSnapshot(docRef, (docSnap) => {
      if (docSnap.exists()) {
        const data = docSnap.data() as AnuradhapuraContent;
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
    rainfall: "Low (Feb-Sep), High (Oct-Jan)"
  };

  const destinationInfo: DestinationInfo = {
    population: "50,000",
    area: "40 km² (Sacred Area)",
    elevation: "81m above sea level",
    bestTime: "February to September",
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
    "name": "Anuradhapura, Sri Lanka",
    "description": content.overview.description,
    "image": content.hero.slides.map(slide => slide.image),
    "touristType": ["Religious Tourism", "Cultural Tourism", "Archaeological Sites"],
    "geo": {
      "@type": "GeoCoordinates",
      "latitude": "8.3114",
      "longitude": "80.4037"
    },
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": "4.9",
      "reviewCount": "4523"
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
        <meta property="og:url" content="https://recharge-travels-73e76.web.app/destinations/anuradhapura" />
        <meta property="og:type" content="website" />
        
        {/* Twitter Card Tags */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={content.seo.title} />
        <meta name="twitter:description" content={content.seo.description} />
        <meta name="twitter:image" content={content.hero.slides[0].image} />
        
        {/* Canonical URL */}
        <link rel="canonical" href="https://recharge-travels-73e76.web.app/destinations/anuradhapura" />
        
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
                  onClick={() => handleBooking('Anuradhapura Tour Package')}
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
                <Building className="w-4 h-4" />
                <span>UNESCO Site: Since 1982</span>
              </div>
              <div className="flex items-center gap-2">
                <Sun className="w-4 h-4" />
                <span>Climate: {weatherInfo.temperature}</span>
              </div>
              <div className="flex items-center gap-2">
                <Crown className="w-4 h-4" />
                <span>Ancient Capital: 377 BC - 1017 AD</span>
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
                <h3 className="text-3xl font-bold mb-8 text-center">Top Attractions in Anuradhapura</h3>
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
                <h3 className="text-3xl font-bold mb-8 text-center">Things to Do in Anuradhapura</h3>
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
                <h3 className="text-3xl font-bold mb-8 text-center">Travel Tips for Anuradhapura</h3>
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
            <h3 className="text-3xl font-bold mb-8 text-center">Getting to Anuradhapura</h3>
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
                      src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d63220.21847477159!2d80.3703!3d8.3114!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3afcf4f99c77ad51%3A0x1c87e7db9e8b0a32!2sAnuradhapura%2C%20Sri%20Lanka!5e0!3m2!1sen!2sus!4v1647887431289!5m2!1sen!2sus"
                      width="100%"
                      height="100%"
                      style={{ border: 0 }}
                      allowFullScreen
                      loading="lazy"
                      referrerPolicy="no-referrer-when-downgrade"
                      title="Anuradhapura Map"
                    ></iframe>
                  </div>
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-semibold mb-2">From Colombo (200 km)</h4>
                      <p className="text-sm text-muted-foreground">
                        • By Car: 3.5-4 hours via A1/A6<br />
                        • By Train: 4-5 hours direct service<br />
                        • By Bus: 4-5 hours via CTB/Private
                      </p>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-2">From Kandy (140 km)</h4>
                      <p className="text-sm text-muted-foreground">
                        • By Car/Van: 2.5-3 hours<br />
                        • By Bus: 3-4 hours<br />
                        • Via Dambulla and Habarana
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
                    <h4 className="font-semibold mb-2">Sacred City Tours</h4>
                    <p className="text-sm">
                      Our comprehensive tours include transport, expert guides, and bicycle rental. 
                      Visit all eight sacred places with historical insights and spiritual guidance.
                    </p>
                    <Button 
                      className="mt-3 bg-blue-600 hover:bg-blue-700"
                      onClick={() => handleBooking('Anuradhapura Sacred City Tour')}
                    >
                      Book Sacred Tour
                    </Button>
                  </div>
                  <div className="space-y-2">
                    <p className="text-sm flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                      Bicycle rental highly recommended (available at entrance)
                    </p>
                    <p className="text-sm flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                      Licensed guides enhance the experience significantly
                    </p>
                    <p className="text-sm flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                      Tuk-tuk tours available for elderly or disabled visitors
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
            <h3 className="text-3xl font-bold mb-8 text-center">Anuradhapura Gallery</h3>
            <div className="relative rounded-lg overflow-hidden aspect-video max-w-4xl mx-auto">
              <AnimatePresence mode="wait">
                <motion.img
                  key={galleryIndex}
                  src={content.gallery[galleryIndex]}
                  alt={`Anuradhapura gallery image ${galleryIndex + 1}`}
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
              Ready to Explore the Sacred City?
            </h2>
            <p className="text-xl mb-8 max-w-2xl mx-auto">
              Walk in the footsteps of ancient kings and pilgrims through 2,500 years of Buddhist heritage
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                size="lg" 
                className="bg-white text-blue-600 hover:bg-gray-100"
                onClick={() => handleBooking('Anuradhapura Complete Package')}
              >
                <Phone className="w-5 h-5 mr-2" />
                Book Your Pilgrimage
              </Button>
              <Button 
                size="lg" 
                variant="outline"
                className="bg-transparent text-white border-white hover:bg-white/20"
                onClick={() => window.location.href = 'mailto:info@rechargetravels.com?subject=Anuradhapura Inquiry'}
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

export default Anuradhapura;
