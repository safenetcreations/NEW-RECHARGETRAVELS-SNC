import { motion } from 'framer-motion';
import { Star, Quote } from 'lucide-react';
import { useState, useEffect } from 'react';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import 'react-lazy-load-image-component/src/effects/blur.css';
import { testimonialsService, homepageStatsService } from '@/services/cmsService';
import type { Testimonial, HomepageStat } from '@/types/cms';

const TestimonialsSection = () => {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [stats, setStats] = useState<HomepageStat[]>([]);
  const [loading, setLoading] = useState(true);

  // Default fallback testimonials
  const defaultTestimonials = [
    {
      id: '1',
      name: "Sarah Johnson",
      location: "New York, USA",
      image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=200",
      rating: 5,
      text: "Our Sri Lankan adventure exceeded all expectations! The team at Recharge Travels crafted a perfect itinerary that balanced culture, nature, and relaxation. The private transfers were luxurious and our driver was incredibly knowledgeable.",
      tripType: "Honeymoon Trip",
      date: "December 2023",
      isActive: true,
      isFeatured: true,
      order: 0,
      createdAt: null as any,
      updatedAt: null as any,
    },
    {
      id: '2',
      name: "Michael Chen",
      location: "Singapore",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=200",
      rating: 5,
      text: "As a photographer, I was blown away by the locations they took us to. The sunrise at Sigiriya and the tea plantations in Ella were magical. Their attention to detail and local expertise made all the difference.",
      tripType: "Photography Tour",
      date: "January 2024",
      isActive: true,
      isFeatured: true,
      order: 1,
      createdAt: null as any,
      updatedAt: null as any,
    },
    {
      id: '3',
      name: "Emma Thompson",
      location: "London, UK",
      image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=200",
      rating: 5,
      text: "Traveling with my family of 6 was made so easy by Recharge Travels. They handled everything from airport pickups to arranging child-friendly activities. The whale watching in Mirissa was a highlight for the kids!",
      tripType: "Family Vacation",
      date: "November 2023",
      isActive: true,
      isFeatured: true,
      order: 2,
      createdAt: null as any,
      updatedAt: null as any,
    }
  ];

  // Default fallback stats
  const defaultStats: HomepageStat[] = [
    {
      id: '1',
      label: 'Happy Travelers',
      value: '2,847+',
      icon: '✈️',
      order: 0,
      isActive: true,
      createdAt: null as any,
      updatedAt: null as any,
    },
    {
      id: '2',
      label: 'Average Rating',
      value: '4.9/5',
      icon: '⭐',
      order: 1,
      isActive: true,
      createdAt: null as any,
      updatedAt: null as any,
    },
    {
      id: '3',
      label: 'Would Recommend',
      value: '98%',
      icon: '👍',
      order: 2,
      isActive: true,
      createdAt: null as any,
      updatedAt: null as any,
    },
  ];

  // Load testimonials and stats from Firestore CMS
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);

        // Load testimonials
        const featured = await testimonialsService.getFeatured(3);
        if (featured && featured.length > 0) {
          console.log('✅ Loaded', featured.length, 'featured testimonials from CMS');
          setTestimonials(featured);
        } else {
          const all = await testimonialsService.getAll();
          if (all && all.length > 0) {
            console.log('✅ Loaded', all.length, 'testimonials from CMS');
            setTestimonials(all.slice(0, 3));
          } else {
            console.log('ℹ️ No testimonials in CMS, using defaults');
            setTestimonials(defaultTestimonials);
          }
        }

        // Load stats
        const statsData = await homepageStatsService.getAll();
        if (statsData && statsData.length > 0) {
          console.log('✅ Loaded', statsData.length, 'homepage stats from CMS');
          setStats(statsData);
        } else {
          console.log('ℹ️ No stats in CMS, using defaults');
          setStats(defaultStats);
        }
      } catch (error) {
        console.error('❌ Error loading data from CMS:', error);
        setTestimonials(defaultTestimonials);
        setStats(defaultStats);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  if (loading) {
    return (
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4 lg:px-8 text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading testimonials...</p>
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
          <span className="text-blue-600 font-semibold text-sm uppercase tracking-wider">Happy Travelers</span>
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mt-4 mb-6 font-playfair">
            What Our Guests Say
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Don't just take our word for it - hear from travelers who've experienced 
            the magic of Sri Lanka with us
          </p>
        </motion.div>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={testimonial.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="bg-gray-50 rounded-2xl p-8 relative"
            >
              {/* Quote Icon */}
              <Quote className="absolute top-6 right-6 w-10 h-10 text-blue-100" />

              {/* Rating */}
              <div className="flex gap-1 mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                ))}
              </div>

              {/* Testimonial Text */}
              <p className="text-gray-700 mb-6 relative z-10 leading-relaxed">
                "{testimonial.text}"
              </p>

              {/* Author Info */}
              <div className="flex items-center gap-4">
                <LazyLoadImage
                  alt={testimonial.name}
                  effect="blur"
                  src={testimonial.image}
                  className="w-14 h-14 rounded-full object-cover"
                />
                <div>
                  <h4 className="font-semibold text-gray-900">{testimonial.name}</h4>
                  <p className="text-sm text-gray-600">{testimonial.location}</p>
                </div>
              </div>

              {/* Trip Info */}
              <div className="mt-4 pt-4 border-t border-gray-200">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">{testimonial.tripType}</span>
                  <span className="text-gray-500">{testimonial.date}</span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Trust Badges / Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-16 text-center"
        >
          <div className="inline-flex items-center gap-8 flex-wrap justify-center">
            {stats.map((stat) => (
              <div key={stat.id} className="text-center">
                {stat.icon && (
                  <div className="text-2xl mb-2">{stat.icon}</div>
                )}
                <div className="text-4xl font-bold text-gray-900">{stat.value}</div>
                <div className="text-sm text-gray-600 mt-1">{stat.label}</div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
