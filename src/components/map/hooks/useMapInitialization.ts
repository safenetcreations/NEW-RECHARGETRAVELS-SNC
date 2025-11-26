
import { useState, useEffect, useRef, useCallback } from 'react';

interface POIFeature {
  type: string;
  properties: {
    name: string;
    [key: string]: any;
  };
  geometry: {
    type: string;
    coordinates: [number, number];
  };
}

const SRI_LANKA_CENTER = { lat: 7.8731, lng: 80.7718 };
const HISTORICAL_MAP_URL = "https://www.davidrumsey.com/rumsey/Size4/RUMSEY~8~1/169/8590021.jpg";
const HISTORICAL_MAP_BOUNDS = { north: 9.83, south: 5.92, east: 81.9, west: 79.6 };

export const useMapInitialization = (
  mapsApiKey: string | null,
  isLoading: boolean,
  onMarkerClick: (poi: POIFeature) => void,
  poiData: POIFeature[]
) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const streetViewRef = useRef<HTMLDivElement>(null);
  const [map, setMap] = useState<google.maps.Map | null>(null);
  const [historicalOverlay, setHistoricalOverlay] = useState<google.maps.GroundOverlay | null>(null);
  const [panorama, setPanorama] = useState<google.maps.StreetViewPanorama | null>(null);
  const [poiMarkers, setPoiMarkers] = useState<any[]>([]);
  const [mapError, setMapError] = useState<string | null>(null);
  const [scriptLoaded, setScriptLoaded] = useState(false);

  const getPoiCategory = (poi: POIFeature): string => {
    const POI_CATEGORIES = {
      'Heritage': { tags: { 'historic': ['archaeological_site', 'ruins', 'monument', 'castle'] } },
      'Temples': { tags: { 'amenity': ['place_of_worship'] } },
      'Wildlife': { tags: { 'leisure': ['nature_reserve', 'park'], 'tourism': ['zoo'] } },
      'Beaches': { tags: { 'natural': ['beach'] } },
      'Waterfalls': { tags: { 'waterway': ['waterfall'] } },
    };

    for (const catName in POI_CATEGORIES) {
      const catData = POI_CATEGORIES[catName as keyof typeof POI_CATEGORIES];
      for (const tagKey in catData.tags) {
        if (poi.properties[tagKey] && catData.tags[tagKey].includes(poi.properties[tagKey])) {
          return catName;
        }
      }
    }
    return 'Other';
  };

  const renderPoiMarkers = (mapInstance: google.maps.Map, pois: POIFeature[]) => {
    console.log('Rendering POI markers:', pois.length);
    const markers: any[] = [];
    
    pois.forEach((poi, index) => {
      try {
        const [lng, lat] = poi.geometry.coordinates;
        const category = getPoiCategory(poi);
        
        console.log(`Creating marker ${index + 1}:`, poi.properties.name, 'at', lat, lng);
        
        const marker = new google.maps.Marker({
          position: { lat, lng },
          map: mapInstance,
          title: poi.properties.name,
          icon: {
            path: google.maps.SymbolPath.CIRCLE,
            scale: 8,
            fillColor: '#FF6B1A',
            fillOpacity: 1,
            strokeColor: '#ffffff',
            strokeWeight: 2,
          }
        });

        marker.addListener('click', () => {
          console.log('Marker clicked:', poi.properties.name);
          onMarkerClick(poi);
        });
        
        markers.push({ marker, category, poi });
      } catch (error) {
        console.error(`Error creating marker for ${poi.properties.name}:`, error);
      }
    });

    console.log('Total markers created:', markers.length);
    setPoiMarkers(markers);
  };

  const initializeMap = useCallback(() => {
    console.log('Attempting to initialize map...');
    
    if (!mapRef.current) {
      console.error('Map container not found');
      setMapError('Map container not available');
      return;
    }

    if (!window.google || !window.google.maps) {
      console.error('Google Maps API not loaded');
      setMapError('Google Maps API not loaded properly');
      return;
    }

    if (!mapsApiKey) {
      console.error('No Maps API key');
      setMapError('Maps API key missing');
      return;
    }

    try {
      console.log('Creating Google Map instance...');
      const newMap = new google.maps.Map(mapRef.current, {
        center: SRI_LANKA_CENTER,
        zoom: 8,
        disableDefaultUI: true,
        zoomControl: true,
        mapTypeControl: false,
        streetViewControl: false,
        fullscreenControl: false,
        styles: [
          {
            featureType: "water",
            elementType: "geometry",
            stylers: [{ color: "#193341" }]
          },
          {
            featureType: "landscape",
            elementType: "geometry",
            stylers: [{ color: "#2c5234" }]
          }
        ]
      });

      console.log('Map created successfully');

      // Add historical overlay
      const overlay = new google.maps.GroundOverlay(HISTORICAL_MAP_URL, HISTORICAL_MAP_BOUNDS, { opacity: 0 });
      overlay.setMap(newMap);

      // Initialize Street View
      if (streetViewRef.current) {
        try {
          const pano = new google.maps.StreetViewPanorama(streetViewRef.current, {
            addressControl: false,
            showRoadLabels: false,
            pov: { heading: 165, pitch: 0 },
            zoom: 1,
            visible: false
          });
          newMap.setStreetView(pano);
          setPanorama(pano);
        } catch (error) {
          console.warn('Street View initialization failed:', error);
        }
      }

      setMap(newMap);
      setHistoricalOverlay(overlay);
      setMapError(null);
      
      // Render markers
      renderPoiMarkers(newMap, poiData);
      
      console.log('Map initialization completed successfully');
    } catch (error) {
      console.error('Error initializing map:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      setMapError(`Failed to initialize map: ${errorMessage}`);
    }
  }, [mapsApiKey, onMarkerClick, poiData]);

  const loadGoogleMapsScript = useCallback(async () => {
    if (!mapsApiKey) {
      console.log('No API key, cannot load script');
      setMapError('Google Maps API key is missing');
      return;
    }

    // Check if Google Maps is already loaded
    if (window.google && window.google.maps && window.google.maps.Map) {
      console.log('Google Maps already loaded');
      setScriptLoaded(true);
      setTimeout(initializeMap, 100); // Small delay to ensure DOM is ready
      return;
    }

    try {
      console.log('Loading Google Maps script...');
      
      // Remove any existing scripts first
      const existingScripts = document.querySelectorAll('script[src*="maps.googleapis.com"]');
      existingScripts.forEach(script => {
        console.log('Removing existing Google Maps script');
        script.remove();
      });

      // Create and load the script
      const script = document.createElement('script');
      script.type = 'text/javascript';
      script.async = true;
      script.defer = true;
      script.src = `https://maps.googleapis.com/maps/api/js?key=${mapsApiKey}&libraries=places&v=weekly`;
      
      console.log('Script URL:', script.src);
      
      const loadPromise = new Promise<void>((resolve, reject) => {
        const timeoutId = setTimeout(() => {
          reject(new Error('Script loading timeout'));
        }, 10000); // 10 second timeout
        
        script.onload = () => {
          clearTimeout(timeoutId);
          console.log('Google Maps script loaded successfully');
          
          // Wait a bit more for the API to be fully ready
          setTimeout(() => {
            if (window.google && window.google.maps) {
              setScriptLoaded(true);
              resolve();
            } else {
              reject(new Error('Google Maps API not available after script load'));
            }
          }, 500);
        };
        
        script.onerror = (error) => {
          clearTimeout(timeoutId);
          console.error('Failed to load Google Maps script:', error);
          reject(new Error('Failed to load Google Maps script'));
        };
      });
      
      document.head.appendChild(script);
      
      // Wait for script to load
      await loadPromise;
      
      // Initialize map after script loads
      setTimeout(initializeMap, 100);
      
      setMapError(null);
      
    } catch (error) {
      console.error('Error loading Google Maps:', error);   
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      setMapError(`Failed to load Google Maps API: ${errorMessage}. Please check your API key and network connection.`);
    }
  }, [mapsApiKey, initializeMap]);

  useEffect(() => {
    if (isLoading) {
      console.log('Still loading API keys...');
      return;
    }

    if (!mapsApiKey) {
      console.log('No Maps API key available');
      setMapError('Maps API key not available');
      return;
    }

    loadGoogleMapsScript();
  }, [mapsApiKey, isLoading, loadGoogleMapsScript]);

  const updateVisibleMarkers = (filters: Set<string>) => {
    console.log('Updating visible markers with filters:', Array.from(filters));
    poiMarkers.forEach(({ marker, category }) => {
      const isVisible = filters.has(category);
      marker.setVisible(isVisible);
    });
  };

  return {
    mapRef,
    streetViewRef,
    map,
    historicalOverlay,
    panorama,
    poiMarkers,
    mapError,
    updateVisibleMarkers
  };
};
