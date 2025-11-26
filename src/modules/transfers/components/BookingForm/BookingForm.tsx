
import React, { useState, useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import type { BookingFormData, Vehicle, PriceCalculation } from '../../types';
import { useBookingPrice } from '../../hooks/useBookingPrice';
import { validateStep } from '../../utils/validation';
import { StepIndicator } from './StepIndicator';
import { JourneyDetailsStep } from './JourneyDetailsStep';
import { VehiclePassengerStep } from './VehiclePassengerStep';
import { ContactInfoStep } from './ContactInfoStep';
import { ReviewStep } from './ReviewStep';

interface BookingFormProps {
  onSubmit: (data: BookingFormData) => Promise<void>;
  initialData?: Partial<BookingFormData>;
  isLoading?: boolean;
}

export const BookingForm: React.FC<BookingFormProps> = ({
  onSubmit,
  initialData,
  isLoading = false
}) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(null);

  const {
    register,
    control,
    handleSubmit,
    watch,
    formState: { errors, isValid },
    setValue,
    trigger
  } = useForm<BookingFormData>({
    defaultValues: {
      passengerCount: 1,
      luggageCount: 1,
      vehicleType: 'sedan',
      pickupLocation: { address: '' },
      dropoffLocation: { address: '' },
      returnTrip: false,
      ...initialData
    },
    mode: 'onChange'
  });

  // Watch form values for price calculation
  const watchedValues = watch();
  
  // Listen for location changes from the LocationPicker components
  useEffect(() => {
    const handlePickupChange = (event: CustomEvent) => {
      console.log('Setting pickup location:', event.detail);
      setValue('pickupLocation', event.detail);
      trigger('pickupLocation');
    };

    const handleDropoffChange = (event: CustomEvent) => {
      console.log('Setting dropoff location:', event.detail);
      setValue('dropoffLocation', event.detail);
      trigger('dropoffLocation');
    };

    document.addEventListener('pickup-change', handlePickupChange as EventListener);
    document.addEventListener('dropoff-change', handleDropoffChange as EventListener);

    return () => {
      document.removeEventListener('pickup-change', handlePickupChange as EventListener);
      document.removeEventListener('dropoff-change', handleDropoffChange as EventListener);
    };
  }, [setValue, trigger]);

  const { price, isCalculating } = useBookingPrice({
    pickupLocation: watchedValues.pickupLocation?.coordinates,
    dropoffLocation: watchedValues.dropoffLocation?.coordinates,
    vehicleType: watchedValues.vehicleType,
    pickupDateTime: watchedValues.pickupDate && watchedValues.pickupTime
      ? new Date(`${watchedValues.pickupDate}T${watchedValues.pickupTime}`)
      : undefined
  });

  // Multi-step form navigation
  const nextStep = async () => {
    console.log('Next step clicked, current step:', currentStep);
    console.log('Current form values:', watchedValues);
    
    const fieldsToValidate = getFieldsForStep(currentStep);
    const isStepValid = await trigger(fieldsToValidate);
    
    console.log('Step validation result:', isStepValid);
    console.log('Form errors:', errors);
    
    if (isStepValid) {
      // Additional validation using our utility
      const stepErrors = validateStep(currentStep, watchedValues);
      console.log('Custom validation errors:', stepErrors);
      
      if (stepErrors.length === 0) {
        setCurrentStep(prev => Math.min(prev + 1, 4));
      } else {
        console.log('Step validation errors:', stepErrors);
      }
    }
  };

  const prevStep = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
  };

  const getFieldsForStep = (step: number): (keyof BookingFormData)[] => {
    switch (step) {
      case 1:
        return ['pickupLocation', 'dropoffLocation', 'pickupDate', 'pickupTime'];
      case 2:
        return ['passengerCount', 'luggageCount', 'vehicleType'];
      case 3:
        return ['contactName', 'contactEmail', 'contactPhone'];
      default:
        return [];
    }
  };

  const handleFormSubmit = async (data: BookingFormData) => {
    console.log('Form submitted with data:', data);
    try {
      await onSubmit(data);
    } catch (error) {
      console.error('Form submission error:', error);
    }
  };

  const steps = [
    { number: 1, title: 'Journey Details', icon: '📍' },
    { number: 2, title: 'Passengers & Vehicle', icon: '🚗' },
    { number: 3, title: 'Contact Information', icon: '📞' },
    { number: 4, title: 'Review & Confirm', icon: '✅' }
  ];

  const renderCurrentStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <JourneyDetailsStep
            control={control}
            errors={errors}
            watchedValues={watchedValues}
            register={register}
          />
        );
      case 2:
        return (
          <VehiclePassengerStep
            control={control}
            watchedValues={watchedValues}
            setValue={setValue}
            setSelectedVehicle={setSelectedVehicle}
            price={price}
            register={register}
          />
        );
      case 3:
        return (
          <ContactInfoStep
            register={register}
            errors={errors}
          />
        );
      case 4:
        return (
          <ReviewStep
            watchedValues={watchedValues}
            price={price}
          />
        );
      default:
        return null;
    }
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="max-w-4xl mx-auto">
      <StepIndicator
        currentStep={currentStep}
        steps={steps}
        onStepClick={setCurrentStep}
      />

      {renderCurrentStep()}

      {/* Navigation Buttons */}
      <div className="flex justify-between mt-8">
        <button
          type="button"
          onClick={prevStep}
          disabled={currentStep === 1}
          className={`px-6 py-2 rounded-lg font-medium ${
            currentStep === 1
              ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          Previous
        </button>

        {currentStep < 4 ? (
          <button
            type="button"
            onClick={nextStep}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700"
          >
            Next
          </button>
        ) : (
          <button
            type="submit"
            disabled={isLoading || !isValid}
            className={`px-8 py-2 rounded-lg font-medium ${
              isLoading || !isValid
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                : 'bg-green-600 text-white hover:bg-green-700'
            }`}
          >
            {isLoading ? 'Processing...' : 'Confirm Booking'}
          </button>
        )}
      </div>

      {/* Debug Information */}
      <div className="mt-4 p-4 bg-gray-100 rounded-lg text-xs">
        <h4 className="font-semibold mb-2">Debug Info:</h4>
        <p>Current Step: {currentStep}</p>
        <p>Form Valid: {isValid ? 'Yes' : 'No'}</p>
        <p>Pickup: {watchedValues.pickupLocation?.address || 'Not set'}</p>
        <p>Dropoff: {watchedValues.dropoffLocation?.address || 'Not set'}</p>
        <p>Price: {price ? `${price.total} ${price.currency}` : 'Calculating...'}</p>
      </div>
    </form>
  );
};
