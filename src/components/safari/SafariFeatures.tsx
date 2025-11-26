
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';

const SafariFeatures: React.FC = () => {
  const features = [
    {
      icon: '🎯',
      title: 'Your Adventure, Your Itinerary',
      description: 'Forget standard packages. Design a safari that reflects your interests with our interactive builder.'
    },
    {
      icon: '🏆',
      title: 'Expert Guides & Premier Lodges',
      description: 'Personally vetted lodges and passionate naturalist guides who maximize your wildlife sightings.'
    },
    {
      icon: '🌿',
      title: 'Authentic Encounters',
      description: 'Experience the authentic heart of Sri Lanka\'s wilderness, often far from the tourist trail.'
    },
    {
      icon: '✨',
      title: 'Seamless Journey',
      description: 'From airport pickup to 24/7 support, every detail is meticulously handled for your peace of mind.'
    }
  ];

  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-6">
        <h2 className="font-montserrat text-4xl font-bold text-center mb-16 text-green-900">
          Why Choose Recharge Travel
        </h2>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <Card key={index} className="text-center group hover:shadow-lg transition-all duration-300">
              <CardContent className="p-6">
                <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-green-800 to-blue-800 rounded-full flex items-center justify-center text-4xl text-white group-hover:scale-110 transition-transform duration-300">
                  {feature.icon}
                </div>
                <h3 className="font-lora text-lg font-semibold mb-4 text-green-900">
                  {feature.title}
                </h3>
                <p className="text-gray-700 leading-relaxed">
                  {feature.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default SafariFeatures;
