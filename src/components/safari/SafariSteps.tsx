
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';

const SafariSteps: React.FC = () => {
  const steps = [
    {
      icon: '🏕️',
      title: 'Choose Your Wilderness Base',
      description: 'Select from our curated collection of safari lodges—from luxury tented camps bordering national parks to secluded eco-lodges deep in the jungle.'
    },
    {
      icon: '🐆',
      title: 'Pick Your Wildlife Encounters',
      description: 'Fill your days with thrilling adventures. A private leopard safari in Yala at dawn, a boat safari to see swimming elephants in Gal Oya, or whale-watching in Mirissa.'
    },
    {
      icon: '🚙',
      title: 'Select Your Safari Ride',
      description: 'Travel between parks in comfort and style. Choose a private luxury SUV or a rugged, open-top 4x4 safari jeep for the ultimate game drive experience.'
    }
  ];

  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-6">
        <h2 className="font-montserrat text-4xl font-bold text-center mb-16 text-green-900">
          How It Works
        </h2>
        
        <div className="grid md:grid-cols-3 gap-8">
          {steps.map((step, index) => (
            <Card key={index} className="group hover:shadow-xl transition-all duration-300 hover:-translate-y-2 bg-amber-50 border-none">
              <CardContent className="p-8 text-center">
                <div className="w-20 h-20 mx-auto mb-6 bg-yellow-500 rounded-full flex items-center justify-center text-3xl group-hover:scale-110 transition-transform duration-300">
                  {step.icon}
                </div>
                <h3 className="font-lora text-xl font-semibold mb-4 text-green-900">
                  {step.title}
                </h3>
                <p className="text-gray-700 leading-relaxed">
                  {step.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default SafariSteps;
