import { motion } from 'framer-motion';
import { Sparkles, Camera, Palette, Heart, Mountain, Waves } from 'lucide-react';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import 'react-lazy-load-image-component/src/effects/blur.css';

const LuxuryExperiences = () => {
  const experiences = [
    {
      icon: Sparkles,
      title: "Luxury Safari",
      description: "Private game drives in Yala with expert naturalists and gourmet bush dinners",
      image: "https://images.unsplash.com/photo-1516426122078-c23e76319801?q=80&w=2940",
      color: "from-amber-500 to-orange-600"
    },
    {
      icon: Camera,
      title: "Photography Tours",
      description: "Capture Sri Lanka's beauty with professional photographers at golden hour",
      image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?q=80&w=2940",
      color: "from-purple-500 to-pink-600"
    },
    {
      icon: Palette,
      title: "Cultural Immersion",
      description: "Private temple ceremonies, traditional crafts, and authentic village experiences",
      image: "https://images.unsplash.com/photo-1582510003544-4d00b7f74220?q=80&w=2940",
      color: "from-teal-500 to-cyan-600"
    },
    {
      icon: Heart,
      title: "Wellness Retreats",
      description: "Ayurvedic spa treatments and yoga sessions in serene mountain settings",
      image: "https://images.unsplash.com/photo-1540555700478-4be289fbecef?q=80&w=2940",
      color: "from-rose-500 to-pink-600"
    },
    {
      icon: Mountain,
      title: "Adventure Expeditions",
      description: "Helicopter tours, white water rafting, and exclusive hiking experiences",
      image: "https://images.unsplash.com/photo-1464207687429-7505649dae38?q=80&w=2940",
      color: "from-blue-500 to-indigo-600"
    },
    {
      icon: Waves,
      title: "Marine Adventures",
      description: "Private yacht charters, diving expeditions, and whale watching tours",
      image: "https://images.unsplash.com/photo-1559827260-dc66d52bef19?q=80&w=2940",
      color: "from-cyan-500 to-blue-600"
    }
  ];

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
          <span className="text-blue-600 font-semibold text-sm uppercase tracking-wider">Curated Experiences</span>
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mt-4 mb-6 font-playfair">
            Luxury Experiences
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Handcrafted journeys that go beyond the ordinary, designed for discerning travelers 
            seeking authentic luxury and unforgettable moments
          </p>
        </motion.div>

        {/* Experiences Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {experiences.map((experience, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="group relative overflow-hidden rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500"
            >
              {/* Background Image */}
              <div className="absolute inset-0">
                <LazyLoadImage
                  alt={experience.title}
                  effect="blur"
                  src={experience.image}
                  className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
              </div>

              {/* Content */}
              <div className="relative p-8 h-80 flex flex-col justify-end">
                {/* Icon */}
                <div className={`inline-flex items-center justify-center w-14 h-14 rounded-xl bg-gradient-to-r ${experience.color} mb-4 shadow-lg`}>
                  <experience.icon className="w-7 h-7 text-white" />
                </div>

                {/* Text */}
                <h3 className="text-2xl font-bold text-white mb-2">{experience.title}</h3>
                <p className="text-white/90 text-sm leading-relaxed">{experience.description}</p>

                {/* Hover Effect */}
                <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-white/50 to-transparent transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500" />
              </div>
            </motion.div>
          ))}
        </div>

        {/* CTA Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mt-16"
        >
          <p className="text-gray-600 mb-6">
            Can't find what you're looking for? We create bespoke experiences tailored to your dreams
          </p>
          <button className="px-8 py-4 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg">
            Create Your Custom Experience
          </button>
        </motion.div>
      </div>
    </section>
  );
};

export default LuxuryExperiences;
