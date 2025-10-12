
import { dbService, authService, storageService } from '@/lib/firebase-services';

export interface PriceBreakdown {
  distance: number;
  duration: number;
  basePrice: number;
  distancePrice: number;
  vehicleTypeMultiplier: number;
  surcharges: Record<string, number>;
  discounts: Record<string, number>;
  subtotal: number;
  taxes: number;
  total: number;
  currency: string;
}

export interface PriceCalculationRequest {
  pickupLocation: { lat: number; lng: number; address: string };
  dropoffLocation: { lat: number; lng: number; address: string };
  vehicleType: 'sedan' | 'suv' | 'van' | 'luxury';
  pickupDateTime?: string;
}

export const priceService = {
  async calculatePrice(request: PriceCalculationRequest): Promise<PriceBreakdown> {
    try {
      console.log('Calculating price with request:', request);
      
      const { data, error } = await supabase.functions.invoke('calculate-price', {
        body: request
      });

      if (error) {
        console.error('Price calculation error:', error);
        throw new Error(error.message || 'Failed to calculate price');
      }

      console.log('Price calculation result:', data);
      return data as PriceBreakdown;
    } catch (error) {
      console.error('Price service error:', error);
      throw error;
    }
  },

  async getEstimatedPrice(
    pickupLat: number,
    pickupLng: number,
    dropoffLat: number,
    dropoffLng: number,
    vehicleType: 'sedan' | 'suv' | 'van' | 'luxury' = 'sedan'
  ): Promise<number> {
    try {
      const request: PriceCalculationRequest = {
        pickupLocation: { lat: pickupLat, lng: pickupLng, address: 'Pickup Location' },
        dropoffLocation: { lat: dropoffLat, lng: dropoffLng, address: 'Dropoff Location' },
        vehicleType
      };

      const priceBreakdown = await this.calculatePrice(request);
      return priceBreakdown.total;
    } catch (error) {
      console.error('Error getting estimated price:', error);
      return 0;
    }
  }
};
