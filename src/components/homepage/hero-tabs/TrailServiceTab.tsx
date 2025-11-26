import { useState } from 'react';
import { motion } from 'framer-motion';
import { Mountain, Calendar, Users, ArrowRight, Compass } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';

const trailTypes = [
  {
    id: 'ella-rock',
    name: "Ella Rock Trek",
    difficulty: 'Moderate',
    duration: '4-5 hours',
    elevation: '1,041m'
  },
  {
    id: 'adams-peak',
    name: "Adam's Peak Pilgrimage",
    difficulty: 'Challenging',
    duration: '5-7 hours',
    elevation: '2,243m'
  },
  {
    id: 'knuckles',
    name: 'Knuckles Mountain Range',
    difficulty: 'Hard',
    duration: 'Full day',
    elevation: '1,863m'
  },
  {
    id: 'horton',
    name: "Horton Plains & World's End",
    difficulty: 'Easy-Moderate',
    duration: '3-4 hours',
    elevation: '2,100m'
  },
  {
    id: 'sinharaja',
    name: 'Sinharaja Rainforest Trek',
    difficulty: 'Moderate',
    duration: '6-8 hours',
    elevation: 'Varied'
  }
];

const TrailServiceTab = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    trailType: '',
    date: '',
    hikers: 2,
    experienceLevel: 'beginner'
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    navigate('/trail-services', { state: formData });
  };

  return (
    <div className="space-y-6">
      {/* Trail Selection */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-3">
          <Mountain className="w-4 h-4 inline mr-1" />
          Choose Your Trail
        </label>
        <div className="space-y-2 max-h-60 overflow-y-auto pr-2">
          {trailTypes.map((trail) => (
            <button
              key={trail.id}
              type="button"
              onClick={() => setFormData({ ...formData, trailType: trail.id })}
              className={`w-full p-4 rounded-lg border-2 transition-all text-left ${
                formData.trailType === trail.id
                  ? 'border-emerald-600 bg-emerald-50 shadow-lg'
                  : 'border-gray-300 hover:border-emerald-300 hover:bg-emerald-50/50'
              }`}
            >
              <div className="font-semibold text-gray-900 mb-1">{trail.name}</div>
              <div className="flex items-center gap-4 text-sm text-gray-600">
                <span className="flex items-center gap-1">
                  <Compass className="w-3 h-3" />
                  {trail.difficulty}
                </span>
                <span>{trail.duration}</span>
                <span>{trail.elevation}</span>
              </div>
            </button>
          ))}
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Date Selection */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            <Calendar className="w-4 h-4 inline mr-1" />
            Trek Date
          </label>
          <input
            type="date"
            value={formData.date}
            onChange={(e) => setFormData({ ...formData, date: e.target.value })}
            min={new Date().toISOString().split('T')[0]}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all"
            required
          />
        </div>

        {/* Number of Hikers */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            <Users className="w-4 h-4 inline mr-1" />
            Number of Hikers
          </label>
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setFormData({ ...formData, hikers: Math.max(1, formData.hikers - 1) })}
              className="w-10 h-10 rounded-lg border border-gray-300 hover:bg-gray-100 transition-all flex items-center justify-center font-bold"
            >
              -
            </button>
            <span className="flex-1 text-center font-semibold text-lg">{formData.hikers}</span>
            <button
              type="button"
              onClick={() => setFormData({ ...formData, hikers: Math.min(15, formData.hikers + 1) })}
              className="w-10 h-10 rounded-lg border border-gray-300 hover:bg-gray-100 transition-all flex items-center justify-center font-bold"
            >
              +
            </button>
          </div>
        </div>

        {/* Experience Level */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            <Compass className="w-4 h-4 inline mr-1" />
            Your Experience Level
          </label>
          <div className="grid grid-cols-3 gap-3">
            {['beginner', 'intermediate', 'advanced'].map((level) => (
              <button
                key={level}
                type="button"
                onClick={() => setFormData({ ...formData, experienceLevel: level })}
                className={`py-3 px-4 rounded-lg font-semibold capitalize transition-all border-2 ${
                  formData.experienceLevel === level
                    ? 'bg-emerald-600 text-white border-emerald-600 shadow-lg'
                    : 'text-gray-600 border-gray-300 hover:border-emerald-300 hover:bg-emerald-50'
                }`}
              >
                {level}
              </button>
            ))}
          </div>
        </div>

        {/* Information Box */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h4 className="font-semibold text-blue-900 mb-2">What's Included:</h4>
          <ul className="text-sm text-blue-800 space-y-1">
            <li>• Experienced trekking guide</li>
            <li>• Transportation to/from trailhead</li>
            <li>• Trail permits and entrance fees</li>
            <li>• Basic first aid and safety equipment</li>
            <li>• Refreshments and packed lunch</li>
          </ul>
        </div>

        {/* Submit Button */}
        <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
          <Button
            type="submit"
            disabled={!formData.trailType}
            className="w-full bg-emerald-600 hover:bg-emerald-700 text-white py-6 text-lg font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Book Your Adventure
            <ArrowRight className="w-5 h-5" />
          </Button>
        </motion.div>

        {/* Info Text */}
        <p className="text-center text-sm text-gray-500">
          Small group sizes • Expert guides • Safety-first approach • Eco-friendly trekking
        </p>
      </form>
    </div>
  );
};

export default TrailServiceTab;
