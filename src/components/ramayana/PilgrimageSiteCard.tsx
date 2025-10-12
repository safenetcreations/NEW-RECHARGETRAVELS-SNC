import React from 'react';
import { MapPin, Clock, Plus, Info } from 'lucide-react';
import { RamayanaSite } from '@/hooks/useRamayanaData';

interface PilgrimageSiteCardProps {
  site: RamayanaSite;
  onAddToTrail: (site: RamayanaSite) => void;
  onLearnMore: (site: RamayanaSite) => void;
  isInTrail?: boolean;
}

const PilgrimageSiteCard: React.FC<PilgrimageSiteCardProps> = ({ 
  site, 
  onAddToTrail, 
  onLearnMore,
  isInTrail = false 
}) => {
  return (
    <div className="bg-card rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border border-border">
      <div className="relative h-64 overflow-hidden">
        <img 
          src={site.hero_image_url || 'https://images.unsplash.com/photo-1466442929976-97f336a657be?w=600'} 
          alt={site.name}
          className="w-full h-full object-cover transition-transform duration-300 hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
        
        {/* Featured Badge */}
        {site.is_featured && (
          <div className="absolute top-4 left-4 bg-primary text-primary-foreground px-3 py-1 rounded-full text-sm font-semibold">
            ⭐ Featured
          </div>
        )}
        
        {/* Location */}
        <div className="absolute bottom-4 left-4 flex items-center gap-2 text-white">
          <MapPin size={16} />
          <span className="text-sm font-medium">{site.location}</span>
        </div>
      </div>

      <div className="p-6">
        <h3 className="text-xl font-bold text-card-foreground mb-2 line-clamp-1">
          {site.name}
        </h3>
        
        <p className="text-primary font-semibold mb-3 text-sm">
          {site.significance}
        </p>
        
        <p className="text-muted-foreground text-sm leading-relaxed mb-4 line-clamp-3">
          {site.mythology_story}
        </p>

        {/* Ritual Highlights */}
        {site.ritual_highlights && (
          <div className="mb-4">
            <h4 className="font-semibold text-card-foreground text-sm mb-2">Ritual Highlights:</h4>
            <p className="text-muted-foreground text-xs">{site.ritual_highlights}</p>
          </div>
        )}

        {/* Puja Timings */}
        {site.puja_timings && (
          <div className="flex items-center gap-2 mb-4 text-sm text-muted-foreground">
            <Clock size={14} />
            <span>{site.puja_timings}</span>
          </div>
        )}

        {/* Best Visit Times */}
        {site.best_visit_times && (
          <div className="mb-4 p-3 bg-muted/50 rounded-lg">
            <h4 className="font-medium text-card-foreground text-sm mb-1">Best Time to Visit:</h4>
            <p className="text-muted-foreground text-xs">{site.best_visit_times}</p>
          </div>
        )}

        {/* Special Requirements */}
        {site.special_requirements && (
          <div className="mb-4 p-3 bg-primary/5 rounded-lg border border-primary/20">
            <h4 className="font-medium text-primary text-sm mb-1">Requirements:</h4>
            <p className="text-muted-foreground text-xs">{site.special_requirements}</p>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex gap-3">
          <button
            onClick={() => onAddToTrail(site)}
            disabled={isInTrail}
            className={`flex-1 px-4 py-2 rounded-lg font-medium text-sm transition-colors flex items-center justify-center gap-2 ${
              isInTrail
                ? 'bg-muted text-muted-foreground cursor-not-allowed'
                : 'bg-primary text-primary-foreground hover:bg-primary/90'
            }`}
          >
            <Plus size={16} />
            {isInTrail ? 'In Trail' : 'Add to Trail'}
          </button>
          
          <button
            onClick={() => onLearnMore(site)}
            className="px-4 py-2 rounded-lg font-medium text-sm border border-border hover:bg-muted transition-colors flex items-center justify-center gap-2"
          >
            <Info size={16} />
            Learn More
          </button>
        </div>
      </div>
    </div>
  );
};

export default PilgrimageSiteCard;