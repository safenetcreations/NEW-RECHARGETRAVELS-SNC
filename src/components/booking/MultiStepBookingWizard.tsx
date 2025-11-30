import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  MapPin, Calendar, Users, Car, CreditCard, CheckCircle,
  ArrowRight, ArrowLeft, Sparkles, Clock, Shield, Star,
  Phone, Mail, User, MessageSquare, Wallet, Info
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useAuth } from '@/hooks/useAuth';
import { dbService } from '@/lib/firebase-services';
import { walletService } from '@/services/walletService';
import { toast } from 'sonner';

const DriverSelection = React.lazy(() => import('./DriverSelection'));
const PaymentStep = React.lazy(() => import('./PaymentStep').then(module => ({ default: module.PaymentStep })));

interface BookingFormData {
  // Step 1: Trip Details
  tripType: 'transfer' | 'tour' | 'custom' | 'experience';
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

  // Step 4: Contact
  fullName: string;
  email: string;
  phone: string;
  whatsapp?: string;
  additionalNotes: string;

  // Step 5: Payment
  paymentMethod?: 'wallet' | 'card';
}

const STEPS = [
  { id: 1, title: 'Trip Details', icon: MapPin },
  { id: 2, title: 'Travelers', icon: Users },
  { id: 3, title: 'Vehicle', icon: Car },
  { id: 4, title: 'Contact', icon: Phone },
  { id: 5, title: 'Payment', icon: CreditCard },
  { id: 6, title: 'Review', icon: CheckCircle },
];

const EXPERIENCE_STEPS = [
  { id: 1, title: 'Details', icon: Calendar }, // Combined Date & Travelers
  { id: 4, title: 'Contact', icon: Phone },
  { id: 5, title: 'Payment', icon: CreditCard },
];

const VEHICLE_OPTIONS = [
  { id: 'sedan', name: 'Sedan', capacity: '1-3', price: '$45/day', image: '🚗' },
  { id: 'suv', name: 'SUV', capacity: '1-5', price: '$65/day', image: '🚙' },
  { id: 'van', name: 'Van', capacity: '1-8', price: '$85/day', image: '🚐' },
  { id: 'luxury', name: 'Luxury', capacity: '1-4', price: '$120/day', image: '🏎️' },
];

// Step 1: Experience Details (Combined Date & Travelers)
const ExperienceDetailsStep: React.FC<{
  formData: BookingFormData;
  updateFormData: (data: Partial<BookingFormData>) => void;
}> = ({ formData, updateFormData }) => (
  <div className="space-y-8">
    <div className="mb-6">
      <h3 className="text-2xl font-bold text-gray-800 font-serif">Booking Details</h3>
      <p className="text-gray-500">Select your date and number of guests</p>
    </div>

    <div className="space-y-6">
      {/* Date Selection */}
      <div>
        <label className="text-sm font-semibold text-gray-700 mb-1.5 block">Select Date</label>
        <div className="relative group">
          <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-emerald-500 transition-colors" />
          <Input
            type="date"
            value={formData.tripDate}
            onChange={(e) => updateFormData({ tripDate: e.target.value })}
            className="pl-10 h-12 bg-gray-50 border-gray-200 focus:bg-white focus:border-emerald-500 transition-all"
            min={new Date().toISOString().split('T')[0]}
          />
        </div>
      </div>

      {/* Travelers Selection */}
      <div>
        <label className="text-sm font-semibold text-gray-700 mb-3 block">Number of Guests</label>
        <div className="grid grid-cols-1 gap-4">
          {[
            { label: 'Adults', sub: '12+ years', key: 'adults', icon: '👨‍👩' },
            { label: 'Children', sub: '2-11 years', key: 'children', icon: '👧' },
          ].map((item) => (
            <div key={item.key} className="bg-white border border-gray-100 rounded-xl p-4 flex items-center justify-between shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center gap-4">
                <span className="text-2xl bg-gray-50 p-2 rounded-lg">{item.icon}</span>
                <div>
                  <span className="text-lg font-bold text-gray-800 block">{item.label}</span>
                  <span className="text-xs text-gray-400 block">{item.sub}</span>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={() => updateFormData({ [item.key]: Math.max(item.key === 'adults' ? 1 : 0, formData[item.key as keyof BookingFormData] as number - 1) })}
                  className="w-10 h-10 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-600 font-bold flex items-center justify-center transition-colors"
                >
                  -
                </button>
                <span className="w-8 text-center font-bold text-xl text-emerald-600">
                  {formData[item.key as keyof BookingFormData] as number}
                </span>
                <button
                  onClick={() => updateFormData({ [item.key]: (formData[item.key as keyof BookingFormData] as number) + 1 })}
                  className="w-10 h-10 rounded-full bg-emerald-50 hover:bg-emerald-100 text-emerald-600 font-bold flex items-center justify-center transition-colors"
                >
                  +
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  </div>
);

interface MultiStepBookingWizardProps {
  onComplete?: (data: BookingFormData) => void;
  onClose?: () => void;
  initialTripType?: 'transfer' | 'tour' | 'custom' | 'experience';
  tourData?: {
    id: string;
    name: string;
    price: number;
    description?: string;
    duration?: string;
    image?: string;
  };
}

const MultiStepBookingWizard: React.FC<MultiStepBookingWizardProps> = ({
  onComplete,
  onClose,
  initialTripType = 'transfer',
  tourData
}) => {
  const { user } = useAuth();
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
    fullName: user?.displayName || '',
    email: user?.email || '',
    phone: '',
    additionalNotes: '',
    paymentMethod: undefined
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Filter steps based on trip type
  const activeSteps = React.useMemo(() => {
    if (initialTripType === 'experience') {
      return EXPERIENCE_STEPS;
    }
    return STEPS.filter(step => {
      // Skip vehicle for tours
      if (initialTripType === 'tour' && step.id === 3) return false;
      return true;
    });
  }, [initialTripType]);

  const updateFormData = (updates: Partial<BookingFormData>) => {
    setFormData(prev => ({ ...prev, ...updates }));
  };

  const nextStep = () => {
    const currentIndex = activeSteps.findIndex(s => s.id === currentStep);
    if (currentIndex < activeSteps.length - 1) {
      setCurrentStep(activeSteps[currentIndex + 1].id);
    }
  };

  const prevStep = () => {
    const currentIndex = activeSteps.findIndex(s => s.id === currentStep);
    if (currentIndex > 0) {
      setCurrentStep(activeSteps[currentIndex - 1].id);
    }
  };

  const handleSubmit = async () => {
    if (!user) {
      toast.error("You must be logged in to make a booking.");
      return;
    }

    setIsSubmitting(true);
    try {
      const totalPrice = tourData?.price || 0; // Calculate based on vehicle if transfer

      const bookingData = {
        user_id: user.uid,
        user_email: formData.email,
        user_name: formData.fullName,
        booking_type: initialTripType,
        items: {
          ...formData,
          tourData
        },
        total_price: totalPrice,
        currency: 'USD',
        status: 'pending' as const,
        travel_date: formData.tripDate,
        created_at: new Date().toISOString()
      };

      const booking = await dbService.create('bookings', bookingData);
      if (!booking) throw new Error('Failed to create booking');

      // Process Wallet Payment
      if (formData.paymentMethod === 'wallet') {
        const userWallet = await walletService.getUserWallet(user.uid);
        if (!userWallet) throw new Error('Wallet not found');

        const amountInLKR = totalPrice * 300; // Exchange rate
        const hasBalance = await walletService.checkBalance(userWallet.id, amountInLKR);

        if (!hasBalance) throw new Error('Insufficient wallet balance');

        const paymentSuccess = await walletService.createBookingPayment(
          userWallet.id,
          booking.id,
          amountInLKR
        );

        if (!paymentSuccess) throw new Error('Payment failed');

        await dbService.update('bookings', booking.id, {
          status: 'confirmed',
          payment_method: 'wallet',
          updated_at: new Date().toISOString()
        });

        toast.success('Booking confirmed! Payment deducted from wallet.');
      } else {
        toast.success('Booking request sent successfully!');
      }

      onComplete?.(formData);
      onClose?.();
    } catch (error: any) {
      console.error('Booking error:', error);
      toast.error(error.message || 'Failed to process booking');
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderStepContent = () => {
    // Special handling for merged experience step
    if (initialTripType === 'experience' && currentStep === 1) {
      return <ExperienceDetailsStep formData={formData} updateFormData={updateFormData} />;
    }

    switch (currentStep) {
      case 1:
        return <TripDetailsStep formData={formData} updateFormData={updateFormData} showTripType={!tourData} />;
      case 2:
        return <TravelersStep formData={formData} updateFormData={updateFormData} />;
      case 3:
        return <VehicleStep formData={formData} updateFormData={updateFormData} />;
      case 4:
        return <ContactStep formData={formData} updateFormData={updateFormData} />;
      case 5:
        return (
          <React.Suspense fallback={<div className="p-8 text-center text-gray-400">Loading payment...</div>}>
            <PaymentStep
              totalAmount={tourData?.price || 100} // Placeholder for transfer price
              currency="USD"
              onPaymentMethodSelect={(method) => updateFormData({ paymentMethod: method })}
              selectedPaymentMethod={formData.paymentMethod}
            />
          </React.Suspense>
        );
      case 6:
        return <ReviewStep formData={formData} tourData={tourData} />;
      default:
        return null;
    }
  };

  const isStepValid = () => {
    switch (currentStep) {
      case 1:
        // For experience, date is required.
        if (initialTripType === 'experience') {
          return !!formData.tripDate && formData.adults >= 1;
        }
        return formData.pickupLocation && formData.tripDate;
      case 2:
        return formData.adults >= 1;
      case 3:
        return formData.vehicleType;
      case 4:
        return formData.fullName && formData.email && formData.phone;
      case 5:
        return formData.paymentMethod;
      case 6:
        return true;
      default:
        return false;
    }
  };

  return (
    <div className="w-full max-w-6xl mx-auto bg-slate-50 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[95vh]">
      {/* Header */}
      <div className="bg-white border-b px-6 py-4 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-2">
          <div className="bg-emerald-100 p-2 rounded-lg">
            <Sparkles className="w-5 h-5 text-emerald-700" />
          </div>
          <div>
            <h2 className="font-bold text-gray-800 text-lg">
              {tourData ? `Book: ${tourData.name}` : 'Book Your Journey'}
            </h2>
            <div className="flex items-center gap-2 text-xs text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full w-fit">
              <Shield className="w-3 h-3" />
              Secure Booking
            </div>
          </div>
        </div>
        {onClose && (
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
            ✕
          </button>
        )}
      </div>

      <div className="flex-1 overflow-hidden flex flex-col lg:flex-row">
        {/* Left Column: Form Steps */}
        <div className="flex-1 flex flex-col overflow-hidden border-r border-gray-200 bg-white">
          {/* Progress Bar */}
          <div className="px-8 pt-8 pb-4">
            <div className="flex items-center justify-between relative">
              <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-0.5 bg-gray-100 -z-0" />
              {activeSteps.map((step, index) => {
                const isActive = currentStep === step.id;
                const isCompleted = activeSteps.findIndex(s => s.id === currentStep) > index;

                return (
                  <div key={step.id} className="relative z-10 flex flex-col items-center group bg-white px-2">
                    <div className={`
                      w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300 border-2
                      ${isActive ? 'bg-emerald-600 text-white border-emerald-600 shadow-lg scale-110' :
                        isCompleted ? 'bg-emerald-100 text-emerald-700 border-emerald-600' : 'bg-white text-gray-300 border-gray-200'}
                    `}>
                      {isCompleted ? <CheckCircle className="w-4 h-4" /> : <span className="text-xs font-bold">{index + 1}</span>}
                    </div>
                    <span className={`text-[10px] mt-2 font-medium uppercase tracking-wider ${isActive ? 'text-emerald-700' : 'text-gray-400'
                      }`}>
                      {step.title}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Step Content */}
          <div className="flex-1 overflow-y-auto p-8">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentStep}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                className="max-w-xl mx-auto"
              >
                {renderStepContent()}
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Navigation Footer */}
          <div className="p-6 border-t bg-gray-50 flex justify-between items-center">
            <Button
              variant="ghost"
              onClick={prevStep}
              disabled={currentStep === activeSteps[0].id}
              className="flex items-center gap-2 hover:bg-white hover:shadow-sm"
            >
              <ArrowLeft className="w-4 h-4" />
              Back
            </Button>

            {activeSteps.findIndex(s => s.id === currentStep) < activeSteps.length - 1 ? (
              <Button
                onClick={nextStep}
                disabled={!isStepValid()}
                className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-8 shadow-lg shadow-emerald-200"
              >
                Continue
                <ArrowRight className="w-4 h-4" />
              </Button>
            ) : (
              <Button
                onClick={handleSubmit}
                disabled={isSubmitting || !isStepValid()}
                className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-8 shadow-lg shadow-emerald-200"
              >
                {isSubmitting ? 'Processing...' : 'Confirm Booking'}
              </Button>
            )}
          </div>
        </div>

        {/* Right Column: Summary */}
        <div className="w-full lg:w-[380px] bg-slate-50 overflow-y-auto p-6 border-l border-gray-200 hidden lg:block">
          <div className="sticky top-0 space-y-6">
            <BookingSummary formData={formData} tourData={tourData} />

            {/* Trust Badges */}
            <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 space-y-3">
              <div className="flex items-center gap-3 text-sm text-gray-600">
                <Shield className="w-4 h-4 text-emerald-600" />
                <span>Secure Payment</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-gray-600">
                <Star className="w-4 h-4 text-yellow-500" />
                <span>Best Price Guarantee</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-gray-600">
                <Clock className="w-4 h-4 text-blue-500" />
                <span>24/7 Support</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Summary Component
const BookingSummary: React.FC<{ formData: BookingFormData; tourData?: any }> = ({ formData, tourData }) => {
  const totalPrice = tourData?.price || 0;

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
      {/* Header Image */}
      <div className="h-40 bg-gray-200 relative">
        {tourData?.image ? (
          <img src={tourData.image} alt={tourData.name} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-emerald-50 text-emerald-200">
            <Sparkles className="w-12 h-12" />
          </div>
        )}
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4">
          <div className="flex items-center gap-1 text-white text-sm font-medium">
            <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
            <span>5.0</span>
            <span className="opacity-80">(120 reviews)</span>
          </div>
        </div>
      </div>

      <div className="p-5 space-y-6">
        <div>
          <h3 className="font-bold text-gray-900 text-lg leading-tight mb-1">
            {tourData?.name || 'Custom Journey'}
          </h3>
          <p className="text-sm text-gray-500">by Recharge Travels</p>
        </div>

        <div className="space-y-3 pt-4 border-t border-gray-100">
          <div className="flex justify-between text-sm">
            <span className="text-gray-500 flex items-center gap-2">
              <Calendar className="w-4 h-4" /> Date
            </span>
            <span className="font-medium text-gray-900">{formData.tripDate || 'Select date'}</span>
          </div>

          <div className="flex justify-between text-sm">
            <span className="text-gray-500 flex items-center gap-2">
              <Users className="w-4 h-4" /> Guests
            </span>
            <span className="font-medium text-gray-900">
              {formData.adults} Adults, {formData.children} Kids
            </span>
          </div>

          {formData.tripType !== 'experience' && (
            <div className="flex justify-between text-sm">
              <span className="text-gray-500 flex items-center gap-2">
                <MapPin className="w-4 h-4" /> Pickup
              </span>
              <span className="font-medium text-gray-900 truncate max-w-[150px]">
                {formData.pickupLocation || 'Select location'}
              </span>
            </div>
          )}
        </div>

        <div className="pt-4 border-t border-gray-100">
          <div className="flex justify-between items-end">
            <div>
              <p className="text-xs text-gray-500 mb-1">Total Price</p>
              <p className="text-2xl font-bold text-emerald-700">${totalPrice}</p>
            </div>
            <div className="text-xs text-gray-400">
              Includes taxes & fees
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Step 1: Trip Details
const TripDetailsStep: React.FC<{
  formData: BookingFormData;
  updateFormData: (data: Partial<BookingFormData>) => void;
  showTripType?: boolean;
}> = ({ formData, updateFormData, showTripType = true }) => (
  <div className="space-y-6">
    <div className="mb-6">
      <h3 className="text-2xl font-bold text-gray-800 font-serif">Trip Details</h3>
      <p className="text-gray-500">Tell us about your journey</p>
    </div>

    {showTripType && (
      <div className="grid grid-cols-3 gap-3">
        {[
          { id: 'transfer', label: 'Transfer', icon: '🚗' },
          { id: 'tour', label: 'Tour', icon: '🗺️' },
          { id: 'custom', label: 'Custom', icon: '✨' },
        ].map((type) => (
          <button
            key={type.id}
            onClick={() => updateFormData({ tripType: type.id as BookingFormData['tripType'] })}
            className={`p-4 rounded-xl border-2 transition-all text-center ${formData.tripType === type.id
              ? 'border-emerald-500 bg-emerald-50 text-emerald-700 shadow-sm'
              : 'border-gray-100 hover:border-emerald-200 hover:bg-gray-50'
              }`}
          >
            <span className="text-2xl block mb-2">{type.icon}</span>
            <span className="text-sm font-semibold">{type.label}</span>
          </button>
        ))}
      </div>
    )}

    <div className="grid grid-cols-1 gap-6">
      {/* Hide Location Inputs for 'experience' type */}
      {formData.tripType !== 'experience' && (
        <div className="space-y-4">
          <div>
            <label className="text-sm font-semibold text-gray-700 mb-1.5 block">Pickup Location</label>
            <div className="relative group">
              <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-emerald-500 transition-colors" />
              <Input
                value={formData.pickupLocation}
                onChange={(e) => updateFormData({ pickupLocation: e.target.value })}
                placeholder="e.g., Colombo Airport (CMB)"
                className="pl-10 h-12 bg-gray-50 border-gray-200 focus:bg-white focus:border-emerald-500 transition-all"
              />
            </div>
          </div>

          <div>
            <label className="text-sm font-semibold text-gray-700 mb-1.5 block">
              {formData.tripType === 'transfer' ? 'Dropoff Location' : 'Destination'}
            </label>
            <div className="relative group">
              <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-emerald-500" />
              <Input
                value={formData.dropoffLocation}
                onChange={(e) => updateFormData({ dropoffLocation: e.target.value })}
                placeholder="e.g., Sigiriya, Kandy"
                className="pl-10 h-12 bg-gray-50 border-gray-200 focus:bg-white focus:border-emerald-500 transition-all"
              />
            </div>
          </div>
        </div>
      )}

      <div>
        <label className="text-sm font-semibold text-gray-700 mb-1.5 block">Trip Date</label>
        <div className="relative group">
          <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-emerald-500 transition-colors" />
          <Input
            type="date"
            value={formData.tripDate}
            onChange={(e) => updateFormData({ tripDate: e.target.value })}
            className="pl-10 h-12 bg-gray-50 border-gray-200 focus:bg-white focus:border-emerald-500 transition-all"
            min={new Date().toISOString().split('T')[0]}
          />
        </div>
      </div>

      {formData.tripType !== 'transfer' && formData.tripType !== 'experience' && (
        <div>
          <label className="text-sm font-semibold text-gray-700 mb-1.5 block">Return Date</label>
          <div className="relative group">
            <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-emerald-500 transition-colors" />
            <Input
              type="date"
              value={formData.returnDate || ''}
              onChange={(e) => updateFormData({ returnDate: e.target.value })}
              className="pl-10 h-12 bg-gray-50 border-gray-200 focus:bg-white focus:border-emerald-500 transition-all"
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
  <div className="space-y-8">
    <div className="mb-6">
      <h3 className="text-2xl font-bold text-gray-800 font-serif">Who's traveling?</h3>
      <p className="text-gray-500">Select the number of guests</p>
    </div>

    <div className="grid grid-cols-1 gap-4">
      {[
        { label: 'Adults', sub: '12+ years', key: 'adults', icon: '👨‍👩' },
        { label: 'Children', sub: '2-11 years', key: 'children', icon: '👧' },
        { label: 'Infants', sub: '0-2 years', key: 'infants', icon: '👶' },
      ].map((item) => (
        <div key={item.key} className="bg-white border border-gray-100 rounded-xl p-4 flex items-center justify-between shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center gap-4">
            <span className="text-2xl bg-gray-50 p-2 rounded-lg">{item.icon}</span>
            <div>
              <span className="text-lg font-bold text-gray-800 block">{item.label}</span>
              <span className="text-xs text-gray-400 block">{item.sub}</span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => updateFormData({ [item.key]: Math.max(item.key === 'adults' ? 1 : 0, formData[item.key as keyof BookingFormData] as number - 1) })}
              className="w-10 h-10 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-600 font-bold flex items-center justify-center transition-colors"
            >
              -
            </button>
            <span className="w-8 text-center font-bold text-xl text-emerald-600">
              {formData[item.key as keyof BookingFormData] as number}
            </span>
            <button
              onClick={() => updateFormData({ [item.key]: (formData[item.key as keyof BookingFormData] as number) + 1 })}
              className="w-10 h-10 rounded-full bg-emerald-50 hover:bg-emerald-100 text-emerald-600 font-bold flex items-center justify-center transition-colors"
            >
              +
            </button>
          </div>
        </div>
      ))}
    </div>

    <div>
      <label className="text-sm font-semibold text-gray-700 mb-2 block">Special Requirements</label>
      <Textarea
        value={formData.specialRequirements}
        onChange={(e) => updateFormData({ specialRequirements: e.target.value })}
        placeholder="Child seats, wheelchair access, dietary requirements..."
        rows={4}
        className="bg-gray-50 border-gray-200 focus:bg-white focus:border-emerald-500 transition-all resize-none"
      />
    </div>
  </div>
);

// Step 3: Vehicle
const VehicleStep: React.FC<{
  formData: BookingFormData;
  updateFormData: (data: Partial<BookingFormData>) => void;
}> = ({ formData, updateFormData }) => (
  <div className="space-y-6">
    <div className="mb-6">
      <h3 className="text-2xl font-bold text-gray-800 font-serif">Choose your ride</h3>
      <p className="text-gray-500">Select a vehicle that suits your needs</p>
    </div>

    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      {VEHICLE_OPTIONS.map((vehicle) => (
        <button
          key={vehicle.id}
          onClick={() => updateFormData({ vehicleType: vehicle.id as BookingFormData['vehicleType'] })}
          className={`relative p-4 rounded-2xl border-2 transition-all text-left group overflow-hidden ${formData.vehicleType === vehicle.id
            ? 'border-emerald-500 bg-emerald-50/50 shadow-md'
            : 'border-gray-100 hover:border-emerald-200 hover:bg-gray-50'
            }`}
        >
          <div className="flex items-start justify-between mb-2">
            <span className="text-4xl">{vehicle.image}</span>
            {formData.vehicleType === vehicle.id && (
              <CheckCircle className="w-6 h-6 text-emerald-500" />
            )}
          </div>
          <span className="font-bold text-lg text-gray-800 block">{vehicle.name}</span>
          <div className="flex items-center gap-2 text-sm text-gray-500 mt-1">
            <Users className="w-4 h-4" />
            <span>{vehicle.capacity} passengers</span>
          </div>
          <div className="mt-3 pt-3 border-t border-gray-200/50 flex justify-between items-center">
            <span className="text-xs text-gray-400">Starting from</span>
            <span className="font-bold text-emerald-600">{vehicle.price}</span>
          </div>
        </button>
      ))}
    </div>

    <div className="mt-8 pt-8 border-t border-gray-100">
      <h4 className="font-semibold text-gray-800 mb-4">Preferred Driver (Optional)</h4>
      <React.Suspense fallback={<div className="h-20 bg-gray-50 rounded-lg animate-pulse" />}>
        <DriverSelection
          selectedDriverId={formData.preferredDriverId || ''}
          onSelect={(driverId) => updateFormData({ preferredDriverId: driverId })}
          tripDate={formData.tripDate}
        />
      </React.Suspense>
    </div>
  </div>
);

// Step 4: Contact
const ContactStep: React.FC<{
  formData: BookingFormData;
  updateFormData: (data: Partial<BookingFormData>) => void;
}> = ({ formData, updateFormData }) => (
  <div className="space-y-6">
    <div className="mb-6">
      <h3 className="text-2xl font-bold text-gray-800 font-serif">Contact Details</h3>
      <p className="text-gray-500">Where should we send your confirmation?</p>
    </div>

    <div className="space-y-4">
      <div>
        <label className="text-sm font-semibold text-gray-700 mb-1.5 block">Full Name</label>
        <div className="relative group">
          <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-emerald-500 transition-colors" />
          <Input
            value={formData.fullName}
            onChange={(e) => updateFormData({ fullName: e.target.value })}
            placeholder="John Smith"
            className="pl-10 h-12 bg-gray-50 border-gray-200 focus:bg-white focus:border-emerald-500 transition-all"
          />
        </div>
      </div>

      <div>
        <label className="text-sm font-semibold text-gray-700 mb-1.5 block">Email Address</label>
        <div className="relative group">
          <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-emerald-500 transition-colors" />
          <Input
            type="email"
            value={formData.email}
            onChange={(e) => updateFormData({ email: e.target.value })}
            placeholder="john@example.com"
            className="pl-10 h-12 bg-gray-50 border-gray-200 focus:bg-white focus:border-emerald-500 transition-all"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="text-sm font-semibold text-gray-700 mb-1.5 block">Phone Number</label>
          <div className="relative group">
            <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-emerald-500 transition-colors" />
            <Input
              type="tel"
              value={formData.phone}
              onChange={(e) => updateFormData({ phone: e.target.value })}
              placeholder="+1 234..."
              className="pl-10 h-12 bg-gray-50 border-gray-200 focus:bg-white focus:border-emerald-500 transition-all"
            />
          </div>
        </div>

        <div>
          <label className="text-sm font-semibold text-gray-700 mb-1.5 block">WhatsApp</label>
          <div className="relative group">
            <MessageSquare className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-emerald-500 transition-colors" />
            <Input
              type="tel"
              value={formData.whatsapp || ''}
              onChange={(e) => updateFormData({ whatsapp: e.target.value })}
              placeholder="Optional"
              className="pl-10 h-12 bg-gray-50 border-gray-200 focus:bg-white focus:border-emerald-500 transition-all"
            />
          </div>
        </div>
      </div>

      <div>
        <label className="text-sm font-semibold text-gray-700 mb-1.5 block">Additional Notes</label>
        <Textarea
          value={formData.additionalNotes}
          onChange={(e) => updateFormData({ additionalNotes: e.target.value })}
          placeholder="Any special requests..."
          rows={3}
          className="bg-gray-50 border-gray-200 focus:bg-white focus:border-emerald-500 transition-all"
        />
      </div>
    </div>
  </div>
);

// Step 6: Review
const ReviewStep: React.FC<{ formData: BookingFormData; tourData?: any }> = ({ formData, tourData }) => (
  <div className="space-y-6">
    <div className="mb-6">
      <h3 className="text-2xl font-bold text-gray-800 font-serif">Review Booking</h3>
      <p className="text-gray-500">Please verify your details before confirming</p>
    </div>

    <div className="space-y-6">
      {/* Trip Summary */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <h4 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
          <MapPin className="w-5 h-5 text-emerald-600" />
          Trip Details
        </h4>
        <div className="space-y-3 text-sm">
          {tourData && (
            <div className="flex justify-between py-2 border-b border-gray-50">
              <span className="text-gray-500">Experience:</span>
              <span className="font-semibold text-right">{tourData.name}</span>
            </div>
          )}
          <div className="flex justify-between py-2 border-b border-gray-50">
            <span className="text-gray-500">Date:</span>
            <span className="font-semibold">{formData.tripDate}</span>
          </div>
          {formData.tripType !== 'experience' && (
            <>
              <div className="flex justify-between py-2 border-b border-gray-50">
                <span className="text-gray-500">Pickup:</span>
                <span className="font-semibold text-right">{formData.pickupLocation || 'Not specified'}</span>
              </div>
              {formData.tripType !== 'tour' && (
                <div className="flex justify-between py-2 border-b border-gray-50">
                  <span className="text-gray-500">Dropoff:</span>
                  <span className="font-semibold text-right">{formData.dropoffLocation || 'Not specified'}</span>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* Payment Summary */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <h4 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
          <CreditCard className="w-5 h-5 text-emerald-600" />
          Payment Details
        </h4>
        <div className="space-y-3 text-sm">
          <div className="flex justify-between py-2 border-b border-gray-50">
            <span className="text-gray-500">Method:</span>
            <span className="font-semibold capitalize">{formData.paymentMethod}</span>
          </div>
          <div className="flex justify-between py-2 border-b border-gray-50">
            <span className="text-gray-500">Total Amount:</span>
            <span className="font-bold text-lg text-emerald-600">
              ${tourData?.price || 'Calculated later'}
            </span>
          </div>
        </div>
      </div>

      {/* Travelers */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <h4 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
          <Users className="w-5 h-5 text-emerald-600" />
          Travelers
        </h4>
        <div className="flex flex-wrap gap-3">
          <span className="px-3 py-1 bg-gray-100 rounded-full text-sm font-medium text-gray-600">
            {formData.adults} Adults
          </span>
          {formData.children > 0 && (
            <span className="px-3 py-1 bg-gray-100 rounded-full text-sm font-medium text-gray-600">
              {formData.children} Children
            </span>
          )}
          {formData.infants > 0 && (
            <span className="px-3 py-1 bg-gray-100 rounded-full text-sm font-medium text-gray-600">
              {formData.infants} Infants
            </span>
          )}
        </div>
        {formData.specialRequirements && (
          <div className="mt-4 p-3 bg-yellow-50 rounded-lg text-sm text-yellow-800">
            <span className="font-semibold block mb-1">Note:</span>
            {formData.specialRequirements}
          </div>
        )}
      </div>

      {/* Contact */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <h4 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
          <User className="w-5 h-5 text-emerald-600" />
          Contact Info
        </h4>
        <div className="space-y-2 text-sm">
          <div className="font-medium text-gray-900">{formData.fullName}</div>
          <div className="text-gray-500">{formData.email}</div>
          <div className="text-gray-500">{formData.phone}</div>
        </div>
      </div>
    </div>
  </div>
);

export default MultiStepBookingWizard;
