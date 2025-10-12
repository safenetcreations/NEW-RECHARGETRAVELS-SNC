
import { Waves } from 'lucide-react';
import GoogleMapComponent from './GoogleMap';
import MapRegionHovers from './MapRegionHovers';
import { type EnhancedWildlifeLocation } from '../data/enhancedWildlifeData';

interface InteractiveMapSectionProps {
  selectedLocation: EnhancedWildlifeLocation | null;
  onSelectLocation: (location: EnhancedWildlifeLocation | null) => void;
  center: { lat: number; lng: number };
  zoom: number;
  directions: google.maps.DirectionsResult | null;
  hoveredRegion: {name: string, description: string} | null;
  onRegionHover: (region: {name: string, description: string} | null) => void;
}

const InteractiveMapSection = ({
  selectedLocation,
  onSelectLocation,
  center,
  zoom,
  directions,
  hoveredRegion,
  onRegionHover
}: InteractiveMapSectionProps) => {
  return (
    <div className="lg:col-span-3">
      <div className="rounded-2xl overflow-hidden shadow-2xl border-4 border-jungle-green/20 sticky top-24 wildlife-pulse relative">
        <div className="bg-gradient-to-r from-wild-orange to-jungle-green p-4">
          <h3 className="text-white font-chakra font-bold text-lg flex items-center">
            <Waves className="mr-2 h-5 w-5" />
            Complete Sri Lanka Experience Map
            {hoveredRegion && (
              <span className="ml-2 text-sm font-normal">
                • Exploring {hoveredRegion.name}
              </span>
            )}
          </h3>
          <p className="text-white/80 text-sm font-inter">🐆 Wildlife • 🏖️ Beaches • 🛕 Temples • 💧 Waterfalls • 🏔️ Adventure •🏛️ Culture • 🐘 Elephants • 🐋 Whales • 🐬 Dolphins • 🐻 Bears • 🦭 Dugongs</p>
        </div>
        <div className="relative">
          <GoogleMapComponent
            height="75vh"
            selectedLocation={selectedLocation}
            onSelectLocation={onSelectLocation}
            center={center}
            zoom={zoom}
            directions={directions}
          />
          <MapRegionHovers onRegionHover={onRegionHover} />
        </div>
      </div>
    </div>
  );
};

export default InteractiveMapSection;
