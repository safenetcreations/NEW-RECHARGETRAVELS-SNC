import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link, useParams, useSearchParams, useNavigate } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { 
  Car, 
  ArrowLeft, 
  ArrowRight,
  Check,
  Calendar,
  Clock,
  MapPin,
  User,
  Phone,
  Mail,
  CreditCard,
  Shield,
  AlertCircle,
  Info,
  FileText,
  Star,
  Plane,
  Building,
  Home,
  Navigation,
  Baby,
  Wifi,
  Fuel,
  Sparkles,
  Users,
  Crown,
  Zap,
  CheckCircle2,
  BadgeCheck,
  Globe
} from 'lucide-react';
import { 
  INSURANCE_PACKAGES, 
  DELIVERY_OPTIONS, 
  ADDITIONAL_SERVICES,
  InsurancePackage,
  DeliveryType,
  AdditionalService,
  DEFAULT_COMMISSION
} from '@/types/vehicleRental';

// Mock vehicle for booking
const mockVehicle = {
  id: '1',
  make: 'Toyota',
  model: 'Prius',
  year: 2021,
  image: 'https://images.unsplash.com/photo-1580273916550-e323be2ae537?w=400&h=300&fit=crop',
  rating: 4.9,
  reviewCount: 45,
  seatingCapacity: 5,
  transmission: 'automatic',
  fuelType: 'hybrid',
  pickupAddress: 'No. 45, Galle Road, Colombo 03',
  ownerName: 'Nuwan Perera',
  pricing: {
    hourlyRate: 4,
    dailyRate: 28,
    weeklyRate: 180,
    monthlyRate: 600,
    withDriverHourlyRate: 7,
    withDriverDailyRate: 40,
    securityDeposit: 85,
    mileageLimit: 150,
    extraMileageCharge: 0.2,
    deliveryFee: 5,
  }
};

const steps = [
  { id: 1, title: 'Details', icon: Calendar },
  { id: 2, title: 'Protection & Add-ons', icon: Shield },
  { id: 3, title: 'Personal Info', icon: User },
  { id: 4, title: 'Payment', icon: CreditCard },
  { id: 5, title: 'Confirmation', icon: Check },
];

const VehicleBooking = () => {
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [isProcessing, setIsProcessing] = useState(false);
  const [bookingComplete, setBookingComplete] = useState(false);

  // Get params from URL
  const withDriverParam = searchParams.get('withDriver') === 'true';
  const periodParam = searchParams.get('period') || 'daily';
  const startDateParam = searchParams.get('start') || '';
  const endDateParam = searchParams.get('end') || '';

  // Form state
  const [formData, setFormData] = useState({
    // Step 1: Booking Details
    startDate: startDateParam,
    endDate: endDateParam,
    startTime: '09:00',
    endTime: '18:00',
    withDriver: withDriverParam,
    rentalPeriod: periodParam as 'hourly' | 'daily' | 'weekly' | 'monthly',
    deliveryType: 'self_pickup' as DeliveryType,
    deliveryAddress: '',
    
    // Step 2: Protection & Add-ons
    insurancePackage: 'silver' as InsurancePackage, // Default to silver (recommended)
    selectedServices: [] as AdditionalService[],
    
    // Step 3: Personal Info
    fullName: '',
    email: '',
    phone: '',
    passportNumber: '',
    passportCountry: '',
    licenseNumber: '',
    licenseCountry: '',
    emergencyContact: '',
    
    // Step 4: Payment
    paymentMethod: 'card' as 'card' | 'bank' | 'cash',
    cardNumber: '',
    cardExpiry: '',
    cardCvv: '',
    agreeTerms: false,
  });

  const vehicle = mockVehicle;

  const updateFormData = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  // Calculate rental days
  const calculateDays = () => {
    if (!formData.startDate || !formData.endDate) return 1;
    const start = new Date(formData.startDate);
    const end = new Date(formData.endDate);
    const diff = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
    return diff > 0 ? diff : 1;
  };

  // Get selected insurance package
  const getSelectedInsurance = () => {
    return INSURANCE_PACKAGES.find(p => p.id === formData.insurancePackage);
  };

  // Get selected delivery option
  const getSelectedDelivery = () => {
    return DELIVERY_OPTIONS.find(d => d.id === formData.deliveryType);
  };

  // Calculate additional services cost
  const calculateServicesCost = () => {
    const days = calculateDays();
    return formData.selectedServices.reduce((total, serviceId) => {
      const service = ADDITIONAL_SERVICES.find(s => s.id === serviceId);
      if (service) {
        return total + (service.oneTime ? service.pricePerDay : service.pricePerDay * days);
      }
      return total;
    }, 0);
  };

  // Calculate total price with all add-ons
  const calculateTotal = () => {
    const days = calculateDays();
    const baseRate = formData.withDriver ? vehicle.pricing.withDriverDailyRate : vehicle.pricing.dailyRate;
    const rentalCost = baseRate * days;
    
    // Insurance
    const insurance = getSelectedInsurance();
    const insuranceCost = insurance ? insurance.pricePerDay * days : 0;
    
    // Delivery
    const delivery = getSelectedDelivery();
    const deliveryFee = delivery ? delivery.price : 0;
    
    // Additional services
    const servicesCost = calculateServicesCost();
    
    // Service fee (10% of rental)
    const serviceFee = Math.round(rentalCost * 0.10);
    
    // Calculate platform revenue breakdown
    const rentalCommission = Math.round(rentalCost * (DEFAULT_COMMISSION.dailyCommission / 100));
    const insuranceCommission = insurance ? Math.round(insuranceCost * (insurance.commission / 100)) : 0;
    const servicesCommission = formData.selectedServices.reduce((total, serviceId) => {
      const service = ADDITIONAL_SERVICES.find(s => s.id === serviceId);
      if (service) {
        const cost = service.oneTime ? service.pricePerDay : service.pricePerDay * days;
        return total + Math.round(cost * (service.commission / 100));
      }
      return total;
    }, 0);
    
    const subtotal = rentalCost + insuranceCost + deliveryFee + servicesCost + serviceFee;
    
    return {
      days,
      rentalCost,
      insuranceCost,
      deliveryFee,
      servicesCost,
      serviceFee,
      securityDeposit: vehicle.pricing.securityDeposit,
      subtotal,
      grandTotal: subtotal + vehicle.pricing.securityDeposit,
      
      // Revenue breakdown (for transparency)
      platformRevenue: {
        rentalCommission,
        serviceFeeEarned: serviceFee,
        insuranceCommission,
        deliveryFeeEarned: deliveryFee, // 100% delivery fee
        servicesCommission,
        total: rentalCommission + serviceFee + insuranceCommission + deliveryFee + servicesCommission
      },
      
      // Owner payout
      ownerPayout: rentalCost - rentalCommission + (insuranceCost - insuranceCommission)
    };
  };

  const pricing = calculateTotal();

  const canProceed = () => {
    switch (currentStep) {
      case 1: {
        const needsDeliveryAddress = formData.deliveryType !== 'self_pickup';
        return formData.startDate && formData.endDate && (!needsDeliveryAddress || formData.deliveryAddress);
      }
      case 2:
        return true; // Insurance and add-ons are optional (but insurance defaults to silver)
      case 3:
        return formData.fullName && formData.email && formData.phone && formData.passportNumber && formData.licenseNumber;
      case 4:
        if (!formData.agreeTerms) return false;
        if (formData.paymentMethod === 'card') {
          return formData.cardNumber && formData.cardExpiry && formData.cardCvv;
        }
        return true;
      default:
        return true;
    }
  };

  const handleSubmit = async () => {
    setIsProcessing(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));
    setIsProcessing(false);
    setBookingComplete(true);
    setCurrentStep(5);
  };

  // Booking Confirmation Screen
  if (bookingComplete) {
    return (
      <>
        <Helmet>
          <title>Booking Confirmed | Recharge Travels</title>
        </Helmet>
        <Header />
        <div className="min-h-screen bg-gray-50 pt-20 flex items-center justify-center">
          <div className="max-w-lg mx-auto px-4 py-12 text-center">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Check className="w-10 h-10 text-green-600" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Booking Confirmed!</h1>
            <p className="text-gray-600 mb-6">
              Your booking for {vehicle.make} {vehicle.model} has been confirmed. 
              You'll receive a confirmation email shortly.
            </p>
            
            <div className="bg-white rounded-2xl shadow-md p-6 text-left mb-6">
              <h2 className="font-bold text-gray-900 mb-4">Booking Details</h2>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-500">Booking ID</span>
                  <span className="font-medium">VR-{Date.now().toString().slice(-6)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Vehicle</span>
                  <span className="font-medium">{vehicle.make} {vehicle.model}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Dates</span>
                  <span className="font-medium">
                    {new Date(formData.startDate).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })} - {new Date(formData.endDate).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Rental Type</span>
                  <span className="font-medium">{formData.withDriver ? 'With Driver' : 'Self Drive'}</span>
                </div>
                <div className="flex justify-between border-t border-gray-100 pt-3 mt-3">
                  <span className="text-gray-900 font-medium">Total Paid</span>
                  <span className="font-bold text-amber-600">${pricing.grandTotal}</span>
                </div>
              </div>
            </div>

            <div className="bg-blue-50 rounded-xl p-4 text-left mb-6">
              <div className="flex gap-3">
                <Info className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                <div className="text-sm text-blue-800">
                  <p className="font-medium mb-1">What's Next?</p>
                  <p>The vehicle owner will contact you to confirm pickup details. Make sure to bring your NIC and driving license.</p>
                </div>
              </div>
            </div>

            <div className="flex gap-3">
              <Link
                to="/vehicle-rental/browse"
                className="flex-1 py-3 border border-gray-200 rounded-xl font-medium text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Browse More
              </Link>
              <Link
                to="/"
                className="flex-1 py-3 bg-amber-500 text-white rounded-xl font-medium hover:bg-amber-600 transition-colors"
              >
                Back to Home
              </Link>
            </div>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Helmet>
        <title>Book {vehicle.make} {vehicle.model} | Recharge Travels</title>
      </Helmet>

      <Header />

      <div className="min-h-screen bg-gray-50 pt-20">
        {/* Header */}
        <div className="bg-gradient-to-r from-slate-900 to-slate-800 py-6">
          <div className="max-w-5xl mx-auto px-4 sm:px-6">
            <Link to={`/vehicle-rental/vehicle/${id}`} className="inline-flex items-center gap-2 text-gray-300 hover:text-white mb-3 transition-colors">
              <ArrowLeft className="w-4 h-4" />
              Back to Vehicle
            </Link>
            <h1 className="text-2xl font-bold text-white">Complete Your Booking</h1>
            <p className="text-gray-300">{vehicle.make} {vehicle.model} {vehicle.year}</p>
          </div>
        </div>

        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6">
          {/* Progress Steps */}
          <div className="bg-white rounded-2xl shadow-sm p-4 mb-6">
            <div className="flex items-center">
              {steps.map((step, index) => (
                <React.Fragment key={step.id}>
                  <div className="flex flex-col items-center">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${
                      step.id < currentStep 
                        ? 'bg-green-500 text-white'
                        : step.id === currentStep
                        ? 'bg-amber-500 text-white'
                        : 'bg-gray-100 text-gray-400'
                    }`}>
                      {step.id < currentStep ? (
                        <Check className="w-5 h-5" />
                      ) : (
                        <step.icon className="w-5 h-5" />
                      )}
                    </div>
                    <span className={`mt-1.5 text-xs font-medium ${
                      step.id === currentStep ? 'text-amber-600' : 'text-gray-500'
                    }`}>
                      {step.title}
                    </span>
                  </div>
                  {index < steps.length - 1 && (
                    <div className={`flex-1 h-0.5 mx-3 ${
                      step.id < currentStep ? 'bg-green-500' : 'bg-gray-200'
                    }`} />
                  )}
                </React.Fragment>
              ))}
            </div>
          </div>

          <div className="flex flex-col lg:flex-row gap-6">
            {/* Form Section */}
            <div className="flex-1">
              <div className="bg-white rounded-2xl shadow-sm p-6">
                {/* Step 1: Booking Details */}
                {currentStep === 1 && (
                  <div>
                    <h2 className="text-xl font-bold text-gray-900 mb-2">Booking Details</h2>
                    <p className="text-gray-600 mb-6">Select your rental dates and delivery options</p>

                    <div className="space-y-6">
                      {/* Dates */}
                      <div className="grid sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Pickup Date *</label>
                          <input
                            type="date"
                            value={formData.startDate}
                            onChange={(e) => updateFormData('startDate', e.target.value)}
                            min={new Date().toISOString().split('T')[0]}
                            className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-amber-400/50 focus:border-amber-400"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Return Date *</label>
                          <input
                            type="date"
                            value={formData.endDate}
                            onChange={(e) => updateFormData('endDate', e.target.value)}
                            min={formData.startDate || new Date().toISOString().split('T')[0]}
                            className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-amber-400/50 focus:border-amber-400"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Pickup Time</label>
                          <input
                            type="time"
                            value={formData.startTime}
                            onChange={(e) => updateFormData('startTime', e.target.value)}
                            className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-amber-400/50 focus:border-amber-400"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Return Time</label>
                          <input
                            type="time"
                            value={formData.endTime}
                            onChange={(e) => updateFormData('endTime', e.target.value)}
                            className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-amber-400/50 focus:border-amber-400"
                          />
                        </div>
                      </div>

                      {/* Rental Type */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Rental Type</label>
                        <div className="grid grid-cols-2 gap-3">
                          <button
                            onClick={() => updateFormData('withDriver', false)}
                            className={`p-4 rounded-xl border-2 transition-all ${
                              !formData.withDriver ? 'border-amber-500 bg-amber-50' : 'border-gray-200'
                            }`}
                          >
                            <div className="font-medium text-gray-900">Self Drive</div>
                            <div className="text-sm text-gray-500">${vehicle.pricing.dailyRate}/day</div>
                          </button>
                          <button
                            onClick={() => updateFormData('withDriver', true)}
                            className={`p-4 rounded-xl border-2 transition-all ${
                              formData.withDriver ? 'border-amber-500 bg-amber-50' : 'border-gray-200'
                            }`}
                          >
                            <div className="font-medium text-gray-900">With Driver</div>
                            <div className="text-sm text-gray-500">${vehicle.pricing.withDriverDailyRate}/day</div>
                          </button>
                        </div>
                      </div>

                      {/* Enhanced Delivery Options */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          <div className="flex items-center gap-2">
                            <MapPin className="w-4 h-4" />
                            <span>Delivery Option</span>
                          </div>
                        </label>
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                          {DELIVERY_OPTIONS.map((option) => {
                            const icons: Record<string, any> = {
                              self_pickup: MapPin,
                              airport: Plane,
                              hotel: Building,
                              city: Home,
                              custom: Navigation
                            };
                            const Icon = icons[option.id] || MapPin;
                            
                            return (
                              <button
                                key={option.id}
                                onClick={() => updateFormData('deliveryType', option.id)}
                                className={`p-4 rounded-xl border-2 transition-all text-left ${
                                  formData.deliveryType === option.id 
                                    ? 'border-amber-500 bg-amber-50' 
                                    : 'border-gray-200 hover:border-gray-300'
                                }`}
                              >
                                <Icon className={`w-5 h-5 mb-2 ${formData.deliveryType === option.id ? 'text-amber-600' : 'text-gray-400'}`} />
                                <div className="font-medium text-gray-900 text-sm">{option.name}</div>
                                <div className="text-xs text-gray-500">
                                  {option.price === 0 ? 'Free' : `$${option.price}`}
                                </div>
                                {option.estimatedTime && (
                                  <div className="text-xs text-gray-400 mt-1">{option.estimatedTime}</div>
                                )}
                              </button>
                            );
                          })}
                        </div>

                        {/* Delivery Address Field */}
                        {formData.deliveryType !== 'self_pickup' && (
                          <div className="mt-4">
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              {formData.deliveryType === 'airport' && 'Flight Number & Arrival Time *'}
                              {formData.deliveryType === 'hotel' && 'Hotel Name & Address *'}
                              {formData.deliveryType === 'city' && 'Full Delivery Address *'}
                              {formData.deliveryType === 'custom' && 'Custom Location Details *'}
                            </label>
                            <input
                              type="text"
                              value={formData.deliveryAddress}
                              onChange={(e) => updateFormData('deliveryAddress', e.target.value)}
                              placeholder={
                                formData.deliveryType === 'airport' ? 'e.g., UL 504 arriving at 14:30' :
                                formData.deliveryType === 'hotel' ? 'e.g., Cinnamon Grand Colombo, Colombo 03' :
                                'Enter your full address'
                              }
                              className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-amber-400/50 focus:border-amber-400"
                            />
                            <p className="text-xs text-gray-500 mt-1">
                              {formData.deliveryType === 'airport' && 'We\'ll meet you at the arrivals hall with your vehicle'}
                              {formData.deliveryType === 'hotel' && 'Driver will meet you at hotel lobby/reception'}
                            </p>
                          </div>
                        )}

                        {/* Self Pickup Location */}
                        {formData.deliveryType === 'self_pickup' && (
                          <div className="mt-4 p-4 bg-gray-50 rounded-xl">
                            <div className="flex items-start gap-3">
                              <MapPin className="w-5 h-5 text-gray-500 flex-shrink-0 mt-0.5" />
                              <div>
                                <div className="font-medium text-gray-900">Pickup Location</div>
                                <div className="text-sm text-gray-600">{vehicle.pickupAddress}</div>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )}

                {/* Step 2: Protection & Add-ons */}
                {currentStep === 2 && (
                  <div>
                    <h2 className="text-xl font-bold text-gray-900 mb-2">Protection & Add-ons</h2>
                    <p className="text-gray-600 mb-6">Choose your insurance coverage and optional services</p>

                    <div className="space-y-8">
                      {/* Insurance Packages */}
                      <div>
                        <div className="flex items-center gap-2 mb-4">
                          <Shield className="w-5 h-5 text-amber-600" />
                          <h3 className="font-semibold text-gray-900">Insurance Protection</h3>
                        </div>
                        
                        <div className="space-y-3">
                          {/* No Insurance Option */}
                          <button
                            onClick={() => updateFormData('insurancePackage', 'none')}
                            className={`w-full p-4 rounded-xl border-2 transition-all text-left ${
                              formData.insurancePackage === 'none' 
                                ? 'border-amber-500 bg-amber-50' 
                                : 'border-gray-200 hover:border-gray-300'
                            }`}
                          >
                            <div className="flex items-center justify-between">
                              <div>
                                <div className="font-medium text-gray-900">No Additional Protection</div>
                                <div className="text-sm text-gray-500">Rely on your own travel insurance</div>
                              </div>
                              <div className="text-right">
                                <div className="font-bold text-gray-900">$0</div>
                              </div>
                            </div>
                          </button>

                          {/* Insurance Packages */}
                          {INSURANCE_PACKAGES.map((pkg) => {
                            const icons: Record<string, any> = {
                              basic: Shield,
                              silver: BadgeCheck,
                              gold: Crown
                            };
                            const Icon = icons[pkg.id] || Shield;
                            const colors: Record<string, string> = {
                              basic: 'text-gray-500',
                              silver: 'text-blue-500',
                              gold: 'text-amber-500'
                            };
                            
                            return (
                              <button
                                key={pkg.id}
                                onClick={() => updateFormData('insurancePackage', pkg.id)}
                                className={`w-full p-4 rounded-xl border-2 transition-all text-left relative ${
                                  formData.insurancePackage === pkg.id 
                                    ? 'border-amber-500 bg-amber-50' 
                                    : 'border-gray-200 hover:border-gray-300'
                                }`}
                              >
                                {pkg.recommended && (
                                  <div className="absolute -top-2 right-4 bg-green-500 text-white text-xs px-2 py-0.5 rounded-full">
                                    Recommended
                                  </div>
                                )}
                                <div className="flex items-start gap-4">
                                  <Icon className={`w-6 h-6 ${colors[pkg.id]} flex-shrink-0`} />
                                  <div className="flex-1">
                                    <div className="flex items-center justify-between">
                                      <div className="font-medium text-gray-900">{pkg.name}</div>
                                      <div className="text-right">
                                        <div className="font-bold text-amber-600">${pkg.pricePerDay}/day</div>
                                        <div className="text-xs text-gray-500">${pkg.pricePerDay * calculateDays()} total</div>
                                      </div>
                                    </div>
                                    <div className="text-sm text-gray-500 mt-1">Deductible: ${pkg.deductible}</div>
                                    <div className="flex flex-wrap gap-2 mt-2">
                                      {pkg.coverage.map((item, idx) => (
                                        <span key={idx} className="inline-flex items-center gap-1 text-xs bg-gray-100 px-2 py-1 rounded">
                                          <CheckCircle2 className="w-3 h-3 text-green-500" />
                                          {item}
                                        </span>
                                      ))}
                                    </div>
                                  </div>
                                </div>
                              </button>
                            );
                          })}
                        </div>
                      </div>

                      {/* Additional Services */}
                      <div>
                        <div className="flex items-center gap-2 mb-4">
                          <Zap className="w-5 h-5 text-amber-600" />
                          <h3 className="font-semibold text-gray-900">Additional Services</h3>
                        </div>
                        
                        <div className="grid sm:grid-cols-2 gap-3">
                          {ADDITIONAL_SERVICES.map((service) => {
                            const icons: Record<string, any> = {
                              gps: Navigation,
                              child_seat: Baby,
                              wifi_hotspot: Wifi,
                              fuel_delivery: Fuel,
                              vehicle_wash: Sparkles,
                              extra_driver: Users
                            };
                            const Icon = icons[service.id] || Zap;
                            const isSelected = formData.selectedServices.includes(service.id);
                            
                            return (
                              <button
                                key={service.id}
                                onClick={() => {
                                  if (isSelected) {
                                    updateFormData('selectedServices', formData.selectedServices.filter(s => s !== service.id));
                                  } else {
                                    updateFormData('selectedServices', [...formData.selectedServices, service.id]);
                                  }
                                }}
                                className={`p-4 rounded-xl border-2 transition-all text-left ${
                                  isSelected 
                                    ? 'border-amber-500 bg-amber-50' 
                                    : 'border-gray-200 hover:border-gray-300'
                                }`}
                              >
                                <div className="flex items-start gap-3">
                                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                                    isSelected ? 'bg-amber-500 text-white' : 'bg-gray-100 text-gray-500'
                                  }`}>
                                    <Icon className="w-5 h-5" />
                                  </div>
                                  <div className="flex-1">
                                    <div className="flex items-center justify-between">
                                      <div className="font-medium text-gray-900">{service.name}</div>
                                      <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                                        isSelected ? 'bg-amber-500 border-amber-500' : 'border-gray-300'
                                      }`}>
                                        {isSelected && <Check className="w-3 h-3 text-white" />}
                                      </div>
                                    </div>
                                    <div className="text-xs text-gray-500 mt-0.5">{service.description}</div>
                                    <div className="font-medium text-amber-600 text-sm mt-1">
                                      ${service.pricePerDay}{service.oneTime ? '' : '/day'}
                                      {!service.oneTime && calculateDays() > 1 && (
                                        <span className="text-gray-400 font-normal"> (${service.pricePerDay * calculateDays()} total)</span>
                                      )}
                                    </div>
                                  </div>
                                </div>
                              </button>
                            );
                          })}
                        </div>
                      </div>

                      {/* Services Summary */}
                      {(formData.insurancePackage !== 'none' || formData.selectedServices.length > 0) && (
                        <div className="bg-gray-50 rounded-xl p-4">
                          <h4 className="font-medium text-gray-900 mb-2">Selected Add-ons Summary</h4>
                          <div className="space-y-1 text-sm">
                            {formData.insurancePackage !== 'none' && (
                              <div className="flex justify-between">
                                <span className="text-gray-600">
                                  {INSURANCE_PACKAGES.find(p => p.id === formData.insurancePackage)?.name} ({calculateDays()} days)
                                </span>
                                <span className="font-medium">${pricing.insuranceCost}</span>
                              </div>
                            )}
                            {formData.selectedServices.map(serviceId => {
                              const service = ADDITIONAL_SERVICES.find(s => s.id === serviceId);
                              if (!service) return null;
                              const cost = service.oneTime ? service.pricePerDay : service.pricePerDay * calculateDays();
                              return (
                                <div key={serviceId} className="flex justify-between">
                                  <span className="text-gray-600">{service.name}</span>
                                  <span className="font-medium">${cost}</span>
                                </div>
                              );
                            })}
                            <div className="flex justify-between pt-2 mt-2 border-t border-gray-200 font-medium">
                              <span>Add-ons Total</span>
                              <span className="text-amber-600">${pricing.insuranceCost + pricing.servicesCost}</span>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Step 3: Personal Info (International Tourists) */}
                {currentStep === 3 && (
                  <div>
                    <h2 className="text-xl font-bold text-gray-900 mb-2">Personal Information</h2>
                    <p className="text-gray-600 mb-6">Enter your details for the rental agreement (International ID required)</p>

                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Full Name *</label>
                        <input
                          type="text"
                          value={formData.fullName}
                          onChange={(e) => updateFormData('fullName', e.target.value)}
                          placeholder="As shown on Passport"
                          className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-amber-400/50 focus:border-amber-400"
                        />
                      </div>

                      <div className="grid sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Email Address *</label>
                          <input
                            type="email"
                            value={formData.email}
                            onChange={(e) => updateFormData('email', e.target.value)}
                            placeholder="your@email.com"
                            className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-amber-400/50 focus:border-amber-400"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number (WhatsApp) *</label>
                          <input
                            type="tel"
                            value={formData.phone}
                            onChange={(e) => updateFormData('phone', e.target.value)}
                            placeholder="+1 234 567 8900"
                            className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-amber-400/50 focus:border-amber-400"
                          />
                        </div>
                      </div>

                      {/* Passport Information */}
                      <div className="bg-blue-50 rounded-xl p-4">
                        <div className="flex items-center gap-2 mb-3">
                          <Globe className="w-5 h-5 text-blue-600" />
                          <span className="font-medium text-blue-900">Passport Information</span>
                        </div>
                        <div className="grid sm:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Passport Number *</label>
                            <input
                              type="text"
                              value={formData.passportNumber}
                              onChange={(e) => updateFormData('passportNumber', e.target.value)}
                              placeholder="e.g., AB1234567"
                              className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-amber-400/50 focus:border-amber-400 bg-white"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Passport Country *</label>
                            <input
                              type="text"
                              value={formData.passportCountry}
                              onChange={(e) => updateFormData('passportCountry', e.target.value)}
                              placeholder="e.g., United States"
                              className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-amber-400/50 focus:border-amber-400 bg-white"
                            />
                          </div>
                        </div>
                      </div>

                      {/* Driving License */}
                      <div className="bg-green-50 rounded-xl p-4">
                        <div className="flex items-center gap-2 mb-3">
                          <Car className="w-5 h-5 text-green-600" />
                          <span className="font-medium text-green-900">Driving License (Required for Self-Drive)</span>
                        </div>
                        <div className="grid sm:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">License Number *</label>
                            <input
                              type="text"
                              value={formData.licenseNumber}
                              onChange={(e) => updateFormData('licenseNumber', e.target.value)}
                              placeholder="Your driving license number"
                              className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-amber-400/50 focus:border-amber-400 bg-white"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">License Country</label>
                            <input
                              type="text"
                              value={formData.licenseCountry}
                              onChange={(e) => updateFormData('licenseCountry', e.target.value)}
                              placeholder="Country of issue"
                              className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-amber-400/50 focus:border-amber-400 bg-white"
                            />
                          </div>
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Emergency Contact</label>
                        <input
                          type="tel"
                          value={formData.emergencyContact}
                          onChange={(e) => updateFormData('emergencyContact', e.target.value)}
                          placeholder="Emergency phone number"
                          className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-amber-400/50 focus:border-amber-400"
                        />
                      </div>
                    </div>

                    <div className="mt-6 p-4 bg-amber-50 rounded-xl">
                      <div className="flex gap-3">
                        <FileText className="w-5 h-5 text-amber-600 flex-shrink-0" />
                        <div className="text-sm text-amber-800">
                          <p className="font-medium mb-1">Required Documents at Pickup</p>
                          <ul className="list-disc list-inside space-y-1">
                            <li>Original Passport</li>
                            <li>Valid Driving License (from your country)</li>
                            <li>International Driving Permit (recommended)</li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Step 4: Payment */}
                {currentStep === 4 && (
                  <div>
                    <h2 className="text-xl font-bold text-gray-900 mb-2">Payment</h2>
                    <p className="text-gray-600 mb-6">Select your payment method</p>

                    <div className="space-y-6">
                      {/* Payment Method */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Payment Method</label>
                        <div className="grid sm:grid-cols-3 gap-3">
                          {[
                            { value: 'card', label: 'Credit/Debit Card', icon: CreditCard },
                            { value: 'bank', label: 'Bank Transfer', icon: FileText },
                            { value: 'cash', label: 'Cash on Pickup', icon: Shield },
                          ].map(method => (
                            <button
                              key={method.value}
                              onClick={() => updateFormData('paymentMethod', method.value)}
                              className={`p-4 rounded-xl border-2 transition-all flex flex-col items-center ${
                                formData.paymentMethod === method.value ? 'border-amber-500 bg-amber-50' : 'border-gray-200'
                              }`}
                            >
                              <method.icon className="w-6 h-6 mb-2 text-gray-600" />
                              <div className="text-sm font-medium text-gray-900 text-center">{method.label}</div>
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Card Details */}
                      {formData.paymentMethod === 'card' && (
                        <div className="space-y-4 p-4 bg-gray-50 rounded-xl">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Card Number</label>
                            <input
                              type="text"
                              value={formData.cardNumber}
                              onChange={(e) => updateFormData('cardNumber', e.target.value.replace(/\D/g, '').slice(0, 16))}
                              placeholder="1234 5678 9012 3456"
                              className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-amber-400/50 focus:border-amber-400"
                            />
                          </div>
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">Expiry Date</label>
                              <input
                                type="text"
                                value={formData.cardExpiry}
                                onChange={(e) => updateFormData('cardExpiry', e.target.value)}
                                placeholder="MM/YY"
                                maxLength={5}
                                className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-amber-400/50 focus:border-amber-400"
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">CVV</label>
                              <input
                                type="text"
                                value={formData.cardCvv}
                                onChange={(e) => updateFormData('cardCvv', e.target.value.replace(/\D/g, '').slice(0, 4))}
                                placeholder="123"
                                className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-amber-400/50 focus:border-amber-400"
                              />
                            </div>
                          </div>
                        </div>
                      )}

                      {formData.paymentMethod === 'bank' && (
                        <div className="p-4 bg-gray-50 rounded-xl">
                          <p className="text-sm text-gray-600 mb-3">Please transfer to the following account:</p>
                          <div className="space-y-2 text-sm">
                            <div className="flex justify-between">
                              <span className="text-gray-500">Bank:</span>
                              <span className="font-medium">Commercial Bank</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-500">Account Name:</span>
                              <span className="font-medium">Recharge Travels (Pvt) Ltd</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-500">Account No:</span>
                              <span className="font-medium">1234567890</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-500">Branch:</span>
                              <span className="font-medium">Colombo</span>
                            </div>
                          </div>
                        </div>
                      )}

                      {formData.paymentMethod === 'cash' && (
                        <div className="p-4 bg-yellow-50 rounded-xl">
                          <div className="flex gap-3">
                            <AlertCircle className="w-5 h-5 text-yellow-600 flex-shrink-0" />
                            <div className="text-sm text-yellow-800">
                              <p className="font-medium mb-1">Cash Payment</p>
                              <p>Full payment including security deposit must be made at vehicle pickup. Please bring exact change if possible.</p>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Terms */}
                      <label className="flex items-start gap-3 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={formData.agreeTerms}
                          onChange={(e) => updateFormData('agreeTerms', e.target.checked)}
                          className="w-4 h-4 mt-0.5 rounded border-gray-300 text-amber-500 focus:ring-amber-400/50"
                        />
                        <span className="text-sm text-gray-600">
                          I agree to the <a href="#" className="text-amber-600 hover:underline">Terms & Conditions</a> and <a href="#" className="text-amber-600 hover:underline">Rental Agreement</a>. I understand that the security deposit is refundable upon return of the vehicle in good condition.
                        </span>
                      </label>
                    </div>
                  </div>
                )}

                {/* Navigation */}
                <div className="flex items-center justify-between mt-8 pt-6 border-t border-gray-100">
                  <button
                    onClick={() => setCurrentStep(prev => prev - 1)}
                    disabled={currentStep === 1}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all ${
                      currentStep === 1 ? 'text-gray-300 cursor-not-allowed' : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    <ArrowLeft className="w-4 h-4" />
                    Previous
                  </button>

                  {currentStep < 4 ? (
                    <button
                      onClick={() => setCurrentStep(prev => prev + 1)}
                      disabled={!canProceed()}
                      className={`flex items-center gap-2 px-6 py-2.5 rounded-lg font-medium transition-all ${
                        canProceed()
                          ? 'bg-amber-500 text-white hover:bg-amber-600'
                          : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                      }`}
                    >
                      Continue
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  ) : (
                    <button
                      onClick={handleSubmit}
                      disabled={!canProceed() || isProcessing}
                      className={`flex items-center gap-2 px-6 py-2.5 rounded-lg font-medium transition-all ${
                        canProceed() && !isProcessing
                          ? 'bg-green-500 text-white hover:bg-green-600'
                          : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                      }`}
                    >
                      {isProcessing ? (
                        <>
                          <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                          Processing...
                        </>
                      ) : (
                        <>
                          Confirm & Pay ${pricing.grandTotal}
                        </>
                      )}
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* Booking Summary Sidebar */}
            <div className="lg:w-80">
              <div className="bg-white rounded-2xl shadow-md p-5 sticky top-24">
                <h3 className="font-bold text-gray-900 mb-4">Booking Summary</h3>

                {/* Vehicle Card */}
                <div className="flex gap-3 mb-4 pb-4 border-b border-gray-100">
                  <img
                    src={vehicle.image}
                    alt={`${vehicle.make} ${vehicle.model}`}
                    className="w-20 h-16 object-cover rounded-lg"
                  />
                  <div>
                    <div className="font-medium text-gray-900">{vehicle.make} {vehicle.model}</div>
                    <div className="text-sm text-gray-500">{vehicle.year}</div>
                    <div className="flex items-center gap-1 text-sm">
                      <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                      <span>{vehicle.rating}</span>
                    </div>
                  </div>
                </div>

                {/* Details */}
                <div className="space-y-2 text-sm mb-4 pb-4 border-b border-gray-100">
                  {formData.startDate && formData.endDate && (
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-gray-400" />
                      <span>
                        {new Date(formData.startDate).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })} - {new Date(formData.endDate).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}
                      </span>
                    </div>
                  )}
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-gray-400" />
                    <span>{calculateDays()} day{calculateDays() > 1 ? 's' : ''}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <User className="w-4 h-4 text-gray-400" />
                    <span>{formData.withDriver ? 'With Driver' : 'Self Drive'}</span>
                  </div>
                  {formData.deliveryType !== 'self_pickup' && (
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-gray-400" />
                      <span>{DELIVERY_OPTIONS.find(d => d.id === formData.deliveryType)?.name}</span>
                    </div>
                  )}
                  {formData.insurancePackage !== 'none' && (
                    <div className="flex items-center gap-2">
                      <Shield className="w-4 h-4 text-gray-400" />
                      <span>{INSURANCE_PACKAGES.find(p => p.id === formData.insurancePackage)?.name}</span>
                    </div>
                  )}
                </div>

                {/* Pricing */}
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">
                      Rental ({pricing.days} day{pricing.days > 1 ? 's' : ''})
                    </span>
                    <span>${pricing.rentalCost}</span>
                  </div>
                  
                  {pricing.insuranceCost > 0 && (
                    <div className="flex justify-between text-gray-600">
                      <span>Protection Plan</span>
                      <span>${pricing.insuranceCost}</span>
                    </div>
                  )}
                  
                  {pricing.deliveryFee > 0 && (
                    <div className="flex justify-between text-gray-600">
                      <span>Delivery</span>
                      <span>${pricing.deliveryFee}</span>
                    </div>
                  )}
                  
                  {pricing.servicesCost > 0 && (
                    <div className="flex justify-between text-gray-600">
                      <span>Add-on Services</span>
                      <span>${pricing.servicesCost}</span>
                    </div>
                  )}
                  
                  <div className="flex justify-between text-gray-600">
                    <span>Service Fee (10%)</span>
                    <span>${pricing.serviceFee}</span>
                  </div>
                  
                  <div className="flex justify-between pt-2 mt-2 border-t border-gray-100">
                    <span className="text-gray-900 font-medium">Subtotal</span>
                    <span className="font-medium">${pricing.subtotal}</span>
                  </div>
                  
                  <div className="flex justify-between text-gray-600">
                    <span>Security Deposit</span>
                    <span>${pricing.securityDeposit}</span>
                  </div>
                  
                  <div className="flex justify-between pt-3 mt-3 border-t border-gray-200 font-bold text-base">
                    <span>Total</span>
                    <span className="text-amber-600">${pricing.grandTotal}</span>
                  </div>
                </div>

                <p className="text-xs text-gray-500 mt-4">
                  Security deposit is refundable upon return of vehicle in good condition.
                </p>
                
                {/* Payment Timeline Info */}
                <div className="mt-4 p-3 bg-green-50 rounded-lg">
                  <div className="flex items-center gap-2 text-green-800 text-xs">
                    <Info className="w-4 h-4" />
                    <span className="font-medium">Owner Payout Schedule</span>
                  </div>
                  <div className="text-xs text-green-700 mt-1">
                    50% within 6 hours of pickup, 50% after 72 hours
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <Footer />
      </div>
    </>
  );
};

export default VehicleBooking;
