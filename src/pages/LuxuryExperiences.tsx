import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
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
  Filter,
  Search
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { luxuryExperienceService } from '@/services/luxuryExperienceService';
import type { LuxuryExperience, ExperienceCategory } from '@/types/luxury-experience';
import { toast } from 'sonner';

const categoryIcons: Record<ExperienceCategory, any> = {
  'luxury-safari': Mountain,
  'photography-tours': Camera,
  'cultural-immersion': Heart,
  'wellness-retreats': Leaf,
  'adventure-expeditions': Mountain,
  'marine-adventures': Anchor,
  'culinary-journeys': ChefHat,
  'romantic-escapes': Heart,
  'family-adventures': Users,
  'exclusive-access': Lock
};

const LuxuryExperiences = () => {
  const [experiences, setExperiences] = useState<LuxuryExperience[]>([]);
  const [filteredExperiences, setFilteredExperiences] = useState<LuxuryExperience[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<ExperienceCategory | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);

  const categories = luxuryExperienceService.getCategories();

  useEffect(() => {
    loadExperiences();
  }, []);

  useEffect(() => {
    filterExperiences();
  }, [experiences, selectedCategory, searchQuery]);

  const loadExperiences = async () => {
    try {
      setLoading(true);
      const data = await luxuryExperienceService.getExperiences();
      setExperiences(data);
    } catch (error) {
      console.error('Error loading experiences:', error);
      toast.error('Failed to load experiences');
    } finally {
      setLoading(false);
    }
  };

  const filterExperiences = () => {
    let filtered = [...experiences];

    // Category filter
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(exp => exp.category === selectedCategory);
    }

    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(exp => 
        exp.title.toLowerCase().includes(query) ||
        exp.shortDescription.toLowerCase().includes(query) ||
        exp.locations.some(loc => loc.name.toLowerCase().includes(query))
      );
    }

    setFilteredExperiences(filtered);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      {/* Hero Section */}
      <section className="relative h-[60vh] overflow-hidden">
        <div className="absolute inset-0">
          <img 
            src="https://images.unsplash.com/photo-1539367628448-4bc5c9d171c8?w=1920&h=1080&fit=crop"
            alt="Luxury Sri Lanka"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/60" />
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
              <h1 className="text-5xl md:text-7xl font-bold text-white">
                Curated Experiences
              </h1>
              <Sparkles className="w-8 h-8 text-amber-400" />
            </div>
            <p className="text-xl md:text-2xl text-white/90 mb-8 font-light">
              Handcrafted journeys that go beyond the ordinary, designed for discerning travelers 
              seeking authentic luxury and unforgettable moments
            </p>
            <Button 
              size="lg" 
              className="bg-amber-500 hover:bg-amber-600 text-white"
              onClick={() => document.getElementById('experiences')?.scrollIntoView({ behavior: 'smooth' })}
            >
              Explore Experiences
              <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
          </motion.div>
        </div>

        {/* Floating Stats */}
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent">
          <div className="container mx-auto px-4 py-8">
            <div className="grid grid-cols-3 gap-8 text-center text-white">
              <div>
                <div className="text-3xl font-bold text-amber-400">50+</div>
                <div className="text-sm opacity-90">Curated Experiences</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-amber-400">98%</div>
                <div className="text-sm opacity-90">Guest Satisfaction</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-amber-400">15+</div>
                <div className="text-sm opacity-90">Years of Excellence</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Search and Filter Bar */}
      <section className="sticky top-20 z-40 bg-white shadow-md">
        <div className="container mx-auto px-4 py-4">
          <div className="flex flex-col md:flex-row gap-4 items-center">
            {/* Search */}
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <Input
                placeholder="Search experiences..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>

            {/* Category Filter */}
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowFilters(!showFilters)}
                className="md:hidden"
              >
                <Filter className="w-4 h-4 mr-2" />
                Filters
              </Button>
              
              <div className="hidden md:flex items-center gap-2">
                <Button
                  variant={selectedCategory === 'all' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setSelectedCategory('all')}
                >
                  All Experiences
                </Button>
                {categories.slice(0, 5).map(cat => {
                  const Icon = categoryIcons[cat.value];
                  return (
                    <Button
                      key={cat.value}
                      variant={selectedCategory === cat.value ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setSelectedCategory(cat.value)}
                    >
                      <Icon className="w-4 h-4 mr-2" />
                      {cat.label}
                    </Button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Mobile Filter Dropdown */}
          <AnimatePresence>
            {showFilters && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="md:hidden overflow-hidden"
              >
                <div className="pt-4 grid grid-cols-2 gap-2">
                  <Button
                    variant={selectedCategory === 'all' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setSelectedCategory('all')}
                  >
                    All
                  </Button>
                  {categories.map(cat => (
                    <Button
                      key={cat.value}
                      variant={selectedCategory === cat.value ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setSelectedCategory(cat.value)}
                    >
                      {cat.label}
                    </Button>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </section>

      {/* Experiences Grid */}
      <section id="experiences" className="py-16">
        <div className="container mx-auto px-4">
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="animate-pulse">
                  <div className="bg-gray-200 h-64 rounded-xl mb-4" />
                  <div className="bg-gray-200 h-6 rounded w-3/4 mb-2" />
                  <div className="bg-gray-200 h-4 rounded w-full" />
                </div>
              ))}
            </div>
          ) : filteredExperiences.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-gray-500 text-lg">No experiences found matching your criteria.</p>
              <Button 
                variant="outline" 
                className="mt-4"
                onClick={() => {
                  setSelectedCategory('all');
                  setSearchQuery('');
                }}
              >
                Clear Filters
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredExperiences.map((experience) => (
                <ExperienceCard key={experience.id} experience={experience} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Custom Experience CTA */}
      <section className="py-20 bg-gradient-to-r from-amber-50 to-orange-50">
        <div className="container mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-4xl font-bold mb-4">
              Can't find what you're looking for?
            </h2>
            <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
              We create bespoke experiences tailored to your dreams. 
              Tell us your vision, and we'll make it a reality.
            </p>
            <Link to="/custom-experience">
              <Button size="lg" className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white">
                Create Your Custom Experience
                <Sparkles className="ml-2 w-5 h-5" />
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

// Experience Card Component
const ExperienceCard = ({ experience }: { experience: LuxuryExperience }) => {
  const Icon = categoryIcons[experience.category] || Sparkles;
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      whileHover={{ y: -5 }}
      className="group cursor-pointer"
    >
      <Link to={`/experiences/${experience.slug}`}>
        <div className="relative h-64 rounded-xl overflow-hidden mb-4">
          <img 
            src={experience.heroImage} 
            alt={experience.title}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
          
          {/* Badges */}
          <div className="absolute top-4 left-4 flex gap-2">
            {experience.featured && (
              <Badge className="bg-amber-500 text-white">
                <Star className="w-3 h-3 mr-1" />
                Featured
              </Badge>
            )}
            {experience.new && (
              <Badge className="bg-green-500 text-white">New</Badge>
            )}
          </div>

          {/* Category Icon */}
          <div className="absolute bottom-4 left-4">
            <div className="bg-white/90 backdrop-blur-sm p-3 rounded-full">
              <Icon className="w-6 h-6 text-amber-600" />
            </div>
          </div>

          {/* Price */}
          <div className="absolute bottom-4 right-4 bg-white/90 backdrop-blur-sm px-4 py-2 rounded-full">
            <span className="text-sm text-gray-600">From</span>
            <span className="text-lg font-bold ml-1">
              ${experience.price.amount}
            </span>
          </div>
        </div>

        <h3 className="text-xl font-semibold mb-2 group-hover:text-amber-600 transition-colors">
          {experience.title}
        </h3>
        <p className="text-gray-600 mb-3 line-clamp-2">
          {experience.shortDescription}
        </p>
        
        <div className="flex items-center justify-between text-sm text-gray-500">
          <span>{experience.duration}</span>
          <span className="flex items-center gap-1">
            <Users className="w-4 h-4" />
            {experience.groupSize}
          </span>
        </div>
      </Link>
    </motion.div>
  );
};

export default LuxuryExperiences;
