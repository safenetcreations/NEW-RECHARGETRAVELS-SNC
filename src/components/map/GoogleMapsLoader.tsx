
import React, { useEffect, useState } from 'react';

interface GoogleMapsLoaderProps {
  children: React.ReactNode;
  onLoad?: () => void;
  onError?: (error: string) => void;
  apiKey: string | null;
}

export const GoogleMapsLoader: React.FC<GoogleMapsLoaderProps> = ({ 
  children, 
  onLoad, 
  onError,
  apiKey 
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadGoogleMaps = async () => {
      if (!apiKey) {
        const errorMsg = 'Google Maps API key not available';
        console.error(errorMsg);
        setError(errorMsg);
        setIsLoading(false);
        onError?.(errorMsg);
        return;
      }

      // Check if Google Maps is already loaded
      if ((window as any).google && (window as any).google.maps) {
        console.log('Google Maps already available');
        setIsLoaded(true);
        setIsLoading(false);
        onLoad?.();
        return;
      }

      try {
        console.log('Loading Google Maps script with API key...');
        
        // Remove existing scripts
        const existingScripts = document.querySelectorAll('script[src*="maps.googleapis.com"]');
        existingScripts.forEach(script => {
          console.log('Removing existing Google Maps script');
          script.remove();
        });

        // Load Google Maps script
        const script = document.createElement('script');
        script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places&v=weekly`;
        script.async = true;
        script.defer = true;

        console.log('Loading script from:', script.src);

        const loadPromise = new Promise<void>((resolve, reject) => {
          const timeout = setTimeout(() => {
            reject(new Error('Google Maps loading timeout (15s)'));
          }, 15000);

          script.onload = () => {
            clearTimeout(timeout);
            console.log('Google Maps script loaded successfully');
            
            // Wait for Google Maps to be fully available
            const checkReady = () => {
              if ((window as any).google && (window as any).google.maps) {
                console.log('Google Maps API is ready');
                resolve();
              } else {
                setTimeout(checkReady, 100);
              }
            };
            checkReady();
          };

          script.onerror = (event) => {
            clearTimeout(timeout);
            console.error('Failed to load Google Maps script:', event);
            reject(new Error('Failed to load Google Maps script - check API key and billing'));
          };
        });

        document.head.appendChild(script);
        await loadPromise;

        setIsLoaded(true);
        setIsLoading(false);
        onLoad?.();

      } catch (error) {
        console.error('Error loading Google Maps:', error);
        const errorMsg = error instanceof Error ? error.message : 'Failed to load Google Maps';
        setError(errorMsg);
        setIsLoading(false);
        onError?.(errorMsg);
      }
    };

    if (apiKey) {
      loadGoogleMaps();
    } else {
      setIsLoading(false);
      setError('Waiting for API key...');
    }
  }, [apiKey, onLoad, onError]);

  if (error && apiKey) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-gray-100 rounded-lg">
        <div className="text-center p-6">
          <div className="text-red-600 mb-4 text-xl">⚠️ Map Loading Error</div>
          <div className="text-sm text-gray-700 mb-4">{error}</div>
          <div className="text-xs text-gray-600 bg-gray-50 p-3 rounded">
            <p className="font-semibold mb-2">Common fixes:</p>
            <ul className="text-left space-y-1">
              <li>• Check your Google Maps API key in Supabase</li>
              <li>• Verify Maps JavaScript API is enabled</li>
              <li>• Check domain restrictions</li>
              <li>• Ensure billing is set up</li>
              <li>• Check browser console for detailed errors</li>
            </ul>
          </div>
        </div>
      </div>
    );
  }

  if (isLoading || !isLoaded) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-gray-100 rounded-lg">
        <div className="text-center p-6">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <div className="text-gray-700 font-medium">Loading Google Maps...</div>
          <div className="text-sm text-gray-600 mt-2">
            {!apiKey ? 'Fetching API key...' : 'Initializing map...'}
          </div>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};
