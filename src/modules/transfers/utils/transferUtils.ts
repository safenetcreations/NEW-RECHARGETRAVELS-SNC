
import type { Location } from '../types';
import { formatCurrency, formatDistance } from './formatting';
import { calculateDistance } from './helpers';

export const transferUtils = {
  validateLocation(location: Location): boolean {
    return location.address && location.address.length > 0;
  },

  formatPrice(amount: number, currency: string = 'LKR'): string {
    return formatCurrency(amount, currency);
  },

  calculateDistance(pickup: Location, dropoff: Location): number {
    if (pickup.lat && pickup.lng && dropoff.lat && dropoff.lng) {
      return calculateDistance(pickup, dropoff);
    }
    // Fallback for mock calculation
    return 50; // km
  },

  generateBookingReference(): string {
    return 'TXF-' + Date.now().toString().slice(-8);
  }
};
