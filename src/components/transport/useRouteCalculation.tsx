
import { useState, useEffect } from 'react';

interface RouteDetails {
  distance: string;
  duration: string;
}

export const useRouteCalculation = (pickupLocation: string, dropoffLocation: string) => {
  const [directions, setDirections] = useState<google.maps.DirectionsResult | null>(null);
  const [routeDetails, setRouteDetails] = useState<RouteDetails>({ distance: '', duration: '' });
  const [routeQuery, setRouteQuery] = useState<{ pickup: string, dropoff: string } | null>(null);

  useEffect(() => {
    if (pickupLocation && dropoffLocation && pickupLocation !== dropoffLocation) {
      setRouteQuery({ pickup: pickupLocation, dropoff: dropoffLocation });
    }
  }, [pickupLocation, dropoffLocation]);

  const directionsCallback = (
    response: google.maps.DirectionsResult | null,
    status: google.maps.DirectionsStatus
  ) => {
    if (status === 'OK' && response) {
      setDirections(response);
      const route = response.routes[0]?.legs[0];
      if (route?.distance?.text && route?.duration?.text) {
        setRouteDetails({ distance: route.distance.text, duration: route.duration.text });
      }
    } else {
      setDirections(null);
      setRouteDetails({ distance: '', duration: '' });
    }
    setRouteQuery(null);
  };

  return {
    directions,
    routeDetails,
    routeQuery,
    directionsCallback
  };
};
