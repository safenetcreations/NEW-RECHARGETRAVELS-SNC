
import React from 'react';
import HistoricalTimelineMap from './HistoricalTimelineMap';

const HistorySection = () => {
  return (
    <section id="history" className="py-20 px-12 max-w-7xl mx-auto" style={{ background: 'linear-gradient(135deg, #f5e6d3 0%, rgba(245, 230, 211, 0.7) 100%)' }}>
      <h2 className="text-5xl font-bold text-center mb-8 relative" style={{ color: 'var(--primary-green)' }}>
        A Rich Tapestry of History
        <div className="w-24 h-1 bg-yellow-400 mx-auto mt-5 rounded"></div>
      </h2>
      
      <div className="text-center mb-12">
        <p className="text-xl text-gray-700 max-w-4xl mx-auto leading-relaxed">
          Journey through time and witness the transformation of Ceylon to Sri Lanka. 
          Experience 500+ years of history through our interactive timeline map.
        </p>
      </div>

      <HistoricalTimelineMap />
      
      <div className="mt-16 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        <div className="fade-in text-lg leading-relaxed space-y-6" style={{ color: 'var(--text-dark)' }}>
          <p>Sri Lanka, formerly known as Ceylon, boasts a recorded history spanning over 3,000 years. This island nation has been a crossroads of cultures, religions, and trade routes, creating a unique blend of traditions that persist to this day.</p>
          <p>From the ancient kingdoms of Anuradhapura and Polonnaruwa to the colonial influences of the Portuguese, Dutch, and British, each era has left its indelible mark on the island's architecture, cuisine, and culture. The country gained independence in 1948 and has since emerged as a vibrant democracy with a rich cultural heritage.</p>
          <p>Today, visitors can explore UNESCO World Heritage sites, ancient Buddhist temples, colonial fortresses, and tea plantations that tell the story of this remarkable island nation.</p>
        </div>
        <div className="fade-in w-full h-96 rounded-3xl overflow-hidden shadow-2xl" style={{ background: 'linear-gradient(45deg, var(--primary-green), var(--ocean-blue))' }}></div>
      </div>
    </section>
  );
};

export default HistorySection;
