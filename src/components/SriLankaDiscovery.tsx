
import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Helmet } from 'react-helmet-async';
import { MapPin, Layers, Info, Menu, Calendar, Phone, Sparkles, Grid, Map, Image, Play, Eye, Heart, Share2, Camera, Navigation, Globe } from 'lucide-react';
import { TouristLocation, SriLankaDiscoveryProps } from './discovery/types';
import { useTouristLocations } from '@/hooks/useTouristLocations';
import Sidebar from './discovery/Sidebar';
import LocationGrid from './discovery/LocationGrid';
import LocationDetailModal from './discovery/LocationDetailModal';
import InteractiveMap from './discovery/InteractiveMap';
import EnhancedThumbnailView from './discovery/EnhancedThumbnailView';
import EnhancedGoogleMap from './discovery/EnhancedGoogleMap';
import BookingModal from './BookingModal';

const SriLankaDiscovery: React.FC<SriLankaDiscoveryProps> = ({ 
  className = "", 
  containerStyle = {} 
}) => {
  // Load tourist locations from Firestore
  const { locations: touristLocations, loading: locationsLoading } = useTouristLocations();
  
  // Enhanced State management
  const [selectedLocation, setSelectedLocation] = useState<TouristLocation | null>(null);
  const [activeFilter, setActiveFilter] = useState('all');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [mapView, setMapView] = useState('grid');
  const [viewMode, setViewMode] = useState<'card' | 'thumbnail' | 'map'>('thumbnail');
  const [selectedImages, setSelectedImages] = useState<string[]>([]);
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [liveThumbnails, setLiveThumbnails] = useState(true);
  const [selectedProvince, setSelectedProvince] = useState<string>('all');
  const [bookingLocation, setBookingLocation] = useState<TouristLocation | null>(null);

  // Enhanced filtering with province support
  const filteredLocations = useMemo(() => {
    return touristLocations.filter(location => {
      const matchesSearch = location.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          location.description.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesFilter = activeFilter === 'all' || location.type === activeFilter;
      const matchesProvince = selectedProvince === 'all' || 
                            location.name.toLowerCase().includes(selectedProvince.toLowerCase());
      return matchesSearch && matchesFilter && matchesProvince;
    });
  }, [searchQuery, activeFilter, selectedProvince]);
  
  // Get provinces from locations
  const provinces = useMemo(() => {
    const provinceList = ['all', 'western', 'southern', 'central', 'northern', 'eastern', 'north-western', 'north-central', 'uva', 'sabaragamuwa'];
    return provinceList;
  }, []);

  // Get unique location types for filters
  const locationTypes = useMemo(() => {
    const types = ['all', ...new Set(touristLocations.map(loc => loc.type))];
    return types;
  }, []);

  // Enhanced handlers
  const handleLocationSelect = useCallback((location: TouristLocation) => {
    setSelectedLocation(location);
  }, []);

  const handleFilterChange = useCallback((filter: string) => {
    setActiveFilter(filter);
  }, []);
  
  const handleBookingClick = useCallback((location: TouristLocation) => {
    setBookingLocation(location);
    setIsBookingOpen(true);
  }, []);
  
  const handleImageToggle = useCallback((imageUrl: string) => {
    setSelectedImages(prev => 
      prev.includes(imageUrl) 
        ? prev.filter(img => img !== imageUrl)
        : [...prev, imageUrl]
    );
  }, []);
  
  // Live image refresh effect
  useEffect(() => {
    if (liveThumbnails) {
      const interval = setInterval(() => {
        // Trigger re-render for live thumbnails
        setLiveThumbnails(true);
      }, 30000); // Refresh every 30 seconds
      return () => clearInterval(interval);
    }
  }, [liveThumbnails]);

  return (
    <>
      <Helmet>
        <title>Discover Sri Lanka - Interactive Guide</title>
        <meta name="description" content="Explore Sri Lanka's most beautiful destinations with our interactive discovery guide." />
      </Helmet>

      <div className={`h-screen w-full bg-gray-900 text-white flex relative overflow-hidden ${className}`} style={containerStyle}>
        {/* Sidebar */}
        <Sidebar
          isOpen={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
          filteredLocations={filteredLocations}
          selectedLocation={selectedLocation}
          onLocationSelect={handleLocationSelect}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          activeFilter={activeFilter}
          onFilterChange={handleFilterChange}
          locationTypes={locationTypes}
        />

        {/* Main Content */}
        <div className="flex-1 flex flex-col">
          {/* Enhanced Header with Booking CTAs */}
          <div className="bg-gradient-to-r from-gray-800 via-blue-900 to-indigo-900 border-b border-gray-700">
            {/* Top Header */}
            <div className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  {!sidebarOpen && (
                    <button 
                      onClick={() => setSidebarOpen(true)}
                      className="p-2 hover:bg-gray-700 rounded"
                    >
                      <Menu size={20} />
                    </button>
                  )}
                  <h1 className="text-2xl font-bold bg-gradient-to-r from-white to-blue-200 bg-clip-text text-transparent">Sri Lanka Discovery</h1>
                </div>
                
                <div className="flex items-center gap-2">
                  <button className="p-2 hover:bg-gray-700 rounded">
                    <Layers size={20} />
                  </button>
                  <button className="p-2 hover:bg-gray-700 rounded">
                    <Info size={20} />
                  </button>
                </div>
              </div>
            </div>

            {/* Booking CTA Banner */}
            <div className="bg-gradient-to-r from-orange-500 to-red-500 p-4">
              <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                <div className="text-center md:text-left">
                  <div className="flex items-center justify-center md:justify-start gap-2 mb-1">
                    <Sparkles className="w-5 h-5 text-yellow-300" />
                    <span className="font-bold text-white">🎯 Discover & Book Instantly!</span>
                  </div>
                  <p className="text-white text-sm opacity-90">Click any destination to explore and book your perfect Sri Lankan adventure</p>
                </div>
                <div className="flex flex-col sm:flex-row gap-3">
                  <button className="bg-white text-orange-600 px-4 py-2 rounded-lg font-semibold hover:bg-gray-100 transition-colors flex items-center space-x-2">
                    <Calendar className="w-4 h-4" />
                    <span>Book Tours</span>
                  </button>
                  <button className="bg-yellow-400 text-gray-900 px-4 py-2 rounded-lg font-semibold hover:bg-yellow-300 transition-colors flex items-center space-x-2">
                    <Phone className="w-4 h-4" />
                    <span>Call +94 777 21 999</span>
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Enhanced View Options */}
          <div className="flex-1 relative">
            {viewMode === 'thumbnail' ? (
              <EnhancedThumbnailView
                locations={filteredLocations}
                onLocationSelect={handleLocationSelect}
                onBookingClick={handleBookingClick}
                selectedImages={selectedImages}
                onImageToggle={handleImageToggle}
                liveThumbnails={liveThumbnails}
              />
            ) : viewMode === 'map' ? (
              <EnhancedGoogleMap
                locations={filteredLocations}
                selectedLocation={selectedLocation}
                onLocationSelect={handleLocationSelect}
                onBookingClick={handleBookingClick}
              />
            ) : viewMode === 'card' ? (
              <LocationGrid 
                locations={filteredLocations}
                onLocationSelect={handleLocationSelect}
              />
            ) : (
              <InteractiveMap
                locations={filteredLocations}
                selectedLocation={selectedLocation}
                onLocationSelect={handleLocationSelect}
              />
            )}
          </div>

          {/* Enhanced View Controls */}
          <div className="bg-gradient-to-r from-gray-800 to-gray-900 p-4 border-t border-gray-700">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
              {/* View Mode Toggle */}
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setViewMode('thumbnail')}
                  className={`px-4 py-2 rounded-lg transition-all flex items-center gap-2 ${
                    viewMode === 'thumbnail' ? 'bg-blue-600 text-white shadow-lg' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                  }`}
                >
                  <Image size={16} />
                  Live Thumbnails
                </button>
                <button
                  onClick={() => setViewMode('map')}
                  className={`px-4 py-2 rounded-lg transition-all flex items-center gap-2 ${
                    viewMode === 'map' ? 'bg-blue-600 text-white shadow-lg' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                  }`}
                >
                  <Globe size={16} />
                  Google Maps
                </button>
                <button
                  onClick={() => setViewMode('card')}
                  className={`px-4 py-2 rounded-lg transition-all flex items-center gap-2 ${
                    viewMode === 'card' ? 'bg-blue-600 text-white shadow-lg' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                  }`}
                >
                  <Grid size={16} />
                  Card View
                </button>
              </div>
              
              {/* Province Filter */}
              <div className="flex items-center gap-3">
                <label className="text-gray-300 text-sm font-medium">Province:</label>
                <select
                  value={selectedProvince}
                  onChange={(e) => setSelectedProvince(e.target.value)}
                  className="bg-gray-700 text-white border border-gray-600 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {provinces.map(province => (
                    <option key={province} value={province}>
                      {province.charAt(0).toUpperCase() + province.slice(1).replace('-', ' ')}
                    </option>
                  ))}
                </select>
              </div>
              
              {/* Stats */}
              <div className="text-gray-300 text-sm">
                {filteredLocations.length} destinations
                {selectedImages.length > 0 && (
                  <span className="ml-2 text-red-400">
                    • {selectedImages.length} selected
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Modals */}
        <LocationDetailModal
          location={selectedLocation}
          onClose={() => setSelectedLocation(null)}
        />
        
        <BookingModal
          isOpen={isBookingOpen}
          onClose={() => setIsBookingOpen(false)}
          type="tour"
          itemTitle={bookingLocation ? `Tour to ${bookingLocation.name}` : 'Sri Lanka Tour'}
        />
      </div>
    </>
  );
};

export default SriLankaDiscovery;
