import React, { useState } from 'react';
import { Calendar, Users, Globe, MapPin, Phone, Mail, User, Heart } from 'lucide-react';
import { RamayanaPackage } from '@/hooks/useRamayanaData';
import { useCreateRamayanaBooking } from '@/hooks/useRamayanaData';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';

interface RamayanaBookingWidgetProps {
  selectedPackage: RamayanaPackage | null;
  isOpen: boolean;
  onClose: () => void;
}

const RamayanaBookingWidget: React.FC<RamayanaBookingWidgetProps> = ({
  selectedPackage,
  isOpen,
  onClose
}) => {
  const { user } = useAuth();
  const { createBooking, loading } = useCreateRamayanaBooking();
  
  const [formData, setFormData] = useState({
    user_name: '',
    user_email: user?.email || '',
    phone_number: '',
    number_of_pilgrims: 2,
    preferred_start_date: '',
    guide_language: 'English',
    special_requests: '',
    puja_preferences: '',
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'number_of_pilgrims' ? parseInt(value) : value
    }));
  };

  const calculateTotal = () => {
    if (!selectedPackage) return 0;
    return selectedPackage.price_per_person * formData.number_of_pilgrims;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedPackage) {
      toast.error('No package selected');
      return;
    }

    if (!user) {
      toast.error('Please log in to make a booking');
      return;
    }

    const bookingData = {
      package_id: selectedPackage.id,
      ...formData,
      total_amount: calculateTotal(),
      currency: selectedPackage.currency,
    };

    const result = await createBooking(bookingData);
    
    if (result.success) {
      onClose();
      setFormData({
        user_name: '',
        user_email: user?.email || '',
        phone_number: '',
        number_of_pilgrims: 2,
        preferred_start_date: '',
        guide_language: 'English',
        special_requests: '',
        puja_preferences: '',
      });
    }
  };

  if (!isOpen || !selectedPackage) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-card rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
        {/* Header */}
        <div className="bg-primary text-primary-foreground p-6 rounded-t-xl">
          <div className="flex justify-between items-start">
            <div>
              <h2 className="text-2xl font-bold mb-2">Book Your Sacred Journey</h2>
              <p className="text-primary-foreground/80">{selectedPackage.name}</p>
            </div>
            <button
              onClick={onClose}
              className="text-primary-foreground/80 hover:text-primary-foreground text-2xl"
            >
              ×
            </button>
          </div>
        </div>

        {/* Package Summary */}
        <div className="p-6 border-b border-border">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div className="flex items-center gap-2">
              <Calendar size={16} className="text-primary" />
              <span>{selectedPackage.duration_days} days</span>
            </div>
            <div className="flex items-center gap-2">
              <Users size={16} className="text-primary" />
              <span>{selectedPackage.min_participants}-{selectedPackage.max_participants} pilgrims</span>
            </div>
            <div className="flex items-center gap-2">
              <Globe size={16} className="text-primary" />
              <span>{selectedPackage.operator}</span>
            </div>
          </div>
        </div>

        {/* Booking Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Personal Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-card-foreground flex items-center gap-2">
              <User size={20} className="text-primary" />
              Personal Information
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-card-foreground mb-2">
                  Full Name *
                </label>
                <input
                  type="text"
                  name="user_name"
                  value={formData.user_name}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent bg-background text-foreground"
                  placeholder="Enter your full name"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-card-foreground mb-2">
                  Email Address *
                </label>
                <input
                  type="email"
                  name="user_email"
                  value={formData.user_email}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent bg-background text-foreground"
                  placeholder="Enter your email"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-card-foreground mb-2">
                Phone Number
              </label>
              <input
                type="tel"
                name="phone_number"
                value={formData.phone_number}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent bg-background text-foreground"
                placeholder="Enter your phone number"
              />
            </div>
          </div>

          {/* Journey Details */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-card-foreground flex items-center gap-2">
              <MapPin size={20} className="text-primary" />
              Journey Details
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-card-foreground mb-2">
                  Number of Pilgrims *
                </label>
                <select
                  name="number_of_pilgrims"
                  value={formData.number_of_pilgrims}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent bg-background text-foreground"
                >
                  {Array.from({ length: selectedPackage.max_participants - selectedPackage.min_participants + 1 }, (_, i) => 
                    selectedPackage.min_participants + i
                  ).map(num => (
                    <option key={num} value={num}>{num} {num === 1 ? 'pilgrim' : 'pilgrims'}</option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-card-foreground mb-2">
                  Preferred Start Date *
                </label>
                <input
                  type="date"
                  name="preferred_start_date"
                  value={formData.preferred_start_date}
                  onChange={handleInputChange}
                  required
                  min={new Date().toISOString().split('T')[0]}
                  className="w-full px-3 py-2 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent bg-background text-foreground"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-card-foreground mb-2">
                Preferred Guide Language
              </label>
              <select
                name="guide_language"
                value={formData.guide_language}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent bg-background text-foreground"
              >
                {selectedPackage.guide_languages?.map(lang => (
                  <option key={lang} value={lang}>{lang}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Spiritual Preferences */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-card-foreground flex items-center gap-2">
              <Heart size={20} className="text-primary" />
              Spiritual Preferences
            </h3>
            
            <div>
              <label className="block text-sm font-medium text-card-foreground mb-2">
                Puja Preferences
              </label>
              <textarea
                name="puja_preferences"
                value={formData.puja_preferences}
                onChange={handleInputChange}
                rows={3}
                className="w-full px-3 py-2 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent bg-background text-foreground resize-none"
                placeholder="Any specific puja requirements or preferences..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-card-foreground mb-2">
                Special Requests
              </label>
              <textarea
                name="special_requests"
                value={formData.special_requests}
                onChange={handleInputChange}
                rows={3}
                className="w-full px-3 py-2 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent bg-background text-foreground resize-none"
                placeholder="Dietary requirements, accessibility needs, other requests..."
              />
            </div>
          </div>

          {/* Pricing Summary */}
          <div className="bg-muted/50 p-4 rounded-lg border border-border">
            <h4 className="font-semibold text-card-foreground mb-3">Pricing Summary</h4>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span>Price per person:</span>
                <span>${selectedPackage.price_per_person}</span>
              </div>
              <div className="flex justify-between">
                <span>Number of pilgrims:</span>
                <span>{formData.number_of_pilgrims}</span>
              </div>
              <div className="border-t border-border pt-2 flex justify-between font-semibold text-lg">
                <span>Total Amount:</span>
                <span className="text-primary">${calculateTotal()}</span>
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex gap-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-6 py-3 border border-border rounded-lg font-semibold text-card-foreground hover:bg-muted transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 px-6 py-3 bg-primary text-primary-foreground rounded-lg font-semibold hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Processing...' : 'Confirm Pilgrimage Booking'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RamayanaBookingWidget;