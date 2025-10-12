
import { useState, useEffect } from 'react';
import { PriceCalculation, Location, Vehicle } from '../types';

interface UseBookingPriceParams {
  pickupLocation?: Location;
  dropoffLocation?: Location;
  vehicleType: Vehicle['vehicleType'];
  pickupDateTime?: Date;
}

export const useBookingPrice = (params: UseBookingPriceParams) => {
  const [price, setPrice] = useState<PriceCalculation | null>(null);
  const [isCalculating, setIsCalculating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!params.pickupLocation || !params.dropoffLocation) {
      setPrice(null);
      return;
    }

    const calculatePrice = async () => {
      setIsCalculating(true);
      setError(null);

      try {
        // Mock price calculation - replace with actual API call
        await new Promise(resolve => setTimeout(resolve, 500));

        const basePrice = 2000;
        const distance = 50; // Mock distance in km
        const pricePerKm = getVehiclePricePerKm(params.vehicleType);
        const distancePrice = distance * pricePerKm;

        const isNightTime = params.pickupDateTime && 
          (params.pickupDateTime.getHours() < 6 || params.pickupDateTime.getHours() > 22);
        
        const isAirport = params.pickupLocation.address.toLowerCase().includes('airport') ||
          params.dropoffLocation.address.toLowerCase().includes('airport');

        const surcharges = {
          nightSurcharge: isNightTime ? basePrice * 0.2 : 0,
          airportFee: isAirport ? 500 : 0
        };

        const subtotal = basePrice + distancePrice + 
          (surcharges.nightSurcharge || 0) + (surcharges.airportFee || 0);
        
        const taxes = subtotal * 0.12; // 12% tax
        const total = subtotal + taxes;

        const calculation: PriceCalculation = {
          basePrice,
          distancePrice,
          vehicleTypeMultiplier: getVehicleMultiplier(params.vehicleType),
          surcharges: Object.values(surcharges).some(s => s > 0) ? surcharges : undefined,
          subtotal,
          taxes,
          total,
          currency: 'LKR',
          distance
        };

        setPrice(calculation);
      } catch (err) {
        setError('Failed to calculate price');
        console.error('Price calculation error:', err);
      } finally {
        setIsCalculating(false);
      }
    };

    calculatePrice();
  }, [params.pickupLocation, params.dropoffLocation, params.vehicleType, params.pickupDateTime]);

  return { price, isCalculating, error };
};

const getVehiclePricePerKm = (vehicleType: Vehicle['vehicleType']): number => {
  const prices = {
    sedan: 50,
    suv: 75,
    van: 100,
    luxury: 150
  };
  return prices[vehicleType];
};

const getVehicleMultiplier = (vehicleType: Vehicle['vehicleType']): number => {
  const multipliers = {
    sedan: 1,
    suv: 1.5,
    van: 2,
    luxury: 3
  };
  return multipliers[vehicleType];
};
