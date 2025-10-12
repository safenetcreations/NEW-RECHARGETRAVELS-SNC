
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { X, MapPin, Clock, DollarSign, Star, Calendar, Car, Phone, ExternalLink } from 'lucide-react';
import { TouristLocation } from './types';
import BookingModal from '../BookingModal';

interface LocationDetailModalProps {
  location: TouristLocation | null;
  onClose: () => void;
}

const LocationDetailModal: React.FC<LocationDetailModalProps> = ({ location, onClose }) => {
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const navigate = useNavigate();

  if (!location) return null;

  const handleViewDetails = () => {
    // Convert location name to URL-friendly slug
    const slug = location.name.toLowerCase()
      .replace(/\s+/g, '-')
      .replace(/[^a-z0-9-]/g, '');
    
    // Navigate to the detailed page
    navigate(`/destinations/${slug}`);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-hidden shadow-2xl">
        {/* Header */}
        <div className="relative">
          {location.imageUrl && (
            <img 
              src={location.imageUrl} 
              alt={location.name}
              className="w-full h-48 object-cover"
            />
          )}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 bg-white bg-opacity-90 rounded-full hover:bg-opacity-100 transition-all"
          >
            <X size={20} className="text-gray-600" />
          </button>
          <div className="absolute bottom-4 left-4 bg-white bg-opacity-90 backdrop-blur-sm rounded-lg p-3">
            <h2 className="text-2xl font-bold text-gray-800">{location.name}</h2>
            <div className="flex items-center gap-2 mt-1">
              <MapPin size={16} className="text-gray-600" />
              <span className="text-sm text-gray-600 capitalize">{location.type.replace('_', ' ')}</span>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[60vh]">
          <p className="text-gray-700 mb-6 leading-relaxed">{location.description}</p>

          {/* Quick Info Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="bg-blue-50 p-4 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <Star className="text-yellow-500" size={20} />
                <span className="font-semibold text-gray-800">Rating</span>
              </div>
              <div className="text-lg font-bold text-blue-800">{location.rating}/5</div>
            </div>

            <div className="bg-green-50 p-4 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <DollarSign className="text-green-600" size={20} />
                <span className="font-semibold text-gray-800">Price Range</span>
              </div>
              <div className="text-lg font-bold text-green-800">{location.priceRange}</div>
            </div>

            {location.openingHours && (
              <div className="bg-orange-50 p-4 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <Clock className="text-orange-600" size={20} />
                  <span className="font-semibold text-gray-800">Hours</span>
                </div>
                <div className="text-sm text-orange-800">{location.openingHours}</div>
              </div>
            )}
          </div>

          {/* Enhanced Action Buttons */}
          <div className="space-y-4">
            {/* Primary Booking CTAs */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <button
                onClick={() => setIsBookingModalOpen(true)}
                className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white px-6 py-4 rounded-xl font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 flex items-center justify-center space-x-2"
              >
                <Calendar className="w-5 h-5" />
                <span>Book Tour Here</span>
              </button>
              <button
                onClick={() => window.open('tel:+94777721999', '_self')}
                className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white px-6 py-4 rounded-xl font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 flex items-center justify-center space-x-2"
              >
                <Phone className="w-5 h-5" />
                <span>Call for Transport</span>
              </button>
            </div>

            {/* Secondary Actions */}
            <div className="flex gap-3">
              <button
                onClick={handleViewDetails}
                className="flex-1 bg-purple-100 hover:bg-purple-200 text-purple-800 px-4 py-3 rounded-lg transition-colors font-medium border border-purple-200 flex items-center justify-center gap-2"
              >
                <ExternalLink className="w-4 h-4" />
                View Details
              </button>
              <button
                onClick={() => window.open(`https://www.google.com/maps/search/${encodeURIComponent(location.name)}+Sri+Lanka`, '_blank')}
                className="flex-1 bg-green-100 hover:bg-green-200 text-green-800 px-4 py-3 rounded-lg transition-colors font-medium border border-green-200"
              >
                🗺️ Directions
              </button>
            </div>

            {/* Special Offer Banner */}
            <div className="bg-gradient-to-r from-purple-500 to-pink-500 text-white p-4 rounded-xl text-center">
              <div className="font-bold text-lg mb-1">🎯 Special Location Offer!</div>
              <div className="text-sm opacity-90">Book a tour to {location.name} and get 15% off transport!</div>
            </div>
          </div>
        </div>
      </div>

      {/* Booking Modal */}
      <BookingModal
        isOpen={isBookingModalOpen}
        onClose={() => setIsBookingModalOpen(false)}
        type="tour"
        itemTitle={`Tour to ${location.name}`}
      />
    </div>
  );
};

export default LocationDetailModal;
