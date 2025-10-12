import React from 'react';
import { Star, User } from 'lucide-react';

interface Testimonial {
  id: string;
  name: string;
  country: string;
  rating: number;
  comment: string;
  gradient: string;
}

const TestimonialsSection: React.FC = () => {
  const testimonials: Testimonial[] = [
    {
      id: '1',
      name: 'Sarah Johnson',
      country: 'USA',
      rating: 5,
      comment: 'Absolutely incredible journey! The team organized everything perfectly and showed us hidden gems we never would have found ourselves.',
      gradient: 'from-pink-500 to-rose-600'
    },
    {
      id: '2',
      name: 'Michael Chen',
      country: 'Australia',
      rating: 5,
      comment: 'The wildlife safari was beyond amazing! Saw leopards, elephants, and so many birds. Professional guides made it educational too.',
      gradient: 'from-blue-500 to-purple-600'
    },
    {
      id: '3',
      name: 'Emma Thompson',
      country: 'UK',
      rating: 5,
      comment: 'Cultural tours were fascinating! Learned so much about Sri Lankan history and traditions. Highly recommend to anyone interested in culture.',
      gradient: 'from-green-500 to-teal-600'
    }
  ];

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16 fade-in-up">
          <h2 className="text-4xl font-bold text-gray-800 mb-4">What Our Travelers Say</h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Real experiences from real travelers who discovered Sri Lanka with us
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <div
              key={testimonial.id}
              className={`bg-gradient-to-br ${testimonial.gradient} rounded-2xl p-8 text-white transform transition-all duration-300 hover:scale-105 hover:shadow-xl fade-in-up`}
              style={{ animationDelay: `${index * 200}ms` }}
            >
              {/* Rating Stars */}
              <div className="flex items-center mb-4">
                {Array.from({ length: testimonial.rating }).map((_, i) => (
                  <Star key={i} className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                ))}
              </div>

              {/* Testimonial Comment */}
              <p className="mb-6 italic text-lg leading-relaxed opacity-95">
                "{testimonial.comment}"
              </p>

              {/* Customer Info */}
              <div className="flex items-center">
                <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center mr-4">
                  <User className="h-6 w-6 text-white" />
                </div>
                <div>
                  <div className="font-semibold text-lg">{testimonial.name}</div>
                  <div className="text-sm opacity-80">{testimonial.country}</div>
                </div>
              </div>

              {/* Decorative element */}
              <div className="absolute top-4 right-4 w-8 h-8 bg-white/10 rounded-full"></div>
            </div>
          ))}
        </div>

        {/* Statistics */}
        <div className="mt-16 text-center fade-in-up">
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="text-4xl font-bold text-blue-600 mb-2">4.9/5</div>
                <div className="text-gray-600 font-medium">Average Rating</div>
                <div className="flex justify-center mt-2">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-green-600 mb-2">2,500+</div>
                <div className="text-gray-600 font-medium">Happy Customers</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-purple-600 mb-2">98%</div>
                <div className="text-gray-600 font-medium">Satisfaction Rate</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;