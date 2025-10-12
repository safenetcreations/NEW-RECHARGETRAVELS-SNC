
import React from 'react';

interface MapRegion {
  id: string;
  name: string;
  description: string;
  bounds: {
    top: string;
    left: string;
    width: string;
    height: string;
  };
}

interface MapRegionHoversProps {
  onRegionHover: (region: MapRegion | null) => void;
}

const mapRegions: MapRegion[] = [
  {
    id: 'kandy',
    name: 'Kandy',
    description: 'The Cultural Heart',
    bounds: { top: '35%', left: '45%', width: '12%', height: '8%' }
  },
  {
    id: 'ella',
    name: 'Ella',
    description: 'Tea Hills Paradise',
    bounds: { top: '55%', left: '50%', width: '10%', height: '8%' }
  },
  {
    id: 'galle',
    name: 'Galle',
    description: 'Colonial Fortress',
    bounds: { top: '75%', left: '35%', width: '12%', height: '8%' }
  },
  {
    id: 'yala',
    name: 'Yala',
    description: 'Wildlife Kingdom',
    bounds: { top: '70%', left: '55%', width: '15%', height: '10%' }
  },
  {
    id: 'colombo',
    name: 'Colombo',
    description: 'The Gateway',
    bounds: { top: '60%', left: '30%', width: '10%', height: '8%' }
  },
  {
    id: 'sigiriya',
    name: 'Sigiriya',
    description: 'Ancient Wonder',
    bounds: { top: '25%', left: '48%', width: '12%', height: '8%' }
  }
];

const MapRegionHovers = ({ onRegionHover }: MapRegionHoversProps) => {
  return (
    <div className="absolute inset-0 pointer-events-none z-10">
      {mapRegions.map((region) => (
        <div
          key={region.id}
          className="absolute pointer-events-auto cursor-pointer group"
          style={{
            top: region.bounds.top,
            left: region.bounds.left,
            width: region.bounds.width,
            height: region.bounds.height,
          }}
          onMouseEnter={() => onRegionHover(region)}
          onMouseLeave={() => onRegionHover(null)}
        >
          {/* Invisible hover area */}
          <div className="w-full h-full bg-transparent group-hover:bg-wild-orange/20 rounded-full transition-all duration-300 border-2 border-transparent group-hover:border-wild-orange/50" />
          
          {/* Tooltip */}
          <div className="absolute -top-12 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
            <div className="bg-white/95 backdrop-blur-sm px-3 py-2 rounded-lg shadow-lg border border-wild-orange/20">
              <p className="font-chakra font-bold text-granite-gray text-sm">{region.name}</p>
              <p className="font-inter text-xs text-granite-gray/70">{region.description}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default MapRegionHovers;
