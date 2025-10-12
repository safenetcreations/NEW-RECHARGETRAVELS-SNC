
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { X, MapPin, Navigation, TreePine } from 'lucide-react';
import type { NationalPark } from '@/data/wildlifeToursData';

interface Interactive3DGlobeProps {
  parks: NationalPark[];
  onClose: () => void;
  onParkSelect: (parkId: string) => void;
}

const Interactive3DGlobe: React.FC<Interactive3DGlobeProps> = ({ 
  parks, 
  onClose, 
  onParkSelect 
}) => {
  const [selectedPark, setSelectedPark] = useState<NationalPark | null>(null);
  const [globeRotation, setGlobeRotation] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setGlobeRotation(prev => (prev + 0.5) % 360);
    }, 50);
    return () => clearInterval(interval);
  }, []);

  const handleParkClick = (park: NationalPark) => {
    setSelectedPark(park);
  };

  const handleExploreClick = () => {
    if (selectedPark) {
      onParkSelect(selectedPark.id);
    }
  };

  // Simulated coordinates for Sri Lanka parks
  const parkPositions = [
    { id: 'yala', top: '65%', left: '75%' },
    { id: 'wilpattu', top: '35%', left: '45%' },
    { id: 'udawalawe', top: '70%', left: '55%' },
    { id: 'minneriya', top: '40%', left: '65%' },
    { id: 'horton-plains', top: '55%', left: '60%' },
    { id: 'sinharaja', top: '75%', left: '50%' },
    { id: 'bundala', top: '80%', left: '70%' },
    { id: 'kaudulla', top: '38%', left: '67%' }
  ];

  return (
    <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-sm">
      <div className="relative w-full h-full flex items-center justify-center">
        {/* Close Button */}
        <Button
          variant="outline"
          size="sm"
          onClick={onClose}
          className="absolute top-6 right-6 z-10 bg-white/10 border-white/30 text-white hover:bg-white/20"
        >
          <X className="w-4 h-4" />
        </Button>

        {/* Globe Container */}
        <div className="relative">
          {/* 3D Globe */}
          <div 
            className="w-96 h-96 md:w-[500px] md:h-[500px] rounded-full bg-gradient-to-br from-green-600 to-emerald-800 relative overflow-hidden shadow-2xl animate-globe-rotate"
            style={{
              background: `
                radial-gradient(circle at 30% 30%, rgba(34, 197, 94, 0.8) 0%, transparent 50%),
                radial-gradient(circle at 70% 70%, rgba(16, 185, 129, 0.6) 0%, transparent 50%),
                linear-gradient(135deg, #059669 0%, #047857 100%)
              `,
              boxShadow: '0 0 100px rgba(16, 185, 129, 0.3), inset 0 0 100px rgba(0, 0, 0, 0.3)'
            }}
          >
            {/* Country Outline Overlay */}
            <div className="absolute inset-0 opacity-30">
              <svg viewBox="0 0 500 500" className="w-full h-full">
                <path
                  d="M250 100 C300 120, 350 150, 370 200 C380 250, 360 300, 340 340 C300 380, 250 390, 200 380 C150 360, 120 320, 110 280 C100 240, 120 200, 150 160 C180 120, 220 100, 250 100"
                  fill="rgba(255,255,255,0.1)"
                  stroke="rgba(255,255,255,0.3)"
                  strokeWidth="2"
                />
              </svg>
            </div>

            {/* Park Pins */}
            {parkPositions.map((position) => {
              const park = parks.find(p => p.slug === position.id);
              if (!park) return null;
              
              return (
                <button
                  key={park.id}
                  onClick={() => handleParkClick(park)}
                  className={`absolute w-4 h-4 rounded-full border-2 border-white shadow-lg transition-all duration-300 hover:scale-150 z-10 ${
                    selectedPark?.id === park.id 
                      ? 'bg-yellow-400 animate-ping' 
                      : 'bg-red-500 hover:bg-red-400'
                  }`}
                  style={{
                    top: position.top,
                    left: position.left,
                    transform: 'translate(-50%, -50%)'
                  }}
                >
                  <span className="sr-only">{park.name}</span>
                </button>
              );
            })}

            {/* Atmospheric Glow */}
            <div className="absolute inset-0 rounded-full bg-gradient-to-br from-transparent via-white/5 to-transparent animate-pulse" />
          </div>

          {/* Park Information Panel */}
          {selectedPark && (
            <div className="absolute top-0 left-full ml-8 w-80 bg-white/95 backdrop-blur-md rounded-2xl p-6 shadow-2xl animate-scale-in">
              <div className="mb-4">
                <Badge className="mb-2 bg-emerald-100 text-emerald-800">
                  {selectedPark.classification}
                </Badge>
                <h3 className="text-2xl font-playfair font-bold text-gray-900 mb-2">
                  {selectedPark.name}
                </h3>
                <p className="text-gray-600 mb-4 font-montserrat">
                  {selectedPark.description}
                </p>
              </div>

              <div className="space-y-3 mb-6">
                <div className="flex items-center text-sm text-gray-700">
                  <MapPin className="w-4 h-4 mr-2 text-emerald-600" />
                  <span>{selectedPark.province} • {selectedPark.location.nearestCity}</span>
                </div>
                <div className="flex items-center text-sm text-gray-700">
                  <Navigation className="w-4 h-4 mr-2 text-emerald-600" />
                  <span>{selectedPark.location.distanceFromColombo}km from Colombo</span>
                </div>
                <div className="flex items-center text-sm text-gray-700">
                  <TreePine className="w-4 h-4 mr-2 text-emerald-600" />
                  <span>{selectedPark.attractions.slice(0, 2).join(', ')}</span>
                </div>
              </div>

              <Button 
                onClick={handleExploreClick}
                className="w-full bg-emerald-600 hover:bg-emerald-700 text-white rounded-full py-3"
              >
                Explore This Park
              </Button>
            </div>
          )}
        </div>

        {/* Instructions */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 text-center text-white/80">
          <p className="font-montserrat">Click on the glowing pins to explore national parks</p>
        </div>
      </div>
    </div>
  );
};

export default Interactive3DGlobe;
