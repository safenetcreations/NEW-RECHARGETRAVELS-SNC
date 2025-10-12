
import React from 'react';
import { Star } from 'lucide-react';
import { TouristLocation } from './types';
import { getLocationIcon, getLocationColor } from './utils/locationUtils';

interface LocationCardProps {
  location: TouristLocation;
  isSelected: boolean;
  onClick: (location: TouristLocation) => void;
}

const LocationCard: React.FC<LocationCardProps> = ({ location, isSelected, onClick }) => {
  const IconComponent = getLocationIcon(location.type);
  const colorClass = getLocationColor(location.type);

  return (
    <div
      onClick={() => onClick(location)}
      className={`p-3 rounded-lg cursor-pointer transition-colors border ${
        isSelected
          ? 'bg-blue-600 border-blue-400'
          : 'bg-gray-700 border-gray-600 hover:bg-gray-600'
      }`}
    >
      <div className="flex items-start gap-3">
        <IconComponent className={`mt-1 ${colorClass}`} size={20} />
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-sm truncate">{location.name}</h3>
          <p className="text-xs text-gray-300 mt-1 line-clamp-2">{location.description}</p>
          <div className="flex items-center gap-2 mt-2">
            <div className="flex items-center gap-1">
              <Star className="text-yellow-400" size={12} />
              <span className="text-xs">{location.rating}</span>
            </div>
            <span className="text-xs text-gray-400">•</span>
            <span className="text-xs text-gray-400">{location.priceRange}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LocationCard;
