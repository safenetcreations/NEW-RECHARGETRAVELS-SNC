import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { useNavigate } from 'react-router-dom';
import { collection, doc, getDoc, getDocs, query, orderBy } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useQuery } from '@tanstack/react-query';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Heart,
  Mountain,
  Camera,
  Clock,
  MapPin,
  Calendar,
  Star,
  Users,
  Sunrise,
  Moon,
  ChevronDown,
  CheckCircle,
  Info,
  DollarSign,
  ChevronRight,
  Globe,
  Phone,
  Mail,
  Building,
  Flower,
  Sparkles,
  Shield,
  Award
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';

// Optimized image URL generator
const getOptimizedImageUrl = (url: string, width: number = 1200): string => {
  if (!url) return '';
  if (url.includes('unsplash.com')) {
    const baseUrl = url.split('?')[0];
    return `${baseUrl}?w=${width}&q=80&auto=format&fit=crop`;
  }
  return url;
};

// Types
interface PilgrimageData {
  hero: {
    title: string;
    subtitle: string;
    backgroundImage: string;
    ctaText: string;
    ctaLink: string;
  };
  intro: {
    introParagraph: string;
  };
  highlights: Array<{
    icon: string;
    title: string;
    blurb60: string;
  }>;
  cta: {
    headline: string;
    subtitle: string;
    buttonText: string;
    buttonLink: string;
  };
}

interface PilgrimageSite {
  id: string;
  name: string;
  description: string;
  location: string;
  significance: string;
  features?: string[];
  highlights?: string[];
  bestTime?: string;
  duration?: string;
  climbDuration?: string;
  altitude?: string;
  religion?: string;
  thumbnail?: string;
  image?: string;
  isActive?: boolean;
  isPublished?: boolean;
  order: number;
}

interface PilgrimageTour {
  id: string;
  title: string;
  thumbnail: string;
  badges: string[];
  duration: string;
  salePriceUSD: number;
  regularPriceUSD?: number;
  highlights: string[];
  included: string[];
  type: string;
  description?: string;
  isPublished: boolean;
  order: number;
}

interface GalleryImage {
  id: string;
  url: string;
  alt: string;
  caption?: string;
  order: number;
}

interface FAQ {
  id: string;
  question: string;
  answer: string;
  order: number;
  isActive: boolean;
}

interface Testimonial {
  id: string;
  name: string;
  country: string;
  comment: string;
  rating: number;
  tourName?: string;
  isActive: boolean;
}

// Default data
const defaultData: PilgrimageData = {
  hero: {
    title: 'Sacred Pilgrimage Sites',
    subtitle: 'Spiritual Journeys Through Sri Lanka\'s Holy Places',
    backgroundImage: 'https://images.unsplash.com/photo-1590329273188-041ec23505f7?q=80&w=3840&h=2160&auto=format&fit=crop',
    ctaText: 'Begin Your Pilgrimage',
    ctaLink: '#tours'
  },
  intro: {
    introParagraph: "Sri Lanka is a land of profound spirituality, where ancient temples, sacred mountains, and holy shrines draw pilgrims from around the world. Experience the island's rich religious heritage through visits to Buddhist temples, Hindu kovils, historic mosques, and Catholic churches, each offering unique spiritual experiences and architectural wonders."
  },
  highlights: [
    { icon: "🛕", title: "Sacred Temples", blurb60: "Visit ancient Buddhist temples and Hindu kovils with centuries of spiritual significance." },
    { icon: "🏔️", title: "Holy Mountains", blurb60: "Climb Sri Pada (Adam's Peak) and witness the sacred footprint revered by all faiths." },
    { icon: "🙏", title: "Multi-Faith Sites", blurb60: "Experience the harmony of Buddhism, Hinduism, Christianity, and Islam in one journey." },
    { icon: "🌅", title: "Spiritual Ceremonies", blurb60: "Participate in authentic pujas, offerings, and religious ceremonies with local devotees." }
  ],
  cta: {
    headline: "Begin Your Spiritual Journey",
    subtitle: "Let us guide you through Sri Lanka's sacred sites with respect, understanding, and authentic spiritual experiences.",
    buttonText: "Book Pilgrimage Tour",
    buttonLink: "/booking/pilgrimage"
  }
};

const defaultSites: PilgrimageSite[] = [
  {
    id: '1',
    name: "Sri Pada (Adam's Peak)",
    description: "Sacred mountain revered by all religions, with the famous 'sacred footprint' at its summit.",
    location: "Central Highlands",
    significance: "Multi-religious pilgrimage site",
    highlights: ["Sacred Footprint", "Sunrise Views", "Bell Tower", "Shadow Phenomenon"],
    bestTime: "December to May",
    duration: "6-8 hours climb",
    religion: "Buddhist, Hindu, Christian, Muslim",
    image: "https://images.unsplash.com/photo-1609920658906-8223bd289001?w=800&auto=format&fit=crop",
    isActive: true,
    order: 0
  },
  {
    id: '2',
    name: "Temple of the Tooth (Dalada Maligawa)",
    description: "Houses the sacred tooth relic of Lord Buddha, Sri Lanka's most important Buddhist shrine.",
    location: "Kandy",
    significance: "UNESCO World Heritage Site",
    highlights: ["Sacred Tooth Relic", "Daily Rituals", "Museum", "Royal Palace Complex"],
    bestTime: "During Puja times",
    duration: "2-3 hours",
    religion: "Buddhist",
    image: "https://images.unsplash.com/photo-1590329273188-041ec23505f7?w=800&auto=format&fit=crop",
    isActive: true,
    order: 1
  },
  {
    id: '3',
    name: "Kataragama",
    description: "Multi-religious sacred city dedicated to Kataragama deviyo, revered by Buddhists, Hindus, and Muslims.",
    location: "Southern Province",
    significance: "Multi-faith worship center",
    highlights: ["Maha Devale", "Kiri Vehera", "Sacred Bo Tree", "Annual Festival"],
    bestTime: "July-August (Festival)",
    duration: "Half day",
    religion: "Buddhist, Hindu, Muslim",
    image: "https://images.unsplash.com/photo-1582568653140-d688528df885?w=800&auto=format&fit=crop",
    isActive: true,
    order: 2
  },
  {
    id: '4',
    name: "Anuradhapura Sacred City",
    description: "Ancient capital with sacred Buddhist sites including the Sri Maha Bodhi tree grown from Buddha's enlightenment tree.",
    location: "North Central Province",
    significance: "UNESCO World Heritage Site",
    highlights: ["Sri Maha Bodhi", "Ruwanwelisaya", "Jetavanaramaya", "Mihintale"],
    bestTime: "Year-round",
    duration: "Full day",
    religion: "Buddhist",
    image: "https://images.unsplash.com/photo-1552832230-c0197dd311b5?w=800&auto=format&fit=crop",
    isActive: true,
    order: 3
  }
];

const defaultTours: PilgrimageTour[] = [
  {
    id: '1',
    title: "Buddhist Heritage Circuit",
    duration: "5 Days / 4 Nights",
    salePriceUSD: 449,
    regularPriceUSD: 549,
    thumbnail: "https://images.unsplash.com/photo-1590329273188-041ec23505f7?w=800&auto=format&fit=crop",
    badges: ["Bestseller", "Small Group"],
    highlights: ["Temple of Tooth visit", "Anuradhapura sacred sites", "Mihintale monastery", "Dambulla Cave Temple"],
    included: ["Accommodation", "Buddhist guide", "All temple entries", "Vegetarian meals", "Transportation"],
    type: "Buddhist",
    isPublished: true,
    order: 0
  },
  {
    id: '2',
    title: "Adam's Peak Pilgrimage",
    duration: "2 Days / 1 Night",
    salePriceUSD: 149,
    thumbnail: "https://images.unsplash.com/photo-1609920658906-8223bd289001?w=800&auto=format&fit=crop",
    badges: ["Adventure", "Early Start"],
    highlights: ["Guided night climb", "Sunrise at summit", "All safety equipment", "Sacred footprint visit"],
    included: ["Base accommodation", "Professional guide", "Packed meals", "Headlamps", "First aid support"],
    type: "Multi-faith",
    isPublished: true,
    order: 1
  },
  {
    id: '3',
    title: "Multi-Faith Harmony Tour",
    duration: "7 Days / 6 Nights",
    salePriceUSD: 699,
    regularPriceUSD: 849,
    thumbnail: "https://images.unsplash.com/photo-1582568653140-d688528df885?w=800&auto=format&fit=crop",
    badges: ["Premium", "Private"],
    highlights: ["Buddhist temples", "Hindu kovils", "Historic mosques", "Catholic churches", "Interfaith dialogue"],
    included: ["All accommodations", "Multi-lingual guide", "All entrance fees", "Meals (special diets)", "AC transportation"],
    type: "Multi-faith",
    isPublished: true,
    order: 2
  },
  {
    id: '4',
    title: "Sacred Triangle Tour",
    duration: "3 Days / 2 Nights",
    salePriceUSD: 299,
    thumbnail: "https://images.unsplash.com/photo-1552832230-c0197dd311b5?w=800&auto=format&fit=crop",
    badges: ["Popular"],
    highlights: ["Kandy Temple of Tooth", "Anuradhapura Bodhi Tree", "Mihintale climb", "Ancient stupas"],
    included: ["Heritage hotels", "Expert guide", "Temple offerings", "All meals", "Private transport"],
    type: "Buddhist",
    isPublished: true,
    order: 3
  }
];

const defaultGallery: GalleryImage[] = [
  { id: '1', url: 'https://images.unsplash.com/photo-1548013146-72479768bada?w=600&h=400&fit=crop', alt: 'Buddhist temple ceremony', order: 0 },
  { id: '2', url: 'https://images.unsplash.com/photo-1599834562135-59d6fb00066a?w=600&h=400&fit=crop', alt: 'Temple of the Tooth', order: 1 },
  { id: '3', url: 'https://images.unsplash.com/photo-1609920658906-8223bd289001?w=600&h=400&fit=crop', alt: "Adam's Peak sunrise", order: 2 },
  { id: '4', url: 'https://images.unsplash.com/photo-1602002418679-43121356bf41?w=600&h=400&fit=crop', alt: 'Ancient stupa', order: 3 },
  { id: '5', url: 'https://images.unsplash.com/photo-1590925538540-5cf86af3931d?w=600&h=400&fit=crop', alt: 'Sacred Bo tree', order: 4 },
  { id: '6', url: 'https://images.unsplash.com/photo-1582719508461-905c673771fd?w=600&h=400&fit=crop', alt: 'Temple interior', order: 5 }
];

const defaultFAQs: FAQ[] = [
  { id: '1', question: "What should I wear when visiting religious sites?", answer: "Dress modestly with covered shoulders and knees. White clothing is preferred for Buddhist temples. Remove shoes, hats, and sunglasses before entering sacred areas.", isActive: true, order: 0 },
  { id: '2', question: "Can non-believers visit these religious sites?", answer: "Yes, most religious sites welcome visitors of all faiths. Show respect for religious practices and customs. Some areas may be restricted to devotees only.", isActive: true, order: 1 },
  { id: '3', question: "What is the best time to climb Adam's Peak?", answer: "The pilgrimage season runs from December to May. Most pilgrims climb at night to reach the summit for sunrise. Start climbing between 2-4 AM for the best experience.", isActive: true, order: 2 },
  { id: '4', question: "What offerings should I bring to temples?", answer: "Common offerings include flowers (especially lotus), incense, oil for lamps, and fruits. These can usually be purchased near temple entrances.", isActive: true, order: 3 }
];

const PilgrimageTours = () => {
  const navigate = useNavigate();
  const [heroImageIndex, setHeroImageIndex] = useState(0);
  const [contactForm, setContactForm] = useState({ name: '', email: '', message: '' });

  const heroImages = [
    { url: 'https://images.unsplash.com/photo-1590329273188-041ec23505f7', caption: 'Temple of the Sacred Tooth Relic' },
    { url: 'https://images.unsplash.com/photo-1609920658906-8223bd289001', caption: "Sri Pada (Adam's Peak)" },
    { url: 'https://images.unsplash.com/photo-1552832230-c0197dd311b5', caption: 'Ancient Buddhist Temple' },
    { url: 'https://images.unsplash.com/photo-1582568653140-d688528df885', caption: 'Sacred Bodhi Tree' }
  ];

  // Fetch content from Firebase
  const { data: pageData } = useQuery({
    queryKey: ['pilgrimage-content'],
    queryFn: async () => {
      try {
        const [heroDoc, introDoc, highlightsDoc, ctaDoc] = await Promise.all([
          getDoc(doc(db, 'pilgrimage_content', 'hero')),
          getDoc(doc(db, 'pilgrimage_content', 'intro')),
          getDoc(doc(db, 'pilgrimage_content', 'highlights')),
          getDoc(doc(db, 'pilgrimage_content', 'cta'))
        ]);

        return {
          hero: heroDoc.exists() ? heroDoc.data() : defaultData.hero,
          intro: introDoc.exists() ? introDoc.data() : defaultData.intro,
          highlights: highlightsDoc.exists() ? highlightsDoc.data()?.items || defaultData.highlights : defaultData.highlights,
          cta: ctaDoc.exists() ? ctaDoc.data() : defaultData.cta
        };
      } catch (error) {
        console.error('Error fetching pilgrimage content:', error);
        return defaultData;
      }
    },
    staleTime: 5 * 60 * 1000
  });

  const { data: sites = defaultSites } = useQuery({
    queryKey: ['pilgrimage-sites'],
    queryFn: async () => {
      try {
        const q = query(collection(db, 'pilgrimage_sites'), orderBy('order', 'asc'));
        const snapshot = await getDocs(q);
        if (snapshot.empty) return defaultSites;
        return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as PilgrimageSite[];
      } catch (error) {
        return defaultSites;
      }
    },
    staleTime: 5 * 60 * 1000
  });

  const { data: tours = defaultTours } = useQuery({
    queryKey: ['pilgrimage-tours'],
    queryFn: async () => {
      try {
        const q = query(collection(db, 'pilgrimage_tours'), orderBy('order', 'asc'));
        const snapshot = await getDocs(q);
        if (snapshot.empty) return defaultTours;
        return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as PilgrimageTour[];
      } catch (error) {
        return defaultTours;
      }
    },
    staleTime: 5 * 60 * 1000
  });

  const { data: gallery = defaultGallery } = useQuery({
    queryKey: ['pilgrimage-gallery'],
    queryFn: async () => {
      try {
        const q = query(collection(db, 'pilgrimage_gallery'), orderBy('order', 'asc'));
        const snapshot = await getDocs(q);
        if (snapshot.empty) return defaultGallery;
        return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as GalleryImage[];
      } catch (error) {
        return defaultGallery;
      }
    },
    staleTime: 5 * 60 * 1000
  });

  const { data: faqs = defaultFAQs } = useQuery({
    queryKey: ['pilgrimage-faqs'],
    queryFn: async () => {
      try {
        const q = query(collection(db, 'pilgrimage_faqs'), orderBy('order', 'asc'));
        const snapshot = await getDocs(q);
        if (snapshot.empty) return defaultFAQs;
        return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as FAQ[];
      } catch (error) {
        return defaultFAQs;
      }
    },
    staleTime: 5 * 60 * 1000
  });

  const content = pageData || defaultData;

  useEffect(() => {
    const interval = setInterval(() => {
      setHeroImageIndex((prev) => (prev + 1) % heroImages.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const handleBookNow = (title?: string, price?: number, duration?: string) => {
    const params = new URLSearchParams({
      package: title || 'Sacred Pilgrimage Tour',
      price: (price || 299).toString(),
      duration: duration || '3 Days',
    });
    navigate(`/booking/pilgrimage?${params.toString()}`);
  };

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success('Thank you! We will contact you shortly.');
    setContactForm({ name: '', email: '', message: '' });
  };

  return (
    <>
      <Helmet>
        <title>Sri Lanka Pilgrimage Tours | Sacred Sites & Religious Tours | Recharge Travels</title>
        <meta name="description" content="Discover Sri Lanka's sacred pilgrimage sites including Adam's Peak, Temple of Tooth, and Kataragama. Book spiritual journeys with Recharge Travels." />
        <link rel="canonical" href="https://www.rechargetravels.com/experiences/pilgrimage-tours" />
      </Helmet>

      <Header />

      {/* Hero Section */}
      <section className="relative h-[70vh] min-h-[600px] w-full overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.div
            key={heroImageIndex}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1 }}
            className="absolute inset-0"
          >
            <img
              src={getOptimizedImageUrl(heroImages[heroImageIndex].url, 1920)}
              alt={heroImages[heroImageIndex].caption}
              className="w-full h-full object-cover"
              loading={heroImageIndex === 0 ? 'eager' : 'lazy'}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-amber-900/70 via-amber-900/40 to-amber-900/20" />
          </motion.div>
        </AnimatePresence>

        <div className="absolute inset-0 flex items-center justify-center z-10">
          <div className="text-center text-white px-4 max-w-5xl">
            <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
              <h1 className="text-5xl md:text-7xl font-bold mb-6 drop-shadow-lg">
                {content.hero?.title || 'Sacred Pilgrimage Sites'}
              </h1>
              <p className="text-xl md:text-2xl mb-8 font-light drop-shadow">
                {content.hero?.subtitle || "Spiritual Journeys Through Sri Lanka's Holy Places"}
              </p>
              <Button
                onClick={() => handleBookNow()}
                size="lg"
                className="bg-amber-600 hover:bg-amber-700 text-white px-8 py-6 text-lg rounded-full transform hover:scale-105 transition-all duration-300 shadow-xl"
              >
                <Heart className="mr-2 h-5 w-5" />
                {content.hero?.ctaText || 'Begin Your Pilgrimage'}
              </Button>
            </motion.div>
          </div>
        </div>

        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 1.5, repeat: Infinity }}
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2 text-white z-10"
        >
          <ChevronDown className="h-8 w-8" />
        </motion.div>
      </section>

      {/* Introduction Section */}
      <section className="py-16 px-4 bg-gradient-to-b from-amber-50 to-white">
        <div className="max-w-6xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-6 text-gray-800">Journey to Sacred Places of Worship</h2>
            <p className="text-xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
              {content.intro?.introParagraph || defaultData.intro.introParagraph}
            </p>
          </motion.div>

          {/* Highlights Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {(content.highlights || defaultData.highlights).map((highlight, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow border border-amber-100"
              >
                <div className="text-4xl mb-4">{highlight.icon}</div>
                <h3 className="font-bold text-lg mb-2 text-gray-800">{highlight.title}</h3>
                <p className="text-gray-600 text-sm">{highlight.blurb60}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Sacred Sites Section */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12 text-gray-800">Major Pilgrimage Destinations</h2>
          <div className="grid md:grid-cols-2 gap-6">
            {sites.filter(s => s.isPublished !== false).map((site, index) => (
              <motion.div
                key={site.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="overflow-hidden hover:shadow-xl transition-all duration-300 border border-amber-100 bg-white h-full">
                  {site.image && (
                    <div className="h-48 overflow-hidden">
                      <img
                        src={getOptimizedImageUrl(site.image, 600)}
                        alt={site.name}
                        className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                        loading="lazy"
                      />
                    </div>
                  )}
                  <CardHeader className="bg-gradient-to-r from-amber-50 to-orange-50">
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-xl text-gray-800">{site.name}</CardTitle>
                        <div className="flex items-center gap-3 text-sm text-gray-600 mt-2">
                          <span className="flex items-center"><MapPin className="h-4 w-4 mr-1 text-amber-600" />{site.location}</span>
                          <span className="flex items-center"><Clock className="h-4 w-4 mr-1 text-amber-600" />{site.duration}</span>
                        </div>
                      </div>
                      <Badge className="bg-amber-600 text-white">{site.significance}</Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-4 space-y-4">
                    <p className="text-gray-600">{site.description}</p>
                    {site.significance && (
                      <Badge variant="outline" className="border-amber-300 text-amber-700">{site.significance}</Badge>
                    )}
                    {site.features && site.features.length > 0 && (
                      <div>
                        <p className="font-semibold text-sm text-gray-700 mb-2">Key Features:</p>
                        <div className="flex flex-wrap gap-2">
                          {site.features.map((h, idx) => (
                            <Badge key={idx} className="bg-amber-100 text-amber-800 hover:bg-amber-200">{h}</Badge>
                          ))}
                        </div>
                      </div>
                    )}
                    <div className="flex items-center justify-between pt-4 border-t border-amber-100">
                      {site.bestTime && (
                        <span className="text-sm text-gray-600 flex items-center">
                          <Sunrise className="h-4 w-4 mr-1 text-amber-600" />Best: {site.bestTime}
                        </span>
                      )}
                      <Button onClick={() => handleBookNow(`${site.name} Pilgrimage`, 199, site.climbDuration || '1 Day')} className="bg-amber-600 hover:bg-amber-700">
                        Book Visit
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Tour Packages Section */}
      <section id="tours" className="py-16 px-4 bg-gradient-to-b from-amber-50 to-white">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-4 text-gray-800">Curated Pilgrimage Packages</h2>
          <p className="text-center text-gray-600 mb-12 max-w-2xl mx-auto">
            Choose from our carefully designed spiritual journeys, each offering authentic experiences and expert guidance.
          </p>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {tours.filter(t => t.isPublished !== false).map((tour, index) => (
              <motion.div
                key={tour.id}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="h-full hover:shadow-xl transition-all duration-300 border border-amber-100 bg-white overflow-hidden group">
                  <div className="relative h-48 overflow-hidden">
                    <img
                      src={getOptimizedImageUrl(tour.thumbnail, 400)}
                      alt={tour.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      loading="lazy"
                    />
                    <div className="absolute top-3 left-3 flex gap-2">
                      {tour.badges?.slice(0, 2).map((badge, idx) => (
                        <Badge key={idx} className="bg-amber-600 text-white text-xs">{badge}</Badge>
                      ))}
                    </div>
                    {tour.regularPriceUSD && tour.regularPriceUSD > tour.salePriceUSD && (
                      <Badge className="absolute top-3 right-3 bg-green-600 text-white">
                        Save ${tour.regularPriceUSD - tour.salePriceUSD}
                      </Badge>
                    )}
                  </div>
                  <CardContent className="pt-4 space-y-4">
                    <div>
                      <h3 className="font-bold text-lg text-gray-800">{tour.title}</h3>
                      <p className="text-sm text-gray-600 flex items-center mt-1">
                        <Clock className="h-4 w-4 mr-1 text-amber-600" />{tour.duration}
                      </p>
                    </div>
                    <div className="flex items-baseline gap-2">
                      <span className="text-2xl font-bold text-amber-600">${tour.salePriceUSD}</span>
                      {tour.regularPriceUSD && tour.regularPriceUSD > tour.salePriceUSD && (
                        <span className="text-sm text-gray-400 line-through">${tour.regularPriceUSD}</span>
                      )}
                      <span className="text-sm text-gray-500">/person</span>
                    </div>
                    <ul className="space-y-1">
                      {tour.highlights?.slice(0, 3).map((h, idx) => (
                        <li key={idx} className="text-sm text-gray-600 flex items-start">
                          <CheckCircle className="h-4 w-4 text-amber-600 mr-2 mt-0.5 flex-shrink-0" />
                          {h}
                        </li>
                      ))}
                    </ul>
                    <Button
                      className="w-full bg-amber-600 hover:bg-amber-700"
                      onClick={() => handleBookNow(tour.title, tour.salePriceUSD, tour.duration)}
                    >
                      Book This Package
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Photo Gallery */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12 text-gray-800">Sacred Moments Captured</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {gallery.map((image, index) => (
              <motion.div
                key={image.id}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.05 }}
                className="relative overflow-hidden rounded-xl group cursor-pointer aspect-[4/3]"
              >
                <img
                  src={getOptimizedImageUrl(image.url, 400)}
                  alt={image.alt}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-amber-900/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                {image.caption && (
                  <p className="absolute bottom-3 left-3 right-3 text-white text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    {image.caption}
                  </p>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQs Section */}
      <section className="py-16 px-4 bg-gradient-to-b from-amber-50 to-white">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12 text-gray-800">Frequently Asked Questions</h2>
          <Accordion type="single" collapsible className="space-y-4">
            {faqs.filter(f => f.isActive !== false).map((faq, index) => (
              <AccordionItem key={faq.id} value={`item-${index}`} className="bg-white rounded-lg border border-amber-100 px-4">
                <AccordionTrigger className="text-left hover:text-amber-600 font-medium">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-gray-600">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </section>

      {/* Trust Indicators */}
      <section className="py-12 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { icon: Shield, label: "Safe & Secure", value: "100% Verified" },
              { icon: Star, label: "Traveler Rating", value: "4.9/5" },
              { icon: Users, label: "Happy Pilgrims", value: "5000+" },
              { icon: Award, label: "Years Experience", value: "15+" }
            ].map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="text-center p-6 bg-gradient-to-br from-amber-50 to-orange-50 rounded-xl border border-amber-100"
              >
                <stat.icon className="h-10 w-10 text-amber-600 mx-auto mb-3" />
                <div className="text-2xl font-bold text-gray-800">{stat.value}</div>
                <div className="text-gray-600 text-sm">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-gradient-to-br from-amber-600 to-orange-600">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <h2 className="text-4xl font-bold mb-6 text-white">
              {content.cta?.headline || 'Begin Your Spiritual Journey'}
            </h2>
            <p className="text-xl mb-8 text-white/90">
              {content.cta?.subtitle || "Let us guide you through Sri Lanka's sacred sites with respect and understanding."}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                size="lg"
                className="bg-white text-amber-700 hover:bg-amber-50 px-8 py-6 text-lg"
                onClick={() => handleBookNow()}
              >
                <Heart className="mr-2 h-5 w-5" />
                {content.cta?.buttonText || 'Book Pilgrimage Tour'}
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-white text-white hover:bg-white/10 px-8 py-6 text-lg"
                onClick={() => window.open('https://wa.me/94777721999', '_blank')}
              >
                <Phone className="mr-2 h-5 w-5" />
                Speak to Guide
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-16 px-4 bg-gradient-to-b from-amber-50 to-white">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12">
            <div>
              <h2 className="text-3xl font-bold mb-6 text-gray-800">Plan Your Pilgrimage</h2>
              <p className="text-gray-600 mb-8">
                Have questions about our spiritual journeys? Our pilgrimage specialists are here to help you plan the perfect experience.
              </p>
              <div className="space-y-4">
                <a href="tel:+94777721999" className="flex items-center gap-3 text-gray-700 hover:text-amber-600">
                  <div className="p-3 bg-amber-100 rounded-full"><Phone className="h-5 w-5 text-amber-600" /></div>
                  <span>+94 77 772 1999</span>
                </a>
                <a href="mailto:info@rechargetravels.com" className="flex items-center gap-3 text-gray-700 hover:text-amber-600">
                  <div className="p-3 bg-amber-100 rounded-full"><Mail className="h-5 w-5 text-amber-600" /></div>
                  <span>info@rechargetravels.com</span>
                </a>
                <div className="flex items-center gap-3 text-gray-700">
                  <div className="p-3 bg-amber-100 rounded-full"><Globe className="h-5 w-5 text-amber-600" /></div>
                  <span>www.rechargetravels.com</span>
                </div>
              </div>
            </div>
            <div>
              <Card className="border border-amber-100">
                <CardHeader>
                  <CardTitle className="text-gray-800">Quick Inquiry</CardTitle>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleContactSubmit} className="space-y-4">
                    <Input
                      placeholder="Your Name"
                      value={contactForm.name}
                      onChange={(e) => setContactForm({ ...contactForm, name: e.target.value })}
                      required
                    />
                    <Input
                      type="email"
                      placeholder="Your Email"
                      value={contactForm.email}
                      onChange={(e) => setContactForm({ ...contactForm, email: e.target.value })}
                      required
                    />
                    <Textarea
                      placeholder="Tell us about your pilgrimage plans..."
                      value={contactForm.message}
                      onChange={(e) => setContactForm({ ...contactForm, message: e.target.value })}
                      rows={4}
                      required
                    />
                    <Button type="submit" className="w-full bg-amber-600 hover:bg-amber-700">
                      Send Inquiry
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
};

export default PilgrimageTours;
