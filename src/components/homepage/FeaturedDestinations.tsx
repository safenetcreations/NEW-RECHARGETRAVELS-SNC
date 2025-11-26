import { motion } from 'framer-motion';
import { MapPin, Star, ArrowRight, Compass, Sparkles, ChevronLeft, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useState, useEffect, useMemo, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { cmsService } from '@/services/cmsService';
import { FeaturedDestination } from '@/types/cms';

// Fallback destinations if CMS data is not available
const fallbackDestinations = [
  {
    id: 'sigiriya',
    name: 'Sigiriya',
    title: 'Lion Rock Fortress',
    description: 'Ancient rock fortress rising 200m above jungle. UNESCO World Heritage site.',
    image: 'https://images.unsplash.com/photo-1586523969943-2d62a1a7d4d3?w=800&q=80',
    category: 'UNESCO Heritage',
    rating: 4.9,
    reviews: 2847,
    features: ['Ancient Frescoes', 'Mirror Wall', 'Lion Gate'],
    path: '/destinations/sigiriya'
  },
  {
    id: 'ella',
    name: 'Ella',
    title: 'Hill Country Paradise',
    description: 'Misty mountain town famous for Nine Arch Bridge and hiking trails.',
    image: 'https://images.unsplash.com/photo-1566296314736-6eaac1ca0cb9?w=800&q=80',
    category: 'Hill Country',
    rating: 4.8,
    reviews: 1923,
    features: ['Nine Arch Bridge', 'Ella Rock', 'Tea Trails'],
    path: '/destinations/ella'
  },
  {
    id: 'kandy',
    name: 'Kandy',
    title: 'Temple of Sacred Tooth',
    description: 'Cultural capital housing Buddha\'s sacred tooth relic.',
    image: 'https://images.unsplash.com/photo-1580181046391-e7e83f206c62?w=800&q=80',
    category: 'Cultural Heritage',
    rating: 4.7,
    reviews: 2156,
    features: ['Temple of Tooth', 'Kandy Lake', 'Cultural Dance'],
    path: '/destinations/kandy'
  },
  {
    id: 'galle',
    name: 'Galle',
    title: 'Dutch Colonial Fort',
    description: 'Historic fort city with colonial architecture and ocean views.',
    image: 'https://images.unsplash.com/photo-1588598198321-9735fd52045b?w=800&q=80',
    category: 'Colonial Heritage',
    rating: 4.8,
    reviews: 1834,
    features: ['Galle Fort', 'Lighthouse', 'Dutch Museum'],
    path: '/destinations/galle'
  },
  {
    id: 'mirissa',
    name: 'Mirissa',
    title: 'Whale Watching Capital',
    description: 'Pristine beach paradise and world\'s best blue whale destination.',
    image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&q=80',
    category: 'Beach & Wildlife',
    rating: 4.9,
    reviews: 1567,
    features: ['Blue Whales', 'Coconut Beach', 'Surfing'],
    path: '/destinations/mirissa'
  },
  {
    id: 'yala',
    name: 'Yala',
    title: 'Leopard Kingdom',
    description: 'World\'s highest leopard density. Iconic safari destination.',
    image: 'https://images.unsplash.com/photo-1549366021-9f761d450615?w=800&q=80',
    category: 'Wildlife Safari',
    rating: 4.9,
    reviews: 2341,
    features: ['Leopards', 'Elephants', 'Bird Watching'],
    path: '/wild-tours'
  }
];

// Shuffle array function
const shuffleArray = <T,>(array: T[]): T[] => {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

const FeaturedDestinations = () => {
  const [destinations, setDestinations] = useState<FeaturedDestination[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(0);

  // Fetch destinations from CMS
  useEffect(() => {
    const fetchDestinations = async () => {
      try {
        setLoading(true);
        const data = await cmsService.featuredDestinations.getAll();
        if (data && data.length > 0) {
          // Shuffle the CMS data
          setDestinations(shuffleArray(data));
        } else {
          // Use fallback if no CMS data
          setDestinations(shuffleArray(fallbackDestinations as unknown as FeaturedDestination[]));
        }
      } catch (error) {
        console.error('Error fetching featured destinations:', error);
        // Use fallback on error
        setDestinations(shuffleArray(fallbackDestinations as unknown as FeaturedDestination[]));
      } finally {
        setLoading(false);
      }
    };

    fetchDestinations();
  }, []);

  // Pagination
  const itemsPerPage = 6;
  const totalPages = Math.ceil(destinations.length / itemsPerPage);

  const currentDestinations = useMemo(() => {
    const start = currentPage * itemsPerPage;
    return destinations.slice(start, start + itemsPerPage);
  }, [currentPage, destinations]);

  // Auto-rotate pages
  useEffect(() => {
    if (destinations.length > itemsPerPage) {
      const timer = setInterval(() => {
        setCurrentPage((prev) => (prev + 1) % totalPages);
      }, 10000);
      return () => clearInterval(timer);
    }
  }, [totalPages, destinations.length]);

  const nextPage = useCallback(() => {
    setCurrentPage((prev) => (prev + 1) % totalPages);
  }, [totalPages]);

  const prevPage = useCallback(() => {
    setCurrentPage((prev) => (prev - 1 + totalPages) % totalPages);
  }, [totalPages]);

  if (loading) {
    return (
      <section className="py-20 bg-gradient-to-b from-gray-900 via-slate-900 to-gray-900">
        <div className="container mx-auto px-4 lg:px-8 text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto mb-4"></div>
          <p className="text-gray-400">Loading destinations...</p>
        </div>
      </section>
    );
  }

  return (
    <section className="py-20 bg-gradient-to-b from-gray-900 via-slate-900 to-gray-900">
      <div className="container mx-auto px-4 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 bg-orange-500/20 px-6 py-3 rounded-full mb-6 border border-orange-500/30">
            <Compass className="w-5 h-5 text-orange-400" />
            <span className="text-orange-300 font-semibold tracking-wide uppercase">Discover Paradise</span>
            <Sparkles className="w-5 h-5 text-yellow-400" />
          </div>

          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6">
            Explore Sri Lanka <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-yellow-400">Featured Destinations</span>
          </h2>

          <p className="text-lg md:text-xl text-gray-300 max-w-3xl mx-auto">
            From ancient wonders to pristine beaches, discover the most captivating destinations that make Sri Lanka an unforgettable journey
          </p>
        </motion.div>

        {/* Destinations Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {currentDestinations.map((destination, index) => (
            <motion.div
              key={destination.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="group"
            >
              <Link to={`/destinations/${destination.name.toLowerCase().replace(/\s+/g, '-')}`}>
                <div className="relative h-[400px] rounded-2xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-500">
                  {/* Background Image */}
                  <div
                    className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110"
                    style={{ backgroundImage: `url(${destination.image})` }}
                  />

                  {/* Fallback gradient if image fails */}
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-900 to-purple-900 -z-10" />

                  {/* Gradient Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />

                  {/* Category Badge */}
                  <div className="absolute top-4 left-4 z-10">
                    <span className="px-4 py-2 bg-white rounded-full text-sm font-bold text-gray-800">
                      {destination.category}
                    </span>
                  </div>

                  {/* Rating Badge */}
                  {destination.rating && (
                    <div className="absolute top-4 right-4 z-10">
                      <div className="flex items-center gap-1 px-3 py-2 bg-black/60 backdrop-blur-sm rounded-full">
                        <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                        <span className="text-white font-bold text-sm">{destination.rating}</span>
                      </div>
                    </div>
                  )}

                  {/* Content */}
                  <div className="absolute bottom-0 left-0 right-0 p-6 z-10">
                    {/* Location */}
                    <div className="flex items-center gap-2 mb-2">
                      <MapPin className="w-4 h-4 text-orange-400" />
                      <span className="text-orange-300 text-sm font-medium">{destination.title}</span>
                    </div>

                    {/* Name */}
                    <h3 className="text-3xl font-bold text-white mb-3">
                      {destination.name}
                    </h3>

                    {/* Description */}
                    <p className="text-gray-300 text-sm mb-4 line-clamp-2">
                      {destination.description}
                    </p>

                    {/* Features/Highlights */}
                    {destination.features && destination.features.length > 0 && (
                      <div className="flex flex-wrap gap-2 mb-4">
                        {destination.features.slice(0, 3).map((feature, idx) => (
                          <span
                            key={idx}
                            className="px-3 py-1 bg-white/20 rounded-full text-xs text-white"
                          >
                            {feature}
                          </span>
                        ))}
                      </div>
                    )}

                    {/* CTA */}
                    <div className="flex items-center justify-between">
                      <span className="text-gray-400 text-sm">
                        {destination.duration || 'Full Day Trip'}
                      </span>
                      <div className="flex items-center gap-2 text-orange-400 font-semibold group-hover:gap-3 transition-all">
                        <span>Explore</span>
                        <ArrowRight className="w-5 h-5" />
                      </div>
                    </div>
                  </div>

                  {/* Hover Border */}
                  <div className="absolute inset-0 rounded-2xl border-2 border-transparent group-hover:border-orange-400/50 transition-all duration-300" />
                </div>
              </Link>
            </motion.div>
          ))}
        </div>

        {/* Navigation - Only show if more than 1 page */}
        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-6 mb-12">
            <Button
              variant="outline"
              size="icon"
              onClick={prevPage}
              className="w-12 h-12 rounded-full bg-white/10 border-white/20 hover:bg-white/20 text-white"
            >
              <ChevronLeft className="w-6 h-6" />
            </Button>

            <div className="flex gap-2">
              {Array.from({ length: totalPages }).map((_, idx) => (
                <button
                  type="button"
                  key={idx}
                  onClick={() => setCurrentPage(idx)}
                  className={`h-3 rounded-full transition-all duration-300 ${
                    currentPage === idx
                      ? 'w-10 bg-orange-400'
                      : 'w-3 bg-white/30 hover:bg-white/50'
                  }`}
                  aria-label={`Go to page ${idx + 1}`}
                />
              ))}
            </div>

            <Button
              variant="outline"
              size="icon"
              onClick={nextPage}
              className="w-12 h-12 rounded-full bg-white/10 border-white/20 hover:bg-white/20 text-white"
            >
              <ChevronRight className="w-6 h-6" />
            </Button>
          </div>
        )}

        {/* View All Button */}
        <div className="text-center mb-16">
          <Link to="/destinations">
            <Button
              size="lg"
              className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-bold px-10 py-6 rounded-xl text-lg"
            >
              <Compass className="w-5 h-5 mr-2" />
              View All Destinations
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </Link>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 pt-8 border-t border-white/10">
          {[
            { value: '25+', label: 'Destinations' },
            { value: '8', label: 'UNESCO Sites' },
            { value: '1,340km', label: 'Coastline' },
            { value: '4.9★', label: 'Average Rating' }
          ].map((stat, idx) => (
            <div key={idx} className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-yellow-400 mb-2">
                {stat.value}
              </div>
              <div className="text-gray-400 font-medium">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturedDestinations;
