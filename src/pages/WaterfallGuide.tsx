
import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { DroneFlythroughHero } from '@/components/waterfalls/DroneFlythroughHero';
import { WaterfallCard3D } from '@/components/waterfalls/WaterfallCard3D';
import { ProvinceFilter3D } from '@/components/waterfalls/ProvinceFilter3D';
import { LiveFlowMeter } from '@/components/waterfalls/LiveFlowMeter';
import { waterfallLocations, getWaterfallsByProvince, getAllProvinces } from '@/data/locations/waterfalls';
import { type EnhancedWildlifeLocation } from '@/data/enhancedWildlifeData';
import { Play, Camera, MapPin, Clock, Users, Star } from 'lucide-react';

export default function WaterfallGuide() {
  const [selectedProvince, setSelectedProvince] = useState('all');
  const [heightRange, setHeightRange] = useState<[number, number]>([0, 300]);
  const [isPanoramaMode, setIsPanoramaMode] = useState(false);
  const [selectedWaterfall, setSelectedWaterfall] = useState<EnhancedWildlifeLocation | null>(null);
  const [viewingStats, setViewingStats] = useState({
    watching: 2400 + Math.floor(Math.random() * 600),
    totalViews: 156789
  });

  useEffect(() => {
    const interval = setInterval(() => {
      setViewingStats(prev => ({
        watching: prev.watching + Math.floor(Math.random() * 20) - 10,
        totalViews: prev.totalViews + Math.floor(Math.random() * 5)
      }));
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const filteredWaterfalls = waterfallLocations.filter(waterfall => {
    const provinceMatch = selectedProvince === 'all' || waterfall.province === selectedProvince;
    const heightMatch = (waterfall.height || 0) >= heightRange[0] && (waterfall.height || 0) <= heightRange[1];
    return provinceMatch && heightMatch;
  });

  const handleExplore3D = (waterfall: EnhancedWildlifeLocation) => {
    setSelectedWaterfall(waterfall);
    // In a real implementation, this would open a 3D viewer modal
    console.log('Opening 3D view for:', waterfall.name);
  };

  const handleViewLive = (waterfall: EnhancedWildlifeLocation) => {
    setSelectedWaterfall(waterfall);
    // In a real implementation, this would open a live stream modal
    console.log('Opening live view for:', waterfall.name);
  };

  const handleWatchLive = () => {
    // Open live stream interface
    console.log('Opening main live stream');
  };

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "TouristAttraction",
    "name": "Sri Lanka's Top 20 Waterfalls",
    "description": "Experience Sri Lanka's highest and most breathtaking waterfalls in immersive 3D, drone footage, and live feeds—book your guided adventure.",
    "url": "https://preview--rechargeravels.lovable.app/tours/waterfalls",
    "image": "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1200&h=630&fit=crop",
    "geo": {
      "@type": "GeoCoordinates",
      "latitude": 6.9271,
      "longitude": 79.8612
    },
    "offers": {
      "@type": "Offer",
      "priceCurrency": "USD",
      "price": "75",
      "description": "Guided waterfall tours starting from $75"
    }
  };

  return (
    <>
      <Helmet>
        <title>Top 20 Waterfalls in Sri Lanka – 3D Fly-Through & Live Streams | RechargeRavels</title>
        <meta 
          name="description" 
          content="Experience Sri Lanka's highest and most breathtaking waterfalls in immersive 3D, drone footage, and live feeds—book your guided adventure." 
        />
        <meta name="keywords" content="Sri Lanka waterfalls, 3D drone tours, live waterfall streams, Bambarakanda Falls, Diyaluma Falls, waterfall guide" />
        <meta property="og:title" content="Sri Lanka's Top 20 Waterfalls - 3D Experience" />
        <meta property="og:description" content="Immersive 3D drone footage and live streams of Sri Lanka's most spectacular waterfalls" />
        <meta property="og:image" content="https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1200&h=630&fit=crop" />
        <meta property="og:type" content="website" />
        <script type="application/ld+json">
          {JSON.stringify(structuredData)}
        </script>
      </Helmet>

      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
        {/* Hero Section with 3D Drone Flyby */}
        <DroneFlythroughHero onWatchLive={handleWatchLive} />

        <div className="container mx-auto px-4 py-16 space-y-16">
          {/* Live Stats Bar */}
          <div className="bg-gradient-to-r from-slate-900 via-blue-900 to-teal-900 text-white rounded-2xl p-6 shadow-2xl">
            <div className="flex flex-col md:flex-row items-center justify-between space-y-4 md:space-y-0">
              <div className="flex items-center space-x-6">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse" />
                  <span className="font-bold">LIVE NOW</span>
                </div>
                <div className="flex items-center space-x-4 text-sm">
                  <div className="flex items-center space-x-1">
                    <Users className="w-4 h-4" />
                    <span>{viewingStats.watching.toLocaleString()} watching</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Play className="w-4 h-4" />
                    <span>{viewingStats.totalViews.toLocaleString()} total views</span>
                  </div>
                </div>
              </div>
              <Badge className="bg-gradient-to-r from-gold to-yellow-400 text-black font-bold px-4 py-2">
                <Star className="w-4 h-4 mr-1" />
                4.9/5 Rating • 1,247 Reviews
              </Badge>
            </div>
          </div>

          {/* Province Filters & 3D Map */}
          <section>
            <ProvinceFilter3D
              selectedProvince={selectedProvince}
              heightRange={heightRange}
              onProvinceChange={setSelectedProvince}
              onHeightRangeChange={setHeightRange}
              onTogglePanorama={() => setIsPanoramaMode(!isPanoramaMode)}
              isPanoramaMode={isPanoramaMode}
            />
          </section>

          {/* Results Summary */}
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-3xl font-bold text-slate-800">
                Interactive 3D Waterfall Directory
              </h2>
              <p className="text-slate-600 mt-2">
                Showing {filteredWaterfalls.length} waterfalls
                {selectedProvince !== 'all' && ` in ${selectedProvince}`}
                {(heightRange[0] > 0 || heightRange[1] < 300) && 
                  ` • Height: ${heightRange[0]}m - ${heightRange[1]}m`
                }
              </p>
            </div>
            <div className="flex items-center space-x-2">
              <Camera className="w-5 h-5 text-blue-500" />
              <span className="text-sm text-slate-600">All with 3D views available</span>
            </div>
          </div>

          {/* Featured Live Flow Meter */}
          {selectedWaterfall && (
            <section className="max-w-md">
              <LiveFlowMeter 
                waterfallName={selectedWaterfall.name}
                currentFlow={2.3 + Math.random() * 1.5}
              />
            </section>
          )}

          {/* 3D Waterfall Grid */}
          <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredWaterfalls.map((waterfall) => (
              <WaterfallCard3D
                key={waterfall.id}
                waterfall={waterfall}
                onExplore3D={handleExplore3D}
                onViewLive={handleViewLive}
              />
            ))}
          </section>

          {/* Additional Features */}
          <section className="bg-gradient-to-r from-blue-600 via-teal-600 to-green-600 text-white rounded-2xl p-8 text-center">
            <h3 className="text-3xl font-bold mb-4">Experience More</h3>
            <p className="text-lg mb-6 opacity-90">
              Book guided tours, access VR experiences, and get real-time weather updates
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-4">
              <Button size="lg" className="bg-white text-blue-600 hover:bg-blue-50 font-bold px-8 py-3">
                <MapPin className="w-5 h-5 mr-2" />
                Book Guided Tours
              </Button>
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10 px-8 py-3">
                <Clock className="w-5 h-5 mr-2" />
                Check Weather Conditions
              </Button>
            </div>
          </section>

          {/* SEO Content */}
          <section className="prose prose-slate max-w-4xl mx-auto">
            <h2>Discover Sri Lanka's Most Spectacular Waterfalls</h2>
            <p>
              Sri Lanka is home to some of the world's most breathtaking waterfalls, from the towering 
              263-meter Bambarakanda Falls to the mystical Ravana Falls of ancient legend. Our 
              revolutionary 3D drone technology and live streaming capabilities allow you to experience 
              these natural wonders like never before.
            </p>
            <p>
              Each waterfall in our collection features immersive 3D fly-through experiences, 
              real-time flow meters, and detailed trail information to help you plan your perfect 
              waterfall adventure in Sri Lanka.
            </p>
          </section>
        </div>
      </div>
    </>
  );
}
