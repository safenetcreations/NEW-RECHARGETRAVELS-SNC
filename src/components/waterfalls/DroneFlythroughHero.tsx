
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Play, Pause, Volume2, VolumeX, Maximize, Eye } from 'lucide-react';

interface DroneFlythroughHeroProps {
  title?: string;
  subtitle?: string;
  onWatchLive?: () => void;
}

export function DroneFlythroughHero({ 
  title = "Sri Lanka's Top 20 Waterfalls",
  subtitle = "A 3D Drone & Live-Feed Spectacle of Nature's Greatest Cascades",
  onWatchLive 
}: DroneFlythroughHeroProps) {
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(true);
  const [dronePosition, setDronePosition] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      if (isPlaying) {
        setDronePosition(prev => (prev + 1) % 100);
      }
    }, 100);
    return () => clearInterval(interval);
  }, [isPlaying]);

  const togglePlay = () => setIsPlaying(!isPlaying);
  const toggleMute = () => setIsMuted(!isMuted);

  return (
    <div className="relative w-full h-screen overflow-hidden bg-gradient-to-br from-slate-900 via-blue-900 to-teal-900">
      {/* 3D Drone Flyby Background */}
      <div className="absolute inset-0">
        {/* Main Waterfall Scene */}
        <div 
          className="absolute inset-0 transition-transform ease-linear [transition-duration:10s]"
          style={{
            backgroundImage: 'url(https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1920&h=1080&fit=crop)',
            backgroundSize: '120%',
            backgroundPosition: `${dronePosition}% 50%`,
            filter: 'brightness(0.7) contrast(1.1)',
          }}
        />
        
        {/* Volumetric Mist Layers */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 h-1/2 bg-gradient-to-t from-blue-900/50 via-transparent to-transparent" />
        
        {/* Dynamic Mist Effects */}
        <div className="absolute inset-0">
          {[...Array(8)].map((_, i) => (
            <div
              key={i}
              className="absolute bg-gradient-radial from-white/10 via-blue-200/5 to-transparent rounded-full animate-mist-float"
              style={{
                width: `${60 + i * 20}px`,
                height: `${60 + i * 20}px`,
                left: `${10 + i * 12}%`,
                bottom: `${5 + i * 3}%`,
                animationDelay: `${i * 800}ms`,
                animationDuration: `${8000 + i * 1000}ms`
              }}
            />
          ))}
        </div>

        {/* Water Particles */}
        <div className="absolute inset-0">
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              className="absolute w-1 h-1 bg-blue-200 rounded-full animate-waterfall-drop opacity-60"
              style={{
                left: `${Math.random() * 100}%`,
                animationDelay: `${i * 200}ms`,
                animationDuration: `${2000 + Math.random() * 2000}ms`
              }}
            />
          ))}
        </div>
      </div>

      {/* Content Overlay */}
      <div className="relative z-10 flex flex-col items-center justify-center h-full text-center px-6">
        {/* Main Headlines */}
        <div className="mb-8">
          <h1 className="text-6xl md:text-8xl font-bold mb-4 golden-emboss textured-serif text-white tracking-wide">
            {title}
          </h1>
          <p className="text-xl md:text-2xl text-blue-100 font-light max-w-4xl mx-auto leading-relaxed">
            {subtitle}
          </p>
        </div>

        {/* Live Status */}
        <div className="flex items-center space-x-3 mb-8">
          <div className="flex items-center space-x-2 bg-black/30 backdrop-blur-sm px-4 py-2 rounded-full">
            <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse" />
            <span className="text-white font-medium">LIVE DRONE FEED</span>
          </div>
          <Badge className="bg-gradient-to-r from-gold to-yellow-400 text-black font-bold px-4 py-2">
            4K ULTRA HD
          </Badge>
        </div>

        {/* Primary CTA */}
        <div className="flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-6 mb-12">
          <Button
            size="lg"
            className="pulsating-cta bg-gradient-to-r from-gold via-yellow-400 to-gold text-black font-bold px-8 py-4 text-lg hover:shadow-2xl transition-all duration-300 transform hover:scale-105"
            onClick={onWatchLive}
          >
            <Play className="w-5 h-5 mr-2" />
            Watch Live Flow
          </Button>
          <Button
            size="lg"
            variant="outline"
            className="border-white/30 text-white hover:bg-white/10 backdrop-blur-sm px-8 py-4 text-lg transition-all duration-300"
          >
            <Eye className="w-5 h-5 mr-2" />
            Explore in 3D
          </Button>
        </div>

        {/* Viewing Stats */}
        <div className="flex items-center space-x-8 text-sm text-blue-200">
          <div className="text-center">
            <div className="text-2xl font-bold text-white">2.4K</div>
            <div>Watching Now</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-white">20</div>
            <div>Waterfalls Featured</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-white">4K</div>
            <div>Ultra HD Quality</div>
          </div>
        </div>
      </div>

      {/* Drone Flyby Controls */}
      <div className="absolute bottom-6 left-6 flex items-center space-x-4 z-20">
        <Button
          size="sm"
          variant="outline"
          className="bg-black/30 border-white/30 text-white hover:bg-white/10 backdrop-blur-sm"
          onClick={togglePlay}
        >
          {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
        </Button>
        <Button
          size="sm"
          variant="outline"
          className="bg-black/30 border-white/30 text-white hover:bg-white/10 backdrop-blur-sm"
          onClick={toggleMute}
        >
          {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
        </Button>
        <Button
          size="sm"
          variant="outline"
          className="bg-black/30 border-white/30 text-white hover:bg-white/10 backdrop-blur-sm"
        >
          <Maximize className="w-4 h-4" />
        </Button>
      </div>

      {/* Drone Path Progress */}
      <div className="absolute bottom-6 right-6 z-20">
        <div className="bg-black/30 backdrop-blur-sm rounded-full px-4 py-2 text-white text-sm">
          Drone Position: {dronePosition}%
        </div>
      </div>

      {/* Golden Hour Lighting Effect */}
      <div className="absolute inset-0 bg-gradient-to-br from-gold/20 via-transparent to-transparent mix-blend-overlay pointer-events-none" />
    </div>
  );
}
