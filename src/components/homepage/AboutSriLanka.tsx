import { motion } from 'framer-motion';
import { Globe, Users, Leaf, Award } from 'lucide-react';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import 'react-lazy-load-image-component/src/effects/blur.css';

const AboutSriLanka = () => {
  const stats = [
    { icon: Globe, value: "65,610", label: "Square Kilometers", desc: "Compact island paradise" },
    { icon: Users, value: "22M", label: "Population", desc: "Warm & welcoming people" },
    { icon: Leaf, value: "3,000+", label: "Endemic Species", desc: "Biodiversity hotspot" },
    { icon: Award, value: "8", label: "UNESCO Sites", desc: "World heritage treasures" }
  ];

  return (
    <section className="py-20 bg-gradient-to-br from-blue-50 to-teal-50">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Content */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <span className="text-blue-600 font-semibold text-sm uppercase tracking-wider">About Sri Lanka</span>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mt-4 mb-6 font-playfair">
              The Pearl of the Indian Ocean
            </h2>
            <p className="text-lg text-gray-700 mb-6 leading-relaxed">
              Sri Lanka, a teardrop-shaped island in the Indian Ocean, offers an incredible diversity 
              of experiences within its compact borders. From misty mountains and lush rainforests to 
              golden beaches and ancient ruins, this tropical paradise has captivated travelers for centuries.
            </p>
            <p className="text-lg text-gray-700 mb-8 leading-relaxed">
              With a history spanning over 2,500 years, Sri Lanka boasts eight UNESCO World Heritage Sites, 
              a rich cultural tapestry influenced by Buddhism, Hinduism, and colonial heritage, and some of 
              the world's finest tea, spices, and gemstones.
            </p>
            
            {/* Stats Grid */}
            <div className="grid grid-cols-2 gap-6">
              {stats.map((stat, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-white rounded-xl p-6 shadow-lg"
                >
                  <stat.icon className="w-8 h-8 text-blue-600 mb-3" />
                  <div className="text-2xl font-bold text-gray-900">{stat.value}</div>
                  <div className="text-sm font-semibold text-gray-700">{stat.label}</div>
                  <div className="text-xs text-gray-500 mt-1">{stat.desc}</div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Image Collage */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="relative"
          >
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-4">
                <LazyLoadImage
                  alt="Tea Plantations"
                  effect="blur"
                  src="https://images.unsplash.com/photo-1590165482129-1b8b27698780?q=80&w=600"
                  className="rounded-2xl shadow-lg w-full h-48 object-cover"
                />
                <LazyLoadImage
                  alt="Ancient Temple"
                  effect="blur"
                  src="https://images.unsplash.com/photo-1586135084234-5d44cf8c5b94?q=80&w=600"
                  className="rounded-2xl shadow-lg w-full h-64 object-cover"
                />
              </div>
              <div className="space-y-4 mt-8">
                <LazyLoadImage
                  alt="Beach Paradise"
                  effect="blur"
                  src="https://images.unsplash.com/photo-1567157577867-05ccb1388e66?q=80&w=600"
                  className="rounded-2xl shadow-lg w-full h-64 object-cover"
                />
                <LazyLoadImage
                  alt="Wildlife"
                  effect="blur"
                  src="https://images.unsplash.com/photo-1596895203555-280dd1cf0226?q=80&w=600"
                  className="rounded-2xl shadow-lg w-full h-48 object-cover"
                />
              </div>
            </div>
            
            {/* Floating Badge */}
            <div className="absolute -top-4 -right-4 bg-orange-500 text-white rounded-full p-6 shadow-xl">
              <div className="text-center">
                <div className="text-2xl font-bold">Top 10</div>
                <div className="text-xs">Travel Destination</div>
                <div className="text-xs">2024</div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default AboutSriLanka;
