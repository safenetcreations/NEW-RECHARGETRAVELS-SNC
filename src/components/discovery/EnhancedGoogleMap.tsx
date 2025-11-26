import React, { useCallback, useState, useEffect } from 'react';
import { GoogleMap, LoadScript, Marker, InfoWindow } from '@react-google-maps/api';
import { MapPin, Navigation, Calendar, Phone, Star, Eye } from 'lucide-react';
import { TouristLocation } from './types';

interface EnhancedGoogleMapProps {
  locations: TouristLocation[];
  selectedLocation: TouristLocation | null;
  onLocationSelect: (location: TouristLocation) => void;
  onBookingClick: (location: TouristLocation) => void;
  center?: { lat: number; lng: number };
}

const EnhancedGoogleMap: React.FC<EnhancedGoogleMapProps> = ({
  locations,
  selectedLocation,
  onLocationSelect,
  onBookingClick,
  center = { lat: 7.8731, lng: 80.7718 } // Sri Lanka center
}) => {
  const [map, setMap] = useState<google.maps.Map | null>(null);
  const [infoWindow, setInfoWindow] = useState<TouristLocation | null>(null);
  const [mapLoaded, setMapLoaded] = useState(false);

  // Enhanced map styles
  const mapStyles = [
    {
      "featureType": "all",
      "elementType": "geometry.fill",
      "stylers": [{"weight": "2.00"}]
    },
    {
      "featureType": "all",
      "elementType": "geometry.stroke",
      "stylers": [{"color": "#9c9c9c"}]
    },
    {
      "featureType": "all",
      "elementType": "labels.text",
      "stylers": [{"visibility": "on"}]
    },
    {
      "featureType": "landscape",
      "elementType": "all",
      "stylers": [{"color": "#f2f2f2"}]
    },
    {
      "featureType": "landscape",
      "elementType": "geometry.fill",
      "stylers": [{"color": "#ffffff"}]
    },
    {
      "featureType": "landscape.man_made",
      "elementType": "geometry.fill",
      "stylers": [{"color": "#ffffff"}]
    },
    {
      "featureType": "poi",
      "elementType": "all",
      "stylers": [{"visibility": "off"}]
    },
    {
      "featureType": "road",
      "elementType": "all",
      "stylers": [{"saturation": -100}, {"lightness": 45}]
    },
    {
      "featureType": "road",
      "elementType": "geometry.fill",
      "stylers": [{"color": "#eeeeee"}]
    },
    {
      "featureType": "road",
      "elementType": "labels.text.fill",
      "stylers": [{"color": "#7b7b7b"}]
    },
    {
      "featureType": "road",
      "elementType": "labels.text.stroke",
      "stylers": [{"color": "#ffffff"}]
    },
    {
      "featureType": "road.highway",
      "elementType": "all",
      "stylers": [{"visibility": "simplified"}]
    },
    {
      "featureType": "road.arterial",
      "elementType": "labels.icon",
      "stylers": [{"visibility": "off"}]
    },
    {
      "featureType": "transit",
      "elementType": "all",
      "stylers": [{"visibility": "off"}]
    },
    {
      "featureType": "water",
      "elementType": "all",
      "stylers": [{"color": "#46bcec"}, {"visibility": "on"}]
    },
    {
      "featureType": "water",
      "elementType": "geometry.fill",
      "stylers": [{"color": "#c8d7d4"}]
    },
    {
      "featureType": "water",
      "elementType": "labels.text.fill",
      "stylers": [{"color": "#070707"}]
    },
    {
      "featureType": "water",
      "elementType": "labels.text.stroke",
      "stylers": [{"color": "#ffffff"}]
    }
  ];

  const mapOptions = {
    styles: mapStyles,
    disableDefaultUI: false,
    zoomControl: true,
    mapTypeControl: true,
    scaleControl: true,
    streetViewControl: true,
    rotateControl: true,
    fullscreenControl: true,
    gestureHandling: 'auto',
    mapTypeId: 'roadmap',
    minZoom: 6,
    maxZoom: 18
  };

  const onLoad = useCallback((map: google.maps.Map) => {
    setMap(map);
    setMapLoaded(true);
    
    // Fit bounds to show all locations
    if (locations.length > 0) {
      const bounds = new window.google.maps.LatLngBounds();
      locations.forEach(location => {
        const coords = getLocationCoordinates(location);
        bounds.extend(coords);
      });
      map.fitBounds(bounds);
      
      // Ensure minimum zoom level
      const listener = google.maps.event.addListener(map, 'idle', () => {
        if (map.getZoom() && map.getZoom()! > 10) map.setZoom(10);
        google.maps.event.removeListener(listener);
      });
    }
  }, [locations]);

  const onUnmount = useCallback(() => {
    setMap(null);
    setMapLoaded(false);
  }, []);

  // Custom marker icon based on location type
  const getMarkerIcon = (location: TouristLocation, isSelected: boolean) => {
    const colors = {
      'beach': '#00bcd4',
      'temple': '#ff9800',
      'wildlife': '#4caf50',
      'cultural': '#9c27b0',
      'adventure': '#f44336',
      'waterfall': '#2196f3',
      'default': '#3f51b5'
    };
    
    const color = colors[location.type as keyof typeof colors] || colors.default;
    const size = isSelected ? 40 : 30;
    
    return {
      url: `data:image/svg+xml,${encodeURIComponent(`
        <svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="12" cy="12" r="10" fill="${color}" stroke="white" stroke-width="2"/>
          <circle cx="12" cy="12" r="4" fill="white"/>
        </svg>
      `)}`,
      scaledSize: new window.google.maps.Size(size, size),
      anchor: new window.google.maps.Point(size/2, size/2)
    };
  };

  // Get location coordinates from TouristLocation data
  const getLocationCoordinates = (location: TouristLocation) => {
    // Use lat/lng from TouristLocation interface
    return {
      lat: location.lat || center.lat + (Math.random() - 0.5) * 2,
      lng: location.lng || center.lng + (Math.random() - 0.5) * 2
    };
  };

  return (
    <div className="relative w-full h-full">
      <LoadScript
        googleMapsApiKey={process.env.REACT_APP_GOOGLE_MAPS_API_KEY || "your-api-key"}
        libraries={['places', 'geometry']}
      >
        <GoogleMap
          mapContainerStyle={{ width: '100%', height: '100%' }}
          center={center}
          zoom={8}
          onLoad={onLoad}
          onUnmount={onUnmount}
          options={mapOptions}
        >
          {/* Location Markers */}
          {mapLoaded && locations.map((location) => {
            const coords = getLocationCoordinates(location);
            const isSelected = selectedLocation?.id === location.id;
            
            return (
              <Marker
                key={location.id}
                position={coords}
                title={location.name}
                icon={getMarkerIcon(location, isSelected)}
                onClick={() => setInfoWindow(location)}
                animation={isSelected ? google.maps.Animation.BOUNCE : undefined}
              />
            );
          })}

          {/* Enhanced Info Window */}
          {infoWindow && (
            <InfoWindow
              position={getLocationCoordinates(infoWindow)}
              onCloseClick={() => setInfoWindow(null)}
              options={{
                pixelOffset: new window.google.maps.Size(0, -30),
                maxWidth: 350
              }}
            >
              <div className="p-4 max-w-sm">
                {/* Header */}
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="font-bold text-lg text-gray-800 mb-1">
                      {infoWindow.name}
                    </h3>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <MapPin size={14} />
                      <span className="capitalize">{infoWindow.type.replace('_', ' ')}</span>
                      <div className="flex items-center gap-1 ml-2">
                        <Star size={14} className="text-yellow-500" />
                        <span>{infoWindow.rating}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Image */}
                {infoWindow.imageUrl && (
                  <div className="mb-3 rounded-lg overflow-hidden">
                    <img
                      src={infoWindow.imageUrl}
                      alt={infoWindow.name}
                      className="w-full h-32 object-cover"
                    />
                  </div>
                )}

                {/* Description */}
                <p className="text-gray-700 text-sm mb-4 line-clamp-3">
                  {infoWindow.description}
                </p>

                {/* Price */}
                <div className="flex items-center justify-between mb-4">
                  <span className="text-lg font-bold text-green-600">
                    {infoWindow.priceRange}
                  </span>
                  {infoWindow.openingHours && (
                    <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">
                      Open Now
                    </span>
                  )}
                </div>

                {/* Action Buttons */}
                <div className="space-y-2">
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      onClick={() => {
                        onBookingClick(infoWindow);
                        setInfoWindow(null);
                      }}
                      className="bg-gradient-to-r from-orange-500 to-red-500 text-white text-sm font-medium py-2 px-3 rounded-lg hover:from-orange-600 hover:to-red-600 transition-all flex items-center justify-center gap-1"
                    >
                      <Calendar size={14} />
                      Book Tour
                    </button>
                    <button
                      onClick={() => {
                        window.open('tel:+94777721999', '_self');
                      }}
                      className="bg-gradient-to-r from-green-500 to-emerald-500 text-white text-sm font-medium py-2 px-3 rounded-lg hover:from-green-600 hover:to-emerald-600 transition-all flex items-center justify-center gap-1"
                    >
                      <Phone size={14} />
                      Call
                    </button>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      onClick={() => {
                        onLocationSelect(infoWindow);
                        setInfoWindow(null);
                      }}
                      className="bg-blue-100 text-blue-800 text-sm font-medium py-2 px-3 rounded-lg hover:bg-blue-200 transition-colors flex items-center justify-center gap-1"
                    >
                      <Eye size={14} />
                      View Details
                    </button>
                    <button
                      onClick={() => {
                        const coords = getLocationCoordinates(infoWindow);
                        window.open(`https://www.google.com/maps/dir/?api=1&destination=${coords.lat},${coords.lng}`, '_blank');
                      }}
                      className="bg-gray-100 text-gray-800 text-sm font-medium py-2 px-3 rounded-lg hover:bg-gray-200 transition-colors flex items-center justify-center gap-1"
                    >
                      <Navigation size={14} />
                      Directions
                    </button>
                  </div>
                </div>
              </div>
            </InfoWindow>
          )}
        </GoogleMap>
      </LoadScript>
      
      {/* Map Loading Overlay */}
      {!mapLoaded && (
        <div className="absolute inset-0 bg-gray-100 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading interactive map...</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default EnhancedGoogleMap;