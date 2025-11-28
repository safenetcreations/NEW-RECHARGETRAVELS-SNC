import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link, useNavigate } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { 
  Car, 
  ArrowLeft, 
  ArrowRight,
  Check,
  Upload,
  Camera,
  FileText,
  DollarSign,
  MapPin,
  Settings,
  Info,
  Plus,
  X,
  AlertCircle,
  Fuel,
  Users,
  Calendar
} from 'lucide-react';
import type { VehicleType, FuelType, TransmissionType } from '@/types/vehicleRental';

const vehicleTypes: { value: VehicleType; label: string; icon: string }[] = [
  { value: 'sedan', label: 'Sedan', icon: '🚗' },
  { value: 'suv', label: 'SUV', icon: '🚙' },
  { value: 'van', label: 'Van', icon: '🚐' },
  { value: 'mini-coach', label: 'Mini Coach', icon: '🚌' },
  { value: 'luxury', label: 'Luxury', icon: '🏎️' },
  { value: 'hatchback', label: 'Hatchback', icon: '🚘' },
  { value: 'convertible', label: 'Convertible', icon: '🏁' },
  { value: 'pickup', label: 'Pickup', icon: '🛻' },
];

const fuelTypes: { value: FuelType; label: string }[] = [
  { value: 'petrol', label: 'Petrol' },
  { value: 'diesel', label: 'Diesel' },
  { value: 'hybrid', label: 'Hybrid' },
  { value: 'electric', label: 'Electric' },
];

const transmissionTypes: { value: TransmissionType; label: string }[] = [
  { value: 'automatic', label: 'Automatic' },
  { value: 'manual', label: 'Manual' },
  { value: 'semi-automatic', label: 'Semi-Automatic' },
];

const amenitiesList = [
  { key: 'airConditioning', label: 'Air Conditioning' },
  { key: 'wifi', label: 'WiFi' },
  { key: 'bluetooth', label: 'Bluetooth' },
  { key: 'usbCharging', label: 'USB Charging' },
  { key: 'gps', label: 'GPS Navigation' },
  { key: 'childSeat', label: 'Child Seat Available' },
  { key: 'sunroof', label: 'Sunroof' },
  { key: 'backupCamera', label: 'Backup Camera' },
  { key: 'parkingSensors', label: 'Parking Sensors' },
  { key: 'cruiseControl', label: 'Cruise Control' },
];

const cities = [
  'Colombo', 'Kandy', 'Galle', 'Negombo', 'Ella', 'Nuwara Eliya',
  'Trincomalee', 'Jaffna', 'Anuradhapura', 'Polonnaruwa', 'Sigiriya',
  'Dambulla', 'Bentota', 'Mirissa', 'Hikkaduwa', 'Unawatuna'
];

const steps = [
  { id: 1, title: 'Vehicle Type', icon: Car },
  { id: 2, title: 'Vehicle Details', icon: Settings },
  { id: 3, title: 'Features', icon: Info },
  { id: 4, title: 'Photos', icon: Camera },
  { id: 5, title: 'Documents', icon: FileText },
  { id: 6, title: 'Location', icon: MapPin },
  { id: 7, title: 'Pricing', icon: DollarSign },
];

const ListVehicle = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form data
  const [formData, setFormData] = useState({
    // Step 1: Vehicle Type
    vehicleType: '' as VehicleType | '',
    
    // Step 2: Vehicle Details
    make: '',
    model: '',
    year: new Date().getFullYear(),
    color: '',
    registrationNumber: '',
    engineCapacity: '',
    mileage: '',
    fuelType: '' as FuelType | '',
    transmission: '' as TransmissionType | '',
    seatingCapacity: 5,
    luggageCapacity: 3,
    
    // Step 3: Features
    features: [] as string[],
    amenities: {} as Record<string, boolean>,
    
    // Step 4: Photos
    photos: [] as File[],
    photoPreview: [] as string[],
    
    // Step 5: Documents
    registration: null as File | null,
    insurance: null as File | null,
    revenueLicense: null as File | null,
    
    // Step 6: Location
    serviceAreas: [] as string[],
    pickupAddress: '',
    pickupCity: '',
    deliveryAvailable: false,
    deliveryFee: 0,
    
    // Step 7: Pricing
    hourlyRate: 0,
    dailyRate: 0,
    weeklyRate: 0,
    monthlyRate: 0,
    yearlyRate: 0,
    withDriverHourlyRate: 0,
    withDriverDailyRate: 0,
    securityDeposit: 0,
    mileageLimit: 0,
    extraMileageCharge: 0,
  });

  const updateFormData = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      const newPhotos = Array.from(files);
      const newPreviews = newPhotos.map(file => URL.createObjectURL(file));
      setFormData(prev => ({
        ...prev,
        photos: [...prev.photos, ...newPhotos],
        photoPreview: [...prev.photoPreview, ...newPreviews]
      }));
    }
  };

  const removePhoto = (index: number) => {
    setFormData(prev => ({
      ...prev,
      photos: prev.photos.filter((_, i) => i !== index),
      photoPreview: prev.photoPreview.filter((_, i) => i !== index)
    }));
  };

  const handleDocumentUpload = (docType: 'registration' | 'insurance' | 'revenueLicense', file: File) => {
    setFormData(prev => ({ ...prev, [docType]: file }));
  };

  const toggleServiceArea = (city: string) => {
    setFormData(prev => ({
      ...prev,
      serviceAreas: prev.serviceAreas.includes(city)
        ? prev.serviceAreas.filter(c => c !== city)
        : [...prev.serviceAreas, city]
    }));
  };

  const toggleAmenity = (key: string) => {
    setFormData(prev => ({
      ...prev,
      amenities: { ...prev.amenities, [key]: !prev.amenities[key] }
    }));
  };

  const canProceed = () => {
    switch (currentStep) {
      case 1: return !!formData.vehicleType;
      case 2: return formData.make && formData.model && formData.registrationNumber && formData.fuelType && formData.transmission;
      case 3: return true;
      case 4: return formData.photos.length >= 3;
      case 5: return formData.registration && formData.insurance;
      case 6: return formData.serviceAreas.length > 0 && formData.pickupAddress;
      case 7: return formData.dailyRate > 0;
      default: return true;
    }
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));
    setIsSubmitting(false);
    navigate('/vehicle-rental/owner-dashboard');
  };

  return (
    <>
      <Helmet>
        <title>List Your Vehicle | Vehicle Rental | Recharge Travels</title>
        <meta name="description" content="List your vehicle for rent on Recharge Travels and start earning today." />
      </Helmet>

      <Header />

      <div className="min-h-screen bg-gray-50 pt-20">
        {/* Header */}
        <div className="bg-gradient-to-r from-slate-900 to-slate-800 py-6">
          <div className="max-w-4xl mx-auto px-4 sm:px-6">
            <Link to="/vehicle-rental/owner-dashboard" className="inline-flex items-center gap-2 text-gray-300 hover:text-white mb-4 transition-colors">
              <ArrowLeft className="w-4 h-4" />
              Back to Dashboard
            </Link>
            <h1 className="text-2xl font-bold text-white">List Your Vehicle</h1>
            <p className="text-gray-300 text-sm">Complete the form to list your vehicle for rent</p>
          </div>
        </div>

        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6">
          {/* Progress Steps */}
          <div className="bg-white rounded-2xl shadow-sm p-4 mb-6 overflow-x-auto">
            <div className="flex items-center min-w-max">
              {steps.map((step, index) => (
                <React.Fragment key={step.id}>
                  <button
                    onClick={() => step.id < currentStep && setCurrentStep(step.id)}
                    className={`flex flex-col items-center min-w-[80px] ${
                      step.id < currentStep ? 'cursor-pointer' : 'cursor-default'
                    }`}
                  >
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
                    <span className={`mt-2 text-xs font-medium ${
                      step.id === currentStep ? 'text-amber-600' : 'text-gray-500'
                    }`}>
                      {step.title}
                    </span>
                  </button>
                  {index < steps.length - 1 && (
                    <div className={`flex-1 h-0.5 mx-2 ${
                      step.id < currentStep ? 'bg-green-500' : 'bg-gray-200'
                    }`} />
                  )}
                </React.Fragment>
              ))}
            </div>
          </div>

          {/* Form Content */}
          <div className="bg-white rounded-2xl shadow-sm p-6">
            {/* Step 1: Vehicle Type */}
            {currentStep === 1 && (
              <div>
                <h2 className="text-xl font-bold text-gray-900 mb-2">Select Vehicle Type</h2>
                <p className="text-gray-600 mb-6">Choose the category that best describes your vehicle</p>
                
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  {vehicleTypes.map(type => (
                    <button
                      key={type.value}
                      onClick={() => updateFormData('vehicleType', type.value)}
                      className={`p-4 rounded-xl border-2 transition-all ${
                        formData.vehicleType === type.value
                          ? 'border-amber-500 bg-amber-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div className="text-4xl mb-2">{type.icon}</div>
                      <div className="font-medium text-gray-900">{type.label}</div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Step 2: Vehicle Details */}
            {currentStep === 2 && (
              <div>
                <h2 className="text-xl font-bold text-gray-900 mb-2">Vehicle Details</h2>
                <p className="text-gray-600 mb-6">Enter your vehicle's information</p>
                
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Make *</label>
                    <input
                      type="text"
                      value={formData.make}
                      onChange={(e) => updateFormData('make', e.target.value)}
                      placeholder="e.g., Toyota"
                      className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-amber-400/50 focus:border-amber-400"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Model *</label>
                    <input
                      type="text"
                      value={formData.model}
                      onChange={(e) => updateFormData('model', e.target.value)}
                      placeholder="e.g., Prius"
                      className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-amber-400/50 focus:border-amber-400"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Year *</label>
                    <input
                      type="number"
                      value={formData.year}
                      onChange={(e) => updateFormData('year', parseInt(e.target.value))}
                      min={2000}
                      max={new Date().getFullYear() + 1}
                      className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-amber-400/50 focus:border-amber-400"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Color</label>
                    <input
                      type="text"
                      value={formData.color}
                      onChange={(e) => updateFormData('color', e.target.value)}
                      placeholder="e.g., White"
                      className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-amber-400/50 focus:border-amber-400"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Registration Number *</label>
                    <input
                      type="text"
                      value={formData.registrationNumber}
                      onChange={(e) => updateFormData('registrationNumber', e.target.value.toUpperCase())}
                      placeholder="e.g., CAB-1234"
                      className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-amber-400/50 focus:border-amber-400"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Engine Capacity (cc)</label>
                    <input
                      type="number"
                      value={formData.engineCapacity}
                      onChange={(e) => updateFormData('engineCapacity', e.target.value)}
                      placeholder="e.g., 1800"
                      className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-amber-400/50 focus:border-amber-400"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Fuel Type *</label>
                    <select
                      value={formData.fuelType}
                      onChange={(e) => updateFormData('fuelType', e.target.value)}
                      className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-amber-400/50 focus:border-amber-400"
                    >
                      <option value="">Select fuel type</option>
                      {fuelTypes.map(type => (
                        <option key={type.value} value={type.value}>{type.label}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Transmission *</label>
                    <select
                      value={formData.transmission}
                      onChange={(e) => updateFormData('transmission', e.target.value)}
                      className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-amber-400/50 focus:border-amber-400"
                    >
                      <option value="">Select transmission</option>
                      {transmissionTypes.map(type => (
                        <option key={type.value} value={type.value}>{type.label}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Seating Capacity</label>
                    <input
                      type="number"
                      value={formData.seatingCapacity}
                      onChange={(e) => updateFormData('seatingCapacity', parseInt(e.target.value))}
                      min={2}
                      max={50}
                      className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-amber-400/50 focus:border-amber-400"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Luggage Capacity (bags)</label>
                    <input
                      type="number"
                      value={formData.luggageCapacity}
                      onChange={(e) => updateFormData('luggageCapacity', parseInt(e.target.value))}
                      min={0}
                      max={20}
                      className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-amber-400/50 focus:border-amber-400"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Step 3: Features */}
            {currentStep === 3 && (
              <div>
                <h2 className="text-xl font-bold text-gray-900 mb-2">Features & Amenities</h2>
                <p className="text-gray-600 mb-6">Select the features available in your vehicle</p>
                
                <div className="grid sm:grid-cols-2 gap-3">
                  {amenitiesList.map(amenity => (
                    <label
                      key={amenity.key}
                      className={`flex items-center gap-3 p-3 rounded-lg border-2 cursor-pointer transition-all ${
                        formData.amenities[amenity.key]
                          ? 'border-amber-500 bg-amber-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={formData.amenities[amenity.key] || false}
                        onChange={() => toggleAmenity(amenity.key)}
                        className="w-4 h-4 rounded border-gray-300 text-amber-500 focus:ring-amber-400/50"
                      />
                      <span className="text-gray-900">{amenity.label}</span>
                    </label>
                  ))}
                </div>

                <div className="mt-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Additional Features (Optional)</label>
                  <input
                    type="text"
                    placeholder="e.g., Dashcam, First Aid Kit, Fire Extinguisher (comma separated)"
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-amber-400/50 focus:border-amber-400"
                    onChange={(e) => updateFormData('features', e.target.value.split(',').map(f => f.trim()).filter(Boolean))}
                  />
                </div>
              </div>
            )}

            {/* Step 4: Photos */}
            {currentStep === 4 && (
              <div>
                <h2 className="text-xl font-bold text-gray-900 mb-2">Vehicle Photos</h2>
                <p className="text-gray-600 mb-6">Upload at least 3 high-quality photos of your vehicle</p>
                
                <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center mb-6 hover:border-amber-400 transition-colors">
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handlePhotoUpload}
                    className="hidden"
                    id="photo-upload"
                  />
                  <label htmlFor="photo-upload" className="cursor-pointer">
                    <Camera className="w-12 h-12 mx-auto text-gray-400 mb-3" />
                    <div className="font-medium text-gray-900 mb-1">Click to upload photos</div>
                    <div className="text-sm text-gray-500">PNG, JPG up to 10MB each</div>
                  </label>
                </div>

                {formData.photoPreview.length > 0 && (
                  <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
                    {formData.photoPreview.map((preview, index) => (
                      <div key={index} className="relative group">
                        <img
                          src={preview}
                          alt={`Vehicle photo ${index + 1}`}
                          className="w-full aspect-[4/3] object-cover rounded-lg"
                        />
                        <button
                          onClick={() => removePhoto(index)}
                          className="absolute top-2 right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <X className="w-4 h-4" />
                        </button>
                        {index === 0 && (
                          <span className="absolute bottom-2 left-2 px-2 py-0.5 bg-amber-500 text-white text-xs rounded-full">
                            Primary
                          </span>
                        )}
                      </div>
                    ))}
                  </div>
                )}

                {formData.photos.length < 3 && (
                  <div className="flex items-center gap-2 mt-4 p-3 bg-amber-50 rounded-lg text-amber-700">
                    <AlertCircle className="w-5 h-5 flex-shrink-0" />
                    <span className="text-sm">Please upload at least 3 photos ({formData.photos.length}/3)</span>
                  </div>
                )}
              </div>
            )}

            {/* Step 5: Documents */}
            {currentStep === 5 && (
              <div>
                <h2 className="text-xl font-bold text-gray-900 mb-2">Vehicle Documents</h2>
                <p className="text-gray-600 mb-6">Upload your vehicle documents for verification</p>
                
                <div className="space-y-4">
                  {[
                    { key: 'registration', label: 'Vehicle Registration (CR)', required: true },
                    { key: 'insurance', label: 'Insurance Certificate', required: true },
                    { key: 'revenueLicense', label: 'Revenue License', required: false },
                  ].map(doc => (
                    <div key={doc.key} className="border border-gray-200 rounded-xl p-4">
                      <div className="flex items-center justify-between mb-3">
                        <div>
                          <span className="font-medium text-gray-900">{doc.label}</span>
                          {doc.required && <span className="text-red-500 ml-1">*</span>}
                        </div>
                        {(formData as any)[doc.key] && (
                          <span className="flex items-center gap-1 text-green-600 text-sm">
                            <Check className="w-4 h-4" />
                            Uploaded
                          </span>
                        )}
                      </div>
                      
                      <input
                        type="file"
                        accept=".pdf,.jpg,.jpeg,.png"
                        onChange={(e) => e.target.files?.[0] && handleDocumentUpload(doc.key as any, e.target.files[0])}
                        className="hidden"
                        id={`doc-${doc.key}`}
                      />
                      <label
                        htmlFor={`doc-${doc.key}`}
                        className={`flex items-center justify-center gap-2 px-4 py-3 rounded-lg cursor-pointer transition-all ${
                          (formData as any)[doc.key]
                            ? 'bg-green-50 border border-green-200 text-green-700'
                            : 'bg-gray-50 border border-gray-200 text-gray-600 hover:bg-gray-100'
                        }`}
                      >
                        <Upload className="w-4 h-4" />
                        {(formData as any)[doc.key] ? 'Change File' : 'Upload Document'}
                      </label>
                    </div>
                  ))}
                </div>

                <div className="mt-6 p-4 bg-blue-50 rounded-xl">
                  <div className="flex gap-3">
                    <Info className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                    <div className="text-sm text-blue-800">
                      <p className="font-medium mb-1">Document Verification</p>
                      <p>Our team will verify your documents within 24-48 hours. Once verified, your vehicle will be visible to customers.</p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Step 6: Location */}
            {currentStep === 6 && (
              <div>
                <h2 className="text-xl font-bold text-gray-900 mb-2">Service Locations</h2>
                <p className="text-gray-600 mb-6">Select areas where you can provide the vehicle</p>
                
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Service Areas *</label>
                  <div className="flex flex-wrap gap-2">
                    {cities.map(city => (
                      <button
                        key={city}
                        onClick={() => toggleServiceArea(city)}
                        className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all ${
                          formData.serviceAreas.includes(city)
                            ? 'bg-amber-500 text-white'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                      >
                        {city}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="grid sm:grid-cols-2 gap-4 mb-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Pickup Address *</label>
                    <input
                      type="text"
                      value={formData.pickupAddress}
                      onChange={(e) => updateFormData('pickupAddress', e.target.value)}
                      placeholder="Enter pickup location address"
                      className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-amber-400/50 focus:border-amber-400"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Pickup City</label>
                    <select
                      value={formData.pickupCity}
                      onChange={(e) => updateFormData('pickupCity', e.target.value)}
                      className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-amber-400/50 focus:border-amber-400"
                    >
                      <option value="">Select city</option>
                      {cities.map(city => (
                        <option key={city} value={city}>{city}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="p-4 border border-gray-200 rounded-xl">
                  <label className="flex items-center gap-3 cursor-pointer mb-4">
                    <input
                      type="checkbox"
                      checked={formData.deliveryAvailable}
                      onChange={(e) => updateFormData('deliveryAvailable', e.target.checked)}
                      className="w-4 h-4 rounded border-gray-300 text-amber-500 focus:ring-amber-400/50"
                    />
                    <span className="font-medium text-gray-900">Offer vehicle delivery to customer location</span>
                  </label>
                  
                  {formData.deliveryAvailable && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Delivery Fee (USD)</label>
                      <input
                        type="number"
                        value={formData.deliveryFee}
                        onChange={(e) => updateFormData('deliveryFee', parseInt(e.target.value))}
                        placeholder="e.g., 5"
                        className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-amber-400/50 focus:border-amber-400"
                      />
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Step 7: Pricing */}
            {currentStep === 7 && (
              <div>
                <h2 className="text-xl font-bold text-gray-900 mb-2">Pricing</h2>
                <p className="text-gray-600 mb-6">Set competitive rates for your vehicle</p>
                
                <div className="space-y-6">
                  <div>
                    <h3 className="font-medium text-gray-900 mb-3">Self-Drive Rates</h3>
                    <div className="grid sm:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Hourly Rate (USD)</label>
                        <input
                          type="number"
                          value={formData.hourlyRate || ''}
                          onChange={(e) => updateFormData('hourlyRate', parseInt(e.target.value))}
                          placeholder="e.g., 4"
                          className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-amber-400/50 focus:border-amber-400"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Daily Rate (USD) *</label>
                        <input
                          type="number"
                          value={formData.dailyRate || ''}
                          onChange={(e) => updateFormData('dailyRate', parseInt(e.target.value))}
                          placeholder="e.g., 28"
                          className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-amber-400/50 focus:border-amber-400"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Weekly Rate (USD)</label>
                        <input
                          type="number"
                          value={formData.weeklyRate || ''}
                          onChange={(e) => updateFormData('weeklyRate', parseInt(e.target.value))}
                          placeholder="e.g., 180"
                          className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-amber-400/50 focus:border-amber-400"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Monthly Rate (USD)</label>
                        <input
                          type="number"
                          value={formData.monthlyRate || ''}
                          onChange={(e) => updateFormData('monthlyRate', parseInt(e.target.value))}
                          placeholder="e.g., 600"
                          className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-amber-400/50 focus:border-amber-400"
                        />
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="font-medium text-gray-900 mb-3">With Driver Rates (Optional)</h3>
                    <div className="grid sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Hourly Rate with Driver (USD)</label>
                        <input
                          type="number"
                          value={formData.withDriverHourlyRate || ''}
                          onChange={(e) => updateFormData('withDriverHourlyRate', parseInt(e.target.value))}
                          placeholder="e.g., 7"
                          className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-amber-400/50 focus:border-amber-400"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Daily Rate with Driver (USD)</label>
                        <input
                          type="number"
                          value={formData.withDriverDailyRate || ''}
                          onChange={(e) => updateFormData('withDriverDailyRate', parseInt(e.target.value))}
                          placeholder="e.g., 40"
                          className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-amber-400/50 focus:border-amber-400"
                        />
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="font-medium text-gray-900 mb-3">Additional Charges</h3>
                    <div className="grid sm:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Security Deposit (USD)</label>
                        <input
                          type="number"
                          value={formData.securityDeposit || ''}
                          onChange={(e) => updateFormData('securityDeposit', parseInt(e.target.value))}
                          placeholder="e.g., 85"
                          className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-amber-400/50 focus:border-amber-400"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Daily Mileage Limit (km)</label>
                        <input
                          type="number"
                          value={formData.mileageLimit || ''}
                          onChange={(e) => updateFormData('mileageLimit', parseInt(e.target.value))}
                          placeholder="e.g., 150"
                          className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-amber-400/50 focus:border-amber-400"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Extra Mileage Charge (Rs/km)</label>
                        <input
                          type="number"
                          value={formData.extraMileageCharge || ''}
                          onChange={(e) => updateFormData('extraMileageCharge', parseInt(e.target.value))}
                          placeholder="e.g., 50"
                          className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-amber-400/50 focus:border-amber-400"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-6 p-4 bg-green-50 rounded-xl">
                  <div className="flex gap-3">
                    <DollarSign className="w-5 h-5 text-green-600 flex-shrink-0" />
                    <div className="text-sm text-green-800">
                      <p className="font-medium mb-1">Your Earnings</p>
                      <p>You will receive 85% of the rental amount. Our platform commission is 15%.</p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Navigation Buttons */}
            <div className="flex items-center justify-between mt-8 pt-6 border-t border-gray-100">
              <button
                onClick={() => setCurrentStep(prev => prev - 1)}
                disabled={currentStep === 1}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all ${
                  currentStep === 1
                    ? 'text-gray-300 cursor-not-allowed'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <ArrowLeft className="w-4 h-4" />
                Previous
              </button>
              
              {currentStep < steps.length ? (
                <button
                  onClick={() => setCurrentStep(prev => prev + 1)}
                  disabled={!canProceed()}
                  className={`flex items-center gap-2 px-6 py-2.5 rounded-lg font-medium transition-all ${
                    canProceed()
                      ? 'bg-amber-500 text-white hover:bg-amber-600'
                      : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                  }`}
                >
                  Next
                  <ArrowRight className="w-4 h-4" />
                </button>
              ) : (
                <button
                  onClick={handleSubmit}
                  disabled={!canProceed() || isSubmitting}
                  className={`flex items-center gap-2 px-6 py-2.5 rounded-lg font-medium transition-all ${
                    canProceed() && !isSubmitting
                      ? 'bg-green-500 text-white hover:bg-green-600'
                      : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                  }`}
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Submitting...
                    </>
                  ) : (
                    <>
                      <Check className="w-4 h-4" />
                      Submit for Review
                    </>
                  )}
                </button>
              )}
            </div>
          </div>
        </div>

        <Footer />
      </div>
    </>
  );
};

export default ListVehicle;
