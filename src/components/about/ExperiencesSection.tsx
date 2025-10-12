
import React from 'react';

const ExperiencesSection = () => {
  const experiences = [
    {
      icon: '🐋',
      title: 'Whale Watching',
      description: 'Witness the majesty of blue whales, sperm whales, and playful dolphins in the waters off Mirissa and Trincomalee. Sri Lanka is one of the best places in the world to observe these magnificent creatures in their natural habitat.'
    },
    {
      icon: '🐘',
      title: 'Elephant Encounters',
      description: 'Visit the Pinnawala Elephant Orphanage or spot wild elephants in their natural habitat at Udawalawe or Minneriya National Parks. Experience the gentle giants of Sri Lanka up close while supporting conservation efforts.'
    },
    {
      icon: '🐆',
      title: 'Leopard Safari',
      description: 'Yala National Park offers one of the highest leopard densities in the world. Embark on an exciting safari to spot these elusive big cats along with sloth bears, crocodiles, and exotic birds.'
    },
    {
      icon: '🏛️',
      title: 'Cultural Heritage',
      description: 'Explore ancient cities, sacred temples, and colonial architecture. From the Temple of the Tooth in Kandy to the rock fortress of Sigiriya, immerse yourself in thousands of years of history.'
    },
    {
      icon: '🌊',
      title: 'Beach Paradise',
      description: 'With over 1,300 km of coastline, enjoy pristine beaches, world-class surfing, snorkeling, and diving. From the palm-fringed shores of Bentota to the surf breaks of Arugam Bay.'
    },
    {
      icon: '🍃',
      title: 'Tea Country',
      description: 'Journey through the misty highlands to discover emerald tea plantations, colonial bungalows, and breathtaking mountain scenery. Learn about Ceylon tea production and enjoy fresh brews with stunning views.'
    }
  ];

  return (
    <section id="experiences" className="py-20 px-12 bg-white">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-5xl font-bold text-center mb-8 relative" style={{ color: 'var(--primary-green)' }}>
          Unforgettable Experiences
          <div className="w-24 h-1 bg-yellow-400 mx-auto mt-5 rounded"></div>
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 mt-12">
          {experiences.map((experience, index) => (
            <div key={index} className="experience-card p-8 rounded-3xl shadow-lg fade-in">
              <div className="w-20 h-20 rounded-full flex items-center justify-center text-4xl text-white mb-6" style={{ background: 'var(--primary-green)' }}>
                {experience.icon}
              </div>
              <h3 className="text-2xl font-semibold mb-4" style={{ color: 'var(--primary-green)' }}>{experience.title}</h3>
              <p className="text-gray-700">{experience.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ExperiencesSection;
