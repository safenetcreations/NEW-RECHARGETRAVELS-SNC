
import React from 'react';
import { Star } from 'lucide-react';
import { TouristLocation } from './types';
import { getLocationIcon } from './utils/locationUtils';

interface LocationGridProps {
  locations: TouristLocation[];
  onLocationSelect: (location: TouristLocation) => void;
}

const LocationGrid: React.FC<LocationGridProps> = ({ locations, onLocationSelect }) => {
  return (
    <div className="h-full overflow-y-auto p-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {locations.map(location => {
          const IconComponent = getLocationIcon(location.type);
          return (
            <div 
              key={location.id}
              className="bg-gray-800 rounded-lg overflow-hidden hover:bg-gray-700 transition-colors cursor-pointer"
              onClick={() => onLocationSelect(location)}
            >
              <div className="h-48 bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center">
                <IconComponent size={48} className="text-white" />
              </div>
              <div className="p-4">
                <h3 className="font-semibold text-lg mb-2">{location.name}</h3>
                <p className="text-gray-300 text-sm mb-3">{location.description}</p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1">
                    <Star className="text-yellow-400" size={16} />
                    <span className="text-sm">{location.rating}</span>
                    <span className="text-gray-400 text-sm">({location.reviews})</span>
                  </div>
                  <span className="text-blue-400 text-sm font-medium">{location.priceRange}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default LocationGrid;
