
import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  Globe, 
  Play, 
  MapPin, 
  TreePine, 
  Camera, 
  Binoculars,
  Mountain,
  Star,
  ArrowRight,
  Eye,
  Radio
} from 'lucide-react';
import { nationalParks } from '@/data/wildlifeToursData';
import Interactive3DGlobe from '@/components/parks/Interactive3DGlobe';
import DroneFlythroughHero from '@/components/parks/DroneFlythroughHero';
import EnhancedParkCard from '@/components/parks/EnhancedParkCard';

const NationalParksOverview = () => {
  const [showImmersiveMode, setShowImmersiveMode] = useState(false);
  const [showGlobe, setShowGlobe] = useState(false);
  const [selectedProvince, setSelectedProvince] = useState('All Provinces');

  const provinces = ['All Provinces', 'Southern', 'Central', 'Northern', 'Eastern', 'Western', 'North Western', 'Uva', 'Sabaragamuwa'];
  
  const filteredParks = nationalParks.filter(park => 
    selectedProvince === 'All Provinces' || park.province === selectedProvince
  );

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "TouristAttraction",
    "name": "Sri Lanka National Parks & Reserves - 3D Tours & Live Cams",
    "description": "Explore Sri Lanka's national parks through immersive 3D tours, live wildlife cameras, and interactive experiences. Discover Yala, Wilpattu, Horton Plains and more.",
    "image": "https://images.unsplash.com/photo-1549366021-9f761d040a94?w=1200",
    "offers": nationalParks.map(park => ({
      "@type": "Offer",
      "name": `${park.name} Experience`,
      "price": park.fees.entrance_fee,
      "priceCurrency": "USD",
      "availability": "InStock"
    }))
  };

  return (
    <>
      <Helmet>
        <title>Sri Lanka National Parks & Reserves – 3D Tours & Live Cams | Recharge Travels</title>
        <meta 
          name="description" 
          content="Discover Yala, Wilpattu, Horton Plains and more in immersive 3D, live wildlife cams, dynamic maps and guided booking. Experience Sri Lanka's wild sanctuaries like never before." 
        />
        <meta name="keywords" content="Sri Lanka national parks, 3D tours, live wildlife cams, Yala leopards, Wilpattu elephants, Horton Plains, interactive maps, safari booking" />
        <script type="application/ld+json">
          {JSON.stringify(structuredData)}
        </script>
      </Helmet>

      <Header />

      {/* Immersive Drone Flythrough Hero */}
      {showImmersiveMode ? (
        <DroneFlythroughHero onExit={() => setShowImmersiveMode(false)} />
      ) : (
        <>
          {/* Hero Section */}
          <section className="relative min-h-screen overflow-hidden bg-gradient-to-br from-green-900 via-emerald-800 to-teal-900">
            {/* Animated Background */}
            <div className="absolute inset-0">
              <div className="absolute inset-0 bg-black/30" />
              <div className="absolute top-0 left-0 w-full h-full">
                <div className="animate-drone-flyby absolute w-16 h-16 bg-white/10 rounded-full blur-xl" 
                     style={{ animationDelay: '0s', animationDuration: '25s' }} />
                <div className="animate-drone-flyby absolute w-12 h-12 bg-emerald-400/20 rounded-full blur-lg" 
                     style={{ animationDelay: '8s', animationDuration: '30s' }} />
                <div className="animate-mist-float absolute w-32 h-32 bg-white/5 rounded-full blur-3xl top-1/4 left-1/3" />
                <div className="animate-mist-float absolute w-24 h-24 bg-green-300/10 rounded-full blur-2xl bottom-1/3 right-1/4" 
                     style={{ animationDelay: '4s' }} />
              </div>
            </div>

            {/* Hero Content */}
            <div className="relative z-10 flex items-center justify-center min-h-screen px-4">
              <div className="text-center text-white max-w-5xl mx-auto">
                <h1 className="text-6xl md:text-8xl font-playfair font-bold mb-6 animate-fade-in">
                  Sri Lanka's National Parks 
                  <span className="block text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-300">
                    & Reserves
                  </span>
                </h1>
                
                <p className="text-xl md:text-2xl mb-12 opacity-90 font-montserrat leading-relaxed animate-fade-in" style={{ animationDelay: '0.3s' }}>
                  Explore Wild Sanctuaries in 3D, Live Cams & Dynamic Maps
                </p>
                
                <div className="flex flex-col sm:flex-row gap-6 justify-center animate-fade-in" style={{ animationDelay: '0.6s' }}>
                  <Button 
                    size="lg"
                    onClick={() => setShowImmersiveMode(true)}
                    className="bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 px-8 py-4 text-lg font-semibold rounded-full shadow-2xl hover:shadow-emerald-500/25 transition-all duration-300 hover:scale-105 animate-volume-glow"
                  >
                    <Play className="w-6 h-6 mr-2" />
                    Enter the Wild
                  </Button>
                  
                  <Button 
                    variant="outline"
                    size="lg"
                    onClick={() => setShowGlobe(true)}
                    className="border-2 border-white/30 text-white hover:bg-white/10 px-8 py-4 text-lg font-semibold rounded-full backdrop-blur-sm"
                  >
                    <Globe className="w-6 h-6 mr-2" />
                    3D Globe View
                  </Button>
                </div>
              </div>
            </div>
          </section>

          {/* Interactive 3D Globe */}
          {showGlobe && (
            <Interactive3DGlobe 
              parks={nationalParks}
              onClose={() => setShowGlobe(false)}
              onParkSelect={(parkId) => {
                setShowGlobe(false);
                // Scroll to park card
                document.getElementById(`park-${parkId}`)?.scrollIntoView({ behavior: 'smooth' });
              }}
            />
          )}

          {/* Province Filter & Controls */}
          <section className="py-16 bg-gradient-to-b from-emerald-50 to-white">
            <div className="container mx-auto px-4">
              <div className="text-center mb-12">
                <h2 className="text-4xl md:text-5xl font-playfair font-bold text-gray-900 mb-6">
                  Discover Wild Sanctuaries
                </h2>
                <p className="text-xl text-gray-700 max-w-3xl mx-auto font-montserrat">
                  From leopard territories to elephant gatherings, explore Sri Lanka's most spectacular wildlife destinations through immersive technology.
                </p>
              </div>

              {/* Filter Controls */}
              <div className="flex flex-col md:flex-row gap-4 justify-center items-center mb-12">
                <select 
                  value={selectedProvince}
                  onChange={(e) => setSelectedProvince(e.target.value)}
                  className="px-6 py-3 rounded-full border-2 border-emerald-200 focus:border-emerald-500 focus:outline-none bg-white shadow-lg"
                >
                  {provinces.map(province => (
                    <option key={province} value={province}>{province}</option>
                  ))}
                </select>
                
                <Button
                  variant="outline"
                  onClick={() => setShowGlobe(true)}
                  className="border-emerald-200 text-emerald-700 hover:bg-emerald-50 px-6 py-3 rounded-full"
                >
                  <Globe className="w-5 h-5 mr-2" />
                  Panorama Mode
                </Button>
              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-16">
                <div className="text-center">
                  <div className="text-4xl font-bold text-emerald-600 mb-2">{nationalParks.length}+</div>
                  <div className="text-gray-600">Protected Areas</div>
                </div>
                <div className="text-center">
                  <div className="text-4xl font-bold text-emerald-600 mb-2">100+</div>
                  <div className="text-gray-600">Wildlife Species</div>
                </div>
                <div className="text-center">
                  <div className="text-4xl font-bold text-emerald-600 mb-2">12</div>
                  <div className="text-gray-600">Live Cameras</div>
                </div>
                <div className="text-center">
                  <div className="text-4xl font-bold text-emerald-600 mb-2">24/7</div>
                  <div className="text-gray-600">Wildlife Monitoring</div>
                </div>
              </div>
            </div>
          </section>

          {/* Enhanced Park Cards Grid */}
          <section className="py-20 bg-white">
            <div className="container mx-auto px-4">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredParks.map((park) => (
                  <EnhancedParkCard 
                    key={park.id}
                    park={park}
                  />
                ))}
              </div>
            </div>
          </section>

          {/* Call to Action */}
          <section className="py-16 bg-gradient-to-r from-emerald-600 to-teal-600 text-white">
            <div className="container mx-auto px-4 text-center">
              <h2 className="text-4xl md:text-5xl font-playfair font-bold mb-6">
                Ready for Your Wild Adventure?
              </h2>
              <p className="text-xl mb-8 max-w-2xl mx-auto opacity-90">
                Experience Sri Lanka's incredible wildlife through cutting-edge technology and immersive experiences.
              </p>
              <Button 
                size="lg"
                onClick={() => setShowImmersiveMode(true)}
                className="bg-white text-emerald-600 hover:bg-gray-100 px-8 py-4 text-lg font-semibold rounded-full transition-all duration-300 hover:scale-105"
              >
                <TreePine className="w-5 h-5 mr-2" />
                Start Your Journey
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </div>
          </section>
        </>
      )}

      <Footer />
    </>
  );
};

export default NationalParksOverview;
