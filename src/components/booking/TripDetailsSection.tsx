
import { Input } from '@/components/ui/input';
import { Calendar, MapPin } from 'lucide-react';
import { EnhancedBookingFormData } from './types';
import { useEffect } from 'react';
import { DatePicker } from '@/components/ui/date-picker';

interface TripDetailsSectionProps {
  formData: EnhancedBookingFormData;
  onInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
  type: 'tour' | 'transport' | 'custom';
}

const TripDetailsSection = ({ formData, onInputChange, type }: TripDetailsSectionProps) => {
  // Get today's date in YYYY-MM-DD format
  const today = new Date().toISOString().split('T')[0];
  const todayDate = new Date();
  
  // Set default start date if empty
  useEffect(() => {
    if (!formData.startDate) {
      const event = {
        target: {
          name: 'startDate',
          value: today
        }
      } as React.ChangeEvent<HTMLInputElement>;
      onInputChange(event);
    }
  }, []);
  
  // Helper function to handle date changes from DatePicker
  const handleDateChange = (name: string) => (date: Date | undefined) => {
    const event = {
      target: {
        name,
        value: date ? date.toISOString().split('T')[0] : ''
      }
    } as React.ChangeEvent<HTMLInputElement>;
    onInputChange(event);
  };
  return (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold">Trip Details</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label htmlFor="startDate" className="block text-sm font-medium text-gray-700 mb-2">
            <Calendar className="h-4 w-4 inline mr-1" />
            Start Date *
          </label>
          <DatePicker
            date={formData.startDate ? new Date(formData.startDate) : todayDate}
            onDateChange={handleDateChange('startDate')}
            placeholder="Select start date"
            minDate={todayDate}
          />
        </div>
        {type !== 'transport' && (
          <div>
            <label htmlFor="endDate" className="block text-sm font-medium text-gray-700 mb-2">
              <Calendar className="h-4 w-4 inline mr-1" />
              End Date
            </label>
            <DatePicker
              date={formData.endDate ? new Date(formData.endDate) : undefined}
              onDateChange={handleDateChange('endDate')}
              placeholder="Select end date"
              minDate={formData.startDate ? new Date(formData.startDate) : todayDate}
            />
          </div>
        )}
      </div>

      {type === 'transport' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="pickup" className="block text-sm font-medium text-gray-700 mb-2">
              <MapPin className="h-4 w-4 inline mr-1" />
              Pickup Location *
            </label>
            <Input
              id="pickup"
              name="pickup"
              value={formData.pickup}
              onChange={onInputChange}
              required
              placeholder="Hotel, airport, address..."
            />
          </div>
          <div>
            <label htmlFor="destination" className="block text-sm font-medium text-gray-700 mb-2">
              <MapPin className="h-4 w-4 inline mr-1" />
              Destination *
            </label>
            <Input
              id="destination"
              name="destination"
              value={formData.destination}
              onChange={onInputChange}
              required
              placeholder="Where would you like to go?"
            />
          </div>
        </div>
      )}

      {(type === 'custom' || type === 'tour') && (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Budget Range (USD)</label>
          <select
            name="budget"
            value={formData.budget}
            onChange={onInputChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-green"
          >
            <option value="">Select budget range</option>
            <option value="under-500">Under $500</option>
            <option value="500-1000">$500 - $1,000</option>
            <option value="1000-2000">$1,000 - $2,000</option>
            <option value="2000-5000">$2,000 - $5,000</option>
            <option value="over-5000">Over $5,000</option>
          </select>
        </div>
      )}
    </div>
  );
};

export default TripDetailsSection;
