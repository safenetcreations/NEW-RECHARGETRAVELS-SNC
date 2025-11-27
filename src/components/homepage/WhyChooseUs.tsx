import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Shield,
  Award,
  HeartHandshake,
  Clock,
  CheckCircle2,
  BadgeCheck,
  Star,
  Users,
  MapPin,
  Phone,
  CreditCard,
  RefreshCcw,
  Headphones,
  Lock,
  ThumbsUp,
  Zap,
  Globe,
  Car
} from 'lucide-react';
import { whyChooseUsService } from '@/services/cmsService';
import type { WhyChooseUsFeature } from '@/types/cms';

const WhyChooseUs = () => {
  const [features, setFeatures] = useState<WhyChooseUsFeature[]>([]);
  const [loading, setLoading] = useState(true);

  // Default fallback reasons
  const defaultReasons: WhyChooseUsFeature[] = [
    {
      id: '1',
      icon: 'shield',
      title: "100% Safe & Secure",
      description: "Licensed operators, insured vehicles, and verified drivers for your peace of mind",
      order: 0,
      isActive: true,
      createdAt: null as any,
      updatedAt: null as any,
    },
    {
      id: '2',
      icon: 'award',
      title: "Best Price Guarantee",
      description: "Competitive rates with no hidden fees. Price match promise on all services",
      order: 1,
      isActive: true,
      createdAt: null as any,
      updatedAt: null as any,
    },
    {
      id: '3',
      icon: 'handshake',
      title: "Local Expertise",
      description: "15+ years of experience with deep local knowledge and connections",
      order: 2,
      isActive: true,
      createdAt: null as any,
      updatedAt: null as any,
    },
    {
      id: '4',
      icon: 'clock',
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
          console.log('Loaded', data.length, 'why choose us features from CMS');
          setFeatures(data);
        } else {
          console.log('No features in CMS, using defaults');
          setFeatures(defaultReasons);
        }
      } catch (error) {
        console.error('Error loading why choose us features from CMS:', error);
        setFeatures(defaultReasons);
      } finally {
        setLoading(false);
      }
    };

    loadFeatures();
  }, []);

  // Trust statistics
  const trustStats = [
    { value: '2,847+', label: 'Happy Travelers', icon: Users },
    { value: '15+', label: 'Years Experience', icon: Award },
    { value: '4.9/5', label: 'Average Rating', icon: Star },
    { value: '98%', label: 'Would Recommend', icon: ThumbsUp }
  ];

  // Detailed trust features
  const trustFeatures = [
    {
      icon: Shield,
      title: '100% Safe & Secure',
      subtitle: 'Your Safety is Our Priority',
      description: 'Every vehicle is fully insured with comprehensive coverage. All our drivers undergo thorough background checks and hold valid certifications.',
      highlights: [
        'Government licensed tour operator',
        'Fully insured vehicles & passengers',
        'Background-verified drivers',
        'GPS-tracked journeys'
      ],
      color: 'from-emerald-500 to-teal-600',
      bgColor: 'bg-emerald-50'
    },
    {
      icon: Award,
      title: 'Best Price Guarantee',
      subtitle: 'Transparent & Competitive Pricing',
      description: 'We guarantee the best rates with absolutely no hidden charges. Found a lower price? We will match it plus give you an additional discount.',
      highlights: [
        'No hidden fees or charges',
        'Price match guarantee',
        'Free cancellation options',
        'Flexible payment plans'
      ],
      color: 'from-amber-500 to-orange-600',
      bgColor: 'bg-amber-50'
    },
    {
      icon: HeartHandshake,
      title: 'Local Expertise',
      subtitle: 'Authentic Sri Lankan Experience',
      description: 'Our team of local experts has over 15 years of experience. We know every hidden gem, best restaurant, and scenic route across the island.',
      highlights: [
        '15+ years in tourism industry',
        'Multilingual guides available',
        'Insider local knowledge',
        'Customized itineraries'
      ],
      color: 'from-blue-500 to-indigo-600',
      bgColor: 'bg-blue-50'
    },
    {
      icon: Headphones,
      title: '24/7 Support',
      subtitle: 'Always Here When You Need Us',
      description: 'Our dedicated support team is available round-the-clock. Whether it is a last-minute change or an emergency, we have got you covered.',
      highlights: [
        'WhatsApp & phone support',
        'Dedicated trip coordinator',
        'Real-time assistance',
        'Emergency helpline'
      ],
      color: 'from-purple-500 to-pink-600',
      bgColor: 'bg-purple-50'
    }
  ];

  // Trust badges/certifications
  const certifications = [
    { name: 'Sri Lanka Tourism', icon: Globe },
    { name: 'Verified Business', icon: BadgeCheck },
    { name: 'Secure Payments', icon: Lock },
    { name: 'Instant Confirmation', icon: Zap }
  ];

  // Customer guarantees
  const guarantees = [
    { icon: RefreshCcw, text: 'Free Cancellation up to 48 hours' },
    { icon: CreditCard, text: 'Secure Online Payments' },
    { icon: Car, text: 'Well-Maintained Vehicles' },
    { icon: Phone, text: 'Direct Driver Contact' }
  ];

  if (loading) {
    return (
      <section className="py-16 bg-gradient-to-b from-slate-50 to-white">
        <div className="container mx-auto px-4 lg:px-8 text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-orange-500 border-t-transparent mx-auto"></div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 bg-gradient-to-b from-slate-50 via-white to-slate-50 overflow-hidden">
      <div className="container mx-auto px-4 lg:px-8">

        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          {/* Trust Badge */}
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            whileInView={{ scale: 1, opacity: 1 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 bg-gradient-to-r from-green-500/10 to-emerald-500/10 px-5 py-2 rounded-full mb-6 border border-green-200"
          >
            <BadgeCheck className="w-5 h-5 text-green-600" />
            <span className="text-green-700 font-semibold text-sm tracking-wide">TRUSTED BY 2,800+ TRAVELERS</span>
          </motion.div>

          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
            Why <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-red-500">Choose Us</span>
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Your trusted partner for safe, memorable, and authentic Sri Lankan adventures.
            We are committed to making your journey exceptional.
          </p>
        </motion.div>

        {/* Trust Statistics Bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 rounded-2xl p-6 mb-12 shadow-xl"
        >
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {trustStats.map((stat, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className="text-center"
              >
                <div className="flex items-center justify-center gap-2 mb-2">
                  <stat.icon className="w-5 h-5 text-orange-400" />
                  <span className="text-2xl md:text-3xl font-bold text-white">{stat.value}</span>
                </div>
                <p className="text-slate-400 text-sm">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Main Trust Features Grid */}
        <div className="grid md:grid-cols-2 gap-6 mb-12">
          {trustFeatures.map((feature, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              className={`${feature.bgColor} rounded-2xl p-6 md:p-8 border border-gray-100 hover:shadow-xl transition-all duration-300 group`}
            >
              {/* Icon & Title */}
              <div className="flex items-start gap-4 mb-4">
                <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${feature.color} flex items-center justify-center flex-shrink-0 shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                  <feature.icon className="w-7 h-7 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-1">{feature.title}</h3>
                  <p className="text-sm font-medium text-gray-500">{feature.subtitle}</p>
                </div>
              </div>

              {/* Description */}
              <p className="text-gray-600 mb-5 leading-relaxed">
                {feature.description}
              </p>

              {/* Highlights */}
              <div className="grid grid-cols-2 gap-3">
                {feature.highlights.map((highlight, hIdx) => (
                  <div key={hIdx} className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-green-500 flex-shrink-0" />
                    <span className="text-sm text-gray-700">{highlight}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Customer Guarantees Strip */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 mb-12"
        >
          <h3 className="text-center text-lg font-semibold text-gray-900 mb-6">
            Our Promises to You
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {guarantees.map((guarantee, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 hover:bg-orange-50 transition-colors group"
              >
                <div className="w-10 h-10 rounded-lg bg-orange-100 flex items-center justify-center group-hover:bg-orange-200 transition-colors">
                  <guarantee.icon className="w-5 h-5 text-orange-600" />
                </div>
                <span className="text-sm font-medium text-gray-700">{guarantee.text}</span>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Certifications & Trust Badges */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <p className="text-sm text-gray-500 mb-4">Trusted & Verified</p>
          <div className="flex flex-wrap justify-center gap-4">
            {certifications.map((cert, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className="flex items-center gap-2 px-4 py-2 bg-white rounded-full border border-gray-200 shadow-sm hover:shadow-md transition-shadow"
              >
                <cert.icon className="w-4 h-4 text-green-600" />
                <span className="text-sm font-medium text-gray-700">{cert.name}</span>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Trust Statement */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-12 text-center max-w-3xl mx-auto"
        >
          <div className="bg-gradient-to-r from-orange-500/5 via-red-500/5 to-orange-500/5 rounded-2xl p-6 border border-orange-100">
            <div className="flex justify-center mb-4">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-5 h-5 text-yellow-400 fill-yellow-400" />
              ))}
            </div>
            <p className="text-gray-700 italic mb-4">
              "We don't just plan trips - we create memories. Every detail matters to us because your
              experience matters. From the moment you book until you return home, we are with you every step of the way."
            </p>
            <p className="text-sm font-semibold text-gray-900">- The Recharge Travels Team</p>
          </div>
        </motion.div>

      </div>
    </section>
  );
};

export default WhyChooseUs;
