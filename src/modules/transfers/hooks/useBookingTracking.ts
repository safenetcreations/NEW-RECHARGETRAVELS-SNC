
import { useState, useEffect } from 'react';
import { TrackingData } from '../types';

export const useBookingTracking = (bookingNumber: string) => {
  const [trackingData, setTrackingData] = useState<TrackingData | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!bookingNumber) return;

    // Mock tracking data for now
    const mockTrackingData: TrackingData = {
      id: 'track-1',
      bookingId: bookingNumber,
      driverId: 'driver-1',
      latitude: 6.9271,
      longitude: 79.8612,
      heading: 45,
      speed: 60,
      accuracy: 10,
      timestamp: new Date()
    };

    setTrackingData(mockTrackingData);
    setIsConnected(true);
    setError(null);
  }, [bookingNumber]);

  return {
    trackingData,
    isConnected,
    error
  };
};
