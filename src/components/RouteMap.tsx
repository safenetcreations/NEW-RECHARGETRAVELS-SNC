import { MapPin, Navigation } from 'lucide-react';

interface RouteMapProps {
  origin: string;
  destination: string;
}

const RouteMap = ({ origin, destination }: RouteMapProps) => {
  // This is a placeholder component
  // In a real implementation, this would use Google Maps or Mapbox
  // to display an actual interactive map with the route
  
  return (
    <div className="relative w-full h-[400px] bg-gray-100 rounded-lg overflow-hidden">
      {/* Placeholder map background */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-green-50">
        <div className="absolute inset-0 opacity-20">
          {/* Grid pattern for map effect */}
          <div className="grid grid-cols-12 grid-rows-12 h-full w-full">
            {Array.from({ length: 144 }).map((_, i) => (
              <div key={i} className="border border-gray-300"></div>
            ))}
          </div>
        </div>
      </div>
      
      {/* Route visualization */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="flex items-center space-x-4 bg-white/90 backdrop-blur-sm p-6 rounded-lg shadow-lg">
          <div className="text-center">
            <MapPin className="w-8 h-8 text-green-600 mx-auto mb-2" />
            <p className="font-semibold text-sm">{origin}</p>
            <p className="text-xs text-gray-500">Start</p>
          </div>
          
          <div className="flex items-center">
            <div className="w-16 border-t-2 border-dashed border-gray-400"></div>
            <Navigation className="w-6 h-6 text-gray-400 mx-2" />
            <div className="w-16 border-t-2 border-dashed border-gray-400"></div>
          </div>
          
          <div className="text-center">
            <MapPin className="w-8 h-8 text-red-600 mx-auto mb-2" />
            <p className="font-semibold text-sm">{destination}</p>
            <p className="text-xs text-gray-500">End</p>
          </div>
        </div>
      </div>
      
      {/* Map integration note */}
      <div className="absolute bottom-4 left-4 bg-white/80 backdrop-blur-sm px-3 py-1 rounded text-xs text-gray-600">
        Interactive map view
      </div>
    </div>
  );
};

export default RouteMap;