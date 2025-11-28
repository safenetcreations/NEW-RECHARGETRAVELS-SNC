import React, { useEffect, useState } from 'react';
import { DriverBadge, BADGE_DEFINITIONS, BadgeType } from '@/types/driver';
import { getDriverBadges, getExpiringBadges } from '@/services/driverBadgeService';
import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { AlertCircle, Clock, Award, Shield, Star, Trophy, Zap } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface DriverBadgesProps {
  driverId: string;
  maxDisplay?: number;
  size?: 'sm' | 'md' | 'lg';
  showTooltip?: boolean;
  animated?: boolean;
}

export const DriverBadgesDisplay: React.FC<DriverBadgesProps> = ({
  driverId,
  maxDisplay = 5,
  size = 'md',
  showTooltip = true,
  animated = true
}) => {
  const [badges, setBadges] = useState<DriverBadge[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const driverBadges = await getDriverBadges(driverId, true);
        setBadges(driverBadges);
      } catch (error) {
        console.error('Error loading badges:', error);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [driverId]);

  if (loading) {
    return (
      <div className="flex gap-1">
        {[...Array(3)].map((_, i) => (
          <div
            key={i}
            className={`rounded-full bg-gray-200 animate-pulse ${
              size === 'sm' ? 'w-6 h-6' : size === 'md' ? 'w-8 h-8' : 'w-10 h-10'
            }`}
          />
        ))}
      </div>
    );
  }

  if (badges.length === 0) return null;

  const displayBadges = badges.slice(0, maxDisplay);
  const remainingCount = badges.length - maxDisplay;

  const sizeClasses = {
    sm: 'text-sm px-2 py-0.5',
    md: 'text-base px-3 py-1',
    lg: 'text-lg px-4 py-1.5'
  };

  const iconSizes = {
    sm: 'text-base',
    md: 'text-xl',
    lg: 'text-2xl'
  };

  const BadgeItem = ({ badge, index }: { badge: DriverBadge; index: number }) => {
    const content = (
      <motion.div
        initial={animated ? { opacity: 0, scale: 0.5 } : false}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: index * 0.1, type: 'spring', stiffness: 500 }}
        className={`inline-flex items-center gap-1 rounded-full border ${badge.badge_color} ${sizeClasses[size]} font-medium cursor-default`}
      >
        <span className={iconSizes[size]}>{badge.badge_icon}</span>
        {size !== 'sm' && <span>{badge.badge_name}</span>}
      </motion.div>
    );

    if (!showTooltip) return content;

    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>{content}</TooltipTrigger>
          <TooltipContent side="top" className="max-w-xs">
            <div className="space-y-1">
              <p className="font-semibold">{badge.badge_name}</p>
              <p className="text-sm text-gray-500">{badge.badge_description}</p>
              <p className="text-xs text-gray-400">
                Awarded: {new Date(badge.awarded_date).toLocaleDateString()}
              </p>
              {badge.expiry_date && (
                <p className="text-xs text-orange-500 flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  Expires: {new Date(badge.expiry_date).toLocaleDateString()}
                </p>
              )}
            </div>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  };

  return (
    <div className="flex flex-wrap gap-2 items-center">
      <AnimatePresence>
        {displayBadges.map((badge, index) => (
          <BadgeItem key={badge.id} badge={badge} index={index} />
        ))}
      </AnimatePresence>

      {remainingCount > 0 && (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Badge variant="secondary" className={sizeClasses[size]}>
                +{remainingCount} more
              </Badge>
            </TooltipTrigger>
            <TooltipContent>
              <div className="space-y-1">
                {badges.slice(maxDisplay).map((b) => (
                  <p key={b.id} className="flex items-center gap-2">
                    <span>{b.badge_icon}</span>
                    <span>{b.badge_name}</span>
                  </p>
                ))}
              </div>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      )}
    </div>
  );
};

// Compact badge icons only display
export const DriverBadgeIcons: React.FC<{
  driverId: string;
  maxDisplay?: number;
}> = ({ driverId, maxDisplay = 5 }) => {
  const [badges, setBadges] = useState<DriverBadge[]>([]);

  useEffect(() => {
    getDriverBadges(driverId, true).then(setBadges);
  }, [driverId]);

  if (badges.length === 0) return null;

  return (
    <div className="flex -space-x-1">
      {badges.slice(0, maxDisplay).map((badge) => (
        <TooltipProvider key={badge.id}>
          <Tooltip>
            <TooltipTrigger>
              <span
                className={`inline-flex items-center justify-center w-7 h-7 rounded-full border-2 border-white shadow-sm text-sm ${badge.badge_color}`}
              >
                {badge.badge_icon}
              </span>
            </TooltipTrigger>
            <TooltipContent>
              <p className="font-medium">{badge.badge_name}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      ))}
      {badges.length > maxDisplay && (
        <span className="inline-flex items-center justify-center w-7 h-7 rounded-full border-2 border-white shadow-sm bg-gray-100 text-gray-600 text-xs font-medium">
          +{badges.length - maxDisplay}
        </span>
      )}
    </div>
  );
};

// Badge showcase for profile pages
export const DriverBadgeShowcase: React.FC<{
  driverId: string;
  className?: string;
}> = ({ driverId, className = '' }) => {
  const [badges, setBadges] = useState<DriverBadge[]>([]);
  const [expiringBadges, setExpiringBadges] = useState<DriverBadge[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      const [allBadges, expiring] = await Promise.all([
        getDriverBadges(driverId, true),
        getExpiringBadges(driverId, 30)
      ]);
      setBadges(allBadges);
      setExpiringBadges(expiring);
      setLoading(false);
    };
    load();
  }, [driverId]);

  if (loading) {
    return (
      <div className={`bg-white rounded-2xl p-6 shadow-sm ${className}`}>
        <div className="animate-pulse space-y-4">
          <div className="h-6 bg-gray-200 rounded w-32" />
          <div className="flex gap-3">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-20 w-24 bg-gray-200 rounded-xl" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (badges.length === 0) {
    return (
      <div className={`bg-gray-50 rounded-2xl p-6 text-center ${className}`}>
        <Award className="w-12 h-12 text-gray-300 mx-auto mb-3" />
        <p className="text-gray-500">No badges earned yet</p>
        <p className="text-sm text-gray-400 mt-1">Complete trips to earn badges!</p>
      </div>
    );
  }

  // Group badges by category
  const verificationBadges = badges.filter(b =>
    ['sltda_verified', 'police_cleared', 'safe_driver'].includes(b.badge_type)
  );
  const performanceBadges = badges.filter(b =>
    ['five_star_driver', 'top_rated', 'early_bird', 'quick_responder', 'customer_favorite'].includes(b.badge_type)
  );
  const milestoneBadges = badges.filter(b =>
    ['first_trip', '100_trips', '500_trips', '1000_trips', 'veteran_driver'].includes(b.badge_type)
  );
  const specialtyBadges = badges.filter(b =>
    ['language_expert', 'luxury_specialist', 'wildlife_expert', 'cultural_guide'].includes(b.badge_type)
  );

  const BadgeCategory = ({
    title,
    icon: Icon,
    badges: categoryBadges,
    color
  }: {
    title: string;
    icon: React.ElementType;
    badges: DriverBadge[];
    color: string;
  }) => {
    if (categoryBadges.length === 0) return null;

    return (
      <div>
        <div className={`flex items-center gap-2 text-sm font-semibold ${color} mb-3`}>
          <Icon className="w-4 h-4" />
          {title}
        </div>
        <div className="flex flex-wrap gap-2">
          {categoryBadges.map((badge) => (
            <TooltipProvider key={badge.id}>
              <Tooltip>
                <TooltipTrigger>
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    className={`flex items-center gap-2 px-3 py-2 rounded-xl border ${badge.badge_color} cursor-default`}
                  >
                    <span className="text-xl">{badge.badge_icon}</span>
                    <span className="font-medium text-sm">{badge.badge_name}</span>
                  </motion.div>
                </TooltipTrigger>
                <TooltipContent side="top" className="max-w-xs">
                  <p className="text-sm">{badge.badge_description}</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className={`bg-white rounded-2xl p-6 shadow-sm space-y-6 ${className}`}>
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
          <Trophy className="w-5 h-5 text-amber-500" />
          Badges & Achievements
        </h3>
        <Badge variant="secondary">{badges.length} earned</Badge>
      </div>

      {/* Expiring badges warning */}
      {expiringBadges.length > 0 && (
        <div className="bg-orange-50 border border-orange-200 rounded-xl p-4">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-orange-500 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-medium text-orange-800">Badges Expiring Soon</p>
              <div className="mt-2 space-y-1">
                {expiringBadges.map((b) => (
                  <p key={b.id} className="text-sm text-orange-700">
                    {b.badge_icon} {b.badge_name} - Expires{' '}
                    {new Date(b.expiry_date!).toLocaleDateString()}
                  </p>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="space-y-6">
        <BadgeCategory
          title="Verification"
          icon={Shield}
          badges={verificationBadges}
          color="text-emerald-700"
        />
        <BadgeCategory
          title="Performance"
          icon={Star}
          badges={performanceBadges}
          color="text-amber-700"
        />
        <BadgeCategory
          title="Milestones"
          icon={Trophy}
          badges={milestoneBadges}
          color="text-purple-700"
        />
        <BadgeCategory
          title="Specialties"
          icon={Zap}
          badges={specialtyBadges}
          color="text-blue-700"
        />
      </div>
    </div>
  );
};

// Mini badge for cards
export const DriverBadgeMini: React.FC<{
  badgeType: BadgeType;
}> = ({ badgeType }) => {
  const definition = BADGE_DEFINITIONS[badgeType];
  if (!definition) return null;

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger>
          <span
            className={`inline-flex items-center justify-center w-6 h-6 rounded-full text-xs ${definition.badge_color}`}
          >
            {definition.badge_icon}
          </span>
        </TooltipTrigger>
        <TooltipContent>
          <p className="font-medium">{definition.badge_name}</p>
          <p className="text-xs text-gray-500">{definition.badge_description}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export default DriverBadgesDisplay;
