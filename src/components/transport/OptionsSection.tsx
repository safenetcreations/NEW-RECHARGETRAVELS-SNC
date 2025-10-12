
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";

interface OptionsSectionProps {
  control: any;
}

const OptionsSection = ({ control }: OptionsSectionProps) => {
  return (
    <>
      <FormField
        control={control}
        name="childSeat"
        render={({ field }) => (
          <FormItem className="flex flex-row items-start space-x-3 space-y-0">
            <FormControl>
              <Checkbox
                checked={field.value}
                onCheckedChange={field.onChange}
              />
            </FormControl>
            <div className="space-y-1 leading-none">
              <FormLabel>Add Child Seat (from $10)</FormLabel>
              {field.value && <p className="text-sm text-gray-500">Please specify number/age in special requests.</p>}
            </div>
          </FormItem>
        )}
      />

      <FormField
        control={control}
        name="specialRequests"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Special Requests</FormLabel>
            <FormControl>
              <Textarea placeholder="e.g. 1 child seat for a 4-year-old." {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </>
  );
};

export default OptionsSection;
