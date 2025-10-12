
import { useState, useEffect } from 'react';
import { dbService, authService, storageService } from '@/lib/firebase-services';

export const useApiKeys = () => {
  const [mapsApiKey, setMapsApiKey] = useState<string | null>(null);
  const [geminiApiKey, setGeminiApiKey] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [mapError, setMapError] = useState<string | null>(null);

  useEffect(() => {
    const fetchApiKeys = async () => {
      try {
        console.log('Fetching API keys from Supabase...');
        
        // Fetch Google Maps API key
        const { data: mapsData, error: mapsError } = await supabase.functions.invoke('secure-maps-api', {
          body: { action: 'get_api_key' }
        });
        
        if (mapsError) {
          console.error('Error fetching Maps API key:', mapsError);
          setMapError(`Failed to load Maps API key: ${mapsError.message}`);
        } else if (mapsData && mapsData.api_key) {
          console.log('Maps API key fetched successfully');
          setMapsApiKey(mapsData.api_key);
          // Store globally for other components
          (window as any).googleMapsApiKey = mapsData.api_key;
        } else {
          console.error('No Maps API key returned from function');
          setMapError('Maps API key not configured in Supabase');
        }

        // Fetch Gemini API key
        try {
          const { data: geminiData, error: geminiError } = await supabase.functions.invoke('secure-maps-api', {
            body: { action: 'get_gemini_key' }
          });
          
          if (geminiError) {
            console.warn('Error fetching Gemini API key:', geminiError);
          } else if (geminiData && geminiData.api_key) {
            console.log('Gemini API key fetched successfully');
            setGeminiApiKey(geminiData.api_key);
          }
        } catch (geminiErr) {
          console.warn('Gemini API key fetch failed:', geminiErr);
        }
      } catch (error) {
        console.error('Error in fetchApiKeys:', error);
        setMapError(`Failed to initialize API keys: ${error instanceof Error ? error.message : 'Unknown error'}`);
      } finally {
        setIsLoading(false);
      }
    };

    fetchApiKeys();
  }, []);

  return { mapsApiKey, geminiApiKey, isLoading, mapError };
};
