import React, { useState, forwardRef, useCallback, useRef, useEffect } from 'react';
import { MapPin, ChevronDown, Loader2, AlertCircle } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { googlePlacesService } from '@/services/googlePlacesService';
import { useLoadScript } from '@react-google-maps/api';
import { toast } from 'sonner';

interface EnhancedLocationInputProps {
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

const EnhancedLocationInput = forwardRef<HTMLInputElement, EnhancedLocationInputProps>(({
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
  const [isLoading, setIsLoading] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);
  
  const autocompleteService = useRef<google.maps.places.AutocompleteService | null>(null);
  const sessionToken = useRef<google.maps.places.AutocompleteSessionToken | null>(null);

  // Load Google Maps API
  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY || '',
    libraries,
  });

  // Initialize autocomplete service when API is loaded
  useEffect(() => {
    if (isLoaded && window.google && window.google.maps && window.google.maps.places) {
      autocompleteService.current = new window.google.maps.places.AutocompleteService();
      sessionToken.current = new window.google.maps.places.AutocompleteSessionToken();
    }
  }, [isLoaded]);

  // Search using Google Places Autocomplete
  const searchGooglePlaces = useCallback(async (query: string) => {
    if (query.length < 2) {
      setGoogleSuggestions([]);
      return;
    }

    setIsLoading(true);
    setApiError(null);

    try {
      // Try using the loaded Google Maps API first
      if (autocompleteService.current) {
        const request = {
          input: query,
          componentRestrictions: { country: 'lk' },
          sessionToken: sessionToken.current!,
          types: ['establishment', 'geocode']
        };

        autocompleteService.current.getPlacePredictions(request, (predictions, status) => {
          if (status === google.maps.places.PlacesServiceStatus.OK && predictions) {
            setGoogleSuggestions(predictions.slice(0, 5));
            console.log('✅ Google Places API working - Found', predictions.length, 'suggestions');
          } else {
            console.warn('Google Places API status:', status);
            setGoogleSuggestions([]);
            if (status === 'REQUEST_DENIED') {
              setApiError('Google Places API access denied. Using local suggestions only.');
            }
          }
          setIsLoading(false);
        });
      } else {
        // Fallback to Supabase Edge Function
        console.log('Trying Supabase Edge Function for Places API...');
        const response = await googlePlacesService.autocomplete({
          input: query,
          types: 'establishment',
          componentRestrictions: { country: 'lk' }
        }) as any;

        if (response?.status === 'OK' && response?.predictions) {
          const predictions = response.predictions.slice(0, 5);
          setGoogleSuggestions(predictions);
          console.log('✅ Supabase Edge Function working - Found', predictions.length, 'suggestions');
        } else {
          setGoogleSuggestions([]);
          if (response?.status === 'REQUEST_DENIED') {
            setApiError('API access denied. Please check API key configuration.');
          }
        }
        setIsLoading(false);
      }
    } catch (error) {
      console.error('Google Places API error:', error);
      setGoogleSuggestions([]);
      setApiError('Unable to fetch Google suggestions. Using local suggestions.');
      setIsLoading(false);
    }
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;
    onChange(inputValue);

    if (inputValue.length > 0) {
      // Filter static locations
      const filtered = POPULAR_LOCATIONS.filter(location =>
        location.toLowerCase().includes(inputValue.toLowerCase())
      );
      setFilteredLocations(filtered.slice(0, 8));
      
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
    onChange(location);
    setShowSuggestions(false);
    setGoogleSuggestions([]);
    // Reset session token for new search
    if (sessionToken.current && window.google && window.google.maps && window.google.maps.places) {
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

  // Show API status in development
  useEffect(() => {
    if (loadError) {
      console.error('Google Maps load error:', loadError);
      toast.error('Google Maps failed to load. Using local suggestions only.');
    }
  }, [loadError]);

  const googleSuggestionsFormatted = googleSuggestions.map(prediction => ({
    description: prediction.description,
    placeId: prediction.place_id
  }));

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
              {isLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <ChevronDown className={`h-4 w-4 transition-transform ${showSuggestions ? 'rotate-180' : ''}`} />
              )}
            </button>
          )}
        </div>

        {/* API Status (only show if there's an error) */}
        {apiError && (
          <div className="flex items-center gap-1 text-xs text-amber-600 mt-1">
            <AlertCircle className="h-3 w-3" />
            <span>{apiError}</span>
          </div>
        )}

        {/* Suggestions Dropdown */}
        {showSuggestions && (filteredLocations.length > 0 || googleSuggestionsFormatted.length > 0) && !readOnly && (
          <div className="absolute z-50 mt-1 w-full bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-y-auto">
            {/* Google Suggestions */}
            {googleSuggestionsFormatted.length > 0 && (
              <>
                <div className="p-2 text-xs font-medium text-green-600 bg-green-50 border-b sticky top-0">
                  <div className="flex items-center justify-between">
                    <span>🌍 Google Places Results</span>
                    <span className="text-green-500">({googleSuggestionsFormatted.length})</span>
                  </div>
                </div>
                {googleSuggestionsFormatted.map((suggestion, index) => (
                  <button
                    key={`google-${index}`}
                    type="button"
                    onClick={() => handleLocationSelect(suggestion.description)}
                    className="w-full text-left px-4 py-3 hover:bg-green-50 focus:bg-green-50 focus:outline-none border-b border-gray-100 flex items-center gap-3 transition-colors"
                  >
                    <MapPin className="w-4 h-4 text-green-500 flex-shrink-0" />
                    <div className="min-w-0 flex-1">
                      <div className="text-sm font-medium text-gray-900">
                        {suggestion.description}
                      </div>
                    </div>
                  </button>
                ))}
              </>
            )}
            
            {/* Popular Locations */}
            {filteredLocations.length > 0 && (
              <>
                <div className="p-2 text-xs font-medium text-blue-600 bg-blue-50 border-b sticky top-0">
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
          </div>
        )}
      </div>
    </div>
  );
});

EnhancedLocationInput.displayName = "EnhancedLocationInput";

export default EnhancedLocationInput;