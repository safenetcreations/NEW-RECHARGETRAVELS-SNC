
import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { MapPin, ChevronDown } from 'lucide-react';

// Using React.ComponentProps<typeof Input> might be too restrictive for react-hook-form
// So we define the props explicitly to ensure compatibility
interface PlacesAutocompleteInputProps {
  value: string;
  onChange: (value: string) => void;
  onBlur: () => void;
  name: string;
  placeholder?: string;
  readOnly?: boolean;
  className?: string;
  ref?: React.Ref<HTMLInputElement>;
}

// Popular Sri Lankan locations for fallback
const POPULAR_LOCATIONS = [
  'Bandaranaike International Airport (CMB)',
  'Colombo Fort Railway Station',
  'Galle Face Hotel, Colombo',
  'Cinnamon Grand Colombo',
  'Shangri-La Hotel Colombo',
  'Kandy City Centre',
  'Galle Fort',
  'Sigiriya Rock Fortress',
  'Negombo Beach',
  'Ella Town',
  'Unawatuna Beach',
  'Bentota Beach',
  'Anuradhapura Ancient City',
  'Polonnaruwa Ancient City',
  'Nuwara Eliya',
  'Yala National Park',
  'Udawalawe National Park',
  'Pinnawala Elephant Orphanage',
  'Temple of the Tooth, Kandy',
  'Mount Lavinia Beach'
];

const PlacesAutocompleteInput = React.forwardRef<HTMLInputElement, PlacesAutocompleteInputProps>(
  ({ value, onChange, placeholder, readOnly, className, name, onBlur }, ref) => {
    const [showSuggestions, setShowSuggestions] = useState(false);
    const [filteredLocations, setFilteredLocations] = useState<string[]>([]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const inputValue = e.target.value;
      onChange(inputValue);

      // Filter locations based on input
      if (inputValue.length > 0) {
        const filtered = POPULAR_LOCATIONS.filter(location =>
          location.toLowerCase().includes(inputValue.toLowerCase())
        );
        setFilteredLocations(filtered);
        setShowSuggestions(true);
      } else {
        setFilteredLocations(POPULAR_LOCATIONS);
        setShowSuggestions(false);
      }
    };

    const handleLocationSelect = (location: string) => {
      onChange(location);
      setShowSuggestions(false);
    };

    const handleFocus = () => {
      setFilteredLocations(POPULAR_LOCATIONS);
      setShowSuggestions(true);
    };

    const handleBlur = (e: React.FocusEvent) => {
      // Delay hiding suggestions to allow for clicks
      setTimeout(() => {
        setShowSuggestions(false);
        onBlur();
      }, 200);
    };

    return (
      <div className="relative">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <MapPin className="h-4 w-4 text-gray-400" />
          </div>
          
          <Input
            type="text"
            name={name}
            value={value}
            onChange={handleInputChange}
            onFocus={handleFocus}
            onBlur={handleBlur}
            placeholder={placeholder || "Enter location"}
            required
            readOnly={readOnly}
            className={`pl-10 pr-10 ${className}`}
            ref={ref}
          />

          <button
            type="button"
            onClick={() => setShowSuggestions(!showSuggestions)}
            className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
          >
            <ChevronDown className="h-4 w-4" />
          </button>
        </div>

        {/* Suggestions Dropdown */}
        {showSuggestions && filteredLocations.length > 0 && (
          <div className="absolute z-50 mt-1 w-full bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-y-auto">
            <div className="p-2 text-xs font-medium text-gray-500 bg-gray-50 border-b">
              Popular Locations in Sri Lanka
            </div>
            {filteredLocations.map((location, index) => (
              <button
                key={index}
                type="button"
                onClick={() => handleLocationSelect(location)}
                className="w-full text-left px-4 py-3 hover:bg-blue-50 focus:bg-blue-50 focus:outline-none border-b border-gray-100 last:border-b-0 flex items-center gap-3"
              >
                <MapPin className="w-4 h-4 text-gray-400 flex-shrink-0" />
                <div className="min-w-0 flex-1">
                  <div className="font-medium text-gray-900 truncate">
                    {location}
                  </div>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>
    );
  }
);

PlacesAutocompleteInput.displayName = "PlacesAutocompleteInput";

export default PlacesAutocompleteInput;
