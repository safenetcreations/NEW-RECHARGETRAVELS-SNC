import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Shield, Award, HeartHandshake, Clock } from 'lucide-react';
import { whyChooseUsService } from '@/services/cmsService';
import type { WhyChooseUsFeature } from '@/types/cms';

const WhyChooseUs = () => {
  const [features, setFeatures] = useState<WhyChooseUsFeature[]>([]);
  const [loading, setLoading] = useState(true);

  // Default fallback reasons
  const defaultReasons: WhyChooseUsFeature[] = [
    {
      id: '1',
      icon: '🛡️',
      title: "100% Safe & Secure",
      description: "Licensed operators, insured vehicles, and verified drivers for your peace of mind",
      order: 0,
      isActive: true,
      createdAt: null as any,
      updatedAt: null as any,
    },
    {
      id: '2',
      icon: '🏆',
      title: "Best Price Guarantee",
      description: "Competitive rates with no hidden fees. Price match promise on all services",
      order: 1,
      isActive: true,
      createdAt: null as any,
      updatedAt: null as any,
    },
    {
      id: '3',
      icon: '🤝',
      title: "Local Expertise",
      description: "15+ years of experience with deep local knowledge and connections",
      order: 2,
      isActive: true,
      createdAt: null as any,
      updatedAt: null as any,
    },
    {
      id: '4',
      icon: '⏰',
      title: "24/7 Support",
      description: "Round-the-clock assistance throughout your journey in Sri Lanka",
      order: 3,
      isActive: true,
      createdAt: null as any,
      updatedAt: null as any,
    }
  ];

  // Load features from Firestore CMS
  useEffect(() => {
    const loadFeatures = async () => {
      try {
        setLoading(true);
        const data = await whyChooseUsService.getAll();

        if (data && data.length > 0) {
          console.log('✅ Loaded', data.length, 'why choose us features from CMS');
          setFeatures(data);
        } else {
          console.log('ℹ️ No features in CMS, using defaults');
          setFeatures(defaultReasons);
        }
      } catch (error) {
        console.error('❌ Error loading why choose us features from CMS:', error);
        setFeatures(defaultReasons);
      } finally {
        setLoading(false);
      }
    };

    loadFeatures();
  }, []);

  if (loading) {
    return (
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4 lg:px-8 text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading features...</p>
        </div>
      </section>
    );
  }

  return (
    <section className="py-20 bg-gray-50">
      <div className="container mx-auto px-4 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl font-bold text-gray-900 mb-4 font-playfair">Why Choose Recharge Travels</h2>
          <p className="text-xl text-gray-600">Your trusted partner for unforgettable Sri Lankan adventures</p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={feature.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="text-center"
            >
              <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-4">
                <span className="text-3xl">{feature.icon}</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">{feature.title}</h3>
              <p className="text-gray-600">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default WhyChooseUs;