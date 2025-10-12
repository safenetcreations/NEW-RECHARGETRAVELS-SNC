
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';

const SafariTestimonials: React.FC = () => {
  const testimonials = [
    {
      text: "Our safari was a dream come true. We started in Wilpattu and were rewarded with incredible sloth bear and leopard sightings. The entire journey was seamless. Our guide, Roshan, was phenomenal!",
      author: "Alex & Ben, London, UK"
    },
    {
      text: "The leopard safari in Yala was breathtaking! But the boat safari in Gal Oya, watching elephants swim, was truly once-in-a-lifetime. Building our package online was so easy!",
      author: "Maria & David, Dubai, UAE"
    },
    {
      text: "From whale watching in Mirissa to exploring Polonnaruwa, every day was a new discovery. The flexibility was special - we added a birdwatching tour on a whim!",
      author: "Kenji & Hana, Tokyo, Japan"
    }
  ];

  return (
    <section className="py-20 bg-amber-50">
      <div className="container mx-auto px-6">
        <h2 className="font-montserrat text-4xl font-bold text-center mb-16 text-green-900">
          Tales from the Wild
        </h2>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <Card key={index} className="hover:shadow-xl transition-shadow duration-300">
              <CardContent className="p-6">
                <p className="text-gray-700 italic mb-4 leading-relaxed">
                  "{testimonial.text}"
                </p>
                <p className="font-semibold text-green-900">
                  - {testimonial.author}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default SafariTestimonials;
