import React, { useState } from 'react';
import { Search, Play, Star, MapPin, Clock, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface DiscoverHeroSectionProps {
  onSearch: (query: string) => void;
  onExploreDestinations: () => void;
}

const DiscoverHeroSection: React.FC<DiscoverHeroSectionProps> = ({
  onSearch,
  onExploreDestinations
}) => {
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = () => {
    if (searchQuery.trim()) {
      onSearch(searchQuery);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center text-white overflow-hidden bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-800">
      {/* Background overlay */}
      <div className="absolute inset-0 bg-black/20"></div>
      
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-white/10 to-transparent rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-gradient-to-tr from-white/10 to-transparent rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-gradient-to-r from-white/5 to-transparent rounded-full blur-2xl animate-pulse delay-500"></div>
      </div>

      <div className="relative z-10 text-center px-4 max-w-5xl mx-auto">
        {/* Main heading with animation */}
        <h1 className="text-5xl md:text-7xl font-bold mb-6 animate-fade-in">
          Discover Sri Lanka's{' '}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-orange-500">
            Hidden Gems
          </span>
        </h1>
        
        <p className="text-xl md:text-2xl mb-8 opacity-90 max-w-3xl mx-auto leading-relaxed">
          Search destinations, attractions, and experiences across the pearl of the Indian Ocean
        </p>
        
        {/* Enhanced Search Bar */}
        <div className="max-w-2xl mx-auto mb-12">
          <div className="relative bg-white/10 backdrop-blur-md rounded-full border border-white/20 p-2">
            <div className="flex items-center">
              <Search className="absolute left-6 h-5 w-5 text-white/70" />
              <Input
                type="text"
                placeholder="Search destinations, tours, or experiences..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyPress={handleKeyPress}
                className="flex-1 pl-14 pr-4 py-3 bg-transparent border-0 text-white placeholder-white/70 focus:outline-none focus:ring-0"
              />
              <Button
                onClick={handleSearch}
                className="bg-white text-blue-600 hover:bg-gray-100 rounded-full px-6 py-2 font-semibold transition-all duration-300 hover:scale-105"
              >
                Search
              </Button>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
          <div className="text-center">
            <div className="text-3xl font-bold mb-2 bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent">
              10,000+
            </div>
            <div className="text-sm opacity-80">Happy Travelers</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold mb-2 bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent">
              4.9/5
            </div>
            <div className="text-sm opacity-80 flex items-center justify-center">
              <Star className="h-4 w-4 fill-yellow-400 text-yellow-400 mr-1" />
              Rating
            </div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold mb-2 bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent">
              50+
            </div>
            <div className="text-sm opacity-80 flex items-center justify-center">
              <MapPin className="h-4 w-4 mr-1" />
              Destinations
            </div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold mb-2 bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent">
              15
            </div>
            <div className="text-sm opacity-80 flex items-center justify-center">
              <Clock className="h-4 w-4 mr-1" />
              Years Experience
            </div>
          </div>
        </div>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button
            onClick={onExploreDestinations}
            className="bg-white text-blue-600 hover:bg-gray-100 px-8 py-3 rounded-full font-semibold transition-all duration-300 hover:scale-105 shadow-lg"
          >
            <Users className="mr-2 h-5 w-5" />
            Explore Destinations
          </Button>
          <Button
            variant="outline"
            className="border-2 border-white text-white hover:bg-white hover:text-blue-600 px-8 py-3 rounded-full font-semibold transition-all duration-300 hover:scale-105 bg-white/10 backdrop-blur-sm"
          >
            <Play className="mr-2 h-5 w-5" />
            Watch Preview
          </Button>
        </div>
      </div>
    </section>
  );
};

export default DiscoverHeroSection;