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
  Castle,
  Building,
  Landmark
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

interface MataraContent {
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

const defaultContent: MataraContent = {
  hero: {
    slides: [
      {
        id: '1',
        image: "https://images.unsplash.com/photo-1590523741831-ab7e8b8f9c7f?auto=format&fit=crop&q=80",
        title: "Welcome to Matara",
        subtitle: "Where Dutch Heritage Meets Ocean Beauty"
      },
      {
        id: '2',
        image: "https://images.unsplash.com/photo-1552733407-5d5c46c3bb3b?auto=format&fit=crop&q=80",
        title: "Historic Fortifications",
        subtitle: "Explore Centuries of Colonial Architecture"
      },
      {
        id: '3',
        image: "https://images.unsplash.com/photo-1519904981063-b0cf448d479e?auto=format&fit=crop&q=80",
        title: "Southern Beaches",
        subtitle: "Pristine Coastlines and Hidden Coves"
      }
    ],
    title: "Matara",
    subtitle: "Discover Sri Lanka's Historic Southern City"
  },
  overview: {
    title: "Why Visit Matara?",
    description: "Matara, the capital of Sri Lanka's Southern Province, is a vibrant coastal city where Dutch colonial heritage blends seamlessly with Buddhist culture and stunning beaches. Known for its historic fort, ancient temples, and picturesque beaches, Matara offers visitors a perfect combination of history, culture, and natural beauty. The city serves as an ideal base for exploring the deep south of Sri Lanka.",
    highlights: [
      "Dutch Fort and Star Fort historic sites",
      "Beautiful Polhena and Mirissa beaches nearby",
      "Ancient Weherahena Buddhist Temple",
      "Dondra Head Lighthouse - southernmost point",
      "Traditional mask-making workshops",
      "Fresh seafood and southern cuisine",
      "Gateway to southern coastal attractions",
      "Year-round tropical climate"
    ]
  },
  seo: {
    title: "Matara Sri Lanka - Dutch Fort, Beaches & Travel Guide | Recharge Travels",
    description: "Explore Matara's Dutch fortifications, pristine beaches, and Buddhist temples. Discover the historic southern city with our comprehensive travel guide and tours.",
    keywords: "Matara Dutch Fort, Star Fort Matara, Polhena Beach, Weherahena Temple, Matara travel guide, southern Sri Lanka tours, Dondra Lighthouse, Matara hotels"
  },
  attractions: [
    {
      id: '1',
      name: "Matara Dutch Fort",
      description: "A well-preserved 17th-century Dutch fortification featuring ramparts, bastions, and colonial architecture. The fort area includes government buildings, churches, and offers scenic ocean views.",
      image: "https://images.unsplash.com/photo-1588001832198-c15cff59b078?auto=format&fit=crop&q=80",
      category: "Historical",
      rating: 4.7,
      duration: "2-3 hours",
      price: "Free",
      highlights: ["Dutch Architecture", "Ocean Views", "Historic Ramparts", "Colonial Buildings"]
    },
    {
      id: '2',
      name: "Star Fort (Redoubt Van Eck)",
      description: "A unique star-shaped fort built by the Dutch in 1763, featuring a moat, drawbridge, and six-pointed star design. One of the best-preserved examples of Dutch military architecture.",
      image: "https://images.unsplash.com/photo-1569163139394-de4798aa3c5d?auto=format&fit=crop&q=80",
      category: "Historical",
      rating: 4.6,
      duration: "1-2 hours",
      price: "From $2",
      highlights: ["Star Design", "Moat & Drawbridge", "Military Museum", "Architecture"]
    },
    {
      id: '3',
      name: "Weherahena Temple",
      description: "Home to one of the largest Buddha statues in Sri Lanka and underground tunnel paintings depicting Buddhist Jataka stories. A significant pilgrimage site with unique architecture.",
      image: "https://images.unsplash.com/photo-1609920658906-8223bd289001?auto=format&fit=crop&q=80",
      category: "Religious",
      rating: 4.8,
      duration: "2 hours",
      price: "Donation",
      highlights: ["Giant Buddha Statue", "Tunnel Paintings", "Buddhist Art", "Meditation"]
    },
    {
      id: '4',
      name: "Polhena Beach",
      description: "A family-friendly beach protected by a natural reef, offering calm waters perfect for swimming and snorkeling. Known for sea turtle sightings and coral gardens.",
      image: "https://images.unsplash.com/photo-1506477331477-33d5d8b3dc85?auto=format&fit=crop&q=80",
      category: "Beaches",
      rating: 4.5,
      duration: "Half day",
      price: "Free",
      highlights: ["Calm Waters", "Snorkeling", "Sea Turtles", "Family Beach"]
    },
    {
      id: '5',
      name: "Dondra Head Lighthouse",
      description: "Sri Lanka's tallest lighthouse marking the southernmost point of the island. Built in 1889, offering panoramic ocean views and spectacular sunsets.",
      image: "https://images.unsplash.com/photo-1544551763-77b2d5e3c5e5?auto=format&fit=crop&q=80",
      category: "Landmarks",
      rating: 4.7,
      duration: "1 hour",
      price: "From $1",
      highlights: ["Southernmost Point", "Ocean Views", "Historic Lighthouse", "Sunset Spot"]
    },
    {
      id: '6',
      name: "Parey Dewa Temple",
      description: "A beautiful Buddhist temple on a small island connected by a bridge, featuring colorful statues, paintings, and peaceful gardens with ocean views.",
      image: "https://images.unsplash.com/photo-1552832230-c0197dd311b5?auto=format&fit=crop&q=80",
      category: "Religious",
      rating: 4.4,
      duration: "1 hour",
      price: "Free",
      highlights: ["Island Temple", "Buddhist Art", "Ocean Setting", "Peaceful Gardens"]
    }
  ],
  activities: [
    {
      id: '1',
      name: "Fort & Heritage Walk",
      description: "Guided tour through Dutch Fort and colonial quarters",
      icon: Castle,
      price: "From $15",
      duration: "3 hours",
      popular: true
    },
    {
      id: '2',
      name: "Beach Hopping Tour",
      description: "Visit multiple beaches along the southern coast",
      icon: Waves,
      price: "From $25",
      duration: "Half day",
      popular: true
    },
    {
      id: '3',
      name: "Temple & Culture Tour",
      description: "Explore Buddhist temples and local traditions",
      icon: Building,
      price: "From $20",
      duration: "4 hours"
    },
    {
      id: '4',
      name: "Mask Making Workshop",
      description: "Learn traditional Sri Lankan mask crafting",
      icon: Activity,
      price: "From $30",
      duration: "2 hours"
    },
    {
      id: '5',
      name: "Fishing Village Experience",
      description: "Join local fishermen for traditional fishing",
      icon: Fish,
      price: "From $35",
      duration: "Early morning"
    },
    {
      id: '6',
      name: "Southern Cuisine Class",
      description: "Cook authentic Matara specialties",
      icon: Utensils,
      price: "From $40",
      duration: "3 hours"
    }
  ],
  itineraries: [
    {
      id: '1',
      title: "Matara Heritage Day Tour",
      duration: "1 Day",
      description: "Explore the historic heart of Matara with its Dutch colonial legacy and Buddhist culture",
      highlights: [
        "Morning visit to Dutch Fort and ramparts",
        "Explore Star Fort and military museum",
        "Lunch with local southern cuisine",
        "Afternoon at Weherahena Temple",
        "Sunset at Dondra Head Lighthouse"
      ],
      price: "From $60 per person"
    },
    {
      id: '2',
      title: "Matara Beach & Culture",
      duration: "2 Days / 1 Night",
      description: "Combine historical exploration with beach relaxation and cultural experiences",
      highlights: [
        "Day 1: Fort tour, temple visits, mask workshop",
        "Evening: Traditional dinner and cultural show",
        "Day 2: Polhena Beach snorkeling",
        "Visit fishing villages and markets",
        "Coastal drive to hidden beaches"
      ],
      price: "From $140 per person"
    },
    {
      id: '3',
      title: "Southern Province Explorer",
      duration: "3 Days / 2 Nights",
      description: "Comprehensive tour of Matara and surrounding southern attractions",
      highlights: [
        "Complete Matara heritage sites tour",
        "Day trip to Mirissa for whale watching",
        "Visit Mulkirigala Rock Temple",
        "Explore Tangalle beaches",
        "Traditional village experiences",
        "Southern cuisine masterclass"
      ],
      price: "From $320 per person"
    }
  ],
  faqs: [
    {
      id: '1',
      question: "What is the best time to visit Matara?",
      answer: "The best time to visit Matara is from December to April when the weather is dry and sunny. This period is ideal for beach activities and sightseeing. The southwest monsoon (May to September) brings rain but fewer tourists and lush landscapes."
    },
    {
      id: '2',
      question: "How far is Matara from Colombo?",
      answer: "Matara is approximately 160 km from Colombo, about a 2.5-3 hour drive via the Southern Expressway. You can also take the coastal train (3-4 hours) which offers scenic ocean views, or regular buses that take about 4 hours."
    },
    {
      id: '3',
      question: "Can I swim at all Matara beaches?",
      answer: "While Matara has several beaches, Polhena Beach is the safest for swimming due to its natural reef protection. Other beaches may have strong currents. Always check local conditions and follow safety guidelines before swimming."
    },
    {
      id: '4',
      question: "Are the Dutch forts free to visit?",
      answer: "The main Matara Fort area is free to explore as it's part of the city. The Star Fort has a small entrance fee (around $1-2). Both sites are well-maintained and offer great photo opportunities."
    },
    {
      id: '5',
      question: "What local specialties should I try in Matara?",
      answer: "Don't miss the southern Sri Lankan specialties like ambulthiyal (sour fish curry), pol roti (coconut flatbread), and fresh seafood. The area is also famous for curd and treacle (buffalo yogurt with palm syrup)."
    },
    {
      id: '6',
      question: "Is Matara suitable as a base for exploring the south?",
      answer: "Yes, Matara is an excellent base for southern exploration. It's centrally located with easy access to Mirissa (whale watching), Tangalle (beaches), Yala National Park (2 hours), and other southern attractions."
    }
  ],
  gallery: [
    "https://images.unsplash.com/photo-1590523741831-ab7e8b8f9c7f?auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1588001832198-c15cff59b078?auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1552733407-5d5c46c3bb3b?auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1609920658906-8223bd289001?auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1506477331477-33d5d8b3dc85?auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1544551763-77b2d5e3c5e5?auto=format&fit=crop&q=80"
  ],
  travelTips: [
    {
      id: '1',
      title: "Best Time to Visit",
      icon: Calendar,
      tips: [
        "December to April: Dry season, perfect weather",
        "May to November: Monsoon, fewer crowds",
        "February-March: Ideal for whale watching nearby",
        "Avoid Poya days for alcohol availability"
      ]
    },
    {
      id: '2',
      title: "Getting Around",
      icon: Navigation,
      tips: [
        "Tuk-tuks readily available for short trips",
        "Local buses connect to nearby attractions",
        "Rent a scooter for coastal exploration",
        "Walking is best for fort and city center",
        "Hire a car with driver for day trips"
      ]
    },
    {
      id: '3',
      title: "Cultural Etiquette",
      icon: Users,
      tips: [
        "Dress modestly when visiting temples",
        "Remove shoes at religious sites",
        "Ask permission before photographing people",
        "Cover shoulders and knees at temples",
        "Respect Buddhist customs and monks"
      ]
    }
  ]
};

const Matara = () => {
  const [content, setContent] = useState<MataraContent>(defaultContent);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [selectedTab, setSelectedTab] = useState('attractions');
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [selectedService, setSelectedService] = useState<string>('');
  const [galleryIndex, setGalleryIndex] = useState(0);

  // Load content from Firebase and set up real-time listener
  useEffect(() => {
    const docRef = doc(db, 'destinations', 'matara');
    
    // Set up real-time listener
    const unsubscribe = onSnapshot(docRef, (docSnap) => {
      if (docSnap.exists()) {
        const data = docSnap.data() as MataraContent;
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
    population: "68,000",
    area: "16.5 km²",
    elevation: "15m above sea level",
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
    "name": "Matara, Sri Lanka",
    "description": content.overview.description,
    "image": content.hero.slides.map(slide => slide.image),
    "touristType": ["Cultural Tourism", "Beach Tourism", "Historical Tourism"],
    "geo": {
      "@type": "GeoCoordinates",
      "latitude": "5.9549",
      "longitude": "80.5550"
    },
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": "4.6",
      "reviewCount": "1847"
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
        <meta property="og:url" content="https://rechargetravels.com/destinations/matara" />
        <meta property="og:type" content="website" />
        
        {/* Twitter Card Tags */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={content.seo.title} />
        <meta name="twitter:description" content={content.seo.description} />
        <meta name="twitter:image" content={content.hero.slides[0].image} />
        
        {/* Canonical URL */}
        <link rel="canonical" href="https://rechargetravels.com/destinations/matara" />
        
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
                  onClick={() => handleBooking('Matara Tour Package')}
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
                <Castle className="w-4 h-4" />
                <span>Dutch Heritage City</span>
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
                <h3 className="text-3xl font-bold mb-8 text-center">Top Attractions in Matara</h3>
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
                <h3 className="text-3xl font-bold mb-8 text-center">Things to Do in Matara</h3>
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
                <h3 className="text-3xl font-bold mb-8 text-center">Travel Tips for Matara</h3>
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
            <h3 className="text-3xl font-bold mb-8 text-center">Getting to Matara</h3>
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
                      src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d31726.896674444845!2d80.5350!3d5.9549!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3ae13f9a6e7b3e8d%3A0x3e8e0c5d3f7b1234!2sMatara%2C%20Sri%20Lanka!5e0!3m2!1sen!2sus!4v1647887431289!5m2!1sen!2sus"
                      width="100%"
                      height="100%"
                      style={{ border: 0 }}
                      allowFullScreen
                      loading="lazy"
                      referrerPolicy="no-referrer-when-downgrade"
                      title="Matara Map"
                    ></iframe>
                  </div>
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-semibold mb-2">From Colombo (160 km)</h4>
                      <p className="text-sm text-muted-foreground">
                        • By Car: 2.5-3 hours via Southern Expressway<br />
                        • By Train: 3-4 hours scenic coastal journey<br />
                        • By Bus: 4 hours express service
                      </p>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-2">From Galle (45 km)</h4>
                      <p className="text-sm text-muted-foreground">
                        • By Car/Tuk-tuk: 1 hour<br />
                        • By Train: 1.5 hours coastal route<br />
                        • By Bus: 1.5 hours
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
                      onClick={() => handleBooking('Airport Transfer to Matara')}
                    >
                      Book Transfer
                    </Button>
                  </div>
                  <div className="space-y-2">
                    <p className="text-sm flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                      Tuk-tuks readily available for city tours
                    </p>
                    <p className="text-sm flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                      Local buses connect to all major attractions
                    </p>
                    <p className="text-sm flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                      Rent a car for southern province exploration
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
            <h3 className="text-3xl font-bold mb-8 text-center">Matara Gallery</h3>
            <div className="relative rounded-lg overflow-hidden aspect-video max-w-4xl mx-auto">
              <AnimatePresence mode="wait">
                <motion.img
                  key={galleryIndex}
                  src={content.gallery[galleryIndex]}
                  alt={`Matara gallery image ${galleryIndex + 1}`}
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
              Ready to Explore Matara's Heritage?
            </h2>
            <p className="text-xl mb-8 max-w-2xl mx-auto">
              From Dutch fortifications to pristine beaches, let us help you discover the treasures of Sri Lanka's historic southern city
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                size="lg" 
                className="bg-white text-blue-600 hover:bg-gray-100"
                onClick={() => handleBooking('Matara Complete Package')}
              >
                <Phone className="w-5 h-5 mr-2" />
                Book Your Trip
              </Button>
              <Button 
                size="lg" 
                variant="outline"
                className="bg-transparent text-white border-white hover:bg-white/20"
                onClick={() => window.location.href = 'mailto:info@rechargetravels.com?subject=Matara Inquiry'}
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

export default Matara;
