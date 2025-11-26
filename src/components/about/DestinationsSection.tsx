
import React from 'react';

const DestinationsSection = () => {
  const destinations = [
    {
      title: 'Kandy & Perahera Festival',
      description: 'The cultural capital of Sri Lanka, Kandy is home to the sacred Temple of the Tooth Relic. Experience the spectacular Esala Perahera festival featuring elaborately decorated elephants, traditional dancers, and fire performers in a grand procession that celebrates Buddhist traditions.',
      highlights: [
        'Temple of the Sacred Tooth Relic',
        'Royal Botanical Gardens',
        'Kandy Lake',
        'Traditional Kandyan Dance Shows'
      ]
    },
    {
      title: 'Jaffna & Nallur Temple',
      description: 'Discover the vibrant Tamil culture in Jaffna, home to the magnificent Nallur Kandaswamy Temple. This historic city offers a unique perspective on Sri Lankan heritage with its distinctive architecture, cuisine, and traditions.',
      highlights: [
        'Nallur Kandaswamy Temple Festival',
        'Jaffna Fort',
        'Casuarina Beach',
        'Traditional Tamil Cuisine'
      ]
    },
    {
      title: 'Sigiriya Rock Fortress',
      description: 'Climb the ancient rock fortress of Sigiriya, a UNESCO World Heritage site rising 200 meters above the jungle. Marvel at ancient frescoes, landscaped gardens, and panoramic views from this 5th-century citadel.',
      highlights: [
        'Lion\'s Gate Entrance',
        'Mirror Wall with Ancient Graffiti',
        'Sigiriya Frescoes',
        'Water Gardens'
      ]
    },
    {
      title: 'Galle Fort',
      description: 'Step back in time at this perfectly preserved Dutch colonial fort city. Wander cobblestone streets, explore boutique shops, and watch stunning sunsets from the ramparts of this coastal gem.',
      highlights: [
        'Dutch Reformed Church',
        'Galle Lighthouse',
        'Maritime Museum',
        'Fort Ramparts Walk'
      ]
    }
  ];

  return (
    <section id="destinations" className="py-20 px-12 text-white relative" style={{ background: 'var(--primary-green)' }}>
      <div className="max-w-7xl mx-auto">
        <h2 className="text-5xl font-bold text-center mb-8 relative text-white">
          Must-Visit Destinations
          <div className="w-24 h-1 bg-yellow-400 mx-auto mt-5 rounded"></div>
        </h2>
        <div className="flex gap-8 overflow-x-auto pb-5 mt-12" style={{ scrollSnapType: 'x mandatory' }}>
          {destinations.map((destination, index) => (
            <div key={index} className="destination-card min-w-96 h-125 p-8 rounded-3xl fade-in" style={{ scrollSnapAlign: 'start' }}>
              <h3 className="text-2xl font-semibold mb-4">{destination.title}</h3>
              <p className="mb-4">{destination.description}</p>
              <p className="font-bold mb-2">Highlights:</p>
              <ul className="list-disc list-inside space-y-1">
                {destination.highlights.map((highlight, idx) => (
                  <li key={idx}>{highlight}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default DestinationsSection;
