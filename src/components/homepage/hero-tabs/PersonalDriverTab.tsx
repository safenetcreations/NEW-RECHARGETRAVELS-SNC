import { useState } from 'react';
import { motion } from 'framer-motion';
import { MapPin, Calendar, Users, Clock, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';

const serviceTypes = [
  { id: 'hourly', label: 'Hourly Service', minHours: 4 },
  { id: 'daily', label: 'Daily Service', days: 1 },
  { id: 'multiday', label: 'Multi-Day Tour', days: 2 }
];

const PersonalDriverTab = () => {
  const navigate = useNavigate();
  const [serviceType, setServiceType] = useState('hourly');
  const [formData, setFormData] = useState({
    pickupLocation: '',
    startDate: '',
    startTime: '',
    hours: 4,
    days: 1,
    passengers: 2
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    navigate('/personal-driver', { state: { serviceType, ...formData } });
  };

  return (
    <div className="space-y-6">
      {/* Service Type Selection */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {serviceTypes.map((type) => (
          <button
            key={type.id}
            onClick={() => setServiceType(type.id)}
            className={`py-4 px-4 rounded-lg font-semibold transition-all border-2 ${
              serviceType === type.id
                ? 'bg-emerald-600 text-white border-emerald-600 shadow-lg'
                : 'text-gray-600 border-gray-300 hover:border-emerald-300 hover:bg-emerald-50'
            }`}
          >
            {type.label}
          </button>
        ))}
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Pickup Location */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            <MapPin className="w-4 h-4 inline mr-1" />
            Pickup Location
          </label>
          <input
            type="text"
            value={formData.pickupLocation}
            onChange={(e) => setFormData({ ...formData, pickupLocation: e.target.value })}
            placeholder="Enter your hotel or address"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all"
            required
          />
        </div>

        {/* Date and Time */}
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
              <Clock className="w-4 h-4 inline mr-1" />
              Start Time
            </label>
            <input
              type="time"
              value={formData.startTime}
              onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all"
              required
            />
          </div>
        </div>

        {/* Duration/Days Selection */}
        {serviceType === 'hourly' && (
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              <Clock className="w-4 h-4 inline mr-1" />
              Number of Hours (Minimum 4)
            </label>
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setFormData({ ...formData, hours: Math.max(4, formData.hours - 1) })}
                className="w-12 h-12 rounded-lg border border-gray-300 hover:bg-gray-100 transition-all flex items-center justify-center font-bold text-lg"
              >
                -
              </button>
              <div className="flex-1 text-center">
                <div className="text-3xl font-bold text-emerald-600">{formData.hours}</div>
                <div className="text-sm text-gray-500">hours</div>
              </div>
              <button
                type="button"
                onClick={() => setFormData({ ...formData, hours: Math.min(16, formData.hours + 1) })}
                className="w-12 h-12 rounded-lg border border-gray-300 hover:bg-gray-100 transition-all flex items-center justify-center font-bold text-lg"
              >
                +
              </button>
            </div>
          </div>
        )}

        {(serviceType === 'daily' || serviceType === 'multiday') && (
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              <Calendar className="w-4 h-4 inline mr-1" />
              Number of Days
            </label>
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setFormData({ ...formData, days: Math.max(1, formData.days - 1) })}
                className="w-12 h-12 rounded-lg border border-gray-300 hover:bg-gray-100 transition-all flex items-center justify-center font-bold text-lg"
              >
                -
              </button>
              <div className="flex-1 text-center">
                <div className="text-3xl font-bold text-emerald-600">{formData.days}</div>
                <div className="text-sm text-gray-500">days</div>
              </div>
              <button
                type="button"
                onClick={() => setFormData({ ...formData, days: Math.min(30, formData.days + 1) })}
                className="w-12 h-12 rounded-lg border border-gray-300 hover:bg-gray-100 transition-all flex items-center justify-center font-bold text-lg"
              >
                +
              </button>
            </div>
          </div>
        )}

        {/* Passengers */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            <Users className="w-4 h-4 inline mr-1" />
            Number of Passengers
          </label>
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setFormData({ ...formData, passengers: Math.max(1, formData.passengers - 1) })}
              className="w-10 h-10 rounded-lg border border-gray-300 hover:bg-gray-100 transition-all flex items-center justify-center font-bold"
            >
              -
            </button>
            <span className="flex-1 text-center font-semibold text-lg">{formData.passengers}</span>
            <button
              type="button"
              onClick={() => setFormData({ ...formData, passengers: Math.min(12, formData.passengers + 1) })}
              className="w-10 h-10 rounded-lg border border-gray-300 hover:bg-gray-100 transition-all flex items-center justify-center font-bold"
            >
              +
            </button>
          </div>
        </div>

        {/* Submit Button */}
        <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
          <Button
            type="submit"
            className="w-full bg-emerald-600 hover:bg-emerald-700 text-white py-6 text-lg font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2"
          >
            Get Quote & Book Now
            <ArrowRight className="w-5 h-5" />
          </Button>
        </motion.div>

        {/* Info Text */}
        <p className="text-center text-sm text-gray-500">
          Experienced English-speaking drivers • Flexible itineraries • Door-to-door service
        </p>
      </form>
    </div>
  );
};

export default PersonalDriverTab;
