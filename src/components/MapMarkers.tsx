
import React from 'react';
import { Marker, InfoWindow } from '@react-google-maps/api';
import { getMarkerIcon } from '../lib/mapUtils';
import type { Location } from '../data/mapData';

interface MapMarkersProps {
  locations: Location[];
  selectedLocation: Location | null;
  onMarkerClick: (location: Location) => void;
  onInfoWindowClose: () => void;
}

const MapMarkers = ({ locations, selectedLocation, onMarkerClick, onInfoWindowClose }: MapMarkersProps) => {
  return (
    <>
      {locations.map((location) => (
        <Marker
          key={location.id}
          position={{ lat: location.lat, lng: location.lng }}
          icon={getMarkerIcon(location.type)}
          onClick={() => onMarkerClick(location)}
        />
      ))}

      {selectedLocation && (
        <InfoWindow
          position={{ lat: selectedLocation.lat, lng: selectedLocation.lng }}
          onCloseClick={onInfoWindowClose}
        >
          <div className="p-2">
            <h3 className="font-semibold text-ceylon-blue">{selectedLocation.name}</h3>
            <p className="text-sm text-gray-600">{selectedLocation.description}</p>
          </div>
        </InfoWindow>
      )}
    </>
  );
};

export default MapMarkers;
