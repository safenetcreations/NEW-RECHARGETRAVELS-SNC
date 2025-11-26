import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { X, RefreshCw, AlertCircle } from 'lucide-react';
import { useApiKeys } from './hooks/useApiKeys';
import { useMapInitialization } from './hooks/useMapInitialization';
import { useContentFetching } from './hooks/useContentFetching';
import { GoogleMapsLoader } from './GoogleMapsLoader';
import MapFilters from './components/MapFilters';
import InfoPanel from './components/InfoPanel';
import TimeSlider from './components/TimeSlider';
import ItineraryModal from './components/ItineraryModal';
import { samplePoiData, type POIFeature } from './data/sampleData';

const InteractiveDiscoveryMap: React.FC = () => {
  const [activeFilters, setActiveFilters] = useState<Set<string>>(new Set(['Heritage', 'Temples', 'Wildlife', 'Beaches', 'Waterfalls']));
  const [selectedPoi, setSelectedPoi] = useState<POIFeature | null>(null);
  const [showInfoPanel, setShowInfoPanel] = useState(false);
  const [showItineraryModal, setShowItineraryModal] = useState(false);
  const [activeTab, setActiveTab] = useState('dive-in');
  const [timeSliderValue, setTimeSliderValue] = useState([0]);

  const { mapsApiKey, geminiApiKey, isLoading: keysLoading, mapError } = useApiKeys();

  const openInfoPanel = (poi: POIFeature) => {
    console.log('Opening info panel for:', poi.properties.name);
    setSelectedPoi(poi);
    setActiveTab('dive-in');
    setShowInfoPanel(true);
    fetchStreetView(poi);
    fetchGeminiInsights(poi.properties.name);
    fetchWikipediaSummary(poi.properties.name);
    fetchYouTubeVideos(poi);
  };

  const {
    mapRef,
    streetViewRef,
    historicalOverlay,
    panorama,
    poiMarkers,
    mapError: mapInitError,
    updateVisibleMarkers
  } = useMapInitialization(mapsApiKey, !keysLoading && !!mapsApiKey, openInfoPanel, samplePoiData);

  const {
    geminiContent,
    wikipediaContent,
    youtubeContent,
    itineraryContent,
    fetchGeminiInsights,
    fetchWikipediaSummary,
    fetchYouTubeVideos,
    generateItinerary
  } = useContentFetching(geminiApiKey);

  const fetchStreetView = (poi: POIFeature) => {
    if (!panorama) return;
    
    const [lng, lat] = poi.geometry.coordinates;
    const svService = new (window as any).google.maps.StreetViewService();
    
    svService.getPanorama({ location: { lat, lng }, radius: 50 }, (data: any, status: string) => {
      if (status === "OK" && data && panorama) {
        panorama.setPosition(data.location!.latLng!);
        panorama.setVisible(true);
      } else if (panorama) {
        panorama.setVisible(false);
      }
    });
  };

  useEffect(() => {
    if (historicalOverlay) {
      historicalOverlay.setOpacity(timeSliderValue[0] / 100);
    }
  }, [timeSliderValue, historicalOverlay]);

  const toggleFilter = (category: string) => {
    const newFilters = new Set(activeFilters);
    if (newFilters.has(category)) {
      newFilters.delete(category);
    } else {
      newFilters.add(category);
    }
    setActiveFilters(newFilters);
    updateVisibleMarkers(newFilters);
  };

  const handleGenerateItinerary = () => {
    setShowItineraryModal(true);
    const visiblePois = poiMarkers
      .filter(p => activeFilters.has(p.category))
      .map(p => p.poi.properties.name);
    generateItinerary(visiblePois);
  };

  const finalMapError = mapError || mapInitError;

  const handleRetry = () => {
    console.log('User clicked retry, reloading page...');
    window.location.reload();
  };

  if (keysLoading) {
    return (
      <div className="w-full h-screen bg-blue-50 flex items-center justify-center p-4">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600 mx-auto mb-6"></div>
          <p className="text-blue-700 font-bold text-xl mb-2">Loading Interactive Map...</p>
          <p className="text-blue-600">Fetching API keys from Supabase...</p>
        </div>
      </div>
    );
  }

  if (finalMapError || !mapsApiKey) {
    return (
      <div className="w-full h-screen bg-red-50 flex items-center justify-center p-4">
        <div className="text-center max-w-2xl">
          <div className="bg-red-100 rounded-full p-4 mb-6 inline-block">
            <AlertCircle className="h-12 w-12 text-red-600" />
          </div>
          <h3 className="text-red-800 font-bold text-2xl mb-4">Map Loading Failed</h3>
          <div className="bg-white p-6 rounded-lg shadow-lg mb-6">
            <p className="text-red-700 mb-4 text-left whitespace-pre-line">
              {finalMapError || 'Google Maps API Key could not be retrieved from Supabase'}
            </p>
            <div className="text-left text-sm text-gray-700 bg-gray-50 p-4 rounded">
              <p className="font-semibold mb-2">To fix this issue:</p>
              <ol className="list-decimal list-inside space-y-1">
                <li>Check your Google Maps API key in Supabase Edge Function settings</li>
                <li>Verify the secure-maps-api function is deployed</li>
                <li>Enable the Maps JavaScript API in Google Cloud Console</li>
                <li>Check domain restrictions and billing settings</li>
                <li>Ensure your API key has sufficient quota</li>
              </ol>
            </div>
          </div>
          <Button 
            onClick={handleRetry}
            className="bg-red-600 hover:bg-red-700 text-white flex items-center gap-2 mx-auto"
          >
            <RefreshCw className="h-4 w-4" />
            Retry Loading
          </Button>
        </div>
      </div>
    );
  }

  return (
    <GoogleMapsLoader
      apiKey={mapsApiKey}
      onLoad={() => console.log('Google Maps loaded successfully')}
      onError={(error) => console.error('Map loading error:', error)}
    >
      <div className="relative w-full h-screen overflow-hidden">
        {/* Map Container */}
        <div ref={mapRef} className="absolute top-0 left-0 w-full h-full bg-gray-200" />

        {/* UI Overlays */}
        <div className="absolute top-0 left-0 p-2 md:p-4 w-full h-full pointer-events-none">
          <div className="flex flex-col justify-between h-full">
            {/* Filters Container */}
            <MapFilters
              activeFilters={activeFilters}
              onToggleFilter={toggleFilter}
              onGenerateItinerary={handleGenerateItinerary}
            />

            {/* Time Slider */}
            <TimeSlider
              value={timeSliderValue}
              onChange={setTimeSliderValue}
            />
          </div>
        </div>

        {/* Info Panel */}
        {showInfoPanel && selectedPoi && (
          <InfoPanel
            selectedPoi={selectedPoi}
            activeTab={activeTab}
            onTabChange={setActiveTab}
            onClose={() => setShowInfoPanel(false)}
            streetViewRef={streetViewRef}
            geminiContent={geminiContent}
            wikipediaContent={wikipediaContent}
            youtubeContent={youtubeContent}
          />
        )}

        {/* Itinerary Modal */}
        <ItineraryModal
          isOpen={showItineraryModal}
          onClose={() => setShowItineraryModal(false)}
          content={itineraryContent}
        />
      </div>
    </GoogleMapsLoader>
  );
};

export default InteractiveDiscoveryMap;
