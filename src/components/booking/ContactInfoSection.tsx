
import { Input } from '@/components/ui/input';
import { Users, Mail, Phone } from 'lucide-react';
import { EnhancedBookingFormData } from './types';

interface ContactInfoSectionProps {
  formData: EnhancedBookingFormData;
  onInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
  user: any;
  type: 'tour' | 'transport' | 'custom';
}

const ContactInfoSection = ({ formData, onInputChange, user, type }: ContactInfoSectionProps) => {
  return (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold">Contact Information</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
            <Users className="h-4 w-4 inline mr-1" />
            Full Name *
          </label>
          <Input
            id="name"
            name="name"
            value={formData.name}
            onChange={onInputChange}
            required
            placeholder="Your full name"
            readOnly={!!user}
            className={user ? 'bg-gray-100' : ''}
          />
        </div>
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
            <Mail className="h-4 w-4 inline mr-1" />
            Email Address *
          </label>
          <Input
            id="email"
            name="email"
            type="email"
            value={formData.email}
            onChange={onInputChange}
            required
            placeholder="your@email.com"
            readOnly={!!user}
            className={user ? 'bg-gray-100' : ''}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
            <Phone className="h-4 w-4 inline mr-1" />
            Phone Number *
          </label>
          <Input
            id="phone"
            name="phone"
            value={formData.phone}
            onChange={onInputChange}
            required
            placeholder="+94 77 772 1999"
          />
        </div>
        <div>
          <label htmlFor="guests" className="block text-sm font-medium text-gray-700 mb-2">
            <Users className="h-4 w-4 inline mr-1" />
            Number of {type === 'transport' ? 'Passengers' : 'Guests'} *
          </label>
          <Input
            id="guests"
            name="guests"
            type="number"
            min="1"
            max="15"
            value={formData.guests}
            onChange={onInputChange}
            required
          />
        </div>
      </div>
    </div>
  );
};

export default ContactInfoSection;
