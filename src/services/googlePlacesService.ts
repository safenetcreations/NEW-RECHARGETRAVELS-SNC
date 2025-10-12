
import { httpsCallable } from 'firebase/functions';
import { functions } from '@/lib/firebase';

export interface AutocompleteParams {
  input: string;
  types?: string;
  componentRestrictions?: {
    country?: string;
  };
}

export interface PlaceDetailsParams {
  place_id: string;
  fields?: string;
}

export interface TextSearchParams {
  query: string;
  location?: string;
  radius?: number;
}

export interface NearbySearchParams {
  location: string;
  radius?: number;
  type?: string;
}

class GooglePlacesService {
  async autocomplete(params: AutocompleteParams) {
    try {
      const googlePlacesHandler = httpsCallable(functions, 'google-places-api-handler');
      const result = await googlePlacesHandler({
        action: 'autocomplete',
        params
      });

      return result.data;
    } catch (error) {
      console.error('Google Places autocomplete error:', error);
      throw new Error('Failed to get autocomplete suggestions');
    }
  }

  async getPlaceDetails(params: PlaceDetailsParams) {
    try {
      const googlePlacesHandler = httpsCallable(functions, 'google-places-api-handler');
      const result = await googlePlacesHandler({
        action: 'place_details',
        params
      });

      return result.data;
    } catch (error) {
      console.error('Google Places details error:', error);
      throw new Error('Failed to get place details');
    }
  }

  async textSearch(params: TextSearchParams) {
    try {
      const googlePlacesHandler = httpsCallable(functions, 'google-places-api-handler');
      const result = await googlePlacesHandler({
        action: 'text_search',
        params
      });

      return result.data;
    } catch (error) {
      console.error('Google Places text search error:', error);
      throw new Error('Failed to search places');
    }
  }

  async nearbySearch(params: NearbySearchParams) {
    try {
      const googlePlacesHandler = httpsCallable(functions, 'google-places-api-handler');
      const result = await googlePlacesHandler({
        action: 'nearby_search',
        params
      });

      return result.data;
    } catch (error) {
      console.error('Google Places nearby search error:', error);
      throw new Error('Failed to search nearby places');
    }
  }
}

export const googlePlacesService = new GooglePlacesService();
export default googlePlacesService;
