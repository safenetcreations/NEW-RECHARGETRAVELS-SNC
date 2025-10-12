
const LocationInfoSection = () => {
  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-granite-gray mb-4">
          Explore Sri Lanka's Wonders
        </h2>
        <p className="text-granite-gray/70 text-lg">
          Discover amazing destinations, wildlife hotspots, and cultural treasures across the beautiful island of Sri Lanka.
        </p>
      </div>
      
      <div className="bg-gradient-to-r from-wild-orange to-jungle-green p-6 rounded-lg text-white">
        <h3 className="text-xl font-bold mb-2">Plan Your Adventure</h3>
        <p className="text-white/90">From pristine beaches to ancient temples, wildlife safaris to mountain hikes - Sri Lanka offers unforgettable experiences for every traveler.</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-white p-4 rounded-lg shadow border-l-4 border-wild-orange">
          <h4 className="font-bold text-granite-gray mb-2">🐆 Wildlife Tours</h4>
          <p className="text-sm text-granite-gray/70">Experience leopards, elephants, and exotic birds in their natural habitat.</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow border-l-4 border-jungle-green">
          <h4 className="font-bold text-granite-gray mb-2">🏖️ Beach Paradise</h4>
          <p className="text-sm text-granite-gray/70">Relax on golden beaches with crystal clear waters.</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow border-l-4 border-ocean-deep">
          <h4 className="font-bold text-granite-gray mb-2">🛕 Cultural Heritage</h4>
          <p className="text-sm text-granite-gray/70">Explore ancient temples and UNESCO World Heritage sites.</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow border-l-4 border-peacock-teal">
          <h4 className="font-bold text-granite-gray mb-2">🏔️ Adventure Awaits</h4>
          <p className="text-sm text-granite-gray/70">Hike mountains, visit waterfalls, and explore tea plantations.</p>
        </div>
      </div>
    </div>
  );
};

export default LocationInfoSection;
