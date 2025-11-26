
import React from 'react';
import { Button } from '@/components/ui/button';

const SafariHero: React.FC = () => {
  const scrollToBuilder = () => {
    const builderSection = document.getElementById('safari-builder');
    builderSection?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section className="relative h-screen flex items-center justify-center bg-gradient-to-r from-green-900/80 to-blue-900/80 text-white">
      <div 
        className="absolute inset-0 bg-cover bg-center z-0"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='1000' height='1000'%3E%3Crect width='1000' height='1000' fill='%231B3A2D'/%3E%3Ccircle cx='200' cy='200' r='50' fill='%23C59B45' opacity='0.3'/%3E%3Ccircle cx='800' cy='800' r='80' fill='%23C59B45' opacity='0.2'/%3E%3Ccircle cx='500' cy='500' r='100' fill='%23D9C9A3' opacity='0.2'/%3E%3C/svg%3E")`
        }}
      />
      
      <div className="relative z-10 text-center max-w-4xl px-6">
        <h1 className="font-montserrat text-4xl md:text-6xl font-extrabold mb-6 uppercase tracking-wider">
          <span className="bg-gradient-to-r from-yellow-400 to-amber-300 bg-clip-text text-transparent">
            Craft Your Ultimate Wildlife Safari
          </span>
          <br />
          <span className="text-white">in Sri Lanka</span>
        </h1>
        
        <p className="font-lora text-lg md:text-xl mb-8 leading-relaxed max-w-3xl mx-auto">
          An island of elusive leopards, majestic elephants, and vibrant birdlife awaits. 
          Design your dream safari, choosing every park, every encounter, and every wilderness lodge. 
          Your adventure, your Sri Lanka.
        </p>
        
        <Button 
          onClick={scrollToBuilder}
          className="bg-gradient-to-r from-green-800 to-blue-800 hover:from-green-700 hover:to-blue-700 text-white px-10 py-4 text-lg font-bold rounded-2xl transition-all duration-300 transform hover:scale-105 hover:shadow-xl hover:shadow-yellow-400/20"
        >
          Start Building Your Safari
        </Button>
      </div>
    </section>
  );
};

export default SafariHero;
