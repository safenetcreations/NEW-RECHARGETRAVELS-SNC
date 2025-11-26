
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Calendar, Clock } from 'lucide-react';

interface DateTimeSectionProps {
  control: any;
}

const DateTimeSection = ({ control }: DateTimeSectionProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <FormField
        control={control}
        name="pickupDate"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="flex items-center"><Calendar className="inline h-4 w-4 mr-1" /> Pickup Date</FormLabel>
            <FormControl><Input type="date" min={new Date().toISOString().split('T')[0]} {...field} /></FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={control}
        name="pickupTime"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="flex items-center"><Clock className="inline h-4 w-4 mr-1" /> Pickup Time</FormLabel>
            <FormControl><Input type="time" {...field} /></FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
};

export default DateTimeSection;
