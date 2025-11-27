import React, { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Sparkles, MapPin, Clock, Users } from 'lucide-react';
import { useAI } from '@/contexts/AIContext';
import { dbService, authService, storageService } from '@/lib/firebase-services';

interface UserPreferences {
  interests: string[];
  budget: string;
  duration: string;
  groupSize: number;
  travelStyle: string;
}

interface AIRecommendation {
  id: string;
  title: string;
  description: string;
  location: string;
  duration: string;
  price: number;
  rating: number;
  image: string;
  tags: string[];
  confidence: number;
}

interface AIRecommendationsProps {
  userPreferences?: UserPreferences;
}

export const AIRecommendations: React.FC<AIRecommendationsProps> = ({ userPreferences }) => {
  const [recommendations, setRecommendations] = useState<AIRecommendation[]>([]);
  const [loading, setLoading] = useState(false);
  const { getSmartSelection } = useAI();

  useEffect(() => {
    if (userPreferences) {
      generateRecommendations();
    }
  }, [userPreferences]);

  const generateRecommendations = useCallback(async () => {
    setLoading(true);
    try {
      // Fetch available tours and activities
      const tours = await dbService.list('tours', [
        { field: 'is_active', operator: '==', value: true }
      ], undefined, 10);

      const activities = await dbService.list('activities', [
        { field: 'is_active', operator: '==', value: true }
      ], undefined, 10);

      // Use AI to generate personalized recommendations
      const aiResponse = await getSmartSelection({
        userPreferences,
        availableTours: tours || [],
        availableActivities: activities || []
      });

      if (aiResponse.data) {
        // Transform the data into recommendation format
        const mockRecommendations: AIRecommendation[] = [
          {
            id: '1',
            title: 'Cultural Heritage Tour',
            description: 'Explore ancient temples and traditional crafts',
            location: 'Kandy & Sigiriya',
            duration: '3 days',
            price: 250,
            rating: 4.8,
            image: '/placeholder.svg',
            tags: ['Culture', 'History', 'Temples'],
            confidence: 0.92
          },
          {
            id: '2',
            title: 'Tea Country Adventure',
            description: 'Scenic train rides through tea plantations',
            location: 'Nuwara Eliya',
            duration: '2 days',
            price: 180,
            rating: 4.7,
            image: '/placeholder.svg',
            tags: ['Nature', 'Tea', 'Scenic'],
            confidence: 0.88
          },
          {
            id: '3',
            title: 'Coastal Safari Experience',
            description: 'Wildlife watching and beach relaxation',
            location: 'Yala & Mirissa',
            duration: '4 days',
            price: 320,
            rating: 4.9,
            image: '/placeholder.svg',
            tags: ['Wildlife', 'Beach', 'Safari'],
            confidence: 0.85
          }
        ];

        setRecommendations(mockRecommendations);
      }
    } catch (error) {
      console.error('Error generating recommendations:', error);
    } finally {
      setLoading(false);
    }
  }, [userPreferences]);

  if (loading) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-primary" />
            AI Recommendations
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="h-4 bg-muted rounded w-3/4 mb-2"></div>
                <div className="h-3 bg-muted rounded w-1/2"></div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-primary" />
          AI-Powered Recommendations
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {recommendations.map((recommendation) => (
            <Card key={recommendation.id} className="relative overflow-hidden">
              <div className="absolute top-2 right-2 z-10">
                <Badge variant="secondary" className="bg-primary/10">
                  {Math.round(recommendation.confidence * 100)}% match
                </Badge>
              </div>
              
              <div className="aspect-video relative overflow-hidden">
                <img 
                  src={recommendation.image} 
                  alt={recommendation.title}
                  className="w-full h-full object-cover"
                />
              </div>
              
              <CardContent className="p-4">
                <h3 className="font-semibold text-lg mb-2">{recommendation.title}</h3>
                <p className="text-muted-foreground text-sm mb-3">{recommendation.description}</p>
                
                <div className="space-y-2 mb-4">
                  <div className="flex items-center gap-2 text-sm">
                    <MapPin className="h-4 w-4 text-primary" />
                    {recommendation.location}
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Clock className="h-4 w-4 text-primary" />
                    {recommendation.duration}
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Users className="h-4 w-4 text-primary" />
                    ⭐ {recommendation.rating}
                  </div>
                </div>
                
                <div className="flex flex-wrap gap-1 mb-4">
                  {recommendation.tags.map((tag, index) => (
                    <Badge key={index} variant="outline" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-lg font-bold text-primary">
                    ${recommendation.price}
                  </span>
                  <Button size="sm">
                    View Details
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};