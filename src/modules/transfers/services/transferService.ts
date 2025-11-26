
import type { BookingFormData, Vehicle } from '../types';

export const transferService = {
  async getVehicleOptions(): Promise<Vehicle[]> {
    // Mock data - replace with actual API call
    return [
      {
        id: 'sedan-1',
        driverId: 'driver-1',
        vehicleType: 'sedan',
        make: 'Toyota',
        model: 'Camry',
        year: 2022,
        licensePlate: 'ABC-1234',
        passengerCapacity: 4,
        luggageCapacity: 3,
        basePrice: 2000,
        pricePerKm: 50,
        isActive: true,
        imageUrl: '/images/sedan.jpg'
      },
      {
        id: 'suv-1',
        driverId: 'driver-2',
        vehicleType: 'suv',
        make: 'Toyota',
        model: 'Prado',
        year: 2021,
        licensePlate: 'XYZ-5678',
        passengerCapacity: 7,
        luggageCapacity: 5,
        basePrice: 3000,
        pricePerKm: 75,
        isActive: true,
        imageUrl: '/images/suv.jpg'
      }
    ];
  },

  async calculatePrice(data: Partial<BookingFormData>): Promise<number> {
    // Mock calculation - replace with actual logic
    const basePrice = 2000;
    const distancePrice = 50 * 50; // 50 LKR per km for 50km example
    return basePrice + distancePrice;
  },

  async submitBooking(data: BookingFormData): Promise<{ success: boolean; bookingId?: string }> {
    try {
      // Mock API call - replace with actual implementation
      console.log('Submitting to API:', data);
      
      return {
        success: true,
        bookingId: 'TXF-' + Date.now()
      };
    } catch (error) {
      console.error('Booking submission failed:', error);
      return { success: false };
    }
  }
};
