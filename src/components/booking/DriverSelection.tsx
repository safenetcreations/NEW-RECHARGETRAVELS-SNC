import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Star, Car, MapPin, Languages, CheckCircle, ChevronDown, ChevronUp, User } from 'lucide-react';
import { fetchDrivers, fetchAvailabilityPreview } from '@/services/driverDirectoryService';
import { getDriverBadges } from '@/services/driverBadgeService';
import { Driver, DriverBadge, BADGE_DEFINITIONS } from '@/types/driver';

interface DriverSelectionProps {
  selectedDriverId: string;
  onSelect: (driverId: string) => void;
  tripDate?: string;
  className?: string;
}

interface DriverWithBadges extends Driver {
  badges?: DriverBadge[];
  isAvailable?: boolean;
}

const DriverSelection: React.FC<DriverSelectionProps> = ({
  selectedDriverId,
  onSelect,
  tripDate,
  className = ''
}) => {
  const [drivers, setDrivers] = useState<DriverWithBadges[]>([]);
  const [isExpanded, setIsExpanded] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'top_rated' | 'verified'>('all');

  useEffect(() => {
    loadDrivers();
  }, []);

  const loadDrivers = async () => {
    setIsLoading(true);
    try {
      const driverList = await fetchDrivers({ minRating: 4 });

      // Enrich drivers with badges
      const enrichedDrivers = await Promise.all(
        driverList.map(async (driver) => {
          try {
            const badges = await getDriverBadges(driver.id);
            return { ...driver, badges };
          } catch {
            return { ...driver, badges: [] };
          }
        })
      );

      setDrivers(enrichedDrivers);
    } catch (error) {
      console.error('Failed to load drivers:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const filteredDrivers = drivers.filter(driver => {
    if (filter === 'top_rated') return (driver.average_rating || 0) >= 4.8;
    if (filter === 'verified') return driver.current_status === 'verified';
    return true;
  });

  const selectedDriver = drivers.find(d => d.id === selectedDriverId);

  const getTierLabel = (tier?: string) => {
    switch (tier) {
      case 'chauffeur_guide': return 'Chauffeur Guide';
      case 'national_guide': return 'National Guide';
      case 'tourist_driver': return 'Tourist Driver';
      case 'freelance_driver': return 'Freelance Driver';
      default: return 'Driver';
    }
  };

  const getTierColor = (tier?: string) => {
    switch (tier) {
      case 'chauffeur_guide': return 'bg-amber-100 text-amber-800';
      case 'national_guide': return 'bg-purple-100 text-purple-800';
      case 'tourist_driver': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (isLoading) {
    return (
      <div className={`bg-gray-50 rounded-xl p-4 animate-pulse ${className}`}>
        <div className="h-6 bg-gray-200 rounded w-1/3 mb-4"></div>
        <div className="space-y-3">
          <div className="h-20 bg-gray-200 rounded"></div>
          <div className="h-20 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div className={`space-y-3 ${className}`}>
      <div
        className="flex items-center justify-between cursor-pointer group"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center gap-2">
          <Car className="w-5 h-5 text-teal-600" />
          <span className="font-medium text-gray-800">Preferred Driver</span>
          <span className="text-sm text-gray-500">(optional)</span>
        </div>
        <button className="p-1 hover:bg-gray-100 rounded-lg transition-colors">
          {isExpanded ? (
            <ChevronUp className="w-5 h-5 text-gray-500" />
          ) : (
            <ChevronDown className="w-5 h-5 text-gray-500" />
          )}
        </button>
      </div>

      {/* Selected Driver Preview */}
      {!isExpanded && selectedDriverId && selectedDriver && (
        <div className="bg-teal-50 border border-teal-200 rounded-xl p-3 flex items-center gap-3">
          <div className="w-12 h-12 rounded-full overflow-hidden bg-gray-200 flex-shrink-0">
            {selectedDriver.profile_photo ? (
              <img
                src={selectedDriver.profile_photo}
                alt={selectedDriver.full_name}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <User className="w-6 h-6 text-gray-400" />
              </div>
            )}
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-medium text-gray-900 truncate">{selectedDriver.full_name}</p>
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
              <span>{selectedDriver.average_rating?.toFixed(1) || '5.0'}</span>
              <span className="text-gray-400">|</span>
              <span>{getTierLabel(selectedDriver.tier)}</span>
            </div>
          </div>
          <CheckCircle className="w-5 h-5 text-teal-600" />
        </div>
      )}

      {/* No Selection Default */}
      {!isExpanded && !selectedDriverId && (
        <div
          className="bg-gray-50 border border-gray-200 rounded-xl p-3 flex items-center gap-3 cursor-pointer hover:bg-gray-100 transition-colors"
          onClick={() => setIsExpanded(true)}
        >
          <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center flex-shrink-0">
            <User className="w-6 h-6 text-gray-400" />
          </div>
          <div className="flex-1">
            <p className="font-medium text-gray-700">No preference</p>
            <p className="text-sm text-gray-500">We'll match you with the best available driver</p>
          </div>
        </div>
      )}

      {/* Expanded Driver Selection */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            {/* Filter Tabs */}
            <div className="flex gap-2 mb-4">
              {[
                { id: 'all', label: 'All Drivers' },
                { id: 'top_rated', label: 'Top Rated' },
                { id: 'verified', label: 'Verified' },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setFilter(tab.id as typeof filter)}
                  className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                    filter === tab.id
                      ? 'bg-teal-600 text-white'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* No Preference Option */}
            <div
              onClick={() => {
                onSelect('');
                setIsExpanded(false);
              }}
              className={`p-3 rounded-xl border-2 cursor-pointer transition-all mb-3 ${
                !selectedDriverId
                  ? 'border-teal-500 bg-teal-50'
                  : 'border-gray-200 hover:border-teal-300 bg-white'
              }`}
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center">
                  <User className="w-5 h-5 text-gray-400" />
                </div>
                <div>
                  <p className="font-medium text-gray-800">No preference - Best Match</p>
                  <p className="text-sm text-gray-500">We'll assign the best available driver for your trip</p>
                </div>
                {!selectedDriverId && (
                  <CheckCircle className="w-5 h-5 text-teal-600 ml-auto" />
                )}
              </div>
            </div>

            {/* Driver Cards */}
            <div className="space-y-3 max-h-96 overflow-y-auto pr-1">
              {filteredDrivers.map((driver) => (
                <DriverCard
                  key={driver.id}
                  driver={driver}
                  isSelected={selectedDriverId === driver.id}
                  onSelect={() => {
                    onSelect(driver.id);
                    setIsExpanded(false);
                  }}
                  getTierLabel={getTierLabel}
                  getTierColor={getTierColor}
                />
              ))}
            </div>

            {filteredDrivers.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                <Car className="w-12 h-12 mx-auto text-gray-300 mb-2" />
                <p>No drivers match your filter</p>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// Individual Driver Card
const DriverCard: React.FC<{
  driver: DriverWithBadges;
  isSelected: boolean;
  onSelect: () => void;
  getTierLabel: (tier?: string) => string;
  getTierColor: (tier?: string) => string;
}> = ({ driver, isSelected, onSelect, getTierLabel, getTierColor }) => {
  // Get top 3 badges to display
  const topBadges = (driver.badges || []).slice(0, 3);

  return (
    <motion.div
      whileHover={{ scale: 1.01 }}
      onClick={onSelect}
      className={`p-4 rounded-xl border-2 cursor-pointer transition-all ${
        isSelected
          ? 'border-teal-500 bg-teal-50 shadow-md'
          : 'border-gray-200 hover:border-teal-300 bg-white'
      }`}
    >
      <div className="flex gap-4">
        {/* Driver Photo */}
        <div className="w-16 h-16 rounded-xl overflow-hidden bg-gray-100 flex-shrink-0">
          {driver.profile_photo ? (
            <img
              src={driver.profile_photo}
              alt={driver.full_name}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <User className="w-8 h-8 text-gray-400" />
            </div>
          )}
        </div>

        {/* Driver Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between">
            <div>
              <h4 className="font-semibold text-gray-900">{driver.full_name}</h4>
              <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium ${getTierColor(driver.tier)}`}>
                {getTierLabel(driver.tier)}
              </span>
            </div>

            {/* Rating */}
            <div className="flex items-center gap-1 bg-amber-50 px-2 py-1 rounded-lg">
              <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
              <span className="font-semibold text-amber-700">
                {driver.average_rating?.toFixed(1) || '5.0'}
              </span>
            </div>
          </div>

          {/* Stats */}
          <div className="flex items-center gap-4 mt-2 text-sm text-gray-600">
            {driver.years_experience && (
              <span>{driver.years_experience}+ years exp</span>
            )}
            {driver.total_reviews && driver.total_reviews > 0 && (
              <span>{driver.total_reviews} reviews</span>
            )}
          </div>

          {/* Languages */}
          {driver.specialty_languages && driver.specialty_languages.length > 0 && (
            <div className="flex items-center gap-1 mt-2 text-sm text-gray-500">
              <Languages className="w-4 h-4" />
              <span>{driver.specialty_languages.join(', ')}</span>
            </div>
          )}

          {/* Badges */}
          {topBadges.length > 0 && (
            <div className="flex flex-wrap gap-1 mt-2">
              {topBadges.map((badge) => {
                const def = BADGE_DEFINITIONS[badge.badge_type];
                if (!def) return null;
                return (
                  <span
                    key={badge.id}
                    className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs ${def.badge_color}`}
                    title={def.badge_description}
                  >
                    <span>{def.badge_icon}</span>
                    <span>{def.badge_name}</span>
                  </span>
                );
              })}
            </div>
          )}
        </div>

        {/* Selection indicator */}
        {isSelected && (
          <CheckCircle className="w-6 h-6 text-teal-600 flex-shrink-0" />
        )}
      </div>
    </motion.div>
  );
};

export default DriverSelection;
