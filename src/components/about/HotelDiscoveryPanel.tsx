
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Star, MapPin, Phone, Globe } from 'lucide-react';
import { Hotel } from '@/types/hotel';

interface PoiFeature {
  properties: {
    name: string;
  };
}

interface HotelDiscoveryPanelProps {
  hotels: (Hotel & { distance_m?: number })[];
  isLoading: boolean;
  selectedPoi: PoiFeature;
}

const HotelDiscoveryPanel: React.FC<HotelDiscoveryPanelProps> = ({
  hotels,
  isLoading,
  selectedPoi
}) => {
  const formatDistance = (distanceM: number) => {
    if (distanceM < 1000) {
      return `${Math.round(distanceM)}m away`;
    } else {
      return `${(distanceM / 1000).toFixed(1)}km away`;
    }
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`h-4 w-4 ${
          i < Math.floor(rating) 
            ? 'text-yellow-400 fill-current' 
            : 'text-gray-300'
        }`}
      />
    ));
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <Card key={i} className="animate-pulse">
            <CardContent className="p-4">
              <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
              <div className="h-3 bg-gray-200 rounded w-1/2 mb-2"></div>
              <div className="h-3 bg-gray-200 rounded w-2/3"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (!hotels || hotels.length === 0) {
    return (
      <Card>
        <CardContent className="p-6 text-center">
          <MapPin className="h-12 w-12 text-gray-400 mx-auto mb-3" />
          <p className="text-gray-600">No hotels found near {selectedPoi.properties.name}</p>
          <p className="text-sm text-gray-500 mt-2">Try exploring other destinations</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4 max-h-96 overflow-y-auto">
      {hotels.slice(0, 10).map((hotel) => (
        <Card key={hotel.id} className="hover:shadow-md transition-shadow">
          <CardContent className="p-4">
            <div className="flex justify-between items-start mb-2">
              <h4 className="font-semibold text-lg text-gray-900 line-clamp-1">
                {hotel.name}
              </h4>
              {hotel.distance_m && (
                <Badge variant="outline" className="text-xs">
                  {formatDistance(hotel.distance_m)}
                </Badge>
              )}
            </div>

            {/* Rating */}
            {hotel.average_rating > 0 && (
              <div className="flex items-center gap-2 mb-2">
                <div className="flex">
                  {renderStars(hotel.average_rating)}
                </div>
                <span className="text-sm text-gray-600">
                  {hotel.average_rating.toFixed(1)} ({hotel.review_count} reviews)
                </span>
              </div>
            )}

            {/* Location */}
            {hotel.city && (
              <div className="flex items-center gap-1 mb-2 text-sm text-gray-600">
                <MapPin className="h-4 w-4" />
                <span>{hotel.city.name}</span>
              </div>
            )}

            {/* Description */}
            {hotel.description && (
              <p className="text-sm text-gray-700 mb-3 line-clamp-2">
                {hotel.description}
              </p>
            )}

            {/* Price */}
            {hotel.base_price_per_night && (
              <div className="flex items-center justify-between mb-3">
                <span className="text-lg font-semibold text-green-600">
                  ${hotel.base_price_per_night}/night
                </span>
                {hotel.hotel_category && (
                  <Badge variant="secondary">
                    {hotel.hotel_category.name}
                  </Badge>
                )}
              </div>
            )}

            {/* Contact Info */}
            <div className="flex gap-2 text-xs text-gray-500 mb-3">
              {hotel.phone && (
                <div className="flex items-center gap-1">
                  <Phone className="h-3 w-3" />
                  <span>{hotel.phone}</span>
                </div>
              )}
              {hotel.website && (
                <div className="flex items-center gap-1">
                  <Globe className="h-3 w-3" />
                  <span>Website</span>
                </div>
              )}
            </div>

            {/* Actions */}
            <div className="flex gap-2">
              <Button size="sm" className="flex-1">
                View Details
              </Button>
              {hotel.website && (
                <Button size="sm" variant="outline" asChild>
                  <a href={hotel.website} target="_blank" rel="noopener noreferrer">
                    <Globe className="h-4 w-4" />
                  </a>
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      ))}

      {hotels.length > 10 && (
        <div className="text-center py-4">
          <Button variant="outline" size="sm">
            Show More Hotels
          </Button>
        </div>
      )}
    </div>
  );
};

export default HotelDiscoveryPanel;
