import { Car, Users, Briefcase, CheckCircle } from 'lucide-react';
import { Vehicle } from '@/contexts/TransportBookingContext';

interface VehicleSelectorProps {
  vehicles: Vehicle[];
  selectedVehicle: string | null;
  onSelect: (vehicleId: string) => void;
  passengerCount?: number;
  luggageCount?: number;
  calculatePrice?: (vehicleId: string) => number;
}

const VehicleSelector = ({
  vehicles,
  selectedVehicle,
  onSelect,
  passengerCount = 1,
  luggageCount = 1,
  calculatePrice
}: VehicleSelectorProps) => {
  // Filter vehicles that can accommodate the passengers and luggage
  const availableVehicles = vehicles.filter(
    v => v.passengers >= passengerCount && v.luggage >= luggageCount
  );

  const unavailableVehicles = vehicles.filter(
    v => v.passengers < passengerCount || v.luggage < luggageCount
  );

  const getPrice = (vehicle: Vehicle) => {
    if (calculatePrice) {
      return calculatePrice(vehicle.id);
    }
    return vehicle.basePrice || (vehicle.hourlyRate ? vehicle.hourlyRate * 4 : 50);
  };

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">Select Your Vehicle</h3>

      {/* Available Vehicles */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {availableVehicles.map((vehicle) => {
          const price = getPrice(vehicle);
          return (
            <div
              key={vehicle.id}
              onClick={() => onSelect(vehicle.id)}
              className={`
                relative p-4 rounded-xl border-2 cursor-pointer transition-all
                ${selectedVehicle === vehicle.id
                  ? 'border-emerald-500 bg-emerald-50 shadow-md'
                  : 'border-gray-200 hover:border-emerald-300 bg-white hover:shadow-sm'
                }
              `}
            >
              {selectedVehicle === vehicle.id && (
                <CheckCircle className="absolute top-2 right-2 w-5 h-5 text-emerald-600" />
              )}

              {/* Vehicle Image */}
              <div className="aspect-[4/3] mb-3 rounded-lg bg-gray-100 overflow-hidden">
                {vehicle.image ? (
                  <img
                    src={vehicle.image}
                    alt={vehicle.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200">
                    <Car className="w-16 h-16 text-gray-300" />
                  </div>
                )}
              </div>

              {/* Vehicle Info */}
              <h4 className="font-semibold text-gray-800">{vehicle.name}</h4>
              <p className="text-sm text-gray-500 mb-2">{vehicle.type || 'Sedan'}</p>

              {/* Capacity */}
              <div className="flex items-center gap-4 text-sm text-gray-600 mb-3">
                <span className="flex items-center gap-1">
                  <Users className="w-4 h-4" />
                  {vehicle.passengers}
                </span>
                <span className="flex items-center gap-1">
                  <Briefcase className="w-4 h-4" />
                  {vehicle.luggage}
                </span>
              </div>

              {/* Features */}
              {vehicle.features && vehicle.features.length > 0 && (
                <div className="flex flex-wrap gap-1 mb-3">
                  {vehicle.features.slice(0, 3).map((feature, idx) => (
                    <span
                      key={idx}
                      className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded"
                    >
                      {feature}
                    </span>
                  ))}
                </div>
              )}

              {/* Price */}
              <div className="pt-2 border-t">
                <div className="flex items-baseline justify-between">
                  <span className="text-xs text-gray-500">Price</span>
                  <div className="font-bold text-emerald-600 text-xl">
                    ${price}
                  </div>
                </div>
              </div>

              {/* Select Button */}
              <button
                className={`
                  w-full mt-3 py-2 rounded-lg font-medium transition-all
                  ${selectedVehicle === vehicle.id
                    ? 'bg-emerald-600 text-white'
                    : 'bg-emerald-100 text-emerald-700 hover:bg-emerald-200'
                  }
                `}
              >
                {selectedVehicle === vehicle.id ? 'Selected' : 'Select'}
              </button>
            </div>
          );
        })}
      </div>

      {/* Unavailable Vehicles (shown as disabled) */}
      {unavailableVehicles.length > 0 && (
        <div className="mt-6">
          <p className="text-sm text-gray-500 mb-2">
            These vehicles don't fit your group size:
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {unavailableVehicles.map((vehicle) => (
              <div
                key={vehicle.id}
                className="p-3 rounded-lg border border-gray-200 bg-gray-50 opacity-50"
              >
                <div className="text-sm font-medium text-gray-600">{vehicle.name}</div>
                <div className="text-xs text-gray-400">
                  Max {vehicle.passengers} passengers, {vehicle.luggage} bags
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {availableVehicles.length === 0 && (
        <div className="text-center py-8 bg-yellow-50 rounded-lg border border-yellow-200">
          <p className="text-yellow-700">
            No vehicles available for {passengerCount} passengers and {luggageCount} luggage pieces.
            <br />
            <span className="text-sm">Please contact us for custom arrangements.</span>
          </p>
        </div>
      )}
    </div>
  );
};

export default VehicleSelector;
