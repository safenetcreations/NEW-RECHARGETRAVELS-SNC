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
  Heart,
  Shell,
  Map,
  ChevronDown,
  Phone,
  Mail,
  CheckCircle,
  ChevronRight,
  Globe,
  Sparkles,
  Building,
  Umbrella
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

interface WadduwaContent {
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

const defaultContent: WadduwaContent = {
  hero: {
    slides: [
      {
        id: '1',
        image: "https://images.unsplash.com/photo-1519046904884-53103b34b206?auto=format&fit=crop&q=80",
        title: "Welcome to Wadduwa",
        subtitle: "Tranquil Beach Paradise Near Colombo"
      },
      {
        id: '2',
        image: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&q=80",
        title: "Golden Coast Getaway",
        subtitle: "Where Relaxation Meets Adventure"
      },
      {
        id: '3',
        image: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&q=80",
        title: "Authentic Coastal Experience",
        subtitle: "Traditional Fishing Village Charm"
      }
    ],
    title: "Wadduwa",
    subtitle: "Discover Sri Lanka's Hidden Beach Gem"
  },
  overview: {
    title: "Why Visit Wadduwa?",
    description: "Wadduwa, located just 35km south of Colombo, offers a perfect blend of accessibility and tranquility. This charming coastal town features a long stretch of golden sandy beach, swaying coconut palms, and a relaxed atmosphere that's ideal for those seeking a peaceful beach vacation. Unlike the more touristy southern beaches, Wadduwa maintains its authentic Sri Lankan fishing village character while offering modern resort facilities. The town is famous for its traditional fishing methods, coconut cultivation, and proximity to several cultural attractions.",
    highlights: [
      "3km stretch of pristine golden beach",
      "Traditional fishing village atmosphere",
      "Luxury resorts and budget accommodations",
      "30 minutes from Colombo airport",
      "Year-round warm weather and swimming",
      "Authentic Sri Lankan coastal cuisine",
      "Water sports and beach activities",
      "Close to cultural attractions"
    ]
  },
  seo: {
    title: "Wadduwa Beach Sri Lanka - Coastal Resort Town Near Colombo | Recharge Travels",
    description: "Experience Wadduwa's golden beaches, traditional fishing culture, and luxury resorts just 30 minutes from Colombo. Book your perfect beach getaway with Recharge Travels.",
    keywords: "Wadduwa beach, Sri Lanka beach resorts, Colombo beach nearby, Wadduwa hotels, fishing village Sri Lanka, west coast beaches, Wadduwa travel guide, beach vacation Sri Lanka"
  },
  attractions: [
    {
      id: '1',
      name: "Wadduwa Beach",
      description: "A beautiful 3km stretch of golden sand beach perfect for swimming, sunbathing, and long walks. The beach is less crowded than southern beaches, offering a peaceful retreat with stunning sunsets.",
      image: "https://images.unsplash.com/photo-1519046904884-53103b34b206?auto=format&fit=crop&q=80",
      category: "Beach",
      rating: 4.7,
      duration: "Full day",
      price: "Free",
      highlights: ["Golden Sand", "Safe Swimming", "Sunset Views", "Beach Walks"]
    },
    {
      id: '2',
      name: "Richmond Castle",
      description: "A stunning Edwardian mansion built in 1896, blending British and Indian architectural styles. This two-story mansion features intricate woodwork, stained glass windows, and beautiful gardens.",
      image: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?auto=format&fit=crop&q=80",
      category: "Historical",
      rating: 4.5,
      duration: "1-2 hours",
      price: "From $3",
      highlights: ["Edwardian Architecture", "Teak Carvings", "Historic Gardens", "Photo Opportunity"]
    },
    {
      id: '3',
      name: "Traditional Fish Market",
      description: "Experience the vibrant local fish market where fishermen bring their daily catch. Best visited early morning to see the boats returning and the bustling trade in fresh seafood.",
      image: "https://images.unsplash.com/photo-1559339352-11d035aa65de?auto=format&fit=crop&q=80",
      category: "Cultural",
      rating: 4.3,
      duration: "1 hour",
      price: "Free",
      highlights: ["Local Culture", "Fresh Seafood", "Traditional Boats", "Morning Activity"]
    },
    {
      id: '4',
      name: "Pothupitiya Beach",
      description: "A quieter section of beach south of main Wadduwa beach, perfect for those seeking more privacy. Popular with locals and features several beachside restaurants.",
      image: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&q=80",
      category: "Beach",
      rating: 4.4,
      duration: "Half day",
      price: "Free",
      highlights: ["Quiet Beach", "Local Vibe", "Seafood Restaurants", "Swimming"]
    },
    {
      id: '5',
      name: "Barberyn Island",
      description: "A small island visible from Wadduwa beach, home to an ancient lighthouse and monastery ruins. Can be reached by boat during low tide for exploration.",
      image: "https://images.unsplash.com/photo-1559827260-dc66d52bef19?auto=format&fit=crop&q=80",
      category: "Island",
      rating: 4.2,
      duration: "2-3 hours",
      price: "Boat: $10",
      highlights: ["Lighthouse", "Monastery Ruins", "Island Walk", "Ocean Views"]
    },
    {
      id: '6',
      name: "Kalutara Bodhiya",
      description: "Located 10km north, this sacred Buddhist site features one of the world's only hollow dagobas. The site offers panoramic views of the Kalu River and ocean.",
      image: "https://images.unsplash.com/photo-1588598198321-9735fd4f2b45?auto=format&fit=crop&q=80",
      category: "Religious",
      rating: 4.6,
      duration: "1-2 hours",
      price: "Free",
      highlights: ["Sacred Site", "River Views", "Hollow Stupa", "Buddhist Art"]
    }
  ],
  activities: [
    {
      id: '1',
      name: "Beach Resort Relaxation",
      description: "Enjoy luxury spa treatments and beachfront facilities",
      icon: Umbrella,
      price: "From $50",
      duration: "Half/Full day",
      popular: true
    },
    {
      id: '2',
      name: "Traditional Fishing Experience",
      description: "Join local fishermen for authentic fishing methods",
      icon: Fish,
      price: "From $30",
      duration: "3-4 hours",
      popular: true
    },
    {
      id: '3',
      name: "Water Sports",
      description: "Jet skiing, banana boat rides, and kayaking",
      icon: Waves,
      price: "From $25",
      duration: "1-2 hours"
    },
    {
      id: '4',
      name: "Cooking Classes",
      description: "Learn to prepare Sri Lankan seafood dishes",
      icon: Utensils,
      price: "From $40",
      duration: "3 hours"
    },
    {
      id: '5',
      name: "River Safari",
      description: "Explore Kalu River mangroves and wildlife",
      icon: Ship,
      price: "From $35",
      duration: "2-3 hours"
    },
    {
      id: '6',
      name: "Sunset Catamaran Cruise",
      description: "Romantic sunset sailing with refreshments",
      icon: Sunrise,
      price: "From $45",
      duration: "2 hours"
    }
  ],
  itineraries: [
    {
      id: '1',
      title: "Wadduwa Beach Day Trip",
      duration: "1 Day",
      description: "Perfect for a quick beach escape from Colombo",
      highlights: [
        "Morning pickup from Colombo hotels",
        "Beach time and swimming",
        "Fresh seafood lunch by the beach",
        "Visit Richmond Castle",
        "Sunset viewing and photography",
        "Return to Colombo by evening"
      ],
      price: "From $65 per person"
    },
    {
      id: '2',
      title: "Wadduwa Weekend Retreat",
      duration: "2 Days / 1 Night",
      description: "Relaxing beach getaway with cultural experiences",
      highlights: [
        "Day 1: Beach relaxation, water sports",
        "Traditional fishing village tour",
        "Seafood dinner on the beach",
        "Day 2: Early morning fish market visit",
        "Richmond Castle exploration",
        "Spa treatment at resort",
        "Sunset catamaran cruise"
      ],
      price: "From $180 per person"
    },
    {
      id: '3',
      title: "West Coast Discovery",
      duration: "3 Days / 2 Nights",
      description: "Explore Wadduwa and nearby coastal attractions",
      highlights: [
        "Wadduwa beach and water activities",
        "Kalutara temple and river safari",
        "Beruwala fishing harbor visit",
        "Brief Garden in Bentota",
        "Turtle hatchery experience",
        "Traditional mask making demonstration",
        "Beach resort relaxation"
      ],
      price: "From $320 per person"
    }
  ],
  faqs: [
    {
      id: '1',
      question: "How far is Wadduwa from Colombo Airport?",
      answer: "Wadduwa is approximately 35km south of Bandaranaike International Airport, taking about 45 minutes to 1 hour by car depending on traffic. The route follows the coastal road through Negombo and Colombo. Airport transfers can be arranged, and the expressway offers a faster inland route."
    },
    {
      id: '2',
      question: "Is Wadduwa suitable for swimming?",
      answer: "Yes, Wadduwa beach is generally safe for swimming with moderate waves. The best swimming conditions are from November to April when seas are calmer. Always check local conditions and swim in designated areas. Many resorts have pools as an alternative. Lifeguards are present at major resort beaches."
    },
    {
      id: '3',
      question: "What is the best time to visit Wadduwa?",
      answer: "Wadduwa can be visited year-round, but the best time is from November to April when rainfall is minimal and seas are calm. May to October sees southwest monsoon with occasional rain but fewer crowds and lower prices. The area rarely experiences extreme weather, making it a reliable beach destination."
    },
    {
      id: '4',
      question: "Are there good restaurants in Wadduwa?",
      answer: "Wadduwa offers various dining options from luxury resort restaurants to local seafood shacks. Fresh seafood is the specialty, with many beachside restaurants serving grilled fish, prawns, and crab. Local rice and curry, international cuisine, and Western food are also available. Prices are reasonable compared to Colombo."
    },
    {
      id: '5',
      question: "What activities are available besides beach relaxation?",
      answer: "Beyond the beach, you can enjoy water sports, fishing trips, river safaris on the Kalu River, visits to Richmond Castle, cooking classes, spa treatments, and cycling tours. Nearby attractions include Kalutara Temple, Brief Garden in Bentota, and turtle hatcheries. Many resorts offer activity packages."
    },
    {
      id: '6',
      question: "Is Wadduwa good for families with children?",
      answer: "Yes, Wadduwa is very family-friendly. The beach has gentle slopes and moderate waves suitable for children. Many resorts offer kids' clubs, family rooms, and child-friendly pools. Activities like turtle watching, boat rides, and sandcastle building are popular with children. The proximity to Colombo also makes it convenient for families."
    }
  ],
  gallery: [
    "https://images.unsplash.com/photo-1519046904884-53103b34b206?auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1578662996442-48f60103fc96?auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1559339352-11d035aa65de?auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1559827260-dc66d52bef19?auto=format&fit=crop&q=80"
  ],
  travelTips: [
    {
      id: '1',
      title: "Best Time to Visit",
      icon: Calendar,
      tips: [
        "November to April: Dry season, calm seas",
        "May to October: Monsoon but still pleasant",
        "Weekdays: Less crowded beaches",
        "Avoid local holidays for peaceful stay"
      ]
    },
    {
      id: '2',
      title: "What to Pack",
      icon: Sun,
      tips: [
        "Light, breathable beachwear",
        "Reef-safe sunscreen SPF 30+",
        "Hat and sunglasses",
        "Insect repellent for evenings",
        "Light rain jacket (monsoon season)",
        "Comfortable walking sandals"
      ]
    },
    {
      id: '3',
      title: "Local Tips",
      icon: Users,
      tips: [
        "Try fresh seafood from local restaurants",
        "Respect local customs and dress codes",
        "Bargain at local markets respectfully",
        "Support local businesses and fishermen",
        "Learn basic Sinhala greetings",
        "Carry cash for small vendors"
      ]
    }
  ]
};

const Wadduwa = () => {
  const [content, setContent] = useState<WadduwaContent>(defaultContent);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [selectedTab, setSelectedTab] = useState('attractions');
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [selectedService, setSelectedService] = useState<string>('');
  const [galleryIndex, setGalleryIndex] = useState(0);

  // Load content from Firebase and set up real-time listener
  useEffect(() => {
    const docRef = doc(db, 'destinations', 'wadduwa');
    
    // Set up real-time listener
    const unsubscribe = onSnapshot(docRef, (docSnap) => {
      if (docSnap.exists()) {
        const data = docSnap.data() as WadduwaContent;
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
    rainfall: "Low (Dec-Mar), Moderate (Apr-Nov)"
  };

  const destinationInfo: DestinationInfo = {
    population: "35,000",
    area: "14 km²",
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
    "name": "Wadduwa, Sri Lanka",
    "description": content.overview.description,
    "image": content.hero.slides.map(slide => slide.image),
    "touristType": ["Beach Tourism", "Family Tourism", "Relaxation"],
    "geo": {
      "@type": "GeoCoordinates",
      "latitude": "6.6350",
      "longitude": "79.9253"
    },
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": "4.6",
      "reviewCount": "1342"
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
        <meta property="og:url" content="https://recharge-travels-73e76.web.app/destinations/wadduwa" />
        <meta property="og:type" content="website" />
        
        {/* Twitter Card Tags */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={content.seo.title} />
        <meta name="twitter:description" content={content.seo.description} />
        <meta name="twitter:image" content={content.hero.slides[0].image} />
        
        {/* Canonical URL */}
        <link rel="canonical" href="https://recharge-travels-73e76.web.app/destinations/wadduwa" />
        
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
                  onClick={() => handleBooking('Wadduwa Beach Package')}
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
                <MapPin className="w-4 h-4" />
                <span>35km from Colombo</span>
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
                <h3 className="text-3xl font-bold mb-8 text-center">Top Attractions in Wadduwa</h3>
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
                <h3 className="text-3xl font-bold mb-8 text-center">Things to Do in Wadduwa</h3>
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
                <h3 className="text-3xl font-bold mb-8 text-center">Travel Tips for Wadduwa</h3>
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
            <h3 className="text-3xl font-bold mb-8 text-center">Getting to Wadduwa</h3>
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
                      src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d31711.890147577!2d79.9142!3d6.6350!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3ae237c51c94dd23%3A0x72f91f1a3a5e9ba8!2sWadduwa%2C%20Sri%20Lanka!5e0!3m2!1sen!2sus!4v1647887431289!5m2!1sen!2sus"
                      width="100%"
                      height="100%"
                      style={{ border: 0 }}
                      allowFullScreen
                      loading="lazy"
                      referrerPolicy="no-referrer-when-downgrade"
                      title="Wadduwa Map"
                    ></iframe>
                  </div>
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-semibold mb-2">From Colombo (35 km)</h4>
                      <p className="text-sm text-muted-foreground">
                        • By Car: 45 min - 1 hour via Galle Road<br />
                        • By Train: 1 hour to Wadduwa Station<br />
                        • By Bus: 1.5 hours on route 400
                      </p>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-2">From Airport (45 km)</h4>
                      <p className="text-sm text-muted-foreground">
                        • By Car/Taxi: 1-1.5 hours<br />
                        • Via Expressway: Faster route<br />
                        • Airport transfers available
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
                      Pre-book your airport transfer for hassle-free arrival. 
                      Our drivers meet you at arrivals and take you directly to your Wadduwa hotel.
                    </p>
                    <Button 
                      className="mt-3 bg-blue-600 hover:bg-blue-700"
                      onClick={() => handleBooking('Airport Transfer to Wadduwa')}
                    >
                      Book Transfer
                    </Button>
                  </div>
                  <div className="space-y-2">
                    <p className="text-sm flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                      Train station 2km from beach hotels
                    </p>
                    <p className="text-sm flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                      Tuk-tuks readily available locally
                    </p>
                    <p className="text-sm flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                      Many hotels offer shuttle services
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
            <h3 className="text-3xl font-bold mb-8 text-center">Wadduwa Gallery</h3>
            <div className="relative rounded-lg overflow-hidden aspect-video max-w-4xl mx-auto">
              <AnimatePresence mode="wait">
                <motion.img
                  key={galleryIndex}
                  src={content.gallery[galleryIndex]}
                  alt={`Wadduwa gallery image ${galleryIndex + 1}`}
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
              Ready for Your Beach Escape?
            </h2>
            <p className="text-xl mb-8 max-w-2xl mx-auto">
              Experience the perfect blend of relaxation and adventure on Wadduwa's golden shores
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                size="lg" 
                className="bg-white text-blue-600 hover:bg-gray-100"
                onClick={() => handleBooking('Wadduwa Complete Package')}
              >
                <Phone className="w-5 h-5 mr-2" />
                Book Your Stay
              </Button>
              <Button 
                size="lg" 
                variant="outline"
                className="bg-transparent text-white border-white hover:bg-white/20"
                onClick={() => window.location.href = 'mailto:info@rechargetravels.com?subject=Wadduwa Inquiry'}
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

export default Wadduwa;
