
import React from 'react';
import { format } from 'date-fns';
import { PriceSummary } from '../PriceSummary/PriceSummary';
import { BookingFormData, PriceCalculation } from '../../types';

interface ReviewStepProps {
  watchedValues: BookingFormData;
  price: PriceCalculation | null;
}

export const ReviewStep: React.FC<ReviewStepProps> = ({
  watchedValues,
  price
}) => {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold mb-6">Review Your Booking</h2>
      
      <div className="bg-white border rounded-lg p-6 space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="font-semibold text-gray-900 mb-3">Journey Details</h3>
            <div className="space-y-2 text-sm">
              <div>
                <span className="text-gray-500">From:</span>
                <p className="font-medium">{watchedValues.pickupLocation?.address}</p>
              </div>
              <div>
                <span className="text-gray-500">To:</span>
                <p className="font-medium">{watchedValues.dropoffLocation?.address}</p>
              </div>
              <div>
                <span className="text-gray-500">Date & Time:</span>
                <p className="font-medium">
                  {watchedValues.pickupDate && format(new Date(watchedValues.pickupDate), 'PPP')}
                  {' at '}
                  {watchedValues.pickupTime}
                </p>
              </div>
            </div>
          </div>

          <div>
            <h3 className="font-semibold text-gray-900 mb-3">Vehicle & Passengers</h3>
            <div className="space-y-2 text-sm">
              <div>
                <span className="text-gray-500">Vehicle Type:</span>
                <p className="font-medium capitalize">{watchedValues.vehicleType}</p>
              </div>
              <div>
                <span className="text-gray-500">Passengers:</span>
                <p className="font-medium">{watchedValues.passengerCount}</p>
              </div>
              <div>
                <span className="text-gray-500">Luggage:</span>
                <p className="font-medium">{watchedValues.luggageCount} pieces</p>
              </div>
            </div>
          </div>

          <div>
            <h3 className="font-semibold text-gray-900 mb-3">Contact Information</h3>
            <div className="space-y-2 text-sm">
              <div>
                <span className="text-gray-500">Name:</span>
                <p className="font-medium">{watchedValues.contactName}</p>
              </div>
              <div>
                <span className="text-gray-500">Email:</span>
                <p className="font-medium">{watchedValues.contactEmail}</p>
              </div>
              <div>
                <span className="text-gray-500">Phone:</span>
                <p className="font-medium">{watchedValues.contactPhone}</p>
              </div>
            </div>
          </div>

          {price && (
            <div>
              <h3 className="font-semibold text-gray-900 mb-3">Price Summary</h3>
              <PriceSummary price={price} />
            </div>
          )}
        </div>

        {watchedValues.specialRequirements && (
          <div className="pt-4 border-t">
            <h3 className="font-semibold text-gray-900 mb-2">Special Requirements</h3>
            <p className="text-sm text-gray-600">{watchedValues.specialRequirements}</p>
          </div>
        )}
      </div>

      <div className="bg-amber-50 border-l-4 border-amber-400 p-4">
        <div className="flex">
          <div className="flex-shrink-0">
            <svg className="h-5 w-5 text-amber-400" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="ml-3">
            <p className="text-sm text-amber-700">
              By confirming this booking, you agree to our terms and conditions.
              Payment will be processed after confirmation.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
