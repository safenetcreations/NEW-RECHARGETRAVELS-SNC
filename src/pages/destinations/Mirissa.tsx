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
  Heart
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

interface MirissaContent {
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

const defaultContent: MirissaContent = {
  hero: {
    slides: [
      {
        id: '1',
        image: "https://images.unsplash.com/photo-1518509562904-e7ef99cdcc86?auto=format&fit=crop&q=80",
        title: "Welcome to Mirissa",
        subtitle: "Sri Lanka's Whale Watching Paradise"
      },
      {
        id: '2',
        image: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&q=80",
        title: "Pristine Beaches",
        subtitle: "Golden Sands and Turquoise Waters"
      },
      {
        id: '3',
        image: "https://images.unsplash.com/photo-1562113775-74db0a3219e5?auto=format&fit=crop&q=80",
        title: "Tropical Paradise",
        subtitle: "Where Ocean Meets Serenity"
      }
    ],
    title: "Mirissa",
    subtitle: "Discover Sri Lanka's Coastal Gem"
  },
  overview: {
    title: "Why Visit Mirissa?",
    description: "Mirissa is a picturesque coastal town on Sri Lanka's southern coast, renowned for its pristine beaches, world-class whale watching, and laid-back tropical atmosphere. This charming fishing village has evolved into one of the island's most beloved beach destinations, offering the perfect blend of natural beauty, marine adventures, and authentic Sri Lankan hospitality.",
    highlights: [
      "World-renowned whale and dolphin watching",
      "Stunning crescent-shaped beach with golden sand",
      "Famous Coconut Tree Hill viewpoint",
      "Vibrant beach nightlife and restaurants",
      "Secret Beach for tranquil escapes",
      "Perfect surfing conditions for beginners",
      "Fresh seafood and tropical cuisine",
      "Year-round tropical climate"
    ]
  },
  seo: {
    title: "Mirissa Beach Sri Lanka - Whale Watching Tours & Travel Guide | Recharge Travels",
    description: "Discover Mirissa, Sri Lanka's premier beach destination. Book whale watching tours, explore pristine beaches, and experience the best of coastal paradise with Recharge Travels.",
    keywords: "Mirissa whale watching tour, best beach in Sri Lanka, Mirissa travel guide, Coconut Tree Hill, Secret Beach Mirissa, whale watching Sri Lanka, Mirissa hotels, things to do in Mirissa"
  },
  attractions: [
    {
      id: '1',
      name: "Whale & Dolphin Watching",
      description: "Experience the thrill of spotting blue whales, sperm whales, and playful dolphins in their natural habitat. Mirissa is one of the best places in the world for whale watching.",
      image: "https://images.unsplash.com/photo-1568430462989-44163eb1752f?auto=format&fit=crop&q=80",
      category: "Marine Life",
      rating: 4.9,
      duration: "4-5 hours",
      price: "From $40",
      highlights: ["Blue Whales", "Sperm Whales", "Spinner Dolphins", "Morning Tours"]
    },
    {
      id: '2',
      name: "Coconut Tree Hill",
      description: "Instagram-famous palm tree plantation on a small hill offering panoramic views of the ocean and surrounding coastline. Perfect for sunset photography.",
      image: "https://images.unsplash.com/photo-1519046904884-53103b34b206?auto=format&fit=crop&q=80",
      category: "Viewpoints",
      rating: 4.7,
      duration: "1-2 hours",
      price: "Free",
      highlights: ["Sunset Views", "Photography", "Palm Trees", "Ocean Vistas"]
    },
    {
      id: '3',
      name: "Secret Beach",
      description: "A hidden gem accessible through a small path, offering a more secluded and intimate beach experience away from the crowds.",
      image: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&q=80",
      category: "Beaches",
      rating: 4.6,
      duration: "2-3 hours",
      price: "Free",
      highlights: ["Secluded Beach", "Swimming", "Snorkeling", "Relaxation"]
    },
    {
      id: '4',
      name: "Mirissa Beach",
      description: "The main beach featuring golden sand, clear waters, beach restaurants, and various water sports activities.",
      image: "https://images.unsplash.com/photo-1506477331477-33d5d8b3dc85?auto=format&fit=crop&q=80",
      category: "Beaches",
      rating: 4.8,
      duration: "Full day",
      price: "Free",
      highlights: ["Swimming", "Surfing", "Beach Bars", "Water Sports"]
    },
    {
      id: '5',
      name: "Parrot Rock",
      description: "A small rocky island just off the beach, accessible during low tide, offering great views and a mini adventure.",
      image: "https://images.unsplash.com/photo-1559827260-dc66d52bef19?auto=format&fit=crop&q=80",
      category: "Natural",
      rating: 4.5,
      duration: "1 hour",
      price: "Free",
      highlights: ["Rock Formation", "Tide Pools", "Views", "Photography"]
    },
    {
      id: '6',
      name: "Snake Island",
      description: "A small island connected to the mainland during low tide, perfect for exploration and enjoying pristine nature.",
      image: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&q=80",
      category: "Islands",
      rating: 4.4,
      duration: "2 hours",
      price: "Boat: $10",
      highlights: ["Island Walk", "Bird Watching", "Snorkeling", "Nature"]
    }
  ],
  activities: [
    {
      id: '1',
      name: "Whale Watching Tour",
      description: "Early morning boat tours to spot whales and dolphins",
      icon: Ship,
      price: "From $40",
      duration: "4-5 hours",
      popular: true
    },
    {
      id: '2',
      name: "Surfing Lessons",
      description: "Learn to surf on Mirissa's beginner-friendly waves",
      icon: Waves,
      price: "From $20",
      duration: "2 hours",
      popular: true
    },
    {
      id: '3',
      name: "Sea Turtle Watching",
      description: "Visit nearby hatcheries and see turtles in the wild",
      icon: Turtle,
      price: "From $15",
      duration: "2-3 hours"
    },
    {
      id: '4',
      name: "Cooking Classes",
      description: "Learn to prepare authentic Sri Lankan seafood dishes",
      icon: Utensils,
      price: "From $30",
      duration: "3 hours"
    },
    {
      id: '5',
      name: "Yoga on the Beach",
      description: "Morning and sunset yoga sessions by the ocean",
      icon: Sunrise,
      price: "From $10",
      duration: "1.5 hours"
    },
    {
      id: '6',
      name: "Island Hopping",
      description: "Explore nearby islands and hidden beaches",
      icon: Anchor,
      price: "From $35",
      duration: "Half day"
    }
  ],
  itineraries: [
    {
      id: '1',
      title: "Mirissa Day Trip Essential",
      duration: "1 Day",
      description: "Perfect for travelers with limited time who want to experience the best of Mirissa",
      highlights: [
        "Early morning whale watching tour",
        "Lunch at a beachfront restaurant",
        "Relax on Mirissa Beach",
        "Sunset at Coconut Tree Hill",
        "Dinner with fresh seafood"
      ],
      price: "From $75 per person"
    },
    {
      id: '2',
      title: "Mirissa Weekend Getaway",
      duration: "2 Days / 1 Night",
      description: "A perfect weekend escape to experience beach life and marine adventures",
      highlights: [
        "Day 1: Arrival, Secret Beach, sunset at Parrot Rock",
        "Evening: Beachfront dinner and nightlife",
        "Day 2: Whale watching tour, beach time",
        "Afternoon: Surfing lesson or spa treatment",
        "Visit local fish market"
      ],
      price: "From $150 per person"
    },
    {
      id: '3',
      title: "Mirissa Marine Adventure",
      duration: "3 Days / 2 Nights",
      description: "Comprehensive marine and beach experience with all major attractions",
      highlights: [
        "Whale and dolphin watching expedition",
        "Snorkeling and diving sessions",
        "Island hopping tour",
        "Sea turtle conservation visit",
        "Beach activities and water sports",
        "Cooking class with local chef"
      ],
      price: "From $350 per person"
    }
  ],
  faqs: [
    {
      id: '1',
      question: "When is the best time for whale watching in Mirissa?",
      answer: "The best time for whale watching in Mirissa is from November to April, with peak sightings typically occurring between December and March. During this period, the seas are calmer, and blue whales migrate through Sri Lankan waters."
    },
    {
      id: '2',
      question: "How far is Mirissa from Colombo airport?",
      answer: "Mirissa is approximately 150 km from Bandaranaike International Airport in Colombo. The journey takes about 2.5-3 hours by car via the Southern Expressway, or 3-4 hours by train to Weligama followed by a short tuk-tuk ride."
    },
    {
      id: '3',
      question: "Is Mirissa suitable for families with children?",
      answer: "Yes, Mirissa is very family-friendly. The main beach has calm waters perfect for children, and activities like turtle watching and easy whale watching tours are suitable for kids. Many restaurants offer children's menus, and accommodations cater to families."
    },
    {
      id: '4',
      question: "What should I pack for a trip to Mirissa?",
      answer: "Pack light, breathable clothing, swimwear, sun protection (hat, sunscreen SPF 50+), insect repellent, comfortable walking shoes, and a light jacket for boat trips. Don't forget a waterproof bag for electronics during water activities."
    },
    {
      id: '5',
      question: "Are there ATMs and currency exchange in Mirissa?",
      answer: "Yes, there are several ATMs in Mirissa town that accept international cards. Currency exchange is available at some hotels and shops, but rates are better in larger cities. It's advisable to carry some cash as smaller establishments may not accept cards."
    },
    {
      id: '6',
      question: "Is it safe to swim in Mirissa?",
      answer: "Generally yes, but always check local conditions. The main beach area is usually safe for swimming, but be cautious of currents, especially during monsoon season (May to October). Always swim in designated areas and follow lifeguard instructions."
    }
  ],
  gallery: [
    "https://images.unsplash.com/photo-1518509562904-e7ef99cdcc86?auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1519046904884-53103b34b206?auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1568430462989-44163eb1752f?auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1559827260-dc66d52bef19?auto=format&fit=crop&q=80"
  ],
  travelTips: [
    {
      id: '1',
      title: "Best Time to Visit",
      icon: Calendar,
      tips: [
        "November to April: Dry season, best for whale watching",
        "December to March: Peak whale watching season",
        "May to October: Monsoon season, fewer crowds",
        "Avoid full moon days if seeking nightlife (alcohol restrictions)"
      ]
    },
    {
      id: '2',
      title: "What to Pack",
      icon: Sun,
      tips: [
        "High SPF sunscreen and after-sun lotion",
        "Light, breathable clothing",
        "Swimwear and beach cover-ups",
        "Waterproof phone case",
        "Anti-seasickness medication for boat trips",
        "Insect repellent for evenings"
      ]
    },
    {
      id: '3',
      title: "Local Customs",
      icon: Users,
      tips: [
        "Dress modestly when away from the beach",
        "Remove shoes when entering temples or homes",
        "Ask permission before photographing locals",
        "Respect Buddhist customs and traditions",
        "Avoid public displays of affection",
        "Tipping is appreciated but not mandatory"
      ]
    }
  ]
};

const Mirissa = () => {
  const [content, setContent] = useState<MirissaContent>(defaultContent);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [selectedTab, setSelectedTab] = useState('attractions');
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [selectedService, setSelectedService] = useState<string>('');
  const [galleryIndex, setGalleryIndex] = useState(0);

  // Load content from Firebase and set up real-time listener
  useEffect(() => {
    const docRef = doc(db, 'destinations', 'mirissa');
    
    // Set up real-time listener
    const unsubscribe = onSnapshot(docRef, (docSnap) => {
      if (docSnap.exists()) {
        const data = docSnap.data() as MirissaContent;
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
    rainfall: "Low (Nov-Apr), High (May-Oct)"
  };

  const destinationInfo: DestinationInfo = {
    population: "4,500",
    area: "10.5 km²",
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
    "name": "Mirissa, Sri Lanka",
    "description": content.overview.description,
    "image": content.hero.slides.map(slide => slide.image),
    "touristType": ["Beach Tourism", "Whale Watching", "Marine Life"],
    "geo": {
      "@type": "GeoCoordinates",
      "latitude": "5.9483",
      "longitude": "80.4716"
    },
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": "4.8",
      "reviewCount": "2451"
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
        <meta property="og:url" content="https://recharge-travels-73e76.web.app/destinations/mirissa" />
        <meta property="og:type" content="website" />
        
        {/* Twitter Card Tags */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={content.seo.title} />
        <meta name="twitter:description" content={content.seo.description} />
        <meta name="twitter:image" content={content.hero.slides[0].image} />
        
        {/* Canonical URL */}
        <link rel="canonical" href="https://recharge-travels-73e76.web.app/destinations/mirissa" />
        
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
                  onClick={() => handleBooking('Mirissa Tour Package')}
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
                <Ship className="w-4 h-4" />
                <span>Whale Season: Nov-Apr</span>
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
                <h3 className="text-3xl font-bold mb-8 text-center">Top Attractions in Mirissa</h3>
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
                <h3 className="text-3xl font-bold mb-8 text-center">Things to Do in Mirissa</h3>
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
                <h3 className="text-3xl font-bold mb-8 text-center">Travel Tips for Mirissa</h3>
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
            <h3 className="text-3xl font-bold mb-8 text-center">Getting to Mirissa</h3>
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
                      src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d15864.784968447173!2d80.45235!3d5.94836!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3ae13f2b0de0f745%3A0x4b5d8f9068d5e1e0!2sMirissa%2C%20Sri%20Lanka!5e0!3m2!1sen!2sus!4v1647887431289!5m2!1sen!2sus"
                      width="100%"
                      height="100%"
                      style={{ border: 0 }}
                      allowFullScreen
                      loading="lazy"
                      referrerPolicy="no-referrer-when-downgrade"
                      title="Mirissa Map"
                    ></iframe>
                  </div>
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-semibold mb-2">From Colombo (150 km)</h4>
                      <p className="text-sm text-muted-foreground">
                        • By Car: 2.5-3 hours via Southern Expressway<br />
                        • By Train: 3-4 hours to Weligama + 15 min tuk-tuk<br />
                        • By Bus: 3.5-4 hours direct service
                      </p>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-2">From Galle (40 km)</h4>
                      <p className="text-sm text-muted-foreground">
                        • By Car/Tuk-tuk: 45 minutes<br />
                        • By Train: 1 hour to Weligama + tuk-tuk<br />
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
                      onClick={() => handleBooking('Airport Transfer to Mirissa')}
                    >
                      Book Transfer
                    </Button>
                  </div>
                  <div className="space-y-2">
                    <p className="text-sm flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                      Tuk-tuks readily available for short distances
                    </p>
                    <p className="text-sm flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                      Bicycle rentals perfect for exploring the area
                    </p>
                    <p className="text-sm flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                      Scooter rentals available (International license required)
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
            <h3 className="text-3xl font-bold mb-8 text-center">Mirissa Gallery</h3>
            <div className="relative rounded-lg overflow-hidden aspect-video max-w-4xl mx-auto">
              <AnimatePresence mode="wait">
                <motion.img
                  key={galleryIndex}
                  src={content.gallery[galleryIndex]}
                  alt={`Mirissa gallery image ${galleryIndex + 1}`}
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
              Ready to Experience Mirissa's Magic?
            </h2>
            <p className="text-xl mb-8 max-w-2xl mx-auto">
              From whale watching adventures to pristine beaches, let us help you create unforgettable memories in Mirissa
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                size="lg" 
                className="bg-white text-blue-600 hover:bg-gray-100"
                onClick={() => handleBooking('Mirissa Complete Package')}
              >
                <Phone className="w-5 h-5 mr-2" />
                Book Your Trip
              </Button>
              <Button 
                size="lg" 
                variant="outline"
                className="bg-transparent text-white border-white hover:bg-white/20"
                onClick={() => window.location.href = 'mailto:info@rechargetravels.com?subject=Mirissa Inquiry'}
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

export default Mirissa;
