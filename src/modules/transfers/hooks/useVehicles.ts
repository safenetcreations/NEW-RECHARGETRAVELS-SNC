
import { useCallback } from 'react';
import { useQuery } from '@tanstack/react-query';
import type { Vehicle } from '../types';
import { vehicleService } from '../services';

export const useVehicles = () => {
  const {
    data: vehicles,
    isLoading,
    error,
  } = useQuery<Vehicle[]>({
    queryKey: ['transfer-vehicles'],
    queryFn: vehicleService.getAvailableVehicles,
    staleTime: 300000, // 5 minutes
  });

  const getVehiclesByType = useCallback(
    (type: Vehicle['vehicleType']) => {
      return vehicles?.filter((v) => v.vehicleType === type && v.isActive) || [];
    },
    [vehicles]
  );

  const getVehicleCapacity = useCallback(
    (type: Vehicle['vehicleType']) => {
      const vehiclesOfType = getVehiclesByType(type);
      if (vehiclesOfType.length === 0) return { passengers: 0, luggage: 0 };

      return {
        passengers: Math.max(...vehiclesOfType.map((v) => v.passengerCapacity)),
        luggage: Math.max(...vehiclesOfType.map((v) => v.luggageCapacity)),
      };
    },
    [getVehiclesByType]
  );

  return {
    vehicles,
    isLoading,
    error,
    getVehiclesByType,
    getVehicleCapacity,
  };
};
