
import React from 'react';
import { Controller, Control } from 'react-hook-form';
import { PassengerSelector } from '../PassengerSelector/PassengerSelector';
import { VehicleSelector } from '../VehicleSelector/VehicleSelector';
import { BookingFormData, Vehicle, PriceCalculation } from '../../types';

interface VehiclePassengerStepProps {
  control: Control<BookingFormData>;
  watchedValues: BookingFormData;
  setValue: (name: keyof BookingFormData, value: any) => void;
  setSelectedVehicle: (vehicle: Vehicle | null) => void;
  price: PriceCalculation | null;
  register: any;
}

export const VehiclePassengerStep: React.FC<VehiclePassengerStepProps> = ({
  control,
  watchedValues,
  setValue,
  setSelectedVehicle,
  price,
  register
}) => {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold mb-6">Passengers & Vehicle</h2>
      
      <PassengerSelector
        passengerCount={watchedValues.passengerCount}
        luggageCount={watchedValues.luggageCount}
        onPassengerChange={(count) => setValue('passengerCount', count)}
        onLuggageChange={(count) => setValue('luggageCount', count)}
      />

      <Controller
        name="vehicleType"
        control={control}
        render={({ field }) => (
          <VehicleSelector
            value={field.value}
            onChange={(type, vehicle) => {
              field.onChange(type);
              setSelectedVehicle(vehicle || null);
            }}
            passengerCount={watchedValues.passengerCount}
            luggageCount={watchedValues.luggageCount}
            distance={price?.distance}
          />
        )}
      />

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Special Requirements (Optional)
        </label>
        <textarea
          {...register('specialRequirements')}
          rows={3}
          placeholder="E.g., Child seat required, wheelchair accessible, etc."
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {watchedValues.pickupLocation?.address?.toLowerCase().includes('airport') && (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Flight Number (Optional)
          </label>
          <input
            type="text"
            {...register('flightNumber')}
            placeholder="E.g., UL123"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          />
          <p className="mt-1 text-sm text-gray-500">
            We'll track your flight and adjust pickup time if needed
          </p>
        </div>
      )}
    </div>
  );
};
