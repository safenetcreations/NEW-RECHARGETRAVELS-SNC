
import React, { useState } from 'react';
import { MapPin, ChevronDown } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { POPULAR_LOCATIONS } from '../../utils/constants';

interface PopularLocation {
  name: string;
  address: string;
  coordinates?: { lat: number; lng: number };
}

interface LocationPickerProps {
  label: string;
  placeholder: string;
  value?: { address: string; coordinates?: any };
  onChange: (value: { address: string; coordinates?: any }) => void;
  error?: string;
  popularLocations?: PopularLocation[];
}

export const LocationPicker: React.FC<LocationPickerProps> = ({
  label,
  placeholder,
  value,
  onChange,
  error,
  popularLocations = []
}) => {
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [inputValue, setInputValue] = useState(value?.address || '');
  const [filteredLocations, setFilteredLocations] = useState<PopularLocation[]>([]);

  // Flatten popular locations from constants if none provided
  const defaultPopularLocations = popularLocations.length > 0 
    ? popularLocations 
    : POPULAR_LOCATIONS.flatMap(category => category.locations);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    console.log('Input changed:', newValue);
    setInputValue(newValue);
    
    onChange({ address: newValue, coordinates: value?.coordinates });

    // Filter locations
    if (newValue.length > 0) {
      const filtered = defaultPopularLocations.filter(location =>
        location.name.toLowerCase().includes(newValue.toLowerCase()) ||
        location.address.toLowerCase().includes(newValue.toLowerCase())
      );
      setFilteredLocations(filtered.slice(0, 6));
      setShowSuggestions(true);
    } else {
      setFilteredLocations(defaultPopularLocations.slice(0, 6));
      setShowSuggestions(false);
    }
  };

  const handleLocationSelect = (location: PopularLocation) => {
    console.log('Popular location selected:', location);
    const address = location.address;
    setInputValue(address);
    onChange({ 
      address,
      coordinates: location.coordinates
    });
    setShowSuggestions(false);
  };

  const handleInputFocus = () => {
    if (defaultPopularLocations.length > 0) {
      setFilteredLocations(defaultPopularLocations.slice(0, 6));
      setShowSuggestions(true);
    }
  };

  const handleBlur = () => {
    setTimeout(() => setShowSuggestions(false), 200);
  };

  return (
    <div className="relative">
      <label className="block text-sm font-medium text-gray-700 mb-2">
        {label}
      </label>
      
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none z-10">
          <MapPin className="h-5 w-5 text-gray-400" />
        </div>
        
        <Input
          type="text"
          value={inputValue}
          onChange={handleInputChange}
          onFocus={handleInputFocus}
          onBlur={handleBlur}
          placeholder={placeholder}
          className={`w-full pl-10 pr-10 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
            error ? 'border-red-500' : 'border-gray-300'
          }`}
        />

        {/* Popular Locations Button */}
        {defaultPopularLocations.length > 0 && (
          <button
            type="button"
            onClick={() => setShowSuggestions(!showSuggestions)}
            className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
          >
            <ChevronDown className="h-5 w-5" />
          </button>
        )}

        {showSuggestions && filteredLocations.length > 0 && (
          <div className="absolute z-20 mt-1 w-full bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
            <div className="p-2 text-xs font-medium text-gray-500 bg-gray-50 rounded-t-lg border-b">
              Popular Locations
            </div>
            {filteredLocations.map((location, index) => (
              <button
                key={index}
                type="button"
                onClick={() => handleLocationSelect(location)}
                className="w-full text-left px-4 py-3 hover:bg-blue-50 focus:bg-blue-50 focus:outline-none border-b border-gray-100 last:border-b-0"
              >
                <div className="flex items-center gap-3">
                  <MapPin className="w-4 h-4 text-gray-400 flex-shrink-0" />
                  <div className="min-w-0 flex-1">
                    <div className="font-medium text-gray-900 truncate">
                      {location.name}
                    </div>
                    <div className="text-sm text-gray-500 truncate">
                      {location.address}
                    </div>
                  </div>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>

      {error && (
        <p className="mt-1 text-sm text-red-600">{error}</p>
      )}
    </div>
  );
};
