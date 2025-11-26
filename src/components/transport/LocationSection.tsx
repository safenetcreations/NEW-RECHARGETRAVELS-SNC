
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { MapPin } from 'lucide-react';
import SimpleLocationInput from './SimpleLocationInput';

interface LocationSectionProps {
  control: any;
  serviceType: string;
}

const LocationSection = ({ control, serviceType }: LocationSectionProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <FormField
        control={control}
        name="pickupLocation"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="flex items-center">
              <MapPin className="inline h-4 w-4 mr-1" /> 
              Pickup Location
            </FormLabel>
            <FormControl>
              <SimpleLocationInput
                value={field.value || ''}
                onChange={field.onChange}
                onBlur={field.onBlur}
                name={field.name}
                placeholder="Enter pickup location"
                readOnly={serviceType === 'airport-pickup'}
                className={serviceType === 'airport-pickup' ? 'bg-gray-100' : ''}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={control}
        name="dropoffLocation"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="flex items-center">
              <MapPin className="inline h-4 w-4 mr-1" /> 
              Drop-off Location
            </FormLabel>
            <FormControl>
              <SimpleLocationInput
                value={field.value || ''}
                onChange={field.onChange}
                onBlur={field.onBlur}
                name={field.name}
                placeholder="Enter drop-off location"
                readOnly={serviceType === 'airport-dropoff'}
                className={serviceType === 'airport-dropoff' ? 'bg-gray-100' : ''}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
};

export default LocationSection;
