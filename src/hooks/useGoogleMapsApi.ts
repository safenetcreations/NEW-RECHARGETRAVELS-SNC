
import { useState, useEffect } from 'react';
import { dbService, authService, storageService } from '@/lib/firebase-services';
import { getEffectiveApiKey } from '../lib/googleMapsConfig';

export const useGoogleMapsApi = () => {
  const [apiKey, setApiKey] = useState<string | null>(getEffectiveApiKey());
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchApiKey = async () => {
      try {
        // First check if we already have a client-side key
        const clientKey = getEffectiveApiKey();
        if (clientKey) {
          setApiKey(clientKey);
          setIsLoading(false);
          return;
        }

        console.log('Fetching Google Maps API key from server...');
        
        // Fetch from Supabase function
        const { data, error: fetchError } = await supabase.functions.invoke('secure-maps-api', {
          body: { action: 'get_api_key' }
        });
        
        if (fetchError) {
          console.error('Error fetching Maps API key:', fetchError);
          setError('Failed to load Maps API key');
        } else if (data && data.api_key) {
          console.log('Maps API key fetched successfully');
          setApiKey(data.api_key);
          // Store globally for other components
          window.googleMapsApiKey = data.api_key;
        } else {
          console.error('No Maps API key returned');
          setError('Maps API key not configured');
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
