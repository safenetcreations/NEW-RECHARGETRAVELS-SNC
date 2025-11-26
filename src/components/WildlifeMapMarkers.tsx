
import React from 'react';
import { Marker, InfoWindow } from '@react-google-maps/api';
import { getWildlifeMarkerIcon } from '../lib/wildlifeMapUtils';
import type { WildlifeLocation } from '../data/wildlifeMapData';

interface WildlifeMapMarkersProps {
  locations: WildlifeLocation[];
  selectedLocation: WildlifeLocation | null;
  onMarkerClick: (location: WildlifeLocation) => void;
  onInfoWindowClose: () => void;
}

const WildlifeMapMarkers = ({ 
  locations, 
  selectedLocation, 
  onMarkerClick, 
  onInfoWindowClose 
}: WildlifeMapMarkersProps) => {
  const getWildlifeEmoji = (wildlifeType: string) => {
    const emojiMap: Record<string, string> = {
      leopard: '🐆',
      elephant: '🐘',
      whale: '🐋',
      dolphin: '🐬',
      turtle: '🐢',
      crocodile: '🐊',
      bird: '🦅',
      cultural: '🏛️',
      mixed: '✈️'
    };
    return emojiMap[wildlifeType] || '📍';
  };

  return (
    <>
      {locations.map((location) => (
        <Marker
          key={location.id}
          position={{ lat: location.lat, lng: location.lng }}
          icon={getWildlifeMarkerIcon(location.wildlifeType)}
          onClick={() => onMarkerClick(location)}
          title={location.name}
        />
      ))}

      {selectedLocation && (
        <InfoWindow
          position={{ lat: selectedLocation.lat, lng: selectedLocation.lng }}
          onCloseClick={onInfoWindowClose}
        >
          <div className="p-4 max-w-sm">
            <h3 className="font-chakra font-bold text-granite-gray text-lg mb-2 flex items-center">
              <span className="mr-2 text-xl">
                {getWildlifeEmoji(selectedLocation.wildlifeType)}
              </span>
              {selectedLocation.name}
            </h3>
            <p className="text-sm text-granite-gray/80 mb-2">{selectedLocation.description}</p>
            <p className="text-xs text-wild-orange font-dm-sans font-medium bg-wild-orange/10 p-2 rounded mb-2">
              {selectedLocation.wildlifeInfo}
            </p>
            
            {selectedLocation.peakSeason && (
              <div className="text-xs text-jungle-green font-dm-sans font-medium bg-jungle-green/10 p-2 rounded mb-2">
                <strong>Peak Season:</strong> {selectedLocation.peakSeason}
              </div>
            )}
            
            {selectedLocation.species && selectedLocation.species.length > 0 && (
              <div className="text-xs text-granite-gray bg-gray-100 p-2 rounded mb-2">
                <strong>Species:</strong> {selectedLocation.species.join(', ')}
              </div>
            )}
            
            {selectedLocation.conservationStatus && (
              <div className="text-xs text-red-600 bg-red-50 p-2 rounded mb-2">
                <strong>Status:</strong> {selectedLocation.conservationStatus}
              </div>
            )}
            
            {selectedLocation.population && (
              <div className="text-xs text-blue-600 bg-blue-50 p-2 rounded">
                <strong>Population:</strong> {selectedLocation.population}
              </div>
            )}
          </div>
        </InfoWindow>
      )}
    </>
  );
};

export default WildlifeMapMarkers;
