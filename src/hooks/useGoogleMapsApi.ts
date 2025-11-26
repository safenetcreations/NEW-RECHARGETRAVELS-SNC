
import { useState, useEffect } from 'react';
import { dbService, authService, storageService } from '@/lib/firebase-services';
import { getEffectiveApiKey } from '../lib/googleMapsConfig';

export const useGoogleMapsApi = () => {
  const [apiKey, setApiKey] = useState<string | null>(getEffectiveApiKey());
  const [isLoading, setIsLoading] = useState(!getEffectiveApiKey());
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchApiKey = async () => {
      try {
        // First check if we already have a client-side key
        const clientKey = getEffectiveApiKey();
        if (clientKey) {
          setApiKey(clientKey);
        } else {
          console.log('No Google Maps API key found in environment variables.');
          // In a real app, you might fetch from a backend here.
          // For now, we'll just proceed without a key (falling back to Leaflet)
        }
      } catch (error) {
        console.error('Error in fetchApiKey:', error);
        setError('Failed to initialize Maps API');
      } finally {
        setIsLoading(false);
      }
    };

    fetchApiKey();
  }, []);

  return { apiKey, isLoading, error };
};
