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
  Mountain,
  Droplets,
  Train
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

interface BadullaContent {
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

const defaultContent: BadullaContent = {
  hero: {
    slides: [
      {
        id: '1',
        image: "https://images.unsplash.com/photo-1588668214407-6ea9a6d8c272?auto=format&fit=crop&q=80",
        title: "Welcome to Badulla",
        subtitle: "Hill Country Heritage and Waterfalls"
      },
      {
        id: '2',
        image: "https://images.unsplash.com/photo-1609920658906-8223bd289001?auto=format&fit=crop&q=80",
        title: "Ancient Temples",
        subtitle: "Discover Buddhist Heritage Sites"
      },
      {
        id: '3',
        image: "https://images.unsplash.com/photo-1621569896088-46cc0d472c8d?auto=format&fit=crop&q=80",
        title: "Majestic Waterfalls",
        subtitle: "Nature's Cascading Wonders"
      }
    ],
    title: "Badulla",
    subtitle: "Discover Sri Lanka's Hill Country Heritage"
  },
  overview: {
    title: "Why Visit Badulla?",
    description: "Badulla, the capital of Uva Province, is a charming hill country town surrounded by mountains, tea plantations, and cascading waterfalls. This ancient city, with roots dating back to pre-colonial times, offers a perfect blend of natural beauty, colonial heritage, and authentic Sri Lankan culture. Its cooler climate and spectacular landscapes make it an ideal escape from the coastal heat.",
    highlights: [
      "Spectacular Dunhinda and Ravana waterfalls",
      "Ancient Muthiyangana Raja Maha Viharaya temple",
      "Colonial-era railway station and architecture",
      "Scenic train journeys through tea country",
      "Traditional vegetable and fruit markets",
      "Cool hill country climate year-round",
      "Gateway to Horton Plains and Ella",
      "Authentic Sri Lankan hill country culture"
    ]
  },
  seo: {
    title: "Badulla Sri Lanka - Waterfalls, Temples & Hill Country Guide | Recharge Travels",
    description: "Explore Badulla's stunning waterfalls, ancient temples, and hill country heritage. Discover the gateway to Sri Lanka's Uva Province with our travel guide.",
    keywords: "Badulla waterfalls, Dunhinda Falls, Muthiyangana temple, Badulla train station, hill country Sri Lanka, Uva Province, Badulla travel guide, Ravana Falls"
  },
  attractions: [
    {
      id: '1',
      name: "Dunhinda Falls",
      description: "One of Sri Lanka's most beautiful waterfalls, cascading 64 meters through misty spray. The trek to the falls passes through scenic jungle paths and smaller cascades.",
      image: "https://images.unsplash.com/photo-1621569896088-46cc0d472c8d?auto=format&fit=crop&q=80",
      category: "Natural",
      rating: 4.8,
      duration: "2-3 hours",
      price: "From $2",
      highlights: ["64m Waterfall", "Jungle Trek", "Photography", "Natural Pool"]
    },
    {
      id: '2',
      name: "Muthiyangana Raja Maha Viharaya",
      description: "One of the Solosmasthana (16 sacred sites), this ancient temple dates back to Buddha's time. Features beautiful paintings, statues, and a sacred Bo tree.",
      image: "https://images.unsplash.com/photo-1609920658906-8223bd289001?auto=format&fit=crop&q=80",
      category: "Religious",
      rating: 4.7,
      duration: "1-2 hours",
      price: "Free",
      highlights: ["Ancient Temple", "Sacred Site", "Buddhist Art", "Bo Tree"]
    },
    {
      id: '3',
      name: "Badulla Railway Station",
      description: "A charming colonial-era station marking the end of the scenic hill country railway line. The journey here is considered one of the world's most beautiful train rides.",
      image: "https://images.unsplash.com/photo-1564760055775-d63b17a55c44?auto=format&fit=crop&q=80",
      category: "Historical",
      rating: 4.5,
      duration: "1 hour",
      price: "Free",
      highlights: ["Colonial Architecture", "Train Journey", "Photography", "Local Life"]
    },
    {
      id: '4',
      name: "Ravana Falls",
      description: "A stunning 25-meter waterfall linked to the Ramayana epic. Located on the Ella-Badulla road, it's easily accessible and offers great photo opportunities.",
      image: "https://images.unsplash.com/photo-1621569898744-04b17bb249d0?auto=format&fit=crop&q=80",
      category: "Natural",
      rating: 4.6,
      duration: "1 hour",
      price: "Free",
      highlights: ["Roadside Falls", "Ramayana Legend", "Swimming", "Easy Access"]
    },
    {
      id: '5',
      name: "Bogoda Wooden Bridge",
      description: "An ancient wooden bridge built in the 16th century without using any nails. One of the oldest surviving wooden bridges in Sri Lanka with unique architecture.",
      image: "https://images.unsplash.com/photo-1588668214407-6ea9a6d8c272?auto=format&fit=crop&q=80",
      category: "Historical",
      rating: 4.4,
      duration: "1 hour",
      price: "Free",
      highlights: ["16th Century", "Wooden Architecture", "No Nails Used", "Historic Site"]
    },
    {
      id: '6',
      name: "Dhowa Rock Temple",
      description: "An ancient rock temple featuring an unfinished 12-meter Buddha statue carved into rock face and beautiful cave paintings from the Kandyan period.",
      image: "https://images.unsplash.com/photo-1552832230-c0197dd311b5?auto=format&fit=crop&q=80",
      category: "Religious",
      rating: 4.3,
      duration: "1 hour",
      price: "Donation",
      highlights: ["Rock Carving", "Cave Temple", "Ancient Art", "Unfinished Buddha"]
    }
  ],
  activities: [
    {
      id: '1',
      name: "Waterfall Trekking",
      description: "Guided hikes to multiple waterfalls in the area",
      icon: Droplets,
      price: "From $25",
      duration: "Half day",
      popular: true
    },
    {
      id: '2',
      name: "Scenic Train Journey",
      description: "Experience the famous Badulla-Ella train route",
      icon: Train,
      price: "From $5",
      duration: "2-3 hours",
      popular: true
    },
    {
      id: '3',
      name: "Temple & Heritage Tour",
      description: "Visit ancient temples and colonial sites",
      icon: Mountain,
      price: "From $30",
      duration: "4 hours"
    },
    {
      id: '4',
      name: "Tea Estate Visit",
      description: "Tour nearby tea plantations and factories",
      icon: TreePalm,
      price: "From $20",
      duration: "3 hours"
    },
    {
      id: '5',
      name: "Village Experience",
      description: "Authentic hill country village life and farming",
      icon: Home,
      price: "From $35",
      duration: "Half day"
    },
    {
      id: '6',
      name: "Photography Tours",
      description: "Capture misty mountains and waterfalls",
      icon: Camera,
      price: "From $40",
      duration: "Full day"
    }
  ],
  itineraries: [
    {
      id: '1',
      title: "Badulla Highlights Day Tour",
      duration: "1 Day",
      description: "Experience the best of Badulla's natural and cultural attractions",
      highlights: [
        "Morning visit to Dunhinda Falls",
        "Explore Muthiyangana Temple",
        "Lunch with hill country cuisine",
        "Afternoon at Ravana Falls",
        "Visit colonial Badulla town"
      ],
      price: "From $65 per person"
    },
    {
      id: '2',
      title: "Hill Country Explorer",
      duration: "2 Days / 1 Night",
      description: "Discover waterfalls, temples, and scenic train journeys",
      highlights: [
        "Day 1: Waterfall trekking and temples",
        "Scenic train journey experience",
        "Day 2: Bogoda Bridge and Dhowa Temple",
        "Tea estate visit",
        "Traditional markets exploration"
      ],
      price: "From $150 per person"
    },
    {
      id: '3',
      title: "Badulla & Beyond Adventure",
      duration: "3 Days / 2 Nights",
      description: "Comprehensive exploration of Badulla and surrounding highlands",
      highlights: [
        "Multiple waterfall visits",
        "Ancient temple complex tours",
        "Full-day train journey to Ella",
        "Village life experience",
        "Tea plantation and factory tour",
        "Photography at scenic viewpoints"
      ],
      price: "From $320 per person"
    }
  ],
  faqs: [
    {
      id: '1',
      question: "What is the best time to visit Badulla?",
      answer: "Badulla can be visited year-round due to its pleasant hill country climate. The best time is from December to April when rainfall is minimal. However, the waterfalls are most impressive during the rainy season (October-November). Temperature ranges from 15-28°C throughout the year."
    },
    {
      id: '2',
      question: "How do I get to Badulla?",
      answer: "Badulla is about 230 km from Colombo (5-6 hours by car). The most scenic way is by train from Kandy (6 hours) or Ella (2 hours), offering breathtaking views. Buses are available but less comfortable. We recommend the train for the experience or private transport for convenience."
    },
    {
      id: '3',
      question: "Is the train journey to Badulla worth it?",
      answer: "Absolutely! The train journey to Badulla, especially from Ella or Kandy, is considered one of the most scenic train rides in the world. You'll pass through tea plantations, misty mountains, and numerous tunnels and bridges. Book first or second class for comfort."
    },
    {
      id: '4',
      question: "How difficult is the trek to Dunhinda Falls?",
      answer: "The trek to Dunhinda Falls is moderate, taking about 45 minutes each way. The path can be slippery when wet, so good footwear is essential. There are some steep sections, but it's manageable for most fitness levels. The spectacular waterfall makes the effort worthwhile."
    },
    {
      id: '5',
      question: "What should I pack for Badulla?",
      answer: "Pack layers as temperatures can vary. Bring a light jacket for evenings, rain gear (especially Oct-Nov), comfortable walking shoes for treks, and insect repellent. Don't forget sunscreen as UV levels are high at altitude, and a camera for the stunning scenery."
    },
    {
      id: '6',
      question: "Are there good accommodation options in Badulla?",
      answer: "Yes, Badulla offers various accommodations from budget guesthouses to comfortable hotels. Many feature beautiful mountain views. For a unique experience, consider staying in a colonial-era bungalow or eco-lodge. Book in advance during peak season (December-March)."
    }
  ],
  gallery: [
    "https://images.unsplash.com/photo-1588668214407-6ea9a6d8c272?auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1621569896088-46cc0d472c8d?auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1609920658906-8223bd289001?auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1564760055775-d63b17a55c44?auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1621569898744-04b17bb249d0?auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1552832230-c0197dd311b5?auto=format&fit=crop&q=80"
  ],
  travelTips: [
    {
      id: '1',
      title: "Weather & Clothing",
      icon: Cloud,
      tips: [
        "Cool climate year-round (15-28°C)",
        "Bring layers and a light jacket",
        "Rain gear essential Oct-Nov",
        "Comfortable walking shoes for treks",
        "Modest clothing for temple visits"
      ]
    },
    {
      id: '2',
      title: "Transportation",
      icon: Train,
      tips: [
        "Book train tickets in advance",
        "First/second class recommended",
        "Tuk-tuks available for local transport",
        "Hire a car for waterfall visits",
        "Roads can be winding - motion sickness pills helpful"
      ]
    },
    {
      id: '3',
      title: "Health & Safety",
      icon: Heart,
      tips: [
        "Altitude may affect some visitors",
        "Stay hydrated during treks",
        "Paths to waterfalls can be slippery",
        "Carry insect repellent",
        "Basic medical facilities available"
      ]
    }
  ]
};

const Badulla = () => {
  const [content, setContent] = useState<BadullaContent>(defaultContent);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [selectedTab, setSelectedTab] = useState('attractions');
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [selectedService, setSelectedService] = useState<string>('');
  const [galleryIndex, setGalleryIndex] = useState(0);

  // Load content from Firebase and set up real-time listener
  useEffect(() => {
    const docRef = doc(db, 'destinations', 'badulla');
    
    // Set up real-time listener
    const unsubscribe = onSnapshot(docRef, (docSnap) => {
      if (docSnap.exists()) {
        const data = docSnap.data() as BadullaContent;
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
    temperature: "15-28°C",
    season: "Cool hill climate",
    rainfall: "Moderate (Oct-Nov peak)"
  };

  const destinationInfo: DestinationInfo = {
    population: "47,500",
    area: "23.5 km²",
    elevation: "680m above sea level",
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
    "name": "Badulla, Sri Lanka",
    "description": content.overview.description,
    "image": content.hero.slides.map(slide => slide.image),
    "touristType": ["Nature Tourism", "Cultural Tourism", "Adventure Tourism"],
    "geo": {
      "@type": "GeoCoordinates",
      "latitude": "6.9934",
      "longitude": "81.0550"
    },
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": "4.6",
      "reviewCount": "1432"
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
        <meta property="og:url" content="https://rechargetravels.com/destinations/badulla" />
        <meta property="og:type" content="website" />
        
        {/* Twitter Card Tags */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={content.seo.title} />
        <meta name="twitter:description" content={content.seo.description} />
        <meta name="twitter:image" content={content.hero.slides[0].image} />
        
        {/* Canonical URL */}
        <link rel="canonical" href="https://rechargetravels.com/destinations/badulla" />
        
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
                  onClick={() => handleBooking('Badulla Tour Package')}
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
                <Mountain className="w-4 h-4" />
                <span>Elevation: {destinationInfo.elevation}</span>
              </div>
              <div className="flex items-center gap-2">
                <Cloud className="w-4 h-4" />
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
                <h3 className="text-3xl font-bold mb-8 text-center">Top Attractions in Badulla</h3>
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
                <h3 className="text-3xl font-bold mb-8 text-center">Things to Do in Badulla</h3>
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
                <h3 className="text-3xl font-bold mb-8 text-center">Travel Tips for Badulla</h3>
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
            <h3 className="text-3xl font-bold mb-8 text-center">Getting to Badulla</h3>
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
                      src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d63424.70589033657!2d81.0350!3d6.9934!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3ae4618aa5e23b23%3A0x4d4d4d4d4d4d4d4d!2sBadulla%2C%20Sri%20Lanka!5e0!3m2!1sen!2sus!4v1647887431289!5m2!1sen!2sus"
                      width="100%"
                      height="100%"
                      style={{ border: 0 }}
                      allowFullScreen
                      loading="lazy"
                      referrerPolicy="no-referrer-when-downgrade"
                      title="Badulla Map"
                    ></iframe>
                  </div>
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-semibold mb-2">From Colombo (230 km)</h4>
                      <p className="text-sm text-muted-foreground">
                        • By Car: 5-6 hours via A1 and A5<br />
                        • By Train: 9 hours (scenic route)<br />
                        • By Bus: 6-7 hours
                      </p>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-2">From Kandy (115 km)</h4>
                      <p className="text-sm text-muted-foreground">
                        • By Car: 3 hours via A26<br />
                        • By Train: 6 hours (scenic)<br />
                        • By Bus: 4 hours
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
                    <h4 className="font-semibold mb-2">Hill Country Tours</h4>
                    <p className="text-sm">
                      Book our comfortable vehicles for exploring Badulla's attractions. 
                      Experienced drivers familiar with mountain roads.
                    </p>
                    <Button 
                      className="mt-3 bg-blue-600 hover:bg-blue-700"
                      onClick={() => handleBooking('Badulla Transport Package')}
                    >
                      Book Transport
                    </Button>
                  </div>
                  <div className="space-y-2">
                    <p className="text-sm flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                      Train journey highly recommended for views
                    </p>
                    <p className="text-sm flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                      Local tuk-tuks for short distances
                    </p>
                    <p className="text-sm flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                      Private car best for waterfall visits
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
            <h3 className="text-3xl font-bold mb-8 text-center">Badulla Gallery</h3>
            <div className="relative rounded-lg overflow-hidden aspect-video max-w-4xl mx-auto">
              <AnimatePresence mode="wait">
                <motion.img
                  key={galleryIndex}
                  src={content.gallery[galleryIndex]}
                  alt={`Badulla gallery image ${galleryIndex + 1}`}
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
              Ready to Explore Badulla's Natural Wonders?
            </h2>
            <p className="text-xl mb-8 max-w-2xl mx-auto">
              From cascading waterfalls to ancient temples, let us guide you through the heart of Sri Lanka's hill country
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                size="lg" 
                className="bg-white text-blue-600 hover:bg-gray-100"
                onClick={() => handleBooking('Badulla Complete Package')}
              >
                <Phone className="w-5 h-5 mr-2" />
                Book Your Trip
              </Button>
              <Button 
                size="lg" 
                variant="outline"
                className="bg-transparent text-white border-white hover:bg-white/20"
                onClick={() => window.location.href = 'mailto:info@rechargetravels.com?subject=Badulla Inquiry'}
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

export default Badulla;
