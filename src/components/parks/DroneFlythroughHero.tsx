
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { X, Volume2, VolumeX, Maximize, RotateCcw } from 'lucide-react';

interface DroneFlythroughHeroProps {
  onExit: () => void;
}

const DroneFlythroughHero: React.FC<DroneFlythroughHeroProps> = ({ onExit }) => {
  const [currentPark, setCurrentPark] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const parks = [
    { name: 'Yala National Park', color: 'from-amber-600 to-orange-700' },
    { name: 'Wilpattu National Park', color: 'from-green-600 to-emerald-700' },
    { name: 'Horton Plains', color: 'from-purple-600 to-indigo-700' },
    { name: 'Udawalawe National Park', color: 'from-blue-600 to-cyan-700' }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentPark((prev) => (prev + 1) % parks.length);
    }, 8000);
    return () => clearInterval(interval);
  }, []);

  const handleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black overflow-hidden">
      {/* Control Bar */}
      <div className="absolute top-4 left-4 right-4 z-10 flex justify-between items-center">
        <div className="flex items-center gap-4">
          <Button
            variant="outline"
            size="sm"
            onClick={onExit}
            className="bg-black/50 border-white/30 text-white hover:bg-black/70 backdrop-blur-sm"
          >
            <X className="w-4 h-4 mr-2" />
            Exit Experience
          </Button>
          
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPark((prev) => (prev + 1) % parks.length)}
            className="bg-black/50 border-white/30 text-white hover:bg-black/70 backdrop-blur-sm"
          >
            <RotateCcw className="w-4 h-4 mr-2" />
            Next Park
          </Button>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsMuted(!isMuted)}
            className="bg-black/50 border-white/30 text-white hover:bg-black/70 backdrop-blur-sm"
          >
            {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
          </Button>
          
          <Button
            variant="outline"
            size="sm"
            onClick={handleFullscreen}
            className="bg-black/50 border-white/30 text-white hover:bg-black/70 backdrop-blur-sm"
          >
            <Maximize className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Immersive Flythrough Scene */}
      <div className="relative w-full h-full overflow-hidden">
        {/* Dynamic Background Gradient */}
        <div 
          className={`absolute inset-0 bg-gradient-to-br ${parks[currentPark].color} transition-all duration-2000`}
        />
        
        {/* Animated Landscape Elements */}
        <div className="absolute inset-0">
          {/* Mountains/Hills */}
          <div className="absolute bottom-0 left-0 w-full h-2/3">
            <svg viewBox="0 0 1920 800" className="w-full h-full">
              <path 
                d="M0,600 Q200,400 400,500 T800,450 Q1000,350 1200,400 T1600,380 Q1700,320 1920,350 L1920,800 L0,800 Z"
                fill="rgba(0,0,0,0.3)"
                className="animate-flow-pulse"
              />
              <path 
                d="M0,650 Q300,500 600,550 T1200,520 Q1400,450 1600,480 T1920,460 L1920,800 L0,800 Z"
                fill="rgba(0,0,0,0.2)"
                className="animate-flow-pulse"
                style={{ animationDelay: '2s' }}
              />
            </svg>
          </div>

          {/* Floating Particles/Birds */}
          <div className="absolute inset-0 pointer-events-none">
            {[...Array(12)].map((_, i) => (
              <div
                key={i}
                className="absolute w-2 h-2 bg-white/40 rounded-full animate-drone-flyby"
                style={{
                  top: `${20 + (i * 5)}%`,
                  left: `${-10}%`,
                  animationDelay: `${i * 2}s`,
                  animationDuration: `${15 + (i * 2)}s`
                }}
              />
            ))}
          </div>

          {/* Mist/Fog Effects */}
          <div className="absolute inset-0">
            {[...Array(6)].map((_, i) => (
              <div
                key={i}
                className="absolute bg-white/10 rounded-full blur-3xl animate-mist-float"
                style={{
                  width: `${100 + (i * 50)}px`,
                  height: `${100 + (i * 50)}px`,
                  top: `${20 + (i * 15)}%`,
                  left: `${10 + (i * 15)}%`,
                  animationDelay: `${i * 1.5}s`,
                  animationDuration: `${8 + (i * 2)}s`
                }}
              />
            ))}
          </div>

          {/* Drone Camera Frame */}
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute top-8 left-8 right-8 bottom-8 border border-white/30 rounded-lg">
              <div className="absolute top-4 left-4 w-2 h-2 bg-red-500 rounded-full animate-pulse" />
              <div className="absolute top-4 right-4 text-white/80 text-sm font-mono">
                REC • {parks[currentPark].name}
              </div>
              <div className="absolute bottom-4 left-4 text-white/80 text-sm font-mono">
                ALT: 150m • SPD: 25km/h
              </div>
              <div className="absolute bottom-4 right-4 text-white/80 text-sm font-mono">
                4K • 60fps
              </div>
            </div>
          </div>

          {/* Center Crosshair */}
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
            <div className="w-8 h-8 border border-white/50 rounded-full flex items-center justify-center">
              <div className="w-2 h-2 bg-white/70 rounded-full animate-pulse" />
            </div>
          </div>
        </div>
      </div>

      {/* Park Information Overlay */}
      <div className="absolute bottom-8 left-8 right-8 z-10">
        <div className="bg-black/50 backdrop-blur-md rounded-2xl p-6 text-white">
          <h2 className="text-4xl font-playfair font-bold mb-2">
            {parks[currentPark].name}
          </h2>
          <p className="text-lg opacity-90 mb-4">
            Experiencing the wild beauty from above • Drone altitude: 150 meters
          </p>
          
          {/* Progress Indicator */}
          <div className="flex gap-2">
            {parks.map((_, index) => (
              <div
                key={index}
                className={`h-1 rounded-full transition-all duration-300 ${
                  index === currentPark ? 'bg-white w-8' : 'bg-white/40 w-2'
                }`}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Audio Indicator */}
      {!isMuted && (
        <div className="absolute top-1/2 right-8 z-10 animate-volume-glow">
          <div className="flex flex-col gap-1">
            {[...Array(5)].map((_, i) => (
              <div
                key={i}
                className="w-1 bg-white/60 animate-pulse"
                style={{
                  height: `${8 + (i * 4)}px`,
                  animationDelay: `${i * 0.1}s`
                }}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default DroneFlythroughHero;
