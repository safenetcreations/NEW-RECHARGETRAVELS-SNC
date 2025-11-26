import { httpsCallable } from 'firebase/functions';
import { functions } from '@/lib/firebase';

export interface LiveTour {
  id: string
  title: string
  description: string
  price: number
  category: string
  rating: number
  duration: string
  maxGuests: number
  image?: string
  destination: string
}

export interface LiveToursResponse {
  tours: LiveTour[]
  total: number
  location: string
  category: string
  last_updated: string
}

export const liveToursService = {
  async fetchTours(category: string = 'all', limit: number = 20): Promise<LiveToursResponse> {
    try {
      const liveToursHandler = httpsCallable(functions, 'live-tours-api');
      const result = await liveToursHandler({
        location: 'Sri Lanka',
        category,
        limit
      });

      return result.data as LiveToursResponse;
    } catch (error) {
      console.error('Live tours service error:', error);
      throw new Error('Failed to fetch live tours data');
    }
  }
};