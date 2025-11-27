import { motion, useInView, type Variants, type TargetAndTransition } from 'framer-motion';
import { useRef } from 'react';
import {
  Sparkles,
  Clock,
  Users,
  ArrowRight,
  Crown,
  Gem,
  Star,
  Award,
  Heart,
  Camera,
  Palette
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { sriLankanLuxuryExperiences } from '@/data/sriLankanLuxuryExperiences';

// Icon mapping
const iconMap: Record<string, any> = {
  Crown,
  Gem,
  Star,
  Award,
  Heart,
  Camera
};

// Use Sri Lankan luxury experiences data
const luxuryExperiences = sriLankanLuxuryExperiences;

// Keep old data for reference (can be removed)
const oldLuxuryExperiences = [
  {
    id: 1,
    title: 'Private Helicopter Tours',
    subtitle: 'Aerial Paradise Views',
    description: 'Soar above Sri Lanka\'s stunning landscapes in exclusive helicopter tours, witnessing emerald tea estates, ancient temples, and pristine coastlines from a breathtaking perspective.',
    image: 'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=800',
    icon: Crown,
    gradient: 'from-purple-600 via-pink-600 to-red-600',
    features: ['Private aircraft', 'Expert pilot', 'Champagne service', 'Photography stops'],
    duration: '2-4 hours',
    groupSize: 'Up to 6 guests',
    link: '/experiences/helicopter-tours'
  },
  {
    id: 2,
    title: 'Royal Heritage & Palaces',
    subtitle: 'Historic Grandeur',
    description: 'Experience the opulence of Sri Lanka\'s royal past with private tours of ancient palaces, exclusive access to archaeological sites, and dining in heritage properties.',
    image: 'https://images.unsplash.com/photo-1548013146-72479768bada?w=800',
    icon: Gem,
    gradient: 'from-amber-600 via-orange-600 to-yellow-600',
    features: ['Private guides', 'VIP access', 'Heritage dining', 'Cultural immersion'],
    duration: 'Full day',
    groupSize: 'Intimate groups',
    link: '/experiences/royal-heritage'
  },
  {
    id: 3,
    title: 'Luxury Yacht Expeditions',
    subtitle: 'Ocean Elegance',
    description: 'Cruise the azure waters of the Indian Ocean aboard private yachts, with whale watching, sunset cocktails, and gourmet dining experiences on the waves.',
    image: 'https://images.unsplash.com/photo-1569263979104-865ab7cd8d13?w=800',
    icon: Star,
    gradient: 'from-blue-600 via-cyan-600 to-teal-600',
    features: ['Private yacht', 'Master chef', 'Water sports', 'Marine wildlife'],
    duration: 'Half/Full day',
    groupSize: '2-12 guests',
    link: '/experiences/yacht-expeditions'
  },
  {
    id: 4,
    title: 'Exclusive Wildlife Safaris',
    subtitle: 'VIP Safari Experience',
    description: 'Encounter leopards, elephants, and exotic wildlife in ultimate luxury with private game drives, champagne sundowners, and five-star safari lodges.',
    image: 'https://images.unsplash.com/photo-1516426122078-c23e76319801?w=800',
    icon: Award,
    gradient: 'from-green-600 via-emerald-600 to-teal-600',
    features: ['Private jeep', 'Expert tracker', 'Luxury lodge', 'Bush dining'],
    duration: '2-3 days',
    groupSize: 'Private groups',
    link: '/wildtours'
  },
  {
    id: 5,
    title: 'Culinary Masterclasses',
    subtitle: 'Gastronomic Journey',
    description: 'Learn the secrets of Sri Lankan cuisine from master chefs in exclusive cooking classes, followed by dining experiences at Michelin-starred restaurants.',
    image: 'https://images.unsplash.com/photo-1556910103-1c02745aae4d?w=800',
    icon: Heart,
    gradient: 'from-red-600 via-rose-600 to-pink-600',
    features: ['Master chefs', 'Market tours', 'Private kitchen', 'Wine pairing'],
    duration: '4-6 hours',
    groupSize: '4-8 guests',
    link: '/experiences/cooking-class-sri-lanka'
  },
  {
    id: 6,
    title: 'Photography Expeditions',
    subtitle: 'Capture Paradise',
    description: 'Join award-winning photographers on exclusive expeditions to capture Sri Lanka\'s most photogenic moments, from golden hour landscapes to wildlife encounters.',
    image: 'https://images.unsplash.com/photo-1452587925148-ce544e77e70d?w=800',
    icon: Camera,
    gradient: 'from-indigo-600 via-purple-600 to-pink-600',
    features: ['Pro photographer', 'Prime locations', 'Equipment', 'Post-processing'],
    duration: 'Flexible',
    groupSize: '2-6 guests',
    link: '/tours/photography'
  }
];

const EnhancedLuxuryExperiences = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.1 });

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.2
      }
    }
  };

  const itemVariants: Variants = {
    hidden: {
      opacity: 0,
      y: 60,
      scale: 0.9
    },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        type: 'spring' as const,
        stiffness: 100,
        damping: 12,
        duration: 0.6
      }
    }
  };

  const floatingAnimation: TargetAndTransition = {
    y: [0, -10, 0],
    transition: {
      duration: 3,
      repeat: Infinity,
      ease: 'easeInOut'
    }
  };

  return (
    <section className="relative py-24 bg-gradient-to-b from-white via-amber-50/30 to-white overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            rotate: [0, 90, 0],
            opacity: [0.03, 0.05, 0.03]
          }}
          transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
          className="absolute -top-1/2 -right-1/2 w-full h-full bg-gradient-to-br from-amber-400 to-orange-600 rounded-full blur-3xl"
        />
        <motion.div
          animate={{
            scale: [1, 1.3, 1],
            rotate: [0, -90, 0],
            opacity: [0.03, 0.05, 0.03]
          }}
          transition={{ duration: 25, repeat: Infinity, ease: 'linear' }}
          className="absolute -bottom-1/2 -left-1/2 w-full h-full bg-gradient-to-tr from-purple-400 to-pink-600 rounded-full blur-3xl"
        />
      </div>

      <div className="container mx-auto px-4 lg:px-8 relative z-10" ref={ref}>
        {/* Section Header with Animations */}
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: -30 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          className="text-center mb-20"
        >
          {/* Animated Badge */}
          <motion.div
            animate={floatingAnimation}
            className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-amber-100 to-orange-100 rounded-full mb-6 shadow-lg"
          >
            <Sparkles className="w-4 h-4 text-amber-600" />
            <span className="text-amber-900 font-semibold text-sm uppercase tracking-wider">
              Curated Experiences
            </span>
            <Sparkles className="w-4 h-4 text-amber-600" />
          </motion.div>

          {/* Main Title with Gradient */}
          <motion.h2
            initial={{ opacity: 0, scale: 0.9 }}
            animate={isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="text-5xl md:text-6xl lg:text-7xl font-bold mb-6 font-playfair"
          >
            <span className="bg-gradient-to-r from-amber-600 via-orange-600 to-rose-600 bg-clip-text text-transparent">
              Luxury Experiences
            </span>
          </motion.h2>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : { opacity: 0 }}
            transition={{ duration: 0.7, delay: 0.4 }}
            className="text-xl md:text-2xl text-gray-700 max-w-4xl mx-auto leading-relaxed font-montserrat"
          >
            Handcrafted journeys that go beyond the ordinary, designed for discerning travelers
            <br />
            <span className="text-amber-700 font-semibold">seeking authentic luxury and unforgettable moments</span>
          </motion.p>

          {/* Decorative Line */}
          <motion.div
            initial={{ scaleX: 0 }}
            animate={isInView ? { scaleX: 1 } : { scaleX: 0 }}
            transition={{ duration: 1, delay: 0.6 }}
            className="h-1 w-32 bg-gradient-to-r from-transparent via-amber-600 to-transparent mx-auto mt-8"
          />
        </motion.div>

        {/* Experiences Grid with Stagger Animation */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16"
        >
          {luxuryExperiences.map((experience, index) => {
            const Icon = iconMap[experience.icon as string] || Star;
            return (
              <motion.div
                key={experience.id}
                variants={itemVariants}
                whileHover={{
                  y: -12,
                  transition: { duration: 0.3 }
                }}
                className="group"
              >
                <Link to={experience.link} className="block">
                  <div className="relative overflow-hidden rounded-3xl shadow-2xl hover:shadow-3xl transition-all duration-500 h-full">
                    {/* Background Image with Parallax Effect */}
                    <div className="absolute inset-0">
                      <motion.img
                        whileHover={{ scale: 1.1 }}
                        transition={{ duration: 0.6 }}
                        src={experience.image}
                        alt={experience.title}
                        className="w-full h-full object-cover"
                        loading="lazy"
                      />
                      {/* Gradient Overlay */}
                      <div className={`absolute inset-0 bg-gradient-to-t ${experience.gradient} opacity-40 group-hover:opacity-60 transition-opacity duration-500`} />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent" />
                    </div>

                    {/* Content */}
                    <div className="relative p-8 h-[520px] flex flex-col justify-end">
                      {/* Floating Icon */}
                      <motion.div
                        animate={{
                          y: [0, -5, 0],
                          rotate: [0, 5, 0]
                        }}
                        transition={{
                          duration: 3,
                          repeat: Infinity,
                          ease: 'easeInOut'
                        }}
                        className={`inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br ${experience.gradient} mb-4 shadow-2xl transform group-hover:scale-110 transition-transform duration-300`}
                      >
                        <Icon className="w-8 h-8 text-white" />
                      </motion.div>

                      {/* Subtitle */}
                      <span className="text-amber-400 font-semibold text-sm uppercase tracking-wider mb-2">
                        {experience.subtitle}
                      </span>

                      {/* Title */}
                      <h3 className="text-3xl font-bold text-white mb-3 font-playfair group-hover:text-amber-300 transition-colors duration-300">
                        {experience.title}
                      </h3>

                      {/* Description */}
                      <p className="text-white/90 text-sm leading-relaxed mb-4 font-montserrat">
                        {experience.description}
                      </p>

                      {/* Meta Info */}
                      <div className="flex items-center gap-4 text-white/80 text-xs mb-4">
                        <div className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          <span>{experience.duration}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Users className="w-4 h-4" />
                          <span>{experience.groupSize}</span>
                        </div>
                      </div>

                      {/* Features Pills */}
                      <div className="flex flex-wrap gap-2 mb-4">
                        {experience.features.slice(0, 3).map((feature, idx) => (
                          <span
                            key={idx}
                            className="px-3 py-1 bg-white/20 backdrop-blur-sm text-white text-xs rounded-full border border-white/30"
                          >
                            {feature}
                          </span>
                        ))}
                      </div>

                      {/* CTA Button */}
                      <motion.div
                        className="flex items-center gap-2 text-white font-semibold group-hover:gap-4 transition-all duration-300"
                        whileHover={{ x: 5 }}
                      >
                        <span>Explore Experience</span>
                        <ArrowRight className="w-5 h-5" />
                      </motion.div>

                      {/* Animated Border */}
                      <motion.div
                        className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-white to-transparent"
                        initial={{ scaleX: 0 }}
                        whileHover={{ scaleX: 1 }}
                        transition={{ duration: 0.5 }}
                      />
                    </div>
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </motion.div>

        {/* Custom Experience CTA Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.7, delay: 1 }}
          className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-amber-600 via-orange-600 to-rose-600 p-12 text-center shadow-2xl"
        >
          {/* Animated Background Pattern */}
          <div className="absolute inset-0 opacity-10">
            <motion.div
              animate={{
                backgroundPosition: ['0% 0%', '100% 100%'],
              }}
              transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
              className="w-full h-full"
              style={{
                backgroundImage: 'repeating-linear-gradient(45deg, transparent, transparent 10px, rgba(255,255,255,0.1) 10px, rgba(255,255,255,0.1) 20px)',
                backgroundSize: '200% 200%'
              }}
            />
          </div>

          <div className="relative z-10">
            <Palette className="w-16 h-16 text-white mx-auto mb-6" />
            <h3 className="text-4xl font-bold text-white mb-4 font-playfair">
              Create Your Bespoke Journey
            </h3>
            <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto font-montserrat">
              Can't find what you're looking for? We create bespoke experiences tailored to your dreams.
              <br />
              <span className="font-semibold">Your imagination is the only limit.</span>
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link to="/experiences">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-10 py-5 bg-white text-amber-700 font-bold rounded-2xl transition-all duration-300 shadow-2xl hover:shadow-3xl text-lg inline-flex items-center gap-3 group"
                >
                  <Sparkles className="w-5 h-5 group-hover:rotate-180 transition-transform duration-500" />
                  View All Experiences
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-2 transition-transform duration-300" />
                </motion.button>
              </Link>
              <Link to="/custom-experience">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-10 py-5 bg-white/10 backdrop-blur-sm text-white font-bold rounded-2xl border-2 border-white/30 transition-all duration-300 hover:bg-white/20 text-lg inline-flex items-center gap-3 group"
                >
                  <Sparkles className="w-5 h-5 group-hover:rotate-180 transition-transform duration-500" />
                  Create Custom Experience
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-2 transition-transform duration-300" />
                </motion.button>
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default EnhancedLuxuryExperiences;
