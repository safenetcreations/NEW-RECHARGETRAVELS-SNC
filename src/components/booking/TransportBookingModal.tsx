import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  User,
  Mail,
  Phone,
  MapPin,
  MessageSquare,
  Loader2,
  CheckCircle,
  Calendar,
  Clock,
  DollarSign,
  Car,
  Users,
  Briefcase
} from 'lucide-react';
import { Vehicle } from '@/contexts/TransportBookingContext';
import { createTransportBooking } from '@/services/transportBookingService';

interface BookingDetails {
  transferType?: 'toAirport' | 'fromAirport';
  airport?: string;
  airportName?: string;
  location?: string;
  date?: string;
  time?: string;
  passengers?: number;
  luggage?: number;
  vehicle?: Vehicle;
  price?: number;
  // For other booking types
  type?: string;
  from?: string;
  to?: string;
  driver?: string;
  tour?: string;
  trail?: string;
  duration?: string;
  participants?: number;
}

interface CustomerData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  countryCode: string;
  pickupAddress: string;
  specialRequests: string;
  agreeTerms: boolean;
}

interface TransportBookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  bookingType: 'airport-transfer' | 'personal-driver' | 'tour' | 'trail';
  bookingDetails: BookingDetails;
  onBookingComplete?: () => void;
}

const TransportBookingModal = ({
  isOpen,
  onClose,
  bookingType,
  bookingDetails,
  onBookingComplete
}: TransportBookingModalProps) => {
  const [customerData, setCustomerData] = useState<CustomerData>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    countryCode: '+94',
    pickupAddress: '',
    specialRequests: '',
    agreeTerms: false,
  });

  const [errors, setErrors] = useState<Partial<Record<keyof CustomerData, string>>>({});
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const handleInputChange = (field: keyof CustomerData, value: string | boolean) => {
    setCustomerData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Partial<Record<keyof CustomerData, string>> = {};

    if (!customerData.firstName.trim()) {
      newErrors.firstName = 'First name is required';
    }
    if (!customerData.lastName.trim()) {
      newErrors.lastName = 'Last name is required';
    }
    if (!customerData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(customerData.email)) {
      newErrors.email = 'Invalid email address';
    }
    if (!customerData.phone.trim()) {
      newErrors.phone = 'Phone number is required';
    }
    if (!customerData.agreeTerms) {
      newErrors.agreeTerms = 'You must agree to the terms';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setSubmitting(true);
    setSubmitError(null);

    try {
      // Create booking in Firebase
      await createTransportBooking({
        type: bookingType,
        ...bookingDetails,
        vehicleId: bookingDetails.vehicle?.id,
        vehicleName: bookingDetails.vehicle?.name,
        customer: {
          firstName: customerData.firstName,
          lastName: customerData.lastName,
          email: customerData.email,
          phone: `${customerData.countryCode}${customerData.phone}`,
          pickupAddress: customerData.pickupAddress,
          specialRequests: customerData.specialRequests,
        },
        totalPrice: bookingDetails.price || 0,
      });

      // Call the completion handler
      onBookingComplete?.();
    } catch (error) {
      console.error('Booking error:', error);
      setSubmitError('Failed to create booking. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const getBookingTitle = () => {
    switch (bookingType) {
      case 'airport-transfer':
        return bookingDetails.transferType === 'fromAirport' ? 'Airport Pickup' : 'Airport Drop-off';
      case 'personal-driver':
        return 'Personal Driver';
      case 'tour':
        return 'Tour Booking';
      case 'trail':
        return 'Trail Service';
      default:
        return 'Booking';
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 overflow-y-auto">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-black/50 backdrop-blur-sm"
        />

        {/* Modal */}
        <div className="flex min-h-full items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.2 }}
            className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl overflow-hidden"
          >
            {/* Header */}
            <div className="bg-emerald-600 text-white p-6">
              <button
                onClick={onClose}
                className="absolute top-4 right-4 p-2 hover:bg-white/20 rounded-full transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
              <h2 className="text-2xl font-bold">Complete Your Booking</h2>
              <p className="text-emerald-100 mt-1">{getBookingTitle()}</p>
            </div>

            {/* Booking Summary */}
            <div className="bg-emerald-50 p-4 border-b">
              <h3 className="font-semibold text-emerald-800 mb-3">Booking Summary</h3>

              {/* Airport Transfer Summary */}
              {bookingType === 'airport-transfer' && (
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-sm">
                    <MapPin className="w-4 h-4 text-emerald-600" />
                    <span className="text-gray-600">
                      {bookingDetails.transferType === 'fromAirport'
                        ? `${bookingDetails.airportName || bookingDetails.airport} → ${bookingDetails.location}`
                        : `${bookingDetails.location} → ${bookingDetails.airportName || bookingDetails.airport}`
                      }
                    </span>
                  </div>
                  <div className="flex items-center gap-4 text-sm">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-emerald-600" />
                      <span className="text-gray-600">{bookingDetails.date}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-emerald-600" />
                      <span className="text-gray-600">{bookingDetails.time}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 text-sm">
                    <div className="flex items-center gap-2">
                      <Users className="w-4 h-4 text-emerald-600" />
                      <span className="text-gray-600">{bookingDetails.passengers} passengers</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Briefcase className="w-4 h-4 text-emerald-600" />
                      <span className="text-gray-600">{bookingDetails.luggage} bags</span>
                    </div>
                  </div>
                  {bookingDetails.vehicle && (
                    <div className="flex items-center gap-2 text-sm">
                      <Car className="w-4 h-4 text-emerald-600" />
                      <span className="text-gray-600">{bookingDetails.vehicle.name} ({bookingDetails.vehicle.type})</span>
                    </div>
                  )}
                </div>
              )}

              {/* Price */}
              {bookingDetails.price && bookingDetails.price > 0 && (
                <div className="mt-4 pt-3 border-t border-emerald-200">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Total Price:</span>
                    <div className="flex items-center gap-1">
                      <DollarSign className="w-5 h-5 text-emerald-600" />
                      <span className="text-2xl font-bold text-emerald-700">{bookingDetails.price}</span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              {submitError && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                  {submitError}
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* First Name */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    <User className="w-4 h-4 inline mr-1" />
                    First Name *
                  </label>
                  <input
                    type="text"
                    value={customerData.firstName}
                    onChange={(e) => handleInputChange('firstName', e.target.value)}
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 ${
                      errors.firstName ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="John"
                  />
                  {errors.firstName && (
                    <p className="text-red-500 text-xs mt-1">{errors.firstName}</p>
                  )}
                </div>

                {/* Last Name */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Last Name *</label>
                  <input
                    type="text"
                    value={customerData.lastName}
                    onChange={(e) => handleInputChange('lastName', e.target.value)}
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 ${
                      errors.lastName ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="Doe"
                  />
                  {errors.lastName && (
                    <p className="text-red-500 text-xs mt-1">{errors.lastName}</p>
                  )}
                </div>
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  <Mail className="w-4 h-4 inline mr-1" />
                  Email Address *
                </label>
                <input
                  type="email"
                  value={customerData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 ${
                    errors.email ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="john@example.com"
                />
                {errors.email && (
                  <p className="text-red-500 text-xs mt-1">{errors.email}</p>
                )}
              </div>

              {/* Phone */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  <Phone className="w-4 h-4 inline mr-1" />
                  Phone Number *
                </label>
                <div className="flex gap-2">
                  <select
                    value={customerData.countryCode}
                    onChange={(e) => handleInputChange('countryCode', e.target.value)}
                    className="px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 w-28"
                  >
                    <option value="+94">+94</option>
                    <option value="+1">+1</option>
                    <option value="+44">+44</option>
                    <option value="+61">+61</option>
                    <option value="+91">+91</option>
                    <option value="+49">+49</option>
                    <option value="+33">+33</option>
                    <option value="+81">+81</option>
                    <option value="+86">+86</option>
                    <option value="+971">+971</option>
                    <option value="+65">+65</option>
                  </select>
                  <input
                    type="tel"
                    value={customerData.phone}
                    onChange={(e) => handleInputChange('phone', e.target.value)}
                    className={`flex-1 px-4 py-3 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 ${
                      errors.phone ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="771234567"
                  />
                </div>
                {errors.phone && (
                  <p className="text-red-500 text-xs mt-1">{errors.phone}</p>
                )}
              </div>

              {/* Pickup Address */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  <MapPin className="w-4 h-4 inline mr-1" />
                  Pickup Address / Hotel Name
                </label>
                <input
                  type="text"
                  value={customerData.pickupAddress}
                  onChange={(e) => handleInputChange('pickupAddress', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500"
                  placeholder="Hotel name or full address"
                />
              </div>

              {/* Special Requests */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  <MessageSquare className="w-4 h-4 inline mr-1" />
                  Special Requests (Optional)
                </label>
                <textarea
                  value={customerData.specialRequests}
                  onChange={(e) => handleInputChange('specialRequests', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 h-20 resize-none"
                  placeholder="Child seat, wheelchair access, flight number, etc."
                />
              </div>

              {/* Terms */}
              <div className="flex items-start gap-3">
                <input
                  type="checkbox"
                  id="agreeTerms"
                  checked={customerData.agreeTerms}
                  onChange={(e) => handleInputChange('agreeTerms', e.target.checked)}
                  className="mt-1 w-5 h-5 text-emerald-600 rounded focus:ring-emerald-500"
                />
                <label htmlFor="agreeTerms" className="text-sm text-gray-600 cursor-pointer">
                  I agree to the{' '}
                  <a href="/terms" className="text-emerald-600 hover:underline">Terms & Conditions</a>
                  {' '}and{' '}
                  <a href="/privacy" className="text-emerald-600 hover:underline">Privacy Policy</a>
                </label>
              </div>
              {errors.agreeTerms && (
                <p className="text-red-500 text-xs">{errors.agreeTerms}</p>
              )}

              {/* Submit Button */}
              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={onClose}
                  className="flex-1 px-6 py-3 border border-gray-300 rounded-lg font-semibold text-gray-700 hover:bg-gray-50 transition-colors"
                  disabled={submitting}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-3 rounded-lg font-semibold flex items-center justify-center gap-2 transition-colors disabled:opacity-50"
                  disabled={submitting}
                >
                  {submitting ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    <>
                      <CheckCircle className="w-5 h-5" />
                      Confirm Booking
                    </>
                  )}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      </div>
    </AnimatePresence>
  );
};

export default TransportBookingModal;
