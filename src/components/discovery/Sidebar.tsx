
import React from 'react';
import { X } from 'lucide-react';
import { TouristLocation } from './types';
import SearchAndFilters from './SearchAndFilters';
import LocationCard from './LocationCard';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  filteredLocations: TouristLocation[];
  selectedLocation: TouristLocation | null;
  onLocationSelect: (location: TouristLocation) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  activeFilter: string;
  onFilterChange: (filter: string) => void;
  locationTypes: string[];
}

const Sidebar: React.FC<SidebarProps> = ({
  isOpen,
  onClose,
  filteredLocations,
  selectedLocation,
  onLocationSelect,
  searchQuery,
  onSearchChange,
  activeFilter,
  onFilterChange,
  locationTypes
}) => {
  return (
    <div className={`bg-gray-800 transition-all duration-300 ${isOpen ? 'w-80' : 'w-0'} overflow-hidden flex flex-col`}>
      {/* Sidebar Header */}
      <div className="p-4 border-b border-gray-700">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold">Discover Sri Lanka</h2>
          <button 
            onClick={onClose}
            className="p-1 hover:bg-gray-700 rounded"
          >
            <X size={20} />
          </button>
        </div>

        <SearchAndFilters
          searchQuery={searchQuery}
          onSearchChange={onSearchChange}
          activeFilter={activeFilter}
          onFilterChange={onFilterChange}
          locationTypes={locationTypes}
        />
      </div>

      {/* Location List */}
      <div className="flex-1 overflow-y-auto p-4">
        <div className="space-y-3">
          {filteredLocations.map(location => (
            <LocationCard
              key={location.id}
              location={location}
              isSelected={selectedLocation?.id === location.id}
              onClick={onLocationSelect}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
