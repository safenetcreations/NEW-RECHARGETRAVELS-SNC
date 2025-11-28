import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link, useNavigate } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { 
  Car, 
  User, 
  Phone, 
  Mail, 
  MapPin,
  FileText,
  Upload,
  CheckCircle,
  AlertCircle,
  DollarSign,
  Shield,
  Clock,
  ArrowRight,
  ChevronRight,
  Building2,
  CreditCard,
  Camera,
  X
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { collection, doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { db, auth } from '@/lib/firebase';
import { useAuth } from '@/hooks/useAuth';

interface OwnerFormData {
  // Personal Details
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  whatsapp: string;
  
  // Address
  address: string;
  city: string;
  district: string;
  postalCode: string;
  
  // Business Details
  businessName?: string;
  businessRegistration?: string;
  taxNumber?: string;
  
  // Bank Details
  bankName: string;
  accountName: string;
  accountNumber: string;
  branchCode: string;
  
  // Documents
  nationalIdFront?: File;
  nationalIdBack?: File;
  drivingLicenseFront?: File;
  drivingLicenseBack?: File;
  businessLicense?: File;
  
  // Terms
  agreeTerms: boolean;
  agreeCommission: boolean;
}

const DISTRICTS = [
  'Colombo', 'Gampaha', 'Kalutara', 'Kandy', 'Matale', 'Nuwara Eliya',
  'Galle', 'Matara', 'Hambantota', 'Jaffna', 'Kilinochchi', 'Mannar',
  'Mullaitivu', 'Vavuniya', 'Trincomalee', 'Batticaloa', 'Ampara',
  'Kurunegala', 'Puttalam', 'Anuradhapura', 'Polonnaruwa', 'Badulla',
  'Monaragala', 'Ratnapura', 'Kegalle'
];

const SRI_LANKAN_BANKS = [
  'Bank of Ceylon',
  'People\'s Bank',
  'Commercial Bank of Ceylon',
  'Hatton National Bank',
  'Sampath Bank',
  'Seylan Bank',
  'Nations Trust Bank',
  'DFCC Bank',
  'National Savings Bank',
  'National Development Bank',
  'Pan Asia Banking Corporation',
  'Union Bank of Colombo',
  'Amana Bank',
  'Cargills Bank'
];

const OwnerRegister: React.FC = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useAuth();
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [formData, setFormData] = useState<OwnerFormData>({
    firstName: '',
    lastName: '',
    email: user?.email || '',
    phone: '',
    whatsapp: '',
    address: '',
    city: '',
    district: '',
    postalCode: '',
    businessName: '',
    businessRegistration: '',
    taxNumber: '',
    bankName: '',
    accountName: '',
    accountNumber: '',
    branchCode: '',
    agreeTerms: false,
    agreeCommission: false
  });

  const [documentPreviews, setDocumentPreviews] = useState<{[key: string]: string}>({});

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    if (type === 'checkbox') {
      setFormData(prev => ({ ...prev, [name]: (e.target as HTMLInputElement).checked }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, fieldName: string) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData(prev => ({ ...prev, [fieldName]: file }));
      
      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setDocumentPreviews(prev => ({ ...prev, [fieldName]: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  const removeDocument = (fieldName: string) => {
    setFormData(prev => ({ ...prev, [fieldName]: undefined }));
    setDocumentPreviews(prev => {
      const newPreviews = { ...prev };
      delete newPreviews[fieldName];
      return newPreviews;
    });
  };

  const validateStep = (step: number): boolean => {
    switch (step) {
      case 1:
        if (!formData.firstName || !formData.lastName || !formData.email || !formData.phone) {
          toast({ title: 'Error', description: 'Please fill in all required personal details', variant: 'destructive' });
          return false;
        }
        return true;
      case 2:
        if (!formData.address || !formData.city || !formData.district) {
          toast({ title: 'Error', description: 'Please fill in all required address details', variant: 'destructive' });
          return false;
        }
        return true;
      case 3:
        if (!formData.bankName || !formData.accountName || !formData.accountNumber) {
          toast({ title: 'Error', description: 'Please fill in all required bank details', variant: 'destructive' });
          return false;
        }
        return true;
      case 4:
        if (!formData.nationalIdFront || !formData.nationalIdBack) {
          toast({ title: 'Error', description: 'Please upload your National ID (front and back)', variant: 'destructive' });
          return false;
        }
        return true;
      case 5:
        if (!formData.agreeTerms || !formData.agreeCommission) {
          toast({ title: 'Error', description: 'Please agree to the terms and commission structure', variant: 'destructive' });
          return false;
        }
        return true;
      default:
        return true;
    }
  };

  const nextStep = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => Math.min(prev + 1, 5));
    }
  };

  const prevStep = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
  };

  const handleSubmit = async () => {
    if (!validateStep(5)) return;
    
    setIsSubmitting(true);
    
    try {
      const userId = auth.currentUser?.uid;
      if (!userId) {
        toast({ title: 'Error', description: 'Please log in to register as an owner', variant: 'destructive' });
        navigate('/login');
        return;
      }

      // Create owner profile in Firestore
      const ownerData = {
        userId,
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        phone: formData.phone,
        whatsapp: formData.whatsapp || formData.phone,
        address: {
          street: formData.address,
          city: formData.city,
          district: formData.district,
          postalCode: formData.postalCode
        },
        business: formData.businessName ? {
          name: formData.businessName,
          registration: formData.businessRegistration,
          taxNumber: formData.taxNumber
        } : null,
        bankDetails: {
          bankName: formData.bankName,
          accountName: formData.accountName,
          accountNumber: formData.accountNumber,
          branchCode: formData.branchCode
        },
        verificationStatus: 'pending_verification',
        documentsSubmitted: {
          nationalId: true,
          drivingLicense: !!formData.drivingLicenseFront,
          businessLicense: !!formData.businessLicense
        },
        commission: {
          baseRate: 15, // 15% platform commission
          insuranceRate: 15, // Average insurance commission
          deliveryRate: 100 // 100% delivery revenue to owner
        },
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
        status: 'active',
        totalVehicles: 0,
        totalEarnings: 0,
        rating: 0,
        reviewCount: 0
      };

      await setDoc(doc(db, 'vehicle_owners', userId), ownerData);

      toast({
        title: 'Registration Successful!',
        description: 'Your owner account has been created. You can now list your vehicles.',
      });

      navigate('/vehicle-rental/owner-dashboard');
    } catch (error) {
      console.error('Registration error:', error);
      toast({
        title: 'Registration Failed',
        description: 'There was an error creating your account. Please try again.',
        variant: 'destructive'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const steps = [
    { number: 1, title: 'Personal Info', icon: User },
    { number: 2, title: 'Address', icon: MapPin },
    { number: 3, title: 'Bank Details', icon: CreditCard },
    { number: 4, title: 'Documents', icon: FileText },
    { number: 5, title: 'Review', icon: CheckCircle }
  ];

  return (
    <>
      <Helmet>
        <title>Register as Vehicle Owner | Recharge Travels</title>
        <meta name="description" content="Register as a vehicle owner on Recharge Travels and start earning by renting your car to tourists. Easy registration, verified renters, secure payments." />
      </Helmet>

      <Header />

      <main className="min-h-screen bg-gradient-to-b from-purple-50 to-white pt-20">
        {/* Hero Section */}
        <section className="bg-gradient-to-r from-purple-600 to-indigo-700 text-white py-12">
          <div className="max-w-7xl mx-auto px-4">
            <div className="text-center">
              <h1 className="text-3xl md:text-4xl font-bold mb-4">
                Become a Vehicle Owner Partner
              </h1>
              <p className="text-lg text-purple-100 max-w-2xl mx-auto">
                Join our platform and start earning by renting your vehicle to verified international tourists. 
                Secure payments, comprehensive insurance, and 24/7 support.
              </p>
            </div>
          </div>
        </section>

        {/* Benefits Strip */}
        <section className="bg-white border-b py-6">
          <div className="max-w-7xl mx-auto px-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
                  <DollarSign className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <p className="font-semibold text-gray-900">Earn USD</p>
                  <p className="text-xs text-gray-500">Payments in US Dollars</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                  <Shield className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <p className="font-semibold text-gray-900">Full Protection</p>
                  <p className="text-xs text-gray-500">Comprehensive insurance</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center">
                  <Clock className="w-5 h-5 text-purple-600" />
                </div>
                <div>
                  <p className="font-semibold text-gray-900">Fast Payouts</p>
                  <p className="text-xs text-gray-500">50% within 24 hours</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center">
                  <Car className="w-5 h-5 text-orange-600" />
                </div>
                <div>
                  <p className="font-semibold text-gray-900">Low Commission</p>
                  <p className="text-xs text-gray-500">Only 15% platform fee</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Registration Form */}
        <section className="py-12">
          <div className="max-w-3xl mx-auto px-4">
            {/* Progress Steps */}
            <div className="mb-8">
              <div className="flex items-center justify-between">
                {steps.map((step, index) => (
                  <React.Fragment key={step.number}>
                    <div className="flex flex-col items-center">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                        currentStep >= step.number 
                          ? 'bg-purple-600 text-white' 
                          : 'bg-gray-200 text-gray-500'
                      }`}>
                        {currentStep > step.number ? (
                          <CheckCircle className="w-5 h-5" />
                        ) : (
                          <step.icon className="w-5 h-5" />
                        )}
                      </div>
                      <span className={`text-xs mt-1 hidden md:block ${
                        currentStep >= step.number ? 'text-purple-600 font-medium' : 'text-gray-500'
                      }`}>
                        {step.title}
                      </span>
                    </div>
                    {index < steps.length - 1 && (
                      <div className={`flex-1 h-1 mx-2 rounded ${
                        currentStep > step.number ? 'bg-purple-600' : 'bg-gray-200'
                      }`} />
                    )}
                  </React.Fragment>
                ))}
              </div>
            </div>

            {/* Form Card */}
            <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8">
              {/* Step 1: Personal Information */}
              {currentStep === 1 && (
                <div className="space-y-6">
                  <div>
                    <h2 className="text-xl font-bold text-gray-900 mb-1">Personal Information</h2>
                    <p className="text-gray-500 text-sm">Tell us about yourself</p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="firstName">First Name *</Label>
                      <Input
                        id="firstName"
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleInputChange}
                        placeholder="Enter your first name"
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label htmlFor="lastName">Last Name *</Label>
                      <Input
                        id="lastName"
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleInputChange}
                        placeholder="Enter your last name"
                        className="mt-1"
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="email">Email Address *</Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      placeholder="your@email.com"
                      className="mt-1"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="phone">Phone Number *</Label>
                      <Input
                        id="phone"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        placeholder="+94 77 123 4567"
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label htmlFor="whatsapp">WhatsApp Number</Label>
                      <Input
                        id="whatsapp"
                        name="whatsapp"
                        value={formData.whatsapp}
                        onChange={handleInputChange}
                        placeholder="Same as phone if blank"
                        className="mt-1"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Step 2: Address */}
              {currentStep === 2 && (
                <div className="space-y-6">
                  <div>
                    <h2 className="text-xl font-bold text-gray-900 mb-1">Address Details</h2>
                    <p className="text-gray-500 text-sm">Where can renters pick up vehicles?</p>
                  </div>

                  <div>
                    <Label htmlFor="address">Street Address *</Label>
                    <Textarea
                      id="address"
                      name="address"
                      value={formData.address}
                      onChange={handleInputChange}
                      placeholder="Enter your full street address"
                      className="mt-1"
                      rows={2}
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="city">City *</Label>
                      <Input
                        id="city"
                        name="city"
                        value={formData.city}
                        onChange={handleInputChange}
                        placeholder="e.g., Colombo"
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label htmlFor="district">District *</Label>
                      <select
                        id="district"
                        name="district"
                        value={formData.district}
                        onChange={handleInputChange}
                        className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                      >
                        <option value="">Select District</option>
                        {DISTRICTS.map(district => (
                          <option key={district} value={district}>{district}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="postalCode">Postal Code</Label>
                    <Input
                      id="postalCode"
                      name="postalCode"
                      value={formData.postalCode}
                      onChange={handleInputChange}
                      placeholder="e.g., 00100"
                      className="mt-1 max-w-xs"
                    />
                  </div>

                  {/* Optional Business Details */}
                  <div className="pt-4 border-t">
                    <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                      <Building2 className="w-5 h-5" />
                      Business Details (Optional)
                    </h3>
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="businessName">Business Name</Label>
                        <Input
                          id="businessName"
                          name="businessName"
                          value={formData.businessName}
                          onChange={handleInputChange}
                          placeholder="If registered as a business"
                          className="mt-1"
                        />
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="businessRegistration">Business Registration No.</Label>
                          <Input
                            id="businessRegistration"
                            name="businessRegistration"
                            value={formData.businessRegistration}
                            onChange={handleInputChange}
                            placeholder="BR Number"
                            className="mt-1"
                          />
                        </div>
                        <div>
                          <Label htmlFor="taxNumber">Tax Identification No.</Label>
                          <Input
                            id="taxNumber"
                            name="taxNumber"
                            value={formData.taxNumber}
                            onChange={handleInputChange}
                            placeholder="TIN"
                            className="mt-1"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Step 3: Bank Details */}
              {currentStep === 3 && (
                <div className="space-y-6">
                  <div>
                    <h2 className="text-xl font-bold text-gray-900 mb-1">Bank Details</h2>
                    <p className="text-gray-500 text-sm">Where should we send your earnings?</p>
                  </div>

                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <div className="flex gap-3">
                      <AlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                      <div className="text-sm text-blue-800">
                        <p className="font-medium">Payment Information</p>
                        <p>Payouts are made in USD. You'll receive 50% within 24 hours of booking start, 
                           and the remaining 50% after 72 hours of trip completion.</p>
                      </div>
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="bankName">Bank Name *</Label>
                    <select
                      id="bankName"
                      name="bankName"
                      value={formData.bankName}
                      onChange={handleInputChange}
                      className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                    >
                      <option value="">Select Bank</option>
                      {SRI_LANKAN_BANKS.map(bank => (
                        <option key={bank} value={bank}>{bank}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <Label htmlFor="accountName">Account Holder Name *</Label>
                    <Input
                      id="accountName"
                      name="accountName"
                      value={formData.accountName}
                      onChange={handleInputChange}
                      placeholder="As shown on bank account"
                      className="mt-1"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="accountNumber">Account Number *</Label>
                      <Input
                        id="accountNumber"
                        name="accountNumber"
                        value={formData.accountNumber}
                        onChange={handleInputChange}
                        placeholder="Enter account number"
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label htmlFor="branchCode">Branch Code</Label>
                      <Input
                        id="branchCode"
                        name="branchCode"
                        value={formData.branchCode}
                        onChange={handleInputChange}
                        placeholder="e.g., 001"
                        className="mt-1"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Step 4: Documents */}
              {currentStep === 4 && (
                <div className="space-y-6">
                  <div>
                    <h2 className="text-xl font-bold text-gray-900 mb-1">Document Verification</h2>
                    <p className="text-gray-500 text-sm">Upload required documents for verification</p>
                  </div>

                  {/* National ID */}
                  <div className="space-y-3">
                    <Label className="flex items-center gap-2">
                      <FileText className="w-4 h-4" />
                      National ID Card * (Front & Back)
                    </Label>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {/* Front */}
                      <div>
                        <p className="text-sm text-gray-500 mb-2">Front Side</p>
                        {documentPreviews.nationalIdFront ? (
                          <div className="relative">
                            <img 
                              src={documentPreviews.nationalIdFront} 
                              alt="ID Front" 
                              className="w-full h-32 object-cover rounded-lg border"
                            />
                            <button
                              onClick={() => removeDocument('nationalIdFront')}
                              className="absolute top-2 right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          </div>
                        ) : (
                          <label className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center cursor-pointer hover:border-purple-400 transition-colors block">
                            <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                            <p className="text-sm text-gray-500">Click to upload</p>
                            <input
                              type="file"
                              accept="image/*"
                              onChange={(e) => handleFileChange(e, 'nationalIdFront')}
                              className="hidden"
                            />
                          </label>
                        )}
                      </div>
                      {/* Back */}
                      <div>
                        <p className="text-sm text-gray-500 mb-2">Back Side</p>
                        {documentPreviews.nationalIdBack ? (
                          <div className="relative">
                            <img 
                              src={documentPreviews.nationalIdBack} 
                              alt="ID Back" 
                              className="w-full h-32 object-cover rounded-lg border"
                            />
                            <button
                              onClick={() => removeDocument('nationalIdBack')}
                              className="absolute top-2 right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          </div>
                        ) : (
                          <label className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center cursor-pointer hover:border-purple-400 transition-colors block">
                            <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                            <p className="text-sm text-gray-500">Click to upload</p>
                            <input
                              type="file"
                              accept="image/*"
                              onChange={(e) => handleFileChange(e, 'nationalIdBack')}
                              className="hidden"
                            />
                          </label>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Driving License (Optional) */}
                  <div className="space-y-3">
                    <Label className="flex items-center gap-2">
                      <Camera className="w-4 h-4" />
                      Driving License (Optional)
                    </Label>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-gray-500 mb-2">Front Side</p>
                        {documentPreviews.drivingLicenseFront ? (
                          <div className="relative">
                            <img 
                              src={documentPreviews.drivingLicenseFront} 
                              alt="License Front" 
                              className="w-full h-32 object-cover rounded-lg border"
                            />
                            <button
                              onClick={() => removeDocument('drivingLicenseFront')}
                              className="absolute top-2 right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          </div>
                        ) : (
                          <label className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center cursor-pointer hover:border-purple-400 transition-colors block">
                            <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                            <p className="text-sm text-gray-500">Click to upload</p>
                            <input
                              type="file"
                              accept="image/*"
                              onChange={(e) => handleFileChange(e, 'drivingLicenseFront')}
                              className="hidden"
                            />
                          </label>
                        )}
                      </div>
                      <div>
                        <p className="text-sm text-gray-500 mb-2">Back Side</p>
                        {documentPreviews.drivingLicenseBack ? (
                          <div className="relative">
                            <img 
                              src={documentPreviews.drivingLicenseBack} 
                              alt="License Back" 
                              className="w-full h-32 object-cover rounded-lg border"
                            />
                            <button
                              onClick={() => removeDocument('drivingLicenseBack')}
                              className="absolute top-2 right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          </div>
                        ) : (
                          <label className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center cursor-pointer hover:border-purple-400 transition-colors block">
                            <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                            <p className="text-sm text-gray-500">Click to upload</p>
                            <input
                              type="file"
                              accept="image/*"
                              onChange={(e) => handleFileChange(e, 'drivingLicenseBack')}
                              className="hidden"
                            />
                          </label>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Step 5: Review & Submit */}
              {currentStep === 5 && (
                <div className="space-y-6">
                  <div>
                    <h2 className="text-xl font-bold text-gray-900 mb-1">Review & Submit</h2>
                    <p className="text-gray-500 text-sm">Please review your information before submitting</p>
                  </div>

                  {/* Summary */}
                  <div className="space-y-4">
                    <div className="bg-gray-50 rounded-lg p-4">
                      <h3 className="font-semibold text-gray-900 mb-2">Personal Information</h3>
                      <div className="grid grid-cols-2 gap-2 text-sm">
                        <p className="text-gray-500">Name:</p>
                        <p>{formData.firstName} {formData.lastName}</p>
                        <p className="text-gray-500">Email:</p>
                        <p>{formData.email}</p>
                        <p className="text-gray-500">Phone:</p>
                        <p>{formData.phone}</p>
                      </div>
                    </div>

                    <div className="bg-gray-50 rounded-lg p-4">
                      <h3 className="font-semibold text-gray-900 mb-2">Address</h3>
                      <p className="text-sm">{formData.address}, {formData.city}, {formData.district}</p>
                    </div>

                    <div className="bg-gray-50 rounded-lg p-4">
                      <h3 className="font-semibold text-gray-900 mb-2">Bank Details</h3>
                      <div className="grid grid-cols-2 gap-2 text-sm">
                        <p className="text-gray-500">Bank:</p>
                        <p>{formData.bankName}</p>
                        <p className="text-gray-500">Account:</p>
                        <p>****{formData.accountNumber.slice(-4)}</p>
                      </div>
                    </div>
                  </div>

                  {/* Commission Structure */}
                  <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                    <h3 className="font-semibold text-purple-900 mb-3">Commission Structure</h3>
                    <ul className="space-y-2 text-sm text-purple-800">
                      <li className="flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-purple-600" />
                        <span><strong>15%</strong> platform commission on base rental</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-purple-600" />
                        <span><strong>10%</strong> guest service fee (charged to renter)</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-purple-600" />
                        <span><strong>100%</strong> delivery revenue goes to you</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-purple-600" />
                        <span>Insurance commissions: 10-20% depending on package</span>
                      </li>
                    </ul>
                  </div>

                  {/* Terms & Conditions */}
                  <div className="space-y-3">
                    <label className="flex items-start gap-3 cursor-pointer">
                      <input
                        type="checkbox"
                        name="agreeTerms"
                        checked={formData.agreeTerms}
                        onChange={handleInputChange}
                        className="mt-1 w-4 h-4 text-purple-600 border-gray-300 rounded focus:ring-purple-500"
                      />
                      <span className="text-sm text-gray-600">
                        I agree to the <Link to="/terms" className="text-purple-600 underline">Terms of Service</Link> and{' '}
                        <Link to="/privacy" className="text-purple-600 underline">Privacy Policy</Link>. 
                        I confirm that all information provided is accurate and I have the legal right to rent my vehicle(s).
                      </span>
                    </label>

                    <label className="flex items-start gap-3 cursor-pointer">
                      <input
                        type="checkbox"
                        name="agreeCommission"
                        checked={formData.agreeCommission}
                        onChange={handleInputChange}
                        className="mt-1 w-4 h-4 text-purple-600 border-gray-300 rounded focus:ring-purple-500"
                      />
                      <span className="text-sm text-gray-600">
                        I understand and agree to the commission structure. I acknowledge that platform fees will be 
                        deducted from my earnings before payout.
                      </span>
                    </label>
                  </div>
                </div>
              )}

              {/* Navigation Buttons */}
              <div className="flex justify-between mt-8 pt-6 border-t">
                {currentStep > 1 ? (
                  <Button variant="outline" onClick={prevStep}>
                    Back
                  </Button>
                ) : (
                  <Link to="/vehicle-rental">
                    <Button variant="outline">Cancel</Button>
                  </Link>
                )}

                {currentStep < 5 ? (
                  <Button onClick={nextStep} className="bg-purple-600 hover:bg-purple-700">
                    Continue <ChevronRight className="w-4 h-4 ml-1" />
                  </Button>
                ) : (
                  <Button 
                    onClick={handleSubmit} 
                    disabled={isSubmitting || !formData.agreeTerms || !formData.agreeCommission}
                    className="bg-green-600 hover:bg-green-700"
                  >
                    {isSubmitting ? (
                      <>
                        <span className="animate-spin mr-2">⏳</span>
                        Submitting...
                      </>
                    ) : (
                      <>
                        Complete Registration <CheckCircle className="w-4 h-4 ml-1" />
                      </>
                    )}
                  </Button>
                )}
              </div>
            </div>

            {/* Help Section */}
            <div className="mt-8 text-center">
              <p className="text-gray-500 text-sm">
                Need help? Contact us at{' '}
                <a href="mailto:info@rechargetravels.com" className="text-purple-600 underline">
                  info@rechargetravels.com
                </a>{' '}
                or WhatsApp{' '}
                <a href="https://wa.me/94777721999" className="text-purple-600 underline">
                  +94 77 772 1999
                </a>
              </p>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
};

export default OwnerRegister;
