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

const luxuryExperiences = [
  {
    id: 'helicopter-charters',
    title: 'Helicopter Charters',
    subtitle: 'Sky-High Luxury',
    description: 'Soar above Sri Lanka in our fleet of executive helicopters with champagne service',
    icon: Plane,
    image: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=1200&q=80',
    gradient: 'from-sky-500 via-blue-600 to-indigo-700',
    link: '/tours/luxury#helicopters',
    stats: { duration: 'Custom', guests: '2-8', rating: 4.9 }
  },
  {
    id: 'private-yachts',
    title: 'Private Yachts',
    subtitle: 'Oceanic Excellence',
    description: 'Charter super yachts with personal crew, underwater dining, and spa suites',
    icon: Anchor,
    image: 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=1200&q=80',
    gradient: 'from-cyan-500 via-teal-600 to-blue-700',
    link: '/tours/luxury#yachts',
    stats: { duration: 'Half/Full Day', guests: '2-12', rating: 5.0 }
  },
  {
    id: 'luxury-vehicles',
    title: 'Luxury Vehicles',
    subtitle: 'Supreme Comfort',
    description: 'Rolls-Royce, Bentley, and Maybach fleet with personal chauffeurs',
    icon: Car,
    image: 'https://images.unsplash.com/photo-1563720360172-67b8f3dce741?w=1200&q=80',
    gradient: 'from-amber-500 via-orange-600 to-red-700',
    link: '/tours/luxury#vehicles',
    stats: { duration: 'Custom', guests: '1-4', rating: 4.9 }
  },
  {
    id: 'dream-journeys',
    title: 'Dream Journeys',
    subtitle: 'Ultimate Experiences',
    description: 'Multi-day curated adventures combining helicopters, yachts, and exclusive access',
    icon: Mountain,
    image: 'https://images.unsplash.com/photo-1549366021-9f761d040a94?w=1200&q=80',
    gradient: 'from-purple-500 via-pink-600 to-rose-700',
    link: '/tours/luxury#journeys',
    stats: { duration: '3-5 Days', guests: '2-6', rating: 5.0 }
  },
  {
    id: 'vip-concierge',
    title: 'VIP Concierge',
    subtitle: 'Personalized Service',
    description: 'Private chefs, security details, event planning, and bespoke celebrations',
    icon: Crown,
    image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=1200&q=80',
    gradient: 'from-yellow-500 via-amber-600 to-orange-700',
    link: '/tours/luxury#concierge',
    stats: { duration: 'On Demand', guests: 'Custom', rating: 5.0 }
  },
  {
    id: 'exclusive-experiences',
    title: 'Exclusive Access',
    subtitle: 'VIP Privileges',
    description: 'Private temple blessings, museum openings, and cultural immersions',
    icon: Sparkles,
    image: 'https://images.unsplash.com/photo-1564501049412-61c2a3083791?w=1200&q=80',
    gradient: 'from-emerald-500 via-green-600 to-teal-700',
    link: '/tours/luxury',
    stats: { duration: 'Custom', guests: '2-10', rating: 5.0 }
  }
];

const LuxuryExperiences = () => {
  return (
    <section className="relative py-24 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden opacity-20">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-gradient-to-br from-amber-400 to-orange-600 rounded-full blur-3xl animate-pulse" />
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-gradient-to-tr from-blue-400 to-purple-600 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-r from-pink-400 to-rose-600 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }} />
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
          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-amber-500/20 to-orange-500/20 backdrop-blur-sm px-6 py-3 rounded-full border border-amber-500/30 mb-6">
            <Crown className="w-5 h-5 text-amber-400" />
            <span className="text-amber-400 font-semibold text-sm uppercase tracking-wider">Curated Experiences</span>
          </div>

          <h2 className="text-5xl md:text-6xl font-bold text-white mb-6 font-playfair">
            Luxury <span className="bg-gradient-to-r from-amber-400 via-orange-500 to-rose-500 bg-clip-text text-transparent">Experiences</span>
          </h2>

          <p className="text-xl text-slate-300 max-w-3xl mx-auto leading-relaxed">
            Handcrafted journeys that go beyond the ordinary, designed for discerning travelers
            seeking authentic luxury and unforgettable moments
          </p>
        </motion.div>

        {/* Luxury Experiences Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {luxuryExperiences.map((experience, index) => {
            const Icon = experience.icon;
            return (
              <motion.div
                key={experience.id}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
              >
                <Link to={experience.link}>
                  <div className="group relative h-[500px] rounded-2xl overflow-hidden shadow-2xl hover:shadow-3xl transition-all duration-500 transform hover:-translate-y-2">
                    {/* Background Image with Overlay */}
                    <div className="absolute inset-0">
                      <LazyLoadImage
                        src={experience.image}
                        alt={experience.title}
                        effect="blur"
                        className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700"
                      />
                      <div className={`absolute inset-0 bg-gradient-to-t ${experience.gradient} opacity-60 group-hover:opacity-70 transition-opacity duration-500`} />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent" />
                    </div>

                    {/* Content */}
                    <div className="relative h-full p-8 flex flex-col justify-between">
                      {/* Top Section - Icon & Badge */}
                      <div className="flex items-start justify-between">
                        <div className={`inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br ${experience.gradient} shadow-xl transform group-hover:scale-110 group-hover:rotate-6 transition-all duration-500`}>
                          <Icon className="w-8 h-8 text-white" />
                        </div>

                        <div className="flex items-center gap-1 bg-white/20 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/30">
                          <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
                          <span className="text-white font-semibold text-sm">{experience.stats.rating}</span>
                        </div>
                      </div>

                      {/* Bottom Section - Details */}
                      <div>
                        <p className="text-amber-400 font-semibold text-sm uppercase tracking-wider mb-2">
                          {experience.subtitle}
                        </p>
                        <h3 className="text-3xl font-bold text-white mb-3 group-hover:text-amber-400 transition-colors duration-300">
                          {experience.title}
                        </h3>
                        <p className="text-slate-200 text-sm leading-relaxed mb-6">
                          {experience.description}
                        </p>

                        {/* Stats */}
                        <div className="flex items-center gap-4 mb-4 text-sm text-slate-300">
                          <div className="flex items-center gap-2">
                            <Clock className="w-4 h-4" />
                            <span>{experience.stats.duration}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Users className="w-4 h-4" />
                            <span>{experience.stats.guests}</span>
                          </div>
                        </div>

                        {/* CTA */}
                        <div className="flex items-center gap-2 text-amber-400 font-semibold group-hover:gap-4 transition-all duration-300">
                          <span>Explore Now</span>
                          <ArrowRight className="w-5 h-5 transform group-hover:translate-x-2 transition-transform duration-300" />
                        </div>
                      </div>
                    </div>

                    {/* Shine Effect on Hover */}
                    <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
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
          <div className="max-w-2xl mx-auto bg-gradient-to-br from-slate-800/80 to-slate-900/80 backdrop-blur-xl border border-white/10 rounded-3xl p-12 shadow-2xl">
            <Sparkles className="w-12 h-12 text-amber-400 mx-auto mb-6" />
            <h3 className="text-3xl font-bold text-white mb-4">
              Can't Find What You're Looking For?
            </h3>
            <p className="text-slate-300 text-lg mb-8">
              We create bespoke experiences tailored to your dreams. Let our luxury concierge design your perfect Sri Lankan adventure.
            </p>
            <Link to="/tours/luxury">
              <button className="group relative px-10 py-5 bg-gradient-to-r from-amber-500 via-orange-500 to-rose-500 text-white font-bold text-lg rounded-xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105">
                <span className="relative z-10 flex items-center gap-3">
                  Create Your Custom Experience
                  <ArrowRight className="w-6 h-6 transform group-hover:translate-x-2 transition-transform duration-300" />
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-rose-500 via-orange-500 to-amber-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </button>
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default LuxuryExperiences;
