
import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Droplets, Mountain, Clock, MapPin, Eye, Play } from 'lucide-react';
import { type EnhancedWildlifeLocation } from '@/data/enhancedWildlifeData';

interface WaterfallCard3DProps {
  waterfall: EnhancedWildlifeLocation;
  onExplore3D: (waterfall: EnhancedWildlifeLocation) => void;
  onViewLive: (waterfall: EnhancedWildlifeLocation) => void;
}

export function WaterfallCard3D({ waterfall, onExplore3D, onViewLive }: WaterfallCard3DProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [isRotating, setIsRotating] = useState(false);

  const handleMouseEnter = () => {
    setIsHovered(true);
    setIsRotating(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    setTimeout(() => setIsRotating(false), 500);
  };

  return (
    <Card 
      className="group relative overflow-hidden bg-gradient-to-br from-slate-50 to-blue-50 hover:shadow-2xl transition-all duration-700 hover:scale-105 transform-gpu"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* 3D Rotating Thumbnail */}
      <div className="relative h-48 overflow-hidden bg-gradient-to-br from-blue-600 via-teal-500 to-green-400">
        <div 
          className={`absolute inset-0 bg-gradient-to-b from-transparent via-blue-500/20 to-blue-900/40 transition-transform duration-1000 ${
            isRotating ? 'animate-slow-pan' : ''
          }`}
          style={{
            backgroundImage: `url(${waterfall.photos?.[0]?.url})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        />
        
        {/* 3D Water Mist Effect */}
        <div className={`absolute inset-0 transition-opacity duration-700 ${isHovered ? 'opacity-100' : 'opacity-0'}`}>
          <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-32 h-32 bg-gradient-radial from-white/30 via-blue-200/20 to-transparent rounded-full animate-mist-float" />
          <div className="absolute bottom-4 left-1/3 transform -translate-x-1/2 w-24 h-24 bg-gradient-radial from-white/20 via-blue-100/15 to-transparent rounded-full animate-mist-float animation-delay-500" />
          <div className="absolute bottom-8 right-1/3 transform translate-x-1/2 w-20 h-20 bg-gradient-radial from-white/25 via-blue-150/18 to-transparent rounded-full animate-mist-float animation-delay-1000" />
        </div>
        
        {/* Water Drops Animation */}
        <div className={`absolute inset-0 transition-opacity duration-500 ${isHovered ? 'opacity-100' : 'opacity-0'}`}>
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              className="absolute w-1 h-1 bg-blue-200 rounded-full animate-waterfall-drop opacity-70"
              style={{
                left: `${20 + i * 12}%`,
                animationDelay: `${i * 200}ms`,
                animationDuration: `${2000 + i * 300}ms`
              }}
            />
          ))}
        </div>

        {/* Height Badge */}
        <Badge className="absolute top-3 right-3 bg-gradient-to-r from-blue-600 to-teal-600 text-white font-bold">
          <Mountain className="w-3 h-3 mr-1" />
          {waterfall.height}m
        </Badge>

        {/* Live Indicator */}
        <div className="absolute top-3 left-3 flex items-center space-x-1">
          <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
          <span className="text-xs text-white font-medium bg-black/30 px-2 py-1 rounded">LIVE</span>
        </div>
      </div>

      <CardContent className="p-4">
        <div className="space-y-3">
          {/* Header */}
          <div>
            <h3 className="font-bold text-lg text-slate-800 group-hover:text-blue-600 transition-colors">
              {waterfall.name}
            </h3>
            <div className="flex items-center space-x-2 text-sm text-slate-600">
              <MapPin className="w-3 h-3" />
              <span>{waterfall.province}</span>
              <Badge variant="outline" className="text-xs">
                {waterfall.difficulty}
              </Badge>
            </div>
          </div>

          {/* Description */}
          <p className="text-sm text-slate-600 line-clamp-2">
            {waterfall.description}
          </p>

          {/* Stats */}
          <div className="flex items-center justify-between text-xs text-slate-500">
            <div className="flex items-center space-x-1">
              <Droplets className="w-3 h-3 text-blue-500" />
              <span>Flow Rate: Active</span>
            </div>
            <div className="flex items-center space-x-1">
              <Clock className="w-3 h-3 text-green-500" />
              <span>{waterfall.bestViewingTime?.split('(')[0] || 'Morning'}</span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex space-x-2 pt-2">
            <Button
              size="sm"
              className="flex-1 bg-gradient-to-r from-blue-600 to-teal-600 hover:from-blue-700 hover:to-teal-700 text-white transition-all duration-300 hover:shadow-lg"
              onClick={() => onExplore3D(waterfall)}
            >
              <Eye className="w-3 h-3 mr-1" />
              Explore in 3D
            </Button>
            <Button
              size="sm"
              variant="outline"
              className="flex-1 border-blue-200 hover:bg-blue-50 hover:border-blue-300 transition-all duration-300"
              onClick={() => onViewLive(waterfall)}
            >
              <Play className="w-3 h-3 mr-1" />
              View Live
            </Button>
          </div>
        </div>
      </CardContent>

      {/* 3D Hover Glow Effect */}
      <div className={`absolute inset-0 bg-gradient-to-br from-blue-400/10 via-transparent to-teal-400/10 pointer-events-none transition-opacity duration-700 ${
        isHovered ? 'opacity-100' : 'opacity-0'
      }`} />
    </Card>
  );
}
