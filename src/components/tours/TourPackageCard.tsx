
import React from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { TourPackage } from '@/types/tour-package';
import { Calendar, MapPin, Clock, Star, DollarSign, Users, Info } from 'lucide-react';

interface TourPackageCardProps {
  tourPackage: TourPackage;
  onViewDetails: (tourPackage: TourPackage) => void;
  onBookNow: (tourPackage: TourPackage) => void;
}

const getCategoryColor = (category: string) => {
  const colors = {
    'wildlife': 'bg-green-100 text-green-800 hover:bg-green-200',
    'cultural': 'bg-purple-100 text-purple-800 hover:bg-purple-200',
    'beach': 'bg-blue-100 text-blue-800 hover:bg-blue-200',
    'adventure': 'bg-red-100 text-red-800 hover:bg-red-200',
    'wellness': 'bg-teal-100 text-teal-800 hover:bg-teal-200',
    'tea': 'bg-amber-100 text-amber-800 hover:bg-amber-200',
  };
  
  return colors[category as keyof typeof colors] || 'bg-gray-100 text-gray-800 hover:bg-gray-200';
};

const getLuxuryLevelColor = (level: string) => {
  const colors = {
    'luxury': 'bg-amber-100 text-amber-800 border-amber-300',
    'semi-luxury': 'bg-blue-100 text-blue-800 border-blue-300',
    'budget': 'bg-green-100 text-green-800 border-green-300',
  };
  
  return colors[level as keyof typeof colors] || 'bg-gray-100 text-gray-800 border-gray-300';
};

const TourPackageCard: React.FC<TourPackageCardProps> = ({ tourPackage, onViewDetails, onBookNow }) => {
  const { name, category, duration_days, luxury_level, base_price, highlights } = tourPackage;
  
  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow duration-300">
      <div className="h-48 bg-gradient-to-r from-orange-400 to-pink-500 relative">
        {/* This would be a real image in production */}
        <div className="absolute inset-0 flex items-center justify-center text-white text-lg font-semibold">
          {category.charAt(0).toUpperCase() + category.slice(1)} Tour
        </div>
        
        <Badge className={`absolute top-3 right-3 ${getLuxuryLevelColor(luxury_level)}`}>
          {luxury_level.charAt(0).toUpperCase() + luxury_level.slice(1)}
        </Badge>
      </div>
      
      <CardHeader>
        <div className="flex justify-between items-start">
          <CardTitle className="text-xl font-bold">{name}</CardTitle>
          <Badge variant="outline" className={getCategoryColor(category)}>
            {category}
          </Badge>
        </div>
        <CardDescription className="flex items-center gap-1 mt-1">
          <Clock className="h-4 w-4" /> {duration_days} days
        </CardDescription>
      </CardHeader>
      
      <CardContent>
        <div className="space-y-2">
          <div className="flex justify-between">
            <div className="flex items-center text-lg font-bold text-green-700">
              <DollarSign className="h-5 w-5 mr-1" />
              {base_price}
            </div>
            <div className="text-gray-500 text-sm">per person</div>
          </div>
          
          {highlights && highlights.length > 0 && (
            <div className="mt-3">
              <h4 className="text-sm font-medium text-gray-600 mb-1">Highlights:</h4>
              <ul className="text-sm list-disc list-inside space-y-1">
                {highlights.slice(0, 3).map((highlight, index) => (
                  <li key={index} className="text-gray-700">{highlight}</li>
                ))}
                {highlights.length > 3 && (
                  <li className="text-gray-500">+{highlights.length - 3} more...</li>
                )}
              </ul>
            </div>
          )}
        </div>
      </CardContent>
      
      <CardFooter className="flex justify-between gap-2 pt-2">
        <Button 
          variant="outline" 
          className="flex-1"
          onClick={() => onViewDetails(tourPackage)}
        >
          <Info className="mr-1 h-4 w-4" /> Details
        </Button>
        <Button 
          className="flex-1 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600"
          onClick={() => onBookNow(tourPackage)}
        >
          Book Now
        </Button>
      </CardFooter>
    </Card>
  );
};

export default TourPackageCard;
