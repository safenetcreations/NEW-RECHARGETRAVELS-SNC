
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  MapPin, 
  Clock, 
  DollarSign, 
  Star, 
  Camera, 
  Radio,
  Play,
  Eye,
  TreePine,
  Mountain,
  Waves,
  Binoculars
} from 'lucide-react';
import type { NationalPark } from '@/data/wildlifeToursData';

interface EnhancedParkCardProps {
  park: NationalPark;
}

const getAttractionIcon = (attraction: string) => {
  const iconMap: { [key: string]: React.ReactNode } = {
    'elephants': <TreePine className="w-4 h-4 text-amber-600" />,
    'leopards': <Binoculars className="w-4 h-4 text-orange-600" />,
    'birds': <TreePine className="w-4 h-4 text-green-600" />,
    'endemic birds': <TreePine className="w-4 h-4 text-green-600" />,
    'waterfalls': <Waves className="w-4 h-4 text-blue-600" />,
    'worlds end': <Mountain className="w-4 h-4 text-purple-600" />,
    'orchids': <Star className="w-4 h-4 text-pink-600" />,
    'default': <MapPin className="w-4 h-4 text-gray-600" />
  };
  
  return iconMap[attraction.toLowerCase()] || iconMap['default'];
};

const getClassificationColor = (classification: string) => {
  const colorMap = {
    'National Park': 'bg-emerald-100 text-emerald-800 border-emerald-200',
    'Forest Reserve': 'bg-green-100 text-green-800 border-green-200',
    'Botanical Garden': 'bg-pink-100 text-pink-800 border-pink-200',
    'Sanctuary': 'bg-blue-100 text-blue-800 border-blue-200'
  };
  return colorMap[classification as keyof typeof colorMap] || 'bg-gray-100 text-gray-800 border-gray-200';
};

const EnhancedParkCard: React.FC<EnhancedParkCardProps> = ({ park }) => {
  const [isHovering, setIsHovering] = useState(false);
  const [showLiveCam, setShowLiveCam] = useState(false);

  // Mock live cam status
  const isLiveCamOnline = Math.random() > 0.3; // 70% online rate

  return (
    <Card 
      id={`park-${park.id}`}
      className="overflow-hidden hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-4 cursor-pointer bg-white/95 backdrop-blur-sm border-2 border-gray-100 hover:border-emerald-200 group animate-fade-in"
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
    >
      {/* Hero Image with 3D Terrain Overlay */}
      <div className="relative h-64 bg-gradient-to-br from-green-400 to-emerald-600 overflow-hidden">
        {park.images[0] && (
          <img 
            src={park.images[0]} 
            alt={park.name}
            className={`w-full h-full object-cover transition-transform duration-700 ${
              isHovering ? 'scale-110 animate-3d-rotate' : 'scale-100'
            }`}
          />
        )}
        
        {/* 3D Terrain Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
        
        {/* Animated 3D Terrain Elements */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-4 left-4 w-8 h-8 bg-white/20 rounded-full animate-mist-float" />
          <div className="absolute bottom-8 right-8 w-6 h-6 bg-emerald-300/30 rounded-full animate-mist-float" style={{ animationDelay: '2s' }} />
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
            <div className={`w-16 h-16 border border-white/30 rounded-full transition-all duration-500 ${
              isHovering ? 'animate-3d-rotate scale-150' : 'scale-100'
            }`} />
          </div>
        </div>

        {/* Badges */}
        <div className="absolute top-4 right-4 flex flex-col gap-2">
          <Badge className={getClassificationColor(park.classification)}>
            {park.classification}
          </Badge>
          {park.featured && (
            <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200">
              <Star className="w-3 h-3 mr-1" />
              Featured
            </Badge>
          )}
        </div>

        {/* Live Cam Status */}
        <div className="absolute top-4 left-4">
          {isLiveCamOnline ? (
            <Badge className="bg-red-500/90 text-white animate-pulse live-indicator">
              <Radio className="w-3 h-3 mr-1" />
              Live
            </Badge>
          ) : (
            <Badge className="bg-gray-500/90 text-white">
              <Radio className="w-3 h-3 mr-1" />
              Offline
            </Badge>
          )}
        </div>

        {/* 3D Tour Button Overlay */}
        {isHovering && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/30 animate-fade-in">
            <Button 
              size="lg"
              className="bg-white/90 text-emerald-700 hover:bg-white rounded-full px-6 py-3 font-semibold backdrop-blur-sm"
            >
              <Play className="w-5 h-5 mr-2" />
              3D Preview
            </Button>
          </div>
        )}
      </div>

      <CardHeader>
        <CardTitle className="text-xl font-playfair flex items-center justify-between">
          {park.name}
          <div className="flex gap-2">
            {isLiveCamOnline && (
              <Button
                size="sm"
                variant="outline"
                onClick={() => setShowLiveCam(!showLiveCam)}
                className="border-red-200 text-red-600 hover:bg-red-50"
              >
                <Eye className="w-4 h-4" />
              </Button>
            )}
          </div>
        </CardTitle>
        <div className="flex items-center text-sm text-gray-600 mb-2">
          <MapPin className="w-4 h-4 mr-1" />
          <span>{park.province} • {park.location.nearestCity}</span>
        </div>
        <p className="text-sm text-gray-700 font-montserrat leading-relaxed">
          {park.description}
        </p>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Live Cam Preview */}
        {showLiveCam && isLiveCamOnline && (
          <div className="bg-black rounded-lg p-4 animate-fade-in">
            <div className="aspect-video bg-gray-800 rounded-lg relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-green-600/20 to-transparent" />
              <div className="absolute bottom-4 left-4 text-white text-sm">
                <Badge className="bg-red-500/80 text-white mb-2">
                  <Radio className="w-3 h-3 mr-1" />
                  LIVE
                </Badge>
                <div>Wildlife Cam - {park.name}</div>
              </div>
              {/* Simulated animal detection */}
              <div className="absolute top-4 right-4 bg-yellow-400/90 text-black text-xs px-2 py-1 rounded animate-pulse">
                🐘 Elephant Detected
              </div>
            </div>
          </div>
        )}

        {/* Key Attractions */}
        <div className="flex flex-wrap gap-2">
          {park.attractions.slice(0, 4).map((attraction, index) => (
            <div 
              key={index}
              className="flex items-center gap-1 bg-emerald-50 px-3 py-1 rounded-full text-xs border border-emerald-100"
            >
              {getAttractionIcon(attraction)}
              <span className="capitalize font-medium">{attraction}</span>
            </div>
          ))}
        </div>

        {/* 3D Terrain Mini-Model */}
        <div className="bg-gradient-to-br from-green-100 to-emerald-100 p-4 rounded-lg border border-emerald-200">
          <div className="relative h-16 overflow-hidden rounded-lg">
            <div className="absolute inset-0 bg-gradient-to-r from-green-300 to-emerald-400" />
            <div className="absolute inset-0">
              <svg viewBox="0 0 200 64" className="w-full h-full">
                <path d="M0,48 Q50,32 100,40 T200,44 L200,64 L0,64 Z" fill="rgba(34, 197, 94, 0.6)" className="animate-flow-pulse" />
                <path d="M0,52 Q60,36 120,42 T200,46 L200,64 L0,64 Z" fill="rgba(16, 185, 129, 0.4)" className="animate-flow-pulse" style={{ animationDelay: '1s' }} />
              </svg>
            </div>
            <div className="absolute top-2 left-4 w-2 h-2 bg-white rounded-full animate-pulse" />
            <div className="absolute top-4 right-8 w-1 h-1 bg-yellow-300 rounded-full animate-pulse" style={{ animationDelay: '0.5s' }} />
          </div>
          <div className="flex items-center justify-between mt-2 text-xs text-emerald-700">
            <span>Terrain Preview</span>
            <span>{park.location.distanceFromColombo}km from Colombo</span>
          </div>
        </div>

        {/* Pricing & Quick Info */}
        <div className="bg-gray-50 p-3 rounded-lg">
          <div className="flex items-center justify-between text-sm">
            <span className="flex items-center text-emerald-700 font-semibold">
              <DollarSign className="w-4 h-4 mr-1" />
              ${park.fees.entrance_fee}
            </span>
            <span className="flex items-center text-gray-600">
              <Clock className="w-4 h-4 mr-1" />
              {park.operatingHours.split(' - ')[0]}
            </span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2 pt-2">
          <Button className="flex-1 bg-emerald-600 hover:bg-emerald-700 rounded-full" asChild>
            <Link to={`/tours/wildtours/parks/${park.slug}`}>
              <Mountain className="w-4 h-4 mr-2" />
              3D Tour
            </Link>
          </Button>
          {isLiveCamOnline && (
            <Button 
              variant="outline" 
              className="flex-1 border-red-200 text-red-600 hover:bg-red-50 rounded-full"
              onClick={() => setShowLiveCam(!showLiveCam)}
            >
              <Camera className="w-4 h-4 mr-2" />
              Live Cam
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default EnhancedParkCard;
