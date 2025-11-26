
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, MapPin, Compass } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { searchContent } from '@/lib/search';
import { useToast } from '@/hooks/use-toast';

const HeroSearchBar = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const { toast } = useToast();

  const popularDestinations = [
    'Sigiriya Rock Fortress',
    'Kandy Temple',
    'Ella Nine Arch Bridge',
    'Galle Fort',
    'Yala National Park',
    'Nuwara Eliya',
    'Anuradhapura',
    'Mirissa Beach'
  ];

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) {
      toast({
        title: "Search Error",
        description: "Please enter a search term",
        variant: "destructive"
      });
      return;
    }

    // Navigate to search results page with query
    navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
  };

  const handleQuickSearch = async (destination: string) => {
    // Navigate to search results page with the destination query
    navigate(`/search?q=${encodeURIComponent(destination)}`);
  };

  return (
    <div className="w-full max-w-4xl mx-auto mb-8">
      <Card className="bg-white/95 backdrop-blur-sm border-2 border-white/20 shadow-2xl">
        <div className="p-6">
          <div className="text-center mb-6">
            <h2 className="text-2xl font-chakra font-bold text-granite-gray mb-2">
              Discover Sri Lanka's Hidden Gems
            </h2>
            <p className="text-granite-gray/70 font-inter">
              Search destinations, attractions, and experiences across the pearl of the Indian Ocean
            </p>
          </div>

          <form onSubmit={handleSearch} className="relative">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-granite-gray/50" />
              <Input
                type="text"
                placeholder="Search destinations, temples, beaches, wildlife parks..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={() => setIsSearchFocused(true)}
                onBlur={() => setTimeout(() => setIsSearchFocused(false), 200)}
                className="pl-12 pr-32 h-14 text-lg font-inter border-2 border-jungle-green/20 focus:border-wild-orange focus:ring-2 focus:ring-wild-orange/20 rounded-xl"
                disabled={isSearching}
              />
              <Button
                type="submit"
                size="lg"
                disabled={isSearching}
                className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-wild-orange hover:bg-wild-orange/90 text-white font-dm-sans font-semibold px-6 rounded-lg"
              >
                <Compass className="h-5 w-5 mr-2" />
                {isSearching ? 'Searching...' : 'Explore'}
              </Button>
            </div>

            {/* Quick Search Suggestions */}
            {isSearchFocused && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl shadow-xl border border-gray-200 z-50">
                <div className="p-4">
                  <h4 className="font-dm-sans font-semibold text-granite-gray mb-3 flex items-center">
                    <MapPin className="h-4 w-4 mr-2 text-wild-orange" />
                    Popular Destinations
                  </h4>
                  <div className="grid grid-cols-2 gap-2">
                    {popularDestinations.map((destination) => (
                      <button
                        key={destination}
                        type="button"
                        onClick={() => handleQuickSearch(destination)}
                        disabled={isSearching}
                        className="text-left p-2 rounded-lg hover:bg-jungle-green/5 hover:text-jungle-green transition-colors font-inter text-sm text-granite-gray/80 disabled:opacity-50"
                      >
                        {destination}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </form>

          {/* Quick Filter Buttons */}
          <div className="flex flex-wrap gap-3 mt-6 justify-center">
            {[
              { label: 'Beaches', emoji: '🏖️' },
              { label: 'Temples', emoji: '🏛️' },
              { label: 'Wildlife', emoji: '🐘' },
              { label: 'Hill Country', emoji: '⛰️' },
              { label: 'Cultural Sites', emoji: '🏺' },
              { label: 'Adventure', emoji: '🎋' }
            ].map((filter) => (
              <Button
                key={filter.label}
                variant="outline"
                size="sm"
                onClick={() => handleQuickSearch(filter.label)}
                disabled={isSearching}
                className="border-jungle-green/30 text-granite-gray hover:bg-jungle-green hover:text-white transition-all duration-300 font-dm-sans disabled:opacity-50"
              >
                <span className="mr-2">{filter.emoji}</span>
                {filter.label}
              </Button>
            ))}
          </div>
        </div>
      </Card>
    </div>
  );
};

export default HeroSearchBar;
