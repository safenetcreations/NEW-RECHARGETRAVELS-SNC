import React, { useState, forwardRef, useCallback, useRef, useEffect } from 'react';
import { MapPin, ChevronDown, Loader2, CheckCircle } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { useLoadScript } from '@react-google-maps/api';

interface FirebaseLocationInputProps {
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
  'Wilpattu National Park',
  'Mattala Rajapaksa International Airport (HRI)',
  'Jaffna International Airport',
  'Ratmalana Airport',
  'Hikkaduwa Beach Hotel',
  'Taj Samudra Colombo',
  'Hilton Colombo',
  'Jetwing Vil Uyana, Sigiriya',
  'Heritance Kandalama',
  'Ceylon Tea Trails',
  'Cape Weligama',
  'Amanwella, Tangalle',
  'Anantara Peace Haven Tangalle',
  'Wild Coast Tented Lodge, Yala'
];

const libraries: ("places")[] = ["places"];

const FirebaseLocationInput = forwardRef<HTMLInputElement, FirebaseLocationInputProps>(({
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
  const [googleSuggestions, setGoogleSuggestions] = useState<google.maps.places.AutocompletePrediction[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [apiStatus, setApiStatus] = useState<'loading' | 'ready' | 'error'>('loading');
  
  const autocompleteService = useRef<google.maps.places.AutocompleteService | null>(null);
  const sessionToken = useRef<google.maps.places.AutocompleteSessionToken | null>(null);

  // Load Google Maps API
  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY || '',
    libraries,
  });

  // Initialize autocomplete service when API is loaded
  useEffect(() => {
    if (isLoaded && window.google?.maps?.places) {
      try {
        autocompleteService.current = new window.google.maps.places.AutocompleteService();
        sessionToken.current = new window.google.maps.places.AutocompleteSessionToken();
        setApiStatus('ready');
        console.log('✅ Google Places API initialized successfully');
      } catch (error) {
        console.error('Failed to initialize Google Places:', error);
        setApiStatus('error');
      }
    } else if (loadError) {
      console.error('Google Maps load error:', loadError);
      setApiStatus('error');
    }
  }, [isLoaded, loadError]);

  // Search using Google Places Autocomplete
  const searchGooglePlaces = useCallback((query: string) => {
    if (query.length < 2 || !autocompleteService.current || apiStatus !== 'ready') {
      setGoogleSuggestions([]);
      return;
    }

    setIsSearching(true);

    const request = {
      input: query,
      componentRestrictions: { country: 'lk' },
      sessionToken: sessionToken.current!,
      types: ['establishment', 'geocode', 'airport', 'train_station', 'lodging']
    };

    autocompleteService.current.getPlacePredictions(request, (predictions, status) => {
      setIsSearching(false);
      
      if (status === google.maps.places.PlacesServiceStatus.OK && predictions) {
        setGoogleSuggestions(predictions.slice(0, 5));
        console.log(`Found ${predictions.length} Google Places suggestions for "${query}"`);
      } else {
        console.warn('Google Places API status:', status);
        setGoogleSuggestions([]);
        if (status === 'REQUEST_DENIED' || status === 'INVALID_REQUEST') {
          setApiStatus('error');
        }
      }
    });
  }, [apiStatus]);

  // Debounced search
  const searchTimeoutRef = useRef<NodeJS.Timeout>();
  
  const debouncedSearch = useCallback((query: string) => {
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }
    
    searchTimeoutRef.current = setTimeout(() => {
      searchGooglePlaces(query);
    }, 300);
  }, [searchGooglePlaces]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;
    onChange(inputValue);

    if (inputValue.length > 0) {
      // Filter static locations immediately
      const filtered = POPULAR_LOCATIONS.filter(location =>
        location.toLowerCase().includes(inputValue.toLowerCase())
      );
      setFilteredLocations(filtered.slice(0, 8));
      
      // Debounced Google Places search
      debouncedSearch(inputValue);
      
      setShowSuggestions(true);
    } else {
      setFilteredLocations(POPULAR_LOCATIONS.slice(0, 8));
      setGoogleSuggestions([]);
      setShowSuggestions(false);
    }
  };

  const handleLocationSelect = (location: string) => {
    onChange(location);
    setShowSuggestions(false);
    setGoogleSuggestions([]);
    // Create new session token for next search
    if (window.google?.maps?.places) {
      sessionToken.current = new window.google.maps.places.AutocompleteSessionToken();
    }
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

  // Get status icon
  const getStatusIcon = () => {
    if (isSearching) return <Loader2 className="h-4 w-4 animate-spin" />;
    if (apiStatus === 'ready' && !loadError) return <CheckCircle className="h-4 w-4 text-green-500" />;
    return <ChevronDown className={`h-4 w-4 transition-transform ${showSuggestions ? 'rotate-180' : ''}`} />;
  };

  const hasGoogleAPI = apiStatus === 'ready' && !loadError;
  const totalSuggestions = googleSuggestions.length + filteredLocations.length;

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
              title={hasGoogleAPI ? 'Google Places connected' : 'Using local suggestions'}
            >
              {getStatusIcon()}
            </button>
          )}
        </div>

        {/* Suggestions Dropdown */}
        {showSuggestions && totalSuggestions > 0 && !readOnly && (
          <div className="absolute z-50 mt-1 w-full bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-y-auto">
            {/* Google Suggestions */}
            {googleSuggestions.length > 0 && (
              <>
                <div className="p-2 text-xs font-medium text-green-600 bg-green-50 border-b sticky top-0 backdrop-blur-sm bg-opacity-90">
                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-1">
                      <CheckCircle className="h-3 w-3" />
                      Google Places Results
                    </span>
                    <span className="text-green-500">({googleSuggestions.length})</span>
                  </div>
                </div>
                {googleSuggestions.map((prediction, index) => (
                  <button
                    key={`google-${prediction.place_id}`}
                    type="button"
                    onClick={() => handleLocationSelect(prediction.description)}
                    className="w-full text-left px-4 py-3 hover:bg-green-50 focus:bg-green-50 focus:outline-none border-b border-gray-100 flex items-center gap-3 transition-colors"
                  >
                    <MapPin className="w-4 h-4 text-green-500 flex-shrink-0" />
                    <div className="min-w-0 flex-1">
                      <div className="text-sm font-medium text-gray-900">
                        {prediction.structured_formatting?.main_text || prediction.description}
                      </div>
                      {prediction.structured_formatting?.secondary_text && (
                        <div className="text-xs text-gray-500">
                          {prediction.structured_formatting.secondary_text}
                        </div>
                      )}
                    </div>
                  </button>
                ))}
              </>
            )}
            
            {/* Popular Locations */}
            {filteredLocations.length > 0 && (
              <>
                <div className="p-2 text-xs font-medium text-blue-600 bg-blue-50 border-b sticky top-0 backdrop-blur-sm bg-opacity-90">
                  <div className="flex items-center justify-between">
                    <span>🏝️ Popular Sri Lankan Locations</span>
                    <span className="text-blue-500">({filteredLocations.length})</span>
                  </div>
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
                      <div className="text-sm font-medium text-gray-900">
                        {location}
                      </div>
                    </div>
                  </button>
                ))}
              </>
            )}

            {/* Loading indicator */}
            {isSearching && googleSuggestions.length === 0 && (
              <div className="p-4 text-center text-sm text-gray-500">
                <Loader2 className="h-4 w-4 animate-spin inline mr-2" />
                Searching Google Places...
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
});

FirebaseLocationInput.displayName = "FirebaseLocationInput";

export default FirebaseLocationInput;