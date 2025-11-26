
import React from 'react';
import { enhancedWildlifeLocations, type EnhancedWildlifeLocation } from '../../data/enhancedWildlifeData';
import { getEmojiForType } from './utils/mapUtils';

interface DemoMapComponentProps {
  locations?: EnhancedWildlifeLocation[];
  center?: { lat: number; lng: number };
  zoom?: number;
  height?: string;
  selectedLocation: EnhancedWildlifeLocation | null;
  onSelectLocation: (location: EnhancedWildlifeLocation | null) => void;
  directions?: google.maps.DirectionsResult | null;
  onZoomToLocation?: (location: EnhancedWildlifeLocation) => void;
}

export const DemoMapComponent = ({ 
  locations = [], 
  center = { lat: 7.8731, lng: 80.7718 }, 
  zoom = 8,
  height = "400px",
  selectedLocation,
  onSelectLocation 
}: DemoMapComponentProps) => {
  // Always use the complete enhanced wildlife locations data
  const displayLocations = enhancedWildlifeLocations;
  
  return (
    <div className="w-full bg-gradient-to-br from-blue-50 to-green-50 rounded-lg relative overflow-hidden border-2 border-green-200" style={{ height }}>
      
      {/* Header */}
      <div className="absolute top-0 left-0 right-0 bg-gradient-to-r from-green-600 to-blue-600 text-white p-3 z-20">
        <h3 className="text-lg font-bold">🗺️ Interactive Sri Lanka Wildlife Map</h3>
        <p className="text-sm opacity-90">Click on any marker to explore destinations</p>
      </div>
      
      {/* Map area with markers */}
      <div className="pt-20 pb-4 px-4 h-full relative">
        <div className="flex flex-wrap justify-center items-center gap-6 h-full">
          {displayLocations.slice(0, 24).map((location, index) => (
            <div
              key={location.id}
              className={`relative cursor-pointer transform transition-all duration-300 hover:scale-125 ${
                selectedLocation?.id === location.id ? 'scale-150 z-30' : 'z-10'
              }`}
              onClick={() => onSelectLocation(location)}
              style={{
                animationDelay: `${index * 0.1}s`
              }}
            >
              <div className="w-12 h-12 rounded-full bg-white border-3 border-green-500 shadow-lg flex items-center justify-center hover:shadow-xl hover:border-orange-400 transition-all duration-200">
                <span className="text-xl">
                  {getEmojiForType(location.wildlifeType)}
                </span>
              </div>
              <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 bg-green-500 text-white text-xs px-2 py-1 rounded whitespace-nowrap opacity-0 hover:opacity-100 transition-opacity">
                {location.name}
              </div>
            </div>
          ))}
        </div>
      </div>
      
      {/* Info popup for selected location */}
      {selectedLocation && (
        <div className="absolute bottom-4 left-4 right-4 bg-white rounded-lg shadow-xl p-4 max-w-sm mx-auto z-30 border-2 border-green-200">
          <h4 className="font-bold text-gray-900 mb-2 flex items-center">
            <span className="mr-2 text-xl">{getEmojiForType(selectedLocation.wildlifeType)}</span>
            {selectedLocation.name}
          </h4>
          <p className="text-sm text-gray-600 mb-2">{selectedLocation.description}</p>
          <p className="text-xs text-green-600 font-medium bg-green-50 p-2 rounded">{selectedLocation.wildlifeInfo}</p>
          {selectedLocation.bestViewingTime && (
            <p className="text-xs text-gray-500 mt-2">
              <strong>Best time:</strong> {selectedLocation.bestViewingTime}
            </p>
          )}
          <button 
            onClick={() => onSelectLocation(null)}
            className="absolute top-2 right-2 text-gray-400 hover:text-gray-600 w-6 h-6 flex items-center justify-center"
          >
            ✕
          </button>
        </div>
      )}
      
      {/* Legend */}
      <div className="absolute bottom-4 right-4 bg-white/90 backdrop-blur-sm rounded-lg p-3 text-xs z-20">
        <h5 className="font-bold mb-2">Legend</h5>
        <div className="grid grid-cols-2 gap-1">
          <div>🐆 Wildlife</div>
          <div>🏖️ Beaches</div>
          <div>🛕 Temples</div>
          <div>💧 Waterfalls</div>
          <div>🏔️ Adventure</div>
          <div>🏛️ Cultural</div>
        </div>
      </div>
    </div>
  );
};
