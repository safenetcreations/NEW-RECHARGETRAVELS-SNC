
import React, { useState, forwardRef, useEffect } from 'react';
import { MapPin, ChevronDown } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { googlePlacesService } from '@/services/googlePlacesService';

interface SimpleLocationInputProps {
  value: string;
  onChange: (value: string) => void;
  onBlur?: () => void;
  placeholder?: string;
  readOnly?: boolean;
  className?: string;
  label?: string;
  name?: string;
}

// Popular Sri Lankan locations
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
  'Mount Lavinia Beach',
  'Mirissa Beach',
  'Hikkaduwa Beach',
  'Arugam Bay',
  'Dambulla Cave Temple',
  'Adams Peak (Sri Pada)',
  'Horton Plains National Park',
  'Minneriya National Park',
  'Wilpattu National Park'
];

const SimpleLocationInput = forwardRef<HTMLInputElement, SimpleLocationInputProps>(({
  value,
  onChange,
  onBlur,
  placeholder = "Enter location",
  readOnly = false,
  className = "",
  label,
  name
}, ref) => {
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [filteredLocations, setFilteredLocations] = useState<string[]>([]);
  const [googleSuggestions, setGoogleSuggestions] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [apiStatus, setApiStatus] = useState<'ready' | 'error' | 'loading'>('ready');

  const searchGooglePlaces = async (query: string) => {
    if (query.length < 2) {
      setGoogleSuggestions([]);
      return;
    }

    setIsLoading(true);
    try {
      console.log('🔍 Searching Google Places for:', query);
      
      const response = await googlePlacesService.autocomplete({
        input: query,
        types: 'establishment',
        componentRestrictions: { country: 'lk' }
      }) as any;

      if (response?.status === 'OK' && response?.predictions) {
        const suggestions = response.predictions.slice(0, 5).map((prediction: any) => 
          prediction.description
        );
        setGoogleSuggestions(suggestions);
        setApiStatus('ready');
        console.log('✅ Google suggestions updated:', suggestions);
      } else {
        console.log('⚠️ Google Places API response:', response?.status);
        setGoogleSuggestions([]);
        if (response?.status === 'REQUEST_DENIED') {
          setApiStatus('error');
        }
      }
    } catch (error) {
      console.error('❌ Google Places API error:', error);
      setGoogleSuggestions([]);
      setApiStatus('error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;
    console.log('📝 Input changed:', inputValue);
    onChange(inputValue);

    if (inputValue.length > 0) {
      // Filter static locations
      const filtered = POPULAR_LOCATIONS.filter(location =>
        location.toLowerCase().includes(inputValue.toLowerCase())
      );
      setFilteredLocations(filtered.slice(0, 5));
      
      // Search Google Places
      searchGooglePlaces(inputValue);
      
      setShowSuggestions(true);
    } else {
      setFilteredLocations(POPULAR_LOCATIONS.slice(0, 8));
      setGoogleSuggestions([]);
      setShowSuggestions(false);
    }
  };

  const handleLocationSelect = (location: string) => {
    console.log('📍 Location selected:', location);
    onChange(location);
    setShowSuggestions(false);
    setGoogleSuggestions([]);
  };

  const handleFocus = () => {
    if (!readOnly) {
      setFilteredLocations(POPULAR_LOCATIONS.slice(0, 8));
      setShowSuggestions(true);
    }
  };

  const handleBlur = () => {
    // Delay hiding to allow for clicks
    setTimeout(() => {
      setShowSuggestions(false);
      setGoogleSuggestions([]);
      onBlur?.();
    }, 200);
  };

  const toggleSuggestions = () => {
    if (!readOnly) {
      if (showSuggestions) {
        setShowSuggestions(false);
        setGoogleSuggestions([]);
      } else {
        setFilteredLocations(POPULAR_LOCATIONS.slice(0, 8));
        setShowSuggestions(true);
      }
    }
  };

  // Status indicator text
  const getStatusText = () => {
    if (isLoading) {
      return '🔄 Searching Google Places...';
    }
    
    switch (apiStatus) {
      case 'ready':
        return `✅ Google Places Ready | Results: ${googleSuggestions.length} Google + ${filteredLocations.length} Local`;
      case 'error':
        return '❌ Google Places Error | Using local suggestions only';
      default:
        return '';
    }
  };

  // Combine Google suggestions and filtered locations
  const allSuggestions = [...googleSuggestions, ...filteredLocations];
  const hasGoogleSuggestions = googleSuggestions.length > 0;

  return (
    <div className="space-y-2">
      {label && (
        <label className="block text-sm font-medium text-gray-700">
          {label}
        </label>
      )}
      
      <div className="relative">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <MapPin className="h-4 w-4 text-gray-400" />
          </div>
          
          <Input
            ref={ref}
            type="text"
            name={name}
            value={value}
            onChange={handleInputChange}
            onFocus={handleFocus}
            onBlur={handleBlur}
            placeholder={placeholder}
            readOnly={readOnly}
            className={`pl-10 pr-10 ${className} ${readOnly ? 'bg-gray-100' : ''}`}
          />

          {!readOnly && (
            <button
              type="button"
              onClick={toggleSuggestions}
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
            >
              <ChevronDown className={`h-4 w-4 transition-transform ${showSuggestions ? 'rotate-180' : ''}`} />
            </button>
          )}
        </div>

        {/* Status indicator */}
        <div className="text-xs text-gray-500 mt-1 bg-gray-50 p-1 rounded">
          {getStatusText()}
        </div>

        {/* Suggestions Dropdown */}
        {showSuggestions && allSuggestions.length > 0 && !readOnly && (
          <div className="absolute z-50 mt-1 w-full bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-y-auto">
            {hasGoogleSuggestions && (
              <>
                <div className="p-2 text-xs font-medium text-green-600 bg-green-50 border-b">
                  🌍 Google Places Results ({googleSuggestions.length})
                </div>
                {googleSuggestions.map((location, index) => (
                  <button
                    key={`google-${index}`}
                    type="button"
                    onClick={() => handleLocationSelect(location)}
                    className="w-full text-left px-4 py-3 hover:bg-green-50 focus:bg-green-50 focus:outline-none border-b border-gray-100 flex items-center gap-3 transition-colors"
                  >
                    <MapPin className="w-4 h-4 text-green-500 flex-shrink-0" />
                    <div className="min-w-0 flex-1">
                      <div className="text-sm font-medium text-gray-900 truncate">
                        {location}
                      </div>
                    </div>
                  </button>
                ))}
              </>
            )}
            
            {filteredLocations.length > 0 && (
              <>
                <div className="p-2 text-xs font-medium text-blue-600 bg-blue-50 border-b">
                  🏝️ Popular Sri Lankan Locations ({filteredLocations.length})
                </div>
                {filteredLocations.map((location, index) => (
                  <button
                    key={`popular-${index}`}
                    type="button"
                    onClick={() => handleLocationSelect(location)}
                    className="w-full text-left px-4 py-3 hover:bg-blue-50 focus:bg-blue-50 focus:outline-none border-b border-gray-100 last:border-b-0 flex items-center gap-3 transition-colors"
                  >
                    <MapPin className="w-4 h-4 text-blue-500 flex-shrink-0" />
                    <div className="min-w-0 flex-1">
                      <div className="text-sm font-medium text-gray-900 truncate">
                        {location}
                      </div>
                    </div>
                  </button>
                ))}
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
});

SimpleLocationInput.displayName = "SimpleLocationInput";

export default SimpleLocationInput;
