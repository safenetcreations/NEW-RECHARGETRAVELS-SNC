import React from 'react';
import { Check, Star, Users, Calendar, MapPin, Crown } from 'lucide-react';
import { RamayanaPackage } from '@/hooks/useRamayanaData';

interface PackageComparisonProps {
  packages: RamayanaPackage[];
  onSelectPackage: (pkg: RamayanaPackage) => void;
}

const PackageComparison: React.FC<PackageComparisonProps> = ({ packages, onSelectPackage }) => {
  const vipPackages = packages.filter(pkg => pkg.tier === 'vip');
  const standardPackages = packages.filter(pkg => pkg.tier === 'standard');

  const renderPackageCard = (pkg: RamayanaPackage, isVip: boolean) => (
    <div 
      key={pkg.id}
      className={`relative bg-card rounded-xl border-2 transition-all duration-300 hover:shadow-xl transform hover:-translate-y-1 ${
        pkg.is_featured 
          ? 'border-primary shadow-lg' 
          : 'border-border'
      }`}
    >
      {/* Featured Badge */}
      {pkg.is_featured && (
        <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
          <div className="bg-primary text-primary-foreground px-4 py-1 rounded-full text-sm font-semibold flex items-center gap-1">
            <Star size={14} className="fill-current" />
            Most Popular
          </div>
        </div>
      )}

      {/* VIP Crown */}
      {isVip && (
        <div className="absolute top-4 right-4">
          <Crown className="text-primary" size={24} />
        </div>
      )}

      <div className="p-6">
        {/* Header */}
        <div className="text-center mb-6">
          <h3 className="text-xl font-bold text-card-foreground mb-2">{pkg.name}</h3>
          <p className="text-muted-foreground text-sm mb-4">{pkg.operator}</p>
          
          <div className="flex items-baseline justify-center gap-1 mb-2">
            <span className="text-3xl font-bold text-primary">${pkg.price_per_person}</span>
            <span className="text-muted-foreground text-sm">/person</span>
          </div>
          
          <div className="flex items-center justify-center gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-1">
              <Calendar size={14} />
              {pkg.duration_days} days
            </div>
            <div className="flex items-center gap-1">
              <Users size={14} />
              {pkg.min_participants}-{pkg.max_participants} pax
            </div>
          </div>
        </div>

        {/* Description */}
        {pkg.description && (
          <p className="text-muted-foreground text-sm mb-6 leading-relaxed">
            {pkg.description}
          </p>
        )}

        {/* Accommodation & Transport */}
        <div className="mb-6 space-y-3">
          {pkg.accommodation_type && (
            <div className="flex items-start gap-3">
              <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
              <div>
                <span className="font-medium text-card-foreground text-sm">Accommodation:</span>
                <span className="text-muted-foreground text-sm ml-2">{pkg.accommodation_type}</span>
              </div>
            </div>
          )}
          
          {pkg.transport_type && (
            <div className="flex items-start gap-3">
              <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
              <div>
                <span className="font-medium text-card-foreground text-sm">Transport:</span>
                <span className="text-muted-foreground text-sm ml-2">{pkg.transport_type}</span>
              </div>
            </div>
          )}
        </div>

        {/* Inclusions */}
        {pkg.inclusions && pkg.inclusions.length > 0 && (
          <div className="mb-6">
            <h4 className="font-semibold text-card-foreground mb-3 text-sm">Inclusions:</h4>
            <div className="space-y-2">
              {pkg.inclusions.slice(0, 4).map((inclusion, index) => (
                <div key={index} className="flex items-start gap-2">
                  <Check size={14} className="text-primary mt-0.5 flex-shrink-0" />
                  <span className="text-muted-foreground text-xs">{inclusion}</span>
                </div>
              ))}
              {pkg.inclusions.length > 4 && (
                <p className="text-muted-foreground text-xs italic">
                  +{pkg.inclusions.length - 4} more inclusions...
                </p>
              )}
            </div>
          </div>
        )}

        {/* Special Features */}
        {pkg.special_features && pkg.special_features.length > 0 && (
          <div className="mb-6">
            <h4 className="font-semibold text-card-foreground mb-3 text-sm">Special Features:</h4>
            <div className="space-y-2">
              {pkg.special_features.slice(0, 3).map((feature, index) => (
                <div key={index} className="flex items-start gap-2">
                  <Star size={14} className="text-primary mt-0.5 flex-shrink-0" />
                  <span className="text-muted-foreground text-xs">{feature}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Guide Languages */}
        {pkg.guide_languages && pkg.guide_languages.length > 0 && (
          <div className="mb-6">
            <h4 className="font-semibold text-card-foreground mb-2 text-sm">Guide Languages:</h4>
            <div className="flex flex-wrap gap-1">
              {pkg.guide_languages.map((lang, index) => (
                <span 
                  key={index}
                  className="px-2 py-1 bg-muted rounded text-xs text-muted-foreground"
                >
                  {lang}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Book Button */}
        <button
          onClick={() => onSelectPackage(pkg)}
          className={`w-full py-3 rounded-lg font-semibold transition-all ${
            pkg.is_featured
              ? 'bg-primary text-primary-foreground hover:bg-primary/90 shadow-lg'
              : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
          }`}
        >
          Select This Journey
        </button>
      </div>
    </div>
  );

  return (
    <section className="py-16 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-card-foreground mb-4">
            Sacred Pilgrimage Packages
          </h2>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            Choose from our carefully crafted spiritual journeys, each designed to provide a profound connection with the divine heritage of Lanka.
          </p>
        </div>

        {/* VIP Tier Packages */}
        {vipPackages.length > 0 && (
          <div className="mb-12">
            <div className="flex items-center justify-center gap-3 mb-8">
              <Crown className="text-primary" size={24} />
              <h3 className="text-2xl font-bold text-card-foreground">VIP Luxury Pilgrimages</h3>
              <Crown className="text-primary" size={24} />
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
              {vipPackages.map(pkg => renderPackageCard(pkg, true))}
            </div>
          </div>
        )}

        {/* Standard Tier Packages */}
        {standardPackages.length > 0 && (
          <div>
            <div className="text-center mb-8">
              <h3 className="text-2xl font-bold text-card-foreground">Standard Pilgrimages</h3>
              <p className="text-muted-foreground mt-2">Authentic spiritual experiences with local insights</p>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
              {standardPackages.map(pkg => renderPackageCard(pkg, false))}
            </div>
          </div>
        )}

        {/* Comparison Table for Desktop */}
        <div className="hidden lg:block mt-16">
          <h3 className="text-2xl font-bold text-center text-card-foreground mb-8">
            Package Comparison
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full bg-card rounded-lg overflow-hidden shadow-lg">
              <thead className="bg-muted">
                <tr>
                  <th className="px-6 py-4 text-left font-semibold text-card-foreground">Feature</th>
                  <th className="px-6 py-4 text-center font-semibold text-card-foreground">VIP Tier</th>
                  <th className="px-6 py-4 text-center font-semibold text-card-foreground">Standard Tier</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                <tr>
                  <td className="px-6 py-4 font-medium text-card-foreground">Accommodation</td>
                  <td className="px-6 py-4 text-center text-muted-foreground">4-star hotels & heritage properties</td>
                  <td className="px-6 py-4 text-center text-muted-foreground">3-star hotels & guesthouses</td>
                </tr>
                <tr className="bg-muted/50">
                  <td className="px-6 py-4 font-medium text-card-foreground">Transport</td>
                  <td className="px-6 py-4 text-center text-muted-foreground">Luxury AC coach / Mini bus</td>
                  <td className="px-6 py-4 text-center text-muted-foreground">AC van / Tourist vehicle</td>
                </tr>
                <tr>
                  <td className="px-6 py-4 font-medium text-card-foreground">Temple Access</td>
                  <td className="px-6 py-4 text-center text-muted-foreground">Exclusive early access</td>
                  <td className="px-6 py-4 text-center text-muted-foreground">Regular visiting hours</td>
                </tr>
                <tr className="bg-muted/50">
                  <td className="px-6 py-4 font-medium text-card-foreground">Group Size</td>
                  <td className="px-6 py-4 text-center text-muted-foreground">4-25 pilgrims</td>
                  <td className="px-6 py-4 text-center text-muted-foreground">2-20 pilgrims</td>
                </tr>
                <tr>
                  <td className="px-6 py-4 font-medium text-card-foreground">Price Range</td>
                  <td className="px-6 py-4 text-center text-primary font-semibold">$150 - $180/day</td>
                  <td className="px-6 py-4 text-center text-primary font-semibold">$100 - $130/day</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PackageComparison;