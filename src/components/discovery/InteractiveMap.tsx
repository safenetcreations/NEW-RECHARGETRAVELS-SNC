
import React from 'react';
import { TouristLocation } from './types';
import { GoogleMapsLoader } from '../map/GoogleMapsLoader';
import { useGoogleMapsApi } from '../../hooks/useGoogleMapsApi';

interface InteractiveMapProps {
  locations: TouristLocation[];
  selectedLocation: TouristLocation | null;
  onLocationSelect: (location: TouristLocation) => void;
}

const InteractiveMap: React.FC<InteractiveMapProps> = ({ 
  locations, 
  selectedLocation, 
  onLocationSelect 
}) => {
  const { apiKey, isLoading, error } = useGoogleMapsApi();

  // Show loading state while fetching API key
  if (isLoading) {
    return (
      <div className="h-full flex items-center justify-center bg-gradient-to-br from-blue-50 to-teal-50">
        <div className="text-center p-8">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto mb-4"></div>
          <p className="text-gray-700 font-medium">Loading Sri Lanka Discovery Map...</p>
          <p className="text-sm text-gray-500 mt-2">Preparing your adventure...</p>
        </div>
      </div>
    );
  }

  // Show error state if API key loading failed
  if (error || !apiKey) {
    return (
      <div className="h-full flex items-center justify-center bg-gradient-to-br from-red-50 to-pink-50">
        <div className="text-center p-8">
          <div className="text-red-600 mb-4 text-xl">🗺️ Map Loading Error</div>
          <p className="text-gray-600 mb-4">{error || 'Unable to load map - API key not available'}</p>
          <div className="text-xs text-gray-600 bg-white p-4 rounded-lg shadow">
            <p className="font-semibold mb-2">Please check:</p>
            <ul className="text-left space-y-1">
              <li>• Google Maps API key in Supabase</li>
              <li>• Edge function deployment</li>
              <li>• API key permissions and billing</li>
            </ul>
          </div>
        </div>
      </div>
    );
  }

  // Show actual map content with GoogleMapsLoader
  return (
    <div className="h-full relative overflow-hidden rounded-lg shadow-xl">
      <GoogleMapsLoader
        apiKey={apiKey}
        onLoad={() => console.log('Discovery map loaded successfully')}
        onError={(error) => console.error('Discovery map loading error:', error)}
      >
        <div className="h-full w-full relative">
          <div 
            id="discovery-map" 
            className="h-full w-full"
            style={{ minHeight: '400px' }}
          >
            <GoogleMapDisplay 
              locations={locations}
              selectedLocation={selectedLocation}
              onLocationSelect={onLocationSelect}
            />
          </div>
          
          {/* Map Legend */}
          <div className="absolute top-4 right-4 bg-white/95 backdrop-blur-sm rounded-lg shadow-lg p-3 max-w-xs">
            <h4 className="font-bold text-gray-800 text-sm mb-2">🏝️ Sri Lanka Locations</h4>
            <div className="space-y-1 text-xs">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-purple-500"></div>
                <span>Historical Sites</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                <span>Temples</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-red-500"></div>
                <span>Colonial Heritage</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-green-500"></div>
                <span>Wildlife</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-cyan-500"></div>
                <span>Beaches</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-lime-500"></div>
                <span>Adventure</span>
              </div>
            </div>
          </div>

          {/* Info panel removed - using main modal instead */}
        </div>
      </GoogleMapsLoader>
    </div>
  );
};

// Component to handle the actual Google Map rendering
const GoogleMapDisplay: React.FC<{
  locations: TouristLocation[];
  selectedLocation: TouristLocation | null;
  onLocationSelect: (location: TouristLocation) => void;
}> = ({ locations, selectedLocation, onLocationSelect }) => {
  React.useEffect(() => {
    if (!(window as any).google || !(window as any).google.maps) {
      console.error('Google Maps not loaded');
      return;
    }

    const mapElement = document.getElementById('discovery-map');
    
    if (!mapElement) {
      console.error('Map element not found');
      return;
    }

    console.log('Initializing discovery map with', locations.length, 'locations');

    // Initialize the map with beautiful custom styling
    const map = new (window as any).google.maps.Map(mapElement, {
      center: { lat: 7.8731, lng: 80.7718 }, // Sri Lanka center
      zoom: 8,
      styles: [
        // Water - beautiful turquoise
        {
          featureType: "water",
          elementType: "geometry",
          stylers: [{ color: "#16a085" }, { saturation: 30 }, { lightness: 30 }]
        },
        {
          featureType: "water",
          elementType: "labels.text.fill",
          stylers: [{ color: "#ffffff" }]
        },
        // Landscape - soft beige/cream
        {
          featureType: "landscape",
          elementType: "geometry",
          stylers: [{ color: "#f4f1e8" }, { saturation: -20 }]
        },
        {
          featureType: "landscape.natural",
          elementType: "geometry",
          stylers: [{ color: "#e8f5e8" }, { saturation: -30 }]
        },
        // Roads - clear and visible
        {
          featureType: "road",
          elementType: "geometry",
          stylers: [{ color: "#ffffff" }, { weight: 1.5 }]
        },
        {
          featureType: "road.highway",
          elementType: "geometry",
          stylers: [{ color: "#f39c12" }, { weight: 3 }]
        },
        {
          featureType: "road",
          elementType: "labels.text.fill",
          stylers: [{ color: "#2c3e50" }]
        },
        {
          featureType: "road",
          elementType: "labels.text.stroke",
          stylers: [{ color: "#ffffff" }, { weight: 3 }]
        },
        // Administrative areas - clear labels
        {
          featureType: "administrative",
          elementType: "labels.text.fill",
          stylers: [{ color: "#2c3e50" }]
        },
        {
          featureType: "administrative",
          elementType: "labels.text.stroke",
          stylers: [{ color: "#ffffff" }, { weight: 2 }]
        },
        // Points of interest
        {
          featureType: "poi",
          elementType: "geometry",
          stylers: [{ color: "#ecf0f1" }]
        },
        {
          featureType: "poi.park",
          elementType: "geometry",
          stylers: [{ color: "#a8e6cf" }]
        },
        // Transit - hide to reduce clutter
        {
          featureType: "transit",
          stylers: [{ visibility: "off" }]
        }
      ],
      mapTypeControl: false,
      streetViewControl: false,
      fullscreenControl: true,
      zoomControl: true,
      gestureHandling: 'greedy'
    });

    // Removed info panel functions - using main modal instead

    // Add markers for each location with hover functionality
    const markers = locations.map(location => {
      const markerColor = getMarkerColor(location.type);
      
      // Create custom marker with better visibility
      const marker = new (window as any).google.maps.Marker({
        position: { lat: location.lat, lng: location.lng },
        map: map,
        title: location.name,
        icon: {
          path: (window as any).google.maps.SymbolPath.CIRCLE,
          scale: 14,
          fillColor: markerColor,
          fillOpacity: 0.9,
          strokeColor: '#ffffff',
          strokeWeight: 3,
        },
        animation: (window as any).google.maps.Animation.DROP
      });

      // Add hover listeners for visual feedback only
      marker.addListener('mouseover', () => {
        console.log('Hovering over:', location.name);
        
        // Highlight marker on hover
        marker.setIcon({
          path: (window as any).google.maps.SymbolPath.CIRCLE,
          scale: 18,
          fillColor: markerColor,
          fillOpacity: 1,
          strokeColor: '#ffffff',
          strokeWeight: 4,
        });
      });

      marker.addListener('mouseout', () => {
        // Reset marker size
        marker.setIcon({
          path: (window as any).google.maps.SymbolPath.CIRCLE,
          scale: 14,
          fillColor: markerColor,
          fillOpacity: 0.9,
          strokeColor: '#ffffff',
          strokeWeight: 3,
        });
      });

      // Click to select and center
      marker.addListener('click', () => {
        console.log('Location selected:', location.name);
        map.setCenter({ lat: location.lat, lng: location.lng });
        map.setZoom(12);
        onLocationSelect(location);
      });

      return marker;
    });

    // Map click handler - no longer needed since we removed info panel

    // Highlight selected location
    if (selectedLocation) {
      const selectedMarker = markers.find((_, index) => 
        String(locations[index].id) === String(selectedLocation.id)
      );
      if (selectedMarker) {
        selectedMarker.setIcon({
          path: (window as any).google.maps.SymbolPath.CIRCLE,
          scale: 18,
          fillColor: '#e74c3c',
          fillOpacity: 1,
          strokeColor: '#ffffff',
          strokeWeight: 4,
        });
        selectedMarker.setAnimation((window as any).google.maps.Animation.BOUNCE);
        setTimeout(() => selectedMarker.setAnimation(null), 2000);
        
        // Selected location will now show in main modal only
      }
    }

    return () => {
      // Cleanup markers
      markers.forEach(marker => marker.setMap(null));
      delete (window as any).selectLocationFromMap;
    };
  }, [locations, selectedLocation, onLocationSelect]);

  return null;
};

// Helper function to get marker color based on location type
const getMarkerColor = (type: string): string => {
  const colors: Record<string, string> = {
    'historical': '#9b59b6',
    'temple': '#f39c12', 
    'colonial': '#e74c3c',
    'wildlife': '#27ae60',
    'beach': '#3498db',
    'hiking': '#2ecc71',
    'adventure': '#2ecc71',
    'waterfall': '#3498db',
    'default': '#e67e22'
  };
  
  return colors[type] || colors.default;
};

export default InteractiveMap;
