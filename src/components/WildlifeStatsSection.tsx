
const WildlifeStatsSection = () => {
  return (
    <section className="mt-20 py-16 bg-gradient-to-r from-jungle-green/10 to-peacock-teal/10 rounded-3xl">
      <div className="text-center mb-12">
        <h2 className="text-4xl font-chakra font-bold text-granite-gray mb-4">
          Sri Lanka's <span className="text-wild-orange">Wildlife Kingdom</span>
        </h2>
        <p className="text-granite-gray/70 font-inter text-lg max-w-2xl mx-auto">
          Discover the incredible biodiversity that makes Sri Lanka a wildlife paradise
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8 px-8">
        <div className="text-center wildlife-bounce">
          <div className="text-4xl font-chakra font-bold text-wild-orange mb-2">40+</div>
          <div className="text-granite-gray font-dm-sans font-medium">Leopards in Yala</div>
        </div>
        <div className="text-center wildlife-pulse">
          <div className="text-4xl font-chakra font-bold text-jungle-green mb-2">6,000+</div>
          <div className="text-granite-gray font-dm-sans font-medium">Wild Elephants</div>
        </div>
        <div className="text-center wildlife-float">
          <div className="text-4xl font-chakra font-bold text-ocean-deep mb-2">26</div>
          <div className="text-granite-gray font-dm-sans font-medium">Whale Species</div>
        </div>
        <div className="text-center wildlife-bounce">
          <div className="text-4xl font-chakra font-bold text-peacock-teal mb-2">450+</div>
          <div className="text-granite-gray font-dm-sans font-medium">Bird Species</div>
        </div>
      </div>
    </section>
  );
};

export default WildlifeStatsSection;
