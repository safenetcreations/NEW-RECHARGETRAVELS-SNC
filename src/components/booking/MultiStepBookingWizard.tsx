import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  MapPin, Calendar, Users, Car, CreditCard, CheckCircle,
  ArrowRight, ArrowLeft, Sparkles, Clock, Shield, Star,
  Phone, Mail, User, MessageSquare
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import DriverSelection from './DriverSelection';

interface BookingFormData {
  // Step 1: Trip Details
  tripType: 'transfer' | 'tour' | 'custom';
  pickupLocation: string;
  dropoffLocation: string;
  tripDate: string;
  returnDate?: string;

  // Step 2: Travelers
  adults: number;
  children: number;
  infants: number;
  specialRequirements: string;

  // Step 3: Vehicle & Driver
  vehicleType: 'sedan' | 'suv' | 'van' | 'luxury';
  preferredDriverId?: string;

  // Step 4: Contact & Payment
  fullName: string;
  email: string;
  phone: string;
  whatsapp?: string;
  additionalNotes: string;
}

const STEPS = [
  { id: 1, title: 'Trip Details', icon: MapPin },
  { id: 2, title: 'Travelers', icon: Users },
  { id: 3, title: 'Vehicle', icon: Car },
  { id: 4, title: 'Contact', icon: Phone },
  { id: 5, title: 'Review', icon: CheckCircle },
];

const VEHICLE_OPTIONS = [
  { id: 'sedan', name: 'Sedan', capacity: '1-3', price: '$45/day', image: '🚗' },
  { id: 'suv', name: 'SUV', capacity: '1-5', price: '$65/day', image: '🚙' },
  { id: 'van', name: 'Van', capacity: '1-8', price: '$85/day', image: '🚐' },
  { id: 'luxury', name: 'Luxury', capacity: '1-4', price: '$120/day', image: '🏎️' },
];

interface MultiStepBookingWizardProps {
  onComplete?: (data: BookingFormData) => void;
  onClose?: () => void;
  initialTripType?: 'transfer' | 'tour' | 'custom';
}

const MultiStepBookingWizard: React.FC<MultiStepBookingWizardProps> = ({
  onComplete,
  onClose,
  initialTripType = 'transfer'
}) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<BookingFormData>({
    tripType: initialTripType,
    pickupLocation: '',
    dropoffLocation: '',
    tripDate: '',
    adults: 2,
    children: 0,
    infants: 0,
    specialRequirements: '',
    vehicleType: 'sedan',
    fullName: '',
    email: '',
    phone: '',
    additionalNotes: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const updateFormData = (updates: Partial<BookingFormData>) => {
    setFormData(prev => ({ ...prev, ...updates }));
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
      await new Promise(resolve => setTimeout(resolve, 1500));
      onComplete?.(formData);
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return <TripDetailsStep formData={formData} updateFormData={updateFormData} />;
      case 2:
        return <TravelersStep formData={formData} updateFormData={updateFormData} />;
      case 3:
        return <VehicleStep formData={formData} updateFormData={updateFormData} />;
      case 4:
        return <ContactStep formData={formData} updateFormData={updateFormData} />;
      case 5:
        return <ReviewStep formData={formData} />;
      default:
        return null;
    }
  };

  const isStepValid = () => {
    switch (currentStep) {
      case 1:
        return formData.pickupLocation && formData.tripDate;
      case 2:
        return formData.adults >= 1;
      case 3:
        return formData.vehicleType;
      case 4:
        return formData.fullName && formData.email && formData.phone;
      case 5:
        return true;
      default:
        return false;
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto bg-white rounded-2xl shadow-2xl overflow-hidden">
      {/* Progress Header */}
      <div className="bg-gradient-to-r from-teal-600 to-emerald-600 p-4 sm:p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-white font-bold text-lg sm:text-xl flex items-center gap-2">
            <Sparkles className="w-5 h-5" />
            Book Your Sri Lanka Journey
          </h2>
          {onClose && (
            <button onClick={onClose} className="text-white/80 hover:text-white">
              ✕
            </button>
          )}
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
                    ${isActive ? 'bg-white text-teal-600 scale-110' :
                      isCompleted ? 'bg-emerald-400 text-white' : 'bg-teal-700/50 text-white/60'}
                  `}>
                    {isCompleted ? <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5" /> : <Icon className="w-4 h-4 sm:w-5 sm:h-5" />}
                  </div>
                  <span className={`text-xs mt-1 hidden sm:block ${isActive ? 'text-white font-medium' : 'text-white/60'}`}>
                    {step.title}
                  </span>
                </div>
                {index < STEPS.length - 1 && (
                  <div className={`flex-1 h-0.5 mx-1 sm:mx-2 ${isCompleted ? 'bg-emerald-400' : 'bg-teal-700/50'}`} />
                )}
              </React.Fragment>
            );
          })}
        </div>
      </div>

      {/* Step Content */}
      <div className="p-4 sm:p-6 min-h-[300px]">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.2 }}
          >
            {renderStepContent()}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Navigation Footer */}
      <div className="border-t bg-gray-50 p-4 flex justify-between items-center">
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
            className="flex items-center gap-2 bg-teal-600 hover:bg-teal-700"
          >
            <span className="hidden sm:inline">Continue</span>
            <span className="sm:hidden">Next</span>
            <ArrowRight className="w-4 h-4" />
          </Button>
        ) : (
          <Button
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700"
          >
            {isSubmitting ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Processing...
              </>
            ) : (
              <>
                <CheckCircle className="w-4 h-4" />
                Confirm Booking
              </>
            )}
          </Button>
        )}
      </div>
    </div>
  );
};

// Step 1: Trip Details
const TripDetailsStep: React.FC<{
  formData: BookingFormData;
  updateFormData: (data: Partial<BookingFormData>) => void;
}> = ({ formData, updateFormData }) => (
  <div className="space-y-4">
    <h3 className="text-lg font-semibold text-gray-800 mb-4">Where would you like to go?</h3>

    {/* Trip Type */}
    <div className="grid grid-cols-3 gap-2 sm:gap-3">
      {[
        { id: 'transfer', label: 'Transfer', icon: '🚗' },
        { id: 'tour', label: 'Tour', icon: '🗺️' },
        { id: 'custom', label: 'Custom', icon: '✨' },
      ].map((type) => (
        <button
          key={type.id}
          onClick={() => updateFormData({ tripType: type.id as BookingFormData['tripType'] })}
          className={`p-3 sm:p-4 rounded-xl border-2 transition-all text-center ${
            formData.tripType === type.id
              ? 'border-teal-500 bg-teal-50 text-teal-700'
              : 'border-gray-200 hover:border-teal-300'
          }`}
        >
          <span className="text-2xl block mb-1">{type.icon}</span>
          <span className="text-sm font-medium">{type.label}</span>
        </button>
      ))}
    </div>

    {/* Locations */}
    <div className="space-y-3">
      <div>
        <label className="text-sm font-medium text-gray-700 mb-1 block">Pickup Location *</label>
        <div className="relative">
          <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <Input
            value={formData.pickupLocation}
            onChange={(e) => updateFormData({ pickupLocation: e.target.value })}
            placeholder="e.g., Colombo Airport (CMB)"
            className="pl-10"
          />
        </div>
      </div>

      <div>
        <label className="text-sm font-medium text-gray-700 mb-1 block">
          {formData.tripType === 'transfer' ? 'Dropoff Location' : 'Destination'}
        </label>
        <div className="relative">
          <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-teal-500" />
          <Input
            value={formData.dropoffLocation}
            onChange={(e) => updateFormData({ dropoffLocation: e.target.value })}
            placeholder="e.g., Sigiriya, Kandy, Galle"
            className="pl-10"
          />
        </div>
      </div>
    </div>

    {/* Dates */}
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
      <div>
        <label className="text-sm font-medium text-gray-700 mb-1 block">Trip Date *</label>
        <div className="relative">
          <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <Input
            type="date"
            value={formData.tripDate}
            onChange={(e) => updateFormData({ tripDate: e.target.value })}
            className="pl-10"
            min={new Date().toISOString().split('T')[0]}
          />
        </div>
      </div>

      {formData.tripType !== 'transfer' && (
        <div>
          <label className="text-sm font-medium text-gray-700 mb-1 block">Return Date</label>
          <div className="relative">
            <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <Input
              type="date"
              value={formData.returnDate || ''}
              onChange={(e) => updateFormData({ returnDate: e.target.value })}
              className="pl-10"
              min={formData.tripDate || new Date().toISOString().split('T')[0]}
            />
          </div>
        </div>
      )}
    </div>
  </div>
);

// Step 2: Travelers
const TravelersStep: React.FC<{
  formData: BookingFormData;
  updateFormData: (data: Partial<BookingFormData>) => void;
}> = ({ formData, updateFormData }) => (
  <div className="space-y-4">
    <h3 className="text-lg font-semibold text-gray-800 mb-4">Who's traveling?</h3>

    <div className="grid grid-cols-3 gap-3">
      {/* Adults */}
      <div className="bg-gray-50 rounded-xl p-4 text-center">
        <span className="text-2xl block mb-2">👨‍👩</span>
        <span className="text-sm text-gray-600 block mb-2">Adults (12+)</span>
        <div className="flex items-center justify-center gap-2">
          <button
            onClick={() => updateFormData({ adults: Math.max(1, formData.adults - 1) })}
            className="w-8 h-8 rounded-lg bg-teal-100 hover:bg-teal-200 text-teal-700 font-bold"
          >
            -
          </button>
          <span className="w-8 text-center font-bold text-lg">{formData.adults}</span>
          <button
            onClick={() => updateFormData({ adults: formData.adults + 1 })}
            className="w-8 h-8 rounded-lg bg-teal-100 hover:bg-teal-200 text-teal-700 font-bold"
          >
            +
          </button>
        </div>
      </div>

      {/* Children */}
      <div className="bg-gray-50 rounded-xl p-4 text-center">
        <span className="text-2xl block mb-2">👧</span>
        <span className="text-sm text-gray-600 block mb-2">Children (2-11)</span>
        <div className="flex items-center justify-center gap-2">
          <button
            onClick={() => updateFormData({ children: Math.max(0, formData.children - 1) })}
            className="w-8 h-8 rounded-lg bg-purple-100 hover:bg-purple-200 text-purple-700 font-bold"
          >
            -
          </button>
          <span className="w-8 text-center font-bold text-lg">{formData.children}</span>
          <button
            onClick={() => updateFormData({ children: formData.children + 1 })}
            className="w-8 h-8 rounded-lg bg-purple-100 hover:bg-purple-200 text-purple-700 font-bold"
          >
            +
          </button>
        </div>
      </div>

      {/* Infants */}
      <div className="bg-gray-50 rounded-xl p-4 text-center">
        <span className="text-2xl block mb-2">👶</span>
        <span className="text-sm text-gray-600 block mb-2">Infants (0-2)</span>
        <div className="flex items-center justify-center gap-2">
          <button
            onClick={() => updateFormData({ infants: Math.max(0, formData.infants - 1) })}
            className="w-8 h-8 rounded-lg bg-pink-100 hover:bg-pink-200 text-pink-700 font-bold"
          >
            -
          </button>
          <span className="w-8 text-center font-bold text-lg">{formData.infants}</span>
          <button
            onClick={() => updateFormData({ infants: formData.infants + 1 })}
            className="w-8 h-8 rounded-lg bg-pink-100 hover:bg-pink-200 text-pink-700 font-bold"
          >
            +
          </button>
        </div>
      </div>
    </div>

    {/* Special Requirements */}
    <div>
      <label className="text-sm font-medium text-gray-700 mb-1 block">Special Requirements</label>
      <Textarea
        value={formData.specialRequirements}
        onChange={(e) => updateFormData({ specialRequirements: e.target.value })}
        placeholder="Child seats, wheelchair access, dietary requirements..."
        rows={3}
      />
    </div>
  </div>
);

// Step 3: Vehicle & Driver
const VehicleStep: React.FC<{
  formData: BookingFormData;
  updateFormData: (data: Partial<BookingFormData>) => void;
}> = ({ formData, updateFormData }) => (
  <div className="space-y-4">
    <h3 className="text-lg font-semibold text-gray-800 mb-4">Choose your vehicle</h3>

    <div className="grid grid-cols-2 gap-3">
      {VEHICLE_OPTIONS.map((vehicle) => (
        <button
          key={vehicle.id}
          onClick={() => updateFormData({ vehicleType: vehicle.id as BookingFormData['vehicleType'] })}
          className={`p-4 rounded-xl border-2 transition-all text-left ${
            formData.vehicleType === vehicle.id
              ? 'border-teal-500 bg-teal-50'
              : 'border-gray-200 hover:border-teal-300'
          }`}
        >
          <span className="text-3xl block mb-2">{vehicle.image}</span>
          <span className="font-semibold block">{vehicle.name}</span>
          <span className="text-sm text-gray-500">{vehicle.capacity} passengers</span>
          <span className="text-sm font-medium text-teal-600 block mt-1">{vehicle.price}</span>
        </button>
      ))}
    </div>

    {/* Driver Selection */}
    <div className="mt-6">
      <DriverSelection
        selectedDriverId={formData.preferredDriverId || ''}
        onSelect={(driverId) => updateFormData({ preferredDriverId: driverId })}
        tripDate={formData.tripDate}
      />
    </div>
  </div>
);

// Step 4: Contact
const ContactStep: React.FC<{
  formData: BookingFormData;
  updateFormData: (data: Partial<BookingFormData>) => void;
}> = ({ formData, updateFormData }) => (
  <div className="space-y-4">
    <h3 className="text-lg font-semibold text-gray-800 mb-4">Your contact details</h3>

    <div className="space-y-3">
      <div>
        <label className="text-sm font-medium text-gray-700 mb-1 block">Full Name *</label>
        <div className="relative">
          <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <Input
            value={formData.fullName}
            onChange={(e) => updateFormData({ fullName: e.target.value })}
            placeholder="John Smith"
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
            placeholder="john@example.com"
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
              value={formData.whatsapp || ''}
              onChange={(e) => updateFormData({ whatsapp: e.target.value })}
              placeholder="Same as phone"
              className="pl-10"
            />
          </div>
        </div>
      </div>

      <div>
        <label className="text-sm font-medium text-gray-700 mb-1 block">Additional Notes</label>
        <Textarea
          value={formData.additionalNotes}
          onChange={(e) => updateFormData({ additionalNotes: e.target.value })}
          placeholder="Any special requests or questions..."
          rows={3}
        />
      </div>
    </div>
  </div>
);

// Step 5: Review
const ReviewStep: React.FC<{ formData: BookingFormData }> = ({ formData }) => (
  <div className="space-y-4">
    <h3 className="text-lg font-semibold text-gray-800 mb-4">Review your booking</h3>

    <div className="space-y-4">
      {/* Trip Summary */}
      <div className="bg-teal-50 rounded-xl p-4">
        <h4 className="font-medium text-teal-800 mb-3 flex items-center gap-2">
          <MapPin className="w-4 h-4" /> Trip Details
        </h4>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-gray-600">Type:</span>
            <span className="font-medium capitalize">{formData.tripType}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">From:</span>
            <span className="font-medium">{formData.pickupLocation || '-'}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">To:</span>
            <span className="font-medium">{formData.dropoffLocation || '-'}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Date:</span>
            <span className="font-medium">{formData.tripDate || '-'}</span>
          </div>
        </div>
      </div>

      {/* Travelers */}
      <div className="bg-purple-50 rounded-xl p-4">
        <h4 className="font-medium text-purple-800 mb-3 flex items-center gap-2">
          <Users className="w-4 h-4" /> Travelers
        </h4>
        <div className="flex gap-4 text-sm">
          <span>{formData.adults} Adult{formData.adults > 1 ? 's' : ''}</span>
          {formData.children > 0 && <span>{formData.children} Child{formData.children > 1 ? 'ren' : ''}</span>}
          {formData.infants > 0 && <span>{formData.infants} Infant{formData.infants > 1 ? 's' : ''}</span>}
        </div>
      </div>

      {/* Vehicle */}
      <div className="bg-blue-50 rounded-xl p-4">
        <h4 className="font-medium text-blue-800 mb-3 flex items-center gap-2">
          <Car className="w-4 h-4" /> Vehicle
        </h4>
        <div className="text-sm">
          <span className="font-medium capitalize">{formData.vehicleType}</span>
          {formData.preferredDriverId && <span className="text-gray-600 ml-2">(Preferred driver selected)</span>}
        </div>
      </div>

      {/* Contact */}
      <div className="bg-gray-50 rounded-xl p-4">
        <h4 className="font-medium text-gray-800 mb-3 flex items-center gap-2">
          <Phone className="w-4 h-4" /> Contact
        </h4>
        <div className="space-y-1 text-sm">
          <div>{formData.fullName}</div>
          <div className="text-gray-600">{formData.email}</div>
          <div className="text-gray-600">{formData.phone}</div>
        </div>
      </div>
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

export default MultiStepBookingWizard;
