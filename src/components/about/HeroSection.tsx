
import React from 'react';

const HeroSection = () => {
  return (
    <section id="home" className="h-screen relative overflow-hidden">
      <div className="hero-bg absolute top-0 left-0 w-full h-full"></div>
      
      {/* Content area ready for your custom map implementation */}
      <div className="absolute inset-0 z-10 flex items-center justify-center">
        <div className="text-center text-white">
          <h1 className="text-6xl font-bold mb-4">Discover Sri Lanka</h1>
          <p className="text-xl">Ready for your custom map implementation</p>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
