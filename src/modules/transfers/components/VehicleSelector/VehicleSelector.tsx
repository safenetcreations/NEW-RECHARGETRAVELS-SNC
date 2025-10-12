
import React from 'react';
import { Check } from 'lucide-react';
import { Vehicle } from '../../types';
import { VEHICLE_TYPES } from '../../utils/constants';
import { formatCurrency } from '../../utils/formatting';

interface VehicleSelectorProps {
  value: Vehicle['vehicleType'];
  onChange: (type: Vehicle['vehicleType'], vehicle?: Vehicle) => void;
  passengerCount: number;
  luggageCount: number;
  distance?: number;
}

export const VehicleSelector: React.FC<VehicleSelectorProps> = ({
  value,
  onChange,
  passengerCount,
  luggageCount,
  distance
}) => {
  const vehicles = VEHICLE_TYPES.map(vehicleType => ({
    type: vehicleType.value as Vehicle['vehicleType'],
    name: vehicleType.label,
    description: vehicleType.description,
    capacity: vehicleType.maxPassengers,
    luggage: vehicleType.maxLuggage,
    pricePerKm: vehicleType.value === 'sedan' ? 50 : 
                vehicleType.value === 'suv' ? 75 : 
                vehicleType.value === 'van' ? 100 : 150,
    basePrice: vehicleType.value === 'sedan' ? 2000 : 
               vehicleType.value === 'suv' ? 2500 : 
               vehicleType.value === 'van' ? 3000 : 4000,
    features: vehicleType.features,
    image: vehicleType.icon
  }));

  const getEstimatedPrice = (vehicle: typeof vehicles[0]) => {
    if (!distance) return null;
    return vehicle.basePrice + (vehicle.pricePerKm * distance);
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Select Your Vehicle</h3>
        <p className="text-gray-600 text-sm">
          Choose a vehicle that suits your passenger and luggage requirements
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {vehicles.map((vehicle) => {
          const isRecommended = 
            vehicle.capacity >= passengerCount && vehicle.luggage >= luggageCount;
          const estimatedPrice = getEstimatedPrice(vehicle);
          const isSelected = value === vehicle.type;
          const isAvailable = vehicle.capacity >= passengerCount && vehicle.luggage >= luggageCount;
          
          return (
            <div
              key={vehicle.type}
              className={`relative border-2 rounded-lg p-4 cursor-pointer transition-all ${
                isSelected
                  ? 'border-blue-500 bg-blue-50'
                  : isRecommended
                  ? 'border-green-300 bg-green-50 hover:border-green-400'
                  : isAvailable
                  ? 'border-gray-300 bg-white hover:border-gray-400'
                  : 'border-gray-200 bg-gray-50'
              } ${
                !isAvailable ? 'opacity-60 cursor-not-allowed' : ''
              }`}
              onClick={() => {
                if (isAvailable) {
                  onChange(vehicle.type);
                }
              }}
            >
              {isRecommended && !isSelected && (
                <div className="absolute -top-2 -right-2 bg-green-500 text-white text-xs px-2 py-1 rounded-full font-medium">
                  Recommended
                </div>
              )}

              {isSelected && (
                <div className="absolute top-3 right-3">
                  <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                    <Check className="w-4 h-4 text-white" />
                  </div>
                </div>
              )}
              
              <div className="flex items-start space-x-3">
                <div className="text-3xl">{vehicle.image}</div>
                
                <div className="flex-1 min-w-0">
                  <h4 className="font-semibold text-gray-900">{vehicle.name}</h4>
                  <p className="text-sm text-gray-600 mb-3">{vehicle.description}</p>
                  
                  <div className="flex flex-wrap gap-2 mb-3">
                    <span className={`text-xs px-2 py-1 rounded ${
                      vehicle.capacity >= passengerCount 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {vehicle.capacity} passengers
                    </span>
                    <span className={`text-xs px-2 py-1 rounded ${
                      vehicle.luggage >= luggageCount 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {vehicle.luggage} luggage
                    </span>
                  </div>
                  
                  <div className="space-y-1 mb-3">
                    {vehicle.features.slice(0, 3).map((feature, index) => (
                      <div key={index} className="text-xs text-gray-500 flex items-center">
                        <span className="w-1 h-1 bg-gray-400 rounded-full mr-2"></span>
                        {feature}
                      </div>
                    ))}
                    {vehicle.features.length > 3 && (
                      <div className="text-xs text-gray-400">
                        +{vehicle.features.length - 3} more features
                      </div>
                    )}
                  </div>
                  
                  {estimatedPrice && (
                    <div className="mt-2">
                      <div className="text-sm font-semibold text-blue-600">
                        Estimated: {formatCurrency(estimatedPrice)}
                      </div>
                      <div className="text-xs text-gray-500">
                        Base: {formatCurrency(vehicle.basePrice)} + {formatCurrency(vehicle.pricePerKm)}/km
                      </div>
                    </div>
                  )}
                </div>
              </div>
              
              {!isAvailable && (
                <div className="absolute inset-0 bg-gray-500 bg-opacity-20 rounded-lg flex items-center justify-center">
                  <span className="text-sm font-medium text-gray-700 bg-white px-3 py-1 rounded shadow">
                    {vehicle.capacity < passengerCount 
                      ? `Needs ${passengerCount - vehicle.capacity} more seats`
                      : `Needs ${luggageCount - vehicle.luggage} more luggage space`
                    }
                  </span>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {distance && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h4 className="font-medium text-blue-900 mb-2">Distance Information</h4>
          <p className="text-sm text-blue-700">
            Estimated distance: {distance.toFixed(1)} km
          </p>
          <p className="text-xs text-blue-600 mt-1">
            Prices shown are estimates. Final price will be calculated based on actual route and any applicable surcharges.
          </p>
        </div>
      )}
    </div>
  );
};
