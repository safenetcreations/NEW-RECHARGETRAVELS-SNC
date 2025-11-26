
import React from 'react';
import { Control, FieldErrors, UseFormRegister } from 'react-hook-form';
import { LocationPicker } from '../LocationPicker/LocationPicker';
import type { BookingFormData } from '../../types';

interface JourneyDetailsStepProps {
  control: Control<BookingFormData>;
  errors: FieldErrors<BookingFormData>;
  watchedValues: Partial<BookingFormData>;
  register: UseFormRegister<BookingFormData>;
}

export const JourneyDetailsStep: React.FC<JourneyDetailsStepProps> = ({
  control,
  errors,
  watchedValues,
  register
}) => {
  console.log('JourneyDetailsStep - Current values:', watchedValues);

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold text-gray-900 mb-6">Journey Details</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <LocationPicker
            label="Pickup Location"
            placeholder="Enter pickup address"
            value={watchedValues.pickupLocation}
            onChange={(value) => {
              console.log('Pickup location changed:', value);
              // Use setValue from react-hook-form to update the form state
              const event = new CustomEvent('pickup-change', { detail: value });
              document.dispatchEvent(event);
            }}
            error={errors.pickupLocation?.address?.message}
          />
        </div>
        
        <div>
          <LocationPicker
            label="Drop-off Location"
            placeholder="Enter drop-off address"
            value={watchedValues.dropoffLocation}
            onChange={(value) => {
              console.log('Dropoff location changed:', value);
              // Use setValue from react-hook-form to update the form state
              const event = new CustomEvent('dropoff-change', { detail: value });
              document.dispatchEvent(event);
            }}
            error={errors.dropoffLocation?.address?.message}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Pickup Date
          </label>
          <input
            type="date"
            {...register('pickupDate', { required: 'Pickup date is required' })}
            min={new Date().toISOString().split('T')[0]}
            className={`w-full px-3 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
              errors.pickupDate ? 'border-red-500' : 'border-gray-300'
            }`}
          />
          {errors.pickupDate && (
            <p className="mt-1 text-sm text-red-600">{errors.pickupDate.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Pickup Time
          </label>
          <input
            type="time"
            {...register('pickupTime', { required: 'Pickup time is required' })}
            className={`w-full px-3 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
              errors.pickupTime ? 'border-red-500' : 'border-gray-300'
            }`}
          />
          {errors.pickupTime && (
            <p className="mt-1 text-sm text-red-600">{errors.pickupTime.message}</p>
          )}
        </div>
      </div>

      {/* Return Trip Option */}
      <div className="space-y-4">
        <div className="flex items-center">
          <input
            type="checkbox"
            {...register('returnTrip')}
            id="returnTrip"
            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
          />
          <label htmlFor="returnTrip" className="ml-2 block text-sm text-gray-900">
            This is a return trip
          </label>
        </div>

        {watchedValues.returnTrip && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pl-6 border-l-2 border-blue-200">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Return Date
              </label>
              <input
                type="date"
                {...register('returnDate')}
                min={watchedValues.pickupDate || new Date().toISOString().split('T')[0]}
                className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Return Time
              </label>
              <input
                type="time"
                {...register('returnTime')}
                className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Special Requirements (Optional)
        </label>
        <textarea
          {...register('specialRequirements')}
          rows={3}
          placeholder="Any special requests or requirements..."
          className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>
    </div>
  );
};
