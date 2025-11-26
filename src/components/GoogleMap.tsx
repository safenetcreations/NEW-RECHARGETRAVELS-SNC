
import React from 'react';
import { GoogleMap, DirectionsRenderer, useJsApiLoader } from '@react-google-maps/api';
import { wildlifeMapStyles } from '../lib/mapStyles';
import EnhancedWildlifeMapMarkers from './EnhancedWildlifeMapMarkers';
import { enhancedWildlifeLocations, type EnhancedWildlifeLocation } from '../data/enhancedWildlifeData';
import { getEffectiveApiKey, isDemoMode, googleMapsLibraries } from '../lib/googleMapsConfig';
import { ApiKeyMissingError } from './map/ApiKeyMissingError';
import { DemoMapComponent } from './map/DemoMapComponent';

interface GoogleMapComponentProps {
  locations?: EnhancedWildlifeLocation[];
  center?: { lat: number; lng: number };
  zoom?: number;
  height?: string;
  selectedLocation: EnhancedWildlifeLocation | null;
  onSelectLocation: (location: EnhancedWildlifeLocation | null) => void;
  directions?: google.maps.DirectionsResult | null;
  onZoomToLocation?: (location: EnhancedWildlifeLocation) => void;
}

const GoogleMapComponent = ({ 
  locations = [], 
  center = { lat: 7.8731, lng: 80.7718 },
  zoom = 8,
  height = "400px",
  selectedLocation,
  onSelectLocation,
  directions,
  onZoomToLocation
}: GoogleMapComponentProps) => {
  // Use provided locations or fall back to enhanced wildlife locations
  const displayLocations = locations.length > 0 ? locations : enhancedWildlifeLocations;
  
  const apiKey = getEffectiveApiKey();
  
  const { isLoaded, loadError } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: apiKey || '',
    libraries: googleMapsLibraries
  });

  const handleZoomToLocation = (location: EnhancedWildlifeLocation) => {
    if (onZoomToLocation) {
      onZoomToLocation(location);
    }
  };

  // Show demo map when in demo mode or no API key
  if (isDemoMode() || !apiKey) {
    return (
      <DemoMapComponent
        locations={displayLocations}
        center={center}
        zoom={zoom}
        height={height}
        selectedLocation={selectedLocation}
        onSelectLocation={onSelectLocation}
        directions={directions}
        onZoomToLocation={onZoomToLocation}
      />
    );
  }

  // Show error when API fails to load
  if (loadError) {
    console.error('Google Maps load error:', loadError);
    return <ApiKeyMissingError height={height} />;
  }

  // Show loading state
  if (!isLoaded) {
    return (
      <div className="w-full flex items-center justify-center bg-gray-100 rounded-lg" style={{ height }}>
        <div className="text-center p-8">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading interactive map...</p>
        </div>
      </div>
    );
  }
  
  // Render actual Google Map
  return (
    <div style={{ width: '100%', height }}>
      <GoogleMap
        mapContainerStyle={{
          width: '100%',
          height: '100%'
        }}
        center={center}
        zoom={zoom}
        options={{ 
          styles: wildlifeMapStyles, 
          zoomControl: true, 
          streetViewControl: false, 
          mapTypeControl: false, 
          fullscreenControl: false 
        }}
      >
        <EnhancedWildlifeMapMarkers
          locations={displayLocations}
          selectedLocation={selectedLocation}
          onMarkerClick={onSelectLocation}
          onInfoWindowClose={() => onSelectLocation(null)}
          onZoomToLocation={handleZoomToLocation}
        />
        {directions && (
          <DirectionsRenderer 
            directions={directions} 
            options={{
              suppressMarkers: true,
              polylineOptions: {
                strokeColor: '#FF6B1A',
                strokeOpacity: 0.8,
                strokeWeight: 4,
              }
            }} 
          />
        )}
      </GoogleMap>
    </div>
  );
};

export default GoogleMapComponent;
