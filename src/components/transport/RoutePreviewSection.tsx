
import RouteInfo from '../RouteInfo';
import GoogleMapComponent from '../GoogleMap';

interface RoutePreviewSectionProps {
  routeDetails: { distance: string; duration: string };
  directions: google.maps.DirectionsResult | null;
}

const RoutePreviewSection = ({ routeDetails, directions }: RoutePreviewSectionProps) => {
  if (!routeDetails.distance && !routeDetails.duration) {
    return null;
  }

  return (
    <div className="border-t pt-6">
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
    </div>
  );
};

export default RoutePreviewSection;
