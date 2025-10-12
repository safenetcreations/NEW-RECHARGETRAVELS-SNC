
import React from 'react';

const WildlifeSection = () => {
  const wildlifeTypes = [
    {
      title: 'Marine Life',
      description: 'Blue whales, sperm whales, dolphins, and sea turtles grace our coastal waters'
    },
    {
      title: 'Big Cats',
      description: 'Sri Lankan leopards prowl through our national parks'
    },
    {
      title: 'Gentle Giants',
      description: 'Wild elephants roam freely in protected reserves'
    }
  ];

  return (
    <section id="wildlife" className="py-20 px-12" style={{ background: 'linear-gradient(to bottom, white, var(--sandy-beige))' }}>
      <div className="max-w-7xl mx-auto">
        <h2 className="text-5xl font-bold text-center mb-8 relative" style={{ color: 'var(--primary-green)' }}>
          Wildlife Wonders
          <div className="w-24 h-1 bg-yellow-400 mx-auto mt-5 rounded"></div>
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
          {wildlifeTypes.map((wildlife, index) => (
            <div key={index} className="wildlife-item h-75 rounded-3xl overflow-hidden relative fade-in">
              <div className="wildlife-overlay absolute bottom-0 left-0 right-0 p-8 text-white">
                <h3 className="text-2xl font-semibold mb-3">{wildlife.title}</h3>
                <p>{wildlife.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default WildlifeSection;
