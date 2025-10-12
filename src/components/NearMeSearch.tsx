import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Slider } from '@/components/ui/slider';
import { 
  MapPin, Navigation, Loader2, Search, 
  Car, Hotel, Plane, Coffee, Camera,
  AlertCircle
} from 'lucide-react';
import { toast } from 'sonner';

interface Location {
  id: string;
  name: string;
  type: string;
  distance_meters: number;
  lat: number;
  lng: number;
}

interface NearMeSearchProps {
  onLocationSelect?: (location: Location) => void;
}

const NearMeSearch = ({ onLocationSelect }: NearMeSearchProps) => {
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [nearbyLocations, setNearbyLocations] = useState<Location[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [locationError, setLocationError] = useState<string | null>(null);
  const [radius, setRadius] = useState(5000); // 5km default
  const [selectedType, setSelectedType] = useState<string | null>(null);

  const locationTypes = [
    { value: 'airport', label: 'Airports', icon: Plane },
    { value: 'hotel', label: 'Hotels', icon: Hotel },
    { value: 'city', label: 'Cities', icon: MapPin },
    { value: 'attraction', label: 'Attractions', icon: Camera },
    { value: 'train_station', label: 'Train Stations', icon: Car },
  ];

  const typeIcons: Record<string, any> = {
    airport: Plane,
    hotel: Hotel,
    city: MapPin,
    attraction: Camera,
    train_station: Car,
    bus_station: Car,
  };

  useEffect(() => {
    // Request location on component mount
    requestUserLocation();
  }, []);

  const requestUserLocation = () => {
    setIsLoading(true);
    setLocationError(null);

    if (!navigator.geolocation) {
      setLocationError('Geolocation is not supported by your browser');
      setIsLoading(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setUserLocation({ lat: latitude, lng: longitude });
        setIsLoading(false);
        // Automatically search when location is obtained
        searchNearbyLocations(latitude, longitude);
      },
      (error) => {
        setIsLoading(false);
        switch (error.code) {
          case error.PERMISSION_DENIED:
            setLocationError('Location permission denied. Please enable location access.');
            break;
          case error.POSITION_UNAVAILABLE:
            setLocationError('Location information unavailable.');
            break;
          case error.TIMEOUT:
            setLocationError('Location request timed out.');
            break;
          default:
            setLocationError('An unknown error occurred.');
        }
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0
      }
    );
  };

  const searchNearbyLocations = async (lat?: number, lng?: number) => {
    if (!userLocation && (!lat || !lng)) {
      toast.error('Please enable location access first');
      return;
    }

    const searchLat = lat || userLocation!.lat;
    const searchLng = lng || userLocation!.lng;

    setIsLoading(true);
    try {
      const params = new URLSearchParams({
        lat: searchLat.toString(),
        lng: searchLng.toString(),
        radius: radius.toString(),
        ...(selectedType && { type: selectedType })
      });

      const response = await fetch(`/api/v1/search?${params}`);
      const data = await response.json();

      if (data.results) {
        setNearbyLocations(data.results);
        if (data.results.length === 0) {
          toast.info('No locations found within the selected radius');
        }
      }
    } catch (error) {
      console.error('Search error:', error);
      toast.error('Failed to search nearby locations');
    } finally {
      setIsLoading(false);
    }
  };

  const formatDistance = (meters: number): string => {
    if (meters < 1000) {
      return `${Math.round(meters)}m`;
    }
    return `${(meters / 1000).toFixed(1)}km`;
  };

  const getDirections = (location: Location) => {
    if (!userLocation) return;
    
    // Open Google Maps with directions
    const url = `https://www.google.com/maps/dir/?api=1&origin=${userLocation.lat},${userLocation.lng}&destination=${location.lat},${location.lng}&travelmode=driving`;
    window.open(url, '_blank');
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Navigation className="w-5 h-5" />
          Find Locations Near Me
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Location Status */}
        <div className="p-4 bg-gray-50 rounded-lg">
          {locationError ? (
            <div className="flex items-center gap-2 text-red-600">
              <AlertCircle className="w-5 h-5" />
              <span className="text-sm">{locationError}</span>
            </div>
          ) : userLocation ? (
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-green-600">
                <MapPin className="w-5 h-5" />
                <span className="text-sm">Location detected</span>
              </div>
              <Button 
                size="sm" 
                variant="outline"
                onClick={() => searchNearbyLocations()}
              >
                <Search className="w-4 h-4 mr-2" />
                Refresh
              </Button>
            </div>
          ) : (
            <div className="text-center">
              <Button onClick={requestUserLocation} disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Getting location...
                  </>
                ) : (
                  <>
                    <MapPin className="w-4 h-4 mr-2" />
                    Enable Location
                  </>
                )}
              </Button>
            </div>
          )}
        </div>

        {/* Search Controls */}
        {userLocation && (
          <>
            {/* Radius Slider */}
            <div>
              <label className="text-sm font-medium mb-2 block">
                Search Radius: {(radius / 1000).toFixed(1)}km
              </label>
              <Slider
                value={[radius]}
                onValueChange={(value) => setRadius(value[0])}
                min={1000}
                max={20000}
                step={1000}
                className="mb-2"
              />
              <div className="flex justify-between text-xs text-gray-500">
                <span>1km</span>
                <span>20km</span>
              </div>
            </div>

            {/* Location Type Filter */}
            <div>
              <label className="text-sm font-medium mb-2 block">
                Filter by Type
              </label>
              <div className="flex flex-wrap gap-2">
                <Button
                  size="sm"
                  variant={selectedType === null ? "default" : "outline"}
                  onClick={() => setSelectedType(null)}
                >
                  All Types
                </Button>
                {locationTypes.map(type => {
                  const Icon = type.icon;
                  return (
                    <Button
                      key={type.value}
                      size="sm"
                      variant={selectedType === type.value ? "default" : "outline"}
                      onClick={() => setSelectedType(type.value)}
                    >
                      <Icon className="w-4 h-4 mr-1" />
                      {type.label}
                    </Button>
                  );
                })}
              </div>
            </div>

            {/* Search Button */}
            <Button 
              className="w-full" 
              onClick={() => searchNearbyLocations()}
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Searching...
                </>
              ) : (
                <>
                  <Search className="w-4 h-4 mr-2" />
                  Search Nearby Locations
                </>
              )}
            </Button>
          </>
        )}

        {/* Results */}
        {nearbyLocations.length > 0 && (
          <div className="space-y-2 max-h-96 overflow-y-auto">
            <p className="text-sm text-gray-600 mb-2">
              Found {nearbyLocations.length} locations
            </p>
            {nearbyLocations.map((location) => {
              const Icon = typeIcons[location.type] || MapPin;
              return (
                <div
                  key={location.id}
                  className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Icon className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <h4 className="font-medium">{location.name}</h4>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge variant="secondary" className="text-xs">
                          {location.type}
                        </Badge>
                        <span className="text-sm text-gray-500">
                          {formatDistance(location.distance_meters)} away
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => getDirections(location)}
                    >
                      <Navigation className="w-4 h-4" />
                    </Button>
                    {onLocationSelect && (
                      <Button
                        size="sm"
                        onClick={() => onLocationSelect(location)}
                      >
                        Select
                      </Button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default NearMeSearch;