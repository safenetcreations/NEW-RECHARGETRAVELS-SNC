
import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, ExternalLink, Camera } from 'lucide-react';

interface PhotoLink {
  url: string;
  title: string;
  type: 'stock' | 'live_cam' | 'gallery';
  source?: string;
}

interface WildlifePhotoGalleryProps {
  photos: PhotoLink[];
  locationName: string;
}

const WildlifePhotoGallery = ({ photos, locationName }: WildlifePhotoGalleryProps) => {
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);

  if (!photos || photos.length === 0) return null;

  const currentPhoto = photos[currentPhotoIndex];

  const nextPhoto = () => {
    setCurrentPhotoIndex((prev) => (prev + 1) % photos.length);
  };

  const prevPhoto = () => {
    setCurrentPhotoIndex((prev) => (prev - 1 + photos.length) % photos.length);
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'live_cam':
        return '📹';
      case 'gallery':
        return '🖼️';
      default:
        return '📸';
    }
  };

  const getTypeBadgeColor = (type: string) => {
    switch (type) {
      case 'live_cam':
        return 'bg-red-100 text-red-700';
      case 'gallery':
        return 'bg-blue-100 text-blue-700';
      default:
        return 'bg-green-100 text-green-700';
    }
  };

  return (
    <div className="mt-3">
      <div className="relative group">
        <img
          src={currentPhoto.url}
          alt={currentPhoto.title}
          className="w-full h-32 object-cover rounded-lg shadow-md cursor-pointer hover:shadow-lg transition-shadow"
          onClick={() => window.open(currentPhoto.url, '_blank')}
        />
        
        {/* Navigation arrows */}
        {photos.length > 1 && (
          <>
            <button
              onClick={prevPhoto}
              className="absolute left-1 top-1/2 transform -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <button
              onClick={nextPhoto}
              className="absolute right-1 top-1/2 transform -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </>
        )}

        {/* Photo counter */}
        {photos.length > 1 && (
          <div className="absolute bottom-2 right-2 bg-black/60 text-white text-xs px-2 py-1 rounded">
            {currentPhotoIndex + 1}/{photos.length}
          </div>
        )}

        {/* Type badge */}
        <div className={`absolute top-2 left-2 text-xs px-2 py-1 rounded-full ${getTypeBadgeColor(currentPhoto.type)}`}>
          {getTypeIcon(currentPhoto.type)} {currentPhoto.type.replace('_', ' ')}
        </div>
      </div>

      {/* Photo info */}
      <div className="mt-2 flex items-center justify-between text-xs text-granite-gray">
        <span className="font-medium">{currentPhoto.title}</span>
        <button
          onClick={() => window.open(currentPhoto.url, '_blank')}
          className="flex items-center text-blue-600 hover:text-blue-800"
        >
          <ExternalLink className="h-3 w-3 mr-1" />
          View Full
        </button>
      </div>

      {/* Thumbnail strip for multiple photos */}
      {photos.length > 1 && (
        <div className="flex space-x-1 mt-2 overflow-x-auto">
          {photos.map((photo, index) => (
            <button
              key={index}
              onClick={() => setCurrentPhotoIndex(index)}
              className={`flex-shrink-0 w-8 h-8 rounded border-2 overflow-hidden ${
                index === currentPhotoIndex ? 'border-wild-orange' : 'border-gray-300'
              }`}
            >
              <img
                src={photo.url}
                alt={photo.title}
                className="w-full h-full object-cover"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default WildlifePhotoGallery;
