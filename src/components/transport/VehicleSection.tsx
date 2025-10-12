
import { FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Users, Car } from 'lucide-react';
import { vehicleTypes } from './types';

interface VehicleSectionProps {
  control: any;
}

const VehicleSection = ({ control }: VehicleSectionProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
       <FormField
        control={control}
        name="passengers"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="flex items-center"><Users className="inline h-4 w-4 mr-1" /> Passengers</FormLabel>
            <select {...field} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
              {[...Array(30).keys()].map(i => i + 1).map(num => (
                <option key={num} value={num.toString()}>{num} {num === 1 ? 'passenger' : 'passengers'}</option>
              ))}
            </select>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={control}
        name="vehicleType"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="flex items-center"><Car className="inline h-4 w-4 mr-1" /> Vehicle Type</FormLabel>
             <select {...field} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-100" disabled>
                {vehicleTypes.map(vehicle => (
                  <option key={vehicle.id} value={vehicle.id}>{vehicle.name}</option>
                ))}
            </select>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
};

export default VehicleSection;
