
import { useState, useCallback } from 'react';
import { useQuery } from '@tanstack/react-query';
import { secureApiService } from '@/services/secureApiService';
import { isDemoMode } from '@/lib/googleMapsConfig';

interface LocationSuggestion {
  name: string;
  address: string;
  lat?: number;
  lng?: number;
  place_id?: string;
}

export const useLocationSearch = () => {
  const [searchTerm, setSearchTerm] = useState('');

  const { data: suggestions = [], isLoading: isSearching } = useQuery<LocationSuggestion[]>({
    queryKey: ['location-search', searchTerm],
    queryFn: async () => {
      if (searchTerm.length < 3) return [];
      
      // If in demo mode or no API available, return mock data
      if (isDemoMode()) {
        console.log('Using demo location search results');
        return [
          {
            name: `${searchTerm} - Location 1`,
            address: `Address for ${searchTerm}`,
            lat: 6.9271 + Math.random() * 0.1,
            lng: 79.8612 + Math.random() * 0.1
          },
          {
            name: `${searchTerm} - Location 2`,
            address: `Another address for ${searchTerm}`,
            lat: 6.9271 + Math.random() * 0.1,
            lng: 79.8612 + Math.random() * 0.1
          }
        ];
      }

      try {
        // Use secure API service for place search
        const data = await secureApiService.searchPlaces(searchTerm, 'Sri Lanka');
        
        return ((data as any).results || []).map((result: any) => ({
          name: result.name || '',
          address: result.formatted_address || '',
          lat: result.geometry?.location?.lat,
          lng: result.geometry?.location?.lng,
          place_id: result.place_id
        }));
      } catch (error) {
        console.error('Location search error:', error);
        // Fallback to mock data if API fails
        return [
          {
            name: `${searchTerm} - Sri Lanka`,
            address: `Location in Sri Lanka containing "${searchTerm}"`,
            lat: 7.8731,
            lng: 80.7718
          }
        ];
      }
    },
    enabled: searchTerm.length >= 3,
    staleTime: 30000,
  });

  return {
    searchTerm,
    setSearchTerm,
    suggestions,
    isSearching
  };
};
