import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  X, Leaf, Calendar, Users, Heart, Phone, Mail, User,
  CheckCircle, ArrowRight, ArrowLeft, Sparkles, Clock,
  Shield, Star, MapPin, MessageSquare
} from 'lucide-react';

interface AyurvedaBookingFormData {
  // Step 1: Package Selection
  packageType: 'retreat' | 'treatment' | 'custom';
  selectedPackage: string;
  duration: string;

  // Step 2: Wellness Goals
  healthGoals: string[];
  dietaryRestrictions: string;
  currentConditions: string;

  // Step 3: Stay Details
  checkInDate: string;
  checkOutDate: string;
  guests: number;
  roomPreference: 'standard' | 'deluxe' | 'suite';

  // Step 4: Contact Info
  fullName: string;
  email: string;
  phone: string;
  whatsapp: string;
  country: string;
  specialRequests: string;
}

interface AyurvedaBookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  packageTitle?: string;
  packagePrice?: number;
  packageDuration?: string;
  packageType?: 'retreat' | 'treatment';
}

const WELLNESS_GOALS = [
  { id: 'detox', label: 'Detox & Cleanse', icon: '🧘' },
  { id: 'stress', label: 'Stress Relief', icon: '😌' },
  { id: 'weight', label: 'Weight Management', icon: '⚖️' },
  { id: 'skin', label: 'Skin & Beauty', icon: '✨' },
  { id: 'immunity', label: 'Immunity Boost', icon: '🛡️' },
  { id: 'pain', label: 'Pain Relief', icon: '💪' },
  { id: 'sleep', label: 'Sleep Improvement', icon: '😴' },
  { id: 'digestive', label: 'Digestive Health', icon: '🌿' },
];

const ROOM_OPTIONS = [
  { id: 'standard', name: 'Garden Room', price: '$120/night', desc: 'Peaceful garden views' },
  { id: 'deluxe', name: 'Lake View Room', price: '$180/night', desc: 'Stunning lake panorama' },
  { id: 'suite', name: 'Ayurveda Suite', price: '$280/night', desc: 'Private treatment room' },
];

const STEPS = [
  { id: 1, title: 'Package', icon: Leaf },
  { id: 2, title: 'Wellness', icon: Heart },
  { id: 3, title: 'Stay', icon: Calendar },
  { id: 4, title: 'Contact', icon: Phone },
  { id: 5, title: 'Review', icon: CheckCircle },
];

const AyurvedaBookingModal: React.FC<AyurvedaBookingModalProps> = ({
  isOpen,
  onClose,
  packageTitle = '',
  packagePrice = 0,
  packageDuration = '',
  packageType = 'retreat',
}) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const [formData, setFormData] = useState<AyurvedaBookingFormData>({
    packageType: packageType,
    selectedPackage: packageTitle,
    duration: packageDuration,
    healthGoals: [],
    dietaryRestrictions: '',
    currentConditions: '',
    checkInDate: '',
    checkOutDate: '',
    guests: 1,
    roomPreference: 'deluxe',
    fullName: '',
    email: '',
    phone: '',
    whatsapp: '',
    country: '',
    specialRequests: '',
  });

  const updateFormData = (updates: Partial<AyurvedaBookingFormData>) => {
    setFormData(prev => ({ ...prev, ...updates }));
  };

  const toggleHealthGoal = (goalId: string) => {
    setFormData(prev => ({
      ...prev,
      healthGoals: prev.healthGoals.includes(goalId)
        ? prev.healthGoals.filter(g => g !== goalId)
        : [...prev.healthGoals, goalId]
    }));
  };

  const nextStep = () => {
    if (currentStep < STEPS.length) {
      setCurrentStep(prev => prev + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      setIsSuccess(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  const isStepValid = () => {
    switch (currentStep) {
      case 1:
        return formData.selectedPackage || formData.packageType === 'custom';
      case 2:
        return formData.healthGoals.length > 0;
      case 3:
        return formData.checkInDate && formData.guests >= 1;
      case 4:
        return formData.fullName && formData.email && formData.phone;
      case 5:
        return true;
      default:
        return false;
    }
  };

  const handleClose = () => {
    setCurrentStep(1);
    setIsSuccess(false);
    onClose();
  };

  if (isSuccess) {
    return (
      <Dialog open={isOpen} onOpenChange={handleClose}>
        <DialogContent className="max-w-lg p-0 overflow-hidden">
          <div className="bg-gradient-to-br from-emerald-600 to-teal-600 p-8 text-center text-white">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', duration: 0.5 }}
              className="w-20 h-20 mx-auto mb-6 bg-white/20 rounded-full flex items-center justify-center"
            >
              <CheckCircle className="w-10 h-10" />
            </motion.div>
            <h2 className="text-2xl font-bold mb-2">Booking Request Received!</h2>
            <p className="text-emerald-100 mb-6">
              Thank you for choosing Recharge Travels for your wellness journey.
              Our Ayurveda specialists will contact you within 24 hours.
            </p>
            <div className="bg-white/10 rounded-xl p-4 mb-6">
              <p className="text-sm text-emerald-100">Booking Reference</p>
              <p className="text-xl font-mono font-bold">AYR-{Date.now().toString(36).toUpperCase()}</p>
            </div>
            <Button onClick={handleClose} className="bg-white text-emerald-700 hover:bg-emerald-50">
              Close
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl p-0 overflow-hidden max-h-[90vh] overflow-y-auto">
        {/* Header with Progress */}
        <div className="bg-gradient-to-r from-emerald-600 to-teal-600 p-4 sm:p-6 sticky top-0 z-10">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-white font-bold text-lg sm:text-xl flex items-center gap-2">
              <Leaf className="w-5 h-5" />
              Book Your Wellness Journey
            </h2>
            <button onClick={handleClose} className="text-white/80 hover:text-white p-1">
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Step Indicators */}
          <div className="flex items-center justify-between">
            {STEPS.map((step, index) => {
              const Icon = step.icon;
              const isActive = currentStep === step.id;
              const isCompleted = currentStep > step.id;

              return (
                <React.Fragment key={step.id}>
                  <div className="flex flex-col items-center">
                    <div className={`
                      w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center transition-all
                      ${isActive ? 'bg-white text-emerald-600 scale-110 shadow-lg' :
                        isCompleted ? 'bg-emerald-400 text-white' : 'bg-emerald-700/50 text-white/60'}
                    `}>
                      {isCompleted ? <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5" /> : <Icon className="w-4 h-4 sm:w-5 sm:h-5" />}
                    </div>
                    <span className={`text-xs mt-1 hidden sm:block ${isActive ? 'text-white font-medium' : 'text-white/60'}`}>
                      {step.title}
                    </span>
                  </div>
                  {index < STEPS.length - 1 && (
                    <div className={`flex-1 h-0.5 mx-1 sm:mx-2 transition-all ${isCompleted ? 'bg-emerald-400' : 'bg-emerald-700/50'}`} />
                  )}
                </React.Fragment>
              );
            })}
          </div>
        </div>

        {/* Step Content */}
        <div className="p-4 sm:p-6 min-h-[320px]">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.2 }}
            >
              {currentStep === 1 && (
                <Step1Package
                  formData={formData}
                  updateFormData={updateFormData}
                  preselectedTitle={packageTitle}
                  preselectedPrice={packagePrice}
                />
              )}
              {currentStep === 2 && (
                <Step2Wellness
                  formData={formData}
                  updateFormData={updateFormData}
                  toggleHealthGoal={toggleHealthGoal}
                />
              )}
              {currentStep === 3 && (
                <Step3Stay formData={formData} updateFormData={updateFormData} />
              )}
              {currentStep === 4 && (
                <Step4Contact formData={formData} updateFormData={updateFormData} />
              )}
              {currentStep === 5 && (
                <Step5Review formData={formData} packagePrice={packagePrice} />
              )}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Navigation Footer */}
        <div className="border-t bg-gray-50 p-4 flex justify-between items-center sticky bottom-0">
          <Button
            variant="outline"
            onClick={prevStep}
            disabled={currentStep === 1}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="hidden sm:inline">Back</span>
          </Button>

          <div className="flex items-center gap-2 text-sm text-gray-500">
            Step {currentStep} of {STEPS.length}
          </div>

          {currentStep < STEPS.length ? (
            <Button
              onClick={nextStep}
              disabled={!isStepValid()}
              className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700"
            >
              <span className="hidden sm:inline">Continue</span>
              <span className="sm:hidden">Next</span>
              <ArrowRight className="w-4 h-4" />
            </Button>
          ) : (
            <Button
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="flex items-center gap-2 bg-amber-500 hover:bg-amber-600 text-emerald-900"
            >
              {isSubmitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-emerald-900/30 border-t-emerald-900 rounded-full animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  Confirm Booking
                </>
              )}
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

// Step 1: Package Selection
const Step1Package: React.FC<{
  formData: AyurvedaBookingFormData;
  updateFormData: (data: Partial<AyurvedaBookingFormData>) => void;
  preselectedTitle: string;
  preselectedPrice: number;
}> = ({ formData, updateFormData, preselectedTitle, preselectedPrice }) => (
  <div className="space-y-4">
    <h3 className="text-lg font-semibold text-gray-800 mb-4">Select Your Experience</h3>

    {/* Package Type */}
    <div className="grid grid-cols-3 gap-2 sm:gap-3">
      {[
        { id: 'retreat', label: 'Retreat', icon: '🏨', desc: 'Full wellness stay' },
        { id: 'treatment', label: 'Treatment', icon: '💆', desc: 'Day therapies' },
        { id: 'custom', label: 'Custom', icon: '✨', desc: 'Personalized' },
      ].map((type) => (
        <button
          key={type.id}
          onClick={() => updateFormData({ packageType: type.id as any })}
          className={`p-3 sm:p-4 rounded-xl border-2 transition-all text-center ${
            formData.packageType === type.id
              ? 'border-emerald-500 bg-emerald-50 text-emerald-700'
              : 'border-gray-200 hover:border-emerald-300'
          }`}
        >
          <span className="text-2xl block mb-1">{type.icon}</span>
          <span className="text-sm font-medium block">{type.label}</span>
          <span className="text-xs text-gray-500 hidden sm:block">{type.desc}</span>
        </button>
      ))}
    </div>

    {/* Pre-selected Package Display */}
    {preselectedTitle && (
      <div className="bg-gradient-to-r from-emerald-50 to-amber-50 rounded-xl p-4 border border-emerald-200">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-sm text-emerald-600 font-medium mb-1">Selected Package</p>
            <h4 className="text-lg font-bold text-emerald-900">{preselectedTitle}</h4>
            {formData.duration && (
              <p className="text-sm text-gray-600 flex items-center gap-1 mt-1">
                <Clock className="w-4 h-4" /> {formData.duration}
              </p>
            )}
          </div>
          {preselectedPrice > 0 && (
            <div className="text-right">
              <p className="text-sm text-gray-500">From</p>
              <p className="text-2xl font-bold text-amber-600">${preselectedPrice}</p>
            </div>
          )}
        </div>
      </div>
    )}

    {/* Custom Package Input */}
    {formData.packageType === 'custom' && !preselectedTitle && (
      <div>
        <label className="text-sm font-medium text-gray-700 mb-1 block">Describe Your Ideal Experience</label>
        <Textarea
          value={formData.selectedPackage}
          onChange={(e) => updateFormData({ selectedPackage: e.target.value })}
          placeholder="Tell us about your wellness goals and preferences..."
          rows={4}
        />
      </div>
    )}
  </div>
);

// Step 2: Wellness Goals
const Step2Wellness: React.FC<{
  formData: AyurvedaBookingFormData;
  updateFormData: (data: Partial<AyurvedaBookingFormData>) => void;
  toggleHealthGoal: (goalId: string) => void;
}> = ({ formData, updateFormData, toggleHealthGoal }) => (
  <div className="space-y-4">
    <h3 className="text-lg font-semibold text-gray-800 mb-2">Your Wellness Goals</h3>
    <p className="text-sm text-gray-600 mb-4">Select all that apply to personalize your experience</p>

    {/* Health Goals Grid */}
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
      {WELLNESS_GOALS.map((goal) => (
        <button
          key={goal.id}
          onClick={() => toggleHealthGoal(goal.id)}
          className={`p-3 rounded-xl border-2 transition-all text-center ${
            formData.healthGoals.includes(goal.id)
              ? 'border-emerald-500 bg-emerald-50 text-emerald-700'
              : 'border-gray-200 hover:border-emerald-300'
          }`}
        >
          <span className="text-xl block mb-1">{goal.icon}</span>
          <span className="text-xs font-medium">{goal.label}</span>
        </button>
      ))}
    </div>

    {/* Health Information */}
    <div className="space-y-3 mt-4">
      <div>
        <label className="text-sm font-medium text-gray-700 mb-1 block">
          Dietary Restrictions / Allergies
        </label>
        <Input
          value={formData.dietaryRestrictions}
          onChange={(e) => updateFormData({ dietaryRestrictions: e.target.value })}
          placeholder="Vegetarian, vegan, nut allergy, etc."
        />
      </div>
      <div>
        <label className="text-sm font-medium text-gray-700 mb-1 block">
          Current Health Conditions (Optional)
        </label>
        <Textarea
          value={formData.currentConditions}
          onChange={(e) => updateFormData({ currentConditions: e.target.value })}
          placeholder="Any medical conditions our therapists should be aware of..."
          rows={2}
        />
      </div>
    </div>
  </div>
);

// Step 3: Stay Details
const Step3Stay: React.FC<{
  formData: AyurvedaBookingFormData;
  updateFormData: (data: Partial<AyurvedaBookingFormData>) => void;
}> = ({ formData, updateFormData }) => (
  <div className="space-y-4">
    <h3 className="text-lg font-semibold text-gray-800 mb-4">Your Stay Details</h3>

    {/* Dates */}
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
      <div>
        <label className="text-sm font-medium text-gray-700 mb-1 block">Check-in Date *</label>
        <div className="relative">
          <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <Input
            type="date"
            value={formData.checkInDate}
            onChange={(e) => updateFormData({ checkInDate: e.target.value })}
            className="pl-10"
            min={new Date().toISOString().split('T')[0]}
          />
        </div>
      </div>
      <div>
        <label className="text-sm font-medium text-gray-700 mb-1 block">Check-out Date</label>
        <div className="relative">
          <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <Input
            type="date"
            value={formData.checkOutDate}
            onChange={(e) => updateFormData({ checkOutDate: e.target.value })}
            className="pl-10"
            min={formData.checkInDate || new Date().toISOString().split('T')[0]}
          />
        </div>
      </div>
    </div>

    {/* Guests */}
    <div>
      <label className="text-sm font-medium text-gray-700 mb-2 block">Number of Guests *</label>
      <div className="flex items-center gap-3 bg-gray-50 rounded-xl p-4 w-fit">
        <button
          onClick={() => updateFormData({ guests: Math.max(1, formData.guests - 1) })}
          className="w-10 h-10 rounded-lg bg-emerald-100 hover:bg-emerald-200 text-emerald-700 font-bold text-xl"
        >
          -
        </button>
        <span className="w-12 text-center font-bold text-xl">{formData.guests}</span>
        <button
          onClick={() => updateFormData({ guests: Math.min(6, formData.guests + 1) })}
          className="w-10 h-10 rounded-lg bg-emerald-100 hover:bg-emerald-200 text-emerald-700 font-bold text-xl"
        >
          +
        </button>
      </div>
    </div>

    {/* Room Preference */}
    <div>
      <label className="text-sm font-medium text-gray-700 mb-2 block">Room Preference</label>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {ROOM_OPTIONS.map((room) => (
          <button
            key={room.id}
            onClick={() => updateFormData({ roomPreference: room.id as any })}
            className={`p-4 rounded-xl border-2 transition-all text-left ${
              formData.roomPreference === room.id
                ? 'border-emerald-500 bg-emerald-50'
                : 'border-gray-200 hover:border-emerald-300'
            }`}
          >
            <span className="font-semibold block">{room.name}</span>
            <span className="text-xs text-gray-500 block">{room.desc}</span>
            <span className="text-sm font-medium text-amber-600 block mt-1">{room.price}</span>
          </button>
        ))}
      </div>
    </div>
  </div>
);

// Step 4: Contact Information
const Step4Contact: React.FC<{
  formData: AyurvedaBookingFormData;
  updateFormData: (data: Partial<AyurvedaBookingFormData>) => void;
}> = ({ formData, updateFormData }) => (
  <div className="space-y-4">
    <h3 className="text-lg font-semibold text-gray-800 mb-4">Your Contact Details</h3>

    <div className="space-y-3">
      <div>
        <label className="text-sm font-medium text-gray-700 mb-1 block">Full Name *</label>
        <div className="relative">
          <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <Input
            value={formData.fullName}
            onChange={(e) => updateFormData({ fullName: e.target.value })}
            placeholder="Enter your full name"
            className="pl-10"
          />
        </div>
      </div>

      <div>
        <label className="text-sm font-medium text-gray-700 mb-1 block">Email *</label>
        <div className="relative">
          <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <Input
            type="email"
            value={formData.email}
            onChange={(e) => updateFormData({ email: e.target.value })}
            placeholder="your@email.com"
            className="pl-10"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div>
          <label className="text-sm font-medium text-gray-700 mb-1 block">Phone *</label>
          <div className="relative">
            <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <Input
              type="tel"
              value={formData.phone}
              onChange={(e) => updateFormData({ phone: e.target.value })}
              placeholder="+1 234 567 8900"
              className="pl-10"
            />
          </div>
        </div>

        <div>
          <label className="text-sm font-medium text-gray-700 mb-1 block">WhatsApp</label>
          <div className="relative">
            <MessageSquare className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <Input
              type="tel"
              value={formData.whatsapp}
              onChange={(e) => updateFormData({ whatsapp: e.target.value })}
              placeholder="Same as phone"
              className="pl-10"
            />
          </div>
        </div>
      </div>

      <div>
        <label className="text-sm font-medium text-gray-700 mb-1 block">Country</label>
        <div className="relative">
          <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <Input
            value={formData.country}
            onChange={(e) => updateFormData({ country: e.target.value })}
            placeholder="Your country of residence"
            className="pl-10"
          />
        </div>
      </div>

      <div>
        <label className="text-sm font-medium text-gray-700 mb-1 block">Special Requests</label>
        <Textarea
          value={formData.specialRequests}
          onChange={(e) => updateFormData({ specialRequests: e.target.value })}
          placeholder="Airport transfer, special diet, early check-in..."
          rows={3}
        />
      </div>
    </div>
  </div>
);

// Step 5: Review
const Step5Review: React.FC<{
  formData: AyurvedaBookingFormData;
  packagePrice: number;
}> = ({ formData, packagePrice }) => (
  <div className="space-y-4">
    <h3 className="text-lg font-semibold text-gray-800 mb-4">Review Your Booking</h3>

    <div className="space-y-3">
      {/* Package */}
      <div className="bg-emerald-50 rounded-xl p-4">
        <h4 className="font-medium text-emerald-800 mb-2 flex items-center gap-2">
          <Leaf className="w-4 h-4" /> Package
        </h4>
        <p className="font-semibold">{formData.selectedPackage || 'Custom Experience'}</p>
        <p className="text-sm text-gray-600 capitalize">{formData.packageType} • {formData.duration || 'Flexible'}</p>
      </div>

      {/* Wellness Goals */}
      <div className="bg-pink-50 rounded-xl p-4">
        <h4 className="font-medium text-pink-800 mb-2 flex items-center gap-2">
          <Heart className="w-4 h-4" /> Wellness Goals
        </h4>
        <div className="flex flex-wrap gap-1">
          {formData.healthGoals.map(goalId => {
            const goal = WELLNESS_GOALS.find(g => g.id === goalId);
            return goal ? (
              <span key={goalId} className="text-xs bg-white px-2 py-1 rounded-full">
                {goal.icon} {goal.label}
              </span>
            ) : null;
          })}
        </div>
      </div>

      {/* Stay Details */}
      <div className="bg-blue-50 rounded-xl p-4">
        <h4 className="font-medium text-blue-800 mb-2 flex items-center gap-2">
          <Calendar className="w-4 h-4" /> Stay Details
        </h4>
        <div className="grid grid-cols-2 gap-2 text-sm">
          <div>
            <span className="text-gray-600">Check-in:</span>
            <span className="font-medium ml-1">{formData.checkInDate || '-'}</span>
          </div>
          <div>
            <span className="text-gray-600">Check-out:</span>
            <span className="font-medium ml-1">{formData.checkOutDate || 'Flexible'}</span>
          </div>
          <div>
            <span className="text-gray-600">Guests:</span>
            <span className="font-medium ml-1">{formData.guests}</span>
          </div>
          <div>
            <span className="text-gray-600">Room:</span>
            <span className="font-medium ml-1 capitalize">{formData.roomPreference}</span>
          </div>
        </div>
      </div>

      {/* Contact */}
      <div className="bg-gray-50 rounded-xl p-4">
        <h4 className="font-medium text-gray-800 mb-2 flex items-center gap-2">
          <Phone className="w-4 h-4" /> Contact
        </h4>
        <div className="text-sm space-y-1">
          <p className="font-medium">{formData.fullName}</p>
          <p className="text-gray-600">{formData.email}</p>
          <p className="text-gray-600">{formData.phone}</p>
        </div>
      </div>

      {/* Price Estimate */}
      {packagePrice > 0 && (
        <div className="bg-gradient-to-r from-amber-50 to-amber-100 rounded-xl p-4 flex justify-between items-center">
          <div>
            <p className="text-sm text-amber-800">Estimated Total</p>
            <p className="text-xs text-amber-600">Final price confirmed by our team</p>
          </div>
          <p className="text-3xl font-bold text-amber-700">${packagePrice}</p>
        </div>
      )}
    </div>

    {/* Trust Indicators */}
    <div className="flex items-center justify-center gap-4 text-sm text-gray-500 pt-4 border-t">
      <div className="flex items-center gap-1">
        <Shield className="w-4 h-4 text-green-500" />
        <span>Secure</span>
      </div>
      <div className="flex items-center gap-1">
        <Star className="w-4 h-4 text-yellow-500" />
        <span>4.9 Rated</span>
      </div>
      <div className="flex items-center gap-1">
        <Clock className="w-4 h-4 text-blue-500" />
        <span>24/7 Support</span>
      </div>
    </div>
  </div>
);

export default AyurvedaBookingModal;
