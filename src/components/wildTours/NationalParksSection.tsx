
import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { 
  MapPin, 
  Clock, 
  DollarSign, 
  Star, 
  Users, 
  Camera,
  Binoculars,
  TreePine,
  Mountain,
  Waves,
  ExternalLink,
  Youtube,
  Newspaper,
  Navigation,
  Calendar,
  Info,
  Globe,
  Play,
  Radio,
  Eye
} from 'lucide-react';
import { nationalParks, sriLankanProvinces, type NationalPark } from '@/data/wildlifeToursData';
import { Link } from 'react-router-dom';
import Interactive3DGlobe from '@/components/parks/Interactive3DGlobe';
import DroneFlythroughHero from '@/components/parks/DroneFlythroughHero';

interface NationalParksSectionProps {
  selectedPark?: string;
  onParkSelect?: (parkId: string) => void;
}

const getAttractionIcon = (attraction: string) => {
  const iconMap: { [key: string]: React.ReactNode } = {
    'elephants': <Users className="w-4 h-4 text-amber-600" />,
    'leopards': <Binoculars className="w-4 h-4 text-orange-600" />,
    'birds': <TreePine className="w-4 h-4 text-green-600" />,
    'endemic birds': <TreePine className="w-4 h-4 text-green-600" />,
    'waterfalls': <Waves className="w-4 h-4 text-blue-600" />,
    'worlds end': <Mountain className="w-4 h-4 text-purple-600" />,
    'orchids': <Star className="w-4 h-4 text-pink-600" />,
    'medicinal plants': <TreePine className="w-4 h-4 text-green-700" />,
    'historical ruins': <Mountain className="w-4 h-4 text-amber-700" />,
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

const NationalParksSection: React.FC<NationalParksSectionProps> = ({ 
  selectedPark, 
  onParkSelect 
}) => {
  const [selectedProvince, setSelectedProvince] = useState('All Provinces');
  const [startLocation, setStartLocation] = useState('');
  const [showGlobe, setShowGlobe] = useState(false);
  const [showImmersiveMode, setShowImmersiveMode] = useState(false);

  const filteredParks = useMemo(() => {
    if (selectedProvince === 'All Provinces') {
      return nationalParks;
    }
    return nationalParks.filter(park => park.province === selectedProvince);
  }, [selectedProvince]);

  const calculateDistance = (park: NationalPark) => {
    // Simplified distance calculation - in a real app, you'd use actual geolocation
    if (!startLocation) return null;
    
    const distances = {
      'colombo': park.location.distanceFromColombo,
      'kandy': Math.abs(park.location.distanceFromColombo - 116),
      'galle': Math.abs(park.location.distanceFromColombo - 119),
      'negombo': Math.abs(park.location.distanceFromColombo - 37)
    };
    
    const location = startLocation.toLowerCase();
    const distance = distances[location as keyof typeof distances] || park.location.distanceFromColombo;
    const travelTime = Math.round(distance / 60 * 100) / 100; // Rough estimate: 60km/h average
    
    return { distance, travelTime };
  };

  return (
    <>
      {/* Immersive Drone Flythrough */}
      {showImmersiveMode && (
        <DroneFlythroughHero onExit={() => setShowImmersiveMode(false)} />
      )}

      {/* Interactive 3D Globe */}
      {showGlobe && (
        <Interactive3DGlobe 
          parks={nationalParks}
          onClose={() => setShowGlobe(false)}
          onParkSelect={(parkId) => {
            setShowGlobe(false);
            onParkSelect?.(parkId);
            // Scroll to park card
            document.getElementById(`park-${parkId}`)?.scrollIntoView({ behavior: 'smooth' });
          }}
        />
      )}

      <section id="national-parks" className="py-20 bg-gradient-to-b from-green-50/30 to-emerald-50/50 relative overflow-hidden">
        {/* Animated Background Elements */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="animate-drone-flyby absolute w-16 h-16 bg-emerald-200/20 rounded-full blur-xl" 
               style={{ animationDelay: '0s', animationDuration: '25s' }} />
          <div className="animate-mist-float absolute w-32 h-32 bg-green-300/10 rounded-full blur-3xl top-1/4 right-1/4" />
          <div className="animate-3d-rotate absolute w-20 h-20 border border-emerald-200/30 rounded-full top-3/4 left-1/4" 
               style={{ animationDuration: '15s' }} />
        </div>

        <div className="container mx-auto px-4 relative z-10">
          {/* Section Header */}
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-playfair font-bold text-gray-900 mb-6 animate-fade-in">
              Explore Sri Lanka's National Parks & Nature Reserves
            </h2>
            <p className="text-xl text-gray-700 max-w-4xl mx-auto font-montserrat leading-relaxed mb-8 animate-fade-in" style={{ animationDelay: '0.2s' }}>
              Experience wild sanctuaries through immersive 3D tours, live wildlife cameras, and interactive technology—each with real-time updates, detailed maps, and seamless booking.
            </p>
            
            {/* Immersive Experience Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8 animate-fade-in" style={{ animationDelay: '0.4s' }}>
              <Button 
                size="lg"
                onClick={() => setShowImmersiveMode(true)}
                className="bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 px-8 py-4 text-lg font-semibold rounded-full shadow-lg hover:shadow-emerald-500/25 transition-all duration-300 hover:scale-105 animate-volume-glow"
              >
                <Play className="w-5 h-5 mr-2" />
                3D Drone Experience
              </Button>
              
              <Button 
                variant="outline"
                size="lg"
                onClick={() => setShowGlobe(true)}
                className="border-2 border-emerald-300 text-emerald-700 hover:bg-emerald-50 px-8 py-4 text-lg font-semibold rounded-full backdrop-blur-sm"
              >
                <Globe className="w-5 h-5 mr-2" />
                Interactive Globe
              </Button>
            </div>
            
            {/* Filter Controls */}
            <div className="flex flex-col md:flex-row gap-4 justify-center items-center max-w-2xl mx-auto animate-fade-in" style={{ animationDelay: '0.6s' }}>
              <div className="flex-1 w-full md:w-auto">
                <Select value={selectedProvince} onValueChange={setSelectedProvince}>
                  <SelectTrigger className="w-full bg-white/80 backdrop-blur-sm border-emerald-200 focus:border-emerald-500">
                    <SelectValue placeholder="Select Province" />
                  </SelectTrigger>
                  <SelectContent>
                    {sriLankanProvinces.map((province) => (
                      <SelectItem key={province} value={province}>
                        {province}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="flex-1 w-full md:w-auto">
                <Input
                  placeholder="Enter your start location (e.g., Colombo)"
                  value={startLocation}
                  onChange={(e) => setStartLocation(e.target.value)}
                  className="w-full bg-white/80 backdrop-blur-sm border-emerald-200 focus:border-emerald-500"
                />
              </div>
            </div>
          </div>

          {/* Enhanced Parks Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredParks.map((park, index) => {
              const distanceInfo = calculateDistance(park);
              const isLiveCamOnline = Math.random() > 0.3; // 70% online rate
              
              return (
                <Card 
                  key={park.id}
                  id={`park-${park.id}`}
                  className={`overflow-hidden hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-4 cursor-pointer bg-white/90 backdrop-blur-sm border-2 group animate-fade-in ${
                    selectedPark === park.id ? 'ring-2 ring-emerald-500 border-emerald-300' : 'border-gray-200 hover:border-emerald-300'
                  }`}
                  style={{ animationDelay: `${index * 0.1}s` }}
                  onClick={() => onParkSelect?.(park.id)}
                >
                  {/* Enhanced Hero Image with 3D Effects */}
                  <div className="relative h-48 bg-gradient-to-br from-green-400 to-emerald-600 overflow-hidden">
                    {park.images[0] && (
                      <img 
                        src={park.images[0]} 
                        alt={park.name}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 group-hover:animate-3d-rotate"
                      />
                    )}
                    
                    {/* 3D Overlay Effects */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
                    <div className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                      <div className="absolute top-4 left-4 w-6 h-6 bg-white/30 rounded-full animate-mist-float" />
                      <div className="absolute bottom-4 right-4 w-4 h-4 bg-emerald-300/40 rounded-full animate-mist-float" style={{ animationDelay: '1s' }} />
                    </div>

                    {/* Badges */}
                    <div className="absolute top-4 right-4 flex flex-col gap-2">
                      <Badge className={`${getClassificationColor(park.classification)} backdrop-blur-sm`}>
                        {park.classification}
                      </Badge>
                      {park.featured && (
                        <Badge className="bg-yellow-100/90 text-yellow-800 border-yellow-200 backdrop-blur-sm">
                          <Star className="w-3 h-3 mr-1" />
                          Featured
                        </Badge>
                      )}
                    </div>

                    {/* Live Cam Status */}
                    <div className="absolute top-4 left-4">
                      {isLiveCamOnline ? (
                        <Badge className="bg-red-500/90 text-white animate-pulse live-indicator backdrop-blur-sm">
                          <Radio className="w-3 h-3 mr-1" />
                          Live
                        </Badge>
                      ) : (
                        <Badge className="bg-gray-500/90 text-white backdrop-blur-sm">
                          <Radio className="w-3 h-3 mr-1" />
                          Offline
                        </Badge>
                      )}
                    </div>

                    {/* 3D Tour Overlay */}
                    <div className="absolute inset-0 flex items-center justify-center bg-black/30 opacity-0 group-hover:opacity-100 transition-all duration-300">
                      <Button 
                        size="lg"
                        className="bg-white/90 text-emerald-700 hover:bg-white rounded-full px-6 py-3 font-semibold backdrop-blur-sm transform scale-0 group-hover:scale-100 transition-transform duration-300"
                      >
                        <Play className="w-5 h-5 mr-2" />
                        3D Preview
                      </Button>
                    </div>
                  </div>

                  <CardHeader>
                    <CardTitle className="text-xl font-playfair flex items-center justify-between">
                      {park.name}
                      <div className="flex gap-2">
                        {isLiveCamOnline && (
                          <Button
                            size="sm"
                            variant="outline"
                            className="border-red-200 text-red-600 hover:bg-red-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
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
                    {/* Key Attractions Icons with 3D Effects */}
                    <div className="flex flex-wrap gap-2">
                      {park.attractions.slice(0, 5).map((attraction, index) => (
                        <div 
                          key={index}
                          className="flex items-center gap-1 bg-emerald-50 px-3 py-1 rounded-full text-xs border border-emerald-100 hover:bg-emerald-100 transition-colors duration-200 hover:scale-105 transform"
                          title={attraction}
                        >
                          {getAttractionIcon(attraction)}
                          <span className="capitalize font-medium">{attraction}</span>
                        </div>
                      ))}
                    </div>

                    {/* Distance Info with Enhanced Styling */}
                    {distanceInfo && (
                      <div className="bg-gradient-to-r from-blue-50 to-cyan-50 p-3 rounded-lg border border-blue-100">
                        <div className="flex items-center justify-between text-sm">
                          <span className="flex items-center text-blue-700 font-medium">
                            <Navigation className="w-4 h-4 mr-1" />
                            Distance: {distanceInfo.distance} km
                          </span>
                          <span className="flex items-center text-blue-700 font-medium">
                            <Clock className="w-4 h-4 mr-1" />
                            Journey: {distanceInfo.travelTime} hrs
                          </span>
                        </div>
                      </div>
                    )}

                    {/* Enhanced Live Features */}
                    <div className="flex flex-wrap gap-2">
                      <Button variant="outline" size="sm" className="flex items-center gap-1 hover:bg-emerald-50 border-emerald-200" asChild>
                        <a href={park.liveFeatures.googleMapsUrl} target="_blank" rel="noopener noreferrer">
                          <MapPin className="w-3 h-3" />
                          Live Map
                        </a>
                      </Button>
                      
                      {park.liveFeatures.youtubePlaylist && (
                        <Button variant="outline" size="sm" className="flex items-center gap-1 hover:bg-red-50 border-red-200" asChild>
                          <a href={park.liveFeatures.youtubePlaylist} target="_blank" rel="noopener noreferrer">
                            <Youtube className="w-3 h-3" />
                            Videos
                          </a>
                        </Button>
                      )}
                      
                      {isLiveCamOnline && (
                        <Button variant="outline" size="sm" className="flex items-center gap-1 hover:bg-purple-50 border-purple-200">
                          <Camera className="w-3 h-3" />
                          Live Cam
                        </Button>
                      )}
                    </div>

                    {/* Enhanced Pricing Info */}
                    <div className="bg-gradient-to-r from-gray-50 to-emerald-50 p-3 rounded-lg border border-gray-200">
                      <div className="flex items-center justify-between text-sm">
                        <span className="flex items-center text-emerald-700 font-semibold">
                          <DollarSign className="w-4 h-4 mr-1" />
                          From ${park.fees.entrance_fee}
                        </span>
                        <span className="flex items-center text-gray-700">
                          <Clock className="w-4 h-4 mr-1" />
                          {park.operatingHours.split(' - ')[0]}
                        </span>
                      </div>
                    </div>

                    {/* Best Time to Visit */}
                    <div className="flex items-center text-sm text-amber-700 bg-gradient-to-r from-amber-50 to-orange-50 p-2 rounded border border-amber-200">
                      <Calendar className="w-4 h-4 mr-2" />
                      <span>Best: {park.bestTimeToVisit}</span>
                    </div>

                    {/* Enhanced Action Buttons */}
                    <div className="flex gap-2 pt-4">
                      <Button className="flex-1 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 rounded-full transition-all duration-300 hover:scale-105" asChild>
                        <Link to={`/tours/wildtours/parks/${park.slug}`}>
                          <Mountain className="w-4 h-4 mr-2" />
                          3D Experience
                        </Link>
                      </Button>
                      {park.bookingAvailable && (
                        <Button variant="outline" className="flex items-center gap-1 border-emerald-200 text-emerald-700 hover:bg-emerald-50 rounded-full">
                          <Calendar className="w-4 h-4" />
                          Book Safari
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {/* Enhanced View All Parks CTA */}
          <div className="text-center mt-16">
            <div className="bg-gradient-to-r from-emerald-100 to-teal-100 rounded-2xl p-8 border-2 border-emerald-200">
              <h3 className="text-3xl font-playfair font-bold text-gray-900 mb-4">
                Ready for the Ultimate Wildlife Experience?
              </h3>
              <p className="text-lg text-gray-700 mb-6 max-w-2xl mx-auto">
                Explore all parks with our immersive 3D tours, live wildlife cameras, and custom safari planning.
              </p>
              <Button size="lg" className="px-8 py-4 text-lg bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 rounded-full transition-all duration-300 hover:scale-105" asChild>
                <Link to="/tours/wildtours/parks">
                  <TreePine className="w-5 h-5 mr-2" />
                  Enter Full Experience
                  <Play className="w-5 h-5 ml-2" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default NationalParksSection;
