
import React from 'react';
import { Award, Trophy, Star, MapPin } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';

interface PassportProgressProps {
  visitedCount: number;
  totalCount: number;
  className?: string;
}

export const PassportProgress: React.FC<PassportProgressProps> = ({
  visitedCount,
  totalCount,
  className = ''
}) => {
  const progressPercentage = (visitedCount / totalCount) * 100;
  
  const getAchievementLevel = (count: number) => {
    if (count >= 20) return { title: 'Culinary Master', icon: Trophy, color: 'bg-yellow-500' };
    if (count >= 15) return { title: 'Food Connoisseur', icon: Star, color: 'bg-purple-500' };
    if (count >= 10) return { title: 'Flavor Explorer', icon: MapPin, color: 'bg-blue-500' };
    if (count >= 5) return { title: 'Taste Adventurer', icon: Award, color: 'bg-green-500' };
    return { title: 'Food Novice', icon: Award, color: 'bg-gray-500' };
  };

  const achievement = getAchievementLevel(visitedCount);
  const AchievementIcon = achievement.icon;

  return (
    <div className={`py-4 px-6 ${className}`}>
      <div className="container mx-auto">
        <div className="flex items-center justify-between flex-wrap gap-4">
          {/* Progress Info */}
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <div className="relative">
                <div className={`w-10 h-10 rounded-full ${achievement.color} flex items-center justify-center animate-achievement-glow`}>
                  <AchievementIcon className="h-5 w-5 text-white" />
                </div>
                {visitedCount > 0 && (
                  <div className="absolute -top-1 -right-1 w-5 h-5 bg-luxury-gold rounded-full flex items-center justify-center text-xs font-bold text-luxury-darkwood">
                    {visitedCount}
                  </div>
                )}
              </div>
              <div>
                <h3 className="font-semibold text-luxury-darkwood">Your Culinary Passport</h3>
                <p className="text-sm text-luxury-spice">
                  {visitedCount} of {totalCount} restaurants visited
                </p>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="flex-1 min-w-48 max-w-md">
              <div className="flex justify-between text-sm text-luxury-spice mb-1">
                <span>{achievement.title}</span>
                <span>{Math.round(progressPercentage)}%</span>
              </div>
              <Progress 
                value={progressPercentage} 
                className="h-3 bg-luxury-cream"
              />
            </div>
          </div>

          {/* Achievement Badges */}
          <div className="flex items-center gap-2">
            {visitedCount >= 5 && (
              <Badge variant="secondary" className="bg-green-100 text-green-800 animate-badge-shine">
                🏆 Taste Adventurer
              </Badge>
            )}
            {visitedCount >= 10 && (
              <Badge variant="secondary" className="bg-blue-100 text-blue-800 animate-badge-shine">
                🗺️ Flavor Explorer
              </Badge>
            )}
            {visitedCount >= 15 && (
              <Badge variant="secondary" className="bg-purple-100 text-purple-800 animate-badge-shine">
                ⭐ Food Connoisseur
              </Badge>
            )}
            {visitedCount >= 20 && (
              <Badge variant="secondary" className="bg-yellow-100 text-yellow-800 animate-badge-shine">
                👑 Culinary Master
              </Badge>
            )}
          </div>
        </div>

        {/* Next Achievement Preview */}
        {visitedCount < totalCount && (
          <div className="mt-3 text-center">
            <p className="text-xs text-luxury-bronze">
              {visitedCount < 5 && `Visit ${5 - visitedCount} more restaurants to unlock "Taste Adventurer" badge`}
              {visitedCount >= 5 && visitedCount < 10 && `Visit ${10 - visitedCount} more restaurants to become a "Flavor Explorer"`}
              {visitedCount >= 10 && visitedCount < 15 && `Visit ${15 - visitedCount} more restaurants to become a "Food Connoisseur"`}
              {visitedCount >= 15 && visitedCount < 20 && `Visit ${20 - visitedCount} more restaurants to become a "Culinary Master"`}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
