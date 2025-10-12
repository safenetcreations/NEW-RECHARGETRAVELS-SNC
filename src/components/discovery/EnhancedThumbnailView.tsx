import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapPin, Heart, Share2, Camera, Eye, Star, Calendar, Phone, Navigation, ExternalLink } from 'lucide-react';
import { TouristLocation } from './types';

interface EnhancedThumbnailViewProps {
  locations: TouristLocation[];
  onLocationSelect: (location: TouristLocation) => void;
  onBookingClick: (location: TouristLocation) => void;
  selectedImages: string[];
  onImageToggle: (imageUrl: string) => void;
  liveThumbnails: boolean;
}

const EnhancedThumbnailView: React.FC<EnhancedThumbnailViewProps> = ({
  locations,
  onLocationSelect,
  onBookingClick,
  selectedImages,
  onImageToggle,
  liveThumbnails
}) => {
  const navigate = useNavigate();
  const [hoveredCard, setHoveredCard] = useState<number | null>(null);
  const [imageLoadStates, setImageLoadStates] = useState<Record<string, boolean>>({});

  const handleViewDetails = (location: TouristLocation) => {
    const slug = location.name.toLowerCase()
      .replace(/\s+/g, '-')
      .replace(/[^a-z0-9-]/g, '');
    navigate(`/destinations/${slug}`);
  };

  // Enhanced image URLs with live updates
  const getEnhancedImageUrl = (location: TouristLocation, timestamp?: number) => {
    const baseUrl = location.imageUrl || `https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=600&fit=crop`;
    return liveThumbnails ? `${baseUrl}&t=${timestamp || Date.now()}` : baseUrl;
  };

  useEffect(() => {
    // Preload images for better UX
    locations.forEach(location => {
      const img = new Image();
      img.onload = () => {
        setImageLoadStates(prev => ({ ...prev, [location.id]: true }));
      };
      img.src = getEnhancedImageUrl(location);
    });
  }, [locations, liveThumbnails]);

  return (
    <div className="p-6 bg-gradient-to-br from-gray-50 to-blue-50 min-h-full">
      {/* Header Controls */}
      <div className="mb-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h2 className="text-3xl font-bold text-gray-800 mb-2">
              🏝️ Discover Sri Lanka's Treasures
            </h2>
            <p className="text-gray-600">Interactive exploration with live updates and instant booking</p>
          </div>
          
          <div className="flex items-center gap-3">
            <div className={`px-4 py-2 rounded-lg font-medium ${
              liveThumbnails 
                ? 'bg-green-500 text-white shadow-lg' 
                : 'bg-gray-200 text-gray-700'
            }`}>
              {liveThumbnails ? '🔴 Live' : '⏸️ Static'}
            </div>
            <div className="text-sm text-gray-500">
              {locations.length} destinations
            </div>
          </div>
        </div>
      </div>

      {/* Enhanced Thumbnail Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {locations.map((location) => (
          <div
            key={location.id}
            className={`group relative bg-white rounded-2xl shadow-lg hover:shadow-2xl transform hover:-translate-y-2 transition-all duration-300 cursor-pointer overflow-hidden ${
              hoveredCard === location.id ? 'ring-4 ring-blue-500 ring-opacity-50' : ''
            }`}
            onMouseEnter={() => setHoveredCard(location.id)}
            onMouseLeave={() => setHoveredCard(null)}
            onClick={() => onLocationSelect(location)}
          >
            {/* Image Container with Live Updates */}
            <div className="relative aspect-[4/3] overflow-hidden">
              {imageLoadStates[location.id] ? (
                <img
                  src={getEnhancedImageUrl(location)}
                  alt={location.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-blue-100 to-purple-100 flex items-center justify-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
                </div>
              )}
              
              {/* Live Indicator */}
              {liveThumbnails && (
                <div className="absolute top-3 left-3 bg-red-500 text-white text-xs px-2 py-1 rounded-full flex items-center gap-1">
                  <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                  LIVE
                </div>
              )}

              {/* Image Actions Overlay */}
              <div className="absolute top-3 right-3 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onImageToggle(location.imageUrl || '');
                  }}
                  className={`p-2 rounded-full transition-all ${
                    selectedImages.includes(location.imageUrl || '') 
                      ? 'bg-red-500 text-white' 
                      : 'bg-white/80 text-gray-700 hover:bg-white'
                  }`}
                >
                  <Heart size={16} />
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    navigator.share?.({
                      title: location.name,
                      text: location.description,
                      url: window.location.href
                    });
                  }}
                  className="p-2 bg-white/80 text-gray-700 rounded-full hover:bg-white transition-all"
                >
                  <Share2 size={16} />
                </button>
              </div>

              {/* Rating Badge */}
              <div className="absolute bottom-3 left-3 bg-black/70 text-white text-sm px-2 py-1 rounded-full flex items-center gap-1">
                <Star size={14} className="text-yellow-400 fill-current" />
                {location.rating}
              </div>

              {/* Quick View Button */}
              <div className="absolute bottom-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onLocationSelect(location);
                  }}
                  className="p-2 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition-colors"
                >
                  <Eye size={16} />
                </button>
              </div>
            </div>

            {/* Content */}
            <div className="p-4">
              <div className="flex items-start justify-between mb-2">
                <h3 className="font-bold text-gray-800 text-lg line-clamp-2">
                  {location.name}
                </h3>
                <div className="flex items-center gap-1 text-sm text-gray-500">
                  <MapPin size={14} />
                  <span className="capitalize">{location.type.replace('_', ' ')}</span>
                </div>
              </div>

              <p className="text-gray-600 text-sm line-clamp-3 mb-4">
                {location.description}
              </p>

              {/* Price and Features */}
              <div className="flex items-center justify-between mb-4">
                <div className="text-lg font-bold text-green-600">
                  {location.priceRange}
                </div>
                <div className="flex items-center gap-2">
                  {location.openingHours && (
                    <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                      Open Now
                    </span>
                  )}
                </div>
              </div>

              {/* Enhanced Action Buttons */}
              <div className="space-y-2">
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onBookingClick(location);
                    }}
                    className="bg-gradient-to-r from-orange-500 to-red-500 text-white text-sm font-medium py-2 px-3 rounded-lg hover:from-orange-600 hover:to-red-600 transition-all flex items-center justify-center gap-1"
                  >
                    <Calendar size={14} />
                    Book Tour
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      window.open('tel:+94777721999', '_self');
                    }}
                    className="bg-gradient-to-r from-green-500 to-emerald-500 text-white text-sm font-medium py-2 px-3 rounded-lg hover:from-green-600 hover:to-emerald-600 transition-all flex items-center justify-center gap-1"
                  >
                    <Phone size={14} />
                    Call
                  </button>
                </div>
                
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleViewDetails(location);
                    }}
                    className="bg-purple-100 text-purple-800 text-sm font-medium py-2 px-3 rounded-lg hover:bg-purple-200 transition-colors flex items-center justify-center gap-1"
                  >
                    <ExternalLink size={14} />
                    Details
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      window.open(`https://www.google.com/maps/search/${encodeURIComponent(location.name)}+Sri+Lanka`, '_blank');
                    }}
                    className="bg-blue-100 text-blue-800 text-sm font-medium py-2 px-3 rounded-lg hover:bg-blue-200 transition-colors flex items-center justify-center gap-1"
                  >
                    <Navigation size={14} />
                    Map
                  </button>
                </div>
              </div>
            </div>

            {/* Hover Effect Glow */}
            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-2xl"></div>
            </div>
          </div>
        ))}
      </div>

      {/* No Results */}
      {locations.length === 0 && (
        <div className="text-center py-16">
          <div className="text-6xl mb-4">🔍</div>
          <h3 className="text-xl font-semibold text-gray-700 mb-2">No destinations found</h3>
          <p className="text-gray-500">Try adjusting your search or filters</p>
        </div>
      )}
    </div>
  );
};

export default EnhancedThumbnailView;