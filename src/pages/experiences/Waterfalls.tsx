import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Droplets,
  MapPin,
  Clock,
  Mountain,
  Camera,
  Star,
  ChevronRight,
  ChevronLeft,
  Waves,
  TreePine,
  Navigation,
  Footprints,
  Sun,
  Thermometer,
  Calendar,
  Users,
  Heart,
  Sparkles,
  Info,
  CheckCircle,
  X
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Link } from 'react-router-dom';

// Comprehensive waterfall data for Sri Lanka
const waterfalls = [
  {
    id: 1,
    name: "Bambarakanda Falls",
    height: "263m",
    rank: "Tallest in Sri Lanka",
    location: "Kalupahana",
    district: "Badulla",
    province: "Uva",
    description: "Sri Lanka's tallest waterfall at 263 meters, cascading majestically from the Walawe River. A spectacular sight during monsoon season with hiking trails leading to breathtaking viewpoints.",
    highlights: ["Tallest waterfall", "Monsoon spectacular", "Hiking trails", "Photography paradise"],
    bestTime: "January - April",
    difficulty: "Moderate",
    duration: "2-3 hours",
    rating: 4.9,
    reviews: 2840,
    image: "https://images.unsplash.com/photo-1432405972618-c60b0225b8f9?w=1200&h=800&fit=crop",
    gallery: ["https://images.unsplash.com/photo-1432405972618-c60b0225b8f9?w=800&h=600&fit=crop"],
    coordinates: { lat: 6.8167, lng: 80.8333 }
  },
  {
    id: 2,
    name: "Diyaluma Falls",
    height: "220m",
    rank: "2nd Highest",
    location: "Koslanda",
    district: "Badulla",
    province: "Uva",
    description: "Second-highest waterfall featuring stunning natural infinity pools at different levels. The hike to the top rewards visitors with magnificent views and swimming in serene pools.",
    highlights: ["Natural infinity pools", "Swimming spots", "Epic viewpoints", "Cliff jumping"],
    bestTime: "Year-round",
    difficulty: "Moderate to Hard",
    duration: "3-4 hours",
    rating: 4.9,
    reviews: 3150,
    image: "https://images.unsplash.com/photo-1546587348-d12660c30c50?w=1200&h=800&fit=crop",
    gallery: ["https://images.unsplash.com/photo-1546587348-d12660c30c50?w=800&h=600&fit=crop"],
    coordinates: { lat: 6.7500, lng: 81.0333 }
  },
  {
    id: 3,
    name: "Kurundu Oya Falls",
    height: "189m",
    rank: "3rd Highest",
    location: "Walapane",
    district: "Nuwara Eliya",
    province: "Central",
    description: "Also known as Maturata Ella, this is the third-highest waterfall in Sri Lanka. Located in a pristine wilderness area with stunning mountain scenery.",
    highlights: ["Third highest", "Remote location", "Pristine wilderness", "Mountain views"],
    bestTime: "December - April",
    difficulty: "Hard",
    duration: "4-5 hours",
    rating: 4.7,
    reviews: 680,
    image: "https://images.unsplash.com/photo-1482938289607-e9573fc25ebb?w=1200&h=800&fit=crop",
    gallery: ["https://images.unsplash.com/photo-1482938289607-e9573fc25ebb?w=800&h=600&fit=crop"],
    coordinates: { lat: 7.0500, lng: 80.8500 }
  },
  {
    id: 4,
    name: "Laxapana Falls",
    height: "129m",
    rank: "Power Generator",
    location: "Hatton",
    district: "Nuwara Eliya",
    province: "Central",
    description: "A cascade of silvery foam amid lush greenery, one of Sri Lanka's most powerful waterfalls. Home to the first hydroelectric power station in the country.",
    highlights: ["Hydroelectric history", "Silvery cascade", "Tea country", "Photography spot"],
    bestTime: "May - September",
    difficulty: "Moderate",
    duration: "2-3 hours",
    rating: 4.7,
    reviews: 1280,
    image: "https://images.unsplash.com/photo-1475113548554-5a36f1f523d6?w=1200&h=800&fit=crop",
    gallery: ["https://images.unsplash.com/photo-1475113548554-5a36f1f523d6?w=800&h=600&fit=crop"],
    coordinates: { lat: 6.9500, lng: 80.5000 }
  },
  {
    id: 5,
    name: "Kirindi Ella",
    height: "116m",
    rank: "Jungle Gem",
    location: "Pelmadulla",
    district: "Ratnapura",
    province: "Sabaragamuwa",
    description: "A breathtaking waterfall surrounded by the Kaluwaramukalana Jungle. Home to exotic animals and birds, steeped in local folklore and mysteries.",
    highlights: ["Jungle setting", "Wildlife spotting", "Rich folklore", "Remote beauty"],
    bestTime: "May - September",
    difficulty: "Moderate",
    duration: "2-3 hours",
    rating: 4.6,
    reviews: 920,
    image: "https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?w=1200&h=800&fit=crop",
    gallery: ["https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?w=800&h=600&fit=crop"],
    coordinates: { lat: 6.6167, lng: 80.4000 }
  },
  {
    id: 6,
    name: "Devon Falls",
    height: "97m",
    rank: "Veil of the Valley",
    location: "Talawakele",
    district: "Nuwara Eliya",
    province: "Central",
    description: "Named after British planter Mr. Devon, visible from Talawakele road. Best viewed from the Mlesna Tea Castle observation deck amid stunning tea plantations.",
    highlights: ["Tea castle viewpoint", "Roadside access", "Photography paradise", "Tea tasting"],
    bestTime: "December - April",
    difficulty: "Easy",
    duration: "30 mins - 1 hour",
    rating: 4.5,
    reviews: 1620,
    image: "https://images.unsplash.com/photo-1433086966358-54859d0ed716?w=1200&h=800&fit=crop",
    gallery: ["https://images.unsplash.com/photo-1433086966358-54859d0ed716?w=800&h=600&fit=crop"],
    coordinates: { lat: 6.9167, lng: 80.6000 }
  },
  {
    id: 7,
    name: "St. Clair's Falls",
    height: "80m",
    rank: "Widest Waterfall",
    location: "Hatton",
    district: "Nuwara Eliya",
    province: "Central",
    description: "Known as the 'Little Niagara of Sri Lanka', this is the widest waterfall in the country. Features twin cascades and stunning tea country views.",
    highlights: ["Widest waterfall", "Twin cascades", "Tea country views", "Observation deck"],
    bestTime: "December - April",
    difficulty: "Easy",
    duration: "1-2 hours",
    rating: 4.6,
    reviews: 1860,
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=1200&h=800&fit=crop",
    gallery: ["https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&h=600&fit=crop"],
    coordinates: { lat: 6.9333, lng: 80.6333 }
  },
  {
    id: 8,
    name: "Huluganga Falls",
    height: "75m",
    rank: "Hidden Beauty",
    location: "Huluganga Town",
    district: "Kandy",
    province: "Central",
    description: "A hidden gem near Kandy, cascading through lush forest. Less crowded than popular waterfalls, offering a peaceful natural experience.",
    highlights: ["Less crowded", "Near Kandy", "Forest setting", "Peaceful atmosphere"],
    bestTime: "Year-round",
    difficulty: "Easy to Moderate",
    duration: "1-2 hours",
    rating: 4.4,
    reviews: 540,
    image: "https://images.unsplash.com/photo-1494820532095-c95b2d6f9e18?w=1200&h=800&fit=crop",
    gallery: ["https://images.unsplash.com/photo-1494820532095-c95b2d6f9e18?w=800&h=600&fit=crop"],
    coordinates: { lat: 7.3500, lng: 80.6833 }
  },
  {
    id: 9,
    name: "Dunhinda Falls",
    height: "63m",
    rank: "Bridal Falls",
    location: "Badulla",
    district: "Badulla",
    province: "Uva",
    description: "Known as 'Bridal Falls' for its misty spray resembling a bridal veil. Reach via a scenic 1km hike crossing a suspension bridge and steep steps.",
    highlights: ["Bridal veil mist", "Suspension bridge", "Nature trail", "Swimming pool"],
    bestTime: "Year-round",
    difficulty: "Easy to Moderate",
    duration: "2-3 hours",
    rating: 4.7,
    reviews: 2190,
    image: "https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=1200&h=800&fit=crop",
    gallery: ["https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=800&h=600&fit=crop"],
    coordinates: { lat: 7.0167, lng: 81.0500 }
  },
  {
    id: 10,
    name: "Hunnas Falls",
    height: "60m",
    rank: "Kandy Escape",
    location: "Elkaduwa",
    district: "Kandy",
    province: "Central",
    description: "A beautiful waterfall near Kandy surrounded by spice gardens and tea estates. Popular for its accessibility and scenic surroundings.",
    highlights: ["Near Kandy", "Spice gardens", "Tea estates", "Easy access"],
    bestTime: "Year-round",
    difficulty: "Easy",
    duration: "1-2 hours",
    rating: 4.5,
    reviews: 890,
    image: "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=1200&h=800&fit=crop",
    gallery: ["https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=800&h=600&fit=crop"],
    coordinates: { lat: 7.3667, lng: 80.6833 }
  },
  {
    id: 11,
    name: "Bomburu Ella",
    height: "50m",
    rank: "Uva Province Gem",
    location: "Perawella",
    district: "Badulla",
    province: "Uva",
    description: "A picturesque waterfall in the Uva Province, surrounded by untouched natural beauty. Perfect for those seeking off-the-beaten-path experiences.",
    highlights: ["Off-beaten path", "Natural beauty", "Quiet location", "Photography"],
    bestTime: "January - April",
    difficulty: "Moderate",
    duration: "2-3 hours",
    rating: 4.3,
    reviews: 420,
    image: "https://images.unsplash.com/photo-1518495973542-4542c06a5843?w=1200&h=800&fit=crop",
    gallery: ["https://images.unsplash.com/photo-1518495973542-4542c06a5843?w=800&h=600&fit=crop"],
    coordinates: { lat: 6.9000, lng: 80.9500 }
  },
  {
    id: 12,
    name: "Bopath Ella Falls",
    height: "30m",
    rank: "Sacred Fig Shape",
    location: "Kuruwita",
    district: "Ratnapura",
    province: "Sabaragamuwa",
    description: "Named for its resemblance to a sacred 'Bo' (fig) tree leaf shape. Rich in folklore and mystery, a major attraction near the gem city Ratnapura.",
    highlights: ["Unique shape", "Rich folklore", "Near Ratnapura", "Swimming allowed"],
    bestTime: "May - September",
    difficulty: "Easy",
    duration: "1-2 hours",
    rating: 4.4,
    reviews: 1090,
    image: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=1200&h=800&fit=crop",
    gallery: ["https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=800&h=600&fit=crop"],
    coordinates: { lat: 6.7500, lng: 80.3667 }
  },
  {
    id: 13,
    name: "Lovers Leap",
    height: "30m",
    rank: "Romantic Spot",
    location: "Nuwara Eliya",
    district: "Nuwara Eliya",
    province: "Central",
    description: "A romantic waterfall nestled among tea plantation hills near Pedro Tea Estate. A lesser-known gem perfect for couples and peaceful exploration.",
    highlights: ["Romantic setting", "Tea hills", "Pedro Estate", "Quiet location"],
    bestTime: "December - April",
    difficulty: "Easy",
    duration: "1-2 hours",
    rating: 4.3,
    reviews: 680,
    image: "https://images.unsplash.com/photo-1472214103451-9374bd1c798e?w=1200&h=800&fit=crop",
    gallery: ["https://images.unsplash.com/photo-1472214103451-9374bd1c798e?w=800&h=600&fit=crop"],
    coordinates: { lat: 6.9500, lng: 80.7667 }
  },
  {
    id: 14,
    name: "Baker's Falls",
    height: "20m",
    rank: "Horton Plains Gem",
    location: "Horton Plains National Park",
    district: "Nuwara Eliya",
    province: "Central",
    description: "Named after explorer Sir Samuel Baker, located in Horton Plains National Park. Part of the famous World's End trail with endemic flora and cool climate.",
    highlights: ["World's End trail", "National Park", "Endemic flora", "Cool climate"],
    bestTime: "January - March",
    difficulty: "Moderate",
    duration: "4-5 hours (full trail)",
    rating: 4.8,
    reviews: 2840,
    image: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=1200&h=800&fit=crop",
    gallery: ["https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800&h=600&fit=crop"],
    coordinates: { lat: 6.8000, lng: 80.8000 }
  },
  {
    id: 15,
    name: "Manawela Falls",
    height: "22m",
    rank: "Historic Site",
    location: "Lunuwatta",
    district: "Badulla",
    province: "Uva",
    description: "A historic waterfall associated with King Manabarana. Combines natural beauty with cultural heritage in the scenic Uva Province.",
    highlights: ["Historic site", "King Manabarana", "Cultural heritage", "Scenic beauty"],
    bestTime: "Year-round",
    difficulty: "Easy",
    duration: "1-2 hours",
    rating: 4.2,
    reviews: 320,
    image: "https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=1200&h=800&fit=crop",
    gallery: ["https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=800&h=600&fit=crop"],
    coordinates: { lat: 6.9833, lng: 81.0167 }
  },
  {
    id: 16,
    name: "Garandi Ella (Kandy)",
    height: "100m",
    rank: "Kalugala Beauty",
    location: "Kalugala",
    district: "Kandy",
    province: "Central",
    description: "A stunning 100-meter cascade in the Kalugala area near Kandy. Surrounded by dense forest and offering spectacular views of the central highlands.",
    highlights: ["100m cascade", "Dense forest", "Highland views", "Less crowded"],
    bestTime: "May - September",
    difficulty: "Moderate to Hard",
    duration: "3-4 hours",
    rating: 4.5,
    reviews: 480,
    image: "https://images.unsplash.com/photo-1493246507139-91e8fad9978e?w=1200&h=800&fit=crop",
    gallery: ["https://images.unsplash.com/photo-1493246507139-91e8fad9978e?w=800&h=600&fit=crop"],
    coordinates: { lat: 7.2500, lng: 80.6333 }
  }
];

// Hero images for the slider
const heroImages = [
  {
    url: "https://images.unsplash.com/photo-1432405972618-c60b0225b8f9?w=1920&h=1080&fit=crop",
    title: "Majestic Cascades",
    subtitle: "Discover Sri Lanka's Hidden Water Wonders"
  },
  {
    url: "https://images.unsplash.com/photo-1546587348-d12660c30c50?w=1920&h=1080&fit=crop",
    title: "Natural Infinity Pools",
    subtitle: "Swim in Nature's Most Beautiful Creations"
  },
  {
    url: "https://images.unsplash.com/photo-1475113548554-5a36f1f523d6?w=1920&h=1080&fit=crop",
    title: "Misty Mountains",
    subtitle: "Where Water Meets the Clouds"
  }
];

const Waterfalls = () => {
  const [heroIndex, setHeroIndex] = useState(0);
  const [selectedWaterfall, setSelectedWaterfall] = useState<typeof waterfalls[0] | null>(null);
  const [filter, setFilter] = useState<'all' | 'easy' | 'moderate' | 'hard'>('all');

  // Auto-rotate hero images
  React.useEffect(() => {
    const timer = setInterval(() => {
      setHeroIndex((prev) => (prev + 1) % heroImages.length);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  const filteredWaterfalls = waterfalls.filter(w => {
    if (filter === 'all') return true;
    if (filter === 'easy') return w.difficulty.toLowerCase().includes('easy');
    if (filter === 'moderate') return w.difficulty.toLowerCase().includes('moderate');
    if (filter === 'hard') return w.difficulty.toLowerCase().includes('hard');
    return true;
  });

  return (
    <>
      <Helmet>
        <title>Waterfalls in Sri Lanka - Discover 10+ Stunning Cascades | Recharge Travels</title>
        <meta name="description" content="Explore Sri Lanka's most beautiful waterfalls including Bambarakanda (263m), Diyaluma Falls with natural pools, and the legendary Ravana Falls. Book guided waterfall tours today." />
        <meta name="keywords" content="Sri Lanka waterfalls, Bambarakanda Falls, Diyaluma Falls, Ravana Falls, Dunhinda Falls, waterfall tours Sri Lanka, natural pools Sri Lanka" />
        <link rel="canonical" href="https://www.rechargetravels.com/experiences/waterfalls" />
      </Helmet>

      <Header />

      <main className="min-h-screen bg-gradient-to-b from-cyan-50 via-blue-50 to-white">
        {/* Hero Section with Water Theme */}
        <section className="relative h-[85vh] overflow-hidden">
          <AnimatePresence mode="wait">
            <motion.div
              key={heroIndex}
              initial={{ opacity: 0, scale: 1.1 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1 }}
              className="absolute inset-0"
            >
              <img
                src={heroImages[heroIndex].url}
                alt={heroImages[heroIndex].title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-b from-cyan-900/40 via-blue-900/50 to-slate-900/70" />
            </motion.div>
          </AnimatePresence>

          {/* Water droplet animation overlay */}
          <div className="absolute inset-0 pointer-events-none">
            {[...Array(20)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-1 h-1 bg-white/30 rounded-full"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `-5%`
                }}
                animate={{
                  y: ['0vh', '110vh'],
                  opacity: [0, 1, 1, 0]
                }}
                transition={{
                  duration: 3 + Math.random() * 2,
                  repeat: Infinity,
                  delay: Math.random() * 3,
                  ease: 'linear'
                }}
              />
            ))}
          </div>

          {/* Hero Content */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center px-4 max-w-5xl">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="mb-6"
              >
                <Badge className="bg-cyan-500/90 text-white px-6 py-2 text-sm font-medium backdrop-blur-sm">
                  <Droplets className="w-4 h-4 mr-2 inline" />
                  Waterfall Adventures
                </Badge>
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="text-5xl md:text-7xl font-bold text-white mb-6 drop-shadow-lg"
              >
                <span className="bg-gradient-to-r from-cyan-300 via-blue-200 to-white bg-clip-text text-transparent">
                  {heroImages[heroIndex].title}
                </span>
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 }}
                className="text-xl md:text-2xl text-cyan-100 mb-10 max-w-3xl mx-auto"
              >
                {heroImages[heroIndex].subtitle}
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.9 }}
                className="flex flex-wrap gap-4 justify-center"
              >
                <Button
                  size="lg"
                  className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white px-8 py-6 text-lg rounded-full shadow-xl"
                  onClick={() => document.getElementById('waterfalls')?.scrollIntoView({ behavior: 'smooth' })}
                >
                  <Waves className="w-5 h-5 mr-2" />
                  Explore Waterfalls
                </Button>
                <Link to="/book-now">
                  <Button
                    size="lg"
                    variant="outline"
                    className="border-2 border-white/50 text-white hover:bg-white/20 px-8 py-6 text-lg rounded-full backdrop-blur-sm"
                  >
                    Book a Tour
                    <ChevronRight className="w-5 h-5 ml-2" />
                  </Button>
                </Link>
              </motion.div>
            </div>
          </div>

          {/* Hero Navigation */}
          <div className="absolute bottom-32 left-1/2 -translate-x-1/2 flex gap-3">
            {heroImages.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setHeroIndex(idx)}
                className={`w-3 h-3 rounded-full transition-all ${
                  idx === heroIndex ? 'bg-cyan-400 w-8' : 'bg-white/50 hover:bg-white/80'
                }`}
              />
            ))}
          </div>

          {/* Scroll indicator */}
          <motion.div
            className="absolute bottom-44 left-1/2 -translate-x-1/2"
            animate={{ y: [0, 10, 0] }}
            transition={{ repeat: Infinity, duration: 2 }}
          >
            <Droplets className="w-8 h-8 text-cyan-300" />
          </motion.div>
        </section>

        {/* Quick Stats */}
        <section className="relative z-10 px-4 py-12">
          <div className="container mx-auto max-w-6xl">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { icon: Mountain, value: "263m", label: "Tallest Fall", color: "from-cyan-500 to-blue-600" },
                { icon: Droplets, value: "40+", label: "Major Waterfalls", color: "from-blue-500 to-indigo-600" },
                { icon: TreePine, value: "4", label: "Provinces", color: "from-emerald-500 to-teal-600" },
                { icon: Camera, value: "∞", label: "Photo Spots", color: "from-purple-500 to-pink-600" }
              ].map((stat, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  className={`bg-gradient-to-br ${stat.color} rounded-2xl p-6 text-white shadow-xl`}
                >
                  <stat.icon className="w-8 h-8 mb-3 opacity-80" />
                  <div className="text-3xl font-bold">{stat.value}</div>
                  <div className="text-sm opacity-80">{stat.label}</div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Filter Section */}
        <section className="py-12 px-4">
          <div className="container mx-auto max-w-6xl">
            <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
              <div>
                <h2 className="text-3xl font-bold text-slate-800">Discover Sri Lanka's Waterfalls</h2>
                <p className="text-slate-600 mt-1">Filter by difficulty level</p>
              </div>
              <div className="flex gap-2 flex-wrap">
                {[
                  { key: 'all', label: 'All Waterfalls' },
                  { key: 'easy', label: 'Easy Access' },
                  { key: 'moderate', label: 'Moderate Hike' },
                  { key: 'hard', label: 'Adventure' }
                ].map((f) => (
                  <Button
                    key={f.key}
                    variant={filter === f.key ? 'default' : 'outline'}
                    className={filter === f.key 
                      ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white' 
                      : 'border-cyan-300 text-cyan-700 hover:bg-cyan-50'}
                    onClick={() => setFilter(f.key as any)}
                  >
                    {f.label}
                  </Button>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Waterfalls Grid */}
        <section id="waterfalls" className="pb-20 px-4">
          <div className="container mx-auto max-w-7xl">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredWaterfalls.map((waterfall, idx) => (
                <motion.div
                  key={waterfall.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  viewport={{ once: true }}
                >
                  <Card className="group overflow-hidden rounded-3xl border-0 shadow-xl hover:shadow-2xl transition-all duration-500 bg-white">
                    {/* Image */}
                    <div className="relative h-64 overflow-hidden">
                      <img
                        src={waterfall.image}
                        alt={waterfall.name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-transparent to-transparent" />
                      
                      {/* Badges */}
                      <div className="absolute top-4 left-4 flex gap-2">
                        <Badge className="bg-cyan-500 text-white">
                          <Mountain className="w-3 h-3 mr-1" />
                          {waterfall.height}
                        </Badge>
                        <Badge className="bg-amber-500 text-white">
                          {waterfall.rank}
                        </Badge>
                      </div>

                      {/* Rating */}
                      <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm rounded-full px-3 py-1 flex items-center gap-1">
                        <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
                        <span className="font-semibold text-slate-800">{waterfall.rating}</span>
                      </div>

                      {/* Title Overlay */}
                      <div className="absolute bottom-4 left-4 right-4">
                        <h3 className="text-2xl font-bold text-white mb-1">{waterfall.name}</h3>
                        <div className="flex items-center text-cyan-200 text-sm">
                          <MapPin className="w-4 h-4 mr-1" />
                          {waterfall.location}, {waterfall.district}
                        </div>
                      </div>
                    </div>

                    {/* Content */}
                    <CardContent className="p-6">
                      <p className="text-slate-600 text-sm mb-4 line-clamp-2">{waterfall.description}</p>

                      {/* Quick Info */}
                      <div className="grid grid-cols-3 gap-3 mb-4">
                        <div className="text-center p-2 bg-cyan-50 rounded-xl">
                          <Footprints className="w-4 h-4 mx-auto text-cyan-600 mb-1" />
                          <div className="text-xs text-slate-600">{waterfall.difficulty}</div>
                        </div>
                        <div className="text-center p-2 bg-blue-50 rounded-xl">
                          <Clock className="w-4 h-4 mx-auto text-blue-600 mb-1" />
                          <div className="text-xs text-slate-600">{waterfall.duration}</div>
                        </div>
                        <div className="text-center p-2 bg-emerald-50 rounded-xl">
                          <Calendar className="w-4 h-4 mx-auto text-emerald-600 mb-1" />
                          <div className="text-xs text-slate-600">{waterfall.bestTime.split(' ')[0]}</div>
                        </div>
                      </div>

                      {/* Highlights */}
                      <div className="flex flex-wrap gap-2 mb-4">
                        {waterfall.highlights.slice(0, 3).map((h, i) => (
                          <span key={i} className="text-xs px-2 py-1 bg-slate-100 text-slate-600 rounded-full">
                            {h}
                          </span>
                        ))}
                      </div>

                      {/* Actions */}
                      <div className="flex gap-3">
                        <Button
                          className="flex-1 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white rounded-xl"
                          onClick={() => setSelectedWaterfall(waterfall)}
                        >
                          View Details
                        </Button>
                        <Button
                          variant="outline"
                          className="border-cyan-300 text-cyan-700 hover:bg-cyan-50 rounded-xl"
                        >
                          <Heart className="w-4 h-4" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Best Time to Visit */}
        <section className="py-20 px-4 bg-gradient-to-r from-cyan-600 via-blue-600 to-indigo-600 text-white">
          <div className="container mx-auto max-w-6xl">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold mb-4">Best Time to Visit</h2>
              <p className="text-cyan-100 max-w-2xl mx-auto">
                Plan your waterfall adventure based on seasonal conditions
              </p>
            </div>

            <div className="grid md:grid-cols-4 gap-6">
              {[
                { 
                  season: "Dec - Mar", 
                  title: "Peak Season", 
                  desc: "Best visibility, lower water levels ideal for swimming",
                  icon: Sun,
                  highlight: true
                },
                { 
                  season: "Apr - Jun", 
                  title: "Monsoon Start", 
                  desc: "Waterfalls at full power, lush greenery",
                  icon: Droplets,
                  highlight: false
                },
                { 
                  season: "Jul - Sep", 
                  title: "Southwest Monsoon", 
                  desc: "Western waterfalls spectacular, trails may be slippery",
                  icon: Waves,
                  highlight: false
                },
                { 
                  season: "Oct - Nov", 
                  title: "Inter-Monsoon", 
                  desc: "Moderate water flow, good photography conditions",
                  icon: Camera,
                  highlight: false
                }
              ].map((period, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  className={`p-6 rounded-2xl ${
                    period.highlight 
                      ? 'bg-white text-slate-800 shadow-xl' 
                      : 'bg-white/10 backdrop-blur-sm'
                  }`}
                >
                  <period.icon className={`w-10 h-10 mb-4 ${period.highlight ? 'text-cyan-600' : 'text-cyan-300'}`} />
                  <div className={`text-sm font-medium mb-1 ${period.highlight ? 'text-cyan-600' : 'text-cyan-300'}`}>
                    {period.season}
                  </div>
                  <h3 className="text-xl font-bold mb-2">{period.title}</h3>
                  <p className={`text-sm ${period.highlight ? 'text-slate-600' : 'text-cyan-100'}`}>
                    {period.desc}
                  </p>
                  {period.highlight && (
                    <Badge className="mt-3 bg-amber-500 text-white">Recommended</Badge>
                  )}
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Safety Tips */}
        <section className="py-20 px-4">
          <div className="container mx-auto max-w-6xl">
            <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-3xl p-8 md:p-12 text-white">
              <div className="flex items-center gap-3 mb-8">
                <div className="w-12 h-12 bg-amber-500 rounded-full flex items-center justify-center">
                  <Info className="w-6 h-6" />
                </div>
                <h2 className="text-3xl font-bold">Safety Tips for Waterfall Visits</h2>
              </div>

              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[
                  "Wear sturdy, non-slip footwear for wet rocks",
                  "Never swim during heavy rainfall or floods",
                  "Follow designated trails and safety signs",
                  "Carry drinking water and light snacks",
                  "Inform someone about your hiking plans",
                  "Don't climb on wet, mossy rocks near edges"
                ].map((tip, idx) => (
                  <div key={idx} className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-emerald-400 mt-0.5 flex-shrink-0" />
                    <span className="text-slate-300">{tip}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 px-4 bg-gradient-to-r from-cyan-50 to-blue-50">
          <div className="container mx-auto max-w-4xl text-center">
            <Sparkles className="w-12 h-12 text-cyan-500 mx-auto mb-6" />
            <h2 className="text-4xl font-bold text-slate-800 mb-4">
              Ready to Chase Waterfalls?
            </h2>
            <p className="text-slate-600 text-lg mb-8 max-w-2xl mx-auto">
              Let us plan your perfect waterfall adventure with expert guides, 
              comfortable transport, and unforgettable experiences.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link to="/book-now">
                <Button size="lg" className="bg-gradient-to-r from-cyan-500 to-blue-600 text-white px-8 py-6 text-lg rounded-full">
                  Plan My Trip
                  <ChevronRight className="w-5 h-5 ml-2" />
                </Button>
              </Link>
              <Link to="/contact">
                <Button size="lg" variant="outline" className="border-2 border-cyan-500 text-cyan-700 px-8 py-6 text-lg rounded-full">
                  Contact Us
                </Button>
              </Link>
            </div>
          </div>
        </section>

        {/* Waterfall Detail Modal */}
        <AnimatePresence>
          {selectedWaterfall && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/95 z-[9999] flex items-center justify-center p-4 overflow-y-auto"
              onClick={() => setSelectedWaterfall(null)}
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0, y: 20 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.9, opacity: 0, y: 20 }}
                transition={{ type: "spring", damping: 25 }}
                className="bg-white rounded-3xl max-w-5xl w-full max-h-[90vh] overflow-y-auto shadow-2xl"
                onClick={(e) => e.stopPropagation()}
              >
                {/* Modal Header Image */}
                <div className="relative h-72 md:h-80">
                  <img
                    src={selectedWaterfall.image}
                    alt={selectedWaterfall.name}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-slate-900/40 to-transparent" />
                  <button
                    onClick={() => setSelectedWaterfall(null)}
                    className="absolute top-4 right-4 w-12 h-12 bg-white/95 rounded-full flex items-center justify-center hover:bg-white transition-colors shadow-lg"
                  >
                    <X className="w-6 h-6 text-slate-700" />
                  </button>
                  <div className="absolute bottom-6 left-6 right-6">
                    <div className="flex items-center gap-2 mb-2">
                      <Badge className="bg-cyan-500 text-white px-3 py-1">{selectedWaterfall.height}</Badge>
                      <Badge className="bg-amber-500 text-white px-3 py-1">{selectedWaterfall.rank}</Badge>
                      <Badge className="bg-emerald-500 text-white px-3 py-1">{selectedWaterfall.province} Province</Badge>
                    </div>
                    <h2 className="text-3xl md:text-4xl font-bold text-white">{selectedWaterfall.name}</h2>
                    <div className="flex items-center text-cyan-200 mt-2 text-lg">
                      <MapPin className="w-5 h-5 mr-2" />
                      {selectedWaterfall.location}, {selectedWaterfall.district} District
                    </div>
                  </div>
                </div>

                {/* Modal Content */}
                <div className="p-6 md:p-8">
                  <p className="text-slate-600 text-lg mb-6">{selectedWaterfall.description}</p>

                  {/* Info Grid */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                    <div className="bg-cyan-50 rounded-xl p-4 text-center">
                      <Footprints className="w-6 h-6 mx-auto text-cyan-600 mb-2" />
                      <div className="font-semibold text-slate-800">{selectedWaterfall.difficulty}</div>
                      <div className="text-xs text-slate-500">Difficulty</div>
                    </div>
                    <div className="bg-blue-50 rounded-xl p-4 text-center">
                      <Clock className="w-6 h-6 mx-auto text-blue-600 mb-2" />
                      <div className="font-semibold text-slate-800">{selectedWaterfall.duration}</div>
                      <div className="text-xs text-slate-500">Duration</div>
                    </div>
                    <div className="bg-emerald-50 rounded-xl p-4 text-center">
                      <Calendar className="w-6 h-6 mx-auto text-emerald-600 mb-2" />
                      <div className="font-semibold text-slate-800">{selectedWaterfall.bestTime}</div>
                      <div className="text-xs text-slate-500">Best Time</div>
                    </div>
                    <div className="bg-amber-50 rounded-xl p-4 text-center">
                      <Star className="w-6 h-6 mx-auto text-amber-500 mb-2" />
                      <div className="font-semibold text-slate-800">{selectedWaterfall.rating}/5</div>
                      <div className="text-xs text-slate-500">{selectedWaterfall.reviews} reviews</div>
                    </div>
                  </div>

                  {/* Highlights */}
                  <div className="mb-6">
                    <h3 className="font-semibold text-slate-800 mb-3">Highlights</h3>
                    <div className="flex flex-wrap gap-2">
                      {selectedWaterfall.highlights.map((h, i) => (
                        <Badge key={i} variant="outline" className="border-cyan-300 text-cyan-700">
                          <CheckCircle className="w-3 h-3 mr-1" />
                          {h}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  {/* Map Section */}
                  <div className="mb-6">
                    <h3 className="font-semibold text-slate-800 mb-3 flex items-center gap-2">
                      <Navigation className="w-5 h-5 text-cyan-600" />
                      Location Map
                    </h3>
                    <div className="rounded-xl overflow-hidden border border-slate-200 shadow-sm">
                      <iframe
                        src={`https://www.google.com/maps/embed/v1/place?key=AIzaSyBFw0Qbyq9zTFTd-tUY6dZWTgaQzuU17R8&q=${selectedWaterfall.name},Sri+Lanka&zoom=12&maptype=satellite`}
                        width="100%"
                        height="300"
                        style={{ border: 0 }}
                        allowFullScreen
                        loading="lazy"
                        referrerPolicy="no-referrer-when-downgrade"
                        title={`${selectedWaterfall.name} Location`}
                        className="w-full"
                      />
                    </div>
                    <div className="mt-3 flex items-center justify-between text-sm">
                      <span className="text-slate-500">
                        📍 Coordinates: {selectedWaterfall.coordinates.lat.toFixed(4)}°N, {selectedWaterfall.coordinates.lng.toFixed(4)}°E
                      </span>
                      <a
                        href={`https://www.google.com/maps/search/?api=1&query=${selectedWaterfall.coordinates.lat},${selectedWaterfall.coordinates.lng}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-cyan-600 hover:text-cyan-700 font-medium flex items-center gap-1"
                      >
                        Open in Google Maps
                        <ChevronRight className="w-4 h-4" />
                      </a>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-4">
                    <Link to="/book-now" className="flex-1">
                      <Button className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 text-white py-6 text-lg rounded-xl hover:from-cyan-600 hover:to-blue-700 shadow-lg">
                        Book This Tour
                        <ChevronRight className="w-5 h-5 ml-2" />
                      </Button>
                    </Link>
                    <Button
                      variant="outline"
                      className="border-cyan-300 text-cyan-700 py-6 px-6 rounded-xl hover:bg-cyan-50"
                    >
                      <Heart className="w-5 h-5" />
                    </Button>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      <Footer />
    </>
  );
};

export default Waterfalls;
