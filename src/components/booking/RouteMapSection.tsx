
import { Textarea } from '@/components/ui/textarea';
import GoogleMapComponent from '../GoogleMap';
import RouteInfo from '../RouteInfo';
import type { EnhancedWildlifeLocation } from '@/data/enhancedWildlifeData';
import { EnhancedBookingFormData } from './types';

interface RouteMapSectionProps {
  formData: EnhancedBookingFormData;
  onInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
  selectedMapLocation: EnhancedWildlifeLocation | null;
  onSelectLocation: (location: EnhancedWildlifeLocation | null) => void;
  type: 'tour' | 'transport' | 'custom';
  directions?: google.maps.DirectionsResult | null;
  routeDetails?: { distance: string; duration: string };
}

const RouteMapSection = ({ 
  formData, 
  onInputChange, 
  selectedMapLocation, 
  onSelectLocation, 
  type,
  directions,
  routeDetails 
}: RouteMapSectionProps) => {
  return (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold">
        {type === 'transport' ? 'Route Preview & Final Details' : 'Route Planning'}
      </h3>
      
      {/* Route visualization for transport */}
      {type === 'transport' && routeDetails && (routeDetails.distance || routeDetails.duration) && (
        <div className="space-y-4">
          <RouteInfo distance={routeDetails.distance} duration={routeDetails.duration} />
          <div className="rounded-lg overflow-hidden border">
            <GoogleMapComponent
              height="300px"
              selectedLocation={null}
              onSelectLocation={() => {}}
              directions={directions}
              center={{ lat: 7.8731, lng: 80.7718 }}
              zoom={8}
            />
          </div>
        </div>
      )}
      
      {/* Map for custom tours */}
      {type === 'custom' && (
        <GoogleMapComponent
          height="300px"
          selectedLocation={selectedMapLocation}
          onSelectLocation={onSelectLocation}
        />
      )}
      
      <div>
        <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
          {type === 'transport' ? 'Special Requests' : 'Special Requests & Additional Information'}
        </label>
        <Textarea
          id="message"
          name="message"
          value={formData.message}
          onChange={onInputChange}
          rows={4}
          placeholder={
            type === 'transport' 
              ? "Child seats, wheelchair accessibility, stops along the way, etc."
              : "Tell us about any special requirements, dietary restrictions, accessibility needs, or specific places you'd like to visit..."
          }
        />
      </div>
    </div>
  );
};

export default RouteMapSection;
