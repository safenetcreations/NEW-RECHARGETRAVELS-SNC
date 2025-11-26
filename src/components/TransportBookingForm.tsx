
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Form } from '@/components/ui/form';
import { DirectionsService, LoadScript } from '@react-google-maps/api';
import { toast } from 'sonner';

import { transportFormSchema, TransportFormValues, TransportBookingFormProps } from './transport/types';
import ServiceTypeSection from './transport/ServiceTypeSection';
import LocationSection from './transport/LocationSection';
import DateTimeSection from './transport/DateTimeSection';
import VehicleSection from './transport/VehicleSection';
import OptionsSection from './transport/OptionsSection';
import ContactSection from './transport/ContactSection';
import RoutePreviewSection from './transport/RoutePreviewSection';
import { useRouteCalculation } from './transport/useRouteCalculation';
import { GOOGLE_MAPS_API_KEY, googleMapsLibraries, isDemoMode } from '@/lib/googleMapsConfig';

const TransportBookingFormContent = ({ onLocationsChange }: TransportBookingFormProps) => {
  const form = useForm<TransportFormValues>({
    resolver: zodResolver(transportFormSchema),
    defaultValues: {
      serviceType: 'airport-pickup',
      pickupLocation: 'Colombo Airport (CMB)',
      dropoffLocation: '',
      pickupDate: '',
      pickupTime: '',
      passengers: '1',
      vehicleType: 'sedan',
      flightNumber: '',
      childSeat: false,
      specialRequests: '',
      contactName: '',
      contactEmail: '',
      contactPhone: ''
    },
  });

  const { watch, setValue, control } = form;

  const serviceType = watch('serviceType');
  const passengers = watch('passengers');
  const pickupLocation = watch('pickupLocation');
  const dropoffLocation = watch('dropoffLocation');

  const { directions, routeDetails, routeQuery, directionsCallback } = useRouteCalculation(pickupLocation, dropoffLocation);

  useEffect(() => {
    if (serviceType === 'airport-pickup') {
      setValue('pickupLocation', 'Colombo Airport (CMB)');
      if (dropoffLocation === 'Colombo Airport (CMB)') setValue('dropoffLocation', '');
    } else if (serviceType === 'airport-dropoff') {
      setValue('dropoffLocation', 'Colombo Airport (CMB)');
      if (pickupLocation === 'Colombo Airport (CMB)') setValue('pickupLocation', '');
    }
  }, [serviceType, setValue, pickupLocation, dropoffLocation]);

  useEffect(() => {
    const numPassengers = parseInt(passengers, 10);
    if (numPassengers <= 2) setValue('vehicleType', 'sedan');
    else if (numPassengers <= 6) setValue('vehicleType', 'minivan');
    else if (numPassengers <= 9) setValue('vehicleType', 'hiace');
    else if (numPassengers <= 15) setValue('vehicleType', 'minibus');
    else setValue('vehicleType', 'minicoach');
  }, [passengers, setValue]);
  
  useEffect(() => {
    onLocationsChange?.({ pickup: pickupLocation, dropoff: dropoffLocation });
  }, [pickupLocation, dropoffLocation, onLocationsChange]);

  const onSubmit = (data: TransportFormValues) => {
    console.log('Transport booking submitted:', data);
    toast.success('Booking Request Sent!', {
      description: 'We have received your transport request and will contact you shortly to confirm.',
    });
    form.reset();
  };

  return (
    <>
      {routeQuery?.pickup && routeQuery?.dropoff && !isDemoMode() && (
        <DirectionsService
          options={{
            destination: routeQuery.dropoff,
            origin: routeQuery.pickup,
            travelMode: 'DRIVING' as google.maps.TravelMode,
          }}
          callback={directionsCallback}
        />
      )}
      
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Book Your Transport</CardTitle>
          <p className="text-gray-600">Fill in the details below to get a quote and book your ride.</p>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              
              <ServiceTypeSection control={control} serviceType={serviceType} />
              
              <LocationSection control={control} serviceType={serviceType} />
              
              <DateTimeSection control={control} />

              <VehicleSection control={control} />
              
              <OptionsSection control={control} />

              <ContactSection control={control} />

              <RoutePreviewSection routeDetails={routeDetails} directions={directions} />

              <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700" disabled={form.formState.isSubmitting}>
                {form.formState.isSubmitting ? 'Submitting...' : 'Submit Booking Request'}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </>
  );
};

const TransportBookingForm = ({ onLocationsChange }: TransportBookingFormProps) => {
  // If Google Maps API key is not available or we're in demo mode, render form without LoadScript
  if (!GOOGLE_MAPS_API_KEY || isDemoMode()) {
    console.log('Rendering transport form without Google Maps integration');
    return <TransportBookingFormContent onLocationsChange={onLocationsChange} />;
  }

  return (
    <LoadScript
      googleMapsApiKey={GOOGLE_MAPS_API_KEY}
      libraries={googleMapsLibraries}
      loadingElement={
        <Card>
          <CardContent className="p-8 text-center">
            <div>Loading Google Maps...</div>
          </CardContent>
        </Card>
      }
    >
      <TransportBookingFormContent onLocationsChange={onLocationsChange} />
    </LoadScript>
  );
};

export default TransportBookingForm;
