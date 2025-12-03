import React, { useState, useMemo } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import { motion } from 'framer-motion';
import { MapPin, Star, Clock, DollarSign, Navigation, ExternalLink } from 'lucide-react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix Leaflet default marker icon issue
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

const DefaultIcon = L.icon({
  iconUrl: icon,
  shadowUrl: iconShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
});
L.Marker.prototype.options.icon = DefaultIcon;

// Custom colored marker icons
const createColoredIcon = (color: string) => {
  return L.divIcon({
    className: 'custom-marker',
    html: `
      <div style="
        background-color: ${color};
        width: 32px;
        height: 32px;
        border-radius: 50% 50% 50% 0;
        transform: rotate(-45deg);
        border: 3px solid white;
        box-shadow: 0 2px 8px rgba(0,0,0,0.3);
        display: flex;
        align-items: center;
        justify-content: center;
      ">
        <div style="
          transform: rotate(45deg);
          color: white;
          font-size: 14px;
          font-weight: bold;
        ">★</div>
      </div>
    `,
    iconSize: [32, 32],
    iconAnchor: [16, 32],
    popupAnchor: [0, -32],
  });
};

// Category colors for markers
const categoryColors: Record<string, string> = {
  'Agro-Tourism': '#22c55e',  // Green
  'Memorial': '#8b5cf6',       // Purple
  'Heritage': '#f59e0b',       // Amber
  'Nature': '#10b981',         // Emerald
  'Landmark': '#3b82f6',       // Blue
  'Temple': '#ef4444',         // Red
  'Cultural': '#ec4899',       // Pink
  'Wildlife': '#14b8a6',       // Teal
  'Beach': '#06b6d4',          // Cyan
  'Adventure': '#f97316',      // Orange
  'default': '#6366f1',        // Indigo
};

interface Attraction {
  name: string;
  description: string;
  image: string;
  category: string;
  rating: number;
  duration?: string;
  price?: string;
  highlights?: string[];
  coordinates?: { lat: number; lng: number };
}

interface DestinationMapProps {
  destinationName: string;
  center: { lat: number; lng: number };
  attractions: Attraction[];
  height?: string;
  onAttractionClick?: (attraction: Attraction) => void;
}

// Component to handle map centering on selected attraction
const MapController: React.FC<{ center: [number, number]; zoom: number }> = ({ center, zoom }) => {
  const map = useMap();

  React.useEffect(() => {
    map.setView(center, zoom);
  }, [center, zoom, map]);

  return null;
};

export const DestinationMap: React.FC<DestinationMapProps> = ({
  destinationName,
  center,
  attractions,
  height = '500px',
  onAttractionClick,
}) => {
  const [selectedAttraction, setSelectedAttraction] = useState<Attraction | null>(null);
  const [mapCenter, setMapCenter] = useState<[number, number]>([center.lat, center.lng]);
  const [mapZoom, setMapZoom] = useState(12);

  // Generate coordinates for attractions that don't have them
  // Spread them around the center point
  const attractionsWithCoords = useMemo(() => {
    return attractions.map((attraction, index) => {
      if (attraction.coordinates) {
        return attraction;
      }

      // Create a circular spread around the center
      const angleStep = (2 * Math.PI) / Math.max(attractions.length, 1);
      const angle = angleStep * index;
      const radius = 0.02 + (index % 3) * 0.01; // Vary the radius slightly

      return {
        ...attraction,
        coordinates: {
          lat: center.lat + radius * Math.cos(angle),
          lng: center.lng + radius * Math.sin(angle),
        },
      };
    });
  }, [attractions, center]);

  const handleMarkerClick = (attraction: Attraction) => {
    setSelectedAttraction(attraction);
    if (attraction.coordinates) {
      setMapCenter([attraction.coordinates.lat, attraction.coordinates.lng]);
      setMapZoom(14);
    }
    onAttractionClick?.(attraction);
  };

  const openInGoogleMaps = (attraction: Attraction) => {
    if (attraction.coordinates) {
      const url = `https://www.google.com/maps/search/?api=1&query=${attraction.coordinates.lat},${attraction.coordinates.lng}`;
      window.open(url, '_blank');
    }
  };

  return (
    <div className="relative" style={{ height }}>
      {/* Map Header */}
      <div className="absolute top-4 left-4 z-[1000] bg-white/95 backdrop-blur-sm rounded-xl shadow-lg p-4 max-w-xs">
        <div className="flex items-center gap-2 mb-2">
          <MapPin className="w-5 h-5 text-amber-600" />
          <h3 className="font-semibold text-gray-800">Explore {destinationName}</h3>
        </div>
        <p className="text-sm text-gray-600">
          Click on markers to see attraction details
        </p>
        <div className="flex flex-wrap gap-2 mt-3">
          <span className="text-xs bg-amber-100 text-amber-800 px-2 py-1 rounded-full">
            {attractions.length} Attractions
          </span>
        </div>
      </div>

      {/* Legend */}
      <div className="absolute bottom-4 left-4 z-[1000] bg-white/95 backdrop-blur-sm rounded-lg shadow-lg p-3 max-w-[200px]">
        <p className="text-xs font-semibold text-gray-700 mb-2">Categories</p>
        <div className="grid grid-cols-2 gap-1">
          {Object.entries(categoryColors).slice(0, 6).map(([category, color]) => (
            <div key={category} className="flex items-center gap-1">
              <span
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: color }}
              />
              <span className="text-[10px] text-gray-600 truncate">{category}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Map Container */}
      <MapContainer
        center={[center.lat, center.lng]}
        zoom={12}
        style={{ height: '100%', width: '100%', borderRadius: '16px' }}
        className="z-0"
      >
        <MapController center={mapCenter} zoom={mapZoom} />

        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {/* Attraction Markers */}
        {attractionsWithCoords.map((attraction, index) => (
          <Marker
            key={index}
            position={[attraction.coordinates!.lat, attraction.coordinates!.lng]}
            icon={createColoredIcon(categoryColors[attraction.category] || categoryColors.default)}
            eventHandlers={{
              click: () => handleMarkerClick(attraction),
            }}
          >
            <Popup className="attraction-popup" maxWidth={300}>
              <div className="min-w-[250px]">
                {/* Attraction Image */}
                <div className="relative h-32 -mx-3 -mt-3 mb-3 overflow-hidden rounded-t-lg">
                  <img
                    src={attraction.image}
                    alt={attraction.name}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-2 right-2 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-full flex items-center gap-1">
                    <Star className="w-3 h-3 text-amber-500 fill-amber-500" />
                    <span className="text-xs font-medium">{attraction.rating}</span>
                  </div>
                </div>

                {/* Attraction Details */}
                <h4 className="font-bold text-gray-800 mb-1">{attraction.name}</h4>
                <span className="inline-block text-xs bg-amber-100 text-amber-800 px-2 py-0.5 rounded-full mb-2">
                  {attraction.category}
                </span>

                <p className="text-xs text-gray-600 mb-3 line-clamp-2">
                  {attraction.description}
                </p>

                {/* Info Row */}
                <div className="flex items-center gap-3 text-xs text-gray-500 mb-3">
                  {attraction.duration && (
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {attraction.duration}
                    </span>
                  )}
                  {attraction.price && (
                    <span className="flex items-center gap-1">
                      <DollarSign className="w-3 h-3" />
                      {attraction.price}
                    </span>
                  )}
                </div>

                {/* Action Buttons */}
                <div className="flex gap-2">
                  <button
                    onClick={() => openInGoogleMaps(attraction)}
                    className="flex-1 flex items-center justify-center gap-1 bg-amber-500 hover:bg-amber-600 text-white text-xs py-2 px-3 rounded-lg transition-colors"
                  >
                    <Navigation className="w-3 h-3" />
                    Get Directions
                  </button>
                  <button
                    onClick={() => onAttractionClick?.(attraction)}
                    className="flex items-center justify-center gap-1 border border-gray-300 hover:bg-gray-50 text-gray-700 text-xs py-2 px-3 rounded-lg transition-colors"
                  >
                    <ExternalLink className="w-3 h-3" />
                  </button>
                </div>
              </div>
            </Popup>
          </Marker>
        ))}

        {/* Destination Center Marker */}
        <Marker
          position={[center.lat, center.lng]}
          icon={L.divIcon({
            className: 'center-marker',
            html: `
              <div style="
                background-color: #dc2626;
                width: 20px;
                height: 20px;
                border-radius: 50%;
                border: 3px solid white;
                box-shadow: 0 2px 8px rgba(0,0,0,0.4);
              "></div>
            `,
            iconSize: [20, 20],
            iconAnchor: [10, 10],
          })}
        >
          <Popup>
            <div className="text-center py-2">
              <strong className="text-gray-800">{destinationName}</strong>
              <p className="text-xs text-gray-500">City Center</p>
            </div>
          </Popup>
        </Marker>
      </MapContainer>

      {/* Selected Attraction Card (Mobile-friendly) */}
      {selectedAttraction && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="absolute bottom-4 right-4 z-[1000] bg-white rounded-xl shadow-xl p-4 max-w-[280px] hidden md:block"
        >
          <button
            onClick={() => setSelectedAttraction(null)}
            className="absolute top-2 right-2 text-gray-400 hover:text-gray-600"
          >
            ×
          </button>
          <div className="flex gap-3">
            <img
              src={selectedAttraction.image}
              alt={selectedAttraction.name}
              className="w-16 h-16 rounded-lg object-cover"
            />
            <div className="flex-1 min-w-0">
              <h4 className="font-semibold text-gray-800 text-sm truncate">
                {selectedAttraction.name}
              </h4>
              <span className="text-xs text-amber-600">{selectedAttraction.category}</span>
              <div className="flex items-center gap-1 mt-1">
                <Star className="w-3 h-3 text-amber-500 fill-amber-500" />
                <span className="text-xs text-gray-600">{selectedAttraction.rating}</span>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default DestinationMap;
