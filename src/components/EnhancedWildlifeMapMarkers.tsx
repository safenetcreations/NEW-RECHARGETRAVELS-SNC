import React from 'react';
import { Marker, InfoWindow } from '@react-google-maps/api';
import { getWildlifeMarkerIcon } from '../lib/markerIcons';
import { Camera, MapPin, Clock, Info } from 'lucide-react';
import WildlifePhotoGallery from './WildlifePhotoGallery';
import type { EnhancedWildlifeLocation } from '../data/enhancedWildlifeData';

interface EnhancedWildlifeMapMarkersProps {
  locations: EnhancedWildlifeLocation[];
  selectedLocation: EnhancedWildlifeLocation | null;
  onMarkerClick: (location: EnhancedWildlifeLocation) => void;
  onInfoWindowClose: () => void;
  onZoomToLocation: (location: EnhancedWildlifeLocation) => void;
}

const EnhancedWildlifeMapMarkers = ({ 
  locations, 
  selectedLocation, 
  onMarkerClick, 
  onInfoWindowClose,
  onZoomToLocation
}: EnhancedWildlifeMapMarkersProps) => {
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
      mixed: '✈️',
      bear: '🐻',
      dugong: '🦭',
      beach: '🏖️',
      temple: '🛕',
      waterfall: '💧',
      adventure: '🏔️'
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
          animation={selectedLocation?.id === location.id ? google.maps.Animation.BOUNCE : undefined}
        />
      ))}

      {selectedLocation && (
        <InfoWindow
          position={{ lat: selectedLocation.lat, lng: selectedLocation.lng }}
          onCloseClick={onInfoWindowClose}
        >
          <div className="p-4 max-w-sm max-h-96 overflow-y-auto">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-chakra font-bold text-granite-gray text-lg flex items-center">
                <span className="mr-2 text-xl">
                  {getWildlifeEmoji(selectedLocation.wildlifeType)}
                </span>
                {selectedLocation.name}
              </h3>
              <button
                onClick={() => onZoomToLocation(selectedLocation)}
                className="text-wild-orange hover:text-wild-orange/80 transition-colors"
                title="Zoom to location"
              >
                <MapPin className="h-4 w-4" />
              </button>
            </div>

            <p className="text-sm text-granite-gray/80 mb-3">{selectedLocation.description}</p>

            {/* Photo Gallery */}
            <WildlifePhotoGallery 
              photos={selectedLocation.photos} 
              locationName={selectedLocation.name}
            />

            <div className="space-y-2 mt-3">
              <p className="text-xs text-wild-orange font-dm-sans font-medium bg-wild-orange/10 p-2 rounded">
                {selectedLocation.wildlifeInfo}
              </p>
              
              {selectedLocation.bestViewingTime && (
                <div className="text-xs text-blue-600 font-dm-sans font-medium bg-blue-50 p-2 rounded flex items-center">
                  <Clock className="h-3 w-3 mr-1" />
                  <strong>Best Time:</strong> {selectedLocation.bestViewingTime}
                </div>
              )}

              {selectedLocation.peakSeason && (
                <div className="text-xs text-jungle-green font-dm-sans font-medium bg-jungle-green/10 p-2 rounded">
                  <strong>Peak Season:</strong> {selectedLocation.peakSeason}
                </div>
              )}
              
              {selectedLocation.species && selectedLocation.species.length > 0 && (
                <div className="text-xs text-granite-gray bg-gray-100 p-2 rounded">
                  <strong>Species:</strong> {selectedLocation.species.join(', ')}
                </div>
              )}
              
              {selectedLocation.conservationStatus && (
                <div className="text-xs text-red-600 bg-red-50 p-2 rounded">
                  <strong>Status:</strong> {selectedLocation.conservationStatus}
                </div>
              )}
              
              {selectedLocation.population && (
                <div className="text-xs text-blue-600 bg-blue-50 p-2 rounded">
                  <strong>Population:</strong> {selectedLocation.population}
                </div>
              )}

              {selectedLocation.accessInfo && (
                <div className="text-xs text-green-600 bg-green-50 p-2 rounded flex items-start">
                  <Info className="h-3 w-3 mr-1 mt-0.5 flex-shrink-0" />
                  <div>
                    <strong>Access:</strong> {selectedLocation.accessInfo}
                  </div>
                </div>
              )}
            </div>
          </div>
        </InfoWindow>
      )}
    </>
  );
};

export default EnhancedWildlifeMapMarkers;
