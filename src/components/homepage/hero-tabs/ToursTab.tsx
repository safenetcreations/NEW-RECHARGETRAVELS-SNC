import { useState } from 'react';
import { motion } from 'framer-motion';
import { MapPin, Calendar, Users, ArrowRight, Star } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';

const popularTours = [
  { id: 'cultural', name: 'Cultural Triangle Tour', duration: '5-7 days', price: 'From $450' },
  { id: 'beach', name: 'Beach & Relaxation', duration: '4-6 days', price: 'From $380' },
  { id: 'wildlife', name: 'Wildlife Safari Adventure', duration: '6-8 days', price: 'From $550' },
  { id: 'hill', name: 'Hill Country Explorer', duration: '4-5 days', price: 'From $420' },
  { id: 'custom', name: 'Custom Tour Package', duration: 'Flexible', price: 'Custom Quote' }
];

const ToursTab = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    tourType: '',
    startDate: '',
    endDate: '',
    travelers: 2,
    interests: [] as string[]
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.tourType === 'custom') {
      navigate('/custom-tour', { state: formData });
    } else {
      navigate('/tours', { state: formData });
    }
  };

  return (
    <div className="space-y-6">
      {/* Popular Tours Selection */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-3">
          <Star className="w-4 h-4 inline mr-1" />
          Select Tour Package
        </label>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {popularTours.map((tour) => (
            <button
              key={tour.id}
              type="button"
              onClick={() => setFormData({ ...formData, tourType: tour.id })}
              className={`p-4 rounded-lg border-2 transition-all text-left ${
                formData.tourType === tour.id
                  ? 'border-emerald-600 bg-emerald-50 shadow-lg'
                  : 'border-gray-300 hover:border-emerald-300 hover:bg-emerald-50/50'
              }`}
            >
              <div className="font-semibold text-gray-900 mb-1">{tour.name}</div>
              <div className="flex items-center justify-between text-sm text-gray-600">
                <span>{tour.duration}</span>
                <span className="font-semibold text-emerald-600">{tour.price}</span>
              </div>
            </button>
          ))}
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Date Range */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              <Calendar className="w-4 h-4 inline mr-1" />
              Start Date
            </label>
            <input
              type="date"
              value={formData.startDate}
              onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
              min={new Date().toISOString().split('T')[0]}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              End Date (Optional)
            </label>
            <input
              type="date"
              value={formData.endDate}
              onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
              min={formData.startDate || new Date().toISOString().split('T')[0]}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all"
            />
          </div>
        </div>

        {/* Number of Travelers */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            <Users className="w-4 h-4 inline mr-1" />
            Number of Travelers
          </label>
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setFormData({ ...formData, travelers: Math.max(1, formData.travelers - 1) })}
              className="w-10 h-10 rounded-lg border border-gray-300 hover:bg-gray-100 transition-all flex items-center justify-center font-bold"
            >
              -
            </button>
            <span className="flex-1 text-center font-semibold text-lg">{formData.travelers}</span>
            <button
              type="button"
              onClick={() => setFormData({ ...formData, travelers: Math.min(20, formData.travelers + 1) })}
              className="w-10 h-10 rounded-lg border border-gray-300 hover:bg-gray-100 transition-all flex items-center justify-center font-bold"
            >
              +
            </button>
          </div>
        </div>

        {/* Interests (for custom tour) */}
        {formData.tourType === 'custom' && (
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              <MapPin className="w-4 h-4 inline mr-1" />
              Your Interests (Optional)
            </label>
            <div className="flex flex-wrap gap-2">
              {['Culture', 'Wildlife', 'Beaches', 'Adventure', 'Nature', 'Food'].map((interest) => (
                <button
                  key={interest}
                  type="button"
                  onClick={() => {
                    const newInterests = formData.interests.includes(interest)
                      ? formData.interests.filter(i => i !== interest)
                      : [...formData.interests, interest];
                    setFormData({ ...formData, interests: newInterests });
                  }}
                  className={`px-4 py-2 rounded-full text-sm font-semibold transition-all ${
                    formData.interests.includes(interest)
                      ? 'bg-emerald-600 text-white'
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  {interest}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Submit Button */}
        <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
          <Button
            type="submit"
            disabled={!formData.tourType}
            className="w-full bg-emerald-600 hover:bg-emerald-700 text-white py-6 text-lg font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {formData.tourType === 'custom' ? 'Request Custom Quote' : 'View Tour Details'}
            <ArrowRight className="w-5 h-5" />
          </Button>
        </motion.div>

        {/* Info Text */}
        <p className="text-center text-sm text-gray-500">
          Expert local guides • Accommodation included • Flexible itineraries
        </p>
      </form>
    </div>
  );
};

export default ToursTab;
