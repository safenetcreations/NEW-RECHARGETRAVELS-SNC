import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import {
  Sparkles,
  Camera,
  Heart,
  Leaf,
  Mountain,
  Anchor,
  ChefHat,
  Users,
  Star,
  Lock,
  ArrowRight,
  Search,
  Clock,
  MapPin,
  TrendingUp,
  Award,
  Shield,
  Headphones,
  Wind,
  Compass,
  Trees,
  Landmark,
  Gem
} from 'lucide-react';
import { experiencesByCategory } from '@/components/header/navigation/menuData';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { luxuryExperienceService } from '@/services/luxuryExperienceService';
import type { LuxuryExperience, ExperienceCategory } from '@/types/luxury-experience';
import { toast } from 'sonner';

const categoryIcons: Record<ExperienceCategory, any> = {
  'luxury-safari': Mountain,
  'photography-tours': Camera,
  'cultural-immersion': Heart,
  'wellness-retreats': Leaf,
  'adventure-expeditions': Wind,
  'marine-adventures': Anchor,
  'culinary-journeys': ChefHat,
  'romantic-escapes': Heart,
  'family-adventures': Users,
  'exclusive-access': Lock
};

const LuxuryExperiences = () => {
  const [experiences, setExperiences] = useState<LuxuryExperience[]>([]);
  const [filteredExperiences, setFilteredExperiences] = useState<LuxuryExperience[]>([]);
  const [featuredExperiences, setFeaturedExperiences] = useState<LuxuryExperience[]>([]);
  const [popularExperiences, setPopularExperiences] = useState<LuxuryExperience[]>([]);
  const [newExperiences, setNewExperiences] = useState<LuxuryExperience[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<ExperienceCategory | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [pageContent, setPageContent] = useState<any>(null);

  const categories = luxuryExperienceService.getCategories();

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    filterExperiences();
  }, [experiences, selectedCategory, searchQuery]);

  const loadData = async () => {
    try {
      setLoading(true);
      const [allExp, featuredExp, popularExp, newExp, content] = await Promise.all([
        luxuryExperienceService.getExperiences(),
        luxuryExperienceService.getFeaturedExperiences(6),
        luxuryExperienceService.getPopularExperiences(4),
        luxuryExperienceService.getNewExperiences(4),
        luxuryExperienceService.getPageContent()
      ]);
      setExperiences(allExp);
      setFeaturedExperiences(featuredExp);
      setPopularExperiences(popularExp);
      setNewExperiences(newExp);
      setPageContent(content);
    } catch (error) {
      console.error('Error loading experiences:', error);
      toast.error('Failed to load experiences');
    } finally {
      setLoading(false);
    }
  };

  const filterExperiences = () => {
    let filtered = [...experiences];
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(exp => exp.category === selectedCategory);
    }
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(exp =>
        exp.title.toLowerCase().includes(query) ||
        exp.shortDescription.toLowerCase().includes(query) ||
        exp.locations?.some(loc => loc.name.toLowerCase().includes(query))
      );
    }
    setFilteredExperiences(filtered);
  };

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category as ExperienceCategory | 'all');
  };

  return (
    <>
      <Helmet>
        <title>Curated Experiences Sri Lanka | Safari, Wellness, Adventure Tours - Recharge Travels</title>
        <meta name="description" content="Discover 50+ handcrafted luxury experiences in Sri Lanka. Safari, wellness retreats, culinary journeys, adventure expeditions, whale watching, hot air balloon rides, tea trails and cultural immersion tours. Book with 24/7 concierge support." />
        <meta name="keywords" content="Sri Lanka experiences, luxury tours, safari Sri Lanka, wellness retreats, adventure tours, cultural tours, whale watching, hot air balloon Sigiriya, cooking class Sri Lanka, tea trails, train journeys" />
        <link rel="canonical" href="https://www.rechargetravels.com/experiences" />
        <meta property="og:title" content="Curated Luxury Experiences in Sri Lanka - Recharge Travels" />
        <meta property="og:description" content="Discover 50+ handcrafted experiences: Safari, Wellness, Adventure, Cultural tours. 98% guest satisfaction. Book with confidence." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://www.rechargetravels.com/experiences" />
        <meta property="og:image" content="https://images.unsplash.com/photo-1539367628448-4bc5c9d171c8?w=1200" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Sri Lanka Luxury Experiences - Recharge Travels" />
        <meta name="twitter:description" content="50+ handcrafted experiences: Safari, Wellness, Adventure tours" />
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "CollectionPage",
            "name": "Sri Lanka Luxury Experiences",
            "description": "Curated collection of 50+ luxury experiences in Sri Lanka including safaris, wellness retreats, adventure tours, and cultural immersions.",
            "url": "https://www.rechargetravels.com/experiences",
            "mainEntity": {
              "@type": "ItemList",
              "itemListElement": [
                { "@type": "ListItem", "position": 1, "name": "Whale Watching Mirissa", "url": "https://www.rechargetravels.com/experiences/whale-watching" },
                { "@type": "ListItem", "position": 2, "name": "Hot Air Balloon Sigiriya", "url": "https://www.rechargetravels.com/experiences/hot-air-balloon-sigiriya" },
                { "@type": "ListItem", "position": 3, "name": "Tea Trails Ceylon", "url": "https://www.rechargetravels.com/experiences/tea-trails" },
                { "@type": "ListItem", "position": 4, "name": "Ayurveda Wellness Retreats", "url": "https://www.rechargetravels.com/experiences/ayurveda-wellness" },
                { "@type": "ListItem", "position": 5, "name": "Scenic Train Journeys", "url": "https://www.rechargetravels.com/experiences/train-journeys" },
                { "@type": "ListItem", "position": 6, "name": "Sri Lankan Cooking Classes", "url": "https://www.rechargetravels.com/experiences/cooking-class-sri-lanka" },
                { "@type": "ListItem", "position": 7, "name": "Hikkaduwa Water Sports", "url": "https://www.rechargetravels.com/experiences/hikkaduwa-water-sports" },
                { "@type": "ListItem", "position": 8, "name": "Jungle Camping Sinharaja", "url": "https://www.rechargetravels.com/experiences/jungle-camping" }
              ]
            },
            "provider": {
              "@type": "TravelAgency",
              "name": "Recharge Travels",
              "url": "https://www.rechargetravels.com",
              "telephone": "+94777721999"
            }
          })}
        </script>
      </Helmet>

      <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
        {/* Hero Section */}
        <section className="relative h-[70vh] overflow-hidden">
          <div className="absolute inset-0">
            <img
              src={pageContent?.heroImage || "https://images.unsplash.com/photo-1539367628448-4bc5c9d171c8?w=1920"}
              alt="Luxury Sri Lanka"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-black/70" />
          </div>

          <div className="relative z-10 h-full flex items-center justify-center text-center px-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="max-w-4xl mx-auto"
            >
              <div className="flex items-center justify-center gap-2 mb-6">
                <Sparkles className="w-8 h-8 text-amber-400" />
                <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white">
                  {pageContent?.heroTitle || 'Curated Experiences'}
                </h1>
                <Sparkles className="w-8 h-8 text-amber-400" />
              </div>
              <p className="text-xl md:text-2xl text-white/90 mb-8 font-light max-w-3xl mx-auto">
                {pageContent?.heroSubtitle || 'Handcrafted journeys that go beyond the ordinary, designed for discerning travelers seeking authentic luxury'}
              </p>

              {/* Search Bar */}
              <div className="max-w-xl mx-auto mb-8">
                <div className="relative">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <Input
                    placeholder="Search experiences..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-12 py-6 text-lg bg-white/95 backdrop-blur-sm border-0 shadow-xl"
                  />
                </div>
              </div>

              <Button
                size="lg"
                className="bg-amber-500 hover:bg-amber-600 text-white"
                onClick={() => document.getElementById('experiences')?.scrollIntoView({ behavior: 'smooth' })}
              >
                Explore All Experiences
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </motion.div>
          </div>

          {/* Stats Bar */}
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 to-transparent">
            <div className="container mx-auto px-4 py-8">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8 text-center text-white">
                <div className="flex flex-col items-center">
                  <Award className="w-6 h-6 text-amber-400 mb-2" />
                  <div className="text-2xl md:text-3xl font-bold text-amber-400">{pageContent?.stats?.experiences || '50+'}</div>
                  <div className="text-sm opacity-90">Curated Experiences</div>
                </div>
                <div className="flex flex-col items-center">
                  <Star className="w-6 h-6 text-amber-400 mb-2" />
                  <div className="text-2xl md:text-3xl font-bold text-amber-400">{pageContent?.stats?.satisfaction || '98%'}</div>
                  <div className="text-sm opacity-90">Guest Satisfaction</div>
                </div>
                <div className="flex flex-col items-center">
                  <Shield className="w-6 h-6 text-amber-400 mb-2" />
                  <div className="text-2xl md:text-3xl font-bold text-amber-400">{pageContent?.stats?.years || '15+'}</div>
                  <div className="text-sm opacity-90">Years of Excellence</div>
                </div>
                <div className="flex flex-col items-center">
                  <Headphones className="w-6 h-6 text-amber-400 mb-2" />
                  <div className="text-2xl md:text-3xl font-bold text-amber-400">24/7</div>
                  <div className="text-sm opacity-90">Concierge Support</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Experience Pillars */}
        <section className="bg-white py-12 border-b border-slate-200">
          <div className="container mx-auto px-4">
            <div className="flex flex-col gap-3 text-center mb-8">
              <p className="text-xs font-bold uppercase tracking-[0.3em] text-slate-500">Experience Pillars</p>
              <h2 className="text-3xl font-bold text-slate-900">Browse Experiences by Theme</h2>
              <p className="text-slate-600 max-w-3xl mx-auto">
                Jump into the most requested experiences, then dive deeper into their detailed pages.
              </p>
            </div>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {[
                { title: 'Train Journeys', href: '/experiences/train-journeys', description: 'Kandy–Ella panoramas, observation decks, and door-to-door transfers.' },
                { title: 'Island Getaways', href: '/experiences/island-getaways', description: 'Hidden beaches, boutique stays, and coastal slow travel.' },
                { title: 'Whale Watching', href: '/experiences/whale-watching', description: 'Mirissa and Trincomalee marine safaris with biologist crews.' },
                { title: 'Private Charters', href: '/experiences/private-charters', description: 'Yachts, helicopters, and jets on standby with concierge support.' },
                { title: 'Wellness & Ayurveda', href: '/experiences/wellness', description: 'Retreats, spa programs, and Ayurveda-led healing journeys.' },
                { title: 'Luxury Helicopter Charters', href: '/experiences/luxury/helicopter-charters', description: 'Point-to-point hops to tea country, national parks, and coastal resorts.' }
              ].map(link => (
                <Link
                  key={link.href}
                  to={link.href}
                  className="group rounded-2xl border border-slate-200 bg-slate-50 hover:border-amber-300 hover:bg-amber-50 transition-all duration-300 p-5 text-left shadow-sm hover:-translate-y-1"
                >
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-lg font-bold text-slate-900 group-hover:text-amber-700">{link.title}</h3>
                    <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-amber-600" />
                  </div>
                  <p className="text-sm text-slate-600">{link.description}</p>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* ALL EXPERIENCES - Quick Links Section */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <Badge className="bg-gradient-to-r from-amber-500 to-orange-500 text-white mb-4">Complete Guide</Badge>
              <h2 className="text-3xl md:text-4xl font-bold mb-4">All Sri Lanka Experiences</h2>
              <p className="text-gray-600 max-w-2xl mx-auto">Browse our complete collection of curated experiences across all categories</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {/* Adventure & Water Sports */}
              <div className="bg-gradient-to-br from-orange-50 to-red-50 rounded-2xl p-6 border border-orange-200">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-red-500 rounded-xl flex items-center justify-center text-white">
                    <Compass className="w-6 h-6" />
                  </div>
                  <h3 className="text-lg font-bold text-gray-900">{experiencesByCategory.adventure.title}</h3>
                </div>
                <div className="space-y-2">
                  {experiencesByCategory.adventure.experiences.map((exp) => (
                    <Link
                      key={exp.href}
                      to={exp.href}
                      className="block p-3 rounded-lg bg-white/80 hover:bg-white hover:shadow-md transition-all group"
                    >
                      <div className="font-semibold text-gray-800 group-hover:text-orange-600 flex items-center justify-between">
                        {exp.title}
                        <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                      </div>
                      <p className="text-xs text-gray-500 mt-1">{exp.description}</p>
                    </Link>
                  ))}
                </div>
              </div>

              {/* Wildlife & Nature */}
              <div className="bg-gradient-to-br from-emerald-50 to-green-50 rounded-2xl p-6 border border-emerald-200">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-green-500 rounded-xl flex items-center justify-center text-white">
                    <Trees className="w-6 h-6" />
                  </div>
                  <h3 className="text-lg font-bold text-gray-900">{experiencesByCategory.wildlife.title}</h3>
                </div>
                <div className="space-y-2">
                  {experiencesByCategory.wildlife.experiences.map((exp) => (
                    <Link
                      key={exp.href}
                      to={exp.href}
                      className="block p-3 rounded-lg bg-white/80 hover:bg-white hover:shadow-md transition-all group"
                    >
                      <div className="font-semibold text-gray-800 group-hover:text-emerald-600 flex items-center justify-between">
                        {exp.title}
                        <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                      </div>
                      <p className="text-xs text-gray-500 mt-1">{exp.description}</p>
                    </Link>
                  ))}
                </div>
              </div>

              {/* Heritage & Culture */}
              <div className="bg-gradient-to-br from-purple-50 to-indigo-50 rounded-2xl p-6 border border-purple-200">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-indigo-500 rounded-xl flex items-center justify-center text-white">
                    <Landmark className="w-6 h-6" />
                  </div>
                  <h3 className="text-lg font-bold text-gray-900">{experiencesByCategory.heritage.title}</h3>
                </div>
                <div className="space-y-2">
                  {experiencesByCategory.heritage.experiences.map((exp) => (
                    <Link
                      key={exp.href}
                      to={exp.href}
                      className="block p-3 rounded-lg bg-white/80 hover:bg-white hover:shadow-md transition-all group"
                    >
                      <div className="font-semibold text-gray-800 group-hover:text-purple-600 flex items-center justify-between">
                        {exp.title}
                        <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                      </div>
                      <p className="text-xs text-gray-500 mt-1">{exp.description}</p>
                    </Link>
                  ))}
                </div>
              </div>

              {/* Luxury & Custom */}
              <div className="bg-gradient-to-br from-amber-50 to-yellow-50 rounded-2xl p-6 border border-amber-200">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-amber-500 to-yellow-500 rounded-xl flex items-center justify-center text-white">
                    <Gem className="w-6 h-6" />
                  </div>
                  <h3 className="text-lg font-bold text-gray-900">{experiencesByCategory.luxury.title}</h3>
                </div>
                <div className="space-y-2">
                  {experiencesByCategory.luxury.experiences.map((exp) => (
                    <Link
                      key={exp.href}
                      to={exp.href}
                      className="block p-3 rounded-lg bg-white/80 hover:bg-white hover:shadow-md transition-all group"
                    >
                      <div className="font-semibold text-gray-800 group-hover:text-amber-600 flex items-center justify-between">
                        {exp.title}
                        <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                      </div>
                      <p className="text-xs text-gray-500 mt-1">{exp.description}</p>
                    </Link>
                  ))}
                </div>
              </div>
            </div>

            {/* Additional Experiences Grid */}
            <div className="mt-12 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              <Link to="/experiences/wellness" className="group p-4 bg-gradient-to-br from-teal-50 to-cyan-50 rounded-xl border border-teal-200 hover:shadow-lg transition-all">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-teal-500 to-cyan-500 rounded-lg flex items-center justify-center text-white">
                    <Leaf className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="font-semibold text-gray-800 group-hover:text-teal-600">Wellness Retreats</div>
                    <p className="text-xs text-gray-500">Spa & healing packages</p>
                  </div>
                </div>
              </Link>

              <Link to="/experiences/train-journeys" className="group p-4 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl border border-blue-200 hover:shadow-lg transition-all">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-lg flex items-center justify-center text-white">
                    <Mountain className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="font-semibold text-gray-800 group-hover:text-blue-600">Train Journeys</div>
                    <p className="text-xs text-gray-500">Scenic railway rides</p>
                  </div>
                </div>
              </Link>

              <Link to="/experiences/whale-watching" className="group p-4 bg-gradient-to-br from-sky-50 to-blue-50 rounded-xl border border-sky-200 hover:shadow-lg transition-all">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-sky-500 to-blue-500 rounded-lg flex items-center justify-center text-white">
                    <Anchor className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="font-semibold text-gray-800 group-hover:text-sky-600">Whale Watching</div>
                    <p className="text-xs text-gray-500">Marine encounters</p>
                  </div>
                </div>
              </Link>

              <Link to="/experiences/cooking-class-sri-lanka" className="group p-4 bg-gradient-to-br from-rose-50 to-pink-50 rounded-xl border border-rose-200 hover:shadow-lg transition-all">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-rose-500 to-pink-500 rounded-lg flex items-center justify-center text-white">
                    <ChefHat className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="font-semibold text-gray-800 group-hover:text-rose-600">Cooking Classes</div>
                    <p className="text-xs text-gray-500">Sri Lankan cuisine</p>
                  </div>
                </div>
              </Link>

              <Link to="/experiences/hot-air-balloon-sigiriya" className="group p-4 bg-gradient-to-br from-orange-50 to-amber-50 rounded-xl border border-orange-200 hover:shadow-lg transition-all">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-amber-500 rounded-lg flex items-center justify-center text-white">
                    <Wind className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="font-semibold text-gray-800 group-hover:text-orange-600">Hot Air Balloon</div>
                    <p className="text-xs text-gray-500">Sunrise over Sigiriya</p>
                  </div>
                </div>
              </Link>

              <Link to="/experiences/hikkaduwa-water-sports" className="group p-4 bg-gradient-to-br from-cyan-50 to-teal-50 rounded-xl border border-cyan-200 hover:shadow-lg transition-all">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-cyan-500 to-teal-500 rounded-lg flex items-center justify-center text-white">
                    <Anchor className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="font-semibold text-gray-800 group-hover:text-cyan-600">Water Sports</div>
                    <p className="text-xs text-gray-500">Hikkaduwa adventures</p>
                  </div>
                </div>
              </Link>

              <Link to="/experiences/jungle-camping" className="group p-4 bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl border border-green-200 hover:shadow-lg transition-all">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-emerald-500 rounded-lg flex items-center justify-center text-white">
                    <Trees className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="font-semibold text-gray-800 group-hover:text-green-600">Jungle Camping</div>
                    <p className="text-xs text-gray-500">Wilderness stays</p>
                  </div>
                </div>
              </Link>

              <Link to="/custom-experience" className="group p-4 bg-gradient-to-br from-violet-50 to-purple-50 rounded-xl border border-violet-200 hover:shadow-lg transition-all">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-violet-500 to-purple-500 rounded-lg flex items-center justify-center text-white">
                    <Sparkles className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="font-semibold text-gray-800 group-hover:text-violet-600">Custom Experience</div>
                    <p className="text-xs text-gray-500">Build your dream trip</p>
                  </div>
                </div>
              </Link>
            </div>
          </div>
        </section>

        {/* Featured Experiences */}
        {featuredExperiences.length > 0 && (
          <section className="py-16 bg-gradient-to-r from-amber-50 to-orange-50">
            <div className="container mx-auto px-4">
              <div className="text-center mb-10">
                <Badge className="bg-amber-500 text-white mb-4">Featured</Badge>
                <h2 className="text-3xl md:text-4xl font-bold mb-4">Must-Try Experiences</h2>
                <p className="text-gray-600 max-w-2xl mx-auto">Our most popular and highly-rated experiences, handpicked for unforgettable memories</p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {featuredExperiences.map((exp) => (
                  <FeaturedCard key={exp.id || exp.slug} experience={exp} />
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Category Tabs Section */}
        <section id="experiences" className="py-16">
          <div className="container mx-auto px-4">
            <div className="text-center mb-10">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Browse by Category</h2>
              <p className="text-gray-600 max-w-2xl mx-auto">Find the perfect experience that matches your interests</p>
            </div>

            <Tabs defaultValue="all" className="w-full" onValueChange={handleCategoryChange}>
              {/* Category Tabs */}
              <div className="overflow-x-auto pb-4 mb-8">
                <TabsList className="inline-flex h-auto p-1 bg-slate-100 rounded-xl min-w-max">
                  <TabsTrigger
                    value="all"
                    className="px-4 py-3 rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-md"
                  >
                    <Sparkles className="w-4 h-4 mr-2" />
                    All ({experiences.length})
                  </TabsTrigger>
                  {categories.map(cat => {
                    const Icon = categoryIcons[cat.value];
                    const count = experiences.filter(e => e.category === cat.value).length;
                    return (
                      <TabsTrigger
                        key={cat.value}
                        value={cat.value}
                        className="px-4 py-3 rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-md whitespace-nowrap"
                      >
                        <Icon className="w-4 h-4 mr-2" />
                        {cat.label} ({count})
                      </TabsTrigger>
                    );
                  })}
                </TabsList>
              </div>

              {/* All Tab Content */}
              <TabsContent value="all" className="mt-0">
                {loading ? (
                  <LoadingGrid />
                ) : filteredExperiences.length === 0 ? (
                  <EmptyState onClear={() => { setSelectedCategory('all'); setSearchQuery(''); }} />
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {filteredExperiences.map((experience) => (
                      <ExperienceCard key={experience.id || experience.slug} experience={experience} />
                    ))}
                  </div>
                )}
              </TabsContent>

              {/* Category Tab Contents */}
              {categories.map(cat => (
                <TabsContent key={cat.value} value={cat.value} className="mt-0">
                  <CategoryHeader category={cat} />
                  {loading ? (
                    <LoadingGrid />
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                      {filteredExperiences.map((experience) => (
                        <ExperienceCard key={experience.id || experience.slug} experience={experience} />
                      ))}
                    </div>
                  )}
                  {filteredExperiences.length === 0 && !loading && (
                    <EmptyState onClear={() => { setSelectedCategory('all'); setSearchQuery(''); }} />
                  )}
                </TabsContent>
              ))}
            </Tabs>
          </div>
        </section>

        {/* New Experiences */}
        {newExperiences.length > 0 && (
          <section className="py-16 bg-slate-50">
            <div className="container mx-auto px-4">
              <div className="flex items-center justify-between mb-10">
                <div>
                  <Badge className="bg-green-500 text-white mb-2">New Arrivals</Badge>
                  <h2 className="text-3xl font-bold">Latest Experiences</h2>
                </div>
                <Button variant="outline" onClick={() => { setSelectedCategory('all'); document.getElementById('experiences')?.scrollIntoView({ behavior: 'smooth' }); }}>
                  View All <ArrowRight className="ml-2 w-4 h-4" />
                </Button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {newExperiences.map((exp) => (
                  <CompactCard key={exp.id || exp.slug} experience={exp} />
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Popular Experiences */}
        {popularExperiences.length > 0 && (
          <section className="py-16">
            <div className="container mx-auto px-4">
              <div className="flex items-center justify-between mb-10">
                <div>
                  <Badge className="bg-blue-500 text-white mb-2"><TrendingUp className="w-3 h-3 mr-1" /> Trending</Badge>
                  <h2 className="text-3xl font-bold">Most Popular</h2>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {popularExperiences.map((exp) => (
                  <CompactCard key={exp.id || exp.slug} experience={exp} />
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Custom Experience CTA */}
        <section className="py-20 bg-gradient-to-r from-amber-500 to-orange-500">
          <div className="container mx-auto px-4 text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <Sparkles className="w-12 h-12 text-white mx-auto mb-4" />
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                Can't find what you're looking for?
              </h2>
              <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
                We create bespoke experiences tailored to your dreams.
                Tell us your vision, and we'll make it a reality.
              </p>
              <Link to="/custom-experience">
                <Button size="lg" className="bg-white text-amber-600 hover:bg-gray-100">
                  Create Your Custom Experience
                  <Sparkles className="ml-2 w-5 h-5" />
                </Button>
              </Link>
            </motion.div>
          </div>
        </section>
      </div>
    </>
  );
};

// Category Header Component
const CategoryHeader = ({ category }: { category: { value: ExperienceCategory; label: string; description: string; icon: string } }) => {
  const Icon = categoryIcons[category.value];
  return (
    <Card className="mb-8 bg-gradient-to-r from-amber-50 to-orange-50 border-amber-200">
      <CardContent className="py-6">
        <div className="flex items-center gap-4">
          <div className="p-4 bg-amber-500 rounded-xl text-white">
            <Icon className="w-8 h-8" />
          </div>
          <div>
            <h3 className="text-2xl font-bold">{category.label}</h3>
            <p className="text-gray-600">{category.description}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

// Featured Card Component
const FeaturedCard = ({ experience }: { experience: LuxuryExperience }) => {
  const Icon = categoryIcons[experience.category] || Sparkles;
  return (
    <motion.div whileHover={{ y: -5 }} className="group">
      <Link to={`/experiences/${experience.slug}`}>
        <Card className="overflow-hidden border-2 border-amber-200 hover:border-amber-400 transition-colors">
          <div className="relative h-56">
            <img src={experience.heroImage} alt={experience.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
            <Badge className="absolute top-3 left-3 bg-amber-500"><Star className="w-3 h-3 mr-1" />Featured</Badge>
            <div className="absolute bottom-3 left-3 text-white">
              <div className="flex items-center gap-2 mb-1">
                <Icon className="w-4 h-4" />
                <span className="text-sm">{experience.duration}</span>
              </div>
              <h3 className="text-xl font-bold">{experience.title}</h3>
            </div>
            <div className="absolute bottom-3 right-3 bg-white/95 px-3 py-1 rounded-full">
              <span className="text-amber-600 font-bold">${experience.price.amount}</span>
            </div>
          </div>
          <CardContent className="p-4">
            <p className="text-gray-600 text-sm line-clamp-2">{experience.shortDescription}</p>
            <div className="flex items-center justify-between mt-3 text-sm text-gray-500">
              <span className="flex items-center gap-1"><MapPin className="w-3 h-3" />{experience.locations?.[0]?.name}</span>
              <span className="flex items-center gap-1"><Users className="w-3 h-3" />{experience.groupSize}</span>
            </div>
          </CardContent>
        </Card>
      </Link>
    </motion.div>
  );
};

// Experience Card Component
const ExperienceCard = ({ experience }: { experience: LuxuryExperience }) => {
  const Icon = categoryIcons[experience.category] || Sparkles;
  return (
    <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} whileHover={{ y: -5 }} className="group cursor-pointer">
      <Link to={`/experiences/${experience.slug}`}>
        <div className="relative h-64 rounded-xl overflow-hidden mb-4">
          <img src={experience.heroImage} alt={experience.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
          <div className="absolute top-4 left-4 flex gap-2">
            {experience.featured && <Badge className="bg-amber-500 text-white"><Star className="w-3 h-3 mr-1" />Featured</Badge>}
            {experience.new && <Badge className="bg-green-500 text-white">New</Badge>}
            {experience.popular && <Badge className="bg-blue-500 text-white"><TrendingUp className="w-3 h-3 mr-1" />Popular</Badge>}
          </div>
          <div className="absolute bottom-4 left-4">
            <div className="bg-white/90 backdrop-blur-sm p-3 rounded-full">
              <Icon className="w-6 h-6 text-amber-600" />
            </div>
          </div>
          <div className="absolute bottom-4 right-4 bg-white/90 backdrop-blur-sm px-4 py-2 rounded-full">
            <span className="text-sm text-gray-600">From</span>
            <span className="text-lg font-bold ml-1">${experience.price.amount}</span>
          </div>
        </div>
        <h3 className="text-xl font-semibold mb-2 group-hover:text-amber-600 transition-colors">{experience.title}</h3>
        <p className="text-gray-600 mb-3 line-clamp-2">{experience.shortDescription}</p>
        <div className="flex items-center justify-between text-sm text-gray-500">
          <span className="flex items-center gap-1"><Clock className="w-4 h-4" />{experience.duration}</span>
          <span className="flex items-center gap-1"><Users className="w-4 h-4" />{experience.groupSize}</span>
        </div>
      </Link>
    </motion.div>
  );
};

// Compact Card Component
const CompactCard = ({ experience }: { experience: LuxuryExperience }) => {
  return (
    <Link to={`/experiences/${experience.slug}`}>
      <Card className="overflow-hidden hover:shadow-lg transition-shadow group">
        <div className="relative h-40">
          <img src={experience.heroImage} alt={experience.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
          <div className="absolute bottom-2 right-2 bg-white/90 px-2 py-1 rounded text-sm font-bold">${experience.price.amount}</div>
        </div>
        <CardContent className="p-3">
          <h4 className="font-semibold line-clamp-1 group-hover:text-amber-600 transition-colors">{experience.title}</h4>
          <div className="flex items-center gap-2 text-xs text-gray-500 mt-1">
            <Clock className="w-3 h-3" />{experience.duration}
          </div>
        </CardContent>
      </Card>
    </Link>
  );
};

// Loading Grid Component
const LoadingGrid = () => (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
    {[...Array(6)].map((_, i) => (
      <div key={i} className="animate-pulse">
        <div className="bg-gray-200 h-64 rounded-xl mb-4" />
        <div className="bg-gray-200 h-6 rounded w-3/4 mb-2" />
        <div className="bg-gray-200 h-4 rounded w-full" />
      </div>
    ))}
  </div>
);

// Empty State Component
const EmptyState = ({ onClear }: { onClear: () => void }) => (
  <div className="text-center py-20">
    <Sparkles className="w-16 h-16 text-gray-300 mx-auto mb-4" />
    <p className="text-gray-500 text-lg mb-4">No experiences found matching your criteria.</p>
    <Button variant="outline" onClick={onClear}>Clear Filters</Button>
  </div>
);

export default LuxuryExperiences;
