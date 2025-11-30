import { motion } from 'framer-motion';
import { MapPin, Star, ArrowRight, Compass, Sparkles, ChevronLeft, ChevronRight } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
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
    image: 'https://images.unsplash.com/photo-1603852452378-a4e8d84324a2?w=800&q=80',
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
    image: 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=800&q=80',
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
    image: 'https://images.unsplash.com/photo-1546587348-d12660c30c50?w=800&q=80',
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
    image: 'https://images.unsplash.com/photo-1518509562904-e7ef99cdcc86?w=800&q=80',
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
    image: 'https://images.unsplash.com/photo-1590523741831-ab7e8b8f9c7f?w=800&q=80',
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
    image: 'https://images.unsplash.com/photo-1456926631375-92c8ce872def?w=800&q=80',
    category: 'Wildlife Safari',
    rating: 4.9,
    reviews: 2341,
    features: ['Leopards', 'Elephants', 'Bird Watching'],
    path: '/wild-tours'
  },
  {
    id: 'nuwara-eliya',
    name: 'Nuwara Eliya',
    title: 'Little England',
    description: 'Cool climate hill station surrounded by tea plantations.',
    image: 'https://images.unsplash.com/photo-1501854140801-50d01698950b?w=800&q=80',
    category: 'Tea Country',
    rating: 4.7,
    reviews: 1456,
    features: ['Tea Estates', 'Gregory Lake', 'Horton Plains'],
    path: '/destinations/nuwara-eliya'
  },
  {
    id: 'trincomalee',
    name: 'Trincomalee',
    title: 'East Coast Paradise',
    description: 'Pristine beaches, whale watching and ancient temples.',
    image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&q=80',
    category: 'Beach & Heritage',
    rating: 4.8,
    reviews: 1234,
    features: ['Nilaveli Beach', 'Pigeon Island', 'Koneswaram Temple'],
    path: '/destinations/trincomalee'
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

// Resolve the best href for a destination
const getDestinationHref = (destination: FeaturedDestination): string => {
  const slug = destination.name.toLowerCase().replace(/\s+/g, '-');
  const pathFromCms = destination.link || (destination as any).path;
  return pathFromCms || `/destinations/${slug}`;
};

const FeaturedDestinations = () => {
  const navigate = useNavigate();
  const [destinations, setDestinations] = useState<FeaturedDestination[]>(
    shuffleArray(fallbackDestinations as unknown as FeaturedDestination[])
  );
  const [currentPage, setCurrentPage] = useState(0);

  // CMS fetch disabled - using fallback data with proper links
  // useEffect(() => {
  //   const fetchData = async () => {
  //     try {
  //       const destinationsData = await cmsService.featuredDestinations.getAll();
  //       if (destinationsData && destinationsData.length > 0) {
  //         setDestinations(shuffleArray(destinationsData as FeaturedDestination[]));
  //       }
  //     } catch (error) {
  //       console.error('Error fetching CMS data:', error);
  //     }
  //   };
  //   fetchData();
  // }, []);

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

  return (
    <section id="featured-destinations" className="relative py-24 bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950">
      {/* Subtle background pattern */}
      <div className="absolute inset-0 opacity-5 pointer-events-none">
        <div className="absolute inset-0 pointer-events-none" style={{
          backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)',
          backgroundSize: '40px 40px'
        }} />
      </div>

      <div className="relative container mx-auto px-4 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          {/* Badge */}
          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-emerald-500 to-teal-500 px-6 py-3 rounded-full mb-8 shadow-lg shadow-emerald-500/25">
            <Compass className="w-5 h-5 text-white" />
            <span className="text-white font-bold tracking-wide uppercase text-sm">Discover Paradise</span>
            <Sparkles className="w-5 h-5 text-yellow-300" />
          </div>

          {/* SUPER BRIGHT HEADING */}
          <h2 className="text-5xl md:text-6xl lg:text-7xl font-black mb-8 leading-tight">
            <span
              className="block text-white mb-3"
              style={{
                textShadow: '0 0 20px rgba(255,255,255,0.9), 0 0 40px rgba(255,255,255,0.6), 0 0 60px rgba(255,255,255,0.4), 0 4px 12px rgba(0,0,0,0.8)',
                letterSpacing: '-0.02em'
              }}
            >
              Explore Sri Lanka
            </span>
            <span
              className="block text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 via-amber-400 to-orange-400"
              style={{
                filter: 'drop-shadow(0 0 20px rgba(251, 191, 36, 0.6)) drop-shadow(0 0 40px rgba(251, 191, 36, 0.4))',
                letterSpacing: '-0.02em'
              }}
            >
              Featured Destinations
            </span>
          </h2>

          <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
            From misty tea hills to sunlit beaches and ancient cities, step into the landscapes that make Sri Lanka feel alive.
          </p>
        </motion.div>

        {/* Destinations Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-14">
          {currentDestinations.map((destination, index) => {
            const href = (destination as any).path || `/destinations/${destination.name.toLowerCase().replace(/\s+/g, '-')}`;
            return (
            <div key={destination.id} className="group">
              <a href={href}>
                <div className="relative h-[420px] rounded-3xl overflow-hidden shadow-2xl shadow-black/40 hover:shadow-orange-500/20 transition-all duration-500 transform hover:-translate-y-2 cursor-pointer">
                  {/* Background Image */}
                  <div
                    className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110"
                    style={{ backgroundImage: `url(${destination.image})` }}
                  />

                  {/* Gradient Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent" />

                  {/* Category Badge */}
                  <div className="absolute top-5 left-5 z-10">
                    <span className="px-4 py-2 bg-white/95 backdrop-blur-sm rounded-full text-sm font-bold text-gray-800 shadow-lg">
                      {destination.category}
                    </span>
                  </div>

                  {/* Rating Badge */}
                  {destination.rating && (
                    <div className="absolute top-5 right-5 z-10">
                      <div className="flex items-center gap-1.5 px-3 py-2 bg-black/70 backdrop-blur-sm rounded-full border border-white/10">
                        <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                        <span className="text-white font-bold text-sm">{destination.rating}</span>
                      </div>
                    </div>
                  )}

                  {/* Content */}
                  <div className="absolute bottom-0 left-0 right-0 p-7 z-10">
                    {/* Location */}
                    <div className="flex items-center gap-2 mb-3">
                      <MapPin className="w-4 h-4 text-orange-400" />
                      <span className="text-orange-300 text-sm font-medium">{destination.title}</span>
                    </div>

                    {/* Name */}
                    <h3 className="text-3xl font-bold text-white mb-3" style={{ textShadow: '0 2px 8px rgba(0,0,0,0.5)' }}>
                      {destination.name}
                    </h3>

                    {/* Description */}
                    <p className="text-gray-300 text-sm mb-4 line-clamp-2">
                      {destination.description}
                    </p>

                    {/* Features */}
                    {destination.features && destination.features.length > 0 && (
                      <div className="flex flex-wrap gap-2 mb-5">
                        {destination.features.slice(0, 3).map((feature, idx) => (
                          <span
                            key={idx}
                            className="px-3 py-1 bg-white/15 backdrop-blur-sm rounded-full text-xs text-white font-medium border border-white/10"
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
                        <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
                      </div>
                    </div>
                  </div>

                  {/* Hover Border Glow */}
                  <div className="absolute inset-0 rounded-3xl border-2 border-transparent group-hover:border-orange-400/40 transition-all duration-300" />
                </div>
              </a>
            </div>
          );
          })}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-6 mb-14">
            <Button
              variant="outline"
              size="icon"
              onClick={prevPage}
              className="w-12 h-12 rounded-full bg-white/5 border-white/20 hover:bg-white/15 hover:border-white/40 text-white transition-all"
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
                      ? 'w-10 bg-gradient-to-r from-orange-400 to-amber-500'
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
              className="w-12 h-12 rounded-full bg-white/5 border-white/20 hover:bg-white/15 hover:border-white/40 text-white transition-all"
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
              className="bg-gradient-to-r from-orange-500 via-amber-500 to-orange-500 hover:from-orange-600 hover:via-amber-600 hover:to-orange-600 text-white font-bold px-12 py-7 rounded-2xl text-lg shadow-xl shadow-orange-500/25 hover:shadow-orange-500/40 transition-all hover:scale-105"
            >
              <Compass className="w-6 h-6 mr-3" />
              View All Destinations
              <ArrowRight className="w-6 h-6 ml-3" />
            </Button>
          </Link>
        </div>

        {/* Stats Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="bg-gradient-to-r from-slate-800/50 via-slate-800/80 to-slate-800/50 backdrop-blur-sm rounded-3xl p-10 border border-white/10"
        >
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { value: '25+', label: 'Destinations', icon: '🗺️' },
              { value: '8', label: 'UNESCO Sites', icon: '🏛️' },
              { value: '1,340km', label: 'Coastline', icon: '🏖️' },
              { value: '4.9★', label: 'Average Rating', icon: '⭐' }
            ].map((stat, idx) => (
              <motion.div
                key={idx}
                className="text-center"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
              >
                <div className="text-4xl mb-3">{stat.icon}</div>
                <div className="text-4xl md:text-5xl font-black text-white mb-2">
                  {stat.value}
                </div>
                <div className="text-base text-gray-400 font-semibold tracking-wide">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default FeaturedDestinations;
