
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';

interface ContactSectionProps {
  control: any;
}

const ContactSection = ({ control }: ContactSectionProps) => {
  return (
    <div className="border-t pt-6">
      <h3 className="text-lg font-semibold mb-4">Contact Information</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
         <FormField
            control={control}
            name="contactName"
            render={({ field }) => (
              <FormItem><FormLabel>Full Name</FormLabel><FormControl><Input placeholder="Your full name" {...field} /></FormControl><FormMessage /></FormItem>
            )}
          />
          <FormField
            control={control}
            name="contactPhone"
            render={({ field }) => (
              <FormItem><FormLabel>Mobile/WhatsApp Number</FormLabel><FormControl><Input type="tel" placeholder="+94 77 123 4567" {...field} /></FormControl><FormMessage /></FormItem>
            )}
          />
      </div>
       <div className="mt-4">
          <FormField
            control={control}
            name="contactEmail"
            render={({ field }) => (
              <FormItem><FormLabel>Email Address</FormLabel><FormControl><Input type="email" placeholder="your.email@example.com" {...field} /></FormControl><FormMessage /></FormItem>
            )}
          />
      </div>
    </div>
  );
};

export default ContactSection;
