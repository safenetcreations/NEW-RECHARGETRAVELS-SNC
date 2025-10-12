
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { TreePine, Map } from 'lucide-react';
import { type WildlifeLocation } from '../data/wildlifeMapData';

interface WildlifeToursSectionProps {
  leopardSpots: WildlifeLocation[];
  elephantSpots: WildlifeLocation[];
  whalewatchingSites: WildlifeLocation[];
  onSelectTour: (location: WildlifeLocation) => void;
}

const WildlifeToursSection = ({ 
  leopardSpots, 
  elephantSpots, 
  whalewatchingSites, 
  onSelectTour 
}: WildlifeToursSectionProps) => {
  return (
    <section id="tours" className="wildlife-float">
      <Card className="border-2 border-jungle-green/20 shadow-xl bg-white/90 backdrop-blur-sm">
        <CardHeader className="bg-gradient-to-r from-jungle-green to-peacock-teal text-white">
          <CardTitle className="text-2xl font-chakra font-bold flex items-center">
            <TreePine className="mr-3 h-6 w-6" />
            Wildlife Adventures
          </CardTitle>
          <p className="text-jungle-green-100">Discover Sri Lanka's wildlife hotspots</p>
        </CardHeader>
        <CardContent className="p-6">
          <div className="space-y-6">
            
            {/* Leopard Spotting */}
            <div className="space-y-3">
              <h4 className="font-chakra font-bold text-wild-orange flex items-center">
                🐆 Leopard Spotting
              </h4>
              {leopardSpots.map(location => (
                <div key={location.id} className="flex items-center justify-between p-3 rounded-xl border-2 border-wild-orange/20 hover:border-wild-orange/40 hover:bg-wild-orange/5 transition-all duration-300 wildlife-ripple group">
                  <div className="flex-1">
                    <p className="font-dm-sans font-semibold text-granite-gray group-hover:text-wild-orange transition-colors">{location.name}</p>
                    <p className="text-sm text-granite-gray/70 font-inter">{location.wildlifeInfo}</p>
                  </div>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => onSelectTour(location)}
                    className="border-wild-orange text-wild-orange hover:bg-wild-orange hover:text-white wildlife-ripple"
                  >
                    <Map className="h-4 w-4 mr-2" />
                    View
                  </Button>
                </div>
              ))}
            </div>

            {/* Elephant Encounters */}
            <div className="space-y-3">
              <h4 className="font-chakra font-bold text-jungle-green flex items-center">
                🐘 Elephant Encounters
              </h4>
              {elephantSpots.map(location => (
                <div key={location.id} className="flex items-center justify-between p-3 rounded-xl border-2 border-jungle-green/20 hover:border-jungle-green/40 hover:bg-jungle-green/5 transition-all duration-300 wildlife-ripple group">
                  <div className="flex-1">
                    <p className="font-dm-sans font-semibold text-granite-gray group-hover:text-jungle-green transition-colors">{location.name}</p>
                    <p className="text-sm text-granite-gray/70 font-inter">{location.wildlifeInfo}</p>
                  </div>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => onSelectTour(location)}
                    className="border-jungle-green text-jungle-green hover:bg-jungle-green hover:text-white wildlife-ripple"
                  >
                    <Map className="h-4 w-4 mr-2" />
                    View
                  </Button>
                </div>
              ))}
            </div>

            {/* Whale Watching */}
            <div className="space-y-3">
              <h4 className="font-chakra font-bold text-ocean-deep flex items-center">
                🐋 Whale Watching
              </h4>
              {whalewatchingSites.map(location => (
                <div key={location.id} className="flex items-center justify-between p-3 rounded-xl border-2 border-ocean-deep/20 hover:border-ocean-deep/40 hover:bg-ocean-deep/5 transition-all duration-300 wildlife-ripple group">
                  <div className="flex-1">
                    <p className="font-dm-sans font-semibold text-granite-gray group-hover:text-ocean-deep transition-colors">{location.name}</p>
                    <p className="text-sm text-granite-gray/70 font-inter">{location.wildlifeInfo}</p>
                  </div>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => onSelectTour(location)}
                    className="border-ocean-deep text-ocean-deep hover:bg-ocean-deep hover:text-white wildlife-ripple"
                  >
                    <Map className="h-4 w-4 mr-2" />
                    View
                  </Button>
                </div>
              ))}
            </div>

          </div>
        </CardContent>
      </Card>
    </section>
  );
};

export default WildlifeToursSection;
