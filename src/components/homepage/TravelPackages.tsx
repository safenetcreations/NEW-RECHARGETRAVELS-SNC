import { motion } from 'framer-motion';
import { Calendar, Users, MapPin, Star, Check, ArrowRight, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import 'react-lazy-load-image-component/src/effects/blur.css';
import { cmsService } from '@/services/cmsService';
import { TravelPackage } from '@/types/cms';

const TravelPackages = () => {
  const [packages, setPackages] = useState<TravelPackage[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPackages = async () => {
      try {
        setLoading(true);
        const data = await cmsService.travelPackages.getAll();
        // Filter active packages and sort by created_at desc (already sorted by getAll usually, but filtering is needed)
        const activePackages = data.filter(pkg => pkg.isActive);
        setPackages(activePackages);
      } catch (error) {
        console.error('Error fetching travel packages:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPackages();
  }, []);

  if (loading) {
    return (
      <section className="py-20 bg-gradient-to-br from-gray-50 to-blue-50">
        <div className="container mx-auto px-4 lg:px-8 text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading Travel Packages...</p>
        </div>
      </section>
    );
  }

  return (
    <section className="py-20 bg-gradient-to-br from-gray-50 to-blue-50">
      <div className="container mx-auto px-4 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="text-blue-600 font-semibold text-sm uppercase tracking-wider">Best Value Deals</span>
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mt-4 mb-6 font-playfair">
            Exclusive Travel Packages
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Carefully crafted itineraries combining the best of Sri Lanka with unbeatable value.
            Limited time offers on our most popular packages
          </p>
        </motion.div>

        {/* Packages Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {packages.map((pkg, index) => (
            <motion.div
              key={pkg.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="bg-white rounded-2xl shadow-xl overflow-hidden hover:shadow-2xl transition-all duration-500 group"
            >
              {/* Image Section */}
              <div className="relative h-64 overflow-hidden">
                <LazyLoadImage
                  alt={pkg.name}
                  effect="blur"
                  src={pkg.image}
                  className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />

                {/* Discount Badge */}
                {pkg.discount && (
                  <div className="absolute top-4 right-4 bg-red-500 text-white px-4 py-2 rounded-full font-bold text-sm">
                    {pkg.discount}
                  </div>
                )}

                {/* Package Info Overlay */}
                <div className="absolute bottom-4 left-4 right-4">
                  <h3 className="text-2xl font-bold text-white mb-1">{pkg.name}</h3>
                  <div className="flex items-center gap-4 text-white/90 text-sm">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      {pkg.duration}
                    </span>
                    <span className="flex items-center gap-1">
                      <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                      {pkg.rating} ({pkg.reviews})
                    </span>
                  </div>
                </div>
              </div>

              {/* Content Section */}
              <div className="p-6">
                {/* Price */}
                <div className="flex items-baseline gap-2 mb-4">
                  <span className="text-3xl font-bold text-gray-900">{pkg.price}</span>
                  {pkg.originalPrice && <span className="text-lg text-gray-400 line-through">{pkg.originalPrice}</span>}
                  <span className="text-sm text-gray-600">per person</span>
                </div>

                {/* Best For Badge */}
                {pkg.bestFor && (
                  <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-sm font-medium mb-4">
                    <Users className="w-4 h-4" />
                    {pkg.bestFor}
                  </div>
                )}

                {/* Destinations */}
                <div className="mb-4">
                  <div className="flex items-center gap-2 mb-2">
                    <MapPin className="w-4 h-4 text-gray-500" />
                    <span className="text-sm font-semibold text-gray-700">Destinations</span>
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {pkg.destinations.map((dest, idx) => (
                      <span key={idx} className="text-xs px-2 py-1 bg-gray-100 rounded-full text-gray-600">
                        {dest}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Highlights */}
                <div className="mb-6">
                  <h4 className="text-sm font-semibold text-gray-700 mb-3">Package Highlights</h4>
                  <ul className="space-y-2">
                    {pkg.highlights.slice(0, 4).map((highlight, idx) => (
                      <li key={idx} className="flex items-start gap-2 text-sm text-gray-600">
                        <Check className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                        {highlight}
                      </li>
                    ))}
                  </ul>
                  {pkg.highlights.length > 4 && (
                    <p className="text-sm text-blue-600 mt-2">+{pkg.highlights.length - 4} more inclusions</p>
                  )}
                </div>

                {/* CTA Button */}
                <Link to="/tours">
                  <button className="w-full py-3 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold rounded-xl transition-all duration-300 flex items-center justify-center gap-2 group">
                    View Tours
                    <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
                  </button>
                </Link>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mt-12"
        >
          <div className="inline-flex items-center gap-4 px-6 py-3 bg-yellow-50 border border-yellow-200 rounded-full">
            <Sparkles className="w-5 h-5 text-yellow-600" />
            <span className="text-gray-800 font-medium">
              Book now and save up to 20% on selected packages
            </span>
          </div>
          <div className="mt-6">
            <Link to="/tours">
              <button className="px-8 py-4 bg-white border-2 border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white font-semibold rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg">
                Explore All Tours
              </button>
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default TravelPackages;
