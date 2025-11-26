import { motion } from 'framer-motion';
import { BookOpen, Clock, User, ArrowRight } from 'lucide-react';
import { useState, useEffect } from 'react';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import 'react-lazy-load-image-component/src/effects/blur.css';
import { cmsService } from '@/services/cmsService';
import { TravelGuideSection } from '@/types/cms';

const TravelGuide = () => {
  const [sections, setSections] = useState<TravelGuideSection[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSections = async () => {
      try {
        setLoading(true);
        const data = await cmsService.travelGuide.getAll();
        setSections(data);
      } catch (error) {
        console.error('Error fetching travel guide sections:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchSections();
  }, []);

  if (loading) {
    return (
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4 lg:px-8 text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading Travel Guide...</p>
        </div>
      </section>
    );
  }

  if (sections.length === 0) {
    // Fallback to the original simple view if no content
    return (
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center"
          >
            <BookOpen className="w-12 h-12 text-blue-600 mx-auto mb-4" />
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Free Travel Guide</h2>
            <p className="text-gray-600 mb-6">Download our comprehensive Sri Lanka travel guide</p>
            <button
              onClick={() => console.log('Download PDF Guide functionality to be implemented')}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
            >
              Download PDF Guide
            </button>
          </motion.div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="text-blue-600 font-semibold text-sm uppercase tracking-wider">Travel Tips & Insights</span>
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mt-4 mb-6 font-playfair">
            Travel Guide
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Everything you need to know before visiting Sri Lanka, curated by our local experts
          </p>
        </motion.div>

        {/* Guide Sections Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {sections.map((section, index) => (
            <motion.div
              key={section.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="group cursor-pointer flex flex-col h-full bg-gray-50 rounded-2xl overflow-hidden hover:shadow-xl transition-shadow duration-300"
            >
              {/* Image */}
              <div className="relative h-64 overflow-hidden">
                <LazyLoadImage
                  alt={section.title}
                  effect="blur"
                  src={section.image}
                  className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700"
                />
                <div className="absolute top-4 left-4">
                  <span className="px-3 py-1 bg-white/90 backdrop-blur-sm rounded-full text-xs font-semibold text-gray-800 uppercase tracking-wide">
                    {section.category}
                  </span>
                </div>
              </div>

              {/* Content */}
              <div className="p-6 flex-1 flex flex-col">
                <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-blue-600 transition-colors">
                  {section.title}
                </h3>
                <p className="text-gray-600 text-sm mb-4 line-clamp-3 flex-1">
                  {section.content}
                </p>

                {/* Meta */}
                <div className="flex items-center justify-between text-xs text-gray-500 pt-4 border-t border-gray-200">
                  <div className="flex items-center gap-4">
                    {section.readTime && (
                      <div className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        <span>{section.readTime}</span>
                      </div>
                    )}
                    {section.author && (
                      <div className="flex items-center gap-1">
                        <User className="w-3 h-3" />
                        <span>{section.author}</span>
                      </div>
                    )}
                  </div>
                  <div className="flex items-center gap-1 text-blue-600 font-medium group-hover:gap-2 transition-all">
                    Read More <ArrowRight className="w-3 h-3" />
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TravelGuide;