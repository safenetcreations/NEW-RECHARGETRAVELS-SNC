
import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Hotel } from '@/types/hotel';
import { UserPreferences, AIRecommendation } from '@/types/aiRecommendation';
import { aiRecommendationService } from '@/services/aiRecommendationService';

interface AIContextType {
  recommendations: AIRecommendation[];
  loading: boolean;
  userPreferences: UserPreferences | null;
  getHotelRecommendations: (preferences: UserPreferences, hotels: Hotel[]) => Promise<{ recommendations: AIRecommendation[]; error?: string }>;
  getSmartSelection: (options: any) => Promise<{ data?: any; error?: string }>;
  updateUserPreferences: (newPreferences: Partial<UserPreferences>) => void;
  recordUserFeedback: (hotelId: string, action: string, feedback: any) => Promise<void>;
}

const AIContext = createContext<AIContextType | undefined>(undefined);

export const useAI = () => {
  const context = useContext(AIContext);
  if (!context) {
    throw new Error('useAI must be used within an AIProvider');
  }
  return context;
};

interface AIProviderProps {
  children: ReactNode;
}

export const AIProvider = ({ children }: AIProviderProps) => {
  const [recommendations, setRecommendations] = useState<AIRecommendation[]>([]);
  const [loading, setLoading] = useState(false);
  const [userPreferences, setUserPreferences] = useState<UserPreferences | null>(null);

  const getHotelRecommendations = async (preferences: UserPreferences, hotels: Hotel[]) => {
    setLoading(true);
    try {
      // Use the existing AI recommendation service
      const hotelRecommendations = hotels.map(hotel => {
        return aiRecommendationService.getBestRecommendation(
          hotel,
          [], // availableTours - can be passed in if needed
          preferences,
          preferences.trip_duration
        );
      });

      // Sort by score and take top recommendations
      const sortedRecommendations = hotelRecommendations
        .sort((a, b) => b.score - a.score)
        .slice(0, 10);

      setRecommendations(sortedRecommendations);
      
      return { recommendations: sortedRecommendations };
    } catch (error) {
      console.error('Error getting AI recommendations:', error);
      return { recommendations: [], error: error.message };
    } finally {
      setLoading(false);
    }
  };

  const getSmartSelection = async (options: any) => {
    setLoading(true);
    try {
      // This could integrate with your existing AI services
      // For now, return a placeholder response
      const data = {
        selection: options,
        confidence: 0.8,
        reasoning: 'Based on your preferences and past selections'
      };
      
      return { data };
    } catch (error) {
      console.error('Error getting smart selection:', error);
      return { error: error.message };
    } finally {
      setLoading(false);
    }
  };

  const updateUserPreferences = (newPreferences: Partial<UserPreferences>) => {
    setUserPreferences(prev => prev ? { ...prev, ...newPreferences } : newPreferences as UserPreferences);
  };

  const recordUserFeedback = async (hotelId: string, action: string, feedback: any) => {
    try {
      // This could integrate with your existing AI score update system
      // You already have an update-ai-scores edge function
      const response = await fetch('/api/update-ai-score', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          hotel_id: hotelId,
          action: action,
          feedback: feedback
        })
      });

      if (!response.ok) {
        throw new Error('Failed to record feedback');
      }
    } catch (error) {
      console.error('Error recording user feedback:', error);
    }
  };

  const value = {
    recommendations,
    loading,
    userPreferences,
    getHotelRecommendations,
    getSmartSelection,
    updateUserPreferences,
    recordUserFeedback
  };

  return (
    <AIContext.Provider value={value}>
      {children}
    </AIContext.Provider>
  );
};
