import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Mountain, 
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
  TreePalm,
  Heart,
  Map,
  ChevronDown,
  Phone,
  Mail,
  CheckCircle,
  ChevronRight,
  Globe,
  Footprints,
  Moon,
  Sparkles,
  AlertCircle
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

interface AdamsPeakContent {
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

const defaultContent: AdamsPeakContent = {
  hero: {
    slides: [
      {
        id: '1',
        image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&q=80",
        title: "Adam's Peak (Sri Pada)",
        subtitle: "Sacred Mountain of Sri Lanka"
      },
      {
        id: '2',
        image: "https://images.unsplash.com/photo-1486870591958-9b9d0d1dda99?auto=format&fit=crop&q=80",
        title: "Pilgrimage & Adventure",
        subtitle: "Where Faith Meets Nature"
      },
      {
        id: '3',
        image: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&q=80",
        title: "Sunrise Above the Clouds",
        subtitle: "A Journey Worth Every Step"
      }
    ],
    title: "Adam's Peak",
    subtitle: "Embark on Sri Lanka's Most Sacred Pilgrimage"
  },
  overview: {
    title: "Why Climb Adam's Peak?",
    description: "Adam's Peak (Sri Pada), standing at 2,243 meters, is Sri Lanka's most sacred mountain and a pilgrimage site for Buddhists, Hindus, Christians, and Muslims alike. The conical mountain is renowned for the 'sacred footprint' at its summit - believed by Buddhists to be Buddha's, by Hindus as Shiva's, by Christians as Adam's, and by Muslims as Adam's first step on Earth after being cast out of paradise. The challenging night climb rewards pilgrims with a spectacular sunrise and the mysterious triangular shadow the peak casts at dawn.",
    highlights: [
      "Sacred footprint revered by four religions",
      "Spectacular sunrise views above the clouds",
      "5,500 steps illuminated during pilgrimage season",
      "Unique triangular shadow phenomenon at sunrise",
      "UNESCO World Heritage buffer zone",
      "Peak Wilderness Sanctuary biodiversity",
      "December to May pilgrimage season",
      "Ancient pilgrimage route over 1,000 years old"
    ]
  },
  seo: {
    title: "Adam's Peak Sri Lanka - Sacred Mountain Pilgrimage & Sunrise Trek | Recharge Travels",
    description: "Climb Adam's Peak (Sri Pada), Sri Lanka's sacred mountain. Experience the spiritual pilgrimage, witness spectacular sunrise views, and join thousands on this ancient trail with Recharge Travels.",
    keywords: "Adam's Peak Sri Lanka, Sri Pada pilgrimage, sacred mountain trek, sunrise Adam's Peak, Buddhist pilgrimage, Adam's Peak climbing season, sacred footprint, Sri Lanka hiking tours"
  },
  attractions: [
    {
      id: '1',
      name: "Sacred Footprint (Sri Pada)",
      description: "The 1.8-meter rock formation at the summit bearing a footprint-like indentation, covered by a golden canopy. This sacred site is the focal point of pilgrimage for multiple faiths.",
      image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&q=80",
      category: "Sacred Site",
      rating: 5.0,
      duration: "At summit",
      price: "Free",
      highlights: ["Multi-faith Site", "Golden Canopy", "Sacred Bells", "Prayer Offerings"]
    },
    {
      id: '2',
      name: "Sunrise Viewing",
      description: "The breathtaking sunrise view from the summit is legendary, with the sun rising above a sea of clouds. The peak casts a perfect triangular shadow on the clouds below.",
      image: "https://images.unsplash.com/photo-1486870591958-9b9d0d1dda99?auto=format&fit=crop&q=80",
      category: "Natural Phenomenon",
      rating: 4.9,
      duration: "6:00-6:30 AM",
      price: "Free",
      highlights: ["Triangular Shadow", "Sea of Clouds", "360° Views", "Photo Opportunity"]
    },
    {
      id: '3',
      name: "Peace Pagoda (Sama Chetiya)",
      description: "Japanese Peace Pagoda located along the climbing route, offering a rest point and spectacular views. Built to promote world peace and harmony among religions.",
      image: "https://images.unsplash.com/photo-1545558014-8692077e9b5c?auto=format&fit=crop&q=80",
      category: "Religious",
      rating: 4.6,
      duration: "30 minutes",
      price: "Free",
      highlights: ["Japanese Architecture", "Rest Point", "Valley Views", "Meditation Space"]
    },
    {
      id: '4',
      name: "Seetha Gangula (Cold Stream)",
      description: "A sacred stream about halfway up the mountain where pilgrims traditionally bathe and refresh themselves. The cold mountain water is believed to have healing properties.",
      image: "https://images.unsplash.com/photo-1596040033550-d0c85b8c8b23?auto=format&fit=crop&q=80",
      category: "Natural",
      rating: 4.5,
      duration: "15 minutes",
      price: "Free",
      highlights: ["Sacred Bathing", "Mountain Stream", "Rest Area", "Refreshment Point"]
    },
    {
      id: '5',
      name: "Dalhousie Town",
      description: "The main starting point for the pilgrimage, this small town comes alive during climbing season with shops, restaurants, and accommodation for pilgrims.",
      image: "https://images.unsplash.com/photo-1519904981063-b0cf448d479e?auto=format&fit=crop&q=80",
      category: "Base Town",
      rating: 4.4,
      duration: "Overnight stay",
      price: "Varies",
      highlights: ["Starting Point", "Pilgrim Facilities", "Supplies", "Accommodation"]
    },
    {
      id: '6',
      name: "Peak Wilderness Sanctuary",
      description: "The mountain is surrounded by pristine forest reserve, home to endemic species including leopards, endemic birds, and unique montane vegetation.",
      image: "https://images.unsplash.com/photo-1511497584788-876760111969?auto=format&fit=crop&q=80",
      category: "Nature Reserve",
      rating: 4.7,
      duration: "Various trails",
      price: "Included",
      highlights: ["Endemic Species", "Cloud Forest", "Biodiversity", "Protected Area"]
    }
  ],
  activities: [
    {
      id: '1',
      name: "Traditional Night Climb",
      description: "Join thousands of pilgrims on the illuminated trail starting at 2 AM",
      icon: Moon,
      price: "From $50",
      duration: "6-8 hours",
      popular: true
    },
    {
      id: '2',
      name: "Guided Pilgrimage Tour",
      description: "Expert guides share religious significance and assist with the climb",
      icon: Users,
      price: "From $75",
      duration: "Full experience",
      popular: true
    },
    {
      id: '3',
      name: "Sunrise Photography Tour",
      description: "Specialized tour for photographers to capture the perfect sunrise",
      icon: Camera,
      price: "From $100",
      duration: "Overnight"
    },
    {
      id: '4',
      name: "Off-Season Day Hike",
      description: "Less crowded daytime climb during off-season months",
      icon: Sun,
      price: "From $60",
      duration: "8-10 hours"
    },
    {
      id: '5',
      name: "Alternative Route Trek",
      description: "Explore less-traveled routes through Peak Wilderness",
      icon: Footprints,
      price: "From $80",
      duration: "Full day"
    },
    {
      id: '6',
      name: "Cultural Experience Tour",
      description: "Learn about multi-faith traditions and local customs",
      icon: Heart,
      price: "From $40",
      duration: "Half day"
    }
  ],
  itineraries: [
    {
      id: '1',
      title: "Classic Adam's Peak Pilgrimage",
      duration: "2 Days / 1 Night",
      description: "Traditional pilgrimage experience with night climb for sunrise",
      highlights: [
        "Day 1: Arrival in Dalhousie, preparation, early dinner",
        "Night: Begin climb at 2 AM with pilgrim crowds",
        "Dawn: Reach summit for sunrise and shadow phenomenon",
        "Morning: Sacred footprint viewing and descent",
        "Afternoon: Rest and return journey",
        "Includes guide, transport, and basic accommodation"
      ],
      price: "From $120 per person"
    },
    {
      id: '2',
      title: "Adam's Peak Spiritual Journey",
      duration: "3 Days / 2 Nights",
      description: "In-depth pilgrimage with cultural immersion and comfortable pace",
      highlights: [
        "Day 1: Nallathanniya route exploration, acclimatization",
        "Visit local temples and prepare for climb",
        "Day 2: Night climb with experienced guide",
        "Summit sunrise ceremony participation",
        "Extended time at peak for meditation",
        "Day 3: Alternative descent route, waterfall visit",
        "Cultural interactions with fellow pilgrims"
      ],
      price: "From $250 per person"
    },
    {
      id: '3',
      title: "Peak District Explorer",
      duration: "4 Days / 3 Nights",
      description: "Comprehensive tour including Adam's Peak and surrounding attractions",
      highlights: [
        "Adam's Peak traditional climb",
        "Horton Plains National Park visit",
        "Tea plantation tours in Nuwara Eliya",
        "Waterfall exploration (Devon, St. Clair's)",
        "Colonial hill station experience",
        "Multiple sunrise opportunities",
        "Comfortable hotels throughout"
      ],
      price: "From $450 per person"
    }
  ],
  faqs: [
    {
      id: '1',
      question: "When is the best time to climb Adam's Peak?",
      answer: "The pilgrimage season runs from December to May (full moon in May marks the end). During this time, the path is illuminated and facilities are open. January to March offers the best weather. Avoid monsoon months (May-November) when the path can be dangerous. Weekends and full moon days are extremely crowded."
    },
    {
      id: '2',
      question: "How difficult is the climb to Adam's Peak?",
      answer: "The climb involves 5,500 steps over 7km, gaining 1,000m in elevation. It's physically demanding but doable for people with moderate fitness. The night climb takes 3-6 hours depending on fitness and crowds. Take breaks, stay hydrated, and go at your own pace. Children and elderly people regularly complete it."
    },
    {
      id: '3',
      question: "What should I wear and bring for the climb?",
      answer: "Wear layers as it's cold at start/summit but you'll warm up climbing. Essential items: warm jacket, comfortable shoes with good grip, flashlight/headlamp, water (2-3 liters), snacks, rain jacket, small towel, and cash for donations. Dress modestly for religious sites. Walking stick helpful for descent."
    },
    {
      id: '4',
      question: "What time should I start climbing?",
      answer: "Most pilgrims start between 2-3 AM to reach the summit by sunrise (around 6:15 AM). This allows 3-4 hours for climbing. Starting earlier avoids crowds. Some prefer afternoon starts to see sunset and sunrise, but this requires summit camping. Check sunrise times for your specific date."
    },
    {
      id: '5',
      question: "Are there facilities along the climbing route?",
      answer: "During pilgrimage season, tea shops (rotis) line the route offering refreshments, snacks, and basic meals. Toilet facilities are available but basic. The path is well-lit with electric lights. Rest areas with benches appear regularly. At summit, basic facilities exist but are crowded."
    },
    {
      id: '6',
      question: "What is the religious significance of Adam's Peak?",
      answer: "Adam's Peak is sacred to four religions. Buddhists believe the footprint is Buddha's from his third visit to Sri Lanka. Hindus attribute it to Shiva. Christians and Muslims believe it's Adam's first footprint after exile from Eden. This multi-faith reverence makes it uniquely harmonious pilgrimage site."
    }
  ],
  gallery: [
    "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1486870591958-9b9d0d1dda99?auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1545558014-8692077e9b5c?auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1519904981063-b0cf448d479e?auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1511497584788-876760111969?auto=format&fit=crop&q=80"
  ],
  travelTips: [
    {
      id: '1',
      title: "Climbing Season",
      icon: Calendar,
      tips: [
        "December to May: Official pilgrimage season",
        "January to March: Best weather conditions",
        "Avoid full moon days if you dislike crowds",
        "Weekdays less crowded than weekends",
        "May to November: Off-season, challenging weather"
      ]
    },
    {
      id: '2',
      title: "Essential Preparation",
      icon: AlertCircle,
      tips: [
        "Start training weeks before (stairs, hiking)",
        "Pack warm clothes - summit is cold",
        "Bring 2-3 liters of water per person",
        "Wear shoes with excellent grip",
        "Carry some cash for donations/tea shops",
        "Bring plastic bags for shoes at temple"
      ]
    },
    {
      id: '3',
      title: "Climbing Tips",
      icon: Mountain,
      tips: [
        "Start climb between 2-3 AM for sunrise",
        "Take regular breaks, don't rush",
        "Use handrails, especially descending",
        "Stay hydrated throughout climb",
        "Respect religious customs at summit",
        "Begin descent soon after sunrise to avoid crowds"
      ]
    }
  ]
};

const AdamsPeak = () => {
  const [content, setContent] = useState<AdamsPeakContent>(defaultContent);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [selectedTab, setSelectedTab] = useState('attractions');
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [selectedService, setSelectedService] = useState<string>('');
  const [galleryIndex, setGalleryIndex] = useState(0);

  // Load content from Firebase and set up real-time listener
  useEffect(() => {
    const docRef = doc(db, 'destinations', 'adamspeak');
    
    // Set up real-time listener
    const unsubscribe = onSnapshot(docRef, (docSnap) => {
      if (docSnap.exists()) {
        const data = docSnap.data() as AdamsPeakContent;
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
    temperature: "5-15°C at summit",
    season: "Cool mountain climate",
    rainfall: "Dry (Dec-Apr), Wet (May-Nov)"
  };

  const destinationInfo: DestinationInfo = {
    population: "Dalhousie: 3,000",
    area: "Peak Wilderness: 224 km²",
    elevation: "2,243m (7,359 ft)",
    bestTime: "December to May",
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
    "name": "Adam's Peak (Sri Pada), Sri Lanka",
    "description": content.overview.description,
    "image": content.hero.slides.map(slide => slide.image),
    "touristType": ["Religious Tourism", "Adventure Tourism", "Pilgrimage"],
    "geo": {
      "@type": "GeoCoordinates",
      "latitude": "6.8095",
      "longitude": "80.4994"
    },
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": "4.9",
      "reviewCount": "5234"
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
        <meta property="og:url" content="https://recharge-travels-73e76.web.app/destinations/adams-peak" />
        <meta property="og:type" content="website" />
        
        {/* Twitter Card Tags */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={content.seo.title} />
        <meta name="twitter:description" content={content.seo.description} />
        <meta name="twitter:image" content={content.hero.slides[0].image} />
        
        {/* Canonical URL */}
        <link rel="canonical" href="https://recharge-travels-73e76.web.app/destinations/adams-peak" />
        
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
                  onClick={() => handleBooking('Adam\'s Peak Pilgrimage Tour')}
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
                <Footprints className="w-4 h-4" />
                <span>Steps: 5,500</span>
              </div>
              <div className="flex items-center gap-2">
                <Sunrise className="w-4 h-4" />
                <span>Sunrise: ~6:15 AM</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                <span>Season: {destinationInfo.bestTime}</span>
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
                <h3 className="text-3xl font-bold mb-8 text-center">Key Points of Adam's Peak</h3>
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
                <h3 className="text-3xl font-bold mb-8 text-center">Adam's Peak Experiences</h3>
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
                <h3 className="text-3xl font-bold mb-8 text-center">Adam's Peak Tour Packages</h3>
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
                <h3 className="text-3xl font-bold mb-8 text-center">Essential Tips for Adam's Peak</h3>
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
            <h3 className="text-3xl font-bold mb-8 text-center">Getting to Adam's Peak</h3>
            <div className="grid lg:grid-cols-2 gap-8">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Map className="w-5 h-5 text-blue-600" />
                    Location & Routes
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="aspect-video rounded-lg overflow-hidden mb-6">
                    <iframe
                      src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d15843.885755877834!2d80.4908!3d6.8095!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3ae3f3b2d0c49e2d%3A0x9b4b6b8c8dc5bdb8!2sAdam&#39;s%20Peak!5e0!3m2!1sen!2sus!4v1647887431289!5m2!1sen!2sus"
                      width="100%"
                      height="100%"
                      style={{ border: 0 }}
                      allowFullScreen
                      loading="lazy"
                      referrerPolicy="no-referrer-when-downgrade"
                      title="Adam's Peak Map"
                    ></iframe>
                  </div>
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-semibold mb-2">From Colombo (150 km)</h4>
                      <p className="text-sm text-muted-foreground">
                        • Via Hatton: 4 hours (most popular)<br />
                        • Via Ratnapura: 3.5 hours<br />
                        • Start from Dalhousie (Nallathanniya)
                      </p>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-2">From Kandy (85 km)</h4>
                      <p className="text-sm text-muted-foreground">
                        • Via Hatton: 2.5 hours<br />
                        • Train to Hatton + road transfer<br />
                        • Scenic hill country route
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Navigation className="w-5 h-5 text-blue-600" />
                    Climbing Routes
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="p-4 bg-blue-50 rounded-lg">
                    <h4 className="font-semibold mb-2">Guided Pilgrimage Tours</h4>
                    <p className="text-sm">
                      Join our experienced guides for a safe and meaningful climb. 
                      Includes transport, guide, and support throughout the journey.
                    </p>
                    <Button 
                      className="mt-3 bg-blue-600 hover:bg-blue-700"
                      onClick={() => handleBooking('Adam\'s Peak Guided Climb')}
                    >
                      Book Guided Tour
                    </Button>
                  </div>
                  <div className="space-y-2">
                    <p className="text-sm flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                      Nallathanniya Route: Most popular, well-lit, 7km
                    </p>
                    <p className="text-sm flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                      Ratnapura Route: Longer, less crowded, scenic
                    </p>
                    <p className="text-sm flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                      Kuruwita Route: Most challenging, least developed
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
            <h3 className="text-3xl font-bold mb-8 text-center">Adam's Peak Gallery</h3>
            <div className="relative rounded-lg overflow-hidden aspect-video max-w-4xl mx-auto">
              <AnimatePresence mode="wait">
                <motion.img
                  key={galleryIndex}
                  src={content.gallery[galleryIndex]}
                  alt={`Adam's Peak gallery image ${galleryIndex + 1}`}
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
              Ready for Your Sacred Journey?
            </h2>
            <p className="text-xl mb-8 max-w-2xl mx-auto">
              Join thousands of pilgrims on this spiritual adventure to witness the sunrise from Sri Lanka's sacred peak
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                size="lg" 
                className="bg-white text-blue-600 hover:bg-gray-100"
                onClick={() => handleBooking('Adam\'s Peak Complete Package')}
              >
                <Phone className="w-5 h-5 mr-2" />
                Book Your Pilgrimage
              </Button>
              <Button 
                size="lg" 
                variant="outline"
                className="bg-transparent text-white border-white hover:bg-white/20"
                onClick={() => window.location.href = 'mailto:info@rechargetravels.com?subject=Adams Peak Inquiry'}
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

export default AdamsPeak;
