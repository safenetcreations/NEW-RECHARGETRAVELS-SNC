
import React from 'react';
import { Button } from '@/components/ui/button';

const POI_CATEGORIES = {
  'Heritage': { icon: '🏛️' },
  'Temples': { icon: '🛕' },
  'Wildlife': { icon: '🐘' },
  'Beaches': { icon: '🏖️' },
  'Waterfalls': { icon: '🌊' },
};

interface MapFiltersProps {
  activeFilters: Set<string>;
  onToggleFilter: (category: string) => void;
  onGenerateItinerary: () => void;
}

const MapFilters: React.FC<MapFiltersProps> = ({
  activeFilters,
  onToggleFilter,
  onGenerateItinerary
}) => {
  return (
    <div className="relative pointer-events-auto bg-white/80 backdrop-blur-sm p-3 rounded-xl shadow-lg max-w-2xl mx-auto">
      <div className="flex flex-wrap items-center justify-center gap-2">
        <div className="flex flex-wrap items-center justify-center gap-2">
          {Object.entries(POI_CATEGORIES).map(([category, data]) => (
            <Button
              key={category}
              onClick={() => onToggleFilter(category)}
              className={`px-3 py-1.5 text-sm font-medium rounded-full shadow-sm transition-all ${
                activeFilters.has(category)
                  ? 'bg-blue-600 text-white hover:bg-blue-700'
                  : 'bg-white text-gray-700 hover:bg-gray-100'
              }`}
            >
              {data.icon} {category}
            </Button>
          ))}
        </div>
        <Button
          onClick={onGenerateItinerary}
          className="px-4 py-2 text-sm font-semibold text-white bg-blue-600 rounded-full shadow-md hover:bg-blue-700 transition-all"
        >
          ✨ Plan My Day
        </Button>
      </div>
    </div>
  );
};

export default MapFilters;
