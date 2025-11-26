
import React, { useState } from 'react';
import { MapPin, DollarSign, Star, Clock, Users, Award, Play } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface Restaurant {
  id: string;
  slug: string;
  name: string;
  cuisine: string;
  location: string;
  priceLevel: '$' | '$$' | '$$$';
  rating: number;
  description: string;
  image: string;
  chef?: string;
  specialties: string[];
  hours: string;
  phone: string;
  address: string;
  nearbyAttractions: string[];
  spiceLevel: 'mild' | 'medium' | 'hot';
  atmosphere: 'casual' | 'elegant' | 'adventure';
  ingredients: string[];
  availableTables: number;
  chefVideo?: string;
  signatureDish: string;
  dishImage: string;
}

interface RestaurantCardProps {
  restaurant: Restaurant;
  matchScore: number;
  isVisited: boolean;
  onStamp: () => void;
  index: number;
}

export const RestaurantCard: React.FC<RestaurantCardProps> = ({
  restaurant,
  matchScore,
  isVisited,
  onStamp,
  index
}) => {
  const [isFlipped, setIsFlipped] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);

  const handleStamp = () => {
    if (!isVisited) {
      onStamp();
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 2000);
    }
  };

  const getAvailabilityColor = (tables: number) => {
    if (tables <= 1) return 'text-red-500';
    if (tables <= 3) return 'text-orange-500';
    return 'text-green-500';
  };

  const getAvailabilityText = (tables: number) => {
    if (tables === 0) return 'Fully booked';
    if (tables === 1) return '1 table left';
    if (tables <= 3) return `${tables} tables left`;
    return 'Available';
  };

  const getSpiceLevelEmoji = (level: string) => {
    switch (level) {
      case 'mild': return '🌿';
      case 'medium': return '🌶️';
      case 'hot': return '🔥';
      default: return '🌿';
    }
  };

  return (
    <div className="relative">
      {/* Confetti Animation */}
      {showConfetti && (
        <div className="absolute inset-0 pointer-events-none z-50">
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              className="absolute confetti-piece"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                backgroundColor: ['#D4AF37', '#CD7F32', '#B8860B', '#FF6B6B', '#4ECDC4'][Math.floor(Math.random() * 5)],
                animationDelay: `${Math.random() * 2}s`
              }}
            />
          ))}
        </div>
      )}

      <Card 
        className={`group restaurant-card transition-all duration-500 overflow-hidden border-luxury-bronze hover:shadow-copper cursor-pointer transform-gpu perspective-1000 ${
          isFlipped ? 'rotate-y-180' : ''
        }`}
        style={{ 
          animationDelay: `${index * 0.1}s`,
          transformStyle: 'preserve-3d'
        }}
        onMouseEnter={() => setIsFlipped(true)}
        onMouseLeave={() => setIsFlipped(false)}
      >
        {/* Front Side */}
        <div className={`absolute inset-0 backface-hidden transition-all duration-500 ${isFlipped ? 'opacity-0' : 'opacity-100'}`}>
          <div className="aspect-video relative overflow-hidden">
            <img 
              src={restaurant.image} 
              alt={`${restaurant.name} restaurant interior and ambiance`}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
            
            {/* Overlays */}
            <div className="absolute top-3 right-3 flex gap-2">
              <Badge className="bg-luxury-gold text-luxury-darkwood font-semibold">
                {restaurant.cuisine}
              </Badge>
              {matchScore < 100 && (
                <Badge variant="secondary" className="bg-green-500 text-white">
                  {matchScore}% match
                </Badge>
              )}
            </div>
            
            <div className="absolute top-3 left-3 flex items-center bg-white/90 px-2 py-1 rounded-full">
              <Star className="h-4 w-4 text-luxury-gold fill-current mr-1" />
              <span className="text-sm font-medium">{restaurant.rating}</span>
            </div>

            {/* Cinemagraph Steam Effect */}
            <div className="absolute inset-0 opacity-30 pointer-events-none">
              <div className="steam-small absolute top-1/4 left-1/3 w-4 h-8 bg-white/20 rounded-full animate-steam-rise" />
              <div className="steam-small absolute top-1/2 right-1/4 w-3 h-6 bg-white/15 rounded-full animate-steam-rise-delayed" />
            </div>

            {/* Availability Bubble */}
            <div className="absolute bottom-3 right-3">
              <div className={`px-3 py-1 rounded-full text-xs font-medium bg-white/90 ${getAvailabilityColor(restaurant.availableTables)} animate-availability-pulse`}>
                {getAvailabilityText(restaurant.availableTables)}
              </div>
            </div>
          </div>
          
          <CardHeader>
            <CardTitle className="text-luxury-darkwood group-hover:text-luxury-mahogany transition-colors flex items-center justify-between">
              {restaurant.name}
              {isVisited && <Award className="h-5 w-5 text-luxury-gold" />}
            </CardTitle>
            <CardDescription className="flex items-center justify-between">
              <div className="flex items-center text-luxury-spice">
                <MapPin className="h-4 w-4 mr-1" />
                {restaurant.location}
              </div>
              <div className="flex items-center text-luxury-bronze">
                <DollarSign className="h-4 w-4" />
                <span className="font-medium">{restaurant.priceLevel}</span>
              </div>
            </CardDescription>
          </CardHeader>
          
          <CardContent>
            <p className="text-luxury-spice mb-4 text-sm">
              {restaurant.description}
            </p>
            <div className="flex items-center justify-between">
              <div className="flex items-center text-sm text-luxury-darkwood">
                <Clock className="h-4 w-4 mr-1" />
                Open Now
              </div>
              <Button 
                size="sm"
                className="bg-luxury-mahogany hover:bg-luxury-darkwood text-white"
                onClick={() => window.open(`/tours/restaurants/${restaurant.slug}`, '_blank')}
              >
                View Details
              </Button>
            </div>
          </CardContent>
        </div>

        {/* Back Side - Signature Dish & Booking */}
        <div className={`absolute inset-0 backface-hidden rotate-y-180 transition-all duration-500 ${isFlipped ? 'opacity-100' : 'opacity-0'}`}>
          <div className="aspect-video relative overflow-hidden">
            <img 
              src={restaurant.dishImage} 
              alt={`${restaurant.signatureDish} from ${restaurant.name}`}
              className="w-full h-full object-cover"
            />
            
            {/* Chef Video Play Button */}
            {restaurant.chefVideo && (
              <div className="absolute inset-0 flex items-center justify-center">
                <Button
                  size="lg"
                  className="bg-black/50 hover:bg-black/70 text-white rounded-full p-4"
                >
                  <Play className="h-8 w-8" />
                </Button>
              </div>
            )}

            {/* Signature Dish Label */}
            <div className="absolute bottom-3 left-3 bg-luxury-gold text-luxury-darkwood px-3 py-1 rounded-full text-sm font-semibold">
              Chef's Signature
            </div>
          </div>
          
          <CardHeader>
            <CardTitle className="text-luxury-darkwood flex items-center gap-2">
              {restaurant.signatureDish}
              <span className="text-lg">{getSpiceLevelEmoji(restaurant.spiceLevel)}</span>
            </CardTitle>
            <CardDescription>
              {restaurant.chef && `By Chef ${restaurant.chef}`}
            </CardDescription>
          </CardHeader>
          
          <CardContent>
            <div className="space-y-3">
              {/* Specialties */}
              <div className="flex flex-wrap gap-1">
                {restaurant.specialties.slice(0, 3).map((specialty) => (
                  <Badge key={specialty} variant="outline" className="text-xs">
                    {specialty}
                  </Badge>
                ))}
              </div>

              {/* Action Buttons */}
              <div className="flex gap-2">
                {!isVisited ? (
                  <Button 
                    onClick={handleStamp}
                    className="flex-1 bg-luxury-mahogany hover:bg-luxury-darkwood text-white animate-stamp-pulse"
                  >
                    <Award className="h-4 w-4 mr-2" />
                    Stamp It!
                  </Button>
                ) : (
                  <Button 
                    disabled
                    className="flex-1 bg-luxury-gold text-luxury-darkwood"
                  >
                    <Award className="h-4 w-4 mr-2" />
                    Visited ✓
                  </Button>
                )}
                
                <Button 
                  variant="outline"
                  size="sm"
                  className="px-3"
                >
                  <Users className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </div>
      </Card>
    </div>
  );
};
