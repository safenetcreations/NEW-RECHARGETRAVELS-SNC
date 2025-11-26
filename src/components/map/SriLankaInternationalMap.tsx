
import React from 'react';
import { MapPin, Plane, Ship } from 'lucide-react';

interface SriLankaInternationalMapProps {
  height?: string;
  showNeighbors?: boolean;
  showRoutes?: boolean;
}

const SriLankaInternationalMap = ({ 
  height = "500px", 
  showNeighbors = true, 
  showRoutes = true 
}: SriLankaInternationalMapProps) => {
  const majorCities = [
    { name: 'Colombo', x: 50, y: 70, type: 'capital' },
    { name: 'Kandy', x: 52, y: 65, type: 'cultural' },
    { name: 'Galle', x: 48, y: 78, type: 'port' },
    { name: 'Jaffna', x: 51, y: 45, type: 'city' },
    { name: 'Trincomalee', x: 58, y: 55, type: 'port' },
    { name: 'Batticaloa', x: 60, y: 68, type: 'city' },
    { name: 'Matara', x: 48, y: 80, type: 'city' },
    { name: 'Anuradhapura', x: 50, y: 55, type: 'ancient' }
  ];

  const neighboringCountries = [
    { name: 'India', x: 30, y: 30, distance: '31 km' },
    { name: 'Maldives', x: 35, y: 90, distance: '700 km' }
  ];

  const internationalRoutes = [
    { from: { x: 50, y: 70 }, to: { x: 30, y: 30 }, type: 'air', destination: 'India' },
    { from: { x: 50, y: 70 }, to: { x: 15, y: 20 }, type: 'air', destination: 'Middle East' },
    { from: { x: 50, y: 70 }, to: { x: 80, y: 15 }, type: 'air', destination: 'Southeast Asia' },
    { from: { x: 48, y: 78 }, to: { x: 35, y: 90 }, type: 'sea', destination: 'Maldives' }
  ];

  return (
    <div className="relative w-full bg-gradient-to-br from-blue-100 to-green-50 rounded-lg border-2 border-green-200 overflow-hidden" style={{ height }}>
      
      {/* Header */}
      <div className="absolute top-0 left-0 right-0 bg-gradient-to-r from-green-600 to-blue-600 text-white p-4 z-20">
        <h3 className="text-xl font-bold">🌏 Sri Lanka - Pearl of the Indian Ocean</h3>
        <p className="text-sm opacity-90">Strategic location in South Asia • Gateway to the Indian Ocean</p>
      </div>

      {/* Map Container */}
      <div className="pt-20 pb-4 px-4 h-full relative">
        
        {/* Ocean Background */}
        <div className="absolute inset-0 bg-gradient-to-b from-blue-200 to-blue-300 opacity-30 rounded-lg"></div>
        
        {/* Sri Lanka Island Shape */}
        <div 
          className="absolute bg-green-500 rounded-lg transform rotate-12 shadow-lg"
          style={{
            left: '45%',
            top: '40%',
            width: '12%',
            height: '35%',
            clipPath: 'polygon(30% 0%, 70% 0%, 100% 30%, 90% 70%, 70% 100%, 30% 100%, 0% 70%, 10% 30%)'
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-br from-green-400 to-green-600 rounded-lg"></div>
        </div>

        {/* India Landmass */}
        {showNeighbors && (
          <div 
            className="absolute bg-yellow-500 rounded-lg shadow-md"
            style={{
              left: '15%',
              top: '10%',
              width: '25%',
              height: '40%',
              clipPath: 'polygon(0% 0%, 100% 0%, 90% 50%, 100% 100%, 0% 100%, 20% 50%)'
            }}
          >
            <div className="absolute inset-0 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-lg"></div>
          </div>
        )}

        {/* Maldives Dots */}
        {showNeighbors && (
          <div className="absolute" style={{ left: '30%', top: '80%' }}>
            {[...Array(5)].map((_, i) => (
              <div 
                key={i}
                className="absolute w-2 h-2 bg-blue-600 rounded-full"
                style={{ 
                  left: `${i * 8}px`, 
                  top: `${Math.sin(i) * 10}px` 
                }}
              ></div>
            ))}
          </div>
        )}

        {/* Sri Lankan Cities */}
        {majorCities.map((city, index) => (
          <div
            key={city.name}
            className="absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer group"
            style={{ left: `${city.x}%`, top: `${city.y}%` }}
          >
            <div className={`w-3 h-3 rounded-full border-2 border-white shadow-md ${
              city.type === 'capital' ? 'bg-red-500' :
              city.type === 'port' ? 'bg-blue-500' :
              city.type === 'cultural' ? 'bg-purple-500' :
              city.type === 'ancient' ? 'bg-orange-500' :
              'bg-green-500'
            }`}></div>
            <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-white px-2 py-1 rounded text-xs font-medium shadow-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
              {city.name}
              {city.type === 'capital' && ' (Capital)'}
              {city.type === 'port' && ' (Port)'}
              {city.type === 'cultural' && ' (Cultural)'}
              {city.type === 'ancient' && ' (Ancient)'}
            </div>
          </div>
        ))}

        {/* Neighboring Countries Labels */}
        {showNeighbors && neighboringCountries.map((country) => (
          <div
            key={country.name}
            className="absolute transform -translate-x-1/2 -translate-y-1/2"
            style={{ left: `${country.x}%`, top: `${country.y}%` }}
          >
            <div className="bg-yellow-100 border border-yellow-400 px-3 py-2 rounded-lg shadow-md">
              <div className="font-bold text-gray-800">{country.name}</div>
              <div className="text-xs text-gray-600">{country.distance} away</div>
            </div>
          </div>
        ))}

        {/* International Routes */}
        {showRoutes && internationalRoutes.map((route, index) => (
          <div key={index}>
            <svg 
              className="absolute inset-0 w-full h-full pointer-events-none"
              style={{ zIndex: 5 }}
            >
              <defs>
                <marker
                  id={`arrowhead-${index}`}
                  markerWidth="10"
                  markerHeight="7"
                  refX="9"
                  refY="3.5"
                  orient="auto"
                >
                  <polygon
                    points="0 0, 10 3.5, 0 7"
                    fill={route.type === 'air' ? '#3B82F6' : '#059669'}
                  />
                </marker>
              </defs>
              <line
                x1={`${route.from.x}%`}
                y1={`${route.from.y}%`}
                x2={`${route.to.x}%`}
                y2={`${route.to.y}%`}
                stroke={route.type === 'air' ? '#3B82F6' : '#059669'}
                strokeWidth="2"
                strokeDasharray={route.type === 'air' ? '5,5' : '10,5'}
                markerEnd={`url(#arrowhead-${index})`}
                opacity="0.7"
              />
            </svg>
            <div 
              className="absolute transform -translate-x-1/2 -translate-y-1/2 text-xs font-medium"
              style={{ 
                left: `${(route.from.x + route.to.x) / 2}%`, 
                top: `${(route.from.y + route.to.y) / 2 - 3}%` 
              }}
            >
              <div className={`px-2 py-1 rounded shadow-sm ${
                route.type === 'air' ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800'
              }`}>
                {route.type === 'air' ? <Plane className="w-3 h-3 inline mr-1" /> : <Ship className="w-3 h-3 inline mr-1" />}
                {route.destination}
              </div>
            </div>
          </div>
        ))}

        {/* Legend */}
        <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur-sm rounded-lg p-3 text-xs shadow-lg">
          <h5 className="font-bold mb-2">Legend</h5>
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-red-500 rounded-full border border-white"></div>
              <span>Capital City</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-blue-500 rounded-full border border-white"></div>
              <span>Major Ports</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-purple-500 rounded-full border border-white"></div>
              <span>Cultural Sites</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-orange-500 rounded-full border border-white"></div>
              <span>Ancient Cities</span>
            </div>
            {showRoutes && (
              <>
                <div className="flex items-center gap-2">
                  <Plane className="w-3 h-3 text-blue-600" />
                  <span>Air Routes</span>
                </div>
                <div className="flex items-center gap-2">
                  <Ship className="w-3 h-3 text-green-600" />
                  <span>Sea Routes</span>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Compass */}
        <div className="absolute top-24 right-4 bg-white/90 backdrop-blur-sm rounded-full p-3 shadow-lg">
          <div className="relative w-8 h-8">
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-xs font-bold">N</div>
            </div>
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-6 h-6">
              <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-2 border-r-2 border-b-3 border-transparent border-b-red-500"></div>
              <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-2 border-r-2 border-t-3 border-transparent border-t-gray-400"></div>
            </div>
          </div>
        </div>

        {/* Facts Box */}
        <div className="absolute bottom-4 right-4 bg-white/90 backdrop-blur-sm rounded-lg p-3 text-xs shadow-lg max-w-48">
          <h5 className="font-bold mb-2">🌟 Quick Facts</h5>
          <ul className="space-y-1 text-gray-700">
            <li>• Island nation in Indian Ocean</li>
            <li>• 31 km from India (Palk Strait)</li>
            <li>• Strategic maritime location</li>
            <li>• Ancient Silk Road connection</li>
            <li>• Gateway to South Asia</li>
          </ul>
        </div>

      </div>
    </div>
  );
};

export default SriLankaInternationalMap;
