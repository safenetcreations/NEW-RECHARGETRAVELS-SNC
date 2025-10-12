
import { EnhancedBookingFormData } from './types';

interface InterestsSectionProps {
  formData: EnhancedBookingFormData;
  onInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
  onInterestToggle: (interest: string) => void;
}

const InterestsSection = ({ formData, onInputChange, onInterestToggle }: InterestsSectionProps) => {
  const interests = [
    'Wildlife Safari', 'Cultural Sites', 'Beach Activities', 'Mountain Hiking',
    'Tea Plantations', 'Local Cuisine', 'Photography', 'Adventure Sports'
  ];

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold">Your Interests</h3>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {interests.map((interest) => (
          <button
            key={interest}
            type="button"
            onClick={() => onInterestToggle(interest)}
            className={`p-3 rounded-lg border-2 text-sm transition-colors ${
              formData.interests.includes(interest)
                ? 'border-teal-green bg-teal-green text-white'
                : 'border-gray-200 hover:border-teal-green'
            }`}
          >
            {interest}
          </button>
        ))}
      </div>

      <div>
        <label htmlFor="accommodation" className="block text-sm font-medium text-gray-700 mb-2">
          Accommodation Preference
        </label>
        <select
          name="accommodation"
          value={formData.accommodation}
          onChange={onInputChange}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-green"
        >
          <option value="">Select preference</option>
          <option value="luxury">Luxury Hotels</option>
          <option value="boutique">Boutique Hotels</option>
          <option value="mid-range">Mid-range Hotels</option>
          <option value="guesthouse">Guesthouses</option>
          <option value="eco-lodge">Eco Lodges</option>
        </select>
      </div>
    </div>
  );
};

export default InterestsSection;
