import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
  Sparkles,
  Crown,
  Plane,
  Anchor,
  Car,
  Mountain,
  ArrowRight,
  Star,
  Clock,
  Users
} from 'lucide-react';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import 'react-lazy-load-image-component/src/effects/blur.css';
import { db } from '@/lib/firebase';
import { doc, getDoc } from 'firebase/firestore';

// Default images as fallback
const defaultImages: Record<string, string> = {
  'dream-journeys': 'https://images.unsplash.com/photo-1596402184320-417e7178b2cd?w=1200&q=80',
  'vip-concierge': 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=1200&q=80',
  'exclusive-access': 'https://images.unsplash.com/photo-1596402184320-417e7178b2cd?w=1200&q=80',
  'helicopter-charters': 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=1200&q=80',
  'private-yachts': 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=1200&q=80',
  'luxury-vehicles': 'https://images.unsplash.com/photo-1563720360172-67b8f3dce741?w=1200&q=80'
};

const luxuryExperiencesData = [
  {
    id: 'dream-journeys',
    title: 'Dream Journeys',
    subtitle: 'Ultimate Experiences',
    description: 'Multi-day curated adventures combining helicopters, yachts, and exclusive access',
    icon: Mountain,
    image: 'https://images.unsplash.com/photo-1596402184320-417e7178b2cd?w=1200&q=80',
    color: 'amber',
    link: '/experiences/luxury/dream-journeys',
    stats: { duration: '3-5 Days', guests: '2-6', rating: 5.0 }
  },
  {
    id: 'vip-concierge',
    title: 'VIP Concierge',
    subtitle: 'Personalized Service',
    description: 'Private chefs, security details, event planning, and bespoke celebrations',
    icon: Crown,
    image: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=1200&q=80',
    color: 'rose',
    link: '/experiences/luxury/vip-concierge',
    stats: { duration: 'On Demand', guests: 'Custom', rating: 5.0 }
  },
  {
    id: 'exclusive-access',
    title: 'Exclusive Access',
    subtitle: 'VIP Privileges',
    description: 'Private temple blessings, museum openings, and cultural immersions',
    icon: Sparkles,
    image: 'https://images.unsplash.com/photo-1596402184320-417e7178b2cd?w=1200&q=80',
    color: 'violet',
    link: '/experiences/luxury/exclusive-access',
    stats: { duration: 'Custom', guests: '2-10', rating: 5.0 }
  },
  {
    id: 'helicopter-charters',
    title: 'Helicopter Charters',
    subtitle: 'Sky-High Luxury',
    description: 'Soar above Sri Lanka in our fleet of executive helicopters with champagne service',
    icon: Plane,
    image: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=1200&q=80',
    color: 'blue',
    link: '/experiences/luxury/helicopter-charters',
    stats: { duration: 'Custom', guests: '2-8', rating: 4.9 }
  },
  {
    id: 'private-yachts',
    title: 'Private Yachts',
    subtitle: 'Oceanic Excellence',
    description: 'Charter super yachts with personal crew for whale watching and coastal adventures',
    icon: Anchor,
    image: 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=1200&q=80',
    color: 'cyan',
    link: '/experiences/luxury/private-yachts',
    stats: { duration: 'Half/Full Day', guests: '2-12', rating: 5.0 }
  },
  {
    id: 'luxury-vehicles',
    title: 'Luxury Vehicles',
    subtitle: 'Supreme Comfort',
    description: 'Rolls-Royce, Bentley, and Maybach fleet with professional chauffeurs',
    icon: Car,
    image: 'https://images.unsplash.com/photo-1563720360172-67b8f3dce741?w=1200&q=80',
    color: 'slate',
    link: '/experiences/luxury/luxury-vehicles',
    stats: { duration: 'Custom', guests: '1-4', rating: 4.9 }
  }
];

const LuxuryExperiences = () => {
  const [dynamicImages, setDynamicImages] = useState<Record<string, string>>({});

  // Fetch images from Firestore on mount - ALL luxury pages
  useEffect(() => {
    const fetchImages = async () => {
      const imageMap: Record<string, string> = {};
      
      // Map of ALL page IDs to their Firestore document names
      const pageDocMap: Record<string, string> = {
        'dream-journeys': 'dream-journeys',
        'vip-concierge': 'vip-concierge',
        'exclusive-access': 'exclusive-access',
        'helicopter-charters': 'helicopter-charters',
        'private-yachts': 'private-yachts',
        'luxury-vehicles': 'luxury-vehicles'
      };

      for (const [pageId, docName] of Object.entries(pageDocMap)) {
        try {
          const docRef = doc(db, 'luxuryPages', docName);
          const docSnap = await getDoc(docRef);
          if (docSnap.exists()) {
            const data = docSnap.data();
            // Get first hero image if available
            if (data.heroImages && data.heroImages.length > 0) {
              imageMap[pageId] = data.heroImages[0].url;
            }
          }
        } catch (error) {
          console.error(`Error fetching ${pageId} images:`, error);
        }
      }
      
      setDynamicImages(imageMap);
    };

    fetchImages();
  }, []);

  // Merge dynamic images with defaults
  const getImage = (id: string, fallback: string) => {
    return dynamicImages[id] || fallback;
  };

  return (
    <section className="relative py-24 bg-slate-50 overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-orange-100/40 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-blue-100/40 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />
      </div>

      <div className="container mx-auto px-4 lg:px-8 relative z-10">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 bg-white px-6 py-2 rounded-full shadow-sm border border-slate-100 mb-6">
            <Crown className="w-4 h-4 text-amber-500" />
            <span className="text-slate-600 font-medium text-sm uppercase tracking-wider">Curated Experiences</span>
          </div>

          <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-6 font-playfair">
            Luxury <span className="text-amber-600">Experiences</span>
          </h2>

          <p className="text-lg text-slate-600 max-w-3xl mx-auto leading-relaxed">
            Handcrafted journeys that go beyond the ordinary, designed for discerning travelers
            seeking authentic luxury and unforgettable moments
          </p>
        </motion.div>

        {/* Luxury Experiences Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {luxuryExperiencesData.map((experience, index) => {
            const Icon = experience.icon;
            return (
              <motion.div
                key={experience.id}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
              >
                <Link to={experience.link} className="block h-full">
                  <div className="group h-full bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 border border-slate-100 flex flex-col">
                    {/* Image Section */}
                    <div className="relative h-64 overflow-hidden">
                      <LazyLoadImage
                        src={getImage(experience.id, experience.image)}
                        alt={experience.title}
                        effect="blur"
                        className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700"
                      />
                      <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-semibold text-slate-700 flex items-center gap-1 shadow-sm">
                        <Star className="w-3 h-3 text-amber-500 fill-amber-500" />
                        {experience.stats.rating}
                      </div>

                      {/* Icon Badge */}
                      <div className={`absolute -bottom-6 left-8 w-12 h-12 rounded-xl bg-white shadow-lg flex items-center justify-center z-10 group-hover:-translate-y-1 transition-transform duration-300`}>
                        <Icon className={`w-6 h-6 text-${experience.color}-600`} />
                      </div>
                    </div>

                    {/* Content Section */}
                    <div className="p-8 pt-10 flex-grow flex flex-col">
                      <div className="mb-4">
                        <span className={`text-${experience.color}-600 font-semibold text-xs uppercase tracking-wider`}>
                          {experience.subtitle}
                        </span>
                        <h3 className="text-2xl font-bold text-slate-900 mt-1 mb-3 group-hover:text-amber-600 transition-colors">
                          {experience.title}
                        </h3>
                        <p className="text-slate-600 text-sm leading-relaxed line-clamp-3">
                          {experience.description}
                        </p>
                      </div>

                      <div className="mt-auto pt-4 border-t border-slate-100">
                        <div className="flex items-center justify-between text-sm text-slate-500 mb-4">
                          <div className="flex items-center gap-2">
                            <Clock className="w-4 h-4" />
                            <span>{experience.stats.duration}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Users className="w-4 h-4" />
                            <span>{experience.stats.guests}</span>
                          </div>
                        </div>

                        <div className="flex items-center text-amber-600 font-semibold text-sm group-hover:gap-2 transition-all">
                          Explore Experience
                          <ArrowRight className="w-4 h-4 ml-1 transform group-hover:translate-x-1 transition-transform" />
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </div>

        {/* CTA Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center"
        >
          <div className="max-w-3xl mx-auto bg-white rounded-3xl p-12 shadow-xl border border-slate-100 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-amber-400 via-orange-500 to-rose-500" />

            <Sparkles className="w-10 h-10 text-amber-500 mx-auto mb-6" />
            <h3 className="text-3xl font-bold text-slate-900 mb-4">
              Can't Find What You're Looking For?
            </h3>
            <p className="text-slate-600 text-lg mb-8">
              We create bespoke experiences tailored to your dreams. Let our luxury concierge design your perfect Sri Lankan adventure.
            </p>
            <Link to="/experiences/luxury/dream-journeys">
              <button className="px-8 py-4 bg-slate-900 text-white font-bold text-lg rounded-xl hover:bg-slate-800 transition-colors shadow-lg hover:shadow-xl flex items-center gap-2 mx-auto">
                Create Your Custom Experience
                <ArrowRight className="w-5 h-5" />
              </button>
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default LuxuryExperiences;
