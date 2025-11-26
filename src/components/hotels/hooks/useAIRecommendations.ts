
import { useState } from 'react'
import type { FiltersState } from '../types/filterTypes'
import type { Hotel } from '@/types/hotel'

export const useAIRecommendations = () => {
  const [aiRecommendations, setAiRecommendations] = useState<Hotel[]>([])

  const getAIRecommendations = async (
    filters: FiltersState,
    searchQuery: string,
    hotels: Hotel[]
  ) => {
    try {
      const response = await fetch('/api/ai-recommendations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          userPreferences: filters,
          searchQuery,
          currentHotels: hotels.slice(0, 10),
          country: 'Sri Lanka'
        })
      })
      
      const recommendations = await response.json()
      const transformedRecommendations: Hotel[] = recommendations.map((hotel: any) => ({
        ...hotel,
        location: hotel.latitude && hotel.longitude ? {
          latitude: hotel.latitude,
          longitude: hotel.longitude
        } : undefined,
        address: hotel.location || hotel.address
      } as Hotel))
      setAiRecommendations(transformedRecommendations)
    } catch (error) {
      console.error('Error getting AI recommendations:', error)
    }
  }

  return {
    aiRecommendations,
    getAIRecommendations
  }
}
