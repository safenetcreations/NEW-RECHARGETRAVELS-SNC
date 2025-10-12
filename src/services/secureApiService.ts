
import { httpsCallable } from 'firebase/functions';
import { functions } from '@/lib/firebase';

interface ApiRequest {
  endpoint: string;
  params?: Record<string, any>;
}

class SecureApiService {
  private async makeSecureRequest(request: ApiRequest) {
    try {
      const secureMapsHandler = httpsCallable(functions, 'secure-maps-api');
      const result = await secureMapsHandler(request);

      return result.data;
    } catch (error) {
      console.error('Secure API service error:', error);
      throw new Error('API request failed');
    }
  }

  async searchPlaces(query: string, location?: string) {
    return this.makeSecureRequest({
      endpoint: 'https://maps.googleapis.com/maps/api/place/textsearch/json',
      params: {
        query,
        location,
        radius: 50000
      }
    });
  }

  async getPlaceDetails(placeId: string) {
    return this.makeSecureRequest({
      endpoint: 'https://maps.googleapis.com/maps/api/place/details/json',
      params: {
        place_id: placeId,
        fields: 'name,formatted_address,geometry,photos,rating'
      }
    });
  }

  async geocodeAddress(address: string) {
    return this.makeSecureRequest({
      endpoint: 'https://maps.googleapis.com/maps/api/geocode/json',
      params: {
        address
      }
    });
  }
}

export const secureApiService = new SecureApiService();
