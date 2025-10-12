
import { Controller } from 'react-hook-form';
import { FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Plane } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { TransportFormValues } from './types';

interface ServiceTypeSectionProps {
  control: any;
  serviceType: string;
}

const ServiceTypeSection = ({ control, serviceType }: ServiceTypeSectionProps) => {
  return (
    <>
      <FormField
        control={control}
        name="serviceType"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Service Type</FormLabel>
            <select {...field} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
              <option value="airport-pickup">Airport Pickup</option>
              <option value="airport-dropoff">Airport Drop-off</option>
              <option value="hotel-transfer">Hotel to Hotel Transfer</option>
              <option value="custom-journey">Custom Point-to-Point</option>
            </select>
            <FormMessage />
          </FormItem>
        )}
      />
      
      {serviceType === 'airport-pickup' && (
        <FormField
          control={control}
          name="flightNumber"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="flex items-center"><Plane className="inline h-4 w-4 mr-1" /> Flight Number</FormLabel>
              <Input placeholder="e.g., EK247" {...field} />
              <p className="text-xs text-gray-500">For flight monitoring and timely pickups.</p>
              <FormMessage />
            </FormItem>
          )}
        />
      )}
    </>
  );
};

export default ServiceTypeSection;
